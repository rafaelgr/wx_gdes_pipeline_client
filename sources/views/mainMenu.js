import { JetView, plugins } from "webix-jet";


export default class MainMenu extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var mainMenu = {
            view: "sidebar",
            id: "main:menu",
            activeTitle: true, select: true,
            data: [
                {
                    id: "inicio", icon: "mdi mdi-home", value: translate("INICIO")
                },
                {
                    icon: "mdi mdi-switch", open: true, value: translate("ADMINISTRACIÓN"),
                    data: [
                        { id: "parametros", value: translate("Parámetros"), icon: "mdi mdi-altimeter", details: "Parámetros de la aplicación", },
                        { id: "gruposUsuarios", value: translate("Grupos de usuarios"), icon: "mdi mdi-account-group", details: "Grupos de usuarios" },
                        { id: "usuarios", value: translate("Usuarios"), icon: "mdi mdi-account", details: "Usuarios" },
                        { id: "paises", value: translate("Paises"), icon: "mdi mdi-flag", details: "Paises" },
                        { id: "empresas", value: translate("Empresas"), icon: "mdi mdi-cube", details: "Empresas" },
                        { id: "unidadesNegocio", value: translate("Unidades de negocio"), icon: "mdi mdi-cube-scan", details: "Unidades de negocio" },
                        { id: "areas", value: translate("Areas"), icon: "mdi mdi-cube-outline", details: "Areas" },
                        { id: "servicios", value: translate("Servicios"), icon: "mdi mdi-cube-unfolded", details: "Servicios" },
                        { id: "fasesOferta", value: translate("Fases de oferta"), icon: "mdi mdi-filter-variant", details: "Fases de oferta" },
                        { id: "tiposOportunidad", value: translate("Tipos de oportunidad"), icon: "mdi mdi-shape", details: "Tipos de oportunidad" },
                        { id: "tiposContrato", value: translate("Tipos de contrato"), icon: "mdi mdi-shape-outline", details: "Tipos de contrato" },
                        { id: "estados", value: translate("Estados"), icon: "mdi mdi-thumbs-up-down", details: "Estados" },
                        { id: "razonesPerdida", value: translate("Razon perdida"), icon: "mdi mdi-thumb-down", details: "Razon perdida" },
                        { id: "divisas", value: translate("Divisas"), icon: "mdi mdi-currency-eur", details: "Divisas" },
                        { id: "ubicaciones", value: translate("Ubicaciones"), icon: "mdi  mdi-map-marker-outline", details: "Ubicaciones" }

                    ]
                },
                {
                    icon: "mdi mdi-buffer", open: true, value: translate("GESTIÓN"),
                    data: [
                        { id: "ofertas", value: translate("Ofertas"), icon: "mdi mdi-arrow-decision-outline", details: "Ofertas" }
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

//