// <!--------------------------------------- Referencias ------------------------------------------>
// https://firebase.google.com/docs/auth/web/manage-users
// https://firebase.google.com/docs/auth/web/password-auth
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithEmailAndPassword

// <!--------------------------------------- RUNUP BASE DATOS ------------------------------------------>
if (!firebase.apps.length) {
   firebase.initializeApp({
		apiKey: "AIzaSyDxV4yqlAmYT8tw8LqTtYlMQngYs10795o",
		authDomain: "pcsocialfly.firebaseapp.com",
		databaseURL: "https://pcsocialfly.firebaseio.com",
		projectId: "pcsocialfly",
		storageBucket: "pcsocialfly.appspot.com",
		messagingSenderId: "504886406716",
		appId: "1:504886406716:web:cfa353851c80e9b1625d39",
		measurementId: "G-9K0EP0RX5E"
	});
}

//firebase.analytics();

// <!--------------------------------------- VARIABLES ------------------------------------------>

const dbRef = firebase.database().ref();
const db = firebase.database();

const storage = firebase.storage();
const storageRef = storage.ref();


var usuarioLogeado; //variable que almacena todos los datos del usuario logeado

//variables de querys
var queryUser = dbRef.child("users");
var queryVuelos = dbRef.child("vuelos");
var queryAmigos = dbRef.child("amigos");


// <!--------------------------------------- PABLO ANTONIO ------------------------------------------>

// <!--------------------------------------- RUN UP - Acceso ------------------------------------------>

// var user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(async function(user) {
	if (!user && window.location.href != "https://pcsocialfly.web.app/pages/acceso.html") 
	//if(false)
	{
		window.location.href = "https://pcsocialfly.web.app/pages/acceso.html";
	}
	else if (!user)
	//else if(false)
	{
		//no hacer nada
	}
	else
	{
		//<!----------------------------------------->
		//<!--------------------------------------------------------------------------------->
		// AQUI SE RECOGE EL USUARIO QUE ESTA LOGUEADO
		//<!--------------------------------------------------------------------------------->
		//<!----------------------------------------->		
		
		
		usuarioLogeado = await getUsuarioPorUid(user.uid);
		//usuarioLogeado = await getUsuarioPorUid("jKJklhgKFyVeeopT3GRQhDeFZhc2");
		
		waitForGlobal("usuarioLogeado", function() {	
			// usuarioLogeado.fecha_visita = now;
			//TODO LO QUE VAYA ANTES DE ESTO QUE SE APLIQUE A USUARIOLOGEADO SE VA A GUARDAR EN TABLA
			editarUsuario(usuarioLogeado); //actualizar fecha ultima visita
			
			//LO QUE VA DESPUES DE ESTO NO SE GUARDA EN BD SOLO EN MEMORIA		
			usuarioLogeado.nombrePerfil = usuarioLogeado.nombre + " " + usuarioLogeado.apellidos;
			
			//Esta parte se encarga de escuchar en todo momento si tienes una notificacion a tu nombre
			dbRef.child("notificaciones").on("child_added", snap => {
				if (snap.val() != null) {
					if(snap.val().id_usuario == usuarioLogeado.uid && !snap.val().leido){
						incrementarNotificacion();
					}
				}

			});
			
			//Evento para el buscador
			$('#search').on('keypress', function(e) {
				if(e.which == 13) {           
					buscadorMenu();
				}
			});
			
			//Evento para el buscador movil
			$('#inputSearchMovil').on('keypress', function(e) {
				if(e.which == 13) {           
					buscadorMenuMovil();
				}
			});
			
			
		});
	}
});



async function getUsuarioPorUid(uidParametro)
{
	var today = new Date(); 
	var now = today.getDate()  + '/' + (today.getMonth()+1) + '/' +today.getFullYear();
	
	const query = dbRef.child('users').orderByChild('uid').equalTo(uidParametro);
	await query.once('value',snapshot => 
	{
		if (snapshot.val() != null)
		{
			var key = Object.keys(snapshot.val())[0];  
			var val = Object.values(snapshot.val())[0]; 
			user =
			{
				uid:val.uid,
				email:val.email,
				id_rol:val.id_rol,
				fecha_registro:val.fecha_registro,
				fecha_visita:now,
				nombre:val.nombre,
				apellidos:val.apellidos,
				tlf_movil:val.tlf_movil,
				google: val.google,
				avatarURL: val.avatarURL
			};
			if (val.actividades != null)
			{
				user.actividades = val.actividades;
			}
		}
	});
	return user;
}


// <!--------------------------------------- Eventos ------------------------------------------>


// <!------------------- Esperar a variables ---------------------->
var waitForGlobal = function(key, callback)
{
	if (window[key])
	{
		callback();
	} else
	{
		setTimeout(function()
		{
			waitForGlobal(key, callback);
		}, 100);
	}
};

// Salir de la session
$('.logOut').unbind('click').click(function () {
	// FirebaseAuth.getInstance().signOut();
	
	firebase.auth().signOut().then(function() {
		// alert('Deslogueado');
	}).catch(function(error) {
		alert('Error al intentar desloguear');
	});
	
	window.location.href = "https://pcsocialfly.web.app/pages/acceso.html";
});


