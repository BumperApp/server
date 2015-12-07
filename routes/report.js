// Models
var Report = require('./models/report');
var Bump = require('./models/bump');
var User = require('./models/user');
var express = require('express');
var router = express.Router();


/**
 * @api {post} /report Report an STI and send push notification(s)
 * @apiName Report
 * @apiGroup Report
 *
 * @apiParam {Object} user User object.
 * @apiParam {String} user.hash Combination of username and password hashed.
 *
 */
router.route('/report').post(function (req, res) {
	var userObj = req.body.user;
	var hashes = [];
	var tokens = [];
	var count = 0;


	async.series([
		// function(callback) {

		// 	var report = new Report({
		// 		userHash: userObject.hash,
		// 		sti: userObject.sti,
		// 		days: userObject.days,
		// 	});

		// 	report.save(function (err, report) {
		// 		if (!err) callback();
		// 	});

		// },
		function(callback) {

			Bump.find({'user1': userObj.hash}, function(err, docs) {
				if(docs) {
					for (var i=0; i<docs.length; i++) {
						hashes.push(docs[i].user2);
					}

					Bump.find({'user2': userObj.hash}, function(err, docs) {
						if(docs) {
							for (var i=0; i<docs.length; i++) {
								hashes.push(docs[i].user1);
							}
							hashes = uniques(hashes);
							callback();
						}
					});
					
				}
			});

		},
		function(callback) {

			for (var i=0; i< hashes.length; i++) {
				User.findOne({'userHash': hashes[i]}, function(err, doc) {
					if(!err) {
						if (doc.deviceToken) {
							tokens.push(doc.deviceToken);	
						}
						count++;
					}
					if (count == (hashes.length)) {
						//console.log('');
						callback();
					}
				});
			}

		},
		function(callback) {

			console.log(tokens);

			var notification = {
			  "tokens": [],
			  "notification": {
			    "alert":"Sorry you might have an STI, Please get a check.",
			  }
			};

			if(tokens.length != 0) {

				for (var i=0; i < tokens.length; i++) {
					notification.tokens = Array(tokens[i]);
					//console.log(notification);
					var r = ionicPushServer(credentials, notification);
					console.log(r);
				}

			}

		},
		], function(err) {
      	if (err) return next(err);
			});

		res.send('Oh, SHIT!');
});

module.exports = router;