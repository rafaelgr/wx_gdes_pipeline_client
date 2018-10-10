import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const paisesService = {
    getPaises: (usu, done) => {
        var url = devConfig.getApiUrl() + "/api/paises";
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
    getPais: (usu, paisId, done) => {
        var url = devConfig.getApiUrl() + "/api/paises/" + paisId;
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
    postPais: (usu, grupoUsuario, done) => {
        var url = devConfig.getApiUrl() + "/api/paises" ;
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
    putPais: (usu, grupoUsuario, done) => {
        var url = devConfig.getApiUrl() + "/api/paises" ;
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
    deletePais: (usu, paisId, done) => {
        var url = devConfig.getApiUrl() + "/api/paises/" + paisId;
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