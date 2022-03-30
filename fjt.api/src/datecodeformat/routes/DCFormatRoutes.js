const router = require('express').Router();
const DCFormatController = require('../controllers/DCFormatController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retrieveDCFormatList')
        .post(DCFormatController.retrieveDCFormatList);

    router.route('/retriveDCFormatById/:id')
        .get(DCFormatController.retriveDCFormatById);

    router.route('/saveDCFormatDetails')
        .post(DCFormatController.saveDCFormatDetails);

    router.route('/checkDuplicateDCFormat')
        .post(DCFormatController.checkDuplicateDCFormat);

    router.route('/deleteDCFormat')
        .post(DCFormatController.deleteDCFormat);

    router.route('/retriveDateCodeFormatList')
        .post(DCFormatController.retriveDateCodeFormatList);

    router.route('/setDateCodeFormatData')
        .post(DCFormatController.setDateCodeFormatData);

    router.route('/getDateCodeFormatData')
        .post(DCFormatController.getDateCodeFormatData);

    app.use('/api/v1/datecodeformat',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};