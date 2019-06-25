import { devConfig } from "../config/config";
export const areasService = {
    getPprConfig: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/pwbi/config";
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
    }
}