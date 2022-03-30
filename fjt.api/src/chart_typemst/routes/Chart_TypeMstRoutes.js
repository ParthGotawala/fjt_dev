const router = require('express').Router(); // eslint-disable-line
const ChartTypeMstController = require('../controllers/Chart_TypeMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    router.route('/')
        .get(ChartTypeMstController.getChartTypeList);

    router.route('/saveChartType')
        .post(ChartTypeMstController.createChartType);

    router.route('/getChartTypeList')
        .get(ChartTypeMstController.getChartTypeList);

    router.route('/deleteChartType')
        .post(ChartTypeMstController.deleteChartType);

    router.route('/retriveChartType')
        .get(ChartTypeMstController.retriveChartTypeList);

    router.route('/retriveChartType/:id')
        .get(ChartTypeMstController.retriveChartTypeList);

    app.use(
        '/api/v1/charttypemst',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};