var one = require("kaeon-united")("one");

function getItem(element, item, defaultOption) {

	if(one.get(element, item).length > 0)
		return one.get(element, item)[0].children[0].content;

	return defaultOption;
}

module.exports = {
	getItem
};