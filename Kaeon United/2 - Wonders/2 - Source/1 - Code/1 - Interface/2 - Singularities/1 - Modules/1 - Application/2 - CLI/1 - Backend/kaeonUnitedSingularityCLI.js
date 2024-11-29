#!/usr/bin/env node

function executeCommand(args) {

	require("./kaeonUnitedSingularityNode.js");

	let utils = use(true);

	let callback = () => {

		open--;

		if(open == 0)
			utils.clearIntervals();
	};

	utils.startIntervals();

	let components = use("kaeon-united")("aceUtils").traceKaeonACE(
		use("kaeon-united")(),
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
			return use(Object.keys(item.components.locations)[0]);

		else
			return use(item.components.source, { dynamic: true });
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