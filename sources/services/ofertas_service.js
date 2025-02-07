import { devConfig } from "../config/config";
import moment from 'moment';
export const ofertasService = {
    getOfertas: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas";
            webix.ajax()
                .timeout(50000)
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
    getOfertasUsuario: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas/usuario/" + usu.usuarioId + 
            "/" + usu.grupoUsuarioId + "/" + usu.grupoUsuarioId2 + "/" + usu.grupoUsuarioId3 +
            "/" + usu.grupoUsuarioId4 + "/" + usu.grupoUsuarioId5 + "/" + usu.grupoUsuarioId6 +
            "/" + usu.grupoUsuarioId7;
            webix.ajax()
                .timeout(50000)
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
    getOfertasSeguidores: (usu) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas/seguidores/" + usu.responsableId + "/" + usu.usuarioId;
            webix.ajax()
                .timeout(50000)
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
    getSyncOfertas: (usu) => {
        var url = devConfig.getApiUrl() + "/api/ofertas";
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
    getOferta: (usu, ofertaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas/" + ofertaId;
            webix.ajax()
                .timeout(50000)
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
    postOferta: (usu, oferta) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas";
            webix.ajax()
                .timeout(50000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .post(url, oferta)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });

        });
    },
    putOferta: (usu, oferta) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas";
            webix.ajax()
                .timeout(50000)
                .headers({
                    "Content-Type": "application/json",
                    "x-apiKey": usu.apiKey
                })
                .put(url, oferta)
                .then(function (result) {
                    success(result.json());
                })
                .catch(function (inXhr) {
                    fail(inXhr);
                });
        });
    },
    deleteOferta: (usu, ofertaId) => {
        return new webix.promise((success, fail) => {
            var url = devConfig.getApiUrl() + "/api/ofertas/" + ofertaId;
            webix.ajax()
                .timeout(50000)
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
    },
    checkFormValues: (data) => {
        if (data.orden == "") data.orden = null;
        return data;
    },
    cleanData: (data) => {
        delete data.nomArea;
        delete data.nomUnidadNegocio;
        delete data.nomEmpresa;
        delete data.pais;
        delete data.faseOferta;
        delete data.tipoOportunidad;
        delete data.tipoContrato;
        delete data.estado;
        delete data.razonPerdida;
        delete data.divisa;
        delete data.servicio;
        delete data.responsable;
        Object.keys(data).forEach((k) => {
            if (data[k] == "") data[k] = null;
        });
        return data;
    },
    corregirFechas: (data) => {
        console.log("Fechas:", data.fechaInicioContrato, data.fechaFinContrato, data.fechaAdjudicacion, data.fechaOferta);
        if (data.fechaInicioContrato) data.fechaInicioContrato = moment(data.fechaInicioContrato).format('YYYY-MM-DD');
        if (data.fechaFinContrato) data.fechaFinContrato = moment(data.fechaFinContrato).format('YYYY-MM-DD');
        if (data.fechaAdjudicacion) data.fechaAdjudicacion = moment(data.fechaAdjudicacion).format('YYYY-MM-DD');
        if (data.fechaOferta) data.fechaOferta = moment(data.fechaOferta).format('YYYY-MM-DD');
        if (data.fechaUltimoEstado) data.fechaUltimoEstado = moment(data.fechaUltimoEstado).format('YYYY-MM-DD');
        if (data.fechaDivisa) data.fechaDivisa = moment(data.fechaDivisa).format('YYYY-MM-DD');
        if (data.fechaCreacion) data.fechaCreacion = moment(data.fechaCreacion).format('YYYY-MM-DD');
        return data;
    }
}