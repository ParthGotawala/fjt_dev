const router = require('express').Router(); // eslint-disable-line
const WorkorderOperationPart = require('../controllers/Workorder_Operation_PartController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/addPartToWorkOrder')
    .post(WorkorderOperationPart.addPartToWorkOrder);

  router.route('/retrivePartListbyWoID')
    .post(WorkorderOperationPart.retrivePartListbyWoID);

  router.route('/retrivePartDetailsbyPartID')
    .post(WorkorderOperationPart.retrivePartDetailsbyPartID);

  router.route('/deleteWorkorderOperation_PartList')
    .delete(WorkorderOperationPart.deleteWorkorderOperation_PartList);

  router.route('/saveSMTQPADetails')
    .post(WorkorderOperationPart.saveSMTQPADetails);

  router.route('/getNotAddedSMTPartListInWO')
    .post(WorkorderOperationPart.getNotAddedSMTPartListInWO);

  app.use(
    '/api/v1/workorder_operation_part',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );

  /*   app.delete('/api/v1/deleteWorkorderOperation_PartList',
           validateToken,
 
           jwtErrorHandler,
           populateUser,
           WorkorderOperationPart.deleteWorkorderOperation_PartList);
 */
};
