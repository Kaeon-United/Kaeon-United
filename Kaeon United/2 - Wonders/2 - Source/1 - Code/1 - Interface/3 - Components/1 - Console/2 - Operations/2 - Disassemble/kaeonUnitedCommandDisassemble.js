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

	let fs = use("fs");
	let io = use("kaeon-united")("io");
	let ONESuite = use("kaeon-united")("ONESuite");

	(async () => {

		let data = null;

		if(args[1] != null) {
			
			let flag = args[1].toLowerCase();

			data = ONESuite.preprocess(
				flag == "open" ? io.open(args[2]) : args[2]
			);
		}

		io.save(
			use("kaeon-united")("csb").disassemble(
				fs.readFileSync(data)
			),
			args[3]
		);

		callback();
	})();
};