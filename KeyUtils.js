commandExecuting = false;
capsOn = false;
commandHistory = [];
historyIndex = -1;

KeyUtils.keyDownHandler = function(event) {
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
			VisualUtils.setCursorVals(cursorPosition - 1, cursorMargin + 1 );
		}
	}
	else if(keyCode == Keys.keyCode.RIGHT_ARROW) {
		if(cursorPosition < $('#input').text().length) {
			VisualUtils.setCursorVals(cursorPosition + 1, cursorMargin - 1 );
		}
	}
	else if(keyCode == Keys.keyCode.UP_ARROW) {
		if(
		historyIndex > 0) {
			var newInput = commandHistory[--historyIndex];
			$('#input').html(newInput);
			VisualUtils.setCursorVals(newInput.length, 0);
		}
	}
	else if(keyCode == Keys.keyCode.DOWN_ARROW) {
		if(historyIndex < commandHistory.length - 1) {
			var newInput = commandHistory[++historyIndex];
			$('#input').html(newInput);
			VisualUtils.setCursorVals(newInput.length, 0);
		}
	}
	else if(keyCode == Keys.keyCode.HOME) { 
		VisualUtils.setCursorVals(0, $('#input').text().length);
	}
	else if(keyCode == Keys.keyCode.END) { 
		VisualUtils.setCursorVals($('#input').text().length, 0);
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
		else { //shift and/or ctrl key not down
			if(capsOn) {
				newChar = String.fromCharCode(keyCode);
			}
			else {
				newChar = String.fromCharCode(keyCode + 32);
			}
		}
		KeyUtils.appendNewChar(newChar);
	}
	else if(keyCode == Keys.keyCode.SPACE) {
		KeyUtils.appendNewChar('&nbsp');
	}
	else if(keyCode == Keys.keyCode.BACKSPACE) { 
		//Deletes highlighted text, else if not highlighted backspaces once
		if(KeyUtils.deleteSelected() == false) { 
			if(cursorPosition > 0) {
				KeyUtils.deleteInput(cursorPosition - 1, cursorPosition);
			}
		}
	}
	else if(keyCode == Keys.keyCode.DELETE) {
		KeyUtils.deleteSelected();
	}
	else if(keyCode >= Keys.keyCode.KEY_0 && keyCode <= Keys.keyCode.KEY_9) { 
		var newChar;
		if(event.shiftKey) {
			newChar = KeyUtils.shiftNumChar(keyCode);
		}
		else { //shift key not down
			newChar = String.fromCharCode(keyCode);
		}
		KeyUtils.appendNewChar(newChar);
	}
	else if(keyCode >= Keys.keyCode.NUMPAD_0 && keyCode <= Keys.keyCode.NUMPAD_9) { 
		var newChar = String.fromCharCode(keyCode - 48);
		KeyUtils.appendNewChar(newChar);
	}
	else if(keyCode == Keys.keyCode.ENTER) {
		commandExecuting = true;
		var curInput = $('#input').text();
		KeyUtils.addToHistory(curInput);
		var curPrompt = $('#prompt').text();
		$('#prompt').html('');
		$('#input').html('');
		$('#cursor').html('');
		$('#output').append('<div>' + curPrompt + curInput + '</div>');
		Commands.execute(curInput);
		VisualUtils.setCursorVals(0,0);
	}
	else { 
		var newChar;
		if(event.shiftKey) {
			newChar = KeyUtils.miscKeyCharShifted(keyCode);
		}
		else {
			newChar = KeyUtils.miscKeyChar(keyCode);
		}
		
		if(newChar) {
			KeyUtils.appendNewChar(newChar);
		}
		else {
			return;
		}
	}
	
	event.preventDefault();
};

KeyUtils.keyUpHandler = function(event) {
	if(!commandExecuting) {
		clearInterval(cursorBlinkTimer);
		cursorBlinkTimer = setInterval(VisualUtils.cursorBlink, 500);
	}
};

KeyUtils.shiftNumChar = function(keyCode) {
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
};

