import { JetView } from "webix-jet";
import { usuarioService } from "../services/usuario_service";
import { messageApi } from "../utilities/messages";
import { generalApi } from "../utilities/general";
import { gruposUsuariosService } from "../services/gruposUsuarios_service";

var editButton = "<span class='onEdit webix_icon wxi-pencil'></span>";
var deleteButton = "<span class='onDelete webix_icon wxi-trash'></span>";
var currentIdDatatableView;
var currentRowDatatableView
var semaphore = false;

export default class GruposUsuarios extends JetView {
    config() {
        const translate = this.app.getService("locale")._;
        var toolbarGruposUsuarios = {
            view: "toolbar", padding: 3, elements: [
                { view: "icon", icon: "mdi mdi-account-group", width: 37, align: "left" },
                { view: "label", label: translate("Grupos de usuarios") }
            ]
        }
        var pagerGruposUsuarios = {
            cols: [
                {
                    view: "button", type: "icon", icon: "wxi-plus", width: 37, align: "left", hotkey: "Ctrl+F",
                    tooltip: translate("Nuevo registro en formulario (Ctrl+F)"),
                    click: () => {
                        this.show('/top/gruposUsuariosForm?grupoUsuarioId=0');
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-plus-square", width: 37, align: "left", hotkey: "Ctrl+L",
                    tooltip: translate("Nuevo registro en línea (Ctrl+L)"),
                    click: () => {
                        var newRow = { id: -1, grupoUsuarioId: 0 };
                        $$('gruposUsuariosGrid').editStop();
                        console.log('Before edit 1');
                        var lastId = $$('gruposUsuariosGrid').getLastId() + 1;
                        console.log('Before edit 3');
                        var id = $$("gruposUsuariosGrid").add(newRow);
                        console.log('Before edit 2');
                        $$("gruposUsuariosGrid").edit({
                            row: -1,
                            column: "nombre"
                        });
                        $$("gruposUsuariosGrid").showItem(id);
                        $$("gruposUsuariosGrid").select(id);
                        $$('gruposUsuariosGrid').editRow(id);
                        webix.UIManager.setFocus("gruposUsuariosGrid");
                    }
                },
                {
                    view: "button", type: "icon", icon: "wxi-download", width: 37, align: "right",
                    tooltip: translate("Descargar como Excel"),
                    click: () => {
                        webix.toExcel($$("gruposUsuariosGrid"), {
                            filename: "grupos_usuarios",
                            name: "Grupos",
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
        var datatableGruposUsuarios = {
            view: "datatable",
            id: "gruposUsuariosGrid",
            pager: "mypager",
            select: "row",
            columns: [
                { id: "grupoUsuarioId", adjust: true, header: [translate("ID"), { content: "numberFilter" }], sort: "number" },
                { id: "nombre", fillspace: true, header: [translate("Nombre de grupo"), { content: "textFilter" }], sort: "string", editor: "text" },
                { id: "actions", header: [{ text: translate("Acciones"), css: { "text-align": "center" } }], template: editButton + deleteButton, css: { "text-align": "center" } }
            ],
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
                                gruposUsuariosService.postGrupoUsuario(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {
                                        this.$scope.load(result.grupoUsuarioId);
                                        $$('gruposUsuariosGrid').editStop();
                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    });
                            } else {
                                gruposUsuariosService.putGrupoUsuario(usuarioService.getUsuarioCookie(), data)
                                    .then(result => {

                                    })
                                    .catch(err => {
                                        messageApi.errorMessageAjax(err);
                                    })
                            }
                        }
                    }
                },
            }
        }
        var _view = {
            rows: [
                toolbarGruposUsuarios,
                pagerGruposUsuarios,
                datatableGruposUsuarios
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
            $$('gruposUsuariosGrid').remove(-1);
            return false;
        }, $$('gruposUsuariosGrid'));
        this.load(id);
    }
    load(id) {
        gruposUsuariosService.getGruposUsuarios(usuarioService.getUsuarioCookie())
            .then(data => {
                $$("gruposUsuariosGrid").clearAll();
                $$("gruposUsuariosGrid").parse(generalApi.prepareDataForDataTable("grupoUsuarioId", data));
                if (id) {
                    $$("gruposUsuariosGrid").select(id);
                    $$("gruposUsuariosGrid").showItem(id);
                }
            })
            .catch(err => {
                return messageApi.errorMessageAjax(err);
            });
    }
    edit(id) {
        this.show('/top/gruposUsuariosForm?grupoUsuarioId=' + id);
    }
    delete(id, name) {
        const translate = this.app.getService("locale")._;
        var self = this;
        webix.confirm(translate("¿Seguro que quiere eliminar ") + name + "?", function (action) {
            if (action === true) {
                gruposUsuariosService.deleteGrupoUsuario(usuarioService.getUsuarioCookie(), id)
                .then(result=>{
                    self.load();
                })
                .catch(err=>{
                    messageApi.errorMessageAjax(err);
                });
            }

        });
    }
}