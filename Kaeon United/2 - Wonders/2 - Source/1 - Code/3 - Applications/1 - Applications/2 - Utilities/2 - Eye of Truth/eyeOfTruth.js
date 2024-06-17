var cryptr = require("cryptr");

let encryption =
	new cryptr(require('readline-sync').question("Enter the password: "));

let data = require('fs').readFileSync(process.argv[2], 'utf8');

try {

	let decrypted = encryption.decrypt(data);

	console.log(decrypted);

	if(process.argv[3] != null)
		require('fs').writeFileSync(process.argv[3], decrypted);
}

catch(error) {

	if(error.message != "Unsupported state or unable to authenticate data") {

		require('fs').writeFileSync(
			process.argv[process.argv[3] != null ? 3 : 2],
			encryption.encrypt(data)
		);

		console.log("DATA ENCRYPTED SUCCESSFULLY.");
	}

	else
		console.log("ERROR: WRONG PASSWORD.");
}