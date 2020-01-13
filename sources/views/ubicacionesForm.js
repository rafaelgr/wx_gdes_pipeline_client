import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { ubicacionesService } from "../services/ubicaciones_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";

var ubicacionId = 0;

export default class EmpreasForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "ubicacionesForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-map-marker-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Ubicaciones") }
                    ]
                },
                {
                    view: "form",

                    id: "frmUbicaciones",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "ubicacionId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre ubicacion"), labelPosition: "top"
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
        if (url[0].params.ubicacionId) {
            ubicacionId = url[0].params.ubicacionId;
        }
        this.load(ubicacionId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(ubicacionId) {
        if (ubicacionId == 0) {
            return;
        }
        ubicacionesService.getUbicacion(usuarioService.getUsuarioCookie(), ubicacionId)
            .then((ubicacion) => {
                $$("frmUbicaciones").setValues(ubicacion);
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/ubicaciones');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmUbicaciones").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmUbicaciones").getValues();
        if (ubicacionId == 0) {
            data.ubicacionId = 0;
            ubicacionesService.postUbicacion(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    this.$scope.show('/top/ubicaciones?ubicacionId=' + result.ubicacionId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            ubicacionesService.putUbicacion(usuarioService.getUsuarioCookie(), data)
                .then(() => {
                    this.$scope.show('/top/ubicaciones?ubicacionId=' + data.ubicacionId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
}