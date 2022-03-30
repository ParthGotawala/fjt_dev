const router = require('express').Router();

const RoleController = require('../controllers/RoleController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getRoles')
        .get(RoleController.getRoles);

    router.route('/')
        .post(RoleController.createRole);

    router.route('/retriveRolesList')
        .post(RoleController.retriveRolesList);

    router.route('/:id')
        .get(RoleController.retrieveRole)
        .put(RoleController.updateRole);

    router.route('/deleteRole')
        .post(RoleController.deleteRole);

    router.route('/getRolesByUser/:id')
        .get(RoleController.getRolesByUser);

    router.route('/SaveRoleFeature')
        .post(RoleController.SaveRoleFeature);

    router.route('/checkDuplicateRoleName')
        .post(RoleController.checkDuplicateRoleName);

    router.route('/getRolesById')
        .post(RoleController.getRolesById);

    app.use(
        '/api/v1/roles',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
