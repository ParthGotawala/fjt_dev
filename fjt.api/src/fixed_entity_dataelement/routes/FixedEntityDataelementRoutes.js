const router = require('express').Router();

const fixedentitydataelement = require('../controllers/FixedEntityDataelementController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retrieveFixedEntityDataelementList')
        .get(fixedentitydataelement.retrieveFixedEntityDataelementList);

    router.route('/getDataElementByDisplayEntityName')
        .post(fixedentitydataelement.getDataElementByDisplayEntityName);

    app.use(
        '/api/v1/fixed_entity_dataelement',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
