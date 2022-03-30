const router = require('express').Router(); // eslint-disable-line
const OperationEmployee = require('../controllers/Operation_EmployeeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/deleteOperation_EmployeeList')
        .delete(OperationEmployee.deleteOperation_EmployeeList);

    /* retrieve employees with operation*/
    router.route('/retrieveEmployeeOperationDetails/:id')
        .get(OperationEmployee.retrieveEmployeeOperationDetails);

    router.route('/createOperation_EmployeeList')
        .post(OperationEmployee.createOperation_EmployeeList);

    router.route('/retrieveNotAddedEmployeeListForOp')
        .post(OperationEmployee.retrieveNotAddedEmployeeListForOp);

    router.route('/retrieveAddedEmployeeListForOp')
        .post(OperationEmployee.retrieveAddedEmployeeListForOp);

    /* save,delete,update master template*/
    app.use(
        '/api/v1/Operation_Employee',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
