import { JetView, plugins } from "webix-jet";
import profile from "menus/profile";
import search from "menus/search";
import mail from "menus/mail";
import message from "menus/message";

export default class MainToolbar extends JetView {
	config() {
		var app = this.app;
		const langs = app.getService("locale");
		const themes = app.getService("theme");
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
				{ view: "label", label: "<a href='http://ariadnasw.com'><img src='assets/img/gdes_logo.png' height='35' /></a>", width: 150 },
				{
					height: 46, id: "person_template", css: "header_person", borderless: true, width: 180, data: { id: 2, name: "Mary Lamb Cusionh" },
					template: function (obj) {
						var html = "<div style='height:100%;width:100%;' onclick='webix.$$(\"profilePopup\").show(this)'>";
						html += "<img class='photo' src='assets/img/photos/" + obj.id + ".png' /><span class='name'>" + obj.name + "</span>";
						html += "<span class='webix_icon fa-angle-down'></span></div>";
						return html;
					}
				},
				{
					view: "label", label: this.app.config.name
				},
				{ view: "icon", icon: "search", width: 45, popup: "searchPopup" },
				{ view: "icon", icon: "envelope-o", value: 3, width: 45, popup: "mailPopup" },
				{ view: "icon", icon: "flag", value: 5, width: 45, popup: "messagePopup" },
				{
					view: "button", type: "icon", icon: "bell", width: 37, align: "right",
					click: () => {
						langs.setLang('es-ES');
					}
				},
				{
					view: "button", type: "icon", icon: "home", width: 37, align: "right",
					click: () => {
						themes.setTheme('compact');
					}
				}
			]

		};
		return mainToolBar;
	}
	init() {
		this.ui(profile);
		this.ui(search);
		this.ui(mail);
		this.ui(message);
	}
}