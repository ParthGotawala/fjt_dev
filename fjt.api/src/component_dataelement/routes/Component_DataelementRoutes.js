const router = require('express').Router();

const ComponentDataelement = require('../controllers/Component_DataelementController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
   router.route('/retrieveComponentEntityDataElements')
      .post(ComponentDataelement.retrieveComponentEntityDataElements);

   router.route('/createComponent_DataElementList')
      .post(ComponentDataelement.createComponent_DataElementList);

   router.route('/deleteComponent_DataElementList')
      .post(ComponentDataelement.deleteComponent_DataElementList);

   app.use(
      '/api/v1/component_dataelement',
      validateToken,

      jwtErrorHandler,
      populateUser,
      router
   );
};
