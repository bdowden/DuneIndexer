var fs = require ('fs'),
	path = require('path'),
	fileStructure = require('./FileStructure.js'),
	DirectoryReader = function(dir) {
		var self = this;
		this.baseDir = dir,
		getDirectoryStructure = function(directory, onComplete) {

			fs.readdir(directory, function(err, list){
				if (err) {
					console.log(err);
					return onComplete(err);
				}
				var currentDirectory = new fileStructure.FileStructure(directory);
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

		this.processDirectories = function(onComplete) {
			onComplete = onComplete || function() { };

			
		}

};

module.exports.DirectoryReader = DirectoryReader;