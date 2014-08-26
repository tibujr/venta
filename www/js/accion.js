$(document).ready(function () {

	$(".lst_campos").animate({scrollTop: 0});
	$("#cont_contacto").animate({scrollTop: 0});

//*************************************** BASE DE DATOS WEBSQL

	var db;
	var shortName = 'ventaBD';
	var version = '1.0';
	var displayName = 'ventas';
	var maxSize = 65535;

	inicarBD();

         
	function errorBD(transaction, error)
	{
		alert('Error: ' + error.message + ' code: ' + error.code);
	}
    
    function exitoBD(){}
  
    function nullHandler(){}
         
    function inicarBD()
    {
		if (!window.openDatabase) {
			alert('Error con base de datos: Contactar con el administrador');
			return;
		}
		db = openDatabase(shortName, version, displayName,maxSize);
		db.transaction(function(tx){
			/*tx.executeSql( 'DROP TABLE tb_usuario',nullHandler,nullHandler);
			tx.executeSql( 'DROP TABLE tb_prospecto',nullHandler,nullHandler);
			tx.executeSql( 'DROP TABLE tb_cuenta',nullHandler,nullHandler);
			tx.executeSql( 'DROP TABLE tb_contacto',nullHandler,nullHandler);
			tx.executeSql( 'DROP TABLE tb_fase',nullHandler,nullHandler);
			tx.executeSql( 'DROP TABLE tb_estado',nullHandler,nullHandler);*/

        	tx.executeSql('CREATE TABLE IF NOT EXISTS tb_usuario(id INTEGER NOT NULL PRIMARY KEY, nombre TEXT, mail TEXT, clave TEXT)', [],nullHandler,errorBD);
        	tx.executeSql('CREATE TABLE IF NOT EXISTS tb_prospecto(id INTEGER NOT NULL PRIMARY KEY, id_cuenta INTEGER, id_contacto INTEGER, presupuesto DOUBLE, necesidad TEXT, propuesta TEXT, fecha_aprox DATE, id_fase INTEGER, id_estado INTEGER, cambio TEXT)', [],nullHandler,errorBD);
        	tx.executeSql('CREATE TABLE IF NOT EXISTS tb_cuenta(id INTEGER NOT NULL PRIMARY KEY, ruc TEXT, razon_social TEXT, volumen_venta DOUBLE, cambio TEXT)', [],nullHandler,errorBD);
        	tx.executeSql('CREATE TABLE IF NOT EXISTS tb_contacto(id INTEGER NOT NULL PRIMARY KEY, id_cuenta INTEGER, nombre TEXT, apellido TEXT, mail TEXT, celular TEXT, cambio TEXT)', [],nullHandler,errorBD);
        	tx.executeSql('CREATE TABLE IF NOT EXISTS tb_fase(id INTEGER NOT NULL PRIMARY KEY, descripcion TEXT)', [],nullHandler,errorBD);
        	tx.executeSql('CREATE TABLE IF NOT EXISTS tb_estado(id INTEGER NOT NULL PRIMARY KEY, descripcion TEXT)', [],nullHandler,errorBD);
		},errorBD,exitoBD);
	}
        
	/*function agregarItem()
	{
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		}
        db.transaction(function(transaction) {
			transaction.executeSql('INSERT INTO User(FirstName, LastName) VALUES (?,?)',[$('#nombre').val(), $('#apellido').val()], nullHandler,errorHandler);
		});  
        ListDBValues();
        return false;
	}*/
//*********************************************** FIN BASE DE DATOS WEBSQL
	
	//metodos inicializando
	mostrarRequisitosHtml();

	var reqArr = [];
	var rucE, rsE, nomE, apeE, preE, necE, proE, fecE, camCuE = 'n', camCoE = 'n', camPrE = 'n'; //campos editar venta

	var idFase = 1; // ID de la Fase que se muestra el prospecto
	var al = ($('body').height())+1;
	var an = $('body').width();

	$("#popup_fnd").css({height: al});
	$("#popup_fnd").css({width: an});
	
	var cad = "100% "+al+"px";
	$('#inicio').css({'background-size':cad});

	var alCn = al-129;
	$('.cont_main').css({height:alCn+'px'});
	//$('.popup_Nusu, .popup_Nusu_n').css({height:alCn+'px'});
	var alCitm = alCn-52; //alCn-48
	$('.cont_item_lst').css({height:alCitm+'px'});
	$('.cont_item_lst').animate({scrollTop: 0});

	//var alCitm = alCn-52;

	//var alCam = alCitm - 2;
	$('.lst_campos').css({height:alCitm+'px'});

	//asignando valor para saber si trabaja on o offline
	localStorage.setItem('onof', 'on');

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
			idFase = 1;
			var usu = $("#mail").val();
			var clv = $("#clave").val();
			if(localStorage.getItem('onof') == 'on')
			{
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
							console.log("login online")
							localStorage.setItem('id_usu', data.id_usu);
							localStorage.setItem('usu_alm', usu);
							localStorage.setItem('clv_alm', clv);
							$("#d_usu h1").html(data.nombre_usu);

							//llenando tabla websql usuario
							db.transaction(function(tx){
		             			tx.executeSql('DELETE FROM tb_usuario',nullHandler,nullHandler);
		             			tx.executeSql('INSERT INTO tb_usuario(id, nombre, mail, clave) VALUES (?,?,?,?)',[data.id_usu, data.nombre_usu, usu, clv], nullHandler,errorBD);
				            });

				            llenarVentaBD(data.id_usu);

							$.mobile.changePage("#venta", { transition: "slide"/*, changeHash: false */});
						}else{
							alert("usuario o contraseña incorrectos")
						}
					},
					error: function(data){
						console.log(data);
				    }
				});
			}else{
				db.transaction(function(transaction) {
					transaction.executeSql("SELECT * FROM tb_usuario", [],
					function(transaction, result) {
						if (result != null && result.rows.length > 0) {
		                 	var row = result.rows.item(0);
		                 	if(row.mail == usu && row.clave == clv)
							{
								localStorage.setItem('id_usu', row.id);
								console.log(" login offline")
								$("#d_usu h1").html(row.nombre);
								$.mobile.changePage("#venta", {transition:"slide"});
								mostrarDataOffline();
							}else{
								alert("usuario o contraseña incorrectos")
							}
		               	}else{
		               		alert("Debe iniciar una coneccion a internet para continuar")
		               	}
		          	},errorBD);
		       	},errorBD,nullHandler);
			}
		}
	});

	$("#mail, #clave").keyup(function(){
		if( $(this).val() != "" ){
			$(".menError").fadeOut();			
			return false;
		}		
	});

	$("body").on('click', '#agregar_contacto_np', function(e){
		if( $("#ndeci").val() == ""){
			$("#ndeci").focus().after("<span class='menError'>Ingrese nombre</span>");
			return false;
		}else if( $("#pdeci").val() == ""){
			$("#pdeci").focus().after("<span class='menError'>Ingrese apellido</span>");
			return false;
		}else{

			var ntap = $("#ndeci").val();
			var atap = $("#pdeci").val();

			$("#nomConNP").val(ntap);
			$("#apeConNP").val(atap);

			$("#agre_cont").fadeOut();
			$("#popup_fnd").fadeOut();

			$("#nom_deci").val(ntap+" "+atap).prop('disabled', true);
		}
	});

	$("#ndeci, #pdeci").keyup(function(){
		if( $(this).val() != "" ){
			$(".menError").fadeOut();			
			return false;
		}		
	});

	$("body").on('click', '#btn_venta', function(e){
		var id = $('#cboFase').val();
		if(localStorage.getItem('onof') == 'on'){
			//llenarFase();
			listarProspecto(id);
		}else{
			mostrarDataOffline()
		}
		$.mobile.changePage("#venta", {transition:"slide"});
	});

	$("body").on('click', '#btn_actividad', function(e){
		$.mobile.changePage("#actividad", {transition:"slide"});
		
	});

	$("body").on('click', '#btn_contacto', function(e){
		$.mobile.changePage("#contactos", {transition:"slide"});
	});

	$("body").on('click', '#onOf', function(e) {
		if(localStorage.getItem('onof') == 'on'){
			$("#bloq_wifi").css({display:'inline-block'});
			localStorage.setItem('onof','of');
		}else{
			$("#bloq_wifi").css({display:'none'});
			localStorage.setItem('onof','on');
		}
	});

	$("body").on('change', '#cboFase', function(e){
		var id = $('#cboFase').val();
		idFase = id; 
		if(localStorage.getItem('onof') == 'on')
		{
			listarProspecto(id);
		}else{
			listarProspectoOff(id);
		}
	});

	$("body").on("click",".btn_opc_item", function(e){
		var idv = this.id;
		$('#id_pros').val(idv);
		$('#accion_frm').val("editar");

		$(".nvo_pros").css({display: 'inline-block'});

		if(localStorage.getItem('onof') == 'on')
		{
			getProspectoIdOn(idv);
		}else{
			getProspectoIdOff(idv);
		}

		$.mobile.changePage("#formulario_venta", {transition:"slidedown"});

	});

	$("body").on("click","#btn_add_venta", function(e){

		$(".nvo_pros").css({display: 'none'});

		$('#accion_frm').val("nuevo");
		$('#id_pros').val("");
		$('#id_cuen').val("");
		$('#id_con').val("");
		$("#rsoc").val("").prop('disabled', false);
		$("#nom_deci").val("").prop('disabled', false);
		$("#presu").val("");
		$("#nece").val("");
		$("#prop").val("");
		$("#fecha_aprox").val("");

		$("#ndeci").val("");
		$("#pdeci").val("");
		
		$("#nomConNP").val("");
		$("#apeConNP").val("");

		for (var i = 0; i < reqArr.length; i++) {
			var a = "req_"+reqArr[i];
			var b = "reqc_"+reqArr[i];
			
			$('#'+a+":checkbox").prop('checked', false);
			$('.'+b+" span span.ui-icon").addClass( "ui-icon-checkbox-off" )
			$('.'+b+" span span.ui-icon").removeClass( "ui-icon-checkbox-on" )
		};

		/*if(localStorage.getItem('onof') == 'on')
		{
			//getProspectoIdOn(idv);
		}else{
			getProspectoIdOff(idv);
		}*/
		$.mobile.changePage("#formulario_venta", {transition:"slidedown"});
	});

	$("body").on("focus",".inpt_sel", function(e){
		$("."+this.id).css({color:'#DF2047'});
	});

	$("body").on("blur",".inpt_sel", function(e){
		$("."+this.id).css({color:'#a9a9a9'});
	});

	$("body").on("click","#btn_guardar_frm", function(e){
		if($('#accion_frm').val() == "editar"){
			//FORMULARIO VENTA EDITAR
			var id = $('#id_pros').val();
			//$(".lst_itm").html("");
			if(localStorage.getItem('onof') == 'on')
			{
				editProspectoOn(id);
				//$.mobile.changePage("#venta", {transition:"slideup"});
			}else{
				editProspectoOff(id);
				//$.mobile.changePage("#venta", {transition:"slideup"});
			}
			$.mobile.changePage("#venta", {transition:"slideup"});
		}else{
			if( $("#rsoc").val() == ""){
				$("#rsoc").focus().after("<span class='menError'>Ingresar Razon social</span>");
				return false;
			}else if( $("#nom_deci").val() == ""){
				$("#nom_deci").focus().after("<span class='menError'>Ingresar decisor</span>");
				return false;
			}else if( $("#presu").val() == ""){
				$("#presu").focus().after("<span class='menError'>Ingresar presupuesto</span>");
				return false;
			}else if( $("#nece").val() == ""){
				$("#nece").focus().after("<span class='menError'>Ingresar necesidad</span>");
				return false;
			}else if( $("#fecha_aprox").val() == ""){
				$("#fecha_aprox").focus()//.after("<span class='menError'>Ingresar fecha aproximada</span>");
				return false;
			}else if( $("#sig_cita").val() == ""){
				$("#sig_cita").focus()//.after("<span class='menError'>Ingresar fecha cita</span>");
				return false;
			}else if( $("#hra_cita").val() == ""){
				$("#hra_cita").focus()//.after("<span class='menError'>Ingresar hora cita</span>");
				return false;
			}else{
				if(localStorage.getItem('onof') == 'on')
				{
					agregarAprospectoOn();
				}
				else{
					
				}
			}
			$.mobile.changePage("#venta", {transition:"slideup"});
		}
	});

	$("#nom_deci, #presu, #nece, #fecha_aprox, #sig_cita, #hra_cita").keyup(function(){
		if( $(this).val() != "" ){
			$(".menError").fadeOut();			
			return false;
		}		
	});

	//$('#rsoc').keyup(function() {
	
	$("body").on("keyup", "#rsoc", function(e){

		$(".menError").fadeOut(); //eliminamos mensaje de error

		var dtb = $("#rsoc").val();
		if(dtb == ""){
			$("#rsoc").autocomplete({source: []});
			$("#nom_deci").autocomplete({source: []});
			$("#nom_deci").val("").prop('disabled', false);
		}

        if (!(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13)) {
        	
        	var usuid = localStorage.getItem('id_usu');
        	$.ajax({
	          	type: 'POST',
				dataType: 'json', 
				data: {dtb:dtb,usuid:usuid},
				cache: false,
				url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/search_empresa",
				success : function(datab) {
	              if (datab != 0) {
	              	console.log(datab)
	                $("#rsoc").autocomplete({
	                  	source: datab,
	                  	minLength: 1,
	                  	autoFocus : true,
	                  	select: function(e,u){ 
	                  		var codCuen = u.item.id_cuen;
				 			$("#id_cuen").val(codCuen); 
	                        $.ajax({
								type: 'POST',
								dataType: 'json', 
								data: {codCuen:codCuen},
								url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/search_contacto",
								success : function(datac) {
	                                if (datac != 0) {
	                                	if(datac.length == 1){
		                                	$("#id_con").val(datac[0].id_con);
                                        	$("#nom_deci").val(datac[0].value).prop('disabled', true);
                                        	$("#presu").focus();
                                        	$("#nom_deci").autocomplete({source: []});
	                                    }else{
	                                    	$("#nom_deci").autocomplete({
							                  	source: datac,
							                  	minLength: 0,
							                  	autoFocus : true,
							                  	select: function(e,u){
										 			$("#id_con").val(u.item.id_con); 
										 		}
										 	}).on('focus', function(event) {
	                                       	 	var self = this;
	                                        	$(self).autocomplete( "search", "");
	                                        });
	                                        $("#nom_deci").focus();
	                                    }
	                                }else{
	                                	$("#nom_deci").autocomplete({source: []});
	                                	alert("debe ingresar un contacto");
	                                	$("#agre_cont").fadeIn();//css({display: 'none'});
										$("#popup_fnd").fadeIn();
										$("#ndeci").focus();
	                                }
								}
							});
						}
	                  });//,html: true
	                }
	          },
	          error: function(data){
	            console.log(data);
	          }
	        });
        }
	});

	$("body").on("change","#activ", function(e){
		if(confirm('¿marcar como terminado?')){
			if($("#activ:checked").val() == "on"){
				var usuid = localStorage.getItem('id_usu');
				var idAct = $("#activ_check").val();

				$.ajax({
					type: 'POST',
					dataType: 'json', 
					data: {usuid:usuid, idAct:idAct},
					beforeSend : function (){
				    },
					url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/evaluarActividad",
					success : function(data) {
						/*if(data != 0){

						}*/
						$('#sig_cita').val("");
						$('#hra_cita').val("");
						$('#activ_check').val("");
						$(".hora_scit").css({width : '45%'});
						$(".check_actv").css({display : 'none'});
						$("#activ:checkbox").prop('checked', false);
						$(".lbact span span.ui-icon").addClass( "ui-icon-checkbox-off" )
						$(".lbact span span.ui-icon").removeClass( "ui-icon-checkbox-on" )
					},
					error: function(data){
						console.log(data);
					}
				});
			}
		}else{
			console.log("no");
			$("#activ:checkbox").prop('checked', false);
		}
	});

	//OFFLINE

	function editProspectoOff(id)
	{
		if(rsE != $('#rsoc').val() || rucE != $('#ruc').val()) camCuE = 's';
		if(nomE != $('#nom_deci').val() || apeE != $('#ape_deci').val()) camCoE = 's';
		if(preE != $('#presu').val() || necE != $('#nece').val() || proE != $('#prop').val() || fecE != $('#fecha_aprox').val()) camPrE = 's';

		//var cu = "UPDATE tb_cuenta SET ruc = '"+$('#ruc').val()+"', razon_social='"+$('#rsoc').val()+"', cambio = '"+camCuE+"' WHERE id ="+$('#id_pros').val();
		//var co = "UPDATE tb_contacto SET nombre = '"+$('#nom_deci').val()+"', apellido='"+$('#ape_deci').val()+"', cambio = '"+camCoE+"' WHERE id ="+$('#id_con').val();
		var pr = "UPDATE tb_prospecto SET presupuesto = '"+$('#presu').val()+"', necesidad='"+$('#nece').val()+"', propuesta='"+$('#prop').val()+"', fecha_aprox='"+$('#fecha_aprox').val()+"', cambio = '"+camPrE+"' WHERE id ="+$('#id_pros').val();
		db.transaction(function(transaction) {
			transaction.executeSql(cu,[], nullHandler,errorBD);
			transaction.executeSql(co,[], nullHandler,errorBD);
			transaction.executeSql(pr,[], nullHandler,errorBD);
		});
		limpiarDataEdit();
		listarProspectoOff(idFase);
		listarFaseOff();
       	return false;
	}

	function limpiarDataEdit()
	{
		rsE = "";
		rucE = "";
		nomE = "";
		apeE = "";
		preE = "";
		necE = "";
		proE = "";
		fecE = "";
		camCuE = "n";
		camCoE = "n";
		camPrE = "n";
	}

	function getProspectoIdOff(id)
	{
		db.transaction(function(transaction) {
			var q = "SELECT p.id, c.id as 'id_cuen', c.ruc,c.razon_social, t.id as 'id_cont', t.nombre, t.apellido, p.presupuesto,  p.necesidad,  p.propuesta,  p.fecha_aprox FROM tb_prospecto p INNER JOIN tb_cuenta c ON p.id_cuenta = c.id INNER JOIN tb_contacto t ON p.id_contacto = t.id WHERE p.id ="+id;
			transaction.executeSql(q, [],
			function(transaction, result) {
				if (result != null && result.rows.length > 0) {
					var row = result.rows.item(0);
					$("#rsoc").val(row.razon_social);
					$("#ruc").val(row.ruc);
					$("#nom_deci").val(row.nombre);
					$("#ape_deci").val(row.apellido);
					$("#presu").val(row.presupuesto);
					$("#nece").val(row.necesidad);
					$("#prop").val(row.propuesta);
					$("#fecha_aprox").val(row.fecha_aprox);

					$('#id_pros').val(row.id);
					$('#id_cuen').val(row.id_cuen);
					$('#id_con').val(row.id_cont);

					rsE = row.razon_social;
					rucE = row.ruc;
					nomE = row.nombre;
					apeE = row.apellido;
					preE = row.presupuesto;
					necE = row.necesidad;
					proE = row.propuesta;
					fecE = row.fecha_aprox;
				}
			},errorBD);
		},errorBD,nullHandler);
	}

	function mostrarDataOffline()
	{
		if(localStorage.getItem('onof') == 'of')
		{
			listarFaseOff();
			listarProspectoOff(idFase);
			$( "#cont_reque" ).css({display: 'none'});
		}
	}

	function listarFaseOff()
	{
		$("#cboFase").html("");
		db.transaction(function(transaction) {
			transaction.executeSql("SELECT * FROM tb_fase", [],
			function(transaction, result) {
				if (result != null && result.rows.length > 0) {
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						$("#cboFase").append("<option value='"+row.id+"'>"+row.descripcion+"</option>")
						if(row.id == idFase){ 
							$(".fase_tit div div div span span span").html(row.descripcion)
							$("#cboFase option[value="+ row.id +"]").attr("selected",true);
						}
					}
				}else{
					alert("Debe iniciar una coneccion a internet para continuar")
				}
			},errorBD);
		},errorBD,nullHandler);
	}

	function listarProspectoOff(id)
	{
		$(".lst_itm").html("");
		//var idUsu = localStorage.getItem('id_usu');

		db.transaction(function(transaction) {
			var q = "SELECT p.id, c.id, c.razon_social, p.id_contacto, p.presupuesto FROM tb_prospecto p INNER JOIN tb_cuenta c ON p.id_cuenta = c.id WHERE p.id_fase ="+id;
			transaction.executeSql(q, [],
			function(transaction, result) {
				if (result != null && result.rows.length > 0) {
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						$(".lst_itm").append(" <article class='unid_cont_item'><section class='sect_uno_item'><article class='nom_emp_item'><label>"+row.razon_social+"</label></article><article class='valor_emp_item'><label>"+row.presupuesto+" NUEVOS SOLES</label></article></section><section class='sect_dos_item'><article class='btn_opc_item' id='"+row.id+"'><div class='icon-arrow-down2'></div></article></section></article>");
					}
				}
			},errorBD);
		},errorBD,nullHandler);
	}

	//ONLINE

	function agregarAprospectoOn()
	{
		nomE = $("#nomConNP").val();
		apeE = $("#apeConNP").val();
		preE = $("#presu").val();
		necE = $("#nece").val();
		fecE = $("#fecha_aprox").val();

		var fecha_scit = $('#sig_cita').val();
		var hora_scit = $('#hra_cita').val();
		var usuG = localStorage.getItem('id_usu');
		var idCuenta = $('#id_cuen').val();
		var idContact = $('#id_con').val();

		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {nomE:nomE, apeE:apeE, preE:preE, necE:necE, fecE:fecE, fecha_scit:fecha_scit, hora_scit:hora_scit, usuG:usuG, idCuenta:idCuenta, idContact:idContact},
			beforeSend : function (){
		    },
			url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/guardaNuevoProspecto",
			success : function(data) {
				if(data != 0){
					console.log(data+" : inserto con exito");
					var usuid = localStorage.getItem('id_usu');
					llenarFase()
					llenarProspecto(usuid);
					llenarCuenta(usuid);
					llenarContacto(usuid);
					limpiarDataEdit();
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function editProspectoOn(id)
	{
		/*rsE = $("#rsoc").val();
		rucE = $("#ruc").val();
		nomE = $("#nom_deci").val();
		apeE = $("#ape_deci").val();*/
		preE = $("#presu").val();
		necE = $("#nece").val();
		proE = $("#prop").val();
		fecE = $("#fecha_aprox").val();
		var idProsp = id;
		var idCuenta = $('#id_cuen').val();
		var idContact = $('#id_con').val();
		var fecha_scit = $('#sig_cita').val();
		var hora_scit = $('#hra_cita').val();
		var usuedt = localStorage.getItem('id_usu');

		var idacti = $('#activ_check').val();

		var reqArrTemp = Array();

		var idReq;
		for(i=0; i<reqArr.length; i++)
		{
			if($("#req_"+reqArr[i]+":checked").val() == "on"){
				reqArrTemp[reqArr[i]] = "S";
			}
			else{
				reqArrTemp[reqArr[i]] = "N";
			}
		}

		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {/*rsE:rsE, rucE:rucE, nomE:nomE, apeE:apeE, */preE:preE, necE:necE, proE:proE, fecE:fecE, idProsp:idProsp, idCuenta:idCuenta, idContact:idContact, reqArrTemp:reqArrTemp, fecha_scit:fecha_scit, hora_scit:hora_scit, usuedt:usuedt, idacti:idacti},
			beforeSend : function (){
		    },
			url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/editProspectoOn",
			success : function(data) {
				if(data != 0){
					console.log(data);
					var usuid = localStorage.getItem('id_usu');
					llenarFase()
					llenarProspecto(usuid);
					llenarCuenta(usuid);
					llenarContacto(usuid);
					limpiarDataEdit();
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function getProspectoIdOn(id)//permite traer todos los datos del prospecto incluyendo los requisitos 
	{
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {id:id},
			beforeSend : function (){
		    },
			url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/getProspectoIdOn",
			success : function(data) {
				if(data != 0){
					$("#rsoc").val(data.razon_social_cuen).prop('disabled', true);
					$("#nom_deci").val(data.nombre_con+' '+data.apellido_con).prop('disabled', true);
					/*$("#ruc").val(data.ruc_cuen)
					$("#nom_deci").val(data.nombre_con)
					$("#ape_deci").val(data.apellido_con)*/
					$("#presu").val(data.presupuesto_pros)
					$("#nece").val(data.necesidad_pros)
					$("#prop").val(data.propuesta_pros)
					$("#fecha_aprox").val(data.fecha_cierre_pros)

					$('#id_pros').val(data.id_pros);
					$('#id_cuen').val(data.id_cuen);
					$('#id_con').val(data.id_con);

					$('#sig_cita').val(data.fecha_act);
					$('#hra_cita').val(data.hora_act);
					$('#activ_check').val(data.id_act);

					for (var i = 0; i < reqArr.length; i++) {
						var a = "req_"+reqArr[i];
						var b = "reqc_"+reqArr[i];
						if(data[a] == "S"){
							$('#'+a+":checkbox").prop('checked', true);
							$('.'+b+" span span.ui-icon").removeClass( "ui-icon-checkbox-off" )
							$('.'+b+" span span.ui-icon").addClass( "ui-icon-checkbox-on" )
						}else{
							$('#'+a+":checkbox").prop('checked', false);
							$('.'+b+" span span.ui-icon").addClass( "ui-icon-checkbox-off" )
							$('.'+b+" span span.ui-icon").removeClass( "ui-icon-checkbox-on" )
						}
					}

					console.log("actividad "+data.id_act)

					//agregar o quitar check actividad
					if(data.hoy == 'S'){
						$(".hora_scit").css({width : '30%'});
						$(".check_actv").css({display : 'inline-block'});
					}else{
						$(".hora_scit").css({width : '45%'});
						$(".check_actv").css({display : 'none'});
					}
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function llenarVentaBD(id)
	{
		if(localStorage.getItem('onof') == 'on'){
			llenarFase();
			llenarEstado();

			llenarProspecto(id);
			llenarCuenta(id);
			llenarContacto(id);
			$( "#cont_reque" ).css({display: 'inline-block'});
		}
	}



	function mostrarRequisitosHtml()
	{
		if(localStorage.getItem('onof') == 'on'){
			$.ajax({
				type: 'POST',
				dataType: 'json', 
				data: {},
				beforeSend : function (){
			    },
				url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/getRequisitos",
				success : function(data) {
					if(data != 0){
						for(var i=0; i< data.length; i++)
						{
							reqArr[i]=data[i]['id_req'];
							$( "#cont_reque" ).append("<article class='cont_req cont_ckh_reg'><input type='checkbox' name='req_"+data[i]['id_req']+"' id='req_"+data[i]['id_req']+"' class='chkocultar'/><label class='lblcheck reqc_"+data[i]['id_req']+"' for='req_"+data[i]['id_req']+"' >"+data[i]['descripcion_req']+"</label></article>");
						}
					}
				},
				error: function(data){
					console.log(data);
				}
			});
		}
	}

	function llenarProspecto(id)
	{
		var idP,idC,idO,pre,nec,prop,fecha,idFa,idE, cam;

		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {id:id},
			beforeSend : function (){
		    },
			url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/getProspectoUser",
			success : function(data) {
				if(data != 0){
					db.transaction(function(tx){
						tx.executeSql("DELETE FROM tb_prospecto",nullHandler,nullHandler);
						//tx.executeSql("DELETE FROM tb_prospecto where cambio='n'",nullHandler,nullHandler);
						for(var i=0; i< data.length; i++)
						{ 
							idP = data[i]['id_pros'];
							idC = data[i]['id_cuen'];
							idO = data[i]['id_con'];
							pre = data[i]['presupuesto_pros'];
							nec = data[i]['necesidad_pros'];
							prop = data[i]['propuesta_pros'];
							fecha = data[i]['fecha_cierre_pros'];
							idFa = data[i]['id_fpros'];
							idE = data[i]['id_epros'];
							cam = 'n';
							tx.executeSql('INSERT INTO tb_prospecto(id, id_cuenta, id_contacto, presupuesto, necesidad, propuesta, fecha_aprox, id_fase, id_estado, cambio) VALUES (?,?,?,?,?,?,?,?,?,?)',[idP,idC,idO,pre,nec,prop,fecha,idFa,idE, cam], nullHandler,errorBD);
						}
					});
				}else{
					db.transaction(function(tx){
						tx.executeSql("DELETE FROM tb_prospecto",nullHandler,nullHandler);
					});
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function llenarCuenta(id)
	{
		var id, ruc, rs, vol, fecha, cam;
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {id:id},
			beforeSend : function (){
		    },
			url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/getCuentaUser",
			success : function(data) {
				if(data != 0){
					db.transaction(function(tx){
						tx.executeSql("DELETE FROM tb_cuenta",nullHandler,nullHandler);
						//tx.executeSql("DELETE FROM tb_cuenta where cambio='n'",nullHandler,nullHandler);
						for(var i=0; i< data.length; i++)
						{ 
							id = data[i]['id_cuen'];
							ruc = data[i]['ruc_cuen'];
							rs = data[i]['razon_social_cuen'];
							vol = data[i]['volumen_venta_cuen'];
							cam = 'n';
							tx.executeSql('INSERT INTO tb_cuenta(id, ruc, razon_social, volumen_venta, cambio) VALUES (?,?,?,?,?)',[id, ruc, rs, vol, cam], nullHandler,errorBD);
						}
					});
				}else{
					db.transaction(function(tx){
						tx.executeSql("DELETE FROM tb_cuenta",nullHandler,nullHandler);
					});
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function llenarContacto(id)
	{
		var id, idc, nom, ape, mail, cel, cam;
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {id:id},
			beforeSend : function (){
		    },
			url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/getContactoUser",
			success : function(data) {
				if(data != 0){
					db.transaction(function(tx){
						tx.executeSql("DELETE FROM tb_contacto",nullHandler,nullHandler);
						//tx.executeSql("DELETE FROM tb_contacto where cambio='n'",nullHandler,nullHandler);
						for(var i=0; i< data.length; i++)
						{ 
							id = data[i]['id_con'];
							idc = data[i]['id_cuen'];
							nom = data[i]['nombre_con'];
							ape = data[i]['apellido_con'];
							mail = data[i]['mail_con'];
							cel = data[i]['celular_con'];
							cam = 'n';
							tx.executeSql('INSERT INTO tb_contacto(id, id_cuenta, nombre, apellido, mail, celular, cambio) VALUES (?,?,?,?,?,?,?)',[id, idc, nom, ape, mail, cel, cam], nullHandler,errorBD);
						}
					});
				}else{
					db.transaction(function(tx){
						tx.executeSql("DELETE FROM tb_contacto",nullHandler,nullHandler);
					});
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function llenarFase()
	{
		$("#cboFase").html("");
		var id, desc;
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {},
			beforeSend : function (){
		    },
			url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/getFase",
			success : function(data) {
				if(data != 0){
					db.transaction(function(tx){
						tx.executeSql( 'DELETE FROM tb_fase',nullHandler,nullHandler);
						for(var i=0; i< data.length; i++)
						{ 
							id = data[i]['id_fpros'];
							desc = data[i]['descripcion_fpros'];
							tx.executeSql('INSERT INTO tb_fase(id,descripcion) VALUES (?,?)',[id, desc], nullHandler,errorBD);
							//llenado de combo
							$("#cboFase").append("<option value='"+id+"'>"+desc+"</option>")
							if(id == idFase){ 
								$(".fase_tit div div div span span span").html(desc);
								$("#cboFase option[value="+ id +"]").attr("selected",true);
							}

						}
					});

					listarProspecto(idFase);
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function listarProspecto(id)
	{
		$(".lst_itm").html("");
		var idUsu = localStorage.getItem('id_usu');
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {idUsu:idUsu, id:id},
			beforeSend : function (){
		    },
			url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/getProspecto",
			success : function(data) {
				if(data != 0)
				{
					for(var i=0; i< data.length; i++)
					{
						$(".lst_itm").append(" <article class='unid_cont_item'><section class='sect_uno_item'><article class='nom_emp_item'><label>"+data[i]['razon_social_cuen']+"</label></article><article class='valor_emp_item'><label>"+data[i]['presupuesto_pros']+" NUEVOS SOLES</label></article></section><section class='sect_dos_item'><article class='btn_opc_item' id='"+data[i]['id_pros']+"'><div class='icon-arrow-down2'></div></article></section></article>");
					}
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function llenarEstado()
	{
		var id, desc;
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {},
			beforeSend : function (){
		    },
			url: "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/getEstadoProspecto",
			success : function(data) {
				if(data != 0){
					db.transaction(function(tx){
						tx.executeSql( 'DELETE FROM tb_estado',nullHandler,nullHandler);
						for(var i=0; i< data.length; i++)
						{ 
							id = data[i]['id_epros'];
							desc = data[i]['descripcion_epros'];
							tx.executeSql('INSERT INTO tb_estado(id,descripcion) VALUES (?,?)',[id, desc], nullHandler,errorBD);
						}
					});
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

});

$( window ).load(function() {

});