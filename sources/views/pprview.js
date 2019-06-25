import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { devConfig } from "../config/config";
import PprReport from "./pprReport";

var ofertaId;

export default class PprView extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var _view = {
            view: "layout",
            borderless: true,
            rows: [
                {
                    cols: [
                        { view: "icon", icon: "mdi mdi-message-processing", width: 37, click: this.rptType1 },
                        {
                            borderless: true,
                            template: translate(`<strong>PPR Short:</strong> Informe corto de tres página. Haga clic en el icono para visualizarlo`), click: this.rptType1
                        }
                        
                    ]
                },
                {
                    cols: [
                        { view: "icon", icon: "mdi mdi-message-text", width: 37, click: this.rptType2 },
                        {
                            borderless: true,
                            template: translate(`<strong>PPR Complete:</strong> Informe completo de cuatro páginas. Haga clic en el icono para visualizarlo`), click: this.rptType2
                        }

                    ]

                },
                {
                    cols: [
                        { view: "icon", icon: "mdi mdi-message-settings", width: 37, click: this.rptType3 },
                        {
                            borderless: true,
                            template: translate(`<strong>PPR Annex:</strong> Informe solo con los annexos. Haga clic en el icono para visualizarlo`), click: this.rptType3
                        }

                    ]
                }
            ]
        };
        return _view;
    }

    init(view, url) {
        ofertaId = this.getParentView()._data.ofertaId;
        this.pprReport2 = this.ui(PprReport);
    }

    rptType1() {
        this.$scope.pprReport2.showWindow(ofertaId, 1);
    }

    rptType2() {
        this.$scope.pprReport2.showWindow(ofertaId, 2);
    }

    rptType3() {
        this.$scope.pprReport2.showWindow(ofertaId, 3);
    }
}