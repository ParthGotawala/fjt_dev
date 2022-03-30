const router = require('express').Router();

const FeatureMst = require('../controllers/FeatureMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/getFeaturesList')
    .get(FeatureMst.getFeaturesList);

  router.route('/AssignFeaturePageRights')
    .post(FeatureMst.AssignFeaturePageRights);

  app.use(
    '/api/v1/feature',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};