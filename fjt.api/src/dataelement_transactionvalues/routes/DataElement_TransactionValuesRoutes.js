const router = require('express').Router(); // eslint-disable-line
const dataElementTransactionValues = require('../controllers/DataElement_TransactionValuesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/downloadElementTransactionDocument/:dataElementTransID')
    .get(dataElementTransactionValues.downloadDataElementDocument);

  router.route('/')
    .post(dataElementTransactionValues.createDataElement_TransactionValues);

  router.route('/:refTransID/:entityID')
    .get(dataElementTransactionValues.retriveDataElement_TransactionValues);

  router.route('/getRFQAssyDataElementTransactionValuesHistory/:refTransID/:refTransHistoryId/:entityID')
    .get(dataElementTransactionValues.getRFQAssyDataElementTransactionValuesHistory);

  app.use(
    '/api/v1/dataelement_transactionvalues',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );

  router.route('/:entityID')
    .get(dataElementTransactionValues.retriveDataElement_TransactionValuesEntityIDWise);
};
