var io = require("kaeon-united")("io");
var virtualSystem = require("kaeon-united")("virtualSystem");

let args = Array.from(arguments);

let options = args.filter(arg => arg.startsWith("-"));
let path = args.filter(arg => !arg.startsWith("-"))[0];

if(options.includes("-a")) {

	io.save(
		window.localStorage.getItem("Storage"),
		"Kaeon Origin Storage.json"
	);
}

else {

	let mark = window.terminals[0].getMark();
	mark = mark.substring(0, mark.length - 1).trim();
	
	path = virtualSystem.getAbsolutePath(arguments[0], mark);

	io.save(
		virtualSystem.getResource(path),
		path.substring(path.lastIndexOf("/") + 1)
	);
}