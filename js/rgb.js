(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let port;

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
    };

    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
	connectButton.className = 'fa fa-search icon';
        connectButton.title = 'Conect';
   
        connectButton.textContent = ' ';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
          connectButton.className = 'fa fa-gamepad icon';
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
