const { STATE, COMMON, LOGMST } = require('../../constant');
const resHandler = require('../../resHandler');

const createLogFields = [
    'message',
    'userID',
    'employeeID',
    'woID',
    'opID',
    'woOPID',
    'messageType',
    'createdBy',
    'createdAt'
];

// injected app as this controller used in socketCtrl.js
module.exports = {
    saveLog: (req, res) => module.exports.saveLogDetail(req, req.body).then((response) => {
        if (response) {
            if (response.status === STATE.SUCCESS) { resHandler.successRes(res, 200, STATE.SUCCESS, response.data); } else { resHandler.errorRes(res, 200, STATE.EMPTY, LOGMST.NOT_CREATED); }
        } else { resHandler.errorRes(res, 200, STATE.EMPTY, LOGMST.NOT_CREATED); }
    }).catch((err) => {
        console.trace();
        console.error(err);
        resHandler.errorRes(res, 200, STATE.EMPTY, LOGMST.NOT_CREATED);
    }),
    saveLogDetail: (req, data) => {
        const { LogMst } = req.app.locals.models;
        COMMON.setModelCreatedByFieldValue(req);

        return LogMst.create(data, {
            fields: createLogFields
        }).then(response => ({ status: STATE.SUCCESS, data: response })).catch((err) => {
            console.trace();
            console.error(err);
            return { status: STATE.FAILED, data: err };
        });
    }
};