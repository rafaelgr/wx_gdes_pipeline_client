import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { ofertasService } from "../services/ofertas_service";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";
import { empresasService } from "../services/empresas_service";
import { paisesService } from "../services/paises_service";
import { fasesOfertaService } from "../services/fasesOferta_service";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;
var colUnidadesNegocio = [];
var unidadNegocioResult = unidadesNegocioService.getSyncUnidadesNegocio(usuarioService.getUsuarioCookie());
if (unidadNegocioResult.err) {
    messageApi.errorMessageAjax(unidadNegocioResult.err);
} else {
    colUnidadesNegocio = generalApi.prepareDataForCombo('unidadNegocioId', 'nombre', unidadNegocioResult.data);
}

var colEmpresas = [];
var empresaResult = empresasService.getSyncEmpresas(usuarioService.getUsuarioCookie());
if (empresaResult.err) {
    messageApi.errorMessageAjax(empresaResult.err);
} else {
    colEmpresas = generalApi.prepareDataForCombo('empresaId', 'nombre', empresaResult.data);
}


var colPaises = [];
var paisResult = paisesService.getSyncPaises(usuarioService.getUsuarioCookie());
if (paisResult.err) {
    messageApi.errorMessageAjax(paisResult.err);
} else {
    colPaises = generalApi.prepareDataForCombo('paisId', 'nombre', paisResult.data);
}

var colFasesOferta = [];
var faseOfertaResult = fasesOfertaService.getSyncFasesOferta(usuarioService.getUsuarioCookie());
if (faseOfertaResult.err) {
    messageApi.errorMessageAjax(faseOfertaResult.err);
} else {
    colFasesOferta = generalApi.prepareDataForCombo('faseOfertaId', 'nombre', faseOfertaResult.data);
}


export default class Ofertas extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarOfertas = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-arrow-decision-outline", width: 37, align: "left" },
                { view: "label", label: translate("Ofertas") }
            ]
        }
        var pagerOfertas = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/ofertasForm?ofertaId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-plus-square", width: 37, align: "left", hotkey: "Ctrl+L",
                    click: () => {
                        var newRow = { id: -1, ofertaId: 0 };
                        $$('ofertasGrid').editStop();
                        var id = $$("ofertasGrid").add(newRow);
                        $$("ofertasGrid").showItem(id);
                        $$("ofertasGrid").edit({
                            row: -1,
                            column: "nombre"
                        });
                        isNewRow = true;
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    click: () => {
                        webix.toExcel($$("ofertasGrid"), {
                            filename: "ofertas",
                            name: "Ofertas",
                            rawValues: true,
                            ignore: { "actions": true }
                        });
                    }
                },
                {},
                {
                    view: "pager", id: "mypager", css: { "text-align": "right" },
                    template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
                    size: 25,
                    group: 5
                }
            ]
        };
        var datatableOfertas = {
            view: "datatable",
            id: "ofertasGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "ofertaId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "numeroOferta", header: [translate("Nr. Oferta"), { content: "textFilter" }], sort: "string", editor: "text", minWidth: 100 },
                { id: "empresaId", header: [translate("Empresa"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colEmpresas, width: 200 },
                { id: "paisId", header: [translate("Pais"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colPaises, width: 200 },
                { id: "faseOfertaId", header: [translate("Fase oferta"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colFasesOferta, width: 200 },
                { id: "cod", header: [translate("Código"), { content: "textFilter" }], sort: "string", editor: "text" },
                { id: "orden", header: [translate("Orden"), { content: "numberFilter" }], sort: "string", editor: "text" },
                { id: "nombreEN", header: [translate("Nombre Inglés"), { content: "textFilter" }], sort: "string", editor: "text", width: 250 },
                { id: "nombreFR", header: [translate("Nombre Francés"), { content: "textFilter" }], sort: "string", editor: "text", width: 250 },
                { id: "unidadNegocioId", header: [translate("Unidad de negocio"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUnidadesNegocio, width: 200 },
                { id: "actions", header: [{ text: translate("Acciones"), css: { "text-align": "center" } }], template: editButton + deleteButton, css: { "text-align": "center" } }
            ],
            rightSplit:1,
            onClick: {
                "onDelete": function (event, id, node) {
                    var dtable = this;
                    var curRow = this.data.pull[id.row];
                    var name = curRow.nombre;
                    this.$scope.delete(id.row, name);
                },
                "onEdit": function (event, id, node) {
                    this.$scope.edit(id.row);
                }
            },
            editable: true,
            editaction: "dblclick",
            rules: {
                "nombre": webix.rules.isNotEmpty,
                "cod": webix.rules.isNotEmpty,
                "nombreEN": webix.rules.isNotEmpty,
                "nombreFR": webix.rules.isNotEmpty,
                "unidadNegocioId": webix.rules.isNotEmpty
            },
            on: {
                "onAfterEditStart": function (id) {
                    currentIdDatatableView = id.row;
                    currentRowDatatableView = this.data.pull[currentIdDatatableView];
                },
                "onAfterEditStop": function (state, editor, ignoreUpdate) {
                    var cIndex = this.getColumnIndex(editor.column);
                    var length = this.config.columns.length;
                    if (isNewRow && cIndex != length - 2) return false;
                    if (state.value != state.old) {
                        isNewRow = false;
                        if (!this.validate(currentIdDatatableView)) {
                            messageApi.errorMessage(translate("Valores incorrectos"));
                        } else {
                            currentRowDatatableView = this.data.pull[currentIdDatatableView];
                            // id is not part of the row object
                            delete currentRowDatatableView.id;
                            var data = currentRowDatatableView;
                            data = ofertasService.checkFormValues(data);
                            if (data.ofertaId == 0) {
                                ofertasService.postOferta(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                        this.$scope.load(result.ofertaId);
                                        $$('ofertasGrid').editStop();
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                ofertasService.putOferta(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            }
                        }
                    }
                },
            }
        }
        var _view = {
            rows: [
                toolbarOfertas,
                pagerOfertas,
                datatableOfertas
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.ofertaId) {
            id = url[0].params.ofertaId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('ofertasGrid').remove(-1);
            return false;
        }, $$('ofertasGrid'));
        this.load(id);
    }
    load(id) {
        ofertasService.getOfertas(usuarioService.getUsuarioCookie())
            .then((data) => {
                $$("ofertasGrid").clearAll();
                $$("ofertasGrid").parse(generalApi.prepareDataForDataTable("ofertaId", data));
                if (id) {
                    $$("ofertasGrid").select(id);
                    $$("ofertasGrid").showItem(id);
                }
            })
            .catch((err) => {
                messageApi.errorMessageAjax(err);
            });
    }
    edit(id) {
        this.show('/top/ofertasForm?ofertaId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                ofertasService.deleteOferta(usuarioService.getUsuarioCookie(), id)
                    .then((result) => {
                        self.load();
                    })
                    .catch((err) => {
                        messageApi.errorMessageAjax(err);
                    })
            }

        });
    }
}