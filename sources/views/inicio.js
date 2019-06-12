import { JetView, plugins } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { languageService} from "../locales/language_service";

export default class Inicio extends JetView {
    config() {
		const translate = this.app.getService("locale")._;
        return {
            view:"iframe", id:"frame-body", src:"https://gdes.com"
        }
    }
    init() {
        var usu = usuarioService.checkLoggedUser();
        languageService.setLanguage(this.app, usu.codigoIdioma);
    }
}


