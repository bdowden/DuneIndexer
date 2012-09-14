var http = require('http'),
 	fs = require('fs'),
 	sys = require('sys'),
	qs = require('querystring'),
	url = require('url'),
	path = require('path'),
	settings = {
		tvDir: '/Users/benjamindowden/Projects/ThinkAhead-iOS/TestMono',
		movieDir: '/Volumes/Movies'
	},
	FileStructure = function(dir) {
		var self = this;
		this.directoryPath = dir;
		this.files = [];
		this.directories = [];
	},
	DirectoryReader = function(dir) {
		var self = this;
		this.baseDir = dir,
		getDirectoryStructure = function(directory, onComplete) {

			fs.readdir(directory, function(err, list){
				if (err) {
					console.log(err);
					return onComplete(err);
				}
				var currentDirectory = new FileStructure(directory);
				var results = [];

				var pending = list.length;
				if (!pending) return onComplete(null, currentDirectory);

				list.forEach(function(f) {
					var qualifiedPath = path.join(directory, f);
					fs.stat(qualifiedPath, function(err, stat) {

						if (stat && stat.isDirectory()){
							getDirectoryStructure(qualifiedPath, function(err, res){
								if (err) {
									console.log(err);
									--pending;
								}
								currentDirectory.directories.push(res);
								if (!--pending) onComplete(null, currentDirectory);
							});
						}
						else if (stat && stat.isFile()) {
							currentDirectory.files.push(qualifiedPath);
							if (!--pending) onComplete(null, currentDirectory);
						}
						else {
							if (!--pending) onComplete(null, currentDirectory);
						}
					});
				});
			});
		};

		this.getDirectories = function(onComplete) {
			getDirectoryStructure(self.baseDir, onComplete);
		};
	},
	tvDirReader = new DirectoryReader(settings.tvDir);

FileStructure.prototype = {
	addFiles: function(files) {
		if (!Array.isArray(files)) {
			files = [files];
		}
		this.files.concat(files);
	},
	addDirectories: function(directories) {
		if (!Array.isArray(directories)) {
			directories = [directories];
		}
		this.directories.concat(directories);
	}
};


http.createServer(function (request, res) {

	res.simpleJSON = function(code, obj) {
		var body = JSON.stringify(obj);
		res.writeHead(code, {
			'Content-Type': 'text/json',
			'Content-Length': body.length
		});
		res.write(body);
		res.end();
	};

	tvDirReader.getDirectories(function(err, directories) {
		if (err) {
			res.simpleJSON(200, err);
		}
		res.simpleJSON(200, {directories: directories});
	});
}).listen(1337, "127.0.0.1");
console.log('Up and running at http://127.0.0.1:1337/');