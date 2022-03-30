const router = require('express').Router(); // eslint-disable-line
const WorkorderOperation = require('./../controllers/workorder_operationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retrieveAllWorkorderOperationforTransDataElement/:woID')
        .get(WorkorderOperation.retrieveAllWorkorderOperationforTransDataElement);

    router.route('/detail/:woOPID')
        .get(WorkorderOperation.retriveOperationbyWoOPID);

    router.route('/update/:woOPID')
        .put(WorkorderOperation.updateWorkorderOperation);

    router.route('/stopWOOperation/:woOPID')
        .put(WorkorderOperation.stopWOOperation);

    router.route('/retrieveOperationEntityDataElements')
        .post(WorkorderOperation.retrieveOperationEntityDataElements);

    router.route('/createWorkorderOperationDataElements')
        .post(WorkorderOperation.createWorkorderOperationDataElements);

    router.route('/retrievePartOperationDetails')
        .post(WorkorderOperation.retrievePartOperationDetails);

    router.route('/createWorkorderOperationParts')
        .post(WorkorderOperation.createWorkorderOperationParts);

    router.route('/retrieveEquipmentOperationDetails')
        .post(WorkorderOperation.retrieveEquipmentOperationDetails);

    router.route('/createWorkorderOperationEquipments')
        .post(WorkorderOperation.createWorkorderOperationEquipments);

    router.route('/retrieveEmployeeOperationDetails')
        .post(WorkorderOperation.retrieveEmployeeOperationDetails);

    router.route('/createWorkorderOperationEmployees')
        .post(WorkorderOperation.createWorkorderOperationEmployees);

    router.route('/getWOOPDetails/:woOPID')
        .get(WorkorderOperation.getWOOPDetails);

    router.route('/saveWOOPVersion')
        .post(WorkorderOperation.saveWOOPVersion);

    router.route('/retriveOPListbyWoID/:woID')
        .get(WorkorderOperation.retriveOPListbyWoID);

    router.route('/retriveOPListWithTransbyWoID/:woID')
        .get(WorkorderOperation.retriveOPListWithTransbyWoID);

    router.route('/workorderOperationConfigurationList')
        .post(WorkorderOperation.workorderOperationConfigurationList);

    router.route('/retrieveNotAddedPartsForWoOp/:woOPID')
        .get(WorkorderOperation.retrieveNotAddedPartsForWoOp);

    router.route('/getPreviousWorkOrderOperationDetails')
        .post(WorkorderOperation.getPreviousWorkOrderOperationDetails);

    router.route('/retrieveAddedPartsForWoOp')
        .post(WorkorderOperation.retrieveAddedPartsForWoOp);

    router.route('/changeEquipmentStatusDetails')
        .post(WorkorderOperation.changeEquipmentStatusDetails);

    router.route('/retriveScannedRackdetail')
        .post(WorkorderOperation.retriveScannedRackdetail);

    router.route('/retriveEmptyRackList')
        .post(WorkorderOperation.retriveEmptyRackList);

    router.route('/retriveAvailableRackList')
        .post(WorkorderOperation.retriveAvailableRackList);

    router.route('/retriveClearRackList')
        .post(WorkorderOperation.retriveClearRackList);

    router.route('/retriveRackdetailHistory')
        .post(WorkorderOperation.retriveRackdetailHistory);

    router.route('/getWOOPFieldDetailsByFieldName')
        .post(WorkorderOperation.getWOOPFieldDetailsByFieldName);

    router.route('/retriveWorkOrderOperaionRefDesigList')
        .post(WorkorderOperation.retriveWorkOrderOperaionRefDesigList);

    router.route('/getRFQLineItemsByIDWithSubAssembly')
        .post(WorkorderOperation.getRFQLineItemsByIDWithSubAssembly);
        
    app.use(
        '/api/v1/workorderoperation',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
