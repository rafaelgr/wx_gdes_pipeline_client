import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { empresasService } from "../services/empresas_service";
import { paisesService } from "../services/paises_service";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;
var colPaises = [];
var paisResult = paisesService.getSyncPaises(usuarioService.getUsuarioCookie());
if (paisResult.err) {
    messageApi.errorMessageAjax(paisResult.err);
} else {
    colPaises = generalApi.prepareDataForCombo('paisId', 'nombre', paisResult.data);
}



export default class Empresas extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarEmpresas = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-cube", width: 37, align: "left" },
                { view: "label", label: translate("Empresas") }
            ]
        }
        var pagerEmpresas = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/empresasForm?empresaId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-plus-square", width: 37, align: "left", hotkey: "Ctrl+L",
                    click: () => {
                        var newRow = { id: -1, empresaId: 0 };
                        $$('empresasGrid').editStop();
                        var id = $$("empresasGrid").add(newRow);
                        $$("empresasGrid").showItem(id);
                        $$("empresasGrid").edit({
                            row: -1,
                            column: "nombre"
                        });
                        isNewRow = true;
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    click: () => {
                        webix.toExcel($$("empresasGrid"), {
                            filename: "empresas",
                            name: "Empresas",
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
        var datatableEmpresas = {
            view: "datatable",
            id: "empresasGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "empresaId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "nombre", fillspace: true, header: [translate("Nombre empresa"), { content: "textFilter" }], sort: "string", editor: "text" },
                { id: "cod", header: [translate("Código"), { content: "textFilter" }], sort: "string", editor: "text" },
                { id: "paisId", header: [translate("Pais relacionado"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colPaises, width: 200 },
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
                "cod": webix.rules.isNotEmpty,
                "paisId": webix.rules.isNotEmpty
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
                            if (data.empresaId == 0) {
                                empresasService.postEmpresa(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                        this.$scope.load(result.empresaId);
                                        $$('empresasGrid').editStop();
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                empresasService.putEmpresa(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            }
                        }
                    }
                },
            }
        }
        var _view = {
            rows: [
                toolbarEmpresas,
                pagerEmpresas,
                datatableEmpresas
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.empresaId) {
            id = url[0].params.empresaId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('empresasGrid').remove(-1);
            return false;
        }, $$('empresasGrid'));
        this.load(id);
    }
    load(id) {
        empresasService.getEmpresas(usuarioService.getUsuarioCookie())
            .then((data) => {
                $$("empresasGrid").clearAll();
                $$("empresasGrid").parse(generalApi.prepareDataForDataTable("empresaId", data));
                if (id) {
                    $$("empresasGrid").select(id);
                    $$("empresasGrid").showItem(id);
                }
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }
    edit(id) {
        this.show('/top/empresasForm?empresaId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                empresasService.deleteEmpresa(usuarioService.getUsuarioCookie(), id)
                    .then((result) => {
                        self.load();
                    })
                    .catch((err) => {
                        messageApi.errorMessageAjax(err);
                    })
            }

        });
    }
}