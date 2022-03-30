const router = require('express').Router(); // eslint-disable-line
const chat = require('../controllers/ChatController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    router.route('/getContactList/:senderId/:workAreaID')
        .get(chat.getContactList);

    router.route('/getChatDetail/:senderId/:receiverId/:recordPerPage/:pageIndex')
        .get(chat.getChatDetail);

    router.route('/sendMessage')
        .post(chat.sendMessage);

    router.route('/createGroup')
        .post(chat.createGroup);

    router.route('/getGroupChatLogDetail/:groupID/:senderID/:recordPerPage/:pageIndex')
        .get(chat.getGroupChatLogDetail);

    router.route('/sendGroupMessage')
        .post(chat.sendGroupMessage);

    router.route('/createGroupParticipant')
        .post(chat.createGroupParticipant);

    router.route('/getGroupDetails/:groupID')
        .get(chat.getGroupDetails);
    router.route('/deleteGroupParticipant')
        .post(chat.deleteGroupParticipant);

    router.route('/changeGroupName')
        .post(chat.changeGroupName);

    router.route('/getStandardMessage/:workAreaID?')
        .get(chat.getStandardMessage);

    router.route('/setUserStatus')
        .post(chat.setUserStatus);

    router.route('/updateReceiverMessageReadStatus')
        .post(chat.updateReceiverMessageReadStatus);

    router.route('/updateGroupMessageReadStatus')
        .post(chat.updateGroupMessageReadStatus);

    router.route('/getSerchChatMessage')
        .get(chat.getSerchChatMessage);

    router.route('/getReceiverSearchChatMessage')
        .get(chat.getReceiverSearchChatMessage);

    router.route('/getTotalUnreadMessageCount/:senderID')
        .get(chat.getTotalUnreadMessageCount);

    app.use(
        '/api/v1/chat',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
