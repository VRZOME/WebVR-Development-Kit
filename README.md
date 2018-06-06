VRZOME Development Kit
================

The VRZOME lets you watch 180/360 flat and stereo video on its own development kit. It contains 4K LCD and oculus IMU sensor, and use Chrome web broser.

Hardware information：
LCD：SONY Z5P 5.5 inch 4K (2560*3840)

![](https://img.alicdn.com/imgextra/i2/2737832668/TB24wGObeUXBuNjt_a0XXcysXXa_!!2737832668.jpg)

Videos shown in the player can be rotated using keyboard controls  (a/d, w/s, and q/e), as well as by the Oculus Rift if you are running an experimental webVR browser. You may be able to decrease video judder by setting your Oculus Display refresh rate to 60 Hz (the browser refreshes at 60 Hz and the slower mismatch can cause judder).

#### [Go check out the demo!](https://vrzome.github.io/WebVR-Development-Kit/) ####

The following table documents the keyboard controls currently available.

| Key | Control           |
|:-----:|-------------|
| p   | play/pause |
| l   | toggle looping |
| f   | full screen webVR mode (with barrel distortion) |
| g   | regular full screen mode (less lag) |
| w   | up |
| a   | left |
| s   | down |
| d   | right |
| q   | rotate left |
| e   | rotate right |

VRZOME was developed by China NEXUS tech .ltd. It's desinged for WebVR develoment. As far as I know, the devices(Oculus/PSVR/other HMD) has their own protocal. Before Using these device, install several drivers and configuration. Until WebVR, it is based on Chrome Web, and it is opene-source. It's good time to release this Webvr Hardware devrlopment Kit.

## Where to buy ##
Alibaba：sale deriectly $200 (including tax and shipment)<br/>
https://item.taobao.com/item.htm?id=571097293214
<br/>Contact: way2way@live.com

## Future Work ##
The following is a short subset of planned future work on the player.
- upgrade IMU sensor and fusion algorithm
- upgrade audio decode IC and amplifier
- Merge Webvr

## 3rd party libraries ##
The following assets are used by the VRZOME:
- eleVR Player - https://github.com/hawksley/eleVR-Web-Player
- glMatrix - Similar to MIT License - http://glmatrix.net/
- Font Awesome - MIT License - http://fortawesome.github.io/Font-Awesome/
