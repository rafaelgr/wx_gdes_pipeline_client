import { JetView, plugins, JetApp } from "webix-jet";
export const menuOptions = {
    getMainMenuOptions: (user) => {
        
        var menuData = [
            {
                id: "inicio", icon: "home", value: _("Inicio")
            },
            {
                id: "administracion", icon: "bank", open: true, value: _("Administración"), data: [
                    { id: "parametros", value: _("Parámetros"), icon: "cogs", details: "datatable examples" }
        
                ]
            }
        ];
        return menuData;
    }
}