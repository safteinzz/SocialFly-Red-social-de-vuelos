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

$(document).ready(function() {
	initPrincipal();
	
	getUsuario();
	console.log("DNI usuario: " + usuarioLogeado.dni);
	console.log("URL: " + getImagenStorage('123/', 'flag_usa.png'));
	
	
	
	
	/**
	var imagen = storageRef.child('/images/70562.png');
	imagen.getDownloadURL().then(function(url) {
			// Insert url into an <img> tag to "download"
			
			$("#imagenPerfil").attr("src",url);
		}).catch(function(error) {

		});
		*/
});

function getStringHora(){
	var fullDate = new Date();
	var twoDigitHoras = fullDate.getHours() + "";
	if(twoDigitHoras.length == 1){
		twoDigitHoras = "0" + twoDigitHoras;
	}
	
	var twoDigitMinut = fullDate.getMinutes() + "";
	if(twoDigitMinut.length == 1){
		twoDigitMinut = "0" + twoDigitMinut;
	}
	
	var twoDigitSecond = fullDate.getSeconds() + "";
	if(twoDigitSecond.length == 1){
		twoDigitSecond = "0" + twoDigitSecond;
	}
	
	var twoDigitMilis = fullDate.getMilliseconds() + "";
	if(twoDigitMilis.length == 1){
		twoDigitMilis = "00" + twoDigitMilis;
	} else if(twoDigitMilis.length == 2){
		twoDigitMilis = "0" + twoDigitMilis;
	}
	
	var currentDate = twoDigitHoras + fullDate.getMinutes() + fullDate.getSeconds() + fullDate.getMilliseconds();
	return currentDate;
}

function getStringFecha(){
	var fullDate = new Date();
	var mes = fullDate.getMonth() + 1;
	var twoDigitMonth = mes+"";
	if(twoDigitMonth.length==1){
		twoDigitMonth="0" +twoDigitMonth;
	}
	var twoDigitDate = fullDate.getDate()+"";
	if(twoDigitDate.length==1){
		twoDigitDate="0" +twoDigitDate;
	}
	var currentDate = fullDate.getFullYear() + twoDigitMonth + twoDigitDate;
	return currentDate;
}

function getFechatoBD(date){
	var mes = date.getMonth() + 1;
	var twoDigitMonth = mes+"";
	if(twoDigitMonth.length==1){
		twoDigitMonth="0" +twoDigitMonth;
	}
	var twoDigitDate = date.getDate()+"";
	if(twoDigitDate.length==1){
		twoDigitDate="0" +twoDigitDate;
	}
	
	var twoDigitHoras = date.getHours() + "";
	if(twoDigitHoras.length == 1){
		twoDigitHoras = "0" + twoDigitHoras;
	}
	
	var twoDigitMinut = date.getMinutes() + "";
	if(twoDigitMinut.length == 1){
		twoDigitMinut = "0" + twoDigitMinut;
	}
	
	var twoDigitSecond = date.getSeconds() + "";
	if(twoDigitSecond.length == 1){
		twoDigitSecond = "0" + twoDigitSecond;
	}
	
	var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + date.getFullYear() + " " + twoDigitHoras + ":" + twoDigitMinut + ":" + twoDigitSecond;
	return currentDate;
}
 
async function getUsuario() {
	
	var queryUser = dbRef.child("users");
	var queryVuelosPers = dbRef.child("vuelos_personas");
	var queryVuelos = dbRef.child("vuelos");
	
	var snap_user=await queryUser.orderByChild("dni").equalTo("123").once("value");
	if (snap_user.val() != null) {
		var key = Object.keys(snap_user.val())[0];  
		var val = Object.values(snap_user.val())[0];            
	   
		usuarioLogeado.dni = val.dni;
		usuarioLogeado.nombrePerfil = val.name;
		console.log("getUsuario() => usuarioLogeado.dni: "+usuarioLogeado.dni);
		
		//Cargar los vuelos_personas del usuario logeado
		var snap_vuePer=await queryVuelosPers.orderByChild("dni_persona").equalTo(val.dni).once("value");
		
		if (snap_user.val() != null) {
			var mydataSet_vuePer = [];
			snap_vuePer.forEach((child) => {
				mydataSet_vuePer.push(child.val().id_vuelo);
			});
			
			for(i=0; i<mydataSet_vuePer.length; i++){
				console.log("getUsuario() => Buscar los datos del vuelo " + mydataSet_vuePer[i]);
				//Cargamos los datos de los vuelos que tiene relacionados
				var snap_vuelos=await queryVuelos.orderByChild("id_vuelo").equalTo(mydataSet_vuePer[i]).once("value");
		
				if (snap_vuelos.val() != null) {
					var key_vuelos = Object.keys(snap_vuelos.val())[0];  
					var val_vuelos = Object.values(snap_vuelos.val())[0];    

					//Cargamos la lista del select del muro con los datos de los vuelos relacionados
					vuelosAsociados(val_vuelos.id_vuelo, val_vuelos.origen + " " + val_vuelos.fecha_salida, val_vuelos.destino + " " + val_vuelos.fecha_llegada);
				} else {
					console.log("getUsuario() => El vuelo con id " + mydataSet_vuePer[i] + " no existe en BD");
				}
			}
			
		} else {
			console.log("getUsuario() => El usuario no tiene vuelos relacionados");
		}
		
		console.log("fin getUsuario");

		console.log("llamada a cargarPost");
		cargarPost();
	}
	else{
		console.log("getUsuario() => Usuario no encontrado");
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
function uploadImageAsPromise (carpeta, imageFile, nombreFile) {
    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref(carpeta + '/' + nombreFile);

        //Upload file
        var task = storageRef.put(imageFile);

        //Update progress bar
        task.on('state_changed',
            function progress(snapshot){
                var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            },
            function error(err){

            },
            function complete(){
                var downloadURL = task.snapshot.downloadURL;
				console.log(downloadURL);
            }
        );
    });
}

