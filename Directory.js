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

function File(name, data) {
	this.name = name;
	this.data = data;
	return this;
};

File.prototype = new Directory();