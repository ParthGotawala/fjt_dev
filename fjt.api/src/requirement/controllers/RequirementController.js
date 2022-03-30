const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'id',
    'name',
    'description',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'category',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const RequirementModuleName = DATA_CONSTANT.ADDITIONAL_REQUIREMENT.DISPLAYNAME;
const NarrativeTemplateModuleName = DATA_CONSTANT.ADDITIONAL_REQUIREMENT.NARRATIVE_DISPLAYNAME;
module.exports = {
    // Create Additional Requirement
    // POST : /api/v1/requirement_template/saveRequirement
    // @return created Requirement
    saveRequirement: (req, res) => {
        const Requirement = req.app.locals.models.Requirement;
        if (req.body) {
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

            const where = {
                [Op.or]: [{ name: req.body.name }]
            };
            where.category = req.body.category;
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            return Requirement.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    if (req.body.category === DATA_CONSTANT.ADDITIONAL_REQUIREMENT.CATEGORY.NARRATIVE_REQUIREMENT.ID) {
                        messageContent.message = COMMON.stringFormat(messageContent.message, 'Narrative template');
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                    } else {
                        messageContent.message = COMMON.stringFormat(messageContent.message, 'RFQ requirement template');
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                    }
                } else if (req.body.id) {  // Update
                    COMMON.setModelUpdatedByFieldValue(req);
                    return Requirement.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(() => {
                        if (req.body.category === DATA_CONSTANT.ADDITIONAL_REQUIREMENT.CATEGORY.NARRATIVE_REQUIREMENT.ID) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(NarrativeTemplateModuleName));
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(RequirementModuleName));
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else { // Create
                    COMMON.setModelCreatedByFieldValue(req);
                    return Requirement.create(req.body, {
                        fields: inputFields
                    }).then((additionalRequirement) => {
                        if (req.body.category === DATA_CONSTANT.ADDITIONAL_REQUIREMENT.CATEGORY.NARRATIVE_REQUIREMENT.ID) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, additionalRequirement, MESSAGE_CONSTANT.CREATED(NarrativeTemplateModuleName));
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, additionalRequirement, MESSAGE_CONSTANT.CREATED(RequirementModuleName));
                        }
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
    // Retrive list of Requirement
    // POST : /api/v1/requirement_template/retriveRequirementList
    // @return list of Requirement
    retriveRequirementList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            req.body.whereStatus = req.body.whereStatus ? req.body.whereStatus.map(String) : null;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveRequirement (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    AdditionalRequirement: _.values(response[1]), Count: response[0][0]['TotalRecord']
                }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive detail of Requirement
    // GET : /api/v1/requirement_template/retriveRequirement
    // @param {id} int
    // @return detail of Requirement
    retriveRequirement: (req, res) => {
        const Requirement = req.app.locals.models.Requirement;
        if (req.query.id) {
            return Requirement.findOne({
                where: { id: req.query.id }

            }).then((additionalRequirement) => {
                if (!additionalRequirement) {
                    if (req.query.category === DATA_CONSTANT.ADDITIONAL_REQUIREMENT.CATEGORY.NARRATIVE_REQUIREMENT.ID) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(NarrativeTemplateModuleName), err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(RequirementModuleName), err: null, data: null });
                    }
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, additionalRequirement, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Remove Requirement
    // POST : /api/v1/requirement_template/deleteRequirement
    // @return list of Requirement by ID
    deleteRequirement: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.AdditionalRequirement.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (req.body.objIDs.category && parseInt(req.body.objIDs.category) === DATA_CONSTANT.ADDITIONAL_REQUIREMENT.CATEGORY.NARRATIVE_REQUIREMENT.ID) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(NarrativeTemplateModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(RequirementModuleName));
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
    // Retrive list of Requirement
    // GET : /api/v1/requirement_template/getRequirementList
    // @return list of Requirement
    getRequirementList: (req, res) => {
        const { Requirement } = req.app.locals.models;

        return Requirement.findAll({
            where: {
                category: req.body.category
            },
            attributes: ['id', 'name', 'category', 'isActive']
        }).then(additionalRequirementList =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, additionalRequirementList, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    checkDuplicateTemplate: (req, res) => {
        const { Requirement } = req.app.locals.models;
        if (req.body) {
            const whereClauseRequirement = {
                name: req.body.name,
                category: req.body.category
            };
            if (req.body.id) {
                whereClauseRequirement.id = { [Op.notIn]: [req.body.id] };
            }
            return Requirement.findOne({
                where: whereClauseRequirement,
                attributes: ['id']
            }).then((response) => {
                if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { isDuplicateClassName: true }, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateClassName: false }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
