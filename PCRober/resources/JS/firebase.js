// Your web app's Firebase configuration
var config = {
	apiKey: "AIzaSyApTlbr5Gs7RqN4StqolYlE6THHMWrv12M",
	authDomain: "pruebafirebase-b91ce.firebaseapp.com",
	databaseURL: "https://pruebafirebase-b91ce.firebaseio.com",
	projectId: "pruebafirebase-b91ce",
	storageBucket: "pruebafirebase-b91ce.appspot.com",
	messagingSenderId: "120976204868",
	appId: "1:120976204868:web:a58127fa9fedc259104811",
	measurementId: "G-49E1TC4PW7"
};

// Initialize Firebase
firebase.initializeApp(config);




//FIREBASE
const dbRef = firebase.database().ref();

const db = firebase.database();

const storage = firebase.storage();
const storageRef = storage.ref();

var usuarioLogeado = new Object();

$(document).ready(async function () {
	var path = window.location.pathname;
	var page = path.split("/").pop();

	await getUsuario();

	switch (page) {
		case 'plantilla.html':
			initPrincipal();
			await carga_principal_muro();
			break;

		case 'admin.html':
			bs_input_file();			
			break;
			
		case 'publi.html':
			bs_input_file();
			break;
		default:
			break;
	}
	console.log("firebase.js ok!");

});

async function cargarMuro() {
	await getPublicidad();

	console.log("INICIO - Carga de publicidad");
	cargarPublicidad();
	console.log("FIN - Carga de publicidad");

	console.log("INICIO - Carga de post");
	await cargarPost();
	console.log("FIN - Carga de post");

	console.log("INICIO - Mostrar post");
	agregarPost();
	console.log("FIN - Mostrar post");
}

var varArrayPublicidad = [];

async function cargarPublicidad() {
	await cargarMuroPublicidadDerecha();
}

async function getPublicidad() {
	console.log("INICIO - Recuperar publicidad de BD");
	var queryPublicidad = dbRef.child("publicidad");

	for (var x = 0; x < usuarioLogeado.actividades.length; x++) {

		var snap_publi = await queryPublicidad.orderByChild("id_tipo_actividad").equalTo(usuarioLogeado.actividades[x]).once("value");
		if (snap_publi.val() != null) {

			snap_publi.forEach((child) => {
				varArrayPublicidad.push([child,
					false, false] //el booleano indicará si ya se ha mostrado la publicidad, el primero es para la publicidad del muro derecho y el segundo para la publicidad del muro central (versión movil)
				);
			});
		}
	}



	console.log("FIN - Recuperar publicidad de BD");
}

/** INICIO CREAR PUBLICIDAD MURO DERECHA - VERSION ORDENADOR */
function cargarMuroPublicidadDerecha() {
	for (var x = 0; x < 2 && x < varArrayPublicidad.length; x++) {
		var continuarWhile = true;
		do {
			var numAleatorio = Math.floor(Math.random() * varArrayPublicidad.length);

			if (!varArrayPublicidad[numAleatorio][1]) {
				//Comprobamos que el primer booleano del array es false, si es false todavía no está en uso

				var value = varArrayPublicidad[numAleatorio][0].val();
				var varStringPublicidad = crearPublicidadMuroCentral(false, varArrayPublicidad[numAleatorio][0].key, value.nombre_usuario, value.id_usuario, value.nombre_aeropuerto,
					value.comentario, value.carrousel);

				$('.muroDerecha .post').first().after(varStringPublicidad);

				varArrayPublicidad[numAleatorio][1] = true;
				continuarWhile = false;
			}
		} while (continuarWhile);
	}
}
/** FIN CREAR PUBLICIDAD MURO DERECHA - VERSION ORDENADOR */

