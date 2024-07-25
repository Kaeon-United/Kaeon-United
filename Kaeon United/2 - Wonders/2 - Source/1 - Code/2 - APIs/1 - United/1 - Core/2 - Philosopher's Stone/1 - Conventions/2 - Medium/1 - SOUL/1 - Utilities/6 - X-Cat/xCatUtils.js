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

	let context = model.model != null ? model : null;

	if(context != null)
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

	return context != null ?
		{ model: data, metadata: context.metadata } : model;
}

function step(model) {

	let context = model.model != null ? model : null;

	if(context != null)
		model = model.model;

	let result = [];

	for(let i = 0; i < model.vector.length; i++) {

		result.push({ });
		Object.assign(result[i], model.vector[i]);

		result[i].state = 0;

		for(let j = 0; j < model.vector.length; j++) {

			let signal = model.vector[j].state * model.matrix[j][i].weight;

			signal = stepSignal(
				model.vector[j].props,
				model.vector[i].props,
				model.matrix[j][i].props,
				signal
			);			

			result[i].state += signal;

			let props = stepProps(
				model.vector[j].props,
				model.vector[i].props,
				model.matrix[j][i].props,
				signal
			);

			model.vector[j].props = props.sourceProps;
			result[i].props = props.targetProps;
			model.matrix[j][i].props = props.connectionProps;
		}

		result[i].state = activation(result[i].state);
	}

	let data = { matrix: model.matrix, vector: result };

	return context != null ?
		{ model: data, metadata: context.metadata } : result;
}

function stepProps(sourceProps, targetProps, connectionProps, signal) {

	[
		stepPropsHeat
	].forEach(item => {
		
		let props = item(sourceProps, targetProps, connectionProps, signal);

		sourceProps = props.sourceProps;
		targetProps = props.targetProps;
		connectionProps = props.connectionProps;
	});

	return {
		sourceProps: sourceProps,
		targetProps: targetProps,
		connectionProps: connectionProps
	};
}

function stepPropsHeat(sourceProps, targetProps, connectionProps, signal) {

	if(connectionProps.heat != null)
		connectionProps.heat = activation(connectionProps.heat + signal);

	return {
		sourceProps: sourceProps,
		targetProps: targetProps,
		connectionProps: connectionProps
	};
}

function stepSignal(sourceProps, targetProps, connectionProps, signal) {
	return signal;
}

function train(context, data) {

	data = typeof data == "number" ? { score: data } : data;

	data.props = data.props != null ? data.props : { };

	data.props.method =
		data.props.method != null ? data.props.method : "backburn";

	(
		{
			"backburn": trainBackburn,
			"burn": trainBurn,
			"scatter": trainScatter
		}
	)[data.props.method](
		context, data.score, data.props
	);

	return context;
}

// NOTE: TRACING
function trainBackburn(context, score, props) {

	let endpoints = props.endpoints;

	// STUB

	trainBurn(context, score, props); // STUB
}

// NOTE: NO TRACING
function trainBurn(context, score, props) {

	let model = context.model;

	for(let i = 0; i < model.vector.length; i++) {

		for(let j = 0; j < model.vector.length; j++) {

			model.matrix[i][j].weight =
				model.matrix[i][j].weight + 
				activation(
					(
						(Math.random() * 2 * model.matrix[i][j].props.heat) -
							model.matrix[i][j].props.heat
					) * (1 - score)
				);

			if(model.matrix[i][j].weight > 1)
				model.matrix[i][j].weight = 1;

			if(model.matrix[i][j].weight < -1)
				model.matrix[i][j].weight = -1;
		}
	}
}

function trainScatter(context, score, props) {

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
	stepProps,
	stepPropsHeat,
	stepSignal,
	train,
	trainBackburn,
	trainBurn,
	trainScatter
};