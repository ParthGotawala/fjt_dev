const router = require('express').Router(); // eslint-disable-line
const employeeDepartment = require('../controllers/EmployeeDepartmentController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  // place above '/' because of route conflict

  router.route('/getEmployeeAllDepartment/:employeeID')
    .get(employeeDepartment.getEmployeeAllDepartment);

  router.route('/getEmployeeListInDepartment/:departmentID')
    .get(employeeDepartment.getEmployeeListInDepartment);

  router.route('/addEmployeeInDepartment')
    .post(employeeDepartment.addEmployeeInDepartment);

  router.route('/setDefaultDepartmentToEmployee')
    .put(employeeDepartment.setDefaultDepartmentToEmployee);

  router.route('/updateEmployeeInDepartment/:id')
    .put(employeeDepartment.updateEmployeeInDepartment);

  router.route('/')
    .post(employeeDepartment.createEmployeeDepartment);

  router.route('/:id')
    .put(employeeDepartment.updateEmployeeDepartment)
    .delete(employeeDepartment.deleteEmployeeDepartment);

  app.use('/api/v1/employee_department',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
