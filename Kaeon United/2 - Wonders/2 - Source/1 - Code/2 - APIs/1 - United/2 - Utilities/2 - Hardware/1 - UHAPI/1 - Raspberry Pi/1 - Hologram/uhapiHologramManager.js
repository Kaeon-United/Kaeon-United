var child = require("child_process");

if(process.platform == "win32")
	process.exit(0);

// STUB - Check for Hologram installation, Install if absent

child.exec(
	"sudo /usr/local/bin/node \"" +
		__dirname +
		"/terminalLogger.js\" \"" +
		__dirname +
		"/dataLog.json\" null sudo /bin/python3 \"" +
		__dirname +
		"/uhapiHologram.py\" " +
		port
);