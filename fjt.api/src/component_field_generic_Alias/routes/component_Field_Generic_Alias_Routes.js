const router = require('express').Router(); // eslint-disable-line
const ComponentGenericAlias = require('../controllers/Component_Field_Generic_Alias_Controller');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')


module.exports = (app) => {
    router.route('/getComponentGenericAlias')
        .get(ComponentGenericAlias.getComponentGenericAlias);

    router.route('/saveGenericAlias')
        .post(ComponentGenericAlias.saveGenericAlias);

    app.use('/api/v1/ComponentGenericAlias',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};