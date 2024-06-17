var moduleDependencies = {
	drawdown: "https://raw.githubusercontent.com/adamvleggett/drawdown/master/drawdown.js"
};

var io = require("kaeon-united")("io");
var onePlus = require("kaeon-united")("onePlus");
var wrapONE = require("kaeon-united")("wrapONE");

function escapeMark(element) {

	element.content = element.content.
		split("*").join("\\*").
		split("_").join("\\_");

	element.children.forEach((child) => {
		escapeMark(child);
	});

	return element;
}

function extractLibrary(source, options) {

	return source.children.map((item) => {
		return isKaeonDocument(item) ? item : toONEPlus(item, options);
	});
}

function getType(element) {

	if(element.parent == null)
		return "root";

	let siblings = element.parent.children;

	if(element.parent.parent == null)
		return "title";

	return siblings.filter((item) => {
		return item.children.length > 0
	}).length > 0 ? "section" : "content";
}

function isKaeonDocument(element) {

	let isKaeon = false;

	let structure = "" + element.children.map(item => item.content);

	[
		["Philosophy"],
		["Philosophy", "Principles"],
		["Philosophy", "Wonders"],
		["Philosophy", "Principles", "Wonders"]
	].forEach(item => {

		if("" + item == structure)
			isKaeon = true;
	});

	return isKaeon;
}

function labelONE(element, options, path) {

	options = options != null ? options : { };

	if(Array.isArray(element)) {

		element.forEach((item) => {

			if(typeof item == "object")
				labelONE(item, options);
		});

		return element;
	}

	path = path != null ? path : "";

	let type = getType(element);

	if(path.length > 0 && (type == "title" || type == "section")) {

		element.content = (
			(options.flat ?
				path.substring(path.indexOf(".") + 1) :
				path) +
			" - " +
			element.content
		).split(":  ").join(" ");
	}

	element.children.forEach((item, index) => {
		
		labelONE(
			item,
			options,
			(path +
				(path.length > 0 ? "." : "") +
				(type != "root" ? index + 1 : "")
			).split(" .").join(" ")
		);
	});

	return element;
}

function process(source, options) {

	options = options != null ? options : { };

	if(typeof options.flat == "string") {
		options.flat = true;
		options.reduced = true;
	}

	if(typeof source == "string")
		source = onePlus.read(source);

	let markONE = toMarkONE(
		labelONE(
			source.children.length > 1 ?
				extractLibrary(source) :
				source,
			options
		),
		options
	);

	return options.html ? styleMarkONE(markONE, options) : markONE;
}

function styleMarkONE(markONE, options) {

	return `<style>

	body {
		font-family: Georgia, serif;
		width: 100%;
	}

	h1 {
		font-size: 24pt;
		text-align: center;
	}

	h2 {
		font-size: 22pt;
	}

	h3 {
		font-size: 20pt;
	}

	h4 {
		font-size: 18pt;
	}

	h5 {
		font-size: 16pt;
	}

	h6 {
		font-size: 14pt;
	}` + (options.indent ? `

	p {
		font-size: 12pt;
		margin-left: 36pt;
	}

	p:has(em) {
		margin-left: 0pt;
	}

` : "\n\n") + `</style>
` + toHTML(markONE);
}

function toHTML(source) {

	if(this.markdown == null) {

		eval(io.open(moduleDependencies.drawdown));

		this.markdown = markdown;
	}

	return this.markdown(source);
}

function toMarkONE(element, options, nest) {

	options = options != null ? options : { };

	if(Array.isArray(element)) {

		return element.map((item) => {

			return typeof item == "string" ?
				"_" + item + "_" :
				toMarkONE(item, options);
		}).join("\n\n");
	}

	if(nest == null) {

		wrapONE.unwrapONE(element);

		escapeMark(element);
	}

	nest = nest != null ? nest : 0;
	nest = nest <= 5 ? nest : 5;

	let result = "";
	let type = getType(element);

	if(type == "title" || (!options.flat && type == "section")) {

		let heading = "#";

		for(let i = 0; i < nest; i++)
			heading += "#";

		result += heading + " ";
	}

	if(!(options.flat && nest == 1)) {

		if(options.flat && type == "section")
			result += "**[";
	
		result += options.flat ? (element.content.split("\n\n").join(" **|** ")) : element.content;
	
		if(options.flat && type == "section")
			result += "]**";
	}

	let temp = "\n\n#[ STUB ]#\n\n";

	element.children.forEach((item, index) => {
		
		let child = toMarkONE(item, options, nest + 1);

		if(child != "")
			result += (
				options.flat && type != "title" ?
					(index > 0 && options.flat ?
						temp + "**|**" +  temp :
						temp
					) :
					(nest == 0 && index > 0 && options.flat ?
						"\n\n---\n\n" :
						"\n\n"
					)
			) + child;
	});

	while(result.includes("**|**" + temp + "**["))
		result = result.split("**|**" + temp + "**[").join(temp + "**[");

	while(result.includes(temp + temp))
		result = result.split(temp + temp).join(temp);

	result = result.split(temp).join(" ");

	return result.trim();
}

function toONEPlus(element, options, nest) {

	let result = element.content;

	let escape = [
		",",
		":",
		";",
		"\'",
		"\"",
		"~",
		"{",
		"}",
		"(",
		")",
		"#"
	].map(item => element.content.includes(item)).includes(true);
	
	if(escape) {
	
		result = "\'" +
			element.content.
				split("~").join("~~").
				split("\'").join("~\'") +
			"\'";
	}

	if(element.children.length > 0) {

		result += ": " +
			element.children.map(item => toONEPlus(item, options, true)).join(", ") +
			";";
	}

	while(!nest && result.endsWith(";"))
		result = result.substring(0, result.length - 1);

	return result;
}

module.exports = {
	escapeMark,
	extractLibrary,
	getType,
	isKaeonDocument,
	labelONE,
	process,
	styleMarkONE,
	toHTML,
	toMarkONE,
	toONEPlus
};