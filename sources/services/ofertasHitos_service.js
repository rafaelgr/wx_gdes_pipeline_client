import { devConfig } from "../config/config";
export const ofertasHitosService = {
    getOfertasHitos: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas-hitos";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .get(url)
                .then((result) => {
                    success(result.json());
                })
                .catch((inXhr) => {
                    fail(inXhr);
                });
        });
    },
    getOfertasHitosOferta: (usu, ofertaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas-hitos/oferta/" + ofertaId;
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .get(url)
                .then((result) => {
                    success(result.json());
                })
                .catch((inXhr) => {
                    fail(inXhr);
                });
        });
    },
    getSyncOfertasHitos: (usu) => {
        var url = devConfig.getApiUrl() + "/api/ofertas-hitos";
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
    getOfertaHito: (usu, ofertaHitoId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas-hitos/" + ofertaHitoId;
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
        })

    },
    postOfertaHito: (usu, ofertaHito) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas-hitos";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, ofertaHito)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });

        });
    },
    putOfertaHito: (usu, ofertaHito) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas-hitos";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, ofertaHito)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });
        });
    },
    deleteOfertaHito: (usu, ofertaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas-hitos/" + ofertaId;
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
    },
    checkFormValues: (data) => {
        if (data.orden == "") data.orden = null;
        return data;
    },
    prepareData: (data) => {
        data.forEach( d => {
            d.fecha = new Date(d.fecha);
        });
        return data;
    }
}