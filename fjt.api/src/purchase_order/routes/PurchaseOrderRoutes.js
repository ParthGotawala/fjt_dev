const router = require('express').Router(); // eslint-disable-line
const PurchaseOrder = require('../controllers/PurchaseOrderController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/getPurchaseOrderDetailByID/:id')
    .get(PurchaseOrder.getPurchaseOrderDetailByID);
  router.route('/getPurchaseOrderDetails')
    .get(PurchaseOrder.getPurchaseOrderDetails);
  router.route('/createPurchaseOrder')
    .post(PurchaseOrder.createPurchaseOrder);
  router.route('/updatePurchaseOrder')
    .post(PurchaseOrder.updatePurchaseOrder);
  router.route('/retrievePurchaseOrder/:id')
    .get(PurchaseOrder.retrievePurchaseOrder);
  router.route('/getPurchaseOrderMaterialPurchasePartRequirementDetail')
    .post(PurchaseOrder.getPurchaseOrderMaterialPurchasePartRequirementDetail);
  router.route('/getPurchaseOrderSummaryDetail')
    .post(PurchaseOrder.getPurchaseOrderSummaryDetail);
  router.route('/removePurchaseOrder')
    .post(PurchaseOrder.removePurchaseOrder);
  router.route('/getPurchaseOrderPerLineDetail')
    .post(PurchaseOrder.getPurchaseOrderPerLineDetail);
  router.route('/getComponentFilterList')
    .post(PurchaseOrder.getComponentFilterList);
  router.route('/getWorkOrderFilterList')
    .post(PurchaseOrder.getWorkOrderFilterList);
  router.route('/purchaseorderchangehistory')
    .post(PurchaseOrder.purchaseorderchangehistory);
  router.route('/updatePurchaseOrderLineLevelStatus')
    .post(PurchaseOrder.updatePurchaseOrderLineLevelStatus);
  router.route('/updatePurchaseOrderStatus')
    .post(PurchaseOrder.updatePurchaseOrderStatus);
  router.route('/savePurchaseOrderLineDetail')
    .post(PurchaseOrder.savePurchaseOrderLineDetail);
  router.route('/copyPurchaseOrderDetail')
    .post(PurchaseOrder.copyPurchaseOrderDetail);
  router.route('/getPurchaseOrderLineDetailByID/:id')
    .get(PurchaseOrder.getPurchaseOrderLineDetailByID);
  router.route('/getDuplicatePurchaseOrderPartRequirementList/:id')
    .get(PurchaseOrder.getDuplicatePurchaseOrderPartRequirementList);
  router.route('/updatePurchaseOrderReleaseLineLevelMergeDetail')
    .post(PurchaseOrder.updatePurchaseOrderReleaseLineLevelMergeDetail);
  router.route('/getPurchaseOrderRequirement/:id')
    .get(PurchaseOrder.getPurchaseOrderRequirement);
  router.route('/checkUniqueSOWithSupplier')
    .post(PurchaseOrder.checkUniqueSOWithSupplier);
  router.route('/getPurchaseOrderMstDetailByID/:id')
    .get(PurchaseOrder.getPurchaseOrderMstDetailByID);
  router.route('/checkPartStatusOfPurchaseOrder')
    .get(PurchaseOrder.checkPartStatusOfPurchaseOrder);
  router.route('/checkPOLineIsClosed')
    .post(PurchaseOrder.checkPOLineIsClosed);
  router.route('/getAllPackingSlipByPODetID')
    .post(PurchaseOrder.getAllPackingSlipByPODetID);
  router.route('/lockUnlockTransaction')
    .post(PurchaseOrder.lockUnlockTransaction);
  router.route('/checkPOWorkingStatus')
    .post(PurchaseOrder.checkPOWorkingStatus);
  router.route('/checkPOConsistLine')
    .post(PurchaseOrder.checkPOConsistLine);

  app.use(
    '/api/v1/purchaseOrder',
    validateToken,
    jwtErrorHandler,
    populateUser,
    router
  );
};