/** INICIO CREAR PUBLICIDAD MURO CENTRAL - VERSION MOVIL */
var contadorPublicidadMuroCentral = 0;
function crearPublicidadMuro() {

	var stringReturn = "";

	do {
		var numAleatorio = Math.floor(Math.random() * varArrayPublicidad.length);

		console.log("numero aleatorio " + numAleatorio + " tamaño " + varArrayPublicidad.length);
		if (!varArrayPublicidad[numAleatorio][2]) {
			//Comprobamos que el primer booleano del array es false, si es false todavía no está en uso
			console.log("Entramos PUBLICIDAD MURO CENTRAL");
			var value = varArrayPublicidad[numAleatorio][0].val();
			stringReturn = crearPublicidadMuroCentral(true, varArrayPublicidad[numAleatorio][0].key, value.nombre_usuario, value.id_usuario, value.nombre_aeropuerto,
				value.comentario, value.carrousel);

			varArrayPublicidad[numAleatorio][2] = true;
			contadorPublicidadMuroCentral++;
			continuarWhile = false;
		}
	} while (continuarWhile);

	if (contadorPublicidadMuroCentral > (varArrayPublicidad.length / 2)) {
		// Si se han creado post de publicidad más veces que la mitad del tamaño del array entonces ponemos los valores a false del array de publicidad
		//de esta forma se consigue que a partir de ese numero se pueda repetir la publicidad otra vez pero además tardará menos en buscar un numero aleatorio no usado
		contadorPublicidadMuroCentral = 0;
		for (var x = 0; x < varArrayPublicidad.length; x++) {
			varArrayPublicidad[x][2] = false;
		}
	}

	return stringReturn;
}
/** FIN CREAR PUBLICIDAD MURO CENTRAL - VERSION MOVIL */

function crearPublicidad() {

	var array = [];
	array.push("imagen1");
	array.push("imagen2");

	var publicidad = {
		id_usuario: "123",
		comentario: "Las mejores pizzas del mundo",
		carrousel: array,
		hastag: "cualquiera",
		nombre_usuario: "Dominos pizza",
		nombre_aeropuerto: "Barajas (Madrid)",
		id_tipo_actividad: 1
	};

	/// => The user does not exist => CREATING USER
	var newPublicidad = dbRef.child("publicidad").push().key;

	// Write the new post´s data simultaeously in the posts list and the user´s post list
	var updates = {};
	updates["/publicidad/" + newPublicidad] = publicidad;

	var result = dbRef.update(updates);
	console.log(result);
}

function getStringHora() {
	var fullDate = new Date();
	var twoDigitHoras = fullDate.getHours() + "";
	if (twoDigitHoras.length == 1) {
		twoDigitHoras = "0" + twoDigitHoras;
	}

	var twoDigitMinut = fullDate.getMinutes() + "";
	if (twoDigitMinut.length == 1) {
		twoDigitMinut = "0" + twoDigitMinut;
	}

	var twoDigitSecond = fullDate.getSeconds() + "";
	if (twoDigitSecond.length == 1) {
		twoDigitSecond = "0" + twoDigitSecond;
	}

	var twoDigitMilis = fullDate.getMilliseconds() + "";
	if (twoDigitMilis.length == 1) {
		twoDigitMilis = "00" + twoDigitMilis;
	} else if (twoDigitMilis.length == 2) {
		twoDigitMilis = "0" + twoDigitMilis;
	}

	var currentDate = twoDigitHoras + fullDate.getMinutes() + fullDate.getSeconds() + fullDate.getMilliseconds();
	return currentDate;
}

function getStringFecha() {
	var fullDate = new Date();
	var mes = fullDate.getMonth() + 1;
	var twoDigitMonth = mes + "";
	if (twoDigitMonth.length == 1) {
		twoDigitMonth = "0" + twoDigitMonth;
	}
	var twoDigitDate = fullDate.getDate() + "";
	if (twoDigitDate.length == 1) {
		twoDigitDate = "0" + twoDigitDate;
	}
	var currentDate = fullDate.getFullYear() + twoDigitMonth + twoDigitDate;
	return currentDate;
}

