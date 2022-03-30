const router = require('express').Router(); // eslint-disable-line
const employeemfgmapping = require('../controllers/EmployeeMfgMappingController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/retrieveNotAddedCustomerListForEmployee')
    .post(employeemfgmapping.retrieveNotAddedCustomerListForEmployee);

  router.route('/retrieveAddedCustomerListForEmployee')
    .post(employeemfgmapping.retrieveAddedCustomerListForEmployee);

  router.route('/createCustomerEmployeesMapping')
    .post(employeemfgmapping.createCustomerEmployeesMapping);

  router.route('/deleteCustomerEmployeeMapping')
    .post(employeemfgmapping.deleteCustomerEmployeeMapping);


  app.use('/api/v1/employeemfgmapping',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
