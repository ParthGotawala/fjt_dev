const router = require('express').Router();

const ErrorLogs = require('../controllers/ErrorLogsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .get(ErrorLogs.retriveError);

    app.use(
        '/api/v1/errorLogs',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
