const router = require('express').Router();

const RFQRohsPeerController = require('../controllers/RFQ_RoHS_PeerController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveRoHSPeer')
        .post(RFQRohsPeerController.saveRoHSPeer);

    router.route('/getRoHSPeer/:id')
        .get(RFQRohsPeerController.getRoHSPeer);

    app.use('/api/v1/rfqRoHSPeer',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
