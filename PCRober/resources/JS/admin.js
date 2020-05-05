
// js para test html y amigos html

var $table = $('#table_admin');
var $table_amigos = $('#table_amigos');
var $remove = $('#remove');
var selections = [];
var tab_public_control = 'tab_aeropuertos';

// <-------------------------- load paginas ------------------------------>
$(document).ready(async function () {
    var path = window.location.pathname;
    var page = path.split("/").pop();

    await getUsuario();

    switch (page) {
        case 'admin.html':
            manage_tab_table(tabs_pagina[0]); // cargamos sobre primer tab
            break;
        case 'amigos.html':
            load_amigos_table();
            break;
        case 'publi.html':
            load_data_publi();
            break;
    }
});

// <----------------------------------------------->
// <--------------- ADMINISTRACION ---------------->
// <----------------------------------------------->


var tabs_pagina = ['tab_aeropuertos', 'tab_likes', 'tab_posts', 'tab_publicidad'
    , 'tab_usuarios', 'tab_vuelos', 'tab_vuelospersonas'];

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id
    })
}

function responseHandler(res) {
    $.each(res.rows, function (i, row) {
        row.state = $.inArray(row.id, selections) !== -1
    })
    return res
}

function detailFormatter(index, row) {
    var html = []
    $.each(row, function (key, value) {
        html.push('<p><b>' + key + ':</b> ' + value + '</p>')
    })
    return html.join('')
}

function operateFormatter(value, row, index) {
    return [
        '<a class="like" href="javascript:void(0)" title="Like">',
        '<i class="fa fa-heart"></i>',
        '</a>  ',

        '<a class"eye" href="javascript:void(0)" title="View">',
        '<i class="fas fa-eye" style="color:black; margin-right:10px;"></i>',
        '</a>  ',

        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="fa fa-trash"></i>',
        '</a>'

    ].join('')
}

window.operateEvents = {
    'click .like': function (e, value, row, index) {
        alert('You click like action, row: ' + JSON.stringify(row))
    },
    'click .remove': function (e, value, row, index) {

        // nombre de la tabla
        var table_name = get_tablabd_tab(tab_public_control);

        var confirmacion = confirm("¿Desea eliminar este registro?");

        if(confirmacion == true){
            $table.bootstrapTable('remove', {
                field: 'key',
                values: [row.key]
            });
            // borramos en bd
            if (bbdd_delete(table_name, row.key) == true) {
                manage_tab_table(tab_public_control);
            }
        }
    }
}

function totalTextFormatter(data) {
    return 'Total'
}

function totalNameFormatter(data) {
    return data.length
}

function totalPriceFormatter(data) {
    var field = this.field
    return '$' + data.map(function (row) {
        return +row[field].substring(1)
    }).reduce(function (sum, i) {
        return sum + i
    }, 0)
}


// nos da la tabla de bbdd según el nombre del tab
function get_tablabd_tab(tab_control) {
    var nombre_tabla = "";
    switch (tab_control) {
        case 'tab_aeropuertos':
            nombre_tabla = "aeropuerto";
            break;
        case 'tab_likes':
            nombre_tabla = "likes";
            break;
        case 'tab_posts':
            nombre_tabla = "posts";
            break;
        case 'tab_aeropuertos':
            nombre_tabla = "aeropuerto";
            break;
        case 'tab_publicidad':
            nombre_tabla = "publicidad";
            break;
        case 'tab_usuarios':
            nombre_tabla = "users";
            break;
        case 'tab_vuelos':
            nombre_tabla = "vuelo";
            break;
        case 'tab_vuelospersonas':
            nombre_tabla = "vuelo_personas";
            break;
        default:
            alert("Opción de nombre para tab_control no definida");
    }
    return nombre_tabla;
}


var tabs_pagina = ['tab_aeropuertos', 'tab_likes', 'tab_posts', 'tab_publicidad'
    , 'tab_usuarios', 'tab_vuelos', 'tab_vuelospersonas'];

