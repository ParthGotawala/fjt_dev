const router = require('express').Router(); // eslint-disable-line
const Department = require('../controllers/DepartmentController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/getAllDepartment')
        .get(Department.getAllDepartment);

    // place above '/' because of route conflict
    router.route('/getDepartmentWithEmployees')
        .get(Department.getDepartmentWithEmployees);

    router.route('/')
        .post(Department.createDepartment);

    router.route('/retriveDepartmentList')
        .post(Department.retriveDepartmentList);

    router.route('/:id')
        .get(Department.retriveDepartment)
        .put(Department.updateDepartment);

    router.route('/deleteDepartment')
        .post(Department.deleteDepartment);

    router.route('/checkDuplicateDepartmentName')
        .post(Department.checkDuplicateDepartmentName);
    router.route('/createLocationList')
        .post(Department.createLocationList);

    router.route('/getLocationAddedList')
        .post(Department.getLocationAddedList);

    router.route('/deleteLocation')
        .post(Department.deleteLocation);

    app.use(
        '/api/v1/department',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
