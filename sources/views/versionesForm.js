import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { versionesService } from "../services/versiones_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";

var versionId = 0;

export default class VersionesForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view1 = {
            view: "layout",
            id: "versionesForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-arrow-decision-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Versiones") }
                    ]
                },
                {
                    view: "form",

                    id: "frmVersiones",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "numVersion", width: 200, disabled: true,
                                    label: translate("Num. Version"), labelPosition: "top"
                                },
                                { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaCambio", required: true, label: translate("Fecha cambio"), labelPosition: "top" },
                                { view: "datepicker", editable: true, minDate: new Date("2000-01-01"), name: "fechaEntrega", required: true, label: translate("Fecha entrega"), labelPosition: "top" },
                                { view: "text", name: "importePresupuesto", required: true, label: translate("Importe GDES"), labelPosition: "top", format: "1.111,00 €" },
                            ]
                        },
                        {
                            cols: [
                                { view: "textarea", name: "observaciones", label: translate("Observaciones"), labelPosition: "top" }
                            ]
                        },
                        {
                            margin: 5, cols: [
                                { gravity: 5 },
                                { view: "button", label: translate("Cancelar"), click: this.cancel, hotkey: "esc" },
                                { view: "button", label: translate("Aceptar"), click: this.accept, type: "form", hotkey: "enter" }
                            ]
                        },
                        { minlength: 600 }
                    ]
                }
            ]
        }
        var _view = {
            view: "window",
            id: "w2",
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
    showWindow(ofertaId, id) {
        this.getRoot().show();
        versionId = id;
        if (versionId != 0) {
            versionesService.getVersion(usuarioService.getUsuarioCookie(), versionId)
                .then((version) => {
                    version.fechaCambio = new Date(version.fechaCambio);
                    if (version.fechaEntrega) version.fechaEntrega = new Date(version.fechaEntrega);
                    $$("frmVersiones").setValues(version);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            $$("frmVersiones").setValues({});
        }
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(versionId) {
        if (versionId == 0) {
            this.loadUnidadesNegocio();
            return;
        }
        versionesService.getVersion(usuarioService.getUsuarioCookie(), versionId)
            .then((version) => {
                $$("frmVersiones").setValues(version);
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        $$('w2').hide();
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmVersiones").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmVersiones").getValues();
        data = versionesService.checkFormValues(data);
        if (versionId == 0) {
            data.versionId = 0;
            versionesService.postVersion(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    this.$scope.show('/top/versiones?versionId=' + result.versionId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            versionesService.putVersion(usuarioService.getUsuarioCookie(), data)
                .then(() => {
                    this.$scope.show('/top/versiones?versionId=' + data.versionId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
}