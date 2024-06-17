require("kaeon-united")("openAxis").openAxis({
	routes: {
		api: { "/api/": process.cwd() + "/api" },
		default: {
			index: "https://kaeon-united.github.io/"
		},
		public: { "/": process.cwd() + "/public" }
	}
});