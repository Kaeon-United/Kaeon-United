var moduleDependencies = {
	kaeonEdit: "https://atlas-of-kaeon.github.io/?unitedjs=https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/3%20-%20Applications/1%20-%20Applications/1%20-%20Apps/3%20-%20Kaeon%20Edit/kaeonEdit.js"
};

var virtualSystem = require("kaeon-united")("virtualSystem");

let mark = window.terminals[0].getMark();
mark = mark.substring(0, mark.length - 1).trim();

window.open(
	moduleDependencies.kaeonEdit +
		(arguments[0].trim() != "" ?
			("&path=" +
				encodeURIComponent(
					virtualSystem.getAbsolutePath(arguments[0], mark)
				)) :
			""
		),
	"_blank"
);