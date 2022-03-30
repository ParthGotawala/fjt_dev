const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const inputFields = [
    'woID',
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
// const woSerialModuleName = DATA_CONSTANT.WORKORDER_ASSEMBLY_EXCESSSTOCK_LOCATION

module.exports = {
    // Retrive list of workorder halt resume list by woID
    // POST : /api/v1/workorder_trans_hold_unhold
    // @return list of workorder halt resume details
    retriveWorkorderHaltResumeDetails: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_GetWorkorderHaltResumeReasonHistory (:pWoID,:pSalesOrderDetID,:pIsWorkorder,:ppageIndex, :precordPerPage, :pOrderBy,:pWhereClause)',
                    {
                        replacements: {
                            pWoID: req.body.woID ? req.body.woID : null,
                            pSalesOrderDetID: req.body.salesOrderDetID ? req.body.salesOrderDetID : null,
                            pIsWorkorder: req.body.isWorkorder && JSON.parse(req.body.isWorkorder) ? 1 : 0,
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, 200, STATE.SUCCESS, { workorderHaltResumeList: _.values(response[1]), Count: response[0][0]['TotalRecord'] })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Hold/UnHold workorder transaction
    manageWorkorderTransHoldUnhold: (req, t) => {
        if (req.body) {
            const { WorkorderTransHoldUnhold } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);
            req.body.startDate = COMMON.getCurrentUTC();

            // resumed
            if (req.body.woTransHoldUnholdId) {
                COMMON.setModelUpdatedByFieldValue(req);
                req.body.endDate = COMMON.getCurrentUTC();
                return WorkorderTransHoldUnhold.update(req.body, {
                    where: {
                        woTransHoldUnholdId: req.body.woTransHoldUnholdId
                    },
                    fields: ['unHoldEmployeeId', 'resumeReason', 'endDate', 'updatedBy', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId'],
                    transaction: t
                }).then((resp) => {
                    module.exports.getWOEmployees(req, req.body.woID).then((employees) => {
                        req.body.holdBy = req.user.username;
                        const data = {
                            woID: req.body.woID,
                            employeeID: req.user.employeeID,
                            senderID: req.user.employeeID,
                            message: req.body.resumeReason,
                            receiver: employees,
                            refTransID: req.body.woTransHoldUnholdId
                        };
                        NotificationMstController.sendWOStart(req, data);
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
                return WorkorderTransHoldUnhold.create(req.body, {
                    fields: inputFields,
                    transaction: t
                }).then((resp) => {
                    module.exports.getWOEmployees(req, req.body.woID).then((employees) => {
                        req.body.holdBy = req.user.username;
                        const data = {
                            woID: req.body.woID,
                            employeeID: req.user.employeeID,
                            senderID: req.user.employeeID,
                            message: req.body.reason,
                            receiver: employees,
                            refTransID: resp.woTransHoldUnholdId
                        };
                        NotificationMstController.sendWOStop(req, data);
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
    // Get list of employee by woID
    // @param {woID} int
    // @return list of employee
    getWOEmployees: (req, woID) => {
        const { sequelize } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_GetWorkorderEmployees (:woOPID, :woID, :opID)',
                {
                    replacements: {
                        woOPID: null,
                        woID: woID,
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
    }
};