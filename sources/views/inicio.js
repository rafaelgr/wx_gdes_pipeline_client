import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";

export default class Inicio extends JetView {
    config() {
		const translate = this.app.getService("locale")._;
        return {
            template: translate("paginainicio")
        }
    }
}
