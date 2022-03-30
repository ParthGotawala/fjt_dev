const router = require('express').Router(); // eslint-disable-line
const rackmst = require('../controllers/RackMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getRackList')
        .post(rackmst.getRack);

    router.route('/:id')
        .put(rackmst.updateRack);

    router.route('/createRack')
        .post(rackmst.createRack);

    router.route('/deleteRack')
        .post(rackmst.deleteRack);

    router.route('/checkNameAlreadyExist')
        .post(rackmst.checkNameAlreadyExist);

    router.route('/generateMultipleRack')
        .post(rackmst.generateMultipleRack);

    router.route('/generateRack')
        .post(rackmst.generateRack);

    app.use(
        '/api/v1/rack',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};