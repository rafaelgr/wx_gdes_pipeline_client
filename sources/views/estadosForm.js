import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { estadosService } from "../services/estados_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var estadoId = 0;

export default class EstadosForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "estadosForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-thumbs-up-down", width: 37, align: "left" },
                        { view: "label", label: translate("Tipos de estado") }
                    ]
                },
                {
                    view: "form",

                    id: "frmEstados",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "estadoId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre tipo de estado"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    view: "text", name: "orden", width: 100, 
                                    label: translate("Orden"), labelPosition: "top"
                                }, {
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
        if (url[0].params.estadoId) {
            estadoId = url[0].params.estadoId;
        }
        this.load(estadoId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(estadoId) {
        if (estadoId == 0) return;
        estadosService.getEstado(usuarioService.getUsuarioCookie(), estadoId)
            .then(estados => {
                $$("frmEstados").setValues(estados);
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/estados');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmEstados").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmEstados").getValues();
        if (estadoId == 0) {
            data.estadoId = 0;
            estadosService.postEstado(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/estados?estadoId=' + result.estadoId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            estadosService.putEstado(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/estados?estadoId=' + data.estadoId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
}