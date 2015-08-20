$(document).ready(function() {
	VisualUtils.setCursorVals($('#input').text().length, 0);
	cursorBlinkTimer = setInterval(VisualUtils.cursorBlink, 500);
	$('#commandLine').mousedown(MouseUtils.mousedownConsole);
	VisualUtils.setCurrentFolder(new RootFolder([]));
	userSystem = new System('userSystem', curFolder);
});

$(document).keydown(KeyUtils.keyDownHandler);
$(document).keyup(KeyUtils.keyUpHandler);
