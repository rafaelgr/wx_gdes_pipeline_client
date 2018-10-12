import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const usuarioService = {
    // getUsuarioCookie
    // Obtains usuario infor information from its cookie if there isn't
    // an usuario cookie returns null
    getUsuarioCookie: () => {
        var usuario = cookieApi.getCookie('gdes_pipeline_usuario');
        if (!usuario) return null;
        return JSON.parse(usuario);
    },
    // setUsuarioCookie
    // Saves usuario's information in a cookie
    setUsuarioCookie: (usuario) => {
        cookieApi.setCookie('gdes_pipeline_usuario', JSON.stringify(usuario), 1);
    },
    deleteUsuarioCookie: (usuario) => {
        cookieApi.deleteCookie('gdes_pipeline_usuario');
    },
    checkLoggedUser: () => {
        // Auth url
        var authUrl = devConfig.getApiUrl() + "/auth/openid"
        // Verify if exists a user cookie
        var usu = usuarioService.getUsuarioCookie();
        if (!usu) {
            window.open(authUrl, '_self');
            return false;
        }
        return usu;
    },
    // getUsuario
    getUsuarios: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/usuarios";
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
    // getLoginEmail
    getLoginEmail: (email) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/login/email";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json"
                })
                .post(url, { usuario: { email: email } })
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });
        });
    },
    getSyncUsuarios: (usu) => {
        var url = devConfig.getApiUrl() + "/api/usuarios";
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
    getUsuario: (usu, usuarioId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/usuarios/" + usuarioId;
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
                })
        });
        ;
    },
    postUsuario: (usu, usuario) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/usuarios";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, usuario)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });
    },
    putUsuario: (usu, usuario) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/usuarios";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, usuario)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                })
        });

    },
    deleteUsuario: (usu, usuarioId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/usuarios/" + usuarioId;
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