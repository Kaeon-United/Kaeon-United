function shuffle(text, key) {
	
	let encipher = text;
	
	let shuffleIndex = 0;
	
	for(let i = 0; i < encipher.length; i++) {
		
		let cut = encipher.substring(0, key.charCodeAt(shuffleIndex));
		encipher = encipher.substring(key.charCodeAt(shuffleIndex)) + cut;
		
		shuffleIndex++;
		
		if(shuffleIndex == key.length)
			shuffleIndex = 0;
	}
	
	return encipher;
}

function shift(text, key) {
	
	let encipher = "";
	
	let shiftIndex = 0;
	
	for(let i = 0; i < text.length; i++) {
		
		let shifted = Math.abs(
			key.charCodeAt(shiftIndex) -
			key.charCodeAt(key.length - shiftIndex - 1)
		);
		
		encipher += String.fromCharCode(text.charCodeAt(i) + shifted);
		
		shiftIndex++;
		
		if(shiftIndex == key.length)
			shiftIndex = 0;
	}
	
	return encipher;
}

function deshuffle(text, key) {
	
	let decipher = text;
	
	let shuffleIndex = decipher.length % key.length;
	
	for(let i = decipher.length - 1; i >= 0; i--) {
		
		let cut = decipher.substring(key.charCodeAt(shuffleIndex));
		decipher = cut + decipher.substring(0, key.charCodeAt(shuffleIndex));
		
		shuffleIndex--;
		
		if(shuffleIndex < 0)
			shuffleIndex = key.length - 1;
	}
	
	return decipher;
}

function deshift(text, key) {
	
	let decipher = "";
	
	let shiftIndex = 0;
	
	for(let i = 0; i < text.length; i++) {
		
		let shifted = Math.abs(
			(key.charCodeAt(shiftIndex)) -
			(key.charCodeAt(key.length - shiftIndex - 1))
		);
		
		decipher += String.fromCharCode(text.charCodeAt(i) - shifted);
		
		shiftIndex++;
		
		if(shiftIndex == key.length)
			shiftIndex = 0;
	}
	
	return decipher;
}

function getKeyAverage(key) {

	let sum = 0;
	let min = Infinity;

	for(let i = 0; i < key.length; i++) {

		sum += key.charCodeAt(i);

		if(key.charCodeAt(i) < min)
			min = key.charCodeAt(i);
	}

	return Math.ceil((sum - (min * key.length)) / key.length);
}

function getNextKey(key, index) {
	
	let next = "";

	for(let i = 0; i < key.length; i++)
		next += String.fromCharCode(key.charCodeAt(index % key.length) + key.charCodeAt(i));

	return next;
}

function encrypt(text, key, options) {

	let encipher = text;

	options = options != null ? options : { };

	let count = options.count != null ? options.count : 100;
	count += getKeyAverage(key);

	for(let i = 0; i < count; i++) {

		if(i % 2 == 0)
			encipher = shuffle(encipher, key);

		if(i % 2 == 1)
			encipher = shift(encipher, key);

		key = getNextKey(key, i);
	}

	return encipher;
}

function decrypt(text, key, options) {

	let decipher = text;

	options = options != null ? options : { };

	let count = options.count != null ? options.count : 100;
	count += getKeyAverage(key);

	let keys = [key];

	for(let i = 1; i < count; i++)
		keys.push(getNextKey(keys[keys.length - 1], i - 1));

	for(let i = count - 1; i >= 0; i--) {

		if(i % 2 == 0)
			decipher = deshuffle(decipher, keys[i]);

		if(i % 2 == 1)
			decipher = deshift(decipher, keys[i]);
	}

	return decipher;
}

module.exports = {
	encrypt,
	decrypt
}