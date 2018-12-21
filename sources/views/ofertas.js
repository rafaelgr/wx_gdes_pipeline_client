import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { ofertasService } from "../services/ofertas_service";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";
import { empresasService } from "../services/empresas_service";
import { paisesService } from "../services/paises_service";
import { fasesOfertaService } from "../services/fasesOferta_service";
import { tiposOportunidadService } from "../services/tiposOportunidad_service";
import { areasService } from "../services/areas_service";
import { estadosService } from "../services/estados_service";
import { divisasService } from "../services/divisas_service";
import { languageService } from "../locales/language_service";
import { razonesPerdidaService } from "../services/razonesPerdida_service";
import OfertasWindow from "./ofertasWindow";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";

var currentIdDatatableView;
var currentRowDatatableView;

var isNewRow = false;
var colUnidadesNegocio = [];
var unidadNegocioResult = unidadesNegocioService.getSyncUnidadesNegocio(usuarioService.getUsuarioCookie());
if (unidadNegocioResult.err) {
    messageApi.errorMessageAjax(unidadNegocioResult.err);
} else {
    colUnidadesNegocio = generalApi.prepareDataForCombo('unidadNegocioId', 'nombre', unidadNegocioResult.data);
}

var colEmpresas = [];
var empresaResult = empresasService.getSyncEmpresas(usuarioService.getUsuarioCookie());
if (empresaResult.err) {
    messageApi.errorMessageAjax(empresaResult.err);
} else {
    colEmpresas = generalApi.prepareDataForCombo('empresaId', 'nombre', empresaResult.data);
}


var colPaises = [];
var paisResult = paisesService.getSyncPaises(usuarioService.getUsuarioCookie());
if (paisResult.err) {
    messageApi.errorMessageAjax(paisResult.err);
} else {
    colPaises = generalApi.prepareDataForCombo('paisId', 'nombre', paisResult.data);
}

var colFasesOferta = [];
var faseOfertaResult = fasesOfertaService.getSyncFasesOferta(usuarioService.getUsuarioCookie());
if (faseOfertaResult.err) {
    messageApi.errorMessageAjax(faseOfertaResult.err);
} else {
    colFasesOferta = generalApi.prepareDataForCombo('faseOfertaId', 'nombre', faseOfertaResult.data);
}

var colTiposOportunidad = [];
var tipoOportunidadResult = tiposOportunidadService.getSyncTiposOportunidad(usuarioService.getUsuarioCookie());
if (tipoOportunidadResult.err) {
    messageApi.errorMessageAjax(tipoOportunidadResult.err);
} else {
    colTiposOportunidad = generalApi.prepareDataForCombo('tipoOportunidadId', 'nombre', tipoOportunidadResult.data);
}

var colAreas = [];
var areaResult = areasService.getSyncAreas(usuarioService.getUsuarioCookie());
if (areaResult.err) {
    messageApi.errorMessageAjax(areaResult.err);
} else {
    colAreas = generalApi.prepareDataForCombo('areaId', 'nombre', areaResult.data);
}

var colEstados = [];
var estadoResult = estadosService.getSyncEstados(usuarioService.getUsuarioCookie());
if (estadoResult.err) {
    messageApi.errorMessageAjax(estadoResult.err);
} else {
    colEstados = generalApi.prepareDataForCombo('estadoId', 'nombre', estadoResult.data);
}

var colDivisas = [];
var divisaResult = divisasService.getSyncDivisas(usuarioService.getUsuarioCookie());
if (divisaResult.err) {
    messageApi.errorMessageAjax(divisaResult.err);
} else {
    colDivisas = generalApi.prepareDataForCombo('divisaId', 'nombre', divisaResult.data);
}

var colUsuarios = [];
var usuarioResult = usuarioService.getSyncUsuarios(usuarioService.getUsuarioCookie());
if (usuarioResult.err) {
    messageApi.errorMessageAjax(usuarioResult.err);
} else {
    colUsuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', usuarioResult.data);
}

