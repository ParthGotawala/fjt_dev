const router = require('express').Router(); // eslint-disable-line
const ECOTypeCategoryController = require('../controllers/ECOTypeCategoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retrieveECOCategoryWithValues')
        .post(ECOTypeCategoryController.retrieveECOCategoryWithValues);

    router.route('/getAllECOTypeCategory')
        .get(ECOTypeCategoryController.getAllECOTypeCategory);

    router.route('/')
        .post(ECOTypeCategoryController.createECOTypeCategory);

    router.route('/retrieveECOCategoryList')
        .post(ECOTypeCategoryController.retrieveECOCategory);

    router.route('/:ecoTypeCatID')
        .get(ECOTypeCategoryController.retrieveECOCategory)
        .put(ECOTypeCategoryController.updateECOTypeCategory);

    router.route('/deleteECOTypeCategory')
        .post(ECOTypeCategoryController.deleteECOTypeCategory);

    router.route('/checkEcoCategoryAlreadyExists')
        .post(ECOTypeCategoryController.checkEcoCategoryAlreadyExists);

    app.use(
        '/api/v1/ecocategory',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
