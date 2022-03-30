const auth = require('../controllers/AuthController');

module.exports = (app) => {
	//app.route('/api/v1/login')
	//	.post(auth.login);

	app.route('/api/v1/loginWithIdentityUserId')
		.post(auth.loginWithIdentityUserId);

	app.route('/api/v1/logout')
		.post(auth.logout);
};
