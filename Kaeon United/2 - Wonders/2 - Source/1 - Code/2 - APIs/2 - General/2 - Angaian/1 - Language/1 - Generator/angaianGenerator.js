function getMagnitude(x, y) {
	return Math.sqrt((x * x) + (y * y));
}

function getAngle(x, y) {

	if(x < 0 && y == 0)
		return 180;

	if(y >= 0)
		return (Math.atan2(y, x) * 180) / Math.PI;

	return ((Math.atan2(-y, -x) * 180) / Math.PI) + 180;
}

function circle(x, y, a, b, radius, min, max) {
	
	x = (x - a) / radius;
	y = (y - b) / radius;

	let magnitude = getMagnitude(x, y);
	let angle = getAngle(x, y);

	if(min < max) {

		return magnitude >= 1 && magnitude <= 1.06 &&
			angle >= min && angle <= max;
	}

	else {

		return magnitude >= 1 && magnitude <= 1.06 &&
			((angle >= 0 && angle <= max) ||
			(angle <= 360 && angle >= min));
	}
}

function mark1(x, y) {
	
	let magnitude = getMagnitude(x, y);

	return magnitude >= -.05 && magnitude <= .05;
}

function mark2(x, y) {

	let cos = Math.cos(Math.PI / 6) / 3;
	let sin = Math.sin(Math.PI / 6) / 3;

	return y >= (-sin - .0075) &&
		y <= (-sin + .005) &&
		x >= (-cos) &&
		x <= (cos);
}

function mark3(x, y) {

	let cos = Math.cos(Math.PI / 6) / 3;
	let sin = Math.sin(Math.PI / 6) / 3;

	let m = (sin + (1 / 3)) / cos;
	
	return y <= (1 / 3) + (x * m) + .02 &&
		y >= (1 / 3) + (x * m) - .01 &&
		y >= (-sin - .01) &&
		x <= 0;
}

function mark4(x, y) {

	let cos = Math.cos(Math.PI / 6) / 3;
	let sin = Math.sin(Math.PI / 6) / 3;

	let m = (sin + (1 / 3)) / cos;
	
	return y <= (1 / 3) + (x * -m) + .02 &&
		y >= (1 / 3) + (x * -m) - .01 &&
		y >= (-sin - .01) &&
		x >= 0;
}

function mark5(x, y) {

	let cos = Math.cos(Math.PI / 6) / 3;
	let sin = Math.sin(Math.PI / 6) / 3;

	let m = (sin + (1 / 3)) / cos;
	
	let magnitude = getMagnitude(x, y);

	let y1 = (1 / 3) + (x * m);
	let y2 = (1 / 3) - (x * m);
	
	return magnitude < (2 / 3) + .03 && y >= 1 / 3 &&
		((y >= y1 - .005 && y <= y1 + .02) ||
		(y >= y2 - .005 && y <= y2 + .02)) ||
		circle(x, y, 0, 9.25 / 12, 2.5 / 12, 330, 210);
}

function mark6(x, y) {
	
	let magnitude = getMagnitude(x, y);
	let angle = getAngle(x, y);

	return magnitude >= .98 && magnitude <= 1 &&
		angle >= 30 && angle <= 150;
}

function mark7(x, y) {

	let cos = Math.cos(Math.PI / 6) / 3;
	let sin = Math.sin(Math.PI / 6) / 3;

	let m = (sin + (1 / 3)) / cos;
	
	let magnitude = getMagnitude(x, y);

	let y1 = (1 / 3) + (x * m);
	let y2 = -sin;
	
	return magnitude < (2 / 3) + .03 && y <= -sin + .005 && x <= -cos &&
		((y >= y1 - .01 && y <= y1 + .02) ||
		(y >= y2 - .0075 && y <= y2 + .005)) ||
		circle(x, y, -2.3 * cos, - 2.3 * sin, 2.5 / 12, 90, 330);
}

function mark8(x, y) {

	let cos = Math.cos(Math.PI / 6) / 3;
	let sin = Math.sin(Math.PI / 6) / 3;

	let m = (sin + (1 / 3)) / cos;
	
	let magnitude = getMagnitude(x, y);

	let y1 = -sin;
	let y2 = (1 / 3) - (x * m);
	
	return magnitude < (2 / 3) + .03 && y <= -sin + .005 && x >= cos &&
		((y >= y1 - .0075 && y <= y1 + .005) ||
		(y >= y2 - .01 && y <= y2 + .02)) ||
		circle(x, y, 2.3 * cos, - 2.3 * sin, 2.5 / 12, 210, 90) ||
		circle(x, y, 2.3 * cos, - 2.3 * sin, 2.5 / 12, 0, 90);
}

function mark9(x, y) {
	
	let magnitude = getMagnitude(x, y);
	let angle = getAngle(x, y);

	return magnitude >= .98 && magnitude <= 1 &&
		angle >= 150 && angle <= 270 &&
		x <= 0;
}

function mark10(x, y) {
	
	let magnitude = getMagnitude(x, y);
	let angle = getAngle(x, y);

	return magnitude >= .98 && magnitude <= 1 &&
		(angle >= 270 || angle <= 30) &&
		x >= 0;
}

function draw(x, y, width, character) {

	let radius = width / 2;

	x = (x - radius) / radius;
	y = -((y - radius) / radius);

	let binary = character.toString(2);

	while(binary.length < 10)
		binary = "0" + binary;

	return(mark1(x, y) && binary.charAt(9) == 1) ||
		(mark2(x, y) && binary.charAt(8) == 1) ||
		(mark3(x, y) && binary.charAt(7) == 1) ||
		(mark4(x, y) && binary.charAt(6) == 1) ||
		(mark5(x, y) && binary.charAt(5) == 1) ||
		(mark6(x, y) && binary.charAt(4) == 1) ||
		(mark7(x, y) && binary.charAt(3) == 1) ||
		(mark8(x, y) && binary.charAt(2) == 1) ||
		(mark9(x, y) && binary.charAt(1) == 1) ||
		(mark10(x, y) && binary.charAt(0) == 1);
}

function getImage(character, width) {

	let canvas = document.createElement("canvas");
	
	width = width != null ? width : 1000;
	
	canvas.width = width;
	canvas.height = width;
	
	let context = canvas.getContext("2d");
	
	let imageData = context.createImageData(width, width);
	let data = imageData.data;
	
	for(let y = 0; y < width; y++) {
	
		for(let x = 0; x < width; x++) {
			
			let i = ((y * width) + x) * 4;
	
			if(draw(x, y, width, character))
				data[i + 3] = 255;
		}
	}
	
	context.putImageData(imageData, 0, 0);
	
	let image = document.createElement("img");
	image.src = canvas.toDataURL("image/png");

	return image;
}

module.exports = {
	draw,
	getImage
};