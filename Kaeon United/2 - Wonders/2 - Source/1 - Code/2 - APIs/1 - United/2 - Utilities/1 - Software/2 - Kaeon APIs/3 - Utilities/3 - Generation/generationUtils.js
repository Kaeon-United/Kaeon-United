var chat = require("kaeon-united")("generalReference")("chat");
var io = require("kaeon-united")("io");
var paste = require("kaeon-united")("generalReference")("paste");

function get(language, prompt, callback) {

	let response = chat.chat(
		"Write me the " +
			language +
			" code for the following: " +
			prompt,
		callback != null ? (response) => {

			callback(
				chat.clean(response.text).
					items.code.map(
						item => item.content
					).join("\n")
			);
		} : null
	);

	if(callback == null) {

		return chat.clean(response.text).
			items.code.map(
				item => item.content
			).join("\n");
	}
}

function publish(type, text, title, callback) {

	let result = get(type, text, callback != null ? (code) => {

		paste.paste(code, title, (url) => {

			callback([
				url,
				io.open(
					"https://tinyurl.com/api-create.php?url=" +
						encodeURIComponent(url) +
						(title != null ?
							("&alias=" + encodeURIComponent(title)) :
							"")
				)
			]);
		});
	} : null);

	if(callback == null) {

		let url = paste.paste(result, title);
	
		return [
			url,
			io.open(
				"https://tinyurl.com/api-create.php?url=" +
					encodeURIComponent(url) +
					(title != null ?
						("&alias=" + encodeURIComponent(title)) :
						"")
			)
		];
	}
}

module.exports = {
	get,
	publish
};