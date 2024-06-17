module.exports = (args, callback) => {

	if(Array.isArray(args)) {

		callback();

		return;
	}

	let arg = args["app"]

	if(arg == null) {

		callback();

		return;
	}

	let application = require("kaeon-united")("aceUtils").traceKaeonACE(
		require("kaeon-united")(),
		[
			...(
				(arg.includes(".") ?
					arg.split(".").slice(
						0,
						arg.split(".").length - 1
					) :
					[]
				).map(item => { return { alias: item } })
			),
			{
				alias: arg.includes(".") ?
					arg.substring(arg.lastIndexOf(".") + 1) :
					arg,
				filter: (item) => {
					return item.components.locations != null;
				}
			}
		]
	).map(item => {

		let environment = null;

		if(item.components.environment != null)
			environment = Object.keys(item.components.environment)[0];

		environment = environment != null ? environment : "javascript";

		return {
			environment: environment.toLowerCase(),
			location: Object.keys(item.components.locations)[0],
			source: item.components.source
		};
	})[0];

	if(application == null)
		callback();

	if(application.environment == "javascript") {

		if(application.source == null)
			require(application.location);

		else
			require(application.source, { dynamic: true });
	}

	else if(application.environment == "kaeon fusion") {

		if(application.source == null) {

			require("kaeon-united")("ONESuite").process(
				require("kaeon-united")("io").open(application.location)
			);
		}

		else {

			require("kaeon-united")("ONESuite").process(
				application.source
			);
		}
	}

	callback();
};