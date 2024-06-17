var moduleDependencies = {
	cache: "https://ghost-cache.vercel.app/",
	icon: "https://raw.githubusercontent.com/Atlas-of-Kaeon/The-Principles-Library-of-Kaeon/master/The%20Principles%20Library%20of%20Kaeon/3%20-%20Wonders/1%20-%20Angaian/2%20-%20Images/2%20-%20Angaian%20Crest/Angaian%20Crest.png"
};

var dimensions = require("kaeon-united")("dimensions");
var http = require("kaeon-united")("httpUtils");
var io = require("kaeon-united")("io");
var media = require("kaeon-united")("generalReference")("media");
var vision = require("kaeon-united")("vision");
var widgets = require("kaeon-united")("widgets");

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