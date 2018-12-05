import { JetView, plugins } from "webix-jet";
import mainMenu from "views/mainMenu";
import mainToolBar from "views/mainToolbar";
import {usuarioService} from "../services/usuario_service";
import { languageService} from "../locales/language_service";

export default class TopView extends JetView {
	config() {
		var mainBody = {
			$subview: true
		};

		var ui = {
			type: "view",
			rows: [
				mainToolBar,
				{
					cols: [
						mainMenu,
						{
							view: "resizer",
							id: "resizer"
						},
						mainBody
					]
				}
			]
		};

		return ui;
	}
	init() {
		// Control general del idioma del usuario
		var usu = usuarioService.checkLoggedUser();
		languageService.setLanguage(this.app, usu.codigoIdioma);
	}
}

