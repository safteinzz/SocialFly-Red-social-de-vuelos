// Your web app's Firebase configuration
var firebaseConfig = 
{
	apiKey: "AIzaSyDxV4yqlAmYT8tw8LqTtYlMQngYs10795o",
	authDomain: "pcsocialfly.firebaseapp.com",
	databaseURL: "https://pcsocialfly.firebaseio.com",
	projectId: "pcsocialfly",
	storageBucket: "pcsocialfly.appspot.com",
	messagingSenderId: "504886406716",
	appId: "1:504886406716:web:cfa353851c80e9b1625d39",
	measurementId: "G-9K0EP0RX5E"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();



const dbRef = firebase.database().ref();

function registro ()
{
	var user =
	{
		mail:document.getElementById('mail').value,
		username:document.getElementById('username').value,
		pass:document.getElementById('pass').value,
		repitePass:document.getElementById('repitePass').value
	};
	
	
	
	//Comprobar usuario inexistente (por correo)
	const query = dbRef.child('users').orderByChild('mail').equalTo(document.getElementById('mail').value);	
	query.once ('value', snap =>
	{
		console.log(snap.val());
		if (snap.val() != null)
		{
			console.log('usuario ya existe');
			return;
		}
		else
		{
			console.log('usuario creado');
		}
	});
	//Comprobar pass repetida
	if ((document.getElementById('pass').value).equalTo(document.getElementById('passRepite').value);
	{
		console.log('Contraseñas iguales');
		return;		
	}
	
	//Comprobar acepto terminos y condiciones
	if (document.getElementById('terminos').checked == false)
	{
		console.log('Acepta terminos');
		return;
	}
	
	//Si ha llegado hasta aqui crear el usuario
	var newUsers = dbRef.child('users').push().key;
	var updates = {};
	updates['/users/' + newUsers = user;
	
	var result = dbRef.update(updates);
	console.log(result);
}