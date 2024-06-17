module.exports = {
	adapters: [
		require(__dirname + "/ghiAdapterArduino.js")
	],
	devices: {
		"0": require(__dirname + "/ghiModuleReceptor.js"),
		"1": require(__dirname + "/ghiModuleGPIO.js"),
		"2": require(__dirname + "/ghiModuleSerial.js"),
		"3": require(__dirname + "/ghiModuleDisplay.js"),
		"4": require(__dirname + "/ghiModuleRecorder.js"),
		"5": require(__dirname + "/ghiModuleWiFi.js"),
		"6": require(__dirname + "/ghiModuleBluetooth.js"),
		"7": require(__dirname + "/ghiModuleCellular.js")
	},
	processes: [
		
	]
};