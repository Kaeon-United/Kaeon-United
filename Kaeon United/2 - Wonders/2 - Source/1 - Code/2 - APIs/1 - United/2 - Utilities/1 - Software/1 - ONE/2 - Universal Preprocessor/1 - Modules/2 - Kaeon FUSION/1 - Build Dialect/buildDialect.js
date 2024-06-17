var io = require("kaeon-united")("io");
var one = require("kaeon-united")("one");
var oneSuite = require("kaeon-united")("onePlus");
var philosophersStone = require("kaeon-united")("philosophersStone");

function buildDialect() {

	this.name = "default";

	var reference = this;
	
	this.standard = function(packet) {
		
		if((("" + packet[0]).toLowerCase() != "build" ||
			("" + packet[0]).toLowerCase() == "derive") ||
			("" + packet[1]).toLowerCase() != reference.getName()) {
			
			return null;
		}
		
		let files = [];
		let code = packet[2];
		let args = packet.length > 3 ? packet[3] : [];
		let filePath = "";
		
		if(args.length > 0) {
			
			if(args[0] != null)
				filePath = "" + args[0];
			
			args.splice(0, 1);
		}
		
		let names = [];
		
		if(args.length > 0) {
			
			try {
				names = args[0];
			}
			
			catch(error) {
				
			}
			
			args.splice(0, 1);
		}
		
		if(("" + packet[0]).toLowerCase() == "build") {
			
			let codeElements = [];
			
			for(let i = 0; i < code.length; i++)
				codeElements.push(oneSuite.read("" + code[i]));
			
			let groups = getGroups(codeElements);
			
			for(let i = 0; i < groups.length; i++)
				reference.build(files, groups[i], getGroupName(names, i), i, args);
		}
		
		else {
			
			let codeStrings = [];
			
			for(let i = 0; i < code.length; i++)
				codeStrings.push("" + code[i]);
			
			let groups = getGroups(codeStrings);
			
			for(let i = 0; i < groups.length; i++)
				reference.derive(files, groups[i], getGroupName(names, i), i, args);
		}
		
		let workspace = "";
		
		if(filePath.length == 0) {
			
			try {
				workspace = "" + philosophersStone.call(reference, "Get Build Workspace")[0];
			}
			
			catch(error) {
				
			}
		}
		
		let toExport = true;
		
		for(let i = 0; i < args.length && toExport; i++) {
			
			if(("" + args[i]).toLowerCase() == "return")
				toExport = false;
		}
		
		if(toExport) {
			
			for(let i = 0; i < files.length; i++)
				io.save(files[i][1], workspace + filePath + files[i][0]);
		}
		
		return files;
	}
	
	this.getName = function() {
		return reference.name.toLowerCase();
	}
	
	this.getInjection = function(meta) {
		
		try {
			
			let injection = one.get(meta, "Injection")[0];
			let use = one.get(meta, "Use")[0];
			
			if(injection != null)
				return injection.children[0].content;
			
			if(use != null) {
				
				let dialect = one.get(use, "Dialect")[0].children[0].content;
				
				let codeElement = one.copy(one.get(use, "Code")[0]);
				codeElement.content = "";
				
				let code = [codeElement];
				
				let args = [];
				
				if(one.get(use, "Arguments").length > 0)
					args = one.get(use, "Arguments")[0].children.slice(0);
	
				args.push("");
				args.push([]);
				args.push("Return");
				
				let files =
					philosophersStone.call(
						reference,
						"Build",
						dialect,
						code,
						args)[0];
				
				return files[0][1];
			}
		}
		
		catch(error) {
			
		}
		
		return null;
	}
	
	this.build = function(files, code, name, index, args) {
		
	}
	
	this.derive = function(files, code, name, index, args) {
		
	}
}
	
function getGroups(items) {
	
	let groups = [];
	
	for(let i = 0; i < items.length; i++) {
		
		let group = [];
		group.push(items[i]);
		
		groups.push(group);
	}
	
	return groups;
}

function getGroupName(names, index) {
	
	if(index < names.length)
		return "" + names[index];
	
	return null;
}

function category() {
	this.name = "";
	this.objects = [];
}

module.exports = {
	buildDialect,
	getGroups,
	getGroupName,
	category
};