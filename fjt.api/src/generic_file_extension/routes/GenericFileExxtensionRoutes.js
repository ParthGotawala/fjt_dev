const router = require('express').Router(); // eslint-disable-line
const GenericFileExxtensionController = require('../controllers/GenericFileExxtensionController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {

    // Configure Restrict File Type API
    router.route('/retriveConfigureFileType')
        .get(GenericFileExxtensionController.retriveConfigureFileType);
    router.route('/retriveConfigureFileTypeById')
        .get(GenericFileExxtensionController.retriveConfigureFileTypeById);
    router.route('/retriveConfigureFileTypeForUIGrid')
        .post(GenericFileExxtensionController.retriveConfigureFileTypeForUIGrid);
    router.route('/deleteConfigureFileType')
        .post(GenericFileExxtensionController.deleteConfigureFileType);
    router.route('/saveConfigureFileType')
        .post(GenericFileExxtensionController.saveConfigureFileType);
    router.route('/checkDuplicateExtension')
        .post(GenericFileExxtensionController.checkDuplicateExtension);

    app.use(
        '/api/v1/genericfileextension',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};