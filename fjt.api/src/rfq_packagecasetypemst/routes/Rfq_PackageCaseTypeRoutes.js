/* eslint-disable no-tabs */
const router = require('express').Router(); // eslint-disable-line
const RfqPackageCaseTypeController = require('../controllers/Rfq_PackageCaseTypeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
	router.route('/savePackageCaseType')
		.post(RfqPackageCaseTypeController.createPackageCaseType);

	router.route('/getPackageCaseTypeList')
		.get(RfqPackageCaseTypeController.getPackageCaseTypeList);

	router.route('/deletePackageCaseType')
		.post(RfqPackageCaseTypeController.deletePackageCaseType);

	router.route('/retrivePackageCaseTypeList')
		.post(RfqPackageCaseTypeController.retrivePackageCaseTypeList);

	router.route('/retrivePackageCaseType/:id')
		.get(RfqPackageCaseTypeController.retrivePackageCaseType);

	router.route('/checkDuplicatePackageCaseType')
		.post(RfqPackageCaseTypeController.checkDuplicatePackageCaseType);

	router.route('/checkUniquePackageCaseTypeAlias')
		.post(RfqPackageCaseTypeController.checkUniquePackageCaseTypeAlias);

	router.route('/getPackageCaseList')
		.get(RfqPackageCaseTypeController.getPackageCaseList);

	app.use('/api/v1/packagecase',
		validateToken,

		jwtErrorHandler,
		populateUser,
		router);
};
