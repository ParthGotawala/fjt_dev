const router = require('express').Router(); // eslint-disable-line
const WorkorderPreprogCompController = require('./../controllers/Workorder_PreprogCompController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    //router.route('/retrivePreProgComponents/:woID')
    //    .get(WorkorderPreprogCompController.retrivePreProgComponents);
    router.route('/deleteWOPreProgramComponent')
        .post(WorkorderPreprogCompController.deletePreProgramComponent);

    router.route('/saveWOPreProgramComponent')
        .post(WorkorderPreprogCompController.saveWOPreProgramComponent);
    router.route('/:woPreProgCompID')
        .get(WorkorderPreprogCompController.retrivePreProgComponentsByID);

    router.route('/updateWOPreProgramComponent')
        .post(WorkorderPreprogCompController.updateWOPreProgramComponent);

    app.use(
        '/api/v1/workorder_preprogcomp',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
