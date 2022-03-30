const router = require('express').Router();

const KitAllocationController = require('../controllers/KitAllocationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getKitAllocationList')
        .post(KitAllocationController.getKitAllocationList);

    router.route('/getStockAllocateList')
        .post(KitAllocationController.getStockAllocateList);

    router.route('/saveStockAllocateList')
        .post(KitAllocationController.saveStockAllocateList);

    router.route('/checkBOMAndGetKitAllocationList')
        .post(KitAllocationController.checkBOMAndGetKitAllocationList);

    router.route('/kitAllocationAssyList/:id')
        .get(KitAllocationController.kitAllocationAssyList);

    router.route('/getKitAllocationConsolidatedList')
        .post(KitAllocationController.getKitAllocationConsolidatedList);

    router.route('/reCalculateKitAllocation')
        .post(KitAllocationController.reCalculateKitAllocation);

    router.route('/getAllocatedKitList')
        .get(KitAllocationController.getAllocatedKitList);

    router.route('/getAllocatedKitForUMID')
        .get(KitAllocationController.getAllocatedKitForUMID);

    router.route('/deallocateUMIDFromKit')
        .post(KitAllocationController.deallocateUMIDFromKit);

    router.route('/getKitFeasibility')
        .post(KitAllocationController.getKitFeasibility);

    router.route('/kitRelease')
        .post(KitAllocationController.kitRelease);

    router.route('/getWOForKitRelease')
        .get(KitAllocationController.getWOForKitRelease);

    router.route('/getKitReleaseSummaryAndStatus')
        .get(KitAllocationController.getKitReleaseSummaryAndStatus);

    router.route('/getKitAllocationFilterList')
        .post(KitAllocationController.getKitAllocationFilterList);

    router.route('/getKitReleasePlanDetail')
        .post(KitAllocationController.getKitReleasePlanDetail);

    router.route('/getAllocatedUMIDCount')
        .post(KitAllocationController.getAllocatedUMIDCount);

    router.route('/returnKit')
        .post(KitAllocationController.returnKit);

    router.route('/getHoldResumeStatus')
        .get(KitAllocationController.getHoldResumeStatus);

    router.route('/initiateKitReturn')
        .post(KitAllocationController.initiateKitReturn);

    router.route('/getSearchMaterialDetailOfBOM')
        .post(KitAllocationController.getSearchMaterialDetailOfBOM);

    router.route('/getSearchMaterialDetailOfUMID')
        .post(KitAllocationController.getSearchMaterialDetailOfUMID);

    router.route('/getKitAllocationExportFile')
        .post(KitAllocationController.getKitAllocationExportFile);

    router.route('/getKitallocationLineDetails')
        .post(KitAllocationController.getKitallocationLineDetails);

    router.route('/saveCustconsignStatusForKitLineItem')
        .post(KitAllocationController.saveCustconsignStatusForKitLineItem);

    router.route('/getCustConsignMismatchKitAllocationDetails')
        .post(KitAllocationController.getCustConsignMismatchKitAllocationDetails);

    router.route('/getReleaseReturnHistoryList')
        .post(KitAllocationController.getReleaseReturnHistoryList);

    router.route('/retrieveKitList')
        .post(KitAllocationController.retrieveKitList);

    router.route('/getCountOfSubAssemblyKits')
        .post(KitAllocationController.getCountOfSubAssemblyKits);

    router.route('/getAssemblyTreeViewList')
        .post(KitAllocationController.getAssemblyTreeViewList);

    app.use(
        '/api/v1/kit_allocation',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};