function comprobarRolNavbar()
{
	if (usuarioLogeado.id_rol == 0) //admin
	{
		
	}
	else
	{
		$('.adminitracionEnlace').remove();
	}
	if (usuarioLogeado.id_rol < 3) //aeropuerto, empresa
	{
		
	}	
	else
	{
		$('.publiEnlace').remove();
	}
}
// <!--------------------------------------- FUNCIONES ------------------------------------------>


// <!------------------- Meter actividad al user ---------------------->
//RELLENANDO CASILLAS
// async function meterActividad(idActividad)
// {
	// if (usuarioLogeado.actividades != null)
	// {
		// var noEstaMetido = true;
		// for (var i = 0; i < Object.keys(usuarioLogeado.actividades).length; i++)
		// {
			// if (usuarioLogeado.actividades[i] == idActividad)
			// {
				// noEstaMetido = false;
				// i = usuarioLogeado.actividades.length; //salir del bucle
			// }
		// }
		// if (noEstaMetido)
		// {
			// var metido = false;
			// for (var i = 0; i < Object.keys(usuarioLogeado.actividades).length; i++)
			// {
				// if (usuarioLogeado.actividades[i] == null)
				// {
					// metido = true;
					// usuarioLogeado.actividades[i] = idActividad;
					// i = Object.keys(usuarioLogeado.actividades).length;
				// }
			// }
			// if (!metido)
			// {
				// usuarioLogeado.actividades[Object.keys(usuarioLogeado.actividades).length] = idActividad;
			// }	
		// }		
	// }
	// else
	// {
		// usuarioLogeado.actividades = {
			// 0: idActividad
		// };
	// }
// }

// <!------------------- Meter actividades al usuario ---------------------->
async function meterActividad(idActividad)
{
	if (usuarioLogeado.actividades != null)
	{
		var noEstaMetido = true;
		for (var i = 0; i < Object.keys(usuarioLogeado.actividades).length; i++)
		{
			if (usuarioLogeado.actividades[i] == idActividad)
			{
				noEstaMetido = false;
				i = usuarioLogeado.actividades.length; //salir del bucle
			}
		}
		if (noEstaMetido)
		{
			usuarioLogeado.actividades[Object.keys(usuarioLogeado.actividades).length] = idActividad;
		}		
	}
	else
	{
		usuarioLogeado.actividades = {
			0: idActividad
		};
	}
}

// <!------------------- Agregar amigos ---------------------->
function agregarAmigo(uid_usuario, uid_amigo){
	var new_row = {
		uid: uid_usuario,
		uid_amigo: uid_amigo
	};

	bbdd_insert("amigos", new_row);	
}

	
// <!------------------- Borrar Amigos ---------------------->
async function borrarAmigo(uid_usuario, uid_amigo){
	//tengo que sacar la key de la relacion
	var llave = await bbdd_getKeyRelacion('amigos', 'uid', uid_usuario, 'uid_amigo', uid_amigo);					
	//borrar la key
	bbdd_delete('amigos', llave);
	
}

// <!------------------- Quitar actividad al user ---------------------->
async function borrarActividad(idBorrar)
{
	if('actividades' in usuarioLogeado)
	{
		for (var x = 0; x < Object.keys(usuarioLogeado.actividades).length; x++)
		{
			if (usuarioLogeado.actividades[x] == idBorrar)
			{
				delete usuarioLogeado.actividades[x];
			}
		}
		
		
		var actAux = new Object();
		for (var x = 0, p = 0; x <= Object.keys(usuarioLogeado.actividades).length; x++)
		{
			if (usuarioLogeado.actividades[x] != null) 
			{
				actAux[p] = usuarioLogeado.actividades[x];
				p++;
			}
		}
		usuarioLogeado.actividades = actAux;
	}
}

// <!------------------- Getter rol ---------------------->
async function getRol(id)
{
	const query = dbRef.child('roles').orderByChild('id_rol').equalTo(id);
	var nombreRolReturn;
	await query.once('value',snapshot => 
	{
		if (snapshot.val() != null)
		{
			var key = Object.keys(snapshot.val())[0];  
			var val = Object.values(snapshot.val())[0]; 
			nombreRolReturn = val.nombre;
		}
	});
	return nombreRolReturn;
}

// <!------------------- funcion irPerfilUid ---------------------->
function irPerfilUid(uidPar)
{
	if(uidPar != usuarioLogeado.uid){
		sessionStorage.clear();
		sessionStorage.setItem("uid_busqueda", uidPar);
	}
	window.location.href = "https://pcsocialfly.web.app/pages/perfil.html";
}


// <!------------------- Subir avatar de usuario ---------------------->
function subirAvatar(file, user)
{
	usuarioLogeado = user;
	
	var reference = storageRef.child('/images/' + usuarioLogeado.uid + '/perfil.png');
	// console.log(reference);
	var task = reference.put (file);
	
	task.on(
	firebase.storage.TaskEvent.STATE_CHANGED,
    null,
    null,
    async function() {
      var nuevaURL = "https://firebasestorage.googleapis.com/v0/b/pcsocialfly.appspot.com/o/images%2F" + usuarioLogeado.uid + "%2Fperfil.png?alt=media";
		usuarioLogeado.avatarURL = nuevaURL;
		await editarUsuario(usuarioLogeado);
		alert('Avatar subido con exito');
		window.location.href = "https://pcsocialfly.web.app/pages/perfil.html";
    });	
}

