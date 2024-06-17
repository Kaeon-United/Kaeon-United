var repoExplorer = require("kaeon-united")("generalReference")("repo");
var wrapONE = require("kaeon-united")("wrapONE");

function render(protocol, path, title, originalPath, child) {

	originalPath = originalPath != null ? originalPath : path.join(": ");

	let items = repoExplorer.getItems(path);
	let result = "";

	if(items.files.length == 1) {

		let titleLine = path.join(": ");

		if(title != null)
			titleLine = title + titleLine.substring(originalPath.length);

		result =
			"#[ " + titleLine + " ]#\n\n" +
			repoExplorer.getItem(path.concat([items.files[0]])) +
			"\n\n";
	}

	items.folders.forEach((item) => {

		if(!child && !(item == "1 - Philosophy" ||
			item == "1 - Principles" ||
			item == "2 - Principles")) {
			
			return;
		}

		result += render(
			protocol, path.concat([item]), title, originalPath, true
		) + "\n\n";
	});

	return !child ?
		wrapONE.wrap("#[ " + title + " ]#\n\n" + result.trim(), 99) :
		result.trim();
}

module.exports = {
	render
};