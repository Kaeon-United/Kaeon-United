module.exports = (args, callback) => {

	if(!Array.isArray(args)) {

		callback();

		return;
	}

	if(args[0].toLowerCase() != "app" || args.length < 2) {

		callback();

		return;
	}

	(async () => {

		let application = use("kaeon-united")("aceUtils").traceKaeonACE(
			use("kaeon-united")(),
			[
				...(
					(args[1].includes(".") ?
						args[1].split(".").slice(
							0,
							args[1].split(".").length - 1
						) :
						[]
					).map(item => { return { alias: item } })
				),
				{
					alias: args[1].includes(".") ?
						args[1].substring(args[1].lastIndexOf(".") + 1) :
						args[1],
					filter: (item) => {

						return item.components.locations != null ||
							item.components.source != null;
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

		if(application == null) {

			callback();

			return;
		}

		if(application.environment == "javascript") {

			if(application.source == null)
				use(application.location);

			else
				use(application.source, { dynamic: true });
		}

		else if(application.environment == "kaeon fusion") {

			if(application.source == null) {

				use("kaeon-united")("ONESuite").process(
					use("kaeon-united")("io").open(application.location)
				);
			}

			else {

				use("kaeon-united")("ONESuite").process(
					application.source
				);
			}
		}

		callback();
	})();
};