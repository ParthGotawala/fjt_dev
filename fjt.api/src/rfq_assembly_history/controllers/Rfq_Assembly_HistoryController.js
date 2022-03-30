const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { InvalidPerameter, NotUpdate } = require('../../errors');

const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const moduleName = DATA_CONSTANT.RFQ_ASSEMBLY_HISTORY.NAME;
const moduleRDName = DATA_CONSTANT.RFQ_ASSEMBLY_HISTORY.RANDDNAME;
const inputFields = [
    'id',
    'narrative',
    'time',
    'updatedBy',
    'updatedAt'
];


module.exports = {
    // Retrive list of assembly change history
    // POST : /api/v1/rfqAssemblies/getBOmHistory
    // @param {partID} int
    // @return list of assembly change history
    getBOmHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.partID && req.body.page && req.body.pageSize) {
            let orderBy = null;
            if (req.body.SortColumns) {
                const orderByInfo = req.body.SortColumns[0];
                if (orderByInfo && orderByInfo.length > 0) {
                    orderBy = `${orderByInfo[0]} ${orderByInfo[1]}`;
                }
            }

            let WhereClause = ' 1=1 ';
            if (req.body.SearchColumns) {
                const searcharray = req.body.SearchColumns;
                if (searcharray.length > 0) {
                    _.each(searcharray, (obj) => {
                        obj.SearchString = obj.SearchString ? obj.SearchString.replace(/"/g, '\\"') : '';
                        if (obj.ColumnDataType && obj.ColumnDataType === COMMON.GridFilterColumnDataType.Number) {
                            WhereClause += COMMON.stringFormat('and {0} = \'{1}\' ', obj.ColumnName, obj.SearchString);
                        } else {
                            WhereClause += COMMON.stringFormat('and {0} like "%{1}%" ', obj.ColumnName, obj.SearchString);
                        }
                    });
                }
            }

            sequelize.query('CALL Sproc_GetBOMAssyHistory (:pPartID,:pNarrative,:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    pPartID: req.body.partID,
                    pNarrative: req.body.narrative,
                    ppageIndex: req.body.page,
                    precordPerPage: req.body.pageSize,
                    pOrderBy: orderBy,
                    pWhereClause: WhereClause
                },
                type: sequelize.QueryTypes.SELECT
            }).then((partloglist) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, { assemblyLogList: _.values(partloglist[1]), Count: partloglist[0][0]['TotalRecord'] });
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            });
        } else {
            resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.NOT_FOUND(moduleName));
        }
    },
    // Save Narrative History
    // Post : /api/v1/saveNarrativeHistory
    // @param Narrative History
    // @return API response
    saveNarrativeHistory: (req, res) => {
        const { RFQAssemblyHistory } = req.app.locals.models;
        if (req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            req.body.updatedAt = COMMON.getCurrentUTC();
            req.body.updatedBy = COMMON.getRequestUserID(req);
            req.body.narrative = COMMON.setTextAngularValueForDB(req.body.narrative);
            RFQAssemblyHistory.update(req.body, {
                where: {
                    id: req.body.id
                },
                fields: inputFields
            }).then((updateHistory) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, updateHistory, MESSAGE_CONSTANT.UPDATED(moduleRDName));
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(moduleRDName)));
            });
        } else {
            resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    }
};