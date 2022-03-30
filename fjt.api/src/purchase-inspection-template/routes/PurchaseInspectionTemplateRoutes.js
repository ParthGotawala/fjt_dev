const router = require('express').Router();

const PurchaseInspectionTemplateController = require('../controllers/PurchaseInspectionTemplateController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getPurchaseInspTemplateList')
        .post(PurchaseInspectionTemplateController.getPurchaseInspTemplateList);

    router.route('/deletePurchaseRequirementTemplate')
        .post(PurchaseInspectionTemplateController.deletePurchaseRequirementTemplate);

    router.route('/checkDuplicateTemplate')
        .post(PurchaseInspectionTemplateController.checkDuplicateTemplate);

    router.route('/saveTemplate')
        .post(PurchaseInspectionTemplateController.createInspectionTemplate);

    router.route('/getInspectionDetailBySeach')
        .post(PurchaseInspectionTemplateController.getInspectionDetailBySeach);

    router.route('/getInspectionTemplateBySeach')
        .post(PurchaseInspectionTemplateController.getInspectionTemplateBySeach);

    router.route('/getPartRequirementCategoryBySearch')
        .post(PurchaseInspectionTemplateController.getPartRequirementCategoryBySearch);

    router.route('/getPurchaseRequirementByTemplateId')
        .post(PurchaseInspectionTemplateController.getPurchaseRequirementByTemplateId);

    // router.route('/getPurchaseRequirementTemplate/:id')
    //     .get(PurchaseInspectionTemplateController.getPurchaseRequirementTemplate);

    app.use('/api/v1/purchaseinspectiontemplate',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};