/*

	data = [[input string, output string(, correlation)]...]
	input = string

 */

function toBinary(number, size) {

	size = size != null ? size : 8;

	let binary = number.toString(2);

	while(binary.length < size)
		binary = "0" + binary;
	
	return binary;
}

function toBinaryVector(string, max) {

	let vector = [];

	for(let i = 0; i < string.length; i++) {

		let binary = toBinary(string.charCodeAt(i));

		for(let j = 0; j < binary.length; j++)
			vector = vector.concat(binary.charAt(j) == "0" ? 0 : 1);
	}
	
	while(vector.length < max)
		vector.push(0);

	return vector;
}

function fromBinary(binary) {

	let string = "";
	let data = binary.join("");

	for(let i = 0; i + 8 <= data.length; i += 8)
		string += String.fromCharCode(parseInt(data.substring(i, i + 8), 2));
	
	return string;
}

function getMax(data, index, input) {

	let inputLength = input != null ? input.length : 0;

	let max = 0;

	for(let i = 0; i < data.length; i++) {

		if(data[i][index].length > max)
			max = data[i][index].length;
	}

	return (max > inputLength ? max : inputLength) * 8;
}

function match(alpha, beta) {

	let count = 0;

	for(let i = 0; i < alpha.length; i++) {

		if(alpha[i] == beta[i])
			count++;
	}

	return count / alpha.length;
}

function generateOutput(data, input, correlation) {

	let output = [];

	for(let i = 0; i < data[0][1].length; i++) {

		let zeroSum = 0;
		let oneSum = 0;

		let zeroCount = 0;
		let oneCount = 0;

		for(let j = 0; j < data.length; j++) {

			let score = match(data[j][0], input) * data[j][2] * correlation;

			if(data[j][1][i] == 0) {
				zeroSum += score;
				zeroCount++;
			}

			else {
				oneSum += score;
				oneCount++;
			}
		}

		let zeroScore = zeroCount == 0 ? 0 : (zeroSum / zeroCount);
		let oneScore = oneCount == 0 ? 0 : (oneSum / oneCount);

		output.push((oneScore > zeroScore) ? 1 : 0);
	}

	return output;
}

function generateValue(data, input, correlation) {

	let inputMax = getMax(data, 0, input);
	let outputMax = getMax(data, 1);

	let binaryData = [];
	let binaryInput = toBinaryVector(input, inputMax);

	for(let i = 0; i < data.length; i++) {

		binaryData.push(
			[
				toBinaryVector(data[i][0], inputMax),
				toBinaryVector(data[i][1], outputMax),
				data[i][2] != null ? data[i][2] : 1
			]
		);
	}

	return generateOutput(binaryData, binaryInput, correlation);
}

function generateSize(data, input, correlation) {

	let inputMax = getMax(data, 0, input);

	let binaryData = [];
	let binaryInput = toBinaryVector(input, inputMax);

	let outputMax = 0;

	for(let i = 0; i < data.length; i++) {

		let size = (data[i][0].length * 8).toString(2);
		let vector = [];

		if(size.length > outputMax)
			outputMax = size.length;

		for(let j = 0; j < size.length; j++)
			vector.push(size.charAt(j) == "0" ? 0 : 1);

		binaryData.push(
			[
				toBinaryVector(data[i][0], inputMax),
				vector,
				data[i][2] != null ? data[i][2] : 1
			]
		);
	}

	for(let i = 0; i < binaryData.length; i++) {

		while(binaryData[i][1].length < outputMax)
			binaryData[i][1].push(0);
	}

	return generateOutput(binaryData, binaryInput, correlation);
}

function generate(data, input, correlation) {

	correlation = correlation != null ? correlation : 1;

	if(data.length == 0)
		return "";

	let value = generateValue(data, input, correlation);
	let size = parseInt(generateSize(data, input, correlation).join(""), 2);

	return fromBinary(value.slice(0, size));
}

function classify(data, input, correlation) {

	if(data.length == 0)
		return "";

	let maxValue = 0;
	let maxIndex = 0;

	let inputValue = generateValue(data, input, 1);
	let inputSize = generateSize(data, input, 1);

	for(let i = 0; i < data.length; i++) {

		let output = data[i][1];

		let outputValue = toBinaryVector(output);
		let outputSize = [];
	
		let sizeBinary = (output.length * 8).toString(2);
	
		for(let j = 0; j < sizeBinary.length; j++)
			outputSize.push(sizeBinary.charAt(j) == "0" ? 0 : 1);
		
		let value =
			match(inputValue, outputValue) *
			match(inputSize, outputSize);
		
		if(value > maxValue) {
			maxValue = value;
			maxIndex = i;
		}
	}

	return data[maxIndex][1];
}

function correlate(data, input, output) {

	if(data.length == 0)
		return 0;

	let targetValue = toBinaryVector(output);
	let targetSize = [];

	let sizeBinary = (output.length * 8).toString(2);

	for(let j = 0; j < sizeBinary.length; j++)
		targetSize.push(sizeBinary.charAt(j) == "0" ? 0 : 1);

	let outputValue = generateValue(data, input, 1);
	let outputSize = generateSize(data, input, 1);

	return match(targetValue, outputValue) * match(targetSize, outputSize);
}

module.exports = {
	generate,
	classify,
	correlate
};