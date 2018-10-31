import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { divisasService } from "../services/divisas_service";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;

export default class Divisas extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarDivisas = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-currency-eur", width: 37, align: "left" },
                { view: "label", label: translate("Divisas") }
            ]
        }
        var pagerDivisas = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/divisasForm?divisaId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-plus-square", width: 37, align: "left", hotkey: "Ctrl+L",
                    click: () => {
                        var newRow = { id: -1, divisaId: 0 };
                        $$('divisasGrid').editStop();
                        var id = $$("divisasGrid").add(newRow);
                        $$("divisasGrid").showItem(id);
                        $$("divisasGrid").edit({
                            row: -1,
                            column: "nombre"
                        });
                        isNewRow = true;
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    click: () => {
                        webix.toExcel($$("divisasGrid"), {
                            filename: "divisas",
                            name: "Divisas",
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
        var datatableDivisas = {
            view: "datatable",
            id: "divisasGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "divisaId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "nombre", fillspace: true, header: [translate("Nombre divisa"), { content: "textFilter" }], sort: "string", editor: "text" },
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
                "nombre": webix.rules.isNotEmpty
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
                            if (data.divisaId == 0) {
                                divisasService.postDivisa(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {
                                        this.$scope.load(result.divisaId);
                                        $$('divisasGrid').editStop();
                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                divisasService.putDivisa(usuarioService.getUsuarioCookie(), data)
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
                toolbarDivisas,
                pagerDivisas,
                datatableDivisas
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.divisaId) {
            id = url[0].params.divisaId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('divisasGrid').remove(-1);
            return false;
        }, $$('divisasGrid'));
        this.load(id);
    }
    load(id) {
        divisasService.getDivisas(usuarioService.getUsuarioCookie())
            .then(data => {
                $$("divisasGrid").clearAll();
                $$("divisasGrid").parse(generalApi.prepareDataForDataTable("divisaId", data));
                if (id) {
                    $$("divisasGrid").select(id);
                    $$("divisasGrid").showItem(id);
                }
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            })
    }
    edit(id) {
        this.show('/top/divisasForm?divisaId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                divisasService.deleteDivisa(usuarioService.getUsuarioCookie(), id)
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