function crearPost(varComentario) {
	$('.muroComentario #messagesComentario').css('display','none');
			
	if(varComentario == ""){
		$('.muroComentario #messagesComentario').css('display','block');
		$('.muroComentario #contenidoMensaje').html("<b>ERROR:</b> Es obligatorio escribir algún <u>comentario</u>.");
	} else {
	
		var id_vuelo = $("#selectVuelosComentario" ).val();
		
		var varSalida = "";
		var varRetrasoSalida = false;
		var varDestino = "";
		var varRetrasoDestino = false;
		
		if(id_vuelo != 'Ninguno'){
			console.log(id_vuelo);
			var refVuelos = db.ref("vuelos");
			
			refVuelos.orderByChild("id_vuelo").equalTo(id_vuelo).on("child_added", function(snapshotVuelos) {
				console.log("ORIGEN: ");
				console.log(snapshotVuelos.val().origen);
				console.log("DESTINO: ");
				console.log(snapshotVuelos.val().destino);
				
				varSalida = snapshotVuelos.val().origen + " " + snapshotVuelos.val().fecha_salida;
				varRetrasoSalida = snapshotVuelos.val().retrasoSalida;
				varDestino = snapshotVuelos.val().destino + " " + snapshotVuelos.val().fecha_llegada;
				varRetrasoDestino = snapshotVuelos.val().retrasoLlegada;	
			});
		}
		
		var varUrlImgPerfil = getImagenStorage(usuarioLogeado.dni + '/', 'perfil.png');
		var varNomUser = usuarioLogeado.nombrePerfil;
		var dt = new Date();
		var varFechaComentario = formatDate(dt);
		var varContMG = 0;
		var varContComent = 0;
		var varCarrousel = upload();
		
		
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

		crearPostHTML(newPosts, varComentario, varUrlImgPerfil, varNomUser, varSalida, varRetrasoSalida,
			varDestino, varRetrasoDestino, varFechaComentario, varContMG, varContComent, varCarrousel);
	}
}


async function getAllEvents(idPost) {
	var refLikes = db.ref("likes");
    const eventsArray = [];

    await refLikes.orderByChild("id_post").equalTo(idPost).on("child_added", function(snapshotLike) {
		console.log("Encuentra alguno");
		eventsArray.push(snapshotLike);
	});

    return eventsArray;
}

async function cargarPost() {
	
	console.log("Inicio cargarPost, dni: " +usuarioLogeado.dni);

    var queryPosts = dbRef.child("posts").orderByChild("id_usuario").equalTo(usuarioLogeado.dni);
    var refLikes = dbRef.child("likes");

    var mydataSet_post = [];
    var snap_posts=await queryPosts.once("value");    

    if (snap_posts.val() != null) {
        console.log("cargarPost => hay post con ese dni");
        // paso 1: añadimos los resultados en un array        
        snap_posts.forEach((child) => {
            mydataSet_post.push(child);
        });

        // paso 2: buscamos si tienen likes asociados
        for(i=0; i<mydataSet_post.length; i++){
            var id_post_buscar = mydataSet_post[i].key;        

			//Variables para utilizar del post
			var varSalida = mydataSet_post[i].val().destino;
			var varRetrasoSalida = mydataSet_post[i].val().retrasoDestino;
			var varDestino = mydataSet_post[i].val().salida;
			var varRetrasoDestino = mydataSet_post[i].val().retrasoSalida;
			var varUrlImgPerfil = getImagenStorage(mydataSet_post[i].val().id_usuario + '/', 'perfil.png');
			var varNomUser = mydataSet_post[i].val().nombreUsuario;
			var varFechaComentario = mydataSet_post[i].val().fecha_post;
			var varContComent = mydataSet_post[i].val().contComment;
			var varCarrousel = mydataSet_post[i].val().carrousel;
			var varComentario = mydataSet_post[i].val().contenido;
			var varContMG = 0;
			var varMeGustaUsuarioLogeado = false;;
			var varIdLikeUsuario = null;
			
            var snap_likes=await refLikes.orderByChild("id_post").equalTo(id_post_buscar).once("value");

            if (snap_likes.val() != null) {
                varContMG = Object.values(snap_likes.val()).length;
				
				snap_likes.forEach((child) => {
					if(child.val().id_usuario == usuarioLogeado.dni){
						varMeGustaUsuarioLogeado = true;
						varIdLikeUsuario = child.key;
					}
				});
            }
			
			crearPostHTML(mydataSet_post[i].key, varComentario, varUrlImgPerfil, varNomUser, varSalida, varRetrasoSalida,
			varDestino, varRetrasoDestino, varFechaComentario, varContMG, varContComent, varCarrousel, varMeGustaUsuarioLogeado, varIdLikeUsuario);
        }
    }

    
}


function agregarMeGusta(idPost){
	var varContador = 0;
	var ref = db.ref("posts");
	
	var post = ref.child(idPost);
	post.on('value', function (snapshot) {
		console.log(snapshot.val());
		console.log(snapshot.key);
		console.log(snapshot.val().contMG);
		
		varContador = snapshot.val().contMG;
	});
	
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

function eliminarMeGusta(idLike){
	var ref = dbRef.child("/likes/" + idLike);

	ref
	.remove()
	.then(function() {
		console.log("Se ha eliminado el like del usuario correctamente");
	})
	.catch(function(error) {
		console.log("Remove failed: " + error.message);
	});

}

