const router = require('express').Router(); // eslint-disable-line
const employee = require('../controllers/EmployeeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/downloadPersonnelTemplate/:module')
        .get(employee.downloadPersonnelTemplate);

    // place above '/' because of route conflict
    router.route('/employeeList')
        .get(employee.employeeAsManagerList);

    router.route('/getEmployeeListByCustomer')
        .get(employee.getEmployeeListByCustomer);

    router.route('/retrieveEmployeeProfile/:id')
        .get(employee.retrieveEmployeeProfile);

    router.route('/retrieveWorkStationDetail/:id')
        .get(employee.retrieveWorkStationDetail);

    router.route('/retrieveEmployeeOperations/:id')
        .get(employee.retrieveEmployeeOperations);

    router.route('/isactiveTransEmployee/:id')
        .get(employee.isactiveTransEmployee);

    router.route('/')
        .get(employee.retrieveEmployee)
        .post(employee.createEmployee);

    router.route('/retrieveEmployeeList')
        .post(employee.retrieveEmployeeList);

    router.route('/:id/:isPermanentDelete?')
        .get(employee.retrieveEmployee)
        .put(employee.updateEmployee);
    // .delete(employee.deleteEmployee);

    router.route('/createOperation_EmployeeList')
        .post(employee.createOperation_EmployeeList);

    router.route('/createWorkstation_EquipmentList')
        .post(employee.createWorkstation_EquipmentList);

    router.route('/deleteEmployee')
        .post(employee.deleteEmployee);

    router.route('/deleteWorkstation_EquipmentListFromEmployee')
        .delete(employee.deleteWorkstation_EquipmentListFromEmployee);

    router.route('/deleteOperationsOfEmployee')
        .delete(employee.deleteOperationsOfEmployee);

    router.route('/changePassword')
        .post(employee.changePassword);

    router.route('/authenticateUser')
        .post(employee.authenticateUser);

    router.route('/updateEmployeeDefaultChartCategory')
        .post(employee.updateEmployeeDefaultChartCategory);

    router.route('/checkEmailIDAlreadyExists')
        .post(employee.checkEmailIDAlreadyExists);

    router.route('/GetEmployeeDetail')
        .post(employee.GetEmployeeDetail);
    
    router.route('/GerCurrentContactPersonByEmpId')
        .post(employee.GerCurrentContactPersonByEmpId);

    router.route('/releaseContactPersonById')
        .post(employee.releaseContactPersonById);

    router.route('/deleteEmployeeContactPerson')
        .post(employee.deleteEmployeeContactPerson);

    app.use('/api/v1/employees',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
