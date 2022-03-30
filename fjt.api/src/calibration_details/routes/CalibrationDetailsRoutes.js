const router = require('express').Router();

const calibrationdetails = require('../controllers/CalibrationDetailsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(calibrationdetails.createCalibrationDetails);

    router.route('/:id')
        .get(calibrationdetails.retrieveCalibrationDetailsById)
        .put(calibrationdetails.updateCalibrationDetails);

    router.route('/retrieveCalibrationDetailsList')
        .post(calibrationdetails.retrieveCalibrationDetailsList);

    router.route('/deleteCalibrationDetails')
        .post(calibrationdetails.deleteCalibrationDetails);

    app.use(
        '/api/v1/calibrationdetails',

        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};