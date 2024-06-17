var virtualSystem = require("kaeon-united")("virtualSystem");
var vision = require("kaeon-united")("vision");

function createStartScreen(callback, element, text) {

	text = text != null ? text : "Start";

	let newScreen = element == null;

	if(newScreen) {

		element = vision.create({
			style: {
				position: "absolute",
				left: "0%",
				top: "0%",
				width: "100%",
				height: "100%",
				"z-index": "999"
			}
		});

		vision.extend(element);
	}

	let button = vision.create(
		{
			tag: "button",
			style: {
				position: "absolute",
				left: "50%",
				top: "50%",
				width: "30vmin",
				height: "10vmin",
				transform: "translate(-50%, -50%)",
				background: "white",
				color: "black",
				"border-radius": "500px",
				font: "6vmin helvetica"
			},
			content: [
				text
			]
		}
	);

	button.onclick = function() {

		if(!newScreen)
			element.innerHTML = "";

		callback(element);

		if(newScreen)
			vision.remove(element);
	}
	
	vision.extend(
		element,
		vision.create(
			{
				tag: "div",
				style: {
					position: "absolute",
					left: "0%",
					top: "0%",
					width: "100%",
					height: "100%",
					background: "black"
				},
				content: [
					button
				]
			}
		)
	);
}

function getTerminal(onSubmit) {

	onSubmit = onSubmit != null ? onSubmit : () => { };

	let log = getTextbox({ readOnly: true });

	vision.set(log, {
		style: {
			width: "100%",
			height: "0px",
			margin: "0%",
			padding: "0%",
			left: "0%",
			top: "0%",
			border: "none",
			outline: "none",
			overflow: "hidden"
		}
	});

	let mark = vision.create({ fields: { innerHTML: ">" } });

	let field = vision.create({
		tag: "input",
		attributes: {
			rows: "1"
		},
		style: {
			"width": "100%",
			"font-family": "monospace",
			"border-top-style": "hidden",
			"border-right-style": "hidden",
			"border-left-style": "hidden",
			"border-bottom-style": "hidden",
			outline: "none",
			overflow: "auto",
			resize: "none"
		}
	});

	let terminal = vision.create({
		content: [
			{
				tag: "table",
				content: [
					{
						tag: "tr",
						content: [
							{ tag: "td", content: [log] }
						]
					}
				],
				style: {
					width: "100%",
					"border-collapse": "collapse"
				}
			},
			{
				tag: "table",
				content: [
					{
						tag: "tr",
						content: [
							{
								tag: "td",
								content: [mark],
								style: {
									width: "0%",
									"white-space": "nowrap",
									"font-size": "13.333px"
								}
							},
							{
								tag: "td",
								content: [field],
								style: {
									"padding-left": "4.333px"
								}
							}
						]
					}
				],
				style: {
					width: "100%",
					"margin-top": "-3.333px",
					"border-collapse": "collapse"
				}
			}
		],
		style: {
			"font-family": "monospace",
			"position": "absolute",
			"left": "0%",
			"top": "0%",
			"width": "100%",
			"height": "100%",
			"overflow": "auto"
		}
	});

	terminal.current = null;
	terminal.index = null;
	terminal.history = [];

	terminal.clear = () => {

		log.innerHTML = "";
		
		log.style.height = "0px";
	}

	terminal.getContent = () => {
		return log.innerHTML;
	}

	terminal.getText = () => {
		return log.textContent;
	}

	terminal.logContent = (content) => {

		log.innerHTML +=
			(log.value.length > 0 ? "\n" : "") +
			content;

		terminal.scrollTop = terminal.scrollHeight;

		log.style.height =
			(log.scrollHeight > log.clientHeight) ?
				(log.scrollHeight) + "px" : "0px";
	}

	terminal.setContent = (content) => {

		log.innerHTML = content;

		terminal.scrollTop = terminal.scrollHeight;
	}

	terminal.getMark = () => {
		return mark.textContent;
	}

	terminal.setMark = (content) => {
		mark.innerHTML = content + (content.length > 0 ? " " : "") + ">";
	}

	terminal.onSubmit = onSubmit;

	field.onkeydown = (event) => {
		
		if(event.keyCode == 13) {

			if(field.value.trim().length > 0) {

				terminal.history =
					terminal.history.filter(item => item != field.value);

				terminal.history.push(field.value);

				terminal.logContent(terminal.getMark() + " " + field.value);

				terminal.onSubmit(field.value);

				terminal.scrollTop = terminal.scrollHeight;

				field.value = "";

				terminal.current == null;
				terminal.index = null;
			}
		}

		if(event.keyCode == 38) {

			if(terminal.index == 0 || terminal.history.length == 0)
				return;

			if(terminal.index == null) {
				terminal.current = field.value;
				terminal.index = terminal.history.length;
			}

			terminal.index--;

			field.value = terminal.history[terminal.index];
		}

		if(event.keyCode == 40) {

			if(terminal.index == null)
				return;

			if(terminal.index == terminal.history.length - 1) {

				field.value = terminal.current;

				terminal.current == null;
				terminal.index = null;
			}

			else {

				terminal.index++;

				field.value = terminal.history[terminal.index];
			}
		}
	};

	return terminal;
}

