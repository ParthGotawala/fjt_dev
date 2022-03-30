const _ = require('lodash');
// const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');


module.exports = {
    // get work order number build "summary" information
    // POST : /api/v1/compNicknameWOBuildDet/getCompNicknameWObuildSummaryInfo
    // @return summary information for work order number build
    getCompNicknameWObuildSummaryInfo: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveCompNicknameWOBuildSummaryInfo (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { woBuildList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // get work order number build "detail" information
    // POST : /api/v1/compNicknameWOBuildDet/getWOBuildDetailInfoByByAssyNickName
    // @return detail information for work order number build
    getWOBuildDetailInfoByByAssyNickName: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.assyNickname) {
            return sequelize.query('CALL Sproc_GetWOBuildDetailInfoByAssyNickName (:pAssyNickName,:pWOSeriesNumber)', {
                replacements: {
                    pAssyNickName: req.body.assyNickname,
                    pWOSeriesNumber: req.body.woSeriesNumber || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { woBuildDetailList: _.values(response[0]) }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get detail of production last work order number for defined assembly nick name
    // POST : /api/v1/compNicknameWOBuildDet/getLastWOBuildDetByCompNickname
    // @return detail of latest work order number
    getLastWOBuildDetByCompNickname: (req, res) => {
        const {
            ComponentNicknameWOBuildDetail, sequelize
        } = req.app.locals.models;
        if (req.body.nickName) {
            return ComponentNicknameWOBuildDetail.findOne({
                where: {
                    nickName: req.body.nickName
                },
                attributes: [[sequelize.literal('CONCAT(lastWOSeriesNumber, "-", lastWOBuildNumber)'), 'lastWONumberByAssyNickname']]
            }).then((response) => {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }).catch((err) => {
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
};