$(document).ready(function () {
	//var an = ($('body').width());
	var al = ($('body').height())+1;
	//var a = al-147;
	/*$('div.item').css({width: $('body').width()+'px', height:al+'px'});

	$(".item").css({'min-width': an, 'max-width': an, 'max-height':a});

	$('#gallery').touchSlider({
			mode: 'index'
		});
	*/

	
	var alCn = al-129;
	$('.cont_main').css({height:alCn+'px'});
	var alCitm = alCn-48;
	$('.cont_item_lst').css({height:alCitm+'px'});

	if(localStorage.getItem('usu_alm') != null){
	   	document.getElementById('mail').value = localStorage.getItem('usu_alm');
	   	document.getElementById('clave').value = localStorage.getItem('clv_alm');
	}

	$("body").on('click', '#btn_login', function(e){
		if( $("#mail").val() == ""){
			$("#mail").focus().after("<span class='menError'>Ingresa un usuario</span>");
			return false;
		}else if( $("#clave").val() == ""){
			$("#clave").focus().after("<span class='menError'>Ingresa clave</span>");
			return false;
		}else{
			var usu = $("#mail").val();
			var clv = $("#clave").val();
			$.ajax({
				type: 'POST',
				dataType: 'json', 
				data: {usu:usu, clv:clv},
				beforeSend : function (){
		            $(".main").css({display: 'inline-block'});
		        },
				url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/login",
				success : function(data) {
					$(".main").css({display: 'none'});
					if(data != 0){
						localStorage.setItem('usu_alm', usu);
						localStorage.setItem('clv_alm', clv);
						$("#d_usu h1").html(data.nombre_usu);
						$.mobile.changePage("#datos");
					}else{
						alert("usuario o contraseña incorrectos")
					}
				},
				error: function(data){
					console.log(data);
			    }
			});
		}
	});

	$("#mail, #clave").keyup(function(){
		if( $(this).val() != "" ){
			$(".menError").fadeOut();			
			return false;
		}		
	});

	/*$("body").on('click', '#btn_ven', function(e){
		$('div.item').css({width: $('body').width()+'px', height:al+'px'});
		$('#cont_ven').css({'max-height': a});
		$('#gallery').touchSlider({mode: 'index'});

		$.mobile.changePage("#venta");
		
	});
*/
	
});

$( window ).load(function() {
});