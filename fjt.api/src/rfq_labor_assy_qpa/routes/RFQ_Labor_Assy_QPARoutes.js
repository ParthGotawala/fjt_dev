const router = require('express').Router(); // eslint-disable-line
const RFQLaborAssyQPAController = require('../controllers/RFQ_Labor_Assy_QPAController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
   router.route('/getLaborAssyQty/:pPartID/:prfqAssyID')
      .get(RFQLaborAssyQPAController.getLaborAssyQty);

   router.route('/getLaborMountingTypeDetails/:pPartID/:prfqAssyID')
      .get(RFQLaborAssyQPAController.getLaborMountingTypeDetails);

   router.route('/saveLaborDetail')
      .post(RFQLaborAssyQPAController.saveLaborDetail);

   router.route('/exportLaborTemplate')
      .post(RFQLaborAssyQPAController.exportLaborTemplate);

   app.use(
      '/api/v1/laborassyqpa',
      validateToken,

      jwtErrorHandler,
      populateUser,
      router
   );
};
