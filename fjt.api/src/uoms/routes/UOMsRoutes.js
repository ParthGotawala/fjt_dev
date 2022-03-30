const router = require('express').Router();

const UOMsController = require('../controllers/UOMsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveUnitOfMeasurement')
        .post(UOMsController.createUnitOfMeasurement);

    router.route('/retriveUnitOfMeasurement/:id')
        .get(UOMsController.retriveUnitOfMeasurement);

    router.route('/retriveUnitOfMeasurementList')
        .post(UOMsController.retriveUnitOfMeasurementList);

    router.route('/getUnitOfMeasurementList')
        .get(UOMsController.getUnitOfMeasurementList);

    router.route('/getUnitOfMeasurementList/:id?/:measurementTypeID?')
        .get(UOMsController.getUnitOfMeasurementList);

    router.route('/getUOMListByMeasurementID/:measurementTypeID')
        .get(UOMsController.getUOMListByMeasurementID);

    router.route('/removeUnitOfMeasurement')
        .post(UOMsController.removeUnitOfMeasurement);

    router.route('/getUOMsList')
        .get(UOMsController.getUOMsList);

    router.route('/getUOMsList/:measurementTypeID?/:id?')
        .get(UOMsController.getUOMsList);

    router.route('/checkDuplicateUOM')
        .post(UOMsController.checkDuplicateUOM);

    router.route('/checkUniqueUOMAlias')
        .post(UOMsController.checkUniqueUOMAlias);

    app.use('/api/v1/uoms',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
