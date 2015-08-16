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
	
	if(keyCode == App.keyCode.LEFT_ARROW) {
		if(cursorPosition > 0) {
			setCursorVals(cursorPosition - 1, cursorMargin + 1 );
		}
	}
	else if(keyCode == App.keyCode.RIGHT_ARROW) {
		if(cursorPosition < $('#input').text().length) {
			setCursorVals(cursorPosition + 1, cursorMargin - 1 );
		}
	}
	else if(keyCode == App.keyCode.UP_ARROW) {
		if(
		historyIndex > 0) {
			var newInput = commandHistory[--historyIndex];
			$('#input').html(newInput);
			setCursorVals(newInput.length, 0);
		}
	}
	else if(keyCode == App.keyCode.DOWN_ARROW) {
		if(historyIndex < commandHistory.length - 1) {
			var newInput = commandHistory[++historyIndex];
			$('#input').html(newInput);
			setCursorVals(newInput.length, 0);
		}
	}
	else if(keyCode == App.keyCode.HOME) { 
		setCursorVals(0, $('#input').text().length);
	}
	else if(keyCode == App.keyCode.END) { 
		setCursorVals($('#input').text().length, 0);
	}
	else if(keyCode == App.keyCode.CAPS_LOCK) {
		capsOn = !capsOn;
	}
	else if(keyCode >= App.keyCode.KEY_A && keyCode <= App.keyCode.KEY_Z) {
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
	else if(keyCode == App.keyCode.SPACE) {
		appendNewChar('&nbsp');
	}
	else if(keyCode == App.keyCode.BACKSPACE) { 
		//Deletes highlighted text, else if not highlighted backspaces once
		if(deleteSelected() == false) { 
			if(cursorPosition > 0) {
				deleteInput(cursorPosition - 1, cursorPosition);
			}
		}
	}
	else if(keyCode == App.keyCode.DELETE) {
		deleteSelected();
	}
	else if(keyCode >= App.keyCode.KEY_0 && keyCode <= App.keyCode.KEY_9) { 
		var newChar;
		if(event.shiftKey) {
			newChar = shiftNumChar(keyCode);
		}
		else { //shift key not down
			newChar = String.fromCharCode(keyCode);
		}
		appendNewChar(newChar);
	}
	else if(keyCode >= App.keyCode.NUMPAD_0 && keyCode <= App.keyCode.NUMPAD_9) { 
		var newChar = String.fromCharCode(keyCode - 48);
		appendNewChar(newChar);
	}
	else if(keyCode == App.keyCode.ENTER) {
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
		case App.keyCode.KEY_0: // )
			charCode = 41; 
			break;
		case App.keyCode.KEY_1: // !
			charCode = 33;
			break;
		case App.keyCode.KEY_2: // @
			charCode = 64;
			break;
		case App.keyCode.KEY_3: // #
			charCode = 35;
			break;
		case App.keyCode.KEY_4: // $
			charCode = 36;
			break;
		case App.keyCode.KEY_5: // %
			charCode = 37;
			break;
		case App.keyCode.KEY_6: // ^
			charCode = 94;
			break;
		case App.keyCode.KEY_7: // &
			charCode = 38;
			break;
		case App.keyCode.KEY_8: // *
			charCode = 42;
			break;
		case App.keyCode.KEY_9: // (
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

function 
var App = {}

App.keyCode = {
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	PAUSE: 19,
	CAPS_LOCK: 20,
	ESCAPE: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	LEFT_ARROW: 37,
	UP_ARROW: 38,
	RIGHT_ARROW: 39,
	DOWN_ARROW: 40,
	INSERT: 45,
	DELETE: 46,
	KEY_0: 48,
	KEY_1: 49,
	KEY_2: 50,
	KEY_3: 51,
	KEY_4: 52,
	KEY_5: 53,
	KEY_6: 54,
	KEY_7: 55,
	KEY_8: 56,
	KEY_9: 57,
	KEY_A: 65,
	KEY_B: 66,
	KEY_C: 67,
	KEY_D: 68,
	KEY_E: 69,
	KEY_F: 70,
	KEY_G: 71,
	KEY_H: 72,
	KEY_I: 73,
	KEY_J: 74,
	KEY_K: 75,
	KEY_L: 76,
	KEY_M: 77,
	KEY_N: 78,
	KEY_O: 79,
	KEY_P: 80,
	KEY_Q: 81,
	KEY_R: 82,
	KEY_S: 83,
	KEY_T: 84,
	KEY_U: 85,
	KEY_V: 86,
	KEY_W: 87,
	KEY_X: 88,
	KEY_Y: 89,
	KEY_Z: 90,
	LEFT_META: 91,
	RIGHT_META: 92,
	SELECT: 93,
	NUMPAD_0: 96,
	NUMPAD_1: 97,
	NUMPAD_2: 98,
	NUMPAD_3: 99,
	NUMPAD_4: 100,
	NUMPAD_5: 101,
	NUMPAD_6: 102,
	NUMPAD_7: 103,
	NUMPAD_8: 104,
	NUMPAD_9: 105,
	MULTIPLY: 106,
	ADD: 107,
	SUBTRACT: 109,
	DECIMAL: 110,
	DIVIDE: 111,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	NUM_LOCK: 144,
	SCROLL_LOCK: 145,
	SEMICOLON: 186,
	EQUALS: 187,
	COMMA: 188,
	DASH: 189,
	PERIOD: 190,
	FORWARD_SLASH: 191,
	GRAVE_ACCENT: 192,
	OPEN_BRACKET: 219,
	BACK_SLASH: 220,
	CLOSE_BRACKET: 221,
	SINGLE_QUOTE: 222
};