var colRazonesPerdida = [];
var razonPerdidaResult = razonesPerdidaService.getSyncRazonesPerdida(usuarioService.getUsuarioCookie());
if (razonPerdidaResult.err) {
    messageApi.errorMessageAjax(razonPerdidaResult.err);
} else {
    colRazonesPerdida = generalApi.prepareDataForCombo('razonPerdidaId', 'nombre', razonPerdidaResult.data);
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



export default class Ofertas extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarOfertas = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-arrow-decision-outline", width: 37, align: "left" },
                { view: "label", label: translate("Ofertas") }
            ]
        }
        var pagerOfertas = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/ofertasForm?ofertaId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-plus-square", width: 37, align: "left", hotkey: "Ctrl+M",
                    click: () => {
                        this.ofertasWindow.showWindow();
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
                        webix.toExcel($$("ofertasGrid"), {
                            filename: "ofertas",
                            name: "Ofertas",
                            rawValues: true,
                            ignore: { "actions": true }
                        });
                    }
                },
                {
                    view: "label", id: "OfertasNReg", label: "NREG: "
                },
                {
                    view: "pager", id: "mypager", css: { "text-align": "right" },
                    template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
                    size: 25,
                    group: 5
                }
            ]
        };
        var datatableOfertas = {
            view: "datatable",
            id: "ofertasGrid",
            select: "row",
            //pager: "mypager",
            navigation: true,
            columns: [
                { id: "ofertaId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "int" },
                { id: "numeroOferta", header: [translate("Nr. Oferta"), { content: "textFilter" }], sort: "string", editor: "text", minWidth: 100 },
                { id: "empresaId", header: [translate("Empresa"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colEmpresas, width: 200 },
                { id: "paisId", header: [translate("Pais"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colPaises, width: 200 },
                { id: "faseOfertaId", header: [translate("Fase oferta"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colFasesOferta, width: 200 },
                { id: "tipoOportunidadId", header: [translate("Tipo oportunidad"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colTiposOportunidad, width: 200 },
                { id: "areaId", header: [translate("Area"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colAreas, width: 200 },
                { id: "ubicacion", header: [translate("Ubicación"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                { id: "paisUbicacion", header: [translate("Pais ubicación"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                { id: "cliente", header: [translate("Cliente"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                { id: "nombreCorto", header: [translate("Nombre"), { content: "textFilter" }], sort: "string", editor: "text", width: 250 },
                { id: "descripcion", header: [translate("Descripción"), { content: "textFilter" }], sort: "string", editor: "text", width: 250 },
                { id: "estadoId", header: [translate("Estado"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colEstados, width: 200 },
                { id: "importePresupuesto", adjust: true, header: [translate("Importe"), { content: "numberFilter" }], sort: "int", format: webix.i18n.priceFormat, css: { 'text-align': 'right' } },
                { id: "divisaId", header: [translate("Divisa"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colDivisas, width: 200 },
                { id: "margenContribucion", adjust: true, header: [translate("Margen (%)"), { content: "numberFilter" }], sort: "int", format: webix.i18n.numberFormat, css: { 'text-align': 'right' } },
                {
                    id: "fechaEntrega", header: [{ text: translate("Fecha entrega"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    editor: "editdate", width: 200, format: webix.i18n.dateFormatStr, sort: "string"
                },
                { id: "responsableId", header: [translate("Responsable"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUsuarios, width: 200 },
                { id: "autorizaciones", header: [translate("Autorizaciones"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                { id: "uteSN", fillspace: true, header: [translate("UTE"), { content: "textFilter" }], template: "{common.checkbox()}", sort: "string", editor: "checkbox", minWidth: 100 },
                { id: "gdesPor", adjust: true, header: [translate("UTE (%)"), { content: "numberFilter" }], sort: "int", format: webix.i18n.numberFormat, css: { 'text-align': 'right' } },
                { id: "numeroPedido", header: [translate("Num. Pedido"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                { id: "competidores", header: [translate("Competidores"), { content: "textFilter" }], sort: "string", editor: "text", width: 250 },
                { id: "probabilidad", adjust: true, header: [translate("Probabilidad (%)"), { content: "numberFilter" }], sort: "int", format: webix.i18n.numberFormat, css: { 'text-align': 'right' } },
                {
                    id: "fechaAdjudicacion", header: [{ text: translate("Fecha adjudicación"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    editor: "editdate", width: 200, format: webix.i18n.dateFormatStr, sort: "string"
                },
                {
                    id: "fechaInicioContrato", header: [{ text: translate("Fecha inicio contrato"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    editor: "editdate", width: 200, format: webix.i18n.dateFormatStr, sort: "string"
                },
                {
                    id: "fechaFinContrato", header: [{ text: translate("Fecha fin contrato"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    editor: "editdate", width: 200, format: webix.i18n.dateFormatStr, sort: "string"
                },
                { id: "duracion", header: [translate("Duración"), { content: "textFilter" }], sort: "string", editor: "text", width: 250 },
                { id: "razonPerdidaId", header: [translate("Razón pérdida"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colRazonesPerdida, width: 200 },
                { id: "unidadNegocioId", header: [translate("Unidad de negocio"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUnidadesNegocio, width: 200 },
                { id: "actions", header: [{ text: translate("Acciones"), css: { "text-align": "center" } }], template: editButton + deleteButton, css: { "text-align": "center" } }
            ],
            rightSplit: 1,
            onClick: {
                "onDelete": function (event, id, node) {
                    var dtable = this;
                    var curRow = this.data.pull[id.row];
                    var name = curRow.nombreCorto;
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
                            data = ofertasService.cleanData(data);
                            if (data.ofertaId == 0) {
                                ofertasService.postOferta(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                        this.$scope.load(result.ofertaId);
                                        $$('ofertasGrid').editStop();
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                ofertasService.putOferta(usuarioService.getUsuarioCookie(), data)
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
                    var numReg = $$("ofertasGrid").count();
                    $$("OfertasNReg").config.label = "NREG: " + numReg;
                    console.log("NREG ", $$("OfertasNReg"));
                    $$("OfertasNReg").refresh();
                }
            }
        }
        var _view = {
            rows: [
                toolbarOfertas,
                pagerOfertas,
                datatableOfertas
            ]
        }
        return _view;
    }
    init(view, url) {
        this.ofertasWindow = this.ui(OfertasWindow);
    }
    urlChange(view, url){
        var usu = usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.ofertaId) {
            id = url[0].params.ofertaId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('ofertasGrid').remove(-1);
            return false;
        }, $$('ofertasGrid'));
        webix.extend($$("ofertasGrid"), webix.ProgressBar);
        this.load(id);
        languageService.setLanguage(this.app, usu.codigoIdioma);
    }
    load(id) {
        $$("ofertasGrid").showProgress({type:"icon"});
        
        ofertasService.getOfertas(usuarioService.getUsuarioCookie())
            .then((data) => {
                $$("ofertasGrid").clearAll();
                $$("ofertasGrid").parse(generalApi.prepareDataForDataTableWidthDates("ofertaId", ['fechaEntrega', 'fechaAdjudicacion', 'fechaInicioContrato', 'fechaFinContrato'], data));
                $$("ofertasGrid").sort('#ofertaId#','desc','int');
                if (id) {
                    $$("ofertasGrid").select(id);
                    $$("ofertasGrid").showItem(id);
                }
                var numReg = $$("ofertasGrid").count();
                $$("OfertasNReg").config.label = "NREG: " + numReg;
                $$("OfertasNReg").refresh();
                $$("ofertasGrid").hideProgress();

            })
            .catch((err) => {
                $$("ofertasGrid").hideProgress();
                messageApi.errorMessageAjax(err);
            });
    }
    edit(id) {
        this.show('/top/ofertasForm?ofertaId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                ofertasService.deleteOferta(usuarioService.getUsuarioCookie(), id)
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
        $$("ofertasGrid").eachColumn(function (id, col) {
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