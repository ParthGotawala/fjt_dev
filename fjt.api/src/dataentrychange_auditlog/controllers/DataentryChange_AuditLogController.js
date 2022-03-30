const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');


module.exports = {
    // Retrive list of workorder change history
    // POST : /api/v1/dataentrychange_auditlog/getWoDataentryChangeAuditlog
    // @return list of workorder change history
    getWoDataentryChangeAuditlog: (req, res) => {
        if (req.body && req.body.woID) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_WOChangeHistory (:pWoID,:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:woOPID,:fromVersion,:toVersion)',
                    {
                        replacements: {
                            pWoID: req.body.woID,
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere,
                            woOPID: req.body.woOPID || null,
                            fromVersion: req.body.fromVersion || null,
                            toVersion: req.body.toVersion || null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((woauditloglist) => {
                    if (woauditloglist && woauditloglist.length > 0) {
                        _.each(woauditloglist[1], (row) => {
                            if (row.valueDataType === 'TextAngular') {
                                if (row.Oldval) row.Oldval = COMMON.getTextAngularValueFromDB(row.Oldval);
                                if (row.Newval) row.Newval = COMMON.getTextAngularValueFromDB(row.Newval);
                            }
                        });
                    }

                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { workorderAuditLogList: _.values(woauditloglist[1]), Count: woauditloglist[0][0]['COUNT(*)'] }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get History of Entity
    // POST : /api/v1/dataentrychange_auditlog/getHistoryDataByTableName
    // @return History records by id and tablename
    getHistoryDataByTableName: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var strWhere = '';
        if (req.body.id && req.body.TableName) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize.query('CALL Sproc_HistoryByTableName (:pCustomerID, :ppageIndex,:precordPerPage,:pOrderBy, :pWhereClause, :pTableName)', {
                replacements: {
                    pCustomerID: req.body.id,
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pTableName: req.body.TableName
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                History: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
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