function getFechatoBD(date) {
	var mes = date.getMonth() + 1;
	var twoDigitMonth = mes + "";
	if (twoDigitMonth.length == 1) {
		twoDigitMonth = "0" + twoDigitMonth;
	}
	var twoDigitDate = date.getDate() + "";
	if (twoDigitDate.length == 1) {
		twoDigitDate = "0" + twoDigitDate;
	}

	var twoDigitHoras = date.getHours() + "";
	if (twoDigitHoras.length == 1) {
		twoDigitHoras = "0" + twoDigitHoras;
	}

	var twoDigitMinut = date.getMinutes() + "";
	if (twoDigitMinut.length == 1) {
		twoDigitMinut = "0" + twoDigitMinut;
	}

	var twoDigitSecond = date.getSeconds() + "";
	if (twoDigitSecond.length == 1) {
		twoDigitSecond = "0" + twoDigitSecond;
	}

	var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + date.getFullYear() + " " + twoDigitHoras + ":" + twoDigitMinut + ":" + twoDigitSecond;
	return currentDate;
}

async function getUsuario() {

	var queryUser = dbRef.child("users");
	var snap_user = await queryUser.orderByChild("dni").equalTo("123").once("value");
	if (snap_user.val() != null) {
		var key = Object.keys(snap_user.val())[0];
		var val = Object.values(snap_user.val())[0];

		usuarioLogeado.dni = val.dni;
		usuarioLogeado.nombrePerfil = val.name + " " + val.lastname;
		usuarioLogeado.actividades = val.actividades;
		console.log("getUsuario() => usuarioLogeado.dni: " + usuarioLogeado.dni);
	} else {
		console.log("getUsuario() => Usuario no encontrado");
	}
}

async function carga_principal_muro() {

	var queryVuelosPers = dbRef.child("vuelos_personas");
	var queryVuelos = dbRef.child("vuelos");

	if (usuarioLogeado.dni != null) {

		//Cargar la imagen de perfil
		$(".imagenPerfil").attr("src", getImagenStorage(usuarioLogeado.dni + '/', 'perfil.png'));
		//Cargar nombre del usuario
		$('#nombrePerfil').text(usuarioLogeado.nombrePerfil);

		//Cargar los vuelos_personas del usuario logeado
		var snap_vuePer = await queryVuelosPers.orderByChild("dni_persona").equalTo(usuarioLogeado.dni).once("value");

		if (snap_vuePer.val() != null) {
			var mydataSet_vuePer = [];
			snap_vuePer.forEach((child) => {
				mydataSet_vuePer.push(child.val().id_vuelo);
			});

			usuarioLogeado.vuelosAsociados = [];

			for (i = 0; i < mydataSet_vuePer.length; i++) {
				console.log("carga_principal_muro() => Buscar los datos del vuelo " + mydataSet_vuePer[i]);
				//Cargamos los datos de los vuelos que tiene relacionados
				var snap_vuelos = await queryVuelos.orderByChild("id_vuelo").equalTo(mydataSet_vuePer[i]).once("value");

				if (snap_vuelos.val() != null) {
					var key_vuelos = Object.keys(snap_vuelos.val())[0];
					var val_vuelos = Object.values(snap_vuelos.val())[0];

					//Cargamos la lista del select del muro con los datos de los vuelos relacionados
					vuelosAsociados(val_vuelos.id_vuelo, val_vuelos.origen + " " + val_vuelos.fecha_salida, val_vuelos.destino + " " + val_vuelos.fecha_llegada);
					usuarioLogeado.vuelosAsociados.push(val_vuelos);
				} else {
					console.log("carga_principal_muro() => El vuelo con id " + mydataSet_vuePer[i] + " no existe en BD");
				}
			}

		} else {
			console.log("carga_principal_muro() => El usuario no tiene vuelos relacionados");
		}

		cargarAmigos();

		cargarMuro();

		console.log("fin carga_principal_muro");
	}
	else {
		console.log("carga_principal_muro() => Usuario no encontrado");
	}
}


var mydataSet_amigos = [];
async function cargarAmigos() {

	var queryAmigos = dbRef.child("amigos");
	var snap_amigos = await queryAmigos.orderByChild("dni").equalTo(usuarioLogeado.dni).once("value");
	mydataSet_amigos.push(usuarioLogeado.dni);
	if (snap_amigos.val() != null) {
		console.log("cargarPost => hay post con ese dni");
		// paso 1: añadimos los resultados en un array        
		snap_amigos.forEach((child) => {
			mydataSet_amigos.push(child.val().dni_amigo);
		});
	}
}

