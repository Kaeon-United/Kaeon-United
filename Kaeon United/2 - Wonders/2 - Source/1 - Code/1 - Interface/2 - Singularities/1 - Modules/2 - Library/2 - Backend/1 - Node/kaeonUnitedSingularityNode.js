var moduleDependencies = {
	cache: "https://cdn.jsdelivr.net/npm/kaeon-united-utilities/localCache.json",
	utilities: "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/1%20-%20Interface/2%20-%20Singularities/2%20-%20Utilities/kaeonUnitedSingularityUtilities.js"
};

function clearIntervals() {

	let utils = use(true);

	utils.intervals.forEach((interval) => {
		clearInterval(interval);
	});
}

function executeSingularity() {

	try {

		use(true);

		return;
	}

	catch(error) {

	}

	var child_process = require("child_process");
	var fs = require("fs");
	var moduleUtils = require("module");
	var path = require('path');

	let cache = { cache: [], reference: { } };

	try {
		child_process.execSync("npm init -y");
	}

	catch(error) {

	}
	
	if(!fs.existsSync(process.cwd() + "/localCache.json")) {

		try {

			fs.writeFileSync(
				process.cwd() + "/localCache.json",
				"{cache:[],reference:{}}"
			);
		}
	
		catch(error) {
	
		}
	}
		
	var installedModules = [].concat(moduleUtils.builtinModules);

	installedModules.push("xmlhttprequest");
	module.paths.push(process.cwd() + path.sep + "node_modules");

	try {

		installedModules = installedModules.concat(
			Object.keys(
				JSON.parse(
					require("child_process").
						execSync('npm ls --json').
						toString()
				).dependencies
			)
		);
	}
	
	catch(error) {
		
	}

	use = function(path, options) {

		if(path == true)
			return use;

		if(typeof options != "object")
			options = { };

		if(options.async == true || typeof options.async == "function") {

			let promise = new Promise(function(resolve, reject) {

				try {

					resolve(
						use(
							path,
							{
								dynamic: options.dynamic,
								global: options.global,
								reload: options.reload
							}
						)
					);
				}

				catch(error) {
					reject(error);
				}
			});

			if(options.async != true)
				promise.then(options.async);

			return options.async == true ? promise : undefined;
		}

		let lowerPath = path.toLowerCase().
			split("-").join("").split(" ").join("");

		if(!options.dynamic) {

			if(lowerPath.endsWith("kaeonunited") ||
				lowerPath.endsWith("kaeonunited.js")) {

				return executeModule;
			}

			if(options.reload) {

				if(use.cache[path] != null)
					delete use.cache[path];
			}

			else if(use.cache[path] != null)
				return use.cache[path];

			use.cache[path] = { };

			if(!path.startsWith("http://") &&
				!path.startsWith("https://") &&
				!options.global) {

				if(!moduleExists(path) && !installedModules.includes(path)) {
			
					try {

						use.execSync("npm install \"" + path + "\"");

						installedModules.push(path);
					}
		
					catch(error) {
						
					}
				}

				try {
		
					let item = null;
					
					if(installedModules.includes(path)) {

						try {
							item = require(path);
						}

						catch(error) {

							try {

								item = require(
									process.cwd() + "/node_modules/" + path
								);
							}
	
							catch(error) {
								item = require(path);
							}
						}
					}

					else {

						let text = openResource(path);

						try {
							item = JSON.parse(text);
						}

						catch(error) {

							item = (new Function(
								"use = arguments[0];" +
									"var module={exports:{}};" +
									text +
									";return module.exports;"
							))(use);
						}
					}

					use.cache[path] = item;
		
					return item;
				}

				catch(error) {

					delete use.cache[path];

					return { };
				}
			}
		}

		let data = options.dynamic ? path : openResource(path);

		if(use.oneSuite != null)
			data = use.oneSuite.preprocess(data);
		
		let result = null;

		try {
			result = JSON.parse(data);
		}

		catch(error) {
			
			if(!options.global) {
	
				data =
					"use = arguments[0];var module={exports:{}};" +
					data +
					";return module.exports;";
	
				result = (new Function(data))(use);
			}
	
			else {
	
				var module = { exports: { } };
	
				(1, eval)(data);
	
				result = module.exports;
			}
		}
		
		if(!options.dynamic)
			use.cache[path] = result;

		return result;
	}

	global.use = use;

	use.connected = 0;
	
	use.cache = { };
	use.intervals = [];

	use.appendInterface = appendInterface;

	use.clearIntervals = clearIntervals;
	use.startIntervals = startIntervals;

	use.execSync = child_process.execSync;
	use.fs = fs;

	try {
		use.oneSuite = use(moduleDependencies.ONESuite);
	}

	catch(error) {

	}

	try {

		let altPath = "";

		if(!fs.existsSync(process.cwd() + "/localCache.json")) {

			if(fs.existsSync(
				process.cwd() + "/node_modules/kaeon-united-utilities/localCache.json"
			)) {

				altPath = "/node_modules/kaeon-united";
			}

			else {
	
				fs.writeFileSync(
					process.cwd() + "/localCache.json",
					"{cache:[],reference:{}}"
				);
			}
		}

		cache = JSON.parse(
			fs.readFileSync(
				process.cwd() + altPath + "/localCache.json", 
				"utf-8"
			)
		);

		let defaultCache = JSON.parse(openResource(moduleDependencies.cache));

		Object.keys(defaultCache.reference).forEach(key => {

			if(cache.reference[key] != null) {

				cache.cache[cache.reference[key]] =
					defaultCache.cache[defaultCache.reference[key]];
			}

			else {

				cache.reference[key] = cache.cache.length;

				cache.cache.push(
					defaultCache.cache[defaultCache.reference[key]]
				);
			}
		});

		fs.writeFileSync(
			process.cwd() + "/localCache.json",
			JSON.stringify(cache)
		);
	}

	catch(error) {
		
	}
}

