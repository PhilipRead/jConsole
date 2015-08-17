$(document).ready(function() {
	setCursorVals($('#input').text().length, 0);
	cursorBlinkTimer = setInterval(cursorBlink, 500);
	$('#commandLine').mousedown(MouseUtils.mousedownConsole);
});

$(document).keydown(KeyUtils.keyDownHandler);
$(document).keyup(KeyUtils.keyUpHandler);

function setCursorVals(prefixLen, suffixLen) {
	cursorPosition = prefixLen;
	cursorMargin = suffixLen;
	$('#cursor').css('margin-left', '-' + String(cursorMargin) + '.5ch');
}

function cursorBlink() {
	cursorBody = $('#cursor').text();
	if(cursorBody.length > 0) {
		$('#cursor').html('');
	}
	else {
		$('#cursor').html('|');
	}
}

function printOutput(output, speed) {
	outputTxt = output;
	$('#output').append('<div></div>');
	lastDiv = $('#output').children().last();
	outputInterval = setInterval(scrollPrint, speed);
}

function scrollPrint() {
	if(outputTxt)
	{
		var curOutput = lastDiv.text();
		lastDiv.html(curOutput + outputTxt[0]);
		outputTxt = outputTxt.slice(1);
	}
	else {
		$('#prompt').html('> ');
		clearInterval(outputInterval);
		cursorBlinkTimer = setInterval(cursorBlink, 500);
		commandExecuting = false;
	}
}
