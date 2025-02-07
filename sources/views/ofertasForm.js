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
import { parametrosService } from "../services/parametros_service";
import { versionesService } from '../services/versiones_service';
import { ubicacionesService } from '../services/ubicaciones_service';
import { proyectosCentralService } from '../services/proyectos_central_service';
import UbicacionesWindow from "./ubicacionesWindow";
// import PprReport from "./pprReport";

var ofertaId = 0;
var numVersion = 0;
var _contador;
var _originalFaseOfertaId;
var _originalImporte;

var _importePresupuesto;
var _importeUTE;
var _importeTotal;
var _margenContribucion;
var _importeContribucion;
var _importeAnual;
var _importePrimerAno;
var _importeInversion;
var _multiplicador;
var _usuario;


export default class OfertasForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const cellDesc2 = {
            padding: 10, margin: 10, css: "fondocelda",
            rows: [
                { template: translate("DESCRIPTIVOS"), type: "section" },
                {
                    cols: [
                        { view: "textarea", gravity: 4, name: "descripcion", label: translate("Título del contrato"), required: true, labelPosition: "top", id: "firstField" },
                        { view: "text", gravity: 1, name: "periodo", label: translate("Periodo"), labelPosition: "top" },
                    ]
                },
                {
                    cols: [
                        { view: "text", gravity: 2, name: "nombreCorto", label: translate("Nombre resumen"), required: true, labelPosition: "top" },
                        {
                            gravity: 1,
                            cols: [
                                { view: "combo", id: "cmbUbicacion", name: "ubicacionId", required: true, options: {}, label: translate("Ubicacion"), labelPosition: "top" },
                                {
                                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left",
                                    tooltip: translate("Crear nueva ubicación"),
                                    click: () => {
                                        this.ubicacionesWindow.showWindow();
                                    }
                                }
                            ]
                        },
                        { view: "text", gravity: 1, id: "paisUbicacion", name: "paisUbicacion", label: translate("Pais Ubicación"), labelPosition: "top", required: true },
                        { view: "text", gravity: 1, name: "cliente", label: translate("Cliente"), required: true, labelPosition: "top" },
                    ]
                },
                {
                    cols: [
                        { view: "combo", gravity: 4, id: "cmbServicio", name: "servicioId", required: true, options: {}, label: translate("Servicio"), labelPosition: "top" },
                        { view: "text", gravity: 1, name: "numeroLicitacion", label: translate("Nr. Licitación"), labelPosition: "top" },
                    ]
                },
                {
                    cols: [
                        { view: "text", name: "implicaTecnologico", label: translate("¿Desarrollo tecnológico?"), labelPosition: "top" },
                    ]
                },
                {
                    css: "espaciador"
                },
                {
                    cols: [
                        {
                            gravity: 3,
                            rows: [
                                {
                                    cols: [
                                        { view: "combo", id: "cmbFaseOferta", name: "faseOfertaId", required: true, options: {}, label: translate("Fase oferta"), labelPosition: "top" },
                                        { view: "combo", id: "cmbEstado", name: "estadoId", required: true, options: {}, label: translate("Estado"), labelPosition: "top" },
                                        { view: "combo", id: "cmbProbabilidad", name: "probabilidad", required: true, options: {}, label: translate("Probabilidad"), labelPosition: "top" },
                                    ]
                                },
                                {
                                    cols: [
                                        { view: "text", id: "numeroOferta", name: "numeroOferta", required: true, label: translate("Nr. Oferta"), labelPosition: "top" },
                                        { view: "text", id: "codigoOferta", name: "codigoOferta", required: true, label: translate("Cod. Oferta"), labelPosition: "top" },
                                        { view: "text", id: "codigoOp", name: "codigoOp", label: translate("Código Op."), labelPosition: "top" },
                                    ]
                                }
                            ]
                        },
                        { view: "textarea", gravity: 2, name: "notasEstado", label: translate("Notas sobre versiones de la Oferta"), labelPosition: "top" }
                    ]
                },
                {
                    cols: [
                        {
                            gravity: 3,
                            rows: [
                                {
                                    cols: [
                                        { view: "combo", id: "cmbTipoOportunidad", name: "tipoOportunidadId", required: true, options: {}, label: translate("Tipo oportunidad"), labelPosition: "top" },
                                        { view: "combo", id: "cmbTipoContrato", name: "tipoContratoId", required: true, options: {}, label: translate("Tipo contrato"), labelPosition: "top" },
                                        { view: "checkbox", name: "relevante", options: {}, label: translate("Relevante"), labelPosition: "top" },
                                    ]
                                },
                                {
                                    cols: [
                                        { view: "text", name: "numeroPedido", label: translate("Num. Pedido"), labelPosition: "top" },
                                        { view: "combo", id: "cmbRazonPerdida", name: "razonPerdidaId", options: {}, label: translate("Razón pérdida"), labelPosition: "top" },
                                        {}
                                    ]
                                }
                            ]
                        },
                        {
                            gravity: 2,
                            rows: [
                                {
                                    cols: [
                                        { view: "checkbox", id: "conversionOportunidad", name: "conversionOportunidad", options: {}, label: translate("Convertido op"), labelPosition: "top" },
                                        { view: "datepicker", id: "fechaConversionOportunidad", editable: true, minDate: new Date("2000-01-01"), name: "fechaConversionOportunidad", label: translate("Fecha conversión"), labelPosition: "top" }
                                    ]
                                },
                                {
                                    cols: [
                                        { view: "checkbox", id: "ofertaSingular", name: "ofertaSingular", options: {}, label: translate("Oferta singular"), labelPosition: "top" },
                                        { view: "textarea", id: "autorizaciones", name: "autorizaciones", options: {}, label: translate("Autorizaciones"), labelPosition: "top" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    cols: [
                        {
                            gravity:3,
                            rows: [
                                { view: "combo", id: "cmbProyectosCentral", name: "proyectoCodigo", options: {}, label: translate("Proyecto"), labelPosition: "top" }
                            ]
                        },
                        {
                            gravity:2

                        }

                    ]

                },
            ]
        };
        const cellPlanificacion = {
            padding: 10, margin: 10, css: "fondocelda",
            rows: [
                { template: translate("PLANIFICACION"), type: "section" },
                {
                    cols: [
                        {
                            gravity: 3,
                            rows: [
                                {
                                    cols: [
                                        { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaEntrega", required: true, label: translate("F. Entrega"), labelPosition: "top"},
                                        { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaAdjudicacion", required: true, label: translate("F. Adjudicación"), labelPosition: "top" },
                                        {}
                                    ]
                                },
                                {
                                    cols: [
                                        { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaInicioContrato", required: true, label: translate("F. Inicio"), labelPosition: "top" },
                                        { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaFinContrato", required: true, label: translate("F. Fin"), labelPosition: "top" },
                                        { view: "text", name: "duracion", label: translate("Duración"), required: true, labelPosition: "top" },
                                    ]
                                }
                            ]
                        },
                        {
                            gravity: 2,
                            rows: [
                                { view: "textarea", name: "notasPlanning", label: translate("Notas Planning"), labelPosition: "top" },
                            ]
                        }
                    ]
                }
                // {
                //     cols: [
                //     ]
                // },
                // {
                //     cols: [

                //     ]
                // },
                // {
                //     cols: [
                //         {
                //             cols: [

                //             ]
                //         },
                        
                //     ]
                // }
            ]
        };
        const cellEconomico2 = {
            padding: 10, margin: 10, css: "fondocelda",
            rows: [
                { template: translate("ECONOMICOS"), type: "section" },
                {
                    cols: [
                        { view: "combo", id: "cmbDivisa", name: "divisaId", options: {}, label: translate("Divisa"), labelPosition: "top" },
                        { view: "text", id: "multiplicador", name: "multiplicador", label: translate("Factor (1€ =)"), labelPosition: "top", format: "1.111,00" },
                    ]
                },
                {
                    cols: [
                        {},
                        { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), id: "fechaDivisa", name: "fechaDivisa", label: translate("Fecha divisa"), labelPosition: "top" },
                    ]
                },
                {
                    cols: [
                        { view: "text", id: "importePresupuestoDivisa", name: "importePresupuestoDivisa", required: true, label: translate("Importe GDES"), labelPosition: "top", format: "1.111,00" },
                        { view: "text", id: "importePresupuesto", name: "importePresupuesto", required: true, label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                    ]
                },
                {
                    cols: [
                        { view: "text", id: "margenContribucion", name: "margenContribucion", required: true, label: translate("Margen contribución"), labelPosition: "top", format: "1.111,00 %" },
                        {}
                    ]
                },
                {
                    cols: [
                        { view: "text", id: "importeContribucionDivisa", name: "importeContribucionDivisa", label: translate("Importe margen"), labelPosition: "top", format: "1.111,00", disabled: true },
                        { view: "text", id: "importeContribucion", name: "importeContribucion", label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                    ]
                },
                {
                    cols: [
                        { view: "textarea", name: "consideracionesEconomicas", label: translate("Consideraciones incluidas en la oferta económica"), labelPosition: "top", height:130 },
                    ]
                },
                {
                    cols: [
                        { view: "text", id: "importeInversionDivisa", name: "importeInversionDivisa", label: translate("Inversión (Capex)"), labelPosition: "top", format: "1.111,00" },
                        { view: "text", id: "importeInversion", name: "importeInversion", label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                    ]
                },
                {
                    cols: [
                        { view: "text", id: "tasaRetorno", name: "tasaRetorno", label: translate("Tasa retorno"), labelPosition: "top", format: "1.111,00 %" },
                        { view: "text", id: "payBack", name: "payBack", label: translate("Pay-back"), labelPosition: "top", format: "1.111,00" },
                    ]
                },
                {
                    cols: [
                        { view: "textarea", name: "descripcionInversion", label: translate("Descripción inversión"), labelPosition: "top" },
                    ]
                },
                {
                    cols: [
                        { view: "text", name: "uteTXT", label: translate("UTE (% - Nombre)"), labelPosition: "top" },
                        {}
                    ]
                },
                {
                    cols: [
                        { view: "text", id: "importeUTEDivisa", name: "importeUTEDivisa", label: translate("Importe UTE"), labelPosition: "top", format: "1.111,00" },
                        { view: "text", id: "importeUTE", name: "importeUTE", label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                    ]
                },
                {
                    cols: [
                        { view: "text", id: "importeTotalDivisa", name: "importeTotalDivisa", label: translate("Importe Total"), labelPosition: "top", format: "1.111,00", disabled: true },
                        { view: "text", id: "importeTotal", name: "importeTotal", label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                    ]
                },
                {
                    cols: [
                        { view: "text", id: "importeMaxLicitacionDivisa", name: "importeMaxLicitacionDivisa", label: translate("Importe Max Licitacion"), labelPosition: "top", format: "1.111,00" },
                        { view: "text", id: "importeMaxLicitacion", name: "importeMaxLicitacion", label: translate(""), labelPosition: "top", format: "1.111,00 €", disabled: true },
                    ]
                }
            ]
        };
        const cellGeneral = {
            padding: 10, matgin: 10, css: "fondocelda",
            rows: [
                { template: translate("GENERAL"), type: "section" },
                {
                    cols: [
                        { view: "combo", id: "cmbUsuario", name: "usuarioId", required: true, options: {}, label: translate("Usuario"), labelPosition: "top" },
                        { view: "combo", id: "cmbResponsable", name: "responsableId", required: true, options: {}, label: translate("Rble Oferta"), labelPosition: "top" },
                        { view: "combo", id: "cmbUsuResponsableId", name: "usuResponsableId", required: true, options: {}, label: translate("Supervisado por"), labelPosition: "top" },
                        {},
                        {}
                    ]
                },
                {
                    cols: [
                        { view: "combo", id: "cmbArea", name: "areaId", required: true, options: {}, label: translate("Area"), labelPosition: "top" },
                        { view: "combo", id: "cmbUnidadNegocio", name: "unidadNegocioId", required: true, options: {}, label: translate("Unidad negocio"), labelPosition: "top" },
                        { view: "combo", id: "cmbEmpresa", name: "empresaId", required: true, options: {}, label: translate("Empresa"), labelPosition: "top" },
                        { view: "combo", id: "cmbPais", name: "paisId", required: true, options: {}, label: translate("Pais"), labelPosition: "top" },
                        { view: "datepicker",id:"fechaCreacion", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaCreacion", label: translate("Fecha creación"), labelPosition: "top"},
                    ]
                }
                // {
                //     cols: [

                        
                //     ]
                // },
                // {
                //     cols: [
                //         
                        

                //     ]
                // },
                // 
            ]
        };
        const tabDatosOportunidad = {
            header: translate("Datos oportunidad"),
            body: {
                cols: [
                    {
                        gravity: 5,
                        rows: [
                            cellDesc2,
                            cellPlanificacion,
                            cellGeneral
                        ]
                    },
                    {
                        gravity: 2,
                        rows: [
                            cellEconomico2
                        ]
                    }
                ]
            }
        };

        const cellDatosComplementarios2 = {
            padding: 10, margin: 10, css: "fondocelda",
            cols: [
                {
                    rows: [
                        { view: "textarea", name: "alcance", label: translate("Alcance de los trabajos (Descripción completa)"), labelPosition: "top", height:400 },
                        { view: "textarea", name: "sinergias", label: translate("Sinergias con otros contratos"), labelPosition: "top" , height:150},
                        { view: "textarea", name: "estrategiaGDES", label: translate("Estrategia tomada en la Oferta"), labelPosition: "top", height:150 },
                        { view: "textarea", name: "diferencialGDES", label: translate("Valor añadido GDES"), labelPosition: "top", height:150 },
                        { view: "textarea", id: "documentosEspeciales", name: "documentosEspeciales", label: translate("Documentos aplicables"), labelPosition: "top", height:150 }
                    ]
                },
                {
                    rows: [
                        { view: "textarea", name: "riesgos", label: translate("Riesgos y mitigaciones"), labelPosition: "top", height:400  },
                        { view: "textarea", name: "puntosRelevantes", label: translate("Equipo y organización"), labelPosition: "top" },
                        { view: "textarea", name: "garantiasEspecialesTXT", label: translate("Datos Laborales"), labelPosition: "top" },
                    ]
                },
                {
                    rows: [
                        { view: "text", name: "competidores", label: translate("Competidores"), labelPosition: "top", height:85 },
                        {
                            cols: [
                                { view: "text", name: "principalCompetidor", label: translate("Principal Competidor"), labelPosition: "top" },
                                {}
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "proveedorActual", label: translate("Proveedor Actual"), labelPosition: "top" },
                                {}
                            ]
                        },
                        {
                            cols: [
                                { view: "textarea", name: "datosComerciales", label: translate("Información comercial"), labelPosition: "top", height:100  },
                            ]
                        },
                        {
                            cols: [
                                { view: "textarea", name: "criteriosEvaluacion", label: translate("Criterios de Evaluación"), labelPosition: "top", height:100  },
                            ]
                        },
                        {
                            cols: [
                                { view: "textarea", name: "condicionesEstandarTXT", label: translate("Datos contractuales (Penalizaciones, Garantías, Seguros, etc)"), labelPosition: "top", height:100  },
                            ]
                        },
                        {
                            cols: [
                                { rows: [{ view: "checkbox", name: "laboral", options: {}, label: translate("Laboral"), labelPosition: "top" }] },
                                { rows: [{ view: "checkbox", name: "finanzas", options: {}, label: translate("Finanzas"), labelPosition: "top" }] },
                            ]
                        },
                        {
                            cols: [
                                {},
                                { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaComite", label: translate("Fecha Comite Oferta"), labelPosition: "top", width:150 },
                            ]
                        }
                    ]
                }
            ]
        }
        const tabDatosComplementarios = {
            header: translate("Datos complementarios"),
            body: {
                rows: [
                    {
                        cols: [
                            cellDatosComplementarios2
                        ]
                    }
                ]
            }
        };
        const tabDatosFinancieros = {
            header: translate("Datos financieros"),
            body: {
                id: "financieros", view: "ckeditor", name: "financieros", heigth: 900
            }
        };
        /* const cellOportunidades = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("OPORTUNIDADES"), type: "section" },
                { view: "textarea", name: "actividadesRealizadas", label: translate("Actividades realizadas"), labelPosition: "top" },
                { view: "textarea", name: "actividadesPlanificadas", label: translate("Actividades planificadas"), labelPosition: "top" },
            ]
        }; */
        const cellProyectos = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("PROYECTOS"), type: "section" },
                { view: "textarea", name: "situacionProyecto", label: translate("Situación de proyecto"), labelPosition: "top", minHeight: 200 },
            ]
        };
       /*  const cellReclamaciones = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("RECLAMACIONES"), type: "section" },
                {
                    cols: [
                        {
                            rows: [
                                { view: "text", name: "importeReclamacion1", label: translate("Importe reclamación (1)"), labelPosition: "top", format: "1.111,00 €" },
                            ]
                        },
                        {
                            rows: [
                                { view: "textarea", name: "razonReclamacion1", label: translate("Razón reclamación (1)"), labelPosition: "top" }
                            ]
                        }

                    ]
                },
                {
                    cols: [
                        {
                            rows: [
                                { view: "text", name: "importeReclamacion2", label: translate("Importe reclamación (2)"), labelPosition: "top", format: "1.111,00 €" },
                            ]
                        },
                        {
                            rows: [
                                { view: "textarea", name: "razonReclamacion2", label: translate("Razón reclamación (2)"), labelPosition: "top" }
                            ]
                        }

                    ]
                },
                {
                    cols: [
                        {
                            rows: [
                                { view: "text", name: "importeReclamacion3", label: translate("Importe reclamación (3)"), labelPosition: "top", format: "1.111,00 €" },
                            ]
                        },
                        {
                            rows: [
                                { view: "textarea", name: "razonReclamacion3", label: translate("Razón reclamación (3)"), labelPosition: "top" }
                            ]
                        }

                    ]
                },
                {
                    cols: [
                        {
                            rows: [
                                { view: "text", name: "importeReclamacion4", label: translate("Importe reclamación (4)"), labelPosition: "top", format: "1.111,00 €" },
                            ]
                        },
                        {
                            rows: [
                                { view: "textarea", name: "razonReclamacion4", label: translate("Razón reclamación (4)"), labelPosition: "top" }
                            ]
                        }

                    ]
                }
            ]
        }; */
        const cellNotas = {
            padding: 5, css: "fondocelda",
            rows: [
                { template: translate("NOTAS"), type: "section" },
                { view: "textarea", name: "observaciones", label: translate("Observaciones"), labelPosition: "top", minHeight: 200 }
            ]
        };
        const tabAnotaciones = {
            header: translate("Anotaciones"),
            body: {
                rows: [
                    {
                        cols: [
                            //cellOportunidades,
                            cellProyectos
                        ]
                    },
                    {
                        cols: [
                            //cellReclamaciones,
                            cellNotas
                        ]
                    }
                ]
            }
        };
        const tabAnexos = {
            header: translate("Anexos"),
            body: {
                id: "anexos", view: "ckeditor", name: "anexos", heigth: 900
            }
        };

        const ofertaData = {
            view: "form",
            id: "frmOfertas",
            scroll: true,
            height: 1080,
            elements: [
                {
                    view: "tabview",
                    multiview: { keepViews: true },
                    cells: [
                        tabDatosOportunidad,
                        tabDatosComplementarios,
                        tabDatosFinancieros,
                        tabAnotaciones,
                        tabAnexos
                    ]
                },
                {
                    margin: 5, cols: [
                        { gravity: 5 },
                        { view: "button", label: translate("Copiar Oferta"), click: this.copiarOferta },
                        { view: "button", label: translate("Cancelar"), click: this.cancel, hotkey: "esc" },
                        { view: "button", label: translate("Guardar sin salir"), click: this.accept2 },
                        { view: "button", label: translate("Aceptar"), click: this.accept, type: "form" }

                    ]
                },
                { minlength: 600 }
            ]
        };

        const _view = {
            view: "layout",
            id: "ofertasForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-arrow-decision-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Ofertas") },
                        { view: "label", id: "sId", label: " ID: " + ofertaId },
                        { view: "label", id: "sVersion", label: " VRS: " + numVersion }
                    ]
                },
                {
                    view: "accordion",
                    cols: [
                        { header: "Datos de la oferta", id: "Acc1", body: ofertaData, collapsed: false },
                        { header: "Hitos facturación", id: "Acc5", body: { $subview: "ofertasHitos" }, collapsed: true },
                        { header: "Versiones", id: "Acc2", body: { $subview: "versiones" }, collapsed: true },
                        { header: "Seguidores", id: "Acc3", body: { $subview: "seguidores" }, collapsed: true },
                        { header: "PPR", id: "Acc4", body: { $subview: "pprview" }, collapsed: true },
                    ]
                }

            ]
        }
        return _view;
    }
    urlChange(view, url) {
        // Cambiar el form para adaptarlo a desplazamientos
        $$('frmOfertas').config.height = window.innerHeight - 150;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        if (url[0].params.ofertaId) {
            ofertaId = url[0].params.ofertaId;
        }
        this.load(ofertaId);
        webix.delay(function () { $$("firstField").focus(); });
        $$("Acc2").collapse();
        $$("Acc3").collapse();
        // onChange events
        $$("cmbPais").attachEvent("onChange", (nv, ov) => {
            this.getDocumentosAplicables(nv);
        });
        $$("cmbEstado").attachEvent("onChange", (nv, ov) => {
            this.cambioEstado(nv);
        });
        $$("cmbArea").attachEvent("onChange", (nv, ov) => {
            this.cambioArea(nv);
        }); 
        $$("cmbEmpresa").attachEvent("onChange", (nv, ov) => {
            this.cambioEmpresa(nv);
        });
        $$("cmbUbicacion").attachEvent("onChange", (nv, ov) => {
            this.cambioUbicacion(nv);
        });         
        $$("cmbFaseOferta").attachEvent("onChange", (nv, ov) => {
            if (nv != 3 && ofertaId == 0) {
                // Si en el alta de una oferta la pasan a algo que no sea oferta
                // Entonces los códigos cambian
                var c1 = "OP-" + _contador;
                console.log('VAL', c1);
                $$("numeroOferta").setValue(c1);
                $$("codigoOferta").setValue(c1);
            }
            if (nv == 3 && ov == 1) {
                // Si una oportunidad pasa a oferta grabamos los campos correspondientes
                $$("codigoOp").setValue($$("codigoOferta").getValue());
                $$("conversionOportunidad").setValue(true);
                $$("fechaConversionOportunidad").setValue(new Date());
                this.getNumeroCodigoOferta();
            }
        });
        $$("importePresupuesto").attachEvent("onBlur", (nv, ov) => { this.calcImporte(); });
        $$("margenContribucion").attachEvent("onBlur", (nv, ov) => { this.calcImporte(); });
        $$("importeUTE").attachEvent("onBlur", (nv, ov) => { this.calcImporte(); });
        $$("multiplicador").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        $$("importePresupuestoDivisa").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        $$("importeUTEDivisa").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        // $$("importeAnualDivisa").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        // $$("importePrimerAnoDivisa").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        $$("importeInversionDivisa").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        $$("importeMaxLicitacionDivisa").attachEvent("onBlur", (nv, ov) => { this.calcFromDivisa(); });
        // this.pprReport = this.ui(PprReport);
        this.ubicacionesWindow = this.ui(UbicacionesWindow);
        //
    }
    load(ofertaId) {
        let usu = usuarioService.getUsuarioCookie();
        _usuario = usu;
        if (ofertaId == 0) {
            this.loadUsuarios();
            this.loadUsuariosResponsables();
            this.loadAreas();
            this.loadUbicaciones();
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
            this.loadDivisas(1);
            this.loadProyectosCentral('0');
            this.getNumeroCodigoOferta();
            this.getDocumentosAplicables(usu.paisId);
            this.setValoresPorDefectoUsuario(usu);
            $$("multiplicador").setValue(1);
            this.$$("fechaCreacion").setValue(new Date());
            ofertaId = 0;
            numVersion = 0;
            return;
        }
        ofertasService.getOferta(usuarioService.getUsuarioCookie(), ofertaId)
            .then((oferta) => {
                oferta.fechaEntrega = new Date(oferta.fechaEntrega);
                oferta.fechaAdjudicacion = new Date(oferta.fechaAdjudicacion);
                oferta.fechaInicioContrato = new Date(oferta.fechaInicioContrato);
                oferta.fechaFinContrato = new Date(oferta.fechaFinContrato);
                oferta.fechaOferta = new Date(oferta.fechaOferta);
                oferta.fechaUltimoEstado = new Date(oferta.fechaUltimoEstado);
                if (oferta.fechaComite) oferta.fechaComite = new Date(oferta.fechaComite);
                if (oferta.fechaCreacion) oferta.fechaCreacion = new Date(oferta.fechaCreacion);
                $$("frmOfertas").setValues(oferta);
                this.loadUsuarios(oferta.usuarioId);
                this.loadUsuariosResponsables(oferta.usuResponsableId);
                this.loadAreas(oferta.areaId);
                this.loadUbicaciones(oferta.ubicacionId);
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
                this.loadProyectosCentral(oferta.proyectoCodigo)
                _originalFaseOfertaId = oferta.faseOfertaId;
                _originalImporte = oferta.importePresupuesto;
                ofertaId = oferta.ofertaId;
                numVersion = oferta.version;
                $$("sId").config.label = "ID: " + ofertaId;
                $$("sId").refresh();
                $$("sVersion").config.label = "VRS: " + numVersion;
                $$("sVersion").refresh();
                this.salvarLosImportesOriginales(oferta);
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
        data = ofertasService.cleanData(data);
        if (!data.margenContribucion) {
            data.margenContribucion = 0;
        }
        // Control de valores nulos en determinados casos 
        console.log("IMPUTE", data.importeUTE);
        if (!data.importeUTE) data.importeUTE = 0;
        if (!data.margenContribucion) data.margenContribucion = 0;
        if (!data.importeContribucion) data.importeContribucion = 0;
        if (!data.importeInversion) data.importeInversion = 0;
        if (data.estadoId === 5 && !data.razonPerdidaId) {
            messageApi.errorMessage(translate("Debe incluir una razón de pérdida de la oferta"));
            return;            
        }
        if (ofertaId == 0) {
            data.ofertaId = 0;
            data.version = 0;
            data.fechaOferta = new Date();
            ofertasService.postOferta(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    console.log('Vuelve del post');
                    data.ofertaId = result.ofertaId;
                    return this.$scope.guardarVersionCero(data);
                })
                .then(() => {
                    console.log('Vuelve de la creación de version');
                    this.$scope.show('/top/ofertas?ofertaId=' + data.ofertaId);
                })
                .catch((err) => {
                    console.log('ERR POST', err);
                    messageApi.errorMessageAjax(err);
                });
        } else {
            if (!data.version) {
                data.version = 0;
            }
            // Comprobar si ha habido cambios de importes para crear versión.
            if (!this.$scope.comprobarCambioDeImportes()) {
                console.log('DATOS A GRABAR', data);
                ofertasService.putOferta(usuarioService.getUsuarioCookie(), data)
                    .then(() => {
                        this.$scope.show('/top/ofertas?ofertaId=' + data.ofertaId);
                    })
                    .catch((err) => {
                        messageApi.errorMessageAjax(err);
                    });
            } else {

                webix.confirm({
                    title: translate("Cambio de condiciones"),
                    text: translate("Han cambiado las condiciones económicas de la oferta. ¿Quiere crear una versión con las nuevas condiciones?"),
                    ok: translate("Crear versión"),
                    cancel: translate("No crear"),
                    callback: (action) => {
                        if (action === true) {
                            data.version = data.version + 1;
                            this.$scope.guardarVersionNueva(data.version)
                                .then(() => {
                                    return ofertasService.putOferta(usuarioService.getUsuarioCookie(), data);
                                })
                                .then(() => {
                                    this.$scope.show('/top/ofertas?ofertaId=' + data.ofertaId);
                                })
                                .catch((err) => {
                                    messageApi.errorMessageAjax(err);
                                });
                        } else {
                            this.$scope.guardarVersionActual(data.version)
                            .then(()=> {
                                return ofertasService.putOferta(usuarioService.getUsuarioCookie(), data);
                            })
                            .then(() => {
                                this.$scope.show('/top/ofertas?ofertaId=' + data.ofertaId);
                            })
                            .catch((err) => {
                                messageApi.errorMessageAjax(err);
                            });
                        }
                    }
                });
            }

        }
    }

    loadUnidadesNegocio(unidadNegocioId) {
        unidadesNegocioService.getUnidadesNegocio(usuarioService.getUsuarioCookie())
            .then(rows => {
                var nombre = 'nombre';
                if (_usuario.codigoIdioma === 'en') nombre = 'nombreEN';
                if (_usuario.codigoIdioma === 'fr') nombre = 'nombreFR';
                var ofertas = generalApi.prepareDataForCombo('unidadNegocioId', nombre, rows);
                var list = $$("cmbUnidadNegocio").getPopup().getList();
                list.clearAll();
                list.parse(ofertas);
                if (unidadNegocioId) {
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
                if (usuarioId) {
                    $$("cmbUsuario").setValue(usuarioId);
                    $$("cmbUsuario").refresh();
                }
                return;
            });
    }

    loadUsuariosResponsables(usuResponsableId) {
        usuarioService.getUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var usuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', rows);
                var list = $$("cmbUsuResponsableId").getPopup().getList();
                list.clearAll();
                list.parse(usuarios);
                if (usuResponsableId) {
                    $$("cmbUsuResponsableId").setValue(usuResponsableId);
                    $$("cmbUsuResponsableId").refresh();
                }
                return;
            });
    }

    loadAreas(areaId) {
        areasService.getAreas(usuarioService.getUsuarioCookie())
            .then(rows => {
                var nombre = 'nombre';
                if (_usuario.codigoIdioma === 'en') nombre = 'nombreEN';
                if (_usuario.codigoIdioma === 'fr') nombre = 'nombreFR';
                var areas = generalApi.prepareDataForCombo('areaId', nombre, rows);
                var list = $$("cmbArea").getPopup().getList();
                list.clearAll();
                list.parse(areas);
                if (areaId) {
                    $$("cmbArea").setValue(areaId);
                    $$("cmbArea").refresh();
                }
                return;
            });
    }

    loadUbicaciones(ubicacionId) {
        ubicacionesService.getUbicaciones(usuarioService.getUsuarioCookie())
            .then(rows => {
                var ubicaciones = generalApi.prepareDataForCombo('ubicacionId', 'nombre', rows);
                var list = $$("cmbUbicacion").getPopup().getList();
                list.clearAll();
                list.parse(ubicaciones);
                if (ubicacionId) {
                    $$("cmbUbicacion").setValue(ubicacionId);
                    $$("cmbUbicacion").refresh();
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
                if (usuarioId) {
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
                if (empresaId) {
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
                if (paisId) {
                    $$("cmbPais").setValue(paisId);
                    $$("cmbPais").refresh();
                }
                return;
            });
    }

    loadServicios(servicioId) {
        serviciosService.getServiciosMulti(usuarioService.getUsuarioCookie())
            .then(rows => {
                var nombre = 'nombre';
                if (_usuario.codigoIdioma === 'en') nombre = 'nombreEN';
                if (_usuario.codigoIdioma === 'fr') nombre = 'nombreFR';
                var servicios = generalApi.prepareDataForCombo('servicioId', nombre, rows);
                var list = $$("cmbServicio").getPopup().getList();
                list.clearAll();
                list.parse(servicios);
                if (servicioId) {
                    $$("cmbServicio").setValue(servicioId);
                    $$("cmbServicio").refresh();
                }
                return;
            });
    }

    loadProyectosCentral(codigo) {
        console.log("proyectosCentralService.getSyncProyectosCentral");
        proyectosCentralService.getProyectosCentral(usuarioService.getUsuarioCookie())
            .then(rows => {
                var nombre = 'nombre';
                var servicios = generalApi.prepareDataForCombo('codigo', nombre, rows);
                var list = $$("cmbProyectosCentral").getPopup().getList();
                list.clearAll();
                list.parse(servicios);
                if (codigo) {
                    $$("cmbProyectosCentral").setValue(codigo);
                    $$("cmbProyectosCentral").refresh();
                }
                return;
            });
    }

    loadFasesOferta(faseOfertaId) {
        fasesOfertaService.getFasesOferta(usuarioService.getUsuarioCookie())
            .then(rows => {
                var nombre = 'nombre';
                if (_usuario.codigoIdioma === 'en') nombre = 'nombreEN';
                if (_usuario.codigoIdioma === 'fr') nombre = 'nombreFR';
                var fasesOferta = generalApi.prepareDataForCombo('faseOfertaId', nombre, rows);
                var list = $$("cmbFaseOferta").getPopup().getList();
                list.clearAll();
                list.parse(fasesOferta);
                if (faseOfertaId) {
                    $$("cmbFaseOferta").setValue(faseOfertaId);
                    $$("cmbFaseOferta").refresh();
                }
                return;
            });
    }

    loadTiposOportunidad(tipoOportunidadId) {
        tiposOportunidadService.getTiposOportunidad(usuarioService.getUsuarioCookie())
            .then(rows => {
                var nombre = 'nombre';
                if (_usuario.codigoIdioma === 'en') nombre = 'nombreEN';
                if (_usuario.codigoIdioma === 'fr') nombre = 'nombreFR';
                var tipos = generalApi.prepareDataForCombo('tipoOportunidadId', nombre, rows);
                var list = $$("cmbTipoOportunidad").getPopup().getList();
                list.clearAll();
                list.parse(tipos);
                if (tipoOportunidadId) {
                    $$("cmbTipoOportunidad").setValue(tipoOportunidadId);
                    $$("cmbTipoOportunidad").refresh();
                }
                return;
            });
    }

    loadTiposContrato(tipoContratoId) {
        tiposContratoService.getTiposContrato(usuarioService.getUsuarioCookie())
            .then(rows => {
                var nombre = 'nombre';
                if (_usuario.codigoIdioma === 'en') nombre = 'nombreEN';
                if (_usuario.codigoIdioma === 'fr') nombre = 'nombreFR';
                var tipos = generalApi.prepareDataForCombo('tipoContratoId', nombre, rows);
                var list = $$("cmbTipoContrato").getPopup().getList();
                list.clearAll();
                list.parse(tipos);
                if (tipoContratoId) {
                    $$("cmbTipoContrato").setValue(tipoContratoId);
                    $$("cmbTipoContrato").refresh();
                }
                return;
            });
    }

    loadProbabilidades(probabilidad) {
        var probabilidades = [
            { id: 20, value: "20%" },
            { id: 50, value: "50%" },
            { id: 80, value: "80%" },
            { id: 100, value: "100%" }
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
                var nombre = 'nombre';
                if (_usuario.codigoIdioma === 'en') nombre = 'nombreEN';
                if (_usuario.codigoIdioma === 'fr') nombre = 'nombreFR';
                var estados = generalApi.prepareDataForCombo('estadoId', nombre, rows);
                var list = $$("cmbEstado").getPopup().getList();
                list.clearAll();
                list.parse(estados);
                if (estadoId) {
                    $$("cmbEstado").setValue(estadoId);
                    $$("cmbEstado").refresh();
                }
                return;
            });
    }

    loadRazonesPerdida(razonPerdidaId) {
        razonesPerdidaService.getRazonesPerdida(usuarioService.getUsuarioCookie())
            .then(rows => {
                var nombre = 'nombre';
                if (_usuario.codigoIdioma === 'en') nombre = 'nombreEN';
                if (_usuario.codigoIdioma === 'fr') nombre = 'nombreFR';
                var razones = generalApi.prepareDataForCombo('razonPerdidaId', nombre, rows);
                var list = $$("cmbRazonPerdida").getPopup().getList();
                list.clearAll();
                list.parse(razones);
                if (razonPerdidaId) {
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
                if (divisaId) {
                    $$("cmbDivisa").setValue(divisaId);
                    $$("cmbDivisa").refresh();
                }
                return;
            });
    }

    getNumeroCodigoOferta() {
        parametrosService.getParametrosContadores(usuarioService.getUsuarioCookie())
            .then(data => {
                _contador = data.numeroOferta;
                $$("numeroOferta").setValue(data.numeroOferta);
                $$("codigoOferta").setValue(data.codigoOferta);
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }

    getDocumentosAplicables(paisId) {
        let codPais = "";
        paisesService.getPais(usuarioService.getUsuarioCookie(), paisId)
            .then(pais => {
                codPais = pais.codPais;
                return parametrosService.getParametros(usuarioService.getUsuarioCookie());
            })
            .then(parametros => {
                var docApp = parametros.docAppSpain;
                if (codPais == "UK") docApp = parametros.docAppUk;
                if (codPais == "FR") docApp = parametros.docAppFrance;
                $$("documentosEspeciales").setValue(docApp);
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }

    setValoresPorDefectoUsuario(usu) {
        $$("cmbUsuario").setValue(usu.usuarioId);
        this.loadRR2();
        $$("cmbResponsable").setValue(usu.responsableId);
        $$("cmbPais").setValue(usu.paisId);
        $$("cmbEmpresa").setValue(usu.empresaId);
        $$("cmbUnidadNegocio").setValue(usu.unidadNegocioId);
        $$("cmbArea").setValue(usu.areaId);
        // $$("ubicacion").setValue(usu.ubicacion);
    }

    calcImporte() {
        // Calcular el importe de contribución a partir del margen
        let importe = +$$("importePresupuesto").getValue();
        let margen = +$$("margenContribucion").getValue();
        let multiplicador = +$$("multiplicador").getValue();
        let importeContribucion = 0;
        if (margen !== 0) {
            importeContribucion = (margen * importe * 1.0) / 100.00;
        } 
        let importeContribucionDivisa = importeContribucion * multiplicador * 1.0;
        $$("importeContribucion").setValue(importeContribucion);
        $$("importeContribucionDivisa").setValue(importeContribucionDivisa);
        let importeDivisa = importe * multiplicador;
        if (importeDivisa) $$("importePresupuestoDivisa").setValue(importeDivisa);
        // Obliga a recalcular el total
        let importeTotal = +$$("importePresupuesto").getValue() + +$$("importeUTE").getValue();
        $$("importeTotal").setValue(importeTotal);
        let importeTotalDivisa = importeTotal * multiplicador;
        if (importeTotalDivisa) $$("importeTotalDivisa").setValue(importeTotalDivisa);
        let importeUTE = +$$("importeUTE").getValue();
        let importeUTEDivisa = importeUTE * multiplicador
        if (importeUTEDivisa) $$("importeUTEDivisa").setValue(importeUTEDivisa);
        this.getTextoAutorizacion();
    }

    calcFromDivisa() {
        let multiplicador = +$$("multiplicador").getValue();
        if (multiplicador != 0) {
            let importePresupuesto = +$$("importePresupuestoDivisa").getValue() / multiplicador;
            $$("importePresupuesto").setValue(importePresupuesto);
            let importeUTE = +$$("importeUTEDivisa").getValue() / multiplicador;
            $$("importeUTE").setValue(importeUTE);
            // let importeAnual = +$$("importeAnualDivisa").getValue() / multiplicador;
            // $$("importeAnual").setValue(importeAnual);
            // let importePrimerAno = +$$("importePrimerAnoDivisa").getValue() / multiplicador;
            // $$("importePrimerAno").setValue(importePrimerAno);
            let importeInversion = +$$("importeInversionDivisa").getValue() / multiplicador;
            $$("importeInversion").setValue(importeInversion);
            let importeMaxLicitacion = +$$("importeMaxLicitacionDivisa").getValue() / multiplicador;
            $$("importeMaxLicitacion").setValue(importeMaxLicitacion);
            this.calcImporte();
        }
    }

    getTextoAutorizacion() {
        const translate = this.app.getService("locale")._;
        let importe = +$$("importePresupuesto").getValue();
        let ofertaSingular = +$$("ofertaSingular").getValue();
        let tAut = "0";
        if (importe > 150000) {
            tAut = "1";
        }
        if (importe > 300000) {
            tAut = "2";
        }
        if (importe > 1000000) {
            tAut = "3";
        }
        if (ofertaSingular) {
            tAut = "3";
        }
        let authTxt = translate('autorizacion' + tAut);
        $$("autorizaciones").setValue(authTxt);
    }

    // comprobarCambioDeImportes:
    // Esta función comprueba si los importes han cambiado desde que se 
    // cargó la ventana para su modificación. La idea es que si se ha produciso el
    // cambio se oferte guardar la versión anterior.
    comprobarCambioDeImportes() {
        let cambioImporte = false;
        const cambiador = {
            importePresupuestoAnt: _importePresupuesto,
            importePresupuesto: $$('importePresupuesto').getValue(),
            importeUTEAnt: _importeUTE,
            importeUTE: $$('importeUTE').getValue(),
            importeTotalAnt: _importeTotal,
            importeTotal: $$('importeTotal').getValue(),
            margenContribucionAnt: _margenContribucion,
            margenContribucion:$$('margenContribucion').getValue(),
            importeContribucionAnt: _importeContribucion,
            importeContribucion: $$('importeContribucion').getValue(),
            importeInversionAnt: _importeInversion,
            importeInversion: $$('importeInversion').getValue(),
            multiplicadorAnt:  _multiplicador,
            multiplicador: $$('multiplicador').getValue()
        };
        if (_importePresupuesto != $$('importePresupuesto').getValue() ||
            _importeUTE != $$('importeUTE').getValue() ||
            _importeTotal != $$('importeTotal').getValue() ||
            _margenContribucion != $$('margenContribucion').getValue() ||
            _importeContribucion != $$('importeContribucion').getValue() ||
            _importeInversion != $$('importeInversion').getValue() ||
            _multiplicador != $$('multiplicador').getValue()) {
            cambioImporte = true;
        }
        return cambioImporte;
    }

    // salvarLosImportesOriginales: 
    // En esta función se salvan los importes originales cuando se cargó el formulario 
    // para poder comparalos cuando se salve con los actuales.
    salvarLosImportesOriginales(oferta) {
        _importePresupuesto = oferta.importePresupuesto;
        _importeUTE = oferta.importeUTE;
        _importeTotal = oferta.importeTotal;
        _margenContribucion = oferta.margenContribucion;
        _importeContribucion = oferta.importeContribucion;
        _importeAnual = oferta.importeAnual;
        _importePrimerAno = oferta.importePrimerAno;
        _importeInversion = oferta.importeInversion;
        _multiplicador = oferta.multiplicador;
    }

    // guardarVersionAntigua:
    // Crea un nuevo registro de versión con los datos de la oferta antigua
    // y el número de versión pasado.
    // IMPORTANTE: devuelve una promesa.
    guardarVersionAntigua(nversion) {
        let divisaId = null;
        if ($$('cmbDivisa').getValue()) divisaId = $$('cmbDivisa').getValue();
        let usu = usuarioService.getUsuarioCookie()
        let data = {
            ofertaId: ofertaId,
            fechaCambio: new Date(),
            usuarioId: usu.usuarioId,
            importePresupuesto: _importePresupuesto,
            importeUTE: _importeUTE,
            importeTotal: _importeTotal,
            margenContribucion: _margenContribucion,
            importeContribucion: _importeContribucion,
            importeAnual: _importeAnual,
            importePrimerAno: _importePrimerAno,
            importeInversion: _importeInversion,
            divisaId: divisaId,
            multiplicador: _multiplicador,
            numVersion: nversion
        };
        return versionesService.postVersion(usu, data);
    }

    guardarVersionActual(nversion) {
        let divisaId = null;
        if ($$('cmbDivisa').getValue()) divisaId = $$('cmbDivisa').getValue();
        let usu = usuarioService.getUsuarioCookie()
        let data = {
            ofertaId: ofertaId,
            fechaCambio: new Date(),
            usuarioId: usu.usuarioId,
            importePresupuesto: $$('importePresupuesto').getValue(),
            importeUTE: $$('importeUTE').getValue(),
            importeTotal: $$('importeTotal').getValue(),
            margenContribucion: $$('margenContribucion').getValue(),
            importeContribucion: $$('importeContribucion').getValue(),
            importeInversion: $$('importeInversion').getValue(),
            divisaId: divisaId,
            multiplicador: $$('multiplicador').getValue(),
            numVersion: nversion
        };
        return versionesService.putVersion(usu, data);
    }

    guardarVersionNueva(nversion) {
        let divisaId = null;
        if ($$('cmbDivisa').getValue()) divisaId = $$('cmbDivisa').getValue();
        let usu = usuarioService.getUsuarioCookie()
        let data = {
            ofertaId: ofertaId,
            fechaCambio: new Date(),
            usuarioId: usu.usuarioId,
            importePresupuesto: $$('importePresupuesto').getValue(),
            importeUTE: $$('importeUTE').getValue(),
            importeTotal: $$('importeTotal').getValue(),
            margenContribucion: $$('margenContribucion').getValue(),
            importeContribucion: $$('importeContribucion').getValue(),
            importeInversion: $$('importeInversion').getValue(),
            divisaId: divisaId,
            multiplicador: $$('multiplicador').getValue(),
            numVersion: nversion
        };
        return versionesService.postVersion(usu, data);
    }

    // guardarVersionCero
    // Crea el registro de version cero con la oferta actual 
    // modificados. IMPORTANTE: devuelve una promesa.
    guardarVersionCero(oferta) {
        let usu = usuarioService.getUsuarioCookie()
        let data = {
            ofertaId: oferta.ofertaId,
            fechaCambio: new Date(),
            usuarioId: usu.usuarioId,
            importePresupuesto: oferta.importePresupuesto,
            importeUTE: oferta.importeUTE,
            importeTotal: oferta.importeTotal,
            margenContribucion: oferta.margenContribucion,
            importeContribucion: oferta.importeContribucion,
            importeAnual: oferta.importeAnual,
            importePrimerAno: oferta.importePrimerAno,
            importeInversion: oferta.importeInversion,
            divisaId: oferta.divisaId,
            multiplicador: oferta.multiplicador,
            numVersion: 0
        };
        return versionesService.postVersion(usu, data);
    }

    // rptType1() {
    //     this.$scope.pprReport.showWindow(ofertaId, 1);
    // }

    // rptType2() {
    //     this.$scope.pprReport.showWindow(ofertaId, 2);
    // }

    // rptType3() {
    //     this.$scope.pprReport.showWindow(ofertaId, 3);
    // }

    copiarOferta() {
        const translate = this.$scope.app.getService("locale")._;
        webix.confirm(translate("¿Seguro que quiere crear una nueva oferta copiando los datos de esta?"), (action) => {
            if (action === true) {
                var oferta;
                parametrosService.getParametrosContadores(usuarioService.getUsuarioCookie())
                .then(data2 => {
                    console.log('DATA2', data2);
                    _contador = data2.numeroOferta;
                    $$("numeroOferta").setValue(data2.numeroOferta);
                    $$("codigoOferta").setValue(data2.codigoOferta);
                    var data = $$("frmOfertas").getValues();
                    data = ofertasService.cleanData(data);
                    data.ofertaId = 0;
                    data.fechaOferta = new Date();
                    data.fechaCreacion = new Date();
                    console.log('DATA', data);
                    oferta = data;
                    return ofertasService.postOferta(usuarioService.getUsuarioCookie(), data);
                })
                .then((result) => {
                    oferta.ofertaId = result.ofertaId;
                    return this.$scope.guardarVersionCero(oferta);
                })
                .then(() => {
                    this.$scope.show('/top/ofertas?ofertaId=' + oferta.ofertaId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
            }
        })
    }

    cambioEstado(nv) {
        // Oferta ganada
        if (nv === 2) {
            $$("cmbProbabilidad").setValue({ id: 100, value: "100%" });
            $$("cmbProbabilidad").refresh();
        }
    }

    loadRR2() {
        let usu = usuarioService.getUsuarioCookie();
        usuarioService.getUsuario(usu, usu.usuarioId)
        .then(data => {
            $$("cmbUsuResponsableId").setValue(data.rr2);
        })
        .catch((err) => {
            messageApi.errorMessageAjax(err);
        })
    }

    cambioArea(nv) {
        let usu = usuarioService.getUsuarioCookie();
        areasService.getArea(usu, nv)
        .then(data => {
            $$("cmbUnidadNegocio").setValue(data.unidadNegocioId);
        })
        .catch((err) => {
            messageApi.errorMessageAjax(err);
        })
    }

    cambioUbicacion(nv) {
        let usu = usuarioService.getUsuarioCookie();
        ubicacionesService.getUbicacion(usu, nv)
        .then(data => {
            if (data.paisUbicacion) {
                $$("paisUbicacion").setValue(data.paisUbicacion);
            }
        })
        .catch((err) => {
            messageApi.errorMessageAjax(err);
        })
    }

    cambioEmpresa(nv) {
        let usu = usuarioService.getUsuarioCookie();
        empresasService.getEmpresa(usu, nv)
        .then(data => {
            $$("cmbPais").setValue(data.paisId);
        })
        .catch((err) => {
            messageApi.errorMessageAjax(err);
        })
    }

    accept2() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmOfertas").validate({ hidden: true })) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmOfertas").getValues();
        data = ofertasService.cleanData(data);
        if (!data.margenContribucion) {
            data.margenContribucion = 0;
        }
        // Control de valores nulos en determinados casos 
        if (!data.importeUTE) data.importeUTE = 0;
        if (!data.margenContribucion) data.margenContribucion = 0;
        if (!data.importeContribucion) data.importeContribucion = 0;
        if (!data.importeInversion) data.importeInversion = 0;
        if (data.estadoId === 5 && !data.razonPerdidaId) {
            messageApi.errorMessage(translate("Debe incluir una razón de pérdida de la oferta"));
            return;            
        }
        if (ofertaId == 0) {
            data.ofertaId = 0;
            data.version = 0;
            data.fechaOferta = new Date();
            ofertasService.postOferta(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    data.ofertaId = result.ofertaId;
                    return this.$scope.guardarVersionCero(data);
                })
                .then(() => {
                    messageApi.normalMessage(translate("Oferta guardada"), "");
                    this.$scope.show('/top/ofertasForm?ofertaId=' + data.ofertaId);
                    this.$scope.load(data.ofertaId);
                    ofertaId = data.ofertaId;
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            if (!data.version) {
                data.version = 0;
            }
            // Comprobar si ha habido cambios de importes para crear versión.
            if (!this.$scope.comprobarCambioDeImportes()) {
                console.log('DATOS A GRABAR', data);
                ofertasService.putOferta(usuarioService.getUsuarioCookie(), data)
                    .then(() => {
                        messageApi.normalMessage(translate("Oferta guardada"), "");
                    })
                    .catch((err) => {
                        messageApi.errorMessageAjax(err);
                    });
            } else {

                webix.confirm({
                    title: translate("Cambio de condiciones"),
                    text: translate("Han cambiado las condiciones económicas de la oferta. ¿Quiere crear una versión con las nuevas condiciones?"),
                    ok: translate("Crear versión"),
                    cancel: translate("No crear"),
                    callback: (action) => {
                        if (action === true) {
                            data.version = data.version + 1;
                            this.$scope.guardarVersionNueva(data.version)
                                .then(() => {
                                    return ofertasService.putOferta(usuarioService.getUsuarioCookie(), data);
                                })
                                .then(() => {
                                    messageApi.normalMessage(translate("Oferta guardada"), "");
                                })
                                .catch((err) => {
                                    messageApi.errorMessageAjax(err);
                                });
                        } else {
                            this.$scope.guardarVersionActual(data.version)
                            .then(()=> {
                                return ofertasService.putOferta(usuarioService.getUsuarioCookie(), data);
                            })
                            .then(() => {
                                messageApi.normalMessage(translate("Oferta guardada"), "");
                            })
                            .catch((err) => {
                                messageApi.errorMessageAjax(err);
                            });
                        }
                    }
                });
            }

        }
    }

}