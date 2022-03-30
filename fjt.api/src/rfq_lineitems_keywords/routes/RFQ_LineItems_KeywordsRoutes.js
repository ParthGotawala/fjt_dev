const router = require('express').Router();

const RFQLineItemsKeywordsController = require('../controllers/RFQ_LineItems_KeywordsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retriveKeywordList')
        .post(RFQLineItemsKeywordsController.retriveKeywordList);

    router.route('/findSameKeyWord')
        .post(RFQLineItemsKeywordsController.findSameKeyWord);

    router.route('/retriveKeyword/:id')
        .get(RFQLineItemsKeywordsController.retriveKeyword);

    router.route('/saveKeyword')
        .post(RFQLineItemsKeywordsController.createKeyword);

    router.route('/deleteKeywords')
        .post(RFQLineItemsKeywordsController.deleteKeywords);

    app.use('/api/v1/keywords',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
