const router = require('express').Router(); // eslint-disable-line
const ComponentPartStatusController = require('../controllers/Component_PartStatusController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
  router.route('/createPartStatus')
    .post(ComponentPartStatusController.createPartStatus);

  router.route('/retrivePartStatusList')
    .post(ComponentPartStatusController.retrivePartStatusList);

  router.route('/retrivePartStatus/:id')
    .get(ComponentPartStatusController.retrivePartStatus);

  router.route('/getPartStatusList')
    .get(ComponentPartStatusController.getPartStatusList);

  router.route('/deletePartStatus')
    .post(ComponentPartStatusController.deletePartStatus);

  router.route('/checkDuplicatePartStatus')
    .post(ComponentPartStatusController.checkDuplicatePartStatus);

  router.route('/checkUniquePartStatusAlias')
    .post(ComponentPartStatusController.checkUniquePartStatusAlias);

  router.route('/getStatusList')
    .get(ComponentPartStatusController.getStatusList);

  router.route('/updatePartStatusDisplayOrder')
    .post(ComponentPartStatusController.updatePartStatusDisplayOrder);

  app.use('/api/v1/componentpartstatus',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
