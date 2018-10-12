import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const gruposUsuariosService = {
    getGruposUsuarios: (usu) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios";
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
    getSyncGruposUsuarios: (usu) => {
        var url = devConfig.getApiUrl() + "/api/grupos-usuarios";
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
    getGrupoUsuario: (usu, grupoUsuarioId) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios/" + grupoUsuarioId;
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
    postGrupoUsuario: (usu, grupoUsuario) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios" ;
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
    putGrupoUsuario: (usu, grupoUsuario) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios" ;
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
    deleteGrupoUsuario: (usu, grupoUsuarioId) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/grupos-usuarios/" + grupoUsuarioId;
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