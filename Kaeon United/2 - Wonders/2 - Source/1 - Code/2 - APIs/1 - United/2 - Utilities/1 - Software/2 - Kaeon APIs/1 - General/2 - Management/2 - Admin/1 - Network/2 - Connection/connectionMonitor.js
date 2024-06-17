var connected = -1;
var intervals = [];

function isConnected() {
	return intervals.length != 0 ? connected != -1 : null;
}

function monitorConnection(onConnect, onDisconnect) {

	let initialized = true;
	let start = (new Date()).getTime();

	if(intervals.length != 0)
		return;

	intervals.push(
		setInterval(() => {
				
			require('dns').resolve('www.google.com', function(error) {
		
				if(error) {

					if(connected != -1) {

						onDisconnect(initialized);

						initialized = false;
					}

					connected = -1;
				}
					
				else {

					if(connected == -1) {

						onConnect(initialized);

						initialized = false;
					}

					connected = (new Date()).getTime();
				}
			});
		}, 1000 / 60)
	);
	
	intervals.push(
		setInterval(() => {
			
			if(initialized &&
				connected == -1 &&
				(new Date()).getTime() - start > 1000) {

				onDisconnect(initialized);

				connected = -1;
				initialized = false;
			}
			
			if(connected == -1)
				return;
		
			if((new Date()).getTime() - connected > 1000) {

				if(connected != -1) {

					onDisconnect(initialized);

					initialized = false;
				}

				connected = -1;
			}
		}, 1000 / 60)
	);
}

function stopMonitoringConnection() {

	intervals.forEach((item) => {
		clearInterval(item);
	});

	intervals = [];
}

module.exports = {
	isConnected,
	monitorConnection,
	stopMonitoringConnection
};