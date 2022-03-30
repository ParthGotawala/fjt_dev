const router = require('express').Router();

const summaryquote = require('../controllers/RFQ_Assy_QuotationsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/saveSummaryQuote')
    .post(summaryquote.saveSummaryQuote);

  router.route('/revisedQuote')
    .post(summaryquote.revisedQuote);

  router.route('/removeQuoteSummary')
    .post(summaryquote.removeQuoteSummary);

  router.route('/retriveSummaryQuote')
    .post(summaryquote.retriveSummaryQuote);
  router.route('/retriveDynamicFields')
    .get(summaryquote.retriveDynamicFields);
  router.route('/getPriceGroupDetail')
    .get(summaryquote.getPriceGroupDetail);
  router.route('/getSummaryTermsCondition/:rfqAssyID')
    .get(summaryquote.getSummaryTermsCondition);

  router.route('/getAssemblyCurrentStatus/:rfqAssyID')
    .get(summaryquote.getAssemblyCurrentStatus);

  app.use(
    '/api/v1/summaryquote',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};
