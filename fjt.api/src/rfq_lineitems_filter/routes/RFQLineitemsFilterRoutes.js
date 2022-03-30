const router = require('express').Router();

const RFQLineitemsFilter = require('../controllers/RFQLineitemsFilterController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getRFQFilters')
        .get(RFQLineitemsFilter.getRFQFilters);

    router.route('/getUserBOMFiltersSequence')
        .get(RFQLineitemsFilter.getUserBOMFiltersSequence);

    router.route('/saveFilterDisplayOrder')
        .post(RFQLineitemsFilter.saveFilterDisplayOrder);

    app.use(
        '/api/v1/rfqLineItemFilter',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};