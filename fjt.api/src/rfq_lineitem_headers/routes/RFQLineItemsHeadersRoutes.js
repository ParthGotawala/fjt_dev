const router = require('express').Router(); // eslint-disable-line
const RFQLineItemsHeadersController = require('../controllers/RFQLineItemsHeadersController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getRfqLineitemsHeaders')
        .get(RFQLineItemsHeadersController.getRfqLineitemsHeaders);

    router.route('/saveDisplayOrder')
        .post(RFQLineItemsHeadersController.saveDisplayOrder);

    app.use(
        '/api/v1/rfqlineitemsheaders',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};