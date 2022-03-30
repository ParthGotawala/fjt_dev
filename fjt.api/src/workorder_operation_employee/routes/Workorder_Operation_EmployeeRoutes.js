const router = require('express').Router(); // eslint-disable-line
const WorkorderOperationEmployee = require('../controllers/Workorder_Operation_EmployeeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/saveWorkorderOperation_Employee')
    .post(WorkorderOperationEmployee.saveWorkorderOperation_Employee);

  router.route('/getWorkorderEmployeeByOpID')
    .post(WorkorderOperationEmployee.getWorkorderEmployeeByOpID);

  router.route('/deleteOperationFromWorkOrder')
    .post(WorkorderOperationEmployee.deleteOperationFromWorkOrder);

  router.route('/addEmployeeToWorkOrder')
    .post(WorkorderOperationEmployee.addEmployeeToWorkOrder);

  router.route('/retriveOperationListbyWoID/:woID')
    .get(WorkorderOperationEmployee.retriveOperationListbyWoID);


  router.route('/retriveEmployeeListbyWoID/:woID')
    .get(WorkorderOperationEmployee.retriveEmployeeListbyWoID);

  router.route('/retriveEmployeeDetailsbyEmpID')
    .post(WorkorderOperationEmployee.retriveEmployeeDetailsbyEmpID);

  // router.route('/getWorkorderEmployeeDetailsByEmpCodeOld')
  //   .post(WorkorderOperationEmployee.getWorkorderEmployeeDetailsByEmpCodeOld);


  router.route('/getWorkorderEmployeeDetailsByEmpCode')
    .post(WorkorderOperationEmployee.getWorkorderEmployeeDetailsByEmpCode);

  router.route('/getOperationListByWoID')
    .post(WorkorderOperationEmployee.getOperationListByWoID);

  router.route('/getWorkorderEmployeeOperationByWoID')
    .post(WorkorderOperationEmployee.getWorkorderEmployeeOperationByWoID);

  router.route('/getWorkorderDocumentsByWoID')
    .post(WorkorderOperationEmployee.getWorkorderDocumentsByWoID);

  router.route('/getWorkorderEquipmentByWoID')
    .post(WorkorderOperationEmployee.getWorkorderEquipmentByWoID);

  router.route('/getWorkorderPartByWoID')
    .post(WorkorderOperationEmployee.getWorkorderPartByWoID);

  router.route('/getWorkorderCertificateByWoID')
    .post(WorkorderOperationEmployee.getWorkorderCertificateByWoID);

  router.route('/getEmployeeForAuditLogByWoOpEmployeeID/:woOpEmployeeID')
    .get(WorkorderOperationEmployee.getEmployeeForAuditLogByWoOpEmployeeID);

  router.route('/deleteWorkorderOperation_EmployeeList')
    .delete(WorkorderOperationEmployee.deleteWorkorderOperation_EmployeeList);
  router.route('/getAllWorkorderSerials/:woID')
    .get(WorkorderOperationEmployee.getAllWorkorderSerials);

  router.route('/retrieveNotAddedEmployeeListForWoOp')
    .post(WorkorderOperationEmployee.retrieveNotAddedEmployeeListForWoOp);

  router.route('/retrieveAddedEmployeeListForWoOp')
    .post(WorkorderOperationEmployee.retrieveAddedEmployeeListForWoOp);

  router.route('/retrieveAddedEmployeeListForWO')
    .post(WorkorderOperationEmployee.retrieveAddedEmployeeListForWO);

  app.use(
    '/api/v1/workorder_operation_employee',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};
