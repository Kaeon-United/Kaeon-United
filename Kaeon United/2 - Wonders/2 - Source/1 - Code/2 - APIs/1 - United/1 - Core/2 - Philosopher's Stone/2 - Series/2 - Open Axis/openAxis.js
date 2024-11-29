var philosophersStone = use("kaeon-united")("philosophersStone");

function openAxis(options) {

	if(this.active)
		return;

	options = options != null ? options : { };

	use("kaeon-united")("aceUtils").traceKaeonACE(
		use("kaeon-united")(),
		[
			{
				alias: "axisModules"
			},
			{
				components: {
					type: { library: { } },
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
	}).forEach(item => {
		
		philosophersStone.connect(
			philosophersStone.axis,
			item.axisModule(options),
			[],
			true
		);
	});

	this.active = true;
}

module.exports = {
	openAxis
};