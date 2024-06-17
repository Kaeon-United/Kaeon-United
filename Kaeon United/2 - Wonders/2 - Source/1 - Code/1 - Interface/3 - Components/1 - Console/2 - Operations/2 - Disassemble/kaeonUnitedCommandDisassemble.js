module.exports = (args, callback) => {

	if(!Array.isArray(args)) {

		callback();

		return;
	}

	if(args.length == 0) {

		callback();

		return;
	}

	if(args[0].toLowerCase() != "disassemble") {

		callback();

		return;
	}

	let fs = require("fs");
	let io = require("kaeon-united")("io");
	let ONESuite = require("kaeon-united")("ONESuite");

	(async () => {

		let data = null;

		if(args[1] != null) {
			
			let flag = args[1].toLowerCase();

			data = ONESuite.preprocess(
				flag == "open" ? io.open(args[2]) : args[2]
			);
		}

		io.save(
			require("kaeon-united")("csb").disassemble(
				fs.readFileSync(data)
			),
			args[3]
		);

		callback();
	})();
};