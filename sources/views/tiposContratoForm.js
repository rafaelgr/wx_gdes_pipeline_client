import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { tiposContratoService } from "../services/tiposContrato_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var tipoContratoId = 0;

export default class TiposContratoForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "tiposContratoForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-shape-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Tipos de contrato") }
                    ]
                },
                {
                    view: "form",

                    id: "frmTiposContrato",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "tipoContratoId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre tipo de contrato"), labelPosition: "top"
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
        if (url[0].params.tipoContratoId) {
            tipoContratoId = url[0].params.tipoContratoId;
        }
        this.load(tipoContratoId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(tipoContratoId) {
        if (tipoContratoId == 0) return;
        tiposContratoService.getTipoContrato(usuarioService.getUsuarioCookie(), tipoContratoId)
            .then(tiposContrato => {
                $$("frmTiposContrato").setValues(tiposContrato);
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/tiposContrato');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmTiposContrato").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmTiposContrato").getValues();
        if (tipoContratoId == 0) {
            data.tipoContratoId = 0;
            tiposContratoService.postTipoContrato(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/tiposContrato?tipoContratoId=' + result.tipoContratoId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            tiposContratoService.putTipoContrato(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/tiposContrato?tipoContratoId=' + data.tipoContratoId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
}