// <-------------------------- evento on change tab ------------------------------>
$('a[data-toggle="tab"]').on('shown.bs.tab', async function (e) {
    var target = $(e.target).attr("id"); // activated tab

    tab_public_control = target; // para el control del tab activo

    await manage_tab_table(target);

});
// <-------------------------- carga datos tablas según tab ------------------------------>
async function manage_tab_table(tab_target) {
    // restablecemos a formato inactivo
    for (i = 0; i < tabs_pagina.length; i++) {
        document.getElementById(tabs_pagina[i]).setAttribute("class", "nav-link");
        document.getElementById(tabs_pagina[i]).style.fontWeight = "normal";
    }

    // marcamos el tab activo con el valor id de tab_target
    document.getElementById(tab_target).setAttribute("class", "nav-link active");
    document.getElementById(tab_target).style.fontWeight = "bold";

    // configuración columnas tabla
    var config_cols = tab_table_config_cols(tab_target);

    // configuración datos a mostrar tabla
    var mydataSet = await tab_table_config_data(tab_target);

    // seteamos en la tabla
    $table.bootstrapTable('destroy').bootstrapTable({//   height: 500,
        data: mydataSet,
        pagination: true,
        search: true,
        columns: config_cols
    })
    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            $remove.prop('disabled', !$table.bootstrapTable('getSelections').length)

            // save your data, here just save the current page
            selections = getIdSelections()
            // push or splice the selections if you want to save all data selections
        })
    $table.on('all.bs.table', function (e, name, args) {
        console.log(name, args)
    })
    $remove.click(function () {
        var ids = getIdSelections()
        $table.bootstrapTable('remove', {
            field: 'key',
            values: ids
        })
        $remove.prop('disabled', true)
    })
}

