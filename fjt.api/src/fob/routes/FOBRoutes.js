const router = require('express').Router();

const FOBController = require('../controllers/FOBController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getFOBList')
        .post(FOBController.getFOBList);

    router.route('/getFobById/:id')
        .get(FOBController.getFobById);

    router.route('/saveFOB')
        .post(FOBController.saveFOB);

    router.route('/checkDuplicateFOB')
        .post(FOBController.checkDuplicateFOB);

    router.route('/deleteFOB')
        .post(FOBController.deleteFOB);

    router.route('/retrieveFOBList')
        .get(FOBController.retrieveFOBList);

    app.use('/api/v1/fob',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};