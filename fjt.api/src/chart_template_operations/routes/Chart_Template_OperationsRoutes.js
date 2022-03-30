const router = require('express').Router(); // eslint-disable-line
const ChartTemplateOperationsController = require('../controllers/Chart_Template_OperationsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')


module.exports = (app) => {
    router.route('/getChartTemplateOperationsList/:chartTemplateID')
        .get(ChartTemplateOperationsController.getChartTemplateOperationsList);
    router.route('/saveChartTemplateOperations')
        .post(ChartTemplateOperationsController.saveChartTemplateOperations);

    app.use(
        '/api/v1/ChartTemplateOperations',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
