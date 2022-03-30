const _ = require('lodash');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const currentModuleName = DATA_CONSTANT.ComponentDynamicAttributeMappingPart.NAME;

// MODE FIELDS
const inputFields = [
    'id',
    'mfgPNID',
    'attributeID',
    'attributeValue',
    'createdBy',
    'updatedBy',
    'deletedAt',
    'deletedBy',
    'updatedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {

    // Get List of ComponentDynamicAttributeMappingPart Class
    // GET : /api/v1/getComponentAttributeMappingList
    // @param {id} int
    // @return retrive list of ComponentDynamicAttributeMappingPart Class
    getComponentAttributeMappingList: (req, res) => {
        const { ComponentDynamicAttributeMappingPart, sequelize } = req.app.locals.models;
        if (req.params.Id) {
            ComponentDynamicAttributeMappingPart.findByPk(req.params.Id).then((result) => {
                if (!result) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(currentModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            sequelize.query('CALL Sproc_RetrieveComponentPriceBreakDetails (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.query.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { componentattributemappings: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    // Create ComponentDynamicAttributeMappingPart Class
    // POST : /api/v1/createComponentAttributeMapping
    // @return New created ComponentDynamicAttributeMappingPart Class detail
    createComponentAttributeMapping: (req, res) => {
        const { ComponentDynamicAttributeMappingPart } = req.app.locals.models;
        ComponentDynamicAttributeMappingPart.findOne({
            where: {
                mfgPNID: req.body.mfgPNID,
                attributeID: req.body.attributeID,
                isDeleted: false
            }
        }).then((result) => {
            if (result) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.PARTS.OPERATIONAL_ATTRIBUTE_ALREADY_EXISTS, err: null, data: null });
            } else {
                COMMON.setModelCreatedByFieldValue(req);
                return ComponentDynamicAttributeMappingPart.create(req.body, {
                    fields: inputFields
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(currentModuleName))
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Update ComponentDynamicAttributeMappingPart Class
    // PUT : /api/v1/updateComponentAttributeMapping
    // @return API Response
    updateComponentAttributeMapping: (req, res) => {
        const { ComponentDynamicAttributeMappingPart } = req.app.locals.models;
        COMMON.setModelUpdatedByFieldValue(req);
        ComponentDynamicAttributeMappingPart.update(req.body, {
            where: {
                id: req.body.id
            },
            fields: inputFields
        }).then((rowsUpdated) => {
            if (rowsUpdated[0] === 1) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(currentModuleName));
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(currentModuleName), err: null, data: null });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Delete ComponentDynamicAttributeMappingPart Class
    // DELETE : /api/v1/deleteComponentAttributeMapping
    // @return API response
    deleteComponentAttributeMapping: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.ComponentDynamicAttributeMappingPart.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((result) => {
                if (result && result.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, MESSAGE_CONSTANT.DELETED(currentModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: result, IDs: req.body.objIDs.id }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};