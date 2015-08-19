function Directory(name) {
	this.name = name;
	return this;
};

function Folder(name, children) {
	this.name = name;
	this.children = children;
	return this;
};

Folder.prototype = new Directory();

function RootFolder(children) {
	this.children = children;
}

function File(name, data) {
	this.name = name;
	this.data = data;
	return this;
};

File.prototype = new Directory();