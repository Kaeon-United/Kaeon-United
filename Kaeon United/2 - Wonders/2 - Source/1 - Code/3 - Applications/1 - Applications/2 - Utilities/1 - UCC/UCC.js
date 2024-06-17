let makefile =
`CC		= gcc
CFLAGS	= -g
RM		= rm -f

default: all

all: [APP_NAME]

[APP_NAME]: [APP_NAME].c
	$(CC) $(CFLAGS) -o [APP_NAME] [APP_NAME].c

clean veryclean:
	$(RM) [APP_NAME]`;

try {

	var cmd = require("node-cmd");
	var io = require("kaeon-united")("io");
	var oneSuite = require("kaeon-united")("oneSuite");
	var uc = require("kaeon-united")("uc");

	let path = process.argv[5];

	if(path.indexOf(".") == -1)
		path += ".uc";

	let appName =
		path.substring(0, path.lastIndexOf(".")).split(" ").join("_");

	let code = uc(oneSuite.preprocess(io.open(path)));

	io.save(code, appName + ".c");
	io.save(makefile.split("[APP_NAME]").join(appName), "Makefile");

	cmd.run("make");
}

catch(error) {
	console.log(error);
}