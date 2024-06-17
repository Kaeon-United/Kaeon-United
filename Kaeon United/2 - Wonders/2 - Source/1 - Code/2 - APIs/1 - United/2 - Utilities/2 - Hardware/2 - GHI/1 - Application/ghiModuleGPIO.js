var gpio = {
	mode: () => { },
	open: () => { },
	read: () => { return 0; },
	write: () => { },
}

try {
	gpio = require("rpio");
}

catch(error) {

}

var pins = [];
var stateRecord = [];

module.exports = {
	block: (state, id, call) => {
		return false;
	},
	init: (reference, state, id, callback, args) => {
	 
		for(let i = 0; i <= 40; i++) {
	 
			try {
	 
				gpio.open(i, gpio.INPUT);
	 
				pins.push(i);
			}
	 
			catch(error) {
	 
			}
		}

		while(stateRecord.length < pins.length)
			stateRecord.push(0);
	},
	process: (state, id) => {
	
		if(state[id].output != null) {

			for(let i = 0; i < pins.length && i < state[id].output.length; i++) {

				if(stateRecord[i] == 0 && state[id].output[i] != 0) {

					gpio.mode(pins[i], gpio.OUTPUT);

					gpio.write(pins[i], state[id].output[i] == 1 ?
						gpio.HIGH :
						state[id].output[i]
					);
				}

				else if(stateRecord[i] != 0 && state[id].output[i] == 0) {

					gpio.write(pins[i], gpio.LOW);

					gpio.mode(pins[i], gpio.INPUT);
				}
			}

			stateRecord = state[id].output;

			while(stateRecord.length < pins.length)
				stateRecord.push(0);
		}
	},
	read: (state, id) => {
	
		let reading = [];

		for(let i = 0; i < pins.length; i++) {
	
			if(stateRecord[i] != 0)
				reading.push(null);
	
			else
				reading.push(gpio.read(pins[i]));
		}
	
		return reading;
	},
	type: "gpio"
};