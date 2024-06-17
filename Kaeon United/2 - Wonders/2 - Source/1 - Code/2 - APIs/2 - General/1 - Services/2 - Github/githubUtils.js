var io = require("kaeon-united")("io");

function deleteItemGithub(path, credentials) {
	// STUB
}

function getAddressGithub(path, credentials) {

	if(path.length < 3)
		return null;
	
	return "https://raw.githubusercontent.com/" +
		path[0].split(" ").join("-") +
		"/" +
		path[1].split(" ").join("-") +
		"/master/" +
		path.slice(2).map((item) => {
			return item.split(" ").join("%20");
		}).join("/");
}

function getBranchesGithub(path, credentials) {

	let address = getAddressGithub(path, credentials);

	if(address == null)
		return null;

	return io.open(address);
}

function getItemGithub(path, credentials) {
	
	let address = getAddressGithub(path, credentials);

	if(address == null)
		return null;

	return io.open(address);
}

function getItemsGithub(path, credentials) {

	if(path.length == 0)
		return [];

	if(path.length == 1) {
		// STUB
	}

	else {

		let data = JSON.parse(io.open(
			"https://api.github.com/repos/" +
			path[0].split(" ").join("-") +
			"/" +
			path[1].split(" ").join("-") +
			"/git/trees/" +
			"master" + // STUB
			"?recursive=1"
		)).tree;

		let location = path.slice(2).join("/").toLowerCase();

		let items = data.filter((item) => {

			if(item.path.length < location.length + 1)
				return false;

			if(item.path.substring(location.length + 1).indexOf("/") != -1)
				return false;

			return item.path.toLowerCase().startsWith(location);
		});

		return {
			folders: items.filter((item) => {
				return item.type == "tree";
			}).map((item) => {
				
				if(item.path.indexOf("/") == -1)
					return item.path;

				return item.path.substring(item.path.lastIndexOf("/") + 1);
			}).sort(),
			files: items.filter((item) => {
				return item.type == "blob";
			}).map((item) => {
				
				if(item.path.indexOf("/") == -1)
					return item.path;

				return item.path.substring(item.path.lastIndexOf("/") + 1);
			}).sort()
		};
	}
}

function getVersionsGithub(path, credentials) {
	// STUB
}

function setItemGithub(path, credentials, content) {
	// STUB
}

module.exports = {
	methods: {
		deleteItemGithub,
		getAddressGithub,
		getBranchesGithub,
		getItemGithub,
		getItemsGithub,
		getVersionsGithub,
		setItemGithub
	},
	interfaces: {
		repo: {
			name: "github",
			methods: {
				deleteItem: deleteItemGithub,
				getAddress: getAddressGithub,
				getBranches: getBranchesGithub,
				getItem: getItemGithub,
				getItems: getItemsGithub,
				getVersions: getVersionsGithub,
				setItem: setItemGithub
			}
		}
	}
};