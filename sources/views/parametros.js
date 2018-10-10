import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { parametrosService } from "../services/parametros_service";
import { messageApi } from "../utilities/messages";

export default class Parametros extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view = {
            view: "layout",
            id: "parametrosForm",
            rows: [
                {
                    view: "toolbar", padding: 3, elements: [
                        { view: "icon", icon: "cogs", width: 37, align: "left" },
                        { view: "label", label: translate("Parámetros") }
                    ]
                },
                {
                    view: "form",
                    id: "frmParametros",
                    elements: [
                        {
                            cols: [
                                {
                                    view: "text", name: "anoEnCurso",
                                    label: translate("Año en curso"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "valorActualAno",
                                    label: translate("Contador actual"), labelPosition: "top"
                                },
                                {
                                    view: "text", name: "valorInicialAno",
                                    label: translate("Contador inicial año"), labelPosition: "top"
                                }
                            ]
                        },
                        {
                            view: "textarea", name: "docAppSpain",
                            label: translate("Documentos aplicables (ESPAÑA)"), labelPosition: "top"
                        },
                        {
                            view: "textarea", name: "docAppUk",
                            label: translate("Documentos aplicables (UK)"), labelPosition: "top"
                        },
                        {
                            view: "textarea", name: "docAppFrance",
                            label: translate("Documentos aplicables (FRANCIA)"), labelPosition: "top"
                        },
                        {
                            margin: 5, cols: [
                                { gravity: 5 },
                                { view: "button", label: translate("Cancelar"), click: this.cancel },
                                { view: "button", label: translate("Aceptar"), click: this.accept, type: "form" }
                            ]
                        }
                    ]
                }
            ]
        }
        return _view;
    }
    init() {
        usuarioService.checkLoggedUser();
        this.load();
    }
    load() {
        parametrosService.getParametros(usuarioService.getUsuarioCookie(), (err, parametros) => {
            if (err) return messageApi.errorMessageAjax(err);
            $$("frmParametros").setValues(parametros);
        });
    }
    cancel() {
        this.$scope.show('/top/inicio');
    }
    accept() {
        // Here goes validation
        var data = $$("frmParametros").getValues();
        parametrosService.putParametros(usuarioService.getUsuarioCookie(), data,
            (err, result) => {
                if (err) return messageApi.errorMessageAjax(err);
                this.$scope.show('/top/inicio');
            });
    }
}