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
                        { id: "usuarios", value: translate("Usuarios"), icon: "user", details: "Usuarios" },
                        { id: "paises", value: translate("Paises"), icon: "cog", details: "Paises" },
                        { id: "empresas", value: translate("Empresas"), icon: "cog", details: "Empresas" },
                        { id: "unidadesNegocio", value: translate("Unidades de negocio"), icon: "cog", details: "Unidades de negocio" },
                        { id: "areas", value: translate("Areas"), icon: "cog", details: "Areas" },
                        { id: "fasesOferta", value: translate("Fases de oferta"), icon: "cog", details: "Fases de oferta" },
                        { id: "tiposOportunidad", value: translate("Tipos de oportunidad"), icon: "cog", details: "Tipos de oportunidad" },
                        { id: "tiposContrato", value: translate("Tipos de contrato"), icon: "cog", details: "Tipos de contrato" },
                        { id: "estados", value: translate("Estados"), icon: "cog", details: "Estados" },
                        { id: "razonesPerdida", value: translate("Razon perdida"), icon: "cog", details: "Razon perdida" },
                        { id: "divisas", value: translate("Divisas"), icon: "cog", details: "Divisas" }

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

