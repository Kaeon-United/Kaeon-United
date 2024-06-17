var moduleDependencies = {
	bootstrap: "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
	cors: "https://corsproxy.io/?",
	icon: "https://raw.githubusercontent.com/Atlas-of-Kaeon/The-Principles-Library-of-Kaeon/master/The%20Principles%20Library%20of%20Kaeon/3%20-%20Wonders/1%20-%20Angaian/2%20-%20Images/2%20-%20Angaian%20Crest/Angaian%20Crest.png"
};

var dimensions = require("kaeon-united")("dimensions");
var io = require("kaeon-united")("io");
var one = require("kaeon-united")("one");
var override = require("kaeon-united")("override");
var oneSuite = require("kaeon-united")("oneSuite");
var vision = require("kaeon-united")("vision");
var widgets = require("kaeon-united")("widgets");

let urlArgs = {};
let rawUrlArgs = {};

window.location.href.replace(
	/[?&]+([^=&]+)=([^&]*)/gi,
	function(match, key, value) {
		urlArgs[key.toLowerCase()] = decodeURIComponent(value.toLowerCase());
		rawUrlArgs[key.toLowerCase()] = decodeURIComponent(value);
	}
);

if(window.localStorage.getItem("kaeonCodeConsole") == null)
	window.localStorage.setItem("kaeonCodeConsole", "true");

