const router = require('express').Router();

const RfqAssemblyHistoryController = require('../controllers/Rfq_Assembly_HistoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getBOMHistory')
        .post(RfqAssemblyHistoryController.getBOmHistory);

    router.route('/saveNarrativeHistory')
        .post(RfqAssemblyHistoryController.saveNarrativeHistory);

    app.use(
        '/api/v1/rfqAssemblies',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
