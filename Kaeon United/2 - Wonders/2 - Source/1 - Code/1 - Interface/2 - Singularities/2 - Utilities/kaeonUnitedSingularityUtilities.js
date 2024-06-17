Object.assign(
	moduleDependencies,
	{
		interface: {
			main: "https://raw.githubusercontent.com/Atlas-of-Kaeon/The-Philosophy-Library-of-Kaeon/master/The%20Philosophy%20Library%20of%20Kaeon/Kaeon.one",
			reference: [
				"https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/1%20-%20Philosophy/1%20-%20Kaeon%20United%20Interface/Kaeon%20United%20Interface.one"
			]
		},
		preload: [
			{
				name: "platform",
				link: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/2%20-%20APIs/1%20-%20United/2%20-%20Utilities/1%20-%20Software/2%20-%20Kaeon%20APIs/1%20-%20General/2%20-%20Management/1%20-%20Process/1%20-%20Platform/platform.js"
			},
			{
				name: "httpUtils",
				link: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/2%20-%20APIs/1%20-%20United/2%20-%20Utilities/1%20-%20Software/2%20-%20Kaeon%20APIs/1%20-%20General/1%20-%20Data/1%20-%20HTTP%20Utilities/httpUtils.js"
			},
			{
				name: "io",
				link: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/2%20-%20APIs/1%20-%20United/2%20-%20Utilities/1%20-%20Software/2%20-%20Kaeon%20APIs/1%20-%20General/1%20-%20Data/1%20-%20HTTP%20Utilities/1%20-%20IO/io.js"
			},
			{
				name: "tokenizer",
				link: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/2%20-%20APIs/1%20-%20United/2%20-%20Utilities/1%20-%20Software/2%20-%20Kaeon%20APIs/1%20-%20General/1%20-%20Data/2%20-%20Parsing/1%20-%20Tokenizer/tokenizer.js"
			},
			{
				name: "one",
				link: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/2%20-%20APIs/1%20-%20United/1%20-%20Core/1%20-%20ONE/1%20-%20ONE/ONE.js"
			},
			{
				name: "onePlus",
				link: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/2%20-%20APIs/1%20-%20United/1%20-%20Core/1%20-%20ONE/4%20-%20ONE%2B/ONEPlus.js"
			},
			{
				name: "formatConverter",
				link: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/2%20-%20APIs/1%20-%20United/2%20-%20Utilities/1%20-%20Software/2%20-%20Kaeon%20APIs/1%20-%20General/1%20-%20Data/2%20-%20Parsing/2%20-%20Utilities/1%20-%20ONE/3%20-%20Format%20Converter/formatConverter.js"
			},
			{
				name: "aceUtils",
				link: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/2%20-%20APIs/1%20-%20United/1%20-%20Core/1%20-%20ONE/8%20-%20ACE/aceUtils.js"
			}
		],
		ONESuite: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/2%20-%20APIs/1%20-%20United/1%20-%20Core/1%20-%20ONE/6%20-%20ONE%20Suite/ONESuite.js"
	}
);

function appendInterface(main, resource) {

	return parseInterface.aceUtils.overlayEntity(
		main,
		resource // STUB
	);
}

function executeModule(utility) {

	executeModule.interface =
		executeModule.interface != null && !executeModule.refresh ?
			executeModule.interface : getInterface();

	executeModule.refresh = false;

	let interface = executeModule.interface;

	if(utility == null)
		return interface;

	let components = {
		type: { library: { } },
		environment: { }
	};

	components.environment[
		typeof utility == "string" ?
			"javascript" : "kaeon fusion"
	] = { };

	let utilities = parseInterface.aceUtils.traceKaeonACE(
		interface,
		[
			...(
				typeof utility == "string" ?
					(utility.includes(".") ?
						utility.split(".").slice(
							0,
							utility.split(".").length - 1
						) :
						[]
					).map(item => { return { alias: item } }) :
					[]
			),
			{
				alias: typeof utility == "string" ?
					(utility.includes(".") ?
						utility.substring(utility.lastIndexOf(".") + 1) :
						utility
					) :
					null,
				components: components,
				filter: (item) => {

					return item.components.locations != null ||
						item.components.source != null;
				}
			}
		]
	).map(item => {
		return require(Object.keys(item.components.locations)[0]);
	});
	
	if(typeof utility != "string") {

		utilities.forEach((item) => {

			try {
				item(utility);
			}

			catch(error) {
				
			}
		});
	}

	return utilities[0];
}

function isOverridden(entity, path) {

	try {

		if(typeof entity != "object")
			return false

		path = path != null ? path : [];
		
		let flag = false;

		if(path.length >= 2) {

			flag =
				path[path.length - 2].toLowerCase() == "components" &&
				path[path.length - 1].toLowerCase() == "flag";
		}
		
		let keys = Object.keys(entity);
		
		for(let i = 0; i < keys.length; i++) {

			if(flag && keys[i].toLowerCase() == "override")
				return true;

			if(isOverridden(entity[keys[i]], path.concat(keys[i])))
				return true;
		}

		return false;
	}

	catch(error) {
		return false;
	}
}

function parseInterface(interface) {

	if(parseInterface.aceUtils == null) {

		eval(
			moduleDependencies.preload.map((item) => {
		
				return openResource(item.link).
					split("\n").
					filter((line) => {
						return !line.includes("kaeon-united");
					}).
					join("\n").
					split("\nmodule.exports").
					join("\nvar " + item.name).
					split("moduleDependencies").
					join(item.name + "Dependencies").
					split("module.exports").
					join(item.name);
				}
			).join("\n")
		);

		parseInterface.aceUtils = aceUtils;
	}

	return parseInterface.aceUtils.useACE(
		JSON.stringify(
			parseInterface.aceUtils.formatKaeonACE(
				interface.main != null ? interface.main : interface,
				interface.reference
			)
		)
	);
}