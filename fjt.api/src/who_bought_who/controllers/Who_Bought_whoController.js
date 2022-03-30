const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const whoBoughtWhoModuleName = DATA_CONSTANT.WHO_BOUGHT_WHO.DISPLAYNAME;

const inputFields = [
    'id',
    'buyBy',
    'buyTo',
    'buyDate',
    'copyMfgPN',
    'description',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];


module.exports = {
    // Retrive list of who bought who
    // POST : /api/v1/whoBoughtWho/retriveWhoBoughtWhoList
    // @return list of who bought who
    retriveWhoBoughtWhoList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetWhoBoughtWho (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)',
            {
                replacements: {
                    ppageIndex: req.body.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            })
            .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { whoboughtwho: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Retrive list of who bought who
    // GET : /api/v1/whoBoughtWho/retriveWhoBoughtWho
    // @return list of who bought who
    retriveWhoBoughtWho: (req, res) => {
        const { WhoBoughtWho } = req.app.locals.models;
        if (req.query.id) {
            return WhoBoughtWho.findOne({
                where: { id: req.query.id }
            }).then((whoBoughtWho) => {
                if (!whoBoughtWho) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, whoBoughtWho, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Create new who bought who
    // POST : /api/v1/whoBoughtWho/saveWhoBoughtWho
    // @return API response
    saveWhoBoughtWho: (req, res) => {
        const { sequelize, User, UsersRoles, Role, WhoBoughtWho, MfgCodeMst } = req.app.locals.models;
        if (req.body) {
            const userID = COMMON.getRequestUserID(req);
            if (req.body.UserPassword) {
                req.body.UserPassword = COMMON.DECRYPT_AES(req.body.UserPassword);
                const userRoles = [DATA_CONSTANT.USER_ROLE.SUPER_ADMIN.NAME, DATA_CONSTANT.USER_ROLE.EXECUTIVE.NAME];

                return User.findOne({
                    attributes: ['id', 'passwordDigest'],
                    where: {
                        id: userID
                    },
                    include: [
                        {
                            model: UsersRoles,
                            as: 'users_roles',
                            attributes: ['userId', 'roleId'],
                            include: [
                                {
                                    model: Role,
                                    as: 'role',
                                    attributes: ['id'],
                                    where: {
                                        name: { [Op.in]: userRoles }
                                    },
                                    required: true
                                }],
                            required: true

                        }]
                }).then((user) => {
                    if (user) {
                        return user.authenticate(req.body.UserPassword).then(() => {
                            var where = { buyTo: { [Op.in]: [req.body.buyTo, req.body.buyBy] } };
                            if (req.body.id) { where.id = { [Op.ne]: req.body.id }; }
                            return WhoBoughtWho.findOne({
                                where: where,
                                include: [{
                                    model: MfgCodeMst,
                                    as: 'mfgCodeBy',
                                    attributes: ['id', 'mfgCode'],
                                    required: false
                                },
                                {
                                    model: MfgCodeMst,
                                    as: 'mfgCodeTo',
                                    attributes: ['id', 'mfgCode'],
                                    required: false
                                }]
                            }).then((response) => {
                                if (!response) {
                                    return sequelize.transaction().then(() => {
                                        COMMON.setModelCreatedByFieldValue(req);
                                        WhoBoughtWho.create(req.body, {
                                            fields: inputFields
                                        }).then((whoBoughtWho) => {
                                            sequelize.query('CALL Sproc_UpdateAcquisitionDetails (:buyToId,:puserID,:pRoleId)',
                                                {
                                                    replacements: {
                                                        buyToId: req.body.buyTo,
                                                        puserID: userID,
                                                        pRoleId: req.user.defaultLoginRoleID
                                                    }
                                                })
                                                .then(() => {
                                                    // Add Merger & Acquisition Detail into Elastic Search Engine for Enterprise Search
                                                    req.params = { pId: whoBoughtWho.id };
                                                    // Add Merger & Acquisition Detail into Elastic Search Engine for Enterprise Search
                                                    // Need to change timeout code due to trasaction not get updated record
                                                    setTimeout(() => {
                                                        EnterpriseSearchController.manageMergerAcquisitionInElastic(req);
                                                    }, 2000);
                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, whoBoughtWho, MESSAGE_CONSTANT.CREATED(whoBoughtWhoModuleName));
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                });
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                } else {
                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.WHO_BOUGHT_WHO_ALREADY_BUY);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, response.mfgCodeTo.mfgCode, response.mfgCodeBy.mfgCode);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                                    // if (req.body.id) {
                                    //     resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.NOT_UPDATED(COMMON.stringFormat(MESSAGE_CONSTANT.WHO_BOUGHT_WHO.ALREADY_BUY, response.mfgCodeTo.mfgCode, response.mfgCodeBy.mfgCode)));
                                    // } else {
                                    //     resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.NOT_CREATED(COMMON.stringFormat(MESSAGE_CONSTANT.WHO_BOUGHT_WHO.ALREADY_BUY, response.mfgCodeTo.mfgCode, response.mfgCodeBy.mfgCode)));
                                    // }
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch(() => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_PASSWORD_INCORRECT, err: null, data: null })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT, err: null, data: null });
                    }
                }).catch(() => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT, err: null, data: null })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of who bought who
    // GET : /api/v1/whoBoughtWho/getMfgBuyToList
    // @return list of who bought who
    getMfgBuyToList: (req, res) => {
        const { WhoBoughtWho } = req.app.locals.models;
        WhoBoughtWho.findAll({
            attributes: ['buyTo']
        }).then((buyTo) => {
            if (!buyTo) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, MESSAGE_CONSTANT.NOT_FOUND(whoBoughtWhoModuleName));
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, buyTo, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    getAcquisitionDetails: (req, res) => {
        const sequelize = req.app.locals.models.sequelize;
        sequelize
            .query('CALL Sproc_GetAcquisitionDetails (:pBuyToID)',
                { replacements: { pBuyToID: (req.body.listObj.buyToID || req.body.listObj.buyToID === 0) ? req.body.listObj.buyToID : null } })
            .then(acquisition => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, acquisition)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    }
};