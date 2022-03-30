const router = require('express').Router(); // eslint-disable-line
const WorkorderOperationEquipmentFeederDetailsController = require('../controllers/WorkorderOperationEquipmentFeederDetailsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/')
    .get(WorkorderOperationEquipmentFeederDetailsController.retriveFeeder)
    .post(WorkorderOperationEquipmentFeederDetailsController.createFeeder);

  router.route('/:id')
    .put(WorkorderOperationEquipmentFeederDetailsController.updateFeeder);

  router.route('/deleteFeederDetails')
    .post(WorkorderOperationEquipmentFeederDetailsController.deleteFeederDetails);
  router.route('/updateFeederMergedDetails')
    .post(WorkorderOperationEquipmentFeederDetailsController.updateFeederMergedDetails);
  router.route('/checkDuplicateFeeder')
    .post(WorkorderOperationEquipmentFeederDetailsController.checkDuplicateFeeder);

  app.use(
    '/api/v1/feeder',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};