(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let port;
	let textEncoder = new TextEncoder();

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = ' ';

        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          //console.log(textDecoder.decode(data));
        }
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        //statusDisplay.textContent = error;
      });
    }

    function onUpdate() {
      if (!port) {
        return;
      }

      let view = new Uint8Array(3);
      view[0] = parseInt(redSlider.value);
      view[1] = parseInt(greenSlider.value);
      view[2] = parseInt(blueSlider.value);
      port.send(view);
    };

	lockScreenButton.addEventListener('click', function() {
	  	if(lockmark == 0)
	  	{
	  	    lockmark = 1;
			if (port !== undefined) {
			port.send(textEncoder.encode('l')).catch(error => {
            t.io.println('Send error: ' + error);
             });
			}
			window.lockScreenButton.className = 'fa fa-unlock icon rfloat';
            window.lockScreenButton.title = 'unlock';
	  	
	  	}
		else
		{
            lockmark = 0;
			if (port !== undefined) {
			port.send(textEncoder.encode('L')).catch(error => {
            t.io.println('Send error: ' + error);
             });
			}
			window.lockScreenButton.className = 'fa fa-lock icon rfloat';
            window.lockScreenButton.title = 'lock';
		}
    });

    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
		connectButton.className = 'fa fa-hmdvr-o icon';
        connectButton.title = 'Conect';
   
        connectButton.textContent = ' ';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
          connectButton.className = 'fa fa-hmdvr-after-o icon';
          connectButton.title = 'Conect';
		  
        }).catch(error => {
          //statusDisplay.textContent = error;
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        statusDisplay.textContent = ' ';
      } else {
        statusDisplay.textContent = ' ';
        port = ports[0];
        connect();
      }
    });
  });
})();
