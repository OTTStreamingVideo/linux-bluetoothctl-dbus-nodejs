"use strict";

const fs                          = require("fs");            // in base package
const {exec,execSync,spawn,fork}  = require("child_process"); // in base package

//
// set timezone and get time_exports
//

process.env.TZ = "America/Los_Angeles";

var time_exports;

try {
  fs.accessSync(process.cwd() + "/time_exports.jsc", fs.constants.R_OK);
  time_exports                = require(process.cwd() + "/time_exports.jsc");
}
catch (err) {
  time_exports                = require(process.cwd() + "/time_exports.js");
}

const ts                          = time_exports.ts;
const ts1                         = time_exports.ts1;
const ts2                         = time_exports.ts2;
const ts3                         = time_exports.ts3;
const tsDTnow                     = time_exports.tsDTnow;
const tsDT                        = time_exports.tsDT;
const DO_tsDT                     = time_exports.DO_tsDT;

var cmd = "sudo timedatectl set-timezone America/Los_Angeles";
var out = "out-not-defined";

try {
  out = execSync(cmd).toString();
  console.log(ts()+"server.js cmd: %s, out:\n", cmd, out);
}
catch (err) {
  console.log(ts()+"server.js cmd: %s, err:\n", cmd, err);
}

cmd = "date";

try {
  out = execSync(cmd).toString();
  console.log(ts()+"server.js cmd: %s, out:\n", cmd, out);
}
catch (err) {
  console.log(ts()+"server.js cmd: %s, err:\n", cmd, err);
}

console.log(ts()+"server.js time_exports loaded, process.cwd(): %s", process.cwd());

//
// process.exit() via SIGINT or SIGTERM
//

process.on('SIGINT', function(){
  
  console.log();
  console.log();
  console.log(ts()+"server.js process.on('SIGINT' (e.g. 'CTRL-C') -> process.exit()");
  console.log();
  
  process.exit();  

});

process.on('SIGTERM', function(){
  
  console.log();
  console.log();
  console.log(ts()+"server.js process.on('SIGTERM' (e.g. 'kill') -> process.exit()");
  console.log();
  
  process.exit();  

});

//
// uncaughtException
//

process.on('uncaughtException', err => {
  
  console.log(ts()+"server.js FATAL ERROR process.on('uncaughtException' err:\n", err);
  console.log();
  process.exit(1); // mandatory (as per the Node.js docs)
  
});


//console.log(ts()+"server.js process.exit(0)");
//process.exit(0);


const ip                          		= require("ip");
const util                        		= require("util");
const md5                         		= require("md5");
const https                       		= require("https");
const url                         		= require("url");
const bodyParser                  		= require("body-parser");
const express                     		= require("express");
const {WebSocket, WebSocketServer } 	= require("ws");
const MarkdownIt 											= require('markdown-it');

//
// cfgObj
//

var cfgObj_exports;

try {
  fs.accessSync(process.cwd() + "/cfgObj_exports.jsc", fs.constants.R_OK);
  cfgObj_exports                = require(process.cwd() + "/cfgObj_exports.jsc");
}
catch (err) {
  cfgObj_exports                = require(process.cwd() + "/cfgObj_exports.js");
}

const cfgObj                    = cfgObj_exports.cfgObj;
console.log(ts()+"server.js", {cfgObj});

process.env.cfgStr 							= JSON.stringify(cfgObj);

/*

in child process use:

var cfgObj = JSON.parse(process.env.cfgStr);

*/

//
// express http webserver (nginx can be proxy for https)
//

console.log(ts()+"server.js process.argv:\n", process.argv);

const prog              = "server.js";

const port              = cfgObj.port;    // nginx can be reverse proxy for https
const domain            = cfgObj.host;

var webserver           = express();

webserver.use(bodyParser.urlencoded({ extended: true }));
webserver.use(express.json());
webserver.use(express.static('public'));

webserver.engine('ntl', function (filePath, options, callback) {
  getPage(filePath, options, callback);
});

webserver.set('views', './views');
webserver.set('view engine', 'ntl');

