fontWidth = 8;
inputOffset = 24;

MouseUtils.mousedownConsole = function(event) {
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
};