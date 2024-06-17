window.speechSynthesis.getVoices();

var recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.listening = false;

function speak(text, settings) {

	setTimeout(
		function() {
	
			if(text.trim() == "")
				return;
		
			settings = settings != null ? settings : { };

			settings.voice =
				settings.voice != null ?
					settings.voice :
					"Microsoft Mark - English (United States)";

			settings.voice = settings.voice.trim().toLowerCase();
		
			let voices = window.speechSynthesis.getVoices();
			let utterance = new SpeechSynthesisUtterance(text);
		
			for(let i = 0; i < voices.length; i++) {
		
				if(voices[i].voiceURI.toLowerCase() == settings.voice) {
		
					utterance.voice = voices[i];
		
					break;
				}
			}
		
			utterance.pitch = settings.pitch != null ? settings.pitch : 1;
			utterance.rate = settings.rate != null ? settings.rate : 1;
		
			window.speechSynthesis.speak(utterance);
		},
		1
	);
}

function isSpeaking() {
	return window.speechSynthesis.speaking;
}

function stopSpeaking() {
	window.speechSynthesis.canel();
}

function listen(callback) {

	callback = Array.isArray(callback) ? callback : [callback];

	if(recognition.listening)
		recognition.abort();

	recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	
	recognition.onresult = function(event) {

		for(let i = 0; i < callback.length; i++) {

			callback[i](
				event.results[event.results.length - 1][0].transcript.trim()
			);
		}
	}
	
	recognition.onend = function(event) {

		setTimeout(() => {
			listen(callback);
		}, 100);
	}
	
	recognition.start();

	recognition.listening = true;
}

function stopListening() {

	if(recognition.listening)
		recognition.abort();

	recognition.listening = false;
}

function getVoices() {

	let voices = window.speechSynthesis.getVoices();
	let voiceList = [];

	for(let i = 0; i < voices.length; i++)
		voiceList.push(voices[i].voiceURI);

	voiceList.sort();

	if(voiceList.length > 0)
		return voiceList;

	return [
		"Google Bahasa Indonesia",
		"Google Deutsch",
		"Google Nederlands",
		"Google UK English Female",
		"Google UK English Male",
		"Google US English",
		"Google español",
		"Google español de Estados Unidos",
		"Google français",
		"Google italiano",
		"Google polski",
		"Google português do Brasil",
		"Google русский",
		"Google हिन्दी",
		"Google 國語（臺灣）",
		"Google 日本語",
		"Google 한국의",
		"Google 普通话（中国大陆）",
		"Google 粤語（香港）",
		"Microsoft David - English (United States)",
		"Microsoft Mark - English (United States)",
		"Microsoft Zira - English (United States)"
	];
}

module.exports = {
	speak,
	isSpeaking,
	stopSpeaking,
	listen,
	stopListening,
	getVoices
};