// <--------------- configuración de columnas por tabla ---------------->
function tab_table_config_cols(tab_control) {
    var config_cols = null;
    switch (tab_control) {
        // aeropuertos
        case 'tab_aeropuertos':
            config_cols = [
                [{
                    field: 'state',
                    checkbox: true,
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: 'Item ID',
                    field: 'key',
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    footerFormatter: totalTextFormatter
                }, {
                    title: 'Item Detail',
                    colspan: 4,
                    align: 'center'
                }],
                [{
                    field: 'nombre',
                    title: 'Nombre',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'ciudad',
                    title: 'Ciudad',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'isVuelo',
                    title: '¿Es vuelo?',
                    checkbox: true,
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'operate',
                    title: 'Item Operate',
                    align: 'center',
                    clickToSelect: false,
                    events: window.operateEvents,
                    formatter: operateFormatter
                }]
            ];
            break;

        // likes
        case 'tab_likes':
            config_cols = [
                [{
                    field: 'state',
                    checkbox: true,
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: 'Item ID',
                    field: 'key',
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    footerFormatter: totalTextFormatter
                }, {
                    title: 'Item Detail',
                    colspan: 4,
                    align: 'center'
                }],
                [{
                    field: 'fecha_like',
                    title: 'Fecha Alta',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'id_post',
                    title: 'ID Post',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'id_usuario',
                    title: 'ID Usuario',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'operate',
                    title: 'Item Operate',
                    align: 'center',
                    clickToSelect: false,
                    events: window.operateEvents,
                    formatter: operateFormatter
                }]
            ];
            break;
        // posts
        case 'tab_posts':
            config_cols = [
                [{
                    field: 'state',
                    checkbox: true,
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: 'Item ID',
                    field: 'key',
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    footerFormatter: totalTextFormatter
                }, {
                    title: 'Item Detail',
                    colspan: 10,
                    align: 'center'
                }],
                [{
                    field: 'contenido',
                    title: 'Contenido',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'fecha_post',
                    title: 'Fecha',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'hastag',
                    title: 'Hashtag',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'id_usuario',
                    title: 'ID Usuario',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'nombreUsuario',
                    title: 'Nombre',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'salida',
                    title: 'Origen',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'retrasoSalida',
                    title: 'Salida retrasada',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'destino',
                    title: 'Destino',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'retrasoDestino',
                    title: 'LLegada retrasada',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'operate',
                    title: 'Item Operate',
                    align: 'center',
                    clickToSelect: false,
                    events: window.operateEvents,
                    formatter: operateFormatter
                }]
            ];
            break;

        // publicidad
        case 'tab_publicidad':
            config_cols = [
                [{
                    field: 'state',
                    checkbox: true,
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: 'Item ID',
                    field: 'key',
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    footerFormatter: totalTextFormatter
                }, {
                    title: 'Item Detail',
                    colspan: 7,
                    align: 'center'
                }],
                [{
                    field: 'comentario',
                    title: 'Comentario',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'hastag',
                    title: 'Hashtag',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'id_tipo_actividad',
                    title: 'ID Actividad',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'id_usuario',
                    title: 'ID Usuario',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'nombre_usuario',
                    title: 'Nombre',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'nombre_aeropuerto',
                    title: 'Aeropuerto',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'operate',
                    title: 'Item Operate',
                    align: 'center',
                    clickToSelect: false,
                    events: window.operateEvents,
                    formatter: operateFormatter
                }]
            ];

            break;

        // users
        case 'tab_usuarios':
            config_cols = [
                [{
                    field: 'state',
                    checkbox: true,
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: 'Item ID',
                    field: 'key',
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    footerFormatter: totalTextFormatter
                }, {
                    title: 'Item Detail',
                    colspan: 5,
                    align: 'center'
                }],
                [{
                    field: 'dni',
                    title: 'DNI',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'name',
                    title: 'Nombre',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'lastname',
                    title: 'Apellido',
                    sortable: true,
                    align: 'center',
                    footerFormatter: totalTextFormatter
                }, {
                    field: 'email',
                    title: 'Em@il',
                    sortable: true,
                    align: 'center',
                    footerFormatter: totalTextFormatter
                }, {
                    field: 'operate',
                    title: 'Item Operate',
                    align: 'center',
                    clickToSelect: false,
                    events: window.operateEvents,
                    formatter: operateFormatter
                }]
            ]
            break;

        // vuelos
        case 'tab_vuelos':
            config_cols = [
                [{
                    field: 'state',
                    checkbox: true,
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: 'Item ID',
                    field: 'key',
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    footerFormatter: totalTextFormatter
                }, {
                    title: 'Item Detail',
                    colspan: 8,
                    align: 'center'
                }],
                [{
                    field: 'id_vuelo',
                    title: 'ID Vuelo',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'origen',
                    title: 'Origen',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'fecha_salida',
                    title: 'Fecha Salida',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'retrasoSalida',
                    title: 'Salida retrasada',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'destino',
                    title: 'Destino',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'fecha_llegada',
                    title: 'Fecha Llegada',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'retrasoLlegada',
                    title: 'Llegada retrasada',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'operate',
                    title: 'Item Operate',
                    align: 'center',
                    clickToSelect: false,
                    events: window.operateEvents,
                    formatter: operateFormatter
                }]
            ]
            break;
        // vuelos
        case 'tab_vuelospersonas':
            config_cols = [
                [{
                    field: 'state',
                    checkbox: true,
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: 'Item ID',
                    field: 'key',
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    footerFormatter: totalTextFormatter
                }, {
                    title: 'Item Detail',
                    colspan: 4,
                    align: 'center'
                }],
                [{
                    field: 'id_vuelo',
                    title: 'ID Vuelo',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'dni_persona',
                    title: 'DNI ',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'asiento',
                    title: 'Número de asiento',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'operate',
                    title: 'Item Operate',
                    align: 'center',
                    clickToSelect: false,
                    events: window.operateEvents,
                    formatter: operateFormatter
                }]
            ]
            break;
    }

    return config_cols;
}
// <---------------------------------------------------------------------------->
// <--------------- configuración de captura de datos por tabla ---------------->
async function tab_table_config_data(tab_control) {

    var queryDB = null;
    var snap_query = null;
    var mydataSet = [];

    switch (tab_control) {

        case 'tab_aeropuertos':
            queryDB = dbRef.child("aeropuerto").orderByChild("nombre");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        nombre: child.val().nombre,
                        ciudad: child.val().ciudad,
                        isVuelo: child.val().isVuelo
                    };
                    mydataSet.push(fila_json);
                });
            }
            break;


        case 'tab_likes':
            queryDB = dbRef.child("likes").orderByChild("id_usuario");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        fecha_like: child.val().fecha_like,
                        id_post: child.val().id_post,
                        id_usuario: child.val().id_usuario
                    };
                    mydataSet.push(fila_json);
                });
            }
            break;
        case 'tab_posts':
            queryDB = dbRef.child("posts").orderByChild("id_usuario");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        contenido: child.val().contenido,
                        destino: child.val().destino,
                        fecha_post: child.val().fecha_post,
                        hastag: child.val().hastag,
                        id_usuario: child.val().id_usuario,
                        nombreUsuario: child.val().nombreUsuario,
                        retrasoDestino: child.val().retrasoDestino,
                        retrasoSalida: child.val().retrasoSalida,
                        salida: child.val().salida
                    };
                    mydataSet.push(fila_json);
                });
            }
            break;
        case 'tab_publicidad':
            queryDB = dbRef.child("publicidad").orderByChild("id_usuario");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        comentario: child.val().comentario,
                        hastag: child.val().hastag,
                        id_tipo_actividad: child.val().id_tipo_actividad,
                        id_usuario: child.val().id_usuario,
                        nombre_aeropuerto: child.val().nombre_aeropuerto,
                        nombre_usuario: child.val().nombre_usuario
                    };
                    mydataSet.push(fila_json);
                });
            }
            break;

        case 'tab_usuarios':
            queryDB = dbRef.child("users").orderByChild("email");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        dni: child.val().dni,
                        email: child.val().email,
                        lastname: child.val().lastname,
                        name: child.val().name,
                        pass: child.val().pass
                    };
                    mydataSet.push(fila_json);
                });
            }
            break;
        case 'tab_vuelos':
            queryDB = dbRef.child("vuelos").orderByChild("id_vuelo");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        destino: child.val().destino,
                        fecha_llegada: child.val().fecha_llegada,
                        fecha_salida: child.val().fecha_salida,
                        id_vuelo: child.val().id_vuelo,
                        origen: child.val().origen,
                        retrasoLlegada: child.val().retrasoLlegada,
                        retrasoSalida: child.val().retrasoSalida
                    };
                    mydataSet.push(fila_json);
                });
            }
            break;
        case 'tab_vuelospersonas':
            queryDB = dbRef.child("vuelos_personas").orderByChild("id_vuelo");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        asiento: child.val().asiento,
                        dni_persona: child.val().dni_persona,
                        id_vuelo: child.val().id_vuelo
                    };
                    mydataSet.push(fila_json);
                });
            }
            break;

        case 'opcion_amigos':
            queryDB = dbRef.child("amigos").orderByChild("dni");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        dni: child.val().dni,
                        email: child.val().email,
                        lastname: child.val().lastname,
                        name: child.val().name,
                        pass: child.val().pass
                    };
                    mydataSet.push(fila_json);
                });
            }
            break;

        default:
            alert('Opción de control de tabla no contemplada ' + tab_control);
            return;
            break;
    }
    return mydataSet;
}

