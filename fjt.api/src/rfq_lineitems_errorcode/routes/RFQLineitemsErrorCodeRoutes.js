const router = require('express').Router();

const RFQLineitemsErrorcode = require('../controllers/RFQLineitemsErrorCodeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {

    router.route('/retriveErrorCode')
        .post(RFQLineitemsErrorcode.retriveErrorCode);

    router.route('/saverfqlineErrorCode')
        .post(RFQLineitemsErrorcode.saverfqlineErrorCode);

    router.route('/saverfqlineErrorCodePriority')
        .post(RFQLineitemsErrorcode.saverfqlineErrorCodePriority);

    router.route('/getErrorCode')
        .get(RFQLineitemsErrorcode.getErrorCode);

    router.route('/getErrorCodeByLogicID')
        .post(RFQLineitemsErrorcode.getErrorCodeByLogicID);

    app.use(
        '/api/v1/rfqlineitemerrorcode',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};