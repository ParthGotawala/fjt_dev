const router = require('express').Router(); // eslint-disable-line
const WOTransOPHoldUnHoldController = require('../controllers/Workorder_Trans_Operation_Hold_UnholdController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getWOHaltOperationsDet')
        .post(WOTransOPHoldUnHoldController.getWOHaltOperationsDet);

    app.use(
        '/api/v1/workorder_trans_operation_hold_unhold',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};