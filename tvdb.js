var http = require('http'),
	queryString = require('querystring'),
	xml2js = require('xml2js'),
	tvdb = function(apiKey) {
		var self = this,
			cache = {};
			host = 'www.thetvdb.com',
			paths = {
				search: '/api/GetSeries.php?seriesname=',
				episodeInfo: '/api/' + apiKey + '/series/#{seriesId}/all/en.xml'
			};
			getPath = function(path, qs) {
				var p = paths[path]
				if (qs) {
					p = p + queryString.escape(qs);
				}
				return p;
			};

		self.addToCache = function(seriesId, value) {
			cache[seriesId] = value;
		};

		self.getFromCache = function(seriesId) {
			return cache[seriesId];
		};

		self.getEpisodeList = function(seriesId, onComplete) {
			var path = getPath('episodeInfo');

			path = path.replace("#{seriesId}", seriesId);

			var c = self.getFromCache(seriesId);

			if (c){
				onComplete(null, c);
			}

			var req = http.request({
				host: host,
				port: 80,
				path: path,
				method: "GET"
			}, function(res) {
				var data = "",
					onResponseDone = function() {
						if (data && data !== "") {
							var parser = new xml2js.Parser();

							parser.parseString(data, function(err, result) {
								var cached = self.getFromCache(seriesId) || {};
								cached.episodes = result;
								self.addToCache(seriesId)
								onComplete(err, result);
							});
						}
					};
				res.setEncoding('utf8');
				res.on('data', function(chunk) {
					data += chunk;
				});

				res.on('error', function(err) {
					console.log('error');
				});


				res.on('close', onResponseDone);
				res.on('end', onResponseDone);
			});

			req.end();
		};

		self.searchForTvShow = function(showName, onComplete) {
			var req = http.request({
				host: host,
				port: 80,
				path: getPath('search', showName),
				method: "GET"
			}, function(res) {
				var data = "",
					onResponseDone = function() {
						if (data && data !== "") {
							var parser = new xml2js.Parser();

							parser.parseString(data, function(err, result) {
								onComplete(err, result);
							});
						}
					};
				res.setEncoding('utf8');
				res.on('data', function(chunk) {
					data += chunk;
				});

				res.on('error', function(err) {
					console.log('error');
				});


				res.on('close', onResponseDone);
				res.on('end', onResponseDone);
			});

			req.end();
		};
	};

module.exports.tvdb = tvdb;