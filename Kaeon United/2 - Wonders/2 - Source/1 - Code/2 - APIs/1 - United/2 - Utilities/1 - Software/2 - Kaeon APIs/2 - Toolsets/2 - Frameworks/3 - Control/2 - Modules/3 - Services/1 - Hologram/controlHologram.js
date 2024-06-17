var httpUtils = require("kaeon-united")("httpUtils");

function getCalls(credentials, cutoff, callback) {

	return JSON.parse(
		httpUtils.sendRequest({
			request: {
				method: "GET",
				uri: "https://dashboard.hologram.io/api/1/csr/rdm/?apikey=" +
					credentials.apiKey +
					"&orgid=" +
					credentials.orgID
			}
		}).body
	).data.filter((item) => {

		if(cutoff == null)
			return true;

		let itemCutoff = (new Date(item.logged)).getTime();

		if(typeof cutoff == "number")
			return itemCutoff >= cutoff * 1000;

		let cutoffTime = new Date("" + cutoff);

		if(!(cutoffTime instanceof Date && !isNaN(cutoffTime)))
			return false;

		return itemCutoff >= cutoffTime.getTime();
	}).map((item) => {

		return {
			data: (new Buffer(JSON.parse(item.data).data, 'base64')).
				toString('ascii'),
			time: (new Date(item.logged)).getTime() / 1000
		};
	});
};

function sendCall(credentials, message, callback) {

	return httpUtils.sendRequest({
		request: {
			method: "POST",
			uri: "https://dashboard.hologram.io/api/1/devices/messages/" +
				credentials.deviceID +
				"/" +
				credentials.webhookGUID
		},
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"data": JSON.stringify(message)
		})
	});
};

module.exports = {
	getCalls,
	sendCall
};