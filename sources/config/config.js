export const devConfig = {
    getApiUrl: () => {
        var urlApi = "";
        if (!PRODUCTION) urlApi = "http://localhost:8060";
        return urlApi;
    },
    getConfigMysql: (usu) => {
        return new webix.promise((success, fail) => {
            if (!PRODUCTION) {
                var data = {
                    host: "localhost",
                    port: "3306",
                    database: "gdes_pipeline_test",
                    user: "root",
                    password: "aritel"
                };
                success(data);
            } else {
                webix.ajax()
                .timeout(10000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .get("/pwbi/config")
                .then((result) => {
                    success(result.json());
                })
                .catch((inXhr) => {
                    fail(inXhr);
                });
            }
        });
    }

}

