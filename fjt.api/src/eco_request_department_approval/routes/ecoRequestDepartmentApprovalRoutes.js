const router = require('express').Router(); // eslint-disable-line
const ECORequestDepartmentApprovalController = require('../controllers/ECORequestDepartmentApprovalController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {

	router.route('/ackECODepartmentApproval')
		.post(ECORequestDepartmentApprovalController.ackECODepartmentApproval);

	router.route('/')
		.post(ECORequestDepartmentApprovalController.saveECORequestDept);

	router.route('/:ecoReqID')
		.get(ECORequestDepartmentApprovalController.retriveECORequestDept);

	router.route('/:ecoDeptApprovalID')
		.delete(ECORequestDepartmentApprovalController.deleteECORequestDept);

	app.use(
		'/api/v1/ecorequestdeptapproval',
		validateToken,

		jwtErrorHandler,
		populateUser,
		router
	);

};
