import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { ubicacionesService } from "../services/ubicaciones_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";

export default class UbicacionesWindow extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view1 = {
            view: "layout",
            id: "ubicacionesWindowsForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-map-marker-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Asociar usuario") }
                    ]
                },
                {
                    view: "form",

                    id: "frmUbicacionesWindow",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "ubicacionId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, 
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
                        }
                    ]
                },
                { minheight: 600 }
            ]
        }
        var _view = {
            view: "window",
            id: "ubicacionesWindow",
            position: "center", move: true, resize: true,
            width: 600,
            head: {
                view: "toolbar", cols: [
                    {},
                    {
                        view: "icon", icon: "mdi mdi-close", click: () => {
                            $$('ubicacionesWindow').hide();
                        }
                    }
                ]
            }, modal: true,
            body: _view1
        };
        return _view;
    }
    init(view, url) {
        console.log('Init window');
    }
    showWindow(grupoUsuarioId) {
        $$('ubicacionesWindow').show();
    }
    cancel() {
        $$('ubicacionesWindow').hide();
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmUbicacionesWindow").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmUbicacionesWindow").getValues();
        const ubicacion = {
            ubicacionId: 0,
            nombre: data.nombre
        }
        ubicacionesService.postUbicacion(usuarioService.getUsuarioCookie(), ubicacion)
        .then(result => {
            this.$scope.getParentView().loadUbicaciones(result.ubicacionId);
            console.log('Result', result);
            $$('ubicacionesWindow').hide();
        })
        .catch(err => {
            messageApi.errorMessageAjax(err);
        })
    }
}