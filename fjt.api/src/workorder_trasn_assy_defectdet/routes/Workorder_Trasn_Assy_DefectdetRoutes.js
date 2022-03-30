const router = require('express').Router(); // eslint-disable-line
const WorkorderTrasnAssyDefectdetController = require('../controllers/Workorder_Trasn_Assy_DefectdetController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(WorkorderTrasnAssyDefectdetController.addWorkOrderTransAssyDesignator);
    router.route('/getAllDefectCategoryWithList/:woID/:isRework')
        .get(WorkorderTrasnAssyDefectdetController.getAllDefectCategoryWithList);
    router.route('/getWorkOrderTransAssyDesignators')
        .post(WorkorderTrasnAssyDefectdetController.getWorkOrderTransAssyDesignators);
    router.route('/calculateAndGetDPMOForWoAssy')
        .post(WorkorderTrasnAssyDefectdetController.calculateAndGetDPMOForWoAssy);

    app.use(
        '/api/v1/workorder_trasn_assy_defectdet',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};