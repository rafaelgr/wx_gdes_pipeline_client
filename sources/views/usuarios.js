import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { gruposUsuariosService } from "../services/gruposUsuarios_service";
import { empresasService } from "../services/empresas_service";
import { paisesService } from "../services/paises_service";
import { areasService } from "../services/areas_service";
import { unidadesNegocioService } from "../services/unidadesNegocio_service";
import moment from 'moment';

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var isNewRow = false;
var _usuario = usuarioService.getUsuarioCookie();

//-- Begin area of collections
// We load collections need for combo edit columns in the grid
var colPaises = [];
var paisResult = paisesService.getSyncPaises(usuarioService.getUsuarioCookie());
if (paisResult.err) {
    messageApi.errorMessageAjax(paisResult.err);
} else {
    colPaises = generalApi.prepareDataForCombo('paisId', 'nombre', paisResult.data);
}

var colGruposUsuarios = [];
var gruposUsuariosResult = gruposUsuariosService.getSyncGruposUsuarios(usuarioService.getUsuarioCookie());
if (gruposUsuariosResult.err) {
    messageApi.errorMessageAjax(gruposUsuariosResult.err);
} else {
    colGruposUsuarios = generalApi.prepareDataForCombo('grupoUsuarioId', 'nombre', gruposUsuariosResult.data);
}

var colEmpresas = [];
var empresaResult = empresasService.getSyncEmpresas(usuarioService.getUsuarioCookie());
if (empresaResult.err) {
    messageApi.errorMessageAjax(empresaResult.err);
} else {
    colEmpresas = generalApi.prepareDataForCombo('empresaId', 'nombre', empresaResult.data);
}

var colAreas = [];
var areaResult = areasService.getSyncAreas(usuarioService.getUsuarioCookie());
if (areaResult.err) {
    messageApi.errorMessageAjax(areaResult.err);
} else {
    var nombre = 'nombre';
    if (_usuario.codigoIdioma === 'en') nombre = 'nombreEN';
    if (_usuario.codigoIdioma === 'fr') nombre = 'nombreFR';
    colAreas = generalApi.prepareDataForCombo('areaId', nombre, areaResult.data);
}

var colUnidadesNegocio = [];
var unidadNegocioResult = unidadesNegocioService.getSyncUnidadesNegocio(usuarioService.getUsuarioCookie());
if (unidadNegocioResult.err) {
    messageApi.errorMessageAjax(unidadNegocioResult.err);
} else {
    var nombre = 'nombre';
    if (_usuario.codigoIdioma === 'en') nombre = 'nombreEN';
    if (_usuario.codigoIdioma === 'fr') nombre = 'nombreFR';
    colUnidadesNegocio = generalApi.prepareDataForCombo('unidadNegocioId', nombre, unidadNegocioResult.data);
}

var colResponsables = [];
var responsableResult = usuarioService.getSyncUsuarios(usuarioService.getUsuarioCookie());
if (responsableResult.err) {
    messageApi.errorMessageAjax(responsableResult.err);
} else {
    colResponsables = generalApi.prepareDataForCombo('usuarioId', 'nombre', responsableResult.data);
}
// -- End area of collections