// <------------------------------------------->
// <--------------- MIS AMIGOS ---------------->
// <------------------------------------------->
/**
 * Carga de datos de mis amigos
 * @param {*} mis_amigos 
 */
async function load_amigos_table() {
    let mydataSet = [];
    var mis_amigos = [];
    var queryAmigos = dbRef.child("amigos");
    var snap_amigos = await queryAmigos.orderByChild("dni").equalTo(usuarioLogeado.dni).once("value");
    if (snap_amigos != null) {
        snap_amigos.forEach((child) => {
            mis_amigos.push([child.key, child.val().dni_amigo]);
        });

        for (i = 0; i < mis_amigos.length; i++) {
            var dni_amigo = mis_amigos[i][1];
            let queryUsers = dbRef.child("users").orderByChild("dni").equalTo(dni_amigo);
            var snap_users = await queryUsers.once("value");

            if (snap_users != null) {
                snap_users.forEach((child) => {
                    var foto_perfil = getImagenStorage(child.val().dni + '/', 'perfil.png');
                    var fila_json = {
                        key: child.key,
                        foto_perfil: foto_perfil,
                        dni: child.val().dni,
                        name: child.val().name,
                        lastname: child.val().lastname,
                        email: child.val().email
                    };
                    console.log(JSON.stringify(fila_json, null, 2));
                    mydataSet.push(fila_json);
                });
            }
        }
    }

    /*  var row_amigo = snap_amigos.val();
        let queryUsers = dbRef.child("users").orderByChild("dni").equalTo(row_amigo.dni_amigo);
        let join = queryUsers.on('value', snap_users => {
            var row_user = snap_users.val();
            var foto_perfil = "";
            var foto_perfil = getImagenStorage(row_user.dni + '/', 'perfil.png');
            var fila_json = {
                key: snap_users.key,
                foto_perfil: foto_perfil,
                dni: row_user.dni,
                name: row_user.name,
                lastname: row_user.lastname,
                email: row_user.email
            };
            mis_amigos.push(fila_json);
        });
    */

    var config_cols_old = [
        [{
            field: 'state',
            checkbox: true,
            rowspan: 2,
            align: 'center',
            valign: 'middle'
        }, {
            title: 'Item ID',
            field: 'key',
            rowspan: 2,
            align: 'center',
            valign: 'middle',
            sortable: true,
            footerFormatter: totalTextFormatter
        }, {
            title: 'Item Detail',
            colspan: 3,
            align: 'center'
        }],
        [{
            field: 'foto_perfil',
            title: 'Foto',
            image: true,
            sortable: true,
            align: 'center',
            formatter: function (e, value) {
                return '<img class="fotaza" src="' + value.foto_perfil + '" height="25" width="25">'
            },
            events: {
                'click .fotaza': function (e, value, row) {
                    //alert(JSON.stringify(row))
                    alert(row.foto_perfil);
                }
            }
        }, {
            field: 'dni',
            title: 'DNI',
            sortable: true,
            align: 'center'
        }, {
            field: 'name',
            title: 'Nombre',
            sortable: true,
            align: 'left'
        }]
    ];

    var config_cols = [
        [{
            field: 'foto_perfil',
            title: 'Foto',
            image: true,
            sortable: true,
            align: 'center',
            formatter: function (e, value) {
                return '<img class="fotaza" src="' + value.foto_perfil + '" height="50" width="50">'
            },
            events: {
                'click .fotaza': function (e, value, row) {
                    //alert(JSON.stringify(row))
                    alert("click en foto")

                }
            }
        }, {
            field: 'dni',
            title: 'DNI',
            sortable: true,
            align: 'center'
        }, {
            field: 'name',
            title: 'Nombre',
            sortable: true,
            align: 'left'
        }, {
            field: 'lastname',
            title: 'Apellidos',
            sortable: true,
            align: 'left'
        }, {
            title: 'nombre_apellidos',
            align: 'left',
            formatter: function (e, value) {
                return '<p> ' + value.name + ' ' + value.lastname + '</p>'
            },
        }, {
            title: 'Enlace_perfil',
            align: 'center',
            width: 25,
            formatter: function (e, value) {
                return '<a href="#">Enlace a perfil</a>'
            },
        }
        ]
    ];

    $table_amigos.bootstrapTable('destroy').bootstrapTable({//height: 500,
        data: mydataSet,
        pagination: true,
        columns: config_cols
    })

    $table_amigos.click(function () {
        var ids = getIdSelections()
        $table_amigos.bootstrapTable('remove', {
            field: 'key',
            values: ids
        })
        alert("click en tabla")
        //$remove.prop('disabled', true)
    })
    // $table_amigos.on('check.bs.table uncheck.bs.table ' +
    //     'check-all.bs.table uncheck-all.bs.table',
    //     function () {
    //         $remove.prop('disabled', !$table_amigos.bootstrapTable('getSelections').length)

    //         // save your data, here just save the current page
    //         selections = getIdSelections()
    //         // push or splice the selections if you want to save all data selections
    //     })
    // $table_amigos.on('all.bs.table', function (e, name, args) {
    //     console.log(name, args)
    // })
    // $remove.click(function () {
    //     var ids = getIdSelections()
    //     $table_amigos.bootstrapTable('remove', {
    //         field: 'key',
    //         values: ids
    //     })
    //     $remove.prop('disabled', true)
    // })

}

