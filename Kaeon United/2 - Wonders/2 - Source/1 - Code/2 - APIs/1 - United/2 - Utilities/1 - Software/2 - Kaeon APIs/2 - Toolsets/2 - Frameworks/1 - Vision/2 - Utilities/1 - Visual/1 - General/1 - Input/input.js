function cleanKey(key) {

	return key.
		split("Key").join("").
		split("Digit").join("").
		split("Arrow").join("").
		toLowerCase();
}

function addInput(element, input, onChange) {

	if(input == null) {

		element.input = { };

		input = element.input;
	}

	input = typeof input == "object" ? input : { };

	input.pc = {
		keyboard: [],
		mouse: {
			position: {
				x: 0,
				y: 0
			},
			buttons: {
				left: false,
				middle: false,
				right: false
			},
			scroll: 0
		}
	};

	onChange = onChange != null ? onChange : () => { };

	element.addEventListener(
		"keydown",
		function(event) {

			let previous = JSON.parse(JSON.stringify(input));
			
			if(!input.pc.keyboard.includes(cleanKey(event.code)))
				input.pc.keyboard.push(cleanKey(event.code));

			onChange(previous, input);
		}
	);

	element.addEventListener(
		"keyup",
		function(event) {

			let previous = JSON.parse(JSON.stringify(input));

			for(let i = 0; i < input.pc.keyboard.length; i++) {
				
				if(input.pc.keyboard[i] == cleanKey(event.code)) {

					input.pc.keyboard.splice(i, 1);

					i--;
				}
			}

			onChange(previous, input);
		}
	);

	element.addEventListener(
		"mousedown",
		function(event) {

			let previous = JSON.parse(JSON.stringify(input));
			
			if(event.button == 0)
				input.pc.mouse.buttons.left = true;
			
			if(event.button == 1)
				input.pc.mouse.buttons.middle = true;
			
			if(event.button == 2)
				input.pc.mouse.buttons.right = true;

			onChange(previous, input);
		}
	);

	element.addEventListener(
		"mouseup",
		function(event) {

			let previous = JSON.parse(JSON.stringify(input));

			if(event.button == 0)
				input.pc.mouse.buttons.left = false;
			
			if(event.button == 1)
				input.pc.mouse.buttons.middle = false;
			
			if(event.button == 2)
				input.pc.mouse.buttons.right = false;

			onChange(previous, input);
		}
	);

	element.addEventListener(
		"wheel",
		function(event) {

			let previous = JSON.parse(JSON.stringify(input));

			input.pc.mouse.scroll = event.deltaY;

			setTimeout(
				function() {
					input.pc.mouse.scroll = 0;
				},
				1000 / 60
			);

			onChange(previous, input);
		}
	);
}

module.exports = {
	addInput
};