import { devConfig } from "../config/config";
export const seguidoresService = {
    getSeguidores: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/seguidores";
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
    getSeguidoresOferta: (usu, ofertaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/seguidores/ofertas/" + ofertaId;
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
    getSyncSeguidores: (usu) => {
        var url = devConfig.getApiUrl() + "/api/seguidores";
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
    getSeguidor: (usu, seguidorId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/seguidores/" + seguidorId;
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
    postSeguidor: (usu, ofertaHito) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/seguidores";
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
    putSeguidor: (usu, ofertaHito) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/seguidores";
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
    deleteSeguidor: (usu, ofertaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/seguidores/" + ofertaId;
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