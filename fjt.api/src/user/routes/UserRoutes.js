const router = require('express').Router();

const user = require('../controllers/UserController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')


module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/verifyUser')
        .post(user.verifyUser);

    router.route('/getUserList')
        .get(user.getUserList);

    router.route('/validatePassword')
        .post(user.validatePassword);

    // router.route('/sendMailWithAttachement')
    // .post(user.sendMailWithAttachement);

    router.route('/')
        .get(user.retrieveUser)
        .post(user.createUser);

    router.route('/:id')
        .get(user.retrieveUser)
        .put(user.updateUser)
        .delete(user.deleteUser);

    app.use(
        '/api/v1/users',
        // validateToken,

        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );

    router.route('/assignRolePermissionToUser')
        .post(user.assignRolePermissionToUser);

    //app.route('/api/v1/usersaccount/forgotUserPassword')
    //    .post(user.forgotUserPassword);

    app.post('/api/v1/usersaccount/getUserDetailsByPasswordToken',
        user.getUserDetailsByPasswordToken);

    app.post('/api/v1/usersaccount/resetUserCredential',
        user.resetUserCredential);

    router.route('/updateUserSetting')
        .post(user.updateUserSetting);

    router.route('/updateUserByDefaultRole')
        .post(user.updateUserByDefaultRole);

    router.route('/updateUserPasswordResponse')
        .post(user.updateUserPasswordResponse);

    router.route('/logOutUserFromAllDevices')
        .post(user.logOutUserFromAllDevices);

    router.route('/reloadPreviousPages')
        .post(user.reloadPreviousPages);

    router.route('/updateLoginuser')
        .post(user.updateLoginuser);
};
