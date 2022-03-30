const router = require('express').Router();

const RFQErrorCodeCategoryMapping = require('../controllers/RFQErrorCodeCategoryMappingController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getErrorCodeCategoryMapping')
        .get(RFQErrorCodeCategoryMapping.getErrorCodeCategoryMapping);

    router.route('/saveErrorCodeMapping')
        .post(RFQErrorCodeCategoryMapping.saveErrorCodeMapping);

    app.use(
        '/api/v1/rfqerrorcodecategory',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};