async function modal_test() {

    $("#textInput").children("div").remove();
    $("#textInput").children("input").remove();
    $("#textInput").children("label").remove();
    $("#textInput").children("button").remove();
    $("#textInput").children("select").remove();
    $("#textInput").children("hr").remove();


    $("#Titulo_form").text("Gestión Publicidad");

    // Nombre empresa
    $("#textInput").append('<div class="form-group">')
    $("#textInput").append('  <label for="input_comentario">Comentario</label>')
    $("#textInput").append('  <input type="text" id="input_comentario" class="form-control" placeholder="Texto a anunciar">')
    $("#textInput").append('</div>')

    $("#textInput").append('<div class="form-group">')
    $("#textInput").append('  <label for="input_hashtag">Hashtag #</label>')
    $("#textInput").append('  <input type="text" id="input_hashtag" class="form-control" placeholder="Hashtag del comentario">')
    $("#textInput").append('</div>')

    $("#textInput").append('<div class="form-group">')
    $("#textInput").append('    <label for="actividadesList">Actividad asociada:</label>')
    $("#textInput").append('    <select id="actividadesList" class="form-control"></select>')
    $("#textInput").append('</div>')

    var queryDB = dbRef.child("actividad").orderByChild("nombre_actividad");
    var snap_query = await queryDB.once("value");

    if (snap_query.val() != null) {
        // lista para borrar usuario
        var actividadesList = document.getElementById('actividadesList');
        snap_query.forEach((child) => {
            // creo el elemento
            var newElement = document.createElement('option');
            newElement.setAttribute('value', child.val().nombre_actividad);
            newElement.setAttribute('id', child.key);
            newElement.text = child.val().nombre_actividad;

            // Lo añado
            actividadesList.appendChild(newElement);
        });
    }

    $("#textInput").append('<div class="form-group">')
    $("#textInput").append('    <label for="fileName">Imagen asociada:</label>')
    $("#textInput").append('    <input id="fileName" class="form-control" type="file" accept="image/*">')
    $("#textInput").append('</div>')

    $("#textInput").append('<div class="form-group">')
    $("#textInput").append('    <hr>')
    $("#textInput").append('    <p id="feedback_form"></p>')
    $("#textInput").append('    <input class="btn btn-primary" type="button" value="Aceptar" id="btn_valid" onclick="validate_modal()">')
    $("#textInput").append('    <input class="btn btn-danger" type="button" value="Cancelar" id="btn_valid" onclick="close_modal()">')
    $("#textInput").append('</div>')

    $("#textInput").show().css('display', 'block');
    $('#exampleModalCenter').modal('show');
}

