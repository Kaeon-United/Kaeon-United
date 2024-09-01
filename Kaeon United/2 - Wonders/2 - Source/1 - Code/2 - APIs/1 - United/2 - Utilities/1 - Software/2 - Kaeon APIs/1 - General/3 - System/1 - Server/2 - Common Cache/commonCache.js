var httpUtils = use("kaeon-united")("httpUtils");
var openAxis = use("kaeon-united")("openAxis");
var philosophersStone = use("kaeon-united")("philosophersStone");

function commonCache() {
	
	return Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{
			standard: (packet) => {
		
				if(!openAxis.isHTTPJSON(packet))
					return;
		
				this.pool = this.pool != null ? this.pool : { };
		
				let args = httpUtils.getURLArguments(packet.request.uri);
				
				if(args["key"] != null) {
		
					if(args["value"] != null) {
		
						this.pool[args["key"]] = {
							value: args["value"],
							time: (new Date()).getTime()
						};
					}
		
					return {
						body: this.pool[args["key"]] != null ?
							JSON.stringify(this.pool[args["key"]]) : "null",
						priority: 1
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