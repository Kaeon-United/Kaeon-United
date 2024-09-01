var formatConverter = use("kaeon-united")("formatConverter");
var io = use("kaeon-united")("io");
var one = use("kaeon-united")("one");
var onePlus = use("kaeon-united")("onePlus");

function clearComponents(target, source, clone) {

	if(clone)
		target = JSON.parse(JSON.stringify(target));

	Object.keys(target).forEach((key) => {

		if(getValue(source, key) != null)
			delete target[key];
	});

	return target;
}

function clearEntity(target, source, clone, extra) {

	if(clone)
		target = JSON.parse(JSON.stringify(target));

	[target, source].forEach(item => formatEntity(item));

	let targetEntities = getValue(target, "entities");
	let sourceEntities = getValue(source, "entities");

	clearComponents(
		getValue(target, "components"),
		getValue(source, "components")
	);
		
	Object.keys(target).forEach((key) => {
		
		if(getValue(source, key) != null &&
			key.toLowerCase().trim() != "entities" &&
			key.toLowerCase().trim() != "components") {

			delete target[key];
		}
	});
			
	Object.keys(targetEntities).forEach((key) => {

		if(getValue(sourceEntities, key) != null)
			delete targetEntities[key];

		else {

			clearEntity(
				getValue(targetEntities, key),
				getValue(sourceEntities, key)
			);
		}
	});

	return target;
}

function formatDocument(document, open) {

	let result = formatDocumentContent(document, open);

	return !hasUse(result) ? { use: result } : result;
}

function formatDocumentContent(document, open) {

	open = open != null ? open : (path) => {
		return io.open(path).split("\r").join("");
	};

	if(typeof document == "string") {

		document = document.split("\r").join("");

		if((document.startsWith("http://") ||
			document.startsWith("https://")) &&
			!document.includes("\n")) {

			return formatDocument(open(document));
		}

		try {

			return formatConverter.oneToJSON(
				formatConverter.jsonToONE(JSON.parse(document))
			);
		}

		catch(error) {
			result = formatConverter.oneToJSON(onePlus.read(document));
		}
	}

	if(isONE(document))
		return formatConverter.oneToJSON(document);

	return formatConverter.oneToJSON(formatConverter.jsonToONE(document));
}

function formatEntity(entity) {

	if(getValue(entity, "components") == null)
		entity.components = { };

	if(getValue(entity, "entities") == null)
		entity.entities = { };

	return entity;
}

function formatKaeonACE(document, reference, open, globalMap, meta, alias) {

	open = open != null ? open : (path) => {
		return io.open(path).split("\r").join("");
	};

	if(reference != null)
		document = formatReference(document, reference, open);

	if(typeof document == "string")
		document = useACE(document);

	formatEntity(document);

	globalMap = globalMap != null ? globalMap : { };
	meta = meta != null ? JSON.parse(JSON.stringify(meta)) : { };

	let components = getValue(document, "components");
	let entities = getValue(document, "entities");

	let voidComponent = getValue(components, "void");
	
	if(voidComponent != null) {

		if(Object.keys(voidComponent).length == 0)
			meta = { };

		else {

			Object.keys(voidComponent).forEach((key) => {
				removeValue(components, key);
			});
		}
	}

	overlayComponents(
		components,
		overlayComponents(
			meta,
			getValue(components, "meta") != null ?
				getValue(components, "meta") : { }
		),
		false,
		true
	);

	overlayEntity(
		document,
		queryKaeonACE(
			getValue(components, "ace") != null ?
				getValue(components, "ace") : { },
			reference,
			open
		)
	);

	if(getValue(components, "meta") != null)
		removeValue(components, "meta");

	if(alias != null) {

		if(globalMap[alias] == null)
			globalMap[alias] = { components: { }, entities: [] };

		overlayComponents(globalMap[alias].components, components);

		globalMap[alias].entities.push(document);
	}

	Object.keys(entities).forEach(
		key => formatKaeonACE(entities[key], reference, globalMap, open, meta, key)
	);

	if(alias == null) {
		
		Object.values(globalMap).forEach((item) => {

			item.entities.forEach((entity) => {
				overlayComponents(entity, item.components, false, true);
			});
		});
	}

	if(getValue(document, "entities") == null &&
		getValue(document, "components") == null) {

		return useACE(document);
	}

	return document;
}

function formatReference(document, reference, open, nest) {

	if(!nest) {
		
		document = formatDocument(document);

		if(typeof reference == "string")
			reference = getReference(reference);

		else if(Array.isArray(reference)) {

			reference = Object.assign(
				{ },
				...reference.map(
					item => typeof item == "string" ? getReference(item) : item
				)
			);
		}
	}

	Object.keys(document).forEach(key => {

		let value = document[key];
		
		if(key.toLowerCase() == "use" && value != null) {

			formatEntity(value);
			
			Object.keys(value).forEach(key => {

				let source = reference[key];

				if(source != null)
					overlayEntity(value, formatKaeonACE(open(source)));
			});

			return;
		}

		formatReference(value, reference, open, true);
	});

	return document;
}

function getReferenceACE(document, alias) {

	let reference = { };

	if(document == null)
		return reference;

	let entities = getValue(document, "entities", { });

	Object.keys(entities).forEach((key) => {
		Object.assign(reference, getReferenceACE(entities[key], key));
	});

	let locations =
		getValue(getValue(document, "components", { }), "locations");

	if(locations != null) {

		if(Object.keys(locations).length > 0)
			reference[alias] = Object.keys(locations)[0];
	}

	return reference;
}