/**============================================================
GESTOR PUBLICIDAD                           
============================================================*/

// cargar datos FORMULARIO
async function load_data_publi() {

    var queryDB = dbRef.child("actividad").orderByChild("nombre_actividad");
    var snap_query = await queryDB.once("value");

    if (snap_query.val() != null) {
        // lista para borrar usuario
        var actividadesList = document.getElementById('actividadesList');
        snap_query.forEach((child) => {
            // creo el elemento
            var newElement = document.createElement('option');
            newElement.setAttribute('value', child.val().nombre_actividad);
            newElement.setAttribute('id', child.key);
            newElement.text = child.val().nombre_actividad;

            console.log(newElement);

            // Lo añado
            actividadesList.appendChild(newElement);
        });
    }

    var queryDB = dbRef.child("aeropuerto").orderByChild("nombre");
    var snap_query = await queryDB.once("value");

    if (snap_query.val() != null) {
        // lista para aeropuertos
        var actividadesList = document.getElementById('aeropuertosList');
        snap_query.forEach((child) => {
            // creo el elemento
            var newElement = document.createElement('option');
            newElement.setAttribute('value', child.val().nombre);
            //newElement.setAttribute('id', child.key);
            newElement.text = child.val().nombre;

            console.log(newElement);

            // Lo añado
            actividadesList.appendChild(newElement);
        });
    }
}

// VALIDAR FORMULARIO PUBLICIDAD                           
async function validate_publicidad() {
    var comentario = document.getElementById('input_comentario').value;
    var hashtag = document.getElementById('input_hashtag').value;
    var actividad_seleccionada = document.getElementById('actividadesList').value;
    var aeropuerto_seleccionado = document.getElementById('aeropuertosList').value;

    if (aeropuerto_seleccionado == "") {
        $('#feedback_form').html("No hay ningun aeropuerto seleccionado");
        return;
    }

    if (comentario == "") {
        $('#feedback_form').html("No has introducido ningún comentario");
        return;
    }

    if (hashtag == "") {
        $('#feedback_form').html("No has introducido ningún hashtag");
        return;
    }

    if (actividad_seleccionada == "") {
        $('#feedback_form').html("No hay ningun actividad seleccionada");
        return;
    }

    var carrousel = upload();  // subir imágenes

    var publicidad_row = {
        comentario: comentario,
        hashtag: hashtag,
        carrousel: carrousel,
        nombre_actividad: actividad_seleccionada,
        nombre_aeropuerto: aeropuerto_seleccionado,
        id_usuario: usuarioLogeado.dni,
        nombre_usuario: usuarioLogeado.nombrePerfil
    };

    if (bbdd_insert("publicidad", publicidad_row)) {
        $('#feedback_form').html("Registro de publicidad creado correctamente!!")
    }
}

/**============================================================
                  GESTIÓN MODALES
============================================================*/

