const router = require('express').Router();

const commentController = require('../controllers/AssemblyRevisionCommentsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/retrieveComments')
    .post(commentController.retrieveComments);

  router.route('/getCommentByID')
    .post(commentController.getCommentByID);

  router.route('/checkCommentUnique')
    .post(commentController.checkCommentUnique);

  router.route('/saveComment')
    .post(commentController.saveComment);

  router.route('/deleteComment')
        .post(commentController.deleteComment);
    router.route('/getPartMasterInternalCommentsByPartId')
        .post(commentController.getPartMasterInternalCommentsByPartId);

  app.use(
    '/api/v1/comments',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};