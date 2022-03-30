const router = require('express').Router(); // eslint-disable-line
const WorkorderTransProduction = require('../controllers/Workorder_Trans_ProductionController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(WorkorderTransProduction.createWorkorderTransProduction);

    router.route('/retrieveWorkorderTransactionDetails')
        .post(WorkorderTransProduction.retrieveWorkorderTransactionDetails);

    router.route('/retrieveWorkorderTransReadyStock')
        .post(WorkorderTransProduction.retrieveWorkorderTransReadyStock);

    router.route('/saveReprocessQtyForOperation')
        .post(WorkorderTransProduction.saveReprocessQtyForOperation);

    app.use(
        '/api/v1/workorder_trans_production',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
