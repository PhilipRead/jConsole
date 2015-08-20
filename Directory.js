function Directory(name, parent) {
	this.name = name;
	this.parent = parent;
	this.getPath = function() {
		if(this.parent instanceof RootFolder) {
			return(this.name);
		}
		else {
			return(this.parent.getPath() + '/' + this.name);
		}
	};
	return this;
};

function Folder(name, parent, children) {
	this.name = name;
	this.parent = parent;
	this.children = children;
	this.addChild = function(newChild) {
		if($.inArray(newChild, this.children) == -1) { //Doesn't exist
			if(this.children.length == 0) {
				this.children.push(newChild);
			}
			else {
				var newChildUpped = newChild.toUpperCase();
				var newIndex = insertChildIndex(newChild.toUpperCase(), this.children, 0, this.children.length - 1);
				this.children.splice(newIndex, 0, newChild);
			}
		}
	};
	return this;
};

Folder.prototype = new Directory();

function RootFolder(children) {
	this.name = null;
	this.parent = null;
	this.children = children;
	this.getPath = function() {
		return('');
	}
}

RootFolder.prototype = new Folder();

function File(name, data) {
	this.name = name;
	this.data = data;
	return this;
};

File.prototype = new Directory();

Directory.insertChildIndex = function(newChildUpped, childArr, minIndex, maxIndex) {
	var middleIndex = minIndex + Math.floor((maxIndex  - minIndex)/2);
	
	if(newChildUpped > childArr[maxIndex].toUpperCase()) {
		return (maxIndex + 1);
	}
	else if(newChildUpped < childArr[minIndex].toUpperCase()) {
		return (minIndex);
	}
	
	var middleChildUpped = childArr[middleIndex].toUpperCase();
	if(newChildUpped < middleChildUpped) {
		Directory.insertChildIndex(newChildUpped, childArr, minIndex, middleIndex - 1);
	}
	else if(newChildUpped > middleChildUpped) {
		Directory.insertChildIndex(newChildUpped, childArr, middleIndex + 1, maxIndex);
	}
	else { //equal but different capitalization
		return (middleIndex + 1);
	}
}