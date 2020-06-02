
// js para test html y amigos html

var $table = $('#table_admin');
var $table_amigos = $('#table_amigos');
var $table_vuelos = $('#table_vuelos');
var $remove = $('#remove');
var selections = [];

var tab_public_control = 'tab_aeropuertos';
var master_tab_public_control = 'tab_maestras';

var tabs_pagina = ['tab_aeropuertos', 'tab_actividades', 'tab_likes',
    'tab_posts', 'tab_publicidad', 'tab_usuarios',
    'tab_vuelos', 'tab_vuelospersonas'
];

// <-------------------------- load paginas ------------------------------>


// <----------------------------------------------->
// <--------------- ADMINISTRACION ---------------->
// <----------------------------------------------->

//<------------- funciones Datatabla --------------->
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

        if (confirmacion == true) {
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
//<------------- FIN  funciones Datatabla --------------->

// nos da la tabla de bbdd según el nombre del tab
function get_tablabd_tab(tab_control) {
    var nombre_tabla = "";
    switch (tab_control) {
        case 'tab_aeropuertos':
            nombre_tabla = "aeropuerto";
            break;
        case 'tab_actividades':
            nombre_tabla = "actividad";
            break;
        case 'tab_likes':
            nombre_tabla = "likes";
            break;
        case 'tab_posts':
            nombre_tabla = "posts";
            break;
        case 'tab_publicidad':
            nombre_tabla = "publicidad";
            break;
        case 'tab_usuarios':
            nombre_tabla = "users";
            break;
        case 'tab_vuelos':
            nombre_tabla = "vuelos";
            break;
        case 'tab_vuelospersonas':
            nombre_tabla = "vuelos_users";
            break;
        default:
            alert("Opción de nombre para tab_control no definida");
    }
    return nombre_tabla;
}

// nos da la tabla de bbdd según el nombre del tab
function get_modalName_tab(tab_control) {
    var nombre_modal = "";
    switch (tab_control) {
        case 'tab_aeropuertos':
            nombre_modal = "Modal_aeropuerto";
            break;
        case 'tab_actividades':
            nombre_modal = "Modal_actividad";
            break;
        case 'tab_likes':
            nombre_modal = "Modal_likes";
            break;
        case 'tab_posts':
            nombre_modal = "Modal_posts";
            break;
        case 'tab_publicidad':
            nombre_modal = "Modal_publicidad";
            break;
        case 'tab_usuarios':
            nombre_modal = "Modal_users";
            break;
        case 'tab_vuelos':
            nombre_modal = "Modal_vuelos";
            break;
        case 'tab_vuelospersonas':
            nombre_modal = "Modal_vuelos_personas";
            break;
        default:
            alert("Opción de nombre para tab_control no definida");
    }
    return nombre_modal;
}

// <-------------------------- evento on change tabs ------------------------------>
$('a[data-toggle="tab"]').on('shown.bs.tab', async function (e) {
    var target = $(e.target).attr("id"); // activated tab

    if (target == 'tab_maestras' || target == 'tab_visores') {
        // master TABS
        master_tab_public_control = target; // master_tab public activo
        await manage_master_tab(target);
    }
    else {
        // TABS tablas
        tab_public_control = target; // para el control del tab public activo
        await manage_tab_table(target);
    }
});

// Gestión master tab
async function manage_master_tab(target_master) {

    // restablecemos a formato inactivo    
    document.getElementById("tab_maestras").setAttribute("class", "nav-link");
    document.getElementById("tab_maestras").style.fontWeight = "normal";
    document.getElementById("tab_maestras").style.color = "white";

    document.getElementById("tab_visores").setAttribute("class", "nav-link");
    document.getElementById("tab_visores").style.fontWeight = "normal";
    document.getElementById("tab_visores").style.color = "white";


    // marcamos el tab activo con el valor id de tab_target
    document.getElementById(target_master).setAttribute("class", "nav-link active");
    document.getElementById(target_master).style.fontWeight = "bold";
    document.getElementById(target_master).style.color = "blue";

    if (target_master == 'tab_maestras') {
        var elements_show = ['tab_aeropuertos', 'tab_actividades', 'tab_usuarios', 'tab_vuelos', 'tab_vuelospersonas', 'add_bbdd'];
        var elements_hide = ['tab_likes', 'tab_posts', 'tab_publicidad'];
    }
    else if (target_master == 'tab_visores') {
        var elements_show = ['tab_likes', 'tab_posts', 'tab_publicidad'];
        var elements_hide = ['tab_aeropuertos', 'tab_actividades', 'tab_usuarios', 'tab_vuelos', 'tab_vuelospersonas', 'add_bbdd'];
    }

    // mostrar
    elements_show.forEach(id_element =>
        document.getElementById(id_element).style.display = 'block'
    );

    // ocultar
    elements_hide.forEach(id_element =>
        document.getElementById(id_element).style.display = 'none'
    );

    // tabla a mostrar
    tab_public_control = elements_show[0]

    // carga de tabs
    await manage_tab_table(tab_public_control);

}


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
                    title: 'Eliminar',
                    align: 'center',
                    clickToSelect: false,
                    events: window.operateEvents,
                    formatter: operateFormatter
                }]
            ];
            break;

        // actividades
        case 'tab_actividades':
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
                    colspan: 2,
                    align: 'center'
                }],
                [{
                    field: 'nombre_actividad',
                    title: 'Nombre',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'operate',
                    title: 'Eliminar',
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
                    title: 'Eliminar',
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
                    title: 'Eliminar',
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
                    title: 'Eliminar',
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
                    colspan: 7,
                    align: 'center'
                }],
                [{
                    field: 'uid',
                    title: 'uid',
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
                    field: 'phone',
                    title: 'Teléfono',
                    sortable: true,
                    align: 'center',
                    footerFormatter: totalTextFormatter
                }, {
                    field: 'date_add',
                    title: 'Fecha registro',
                    sortable: true,
                    align: 'center',
                    footerFormatter: totalTextFormatter
                },{
                    field: 'operate',
                    title: 'Eliminar',
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
                    title: 'Eliminar',
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
                    colspan: 5,
                    align: 'center'
                }],
                [{
                    field: 'id_vuelo',
                    title: 'ID Vuelo',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'uid_persona',
                    title: 'UID ',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'lastname',
                    title: 'Apellidos',
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
                    field: 'operate',
                    title: 'Eliminar',
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

        case 'tab_actividades':
            queryDB = dbRef.child("actividad").orderByChild("nombre_actividad");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        nombre_actividad: child.val().nombre_actividad
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
                        uid: child.val().uid,
                        email: child.val().email,
                        phone: child.val().tlf_movil,
                        lastname: child.val().apellidos,
                        name: child.val().nombre,   
                        date_add: child.val().fecha_registro                      
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
            var vuelos_uid=[];
            queryDB = dbRef.child("vuelos_users").orderByChild("id_vuelo");
            snap_query = await queryDB.once("value");            
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    vuelos_uid.push([child.val().id_vuelo, child.val().uid]);
                });
            }

            console.log(vuelos_uid);

            for(i=0; i<vuelos_uid.length; i++){
                var id_vuelo=vuelos_uid[i][0];
                var uid_pasajero=vuelos_uid[i][1];
                    
                var nombre="";
                var apellidos="";
                var query_user = dbRef.child('users').orderByChild('uid').equalTo(uid_pasajero);
                
                var snap_user = await query_user.once("value");
                if (snap_user.val() != null) {
                    var key = Object.keys(snap_user.val())[0];  
                    var val = Object.values(snap_user.val())[0]; 
                    nombre=val.nombre;
                    apellidos=val.apellidos;
                
                    var fila_json = {
                        key: key,                                                
                        id_vuelo: id_vuelo,
                        uid_persona: uid_pasajero,
                        name: nombre,
                        lastname: apellidos
                    };
                    mydataSet.push(fila_json);
                }
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
    var snap_amigos = await queryAmigos.orderByChild("uid").equalTo(usuarioLogeado.uid).once("value");
    if (snap_amigos != null) {
        snap_amigos.forEach((child) => {
            mis_amigos.push([child.key, child.val().uid_amigo]);
        });

        for (i = 0; i < mis_amigos.length; i++) {
            var uid_amigo = mis_amigos[i][1];
            let queryUsers = dbRef.child("users").orderByChild("uid").equalTo(uid_amigo);
            var snap_users = await queryUsers.once("value");

            if (snap_users != null) {
                snap_users.forEach((child) => {
                    var foto_perfil = getImagenStorage(child.val().uid + '/', 'perfil.png');
                    var fila_json = {
                        key: child.key,
                        foto_perfil: foto_perfil,
                        uid: child.val().uid,
                        name: child.val().nombre,
                        lastname: child.val().apellidos,
                        email: child.val().email
                    };
                    console.log(JSON.stringify(fila_json, null, 2));
                    mydataSet.push(fila_json);
                });
            }
        }
    }   

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
                                       
                    var uid_amigo = row.uid;                                        
                    // establecemos la sesión con el uid del amigo
                    sessionStorage.clear(); // limpiamos sesión
                    sessionStorage.setItem("uid_busqueda", uid_amigo);

                    alert("Parámetro uid_amigo:" + uid_amigo)
                    alert("Get SESSION:" + sessionStorage.getItem("uid_busqueda"))                    
                    
                    window.location.href = "https://pcsocialfly.web.app/pages/perfil.html";                    
                }
            }
        }, {
            field: 'uid',
            title: 'uid',
            sortable: true,
            align: 'center'
        }, {
            title: 'nombre_apellidos',
            align: 'left',
            formatter: function (e, value) {
                return '<p> ' + value.name + ' ' + value.lastname + '</p>'
            },
        }, {
            title: 'Contactar',
            align: 'left',
			width: 25,
            formatter: function (e, value) {
                return "<a href='#' data-target='#modalMensajeria' data-toggle='modal' onclick='cambiarDataIdModalMensajeria(\"" + value.uid + "\")' >"
				+ "					<i class='fas fa-comments'></i>"
				+ "				</a>"
            },
        },{
            title: 'Enlace_perfil',
            align: 'center',
            width: 25,
            formatter: function (e, value) {
                // establecemos la sesión con el uid del amigo
                sessionStorage.clear(); // limpiamos sesión
                sessionStorage.setItem("uid_busqueda", value.uid);                
                return '<a href="https://pcsocialfly.web.app/pages/perfil.html"><i class="fas fa-user"></i></a>'
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

function cambiarDataIdModalMensajeria(varUidAmigo){
	$('#modalMensajeria').attr('data-id',varUidAmigo);
}

/**
 * Carga de datos de mis vuelos
 * @param {*} mis_vuelos
 */
async function load_vuelos_table() {
    let mydataSet = [];
    var mis_vuelos = [];
    var queryVuelos_users = dbRef.child("vuelos_users");
    var snap_vuelos_users = await queryVuelos_users.orderByChild("uid").equalTo(usuarioLogeado.uid).once("value"); 
    if (snap_vuelos_users != null) {
        snap_vuelos_users.forEach((child) => {            
            mis_vuelos.push([child.key, child.val().id_vuelo]);
        });       

        for (i = 0; i < mis_vuelos.length; i++) {
            var id_vuelo = mis_vuelos[i][1];
            let queryVuelos = dbRef.child("vuelos").orderByChild("id_vuelo").equalTo(id_vuelo);
            var snap_vuelos = await queryVuelos.once("value");

            if (snap_vuelos != null) {
                snap_vuelos.forEach((child) => {                    
                    var fila_json = {
                        key: child.key,                        
                        id_vuelo: child.val().id_vuelo,
                        origen: child.val().origen,
                        destino: child.val().destino,
                        fecha_llegada: child.val().fecha_llegada,
                        fecha_salida: child.val().fecha_salida
                    };
                    console.log(JSON.stringify(fila_json, null, 2));
                    mydataSet.push(fila_json);
                });
            }
        }
    }   

    var config_cols = [
        [ {
            field: 'id_vuelo',
            title: 'Id Vuelo',
            sortable: true,
            align: 'center'
        }, {
            field: 'origen',
            title: 'Origen',
            sortable: true,
            align: 'left'
        }, {
            field: 'destino',
            title: 'Destino',
            sortable: true,
            align: 'left'
        }, {
            field: 'fecha_salida',
            title: 'Fecha Salida',
            sortable: true,
            align: 'left'
        }, {
            field: 'fecha_llegada',
            title: 'Fecha Llegada',
            sortable: true,
            align: 'left'
        }        
        ]
    ];

    $table_vuelos.bootstrapTable('destroy').bootstrapTable({//height: 500,
        data: mydataSet,
        pagination: true,
        columns: config_cols
    })

    $table_vuelos.click(function () {
        var ids = getIdSelections()
        $table_vuelos.bootstrapTable('remove', {
            field: 'key',
            values: ids
        })
        alert("click en tabla")
        //$remove.prop('disabled', true)
    })   

}

/**============================================================
                      GESTOR PUBLICIDAD                           
============================================================*/

// cargar datos FORMULARIO
async function load_data_publi() {
    // lista para actividades
    var queryDB = dbRef.child("actividades").orderByChild("id_actividad");
    var snap_query = await queryDB.once("value");
    if (snap_query.val() != null) {
        var actividadesList = document.getElementById('actividadesList');
        snap_query.forEach((child) => {
            // creo el elemento
            var newElement = document.createElement('option');
            newElement.setAttribute('value', child.val().id_actividad);
            newElement.setAttribute('id', child.key);
            newElement.text = child.val().nombre;

            actividadesList.appendChild(newElement); // Lo añado al select
        });
    }
    // lista para aeropuertos
    var queryDB = dbRef.child("aeropuerto").orderByChild("nombre");
    var snap_query = await queryDB.once("value");
    if (snap_query.val() != null) {
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
	var nombre_actividad_seleccionada = $("#actividadesList option:selected").text();

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
        id_tipo_actividad: actividad_seleccionada,
		nombre_actividad: nombre_actividad_seleccionada,
        nombre_aeropuerto: aeropuerto_seleccionado,
        id_usuario: usuarioLogeado.uid,
        nombre_usuario: usuarioLogeado.nombrePerfil
    };

    if (bbdd_insert("publicidad", publicidad_row)) {
        $('#feedback_form').html("Registro de publicidad creado correctamente!!")
    }
}

/**============================================================
                  GESTIÓN MODALES ADMIN
============================================================*/

// ABRIR y  CERRAR
async function modal_gestion(opcion) {
    var nombre_modal = get_modalName_tab(tab_public_control); // nombre del modal

    switch (tab_public_control) {
        case 'tab_aeropuertos':
            document.getElementById("input_aeropuerto").value = "";
            document.getElementById("input_ciudad").value = "";
            document.getElementById("feedback_aeropuerto").innerHTML = "";
            break;

        case 'tab_actividades':
            document.getElementById("input_actividad").value = "";
            document.getElementById("feedback_actividad").innerHTML = "";
            break;

        case 'tab_usuarios':
            document.getElementById("input_uid").value = "";
            document.getElementById("input_nombre").value = "";
            document.getElementById("input_apellido").value = "";
            document.getElementById("input_email").value = "";
            document.getElementById("input_phone").value = "";            
            document.getElementById("feedback_usuario").innerHTML = "";
            break;

        case 'tab_vuelos':
            document.getElementById("input_numerovuelo").value = "";
            document.getElementById("input_fechaSalida").value = "";
            document.getElementById("input_fechaLlegada").value = "";
            document.getElementById("feedback_vuelos").innerHTML = "";

            removeOptions(document.getElementById('OrigenList'));
            removeOptions(document.getElementById('DestinoList'));

            // lista para aeropuertos
            var queryDB = dbRef.child("aeropuerto").orderByChild("nombre");
            var snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {

                var OrigenList = document.getElementById('OrigenList');
                var DestinoList = document.getElementById('DestinoList');
                // lista origenes
                snap_query.forEach((child) => {
                    // creo el elemento
                    var newElement = document.createElement('option');
                    newElement.setAttribute('value', child.val().nombre);
                    newElement.text = child.val().nombre + "(" + child.val().ciudad + ")";

                    console.log(newElement);

                    // Lo añado                                        
                    OrigenList.appendChild(newElement);
                    //DestinoList.appendChild(newElement); solo carga el último?? me obliga a hacerlo por separado
                });
                // lista destinos
                snap_query.forEach((child) => {
                    // creo el elemento
                    var newElement = document.createElement('option');
                    newElement.setAttribute('value', child.val().nombre);
                    newElement.text = child.val().nombre + "(" + child.val().ciudad + ")";

                    console.log(newElement);

                    // Lo añado                    
                    DestinoList.appendChild(newElement);
                });
            }

            break;

            case 'tab_vuelospersonas':

                removeOptions(document.getElementById('VuelosList'));
                removeOptions(document.getElementById('UsersList'));
                document.getElementById("feedback_vuelos_personas").innerHTML = "";
    
                // lista para aeropuertos
                var queryDB_vuelos = dbRef.child("vuelos").orderByChild("id_vuelo");
                var snap_query_vuelos = await queryDB_vuelos.once("value");
                if (snap_query_vuelos.val() != null) {
    
                    var VuelosList = document.getElementById('VuelosList');                    
                    // lista vuelos
                    snap_query_vuelos.forEach((child) => {
                        // creo el elemento
                        var newElement = document.createElement('option');
                        newElement.setAttribute('value', child.val().id_vuelo);
                        newElement.text = child.val().id_vuelo + " # " + child.val().origen + " - " + child.val().destino;
    
                        console.log(newElement);
    
                        // Lo añado                                        
                        VuelosList.appendChild(newElement);                        
                    });
                }

                // lista para usuarios
                var queryDB_users = dbRef.child("users").orderByChild("apellidos");
                var snap_query_users = await queryDB_users.once("value");
                if (snap_query_users.val() != null) {
    
                    var UsersList = document.getElementById('UsersList');                    
                    // lista usuarios
                    snap_query_users.forEach((child) => {
                        // creo el elemento
                        var newElement = document.createElement('option');
                        newElement.setAttribute('value', child.val().uid);
                        newElement.text = child.val().apellidos + ", " + child.val().nombre + " # " + child.val().uid;
    
                        console.log(newElement);
    
                        // Lo añado                                        
                        UsersList.appendChild(newElement);                        
                    });
                }                   
    
                break;            

        default:
            alert("Gestión no creada aún para " + tab_public_control);
            return;
    }

    // Acción a realizar con el modal => ABRIR O CERRAR
    $('#' + nombre_modal).modal(opcion);

}

// VALIDACIÓN FORMULARIOS
async function modal_save_data() {
    switch (tab_public_control) {
        // AEROPUERTOS
        case 'tab_aeropuertos':
            var nombre_aeropuerto = document.getElementById("input_aeropuerto").value;
            var nombre_ciudad = document.getElementById("input_ciudad").value;
            var feedback_label = "feedback_aeropuerto";

            // check nombre aeropuerto
            if (nombre_aeropuerto == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar un nombre para el aeropuerto"
                return;
            }
            if (nombre_aeropuerto.length < 5) {
                document.getElementById(feedback_label).innerHTML = "El nombre del aeropuerto es demasiado corto"
                return;
            }
            // check nombre ciudad
            if (nombre_ciudad == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar un nombre para la ciudad"
                return;
            }
            if (nombre_ciudad.length < 3) {
                document.getElementById(feedback_label).innerHTML = "El nombre de la ciudad es demasiado corto"
                return;
            }

            // imagen del aeropuerto, sólo 1?
            var imagen = "";
            var carrousel = upload();  // subir imágenes                        
            if (carrousel.length > 0) {
                imagen = carrousel[0]
            }

            // check existencia => tabla, campo y valor
            if (await bbdd_existe_registro("aeropuerto", "nombre", nombre_aeropuerto) == true) {
                document.getElementById(feedback_label).innerHTML = "Este aeropuerto ya existe!"
                return;
            }
            else {
                var new_row = {
                    ciudad: nombre_ciudad,
                    nombre: nombre_aeropuerto,
                    imagen: imagen
                };

                if (bbdd_insert("aeropuerto", new_row) == true) {
                    alert("Aeropuerto creado correctamente");
                    $('#Modal_aeropuertos').modal('hide');
                }
            }
            break;

        // ACTIVIDADES
        case 'tab_actividades':
            var nombre_actividad = document.getElementById("input_actividad").value;
            var feedback_label = "feedback_actividad";

            // check nombre actividad
            if (nombre_actividad == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar un nombre para la actividad"
                return;
            }
            if (nombre_actividad.length < 3) {
                document.getElementById(feedback_label).innerHTML = "El nombre de la actividad es demasiado corto"
                return;
            }

            // check existencia => tabla, campo y valor
            if (await bbdd_existe_registro("actividad", "nombre_actividad", nombre_actividad) == true) {
                document.getElementById(feedback_label).innerHTML = "Esta actividad ya existe!"
                return;
            }
            else {
                var new_row = {
                    nombre_actividad: nombre_actividad
                };
                if (bbdd_insert("actividad", new_row) == true) {
                    alert("Actividad creada correctamente");
                }
            }
            break;

        // USUARIOS
        case 'tab_usuarios':

            var uid = document.getElementById("input_uid").value;
            var nombre = document.getElementById("input_nombre").value;
            var apellido = document.getElementById("input_apellido").value;
            var email = document.getElementById("input_email").value;
            var telefono = document.getElementById("input_phone").value;
            var feedback_label = "feedback_usuario";

            // check uid
            if (uid == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar su uid"
                return;
            }
            if (uid.length < 9) {
                document.getElementById(feedback_label).innerHTML = "El uid es demasiado corto"
                return;
            }
            // check nombre
            if (nombre == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar su nombre"
                return;
            }
            if (nombre.length < 3) {
                document.getElementById(feedback_label).innerHTML = "El nombre es demasiado corto"
                return;
            }

            // check apellido
            if (apellido == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar sus apellidos"
                return;
            }
            if (apellido.length < 3) {
                document.getElementById(feedback_label).innerHTML = "El apellido es demasiado corto"
                return;
            }

            // check email
            if (apellido == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar sus email"
                return;
            }
            if (validateEmail(email) == false) {
                document.getElementById(feedback_label).innerHTML = "El formato del email no es correcto"
                return;
            }

            // check existencia => tabla, campo y valor
            if (await bbdd_existe_registro("users", "email", email) == true) {
                document.getElementById(feedback_label).innerHTML = "El email ya está asociado a otro usuario!"
                return;
            }
            else {
                var new_row = {
                    uid: uid,
                    nombre: nombre,
                    apellifos: apellido,
                    email: email,
                    tlf_movil: telefono
                };

                if (bbdd_insert("users", new_row) == true) {
                    alert("Usuario creado correctamente");
                }
            }
            break;

        // VUELOS
        case 'tab_vuelos':

            var numero_vuelo = document.getElementById("input_numerovuelo").value;
            var fecha_salida = document.getElementById("input_fechaSalida").value;
            var fecha_llegada = document.getElementById("input_fechaLlegada").value;
            var origen = document.getElementById("OrigenList").value;
            var destino = document.getElementById("DestinoList").value;

            var feedback_label = "feedback_vuelos";

            // check numero_vuelo
            if (numero_vuelo == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar el número identificador del vuelo"
                return;
            }
            if (numero_vuelo.length < 4) {
                document.getElementById(feedback_label).innerHTML = "El número identificador del vuelo es demasiado corto"
                return;
            }
            // check fecha_salida
            if (fecha_salida == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar la fecha de salida"
                return;
            }
            if (validateFecha(fecha_salida) == false) {
                document.getElementById(feedback_label).innerHTML = "El formato de la fecha de salida no es correcto - DD/MM/YYYY"
                return;
            }
            // check fecha_llegada
            if (fecha_llegada == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar la fecha de llegada"
                return;
            }
            if (validateFecha(fecha_llegada) == false) {
                document.getElementById(feedback_label).innerHTML = "El formato de la fecha de llegada no es correcto - DD/MM/YYYY"
                return;
            }

            if (date_japon(fecha_salida) > date_japon(fecha_llegada)) {
                document.getElementById(feedback_label).innerHTML = "La fecha de salida no puede ser posterior a la de llegada"
                return;
            }

            // check origen
            if (origen == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar el aeropuerto de origen"
                return;
            }
            // check destino
            if (destino == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar el aeropuerto de destino"
                return;
            }
            // check origen != destino
            if (origen == destino) {
                document.getElementById(feedback_label).innerHTML = "El aeropuerto de origen y de destino no pueden ser iguales"
                return;
            }

            // check existencia => tabla, campo y valor
            if (await bbdd_existe_registro("vuelos", "id_vuelo", numero_vuelo) == true) {
                document.getElementById(feedback_label).innerHTML = "El número identificador del vuelo ya existe!!"
                return;
            }
            else {
                var new_row = {
                    id_vuelo: numero_vuelo,
                    fecha_salida: fecha_salida,
                    fecha_llegada: fecha_llegada,
                    origen: origen,
                    destino: destino
                };
                if (bbdd_insert("vuelos", new_row) == true) {
                    alert("Vuelo creado correctamente");
                }
            }
            break;

        // VUELOS PERSONAS
        case 'tab_vuelospersonas':
            
            var id_vuelo = document.getElementById("VuelosList").value;
            var uid_pasajero = document.getElementById("UsersList").value;

            var feedback_label = "feedback_vuelos_personas";            

            // check id_vuelo
            if (id_vuelo == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar el número de vuelo"
                return;
            }
            // check destino
            if (uid_pasajero == "") {
                document.getElementById(feedback_label).innerHTML = "Debe indicar el pasajero"
                return;
            }

            // check existencia => tabla, campo y valor
            var query = dbRef.child("vuelos_users").orderByChild("id_vuelo").equalTo(id_vuelo);

            var ladd_DB = true;

            var snap_vuelos_users = await query.once("value");
            if(snap_vuelos_users!=null){
                snap_vuelos_users.forEach((child) => {                    
                    if(child.val().uid == uid_pasajero){
                        document.getElementById(feedback_label).innerHTML = "El pasajero seleccionado ya está asociado al vuelo "+id_vuelo;
                        ladd_DB= false;
                    }                    
                });
            }

            if ( ladd_DB == false ){
                return;
            }          

            var new_row = {
                id_vuelo: id_vuelo,
                uid: uid_pasajero
            };
            if (bbdd_insert("vuelos_users", new_row) == true) {
                alert("Pasajero asociado al vuelo correctamente");
            }
            
            break;            
    }

    var nombre_modal = get_modalName_tab(tab_public_control); // nombre del modal
    $('#' + nombre_modal).modal('hide');//ocultamos modal
    await manage_tab_table(tab_public_control); // refrescamos datos async
}

// para el control de datepicker
$('.datepicker').datepicker({
    startDate: '-3d'
});

/**============================================================
                           BBDD
============================================================*/
// <!------------------- Get key relacion ---------------------->
async function getKeyRelacion(table_name, campo_bd, valor_bd, campo2_bd, valor2_bd)						
{
	try {
		var query = dbRef.child("/" + table_name + "/")
			.orderByChild(campo_bd)
			.equalTo(valor_bd);

		var snap = await query.once("value");	
		
		if (snap.val() != null)
		{
			return snap.getKey();
		}								
	}
	catch (error) {
		alert("Se ha producido un error de en la gestión de " + table_name);
		console.error(error);
	}
}
// <!------------------- check relacion ---------------------->
async function bbdd_existe_relacion(table_name, campo_bd, valor_bd, campo2_bd, valor2_bd) {
	try {
		var query = dbRef.child("/" + table_name + "/")
			.orderByChild(campo_bd)
			.equalTo(valor_bd);

		var snap = await query.once("value");		
		return (snap.val()[campo2_bd] == valor2_bd ? false : true);
	}
	catch (error) {
		alert("Se ha producido un error de en la gestión de " + table_name);
		console.error(error);
	}
}
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

//-------------------------------------------
// Validación formato email con regex
// @param {*} email 
//-------------------------------------------
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//-----------------------------------
// Validación formato fecha con regex
// @param {*} fecha 
//-----------------------------------
function validateFecha(fecha) {
    var re = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
    return re.test(fecha);
}

//-------------------------------------------
// transforma cadena de fecha DD/MM/YYYY a YYYYMMDD
//-------------------------------------------
function date_japon(date_dd_mm_yyyy) {
    var dia = date_dd_mm_yyyy.substring(0, 2);
    var mes = date_dd_mm_yyyy.substring(3, 5);
    var anio = date_dd_mm_yyyy.substring(6, 10);
    return anio + mes + dia;
}
//-------------------------------------------
// borrar elementos de un option List
//-------------------------------------------
function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }