module.exports = {
	adapters: [
		use(__dirname + "/ghiAdapterArduino.js")
	],
	devices: {
		"0": use(__dirname + "/ghiModuleReceptor.js"),
		"1": use(__dirname + "/ghiModuleGPIO.js"),
		"2": use(__dirname + "/ghiModuleSerial.js"),
		"3": use(__dirname + "/ghiModuleDisplay.js"),
		"4": use(__dirname + "/ghiModuleRecorder.js"),
		"5": use(__dirname + "/ghiModuleWiFi.js"),
		"6": use(__dirname + "/ghiModuleBluetooth.js"),
		"7": use(__dirname + "/ghiModuleCellular.js")
	},
	processes: [
		
	]
};