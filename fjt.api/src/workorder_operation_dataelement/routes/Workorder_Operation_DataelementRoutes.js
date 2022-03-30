const router = require('express').Router(); // eslint-disable-line
const WorkorderOperationDataelement = require('../controllers/Workorder_Operation_DataelementController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/deleteWorkorderOperationDataElements')
    .post(WorkorderOperationDataelement.deleteWorkorderOperationDataElements);

  /* retrive files*/
  router.route('/retrieveWorkorderOperationDataElementList/:woOPID/:woID')
    .get(WorkorderOperationDataelement.retrieveWorkorderOperationDataElementList);

  app.use(
    '/api/v1/workorder_operation_dataelement',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};
