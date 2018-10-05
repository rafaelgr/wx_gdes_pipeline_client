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
    // getUsuario
    getUsuarios: (usu, done) => {
        var url = devConfig.getApiUrl() + "/api/usuarios";
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
    // getLoginEmail
    getLoginEmail: (email, done) => {
        var url = devConfig.getApiUrl() + "/login/email";
        webix.ajax()
        .timeout(10000)
        .headers({
            "Content-Type": "application/json"
        })
        .post(url, {usuario: {email: email}})
        .then(function (result) {
            done(null, result.json());
        })
        .catch(function (inXhr) {
            done(inXhr);
        });
    }
}