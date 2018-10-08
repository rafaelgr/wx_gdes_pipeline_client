import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { gruposUsuariosService } from "../services/gruposUsuarios_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var gruposUsuarioId = 0;

export default class Parametros extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "gruposUsuariosForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "cogs", width: 37, align: "left" },
                        { view: "label", label: translate("Grupos de usuarios") }
                    ]
                },
                {
                    view: "form",

                    id: "frmGruposUsuarios",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "grupoUsuarioId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true,
                                    label: translate("Nombre de grupo"), labelPosition: "top"
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
        if (url[0].params.grupoUsuarioId) {
            gruposUsuarioId = url[0].params.grupoUsuarioId;
        }
        this.load(gruposUsuarioId);
    }
    load(grupoUsuarioId) {
        if (grupoUsuarioId == 0) return;
        gruposUsuariosService.getGrupoUsuario(usuarioService.getUsuarioCookie(), gruposUsuarioId, (err, parametros) => {
            if (err) return messageApi.errorMessageAjax(err);
            $$("frmGruposUsuarios").setValues(parametros);
        });
    }
    cancel() {
        this.$scope.show('/top/gruposUsuarios');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmGruposUsuarios").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmGruposUsuarios").getValues();
        if (gruposUsuarioId == 0) {
            gruposUsuariosService.postGrupoUsuario(usuarioService.getUsuarioCookie(), data,
                (err, result) => {
                    if (err) return messageApi.errorMessageAjax(err);
                    this.$scope.show('/top/gruposUsuarios?grupoUsuarioId=' + result.grupoUsuarioId);
                });
        } else {
            gruposUsuariosService.putGrupoUsuario(usuarioService.getUsuarioCookie(), data,
                (err, result) => {
                    if (err) return messageApi.errorMessageAjax(err);
                    this.$scope.show('/top/gruposUsuarios?grupoUsuarioId=' + result.grupoUsuarioId);
                });
        }
    }
}