// <!------------------- funcion sleep ---------------------->
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// <!------------------- Crear user ---------------------->
async function crearUser(newUser)
{
	const query = dbRef.child('users').orderByChild('uid').equalTo(newUser.uid);
	// var exists = false;
	await query.once('value',snapshot => 
	{
		if (snapshot.val() != null)
		{
			console.log("Ya tiene fila");
		}
		else
		{
			var newUsers = dbRef.child("users").push().key;
			var updates = {};
			updates["/users/" + newUsers] = newUser;
				
			var result = dbRef.update(updates);
			// console.log(result);
			console.log("TablaAdherida creada");
		}				
	});
}


// <<!------------------- LOGIN / REGISTRO ---------------------->
//Lo que carga el usuario no es esto!
function login(tipo) {
	async function nuevoLogin(usuarioLog) {
		if (usuarioLog) 
		{
			var today = new Date(); 
			var now = today.getDate()  + '/' + (today.getMonth()+1) + '/' +today.getFullYear();
			var ggle = 0;

			
			avatarURL = "https://firebasestorage.googleapis.com/v0/b/pcsocialfly.appspot.com/o/images%2Fguest.png?alt=media&token=5d6ca216-e16c-45c6-9adb-15c38342763e";
			
			if (usuarioLog.providerData[0].providerId.startsWith("google"))
			{
				ggle = 1;
				avatarURL = usuarioLog.photoURL;
			}
			
			const newUser =
			{
				uid:usuarioLog.uid,
				email:usuarioLog.email,
				id_rol:3,
				fecha_registro:now,
				fecha_visita: now,				
				nombre:" ",
				apellidos:" ",
				tlf_movil:" ",
				avatarURL: avatarURL,
				google: ggle
			};
			
			await crearUser(newUser);
			// await sleep(1000);
			alert('Login confirmado'); //esto esta para esperar la creaci�n mas que otra cosa
			window.location.href = "https://pcsocialfly.web.app/pages/perfil.html";
		}
		else if (tipo == "google") 
		{
			var provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().signInWithPopup(provider)
			.then(function(result) 
			{
				var token = result.credential.accessToken;
				usuarioLog = result.user;
			}).catch(function(error) 
			{
				alert('Error a la hora de enlazar');
			});;
		}
		else 
		{
			firebase.auth().signInWithEmailAndPassword(document.getElementById("mailLogIn").value, document.getElementById("passLogIn").value)
			.then(function(result) 
			{
				var token = result.credential.accessToken;
				usuarioLog = result.user;
			}).catch(error => {
				if (error.code == 'auth/user-not-found')
				{
					alert(`El correo${document.getElementById("mailLogIn").value} no esta registrado`);
				}
				else if (error.code == 'auth/wrong-password')
				{
					alert(`Contrase�a erronea o el correo esta registrado desde otro proveedor`);
				}
				else
				{
					// alert(error.message);
				}
			});	
		}
	}
	firebase.auth().onAuthStateChanged(nuevoLogin);
}

// <!------------------- Update usuarios ---------------------->
async function editarUsuario(userUpdate)
{
	var query = dbRef.child('/users/').orderByChild('uid').equalTo(usuarioLogeado.uid);
	await query.once ('value', snapshot =>
	{
		if (snapshot.val() != null)
		{
			var key = Object.keys(snapshot.val())[0];
			snapshot.ref.child(key).set(userUpdate);
		}
	});
}

// <!------------------- resetear contrase�a ---------------------->

function resetPass(mail)
{	
	firebase.auth().sendPasswordResetEmail(mail).then(function() {
		alert(`Email de resteo de contrase�a enviado a ${mail}`);
	}).catch(function(error) {
		alert('Error al enviar, es posible que el correo no exista');
	});
}


// <!--------------------------------------- Registro ------------------------------------------>
function registroUser()
{	
	//Comprobar acepto terminos y condiciones
	if (document.getElementById("terminos").checked == false)
	{
		alert("Tienes que aceptar los terminos de registro");
	}
	
	//Comprobar pass repetida
	if (!(document.getElementById("pass").value == document.getElementById("repitePass").value))
	{
		alert("Las contrase�as son diferentes");	
	}	

	if (document.getElementById("pass").value.length < 6)
	{
		alert("Las contrase�as deben tener al menos 6 caracteres");	
	}
	
	
	firebase.auth().createUserWithEmailAndPassword(document.getElementById("mail").value, document.getElementById("pass").value)
		.then(function(result) {
			alert('Registrado con exito');
			$('#modalRegistro').modal('hide');
		}).catch(error => {
			if (error.code == 'auth/email-already-in-use')
			{
				alert(`El correo${document.getElementById("mail").value} ya existe`);
			}
			else if (error.code == 'auth/invalid-email')
			{
				alert(`El correo ${document.getElementById("mail").value} es invalido`);
			}
			else if (error.code == 'auth/operation-not-allowed')
			{
				alert(`No se puedo registrar`);
			}
			else if (error.code == 'auth/weak-password')
			{
				alert('La contrase�a no es suficientemente fuerte, al menos 6 caracteres necesarios');
			}
			else
			{
				alert(error.message);
			}
		});
}


