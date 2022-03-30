const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const timelineObjForWoOpFirstPiece = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_FIRSTPIECE;
const WoOpFirstPieceConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_FIRSTPIECE;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const woOPFirPiesModuleName = DATA_CONSTANT.WORKORDER_OPERATION_FIRSTPIECE.NAME;

const inputFields = [
    'wofirstpieceID',
    'woID',
    'opID',
    'woopID',
    'prefixorsuffix',
    'Presuffix',
    'dateCode',
    'noofDigit',
    'serialno',
    'currStatus',
    'isDeleted',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'prefix',
    'suffix',
    'serialIntVal',
    'dateCodeFormat'
];

function generateSerial(str, len) {
    let s = '';
    const c = '0';
    len -= str.length;
    while (s.length < len) { s += c; }
    return s + str;
}

module.exports = {

    // Retrive list of workorder operation first piece
    // GET : /api/v1/workorder_operation_firstpiece
    // @return list of workorder operation first piece
    retriveWorkorderOperationFirstPieceByWoOp: (req, res) => {
        if (req.body.woopID && req.body.woID) {
            const { WorkorderOperationFirstPiece, WorkorderTransFirstPcsDet } = req.app.locals.models;

            return WorkorderOperationFirstPiece.findAll({
                where: {
                    // woID: req.query.woID,
                    woopID: req.body.woopID
                },
                attributes: ['wofirstpieceID', 'serialno', 'currStatus', 'prefixorsuffix', 'Presuffix', 'noofDigit', 'prefix', 'suffix', 'serialIntVal'],
                order: [['wofirstpieceID', 'DESC']],
                include: [{
                    model: WorkorderTransFirstPcsDet,
                    as: 'workorderTransFirstPcsDet',
                    attributes: ['woTransFirstpcsDetID', 'woTransFirstPieceID', 'issue', 'resolution', 'remark', 'updatedAt'],
                    required: false
                }]
            }).then((workorderFirstPieceSerials) => {
                const existsSerialPromise = [];
                let anyOneAddedSerialDet = null;
                if (workorderFirstPieceSerials && workorderFirstPieceSerials.length > 0) {
                    _.each(workorderFirstPieceSerials, (item) => {
                        if (item && item.workorderTransFirstPcsDet) {
                            if (item.workorderTransFirstPcsDet.issue) { item.workorderTransFirstPcsDet.issue = COMMON.getTextAngularValueFromDB(item.workorderTransFirstPcsDet.issue); }
                            if (item.workorderTransFirstPcsDet.resolution) { item.workorderTransFirstPcsDet.resolution = COMMON.getTextAngularValueFromDB(item.workorderTransFirstPcsDet.resolution); }
                        }
                    });
                } else if (req.body.isRequireToGetAnyOneSerialDet) {
                    // check any serial added then use that only prefix suffix and all that configuration details, no one can change
                    existsSerialPromise.push(
                        WorkorderOperationFirstPiece.findOne({
                            where: {
                                woID: req.body.woID
                            },
                            attributes: ['noofDigit', 'prefix', 'suffix']
                        }).then((anyOneAddedSerialDetResp) => {
                            anyOneAddedSerialDet = anyOneAddedSerialDetResp;
                        })
                    );
                }

                return Promise.all(existsSerialPromise).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    workorderFirstPieceSerialsList: workorderFirstPieceSerials,
                    anyOneAddedSerialDet: anyOneAddedSerialDet
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
    },
    // Create wWorkorder operation first piece serial
    // POST : /api/v1/workorder_operation_firstpiece
    // @return list of new created workorder operation first piece serial
    createWorkorderOperationFirstPieceSerial: (req, res) => {
        if (req.body && req.body.startNumber && req.body.woID && req.body.woopID && req.body.numOfSerialsToGenerate) {
            const { WorkorderOperationFirstPiece } = req.app.locals.models;
            if (req.body.dateCode) { req.body.dateCode = req.body.dateCode.toUpperCase(); }

            // first check new adding serial configuration is same as existing one
            return WorkorderOperationFirstPiece.findOne({
                where: {
                    woID: req.body.woID,
                    [Op.or]: [
                        { prefix: { [Op.ne]: req.body.prefix } },
                        { suffix: { [Op.ne]: req.body.suffix } },
                        { noofDigit: { [Op.ne]: req.body.noofDigit } }
                    ]
                },
                attributes: ['prefix', 'suffix', 'noofDigit']
            }).then((anyOneAddedMisMatchSerialResp) => {
                if (anyOneAddedMisMatchSerialResp) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null
                    });
                }

                return WorkorderOperationFirstPiece.count({
                    where: {
                        woID: req.body.woID,
                        woopID: req.body.woopID
                    }
                }).then((countOfFirstPieceSerials) => {
                    if (parseInt(countOfFirstPieceSerials) + parseInt(req.body.numOfSerialsToGenerate) > parseInt(req.body.buildQty || 0)) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                            { messageContent: MESSAGE_CONSTANT.MFG.SERIALS_MORETHAN_BUILD_QTY_MSG, err: null, data: null });
                    }

                    const totalSerialToApply = parseInt(req.body.numOfSerialsToGenerate) + parseInt(countOfFirstPieceSerials || 0);
                    if ((totalSerialToApply.toString()).length > req.body.noofDigit) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.MFG.WORKORDER_SERIAL_VALIDATION, err: null, data: null
                        });
                    }

                    let serialNoList = [];
                    let startFrom = req.body.startNumber;
                    let startFromIntVal = req.body.startNumber;

                    for (let i = 1; i <= req.body.numOfSerialsToGenerate; i += 1) {
                        serialNoList.push({
                            woID: req.body.woID,
                            opID: req.body.opID,
                            woopID: req.body.woopID,
                            // prefixorsuffix: req.body.prefixorsuffix,
                            // Presuffix: req.body.Presuffix,
                            dateCode: req.body.dateCode,
                            noofDigit: req.body.noofDigit,
                            currStatus: req.body.currStatus,
                            serialno: (req.body.prefix || '') + generateSerial(`${startFrom++}`, req.body.noofDigit) + (req.body.suffix || ''),
                            dateCodeFormat: req.body.dateCodeFormat,
                            prefix: req.body.prefix,
                            suffix: req.body.suffix,
                            serialIntVal: startFromIntVal++
                        });
                    }

                    /* create serials and return all of serials for work order operation first piece */
                    if (serialNoList.length > 0) {
                        const SerialNosToCheck = serialNoList.map(item => item.serialno);

                        /* check serials exists in work order */
                        return WorkorderOperationFirstPiece.findAll({
                            where: {
                                woOPID: req.body.woopID,
                                serialno: { [Op.in]: SerialNosToCheck }
                            },
                            attributes: ['serialno', 'woOPID', 'woID']
                        }).then((woOpSerialsAvailable) => {
                            if (woOpSerialsAvailable && woOpSerialsAvailable.length > 0) {
                                serialNoList = serialNoList.filter(o1 => !woOpSerialsAvailable.some(o2 => o1.serialno === o2.serialno));

                                if (serialNoList.length === 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.FAILED,
                                        {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                woOPExistsFirstArticleSerials: woOpSerialsAvailable
                                            }
                                        });
                                }
                            }

                            COMMON.setModelCreatedArrayFieldValue(req.user.id, serialNoList);

                            return WorkorderOperationFirstPiece.bulkCreate(serialNoList, {
                                individualHooks: true
                            }).then((woserials) => {
                                // [S] add log of creating wo op first piece serials for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: WoOpFirstPieceConstObj.CREATE.title,
                                    eventDescription: COMMON.stringFormat(WoOpFirstPieceConstObj.CREATE.description, req.body.opName, req.body.woNumber, req.user.username),
                                    refTransTable: WoOpFirstPieceConstObj.refTransTableName,
                                    refTransID: _.map(woserials, 'wofirstpieceID').toString(),
                                    eventType: timelineObjForWoOpFirstPiece.id,
                                    url: COMMON.stringFormat(WoOpFirstPieceConstObj.url, req.body.woopID),
                                    eventAction: timelineEventActionConstObj.CREATE
                                };
                                req.objEvent = objEvent;
                                TimelineController.createTimeline(req);
                                // [E] add log of creating wo op first piece serials  for timeline users

                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { woOPExistsFirstArticleSerials: woOpSerialsAvailable && woOpSerialsAvailable.length > 0 ? woOpSerialsAvailable : [] },
                                    MESSAGE_CONSTANT.CREATED(woOPFirPiesModuleName));
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
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
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
    // Create wWorkorder operation first piece
    // POST : /api/v1/workorder_operation_firstpiece/save_Workorder_Operation_Firstpiece
    // @return list of new created workorder operation first piece serial
    save_Workorder_Operation_Firstpiece: (req, res) => {
        if (req.body && req.body.woOpSerialList.length > 0) {
            const { WorkorderOperationFirstPiece, WorkorderTransFirstPcsDet } = req.app.locals.models;
            if (req.body.dateCode) { req.body.dateCode = req.body.dateCode.toUpperCase(); }

            const SerialNosToCheck = req.body.woOpSerialList.map(item => item.serialno);

            /* check serials exists in work order */
            return WorkorderOperationFirstPiece.findAll({
                where: {
                    woOPID: req.body.woOpSerialList[0].woopID,
                    serialno: { [Op.in]: SerialNosToCheck }
                },
                attributes: ['serialno', 'woOPID', 'woID']
            }).then((woOpSerialsAvailable) => {
                if (woOpSerialsAvailable && woOpSerialsAvailable.length > 0) {
                    req.body.woOpSerialList = req.body.woOpSerialList.filter(o1 => !woOpSerialsAvailable.some(o2 => o1.serialno === o2.serialno));

                    if (req.body.woOpSerialList.length === 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                            // MESSAGE_CONSTANT.WORKORDER_OPERATION_FIRSTPIECE.SERIAL_NO_EXISTS_IN_OTHER_WORKORDER_OPERATION
                            {
                                messageContent: null,
                                err: null,
                                data: {
                                    woOPExistsFirstArticleSerials: woOpSerialsAvailable
                                }
                            });
                    }
                }
                // else {

                COMMON.setModelCreatedArrayFieldValue(req.user, req.body.woOpSerialList);
                COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.woOpSerialList);

                return WorkorderOperationFirstPiece.bulkCreate(req.body.woOpSerialList, {
                    individualHooks: true
                }).then((woserials) => {
                    // [S] add log of adding wo op first piece serials for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: WoOpFirstPieceConstObj.ADD.title,
                        eventDescription: COMMON.stringFormat(WoOpFirstPieceConstObj.ADD.description, req.body.woOpObj.opName, req.body.woOpObj.woNumber, req.user.username),
                        refTransTable: WoOpFirstPieceConstObj.refTransTableName,
                        refTransID: _.map(woserials, 'wofirstpieceID').toString(),
                        eventType: timelineObjForWoOpFirstPiece.id,
                        url: COMMON.stringFormat(WoOpFirstPieceConstObj.url, req.body.woOpObj.woOPID),
                        eventAction: timelineEventActionConstObj.CREATE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log of adding wo op first piece serials  for timeline users


                    return WorkorderOperationFirstPiece.findAll({
                        where: {
                            woID: req.body.woOpSerialList[0].woID,
                            woOPID: req.body.woOpSerialList[0].woopID
                        },
                        attributes: ['wofirstpieceID', 'serialno', 'currStatus'],
                        order: [['wofirstpieceID', 'DESC']],
                        include: [{
                            model: WorkorderTransFirstPcsDet,
                            as: 'workorderTransFirstPcsDet',
                            attributes: ['woTransFirstpcsDetID', 'woTransFirstPieceID', 'issue', 'resolution', 'remark', 'updatedAt'],
                            required: false
                        }]
                    }).then(workorderFirstPieceSerials => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                        {
                            workorderFirstPieceSerialsList: workorderFirstPieceSerials,
                            woOPExistsFirstArticleSerials: woOpSerialsAvailable && woOpSerialsAvailable.length > 0 ? woOpSerialsAvailable : []
                        }, MESSAGE_CONSTANT.CREATED(woOPFirPiesModuleName))).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
                // }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // DELETE workorder operation first piece
    // DELETE : /api/v1/workorder_operation_firstpiece/deleteWorkorderOperationFirstpiece
    // @return API response
    deleteWorkorderOperationFirstpiece: (req, res) => {
        if (req.query.woID && req.query.woopID) {
            const { WorkorderOperationFirstPiece, WorkorderTransFirstPcsDet } = req.app.locals.models;

            return WorkorderTransFirstPcsDet.count({
                where: {
                    woOPID: req.query.woopID
                }
            }).then((woTransFPDet) => {
                /* if any serial is used in workorder_trans_firstpcsdet then not allowed to delete */
                if (woTransFPDet > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                        { messageContent: MESSAGE_CONSTANT.MFG.SERIAL_NO_ALREADY_IN_USE, err: null, data: null });
                }

                COMMON.setModelDeletedByFieldValue(req);
                return WorkorderOperationFirstPiece.update(req.body, {
                    where: {
                        woID: req.query.woID,
                        woopID: req.query.woopID,
                        deletedAt: null
                    },
                    fields: inputFields
                }).then(() => {
                    if (req.query.woOpObj) {
                        // [S] add log of deleting wo op first piece serials for timeline users
                        const woOpObj = JSON.parse(req.query.woOpObj);
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: WoOpFirstPieceConstObj.RESET.title,
                            eventDescription: COMMON.stringFormat(WoOpFirstPieceConstObj.RESET.description, woOpObj.opName, woOpObj.woNumber, req.user.username),
                            refTransTable: WoOpFirstPieceConstObj.refTransTableName,
                            refTransID: null,
                            eventType: timelineObjForWoOpFirstPiece.id,
                            url: COMMON.stringFormat(WoOpFirstPieceConstObj.url, req.query.woopID),
                            eventAction: timelineEventActionConstObj.DELETE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of deleting wo op first piece serials  for timeline users
                    }

                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(woOPFirPiesModuleName));
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
    // Retrieve list of added first article serials by woID/woOPID
    // POST : /api/v1/workorder_operation_firstpiece/getWOAllFirstPieceSerialsDet
    // @return list of work order first operation article serials to display in history
    getWOAllFirstPieceSerialsDet: (req, res) => {
        if (req.body && req.body.woID) {
            const { sequelize } = req.app.locals.models;

            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }

            return sequelize
                .query('CALL Sproc_GetWOAllFirstPieceSerialsAsHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pwoID)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: strOrderBy,
                            pWhereClause: strWhere,
                            pwoID: req.body.woID
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { firstArticleAllSerialsList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // check MFR serial valid for adding from previous operation
    // GET : /api/v1/workorder_serialmst/checkScanSerialExistsOnPrevOPFirstArticle
    // @param {woID} int
    // @param {serialNo} string
    // @param {currOPNumber} string
    // @return serial valid for mapping
    checkScanSerialExistsOnPrevOPFirstArticle: (req, res) => {
        if (req.body.woID && req.body.serialNo && req.body.currOPNumber) {
            const { WorkorderOperationFirstPiece, WorkorderOperation, WorkorderSerialMst } = req.app.locals.models;

            return WorkorderOperation.findAll({
                where: {
                    opNumber: { lt: req.body.currOPNumber },
                    woID: req.body.woID
                },
                attributes: ['woOPID']
            }).then((woOPListResp) => {
                if (!woOPListResp || woOPListResp.length === 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isSerialNotFound: true } });
                }

                return WorkorderOperationFirstPiece.findOne({
                    where: {
                        woOPID: { [Op.in]: _.map(woOPListResp, 'woOPID') },
                        serialno: req.body.serialNo
                    },
                    attributes: ['woOPID', 'serialno', 'currStatus', 'prefix', 'suffix', 'noofDigit', 'serialIntVal', 'dateCode', 'dateCodeFormat']
                }).then((woOPFirstPieceData) => {
                    if (woOPFirstPieceData) {
                        /* if operation track by serial no then check serials available in work order serial master table
                         operation track by serial no >> possible bulk then after operation track by serial so need to check */
                        if (req.body.isWOOPTrackBySerialNoConfiguration) {
                            return WorkorderSerialMst.findOne({
                                where: {
                                    woID: req.body.woID,
                                    SerialNo: req.body.serialNo,
                                    serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.MANUFACTURE
                                },
                                attributes: ['SerialNo']
                            }).then((woSerialMstResp) => {
                                if (woSerialMstResp) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                        prevOPFirstPieceExistsData: woOPFirstPieceData
                                    }, null);
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: null,
                                        err: null,
                                        data: { isSerialNotFound: true, isSerialNoGeneratedByBulkQtyOP: true }
                                    });
                                }
                            });
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                prevOPFirstPieceExistsData: woOPFirstPieceData
                            }, null);
                        }
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isSerialNotFound: true } });
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
    // Create Work order operation first piece - serials pick from previous operation
    // POST : /api/v1/workorder_operation_firstpiece/saveWOOPFirstpieceSerialsPickFromPrevOP
    // @return list of new created work order operation first piece serials
    saveWOOPFirstpieceSerialsPickFromPrevOP: (req, res) => {
        if (req.body && req.body.woOpSerialList && req.body.woOpSerialList.length > 0 && req.body.woOpObj.currOPNumber && req.body.woOpObj.woID) {
            const { WorkorderOperationFirstPiece, sequelize, WorkorderOperation, WorkorderSerialMst } = req.app.locals.models;
            let serialListToAdd = req.body.woOpSerialList;
            const prevWOOPNotContainSerialErrObj = Object.assign({}, MESSAGE_CONSTANT.MFG.PREV_WO_OP_NOT_CONTAIN_FIRST_ARTICLE_SERIAL);
            prevWOOPNotContainSerialErrObj.message = COMMON.stringFormat(prevWOOPNotContainSerialErrObj.message, 'Scanned');

            // check and get any prev op exists
            return WorkorderOperation.findAll({
                where: {
                    opNumber: { lt: req.body.woOpObj.currOPNumber },
                    woID: req.body.woOpObj.woID
                },
                attributes: ['woOPID']
            }).then((woOPListResp) => {
                if (!woOPListResp || woOPListResp.length === 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: prevWOOPNotContainSerialErrObj, err: null, data: null });
                }

                // check prev operation serials match/exists
                return WorkorderOperationFirstPiece.findAll({
                    where: {
                        woOPID: { [Op.in]: _.map(woOPListResp, 'woOPID') },
                        serialno: { [Op.in]: serialListToAdd.map(item => item.serialno) }
                    },
                    attributes: [[sequelize.fn('DISTINCT', sequelize.col('serialno')), 'serialno']]
                }).then((prevWOOPFirstPieceResp) => {
                    if (!prevWOOPFirstPieceResp || prevWOOPFirstPieceResp.length === 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: prevWOOPNotContainSerialErrObj, err: null, data: null });
                    }

                    // serialListToAdd > contain all adding and prevWOOPFirstPieceResp > serials whatever added only in prev op
                    serialListToAdd = serialListToAdd.filter(o1 => prevWOOPFirstPieceResp.some(o2 => o1.serialno === o2.serialno));

                    const checkValidSerialPromise = [];
                    /* if operation track by serial no then check serials available in work order serial master table
                    operation track by serial no >> possible bulk then after operation track by serial so need to check */
                    if (req.body.woOpObj.isWOOPTrackBySerialNoConfiguration) {
                        checkValidSerialPromise.push(
                            WorkorderSerialMst.findAll({
                                where: {
                                    woID: req.body.woOpObj.woID,
                                    SerialNo: { [Op.in]: serialListToAdd.map(item => item.serialno) },
                                    serialType: DATA_CONSTANT.WORKORDER_SERIALMST.SERIAL_TYPE.MANUFACTURE
                                },
                                attributes: ['SerialNo']
                            })
                        );
                    }

                    return Promise.all(checkValidSerialPromise).then((respOfCheckValidSerialPromise) => {
                        if (req.body.woOpObj.isWOOPTrackBySerialNoConfiguration) {
                            if (respOfCheckValidSerialPromise && respOfCheckValidSerialPromise.length > 0) {
                                const woMatchedSerialList = _.first(respOfCheckValidSerialPromise) || [];
                                serialListToAdd = serialListToAdd.filter(o1 => woMatchedSerialList.some(o2 => o1.serialno === o2.SerialNo));
                                if (!serialListToAdd || serialListToAdd.length === 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: prevWOOPNotContainSerialErrObj, err: null, data: null });
                                }
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: prevWOOPNotContainSerialErrObj, err: null, data: null });
                            }
                        }

                        /* check serials exists in current work order operation */
                        return WorkorderOperationFirstPiece.findAll({
                            where: {
                                woOPID: req.body.woOpObj.woOPID,
                                serialno: { [Op.in]: serialListToAdd.map(item => item.serialno) }
                            },
                            attributes: ['serialno', 'woOPID', 'woID']
                        }).then((woOpSerialsAvailable) => {
                            if (woOpSerialsAvailable && woOpSerialsAvailable.length > 0) {
                                serialListToAdd = serialListToAdd.filter(o1 => !woOpSerialsAvailable.some(o2 => o1.serialno === o2.serialno));

                                if (serialListToAdd.length === 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                                        {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                woOPExistsFirstArticleSerials: woOpSerialsAvailable
                                            }
                                        });
                                }
                            }

                            COMMON.setModelCreatedArrayFieldValue(req.user, serialListToAdd);
                            COMMON.setModelUpdatedByArrayFieldValue(req.user, serialListToAdd);

                            return sequelize.transaction().then(t => WorkorderOperationFirstPiece.bulkCreate(serialListToAdd, {
                                individualHooks: true,
                                transaction: t
                            }).then((woserials) => {
                                const woOPFPSerialsPromise = [];

                                // [S] add log of adding wo op first piece serials for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: WoOpFirstPieceConstObj.ADD.title,
                                    eventDescription: COMMON.stringFormat(WoOpFirstPieceConstObj.ADD.description, req.body.woOpObj.opName, req.body.woOpObj.woNumber, req.user.username),
                                    refTransTable: WoOpFirstPieceConstObj.refTransTableName,
                                    refTransID: _.map(woserials, 'wofirstpieceID').toString(),
                                    eventType: timelineObjForWoOpFirstPiece.id,
                                    url: COMMON.stringFormat(WoOpFirstPieceConstObj.url, req.body.woOpObj.woOPID),
                                    eventAction: timelineEventActionConstObj.CREATE
                                };
                                req.objEvent = objEvent;
                                woOPFPSerialsPromise.push(TimelineController.createTimeline(req, res, t));
                                // [E] add log of adding wo op first piece serials  for timeline users

                                return Promise.all(woOPFPSerialsPromise).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                    {
                                        woOPExistsFirstArticleSerials: woOpSerialsAvailable && woOpSerialsAvailable.length > 0 ? woOpSerialsAvailable : []
                                    }, MESSAGE_CONSTANT.CREATED(woOPFirPiesModuleName)))).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        t.rollback();
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            })).catch((err) => {
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
    }
};

