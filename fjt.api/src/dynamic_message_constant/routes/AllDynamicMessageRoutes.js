const router = require('express').Router(); // eslint-disable-line
const DynamicMessageConstant = require('../controllers/DynamicMessageConstantController');
// const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
       app.get('/api/v1/alldynamicmessage/getAllModuleDynamicMessages',
              DynamicMessageConstant.getAllModuleDynamicMessages);

       app.get('/api/v1/alldynamicmessage/getAllCategoryDynamicMessages',
              DynamicMessageConstant.getAllCategoryDynamicMessages);

       app.get('/api/v1/alldynamicmessage/checkDBStatus',
              DynamicMessageConstant.checkDBStatus);

       app.use(
              '/api/v1/alldynamicmessage',
              validateToken,

              jwtErrorHandler,
              // populateUser,
              router
       );
};

