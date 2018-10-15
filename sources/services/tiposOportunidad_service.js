import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const tiposOportunidadService = {
    getTiposOportunidad: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/tipos-oportunidad";
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
    getSyncTiposOportunidad: (usu) => {
        var url = devConfig.getApiUrl() + "/api/tipos-oportunidad";
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
    getTipoOportunidad: (usu, tipoOportunidadId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/tipos-oportunidad/" + tipoOportunidadId;
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
    postTipoOportunidad: (usu, tipoOportunidad) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/tipos-oportunidad";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, tipoOportunidad)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    putTipoOportunidad: (usu, tipoOportunidad) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/tipos-oportunidad";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, tipoOportunidad)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    deleteTipoOportunidad: (usu, tipoOportunidadId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/tipos-oportunidad/" + tipoOportunidadId;
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