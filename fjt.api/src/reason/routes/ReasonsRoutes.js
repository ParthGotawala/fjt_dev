const router = require('express').Router(); // eslint-disable-line
const ReasonsController = require('../controllers/ReasonsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveReason')
        .post(ReasonsController.createReason);

    router.route('/getReasonList')
        .post(ReasonsController.getReasonList);

    router.route('/getActiveReasonListByReasonType')
        .post(ReasonsController.getActiveReasonListByReasonType);

    router.route('/deleteReason')
        .post(ReasonsController.deleteReason);

    router.route('/checkDuplicateResonCategory')
        .post(ReasonsController.checkDuplicateResonCategory);

    router.route('/retriveReasonList')
        .post(ReasonsController.retriveReasonList);

    router.route('/retriveReason/:id')
        .get(ReasonsController.retriveReason);

    app.use('/api/v1/reason',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
