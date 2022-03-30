const router = require('express').Router();

const LabelTemplatesController = require('../controllers/LabelTemplatesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/createLabelTemplate')
    .post(LabelTemplatesController.createLabelTemplate);

  router.route('/updateLabelTemplate')
    .post(LabelTemplatesController.updateLabelTemplate);

  router.route('/verifyLabelTemplate')
    .post(LabelTemplatesController.verifyLabelTemplate);

  router.route('/uploadLabelTemplatesDocuments')
    .post(LabelTemplatesController.uploadLabelTemplatesDocuments);

  router.route('/getPrinterAndLabelTemplateData')
    .post(LabelTemplatesController.getPrinterAndLabelTemplateData);

  router.route('/retriveLabelTemplatesList')
    .post(LabelTemplatesController.retriveLabelTemplatesList);

  router.route('/:id')
    .get(LabelTemplatesController.retriveLabelTemplates);

  router.route('/deleteLabelTemplates')
    .post(LabelTemplatesController.deleteLabelTemplates);

  router.route('/getPrinterAndLabelTemplateData')
    .post(LabelTemplatesController.getPrinterAndLabelTemplateData);

  router.route('/downloadSampleFileIntegration')
    .post(LabelTemplatesController.downloadSampleFileIntegration);

  app.use(
    '/api/v1/labeltemplates',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};