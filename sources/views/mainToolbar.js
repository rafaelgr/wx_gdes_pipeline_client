import { JetView, plugins } from "webix-jet";
import { usuarioService } from "../services/usuario_service";


export default class MainToolbar extends JetView {
	config() {
		var app = this.app;
		const langs = app.getService("locale");
		const themes = app.getService("theme");
		const usu = usuarioService.getUsuarioCookie();
		var mainToolBar = {
			view: "toolbar",
			height: 50,
			elements: [
				{
					view: "button", type: "icon", icon: "bars", width: 37, align: "left",
					click: function () {
						$$("main:menu").toggle();
					}
				},
				{ view: "label", label: "<a href='#!/top/inicio'><img src='assets/img/gdes_logo.png' height='35' /></a>", width: 150 },
				{
					height: 46, id: "person_template", css: "header_person", borderless: true, data: usu,
					template: function (obj) {
						var html = "<div style='height:100%;width:100%;'>";
						html += "<img class='photo' src='assets/img/man-user.png' /><span class='name'>" + obj.nombre + "</span>";
						return html;
					}
				},
				{
					view: "label", label: this.app.config.name
				},
				{
					view: "button", type: "icon", icon: "sign-out", width: 37, align: "right",
					click: () => {
						usuarioService.deleteUsuarioCookie();
						window.open('https://login.microsoftonline.com/common/oauth2/logout', '_self');
					}
				}
			]

		};
		return mainToolBar;
	}
	init() {
	}

}

