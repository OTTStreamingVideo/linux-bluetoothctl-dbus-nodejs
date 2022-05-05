"use strict";

console.log("cfgObj_exports.js START at : %s", new Date());

var cfgObj            		= {};

const ip              		= require("ip");

cfgObj.host         			= ip.address();
cfgObj.port           		= 3000;

cfgObj.ws_port        		= 3001;
cfgObj.ws_url         		= "ws://" + cfgObj.host + ":" + cfgObj.ws_port + "/ws";

cfgObj.bt_timeout_mSec		= 60000;	// to disable set to 0*1
cfgObj.dbus_timeout_mSec	= 60000;	// to disable set to 0*1

cfgObj.title          		= "Bluetoothctl and D-Bus Tool";
cfgObj.credit          		= "Courtesy of <a href='https://OTTStreamingVideo.net' target='_blank'>OTTStreamingVideo.net</a>";

//
// exports
//

exports.cfgObj   = cfgObj;

console.log("cfgObj_exports.js END at : %s", new Date());