KeyUtils.appendNewChar = function(newChar) {
	KeyUtils.deleteSelected();
	var curInput = $('#input').text();
	var prefixStr = curInput.substring(0, cursorPosition);
	var suffixStr = curInput.substring(cursorPosition, curInput.length);
	$('#input').html(prefixStr + newChar + suffixStr);
	++cursorPosition;
};

KeyUtils.deleteInput = function(leftIndex, rightIndex) {
	var curInput = $('#input').text();
	var prefix = curInput.slice(0,leftIndex);
	var suffix = curInput.slice(rightIndex, curInput.length);
	var newInput =  prefix + suffix;
	$('#input').html(newInput);
	VisualUtils.setCursorVals(prefix.length, suffix.length);
};

KeyUtils.deleteSelected = function() {
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
			KeyUtils.deleteInput(leftIndex, rightIndex);
			return true;
		}
	}
	return false;
};

KeyUtils.addToHistory = function(rawCommand) {
	var command = rawCommand.trim();
	if(command.length > 0 
	&& command != commandHistory[commandHistory.length - 1]) {
		commandHistory.push(command);
	}
	historyIndex = commandHistory.length;
};

KeyUtils.miscKeyChar = function(keyCode) {
	var charCode
	switch(keyCode) {
		case Keys.keyCode.GRAVE_ACCENT: 
			charCode = 96;
			break;
		case Keys.keyCode.DASH: 
		case Keys.keyCode.SUBTRACT: 
			charCode = 45;
			break;
		case Keys.keyCode.EQUALS: 
			charCode = 61;
			break;
		case Keys.keyCode.OPEN_BRACKET: 
			charCode = 91;
			break;
		case Keys.keyCode.CLOSE_BRACKET: 
			charCode = 93;
			break;
		case Keys.keyCode.BACK_SLASH: 
			charCode = 92;
			break;
		case Keys.keyCode.SEMICOLON: 
			charCode = 59;
			break;
		case Keys.keyCode.SINGLE_QUOTE: 
			charCode = 39;
			break;
		case Keys.keyCode.COMMA: 
			charCode = 44;
			break;
		case Keys.keyCode.PERIOD: 
		case Keys.keyCode.DECIMAL: 
			charCode = 46;
			break;
		case Keys.keyCode.FORWARD_SLASH: 
		case Keys.keyCode.DIVIDE: 
			charCode = 47;
			break;
		case Keys.keyCode.MULTIPLY: 
			charCode = 42;
			break;
		case Keys.keyCode.ADD: 
			charCode = 43;
			break;
		default:
			return null;
	}
	return String.fromCharCode(charCode);
}

KeyUtils.miscKeyCharShifted = function(keyCode) {
	var charCode
	switch(keyCode) {
		case Keys.keyCode.GRAVE_ACCENT: // ~
			charCode = 126;
			break;
		case Keys.keyCode.DASH: // _
			charCode = 95;
			break;
		case Keys.keyCode.EQUALS: // + 
		case Keys.keyCode.ADD: 
			charCode = 43;
			break;
		case Keys.keyCode.OPEN_BRACKET: // { 
			charCode = 123;
			break;
		case Keys.keyCode.CLOSE_BRACKET: // }
			charCode = 125;
			break;
		case Keys.keyCode.BACK_SLASH: // |
			charCode = 124;
			break;
		case Keys.keyCode.SEMICOLON:  // :
			charCode = 58;
			break;
		case Keys.keyCode.SINGLE_QUOTE: // "
			charCode = 34;
			break;
		case Keys.keyCode.COMMA: // <
			charCode = 60;
			break;
		case Keys.keyCode.PERIOD: // >
			charCode = 62;
			break;
		case Keys.keyCode.FORWARD_SLASH: // ? 
			charCode = 63;
			break;
		case Keys.keyCode.MULTIPLY: 
			charCode = 42;
			break;
		case Keys.keyCode.DIVIDE: 
			charCode = 47;
			break;
		case Keys.keyCode.SUBTRACT: 
			charCode = 45;
			break;
		default:
			return null;
	}
	return String.fromCharCode(charCode);
}