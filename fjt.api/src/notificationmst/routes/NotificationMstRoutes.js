const router = require('express').Router(); // eslint-disable-line
const NotificationMstController = require('../controllers/NotificationMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getNotificationList')
        .post(NotificationMstController.getNotificationList);

    router.route('/getNotificationCount/:receiverID')
        .get(NotificationMstController.getNotificationCount);

    router.route('/clearNotificationCount')
        .post(NotificationMstController.clearNotificationCount);

    router.route('/sendNotification')
        .post(NotificationMstController.sendNotification);

    router.route('/ackNotification')
        .post(NotificationMstController.ackNotification);

    router.route('/getEmployeeWiseInboxNotificationList')
        .post(NotificationMstController.getEmployeeWiseInboxNotificationList);

    router.route('/getEmployeeWiseSendboxNotificationList')
        .post(NotificationMstController.getEmployeeWiseSendboxNotificationList);

    router.route('/updateNotificationAsReadUnread')
        .post(NotificationMstController.updateNotificationAsReadUnread);

    router.route('/getAllReceiversOfSenderNotification')
        .post(NotificationMstController.getAllReceiversOfSenderNotification);

    router.route('/getNotificationWithReceiversByTableRefID')
        .post(NotificationMstController.getNotificationWithReceiversByTableRefID);

    app.use(
        '/api/v1/notificationmst',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
    app.use(
        '/api/v1/notificationmstapi',
        router
    );
    router.route('/sendExceedLimitNotification')
        .post(NotificationMstController.sendExceedLimitNotification);
};