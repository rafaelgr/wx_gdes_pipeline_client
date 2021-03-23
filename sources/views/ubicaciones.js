import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { ubicacionesService } from "../services/ubicaciones_service";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;




export default class Ubicaciones extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarUbicaciones = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-map-marker-outline", width: 37, align: "left" },
                { view: "label", label: translate("Ubicaciones") }
            ]
        }
        var pagerUbicaciones = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/ubicacionesForm?ubicacionId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "mdi mdi-refresh", width: 37, align: "left", hotkey: "Ctrl+L",
                    click: () => {
                        cleanAndload();
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    click: () => {
                        webix.toExcel($$("ubicacionesGrid"), {
                            filename: "ubicaciones",
                            name: "Ubicaciones",
                            rawValues: true,
                            ignore: { "actions": true }
                        });
                    }
                },
                {
                    view: "label", id: "UbicacionesNReg", label: "NREG: "
                },
                {
                    view: "pager", id: "mypager", css: { "text-align": "right" },
                    template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
                    size: 25,
                    group: 5
                }
            ]
        };
        var datatableUbicaciones = {
            view: "datatable",
            id: "ubicacionesGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "ubicacionId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "nombre", fillspace: true, header: [translate("Nombre ubicacion"), { content: "textFilter" }], sort: "string", editor: "text" },
                { id: "latitud", adjust: true, header: [translate("Latitud"), { content: "numberFilter" }], sort: "int", css: { 'text-align': 'right' }, editor: "text", width: 300},
                { id: "longitud", adjust: true, header: [translate("Longitud"), { content: "numberFilter" }], sort: "int", css: { 'text-align': 'right' }, editor: "text", width: 300 },
                { id: "paisUbicacion", adjust: true, header: [translate("Pais ubicación"), { content: "textFilter" }], sort: "string", css: { 'text-align': 'right' }, editor: "text", width: 300 },
                { id: "cpUbicacion", adjust: true, header: [translate("CP"), { content: "textFilter" }], sort: "string", css: { 'text-align': 'right' }, editor: "text" },
                // { id: "latitud", fillspace: true, header: [translate("Latitud"), { content: "textFilter" }], sort: "string", editor: "text" },
                // { id: "longitud", fillspace: true, header: [translate("Longitud"), { content: "textFilter" }], sort: "string", editor: "text" },
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
                            if (data.ubicacionId == 0) {
                                ubicacionesService.postUbicacion(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                        this.$scope.load(result.ubicacionId);
                                        $$('ubicacionesGrid').editStop();
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                ubicacionesService.putUbicacion(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            }
                        }
                    }
                },
                "onAfterFilter": function () {
                    var numReg = $$("ubicacionesGrid").count();
                    $$("UbicacionesNReg").config.label = "NREG: " + numReg;
                    $$("UbicacionesNReg").refresh();
                }
            }
        }
        var _view = {
            rows: [
                toolbarUbicaciones,
                pagerUbicaciones,
                datatableUbicaciones
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.ubicacionId) {
            id = url[0].params.ubicacionId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('ubicacionesGrid').remove(-1);
            return false;
        }, $$('ubicacionesGrid'));
        webix.extend($$("ubicacionesGrid"), webix.ProgressBar);
        this.load(id);
    }
    load(id) {
        $$("ubicacionesGrid").showProgress();
        ubicacionesService.getUbicaciones(usuarioService.getUsuarioCookie())
            .then((data) => {
                $$("ubicacionesGrid").clearAll();
                $$("ubicacionesGrid").parse(generalApi.prepareDataForDataTable("ubicacionId", data));
                if (id) {
                    $$("ubicacionesGrid").select(id);
                    $$("ubicacionesGrid").showItem(id);
                }
                var numReg = $$("ubicacionesGrid").count();
                $$("UbicacionesNReg").config.label = "NREG: " + numReg;
                $$("UbicacionesNReg").refresh();
                $$("ubicacionesGrid").hideProgress();
            })
            .catch((err) => {
                $$("ubicacionesGrid").hideProgress();
                messageApi.errorMessageAjax(err);
            });
    }
    edit(id) {
        this.show('/top/ubicacionesForm?ubicacionId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                ubicacionesService.deleteUbicacion(usuarioService.getUsuarioCookie(), id)
                    .then((result) => {
                        self.load();
                    })
                    .catch((err) => {
                        messageApi.errorMessageAjax(err);
                    })
            }

        });
    }
    cleanAndload() {
        $$("ubicacionesGrid").eachColumn(function (id, col) {
            if (col.id == 'actions') return;
            var filter = this.getFilter(id);
            if (filter) {
                if (filter.setValue) filter.setValue("")	// suggest-based filters 
                else filter.value = "";					// html-based: select & text
            }
        });
        this.load();
    }
}