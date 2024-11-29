var philosophersStone = use("kaeon-united")("philosophersStone");

function axisClock() {
	
	let clock = Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{ tags: ["axis", "clock"] }
	);

	let delta = (new Date()).getTime();

	clock.interval = setInterval(() => {

		philosophersStone.traverse(philosophersStone.axis).forEach(item => {
			
			try {
				item.standard((new Date()).getTime() - delta);
			}

			catch(error) {

			}
		});

		delta = (new Date()).getTime();

	}, 1000 / 60);

	return clock;
}

module.exports = {
	axisClock,
	axisModule: axisClock
};