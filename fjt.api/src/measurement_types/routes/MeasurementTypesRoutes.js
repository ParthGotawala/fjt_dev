const router = require('express').Router();

const MeasurementTypesController = require('../controllers/MeasurementTypesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveMeasurementType')
        .post(MeasurementTypesController.createMeasurementType);

    router.route('/getMeasurementTypeList')
        .get(MeasurementTypesController.getMeasurementTypeList);

    router.route('/deleteMeasurementType')
        .post(MeasurementTypesController.deleteMeasurementType);

    router.route('/retriveMeasurementType/:id')
        .get(MeasurementTypesController.retriveMeasurementType);

    router.route('/retriveMeasurementTypeList')
        .post(MeasurementTypesController.retriveMeasurementTypeList);

    router.route('/retriveConversionList/:id?')
        .get(MeasurementTypesController.getConversionDetail);

    app.use('/api/v1/measurement_type',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
