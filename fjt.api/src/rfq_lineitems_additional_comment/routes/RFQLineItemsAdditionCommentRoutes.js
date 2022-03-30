const router = require('express').Router();

const RFQLineItemsAdditionalCommentController = require('../controllers/RFQLineItemsAdditionalCommentController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getRfqLineitemsdescription/:id')
        .get(RFQLineItemsAdditionalCommentController.getRfqLineitemsdescription);

    router.route('/createRFQLineItemsDescription')
        .post(RFQLineItemsAdditionalCommentController.createRFQLineItemsDescription);

    router.route('/getRfqLineItemsCopyDescription')
        .post(RFQLineItemsAdditionalCommentController.getRfqLineItemsCopyDescription);

    app.use(
        '/api/v1/rfqlineitemsadditionalcomment',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};