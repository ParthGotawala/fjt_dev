const router = require('express').Router(); // eslint-disable-line
const workorderTransEquipmentSubFormTransaction = require('../controllers/Workorder_Trans_Equipment_Subform_DataController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  app.use('/api/v1/workorderTransEquipmentSubFormDetail',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);

  router.route('/getworkorderTransEquipmentSubFormDetail')
    .post(workorderTransEquipmentSubFormTransaction.getworkorderTransEquipmentSubFormDetail);
};
