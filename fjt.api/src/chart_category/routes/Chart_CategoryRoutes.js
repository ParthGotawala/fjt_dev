const router = require('express').Router(); // eslint-disable-line
const ChartCategory = require('../controllers/Chart_CategoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getChartCategoryList')
        .get(ChartCategory.getChartCategoryList);

    router.route('/saveChartCategory')
        .post(ChartCategory.saveChartCategory);

    router.route('/getChartCategoryByID/:id')
        .get(ChartCategory.getChartCategoryByID);

    router.route('/checkDuplicateChartCategory')
        .post(ChartCategory.checkDuplicateChartCategory);

    app.use(
        '/api/v1/chartcategory',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
