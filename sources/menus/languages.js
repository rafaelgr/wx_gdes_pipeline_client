export const languagesPopup = {
	view: "popup",
	id: "languagesPopup",
	width: 300,
	padding: 0,
	css: "list_popup",
	body: {
		type: "clean",
		borderless: true,
		rows: [
			{
				view: "list",
				autoheight: true,
				data: [
					{ id: 2, name: "es", text: "Español" },
					{ id: 3, name: "fr", text: "Francais" },
					{ id: 1, name: "en", text: "English" }
				],
				type: {
					height: 45,
					template: "<img class='photo' src='assets/img/flags/#id#.png' onClick='this.insideFunction()' /><span class='text'>#text#</span>"
				}
			}
		]
	}
};


