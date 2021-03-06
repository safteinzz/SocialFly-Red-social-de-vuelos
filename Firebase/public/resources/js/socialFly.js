



		/** INICIO METODO CONTADOR DE NOTIFICACION */
		var contadorNotificacion = 0;
	
		//Metodo para incrementar o decrementar el contador cada dos segundos se estara comprobando las notificaciones
		window.setInterval(function(){
			if(contadorNotificacion > 0){
				$('#navNotificacion').css('display','block');
				$('#navNotificacion').text(contadorNotificacion);
				$('#notifacionesSubMenu').css('display','block');
				$('#notifacionesSubMenu').text(contadorNotificacion);
				
				if(contadorNotificacion > 9){
					$('#navNotificacion').text("+9");
					$('#notifacionesSubMenu').text("+9");
				}
			} else {
				$('#navNotificacion').css('display','none');
				$('#notifacionesSubMenu').css('display','none');
			}
		  
		}, 1000);
		
		function incrementarNotificacion(){
			contadorNotificacion++;
		}
		
		function decrementarNotificacion(){
			contadorNotificacion--;
		}
		/** FIN METODO CONTADOR DE NOTIFICACION */
		
		function writeUserData(userId, name, email, imageUrl) {
		  firebase.database().ref('users/' + userId).set({
			username: name,
			email: email,
			profile_picture : imageUrl
		  });
		}
		
		
		
		/** INICIO METODO INICIAR PANTALLA */
		function initPrincipal(){
				
 
			/** INICIO BOTON SUBIR PANTALLA */
			$('.ir-arriba').click(function(){
				$('body, html').animate({
					scrollTop: '0px'
				}, 1000);
			});
		 
			$(window).scroll(function(){
				if( $(this).scrollTop() > 60 ){
					$('.ir-arriba').slideDown(300);
					$('.muroDerecha').css("top", "0px");
					$('#botonesMenuIzquierdo').slideDown(300);
				} else {
					$('.ir-arriba').slideUp(300);
					$('.muroDerecha').css("top", "72px");
					$('#botonesMenuIzquierdo').slideUp(300);
				}
			});
			/** FIN BOTON SUBIR PANTALLA */
			
			/** INICIO METODO PARA QUITAR/PONER LA LUPA DE LOS SEARCH CUANDO SE HACE FOCUS*/
			$('.has-search .form-control').focus(function(){
				$(".form-control-feedback").css("display", "none");
			});
			
			$('.has-search .form-control').blur(function(){
				$(".form-control-feedback").css("display", "block");
			});
			/** FIN METODO PARA QUITAR/PONER LA LUPA DE LOS SEARCH CUANDO SE HACE FOCUS*/
			
			/** INICIO ELIMINAR POST */
			$("#btnEliminarPost").on('click', function(event){
				var idPOST = $(this).data('id');
				if(borrarPost(idPOST)){
					$("#" + idPOST).remove();
				}
			});
			/** FIN ELIMINAR POST */
			
			/** INICIO BUSCADOR DEL PERFIL - VERSION MOVIL */
			$('.buscadorMenu input#search').focus(function(){
				$(".buscadorMenu .icon").addClass("buscadorActivo");
			});
			
			$('.buscadorMenu input#search').blur(function(){
				$(".buscadorMenu .icon").removeClass("buscadorActivo");
			});
			/** FIN BUSCADOR DEL PERFIL - VERSION MOVIL */
			
			/** INICIO BUSCADOR BARRA DE MENU */
			var mostrarMenu = false;
			$("#mostrarOpciones").on('click', function(event){
				if(mostrarMenu){
					$("#subMenu1").removeClass("show");
					$("#subMenu2").removeClass("show");
					$("#subMenu3").removeClass("show");
					$("#Product").removeClass("show");
					$("#Resources").removeClass("show");
					$("#Company").removeClass("show");
					$(".clearfix").removeClass("show");
					
					mostrarMenu = false;
				} else {
					$("#subMenu1").addClass("show");
					$("#subMenu2").addClass("show");
					$("#subMenu3").addClass("show");
					$(".clearfix").addClass("show");
			
					mostrarMenu = true;
				}
			});
			/** FIN BUSCADOR BARRA DE MENU */
			
			/** INICIO ACCION BOTON ME GUSTA */			
			agregarEventoIconoMeGusta();
			
			// Al cambiar los colores del boton por JQuery es necesario implementar un evento hover por JQuery para el boton me gusta
			$('.iconoMeGusta').hover(

				// Funcion cuando el raton esta encima
				function () {
					var idPost = $(this).data('id');
					var divTeGusta = $("#" + idPost + " .teGustaPost");
					var divIconoMeGusta = $("#" + idPost + " .iconoMeGusta");
					divIconoMeGusta.css("cursor","pointer");
					if(divTeGusta.hasClass("dislike")){
					//No tiene funcion porque cuando este en rojo (dislike) no queremos que haga nada
						divIconoMeGusta.css("cursor","no-drop");
					} else if(divTeGusta.hasClass("d-none")){
					//Si tiene la clase es porque todavia no le gusta
						divIconoMeGusta.css("color","#0056b3");
					} else {
					//Si no tiene la clase es porque ya le gustaba el post
						divIconoMeGusta.css("color","#42a05d");
					}
				}, 

				// Funcion cuando el rato deja de estar encima
				function () {
					var idPost = $(this).data('id');
					var divTeGusta = $("#" + idPost + " .teGustaPost");
					var divIconoMeGusta = $("#" + idPost + " .iconoMeGusta");

					if(divTeGusta.hasClass("dislike")){
					//No tiene funcion porque cuando este en rojo (dislike) no queremos que haga nada
					} else if(divTeGusta.hasClass("d-none")){
					//Si tiene la clase es porque todavia no le gusta
						divIconoMeGusta.css("color","#007bff");
					} else {
					//Si no tiene la clase es porque ya le gustaba el post
						divIconoMeGusta.css("color","#4dde76");
					}
				}
			);
			
			
			/** FIN ACCION BOTON ME GUSTA */
			
			
			
			/** INICIO DESHABILITAR RADIO BUTTON DISABLED */
			$('.disabled input[type=radio]').attr('disabled', 'disabled');			
			/** FIN DESHABILITAR RADIO BUTTON DISABLED */
			
			/** INICIO DESHABILITAR RADIO CHECKBOX DISABLED */
			$('.disabled input[type=checkbox]').attr('disabled', 'disabled');			
			/** FIN DESHABILITAR RADIO CHECKBOX DISABLED */
			
			
			/** TODAS LAS PANTALLAS TENDRAN UNA FUNCION INIT A LA QUE SE LLAMARA */
			initPantalla();
			
			bs_input_file();
			
		}
		/** FIN METODO INICIAR PANTALLA */
		
		/** INICIO CARGAR IMAGEN EN EL MODAL */
				
		function abrirModalIMG(imagenParaModal){
			$("#imagenDelModal").attr("src",imagenParaModal);
		}
		
		function abrirModalIMGCarrousel(imagenParaModal){
			$("#imagenDelModal").attr("src",imagenParaModal);
			$('#modalIMG').modal('show');
		}
		/** FIN CARGAR IMAGEN EN EL MODAL */
		
		
		/** INICIO ELIMINAR POST */
		function abrirModalDelete(idPOST){
			$("#btnEliminarPost").attr("data-id",idPOST);
		}
		/** FIN ELIMINAR POST */
		
		/** INICIO EVENTOS ICONO ME GUSTA DEL POST */
		function agregarEventoIconoMeGusta(){
			$(".iconoMeGusta").on('click', function(event){
				clickIconoMeGusta($(this).data('id'));
			});
		}
		
		var idPostComentarios;
		function clickIconoComent(idPost, varIdUsuario){
			idPostComentarios = idPost;
			
			$('.contenidoMensajes').html("<div class='comentarioPOST' id='comment1'></div>");
			
			$("#modalComent").attr("data-user", varIdUsuario);
			
			cargarComentarios(idPost);
		}
		
		var uidUsuarioMensaje;
		function clickIconMensaje(uidUsuario){
			uidUsuarioMensaje = uidUsuario;
		}
		
		
		function clickIconoMeGusta(idPost, uidUsuario){
			var divTeGusta = $("#" + idPost + " .teGustaPost");
			var divIconoMeGusta = $("#" + idPost + " .iconoMeGusta");
			var spanContadorMegusta = $("#" + idPost + " .contadorMegusta");
			
			// Cambio de colores y muestra de mensaje segun si ya le gustaba el post o no
			if(divTeGusta.hasClass("dislike")){
				
			} else if(divTeGusta.hasClass("d-none")){
				//Si tiene la clase es porque todavia no le gusta
				divTeGusta.removeClass("d-none");
				divTeGusta.removeAttr("style");
				divTeGusta.removeClass("dislike");
				divTeGusta.addClass("like");
				divIconoMeGusta.css("color","#4dde76");
				
				
				//Metodo para sumar un me gusta al comentario por parte del usuario logeado
				var numeroContador = parseInt(spanContadorMegusta.text()) + 1;
				spanContadorMegusta.text(numeroContador);
				
				agregarMeGusta(idPost, uidUsuario);
			} else {
				//Si no tiene la clase es porque ya le gustaba el post
				divTeGusta.removeClass("like");
				divIconoMeGusta.css("color","#d42e2e");
				var numeroContador = parseInt(spanContadorMegusta.text()) - 1;
				spanContadorMegusta.text(numeroContador);
				divTeGusta.addClass("dislike").fadeIn( 300 ).delay( 1600 ).slideUp( 400 );
				
				setTimeout(function(){
					divTeGusta.addClass("d-none");
					divTeGusta.removeClass("dislike");
					divIconoMeGusta.css("color","#007bff");
				}, 2000);
				
				//Metodo para restar un comentario por parte del usuario logeado
				var varIdLike = $("#" + idPost + " #inputIdLike").val();
				eliminarMeGusta(varIdLike);
			}
		}
		/** FIN EVENTOS ICONO ME GUSTA DEL POST */
		
		/** INICIO BUSCADOR DE ARCHIVOS */
		function bs_input_file() {
			$(".input-file").before(
				function() {
					if ( ! $(this).prev().hasClass('input-ghost') ) {
						var element = $("<input id='inputFileImagen' type='file' class='input-ghost' style='visibility:hidden; height:0' multiple>");
						element.attr("name",$(this).attr("name"));
						element.change(function(){
							var namesFile = "";
							//var names = [];
							for (var i = 0; i < $(element).get(0).files.length; ++i) {
								//names.push($(element).get(0).files[i].name);
								namesFile += $(element).get(0).files[i].name;
								if(i < ($(element).get(0).files.length - 1)){
									namesFile += "; ";
								}
							}
							element.next(element).find('input').val(namesFile);
						});
						$(this).find("button.btn-choose").click(function(){
							element.click();
						});
						$(this).find("button.btn-reset").click(function(){
							element.val(null);
							$(this).parents(".input-file").find('input').val('');
						});
						$(this).find('input').css("cursor","pointer");
						$(this).find('input').mousedown(function() {
							$(this).parents('.input-file').prev().click();
							return false;
						});
						return element;
					}
				}
			);
		}
		/** FIN BUSCADOR DE ARCHIVOS */
		
		/** INICIO CREAR NUEVO POST */
		
		function crearPostHTML(varIdPOST, varComentario, varUrlImgPerfil, varNomUser, varIdUsuario, varSalida, varRetrasoSalida,
			varDestino, varRetrasoDestino, varFechaComentario, varContMG, varContComent, varCarrousel, varMeGustaUsuarioLogeado, varIdLikeUsuario, agregarFinal){
			
				
			console.log(varFechaComentario);
			var varStringCarrousel = crearCarrousel(varCarrousel, varIdPOST);
			
			var stringPOST = "<div class='post' id='" + varIdPOST + "'> "
				+ "<div class='header'>";
				
				if(varIdUsuario == usuarioLogeado.uid){
					stringPOST += "<div class='float-right botones botonDelete'>"
							+ "			<a href='#' class='abrirModalDelete' data-target='#modalDelete' data-toggle='modal' onclick='abrirModalDelete(\"" + varIdPOST + "\");'>"
							+ "				<i class='fas fa-trash-alt'></i>"
							+ "			</a>"
							+ "		</div>";
				}
				
			stringPOST += "		<a onclick='abrirModalIMG(\"" + varUrlImgPerfil + "\");' data-target='#modalIMG' data-toggle='modal' class='color-gray-darker c6 td-hover-none abrirModalIMG' style='text-decoration: none;float:left;'>"
				+ "			<img src='" + varUrlImgPerfil + "' width='60' height='60' class='rounded-circle'>"
				+ "		</a>"
				+ "		<a onclick='irPerfilUid(\"" + varIdUsuario + "\");' class='usuarioPost'>"
							+ varNomUser 
				+ "		</a>";
			

			if(varSalida != ""){
			
				stringPOST+= "		<div class='datosVuelo'>"
					+ "			<a href='#' style='text-decoration: none;'>"
					+ "				<div class='salidaVuelo'>"
					+ "					<i class='fas fa-plane-departure'></i>" + varSalida;
					
					if(varRetrasoSalida){
						stringPOST+= "					<i class='vueloRetrasado fas fa-clock'>Retrasado</i>";
					}
					
					
					stringPOST+= "				</div>"
					+ "				<div class='destinoVuelo'>"
					+ "					<i class='fas fa-plane-arrival'></i>" + varDestino;
					
					if(varRetrasoDestino){
						stringPOST+= "					<i class='vueloRetrasado fas fa-clock'>Retrasado</i>";
					}
					
					stringPOST+= "				</div>"
					+ "			</a>"
					+ "		</div>";
			} else {
				stringPOST+= "		<div class='datosVuelo' style='height: 63.2px;'></div>"
			}
			
			
			stringPOST+= "	</div>"
				+ "	<div class='fecha'>"
						+ varFechaComentario
				+ "	</div>"
				+ "	<div class='comentario'>"
				+ "		<p>"
						+ varComentario.replace(new RegExp("\n","g"), "<br/>")
				+ "		</p>"
				
				// Agregamos la parte del carrousel, si no tiene imagenes vendra un string vacio
				+ varStringCarrousel
				
				+ "	</div>"
				+ "	<div class='pie'>"
				+ "		<div class='informacionPost'>"
				+ "			<div class='informacionMG float-left'>"
				+ "				<span class='contadorMegusta'>" + varContMG + "</span> me gusta/s, <span class='contadorComentarios'>" + varContComent + "</span> comentario/s"
				+ "			</div>";
				
				if(varMeGustaUsuarioLogeado){
					stringPOST+=  "			<div class='botones float-right'>"
								+ "				<a class='iconoMeGusta' style='margin-right:15px; color:#4dde76;' onclick='clickIconoMeGusta(\"" + varIdPOST + "\", \"" + varIdUsuario + "\");'><i class='fas fa-thumbs-up'></i></a>"
								+ "				<a href='#' data-target='#modalComent' data-toggle='modal' onclick='clickIconoComent(\"" + varIdPOST + "\", \"" + varIdUsuario + "\");' >"
								+ "					<i class='fas fa-comments'></i>"
								+ "				</a>"
												
								+ "			</div>"
								+ "			<div class='teGustaPost like'><input type='hidden' id='inputIdLike' value='" + varIdLikeUsuario + "'></div>";
				} else {
					stringPOST+=  "			<div class='botones float-right'>"
								+ "				<a class='iconoMeGusta' style='margin-right:15px;' onclick='clickIconoMeGusta(\"" + varIdPOST + "\", \"" + varIdUsuario + "\");'><i class='fas fa-thumbs-up'></i></a>"
								+ "				<a href='#' data-target='#modalComent' data-toggle='modal' onclick='clickIconoComent(\"" + varIdPOST + "\", \"" + varIdUsuario + "\");' >"
								+ "					<i class='fas fa-comments'></i>"
								+ "				</a>"
												
								+ "			</div>"
								+ "			<div class='teGustaPost d-none'><input type='hidden' id='inputIdLike' value='" + varIdLikeUsuario + "'></div>";
				}
				
				stringPOST+= "		</div>"
				+ "	</div>"
				+ "	</div>";
				
			
			// Sumamos uno al contador del post
			varContadorPostPublicidad++;
			
			// Si ya tenemos tres post sumamos un post de publicidad entre medias del muro (PARA VERSION MOVIL)
			if(varContadorPostPublicidad == 4){
				stringPOST += crearPublicidadMuro();
				varContadorPostPublicidad = 0;
			}
			
			if(agregarFinal){
				$('.muro .post').last().after(stringPOST);
			} else {
				$('.muro .post').first().before(stringPOST);
			}
			
			
			varContadorPost++;
		}
		/** FIN CREAR NUEVO POST */
		
		/** INICIO CREAR CARROUSEL */
		function crearCarrousel(varCarrousel, varIdPOST){
			var varStringCarrousel = "";
			var varIdCarrousel= "carrousel" + varIdPOST;
			
			if(varCarrousel != null && varCarrousel.length > 0){
				
				// 	<!-- INICIO CAROUSEL -->
				varStringCarrousel = 
					"	<div id='" + varIdCarrousel + "' class='carousel slide' data-ride='carousel'>"
					+ "		<ol class='carousel-indicators'>";
					
					for (var x = 0; x < varCarrousel.length; x++) {
						if( x == 0){
							varStringCarrousel += "<li data-target='#" + varIdCarrousel + "' data-slide-to='" + x + "' class='active'></li>";
						} else {
							varStringCarrousel += "<li data-target='#" + varIdCarrousel + "' data-slide-to='" + x + "'></li>";
						}
					} 
					
				varStringCarrousel +=
					"		</ol>"
					+ "		<div class='carousel-inner'>";
					
					for (var x = 0; x < varCarrousel.length; x++) {
						if( x == 0){
							varStringCarrousel += "			<div class='carousel-item active'>"
						} else {
							varStringCarrousel += "			<div class='carousel-item'>"
						}
						
						
						varStringCarrousel += 
					 "				<img onclick='abrirModalIMGCarrousel(\"https://firebasestorage.googleapis.com/v0/b/pcsocialfly.appspot.com/o/" + varCarrousel[x] + "?alt=media\");' class='d-block w-100 mx-auto imagenCarousel' src='https://firebasestorage.googleapis.com/v0/b/pcsocialfly.appspot.com/o/" + varCarrousel[x] + "?alt=media' alt='" + x + " slide'>"
					+ "			</div>";
						
					} 
				
				varStringCarrousel +=
					 "		</div>"
					+ "		<a class='carousel-control-prev' href='#" + varIdCarrousel + "' role='button' data-slide='prev'>"
					+ "			<span class='carousel-control-prev-icon fas fa-chevron-left' aria-hidden='true'></span>"
					+ "			<span class='sr-only'>Previous</span>"
					+ "		</a>"
					+ "		<a class='carousel-control-next' href='#" + varIdCarrousel + "' role='button' data-slide='next'>"
					+ "			<span class='carousel-control-next-icon fas fa-chevron-right' aria-hidden='true'></span>"
					+ "			<span class='sr-only'>Next</span>"
					+ "		</a>"
					+ "	</div>";
				//	<!-- FIN CAROUSEL -->
			}
			
			return varStringCarrousel;
		}
		/** FIN CREAR CARROUSEL */
		
		
		
		
		/** INICIO CREAR COMENTARIO */
		
		function crearComentarioHTML(idComent, varTextoComentario, varIdUsuario, varNomUser, varUrlImgPerfil, varFechaComentario){
			
			var idComment = "comment" + idComent;

			var stringComment = "";
			
				if(varIdUsuario == usuarioLogeado.uid){
					stringComment += "<div class='comentarioPOST comentarioUsuarioLogeado' id='" + idComment + "'>"
								+ "		<div class='header'>";
				} else {
					stringComment += "<div class='comentarioPOST comentarioUsuario' id='" + idComment + "'>"
								+ "		<div class='header'>";
				}
				
				stringComment += "			<a href='#' class='color-gray-darker c6 td-hover-none imagenPerfil' style='text-decoration: none;'>"
								+ "				<img src='"
													+ varUrlImgPerfil
								+ "					' width='30' height='30' class='rounded-circle'>"
								+ "			</a>";
				
				stringComment += "			<a href='#' class='usuarioPost'>"
								+ varNomUser
				+ "			</a>"
				+ "		</div>";
				
				
				if(varIdUsuario == usuarioLogeado.uid){
					stringComment += "		<p class='comentarioLogeado'>"
												+ varTextoComentario.replace(new RegExp("\n","g"), "<br/>")
									+ "		</p>";
				} else {
					stringComment += "		<p class='comentarioPersonal'>"
												+ varTextoComentario.replace(new RegExp("\n","g"), "<br/>")
									+ "		</p>";
				}
				
				stringComment +=  "		<div class='fecha'>"
							+ varFechaComentario
				+ "		</div>"
				+ "	</div>";
			
			$('.contenidoMensajes .comentarioPOST').last().after(stringComment);
			
			// Hace que el scroll baje hasta abajo cada vez que se añada un comentario nuevo
			$('#modalComent .contenidoMensajes').animate({
				scrollTop: $('#modalComent .contenidoMensajes')[0].scrollHeight
			}, 1000);
				
			
		}
		/** FIN CREAR COMENTARIO */
		
		
		/** INICIO CREAR PUBLICIDAD MURO CENTRAL - VERSION MOVIL */
		var varContadorPostPublicidad = 0; //Este contador cuando llegue a tres es cuando meterá una post de publicidad
		var contadorPublicidad = 0;
		function crearPublicidadMuroCentral(isMuroCentral, varId, varNombreEmpresa, varIdUsuario, varNombreAeropuerto, varComentarioPublicidad, varCarrousel, varMedia){
			contadorPublicidad++;
			var varIdPOST = "publicidad" + varId + contadorPublicidad;
			
			
			var varStringCarrousel = crearCarrousel(varCarrousel, varIdPOST);
			
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
			
			
			
			var stringComment = 
			"	<div class='post publicidad'>"
			+ "		<div class='header'>";
			
			if(isMuroCentral){
				stringComment += "			<div class='tituloPublicidad'>Publicidad</div>";
			}
			
			stringComment += "			<a href='https://pcsocialfly.web.app/pages/publicidad.html?id=" + varId + "' class='usuarioPost'>"
							+ varNombreEmpresa
			+ "			</a>"
			+ "			<div class='datosVuelo'>"
			+ "				<a href='https://pcsocialfly.web.app/pages/publicidad.html?id=" + varId + "' style='text-decoration: none;'>"
			+ "					<div class='salidaVuelo'>"
									+ varNombreAeropuerto
			+ "					</div>"
			+ "				</a>"
			+ "			</div>"
			+ "		</div>"
			+ " 	<div style='color:#4dde76;'>"
			+ 			stringEstrellas
			+ "		</div>"
			+ "		<div class='comentario'>"
			+ "			<p>"
							+ varComentarioPublicidad
			+ "			</p>"
												
						+	varStringCarrousel
			+ "		</div>"
			+ "	</div>";
			
			return stringComment;
		}
		/** FIN CREAR PUBLICIDAD MURO CENTRAL - VERSION MOVIL */
		
		function ocultarDiv(varIdDiv){
			$(varIdDiv).css('display','none');
		}
		
		function formatDate(varDate){
			var datestring = varDate.getDate()  + "/" + (varDate.getMonth()+1) + "/" + varDate.getFullYear() + " " +
					varDate.getHours() + ":" + varDate.getMinutes();
			return datestring;
		}
		
		function formatStringtoDate(stringFecha){
			// dd/MM/yyyy HH:mm:ss
			var separarFecha = stringFecha.split(" ");
			var separarDia = separarFecha[0].split("/");
			var separarHora = separarFecha[1].split(":");
			
			return new Date(separarDia[2], separarDia[1], separarDia[0], separarHora[0], separarHora[1], separarHora[2]);
		}
		
		function compararArrayPost(a, b){
			if(formatStringtoDate(a.val().fecha_post) > formatStringtoDate(b.val().fecha_post)) return -1;
			if(formatStringtoDate(b.val().fecha_post) > formatStringtoDate(a.val().fecha_post)) return 1;
			
			return 0;
		}
		
		
		function getParameterByName(name, url) {
			if (!url) url = window.location.href;
			name = name.replace(/[\[\]]/g, '\\$&');
			var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
				results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, ' '));
		}