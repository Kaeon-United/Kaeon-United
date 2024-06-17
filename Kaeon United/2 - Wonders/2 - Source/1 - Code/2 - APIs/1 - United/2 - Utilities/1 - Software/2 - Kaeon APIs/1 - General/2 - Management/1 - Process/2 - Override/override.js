var defaultFetch = window.fetch;
var DefaultXMLHttpRequest = window.XMLHttpRequest;

function onLog(callback) {
	console.log = callback;
}

function onSend(callback) {

	window.XMLHttpRequest = class extends DefaultXMLHttpRequest {

		constructor() {

			super();

			this.request = {
				request: {
					method: "",
					uri: ""
				},
				headers: {

				},
				body: null
			};
		}

		open(method, uri, sync) {

			this.request.request.method = method;
			this.request.request.uri = uri;

			super.open(method, uri, sync);
		}

		setRequestHeader(name, value) {

			this.request.headers[name] = value;

			super.setRequestHeader(name, value);
		}

		send(body) {

			this.request.body = body;

			let response = callback(this.request);

			if(response != null) {

				Object.defineProperty(this, 'readyState', {
					value: 4,
					writable: true
				});

				Object.defineProperty(this, 'status', {
					value: 200,
					writable: true
				});

				Object.defineProperty(this, 'responseText', {
					value: "" + response,
					writable: true
				});

				if(this.onreadystatechange != null)
					this.onreadystatechange();
			}

			else
				super.send(body);
		}
	}

	window.fetch = (uri, options) => {

		options = options != null ? options : { };

		let request = {
			request: { method: options.method != null ? options.method : "GET", uri: uri },
			headers: options.headers,
			body: options.body
		}

		let response = callback(request);

		return callback == null ?
			defaultFetch(url, options) :
			new Promise(
				(resolve) => {
					resolve({ text: () => { return response; } });
				}
			);
	}
}

module.exports = {
	onLog,
	onSend
};