var one = require("kaeon-united")("one");
var philosophersStone = require("kaeon-united")("philosophersStone");

function FUSION() {

	philosophersStone.abide(this, new philosophersStone.standardMedium());
	
	this.running = false;

	this.threads = [];

	this.fusionUnits = [];
	this.updated = false;

	this.tags.push("FUSION");

	this.standard = function(packet) {
		
		if(("" + packet[0]).toLowerCase() == "update")
			this.update();
		
		else if(("" + packet[0]).toLowerCase() == "stop")
			this.running = false;

		return null;
	}

	this.update = function() {
		
		var units =
			philosophersStone.retrieve(
				philosophersStone.traverse(this),
				function(item) {
					return philosophersStone.isTagged(item, "FUSION Unit");
				}
			);

		for(var i = 0; i < units.length; i++) {
			
			for(var j = i + 1; j < units.length; j++) {
				
				if(units[i] === units[j]) {

					units.splice(j, 1);

					j--;
				}
			}
		}

		this.fusionUnits = units;

		this.updated = true;
	}

	this.process = function(element) {

		this.running = true;
		this.threads = [];

		this.update();

		this.internalProcess(element, true);

		this.fusionUnits = [];
		this.running = false;
	}

	this.internalProcess = function(element, internal) {

		if(!internal) {

			this.running = true;

			this.update();
		}

		this.threads.push(element);

		element.state = [element, [[], []], false];
		element.stack = [];

		while(this.running && this.threads.length > 0) {

			for(let i = 0; i < this.threads.length; i++) {

				if(this.threads[i].removed) {

					this.threads.splice[i];
					i--;

					continue;
				}

				if(this.threads[i].paused)
					continue;

				if(this.threads[i].stack == null)
					this.threads[i].stack = [];
				
				let item = this.threads[i].stack.length == 0 ?
					this.threads[i] :
					this.threads[i].stack[this.threads[i].stack.length - 1];

				if(item.state == null)
					item.state = [item, [[], []], false];

				item.state = this.tick(item.state);

				if(item.state == null) {

					if(this.threads[i].stack.length == 0) {

						this.threads.splice(i, 1);

						i--;
					}

					else
						this.popThread(this.threads[i]);
				}
			}
		}
	}

	this.tick = function(state) {

		let currentElement = state[0];
		let processed = state[1];
		let bubbleUp = state[2];

		this.updated = false;

		var denied = this.isDenied(currentElement);

		var verifiedFUSIONUnits =
			!denied ?
				this.getVerifiedFUSIONUnits(currentElement) :
				[];

		if(!bubbleUp) {
			
			var trickleDown = this.trickleDown(verifiedFUSIONUnits, currentElement);

			if(trickleDown && currentElement.children.length > 0) {
				
				currentElement = currentElement.children[0];
				processed.push([]);

				return [currentElement, processed, bubbleUp];
			}
		}

		var processedArguments = processed[processed.length - 2];
		var newArguments = processed[processed.length - 1];

		var object = this.processElement(verifiedFUSIONUnits, currentElement, newArguments);
		verifiedFUSIONUnits = this.updateVerifiedUnits(verifiedFUSIONUnits, currentElement, denied);

		var terminated = this.terminate(verifiedFUSIONUnits, currentElement, newArguments);
		verifiedFUSIONUnits = this.updateVerifiedUnits(verifiedFUSIONUnits, currentElement, denied);

		var added = this.isAdded(verifiedFUSIONUnits, currentElement, newArguments);
		verifiedFUSIONUnits = this.updateVerifiedUnits(verifiedFUSIONUnits, currentElement, denied);

		var jumpElement = this.jump(verifiedFUSIONUnits, currentElement, newArguments);

		if(!denied && added)
			processedArguments.push(object);

		processed[processed.length - 1] = [];

		if(terminated)
			return null;

		bubbleUp = false;

		if(jumpElement == null) {

			var index = one.getIndex(currentElement);

			if(currentElement.parent == null)
				return null;

			if(index < currentElement.parent.children.length - 1)
				currentElement = currentElement.parent.children[index + 1];

			else {
				
				currentElement = currentElement.parent;
				bubbleUp = true;

				processed.splice(processed.length - 1, 1);
			}
		}

		else {

			for(var i = 0; i < processed.length; i++)
				processed[i] = [];

			currentElement = jumpElement;

			bubbleUp = false;
		}

		return [currentElement, processed, bubbleUp];
	}

	this.updateVerifiedUnits = function(
		verifiedFUSIONUnits,
		currentElement,
		denied) {
		
		var update = this.updated;
		this.updated = false;

		if(update) {
			
			return !denied ?
				this.getVerifiedFUSIONUnits(currentElement) :
				[];
		}

		return verifiedFUSIONUnits;
	}

	this.isDenied = function(element) {

		if(element.content == null)
			return false;
		
		var denied = false;
		
		for(var i = 0; i < this.fusionUnits.length; i++) {

			try {
				
				if(this.fusionUnits[i].deny(element))
					denied = true;
			}
			
			catch(error) {
				this.handleError(element, [], error);
			}
		}
		
		return denied;
	}

	this.getVerifiedFUSIONUnits = function(element) {

		var verifiedFUSIONUnits = [];
		
		for(var i = 0; i < this.fusionUnits.length; i++) {
			
			try {
				
				if(this.fusionUnits[i].verify(element))
					verifiedFUSIONUnits.push(this.fusionUnits[i]);
			}
			
			catch(error) {
				this.handleError(element, [], error);
			}
		}
		
		return verifiedFUSIONUnits;
	}

	this.trickleDown = function(
		verifiedFUSIONUnits,
		element) {
		
		var trickleDown = true;
		
		for(var i = 0; i < verifiedFUSIONUnits.length; i++) {
			
			var result = true;
			
			try {
				result = verifiedFUSIONUnits[i].trickleDown(element);
			}
			
			catch(error) {
				this.handleError(element, [], error);
			}
			
			if(!result)
				trickleDown = false;
		}
		
		return trickleDown;
	}

	this.processElement = function(
		verifiedFUSIONUnits,
		element,
		processed) {

		var object = null;
		
		for(var i = 0; i < verifiedFUSIONUnits.length; i++) {
			
			var newObject = null;
			
			try {
				newObject = verifiedFUSIONUnits[i].process(element, processed);
			}
			
			catch(error) {
				this.handleError(element, [], error);
			}
			
			if(newObject != null)
				object = newObject;
		}
		
		return object;
	}

	this.isAdded = function(
		verifiedFUSIONUnits,
		element,
		processed) {
		
		var isAdded = true;
		
		for(var i = 0; i < verifiedFUSIONUnits.length; i++) {
			
			var result = true;
			
			try {
				result = verifiedFUSIONUnits[i].isAdded(element, processed);
			}
			
			catch(error) {
				this.handleError(element, [], error);
			}
			
			if(!result)
				isAdded = false;
		}
		
		return isAdded;
	}

	this.terminate = function(
		verifiedFUSIONUnits,
		element,
		processed) {
		
		var terminate = false;
		
		for(var i = 0; i < verifiedFUSIONUnits.length; i++) {
			
			var result = false;
			
			try {
				result = verifiedFUSIONUnits[i].terminate(element, processed);
			}
			
			catch(error) {
				this.handleError(element, [], error);
			}
			
			if(result)
				terminate = true;
		}
		
		return terminate;
	}

	this.jump = function(
		verifiedFUSIONUnits,
		element,
		processed) {
		
		var defaultElement = null;
		var jumpElement = defaultElement;
		
		for(var i = 0; i < verifiedFUSIONUnits.length; i++) {
			
			var newJumpElement = defaultElement;
			
			try {
				newJumpElement = verifiedFUSIONUnits[i].jump(element, processed);
			}
			
			catch(error) {
				this.handleError(element, [], error);
			}
			
			if(defaultElement != newJumpElement)
				jumpElement = newJumpElement;
		}
		
		return jumpElement;
	}

	this.handleError = function(
		element,
		processed,
		error) {
		
		for(var i = 0; i < this.fusionUnits.length; i++) {
			
			try {
				this.fusionUnits[i].handleError(element, processed, error);
			}
			
			catch(error) {
				
			}
		}
	}

	this.getThread = function(element) {

		while(element != null) {

			for(let i = 0; i < this.threads.length; i++) {

				if(this.threads[i] === element ||
					this.threads[i].stack.includes(element)) {

					return this.threads[i];
				}
			}

			element = element.parent;
		}

		return null;
	}

	this.addThread = function(element) {
		this.threads.push(element);
	}

	this.setThread = function(element, paused) {
		this.getThread(element).paused = paused;
	}

	this.removeThread = function(element) {
		this.getThread(element).removed = true;
	}

	this.pushThread = function(element, subRoutine) {
		this.getThread(element).stack.push(subRoutine);
	}

	this.popThread = function(element) {

		this.getThread(element).stack.splice(
			this.getThread(element).stack.length - 1, 1);
	}
}

function FUSIONUnit() {

	philosophersStone.abide(this, new philosophersStone.standardMedium());
	
	this.tags.push("FUSION Unit");

	this.deny = function(element) {
		return false;
	}

	this.verify = function(element) {
		return false;
	}

	this.trickleDown = function(element) {
		return true;
	}

	this.process = function(element, processed) {
		return null;
	}

	this.isAdded = function(element, processed) {
		return true;
	}

	this.terminate = function(element, processed) {
		return false;
	}

	this.jump = function(element, processed) {
		return null;
	}

	this.handleError = function(element, processed, error) {
		
	}
}

module.exports = {

	FUSION,
	FUSIONUnit
};