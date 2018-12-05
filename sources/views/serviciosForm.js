import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { areasService } from "../services/areas_service";
import { serviciosService } from "../services/servicios_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";

var servicioId = 0;

export default class ServiciosForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "serviciosForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-cube-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Servicios") }
                    ]
                },
                {
                    view: "form",

                    id: "frmServicios",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "servicioId", width: 200, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre servicio"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            cols: [
                                {
                                    width: 200
                                },
                                {
                                    view: "combo", id: "cmbArea", name: "areaId", required: true, options: {},
                                    label: translate("Area"), labelPosition: "top"
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
        if (url[0].params.servicioId) {
            servicioId = url[0].params.servicioId;
        }
        this.load(servicioId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(servicioId) {
        if (servicioId == 0) {
            this.loadAreas();
            return;
        }
        serviciosService.getServicio(usuarioService.getUsuarioCookie(), servicioId)
            .then((servicio) => {
                $$("frmServicios").setValues(servicio);
                this.loadAreas(servicio.areaId);
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/servicios');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmServicios").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmServicios").getValues();
        data = serviciosService.checkFormValues(data);
        if (servicioId == 0) {
            data.servicioId = 0;
            serviciosService.postServicio(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    this.$scope.show('/top/servicios?servicioId=' + result.servicioId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            serviciosService.putServicio(usuarioService.getUsuarioCookie(), data)
                .then(() => {
                    this.$scope.show('/top/servicios?servicioId=' + data.servicioId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
    loadAreas(areaId) {
        areasService.getAreas(usuarioService.getUsuarioCookie())
            .then(rows => {
                var servicios = generalApi.prepareDataForCombo('areaId', 'nombre', rows);
                var list = $$("cmbArea").getPopup().getList();
                list.clearAll();
                list.parse(servicios);
                if (id) {
                    $$("cmbArea").setValue(areaId);
                    $$("cmbArea").refresh();
                }
                return;
            });
    }
}