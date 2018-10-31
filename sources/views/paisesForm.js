import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { paisesService } from "../services/paises_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var paisId = 0;

export default class PaisesForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "paisesForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-flag", width: 37, align: "left" },
                        { view: "label", label: translate("Paises") }
                    ]
                },
                {
                    view: "form",

                    id: "frmPaises",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "paisId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre de pais"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "codPais", required: true,
                                    label: translate("Código"), labelPosition: "top"
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
        if (url[0].params.paisId) {
            paisId = url[0].params.paisId;
        }
        this.load(paisId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(paisId) {
        if (paisId == 0) return;
        paisesService.getPais(usuarioService.getUsuarioCookie(), paisId)
            .then(paises => {
                $$("frmPaises").setValues(paises);
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/paises');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmPaises").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmPaises").getValues();
        if (paisId == 0) {
            data.paisId = 0;
            paisesService.postPais(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/paises?paisId=' + result.paisId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            paisesService.putPais(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/paises?paisId=' + data.paisId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
}