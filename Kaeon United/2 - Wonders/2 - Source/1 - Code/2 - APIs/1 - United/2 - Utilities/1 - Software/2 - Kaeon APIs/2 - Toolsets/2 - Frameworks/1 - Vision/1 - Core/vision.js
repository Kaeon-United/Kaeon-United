var scriptEngine = null;
var selectorRules = { };

function load() {

	load.cache = load.cache != null ? load.cache : [];
	
	for(let i = 0; i < arguments.length; i++) {

		if(!Array.isArray(arguments[i]))
			arguments[i] = [arguments[i]];

		for(let j = 0; j < arguments[i].length; j++) {

			if(load.cache.includes(arguments[i][j]))
				continue;
			
			load.cache.push(arguments[i][j]);

			if(arguments[i][j].endsWith(".js"))
				loadScript(arguments[i][j]);

			if(arguments[i][j].endsWith(".css"))
				loadStyle(arguments[i][j]);
		}
	}
}

function loadStyle(path) {
	
	let link = document.createElement("link");

	link.setAttribute("rel", "stylesheet");
	link.setAttribute("type", "text/css");
	link.setAttribute("href", path);

	document.head.appendChild(link);
}

function loadScript(path) {

	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", path, false);

	var allText = "";

	rawFile.onreadystatechange = function() {

		if(rawFile.readyState === 4) {

			if(rawFile.status === 200 || rawFile.status == 0) {
				allText = rawFile.responseText;
			}
		}
	}

	rawFile.send(null);

	inject("script", allText);
}

function inject(type, content) {
	
	let injection = document.createElement(type);
	injection.text = content;
	
	document.head.appendChild(injection).parentNode.removeChild(injection);
}

function setStyle(element, styles) {

	let keys = Object.keys(styles);

	for(let i = 0; i < keys.length; i++) {
	
		let style = keys[i];
		let value = styles[keys[i]];
	
		let result =
			element.style.cssText.match(
				new RegExp(
					"(?:[;\\s]|^)(" +
					style.replace("-", "\\-") +
					"\\s*:(.*?)(;|$))"
				)
			),
			index;
		
		if (result) {
		
			index = result.index + result[0].indexOf(result[1]);
			
			element.style.cssText =
				element.style.cssText.substring(0, index) +
				style + ": " + value + ";" +
				element.style.cssText.substring(index + result[1].length);
		}
		
		else
			element.style.cssText += " " + style + ": " + value + ";";
	}
		
	return element;
}

function create(object) {

	if(typeof object == "string")
		object = toElement(object);

	return set(document.createElement("div"), object);
}

function set(element, object) {

	object = object != null ? object : { };
	
	if(object.tag != null && object.tag != element.tagName)
		element = document.createElement(object.tag);

	if(object.attributes != null) {

		let attributeKeys = Object.keys(object.attributes);

		for(let i = 0; i < attributeKeys.length; i++) {

			element.setAttribute(
				attributeKeys[i],
				object.attributes[attributeKeys[i]]
			);
		}
	}

	if(object.style != null)
		setStyle(element, object.style);

	if(object.fields != null)
		Object.assign(element, object.fields);

	if(object.content != null) {

		object.content =
			Array.isArray(object.content) ?
				object.content :
				[object.content];

		element.innerHTML = "";

		for(let i = 0; i < object.content.length; i++) {

			if(object.content[i].nodeName != null)
				element.appendChild(object.content[i]);

			else if(typeof object.content[i] == "object")
				element.appendChild(create(object.content[i]));

			else {

				element.appendChild(
					document.createTextNode("" + object.content[i])
				);
			}
		}
	}

	return element;
}

