var moduleDependencies = {
	cache: "https://cdn.jsdelivr.net/npm/kaeon-united-utilities/localCache.json",
	cors: {
		utils: {
			formatGithubURI: (uri) => {

				uri = uri.substring(34);
				let user = uri.substring(0, uri.indexOf("/"));

				uri = uri.substring(uri.indexOf("/") + 1);
				let repo = uri.substring(0, uri.indexOf("/"));

				uri = uri.substring(uri.indexOf("/") + 1);

				return "https://cdn.jsdelivr.net/gh/" +
					user +
					"/" +
					repo +
					"/" +
					uri.substring(uri.indexOf("/") + 1);
			}
		},
		proxies: {
			"https://corsproxy.io/": (request) => {

				request = JSON.parse(JSON.stringify(request));

				if(request.request.uri.startsWith(
					"https://raw.githubusercontent.com/")) {

					request.request.uri =
						moduleDependencies.cors.utils.formatGithubURI(
							request.request.uri
						);
				}

				else {
				
					request.request.uri =
						"https://corsproxy.io/?url=" +
							encodeURIComponent(
								request.request.uri
							).split("%20").join("%2520");
				}

				return request;
			},
			"https://nextjs-cors-anywhere.vercel.app/": (request) => {

				request = JSON.parse(JSON.stringify(request));

				if(request.request.uri.startsWith(
					"https://raw.githubusercontent.com/")) {

					request.request.uri =
						moduleDependencies.cors.utils.formatGithubURI(
							request.request.uri
						);
				}

				else {
					
					request.request.uri =
						"https://nextjs-cors-anywhere.vercel.app/api?endpoint=" +
							request.request.uri;
				}

				return request;
			}
		},
		proxy: "https://corsproxy.io/"
	},
	utilities: "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/1%20-%20Interface/2%20-%20Singularities/2%20-%20Utilities/kaeonUnitedSingularityUtilities.js"
};

function executeSingularity() {

	localStorage.setItem("localCache", openResource(moduleDependencies.cache));

	if(typeof use != typeof undefined) {

		if(use.kaeonUnited)
			return;
	}

	module = {
		id: '.',
		exports: { },
		parent: null,
		filename: "",
		loaded: false,
		children: [],
		paths: []
	};
	
	window.use = (path, options) => {

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

		if(lowerPath.endsWith("kaeonunited") ||
			lowerPath.endsWith("kaeonunited.js")) {

			return executeModule;
		}
	
		use.cache = use.cache ? use.cache : { };
	
		if(module.parent != null) {
	
			if(path.startsWith(".")) {
	
				path =
					module.filename.substring(
						0,
						module.filename.lastIndexOf('/') + 1
					) +
					path;
			}
		}
	
		while(lowerPath.startsWith("././"))
			lowerPath = lowerPath.substring(2);
	
		let cacheItem = use.cache[lowerPath];
	
		let newModule = {
			id: path,
			exports: { },
			parent: module,
			filename: path,
			loaded: false,
			children: [],
			paths: []
		};
	
		if(cacheItem == null || options.reload || options.dynamic) {

			let allText = path;
			
			if(!options.dynamic) {
				
				allText = openResource(path);

				use.cache[lowerPath] = newModule;
			}
	
			if(use.ONESuite != null)
				allText = use.ONESuite.preprocess(allText);

			let isJSON = false;

			try {

				JSON.parse(allText);

				isJSON = true;
			}

			catch(error) {

			}

			if(isJSON)
				allText = "module.exports=" + allText;

			if(!options.global) {
		
				let moduleFunction = new Function(
					"var module = arguments[0];" +
					use.toString() +
					"\nuse.cache = arguments[1];" +
					allText +
					";return module;"
				);
				
				let newModuleContents = moduleFunction(
					newModule,
					use.cache
				);
		
				for(key in newModuleContents.exports)
					newModule.exports[key] = newModuleContents.exports[key];
		
				module.children.push(newModule);
		
				newModule.loaded = true;
		
				return newModule.exports;
			}

			else {
				
				let module = newModule;

				(1, eval)(allText);

				return module.exports;
			}
		}
	
		else
			return cacheItem.exports;
	}

	use.kaeonUnited = true;
	
	try {
		use.ONESuite = use(moduleDependencies.ONESuite);
	}
	
	catch(error) {
		
	}

	window.require = use;
}

function getInterface() {
	
	let interface = { };
	let useInterface = { };

	let args = getURLArguments();

	let sources = [];

	if(args["use"] != null) {

		try {
			sources = sources.concat(JSON.parse(args["use"]));
		}

		catch(error) {

		}
	}
		
	sources.forEach((item) => {

		try {
			appendInterface(useInterface, parseInterface(item), []);
		}
	
		catch(error) {
	
		}
	});

	if(!isOverridden(useInterface)) {

		try {

			interface = parseInterface(moduleDependencies.interface);
			appendInterface(interface, useInterface);

			return interface;
		}

		catch(error) {
			
		}
	}

	return useInterface;
}

function getURLArguments(raw) {

	let vars = {};

	window.location.href.replace(
		/[?&]+([^=&]+)=([^&]*)/gi,
		function(m, key, value) {
		
			vars[
				raw ?
					decodeURIComponent(key) :
					decodeURIComponent(key).toLowerCase()
			] = decodeURIComponent(value);
		}
	);

	return vars;
}

function openResource(path) {

	try {

		if(localStorage.getItem("localCache") != null &&
			path != moduleDependencies.cache) {

			openResource.cache = openResource.cache != null ?
				openResource.cache :
				JSON.parse(localStorage.getItem("localCache"));

			if(openResource.cache.reference[path] != null) {

				return openResource.cache.cache[
					openResource.cache.reference[path]
				].content;
			}
		}

		path = moduleDependencies.cors.proxies[
			moduleDependencies.cors.proxy
		]({ request: { uri: path } }).request.uri;
		
		let request = new XMLHttpRequest();
		request.open("GET", path, false);

		let text = "";

		request.onreadystatechange = function() {

			if(request.readyState === 4) {

				if(request.status === 200 || request.status == 0)
					text = request.responseText;
			}
		}

		request.send(null);

		return text;
	}

	catch(error) {
		
	}

	return "";
}

eval(openResource(moduleDependencies.utilities));

executeSingularity();