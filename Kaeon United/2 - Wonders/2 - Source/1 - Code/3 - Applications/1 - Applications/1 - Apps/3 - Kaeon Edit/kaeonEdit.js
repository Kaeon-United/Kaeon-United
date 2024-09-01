var moduleDependencies = {
	bootstrapCSS: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
	bootstrapJS: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
	icon: "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/2%20-%20Assets/1%20-%20Visual/1%20-%20Images/1%20-%20Iconography/2%20-%20Kaeon%20United/2%20-%20Kaeon%20United/Kaeon%20United%20Logo.png"
};

var http = use("kaeon-united")("httpUtils");
var vision = use("kaeon-united")("vision");
var virtualSystem = use("kaeon-united")("virtualSystem");
var widgets = use("kaeon-united")("widgets");

function save() {

	if(path == null)
		return;

	virtualSystem.setResource(path, text.value);

	vision.set(button, {
		content: "Save"
	});
}

var path = http.getURLArguments(window.location.href)["path"];

var text = vision.set(
	widgets.getTextbox({
		onType: (value, text, event) => {

			if(path == null)
				return;

			if(event.ctrlKey && event.key == 's') {

				event.preventDefault();

				save();
			}

			else {

				vision.set(button, {
					content: "*Save"
				});
			}
		}
	}),
	{
		attributes: {
			"class": "form-control"
		},
		style: {
			"font-family": "monospace",
			position: "absolute",
			left: "5%",
			top: "5%",
			width: "90%",
			height: path != null ? "85%" : "90%"
		}
	}
);

if(path != null) {

	var button = vision.create({
		tag: "button",
		content: "Save",
		attributes: {
			"class": "form-control btn btn-primary"
		},
		fields: {
			onclick: () => {
				save();
			}
		},
		style: {
			"font-family": "monospace",
			position: "absolute",
			left: "5%",
			top: "92.5%",
			width: "90%",
			height: "5%"
		}
	});

	virtualSystem.initiateVirtualSystemDefault();

	vision.extend({
		content: path,
		style: {
			"font-family": "monospace",
			"text-align": "center",
			position: "absolute",
			left: "5%",
			top: "1.5%",
			width: "90%",
			height: "5%"
		}
	});

	vision.extend(button);

	let content = virtualSystem.getResource(path);

	text.value = content != null ? content : "";
}

vision.extend(text);

vision.load(moduleDependencies.bootstrapCSS);
vision.load(moduleDependencies.bootstrapJS);

vision.setFavicon(moduleDependencies.icon);

document.title = "Kaeon Edit" + (path != null ? " - " + path : "");