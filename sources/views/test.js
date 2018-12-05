import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";
import { areasService } from "../services/areas_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";

var testId = 0;

export default class TestsForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const c1 = {
            padding: 5,
            rows: [
                { template: "This is C1", type: "section" },
                {
                    cols: [
                        {
                            view: "text", name: "nombre1", required: true, attributes: { tabindex: 1 },
                            label: translate("Nombre 1"), labelPosition: "top"
                        },
                        {
                            view: "text", name: "nombre11", required: true, attributes: { tabindex: 2 },
                            label: translate("Nombre 11"), labelPosition: "top"
                        }
                    ]
                }
            ]
        };
        const c2 = {
            padding: 5,
            rows: [
                { template: "This is C2", type: "section" },
                {
                    cols: [
                        {
                            view: "text", name: "nombre1", required: true, attributes: { tabindex: 3 },
                            label: translate("Nombre 1"), labelPosition: "top"
                        },
                        {
                            view: "text", name: "nombre11", required: true, attributes: { tabindex: 4 },
                            label: translate("Nombre 11"), labelPosition: "top"
                        }
                    ]
                },
                {
                    cols: [
                        {
                            view: "text", name: "nombre1", required: true, attributes: { tabindex: 5 },
                            label: translate("Nombre 1"), labelPosition: "top"
                        },
                        {
                            view: "text", name: "nombre11", required: true, attributes: { tabindex: 6 },
                            label: translate("Nombre 11"), labelPosition: "top"
                        }
                    ]
                },
                {
                    view: "textarea", name: "nombre1", required: true, attributes: { tabindex: 7 },
                    label: translate("Nombre 1"), labelPosition: "top"
                }
            ]
        };
        const tab1 = {
            header: "Datos generales",
            body: {
                rows: [
                    {
                        cols: [
                            c1,
                            c2
                        ]
                    }
                ]
            }
        };
        const tab2 = {
            header: "Económicos",
            body: {
                cols: [
                    {
                        width: 200
                    },
                    {
                        view: "text", name: "nombre2", required: true, attributes: { tabindex: 8 },
                        label: translate("Nombre 2"), labelPosition: "top"
                    }
                ]
            }
        };
        const _view = {
            view: "layout",
            id: "testsForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-cube-outline", width: 37, align: "left" },
                        { view: "label", label: translate("Tests") }
                    ]
                },
                {
                    view: "form",
                    id: "frmTests",
                    elements: [
                        {
                            view: "tabview",
                            cells: [
                                tab1,
                                tab2
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
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        $$("frmTests").setValues({
            nombre1: "MI no1",
            nombre11: "El 11",
            nombre2: "MI no2"
        })
    }
    load(testId) {
    }
    cancel() {
        this.$scope.show('/top/tests');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmTests").validate({ hidden: true })) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmTests").getValues();
        data = areasService.checkFormValues(data);
        messageApi.normalMessage("Ha pasado validación");
    }
    loadUnidadesNegocio(unidadNegocioId) {
        unidadesNegocioService.getUnidadesNegocio(usuarioService.getUsuarioCookie())
            .then(rows => {
                var tests = generalApi.prepareDataForCombo('unidadNegocioId', 'nombre', rows);
                var list = $$("cmbUnidadNegocio").getPopup().getList();
                list.clearAll();
                list.parse(tests);
                if (id) {
                    $$("cmbUnidadNegocio").setValue(unidadNegocioId);
                    $$("cmbUnidadNegocio").refresh();
                }
                return;
            });
    }
}