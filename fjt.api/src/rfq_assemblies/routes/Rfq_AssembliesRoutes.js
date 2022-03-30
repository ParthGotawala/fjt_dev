const router = require('express').Router();

const RfqAssembliesController = require('../controllers/Rfq_AssembliesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getAssyDetails/:id')
        .get(RfqAssembliesController.getAssyDetails);

    router.route('/getAllUniqueSubAssemblyByPartID/:id')
        .get(RfqAssembliesController.getAllUniqueSubAssemblyByPartID);

    router.route('/getAllUniqueSubAssemblyByBOMPartID/:id')
        .get(RfqAssembliesController.getAllUniqueSubAssemblyByBOMPartID);

    router.route('/getAllRFQAssemblyByPartID/:id')
        .get(RfqAssembliesController.getAllRFQAssemblyByPartID);

    router.route('/getAssyQuoteSummaryDetails')
        .post(RfqAssembliesController.getAssyQuoteSummaryDetails);

    router.route('/generateAssyQuoteSummary/:id/:quoteSubmittedID')
        .get(RfqAssembliesController.generateAssyQuoteSummary);

    router.route('/getRFQAssyByID/:id')
        .get(RfqAssembliesController.getRFQAssyByID);

    router.route('/getBOMProgress/:id')
        .get(RfqAssembliesController.getBOMProgress);

    router.route('/getBOMIconList/:id')
        .get(RfqAssembliesController.getBOMIconList);

    router.route('/getAssemblyRequoteHistory')
        .post(RfqAssembliesController.getAssemblyRequoteHistory);

    router.route('/getAssyGlanceData/:partID')
        .get(RfqAssembliesController.getAssyGlanceData);

    router.route('/getRFQAssyQtyList/:rfqAssyID')
        .get(RfqAssembliesController.getRFQAssyQtyList);

    router.route('/saveQuoteSubmittedSummaryDetails')
        .post(RfqAssembliesController.saveQuoteSubmittedSummaryDetails);

    router.route('/changeAssyStatus')
        .post(RfqAssembliesController.changeAssyStatus);

    router.route('/startStopCostingActivity')
        .post(RfqAssembliesController.startStopCostingActivity);

    router.route('/retrieveActivityTrackingHistory')
        .post(RfqAssembliesController.retrieveActivityTrackingHistory);

    router.route('/generateRFQQuoteDetailReport')
        .post(RfqAssembliesController.generateRFQQuoteDetailReport);

    router.route('/generateRFQCostDetailReport')
        .post(RfqAssembliesController.generateRFQCostDetailReport);

    router.route('/getAssemblyHeaderDetails')
        .post(RfqAssembliesController.getAssemblyHeaderDetails);

    router.route('/saveInternalVersionAssy')
        .post(RfqAssembliesController.saveInternalVersionAssy);

    router.route('/getAssemblyHistoryByID/:id')
        .get(RfqAssembliesController.getAssemblyHistoryByID);

    router.route('/saveManualActivityTracking')
        .post(RfqAssembliesController.saveManualActivityTracking);

    router.route('/getAllRFQListByID')
        .post(RfqAssembliesController.getAllRFQListByID);

    router.route('/deleteAssyTransHistory')
        .post(RfqAssembliesController.deleteAssyTransHistory);

    router.route('/updatePaymentBurdanDetails')
        .post(RfqAssembliesController.updatePaymentBurdanDetails);

    router.route('/retrieveManualEntryList')
        .post(RfqAssembliesController.retrieveManualEntryList);

    app.use('/api/v1/rfqAssemblies',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
