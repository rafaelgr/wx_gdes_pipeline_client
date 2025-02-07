import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { areasService } from "../services/areas_service";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;
var colUnidadesNegocio = [];
var unidadNegocioResult = unidadesNegocioService.getSyncUnidadesNegocio(usuarioService.getUsuarioCookie());
if (unidadNegocioResult.err) {
    messageApi.errorMessageAjax(unidadNegocioResult.err);
} else {
    colUnidadesNegocio = generalApi.prepareDataForCombo('unidadNegocioId', 'nombre', unidadNegocioResult.data);
}



export default class Areas extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarAreas = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-cube-outline", width: 37, align: "left" },
                { view: "label", label: translate("Areas") }
            ]
        }
        var pagerAreas = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/areasForm?areaId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "mdi mdi-refresh", width: 37, align: "left", hotkey: "Ctrl+L",
                    click: () => {
                        this.cleanAndload();
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    click: () => {
                        webix.toExcel($$("areasGrid"), {
                            filename: "areas",
                            name: "Areas",
                            rawValues: true,
                            ignore: { "actions": true }
                        });
                    }
                },
                {
                    view: "label", id: "AreasNReg", label: "NREG: "
                },
                {
                    view: "pager", id: "mypager", css: { "text-align": "right" },
                    template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
                    size: 25,
                    group: 5
                }
            ]
        };
        var datatableAreas = {
            view: "datatable",
            id: "areasGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "areaId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "nombre", fillspace: true, header: [translate("Nombre area"), { content: "textFilter" }], sort: "string", editor: "text", minWidth: 200 },
                { id: "cod", header: [translate("Código"), { content: "textFilter" }], sort: "string", editor: "text" },
                { id: "orden", header: [translate("Orden"), { content: "numberFilter" }], sort: "string", editor: "text" },
                { id: "nombreEN", header: [translate("Nombre Inglés"), { content: "textFilter" }], sort: "string", editor: "text", width:250 },
                { id: "nombreFR", header: [translate("Nombre Francés"), { content: "textFilter" }], sort: "string", editor: "text", width:250 },
                { id: "unidadNegocioId", header: [translate("Unidad de negocio"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUnidadesNegocio, width: 200 },
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
                "nombreEN": webix.rules.isNotEmpty,
                "nombreFR": webix.rules.isNotEmpty,
                "unidadNegocioId": webix.rules.isNotEmpty
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
                            data = areasService.checkFormValues(data);
                            if (data.areaId == 0) {
                                areasService.postArea(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                        this.$scope.load(result.areaId);
                                        $$('areasGrid').editStop();
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                areasService.putArea(usuarioService.getUsuarioCookie(), data)
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
                    var numReg = $$("areasGrid").count();
                    $$("AreasNReg").config.label = "NREG: " + numReg;
                    $$("AreasNReg").refresh();
                }
            }
        }
        var _view = {
            rows: [
                toolbarAreas,
                pagerAreas,
                datatableAreas
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.areaId) {
            id = url[0].params.areaId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('areasGrid').remove(-1);
            return false;
        }, $$('areasGrid'));
        webix.extend($$("areasGrid"), webix.ProgressBar);
        this.load(id);
    }
    load(id) {
        $$("areasGrid").showProgress();
        areasService.getAreas(usuarioService.getUsuarioCookie())
            .then((data) => {
                $$("areasGrid").clearAll();
                $$("areasGrid").parse(generalApi.prepareDataForDataTable("areaId", data));
                if (id) {
                    $$("areasGrid").select(id);
                    $$("areasGrid").showItem(id);
                }
                var numReg = $$("areasGrid").count();
                $$("AreasNReg").config.label = "NREG: " + numReg;
                $$("AreasNReg").refresh();
                $$("areasGrid").hideProgress();                
            })
            .catch((err) => {
                $$("areasGrid").hideProgress();                
                messageApi.errorMessageAjax(err);
            });
    }
    edit(id) {
        this.show('/top/areasForm?areaId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                areasService.deleteArea(usuarioService.getUsuarioCookie(), id)
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
        $$("areasGrid").eachColumn(function (id, col) {
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