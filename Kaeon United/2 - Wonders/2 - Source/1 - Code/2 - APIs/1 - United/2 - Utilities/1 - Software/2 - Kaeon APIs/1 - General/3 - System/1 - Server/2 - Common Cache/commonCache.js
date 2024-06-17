var httpUtils = require("kaeon-united")("httpUtils");
var openAxis = require("kaeon-united")("openAxis");
var philosophersStone = require("kaeon-united")("philosophersStone");

function commonCache() {
	
	return Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{
			standard: (packet) => {
		
				if(!openAxis.isHTTPJSON(packet))
					return;
		
				this.pool = this.pool != null ? this.pool : { };
		
				let args = httpUtils.getURLArguments(packet.request.uri);

				console.log(packet.request.uri, args);
				
				if(args["key"] != null) {
		
					if(args["value"] != null) {
		
						this.pool[args["key"]] = {
							value: args["value"],
							time: (new Date()).getTime()
						};
					}
		
					return {
						body: this.pool[args["key"]] != null ?
							JSON.stringify(this.pool[args["key"]]) : "null"
					};
				}
			},
			tags: ["axis", "common-cache"]
		}
	);
}

module.exports = {
	commonCache
};