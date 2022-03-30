const router = require('express').Router(); // eslint-disable-line
const componentLogicalGroupController = require('../controllers/componentLogicalGroupController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    router.route('/retriveComponentLogicalGroup')
        .post(componentLogicalGroupController.retriveComponentLogicalGroup);
    router.route('/deleteComponentLogicalGroup')
        .post(componentLogicalGroupController.deleteComponentLogicalGroup);
    router.route('/createComponentLogicalGroup')
        .post(componentLogicalGroupController.createComponentLogicalGroup);
    router.route('/updateComponentLogicalGroup/:id')
        .post(componentLogicalGroupController.updateComponentLogicalGroup);
    router.route('/getMountingTypeList')
        .get(componentLogicalGroupController.getMountingTypeList);
    router.route('/saveLogicalGroupAlias')
        .post(componentLogicalGroupController.saveLogicalGroupAlias);
    router.route('/getLogicalGroupAlias')
        .post(componentLogicalGroupController.getLogicalGroupAlias);
    router.route('/checkMountingGroupAlreadyExists')
        .post(componentLogicalGroupController.checkMountingGroupAlreadyExists);

    router.route('/retrieveMountingTypesNotAddedInGroup')
        .post(componentLogicalGroupController.retrieveMountingTypesNotAddedInGroup);

    app.use(
        '/api/v1/componentLogicalGroup',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
