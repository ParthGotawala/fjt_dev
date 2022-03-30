const router = require('express').Router(); // eslint-disable-line
const GenericRecycleBinController = require('../controllers/GenericRecycleBinController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getRecycleBinListByRefTransID')
        .post(GenericRecycleBinController.getRecycleBinListByRefTransID);
    router.route('/deleteGenericRecycleBinDetails')
        .post(GenericRecycleBinController.deleteGenericRecycleBinDetails);
    router.route('/restoreGenericRecycleBin')
        .post(GenericRecycleBinController.restoreGenericRecycleBin);
    router.route('/getGoToRootFolderID')
        .post(GenericRecycleBinController.getGoToRootFolderID);
    app.use(
        '/api/v1/generic_recycle_bin',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};
