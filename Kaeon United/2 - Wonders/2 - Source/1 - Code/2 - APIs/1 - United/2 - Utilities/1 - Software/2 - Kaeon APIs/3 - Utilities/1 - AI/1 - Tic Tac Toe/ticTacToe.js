function getBlank(state) {

	let blank = [];

	for(let i = 0; i < state.length; i++) {

		if(state.charAt(i) == "-")
			blank.push(i);
	}

	return blank;
}

function result(state, turn) {

	let wins = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	for(let i = 0; i < wins.length; i++) {

		if(state.charAt(wins[i][0]) == state.charAt(wins[i][1]) &&
			state.charAt(wins[i][1]) == state.charAt(wins[i][2])) {

			if(state.charAt(wins[i][0]) != "-") {
				
				return state.charAt(wins[i][0]) == turn ?
					turn :
					(turn == "X" ? "O" : "X");
			}
		}
	}

	return (getBlank(state).length == 0) ? "-" : null;
}

function game() {

	let state = "---------";
	
	let data = [];
	let turn = "X";

	while(result(state, turn) == null) {

		let moves = getBlank(state);
		let move = moves[Math.floor(Math.random() * moves.length)];

		data.push([state, "" + move]);

		state = state.substring(0, move) + turn + state.substring(move + 1);

		turn = turn == "X" ? "O" : "X";
	}

	return [result(state, turn), data];
}

function generate(games) {

	let data = { win: [], lose: [], draw: [] };

	for(let i = 0; i < games; i++) {

		let iteration = game(); // [result, [[state, move]...]]

		if(iteration[0] == "X")
			data.win = data.win.concat(iteration[1]);

		else if(iteration[0] == "O")
			data.lose = data.lose.concat(iteration[1]);

		else
			data.draw = data.draw.concat(iteration[1]);
	}

	return data;
}

module.exports = {
	generate
};