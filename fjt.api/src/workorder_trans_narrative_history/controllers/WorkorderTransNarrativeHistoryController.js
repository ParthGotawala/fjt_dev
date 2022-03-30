const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const narrativeHistoryModuleName = DATA_CONSTANT.WORKORDER_NARRATIVE_HISTORY.NAME;

const inputFields = [
    'partID',
    'woID',
    'opID',
    'woOPID',
    'woTransID',
    'employeeID',
    'narrativeDescription',
    'totalTimeConsume',
    'createdBy',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrive list of narrative history
    // GET : /api/v1/workordernarrativehistory/retriveNarrativeHistoryList
    // @return list of narrative history
    retriveNarrativeHistoryList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveWorkorderNarrativeHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pfromDate,:ptoDate, :pwoID)',
                {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pfromDate: req.body.fromDate ? new Date(req.body.fromDate) : null,
                        ptoDate: req.body.toDate ? new Date(req.body.toDate) : null,
                        pwoID: req.body.woID ? req.body.woID : null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    narrativeHistory: _.values(response[1]),
                    Count: response[0][0]['TotalRecord'],
                    woDetails: response[2] ? _.values(response[2]) : null
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive detail of narrative history
    // GET : /api/v1/workordernarrativehistory
    // @param {id} int
    // @return detail of narrative history
    retriveNarrativeHistory: (req, res) => {
        if (req.params.id) {
            const { WorkorderTransNarrativeHistory } = req.app.locals.models;
            return WorkorderTransNarrativeHistory.findByPk(req.params.id)
                .then((response) => {
                    if (!response) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(narrativeHistoryModuleName), err: null, data: null });
                    }
                    response.narrativeDescription = COMMON.getTextAngularValueFromDB(response.narrativeDescription);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create narrative history
    // POST : /api/v1/workordernarrativehistory
    // @return new created narrative history
    createNarrativeHistory: (req, res) => {
        const WorkorderTransNarrativeHistory = req.app.locals.models.WorkorderTransNarrativeHistory;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            if (req.body.narrativeDescription) { req.body.narrativeDescription = COMMON.setTextAngularValueForDB(req.body.narrativeDescription); }
            WorkorderTransNarrativeHistory.create(req.body, {
                fields: inputFields
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(narrativeHistoryModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err.errors.map(e => e.message).join(','),
                        data: null
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        }
    },
    // Update workorder narrative history
    // PUT : /api/v1/workordernarrativehistory
    // @param {id} int
    // @return API Response
    updateNarrativeHistory: (req, res) => {
        const WorkorderTransNarrativeHistory = req.app.locals.models.WorkorderTransNarrativeHistory;
        if (req.params.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            if (req.body.narrativeDescription) { req.body.narrativeDescription = COMMON.setTextAngularValueForDB(req.body.narrativeDescription); }
            WorkorderTransNarrativeHistory.update(req.body, {
                where: {
                    id: req.params.id
                },
                fields: inputFields
            }).then((rowsUpdated) => {
                if (rowsUpdated[0] === 1) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(narrativeHistoryModuleName));
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(narrativeHistoryModuleName), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err.errors.map(e => e.message).join(','),
                        data: null
                    });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        }
    },

    // Delete Standard Class
    // DELETE : /api/v1/deleteNarrativeHistory
    // @return API response
    deleteNarrativeHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Workorder_Narrative_Details.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: req.user.id,
                        entityID: null,
                        refrenceIDs: null,
                        countList: req.body.objIDs.CountList,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((travelerHistory) => {
                    if (travelerHistory.length === 0) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(narrativeHistoryModuleName));
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: travelerHistory, IDs: req.body.objIDs.id }, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETERS, err: null, data: null });
        }
    }
};
