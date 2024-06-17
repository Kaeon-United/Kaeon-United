function getPlatform() {

	if(typeof process === 'object') {

		if(typeof process.versions === 'object') {

			if(typeof process.versions.node !== 'undefined') {
				return "node";
			}
		}
	}

	return "browser";
}

module.exports = {
	getPlatform
};