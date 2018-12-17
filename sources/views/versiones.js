import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { versionesService } from "../services/versiones_service";
import VersionesForm from "./versionesForm"

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;
var colUsuarios = [];
var usuarioResult = usuarioService.getSyncUsuarios(usuarioService.getUsuarioCookie());
if (usuarioResult.err) {
    messageApi.errorMessageAjax(usuarioResult.err);
} else {
    colUsuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', usuarioResult.data);
}

webix.editors.editdate = webix.extend({
    render: function (value) {
        var icon = "<span class='mdi mdi-calendar' style='position:absolute; cursor:pointer; top:4px; right:4px;'></span>";
        var node = webix.html.create("div", {
            "class": "webix_dt_editor"
        }, "<input type='date'>" + icon);

        node.childNodes[1].onclick = function () {
            var master = webix.UIManager.getFocus();
            var editor = master.getEditor();

            master.editStop(false);
            var config = master.getColumnConfig(editor.column);
            config.editor = "date";
            master.editCell(editor.row, editor.column);
            config.editor = "editdate";
        }
        return node;
    }
}, webix.editors.text);

export default class Versiones extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarVersiones = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-cube-outline", width: 37, align: "left" },
                { view: "label", label: translate("Versiones") }
            ]
        }
        var pagerVersiones = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.win2.showWindow(null, 0);
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-plus-square", width: 37, align: "left", hotkey: "Ctrl+L",
                    click: () => {
                        var newRow = { id: -1, versionId: 0 };
                        $$('versionesGrid').editStop();
                        var id = $$("versionesGrid").add(newRow);
                        $$("versionesGrid").showItem(id);
                        $$("versionesGrid").edit({
                            row: -1,
                            column: "nombre"
                        });
                        isNewRow = true;
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    click: () => {
                        webix.toExcel($$("versionesGrid"), {
                            filename: "versiones",
                            name: "Versiones",
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
        var datatableVersiones = {
            view: "datatable",
            id: "versionesGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "numVersion", adjust: true, header: [translate("Version"), { content: "numberFilter" }], sort: "number" },
                { id: "usuarioId", header: [translate("Usuario"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUsuarios, width: 200 },
                {
                    id: "fechaCambio", header: [{ text: translate("Fecha cambio"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    editor: "editdate", width: 200, format: webix.i18n.dateFormatStr, sort: "string"
                },
                {
                    id: "fechaEntrega", header: [{ text: translate("Fecha entrega"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    editor: "editdate", width: 200, format: webix.i18n.dateFormatStr, sort: "string"
                },                
                { id: "observaciones", fillspace: true, header: [translate("Observaciones"), { content: "textFilter" }], sort: "string", editor: "text", minWidth: 200 },
                { id: "importePresupuesto", adjust: true, header: [translate("Importe"), { content: "numberFilter" }], sort: "int", format: webix.i18n.priceFormat, css: { 'text-align': 'right' } },
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
                            data = versionesService.checkFormValues(data);
                            if (data.versionId == 0) {
                                versionesService.postVersion(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                        this.$scope.load(result.versionId);
                                        $$('versionesGrid').editStop();
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                versionesService.putVersion(usuarioService.getUsuarioCookie(), data)
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
                pagerVersiones,
                datatableVersiones
            ]
        }
        return _view;
    }
    init(view, url) {
        var ofertaId = this.getParentView()._data.ofertaId;
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.versionId) {
            id = url[0].params.versionId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('versionesGrid').remove(-1);
            return false;
        }, $$('versionesGrid'));
        this.load(ofertaId, id);
        //WindowsView class
        this.win2 = this.ui(VersionesForm);
    }
    load(ofertaId, id) {
        versionesService.getVersionesOferta(usuarioService.getUsuarioCookie(), ofertaId)
            .then((data) => {
                $$("versionesGrid").clearAll();
                $$("versionesGrid").parse(generalApi.prepareDataForDataTableWidthDates("versionId", ['fechaCambio', 'fechaEntrega'], data));
                if (id) {
                    $$("versionesGrid").select(id);
                    $$("versionesGrid").showItem(id);
                }
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }
    edit(id) {
        this.win2.showWindow(null, id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                versionesService.deleteVersion(usuarioService.getUsuarioCookie(), id)
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