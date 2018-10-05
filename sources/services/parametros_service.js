import { devConfig } from "../config/config";
export const parametrosService = {
    getParametros: (usu, done) => {
        var url = devConfig.getApiUrl() + "/api/parametros/0";
        webix.ajax()
        .timeout(10000)
        .headers({
            "Content-Type": "application/json",
            "x-apiKey": usu.apiKey
        })
        .get(url)
        .then(function (result) {
            done(null, result.json());
        })
        .catch(function (inXhr) {
            done(inXhr);
        });
    },
    putParametros: (usu, data, done) => {
        var url = devConfig.getApiUrl() + "/api/parametros";
        webix.ajax()
        .timeout(10000)
        .headers({
            "Content-Type": "application/json",
            "x-apiKey": usu.apiKey
        })
        .put(url, data)
        .then(function (result) {
            done(null, result.json());
        })
        .catch(function (inXhr) {
            done(inXhr);
        });
    }
}