const router = require('express').Router(); // eslint-disable-line
const ComponentPackagingTypeController = require('../controllers/Component_PackagingMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
  router.route('/savePackagingType')
    .post(ComponentPackagingTypeController.createPackagingType);


  router.route('/deletePackagingType')
    .post(ComponentPackagingTypeController.deletePackagingType);

  router.route('/getPackagingTypeList')
    .get(ComponentPackagingTypeController.getPackagingTypeList);

  router.route('/retrivePackagingTypeList')
    .post(ComponentPackagingTypeController.retrivePackagingTypeList);

  router.route('/retrivePackagingType/:id')
    .get(ComponentPackagingTypeController.retrivePackagingType);

  router.route('/checkDuplicatePackagingType')
    .post(ComponentPackagingTypeController.checkDuplicatePackagingType);

  router.route('/checkUniquePackagingTypeAlias')
    .post(ComponentPackagingTypeController.checkUniquePackagingTypeAlias);

  router.route('/updatePackagingDisplayOrder')
    .post(ComponentPackagingTypeController.updatePackagingDisplayOrder);

  app.use('/api/v1/componentpackaging',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
