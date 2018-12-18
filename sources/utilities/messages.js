import { devConfig } from "../config/config";

export const messageApi = {
    errorMessageAjax: (inXhr) => {
        var msg = "Error desconocido";
        if (!inXhr.response){
            // no es un error Ajax
            msg = inXhr;
        } else {
            msg = inXhr.response;
        }
        webix.alert({
            type: "alert-error",
            title: "ERROR",
            text: msg
        });
        if (inXhr.status == 401) {
            var authUrl = devConfig.getApiUrl() + "/auth/openid";
            window.open(authUrl, '_self');
        }
    },
    errorMessage: (msg) => {
        webix.alert({
            type: "alert-error",
            title: "ERROR",
            text: msg
        });
    },
    normalMessage: (msg) => {
        webix.alert({
            title: "INFORMATION",
            text: msg
        });
    }

}