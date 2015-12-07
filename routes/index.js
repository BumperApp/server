module.exports = function (app) {
	app.use('/', require('./routes/user'));
    app.use('/', require('./routes/bump'));
    app.use('/', require('./routes/report'));
    app.use('/', require('./routes/stat'));
    app.use('/', require('./routes/sti'));
};