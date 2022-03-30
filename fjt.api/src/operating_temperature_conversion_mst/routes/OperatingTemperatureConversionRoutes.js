const router = require('express').Router();

const OperatingTemperatureConversion = require('../controllers/OperatingTemperatureConversionController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(OperatingTemperatureConversion.createOperatingTemperatureConversion);

    router.route('/:id')
        .get(OperatingTemperatureConversion.retrieveOperatingTemperatureConversionById)
        .put(OperatingTemperatureConversion.updateOperatingTemperatureConversion);

    router.route('/retrieveOperatingTemperatureConversionList')
        .post(OperatingTemperatureConversion.retrieveOperatingTemperatureConversionList);

    router.route('/deleteOperatingTemperatureConversion')
        .post(OperatingTemperatureConversion.deleteOperatingTemperatureConversion);

    app.use(
        '/api/v1/operatingtemperatureconversion',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};