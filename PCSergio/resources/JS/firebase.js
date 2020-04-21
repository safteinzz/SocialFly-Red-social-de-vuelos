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
console.log("Log consola:\n");
console.log(firebase);



//FIREBASE
const dbRef = firebase.database().ref();

const db = firebase.database();

const storage = firebase.storage();
const storageRef = storage.ref();

var usuarioLogeado = new Object();

$(document).ready(function() {
	initPrincipal();
	
	getUsuario();
	console.log(usuarioLogeado.dni);
	console.log("URL: " + getImagenStorage('123/', 'flag_usa.png'));
	$("#imagenPerfil").attr("src",getImagenStorage('123/', 'flag_usa.png'));
	
	/**
	var imagen = storageRef.child('/images/70562.png');
	imagen.getDownloadURL().then(function(url) {
			// Insert url into an <img> tag to "download"
			
			$("#imagenPerfil").attr("src",url);
		}).catch(function(error) {

		});
		*/
});
 
function getUsuario(){
		
		
		var ref = db.ref("users");
		var refVuelosPers = db.ref("vuelos_personas");
		var refVuelos = db.ref("vuelos");
		
		ref.orderByChild("dni").equalTo("123").on("child_added", function(snapshot) {
			console.log("USUARIO: ");
			var dniPersona = snapshot.val().dni;
			usuarioLogeado.dni = dniPersona;
			console.log(dniPersona);
			
			refVuelosPers.orderByChild("dni_persona").equalTo(snapshot.val().dni).on("child_added", function(snapshotVuelosPers) {
				console.log("ID VUELO: ");
				console.log(snapshotVuelosPers.val().id_vuelo);
				
				refVuelos.orderByChild("id_vuelo").equalTo(snapshotVuelosPers.val().id_vuelo).on("child_added", function(snapshotVuelos) {
					console.log("ORIGEN: ");
					console.log(snapshotVuelos.val().origen);
					console.log("DESTINO: ");
					console.log(snapshotVuelos.val().destino);
					
					vuelosAsociados(snapshotVuelos.val().id_vuelo, snapshotVuelos.val().origen, snapshotVuelos.val().destino);
				});
				
			});
			
		});
	}
 
 
function vuelosAsociados(valor, origen, destino) {
	$('#selectVuelosComentario').append('<option value="' + valor + '">' + origen + ' - ' + destino + '</option>'); 
}

/**
	METODO PARA DEVOLVER LA URL DE UNA IMAGEN GUARDADA EN EL STORAGE
	@CARPETA - SERÁ LA RUTA DONDE ESTE LA IMAGEN, LA RUTA INICIAL EMPIEZA EN LA CARPETA 'IMAGES'
	@NOMBREIMAGEN - NOMBRE DE LA IMAGEN A BUSCAR EN DICHA CARPETA
*/
function getImagenStorage(carpeta, nombreImagen){
	var separarCarpeta = "%2F";
	var stringHost = "https://firebasestorage.googleapis.com/v0/b/pruebafirebase-b91ce.appspot.com/o/images" + separarCarpeta;
	
	
	var carpetaRemplazada = carpeta.replace("/", separarCarpeta);
	console.log(carpetaRemplazada);
	
	var urlReturn = stringHost + carpetaRemplazada + nombreImagen + "?alt=media";
	
	console.log("URL FINAL: " + urlReturn);
	
	return urlReturn;
}

function upload() {
	var file = document.getElementById('inputFileImagen').files[0];
	
	var reference = storageRef.child('/images/' + file.name);
	var task = reference.put(file);
}

function createPost() {
	var varIdPOST = "POST" + varContadorPost;
	var varUrlImgPerfil = "https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg";
	var varNomUser = "Sergio Fortes Campillo";
	var varSalida = "Barajas(Madrid) 15:00 20/20/20";
	var varRetrasoSalida = true;
	var varDestino = "El Prat(Barcelona) 17:00 20/20/20";
	var varRetrasoDestino = true;
	var dt = new Date();
	var varFechaComentario = formatDate(dt);
	var varContMG = 0;
	var varContComent = 0;
	var varCarrousel = [
						"https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg",
						"https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg",
						"https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg"
						];
	
	
  var post = {
    name: "pruebaSocial",
    lastname: "pruebaSocial",
    email: "pruebaSocial",
	pass: "pruebaSocial"
  };

  /// => CHECKING post EXISTENCE
  const query = dbRef
    .child("posts")
    .orderByChild("name")
    .equalTo("root");
  var exists = false;
  query.once("value", snap => {
    console.log(snap.val());
    if (snap.val() != null) {
      console.log("post already exists");
      exists = true;
    } else {
      console.log("post created");
    }
  });

  if (exists) {
    return;
  }

  /// => The post does not exist => CREATING post
  var newPosts = dbRef.child("posts").push().key;

  // Write the new post´s data simultaeously in the posts list and the post´s post list
  var updates = {};
  updates["/posts/" + newPosts] = post;

  var result = dbRef.update(updates);
  console.log(result);
}