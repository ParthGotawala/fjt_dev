const router = require('express').Router(); // eslint-disable-line
const WoSalesOrderDetailsController = require('../controllers/Workorder_SalesOrder_DetailsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getSalesOrderWoIDwise/:woID')
        .get(WoSalesOrderDetailsController.getSalesOrderWoIDwise);

    router.route('/deleteWoSalesOrderAssyRevisionWise/:woID')
        .put(WoSalesOrderDetailsController.deleteWoSalesOrderAssyRevisionWise);

    router.route('/updateWoSalesOrder/:woSalesOrderDetID')
        .put(WoSalesOrderDetailsController.updateWoSalesOrder);

    router.route('/saveWoSalesOrder')
        .post(WoSalesOrderDetailsController.saveWoSalesOrder);

    router.route('/:woSalesOrderDetID')
        .post(WoSalesOrderDetailsController.deleteWoSalesOrder);

    router.route('/checkKitReleaseBySalesOrderDetID/:woID/:salesOrderDetID')
        .get(WoSalesOrderDetailsController.checkKitReleaseBySalesOrderDetID);

    app.use(
        '/api/v1/workorder_salesorder_details',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};