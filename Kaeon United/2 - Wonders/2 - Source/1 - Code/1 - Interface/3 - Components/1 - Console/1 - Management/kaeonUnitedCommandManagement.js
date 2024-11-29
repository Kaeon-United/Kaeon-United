var aceUtils = null;
var execSync = null;
var fs = null;
var sep = null;

function executeCommands(interface, operation) {

	aceUtils.traceKaeonACE(
		interface,
		[
			{
				filter: (item) => {

					if(item.components.protocol != null)
						return item.components.protocol[operation] != null;
				}
			}
		]
	).forEach(item => {

		Object.keys(item.components.protocol[operation]).forEach(command => {
			execSync(command);
		});
	})
}

function getUseFile() {

	let useFile = {
		components: { },
		entities: { }
	};

	try {

		fs.readdirSync(process.cwd(), { withFileTypes: true }).filter(item => {

			if(item.isDirectory())
				return false;

			let name = item.name;

			if(name.includes("."))
				name = name.substring(0, name.indexOf("."));

			return name.toLowerCase() == "use";
		}).map(item => item.path + sep + item.name).forEach(item => {

			aceUtils.overlayEntity(
				useFile,
				aceUtils.formatKaeonACE(fs.readFileSync(item, "utf-8"))
			);
		});
	}

	catch(error) {
		
	}

	return useFile;
}

module.exports = (args, callback) => {

	if(!Array.isArray(args)) {

		callback();

		return;
	}

	if(args.length == 0) {

		callback();

		return;
	}

	if(args[0].toLowerCase() != "install" &&
		args[0].toLowerCase() != "uninstall" &&
		args[0].toLowerCase() != "list") {

		callback();

		return;
	}
	
	aceUtils = use("kaeon-united")("aceUtils");
	execSync = use('child_process').execSync;
	fs = use("fs");
	sep = use("path").sep;
	
	let useFile = getUseFile();

	let operation = args[0].toLowerCase();
	let arguments = args.slice(1);

	(async () => {
	
		if(operation == "install" || operation == "uninstall") {

			arguments.forEach((item) => {

				try {

					let interface = aceUtils.formatKaeonACE(item);

					executeCommands(interface, operation);

					if(operation == "install")
						aceUtils.overlayEntity(useFile, interface);

					else
						aceUtils.clearEntity(useFile, interface);
				}

				catch(error) {
					console.log(error.stack);
				}
			});
			
			fs.writeFileSync(
				process.cwd() + "/use.json",
				JSON.stringify({ use: useFile })
			);
		}
	
		else if(operation == "list")
			console.log(Object.keys(useFile.entities).join("\n"));

		callback();
	})();
};