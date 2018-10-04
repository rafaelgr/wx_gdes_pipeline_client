import { JetView, plugins } from "webix-jet";
import mainMenu from "views/mainMenu";
import mainToolBar from "views/mainToolbar";

const menudata = [
	{
		id: "main", icon: "home", value: "This a big title for a menu item", open: true, data: [
			{ id: "start", value: "Dashboard", icon: "home", $css: "dashboard", details: "reports and statistics" },
			{ id: "data", value: "Orders", icon: "check-square-o", $css: "orders", details: "order reports and editing" },
			{ id: "products", value: "Products", icon: "cube", $css: "products", details: "all products" },
			{ id: "product_edit", value: "Product Edit", icon: "pencil-square-o", details: "changing product data" }
		]
	},
	{
		id: "components", icon: "table", open: true, value: "Components", data: [
			{ id: "datatables", value: "Datatables", icon: "table", details: "datatable examples" },
			{ id: "charts", value: "Charts", icon: "bar-chart-o", details: "charts examples" },
			{ id: "forms", value: "Forms", icon: "list-alt", details: "forms examples" }

		]
	},
	{
		id: "uis", icon: "calendar", value: "UI Examples", open: 1, data: [
			{ id: "calendar", value: "My Calendar", icon: "calendar", details: "calendar example" },
			{ id: "files", value: "File Manager", icon: "folder-open-o", details: "file manager example" }

		]
	}
];


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
		
	}
}

