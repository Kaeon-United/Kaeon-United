if(state["0"].output.metadata == null)
	state["0"].output.metadata = { };

let metadata = state["0"].output.metadata;

if(metadata.schedule == null)
	metadata.schedule = { };

if(metadata.schedule.sequences == null)
	metadata.schedule.sequences = [];

if(metadata.schedule.intervals == null)
	metadata.schedule.intervals = [];

let active = false;

let newState = JSON.parse(JSON.stringify(state));

for(let i = 0; i < metadata.schedule.sequences.length; i++) {

	if(metadata.schedule.sequences[i].delta == null)
		metadata.schedule.sequences[i].delta = 0;
	
	metadata.schedule.sequences[i].delta -= delta / 1000;
	
	if(metadata.schedule.sequences[i].delta > 0)
		return;

	active = true;
	
	let operation = metadata.schedule.sequences[i].sequence[0].operation;
	
	if(metadata.schedule.sequences[i].sequence[0].delta != null) {

		metadata.schedule.sequences[i].delta =
			metadata.schedule.sequences[i].sequence[0].delta;
	}
	
	metadata.schedule.sequences[i].sequence =
		metadata.schedule.sequences[i].sequence.slice(1);
	
	Object.keys(operation).forEach((key) => {
		Object.assign(newState[key], operation[key]);
	});
	
	if(metadata.schedule.sequences[i].sequence.length == 0) {

		metadata.schedule.sequences.splice(i, 1);

		i--;
	}
}

metadata.schedule.intervals.forEach((interval) => {

	if(interval.delta == null)
		interval.delta = 0;

	if(interval.deltaCount == null)
		interval.deltaCount = 0;
	
	interval.deltaCount -= delta / 1000;
	
	if(interval.deltaCount > 0)
		return null;

	active = true;

	interval.deltaCount = interval.delta;

	if(interval.operation == null)
		interval.operation = "";
	
	Object.assign((new Function(interval.operation))(state), newState);
});

if(active) {

	newState["0"].output.metadata =
		JSON.parse(JSON.stringify(state["0"].output.metadata));
	
	return JSON.stringify(newState, null, "\t");
}