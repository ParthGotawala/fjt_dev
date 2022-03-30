const router = require('express').Router();

const ComponentSidStockController = require('../controllers/Component_Sid_StockController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // keep on top as '/' do not override it
    router.route('/createComponentSidStock')
        .post(ComponentSidStockController.createComponentSidStock);

    router.route('/updateComponentSidStock')
        .post(ComponentSidStockController.updateComponentSidStock);

    router.route('/deleteComponentSidStock')
        .post(ComponentSidStockController.deleteComponentSidStock);

    router.route('/getNonUMIDStockList')
        .post(ComponentSidStockController.getNonUMIDStockList);

    router.route('/getUMIDList')
        .post(ComponentSidStockController.getUMIDList);

    router.route('/getUMIDByID/:id')
        .get(ComponentSidStockController.getUMIDByID);

    router.route('/getComponentMslDetail/:id')
        .get(ComponentSidStockController.getComponentMslDetail);

    router.route('/PrintDocument')
        .post(ComponentSidStockController.PrintDocument);

    router.route('/MatchRegexpToString')
        .post(ComponentSidStockController.MatchRegexpToString);

    router.route('/getPriceCategory')
        .post(ComponentSidStockController.getPriceCategory);
    router.route('/getUIDList/:query')
        .get(ComponentSidStockController.getUIDList);

    router.route('/getVerifiedLabel')
        .post(ComponentSidStockController.getVerifiedLabel);

    // router.route('/transferstock')
    //     .post(ComponentSidStockController.transferstock);

    router.route('/getMFGCodeOnCustomer/:id')
        .get(ComponentSidStockController.getMFGCodeOnCustomer);

    router.route('/getComponentWithTemplateDelimiter/:id/:mfgid')
        .get(ComponentSidStockController.getComponentWithTemplateDelimiter);

    router.route('/saveUnlockVerificationDetail')
        .post(ComponentSidStockController.saveUnlockVerificationDetail);

    router.route('/RemoveFromReserveStock')
        .post(ComponentSidStockController.RemoveFromReserveStock);

    router.route('/AddInReserveStock')
        .post(ComponentSidStockController.AddInReserveStock);

    router.route('/get_PO_SO_Assembly_List')
        .post(ComponentSidStockController.get_PO_SO_Assembly_List);

    router.route('/get_RFQ_BOMPart_List/:id/:sodid')
        .get(ComponentSidStockController.get_RFQ_BOMPart_List);

    router.route('/getAllocatedKitByUID')
        .post(ComponentSidStockController.getAllocatedKitByUID);

    router.route('/get_Component_Sid_ByUID/:id')
        .get(ComponentSidStockController.get_Component_Sid_ByUID);

    router.route('/match_Warehouse_Bin')
        .post(ComponentSidStockController.match_Warehouse_Bin);

    router.route('/checkAssemblyHasBom/:id')
        .get(ComponentSidStockController.checkAssemblyHasBom);

    router.route('/get_Multiple_Barcode_List/:ids')
        .get(ComponentSidStockController.get_Multiple_Barcode_List);

    router.route('/updateTransferDetail')
        .post(ComponentSidStockController.updateTransferDetail);

    router.route('/updateInitialQty')
        .post(ComponentSidStockController.updateInitialQty);

    router.route('/getUMIDDetailByUMID')
        .post(ComponentSidStockController.getUMIDDetailByUMID);

    router.route('/getCostCategoryFromUMID/:id')
        .get(ComponentSidStockController.getCostCategoryFromUMID);

    router.route('/getDateCodeFromUMID/:id')
        .get(ComponentSidStockController.getDateCodeFromUMID);

    router.route('/restrictUMIDHistory')
        .post(ComponentSidStockController.restrictUMIDHistory);

    router.route('/getBOMLineDetailForSameMFRPN')
        .post(ComponentSidStockController.getBOMLineDetailForSameMFRPN);

    router.route('/getPromptIndicatorColor/:pcartMfr/:prefDepartmentID')
        .get(ComponentSidStockController.getPromptIndicatorColor);

    router.route('/getAssignColorToUsers/:pcartMfr')
        .get(ComponentSidStockController.getAssignColorToUsers);

    router.route('/getNumberOfPrintsForUMID/:id')
        .get(ComponentSidStockController.getNumberOfPrintsForUMID);

    router.route('/getUMIDDetailsById')
        .post(ComponentSidStockController.getUMIDDetailsById);

    router.route('/getGenericCategoryByType')
        .post(ComponentSidStockController.getGenericCategoryByType);

    router.route('/getNonUMIDCount')
        .post(ComponentSidStockController.getNonUMIDCount);

    router.route('/getBartenderServerDetails')
        .post(ComponentSidStockController.getBartenderServerDetails);

    router.route('/saveBartenderServerDetails')
        .post(ComponentSidStockController.saveBartenderServerDetails);

    router.route('/getCofcDocumentDetails')
        .post(ComponentSidStockController.getCofcDocumentDetails);

    router.route('/importUMIDDetail')
        .post(ComponentSidStockController.importUMIDDetail);

    router.route('/getCOFCByBinIdPartId')
        .post(ComponentSidStockController.getCOFCByBinIdPartId);

    router.route('/getDataElementValueOfUMID')
        .post(ComponentSidStockController.getDataElementValueOfUMID);

    router.route('/verifyLabelTemplate')
        .post(ComponentSidStockController.verifyLabelTemplate);

    router.route('/getDataForPrintLabelTemplate')
        .post(ComponentSidStockController.getDataForPrintLabelTemplate);

    router.route('/printLabelTemplate')
        .post(ComponentSidStockController.printLabelTemplate);

    router.route('/getPricingDetailForCostCategory')
        .post(ComponentSidStockController.getPricingDetailForCostCategory);

    router.route('/generateInternalDateCode')
        .post(ComponentSidStockController.generateInternalDateCode);

    router.route('/getUmidTabCount')
        .post(ComponentSidStockController.getUmidTabCount);

    router.route('/getInTransitCheckoutreel/:transactionID')
        .get(ComponentSidStockController.getInTransitCheckoutreel);

    router.route('/getInTransitUMIDDetail/:uid')
        .get(ComponentSidStockController.getInTransitUMIDDetail);

    router.route('/getExistingAssemblyWorkorderDetail')
        .post(ComponentSidStockController.getExistingAssemblyWorkorderDetail);

    router.route('/createSplitUMID')
        .post(ComponentSidStockController.createSplitUMID);

    router.route('/getSameCriteriaUMIDPackingSlipDetails')
        .post(ComponentSidStockController.getSameCriteriaUMIDPackingSlipDetails);

    router.route('/getSplitUIDList')
        .post(ComponentSidStockController.getSplitUIDList);

    router.route('/getDeallocatedUIDList')
        .post(ComponentSidStockController.getDeallocatedUIDList);

    router.route('/checkDeleteUIDValidation')
        .post(ComponentSidStockController.checkDeleteUIDValidation);

    router.route('/getUMIDDetailsForManageStock')
        .post(ComponentSidStockController.getUMIDDetailsForManageStock);

    router.route('/manageIdenticalUMID')
        .post(ComponentSidStockController.manageIdenticalUMID);
    app.use(
        '/api/v1/componentsidstock',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );

    router.route('/getPrinterList')
        .post(ComponentSidStockController.getPrinterList);

    router.route('/getSubAssemblyOnAssembly/:id')
        .get(ComponentSidStockController.getSubAssemblyOnAssembly);

    router.route('/saveRestrictUMIDDetail')
        .post(ComponentSidStockController.saveRestrictUMIDDetail);

    router.route('/getComponentShelfLifeDetailsById')
        .post(ComponentSidStockController.getComponentShelfLifeDetailsById);
};