const router = require('express').Router();

const ScannerMstController = require('../controllers/ScannerMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {

    router.route('/retrieveScannerList')
        .post(ScannerMstController.retrieveScannerList);

    router.route('/getActiveScanner')
        .get(ScannerMstController.getActiveScanner);

    router.route('/createScanner')
        .post(ScannerMstController.createScanner);

    router.route('/updateScanner')
        .post(ScannerMstController.updateScanner);

    router.route('/:id')
        .put(ScannerMstController.updateScanner);

    router.route('/deleteScanner')
        .post(ScannerMstController.deleteScanner);

    router.route('/checkipAddressAlreadyExists')
        .post(ScannerMstController.checkipAddressAlreadyExists);

    app.use(
        '/api/v1/scanner',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};