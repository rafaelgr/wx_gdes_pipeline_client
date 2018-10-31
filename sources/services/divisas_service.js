import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const divisasService = {
    getDivisas: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/divisas";
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
    getSyncDivisas: (usu) => {
        var url = devConfig.getApiUrl() + "/api/divisas";
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
    getDivisa: (usu, divisaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/divisas/" + divisaId;
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
    postDivisa: (usu, divisa) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/divisas";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, divisa)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    putDivisa: (usu, divisa) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/divisas";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, divisa)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    deleteDivisa: (usu, divisaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/divisas/" + divisaId;
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