/* eslint-disable global-requries */
const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

module.exports = {
    // Retrive list of  UID count approval history
    // POST : /api/v1/countapprovalhistory/getCountApprovalHistoryList
    // @return list of UID count approval history
    getCountApprovalHistoryList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const searchColumns = req.body.SearchColumns && req.body.SearchColumns.length > 0 ? (_.chain(req.body.SearchColumns).groupBy('isExternalSearch').map((value, key) => ({
            searchList: value,
            isExternalSearch: key === 'true' ? true : false
        })).value()) : [];
        let filter = null;
        let strWhere = '';
        if (searchColumns.length > 0) {
            _.each(searchColumns, (columns) => {
                let filterTypeWhereClause = '';
                if (columns.searchList.length > 0) {
                    req.body.search = JSON.stringify(columns.searchList);
                    filter = COMMON.UiGridFilterSearch(req);
                    if (columns.isExternalSearch) {
                        // isExternalSearch means external filter else grid filter
                        filterTypeWhereClause = COMMON.whereClauseOfMultipleFieldSearchText(filter.where);
                    } else {
                        filterTypeWhereClause = COMMON.UIGridWhereToQueryWhere(filter.where);
                    }

                    if (strWhere) {
                        strWhere += ' AND ';
                    }
                    strWhere += ` ( ${filterTypeWhereClause} ) `;
                }
            });
        } else {
            filter = COMMON.UiGridFilterSearch(req);
        }

        sequelize.query('CALL Sproc_RetrieveCountApprovalHistoryList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pfromDate,:ptoDate)', {
            replacements: {
                pPageIndex: req.body.page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pfromDate: req.body.fromDate || null,
                ptoDate: req.body.toDate || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
            countApprovalList: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        },
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            }
            );
        });
    }
};