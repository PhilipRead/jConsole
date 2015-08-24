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
			var nextExecution = function() {
				VisualUtils.printOutput(command + ' is not a recognized command on this system.', 15);
			};
			curSystem.executionQueue.push(nextExecution);
	}

	Commands.executeQueue();
};

Commands.ls = function() {
	var curChildren = curSystem.curFolder.children;
	var i;
	for(i = 0; i < curChildren.length; i++) {
		var nextExecution;
		(function (thisChildName) {
			nextExecution = function() {
				VisualUtils.printOutput(thisChildName, 20);
			};
		})(curChildren[i].name);
		curSystem.executionQueue.push(nextExecution);
	}
};

Commands.executeQueue = function() {
	var execQueue = curSystem.executionQueue;
	if(execQueue.length > 0) {
		var nextExec = execQueue.shift();
		nextExec();
	}
	else {
		VisualUtils.returnControl();
	}
};