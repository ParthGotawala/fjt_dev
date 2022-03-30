/* eslint-disable global-requries */
const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound } = require('../../errors');

const currentModuleName = DATA_CONSTANT.VERIFICATION_HISTORY.NAME;

module.exports = {
    // Retrive list of  UID verification history
    // POST : /api/v1/verificationHistory
    // @return list of UID verification history
    verificationHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);

        if (req.body.UID) { filter.where.scanString1 = req.body.UID; }

        if (req.body.status) { filter.where.status = req.body.status; }

        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize
            .query('CALL Sproc_RetrieveUIDVerificationHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:filterType,:pwoOPID,:pUMIDID)', {
                replacements: {
                    ppageIndex: req.body.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    filterType: parseInt(req.body.filterType),
                    pwoOPID: parseInt(req.body.woOPID),
                    pUMIDID: req.body.umidId || null
                },
                type: sequelize.QueryTypes.SELECT
            })
            .then(response =>
                resHandler.successRes(res, 200, STATE.SUCCESS, {
                    history: _.values(response[1]),
                    Count: response[0][0]['COUNT(*)']
                })
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(currentModuleName)));
            });
    }
};