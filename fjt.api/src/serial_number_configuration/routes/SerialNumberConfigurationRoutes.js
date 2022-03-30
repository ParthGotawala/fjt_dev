const router = require('express').Router(); // eslint-disable-line
const SerialNumberConfigurationController = require('../controllers/SerialNumberConfigurationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/retriveConfiguration')
    .get(SerialNumberConfigurationController.retriveConfiguration);
  router.route('/deleteConfiguration')
    .post(SerialNumberConfigurationController.deleteConfiguration);
  router.route('/saveConfiguration')
    .post(SerialNumberConfigurationController.saveConfiguration);
  app.use(
    '/api/v1/serialnumberconfiguration',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};