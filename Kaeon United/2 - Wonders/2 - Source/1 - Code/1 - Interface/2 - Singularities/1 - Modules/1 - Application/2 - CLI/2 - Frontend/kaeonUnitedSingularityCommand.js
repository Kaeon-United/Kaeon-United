function executeCommand(args) {

	require("kaeon-united")("aceUtils").traceKaeonACE(
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
	}).forEach((item) => {

		try {
			item(args, () => { });
		}

		catch(error) {
			
		}
	});
}

executeCommand(Array.from(arguments));