var state = { };

var subscriptions = { };
var subscriptionCount = 0;

function create(path) {

	let object = get(path);
	let key = "c_";

	while(object[key] != null)
		key = ("c_" + Math.random()).split(".").join("");

	return key;
}

function get(path, object) {

	if(path.length == 0)
		return state;

	object = object != null ? object : state;

	if(object[path[0]] == undefined)
		object[path[0]] = { };

	if(path.length == 1)
		return object[path[0]];

	return get(path.slice(1), object[path[0]]);
}

function set(path, value) {

	let pathString = JSON.stringify(path);
	pathString = pathString.substring(0, pathString.length - 1);

	let subscribed = Object.values(subscriptions).filter((item) => {
		return JSON.stringify(item.path).startsWith(pathString);
	});

	let previous = subscribed.map((item) => {
		return JSON.parse(JSON.stringify(get(item.path)));
	});

	get(path.slice(0, path.length - 1))[path[path.length - 1]] = value;

	subscribed.forEach((item, index) => {
		item.operation(previous[index], get(item.path));
	});
}

function subscribe(path, operation) {

	subscriptions["" + subscriptionCount] = {
		path: path,
		operation: operation
	};

	subscriptionCount++;

	return subscriptionCount - 1;
}

function unsubscribe(id) {

	if(subscriptions["" + id] != null)
		delete subscriptions["" + id];
}

module.exports = {
	create,
	get,
	set,
	subscribe,
	unsubscribe
};