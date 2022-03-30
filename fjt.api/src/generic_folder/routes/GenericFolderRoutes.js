const router = require('express').Router(); // eslint-disable-line
const GenericFolderController = require('../controllers/GenericFolderController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/createFolder')
        .post(GenericFolderController.createFolder);
    router.route('/getGenericFolder')
        .post(GenericFolderController.retriveFolderList);
    router.route('/retriveFolderListById')
        .post(GenericFolderController.retriveFolderListById);
    router.route('/renameFolder')
        .post(GenericFolderController.renameFolder);
    router.route('/removeFileFolder')
        .post(GenericFolderController.removeFileFolder);
    router.route('/getFolderList')
        .post(GenericFolderController.getFolderList);
    router.route('/moveFileFolder')
        .post(GenericFolderController.moveFileFolder);

    router.route('/moveAllDuplicateDocToDestinationBasedOnConfirmation')
        .post(GenericFolderController.moveAllDuplicateDocToDestinationBasedOnConfirmation);

    app.use(
        '/api/v1/generic_folder',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
