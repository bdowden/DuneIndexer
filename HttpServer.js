var http = require('http'),
	DuneServer = function(port, onRequestReceived) {
		var self = this,
			server = null,
			createAndStartServer = function() {
				server = http.createServer(function(req, res) {
					res.simpleJSON = function(code, obj) {
						var body = JSON.stringify(obj);
						res.writeHead(code, {
							'Content-Type': 'text/json',
							'Content-Length': body.length
						});
						res.write(body);
						res.end();
					};

					onRequestReceived(req, res);
				}).listen(port, "127.0.0.1");

				return server;
			};

		self.createAndStartServer = createAndStartServer;
	};

module.exports.DuneServer = DuneServer;