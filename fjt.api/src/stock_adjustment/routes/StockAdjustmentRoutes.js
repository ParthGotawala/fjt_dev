const router = require('express').Router(); // eslint-disable-line
const stockAdjustment = require('../controllers/StockAdjustmentController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(stockAdjustment.createStockAdjustment);

    router.route('/retrieveStockAdjustmentList')
        .post(stockAdjustment.retrieveStockAdjustmentList);

    router.route('/:id')
        .get(stockAdjustment.retrieveStockAdjustment)
        .put(stockAdjustment.updateStockAdjustment);

    router.route('/getWorkorderList')
        .post(stockAdjustment.getWorkorderList);

    router.route('/getAssemblyIDList')
        .post(stockAdjustment.getAssemblyIDList);

    router.route('/getAvailableQty')
        .post(stockAdjustment.getAvailableQty);

    router.route('/deleteStockAdjustment').post(stockAdjustment.deleteStockAdjustment);

    app.use(
        '/api/v1/stockAdjustment',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
