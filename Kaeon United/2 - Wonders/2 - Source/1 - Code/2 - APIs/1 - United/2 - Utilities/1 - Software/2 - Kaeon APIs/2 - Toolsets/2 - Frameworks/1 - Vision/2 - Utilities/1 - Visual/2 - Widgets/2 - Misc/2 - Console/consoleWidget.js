var vision = require("kaeon-united")("vision");

function createConsole(options) {

	options = Object.assign(
		{
			element: document.documentElement,
			limit: 1000000,
			top: 70,
			pad: true
		},
		options != null ? options : { }
	);

	let outputField = vision.create({
		tag: "textarea",
		attributes: { "class": "output-console" },
		style: {
			position: "fixed",
			left: "0%",
			top: options.top + "%",
			width: "100%",
			height: (100 - options.top) + "%",
			"z-index": "2147483647",
			background: "white",
			"border-top": "solid black",
			resize: "none",
			"white-space": "pre",
			"font-family": "monospace"
		},
		fields: {
			readOnly: true
		}
	});

	setInterval(
		function() {

			if(!options.element.contains(outputField))
				vision.extend(outputField);
		},
		1000 / 60
	);

	vision.extend(options.element, outputField);

	console.log = function() {

		for(let i = 0; i < arguments.length; i++) {

			outputField.value +=
				(typeof arguments[i] == "object" ?
					JSON.stringify(arguments[i], null, "\t") :
					arguments[i]) +
				(options.pad ? " " : "");
		}

		outputField.value += options.pad ? "\n" : "";

		if(outputField.value.length > options.limit) {

			outputField.value = outputField.value.substring(
				outputField.value.length - options.limit,
				outputField.value.length
			);
		}

		outputField.scrollTop = outputField.scrollHeight;
	}
}

module.exports = {
	createConsole
};