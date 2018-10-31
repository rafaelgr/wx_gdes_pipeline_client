import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { fasesOfertaService } from "../services/fasesOferta_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var faseOfertaId = 0;

export default class FasesOfertaForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "fasesOfertaForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-filter-variant", width: 37, align: "left" },
                        { view: "label", label: translate("Fases de oferta") }
                    ]
                },
                {
                    view: "form",

                    id: "frmFasesOferta",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "faseOfertaId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre fase de oferta"), labelPosition: "top"
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
        if (url[0].params.faseOfertaId) {
            faseOfertaId = url[0].params.faseOfertaId;
        }
        this.load(faseOfertaId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(faseOfertaId) {
        if (faseOfertaId == 0) return;
        fasesOfertaService.getFaseOferta(usuarioService.getUsuarioCookie(), faseOfertaId)
            .then(fasesOferta => {
                $$("frmFasesOferta").setValues(fasesOferta);
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/fasesOferta');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmFasesOferta").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmFasesOferta").getValues();
        if (faseOfertaId == 0) {
            data.faseOfertaId = 0;
            fasesOfertaService.postFaseOferta(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/fasesOferta?faseOfertaId=' + result.faseOfertaId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            fasesOfertaService.putFaseOferta(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.show('/top/fasesOferta?faseOfertaId=' + data.faseOfertaId);
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
}