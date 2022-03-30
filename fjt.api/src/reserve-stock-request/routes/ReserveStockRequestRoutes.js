const router = require('express').Router();

const ReserveStockRequestController = require('../controllers/ReserveStockRequestController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getRequestList')
        .get(ReserveStockRequestController.getRequestList);

    router.route('/getRequestDet/:id')
        .get(ReserveStockRequestController.getRequestDet);

    router.route('/saveRequest')
        .post(ReserveStockRequestController.saveRequest);

    router.route('/deleteRequest')
        .post(ReserveStockRequestController.deleteRequest);

    app.use(
        '/api/v1/reserve_stock_request',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};