import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const unidadesNegocioService = {
    getUnidadesNegocio: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/unidades-negocio";
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
    getSyncUnidadesNegocio: (usu) => {
        var url = devConfig.getApiUrl() + "/api/unidades-negocio";
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
    getUnidadNegocio: (usu, unidadNegocioId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/unidades-negocio/" + unidadNegocioId;
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
    postUnidadNegocio: (usu, unidadNegocio) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/unidades-negocio";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, unidadNegocio)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    putUnidadNegocio: (usu, unidadNegocio) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/unidades-negocio";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, unidadNegocio)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    deleteUnidadNegocio: (usu, unidadNegocioId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/unidades-negocio/" + unidadNegocioId;
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