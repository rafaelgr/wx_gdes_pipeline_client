import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { seguidoresService } from "../services/seguidores_service";
import SeguidoresWindow from './seguidoresWindow'


var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;

var _ofertaId = 0;

var colUsuarios = [];
var usuarioResult = usuarioService.getSyncUsuarios(usuarioService.getUsuarioCookie());
if (usuarioResult.err) {
    messageApi.errorMessageAjax(usuarioResult.err);
} else {
    colUsuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', usuarioResult.data);
}

export default class Seguidores extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarSeguidores = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-account-arrow-left", width: 37, align: "left" },
                { view: "label", label: translate("Seguidores de la oferta") }
            ]
        }
        var pagerSeguidores = {
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
                        webix.toExcel($$("seguidoresGrid"), {
                            filename: "divisas",
                            name: "Seguidores",
                            rawValues: true,
                            ignore: { "actions": true }
                        });
                    }
                },
                {
                    view: "label", id: "SeguidoresNReg", label: "NREG: "
                },
                {
                    view: "pager", id: "mypagerOfSeguidores", css: { "text-align": "right" },
                    template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
                    size: 25,
                    group: 5
                }
            ]
        };
        var datatableSeguidores = {
            view: "datatable",
            id: "seguidoresGrid",
            pager: "mypagerOfSeguidores",
            select: "row",
            columns: [
                { id: "seguidorId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "usuarioId", fillspace: true, header: [translate("Seguidor"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUsuarios},
                { id: "actions", header: [{ text: translate("Acciones"), css: { "text-align": "center" } }], template: deleteButton, css: { "text-align": "center" } }
            ],
            onClick: {
                "onDelete": function (event, id, node) {
                    var curRow = this.data.pull[id.row];
                    var name = "Seguidor " + curRow.seguidorId;
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
                                seguidoresService.postDivisa(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {
                                        this.$scope.load(result.divisaId);
                                        $$('seguidoresGrid').editStop();
                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                seguidoresService.putDivisa(usuarioService.getUsuarioCookie(), data)
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
                    var numReg = $$("seguidoresGrid").count();
                    $$("SeguidoresNReg").config.label = "NREG: " + numReg;
                    $$("SeguidoresNReg").refresh();
                }
            }
        }
        var _view = {
            rows: [
                toolbarSeguidores,
                pagerSeguidores,
                datatableSeguidores
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var ofertaId = this.getParentView()._data.ofertaId;
        _ofertaId = ofertaId;
        this.win3 = this.ui(SeguidoresWindow);
        this.load(ofertaId);
    }
    load(id) {
        seguidoresService.getSeguidoresOferta(usuarioService.getUsuarioCookie(), id)
            .then(data => {
                data = seguidoresService.prepareData(data);
                $$("seguidoresGrid").clearAll();
                $$("seguidoresGrid").parse(generalApi.prepareDataForDataTable("seguidorId", data));
                var numReg = $$("seguidoresGrid").count();
                $$("SeguidoresNReg").config.label = "NREG: " + numReg;
                $$("SeguidoresNReg").refresh();
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
                seguidoresService.deleteSeguidor(usuarioService.getUsuarioCookie(), id)
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
        $$("seguidoresGrid").eachColumn(function (id, col) {
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