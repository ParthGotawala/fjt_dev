const router = require('express').Router();

const componentPriceBreakDetails = require('../controllers/ComponentPriceBreakDetailsController');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');
const populateUser = require('../../auth/populateUser');

module.exports = (app) => {
    router.route('/')
        .post(componentPriceBreakDetails.createComponentPriceBreakDetails);

    router.route('/retrieveComponentPriceBreakDetailsList')
        .post(componentPriceBreakDetails.retrieveComponentPriceBreakDetailsList);

    router.route('/:id')
        .get(componentPriceBreakDetails.getComponentPriceBreakDetails)
        .put(componentPriceBreakDetails.updateComponentPriceBreakDetails);

    router.route('/deletePriceBreakDetails')
        .post(componentPriceBreakDetails.deletePriceBreakDetails);

    router.route('/saveAssySalesPrice')
        .post(componentPriceBreakDetails.saveAssySalesPrice);

    router.route('/getAssySalesPriceListByAssyId')
        .post(componentPriceBreakDetails.getAssySalesPriceListByAssyId);
    router.route('/getSalesCommissionHistoryList')
        .post(componentPriceBreakDetails.getSalesCommissionHistoryList);
    router.route('/getSalesCommissionHistoryDetList')
        .post(componentPriceBreakDetails.getSalesCommissionHistoryDetList);

    router.route('/getSalesCommissionDetailsFromRfq')
        .post(componentPriceBreakDetails.getSalesCommissionDetailsFromRfq);

    app.use(
        '/api/v1/componentPriceBreakDetails',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};