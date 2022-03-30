const router = require('express').Router(); // eslint-disable-line
const WorkorderTransHoldUnhold = require('../controllers/Workorder_Trans_Hold_UnholdController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retriveWorkorderHaltResumeDetails')
        .post(WorkorderTransHoldUnhold.retriveWorkorderHaltResumeDetails);

    app.use(
        '/api/v1/workorder_trans_hold_unhold',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
