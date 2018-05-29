var serial = {};

(function() {
  'use strict';

  serial.getPorts = function() {
    return navigator.usb.getDevices().then(devices => {
      return devices.map(device => new serial.Port(device));
    });
  };

  serial.requestPort = function() {
    const filters = [
      { 'vendorId': 0x2341, 'productId': 0x8036 },
      { 'vendorId': 0x2341, 'productId': 0x8037 },
      { 'vendorId': 0x2341, 'productId': 0x804d },
      { 'vendorId': 0x2341, 'productId': 0x804e },
      { 'vendorId': 0x2341, 'productId': 0x804f },
      { 'vendorId': 0x2341, 'productId': 0x8050 },
    ];
    return navigator.usb.requestDevice({ 'filters': filters }).then(
      device => new serial.Port(device)
    );
  }

  serial.Port = function(device) {
    this.device_ = device;
  };

  serial.Port.prototype.connect = function() {
  	var SerialAlphaLocal;
  	var SerialGammaLocal;
  	var SerialBetaLocal;

	var crc;
	var tdata;
	var stateM;
	var nagetiveM;
	var valueAngle;   
  		
    let readLoop = () => {
		
    crc = 0;
	stateM = 0;
      		
    this.device_.transferIn(5, 64).then(result => {
	

  	for (var i = 0; i < result.data.byteLength; i++) 
  	{    
  	  	tdata = result.data.getUint8(i);
		console.log(tdata);
        if(tdata == 168)    //   N ASCII:78
		{
		    //console.log("Enter Data Message");
		    stateM = 1;
			crc = 168;
		}
		else if(stateM == 1)    //   N ASCII:78
		{
		    //console.log("Enter N");
		    stateM = 2;
			SerialAlphaLocal = tdata;
			crc = crc + tdata;
		}
		else if(stateM == 2)    //   N ASCII:78
		{
		    //console.log("Enter Alpha");
		    stateM = 3;
            if(tdata >= 100)
            {
                SerialAlphaLocal =  SerialAlphaLocal + ((tdata - 100)/100);
				SerialAlphaLocal =  -SerialAlphaLocal;
			}
			else
			{
                 SerialAlphaLocal =  SerialAlphaLocal + (tdata/100);
			}
			crc = crc + tdata;
		}

		else if(stateM == 3)    //   N ASCII:78
		{
		    //console.log("Enter N");
		    stateM = 4;
			SerialBetaLocal = tdata;
			crc = crc + tdata;
		}
		else if(stateM == 4)    //   N ASCII:78
		{
		    //console.log("Enter Beta");
		    stateM = 5;
            if(tdata >= 100)
            {
                SerialBetaLocal =  SerialBetaLocal + ((tdata - 100)/100);
				SerialBetaLocal =  -SerialBetaLocal;
			}
			else
			{
                 SerialBetaLocal =  SerialBetaLocal + (tdata/100);
			}
			crc = crc + tdata;
		}

		else if(stateM == 5)    //   N ASCII:78
		{
		    //console.log("Enter N");
		    stateM = 6;
			SerialGammaLocal = tdata;
			crc = crc + tdata;
		}
		else if(stateM == 6)    //   N ASCII:78
		{
		    //console.log("Enter Gamma" + tdata);
		    stateM = 7;
            if(tdata >= 100)
            {
                SerialGammaLocal =  SerialGammaLocal + ((tdata - 100)/100);
				SerialGammaLocal =  -SerialGammaLocal;
			}
			else
			{
                 SerialGammaLocal =  SerialGammaLocal + (tdata/100);
			}
			crc = crc + tdata;
		}
		else if(stateM == 7)    //   N ASCII:78
		{
		    if( (crc%100)== tdata);
			{
			    SerialAlpha = SerialAlphaLocal; 
			    SerialBeta  = SerialBetaLocal;  
				SerialGamma = SerialGammaLocal;  
		    }

			//var date = new Date();  
			//console.log(date.getMilliseconds());//??¨¨?¦Ì¡À?¡ã¦Ì?o¨¢??¨ºy
			//console.log("IMU:" + SerialAlpha + " " + SerialBeta + " " + SerialGamma);
			stateM = 0;
		}
      }	
        this.onReceive(result.data);
        readLoop();
      }, error => {
        this.onReceiveError(error);
      });
    };

    return this.device_.open()
        .then(() => {
          if (this.device_.configuration === null) {
            return this.device_.selectConfiguration(1);
          }
        })
        .then(() => this.device_.claimInterface(2))
        .then(() => this.device_.selectAlternateInterface(2, 0))
        .then(() => this.device_.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': 0x22,
            'value': 0x01,
            'index': 0x02}))
        .then(() => {
          readLoop();
        });
  };

  serial.Port.prototype.disconnect = function() {
    return this.device_.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': 0x22,
            'value': 0x00,
            'index': 0x02})
        .then(() => this.device_.close());
  };

  serial.Port.prototype.send = function(data) {
    return this.device_.transferOut(4, data);
  };
})();
