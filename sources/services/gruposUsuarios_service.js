import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const gruposUsuariosService = {
    getGruposUsuarios: (usu, done) => {
        var url = devConfig.getApiUrl() + "/api/grupos-usuarios";
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
    getGrupoUsuario: (usu, grupoUsuarioId, done) => {
        var url = devConfig.getApiUrl() + "/api/grupos-usuarios/" + grupoUsuarioId;
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
    postGrupoUsuario: (usu, grupoUsuario, done) => {
        var url = devConfig.getApiUrl() + "/api/grupos-usuarios" ;
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
    putGrupoUsuario: (usu, grupoUsuario, done) => {
        var url = devConfig.getApiUrl() + "/api/grupos-usuarios" ;
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
    deleteGrupoUsuario: (usu, grupoUsuarioId, done) => {
        var url = devConfig.getApiUrl() + "/api/grupos-usuarios/" + grupoUsuarioId;
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