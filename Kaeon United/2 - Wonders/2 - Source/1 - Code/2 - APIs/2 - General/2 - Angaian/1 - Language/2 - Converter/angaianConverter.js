function getLatinizedAngaianCode(text) {

	let latin = {
	
		" ": 0,
		"\t": 0,

		"b": 1,
		"k": 2,
		"d": 3,
		"f": 4,
		"g": 5,
		"h": 6,
		"j": 7,
		"l": 8,
		"m": 9,
		"n": 10,
		"p": 11,
		"r": 12,
		"s": 13,
		"t": 14,
		"v": 15,
		"w": 16,
		"y": 17,
		"z": 18,
		"H": 19,
		"T": 20,
		"c": 21,
		"S": 22,
		"Z": 23,
		"N": 24,
		"x": 25,
		"q": 26,
	
		"a": 33,
		"A": 34,
		"e": 35,
		"E": 36,
		"i": 37,
		"o": 38,
		"u": 39,
		"U": 40,
		
		"\'": 65,
		",": 66,
		".": 67,
		"(": 68,
		")": 69,

		"{": 70,
		":": 70,

		"}": 71,
		";": 71,

		"~": 72,
		"*": 73,
	
		"0": 257,
		"1": 258,
		"2": 260,
		"3": 264,
		"4": 272,
		
		"5": 513,
		"6": 514,
		"7": 516,
		"8": 520,
		"9": 528,
		
		"-": 1023,
		
		"\n": 1024
	};
	
	let code = [];
	
	for(let i = 0; i < text.length; i++) {

		if(latin[text.charAt(i)] != null)
			code.push(latin[text.charAt(i)]);
	}
	
	return code;
}

module.exports = {
	getLatinizedAngaianCode
};