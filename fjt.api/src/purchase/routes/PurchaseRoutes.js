const router = require('express').Router();

const PurchaseController = require('../controllers/PurchaseController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getPurchaseList')
        .post(PurchaseController.getPurchaseList);

    router.route('/kitAllocationAssyList/:id')
        .get(PurchaseController.kitAllocationAssyList);

    router.route('/getPurchaseConsolidatedList')
        .post(PurchaseController.getPurchaseConsolidatedList);

    router.route('/getPurchasePIDcodeSearch')
        .post(PurchaseController.getPurchasePIDcodeSearch);

    router.route('/createPurchaseParts')
        .post(PurchaseController.createPurchaseParts);

    router.route('/getPurchasePartsDetailList')
        .post(PurchaseController.getPurchasePartsDetailList);

    router.route('/getComponnetMfgDescription/:id')
        .get(PurchaseController.getComponnetMfgDescription);

    router.route('/updatePurchasePartsDetails/:id')
        .put(PurchaseController.updatePurchasePartsDetails);

    router.route('/deletePurchasePartsDetails')
        .post(PurchaseController.deletePurchasePartsDetails);
    router.route('/savePurchasePrice')
        .post(PurchaseController.savePurchasePrice);

    router.route('/getPONumberSearch')
        .post(PurchaseController.getPONumberSearch);

    router.route('/getPurchaseSelectedPartsList')
        .post(PurchaseController.getPurchaseSelectedPartsList);

    app.use(
        '/api/v1/purchase',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};