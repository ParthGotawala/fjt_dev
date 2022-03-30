const router = require('express').Router(); // eslint-disable-line
const EnterpriseSearchController = require('../controllers/Enterprise_SearchController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {  
  router.route('/manageRFQDetailInElastic')
    .get(EnterpriseSearchController.manageRFQDetailInElastic);

  router.route('/managePartDetailInElastic')
    .get(EnterpriseSearchController.managePartDetailInElastic);

  router.route('/manageSalesOrderDetailInElastic')
    .get(EnterpriseSearchController.manageSalesOrderDetailInElastic);

  router.route('/managePackingSlipInElastic')
    .get(EnterpriseSearchController.managePackingSlipInElastic);

  router.route('/manageWorkOrderDetailInElastic')
    .get(EnterpriseSearchController.manageWorkOrderDetailInElastic);

  router.route('/manageUMIDDetailInElastic')
    .get(EnterpriseSearchController.manageUMIDDetailInElastic);

  router.route('/manageMFGCodeDetailInElastic')
    .get(EnterpriseSearchController.manageMFGCodeDetailInElastic);

  router.route('/managePersonalDetailInElastic')
    .get(EnterpriseSearchController.managePersonalDetailInElastic);

  router.route('/manageOperationDetailInElastic')
    .get(EnterpriseSearchController.manageOperationDetailInElastic);

  router.route('/manageWorkOrderOperationDetailInElastic')
    .get(EnterpriseSearchController.manageWorkOrderOperationDetailInElastic);

  router.route('/manageEquipmentWorkStationDetailInElastic')
    .get(EnterpriseSearchController.manageEquipmentWorkStationDetailInElastic);

  router.route('/updateEntityDisplayOrder')
    .post(EnterpriseSearchController.updateEntityDisplayOrder);
  router.route('/addTransaction')
    .post(EnterpriseSearchController.addTransaction);
  router.route('/getModuleCount')
    .post(EnterpriseSearchController.getModuleCount);
  router.route('/retriveEntityList')
    .post(EnterpriseSearchController.retriveEntityList);

  app.use(
    '/api/v1/enterprise_search',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};
