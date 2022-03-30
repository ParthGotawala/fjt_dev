const router = require('express').Router();

const priceselectionsetting = require('../controllers/RFQ_Assy_Quantity_Price_SelectionController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
   router.route('/')
      .post(priceselectionsetting.retrievePriceSelectionSetting);

   router.route('/savePriceSelectionSetting')
      .post(priceselectionsetting.savePriceSelectionSetting);

   router.route('/CopyPriceSelectionSetting')
      .post(priceselectionsetting.CopyPriceSelectionSetting);

   router.route('/getPackaging')
      .get(priceselectionsetting.getPackaging);

   app.use(
      '/api/v1/priceselectionsetting',
      validateToken,

      jwtErrorHandler,
      populateUser,
      router
   );
};
