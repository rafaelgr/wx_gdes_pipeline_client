import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const fasesOfertaService = {
    getFasesOferta: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/fases-oferta";
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
    getSyncFasesOferta: (usu) => {
        var url = devConfig.getApiUrl() + "/api/fases-oferta";
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
    getFaseOferta: (usu, faseOfertaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/fases-oferta/" + faseOfertaId;
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
    postFaseOferta: (usu, faseOferta) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/fases-oferta";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, faseOferta)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    putFaseOferta: (usu, faseOferta) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/fases-oferta";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, faseOferta)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    deleteFaseOferta: (usu, faseOfertaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/fases-oferta/" + faseOfertaId;
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