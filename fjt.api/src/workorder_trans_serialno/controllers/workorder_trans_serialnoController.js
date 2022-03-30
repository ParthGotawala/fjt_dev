const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const WorkorderSerialmstController = require('../../workorder_serialmst/controllers/Workorder_SerialmstController');

const woTransSerialModuleName = DATA_CONSTANT.WORKORDER_TRANS_SERIAL.NAME;

module.exports = {
    // Retrive list of workorder transacton serial no
    // POST : /api/v1/generateWorkorder_trans_serialNo/retriveWoTransSerialno
    // @return list of workorder transacton serial no
    retriveWoTransSerialno: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }

            return sequelize
                .query('CALL Sproc_RetrieveWOTransSerialno (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pWoTransID,:pWOID,:pOPID)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: strOrderBy,
                            pWhereClause: strWhere,
                            pWoTransID: req.body.woTransID || null,
                            pWOID: req.body.woID || null,
                            pOPID: req.body.opID || null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    workorderSerialsList: _.values(response[1]),
                    Count: response[0][0]['TotalRecord'],
                    CountOfReprocessedQty: response[2][0]['COUNT(*)'],
                    CountOfInProcessingSerial: response[3][0]['CountOfInProcessingSerial']
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Generate transaction serial no
    // POST : /api/v1/generateWorkorder_trans_serialNo/retrieveWorkorderTransactionDetails
    // @return API response
    generateTransSerialno: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            req.params.woID = req.body.woID;

            const promises = [];
            promises.push(WorkorderSerialmstController.getWOSerialDetail(req));

            return Promise.all(promises).then((response) => {
                if (response && response[0] && response[0].status === DATA_CONSTANT.API_RESPONSE_CODE.ERROR) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: response.status, err: response.err, data: response[0].data });
                } else {
                    // let serialNoList = '';
                    // serialNoList = Array.isArray(req.body.woTransSerialNoList) ? req.body.woTransSerialNoList.join(',') : req.body.woTransSerialNoList;
                    const serialNoList = [];
                    if (Array.isArray(req.body.woTransSerialNoList)) {
                        _.each(req.body.woTransSerialNoList, (detItem) => {
                            serialNoList.push({ serialNo: detItem || {} });
                        });
                    } else {
                        serialNoList.push(req.body.woTransSerialNoList);
                    }
                    return sequelize.query('CALL Sproc_ProcessedSerialQty(:pWOOPID,:pWOID,:pWOTransID,:pSerialNoList,:pProdStatus,:pOpID,:pEmployeeID,:pUserId,:pRoleId,:pSerialType)', {
                        replacements: {
                            pWOOPID: req.body.woOPID || null,
                            pWOID: req.body.woID || null,
                            pWOTransID: req.body.woTransID || null,
                            pSerialNoList: JSON.stringify(serialNoList),
                            pProdStatus: req.body.prodStatus,
                            pOpID: req.body.opID,
                            pEmployeeID: req.body.employeeID,
                            pUserId: req.user.id,
                            pRoleId: COMMON.getRequestUserLoginRoleID(req),
                            pSerialType: response[0].data
                        }
                    }).then((responseList) => {
                        if (Array.isArray(responseList) && responseList.length > 0) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseList, null);
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseList, MESSAGE_CONSTANT.CREATED(woTransSerialModuleName));
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // delete work order transaction serial no
    // POST : /api/v1/deleteWoTransSerialNo
    // @return API response
    deleteWoTransSerialNo: (req, res) => {
        if (req.query.woTransSerialID) {
            const { sequelize } = req.app.locals.models;
            const tableName = COMMON.AllEntityIDS.WorkorderTransSerialno.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.query.woTransSerialID,
                        deletedBy: req.user.id,
                        entityID: null,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((response) => {
                    if (response) {
                        const spResp = _.values(response[0]);
                        switch (spResp[0]) {
                            case 'not allowed':
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.SERIAL_NO_ALREADY_PROCESSED });
                            default:
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(woTransSerialModuleName));
                        }
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(woTransSerialModuleName));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    getTransPrevOpPassedSerials: (req, res) => {
        if (req.body.objWoTransCurrOp.woID && req.body.objWoTransCurrOp.woOPID) {
            const { sequelize } = req.app.locals.models;

            return sequelize
                .query('CALL Sproc_getTransPrevOpPassedSerials (:pWoID,:pCurrWoOPID)',
                    {
                        replacements: {
                            pWoID: req.body.objWoTransCurrOp.woID,
                            pCurrWoOPID: req.body.objWoTransCurrOp.woOPID
                        }
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { TransPrevOpPassedSerialsList: _.values(response) })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }

};
