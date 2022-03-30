const router = require('express').Router();

const SupplierQuoteController = require('../controllers/SupplierQuoteController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retrieveSupplierQuoteList')
        .post(SupplierQuoteController.retrieveSupplierQuoteList);

    router.route('/getSupplierQuoteByID/:id')
        .get(SupplierQuoteController.getSupplierQuoteByID);

    router.route('/checkUniqueSupplierQuoteNumber')
        .post(SupplierQuoteController.checkUniqueSupplierQuoteNumber);

    router.route('/manageSupplierQuoteDetail')
        .post(SupplierQuoteController.manageSupplierQuoteDetail);

    router.route('/checkUniqueSupplierQuotePart')
        .post(SupplierQuoteController.checkUniqueSupplierQuotePart);

    router.route('/saveSupplierQuotePartDetail')
        .post(SupplierQuoteController.saveSupplierQuotePartDetail);

    router.route('/retrieveSupplierQuotePartList')
        .post(SupplierQuoteController.retrieveSupplierQuotePartList);

    router.route('/deleteSupplierQuote')
        .post(SupplierQuoteController.deleteSupplierQuote);

    router.route('/deleteSupplierQuotePartDetail')
        .post(SupplierQuoteController.deleteSupplierQuotePartDetail);

    router.route('/getSupplierQuotePartPriceHeaderDetails/:id')
        .get(SupplierQuoteController.getSupplierQuotePartPriceHeaderDetails);

    router.route('/retrieveSupplierQuotePartPricingDetails')
        .post(SupplierQuoteController.retrieveSupplierQuotePartPricingDetails);

    router.route('/getSupplierQuoteNumberList')
        .post(SupplierQuoteController.getSupplierQuoteNumberList);

    router.route('/saveSupplierQuotePartPricingDetails')
        .post(SupplierQuoteController.saveSupplierQuotePartPricingDetails);

    router.route('/importSupplierQuotePartPricingDetails')
        .post(SupplierQuoteController.importSupplierQuotePartPricingDetails);

    router.route('/copySupplierQuote')
        .post(SupplierQuoteController.copySupplierQuote);

    router.route('/checkInActivePartOfSupplierQuote')
        .post(SupplierQuoteController.checkInActivePartOfSupplierQuote);

    router.route('/checkSupplierQuoteQuoteNumberAndPartID')
        .post(SupplierQuoteController.checkSupplierQuoteQuoteNumberAndPartID);

    router.route('/checkSupplierQuotePartDetailLinePricingAttributes')
        .post(SupplierQuoteController.checkSupplierQuotePartDetailLinePricingAttributes);

    router.route('/retrieveSupplierQuoteAttributes')
        .post(SupplierQuoteController.retrieveSupplierQuoteAttributes);

    router.route('/retrieveSupplierQuotePartPricingHistory')
        .post(SupplierQuoteController.retrieveSupplierQuotePartPricingHistory);

    router.route('/removeSupplierQuotePartPricingLines')
        .post(SupplierQuoteController.removeSupplierQuotePartPricingLines);

    router.route('/checkSupplierQuotePartPricingValidations')
        .post(SupplierQuoteController.checkSupplierQuotePartPricingValidations);

    router.route('/retrieveSupplierAttributeTemplate')
        .post(SupplierQuoteController.retrieveSupplierAttributeTemplate);

    router.route('/retrieveSupplierQuotePartPricingWhereUsed')
        .post(SupplierQuoteController.retrieveSupplierQuotePartPricingWhereUsed);

    router.route('/saveSupplierQuoteNegotiatePriceDetails')
        .post(SupplierQuoteController.saveSupplierQuoteNegotiatePriceDetails);

    router.route('/getSupplierList')
        .post(SupplierQuoteController.getSupplierList);

    router.route('/checkSupplierQuotePricingUsed')
        .post(SupplierQuoteController.checkSupplierQuotePricingUsed);

    router.route('/retrieveSupplierQuotePricingDetailsByPartID')
        .post(SupplierQuoteController.retrieveSupplierQuotePricingDetailsByPartID);

    app.use(
        '/api/v1/supplierQuote',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};