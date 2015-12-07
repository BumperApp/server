var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	hasher = require('hash-anything').sha1,
	async = require('async'),
	uniques = require('uniques'),
	request = require('request'),
	ionicPushServer = require('ionic-push-server'),
	geolib = require('geolib');

// DB connection
var connection = mongoose.connect( process.env.MONGO_URL );

var app = express();

var routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// API CORS config
app.use(function(req, res, next) {
	 res.header("Access-Control-Allow-Origin", "*");
	 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	 next();
});

// Ionic Push notification config
var credentials = {
    IonicApplicationID : process.env.IONIC_APPID,
    IonicApplicationAPIsecret : process.env.IONIC_APPSECRET
};

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('API listening at http://%s:%s', host, port);
});
