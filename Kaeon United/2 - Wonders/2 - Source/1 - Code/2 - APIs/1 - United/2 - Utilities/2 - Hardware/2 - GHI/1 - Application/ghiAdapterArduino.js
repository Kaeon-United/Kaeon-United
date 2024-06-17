var child_process = require("child_process");

module.exports = {
	adapt: (port) => {

		child_process.execSync(
			"node \"" +
			__dirname +
			"/arduinoUtils.js\" uno " +
			port.serialNumber +
			" \"" +
			__dirname +
			"/ghi.hex\""
		);
	},
	verify(port) {
		return port.pnpId.includes("2341") && port.pnpId.includes("0043");
	}
};