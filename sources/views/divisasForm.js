import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { divisasService } from "../services/divisas_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var divisaId = 0;

export default class DivisasForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "divisasForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-currency-eur", width: 37, align: "left" },
                        { view: "label", label: translate("Divisas") }
                    ]
                },
                {
                    view: "form",

                    id: "frmDivisas",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "divisaId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre divisa"), labelPosition: "top"
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
        if (url[0].params.divisaId) {
            divisaId = url[0].params.divisaId;
        }
        this.load(divisaId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(divisaId) {
        if (divisaId == 0) return;
        divisasService.getDivisa(usuarioService.getUsuarioCookie(), divisaId)
            .then(divisas => {
                $$("frmDivisas").setValues(divisas);
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/divisas');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmDivisas").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmDivisas").getValues();
        if (divisaId == 0) {
            data.divisaId = 0;
            divisasService.postDivisa(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/divisas?divisaId=' + result.divisaId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            divisasService.putDivisa(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/divisas?divisaId=' + data.divisaId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
}