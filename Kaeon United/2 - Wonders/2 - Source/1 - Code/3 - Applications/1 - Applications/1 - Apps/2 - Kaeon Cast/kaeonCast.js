var moduleDependencies = {
	cache: "https://ghost-cache.vercel.app/",
	icon: "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/2%20-%20Assets/1%20-%20Visual/1%20-%20Images/1%20-%20Iconography/2%20-%20Kaeon%20United/2%20-%20Kaeon%20United/Kaeon%20United%20Logo.png"
};

var dimensions = use("kaeon-united")("dimensions");
var http = use("kaeon-united")("httpUtils");
var io = use("kaeon-united")("io");
var media = use("kaeon-united")("generalReference")("media");
var vision = use("kaeon-united")("vision");
var widgets = use("kaeon-united")("widgets");

vision.setFavicon(moduleDependencies.icon);

document.title = "Kaeon Cast";
 
widgets.createStartScreen(() => {
 
	dimensions.fullscreen(document.documentElement);
 
	io.open(moduleDependencies.cache +
		"?key=" +
		http.getURLArguments(window.location.href)["key"] +
		"&value=");
 
	let time = -1;
	let playing = -1;
 
	document.documentElement.style.overflow = "hidden";
 
	setInterval(() => {
 
		try {
 
			let ping = io.open(moduleDependencies.cache +
				"?key=" +
				http.getURLArguments(window.location.href)["key"]);
 
			if(ping != "") {
 
				ping = JSON.parse(ping);
 
				if(ping.time != time) {
 
					time = ping.time;
 
					media.stop(playing);
 
					if(ping.value != "") {
 
						playing = media.play(ping.value);

						dimensions.fullscreen(document.documentElement);
					}
				}
			}
		}
 
		catch(error) {
 
		}
	}, 1000);
});