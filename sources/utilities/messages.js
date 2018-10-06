export const messageApi = {
    errorMessageAjax: (inXhr) => {
        var msg = inXhr.response;
        webix.alert({
            type: "alert-error",
            title: "ERROR",
            text: msg
        });
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