import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var unidadNegocioId = 0;

export default class UnidadesNegocioForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "unidadesNegocioForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-cube-scan", width: 37, align: "left" },
                        { view: "label", label: translate("Unidades de negocio") }
                    ]
                },
                {
                    view: "form",

                    id: "frmUnidadesNegocio",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "unidadNegocioId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre unidad de negocio"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                { width: 100 },
                                {
                                    view: "text", name: "nombreEN", required: true,
                                    label: translate("Nombre Inglés"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                { width: 100 },
                                {
                                    view: "text", name: "nombreFR", required: true,
                                    label: translate("Nombre Francés"), labelPosition: "top"
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
                }
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        if (url[0].params.unidadNegocioId) {
            unidadNegocioId = url[0].params.unidadNegocioId;
        }
        this.load(unidadNegocioId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(unidadNegocioId) {
        if (unidadNegocioId == 0) return;
        unidadesNegocioService.getUnidadNegocio(usuarioService.getUsuarioCookie(), unidadNegocioId)
            .then(unidadesNegocio => {
                $$("frmUnidadesNegocio").setValues(unidadesNegocio);
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/unidadesNegocio');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmUnidadesNegocio").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmUnidadesNegocio").getValues();
        if (unidadNegocioId == 0) {
            data.unidadNegocioId = 0;
            unidadesNegocioService.postUnidadNegocio(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/unidadesNegocio?unidadNegocioId=' + result.unidadNegocioId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            unidadesNegocioService.putUnidadNegocio(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/unidadesNegocio?unidadNegocioId=' + data.unidadNegocioId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
}