var one = require("kaeon-united")("one");
var tokenizer = require("kaeon-united")("tokenizer");

function processONELisp(data) {

	let root = one.create();
	
	let tokens =
		tokenizer.tokenize(
			[" ", "\t", "\n", "\"", "(", ")", "\\"],
			data
		);
	
	let currentElement = root;
	root.content = null;
	
	let isQuote = false;
	let literal = "";
	
	for(let i = 0; i < tokens.length; i++) {
		
		if(tokens[i] == "\"") {
			
			isQuote = !isQuote;
			
			if(!isQuote && literal.length > 0) {
				
				if(currentElement.content == null)
					currentElement.content = literal;
				
				else
					one.add(currentElement, one.create(literal));
				
				literal = "";
			}
			
			continue;
		}
		
		if(tokens[i] == "\\" && i < tokens.length - 1) {
			
			if(isQuote)
				literal += tokens[i + 1];
			
			else {
				
				if(currentElement.content == null)
					currentElement.content = tokens[i + 1];
				
				else
					one.add(currentElement, one.create(tokens[i + 1]));
			}
			
			i++;
			
			continue;
		}
		
		if(tokens[i] == "(" && i < tokens.length - 1) {
			
			let newElement = one.create();
			newElement.content = null;
			
			one.add(currentElement, newElement);
			
			currentElement = newElement;
		}
		
		else if(tokens[i] == ")" && currentElement.parent != null)
			currentElement = currentElement.parent;
		
		else if(isQuote)
			literal += tokens[i];
		
		else if(tokens[i] != " " && tokens[i] != "\n" && tokens[i] != "\t") {
			
			if(currentElement.content == null)
				currentElement.content = tokens[i];
			
			else
				one.add(currentElement, one.create(tokens[i]));
		}
	}
	
	root.content = "";
	
	if(currentElement.content == null)
		currentElement.content = "";
	
	return one.write(root);
}

module.exports = function(item) {

	if(typeof item == "string")
		return processONELisp(item);

	item.returnValue = processONELisp(process.argv[2]);
};