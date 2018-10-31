import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { estadosService } from "../services/estados_service";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;

export default class Estados extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarEstados = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-thumbs-up-down", width: 37, align: "left" },
                { view: "label", label: translate("Tipos de estado") }
            ]
        }
        var pagerEstados = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/estadosForm?estadoId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-plus-square", width: 37, align: "left", hotkey: "Ctrl+L",
                    click: () => {
                        var newRow = { id: -1, estadoId: 0 };
                        $$('estadosGrid').editStop();
                        var id = $$("estadosGrid").add(newRow);
                        $$("estadosGrid").showItem(id);
                        $$("estadosGrid").edit({
                            row: -1,
                            column: "nombre"
                        });
                        isNewRow = true;
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    click: () => {
                        webix.toExcel($$("estadosGrid"), {
                            filename: "estados",
                            name: "Estados",
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
        var datatableEstados = {
            view: "datatable",
            id: "estadosGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "estadoId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "nombre", fillspace: true, header: [translate("Nombre estado"), { content: "textFilter" }], sort: "string", editor: "text" },
                { id: "orden", header: [translate("Orden"), { content: "numberFilter" }], sort: "string", editor: "text" },
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
                            if (data.estadoId == 0) {
                                estadosService.postEstado(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {
                                        this.$scope.load(result.estadoId);
                                        $$('estadosGrid').editStop();
                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                estadosService.putEstado(usuarioService.getUsuarioCookie(), data)
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
                toolbarEstados,
                pagerEstados,
                datatableEstados
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.estadoId) {
            id = url[0].params.estadoId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('estadosGrid').remove(-1);
            return false;
        }, $$('estadosGrid'));
        this.load(id);
    }
    load(id) {
        estadosService.getEstados(usuarioService.getUsuarioCookie())
            .then(data => {
                $$("estadosGrid").clearAll();
                $$("estadosGrid").parse(generalApi.prepareDataForDataTable("estadoId", data));
                if (id) {
                    $$("estadosGrid").select(id);
                    $$("estadosGrid").showItem(id);
                }
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            })
    }
    edit(id) {
        this.show('/top/estadosForm?estadoId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                estadosService.deleteEstado(usuarioService.getUsuarioCookie(), id)
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