const router = require('express').Router(); // eslint-disable-line
const WorkorderOperationEquipment = require('../controllers/Workorder_Operation_EquipmentController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/downloadEquipmentFeederTemplate/:fileType')
    .get(WorkorderOperationEquipment.downloadEquipmentFeederTemplate);

  router.route('/deleteWorkorderOperation_EquipmentList')
    .delete(WorkorderOperationEquipment.deleteWorkorderOperation_EquipmentList);

  router.route('/addEquipmentToWorkOrder')
    .post(WorkorderOperationEquipment.addEquipmentToWorkOrder);

  router.route('/retriveEquipmentListbyWoID/:woID')
    .get(WorkorderOperationEquipment.retriveEquipmentListbyWoID);

  router.route('/retriveEquipmentDetailsbyEqpID')
    .post(WorkorderOperationEquipment.retriveEquipmentDetailsbyEqpID);

  router.route('/updateWOEquipmentQty')
    .post(WorkorderOperationEquipment.updateWOEquipmentQty);

  router.route('/updateAllWOEquipmentQty')
    .post(WorkorderOperationEquipment.updateAllWOEquipmentQty);

  router.route('/getAssemblyPartListByAssyID')
    .post(WorkorderOperationEquipment.getAssemblyPartListByAssyID);

  router.route('/saveImportFeeder')
    .post(WorkorderOperationEquipment.saveImportFeeder);

  // router.route('/getAllEquipmentByWoID/:woID')
  // .get(WorkorderOperationEquipment.getAllEquipmentByWoID);

  app.use(
    '/api/v1/workorder_operation_equipment',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
