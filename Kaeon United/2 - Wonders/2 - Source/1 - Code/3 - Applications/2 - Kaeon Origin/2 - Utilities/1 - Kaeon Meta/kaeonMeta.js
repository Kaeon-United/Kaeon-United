var virtualSystem = use("kaeon-united")("virtualSystem");

if(window.fileSystem == null)
	virtualSystem.initiateVirtualSystemDefault();

[
	[
		"Storage://User/Applications/Processes/kaeonMeta/Management/metaDispatch.js",
		`
			let config = JSON.parse(fileSystem.getResource(arguments[0]));

			return config.dispatchers.map((item) => {

				return fileSystem.executeCommand(
					item +
						" \\"" +
						arguments[1] +
						"\\"" +
						(arguments[2] != null ? (" " + arguments[2]) : "")
				);
			}).filter((item) => {
				return item != null;
			});
		`
	],
	[
		"Storage://User/Applications/Processes/kaeonMeta/Management/metaInit.js",
		`
			let config = JSON.parse(fileSystem.getResource(arguments[0]));

			config.interfaces.forEach((item) => {
				
				fileSystem.executeCommand(
					item +
						" \\"" +
						arguments[0] +
						"\\""
				);
			});
		`
	],
	[
		"Storage://User/Applications/Processes/kaeonMeta/Management/metaConfig.json",
		`
			{
				"dispatch": "Storage://User/Applications/Processes/kaeonMeta/Management/metaDispatch.js",
				"dispatchers": [
					"Storage://User/Applications/Processes/kaeonMeta/Dispatchers/mediaDispatcher.js",
					"Storage://User/Applications/Processes/kaeonMeta/Dispatchers/chatDispatcher.js"
				],
				"interfaces": [
					"Storage://User/Applications/Processes/kaeonMeta/Interfaces/metaSpeech.js"
				]
			}
		`
	],
	[
		"Storage://User/Applications/Processes/kaeonMeta/Interfaces/metaSpeech.js",
		`
			let configPath = arguments[0];
			let config = JSON.parse(fileSystem.getResource(configPath));

			let speech = use("kaeon-united")("speech");
			let vision = use("kaeon-united")("vision");
			let widgets = use("kaeon-united")("widgets");
			let media = use("kaeon-united")("generalReference")("media");

			let tick = 1 / 60;
			let listening = 0;
			let interval = null;
			
			function startAssistant(que, effect) {
			
				que = que != null ? que : [
					"hey meta",
					"a meta",
					"play meta",
					"hey metta",
					"a metta",
					"play metta",
					"hey meda",
					"a meda",
					"play meda",
					"hey medda",
					"a medda",
					"play medda",
					"hey martha",
					"a martha",
					"play martha",
					"hey mother",
					"a mother",
					"play mother"
				];

				que = (Array.isArray(que) ? que : [que]).map((item) => {
					return item.toLowerCase();
				});

				effect = effect != null ? effect : "B14L61fYZlc"
			
				if(interval != null)
					return;
			
				speech.listen((text) => {
				
					if(que.includes(text.toLowerCase()) && listening == 0) {
				
						listening = 10;
				
						media.playAudio(effect);
				
						terminals[0].logContent("META RECEIVED: " + que[0]);
					}
			
					else {

						if(listening > 0) {
				
							terminals[0].logContent("META RECEIVED: " + text);

							listening = 0;
							
							fileSystem.executeCommand(
								config.dispatch +
									" \\"" +
									configPath +
									"\\" \\"" +
									text +
									"\\" speech"
							);
						}
					}

					log.scrollTop = log.scrollHeight;
				});
			
				interval = setInterval(() => {
				
					if(listening <= 0)
						return;
				
					listening -= tick;
				
					if(listening < 0)
						listening = 0;
				}, tick * 1000);
			}
			
			function stopAssistant() {
			
				if(interval == null)
					return;
			
				speech.stopListening();
			
				clearInterval(interval);
				interval = null;
			}

			widgets.createStartScreen(() => {
				startAssistant();
			});
		`
	],
	[
		"Storage://User/Applications/Processes/kaeonMeta/Dispatchers/mediaDispatcher.js",
		`
			if(arguments[0].toLowerCase().startsWith("play ")) {

				fileSystem.executeCommand(
					"Storage://User/Applications/Processes/kaeonMeta/Apps/playMediaSong.js \\"" +
						arguments[0].substring(5) +
						"\\""
				);
			}

			if(arguments[0].toLowerCase().startsWith("stop"))
				fileSystem.executeCommand("Storage://User/Applications/Processes/kaeonMeta/Apps/stopMediaSong.js");
				
			if(arguments[0].toLowerCase().startsWith("cast ")) {

				fileSystem.executeCommand(
					"Storage://User/Applications/Processes/kaeonMeta/Apps/castMediaVideo.js \\"" +
						arguments[0].substring(5) +
						"\\""
				);
			}
		`
	],
	[
		"Storage://User/Applications/Processes/kaeonMeta/Dispatchers/chatDispatcher.js",
		`
			if(!arguments[0].toLowerCase().startsWith("cast ") &&
				!arguments[0].toLowerCase().startsWith("play ") &&
				!arguments[0].toLowerCase().startsWith("stop")) {

				if(arguments.length > 1) {

					fileSystem.executeCommand(
						"Storage://User/Applications/Processes/kaeonMeta/Apps/chatSpeak.js \\"" +
							arguments[0] +
							"\\""
					);
				}

				else {

					return fileSystem.executeCommand(
						"Storage://User/Applications/Processes/kaeonMeta/Apps/chatRelay.js \\"" +
							arguments[0] +
							"\\""
					);
				}
			}
		`
	],
	[
		"Storage://User/Applications/Processes/kaeonMeta/Apps/playMediaSong.js",
		`
			let media = use("kaeon-united")("generalReference")("media");

			fileSystem.executeCommand("Storage://User/Applications/Processes/kaeonMeta/Apps/stopMediaSong.js");

			media.playAudio(media.search(arguments[0])[0]);
		`
	],
	[
		"Storage://User/Applications/Processes/kaeonMeta/Apps/stopMediaSong.js",
		`
			let media = use("kaeon-united")("generalReference")("media");

			Object.keys(media.getPlaying()).forEach((item) => {
				media.stop(item);
			});
		`
	],
	[
		"Storage://User/Applications/Processes/kaeonMeta/Apps/chatSpeak.js",
		`
			let chat = use("kaeon-united")("generalReference")("chat");

			use("kaeon-united")("speech").speak(
				chat.clean(chat.chat(arguments[0]).text).clean
			);
		`
	],
	[
		"Storage://User/Applications/Processes/kaeonMeta/Apps/chatRelay.js",
		`
			let chat = use("kaeon-united")("generalReference")("chat");

			return chat.clean(chat.chat(arguments[0]).text).clean;
		`
	],
	[
		"Storage://User/Applications/Processes/kaeonMeta/Apps/castMediaVideo.js",
		`
			let data = arguments[0].toLowerCase();

			if(data.includes("to")) {

				data = data.split("to");

				let media = use("kaeon-united")("generalReference")("media");
				let results = media.search(data[0].trim());

				fileSystem.executeCommand("Storage://User/Applications/Apps/cast.js \\"" + data[1].trim() + "\\" " + results[0]);
			}

			else
				fileSystem.executeCommand("Storage://User/Applications/Apps/cast.js \\"" + data.trim() + "\\"");
		`
	]
].forEach((item) => {
	fileSystem.setResource(item[0], item[1]);
});

fileSystem.executeCommand("Storage://User/Applications/Processes/kaeonMeta/Management/metaInit.js \"Storage://User/Applications/Processes/kaeonMeta/Management/metaConfig.json\"");