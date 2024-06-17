var inputUtils = require("kaeon-united")("inputUtils");
var one = require("kaeon-united")("one");
var oneSuite = require("kaeon-united")("oneSuite");
var philosophersStone = require("kaeon-united")("philosophersStone");
var media = require("kaeon-united")("generalReference")("media");

var audio = {

	tracks: [],

	onDeserialize: function(core, ace, entity) {

		if(one.get(ace, "audio")[0] != null) {

			let medium = "file";

			if(one.get(one.get(ace, "audio")[0], "medium")[0] != null)
				medium = one.get(one.get(ace, "audio")[0], "medium")[0].children[0].content.trim().toLowerCase();
	
			let source = one.get(one.get(ace, "audio")[0], "source")[0].children[0].content;

			if(medium == "file") {

				let track = new Audio(source);
				track.loop = true;
	
				this.tracks.push(track);
	
				track.play();
			}

			if(medium == "media")
				media.playAudio(source, { loop: true });
		}
	}
};

var cursor = {

	onDeserialize: function(core, ace, entity) {

		if(one.get(ace, "cursor")[0] != null) {
	
			if(one.get(one.get(ace, "cursor")[0], "none")[0] != null)
				core.element.style.cursor = "none";
		}
	}
};

var input = {

	onDefault: function(core) {
		
		core.input = { };

		inputUtils.addInput(core.element, core.input);
	}
};

var id = {

	reference: { },
	tags: ["ID"],

	onDeserialize: function(core, ace, entity) {

		if(one.get(ace, "id").length > 0)
			this.reference[one.get(ace, "id")[0].children[0].content] = entity;

	}
}

var light = {

	onDefault: function(core) {
		new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), core.scene);
		new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), core.scene);
	}
};

var model = {

	onDeserialize: function(core, ace, entity) {

		if(one.get(ace, "model").length > 0) {
			
			let source = one.get(one.get(ace, "model")[0], "source")[0].children[0].content;
	
			let model = BABYLON.SceneLoader.ImportMesh("", source.substring(0, source.lastIndexOf("/") + 1), source.substring(source.lastIndexOf("/") + 1), core.scene, function (meshes) {          
				entity.components = entity.components.concat(meshes);
			});
		}
	}
};

var move = {

	id: null,

	onDefault: function(core) {
		
		move.id = philosophersStone.retrieve(
			philosophersStone.traverse(core),
			function(item) {
				return philosophersStone.isTagged(item, "ID");
			}
		)[0];


	},

	onUpdate: function(core, delta) {
		// console.log(delta);
	},

	onCall: function(core, data) {
		
		let command = oneSuite.read("" + data);

		if(one.get(command, "move").length > 0) {
			
			let item = one.get(command, "move")[0].children[0];

			let entity = move.id.reference[item.content];

			for(let i = 0; i < entity.components.length; i++) {
				
				if(entity.components[i].position != null) {
					entity.components[i].position.x += Number(item.children[0].content);
					entity.components[i].position.y += Number(item.children[1].content);
					entity.components[i].position.z += Number(item.children[2].content);
				}
			}
		}
	}
};

var script = {

	scripts: [], // { language (optional, same as universal preprocessor), code }

	onDeserialize: function(core, ace, entity) {

		if(one.get(ace, "script").length > 0)
			this.scripts = this.scripts.concat(one.get(ace, "script"));
	},

	onUpdate: function(core, delta) {
		
		for(let i = 0; i < this.scripts.length; i++) {
			
			let start = one.get(this.scripts[i], "start")[0];
			let update = one.get(this.scripts[i], "update")[0];

			if(!this.scripts[i].started)
				this.executeSubscript(start, core, delta);

			this.executeSubscript(update, core, delta);

			this.scripts[i].started = true;
		}
	},

	executeSubscript: function(subscript, core, delta) {

		if(subscript == null)
			return;

		let language = one.get(subscript, "language")[0].children[0].content.toLowerCase().trim().split(" ").join("");
		let source = one.get(subscript, "source")[0].children[0].content;

		try {

			if(language == "kf" || language == "kaeonfusion")
				oneSuite.process(source);

			if(language == "js" || language == "javascript")
				((core, delta) => { eval(source); })(core, delta);
		}

		catch(error) {

		}
	}
};

module.exports = [
	audio,
	cursor,
	id,
	input,
	light,
	model,
	move,
	script
];