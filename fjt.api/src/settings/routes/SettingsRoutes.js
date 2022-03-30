const router = require('express').Router(); // eslint-disable-line
const SettingsController = require('../controllers/SettingsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {

  router.route('/retriveDataKeyList')
    .post(SettingsController.retriveDataKeyList);

  router.route('/:id')
    .put(SettingsController.updateSettings);

  router.route('/getSelectedGlobalSettingKeyValues')
    .post(SettingsController.getSelectedGlobalSettingKeyValues);

  router.route('/retriveExternalKeySettings')
    .post(SettingsController.retriveExternalKeySettings);

  router.route('/saveExternalKeySettings')
    .post(SettingsController.saveExternalKeySettings);

  router.route('/getTimezoneList')
    .get(SettingsController.getTimezoneList);

  router.route('/retriveExternalKeySettingsForCompanyLogo')
    .get(SettingsController.retriveExternalKeySettingsForCompanyLogo);

  app.use(
    '/api/v1/settings',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};