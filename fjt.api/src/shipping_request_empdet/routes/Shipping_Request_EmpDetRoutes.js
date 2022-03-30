const router = require('express').Router(); // eslint-disable-line
const ShippingRequestEmpDet = require('../controllers/Shipping_Request_EmpDetController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {

	router.route('/getShippingRequestEmpDet/:shippingRequestID')
		.get(ShippingRequestEmpDet.getShippingRequestEmpDet);

	router.route('/saveShippingRequestEmpDet')
		.post(ShippingRequestEmpDet.saveShippingRequestEmpDet);

	router.route('/deleteShippingRequestEmpDet/:id')
		.delete(ShippingRequestEmpDet.deleteShippingRequestEmpDet);

	router.route('/ackShippingRequestEmpDet')
		.post(ShippingRequestEmpDet.ackShippingRequestEmpDet);

	app.use(
		'/api/v1/shippingrequestempdet',
		validateToken,

		jwtErrorHandler,
		populateUser,
		router
	);
};