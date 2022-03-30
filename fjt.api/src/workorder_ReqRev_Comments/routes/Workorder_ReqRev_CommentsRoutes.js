const router = require('express').Router(); // eslint-disable-line
const WorkorderReqRevComments = require('../controllers/Workorder_ReqRev_CommentsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/saveWorkorderRevReqComments')
    .post(WorkorderReqRevComments.saveWorkorderRevReqComments);

  router.route('/getWorkorderRevReqComments')
    .post(WorkorderReqRevComments.getWorkorderRevReqComments);

  router.route('/setWORevReqCommentStatus')
    .post(WorkorderReqRevComments.setWORevReqCommentStatus);

  app.use('/api/v1/workorder_reqrev_comments',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
