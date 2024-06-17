var io = require("kaeon-united")("io");
var vision = require("kaeon-united")("vision");

function getData(item) {

	let data = {
		text: item.data.body != null ?
			item.data.body :
			""
	};

	let replies = item.data.replies;

	if(typeof replies != "object")
		return data;

	replies = replies.data.children;

	if(replies.length == 0)
		return data;

	data.responses = [];

	replies.forEach(reply => {
		data.responses.push(getData(reply));
	});

	return data;
}

function getForums() {

	return [... new Set(Array.from(vision.create({
		fields: { innerHTML:
			io.open(
				"https://www.reddit.com/r/ListOfSubreddits/wiki/listofsubreddits/"
			)
		}
	}).querySelectorAll("a")).map(
		item => item.href
	).filter(
		item => item.includes("/r/")
	).map(
		item => item.substring(item.lastIndexOf("/") + 1)
	).filter(
		item => item.length > 0 && !item.includes("#")
	).sort())];
}

function getPrompt(item) {

	item = item.data.children[0];

	return item.kind == "t3" ? item.data.title : item.data.body;
}

function getSite() {

	let data = [];

	getForums().forEach(forum => {
	
		getThreads(forum).forEach(thread => {
			data.push(getThread(thread + ".json"));
		});
	});

	return data;
}

function getThread(url) {

	try {
	
		let source = JSON.parse(io.open(url));

		let data = { text: getPrompt(source[0]) };

		if(source[1].data.children.length > 0) {

			data.responses = [];
		
			source[1].data.children.forEach(item => {
				data.responses.push(getData(item));
			});
		}
	
		return data;
	}

	catch(error) {
		return { text: "", responses: [] };
	}
}

function getThreads(forum) {

	try {

		return JSON.parse(io.open(
			"https://www.reddit.com/r/" +
				forum +
				"/new/.json"
		)).data.children.map(
			item => item.data.url
		).filter(
			item => item.startsWith("https://www.reddit.com/r/")
		);
	}

	catch(error) {
		return [];
	}
}

module.exports = {
	methods: {
		getForums,
		getSite,
		getThread,
		getThreads
	},
	interfaces: {
		forum: {
			name: "reddit",
			methods: {
				getForums,
				getSite,
				getThread,
				getThreads
			}
		}
	}
};