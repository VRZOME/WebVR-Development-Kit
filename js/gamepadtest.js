/*
 * Gamepad API Test
 * Written in 2013 by Ted Mielczarek <ted@mielczarek.org>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */
var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;
var eye_Znear = 0;
var eye_Zfar  = 0;
var eye_PD    = 0;
var eye_FOV   = 0;
var eye_HV    = 0;
  
function get_config(device_id, query_s)
{
	$.ajax({
		type:'POST',
		url:'/index.php/welcome/get_config_db',
		async: false,
		data:'device_id=' + device_id + '&query_s=' + query_s,
		success:function(msg){
			if(query_s == 'zNear')
			{
			    eye_Znear = msg;	
		  }
		  if(query_s == 'zFar')
			{
				  eye_Zfar = msg;
		  }
		  if(query_s == 'PD')
			{
				  eye_PD = msg;
		  }
		  if(query_s == 'Fov')
			{
				  eye_FOV = msg;
		  }
		  if(query_s == 'Vertical')
			{
				  eye_HV = msg; 
		  }
		}
	})
}  

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; 
  rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}

function convert_to_data (tdata) {
  if(tdata == 0) 
  {
    return 0;
  }  
  else
  {
    return (Math.round((tdata / 0.000061) * 2) / 100);
  }  
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
  	var buttonData = 0;
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    
    for (var i=0; i<controller.buttons.length; i++) {
    	var val = controller.buttons[i];
    	var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }
    	if(pressed){
    		buttonData = buttonData + ( 1 << i );
    	}
    }	
    
    if(buttonData == 0){  
      SerialAlpha = convert_to_data(controller.axes[2]);
      SerialBeta = convert_to_data(controller.axes[3]);
      SerialGamma = convert_to_data(controller.axes[4]);
      
      //accX = convert_to_data(controller.axes[1]);
      //accY = convert_to_data(controller.axes[2]);
      //accZ = convert_to_data(controller.axes[3]);
      //gyroX = convert_to_data(controller.axes[4]);
      //gyroY = convert_to_data(controller.axes[5]);
      //gyroZ = convert_to_data(controller.axes[6]);
      //magX = convert_to_data(controller.axes[7]);
      //magY = convert_to_data(controller.axes[8]);
      //magZ = convert_to_data(controller.axes[9]);

    }
  }
  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}
