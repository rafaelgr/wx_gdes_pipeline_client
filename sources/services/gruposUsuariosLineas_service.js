import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const gruposUsuariosLineasService = {
    getGrupoUsuarioLineas: (usu) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios-lineas";
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
        });
    },
    getSyncGrupoUsuarioLineas: (usu) => {
        var url = devConfig.getApiUrl() + "/api/grupos-usuarios-lineas";
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
    getGrupoUsuarioLineas: (usu, grupoUsuarioLineaId) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios-lineas/" + grupoUsuarioLineaId;
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
        });
    },
    getGrupoUsuarioLineasGrupo: (usu, grupoUsuarioId) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios-lineas/grupo/" + grupoUsuarioId;
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
        });
    },    
    postGrupoUsuarioLineas: (usu, grupoUsuarioLinea) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios-lineas" ;
            webix.ajax()
            .timeout(10000)
            .headers({
                "Content-Type": "application/json",
                "x-apiKey": usu.apiKey
            })
            .post(url, grupoUsuarioLinea)
            .then(function (result) {
                success(result.json());
            })
            .catch(function (inXhr) {
                fail(inXhr);
            });
        });
    },
    putGrupoUsuarioLineas: (usu, grupoUsuarioLinea) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios-lineas" ;
            webix.ajax()
            .timeout(10000)
            .headers({
                "Content-Type": "application/json",
                "x-apiKey": usu.apiKey
            })
            .put(url, grupoUsuarioLinea)
            .then(function (result) {
                success(result.json());
            })
            .catch(function (inXhr) {
                fail(inXhr);
            });
        });

    },
    deleteGrupoUsuarioLineas: (usu, grupoUsuarioLineaId) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios-lineas/" + grupoUsuarioLineaId;
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