/*

	inputs and outputs: n where 0 <= n <= 1
	pair: [[input 1, input 2, input 3...], output] 
	pairs: [pair 1, pair 2, pair 3...]
	data map vector: [pairs 1, pairs 2, pairs 3...]
	dual data map vector: [value data map vector, size data map vector]

 */

var maxChar = Math.pow(2, 32);

function stringToVector(string) {

	let vector = [];

	for(let i = 0; i < string.length; i++)
		vector.push(string.charCodeAt(i) / maxChar);

	return vector;
}

function vectorToString(vector) {

	let string = "";

	for(let i = 0; i < vector.length; i++)
		string += String.fromCharCode(Math.floor(vector[i] * maxChar));

	return string;
}

function numberToVector(number) {

	let vector = [];
	let binary = number.toString(2);

	for(let i = binary.length - 1; i >= 0; i--)
		vector.push(Number(binary.charAt(i)));

	return vector;
}

function vectorToNumber(vector) {

	let number = 0;
	let base = 1;

	for(let i = 0; i < vector.length; i++) {

		number += vector[i] > .5 ? base : 0;

		base *= 2;
	}

	return number;
}

function binaryCrop(value, size) {

	let number = vectorToNumber(size);

	let crop = value.slice(0);

	if(crop.length > number)
		crop.splice(number);
	
	return crop;
}

function formatDualVector(vector) {

	for(let i = 0; i < 2; i++) {

		if(vector.length <= i)
			vector.push([]);
		
		if(!Array.isArray(vector[i]))
			vector[i] = [];
	}
}

function train(pairs, input, output, correlation) {
	pairs.push([input, output * (correlation != null ? correlation : 1)]);
}

function correlate(pairs, input, output, generate) {
	return 1 - Math.abs(output - generate(pairs, input, 1));
}

function reduce(pairs, size) {

	size = size != null ? size : pairs.length / 2;

	while(pairs.length > size)
		pairs.splice(Math.floor(Math.random() * pairs.length), 1);
}

function trainVector(vector, input, output, correlation) {
	
	for(let i = 0; i < output.length; i++) {

		if(i > vector.length - 1)
			vector.push([]);
		
		train(vector[i], input, output[i], correlation);
	}
}

function generateVector(vector, input, correlation, generate) {

	let output = [];

	for(let i = 0; i < vector.length; i++)
		output.push(generate(vector[i], input, correlation));

	return output;
}

function correlateVector(vector, input, output, generate) {

	let sum = 0;

	for(let i = 0; i < output.length; i++) {

		sum +=
			i < vector.length ?
				correlate(vector[i], input, output[i], generate) :
				0;
	}

	return sum / output.length;
}

function reduceVector(vector, size) {

	for(let i = 0; i < vector.length; i++)
		reduce(vector[i], size);
}

function trainDualVector(vector, input, output, correlation) {

	formatDualVector(vector);

	trainVector(vector[0], input, output, correlation);
	trainVector(vector[1], input, numberToVector(output.length), correlation);
}

function generateDualVector(vector, input, correlation, generate) {

	formatDualVector(vector);

	return binaryCrop(
		generateVector(vector[0], input, correlation, generate),
		generateVector(vector[1], input, correlation, generate));
}

function correlateDualVector(vector, input, output, generate) {

	formatDualVector(vector);

	return correlateVector(
		binaryCrop(
			generateVector(vector[0], input, correlation, generate),
			generateVector(vector[1], input, correlation, generate)),
		output);
}

function reduceDualVector(vector, size) {

	formatDualVector(vector);

	reduceVector(vector[0], size);
	reduceVector(vector[1], size);
}

module.exports = {

	stringToVector,
	vectorToString,
	numberToVector,
	vectorToNumber,
	binaryCrop,
	formatDualVector,
	train,
	correlate,
	reduce,
	trainVector,
	generateVector,
	correlateVector,
	reduceVector,
	trainDualVector,
	generateDualVector,
	correlateDualVector,
	reduceDualVector
};