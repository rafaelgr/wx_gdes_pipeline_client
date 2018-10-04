import { JetView } from "webix-jet";
import { data, catOptions } from "models/records";

var currentRowDatatableView = null;
var currentIdDatatableView = null;
webix.i18n.locales["es-ES"] = {   //"es-ES" - the locale name, the same as the file name
	groupDelimiter: ".",       //a mark that divides numbers with many digits into groups
	groupSize: 3,              //the number of digits in a group
	decimalDelimiter: ",",     //the decimal delimiter
	decimalSize: 2,            //the number of digits after the decimal mark

	//applied to columns with 'format:webix.i18n.dateFormatStr'
	dateFormat: "%d/%m/%Y",
	//applied to columns with 'format:webix.i18n.dateFormatStr'
	timeFormat: "%H:%i",
	//applied to columns with 'format:webix.i18n.longDateFormatStr'
	longDateFormat: "%d %F %Y",
	//applied to cols with 'format:webix.i18n.fullDateFormatStr'
	fullDateFormat: "%d.%m.%Y %H:%i",
	am: null,
	pm: null,
	//€ - currency name. Applied to cols with 'format:webix.i18n.priceFormat'
	price: "{obj} €",
	calendar: {
		monthFull: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
			"Septiembre", "Octubre", "Noviembre", "Diciembre"],
		monthShort: ["En", "Feb", "Mar", "Abr", "Mayo", "Jun", "Jul", "Ago", "Sep", "Oct",
			"Nov", "Dic"],
		dayFull: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
		dayShort: ["Dom", "Lun", "Mar", "Mier", "Jue", "Vier", "Sab"]
	},
	hours: "Horas ",
	minutes: "Minutos",
	done: "Listo",

	controls: {
		select: "Seleccione"
	}
};
webix.i18n.setLocale("es-ES");

webix.editors.editdate = webix.extend({
	render: function () {
		var icon = "<span class='webix_icon fa-calendar' style='position:absolute; cursor:pointer; top:4px; right:4px;'></span>";
		var node = webix.html.create("div", {
			"class": "webix_dt_editor"
		}, "<input type='date'>" + icon);

		node.childNodes[1].onclick = function () {
			var master = webix.UIManager.getFocus();
			var editor = master.getEditor();

			master.editStop(false);
			var config = master.getColumnConfig(editor.column);
			config.editor = "date";
			master.editCell(editor.row, editor.column);
			config.editor = "editdate";
		}
		return node;
	}
}, webix.editors.text);

var dateControl = (value) => {
	return webix.rules.isNotEmpty(value);
}
var semaphore = false; // controls whether a validation function is called from rules or validate

var rankingControl = (v) => {
	if (!webix.rules.isNumber(v)) return false;
	semaphore = false;
	return true;
}
var defaultHideColumns = (dtb, columns) => {
	columns.forEach((r) => {
		$$(dtb).hideColumn(r);
	});
}

var defaultShowColumns = (dtb, columns) => {
	columns.forEach((r) => {
		$$(dtb).showColumn(r);
	});
}

var user = "<span class='webix_icon fa-edit'></span>";
var cog = "<span class='webix_icon fa-trash'></span>";

var multiColumnControl = (obj) => {
	var correct = true;
	if (semaphore) {
		if (obj.date > obj.date2) {
			webix.message({
				type: "error",
				text: "To Date must be greater then From Date"
			});
			correct = false;
		}
		if (obj.rating < 0 || obj.rating > 10) {
			webix.message({
				type: "error",
				text: "Rating must be between 0 and 10"
			});
			correct = false;
		}
	}
	semaphore = false;
	return correct;
}


