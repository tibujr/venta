$(document).ready(function () {

	$(".lst_campos").animate({scrollTop: 0});
	$('.lst_campos_act').css({height:alCitm+'px'}); //52-
	$("#cont_contacto").animate({scrollTop: 0});


//*************************************** BASE DE DATOS WEBSQL

	var urlP = "https://roinet.pe/NWROInet/venta/index.php/mobile_controller/";
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
	
	//asignando valor para saber si trabaja on o offline
	localStorage.setItem('onof', 'on');

	//metodos inicializando
	mostrarRequisitosHtml();
	llenarTipoActividad();
	llenarTipoCartera();
	llenarTipoDocumento();

	//calendario español
	var Dia = new Array("Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb");
	var Mes = new Array("Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep","Oct", "Nov", "Dic");

	var arEmpEdit = new Array();//form edit Emp
	var arPerEdit = new Array();//form edit PER

	var estFlCon = 'on';
	var reqArr = [];
	var rucE, rsE, nomE, apeE, preE, necE, proE, fecE, camCuE = 'n', camCoE = 'n', camPrE = 'n'; //campos editar venta

	var idFase = 1; // ID de la Fase que se muestra el prospecto
	var al = ($('body').height())+1;
	var an = $('body').width();

	$("#inicio, #venta, #actividad, #formulario_venta, #venta_detalle, #contactos-empresa, #contactos-persona, #contacto_emp_nuevo_editar, #contacto_deta_empresa, #contacto_deta_persona, #contacto_per_nuevo_editar, #actividad_detalle").css({'max-height': al});//alto a todas las capas

	$("#popup_fnd").css({height: al, width: an});
	
	var cad = "100% "+al+"px";
	$('#inicio').css({'background-size':cad});

	var alCn = al-128;//129
	$('.cont_main').css({height:alCn+'px'});

	$(".cont_dato_detalle_venta").css({height: alCn, width: an});//contenedor de detalle de la venta
	$(".cont_dato_detalle_venta").animate({scrollTop: 0});

	//$('.popup_Nusu, .popup_Nusu_n').css({height:alCn+'px'});
	var alCitm = alCn-48; //alCn-52
	$('.cont_item_lst').css({height:alCitm+'px'});
	$('.cont_item_lst').animate({scrollTop: 0});

	//var alCitm = alCn-52;

	//var alCam = alCitm - 2;
	$('.lst_campos').css({height:alCitm+'px'}); //52-
	var alCact = alCn-100;
	$('.lst_campos_act').css({height:alCact+'px'}); //52-

	if(localStorage.getItem('usu_alm') != null){
	   	//document.getElementById('mail').value = localStorage.getItem('usu_alm');
	   //	document.getElementById('clave').value = localStorage.getItem('clv_alm');
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
					url: urlP+"login",
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

		if(localStorage.getItem('onof') == 'on'){
			listarUsuarioActividad();
		}else{

		}
		$.mobile.changePage("#actividad", {transition:"slide"});
	});

	$("body").on('click', '#cont_deta_act_blank_der', function(e){

		if(localStorage.getItem('onof') == 'on'){
			
		}else{

		}
		$.mobile.changePage("#frm_actividad_editar", {transition:"slide"});
	});

	$("body").on("click",".sect_uno_item_mid", function(e){

		var idAct = $(this).attr('id');
		$("#frmValAct").val("editar");

		if(localStorage.getItem('onof') == 'on')
		{	
			getDetalleActividad(idAct);
		}else{

		}
		$.mobile.changePage("#actividad_detalle", {transition:"slidedown"});
	});

	function getDetalleActividad(id)
	{
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {id:id},
			beforeSend : function (){
		    },
			url: urlP+"getDetalleActividad",
			success : function(data) {
				//a.id_tact, t.desc_tact, a.objetivo_act, a.fecha_act, a.hora_act, 
				//a.duracion_act, a.id_pros, p.titulo, a.id_cuen, cu.razon_social_cuen , 
				//a.id_con, co.nombre_con, co.apellido_con, a.nota_act
				limpiarDetalleActividad();
				$("#det_act_tit").html(data.desc_tact);
				$("#det_act_obj").html(data.objetivo_act);
				$("#det_act_fecha").html(data.fecha_act);
				$("#det_act_hora").html(data.hora_act.substring(0,5));
				$("#det_act_dura").html(data.duracion_act.substring(0,5));
				$("#det_act_opor").html(data.titulo);
				$("#det_act_emp").html(data.razon_social_cuen);
				$("#det_act_cont").html(data.nombre_con+ " "+ data.apellido_con);
				$("#det_act_nota").html(data.nota_act);

				limpiarFormularioActividad();
				$("#cboTipoActividad option[value="+ data.id_tact +"]").attr("selected",true);
				$("#fmr_act_obj").val(data.objetivo_act);
				$("#fmr_act_fecha").val(data.fecha_act);
				$("#fmr_act_hora").val(data.hora_act.substring(0,5));
				$("#cboDuracionAct option[value=0]").attr("selected",'selected');
				$("#fmr_act_nota").val(data.nota_act);
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function limpiarDetalleActividad()
	{
		$("#det_act_tit").html("");
		$("#det_act_obj").html("");
		$("#det_act_fecha").html("");
		$("#det_act_hora").html("");
		$("#det_act_dura").html("");
		$("#det_act_opor").html("");
		$("#det_act_emp").html("");
		$("#det_act_cont").html("");
		$("#det_act_nota").html("");
	}

	function limpiarFormularioActividad()
	{
		$("#cboTipoActividad option[value=0]").attr("selected",'selected');
		$("#cboDuracionAct option[value=0]").attr("selected",'selected');
		$("#fmr_act_obj").val("");
		$("#fmr_act_fecha").val("");
		$("#fmr_act_hora").val("");
		$("#fmr_act_nota").val("");
	}

	$("body").on('click', '#btn_guardar_act', function(e){
		$("#frmValAct").val("editar");
		if(localStorage.getItem('onof') == 'on')
		{
			if($("#frmValAct").val() == 'editar'){

			}else if($("#frmValAct").val() == 'nuevo'){

			}
		}else{

		}
		$.mobile.changePage("#actividad", {transition:"slide"});
	});

	$("body").on('click', '#btn_contacto', function(e){

		if(estFlCon == 'on'){
			estFlCon = 'of';
			$(".sub-menu-nn").removeClass('ocultar');
		}else{
			estFlCon = 'on';
			$(".sub-menu-nn").addClass('ocultar');
		}
	});

	$("body").on('click', '#btn_empresa', function(e){
		estFlCon = 'on';
		var id_usu_emp = localStorage.getItem('id_usu');
		$(".sub-menu-nn").addClass('ocultar');
		if(localStorage.getItem('onof') == 'on'){
			listarUsuarioEmpresaOn(id_usu_emp);
		}else{
			console.log("lista empresa off")
		}
		$.mobile.changePage("#contactos-empresa", {transition:"slide"});
	});

	$("body").on('click', '#add_decisor_empresa', function(e){
		//var idEp = $('#idEmp').val();
		/*if(localStorage.getItem('onof') == 'on'){
			//llenarFase();
			//agregarDeciso(id);
		}else{
			mostrarDataOffline()
		}*/
		limpiarEditarPersona();
		$("#accion_frm_per").val("empresa");
		$.mobile.changePage("#contacto_per_nuevo_editar", {transition:"slide"});
	});

	$("body").on("click",".cont_item_contend_uni_emp", function(e){
		var idEmpUsu = $(this).attr('id');//$("#id_emp_sel").val();
		var idted = idEmpUsu.substring(4);
		$("#id_emp_sel").val(idted);
		if(localStorage.getItem('onof') == 'on'){
			getDetalleEmpresaOn(idted);
		}else{

		}
		$.mobile.changePage("#contacto_deta_empresa", {transition:"slidedown"});
	});

	$("body").on('click', '#cont_deta_emp_blank_der', function(e){
		$("#accion_frm_emp").val("editar");

		$("#edt_emp_nom").val(arEmpEdit['razonSocial']);
		$("#edt_emp_ruc").val(arEmpEdit['ruc']);
		$("#edt_emp_ntrab").val(arEmpEdit['numTrab']);
		$("#edt_emp_vven").val(arEmpEdit['volVen']);
		$("#edt_emp_telf").val(arEmpEdit['telf']);
		$("#cont-cbo-tcartera span.ui-btn-text span").html(arEmpEdit['desTCart']);
		$("#cboTipoCartera option[value="+arEmpEdit['idTCart']+"]").attr("selected",'selected');
				
		$.mobile.changePage("#contacto_emp_nuevo_editar", {transition:"slide"});
	});

	$("body").on('click', '#btn_guardar_emp', function(e){
		
		var idEmp = $("#idEmp").val();

		if(localStorage.getItem('onof') == 'on'){
			console.log($("#accion_frm_emp").val())
			if ($("#accion_frm_emp").val() == 'editar')
			{
				arEmpEdit['razonSocial'] = $("#edt_emp_nom").val();
				arEmpEdit['ruc'] = $("#edt_emp_ruc").val();
				arEmpEdit['numTrab'] = $("#edt_emp_ntrab").val();
				arEmpEdit['volVen'] = $("#edt_emp_vven").val();
				arEmpEdit['idTCart'] = $("#cboTipoCartera").val();
				arEmpEdit['desTCart'] = $("#cboTipoCartera option:selected").text();
				arEmpEdit['telf'] = $("#edt_emp_telf").val();
				editarEmpresaOn(idEmp);
				//$.mobile.back();
			}
			else if ($("#accion_frm_emp").val() == 'nuevo') 
			{

				agregarEmpresaOn();
				//$.mobile.changePage("#contactos-empresa", {transition:"slide"});
			}
		}else{
			if ($("#accion_frm_emp").val() == 'editar')
			{
				alert("editar of")
			}
			else if ($("#accion_frm_emp").val() == 'nuevo') 
			{
				alert("nuevo of")
			}
		}

		$.mobile.back();
		//$.mobile.changePage("#contacto_deta_empresa", {transition:"slide"});
	});

	/*function validarCamposFrmContacto()
	{
		if($("#edt_emp_nom").val() == ""){
			$("#edt_emp_nom").focus().after("<span class='menError'>Ingresar Razón Social</span>");
			return false;
		}else if($("#edt_emp_ruc").val() == ""){
			$("#edt_emp_ruc").focus().after("<span class='menError'>Ingresar RUC</span>");
			return false;
		}else if($("#edt_emp_ntrab").val() == ""){
			$("#edt_emp_ntrab").focus().after("<span class='menError'>Número de trabajadores</span>");
			return false;
		}else if($("#edt_emp_ntrab").val() == ""){
			$("#edt_emp_ntrab").focus().after("<span class='menError'>Número de trabajadores</span>");
			return false;
		}
	}*/

	$("body").on('click', '#btn_guardar_per', function(e){
		
		var idper = $("#idPer").val();

		if(localStorage.getItem('onof') == 'on'){
			console.log($("#accion_frm_per").val())
			if ($("#accion_frm_per").val() == 'editar')
			{
				arPerEdit['nom'] = $("#dt_frm_per_nom").val();
				arPerEdit['ape'] = $("#dt_frm_per_ape").val();
				arPerEdit['idtdoc'] = $("#cboTipoDocumento").val();
				arPerEdit['tdoc'] = $("#cboTipoDocumento option:selected").text();
				arPerEdit['ndoc'] = $("#dt_frm_per_ndoc").val();
				arPerEdit['mail'] = $("#dt_frm_per_mail").val();
				arPerEdit['telf'] = $("#dt_frm_per_telf").val();
				editarPersonaOn(idper);
			}
			else if ($("#accion_frm_per").val() == 'nuevo') 
			{
				agregarPersonaOn();
				//$.mobile.changePage("#contactos-empresa", {transition:"slide"});
			}else if ($("#accion_frm_per").val() == 'empresa') 
			{
				agregarPersonaEmpresaOn();
			}
		}else{
			if ($("#accion_frm_emp").val() == 'editar')
			{
				alert("editar of")
			}
			else if ($("#accion_frm_emp").val() == 'nuevo') 
			{
				alert("nuevo of")
			}
		}

		$.mobile.back();
	});

	$("body").on('click', '#btn_persona', function(e){
		estFlCon = 'on';
		$(".sub-menu-nn").addClass('ocultar');

		var id_usu_emp = localStorage.getItem('id_usu');
		if(localStorage.getItem('onof') == 'on'){
			listarUsuarioPersonaOn(id_usu_emp);
		}else{
			console.log("lista empresa off")
		}

		$.mobile.changePage("#contactos-persona", {transition:"slide"});
	});

	$("body").on("click",".cont_item_contend_uni_per", function(e){
		var idPerDet = $(this).attr('id');
		if(localStorage.getItem('onof') == 'on'){
			getDetallePersonaOn(idPerDet);
		}else{
			console.log("lista empresa off")
		}

		$.mobile.changePage("#contacto_deta_persona", {transition:"slidedown"});
	});

	$("body").on('click', '#cont_deta_per_blank_der', function(e){
		$("#accion_frm_per").val("editar");
		$("#dt_frm_per_nom").val(arPerEdit['nom']);
		$("#dt_frm_per_ape").val(arPerEdit['ape']);
		$("#dt_frm_per_ndoc").val(arPerEdit['ndoc']);
		$("#dt_frm_per_mail").val(arPerEdit['mail']);
		$("#dt_frm_per_telf").val(arPerEdit['telf']);
		$("#cont-cbo-tdoc span.ui-btn-text span").html(arPerEdit['tdoc']);
		$("#cboTipoDocumento option[value='"+arPerEdit['idtdoc']+"']").attr("selected",'selected');

		$.mobile.changePage("#contacto_per_nuevo_editar", {transition:"slide"});
	});

	$("body").on('click', '#add-contacto-bot', function(e){

		if(estFlCon == 'on'){
			estFlCon = 'of';
			$(".sub-menu-nn-d").removeClass('ocultar');
		}else{
			estFlCon = 'on';
			$(".sub-menu-nn-d").addClass('ocultar');
		}
	});

	$("body").on('click', '#btn_empresa_bot', function(e){
		estFlCon = 'on';

		limpiarEditarEmpresa();

		$(".sub-menu-nn-d").addClass('ocultar');
		$("#accion_frm_emp").val("nuevo");//NUEVA CUENTA

		$("#cont-cbo-tcartera span.ui-btn-text span").html("TIPO DE CARTERA");//TIPO DE CARTERA SELECCIONA(NOMBRE)
		$("#cboTipoCartera option[value=0]").attr("selected",'selected');//TIPO DE CARTERA SELECCIONA(VALOR)

		$.mobile.changePage("#contacto_emp_nuevo_editar", {transition:"slide"});
	});

	$("body").on('click', '#btn_persona_bot', function(e){
		estFlCon = 'on';

		limpiarEditarPersona();

		$(".sub-menu-nn-d").addClass('ocultar');
		$("#accion_frm_per").val("nuevo");

		$("#cont-cbo-tdoc span.ui-btn-text span").html("TIPO DE DOCUMENTO");//TIPO DE CARTERA SELECCIONA(NOMBRE)
		$("#cboTipoDocumento option[value=0]").attr("selected",'selected');//TIPO DE CARTERA SELECCIONA(VALOR)

		$.mobile.changePage("#contacto_per_nuevo_editar", {transition:"slide"});
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

	$("body").on('click', '#btn-general-demp', function(e){
		ocultarContDAOEmp("#cont_deta_gen_emp","#btn-general-demp");
	});

	$("body").on('click', '#btn-actividad-demp', function(e){
		ocultarContDAOEmp("#cont_actv_gen_emp","#btn-actividad-demp");
	});

	$("body").on('click', '#btn-oportunidad-demp', function(e){
		ocultarContDAOEmp("#cont_oport_gen_emp","#btn-oportunidad-demp");
	});

	function ocultarContDAOEmp(dat, fnd)
	{
		$("#cont_deta_gen_emp, #cont_actv_gen_emp, #cont_oport_gen_emp").css({display: 'none'});
		$("#btn-general-demp, #btn-actividad-demp, #btn-oportunidad-demp").css({background: '#FFF', color: 'black'});
		$(dat).css({display: 'inline-block'});
		$(fnd).css({background: '#df2047', color:'#FFF'});
	}

	$("body").on('click', '#btn-general-dper', function(e){
		ocultarContDAOPed("#cont_desc_per","#btn-general-dper");
	});

	$("body").on('click', '#btn-actividad-dper', function(e){
		ocultarContDAOPed("#cont_actv_per","#btn-actividad-dper");
	});

	$("body").on('click', '#btn-oportunidad-dper', function(e){
		ocultarContDAOPed("#cont_oport_per","#btn-oportunidad-dper");
	});

	function ocultarContDAOPed(dat, fnd)
	{
		$("#cont_desc_per, #cont_actv_per, #cont_oport_per").css({display: 'none'});
		$("#btn-general-dper, #btn-actividad-dper, #btn-oportunidad-dper").css({background: '#FFF', color: 'black'});
		$(dat).css({display: 'inline-block'});
		$(fnd).css({background: '#df2047', color:'#FFF'});
	}

	$("body").on("click",".btn_opc_item, .unid_cont_item", function(e){
		var idv = this.id;
		$('#id_pros').val(idv);
		$('#accion_frm').val("editar");

		$(".nvo_pros").css({display: 'inline-block'});

		if(localStorage.getItem('onof') == 'on')
		{
			limpiarProsDeta();
			getProspectoDetalleOn(idv);
		}else{
			//getProspectoIdOff(idv);
		}

		$.mobile.changePage("#venta_detalle", {transition:"slidedown"});

	});

	function limpiarProsDeta()
	{
		$(".nom_con_det_pros").html("");
		$(".nom_emp_det_pros").html("");
		$(".valor_emp_det_pros").html("");
		$(".nece_emp_det_pros").html("");
		$(".propu_emp_det_pros").html("");
		$(".fecha_emp_det_pros").html("");

		for (var i = 0; i < reqArr.length; i++) {
			var a = "req_"+reqArr[i];
			var b = "reqc_"+reqArr[i];
			$('#'+a+":checkbox").prop('checked', false);
			//$('.'+b+" span span.ui-icon").addClass( "ui-icon-checkbox-off" ) cambio JQ4
			//$('.'+b+" span span.ui-icon").removeClass( "ui-icon-checkbox-on" ) cambio JQ4
			$('.'+b).addClass( "ui-checkbox-off" );
			$('.'+b).removeClass( "ui-checkbox-on" );			
		}
		console.log("limpiar chk")
	}

	$("body").on("click","#btn_perdido_det_ven", function(e){
		
		var idProsp = $("#id_pros").val();

		if(localStorage.getItem('onof') == 'on')
		{	
			//listarProspecto(idFase);
			var r = confirm("¿Desea cambiar estado a Perdido?");
			if(r){
				evaluarProspecto(idProsp,'p'); //p de perdido
				alert("Prospecto Perdido");
				$.mobile.back();
			}else{
				console.log("cancelado")
			}
		}else{
			//getProspectoIdOff(idv);
		}
		
	});

	$("body").on("click","#btn_ganado_det_ven", function(e){
		
		var idProsp = $("#id_pros").val();

		if(localStorage.getItem('onof') == 'on')
		{	
			//listarProspecto(idFase);
			/*evaluarProspecto(idProsp,'g'); //g de ganado
			alert("Prospecto Ganado");*/
			var r = confirm("¿Desea cambiar estado a Ganado?");
			if(r){
				evaluarProspecto(idProsp,'g'); //g de ganado
				alert("Prospecto Ganado");
				$.mobile.back();
			}else{
				console.log("cancelado")
			}
		}else{
			//getProspectoIdOff(idv);
		}

	});

	function evaluarProspecto(id, va)
	{
		var us = localStorage.getItem('id_usu');
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {us:us, id:id, va:va},
			beforeSend : function (){
			},
			url: urlP+"evaluarProspecto",
			success : function(data) {
				llenarFase()
				llenarProspecto(us);
				llenarCuenta(us);
				llenarContacto(us);
				limpiarDataEdit();
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	$("body").on("click",".edit_prosp_frm", function(e){
		var idv = this.id;
		$('#id_pros').val(idv);
		$('#accion_frm').val("editar");

		$(".nvo_pros").css({display: 'inline-block'});

		if(localStorage.getItem('onof') == 'on')
		{	
			$(".desa_det_venta").prop('disabled', false);
			$("#rsoc_lbl, #nom_deci_lbl").css({display: 'inline-block'});
			$("#rsoc, #nom_deci").css({display: 'none'});
			//$("#nom_deci").prop('disabled', true);

			//getProspectoIdOn(idv);
		}else{
			//getProspectoIdOff(idv);
		}

		$.mobile.changePage("#formulario_venta", {transition:"slidedown"});

	});

	$("body").on("click","#btn_add_venta", function(e){

		$(".nvo_pros").css({display: 'none'});

		$('#accion_frm').val("nuevo");
		$('#id_pros').val("");
		$('#id_cuen').val("");
		$('#id_con').val("");
		
		$("#titpros").val("");
		$("#rsoc_lbl, #nom_deci_lbl").css({display: 'none'});
		$("#rsoc, #nom_deci").css({display: 'inline-block'});
		$("#rsoc, #nom_deci").val("");
		//$("#rsoc").val("").prop('disabled', false);
		//$("#nom_deci").val("").prop('disabled', false);

		$("#presu").val("");
		$("#nece").val("");
		$("#prop").val("");
		$("#fecha_aprox").val("");

		$("#ndeci").val("");
		$("#pdeci").val("");
		
		$("#sig_cita").val("");
		$("#hra_cita").val("");

		for (var i = 0; i < reqArr.length; i++) {
			var a = "req_"+reqArr[i];
			var b = "reqc_"+reqArr[i];
			
			$('#'+a+":checkbox").prop('checked', false);
			//$('.'+b+" span span.ui-icon").addClass( "ui-icon-checkbox-off" ) cambio JQ4
			//$('.'+b+" span span.ui-icon").removeClass( "ui-icon-checkbox-on" ) cambio JQ4
			$('.'+b).addClass( "ui-checkbox-off" )
			$('.'+b).removeClass( "ui-checkbox-on" )
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
			if( $("#titpros").val() == ""){
				$("#titpros").focus().after("<span class='menError'>Ingresar Titulo</span>");
				return false;
			}else if( $("#rsoc").val() == ""){
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
			$("#id_cuen").val("");
			$("#id_con").val("");
		}

        if (!(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13)) {
        	
        	var usuid = localStorage.getItem('id_usu');
        	$.ajax({
	          	type: 'POST',
				dataType: 'json', 
				data: {dtb:dtb,usuid:usuid},
				cache: false,
				url: urlP+"search_empresa",
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
								url: urlP+"search_contacto",
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
					url: urlP+"evaluarActividad",
					success : function(data) {
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
					
					//$("#rsoc_lbl").html(row.razon_social);
					//$("#nom_deci_lbl").val(row.nombre+ " " +row.apellido)

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
			$( "#cont_reque" ).css({display: 'none'});
			listarFaseOff();
			listarProspectoOff(idFase);
			
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
							//$(".fase_tit div div div span span span").html(row.descripcion) CAMBIO JQ4
							$(".fase_tit div div div span").html(row.descripcion)
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
						$(".lst_itm").append("<article class='unid_cont_item' id='"+data[i]['id_pros']+"'><section class='sect_uno_item'><article class='nom_emp_item'><label>"+row.razon_social+"</label></article><article class='valor_emp_item'><label>"+row.presupuesto+" NUEVOS SOLES</label></article></section><section class='sect_dos_item'><article class='btn_opc_item' id='"+row.id+"'><div class='icon-arrow-right'></div></article></section></article>");
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
		var titPros = $('#titpros').val();

		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {titPros:titPros, nomE:nomE, apeE:apeE, preE:preE, necE:necE, fecE:fecE, fecha_scit:fecha_scit, hora_scit:hora_scit, usuG:usuG, idCuenta:idCuenta, idContact:idContact},
			beforeSend : function (){
		    },
			url: urlP+"guardaNuevoProspecto",
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
		var titOpor = $('#titpros').val();

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
			data: {titOpor:titOpor, preE:preE, necE:necE, proE:proE, fecE:fecE, idProsp:idProsp, idCuenta:idCuenta, idContact:idContact, reqArrTemp:reqArrTemp, fecha_scit:fecha_scit, hora_scit:hora_scit, usuedt:usuedt, idacti:idacti},
			beforeSend : function (){
		    },
			url: urlP+"editProspectoOn",
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

	function getProspectoDetalleOn(id)//trae todos los datos del prospecto incluyendo los requisitos 
	{
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {id:id},
			beforeSend : function (){
		    },
			url: urlP+"getProspectoDetalleOn",
			success : function(data) {
				if(data != 0){

					var por_avan = data.avance+"%";
					$(".vent_ind_item_porc").css({width: por_avan});
					$(".avance_face_nom_dp").html(por_avan);

					$(".edit_prosp_frm").attr("id",id);
					$(".nom_con_det_pros").html(data.nombre_con+' '+data.apellido_con);
					$(".nom_emp_det_pros").html(data.razon_social_cuen);
					$(".valor_emp_det_pros").html(data.presupuesto_pros+"<span> NUEVOS SOLES</span>");
					$(".nece_emp_det_pros").html(data.necesidad_pros);
					$(".fecha_emp_det_pros").html(data.fecha_cierre_pros);
					$(".propu_emp_det_pros").html(data.propuesta_pros);

					for (var i = 0; i < reqArr.length; i++) {
						var a = "req_"+reqArr[i];
						//var ad = "req_"+reqArr[i];
						var b = "reqc_"+reqArr[i];
						if(data[a] == "S"){
							console.log(a+" on")
							$('#'+a+":checkbox").prop('checked', true);
							//$('.'+b+" span span.ui-icon").removeClass( "ui-icon-checkbox-off" )
							//$('.'+b+" span span.ui-icon").addClass( "ui-icon-checkbox-on" )
							$('.'+b).removeClass( "ui-checkbox-off" )
							$('.'+b).addClass( "ui-checkbox-on" )
						}else{
							console.log(a+" off")
							$('#'+a+":checkbox").prop('checked', false);
							//$('.'+b+" span span.ui-icon").addClass( "ui-icon-checkbox-off" )
							//$('.'+b+" span span.ui-icon").removeClass( "ui-icon-checkbox-on" )
							$('.'+b).addClass( "ui-checkbox-off" )
							$('.'+b).removeClass( "ui-checkbox-on" )
						}
					}

					/* FORMULARIO EDITAR*/

					$("#titpros").val(data.titulo);
					$("#rsoc").val(data.razon_social_cuen);//.prop('disabled', true);
					$("#nom_deci").val(data.nombre_con+' '+data.apellido_con)//.prop('disabled', true);
					$("#presu").val(data.presupuesto_pros)
					$("#nece").val(data.necesidad_pros)
					$("#prop").val(data.propuesta_pros)
					$("#fecha_aprox").val(data.fecha_cierre_pros)

					$("#rsoc_lbl").html(data.razon_social_cuen);
					$("#nom_deci_lbl").html(data.nombre_con+' '+data.apellido_con)

					$('#id_pros').val(data.id_pros);
					$('#id_cuen').val(data.id_cuen);
					$('#id_con').val(data.id_con);

					$('#sig_cita').val(data.fecha_act);
					$('#hra_cita').val(data.hora_act);
					$('#activ_check').val(data.id_act);

					

					$(".desa_det_venta").prop('disabled', 'true');

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
		$( "#cont_reque, #req_detalle_venta" ).html("");
		if(localStorage.getItem('onof') == 'on'){
			$.ajax({
				type: 'POST',
				dataType: 'json', 
				data: {},
				beforeSend : function (){
			    },
				url: urlP+"getRequisitos",
				success : function(data) {
					if(data != 0)
					{
						for(var i=0; i< data.length; i++)
						{
							reqArr[i]=data[i]['id_req'];
							//var ltdr = "<article class='cont_req cont_ckh_reg'><input type='checkbox' name='req_"+data[i]['id_req']+"' id='req_"+data[i]['id_req']+"' class='chkocultar desa_det_venta'/><label class='lblcheck reqc_"+data[i]['id_req']+"' for='req_"+data[i]['id_req']+"' >"+data[i]['descripcion_req']+"</label></article>";
							var ltdr = "<article class='cont_req cont_ckh_reg nvo_css_req'><label class='reqc_"+data[i]['id_req']+"'><input type='checkbox' name='req_"+data[i]['id_req']+"' id='req_"+data[i]['id_req']+"' class='chkocultar desa_det_venta'>"+data[i]['descripcion_req']+"</label></article>";
							$( "#cont_reque, #req_detalle_venta" ).append(ltdr);
						}
					}
				},
				error: function(data){
					console.log(data);
				}
			});
		}
	}

	function llenarTipoActividad()
	{
		var arAct = Array();
		$( "#cboTipoActividad" ).html("");
		$( "#cboTipoActividad" ).append("<option value='0'>SELECCIONAR TIPO</option>");
		if(localStorage.getItem('onof') == 'on'){
			$.ajax({
				type: 'POST',
				dataType: 'json', 
				data: {},
				beforeSend : function (){
			    },
				url: urlP+"llenarTipoActividad",
				success : function(data) {
					for(var i=0; i< data.length; i++)
					{
						$( "#cboTipoActividad" ).append("<option value='"+data[i]['id_tact']+"'>"+data[i]['desc_tact']+"</option>");
					}
				},
				error: function(data){
					console.log(data);
				}
			});
		}
	}


	function llenarTipoCartera()
	{
		$("#cboTipoCartera").html("<option value='0'>TIPO DE CARTERA</option>");
		if(localStorage.getItem('onof') == 'on'){
			$.ajax({
				type: 'POST',
				dataType: 'json', 
				data: {},
				beforeSend : function (){
			    },
				url: urlP+"getTipoCartera",
				success : function(data) {
					if(data != 0){
						for(var i=0; i< data.length; i++)
						{
							$("#cboTipoCartera").append("<option value='"+data[i]['id']+"'>"+data[i]['descripcion']+"</option>")
						}
					}
				},
				error: function(data){
					console.log(data);
				}
			});
		}
	}

/**/

	function llenarTipoDocumento()
	{
		$("#cboTipoDocumento").html("<option value='0'>TIPO DE DOCUMENTO</option>");
		if(localStorage.getItem('onof') == 'on'){
			$.ajax({
				type: 'POST',
				dataType: 'json', 
				data: {},
				beforeSend : function (){
			    },
				url: urlP+"getTipoDocumento",
				success : function(data) {
					if(data != 0){
						for(var i=0; i< data.length; i++)
						{
							$("#cboTipoDocumento").append("<option value='"+data[i]['id']+"'>"+data[i]['descripcion']+"</option>")
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
			url: urlP+"getProspectoUser",
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
			url: urlP+"getCuentaUser",
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
			url: urlP+"getContactoUser",
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
			url: urlP+"getFase",
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
								//$(".fase_tit div div div span span span").html(desc); CAMBIO JQ4
								$(".fase_tit div div div span").html(desc);
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
			url: urlP+"getProspecto",
			success : function(data) {
				if(data != 0)
				{
					for(var i=0; i< data.length; i++)
					{
						$(".lst_itm").append(" <article class='unid_cont_item' id='"+data[i]['id_pros']+"'><section class='sect_uno_item'><article class='nom_emp_item'><label>"+data[i]['razon_social_cuen']+"</label></article><article class='valor_emp_item'><label>"+data[i]['presupuesto_pros']+" NUEVOS SOLES</label></article></section><section class='sect_dos_item'><article class='btn_opc_item' id='"+data[i]['id_pros']+"'><div class='icon-arrow-right'></div></article></section></article>");
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
			url: urlP+"getEstadoProspecto",
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

	function listarUsuarioEmpresaOn(id)
	{
		$(".lst-empresa").html("");
		$("#idEmp").val("");//limpiamos valor de la empresa
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {id:id},
			beforeSend : function (){
		    },
			url: urlP+"listarUsuarioEmpresaOn",
			success : function(data) {
				if(data != 0){
					for(var i=0; i< data.length; i++)
					{
						$(".lst-empresa").append("<section class='cont_item_contend_uni_emp' id='emp_"+data[i]['id_cuen']+"'><section class='sec_cont_item_izq'><div class='sec_cont_item_izq_ico'><div class='icon-office ico-usr'></div></div></section><section class='sec_cont_item_mid'><div class='sec_cont_item_izq_text'>"+data[i]['razon_social_cuen']+" inc</div></section><section class='sec_cont_item_der'><div class='sec_cont_item_izq_flecha'><div class='icon-arrow-right'></div></div></section></section>");
					}
				}else{
					alert("No tienes empresas asignadas")
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function getDetalleEmpresaOn(idEmp)
	{
		$("#idEmp").val(idEmp);//guardarIdEmpresa
		$("#cnt_cnt_emp_deci").html("");//limpiar decisor contenedor
		$("#cont_oport_gen_emp").html("");//limpiar prospecto contenedor
		$("#cont_actv_gen_emp").html("");//limpiar actividad contenedor

		limpiarDetalleEmpresa();
		limpiarEditarEmpresa();

		ocultarContDAOEmp("#cont_deta_gen_emp","#btn-general-demp");

		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {idEmp:idEmp},
			beforeSend : function (){
		    },
			url: urlP+"getDetalleEmpresaOn",
			success : function(data) {
				console.log(data);

				/*EMPRESA*/
				var etd = data['emp'];
				//datos detalle empresa
				$("#det_emp_nom").html(etd[0]['razon_social_cuen']);
				$("#det_emp_ruc").html(etd[0]['ruc_cuen']);
				$("#det_emp_numT").html(etd[0]['numero_trabajadores_cuen']);
				$("#det_emp_voluV").html(etd[0]['volumen_venta_cuen']);
				$("#det_emp_giro").html(etd[0]['giro_cuen']);
				$("#det_emp_tCartera").html(etd[0]['tipo_cartera_cuen']);
				$("#det_emp_telf").html(etd[0]['telefono_cuen']);
				if(etd[0]['direccion_cuen'])
					$("#det_emp_dire").html(etd[0]['direccion_cuen']+", "+etd[0]['distrito_cuen']);
				$("#det_emp_asig").html(etd[0]['nombre_usu']+" "+etd[0]['apellido_usu']);
				//datos editar empresa
				alert("editar")
				$("#edt_emp_nom").val(etd[0]['razon_social_cuen']);
				$("#edt_emp_ruc").val(etd[0]['ruc_cuen']);
				$("#edt_emp_ntrab").val(etd[0]['numero_trabajadores_cuen']);
				$("#edt_emp_vven").val(etd[0]['volumen_venta_cuen']);
				$("#edt_emp_telf").val(etd[0]['telefono_cuen']);
				(!etd[0]['tipo_cartera_cuen'])? $("#cont-cbo-tcartera span.ui-btn-text span").html("TIPO DE CARTERA") : $("#cont-cbo-tcartera span.ui-btn-text span").html(etd[0]['tipo_cartera_cuen']);
				(!etd[0]['id_tipo_cartera'])? $("#cboTipoCartera option[value=0]").attr("selected",'selected'):$("#cboTipoCartera option[value='3").attr("selected",'selected');
				
				arEmpEdit['razonSocial'] = etd[0]['razon_social_cuen'];
				arEmpEdit['ruc'] = etd[0]['ruc_cuen'];
				arEmpEdit['numTrab'] = etd[0]['numero_trabajadores_cuen'];
				arEmpEdit['volVen'] = etd[0]['volumen_venta_cuen'];
				(!etd[0]['id_tipo_cartera'])? arEmpEdit['idTCart'] = 0 : arEmpEdit['idTCart'] = etd[0]['id_tipo_cartera'];
				(!etd[0]['tipo_cartera_cuen'])? arEmpEdit['desTCart'] = "TIPO DE CARTERA" : arEmpEdit['desTCart'] = etd[0]['tipo_cartera_cuen'];
				arEmpEdit['telf'] = etd[0]['telefono_cuen'];

				/*DECISOR*/
				alert("contacto")
				var ctd = data['con'];
				for(var i = 0; i < ctd.length; i++)
				{
					if(!ctd[i]['apellido_con'])ctd[i]['apellido_con'] = "";
					if(!ctd[i]['cargo'])ctd[i]['cargo'] = "cargo"; 
					if(!ctd[i]['celular_con'])ctd[i]['celular_con'] = "- - -"; 
					if(!ctd[i]['mail_con'])ctd[i]['mail_con'] = "- - -"; 
					var de ="<section class='cont_ind_det_fondo_deci'><section class='cont_ind_det_f_conta'><section class='cont_ind_det_f_izq'><div class='cont_ind_det_izq_ico'><div class='icon-user ico-usr'></div></div></section><section class='cont_ind_det_f_der'><div class='cont_ind_der_top' id='det_emp_cont_nom'>"+ctd[i]['nombre_con']+" "+ctd[i]['apellido_con']+"</div><div class='cont_ind_der_bot' id='det_emp_cont_cargo'>"+ctd[i]['cargo']+"</div></section></section><section class='cont_ind_det_f_conta'><section class='cont_ind_det_f_izq'><div class='cont_ind_det_izq_ico'><div class='icon-phone'></div></div></section><section class='cont_ind_det_f_der'><div class='cont_ind_der_top' id='det_emp_cont_celu'>"+ctd[i]['celular_con']+"</div><div class='cont_ind_der_bot'>Celular</div></section></section><section class='cont_ind_det_f_conta'><section class='cont_ind_det_f_izq'><div class='cont_ind_det_izq_ico'><div class='icon-envelope'></div></div></section><section class='cont_ind_det_f_der'><div class='cont_ind_der_top' id='det_emp_cont_mail'>"+ctd[i]['mail_con']+"</div><div class='cont_ind_der_bot'>Correo</div></section></section></section>";
					$("#cnt_cnt_emp_deci").append(de);
				}

				/*PROSPECTO*/
				alert("prospecto")
				var ptd = data['pros'];
				for(var i = 0; i < ptd.length; i++)
				{
					if(!ptd[i]['titulo'])ptd[i]['titulo'] = etd[0]['razon_social_cuen'];
					if(!ptd[i]['presupuesto_pros'])ptd[i]['presupuesto_pros'] = 0.00;
					var pc ="<article class='unid_cont_item' id='"+ptd[i]['id_pros']+"'><section class='sect_uno_item'><article class='nom_emp_item'><label>"+ptd[i]['titulo']+"</label></article><article class='valor_emp_item'><label>"+ptd[i]['presupuesto_pros']+" NUEVOS SOLES</label></article></section><section class='sect_dos_item'></section></article>";
					$("#cont_oport_gen_emp").append(pc);
				}

				/*ACTIVIDAD*/
				alert("actividad")
				var atd = data['act'];
				for(var i = 0; i < atd.length; i++)
				{
					var fg = generaFecha(atd[i]['fecha_act']);
					if(!atd[i]['desc_tact'])atd[i]['desc_tact'] = 'Pendiente';
					if(!atd[i]['hora_act'])atd[i]['hora_act'] = '00:00';
					var ac ="<article class='unid_cont_item_act'><section class='sect_uno_item_izq'><div class='div_fecha_act_top'>"+fg['diaNom']+"</div><div class='div_fecha_act_bot'>"+fg['diaNum']+" "+fg['mesNom']+"</div></section><section class='sect_uno_item_mid' id='"+atd[i]['id_act']+"'><div class='div_tipo_act_top'>"+atd[i]['desc_tact']+"</div><div class='div_tipo_act_bot'><div class='div_tipo_act_bot_izq'>"+atd[i]['hora_act'].substring(0,5)+" / </div><div class='div_tipo_act_bot_der'> "+etd[0]['razon_social_cuen']+"</div></div></section><section class='sect_uno_item_der'><article class='cont_req cont_ckh_act'><input type='checkbox' name='act_"+atd[i]['id_act']+"' id='act_"+atd[i]['id_act']+"' class='chkocultar desa_det_venta'/><label class='lblcheck chk-lft' for='act_"+atd[i]['id_act']+"'></label></article></section></article>";
		            $("#cont_actv_gen_emp").append(ac);
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function limpiarDetalleEmpresa()
	{
		$("#det_emp_nom").html("");
		$("#det_emp_ruc").html("");
		$("#det_emp_numT").html("");
		$("#det_emp_voluV").html("");
		$("#det_emp_giro").html("");
		$("#det_emp_tCartera").html("");
		$("#det_emp_telf").html("");
		$("#det_emp_dire").html("");
		$("#det_emp_asig").html("");

		$("#det_emp_cont_nom").html("");
		$("#det_emp_cont_cargo").html("");
		$("#det_emp_cont_celu").html("");
		$("#det_emp_cont_mail").html("");
	}

	function limpiarEditarEmpresa()
	{
		$("#edt_emp_nom").val("");
		$("#edt_emp_ruc").val("");
		$("#edt_emp_ntrab").val("");
		$("#edt_emp_vven").val("");
		$("#edt_emp_tcart").val("");
		$("#edt_emp_telf").val("");
	}

	function editarEmpresaOn(idEmp)
	{
		var usuE = localStorage.getItem('id_usu');
		var eEmp = $("#edt_emp_nom").val();
		var eRuc = $("#edt_emp_ruc").val();
		var nTrab = $("#edt_emp_ntrab").val();
		var vVen = $("#edt_emp_vven").val();
		var tCar = $("#cboTipoCartera").val();
		var eTelf = $("#edt_emp_telf").val();
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {usuE:usuE, idEmp:idEmp, eEmp:eEmp, eRuc:eRuc, nTrab:nTrab, vVen:vVen, tCar:tCar, eTelf:eTelf},
			beforeSend : function (){
		    },
			url: urlP+"editarEmpresaOn",
			success : function(data) {
				if(data== 'ok'){
					$("#det_emp_nom").html(eEmp);
					$("#det_emp_ruc").html(eRuc);
					$("#det_emp_numT").html(nTrab);
					$("#det_emp_voluV").html(vVen);
					$("#det_emp_telf").html(eTelf);
					$("#det_emp_tCartera").html($("#cboTipoCartera option:selected").text());
					console.log("se edito correctamente")
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function agregarEmpresaOn()
	{
		var usuE = localStorage.getItem('id_usu');
		var eEmp = $("#edt_emp_nom").val();
		var eRuc = $("#edt_emp_ruc").val();
		var nTrab = $("#edt_emp_ntrab").val();
		var vVen = $("#edt_emp_vven").val();
		var tCar = $("#cboTipoCartera").val();
		var eTelf = $("#edt_emp_telf").val();
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {usuE:usuE, eEmp:eEmp, eRuc:eRuc, nTrab:nTrab, vVen:vVen, tCar:tCar, eTelf:eTelf},
			beforeSend : function (){
		    },
			url: urlP+"agregarEmpresaOn",
			success : function(data) {
				if(data != ""){
					$("#idEmp").val(data.id);
					console.log("se agrego correctamente");
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function listarUsuarioPersonaOn(id)
	{
		$(".lst-persona").html("");
		$("#idPer").val("");//limpiamos id de la persona
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {id:id},
			beforeSend : function (){
		    },
			url: urlP+"listarUsuarioPersonaOn",
			success : function(data) {
				if(data != 0){
					for(var i=0; i< data.length; i++)
					{
						var cadP ="<section class='cont_item_contend_uni_per' id='"+data[i]['id_con']+"'><section class='sec_cont_item_izq'><div class='sec_cont_item_izq_ico'><div class='icon-user ico-usr'></div></div></section><section class='sec_cont_item_mid'><div class='sec_cont_item_izq_text' >"+data[i]['contacto']+"</div></section><section class='sec_cont_item_der'><div class='sec_cont_item_izq_flecha'><div class='icon-plus'></div></div></section></section>";
						$(".lst-persona").append(cadP);
					}
				}else{
					alert("No tienes personas asignadas")
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function getDetallePersonaOn(idPer)
	{
		$("#idPer").val(idPer);//guardarIdCOntacto
		$("#cont_oport_per").html("");//limpiar prospecto contenedor
		$("#cont_actv_per").html("");//limpiar actividad contenedor

		limpiarDetallePersona();
		limpiarEditarPersona();

		ocultarContDAOPed("#cont_desc_per","#btn-general-dper");

		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {idPer:idPer},
			beforeSend : function (){
		    },
			url: urlP+"getDetallePersonaOn",
			success : function(data) {
				console.log(data);

				/*PERSONA*/
				var etd = data['per'];
				//datos detalle persona
				$("#frm_per_nom").html(etd[0]['nombre_con'] +" "+ etd[0]['apellido_con']);
				$("#frm_per_tdoc").html(etd[0]['tipo_doc']);
				$("#frm_per_ndoc").html(etd[0]['numero_documento_con']);
				$("#frm_per_mail").html(etd[0]['mail_con']);
				$("#frm_per_tel").html(etd[0]['celular_con']);
				$("#frm_per_cargo").html(etd[0]['cargo']);
				$("#frm_per_emp").html(etd[0]['razon_social_cuen']);
				$("#frm_per_asig").html(etd[0]['nombre_usu']+" "+etd[0]['apellido_usu']);
				//datos editar persona
				$("#dt_frm_per_nom").val(etd[0]['nombre_con']);
				$("#dt_frm_per_ape").val(etd[0]['apellido_con']);
				$("#dt_frm_per_ndoc").val(etd[0]['numero_documento_con']);
				$("#dt_frm_per_mail").val(etd[0]['mail_con']);
				$("#dt_frm_per_telf").val(etd[0]['celular_con']);
				(!etd[0]['tipo_doc'])? $("#cont-cbo-tdoc span.ui-btn-text span").html("TIPO DE DOCUMENTO") : $("#cont-cbo-tdoc span.ui-btn-text span").html(etd[0]['tipo_doc']);
				(!etd[0]['id_tipo_documento'])? $("#cboTipoDocumento option[value=0]").attr("selected",'selected'):$("#cboTipoDocumento option[value='"+etd[0]['id_tipo_documento']+"']").attr("selected",'selected');

				arPerEdit['nom'] = etd[0]['nombre_con'];
				arPerEdit['ape'] = etd[0]['apellido_con'];
				(!etd[0]['id_tipo_documento'])? arPerEdit['idtdoc'] = 0 : arPerEdit['idtdoc'] = etd[0]['id_tipo_documento'];
				(!etd[0]['tipo_doc'])? arPerEdit['tdoc'] = "TIPO DE DOCUMENTO" : arPerEdit['tdoc'] = etd[0]['tipo_doc'];
				arPerEdit['ndoc'] = etd[0]['numero_documento_con'];
				arPerEdit['mail'] = etd[0]['mail_con'];
				arPerEdit['telf'] = etd[0]['celular_con'];

				/*PROSPECTO*/
				var ptd = data['pros'];
				for(var i = 0; i < ptd.length; i++)
				{
					if(!ptd[i]['titulo'])ptd[i]['titulo'] = etd[0]['nombre_con'] +" "+ etd[0]['apellido_con'];
					if(!ptd[i]['presupuesto_pros'])ptd[i]['presupuesto_pros'] = 0.00;
					var pc ="<article class='unid_cont_item' id='"+ptd[i]['id_pros']+"'><section class='sect_uno_item'><article class='nom_emp_item'><label>"+ptd[i]['titulo']+"</label></article><article class='valor_emp_item'><label>"+ptd[i]['presupuesto_pros']+" NUEVOS SOLES</label></article></section><section class='sect_dos_item'></section></article>";
					$("#cont_oport_per").append(pc);
				}

				/*ACTIVIDAD*/
				var atd = data['act'];
				for(var i = 0; i < atd.length; i++)
				{
					var fg = generaFecha(atd[i]['fecha_act']);
					if(!atd[i]['desc_tact'])atd[i]['desc_tact'] = 'Pendiente';
					if(!atd[i]['hora_act'])atd[i]['hora_act'] = '00:00';
					var ac ="<article class='unid_cont_item_act'><section class='sect_uno_item_izq'><div class='div_fecha_act_top'>"+fg['diaNom']+"</div><div class='div_fecha_act_bot'>"+fg['diaNum']+" "+fg['mesNom']+"</div></section><section class='sect_uno_item_mid' id='"+atd[i]['id_act']+"'><div class='div_tipo_act_top'>"+atd[i]['desc_tact']+"</div><div class='div_tipo_act_bot'><div class='div_tipo_act_bot_izq'>"+atd[i]['hora_act'].substring(0,5)+" / </div><div class='div_tipo_act_bot_der'> "+etd[0]['razon_social_cuen']+"</div></div></section><section class='sect_uno_item_der'><article class='cont_req cont_ckh_act'><input type='checkbox' name='act_"+atd[i]['id_act']+"' id='act_"+atd[i]['id_act']+"' class='chkocultar desa_det_venta'/><label class='lblcheck chk-lft' for='act_"+atd[i]['id_act']+"'></label></article></section></article>";
		            $("#cont_actv_per").append(ac);
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function limpiarDetallePersona()
	{
		$("#frm_per_nom").html("");
		$("#frm_per_tdoc").html("");
		$("#frm_per_ndoc").html("");
		$("#frm_per_mail").html("");
		$("#frm_per_tel").html("");
		$("#frm_per_cargo").html("");
		$("#frm_per_emp").html("");
		$("#frm_per_asig").html("");
	}

	function limpiarEditarPersona()
	{
		$("#dt_frm_per_nom").val("");
		$("#dt_frm_per_ape").val("");
		$("#dt_frm_per_ndoc").val("");
		$("#dt_frm_per_mail").val("");
		$("#dt_frm_per_telf").val("");
	}

	function editarPersonaOn(idPer)
	{
		var usuE = localStorage.getItem('id_usu');
		var nPer = $("#dt_frm_per_nom").val();
		var aPer = $("#dt_frm_per_ape").val();
		var tDoc = $("#cboTipoDocumento").val();
		var ndoc = $("#dt_frm_per_ndoc").val();
		var mailp = $("#dt_frm_per_mail").val();
		var telp = $("#dt_frm_per_telf").val();
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {usuE:usuE, idPer:idPer, nPer:nPer, aPer:aPer, tDoc:tDoc, ndoc:ndoc, mailp:mailp, telp:telp},
			beforeSend : function (){
		    },
			url: urlP+"editarPersonaOn",
			success : function(data) {
				if(data == 'ok'){
					$("#frm_per_nom").html(nPer +" "+ aPer);
					$("#frm_per_ndoc").html(ndoc);
					$("#frm_per_mail").html(mailp);
					$("#frm_per_tel").html(telp);
					$("#frm_per_tdoc").html($("#cboTipoDocumento option:selected").text());
					console.log("se edito persona")
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function agregarPersonaOn()
	{
		var usuE = localStorage.getItem('id_usu');
		var nPer = $("#dt_frm_per_nom").val();
		var aPer = $("#dt_frm_per_ape").val();
		var tDoc = $("#cboTipoDocumento").val();
		var ndoc = $("#dt_frm_per_ndoc").val();
		var mailp = $("#dt_frm_per_mail").val();
		var telp = $("#dt_frm_per_telf").val();
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {usuE:usuE, nPer:nPer, aPer:aPer, tDoc:tDoc, ndoc:ndoc, mailp:mailp, telp:telp},
			beforeSend : function (){
		    },
			url: urlP+"agregarPersonaOn",
			success : function(data) {
				if(data != ""){
					$("#idPer").val(data.id);
					console.log("se agrego correctamente");
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function agregarPersonaEmpresaOn()
	{
		var usuE = localStorage.getItem('id_usu');
		var idEmp = $("#idEmp").val();
		var nPer = $("#dt_frm_per_nom").val();
		var aPer = $("#dt_frm_per_ape").val();
		var tDoc = $("#cboTipoDocumento").val();
		var ndoc = $("#dt_frm_per_ndoc").val();
		var mailp = $("#dt_frm_per_mail").val();
		var telp = $("#dt_frm_per_telf").val();
		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {usuE:usuE, idEmp:idEmp, nPer:nPer, aPer:aPer, tDoc:tDoc, ndoc:ndoc, mailp:mailp, telp:telp},
			beforeSend : function (){
		    },
			url: urlP+"agregarPersonaEmpresaOn",
			success : function(data) {
				if(data != ""){
					var de ="<section class='cont_ind_det_fondo_deci'><section class='cont_ind_det_f_conta'><section class='cont_ind_det_f_izq'><div class='cont_ind_det_izq_ico'><div class='icon-user ico-usr'></div></div></section><section class='cont_ind_det_f_der'><div class='cont_ind_der_top' id='det_emp_cont_nom'>"+$("#dt_frm_per_nom").val()+" "+$("#dt_frm_per_ape").val()+"</div><div class='cont_ind_der_bot' id='det_emp_cont_cargo'>CARGO</div></section></section><section class='cont_ind_det_f_conta'><section class='cont_ind_det_f_izq'><div class='cont_ind_det_izq_ico'><div class='icon-phone'></div></div></section><section class='cont_ind_det_f_der'><div class='cont_ind_der_top' id='det_emp_cont_celu'>"+$("#dt_frm_per_telf").val()+"</div><div class='cont_ind_der_bot'>Celular</div></section></section><section class='cont_ind_det_f_conta'><section class='cont_ind_det_f_izq'><div class='cont_ind_det_izq_ico'><div class='icon-envelope'></div></div></section><section class='cont_ind_det_f_der'><div class='cont_ind_der_top' id='det_emp_cont_mail'>"+$("#dt_frm_per_mail").val()+"</div><div class='cont_ind_der_bot'>Correo</div></section></section></section>";
					$("#cnt_cnt_emp_deci").append(de);
					//$("#idPer").val(data.id);
					//console.log("se agrego correctamente");
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	function generaFecha(d)
	{
		var fret = new Array();
		var fecha = (d).split('-').join('/');
		var nf = new Date(fecha);
		var Anio = nf.getFullYear();
		//var Fecha = Dia[nf.getDay()] + ", " + nf.getDate() + " de " + Mes[nf.getMonth()] + " del " + Anio + ". ";
		if (d.length < 11) {
			fret['diaNom'] = Dia[nf.getDay()];
			fret['diaNum'] = nf.getDate();
			fret['mesNom'] = Mes[nf.getMonth()];
		}
		return fret;
	}

	function listarUsuarioActividad()
	{
		var usuE = localStorage.getItem('id_usu');
		$("#cnt_act_itm").html("");

		$.ajax({
			type: 'POST',
			dataType: 'json', 
			data: {usuE:usuE},
			beforeSend : function (){
		    },
			url: urlP+"listarUsuarioActividad",
			success : function(data) {
				if(data != 0){
					for(var i = 0; i < data.length; i++)
					{
						var fg = generaFecha(data[i]['fecha_act']);
						if(!data[i]['razon_social_cuen'])data[i]['razon_social_cuen'] = 'RAZON SOCIAL';
						if(!data[i]['desc_tact'])data[i]['desc_tact'] = 'Pendiente';
						if(!data[i]['hora_act'])data[i]['hora_act'] = '00:00';
						var ac ="<article class='unid_cont_item_act'><section class='sect_uno_item_izq'><div class='div_fecha_act_top'>"+fg['diaNom']+"</div><div class='div_fecha_act_bot'>"+fg['diaNum']+" "+fg['mesNom']+"</div></section><section class='sect_uno_item_mid' id='"+data[i]['id_act']+"'><div class='div_tipo_act_top'>"+data[i]['desc_tact']+"</div><div class='div_tipo_act_bot'><div class='div_tipo_act_bot_izq'>"+data[i]['hora_act'].substring(0,5)+" / </div><div class='div_tipo_act_bot_der'> "+data[i]['razon_social_cuen']+"</div></div></section><section class='sect_uno_item_der'><article class='cont_req cont_ckh_act'><input type='checkbox' name='act_"+data[i]['id_act']+"' id='act_"+data[i]['id_act']+"' class='desa_det_venta'/><label class='lblcheck chk-lft' for='act_"+data[i]['id_act']+"'></label></article></section></article>";
			            $("#cnt_act_itm").append(ac);
					}
				}else{
					alert("No tienes actividades asignadas")
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