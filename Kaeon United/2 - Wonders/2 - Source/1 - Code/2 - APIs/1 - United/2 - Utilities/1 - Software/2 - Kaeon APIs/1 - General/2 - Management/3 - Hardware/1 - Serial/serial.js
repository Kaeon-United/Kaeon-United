var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');

function connect(path, onMessage, options) {

	options = options != null ? options : { };

	options.path = path;
	options.baudRate = options.baudRate != null ? options.baudRate : 9600;

	let port = new SerialPort.SerialPort(options);
	let parser = port.pipe(new Readline.ReadlineParser({ delimiter: '\r\n' }));

	parser.on('data', data => {
	
		onMessage(
			data.split("").map((char, index) => {
				return data.charCodeAt(index);
			}),
			data
		);
	});

	return port;
}

function getMessage(message) {

	let result = "";

	for(let i = 0; i < message.length; i++)
		result += String.fromCharCode(message[i]);

	return result;
}

function getPorts(callback) {

	SerialPort.SerialPort.list().then(
		(ports) => {
			callback(ports);
		},
		() => {
			callback([]);
		}
	);
}

module.exports = {
	connect,
	getMessage,
	getPorts
};