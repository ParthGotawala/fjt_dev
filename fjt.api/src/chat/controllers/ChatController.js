const { STATE, COMMON } = require('../../constant');
const { NotFound, NotCreate } = require('../../errors');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const chatModuleName = DATA_CONSTANT.CHAT.NAME;
const groupChatModuleName = DATA_CONSTANT.GROUP_CHAT.NAME;
const groupChatLogModuleName = DATA_CONSTANT.GROUP_CHAT_LOG.NAME;
const groupParticipantModuleName = DATA_CONSTANT.GROUP_PARTICIPANT.NAME;
const standardMessageModuleName = DATA_CONSTANT.STANDARD_MESSAGE.NAME;

const chatInputFields = [
    'senderID',
    'receiverID',
    'message',
    'chatDate',
    'isRead',
    'mediaPath',
    'isDownloaded',
    'fileUploadStatus',
    'displayFileName',
    'createdBy',
    'isDeleted',
    'isRead'
];

const groupChatFields = [
    'groupName',
    'createdBy',
    'isDeleted'
];

const groupParticipantFields = [
    'groupID',
    'participantID',
    'participantAddedBy',
    'createdBy',
    'isDeleted',
    'deletedBy',
    'deletedAt',
    'isRead',
    'lastReadAt'
];
const deletegroupParticipantFields = [
    'groupParticipantID',
    'participantRemovedBy',
    'isDeleted',
    'deletedBy',
    'deletedAt'
];

const chatGroupInputFields = [
    'groupID',
    'senderID',
    'message',
    'chatDate',
    'remarkFlag',
    'createdBy',
    'isDeleted'
];

const changeGroupNameFields = [
    'groupName',
    'updatedBy'
];

const setUserStatusFields = [
    'onlineStatus',
    'updatedBy'
];

