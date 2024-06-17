var httpUtils = require("kaeon-united")("httpUtils");

var models = [
	"art",
	"drawing",
	"none",
	"photo"
];

function generateImages(prompt, options, callback) {

	options = options != null ? options : { };
	options.model = options.model != null ? options.model : "none";

	let body = {
		prompt: prompt,
		version: "35s5hfwn9n78gb06",
		token: null,
		model: options.model,
		"negative_prompt": ""
	};

	let response = httpUtils.sendRequest({
		request: {
			method: "POST",
			uri: "https://api.craiyon.com/v3"
		},
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(body)
	}, callback != null ? (response) => {

		callback(JSON.parse(response.body).images.map((item) => {
			return "https://img.craiyon.com/" + item
		}));
	} : null);

	if(callback == null) {

		return JSON.parse(response.body).images.map((item) => {
			return "https://img.craiyon.com/" + item
		});
	}
}

module.exports = {
	methods: {
		models,
		generateImages
	},
	interfaces: {
		generator: {
			name: "craiyon",
			methods: {
				models,
				generateImages
			}
		}
	}
};