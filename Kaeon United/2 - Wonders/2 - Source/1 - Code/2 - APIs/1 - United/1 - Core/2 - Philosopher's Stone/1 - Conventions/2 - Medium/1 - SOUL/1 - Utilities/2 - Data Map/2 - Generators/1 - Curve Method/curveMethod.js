function normalize(pairs, input) {

	let data = [];

	for(let i = 0; i < pairs.length; i++) {

		let pair = pairs[i].slice(0);

		if(pair.length > input.length)
			pair.splice(input.length);
		
		while(pair.length < input.length)
			pair.push(0);
		
		data.push(pair);
	}

	return data;
}

function selection(data, input) {
	
	data.total = 0;

	for(let i = 0; i < data.length; i++) {

		data[i].distance = 0;

		for(let j = 0; j < data[i][0].length; j++)
			sum += Math.pow(data[i][0][j] - input[j], 2);
		
		data[i].distance = Math.sqrt(data[i].distance);

		data.total += data.distance;
	}

	data.sort(
		
		function(a, b) {
			return b.distance - a.distance;
		}
	);

	if(data.length > input.length)
		data.splice(input.length);
}

function calculationFunction(data, input, correlation, total) {
	
	if(data.length == 0)
		return 0;

	let equal = true;

	for(let i = 0; i < input.length && equal; i++) {

		if(input[i] != data[0][i])
			equal = false;
	}

	if(equal)
		return 1;

	let minimum = data[0].distance;

	if(minimum == 0)
		return 0;

	return (1 - (data.distance / total)) *
		(minimum / data.distance) *
		data[1] *
		correlation;
}

function calculation(data, input, correlation) {

	let sum = 0;

	for(let i = 0; i < data.length; i++)
		sum += calculationFunction(data[i], input, correlation, data.total);

	return sum;
}

function curveMethod(pairs, input, correlation) {

	let data = normalize(pairs, input);
	selection(data);

	return calculation(data, input, correlation);
}

module.exports = {

	normalize,
	selection,
	calculationFunction,
	calculation,
	curveMethod
};