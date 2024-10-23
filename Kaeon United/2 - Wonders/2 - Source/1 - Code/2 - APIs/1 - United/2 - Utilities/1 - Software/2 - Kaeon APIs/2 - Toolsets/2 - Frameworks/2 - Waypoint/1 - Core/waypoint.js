var aceUtils = use("kaeon-united")("aceUtils");
var httpUtils = use("kaeon-united")("httpUtils");
var philosophersStone = use("kaeon-united")("philosophersStone");

let adapters = [
	Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{
			tags: ["waypoint", "mongo"],
			standard: (packet) => {

				if(packet.data.context.versions.newContext.actions == null) {

					if(packet.callback != null)
						packet.callback(null);

					return;
				}

				let { MongoClient } = use('mongodb');

				let keys = JSON.parse(packet.data.key);
				let context = packet.data.context.current;
				
				let uri = Object.keys(context.target.locations)[0] +
					"?retryWrites=true&w=majority";

				let dbName = keys[1];
				let collectionName = keys[2];

				(async () => {
					
					let client = new MongoClient(
						uri,
						{ }
					);

					try {

						let variables = aceUtils.getValue(context.module, "Variables");

						let create = aceUtils.getValue(context.actions, "Create");

						let createItems = [];

						if(create != null) {

							Object.values(create).forEach((item) => {

								Object.keys(item).forEach((key) => {

									item[key] = Object.keys(item[key])[0];

									if(variables[key] != null) {

										if(Object.keys(
											variables[key]
										)[0].toLowerCase() == "number") {

											item[key] = Number(item[key]);
										}

										else if(Object.keys(
											variables[key]
										)[0].toLowerCase() == "boolean") {

											item[key] =
												item[key].
													toLowerCase().
													trim() ==
												"true";
										}
									}
								});

								createItems.push(item);
							});
						}

						await client.connect();

						let db = client.db(dbName);
						let collection = await db.createCollection(collectionName);

						await collection.insertMany(createItems);
						
						// STUB !!!
						if(packet.callback != null)
							packet.callback(null);
					}
					
					catch(err) {

						console.error(err);
						
						if(packet.callback != null)
							packet.callback(null);
					}
					
					finally {
						await client.close();
					}
				})();
			}
		}
	),
	Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{
			tags: ["waypoint", "postgres"],
			standard: (packet) => {
				
			}
		}
	),
	Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{
			tags: ["waypoint", "local"],
			standard: (packet) => {
				
			}
		}
	),
	Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{
			tags: ["waypoint", "remote"], // Server - Axis
			standard: (packet) => {
				
			}
		}
	)
];

let context = { }; // Record of module properties
let local = { }; // Internal module ACE DB

function entangle(source, target, mutual) {
	// STUB
}

function query(data, callback) {

	data = aceUtils.formatKaeonACE(data);

	let newContext = queryGet(data);
	let callbackCount = 0;

	Object.keys(newContext).forEach(key => {

		let response = philosophersStone.traverse(philosophersStone.axis).filter(
			tag => philosophersStone.isTagged(tag, ["waypoint"])
		).map(
			stone => {

				callbackCount++;
			
				try {

					return stone.standard({
						data: {
							key: key,
							context: {
								current: Object.assign(
									context[key] != null ?
										JSON.parse(
											JSON.stringify(context[key])
										) :
										{ },
									newContext[key]
								),
								versions: {
									newContext: newContext[key],
									oldContext: context[key]
								}
							}
						},
						callback: callback != null ? (response) => {

							if(response != null)
								querySet(data, key, response);
		
							callbackCount--;

							if(callbackCount == 0) {

								// STUB - ENFORCE RESTRICTIONS !!!
								Object.assign(context, newContext);

								callback(data);
							}
						} : null
					});
				}
	
				catch(error) {
		
					callbackCount--;

					return null;
				}
			}
		).filter(item => item != null)[0];

		if(response != null)
			querySet(data, key, response);
	})
	
	// STUB - ENFORCE RESTRICTIONS !!!
	Object.assign(context, newContext);

	return callback != null ? data : null;
}

function queryGet(data, path, key, target) {

	path = path != null ? path : [];

	if(target != null)
		path.push(key);

	else
		path = [key];

	let components = aceUtils.getValue(data, "components", { });
	let entities = aceUtils.getValue(data, "entities", { });

	let item = Object.assign({ }, context[JSON.stringify(path)]);
	item = item != null ? item : { };

	let module = aceUtils.getValue(components, "module");
	let locations = aceUtils.getValue(components, "locations");
	let access = aceUtils.getValue(components, "access");
	let actions = aceUtils.getValue(components, "actions");

	if(module != null)
		item.module = module;

	if(actions != null)
		item.actions = actions;

	let modules = { };

	if(module != null) {

		target = JSON.parse(JSON.stringify(target != null ? target : { }));

		if(access != null)
			target.access = access;

		if(locations != null)
			target.locations = locations;

		item.target = target;

		modules[JSON.stringify(path)] = item;
	}

	Object.keys(entities).forEach(
		key => {

			Object.assign(
				modules,
				queryGet(
					entities[key],
					JSON.parse(JSON.stringify(path)),
					key,
					target
				)
			);
		}
	);

	return modules;
}

function querySet(data, id, item, path, key, target) {

	path = path != null ? path : [];

	if(target)
		path.push(key);

	else
		path = [key];

	if(JSON.stringify(path) == id) {

		Object.keys(data).forEach(i => delete data[i]);
		Object.assign(data, item);

		return;
	}

	let components = aceUtils.getValue(data, "components", { });
	let entities = aceUtils.getValue(data, "entities", { });

	if(aceUtils.getValue(components, "module") != null)
		target = true;

	Object.keys(entities).forEach(
		key => {

			querySet(
				entities[key],
				id,
				item,
				JSON.parse(JSON.stringify(path)),
				key,
				target
			)
		}
	);
}

function subscribe(path, callback) {
	// STUB
}

philosophersStone.connect(philosophersStone.axis, adapters, [], true);

module.exports = {
	adapters,
	context,
	entangle,
	query,
	queryGet,
	querySet,
	subscribe,
	local
};