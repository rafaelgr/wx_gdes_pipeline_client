import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import "./styles/app.css";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: "WX_GDES_PIPELINE",
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: !PRODUCTION,
			start: "/startapp",
			name: "GDES PIPELINE"
		};

		super({ ...defaults, ...config });
	}
}

if (!BUILD_AS_MODULE) {

	webix.ready(() => {
		var app = new MyApp();
		app.use(plugins.Locale);
		app.use(plugins.Theme);
		app.render();
		app.getService("theme").setTheme('compact');
	});
}