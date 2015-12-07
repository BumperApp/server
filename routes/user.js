// Models
var User = require('./models/user');
var express = require('express');
var router = express.Router();


/**
 * @api {post} /register Register a new user
 * @apiName Register
 * @apiGroup User
 *
 * @apiParam {Object} user User object.
 * @apiParam {String} user.name Combination of username and password.
 *
 * @apiSuccess {Object} user User object that was created.
 */
router.route('/register').post(function (req, res) {
	var userObj = req.body.user;
	var hash = hasher(userObj.name);
	var user;

	async.series([
		function(callback) {
			User.findOneAndUpdate({'userHash': hash}, { deviceToken: userObj.deviceToken }, {}, function(err, doc) {
				if(doc) {
					user = doc;
					res.send(user);
				}
				else {
					callback();
				}
			});
		},
		function(callback) {
			var user = new User({
				userHash: hash,
				gender: userObj.gender,
				age: userObj.age,
				deviceToken: userObj.deviceToken,
			});

			user.save(function (err, user) {
				if (!err) user = user;
				res.send(user);
			});

		},
		], function(err) {
      	if (err) return next(err);
			});


});

/**
 * @api {post} /login Login as a user
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam {Object} user User object.
 * @apiParam {String} user.name Combination of username and password.
 *
 * @apiSuccess {Boolean} status User exists in our API.
 * @apiSuccess {String} userID combination of username and password hashed.
 * @apiError {Boolean} status User doesn't exist in our API.
 */
router.route('/login').post(function (req, res) {
	var userObject = req.body.user;
	var hash = hasher(userObject.name);
	User.findOneAndUpdate({'userHash': hash}, { deviceToken: userObject.deviceToken }, {}, function(err, doc) {
		if(doc) {
			res.send({'status': true, 'userID': hash});
		}
		else {
			res.send({'status': false});
		}
	});
});


/**
 * @api {post} /updatedevicetoken Update Device token for users
 * @apiName Update Device Token
 * @apiGroup User
 *
 * @apiParam {Object} user User object.
 * @apiParam {String} user.hash Combination of username and password.
 * @apiParam {String} user.token New device token.
 *
 */
router.route('/updatedevicetoken').post(function(req, res) {
	var user = req.body.user;
	var conditions = {userHash: user.hash};
	var update = {deviceToken: user.token};
	var options = {};
	User.update(conditions, update, options, function(err, numAffected) {
		console.log('Updated ' + user.hash + ' with a new id of ' + user.token);
		res.send('Users ID has been bumped!');
	});
});

module.exports = router;