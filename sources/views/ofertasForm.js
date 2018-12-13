import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";
import { areasService } from "../services/areas_service";
import { ofertasService } from "../services/ofertas_service";
import { empresasService } from "../services/empresas_service";
import { paisesService } from "../services/paises_service";
import { serviciosService } from "../services/servicios_service";
import { fasesOfertaService } from "../services/fasesOferta_service";
import { tiposOportunidadService } from "../services/tiposOportunidad_service";
import { tiposContratoService } from "../services/tiposContrato_service";
import { estadosService } from "../services/estados_service";
import { razonesPerdidaService } from "../services/razonesPerdida_service";
import { divisasService } from "../services/divisas_service"
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";

var ofertaId = 0;

export default class OfertasForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const cellDescriptivos = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("DESCRIPTIVOS"), type: "section" },
                { view: "textarea", name: "descripcion", required: true, label: translate("Descripción"), labelPosition: "top", id: "firstField" },
                {
                    cols: [
                        { view: "text", name: "nombreCorto", required: true, label: translate("Nombre"), labelPosition: "top" },
                        { view: "text", name: "cliente", required: true, label: translate("Cliente"), labelPosition: "top" },
                        { view: "text", name: "ubicacion", required: true, label: translate("Ubicación"), labelPosition: "top" }
                    ]
                },
                {
                    cols: [
                        { view: "text", name: "periodo", required: true, label: translate("Periodo"), labelPosition: "top" },
                        { view: "text", name: "numeroLicitacion", required: true, label: translate("Nr. Licitación"), labelPosition: "top" },
                        { view: "text", name: "paisUbicacion", required: true, label: translate("Pais Ubicación"), labelPosition: "top" }
                    ]
                },
                {
                    cols: [
                        { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaEntrega", required: true, label: translate("Fecha entrega"), labelPosition: "top" },
                        { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaAdjudicacion", required: true, label: translate("Fecha adjudicación"), labelPosition: "top" },
                        {}
                    ]
                },
                {
                    cols: [
                        { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaInicioContrato", required: true, label: translate("Fecha inicio contrato"), labelPosition: "top" },
                        { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaFinContrato", required: true, label: translate("Fecha fin contrato"), labelPosition: "top" },
                        { view: "text", name: "duracion", required: true, label: translate("Duración"), labelPosition: "top" }
                    ]
                },
                { view: "textarea", name: "notasPlanning", required: true, label: translate("Notas Planning"), labelPosition: "top" },
            ]
        };
        const cellGenerales = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("GENERALES"), type: "section" },
                {
                    cols: [
                        { view: "combo", id: "cmbUsuario", name: "usuarioId", required: true, options: {}, label: translate("Usuario"), labelPosition: "top" },
                        { view: "combo", id: "cmbArea", name: "areaId", required: true, options: {}, label: translate("Area"), labelPosition: "top" },
                        { view: "combo", id: "cmbUnidadNegocio", name: "unidadNegocioId", required: true, options: {}, label: translate("Unidad negocio"), labelPosition: "top" }
                    ]
                },
                {
                    cols: [
                        { view: "combo", id: "cmbResponsable", name: "responsableId", required: true, options: {}, label: translate("Responsable"), labelPosition: "top" },
                        { view: "combo", id: "cmbEmpresa", name: "empresaId", required: true, options: {}, label: translate("Empresa"), labelPosition: "top" },
                        { view: "combo", id: "cmbPais", name: "paisId", required: true, options: {}, label: translate("Pais"), labelPosition: "top" }
                    ]
                },
                { view: "combo", id: "cmbServicio", name: "servicioId", required: true, options: {}, label: translate("Servicio"), labelPosition: "top" },
                {
                    cols: [
                        { view: "text", name: "ofertaId", label: translate("ID"), labelPosition: "top", readonly: true },
                        { view: "text", name: "numeroOferta", required: true, label: translate("Nr. Oferta"), labelPosition: "top" },
                        { view: "text", name: "codigoOferta", required: true, label: translate("Cod. Oferta"), labelPosition: "top" }
                    ]
                },
                {
                    cols: [
                        { view: "combo", id: "cmbFaseOferta", name: "faseOfertaId", required: true, options: {}, label: translate("Fase oferta"), labelPosition: "top" },
                        { view: "combo", id: "cmbTipoOportunidad", name: "tipoOportunidadId", required: true, options: {}, label: translate("Tipo oportunidad"), labelPosition: "top" },
                        { view: "combo", id: "cmbTipoContrato", name: "tipoContratoId", required: true, options: {}, label: translate("Tipo contrato"), labelPosition: "top" }
                    ]
                },
                {
                    cols: [
                        { view: "combo", id: "cmbProbabilidad", name: "probabilidad", required: true, options: {}, label: translate("Probabilidad"), labelPosition: "top" },
                        { view: "checkbox", name: "ofertaSingular", required: true, options: {}, label: translate("Oferta singular"), labelPosition: "top" },
                        { view: "textarea", name: "autorizaciones", required: true, options: {}, label: translate("Autorizaciones"), labelPosition: "top" },

                    ]
                },
                {
                    cols: [
                        { view: "checkbox", name: "relevante", required: true, options: {}, label: translate("Relevante"), labelPosition: "top" },
                        { view: "checkbox", name: "conversionOportunidad", required: true, options: {}, label: translate("Convertida de oportunidad"), labelPosition: "top" },
                        { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaConversion", required: true, label: translate("Fecha conversión"), labelPosition: "top" }

                    ]
                }
            ]
        };
        const cellOtrosDatos = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("OTROS DATOS"), type: "section" },
                {
                    cols: [
                        { view: "checkbox", name: "subrogacionSN", required: true, options: {}, label: translate("Subrogación"), labelPosition: "top", width: 150 },
                        { view: "textarea", name: "subrogacionTXT", required: true, label: translate("Comentario subrogación"), labelPosition: "top" },
                        { view: "text", name: "subrogacionNum", required: true, label: translate("Cantidad personal"), labelPosition: "top", width: 150 }
                    ]
                },
                {
                    cols: [
                        { view: "checkbox", name: "uteSN", required: true, options: {}, label: translate("UTE"), labelPosition: "top", width: 150 },
                        { view: "textarea", name: "uteTXT", required: true, label: translate("Comentario UTE"), labelPosition: "top" },
                        { view: "text", name: "gdesPor", required: true, label: translate("GDES Porcentaje"), labelPosition: "top", width: 150 }
                    ]
                },
                {
                    cols: [
                        { view: "checkbox", name: "subcontrataSN", required: true, options: {}, label: translate("Reclutamiento"), labelPosition: "top", width: 150 },
                        { view: "textarea", name: "subcontrataTXT", required: true, label: translate("Perfil y cantidad a reclutar"), labelPosition: "top" },
                        { view: "datepicker", editable: true, minDate: new Date(new Date("1500-01-01")), name: "fechaCreacion", required: true, label: translate("Fecha creación"), labelPosition: "top", width: 150 },
                    ]
                }
            ]
        };
        const cellEstado = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("ESTADO"), type: "section" },
                {
                    cols: [
                        { view: "combo", id: "cmbEstado", name: "estadoId", required: true, options: {}, label: translate("Estado"), labelPosition: "top" },
                        {}
                    ]
                },
                {
                    cols: [
                        { view: "text", name: "numeroPedido", required: true, label: translate("Num. Pedido"), labelPosition: "top" },
                        { view: "combo", id: "cmbRazonPerdida", name: "razonPerdidaId", required: true, options: {}, label: translate("Razón pérdida"), labelPosition: "top" }
                    ]
                },
                { view: "textarea", name: "notasEstado", required: true, label: translate("Descripción"), labelPosition: "top" }
            ]
        };
        const tabDatosOportunidad = {
            header: translate("Datos oportunidad"),
            body: {
                rows: [
                    {
                        cols: [
                            cellDescriptivos,
                            cellGenerales
                        ]
                    },
                    {
                        cols: [
                            cellOtrosDatos,
                            cellEstado
                        ]
                    }
                ]
            }
        };
        const cellBasicosEuros = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("BASICOS (€)"), type: "section" },
                {
                    rows: [
                        {},
                        {
                            cols: [
                                { view: "text", name: "importePresupuesto", required: true, label: translate("Importe GDES"), labelPosition: "top", format: "1.111,00 €" },
                                { view: "text", name: "importeUTE", required: true, label: translate("Importe UTE"), labelPosition: "top", format: "1.111,00 €" },
                                { view: "text", name: "importeTotal", required: true, label: translate("Importe Total"), labelPosition: "top", format: "1.111,00 €" }
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "margenContribucion", required: true, label: translate("Margen contribución"), labelPosition: "top", format: "1.111,00 %" },
                                { view: "text", name: "importeContribucion", required: true, label: translate("Importe margen"), labelPosition: "top", format: "1.111,00 €" },
                                {}
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "importeAnual", required: true, label: translate("Importe anual"), labelPosition: "top", format: "1.111,00 €" },
                                { view: "text", name: "importePrimerAno", required: true, label: translate("Importe año en curso"), labelPosition: "top", format: "1.111,00 €" },
                                {}
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "importeInversion", required: true, label: translate("Valor inversión"), labelPosition: "top", format: "1.111,00 €" },
                                {},
                                {}
                            ]
                        }
                    ]
                }
            ]
        };
        const cellBasicosOtraDivisa = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("BASICOS (OTRA DIVISA)"), type: "section" },
                {
                    rows: [
                        {
                            cols: [
                                { view: "combo", id: "cmbDivisa", name: "divisaId", required: true, options: {}, label: translate("Divisa"), labelPosition: "top" },
                                {},
                                { view: "text", name: "multiplicador", required: true, label: translate("Factor (1€ =)"), labelPosition: "top", format: "1.111,00" },
                                { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaDivisa", required: true, label: translate("Fecha divisa"), labelPosition: "top" },
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "importePresupuestoDivisa", required: true, label: translate("Importe GDES (DIVISA)"), labelPosition: "top", format: "1.111,00" },
                                { view: "text", name: "importeUTEDivisa", required: true, label: translate("Importe UTE (DIVISA)"), labelPosition: "top", format: "1.111,00" },
                                { view: "text", name: "importeTotal", required: true, label: translate("Importe Total"), labelPosition: "top", format: "1.111,00" }
                            ]
                        },
                        {
                            cols: [
                                {},
                                { view: "text", name: "importeContribucionDivisa", required: true, label: translate("Importe margen (DIVISA)"), labelPosition: "top", format: "1.111,00" },
                                {}
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "importeAnualDivisa", required: true, label: translate("Importe anual (DIVISA)"), labelPosition: "top", format: "1.111,00" },
                                { view: "text", name: "importePrimerAnoDivisa", required: true, label: translate("Importe año en curso (DIVISA)"), labelPosition: "top", format: "1.111,00" },
                                {}
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "importeInversionDivisa", required: true, label: translate("Valor inversión (DIVISA)"), labelPosition: "top", format: "1.111,00" },
                                {},
                                {}
                            ]
                        }
                    ]
                }
            ]
        };
        const cellOtrosEconomicos = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("OTROS DATOS"), type: "section" },
                {
                    cols: [
                        {
                            rows: [
                                { view: "textarea", name: "descripcionInversion", required: true, label: translate("Descripción inversión"), labelPosition: "top" },
                                { view: "textarea", name: "condicionesPago", required: true, label: translate("Condiciones de pago"), labelPosition: "top" }
                            ]
                        },
                        {
                            rows: [
                                { view: "textarea", name: "consideracionesEconomicas", required: true, label: translate("Consideraciones economicas"), labelPosition: "top" }
                            ]
                        }
                    ]
                }
            ]
        };
        const tabDatosEconomicos = {
            header: translate("Datos económicos"),
            body: {
                rows: [
                    {
                        cols: [
                            cellBasicosEuros,
                            cellBasicosOtraDivisa
                        ]

                    },
                    cellOtrosEconomicos
                ]
            }
        };
        const cellAlcanceDeLosTrabajos = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("ALCANCE DE LOS TRABAJOS"), type: "section" },
                { view: "textarea", name: "alcance", required: true, label: translate("Alcance del Proyecto"), labelPosition: "top" },
                { view: "textarea", name: "puntosRelevantes", required: true, label: translate("Equipo y planificación"), labelPosition: "top" },
                { view: "textarea", name: "documentosEspeciales", required: true, label: translate("Documentos aplicables"), labelPosition: "top" }
            ]
        };
        const cellCuestionesDeContrato = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("CUESTIONES DE CONTRATO"), type: "section" },
                { view: "textarea", name: "codicionesEstandar", required: true, label: translate("Comentarios contrato"), labelPosition: "top" },
                { view: "textarea", name: "garantiasEspeciales", required: true, label: translate("Comentarios garantias"), labelPosition: "top" },
                { view: "textarea", name: "penalizaciones", required: true, label: translate("Penalizaciones"), labelPosition: "top" },
                { view: "textarea", name: "riesgos", required: true, label: translate("Riesgos"), labelPosition: "top" }
            ]
        };
        const cellConcurrenciaYMercado = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("CONCURRENCIA Y SITUACIÓN DE MERCADO"), type: "section" },
                {
                    cols: [
                        { view: "text", name: "proveedorActual", required: true, label: translate("Proveedor Actual"), labelPosition: "top" },
                        {}
                    ]
                },
                {
                    cols: [
                        { view: "text", name: "competidores", required: true, label: translate("Competidores"), labelPosition: "top" },
                        { view: "text", name: "principalCompetidor", required: true, label: translate("Principal Competidor"), labelPosition: "top" }
                    ]
                },
                { view: "textarea", name: "criteriosEvaluacion", required: true, label: translate("Criterios de Evaluación"), labelPosition: "top" },
                { view: "textarea", name: "datosComerciales", required: true, label: translate("Datos Comerciales"), labelPosition: "top" }
            ]
        };
        const cellValoresYEstrategia = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("GDES VALORES Y ESTRATEGIA"), type: "section" },
                { view: "textarea", name: "diferencialGDES", required: true, label: translate("Propuesta diferencial GDES"), labelPosition: "top" },
                { view: "textarea", name: "estrategiaGDES", required: true, label: translate("Estrategia GDES"), labelPosition: "top" },
                { view: "textarea", name: "sinergias", required: true, label: translate("Sinergias con otros contratos"), labelPosition: "top" }

            ]
        };
        const tabDatosComplementarios = {
            header: translate("Datos complementarios"),
            body: {
                rows: [
                    {
                        cols: [
                            cellAlcanceDeLosTrabajos,
                            cellCuestionesDeContrato
                        ]
                    },
                    {
                        cols: [
                            cellConcurrenciaYMercado,
                            cellValoresYEstrategia
                        ]
                    }
                ]
            }
        };
        const tabDatosFinancieros = {
            header: translate("Datos financieros"),
            body: {

            }
        };
        const tabAnotaciones = {
            header: translate("Anotaciones"),
            body: {

            }
        };
        const tabAnexos = {
            header: translate("Anexos"),
            body: {

            }
        };

        const _view = {
            view: "layout",
            id: "ofertasForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-arrow-decision-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Ofertas") }
                    ]
                },

                {
                    view: "form",
                    id: "frmOfertas",
                    elements: [
                        {
                            view: "tabview",
                            cells: [
                                tabDatosOportunidad,
                                tabDatosEconomicos,
                                tabDatosComplementarios,
                                tabDatosFinancieros,
                                tabAnotaciones,
                                tabAnexos
                            ]
                        },
                        {
                            margin: 5, cols: [
                                { gravity: 5 },
                                { view: "button", label: translate("Cancelar"), click: this.cancel, hotkey: "esc" },
                                { view: "button", label: translate("Aceptar"), click: this.accept, type: "form" }
                            ]
                        },
                        { minlength: 600 }
                    ]
                }
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        if (url[0].params.ofertaId) {
            ofertaId = url[0].params.ofertaId;
        }
        this.load(ofertaId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(ofertaId) {
        if (ofertaId == 0) {
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
            this.loadProbabilidades();
            this.loadEstados();
            this.loadRazonesPerdida();
            this.loadDivisas();
            return;
        }
        ofertasService.getOferta(usuarioService.getUsuarioCookie(), ofertaId)
            .then((oferta) => {
                oferta.fechaEntrega = new Date(oferta.fechaEntrega);
                oferta.fechaAdjudicacion = new Date(oferta.fechaAdjudicacion);
                oferta.fechaInicioContrato = new Date(oferta.fechaInicioContrato);
                oferta.fechaFinContrato = new Date(oferta.fechaFinContrato);
                $$("frmOfertas").setValues(oferta);
                this.loadUsuarios(oferta.usuarioId);
                this.loadAreas(oferta.areaId);
                this.loadUnidadesNegocio(oferta.unidadNegocioId);
                this.loadResponsables(oferta.responsableId);
                this.loadEmpresas(oferta.empresaId);
                this.loadPaises(oferta.paisId);
                this.loadServicios(oferta.servicioId);
                this.loadFasesOferta(oferta.faseOfertaId);
                this.loadTiposOportunidad(oferta.tipoOportunidadId);
                this.loadTiposContrato(oferta.tipoContratoId);
                this.loadProbabilidades(oferta.probabilidad);
                this.loadEstados(oferta.estadoId);
                this.loadRazonesPerdida(oferta.razonPerdidaId);
                this.loadDivisas(oferta.divisaId);

            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/ofertas');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmOfertas").validate({ hidden: true })) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmOfertas").getValues();
        data = ofertasService.checkFormValues(data);
        if (ofertaId == 0) {
            data.ofertaId = 0;
            ofertasService.postOferta(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    this.$scope.show('/top/ofertas?ofertaId=' + result.ofertaId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            ofertasService.putOferta(usuarioService.getUsuarioCookie(), data)
                .then(() => {
                    this.$scope.show('/top/ofertas?ofertaId=' + data.ofertaId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
    loadUnidadesNegocio(unidadNegocioId) {
        unidadesNegocioService.getUnidadesNegocio(usuarioService.getUsuarioCookie())
            .then(rows => {
                var ofertas = generalApi.prepareDataForCombo('unidadNegocioId', 'nombre', rows);
                var list = $$("cmbUnidadNegocio").getPopup().getList();
                list.clearAll();
                list.parse(ofertas);
                if (id) {
                    $$("cmbUnidadNegocio").setValue(unidadNegocioId);
                    $$("cmbUnidadNegocio").refresh();
                }
                return;
            });
    }
    loadUsuarios(usuarioId) {
        usuarioService.getUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var usuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', rows);
                var list = $$("cmbUsuario").getPopup().getList();
                list.clearAll();
                list.parse(usuarios);
                if (id) {
                    $$("cmbUsuario").setValue(usuarioId);
                    $$("cmbUsuario").refresh();
                }
                return;
            });
    }
    loadAreas(areaId) {
        areasService.getAreas(usuarioService.getUsuarioCookie())
            .then(rows => {
                var areas = generalApi.prepareDataForCombo('areaId', 'nombre', rows);
                var list = $$("cmbArea").getPopup().getList();
                list.clearAll();
                list.parse(areas);
                if (id) {
                    $$("cmbArea").setValue(areaId);
                    $$("cmbArea").refresh();
                }
                return;
            });
    }
    loadResponsables(usuarioId) {
        usuarioService.getUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var usuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', rows);
                var list = $$("cmbResponsable").getPopup().getList();
                list.clearAll();
                list.parse(usuarios);
                if (id) {
                    $$("cmbResponsable").setValue(usuarioId);
                    $$("cmbResponsable").refresh();
                }
                return;
            });
    }
    loadEmpresas(empresaId) {
        empresasService.getEmpresas(usuarioService.getUsuarioCookie())
            .then(rows => {
                var empresas = generalApi.prepareDataForCombo('empresaId', 'nombre', rows);
                var list = $$("cmbEmpresa").getPopup().getList();
                list.clearAll();
                list.parse(empresas);
                if (id) {
                    $$("cmbEmpresa").setValue(empresaId);
                    $$("cmbEmpresa").refresh();
                }
                return;
            });
    }
    loadPaises(paisId) {
        paisesService.getPaises(usuarioService.getUsuarioCookie())
            .then(rows => {
                var paises = generalApi.prepareDataForCombo('paisId', 'nombre', rows);
                var list = $$("cmbPais").getPopup().getList();
                list.clearAll();
                list.parse(paises);
                if (id) {
                    $$("cmbPais").setValue(paisId);
                    $$("cmbPais").refresh();
                }
                return;
            });
    }
    loadServicios(servicioId) {
        serviciosService.getServicios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var servicios = generalApi.prepareDataForCombo('servicioId', 'nombre', rows);
                var list = $$("cmbServicio").getPopup().getList();
                list.clearAll();
                list.parse(servicios);
                if (id) {
                    $$("cmbServicio").setValue(servicioId);
                    $$("cmbServicio").refresh();
                }
                return;
            });
    }
    loadFasesOferta(faseOfertaId) {
        fasesOfertaService.getFasesOferta(usuarioService.getUsuarioCookie())
            .then(rows => {
                var fasesOferta = generalApi.prepareDataForCombo('faseOfertaId', 'nombre', rows);
                var list = $$("cmbFaseOferta").getPopup().getList();
                list.clearAll();
                list.parse(fasesOferta);
                if (id) {
                    $$("cmbFaseOferta").setValue(faseOfertaId);
                    $$("cmbFaseOferta").refresh();
                }
                return;
            });
    }
    loadTiposOportunidad(tipoOportunidadId) {
        tiposOportunidadService.getTiposOportunidad(usuarioService.getUsuarioCookie())
            .then(rows => {
                var tipos = generalApi.prepareDataForCombo('tipoOportunidadId', 'nombre', rows);
                var list = $$("cmbTipoOportunidad").getPopup().getList();
                list.clearAll();
                list.parse(tipos);
                if (id) {
                    $$("cmbTipoOportunidad").setValue(tipoOportunidadId);
                    $$("cmbTipoOportunidad").refresh();
                }
                return;
            });
    }
    loadTiposContrato(tipoContratoId) {
        tiposContratoService.getTiposContrato(usuarioService.getUsuarioCookie())
            .then(rows => {
                var tipos = generalApi.prepareDataForCombo('tipoContratoId', 'nombre', rows);
                var list = $$("cmbTipoContrato").getPopup().getList();
                list.clearAll();
                list.parse(tipos);
                if (id) {
                    $$("cmbTipoContrato").setValue(tipoContratoId);
                    $$("cmbTipoContrato").refresh();
                }
                return;
            });
    }
    loadProbabilidades(probabilidad) {
        var probabilidades = [
            { id: 0, value: "0%" },
            { id: 50, value: "50%" },
            { id: 80, value: "80%" }
        ];
        var list = $$("cmbProbabilidad").getPopup().getList();
        list.clearAll();
        list.parse(probabilidades);
        if (probabilidad) {
            $$("cmbProbabilidad").setValue(probabilidad);
            $$("cmbProbabilidad").refresh();
        }
        return;
    }
    loadEstados(estadoId) {
        estadosService.getEstados(usuarioService.getUsuarioCookie())
            .then(rows => {
                var estados = generalApi.prepareDataForCombo('estadoId', 'nombre', rows);
                var list = $$("cmbEstado").getPopup().getList();
                list.clearAll();
                list.parse(estados);
                if (id) {
                    $$("cmbEstado").setValue(estadoId);
                    $$("cmbEstado").refresh();
                }
                return;
            });
    }
    loadRazonesPerdida(razonPerdidaId) {
        razonesPerdidaService.getRazonesPerdida(usuarioService.getUsuarioCookie())
            .then(rows => {
                var razones = generalApi.prepareDataForCombo('razonPerdidaId', 'nombre', rows);
                var list = $$("cmbRazonPerdida").getPopup().getList();
                list.clearAll();
                list.parse(razones);
                if (id) {
                    $$("cmbRazonPerdida").setValue(razonPerdidaId);
                    $$("cmbRazonPerdida").refresh();
                }
                return;
            });
    }
    loadDivisas(divisaId) {
        divisasService.getDivisas(usuarioService.getUsuarioCookie())
            .then(rows => {
                var divisas = generalApi.prepareDataForCombo('divisaId', 'nombre', rows);
                var list = $$("cmbDivisa").getPopup().getList();
                list.clearAll();
                list.parse(divisas);
                if (id) {
                    $$("cmbDivisa").setValue(divisaId);
                    $$("cmbDivisa").refresh();
                }
                return;
            });
    }
}