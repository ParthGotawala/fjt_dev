const router = require('express').Router();
const RFQLineItems = require('../controllers/RFQLineItemsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/getRFQLineItemsByID/:id')
    .get(RFQLineItems.getRFQLineItemsByID);

  router.route('/getRFQLineItems')
    .post(RFQLineItems.getRFQLineItems);

  router.route('/saveRFQLineItems')
    .post(RFQLineItems.saveRFQLineItems);

  router.route('/draftRFQLineItems')
    .post(RFQLineItems.draftRFQLineItems);

  router.route('/validateMFGDistData')
    .post(RFQLineItems.validateMFGDistData);

  router.route('/deleteRFQAssyDetails')
    .post(RFQLineItems.deleteRFQAssyDetails);

  // router.route('/getMFGPNFromDistPN')
  //   .post(RFQLineItems.getMFGPNFromDistPN);

  router.route('/updateVerifyBOM')
    .post(RFQLineItems.updateVerifyBOM);

  router.route('/copyVerifiedBOM')
    .post(RFQLineItems.copyVerifiedBOM);

  router.route('/copyAssyBOM')
    .post(RFQLineItems.copyAssyBOM);

  router.route('/componentVerification')
    .post(RFQLineItems.componentVerification);

  router.route('/getAPIVerificationErrors')
    .post(RFQLineItems.getAPIVerificationErrors);

  router.route('/clearAPIVerificationErrors/:partID')
    .get(RFQLineItems.clearAPIVerificationErrors);

  router.route('/checkObsoleteParts')
    .post(RFQLineItems.checkObsoleteParts);

  router.route('/getApiVerifiedAlternateParts/:partID')
    .get(RFQLineItems.getApiVerifiedAlternateParts);

  router.route('/getApiVerifiedAlternatePartsCount/:rfqAssyID')
    .get(RFQLineItems.getApiVerifiedAlternatePartsCount);

  router.route('/cancelAPIVerification/:partID')
    .get(RFQLineItems.cancelAPIVerification);

  router.route('/getPartRefDesgMapping/:partID')
    .get(RFQLineItems.getPartRefDesgMapping);

  router.route('/getPartProgramMappingDetail/:partID')
    .get(RFQLineItems.getPartProgramMappingDetail);

  router.route('/downloadAVLTemplate/:fileType')
    .get(RFQLineItems.downloadAVLTemplate);

  router.route('/downloadBOMTemplate')
    .get(RFQLineItems.downloadBOMTemplate);

  router.route('/getAllCPNPartDetailListByCPNIDs')
    .get(RFQLineItems.getAllCPNPartDetailListByCPNIDs);

  router.route('/removebomstatus/:id')
    .get(RFQLineItems.removebomstatus);

  router.route('/getConsolidateLineItems/:rfqAssyID')
    .get(RFQLineItems.getConsolidateLineItems);

  router.route('/checkCPNExistInOtherBOM')
    .post(RFQLineItems.checkCPNExistInOtherBOM);

  router.route('/GetCustPNListFromPN')
    .post(RFQLineItems.GetCustPNListFromPN);

  router.route('/getAssyDriveToolsList')
    .post(RFQLineItems.getAssyDriveToolsList);

  router.route('/removeDuplicateSupplierError')
    .post(RFQLineItems.removeDuplicateSupplierError);

  router.route('/startStopBOMActivity')
    .post(RFQLineItems.startStopBOMActivity);

  router.route('/stopMultipleBOMActivity')
    .post(RFQLineItems.stopMultipleBOMActivity);

  router.route('/retrieveBOMorPMPregressStatus')
    .post(RFQLineItems.retrieveBOMorPMPregressStatus);

  router.route('/getBOMExportFile')
    .post(RFQLineItems.getBOMExportFile);

  // router.route('/getBOMExportWithStockFile')
  //  .post(RFQLineItems.getBOMExportWithStockFile);

  router.route('/savePartProgramMappingDetail')
        .post(RFQLineItems.savePartProgramMappingDetail);

    router.route('/updateReadyForPricingAssy')
        .post(RFQLineItems.updateReadyForPricingAssy);

  app.use(
    '/api/v1/rfqlineitems',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};
