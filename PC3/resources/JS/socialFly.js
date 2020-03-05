/** INICIO METODO CONTADOR DE NOTIFICACION */
		var contadorNotificacion = 0;
	
		window.setInterval(function(){
			incrementarNotificacion();
			if(contadorNotificacion > 0){
				$('#navNotificacion').css('display','block');
				$('#navNotificacion').text(contadorNotificacion);
				
				if(contadorNotificacion > 9){
					$('#navNotificacion').text("+9");
				}
			} else {
				$('#navNotificacion').css('display','none');
			}
		  
		}, 2000);
		
		function incrementarNotificacion(){
			contadorNotificacion++;
		}
		
		function decrementarNotificacion(){
			contadorNotificacion--;
		}
		/** FIN METODO CONTADOR DE NOTIFICACION */
		
		
		
		
		
		/** INICIO METODO INICIAR PANTALLA */
		$(document).ready(function(){
 
			/** INICIO BOTON SUBIR PANTALLA */
			$('.ir-arriba').click(function(){
				$('body, html').animate({
					scrollTop: '0px'
				}, 300);
			});
		 
			$(window).scroll(function(){
				if( $(this).scrollTop() > 60 ){
					$('.ir-arriba').slideDown(300);
					$('.muroDerecha').css("top", "0px");
					
				} else {
					$('.ir-arriba').slideUp(300);
					$('.muroDerecha').css("top", "72px");
				}
			});
			/** FIN BOTON SUBIR PANTALLA */
			
			
			/** INICIO ELIMINAR POST */
			$(".abrirModalDelete").on('click', function(event){
				var idPOST = $(this).data('id');
				$("#btnEliminarPost").attr("data-id",idPOST);
			});
			
			$("#btnEliminarPost").on('click', function(event){
				var idPOST = $(this).data('id');
				$("#" + idPOST).remove();
			});
			/** FIN ELIMINAR POST */
			
			
			/** INICIO CARGAR IMAGEN EN EL MODAL */
			$(".abrirModalIMG").on('click', function(event){
				var imagenParaModal = $(this).data('id');
				$("#imagenDelModal").attr("src",imagenParaModal);
			});
			
			$(".imagenCarousel").on('click', function(event){
				var imagenParaModal = $(this).data('id');
				$("#imagenDelModal").attr("src",imagenParaModal);
				$('#modalIMG').modal('show');
			});
			/** FIN CARGAR IMAGEN EN EL MODAL */
			
			/** INICIO METODO PARA QUITAR/PONER LA LUPA DE LOS SEARCH CUANDO SE HACE FOCUS*/
			$('.has-search .form-control').focus(function(){
				$(".form-control-feedback").css("display", "none");
			});
			
			$('.has-search .form-control').blur(function(){
				$(".form-control-feedback").css("display", "block");
			});
			/** FIN METODO PARA QUITAR/PONER LA LUPA DE LOS SEARCH CUANDO SE HACE FOCUS*/
			
			
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
			$(".iconoMeGusta").on('click', function(event){
				var idPost = $(this).data('id');
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
				}
			});
			
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
			
		});
		/** FIN METODO INICIAR PANTALLA */
		