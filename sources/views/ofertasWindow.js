import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";
import { ofertasService } from "../services/ofertas_service";
import { areasService } from "../services/areas_service";
import { empresasService } from "../services/empresas_service";
import { paisesService } from "../services/paises_service";
import { serviciosService } from "../services/servicios_service";
import { fasesOfertaService } from "../services/fasesOferta_service";
import { tiposOportunidadService } from "../services/tiposOportunidad_service";
import { tiposContratoService } from "../services/tiposContrato_service";
import { estadosService } from "../services/estados_service";
import { parametrosService } from "../services/parametros_service";
import { versionesService } from "../services/versiones_service";
import { generalApi } from "../utilities/general";
import { messageApi } from "../utilities/messages";
import { ubicacionesService } from '../services/ubicaciones_service';
import { divisasService } from "../services/divisas_service"
import { razonesPerdidaService } from "../services/razonesPerdida_service";

var ofertaId = 0;

export default class OfertasWindow extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view1 = {
            view: "layout",
            id: "ofertasFormWindow",
            minHeight:800,
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-cube-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Nueva oferta") }
                    ]
                },
                {
                    view: "form",
                    scroll: true,
                    id: "frmOfertasWindow",
                    elements: [
                        {
                            cols:[
                                { view: "textarea", name: "descripcion", label: translate("Título del contrato"), required: true, labelPosition: "top" },
                                {
                                    rows: [
                                        {
                                            cols: [
                                                { view: "text", name: "nombreCorto", label: translate("Nombre resumen"), required: true, labelPosition: "top" },
                                                { view: "text", name: "cliente", label: translate("Cliente"), required: true, labelPosition: "top" },
                                            ]
                                        },
                                        {
                                            cols: [
                                                { view: "combo", id: "cmbUicacionW", name: "ubicacionId", required: true, options: {}, label: translate("Ubicacion"), labelPosition: "top" },
                                                { view: "text", name: "paisUbicacion", label: translate("Pais Ubicación"), labelPosition: "top", required: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "periodo", label: translate("Periodo"), labelPosition: "top" },
                                { view: "text", name: "numeroLicitacion", label: translate("Nr. Licitación"), labelPosition: "top" },
                                { view: "text", name: "implicaTecnologico", label: translate("¿Implica desarrollo tecnológico?"), labelPosition: "top" },
                            ]
                        },
                        {
                            cols: [
                                { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaEntrega", required: true, label: translate("Fecha entrega"), labelPosition: "top" },
                                { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaAdjudicacion", required: true, label: translate("Fecha adjudicación"), labelPosition: "top" },
                                { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaInicioContrato", required: true, label: translate("Fecha inicio"), labelPosition: "top" },
                                { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaFinContrato", required: true, label: translate("Fecha fin"), labelPosition: "top" },
                                { view: "text", name: "duracion", label: translate("Duración"), required: true, labelPosition: "top" }
                            ]
                        },
                        {
                            cols: [
                                { view: "combo", id: "cmbEstadoW", name: "estadoId", required: true, options: {}, label: translate("Estado"), labelPosition: "top" },
                                { view: "text", name: "numeroPedido", label: translate("Num. Pedido"), labelPosition: "top" },
                                { view: "combo", id: "cmbRazonPerdidaW", name: "razonPerdidaId", options: {}, label: translate("Razón pérdida"), labelPosition: "top" },
                                { view: "text", name: "uteTXT", label: translate("UTE (% - Nombre)"), labelPosition: "top" }
                            ]
                        },
                        {
                            cols: [
                                { view: "combo", id: "cmbUsuarioW", name: "usuarioId", required: true, options: {}, label: translate("Rble Oferta"), labelPosition: "top" },
                                { view: "combo", id: "cmbResponsableW", name: "responsableId", required: true, options: {}, label: translate("Supervisado por"), labelPosition: "top" },
                                { rows: [{ view: "checkbox", name: "laboral", options: {}, label: translate("Laboral"), labelPosition: "top", width: 100 }] },
                                { rows: [{ view: "checkbox", name: "finanzas", options: {}, label: translate("Finanzas"), labelPosition: "top", width: 100 }] },
                            ]
                        },
                        {
                            cols: [
                                { view: "combo", id: "cmbAreaW", name: "areaId", required: true, options: {}, label: translate("Area"), labelPosition: "top" },
                                { view: "combo", id: "cmbUnidadNegocioW", name: "unidadNegocioId", required: true, options: {}, label: translate("Unidad negocio"), labelPosition: "top" },
                                { view: "combo", id: "cmbEmpresaW", name: "empresaId", required: true, options: {}, label: translate("Empresa"), labelPosition: "top" },
                                { view: "combo", id: "cmbPaisW", name: "paisId", required: true, options: {}, label: translate("Pais"), labelPosition: "top" }
                            ]
                        },         
                        {
                            cols: [
                                { view: "combo", id: "cmbServicioW", name: "servicioId", required: true, options: {}, label: translate("Servicio"), labelPosition: "top" },
                            ]
                        },      
                        {
                            cols: [
                                { view: "text", id: "numeroOfertaW", name: "numeroOferta", required: true, label: translate("Nr. Oferta"), labelPosition: "top" },
                                { view: "text", id: "codigoOfertaW", name: "codigoOferta", required: true, label: translate("Cod. Oferta"), labelPosition: "top" },
                                { view: "text", id: "codigoOpW", name: "codigoOp", label: translate("Código Op."), labelPosition: "top" },
                                { view: "checkbox", id: "conversionOportunidadW", name: "conversionOportunidad", options: {}, label: translate("Convertido op"), labelPosition: "top" },
                            ]
                        },
                        {
                            cols: [
                                { view: "combo", id: "cmbProbabilidadW", name: "probabilidad", required: true, options: {}, label: translate("Probabilidad"), labelPosition: "top" },
                                { view: "combo", id: "cmbFaseOfertaW", name: "faseOfertaId", required: true, options: {}, label: translate("Fase oferta"), labelPosition: "top" },
                                { view: "combo", id: "cmbTipoOportunidadW", name: "tipoOportunidadId", required: true, options: {}, label: translate("Tipo oportunidad"), labelPosition: "top" },
                                { view: "combo", id: "cmbTipoContratoW", name: "tipoContratoId", required: true, options: {}, label: translate("Tipo contrato"), labelPosition: "top" }
        
                            ]
                        },
                        {
                            cols: [
                                { view: "combo", id: "cmbDivisaW", name: "divisaId", options: {}, label: translate("Divisa"), labelPosition: "top" },
                                { view: "text", id: "multiplicadorW", name: "multiplicador", label: translate("Factor (1€ =)"), labelPosition: "top", format: "1.111,00" },
                                { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), id: "fechaDivisaW", name: "fechaDivisa", label: translate("Fecha divisa"), labelPosition: "top" },
                            ]
                        },      
                        {
                            cols: [
                                { view: "text", id: "importePresupuestoDivisaW", name: "importePresupuestoDivisa", required: true, label: translate("Importe GDES"), labelPosition: "top", format: "1.111,00" },
                                { view: "text", id: "margenContribucionW", name: "margenContribucion", required: true, label: translate("Margen contribución"), labelPosition: "top", format: "1.111,00 %" },
                                { view: "text", id: "importeContribucionDivisaW", name: "importeContribucionDivisa", label: translate("Importe margen"), labelPosition: "top", format: "1.111,00", disabled: true },
                            ]
                        },
                        {
                            cols: [
                                { view: "text", id: "importePresupuestoW", name: "importePresupuesto", required: true, label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                                {},
                                { view: "text", id: "importeContribucionW", name: "importeContribucion", label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                            ]
                        },  
                        {
                            cols: [
                                { view: "text", id: "importeUTEDivisaW", name: "importeUTEDivisa", label: translate("Importe UTE"), labelPosition: "top", format: "1.111,00" },
                                { view: "text", id: "importeTotalDivisaW", name: "importeTotalDivisa", label: translate("Importe Total"), labelPosition: "top", format: "1.111,00", disabled: true },
                                { view: "text", id: "importeMaxLicitacionDivisaW", name: "importeMaxLicitacionDivisa", label: translate("Importe Max Licitacion"), labelPosition: "top", format: "1.111,00" },
        
                            ]
                        },
                        {
                            cols: [
                                { view: "text", id: "importeUTEW", name: "importeUTE", label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                                { view: "text", id: "importeTotalW", name: "importeTotal", label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                                { view: "text", id: "importeMaxLicitacionW", name: "importeMaxLicitacion", label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                            ]
                        },   
                        {
                            cols: [
                                {},
                                { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaCreacion", label: translate("Fecha creación"), labelPosition: "top"},
                                { view: "datepicker", id: "fechaConversionOportunidadW", editable: true, minDate: new Date("2000-01-01"), name: "fechaConversionOportunidad", label: translate("Fecha conversión"), labelPosition: "top" }
        
                            ]
                        },
                                                                              
//-----------------------------------------------

                        {
                            margin: 5, cols: [
                                { gravity: 5 },
                                { view: "button", label: translate("Cancelar"), click: this.cancel, hotkey: "esc" },
                                { view: "button", label: translate("Aceptar"), click: this.accept, type: "form", hotkey: "enter" }
                            ]
                        }
                    ]
                }
            ]
        }
        var _view = {
            view: "window",
            id: "ofertasWindow",
            position: "center", move: true, resize: true,
            width: 1024,
            head: {
                view: "toolbar", cols: [
                    {},
                    {
                        view: "icon", icon: "mdi mdi-close", click: () => {
                            $$('ofertasWindow').hide();
                        }
                    }
                ]
            }, modal: true,
            body: _view1
        };
        return _view;
    }
    init(view, url) {
        $$("cmbEstadoW").attachEvent("onChange", (nv, ov) => {
            // Oferta ganada
            if (nv === 2) {
            $$("cmbProbabilidadW").setValue({ id: 100, value: "100%" });
            $$("cmbProbabilidadW").refresh();
        }
        });
    }
    showWindow() {
        let usu = usuarioService.getUsuarioCookie();
        this.getRoot().show();
        this.loadUsuarios();
        this.loadAreas();
        this.loadUnidadesNegocio();
        this.loadResponsables();
        this.loadEmpresas();
        this.loadPaises();
        this.loadServicios();
        this.loadFasesOferta();
        this.loadTiposOportunidad();
        this.loadTiposContrato();
        this.loadEstados();
        this.loadProbabilidades();
        this.setValoresPorDefectoUsuario(usu);
        this.loadUbicaciones();
        this.loadDivisas(1);
        this.loadRazonesPerdida();
        $$("multiplicadorW").setValue(1);
        this.getNumeroCodigoOferta();
        $$("margenContribucionW").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        $$("multiplicadorW").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        $$("importePresupuestoDivisaW").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        $$("importeUTEDivisaW").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        $$("importeMaxLicitacionDivisaW").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
    }
    cancel() {
        $$('ofertasWindow').hide();
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmOfertasWindow").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmOfertasWindow").getValues();
        data = ofertasService.cleanData(data);
        if (ofertaId == 0) {
            data.ofertaId = 0;
            data.fechaOferta = new Date();
            ofertasService.postOferta(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    data.ofertaId = result.ofertaId;
                    var data2 = this.$scope.crearVersion(0, data);
                    return versionesService.postVersion(usuarioService.getUsuarioCookie(), data2);
                })
                .then(result => {
                    $$('ofertasWindow').hide();
                    this.$scope.show('/top/ofertas?ofertaId=' + data.ofertaId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            ofertasService.putOferta(usuarioService.getUsuarioCookie(), data)
                .then(() => {
                    $$('ofertasWindow').hide();
                    this.$scope.show('/top/ofertas?ofertaId=' + data.ofertaId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
    loadUsuarios(usuarioId) {
        usuarioService.getUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var usuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', rows);
                var list = $$("cmbUsuarioW").getPopup().getList();
                list.clearAll();
                list.parse(usuarios);
                if (usuarioId) {
                    $$("cmbUsuarioW").setValue(usuarioId);
                    $$("cmbUsuarioW").refresh();
                }
                return;
            });
    }
    loadAreas(areaId) {
        areasService.getAreas(usuarioService.getUsuarioCookie())
            .then(rows => {
                var areas = generalApi.prepareDataForCombo('areaId', 'nombre', rows);
                var list = $$("cmbAreaW").getPopup().getList();
                list.clearAll();
                list.parse(areas);
                if (areaId) {
                    $$("cmbAreaW").setValue(areaId);
                    $$("cmbAreaW").refresh();
                }
                return;
            });
    }
    loadUnidadesNegocio(unidadNegocioId) {
        unidadesNegocioService.getUnidadesNegocio(usuarioService.getUsuarioCookie())
            .then(rows => {
                var unidades = generalApi.prepareDataForCombo('unidadNegocioId', 'nombre', rows);
                var list = $$("cmbUnidadNegocioW").getPopup().getList();
                list.clearAll();
                list.parse(unidades);
                if (unidadNegocioId) {
                    $$("cmbUnidadNegocioW").setValue(unidadNegocioId);
                    $$("cmbUnidadNegocioW").refresh();
                }
                return;
            });
    }
    loadResponsables(usuarioId) {
        usuarioService.getUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var responsables = generalApi.prepareDataForCombo('usuarioId', 'nombre', rows);
                var list = $$("cmbResponsableW").getPopup().getList();
                list.clearAll();
                list.parse(responsables);
                if (usuarioId) {
                    $$("cmbResponsableW").setValue(usuarioId);
                    $$("cmbResponsableW").refresh();
                }
                return;
            });
    }
    loadEmpresas(empresaId) {
        empresasService.getEmpresas(usuarioService.getUsuarioCookie())
            .then(rows => {
                var empresas = generalApi.prepareDataForCombo('empresaId', 'nombre', rows);
                var list = $$("cmbEmpresaW").getPopup().getList();
                list.clearAll();
                list.parse(empresas);
                if (empresaId) {
                    $$("cmbEmpresaW").setValue(empresaId);
                    $$("cmbEmpresaW").refresh();
                }
                return;
            });
    }
    loadPaises(paisId) {
        paisesService.getPaises(usuarioService.getUsuarioCookie())
            .then(rows => {
                var paises = generalApi.prepareDataForCombo('paisId', 'nombre', rows);
                var list = $$("cmbPaisW").getPopup().getList();
                list.clearAll();
                list.parse(paises);
                if (paisId) {
                    $$("cmbPaisW").setValue(paisId);
                    $$("cmbPaisW").refresh();
                }
                return;
            });
    }
    loadServicios(servicioId) {
        serviciosService.getServicios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var servicios = generalApi.prepareDataForCombo('servicioId', 'nombre', rows);
                var list = $$("cmbServicioW").getPopup().getList();
                list.clearAll();
                list.parse(servicios);
                if (servicioId) {
                    $$("cmbServicioW").setValue(servicioId);
                    $$("cmbServicioW").refresh();
                }
                return;
            });
    }
    loadFasesOferta(faseOfertaId) {
        fasesOfertaService.getFasesOferta(usuarioService.getUsuarioCookie())
            .then(rows => {
                var fasesOferta = generalApi.prepareDataForCombo('faseOfertaId', 'nombre', rows);
                var list = $$("cmbFaseOfertaW").getPopup().getList();
                list.clearAll();
                list.parse(fasesOferta);
                if (faseOfertaId) {
                    $$("cmbFaseOfertaW").setValue(faseOfertaId);
                    $$("cmbFaseOfertaW").refresh();
                }
                return;
            });
    }
    loadTiposOportunidad(tipoOportunidadId) {
        tiposOportunidadService.getTiposOportunidad(usuarioService.getUsuarioCookie())
            .then(rows => {
                var tipos = generalApi.prepareDataForCombo('tipoOportunidadId', 'nombre', rows);
                var list = $$("cmbTipoOportunidadW").getPopup().getList();
                list.clearAll();
                list.parse(tipos);
                if (tipoOportunidadId) {
                    $$("cmbTipoOportunidadW").setValue(tipoOportunidadId);
                    $$("cmbTipoOportunidadW").refresh();
                }
                return;
            });
    }
    loadTiposContrato(tipoContratoId) {
        tiposContratoService.getTiposContrato(usuarioService.getUsuarioCookie())
            .then(rows => {
                var tipos = generalApi.prepareDataForCombo('tipoContratoId', 'nombre', rows);
                var list = $$("cmbTipoContratoW").getPopup().getList();
                list.clearAll();
                list.parse(tipos);
                if (tipoContratoId) {
                    $$("cmbTipoContratoW").setValue(tipoContratoId);
                    $$("cmbTipoContratoW").refresh();
                }
                return;
            });
    }
    loadEstados(estadoId) {
        estadosService.getEstados(usuarioService.getUsuarioCookie())
            .then(rows => {
                var estados = generalApi.prepareDataForCombo('estadoId', 'nombre', rows);
                var list = $$("cmbEstadoW").getPopup().getList();
                list.clearAll();
                list.parse(estados);
                if (estadoId) {
                    $$("cmbEstadoW").setValue(estadoId);
                    $$("cmbEstadoW").refresh();
                }
                return;
            });
    }
    loadProbabilidades(probabilidad) {
        var probabilidades = [
            { id: 20, value: "20%" },
            { id: 50, value: "50%" },
            { id: 80, value: "80%" },
            { id: 100, value: "100%" },
        ];
        var list = $$("cmbProbabilidadW").getPopup().getList();
        list.clearAll();
        list.parse(probabilidades);
        if (probabilidad) {
            $$("cmbProbabilidadW").setValue(probabilidad);
            $$("cmbProbabilidadW").refresh();
        }
        return;
    }
    getNumeroCodigoOferta() {
        parametrosService.getParametrosContadores(usuarioService.getUsuarioCookie())
            .then(data => {
                $$("numeroOfertaW").setValue(data.numeroOferta);
                $$("codigoOfertaW").setValue(data.codigoOferta);
            })
            .catch((err) => {
                debugger;
                messageApi.errorMessageAjax(err);
            });
    }
    setValoresPorDefectoUsuario(usu) {
        $$("cmbUsuarioW").setValue(usu.usuarioId);
        $$("cmbResponsableW").setValue(usu.responsableId);
        $$("cmbPaisW").setValue(usu.paisId);
        $$("cmbEmpresaW").setValue(usu.empresaId);
        $$("cmbUnidadNegocioW").setValue(usu.unidadNegocioId);
        $$("cmbAreaW").setValue(usu.areaId);
    }
    crearVersion(version, data) {
        var usu = usuarioService.getUsuarioCookie();
        var data2 = {
            ofertaId: data.ofertaId,
            fechaCambio: new Date(),
            fechaEntrega: data.fechaEntrega,
            usuarioId: usu.usuarioId,
            importePresupuesto: data.importePresupuesto,
            importePresupuestoDivisa: null,
            importeUTE: null,
            importeUTEDivisa: null,
            importeTotal: data.importePresupuesto,
            importeTotalDivisa: null,
            margenContribucion: data.margenContribucion,
            importeContribucion: null,
            importeContribucionDivisa: null,
            importeAnual: null,
            importeAnualDivisa: null,
            importePrimerAno: null,
            importePrimerAnoDivisa: null,
            importeInversion: null,
            importeInversionDivisa: null,
            observaciones: 'AUTO',
            divisaId: null,
            multiplicador: null,
            numVersion: version
        };
        return data2;
    }
    loadUbicaciones(ubicacionId) {
        ubicacionesService.getUbicaciones(usuarioService.getUsuarioCookie())
            .then(rows => {
                var ubicaciones = generalApi.prepareDataForCombo('ubicacionId', 'nombre', rows);
                var list = $$("cmbUicacionW").getPopup().getList();
                list.clearAll();
                list.parse(ubicaciones);
                if (ubicacionId) {
                    $$("cmbUicacionW").setValue(ubicacionId);
                    $$("cmbUicacionW").refresh();
                }
                return;
            });
    }
    loadDivisas(divisaId) {
        divisasService.getDivisas(usuarioService.getUsuarioCookie())
            .then(rows => {
                var divisas = generalApi.prepareDataForCombo('divisaId', 'nombre', rows);
                var list = $$("cmbDivisaW").getPopup().getList();
                list.clearAll();
                list.parse(divisas);
                if (divisaId) {
                    $$("cmbDivisaW").setValue(divisaId);
                    $$("cmbDivisaW").refresh();
                }
                return;
            });
    }
    loadRazonesPerdida(razonPerdidaId) {
        razonesPerdidaService.getRazonesPerdida(usuarioService.getUsuarioCookie())
            .then(rows => {
                var razones = generalApi.prepareDataForCombo('razonPerdidaId', 'nombre', rows);
                var list = $$("cmbRazonPerdidaW").getPopup().getList();
                list.clearAll();
                list.parse(razones);
                if (razonPerdidaId) {
                    $$("cmbRazonPerdidaW").setValue(razonPerdidaId);
                    $$("cmbRazonPerdidaW").refresh();
                }
                return;
            });
    }
    calcImporte() {
        // Calcular el importe de contribución a partir del margen
        let importe = +$$("importePresupuestoW").getValue();
        let margen = +$$("margenContribucionW").getValue();
        let multiplicador = +$$("multiplicadorW").getValue();
        let importeContribucion = 0;
        if (margen !== 0) {
            importeContribucion = (margen * importe * 1.0) / 100.00;
        } 
        let importeContribucionDivisa = importeContribucion * multiplicador * 1.0;
        $$("importeContribucionW").setValue(importeContribucion);
        $$("importeContribucionDivisaW").setValue(importeContribucionDivisa);
        let importeDivisa = importe * multiplicador;
        if (importeDivisa) $$("importePresupuestoDivisaW").setValue(importeDivisa);
        // Obliga a recalcular el total
        let importeTotal = +$$("importePresupuestoW").getValue() + +$$("importeUTEW").getValue();
        $$("importeTotalW").setValue(importeTotal);
        let importeTotalDivisa = importeTotal * multiplicador;
        if (importeTotalDivisa) $$("importeTotalDivisaW").setValue(importeTotalDivisa);
        let importeUTE = +$$("importeUTEW").getValue();
        let importeUTEDivisa = importeUTE * multiplicador
        if (importeUTEDivisa) $$("importeUTEDivisaW").setValue(importeUTEDivisa);
    }
    calcFromDivisa() {
        let multiplicador = +$$("multiplicadorW").getValue();
        if (multiplicador != 0) {
            let importePresupuesto = +$$("importePresupuestoDivisaW").getValue() / multiplicador;
            $$("importePresupuestoW").setValue(importePresupuesto);
            let importeUTE = +$$("importeUTEDivisaW").getValue() / multiplicador;
            $$("importeUTEW").setValue(importeUTE);
            // let importeAnual = +$$("importeAnualDivisa").getValue() / multiplicador;
            // $$("importeAnual").setValue(importeAnual);
            // let importePrimerAno = +$$("importePrimerAnoDivisa").getValue() / multiplicador;
            // $$("importePrimerAno").setValue(importePrimerAno);
            let importeMaxLicitacion = +$$("importeMaxLicitacionDivisaW").getValue() / multiplicador;
            $$("importeMaxLicitacionW").setValue(importeMaxLicitacion);
            this.calcImporte();
        }
    }
}