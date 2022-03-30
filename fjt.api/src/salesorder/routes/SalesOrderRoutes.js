const router = require('express').Router(); // eslint-disable-line
const salesorder = require('../controllers/SalesOrderController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/getDataKey')
        .get(salesorder.getDataKey);

    router.route('/getUnitList')
        .get(salesorder.getUnitList);

    router.route('/getAllSalesOrderList')
        .get(salesorder.getAllSalesOrderList);

    router.route('/getSalesOrderDetails')
        .post(salesorder.getSalesOrderDetails);

    router.route('/getAllWorkOrderOperationList/:id')
        .get(salesorder.getAllWorkOrderOperationList);

    router.route('/checkPartStatusOfSalesOrder/:id')
        .get(salesorder.checkPartStatusOfSalesOrder);

    router.route('/getDuplicateSalesOrderCommentsList/:id')
        .get(salesorder.getDuplicateSalesOrderCommentsList);

    router.route('/retriveSalesOrderByID/:id')
        .get(salesorder.retriveSalesOrderByID);

    router.route('/salesorderchangehistory')
        .post(salesorder.salesorderchangehistory);

    router.route('/getRfqQtyandTurnTimeDetail/:partID/:rfqQuoteGroupID')
        .get(salesorder.getRfqQtyandTurnTimeDetail);

    router.route('/getQtyandTurnTimeDetailByAssyId')
        .post(salesorder.getQtyandTurnTimeDetailByAssyId);

    router.route('/getSalesCommissionDetails')
        .post(salesorder.getSalesCommissionDetails);

    router.route('/getQuoteGroupDetailsfromPartID/:partID')
        .get(salesorder.getQuoteGroupDetailsfromPartID);
    router.route('/getCopySalesOrderAssyMismatch/:id')
        .get(salesorder.getCopySalesOrderAssyMismatch);

    router.route('/retrieveSalesOrderOtherExpenseDetails')
        .get(salesorder.retrieveSalesOrderOtherExpenseDetails);

    router.route('/getOtherPartTypeComponentDetails')
        .get(salesorder.getOtherPartTypeComponentDetails);

    router.route('/')
        .post(salesorder.createSalesOrder);

    router.route('/retrieveSalesOrderList')
        .post(salesorder.retrieveSalesOrderList);

    router.route('/retrieveSalesOrderDetail/:id')
        .get(salesorder.retrieveSalesOrderDetail);

    router.route('/getShippingList')
        .post(salesorder.getShippingList);

    router.route('/:id')
        .get(salesorder.retrieveSalesOrder)
        .put(salesorder.updateSalesOrder);

    router.route('/deleteSalesOrder')
        .post(salesorder.deleteSalesOrder);

    router.route('/salsorderCancleReason')
        .post(salesorder.salsorderCancleReason);

    router.route('/getSalesOrderList')
        .post(salesorder.getSalesOrderList);

    router.route('/getActiveSalesOrderDetailsList')
        .post(salesorder.getActiveSalesOrderDetailsList);

    router.route('/getSubAsemblyDetailList')
        .post(salesorder.getSubAsemblyDetailList);

    router.route('/getValidShippedQty')
        .post(salesorder.getValidShippedQty);

    router.route('/getCustomerSalesOrderDetail')
        .post(salesorder.getCustomerSalesOrderDetail);

    router.route('/getSalesOrderStatus/:id')
        .get(salesorder.getSalesOrderStatus);

    router.route('/retrieveSalesOrderDetailStatus')
        .post(salesorder.retrieveSalesOrderDetailStatus);

    router.route('/getSalesOrderHeaderWorkingStatus')
        .post(salesorder.getSalesOrderHeaderWorkingStatus);

    router.route('/getSOAssemblyPIDList')
        .post(salesorder.getSOAssemblyPIDList);

    router.route('/getSalesOrderMstNumber')
        .post(salesorder.getSalesOrderMstNumber);

    router.route('/getCustomerwiseSOPOList')
        .post(salesorder.getCustomerwiseSOPOList);

    router.route('/getCustomerSOwisePOAssyList')
        .post(salesorder.getCustomerSOwisePOAssyList);

    router.route('/getCustomerPOwiseWOAssyList')
        .post(salesorder.getCustomerPOwiseWOAssyList);

    router.route('/getCustomerPOAssywiseWoDetails')
        .post(salesorder.getCustomerPOAssywiseWoDetails);

    router.route('/savePlannPurchaseDetail')
        .post(salesorder.savePlannPurchaseDetail);

    router.route('/getKitReleasedQty/:PSalesOrderDetID')
        .get(salesorder.getKitReleasedQty);

    router.route('/getKitPlannedDetailOfSaleOrderAssy')
        .post(salesorder.getKitPlannedDetailOfSaleOrderAssy);

    router.route('/removePlanReleaseDeatil')
        .post(salesorder.removePlanReleaseDeatil);

    router.route('/getSalesOrderDetailById')
        .post(salesorder.getSalesOrderDetailById);

    router.route('/updateKitMrpQty')
        .post(salesorder.updateKitMrpQty);

    router.route('/getKitReleaseListBySalesOrderId')
        .post(salesorder.getKitReleaseListBySalesOrderId);

    router.route('/holdResumeTrans')
        .post(salesorder.holdResumeTrans);

    router.route('/saveSalesCommissionDetails')
        .post(salesorder.saveSalesCommissionDetails);

    router.route('/updateSalesOrderDetailStatusManual')
        .post(salesorder.updateSalesOrderDetailStatusManual);

    router.route('/salesOrderDetailSkipKitValidation')
        .post(salesorder.salesOrderDetailSkipKitValidation);

    router.route('/checkRFQQuoteNumberUnique')
        .post(salesorder.checkRFQQuoteNumberUnique);

    router.route('/checkUniquePOWithCustomer')
        .post(salesorder.checkUniquePOWithCustomer);
    router.route('/getSalesOrderReleaseLineDetail/:soDetID')
        .get(salesorder.getSalesOrderReleaseLineDetail);

    router.route('/removeSalesOrderDetail')
        .post(salesorder.removeSalesOrderDetail);

    router.route('/createUpdateSalesOrderDetails')
        .post(salesorder.createUpdateSalesOrderDetails);
    router.route('/saveSalesOrderLineDetail')
        .post(salesorder.saveSalesOrderLineDetail);

    router.route('/saveSalesOrderOtherCharges')
        .post(salesorder.saveSalesOrderOtherCharges);

    router.route('/removeSalesOrderReleaseLineDetail')
        .post(salesorder.removeSalesOrderReleaseLineDetail);
    router.route('/getsalesOrderHoldUnhold')
        .post(salesorder.getsalesOrderHoldUnhold);
    router.route('/getSalesCommissionDetailToExport')
        .post(salesorder.getSalesCommissionDetailToExport);

    router.route('/getSOPromisedShipDateFromDockDate')
        .post(salesorder.getSOPromisedShipDateFromDockDate);

    router.route('/getQuoteStatusForSalesCommission')
        .post(salesorder.getQuoteStatusForSalesCommission);
    router.route('/retrieveSalesOrderSummaryList')
        .post(salesorder.retrieveSalesOrderSummaryList);
    router.route('/getBlanketPOAssyList')
        .post(salesorder.getBlanketPOAssyList);

    router.route('/getBlanketPOUsedQtyForAssy')
        .post(salesorder.getBlanketPOUsedQtyForAssy);

    router.route('/getSalesOrderDetailByPartId')
        .post(salesorder.getSalesOrderDetailByPartId);

    router.route('/copySalesOrderDetail')
        .post(salesorder.copySalesOrderDetail);
    router.route('/getSalesOrderPackingSlipNumber')
        .post(salesorder.getSalesOrderPackingSlipNumber);

    router.route('/getSalesOrderShipmentSummary')
        .post(salesorder.getSalesOrderShipmentSummary);

    router.route('/updateSalesOrderFromShipmentSummary')
        .post(salesorder.updateSalesOrderFromShipmentSummary);

    router.route('/getSalesOrderBPOValidationDetail')
        .post(salesorder.getSalesOrderBPOValidationDetail);

    router.route('/unlinkFuturePOFromBlanketPO')
        .post(salesorder.unlinkFuturePOFromBlanketPO);

    router.route('/getSalesOrderFPONotLinkedList')
        .post(salesorder.getSalesOrderFPONotLinkedList);

    router.route('/linkFuturePOToBlanketPO')
        .post(salesorder.linkFuturePOToBlanketPO);

    router.route('/getLinkedFuturePODetails')
        .post(salesorder.getLinkedFuturePODetails);

    app.use(
        '/api/v1/salesorder',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};
