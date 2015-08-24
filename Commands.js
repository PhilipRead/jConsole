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
			break;
		default:
			VisualUtils.printOutput(command + ' is not a recognized command on this system.', 15);
	}	
};

Commands.ls = function() {
	var outputDirs = '';
	var curChildren = curSystem.root.children;
	var i;
	for(i = 0; i < curChildren.length; i++) {
		outputDirs += curChildren[i].name + ' ';
	}
	console.log(outputDirs);
	VisualUtils.printOutput(outputDirs, 20);
};