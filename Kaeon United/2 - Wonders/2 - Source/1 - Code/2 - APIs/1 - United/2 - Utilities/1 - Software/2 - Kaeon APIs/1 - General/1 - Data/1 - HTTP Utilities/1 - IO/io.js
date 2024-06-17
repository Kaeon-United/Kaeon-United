var httpUtils = require("kaeon-united")("httpUtils");
var platform = require("kaeon-united")("platform").getPlatform();

module.exports = {
	cors: httpUtils.cors,
	getInput: platform == "node" ?
		(query) => {

			return require('readline-sync').question(
				query != null ? query : ""
			);
		} :
		(query) => {
			return prompt("" + (query != null ? query : ""));
		},
	open: (file, callback, cors) => {

		if(typeof file == "function") {
				
			let input = document.createElement("input");
	
			input.setAttribute("type", "file");
			input.setAttribute("style", "display: none");
	
			let listener = function(event) {
	
				let upload = event.target.files[0];
	
				if(!upload)
					return;
				
				let reader = new FileReader();
	
				reader.onload = function(event) {
					file(event.target.result, upload.name);
				};
	
				reader.readAsText(upload);
			}
	
			input.addEventListener(
				'change',
				listener,
				false
			);
	
			document.documentElement.appendChild(input);
	
			input.click();
	
			document.documentElement.removeChild(input);

			return;
		}

		if(platform != "node" ||
			file.toLowerCase().startsWith("http://") ||
			file.toLowerCase().startsWith("https://")) {

			let response = httpUtils.sendRequest(
				{
					request: {
						method: "GET",
						uri: file
					}
				},
				callback != null ? (response) => {
					callback(response.body);
				} : null,
				cors != false ?
					(typeof cors == "function" ?
						cors : module.exports.cors
					) : false
			);

			if(callback == null)
				return response.body;
		}

		else if(callback == null)
			return require("fs").readFileSync(file, "utf-8");

		else {

			require("fs").readFile(file, null, (error, data) => {

				if(error != null)
					callback("");

				callback(data);
			});
		}
	},
	save: platform == "node" ?
		(content, file) => {
			require('fs').writeFileSync(file, content);
		} :
		(content, file) => {

			let element = document.createElement('a');
		
			element.setAttribute(
				'href',
				'data:text/plain;charset=utf-8,' +
					encodeURIComponent(content));
		
			element.setAttribute('download', file);
		
			element.style.display = 'none';
			document.documentElement.appendChild(element);
		
			element.click();
		
			document.documentElement.removeChild(element);
		}
};