const router = require('express').Router(); // eslint-disable-line
// eslint-disable-line
const configurationController = require('../controllers/ConfigurationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getUIGridColumnDetail')
        .get(configurationController.getUIGridColumnDetail);

    router.route('/saveUIGridColumnDetail')
        .post(configurationController.saveUIGridColumnDetail);

    app.use(
        '/api/v1/configuration',

        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
