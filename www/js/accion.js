$(document).ready(function () {

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
						$("#d_usu h1").html(data.apellido_usu+", "+data.nombre_usu);
						$.mobile.changePage("#datos");
					}else{
						alert(data)
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
});

