/**
 * Custom WebSocket functions
 *
 */
var __connected = false;

function onOpen(evt){
	writeToScreen("CONNECTED");
	__connected = true;
	
	//Move this logic to caller
	$("#connectionStatusHuman").addClass('label-success').removeClass('label-danger');
	$("#connectionStatusRobot").addClass('label-success').removeClass('label-danger');

	if(__mode == "HUMAN"){
		backHomeHuman();
	}else{
		backHomeRobot();		
	}
}

function closeConnection(){
	websocket.close();
	__connected = false;

	$("#connectionStatusHuman").addClass('label-danger').removeClass('label-success');
	$("#connectionStatusRobot").addClass('label-danger').removeClass('label-success');

	if(__mode == "HUMAN"){
		backHomeHuman();
	}else{
		backHomeRobot();		
	}
}

function doSend(message){

	var s = message;
	if(s.indexOf("data:image/png") != -1){
		writeToScreen("SENT: " + "imagen");

		if(__mode == "HUMAN"){
			backHomeHuman();
		}else{
			backHomeRobot();		
		}
	}else{
		writeToScreen("SENT: " + message); 
	}

    
    websocket.send(message);
}

function onMessage(evt){

    var s = evt.data;
    if(s.indexOf("data:image/png") != -1){

		$("#viewCamera").attr('src', evt.data);

    	writeToScreen('<span style="color: blue;">RESPONSE: ' + "Image received" +'</span>');
    }else{
    	writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
    }

}

/**
 * Events
 */
$(function() {
	$("#cardRobotHome").hide();
	$("#cardHumanHome").hide();
	$("#cardConnection").hide();
	$("#cardLog").hide();
	$("#cardShareCamera").hide();
	$("#cardViewCamera").hide();
	$("#cardRemoteControl").hide();
});

//Back
function backHomeRobot(){
	$("#cardHome").hide();
	$("#cardConnection").hide();
	$("#cardShareCamera").hide();
	$("#cardViewCamera").hide();
	$("#cardLog").hide();
	$("#cardHumanHome").hide();
	$("#cardRobotHome").show();
}

function backHomeHuman(){
	$("#cardHome").hide();
	$("#cardConnection").hide();
	$("#cardShareCamera").hide();
	$("#cardViewCamera").hide();
	$("#cardLog").hide();
	$("#cardRobotHome").hide();
	$("#cardRemoteControl").hide();
	$("#cardHumanHome").show();
}

function backHome(){
	$("#cardRobotHome").hide();
	$("#cardHumanHome").hide();
	$("#cardHome").show();
}

var __enabledCamera = false;
var __enableShareCamera = false;
var __mode = "";

$(function() {

	$('#btEnableShareCamera').click(function() {

		var canvas = document.getElementById('canvas-source');

		//Copy an area in Canvas.
		var ctx = canvas.getContext("2d");
		var myImageData = ctx.getImageData(0, 0, 200, 200);
		var buffer = document.createElement('canvas');
		var bufferCtx = buffer.getContext("2d");
		buffer.width = 200;
		buffer.height = 200;
		bufferCtx.putImageData(myImageData, 0, 0);
		//window.open(buffer.toDataURL('image/png'));

		var dataURL = buffer.toDataURL("image/png");
		dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		doSend(dataURL);

		__enableShareCamera = true;

		$("#shareCameraStatus").addClass('label-success').removeClass('label-danger');

	});

	$('#btDisableShareCamera').click(function() {
		__enableShareCamera = false;

		$("#shareCameraStatus").addClass('label-danger').removeClass('label-success');
	});


	$('#btHomeRobot').click(function() {
  		$("#cardHome").hide();
  		$("#cardRobotHome").show();

  		__mode = "ROBOT";
	});

	$('#btHomeHuman').click(function() {
  		$("#cardHome").hide();
  		$("#cardHumanHome").show();

  		__mode = "HUMAN";
	});

	$('#btConnect').click(function() {
		var ip = $('#ip').val();
		var port = $('#port').val(); 
		initWebSocketConnection(ip,port);
	});

	$('#btDisconnect').click(function() {
		closeConnection();
	});

	function showConnectionCard(){
		if(__connected){
  			$("#btConnect").hide();
  			$("#btDisconnect").show();
  		}else{
  			$("#btConnect").show();
  			$("#btDisconnect").hide();
  		}

  		$("#cardConnection").show();
	}

	//Home
	$('#btHomeConnectHuman').click(function() {
  		$("#cardHumanHome").hide();

  		showConnectionCard();
	});

	$('#btHomeConnectRobot').click(function() {
  		$("#cardRobotHome").hide();

  		showConnectionCard();
	});

	$('#btHomeShareCamera').click(function() {

		if(!__enabledCamera){
			initVision();
			__enabledCamera = true;
		}

		if(__enableShareCamera){
  			$("#btEnableShareCamera").hide();
  			$("#btDisableShareCamera").show();
  		}else{
  			$("#btEnableShareCamera").show();
  			$("#btDisableShareCamera").hide();
  		}

  		$("#cardRobotHome").hide();
  		$("#cardShareCamera").show();
	});

	$('#btHomeRemoteControl').click(function() {
  		$("#cardHumanHome").hide();
  		$("#cardRemoteControl").show();
	});

	$('#btHomeViewCamera').click(function() {
  		$("#cardHumanHome").hide();
  		$("#cardViewCamera").show();
	});

	$('#btHomeLogHuman').click(function() {
  		$("#cardHumanHome").hide();
  		$("#cardLog").show();
	});

	$('#btHomeLogRobot').click(function() {
  		$("#cardRobotHome").hide();
  		$("#cardLog").show();
	});

	$('#btBackConnect').click(function() {
		if(__mode == "HUMAN"){
			backHomeHuman();
		}else{
			backHomeRobot();		
		}
	});

	$('#btBackViewCamera').click(function() {
		backHomeHuman();
	});

	$('#btBackShareCamera').click(function() {
		backHomeRobot();
	});

	$('#btBackRemoteControl').click(function() {
		backHomeHuman();
	});

	$('#btBackLog').click(function() {
		if(__mode == "HUMAN"){
			backHomeHuman();
		}else{
			backHomeRobot();		
		}
	});

	$('#btBackHomeRobot').click(function() {
		backHome();
	});

	$('#btBackHomeHuman').click(function() {
		backHome();
	});

});

/**
 * Vision
 */
function initVision(){

	//Image Processor

	//Vision.js
	Vision.setFPS(30);
	Vision.setSize(300,300);
	Vision.initCamera();
	Vision.setProcessor(DefaultImageProcessor);
	Vision.run();

	//Resize
}

