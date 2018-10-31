import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { tiposOportunidadService } from "../services/tiposOportunidad_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var tipoOportunidadId = 0;

export default class TiposOportunidadForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "tiposOportunidadForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-shape", width: 37, align: "left" },
                        { view: "label", label: translate("Tipos de oportunidad") }
                    ]
                },
                {
                    view: "form",

                    id: "frmTiposOportunidad",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "tipoOportunidadId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre tipo de oportunidad"), labelPosition: "top"
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
                        },
                        {
                            minheight: 600
                        }
                    ]
                }
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        if (url[0].params.tipoOportunidadId) {
            tipoOportunidadId = url[0].params.tipoOportunidadId;
        }
        this.load(tipoOportunidadId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(tipoOportunidadId) {
        if (tipoOportunidadId == 0) return;
        tiposOportunidadService.getTipoOportunidad(usuarioService.getUsuarioCookie(), tipoOportunidadId)
            .then(tiposOportunidad => {
                $$("frmTiposOportunidad").setValues(tiposOportunidad);
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/tiposOportunidad');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmTiposOportunidad").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmTiposOportunidad").getValues();
        if (tipoOportunidadId == 0) {
            data.tipoOportunidadId = 0;
            tiposOportunidadService.postTipoOportunidad(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/tiposOportunidad?tipoOportunidadId=' + result.tipoOportunidadId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            tiposOportunidadService.putTipoOportunidad(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/tiposOportunidad?tipoOportunidadId=' + data.tipoOportunidadId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
}