function fileExists(file) {

	try {
		return use(true).fs.existsSync(file);
	}
	
	catch(error) {
		return false;
	}
}

function getInterface() {
	
	let interface = {
		components: { },
		entities: { }
	};

	let fs = require("fs");
	let sep = require("path").sep;

	try {
	
		let useInterface = {
			components: { },
			entities: { }
		};

		let interfaces = [];

		fs.readdirSync(process.cwd(), { withFileTypes: true }).filter(item => {

			if(item.isDirectory())
				return false;

			let name = item.name;

			if(name.includes("."))
				name = name.substring(0, name.indexOf("."));

			return name.toLowerCase() == "use";
		}).map(item => item.path + sep + item.name).forEach(item => {
			interfaces.push(parseInterface(fs.readFileSync(item, "utf-8")));
		});

		let index = process.argv.indexOf("-use");

		if(index != -1) {

			interfaces = interfaces.concat(
				process.argv.slice(index + 1).map(
					item => parseInterface(item)
				)
			);
		}

		interfaces.forEach((item) => {
			appendInterface(useInterface, item);
		});

		if(!isOverridden(useInterface)) {

			interface = parseInterface(moduleDependencies.interface);
			appendInterface(interface, useInterface);

			return interface;
		}

		return useInterface;
	}

	catch(error) {
		
	}

	return interface;
}

function init() {

	var child_process = require("child_process");
	var fs = require("fs");
	
	if(!fs.existsSync(process.cwd() + "/package.json")) {

		try {
			child_process.execSync("npm init -y");
		}

		catch(error) {
			
		}
	}

	try {
		require("xmlhttprequest");
	}
	
	catch(error) {

		try {
	
			child_process.execSync(
				"npm install xmlhttprequest"
			);
		}

		catch(error) {

		}
	}

	if(!fs.existsSync(process.cwd() + "/localCache.json")) {

		try {

			fs.writeFileSync(
				process.cwd() + "/localCache.json",
				"{cache:[],reference:{}}"
			);
		}

		catch(error) {

		}
	}
}

function moduleExists(file) {

	if(fileExists(file))
		return true;

	if(fileExists(file + ".js"))
		return true;

	return false;
}

function openResource(path) {

	let getValue = (object, key) => {

		return object[Object.keys(object).filter(
			item => item.toLowerCase().trim() == key.toLowerCase().trim()
		)[0]];
	}

	let utils = {
		connected: 0
	};

	try {
		utils = use(true);
	}

	catch(error) {

	}

	try {

		if(path.startsWith("http://") || path.startsWith("https://")) {

			if(openResource.cache == null) {

				try {

					let altPath = "";
					
					if(!require("fs").existsSync(
						process.cwd() + "/localCache.json"
					)) {

						if(require("fs").existsSync(
							process.cwd() +
								"/node_modules/kaeon-united/localCache.json"
						)) {
			
							altPath = "/node_modules/kaeon-united";
						}
					}
					
					openResource.cache = JSON.parse(require("fs").readFileSync(
						process.cwd() + altPath + "/localCache.json", 'utf-8'
					));
				}

				catch(error) {
					openResource.cache = { cache: [], reference: { } };
				}
			}

			let cacheItem = { content: "", properties: { } };

			if(path != moduleDependencies.cache) {

				if(getValue(openResource.cache.reference, path) != null) {

					cacheItem = openResource.cache.cache[
						getValue(openResource.cache.reference, path)
					];
				}

				else {

					openResource.cache.reference[path] =
						openResource.cache.cache.length;

					openResource.cache.cache.push(cacheItem);
				}
			}

			if(cacheItem.properties.reload != null) {

				if(!cacheItem.properties.reload)
					return cacheItem.content;
			}

			if(utils.connected != -1) {

				let xhr = require('xmlhttprequest').XMLHttpRequest;
				
				let request = new xhr();
				request.open("GET", path, false);

				let text = "";

				request.onreadystatechange = function() {

					if(request.readyState === 4) {

						if(request.status === 200 || request.status == 0)
							text = request.responseText;
					}
				}

				request.send(null);

				if(text == null)
					return cacheItem.content;

				if(cacheItem.content != text &&
					path != moduleDependencies.cache) {

					cacheItem.content = text;
					
					try {

						require("fs").writeFileSync(
							process.cwd() + "/localCache.json",
							JSON.stringify(openResource.cache)
						);
					}

					catch(error) {
						
					}
				}

				return text;
			}

			else
				return cacheItem.content;
		}

		else
			return require("fs").readFileSync(path, 'utf-8');
	}

	catch(error) {

	}

	return "";
}

function startIntervals() {

	let utils = use(true);

	utils.intervals = [
		setInterval(() => {
					
			require("dns").resolve('www.google.com', function(error) {
		
				if(error)
					utils.connected = -1;
					
				else
					utils.connected = (new Date()).getTime();
			});
		}, 1000 / 60),
		setInterval(() => {
			
			if(utils.connected == -1 || utils.connected == 0)
				return;
		
			if((new Date()).getTime() - utils.connected > 1000)
				utils.connected = -1;
		}, 1000 / 60)
	];
}

init();
eval(openResource(moduleDependencies.utilities));
executeSingularity();

module.exports = executeModule;