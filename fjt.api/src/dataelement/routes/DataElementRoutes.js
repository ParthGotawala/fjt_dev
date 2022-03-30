const router = require('express').Router(); // eslint-disable-line
const dataElement = require('../controllers/DataElementController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // place above '/' because of route conflict

    router.route('/retrieveEntityDataElements/:id')
        .get(dataElement.retrieveEntityDataElements);

    router.route('/getFixedEntityDataforCustomAutoCompleteForEntity')
        .post(dataElement.updateDataElementInformationForFixedEntity);

    router.route('/getCustomEntityDataforCustomAutoCompleteForEntity')
        .post(dataElement.updateDataElementInformationForCustomEntity);

    router.route('/getManualDataforCustomAutoCompleteForEntity')
        .post(dataElement.updateDataElementInformationForManualData);

    router.route('/')
        .get(dataElement.retriveDataElements);

    router.route('/:id/:dataelement/:entityID')
        .get(dataElement.retriveDataElements)
        .put(dataElement.updateDataElement);

    router.route('/deleteDataElement')
        .post(dataElement.deleteDataElement);

    router.route('/updateDisplayOrder')
        .put(dataElement.updateDisplayOrder);

    router.route('/createNewDataElement')
        .post(dataElement.createNewDataElement);

    router.route('/getEntityDataElementsByEntityID/:entityID')
        .get(dataElement.getEntityDataElementsByEntityID);

    router.route('/checkDuplicateForDENameDisplayOrder')
        .post(dataElement.checkDuplicateForDENameDisplayOrder);

    router.route('/resetFieldWidth')
        .post(dataElement.resetFieldWidth);

    app.use(
        '/api/v1/dataelements',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
