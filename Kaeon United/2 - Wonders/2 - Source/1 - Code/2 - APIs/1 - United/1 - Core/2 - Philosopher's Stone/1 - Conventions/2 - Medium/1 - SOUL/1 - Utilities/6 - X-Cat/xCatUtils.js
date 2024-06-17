function activation(x) {
	return ((1 / (1 + Math.pow(Math.E, -x))) * 2) - 1;
}

function createModel(degree, zero) {

	let matrix = [];

	for(let i = 0; i < degree; i++) {

		let vector = [];

		matrix.push(vector);
		
		for(let j = 0; j < degree; j++) {

			vector.push({
				weight: zero ? 0 : ((Math.random() * 2 - 1)),
				props: {
					heat: 0
				}
			});
		}
	}

	let vector = [];
	
	for(let j = 0; j < degree; j++) {

		vector.push({
			state: zero ? 0 : ((Math.random() * 2 - 1)),
			props: { }
		});
	}

	return { matrix, vector };
}

function create(degree, zero) {

	let model = createModel(degree, zero);

	return {
		model,
		metadata: {
			previous: JSON.parse(JSON.stringify(model)),
			score: 0
		}
	};
}

function expand(model, degree) {

	if(model.model != null)
		model = model.model;

	degree += model.matrix.length;

	while(model.matrix.length < degree)
		model.matrix.push([]);

	for(let i = 0; i < model.matrix.length; i++) {

		while(model.matrix[i].length < degree)
			model.matrix[i].push({ weight: random ? Math.random() : 0 });
	}

	return model;
}

function scatter(model, degree) {

	if(model.model != null)
		model = model.model;

	for(let i = 0; i < model.matrix.length; i++) {

		for(let j = 0; j < model.matrix.length; j++) {

			model.matrix[j][i].weight =
				activation(
					model.matrix[j][i].weight +
						(((Math.random() * 2) - 1) * degree)
				);
		}
	}

	return model;
}

function step(model) {

	let context = model.model != null ? model : null;

	if(context != null)
		model = model.model;

	let result = [];

	for(let i = 0; i < model.vector.length; i++) {

		result.push({ });
		Object.apply(model.vector[i], result[i]);

		result[i].state = 0;

		for(let j = 0; j < model.vector.length; j++) {
			
			result[i].state +=
				model.vector[j].state * model.matrix[j][i].weight;
		}

		result[i].state = activation(result[i].state);
	}

	let data = { matrix: model.matrix, vector: result };

	return context != null ?
		{ model: data, metadata: context.metadata } : result;
}

function train(context, data) {

	data = typeof data == "number" ? { score: data } : data;

	data.props = data.props != null ? data.props : { };

	data.props.method =
		data.props.method != null ? data.props.method : "scatter";

	if(data.props.method == "backburn")
		trainBackburn(context, data.props.score, data.props.endPoints);

	if(data.props.method == "scatter")
		trainScatter(context, data.props.score);
}

function trainBackburn(context, score, endPoints) {
	// STUB
}

function trainScatter(context, score) {

	if(score > context.metadata.score) {
		context.metadata.previous = JSON.parse(JSON.stringify(context.model));
		context.metadata.score = score;
	}

	else {

		context.model = JSON.parse(JSON.stringify(context.metadata.previous));

		scatter(context, 1 - context.metadata.score);
	}
}

module.exports = {
	activation,
	createModel,
	create,
	expand,
	scatter,
	step,
	train,
	trainBackburn,
	trainScatter
};