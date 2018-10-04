import { JetView } from "webix-jet";
import { devConfig } from "../config/config";

export default class LoginAuto extends JetView {
    config() {
        return {
            template: "Login auto..."
        }
    }
    init(view, url) {
        console.log('init ', url[0]);
        
    }
    urlChange(view, url){
        console.log('urlChange',  url[0].params.email);
    }
}