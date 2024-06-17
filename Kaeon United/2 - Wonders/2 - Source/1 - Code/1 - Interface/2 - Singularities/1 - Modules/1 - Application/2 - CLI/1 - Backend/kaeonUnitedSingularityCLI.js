#!/usr/bin/env node

function executeCommand(args) {

	require("./kaeonUnitedSingularityNode.js");

	let utils = require(true);

	let callback = () => {

		open--;

		if(open == 0)
			utils.clearIntervals();
	};

	utils.startIntervals();

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
			return require(item.components.source,  { dynamic: true });
	});

	let open = components.length;

	if(open == 0) {

		utils.clearIntervals();

		return;
	}

	components.forEach((item) => {

		try {
			item(args, callback);
		}

		catch(error) {
			callback();
		}
	});
}

executeCommand(process.argv.slice(2));