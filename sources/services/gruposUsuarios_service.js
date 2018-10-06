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
    }
}