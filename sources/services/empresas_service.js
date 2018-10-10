import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const empresasService = {
    getEmpresas: (usu, done) => {
        var url = devConfig.getApiUrl() + "/api/empresas";
        webix.ajax()
            .timeout(10000)
            .headers({
                "Content-Type": "application/json",
                "x-apiKey": usu.apiKey
            })
            .get(url)
            .then(function (result) {
                done(null, result.json());
            })
            .catch(function (inXhr) {
                done(inXhr);
            });
    },
    getRxEmpresas: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/empresas";
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
    getEmpresa: (usu, empresaId, done) => {
        var url = devConfig.getApiUrl() + "/api/empresas/" + empresaId;
        webix.ajax()
            .timeout(10000)
            .headers({
                "Content-Type": "application/json",
                "x-apiKey": usu.apiKey
            })
            .get(url)
            .then(function (result) {
                done(null, result.json());
            })
            .catch(function (inXhr) {
                done(inXhr);
            });
    },
    postEmpresa: (usu, grupoUsuario, done) => {
        var url = devConfig.getApiUrl() + "/api/empresas";
        webix.ajax()
            .timeout(10000)
            .headers({
                "Content-Type": "application/json",
                "x-apiKey": usu.apiKey
            })
            .post(url, grupoUsuario)
            .then(function (result) {
                done(null, result.json());
            })
            .catch(function (inXhr) {
                done(inXhr);
            });
    },
    putEmpresa: (usu, grupoUsuario, done) => {
        var url = devConfig.getApiUrl() + "/api/empresas";
        webix.ajax()
            .timeout(10000)
            .headers({
                "Content-Type": "application/json",
                "x-apiKey": usu.apiKey
            })
            .put(url, grupoUsuario)
            .then(function (result) {
                done(null, result.json());
            })
            .catch(function (inXhr) {
                done(inXhr);
            });
    },
    deleteEmpresa: (usu, empresaId, done) => {
        var url = devConfig.getApiUrl() + "/api/empresas/" + empresaId;
        webix.ajax()
            .timeout(10000)
            .headers({
                "Content-Type": "application/json",
                "x-apiKey": usu.apiKey
            })
            .del(url)
            .then(function (result) {
                done(null, result.json());
            })
            .catch(function (inXhr) {
                done(inXhr);
            });
    }
}