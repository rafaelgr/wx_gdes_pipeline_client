import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";

export default class LoginAuto extends JetView {
    config() {
        return {
            template: "Login auto..."
        }
    }
    init(view, url) {
        
    }
    urlChange(view, url) {
        if (!url[0].params.email) {
            return messageApi.errorMessage('Bad return from Azure');
        } 
        usuarioService.getLoginEmail(url[0].params.email, (err, usuario) => {
            if (err) return messageApi.errorMessageAjax(err);
            // Store user as a cookie 
            usuarioService.setUsuarioCookie(usuario);
            this.app.show('top/inicio');
        });
    }
}