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
            body: {
                view:"scrollview", scroll:"y", body:{
                  template: "<div id='report_viewer'></div>",
                  autoheight:true
                 }
               }     
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
        Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHm56d3996S0JifANskQZ7E3Lj9TBEvx4JS1nCvrtJLEhZp3C7" + 
        "mWTP2kwBeG8PQVOgA65EemvgT+XDvfXz93zHzFtJQXRw7wXHkMMqJzf8SVZeiu9f9cR/iS7knNi4xk7syKA46E2irG" + 
        "EAKKQCXlfMTKVy/E/+Yxp5n46uquZfk6o1YLLZYm8P4Ov2O+hqHGC7qS5NNsEW/tiKFOGimJD9pf/yrBFItjl5CQuV" + 
        "PwUYLGGMdSP5CgGuOrVS/bS8w1a/MMMskrapDbUda0FK74HS8wl7kQgkg/L6MpOL2zeygQQl9Meh1GzzSPo02mJNkQ" + 
        "ULawgWLgv9Ab/0N4zZyXYeNuFXje61t5C4wOL2UbufCp8/PSRxCwwfX1Bnp8S+21w8FO0jlYmuQWFlD4X6QPN7ZOKZ" + 
        "WwlVCYlg1wk0MitFUU2hQGlYd1AQ5KqABgYRoyNSw8XKgCkjvE4XfuAByTEjzbFQ+S+eQg6ZzZIyPocPzrdxlReACj" + 
        "Mucj3qiCG2dSANf+EtT4aaBTQJHvgRxKQAFG";
        options.appearance.scrollbarsMode = true;
        options.appearance.fullScreenMode = true;
        options.toolbar.showSendEmailButton = true;
    }

    obtainReport(ofertaId, type) {
        Stimulsoft.StiOptions.WebServer.encryptData = false;
        StiOptions.WebServer.url = devConfig.getApiUrl() + "/streport";
        var file = "reports/proposal_report.mrt";
        if (type == 1) file = "reports/proposal_report_short.mrt";
        if (type == 3) file = "reports/proposal_report_annex.mrt";
        // Create a new report instance
        var report = new Stimulsoft.Report.StiReport();
        report.loadFile(file);
        let usu = usuarioService.getUsuarioCookie()
        devConfig.getConfigMysql(usu)
        .then(data => {
            var myconfig = data;
            var connectionString = "Server=" + myconfig.host + ";";
            connectionString += "Port=" + myconfig.port + ";"
            connectionString += "Database=" + myconfig.database + ";"
            connectionString += "UserId=" + myconfig.user + ";"
            connectionString += "Pwd=" + myconfig.password + ";";
            report.dictionary.databases.list[0].connectionString = connectionString;
    
            // Parámetros
            report.dictionary.variables.list[0].val = ofertaId;
        
            // Assign report to the viewer, the report will be built automatically after rendering the viewer
            viewer.report = report;
            viewer.renderHtml("report_viewer");
        })
        .catch(err => {
            console.log("ERR: ", err);
        })

    }
}