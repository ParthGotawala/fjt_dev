const router = require('express').Router(); // eslint-disable-line
const DataentryChangeAuditLogController = require('../controllers/DataentryChange_AuditLogController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getWoDataentryChangeAuditlog')
        .post(DataentryChangeAuditLogController.getWoDataentryChangeAuditlog);
    router.route('/getHistoryDataByTableName')
        .post(DataentryChangeAuditLogController.getHistoryDataByTableName);

    app.use(
        '/api/v1/dataentrychange_auditlog',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