function getVSTerminal(paths) {

	let reference = null;
	
	let terminal = getTerminal((command) => {
		vsTerminalOnSubmit(command, reference, terminal.paths.concat([terminal.location]));
	});

	reference = terminal;

	terminal.setLocation = (location) => {

		terminal.location = location;

		terminal.setMark(location);
	};

	terminal.setPaths = (paths) => {
		terminal.paths = paths != null ? paths : [];
	};

	terminal.setLocation("");
	terminal.setPaths(paths);

	return terminal;
}

function vsTerminalOnSubmit(command, terminal, paths) {

	let args = virtualSystem.getCommandArguments(command);

	let mark = terminal.getMark();
	mark = mark.substring(0, mark.length - 1).trim();

	let result = virtualSystem.getAbsolutePath(args[0], mark, paths);

	if(virtualSystem.getResource(result) == null)
		result = virtualSystem.getAbsolutePath(args[0] + ".js", mark, paths);

	result += " " +
		args.slice(1).map((item) => {
			return "\"" + item.split("\"").join("\\\"") + "\"";
		}).join(" ");

	let tempLog = console.log;

	console.log = function() {

		let toLog = "";

		for(let i = 0; i < arguments.length; i++) {
			
			toLog +=
				(i > 0 ? " " : "") +
				(typeof arguments[i] == "object" ?
					JSON.stringify(arguments[i], null, "\t") :
					arguments[i]
				);
		}

		terminal.logContent(toLog);
	}

	try {
		virtualSystem.executeCommand(result);
	}

	catch(error) {
		console.log(error.stack);
	}

	console.log = tempLog;

	Object.keys(require.cache).forEach((key) => {

		if(!(key.startsWith("http://") || key.startsWith("https://")))
			delete require.cache[key];
	});
}

function getTextbox(options) {

	options = options != null ? options : { };

	let data = { tag: "textarea", attributes: { }, style: { } };

	if(!options.spellCheck)
		data.attributes["spellcheck"] = "false";

	if(!options.resize)
		data.style["resize"] = "none";

	if(!options.wrap)
		data.style["white-space"] = "pre";

	let text = vision.create(data);

	if(options.readOnly)
		text.readOnly = true;

	else {

		text.addEventListener(
			"keydown",
			function(event) {
	
				let scrollY = text.scrollTop;
					
				let start = this.selectionStart;
				let end = this.selectionEnd;
	
				if(event.keyCode == 9 || event.which == 9) {
	
					event.preventDefault();
	
					if(start != end) {
	
						let value = text.value.substring(start, end).indexOf("\n");
	
						if(value == -1) {
	
							document.execCommand("insertText", false, "\t");
	
							return;
						}
	
						let startValue = start;
	
						while(start > 0) {
							
							if(text.value.charAt(start) == "\n")
								break;
	
							start--;
						}
	
						this.selectionStart = start;
	
						let insert = text.value.substring(start, end);
	
						if(start == 0) {
	
							if(!event.shiftKey)
								insert = "\t" + insert;
							
							else if(
								insert.charAt(0) == "\t" ||
								insert.charAt(0) == "\n") {
	
								insert = insert.substring(1);
							}
						}
	
						if(event.shiftKey)
							insert = insert.split("\n\t").join("\n");
	
						else
							insert = insert.split("\n").join("\n\t");
	
						let shifted =
							insert !=
							text.value.substring(
								this.selectionStart, this.selectionEnd);
	
						document.execCommand("insertText", false, insert);
	
						this.selectionStart =
							startValue +
							(shifted ?
								(event.shiftKey ? -1 : 1) : 0);
	
						this.selectionEnd = start + insert.length;
					}
					
					else
						document.execCommand("insertText", false, "\t");
				}
	
				if(start != end)
					text.scrollTop = scrollY;

				if(options.onType != null) {

					try {
						options.onType(text.value, text, event);
					}

					catch(error) {
						
					}
				}
			},
			false
		);
	}

	return text;
}

function addTab(tabs, name, content) {

	let tab = vision.create({ content: name, style: { display: "inline" } });
	let pane = vision.create({ content: content, style: { display: "none" } });
	
	pane.tab_id = name;

	tab.onclick = () => {
		setTab(tabs, name);
	}
	
	vision.extend(tabs.children[0], tab);
	vision.extend(tabs.children[1], pane);
}

function setTab(tabs, id) {
	
	Array.from(tabs.children[1].children).forEach((child) => {
		
		if(child.tab_id == id)
			vision.set(child, { style: { display: "block" } });
		
		else
			vision.set(child, { style: { display: "none" } });
	});
}

function getTabs(content, config) {

	content = content != null ? content : [];
	config = config != null ? config : { };

	let menuTabs = vision.create({ style: { position: "absolute", left: "0%", top: "0%", "overflow-x": "auto" } });
	let menu = vision.create({ content: menuTabs, style: { position: "absolute", left: "0%", top: "0%", height: "5%", width: "100%" } });

	let pane = vision.create({ style: { position: "absolute", left: "0%", top: "5%", height: "95%", width: "100%" } });

	let tabs = vision.create({
		content: [menu, pane]
	});

	content.forEach((item) => { addTab(tabs, item.name, item.content); });

	if(content.length > 0)
		setTab(tabs, content[0].name);

	return tabs;
}

module.exports = {
	createStartScreen,
	getTerminal,
	getVSTerminal,
	getTextbox,
	addTab,
	setTab,
	getTabs
};