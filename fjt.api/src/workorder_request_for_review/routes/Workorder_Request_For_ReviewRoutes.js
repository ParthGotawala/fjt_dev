const router = require('express').Router(); // eslint-disable-line
const WorkorderRequestForReview = require('../controllers/Workorder_Request_For_ReviewController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/getWorkorderOperationDetails/:woID/:opID')
    .get(WorkorderRequestForReview.getWorkorderOperationDetails);

  router.route('/getDefaultWORevReqForReview/:woID/:empID/:woRevReqID?')
    .get(WorkorderRequestForReview.getDefaultWORevReqForReview);

  router.route('/getWORevReqForReviewList/:woID/:empID')
    .get(WorkorderRequestForReview.getWORevReqForReviewList);

  router.route('/:woRevReqID')
    .get(WorkorderRequestForReview.getWORequestForReviewByID);

  router.route('/setWORevReqStatus')
    .post(WorkorderRequestForReview.setWORevReqStatus);

  router.route('/getInitialDraftWOReviewReq')
    .post(WorkorderRequestForReview.getInitialDraftWOReviewReq);

  router.route('/getRequestForReviewBywoID')
    .post(WorkorderRequestForReview.getRequestForReviewBywoID);

  router.route('/')
    .post(WorkorderRequestForReview.saveChangeRequest);

  app.use('/api/v1/workorder_request_for_review',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
