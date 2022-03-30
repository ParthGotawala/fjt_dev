const router = require('express').Router();

const UnallocatedUMIDXferHistoryController = require('../controllers/UnallocatedUMIDXferHistoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {

    router.route('/unallocatedXferHistory')
        .post(UnallocatedUMIDXferHistoryController.unallocatedXferHistory);

    app.use('/api/v1/unallocated_umid_transfer',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};