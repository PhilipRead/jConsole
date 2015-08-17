$(document).ready(function() {
	setCursorVals($('#input').text().length, 0);
	cursorBlinkTimer = setInterval(cursorBlink, 500);
	$('#commandLine').mousedown(mousedownConsole);
});

fontWidth = 8;
inputOffset = 24;

function mousedownConsole(event) {
	var xPos = event.clientX;
	var inputPixelLen = $('#input').width();
	var leftBound = inputOffset + fontWidth/2;
	var rightBound = leftBound + inputPixelLen - fontWidth;
	var inputLen = $('#input').text().length;
	
	if(xPos <= leftBound) { // Extreme Left
		setCursorVals(0, inputLen);
	}
	else if(xPos >= rightBound) { //Extreme Right
		setCursorVals(inputLen, 0);
	}
	else //in the middle
	{
		var innerOffset = xPos - leftBound;
		var prefixLen = Math.ceil(innerOffset/fontWidth);
		var suffixLen = inputLen - prefixLen;
		setCursorVals(prefixLen, suffixLen);
	}
}

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
