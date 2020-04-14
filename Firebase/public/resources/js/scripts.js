

//<!--------------------------------------- Inicio base datos ------------------------------------------>
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


//<!--------------------------------------- Variables ------------------------------------------>
const dbRef = firebase.database().ref();


//<!--------------------------------------- Funciones ------------------------------------------>
function registroUser()
{
	var user =
	{
		mail:document.getElementById("mail").value,
		username:document.getElementById("username").value,
		pass:document.getElementById("pass").value,
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
			
			
			//Si ha llegado hasta aqui crear el usuario
			var newUsers = dbRef.child("users").push().key;
			var updates = {};
			updates["/users/" + newUsers] = user;
			
			var result = dbRef.update(updates);
			console.log(result);
			
			console.log("Registrado");
			return true;
		}
	});
}


