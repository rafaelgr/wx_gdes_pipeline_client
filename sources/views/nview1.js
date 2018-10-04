import { JetView } from "webix-jet";
import { devConfig } from "../config/config";

export default class Nview1 extends JetView {
    config() {
        return {
            template: "Nview 1"
        }
    }
    init() {
        alert(devConfig.getApiUrl());
    }
}