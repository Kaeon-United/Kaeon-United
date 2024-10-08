var one = use("kaeon-united")("one");
var onePlus = use("kaeon-united")("onePlus");

var kaeonFUSION = use("kaeon-united")("kaeonFUSION");

var universalPreprocessor = use("kaeon-united")("universalPreprocessor");

function preprocess(string, args) {
	return universalPreprocessor.preprocess(string, args);
}

function process(code, fusion) {

	code =
		Array.isArray(code) ?
			one.toObject(code) :
			read("" + code);

	if(fusion == null) {

		start = true;

		fusion = { fusion: new kaeonFUSION.KaeonFUSION() };
	}

	else if(fusion.fusion == null) {

		start = true;

		fusion.fusion = new kaeonFUSION.KaeonFUSION();
	}

	fusion.fusion.internalProcess(code);

	return fusion.fusion.returnValue;
}

function read(string) {

	return onePlus.read(
		preprocess(
			string.split("\r").join("")
		)
	);
}

function write(element) {

	return Array.isArray(element) ?
		one.write(one.toObject(element)) :
		one.write(element);
}

module.exports = {
	preprocess,
	process,
	read,
	write
}