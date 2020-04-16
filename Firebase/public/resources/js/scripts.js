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


// <!--------------------------------------- FACEBOOK SDK ------------------------------------------>

// window.fbAsyncInit = function() {
// FB.init({
	// appId      : '{your-app-id}',
	// cookie     : true,
	// xfbml      : true,
	// version    : '{api-version}'
// });

// FB.AppEvents.logPageView();

// };

// (function(d, s, id){
	// var js, fjs = d.getElementsByTagName(s)[0];
	// if (d.getElementById(id)) {return;}
	// js = d.createElement(s); js.id = id;
	// js.src = "https://connect.facebook.net/en_US/sdk.js";
	// fjs.parentNode.insertBefore(js, fjs);
	// }(document, 'script', 'facebook-jssdk'));

// https://developers.facebook.com/apps/655702978552052/fb-login/quickstart/






// <!--------------------------------------- VARIABLES ------------------------------------------>
const dbRef = firebase.database().ref();
var usuarioLogeado;


// <!--------------------------------------- Eventos ------------------------------------------>

// Salir de la session
$('#logOut').unbind('click').click(function () {
	// FirebaseAuth.getInstance().signOut();
	sessionStorage.clear();
	firebase.auth().signOut();
	window.location.href = "/";
});


// <!--------------------------------------- FUNCIONES ------------------------------------------>


// <!--------------------------------------- LOGIN ------------------------------------------>

/** AUTH
 * usuarioLogeado.displayName
 * usuarioLogeado.email
 * usuarioLogeado.photoURL
 * usuarioLogeado.uid
*/

// <<!------------------- Google / Facebook ---------------------->
function login(tipo) {
	function nuevoLogin(usuarioLogeado) {
		if (usuarioLogeado) {
			sessionStorage.setItem("userUID", usuarioLogeado.uid);
			sessionStorage.setItem("userNombre", usuarioLogeado.displayName);
			sessionStorage.setItem("userFoto", usuarioLogeado.photoURL);
			sessionStorage.setItem("userMail", usuarioLogeado.email);
			window.location.href = "main.html";
		}
		else if (tipo == "google") {
			var provider = new firebase.auth.GoogleAuthProvider();		
		}
		else {
			var provider = new firebase.auth.FacebookAuthProvider();			
		}
		firebase.auth().signInWithPopup(provider).then(function(result) {
			// This gives you a Google Access Token.
			var token = result.credential.accessToken;
			// The signed-in user info.
			usuarioLogeado = result.user;
				
		});
	}
	firebase.auth().onAuthStateChanged(nuevoLogin);
}

// <!------------------- Email / Pass ---------------------->





// <!--------------------------------------- Registro ------------------------------------------>
function registroUser()
{	
	//Comprobar acepto terminos y condiciones
	if (document.getElementById("terminos").checked == false)
	{
		alert("Tienes que aceptar los terminos de registro");
		return false;
	}
	
	//Comprobar pass repetida
	if (!(document.getElementById("pass").value == document.getElementById("repitePass").value))
	{
		alert("Las contraseñas son diferentes");
		return false;		
	}	


	//const pass = saltHashPassword(userpassword);
	
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
}


