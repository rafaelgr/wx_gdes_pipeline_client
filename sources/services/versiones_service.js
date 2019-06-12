import { devConfig } from "../config/config";
export const versionesService = {
    getVersion: () => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/version";
            webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json"
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