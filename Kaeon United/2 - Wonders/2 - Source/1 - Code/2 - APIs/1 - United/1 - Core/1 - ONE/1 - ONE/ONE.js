function add(parent) {

	let child = [];

	for(let i = 1; i < arguments.length; i++) {

		child = child.concat(
			Array.isArray(arguments[i]) ?
				arguments[i] :
				[arguments[i]]
		);
	}

	child.forEach((item) => {

		parent.children.push(item);

		item.parent = parent;
	});

	return parent;
}

function clean(element) {
	
	return {
		content: element.content != null ? element.content : "",
		children: element.children != null ?
			element.children.map((item) => {
				return clean(item);
			}) :
			[]
	};
}

function copy(element) {
	return setValues(JSON.parse(JSON.stringify(clean(element))));
}

function create(content, parent) {

	let children = [];

	for(let i = 2; i < arguments.length; i++) {

		children = children.concat(
			Array.isArray(arguments[i]) ?
				arguments[i] :
				[arguments[i]]
		);
	}

	return setValues({
		content: content != null ? content : "",
		parent: parent,
		children: children
	});
}

function get(element) {

	let path = [];

	for(let i = 1; i < arguments.length; i++) {

		path = path.concat(
			Array.isArray(arguments[i]) ?
				arguments[i] :
				[arguments[i]]
		);
	}

	for(let i = 0; i < path.length - 1; i++) {
		
		if(typeof path[i] == "string") {

			let match = element.children.filter((item) => {
				return item.content.toLowerCase() == path[i].toLowerCase();
			});

			if(match.length == 0)
				return [];

			element = match[0];
		}

		else if(path[i] >= 0 && path[i] < element.children.length)
			element = element.children[path[i]];

		else
			return [];
	}

	let id = path[path.length - 1];
		
	if(typeof id == "string") {

		return element.children.filter((item) => {
			return item.content.toLowerCase() == id.toLowerCase();
		});
	}

	else if(id >= 0 && id < element.children.length)
		return [element.children[id]];

	return [];
}

function getIndex(element) {

	if(element.parent == null)
		return -1;

	return element.parent.children.indexOf(element);
}

function getNest(element) {

	let nest = 0;
	let current = element;

	while(current.parent != null) {

		current = current.parent;

		nest++;
	}

	return nest;
}

function getPath(element) {

	let path = [];

	while(element.parent != null) {
		
		path.push(getIndex(element));

		element = element.parent;
	}
	
	return path;
}

function getRoot(element) {

	while(element.parent != null)
		element = element.parent;
	
	return element;
}

function read(one, tokens, reduced) {
	
	tokens = tokens != null ? tokens : ["-", "\n", "\t"];

	let element = create();
	
	try {
		
		let elements = readElements(one.split(tokens[1]));
		
		let currentElement = element;
		let currentNest = 0;
		
		for(let i = 0; i < elements.length; i++) {
		
			let nest = readCrop(elements[i], tokens[2]);
			
			let newElement = create(readContent(elements[i], tokens[1]));
			
			for(let j = currentNest;
				j > nest - 1 && currentElement.parent != null;
				j--) {
				
				currentElement = currentElement.parent;
			}
			
			if(nest > currentNest && currentElement.children.length > 0) {

				currentElement = currentElement.children[
					currentElement.children.length - 1
				];
			}
			
			add(currentElement, newElement);
			
			currentElement = newElement;
			currentNest = nest;
		}
	}
	
	catch(error) {
		element = create();
	}
	
	return element;
}

function readElements(lines) {
	
	let elements = [];
	
	for(let i = 0; i < lines.length; i++) {
		
		line = lines[i];
		
		element = [];
		element.push(lines[i]);
		
		for(i++;
			i < lines.length &&
				lines[i].replace(/\s+$/g, '') != line.replace(/\s+$/g, '');
			i++) {
			
			element.push(lines[i]);
		}
		
		elements.push(element);
	}
	
	return elements;
}

function readCrop(element, nesting) {
	
	let nest = 0;

	let line = element[0].replace(/\s+$/g, '');
	
	for(let nestIndex = 0;
		line.indexOf(nesting, nestIndex) != -1;
		nestIndex += nesting.length) {
		
		nest++;
	}
		
	element.splice(0, 1);
	
	for(let i = 0; i < element.length; i++)
		element[i] = element[i].substring((nest + 1) * nesting.length);
	
	return nest;
}

function readContent(element, breaking) {
	
	let content = "";
	
	for(let i = 0; i < element.length; i++) {
		
		content += element[i];
		
		if(i < element.length - 1)
			content += breaking;
	}
	
	return content;
}

function setValues(element) {

	element.content = element.content != null ? element.content : "";
	element.parent = element.parent != null ? element.parent : null;
	
	element.children.forEach((item) => {

		item.parent = element;

		setValues(item);
	});

	return element;
}

function toObject(list) {

	if(list.length == 0)
		return create();

	let element = create("" + list[0]);

	for(let i = 1; i < list.length; i++) {
		
		if(Array.isArray(list[i]))
			add(element, toObject(list[i]));
		
		else
			add(element, create("" + list[i]));
	}

	return element;
}

function toList(object) {

	let list = [];
	
	list.push(object.content != null ? object.content : "");
	
	for(let i = 0; i < object.children.length; i++) {
		
		if(object.children[i].children.length == 0)
			list.push(object.children[i].content);
		
		else
			list.push(toList(object.children[i]));
	}
		
	return list;
}

function write(element, tokens, reduced) {

	element = element.parent == null ?
		element :
		{ content: "", children: [copy(element)] };

	tokens = tokens != null ? tokens : ["-", "\n", "\t"];

	try {
	
		let write = element;
		
		if(element.content != "") {
			
			write = create();
			
			add(write, copy(element));
		}
		
		return writeElement(tokens, write, 0, true, reduced);
	}
	
	catch(error) {

		console.log(error.message);

		return "";
	}
}

function writeElement(tokens, element, nest, isRoot, reduced) {

	let code = "";
	
	if(!isRoot) {
		
		let content = element.content;
		
		code +=
			writeIndent(nest, tokens[2]) +
			(!reduced ? tokens[0] : "") +
			tokens[1] +
			writeIndent(nest + 1, tokens[2]);
		
		lines = content.split(tokens[1]);
		
		for(let i = 0; i < lines.length; i++) {
		
			code += lines[i];
			
			if(i < lines.length - 1)
				code += tokens[1] + writeIndent(nest + 1, tokens[2]);
		}
		
		code +=
			tokens[1] +
			writeIndent(nest, tokens[2]) +
			(!reduced ? tokens[0] : "");
	}
	
	let elements = element.children;
	
	for(let i = 0; i < elements.length; i++) {
		
		if(!isRoot || i > 0)
			code += tokens[1];
		
		code += writeElement(
			tokens,
			elements[i],
			(!isRoot ? nest + 1 : nest),
			false,
			reduced
		);
	}
	
	return code;
}

function writeIndent(nest, token) {
	
	let indent = "";
	
	for(let i = 0; i < nest; i++)
		indent += token;
	
	return indent;
}

module.exports = {
	add,
	clean,
	copy,
	create,
	get,
	getIndex,
	getNest,
	getPath,
	getRoot,
	read,
	setValues,
	toList,
	toObject,
	write
};