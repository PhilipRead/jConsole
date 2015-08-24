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
		newChild.parent = this;
		if(this.children.length == 0) {
			this.children.push(newChild);
		}
		else {
			var newIndex = Directory.insertChildIndex(newChild.name, this.children, 0, this.children.length - 1);
			if(newIndex != null) {
				this.children.splice(newIndex, 0, newChild);
			}
			else {
				// Folder already exists. Inform user.
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

Directory.insertChildIndex = function(newChildName, childArr, minIndex, maxIndex) {
	var middleIndex = minIndex + Math.floor((maxIndex  - minIndex)/2);
	
	if(newChildName > childArr[maxIndex].name) {
		return (maxIndex + 1);
	}
	else if(newChildName < childArr[minIndex].name) {
		return (minIndex);
	}
	
	var middleChildName = childArr[middleIndex].name;
	if(newChildName < middleChildName) {
		return Directory.insertChildIndex(newChildName, childArr, minIndex, middleIndex - 1);
	}
	else if(newChildName > middleChildName) {
		return Directory.insertChildIndex(newChildName, childArr, middleIndex + 1, maxIndex);
	}
	else { //Equal
		return null;
	}
}