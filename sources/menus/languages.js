const ui = {
	view: "popup",
	id: "languagesPopup",
	width: 300,
	padding:0,
	css:"list_popup",
	body:{
		type: "clean",
		borderless:true,
		rows:[
			{
				view: "list",
				autoheight: true,
				data: [
					{id: 1, name: "es-ES", text: "Español", personId:1},
					{id: 2, name: "em-UK", text: "English", personId:2}
				],
				type:{
					height: 45,
					template: "	<img class='photo' src='assets/img/photos/#personId#.png' /><span class='text'>#text#</span><span class='name'>#name#</span>"

				}
			},
			{
				css: "show_all", template: "Show all messages <span class='webix_icon fa-angle-double-right'></span>", height: 40
			}
		]
	}
};

export default ui;