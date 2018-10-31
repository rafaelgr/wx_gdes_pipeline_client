import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { paisesService } from "../services/paises_service";
import { empresasService } from "../services/empresas_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";

var empresaId = 0;

export default class EmpreasForm extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "empresasForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "mdi mdi-cube", width: 37, align: "left" },
                        { view: "label", label: translate("Empresas") }
                    ]
                },
                {
                    view: "form",

                    id: "frmEmpresas",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "empresaId", width: 100, disabled: true,
                                    label: translate("ID"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "nombre", required: true, id: "firstField",
                                    label: translate("Nombre empresa"), labelPosition: "top"
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
                                    view: "combo", id: "cmbPais", name: "paisId", required: true, options: {},
                                    label: translate("Pais relacionado"), labelPosition: "top"
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
        if (url[0].params.empresaId) {
            empresaId = url[0].params.empresaId;
        }
        this.load(empresaId);
        webix.delay(function () { $$("firstField").focus(); });
    }
    load(empresaId) {
        if (empresaId == 0) {
            this.loadPaises();
            return;
        }
        empresasService.getEmpresa(usuarioService.getUsuarioCookie(), empresaId)
            .then((empresa) => {
                $$("frmEmpresas").setValues(empresa);
                this.loadPaises(empresa.paisId);
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }
    cancel() {
        this.$scope.show('/top/empresas');
    }
    accept() {
        const translate = this.$scope.app.getService("locale")._;
        if (!$$("frmEmpresas").validate()) {
            messageApi.errorMessage(translate("Debe rellenar los campos correctamente"));
            return;
        }
        var data = $$("frmEmpresas").getValues();
        if (empresaId == 0) {
            data.empresaId = 0;
            empresasService.postEmpresa(usuarioService.getUsuarioCookie(), data)
                .then((result) => {
                    this.$scope.show('/top/empresas?empresaId=' + result.empresaId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        } else {
            empresasService.putEmpresa(usuarioService.getUsuarioCookie(), data)
                .then(() => {
                    this.$scope.show('/top/empresas?empresaId=' + data.empresaId);
                })
                .catch((err) => {
                    messageApi.errorMessageAjax(err);
                });
        }
    }
    loadPaises(paisId) {
        paisesService.getPaises(usuarioService.getUsuarioCookie())
            .then(rows => {
                var empresas = generalApi.prepareDataForCombo('paisId', 'nombre', rows);
                var list = $$("cmbPais").getPopup().getList();
                list.clearAll();
                list.parse(empresas);
                if (id) {
                    $$("cmbPais").setValue(paisId);
                    $$("cmbPais").refresh();
                }
                return;
            });
    }
}