var aceUtils = use("kaeon-united")("aceUtils");
var formatConverter = use("kaeon-united")("formatConverter");
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

						let variables = aceUtils.getValue(
							context.module, "Variables"
						);

						let create = aceUtils.getValue(
							context.actions, "Create"
						);

						let read = aceUtils.getValue(
							context.actions, "Read"
						);

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

						let query = null;
						let response = [];

						if(read != null) {

							query = { };

							let filter = aceUtils.getValue(read, "Filter");

							if(filter != null) {
								
								Object.keys(filter).forEach(key => {
									query[key] = getMongoQuery(filter[key]);
								});
							}
						}

						await client.connect();

						let db = client.db(dbName);
						let collection = await db.createCollection(
							collectionName
						);

						if(createItems.length > 0)
							await collection.insertMany(createItems);

						if(query != null)
							response = await collection.find(query).toArray();

						let data = { };

						response.forEach((item, index) => {

							if(item["_id"] != null)
								delete item["_id"];

							data["" + (index + 1)] = (
								formatConverter.oneToJSON(
									formatConverter.jsonToONE(item)
								)
							);
						});
						
						// STUB !!!
						if(packet.callback != null)
							packet.callback(data);
					}
					
					catch(error) {

						console.log(error);
						
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

// STUB
function getMongoQuery(query) {

	if(Object.keys(query).length == 1) {

		if(Object.keys(query[Object.keys(query)[0]]).length == 0) {

			if(isNaN(Object.keys(query)[0]))
				return Object.keys(query)[0];
	
			return Number(Object.keys(query)[0]);
		}
	}

	let result = { };

	Object.keys(query).forEach(key => {

		if(key.toLowerCase() == "greater")
			result["$gt"] = getMongoQuery(query[key]);

		if(key.toLowerCase() == "less")
			result["$lt"] = getMongoQuery(query[key]);
	});

	return result;
}

function getEntity(data, key) {

	if(typeof key == "string")
		key = JSON.parse(key);

	if(key.length == 0)
		return data;

	let entity = null;
	let entities = aceUtils.getValue(data, "entities");

	if(entities != null)
		entity = aceUtils.getValue(entities, key[0]);

	if(entity == null)
		entity = aceUtils.getValue(data, key[0]);

	if(entity == null)
		return null;

	return getEntity(entity, key.slice(1));
}

function query(data, callback) {

	data = aceUtils.formatKaeonACE(data);

	let newContext = queryGet(data);
	let callbackCount = 0;

	Object.keys(newContext).forEach(key => {

		let response = philosophersStone.traverse(
			philosophersStone.axis
		).filter(
			tag => philosophersStone.isTagged(tag, ["waypoint"])
		).map(
			stone => {
			
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

							if(response != null) {

								let entity = getEntity(data, key);

								if(entity != null) {

									let components = aceUtils.getValue(
										entity, "components"
									);

									if(components == null) {

										entity.Components = { };

										components = entity.Components;
									}

									components["Content"] = response;
								}
							}
		
							callbackCount++;

							if(callbackCount ==
								Object.keys(newContext).length) {

								// STUB - ENFORCE RESTRICTIONS !!!
								Object.assign(context, newContext);

								callback(data);
							}
						} : null
					});
				}
	
				catch(error) {

					console.log(error);
		
					callbackCount++;

					return null;
				}
			}
		).filter(item => item != null)[0];

		// if(response != null)
		// 	querySet(data, key, response);

		if(response != null) {

			let entity = getEntity(data, key);

			let components = aceUtils.getValue(
				entity, "components"
			);

			if(components == null) {

				entity.Components = { };
				
				components = entity.Components;
			}

			if(components != null)
				components["Content"] = response;
		}
	});
	
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
	}

	item.target = target;

	if(module != null || actions != null)
		modules[JSON.stringify(path)] = item;

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
	getEntity,
	getMongoQuery,
	query,
	queryGet,
	querySet,
	subscribe,
	local
};