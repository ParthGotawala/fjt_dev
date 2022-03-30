const router = require('express').Router();

const ComponenetInspectionRequirementDetController = require('../controllers/Componenet_inspection_Requirement_DetController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    router.route('/getAllPurchaseInspectionRequirement')
        .post(ComponenetInspectionRequirementDetController.getAllPurchaseInspectionRequirement);

    router.route('/deletePurchaseInspectionRequirement')
        .post(ComponenetInspectionRequirementDetController.deletePurchaseInspectionRequirement);

    router.route('/addPurchaseInspectionRequirement')
        .post(ComponenetInspectionRequirementDetController.addPurchaseInspectionRequirement);

    router.route('/getPurchaseInspectionRequirementByPartId')
        .post(ComponenetInspectionRequirementDetController.getPurchaseInspectionRequirementByPartId);
    router.route('/getPartMasterCommentsByPartId')
        .post(ComponenetInspectionRequirementDetController.getPartMasterCommentsByPartId);
    app.use(
        '/api/v1/comp_inspect_req_det',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};