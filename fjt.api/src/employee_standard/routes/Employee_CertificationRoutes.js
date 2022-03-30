const router = require('express').Router(); // eslint-disable-line
const EmployeeCertificationController = require('../controllers/Employee_CertificationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getEmployeeAllCertificationList')
        .post(EmployeeCertificationController.getEmployeeAllCertificationList);

    router.route('/saveEmployeeCertification')
        .post(EmployeeCertificationController.saveEmployeeCertification);

    router.route('/getCertifiedStandardListOfEmployee')
        .post(EmployeeCertificationController.getCertifiedStandardListOfEmployee);

    router.route('/savePersonnelStandard')
        .post(EmployeeCertificationController.savePersonnelStandard);

    router.route('/removePersonnelStandard')
        .post(EmployeeCertificationController.removePersonnelStandard);

    router.route('/retrieveAssignedStandardEmployees')
        .post(EmployeeCertificationController.retrieveAssignedStandardEmployees);

    router.route('/checkEmpHasValidStandardsForDoc')
        .post(EmployeeCertificationController.checkEmpHasValidStandardsForDoc);

    router.route('/retrieveEmployeeListGeneric')
        .post(EmployeeCertificationController.retrieveEmployeeListGeneric);

    app.use(
        '/api/v1/employee_certification',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
