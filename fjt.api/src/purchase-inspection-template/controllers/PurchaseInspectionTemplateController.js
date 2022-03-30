const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const mstinputFields = [
    'id',
    'name',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const detailsinputFields = [
    'id',
    'inspectionTemplateId',
    'inspectionRequirementId',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const purchaseInspectionModuleName = DATA_CONSTANT.PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_TYPE.NAME;

module.exports = {

    // get list of Inspection Template
    // POST : /api/v1/purchaseinspectiontemplate/getPurchaseInspTemplateList
    // @return list of Inspection Template
    getPurchaseInspTemplateList: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetPurchaseInspectionTemplateList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: req.body.isExport ? null : filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                TemplateCategory: _.values(response[1]), Count: response[0][0]['TotalRecord']
            }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Remove Template
    // POST : /api/v1/purchaseinspectiontemplate/deletePurchaseRequirementTemplate
    // @return list of template by ID
    deletePurchaseRequirementTemplate: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(() =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(purchaseInspectionModuleName))
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Check Template exist or not
    // post:/api/v1/purchaseinspectiontemplate/checkDuplicateTemplate
    // @retrun validity of template
    checkDuplicateTemplate: (req, res) => {
        const { InspectionTemplateMst } = req.app.locals.models;
        if (req.body) {
            const where = {
                name: req.body.name,
                isDeleted: false
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }

            return InspectionTemplateMst.findOne({
                where: where,
                attributes: ['id']
            }).then((templateDetails) => {
                if (templateDetails) {
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
    // Create Inspection Template
    // POST : /api/v1/purchaseinspectiontemplate/createInspectionTemplate
    // @return created Inspection Template
    createInspectionTemplate: (req, res) => {
        const { InspectionTemplateMst, InspectionTemplateRequirementDet, sequelize, InspectionMst } = req.app.locals.models;
        if (req.body) {
            const where = {
                name: req.body.name,
                isDeleted: false
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            return InspectionTemplateMst.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Template name');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                } else if (req.body.id) { // Update
                    COMMON.setModelUpdatedByFieldValue(req);
                    return sequelize.transaction().then(t =>
                        InspectionTemplateMst.update(req.body, {
                            where: {
                                id: req.body.id,
                                isDeleted: false
                            },
                            fields: mstinputFields,
                            transaction: t
                        }).then(() => {
                            var templatePromise = [];

                            // Remove Inspection Reuirement Detail
                            if (req.body.removeRequirementList && req.body.removeRequirementList.length > 0) {
                                const removeInspectionList = _.map(req.body.removeRequirementList, data => ({
                                    id: data.id
                                }));

                                _.each(removeInspectionList, (item) => {
                                    COMMON.setModelDeletedByFieldValue(item);
                                    templatePromise.push(
                                        InspectionTemplateRequirementDet.update(item, {
                                            where: {
                                                id: item.id
                                            },
                                            transaction: t
                                        }).then(() => STATE.SUCCESS).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return STATE.FAILED;
                                        })
                                    );
                                });
                            }

                            // Add Inspection Reuirement Detail
                            if (req.body.newRequirementList && req.body.newRequirementList.length > 0) {
                                const newInspectionList = _.map(req.body.newRequirementList, data => ({
                                    inspectionTemplateId: req.body.id,
                                    inspectionRequirementId: data.inspectionRequirementId
                                }));

                                _.each(newInspectionList, (item) => {
                                    COMMON.setModelCreatedByFieldValue(item);

                                    templatePromise.push(
                                        InspectionTemplateRequirementDet.create(item, {
                                            fields: detailsinputFields,
                                            transaction: t
                                        }).then(() => STATE.SUCCESS).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return STATE.FAILED;
                                        })
                                    );
                                });
                            }

                            return Promise.all(templatePromise).then((resp) => {
                                if (_.find(resp, sts => (sts === STATE.FAILED))) {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: null,
                                        data: null
                                    });
                                } else {
                                    return t.commit().then(() =>
                                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(purchaseInspectionModuleName))
                                    );
                                }
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }));
                } else {
                    // Create
                    COMMON.setModelCreatedByFieldValue(req);
                    return sequelize.transaction().then((t) => {
                        InspectionTemplateMst.create(req.body, {
                            fields: mstinputFields,
                            transaction: t
                        }).then((templateDetail) => {
                            const purchaseRequirementPromise = [];
                            const newInspectionList = _.map(req.body.newRequirementList, (data) => {
                                if (req.body.copyTemplate) {
                                    return purchaseRequirementPromise.push(
                                        InspectionTemplateRequirementDet.findOne({
                                            where: {
                                                id: data.inspectionDetailId
                                            },
                                            include: [{
                                                model: InspectionMst,
                                                as: 'inspectionmst',
                                                where: {
                                                    isDeleted: false
                                                },
                                                attributes: ['id']
                                            }]
                                        }).then((result) => {
                                            if (result && result.inspectionmst) {
                                                return ({
                                                    inspectionTemplateId: templateDetail.id,
                                                    inspectionRequirementId: result.inspectionmst.id
                                                });
                                            } else {
                                                return STATE.EMPTY;
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return STATE.EMPTY;
                                        })
                                    );
                                } else {
                                    return ({
                                        inspectionTemplateId: templateDetail.id,
                                        inspectionRequirementId: data.inspectionRequirementId
                                    });
                                }
                            });
                            return Promise.all(purchaseRequirementPromise).then((resp) => {
                                if (_.find(resp, sts => (sts === STATE.FAILED))) {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: null,
                                        data: null
                                    });
                                } else {
                                    const InspectionList = resp && resp.length > 0 ? resp : newInspectionList;
                                    if (InspectionList && InspectionList.length > 0) {
                                        COMMON.setModelCreatedArrayFieldValue(req.user, InspectionList);
                                        return InspectionTemplateRequirementDet.bulkCreate(InspectionList, {
                                            fields: detailsinputFields,
                                            transaction: t
                                        }).then(() => {
                                            t.commit();
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, templateDetail, MESSAGE_CONSTANT.CREATED(purchaseInspectionModuleName));
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    } else {
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.ATLEAST_ONE_INSPECTION_REQUIREMENT,
                                            err: null,
                                            data: null
                                        });
                                    }
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
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

    // get list of Inspection detail by seach key
    // GET : /api/v1/purchaseinspectiontemplate/getInspectionDetailBySeach
    // @return list of Inspection Detail
    getInspectionDetailBySeach: (req, res) => {
        const {
            InspectionMst, GenericCategory
        } = req.app.locals.models;
        if (req.body) {
            const where = {
                isActive: true
            };

            if (req.body.onlyComments) {
                where.requiementType = {
                    [Op.eq]: 'C'
                };
            }

            if (req.body.searchString) {
                where.requirement = {
                    [Op.like]: `%${req.body.searchString}%`
                };
            }

            if (req.body.requirementCategory) {
                where.partRequirementCategoryID = req.body.requirementCategory;
            }

            if (req.body.instructionId) {
                where.id = req.body.instructionId;
            }

            return InspectionMst.findAll({
                where: where,
                attributes: ['id', 'requirement', 'requiementType'],
                include: [{
                    model: GenericCategory,
                    as: 'partRequirementCategory',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode']
                }]
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
            ).catch((err) => {
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

    // get list of Inspection Template by seach key
    // GET : /api/v1/purchaseinspectiontemplate/getInspectionTemplateBySeach
    // @return list of Inspection Template Detail
    getInspectionTemplateBySeach: (req, res) => {
        const {
            InspectionTemplateMst
        } = req.app.locals.models;

        if (req.body) {
            const where = {};

            if (req.body.searchString) {
                where.name =
                {
                    [Op.like]: `%${req.body.searchString}%`
                };
            }

            if (req.body.templateId) {
                where.id = req.body.templateId;
            }

            return InspectionTemplateMst.findAll({
                where: where,
                attributes: ['id', 'name']
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
            ).catch((err) => {
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

    // get list of Part Requirement Category by search key
    // GET : /api/v1/purchaseinspectiontemplate/getPartRequirementCategoryBySearch
    // @return list of Part Requirement Category Detail
    getPartRequirementCategoryBySearch: (req, res) => {
        const {
            GenericCategory
        } = req.app.locals.models;

        if (req.body) {
            const where = {
                isActive: true
            };

            if (req.body.searchString) {
                where.gencCategoryName =
                {
                    [Op.like]: `%${req.body.searchString}%`
                };
                where.categoryType = req.body.categoryType;
            }

            if (req.body.requirementCategoryID) {
                where.gencCategoryID = req.body.requirementCategoryID;
            }

            return GenericCategory.findAll({
                where: where,
                attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode']
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
            ).catch((err) => {
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

    // get list of Requirement by Template
    // GET : /api/v1/purchaseinspectiontemplate/getPurchaseRequirementByTemplateId
    // @return list of Requirement by Template
    getPurchaseRequirementByTemplateId: (req, res) => {
        const {
            InspectionTemplateRequirementDet,
            InspectionMst,
            GenericCategory
        } = req.app.locals.models;

        if (req.body) {
            return InspectionTemplateRequirementDet.findAll({
                where: {
                    inspectionTemplateId: req.body.id
                },
                attributes: ['id', 'inspectionTemplateId', 'inspectionRequirementId'],
                include: [{
                    model: InspectionMst,
                    as: 'inspectionmst',
                    attributes: ['id', 'requirement', 'requiementType'],
                    required: true,
                    include: [{
                        model: GenericCategory,
                        as: 'partRequirementCategory',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode']
                    }]
                }]
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
            ).catch((err) => {
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
    }

    // // get detail of requirement template by Id
    // // GET : /api/v1/purchaseinspectiontemplate/getPurchaseRequirementTemplate/:id
    // // @return detail of requirement template by Id
    // getPurchaseRequirementTemplate: (req, res) => {
    //     if (req.params.id) {
    //         const { InspectionTemplateMst, InspectionMst, InspectionTemplateRequirementDet } = req.app.locals.models;

    //         return InspectionTemplateMst.findOne({
    //             where: {
    //                 id: req.params.id
    //             },
    //             include: [{
    //                 model: InspectionTemplateRequirementDet,
    //                 as: 'inspectionTemplateRequirementMst',
    //                 attributes: ['id', 'inspectionTemplateId', 'inspectionRequirementId'],
    //                 required: true,
    //                 include: [{
    //                     model: InspectionMst,
    //                     as: 'inspectionmst',
    //                     attributes: ['id', 'requirement'],
    //                     required: true
    //                 }]
    //             }]
    //         }).then((response) => {
    //             if (!response) {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
    //             }
    //             return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // }

};