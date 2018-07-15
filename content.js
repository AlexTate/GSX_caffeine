
//The solution works using the idleTimeoutEventHandler patch alone, but navigating around GSX reloads IdleTimer.js every time,
//	so we have to use an extension to reinject and repatch each time the window changes
//Payload is formatted as a text variable so that we can inject it into a script tag below

var payload = '(' + function patchr(){
	try{				
		//Da magic. When an idle event is triggered, timer instead reinstantiates itself and sends a signal to the server to
		//	extend the session on the server side
		IdleTimer.idleTimeoutEventHandler = IdleTimer.doActivate;	
		
		//Diagnostic checkpoint
		console.log("Patch complete.");
	}
	
	//Handle any error that may have occurred in the try{} above
	catch (e){
		//Diagnostic checkpoint
		console.log("Waiting...");
		
		//Sometimes the IdleTimer JS doesn't load in time. If so, there will be an error on refxerencing IdleTimer. wait politely.
		if (e instanceof ReferenceError) {
			
			//Wait 2 seconds and call self again
			setTimeout(patchr, 2000);
		}
	}
} + ')();'; //



//Have to inject a script tag into the page since Chrome extensions are unable to directly modify js variables from this scope

inject = function(){	
	//Create a new, untethered script tag
	var hook = document.createElement("script");
	console.log("Vehicle created.");

	//Populate the script tag with the patch
	hook.textContent = payload;	
	console.log("Vehicle populated with patch code.");

	//Tether the script tag to the document	
	(document.head||document.documentElement).appendChild(hook);
	console.log("Injection complete.");
	
	//Garbage collection
	hook.remove();
	console.log("Vehicle removed.");
}


//Party.start()
inject();