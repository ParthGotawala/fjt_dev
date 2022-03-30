const router = require('express').Router(); // eslint-disable-line
const routerExternal = require('express').Router(); // eslint-disable-line
// eslint-disable-line
const consolidatepart = require('../controllers/RFQ_Consolidated_MFGPN_LineItemController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/')
    .get(consolidatepart.retrieveConsolidatedParts);
  router.route('/getPricingFromApis')
    .post(consolidatepart.getPricingFromApis);
  router.route('/stopPricingRequests')
    .post(consolidatepart.stopPricingRequests);
  router.route('/getAlternatePartList')
    .get(consolidatepart.getAlternatePartList);
  app.use(
    '/api/v1/consolidatepart',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );

  router.route('/updateConsolidatePart')
    .post(consolidatepart.updateConsolidatePart);

  router.route('/getnonQuotedQty/:rfqAssyID/:isPurchaseApi')
    .get(consolidatepart.getnonQuotedQty);

  router.route('/getPricingHistoryList/:rfqAssyID')
    .get(consolidatepart.getPricingHistoryList);

  router.route('/retrievePricingList/:rfqAssyID/:isPurchaseApi')
    .get(consolidatepart.retrievePricingList);

  router.route('/getNotQuoteNRNDCount')
    .get(consolidatepart.getNotQuoteNRNDCount);


  router.route('/getAssyIDAlternatePartList')
    .get(consolidatepart.getAssyIDAlternatePartList);
  router.route('/getSupplierList')
    .get(consolidatepart.getSupplierList);

  router.route('/getConsolidatePartQty/:id')
    .get(consolidatepart.getConsolidatePartQty);

  router.route('/saveManualPrice')
    .post(consolidatepart.saveManualPrice);
  router.route('/saveSupplierQuotePrice')
    .post(consolidatepart.saveSupplierQuotePrice);
  router.route('/updateManualPrice')
    .post(consolidatepart.updateManualPrice);

  router.route('/retrieveAllQtyPricing/:prfqAssyID')
    .get(consolidatepart.retrieveAllQtyPricing);

  router.route('/cleanPrice')
    .post(consolidatepart.cleanPrice);

  router.route('/cleanSelectionPrice')
    .post(consolidatepart.cleanSelectionPrice);

  router.route('/saveImportPricing')
    .post(consolidatepart.saveImportPricing);

  router.route('/saveAssyPriceQtyBreak')
    .post(consolidatepart.saveAssyPriceQtyBreak);

  router.route('/savePricingHistory')
    .post(consolidatepart.savePricingHistory);

  router.route('/getPricingHistoryforAssembly')
    .get(consolidatepart.getPricingHistoryforAssembly);

  router.route('/getConsolidateAvailableStock/:pconsolidateID')
        .get(consolidatepart.getConsolidateAvailableStock);
    router.route('/getUsedPricing')
        .post(consolidatepart.getUsedPricing);
    router.route('/removeSelectedQuotePrice')
        .post(consolidatepart.removeSelectedQuotePrice);

  app.use(
    '/api/v1/consolidatepartapi',
    routerExternal
  );
  routerExternal.route('/updatePricingStatusForError')
    .post(consolidatepart.updatePricingStatusForError);

  routerExternal.route('/externalPartBOMUpdate')
    .post(consolidatepart.externalPartBOMUpdate);

  routerExternal.route('/updatePricingStatusDigiKeyError')
    .post(consolidatepart.updatePricingStatusDigiKeyError);

  routerExternal.route('/updatePricingStatusForSuccess')
    .post(consolidatepart.updatePricingStatusForSuccess);

  routerExternal.route('/getAvailableUpdateDatasheetLinkList')
    .post(consolidatepart.getAvailableUpdateDatasheetLinkList);

  routerExternal.route('/externalPartBOMUpdateProgressbar')
    .post(consolidatepart.externalPartBOMUpdateProgressbar);

  routerExternal.route('/ExternalPartUpdate')
    .post(consolidatepart.ExternalPartUpdate);
  routerExternal.route('/externalPartMasterUpdateProgressbar')
        .post(consolidatepart.externalPartMasterUpdateProgressbar);
};
