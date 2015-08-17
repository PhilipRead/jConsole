VisualUtils.setCursorVals = function(prefixLen, suffixLen) {
	cursorPosition = prefixLen;
	cursorMargin = suffixLen;
	$('#cursor').css('margin-left', '-' + String(cursorMargin) + '.5ch');
}

VisualUtils.cursorBlink = function() {
	if($('#cursor').text().length > 0) {
		$('#cursor').html('');
	}
	else {
		$('#cursor').html('|');
	}
}

VisualUtils.printOutput = function(output, speed) {
	outputTxt = output;
	$('#output').append('<div></div>');
	lastDiv = $('#output').children().last();
	outputInterval = setInterval(VisualUtils.scrollPrint, speed);
}

VisualUtils.scrollPrint = function() {
	if(outputTxt) {
		var curOutput = lastDiv.text();
		lastDiv.html(curOutput + outputTxt[0]);
		outputTxt = outputTxt.slice(1);
	}
	else {
		$('#prompt').html('> ');
		clearInterval(outputInterval);
		cursorBlinkTimer = setInterval(VisualUtils.cursorBlink, 500);
		commandExecuting = false;
	}
}