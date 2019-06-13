import { devConfig } from "../config/config";
export const versionesService = {
    getVersionApp: () => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/version";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json"
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

    getVersiones: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/versiones";
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
    getSyncVersiones: (usu) => {
        var url = devConfig.getApiUrl() + "/api/versiones";
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
    getVersion: (usu, versionId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/versiones/" + versionId;
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
    getVersionesOferta: (usu, ofertaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/versiones/oferta/" + ofertaId;
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
    postVersion: (usu, version) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/versiones";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, version)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });

        });
    },
    putVersion: (usu, version) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/versiones";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, version)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });
        });
    },
    deleteVersion: (usu, versionId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/versiones/" + versionId;
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
        return data;
    }
}