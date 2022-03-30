const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

module.exports = {
    // get list of Unallocated Umid Transfer History
    // POST : /api/v1/unallocated_umid_transfer/history
    // @return list of Unallocated Umid Transfer History
    unallocatedXferHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetUnallocatedUmidTransferHistoryList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pfromDate,:ptoDate)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pfromDate: req.body.fromDate || null,
                ptoDate: req.body.toDate || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                HistoryCategory: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};