function unwrap(string) {

	string = string.split("\n\n");

	for(let i = 0; i < string.length; i++)
		string[i] = string[i].split("\n").join(" ");

	return string.join("\n\n");
}

function unwrapONE(element) {

	element.content = unwrap(element.content);

	element.children.forEach(child => {
		unwrapONE(child);
	});

	return element;
}

function wrap(string, width) {

	return string.replace(
		new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})\\s`, 'g'),
		'$1\n'
	);
}

function wrapONE(limit, tabWidth, element, nest) {

	nest = nest != null ? nest : 1;

	element.content = wrap(
		element.content,
		(limit + (tabWidth - 1)) - (nest * tabWidth)
	).split(" \n").join("\n");

	element.children.forEach(child => {
		wrapONE(limit, tabWidth, child, nest + 1);
	});

	return element;
}

module.exports = {
	unwrap,
	unwrapONE,
	wrap,
	wrapONE
};