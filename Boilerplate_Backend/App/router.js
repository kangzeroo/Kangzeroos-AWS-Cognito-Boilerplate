// routes
const Authentication = require('./routes/auth_routes');

// router middlewear
const authCheck = require('./api/authCheck').authCheck

module.exports = function(app){
	// Auth related routes
	app.get('/auth_test', authCheck, Authentication.authtest);
}
