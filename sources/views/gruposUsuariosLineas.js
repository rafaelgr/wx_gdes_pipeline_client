import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { gruposUsuariosLineasService } from "../services/gruposUsuariosLineas_service";
import GruposUsuariosLineasWindow from './gruposUsuariosLineasWindow';

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var semaphore = false;
var grupoUsuarioId;

var colUsuarios = [];
var usuarioResult = usuarioService.getSyncUsuarios(usuarioService.getUsuarioCookie());
if (usuarioResult.err) {
    messageApi.errorMessageAjax(usuarioResult.err);
} else {
    colUsuarios = generalApi.prepareDataForCombo('usuarioId', 'nombre', usuarioResult.data);
}

export default class GruposUsuariosLineas extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarGruposUsuariosLineas = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-account-group", width: 37, align: "left" },
                { view: "label", label: translate("Usuarios asociados") }
            ]
        }
        var pagerGruposUsuariosLineas = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    tooltip: translate("Nuevo registro en formulario (Ctrl+F)"),
                    click: () => {
                        this.gruposUsuariosLineasWindow.showWindow(grupoUsuarioId);
                    }
                },
                {
                    view: "button", type: "icon", icon: "mdi mdi-refresh", width: 37, align: "left",
                    click: () => {
                        this.cleanAndload();
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    tooltip: translate("Descargar como Excel"),
                    click: () => {
                        webix.toExcel($$("gruposUsuariosLineasGrid"), {
                            filename: "grupos_usuarios",
                            name: "Grupos",
                            rawValues: true,
                            ignore: { "actions": true }
                        });
                    }
                },
                {
                    view: "label", id: "GruposUsuariosLineasNReg", label: "NREG: "
                },
                {
                    view: "pager", id: "mypager", css: { "text-align": "right" },
                    template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()}",
                    size: 25,
                    group: 5
                }
            ]
        };
        var datatableGruposUsuariosLineas = {
            view: "datatable",
            id: "gruposUsuariosLineasGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "grupoUsuarioLineaId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "usuarioId", fillspace: true, header: [translate("Usuario asociado"), { content: "selectFilter" }], sort: "string", editor: "combo", collection: colUsuarios, width: 200 },
                { id: "actions", header: [{ text: translate("Acciones"), css: { "text-align": "center" } }], template: deleteButton, css: { "text-align": "center" } }
            ],
            onClick: {
                "onDelete": function (event, id, node) {
                    var dtable = this;
                    var curRow = this.data.pull[id.row];
                    this.$scope.delete(id.row, curRow.nombre);
                }
            },
            editable: true,
            editaction: "dblclick",
            rules: {
                "nombre": webix.rules.isNotEmpty
            },
            on: {
                "onAfterEditStart": function (id) {
                    currentIdDatatableView = id.row;
                    currentRowDatatableView = this.data.pull[currentIdDatatableView];
                },
                "onAfterEditStop": function (state, editor, ignoreUpdate) {
                    if (state.value != state.old) {
                        semaphore = true;
                        if (!this.validate(currentIdDatatableView)) {
                            messageApi.errorMessage(translate("Valores incorrectos"));
                        } else {
                            currentRowDatatableView = this.data.pull[currentIdDatatableView];
                            // id is not part of the row object
                            delete currentRowDatatableView.id;
                            var data = currentRowDatatableView;
                            if (data.grupoUsuarioId == 0) {
                                gruposUsuariosLineasService.postGrupoUsuario(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {
                                        this.$scope.load(result.grupoUsuarioId);
                                        $$('gruposUsuariosLineasGrid').editStop();
                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                gruposUsuariosLineasService.putGrupoUsuario(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {

                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    })
                            }
                        }
                    }
                },
                "onAfterFilter": function () {
                    var numReg = $$("gruposUsuariosLineasGrid").count();
                    $$("GruposUsuariosLineasNReg").config.label = "NREG: " + numReg;
                    $$("GruposUsuariosLineasNReg").refresh();
                }
            }
        }
        var _view = {
            rows: [
                toolbarGruposUsuariosLineas,
                pagerGruposUsuariosLineas,
                datatableGruposUsuariosLineas
            ]
        }
        return _view;
    }
    init(view, url) {
        usuarioService.checkLoggedUser();
        var id = null;
        if (url[0].params.grupoUsuarioId) {
            id = url[0].params.grupoUsuarioId;
        }
        webix.UIManager.addHotKey("Esc", function () {
            $$('gruposUsuariosLineasGrid').remove(-1);
            return false;
        }, $$('gruposUsuariosLineasGrid'));
        webix.extend($$("gruposUsuariosLineasGrid"), webix.ProgressBar);
        grupoUsuarioId = id;
        this.load(id);
        this.gruposUsuariosLineasWindow = this.ui(GruposUsuariosLineasWindow);
    }
    load(id) {
        $$("gruposUsuariosLineasGrid").showProgress({type:"icon"});
        gruposUsuariosLineasService.getGrupoUsuarioLineasGrupo(usuarioService.getUsuarioCookie(), id)
            .then(data => {
                $$("gruposUsuariosLineasGrid").clearAll();
                $$("gruposUsuariosLineasGrid").parse(generalApi.prepareDataForDataTable("grupoUsuarioLineaId", data));
                var numReg = $$("gruposUsuariosLineasGrid").count();
                $$("GruposUsuariosLineasNReg").config.label = "NREG: " + numReg;
                $$("GruposUsuariosLineasNReg").refresh();
                $$("gruposUsuariosLineasGrid").hideProgress();
            })
            .catch(err => {
                $$("gruposUsuariosLineasGrid").hideProgress();
                return messageApi.errorMessageAjax(err);
            });
    }
    edit(id) {
        this.show('/top/gruposUsuariosLineasForm?grupoUsuarioId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                gruposUsuariosLineasService.deleteGrupoUsuarioLineas(usuarioService.getUsuarioCookie(), id)
                    .then(result => {
                        self.load(grupoUsuarioId);
                    })
                    .catch(err => {
                        messageApi.errorMessageAjax(err);
                    });
            }

        });
    }
    cleanAndload() {
        $$("gruposUsuariosLineasGrid").eachColumn(function (id, col) {
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