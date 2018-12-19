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
import { generalApi } from "../utilities/general";

var ofertaId = 0;

export default class OfertasWindow extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view1 = {
            view: "layout",
            id: "ofertasForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-cube-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Nueva oferta") }
                    ]
                },
                {
                    view: "form",

                    id: "frmOfertas",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "combo", id: "cmbUsuario", name: "usuarioId", required: true, options: {},
                                    label: translate("Usuario"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbArea", name: "areaId", required: true, options: {},
                                    label: translate("Area"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbUnidadNegocio", name: "unidadNegocioId", required: true, options: {},
                                    label: translate("Unidad de negocio"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    view: "combo", id: "cmbResponsable", name: "responsableId", required: true, options: {},
                                    label: translate("Responsable"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbEmpresa", name: "empresaId", required: true, options: {},
                                    label: translate("Empresa"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbPais", name: "paisId", required: true, options: {},
                                    label: translate("Pais"), labelPosition: "top"
                                },
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "ofertaId", label: translate("ID"), labelPosition: "top", readonly: true },
                                { view: "text", id: "numeroOferta", name: "numeroOferta", required: true, label: translate("Nr. Oferta"), labelPosition: "top" },
                                { view: "text", id: "codigoOferta", name: "codigoOferta", required: true, label: translate("Cod. Oferta"), labelPosition: "top" }
                            ]
                        },
                        {
                            cols: [
                                { view: "text", name: "nombreCorto", label: translate("Nombre"), required: true, labelPosition: "top" },
                                { view: "text", name: "cliente", label: translate("Cliente"), required: true, labelPosition: "top" },
                                { view: "text", id: "ubicacion", name: "ubicacion", label: translate("Ubicación"), required: true, labelPosition: "top" }
                            ]
                        },
                        { view: "combo", id: "cmbServicio", name: "servicioId", required: true, options: {}, label: translate("Servicio"), labelPosition: "top" },
                        {
                            cols: [
                                { view: "combo", id: "cmbFaseOferta", name: "faseOfertaId", required: true, options: {}, label: translate("Fase oferta"), labelPosition: "top" },
                                { view: "combo", id: "cmbTipoOportunidad", name: "tipoOportunidadId", required: true, options: {}, label: translate("Tipo oportunidad"), labelPosition: "top" },
                                { view: "combo", id: "cmbTipoContrato", name: "tipoContratoId", required: true, options: {}, label: translate("Tipo contrato"), labelPosition: "top" }
                            ]
                        },
                        {
                            cols: [
                                { view: "combo", id: "cmbEstado", name: "estadoId", required: true, options: {}, label: translate("Estado"), labelPosition: "top" },
                                {}
                            ]
                        },
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
    }
    cancel() {
        $$('ofertasWindow').hide();
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmOfertas").validate()) {
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
    loadUnidadesNegocio(unidadNegocioId) {
        unidadesNegocioService.getUnidadesNegocio(usuarioService.getUsuarioCookie())
            .then(rows => {
                var unidades = generalApi.prepareDataForCombo('unidadNegocioId', 'nombre', rows);
                var list = $$("cmbUnidadNegocio").getPopup().getList();
                list.clearAll();
                list.parse(unidades);
                if (id) {
                    $$("cmbUnidadNegocio").setValue(unidadNegocioId);
                    $$("cmbUnidadNegocio").refresh();
                }
                return;
            });
    }
    loadResponsables(usuarioId) {
        usuarioService.getUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var responsables = generalApi.prepareDataForCombo('usuarioId', 'nombre', rows);
                var list = $$("cmbResponsable").getPopup().getList();
                list.clearAll();
                list.parse(responsables);
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
}