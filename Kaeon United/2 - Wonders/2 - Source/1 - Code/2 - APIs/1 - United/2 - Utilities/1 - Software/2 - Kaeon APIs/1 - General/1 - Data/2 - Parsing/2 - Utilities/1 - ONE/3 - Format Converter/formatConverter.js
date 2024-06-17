var one = require("kaeon-united")("one");
var onePlus = require("kaeon-united")("onePlus");

function dynamicListToJSON(data, child) {

	if(typeof data == "object") {

		if(data.dynamicAliases != null) {
			
			let object = data;
	
			let data = { };
	
			Object.values(object).forEach((value, index) => {
	
				let alias = index < object.dynamicAliases.length ?
					(object.dynamicAliases[index] != null ?
						"" + object.dynamicAliases[index] :
						"" + index) :
					"" + index;
				
				data[alias] = dynamicListToJSON(value, true);
			});
		}

		else {

			data.forEach((value, index) => {
				data[index] = dynamicListToJSON(value, true);
			});
		}
	}

	return child ? data : JSON.stringify(data);
}

function getContent(content) {

	return content.startsWith("\"") &&
		content.endsWith("\"") &&
		!content.endsWith("\\\"") ?
			content.substring(1, content.length - 1) :
			content;
}

function getObject(element) {

	let content = element.content.toLowerCase().trim();

	if(content == "object") {

		let object = {};

		for(let i = 0; i < element.children.length; i++) {

			if(element.children[i].children.length == 0)
				object[getContent(element.children[i].content)] = null;

			else {

				object[getContent(element.children[i].content)] =
					getObject(element.children[i].children[0]);
			}
		}

		return object;
	}

	if(content == "list" || element.parent == null) {

		let list = [];

		for(let i = 0; i < element.children.length; i++)
			list.push(getObject(element.children[i]));

		if(element.parent == null && list.length == 1)
			return list[0];

		else if(element.parent == null && list.length == 0)
			return null;

		return list;
	}

	if(content == "true")
		return true;

	if(content == "false")
		return false;

	if(!isNaN(content))
		return Number(content);
		
	return getContent(element.content);
}

function jsonToDynamicList(data, child) {

	if(!child)
		data = JSON.parse(json);

	if(typeof data == "object") {

		let keys = Object.keys(data);

		data = Object.values(data);
		data.dynamicAliases = [];
	
		keys.forEach((key, index) => {
			data.dynamicAliases[index] = key;
		});
	}

	if(Array.isArray(data)) {

		data.forEach((value, index) => {
			data[index] = jsonToDynamicList(value, true);
		});
	}

	return data;
}

function jsonToONE(json) {
	
	let root = one.create();

	if(typeof json == "object") {

		if(Array.isArray(json)) {
	
			json.forEach((item) => {

				if(item == null)
					return;

				jsonToONE(item).children.forEach((element) => {
					one.add(root, element);
				});
			});
		}

		else {

			Object.keys(json).forEach((key) => {
	
				let element =
					json[key] != null ? jsonToONE(json[key]) : one.create();

				element.content = key;
	
				one.add(root, element);
			});
		}
	}

	else if(json != null)
		one.add(root, one.create("" + json));

	return root;
}

function oneToJSON(element, map) {

	if(map)
		return JSON.stringify(getObject(onePlus.read(element)));

	if(typeof element == "string")
		element = onePlus.read(element);

	let json = { };

	element.children.forEach((child) => {
		json[child.content] = oneToJSON(child);
	});

	return json;
}

module.exports = {
	dynamicListToJSON,
	jsonToDynamicList,
	jsonToONE,
	oneToJSON
};