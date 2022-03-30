const router = require('express').Router();

const RFQErrorCodeCategoryMst = require('../controllers/RFQErrorCodeCategoryMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getErrorCodeCategory')
        .get(RFQErrorCodeCategoryMst.getErrorCodeCategory);

    app.use(
        '/api/v1/rfqerrorcode',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};