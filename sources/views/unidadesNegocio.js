import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;

export default class UnidadesNegocio extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarUnidadesNegocio = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-cube-scan", width: 37, align: "left" },
                { view: "label", label: translate("Unidades de negocio") }
            ]
        }
        var pagerUnidadesNegocio = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/unidadesNegocioForm?unidadNegocioId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-plus-square", width: 37, align: "left", hotkey: "Ctrl+L",
                    click: () => {
                        var newRow = { id: -1, unidadNegocioId: 0 };
                        $$('unidadesNegocioGrid').editStop();
                        var id = $$("unidadesNegocioGrid").add(newRow);
                        $$("unidadesNegocioGrid").showItem(id);
                        $$("unidadesNegocioGrid").edit({
                            row: -1,
                            column: "nombre"
                        });
                        isNewRow = true;
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    click: () => {
                        webix.toExcel($$("unidadesNegocioGrid"), {
                            filename: "unidadesNegocio",
                            name: "UnidadesNegocio",
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
        var datatableUnidadesNegocio = {
            view: "datatable",
            id: "unidadesNegocioGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "unidadNegocioId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "nombre", fillspace: true, header: [translate("Nombre unidad de negocio"), { content: "textFilter" }], sort: "string", editor: "text" },
                { id: "nombreEN", header: [translate("Nombre Inglés"), { content: "textFilter" }], sort: "string", editor: "text", width: 250},
                { id: "nombreFR", header: [translate("Nombre Francés"), { content: "textFilter" }], sort: "string", editor: "text", width: 250 },
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
                            if (data.unidadNegocioId == 0) {
                                unidadesNegocioService.postUnidadNegocio(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {
                                        this.$scope.load(result.unidadNegocioId);
                                        $$('unidadesNegocioGrid').editStop();
                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                unidadesNegocioService.putUnidadNegocio(usuarioService.getUsuarioCookie(), data)
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
                toolbarUnidadesNegocio,
                pagerUnidadesNegocio,
                datatableUnidadesNegocio
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.unidadNegocioId) {
            id = url[0].params.unidadNegocioId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('unidadesNegocioGrid').remove(-1);
            return false;
        }, $$('unidadesNegocioGrid'));
        this.load(id);
    }
    load(id) {
        unidadesNegocioService.getUnidadesNegocio(usuarioService.getUsuarioCookie())
            .then(data => {
                $$("unidadesNegocioGrid").clearAll();
                $$("unidadesNegocioGrid").parse(generalApi.prepareDataForDataTable("unidadNegocioId", data));
                if (id) {
                    $$("unidadesNegocioGrid").select(id);
                    $$("unidadesNegocioGrid").showItem(id);
                }
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            })
    }
    edit(id) {
        this.show('/top/unidadesNegocioForm?unidadNegocioId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                unidadesNegocioService.deleteUnidadNegocio(usuarioService.getUsuarioCookie(), id)
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