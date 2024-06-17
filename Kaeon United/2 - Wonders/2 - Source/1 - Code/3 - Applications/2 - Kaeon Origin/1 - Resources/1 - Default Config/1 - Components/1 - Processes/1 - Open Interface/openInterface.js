var vision = require("kaeon-united")("vision");
var widgets = require("kaeon-united")("widgets");

let terminal = widgets.getVSTerminal([
	"Storage://",
	"Storage://Default/System/Commands",
	"Storage://User/Applications/Processes",
	"Storage://User/Applications/Apps"
]);

window.terminals = [terminal];

vision.extend({
	content: [terminal],
	style: {
		position: "absolute",
		left: "0%",
		top: "0%",
		width: "100%",
		height: "100%"
	}
});