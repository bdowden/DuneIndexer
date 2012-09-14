var directoryReader = require('./DirectoryReader.js'),
	settings = {
		tvDir: '/Users/benjamindowden/Projects/ThinkAhead-iOS/TestMono',
		movieDir: '/Volumes/Movies'
	},
	tvDirReader = new directoryReader.DirectoryReader(settings.tvDir),
	movieDirReader = new directoryReader.DirectoryReader(settings.movieDir),
	onRequestReceived = function(req, res) {
		tvDirReader.getDirectories(function(err, d) {
			console.log(d);
			res.simpleJSON(200, d);
		});
	},
	duneServer = require('./HttpServer.js'),
	server = new duneServer.DuneServer	(1337, onRequestReceived);
	server.createAndStartServer();