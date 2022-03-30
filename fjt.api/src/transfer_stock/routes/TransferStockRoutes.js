const router = require('express').Router();

const TransferStockController = require('../controllers/TransferStockController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getActiveWarehouse')
        .post(TransferStockController.getActiveWarehouse);

    router.route('/getActiveBin')
        .post(TransferStockController.getActiveBin);

    router.route('/getUIDDetail')
        .post(TransferStockController.getUIDDetail);

    router.route('/managestock')
        .post(TransferStockController.managestock);

    router.route('/history')
        .post(TransferStockController.history);

    router.route('/getKitToTransferStock')
        .post(TransferStockController.getKitToTransferStock);

    router.route('/getKitWarehouseDetail')
        .get(TransferStockController.getKitWarehouseDetail);

    router.route('/tranferEmptyBinToWH')
        .post(TransferStockController.tranferEmptyBinToWH);

    router.route('/RequestToAssignDepartment')
        .post(TransferStockController.RequestToAssignDepartment);

    router.route('/getUMIDWorkOrderHistory')
        .post(TransferStockController.getUMIDWorkOrderHistory);

    router.route('/getUMIDKitAllocationHistory')
        .post(TransferStockController.getUMIDKitAllocationHistory);

    router.route('/getMismatchItemForKit')
        .post(TransferStockController.getMismatchItemForKit);

    app.use(
        '/api/v1/transfer_stock',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};