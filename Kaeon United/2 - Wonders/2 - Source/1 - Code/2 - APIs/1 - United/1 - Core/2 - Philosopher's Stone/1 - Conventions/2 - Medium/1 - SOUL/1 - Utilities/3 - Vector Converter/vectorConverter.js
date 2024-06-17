function stringToNumber(string) {

	let number = [];

	for(let i = 0; i < string.length; i++)
		number.push(string.charCodeAt(i));

	return number;
}

function numberToString(number) {

	let string = "";

	for(let i = 0; i < number.length; i++)
		string += String.fromCharCode(number[i]);

	return string;
}

function binaryToNumber(binary) {

	let number = [];

	for(let i = 0; i < binary.length; i += 8)
		number.push(parseInt(binary.slice(i, i + 8).join(""), 2));

	return number;
}

function numberToBinary(number) {

	let binary = [];

	for(let i = 0; i < number.length; i++) {

		let code = number[i].toString(2);

		while(code.length < 8)
			code = "0" + code;

		for(let j = 0; j < code.length; j++)
			binary.push(Number(code.charAt(j)));
	}

	return binary;
}

function stringToBinary(string) {
	return numberToBinary(stringToNumber(string));
}

function binaryToString(binary) {
	return numberToString(binaryToNumber(binary));
}

function fit(vector, size) {

	size = size >= 0 ? size : 0;

	if(vector.length == size)
		return vector;

	if(Array.isArray(vector)) {

		if(vector.length > size)
			return vector.slice(0, size);

		let newVector = vector.slice(0);

		while(newVector.length < size)
			newVector.push(0);

		return newVector;
	}

	let newVector = "" + vector;

	if(newVector.length > size)
		return newVector.substring(0, size);

	while(newVector.length < size)
		newVector += String.fromCharCode(0);

	return newVector;
}

module.exports = {

	stringToNumber,
	numberToString,
	binaryToNumber,
	numberToBinary,
	stringToBinary,
	binaryToString,
	fit
};