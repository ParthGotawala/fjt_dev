const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotCreate } = require('../../errors');

const timelineObjForWoOpDlRole = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_DATAELEMENT_ROLE;
const WoOpDlRoleConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_DATAELEMENT_ROLE;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const moduleName = DATA_CONSTANT.WORKORDER_OPERATION_DATAELEMENT_ROLE.Name;

module.exports = {

    // Create or update workorder operation dataelement roles.
    saveWorkorderOperationDataelement_Role: (req, res) => {
        const { WorkorderOperationDataelementRole, sequelize } = req.app.locals.models;
        const roleId = [];
        let removeIds;
        let createIds;
        const promises = [];
        if (req.body && req.body.listObj) {
            _.each(req.body.listObj.roleList, (item) => {
                if (item.id) {
                    roleId.push(item.id);
                }
            });
            // find in database to check already created roles.
            return WorkorderOperationDataelementRole.findAll({
                where: {
                    woOpDataElementID: req.body.listObj.woOpDataElementID,
                    isDeleted: false
                }
            }).then((roleData) => {
                if (roleData) {
                    const roleIds = [];
                    _.each(roleData, (item) => {
                        if (item.roleID) {
                            roleIds.push(item.roleID);
                        }
                    });
                    removeIds = _.difference(roleIds, roleId);
                    createIds = _.difference(roleId, roleIds);

                    const woopDataelementRoleList = [];
                    _.each(createIds, (itemData) => {
                        const obj = {};
                        obj.woOpDataElementID = req.body.listObj.woOpDataElementID;
                        obj.roleID = itemData;
                        obj.createdBy = req.user.id;
                        woopDataelementRoleList.push(obj);
                    });
                    // Create roles if it's not created.
                    return sequelize.transaction().then(t => WorkorderOperationDataelementRole.bulkCreate(
                        woopDataelementRoleList,
                        {
                            individualHooks: true,
                            transaction: t
                        }
                    ).then((bulkRoleData) => {
                        if (woopDataelementRoleList.length > 0 && bulkRoleData && bulkRoleData.length > 0) {
                            // [S] add log of adding role for data element of operation in work order for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: WoOpDlRoleConstObj.CREATE.title,
                                eventDescription: COMMON.stringFormat(WoOpDlRoleConstObj.CREATE.description, req.body.listObj.opName, req.body.listObj.woNumber, req.user.username),
                                refTransTable: WoOpDlRoleConstObj.refTransTableName,
                                refTransID: _.map(bulkRoleData, 'woOPDataElementRoleID').toString(),
                                eventType: timelineObjForWoOpDlRole.id,
                                url: COMMON.stringFormat(WoOpDlRoleConstObj.CREATE.url, req.body.listObj.woOPID),
                                eventAction: timelineEventActionConstObj.CREATE
                            };
                            req.objEvent = objEvent;
                            // [E] add log of adding role for data element of operation in work order for timeline users
                            promises.push(TimelineController.createTimeline(req, res, t));
                        }
                        COMMON.setModelDeletedByFieldValue(req);
                        promises.push(
                            // Delete roles from database.
                            WorkorderOperationDataelementRole.update({
                                deletedBy: req.body['deletedBy'],
                                deletedAt: req.body['deletedAt'],
                                isDeleted: req.body['isDeleted']
                            }, {
                                where: {
                                    roleID: { [Op.in]: removeIds },
                                    woOpDataElementID: req.body.listObj.woOpDataElementID,
                                    deletedAt: null
                                },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted'],
                                transaction: t
                            }));

                        if (removeIds) {
                            // [S] add log of removing role for data element of operation in work order for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: WoOpDlRoleConstObj.DELETE.title,
                                eventDescription: COMMON.stringFormat(WoOpDlRoleConstObj.DELETE.description, req.body.listObj.opName, req.body.listObj.woNumber, req.user.username),
                                refTransTable: WoOpDlRoleConstObj.refTransTableName,
                                refTransID: removeIds.toString(),
                                eventType: timelineObjForWoOpDlRole.id,
                                url: COMMON.stringFormat(WoOpDlRoleConstObj.DELETE.url, req.body.listObj.woOPID),
                                eventAction: timelineEventActionConstObj.DELETE
                            };
                            req.objEvent = objEvent;
                            promises.push(TimelineController.createTimeline(req, res, t));
                            // [E] add log of removing role for data element of operation in work order for timeline users
                        }

                        return Promise.all(promises).then(() =>
                            t.commit().then(() => resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(moduleName)))
                        ).catch((err) => {
                            if (!t.finished) t.rollback();
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) t.rollback();
                        if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }
                    })
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(moduleName), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    getRolesListBywoOpDataelementWise: (req, res) => {
        const { WorkorderOperationDataelementRole } = req.app.locals.models;
        if (req.params.woOpDataElementID) {
            WorkorderOperationDataelementRole.findAll({
                where: {
                    woOpDataElementID: req.params.woOpDataElementID
                }
            }).then(roleData => resHandler.successRes(res, 200, STATE.SUCCESS, roleData, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200,
                    STATE.EMPTY,
                    new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
            });
        }
    },
    getwoOpDataelementListRoleWise: (req, res) => {
        const { WorkorderOperationDataelementRole } = req.app.locals.models;
        if (req.params.roleID) {
            WorkorderOperationDataelementRole.findAll({
                where: {
                    roleID: req.params.roleID
                }
            }).then(roleData => resHandler.successRes(res, 200, STATE.SUCCESS, roleData, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200,
                    STATE.EMPTY,
                    new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
            });
        }
    },
    getAllwoOpDataElementRoleData: (req, res) => {
        const { WorkorderOperationDataelementRole } = req.app.locals.models;
        WorkorderOperationDataelementRole.findAll({
            where: {
                deletedAt: null
            }
        }).then(roleData => resHandler.successRes(res, 200, STATE.SUCCESS, roleData, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200,
                STATE.EMPTY,
                new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
        });
    },

    deleteWoOpdataElmentRoles: (req, res) => {
        const { WorkorderOperationDataelementRole } = req.app.locals.models;
        if (req.body.woOpDataElementID) {
            COMMON.setModelDeletedByFieldValue(req);
            WorkorderOperationDataelementRole.update({
                deletedBy: req.body['deletedBy'],
                deletedAt: req.body['deletedAt'],
                isDeleted: req.body['isDeleted']
            }, {
                where: {
                    woOpDataElementID: { [Op.in]: req.body.woOpDataElementID },
                    deletedAt: null
                },
                fields: ['deletedBy', 'deletedAt', 'isDeleted']
            }).then(roleData => resHandler.successRes(res, 200, STATE.SUCCESS, roleData, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200,
                    STATE.EMPTY,
                    new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
            });
        }
    }
};