import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { ofertasHitosService } from "../services/ofertasHitos_service";
import { divisasService } from "../services/divisas_service";
import OfertasHitosWindow from './ofertasHitosWindow'


var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;

var _ofertaId = 0;

var colDivisas = [];
var divisaResult = divisasService.getSyncDivisas(usuarioService.getUsuarioCookie());
if (divisaResult.err) {
    messageApi.errorMessageAjax(divisaResult.err);
} else {
    colDivisas = generalApi.prepareDataForCombo('divisaId', 'nombre', divisaResult.data);
}

export default class OfertasHitos extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarOfertasHitos = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-calendar-clock", width: 37, align: "left" },
                { view: "label", label: translate("Oferta hitos de facturación") }
            ]
        }
        var pagerOfertasHitos = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.win3.showWindow(_ofertaId, 0);
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
                        webix.toExcel($$("ofertasHitosGrid"), {
                            filename: "divisas",
                            name: "OfertasHitos",
                            rawValues: true,
                            ignore: { "actions": true }
                        });
                    }
                },
                {
                    view: "label", id: "OfertasHitosNReg", label: "NREG: "
                },
                {
                    view: "pager", id: "mypagerOfHitos", css: { "text-align": "right" },
                    template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
                    size: 25,
                    group: 5
                }
            ]
        };
        var datatableOfertasHitos = {
            view: "datatable",
            id: "ofertasHitosGrid",
            pager: "mypagerOfHitos",
            select: "row",
            columns: [
                { id: "ofertaHitoId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                {
                    id: "fecha", header: [{ text: translate("Fecha"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    editor: "editdate", width: 200, format: webix.i18n.dateFormatStr, sort: "string"
                },
                { id: "importeDivisa", adjust: true, header: [translate("Importe divisa"), { content: "numberFilter" }], sort: "int", format: webix.i18n.numberFormat, css: { 'text-align': 'right' } },
                { id: "divisaId", fillspace: true, header: [translate("Divisa"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colDivisas},
                { id: "importe", adjust: true, header: [translate("Importe"), { content: "numberFilter" }], sort: "int", format: webix.i18n.priceFormat, css: { 'text-align': 'right' } },
                { id: "actions", header: [{ text: translate("Acciones"), css: { "text-align": "center" } }], template: editButton + deleteButton, css: { "text-align": "center" } }
            ],
            onClick: {
                "onDelete": function (event, id, node) {
                    var curRow = this.data.pull[id.row];
                    var name = webix.i18n.dateFormatStr(curRow.fecha) + " " + webix.i18n.priceFormat(curRow.importe);
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
                                ofertasHitosService.postDivisa(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {
                                        this.$scope.load(result.divisaId);
                                        $$('ofertasHitosGrid').editStop();
                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                ofertasHitosService.putDivisa(usuarioService.getUsuarioCookie(), data)
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
                    var numReg = $$("ofertasHitosGrid").count();
                    $$("OfertasHitosNReg").config.label = "NREG: " + numReg;
                    $$("OfertasHitosNReg").refresh();
                }
            }
        }
        var _view = {
            rows: [
                toolbarOfertasHitos,
                pagerOfertasHitos,
                datatableOfertasHitos
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var ofertaId = this.getParentView()._data.ofertaId;
        _ofertaId = ofertaId;
        this.win3 = this.ui(OfertasHitosWindow);
        this.load(ofertaId);
    }
    load(id) {
        ofertasHitosService.getOfertasHitosOferta(usuarioService.getUsuarioCookie(), id)
            .then(data => {
                data = ofertasHitosService.prepareData(data);
                $$("ofertasHitosGrid").clearAll();
                $$("ofertasHitosGrid").parse(generalApi.prepareDataForDataTable("ofertaHitoId", data));
                var numReg = $$("ofertasHitosGrid").count();
                $$("OfertasHitosNReg").config.label = "NREG: " + numReg;
                $$("OfertasHitosNReg").refresh();
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            })
    }
    edit(id) {
        this.win3.showWindow(_ofertaId, id);

    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                ofertasHitosService.deleteOfertaHito(usuarioService.getUsuarioCookie(), id)
                    .then(result => {
                        self.load(_ofertaId);
                    })
                    .catch(err => {
                        messageApi.errorMessageAjax(err);
                    });
            }
        });
    }
    cleanAndload() {
        $$("ofertasHitosGrid").eachColumn(function (id, col) {
            if (col.id == 'actions') return;
            var filter = this.getFilter(id);
            if (filter) {
                if (filter.setValue) filter.setValue("")	// suggest-based filters 
                else filter.value = "";					// html-based: select & text
            }
        });
        this.load(_ofertaId);
    }
}