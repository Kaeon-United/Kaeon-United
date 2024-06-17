var childProcess = require("child_process");
var fs = require("fs");

function log(map, path, command) {

	let file = [];

	try {

		if(fs.existsSync(path))
			file = JSON.parse(fs.readFileSync(path, 'utf-8'));
	}

	catch(error) {
		file = [];
	}

	let child = childProcess.exec(command)

	let onData = (data) => {

		file.push(
			map != null ?
				map("" + data) :
				"" + data
		);

		try {

			fs.writeFile(path, JSON.stringify(file), null, (error) => {
				fs.writeFileSync(path, JSON.stringify(file));
			});
		}

		catch(error) {

		}
	};
	
	child.stdout.setEncoding('utf8');
	child.stdout.on('data', onData);
	
	child.stderr.setEncoding('utf8');
	child.stderr.on('data', onData);
}

module.exports = {
	log
};

if(module.parent == null) {

	let map = null;

	try {
		map = require(process.argv[3]);
	}

	catch(error) {
		map = null;
	}

	log(
		map,
		process.argv[2],
		process.argv.slice(4).map((item) => {
			return item.includes(" ") ? "\"" + item + "\"" : item;
		}).join(" ")
	);
}