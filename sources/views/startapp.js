import { JetView } from "webix-jet";
import {devConfig} from "../config/config";

export default class StartApp extends JetView {
    config() {
        return {
            template: "GDES PIPELINE starting ..."
        }
    }
    init() {
       
    }
}