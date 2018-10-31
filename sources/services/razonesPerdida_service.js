import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const razonesPerdidaService = {
    getRazonesPerdida: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/razon-perdida";
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
                })
        })
    },
    getSyncRazonesPerdida: (usu) => {
        var url = devConfig.getApiUrl() + "/api/razon-perdida";
        var res = webix.ajax()
            .headers({
                "Content-Type": "application/json",
                "x-apiKey": usu.apiKey
            })
            .sync()
            .get(url);
        var result = { data: null, err: null };
        if (res.status != 200) {
            result.err = res;
        } else {
            result.data = JSON.parse(res.response);
        }
        return result;
    },
    getRazonPerdida: (usu, razonPerdidaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/razon-perdida/" + razonPerdidaId;
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
                })
        });
        ;
    },
    postRazonPerdida: (usu, razonPerdida) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/razon-perdida";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, razonPerdida)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    putRazonPerdida: (usu, razonPerdida) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/razon-perdida";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, razonPerdida)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    deleteRazonPerdida: (usu, razonPerdidaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/razon-perdida/" + razonPerdidaId;
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .del(url)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });
        });
    }
}