function compare(a, b) {
 
	let longer = a;
	let shorter = b;
 
	if (a.length < b.length) {
		longer = b;
		shorter = a;
	}
 
	let longerLength = longer.length;
 
	if(longerLength == 0)
		return 1.0;
 
	return (longerLength - editDistance(longer, shorter)) /
		parseFloat(longerLength);
}

function editDistance(a, b) {
 
	a = a.toLowerCase();
	b = b.toLowerCase();
 
	let costs = [];
 
	for(let i = 0; i <= a.length; i++) {
 
		let lastValue = i;
 
		for(let j = 0; j <= b.length; j++) {
 
			if(i == 0)
				costs[j] = j;
 
			else {
 
				if (j > 0) {
 
					let newValue = costs[j - 1];
 
					if (a.charAt(i - 1) != b.charAt(j - 1)) {
 
						newValue = Math.min(
							Math.min(newValue, lastValue),
							costs[j]
						) + 1;
					}
 
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
 
		if(i > 0)
			costs[b.length] = lastValue;
	}
 
	return costs[b.length];
}

module.exports = {
	compare,
	editDistance
};