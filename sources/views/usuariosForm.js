import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { paisesService } from "../services/paises_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { gruposUsuariosService } from "../services/gruposUsuarios_service";
import { empresasService } from "../services/empresas_service";
import { areasService } from "../services/areas_service";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";

var usuarioId = 0;

export default class UsuarioForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "usuariosForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-account", width: 37, align: "left" },
                        { view: "label", label: translate("Usuarios") }
                    ]
                },
                {
                    view: "form",

                    id: "frmUsuarios",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "usuarioId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre usuario"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbGrupo", name: "grupoUsuarioId", options: {},
                                    label: translate("Grupo visualización (1)"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    width: 100
                                },
                                {
                                    view: "combo", id: "cmbGrupo2", name: "grupoUsuarioId2", options: {},
                                    label: translate("Grupo visualización (2)"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbGrupo3", name: "grupoUsuarioId3", options: {},
                                    label: translate("Grupo visualización (3)"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    width: 100
                                },
                                {
                                    view: "combo", id: "cmbGrupo4", name: "grupoUsuarioId4", options: {},
                                    label: translate("Grupo visualización (4)"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbGrupo5", name: "grupoUsuarioId5", options: {},
                                    label: translate("Grupo visualización (5)"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    width: 100
                                },
                                {
                                    view: "combo", id: "cmbGrupo6", name: "grupoUsuarioId6", options: {},
                                    label: translate("Grupo visualización (6)"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbGrupo7", name: "grupoUsuarioId7", options: {},
                                    label: translate("Grupo visualización (7)"), labelPosition: "top"
                                }
                            ]
                        },                        
                        {
                            cols: [
                                {
                                    view: "text", name: "codigoIdioma", width: 100, required: true,
                                    label: translate("Idioma"), labelPosition: "top"
                                },
                                {
                                    view: "checkbox", name: "esAdministrador", required: true,
                                    label: translate("Administrador"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbResponsable", name: "responsableId", required: true, options: {},
                                    label: translate("Responsable"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    view: "combo", id: "cmbPais", name: "paisId", required: true, options: {},
                                    label: translate("Pais relacionado"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbEmpresa", name: "empresaId", required: true, options: {},
                                    label: translate("Empresa"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    view: "combo", id: "cmbArea", name: "areaId", required: true, options: {},
                                    label: translate("Area"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbUnidadNegocio", name: "unidadNegocioId", required: true, options: {},
                                    label: translate("Unidad negocio"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    view: "text", name: "emailAzure", required: true,
                                    label: translate("Correo Azure"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "ubicacion", 
                                    label: translate("Ubicación"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            margin: 5, cols: [
                                { gravity: 5 },
                                { view: "button", label: translate("Cancelar"), click: this.cancel, hotkey: "esc" },
                                { view: "button", label: translate("Aceptar"), click: this.accept, type: "form", hotkey: "enter" }
                            ]
                        }
                    ]
                },
                { minheight: 600 }
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        if (url[0].params.usuarioId) {
            usuarioId = url[0].params.usuarioId;
        }
        this.load(usuarioId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(grupoUsuarioId) {
        if (grupoUsuarioId == 0) {
            this.loadGruposUsuarios();
            this.loadGruposUsuarios2();
            this.loadGruposUsuarios3();
            this.loadGruposUsuarios4();
            this.loadGruposUsuarios5();
            this.loadGruposUsuarios6();
            this.loadGruposUsuarios7();
            this.loadAreas();
            this.loadEmpresas();
            this.loadResponsables();
            this.loadUnidadesNegocio();
            this.loadPaises();
            return;
        }
        usuarioService.getUsuario(usuarioService.getUsuarioCookie(), grupoUsuarioId)
            .then((usuario) => {
                $$("frmUsuarios").setValues(usuario);
                this.loadGruposUsuarios(usuario.grupoUsuarioId);
                this.loadGruposUsuarios2(usuario.grupoUsuarioId2);
                this.loadGruposUsuarios3(usuario.grupoUsuarioId3);
                this.loadGruposUsuarios4(usuario.grupoUsuarioId4);
                this.loadGruposUsuarios5(usuario.grupoUsuarioId5);
                this.loadGruposUsuarios6(usuario.grupoUsuarioId6);
                this.loadGruposUsuarios7(usuario.grupoUsuarioId7);
                this.loadAreas(usuario.areaId);
                this.loadEmpresas(usuario.empresaId);
                this.loadResponsables(usuario.responsableId);
                this.loadUnidadesNegocio(usuario.unidadNegocioId);
                this.loadPaises(usuario.paisId);
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/usuarios');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmUsuarios").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmUsuarios").getValues();
        if (!data.grupoUsuarioId || data.grupoUsuarioId === -1) data.grupoUsuarioId = null;
        if (!data.grupoUsuarioId2 || data.grupoUsuarioId2 === -1) data.grupoUsuarioId2 = null;
        if (!data.grupoUsuarioId3 || data.grupoUsuarioId3 === -1) data.grupoUsuarioId3 = null;
        if (!data.grupoUsuarioId4 || data.grupoUsuarioId4 === -1) data.grupoUsuarioId4 = null;
        if (!data.grupoUsuarioId5 || data.grupoUsuarioId5 === -1) data.grupoUsuarioId5 = null;
        if (!data.grupoUsuarioId6 || data.grupoUsuarioId6 === -1) data.grupoUsuarioId6 = null;
        if (!data.grupoUsuarioId7 || data.grupoUsuarioId7 === -1) data.grupoUsuarioId7 = null;
        data = usuarioService.cleanData(data);
        if (usuarioId == 0) {
            data.usuarioId = 0;
            usuarioService.postUsuario(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    this.$scope.show('/top/usuarios?usuarioId=' + result.usuarioId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            usuarioService.putUsuario(usuarioService.getUsuarioCookie(), data)
                .then(() => {
                    this.$scope.show('/top/usuarios?usuarioId=' + data.usuarioId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
    loadResponsables(responsableId) {
        usuarioService.getUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var responsables = generalApi.prepareDataForCombo('usuarioId', 'nombre', rows);
                var list = $$("cmbResponsable").getPopup().getList();
                list.clearAll();
                list.parse(responsables);
                if (id) {
                    $$("cmbResponsable").setValue(responsableId);
                    $$("cmbResponsable").refresh();
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
    loadUnidadesNegocio(unidadNegocioId) {
        unidadesNegocioService.getUnidadesNegocio(usuarioService.getUsuarioCookie())
            .then(rows => {
                var unidadesNegocio = generalApi.prepareDataForCombo('unidadNegocioId', 'nombre', rows);
                var list = $$("cmbUnidadNegocio").getPopup().getList();
                list.clearAll();
                list.parse(unidadesNegocio);
                if (id) {
                    $$("cmbUnidadNegocio").setValue(unidadNegocioId);
                    $$("cmbUnidadNegocio").refresh();
                }
                return;
            });
    }
    loadGruposUsuarios(grupoUsuarioId) {
        gruposUsuariosService.getGruposUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var grupos = generalApi.prepareDataForCombo('grupoUsuarioId', 'nombre', rows);
                grupos.push({id: -1, value: ""});
                var list = $$("cmbGrupo").getPopup().getList();
                list.clearAll();
                list.parse(grupos);
                if (grupoUsuarioId) {
                    $$("cmbGrupo").setValue(grupoUsuarioId);
                    $$("cmbGrupo").refresh();
                }
                return;
            });
    }
    loadGruposUsuarios2(id) {
        gruposUsuariosService.getGruposUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var grupos = generalApi.prepareDataForCombo('grupoUsuarioId', 'nombre', rows);
                grupos.push({id: -1, value: ""});
                var list = $$("cmbGrupo2").getPopup().getList();
                list.clearAll();
                list.parse(grupos);
                if (id) {
                    $$("cmbGrupo2").setValue(id);
                    $$("cmbGrupo2").refresh();
                }
                return;
            });
    }
    loadGruposUsuarios3(id) {
        gruposUsuariosService.getGruposUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var grupos = generalApi.prepareDataForCombo('grupoUsuarioId', 'nombre', rows);
                grupos.push({id: -1, value: ""});
                var list = $$("cmbGrupo3").getPopup().getList();
                list.clearAll();
                list.parse(grupos);
                if (id) {
                    $$("cmbGrupo3").setValue(id);
                    $$("cmbGrupo3").refresh();
                }
                return;
            });
    }
    loadGruposUsuarios4(id) {
        gruposUsuariosService.getGruposUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var grupos = generalApi.prepareDataForCombo('grupoUsuarioId', 'nombre', rows);
                grupos.push({id: -1, value: ""});
                var list = $$("cmbGrupo4").getPopup().getList();
                list.clearAll();
                list.parse(grupos);
                if (id) {
                    $$("cmbGrupo4").setValue(id);
                    $$("cmbGrupo4").refresh();
                }
                return;
            });
    }
    loadGruposUsuarios5(id) {
        gruposUsuariosService.getGruposUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var grupos = generalApi.prepareDataForCombo('grupoUsuarioId', 'nombre', rows);
                grupos.push({id: -1, value: ""});
                var list = $$("cmbGrupo5").getPopup().getList();
                list.clearAll();
                list.parse(grupos);
                if (id) {
                    $$("cmbGrupo5").setValue(id);
                    $$("cmbGrupo5").refresh();
                }
                return;
            });
    }   
    loadGruposUsuarios6(id) {
        gruposUsuariosService.getGruposUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var grupos = generalApi.prepareDataForCombo('grupoUsuarioId', 'nombre', rows);
                grupos.push({id: -1, value: ""});
                var list = $$("cmbGrupo6").getPopup().getList();
                list.clearAll();
                list.parse(grupos);
                if (id) {
                    $$("cmbGrupo6").setValue(id);
                    $$("cmbGrupo6").refresh();
                }
                return;
            });
    }
    loadGruposUsuarios7(id) {
        gruposUsuariosService.getGruposUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var grupos = generalApi.prepareDataForCombo('grupoUsuarioId', 'nombre', rows);
                grupos.push({id: -1, value: ""});
                var list = $$("cmbGrupo7").getPopup().getList();
                list.clearAll();
                list.parse(grupos);
                if (id) {
                    $$("cmbGrupo7").setValue(id);
                    $$("cmbGrupo7").refresh();
                }
                return;
            });
    }         
}