webserver.listen(port, () => {
  
  if (process.env.PM2_HOME){ // use with pm2 (https://www.npmjs.com/package/pm2)
		
    console.log(ts()+'server.js process.env.PM2_HOME: true');
    console.log(ts()+'server.js JSON.stringify(process.env): ' + JSON.stringify(process.env));
    console.log(ts()+'server.js process.env.PM2_HOME: ' + process.env.PM2_HOME);
    console.log(ts()+'server.js process.env.pm_exec_path: ' + process.env.pm_exec_path);
    
  } else {
		
    console.log(ts()+'server.js process.env.PM2_HOME: false');
    
  }
  
  console.log(ts()+"%s webserver ready at http://%s:%s for nginx https reverse proxy", prog, domain, port);
    
});

//console.log(ts()+"server.js process.exit(0)");	// uncomment to stop for debug 
//process.exit(0);																// uncomment to stop for debug 

//
// WebSocketServer
//

var ws = new WebSocketServer({ port: cfgObj.ws_port });

//console.log(ws); // for debug

ws.on('connection', function connection(ws) {
	
	ws.on('error', reason => console.error(ts()+'ws error: ' + reason.toString()));
	
	ws.on('close', reason => console.log(ts()+'ws close: ' + reason.toString()));
	
  ws.on('message', function message(data) {
		
    console.log(ts()+'received: %s', data);
    
  });

	global.ws_send = function ws_send(msg) { // global allows access from inside webserver.post
			ws.send(msg);
	}
	
	ws_send(JSON.stringify({"el":"info","html":ts()+'WebSocketServer connected on ' + cfgObj.ws_url}));
  
});

