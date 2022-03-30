const router = require('express').Router(); // eslint-disable-line
const StimulsoftReportsController = require('../controllers/StimulsoftReportsController');
const authReportToken = require('../../auth/authReportToken');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  // router.route('/getDashboard')
  //   .get(StimulsoftReportsController.getDashboard);

  // router.route('/getReport')
  //   .get(StimulsoftReportsController.getReport);
  // router.route('/addReport')
  //   .post(StimulsoftReportsController.addReport);
  // router.route('/addDashboardReport')
  //   .post(StimulsoftReportsController.addDashboardReport);
  router.route('/connectionAdapter')
    .post(StimulsoftReportsController.connectionAdapter);
  router.route('/stopActivity')
    .post(StimulsoftReportsController.stopActivity);

  // router.route('/discardDraftChange')
  //   .post(StimulsoftReportsController.discardDraftChange);
  router.route('/deleteReportOnDiscardDraft')
    .post(StimulsoftReportsController.deleteReportOnDiscardDraft);


  app.use(
    '/api/v1/reportdetail',
    validateToken,

    jwtErrorHandler,
    authReportToken,
    router
  );
};
