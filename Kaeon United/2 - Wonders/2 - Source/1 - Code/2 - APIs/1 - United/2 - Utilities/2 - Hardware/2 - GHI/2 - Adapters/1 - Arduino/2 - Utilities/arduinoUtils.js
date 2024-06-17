var Avrgirl = require("avrgirl-arduino");

if(module.parent == null) {

	Avrgirl.list(function(error, ports) {

		ports.filter(
			(item) => {
				return item.serialNumber == process.argv[3];
			}
		).forEach(
			(item) => {

				new Avrgirl({
					board: process.argv[2],
					port: item.comName
				}).flash(process.argv[4], (error) => {
					console.log(error);
				})
			}
		);
	});
}