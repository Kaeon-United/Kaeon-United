var moduleUtilities = require("kaeon-united")("moduleUtilities");
var one = require("kaeon-united")("one");

var ball = {

	onDeserialize: function(core, ace, entity) {

		if(one.get(ace, "ball").length > 0) {
	
			let ball = BABYLON.MeshBuilder.CreateSphere(
				"sphere",
				{ diameter: 2 },
				core.scene
			);

			entity.components.push(ball);
		}
	}
};

var ground = {

	onDeserialize: function(core, ace, entity) {

		if(one.get(ace, "ground").length > 0) {
			
			let item = one.get(ace, "ground")[0];

			let texture = moduleUtilities.getItem(item, "texture");
			let map = moduleUtilities.getItem(item, "map");
			let subdivisions = Number(moduleUtilities.getItem(item, "subdivisions", "1000"));
			let width = Number(moduleUtilities.getItem(item, "width", "1"));
			let length = Number(moduleUtilities.getItem(item, "length", "1"));
			let height = Number(moduleUtilities.getItem(item, "height", "0"));

			var groundMaterial = new BABYLON.StandardMaterial("ground", core.scene);

			if(texture != null)
				groundMaterial.diffuseTexture = new BABYLON.Texture(texture, core.scene);

			let ground = null;

			if(map != null) {
				
				ground = BABYLON.Mesh.CreateGroundFromHeightMap(
					"ground",
					map,
					width,
					length,
					subdivisions,
					0,
					height,
					core.scene,
					false,
					function() {
						
					}
				);

				ground.material = groundMaterial;
			}

			else {

				ground = BABYLON.MeshBuilder.CreateGround(
					"ground",
					{
						width: width,
						height: length,
						subdivisions: 4
					},
					core.scene
				);

				ground.material = groundMaterial;
			}

			entity.components.push(ground);
		}
	}
};

var skybox = {

	skyboxes: [],

	onDeserialize: function(core, ace, entity) {

		if(one.get(ace, "skybox").length > 0) {
		
			var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 10000.0 }, core.scene);
	
			var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", core.scene);
			
			skyboxMaterial.backFaceCulling = false;

			skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
				one.get(
					one.get(ace, "skybox")[0],
					"source"
				)[0].children[0].content, core.scene);

			skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			skyboxMaterial.disableLighting = true;
	
			skybox.material = skyboxMaterial;

			this.skyboxes.push(skybox);

			entity.components.push(skybox);
		}	
	},

	onUpdate: function(core, delta) {
		
		for(let i = 0; i < this.skyboxes.length; i++)
			this.skyboxes[i].position = core.camera.position;
	}
};

module.exports = [
	ball,
	ground,
	skybox
];