const router = require('express').Router(); // eslint-disable-line
const TransactionModesController = require('../controllers/transactionModesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/retrieveTransactionModesList')
    .post(TransactionModesController.retrieveTransactionModesList);

  router.route('/checkTransactionModeUnique')
    .post(TransactionModesController.checkTransactionModeUnique);

  router.route('/getTransactionModeByID/:id')
    .get(TransactionModesController.getTransactionModeByID);

  // router.route('/getTransactionModesListByModeType')
  //   .post(TransactionModesController.getTransactionModesListByModeType);

  router.route('/getTransModeList')
    .post(TransactionModesController.getTransModeList);

  router.route('/saveTransactionMode')
    .post(TransactionModesController.saveTransactionMode);

  router.route('/deleteTransactionModes')
    .post(TransactionModesController.deleteTransactionModes);

  app.use('/api/v1/transactionModes',
    validateToken,
    jwtErrorHandler,
    populateUser,
    router);
};
