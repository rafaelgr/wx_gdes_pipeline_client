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
import { generalApi } from "../utilities/general";
import { messageApi } from "../utilities/messages";

var ofertaId = 0;

export default class OfertasWindow extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view1 = {
            view: "layout",
            id: "ofertasFormWindow",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-cube-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Nueva oferta") }
                    ]
                },
                {
                    view: "form",

                    id: "frmOfertasWindow",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "combo", id: "cmbUsuarioW", name: "usuarioId", required: true, options: {},
                                    label: translate("Usuario"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbAreaW", name: "areaId", required: true, options: {},
                                    label: translate("Area"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbUnidadNegocioW", name: "unidadNegocioId", required: true, options: {},
                                    label: translate("Unidad de negocio"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    view: "combo", id: "cmbResponsableW", name: "responsableId", required: true, options: {},
                                    label: translate("Responsable"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbEmpresaW", name: "empresaId", required: true, options: {},
                                    label: translate("Empresa"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbPaisW", name: "paisId", required: true, options: {},
                                    label: translate("Pais"), labelPosition: "top"
                                },
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "ofertaId", label: translate("ID"), labelPosition: "top", readonly: true },
                                { view: "text", id: "numeroOfertaW", name: "numeroOferta", required: true, label: translate("Nr. Oferta"), labelPosition: "top" },
                                { view: "text", id: "codigoOfertaW", name: "codigoOferta", required: true, label: translate("Cod. Oferta"), labelPosition: "top" }
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "nombreCortoW", label: translate("Nombre"), required: true, labelPosition: "top" },
                                { view: "text", name: "clienteW", label: translate("Cliente"), required: true, labelPosition: "top" },
                                { view: "text", id: "ubicacionW", name: "ubicacion", label: translate("Ubicación"), required: true, labelPosition: "top" }
                            ]
                        },
                        { view: "combo", id: "cmbServicioW", name: "servicioId", required: true, options: {}, label: translate("Servicio"), labelPosition: "top" },
                        {
                            cols: [
                                { view: "combo", id: "cmbFaseOfertaW", name: "faseOfertaId", required: true, options: {}, label: translate("Fase oferta"), labelPosition: "top" },
                                { view: "combo", id: "cmbTipoOportunidadW", name: "tipoOportunidadId", required: true, options: {}, label: translate("Tipo oportunidad"), labelPosition: "top" },
                                { view: "combo", id: "cmbTipoContratoW", name: "tipoContratoId", required: true, options: {}, label: translate("Tipo contrato"), labelPosition: "top" }
                            ]
                        },
                        {
                            cols: [
                                { view: "combo", id: "cmbEstadoW", name: "estadoId", required: true, options: {}, label: translate("Estado"), labelPosition: "top" },
                                { view: "combo", id: "cmbProbabilidadW", name: "probabilidad", required: true, options: {}, label: translate("Probabilidad"), labelPosition: "top" },
                                { view: "text", id: "importePresupuestoW", name: "importePresupuesto", required: true, label: translate("Importe GDES"), labelPosition: "top", format: "1.111,00 €" },
                                { view: "text", id: "margenContribucionW", name: "margenContribucion", required: true, label: translate("Margen contribución"), labelPosition: "top", format: "1.111,00 %" }
                            ]
                        },
                        {
                            cols: [
                                { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaAdjudicacion", required: true, label: translate("Fecha adjudicación"), labelPosition: "top" },
                                { view: "datepicker", editable: true, minDate: new Date(new Date("2000-01-01")), name: "fechaEntrega", required: true, label: translate("Fecha entrega"), labelPosition: "top" },
                                { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaInicioContrato", required: true, label: translate("Fecha inicio contrato"), labelPosition: "top" },
                                { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaFinContrato", required: true, label: translate("Fecha fin contrato"), labelPosition: "top" },
                                { view: "text", name: "duracion", label: translate("Duración"), required: true, labelPosition: "top" }
                            ]
                        },
                        { view: "textarea", name: "descripcion", label: translate("Descripción"), required: true, labelPosition: "top" },
                        { view: "textarea", name: "actividadesRealizadas", label: translate("Actividades realizadas"), labelPosition: "top" },
                        { view: "textarea", name: "actividadesPlanificadas", label: translate("Actividades planificadas"), labelPosition: "top" },
                        {
                            margin: 5, cols: [
                                { gravity: 5 },
                                { view: "button", label: translate("Cancelar"), click: this.cancel, hotkey: "esc" },
                                { view: "button", label: translate("Aceptar"), click: this.accept, type: "form", hotkey: "enter" }
                            ]
                        },
                        { minlength: 600 }
                    ]
                }
            ]
        }
        var _view = {
            view: "window",
            id: "ofertasWindow",
            position: "center", move: true, resize: true,
            width: 900,
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
        this.getNumeroCodigoOferta();
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
            ofertasService.postOferta(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    $$('ofertasWindow').hide();
                    this.$scope.show('/top/ofertas?ofertaId=' + result.ofertaId);
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
                console.log("Estdados: ", rows);
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
            { id: 0, value: "0%" },
            { id: 50, value: "50%" },
            { id: 80, value: "80%" }
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
        $$("ubicacionW").setValue(usu.ubicacion);
    }
}