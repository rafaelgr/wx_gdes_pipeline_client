import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { devConfig } from "../config/config";

var viewer;
var options;
var ofertaId = 211;
var type = 1;

export default class PprReport extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        const _view1 = {
            template: "<div id='report_viewer'></div>"
        }
        var _view = {
            view: "window",
            id: "pprReport",
            position: "center", move: true, resize: true,
            // width: 800,
            // height: 600,
            fullscreen: true,
            head: {
                view: "toolbar", cols: [
                    { view: "label", label: translate("PPR") },
                    {
                        view: "icon", icon: "mdi mdi-close", click: () => {
                            $$('pprReport').hide();
                        }
                    }
                ]
            }, modal: true,
            body: _view1
        };
        return _view;
    }

    cancel() {
        $$('pprReport').hide();
    }

    init(view, url) {
        ofertaId = this.getParentView()._data.ofertaId;
    }

    showWindow(ofertaId, type) {
        $$('pprReport').show();
        this.iniReports();
        this.obtainReport(ofertaId, type);
    }

    iniReports() {
        // Create the report viewer with default options
        viewer = new Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
        options = new Stimulsoft.Viewer.StiViewerOptions();
        Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../localization/es.xml", true);
        Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHltN9ZO4D78QwpEoh6+UpBm5mrGyhSAIsuWoljPQdUv6R6vgv" +
            "iStsx8W3jirJvfPH27oRYrC2WIPEmaoAZTNtqb+nDxUpJlSmG62eA46oRJDV8kJ2cJSEx19GMJXYgZvv7yQT9aJHYa" +
            "SrTVD7wdhpNVS1nQC3OtisVd7MQNQeM40GJxcZpyZDPfvld8mK6VX0RTPJsQZ7UcCEH4Y3LaKzA5DmUS+mwSnjXz/J" +
            "Fv1uO2JNkfcioieXfYfTaBIgZlKecarCS5vBgMrXly3m5kw+YwpJ2v+cMXuDk3UrZgrdxNnOhg8ZHPg9ijHxqUomZZ" +
            "BzKpVQU0d06ne60j/liMH5KirAI2JCVfBcBvIcyliJos8LAWr9q/1sPR9y7LmA1eyS1/dXaxmEaqi5ubhLqlf+OS0x" +
            "FX6tlBBgegqHlIj6Fytwvq5YlGAZ0Cra05JhnKh/ohYlADQz6Jbg5sOKyn5EbejvPS3tWr0LRBH2FO6+mJaSEAwzGm" +
            "oWT057ScSvGgQmfx8wCqSF+PgK/zTzjy75Oh";
        options.appearance.scrollbarsMode = true;
        options.appearance.fullScreenMode = true;
        options.toolbar.showSendEmailButton = true;
    }

    obtainReport(ofertaId, type) {
        StiOptions.WebServer.url = devConfig.getApiUrl() + "/streport";
        var file = "reports/proposal_report.mrt";
        if (type == 1) file = "reports/proposal_report_short.mrt";
        if (type == 3) file = "reports/proposal_report_annex.mrt";
        // Create a new report instance
        var report = new Stimulsoft.Report.StiReport();
        report.loadFile(file);

        devConfig.getConfigMysql()
        .then(data => {
            debugger;
            var myconfig = data;
            var connectionString = "Server=" + myconfig.host + ";";
            connectionString += "Port=" + myconfig.port + ";"
            connectionString += "Database=" + myconfig.database + ";"
            connectionString += "UserId=" + myconfig.user + ";"
            connectionString += "Pwd=" + myconfig.password + ";";
            report.dictionary.databases.list[0].connectionString = connectionString;
    
            // Parámetros
            report.dictionary.variables.items[0].val = ofertaId;
        
            // Assign report to the viewer, the report will be built automatically after rendering the viewer
            viewer.report = report;
            viewer.renderHtml("report_viewer");
        })
        .catch(err => {
            console.log("ERR: ", err);
        })

    }
}