function vuelosAsociados(valor, origen, destino) {
	$('#selectVuelosComentario').append('<option value="' + valor + '">' + origen + ' - ' + destino + '</option>');
}

/**
	METODO PARA DEVOLVER LA URL DE UNA IMAGEN GUARDADA EN EL STORAGE
	@CARPETA - SERÁ LA RUTA DONDE ESTE LA IMAGEN, LA RUTA INICIAL EMPIEZA EN LA CARPETA 'IMAGES'
	@NOMBREIMAGEN - NOMBRE DE LA IMAGEN A BUSCAR EN DICHA CARPETA
*/
function getImagenStorage(carpeta, nombreImagen) {
	var separarCarpeta = "%2F";
	var stringHost = "https://firebasestorage.googleapis.com/v0/b/pruebafirebase-b91ce.appspot.com/o/images" + separarCarpeta;


	var carpetaRemplazada = carpeta.replace("/", separarCarpeta);

	var urlReturn = stringHost + carpetaRemplazada + nombreImagen + "?alt=media";


	return urlReturn;
}

function upload() {
	var files = $('#inputFileImagen')[0].files;
	var array = new Array(files.length);
	for (var i = 0, f; f = files[i]; i++) {
		console.log(f.name);
		var carpeta = '/images/' + usuarioLogeado.dni + '/' + getStringFecha();
		var extension = f.name.split('.').pop();
		var nuevoNombre = getStringHora() + "." + extension;
		console.log("El archivo " + f.name + " ahora se llama " + nuevoNombre);
		uploadImageAsPromise(carpeta, f, nuevoNombre);

		var separarCarpeta = "%2F";
		array[i] = 'images' + separarCarpeta + usuarioLogeado.dni + separarCarpeta + getStringFecha() + separarCarpeta + nuevoNombre;
	}

	return array;

}

//Handle waiting to upload each file using promise
function uploadImageAsPromise(carpeta, imageFile, nombreFile) {
	return new Promise(function (resolve, reject) {
		var storageRef = firebase.storage().ref(carpeta + '/' + nombreFile);

		//Upload file
		var task = storageRef.put(imageFile);

	});
}

async function crearPost(varComentario) {
	$('.muroComentario #messagesComentario').css('display', 'none');

	if (varComentario == "") {
		$('.muroComentario #messagesComentario').css('display', 'block');
		$('.muroComentario #contenidoMensaje').html("<b>ERROR:</b> Es obligatorio escribir algún <u>comentario</u>.");
	} else {

		var varCarrousel = upload();

		var id_vuelo = $("#selectVuelosComentario").val();
		var varSalida = "";
		var varRetrasoSalida = false;
		var varDestino = "";
		var varRetrasoDestino = false;

		if (id_vuelo != 'Ninguno') {

			for (var x = 0; x < usuarioLogeado.vuelosAsociados.length; x++) {
				if (id_vuelo == usuarioLogeado.vuelosAsociados[x].id_vuelo) {
					varSalida = usuarioLogeado.vuelosAsociados[x].origen + " " + usuarioLogeado.vuelosAsociados[x].fecha_salida;
					varRetrasoSalida = usuarioLogeado.vuelosAsociados[x].retrasoSalida;
					varDestino = usuarioLogeado.vuelosAsociados[x].destino + " " + usuarioLogeado.vuelosAsociados[x].fecha_llegada;
					varRetrasoDestino = usuarioLogeado.vuelosAsociados[x].retrasoLlegada;
				}
			}
		}

		var varUrlImgPerfil = getImagenStorage(usuarioLogeado.dni + '/', 'perfil.png');
		var varNomUser = usuarioLogeado.nombrePerfil;
		var dt = new Date();
		var varFechaComentario = formatDate(dt);
		var varContComent = 0;

		var varContMG = 0;
		var varMeGustaUsuarioLogeado = false;;
		var varIdLikeUsuario = null;

		var post = {
			id_usuario: usuarioLogeado.dni,
			contenido: varComentario,
			fecha_post: getFechatoBD(dt),
			hastag: "pruebaSocial",
			nombreUsuario: varNomUser,
			salida: varSalida,
			retrasoSalida: varRetrasoSalida,
			destino: varDestino,
			retrasoDestino: varRetrasoDestino,
			contMG: varContMG,
			contComment: varContComent,
			carrousel: varCarrousel
		};

		/// => The post does not exist => CREATING post
		var newPosts = dbRef.child("posts").push().key;
		console.log("KEY: " + newPosts);
		// Write the new post´s data simultaeously in the posts list and the post´s post list
		var updates = {};
		updates["/posts/" + newPosts] = post;

		var result = dbRef.update(updates);
		console.log(result);

		console.log("PRUEBA FECHA: " + varFechaComentario);

		crearPostHTML(newPosts, varComentario, varUrlImgPerfil, varNomUser, usuarioLogeado.dni, varSalida, varRetrasoSalida,
			varDestino, varRetrasoDestino, varFechaComentario, varContMG, varContComent, varCarrousel, varMeGustaUsuarioLogeado, varIdLikeUsuario, false);


		$("#selectVuelosComentario").val('Ninguno');
		$('button.btn-reset').click();
	}
}

