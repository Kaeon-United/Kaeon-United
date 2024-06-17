let platform = "browser";

if(typeof process === 'object') {

	if(typeof process.versions === 'object') {

		if(typeof process.versions.node !== 'undefined') {
			platform = "node";
		}
	}
}

if(platform == "browser")
	require("kaeon-united")("vision").load("//unpkg.com/brain.js");

else
	var brain = require("brain.js");

function binaryToNumber(binary) {

	let number = "";

	for(let i = 0; i < binary.length; i++)
		number += binary[i] > .5 ? 1 : 0;

	return parseInt(number, 2);
}

function decorrelate(input, correlation) {

	let output = [];

	for(let i = 0; i < input.length; i++) {

		output.push(
			input[i] > .5 ?
				input[i] * correlation :
				input[i] + (
					(1 - input[i]) *
					(1 - correlation)
				)
		);
	}

	return output;
}

function numberToBinary(number) {
	
	let binary = [];
	let bits = number.toString(2);

	for(let i = 0; i < bits.length; i++)
		binary.push(Number(bits.charAt(i)));

	return binary;
}

function numberToString(number, max) {

	max = max != null ? max : 255;

	let string = "";

	for(let i = 0; i < number.length; i++)
		string += String.fromCharCode(Math.floor(number[i] * max));

	return string;
}

