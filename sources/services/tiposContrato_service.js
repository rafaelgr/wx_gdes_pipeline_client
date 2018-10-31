import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const tiposContratoService = {
    getTiposContrato: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/tipos-contrato";
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
    getSyncTiposContrato: (usu) => {
        var url = devConfig.getApiUrl() + "/api/tipos-contrato";
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
    getTipoContrato: (usu, tipoContratoId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/tipos-contrato/" + tipoContratoId;
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
    postTipoContrato: (usu, tipoContrato) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/tipos-contrato";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, tipoContrato)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    putTipoContrato: (usu, tipoContrato) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/tipos-contrato";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, tipoContrato)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    deleteTipoContrato: (usu, tipoContratoId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/tipos-contrato/" + tipoContratoId;
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