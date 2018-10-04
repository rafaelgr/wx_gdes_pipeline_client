import { JetView } from "webix-jet";

export default class Experiment extends JetView {
    config() {

        function generateData(){
            var data = [];
            for (var i=0; i<50; i++){
              data.push({
                check: Math.random() > 0.85 ? 1 : 0,
                star: Math.random() > 0.4 ? 1 : 0,
                from: Math.random() > 0.5 ? "Webix Support" : "Sales", 
                subject:"Issue WBX-A"+Math.round(Math.random()*80)+", "+(Math.random() > 0.3 ? "resolved" : "open"), 
                date:"Aug "+(19+Math.round(Math.random()*10))
              });
            }
            return data;
          }
          var searchBar = { paddingY:10, paddingX:0, margin:0, view:"form", cols:[
            { view:"search" },
            { },
            { view: "button", type:"iconButton", icon:"bell-slash", width:50 }
          ]};
          var topHeader = { type:"clean", cols:[
            { template:" ", css:"logo", height: 60, width:200 },
            searchBar,
            { template:"<div class='avatar'>M</div>", css:"user_info", width:60 }
          ]};
          
          
          var paging = {
            type:"clean", cols:[
              { view:"button", type:"iconButton", icon:"chevron-left", width:47, css:"button_raised button_silver" },
              { view:"button", type:"iconButton", icon:"chevron-right", width:47, css:"button_raised button_silver" },
            ]
          };
              
          var appHeader = { paddingY:5, margin:15, cols:[
            { view:"button", value:"Mail", width: 200, css:"big_button" },
            { view:"button", type:"iconButton", icon:"check-square-o", width:50, css:"button_raised button_silver"  },
            { view:"button", type:"iconButton", icon:"history", width:50, css:"button_raised button_silver"  },
            { view:"button", value:"More:", width:90, css:"button_raised button_silver"  },
            {},
            { view:"label", label:"<b>1-50</b> of <b>2300</b> ", align:"right" },
            paging,
            { view:"button", type:"iconButton", icon:"arrows-alt", width:50, css:"button_raised button_silver"  },
            { width:10 }
          ]};
          
          var categories = [
            { value:"Inbox" },
            { value:"Starred" },
            { value:"Sent Mail" },
            { value:"Drafts"}
          ];
          
          var bottomTabs = {
            type:"clean", paddinX:10, rows:[
              { animate:false, cells:[
                { id:"a1", css:"draft", template:"<p class='title'>Contacts</p>" },
                { id:"a2", css:"draft", template:"<p class='title'>Comments</p>" },
                { id:"a3", css:"draft", template:"<p class='title'>Phone Calls</p>" }
              ]},
              { view:"tabbar", value:"a2", type:"bottom", multiview:true, tabMinWidth: 50,  options:[
                { id:"a1", value:"<span class='webix_icon fa-user'></span>" },
                { id:"a2", value:"<span class='webix_icon fa-comment'></span>" },
                { id:"a3", value:"<span class='webix_icon fa-phone'></span>" },
              ]}
            ]
          };
          
          var topOptions = {
            padding: 10, margin:10, rows:[
              { view:"button", value:"Compose", inputWidth: 120, css:"button_raised" },
              { view:"list", select:true, data:categories, scroll:false, autoheight:true },
            ]
          };
          
          var sidebar = {rows:[
            topOptions,
            bottomTabs
          ], width: 200};
          
          var mailTable = {
            view:"datatable", scroll:"y",
            columns:[
              { id:"check", template:"{common.checkbox()}", width: 40 },
              { id:"star", template: function(obj){
                return "<span class='webix_icon orange_star fa-star"+(obj.star?"":"-o")+"'></span>"
              }, width:40 },
              { id:"from", width: 150 },
              { id:"subject", fillspace:true },
              { id:"date" }
            ], header:false, data:generateData()
          };
          
          var socialTable =  { css:"draft", template:"<p class='title'>Social emails here</p>" };
          var updatesTable =  { css:"draft", template:"<p class='title'>Updates here</p>" };
          var infoTabs = { view:"tabview", 
            tabbar:{ optionWidth:200 }, 
            cells:[
              { header:"Primary", body: { rows:[ mailTable ], type:"space" }}, 
              { header:"Social", body: { rows:[ socialTable ], type:"space" }},
              { header:"Updates", body: { rows:[ updatesTable ], type:"space" }}
          ]};
          
        
        return {
          rows:[
              topHeader,
              appHeader,
              { cols:[
              sidebar,
              infoTabs
            ]}
          ]
        };
    }
    init() {

    }


}