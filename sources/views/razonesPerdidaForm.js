import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { razonesPerdidaService } from "../services/razonesPerdida_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var razonPerdidaId = 0;

export default class RazonesPerdidaForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "razonesPerdidaForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-thumb-down", width: 37, align: "left" },
                        { view: "label", label: translate("Razones perdida") }
                    ]
                },
                {
                    view: "form",

                    id: "frmRazonesPerdida",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "razonPerdidaId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre razon perdida"), labelPosition: "top"
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
        if (url[0].params.razonPerdidaId) {
            razonPerdidaId = url[0].params.razonPerdidaId;
        }
        this.load(razonPerdidaId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(razonPerdidaId) {
        if (razonPerdidaId == 0) return;
        razonesPerdidaService.getRazonPerdida(usuarioService.getUsuarioCookie(), razonPerdidaId)
            .then(razonesPerdida => {
                $$("frmRazonesPerdida").setValues(razonesPerdida);
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/razonesPerdida');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmRazonesPerdida").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmRazonesPerdida").getValues();
        if (razonPerdidaId == 0) {
            data.razonPerdidaId = 0;
            razonesPerdidaService.postRazonPerdida(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/razonesPerdida?razonPerdidaId=' + result.razonPerdidaId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            razonesPerdidaService.putRazonPerdida(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/razonesPerdida?razonPerdidaId=' + data.razonPerdidaId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
}