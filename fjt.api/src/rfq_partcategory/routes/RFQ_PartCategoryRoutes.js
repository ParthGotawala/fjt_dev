/* eslint-disable no-tabs */
const router = require('express').Router(); // eslint-disable-line
const RFQPartCategoryController = require('../controllers/RFQ_PartCategoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
	router.route('/getPartCategoryMstList')
		.get(RFQPartCategoryController.getPartCategoryMstList);
	router.route('/getEpicorTypeList')
		.get(RFQPartCategoryController.getEpicorTypeList);

	app.use('/api/v1/rfqpartcategory',
		validateToken,

		jwtErrorHandler,
		populateUser,
		router);
};
