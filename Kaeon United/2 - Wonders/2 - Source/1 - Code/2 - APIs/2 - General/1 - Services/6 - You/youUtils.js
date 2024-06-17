var moduleDependencies = {
	marked: "https://cdn.jsdelivr.net/npm/marked/marked.min.js"
};

var io = require("kaeon-united")("io");
var tokenizer = require("kaeon-united")("tokenizer");
var vision = require("kaeon-united")("vision");

vision.load(moduleDependencies.marked);

function chat(query, callback) {
	
	if(typeof query == "string")
		query = { text: query, chat: [] };

	query.text = query.text != null ? "" + query.text : "";

	if(query.chat == null)
		query.chat = [];

	else if(!Array.isArray(query.chat))
		query.chat = [];

	if(query.chat.length % 2 == 1)
		query.chat.push("");

	let chat = [];

	for(let i = 0; i < query.chat.length; i += 2) {

		chat.push({
			question: query.chat[i],
			answer: query.chat[i + 1]
		});
	}

	let response = io.open(
		"https://you.com/api/streamingSearch?domain=youchat&q=" +
			encodeURIComponent(query.text) +
			"&chat=" +
			encodeURIComponent(JSON.stringify(chat)),
		callback != null ? (response) => {

			let text = parseResponse(response);

			callback({
				text: text,
				chat: query.chat.concat([query.text, text])
			});
		} : null,
		false
	);
	
	if(callback == null) {

		let text = parseResponse(response);
	
		return {
			text: text,
			chat: query.chat.concat([query.text, text])
		};
	}
}

function clean(text) {
	
	let results = {
		raw: text,
		clean: vision.create({
			fields: {
				innerHTML: marked.parse(text)
			}
		}).textContent.split(/ \[\d+\]/).join(""),
		text: "",
		items: { links: [], code: [] }
	};

	let tokens = tokenizer.tokenize([
		"[[",
		"]]",
		"(",
		")",
		"```"
	], text.trim());

	for(let i = 0; i < tokens.length; i++) {
		
		if(tokens[i] == "[[") {
			
			let link = "";
			let count = 1;

			let j = i + 4;

			for(; j < tokens.length && count > 0; j++) {
				
				if(tokens[j] == "(")
					count++;

				if(tokens[j] == ")")
					count--;

				if(count > 0)
					link += tokens[j];
			}

			results.items.links.push({
				index: results.text.length,
				content: link
			});

			i = j - 1;
		}
		
		else if(tokens[i] == "```") {
			
			let code = "";

			let j = i + 1;

			for(; j < tokens.length; j++) {
				
				if(tokens[j] == "```")
					break;

				code += tokens[j];
			}

			results.items.code.push({
				index: results.text.length,
				content: code.trim()
			});

			i = j;
		}

		else {

			if(results.text.endsWith(" ") && tokens[i].startsWith(" "))
				tokens[i] = tokens[i].substring(1);

			results.text += tokens[i];
		}
	}

	results.text = results.text.replace(/\s+([.,!":])/g, "$1");

	return results;
}

function concatResults(results, response, object, list) {

	return results.concat(
		response.trim().split("\n\n").map(item => {
			
			item = item.split("\n");
			
			if(item[0] != "event: thirdPartySearchResults")
				return [];

			return JSON.parse(
				item[1].trim().substring(5).trim()
			)[object][list].map(item => item.url);
		}).flat()
	);
}

function parseResponse(data) {

	return data.trim().split("\n\n").map(item => {

		let lines = item.split("\n");

		if(lines[0].trim() != "event: youChatToken")
			return "";

		return JSON.parse(lines[1].trim().substring(6).trim()).youChatToken;
	}).join("");
}

function search(query, limit, callback) {

	return searchExecute(
		query, limit, callback, 10, "search", "search", "third_party_search_results"
	);
}

function searchExecute(query, limit, callback, increment, domain, object, list) {

	let pages = Math.ceil((limit != null ? limit : increment) / increment);

	let results = [];
	let count = 0;

	for(let i = 0; i < pages; i++) {

		let response = io.open(
			"https://you.com/api/streamingSearch?q=" +
				encodeURIComponent(query) +
				"&page=" +
				i +
				"&count=" +
				(pages * increment) +
				"&domain=" +
				domain,
			callback != null ? (response) => {

				results = concatResults(results, response, object, list);
				count++;

				if(count == pages)
					callback(results);
			} : null,
			false
		);

		if(callback == null)
			results = concatResults(results, response, object, list);
	}

	if(callback == null)
		return results.slice(0, limit < results.length ? limit : results.length);

}

function searchImages(query, limit, callback) {

	return searchExecute(
		query, limit, callback, 30, "image", "image", "results"
	);
}

module.exports = {
	methods: {
		chat,
		clean,
		parseResponse,
		search,
		searchImages
	},
	interfaces: {
		chat: {
			name: "you",
			methods: {
				chat,
				clean
			}
		},
		search: {
			name: "you",
			methods: {
				search: search,
				searchImages: searchImages
			}
		}
	}
};