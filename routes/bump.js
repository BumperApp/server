// Models
var Ping = require('./models/ping');
var Bump = require('./models/bump');
var express = require('express');
var router = express.Router();


/**
 * @api {post} /ping Register a new bump if all the requirements are met.
 * @apiName Bump
 * @apiGroup Bump
 *
 * @apiParam {String} hash Combination of username and password hashed.
 * @apiParam {Number} latitude Latitude of where ping happened.
 * @apiParam {Number} longitude Longitude of where ping happened.
 *
 */
router.route('/ping').post(function (req, res) {
	var hash = req.body.hash;
	var user1;
	var user2;
	var distance;
	var centerX;
	var centerY;

	console.log("Ping from " + hash);

	async.series([
		function(callback) {
			var ping = new Ping({
				userHash: hash,
				lat: req.body.latitude,
				lng: req.body.longitude
			});

			ping.save(function (err, ping) {
				if (!err) {
					callback();
				}
			});
		},
		function(callback) {
			Ping.count({}, function(err, count) {
				if (count >= 2) {
					callback();
				}
			});
		},
		function(callback) {
			Ping.find({}).sort('-dateTime').limit(2).exec(function(err, docs) {

				center = geolib.getCenter([
					{ latitude: docs[0].lat, longitude: docs[0].lng },
					{ latitude: docs[1].lat, longitude: docs[1].lng }
					]);
				console.log("center is " + center);
				centerX = center.latitude;
				centerY = center.longitude;
				console.log(centerX + " y: " + centerY);
				distance = geolib.getDistance(
					{ latitude: docs[0].lat, longitude: docs[0].lng },
					{ latitude: docs[1].lat, longitude: docs[1].lng }
					);

				var secDiff = Math.abs(docs[1].dateTime - docs[0].dateTime)/1000;

				//console.log(distance, secDiff);

				if (distance < 100 && secDiff < 3) {
					user2 = docs[0].userHash;
					user1 = docs[1].userHash;
					console.log("Bumping " + user1 + " and " + user2);
					callback();
				}

			});
		},
		function(callback) {
			var bump = new Bump({
				user1: user1,
				user2: user2,
				distance: distance,
				centerX: centerX,
				centerY: centerY
			});

			bump.save(function (err, bump) {
			});

		}
		], function(err) {
      	if (err) return next(err);
			});

	res.send('Happy Humping');

});

module.exports = router;