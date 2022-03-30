/* eslint-disable no-tabs */
const router = require('express').Router(); // eslint-disable-line
const RFQPartTypeController = require('../controllers/RFQ_PartTypeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/savePartType')
    .post(RFQPartTypeController.createPartType);

  router.route('/getPartTypeList')
    .get(RFQPartTypeController.getPartTypeList);

  router.route('/deletePartType')
    .post(RFQPartTypeController.deletePartType);

  router.route('/getFunctionalTypeList')
    .get(RFQPartTypeController.getFunctionalTypeList);

  router.route('/retrivePartTypeList')
    .post(RFQPartTypeController.retrivePartTypeList);

  router.route('/retrivePartType/:id')
    .get(RFQPartTypeController.retrivePartType);

  router.route('/checkDuplicatePartType')
    .post(RFQPartTypeController.checkDuplicatePartType);

  router.route('/checkUniquePartTypeAlias')
    .post(RFQPartTypeController.checkUniquePartTypeAlias);

  app.use('/api/v1/rfqparttype',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
