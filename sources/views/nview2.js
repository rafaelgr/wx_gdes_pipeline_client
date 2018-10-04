import { JetView } from "webix-jet";

export default class Nview1 extends JetView {
    config() {
        return { template: "Doing things...."};
    }
    init() {
        alert("I'm in init from nview2");
    }
}