function getInstruction(wifi, drone, command) {

	let instruction = {
		delta: 2,
		operation: { }
	}

	instruction.operation[wifi] = {
		"output": {
			"credentials": {
				"ssid": drone,
				"host": "192.168.10.1",
				"port": 8889
			},
			"data": command
		}
	};

	return instruction;
}

module.exports = (receptor, wifi, drone) => {
	
	return {
		sequences: [
			{
				sequence: [
					getInstruction(wifi, drone, "command"),
					getInstruction(wifi, drone, "battery?"),
					getInstruction(wifi, drone, "takeoff")
				]
			}
		]
	};
};