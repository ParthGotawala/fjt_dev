const router = require('express').Router(); // eslint-disable-line
const ChartTemplateMstController = require('../controllers/Chart_TemplateMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(ChartTemplateMstController.saveChartTemplateDetail);

    router.route('/getAllChartTemplete')
        .post(ChartTemplateMstController.getAllChartTemplete);

    router.route('/:chartTemplateID')
        .get(ChartTemplateMstController.getChartTemplateDetail);

    router.route('/getChartDetailsByChartTemplateID')
        .post(ChartTemplateMstController.getChartDetailsByChartTemplateID);

    router.route('/getChartDrilldownDetails')
        .post(ChartTemplateMstController.getChartDrilldownDetails);

    router.route('/deleteChartTemplete')
        .post(ChartTemplateMstController.deleteChartTemplete);

    router.route('/setWidgetToDashboard')
        .post(ChartTemplateMstController.setWidgetToDashboard);

    router.route('/setWidgetToTraveler')
        .post(ChartTemplateMstController.setWidgetToTraveler);

    router.route('/getEmployeewiseAllChartTemplete')
        .post(ChartTemplateMstController.getEmployeewiseAllChartTemplete);

    app.use(
        '/api/v1/charttemplatemst',

        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
