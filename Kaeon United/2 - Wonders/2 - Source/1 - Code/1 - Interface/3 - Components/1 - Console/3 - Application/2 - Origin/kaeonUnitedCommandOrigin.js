module.exports = (args, callback) => {

	if(!Array.isArray(args)) {

		callback();

		return;
	}

	if(args.length > 0) {

		if(args[0].toLowerCase() != "origin") {
			
			callback();

			return;
		}
	}

	(async () => {

		require("kaeon-united")("kaeonOriginDefaultAxis")();

		require("kaeon-united")("openAxis").openAxis({
			axis: {
				default: {
					index: "https://kaeon-united.github.io/"
				},
				directories: [process.cwd() + "/axis"]
			}
		});

		if(args.length > 0) {

			let components = require("kaeon-united")("aceUtils").traceKaeonACE(
				require("kaeon-united")(),
				[
					{
						components: {
							type: { component: { } },
							environment: { javascript: { } }
						},
						filter: (item) => {

							return item.components.locations != null ||
								item.components.source != null;
						}
					}
				]
			).map(item => {

				if(item.components.source == null)
					return require(Object.keys(item.components.locations)[0]);
	
				else
					return require(item.components.source, { dynamic: true });
			});
			
			components.forEach((item) => {
		
				try {
					item(args.slice(1), () => { });
				}
		
				catch(error) {
					
				}
			});
		}

		console.log("AXIS ON!");
	})();
};