const router = require('express').Router(); // eslint-disable-line
const dataElementKeyValues = require('../controllers/DataElement_KeyValuesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(dataElementKeyValues.createDataElement_KeyValues);

    router.route('/:id/:elementName')
        .get(dataElementKeyValues.retriveDataElement_KeyValues)
        .put(dataElementKeyValues.updateDataElement_KeyValues)
        // .delete(dataElementKeyValues.deleteDataElement_KeyValues);

    router.route('/deleteDataElement_KeyValues')
        .post(dataElementKeyValues.deleteDataElement_KeyValues);

    app.use(
        '/api/v1/dataelement_keyvalues',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
