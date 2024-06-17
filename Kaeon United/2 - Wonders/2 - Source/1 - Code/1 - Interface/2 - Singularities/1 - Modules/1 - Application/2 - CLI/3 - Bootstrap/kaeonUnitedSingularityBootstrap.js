require("kaeon-united")("openAxis").openAxis({
	routes: {
		api: { "/api/": process.cwd() + "/api" },
		default: {
			index: "https://atlas-of-kaeon.github.io/"
		},
		public: { "/": process.cwd() + "/public" }
	}
});