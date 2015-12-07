// Models
var Bump = require('./models/bump');
var express = require('express');
var router = express.Router();

/**
 * @api {post} /stats/api/bumplocations Return an array of all bumps
 * @apiName Bump Locations Stats
 * @apiGroup Stats
 *
 *
 */
router.route('/stats/api/bumplocations').post(function(req, res) {
	Bump.find({}, function(err, docs){
		if (err) console.log(err);
		else {
			res.send(docs);
		}
	})
});

module.exports = router;