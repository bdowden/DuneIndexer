var tvdb = require('./tvdb.js'),
	TVShow = function(data){
		var self = this;

		self.seriesId = data.id[0];
		self.name = data.SeriesName[0];
		self.graphic = data.banner[0];
		self.overView = data.Overview[0];
	},
	Searcher = function() {
		var self = this,
			tv = new tvdb.tvdb('A1B17C3FE4A90388'),
			onEpisodeListComplete = function(err, res) {
				console.log(res.Data.Episode);
			};

		self.searchForTvShow = function(tvShow, onComplete) {

			tv.searchForTvShow(tvShow, function(err, res){
				var result = res.Data.Series,
					tvShow = null;
				if (result.length === 1) {
					tvShow = new TVShow(result[0]);

					tv.getEpisodeList(tvShow.seriesId, onEpisodeListComplete);
				}
			});
		};
	};

module.exports.Searcher = Searcher;