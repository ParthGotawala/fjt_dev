const router = require('express').Router();

const RolePagePermisionController = require('../controllers/RolePagePermisionController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getPageListByRole')
        .get(RolePagePermisionController.getPageListByRole);

    router.route('/getRightsSummary')
        .post(RolePagePermisionController.getRightsSummary);

    router.route('/')
        .post(RolePagePermisionController.rolePagePermision);

    router.route('/:id')
        .get(RolePagePermisionController.getrolePagePermision)
        .put(RolePagePermisionController.updaterolePagePermision);

    router.route('/saveRoleRightPage')
        .post(RolePagePermisionController.saveRoleRightPage);

    router.route('/updateRoleRight')
        .post(RolePagePermisionController.updateRoleRight);

    router.route('/deleteRolesRights')
        .post(RolePagePermisionController.deleteRolesRights);

    router.route('/sendNotificationOfRightChanges/:id/:isSelectMultipleUser')
        .get(RolePagePermisionController.sendNotificationOfRightChanges);

    app.use(
        '/api/v1/rolePagePermision',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
