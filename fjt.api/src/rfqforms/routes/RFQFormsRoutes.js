const router = require('express').Router();

const RFQForms = require('../controllers/RFQFormsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveRFQ')
        .post(RFQForms.saveRFQ);

    router.route('/deleteRFQ')
        .post(RFQForms.deleteRFQ);

    router.route('/findSamePriceGroup')
        .post(RFQForms.findSamePriceGroup);

    router.route('/getRFQProgressCount')
        .get(RFQForms.getRFQProgressCount);

    router.route('/getRFQByID/:id')
        .get(RFQForms.getRFQByID);

    router.route('/retrieveRFQList')
        .post(RFQForms.retrieveRFQList);

    router.route('/downloadRFQPriceGroupTemplate')
        .post(RFQForms.downloadRFQPriceGroupTemplate);

    router.route('/getAllRFQList')
        .get(RFQForms.getAllRFQList);

    router.route('/getQuoteNumberList')
        .post(RFQForms.getQuoteNumberList);

    router.route('/getRfqListHistory')
        .post(RFQForms.getRfqListHistory);

    app.use(
        '/api/v1/rfqforms',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
