const router = require('express').Router(); // eslint-disable-line
const LogMst = require('../controllers/LogMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(LogMst.saveLog);

    app.use(
        '/api/v1/logmst',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
