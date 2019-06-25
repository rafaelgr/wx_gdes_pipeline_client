import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";

export default class PprReport extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var _view = {
            template: "<div id='report_viewer'></div>"
        }
        return _view;
    }

    init(view, url) {
        var ofertaId = this.getParentView()._data.ofertaId;
        console.log("OFERTA ID PPR: ", ofertaId);
    }
}