var mydataSet_post = [];
var mostrarPost = 5;
var varContadorPost = 0;

//Metodo para agregar los post que hay en el array de post al final del muro
async function agregarPost() {
	var refLikes = dbRef.child("likes");

	for (var x = 1; x <= mostrarPost && varContadorPost < mydataSet_post.length; x++) {
		console.log("Contenido: " + mydataSet_post[varContadorPost].val().contenido);


		var id_post_buscar = mydataSet_post[varContadorPost].key;

		//Variables para utilizar del post
		var varSalida = mydataSet_post[varContadorPost].val().destino;
		var varRetrasoSalida = mydataSet_post[varContadorPost].val().retrasoDestino;
		var varDestino = mydataSet_post[varContadorPost].val().salida;
		var varRetrasoDestino = mydataSet_post[varContadorPost].val().retrasoSalida;
		var varUrlImgPerfil = getImagenStorage(mydataSet_post[varContadorPost].val().id_usuario + '/', 'perfil.png');
		var varNomUser = mydataSet_post[varContadorPost].val().nombreUsuario;
		var varIdUsuario = mydataSet_post[varContadorPost].val().id_usuario;
		var varFechaComentario = mydataSet_post[varContadorPost].val().fecha_post;
		var varContComent = mydataSet_post[varContadorPost].val().contComment;
		var varCarrousel = mydataSet_post[varContadorPost].val().carrousel;
		var varComentario = mydataSet_post[varContadorPost].val().contenido;
		var varContMG = 0;
		var varMeGustaUsuarioLogeado = false;
		var varIdLikeUsuario = null;

		var snap_likes = await refLikes.orderByChild("id_post").equalTo(id_post_buscar).once("value");

		if (snap_likes.val() != null) {
			varContMG = Object.values(snap_likes.val()).length;

			snap_likes.forEach((child) => {
				if (child.val().id_usuario == usuarioLogeado.dni) {
					varMeGustaUsuarioLogeado = true;
					varIdLikeUsuario = child.key;
				}
			});
		}

		console.log("LIKE: " + varMeGustaUsuarioLogeado + ", ID: " + varIdLikeUsuario);

		crearPostHTML(mydataSet_post[varContadorPost].key, varComentario, varUrlImgPerfil, varNomUser, varIdUsuario, varSalida, varRetrasoSalida,
			varDestino, varRetrasoDestino, varFechaComentario, varContMG, varContComent, varCarrousel, varMeGustaUsuarioLogeado, varIdLikeUsuario, true);

	}

	if (varContadorPost >= mydataSet_post.length) {
		$('#muroCargarMas').addClass("d-none");
	}

}

