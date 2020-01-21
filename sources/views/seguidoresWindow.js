import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { seguidoresService } from "../services/seguidores_service";
import { generalApi } from "../utilities/general";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var _seguidorId = 0;
var _ofertaId = 0;

export default class OfertasHitosWindow extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view1 = {
            view: "layout",
            id: "seguidoresForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-calendar-clock", width: 37, align: "left" },
                        { view: "label", label: translate("Seguidor") }
                    ]
                },
                {
                    view: "form",

                    id: "frmSeguidor",
                    elements: [
                        {
                            cols: [
                                { view: "combo", id: "cmbSeguidor", name: "usuarioId", options: {}, label: translate("Seguidor"), labelPosition: "top", required: true }
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
        var _view = {
            view: "window",
            id: "w4",
            position: "center", move: true, resize: true,
            width: 800,
            head: {
                view: "toolbar", cols: [
                    {},
                    {
                        view: "icon", icon: "mdi mdi-close", click: () => {
                            $$('w2').hide();
                        }
                    }
                ]
            }, modal: true,
            body: _view1
        };
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        $$("importeDivisa").attachEvent("onBlur", (nv, ov) => { this.calcImporte(); });
    }
    showWindow(ofertaId, seguidorId) {
        this.getRoot().show();
        _seguidorId = seguidorId;
        _ofertaId = ofertaId;
        if (seguidorId != 0) {
            seguidoresService.getOfertaHito(usuarioService.getUsuarioCookie(), seguidorId)
                .then((seguidor) => {
                    $$("frmSeguidor").setValues(seguidor);
                    this.loadUsuarios(seguidor.usuarioId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            $$("frmSeguidor").setValues({});
            this.loadUsuarios();
        }
    }
    cancel() {
        $$('w4').hide();
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmSeguidor").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmSeguidor").getValues();
        if (_seguidorId == 0) {
            data.ofertaId = _ofertaId;
            data.seguidorId = 0;
            seguidoresService.postSeguidor(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.getParentView().load(_ofertaId);
                    $$('w4').hide();
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            seguidoresService.putSeguidor(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.getParentView().load(_ofertaId);
                    $$('w4').hide();
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
    loadUsuarios(usuarioId) {
        usuarioService.getUsuarios(usuarioService.getUsuarioCookie())
            .then(rows => {
                var usuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', rows);
                var list = $$("cmbSeguidor").getPopup().getList();
                list.clearAll();
                console.log('Parse', usuarios);
                list.parse(usuarios);
                if (usuarioId) {
                    console.log('Set divisa');
                    $$("cmbSeguidor").setValue(usuarioId);
                    $$("cmbSeguidor").refresh();
                }
                return;
            });
    }
    calcImporte() {
        var impDiv = $$("importeDivisa").getValue();
        var factor = $$("factor").getValue();
        var imp = impDiv * factor;
        $$("importe").setValue(imp);
    }
}