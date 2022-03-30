const router = require('express').Router(); // eslint-disable-line
const WorkorderTrans = require('../controllers/Workorder_TransController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/checkInOperation')
        .post(WorkorderTrans.checkInOperation);

    router.route('/checkOutOperation')
        .post(WorkorderTrans.checkOutOperation);

    router.route('/checkOutEmployeeFromOperation')
        .post(WorkorderTrans.checkOutEmployeeFromOperation);

    router.route('/pauseEmployeeFromOperation')
        .post(WorkorderTrans.pauseEmployeeFromOperation);

    router.route('/pauseAllEmployeeFromOperation')
        .post(WorkorderTrans.pauseAllEmployeeFromOperation);

    router.route('/resumeEmployeeForOperation')
        .post(WorkorderTrans.resumeEmployeeForOperation);

    //router.route('/resumeAllEmployeeForOperation')
    //    .post(WorkorderTrans.resumeAllEmployeeForOperation);

    router.route('/retrieveWorkorderTransDetails')
        .post(WorkorderTrans.retrieveWorkorderTransDetails);

    router.route('/retrieveWorkorderOperationStockDetails')
        .post(WorkorderTrans.retrieveWorkorderOperationStockDetails);

    router.route('/getTravelerDetails')
        .post(WorkorderTrans.getTravelerDetails);

    router.route('/getTravelerLatestDetails')
        .post(WorkorderTrans.getTravelerLatestDetails);

    router.route('/getActiveOperationListByEmployeeID')
        .post(WorkorderTrans.getActiveOperationListByEmployeeID);

    router.route('/getActiveOperationList')
        .post(WorkorderTrans.getActiveOperationList);


    router.route('/checkWorkorderProductionStarted')
        .post(WorkorderTrans.checkWorkorderProductionStarted);

    router.route('/scanIncomingOutgoingRack')
        .post(WorkorderTrans.scanIncomingOutgoingRack);

    router.route('/scanClearMaterial')
        .post(WorkorderTrans.scanClearMaterial);

    router.route('/scanRackforHistory')
        .post(WorkorderTrans.scanRackforHistory);
    router.route('/getCurrentRackStatus')
        .post(WorkorderTrans.getCurrentRackStatus);

    router.route('/')
        .post(WorkorderTrans.createWorkorder_Trans);

    router.route('/retrieveWorkorder_TransList')
        .post(WorkorderTrans.retrieveWorkorder_TransList);

    router.route('/:woTransID')
        .get(WorkorderTrans.retrieveWorkorder_Trans)
        .put(WorkorderTrans.updateWorkorder_Trans)
        .delete(WorkorderTrans.deleteWorkorder_Trans);

    router.route('/getTravelerEmpWorkingTimeStatus')
        .post(WorkorderTrans.getTravelerEmpWorkingTimeStatus);

    router.route('/getWoOpExpiredExpiringPartDetails')
        .post(WorkorderTrans.getWoOpExpiredExpiringPartDetails);

    router.route('/getWOOPUserWiseAckPendingNotificationList')
        .post(WorkorderTrans.getWOOPUserWiseAckPendingNotificationList);

    app.use(
        '/api/v1/workorder_trans',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
