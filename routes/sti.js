// Models
var Sti = require('./models/sti');
var express = require('express');
var router = express.Router();


/**
 * @api {get} /stilist Return a list of all STIs
 * @apiName Stilist
 * @apiGroup STI
 *
 *
 * @apiSuccess {String[]} stiNames Array of all STIs.
 */
router.route('/stilist').get(function (req, res) {
	Sti.find({}).select('name').exec(function(err, docs) {
		if(!err) {
			var stiNames = docs.map(function(sti) {
				return sti.name;
			});
			res.send(stiNames);
		}
	});
});

module.exports = router;