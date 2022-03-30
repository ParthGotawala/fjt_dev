const router = require('express').Router(); // eslint-disable-line
const workorderTransSubFormData = require('../controllers/Workorder_Trans_Subform_DataController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getWorkorderTransSubformDataDetail')
        .post(workorderTransSubFormData.getWorkorderTransSubformDataDetail);

    app.use(
        '/api/v1/workorder_trans_subForm_data',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
