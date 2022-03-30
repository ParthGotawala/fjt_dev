const router = require('express').Router(); // eslint-disable-line
const RfqTypesController = require('../controllers/RfqTypesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveRfqType')
        .post(RfqTypesController.createRfqType);

    router.route('/findSameRFQType')
        .post(RfqTypesController.findSameRFQType);

    router.route('/getRfqTypeList')
        .get(RfqTypesController.getRfqTypeList);

    router.route('/deleteRfqType')
        .post(RfqTypesController.deleteRfqType);

    router.route('/retriveRfqType')
        .get(RfqTypesController.retriveRfqType);

    router.route('/retriveRfqTypeList')
        .post(RfqTypesController.retriveRfqTypeList);

    // router.route('/retriveRfqType/:id')
    // .get(RfqTypesController.retriveRfqType);

    app.use('/api/v1/rfq_type',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
