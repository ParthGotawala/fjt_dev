const router = require('express').Router(); // eslint-disable-line
const WorkorderTransPreprogramCompController = require('../controllers/Workorder_Trans_PreprogramCompController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getWOTransPreprogComponents')
        .post(WorkorderTransPreprogramCompController.getWOTransPreprogComponents);
    router.route('/')
        .post(WorkorderTransPreprogramCompController.addWorkOrderTransCompDesignator);

    router.route('/validateUMIDAndGetPartDetForPreProgram')
        .post(WorkorderTransPreprogramCompController.validateUMIDAndGetPartDetForPreProgram);

    app.use(
        '/api/v1/workorder_trasn_preprogram_comp',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
