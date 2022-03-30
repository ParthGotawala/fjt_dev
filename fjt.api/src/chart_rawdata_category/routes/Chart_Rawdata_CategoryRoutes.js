const router = require('express').Router(); // eslint-disable-line
const ChartRawdataCategoryController = require('../controllers/Chart_Rawdata_CategoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .get(ChartRawdataCategoryController.getChartRawDataList);
    router.route('/getChartRawViewColumns/:id')
        .get(ChartRawdataCategoryController.getChartRawViewColumns);
    router.route('/getChartRawdatalist')
        .get(ChartRawdataCategoryController.getChartRawdatalist);
    router.route('/saveChartrawdataCategory')
        .post(ChartRawdataCategoryController.saveChartrawdataCategory);
    router.route('/deleteRawdatacategory')
        .post(ChartRawdataCategoryController.deleteRawdatacategory);
    router.route('/getChartRawDataListByAccessRole')
        .post(ChartRawdataCategoryController.getChartRawDataListByAccessRole);
    router.route('/checkDuplicateRawDataCategoryDetails')
        .post(ChartRawdataCategoryController.checkDuplicateRawDataCategoryDetails);

    app.use(
        '/api/v1/chartrawdatacategory',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
