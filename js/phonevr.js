"use strict";

// It seems to be impossible to synchronously detect whether we have an orientation sensor.
// Even Chromium on the desktop has a 'deviceorientation' event, and it will fire once with
// all nulls.
var timestamp;
var accX, accY, accZ;
var gyroX, gyroY, gyroZ;
var magX, magY, magZ;

var SerialAlpha;
var SerialBeta;
var SerialGamma;

function PhoneVR() {
    //SerialAlpha     up(-180)   -  down (0)
    //SerialBeta      rotation L (-90)  - rotation R (+90)
    //SerialGamma     view L (-180) - (+180)
    
    //deviceAlpha     view L (+180) - (-180)
    //deviceBeta      rotation L (+90)  - rotation R (-90)
    //deviceGamma     down (-180) - up(0) 
    SerialAlpha = 0;
    SerialBeta  = 0;
    SerialGamma = 0;
    this.deviceAlpha = -SerialGamma;
    this.deviceBeta  = -SerialBeta;
    this.deviceGamma = SerialAlpha;

}

PhoneVR.prototype.rotationQuat = function() {

    if(SerialGamma == 0 && SerialBeta ==0 && SerialGamma==0){
        SerialGamma = 0;
        SerialBeta  = 0;
        SerialAlpha = -90;  
    }
        
    //this.deviceAlpha = -SerialGamma;
    //this.deviceBeta  = -SerialBeta;
    //this.deviceGamma = SerialAlpha;
	  
    if(SerialGamma < -180) SerialGamma = -180; if(SerialGamma > 180) SerialGamma = 180;
    if(SerialBeta < -90) SerialBeta = -90;     if(SerialBeta > 90) SerialBeta = 90;
    if(SerialAlpha < -180) SerialAlpha = -180;       if(SerialAlpha > 0) SerialAlpha = 0;
	  
    if((SerialGamma + this.deviceAlpha) > 2 || (SerialGamma + this.deviceAlpha) < -2) 
    {
        this.deviceAlpha = -SerialGamma;
    }
    else
    {
        this.deviceAlpha = this.deviceAlpha - (SerialGamma + this.deviceAlpha)/10;
    }    
	  
    if((SerialBeta + this.deviceBeta) > 2 || (SerialBeta + this.deviceBeta) < -2) 
    {
        this.deviceBeta  = -SerialBeta;
    }
    else
    {
        this.deviceBeta = this.deviceBeta - (SerialBeta + this.deviceBeta)/10;
    }
	  
	  
    if((SerialAlpha - this.deviceGamma) > 2 || (SerialAlpha - this.deviceGamma) < -2) 
    {
        this.deviceGamma = SerialAlpha;
    }
    else
    {
        this.deviceGamma = this.deviceGamma + (SerialAlpha - this.deviceGamma)/10;
    }

    var degtorad = Math.PI / 180; // Degree-to-Radian conversion
    var z = this.deviceAlpha * degtorad / 2;
    var x = this.deviceBeta * degtorad / 2;
    var y = this.deviceGamma * degtorad / 2;
	
    var cX = Math.cos(x);
    var cY = Math.cos(y);
    var cZ = Math.cos(z);
    var sX = Math.sin(x);
    var sY = Math.sin(y);
    var sZ = Math.sin(z);

    // ZXY quaternion construction.
    var w = cX * cY * cZ - sX * sY * sZ;
    var x = sX * cY * cZ - cX * sY * sZ;
    var y = cX * sY * cZ + sX * cY * sZ;
    var z = cX * cY * sZ + sX * sY * cZ;

    var deviceQuaternion = quat.fromValues(x, y, z, w);

    // Correct for the screen orientation.
    var screenOrientation = (util.getScreenOrientation() * degtorad)/2;
    var screenTransform = [0, 0, -Math.sin(screenOrientation), Math.cos(screenOrientation)];

    var deviceRotation = quat.create();
    quat.multiply(deviceRotation, deviceQuaternion, screenTransform);

    // deviceRotation is the quaternion encoding of the transformation
    // from camera coordinates to world coordinates.  The problem is that
    // our shader uses conventional OpenGL coordinates
    // (+x = right, +y = up, +z = backward), but the DeviceOrientation
    // spec uses different coordinates (+x = East, +y = North, +z = up).
    // To fix the mismatch, we need to fix this.  We'll arbitrarily choose
    // North to correspond to -z (the default camera direction).
    var r22 = Math.sqrt(0.5);
    quat.multiply(deviceRotation, quat.fromValues(-r22, 0, 0, r22), deviceRotation);

    return deviceRotation;
}