// <!--------------------------------------- SERGIO Y ROBER ------------------------------------------>
// var usuarioLogeado = new Object();

async function cargarPantalla(){
	var path = window.location.pathname;
	var page = path.split("/").pop();

	// await getUsuario();
		
	switch (page) {
		// case 'index.html':			
			// break;

		case 'admin.html':
			bs_input_file();		
			manage_master_tab(master_tab_public_control);			
			break;
		case 'amigos.html':
			load_amigos_table();
			break;
		case 'vuelos.html':
			load_vuelos_table();
			break;			
		case 'publi.html':
			bs_input_file();
			load_data_publi();
			break;
		case 'publicidad.html':
			load_publicidad();
			break;
		case 'notificaciones.html':
			load_notificaciones();
			break;
		case 'busqueda.html':
			load_busqueda();
			break;
		default:
			initPrincipal();
			await carga_principal_muro();
			break;
	}
	console.log("firebase.js ok!");

}

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
	//PRUEBA
}

async function getPublicidad() {
	console.log("INICIO - Recuperar publicidad de BD");
	var queryPublicidad = dbRef.child("publicidad");
	
	if(usuarioLogeado.actividades == null){
		var queryActividad = dbRef.child("actividades");
		var snap_actividades = await queryActividad.orderByChild("id_actividad").once("value");
		if (snap_actividades.val() != null) {
			var arrayActividades = [];
			
			snap_actividades.forEach((child) => {
				arrayActividades.push(child.val().id_actividad);
			});
			
			usuarioLogeado.actividades = arrayActividades;
		}
		
		
	}

	for (var x = 0; x < usuarioLogeado.actividades.length; x++) {

		var snap_publi = await queryPublicidad.orderByChild("id_tipo_actividad").equalTo(String(usuarioLogeado.actividades[x])).once("value");
		if (snap_publi.val() != null) {

			snap_publi.forEach((child) => {
				varArrayPublicidad.push([child,
					false, false] //el booleano indicar� si ya se ha mostrado la publicidad, el primero es para la publicidad del muro derecho y el segundo para la publicidad del muro central (versi�n movil)
				);
			});
		}
	}



	console.log("FIN - Recuperar publicidad de BD");
}

