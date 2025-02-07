import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { fasesOfertaService } from "../services/fasesOferta_service";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;

export default class FasesOferta extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarFasesOferta = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-filter-variant", width: 37, align: "left" },
                { view: "label", label: translate("Fases de oferta") }
            ]
        }
        var pagerFasesOferta = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/fasesOfertaForm?faseOfertaId=0');
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
                        webix.toExcel($$("fasesOfertaGrid"), {
                            filename: "fasesOferta",
                            name: "FasesOferta",
                            rawValues: true,
                            ignore: { "actions": true }
                        });
                    }
                },
                {
                    view: "label", id: "FasesOfertaNReg", label: "NREG: "
                },
                {
                    view: "pager", id: "mypager", css: { "text-align": "right" },
                    template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
                    size: 25,
                    group: 5
                }
            ]
        };
        var datatableFasesOferta = {
            view: "datatable",
            id: "fasesOfertaGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "faseOfertaId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "nombre", fillspace: true, header: [translate("Nombre fase de oferta"), { content: "textFilter" }], sort: "string", editor: "text" },
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
                            if (data.faseOfertaId == 0) {
                                fasesOfertaService.postFaseOferta(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {
                                        this.$scope.load(result.faseOfertaId);
                                        $$('fasesOfertaGrid').editStop();
                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                fasesOfertaService.putFaseOferta(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {

                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    })
                            }
                        }
                    }
                },
                "onAfterFilter": function () {
                    var numReg = $$("fasesOfertaGrid").count();
                    $$("FasesOfertaNReg").config.label = "NREG: " + numReg;
                    $$("FasesOfertaNReg").refresh();
                }
            }
        }
        var _view = {
            rows: [
                toolbarFasesOferta,
                pagerFasesOferta,
                datatableFasesOferta
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.faseOfertaId) {
            id = url[0].params.faseOfertaId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('fasesOfertaGrid').remove(-1);
            return false;
        }, $$('fasesOfertaGrid'));
        webix.extend($$("fasesOfertaGrid"), webix.ProgressBar);
        this.load(id);
    }
    load(id) {
        $$("fasesOfertaGrid").showProgress();
        fasesOfertaService.getFasesOferta(usuarioService.getUsuarioCookie())
            .then(data => {
                $$("fasesOfertaGrid").clearAll();
                $$("fasesOfertaGrid").parse(generalApi.prepareDataForDataTable("faseOfertaId", data));
                if (id) {
                    $$("fasesOfertaGrid").select(id);
                    $$("fasesOfertaGrid").showItem(id);
                }
                var numReg = $$("fasesOfertaGrid").count();
                $$("FasesOfertaNReg").config.label = "NREG: " + numReg;
                $$("FasesOfertaNReg").refresh();
                $$("fasesOfertaGrid").hideProgress();
            })
            .catch(err => {
                $$("fasesOfertaGrid").hideProgress();
                messageApi.errorMessageAjax(err);
            })
    }
    edit(id) {
        this.show('/top/fasesOfertaForm?faseOfertaId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                fasesOfertaService.deleteFaseOferta(usuarioService.getUsuarioCookie(), id)
                    .then(result => {
                        self.load();
                    })
                    .catch(err => {
                        messageApi.errorMessageAjax(err);
                    });
            }
        });
    }
    cleanAndload() {
        $$("fasesOfertaGrid").eachColumn(function (id, col) {
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