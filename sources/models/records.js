var data0 = [
	{ id:1, title:"The Shawshank Redemption", category: "Adventure", year:1994, votes:678790, rating:9.2, rank:1, date:"2018-12-31", date2:"2018-12-31"},
	{ id:2, title:"The Godfather", category: "Action", year:1972, votes:511495, rating:9.2, rank:2, date:"2018-12-31", date2:"2018-12-31"},
	{ id:3, title:"The Godfather: Part II", category: "Adventure", year:1974, votes:319352, rating:9.0, rank:3, date:"2018-06-21", date2:"2018-12-31"},
	{ id:4, title:"The Good, the Bad and the Ugly", category: "Western", year:1966, votes:213030, rating:8.9, rank:4, date:"2018-04-17", date2:"2018-12-31"},
	{ id:5, title:"My Fair Lady", category: "Adventure", year:1994, votes:533848, rating:8.9, rank:5, date:"2018-12-31", date2:"2018-12-31"},
	{ id:6, title:"12 Angry Men", category: "Adventure", year:1994, votes:164558, rating:8.9, rank:6, date:"2018-12-31", date2:"2018-12-31"}

];

var options = ["", "Adventure","Action","Western"];

export const data = new webix.DataCollection({ data:data0
});

export const catOption = options;