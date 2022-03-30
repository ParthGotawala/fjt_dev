const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const inputFields = [
    'woID',
    'opID',
    'woOPID',
    'woTransID',
    'startDate',
    'endDate',
    'reason',
    'resumeReason',
    'holdEmployeeId',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];


module.exports = {
    // Hold/UnHold workorder transaction operation
    manageWorkorderTransOperationHoldUnhold: (req, t) => {
        if (req.body) {
            const { WorkorderTransOperationHoldUnhold } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);
            req.body.startDate = COMMON.getCurrentUTC();

            // resumed
            if (req.body.woTransOpHoldUnholdId) {
                COMMON.setModelUpdatedByFieldValue(req);
                req.body.endDate = COMMON.getCurrentUTC();
                return WorkorderTransOperationHoldUnhold.update(req.body, {
                    where: {
                        woTransOpHoldUnholdId: req.body.woTransOpHoldUnholdId
                    },
                    fields: ['woTransOpHoldUnholdId', 'unHoldEmployeeId', 'resumeReason', 'endDate', 'updatedBy'],
                    transaction: t
                }).then((resp) => {
                    // resp.dataValues = {
                    //     opID:req.body.opID,
                    //     woID:req.body.woID,
                    //     woOPID:req.body.woOPID,
                    //     woTransID:req.body.woTransID,
                    //     woTransOpHoldUnholdId:req.body.woTransOpHoldUnholdId,
                    //     holdEmployeeId:req.body.holdEmployeeId,
                    //     unHoldEmployeeId:req.body.unHoldEmployeeId,
                    //     reason:req.body.reason,
                    //     resumeReason:req.body.resumeReason,
                    //     startDate:req.body.startDate,
                    //     endDate:req.body.endDate,
                    //     updatedBy:req.body.updatedBy
                    // }
                    module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                        req.body.holdBy = req.user.username;
                        req.body.unHoldBy = req.user.username;
                        const data = {
                            woID: req.body.woID,
                            opID: req.body.opID,
                            woOPID: req.body.woOPID,
                            employeeID: req.user.employeeID,
                            senderID: req.user.employeeID,
                            message: req.body.resumeReason,
                            receiver: employees,
                            refTransID: req.body.woTransOpHoldUnholdId
                            // receiver: employees.filter((x) => { return x != req.user.employeeID })
                        };
                        NotificationMstController.sendWOOPUnHold(req, data);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        /* Empty */
                    });
                    return resp;
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return null;
                });
            } else {
                // halted
                return WorkorderTransOperationHoldUnhold.create(req.body, {
                    fields: inputFields,
                    transaction: t
                }).then((resp) => {
                    req.body.woTransOpHoldUnholdId = resp.woTransOpHoldUnholdId;
                    module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                        req.body.holdBy = req.user.username;
                        const data = {
                            woID: req.body.woID,
                            opID: req.body.opID,
                            woOPID: req.body.woOPID,
                            employeeID: req.user.employeeID,
                            senderID: req.user.employeeID,
                            message: req.body.reason,
                            receiver: employees,
                            refTransID: resp.woTransOpHoldUnholdId
                            // receiver: employees.filter((x) => { return x != req.user.employeeID })
                        };
                        NotificationMstController.sendWOOPHold(req, data);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        /* Empty */
                    });
                    return resp;
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return null;
                });
            }
        } else {
            return null;
        }
    },
    // Get list of employee by woOPID
    // @param {woOPID} int
    // @return list of employee
    getWOOPEmployees: (req, woOPID) => {
        const { sequelize } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_GetWorkorderEmployees (:woOPID, :woID, :opID)',
                {
                    replacements: {
                        woOPID: woOPID,
                        woID: null,
                        opID: null
                    }
                })
            .then((response) => {
                if (response) { return response.map(x => x.employeeID); } else { return []; }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return [];
            });
    },
    // Retrieve list of halt operation of workorder
    // GET : /api/v1/workorder_trans_operation_hold_unhold/getWOHaltOperationsDet
    // @param {woID} int
    // @return list of halt operations
    getWOHaltOperationsDet: (req, res) => {
        if (req.body && req.body.woID) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_GetWOHaltOperationsDet (:ppageIndex, :precordPerPage, :pOrderBy,:pWhereClause,:pWoID)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere,
                            pWoID: req.body.woID
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { haltOPList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};