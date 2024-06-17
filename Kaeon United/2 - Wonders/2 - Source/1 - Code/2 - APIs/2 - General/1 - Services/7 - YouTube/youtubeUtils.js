var io = require("kaeon-united")("io");
var vision = require("kaeon-united")("vision");

function getPlaying() {

	play.state =
		play.state != null ?
			play.state : { };

	return JSON.parse(JSON.stringify(play.state));
}

function play(id, options, element) {

	play.index =
		play.index != null ?
			play.index : -1;

	play.state =
		play.state != null ?
			play.state : { };

	play.index++;

	options = options != null ? options : { };

	options.style = options.style != null ? options.style : {
		position: "absolute",
		left: "0%",
		top: "0%",
		width: "100%",
		height: "100%",
		border: "none"
	};

	let player = vision.create({
		tag: "iframe",
		style: options.style,
		attributes: {
			src: "https://www.youtube.com/embed/" +
				id +
				"?autoplay=1" +
				(options.loop ?
					"&playlist=" +
						(options.list != null ? options.list : id) +
						"&loop=1" :
					""
				) +
				(options.start != null ?
					"&start=" + options.start :
					""
				),
			allow: "autoplay"
		}
	});

	play.state["" + play.index] = player;

	vision.extend(
		element != null ?
			element :
			document.documentElement,
		player
	);

	return "" + play.index;
}

function playAudio(id, options, element) {

	options = options != null ? options : { };
	options.style = options.style != null ? options.style : { };

	options.style.display = "none";

	return play(id, options, element);
}

function search(query) {

	return [
		...new Set(
			io.open(
				"https://www.youtube.com/results?search_query=" +
					query.toLowerCase().split(" ").join("+")
			).split("Endpoint\":{\"videoId\":\"").map((item, index) => {
		
				return index > 0 && index % 2 == 0 ?
					item.substring(0, item.indexOf("\"")) :
					null;
			}).filter((item) => {
				return item != null;
			})
		)
	];
}

function stop(index) {

	try {
		vision.remove(play.state[index]);
	}

	catch(error) {
		
	}

	try {
		delete play.state[index];
	}

	catch(error) {
		
	}
}

module.exports = {
	methods: {
		getPlaying,
		play,
		playAudio,
		search,
		stop
	},
	interfaces: {
		media: {
			name: "youtube",
			methods: {
				getPlaying,
				play,
				playAudio,
				search,
				stop
			}
		}
	}
};