if(urlArgs.kaeoncodejs != null ||
	urlArgs.kaeoncodefusion != null ||
	urlArgs.kaeoncodehtml != null) {

	vision.set(
		document.documentElement,
		{
			style: {
				position: "absolute",
				left: "0%",
				top: "0%",
				width: "100%",
				height: "100%"
			}
		}
	);

	let code = "";
	
	var data = one.read(
		rawUrlArgs.workspace != null ?
			io.open(rawUrlArgs.workspace) :
			window.localStorage.getItem("kaeonCodeData"));
		
	let id =
		urlArgs.kaeoncodejs != null ?
			urlArgs.kaeoncodejs :
			(urlArgs.kaeoncodefusion != null ?
				urlArgs.kaeoncodefusion :
				urlArgs.kaeoncodehtml);

	if(isNaN(id)) {

		for(let i = 0; i < data.children.length; i++) {

			let file = "file " + (i + 1);

			if(data.children[i].children.length != 0)
				file = data.children[i].children[0].content;

			if(file.toLowerCase() == id.toLowerCase()) {

				id = i;

				break;
			}
		}
	}

	else
		id = Number(id);

	try {
		code = data.children[id].content;
	}

	catch(error) {

	}

	let isJS = urlArgs.kaeoncodejs != null;
	let isFUSION = urlArgs.kaeoncodefusion != null;
	let isHTML = urlArgs.kaeoncodehtml != null;

	override.onSend((request) => {

		let uri = request.request.uri;

		if(uri.includes(moduleDependencies.cors)) {

			uri = decodeURIComponent(
				uri.substring(moduleDependencies.cors.length).
					split("%2520").join("%20")
			);
		}

		if(uri.startsWith("http") && uri.includes("://"))
			return null;

		uri = decodeURIComponent(uri)
			.split("%2520").join(" ")
			.split("%20").join(" ");

		for(let i = 0; i < data.children.length; i++) {

			let file = "file " + (i + 1);

			if(data.children[i].children.length != 0)
				file = data.children[i].children[0].content;

			if(file.toLowerCase() == uri.toLowerCase())
				return data.children[i].content;
		}

		return "";
	});

	if(isHTML) {

		document.documentElement.innerHTML = code;
	
		if(document.body != null) {
	
			if(document.body.style.position == "")
				document.body.style.position = "absolute";
	
			if(document.body.style.left == "")
				document.body.style.left = "0%";
	
			if(document.body.style.top == "")
				document.body.style.top = "0%";
	
			if(document.body.style.width == "")
				document.body.style.width = "100%";
	
			if(document.body.style.height == "")
				document.body.style.height = "100%";
		}
	}

	var outputField = vision.create({
		tag: "textarea",
		style: {
			position: "fixed",
			left: "0%",
			top: "70%",
			width: "100%",
			height: "30%",
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

			if(!document.documentElement.contains(outputField))
				vision.extend(outputField);
			
			outputField.style.display =
				window.localStorage.getItem("kaeonCodeConsole") == "true" &&
					rawUrlArgs.workspace == null ?
					"block" :
					"none";
		},
		1000 / 60
	);

	vision.extend(outputField);

	console.log = function() {

		for(let i = 0; i < arguments.length; i++) {

			outputField.value +=
				(typeof arguments[i] == "object" ?
					JSON.stringify(arguments[i], null, "\t") :
					arguments[i]) +
				((isJS || isHTML) ? " " : "");
		}

		if(isJS || isHTML)
			outputField.value += "\n";

		if(outputField.value.length > 1000000) {

			outputField.value = outputField.value.substring(
				outputField.value.length - 1000000,
				outputField.value.length
			);
		}

		outputField.scrollTop = outputField.scrollHeight;
	}

	if(isJS) {

		try {

			eval(
				"(async () => {try{\n" +
				oneSuite.preprocess(code) +
				"\n}catch(error){console.log(error.stack);}})();"
			);
		}

		catch(error) {
			console.log(error.stack);
		}
	}

	else if(isFUSION) {

		try {
			oneSuite.process(code);
		}

		catch(error) {
			console.log(error.stack);
		}
	}

	else {
	
		let scripts = document.querySelectorAll("script");
	
		for(let i = 0; i < scripts.length; i++) {
	
			if(scripts[i].getAttribute("src") != null)
				(1, eval)(openResource(scripts[i].getAttribute("src")));
	
			(1, eval)(scripts[i].text);
		}
	}

	return;
}

var currentTab = 0;

let inputPanel = vision.create();

var oneText = vision.create({
	tag: "textarea",
	attributes: { spellcheck: "false" },
	style: {
		left: "0%",
		top: "0%",
		width: "100%",
		height: "100%",
		overflow: "auto",
		resize: "none",
		"white-space": "pre",
		"font-family": "monospace"
	},
	fields: { readOnly: true }
});

var outTabs = [];

let outputPanel = vision.create();

var tabs = [];

function addTab(tab) {

	if(tab == null)
		tab = createTab();

	tab.line = vision.create({ tag: "br" });

	tabs.push(tab);

	vision.extend(vision.get("#files")[0], [tab, tab.line]);

	saveData();
}

function createTab(data, index, name) {

	if(index == null)
		index = tabs.length;

	let check = vision.create({ tag: "input", fields: { type: "checkbox" } });

	let button = vision.create({
		tag: "button",
		content: name == null ? ("File " + (index + 1)) : name,
		fields: {
			index: index,
			onclick: () => {
				setTab(button.index);
			}
		}
	});

	let nameButton = vision.create({
		tag: "button",
		content: "Set Name",
		fields: {
			index: index,
			onclick: () => {

				let newName = prompt("Enter this file's name:");
	
				if(newName == null)
					return;
	
				tabs[nameButton.index].childNodes[1].innerHTML = newName;
				tabs[nameButton.index].named = true;

				saveData();
			}
		}
	});

	let tab =  vision.create({
		fields: {
			named: name != null,
			button: button,
			data: data != null ? data : ""
		}
	});

	vision.extend(tab, [check, button, nameButton]);

	return tab;
}

function load() {

	tabs = [];

	vision.get("#files")[0].innerHTML = "";

	let data = window.localStorage.getItem("kaeonCodeData");

	try {
		data = one.read(data);
	}

	catch(error) {
		data = one.create("");
	}

	if(data.children.length == 0)
		one.add(data, one.create(""));

	for(let i = 0; i < data.children.length; i++) {

		let name = null;

		if(data.children[i].children.length > 0)
			name = data.children[i].children[0].content;

		addTab(createTab(data.children[i].content, i, name));
	}

	vision.get("#text")[0].value = data.children[0].content;

	setTab(0);
}

function manageScreen() {

	manageScreen.mode = manageScreen.mode != null ? manageScreen.mode : "";

	setInterval(() => {

		let mode = screen.height <= screen.width ? "horizontal" : "vertical";

		if(manageScreen.mode != mode) {

			manageScreen.mode = mode;

			vision.set(
				inputPanel,
				{
					style: {
						position: "absolute",
						left: "0%",
						top: "0%",
						width: mode == "horizontal" ? "50%" : "100%",
						height: mode == "horizontal" ? "100%" : "50%"
					}
				}
			);

			vision.set(
				outputPanel,
				{
					style: {
						position: "absolute",
						left: mode == "horizontal" ? "50%" : "0%",
						top: mode == "horizontal" ? "0%" : "50%",
						width: mode == "horizontal" ? "50%" : "100%",
						height: mode == "horizontal" ? "100%" : "50%"
					}
				}
			);
		}
	}, 1000 / 60);
}

function onRun(type) {

	if(onRun.count == null)
		onRun.count = 0;

	onRun.count++;

	vision.set(vision.get("#display")[0], { style: { overflow: "auto" } });

	let frame = vision.create({
		tag: "iframe",
		attributes: {
			"src": window.location.href +
				"&kaeoncode" +
				type +
				"=" +
				currentTab,
			"frameborder": "0"
		},
		style: {
			width: "100%",
			height: "100%",
			left: "0%",
			top: "0%",
			position: "absolute",
			overflow: "auto"
		}
	});

	try {
		vision.get("#display")[0].removeChild(oneText);
	}

	catch(error) {

	}

	vision.extend(vision.get("#display")[0], frame);

	var outItem = vision.create();

	outItem.frame = frame;

	let check = vision.create({ tag: "input" });
	check.type = "checkbox";

	let button = vision.create({
		tag: "button",
		content: tabs[currentTab].button.innerHTML + ": " + onRun.count
	});

	outItem.button = button;
	
	button.onclick = function() {

		try {
			vision.get("#display")[0].removeChild(oneText);
		}

		catch(error) {

		}

		for(let i = 0; i < outTabs.length; i++) {
			outTabs[i].button.style.background = "white";
			outTabs[i].frame.style.display = "none";
		}

		outItem.button.style.background = "green";
		outItem.frame.style.display = "block";
	};

	vision.extend(outItem, check);
	vision.extend(outItem, button);

	vision.extend(vision.get("#output-tabs")[0], outItem);

	outTabs.push(outItem);

	for(let i = 0; i < outTabs.length; i++) {
		outTabs[i].button.style.background = "white";
		outTabs[i].frame.style.display = "none";
	}

	outItem.button.style.background = "green";
	outItem.frame.style.display = "block";
}

function saveData() {

	try {

		let data = one.create();
		
		tabs[currentTab].data = text.value;

		for(let i = 0; i < tabs.length; i++) {

			let item = one.create(tabs[i].data);

			one.add(data, item);

			if(tabs[i].named) {

				one.add(
					item, one.create(tabs[i].childNodes[1].innerHTML)
				);
			}
		}
		
		window.localStorage.setItem("kaeonCodeData", one.write(data));
	}

	catch(error) {

	}
}

function setTab(index) {

	saveData();

	for(let i = 0; i < tabs.length; i++) {

		tabs[i].childNodes[1].style.background =
			i == index ? "green" : "white";
	}

	currentTab = index;
	vision.get("#text")[0].value = tabs[index].data;
}

function showText(mode) {

	vision.set(vision.get("#display")[0], { style: { overflow: "hidden" } });

	for(let i = 0; i < outTabs.length; i++)
		outTabs[i].frame.style.display = "none";

	vision.extend(vision.get("#display")[0], oneText);

	try {

		if(mode == "one") {

			oneText.value = one.write(
				oneSuite.read(vision.get("#text")[0].value)
			);
		}

		else if(mode == "preprocess")
			oneText.value = oneSuite.preprocess(vision.get("#text")[0].value);

		else
			oneText.value = window.localStorage.getItem("kaeonCodeData");
	}

	catch(error) {
		oneText.value = "ERROR: INVALID ONE+";
	}
}

vision.setFavicon(moduleDependencies.icon);

document.title = "Kaeon Code";

vision.load(moduleDependencies.bootstrap);

vision.set(
	document.documentElement,
	{
		style: {
			margin: "0",
			height: "100%",
			overflow: "hidden",
			"font-size": "13px"
		}
	}
);

vision.extend(document.documentElement, [inputPanel, outputPanel]);

vision.extend(inputPanel, [
	{
		tag: "button",
		content: "Open All",
		style: {
			position: "absolute",
			height: "5%",
			width: "15%",
			top: "0%",
			left: "0%"
		},
		fields: {
			onclick: () => {
		
				if(!confirm(
					"This will delete the contents of the existing workspace."
					+ "\nAre you okay with this?")) {
		
					return;
				}
		
				if(confirm("Is the file you want to upload online?")) {
		
					let text = null;
		
					try {
		
						let url = prompt("Enter the URL:");
		
						if(url == null)
							return;
		
						text = io.open(url);
					}
		
					catch(error) {
						return;
					}
		
					window.localStorage.setItem("kaeonCodeData", text);
		
					load();
				}
				
				else {
		
					io.open(
						function(text) {
		
							window.localStorage.setItem(
								"kaeonCodeData",
								text
							);
		
							load();
						}
					);
				}
			}
		}
	},
	{
		tag: "button",
		content: "Save All",
		style: {
			position: "absolute",
			height: "5%",
			width: "15%",
			top: "0%",
			left: "15%"
		},
		fields: {
			onclick: () => {

				io.save(
					window.localStorage.getItem("kaeonCodeData"),
					"Kaeon Code Workspace.op"
				);
			}
		}
	},
	{
		tag: "button",
		content: "Open",
		style: {
			position: "absolute",
			height: "5%",
			width: "15%",
			top: "5%",
			left: "0%"
		},
		fields: {
			onclick: () => {

				if(confirm("Is the file you want to upload online?")) {
		
					let text = null;
		
					try {
		
						let url = prompt("Enter the URL:");
		
						if(url == null)
							return;
		
						text = io.open(url);
					}
		
					catch(error) {
						return;
					}
		
					addTab(createTab(text));
					setTab(currentTab);
		
					saveData();
				}
		
				else {
		
					io.open(
						function(text) {
		
							addTab(createTab(text));
							setTab(currentTab);
		
							saveData();
						}
					);
				}
			}
		}
	},
	{
		tag: "button",
		content: "New",
		style: {
			position: "absolute",
			height: "5%",
			width: "15%",
			top: "5%",
			left: "15%"
		},
		fields: {
			onclick: () => {

				addTab();
				setTab(currentTab);
		
				saveData();
			}
		}
	},
	{
		tag: "button",
		content: "Remove",
		style: {
			position: "absolute",
			height: "5%",
			width: "30%",
			top: "90%",
			left: "0%"
		},
		fields: {
			onclick: () => {

				let temp = tabs[currentTab];
				let current = false;
		
				for(let i = 0; i < tabs.length && !current; i++) {
		
					if(tabs[i].childNodes[0].checked && i == currentTab)
						current = true;
				}
		
				currentTab = -1;
		
				for(let i = 0; i < tabs.length; i++) {
		
					if(tabs[i].childNodes[0].checked) {
		
						vision.get("#files")[0].removeChild(tabs[i]);
						vision.get("#files")[0].removeChild(tabs[i].line);
		
						tabs.splice(i, 1);
		
						i--;
					}
				}
		
				for(let i = 0; i < tabs.length; i++) {
		
					let button = tabs[i].childNodes[1];
		
					if(!tabs[i].named)
						vision.set(button, { content: "File " + (i + 1) });
		
					button.index = i;
		
					if(tabs[i] === temp)
						setTab(i);
				}
		
				if(tabs.length == 0)
					addTab();
		
				if(current)
					setTab(0);
		
				saveData();
			}
		}
	},
	{
		attributes: { id: "files" },
		style: {
			position: "absolute",
			height: "80%",
			width: "30%",
			top: "10%",
			left: "0%",
			overflow: "auto",
			"white-space": "pre"
		}
	},
	{
		tag: "button",
		content: "All",
		style: {
			position: "absolute",
			height: "5%",
			width: "15%",
			top: "95%",
			left: "0%"
		},
		fields: {
			onclick: () => {

				for(let i = 0; i < tabs.length; i++)
					tabs[i].childNodes[0].checked = true;
			}
		}
	},
	{
		tag: "button",
		content: "None",
		style: {
			position: "absolute",
			height: "5%",
			width: "15%",
			top: "95%",
			left: "15%"
		},
		fields: {
			onclick: () => {

				for(let i = 0; i < tabs.length; i++)
					tabs[i].childNodes[0].checked = false;
			}
		}
	},
	{
		tag: "button",
		content: "Save",
		style: {
			position: "absolute",
			height: "5%",
			width: "35%",
			top: "0%",
			left: "30%"
		},
		fields: {
			onclick: () => {

				io.save(
					vision.get("#text")[0].value,
					tabs[currentTab].named ?
						tabs[currentTab].childNodes[1].innerHTML :
						"File " + (currentTab + 1) + ".txt"
				);
			}
		}
	},
	{
		tag: "button",
		content: "Print",
		style: {
			position: "absolute",
			height: "5%",
			width: "35%",
			top: "0%",
			left: "65%"
		},
		fields: {
			onclick: () => {

				var mywindow = window.open(
					'',
					'PRINT',
					'height=400,width=600'
				);
		
				mywindow.document.write(
					"<pre>" +
					vision.get("#text")[0].value.
					split("<").join("&lt;").
					split(">").join("&gt;").
					split("&").join("&amp;") +
					"</pre>"
				);
		
				mywindow.document.close();

				mywindow.focus();
		
				mywindow.print();
				mywindow.close();
			}
		}
	},
	{
		tag: "button",
		content: "Run Kaeon FUSION",
		style: {
			position: "absolute",
			height: "5%",
			width: (70 / 3) + "%",
			top: "90%",
			left: "30%"
		},
		fields: { onclick: () => { onRun("fusion"); } }
	},
	{
		tag: "button",
		content: "Run JavaScript",
		style: {
			position: "absolute",
			height: "5%",
			width: (70 / 3) + "%",
			top: "90%",
			left: (30 + (70 / 3)) + "%"
		},
		fields: { onclick: () => { onRun("js"); } }
	},
	{
		tag: "button",
		content: "Run HTML",
		style: {
			position: "absolute",
			height: "5%",
			width: (70 / 3) + "%",
			top: "90%",
			left: (30 + (2 * (70 / 3))) + "%"
		},
		fields: { onclick: () => { onRun("html"); } }
	},
	{
		tag: "button",
		content: "Show ONE",
		style: {
			position: "absolute",
			height: "5%",
			width: (70 / 3) + "%",
			top: "95%",
			left: "30%"
		},
		fields: { onclick: () => { showText("one"); } }
	},
	{
		tag: "button",
		content: "Show Preprocessed",
		style: {
			position: "absolute",
			height: "5%",
			width: (70 / 3) + "%",
			top: "95%",
			left: (30 + (70 / 3)) + "%"
		},
		fields: { onclick: () => { showText("preprocess"); } }
	},
	{
		tag: "button",
		content: "Show Workspace",
		style: {
			position: "absolute",
			height: "5%",
			width: (70 / 3) + "%",
			top: "95%",
			left: (30 + (2 * (70 / 3))) + "%"
		},
		fields: { onclick: () => { showText("workspace"); } }
	},
	vision.set(
		widgets.getTextbox(),
		{
			attributes: { id: "text" },
			style: {
				position: "absolute",
				height: "85%",
				width: "70%",
				top: "5%",
				left: "30%",
				overflow: "auto",
				resize: "none",
				"font-family": "monospace"
			},
			fields: {
				onchange: saveData
			}
		}
	)
]);

vision.extend(outputPanel, [
	{
		tag: "button",
		content: "Fullscreen",
		style: {
			position: "absolute",
			height: "5%",
			width: "35%",
			top: "0%",
			left: "0%"
		},
		fields: { onclick: () => { dimensions.fullscreen(vision.get("#display")[0]); } }
	},	
	{
		tag: "button",
		content: window.localStorage.getItem("kaeonCodeConsole") == "true" ?
			"Hide Console" :
			"Show Console",
		style: {
			position: "absolute",
			height: "5%",
			width: "35%",
			top: "0%",
			left: "35%"
		},
		fields: {
			onclick: (event) => {

				if(window.localStorage.getItem("kaeonCodeConsole") ==
					"true") {
		
					window.localStorage.setItem("kaeonCodeConsole", "false");
		
					event.target.innerHTML = "Show Console";
				}
		
				else {
		
					window.localStorage.setItem("kaeonCodeConsole", "true");
		
					event.target.innerHTML = "Hide Console";
				}
			}
		}
	},
	{
		attributes: { id: "display" },
		style: {
			overflow: "auto",
			background: "white",
			"white-space": "pre",
			position: "absolute",
			height: "95%",
			width: "70%",
			top: "5%",
			left: "0%"
		}
	},
	{
		attributes: { id : "output-tabs" },
		style: {
			position: "absolute",
			height: "90%",
			width: "30%",
			top: "0%",
			left: "70%",
			overflow: "auto",
			background: "white",
			"border-left": "1px solid black",
			"white-space": "pre"
		}
	},
	{
		tag: "button",
		content: "Remove",
		style: {
			position: "absolute",
			height: "5%",
			width: "30%",
			top: "90%",
			left: "70%"
		},
		fields: {
			onclick: () => {

				let current = false;
		
				for(let i = 0; i < outTabs.length; i++) {
		
					if(outTabs[i].childNodes[0].checked) {
		
						if(outTabs[i].button.style.background == "green")
							current = true;
		
						vision.get("#output-tabs")[0].removeChild(outTabs[i]);
						vision.get("#display")[0].removeChild(outTabs[i].frame);
		
						outTabs.splice(i, 1);

						i--;
					}
				}
		
				if(current) {
		
					if(outTabs.length > 0) {
						outTabs[0].button.style.background = "green";
						outTabs[0].frame.style.display = "block";
					}
				}
			}
		}
	},
	{
		tag: "button",
		content: "All",
		style: {
			position: "absolute",
			height: "5%",
			width: "15%",
			top: "95%",
			left: "70%"
		},
		fields: {
			onclick: () => {

				for(let i = 0; i < outTabs.length; i++)
					outTabs[i].childNodes[0].checked = true;
			}
		}
	},
	{
		tag: "button",
		content: "None",
		style: {
			position: "absolute",
			height: "5%",
			width: "15%",
			top: "95%",
			left: "85%"
		},
		fields: {
			onclick: () => {

				for(let i = 0; i < outTabs.length; i++)
					outTabs[i].childNodes[0].checked = false;
			}
		}
	}
]);

load();
manageScreen();

setTab(0);