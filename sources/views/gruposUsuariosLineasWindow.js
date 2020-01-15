import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { gruposUsuariosLineasService } from "../services/gruposUsuariosLineas_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";

var grpUsuarioId = 0;

export default class GruposUsuariosLineasWindow extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view1 = {
            view: "layout",
            id: "grupoUsuarioLineasForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-account-group", width: 37, align: "left" },
                        { view: "label", label: translate("Asociar usuario") }
                    ]
                },
                {
                    view: "form",

                    id: "frmGruposUsuariosLineas",
                    elements: [
                        { view: "combo", id: "cmbUsuario", name: "usuarioId", required: true, options: {}, label: translate("Usuario"), labelPosition: "top" },

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
            id: "gruposUsuariosLineasWindow",
            position: "center", move: true, resize: true,
            width: 600,
            head: {
                view: "toolbar", cols: [
                    {},
                    {
                        view: "icon", icon: "mdi mdi-close", click: () => {
                            $$('gruposUsuariosLineasWindow').hide();
                        }
                    }
                ]
            }, modal: true,
            body: _view1
        };
        return _view;
    }
    init(view, url) {
        
    }
    showWindow(grupoUsuarioId) {
        $$('gruposUsuariosLineasWindow').show();
        grpUsuarioId = grupoUsuarioId;
        this.loadUsuarios();
    }
    cancel() {
        $$('gruposUsuariosLineasWindow').hide();
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmGruposUsuariosLineas").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmGruposUsuariosLineas").getValues();
        const linea = {
            grupoUsuarioLineaId: 0,
            grupoUsuarioId: grpUsuarioId,
            usuarioId: data.usuarioId
        }
        gruposUsuariosLineasService.postGrupoUsuarioLineas(usuarioService.getUsuarioCookie(), linea)
        .then(result => {
            this.$scope.getParentView().load(grpUsuarioId);
            $$('gruposUsuariosLineasWindow').hide();
        })
        .catch(err => {
            messageApi.errorMessageAjax(err);
        })
    }
    loadUsuarios() {
        usuarioService.getUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var usuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', rows);
                var list = $$("cmbUsuario").getPopup().getList();
                list.clearAll();
                list.parse(usuarios);
                return;
            })
            .catch(err => {
                clg("Error", err)
            });
    }
}