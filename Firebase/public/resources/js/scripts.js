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

// <!--------------------------------------- Acceso ------------------------------------------>
// var user = firebase.auth().currentUser;

// if (!user && window.location.href != "https://pcsocialfly.web.app/acceso.html") 
// {
	// window.location.href = "https://pcsocialfly.web.app/acceso.html";
// } 

// <!--------------------------------------- VARIABLES ------------------------------------------>
const dbRef = firebase.database().ref();
var usuarioLogeado;


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

// <<!------------------- LOGIN y creado tablas ---------------------->
function login(tipo) {
	function nuevoLogin(usuarioLogeado) {
		if (usuarioLogeado) 
		{
			const newUser =
			{
				uid:usuarioLogeado.uid,
				email:usuarioLogeado.email
			};
			
			crearUser(newUser);			
			
			
			sessionStorage.setItem("userUID", usuarioLogeado.uid);
			sessionStorage.setItem("userMail", usuarioLogeado.email);
			// window.location.href = "/";
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

	// if (exists)
	// {
		// return;
	// }
	
	
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