async function cargarPost() {

	for (var x = 0; x < mydataSet_amigos.length; x++) {
		console.log("Amigo: " + mydataSet_amigos[x]);
		var queryPosts = dbRef.child("posts").orderByChild("id_usuario").equalTo(mydataSet_amigos[x]);


		var snap_posts = await queryPosts.once("value");

		if (snap_posts.val() != null) {
			console.log("cargarPost => hay post con ese dni");
			// paso 1: añadimos los resultados en un array        
			snap_posts.forEach((child) => {
				mydataSet_post.push(child);
			});
		}
	}

	mydataSet_post.sort(compararArrayPost);

}

function crearComentario(varTextoComentario) {

	$('#modalComent #messagesComentario').css('display', 'none');

	if (varTextoComentario == "") {
		$('#modalComent #messagesComentario').css('display', 'block');
		$('#modalComent #messagesComentario #contenidoMensaje').html("<b>ERROR:</b> Es obligatorio escribir algún <u>comentario</u>.");
	} else {
		var varUrlImgPerfil = getImagenStorage(usuarioLogeado.dni + '/', 'perfil.png');
		var varNomUser = usuarioLogeado.nombrePerfil;

		var dt = new Date();
		var varFechaComentario = getFechatoBD(dt);


		var comentario = {
			id_usuario: usuarioLogeado.dni,
			contenido: varTextoComentario,
			fecha_comentario: varFechaComentario,
			nombreUsuario: varNomUser,
			id_post: idPostComentarios
		};

		var newComentario = dbRef.child("comentarios").push().key;
		console.log("KEY: " + newComentario);

		var updates = {};
		updates["/comentarios/" + newComentario] = comentario;

		var result = dbRef.update(updates);
		console.log(result);

		crearComentarioHTML(newComentario, varTextoComentario, usuarioLogeado.dni, varNomUser, varUrlImgPerfil, varFechaComentario);
	}
}

async function cargarComentarios(idPost) {
	var queryComent = dbRef.child("comentarios").orderByChild("id_post").equalTo(idPost);
	console.log("Buscar comentarios de " + idPost);

	var snap_coment = await queryComent.once("value");
	var mydataSet_coment = [];

	if (snap_coment.val() != null) {
		snap_coment.forEach((child) => {
			mydataSet_coment.push(child);
		});
	}

	for (var x = 0; x < mydataSet_coment.length; x++) {
		var idComent = mydataSet_coment[x].key;
		var varTextoComentario = mydataSet_coment[x].val().contenido;
		var varIdUsuario = mydataSet_coment[x].val().id_usuario;
		var varNomUser = mydataSet_coment[x].val().nombreUsuario;
		var varUrlImgPerfil = getImagenStorage(mydataSet_coment[x].val().id_usuario + '/', 'perfil.png');
		var varFechaComentario = mydataSet_coment[x].val().fecha_comentario;

		console.log("Contenido comentario: " + varTextoComentario);

		crearComentarioHTML(idComent, varTextoComentario, varIdUsuario, varNomUser, varUrlImgPerfil, varFechaComentario);
	}
}


function agregarMeGusta(idPost) {

	var dt = new Date();

	var like = {
		id_usuario: usuarioLogeado.dni,
		id_post: idPost,
		fecha_like: getFechatoBD(dt)
	};

	var newLike = dbRef.child("likes").push().key;
	console.log("KEY: " + newLike);

	var updates = {};
	updates["/likes/" + newLike] = like;

	var result = dbRef.update(updates);
	console.log(result);
}

function eliminarMeGusta(idLike) {
	var ref = dbRef.child("/likes/" + idLike);

	ref
		.remove()
		.then(function () {
			console.log("Se ha eliminado el like del usuario correctamente");
		})
		.catch(function (error) {
			console.log("Remove failed: " + error.message);
		});

}


function borrarPost(varIdPost) {


	var ref = dbRef.child("/posts/" + varIdPost);

	ref
		.remove()
		.then(function () {

			//Mensaje de correcto
			$("#" + varIdPost).remove();
			return true;
		})
		.catch(function (error) {
			console.log("Remove failed: " + error.message);
			return false;
		});


}