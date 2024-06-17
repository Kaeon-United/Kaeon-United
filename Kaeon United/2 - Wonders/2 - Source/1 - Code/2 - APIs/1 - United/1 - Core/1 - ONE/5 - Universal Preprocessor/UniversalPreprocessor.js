var kaeonFUSION = require("kaeon-united")("kaeonFUSION");
var onePlus = require("kaeon-united")("onePlus");

var tokenizer = require("kaeon-united")("tokenizer");

function getLangauge(language) {

	if(language == "*") {

		// STUB - AUTO DETECT

		return "kf";
	}

	return language.trim().toLowerCase();
}

function processKaeonFUSIONDirective(args, state, directive, text, index) {

	state.kaeonFUSIONInterpreter =
		state.kaeonFUSIONInterpreter ?
			state.kaeonFUSIONInterpreter :
			new kaeonFUSION.KaeonFUSION();

	var tempArgs = null;
	var tempWrite = console.log;

	if(typeof process !== "undefined") {

		tempArgs = process.argv;

		process.argv = [null, null, text, index, args];
	}

	console.log = function() {

		for(let i = 0; i < arguments.length; i++)
			alpha += (i > 0 ? " " : "") + arguments[i];
	}

	var alpha = text.substring(0, index);
	var beta = text.substring(index);

	try {

		state.kaeonFUSIONInterpreter.process(
			onePlus.read(directive)
		);

		let value = state.kaeonFUSIONInterpreter.returnValue;

		state.kaeonFUSIONInterpreter.returnValue = null;
		
		if(typeof process !== "undefined")
			process.argv = tempArgs;

		console.log = tempWrite;

		if(Array.isArray(value))
			return value;

		return value != null ? "" + value : alpha + beta;
	}

	catch(error) {
		
		if(typeof process !== "undefined")
			process.argv = tempArgs;

		console.log = tempWrite;
		
		return text;
	}
}

function processJavaScriptDirective(args, state, directive, text, index) {

	var tempWrite = console.log;

	console.log = function() {

		for(let i = 0; i < arguments.length; i++)
			alpha += (i > 0 ? " " : "") + arguments[i];
	}

	var alpha = text.substring(0, index);
	var beta = text.substring(index);

	try {

		var value = null;

		eval(
			"let tempFunc=function(text, index, args){" +
			directive +
			"};value=tempFunc(text, index, arguments);"
		);
		
		console.log = tempWrite;

		if(Array.isArray(value))
			return value;
	
		return value != null ? "" + value : alpha + beta;
	}

	catch(error) {
		
		console.log = tempWrite;
	
		return text;
	}
}

function processDirective(args, state, language, directive, text, index) {

	let directiveLanguage = getLangauge(language);

	if(directiveLanguage == "kaeon fusion" || directiveLanguage == "kf")
		return processKaeonFUSIONDirective(args, state, directive, text, index);

	if(directiveLanguage == "javascript" || directiveLanguage == "js")
		return processJavaScriptDirective(args, state, directive, text, index);

	// STUB - ADD OTHER LANGUAGES

	return text;
}

function preprocess(text, args) {

	args = args != null ? args : [];

	text = text.split("\r").join("");

	let tokens = tokenizer.tokenize(["(]", "(>", "[>", "<)"], text);
	let directives = [];

	let newText = "";

	for(let i = 0; i < tokens.length; i++) {

		if(tokens[i] == "(]") {

			directives.push(
				{
					language: tokens[i + 1].trim(),
					content: tokens[i + 3].trim(),
					index: newText.length
				}
			)

			i += 4;
		}

		else if(tokens[i] == "(>") {

			directives.push(
				{
					language: "*",
					content: tokens[i + 1].trim(),
					index: newText.length
				}
			)

			i += 2;
		}

		else
			newText += tokens[i];
	}

	let state = { };
	let indexShift = 0;

	for(let i = 0; i < directives.length; i++) {

		let tempLength = newText.length;

		newText =
			processDirective(
				args,
				state,
				directives[i].language,
				directives[i].content,
				newText,
				directives[i].index + indexShift
			);

		if(Array.isArray(newText))
			return newText;
		
		indexShift += newText.length - tempLength;
	}

	return newText;
}

module.exports = {
	getLangauge,
	processKaeonFUSIONDirective,
	processJavaScriptDirective,
	processDirective,
	preprocess
};