export default class Usuarios extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarUsuarios = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-account", width: 37, align: "left" },
                { view: "label", label: translate("Usuarios") }
            ]
        }
        var pagerUsuarios = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    click: () => {
                        this.show('/top/usuariosForm?usuarioId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "mdi mdi-refresh", width: 37, align: "left", hotkey: "Ctrl+L",
                    click: ()=>{
                        this.cleanAndload();
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    click: () => {
                        webix.toExcel($$("usuariosGrid"), {
                            filename: "usuarios",
                            name: "Usuarios",
                            rawValues: true,
                            ignore: { "actions": true }
                        });
                    }
                },
                {
                    view: "label", id: "UsuariosNReg", label: "NREG: "
                },
                {
                    view: "pager", id: "mypager", css: { "text-align": "right" },
                    template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
                    size: 25,
                    group: 5
                }
            ]
        };
        var datatableUsuarios = {
            view: "datatable",
            id: "usuariosGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "usuarioId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "nombre", fillspace: true, header: [translate("Nombre usuario"), { content: "textFilter" }], sort: "string", editor: "text", minWidth: 200 },
                { id: "codigoIdioma", fillspace: true, header: [translate("Idioma"), { content: "textFilter" }], sort: "string", editor: "text", minWidth: 100 },
                { id: "grupoUsuarioId", header: [translate("Grupo usuarios"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colGruposUsuarios, width: 200 },
                { id: "esAdministrador", fillspace: true, header: [translate("Administrador"), { content: "textFilter" }], template: "{common.checkbox()}", sort: "string", editor: "checkbox", minWidth: 100 },
                { id: "responsableId", header: [translate("Responsable"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colResponsables, width: 200 },
                { id: "paisId", header: [translate("Pais"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colPaises, width: 200 },
                { id: "empresaId", header: [translate("Empresa"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colEmpresas, width: 200 },
                { id: "areaId", header: [translate("Area"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colAreas, width: 200 },
                { id: "unidadNegocioId", header: [translate("Unidad negocio"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUnidadesNegocio, width: 200 },
                { id: "emailAzure", fillspace: true, header: [translate("Correo Azure"), { content: "textFilter" }], sort: "string", editor: "text", minWidth: 200 },
                { id: "ubicacion", fillspace: true, header: [translate("Ubicación"), { content: "textFilter" }], sort: "string", editor: "text", minWidth: 200 },
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
                // "nombre": webix.rules.isNotEmpty,
                // "codigoIdioma": webix.rules.isNotEmpty,
                // "grupoUsuarioId": webix.rules.isNotEmpty,
                // "emailAzure": webix.rules.isNotEmpty
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
                    if ((state.value != state.old) || isNewRow) {
                        isNewRow = false;
                        if (!this.validate(currentIdDatatableView)) {
                            messageApi.errorMessage(translate("Valores incorrectos"));
                        } else {
                            currentRowDatatableView = this.data.pull[currentIdDatatableView];
                            // id is not part of the row object
                            delete currentRowDatatableView.id;
                            delete currentRowDatatableView.grupo; // ??
                            delete currentRowDatatableView.responsable; // ??
                            var data = currentRowDatatableView;
                            delete data.rr2;
                            delete data.grupo;
                            delete data.getKeyTime;
                            delete data.expKeyTime;
                            if (data.usuarioId == 0) {
                                usuarioService.postUsuario(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                        this.$scope.load(result.usuarioId);
                                        $$('usuariosGrid').editStop();
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                usuarioService.putUsuario(usuarioService.getUsuarioCookie(), data)
                                    .then((result) => {
                                    })
                                    .catch((err) => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            }
                        }
                    }
                },
                "onAfterFilter": function () {
                    var numReg = $$("usuariosGrid").count();
                    $$("UsuariosNReg").config.label = "NREG: " + numReg;
                    $$("UsuariosNReg").refresh();
                }
            }
        }
        var _view = {
            rows: [
                toolbarUsuarios,
                pagerUsuarios,
                datatableUsuarios
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.usuarioId) {
            id = url[0].params.usuarioId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('usuariosGrid').remove(-1);
            return false;
        }, $$('usuariosGrid'));
        webix.extend($$("usuariosGrid"), webix.ProgressBar);
        this.load(id);
    }
    load(id) {
        _usuario = usuarioService.getUsuarioCookie();
        usuarioService.getUsuarios(_usuario)
            .then((data) => {
                $$("usuariosGrid").clearAll();
                $$("usuariosGrid").parse(generalApi.prepareDataForDataTable("usuarioId", data));
                if (id) {
                    $$("usuariosGrid").select(id);
                    $$("usuariosGrid").showItem(id);
                }
                var numReg = $$("usuariosGrid").count();
                $$("UsuariosNReg").config.label = "NREG: " + numReg;
                $$("UsuariosNReg").refresh();
                $$("usuariosGrid").hideProgress();
            })
            .catch((err) => {
                $$("usuariosGrid").hideProgress();
                messageApi.errorMessageAjax(err);
            });
    }
    edit(id) {
        this.show('/top/usuariosForm?usuarioId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                usuarioService.deleteUsuario(usuarioService.getUsuarioCookie(), id)
                    .then((result) => {
                        self.load();
                    })
                    .catch((err) => {
                        messageApi.errorMessageAjax(err);
                    })
            }
        });
    }
    cleanAndload() {
        $$("usuariosGrid").eachColumn(function (id, col) {
            if (col.id == 'actions') return;
            var filter = this.getFilter(id);
            if (filter) {
                if (filter.setValue) filter.setValue("")	// suggest-based filters 
                else filter.value = "";					// html-based: select & text
            }
        });
        this.load();
    }
}