function get(element) {

	if(typeof element == "string")
		return Array.from(document.querySelectorAll(element));

	let object = {
		tag: element.tagName
	}

	if(element.attributes.length > 0) {

		object.attributes = { };
		
		for(let i = 0; i < element.attributes.length; i++) {
			
			object.attributes[element.attributes[i].name] =
				element.attributes[i].value;
		}
	}

	let keys = Object.keys(element.style);

	let style = { };
	
	for(let i = 0; i < keys.length; i++) {

		if(element.style[keys[i]] != null && element.style[keys[i]] != "")
			style[keys[i]] = element.style[keys[i]];
	}

	if(Object.keys(style) > 0)
		object.style = style;

	if(element.childNodes.length > 0) {

		object.content = [];
		
		for(let i = 0; i < element.childNodes.length; i++) {

			if(element.childNodes[i].nodeName == "#text")
				object.content.push(element.childNodes[i].textContent);

			else if(element.childNodes[i].tagName != null)
				object.content.push(get(element.childNodes[i]));
		}
	}

	return object;
}

function extend(element) {

	let children = [];
	let index = arguments.length == 1 ? 0 : 1;

	for(let i = index; i < arguments.length; i++) {

		children = children.concat(
			Array.isArray(arguments[i]) ?
				arguments[i] :
				[arguments[i]]
		);
	}

	if(arguments.length == 1) {

		if(document.body != null)
			document.body.style.position = "absolute";

		element = document.documentElement;
	}

	for(let i = 0; i < children.length; i++) {

		if(children[i].ENTITY_NODE != null)
			element.appendChild(children[i]);

		else
		 	element.appendChild(create(children[i]));
	}

	return element;
}

function remove() {

	Array.from(arguments).forEach((element) => {

		if(typeof element == "string")
			document.querySelectorAll(element).forEach((item) => {remove(item);});
	
		else if(Array.isArray(element))
			element.forEach((item) => { remove(item); });
	
		else if(element.parentNode != null)
			element.parentNode.removeChild(element);
	
		else
			element.innerHTML = "";
	});
}

function toHTML(object) {
	return create(object).outerHTML;
}

function toElement(string) {

	let element = document.createElement("div");
	element.innerHTML = string;

	return get(element.childNodes[0]);
}

function toCSS(object) {

	let css = "";

	let keys = Object.keys(object);

	for(let i = 0; i < keys.length; i++) {

		css += keys[i] + "{";

		let styleKeys = Object.keys(object[keys[i]]);

		for(let j = 0; j < styleKeys.length; j++)
			css += styleKeys[j] + ":" + object[keys[i]][styleKeys[j]] + ";";

		css += "}";
	}

	return css;
}

function toStyle(string) {

	// STUB

	return { };
}

function isVisible(element) {

	return !!(
		element.offsetWidth ||
		element.offsetHeight ||
		element.getClientRects().length
	);
}

function startScriptEngine() {

	stopScriptEngine();

	scriptEngine = setInterval(
		() => {

			document.querySelectorAll("*").forEach((element) => {

				if(!element.scriptEngineInitialized) {

					if(element.onStart != null)
						element.onStart(element);

					element.scriptEngineInitialized = true;
				}

				if(element.onUpdate != null)
					element.onUpdate(element);
			});

			Object.keys(selectorRules).forEach((key) => {

				document.querySelectorAll(key).forEach((element) => {

					if(!element.selectorRuleInitialized) {
	
						set(element, selectorRules[key]);
	
						element.selectorRuleInitialized = true;
					}
				});
			});
		},
		1000 / 60
	)
}

function stopScriptEngine() {

	if(scriptEngine == null)
		return;

	clearInterval(scriptEngine);

	scriptEngine = null;
}

function setFavicon(src) {

	get("link[rel=\"shortcut icon\"]").forEach(remove);

	let link = create({
		tag: "link",
		attributes: {
			rel: "shortcut icon",
			href: "" + src
		}
	});

	document.head.appendChild(link);
}

module.exports = {
	selectorRules,
	load,
	loadStyle,
	loadScript,
	inject,
	create,
	set,
	get,
	extend,
	remove,
	toHTML,
	toElement,
	toCSS,
	toStyle,
	isVisible,
	startScriptEngine,
	stopScriptEngine,
	setFavicon
};