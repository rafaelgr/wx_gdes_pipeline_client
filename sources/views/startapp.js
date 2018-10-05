import { JetView } from "webix-jet";
import { devConfig } from "../config/config";
import { usuarioService } from "../services/usuario_service"

export default class StartApp extends JetView {
    config() {
        return {
            template: "GDES PIPELINE starting ..."
        }
    }
    init() {
        if (usuarioService.checkLoggedUser()) this.app.show('top/inicio');
    }
}