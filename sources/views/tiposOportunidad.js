import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { tiposOportunidadService } from "../services/tiposOportunidad_service";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;

export default class TiposOportunidad extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarTiposOportunidad = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-shape", width: 37, align: "left" },
                { view: "label", label: translate("Tipos de oportunidad") }
            ]
        }
        var pagerTiposOportunidad = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/tiposOportunidadForm?tipoOportunidadId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-plus-square", width: 37, align: "left", hotkey: "Ctrl+L",
                    click: () => {
                        var newRow = { id: -1, tipoOportunidadId: 0 };
                        $$('tiposOportunidadGrid').editStop();
                        var id = $$("tiposOportunidadGrid").add(newRow);
                        $$("tiposOportunidadGrid").showItem(id);
                        $$("tiposOportunidadGrid").edit({
                            row: -1,
                            column: "nombre"
                        });
                        isNewRow = true;
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    click: () => {
                        webix.toExcel($$("tiposOportunidadGrid"), {
                            filename: "tiposOportunidad",
                            name: "TiposOportunidad",
                            rawValues: true,
                            ignore: { "actions": true }
                        });
                    }
                },
                {},
                {
                    view: "pager", id: "mypager", css: { "text-align": "right" },
                    template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
                    size: 25,
                    group: 5
                }
            ]
        };
        var datatableTiposOportunidad = {
            view: "datatable",
            id: "tiposOportunidadGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "tipoOportunidadId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "nombre", fillspace: true, header: [translate("Nombre tipo de oportunidad"), { content: "textFilter" }], sort: "string", editor: "text" },
                { id: "nombreEN", header: [translate("Nombre Francés"), { content: "textFilter" }], sort: "string", editor: "text", width: 250},
                { id: "nombreFR", header: [translate("Nombre Inglés"), { content: "textFilter" }], sort: "string", editor: "text", width: 250 },
                { id: "actions", header: [{ text: translate("Acciones"), css: { "text-align": "center" } }], template: editButton + deleteButton, css: { "text-align": "center" } }
            ],
            onClick: {
                "onDelete": function (event, id, node) {
                    var dtable = this;
                    var curRow = this.data.pull[id.row];
                    var name = curRow.nombre;
                    this.$scope.delete(id.row, name);
                },
                "onEdit": function (event, id, node) {
                    this.$scope.edit(id.row);
                }
            },
            editable: true,
            editaction: "dblclick",
            rules: {
                "nombre": webix.rules.isNotEmpty,
                "nombreEN": webix.rules.isNotEmpty,
                "nombreFR": webix.rules.isNotEmpty
            },
            on: {
                "onAfterEditStart": function (id) {
                    currentIdDatatableView = id.row;
                    currentRowDatatableView = this.data.pull[currentIdDatatableView];
                },
                "onAfterEditStop": function (state, editor, ignoreUpdate) {
                    var cIndex = this.getColumnIndex(editor.column);
                    var length = this.config.columns.length;
                    if (isNewRow && cIndex != length - 2) return false;
                    if (state.value != state.old) {
                        isNewRow = false;
                        if (!this.validate(currentIdDatatableView)) {
                            messageApi.errorMessage(translate("Valores incorrectos"));
                        } else {
                            currentRowDatatableView = this.data.pull[currentIdDatatableView];
                            // id is not part of the row object
                            delete currentRowDatatableView.id;
                            var data = currentRowDatatableView;
                            if (data.tipoOportunidadId == 0) {
                                tiposOportunidadService.postTipoOportunidad(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {
                                        this.$scope.load(result.tipoOportunidadId);
                                        $$('tiposOportunidadGrid').editStop();
                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                tiposOportunidadService.putTipoOportunidad(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {

                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    })
                            }
                        }
                    }
                },
            }
        }
        var _view = {
            rows: [
                toolbarTiposOportunidad,
                pagerTiposOportunidad,
                datatableTiposOportunidad
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.tipoOportunidadId) {
            id = url[0].params.tipoOportunidadId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('tiposOportunidadGrid').remove(-1);
            return false;
        }, $$('tiposOportunidadGrid'));
        this.load(id);
    }
    load(id) {
        tiposOportunidadService.getTiposOportunidad(usuarioService.getUsuarioCookie())
            .then(data => {
                $$("tiposOportunidadGrid").clearAll();
                $$("tiposOportunidadGrid").parse(generalApi.prepareDataForDataTable("tipoOportunidadId", data));
                if (id) {
                    $$("tiposOportunidadGrid").select(id);
                    $$("tiposOportunidadGrid").showItem(id);
                }
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            })
    }
    edit(id) {
        this.show('/top/tiposOportunidadForm?tipoOportunidadId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                tiposOportunidadService.deleteTipoOportunidad(usuarioService.getUsuarioCookie(), id)
                    .then(result => {
                        self.load();
                    })
                    .catch(err => {
                        messageApi.errorMessageAjax(err);
                    });
            }
        });
    }
}