const getGroupChatLogDetailFields = [
    'isRead',
    'lastReadAt',
    'updatedBy'
];
// injected app as this controller used in socketCtrl.js
module.exports = {
    // Get List of Contant by sender Id and workAreaId with order by field
    // GET : /api/v1/chat/getContactList
    // @param {senderId} int
    // @param {workAreaID} int
    // @param {orderBy} char
    // @return List of Contant
    getContactList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetChatContactList (:psenderID,:pworkAreaID)', {
            replacements: {
                psenderID: req.params.senderId,
                pworkAreaID: req.params.workAreaID || null
            }
        }).then(contectList => resHandler.successRes(res, 200, STATE.SUCCESS, contectList)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(chatModuleName)));
        });
    },
    // Get List of Chat detail by sender Id and receiverId
    // GET : /api/v1/chat/getContactList
    // @param {senderId} int
    // @param {receiverId} int
    // @param {recordPerPage} int
    // @param {pageIndex} int
    // @return List of Chat detail
    getChatDetail: (req, res) => {
        const { Chat, sequelize } = req.app.locals.models;

        var model = {
            isRead: true,
            updatedAt: COMMON.getCurrentUTC()
        };
        Chat.update(model, {
            fields: ['isRead', 'updatedAt'],
            where: {
                senderID: req.params.receiverId,
                receiverID: req.params.senderId
            }
        });

        sequelize.query('CALL Sproc_GetChatHistory (:psenderID, :preceiverID,:precordPerPage,:ppageIndex, :pchatID)', {
            replacements: {
                psenderID: req.params.senderId,
                preceiverID: req.params.receiverId,
                precordPerPage: req.params.recordPerPage,
                ppageIndex: req.params.pageIndex || null,
                pchatID: null
            }
        }).then(chatList => resHandler.successRes(res, 200, STATE.SUCCESS, chatList)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(chatModuleName)));
        });
    },
    // Save detail of chat
    // POST : /api/v1/chat/sendMessage
    // @return new added chat detail
    sendMessage: (req, res) => {
        const Chat = req.app.locals.models.Chat;
        if (req.body.chatID) {
            COMMON.setModelUpdatedByFieldValue(req);
            Chat.update(req.body, {
                where: {
                    chatID: req.body.chatID
                },
                fields: ['senderID', 'receiverID', 'message']
            }).then(() => {
                // Add Chat Detail into Elastic Search Engine for Enterprise Search
                req.params = { chatID: req.body.chatID };

                return module.exports.getChatDetailByID(req, req.body.senderID, req.body.receiverID, req.body.chatID).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, response)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(chatModuleName)));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.CHAT.NOT_SEND));
            });
        } else {
            COMMON.setModelCreatedByFieldValue(req);
            req.body.chatDate = COMMON.getCurrentUTC();
            req.body.isRead = false;
            Chat.create(req.body, {
                fields: chatInputFields
            }).then((response) => {
                // Add Chat Detail into Elastic Search Engine for Enterprise Search
                req.params = { chatID: response.chatID };

                return module.exports.getChatDetailByID(req, req.body.senderID, req.body.receiverID, response.chatID).then((responseDet) => {
                    if (req.body.isHighPriorityMsg) {
                        const data = responseDet[0];
                        if (data) { NotificationMstController.sendChatMessage(req, data); }
                    }
                    resHandler.successRes(res, 200, STATE.SUCCESS, responseDet);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(chatModuleName)));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.CHAT.NOT_SEND));
            });
        }
    },
    // Get chat detail by senderId, receiverId and chatId
    // @return chat detail
    getChatDetailByID: (req, senderID, receiverID, chatID) => {
        const sequelize = req.app.locals.models.sequelize;
        return sequelize.query('CALL Sproc_GetChatHistory (:psenderID, :preceiverID,:precordPerPage,:ppageIndex, :pchatID)', {
            replacements: {
                psenderID: senderID,
                preceiverID: receiverID,
                precordPerPage: 1,
                ppageIndex: 1,
                pchatID: chatID
            }
        }).then(chatList => chatList).catch((err) => {
            console.trace();
            console.error(err);
            return null;
        });
    },
    // Create group
    // POST : /api/v1/chat/createGroup
    // @return new added group detail
    createGroup: (req, res) => {
        const { GroupChat, GroupParticipantDetails } = req.app.locals.models;
        if (req.body.groupName) { req.body.groupName = COMMON.TEXT_WORD_CAPITAL(req.body.groupName, false); }

        COMMON.setModelCreatedByFieldValue(req);
        // return sequelize.transaction().then((t) => {
        return GroupChat.create(req.body, {
            fields: groupChatFields
            // transaction: t
        }).then((response) => {
            var groupParticipantDetails = req.body.groupParticipantDetails;
            groupParticipantDetails.forEach((x) => {
                x.groupID = response.groupID;
                x.createdBy = req.body['createdBy'];
                x.isRead = false;
                x.lastReadAt = response.createdAt;
            });

            return GroupParticipantDetails.bulkCreate(groupParticipantDetails, {
                fields: groupParticipantFields
                // transaction: t
            }).then(() => {
                // t.commit();
                var groupID = response.groupID;
                return module.exports.getGroupDetailsByID(req, groupID).then((resp) => {
                    resHandler.successRes(res, 200, STATE.SUCCESS, resp);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(groupParticipantModuleName)));
                });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            // t.rollback();
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(groupChatModuleName)));
        });
        // });
    },
    // Get List of Group Chat detail by groupID sender Id and receiverId
    // GET : /api/v1/chat/getGroupChatLogDetail
    // @param {groupID} int
    // @param {senderID} int
    // @param {recordPerPage} int
    // @param {pageIndex} int
    // @return List of Group Chat detail
    getGroupChatLogDetail: (req, res) => {
        const { sequelize, GroupParticipantDetails } = req.app.locals.models;

        var model = {
            isRead: true,
            lastReadAt: COMMON.getCurrentUTC(),
            updatedBy: req.params.senderID
        };
        GroupParticipantDetails.update(model, {
            fields: getGroupChatLogDetailFields,
            where: { groupID: req.params.groupID, participantID: req.params.senderID }
        });

        sequelize
            .query('CALL Sproc_GetGroupChatHistory (:pgroupID, :psenderID,:precordPerPage,:ppageIndex,:pgroupChatID)',
                { replacements: { pgroupID: req.params.groupID, psenderID: req.params.senderID, precordPerPage: req.params.recordPerPage, ppageIndex: req.params.pageIndex, pgroupChatID: null } })
            .then((groupchatlogList) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, groupchatlogList);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(groupChatLogModuleName)));
            });
    },
    // Send group message
    // POST : /api/v1/chat/sendGroupMessage
    // @return New added group message detail
    sendGroupMessage: (req, res) => {
        const GroupChatLog = req.app.locals.models.GroupChatLog;
        if (req.body.groupChatID) {
            COMMON.setModelUpdatedByFieldValue(req);
            GroupChatLog.update(req.body, {
                where: {
                    groupChatID: req.body.groupChatID
                },
                fields: ['groupID', 'senderID', 'message']
            }).then(() => {
                // Add Chat Detail into Elastic Search Engine for Enterprise Search
                req.params = { groupChatID: req.body.groupChatID };
                return module.exports.getGroupChatLogDetailByID(req, req.body.groupID, req.body.senderID, req.body.groupChatID).then(resp => resHandler.successRes(res, 200, STATE.SUCCESS, resp)).catch((err) => {
                    console.trace();
                    console.error(err);
                    resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(groupChatLogModuleName)));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(groupChatLogModuleName)));
            });
        } else {
            COMMON.setModelCreatedByFieldValue(req);
            req.body.chatDate = COMMON.getCurrentUTC();
            GroupChatLog.create(req.body, {
                fields: chatGroupInputFields
            }).then((response) => {
                // Add Chat Detail into Elastic Search Engine for Enterprise Search
                req.params = { groupChatID: response.groupChatID };
                return module.exports.getGroupChatLogDetailByID(req, req.body.groupID, req.body.senderID, response.groupChatID).then((resp) => {
                    if (req.body.isHighPriorityMsg) {
                        const data = resp[0];
                        if (data) { NotificationMstController.sendChatMessage(req, data); }
                    }
                    resHandler.successRes(res, 200, STATE.SUCCESS, resp);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(groupChatLogModuleName)));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(groupChatLogModuleName)));
            });
        }
    },
    // Get group chat log detail by groupID, sendetID and groupChatID
    // @param {groupID} int
    // @param {senderID} int
    // @param {groupChatID} int
    // @return Group chat log detail
    getGroupChatLogDetailByID: (req, groupID, senderID, groupChatID) => {
        const sequelize = req.app.locals.models.sequelize;

        return sequelize
            .query('CALL Sproc_GetGroupChatHistory (:pgroupID, :psenderID,:precordPerPage,:ppageIndex,:pgroupChatID)',
                { replacements: { pgroupID: groupID, psenderID: senderID, precordPerPage: 1, ppageIndex: 1, pgroupChatID: groupChatID } })
            .then(groupchatlogList => groupchatlogList).catch((err) => {
                console.trace();
                console.error(err);
                return null;
            });
    },
    // Create Group Participant
    // POST : /api/v1/chat/createGroupParticipant
    // @return Group Participant details
    createGroupParticipant: (req, res) => {
        const { GroupParticipantDetails } = req.app.locals.models;
        req.body.forEach((x) => {
            x.createdBy = x.participantAddedBy;
            x.updatedBy = x.participantAddedBy;
            x.isRead = false;
            x.lastReadAt = COMMON.getCurrentUTC();
        });
        GroupParticipantDetails.bulkCreate(req.body, {
            fields: groupParticipantFields
        }).then(() => {
            var groupID = req.body[0].groupID;
            return module.exports.getGroupDetailsByID(req, groupID).then((resp) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, resp);
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATE(groupParticipantModuleName)));
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(groupParticipantModuleName)));
        });
    },
    // Get Group Details by groupID
    // GET : /api/v1/chat/getGroupDetails
    // @param {groupID} int
    // @return Group details
    getGroupDetails: (req, res) => {
        var groupID = req.params.groupID;
        return module.exports.getGroupDetailsByID(req, groupID).then((resp) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, resp);
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(groupChatModuleName)));
        });
    },
    // Get Group Details by groupID
    // @param {groupID} int
    // @return Group details
    getGroupDetailsByID: (req, groupID) => {
        const { GroupChat, GroupParticipantDetails, User } = req.app.locals.models;
        return GroupChat.findOne({
            attributes: ['groupID', 'groupName', 'createdBy'],
            where: { groupID: groupID },
            include: [
                {
                    attributes: ['groupParticipantID', 'participantID'],
                    model: GroupParticipantDetails,
                    as: 'groupParticipantDetails',
                    where: { groupID: groupID },
                    include: [{
                        attributes: ['id', 'firstName', 'lastName', 'employeeID'],
                        model: User,
                        as: 'user'
                    }]
                }]
        }).then((resp) => {
            if (resp) {
                resp.groupParticipantDetails.forEach((x) => {
                    if (resp.createdBy === x.participantID.toString()) { x.dataValues.isAdmin = true; }
                });
            }
            return resp;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return null;
        });
    },
    // Change Group Name
    // POST : /api/v1/chat/changeGroupName
    // @return Group detail
    changeGroupName: (req, res) => {
        const GroupChat = req.app.locals.models.GroupChat;
        COMMON.setModelUpdatedByFieldValue(req);
        if (req.body.groupName) { req.body.groupName = COMMON.TEXT_WORD_CAPITAL(req.body.groupName, false); }

        GroupChat.update(req.body, {
            fields: changeGroupNameFields,
            where: { groupID: req.body.groupID }
        }).then((response) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, response);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.GROUP_CHAT.GROUP_NAME_CHANGE));
        });
    },
    // Delete Group Participant
    // POST : /api/v1/chat/deleteGroupParticipant
    // @return API Response
    deleteGroupParticipant: (req, res) => {
        const GroupParticipantDetails = req.app.locals.models.GroupParticipantDetails;
        COMMON.setModelDeletedByFieldValue(req);
        GroupParticipantDetails.update(req.body, {
            where: {
                groupParticipantID: req.body.groupParticipantID,
                deletedAt: null
            },
            fields: deletegroupParticipantFields
        }).then((deleteresponse) => {
            if (deleteresponse > 0) {
                return resHandler.successRes(res, 200, STATE.SUCCESS);
            } else {
                return resHandler.errorRes(res,
                    200,
                    STATE.EMPTY,
                    new NotFound(MESSAGE_CONSTANT.NOT_DELETED(groupParticipantModuleName)));
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(groupParticipantModuleName)));
        });
    },
    // Get List of standard message by workAreaID
    // GET : /api/v1/chat/getStandardMessage
    // @param {workAreaID} int
    // @return List of standard message
    getStandardMessage: (req, res) => {
        const StandardMessage = req.app.locals.models.StandardMessage;
        var whereClause = { isActive: true };
        if (req.params.workAreaID) { whereClause.workAreaID = req.params.workAreaID; }

        StandardMessage.findAll({
            attributes: ['standardMessageID', 'standardMessageTxt', 'workAreaID'],
            where: whereClause
        }).then((standardMessageList) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, standardMessageList);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(standardMessageModuleName)));
        });
    },
    // Set User status
    // POST : /api/v1/chat/setUserStatus
    // @return Updated user detail
    setUserStatus: (req, res) => {
        const User = req.app.locals.models.User;
        COMMON.setModelUpdatedByFieldValue(req);
        return User.update(req.body, {
            fields: setUserStatusFields,
            where: { id: req.body.userID }
        }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, { id: req.body.userID })).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.USER.STATUS_NOT_UPDATED));
        });
    },
    // Update receiver message read status
    // POST : /api/v1/chat/updateReceiverMessageReadStatus
    // @return Updated chat detail
    updateReceiverMessageReadStatus: (req, res) => {
        const Chat = req.app.locals.models.Chat;
        COMMON.setModelUpdatedByFieldValue(req);
        req.body.isRead = true;
        Chat.update(req.body, {
            fields: ['isRead', 'updatedBy'],
            where: {
                senderID: req.body.senderID,
                receiverID: req.body.receiverID
            }
        }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_UPDATED(chatModuleName)));
        });
    },
    // Update group message read status
    // POST : /api/v1/chat/updateGroupMessageReadStatus
    // @return Updated Group Participant detail
    updateGroupMessageReadStatus: (req, res) => {
        const GroupParticipantDetails = req.app.locals.models.GroupParticipantDetails;
        COMMON.setModelUpdatedByFieldValue(req);
        const model = {
            isRead: req.body.isRead,
            updatedAt: COMMON.getCurrentUTC()
        };
        const fields = ['isRead', 'updatedAt'];

        if (model.isRead) {
            model.lastReadAt = COMMON.getCurrentUTC();
            fields.push('lastReadAt');
        }

        GroupParticipantDetails.update(model, {
            fields: fields,
            where: {
                groupID: req.body.groupID,
                participantID: req.body.participantID
            }
        }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_UPDATED(groupParticipantModuleName)));
        });
    },
    // Get total unread message count by sender ID
    // GET : /api/v1/chat/getTotalUnreadMessageCount
    // @param {senderID} int
    // @return total unread message count
    getTotalUnreadMessageCount: (req, res) => {
        const sequelize = req.app.locals.models.sequelize;
        return sequelize
            .query('CALL Sproc_GetTotalUnreadMessageCount (:psenderID)',
                {
                    replacements: { psenderID: req.params.senderID }
                }).then((response) => {
                    const totalCount = response.length > 0 ? response[0].totUnreadMsg : 0;
                    return resHandler.successRes(res, 200, STATE.SUCCESS, totalCount);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(chatModuleName)));
                });
    },
    // Get get message by search text
    // GET : /api/v1/chat/getSerchChatMessage
    // @param {searchText} text
    // @return get message list containing searchtext
    getSerchChatMessage: (req, res) => {
        const { sequelize } = req.app.locals.models;
        let searchtext = null;
        if (req.query.searchText) {
            searchtext = req.query.searchText.replace(' ', '|');
        }
        sequelize.query('CALL Sproc_GetSearchChatMessageList (:pSearchText,:pSenderID)', {
            replacements: {
                pSearchText: searchtext || null,
                pSenderID: req.query.senderID
            }
        }).then((messageList) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, messageList);
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(chatModuleName)));
        });
    },
    // Get get message by search text
    // GET : /api/v1/chat/getReceiverSearchChatMessage
    // @param {searchText, senderid,receiverid,groupid}
    // @return get message list containing searchtext
    getReceiverSearchChatMessage: (req, res) => {
        const { sequelize } = req.app.locals.models;
        let searchtext = null;
        if (req.query.searchText) {
            searchtext = req.query.searchText.replace(' ', '|');
        }
        sequelize.query('CALL Sproc_GetreceiverSearchChatMessageList (:pSearchText,:pSenderID,:pReceiverID,:pGroupID)', {
            replacements: {
                pSearchText: searchtext || null,
                pSenderID: req.query.senderID,
                pReceiverID: req.query.receiverID || null,
                pGroupID: req.query.groupID || null
            }
        }).then((messageList) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, messageList);
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(chatModuleName)));
        });
    }
};