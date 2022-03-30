const router = require('express').Router(); // eslint-disable-line
const ChartTemplateEmployee = require('../controllers/Chart_Template_Employee_DetailsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getChartTemplateEmployeeList/:employeeID')
        .get(ChartTemplateEmployee.getChartTemplateEmployeeList);
    router.route('/saveChartTemplateEmployeeList')
        .post(ChartTemplateEmployee.saveChartTemplateEmployeeList);

    app.use(
        '/api/v1/charttempalteemployee',

        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
