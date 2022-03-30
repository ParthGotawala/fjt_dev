const router = require('express').Router(); // eslint-disable-line
const ShippingRequest = require('../controllers/ShippingRequestController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getShippingRequest/:id')
        .get(ShippingRequest.getShippingRequest);

    router.route('/getShippingRequest')
        .get(ShippingRequest.getShippingRequest);

    router.route('/saveRequestForShip')
        .post(ShippingRequest.saveRequestForShip);

    router.route('/getReadyForShipQtyByWOID/:woID')
        .get(ShippingRequest.getReadyForShipQtyByWOID);

    router.route('/deleteRequestForShip')
        .post(ShippingRequest.deleteRequestForShip);

    router.route('/getShippingRequestStatus')
        .get(ShippingRequest.getShippingRequestStatus);

    router.route('/getShippingQtyAndAssyDetailByWOID')
        .get(ShippingRequest.getShippingQtyAndAssyDetailByWOID);

    router.route('/getShippingRequestByDet')
        .get(ShippingRequest.getShippingRequestByDet);

    router.route('/getShippingRequestDet')
        .get(ShippingRequest.getShippingRequestDet);

    router.route('/getGetShippingReqList')
        .get(ShippingRequest.getGetShippingReqList);


    app.use(
        '/api/v1/shippingrequest',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};