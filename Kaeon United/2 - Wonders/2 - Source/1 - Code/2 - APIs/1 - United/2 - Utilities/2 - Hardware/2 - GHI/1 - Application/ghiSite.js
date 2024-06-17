var httpUtils = require("kaeon-united")("httpUtils");
var vision = require("kaeon-united")("vision");
var widgets = require("kaeon-united")("widgets");

function getData(input) {

	let packet = { };

	try {
		packet = eval("(()=>{return " + input.trim() + "})()");
	}

	catch(error) {
		packet = { };
	}

	let data = "{}";

	try {
		
		data = httpUtils.sendRequest({
			request: {
				method: "POST",
				uri: "http://localhost:" + 80
			},
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(packet)
		}).body;
	}

	catch(error) {
		data = "{}";
	}

	let render = "{}";

	try {
		render = JSON.stringify(JSON.parse(data), null, "\t");
	}

	catch(error) {
		render = data;
	}

	document.querySelector("#read").value = render;
}

vision.load("https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css");

vision.set(
	document.documentElement,
	{
		style: {
			overflow: "hidden"
		}
	}
);

vision.extend({
	tag: "div",
	attributes: { align: "center" },
	content: [
		{
			tag: "h1",
			content: "GHI SERVER"
		}
	]
});

vision.extend({
	tag: "div",
	attributes: { align: "center" },
	content: [
		{
			tag: "h3",
			content: "INPUT TERMINAL"
		}
	],
	style: {
		position: "absolute",
		left: "0%",
		top: "7.5%",
		width: "50%",
		height: "5%",
		resize: "none"
	}
});

vision.extend({
	tag: "div",
	attributes: { align: "center" },
	content: [
		{
			tag: "h3",
			content: "OUTPUT TERMINAL"
		}
	],
	style: {
		position: "absolute",
		left: "50%",
		top: "7.5%",
		width: "50%",
		height: "5%",
		resize: "none"
	}
});

let write = widgets.getTextbox();

vision.extend(write)

vision.set(write, {
	attributes: { id: "write" },
	style: {
		position: "absolute",
		left: "0%",
		top: "15%",
		width: "50%",
		height: "80%",
		resize: "none",
		"white-space": "pre",
		"font-family": "monospace"
	}
});

let read = widgets.getTextbox();

vision.extend(read)

vision.set(read, {
	attributes: { id: "read", readonly: true },
	style: {
		position: "absolute",
		left: "50%",
		top: "15%",
		width: "50%",
		height: "80%",
		resize: "none",
		"white-space": "pre",
		"font-family": "monospace"
	}
});

vision.extend({
	tag: "button",
	content: "SEND DATA",
	style: {
		position: "absolute",
		left: "0%",
		top: "95%",
		width: "50%",
		height: "5%"
	},
	fields: {
		onclick: () => {
			getData(document.querySelector("#write").value);
		}
	}
});

vision.extend({
	tag: "button",
	content: "RETRIEVE DATA",
	style: {
		position: "absolute",
		left: "50%",
		top: "95%",
		width: "50%",
		height: "5%"
	},
	fields: {
		onclick: () => {
			getData("{}");
		}
	}
});