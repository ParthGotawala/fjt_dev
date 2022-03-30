const router = require('express').Router(); // eslint-disable-line
const ReportChangeLogsController = require('../controllers/ReportChangeLogsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/checkActivityStarted')
        .get(ReportChangeLogsController.checkActivityStarted);
    router.route('/currentActivityDetById')
        .get(ReportChangeLogsController.currentActivityDetById);
    router.route('/startActivity')
        .post(ReportChangeLogsController.startActivity);
    router.route('/stopActivity')
        .post(ReportChangeLogsController.stopActivity);

    app.use('/api/v1/reportchangelog',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
