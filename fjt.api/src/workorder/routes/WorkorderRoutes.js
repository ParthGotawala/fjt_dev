const router = require('express').Router(); // eslint-disable-line
const Workorder = require('../controllers/WorkorderController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // added at top so route('/') do not get called first

    router.route('/addWorkorder')
        .post(Workorder.addWorkorder);

    router.route('/retriveWorkorderlist')
        .post(Workorder.retriveWorkorderlist);

    router.route('/retrieveWorkorderDataElementList/:woID')
        .get(Workorder.retrieveWorkorderDataElementList);

    router.route('/getWorkOrderListByAssyID/:assyID')
        .get(Workorder.getWorkOrderListByAssyID);

    router.route('/getWorkorderOperationList/:woID')
        .get(Workorder.getWorkorderOperationList);

    router.route('/workorder_profile/:woID')
        .get(Workorder.getWorkorderProfile);

    router.route('/retrieveAllWorkordersforTransDataElement')
        .get(Workorder.retrieveAllWorkordersforTransDataElement);

    router.route('/getWorkorderByWoOPID/:woOPID')
        .get(Workorder.getWorkorderByWoOPID);

    router.route('/verifyWorkorder')
        .post(Workorder.verifyWorkorder);

    router.route('/getMaxWorkorderNumberByAssyID')
        .post(Workorder.getMaxWorkorderNumberByAssyID);

    router.route('/validateAssemblyByAssyID')
        .post(Workorder.validateAssemblyByAssyID);

    router.route('/stopWorkorder')
        .post(Workorder.stopWorkorder);

    router.route('/getWODetails/:woID')
        .get(Workorder.getWODetails);

    router.route('/getAllWorkOrderDetail')
        .get(Workorder.getAllWorkOrderDetail);

    router.route('/saveWOVersion')
        .post(Workorder.saveWOVersion);

    router.route('/getAssemblyStockDetailsByAssyID')
        .post(Workorder.getAssemblyStockDetailsByAssyID);

    router.route('/getIdlePOQtyByAssyID')
        .post(Workorder.getIdlePOQtyByAssyID);

    router.route('/getWorkorderAuthor/:woID')
        .get(Workorder.getWorkorderAuthor);

    router.route('/getWorkorderWithAssyDetails')
        .get(Workorder.getWorkorderWithAssyDetails);

    router.route('/getWorkOrderListWithDetail')
        .post(Workorder.getWorkOrderListWithDetail);
    router.route('/checkDateCodeOnPublishWO')
        .get(Workorder.checkDateCodeOnPublishWO);

    router.route('/')
        .post(Workorder.createWorkorder);

    router.route('/:id/:isPermanentDelete?')
        .get(Workorder.retriveWorkorders)
        .put(Workorder.updateWorkorder);
    // .delete(Workorder.deleteWorkorder);

    router.route('/deleteWorkorder')
        .post(Workorder.deleteWorkorder);

    router.route('/getWorkorderHeaderDisplayDetails')
        .post(Workorder.getWorkorderHeaderDisplayDetails);

    router.route('/getAllLocationDetailsOfSample')
        .post(Workorder.getAllLocationDetailsOfSample);

    router.route('/getAllWORFQContainSamePartID')
        .post(Workorder.getAllWORFQContainSamePartID);

    router.route('/retrieveWorkorderEntityDataElements')
        .post(Workorder.retrieveWorkorderEntityDataElements);

    router.route('/createWorkorderDataElements')
        .post(Workorder.createWorkorderDataElements);

    router.route('/deleteWorkorderDataElements')
        .post(Workorder.deleteWorkorderDataElements);

    router.route('/convertToMasterTemplate')
        .post(Workorder.convertToMasterTemplate);

    router.route('/getWorkOrderNumbers')
        .post(Workorder.getWorkOrderNumbers);

    router.route('/getPrevWoListForCustomerAssy')
        .post(Workorder.getPrevWoListForCustomerAssy);

    router.route('/getTempratureSensitiveComponentListByWoID')
        .post(Workorder.getTempratureSensitiveComponentListByWoID);

    router.route('/getAllWOForSearchAutoComplete')
        .post(Workorder.getAllWOForSearchAutoComplete);

    router.route('/getAllActiveWorkorderForCopyFolderDoc')
        .post(Workorder.getAllActiveWorkorderForCopyFolderDoc);

    router.route('/copyAllFolderDocToActiveWorkorder')
        .post(Workorder.copyAllFolderDocToActiveWorkorder);

    router.route('/copyAllDuplicateDocToWOOPBasedOnConfirmation')
        .post(Workorder.copyAllDuplicateDocToWOOPBasedOnConfirmation);

    router.route('/getSoPoFilterList')
        .post(Workorder.getSoPoFilterList);

    router.route('/getAssyIdFilterList')
        .post(Workorder.getAssyIdFilterList);

    router.route('/getNickNameFilterList')
        .post(Workorder.getNickNameFilterList);

    router.route('/getOperationFilterList')
        .post(Workorder.getOperationFilterList);

    router.route('/getEmployeeFilterList')
        .post(Workorder.getEmployeeFilterList);

    router.route('/getEquipmentFilterList')
        .post(Workorder.getEquipmentFilterList);

    router.route('/getMaterialSupplierFilterList')
        .post(Workorder.getMaterialSupplierFilterList);

    router.route('/AddedImagesIntoPDF')
        .post(Workorder.AddedImagesIntoPDF);

    router.route('/getWorkorderUsageMaterial/:woID')
        .post(Workorder.getWorkorderUsageMaterial);


    router.route('/printWoOPDetail')
        .post(Workorder.printWoOPDetail);

    router.route('/getWOHeaderAllIconList')
        .post(Workorder.getWOHeaderAllIconList);

    router.route('/getAssemblyStockPODetailsByAssyID')
        .post(Workorder.getAssemblyStockPODetailsByAssyID);

    router.route('/getAssemblyStockWODetailsByAssyID')
        .post(Workorder.getAssemblyStockWODetailsByAssyID);
    router.route('/getAssemblyStockSummaryByAssyID')
            .post(Workorder.getAssemblyStockSummaryByAssyID);

    app.use(
        '/api/v1/workorders',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );

    app.use(
        '/api/v1/workorder_profile',
        router
    );

    router.route('/getWorkorderProfileAPI')
        .post(Workorder.getWorkorderProfileAPI);

    // router.route('/AddedImagesIntoPDF')
    //    .post(Workorder.AddedImagesIntoPDF);
};
