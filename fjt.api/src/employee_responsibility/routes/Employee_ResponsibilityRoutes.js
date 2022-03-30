const router = require('express').Router(); // eslint-disable-line
const employeeResponsibility = require('../controllers/Employee_ResponsibilityController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveEmployeeResponsibility')
        .post(employeeResponsibility.saveEmployeeResponsibility);

    router.route('/getEmployeeResponsibility/:employeeID')
        .get(employeeResponsibility.getEmployeeResponsibility);

    router.route('/getResponsibilityWiseEmployeeList/:gencCategoryType')
        .get(employeeResponsibility.getResponsibilityWiseEmployeeList);

    app.use('/api/v1/employeeResponsibility',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
