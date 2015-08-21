$(document).ready(function() {
	VisualUtils.setCursorVals($('#input').text().length, 0);
	cursorBlinkTimer = setInterval(VisualUtils.cursorBlink, 500);
	$('#commandLine').mousedown(MouseUtils.mousedownConsole);
	curSystem = new System('userSystem', new RootFolder([]));
	VisualUtils.setPrompt();
});

$(document).keydown(KeyUtils.keyDownHandler);
$(document).keyup(KeyUtils.keyUpHandler);
