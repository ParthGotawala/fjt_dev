const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { NotFound } = require('../../errors');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const TaskModuleName = DATA_CONSTANT.HISTORY.NAME;
module.exports = {
    getTaskConfirmationlist: (req, res) => {
        const { sequelize } = req.app.locals.models;

        sequelize
            .query('CALL Sproc_RetrieveTaskConfirmationList (:pconfirmationType,:prefTablename,:prefId)',
                {
                    replacements: {
                        pconfirmationType: req.query.confirmationType,
                        prefTablename: req.query.refTablename,
                        prefId: req.query.refId
                    },
                    type: sequelize.QueryTypes.SELECT
                })
            .then((response) => {
                const taskConfirmationList = response && response[0] ? _.values(response[0]) : [];
                _.each(taskConfirmationList, (item) => {
                    item.reason = COMMON.getTextAngularValueFromDB(item.reason);
                });
                return resHandler.successRes(res, 200, STATE.SUCCESS, { taskconfirmationlist: taskConfirmationList });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(TaskModuleName)));
            });
    }

};