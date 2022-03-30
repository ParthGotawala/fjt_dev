const router = require('express').Router();

const ComponentDynamicAttributeController = require('../controllers/ComponentDynamicAttributeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
  router.route('/createPartDynamicAttribute')
    .post(ComponentDynamicAttributeController.createPartDynamicAttribute);

  router.route('/updatePartDynamicAttribute')
    .post(ComponentDynamicAttributeController.updatePartDynamicAttribute);

  router.route('/retrivePartDynamicAttributeList')
    .post(ComponentDynamicAttributeController.retrivePartDynamicAttributeList);

  router.route('/retrivePartDynamicAttribute/:id')
    .get(ComponentDynamicAttributeController.retrivePartDynamicAttribute);

  router.route('/deletePartDynamicAttribute')
    .post(ComponentDynamicAttributeController.deletePartDynamicAttribute);

  router.route('/checkDuplicatePartDynamicAttribute')
    .post(ComponentDynamicAttributeController.checkDuplicatePartDynamicAttribute);

  router.route('/getPartDynamicAttributeList')
    .get(ComponentDynamicAttributeController.getPartDynamicAttributeList);

  router.route('/updateDynamicAttributeDisplayOrder')
    .post(ComponentDynamicAttributeController.updateDynamicAttributeDisplayOrder);

  app.use(
    '/api/v1/operationalattributes',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};