function SOUL(data) {

	var reference = this;

	this.correlate = function(input, output) {

		try {

			input = Array.isArray(input) ? input : stringToNumber(input);
			output = Array.isArray(output) ? output : stringToNumber(output);
	
			if(input.length > reference.model.inputMax)
				input = input.slice(0, reference.model.inputMax);
	
			else while(input.length < reference.model.inputMax)
				input.push(0);
	
			if(!reference.model.optimized)
				reference.optimize(reference.corpus);
	
			if(reference.model.mode == "classifier")
				return brain.likely(input, reference.model.classifyNet) == numberToString(output, 255) ? 1 : 0;
	
			let value = reference.generate(input, 1);
			
			let average = 0;
	
			let i = 0;
	
			for(; i < output.length && i < value.length; i++)
				average += 1 - Math.abs(output[i] - value[i]);
	
			if(i == 0)
				return output.length == value.length ? 1 : 0;
	
			let sizeComparison = 1;
	
			if(output.length > value.length)
				sizeComparison = value.length / output.length;
	
			else if(output.length < value.length)
				sizeComparison = output.length / value.length;
	
			return (average / i) * sizeComparison;
		}

		catch(error) {
			return 0;
		}
	};

	this.degenerate = function(output, correlation) {

		try {

			output = Array.isArray(output) ? output : stringToNumber(output);
	
			correlation = correlation != null ? correlation : 1;
	
			if(reference.model.mode == "classifier")
				return [];
	
			if(!reference.model.optimized)
				reference.optimize();
	
			output = decorrelate(output, correlation);
	
			let size = numberToBinary(output.length);
			let sizeMax = numberToBinary(reference.model.outputMax).length;
	
			if(output.length > reference.model.outputMax)
				output = output.slice(0, reference.model.outputMax);
	
			else while(output.length < reference.model.outputMax)
				output.push(0);
	
			if(size.length > sizeMax)
				size = size.slice(0, sizeMax);
	
			else while(size.length < sizeMax)
				size.push(0);
	
			let sizeOutput = binaryToNumber(reference.model.sizeNetReverse.run(output));
			let valueOutput = Object.values(reference.model.valueNetReverse.run(output));
	
			if(valueOutput.length > sizeOutput)
				valueOutput = valueOutput.slice(0, sizeOutput);
	
			else while(valueOutput.length < sizeOutput)
				valueOutput.push(0);
	
			return valueOutput;
		}

		catch(error) {
			return [];
		}
	};

	this.deserialize = function(data) {
		
		data = JSON.parse(data);

		reference.corpus = data.corpus;

		reference.model = { };

		reference.model.classifyNet = new brain.NeuralNetwork();
		reference.model.inputMax = data.model.inputMax;
		reference.model.mode = data.model.mode;
		reference.model.optimized = data.model.optimized;
		reference.model.outputMax = data.model.outputMax;
		reference.model.sizeNet = new brain.NeuralNetwork();
		reference.model.sizeNetReverse = new brain.NeuralNetwork();
		reference.model.valueNet = new brain.NeuralNetwork();
		reference.model.valueNetReverse = new brain.NeuralNetwork();

		reference.model.classifyNet.fromJSON(JSON.parse(data.model.classifyNet));
		reference.model.sizeNet.fromJSON(JSON.parse(data.model.sizeNet));
		reference.model.sizeNetReverse.fromJSON(JSON.parse(data.model.sizeNetReverse));
		reference.model.valueNet.fromJSON(JSON.parse(data.model.valueNet));
		reference.model.valueNetReverse.fromJSON(JSON.parse(data.model.valueNetReverse));
	};

	this.generate = function(input, correlation) {

		try {

			input = Array.isArray(input) ? input : stringToNumber(input, 255);
	
			if(input.length > reference.model.inputMax)
				input = input.slice(0, reference.model.inputMax);
	
			else while(input.length < reference.model.inputMax)
				input.push(0);
	
			correlation = correlation != null ? correlation : 1;
	
			if(!reference.model.optimized)
				reference.optimize(reference.corpus);
	
			if(reference.model.mode == "classifier")
				return stringToNumber(brain.likely(input, reference.model.classifyNet), 255);
	
			input = decorrelate(input, correlation);
	
			let size = numberToBinary(input.length);
			let sizeMax = numberToBinary(reference.model.inputMax).length;
	
			if(size.length > sizeMax)
				size = size.slice(0, sizeMax);
	
			else while(size.length < sizeMax)
				size.push(0);
	
			let sizeOutput = binaryToNumber(reference.model.sizeNet.run(input));
			let valueOutput = Object.values(reference.model.valueNet.run(input));
	
			if(valueOutput.length > sizeOutput)
				valueOutput = valueOutput.slice(0, sizeOutput);
	
			else while(valueOutput.length < sizeOutput)
				valueOutput.push(0);
	
			return valueOutput;
		}

		catch(error) {
			return [];
		}
	};

	this.getModel = function() {
		return reference.model.mode;
	};

	this.optimize = function(corpus) {

		corpus = corpus != null ? corpus : reference.corpus;

		let dataClassify = [];		

		let data = [];
		let dataReverse = [];
		
		let dataSize = [];
		let dataSizeReverse = [];

		let sizeMax = numberToBinary(reference.model.outputMax).length;
		let sizeMaxReverse = numberToBinary(reference.model.inputMax).length;

		for(let i = 0; i < corpus.length; i++) {

			let itemInput = corpus[i][0];
			let itemOutput = corpus[i][1];

			let itemInputSize = numberToBinary(corpus[i][0].length);
			let itemOutputSize = numberToBinary(corpus[i][1].length);

			let correlation = corpus[i][2];

			while(itemInput.length < reference.model.inputMax)
				itemInput.push(0);

			while(itemOutput.length < reference.model.outputMax)
				itemOutput.push(0);

			while(itemInputSize.length < sizeMax)
				itemInputSize.push(0);

			while(itemOutputSize.length < sizeMaxReverse)
				itemOutputSize.push(0);

			let classifyOutput = { };
			classifyOutput[numberToString(corpus[i][1], 255)] = correlation;

			dataClassify.push({
				input: itemInput,
				output: classifyOutput
			});

			data.push({
				input: itemInput,
				output: decorrelate(itemOutput, correlation)
			});

			dataReverse.push({
				input: itemOutput,
				output: decorrelate(itemInput, correlation)
			});

			dataSize.push({
				input: itemInput,
				output: decorrelate(itemOutputSize, correlation)
			});

			dataSizeReverse.push({
				input: itemOutput,
				output: decorrelate(itemInputSize, correlation)
			});
		}

		reference.model.classifyNet = new brain.NeuralNetwork();

		reference.model.valueNet = new brain.NeuralNetwork();
		reference.model.valueNetReverse = new brain.NeuralNetwork();

		reference.model.sizeNet = new brain.NeuralNetwork();
		reference.model.sizeNetReverse = new brain.NeuralNetwork();

		reference.model.classifyNet.train(dataClassify);

		reference.model.valueNet.train(data);
		reference.model.valueNetReverse.train(dataReverse);

		reference.model.sizeNet.train(dataSize);
		reference.model.sizeNetReverse.train(dataSizeReverse);

		reference.model.optimized = true;
	};

	this.serialize = function() {
		
		return JSON.stringify({
			corpus: reference.corpus,
			model: {
				classifyNet: JSON.stringify(reference.model.classifyNet.toJSON()),
				inputMax: reference.model.inputMax,
				mode: reference.model.mode,
				optimized: reference.model.optimized,
				outputMax: reference.model.outputMax,
				sizeNet: JSON.stringify(reference.model.sizeNet.toJSON()),
				sizeNetReverse: JSON.stringify(reference.model.sizeNetReverse.toJSON()),
				valueNet: JSON.stringify(reference.model.valueNet.toJSON()),
				valueNetReverse: JSON.stringify(reference.model.valueNetReverse.toJSON())
			}
		});
	};

	this.setModel = function(model) {
		reference.model.mode = model.trim().toLowerCase();
	};

	this.train = function(input, output, correlation) {

		input = Array.isArray(input) ? input : stringToNumber(input, 255);
		output = Array.isArray(output) ? output : stringToNumber(output, 255);

		correlation = correlation != null ? correlation : 1;

		reference.corpus.push([input, output, correlation]);

		if(input.length > reference.model.inputMax)
			reference.model.inputMax = input.length;

		if(output.length > reference.model.outputMax)
			reference.model.outputMax = output.length;

		reference.model.optimized = false;
	};

	if(data == null) {

		this.corpus = [];
	
		this.model = {
			classifyNet: new brain.NeuralNetwork(),
			inputMax: 0,
			mode: "variable",
			optimized: true,
			outputMax: 0,
			sizeNet: new brain.NeuralNetwork(),
			sizeNetReverse: new brain.NeuralNetwork(),
			valueNet: new brain.NeuralNetwork(),
			valueNetReverse: new brain.NeuralNetwork()
		};
	}

	else
		this.deserialize(data);
}

function stringToNumber(string, max) {

	max = max != null ? max : 255;

	let number = [];

	for(let i = 0; i < string.length; i++)
		number.push(string.charCodeAt(i) / max);

	return number;
}

module.exports = {
	binaryToNumber,
	decorrelate,
	numberToBinary,
	numberToString,
	SOUL,
	stringToNumber
};