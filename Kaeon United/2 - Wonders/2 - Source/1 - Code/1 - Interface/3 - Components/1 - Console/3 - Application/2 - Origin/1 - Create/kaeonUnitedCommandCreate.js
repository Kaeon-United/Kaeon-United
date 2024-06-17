var moduleDependencies = {
	axis: {
		"index.js": "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/1%20-%20Interface/2%20-%20Singularities/1%20-%20Modules/1%20-%20Application/2%20-%20CLI/3%20-%20Bootstrap/kaeonUnitedSingularityBootstrap.js",
		"localCache.json": "https://cdn.jsdelivr.net/npm/kaeon-united-utilities/localCache.json",
		"package.json": "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/1%20-%20Interface/2%20-%20Singularities/3%20-%20Management/2%20-%20Vercel/package.json",
		"vercel.json": "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/1%20-%20Interface/2%20-%20Singularities/3%20-%20Management/2%20-%20Vercel/vercel.json"
	}
};

module.exports = (args, callback) => {

	if(!Array.isArray(args)) {

		callback();

		return;
	}

	if(args.length < 2) {
		
		callback();

		return;
	}

	if(args[0].toLowerCase() != "create") {
		
		callback();

		return;
	}

	(async () => {

		let path = (args[2] != null ? args[2] : process.cwd()) +
			require("path").sep;

		if(args[1].toLowerCase() == "axis") {

			let io = require("kaeon-united")("io");

			let swap = ["package.json", "vercel.json"];

			Object.keys(moduleDependencies.axis).forEach(key => {

				let data = io.open(moduleDependencies.axis[key]);

				if(swap.includes(key)) {

					data = data.split(
						"kaeonUnitedSingularityBootstrap"
					).join("index");
				}

				io.save(data, path + key);
			});

			var fs = require("fs");

			if(!fs.existsSync(path + "axis"))
				fs.mkdirSync(path + "axis");
		}

		callback();
	})();
};