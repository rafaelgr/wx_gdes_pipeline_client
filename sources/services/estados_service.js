import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const estadosService = {
    getEstados: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/estados";
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
    getSyncEstados: (usu) => {
        var url = devConfig.getApiUrl() + "/api/estados";
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
    getEstado: (usu, estadoId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/estados/" + estadoId;
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
    postEstado: (usu, estado) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/estados";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, estado)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    putEstado: (usu, estado) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/estados";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, estado)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    deleteEstado: (usu, estadoId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/estados/" + estadoId;
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