function getReference(document, nest) {

	let reference = { };

	if(!nest)
		document = useACE(document);

	Object.values(getValue(document, "entities", { })).forEach((value) => {
		Object.assign(reference, getReference(value, true));
	});

	Object.assign(
		reference,
		getReferenceACE(
			getValue(getValue(document, "components", { }), "ace")
		)
	);

	return reference;
}

function getUsage(document) {

	let usage = [];

	Object.keys(document).forEach((key) => {
		
		if(key.toLowerCase().trim() == "use")
			usage.push(document[key]);

		else
			usage = usage.concat(getUsage(document[key]));
	});

	return usage;
}

function getValue(object, key, standard) {

	if(typeof object != "object" || object == null)
		return standard;

	let value = object[Object.keys(object).filter(
		item => item.toLowerCase().trim() == key.toLowerCase().trim()
	)[0]];

	return value != null ? value : standard;
}

function hasUse(element) {

	let keys = Object.keys(element);

	if(keys.map(key => key.trim().toLowerCase()).includes("use"))
		return true;

	for(let i = 0; i < keys.length; i++) {

		if(hasUse(element[keys[i]]))
			return true;
	}

	return false;
}

function isONE(element) {

	try {

		one.write(element);

		return true;
	}

	catch(error) {
		return false;
	}
}

function overlayComponents(target, source, clone, priority) {

	if(clone) {
		target = JSON.parse(JSON.stringify(target));
		source = JSON.parse(JSON.stringify(source));
	}

	Object.keys(source).forEach((key) => {

		if(getValue(target, key) == null)
			target[key] = getValue(source, key);

		else if(!priority)
			Object.assign(getValue(target, key), getValue(source, key));
	});

	return target;
}

function overlayEntity(target, source, clone, extra) {

	if(clone) {
		target = JSON.parse(JSON.stringify(target));
		source = JSON.parse(JSON.stringify(source));
	}

	[target, source].forEach(item => formatEntity(item));

	let targetEntities = getValue(target, "entities");
	let sourceEntities = getValue(source, "entities");

	overlayComponents(
		getValue(target, "components"),
		getValue(source, "components")
	);

	let entities = { };

	Object.assign(entities, sourceEntities);

	if(extra) {
		
		Object.keys(source).forEach((key) => {
			
			if(entities[key] == null &&
				key.toLowerCase().trim() != "entities" &&
				key.toLowerCase().trim() != "components") {

				entities[key] = source[key];
			}
		});
	}
			
	Object.keys(entities).forEach((key) => {

		if(getValue(targetEntities, key) == null)
			targetEntities[key] = getValue(entities, key);

		else {

			overlayEntity(
				getValue(targetEntities, key),
				getValue(entities, key)
			);
		}
	});

	return target;
}

function queryKaeonACE(entity, reference, open) {

	formatEntity(entity);

	let components = getValue(entity, "components");
	let entities = getValue(entity, "entities");

	let result = { entities: { }, components: { } };

	if(getValue(components, "reserve") != null)
		return result;

	if(getValue(components, "meta") != null) {

		if(getValue(getValue(components, "meta"), "reserve") != null)
			return result;
	}

	Object.values(entities).forEach(
		entity => overlayEntity(result, queryKaeonACE(entity, reference, open))
	);

	Object.keys(entity).forEach(key => {

		if(key.toLowerCase() != "entities" &&
			key.toLowerCase() != "components") {

				overlayEntity(
					result,
					queryKaeonACE(entity[key], reference, open)
				);
		}
	});

	let locations = getValue(components, "locations");
	
	locations = locations != null ?
		Object.keys(locations) : [];

	if(locations.length > 0) {

		overlayEntity(
			result,
			formatKaeonACE(open(locations[0]), reference),
			false,
			true
		);
	}

	let multiselect = getValue(components, "multiselect") != null;

	// STUB - Path / Multiselect

	return result;
}

function removeValue(object, key) {

	delete object[Object.keys(object).filter(
		item => item.toLowerCase().trim() == key.toLowerCase().trim()
	)[0]];
}

function traceKaeonACE(document, criteria, alias) {

	let components = getValue(document, "components");
	let entities = getValue(document, "entities");

	let aliasMatch = false;

	if(criteria[0].alias != null && alias != null) {

		aliasMatch =
			criteria[0].alias.trim().toLowerCase() ==
				alias.trim().toLowerCase();
	}

	if(criteria[0].alias == null || aliasMatch) {

		if(criteria[0].filter != null ?  criteria[0].filter(document) : true) {

			let match = true;

			if(components != null && criteria[0].components != null) {
		
				match = JSON.stringify(components) == JSON.stringify(
					overlayComponents(components, criteria[0].components, true)
				);
			}

			if(match) {

				criteria.splice(0, 1);
				
				if(criteria.length == 0)
					return [document];
			}
		}
	}

	if(entities == null)
		return [];

	let results = [];

	Object.keys(entities).forEach((key) => {

		results = results.concat(
			traceKaeonACE(
				entities[key],
				[].concat(criteria),
				key
			)
		);
	});

	return results;
}

function useACE() {

	let document = { components: { }, entities: { } };
	let documents = [];
	
	Array.from(arguments).forEach((argument) => {

		documents = documents.concat(
			Array.isArray(argument) ? argument : [argument]
		);
	});

	documents.map(item => getUsage(formatDocument(item))).flat().forEach(
		(item) => {
			overlayEntity(document, item);
		}
	);

	return document;
}

module.exports = {
	clearEntity,
	formatDocument,
	formatKaeonACE,
	getReferenceACE,
	getReference,
	getValue,
	hasUse,
	isONE,
	traceKaeonACE,
	overlayEntity,
	queryKaeonACE,
	useACE
};