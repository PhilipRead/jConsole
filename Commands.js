Commands.execute = function(rawCommand) {
	var commandInput = rawCommand.trim().replace(/\s+/g, ' ');
	if(commandInput == '') {
		return null;
	}
	
	var splitCommand = commandInput.split(' ');
	var command = splitCommand[0];
	
	switch(command) {
		case 'ls':
			Commands.ls();
		default:
			VisualUtils.printOutput(command + ' is not a recognized command on this system.', 15);
	}	
}

//Commands.ls = function() {
	//var 
//}