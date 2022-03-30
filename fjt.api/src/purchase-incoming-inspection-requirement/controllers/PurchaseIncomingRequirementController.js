const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'id',
    'requirement',
    'isDeleted',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'requiementType',
    'isActive',
    'partRequirementCategoryID'
];

const purchaseInspectionModuleName = DATA_CONSTANT.PURCHASE_INSPECTION_REQUIREMENT_TYPE.NAME;

module.exports = {
    // get list of Inspection
    // POST : /api/v1/purchaseinspection/getpurchaseInspectionList
    // @return list of Inspection
    getpurchaseInspectionList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetPurchaseIncomingInspectionList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pInspectionTempId)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: req.body.isExport ? null : filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pInspectionTempId: req.body.templateId || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { RequirementList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // get detail of purchase requirement by ID
    // GET : /api/v1/purchaseinspection/getpurchaseInspectionRequirement/:id
    // @return detail of purchase requirement
    getpurchaseInspectionRequirement: (req, res) => {
        if (req.params.id) {
            const { InspectionMst, GenericCategory } = req.app.locals.models;

            return InspectionMst.findOne({
                where: {
                    id: req.params.id
                },
                include: [{
                    model: GenericCategory,
                    as: 'partRequirementCategory',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode']
                }]
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Create Inspection
    // POST : /api/v1/purchaseinspection/savePurchaseInspection
    // @return created purchase inspection requirement
    savePurchaseInspection: (req, res) => {
        const { InspectionMst } = req.app.locals.models;
        if (req.body) {
            const where = {
                requiementType: req.body.requiementType,
                requirement: req.body.requirement,
                isDeleted: false
            };

            if (req.body.id) {
                where.id = {
                    [Op.ne]: req.body.id
                };
            }

            return InspectionMst.findOne({
                where: where
            }).then((inspectionRes) => {
                if (inspectionRes) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Requirements & Comments');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                } else if (req.body.id) { // Update
                    COMMON.setModelUpdatedByFieldValue(req);

                    return InspectionMst.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(() =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(purchaseInspectionModuleName))
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else { // Create
                    COMMON.setModelCreatedByFieldValue(req);
                    return InspectionMst.create(req.body, {
                        fields: inputFields
                    }).then(response =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(purchaseInspectionModuleName))
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Purchase Requirement
    // GET : /api/v1/purchaseinspection/getPurchaseRequirementList
    // @return list of Purchase Requirement
    getPurchaseRequirementList: (req, res) => {
        const { InspectionMst } = req.app.locals.models;

        InspectionMst.findAll({
            attributes: ['id', 'requiementType', 'requirement'],
            order: [['requiementType', 'DESC'], ['requirement', 'ASC']]
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Remove Purchase Requirement
    // POST : /api/v1/purchaseinspection/deletePurchaseRequirement
    // @return list of Purchase Requirement by ID
    deletePurchaseRequirement: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.PURCHASE_INSPECTION_REQUIREMENT.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response && response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(purchaseInspectionModuleName));
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

    // Check Requirement exist or not
    // post:/api/v1/purchaseinspection/checkDuplicatePurchaseRequirement
    // @retrun validity of requirement
    checkDuplicatePurchaseRequirement: (req, res) => {
        const { InspectionMst } = req.app.locals.models;
        if (req.body) {
            const where = {
                requiementType: req.body.requiementType,
                requirement: req.body.requirement,
                isDeleted: false
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }

            return InspectionMst.findOne({
                where: where,
                attributes: ['id']
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicate: false }, null);
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

    // Check Requirement Reference exist or not
    // POST:/api/v1/purchaseinspection/whereUsedRequirementReference
    // @retrun validity of requirement
    whereUsedRequirementReference: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetReferenceInspectionRequirementList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:ID)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                ID: req.body.Id
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { InspectionCategory: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Update Part Requirement Category & Status
    // PUT : /api/v1/component/updateComponentAttributes
    // @param {id} int
    // @return Part Requirement Category & Status
    updatePartRequiremmentCategorys: (req, res) => {
        const {
            InspectionMst
        } = req.app.locals.models;
        if (req.body.updatePartRequirementInfo) {
            const inspectionIds = Object.assign(req.body.updatePartRequirementInfo.ids);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.updatePartRequirementInfo.data);            
            return InspectionMst.update(req.body.updatePartRequirementInfo.data, {
                where: {
                    [Op.or]: [{
                        id: {
                            [Op.in]: inspectionIds
                        }
                    }],
                    isDeleted: false
                }
            }).then(component => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, component, MESSAGE_CONSTANT.UPDATED(purchaseInspectionModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_UPDATED(purchaseInspectionModuleName),
                    err: null,
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
    }
};