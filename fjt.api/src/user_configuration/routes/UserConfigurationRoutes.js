const router = require('express').Router(); // eslint-disable-line
const UserConfig = require('../controllers/UserConfigurationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getUserPreference')
        .post(UserConfig.getUserPreference);

    router.route('/saveUserConfiguration')
        .post(UserConfig.saveUserConfiguration);

    app.use(
        '/api/v1/userConfig',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
