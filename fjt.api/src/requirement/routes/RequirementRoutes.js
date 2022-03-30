const router = require('express').Router();

const RequirementController = require('../controllers/RequirementController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveRequirement')
        .post(RequirementController.saveRequirement);

    router.route('/getAllRequirement')
        .post(RequirementController.getRequirementList);

    router.route('/deleteRequirement')
        .post(RequirementController.deleteRequirement);

    router.route('/checkDuplicateTemplate')
        .post(RequirementController.checkDuplicateTemplate);

    router.route('/retriveRequirement')
        .get(RequirementController.retriveRequirement);

    router.route('/retriveRequirementList')
        .post(RequirementController.retriveRequirementList);

    app.use('/api/v1/requirement_template',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
