/*

	style: { position: absolute }

	element.dimensions = {
		aspect: t/f,
		transforms: [ // { type: translate / rotate / scale / color, vector: [x, y, z(, r)] }
			translate1,
			rotate1,
			scale1,
			color1,
			...
		]
	};

*/

var vision = require("kaeon-united")("vision");

function isHTMLNode(element) {
	return element.ENTITY_NODE != null;
}

function fullscreen(element) {

	if(element.requestFullscreen)
		element.requestFullscreen();
	
	else if(element.mozRequestFullScreen)
		element.mozRequestFullScreen();
	
	else if(element.webkitRequestFullscreen)
		element.webkitRequestFullscreen();
	
	else if(element.msRequestFullscreen)
		element.msRequestFullscreen();
}

function getDimensions(element, aspect) {

	if(!isHTMLNode(element)) {

		return [
			{
				type: "translate",
				vector: [0, 0, 0]
			},
			{
				type: "scale",
				vector: [1, 1, 1]
			}
		];
	}
	
	let rect = element.getBoundingClientRect();
	let parent = null;

	try {
		parent = element.parentNode.getBoundingClientRect();
	}

	catch(error) {
		parent = rect;
	}

	let x = ((rect.left - (parent.left + (parent.width / 2))) + (rect.width / 2)) / (parent.width / 2);
	let y = ((rect.top - (parent.top + (parent.height / 2))) + (rect.height / 2)) / (parent.height / 2);

	let width = rect.width / (parent.width / 2);
	let height = rect.height / (parent.height / 2);

	return [
		{
			type: "translate",
			vector: [x, y == 0 ? y : -y, 0]
		},
		{
			type: "scale",
			vector: [width, height, 1]
		}
	];
}

function initialize(element, aspect, standard) {

	if(element.dimensions != null)
		return;

	element.dimensions = {
		aspect: aspect,
		transforms: standard ?
			[
				{
					type: "translate",
					vector: [0, 0, 0]
				},
				{
					type: "scale",
					vector: [1, 1, 1]
				}
			] :
			getDimensions(element, aspect)
	};

	element.dimensions.transforms.push({
		type: "rotate",
		vector: [0, 0, 0, 0]
	});

	element.dimensions.transforms.push({
		type: "color",
		vector: [1, 1, 1, 1]
	});
}

function getAbsoluteTransforms(element) {

	transforms = [
		{ type: "translate", vector: [0, 0, 0] },
		{ type: "scale", vector: [0, 0, 0] },
		{ type: "rotate", vector: [0, 0, 0, 0] },
		{ type: "color", vector: [0, 0, 0, 0] }
	];

	element.dimensions.transforms.forEach((item) => {

		if(item.type == "translate") {

			transforms[0].vector = addVectors(transforms[0].vector, item.vector);

			// STUB - Take rotation into account
		}

		if(item.type == "scale")
			transforms[1].vector = addVectors(transforms[1].vector, item.vector);

		if(item.type == "rotate")
			transforms[2].vector = addVectors(transforms[2].vector, Array.isArray(item.vector) ? item.vector : [0, 0, item.vector, 0]);

		if(item.type == "color")
			transforms[3].vector = addVectors(transforms[3].vector, item.vector);
	});

	return transforms;
}

function render(element) {

	initialize(element);

	if(!isHTMLNode(element))
		return;

	let transforms = getAbsoluteTransforms(element);
	
	let parent = null;

	try {
		parent = element.parentNode.getBoundingClientRect();
	}

	catch(error) {
		parent = element.getBoundingClientRect();
	}

	let xScale = element.dimensions.aspect ? (parent.width > parent.height ? parent.height : parent.width) : parent.width;
	let yScale = element.dimensions.aspect ? (parent.height > parent.width ? parent.width : parent.height) : parent.height;

	let width = (transforms[1].vector[0] * (xScale / 2));
	let height = (transforms[1].vector[1] * (yScale / 2));

	let x = (parent.width / 2) + (transforms[0].vector[0] * (xScale / 2)) - (width / 2);
	let y = (parent.height / 2) - (transforms[0].vector[1] * (yScale / 2)) - (height / 2);

	let color = "";

	transforms[3].vector.slice(0, 3).forEach((item) => {

		let value = Math.floor(item * 255).toString(16);
		value = value.length == 2 ? value : "0" + value;
		
		color += value;
	});

	vision.set(element, { style: {
		position: "absolute",
		left: x + "px",
		top: y + "px",
		width: width + "px",
		height: height + "px",
		background: "#" + color,
		opacity: transforms[3].vector[3]
	} });
}

function setTransformation(element, vector, index) {

	initialize(element);

	element.dimensions.transforms[index].vector = vector;

	render(element);
}

function incrementTransformation(element, vector, index) {

	initialize(element);

	element.dimensions.transforms[index].vector = addVectors(
		element.dimensions.transforms[index].vector,
		vector
	);

	render(element);
}

function setTranslation(element, vector) {
	setTransformation(element, vector, 0);
}

function setScale(element, vector) {
	setTransformation(element, vector, 1);
}

function setRotation(element, vector) {
	setTransformation(element, vector, 2);
}

function setColor(element, vector) {
	setTransformation(element, vector, 3);
}

function translate(element, vector) {
	incrementTransformation(element, vector, 0);
}

function scale(element, vector) {
	incrementTransformation(element, vector, 1);
}

function rotate(element, vector) {
	incrementTransformation(element, vector, 2);
}

function color(element, vector) {
	incrementTransformation(element, vector, 3);
}

function transform(element, type, vector) {

	initialize(element);

	element.dimensions.transforms.push({ type: type, vector: vector });
}

function getMagnitude(vector) {

	let sum = 0;

	vector.forEach((item) => { sum += Math.pow(item, 2); });

	return Math.sqrt(sum);
}

function getVector(vector, magnitude) {

	let newVector = [];

	let current = getMagnitude(vector);

	for(let i = 0; i < vector.length; i++)
		newVector.push((vector[i] / current) * magnitude);

	return newVector;
}

function operateVectors(args, operation) {

	if(args.length == 0)
		return 0;

	if(!Array.isArray(args[0]))
		return args.reduce((a, b) => operation(a, b), 0);

	let vector = args[0];

	args.slice(1).forEach((item) => {
		
		for(let i = 0; i < item.length; i++) {

			if(i > vector.length)
				vector.push(item[i]);

			else
				vector[i] = operation(vector[i], item[i]);
		}
	});

	return vector;
}

function addVectors() {
	return operateVectors(Array.from(arguments), (a, b) => { return a + b; });
}

function subtractVectors() {
	return operateVectors(Array.from(arguments), (a, b) => { return a - b; });
}

function multiplyVectors() {
	return operateVectors(Array.from(arguments), (a, b) => { return a * b; });
}

// STUB - ANIMATION INTERPOLATION FUNCTIONS

module.exports = {
	isHTMLNode,
	fullscreen,
	getDimensions,
	initialize,
	getAbsoluteTransforms,
	render,
	setTransformation,
	incrementTransformation,
	setTranslation,
	setScale,
	setRotation,
	setColor,
	translate,
	scale,
	rotate,
	color,
	transform,
	getMagnitude,
	getVector,
	operateVectors,
	addVectors,
	subtractVectors,
	multiplyVectors
};