
// js para test html y amigos html

var $table = $('#table_admin');
var $table_amigos = $('#table_amigos');
var $remove = $('#remove');
var selections = [];
var tab_public_control = 'tab_aerolineas';

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
    }
});

// <----------------------------------------------->
// <--------------- ADMINISTRACION ---------------->
// <----------------------------------------------->

var tabs_pagina = ['tab_aerolineas', 'tab_aeropuertos', 'tab_aviones', 'tab_ciudades', 'tab_likes', 'tab_posts', 'tab_publicidad'
    , 'tab_rutas', 'tab_usuarios', 'tab_vuelos', 'tab_vuelospersonas'];

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
        $table.bootstrapTable('remove', {
            field: 'id',
            values: [row.id]
        })
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

async function pruebaTable() {
    /*
        var mydataSet = [];
        var queryUser = dbRef.child("users");
        var snap_user = await queryUser.orderByChild("dni").once("value");
    
        if (snap_user.val() != null) {
            snap_user.forEach((child) => {
                var fila_json = {
                    id: 999,
                    price: "$555",
                    key: child.key,
                    email: child.val().email,
                    lastname: child.val().lastname,
                    name: child.val().name,
                    pass: child.val().pass
                };
                mydataSet.push(fila_json);
            });
        }
    */
    let post_amigos = [];
    var queryAmigos = dbRef.child("amigos");
    queryAmigos.orderByChild("dni").on("child_added", snap_amigos => {

        var row = snap_amigos.val();
        //console.log(row.dni_amigo);
        let queryPosts = dbRef.child("posts").orderByChild("id_usuario").equalTo(row.dni_amigo);
        let join = queryPosts.once('value', snap_posts => {

            var row2 = snap_posts.val();
            //console.log(row2);
            post_amigos.push(row2);
        });
    });

    console.log("**********************");
    console.log(post_amigos);
    console.log("**********************");
}

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
        // aerolineas
        case 'tab_aerolineas':
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
                    field: 'codigo',
                    title: 'Código',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'nombre',
                    title: 'Nombre',
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
        // aviones
        case 'tab_aviones':
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
                    colspan: 6,
                    align: 'center'
                }],
                [{
                    field: 'codigo',
                    title: 'Código',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'modelo',
                    title: 'Modelo',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'codigoAerolinea',
                    title: 'ID Aerolinea',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'codigoRuta',
                    title: 'ID Ruta',
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
        // ciudades
        case 'tab_ciudades':
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
                    colspan: 6,
                    align: 'center'
                }],
                [{
                    field: 'nombre',
                    title: 'Nombre',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'cd',
                    title: 'C.P.',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'pais',
                    title: 'Pais',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'actividades',
                    title: 'Actividad',
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


        // rutas
        case 'tab_rutas':
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
                    field: 'codigo',
                    title: 'Código',
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
                    field: 'destino',
                    title: 'Destino',
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
            ]
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
// <--------------- configuración de captura de datos por tabla ---------------->
async function tab_table_config_data(tab_control) {

    var queryDB = null;
    var snap_query = null;
    var mydataSet = [];

    switch (tab_control) {
        case 'tab_aerolineas':
            queryDB = dbRef.child("aerolinea").orderByChild("codigo");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        codigo: child.val().codigo,
                        nombre: child.val().nombre,
                        isVuelo: child.val().isVuelo,
                        imagen: "..\\resources\\images\\user.png"
                    };
                    mydataSet.push(fila_json);
                });
            }
            break;
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
        case 'tab_aviones':
            queryDB = dbRef.child("vuelo").orderByChild("codigo");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        codigo: child.val().codigo,
                        modelo: child.val().modelo,
                        codigoAerolinea: child.val().codigoAerolinea,
                        codigoRuta: child.val().codigoRuta,
                        isVuelo: child.val().isVuelo
                    };
                    mydataSet.push(fila_json);
                });
            }
            break;
        case 'tab_ciudades':
            queryDB = dbRef.child("ciudad").orderByChild("nombre");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        actividades: child.val().actividades,
                        cd: child.val().cd,
                        nombre: child.val().nombre,
                        pais: child.val().pais,
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
        case 'tab_rutas':
            queryDB = dbRef.child("ruta").orderByChild("codigo");
            snap_query = await queryDB.once("value");
            if (snap_query.val() != null) {
                snap_query.forEach((child) => {
                    var fila_json = {
                        key: child.key,
                        codigo: child.val().codigo,
                        destino: child.val().destino,
                        isVuelo: child.val().isVuelo,
                        origen: child.val().origen
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
                return '<p> '+value.name+' '+value.lastname+'</p>'
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

