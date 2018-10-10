import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const empresasService = {
    getEmpresas: (usu) => {
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
    getEmpresa: (usu, empresaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/empresas/" + empresaId;
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
    postEmpresa: (usu, grupoUsuario) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/empresas";
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
    putEmpresa: (usu, grupoUsuario) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/empresas";
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
    deleteEmpresa: (usu, empresaId) => {
        return new webix.promise((success, fail)=>{
            var url = devConfig.getApiUrl() + "/api/empresas/" + empresaId;
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