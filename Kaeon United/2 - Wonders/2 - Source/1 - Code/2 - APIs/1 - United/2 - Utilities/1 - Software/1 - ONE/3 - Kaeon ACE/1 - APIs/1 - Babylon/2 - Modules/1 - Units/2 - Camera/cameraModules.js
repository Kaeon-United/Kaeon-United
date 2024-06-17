var one = require("kaeon-united")("one");

var camera = {

	controlOn: false,

	onDeserialize: function(core, ace, entity) {

		if(one.get(ace, "camera control").length > 0)
			this.controlOn = true;
	},

	onUpdate: function(core, delta) {

		if(!this.controlOn)
			return;

		if(core.input.pc.keyboard.includes("left")) { // LEFT
			core.camera.rotation.x -= .015 * Math.sin(-core.camera.rotation.z);
			core.camera.rotation.y -= .015 * Math.cos(-core.camera.rotation.z);
		}

		if(core.input.pc.keyboard.includes("right")) { // RIGHT
			core.camera.rotation.x += .015 * Math.sin(-core.camera.rotation.z);
			core.camera.rotation.y += .015 * Math.cos(-core.camera.rotation.z);
		}

		if(core.input.pc.keyboard.includes("up")) { // UP
			core.camera.rotation.x -= .015 * Math.cos(-core.camera.rotation.z);
			core.camera.rotation.y += .015 * Math.sin(-core.camera.rotation.z);
		}

		if(core.input.pc.keyboard.includes("down")) { // DOWN
			core.camera.rotation.x += .015 * Math.cos(-core.camera.rotation.z);
			core.camera.rotation.y -= .015 * Math.sin(-core.camera.rotation.z);
		}

		if(core.input.pc.keyboard.includes("s")) { // S
			core.camera.position.x += .25 * Math.sin(-core.camera.rotation.y) * Math.cos(-core.camera.rotation.x);
			core.camera.position.y -= .25 * Math.sin(-core.camera.rotation.x);
			core.camera.position.z -= .25 * Math.cos(-core.camera.rotation.y) * Math.cos(-core.camera.rotation.x);
		}

		if(core.input.pc.keyboard.includes("w")) { // W
			core.camera.position.x -= .25 * Math.sin(-core.camera.rotation.y) * Math.cos(-core.camera.rotation.x);
			core.camera.position.y += .25 * Math.sin(-core.camera.rotation.x);
			core.camera.position.z += .25 * Math.cos(-core.camera.rotation.y) * Math.cos(-core.camera.rotation.x);
		}

		if(core.input.pc.keyboard.includes("d")) { // D
			core.camera.position.x += .25 * Math.cos(-core.camera.rotation.y) * Math.cos(-core.camera.rotation.z);
			core.camera.position.y -= .25 * Math.sin(-core.camera.rotation.z);
			core.camera.position.z += .25 * Math.sin(-core.camera.rotation.y) * Math.cos(-core.camera.rotation.z);
		}

		if(core.input.pc.keyboard.includes("a")) { // A
			core.camera.position.x -= .25 * Math.cos(-core.camera.rotation.y) * Math.cos(-core.camera.rotation.z);
			core.camera.position.y += .25 * Math.sin(-core.camera.rotation.z);
			core.camera.position.z -= .25 * Math.sin(-core.camera.rotation.y) * Math.cos(-core.camera.rotation.z);
		}

		if(core.input.pc.keyboard.includes("e")) { // E
			core.camera.position.x += .25 * Math.sin(-core.camera.rotation.y) * Math.sin(-core.camera.rotation.x);
			core.camera.position.y += .25 * Math.cos(-core.camera.rotation.x + core.camera.rotation.z);
			core.camera.position.z -= .25 * Math.cos(-core.camera.rotation.y) * Math.sin(-core.camera.rotation.x);
		}

		if(core.input.pc.keyboard.includes("q")) { // Q
			core.camera.position.x -= .25 * Math.sin(-core.camera.rotation.y) * Math.sin(-core.camera.rotation.x)// * Math.sin(-core.camera.rotation.z);
			core.camera.position.y -= .25 * Math.cos(-core.camera.rotation.x);
			core.camera.position.z += .25 * Math.cos(-core.camera.rotation.y) * Math.sin(-core.camera.rotation.x)// * Math.sin(-core.camera.rotation.z);
		}

		/*

		if(core.input.pc.keyboard.includes("shiftleft")) // SHIFT
			core.camera.rotation.z += .015;

		if(core.input.pc.keyboard.includes("space")) // SPACE
			core.camera.rotation.z -= .015;

		*/

		if(core.camera.rotation.x > Math.PI / 2 - .001)
			core.camera.rotation.x = Math.PI / 2 - .001;

		else if(core.camera.rotation.x < -Math.PI / 2 + .001)
			core.camera.rotation.x = -Math.PI / 2 + .001;
	}
};

module.exports = [
	camera
];