import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";
import { areasService } from "../services/areas_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";

var areaId = 0;

export default class AreasForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "areasForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-cube-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Areas") }
                    ]
                },
                {
                    view: "form",

                    id: "frmAreas",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "areaId", width: 200, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre area"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    view: "text", name: "cod", width: 100, required: true,
                                    label: translate("Código"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "orden", width: 100, type: 'number', 
                                    label: translate("Orden"), labelPosition: "top"
                                },
                                {
                                    view: "combo", id: "cmbUnidadNegocio", name: "unidadNegocioId", required: true, options: {},
                                    label: translate("Unidad negocio relacionada"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    width: 200
                                },
                                {
                                    view: "text", name: "nombreEN", required: true,
                                    label: translate("Nombre Inglés"), labelPosition: "top"
                                }
                            ]
                        },                        
                        {
                            cols: [
                                {
                                    width: 200
                                },
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
                        { minlength: 600}
                    ]
                }
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        if (url[0].params.areaId) {
            areaId = url[0].params.areaId;
        }
        this.load(areaId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(areaId) {
        if (areaId == 0) {
            this.loadUnidadesNegocio();
            return;
        }
        areasService.getArea(usuarioService.getUsuarioCookie(), areaId)
            .then((area) => {
                $$("frmAreas").setValues(area);
                this.loadUnidadesNegocio(area.unidadNegocioId);
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/areas');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmAreas").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmAreas").getValues();
        data = areasService.checkFormValues(data);
        if (areaId == 0) {
            data.areaId = 0;
            areasService.postArea(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    this.$scope.show('/top/areas?areaId=' + result.areaId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            areasService.putArea(usuarioService.getUsuarioCookie(), data)
                .then(() => {
                    this.$scope.show('/top/areas?areaId=' + data.areaId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
    loadUnidadesNegocio(unidadNegocioId) {
        unidadesNegocioService.getUnidadesNegocio(usuarioService.getUsuarioCookie())
            .then(rows => {
                var areas = generalApi.prepareDataForCombo('unidadNegocioId', 'nombre', rows);
                var list = $$("cmbUnidadNegocio").getPopup().getList();
                list.clearAll();
                list.parse(areas);
                if (id) {
                    $$("cmbUnidadNegocio").setValue(unidadNegocioId);
                    $$("cmbUnidadNegocio").refresh();
                }
                return;
            });
    }
}