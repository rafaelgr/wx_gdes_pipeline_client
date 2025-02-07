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
import { ubicacionesService } from "../services/ubicaciones_service";
import { tiposContratoService } from '../services/tiposContrato_service';
import { serviciosService } from "../services/servicios_service";
import { proyectosCentralService } from "../services/proyectos_central_service";
import OfertasWindow from "./ofertasWindow";

var datosGrid;
var datosOriginales;

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

var colTiposContrato = [];
var tipoContratoResult = tiposContratoService.getSyncTiposContrato(usuarioService.getUsuarioCookie());
if (tipoContratoResult.err) {
    messageApi.errorMessageAjax(tipoContratoResult.err);
} else {
    colTiposContrato = generalApi.prepareDataForCombo('tipoContratoId', 'nombre', tipoContratoResult.data);
}


var colEmpresas = [];
var empresaResult = empresasService.getSyncEmpresas(usuarioService.getUsuarioCookie());
if (empresaResult.err) {
    messageApi.errorMessageAjax(empresaResult.err);
} else {
    colEmpresas = generalApi.prepareDataForCombo('empresaId', 'nombre', empresaResult.data);
}

var colUsuarios = [];
var usuarioResult = usuarioService.getSyncUsuarios(usuarioService.getUsuarioCookie());
if (usuarioResult.err) {
    messageApi.errorMessageAjax(usuarioResult.err);
} else {
    colUsuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', usuarioResult.data);
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

var colUbicaciones = [];
var ubicacionResult = ubicacionesService.getSyncUbicaciones(usuarioService.getUsuarioCookie());
if (ubicacionResult.err) {
    messageApi.errorMessageAjax(ubicacionResult.err);
} else {
    colUbicaciones = generalApi.prepareDataForCombo('ubicacionId', 'nombre', ubicacionResult.data);
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

var colProbabilidades = [];
var probabilidades = [
    { id: 20, value: "20%" },
    { id: 50, value: "50%" },
    { id: 80, value: "80%" },
    { id: 100, value: "100%" }
];
colProbabilidades = generalApi.prepareDataForCombo('id', 'value', probabilidades);

var colServicios = [];
var serviciosResult = serviciosService.getSyncServicios(usuarioService.getUsuarioCookie());
if (serviciosResult.err) {
    messageApi.errorMessageAjax(serviciosResult.err);
} else {
    colServicios = generalApi.prepareDataForCombo('servicioId', 'nombre', serviciosResult.data);
}

var colProyectosCentrales = [];
var proyectoCentralResult = proyectosCentralService.getSyncProyectosCentral(usuarioService.getUsuarioCookie());
if (proyectoCentralResult.err) {
    messageApi.errorMessageAjax(proyectoCentralResult.err);
} else {
    colProyectosCentrales = generalApi.prepareDataForCombo('codigo', 'nombre', proyectoCentralResult.data);
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

// webix.editors.editdate = webix.extend({
//     render:function(){
//     var icon = "<span class='webix_icon mdi mdi-calendar' style='position:absolute; cursor:pointer; top:8px; right:5px;'></span>";
//     var node = webix.html.create("div", {
//           "class":"webix_dt_editor"
//       }, "<input type='text'>"+icon);
    
//     node.childNodes[1].onclick = function(){
//       var master = webix.UIManager.getFocus();
//       var editor = master.getEditor();
      
//       master.editStop(false);
//       var config = master.getColumnConfig(editor.column);
//       config.editor = "date";
//       master.editCell(editor.row, editor.column);
//       config.editor = "editdate";
//     }
//     return node;
//   }
// }, webix.editors.text);


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
                        // Definimos las columnas mapeadas en este contexto
                        const columnasMapeadas = {
                            estadoId: colEstados,
                            proyectoCodigo: colProyectosCentrales,
                            ubicacionId: colUbicaciones,
                            areaId: colAreas,
                            unidadNegocioId: colUnidadesNegocio,
                            paisId: colPaises,
                            faseOfertaId: colFasesOferta,
                            tipoOportunidadId: colTiposOportunidad,
                            tipoContratoId: colTiposContrato,
                            servicioId: colServicios,
                            usuarioId: colUsuarios,
                            responsableId: colUsuarios,
                            usuResponsableId: colUsuarios,
                        };
                
                        // Transformamos los datos para exportar con los valores en vez de los IDs
                        const datosTransformados = this.transformarDatosParaExcel(datosGrid);


                        // if (!this.isColumnHidden($$("ofertasGrid"), "notasEstado")) {
                        //     $$("ofertasGrid").showColumn("notasEstado");// mostramos la columna para incluirla en la exportación
                        // }
                       

                        
                
                
                        // Exportamos a Excel los datos transformados (con los valores)
                        webix.toExcel($$("ofertasGrid"), {
                            data: datosTransformados,  // Datos transformados con valores visuales
                            filename: "ofertas",  // Nombre del archivo Excel
                            name: "Ofertas",  // Nombre de la hoja en Excel
                            rawValues: true,  // Usamos valores puros (sin formato)
                            ignore: { "actions": true },  // Ignorar columnas de acciones si es necesario
                            
                        }).then(() => {
                            // Código a ejecutar cuando la exportación termine
                            // Restauramos los datos en el grid después de la exportación
                             // Primero, comprobar si la columna está oculta
                            this.cargarOfertas(datosOriginales, null);
                            var stateDt = webix.storage.session.get("stateGridOfertas");
                            if(stateDt) this.$$('ofertasGrid').setState(stateDt);
                            webix.storage.session.put("stateGridOfertas", null);
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
                { id: "nombreCorto", header: [translate("Nombre"), { content: "textFilter" }], sort: "string", editor: "text", width: 350 },
                { id: "estadoId", header: [translate("Estado"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colEstados, width: 100 },
                { id: "proyectoCodigo", header: [translate("Proyecto"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colProyectosCentrales, width: 200 },
                {
                    id: "fechaAdjudicacion", header: [{ text: translate("Fecha adjudicación"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    width: 130, format: webix.i18n.dateFormatStr, sort: "date", editor: "editdate"
                },
                { id: "probabilidad", header: [translate("Probabilidad (%)"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colProbabilidades, width: 100 },
                { id: "importePresupuesto", adjust: true, header: [translate("Importe"), { content: "numberFilter" }], sort: "int", format: webix.i18n.priceFormat, css: { 'text-align': 'right' }, width: 100},
                { id: "margenContribucion", header: [translate("Margen (%)"), { content: "numberFilter" }], sort: "int", format: webix.i18n.numberFormat, css: { 'text-align': 'right' }, width: 100 },
                {
                    id: "fechaInicioContrato", header: [{ text: translate("Fecha inicio contrato"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    width: 130, format: webix.i18n.dateFormatStr, sort: "date", editor: "editdate"
                },
                {
                    id: "fechaFinContrato", header: [{ text: translate("Fecha fin contrato"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    width: 130, format: webix.i18n.dateFormatStr, sort: "date", editor: "editdate"
                },
                { id: "duracion", header: [translate("Duración"), { content: "textFilter" }], sort: "string", editor: "text", width: 100 },
                { id: "ubicacionId", header: [translate("Ubicacion"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUbicaciones, width: 200 },
                { id: "cliente", header: [translate("Cliente"), { content: "textFilter" }], sort: "string", editor: "text", width: 150 },
                { id: "paisUbicacion", header: [translate("Pais ubicación"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                { id: "areaId", header: [translate("Area"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colAreas, width: 150 },
                { id: "unidadNegocioId", header: [translate("Unidad de negocio"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUnidadesNegocio, width: 200 },
                { id: "paisId", header: [translate("Pais"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colPaises, width: 100 },
                { id: "faseOfertaId", header: [translate("Fase oferta"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colFasesOferta, width: 200 },
                { id: "tipoOportunidadId", header: [translate("Tipo oportunidad"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colTiposOportunidad, width: 200 },
                { id: "tipoContratoId", header: [translate("Tipo contrato"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colTiposContrato, width: 200 },
                // -- Servicios

                { id: "servicioId", header: [translate("Servicio"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colServicios, width: 200 },
                {
                    id: "fechaCreacion", header: [{ text: translate("Fecha creación"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    width: 130, format: webix.i18n.dateFormatStr, sort: "date", editor: "editdate"
                },
                {
                    id: "fechaEntrega", header: [{ text: translate("Fecha entrega"), css: { "text-align": "center" } }, { content: "textFilter" }],
                    width: 130, format: webix.i18n.dateFormatStr, sort: "date", editor: "editdate"
                },
                { id: "usuarioId", header: [translate("Usuario"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUsuarios, width: 200 },
                { id: "responsableId", header: [translate("Responsable"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUsuarios, width: 200 },
                { id: "usuResponsableId", header: [translate("Supervisado"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUsuarios, width: 200 },
                { id: "numeroPedido", header: [translate("Num. Pedido"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                { id: "notasEstado", header: [translate("Notas sobre versiones de la Oferta"), { content: "textFilter" }], sort: "string", editor: "text", width: 300 },
                { id: "situacionProyecto", header: [translate("Notas sobre cierre de la Oferta"), { content: "textFilter" }], sort: "string", editor: "text", width: 300 },
                { id: "observaciones", header: [translate(" Notas sobre el avance de la Oferta"), { content: "textFilter" }], sort: "string", editor: "text", width: 300 },

                //-- Viejo orden

                // { id: "probabilidad", adjust: true, header: [translate("Probabilidad (%)"), { content: "numberFilter" }], sort: "int", format: webix.i18n.numberFormat, css: { 'text-align': 'right' } },
                // { id: "ubicacion", header: [translate("Ubicación"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                // { id: "empresaId", header: [translate("Empresa"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colEmpresas, width: 200 },
                // { id: "paisUbicacion", header: [translate("Pais ubicación"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                // { id: "descripcion", header: [translate("Descripción"), { content: "textFilter" }], sort: "string", editor: "text", width: 250 },
                // { id: "divisaId", header: [translate("Divisa"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colDivisas, width: 200 },
                // {
                //     id: "fechaEntrega", header: [{ text: translate("Fecha entrega"), css: { "text-align": "center" } }, { content: "textFilter" }],
                //     editor: "editdate", width: 200, format: webix.i18n.dateFormatStr, sort: "string"
                // },
                // { id: "responsableId", header: [translate("Responsable"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUsuarios, width: 200 },
                // { id: "autorizaciones", header: [translate("Autorizaciones"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                // { id: "uteSN", fillspace: true, header: [translate("UTE"), { content: "textFilter" }], template: "{common.checkbox()}", sort: "string", editor: "checkbox", minWidth: 100 },
                // { id: "gdesPor", adjust: true, header: [translate("UTE (%)"), { content: "numberFilter" }], sort: "int", format: webix.i18n.numberFormat, css: { 'text-align': 'right' } },
                // { id: "numeroPedido", header: [translate("Num. Pedido"), { content: "textFilter" }], sort: "string", editor: "text", width: 200 },
                // { id: "competidores", header: [translate("Competidores"), { content: "textFilter" }], sort: "string", editor: "text", width: 250 },
                // { id: "razonPerdidaId", header: [translate("Razón pérdida"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colRazonesPerdida, width: 200 },
                
                { id: "actions", header: [{ text: translate("Acciones"), css: { "text-align": "center" } }], template: editButton + deleteButton, css: { "text-align": "center" } }
            ],
            leftSplit: 3,
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
                            data = ofertasService.corregirFechas(data);
                            if (data.estadoId == 2) {
                                data.probabilidad = 100;
                            }
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
                "onAfterLoad":  () => {
                    /* try {
                        var bool = this.isColumnHidden($$("ofertasGrid"), "notasEstado");
                        if (!bool) {
                            $$("ofertasGrid").hideColumn("notasEstado");// volvemos a ocultar la columna después de la exportación
                        }
                        

                    } catch(e) {

                    } */
                   
                    // Obtener los datos actuales del grid (sin modificaciones)
                    datosGrid = $$("ofertasGrid").serialize();
                
                    // Hacemos una copia profunda de los datos originales para restaurarlos después
                    datosOriginales = JSON.parse(JSON.stringify(datosGrid));  // Copia profunda usando JSON
                },
                "onAfterFilter": function () {
                    var numReg = $$("ofertasGrid").count();
                    $$("OfertasNReg").config.label = "NREG: " + numReg;
                    $$("OfertasNReg").refresh();
                    //guardar filtros
                    webix.storage.session.put("stateGridOfertas", this.getState());
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
    urlChange(view, url) {
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
        webix.storage.session.put("stateGridOfertas", null);//eliminamos qualquier filtro guardado
        $$("ofertasGrid").showProgress({ type: "icon" });
        var usu = usuarioService.getUsuarioCookie();
        if (usu.esAdministrador) {
            ofertasService.getOfertas(usu)
            .then((data) => {
                this.cargarOfertas(data, id);
            })
            .catch((err) => {
                $$("ofertasGrid").hideProgress();
                messageApi.errorMessageAjax(err);
            });
        } else {
            ofertasService.getOfertasUsuario(usu)
            .then((data) => {
                $$("ofertasGrid").hideProgress();
                this.cargarOfertas(data, id);
            })
            .catch((err) => {
                $$("ofertasGrid").hideProgress();
                messageApi.errorMessageAjax(err);
            });
        }

    }
    cargarOfertas(data, id) {
        console.log("Ofertas", data)
        $$("ofertasGrid").clearAll();
        $$("ofertasGrid").parse(generalApi.prepareDataForDataTableWidthDates("ofertaId", ['fechaEntrega', 'fechaAdjudicacion', 'fechaInicioContrato', 'fechaFinContrato', 'fechaCreacion'], data));
        $$("ofertasGrid").sort('#ofertaId#', 'desc', 'int');
        if (id) {
            $$("ofertasGrid").select(id);
            $$("ofertasGrid").showItem(id);
        }
        var numReg = $$("ofertasGrid").count();
        $$("OfertasNReg").config.label = "NREG: " + numReg;
        $$("OfertasNReg").refresh();
        $$("ofertasGrid").hideProgress();
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

    transformarDatosParaExcel(datos) {
        // Mapeo de las columnas con sus colecciones correspondientes
        const columnasMapeadas = {
            estadoId: colEstados,
            proyectoCodigo: colProyectosCentrales,
            ubicacionId: colUbicaciones,
            areaId: colAreas,
            unidadNegocioId: colUnidadesNegocio,
            paisId: colPaises,
            faseOfertaId: colFasesOferta,
            tipoOportunidadId: colTiposOportunidad,
            tipoContratoId: colTiposContrato,
            servicioId: colServicios,
            usuarioId: colUsuarios,
            responsableId: colUsuarios,
            usuResponsableId: colUsuarios,
        };
    
        // Recorremos cada fila de datos y procesamos los IDs
        return datos.map(row => {
            // Recorremos cada columna mapeada
            for (const [columnId, collection] of Object.entries(columnasMapeadas)) {
                if (row[columnId]) {
                    const item = collection.find(item => item.id === row[columnId]);
                    row[columnId] = item ? item.value : row[columnId]; // Reemplazamos el ID con el valor
                }
            }
            
    
            // Devuelven los datos transformados
            return row;
        });
    }
    
    
    isColumnHidden(grid, columnId) {
        const column = grid.getColumnConfig(columnId);
        var bool = column ? column.hidden === true : false;  // Comprobamos si la columna tiene la propiedad 'hidden' en true
        return bool
    }
}





