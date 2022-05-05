"use strict";

Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSSmmm', {
  
  value: function() {
    
    function pad2(n) {  // always returns a string
      return (n < 10 ? '0' : '') + n;
    }
    
    function pad3(n) {  // always returns a string
      if (n < 10) {return '00' + n}
      else if (n < 100) {return '0' + n}
      else {return '' + n}
    }
        
    return this.getFullYear() + '-' +
       pad2(this.getMonth() + 1) + '-' +
       pad2(this.getDate()) + '_' +
       pad2(this.getHours()) + ':' +
       pad2(this.getMinutes()) + ':' +
       pad2(this.getSeconds()) + '.' +
       pad3(this.getMilliseconds());
  }
});

function ts(){
  return new Date().YYYYMMDDHHMMSSmmm() + " : ";
}

function ts1(){
  return new Date().YYYYMMDDHHMMSSmmm();
}


function bt_connect() {
  
  var jsonObj  = {"cmd":"connect"};
  
  $.ajax({
    url : "/bluetooth",
    type : "POST",
    dataType : "json",
    data : jsonObj
  })

  .fail(function(e){

    console.log(ts()+"main.js bt_connect() ERROR JSON.stringify(e):\n" + JSON.stringify(e));

  })

  .done(function(data){
    
    console.log(ts()+"main.js bt_connect() SUCCESS data JSON.stringify(data):\n" + JSON.stringify(data));
    
    document.getElementById("div_bt_display").innerHTML     = data.html;

  }); // .done  
  
} // function bt_connect()

function dbus_connect() {
  
  var jsonObj  = {"cmd":"connect"};
  
  $.ajax({
    url : "/dbus",
    type : "POST",
    dataType : "json",
    data : jsonObj
  })

  .fail(function(e){

    console.log(ts()+"main.js dbus_connect() ERROR JSON.stringify(e):\n" + JSON.stringify(e));

  })

  .done(function(data){
    
    console.log(ts()+"main.js dbus_connect() SUCCESS data JSON.stringify(data):\n" + JSON.stringify(data));
    
    document.getElementById("div_dbus_connect").innerHTML     = data.html;

  }); // .done  
  
} // function dbus_connect()

//
// single page architecture
//

function spa_home() {
	
	spa_hide_all();
	document.getElementById("spa_home").style.display = "block";
	
} // function spa_home()

function spa_readme() {
	
	spa_hide_all();
	document.getElementById("spa_readme").style.display = "block";
	
} // function spa_readme()

function spa_hide_all() {
	
	var list = document.getElementsByClassName('spa_body');
	
	for (var i = 0; i < list.length; i++) {
		list[i].style.display = "none";
	}
	
} // function spa_hide_all()

//
// onload
//

var ws = "ws-not-defined";

window.addEventListener('load', (event) => {
	
	console.log(ts()+'The page has fully loaded');
	
	//
	// spa
	//
	
	spa_hide_all();
	document.getElementById("spa_home").style.display = "block";
	
	//
	// websockets
	//
	var ws_url = document.getElementById("ws_url").value;

	ws = new WebSocket(ws_url);

	ws.onopen = function() {
								
		ws.send(ts()+"ws.onopen");

	};
	 
	ws.onmessage = function (evt) {
		
		//document.getElementById("div_ws_display").innerHTML += "<br>" + evt.data;
		
		var obj = JSON.parse(evt.data);

		if (obj.el == "info") {
			
			document.getElementById("div_info_display").innerHTML += "<br>" + obj.html;
			
		}
			
		if (obj.el == "bt") {
			
			document.getElementById("div_bt_display").innerHTML += "<br>" + obj.html;
			
		}

		if (obj.el == "dbus") {
			
			document.getElementById("div_dbus_display").innerHTML += "<br>" + obj.html;
			
		}
			
	};	 

	ws.onclose = function() { 
		
		console.log(ts()+'ws.onclose');
		
	};
	
	ws.onerror = function(err) { 
		
		console.log(ts()+'ws.onerror ', err);
		
	};
                   
}); // window.addEventListener('load'
