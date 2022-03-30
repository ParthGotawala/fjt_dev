const router = require('express').Router();
const inovaxeRouter = require('express').Router();

const WarehouseMstController = require('../controllers/WarehouseMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(WarehouseMstController.createWarehouse);

    router.route('/retriveWarehouseList')
        .post(WarehouseMstController.retriveWarehouseList);

    router.route('/saveWarehouse')
        .post(WarehouseMstController.createWarehouse);

    router.route('/retriveWarehouse/:id')
        .get(WarehouseMstController.retriveWarehouse);

    router.route('/deleteWarehouse')
        .post(WarehouseMstController.deleteWarehouse);

    router.route('/getHistory')
        .post(WarehouseMstController.getHistory);

    router.route('/checkNameUnique')
        .post(WarehouseMstController.checkNameUnique);

    router.route('/generateWarehouse')
        .post(WarehouseMstController.generateWarehouse);

    router.route('/checkCartIdUnique/:id/:cartId')
        .get(WarehouseMstController.checkCartIdUnique);

    router.route('/getSidewiseBinSlotDetails/:warehouseID/:side')
        .get(WarehouseMstController.getSidewiseBinSlotDetails);

    router.route('/getUMIDListFromCartID/:pwareHouseID')
        .get(WarehouseMstController.getUMIDListFromCartID);

    router.route('/checkActiveBin/:id')
        .get(WarehouseMstController.checkActiveBin);

    router.route('/checkCartWiseUniqueDomain')
        .post(WarehouseMstController.checkCartWiseUniqueDomain);

    router.route('/getWarehouseDetailByName')
        .post(WarehouseMstController.getWarehouseDetailByName);

    router.route('/sendRequestToCheckCartStatus')
        .post(WarehouseMstController.sendRequestToCheckCartStatus);

    router.route('/sendRequestToCheckStatusOfAllCarts')
        .post(WarehouseMstController.sendRequestToCheckStatusOfAllCarts);

    router.route('/sendRequestToCheckInCart')
        .post(WarehouseMstController.sendRequestToCheckInCart);

    router.route('/sendRequestToSearchPartByUMID')
        .post(WarehouseMstController.sendRequestToSearchPartByUMID);

    router.route('/sendRequestToClearUnauthorizeRequest')
        .post(WarehouseMstController.sendRequestToClearUnauthorizeRequest);

    router.route('/sendRequestToSearchPartByCartID')
        .post(WarehouseMstController.sendRequestToSearchPartByCartID);

    router.route('/sendRequestToCancelCartRequest')
        .post(WarehouseMstController.sendRequestToCancelCartRequest);

    router.route('/sendRequestToCheckOutCart')
        .post(WarehouseMstController.sendRequestToCheckOutCart);

    router.route('/downloadWarehouseTemplate/:module')
        .get(WarehouseMstController.downloadWarehouseTemplate);

    router.route('/uploadWarehouseDocuments')
        .post(WarehouseMstController.uploadWarehouseDocuments);

    router.route('/retriveInovaxeTransactionLogList')
        .post(WarehouseMstController.retriveInovaxeTransactionLogList);

    router.route('/retriveInovaxeTransactionServerLog')
        .get(WarehouseMstController.retriveInovaxeTransactionServerLog);

    router.route('/retriveInovaxeUnAuthorizeTransactionLogList')
        .post(WarehouseMstController.retriveInovaxeUnAuthorizeTransactionLogList);

    router.route('/removeUnauthorizeRequest')
        .post(WarehouseMstController.removeUnauthorizeRequest);

    router.route('/setPickUserDeatil')
        .post(WarehouseMstController.setPickUserDeatil);

    router.route('/setDropUserDeatil')
        .post(WarehouseMstController.setDropUserDeatil);

    app.use(
        '/api/v1/warehouse',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );

    app.use(
        '/api/v1/inovaxeAPI',
        inovaxeRouter
    );

    inovaxeRouter.route('/SendRequestToupdateCartStatus')
        .post(WarehouseMstController.SendRequestToupdateCartStatus);
    inovaxeRouter.route('/sendCheckInRequestToInovex')
        .post(WarehouseMstController.sendCheckInRequestToInovex);
    inovaxeRouter.route('/removePickUserDeatil')
        .post(WarehouseMstController.removePickUserDeatil);
};