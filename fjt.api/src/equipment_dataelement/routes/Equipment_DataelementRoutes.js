const router = require('express').Router();

const equipmentDataelement = require('../controllers/Equipment_DataelementController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
   router.route('/retrieveEquipmentEntityDataElements')
      .post(equipmentDataelement.retrieveEquipmentEntityDataElements);

   router.route('/createEquipment_DataElementList')
      .post(equipmentDataelement.createEquipment_DataElementList);

   router.route('/deleteEquipment_DataElementList')
      .post(equipmentDataelement.deleteEquipment_DataElementList);

   app.use(
      '/api/v1/equipment_dataelement',
      validateToken,

      jwtErrorHandler,
      populateUser,
      router
   );
};
