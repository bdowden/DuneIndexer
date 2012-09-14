var FileStructure = function(dir) {
		var self = this;
		this.directoryPath = dir;
		this.files = [];
		this.directories = [];
	};


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

module.exports.FileStructure = FileStructure;