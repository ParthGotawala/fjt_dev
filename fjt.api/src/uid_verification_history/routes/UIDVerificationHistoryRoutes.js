const router = require('express').Router();

const UIDVerificationHistoryController = require('../controllers/UIDVerificationHistoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/')
    .post(UIDVerificationHistoryController.verificationHistory);

  app.use(
    '/api/v1/UMID/verificationhistory',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};