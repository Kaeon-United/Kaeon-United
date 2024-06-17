var dgram = require('dgram');

let queue = [];

function sendData(data, host, port) {

	host = host != null ? host : '192.168.10.1';
	port = port != null ? port : 8889;
		
	var client = dgram.createSocket('udp4');

	client.on('message', function(message) {

		queue.push({
			time: (new Date()).getTime() / 1000,
			data: message.toString()
		});
	});

	let message = new Buffer(data);
		
	client.send(message, 0, message.length, port, host, (error, bytes) => {

		if(error != null) {

			console.log(error);

			return;
		}

		queue.push({
			time: (new Date()).getTime() / 1000,
			data: "" + bytes
		});

		console.log(JSON.stringify(queue));

		process.exit(0);
	});
}

sendData(
	process.argv[2],
	process.argv[3],
	process.argv[4] != null ? Number("" + process.argv[4]) : null
);