const router = require('express').Router();

const PurchaseIncomingRequirementController = require('../controllers/PurchaseIncomingRequirementController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/savePurchaseInspection')
        .post(PurchaseIncomingRequirementController.savePurchaseInspection);

    router.route('/getpurchaseInspectionList')
        .post(PurchaseIncomingRequirementController.getpurchaseInspectionList);

    router.route('/getpurchaseInspectionRequirement/:id')
        .get(PurchaseIncomingRequirementController.getpurchaseInspectionRequirement);

    router.route('/getPurchaseRequirementList')
        .get(PurchaseIncomingRequirementController.getPurchaseRequirementList);

    router.route('/deletePurchaseRequirement')
        .post(PurchaseIncomingRequirementController.deletePurchaseRequirement);

    router.route('/checkDuplicatePurchaseRequirement')
        .post(PurchaseIncomingRequirementController.checkDuplicatePurchaseRequirement);

    router.route('/whereUsedRequirementReference')
        .post(PurchaseIncomingRequirementController.whereUsedRequirementReference);
    router.route('/updatePartRequiremmentCategorys')
        .post(PurchaseIncomingRequirementController.updatePartRequiremmentCategorys);

    app.use('/api/v1/purchaseinspection',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};