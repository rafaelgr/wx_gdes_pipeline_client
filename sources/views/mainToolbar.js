import { JetView, plugins } from "webix-jet";
import { usuarioService } from "../services/usuario_service";


export default class MainToolbar extends JetView {
	config() {
		var app = this.app;
		const langs = app.getService("locale");
		const themes = app.getService("theme");
		const usu = usuarioService.getUsuarioCookie();
		const translate = this.app.getService("locale")._;
		var mainToolBar = {
			view: "toolbar",
			height: 50,
			elements: [
				{
					view: "button", type: "icon", icon: "mdi mdi-menu", width: 37, align: "left",
					click: function () {
						$$("main:menu").toggle();
					}
				},
				{ view: "label", label: "<a href='#!/top/inicio'><img src='assets/img/gdes_logo.png' height='35' /></a>", width: 150 },
				{ view: "button", type: "icon", icon: "mdi mdi-account-key mdi-36px", width: 50 },
				{
					height: 46, id: "person_template", css: "header_person", borderless: true, data: usu,
					template: function (obj) {
						var html = "<div style='height:100%;width:100%;'>";
						html += "<span class='name'>" + obj.nombre + "</span> </div>";
						return html;
					}
				},
				{ view: "label", 
					label: `
						<div>
						<img style="vertical-align:middle" src='assets/img/handshake.png' height='35' />
						<span>${this.app.config.name}</span>
						</div>
					`,
					width: 200
				},
				{
					view: "button", type: "icon", icon: "mdi mdi-exit-run mdi-36px", width: 50, align: "right",
					tooltip: translate("Salir y logout"),
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

