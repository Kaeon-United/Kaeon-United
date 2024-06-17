var philosophersStone = require("kaeon-united")("philosophersStone");
var binaryMap = require("kaeon-united")("binaryMap");

function SOULEntity() {

	var reference = this;

	this.onInput = [];
	this.onOutput = [];
	this.onFeedback = [];

	this.input = function(string) {

		for(let i = 0; i < reference.onInput.length; i++)
			reference.onInput[i]("" + string);
	};

	this.output = function(string) {

		for(let i = 0; i < reference.onOutput.length; i++)
			reference.onOutput[i]("" + string);
	};

	this.feedback = function(score) {

		for(let i = 0; i < reference.onFeedback.length; i++)
			reference.onFeedback[i](Number("" + score));
	};
}

function addPulse(entity) {

	entity.onPulse = [];
	
	let interval = setInterval(
		function() {

			for(let i = 0; i < entity.onPulse.length; i++) {

				let output = entity.onPulse[i]();

				if(output != null)
					entity.output(output);
			}
		},
		1000 / 60
	);
}

function addRecord(entity) {

	entity.record = {
		inputs: [],
		outputs: [],
		feedbacks: []
	};
	
	entity.onInput.push(
		function(string) {

			entity.record.inputs.push(
				[
					string,
					(new Date()).getTime() / 1000
				]
			);
		}
	);
	
	entity.onOutput.push(
		function(string) {

			entity.record.outputs.push(
				[
					string,
					(new Date()).getTime() / 1000
				]
			);
		}
	);
	
	entity.onFeedback.push(
		function(score) {

			entity.record.feedbacks.push(
				[
					score,
					(new Date()).getTime() / 1000
				]
			);
		}
	);
}

function isRecordEmpty(entity) {

	if(entity.record == null)
		return true;

	return entity.record.feedbacks.length == 0 ||
		(entity.record.inputs.length == 0 &&
		entity.record.outputs.length == 0);
}

function addStarter(entity) {

	entity.onPulse.push(
		function() {
			
			if(!isRecordEmpty(entity))
				return null;

			return String.fromCharCode(Math.floor(Math.random() * 256));
		}
	);
}

function addCore(entity) {

	entity.onPulse.push(
		function() {
			
			if(isRecordEmpty(entity))
				return null;

			let data = [];
			let input = "";

			for(let i = 0; i < entity.record.feedbacks.length; i++) {

				let time = entity.record.feedbacks[i][1];

				let dataInput =
					entity.record.inputs.length != 0 ?
						entity.record.inputs[0][0] :
						"";

				for(let j = 1; j < entity.record.inputs.length; j++) {

					if(entity.record.inputs[j][1] > time) {

						dataInput = entity.record.inputs[j][0];

						break;
					}
				}

				let dataOutput =
					entity.record.outputs.length != 0 ?
						entity.record.outputs[0][0] :
						"";

				for(let j = 1; j < entity.record.outputs.length; j++) {

					if(entity.record.outputs[j][1] > time) {
						
						dataInput = entity.record.outputs[j][0];

						break;
					}
				}

				data.push(
					[
						dataInput,
						dataOutput,
						entity.record.feedbacks[i][0]
					]
				);
			}

			return binaryMap.generate(data, input);
		}
	);
}

function standardSOULEntity() {

	philosophersStone.abide(this, new SOULEntity());

	addPulse(this);
	addRecord(this);
	addStarter(this);
	addCore(this);
}

module.exports = {
	SOULEntity,
	addPulse,
	addRecord,
	addStarter,
	addCore,
	standardSOULEntity
}