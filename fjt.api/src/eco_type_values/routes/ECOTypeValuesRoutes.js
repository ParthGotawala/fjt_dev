const router = require('express').Router(); // eslint-disable-line
const ECOTypeValuesController = require('../controllers/ECOTypeValuesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(ECOTypeValuesController.createECOTypeValue);

    router.route('/retriveECOTypeValuesList')
        .post(ECOTypeValuesController.retriveECOTypeValuesList);

    router.route('/:ecoTypeValID')
        .get(ECOTypeValuesController.retriveECOTypeValues)
        .put(ECOTypeValuesController.updateECOTypeValue);

    router.route('/deleteECOTypeValue')
        .post(ECOTypeValuesController.deleteECOTypeValue);

    router.route('/getECOCategoryList')
        .post(ECOTypeValuesController.getECOCategoryList);

    router.route('/checkEcoTypeValuesAlreadyExists')
        .post(ECOTypeValuesController.checkEcoTypeValuesAlreadyExists);

    app.use(
        '/api/v1/ecotypevalue',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
