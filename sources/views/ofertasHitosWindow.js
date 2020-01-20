import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { ofertasHitosService } from "../services/ofertasHitos_service";
import { divisasService } from "../services/divisas_service"
import { generalApi } from "../utilities/general";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

var _ofertaHitoId = 0;
var _ofertaId = 0;

export default class OfertasHitosWindow extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view1 = {
            view: "layout",
            id: "divisasForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-calendar-clock", width: 37, align: "left" },
                        { view: "label", label: translate("Hito de facturación") }
                    ]
                },
                {
                    view: "form",

                    id: "frmOfertaHito",
                    elements: [
                        {
                            cols: [
                                { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fecha", required: true, label: translate("Fecha hito"), labelPosition: "top" },
                                { view: "combo", id: "cmbDivisaHito", name: "divisaId", options: {}, label: translate("Divisa"), labelPosition: "top" },
                                { view: "text", id: "factor", name: "factor", label: translate("Factor (1€ =)"), labelPosition: "top", format: "1.111,00", required: true },
                                { view: "text", id: "importeDivisa", name: "importeDivisa", label: translate("Importe (DIVISA)"), labelPosition: "top", format: "1.111,00", required: true},
                            ]
                        },
                        {
                            cols: [
                                {},
                                {},
                                {},
                                { view: "text", id: "importe", name: "importe", label: translate("Importe"), labelPosition: "top", format: "1.111,00 €"},
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
            id: "w3",
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
    showWindow(ofertaId, ofertaHitoId) {
        this.getRoot().show();
        _ofertaHitoId = ofertaHitoId;
        _ofertaId = ofertaId;
        if (ofertaHitoId != 0) {
            ofertasHitosService.getOfertaHito(usuarioService.getUsuarioCookie(), ofertaHitoId)
                .then((ofertaHito) => {
                    ofertaHito.fecha = new Date(ofertaHito.fecha);
                    $$("frmOfertaHito").setValues(ofertaHito);
                    this.loadDivisas(ofertaHito.divisaId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            $$("frmOfertaHito").setValues({
                fecha: new Date(),
                divisaId: 1,
                factor: 1
            });
            this.loadDivisas(1);
        }
    }
    cancel() {
        $$('w3').hide();
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmOfertaHito").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmOfertaHito").getValues();
        if (_ofertaHitoId == 0) {
            data.ofertaId = _ofertaId;
            data.ofertaHitoId = 0;
            ofertasHitosService.postOfertaHito(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.getParentView().load(_ofertaId);
                    $$('w3').hide();
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            ofertasHitosService.putOfertaHito(usuarioService.getUsuarioCookie(), data)
                .then(result => {
                    this.$scope.getParentView().load(_ofertaId);
                    $$('w3').hide();
                })
                .catch(err => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
    loadDivisas(divisaId) {
        divisasService.getDivisas(usuarioService.getUsuarioCookie())
            .then(rows => {
                console.log('Divisas', rows);
                var divisas = generalApi.prepareDataForCombo('divisaId', 'nombre', rows);
                var list = $$("cmbDivisaHito").getPopup().getList();
                list.clearAll();
                console.log('Parse', divisas);
                list.parse(divisas);
                if (divisaId) {
                    console.log('Set divisa');
                    $$("cmbDivisaHito").setValue(divisaId);
                    $$("cmbDivisaHito").refresh();
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