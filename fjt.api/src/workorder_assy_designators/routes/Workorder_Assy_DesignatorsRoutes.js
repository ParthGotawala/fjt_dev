const router = require('express').Router(); // eslint-disable-line
const WorkorderAssyDesignatorsController = require('../controllers/Workorder_Assy_DesignatorsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/deleteDesignator')
        .post(WorkorderAssyDesignatorsController.deleteWorkOrderTransAssyDesignator);

    router.route('/createWorkOrderAssyDesignator')
        .post(WorkorderAssyDesignatorsController.createWorkOrderAssyDesignator);

    router.route('/updateWorkOrderAssyDesignator')
        .post(WorkorderAssyDesignatorsController.updateWorkOrderAssyDesignator);

    app.use(
        '/api/v1/workorder_assy_designators',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};