export default class DataView extends JetView {
	config() {
		const trans = this.app.getService("locale")._;
		var datatableView = {
			view: "datatable",
			id: "data:datatable",
			pager: "mypager",
			columns: [
				{ id: "id", adjust: true, header: "ID" },
				{ id: "title", fillspace: true, header: [trans("Title"), { content: "textFilter" }], editor: "text", sort: "string" },
				{
					id: "category", header: [trans("Category"), { content: "textFilter" }],
					editor: "select", sort: "string",
					options: ["", "Adventure", "Action", "Western"]
				},
				{ id: "year", header: [trans("Year"), { content: "selectFilter" }], editor: "text", sort: "string" },
				{
					id: "votes", header: [{ text: trans("Votes"), css: { "text-align": "right" } }, { content: "numberFilter" }], editor: "text", css: { "text-align": "right" },
					format: webix.i18n.priceFormat, sort: "int"
				},
				{
					id: "rating", header: [{ text: trans("Rating"), css: { "text-align": "right" } }, { content: "numberFilter" }], editor: "text", css: { "text-align": "right" },
					format: webix.i18n.numberFormat, sort: "int"
				},
				{
					id: "date", header: [{ text: trans("From Date"), css: { "text-align": "center" } }, { content: "textFilter" }], editor: "editdate", width: 150,
					format: webix.i18n.dateFormatStr, sort: "string"
				},
				{
					id: "date2", header: [{ text: trans("To Date"), css: { "text-align": "center" } }, { content: "textFilter" }], editor: "editdate", width: 150,
					format: webix.i18n.dateFormatStr, sort: "string"
				},
				{ id: "actions", header: [{ text: trans("Actions"), css: { "text-align": "center" } }], template: user + cog, css: { "text-align": "center" } }

			],
			onClick: {
				"fa-edit": function (event, id, node) {
					var dtable = this;
					webix.confirm(trans("Dou you want edit this row?"), function (action) {
						if (action === true) {
							dtable.remove(id.row)
							// here this refers to window.
						}

					});
				},
				"fa-trash": function (event, id, node) {
					var dtable = this;
					var curRow = this.data.pull[id.row];
					webix.confirm(trans("Are you sure, to delete ") + curRow.title + "?", function (action) {
						if (action === true) {
							dtable.remove(id.row)
							// here this refers to window.
						}

					});
				}
			},
			editable: true,
			editaction: "dblclick",
			rules: {
				"title": webix.rules.isNotEmpty,
				"votes": webix.rules.isNumber,
				"date": dateControl,
				"date2": dateControl,
				"rating": rankingControl,
				$obj: multiColumnControl

			},
			on: {
				"onAfterEditStart": function (id) {
					currentIdDatatableView = id.row;
					currentRowDatatableView = this.data.pull[currentIdDatatableView];
				},
				"onAfterEditStop": function (state, editor, ignoreUpdate) {
					if (state.value != state.old) {
						semaphore = true;
						if (!this.validate(currentIdDatatableView)) {
							webix.message({
								type: "error",
								text: "Incorrect values in the grid"
							})
						} else {
							currentRowDatatableView = this.data.pull[currentIdDatatableView];
							console.log("Row has changed new row :", currentRowDatatableView);
						}
					}
				},
			}
		};
		var dataToolbar = {
			view: "toolbar",
			height: 50,
			elements: [
				{
					view: "label",
					label: "A datatable exemple with inline editing"
				}
			]
		};
		var pagerView = {
			cols: [
				{
					view: "button", type: "icon", icon: "plus", width: 37, align: "left",
					click: () => {
						webix.message("Not implemented yet");
					}
				},
				{
					view: "button", type: "icon", icon: "plus-square", width: 37, align: "left",
					click: () => {
						var newRow = { id: -1 };
						defaultShowColumns("data:datatable", ["year", "category"]);
						$$("data:datatable").add(newRow, 0);
						$$("data:datatable").edit({
							row:-1,
							column:"title"
						});
						
					}
				},
				{
					view: "button", type: "icon", icon: "eye", width: 37, align: "left",
					click: () => {
						defaultShowColumns("data:datatable", ["year", "category"]);
					}
				},
				{
					view: "button", type: "icon", icon: "table", width: 37, align: "right", 
					click: () => {
						console.log("Export to excel...");
						webix.toExcel($$("data:datatable"),{
							filename: "table",
							name: "Films",
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
		return {
			rows: [
				dataToolbar,
				pagerView,
				datatableView
			]
		};
	}
	init(view) {
		var data2 = [];
		for (var i = 1; i < data.length; i++) {
			r = data[i];
			r.date = new Date(r.date);
			data2.push(r);
		}
		defaultHideColumns("data:datatable", ["year", "category"]);
		$$("data:datatable").parse(data);
		webix.UIManager.addHotKey("Esc", function () {
			console.log("Esc key to remove");
			$$('data:datatable').remove(-1);
			return false;
		}, $$('data:datatable'));
	}
}