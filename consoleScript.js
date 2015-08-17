$(document).ready(function() {
	setCursorVals($('#input').text().length, 0);
	cursorBlinkTimer = setInterval(cursorBlink, 500);
	$('#commandLine').mousedown(mousedownConsole);
});

var fontWidth = 8;
var inputOffset = 24;

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

var commandExecuting = false;
var capsOn = false;
var commandHistory = [];
var historyIndex = -1;

$(document).keydown(function(event) {
	if(commandExecuting) {
		return;
	}
	
	clearInterval(cursorBlinkTimer);
	if($('#cursor').text().length == 0){
		$('#cursor').html('|');
	}
	var keyCode = event.keyCode;
	
	if(keyCode == Keys.keyCode.LEFT_ARROW) {
		if(cursorPosition > 0) {
			setCursorVals(cursorPosition - 1, cursorMargin + 1 );
		}
	}
	else if(keyCode == Keys.keyCode.RIGHT_ARROW) {
		if(cursorPosition < $('#input').text().length) {
			setCursorVals(cursorPosition + 1, cursorMargin - 1 );
		}
	}
	else if(keyCode == Keys.keyCode.UP_ARROW) {
		if(
		historyIndex > 0) {
			var newInput = commandHistory[--historyIndex];
			$('#input').html(newInput);
			setCursorVals(newInput.length, 0);
		}
	}
	else if(keyCode == Keys.keyCode.DOWN_ARROW) {
		if(historyIndex < commandHistory.length - 1) {
			var newInput = commandHistory[++historyIndex];
			$('#input').html(newInput);
			setCursorVals(newInput.length, 0);
		}
	}
	else if(keyCode == Keys.keyCode.HOME) { 
		setCursorVals(0, $('#input').text().length);
	}
	else if(keyCode == Keys.keyCode.END) { 
		setCursorVals($('#input').text().length, 0);
	}
	else if(keyCode == Keys.keyCode.CAPS_LOCK) {
		capsOn = !capsOn;
	}
	else if(keyCode >= Keys.keyCode.KEY_A && keyCode <= Keys.keyCode.KEY_Z) {
		var newChar;
		if(event.ctrlKey) {
			// So the user can copy
			return;
		}
		else if(event.shiftKey) {
			if(capsOn) {
				newChar = String.fromCharCode(keyCode + 32);
			}
			else {
				newChar = String.fromCharCode(keyCode);
			}
		}
		else //shift and/or ctrl key not down
		{
			if(capsOn) {
				newChar = String.fromCharCode(keyCode);
			}
			else {
				newChar = String.fromCharCode(keyCode + 32);
			}
		}
		appendNewChar(newChar);
	}
	else if(keyCode == Keys.keyCode.SPACE) {
		appendNewChar('&nbsp');
	}
	else if(keyCode == Keys.keyCode.BACKSPACE) { 
		//Deletes highlighted text, else if not highlighted backspaces once
		if(deleteSelected() == false) { 
			if(cursorPosition > 0) {
				deleteInput(cursorPosition - 1, cursorPosition);
			}
		}
	}
	else if(keyCode == Keys.keyCode.DELETE) {
		deleteSelected();
	}
	else if(keyCode >= Keys.keyCode.KEY_0 && keyCode <= Keys.keyCode.KEY_9) { 
		var newChar;
		if(event.shiftKey) {
			newChar = shiftNumChar(keyCode);
		}
		else { //shift key not down
			newChar = String.fromCharCode(keyCode);
		}
		appendNewChar(newChar);
	}
	else if(keyCode >= Keys.keyCode.NUMPAD_0 && keyCode <= Keys.keyCode.NUMPAD_9) { 
		var newChar = String.fromCharCode(keyCode - 48);
		appendNewChar(newChar);
	}
	else if(keyCode == Keys.keyCode.ENTER) {
		commandExecuting = true;
		var curInput = $('#input').text();
		addToHistory(curInput);
		$('#prompt').html('');
		$('#input').html('');
		$('#cursor').html('');
		$('#output').append('<div>> ' + curInput + '</div>');
		printOutput('Nice. You printed. You printed. Nice.', 20);
		setCursorVals(0,0);
	}
	else {
		return;
	}
	
	event.preventDefault();
});

