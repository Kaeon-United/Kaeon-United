var moduleDependencies = {
	ucc: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/3%20-%20Applications/1%20-%20Applications/2%20-%20Utilities/1%20-%20UCC/UCC.js"
};

module.exports = (args, callback) => {

	if(!Array.isArray(args)) {

		callback();

		return;
	}

	if(args.length == 0) {

		callback();

		return;
	}

	if(args[0].toLowerCase() != "ucc") {

		callback();

		return;
	}

	let io = require("kaeon-united")("io");
	let ONESuite = require("kaeon-united")("ONESuite");

	(async () => {

		let data = null;

		if(args[1] != null) {
			
			let flag = args[1].toLowerCase();

			data = ONESuite.preprocess(
				flag == "open" ? io.open(args[2]) : args[2]
			);
		}

		if(data.startsWith("http://") || data.startsWith("https://")) {

			let download = data;

			if(data.includes("?"))
				data = data.substring(0, data.indexOf("?"));

			data = data.substring(data.lastIndexOf("/") + 1);

			io.save(io.open(download), data);
		}

		execSync(
			"npx kaeon-united js open \"" +
			moduleDependencies.ucc +
			"\" " +
			data
		);

		callback();
	})();
};