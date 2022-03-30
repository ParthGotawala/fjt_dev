const resHandler = require('../../resHandler');
const {
    USER,
    STATE,
    COMMON
} = require('../../constant');
const _ = require('lodash');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const uuidv1 = require('uuid/v1');
const { Op } = require('sequelize');
const configData = require('../../../config/config.js');
var CryptoJS = require("crypto-js");

// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt'); //eslint-disable-next-line
const { validateuserPassword } = require('../../Identity/IdentityApiHandler');
const SendMailTemplateController = require('../../send_mail_template/controllers/Send_Mail_TemplateController');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');
const {
    NotMatchingPassword,
    NotFound
} = require('../../errors');
const bcrypt = require('bcryptjs');

const inputFields = ['username',
    'password',
    'passwordConfirmation',
    'passwordDigest',
    'emailAddress',
    'firstName',
    'lastName',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'forGotPasswordToken',
    'tokenGenerationDateTime',
    'defaultLoginRoleID'
];
const usersRolesFields = [
    'userId',
    'roleId',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt'
];
module.exports = {

    retrieveUser: (req, res) => {
        const {
            User,
            UsersRoles
        } = req.app.locals.models;
        const userData = {};
        if (req.params.id) {
            User.findAll({
                where: {
                    id: req.params.id,
                    isDeleted: false
                }
            }).then((user) => {
                if (!user) {
                    return Promise.reject(USER.NOT_FOUND);
                } else {
                    userData.user = user;
                    return UsersRoles.findAll({
                        where: {
                            userId: req.params.id
                        }
                    }).then((userRole) => {
                        userData.userRole = userRole;
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, userData, null);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            /* Call common ui grid filter function */
            const filter = COMMON.UiGridFilterSearch(req);

            User.findAndCountAll(filter).then(users => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                users: users.rows,
                Count: users.count
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }
    },


    createUser: (req, res) => {
        const {
            User,
            sequelize
        } = req.app.locals.models;

        COMMON.setModelCreatedByFieldValue(req);
        if (req.body.password) {
            if (req.body.password !== req.body.passwordConfirmation) {
                throw new Error('Password confirmation doesn\'t match Password');
            }
            req.body.passwordDigest = bcrypt.hashSync(req.body.password, 10);
        }
        return sequelize.transaction(t => (
            User.create(req.body, {
                fields: inputFields
            }, {
                transaction: t
            })
        ))
            .then(user => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, user, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err.errors.map(e => e.message).join(','),
                        data: null
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
                }
            });
    },

    updateUser: (req, res) => {
        const {
            User,
            sequelize
        } = req.app.locals.models;

        req.body.password = COMMON.DECRYPT_AES(req.body.password);
        req.body.passwordConfirmation = COMMON.DECRYPT_AES(req.body.passwordConfirmation);

        if (req.body.password !== req.body.passwordConfirmation) {
            throw new Error('Password confirmation doesn\'t match Password');
        }

        req.body.passwordDigest = bcrypt.hashSync(req.body.password, 10);

        if (req.params.id && req.body.password && req.body.passwordConfirmation) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.transaction(t =>
                User.update(req.body, {
                    where: {
                        id: req.params.id
                    },
                    fields: inputFields
                }, {
                    transaction: t
                })
            ).then((user) => {
                if (user) {
                    const obj = {
                        userID: req.params.id,
                        empID: null
                    };
                    RFQSocketController.logOutUserFromAllDevices(req, obj);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { id: req.params.id }, MESSAGE_CONSTANT.MASTER.EMPLOYEE_CREDENTIAL_UPDATED);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.MASTER.PASSWORD_NOT_UPDATED,
                        err: null,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
        }
    },

    deleteUser: (req, res) => {
        if (req.params.id) {
            const userIds = req.params.id.split(',') || [];
            const User = req.app.locals.models.User;
            COMMON.setModelDeletedByFieldValue(req);

            return User.update(req.body, {
                where: {
                    id: userIds,
                    deletedAt: null
                },
                fields: inputFields
            }).then((rowsDeleted) => {
                if (rowsDeleted) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.USER_DELETED);
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.MASTER.USER_NOT_DELETED,
                    err: null,
                    data: null
                });
            })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    assignRolePermissionToUser: (req, res) => {
        const {
            User,
            Sequelize,
            sequelize,
            UsersRoles
        } = req.app.locals.models;
        if (req.body && req.body.userID) {
            return sequelize.transaction(t => (
                User.findByPk(req.body.userID, {}, {
                    transaction: t
                })
            )
                .then((user) => {
                    const promises = [];
                    promises.push(Promise.resolve(user));

                    // added by vaibhav shah for user not created issue
                    let NewData;
                    let removeData;
                    // let Newdata = [];
                    UsersRoles.findAll({
                        where: {
                            isDeleted: false,
                            userId: req.body.userID
                        },
                        attributes: ['userId', 'roleId']
                    }).then((userData) => {
                        if (userData) {
                            const role = _.map(userData, 'roleId');
                            NewData = _.difference(req.body.roles, role);
                            removeData = _.difference(role, req.body.roles);
                        }

                        if (removeData.length > 0) {
                            _.each(removeData, (r) => {
                                const obj = {};
                                obj.deletedBy = req.user.id;
                                obj.isDeleted = true;
                                obj.deletedAt = Sequelize.fn('NOW');
                                promises.push(UsersRoles.update(obj, {
                                    where: {
                                        userId: req.body.userID,
                                        roleId: r
                                    },
                                    fields: ['deletedAt', 'deletedBy', 'isDeleted']
                                }).then(response => Promise.resolve(response)));
                            });
                        }
                        if (NewData.length > 0) {
                            _.each(NewData, (rID) => {
                                const obj = {};
                                obj.roleId = rID;
                                obj.userId = req.body.userID;
                                obj.createdBy = req.user.id;
                                promises.push(UsersRoles.create(obj, {
                                    fields: usersRolesFields
                                }).then(response => Promise.resolve(response)));
                            });
                        }
                    });
                    return Promise.all(promises);
                }))
                .then(user => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, user, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    getUserList: (req, res) => {
        const User = req.app.locals.models.User;
        User.findAll({
            attributes: ['id', 'username', 'IdentityUserId', 'firstName', 'employeeID', 'lastName'],
            order: [
                ['username', 'ASC']
            ]
        }).then((users) => {
            if (!users) {
                return Promise.reject(USER.NOT_FOUND);
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, users, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            // TODO: handle specific errors here
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },


    //forgotUserPassword: (req, res) => {
    //    req.body.userName = COMMON.DECRYPT_AES(req.body.userName);
    //    const {
    //        User,
    //        Employee,
    //        Role
    //    } = req.app.locals.models;
    //    let userDetails = null;
    //    User.findOne({
    //        where: {
    //            [Op.or]: [
    //                { username: req.body.userName },
    //                { emailAddress: req.body.userName }
    //            ]
    //        },
    //        // where: {
    //        //     username: req.body.userName
    //        // },
    //        attributes: ['id', 'username', 'emailAddress'],
    //        include: [{
    //            model: Employee,
    //            as: 'employee',
    //            attributes: ['id', 'isActive'],
    //            required: true
    //        }]
    //    }).then((user) => {
    //        if (!user) {
    //            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                messageContent: MESSAGE_CONSTANT.MASTER.INVALID_USER,
    //                err: null,
    //                data: null
    //            });
    //        } else if (!user.dataValues.employee.dataValues.isActive) {
    //            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                messageContent: MESSAGE_CONSTANT.MASTER.INACTIVE_ACCOUNT,
    //                err: null,
    //                data: null
    //            });
    //        } else {
    //            userDetails = user.dataValues;
    //            const forGotPasswordToken = uuidv1();
    //            const updateTokenObj = {
    //                forGotPasswordToken: forGotPasswordToken,
    //                tokenGenerationDateTime: COMMON.getCurrentUTC(),
    //                updateBy: userDetails.id
    //            };
    //            return User.update(updateTokenObj, {
    //                where: {
    //                    id: userDetails.id
    //                },
    //                fields: ['forGotPasswordToken', 'tokenGenerationDateTime', 'updateBy']
    //            }).then(() => {
    //                if (userDetails.emailAddress) {
    //                    /* send mail to user if contain email address */
    //                    const mailTemplateDetails = {};
    //                    mailTemplateDetails.LinkURL = COMMON.stringFormat('{0}/#!/resetpassword/{1}', configData.WebsiteBaseUrl, forGotPasswordToken);
    //                    mailTemplateDetails.AgreementTypeID = COMMON.AgreementTemplateType.ForgotPassword;
    //                    mailTemplateDetails.UserName = COMMON.stringFormat('{0} ({1})', userDetails.username, userDetails.emailAddress);
    //                    mailTemplateDetails.ToEmailAddress = userDetails.emailAddress;
    //                    mailTemplateDetails.CompanyLogo = configData.WebsiteBaseUrl + configData.CompanyLogoImage;
    //                    SendMailTemplateController.setandSendMailTemplate(req, mailTemplateDetails).then((response) => {
    //                        if (response) {
    //                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.CHECK_MAIL_FOR_RESET_PASSWORD);
    //                            messageContent.displayDialog = true;
    //                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { type: 1 }, messageContent);
    //                        } else {
    //                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                                messageContent: MESSAGE_CONSTANT.MASTER.EMAIL_SEND_FAILED,
    //                                err: null,
    //                                data: null
    //                            });
    //                        }
    //                    }).catch((err) => {
    //                        console.trace();
    //                        console.error(err);
    //                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                            err: err,
    //                            data: null
    //                        });
    //                    });
    //                } else {
    //                    /* send mail to all super admin if user not contain email address */
    //                    User.findAll({
    //                        attributes: ['username', 'emailAddress'],
    //                        include: [{
    //                            model: Role,
    //                            as: 'roles',
    //                            attributes: ['id'],
    //                            required: true,
    //                            where: {
    //                                name: {
    //                                    [Op.in]: ['Super Admin']
    //                                }
    //                            },
    //                            through: {
    //                                where: {
    //                                    deletedAt: null
    //                                }
    //                            }
    //                        }]
    //                    }).then((superAdminUsers) => {
    //                        if (superAdminUsers && superAdminUsers.length > 0) {
    //                            const promiseEmailArr = [];
    //                            _.each(superAdminUsers, (superAdminUser) => {
    //                                if (superAdminUser.emailAddress) {
    //                                    const superAdminUserDet = superAdminUser.dataValues;
    //                                    const mailTemplateDetails = {};
    //                                    mailTemplateDetails.LinkURL = COMMON.stringFormat('{0}/#!/resetpassword/{1}', configData.WebsiteBaseUrl, forGotPasswordToken);
    //                                    mailTemplateDetails.AgreementTypeID = COMMON.AgreementTemplateType.ForgotPassword;
    //                                    mailTemplateDetails.UserName = userDetails.username;
    //                                    mailTemplateDetails.ToEmailAddress = superAdminUserDet.emailAddress;
    //                                    mailTemplateDetails.CompanyLogo = configData.WebsiteBaseUrl + configData.CompanyLogoImage;
    //                                    promiseEmailArr.push(SendMailTemplateController.setandSendMailTemplate(req, mailTemplateDetails).then(resp => resp));
    //                                }
    //                            });
    //                            return Promise.all(promiseEmailArr).then(() => {
    //                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.ADMIN_CHECK_MAIL_FOR_RESET_PASSWORD);
    //                                messageContent.displayDialog = true;
    //                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { type: 2 }, messageContent);
    //                            }).catch((err) => {
    //                                console.trace();
    //                                console.error(err);
    //                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                                    err: err,
    //                                    data: null
    //                                });
    //                            });
    //                        } else {
    //                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, MESSAGE_CONSTANT.MASTER.PASSWORD_NOT_UPDATED);
    //                        }
    //                    }).catch((err) => {
    //                        console.trace();
    //                        console.error(err);
    //                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
    //                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                            err: err,
    //                            data: null
    //                        });
    //                    });
    //                }
    //            }).catch((err) => {
    //                console.trace();
    //                console.error(err);
    //                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                    err: err,
    //                    data: null
    //                });
    //            });
    //        }
    //    }).catch((err) => {
    //        console.trace();
    //        console.error(err);
    //        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
    //            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //            err: err,
    //            data: null
    //        });
    //    });
    //},

    getUserDetailsByPasswordToken: (req, res) => {
        if (req.body.forGotPasswordToken) {
            const {
                User
            } = req.app.locals.models;
            return User.findOne({
                where: {
                    forGotPasswordToken: req.body.forGotPasswordToken
                },
                attributes: ['id', 'username', 'tokenGenerationDateTime']
            }).then((userData) => {
                if (!userData || !userData.dataValues.tokenGenerationDateTime) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.MASTER.PASSWORD_RESET_LINK_EXPIRED,
                        err: null,
                        data: null
                    });
                } else {
                    const tokenDate = userData.dataValues.tokenGenerationDateTime;
                    const extendedDate = new Date(userData.dataValues.tokenGenerationDateTime);
                    extendedDate.setHours(tokenDate.getHours() + 24); // add 24 hr to tokenGenerationDateTime for checking expiration link
                    if (extendedDate < new Date()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.MASTER.PASSWORD_RESET_LINK_EXPIRED,
                            err: null,
                            data: null
                        });
                    }
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, userData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    resetUserCredential: (req, res) => {
        req.body.password = COMMON.DECRYPT_AES(req.body.password);
        req.body.passwordConfirmation = COMMON.DECRYPT_AES(req.body.passwordConfirmation);
        if (req.body.userID && req.body.password && req.body.passwordConfirmation) {
            const {
                User
            } = req.app.locals.models;
            req.body.forGotPasswordToken = null;
            req.body.tokenGenerationDateTime = null;
            COMMON.setModelUpdatedByFieldValue(req);
            return User.update(req.body, {
                where: {
                    id: req.body.userID
                },
                fields: inputFields
            }).then((user) => {
                if (user) {
                    const obj = {
                        userID: req.body.userID,
                        empID: null
                    };
                    RFQSocketController.logOutUserFromAllDevices(req, obj);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        updatedUserID: req.body.userID
                    }, MESSAGE_CONSTANT.MASTER.PASSWORD_UPDATED);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.MASTER.PASSWORD_NOT_UPDATED,
                        err: null,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Validate user password
    // GET : /api/v1/users/validatePassword
    // @param {password} user password
    // @return API response
    validatePassword: (req, res) => {
        const {
            User,
            UsersRoles,
            Role
        } = req.app.locals.models;
        const TOKEN = req.headers.authorization;
        var userID = COMMON.getRequestUserID(req);
        User.findOne({
            attributes: ['id', 'passwordDigest', 'IdentityUserId'],
            where: {
                id: userID
            },
            include: [{
                model: UsersRoles,
                as: 'users_roles',
                attributes: ['userId', 'roleId'],
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'accessLevel'],
                    where: {
                        accessLevel: {
                            [Op.lte]: req.body.accessLevel
                        }
                    },
                    required: true
                }],
                required: true
            }]
        }).then((user) => {
            if (user) {
                const userId = COMMON.ENCRYPT_AES(user.IdentityUserId);
                const objScope = {
                    userId: userId.toString(),
                    password: req.body.password
                };
                validateuserPassword(objScope, TOKEN).then((responses) => {
                    const response = JSON.parse(responses);
                    if (response.status === STATE.SUCCESS) {
                        if (response.data && response.data.isMatchPassword) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response.data.isMatchPassword, null);
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.MASTER.USER_PASSWORD_INCORRECT,
                                err: null,
                                data: null
                            });
                        }
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.MASTER.UNAUTHORIZE_USER
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Validate userName and password
    // GET : /api/v1/users/verifyUser
    // @param {password} user password
    // @return API response
    verifyUser: (req, res) => {
        const {
            User,
            Role
        } = req.app.locals.models;
        const TOKEN = req.headers.authorization;

        req.body.username = COMMON.DECRYPT_AES(req.body.username);
        return User.findOne({
            where: {
                username: req.body.username
            },
            attributes: ['id', 'passwordDigest', 'IdentityUserId'],
            include: [{
                model: Role,
                where: {
                    [Op.or]: [{
                        isDeleted: false
                    },
                    {
                        '$roles.UsersRoles.isDeleted$': false
                    }
                    ]
                },
                as: 'roles',
                attributes: ['id', 'accessLevel']
            }]
        }).then((response) => {
            if (response) {
                const userID = response.id;
                const identityUserID = COMMON.ENCRYPT_AES(response.IdentityUserId);
                let allowAccess = false;
                if (!req.body.isSwitchRoleApproval) {
                    _.each(response.roles, (item) => {
                        if (item.accessLevel <= req.body.accessLevel) {
                            allowAccess = true;
                        }
                    });
                }
                if (allowAccess || req.body.isSwitchRoleApproval) {
                    const objScope = {
                        userId: identityUserID.toString(),
                        password: req.body.password
                    };
                    return validateuserPassword(objScope, TOKEN).then((responses) => {
                        const responseobj = JSON.parse(responses);
                        if (responseobj.status === STATE.SUCCESS) {
                            if (responseobj.data && responseobj.data.isMatchPassword) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    userID: userID
                                }, null);
                            } else {
                                const msgContent = req.body.isOnlyPasswordCheck ? MESSAGE_CONSTANT.MASTER.USER_PASSWORD_INCORRECT : MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT;
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: msgContent,
                                    err: null,
                                    data: null
                                });
                            }
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: null,
                                data: null
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.MASTER.UNAUTHORIZE_USER,
                        err: null,
                        data: null
                    });
                }
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT,
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // update user printer and format setting
    // POST : /api/v1/users/updateUserSetting
    // @return API response
    updateUserSetting: (req, res) => {
        const {
            User
        } = req.app.locals.models;
        const userObj = req.body.userObj;
        userObj.updatedBy = req.user.id;
        User.update(userObj, {
            where: {
                id: userObj.id
            },
            fields: ['printerID', 'updatedBy', 'defaultLoginRoleID']
        })
            .then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.USER_SETTING_UPDATED)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
    },


    // update user DefaultRole
    // POST : /api/v1/users/updateUserByDefaultRole
    // @return API response
    updateUserByDefaultRole: (req, res) => {
        const {
            User
        } = req.app.locals.models;

        if (req.body.userObj) {
            COMMON.setModelUpdatedByFieldValue(req);
            const userObj = req.body.userObj;
            return User.update(userObj, {
                where: {
                    id: userObj.id
                },
                fields: ['defaultLoginRoleID', 'updatedBy']
            })
                .then(() => {
                    module.exports.sendNotificationOfDefaultRoleChanges(req, res);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
        }
    },


    // Send Notification of default role login id changes
    // GET : /api/v1//api/v1/rolePagePermision/sendNotificationOfDefaultRoleChanges
    // @return API response
    // eslint-disable-next-line no-unused-vars
    sendNotificationOfDefaultRoleChanges: (req, res) => {
        if (req.body.userObj && req.body.userObj.employeeID) {
            const receiverID = [];
            receiverID.push(parseInt(req.body.userObj.employeeID) || null);
            const data = {
                senderID: req.user.employeeID,
                receiver: receiverID,
                employeeID: req.body.userObj.employeeID,
                roleId: req.body.userObj.defaultLoginRoleID
            };
            const notificationMst = {
                subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DEFAULT_ROLE_CHANGE.SUBJECT),
                messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DEFAULT_ROLE_CHANGE.TYPE,
                messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DEFAULT_ROLE_CHANGE.SUBTYPE,
                jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DEFAULT_ROLE_CHANGE.JSONDATA(data),
                redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DEFAULT_ROLE_CHANGE.REDIRECTURL, data.employeeID),
                isActive: true
            };
            data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DEFAULT_ROLE_CHANGE.MESSAGE);
            NotificationMstController.updateCommonDetails(notificationMst, data);
            NotificationMstController.saveCommNotificationFn(req, notificationMst).then((resp) => {
                if (resp && resp.notificationMst) {
                    req.body.notificationMst = {
                        id: resp.notificationMst.id,
                        senderID: data.senderID
                    };
                }
                req.body.subject = notificationMst.subject;
                RFQSocketController.sendNotificationOfDefaultRoleChanges(req, data);
            }).catch((err) => {
                console.trace();
                console.error(err);
            });
            // return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null);
        }
    },
    // Send Notification for updating user's password from IDS
    // POST : /api/v1/user/updateUserPasswordResponse
    // @return API response
    // eslint-disable-next-line no-unused-vars
    updateUserPasswordResponse: (req, res) => {
        if (req.body.status === 'SUCCESS') {
            const obj = {
                userID: req.body.userid,
                empID: null
            };
            RFQSocketController.logOutUserFromAllDevices(req, obj);
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { id: req.params.id }, MESSAGE_CONSTANT.MASTER.EMPLOYEE_CREDENTIAL_UPDATED);
        } else {
            const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.PASSWORD_NOT_UPDATED);
            messageContent.message = req.body.message;
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: messageContent,
                err: null,
                data: null
            });
        }
    },
    // Send Notification for updating user's password from IDS
    // POST : /api/v1/user/logOutUserFromAllDevices
    // @return API response
    // eslint-disable-next-line no-unused-vars
    logOutUserFromAllDevices: (req, res) => {
        if (req.body.userid) {
            const obj = {
                userID: req.body.userid,
                empID: null
            };
            RFQSocketController.logOutUserFromAllDevices(req, obj);
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { id: req.body.userid });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // reload old pages on override user case.
    // POST : /api/v1/user/reloadPreviousPages
    // @return API response
    reloadPreviousPages: (req, res) => {
        RFQSocketController.reloadPageOnOverrideUser(req, null);
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null);
    },

    // reload old pages on override user case.
    // POST : /api/v1/user/updateLoginuser
    // @return API response
    updateLoginuser: (req, res) => {
        RFQSocketController.updateLoginuser(req, req.body.loginUser);
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null);
    }

    // // sendMail With Attachment
    // // POST : /api/v1/users/sendMailWithAttachement
    // // @return API response
    // sendMailWithAttachement: (req, res) => {
    //     let file = null;
    //     // let SendMailTemplateController = require('../../send_mail_template/controllers/Send_Mail_TemplateController.js');
    //     file = "./uploads/genericfiles/certificate_standards/dd860d30-9bfa-11e9-b5ce-09cd8a02077b.png";

    //     fs.readFile(file, function (err) {
    //         if (err) {
    //             if (err.code === COMMON.FileErrorMessage.NotFound) {
    //                 resHandler.errorRes(res, 404, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
    //             }
    //             else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
    //                 resHandler.errorRes(res, 403, STATE.EMPTY, null);
    //             }
    //         }
    //         else {
    //             // res.setHeader('Content-disposition', 'attachment; filename=' + document.gencOriginalName);
    //             // res.setHeader('Content-type', document.gencFileType);
    //             let filestream = fs.createReadStream(file);
    //             filestream.pipe(res);
    //             let mailTemplateDetails = {};
    //             mailTemplateDetails.AgreementTypeID = COMMON.AgreementTemplateType.ObsoletePartDetailsReport;
    //             mailTemplateDetails.ToEmailAddress = "vaibhav.shah@triveniglobalsoft.com";
    //             mailTemplateDetails.CompanyLogo = configData.WebsiteBaseUrl + configData.CompanyLogoImage;
    //             mailTemplateDetails.file = filestream;
    //             mailTemplateDetails.assemblyName = "SUPER001 Rev A";
    //             mailTemplateDetails.customerCompanyName = "SUPER AC";
    //             mailTemplateDetails.fileName = "File.png";
    //             SendMailTemplateController.setandSendMailTemplate(req, mailTemplateDetails).then((response) => {
    //                 if (response) {
    //                     if (index == superAdminUsers.length - 1) {
    //                         return resHandler.successRes(res, 200, STATE.EMPTY, {
    //                             userMessage: MESSAGE_CONSTANT.USER.CHECK_MAIL_FOR_RESET_PASSWORD
    //                         });
    //                     }
    //                 } else {
    //                     return resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.USER.PASSWORD_NOT_UPDATED);
    //                 }
    //             }).catch((err) => {
    //                 console.trace();
    //                 console.error(err);
    //                 return resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.USER.PASSWORD_NOT_UPDATED);
    //             });
    //         }
    //     });
    // }
};