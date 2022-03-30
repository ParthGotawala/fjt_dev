const router = require('express').Router(); // eslint-disable-line
const OperationEquipment = require('../controllers/Operation_EquipmentController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/deleteOperation_EquipmentList')
    .delete(OperationEquipment.deleteOperation_EquipmentList);

  /* retrive equipments with operation*/
  router.route('/retrieveEquipmentOperationDetails/:id')
    .get(OperationEquipment.retrieveEquipmentOperationDetails);

  router.route('/createOperation_EquipmentList')
    .post(OperationEquipment.createOperation_EquipmentList);

  /* save,delete,update master template*/
  app.use(
    '/api/v1/Operation_Equipment',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );

  /* app.delete('/api/v1/deleteOperation_EquipmentList',
    validateToken,
 
    jwtErrorHandler,
    populateUser,
    Operation_Equipment.deleteOperation_EquipmentList); */
};
