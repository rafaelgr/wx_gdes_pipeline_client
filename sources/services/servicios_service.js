import { devConfig } from "../config/config";
export const serviciosService = {
    getServicios: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/servicios";
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
    getServiciosMulti: (usu) => {
        console.log("Usu", usu);
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/servicios/multi";
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
    getSyncServicios: (usu) => {
        var url = devConfig.getApiUrl() + "/api/servicios/multi";
        if (usu.codigoIdioma && usu.codigoIdioma != "es") {
            url += "/" + usu.codigoIdioma;
        }        
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
    getServicio: (usu, servicioId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/servicios/" + servicioId;
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
    postServicio: (usu, servicio) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/servicios";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, servicio)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });

        });
    },
    putServicio: (usu, servicio) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/servicios";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, servicio)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });
        });
    },
    deleteServicio: (usu, servicioId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/servicios/" + servicioId;
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
    cleanData: (data) => {
        delete data.nombreArea;
        delete data.areas;
        return data;
    }
}