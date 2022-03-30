const router = require('express').Router(); // eslint-disable-line
const CostCategoryController = require('../controllers/CostCategoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    router.route('/saveCostCategory')
        .post(CostCategoryController.createCostCategory);

    router.route('/deleteCostCategory')
        .post(CostCategoryController.deleteCostCategory);

    router.route('/getCostCateogryList')
        .get(CostCategoryController.getCostCateogryList);

    router.route('/retriveCostCategoryList')
        .post(CostCategoryController.retriveCostCategoryList);

    router.route('/retriveCostCategory/:id')
        .get(CostCategoryController.retriveCostCategory);

    router.route('/checkUniqueCostCategory')
        .post(CostCategoryController.checkUniqueCostCategory);
    app.use(
        '/api/v1/costcategory',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
