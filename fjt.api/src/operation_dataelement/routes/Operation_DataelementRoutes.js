const router = require('express').Router(); // eslint-disable-line
const OperationDataelement = require('../controllers/Operation_DataelementController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/')
    .get(OperationDataelement.retrieveOperationDataElements)
    .post(OperationDataelement.createOperationDataElement);

  router.route('/:id')
    .get(OperationDataelement.retrieveOperationDataElements)
    .put(OperationDataelement.updateOperationDataElement)
    .delete(OperationDataelement.deleteOperationDataElement);

  router.route('/retrieveOperationEntityDataElements')
    .post(OperationDataelement.retrieveOperationEntityDataElements);

  router.route('/createOperation_DataElementList')
    .post(OperationDataelement.createOperation_DataElementList);

  /* retrive files*/
  router.route('/retrieveOperationDataElementList/:opID')
    .get(OperationDataelement.retrieveOperationDataElementList);

  router.route('/deleteOperation_DataElementList')
    .post(OperationDataelement.deleteOperation_DataElementList);


  /* save,delete,update master template*/
  app.use(
    '/api/v1/operation_dataelement',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};
