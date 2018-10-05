export const devConfig = {
    getApiUrl: () => {
        var urlApi = "";
        if (!PRODUCTION) urlApi = "http://localhost:8060";
        return urlApi;
    }
}