$(document).keyup(function(event) {
	if(!commandExecuting) {
		clearInterval(cursorBlinkTimer);
		cursorBlinkTimer = setInterval(cursorBlink, 500);
	}
});

var cursorPosition;
var cursorMargin;

function setCursorVals(prefixLen, suffixLen) {
	cursorPosition = prefixLen;
	cursorMargin = suffixLen;
	$('#cursor').css('margin-left', '-' + String(cursorMargin) + '.5ch');
}

var cursorBlinkTimer;

function cursorBlink() {
	cursorBody = $('#cursor').text();
	if(cursorBody.length > 0) {
		$('#cursor').html('');
	}
	else {
		$('#cursor').html('|');
	}
}

function shiftNumChar(keyCode) {
	var charCode;
	switch(keyCode) {
		case Keys.keyCode.KEY_0: // )
			charCode = 41; 
			break;
		case Keys.keyCode.KEY_1: // !
			charCode = 33;
			break;
		case Keys.keyCode.KEY_2: // @
			charCode = 64;
			break;
		case Keys.keyCode.KEY_3: // #
			charCode = 35;
			break;
		case Keys.keyCode.KEY_4: // $
			charCode = 36;
			break;
		case Keys.keyCode.KEY_5: // %
			charCode = 37;
			break;
		case Keys.keyCode.KEY_6: // ^
			charCode = 94;
			break;
		case Keys.keyCode.KEY_7: // &
			charCode = 38;
			break;
		case Keys.keyCode.KEY_8: // *
			charCode = 42;
			break;
		case Keys.keyCode.KEY_9: // (
			charCode = 40;
			break;
	}
	return String.fromCharCode(charCode);
}

function appendNewChar(newChar) {
	var curInput = $('#input').text();
	var prefixStr = curInput.substring(0, cursorPosition);
	var suffixStr = curInput.substring(cursorPosition, curInput.length);
	$('#input').html(prefixStr + newChar + suffixStr);
	++cursorPosition;
}

function deleteInput(leftIndex, rightIndex) {
	var curInput = $('#input').text();
	var prefix = curInput.slice(0,leftIndex);
	var suffix = curInput.slice(rightIndex, curInput.length);
	var newInput =  prefix + suffix;
	$('#input').html(newInput);
	setCursorVals(prefix.length, suffix.length);
}

function deleteSelected() {
	var selected = window.getSelection();
	var inputNode = $('#input').contents()[0];
	if(selected.anchorNode == selected.focusNode //Highlighted text does not span multiple elements
	&& selected.anchorNode == inputNode) { //Input text has been highlighted
		var anchorOffset = selected.anchorOffset;
		var focusOffset = selected.focusOffset;
		if(anchorOffset != focusOffset) { //Text is actually highlighted
			var leftIndex, rightIndex;
			if(anchorOffset > focusOffset) {
				leftIndex = focusOffset;
				rightIndex = anchorOffset;
			}
			else {
				leftIndex = anchorOffset;
				rightIndex = focusOffset;
			}
			deleteInput(leftIndex, rightIndex);
			return true;
		}
	}
	return false;
}

function addToHistory(rawCommand) {
	var command = rawCommand.trim();
	if(command.length > 0 
	&& command != commandHistory[commandHistory.length - 1]) {
		commandHistory.push(command);
	}
	historyIndex = commandHistory.length;
}

function printOutput(output, speed) {
	outputTxt = output;
	$('#output').append('<div></div>');
	lastDiv = $('#output').children().last();
	outputInterval = setInterval(scrollPrint, speed);
}

var outputInterval;
var outputTxt;
var lastDiv;

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
