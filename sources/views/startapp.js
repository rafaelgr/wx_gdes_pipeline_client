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
        // Auth url
        var authUrl = devConfig.getApiUrl() + "/auth/openid"
        // Verify if exists a use cookie
        var usu = usuarioService.getUsuarioCookie();
        if (!usu) return window.open(authUrl, '_self');
    }
}