/** INICIO CREAR PUBLICIDAD MURO DERECHA - VERSION ORDENADOR */
function cargarMuroPublicidadDerecha() {
	for (var i = 0; i < 2 && i < varArrayPublicidad.length; i++) {
		var continuarWhile = true;
		do {
			var numAleatorio = Math.floor(Math.random() * varArrayPublicidad.length);

			if (!varArrayPublicidad[numAleatorio][1]) {
				//Comprobamos que el primer booleano del array es false, si es false todav�a no est� en uso

				//Cargar media
				var varMedia = 0;
				if(varArrayPublicidad[numAleatorio][0].val().votos != null){
					var contador5 = 0;
					var contador4 = 0;
					var contador3 = 0;
					var contador2 = 0;
					var contador1 = 0;
					var contador0 = 0;
					
					for(var x = 0; x < varArrayPublicidad[numAleatorio][0].val().votos.length; x++){
						var puntuacion = varArrayPublicidad[numAleatorio][0].val().votos[x].puntuacion;
						
						switch (puntuacion){
							case 5 :
								contador5 ++;
								break;
							case 4 :
								contador4 ++;
								break;
							case 3 :
								contador3 ++;
								break;
							case 2 :
								contador2 ++;
								break;
							case 1 :
								contador1 ++;
								break;
							case 0 :
								contador0 ++;
								break;
						}
					}
					
					varMedia = ( (contador5 * 5) + (contador4 * 4) +(contador3 * 3) + (contador2 * 2)  + (contador1 * 1) ) / (contador0 + contador1 + contador2 + contador3 + contador4 + contador5);
				}


				var value = varArrayPublicidad[numAleatorio][0].val();
				var varStringPublicidad = crearPublicidadMuroCentral(false, varArrayPublicidad[numAleatorio][0].key, value.nombre_usuario, value.id_usuario, value.nombre_aeropuerto,
					value.comentario, value.carrousel, varMedia);

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

		console.log("numero aleatorio " + numAleatorio + " tama�o " + varArrayPublicidad.length);
		if (!varArrayPublicidad[numAleatorio][2]) {
			//Comprobamos que el primer booleano del array es false, si es false todav�a no est� en uso
			console.log("Entramos PUBLICIDAD MURO CENTRAL");
			var value = varArrayPublicidad[numAleatorio][0].val();
			
			//Cargar media
			var varMedia = 0;
			if(varArrayPublicidad[numAleatorio][0].val().votos != null){
				var contador5 = 0;
				var contador4 = 0;
				var contador3 = 0;
				var contador2 = 0;
				var contador1 = 0;
				var contador0 = 0;
				
				for(var x = 0; x < varArrayPublicidad[numAleatorio][0].val().votos.length; x++){
					var puntuacion = varArrayPublicidad[numAleatorio][0].val().votos[x].puntuacion;
					
					switch (puntuacion){
						case 5 :
							contador5 ++;
							break;
						case 4 :
							contador4 ++;
							break;
						case 3 :
							contador3 ++;
							break;
						case 2 :
							contador2 ++;
							break;
						case 1 :
							contador1 ++;
							break;
						case 0 :
							contador0 ++;
							break;
					}
				}
				
				varMedia = ( (contador5 * 5) + (contador4 * 4) +(contador3 * 3) + (contador2 * 2)  + (contador1 * 1) ) / (contador0 + contador1 + contador2 + contador3 + contador4 + contador5);
			}
			
			stringReturn = crearPublicidadMuroCentral(true, varArrayPublicidad[numAleatorio][0].key, value.nombre_usuario, value.id_usuario, value.nombre_aeropuerto,
				value.comentario, value.carrousel, varMedia);

			varArrayPublicidad[numAleatorio][2] = true;
			contadorPublicidadMuroCentral++;
			continuarWhile = false;
		}
	} while (continuarWhile);

	if (contadorPublicidadMuroCentral > (varArrayPublicidad.length / 2)) {
		// Si se han creado post de publicidad m�s veces que la mitad del tama�o del array entonces ponemos los valores a false del array de publicidad
		//de esta forma se consigue que a partir de ese numero se pueda repetir la publicidad otra vez pero adem�s tardar� menos en buscar un numero aleatorio no usado
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

	// Write the new post�s data simultaeously in the posts list and the user�s post list
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

//solo se usa en las paginas de roberto y no tengo muy claro como
async function getUsuario() {

	var queryUser = dbRef.child("users");
	var snap_user = await queryUser.orderByChild('uid').equalTo(usuarioLogeado.uid).once("value");
	if (snap_user.val() != null) {
		var key = Object.keys(snap_user.val())[0];
		var val = Object.values(snap_user.val())[0];

		usuarioLogeado.nombrePerfil = val.name + " " + val.lastname;
		usuarioLogeado.actividades = val.actividades;
		console.log("getUsuario() => usuarioLogeado.uid: " + usuarioLogeado.uid);
	} else {
		console.log("getUsuario() => Usuario no encontrado");
	}
}

async function carga_principal_muro() {

	var queryVuelosPers = dbRef.child("vuelos_users");
	var queryVuelos = dbRef.child("vuelos");

	if (usuarioLogeado.uid != null) {

		//Cargar la imagen de perfil
		$(".imagenPerfil").attr("src", usuarioLogeado.avatarURL);
		//Cargar nombre del usuario
		$('#nombrePerfil').text(usuarioLogeado.nombrePerfil);

		//Cargar los vuelos_personas del usuario logeado
		var snap_vuePer = await queryVuelosPers.orderByChild("uid").equalTo(usuarioLogeado.uid).once("value");

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
	var snap_amigos = await queryAmigos.orderByChild("uid").equalTo(usuarioLogeado.uid).once("value");
	mydataSet_amigos.push(usuarioLogeado.uid);
	if (snap_amigos.val() != null) {
		console.log("cargarPost => hay post con ese dni");
		// paso 1: a�adimos los resultados en un array        
		snap_amigos.forEach((child) => {
			mydataSet_amigos.push(child.val().uid_amigo);
		});
	}
}

function vuelosAsociados(valor, origen, destino) {
	$('#selectVuelosComentario').append('<option value="' + valor + '">' + origen + ' - ' + destino + '</option>');
}

/**
	METODO PARA DEVOLVER LA URL DE UNA IMAGEN GUARDADA EN EL STORAGE
	@CARPETA - SER� LA RUTA DONDE ESTE LA IMAGEN, LA RUTA INICIAL EMPIEZA EN LA CARPETA 'IMAGES'
	@NOMBREIMAGEN - NOMBRE DE LA IMAGEN A BUSCAR EN DICHA CARPETA
*/
function getImagenStorage(carpeta, nombreImagen) {
	var separarCarpeta = "%2F";
	var stringHost = "https://firebasestorage.googleapis.com/v0/b/pcsocialfly.appspot.com/o/images" + separarCarpeta;


	var carpetaRemplazada = carpeta.replace("/", separarCarpeta);

	var urlReturn = stringHost + carpetaRemplazada + nombreImagen + "?alt=media";


	return urlReturn;
}

function upload() {
	var files = $('#inputFileImagen')[0].files;
	var array = new Array(files.length);
	for (var i = 0, f; f = files[i]; i++) {
		console.log(f.name);
		var carpeta = '/images/' + usuarioLogeado.uid + '/' + getStringFecha();
		var extension = f.name.split('.').pop();
		var nuevoNombre = getStringHora() + "." + extension;
		console.log("El archivo " + f.name + " ahora se llama " + nuevoNombre);
		uploadImageAsPromise(carpeta, f, nuevoNombre);

		var separarCarpeta = "%2F";
		array[i] = 'images' + separarCarpeta + usuarioLogeado.uid + separarCarpeta + getStringFecha() + separarCarpeta + nuevoNombre;
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
		$('.muroComentario #contenidoMensaje').html("<b>ERROR:</b> Es obligatorio escribir alg�n <u>comentario</u>.");
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
					varRetrasoSalida = (usuarioLogeado.vuelosAsociados[x].retrasoSalida != null) ? usuarioLogeado.vuelosAsociados[x].retrasoSalida : false;
					varDestino = usuarioLogeado.vuelosAsociados[x].destino + " " + usuarioLogeado.vuelosAsociados[x].fecha_llegada;
					varRetrasoDestino = (usuarioLogeado.vuelosAsociados[x].retrasoLlegada != null) ? usuarioLogeado.vuelosAsociados[x].retrasoLlegada : false;
				}
			}
		}
		
		var varUrlImgPerfil = usuarioLogeado.avatarURL;
		var varNomUser = usuarioLogeado.nombre + " " + usuarioLogeado.apellidos;
		var dt = new Date();
		var varFechaComentario = formatDate(dt);
		var varContComent = 0;
		var varContMG = 0;
		var varMeGustaUsuarioLogeado = false;;
		var varIdLikeUsuario = null;

		var post = {
			id_usuario: usuarioLogeado.uid,
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
			carrousel: varCarrousel,
			urlAvatar: varUrlImgPerfil
		};

		/// => The post does not exist => CREATING post
		var newPosts = dbRef.child("posts").push().key;
		console.log("KEY: " + newPosts);
		// Write the new post�s data simultaeously in the posts list and the post�s post list
		var updates = {};
		updates["/posts/" + newPosts] = post;

		var result = dbRef.update(updates);
		console.log(result);

		console.log("PRUEBA FECHA: " + varFechaComentario);

		

		setTimeout(function(){ crearPostHTML(newPosts, varComentario, varUrlImgPerfil, varNomUser, usuarioLogeado.uid, varSalida, varRetrasoSalida,
			varDestino, varRetrasoDestino, varFechaComentario, varContMG, varContComent, varCarrousel, varMeGustaUsuarioLogeado, varIdLikeUsuario, false); }, 2000);

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
	var refPost = dbRef.child("comentarios");

	for (var x = 1; x <= mostrarPost && varContadorPost < mydataSet_post.length; x++) {
		console.log("Contenido: " + mydataSet_post[varContadorPost].val().contenido);


		var id_post_buscar = mydataSet_post[varContadorPost].key;

		//Variables para utilizar del post
		var varSalida = mydataSet_post[varContadorPost].val().destino;
		var varRetrasoSalida = mydataSet_post[varContadorPost].val().retrasoDestino;
		var varDestino = mydataSet_post[varContadorPost].val().salida;
		var varRetrasoDestino = mydataSet_post[varContadorPost].val().retrasoSalida;
		var varUrlImgPerfil = mydataSet_post[varContadorPost].val().urlAvatar;
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
				if (child.val().id_usuario == usuarioLogeado.uid) {
					varMeGustaUsuarioLogeado = true;
					varIdLikeUsuario = child.key;
				}
			});
		}
		
		var snap_coment = await refPost.orderByChild("id_post").equalTo(id_post_buscar).once("value");

		if (snap_coment.val() != null) {
			varContComent = Object.values(snap_coment.val()).length;
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
			// paso 1: a�adimos los resultados en un array        
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
		$('#modalComent #messagesComentario #contenidoMensaje').html("<b>ERROR:</b> Es obligatorio escribir alg�n <u>comentario</u>.");
	} else {
		var varUrlImgPerfil = usuarioLogeado.avatarURL;
		var varNomUser = usuarioLogeado.nombrePerfil;

		var dt = new Date();
		var varFechaComentario = getFechatoBD(dt);


		var comentario = {
			id_usuario: usuarioLogeado.uid,
			contenido: varTextoComentario,
			fecha_comentario: varFechaComentario,
			nombreUsuario: varNomUser,
			id_post: idPostComentarios,
			urlAvatar: varUrlImgPerfil
		};

		var newComentario = dbRef.child("comentarios").push().key;
		console.log("KEY: " + newComentario);

		var updates = {};
		updates["/comentarios/" + newComentario] = comentario;

		var result = dbRef.update(updates);
		console.log(result);

		crearComentarioHTML(newComentario, varTextoComentario, usuarioLogeado.uid, varNomUser, varUrlImgPerfil, varFechaComentario);
		
		//Sumar uno al contador de comentarios
		var spanContador = $('#' + idPostComentarios + ' .contadorComentarios');
		var numeroContador = parseInt(spanContador.text()) + 1;
		spanContador.text(numeroContador);
		
		createNotificacion(usuarioLogeado.nombrePerfil + " ha comentado en una de tus publicaciones", $("#modalComent").attr("data-user"));
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
		var varUrlImgPerfil = mydataSet_coment[x].val().urlAvatar;
		var varFechaComentario = mydataSet_coment[x].val().fecha_comentario;

		console.log("Contenido comentario: " + varTextoComentario);

		crearComentarioHTML(idComent, varTextoComentario, varIdUsuario, varNomUser, varUrlImgPerfil, varFechaComentario);
		
		$("#modalComent").attr("data-user", varIdUsuario);
	}
}


function agregarMeGusta(idPost, uidUsuario) {

	var dt = new Date();

	var like = {
		id_usuario: usuarioLogeado.uid,
		id_post: idPost,
		fecha_like: getFechatoBD(dt)
	};

	var newLike = dbRef.child("likes").push().key;
	console.log("KEY: " + newLike);

	var updates = {};
	updates["/likes/" + newLike] = like;

	var result = dbRef.update(updates);
	console.log(result);
	
	createNotificacion("A " + usuarioLogeado.nombrePerfil + " le gusta una de tus publicaciones", uidUsuario);
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

/** INICIO CARGAR DATOS DE UNA PUBLICIDAD */
var varPublicidad;

async function load_publicidad(){
	var varKey = getParameterByName('id');
	var queryPubli = dbRef.child("publicidad");
	varPublicidad = await queryPubli.orderByKey().equalTo(varKey).once("value");
	if (varPublicidad.val() != null) {
		var val = Object.values(varPublicidad.val())[0];
		
		$('#input_aeropuerto').val(val.nombre_aeropuerto);
		$('#input_comentario').val(val.comentario);
		$('#input_hashtag').val(val.hashtag);
		$('#input_actividad').val(val.nombre_actividad);
		var stringCarrousel = crearCarrousel(val.carrousel, "Publicidad" + varKey);
		$('#carrouselFotos').html(stringCarrousel);
		
		var contador5 = 0;
		var contador4 = 0;
		var contador3 = 0;
		var contador2 = 0;
		var contador1 = 0;
		var contador0 = 0;
		
		if(val.votos != null){
			
			var votado = false;
			for(var x = 0; x < val.votos.length; x++){
				switch (val.votos[x].puntuacion){
					case 5 :
						contador5 ++;
						break;
					case 4 :
						contador4 ++;
						break;
					case 3 :
						contador3 ++;
						break;
					case 2 :
						contador2 ++;
						break;
					case 1 :
						contador1 ++;
						break;
					case 0 :
						contador0 ++;
						break;
				}
				
				if(val.votos[x].uid == usuarioLogeado.uid){
					votado = true;
				}
			}
			
			$("#puntuacion5estrellas").text(contador5);
			$("#puntuacion4estrellas").text(contador4);
			$("#puntuacion3estrellas").text(contador3);
			$("#puntuacion2estrellas").text(contador2);
			$("#puntuacion1estrellas").text(contador1);
			$("#puntuacion0estrellas").text(contador0);
			
			
			$("#totalVotos").text(contador0 + contador1 + contador2 + contador3 + contador4 + contador5);
			
			if(votado){
				$('.votar').addClass("votado");
				$('.votar').removeClass("votar");
				$('#comprobacion').text("Ya has votado");
			}
		}
		
		var varMedia = ( (contador5 * 5) + (contador4 * 4) +(contador3 * 3) + (contador2 * 2)  + (contador1 * 1) ) / (contador0 + contador1 + contador2 + contador3 + contador4 + contador5);
		var stringEstrellas = "";
		
		var stringEstrellaMarcada = '<span class="fa fa-star"></span>';
		var stringEstrellaNoMarcada = '<span class="far fa-star"></span>';
		for(var x = 1; x <= 5; x++){
			if(varMedia >= 1){
				varMedia --;
				stringEstrellas += stringEstrellaMarcada;
			} else {
				stringEstrellas += stringEstrellaNoMarcada;
			}
		}
		
		$('#puntuacionMedia').html(stringEstrellas);
	} 
}

async function agregarVoto(varPuntuacion){
	var elemento = $('.votado').length
	if( elemento == 0 ){
		console.log(usuarioLogeado.uid);
		$('.votar').addClass("votado");
		$('.votar').removeClass("votar");
		$('#comprobacion').text("Ya has votado");
		var spanContador;
		switch (varPuntuacion){
			case 5 :
				spanContador = $("#puntuacion5estrellas");
				break;
			case 4 :
				spanContador = $("#puntuacion4estrellas");
				break;
			case 3 :
				spanContador = $("#puntuacion3estrellas");
				break;
			case 2 :
				spanContador = $("#puntuacion2estrellas");
				break;
			case 1 :
				spanContador = $("#puntuacion1estrellas");
				break;
			case 0 :
				spanContador = $("#puntuacion0estrellas");
				break;
		}
		
		var numeroContador = parseInt(spanContador.text()) + 1;
		spanContador.text(numeroContador);
		
		var varVoto = new Object();
		varVoto.puntuacion = varPuntuacion;
		varVoto.uid = usuarioLogeado.uid
		
		var varPublicidadTemporal = Object.values(varPublicidad.val())[0];
		
		if(varPublicidadTemporal.votos == null){
			varPublicidadTemporal.votos = [];
		}
		
		varPublicidadTemporal.votos.push(varVoto);
		
		
		var query = dbRef.child('/publicidad/').orderByKey().equalTo(Object.keys(varPublicidad.val())[0]);
		await query.once ('value', snapshot =>
		{
			if (snapshot.val() != null)
			{
				var key = Object.keys(snapshot.val())[0];
				snapshot.ref.child(key).set(varPublicidadTemporal);
			}
		});
	}
}


/** INICIO NOTIFICACIONES */
function createNotificacion(varMensaje, varUidAmigo){
	var dt = new Date();

	var notificacion = {
		id_usuario: varUidAmigo,
		mensaje: varMensaje,
		leido: false,
		fecha: getFechatoBD(dt)
	};

	var newNoti = dbRef.child("notificaciones").push().key;

	var updates = {};
	updates["/notificaciones/" + newNoti] = notificacion;

	var result = dbRef.update(updates);
	console.log(result);
}

function operateLeido(value, row, index) {
	var varString = [];
	if(value){
		varString = ['<div class="operationLeido" title="Leido">',
			'<i class="far fa-eye" onclick="cambiarLeido(' + index + ', true);"></i>',
        '</div>'];
	} else {
		varString = ['<div class="operationLeido" title="No leido">',
			'<i class="far fa-eye-slash" onclick="cambiarLeido(' + index + ', false);"></i>',
        '</div>'];
	}
    return varString.join('');
}

function operateBorrar(value, row, index) {
	var varString = ['<div class="operationBorrar" title="Leido">',
			'<i class="fa fa-trash" onclick="deleteNotificacion(' + index + ', false);" aria-hidden="true"></i>',
        '</div>'];
    return varString.join('');
}

function deleteNotificacion(varIndex){
	var ref = dbRef.child("/notificaciones/" + mydataSet_notificaciones[varIndex].key);
	
	if(!mydataSet_notificaciones[varIndex].leido){
		decrementarNotificacion();
	}
	
	ref
	.remove()
	.then(function() {
		//Borrar de la tabla
		load_notificaciones();
	});
}

function cambiarLeido(varIndex, varEstado){
	console.log("Index: " + varIndex + ", estado: " + varEstado);
	console.log($('[data-index=' + varIndex + '] .operationLeido').html());
	if(cambiarEstadoNotificacion(varIndex, varEstado)){
		if(varEstado){
			$('[data-index=' + varIndex + '] .operationLeido').html('<i class="far fa-eye-slash" onclick="cambiarLeido(' + varIndex + ', false);"></i>');
			incrementarNotificacion();
		} else {
			$('[data-index=' + varIndex + '] .operationLeido').html('<i class="far fa-eye" onclick="cambiarLeido(' + varIndex + ', true);"></i>');
			decrementarNotificacion();
		}
	}
	
}

async function cambiarEstadoNotificacion(varIndex, varEstado){
	console.log("KEY: " + mydataSet_notificaciones[varIndex].key);
	
	var query = dbRef.child('/notificaciones/').orderByKey().equalTo(mydataSet_notificaciones[varIndex].key);
	
	var notificacionTemporal = {
		id_usuario: mydataSet_notificaciones[varIndex].id_usuario,
		mensaje: mydataSet_notificaciones[varIndex].mensaje,
		leido: !varEstado,
		fecha: mydataSet_notificaciones[varIndex].fecha
	};
	
	await query.once ('value', snapshot =>
	{
		if (snapshot.val() != null)
		{
			var key = Object.keys(snapshot.val())[0];
			snapshot.ref.child(key).set(notificacionTemporal);
		}
	});
	
	return true;
}

var mydataSet_notificaciones = [];
async function load_notificaciones(){
	
	var queryNotificaciones = dbRef.child("notificaciones").orderByChild("id_usuario").equalTo(usuarioLogeado.uid);
	var snap_noti = await queryNotificaciones.once("value");
	
	mydataSet_notificaciones = [];
	if (snap_noti.val() != null) {
		snap_noti.forEach((child) => {
			var fila_json = {
				key: child.key,
				mensaje: child.val().mensaje,
				leido: child.val().leido,
				fecha: child.val().fecha,
				id_usuario: child.val().id_usuario
			};
			mydataSet_notificaciones.push(fila_json);
		});
	}
	
	var $table_noti = $('#table_noti');
	
	//Columnas
	var config_cols = [
                [{
                    field: 'fecha',
                    title: 'Fecha',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'mensaje',
                    title: 'Mensaje',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'leido',
                    title: 'Leido',
                    sortable: true,
                    formatter: operateLeido,
                    align: 'center'
                }, {
                    field: 'operate',
                    title: 'Eliminar',
                    align: 'center',
                    clickToSelect: false,
                    formatter: operateBorrar
                }]
            ];
	
	// seteamos en la tabla
    $table_noti.bootstrapTable('destroy').bootstrapTable({//   height: 500,
        data: mydataSet_notificaciones,
        pagination: true,
        search: true,
        columns: config_cols
    })
}


/** INICIO BUSCADOR MENU */
function buscadorMenu(){
	var varStringBusqueda = $('#search').val();
	if(varStringBusqueda != ""){
		sessionStorage.clear(); // limpiamos sesión
		sessionStorage.setItem("string_busqueda", varStringBusqueda);
		window.location.href =
		  "https://pcsocialfly.web.app/pages/busqueda.html";
	}
}


//Version movil
function buscadorMenuMovil(){
	var varStringBusqueda = $('#inputSearchMovil').val();
	if(varStringBusqueda != ""){
		sessionStorage.clear(); // limpiamos sesión
		sessionStorage.setItem("string_busqueda", varStringBusqueda);
		window.location.href =
		  "https://pcsocialfly.web.app/pages/busqueda.html";
	}
}
/** FIN BUSCADOR MENU */

/** INICIO PANTALLA BUSQUEDA */
function load_busqueda(){
	if(sessionStorage.getItem("string_busqueda") != null){
		console.log("LA BUSQUEDA: " + sessionStorage.getItem("string_busqueda"));
		$('#input_busqueda').val(sessionStorage.getItem("string_busqueda"));
		barra_buscar_click();
		sessionStorage.clear(); // limpiamos sesión
	}
}
/** FIN PANTALLA BUSQUEDA */