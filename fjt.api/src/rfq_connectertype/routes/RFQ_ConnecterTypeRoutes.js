const router = require('express').Router(); // eslint-disable-line
const RFQConnecterTypeController = require('../controllers/RFQ_ConnecterTypeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/saveConnecterType')
    .post(RFQConnecterTypeController.createConnecterType);

  router.route('/getConnecterTypeList')
    .get(RFQConnecterTypeController.getConnecterTypeList);

  router.route('/getCommonTypeList')
    .post(RFQConnecterTypeController.getCommonTypeList);

  router.route('/deleteConnecterType')
    .post(RFQConnecterTypeController.deleteConnecterType);

  router.route('/retriveConnecterTypeList')
    .post(RFQConnecterTypeController.retriveConnecterTypeList);

  router.route('/retriveConnecterType/:id')
    .get(RFQConnecterTypeController.retriveConnecterType);

  router.route('/checkUniqueConnectorTypeAlias')
    .post(RFQConnecterTypeController.checkUniqueConnectorTypeAlias);

  router.route('/checkDuplicateConnectorType')
    .post(RFQConnecterTypeController.checkDuplicateConnectorType);

  router.route('/getConnectorTypeList')
    .get(RFQConnecterTypeController.getConnectorTypeList);

  app.use('/api/v1/rfqconnector',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
