import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { gruposUsuariosService } from "../services/gruposUsuarios_service";

var editButton = "<span class='webix_icon fa-edit'></span>";
var deleteButton = "<span class='webix_icon fa-trash'></span>";

export default class GruposUsuarios extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarGruposUsuarios = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "users", width: 37, align: "left" },
                { view: "label", label: translate("Grupos de usuarios") }
            ]
        }
        var pagerGruposUsuarios = {
			cols: [
				{
					view: "button", type: "icon", icon: "plus", width: 37, align: "left",
					click: () => {
						webix.message("Not implemented yet");
					}
				},
				{
					view: "button", type: "icon", icon: "table", width: 37, align: "right", 
					click: () => {
						console.log("Export to excel...");
						webix.toExcel($$("gruposUsuariosGrid"),{
							filename: "grupos_usuarios",
							name: "Grupos",
							rawValues:true,
							ignore: {"actions": true}
						  });
					}
				},
				{},
				{
					view: "pager", id: "mypager", css: { "text-align": "right" },
					template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
					size: 25,
					group: 5
				}
			]
		};
        var datatableGruposUsuarios = {
            view: "datatable",
            id: "gruposUsuariosGrid",
            pager: "mypager",
            columns: [
                { id: "grupoUsuarioId", adjust: true, header: translate("ID"), sort: "string" },
                { id: "nombre", fillspace: true, header: [translate("Nombre de grupo"), { content: "textFilter" }], sort: "string" },
                { id: "actions", header: [{ text: translate("Acciones"), css: { "text-align": "center" } }], template: editButton + deleteButton, css: { "text-align": "center" } }
            ]
        }
        var _view = {
            rows: [
                toolbarGruposUsuarios,
                pagerGruposUsuarios,
                datatableGruposUsuarios
            ]
        }
        return _view;
    }
    init() {
        usuarioService.checkLoggedUser();
        this.load();
    }
    load() {
        gruposUsuariosService.getGruposUsuarios(usuarioService.getUsuarioCookie(), (err, data)=>{
            if (err) return messageApi.errorMessageAjax(err);
            $$("gruposUsuariosGrid").parse(data);
        })
    }
}