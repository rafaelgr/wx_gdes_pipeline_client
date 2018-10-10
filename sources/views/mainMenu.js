import { JetView, plugins } from "webix-jet";


export default class MainMenu extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var mainMenu = {
            view: "sidebar",
            width: 200,
            id: "main:menu",
            activeTitle: true, select: true,
            data: [
                {
                    id: "inicio", icon: "home", value: translate("Inicio")
                },
                {
                    id: "administracion", icon: "bank",  value: translate("Administración"), data: [
                        { id: "parametros", value: translate("Parámetros"), icon: "cogs", details: "Parámetros de la aplicación" },
                        { id: "gruposUsuarios", value: translate("Grupos de usuarios"), icon: "users", details: "Grupos de usuarios" },
                        { id: "paises", value: translate("Paises"), icon: "cog", details: "Paises" },
                        { id: "empresas", value: translate("Empresas"), icon: "cog", details: "Empresas" }
                    ]
                }
            ]
        };
        return mainMenu;
    }
    init() {
        this.use(plugins.Menu, "main:menu");
    }
}