// ABRIR y  CERRAR
function modal_gestion(opcion) {

    switch (tab_public_control) {
        case 'tab_aeropuertos':
            document.getElementById("input_aeropuerto").value = "";
            document.getElementById("input_ciudad").value = "";
            $('#Modal_aeropuertos').modal(opcion);
            break;

        default:
            alert("Gestión no creada aún para " + tab_public_control);
    }
}

// VALIDACIÓN FORMULARIOS
async function modal_save_data() {
    switch (tab_public_control) {
        case 'tab_aeropuertos':

            var nombre_aeropuerto = document.getElementById("input_aeropuerto").value;
            var nombre_ciudad = document.getElementById("input_ciudad").value;
            // check nombre aeropuerto
            if (nombre_aeropuerto == "") {
                document.getElementById("feedback_aeropuerto").innerHTML = "Debe indicar un nombre para el aeropuerto"
                return;
            }
            if (nombre_aeropuerto.length < 5) {
                document.getElementById("feedback_aeropuerto").innerHTML = "El nombre del aeropuerto es demasiado corto"
                return;
            }
            // check nombre ciudad
            if (nombre_ciudad == "") {
                document.getElementById("feedback_aeropuerto").innerHTML = "Debe indicar un nombre para la ciudad"
                return;
            }
            if (nombre_ciudad.length < 3) {
                document.getElementById("feedback_aeropuerto").innerHTML = "El nombre de la ciudad es demasiado corto"
                return;
            }

            // imagen del aeropuerto, sólo 1?
            var imagen = "";
            var carrousel = upload();  // subir imágenes                        
            if (carrousel.length > 0) {
                imagen = carrousel[0]
            }

            // check existencia aeropuerto => tabla, campo y valor
            if (bbdd_existe_registro("aeropuerto", "nombre", nombre_aeropuerto) == true) {
                document.getElementById("feedback_aeropuerto").innerHTML = "Este aeropuerto ya existe!"
                return;
            }
            else {
                var aeropuerto_row = {
                    ciudad: nombre_ciudad,
                    nombre: nombre_aeropuerto,
                    imagen: imagen
                };

                if (bbdd_insert("aeropuerto", aeropuerto_row) == true) {
                    alert("Aeropuerto creado correctamente");
                    $('#Modal_aeropuertos').modal('hide');
                }
            }

            break;

    }
    
    await manage_tab_table(tab_public_control);

}

/**============================================================
                           BBDD
============================================================*/
// <----------------- check existencia ------------------------->
async function bbdd_existe_registro(table_name, campo_bd, valor_bd) {
    try {
        var query = dbRef.child("/" + table_name + "/")
            .orderByChild(campo_bd)
            .equalTo(valor_bd);

        var snap = await query.once("value");
        return (snap.val() == null ? false : true);
    }
    catch (error) {
        alert("Se ha producido un error de en la gestión de " + table_name);
        console.error(error);
    }

}
// <----------------- insert tabla ------------------------->
function bbdd_insert(table_name, row_values) {
    try {
        var newRow = dbRef.child(table_name).push().key;
        var updates = {};
        updates["/" + table_name + "/" + newRow] = row_values;
        var result = dbRef.update(updates);
        return true;
    }
    catch (error) {
        alert("Se ha producido un error de en la gestión de " + table_name);
        console.error(error);
    }
    return false;
}
// <----------------- update tabla ------------------------->
function bbdd_update(table_name, campo_bd, valor_bd, row_values) {
    try {
        var query = dbRef.child("/" + table_name + "/")
            .orderByChild(campo_bd)
            .equalTo(valor_bd);

        // comprobamos si existe
        query.once("value", snap => {
            if (snap.val() != null) {
                alert("El registro a modificar no existe");
                return false;
            } else {
                // seleccionamos el único elemento que debería colgar de snap
                var key = Object.keys(snap.val())[0];
                snap.ref.child(key).set(row_values); // asignamos el nuevo valor a la key
            }
        });
        return true;
    }
    catch (error) {
        alert("Se ha producido un error de en la gestión de " + table_name);
        console.error(error);
    }
    return false;
}
// <----------------- delete tabla ------------------------->
function bbdd_delete(tableName, key) {
    var ref = dbRef.child("/" + tableName + "/" + key);
    ref
        .remove()
        .then(function () {
            return true;
        })
        .catch(function (error) {
            alert("Se ha producido un error de en la gestión de " + tableName);
            console.error(error);
            return false;
        });
}


