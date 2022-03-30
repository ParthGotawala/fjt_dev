const router = require('express').Router();

const componentAlternatepnValidations = require('../controllers/Component_AlternatePN_ValidationsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    router.route('/retrieveAliasPartsValidation')
        .post(componentAlternatepnValidations.retrieveAliasPartsValidation);

    router.route('/getColumnField')
        .get(componentAlternatepnValidations.getColumnField);

    router.route('/updateAliasPartsValidation')
        .get(componentAlternatepnValidations.retrieveAliasPartsValidation)
        .put(componentAlternatepnValidations.updateAliasPartsValidation);

    router.route('/createAliasPartsValidation')
        .post(componentAlternatepnValidations.createAliasPartsValidation);

    router.route('/deleteAliasPartsValidation')
        .get(componentAlternatepnValidations.retrieveAliasPartsValidation)
        .post(componentAlternatepnValidations.deleteAliasPartsValidation);

    router.route('/checkAlternatePartValidationUsed')
        .post(componentAlternatepnValidations.checkAlternatePartValidationUsed);

    router.route('/retrieveAliasPartsValidationDetails')
        .post(componentAlternatepnValidations.retrieveAliasPartsValidationDetails);

    router.route('/checkAliasPartsValidationExists')
        .post(componentAlternatepnValidations.checkAliasPartsValidationExists);

    router.route('/copyAliasPartalidations')
        .post(componentAlternatepnValidations.copyAliasPartalidations);
    app.use(
        '/api/v1/aliasPartsValidation',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};