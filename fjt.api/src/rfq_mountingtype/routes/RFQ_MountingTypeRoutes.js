/* eslint-disable no-tabs */
const router = require('express').Router(); // eslint-disable-line
const RFQMountingTypeController = require('../controllers/Rfq_MountingTypeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
	router.route('/saveMountingType')
		.post(RFQMountingTypeController.createMountingType);

	router.route('/getMountingTypeList')
		.get(RFQMountingTypeController.getMountingTypeList);

	router.route('/deleteMountingType')
		.post(RFQMountingTypeController.deleteMountingType);

	router.route('/retriveMountingTypeList')
		.post(RFQMountingTypeController.retriveMountingTypeList);

	router.route('/retriveMountingType/:id')
		.get(RFQMountingTypeController.retriveMountingType);

	router.route('/checkDuplicateMountingType')
		.post(RFQMountingTypeController.checkDuplicateMountingType);

	router.route('/checkUniqueMountingTypeAlias')
		.post(RFQMountingTypeController.checkUniqueMountingTypeAlias);

	router.route('/getMountingList')
		.get(RFQMountingTypeController.getMountingList);

	router.route('/updateMountingTypeDisplayOrder')
		.post(RFQMountingTypeController.updateMountingTypeDisplayOrder);

	app.use('/api/v1/rfqmounting',
		validateToken,

		jwtErrorHandler,
		populateUser,
		router);
};