function ascii_to_hexa(str) {
	
	var arr1 = [];
	
	for (var n = 0, l = str.length; n < l; n ++) {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	
	return arr1.join('');

} // function ascii_to_hexa(str)

//
// webserver.get
//

webserver.get('/', (req, res) => {
  
  let options = {};
  
  res.render('main', options);
  return;

});

//
// webserver.post('/bluetooth'
//

webserver.post('/bluetooth', function (req, res) {
  
  console.log(ts()+"server.js post /bluetooth req.body: %s", util.inspect(req.body));
  
  //
  // connect to TCL   64:09:AC:3A:72:EF
  //
  
  if(req.body.cmd == "connect"){
    
    console.log(ts()+"server.js post /bluetooth req.body.cmd == connect req.body: %s", util.inspect(req.body));
    
    var cmd           	= "cmd-not-defined";
    var step          	= 1*1;
    var timeout_mSec  	= 30000;
    
    var allData       	=	"allData-not-defined";

    const child_bt_ctl 	= require('child_process').spawn('/usr/bin/bash');

		if (cfgObj.bt_timeout_mSec > 0*1) {
		
			setTimeout(function(){
				
				child_bt_ctl.kill();
				
				console.log(ts()+"server.js timeout at %s mSec, child_bt_ctl.kill()\n\n", timeout_mSec);
				
				res.send({"html":allData});
				
			}, cfgObj.bt_timeout_mSec);
			
		}

		
    // handle error
    child_bt_ctl.on('error', err => {
      console.log(ts()+"server.js error:\n" + err.toString());
    });

    // Capture stdout
    child_bt_ctl.stdout.on('data', d => {
      
      allData += "<br>" + d.toString();
      
      console.log(ts()+"server.js stdout:\n" + d.toString());
      
      ws_send(JSON.stringify({"el":"bt","html":ts() + d.toString()}));
      
      //
      // look for TCL
      //
      
      if (d.toString().includes("64:09:AC:3A:72:EF")) {
      
        console.log(ts()+"server.js 'TCL T790S' found");
        
        ws_send(JSON.stringify({"el":"bt","html":ts() + "'TCL T790S' found"}));
      
      }
      
      
      if (d.toString().includes('[bluetooth]') && (step == 1*1)) {
        
        console.log(ts()+"server.js step1: '[bluetooth]' found");
        
        cmd = "power on";
        child_bt_ctl.stdin.write(cmd + '\n');
        
        step = 2;
      }
      
      else if (d.toString().includes('power on') && step == 2) {
        
        console.log(ts()+"server.js step 2: 'power on' found");
        
        cmd = "scan on";
        child_bt_ctl.stdin.write(cmd + '\n');
        
        step = 3;
      
      }
      
      else if (d.toString().includes('Discovery started') && step == 3) {
        console.log(ts()+"server.js step3: 'Discovery started' found");
      } 
      
    });

    //
    // first command to child_bt_ctl
    //

    cmd = "bluetoothctl";
    child_bt_ctl.stdin.write(cmd + '\n');
    console.log(ts()+"server.js send cmd: '%s'", cmd);
    
  } // if(req.body.cmd == "connect")
  
});

//
// webserver.post('/dbus'
//

webserver.post('/dbus', function (req, res) {
	
	var cmd           = "cmd-not-defined";
	var step          = 1*1;
	var timeout_mSec  = 30000;

	var allData       = "dbus-allData-not-defined";

	const child_dbus = require('child_process').spawn('/usr/bin/bash');

	if (cfgObj.dbus_timeout_mSec > 0*1) {
	
		setTimeout(function(){
			
			child_dbus.kill();
			
			console.log(ts()+"server.js timeout at %s mSec, child_dbus.kill()\n\n", cfgObj.dbus_timeout_mSec);
			
			res.send({"html":allData});
			
		}, cfgObj.dbus_timeout_mSec);
		
	}
		

	child_dbus.on('error', err => {
		console.log(ts()+"server.js child_dbus error:\n" + err.toString() + "\r\n");
	});

	child_dbus.stdout.on('data', d => {
		
		//console.log(ts()+"server.js child_dbus stdout:\n" + d.toString() + "\r\n");
		
		//
		// look for bluez
		//
		
		var i = 0*1;
		
		if (d.toString().includes("bluez")) {
		
			console.log(ts()+"server.js child_dbus 'bluez' found\r\n");
			
			var lineArr = d.toString().split("\n");
			
			console.log(ts()+"server.js child_dbus arr.length: %s\r\n" , lineArr.length);
			
			var i = 0*1;
			
			lineArr.forEach(line => {
				
				i++;
				
				var lineClean = line.replace(/\s/g, " ").trim();
				
				console.log(ts()+"server.js child_dbus i: %s, lineClean: %s\r\n", i, lineClean);
				
				//console.log(ts()+"server.js child_dbus i: %s, lineClean: %s", i, ascii_to_hexa(lineClean));
				
				ws_send(JSON.stringify({"el":"dbus","html":ts() + "i: " + i + ", " + lineClean}));
				
			});
		
		} // if (d.toString().includes("bluez")) 
		
	}); // child_dbus.stdout.on('data'

	//
	// first command to child_dbus
	//

	cmd = "sudo dbus-monitor --system";
	child_dbus.stdin.write(cmd + '\n');
	console.log(ts()+"server.js child_dbus send cmd: '%s'\r\n", cmd);

}); // webserver.post('/dbus'


//
// getPage
//

function getPage(filePath, options, callback){
  
  //console.log(ts()+"server.js getPage() filePath: ", filePath);
  //console.log(ts()+"server.js getPage() options:\n", options);
  
  fs.readFile(filePath, function (err, content) {

    if (err) {
      return callback(new Error(err.message));
    }

    var rendered = content.toString();

    if(filePath.includes("main.ntl")){
      
      rendered = rendered.replace(/\{\{title\}\}/g, cfgObj.title);
      rendered = rendered.replace(/\{\{credit\}\}/g, cfgObj.credit);
      rendered = rendered.replace(/\{\{ws_url\}\}/g, cfgObj.ws_url);
      
      var md = new MarkdownIt();
      rendered = rendered.replace(/\{\{readme\}\}/g, md.render(fs.readFileSync("README.md").toString()));
            
    } // if(filePath.includes("main.ntl")

    return callback(null, rendered);
    
  }); // fs.readFile
  
} //  getPage
