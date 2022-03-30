const router = require('express').Router(); // eslint-disable-line
const DynamicReportAccess = require('../controllers/DynamicReportAccessController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/getAccessEmployeeList/:refTableName/:refTransID')
    .get(DynamicReportAccess.getAccessEmployeeList);

  router.route('/retrieveEmployeesOfMISReportDetails')
    .post(DynamicReportAccess.retrieveEmployeesOfMISReportDetails);

  router.route('/createMISReportEmployeeList')
    .post(DynamicReportAccess.createMISReportEmployeeList);

  router.route('/deleteMISReportEmployeeList')
    .post(DynamicReportAccess.deleteMISReportEmployeeList);

  app.use(
    '/api/v1/dynamicreportaccess',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};
