import { JetView, plugins } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { languageService} from "../locales/language_service";

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
        usuarioService.getLoginEmail(url[0].params.email)
            .then(usuario => {
                usuarioService.setUsuarioCookie(usuario);
                languageService.setLanguage(this.app, usuario.codigoIdioma);
                this.app.show('top/inicio');
            })
            .catch(err => {
                messageApi.errorMessageAjax(err);
            });
    }
}