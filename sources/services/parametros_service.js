import { devConfig } from "../config/config";
export const parametrosService = {
    getParametros: (usu) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/parametros/0";
            webix.ajax()
            .timeout(10000)
            .headers({
                "Content-Type": "application/json",
                "x-apiKey": usu.apiKey
            })
            .get(url)
            .then(function (result) {
                success(result.json());
            })
            .catch(function (inXhr) {
                fail(inXhr);
            });
        });
    },
    putParametros: (usu, data) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/parametros";
            webix.ajax()
            .timeout(10000)
            .headers({
                "Content-Type": "application/json",
                "x-apiKey": usu.apiKey
            })
            .put(url, data)
            .then(function (result) {
                success(result.json());
            })
            .catch(function (inXhr) {
                fail(inXhr);
            });
        });
    }
}