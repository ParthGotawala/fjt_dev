const router = require('express').Router(); // eslint-disable-line
const WorkorderTransfer = require('../controllers/Workorder_TransferController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getWorkorderQtyDetail/:woID/:woOPID')
        .get(WorkorderTransfer.getWorkorderQtyDetail);

    router.route('/getWorkorderOperationDetail/:woID')
        .get(WorkorderTransfer.getWorkorderOperationDetail);

    router.route('/saveTransferWorkorderDetail')
        .post(WorkorderTransfer.saveTransferWorkorderDetail);

    router.route('/getTerminatedOperationDetail/:woID')
        .get(WorkorderTransfer.getTerminatedOperationDetail);

    router.route('/getWorkorderTransferDetail/:woID')
        .get(WorkorderTransfer.getWorkorderTransferDetail);

    router.route('/getWorkorderTransferHistory/:woOPID')
        .get(WorkorderTransfer.getWorkorderTransferHistory);

    app.use(
        '/api/v1/workordertransfer',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
