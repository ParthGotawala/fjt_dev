const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
var TimelineController = require('../../timeline/controllers/TimelineController');

const timelineObj = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_SERIALMST;
const workorderSerialObj = DATA_CONSTANT.TIMLINE.WORKORDER_SERIALMST;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
const woSerialModuleName = DATA_CONSTANT.WORKORDER_SERIALMST.NAME;
const mfgSerialModuleName = DATA_CONSTANT.WORKORDER_SERIALMST.MFG_SERIAL_NAME;
const productSerialModuleName = DATA_CONSTANT.WORKORDER_SERIALMST.PRODUCT_SERIAL_NAME;
const productSerialMappingModuleName = DATA_CONSTANT.WORKORDER_SERIALMST.PRODUCT_SERIAL_MAPPING_NAME;
const productionHistoryModuleName = DATA_CONSTANT.WORKORDER_TRANS_PRODUCTION.HISTORY;

const inputFields = [
    'ID',
    'woID',
    'PrefixorSuffix',
    'PreSuffix',
    'dateCode',
    'noofDigit',
    'SerialNo',
    'curropID',
    'currwoOPID',
    'currStatus',
    'isDeleted',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'barcodeSeparatorID',
    'barcodeSeparatorValue'
];


module.exports = {
    // Retrive list of workorder serials by woID
    // GET : /api/v1/workorder_serialmst
    // @param {woID} int
    // @return list of workorder serials
    retriveWorkorderSerials: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            let strOrderBy = null;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }

            return sequelize.query('CALL Sproc_RetrieveWorkOrderSerials (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pWoID,:pSerialType)',
                {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: strOrderBy,
                        pWhereClause: strWhere,
                        pWoID: req.body.woID ? req.body.woID : null,
                        pSerialType: req.body.serialType ? req.body.serialType : null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => sequelize.query('Select fun_IsAllowToResetSerialNo(:pSerialType,:pwoID)', {
                    replacements: {
                        pSerialType: req.body.serialType ? req.body.serialType : null,
                        pwoID: req.body.woID || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((responseSerial) => {
                    const serialDet = responseSerial && responseSerial.length ? _.values(responseSerial[0])[0] : 0;
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                        {
                            workorderSerialsList: _.values(response[1]),
                            Count: response[0][0]['TotalRecord'],
                            isSerialsUsedInWOProcess: serialDet
                        });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create workorder serial
    // POST : /api/v1/workorder_serialmst
    // @return list of workorder serials
    createWorkorderSerial: (req, res) => {
        if (req.body) {
            const { sequelize, WorkorderSerialMst } = req.app.locals.models;
            if (req.body.dateCode) { req.body.dateCode = req.body.dateCode.toUpperCase(); }

            return WorkorderSerialMst.count({
                where: {
                    woID: req.body.woID,
                    serialType: req.body.serialType
                }
            }).then((countofserialmst) => {
                /* Validation for generated serials not more than build qty */
                if (parseInt(countofserialmst) + parseInt(req.body.numOfSerialsToGenerate) > parseInt(req.body.buildQty || 0)) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.SERIALS_MORETHAN_BUILD_QTY_MSG, err: null, data: null });
                }
                return sequelize.query('CALL Sproc_GenerateSerialNumber(:pPrefix,:pSuffix,:pConfigurationId,:pStartNumber,:pNoofDigit,:pUserID,:pRoleId,:pDateCode,:pDateCodeFormat,:pCurrStatus,:pWoID,:pNoofSerial,:pCurropID,:pWOTransID,:pSerialType,:pIsTransferred,:pRefSerialID,:pRefMFGSerialNo , :pSerialNoSeparator, :pBarcodeSeparatorID)', {
                    replacements: {
                        pPrefix: req.body.prefix || null,
                        pSuffix: req.body.suffix || null,
                        pConfigurationId: req.body.configurationId || null,
                        pStartNumber: req.body.startNumber || 1,
                        pNoofDigit: req.body.noofDigit,
                        pUserID: req.user.id,
                        pDateCodeFormat: req.body.dateCodeFormat || null,
                        pRoleId: COMMON.getRequestUserLoginRoleID(req),
                        pDateCode: req.body.dateCode || null,
                        pCurrStatus: req.body.currStatus || null,
                        pWoID: req.body.woID || null,
                        pNoofSerial: req.body.numOfSerialsToGenerate || null,
                        pCurropID: req.body.curropID || null,
                        pWOTransID: req.body.woTransID || null,
                        pSerialType: req.body.serialType,
                        pIsTransferred: req.body.isTransferred || null,
                        pRefSerialID: req.body.refSerialID || null,
                        pRefMFGSerialNo: req.body.refMFGSerialNo || null,
                        pSerialNoSeparator: req.body.serialNoSeparator || '',
                        pBarcodeSeparatorID: req.body.barcodeSeparatorID || null
                    }
                }).then((configurationDetail) => {
                    var detail = (Array.isArray(configurationDetail)) && (configurationDetail.length > 0) ? configurationDetail[0] : null;
                    if (!detail) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(woSerialModuleName));
                    } else {
                        let messageDetail = {};
                        let isLimitExists = false;
                        const duplicateSerialNo = configurationDetail.filter(a => a.errorCode === 2).map(a => a.serialNo);
                        const limitExists = configurationDetail.filter(a => a.errorCode === 1).map(a => a.serialNo);
                        if (Array.isArray(limitExists) && limitExists.length > 0) {
                            isLimitExists = true;
                            messageDetail = Object.assign({}, MESSAGE_CONSTANT.MFG.SERIAL_NO_LIMIT_EXISTS);
                            messageDetail.message = COMMON.stringFormat(messageDetail.message, limitExists[0], req.body.noofDigit);
                        } else if (Array.isArray(duplicateSerialNo) && duplicateSerialNo.length > 0) {
                            const serialNo = duplicateSerialNo.join(', ');
                            messageDetail = Object.assign({}, MESSAGE_CONSTANT.MFG.DUPLICATE_SERIAL);
                            messageDetail.message = COMMON.stringFormat(messageDetail.message, serialNo);
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageDetail, err: null, data: { isLimitExists } });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Delete workorder serials by woID
    // DELETE : /api/v1/workorder_serialmst
    // @param {woID} int
    // @return API response
    deleteWorkorderSerials: (req, res) => {
        if (req.params.woID) {
            const { sequelize } = req.app.locals.models;

            if (req.params.serialType === (DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.FINAL_PRODUCT).toString()) {
                return sequelize.query('CALL Sproc_WorkOrder_serialResetMFR (:pwoID, :pserialType, :puserID, :pisMulitpleDelete, :pIDList)',
                    {
                        replacements: {
                            pwoID: req.params.woID,
                            pserialType: req.params.serialType,
                            puserID: req.user.id,
                            pisMulitpleDelete: req.query.isMultipleDelete ? true : false,
                            pIDList: req.query.IDList ? req.query.IDList.toString() : null
                        }
                    }).then((woserialmstdetails) => {
                        if (woserialmstdetails && woserialmstdetails[0].MatchCount === 0) {
                            // [S] add log of deleting work order serials for user timeline log
                            const serialObj = JSON.parse(req.query.serialObj);
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: workorderSerialObj.DELETE.title,
                                eventDescription: COMMON.stringFormat(workorderSerialObj.DELETE.description, serialObj.woNumber, req.user.username),
                                refTransTable: workorderSerialObj.refTransTableName,
                                refTransID: null,
                                eventType: timelineObj.id,
                                url: null,
                                eventAction: timelineEventActionConstObj.DELETE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of deleting work order serials for user timeline log
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(woSerialModuleName));
                        } else {
                            const messageSerialNoDeletionError = Object.assign({}, MESSAGE_CONSTANT.MFG.SERIAL_NO_DELETION_ERROR);
                            messageSerialNoDeletionError.message = COMMON.stringFormat(messageSerialNoDeletionError.message, req.query.PIDCode);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageSerialNoDeletionError, err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            } else {
                return sequelize.query('CALL Sproc_WorkOrder_serialResetFinalProduct(:pwoID,:pSerialType,:puserID,:pisMulitpleDelete,:pIDList)', {
                    replacements: {
                        pSerialType: req.params.serialType,
                        pwoID: req.params.woID,
                        puserID: req.user.id,
                        pisMulitpleDelete: req.query.isMultipleDelete ? true : false,
                        pIDList: req.query.IDList ? req.query.IDList.toString() : null
                    }
                }).then((responseSerial) => {
                    if (responseSerial && responseSerial[0].MatchCount === 1) {
                        const messageSerialNoDeletionError = Object.assign({}, MESSAGE_CONSTANT.MFG.SERIAL_NO_DELETION_ERROR);
                        messageSerialNoDeletionError.message = COMMON.stringFormat(messageSerialNoDeletionError.message, req.query.PIDCode);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageSerialNoDeletionError, err: null, data: null });
                    } else {
                        // [S] add log of deleting work order serials for user timeline log
                        const serialObj = JSON.parse(req.query.serialObj);
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: workorderSerialObj.DELETE.title,
                            eventDescription: COMMON.stringFormat(workorderSerialObj.DELETE.description, serialObj.woNumber, req.user.username),
                            refTransTable: workorderSerialObj.refTransTableName,
                            refTransID: null,
                            eventType: timelineObj.id,
                            url: null,
                            eventAction: timelineEventActionConstObj.DELETE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of deleting work order serials for user timeline log
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(woSerialModuleName));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get list of workorder serials by woID
    // GET : /api/v1/workorder_serialmst/getAllWorkorderSerialsByWoID
    // @param {woID} int
    // @return list of workorder serials
    getAllWorkorderSerialsByWoID: (req, res) => {
        if (req.params.woID) {
            const WorkorderSerialMst = req.app.locals.models.WorkorderSerialMst;

            return WorkorderSerialMst.findAll({
                where: {
                    woID: req.params.woID,
                    serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.MANUFACTURE
                }
            }).then(workorderSerials => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { workorderSerialsList: workorderSerials })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get list of serial number details
    // POST : /api/v1/workorder_serialmst/getSerialNumberDetailsByTransID
    // @return list of serial number details
    getSerialNumberDetailsByTransID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.operationObj) {
            return sequelize.query('CALL Sproc_GetWOSerialNumberStockDetailsByTransID (:pwoTransID)', {
                replacements: {
                    pwoTransID: req.body.operationObj.woTransID
                }
            }).then(stockInfo => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, stockInfo)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(productionHistoryModuleName), err: null, data: null });
        }
    },

    /**
     * list of workorder serials by woID and serialType
     * GET : /api/v1/getWorkorderSerialsForFinalProduct
     *  @param {woID} int
     *  @return list of final product serials
     */
    getWorkorderSerialsForFinalProduct: (req, res) => {
        if (req.params.woID) {
            const WorkorderSerialMst = req.app.locals.models.WorkorderSerialMst;

            return WorkorderSerialMst.findAll({
                where: {
                    woID: req.params.woID,
                    serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.FINAL_PRODUCT
                }
            }).then(workorderSerials => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { workorderSerialsList: workorderSerials })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of mapped serials by woID
    // GET : /api/v1/workorder_serialmst/mapProdSerial/retrieveAllMappedFinalProductSerials
    // @param {woID} int
    // @return list of workorder mapped serials
    retrieveAllMappedFinalProductSerials: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }
            return sequelize.query('CALL Sproc_RetrieveAllMappedFinalProductSerials (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pWoID,:pSerialType)',
                {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: strOrderBy,
                        pWhereClause: strWhere,
                        pWoID: req.body.woID ? req.body.woID : null,
                        pSerialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.FINAL_PRODUCT
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { mappedProductSerialsList: _.values(response[1]), Count: response[0][0]['TotalRecord'] })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // check MFR serial valid for mapping
    // GET : /api/v1/workorder_serialmst/mapProdSerial/checkMFGSerialValid
    // @param {woID} int
    // @param {MFGSerialNumber} string
    // @return serial valid for mapping
    checkMFGSerialValid: (req, res) => {
        if (req.body.woID && req.body.mfgSerialNumber) {
            const WorkorderSerialMst = req.app.locals.models.WorkorderSerialMst;
            return WorkorderSerialMst.findOne({
                where: {
                    woID: req.body.woID,
                    serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.MANUFACTURE,
                    SerialNo: req.body.mfgSerialNumber
                }
            }).then((workorderSerialExists) => {
                if (!workorderSerialExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(mfgSerialModuleName), err: null, data: null });
                }

                return WorkorderSerialMst.findOne({
                    where: {
                        woID: req.body.woID,
                        serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.FINAL_PRODUCT,
                        refMFGSerialNo: req.body.mfgSerialNumber
                    }
                }).then((workorderSerialMapped) => {
                    /* mgf serial already mapped */
                    if (workorderSerialMapped) {
                        const messageDetail = Object.assign({}, MESSAGE_CONSTANT.MFG.MFG_SERIAL_ALREADY_MAPPED);
                        messageDetail.message = COMMON.stringFormat(messageDetail.message, req.body.mfgSerialNumber, workorderSerialMapped.dataValues.SerialNo);

                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageDetail, err: null });
                    }
                    const mfgSerialRes = {
                        isValidForMapping: true
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { mfgSerialRes: mfgSerialRes });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // save work order product serial mapping information
    // GET : /api/v1/workorder_serialmst/mapProdSerial/saveProductSerialMapping
    // @param {woID} int
    // @param {productSerialNumber} string
    // @param {MFGSerialNumber} string
    // @return serial valid for mapping
    saveProductSerialMapping: (req, res) => {
        if (req.body.woID && req.body.woOPID && req.body.mfgSerialNumber && req.body.productSerialNumber) {
            const WorkorderSerialMst = req.app.locals.models.WorkorderSerialMst;

            /* check MFR serial exists */
            return WorkorderSerialMst.findOne({
                where: {
                    woID: req.body.woID,
                    serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.MANUFACTURE,
                    SerialNo: req.body.mfgSerialNumber
                }
            }).then((workorderMFRSerialExists) => {
                if (!workorderMFRSerialExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(mfgSerialModuleName), err: null, data: null });
                }

                /* check MFR serial already mapped */
                return WorkorderSerialMst.findOne({
                    where: {
                        woID: req.body.woID,
                        serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.FINAL_PRODUCT,
                        refMFGSerialNoId: workorderMFRSerialExists.ID
                    }
                }).then((workorderSerialMapped) => {
                    /* mgf serial already mapped */
                    if (workorderSerialMapped) {
                        const messageDetail = Object.assign({}, MESSAGE_CONSTANT.MFG.MFG_SERIAL_ALREADY_MAPPED);
                        messageDetail.message = COMMON.stringFormat(messageDetail.message, req.body.mfgSerialNumber, workorderSerialMapped.dataValues.SerialNo);

                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageDetail, err: null });
                    }

                    /* check product serial exists */
                    return WorkorderSerialMst.findOne({
                        where: {
                            woID: req.body.woID,
                            serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.FINAL_PRODUCT,
                            SerialNo: req.body.productSerialNumber
                        }
                    }).then((workorderSerialExists) => {
                        if (!workorderSerialExists) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(productSerialModuleName), err: null, data: null });
                        }

                        /* check product serial already mapped */
                        return WorkorderSerialMst.findOne({
                            where: {
                                woID: req.body.woID,
                                serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.FINAL_PRODUCT,
                                SerialNo: req.body.productSerialNumber,
                                refMFGSerialNoId: { [Op.ne]: null }
                            }
                        }).then((workorderSerialMappedDet) => {
                            /* product serial already mapped */
                            if (workorderSerialMappedDet) {
                                const messageDetail = Object.assign({}, MESSAGE_CONSTANT.MFG.PRODUCT_SERIAL_ALREADY_MAPPED);
                                messageDetail.message = COMMON.stringFormat(messageDetail.message, req.body.productSerialNumber, workorderSerialMappedDet.dataValues.refMFGSerialNo);

                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageDetail, err: null });
                            }
                            const updateMappingSerial = {
                                refMFGSerialNoId: workorderMFRSerialExists.ID,
                                mappingWOOPID: req.body.woOPID,
                                currStatus: workorderMFRSerialExists.currStatus,
                                curropID: workorderMFRSerialExists.curropID,
                                currwoOPID: workorderMFRSerialExists.currwoOPID,
                                currwoTransID: workorderMFRSerialExists.currwoTransID,
                                mappingBy: req.user.employeeID,
                                mappingOn: COMMON.getCurrentUTC(req),
                                updatedBy: req.user.id,
                                refMFGSerialNo: workorderMFRSerialExists.SerialNo
                            };
                            return WorkorderSerialMst.update(updateMappingSerial, {
                                where: {
                                    woID: req.body.woID,
                                    serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.FINAL_PRODUCT,
                                    SerialNo: req.body.productSerialNumber
                                },
                                fields: ['mappingWOOPID', 'currStatus', 'curropID', 'currwoOPID', 'currwoTransID', 'mappingBy', 'refMFGSerialNoId', 'mappingOn', 'updatedBy', 'refMFGSerialNo']
                            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(productSerialMappingModuleName))).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Delete workorder serials mapping for defined product serials
    // DELETE : /api/v1/workorder_serialmst/mapProdSerial/deleteProductSerialMapping
    // @param {serialIDs} int
    // @return API response
    deleteProductSerialMapping: (req, res) => {
        if (req.body.deleteObj && req.body.deleteObj.deleteSerialIDsMapping && req.body.deleteObj.deleteSerialIDsMapping.length > 0) {
            const WorkorderSerialMst = req.app.locals.models.WorkorderSerialMst;

            const updateMappingObj = {
                refMFGSerialNo: null,
                refMFGSerialNoId: null,
                mappingWOOPID: null,
                mappingBy: null,
                mappingOn: null,
                updatedBy: req.user.id
            };
            return WorkorderSerialMst.update(updateMappingObj, {
                where: {
                    ID: req.body.deleteObj.deleteSerialIDsMapping
                },
                fields: ['refMFGSerialNo', 'updatedBy', 'refMFGSerialNo', 'refMFGSerialNoId', 'mappingWOOPID', 'mappingBy', 'mappingOn']
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(productSerialMappingModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Function for get Detail of Serial# (Is Serial Mapping/MFR/Final SR# Count)
    getWOSerialDetail: (req) => {
        const { sequelize } = req.app.locals.models;

        return sequelize.query('CALL Sproc_GetWOSerialDetail (:pwoID)', {
            replacements: {
                pwoID: req.params.woID
            }
        }).then((workorderSerialDet) => {
            const serialDet = workorderSerialDet[0];
            if (serialDet.isAllowSerialMapping === 0 && serialDet.finalSRCount > 0 && serialDet.mfrSRCount > 0) {
                // MFR SR# Only
                return {
                    status: STATE.FAILED,
                    messageContent: MESSAGE_CONSTANT.MFG.MIS_MATCH_WITH_MFR_FINAL_SR_NUMBER,
                    err: null,
                    data: null
                };
            } else if (serialDet.isAllowSerialMapping > 0 && serialDet.mfrSRCount === 0) {
                // Mapping Operation
                return {
                    status: STATE.FAILED,
                    messageContent: MESSAGE_CONSTANT.MFG.MFR_SERIAL_MUST_REQUIRED,
                    err: null,
                    data: null
                };
            }
            const serialType = (serialDet.isAllowSerialMapping === 0) ?
                (serialDet.finalSRCount > 0 ? DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.FINAL_PRODUCT :
                    DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.MANUFACTURE) : null;
            return {
                status: STATE.SUCCESS,
                err: null,
                data: serialType
            };
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            };
        });
    },
    // Get and Validate of serial number detail
    // POST : /api/v1/workorder_serialmst/getVelidateSerialNumberDetails
    // @return serial number details
    getValidateSerialNumberDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.woID) {
            const promises = [];
            promises.push(module.exports.getWOSerialDetail(req));

            return Promise.all(promises).then((response) => {
                if (response && response[0] && response[0].status === STATE.FAILED) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: response[0].messageContent, err: response[0].err, data: response[0].data });
                } else {
                    const serialType = response[0] && response[0].data ? response[0].data : null;
                    return sequelize.query('CALL Sproc_GetScannedWOSerialNoDetial (:pWoID,:pSerialNo,:pSerialNoType)', {
                        replacements: {
                            pWoID: req.params.woID,
                            pSerialNoType: serialType,
                            pSerialNo: req.params.serialNo
                        }
                    }).then(workorderSerials => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workorderSerials[0])).catch((err) => {
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
    // Get and Validate of serial number detail
    // POST : /api/v1/workorder_serialmst/getValidateSerialNumberDetailsList
    // @return list of serial number details
    getValidateSerialNumberDetailsList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.query.woID) {
            req.params.woID = req.query.woID;

            const promises = [];
            promises.push(module.exports.getWOSerialDetail(req));

            return Promise.all(promises).then((response) => {
                if (response && response[0] && response[0].status === STATE.FAILED) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: response.status, err: response.err, data: response.data });
                } else {
                    response[0].data = response[0].data ? response[0].data : DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.MANUFACTURE;
                    return sequelize.query('CALL Sproc_GetValidateWOSerialNumber (:pWoID,:pSerialNoType,:pFromSerialNo,:pToSerialNo,:pQty,:pSearchType)', {
                        replacements: {
                            pWoID: req.query.woID,
                            pSerialNoType: response[0].data,
                            pFromSerialNo: req.query.fromSerialNo,
                            pToSerialNo: req.query.toSerialNo || null,
                            pQty: req.query.Qty || null,
                            pSearchType: req.query.selectionType
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(woSerialNoList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { woSerialNoList: _.values(woSerialNoList[0]) })).catch((err) => {
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
    // Get and serial number transaction History
    // POST : /api/v1/workorder_serialmst/getSerialNumberTransHistory
    // @return list of serial number details
    getSerialNumberTransHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.serialNoid) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }

            return sequelize.query('CALL Sproc_RetrieveWOTransSerialnoHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pWOSerialNoID)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: strOrderBy,
                    pWhereClause: strWhere,
                    pWOSerialNoID: req.body.serialNoid
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { serialNoTransHIstory: _.values(response[1]), Count: response[0][0]['TotalRecord'] })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // check MFR serial valid for mapping
    // GET : /api/v1/workorder_serialmst/checkMFGScanSerialValidForFirstArticle
    // @param {woID} int
    // @param {serialNo} string
    // @return serial valid for mapping
    checkMFGScanSerialValidForFirstArticle: (req, res) => {
        if (req.body.woID && req.body.serialNo && req.body.woOPID) {
            const { WorkorderSerialMst, WorkorderOperationFirstPiece } = req.app.locals.models;

            return WorkorderSerialMst.findOne({
                where: {
                    woID: req.body.woID,
                    serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.MANUFACTURE,
                    SerialNo: req.body.serialNo
                },
                attributes: ['SerialNo']
            }).then((workorderSerialData) => {
                if (!workorderSerialData) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }

                return WorkorderOperationFirstPiece.findOne({
                    where: {
                        woOPID: req.body.woOPID,
                        serialNo: req.body.serialNo
                    },
                    attributes: ['woOPID', 'serialno', 'currStatus']
                }).then(woOPFirstPieceData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    workorderSerialData: workorderSerialData,
                    woOPFirstPieceExistsData: woOPFirstPieceData
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};