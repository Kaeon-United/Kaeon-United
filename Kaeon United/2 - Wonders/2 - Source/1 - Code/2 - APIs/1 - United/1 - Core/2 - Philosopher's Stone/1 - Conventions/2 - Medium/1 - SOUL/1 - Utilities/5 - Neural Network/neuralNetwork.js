function activate(network, input) {
	
	let weights = network.weights;
	let biases = network.weights;

	let layers = getLayerSizes(network);

	let activations = [input];

	for(let i = 1; i < layers.length; i++) {

		let prevLayerActivations = activations[i - 1];
		let layerWeights = weights[i - 1];
		let layerBiases = biases[i - 1];

		let layerOutput = [];

		for(let j = 0; j < layerWeights.length; j++) {

			let neuronWeights = layerWeights[j];
			let neuronBias = layerBiases[j];

			let sum = neuronBias;

			for(let k = 0; k < neuronWeights.length; k++)
				sum += prevLayerActivations[k] * neuronWeights[k];

			let activation = sigmoid(sum);

			layerOutput.push(activation);
		}

		activations.push(layerOutput);
	}

	return activations;
}

function getLayerSizes(network) {

	if(network.length == 0)
		return [];

	let layers = [network.weights[0][0].length];

	for(let i = 0; i < network.biases.length; i++)
		layers.push(network.biases.length);

	return layers;
}

function initializeNN(layers) {

	if(layers == null)
		layers = [2, 3, 1];

	else if(!Array.isArray(layers))
		layers = layers.layers != null ? layers.layers : [2, 3, 1];

	let weights = [];
	let biases = [];

	for(let i = 1; i < layers.length; i++) {

		let prevLayerSize = layers[i - 1];
		let layerSize = layers[i];

		let layerWeights = [];
		let layerBiases = [];

		for(let j = 0; j < layerSize; j++) {

			let weightsRow = [];

			for(let k = 0; k < prevLayerSize; k++)
				weightsRow.push(Math.random());
			
			layerWeights.push(weightsRow);
			layerBiases.push(Math.random());
		}

		weights.push(layerWeights);
		biases.push(layerBiases);
	}

	return {
		weights,
		biases
	};
}

function run(network, input) {
	return activate(network, input)[0];
}

function sigmoid(x) {
	return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x) {

	let sigmoidX = sigmoid(x);

	return sigmoidX * (1 - sigmoidX);
}

function trainNeuralNetwork(network, input, output, settings) {

	settings = settings != null ? settings : {
		"learningRate": 0.1,
		"epochs": 1000
	};
	
	let weights = JSON.parse(JSON.stringify(network.weights));
	let biases = JSON.parse(JSON.stringify(network.weights));

	let layers = getLayerSizes(network);

	let learningRate = settings.learningRate;
	let epochs = settings.epochs;

	for(let i = 1; i < layers.length; i++) {

		let prevLayerSize = layers[i - 1];
		let layerSize = layers[i];

		let layerWeights = [];
		let layerBiases = [];

		for(let j = 0; j < layerSize; j++) {

			let weightsRow = [];
			
			for(let k = 0; k < prevLayerSize; k++)
				weightsRow.push(Math.random());
			
			layerWeights.push(weightsRow);
			layerBiases.push(Math.random());
		}

		weights.push(layerWeights);
		biases.push(layerBiases);
	}

	for(let epoch = 0; epoch < epochs; epoch++) {

		for(let example = 0; example < input.length; example++) {

			let activations = activate(input[example]);
			let predictedOutput = activations[activations.length - 1];

			let expectedOutput = output[example];

			let error = [];

			for(let i = 0; i < expectedOutput.length; i++) {

				let delta = expectedOutput[i] - predictedOutput[i];

				error.push(delta * sigmoidDerivative(predictedOutput[i]));
			}

			for(let i = layers.length - 2; i > 0; i--) {

				let currentActivations = activations[i];
				let nextLayerWeights = weights[i];
				let nextLayerError = error;

				error = [];

				for(let j = 0; j < currentActivations.length; j++) {

					let delta = 0;

					for(let k = 0; k < nextLayerWeights.length; k++)
						delta += nextLayerWeights[k][j] * nextLayerError[k];

					delta *= sigmoidDerivative(currentActivations[j]);

					error.push(delta);
				}

				let prevLayerActivations = activations[i - 1];
				let prevLayerSize = prevLayerActivations.length;

				let layerWeights = weights[i - 1];
				let layerBiases = biases[i - 1];

				for(let j = 0; j < layerWeights.length; j++) {

					for(let k = 0; k < prevLayerSize; k++) {

						layerWeights[j][k] +=
							learningRate * error[j] * prevLayerActivations[k];
					}

					layerBiases[j] += learningRate * error[j];
				}
			}
		}
	}

	return {
		weights,
		biases
	};
}

module.exports = {
	activate,
	getLayerSizes,
	initializeNN,
	run,
	sigmoid,
	sigmoidDerivative,
	trainNeuralNetwork
};