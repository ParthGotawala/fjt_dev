const router = require('express').Router(); // eslint-disable-line
const Defectcategory = require('../controllers/DefectcategoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(Defectcategory.createDefectCategory);

    router.route('/retriveDefectCategoryList')
        .post(Defectcategory.retriveDefectCategoryList);

    router.route('/:defectCatId')
        .get(Defectcategory.retriveDefectCategory)
        .put(Defectcategory.updateDefectCategory)
        .delete(Defectcategory.deleteDefectCategory);

    router.route('/getAllDefectCategory')
        .get(Defectcategory.getAllDefectCategory);

    router.route('/checkDuplicateDefectCategoryName')
        .post(Defectcategory.checkDuplicateDefectCategoryName);

    app.use(
        '/api/v1/defectcategory',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};