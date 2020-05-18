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
var usuarioLogeado; //variable para logear usuarios
var usuarioActual; //variable que almacena todos los datos del usuario logeado

//variables de querys
var queryUser = dbRef.child("users");
var queryVuelosPers = dbRef.child("vuelos_personas");
var queryVuelos = dbRef.child("vuelos");
var queryAmigos = dbRef.child("amigos");



// <!--------------------------------------- RUN UP - Acceso ------------------------------------------>

// var user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(async function(user) {
	if (!user && window.location.href != "https://pcsocialfly.web.app/acceso.html") 
	{
		window.location.href = "https://pcsocialfly.web.app/acceso.html";
	}
	else if (!user)
	{
		//no hacer nada
	}
	else
	{
		const query = dbRef.child('users').orderByChild('uid').equalTo(user.uid);

		await query.once('value',snapshot => 
		{
			if (snapshot.val() != null)
			{
				var key = Object.keys(snapshot.val())[0];  
				var val = Object.values(snapshot.val())[0]; 
				usuarioActual =
				{
					uid:user.uid,
					email:user.email,
					id_rol:val.id_rol,
					fecha_registro:val.fecha_registro,
					fecha_visita:val.fecha_visita,
					// fecha_nacimiento:val.fecha_nacimiento,
					nombre:val.nombre,
					apellidos:val.apellidos,
					tlf_movil:val.tlf_movil			
				};
			}
		});
	}
});

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


// <!--------------------------------------- Eventos ------------------------------------------>

// Salir de la session
$('#logOut').unbind('click').click(function () {
	// FirebaseAuth.getInstance().signOut();
	sessionStorage.clear();
	
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	}).catch(function(error) {
	  // An error happened.
	});
	
	window.location.href = "https://pcsocialfly.web.app/acceso.html";
});


// <!--------------------------------------- FUNCIONES ------------------------------------------>

// <!------------------- LOGIN ---------------------->

/** AUTH
 * usuarioLogeado.displayName
 * usuarioLogeado.email
 * usuarioLogeado.photoURL
 * usuarioLogeado.uid
*/

// <!------------------- Crear user ---------------------->
function crearUser(newUser)
{
	const query = dbRef.child('users').orderByChild('uid').equalTo(newUser.uid);
	// var exists = false;
	query.once('value',snapshot => 
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


// <<!------------------- LOGIN y creado tablas ---------------------->
function login(tipo) {
	function nuevoLogin(usuarioLogeado) {
		if (usuarioLogeado) 
		{
			var today = new Date(); 
			var now = today.getDate()  + '/' + (today.getMonth()+1) + '/' +today.getFullYear();
			const newUser =
			{
				uid:usuarioLogeado.uid,
				// el correo lo tiene el propio auth email:usuarioLogeado.email,
				id_rol:3, //se hardcodea a usuario normal por defecto
				fecha_registro:now,
				fecha_visita: now,				
				nombre:" ",
				apellidos:" ",
				tlf_movil:" "	
			};
			
			crearUser(newUser);			
			alert('Login confirmado'); //esto esta para esperar la creación mas que otra cosa
			window.location.href = "https://pcsocialfly.web.app/perfil.html";
		}
		else if (tipo == "google") 
		{
			var provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().signInWithPopup(provider)
			.then(function(result) 
			{
				var token = result.credential.accessToken;
				usuarioLogeado = result.user;
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
				usuarioLogeado = result.user;
			}).catch(error => {
				if (error.code == 'auth/user-not-found')
				{
					alert(`El correo${document.getElementById("mailLogIn").value} no esta registrado`);
				}
				else if (error.code == 'auth/wrong-password')
				{
					alert(`Contraseña erronea o el correo esta registrado desde otro proveedor`);
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

function editarUsuario(userUpdate)
{
	var query = dbRef.child('/users/').orderByChild('uid').equalTo(usuarioActual.uid);
	query.once ('value', snapshot =>
	{
		if (snapshot.val() != null)
		{
			var key = Object.keys(snapshot.val())[0];
			snapshot.ref.child(key).set(userUpdate);
		}
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
		alert("Las contraseñas son diferentes");	
	}	

	if (document.getElementById("pass").value.length < 6)
	{
		alert("Las contraseñas deben tener al menos 6 caracteres");	
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
				alert('La contraseña no es suficientemente fuerte, al menos 6 caracteres necesarios');
			}
			else
			{
				alert(error.message);
			}
		});

	
	/* registro mal
	const pass = saltHashPassword(userpassword);	
	const newUser =
	{
		mail:document.getElementById("mail").value,
		username:document.getElementById("username").value
		//,hash:pass.passwordHash,
		//salt:pass.salt
	};
	
	dbRef.child("users").orderByChild("mail").equalTo(document.getElementById("mail").value).once("value",snapshot => 
	{
		if (snapshot.exists())
		{
			const userData = snapshot.val();
			console.log("usuario ya existe", userData);
			alert("Ese mail ya esta registrado");
			return false;
		}
		else
		{			
			//Si ha llegado hasta aqui crear el usuario
			var newUsers = dbRef.child("users").push().key;
			var updates = {};
			updates["/users/" + newUsers] = newUser;
			
			var result = dbRef.update(updates);
			console.log(result);
			
			console.log("Registrado");
			return true;
		}
	});
	*/
}


