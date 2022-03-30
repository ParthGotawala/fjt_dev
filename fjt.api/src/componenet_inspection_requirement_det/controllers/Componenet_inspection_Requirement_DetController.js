const _ = require('lodash');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
const { Op } = require('sequelize');

const ComponenetInspectionRequirementDetModuleName = DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.Name;
const inputFields = [
    'id',
    'partId',
    'inspectionRequirementId',
    'createdBy',
    'createdAt',
    'createByRoleId',
    'updatedBy',
    'updatedAt',
    'updateByRoleId',
    'isDeleted',
    'deletedAt',
    'deletedBy',
    'deleteByRoleId',
    'category'
];

module.exports = {

    // Get List of Purchase Inspection Requirement
    // POST : /api/v1/comp_inspect_req_det/getAllPurchaseInspectionRequirement
    // @return retrive list of Purchase Inspection Requirement
    getAllPurchaseInspectionRequirement: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrievePurchaseInspectionRequirementList (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartId,:pCategory)', {
                replacements: {
                    pPageIndex: req.body.Page,
                    pRecordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pPartId: req.body.partId || null,
                    pCategory: req.body.category || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    PurchaseInspectionRequirementList: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
                }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                );
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Remove Purchase Inspection Requirement
    // POST : /api/v1/comp_inspect_req_det/deletePurchaseInspectionRequirement
    // @return status of deleted record
    deletePurchaseInspectionRequirement: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.PurchaseInspectionRequirement.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(ComponenetInspectionRequirementDetModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: response, IDs: req.body.objIDs.id }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Add Purchase Inspection Requirement
    // POST : /api/v1/comp_inspect_req_det/addPurchaseInspectionRequirement
    // @return status of add record
    addPurchaseInspectionRequirement: (req, res) => {
        const {
            ComponenetInspectionRequirementDet,
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            let inspectionRequirementList = [];
            let finalInspectionRequirementList = [];
            const whareClaus = {
                partId: req.body.partId,
                category: req.body.category
            };
            if (req.body.category && Array.isArray(req.body.category)) {
                inspectionRequirementList = _.map(req.body.category, data => (
                    _.map(req.body.inspectionRequirementList, (item) => {
                        item.category = data;
                        return Object.assign({}, item);
                    })
                ));
                inspectionRequirementList = inspectionRequirementList.flat();
                whareClaus.category = {
                    [Op.in]: req.body.category
                };
            } else {
                inspectionRequirementList = _.map(req.body.inspectionRequirementList, (item) => {
                    item.category = req.body.category;
                    return Object.assign({}, item);
                });
            }

            const insertRecord = (t) => {
                const inspectionList = _.map(finalInspectionRequirementList, data => ({
                    partId: req.body.partId,
                    inspectionRequirementId: data.inspectionRequirementId,
                    category: data.category
                }));
                req.body.inspectionList = inspectionList;
                COMMON.setModelCreatedArrayFieldValue(req.user, req.body.inspectionList);
                ComponenetInspectionRequirementDet.bulkCreate(req.body.inspectionList, {
                    fields: inputFields,
                    transaction: t
                }).then(() => {
                    t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(ComponenetInspectionRequirementDetModuleName)))
                    .catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            };

            // If Merge the record (Duplicate record not ignore and add new record)
            if (req.body.isMerge) {
                return sequelize.transaction().then((t) => {
                    ComponenetInspectionRequirementDet.findAll({
                        where: whareClaus,
                        attributes: ['id', 'partId', 'inspectionRequirementId', 'category']
                    }).then((response) => {
                        if (response && response.length > 0) {
                            const oldInspectionRequirementList = response;
                            const newInspectionRequirementList = inspectionRequirementList;
                            _.each(newInspectionRequirementList, (data) => {
                                const findObj = _.find(oldInspectionRequirementList, item => item.inspectionRequirementId === data.inspectionRequirementId && item.category === data.category);
                                if (!findObj) {
                                    finalInspectionRequirementList.push(data);
                                }
                            });
                        } else {
                            finalInspectionRequirementList = inspectionRequirementList;
                        }
                        insertRecord(t);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                // If Override the record (Replace all old entry with new entry)
                return sequelize.transaction().then((t) => {
                    COMMON.setModelDeletedByFieldValue(req);
                    whareClaus.isDeleted = 0;
                    ComponenetInspectionRequirementDet.update(req.body, {
                        where: whareClaus,
                        fields: ['isDeleted', 'deletedAt', 'deletedBy', 'deleteByRoleId', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                        transaction: t
                    }).then(() => {
                        finalInspectionRequirementList = inspectionRequirementList;
                        insertRecord(t);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get Purchase Inspection Requirement By PartId
    // POST : /api/v1/comp_inspect_req_det/getPurchaseInspectionRequirementByPartId
    // @return list of add purchase inspection requirement
    getPurchaseInspectionRequirementByPartId: (req, res) => {
        const {
            ComponenetInspectionRequirementDet,
            InspectionMst
        } = req.app.locals.models;

        if (req.body) {
            return ComponenetInspectionRequirementDet.findAll({
                where: {
                    partId: req.body.partId,
                    category: req.body.category
                },
                attributes: ['id', 'partId', 'inspectionRequirementId', 'category'],
                include: [{
                    model: InspectionMst,
                    as: 'inspectionmst',
                    attributes: ['id', 'requirement', 'requiementType'],
                    required: false,
                    where: {
                        isActive: true
                    }
                }]
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                );
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    },
    // Get Part Master Comments
    // POST : /api/v1/comp_inspect_req_det/getPartMasterCommentsByPartId
    // @return list of add comments based on category
    getPartMasterCommentsByPartId: (req, res) => {
        const {
            ComponenetInspectionRequirementDet,
            InspectionMst
        } = req.app.locals.models;

        if (req.body) {
            const whereClause = {};

            if (req.body.requiementType) {
                whereClause.requiementType = req.body.requiementType;
            }
            return ComponenetInspectionRequirementDet.findAll({
                where: {
                    partId: req.body.partId,
                    category: req.body.category
                },
                attributes: ['id', 'partId', 'inspectionRequirementId', 'category'],
                include: [{
                    model: InspectionMst,
                    as: 'inspectionmst',
                    where: whereClause,
                    attributes: ['id', 'requirement', 'requiementType'],
                    required: req.body.requiementType ? true : false
                }]
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                );
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    }
};