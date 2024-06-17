var httpUtils = require("kaeon-united")("httpUtils");

function paste(text, title, callback) {

	let response = httpUtils.sendRequest({
		request: {
			method: "POST",
			uri: "https://nearpaste.vercel.app/api/paste"
		},
		headers: {
			"accept": "*/*",
			"accept-language": "en-US,en;q=0.9",
			"content-type": "application/json"
		},
		body: JSON.stringify({
			content: "" + (text != null ? text : ""),
			title: "" + (title != null ? title : "Untitled"),
			isEncrypted: false
		})
	}, callback == null ? null : (response) => {
		
		callback(
			"https://nearpaste.vercel.app/" +
				JSON.parse(response.body).data.id +
				"/raw");
	});

	if(callback == null) {

		return "https://nearpaste.vercel.app/" +
			JSON.parse(response.body).data.id +
			"/raw";
	}
}

module.exports = {
	methods: {
		paste
	},
	interfaces: {
		paste: {
			name: "nearpaste",
			methods: {
				paste
			}
		}
	}
};