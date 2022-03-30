const router = require('express').Router(); // eslint-disable-line
const ChartTemplateAccessController = require('../controllers/Chart_Template_AccessController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retrieveEmployeeChartTemplateDetails/:chartTemplateID')
        .get(ChartTemplateAccessController.retrieveEmployeeChartTemplateDetails);

    router.route('/createChartTemplateEmployeeList')
        .post(ChartTemplateAccessController.createChartTemplateEmployeeList);

    router.route('/deleteChartTemplateEmployeeList')
        .delete(ChartTemplateAccessController.deleteChartTemplateEmployeeList);

    app.use(
        '/api/v1/chart_template_access',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
