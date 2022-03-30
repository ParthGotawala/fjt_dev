// / <reference path="../../../constant/data_constant.js" />
const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { NotMatchingPassword, ServerError } = require('../../errors');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

/* errors file*/
const { NotFound } = require('../../errors');
const { Op } = require('sequelize');

const timelineObj = DATA_CONSTANT.TIMLINE.EVENTS.LOGIN;
const timelineLogOutObj = DATA_CONSTANT.TIMLINE.EVENTS.LOGOUT;

module.exports = {
    //[PP] : Not in use
    //login: (req, res) => {
    //    const { User, Employee, UserAgreement, Role, UserConfiguration } = req.app.locals.models;
    //    req.body.username = COMMON.DECRYPT_AES(req.body.username);
    //    req.body.password = COMMON.DECRYPT_AES(req.body.password);
    //    const { password, username, isAgreement, agreementID, signaturevalue, isLatestAgreeemnt } = req.body;
    //    User.findOne({
    //        where: {
    //            [Op.or]: [
    //                { username: req.body.username },
    //                { emailAddress: req.body.username }
    //            ]
    //        },
    //        // where: {
    //        //     username,
    //        // },
    //        // override default attributes to get passwordDigest to authenticate
    //        attributes: ['id', 'username', 'passwordDigest', 'employeeID', 'defaultLoginRoleID', 'printerID'],
    //        include: [
    //            {
    //                model: Employee,
    //                as: 'employee',
    //                attributes: ['id', 'firstName', 'email', 'lastName', 'profileImg', 'logoutIdleTime', 'initialName', 'defaultPurchaseDetailTabID'],
    //                where:
    //                {
    //                    isActive: true
    //                },
    //                required: true
    //            }, {
    //                model: Role,
    //                as: 'roles',
    //                attributes: ['id', 'name', 'slug', 'accessLevel'],
    //                required: false,
    //                through: {
    //                    where: {
    //                        deletedAt: null
    //                    }
    //                }
    //            },
    //            {
    //                model: UserAgreement,
    //                as: 'user_agreement',
    //                attributes: ['userAgreementID', 'userID', 'signaturevalue', 'agreementID'],
    //                required: false
    //            },
    //            {
    //                model: UserConfiguration,
    //                as: 'userConfiguration',
    //                attributes: ['uiGridPreference', 'userId'],
    //                required: false
    //            }]
    //    }).then((user) => {
    //        if (!user) {
    //            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT, err: null, data: null });
    //        }
    //        if (user.dataValues.passwordDigest) {
    //            return user.authenticate(password)
    //                .then(() => (
    //                    user.generateToken()
    //                ))
    //                .then((token) => {
    //                    // check if user agree with agreement or all ready agreed befor login
    //                    if (!isAgreement && user.user_agreement && user.user_agreement.length === 0) {
    //                        // [S] add log for timeline of user
    //                        var TimelineController = require('../../timeline/controllers/TimelineController');
    //                        let objEvent = {
    //                            userID: (req.user && req.user.id) ? req.user.id : user.id,
    //                            eventTitle: COMMON.stringFormat(timelineObj.title),
    //                            eventDescription: COMMON.stringFormat(timelineObj.description, user.username),
    //                            refTransTable: null,
    //                            refTransID: null,
    //                            eventType: timelineObj.id,
    //                            url: null,
    //                            eventAction: null
    //                        };
    //                        req.objEvent = objEvent;
    //                        return TimelineController.createTimeline(req).then((response) => {
    //                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
    //                                token, userid: user.id, employee: user.employee, roles: user.roles, userAgreement: user.user_agreement, userName: user.username, defaultLoginRoleID: user.defaultLoginRoleID, printerID: user.printerID,
    //                                userConfiguration: user.userConfiguration
    //                            }, null);
    //                        }).catch((err) => {
    //                            console.trace();
    //                            console.error(err);
    //                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                        });
    //                        // [E] add log for timeline of user

    //                    } else {
    //                        // if not agreed with agreement befor login, add user and agreement details in user_agreement
    //                        if (user.user_agreement && user.user_agreement.length > 0) {
    //                            const agreementID = _.max(user.user_agreement.map((item) => { return item.agreementID }));
    //                            //var AgreementTypeController = require('../../agreement_template/controllers/AgreementTemplateController');
    //                            var AgreementTypeController = require('../../Identity/IdentityApiHandler');
    //                            return AgreementTypeController.checkLatestUserAgreement(agreementID,token).then((responses) => {
    //                                const response = JSON.parse(responses);
    //                                if (response.status === STATE.FAILED) {
    //                                    if (typeof (signaturevalue) !== 'undefined' && !isLatestAgreeemnt) {
    //                                        COMMON.setModelCreatedByFieldValue(req);
    //                                        let obj = {
    //                                            userID: user.id,
    //                                            agreementID: req.body.agreementID,
    //                                            signaturevalue: signaturevalue,
    //                                            createdBy: user.id,
    //                                            updatedBy: user.id,
    //                                            updateByRoleId: req.body.createByRoleId,
    //                                            createByRoleId: req.body.updateByRoleId
    //                                        }
    //                                        return UserAgreement.create(obj, {
    //                                        }).then((agreement) => {
    //                                            //req.body.isLatestAgreeemnt = true;
    //                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
    //                                                token, isLatestAgreeemnt: true, userid: user.id, employee: user.employee, roles: user.roles, userAgreement: user.user_agreement, userName: user.username, defaultLoginRoleID: user.defaultLoginRoleID, printerID: user.printerID,
    //                                                userConfiguration: user.userConfiguration
    //                                            }, null);
    //                                        }).catch((err) => {
    //                                            console.trace();
    //                                            console.error(err);
    //                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: { token, userid: user.id } });
    //                                        });
    //                                    } else {
    //                                        // [S] add log for timeline of user                                        
    //                                        var TimelineController = require('../../timeline/controllers/TimelineController');
    //                                        let objEvent = {
    //                                            userID: (req.user && req.user.id) ? req.user.id : user.id,
    //                                            eventTitle: COMMON.stringFormat(timelineObj.title),
    //                                            eventDescription: COMMON.stringFormat(timelineObj.description, user.username),
    //                                            refTransTable: null,
    //                                            refTransID: null,
    //                                            eventType: timelineObj.id,
    //                                            url: null,
    //                                            eventAction: null
    //                                        };
    //                                        req.objEvent = objEvent;
    //                                        req.body.isLatestAgreeemnt = false;
    //                                        return TimelineController.createTimeline(req).then((response) => {
    //                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
    //                                                token, isLatestAgreeemnt: false, userid: user.id, employee: user.employee, roles: user.roles, userAgreement: user.user_agreement, userName: user.username, defaultLoginRoleID: user.defaultLoginRoleID, printerID: user.printerID,
    //                                                userConfiguration: user.userConfiguration
    //                                            }, null);
    //                                        }).catch((err) => {
    //                                            console.trace();
    //                                            console.error(err);
    //                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                                        });
    //                                        // [E] add log for timeline of user
    //                                    }
    //                                } else {
    //                                    // [S] add log for timeline of user                                        
    //                                    var TimelineController = require('../../timeline/controllers/TimelineController');
    //                                    let objEvent = {
    //                                        userID: (req.user && req.user.id) ? req.user.id : user.id,
    //                                        eventTitle: COMMON.stringFormat(timelineObj.title),
    //                                        eventDescription: COMMON.stringFormat(timelineObj.description, user.username),
    //                                        refTransTable: null,
    //                                        refTransID: null,
    //                                        eventType: timelineObj.id,
    //                                        url: null,
    //                                        eventAction: null
    //                                    };
    //                                    req.objEvent = objEvent;
    //                                    return TimelineController.createTimeline(req).then((response) => {
    //                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
    //                                            token, isLatestAgreeemnt: true, userid: user.id, employee: user.employee, roles: user.roles, userAgreement: user.user_agreement, userName: user.username, defaultLoginRoleID: user.defaultLoginRoleID, printerID: user.printerID,
    //                                            userConfiguration: user.userConfiguration
    //                                        }, null);
    //                                    }).catch((err) => {
    //                                        console.trace();
    //                                        console.error(err);
    //                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                                    });
    //                                    // [E] add log for timeline of user
    //                                }
    //                            }).catch((err) => {
    //                                console.trace();
    //                                console.error(err);
    //                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                            });
    //                        } else {
    //                            COMMON.setModelCreatedByFieldValue(req);
    //                            let obj = {
    //                                userID: user.id,
    //                                agreementID: agreementID,
    //                                signaturevalue: signaturevalue,
    //                                createdBy: user.id,
    //                                updatedBy: user.id
    //                            }
    //                            return UserAgreement.create(obj, {
    //                            }).then((agreement) => {
    //                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
    //                                    token, userid: user.id, employee: user.employee, roles: user.roles, userAgreement: user.user_agreement, userName: user.username, defaultLoginRoleID: user.defaultLoginRoleID, printerID: user.printerID,
    //                                    userConfiguration: user.userConfiguration
    //                                }, null);
    //                            }).catch((err) => {
    //                                console.trace();
    //                                console.error(err);
    //                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: { token, userid: user.id } });
    //                            });
    //                        }
    //                    }
    //                }).catch((err) => {
    //                    if (err instanceof NotMatchingPassword || err instanceof NotFound) {
    //                        if (req.body.isCheckForTimeout) {
    //                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
    //                        } else {
    //                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT, err: null, data: null });
    //                        }
    //                    } else {
    //                        console.trace();
    //                        console.error(err);
    //                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: { token, userid: user.id } });
    //                    }
    //                });
    //        } else {
    //            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT, err: null, data: null });
    //        }
    //    }).catch((err) => {
    //        if (err instanceof NotMatchingPassword || err instanceof NotFound) {
    //            if (req.body.isCheckForTimeout) {
    //                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
    //            } else {
    //                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT, err: null, data: null });
    //            }
    //        } else {
    //            console.trace();
    //            console.error(err);
    //            // TODO: handle specific errors here
    //            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.INTERNAL_SERVER_ERROR, STATE.FAILED, new ServerError());
    //        }
    //    });
    //},

    //[PP] : Login with userID from Identity Server
    loginWithIdentityUserId: (req, res) => {
        const { User, Employee, Role, UserConfiguration, sequelize, UserPrefConfigurationMst } = req.app.locals.models;
        req.body.userId = COMMON.DECRYPT_AES(req.body.userId);
        User.findOne({
            where: {
                IdentityUserId: req.body.userId
            },
            attributes: ['id', 'username', 'passwordDigest', 'employeeID', 'defaultLoginRoleID', 'printerID', 'onlineStatus'],
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'email', 'lastName', 'profileImg', 'logoutIdleTime', 'initialName'],
                    where:
                    {
                        isActive: true
                    },
                    required: true
                },
                {
                    model: Role,
                    as: 'roles',
                    attributes: ['id', 'name', 'slug', 'accessLevel'],
                    required: false,
                    through: {
                        where: {
                            deletedAt: null
                        }
                    }
                },
                {
                    model: UserConfiguration,
                    as: 'userConfiguration',
                    attributes: ['userId', 'configurationID', 'configurationValue'],
                    required: false,
                    include: [{
                        model: UserPrefConfigurationMst,
                        as: 'userPrefConfigurationMst',
                        attributes: ['configCode'],
                        required: false
                    }]
                }]
        }).then((user) => {
            if (!user) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            }
            const promises = [];
            if (user.id && user.defaultLoginRoleID) {
                promises.push(sequelize.query('CALL Sproc_GetUserPageFeaturesDetails (:puserID, :proleID)', {
                    replacements: {
                        puserID: user.id,
                        proleID: user.defaultLoginRoleID
                    },
                    type: sequelize.QueryTypes.SELECT
                }));
            }
            return Promise.all(promises).then((featurePageDetail) => {
                // [S] add log for timeline of user
                var TimelineController = require('../../timeline/controllers/TimelineController');
                let objEvent = {
                    userID: (req.user && req.user.id) ? req.user.id : user.id,
                    eventTitle: COMMON.stringFormat(timelineObj.title),
                    eventDescription: COMMON.stringFormat(timelineObj.description, user.username),
                    refTransTable: null,
                    refTransID: null,
                    eventType: timelineObj.id,
                    url: null,
                    eventAction: null
                };
                req.objEvent = objEvent;
                return TimelineController.createTimeline(req).then((response) => {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        userid: user.id,
                        employee: user.employee,
                        roles: user.roles,
                        userName: user.username,
                        featurePageDetail: (featurePageDetail.length > 0 && Array.isArray(featurePageDetail[0])) ? featurePageDetail[0][0] : null,
                        defaultLoginRoleID: user.defaultLoginRoleID,
                        printerID: user.printerID,
                        userConfiguration: user.userConfiguration,
                        onlineStatus: user.onlineStatus
                    }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
                // [E] add log for timeline of user
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            // TODO: handle specific errors here
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.INTERNAL_SERVER_ERROR, STATE.FAILED, new ServerError());
        });
    },

    logout: (req, res) => {
        if (req.body) {
            // [S] add log for timeline of user
            var TimelineController = require('../../timeline/controllers/TimelineController');
            const objEvent = {
                userID: req.body.userID,
                eventTitle: COMMON.stringFormat(timelineLogOutObj.title),
                eventDescription: COMMON.stringFormat(timelineLogOutObj.description, req.body.username),
                refTransTable: null,
                refTransID: null,
                eventType: timelineLogOutObj.id,
                url: null,
                eventAction: null
            };
            req.objEvent = objEvent;
            return TimelineController.createTimeline(req).then((response) => {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body.username, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
            // [E] add log for timeline of user
        }
    }
};
