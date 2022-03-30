const router = require('express').Router(); // eslint-disable-line
const quoteDynamicFieldsController = require('../controllers/QuoteDynamicFieldsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveQuoteDynamicFields')
        .post(quoteDynamicFieldsController.createQuoteDynamicFields);

    router.route('/deleteQuoteDynamicFields')
        .post(quoteDynamicFieldsController.deleteQuoteDynamicFields);

    router.route('/retriveQuoteDynamicFieldsListByCostingType')
        .get(quoteDynamicFieldsController.retriveQuoteDynamicFieldsListByCostingType);

    router.route('/retriveQuoteDynamicFieldsList')
        .post(quoteDynamicFieldsController.retriveQuoteDynamicFieldsList);

    router.route('/retriveQuoteDynamicFields/:id')
        .get(quoteDynamicFieldsController.retriveQuoteDynamicFields);

    router.route('/checkUniqueDynamicField')
        .post(quoteDynamicFieldsController.checkUniqueDynamicField);

    router.route('/retriveRFQQuoteAttributeList')
        .get(quoteDynamicFieldsController.retriveRFQQuoteAttributeList);

    app.use(
        '/api/v1/quotedynamicfield',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
