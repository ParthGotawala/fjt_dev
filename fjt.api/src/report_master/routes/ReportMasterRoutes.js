const router = require('express').Router(); // eslint-disable-line
const ReportMasterController = require('../controllers/ReportMasterController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/retriveCustomerReport')
    .get(ReportMasterController.retriveCustomerReport);

  router.route('/retriveCustomerReportList')
    .post(ReportMasterController.retriveCustomerReportList);

  router.route('/getReportList')
    .get(ReportMasterController.getReportList);

  router.route('/retriveReport')
    .post(ReportMasterController.retriveReportList);

  router.route('/retriveReportById/:id')
    .get(ReportMasterController.retriveReportById);

  router.route('/retriveParameterSettings/:id')
    .get(ReportMasterController.retriveParameterSettings);

  router.route('/retrieveClientId')
    .get(ReportMasterController.retrieveClientId);

    router.route('/getReportListByEntity')
    .post(ReportMasterController.getReportListByEntity);

    router.route('/getDefaultReportByEntity')
    .post(ReportMasterController.getDefaultReportByEntity);

    router.route('/getAutoCompleteFileterParameterData')
    .post(ReportMasterController.getAutoCompleteFileterParameterData);

    router.route('/retrieveReportTempleteList')
    .get(ReportMasterController.retrieveReportTempleteList);

  router.route('/saveReport')
    .post(ReportMasterController.saveReport);
  router.route('/saveReportParameterSettings')
    .post(ReportMasterController.saveReportParameterSettings);

    router.route('/retriveReportFilterParameterDetail/:id')
    .get(ReportMasterController.retriveReportFilterParameterDetail);

  router.route('/saveCustomerReport')
    .post(ReportMasterController.saveCustomerReport);

  router.route('/updateCustomerReport')
    .post(ReportMasterController.updateCustomerReport);

  // router.route('/updateReportCategory')
  //   .post(ReportMasterController.updateReportCategory);

  router.route('/updateReportAdditionalNotes')
    .post(ReportMasterController.updateReportAdditionalNotes);

  router.route('/deleteCustomerReport')
    .post(ReportMasterController.deleteCustomerReport);

  router.route('/getAssyLifeCycleAnalysis')
    .post(ReportMasterController.getAssyLifeCycleAnalysis);
  router.route('/getEmployeePerformanceDetail')
    .post(ReportMasterController.getEmployeePerformanceDetail);

  router.route('/checkNameUnique')
    .post(ReportMasterController.checkNameUnique);

  router.route('/deleteReports')
    .post(ReportMasterController.deleteReports);

  router.route('/connectionAdapter')
    .post(ReportMasterController.connectionAdapter);

  router.route('/getReportNameSearch')
    .post(ReportMasterController.getReportNameSearch);

  app.use('/api/v1/reportmaster',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
