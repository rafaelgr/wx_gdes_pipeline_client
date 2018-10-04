import { JetView, plugins } from "webix-jet";

var mainToolbar = {
    view: "toolbar",
    id: "layout:toolbar"
}

var mainMenu = {
    view: "sidebar",
    id: "layout:menu",
    template: "<span class='webix_icon fa-#icon#'></span> #value# ",
    data: [
        { value: "DashBoard", id: "start", icon: "envelope-o" },
        { value: "Data", id: "data", icon: "briefcase" }
    ]
}

var body = {
	rows: [
		{ height: 49, id: "title", css: "title", template: "<div class='header'>#title#</div><div class='details'>( #details# )</div>", data: { text: "", title: "" } },
		{
			view: "scrollview", scroll: "native-y",
			body: { cols: [{ $subview: true }] }
		}
	]
};

var layout = {
    rows: [
        mainToolbar,
        {
            cols: [
                mainMenu,
				{
					view:"resizer",
					id:"resizer"
				},
				body
            ]
        }
    ]
}

export default class LayoutView extends JetView {
    config() {
        return layout;
    }
    init() {
        this.use(plugins.Menu, "layout:menu");
    }
}