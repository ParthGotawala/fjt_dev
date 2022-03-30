const router = require('express').Router();

const GenericAuthenticationController = require('../controllers/GenericAuthenticationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/createAuthenticatedApprovalReason')
        .post(GenericAuthenticationController.createAuthenticatedApprovalReason);

    router.route('/saveAllApprovalReasons')
        .post(GenericAuthenticationController.saveAllApprovalReasons);

    router.route('/retrieveGenericConfirmation')
        .post(GenericAuthenticationController.retrieveGenericConfirmation);

    app.use('/api/v1/authenticateReason',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
