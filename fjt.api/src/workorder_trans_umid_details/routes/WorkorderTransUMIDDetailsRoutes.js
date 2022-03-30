const router = require('express').Router(); // eslint-disable-line
const change_feeder_router = require('express').Router(); // eslint-disable-line
const verification_feeder_router = require('express').Router(); // eslint-disable-line
// eslint-disable-line
const WorkorderTransUMIDDetailsController = require('../controllers/WorkorderTransUMIDDetailsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/')
    .get(WorkorderTransUMIDDetailsController.retriveFeederTransaction)
    .post(WorkorderTransUMIDDetailsController.createFeederTransaction);

  router.route('/:id')
    .put(WorkorderTransUMIDDetailsController.updateFeederTransaction);

  router.route('/deleteFeederTransaction')
    .post(WorkorderTransUMIDDetailsController.deleteFeederTransaction);

  router.route('/validateScanFeederFirst')
    .post(WorkorderTransUMIDDetailsController.validateScanFeederFirst);

  router.route('/validateScanUMIDFirst')
    .post(WorkorderTransUMIDDetailsController.validateScanUMIDFirst);

  router.route('/validateScanChangeReel')
    .post(WorkorderTransUMIDDetailsController.validateScanChangeReel);

  router.route('/validateScanUMIDOnly')
    .post(WorkorderTransUMIDDetailsController.validateScanUMIDOnly);

  router.route('/validateScanMissingUMIDOnly')
    .post(WorkorderTransUMIDDetailsController.validateScanMissingUMIDOnly);

  router.route('/deleteWorkorderTransUMIDDetails')
    .post(WorkorderTransUMIDDetailsController.deleteWorkorderTransUMIDDetails);

  router.route('/validateScanFeederForSearch')
    .post(WorkorderTransUMIDDetailsController.validateScanFeederForSearch);
  router.route('/getFeederDeatilFromUMID/:pUMID')
    .get(WorkorderTransUMIDDetailsController.getFeederDeatilFromUMID);

  router.route('/checkWOKitReutrn')
    .post(WorkorderTransUMIDDetailsController.checkWOKitReutrn);

  router.route('/getUMIDFeederStatus')
    .post(WorkorderTransUMIDDetailsController.getUMIDFeederStatus);

  router.route('/getPendingVerificationUMIDCount')
    .post(WorkorderTransUMIDDetailsController.getPendingVerificationUMIDCount);

  router.route('/getUMIDActiveFeederList')
    .post(WorkorderTransUMIDDetailsController.getUMIDActiveFeederList);

  app.use(
    '/api/v1/umid_transaction',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );

  change_feeder_router.route('/')
    .get(WorkorderTransUMIDDetailsController.retriveFeederChangeTransaction);

  app.use(
    '/api/v1/feeder_change_transaction',
    validateToken,

    jwtErrorHandler,
    populateUser,
    change_feeder_router
  );

  verification_feeder_router.route('/')
    .get(WorkorderTransUMIDDetailsController.retriveFeederVerificationTransaction);

  app.use(
    '/api/v1/feeder_verification_transaction',
    validateToken,

    jwtErrorHandler,
    populateUser,
    verification_feeder_router
  );
};