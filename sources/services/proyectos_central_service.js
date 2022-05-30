import { devConfig } from "../config/config";
export const proyectosCentralService = {
    getProyectosCentral: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/proyectos_central";
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
    getSyncProyectosCentral: (usu) => {
        var url = devConfig.getApiUrl() + "/api/proyectos_central";
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
    getProyectoCentral: (usu, codigo) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/proyectos_central/" + codigo;
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
    postProyectoCentral: (usu, grupoUsuario) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/proyectos_central";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, grupoUsuario)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });

        });
    },
    putProyectoCentral: (usu, grupoUsuario) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/proyectos_central";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, grupoUsuario)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });
        });
    },
    deleteProyectoCentral: (usu, codigo) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/proyectos_central/" + codigo;
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