const router = require('express').Router(); // eslint-disable-line
const ShippingRequestDet = require('../controllers/Shipping_RequestDetController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveShippingRequestDet')
        .post(ShippingRequestDet.saveShippingRequestDet);

    router.route('/deleteRequestForShip/:id')
        .delete(ShippingRequestDet.deleteRequestForShip);


    app.use(
        '/api/v1/shippingrequestdet',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};