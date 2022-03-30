const fs = require('fs');
const _ = require('lodash');
const { Op } = require('sequelize');
const QRCode = require('qrcode');
const uuidv1 = require('uuid/v1');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const fsExtra = require('fs-extra');
// Added by Leena for POC - 07/02/2020
const hummus = require('hummus');
const memoryStreams = require('memory-streams');
const { getSystemIdPromise } = require('../../utility/controllers/UtilityController');

// Added by Leena for POC - 07/02/2020
const jsreport = require('jsreport-core')({
    allowLocalFilesAccess: true,
    reports: { async: true },
    reportTimeout: 180000,
    logger: {
        silent: false, // when true, it will silence all transports defined in logger,
        error: { transport: 'file', level: 'error', filename: 'logs/error.txt' },
        file: { transport: 'file', level: 'info', filename: 'logs/log.txt' },
        console: { transport: 'console', level: 'debug', filename: 'logs/console.txt' }
    },
    templatingEngines: {
        numberOfWorkers: 3,
        strategy: 'in-process',
        templateCache: {
            max: 100, // LRU cache with max 100 entries, see npm lru-cache for other options
            enabled: true // disable cache
        }
    }
});
// Added by Leena for POC - 07/02/2020
// jsreport.use(require('jsreport-chrome-pdf')());
// Added by Leena for POC - 07/02/2020
jsreport.use(require('jsreport-phantom-pdf')());
jsreport.use(require('jsreport-jsrender')());
// Added by Leena for POC - 07/02/2020
// jsreport.use(require('jsreport-handlebars')());
// jsreport.use(require('jsreport-pdf-utils')());
jsreport.use(require('jsreport-templates')());
// Added by Leena for POC - 07/02/2020
// install jsreport-wkhtmltopdf@2.1.1

jsreport.init();
const jsrender = require('jsrender');

const workOrderModuleName = DATA_CONSTANT.WORKORDER.NAME;
const timelineObj = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER;
const workorderObj = DATA_CONSTANT.TIMLINE.WORKORDER;
const timelineObjForPrintWoOpDet = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.PRINT_WORKORDER_OPERATION_DETAILS;
const printWoOpDetObj = DATA_CONSTANT.TIMLINE.PRINT_WORKORDER_OPERATION_DETAILS;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
const woTaskConfirmationObj = DATA_CONSTANT.TIMLINE.TASK_CONFIRMATION;
const timelineObjForWoDataElement = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_DATAELEMENT;
const WoDataElementConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_DATAELEMENT;
const woOpTimelineConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION;
const Entity = COMMON.AllEntityIDS;

const TimelineController = require('../../timeline/controllers/TimelineController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const WorkorderTransHoldUnholdController = require('../../workorder_trans_hold_unhold/controllers/Workorder_Trans_Hold_UnholdController');

// Added by Leena for POC - 07/02/2020
// const output_fn = "./uploads/test.pdf";
const config = require('./../../../config/config.js');
const { stringFormat } = require('../../constant/Common');
// const { utc } = require('moment');
// const { getCurrentUTC } = require('../../constant/Common');
// Added by Leena for POC - 07/02/2020
const inputFields = [
    'woID',
    'woNumber',
    'customerID',
    'excessQty',
    'buildQty',
    'startTime',
    'endTime',
    'selectedSampleID',
    'isClusterApplied',
    'isIncludeSubAssembly',
    'isDeleted',
    'masterTemplateID',
    'refrenceWOID',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'woStatus',
    'woSubStatus',
    'RoHSStatusID',
    'woVersion',
    'isOperationTrackBySerialNo',
    'ECORemark',
    'FCORemark',
    'locationDetails',
    'deletedAt',
    'isStopWorkorder',
    'isRevisedWO',
    'partID',
    'isOperationsVerified',
    'woType',
    'isHotJob',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'initialInternalVersion',
    'documentPath',
    'isRackTrackingRequired',
    'isStrictlyFollowRackValidation',
    'isInternalBuild',
    'proposedUmidQty',
    'dateCode',
    'dateCodeFormat',
    'isKitAllocationNotRequired',
    'woSeries',
    'buildNumber',
    'systemID'
];

const woSOinputFields = [
    'woSalesOrderDetID',
    'partID',
    'woID',
    'salesOrderDetailID',
    'poQty',
    'scrapQty',
    'isDeleted',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'qpa',
    'parentPartID'
];

const taskConfirmationInputFields = [
    'confID',
    'confirmationType',
    'signaturevalue',
    'reason',
    'autoRemark',
    'refTablename',
    'refId',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const genericFilesInputFields = [
    'gencFileName', 'gencOriginalName', 'gencFileDescription', 'gencFileExtension', 'gencFileType', 'isDefault',
    'refTransID', 'entityID', 'gencFileOwnerType', 'isActive', 'createdAt', 'createdBy', 'isShared', 'fileGroupBy',
    'refParentId', 'fileSize', 'refCopyTransID', 'refCopyGencFileOwnerType', 'createByRoleId', 'updateByRoleId',
    'deleteByRoleId', 'genFilePath'
];

module.exports = {
    // Retrive list of work-order
    // GET : /api/v1/workorders
    // @return list of work-order
    retriveWorkorders: (req, res) => {
        const { Workorder, MasterTemplate, WorkorderOperation, WorkorderReqForReview,
            WorkorderTransEmpinout, WorkorderTransHoldUnhold,
            Component, WorkorderCluster, RFQRoHS, WorkorderSalesOrderDetails } = req.app.locals.models;
        if (req.params.id) {
            // Workorder.findByPk(req.params.id)
            return Workorder.findAll({
                where: { woID: req.params.id },
                include: [
                    {
                        model: MasterTemplate,
                        as: 'masterTemplate',
                        required: false,
                        attributes: ['id', 'masterTemplate']
                    },
                    {
                        model: WorkorderCluster,
                        as: 'workordercluster',
                        required: false,
                        attributes: ['clusterID', 'clusterName']
                    },
                    {
                        model: WorkorderOperation,
                        as: 'workorderOperation',
                        required: false,
                        attributes: ['woOPID', 'opID', 'opNumber', 'opName']
                    },
                    {
                        model: WorkorderTransEmpinout,
                        as: 'workorderTransEmpinout',
                        attributes: ['woTransinoutID', 'woID', 'employeeID', 'opID', 'woOPID', 'checkinTime', 'checkoutTime'],
                        include: [
                            {
                                model: WorkorderOperation,
                                as: 'workorderOperation',
                                required: false,
                                attributes: ['woOPID', 'opID', 'opNumber']
                            }],
                        required: false
                    },
                    {
                        model: WorkorderReqForReview,
                        as: 'workorderReqForReview',
                        required: false,
                        attributes: ['woRevReqID', 'woID', 'requestType', 'threadTitle'],
                        where: {
                            woID: req.params.id,
                            requestType: 'I'
                        }
                    }, {
                        model: WorkorderTransHoldUnhold,
                        as: 'workorderTransHoldUnhold',
                        where: {
                            endDate: null
                        },
                        required: false,
                        attributes: ['woTransHoldUnholdId']
                    },
                    {
                        model: Component,
                        as: 'componentAssembly',
                        attributes: ['id', 'mfgPN', 'nickName', 'PIDCode', 'rev', 'mfgPNDescription', 'isCustom']
                    },
                    {
                        model: RFQRoHS,
                        as: 'rohs',
                        attributes: ['id', 'name', 'rohsIcon']
                    },
                    {
                        model: WorkorderSalesOrderDetails,
                        as: 'WoSalesOrderDetails',
                        attributes: ['woSalesOrderDetID', 'partID', 'salesOrderDetailID', 'woID', 'qpa', 'parentPartID'],
                        require: false
                    }
                ]
            }).then((workorder) => {
                if (!workorder) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: null, err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workorder, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Retrive list of work-order
    // POST : /api/v1/workorders/retriveWorkorderlist
    // @return list of RFQ
    retriveWorkorderlist: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            // created SP as we are displaying Assy. Number, Assy. Revision and Assy. Nick name which
            // are from another table and for filter and order we cannot use sequelize query
            return sequelize.query('CALL Sproc_GetWorkorder (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pWOId,:wosubstatusIds,:woTypeIds,:rohsStatusIds,:assyTypeIds,:stdCertificationIds,:stdclassIds,:isPendingSoMapping,:isPendingkitMapping,:isRunningwo,:isTrackBySerialNumber,:isrushJob,:isstoppedWo,:isnewWo,:isWaterSoluble,:isecodfm,:isOpenWo,:isInterBuildFilter,:customerIds,:salesOrderdetails,:assyIds,:assyNicknameIds,:operationIds,:employeeIds,:equipmentIds,:materialIds,:umidIds, :isNoClean, :isFluxNotApplicable,:isKitNotRequired)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pWOId: req.body.woID || 0,
                    wosubstatusIds: req.body.woSubStatusIds || null,
                    woTypeIds: req.body.woTypeIds || null,
                    rohsStatusIds: req.body.rohsStatusIds || null,
                    assyTypeIds: req.body.assyTypeIds || null,
                    stdCertificationIds: req.body.stdCertificationIds || null,
                    stdclassIds: req.body.stdclassIds || null,
                    isPendingSoMapping: req.body.isPendingSoMapping || false,
                    isPendingkitMapping: req.body.isPendingkitMapping || false,
                    isRunningwo: req.body.isRunningwo || false,
                    isTrackBySerialNumber: req.body.isTrackBySerialNumber || false,
                    isrushJob: req.body.isrushJob || false,
                    isstoppedWo: req.body.isstoppedWo || false,
                    isnewWo: req.body.isnewWo,
                    isWaterSoluble: req.body.isWaterSoluble,
                    isecodfm: req.body.isecodfm || false,
                    isOpenWo: req.body.isOpenWo,
                    isInterBuildFilter: req.body.isInterBuildFilter,
                    customerIds: req.body.customerIds || null,
                    salesOrderdetails: req.body.salesOrderdetails || null,
                    assyIds: req.body.assyIds || null,
                    assyNicknameIds: req.body.assyNicknameIds || null,
                    operationIds: req.body.operationIds || null,
                    employeeIds: req.body.employeeIds || null,
                    equipmentIds: req.body.equipmentIds || null,
                    materialIds: req.body.materialIds || null,
                    umidIds: req.body.umidIds || null,
                    isNoClean: req.body.isNoClean,
                    isFluxNotApplicable: req.body.isFluxNotApplicable,
                    isKitNotRequired: req.body.isKitNotRequired
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                workorder: _.values(response[1]),
                Count: response[0][0].TotalRecord,
                countTotalRowsOfWOTable: response[2][0]['COUNT(*)']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create new work-order
    // POST : /api/v1/workorders
    // @return API response
    createWorkorder: (req, res) => {
        if (req.body && req.body.openingStockOfAssyStockTypeConst) {
            const { sequelize, Workorder, WorkorderCertification, ComponentStandardDetails, AssemblyStock } = req.app.locals.models;

            return sequelize.transaction().then((t) => {
                const woCertiPromiseArray = [];
                return sequelize
                    .query(`SET @pWONumber = NULL;SET @pIsRepeat = NULL;SET @pIsNewRevision = NULL;SET @pWOType = NULL;CALL Sproc_GetMaxWONumberByCompNicknameSeries(${req.body.partID},${req.user.id},${req.user.defaultLoginRoleID},true, @pWONumber,@pIsRepeat,@pIsNewRevision,@pWOType); SELECT @pWONumber,@pWOType;`,
                        {
                            transaction: t
                        })
                    .then((respOfNewWOSeries) => {
                        if (!respOfNewWOSeries || !_.values(respOfNewWOSeries[0]) || !_.values(respOfNewWOSeries[0])[5]
                            || !_.first(_.values(respOfNewWOSeries[0])[5])['@pWONumber']) {
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }

                        const respOfNewWOSeriesData = _.first(_.values(respOfNewWOSeries[0])[5]);
                        req.body.woNumber = respOfNewWOSeriesData['@pWONumber'];
                        req.body.woType = respOfNewWOSeriesData['@pWOType'];
                        req.body.woSeries = req.body.woNumber.split('-')[0];
                        req.body.buildNumber = req.body.woNumber.split('-')[1];

                        return Workorder.findAll({
                            where: { woNumber: req.body.woNumber }
                        }).then((findworkorder) => {
                            if (findworkorder.length > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.WORKORDER.UNIQUE_FIELD), err: null, data: null });
                            }

                            // if Initial stock balance contain same wo number then not allowed to create
                            return AssemblyStock.findOne({
                                where: {
                                    woNumber: req.body.woNumber,
                                    type: req.body.openingStockOfAssyStockTypeConst
                                }
                            }).then((assyStockWODet) => {
                                if (assyStockWODet) {
                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.WO_EXISTS_IN_OPENING_PART_BAL_FOR_SAVE_IN_PROD);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.woNumber);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                                        {
                                            messageContent: messageContent,
                                            err: null,
                                            data: null
                                        });
                                }

                                COMMON.setModelCreatedByFieldValue(req);
                                if (req.body.isRevisedWO) {
                                    req.body.excessQty = 0;
                                    req.body.buildQty = 0;
                                }

                                // get new systemID det
                                return getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.WorkOrderSystemID, t).then((respOfWOSystemID) => {
                                    if (!respOfWOSystemID || respOfWOSystemID.status !== STATE.SUCCESS) {
                                        console.trace();
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: respOfWOSystemID ? respOfWOSystemID.message : null,
                                            data: null
                                        });
                                    }
                                    req.body.systemID = respOfWOSystemID.systemId;

                                    return Workorder.create(req.body, {
                                        fields: inputFields,
                                        transaction: t
                                    }).then(workorder => ComponentStandardDetails.findAll({
                                        where: {
                                            componentID: req.body.partID
                                        },
                                        attributes: ['certificateStandardID', 'ClassID'],
                                        transaction: t
                                    }).then((existsAllDBComponentCerti) => {
                                        if (existsAllDBComponentCerti && existsAllDBComponentCerti.length > 0) {
                                            const compAllStandardsToAdd = [];
                                            _.each(existsAllDBComponentCerti, (allStdItem) => {
                                                const addCertiObj = {};
                                                addCertiObj.woID = workorder.dataValues.woID;
                                                addCertiObj.certificateStandardID = allStdItem.certificateStandardID;
                                                addCertiObj.classIDs = allStdItem.ClassID;
                                                compAllStandardsToAdd.push(addCertiObj);
                                            });

                                            COMMON.setModelCreatedArrayFieldValue(req.user, compAllStandardsToAdd);
                                            woCertiPromiseArray.push(WorkorderCertification.bulkCreate(compAllStandardsToAdd, {
                                                transaction: t
                                            }));
                                        }

                                        // [S] add log of create work order for timeline users
                                        const objEvent = {
                                            userID: req.user.id,
                                            eventTitle: workorderObj.CREATE.title,
                                            eventDescription: COMMON.stringFormat(workorderObj.CREATE.description, workorder.woNumber, req.user.username),
                                            refTransTable: workorderObj.refTransTableName,
                                            refTransID: workorder.woID,
                                            eventType: timelineObj.id,
                                            url: COMMON.stringFormat(workorderObj.url, workorder.woID),
                                            eventAction: timelineEventActionConstObj.CREATE
                                        };
                                        req.objEvent = objEvent;
                                        woCertiPromiseArray.push(TimelineController.createTimeline(req, res, t));
                                        // [E] add log of create work order for timeline users

                                        if (req.body.taskConfirmationInfo) {
                                            const TaskConfirmation = req.app.locals.models.TaskConfirmation;
                                            req.body.taskConfirmationInfo.refId = workorder.woID;

                                            COMMON.setModelCreatedByFieldValue(req);
                                            req.body.taskConfirmationInfo.reason = COMMON.setTextAngularValueForDB(req.body.taskConfirmationInfo.reason);

                                            woCertiPromiseArray.push(TaskConfirmation.create(req.body.taskConfirmationInfo, {
                                                fields: taskConfirmationInputFields,
                                                transaction: t
                                            }));

                                            // [S] add task confirmation log to check for timeline users
                                            const objTaskConfirmEvent = {
                                                userID: req.user.id,
                                                eventTitle: woTaskConfirmationObj.SAVE.title,
                                                eventDescription: COMMON.stringFormat(woTaskConfirmationObj.SAVE.description, req.body.taskConfirmationInfo.confirmationType
                                                    , workorder.woNumber, req.user.username),
                                                refTransTable: woTaskConfirmationObj.refTransTableName,
                                                refTransID: workorder.woID,
                                                eventType: timelineObj.TASK_CONFIRMATION.id,
                                                url: COMMON.stringFormat(woTaskConfirmationObj.SAVE.url, workorder.woID),
                                                eventAction: timelineEventActionConstObj.CREATE
                                            };
                                            req.objEvent = objTaskConfirmEvent;
                                            woCertiPromiseArray.push(TimelineController.createTimeline(req, res, t));
                                            // [E] add task confirmation log to check for timeline users
                                        }

                                        /* copy Assembly Folder-Files to Work order level */
                                        woCertiPromiseArray.push(module.exports.copyAssemblyFolderFiles(req, res, t, workorder));

                                        return Promise.all(woCertiPromiseArray).then(() => t.commit().then(() => {
                                            // Add Work Order Detail into Elastic Search Engine for Enterprise Search
                                            req.params.woID = workorder.woID;
                                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWorkOrderDetailInElastic);

                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                                woID: workorder.woID,
                                                woNumber: req.body.woNumber,
                                                woType: req.body.woType,
                                                systemID: req.body.systemID
                                            }, MESSAGE_CONSTANT.CREATED(workOrderModuleName));
                                        })).catch((err) => {
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
                                        t.rollback();
                                        console.trace();
                                        console.error(err);
                                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                                        } else {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        }
                                    });
                                }).catch((err) => {
                                    t.rollback();
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }).catch((err) => {
                                t.rollback();
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            t.rollback();
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        t.rollback();
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

    /* copy assembly folder/files while create new work order */
    copyAssemblyFolderFiles: (req, res, t, workorder) => {
        const { sequelize } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_CopyAssyDocFolderToWODoc (:ppartID, :pwoID, :puserID)',
                {
                    replacements: {
                        ppartID: req.body.partID,
                        pwoID: workorder.woID,
                        puserID: req.user.id
                    },
                    transaction: t
                })
            .then(() =>

                /* copy all document from selected assembly/part master to work order  */
                sequelize.query('CALL Sproc_getRefTransDetailForDocument (:pGencFileOwnerType, :pRefTransID, :pIsReturnDetail)', {
                    replacements: {
                        pGencFileOwnerType: Entity.Workorder.Name,
                        pRefTransID: workorder.woID,
                        pIsReturnDetail: true
                    },
                    type: sequelize.QueryTypes.SELECT,
                    transaction: t
                }).then((respOfGetWONewPath) => {
                    const newCreatedWODocPathDet = _.first(_.values(respOfGetWONewPath[0]));
                    const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;

                    // create wo new doc path if not exists
                    let genWOFilePath = gencFileUploadPathConst;
                    const woFolders = newCreatedWODocPathDet.newDocumentPath.split('/');
                    _.each(woFolders, (folderItem) => {
                        genWOFilePath = `${genWOFilePath}${folderItem}/`;
                        if (!fs.existsSync(genWOFilePath)) {
                            fs.mkdirSync(genWOFilePath);
                        }
                    });

                    const requiredDet = {
                        model: {
                            partID: req.body.partID
                        },
                        newWorkOrderDet: {
                            woID: workorder.woID
                        },
                        newCreatedWODocPathDet: newCreatedWODocPathDet
                    };
                    const promisesOfCopyPartDocToWo = [];
                    promisesOfCopyPartDocToWo.push(module.exports.copyAssemblyDocToWOFolderPath(req, t, requiredDet));
                    return Promise.all(promisesOfCopyPartDocToWo).then(() => ({
                        isAssyDocCreated: true
                    }));
                }));
    },

    // Update work-order by work-order id
    // PUT : /api/v1/workorders
    // @param {id} int
    // @return API response
    updateWorkorder: (req, res) => {
        if (req.params.id) {
            const { sequelize, Workorder } = req.app.locals.models;
            COMMON.setModelUpdatedByFieldValue(req);
            return Workorder.findOne({
                where: {
                    woNumber: req.body.woNumber,
                    woID: { [Op.notIn]: [req.params.id] }
                }
            }).then((isWorkorderExists) => {
                if (isWorkorderExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.WORKORDER.UNIQUE_FIELD), err: null, data: null });
                } else {
                    // get exists work order
                    return Workorder.findOne({
                        where: {
                            woID: req.params.id
                        }
                    }).then((workorder) => {
                        if (req.body.isRevisedWO) {
                            if (workorder.isRevisedWO !== req.body.isRevisedWO) {
                                req.body.isOperationsVerified = false;
                            }
                            req.body.excessQty = 0;
                            req.body.buildQty = 0;
                        }
                        // update work order details
                        return sequelize.transaction().then(t => Workorder.update(req.body, {
                            where: {
                                woID: req.params.id
                            },
                            fields: inputFields,
                            transaction: t
                        }).then((rowsUpdated) => {
                            if (rowsUpdated[0] === 1) {
                                const updateWODetPromises = [];

                                // timeline log for update woStatus or wo details
                                if (req.body.taskConfirmationInfo && req.body.taskConfirmationInfo.confirmationType) {
                                    if (req.body.taskConfirmationInfo.confirmationType === DATA_CONSTANT.woQtyApprovalConfirmationTypes.WOStatusChangeRequest) {
                                        // [S] add log of update work order status for timeline users
                                        const objEvent = {
                                            userID: req.user.id,
                                            eventTitle: workorderObj.STATUS.title,
                                            eventDescription: COMMON.stringFormat(workorderObj.STATUS.description, req.body.woNumber, req.body.oldWoStatusText
                                                , req.body.newWoStatusText, req.user.username),
                                            refTransTable: workorderObj.refTransTableName,
                                            refTransID: req.params.id,
                                            eventType: timelineObj.WORKORDER_STATUS.id,
                                            url: COMMON.stringFormat(workorderObj.url, req.params.id),
                                            eventAction: timelineEventActionConstObj.UPDATE
                                        };
                                        req.objEvent = objEvent;
                                        updateWODetPromises.push(TimelineController.createTimeline(req, res, t));
                                        // [E] add log of update work order status for users
                                    }
                                } else {
                                    // [S] add log of update work order for timeline users
                                    const objEvent = {
                                        userID: req.user.id,
                                        eventTitle: workorderObj.UPDATE.title,
                                        eventDescription: COMMON.stringFormat(workorderObj.UPDATE.description, req.body.woNumber, req.user.username),
                                        refTransTable: workorderObj.refTransTableName,
                                        refTransID: req.params.id,
                                        eventType: timelineObj.id,
                                        url: COMMON.stringFormat(workorderObj.url, req.params.id),
                                        eventAction: timelineEventActionConstObj.UPDATE
                                    };
                                    req.objEvent = objEvent;
                                    updateWODetPromises.push(TimelineController.createTimeline(req, res, t));
                                    // [E] add log of update work order for users
                                }

                                // update task confirmation details
                                if (req.body.taskConfirmationInfo) {
                                    const TaskConfirmation = req.app.locals.models.TaskConfirmation;
                                    COMMON.setModelCreatedObjectFieldValue(req.user, req.body.taskConfirmationInfo);
                                    req.body.taskConfirmationInfo.reason = COMMON.setTextAngularValueForDB(req.body.taskConfirmationInfo.reason);

                                    updateWODetPromises.push(
                                        TaskConfirmation.create(req.body.taskConfirmationInfo, {
                                            fields: taskConfirmationInputFields,
                                            transaction: t
                                        }).then(() => {
                                            // [S] add task confirmation log to check for timeline users
                                            const objEvent = {
                                                userID: req.user.id,
                                                eventTitle: woTaskConfirmationObj.SAVE.title,
                                                eventDescription: COMMON.stringFormat(woTaskConfirmationObj.SAVE.description, req.body.taskConfirmationInfo.confirmationType
                                                    , req.body.woNumber, req.user.username),
                                                refTransTable: woTaskConfirmationObj.refTransTableName,
                                                refTransID: req.params.id,
                                                eventType: timelineObj.TASK_CONFIRMATION.id,
                                                url: COMMON.stringFormat(woTaskConfirmationObj.SAVE.url, req.params.id),
                                                eventAction: timelineEventActionConstObj.CREATE
                                            };
                                            req.objEvent = objEvent;
                                            return TimelineController.createTimeline(req, res, t);
                                            // [E] add task confirmation log to check for timeline users
                                        })
                                    );
                                }

                                return Promise.all(updateWODetPromises).then(() => t.commit().then(() => {
                                    // Add Work Order Detail into Elastic Search Engine for Enterprise Search
                                    req.params.woID = req.params.id;
                                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWorkOrderDetailInElastic);

                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(workOrderModuleName));
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    t.rollback();
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            } else {
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(workOrderModuleName), err: null, data: null });
                            }
                        }).catch((err) => {
                            t.rollback();
                            console.trace();
                            console.error(err);
                            if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            }
                        })
                        ).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Delete work-order by work-order id
    // DELETE : /api/v1/workorders
    // @param {id} int
    // @param {isPermanentDelete} boolean
    // @return API response
    deleteWorkorder: (req, res) => {
        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            const { GenericFiles, WorkorderOperation, sequelize } = req.app.locals.models;
            const tableName = Entity.Workorder.Name;
            const entityID = Entity.Workorder.ID;
            const workorderOperationEntity = Entity.Workorder_operation.Name;
            const workodrerEntity = Entity.Workorder.Name;
            let WorkorderOperationIds = [];
            let workorderOperationFileDataList = [];
            let workorderDocList = [];

            return WorkorderOperation.findAll({
                where: {
                    woID: { [Op.in]: req.body.objIDs.id }
                },
                attributes: ['woOPID']
            }).then((WorkorderOperationData) => {
                WorkorderOperationIds = WorkorderOperationData && WorkorderOperationData.length ?
                    WorkorderOperationData.map(item => item.woOPID) : [];

                return sequelize.transaction().then(t => sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                    {
                        replacements: {
                            tableName: tableName,
                            IDs: req.body.objIDs.id.toString(),
                            deletedBy: req.user.id,
                            entityID: entityID,
                            refrenceIDs: null,
                            countList: req.body.objIDs.CountList,
                            pRoleID: COMMON.getRequestUserLoginRoleID(req)
                        },
                        transaction: t
                    }).then((workorderDetail) => {
                        if (workorderDetail.length === 0) {
                            const deleteWOPromises = [];
                            COMMON.setModelDeletedByFieldValue(req);

                            deleteWOPromises.push(
                                GenericFiles.findAll({
                                    where: {
                                        refTransID: { [Op.in]: req.body.objIDs.id },
                                        gencFileOwnerType: workodrerEntity
                                    },
                                    attributes: ['genFilePath'],
                                    transaction: t
                                }).then((genericFileData) => {
                                    if (genericFileData && genericFileData.length) {
                                        workorderDocList = genericFileData;
                                        return GenericFiles.update(req.body, {
                                            where: {
                                                refTransID: { [Op.in]: req.body.objIDs.id },
                                                gencFileOwnerType: workodrerEntity,
                                                deletedAt: null
                                            },
                                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
                                            transaction: t
                                        });
                                    } else {
                                        return true;
                                    }
                                })
                            );

                            if (WorkorderOperationIds && WorkorderOperationIds.length) {
                                deleteWOPromises.push(
                                    GenericFiles.findAll({
                                        where: {
                                            refTransID: { in: WorkorderOperationIds },
                                            gencFileOwnerType: workorderOperationEntity
                                        },
                                        attributes: ['genFilePath'],
                                        transaction: t
                                    }).then((workorderOperationFileData) => {
                                        if (workorderOperationFileData && workorderOperationFileData.length) {
                                            workorderOperationFileDataList = workorderOperationFileData;
                                            return GenericFiles.update(req.body, {
                                                where: {
                                                    refTransID: { in: WorkorderOperationIds },
                                                    gencFileOwnerType: workorderOperationEntity,
                                                    deletedAt: null
                                                },
                                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
                                                transaction: t
                                            });
                                        } else {
                                            return true;
                                        }
                                    })
                                );
                            }

                            return Promise.all(deleteWOPromises).then(() => t.commit().then(() => {
                                // remove wok order documents
                                if (workorderDocList && workorderDocList && (req.body.objIDs.isPermanentDelete === 'true'
                                    || req.body.objIDs.isPermanentDelete === true)) {
                                    _.each(workorderDocList, (itemData) => {
                                        const docpath = `.${itemData.genFilePath}`;
                                        fs.unlink(docpath, () => { });
                                    });
                                }

                                // remove wok order all operations documents
                                if (workorderOperationFileDataList && workorderOperationFileDataList.length &&
                                    (req.body.objIDs.isPermanentDelete === 'true' || req.body.objIDs.isPermanentDelete === true)) {
                                    _.each(workorderOperationFileDataList, (itemData) => {
                                        const docpath = `.${itemData.genFilePath}`;
                                        fs.unlink(docpath, () => { });
                                    });
                                }

                                if (WorkorderOperationIds.length > 0) {
                                    // Delete Work order Operation Detail into Elastic Search Engine for Enterprise Search
                                    EnterpriseSearchController.deleteWorkOrderOperationDetailInElastic(WorkorderOperationIds.toString());
                                }
                                EnterpriseSearchController.deleteWorkOrderDetailInElastic(req.body.objIDs.id.toString());
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(workOrderModuleName));
                            })).catch((err) => {
                                if (!t.finished) t.rollback();
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: workorderDetail, IDs: req.body.objIDs.id }, null));
                        }
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null
                        });
                    });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get work-order operation detail by woOPID
    // GET : /api/v1/workorders/getWorkorderByWoOPID
    // @param {woOPID} int
    // @return work-order operation detail
    getWorkorderByWoOPID: (req, res) => {
        const { WorkorderOperation, Workorder } = req.app.locals.models;
        WorkorderOperation.findOne({
            where: {
                woOPID: req.params.woOPID
            },
            attributes: [],
            include: [{
                model: Workorder,
                as: 'workorder',
                attributes: ['woNumber', 'woStatus', 'woSubStatus']
            }]
        }).then(woOperation => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, woOperation.workorder, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
        });
    },
    // Get work-order detail by woID
    // GET : /api/v1/workorders/getWODetails
    // @param {woID} int
    // @return work-order detail
    getWODetails: (req, res) => {
        const { Workorder, Component, RFQRoHS } = req.app.locals.models;
        Workorder.findOne({
            where: {
                woID: req.params.woID
            },
            attributes: ['woNumber', 'woVersion', 'woStatus', 'woSubStatus', 'partID'],
            include: [{
                model: Component,
                as: 'componentAssembly',
                attributes: ['id', 'mfgPN', 'nickName', 'PIDCode', 'rev']
            },
            {
                model: RFQRoHS,
                as: 'rohs',
                attributes: ['id', 'name', 'rohsIcon']
            }]
        }).then(workorder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workorder, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
        });
    },
    // Save work-order version
    // POST : /api/v1/workorders/saveWOVersion
    // @return update work-order detail
    saveWOVersion: (req, res) => {
        const { Workorder } = req.app.locals.models;
        COMMON.setModelUpdatedByFieldValue(req);

        const woModel = {
            woID: req.body.woID,
            woVersion: req.body.woVersion,
            updatedBy: req.body.updatedBy
        };

        Workorder.update(woModel, {
            where: {
                woID: woModel.woID
            },
            fields: ['woVersion', 'updatedBy', 'updatedAt']
        }).then(() => {
            // [S] add log of update work order version for timeline users
            const objEventForWoVersion = {
                userID: req.user.id,
                eventTitle: workorderObj.WORKORDER_VERSION.title,
                eventDescription: COMMON.stringFormat(workorderObj.WORKORDER_VERSION.description, req.body.timelineObj.fromWOVersion
                    , req.body.woVersion, req.body.timelineObj.woNumber, req.user.username),
                refTransTable: workorderObj.refTransTableName,
                refTransID: req.body.woID,
                eventType: timelineObj.WORKORDER_VERSION.id,
                url: COMMON.stringFormat(workorderObj.url, req.body.woID),
                eventAction: timelineEventActionConstObj.UPDATE
            };
            req.objEvent = objEventForWoVersion;
            TimelineController.createTimeline(req);
            // [E] add log of update work order version for timeline users

            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get work-order profile detail by woID
    // GET : /api/v1/workorder_profile
    // @param {woID} int
    // @return update work-order detail
    getWorkorderProfileAPI: (req, res) => {
        req.params.woID = req.body.woID;
        module.exports.getWorkorderProfile(req, res);
    },


    // Get work-order profile detail by woID
    // GET : /api/v1/workorder_profile
    // @param {woID} int
    // @return update work-order detail
    getWorkorderProfile: (req, res) => {
        const { Workorder, WorkorderOperation, sequelize, MfgCodeMst, WorkorderCertification, CertificateStandards, StandardClass, WorkorderTransFirstPcsDet, WorkorderOperationEquipment, Equipment,
            Component, WorkorderSalesOrderDetails, WorkorderTransHoldUnhold, Employee,
            WorkorderTransOperationHoldUnhold, RFQMountingType, WorkorderOperationRefDesig } = req.app.locals.models;
        if (req.params.woID) {
            Workorder.findOne({
                where: {
                    woID: req.params.woID,
                    isDeleted: false
                },
                attributes: ['woID', 'woNumber', 'customerID', 'ECORemark', 'buildQty', 'RoHSStatusID', 'woVersion', 'FCORemark', 'isStopWorkorder',
                    'woSubStatus', 'selectedSampleID', 'isRackTrackingRequired', 'isStrictlyFollowRackValidation', 'isInternalBuild', 'proposedUmidQty', 'isKitAllocationNotRequired'],
                include: [{
                    model: WorkorderOperation,
                    as: 'workorderOperation',
                    attributes: ['woOPID', 'opName', 'opNumber', 'colorCode', 'opDescription', 'opDoes', 'opDonts', 'processTime', 'opVersion',
                        'cleaningType', 'isTeamOperation', 'opWorkingCondition', 'opManagementInstruction', 'opDeferredInstruction',
                        'isStopOperation', 'tabLimitAtTraveler', 'qtyControl', 'isRework', 'isIssueQty', 'isTrackBySerialNo', 'isTrackBySerialNo', 'isLoopOperation', 'refLoopWOOPID',
                        'isPreProgrammingComponent', 'isMoveToStock', 'isTeamOperation', 'isPlacementTracking', 'isAllowFinalSerialMapping', 'isAllowMissingPartQty', 'mountingTypeID',
                        'isAllowBypassQty', 'isFluxNotApplicable', 'isNoClean', 'isWaterSoluble', 'addRefDesig', 'isRequireMachineVerification', 'doNotReqApprovalForScan',
                        'isRequireRefDesWithUMID', 'isStrictlyLimitRefDes'
                    ],
                    include: [{
                        model: WorkorderTransFirstPcsDet,
                        as: 'workorderOperationFirstPcsDet',
                        attributes: ['woTransFirstpcsDetID'],
                        required: false
                    },
                    {
                        model: WorkorderOperation,
                        as: 'refLoopOperation',
                        attributes: ['opName'],
                        required: false
                    },
                    {
                        model: WorkorderOperationEquipment,
                        as: 'workorderOperationEquipment',
                        attributes: ['eqpID'],
                        required: false,
                        include: [{
                            model: Equipment,
                            as: 'equipment',
                            attributes: ['eqpID', 'assetName', 'eqpMake', 'eqpModel', 'eqpYear']
                        }]
                    },
                    {
                        model: WorkorderTransOperationHoldUnhold,
                        as: 'workorderTransOperationHoldUnhold',
                        where: {
                            endDate: null
                        },
                        required: false,
                        attributes: ['woTransOpHoldUnholdId', 'reason', 'resumeReason', 'startDate', 'endDate', 'holdEmployeeId'],
                        include: [{
                            model: Employee,
                            as: 'holdEmployees',
                            attributes: ['id', 'firstName', 'lastName', 'initialName'],
                            required: false
                        }]
                    },
                    {
                        model: RFQMountingType,
                        as: 'mountingType',
                        attributes: ['name'],
                        required: false
                    },
                    {
                        model: WorkorderOperationRefDesig,
                        as: 'workorderOperationRefDesigs',
                        attributes: ['id', 'woOPID', 'refDesig'],
                        required: false
                    }]
                }, {
                    model: WorkorderCertification,
                    as: 'workorderCertification',
                    attributes: ['woID', 'certificateStandardID', 'classIDs'],
                    include: [{
                        model: CertificateStandards,
                        as: 'certificateStandards',
                        attributes: ['certificateStandardID', 'priority', 'fullName'],
                        required: false
                    }, {
                        model: StandardClass,
                        as: 'standardsClass',
                        attributes: ['certificateStandardID', 'classID', 'className', 'colorCode'],
                        required: false
                    }],
                    required: false
                },
                {
                    model: Component,
                    as: 'componentAssembly',
                    attributes: ['mfgPN', 'nickName', 'PIDCode', 'rev']
                }, {
                    model: WorkorderSalesOrderDetails,
                    as: 'WoSalesOrderDetails',
                    attributes: ['woID', 'poQty', [sequelize.literal('fun_getPONumber(salesOrderDetailID)'), 'refPONumber']]

                }, {
                    model: WorkorderTransHoldUnhold,
                    as: 'workorderTransHoldUnhold',
                    where: {
                        endDate: null
                    },
                    required: false,
                    attributes: ['woTransHoldUnholdId', 'reason', 'resumeReason', 'startDate', 'holdEmployeeId'],
                    include: [{
                        model: Employee,
                        as: 'holdEmployees',
                        attributes: ['id', 'firstName', 'lastName', 'initialName'],
                        required: false
                    }]
                }]
            }).then((data) => {
                const WoID = data.woID;
                if (data && data.workorderOperation) {
                    _.each(data.workorderOperation, (operation) => {
                        if (operation.opDescription) { operation.opDescription = COMMON.getTextAngularValueFromDB(operation.opDescription); }
                        if (operation.opDoes) { operation.opDoes = COMMON.getTextAngularValueFromDB(operation.opDoes); }
                        if (operation.opDonts) { operation.opDonts = COMMON.getTextAngularValueFromDB(operation.opDonts); }
                        if (operation.opDeferredInstruction) { operation.opDeferredInstruction = COMMON.getTextAngularValueFromDB(operation.opDeferredInstruction); }
                        if (operation.opWorkingCondition) { operation.opWorkingCondition = COMMON.getTextAngularValueFromDB(operation.opWorkingCondition); }
                        if (operation.opManagementInstruction) { operation.opManagementInstruction = COMMON.getTextAngularValueFromDB(operation.opManagementInstruction); }
                        if (operation.firstPcsConclusion) { operation.firstPcsConclusion = COMMON.getTextAngularValueFromDB(operation.firstPcsConclusion); }
                    });
                }

                const obj = {};
                obj.workorderProfile = data;
                sequelize.query('CALL Sproc_GetWoOpDetails (:pwoID)',
                    {
                        replacements: {
                            pwoID: WoID
                        }
                    }).then((stockInfo) => {
                        if (stockInfo.length > 0) {
                            obj.operationInfo = stockInfo;
                            let woOPIDs = stockInfo.map(qty => qty.woOPID);
                            woOPIDs = woOPIDs.join();
                            return sequelize.query('CALL Sproc_GetCompletedProcessDetails (:pwoID,:pOPID)',
                                {
                                    replacements: {
                                        pwoID: WoID,
                                        pOPID: woOPIDs
                                    }
                                }).then((productionInfo) => {
                                    obj.productionInfo = productionInfo;
                                    return sequelize.query('CALL Sproc_GetWOSampleDetail (:pwoID)',
                                        {
                                            replacements: {
                                                pwoID: WoID
                                            }
                                        }).then((sampleInfo) => {
                                            obj.sampleInfo = sampleInfo;
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            obj.sampleInfo = null;
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    obj.operationInfo = null;
                                    obj.productionInfo = null;
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        obj.operationInfo = null;
                        obj.productionInfo = null;
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // Stop work-order
    // POST : /api/v1/workorders/stopWorkorder
    // @return API response
    stopWorkorder: (req, res) => {
        const {
            sequelize,
            Workorder,
            WorkorderTransHoldUnhold
        } = req.app.locals.models;
        const stopWOPromise = [];
        if (req.body && req.body.woID) {
            COMMON.setModelUpdatedByFieldValue(req);
            let whereClause;
            let attributes;
            if (req.body.woTransHoldUnholdId) {
                attributes = [[sequelize.fn('fun_getUserNameByEmployeID', sequelize.col('unHoldEmployeeId')), 'empName'], 'woTransHoldUnholdId', 'woID', 'unHoldEmployeeId', 'resumeReason', 'endDate'];
                whereClause = {
                    woTransHoldUnholdId: req.body.woTransHoldUnholdId,
                    woID: req.body.woID,
                    endDate: {
                        [Op.ne]: null
                    }
                };
            } else {
                attributes = [[sequelize.fn('fun_getUserNameByEmployeID', sequelize.col('holdEmployeeId')), 'empName'], 'woTransHoldUnholdId', 'woID', 'unHoldEmployeeId', 'resumeReason', 'endDate'];
                whereClause = {
                    woID: req.body.woID,
                    endDate: null
                };
            }
            return WorkorderTransHoldUnhold.findOne({
                where: whereClause,
                attributes: attributes
            }).then((isExist) => {
                if (!isExist) {
                    return sequelize.transaction().then((t) => {
                        Workorder.update(req.body, {
                            where: {
                                woID: req.body.woID
                            },
                            fields: ['isStopWorkorder', 'updatedBy'],
                            transaction: t
                        }).then(() => WorkorderTransHoldUnholdController.manageWorkorderTransHoldUnhold(req, t).then((response) => {
                            if (response) {
                                const holdWorkorderValue = response.dataValues;
                                // t.commit();
                                // Add Work Order Detail into Elastic Search Engine for Enterprise Search
                                req.params = {
                                    woID: req.body.woID
                                };
                                // Add Work order Detail into Elastic Search Engine for Enterprise Search
                                // Need to change timeout code due to trasaction not get updated record
                                setTimeout(() => {
                                    EnterpriseSearchController.manageWorkOrderDetailInElastic(req);
                                }, 2000);

                                // [S] add log of hold/resume work order for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: COMMON.stringFormat(workorderObj.HALT_RESUME_WORKORDER.title, req.body.isStopWorkorder ? 'halt' : 'resume'),
                                    eventDescription: COMMON.stringFormat(workorderObj.HALT_RESUME_WORKORDER.description, req.body.woNumber, req.body.isStopWorkorder ? 'halt' : 'resume', req.user.username),
                                    refTransTable: workorderObj.refTransTableName,
                                    refTransID: req.body.woID,
                                    eventType: timelineObj.id,
                                    url: COMMON.stringFormat(workorderObj.url, req.body.woID),
                                    eventAction: timelineEventActionConstObj.UPDATE
                                };
                                req.objEvent = objEvent;
                                stopWOPromise.push(TimelineController.createTimeline(req));
                                // [E] add log of stop work order for timeline users
                                return Promise.all(stopWOPromise).then(() => t.commit().then(() => {
                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.HALT_RESUME_SUCCESSFUL);
                                    if (req.body.isStopWorkorder) {
                                        messageContent.message = stringFormat(messageContent.message, 'Work Order', 'halted');
                                    } else {
                                        messageContent.message = stringFormat(messageContent.message, 'Work Order', 'resumed');
                                    }
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { holdWorkorderValue: holdWorkorderValue }, messageContent);
                                }));
                            } else {
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(workOrderModuleName), err: null, data: null });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            // new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(workOrderModuleName)));
                        });
                    });
                } else {
                    // message in case of already halt or resume
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.ALREADY_HOLDRESUME);
                    messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.WORKORDER.NAME, req.body.woTransHoldUnholdId ? DATA_CONSTANT.HOLD_UNHOLD_TRANS.ResumedMessage : DATA_CONSTANT.HOLD_UNHOLD_TRANS.HaltedMessage, isExist.dataValues.empName ? isExist.dataValues.empName : null);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: isExist });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            // new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get work-order detail
    // POST : /api/v1/workorders/getAllWorkOrderDetail
    // @return list of work-order detail
    getAllWorkOrderDetail: (req, res) => {
        const { Workorder } = req.app.locals.models;
        Workorder.findAll(
            {
                attributes: ['woID', 'woNumber']
            }
        ).then(workOrderList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workOrderList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
        });
    },
    // Get work-order author by woID
    // POST : /api/v1/workorders/getWorkorderAuthor
    // @param {woID} int
    // @return work-order author detail
    getWorkorderAuthor: (req, res) => {
        const { Workorder, User } = req.app.locals.models;

        return Workorder.findOne({
            where: {
                woID: req.params.woID
            },
            attributes: ['createdBy']
        }).then((response) => {
            if (response) {
                return User.findOne({
                    where: {
                        id: response.createdBy
                    },
                    attributes: ['employeeID']
                }).then((resp) => {
                    if (resp) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null);
                    } else { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName), err: null, data: null }); }
                    // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
                });
            } else { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName), err: null, data: null }); }
            // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
        });
    },
    // Get work-order and operation by woID
    // POST : /api/v1/workorders/getWorkorderOperationList
    // @param {woID} int
    // @return Workorder Operation List detail
    getWorkorderOperationList: (req, res) => {
        const { Workorder, WorkorderOperation } = req.app.locals.models;
        if (req.params.woID) {
            Workorder.findOne({
                where: { woID: req.params.woID },
                include: [
                    {
                        model: WorkorderOperation,
                        as: 'workorderOperation',
                        required: false,
                        attributes: ['woID', 'woOPID', 'opID', 'opNumber', 'opName', 'qtyControl']
                    }
                ]
            })
                .then((workorder) => {
                    if (!workorder) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName), err: null, data: null });
                        // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workorder);
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)),                        err.errors, err.fields);
                });
        }
    },
    // Verfiy work-order work-order
    // PUT : /api/v1/workorders
    // @param {id} int
    // @return API response
    verifyWorkorder: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.woID) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize
                .query('CALL Sproc_ValidateWorkorderAndPublish (:pwoID,:pwoStatus, :pupdatedBy)',
                    {
                        replacements: {
                            pwoID: req.body.woID,
                            pwoStatus: req.body.woSubStatus,
                            pupdatedBy: req.body.updatedBy
                        }
                    })
                .then((resultData) => {
                    if (resultData.length === 0) {
                        // [S] add log of verify work order for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: workorderObj.VERIFY_WORKORDER.title,
                            eventDescription: COMMON.stringFormat(workorderObj.VERIFY_WORKORDER.description, req.body.woNumber, req.user.username),
                            refTransTable: workorderObj.refTransTableName,
                            refTransID: req.body.woID,
                            eventType: timelineObj.VERIFY_WORKORDER.id,
                            url: COMMON.stringFormat(workorderObj.VERIFY_WORKORDER.url, req.body.woID),
                            eventAction: timelineEventActionConstObj.UPDATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of verify work order for timeline users
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MFG.WORKORDER_OPERATION_VERIFIED);
                    } else {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.DYNAMIC_ERROR);
                        messageContent.message = COMMON.stringFormat(messageContent.message, resultData.map(e => e.errorText).join('<br/>'));
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    getWorkorderWithAssyDetails: (req, res) => {
        const { Workorder, Component, RFQRoHS } = req.app.locals.models;
        Workorder.findAll({
            where: {
                woSubStatus: DATA_CONSTANT.WORKORDER.WOSUBSTATUS.PUBLISHED
            },
            attributes: ['woID', 'woNumber', 'buildQty', 'woID', 'partID', 'woVersion'],
            include: [{
                model: Component,
                as: 'componentAssembly',
                attributes: ['mfgPN', 'nickName', 'PIDCode', 'rev', 'mfgPNDescription']
            },
            {
                model: RFQRoHS,
                as: 'rohs',
                attributes: ['id', 'name', 'rohsIcon']
            }]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)),              err.errors, err.fields);
        });
    },

    // Retrieve list of work orders for accessing its workorder_trans_dataelement in report
    // POST : /api/v1/workorderinfo/retrieveAllWorkordersforTransDataElement
    // @return list of work orders
    retrieveAllWorkordersforTransDataElement: (req, res) => {
        const { Workorder } = req.app.locals.models;

        Workorder.findAll({
            where: {
                woStatus: { [Op.notIn]: [COMMON.WOSTATUS.COMPLETED, COMMON.WOSTATUS.VOID, COMMON.WOSTATUS.TERMINATED] }
            },
            attributes: ['woID', 'woNumber', 'woVersion']
        }).then(workorderlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { workorderlist: workorderlist }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
        });
    },

    // Get work-order autocomplete for copy workorder popup
    // POST : /api/v1/workorders/getWorkOrderListWithDetail
    // @return list of work-order detail
    getWorkOrderListWithDetail: async (req, res) => {
        const { Workorder, Component, RFQRoHS, MfgCodeMst, sequelize } = req.app.locals.models;
        const whereClause = {
            woSubStatus: {
                [Op.notIn]: [
                    COMMON.WOSUBSTATUS.DRAFT,
                    COMMON.WOSUBSTATUS.VOID,
                    COMMON.WOSUBSTATUS.DRAFTREVIEW
                ]
            }
        };
        const mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
            type: sequelize.QueryTypes.SELECT
        });
        if (req.body && req.body.searchWo) {
            whereClause.woNumber = { [Op.like]: `%${req.body.searchWo}%` };
        }
        if (req.body && req.body.searchWoID) {
            whereClause.woId = req.body.searchWoID;
        }
        const workOrderList = await Workorder.findAll(
            {
                where: whereClause,
                attributes: ['woID', 'woNumber', 'partID', 'excessQty', 'buildQty', 'ECORemark', 'FCORemark', 'customerID', 'partID', 'RoHSStatusID'],
                include: [{
                    model: Component,
                    as: 'componentAssembly',
                    attributes: ['id', 'PIDCode', 'mfgPN', 'rev', 'RoHSStatusID', 'partStatus'],
                    required: false
                }, {
                    model: RFQRoHS,
                    as: 'rohs',
                    attributes: ['id', 'name', 'rohsIcon'],
                    required: false
                }, {
                    model: MfgCodeMst,
                    as: 'customer',
                    attributes: ['mfgCode', 'mfgType', 'mfgName',
                        [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('customer.mfgCode'), sequelize.col('customer.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
                    required: false
                }]
            }
        );
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workOrderList, null);
        //.then(workOrderList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workOrderList, null)).catch((err) => {
        //     console.trace();
        //     console.error(err);
        //     return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        // });
    },
    // Print work-order with Operation
    // POST : /api/v1/printWoOPDetail
    // @return API response
    // eslint-disable-next-line consistent-return
    printWoOPDetail: (req, res) => {
        try {
            const templateFilePath = DATA_CONSTANT.WORKORDER_PRINT_TEMPLATE;
            fs.readFile(templateFilePath, 'utf8', (error, content) => {
                var template = jsrender.templates(content);

                const templateData = {
                    woNumber: req.body.woNumber,
                    nickName: req.body.nickName,
                    rev: req.body.rev,
                    rohsStatus: req.body.rohsStatus,
                    RoHSStatusID: req.body.RoHSStatusID,
                    isWatersoluble: req.body.isWatersoluble,
                    isNoClean: req.body.isNoClean,
                    opData: req.body.operationData
                };
                const loadJSreport = () => {
                    var html = template.render(templateData);

                    jsreport.render({
                        template: {
                            content: html,
                            engine: 'jsrender',
                            recipe: 'phantom-pdf',
                            phantom: {
                                orientation: 'portrait',
                                format: 'Letter',
                                printDelay: 500
                            }
                        }
                    }).then(() => {
                        // let filePath='D:\\Development\\FJT NEW\\FJT\\FJT\\fjt.api\\uploads\\workorder_print\\'+ req.body.woNumber +'.pdf';
                        // resp.stream.pipe(fs.createWriteStream(filePath));

                        // [S] add log of print work order operation details for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: printWoOpDetObj.title,
                            eventDescription: COMMON.stringFormat(printWoOpDetObj.description, req.body.opName,
                                req.body.woNumber, req.user.username),
                            refTransTable: null,
                            refTransID: null,
                            eventType: timelineObjForPrintWoOpDet.id,
                            url: COMMON.stringFormat(printWoOpDetObj.url, req.body.woOPID, req.body.employeeID),
                            eventAction: timelineEventActionConstObj.PRINT
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of print work order operation details for timeline users

                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, html, null);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
                    });
                };
                var opts = {
                    errorCorrectionLevel: 'H',
                    type: 'image/jpeg',
                    rendererOpts: {
                        quality: 0.3
                    }
                };
                var segs = [
                    { data: 'WO', mode: 'alphanumeric' },
                    { data: templateData.woNumber, mode: 'alphanumeric' },
                    { data: ' AN', mode: 'alphanumeric' },
                    { data: templateData.nickName, mode: 'alphanumeric' },
                    { data: ' AR', mode: 'alphanumeric' },
                    { data: templateData.rev, mode: 'alphanumeric' },
                    { data: ' LF', mode: 'alphanumeric' },
                    { data: templateData.RoHSStatusID ? 'Yes' : 'No', mode: 'Byte' },
                    { data: ' NC', mode: 'alphanumeric' },
                    { data: templateData.isNoClean ? 'Yes' : 'No', mode: 'Byte' },
                    { data: ' WS', mode: 'alphanumeric' },
                    { data: templateData.isWatersoluble ? 'Yes' : 'No', mode: 'Byte' }
                ];
                // eslint-disable-next-line consistent-return
                QRCode.toDataURL(segs, opts, (err, url) => {
                    if (err) {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, err.message);
                    }
                    if (url) {
                        templateData.imageURL = url;
                    }
                    loadJSreport();
                });
            });
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
        }
    },

    // Get work-order details by woID to display details in header
    // GET : /api/v1/workorder/getWorkorderHeaderDisplayDetails
    // @param {woID} int
    // @return update work-order detail
    getWorkorderHeaderDisplayDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.woID) {
            const allCleaningType = DATA_CONSTANT.Wo_Op_Cleaning_Type;

            return sequelize.query('CALL Sproc_GetWOHeaderDisplayDetails(:pwoID,:pwoOPID, :pwoTransID,:pWaterSolubleCleanType,:pNoCleanCleanType,:pwoAssyID,:pemployeeIDOfWOOP)', {
                replacements: {
                    pwoID: req.body.woID,
                    pwoOPID: req.body.woOPID ? req.body.woOPID : null,
                    pwoTransID: req.body.woTransID ? req.body.woTransID : null,
                    pWaterSolubleCleanType: allCleaningType.Water_Soluble,
                    pNoCleanCleanType: allCleaningType.No_Clean,
                    pwoAssyID: req.body.woAssyID,
                    pemployeeIDOfWOOP: req.body.employeeIDOfWOOP || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, null);
                    // {messageContent: null, err:null, data:null} -- using this will send  [object object] to UI
                }
                const headerDetails = {
                    woAllHeaderDetails: _.values(response[0]).length > 0 ? (_.first(_.values(response[0]))) : (null),
                    timerData: _.values(response[1]).length > 0 ? (_.first(_.values(response[1]))) : (null),
                    timerCurrentData: _.values(response[2]).length > 0 ? (_.first(_.values(response[2]))) : (null),
                    LastECODetail: _.values(response[3]).length > 0 ? (_.first(_.values(response[3]))) : (null),
                    LastDFMDetail: _.values(response[4]).length > 0 ? (_.first(_.values(response[4]))) : (null),
                    exportControlledAssemblyDet: _.values(response[5]).length > 0 ? (_.first(_.values(response[5]))) : (null),
                    woOPEmpWiseTotTimeConsumptionDet: _.values(response[6]).length > 0 ? (_.first(_.values(response[6]))) : (null)
                };
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, headerDetails, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get all location of sample details
    // GET : /api/v1/workorder/getAllLocationDetailsOfSample
    // @param {woID} int
    // @return all locations
    getAllLocationDetailsOfSample: (req, res) => {
        const { Workorder, sequelize } = req.app.locals.models;
        const whereClause = {
            locationDetails: { [Op.ne]: null }
        };
        if (req.body && req.body.locationDetails) {
            whereClause[Op.and] = { locationDetails: { [Op.like]: `%${req.body.locationDetails}%` } };
        }

        Workorder.findAll({
            where: whereClause,
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('locationDetails')), 'locationDetails']]
        }).then(allLocations => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, allLocations, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Retrieve list of work orders that already used given partID (component)
    // POST : /api/v1/workorderinfo/getAllWORFQContainSamePartID (component)
    // @return list of work orders
    getAllWORFQContainSamePartID: (req, res) => {
        const { Workorder, RFQForms, RFQAssemblies, sequelize } = req.app.locals.models;

        const WOWhereClause = {
            woStatus: { [Op.notIn]: [COMMON.WOSTATUS.COMPLETED, COMMON.WOSTATUS.VOID, COMMON.WOSTATUS.TERMINATED] },
            partID: req.body.dataObj.partID
        };
        if (req.body && req.body.dataObj && req.body.dataObj.woID) {
            WOWhereClause.woID = { [Op.ne]: req.body.dataObj.woID };
        }
        Workorder.findAll({
            where: WOWhereClause,
            attributes: ['woID', 'woNumber', 'woVersion', 'woSubStatus']
        }).then((workorderlist) => {
            const RFQWhereClause = {};
            if (req.body && req.body.dataObj && req.body.dataObj.rfqFormsID) {
                RFQWhereClause.id = { [Op.ne]: req.body.dataObj.rfqFormsID };
            }

            RFQForms.findAll({
                where: RFQWhereClause,
                attributes: ['id'],
                include: [{
                    model: RFQAssemblies,
                    as: 'rfqAssemblies',
                    attributes: ['id', 'quoteInDate'],
                    where: {
                        partID: req.body.dataObj.partID,
                        isSummaryComplete: 0
                    }
                }]
            }).then((rfqList) => {
                if (req.body && req.body.dataObj && req.body.dataObj.deletedStandard && req.body.dataObj.deletedStandard.length > 0) {
                    const ComponentStandardDetailsWhereClause = req.body.dataObj.deletedStandard.join();
                    return sequelize.query('CALL Sproc_GetChildPartExportControlled (:pPartID, :pStandardIds)', {
                        replacements: {
                            pPartID: req.body.dataObj.partID,
                            pStandardIds: ComponentStandardDetailsWhereClause
                        }
                    }).then(deletedStandardComponent => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { WOListContainSamePartID: workorderlist, RFQListContainSamePartID: rfqList, DeletedStandardComponent: deletedStandardComponent }, null)).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { WOListContainSamePartID: workorderlist, RFQListContainSamePartID: rfqList }, null);
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
    },


    // Retrive list of workorder entity data elements
    // POST : /api/v1/workorders/retrieveWorkorderEntityDataElements
    // @return list of workorder entity data elements
    retrieveWorkorderEntityDataElements: (req, res) => {
        const { Sequelize, WorkorderDataelement, DataElement } = req.app.locals.models;
        if (req.body && req.body.workorderObj) {
            return WorkorderDataelement.findAll({
                where: {
                    woID: req.body.workorderObj.woID,
                    isDeleted: false
                },
                attributes: ['woDataElementID', 'woID', 'dataElementID', 'displayOrder']
            }).then(workorderDataelement => DataElement.findAll({
                where: Sequelize.and({
                    entityID: req.body.workorderObj.id
                },
                    Sequelize.or({
                        isDeleted: false
                    },
                        {
                            dataElementID: {
                                in: _.map(workorderDataelement, 'dataElementID')
                            }
                        })
                ),
                paranoid: false,
                attributes: ['dataElementID', 'dataElementName', 'entityID', 'controlTypeID', 'parentDataElementID', 'dataelement_use_at']
            }).then(getEntityData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dataelements: getEntityData, workorderElements: workorderDataelement }, null))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPElemModuleName)));
        }
    },
    // Create workorder dataElements
    // POST : /api/v1/workorders/createWorkorderDataElements
    // @return API response
    createWorkorderDataElements: (req, res) => {
        const { sequelize, WorkorderDataelement } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.dataElementList) {
            return sequelize.transaction().then((t) => {
                const promises = [];
                _.each(req.body.listObj.dataElementList, (item) => {
                    /* update display_order of already exists */
                    if (item.woDataElementID) {
                        promises.push(WorkorderDataelement.update({ displayOrder: item.displayOrder }, {
                            where: {
                                woDataElementID: item.woDataElementID
                            },
                            fields: ['displayOrder']
                        }, { transaction: t }).then(response => Promise.resolve(response)));
                    } else {
                        /* add new data elements in workorder */
                        promises.push(WorkorderDataelement.create({
                            woID: item.woID,
                            dataElementID: item.dataElementID,
                            displayOrder: item.displayOrder,
                            createdBy: req.user.id
                        }, { transaction: t }).then(response => Promise.resolve(response)));
                    }
                });
                // return Promise.all(promises);
                return Promise.all(promises).then(result => t.commit().then(() => {
                    // [S] add log of adding data element to wo for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: WoDataElementConstObj.CREATE.title,
                        eventDescription: COMMON.stringFormat(WoDataElementConstObj.CREATE.description, req.body.listObj.woNumber, req.user.username),
                        refTransTable: WoDataElementConstObj.refTransTableName,
                        refTransID: _.map(result, 'woDataElementID').toString(),
                        eventType: timelineObjForWoDataElement.id,
                        url: COMMON.stringFormat(WoDataElementConstObj.CREATE.url, req.body.listObj.woID),
                        eventAction: timelineEventActionConstObj.CREATE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log of adding data element to wo for timeline users
                    if (req.body.listObj.isInnerSortingOfElement) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.WORKORDER_DATAELEMENT.DATAELEMENT_ORDER_UPDATED);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.WORKORDER_DATAELEMENT.DATAELEMENT_ADDED_TO_WORKORDER);
                    }
                })).catch((err) => {
                    if (!t.finished) t.rollback();
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        // new NotCreate(MESSAGE_CONSTANT.WORKORDER_DATAELEMENT.DATAELEMENT_NOT_ADDED_TO_WORKORDER));
                    }
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Delete workorder dataElements
    // POST : /api/v1/workorder_dataelement/deleteWorkorderDataElements
    // @return API response
    deleteWorkorderDataElements: (req, res) => {
        const { sequelize, WorkorderDataelement, DataElementTransactionValues } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.dataElementList) {
            return sequelize.transaction().then(t => WorkorderDataelement.findAll({
                attributes: ['dataElementID'],
                where: {
                    woID: req.body.listObj.woID
                }
            }).then((respOfWODataElementList) => {
                let removeWODataElementIDs = [];
                if (respOfWODataElementList && respOfWODataElementList.length > 0) {
                    removeWODataElementIDs = _.difference(_.map(respOfWODataElementList, 'dataElementID'), _.map(req.body.listObj.dataElementList, 'dataElementID'));
                }

                const notDeleteWoDataElementIDs = req.body.listObj.dataElementList.map(item => item.woDataElementID);
                const whereStatement = {};
                /* notDeleteWoDataElementIDs - delete other than this all ids and update displayOder of all these ids */
                if (notDeleteWoDataElementIDs.length > 0) {
                    whereStatement.woID = req.body.listObj.woID;
                    whereStatement.woDataElementID = { [Op.notIn]: notDeleteWoDataElementIDs };
                    whereStatement.deletedAt = null;
                } else {
                    /* no any notDeleteWoDataElementIDs means delete all element which is in workorder */
                    whereStatement.woID = req.body.listObj.woID;
                    whereStatement.deletedAt = null;
                }

                COMMON.setModelDeletedByFieldValue(req);

                return WorkorderDataelement.update(req.body, {
                    where: whereStatement,
                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
                    transaction: t
                }).then(() => {
                    const promises = [];
                    _.each(req.body.listObj.dataElementList, (item) => {
                        if (item.woDataElementID) {
                            promises.push(WorkorderDataelement.update({ displayOrder: item.displayOrder }, {
                                where: {
                                    woDataElementID: item.woDataElementID
                                },
                                fields: ['displayOrder'],
                                transaction: t
                            }));
                        }
                    });

                    if (removeWODataElementIDs && removeWODataElementIDs.length > 0 && req.body.listObj.entityID && req.body.listObj.woID) {
                        const removeDataElementValues = {};
                        COMMON.setModelDeletedByObjectFieldValue(req.user, removeDataElementValues);
                        promises.push(
                            DataElementTransactionValues.update(removeDataElementValues, {
                                where: {
                                    dataElementID: { [Op.in]: removeWODataElementIDs },
                                    refTransID: req.body.listObj.woID,
                                    entityID: req.body.listObj.entityID
                                },
                                transaction: t
                            }));
                    }

                    // return Promise.all(promises);
                    return Promise.all(promises).then(() => t.commit().then(() => {
                        // [S] add log of delete data element from wo for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: WoDataElementConstObj.DELETE.title,
                            eventDescription: COMMON.stringFormat(WoDataElementConstObj.DELETE.description, req.body.listObj.woNumber, req.user.username),
                            refTransTable: WoDataElementConstObj.refTransTableName,
                            refTransID: null,
                            eventType: timelineObjForWoDataElement.id,
                            url: COMMON.stringFormat(WoDataElementConstObj.DELETE.url, req.body.listObj.woID),
                            eventAction: timelineEventActionConstObj.DELETE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of delete data element from wo for timeline users
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.WORKORDER_DATAELEMENT.DATAELEMENT_DELETED_FROM_WORKORDER);
                    })).catch((err) => {
                        if (!t.finished) t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        // new NotCreate(MESSAGE_CONSTANT.WORKORDER_DATAELEMENT.DATAELEMENT_NOT_DELETED_FROM_WORKORDER));
                    });
                }).catch((err) => {
                    if (!t.finished) t.rollback();
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    // new NotCreate(MESSAGE_CONSTANT.WORKORDER_DATAELEMENT.DATAELEMENT_NOT_DELETED_FROM_WORKORDER));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            // new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },


    // Retrieve list of workorder data element
    // GET : /api/v1/workorders/retrieveWorkorderDataElementList
    // @return list of workorder data element
    retrieveWorkorderDataElementList: (req, res) => {
        const { DataElement, WorkorderDataelement } = req.app.locals.models;
        DataElement.findAll({
            include: [{
                model: WorkorderDataelement,
                as: 'workorderDataelement',
                where: {
                    woID: req.params.woID
                }
            }
            ]
        }).then((getWorkorderData) => {
            var promiseCustomEntity = [];
            if (!getWorkorderData) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getWorkorderData, null);
            }
            const isContainFixedEntity = _.some(getWorkorderData, item => item.isFixedEntity && item.datasourceID);
            const isContainCustomEntity = _.some(getWorkorderData, item => item.datasourceDisplayColumnID && item.datasourceID);
            const isContainManualEntity = _.some(getWorkorderData, item => item.isManualData);
            if (isContainManualEntity) {
                /* retrieve Manual data of selected data element  */
                promiseCustomEntity.push(module.exports.updateElementInfoForManualWo(req, res, getWorkorderData));
            }

            if (isContainCustomEntity) {
                /* retrieve and set custom entity master data to choice selection data element */
                promiseCustomEntity.push(module.exports.updateElementInfoForCustomEntityWo(req, res, getWorkorderData));
            }
            return Promise.all(promiseCustomEntity).then(() => {
                if (isContainFixedEntity) {
                    /* retrieve and set fixed entity master data to choice selection data element */
                    return module.exports.updateElementInfoForFixedEntityWo(req, res, getWorkorderData);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getWorkorderData, null);
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
    },


    // Copy master template check template name unique validation
    // POST : /api/v1/mastertemplate/copyMasterTemplate
    // @return List of copy operation and template
    convertToMasterTemplate: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.obj) {
            return sequelize.query('CALL Sproc_convertToMasterTemplate (:pmasterTemplate,:pdescription,:pwoID, :pcreatedBy)',
                {
                    replacements: {
                        pmasterTemplate: req.body.obj.masterTemplate,
                        pdescription: req.body.obj.description ? req.body.obj.description : null,
                        pwoID: req.body.obj.woID,
                        pcreatedBy: req.user.id
                    }
                })
                .then((resultData) => {
                    if (resultData && resultData.length > 0) {
                        if (resultData[0] && resultData[0].masterTemplateID > 0) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { masterTemplateID: resultData[0].masterTemplateID }, MESSAGE_CONSTANT.WORKORDER.CONVERTED_TO_TEMPLATE);
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: { message: resultData.map(e => e.errorText).join('<br/>') }, data: null });
                        }
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.WORKORDER.CONVERTED_TO_TEMPLATE);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.WORKORDER.ERROR_IN_CONVERT_TO_TEMPLATE, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            //            new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    /* local function for update data_element information with Fixed Master data value */
    updateElementInfoForFixedEntityWo: (req, res, getWorkorderData) => {
        const { sequelize, FixedEntityDataelement } = req.app.locals.models;
        const fixedEntityElements = _.filter(getWorkorderData, item => item.isFixedEntity && item.datasourceID);

        /* get all fixed entity details */
        FixedEntityDataelement.findAll({
            where: {
                id: { [Op.in]: _.map(fixedEntityElements, 'datasourceID') }
            },
            attributes: ['id', 'tableName', 'displayColumnPKField', 'displayColumnField', 'filter']
        }).then((fixedentitylist) => {
            const promises = [];
            _.each(fixedEntityElements, (dataelementitem) => {
                const fixedEntity = _.find(fixedentitylist, fixedentityitem => fixedentityitem.id === dataelementitem.datasourceID);
                if (fixedEntity) {
                    if (dataelementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch) {
                        // return column and columnID for autocomplete
                        dataelementitem.dataValues.dataElementKeyColumn = {
                            keyColumnId: fixedEntity.displayColumnPKField,
                            keyColumn: fixedEntity.displayColumnField
                        };
                        Promise.resolve();
                    } else {
                        /* get all fixed entity master data */
                        const pfields = `${fixedEntity.displayColumnPKField},${fixedEntity.displayColumnField}`;
                        /* FixedEntityTableNamesForParameterizedFilter --> means @-pWoID like parameters used in filter column of "fixed_entity_dataelement" table */
                        const isParameterizedFilterEntity = _.some(COMMON.FixedEntityTableNamesForParameterizedFilter, item => item === fixedEntity.tableName);
                        let pwhereclause = ' deletedAt IS NULL '; /* where condition - filter data from table */
                        if (isParameterizedFilterEntity) {
                            if (fixedEntity.tableName === COMMON.FixedEntityTableNames.workorder_serialmst) {
                                if (fixedEntity.filter.includes('@pWoID')) {
                                    pwhereclause += ((fixedEntity.filter ? ` and ${fixedEntity.filter.replace('@pWoID', req.params.woID)}` : ''));
                                }
                            }
                        } else {
                            pwhereclause += ((fixedEntity.filter ? ` and ${fixedEntity.filter}` : ''));/* where condition - filter data from table */
                        }

                        /* get all fixed entity master data */
                        promises.push(sequelize.query('CALL Sproc_DynamicSQL (:pfields, :ptablename, :pwherecluse, :pgroupby, :porderby)',
                            {
                                replacements:
                                {
                                    pfields: pfields, ptablename: fixedEntity.tableName, pwherecluse: pwhereclause, pgroupby: '', porderby: null
                                }
                            })
                            .then((resp) => {
                                /* set master data to dataElementKeyValList array (custom array) */
                                dataelementitem.dataValues.dataElementKeyValList = (resp && resp.length > 0) ? resp : [];
                                Promise.resolve(resp);
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woDataElementModuleName)));
                            })
                        );
                    }
                }
            });
            return Promise.all(promises);
        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getWorkorderData, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // local function for update data_element information with CustomEntity Master data value
    updateElementInfoForCustomEntityWo: (req, res, getWorkorderData) => {
        const { DataElementTransactionValuesManual } = req.app.locals.models;
        /* get all custom entity list */
        if (getWorkorderData) {
            const promises = [];
            _.each(getWorkorderData, (dataElementitem) => {
                if ((dataElementitem.controlTypeID !== COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch)
                    && dataElementitem.datasourceID && dataElementitem.datasourceDisplayColumnID) {
                    const whereClause = {
                        entityID: dataElementitem.datasourceID ? dataElementitem.datasourceID : null,
                        dataElementID: dataElementitem.datasourceDisplayColumnID ? dataElementitem.datasourceDisplayColumnID : null
                    };
                    /* get all CustomEntity Data to be loaded for selection */
                    return promises.push(DataElementTransactionValuesManual.findAll({
                        model: DataElementTransactionValuesManual,
                        attributes: ['dataElementTransManualID', 'value'],
                        where: whereClause,
                        required: false
                    }).then((resp) => {
                        /* set master data to dataElementTransactionValuesManual array (custom array) */
                        dataElementitem.dataValues.dataElementTransactionValuesManual = (resp && resp.length > 0) ? resp : [];
                        return Promise.resolve(dataElementitem);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }));
                } else if (dataElementitem.isDatasource && dataElementitem.datasourceID) {
                    dataElementitem.dataValues.dataElementKeyColumn = {
                        keyColumn: 'dataElementTransManualID',
                        keyColumnId: 'value'
                    };
                    return Promise.resolve(dataElementitem);
                } else {
                    return Promise.resolve(dataElementitem);
                }
            });
            return Promise.all(promises);
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // local function for update data_element information with Manual Data
    updateElementInfoForManualWo: (req, res, getWorkorderData) => {
        const { DataElementKeyValues } = req.app.locals.models;
        /* get all manual data list */
        if (getWorkorderData) {
            const promises = [];
            _.each(getWorkorderData, (dataElementitem) => {
                if (dataElementitem.isManualData && dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch) {
                    dataElementitem.dataValues.dataElementKeyColumn = {
                        keyColumn: 'name',
                        keyColumnId: 'keyValueID'
                    };
                    return Promise.resolve(dataElementitem);
                } else if (dataElementitem.isManualData && (dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.MultipleChoice
                    || dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.Option
                    || dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.Combobox
                    || dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.MultipleChoiceDropdown)) {
                    const whereClause = {
                        dataElementID: dataElementitem.dataElementID ? dataElementitem.dataElementID : null,
                        isDeleted: false
                    };

                    /* get all manual Data to be loaded for selection */
                    return promises.push(DataElementKeyValues.findAll({
                        attributes: ['keyValueID', 'dataElementID', 'displayOrder', 'name', 'value', 'defaultValue'],
                        where: whereClause
                    }).then((resp) => {
                        /* set manual data to array (custom array) */
                        dataElementitem.dataValues.dataElementKeyValues = (resp && resp.length > 0) ? resp : [];
                        return Promise.resolve(dataElementitem);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }));
                } else {
                    return Promise.resolve(dataElementitem);
                }
            });
            return Promise.all(promises);
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get work-order and operation by woID
    // POST : /api/v1/workorders/getMaxWorkorderNumberByAssyID
    // @return Workorder Max Number detail
    getMaxWorkorderNumberByAssyID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize
            .query('CALL Sproc_GetMaxWorkorderNumberByAssyID (:passyID)',
                {
                    replacements: {
                        passyID: (req.body && req.body.obj && req.body.obj.assyID) ? req.body.obj.assyID : null
                    }
                })
            .then((resultData) => {
                if (!resultData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resultData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // Get work-order and operation by assyID
    // POST : /api/v1/workorders/getLineItenCountByAssyID
    // @return Get Workorder having BOM or not
    validateAssemblyByAssyID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        let shippingJson;
        if (req.body && req.body.obj && req.body.obj.checkShippingAssyList) {
            shippingJson = JSON.stringify(req.body.obj.checkShippingAssyList);
        }
        return sequelize
            .query('CALL Sproc_ValidateAssemblyByAssyID (:passyIDs, :pShippingAddressID, :pisFromSalesOrder, :pshippingJson, :pTransType)',
                {
                    replacements: {
                        passyIDs: (req.body && req.body.obj && req.body.obj.partIDs.length > 0) ? req.body.obj.partIDs.join().toString() : null,
                        pShippingAddressID: (req.body && req.body.obj && req.body.obj.shippingAddressID) ? req.body.obj.shippingAddressID : null,
                        pisFromSalesOrder: (req.body && req.body.obj && req.body.obj.isFromSalesOrder) ? req.body.obj.isFromSalesOrder : false,
                        pshippingJson: shippingJson ? shippingJson : null,
                        pTransType: req.body && req.body.obj ? (req.body.obj.transType || null) : null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
            .then((resultData) => {
                if (resultData && resultData.length > 0) {
                    const salesOrderPartList = resultData[0] ? _.values(resultData[0]) : null;
                    const errorObjList = resultData[1] ? _.values(resultData[1]) : null;
                    const exportControlPartList = resultData[2] ? _.values(resultData[2]) : null;
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { salesOrderPartList: salesOrderPartList, errorObjList: errorObjList, exportControlPartList: exportControlPartList }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // Get work-order autocomplete for workorder by assembly
    // POST : /api/v1/workorders/getWorkOrderListByAssyID
    // @return list of work-order detail
    getWorkOrderListByAssyID: async (req, res) => {
        const { sequelize, Workorder, WorkorderSalesOrderDetails, Component, RFQRoHS, MfgCodeMst } = req.app.locals.models;
        const WhereClause = {};
        if (parseInt(req.params.assyID)) {
            WhereClause.partID = req.params.assyID;
        };
        if (req.query.woSubStatus) {
            WhereClause.woSubStatus = { [Op.in]: req.query.woSubStatus };
        }
        const mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
            type: sequelize.QueryTypes.SELECT
        });
        const workOrderList = await Workorder.findAll({
            attributes: ['woID', 'woNumber', 'partID', 'woStatus', 'woSubStatus', 'woVersion', 'excessQty', 'buildQty', 'ECORemark', 'FCORemark', 'customerID'],
            where: WhereClause,
            include: [{
                model: WorkorderSalesOrderDetails,
                as: 'WoSalesOrderDetails',
                attributes: ['woSalesOrderDetID', 'partID', 'salesOrderDetailID', 'woID', 'qpa', 'parentPartID'],
                require: false
            }, {
                model: Component,
                as: 'componentAssembly',
                attributes: ['id', 'PIDCode', 'mfgPN', 'rev', 'mfgPNDescription', 'nickName'],
                required: false
            }, {
                model: RFQRoHS,
                as: 'rohs',
                attributes: ['id', 'name', 'rohsIcon'],
                required: false
            }, {
                model: MfgCodeMst,
                as: 'customer',
                attributes: ['mfgCode', 'mfgType', 'mfgName',
                [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('customer.mfgCode'), sequelize.col('customer.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
                required: false
            }]
        }).then(workOrderList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workOrderList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get assembly details
    // POST : /api/v1/workorders/getAssemblyStockDetailsByAssyID/:assyID/:woID
    // @return list of assembly stock details
    getAssemblyStockDetailsByAssyID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.listObj) {
            return sequelize.query('CALL Sproc_GetAssemblyStockDetails (:ppartID, :pwoID)',
                {
                    replacements: {
                        ppartID: req.body.listObj.assyID ? req.body.listObj.assyID : null,
                        pwoID: req.body.listObj.woID ? req.body.listObj.woID : null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    if (!response) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null);
                    }
                    const headerDetails = {
                        poAssemblyDetails: _.values(response[0]).length > 0 ? (_.values(response[0])) : (null),
                        woAssemblyDetails: _.values(response[1]).length > 0 ? (_.values(response[1])) : (null)
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, headerDetails, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    // new NotUpdate(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            // new NotUpdate(MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName)));
        }
    },


    // Get assembly details
    // POST : /api/v1/workorders/getIdlePOQtyByAssyID
    // @return list of assembly stock details for idle POQty
    getIdlePOQtyByAssyID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.listObj) {
            return sequelize.query('CALL Sproc_GetIdlePOQtyAndWOScrapQty (:ppartID, :pwoID)',
                {
                    replacements: {
                        ppartID: req.body.listObj.assyID ? req.body.listObj.assyID : null,
                        pwoID: req.body.listObj.woID ? req.body.listObj.woID : null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    if (!response) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
                    }
                    const headerDetails = {
                        poAssemblyDetails: _.values(response[0]).length > 0 ? (_.values(response[0])) : (null),
                        woAssemblyDetails: _.values(response[1]).length > 0 ? (_.values(response[1])) : (null)
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, headerDetails, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Create copy of work-order
    // POST : /api/v1/workorders/addWorkorder
    // @return new create work order detail
    addWorkorder: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            const model = req.body;
            return sequelize.transaction().then((t) => {
                return getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.WorkOrderSystemID, t).then((respOfWOSystemID) => {
                    if (!respOfWOSystemID || respOfWOSystemID.status !== STATE.SUCCESS) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: respOfWOSystemID ? respOfWOSystemID.message : null,
                            data: null
                        });
                    }
                    const woSystemID = respOfWOSystemID.systemId;

                    return sequelize
                        // eslint-disable-next-line no-multi-str
                        .query('CALL Sproc_AddWorkorder (:pcustomerID, :ppartID, :pRoHSStatusID, \
                        :pwoNumber,:pbuildQty,:pexcessQty,\
                        :pisRevision, :pwoType, :pisCopyOPFrom, \
                        :prefrenceWOID, :pmasterTemplateID, :puserID, :pisRevisedWO, \
                        :pterminateWOID, :pterminateWOOPID, :pisHotJob, :pinitialInternalVersion, :pParentWOID,:psystemID, :puserRoleId )', {
                            replacements: {
                                pcustomerID: model.customerID,
                                ppartID: model.partID,
                                pRoHSStatusID: model.RoHSStatusID,
                                pwoNumber: null,
                                pbuildQty: model.buildQty || 0,
                                pexcessQty: model.excessQty ? model.excessQty : null,
                                pisRevision: null,  // model.isNewRevision
                                pwoType: null,  // model.woType
                                pisCopyOPFrom: model.isCopyOPFrom ? model.isCopyOPFrom : null,
                                prefrenceWOID: model.refrenceWOID ? model.refrenceWOID : null,
                                pmasterTemplateID: model.masterTemplateID ? model.masterTemplateID : null,
                                puserID: model.createdBy,
                                pisRevisedWO: model.isRevisedWO ? model.isRevisedWO : null,
                                pterminateWOID: model.terminateWOID ? model.terminateWOID : null,
                                pterminateWOOPID: model.terminateWOOPID ? model.terminateWOOPID : null,
                                pisHotJob: model.isHotJob ? model.isHotJob : false,
                                pinitialInternalVersion: model.liveVersion ? model.liveVersion : null,
                                pParentWOID: model.parentWOID ? model.parentWOID : null,
                                psystemID: woSystemID,
                                puserRoleId: model.createByRoleId
                            },
                            transaction: t
                        })
                        .then((workorder) => {
                            // check woNumber is not duplicate or not exists
                            if (workorder && workorder[0].errorCode) {
                                t.rollback();
                                if (workorder[0].errorCode === 'woNumber') {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.WORKORDER.UNIQUE_FIELD), err: null, data: null });
                                    // new NotFound(MESSAGE_CONSTANT.WORKORDER.WONUMBER_UNIQUE));
                                } else if (workorder[0].errorCode === 'EC02') {
                                    // Initial stock contain same work order
                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.WO_EXISTS_IN_OPENING_PART_BAL_FOR_SAVE_IN_PROD);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, model.woNumber);

                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                                        { messageContent: messageContent, err: null, data: null });
                                } else if (workorder[0].errorCode === 'EC03') {
                                    // work order number should not be blank
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                            }
                            if (!workorder || !workorder[0] || !workorder[0].woID || !workorder[0].woNumber) {
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                            }
                            model.woNumber = workorder[0].woNumber; // new generated work order number

                            // get work order and work order all operation document path
                            return sequelize
                                .query('CALL Sproc_GetWOAndWOOPDocumentPath (:pwoID)',
                                    {
                                        replacements: {
                                            pwoID: workorder[0].woID
                                        },
                                        transaction: t,
                                        type: sequelize.QueryTypes.SELECT
                                    }).then((respOfWOOPDocumentPathList) => {
                                        if (!respOfWOOPDocumentPathList || respOfWOOPDocumentPathList.length === 0) {
                                            t.rollback();
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                        }
                                        const woAndAllWOOPDocumentPathList = [];
                                        _.each(respOfWOOPDocumentPathList, (pathItem) => {
                                            if (pathItem && !_.isEmpty(pathItem[0])) {
                                                woAndAllWOOPDocumentPathList.push(pathItem[0]);
                                            }
                                        });

                                        const requiredDet = {
                                            model: model,
                                            newWorkOrderDet: {
                                                woID: workorder[0].woID
                                            }
                                        };
                                        module.exports.createWOAndWOOPFolderPathForWOCreate(res, t, woAndAllWOOPDocumentPathList, requiredDet);

                                        const allPromisesOfWOCreate = [];
                                        if (req.body.taskConfirmationInfo) {
                                            allPromisesOfWOCreate.push(module.exports.addTaskConfirmationInfoForWOCreate(req, res, t, requiredDet));
                                        }
                                        if (model.salesOrderDetails.length > 0) {
                                            allPromisesOfWOCreate.push(module.exports.addWOSalesOrderDetForWOCreate(req, t, requiredDet));
                                        }
                                        allPromisesOfWOCreate.push(module.exports.addTimeLineLogForWOCreate(req, res, t, requiredDet));
                                        allPromisesOfWOCreate.push(module.exports.copyAssemblyDocToWOFolderPath(req, t, requiredDet));

                                        /* if op copy from op management (master template) then copy all op master files to new created woOP */
                                        /* W: work order , PW: previous work order */
                                        if ((model.isCopyOPFrom === 'M' && model.masterTemplateID)
                                            || (model.isCopyOPFrom === 'W' || model.isCopyOPFrom === 'PW')) {
                                            allPromisesOfWOCreate.push(module.exports.copyOpMasterDocToWOOPFolderPath(req, t, requiredDet));
                                        }

                                        /* if previous work order then copy wo and wo op document */
                                        if (model.isCopyOPFrom === 'PW') {   /* PW: previous work order  */
                                            allPromisesOfWOCreate.push(module.exports.copyFromSelectedWODocToNewWOFolderPath(req, t, requiredDet));
                                            allPromisesOfWOCreate.push(module.exports.copyFromWOOPDocToNewWOOPFolderPath(req, t, requiredDet));
                                        }
                                        return Promise.all(allPromisesOfWOCreate).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { woID: workorder[0].woID }, MESSAGE_CONSTANT.CREATED(workOrderModuleName)))
                                        ).catch((err) => {
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
                                    });
                        }).catch((err) => {
                            t.rollback();
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                }).catch((err) => {
                    t.rollback();
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

    // add confirmation for build qty than save and its timeline log while create work order
    addTaskConfirmationInfoForWOCreate: (req, res, t, requiredDet) => {
        const TaskConfirmation = req.app.locals.models.TaskConfirmation;
        req.body.taskConfirmationInfo.refId = requiredDet.newWorkOrderDet.woID;
        req.body.taskConfirmationInfo.updatedBy = req.user.id;
        req.body.taskConfirmationInfo.createdBy = req.user.id;
        req.body.taskConfirmationInfo.reason = COMMON.setTextAngularValueForDB(req.body.taskConfirmationInfo.reason);
        return TaskConfirmation.create(req.body.taskConfirmationInfo, {
            fields: taskConfirmationInputFields,
            transaction: t
        }).then(() => {
            // [S] add task confirmation log to check for timeline users
            const objTaskConfirmEvent = {
                userID: req.user.id,
                eventTitle: woTaskConfirmationObj.SAVE.title,
                eventDescription: COMMON.stringFormat(woTaskConfirmationObj.SAVE.description, req.body.taskConfirmationInfo.confirmationType
                    , requiredDet.model.woNumber, req.user.username),
                refTransTable: woTaskConfirmationObj.refTransTableName,
                refTransID: requiredDet.newWorkOrderDet.woID,
                eventType: timelineObj.TASK_CONFIRMATION.id,
                url: COMMON.stringFormat(woTaskConfirmationObj.SAVE.url, requiredDet.newWorkOrderDet.woID),
                eventAction: timelineEventActionConstObj.CREATE
            };
            req.objEvent = objTaskConfirmEvent;
            return TimelineController.createTimeline(req, res, t);
            // [E] add task confirmation log to check for timeline users
        });
    },

    // add work order sales order details
    addWOSalesOrderDetForWOCreate: (req, t, requiredDet) => {
        const WorkorderSalesOrderDetails = req.app.locals.models.WorkorderSalesOrderDetails;
        _.each(requiredDet.model.salesOrderDetails, (itemObj) => {
            itemObj.woID = requiredDet.newWorkOrderDet.woID;
            itemObj.updatedBy = req.user.id;
            itemObj.createdBy = req.user.id;
        });

        // COMMON.setModelCreatedArrayFieldValue(req.user, requiredDet.model.salesOrderDetails);
        return WorkorderSalesOrderDetails.bulkCreate(requiredDet.model.salesOrderDetails, {
            fields: woSOinputFields,
            transaction: t
        });
    },

    // add time line log for work order create
    addTimeLineLogForWOCreate: (req, res, t, requiredDet) => {
        const objEvent = {
            userID: req.user.id,
            eventTitle: workorderObj.CREATE.title,
            eventDescription: COMMON.stringFormat(workorderObj.CREATE.description, requiredDet.model.woNumber, req.user.username),
            refTransTable: workorderObj.refTransTableName,
            refTransID: requiredDet.newWorkOrderDet.woID,
            eventType: timelineObj.id,
            url: COMMON.stringFormat(workorderObj.url, requiredDet.newWorkOrderDet.woID),
            eventAction: timelineEventActionConstObj.CREATE
        };
        req.objEvent = objEvent;
        return TimelineController.createTimeline(req, res, t);
    },

    // create work order and work order all operation physical folder
    // eslint-disable-next-line consistent-return
    createWOAndWOOPFolderPathForWOCreate: (res, t, woAndAllWOOPDocumentPathList, requiredDet) => {
        const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;

        // create work order path folders
        const newCreatedWODocPathDet = _.find(woAndAllWOOPDocumentPathList, item => item.gencFileOwnerType === Entity.Workorder.Name);
        if (!newCreatedWODocPathDet || !newCreatedWODocPathDet.newDocumentPath) {
            t.rollback();
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
        requiredDet.newCreatedWODocPathDet = newCreatedWODocPathDet;

        let genWOFilePath = gencFileUploadPathConst;
        const woFolders = newCreatedWODocPathDet.newDocumentPath.split('/');
        _.each(woFolders, (folderItem) => {
            genWOFilePath = `${genWOFilePath}${folderItem}/`;
            if (!fs.existsSync(genWOFilePath)) {
                fs.mkdirSync(genWOFilePath);
            }
        });

        // create work order operation path folders
        const newCreatedWOOPDocPathList = _.filter(woAndAllWOOPDocumentPathList, item => item.gencFileOwnerType === Entity.Workorder_operation.Name);
        if (newCreatedWOOPDocPathList && newCreatedWOOPDocPathList.length > 0) {
            requiredDet.newCreatedWOOPDocPathList = newCreatedWOOPDocPathList;
            _.each(newCreatedWOOPDocPathList, (woOPItem) => {
                let genWOOPFilePath = gencFileUploadPathConst;
                const woOPFolders = woOPItem.newDocumentPath.split('/');
                _.each(woOPFolders, (folderItem) => {
                    genWOOPFilePath = `${genWOOPFilePath}${folderItem}/`;
                    if (!fs.existsSync(genWOOPFilePath)) {
                        fs.mkdirSync(genWOOPFilePath);
                    }
                });
            });
        } else {
            requiredDet.newCreatedWOOPDocPathList = [];
        }
    },

    // copy all document from selected assembly/part master to work order  folder path
    copyAssemblyDocToWOFolderPath: (req, t, requiredDet) => {
        const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}`;
        const { GenericFiles, GenericFolder } = req.app.locals.models;

        return GenericFiles.findAll({
            where: {
                refTransID: requiredDet.model.partID,
                gencFileOwnerType: Entity.Component.Name,
                entityID: Entity.Component.ID
            },
            transaction: t
        }).then((genericFilesOfPart) => {
            const promisesOfCopyPartDocToWo = [];
            _.each(genericFilesOfPart, (itemData) => {
                const docpath = `.${itemData.genFilePath}`;
                const newFileName = `${uuidv1()}.${itemData.gencFileExtension}`;
                const newDocPath = `${gencFileUploadPathConst}/${requiredDet.newCreatedWODocPathDet.newDocumentPath}/${newFileName}`;
                const actualGenFilePath = newDocPath.startsWith('.') ? newDocPath.replace('.', '') : null;
                if (fs.existsSync(docpath)) {
                    fsExtra.copySync(docpath, newDocPath);
                }

                itemData.refCopyTransID = itemData.refTransID; // partID
                itemData.refCopyGencFileOwnerType = itemData.gencFileOwnerType;
                itemData.gencFileName = newFileName;
                itemData.createdBy = req.user.id;
                itemData.refTransID = requiredDet.newWorkOrderDet.woID;
                itemData.gencFileOwnerType = Entity.Workorder.Name; // as we copy doc data from part to work order
                itemData.entityID = Entity.Workorder.ID;
                itemData.genFilePath = actualGenFilePath;
                // itemData.copyFromGencFileID = itemData.gencFileID; // master gencFileID from which we copy new

                promisesOfCopyPartDocToWo.push(GenericFolder.findOne({
                    where: {
                        refTransID: requiredDet.newWorkOrderDet.woID,
                        gencFileOwnerType: Entity.Workorder.Name,
                        copyGencFolderID: itemData.refParentId
                    },
                    attributes: ['gencFolderID'],
                    transaction: t
                }).then((resp) => {
                    if (resp) {
                        itemData.refParentId = resp.gencFolderID;
                    }
                    return itemData.dataValues;
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return null;
                })
                );
            });

            return Promise.all(promisesOfCopyPartDocToWo).then((respOfSetCompoentDocToWO) => {
                const createAssyToWOFileList = respOfSetCompoentDocToWO.filter(x => x != null);
                COMMON.setModelCreatedArrayFieldValue(req.user, createAssyToWOFileList);
                return GenericFiles.bulkCreate(createAssyToWOFileList, {
                    fields: genericFilesInputFields,
                    transaction: t
                });
            });
        });
    },

    // copy all document from operation master to work order operation folder path
    copyOpMasterDocToWOOPFolderPath: (req, t, requiredDet) => {
        const { GenericFiles, GenericFolder, WorkorderOperation, sequelize } = req.app.locals.models;
        const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}`;
        const whereClause = {
            gencFileOwnerType: Entity.Operation.Name,
            entityID: Entity.Operation.ID
        };

        /* if op copy from op management (master template) then copy all op master files to new created woOP */
        if (requiredDet.model.isCopyOPFrom === 'M' && requiredDet.model.masterTemplateID) {
            // newly created work order
            whereClause.refTransID = {
                [Op.in]: sequelize.literal(
                    ` ( select opID from workorder_operation WHERE deletedAt IS NULL and woID = ${requiredDet.newWorkOrderDet.woID})`
                )
            };
        } else if (requiredDet.model.isCopyOPFrom === 'W' || requiredDet.model.isCopyOPFrom === 'PW') {  /* W: work order , PW: previous work order */
            // old work order from which we copy
            whereClause.refTransID = {
                [Op.in]: sequelize.literal(
                    ` ( select opID from workorder_operation WHERE deletedAt IS NULL and woID = ${requiredDet.model.refrenceWOID})`
                )
            };
        } else if (!requiredDet.model.isCopyOPFrom && requiredDet.model.reqComeFrom && requiredDet.model.reqComeFrom === 'selected_op_add') {  // request come from selected op add api
            whereClause.refTransID = { [Op.in]: requiredDet.model.newAddedOpMstList };
        }

        return GenericFiles.findAll({
            where: whereClause,
            transaction: t
        }).then(genericFilesOfOpMaster =>

            /* get newly created work order operation */
            WorkorderOperation.findAll({
                where: {
                    woID: requiredDet.newWorkOrderDet.woID
                },
                attributes: ['woOPID', 'opID', 'woID'],
                transaction: t
            }).then((woOPIDListOfNewWO) => {
                /* if any file found then copy that all op master files */
                const OPMasterDocPromises = [];
                _.each(genericFilesOfOpMaster, (itemData) => {
                    /* match master opID of doc refTransID with new wo op (woOPID) to get latest woOPID which set as new refTransID in doc data  */
                    const matchedWOOPItem = _.find(woOPIDListOfNewWO, woOPItem => woOPItem.opID === itemData.refTransID);
                    if (matchedWOOPItem) {
                        const woOPItemWithDocPath = _.find(requiredDet.newCreatedWOOPDocPathList, woOPPathItem => woOPPathItem.refTransID === matchedWOOPItem.woOPID);
                        if (woOPItemWithDocPath && woOPItemWithDocPath.newDocumentPath) {
                            const docpath = `.${itemData.genFilePath}`;
                            const newFileName = `${uuidv1()}.${itemData.gencFileExtension}`;
                            const newDocPath = `${gencFileUploadPathConst}/${woOPItemWithDocPath.newDocumentPath}/${newFileName}`;
                            const actualGenFilePath = newDocPath.startsWith('.') ? newDocPath.replace('.', '') : null;
                            if (fs.existsSync(docpath)) {
                                fsExtra.copySync(docpath, newDocPath);
                            }
                            itemData.refCopyTransID = itemData.refTransID; // old opID
                            itemData.refCopyGencFileOwnerType = itemData.gencFileOwnerType;
                            itemData.gencFileName = newFileName;
                            itemData.createdBy = req.user.id;
                            itemData.refTransID = matchedWOOPItem.woOPID;
                            itemData.gencFileOwnerType = Entity.Workorder_operation.Name; // as we copy doc data from op master to wo op
                            itemData.entityID = Entity.Workorder_operation.ID;
                            itemData.genFilePath = actualGenFilePath;
                            // itemData.copyFromGencFileID = itemData.gencFileID; // master gencFileID from which we copy new

                            OPMasterDocPromises.push(GenericFolder.findOne({
                                where: {
                                    refTransID: itemData.refTransID,
                                    gencFileOwnerType: Entity.Workorder_operation.Name,
                                    copyGencFolderID: itemData.refParentId
                                },
                                attributes: ['gencFolderID'],
                                transaction: t
                            }).then((resp) => {
                                if (resp) {
                                    itemData.refParentId = resp.gencFolderID;
                                }
                                return itemData.dataValues;
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return null;
                            })
                            );
                        }
                    }
                });
                return Promise.all(OPMasterDocPromises).then((responses) => {
                    const createOPToWOOPFileList = responses.filter(x => x != null);
                    COMMON.setModelCreatedArrayFieldValue(req.user, createOPToWOOPFileList);
                    return GenericFiles.bulkCreate(createOPToWOOPFileList, {
                        fields: genericFilesInputFields,
                        transaction: t
                    });
                });
            }));
    },

    // copy all document from selected reference work order to new created work order folder path
    copyFromSelectedWODocToNewWOFolderPath: (req, t, requiredDet) => {
        const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}`;
        const { GenericFiles, GenericFolder } = req.app.locals.models;

        return GenericFiles.findAll({
            where: {
                refTransID: requiredDet.model.refrenceWOID,
                gencFileOwnerType: Entity.Workorder.Name,
                entityID: Entity.Workorder.ID,
                [Op.or]: [
                    {
                        refCopyTransID: null,
                        refCopyGencFileOwnerType: null
                    },
                    {
                        refCopyTransID: null,
                        refCopyGencFileOwnerType: Entity.Workorder.Name
                    }
                ]
            },
            transaction: t
        }).then((genericFiles) => {
            var promisesOfFromWODocToNewWO = [];

            _.each(genericFiles, (itemData) => {
                const docpath = `.${itemData.genFilePath}`;
                const newFileName = `${uuidv1()}.${itemData.gencFileExtension}`;
                const newDocPath = `${gencFileUploadPathConst}/${requiredDet.newCreatedWODocPathDet.newDocumentPath}/${newFileName}`;
                const actualGenFilePath = newDocPath.startsWith('.') ? newDocPath.replace('.', '') : null;
                if (fs.existsSync(docpath)) {
                    fsExtra.copySync(docpath, newDocPath);
                }

                itemData.refCopyTransID = itemData.refTransID; // old woID
                itemData.refCopyGencFileOwnerType = itemData.gencFileOwnerType;
                itemData.gencFileName = newFileName;
                itemData.createdBy = req.user.id;
                itemData.refTransID = requiredDet.newWorkOrderDet.woID;
                itemData.genFilePath = actualGenFilePath;
                // itemData.copyFromGencFileID = itemData.gencFileID; // master gencFileID from which we copy new

                promisesOfFromWODocToNewWO.push(GenericFolder.findOne({
                    where: {
                        refTransID: requiredDet.newWorkOrderDet.woID,
                        gencFileOwnerType: Entity.Workorder.Name,
                        copyGencFolderID: itemData.refParentId
                    },
                    attributes: ['gencFolderID'],
                    transaction: t
                }).then((resp) => {
                    if (resp) {
                        itemData.refParentId = resp.gencFolderID;
                    }
                    return itemData.dataValues;
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return null;
                })
                );
            });

            return Promise.all(promisesOfFromWODocToNewWO).then((responses) => {
                var createWOToNewWOFileList = responses.filter(x => x != null);
                COMMON.setModelCreatedArrayFieldValue(req.user, createWOToNewWOFileList);
                return GenericFiles.bulkCreate(createWOToNewWOFileList, {
                    fields: genericFilesInputFields,
                    transaction: t
                });
            });
        });
    },

    // copy all document from selected reference work order operation to new created work order operation folder path
    copyFromWOOPDocToNewWOOPFolderPath: (req, t, requiredDet) => {
        const { GenericFiles, GenericFolder, WorkorderOperation, sequelize } = req.app.locals.models;
        const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}`;

        return GenericFiles.findAll({
            where: {
                gencFileOwnerType: Entity.Workorder_operation.Name,
                refTransID: {
                    [Op.in]: sequelize.literal(
                        ` ( select woOPID from workorder_operation WHERE deletedAt IS NULL and woID = ${requiredDet.model.refrenceWOID})`
                    )
                },
                [Op.or]: [
                    {
                        refCopyTransID: null,
                        refCopyGencFileOwnerType: null
                    },
                    {
                        refCopyTransID: { [Op.ne]: null },
                        refCopyGencFileOwnerType: Entity.Workorder_operation.Name
                    }
                ]
            },
            transaction: t
        }).then(genericFilesOfWoOPs =>

            /* get old and newly created work order operation */
            WorkorderOperation.findAll({
                where: {
                    woID: [requiredDet.model.refrenceWOID, requiredDet.newWorkOrderDet.woID]
                },
                attributes: ['woOPID', 'opID', 'woID'],
                transaction: t
            }).then((woOPIDListOfNewOldWO) => {
                /* if any file found then copy that all wo op files */
                const woOPDocPromises = [];

                _.each(genericFilesOfWoOPs, (itemData) => {
                    /* match doc file refID with old wo op to get master opID  */
                    const oldWoOpData = _.find(woOPIDListOfNewOldWO, dbwoOPItem => dbwoOPItem.woID === requiredDet.model.refrenceWOID && dbwoOPItem.woOPID === itemData.refTransID);
                    if (oldWoOpData) {
                        /* match old master opID of doc refID(woOPID) with new wo op to get latest woOPID which set as new refTransID in doc data  */
                        const newWoOpData = _.find(woOPIDListOfNewOldWO, dbwoOPItem => dbwoOPItem.woID === requiredDet.newWorkOrderDet.woID && dbwoOPItem.opID === oldWoOpData.opID);
                        if (newWoOpData) {
                            const woOPItemWithDocPath = _.find(requiredDet.newCreatedWOOPDocPathList, woOPPathItem => woOPPathItem.refTransID === newWoOpData.woOPID);
                            if (woOPItemWithDocPath && woOPItemWithDocPath.newDocumentPath) {
                                const docpath = `.${itemData.genFilePath}`;
                                const newFileName = `${uuidv1()}.${itemData.gencFileExtension}`;
                                const newDocPath = `${gencFileUploadPathConst}/${woOPItemWithDocPath.newDocumentPath}/${newFileName}`;
                                const actualGenFilePath = newDocPath.startsWith('.') ? newDocPath.replace('.', '') : null;
                                if (fs.existsSync(docpath)) {
                                    fsExtra.copySync(docpath, newDocPath);
                                }

                                itemData.refCopyTransID = itemData.refTransID; // old woOPID
                                itemData.refCopyGencFileOwnerType = itemData.gencFileOwnerType;
                                itemData.gencFileName = newFileName;
                                itemData.createdBy = req.user.id;
                                itemData.refTransID = newWoOpData.woOPID;
                                itemData.genFilePath = actualGenFilePath;
                                // itemData.copyFromGencFileID = itemData.gencFileID; // master gencFileID from which we copy new

                                woOPDocPromises.push(GenericFolder.findOne({
                                    where: {
                                        refTransID: itemData.refTransID,
                                        gencFileOwnerType: Entity.Workorder_operation.Name,
                                        copyGencFolderID: itemData.refParentId
                                    },
                                    attributes: ['gencFolderID'],
                                    transaction: t
                                }).then((resp) => {
                                    if (resp) {
                                        itemData.refParentId = resp.gencFolderID;
                                    }
                                    return itemData.dataValues;
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return null;
                                })
                                );
                            }
                        }
                    }
                });

                return Promise.all(woOPDocPromises).then((responses) => {
                    const createWOOPToNewWOOPFileList = responses.filter(x => x != null);

                    COMMON.setModelCreatedArrayFieldValue(req.user, createWOOPToNewWOOPFileList);
                    return GenericFiles.bulkCreate(createWOOPToNewWOOPFileList, {
                        fields: genericFilesInputFields,
                        transaction: t
                    });
                });
            }));
    },

    // Get  work order number details
    // GET : /api/v1/workorders/getWorkOrderNumbers
    getWorkOrderNumbers: (req, res) => {
        const { Workorder } = req.app.locals.models;
        let whereClause = '1==1';
        if (req.body) {
            whereClause = { woID: req.body.woID };
        }
        Workorder.findAll({
            where: whereClause,
            attributes: ['woID', 'woNumber', 'woSubStatus', 'isOperationsVerified'],
            order: [
                ['woID', 'DESC']
            ]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response[0], null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName), err));
        });
    },

    // Get prev work-order autocomplete for copy workorder popup
    // POST : /api/v1/workorders/getPrevWoListForCustomerAssy
    // @return list of work-order detail
    getPrevWoListForCustomerAssy: (req, res) => {
        const { Workorder } = req.app.locals.models;
        Workorder.findAll({
            attributes: ['woID', 'woNumber', 'partID', 'excessQty', 'buildQty'],
            where: {
                woSubStatus: {
                    [Op.notIn]: [
                        COMMON.WOSUBSTATUS.DRAFT,
                        COMMON.WOSUBSTATUS.VOID,
                        COMMON.WOSUBSTATUS.DRAFTREVIEW
                    ]
                },
                partID: req.body.partID,
                customerID: req.body.customerID
            },
            order: [['woID', 'DESC']]
        }
        ).then(workOrderList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workOrderList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get temprature sensitive component list for workorder
    // POST : /api/v1/workorders/getTempratureSensitiveComponentListByWoID
    // @return get temprature sensitive component list for workorder
    getTempratureSensitiveComponentListByWoID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_GetTempratureSensitiveComponentListByWoID (:pwoID, :pIsSubAssembly);',
                        {
                            replacements: {
                                pwoID: req.body.listObj ? req.body.listObj.woID : null,
                                pIsSubAssembly: req.body.listObj ? req.body.listObj.isSubAssembly : null
                            },
                            type: sequelize.QueryTypes.SELECT
                        })
            );
            return Promise.all(promises).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                componentList: _.values(response[0][0])
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            // new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Added by Leena for POC - 07/02/2020
    // Added Images Into PDF
    // GET : /api/v1/componentsidstock/AddedImagesIntoPDF
    // @return pdf
    AddedImagesIntoPDF: (req, res) => {
        // jsreport.render({
        //     template: {
        //         "_id": "5b8eab51cca20ec3ffbdce95",
        //         "shortid": "rJZ5FPjPQ",
        //         "name": "result.html",
        //         "recipe": "phantom-pdf",
        //         "engine": "jsrender",
        //         "phantom": {
        //         "format": "A4",
        //         "header": fs.readFileSync('./uploads/result_header.html').toString(),
        //         "footer": fs.readFileSync('./uploads/result_footer.html').toString(),
        //         },
        //         "content": '<html>' +
        //         '<style>html,body {padding:0;margin:0;} iframe {width:100%;height:100%;border:0}</style>' +
        //         '<body>' +
        //         '<iframe src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"></iframe>' +
        //         '</body></html>',
        //     }
        // }).then((out) => {
        //     out.stream.pipe(res);
        // }).catch((e) => {
        //     res.end(e.message);
        // });
        // Start Template
        var htmlString = '<html><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"></head><body><table><tbody><tr><td>';
        // Take images from below folder
        const templateFolderPath = './uploads/Photos';
        // Take pdf(s) from below folder
        // const templateFolderPathForPDF = './uploads/Photos/PDF';
        const bufferArray = [];
        var filePath;
        var fullFilePath;
        var stats;
        var templateData;
        var vHtml;
        var newBuffer;
        // read all images from folder and make buffer array
        try {
            fs.readdir(templateFolderPath, (error, files) => {
                files.forEach((file) => {
                    filePath = `./uploads/Photos/${file}`;
                    fullFilePath = `${config.APIUrl}/uploads/Photos/${file}`;
                    stats = fs.statSync(filePath);
                    if (stats.isDirectory()) {
                        fs.readdir(filePath, (errFile, pdfFiles) => {
                            pdfFiles.forEach((pdfFile) => {
                                bufferArray.push(fs.readFileSync(`./uploads/Photos/PDF/${pdfFile}`));
                            });
                        });
                    } else {
                        htmlString += `<img src="${fullFilePath}" style="width:100%;object-fit: cover;"/></td></tr><tr><td>`;
                    }
                });
                htmlString += '</td></tr></tr></tbody></table></body></html>';
                // End- Html Template
                // POC- Parts - 2 - Inject Header footer dynamically - generate PDF
                templateData = jsrender.templates(htmlString);
                vHtml = templateData.render({});
                jsreport.render({
                    template: {
                        _id: '5b8eab51cca20ec3ffbdce95',
                        shortid: 'rJZ5FPjPQ',
                        name: 'result.html',
                        recipe: 'phantom-pdf',
                        engine: 'jsrender',
                        // "preview" : "true",
                        phantom: {
                            format: 'A4',
                            displayHeaderFooter: true,
                            header: fs.readFileSync('./uploads/result_header.html').toString(),
                            footer: fs.readFileSync('./uploads/result_footer.html').toString()
                        },
                        content: vHtml
                    }
                    // template: {
                    //     "_id": "5b8eab51cca20ec3ffbdce95",
                    //     "shortid": "rJZ5FPjPQ",
                    //     "name": "result.html",
                    //     "recipe": "chrome-pdf",
                    //     "engine": "handlebars",
                    //     "chrome": {
                    //         "printBackground": true,
                    //         "format": "A4",
                    //         "displayHeaderFooter": true,
                    //         "marginTop": "80px",
                    //         "marginRight": "20px",
                    //         "marginBottom": "80px",
                    //         "marginLeft": "20px",
                    //         "headerTemplate": fs.readFileSync('./uploads/result_header.html').toString(),
                    //         "footerTemplate": fs.readFileSync('./uploads/result_footer.html').toString(),
                    //         "Timeout": 50000
                    //     },
                    //     "content": vHtml,
                    // }
                    // POC- Parts - 2 - Inject Header footer dynamically - generate PDF
                }).then((out) => {
                    // read buffer and write in PDF strram
                    var outStream = new memoryStreams.WritableStream();
                    var firstPDFStream = new hummus.PDFRStreamForBuffer(out.content);
                    var pdfWriter = hummus.createWriterToModify(firstPDFStream, new hummus.PDFStreamForResponse(outStream));
                    bufferArray.forEach((buffer) => {
                        var secondPDFStream = new hummus.PDFRStreamForBuffer(buffer);
                        pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
                    });
                    pdfWriter.end();
                    newBuffer = outStream.toBuffer();
                    outStream.end();
                    res.send(newBuffer);
                    // send response in ui with stream bytes
                    // read buffer and write in PDF strram
                    // fs.readFile('./uploads/result.pdf', function (error, content) {
                    //     var outStream = new memoryStreams.WritableStream();
                    //     var firstPDFStream = new hummus.PDFRStreamForBuffer(out.content);
                    //     var secondPDFStream = new hummus.PDFRStreamForBuffer(content);
                    //     var pdfWriter = hummus.createWriterToModify(firstPDFStream, new hummus.PDFStreamForResponse(outStream));
                    //     pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
                    //     pdfWriter.end();
                    //     var newBuffer = outStream.toBuffer();
                    //     outStream.end();
                    //     res.send(newBuffer);
                    // });
                }).catch((e) => {
                    res.end(e.message);
                });
            });
        } catch (error) {
            // console.log(error);
        }

        // jsreport.documentStore.collection('templates').insert({
        //     content: "<html>\n    <head>\n        <style>\n          * {\n              box-sizing: border-box;\n          }\n\n          html, body {\n              margin: 0px;\n              padding: 0px;\n          }\n\n          .main {\n              display: flex;\n              flex-direction: column;\n              justify-content: space-between;\n              width: 100%;\n              height: 100%;\n          }\n\n          .header {\n              width: 100%;\n              padding-top: 20px;\n              border-bottom: 1px solid black;\n          }\n\n          .footer {\n              width: 100%;\n              padding-bottom: 20px;\n              border-top: 1px solid black;\n          }\n        </style>\n    </head>\n    <body>\n        {{#each $pdf.pages}}\n          {{#if @index}}\n            <div style=\"page-break-before: always;\"></div>\n          {{/if}}\n          <main class=\"main\"> \n            <header class=\"header\">\n              Header\n            </header>\n            <footer class=\"footer\">\n                <span>Page {{getPageNumber @index}} of {{getTotalPages ../$pdf.pages}}</span>\n            </footer>\n          </main>\n        {{/each}}\n    </body>\n</html>",
        //     name: 'headerFooter',
        //     shortid: 'headerFooter',
        //     engine: 'handlebars',
        //     recipe: 'chrome-pdf',
        //     helpers: "\nfunction getPageNumber (pageIndex) {\n    if (pageIndex == null) {\n        return ''\n    }\n    \n    const pageNumber = pageIndex + 1\n    \n    return pageNumber\n}\n\nfunction getTotalPages (pages) {\n    if (!pages) {\n        return ''\n    }\n    \n    return pages.length\n}",
        //   })
        // jsreport.documentStore.collection('templates').insert({
        //     content: fs.readFileSync('./uploads/result_header.html').toString(),
        //     name: 'headertmp',
        //     shortid: 'headertmp',
        //     engine: 'handlebars',
        //     recipe: 'chrome-pdf'
        //   })

        //   jsreport.documentStore.collection('templates').insert({
        //     content: fs.readFileSync('./uploads/result_footer.html').toString(),
        //     name: 'footertmp',
        //     shortid: 'footertmp',
        //     engine: 'handlebars',
        //     recipe: 'chrome-pdf',
        //     helpers: "\nfunction getPageNumber (pageIndex) {\n    if (pageIndex == null) {\n        return ''\n    }\n    \n    const pageNumber = pageIndex + 1\n    \n    return pageNumber\n}\n\nfunction getTotalPages (pages) {\n    if (!pages) {\n        return ''\n    }\n    \n    return pages.length\n}",
        //   })

        // jsreport.render({
        //     shortid: "headerFooter",
        //     name: "headerFooter",
        //     recipe: "chrome-pdf",
        //     engine: "handlebars",
        //     content: `<html><head><style>
        //     {box-sizing: border-box;}html, body {margin: 0px;padding: 0px;}.main {display: flex;flex-direction: column;
        //         justify-content: space-between;width: 100%;height: 100%;}.header {width: 100%;padding-top: 20px;
        //              border-bottom: 1px solid black;}.footer {width: 100%;padding-bottom: 20px;
        //                 border-top: 1px solid black;}</style></head><body>{{#each $pdf.pages}}
        //                 {{#if @index}}<div style=\"page-break-before: always;\"></div>{{/if}}
        //                 <main class=\"main\"><header class=\"header\">
        //                  Header</header><footer class=\"footer\">
        //                 <span>Page {{getPageNumber @index}} of {{getTotalPages ../$pdf.pages}}</span>
        //                </footer></main>{{/each}}</body></html>`,
        //     chrome: {
        //       "marginTop": "",
        //       "marginLeft": "1cm",
        //       "marginRight": "1cm"
        //     },
        //     helpers: `function getPageNumber (pageIndex) {if (pageIndex == null) { return ''}
        //     const pageNumber = pageIndex + 1
        //     return pageNumber}
        //     function getTotalPages (pages) {
        //         if (!pages) {return ''}
        //         return pages.length}`,
        // });
        //  jsreport.render({
        //     template: {
        //     name: "Main",
        //     recipe: "chrome-pdf",
        //     engine: "handlebars",
        //     chrom: {
        //       "printBackground": true,
        //       "marginTop": "2cm",
        //       "marginRight":"2cm",
        //       "marginBottom": "2cm",
        //       "marginLeft": "2cm"
        //     },
        //     content: `<h1 style='page-break-before: always;margin-top:10%;'>Hello</h1><h1 style='page-break-before: always;margin-top:10%;'>Hello</h1>`,
        //     pdfOperations: [
        //       {
        //         type: "merge",
        //         mergeWholeDocument: true,
        //         renderForEveryPage: true,
        //         templateShortid: "headertmp"
        //       },
        //       {
        //         type: "merge",
        //         mergeWholeDocument: true,
        //         renderForEveryPage: true,
        //         templateShortid: "footertmp"
        //       }
        //     ]
        //   }
        // }).then((out) => {
        //     out.stream.pipe(res);
        // }).catch((e) => {
        //     res.end(e.message);
        // });
        // var base64Str = "";
        // jsreport.render({
        //     template: {
        //       content:'replace',
        //       engine: 'handlebars',
        //       recipe: 'chrome-pdf',
        //       shortid: 'pdffile',
        //       scripts: [{
        //         content: "function afterRender(req, res, done) { req.template.content='hello'; done(); }"
        //     }]
        //   }
        // })
        // jsreport.documentStore.collection('templates').insert({
        //     content: '<div style"height: 2cm">pdf file 123</div>',
        //     shortid: 'pdffile',
        //     name: 'pdffile',
        //     engine: 'none',
        //     chrome: {
        //       width: '8cm',
        //       height: '8cm'
        //     },
        //     recipe: 'chrome-pdf'
        //   })

        // jsreport.beforeRenderListeners.insert(0, 'test', (req, res) => {

        // fs.readFile('./uploads/ECO_CA326_01.pdf', function (error, content) {
        //     pdfBase64 = content.toString('base64');
        //     base64Str = 'data:image/jpeg;base64,'+ pdfBase64;
        // });;
        // pdf2html.html('./uploads/ECO_CA326_01.pdf', (err, html) => {
        //     if (err) {
        //         console.error('Conversion error: ' + err)
        //     } else {
        //         console.log(html)
        //     }
        // })


        // if (req.template.shortid === 'pdffile') {
        // fs.readFile('./uploads/ECO_CA326_01.pdf', function (error, content) {
        //     // jsreport.documentStore.collection('templates').update({name: 'pdffile'}, { $set: { content: '123' }}).then((res) =>
        //     //  {
        //     //      var a = 1;
        //     //  }
        //     //  );
        //     var a = data.toString('base64');
        // });
        // }
        //    var pdfImage = new PDFImage("uploads/ECO_CA326_01.pdf", {
        //     combinedImage: true
        //    });
        //     pdfImage.convertFile().then(function (imagePath) {
        //         // 0-th page (first page) of the slide.pdf is available as slide-0.png
        //         var a = imagePath;
        //     });
        //   })

        //  jsreport.render({
        //     template: {
        //         content: "Main Template",
        //         recipe: "chrome-pdf",
        //         engine: "handlebars",
        //         chrome: {
        //           "marginTop": "50px"
        //         },
        //         pdfOperations: [{
        //           template: {
        //             content: "Header",
        //             recipe: "chrome-pdf",
        //             engine: "handlebars"
        //           },
        //           type: "merge"
        //         },
        //         {
        //         template: {
        //             content :'<img src='+base64Str+' style="width:100%;object-fit: cover;"/>',
        //             // helpers: {
        //             //     foo: function() {
        //             //         const base64Str = fs.readFile('./uploads/ECO_CA326_01.pdf').toString('base64');
        //             //         return 'data:image/jpeg;base64,'+base64Str;
        //             //         //return fs.createReadStream("./uploads/ECO_CA326_01.pdf").toString();
        //             //         //return fs.createReadStream('./uploads/ECO_CA326_01.pdf');
        //             //         //return fs.readFile('./uploads/ECO_CA326_01.pdf');
        //             //         //return 'Yes, we can!'
        //             //     }
        //             // },
        //             engine: 'handlebars',
        //             recipe: 'chrome-pdf'
        //         },
        //          //templateShortid: 'pdffile',
        //          type: "append"
        //         }]
        //     }
        // }).then((out) => {
        //     out.stream.pipe(res);
        // }).catch((e) => {
        //     res.end(e.message);
        // });
        // var htmlString = '<html><head></head><body><table><tbody><tr><td>';
        // let templateFolderPath = './uploads/Photos';
        // fs.readdir(templateFolderPath, function (error, files) {
        //     files.forEach(function (file, index) {
        //         var fromPath = `${config.APIUrl}/uploads/Photos/${file}`;
        //         htmlString += '<img src="'+ fromPath +'" style="width:100%;object-fit: cover;"/></td></tr><tr><td>'
        //         console.log("index=" +index);
        //     })
        //     htmlString += '</td></tr></tr></tbody></table></body></html>'
        //     var templateData = jsrender.templates(htmlString);
        //     var html = templateData.render({});
        //     console.log("htm=" +htmlString);
        //     jsreport.render({
        //         template: {
        //             content: html, recipe: 'phantom-pdf', engine: 'jsrender',
        //             phantom: {
        //                 orientation: "portrait",
        //                 format: "Letter",
        //                 printDelay: 500,
        //             }
        //         }
        //     }).then((out) => {
        //         out.stream.pipe(res);
        //     }).catch((e) => {
        //         res.end(e.message);
        //     });
        // });
        // var htmlString = '<html><head></head><body><table><tbody><tr><td>';
        // const { GenericFiles } = req.app.locals.models;
        // var whereClause = { gencFileOwnerType: COMMON.AllEntityIDS.Component_sid_stock.Name };
        // const promises = [];
        // return GenericFiles.findAll({
        //    where: whereClause,
        // }).then((GenericFilesData) => {
        //    if (Array.isArray(GenericFilesData)) {
        //        GenericFilesData.forEach(item => {
        //            var path = `${config.APIUrl}/${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${item.gencFileOwnerType}/${item.gencFileName}`;
        //            htmlString += '<img src="'+ path +'"/></td></tr><tr><td>'
        //        });
        //        htmlString += '</td></tr></tr></tbody></table></body></html>'
        //    }
        // }).then(() => {
        //    var templateData = jsrender.templates(htmlString);
        //    var html = templateData.render({});
        //    jsreport.render({
        //        template: {
        //            content: html, recipe: 'phantom-pdf', engine: 'jsrender',
        //            phantom: {
        //                orientation: "portrait",
        //                format: "Letter",
        //                printDelay: 500,
        //            }
        //        }
        //    }).then((out) => {
        //        out.stream.pipe(res);
        //    }).catch((e) => {
        //        res.end(e.message);
        //    });
        // }).catch((err) => {
        //    console.trace();
        //    console.error(err);
        //    return { status: STATE.FAILED };
        // });
    },

    // get work order all Icons to display on work order header
    // @param {req} obj
    // @return list of Icons
    getWOHeaderAllIconList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetWOHeaderAllIconList (:pPartId,:pwoID)', {
                replacements: {
                    pPartId: req.body.woAssyID,
                    pwoID: req.body.woID
                }
            }).then(responseOfAllIcons => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseOfAllIcons, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get List of work order to display in search auto complete
    // GET : /api/v1/workorders/getAllWOForSearchAutoComplete
    getAllWOForSearchAutoComplete: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize
            .query('CALL sproc_getAllWOForSearchAutoComplete (:pSearchQuery)', {
                replacements: {
                    pSearchQuery: req.body.searchquery
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // Retrieve list of active work orders for copy document and folder of op master to wo op
    // POST : /api/v1/workorders/getAllActiveWorkorderForCopyFolderDoc
    // @return list of work orders
    getAllActiveWorkorderForCopyFolderDoc: (req, res) => {
        if (req.body && (req.body.opID || (req.body.woOPIDs && req.body.woOPIDs.length > 0))) {
            const { Workorder, WorkorderOperation } = req.app.locals.models;

            const woOPWhereClause = {};
            if (req.body.opID && (!req.body.woOPIDs || !req.body.woOPIDs.length)) {
                woOPWhereClause.opID = req.body.opID;
            } else {
                woOPWhereClause.woOPID = req.body.woOPIDs;
            }

            return Workorder.findAll({
                where: {
                    woStatus: { [Op.notIn]: [COMMON.WOSTATUS.COMPLETED, COMMON.WOSTATUS.VOID, COMMON.WOSTATUS.TERMINATED] }
                },
                attributes: ['woID', 'woNumber', 'woVersion', 'woStatus', 'woSubStatus'],
                include: [
                    {
                        model: WorkorderOperation,
                        as: 'workorderOperation',
                        required: true,
                        attributes: ['woOPID', 'opName', 'opNumber', 'opVersion'],
                        // where: {
                        //    opID: req.body.opID
                        // }
                        where: woOPWhereClause
                    }
                ]
            }).then(workorderlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { workorderlist: workorderlist }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // copy operation master selected folder/doc to work order operation
    // POST : /api/v1/workorders/copyAllFolderDocToActiveWorkorder
    // copy all operation master folder/files to active work order
    copyAllFolderDocToActiveWorkorder: (req, res) => {
        if (req.body && req.body.woListForCopyDocFolder && req.body.woListForCopyDocFolder.length > 0 && req.body.opID
            && req.body.parentFolderIDOfSelected && (req.body.selectedFolderIDsToCopy != null || req.body.selectedFileIDsToCopy != null)) {
            const { sequelize } = req.app.locals.models;

            return sequelize.transaction().then(t => sequelize
                .query('CALL Sproc_CopyOpMasterFolderDocToWOOP (:pgencFolderIDsToCopy,:pgencFileIDsToCopy,:popID, :pwoIDs, :puserID,:pparentFolderIDOfSelected)',
                    {
                        replacements: {
                            pgencFolderIDsToCopy: req.body.selectedFolderIDsToCopy ? req.body.selectedFolderIDsToCopy.toString() : null,
                            pgencFileIDsToCopy: req.body.selectedFileIDsToCopy ? req.body.selectedFileIDsToCopy.toString() : null,
                            popID: req.body.opID,
                            pwoIDs: _.map(req.body.woListForCopyDocFolder, 'woID').toString(),
                            puserID: req.user.id,
                            pparentFolderIDOfSelected: req.body.parentFolderIDOfSelected
                        },
                        type: sequelize.QueryTypes.SELECT,
                        transaction: t
                    })
                .then((respOfCopyOPFiles) => {
                    if (respOfCopyOPFiles && respOfCopyOPFiles.length > 0 && respOfCopyOPFiles[0]
                        && _.first(_.values(respOfCopyOPFiles[0])).iscopysuccess) {
                        const respOfCopyNewFiles = _.values(respOfCopyOPFiles[1]);
                        const respOfDuplicateFiles = _.values(respOfCopyOPFiles[2]);
                        let respOfSourceDeletedFolders = _.values(respOfCopyOPFiles[3]);
                        let respOfSourceDeletedFiles = _.values(respOfCopyOPFiles[4]);

                        if (!respOfSourceDeletedFolders || !respOfSourceDeletedFolders.length || _.first(respOfSourceDeletedFolders).deleted_source_folder === 0) {
                            respOfSourceDeletedFolders = [];
                        }
                        if (!respOfSourceDeletedFiles || !respOfSourceDeletedFiles.length || _.first(respOfSourceDeletedFiles).deleted_source_files === 0) {
                            respOfSourceDeletedFiles = [];
                        }

                        const copyOPFileFolderPromise = [];
                        let successMsg = COMMON.stringFormat(MESSAGE_CONSTANT.GLOBAL.DOC_COPIED_TO_DESTINATION.message, 'active work order');

                        // in case of only duplicate file from what ever we selected then success message null
                        if ((!respOfCopyNewFiles || !respOfCopyNewFiles.length)
                            && (!req.body.selectedFolderIDsToCopy || req.body.selectedFolderIDsToCopy.length === 0)
                            && req.body.selectedFileIDsToCopy && req.body.selectedFileIDsToCopy.length > 0
                            && (respOfDuplicateFiles && (respOfDuplicateFiles.length === (req.body.selectedFileIDsToCopy.length * req.body.woListForCopyDocFolder.length)
                                || respOfSourceDeletedFiles.length === req.body.selectedFileIDsToCopy.length))
                        ) {
                            successMsg = null;
                        }

                        if ((!respOfCopyNewFiles || !respOfCopyNewFiles.length)
                            && req.body.selectedFolderIDsToCopy && req.body.selectedFolderIDsToCopy.length > 0
                            && respOfSourceDeletedFolders.length === req.body.selectedFolderIDsToCopy.length
                            && req.body.selectedFileIDsToCopy && req.body.selectedFileIDsToCopy.length > 0
                            && respOfSourceDeletedFiles.length === req.body.selectedFileIDsToCopy.length) {
                            successMsg = null;
                        }

                        let requiredDet = {};
                        // copy file list of op master to all wo op
                        if (respOfCopyNewFiles && respOfCopyNewFiles.length > 0) {
                            requiredDet = {
                                copyNewFilesToWOOP: respOfCopyNewFiles
                            };
                            copyOPFileFolderPromise.push(module.exports.copyOpMasterFilesToWOOP(req, res, t, requiredDet));
                            copyOPFileFolderPromise.push(module.exports.changeWOOPVersionForCopyOPMstFile(req, res, t, requiredDet));
                        }

                        return Promise.all(copyOPFileFolderPromise).then(() => t.commit().then(() => {
                            // copy physical operation master files to work order operation
                            if (requiredDet && requiredDet.copyNewFilesToWOOP && requiredDet.copyNewFilesToWOOP.length > 0) {
                                _.each(requiredDet.copyNewFilesToWOOP, (woOPFileItem) => {
                                    try {
                                        const opMstDocpath = `.${woOPFileItem.genFilePathOfOpMstFile}`;
                                        if (fs.existsSync(opMstDocpath)) {
                                            fsExtra.copySync(opMstDocpath, `.${woOPFileItem.genFilePath}`);
                                        }
                                    } catch (ex) {
                                        // console.log(ex);
                                    }
                                });
                            }

                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                {
                                    duplicateFileList: respOfDuplicateFiles && respOfDuplicateFiles.length > 0 ? respOfDuplicateFiles : [],
                                    deletedFolderListAtSource: respOfSourceDeletedFolders,
                                    deletedFileListAtSource: respOfSourceDeletedFiles
                                },
                                successMsg);
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // copy op master files (list come from sp) to active work order operations
    copyOpMasterFilesToWOOP: (req, res, t, requiredDet) => {
        const { GenericFiles, sequelize } = req.app.locals.models;
        const woOPIDsList = _.uniq(_.map(requiredDet.copyNewFilesToWOOP, 'refTransID'));

        return sequelize
            .query('CALL Sproc_GetWOOPDocumentPathByWOOPIDs (:pwoOPIDs)',
                {
                    replacements: {
                        pwoOPIDs: woOPIDsList.toString()
                    },
                    type: sequelize.QueryTypes.SELECT,
                    transaction: t
                }).then((respOfWOOPDocumentPathList) => {
                    if (!respOfWOOPDocumentPathList || respOfWOOPDocumentPathList.length === 0) {
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }

                    const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;
                    const WOOPDocumentPathList = [];
                    _.each(respOfWOOPDocumentPathList, (pathItem) => {
                        if (pathItem && !_.isEmpty(pathItem[0])) {
                            WOOPDocumentPathList.push(pathItem[0]);
                        }
                    });

                    try {
                        // create physical folder path if not exists
                        _.each(WOOPDocumentPathList, (woOPItem) => {
                            let genWOOPFilePath = gencFileUploadPathConst;
                            const woOPFolders = woOPItem.newDocumentPath.split('/');
                            _.each(woOPFolders, (folderItem) => {
                                genWOOPFilePath = `${genWOOPFilePath}${folderItem}/`;
                                if (!fs.existsSync(genWOOPFilePath)) {
                                    fs.mkdirSync(genWOOPFilePath);
                                }
                            });
                        });
                    } catch (ex) {
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }

                    _.each(requiredDet.copyNewFilesToWOOP, (woOPFileItem) => {
                        const woOPItemWithDocPath = _.find(WOOPDocumentPathList, woOPPathItem => woOPPathItem.refTransID === woOPFileItem.refTransID);
                        if (woOPItemWithDocPath && woOPItemWithDocPath.newDocumentPath) {
                            woOPFileItem.gencFileName = `${uuidv1()}.${woOPFileItem.gencFileExtension}`;
                            woOPFileItem.genFilePath = `${gencFileUploadPathConst}${woOPItemWithDocPath.newDocumentPath}/${woOPFileItem.gencFileName}`;
                            // try {
                            //    // copy physical operation master files to work order operation
                            //    let opMstDocpath = `.${woOPFileItem.genFilePathOfOpMstFile}`;
                            //    if (fs.existsSync(opMstDocpath)) {
                            //        fsExtra.copySync(opMstDocpath, woOPFileItem.genFilePath);
                            //    }
                            // }
                            // catch (ex) {
                            //    // console.log(ex);
                            // }
                            woOPFileItem.genFilePath = woOPFileItem.genFilePath.startsWith('.') ? woOPFileItem.genFilePath.replace('.', '') : woOPFileItem.genFilePath;
                            COMMON.setModelCreatedObjectFieldValue(req.user, woOPFileItem);
                        }
                    });

                    return GenericFiles.bulkCreate(requiredDet.copyNewFilesToWOOP, {
                        transaction: t
                    });
                });
    },

    // change work order and work order operation version
    changeWOOPVersionForCopyOPMstFile: (req, res, t, requiredDet) => {
        const { WorkorderOperation, Workorder } = req.app.locals.models;
        const woOPVersionPromises = [];
        let woOPIDsList = [];
        if (requiredDet.fieldOnGetUniqWOOP) {
            woOPIDsList = _.uniq(_.map(requiredDet.copyNewFilesToWOOP, requiredDet.fieldOnGetUniqWOOP));
        } else {
            woOPIDsList = _.uniq(_.map(requiredDet.copyNewFilesToWOOP, 'refTransID'));
        }


        _.each(woOPIDsList, (woOPIDItem) => {
            const woItemToChangeVersion = _.find(req.body.woListForCopyDocFolder, woItem => woItem.woOPID === woOPIDItem);

            if (woItemToChangeVersion) {
                if (woItemToChangeVersion.requiredToChangeVersion) {
                    const versionModel = {
                        opVersion: woItemToChangeVersion.WOOpToVersion,
                        woVersion: woItemToChangeVersion.woToVersion
                    };
                    COMMON.setModelUpdatedByObjectFieldValue(req.user, versionModel);
                    woOPVersionPromises.push(
                        WorkorderOperation.update(versionModel, {
                            where: {
                                woOPID: woItemToChangeVersion.woOPID
                            },
                            fields: ['opVersion', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                            transaction: t
                        })
                    );

                    woOPVersionPromises.push(
                        Workorder.update(versionModel, {
                            where: {
                                woID: woItemToChangeVersion.woID
                            },
                            fields: ['woVersion', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                            transaction: t
                        })
                    );

                    // [S] add log of update work order operation version for time line users
                    const objEventForWoOpVersion = {
                        userID: req.user.id,
                        eventTitle: woOpTimelineConstObj.WORKORDER_OPERATION_VERSION.title,
                        eventDescription: COMMON.stringFormat(woOpTimelineConstObj.WORKORDER_OPERATION_VERSION.description,
                            woItemToChangeVersion.WOOpFromVersion, woItemToChangeVersion.WOOpToVersion,
                            woItemToChangeVersion.opName,
                            woItemToChangeVersion.woNumber, req.user.username),
                        refTransTable: woOpTimelineConstObj.refTransTableName,
                        refTransID: woItemToChangeVersion.woOPID,
                        eventType: timelineObj.WORKORDER_OPERATION_VERSION.id,
                        url: COMMON.stringFormat(woOpTimelineConstObj.WORKORDER_OPERATION_VERSION.url, woItemToChangeVersion.woOPID),
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    req.objEvent = objEventForWoOpVersion;
                    woOPVersionPromises.push(TimelineController.createTimeline(req, res, t));
                    // [E] add log of update work order operation version for time line users


                    // [S] add log of update work order version for time line users
                    const objEventForWoVersion = {
                        userID: req.user.id,
                        eventTitle: workorderObj.WORKORDER_VERSION.title,
                        eventDescription: COMMON.stringFormat(workorderObj.WORKORDER_VERSION.description, woItemToChangeVersion.woFromVersion
                            , woItemToChangeVersion.woToVersion, woItemToChangeVersion.woNumber, req.user.username),
                        refTransTable: workorderObj.refTransTableName,
                        refTransID: woItemToChangeVersion.woID,
                        eventType: timelineObj.WORKORDER_VERSION.id,
                        url: COMMON.stringFormat(workorderObj.url, woItemToChangeVersion.woID),
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    req.objEvent = objEventForWoVersion;
                    woOPVersionPromises.push(TimelineController.createTimeline(req, res, t));
                    // [E] add log of update work order version for time line users
                }
            }
        });

        return Promise.all(woOPVersionPromises).then(() => ({
            status: STATE.SUCCESS
        }));
    },

    // copy all duplicate files to work order operation based on confirmation
    // POST : /api/v1/workorders/copyAllDuplicateDocToWOOPBasedOnConfirmation
    // copy all duplicate files
    copyAllDuplicateDocToWOOPBasedOnConfirmation: (req, res) => {
        if (req.body && req.body.duplicateFileList && req.body.duplicateFileList.length > 0 && req.body.duplicateFileCopyActionConst) {
            const { sequelize } = req.app.locals.models;
            const duplicateFileList = req.body.duplicateFileList;

            // eslint-disable-next-line no-multi-str
            return sequelize.transaction().then(t => sequelize.query('DROP TEMPORARY TABLE IF EXISTS temp_op_allFilesToReplace; \
                            CREATE TEMPORARY TABLE temp_op_allFilesToReplace(gencFileID INT(11), gencOriginalName VARCHAR(255), refParentId INT(11), \
                            refParentFolderName VARCHAR(255) , fileLevel INT(11), refTransIDOfWOOP INT(11), \
                            refParentIdForWOOPNewFile INT(11), gencFileIDOfWOOPExistsFile INT(11)); ', {
                transaction: t
            }).then(() => {
                const copyDuplicateFileTempPromises = [];
                _.each(duplicateFileList, (fileData) => {
                    copyDuplicateFileTempPromises.push(sequelize.query(`INSERT INTO temp_op_allFilesToReplace(gencFileID,gencOriginalName,refParentId, \
                            refParentFolderName,fileLevel,refTransIDOfWOOP,refParentIdForWOOPNewFile,gencFileIDOfWOOPExistsFile) \
                            values("${fileData.gencFileID}", "${fileData.gencOriginalName}", "${fileData.refParentId}", \
                                "${fileData.refParentFolderName}", "${fileData.fileLevel}", "${fileData.refTransIDOfWOOP}", \
                            "${fileData.refParentIdForWOOPNewFile}", "${fileData.gencFileIDOfWOOPExistsFile}"); `, {
                        transaction: t
                    }));
                });

                return Promise.all(copyDuplicateFileTempPromises).then(() => {
                    sequelize
                        .query('CALL Sproc_checkOPFileFolderExistsToReplaceFile (:pduplicateFileCopyAction)',
                            {
                                replacements: {
                                    pduplicateFileCopyAction: req.body.duplicateFileCopyActionConst
                                },
                                type: sequelize.QueryTypes.SELECT,
                                transaction: t
                            }).then((respOfChkValidFile) => {
                                let respOfExistsFileListToCopyAtDesti = [];
                                let respOfNotExistsFileListAtSource = [];

                                if (respOfChkValidFile && respOfChkValidFile.length > 0) {
                                    respOfExistsFileListToCopyAtDesti = _.values(respOfChkValidFile[0]);
                                    respOfNotExistsFileListAtSource = _.values(respOfChkValidFile[1]);
                                }

                                let successMsg = null;
                                const duplicateFileAction = DATA_CONSTANT.GENERIC_FILE.DuplicateFileCopyAction;
                                if (respOfExistsFileListToCopyAtDesti && respOfExistsFileListToCopyAtDesti.length > 0) {
                                    successMsg = COMMON.stringFormat(MESSAGE_CONSTANT.GLOBAL.DOC_COPIED_TO_DESTINATION.message, 'active work order');
                                    const copyOPDupFilePromise = [];
                                    const requiredDet = {
                                        copyNewFilesToWOOP: respOfExistsFileListToCopyAtDesti
                                    };
                                    // check type of action to copy like replace/keep both file
                                    if (req.body.duplicateFileCopyActionConst === duplicateFileAction.Replace_File.Value) {
                                        requiredDet.fieldOnGetUniqWOOP = 'refTransIDOfWOOP';
                                        copyOPDupFilePromise.push(module.exports.replaceAllDuplicateDocOfOPMasterToWOOP(req, res, t, requiredDet));
                                    } else if (req.body.duplicateFileCopyActionConst === duplicateFileAction.Keep_Both_File.Value) {
                                        copyOPDupFilePromise.push(module.exports.copyOpMasterFilesToWOOP(req, res, t, requiredDet));
                                    } else {
                                        t.rollback();
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                            STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                    }
                                    copyOPDupFilePromise.push(module.exports.changeWOOPVersionForCopyOPMstFile(req, res, t, requiredDet));

                                    return Promise.all(copyOPDupFilePromise).then(() => t.commit().then(() => {
                                        // copy physical operation master files to work order operation
                                        if (req.body.duplicateFileCopyActionConst === duplicateFileAction.Keep_Both_File.Value &&
                                            requiredDet && requiredDet.copyNewFilesToWOOP && requiredDet.copyNewFilesToWOOP.length > 0) {
                                            _.each(requiredDet.copyNewFilesToWOOP, (woOPFileItem) => {
                                                try {
                                                    const opMstDocpath = `.${woOPFileItem.genFilePathOfOpMstFile}`;
                                                    if (fs.existsSync(opMstDocpath)) {
                                                        fsExtra.copySync(opMstDocpath, `.${woOPFileItem.genFilePath}`);
                                                    }
                                                } catch (ex) {
                                                    // console.log(ex);
                                                }
                                            });
                                        }

                                        // if globally isPermanentDelete is true then need to remove old file of
                                        if (req.body.duplicateFileCopyActionConst === duplicateFileAction.Replace_File.Value && req.body.isPermanentDelete) {
                                            _.each(requiredDet.copyNewFilesToWOOP, (woOPFileItem) => {
                                                try {
                                                    const docpath = `.${woOPFileItem.genFilePathOfWOOPExistsFile}`;
                                                    fs.unlink(docpath, () => { });
                                                } catch (ex) {
                                                    // console.log(ex);
                                                }
                                            });
                                        }

                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                            {
                                                notExistsFileListAtSource: respOfNotExistsFileListAtSource && respOfNotExistsFileListAtSource.length > 0 ? respOfNotExistsFileListAtSource : []
                                            },
                                            successMsg);
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                            STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        t.rollback();
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                            STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                } else {
                                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                        {
                                            notExistsFileListAtSource: respOfNotExistsFileListAtSource && respOfNotExistsFileListAtSource.length > 0 ? respOfNotExistsFileListAtSource : []
                                        },
                                        successMsg)).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                t.rollback();
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get all duplicate file and create new uuid for all to replace original file of op master with new one into wo op
    replaceAllDuplicateDocOfOPMasterToWOOP: (req, res, t, requiredDet) => {
        const { GenericFiles, sequelize } = req.app.locals.models;
        const woOPIDsList = _.uniq(_.map(requiredDet.copyNewFilesToWOOP, 'refTransIDOfWOOP'));

        return sequelize
            .query('CALL Sproc_GetWOOPDocumentPathByWOOPIDs (:pwoOPIDs)',
                {
                    replacements: {
                        pwoOPIDs: woOPIDsList.toString()
                    },
                    type: sequelize.QueryTypes.SELECT,
                    transaction: t
                }).then((respOfWOOPDocumentPathList) => {
                    if (!respOfWOOPDocumentPathList || respOfWOOPDocumentPathList.length === 0) {
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }

                    const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;
                    const WOOPDocumentPathList = [];
                    _.each(respOfWOOPDocumentPathList, (pathItem) => {
                        if (pathItem && !_.isEmpty(pathItem[0])) {
                            WOOPDocumentPathList.push(pathItem[0]);
                        }
                    });

                    try {
                        // create physical folder path if not exists
                        _.each(WOOPDocumentPathList, (woOPItem) => {
                            let genWOOPFilePath = gencFileUploadPathConst;
                            const woOPFolders = woOPItem.newDocumentPath.split('/');
                            _.each(woOPFolders, (folderItem) => {
                                genWOOPFilePath = `${genWOOPFilePath}${folderItem}/`;
                                if (!fs.existsSync(genWOOPFilePath)) {
                                    fs.mkdirSync(genWOOPFilePath);
                                }
                            });
                        });
                    } catch (ex) {
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }

                    const updateWOOPPathPromises = [];
                    _.each(requiredDet.copyNewFilesToWOOP, (woOPFileItem) => {
                        const woOPItemWithDocPath = _.find(WOOPDocumentPathList, woOPPathItem => woOPPathItem.refTransID === woOPFileItem.refTransIDOfWOOP);
                        if (woOPItemWithDocPath && woOPItemWithDocPath.newDocumentPath) {
                            woOPFileItem.gencFileName = `${uuidv1()}.${woOPFileItem.gencFileExtension}`;
                            woOPFileItem.genFilePath = `${gencFileUploadPathConst}${woOPItemWithDocPath.newDocumentPath}/${woOPFileItem.gencFileName}`;
                            try {
                                // copy physical operation master files to work order operation
                                const opMstDocpath = `.${woOPFileItem.genFilePathOfOpMstFile}`;
                                if (fs.existsSync(opMstDocpath)) {
                                    fsExtra.copySync(opMstDocpath, woOPFileItem.genFilePath);
                                }
                            } catch (ex) {
                                // console.log(ex);
                            }
                            woOPFileItem.genFilePath = woOPFileItem.genFilePath.startsWith('.') ? woOPFileItem.genFilePath.replace('.', '') : woOPFileItem.genFilePath;
                            COMMON.setModelUpdatedByObjectFieldValue(req.user, woOPFileItem);

                            updateWOOPPathPromises.push(GenericFiles.update(woOPFileItem, {
                                where: {
                                    gencFileID: woOPFileItem.gencFileIDOfWOOPExistsFile
                                },
                                fields: ['gencFileName', 'genFilePath', 'fileSize', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                transaction: t
                            }));
                        }
                    });

                    return Promise.all(updateWOOPPathPromises).then(() => ({
                        status: STATE.SUCCESS
                    }));
                });
    },

    // get so po filter list based on customerid and search string
    // @return list of sp po
    getSoPoFilterList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetFilterSoPoList (:customerIds,:searchString)', {
                replacements: {
                    customerIds: req.body.customerIds || null,
                    searchString: req.body.searchString || null
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get assyid filter list based on customerid and search string
    // @return list of assyid
    getAssyIdFilterList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetFilterAssyIdlist (:customerIds,:searchString)', {
                replacements: {
                    customerIds: req.body.customerIds || null,
                    searchString: req.body.searchString || null
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get nick name filter list based on customerid and search string
    // @return list of nick name
    getNickNameFilterList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetFilterNicknamelist (:customerIds,:searchString)', {
                replacements: {
                    customerIds: req.body.customerIds || null,
                    searchString: req.body.searchString || null
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get operation filter list based on search string
    // @return list of operations
    getOperationFilterList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetFilterOperationlist (:searchString)', {
                replacements: {
                    searchString: req.body.searchString || null
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get employee filter list based on search string
    // @return list of employees
    getEmployeeFilterList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetFilterEmployeelist (:searchString)', {
                replacements: {
                    searchString: req.body.searchString || null
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get equipment filter list based on search string
    // @return list of equipments
    getEquipmentFilterList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetFilterEquipmentlist (:searchString)', {
                replacements: {
                    searchString: req.body.searchString || null
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get material,supplier and tools filter list based on search string
    // @return list of material,supplier and tools
    getMaterialSupplierFilterList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetFilterMaterialSupplierlist (:searchString)', {
                replacements: {
                    searchString: req.body.searchString || null
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get UMID wise image and COFC document
    // POST : /api/v1/workorders/getWorkorderUsageMaterial
    /*
        DocType I - Image Only
        DocType A - Image And Document with UMID (Group By UMID duplicate COFC)
        DocType D - Document With UMID (Group By UMID)
    */
    // eslint-disable-next-line consistent-return
    getWorkorderUsageMaterial: (req, res) => {
        const { sequelize } = req.app.locals.models;
        let htmlHeader = '';
        let htmlFooter = '';

        if (req.body) {
            return sequelize.query('CALL Sproc_GetWoUmidImageAndCofcDoc (:pFromGenerated, :pWoId, :pSODtlId , :pShowDoc, :pPartType , :pIgnoreDuplicate , :pPrintSerialNo, :pGeneratedByID)', {
                replacements: {
                    pFromGenerated: parseInt(req.body.obj.fromGenerated),
                    pWoId: req.body.obj.woID ? req.body.obj.woID : null,
                    pSODtlId: req.body.obj.soDtlID ? req.body.obj.soDtlID : null,
                    pShowDoc: req.body.obj.showDoc ? req.body.obj.showDoc : 'A',
                    pPartType: req.body.obj.partType ? req.body.obj.partType : 'ALL',
                    pGeneratedByID: req.user.id,
                    pPrintSerialNo: parseInt(req.body.obj.includeSrNo) ? parseInt(req.body.obj.includeSrNo) : 1,
                    pIgnoreDuplicate: parseInt(req.body.obj.ignoreDup) ? parseInt(req.body.obj.ignoreDup) : 0
                },
                type: sequelize.QueryTypes.SELECT
                // eslint-disable-next-line consistent-return
            }).then((responselist) => {
                if (responselist && responselist.length > 0 && responselist[0] && responselist[0][0] && responselist[0][0].nodata !== 'nodata') { // && responselist[0].length > 0 && responselist[0][0]) {
                    // fromGenerated 1- WO level 2- PO level
                    if (parseInt(req.body.obj.fromGenerated) === 1) {
                        htmlHeader = fs.readFileSync('./default/umid_report/wo_usage_header.html').toString();
                        htmlHeader = htmlHeader.replace(new RegExp('##woNumberString##', 'g'), req.body.obj.woNumber);
                        htmlHeader = htmlHeader.replace(new RegExp('##MFRPNString##', 'g'), responselist[0][0].mfgPN);
                        htmlHeader = htmlHeader.replace(new RegExp('##CustmerNameString##', 'g'), responselist[0][0].customerName);
                        htmlHeader = htmlHeader.replace(new RegExp('##CustPOString##', 'g'), responselist[1][0].custPONumber);
                        htmlHeader = htmlHeader.replace(new RegExp('##CompLogoPath##', 'g'), responselist[2][0].compLogo);
                    } else {
                        htmlHeader = fs.readFileSync('./default/umid_report/po_usage_header.html').toString();
                        htmlHeader = htmlHeader.replace(new RegExp('##MFRPNString##', 'g'), responselist[0][0].mfgPN);
                        htmlHeader = htmlHeader.replace(new RegExp('##CustmerNameString##', 'g'), responselist[0][0].customerName);
                        htmlHeader = htmlHeader.replace(new RegExp('##CustPOString##', 'g'), responselist[1][0].custPONumber);
                        htmlHeader = htmlHeader.replace(new RegExp('##CompLogoPath##', 'g'), responselist[2][0].compLogo);
                    }
                    htmlFooter = fs.readFileSync('./default/umid_report/usage_footer.html').toString();
                    htmlFooter = htmlFooter.replace(new RegExp('##generatedAt##', 'g'), responselist[3][0].generatedAt);
                    htmlFooter = htmlFooter.replace(new RegExp('##generatedBy##', 'g'), responselist[3][0].generatedBy);
                    htmlFooter = htmlFooter.replace(new RegExp('##generatedByEmail##', 'g'), responselist[3][0].generatedByEmail);
                    const obj = {
                        htmlHeader: htmlHeader,
                        htmlFooter: htmlFooter,
                        dataList: responselist[0],
                        compLogo: responselist[2][0].compLogo,
                        srNoList: responselist[4][0].finalSrNo,
                        ignoreDup: parseInt(req.body.obj.ignoreDup),
                        includeSrNo: parseInt(req.body.obj.includeSrNo),
                        showDoc: req.body.obj.showDoc ? req.body.obj.showDoc : 'A'
                    };
                    if (parseInt(req.body.obj.fromGenerated) === 1) {
                        return module.exports.generateWOUsageMaterialPromise(req, obj).then((resPromise) => {
                            if (resPromise.state === STATE.SUCCESS) {
                                return res.send(resPromise.resultStream);
                            } else {
                                return res.end();
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return res.end();
                        });
                    } else {
                        return module.exports.generatePOUsageMaterialPromise(req, obj).then((resPromise) => {
                            if (resPromise.state === STATE.SUCCESS) {
                                return res.send(resPromise.resultStream);
                                // promise = resPromise.promise;
                                // finalBuffer = resPromise.finalBuffer;
                            } else {
                                return res.end();
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return res.end();
                        });
                    }
                } else {
                    return res.end();
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return res.end(err.message);
            });
        } else {
            return res.end();
        }
    },
    // Get WO Level Report Promise
    // EXPORT Used in: /api/v1/workorders/getWorkorderUsageMaterial
    generateWOUsageMaterialPromise: (req, obj) => {
        // var { sequelize } = req.app.locals.models;
        var umidList;
        var htmlString = '';
        var filePath = '';
        var fullFilePath = '';
        var templateData;
        var htmlContent;
        var htmlPDFStream;
        const margin = '{"top":"0px", "right":"50px", "bottom":"0px", "left":"0px"}';
        var recordIndex = 0; // Used to buffer output in sequence same as rows got in order from SP output.
        let bufferArray = [];
        let imageString = '';
        let mfgName = '';
        let mfgPart = '';
        var promise = [];
        let outStream;
        let pdfWriter;
        const finalBuffer = [];
        let htmlSrNoString;
        var resultStream = '';
        const blankPageString = [];
        let blankPageContent = '';
        try {
            htmlSrNoString = fs.readFileSync('./default/umid_report/serial_no_content.html').toString();
            if (obj.includeSrNo === 1) {
                htmlSrNoString = htmlSrNoString.replace(new RegExp('##serialNoContent##', 'g'), obj.srNoList ? obj.srNoList : '');
            } else {
                htmlSrNoString = '';
            }
            umidList = _.groupBy(obj.dataList, 'umid');
            bufferArray = [];
            // in case of ignore duplicate 'umid' will have -1
            _.each(umidList, (umid, index) => {
                // bufferArray.push(umid.countIndex);
                umid.countIndex = recordIndex;
                bufferArray.splice(umid.countIndex, 1, []);
                blankPageString.splice(umid.countIndex, 1, []);
                recordIndex += 1;
                finalBuffer.push('');
                htmlPDFStream = null;
                outStream = null;
                imageString = '';
                _.each(umid, (item) => {
                    mfgName = item.supplierName;
                    mfgPart = item.umidMfgPN;
                    if (item.genFilePath) {
                        filePath = item.genFilePath;
                        fullFilePath = `${config.APIUrl}${filePath}`;
                        if (item.gencFileType.includes('pdf')) {
                            bufferArray[umid.countIndex].push(fs.readFileSync(`.${filePath}`));
                        } else {
                            imageString += `<tr> <td style="text-align:center"><img src="${fullFilePath}" style="width:400px;height:400px;" /></td>  </tr>`;
                        }
                    }
                });
                if (obj.ignoreDup === 0) {
                    htmlString = fs.readFileSync('./default/umid_report/wo_content.html').toString();
                    htmlString = htmlString.replace(new RegExp('##ContenLabel1##', 'g'), 'UMID:');
                    htmlString = htmlString.replace(new RegExp('##UMIDString##', 'g'), index);
                    htmlString = htmlString.replace(new RegExp('##ContentLabel2##', 'g'), (mfgName ? 'MFR:' : ''));
                    htmlString = htmlString.replace(new RegExp('##supplierName##', 'g'), (mfgName ? mfgName : ''));
                    htmlString = htmlString.replace(new RegExp('##ContentLabel3##', 'g'), (mfgPart ? 'MFR Part#:' : ''));
                    htmlString = htmlString.replace(new RegExp('##umidMfgPN##', 'g'), (mfgPart ? mfgPart : ''));
                } else {
                    htmlString = fs.readFileSync('./default/umid_report/content_ignoreDup.html').toString();
                }
                // blankPageString[umid.countIndex].push(htmlString);
                blankPageContent = htmlString;
                blankPageContent = blankPageContent.replace(new RegExp('##htmlContent##', 'g'), `<img src="${obj.compLogo}" style="width:10px;height:10px;display:none;" />`);
                templateData = jsrender.templates(blankPageContent);
                blankPageContent = templateData.render({});
                blankPageString[umid.countIndex] = blankPageContent;
                imageString += `<img src="${obj.compLogo}" style="width:10px;height:10px;display:none;" />`;
                htmlString = htmlString.replace(new RegExp('##htmlContent##', 'g'), imageString);
                templateData = jsrender.templates(htmlString);
                htmlContent = templateData.render({});
                promise.push(
                    jsreport.render({
                        template: {
                            _id: '5b8eab51cca20ec3ffbdce95',
                            shortid: 'rJZ5FPjPQ',
                            name: 'result.html',
                            recipe: 'phantom-pdf',
                            engine: 'jsrender',
                            phantom: {
                                format: 'Letter',
                                margin: margin,
                                headerHeight: '250px',
                                footerHeight: '200px',
                                displayHeaderFooter: true,
                                header: obj.htmlHeader,
                                footer: obj.htmlFooter
                            },
                            content: htmlContent
                        }
                    }).then((out) => {
                        // fs.writeFileSync(`./uploads/report${index}.pdf`, out.content);
                        // fs.writeFileSync('./uploads/reportSrNo.pdf', outSrNo.content);
                        if ((obj.showDoc === 'A' || obj.showDoc === 'D') && bufferArray.length > 0) {
                            const tempContent = blankPageString[umid.countIndex];
                            return jsreport.render({
                                template: {
                                    _id: '5b8eab51cca20ec3ffbdce95',
                                    shortid: 'rJZ5FPjPQ',
                                    name: 'resultBlak.html',
                                    recipe: 'phantom-pdf',
                                    engine: 'jsrender',
                                    phantom: {
                                        format: 'Letter',
                                        margin: margin,
                                        headerHeight: '250px',
                                        footerHeight: '200px',
                                        displayHeaderFooter: true,
                                        header: obj.htmlHeader,
                                        footer: obj.htmlFooter
                                    },
                                    content: tempContent
                                }
                            }).then((outBlank) => {
                                outStream = null;
                                outStream = new memoryStreams.WritableStream();
                                // first blank page
                                if (bufferArray && bufferArray.length > 0 && bufferArray[umid.countIndex].length > 0) {
                                    const firstPDFStream = new hummus.PDFRStreamForBuffer(outBlank.content);
                                    pdfWriter = hummus.createWriterToModify(firstPDFStream, new hummus.PDFStreamForResponse(outStream));
                                }
                                // second append PDF files then html file (i.e. images)
                                bufferArray[umid.countIndex].forEach((buffer) => {
                                    const secondPDFStream = new hummus.PDFRStreamForBuffer(buffer);
                                    if (!pdfWriter) {
                                        pdfWriter = hummus.createWriterToModify(secondPDFStream, new hummus.PDFStreamForResponse(outStream));
                                    } else {
                                        pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
                                    }
                                });
                                htmlPDFStream = new hummus.PDFRStreamForBuffer(out.content);
                                if (!pdfWriter) {
                                    pdfWriter = hummus.createWriterToModify(htmlPDFStream, new hummus.PDFStreamForResponse(outStream));
                                } else {
                                    pdfWriter.appendPDFPagesFromPDF(htmlPDFStream);
                                }
                                pdfWriter.end();
                                pdfWriter = null;
                                finalBuffer.splice(umid.countIndex, 1, outStream.toBuffer());
                                outStream.end();
                                return STATE.SUCCESS;
                            });
                        } else {
                            outStream = null;
                            outStream = new memoryStreams.WritableStream();
                            // first append PDF files then html file (i.e. images)
                            bufferArray[umid.countIndex].forEach((buffer) => {
                                const secondPDFStream = new hummus.PDFRStreamForBuffer(buffer);
                                if (!pdfWriter) {
                                    pdfWriter = hummus.createWriterToModify(secondPDFStream, new hummus.PDFStreamForResponse(outStream));
                                } else {
                                    pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
                                }
                            });
                            htmlPDFStream = new hummus.PDFRStreamForBuffer(out.content);
                            if (!pdfWriter) {
                                pdfWriter = hummus.createWriterToModify(htmlPDFStream, new hummus.PDFStreamForResponse(outStream));
                            } else {
                                pdfWriter.appendPDFPagesFromPDF(htmlPDFStream);
                            }
                            pdfWriter.end();
                            pdfWriter = null;
                            finalBuffer.splice(umid.countIndex, 1, outStream.toBuffer());
                            outStream.end();
                            return STATE.SUCCESS;
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    })
                );
            });
            return Promise.all(promise).then(() => {
                outStream = new memoryStreams.WritableStream();
                pdfWriter = null;
                finalBuffer.forEach((buffer) => {
                    if (buffer) {
                        const finalPDFStream = new hummus.PDFRStreamForBuffer(buffer);
                        if (!pdfWriter) {
                            pdfWriter = hummus.createWriterToModify(finalPDFStream, new hummus.PDFStreamForResponse(outStream));
                        } else {
                            pdfWriter.appendPDFPagesFromPDF(finalPDFStream);
                        }
                    }
                });
                // append Final SrNo Page
                htmlSrNoString += `<img src="${obj.compLogo}" style="width:10px;height:10px;display:none;" />`;
                templateData = jsrender.templates(htmlSrNoString);
                htmlSrNoString = templateData.render({});
                return jsreport.render({
                    template: {
                        _id: '5b8eab51cca20ec3ffbdce95',
                        shortid: 'rJZ5FPjPQ',
                        name: 'result.html',
                        recipe: 'phantom-pdf',
                        engine: 'jsrender',
                        phantom: {
                            format: 'Letter',
                            margin: margin,
                            headerHeight: '250px',
                            footerHeight: '200px',
                            displayHeaderFooter: true,
                            header: obj.htmlHeader,
                            footer: obj.htmlFooter
                        },
                        content: htmlSrNoString
                    }
                }).then((outSrNo) => {
                    if (obj.includeSrNo === 1) {
                        htmlPDFStream = new hummus.PDFRStreamForBuffer(outSrNo.content);
                        pdfWriter.appendPDFPagesFromPDF(htmlPDFStream);
                    }
                    if (pdfWriter) { pdfWriter.end(); }
                    resultStream = outStream.toBuffer();
                    outStream.end();
                    return { state: STATE.SUCCESS, resultStream: resultStream };
                });
            });
        } catch (error) {
            console.trace();
            console.error(error);
            return { state: STATE.FAILED, resultStream: null };
        }
    },
    // Get Customer PO(SalesOrder) Level Report Promise
    // EXPORT Used in: /api/v1/workorders/getWorkorderUsageMaterial
    generatePOUsageMaterialPromise: (req, obj) => {
        // var { sequelize } = req.app.locals.models;
        var umidList;
        var woIDList;
        var htmlString = '';
        var filePath = '';
        var fullFilePath = '';
        var templateData;
        var htmlContent;
        var htmlPDFStream;
        const margin = '{"top":"0px", "right":"50px", "bottom":"0px", "left":"0px"}';
        var recordIndex = 0; // Used to buffer output in sequence same as rows got in order from SP output.
        let bufferArray = [];
        let imageString = '';
        let mfgName = '';
        let mfgPart = '';
        var promise = [];
        let outStream;
        let pdfWriter;
        const finalBuffer = [];
        let resultStream = '';
        let htmlSrNoString;
        let blankPageString = [];
        let blankPageContent = '';
        const outBlankArr = [];
        try {
            woIDList = _.groupBy(obj.dataList, 'woId');
            htmlSrNoString = fs.readFileSync('./default/umid_report/serial_no_content.html').toString();
            if (obj.includeSrNo === 1) {
                htmlSrNoString = htmlSrNoString.replace(new RegExp('##serialNoContent##', 'g'), obj.srNoList ? obj.srNoList : '');
            } else {
                htmlSrNoString = '';
            }
            templateData = jsrender.templates(htmlSrNoString);
            htmlSrNoString = templateData.render({});
            bufferArray = [];
            blankPageString = [];
            // in case of ignore duplicate 'woID'  & 'umid' will have -1
            _.each(woIDList, (woID) => {
                umidList = _.groupBy(woID, 'umid');
                _.each(umidList, (umid, index) => {
                    umid.countIndex = recordIndex;
                    bufferArray.splice(umid.countIndex, 1, []);
                    blankPageString.splice(umid.countIndex, 1, []);
                    recordIndex += 1;
                    finalBuffer.push('');
                    htmlPDFStream = null;
                    outStream = null;
                    imageString = '';
                    _.each(umid, (item) => {
                        mfgName = item.supplierName;
                        mfgPart = item.umidMfgPN;
                        if (item.genFilePath) {
                            filePath = item.genFilePath;
                            fullFilePath = `${config.APIUrl}${filePath}`;
                            if (item.gencFileType.includes('pdf')) {
                                bufferArray[umid.countIndex].push(fs.readFileSync(`.${filePath}`));
                            } else {
                                imageString += `<tr> <td style="text-align:center"><img src="${fullFilePath}" style="width:400px;height:400px;object-fit: cover;" /></td>  </tr>`;
                            }
                        }
                    });
                    if (obj.ignoreDup === 0) {
                        htmlString = fs.readFileSync('./default/umid_report/po_content.html').toString();
                        htmlString = htmlString.replace(new RegExp('##WOIDString##', 'g'), umid[0].woNumber);
                        htmlString = htmlString.replace(new RegExp('##ContenLabel1##', 'g'), 'UMID:');
                        htmlString = htmlString.replace(new RegExp('##UMIDString##', 'g'), index);
                        htmlString = htmlString.replace(new RegExp('##ContentLabel2##', 'g'), (mfgName ? 'MFR:' : ''));
                        htmlString = htmlString.replace(new RegExp('##supplierName##', 'g'), (mfgName ? mfgName : ''));
                        htmlString = htmlString.replace(new RegExp('##ContentLabel3##', 'g'), (mfgPart ? 'MFR Part#:' : ''));
                        htmlString = htmlString.replace(new RegExp('##umidMfgPN##', 'g'), (mfgPart ? mfgPart : ''));
                    } else {
                        htmlString = fs.readFileSync('./default/umid_report/content_ignoreDup.html').toString();
                    }
                    blankPageContent = htmlString;
                    blankPageContent = blankPageContent.replace(new RegExp('##htmlContent##', 'g'), `<img src="${obj.compLogo}" style="width:10px;height:10px;display:none;" />`);
                    templateData = jsrender.templates(blankPageContent);
                    blankPageContent = templateData.render({});
                    blankPageString[umid.countIndex] = blankPageContent;
                    imageString += `<img src="${obj.compLogo}" style="width:10px;height:10px;display:none;" />`;
                    htmlString = htmlString.replace(new RegExp('##htmlContent##', 'g'), imageString);
                    templateData = jsrender.templates(htmlString);
                    htmlContent = templateData.render({});
                    promise.push(
                        jsreport.render({
                            template: {
                                _id: '5b8eab51cca20ec3ffbdce95',
                                shortid: 'rJZ5FPjPQ',
                                name: 'result.html',
                                recipe: 'phantom-pdf',
                                engine: 'jsrender',
                                phantom: {
                                    format: 'Letter',
                                    margin: margin,
                                    headerHeight: '250px',
                                    footerHeight: '200px',
                                    displayHeaderFooter: true,
                                    header: obj.htmlHeader,
                                    footer: obj.htmlFooter
                                },
                                content: htmlContent
                            }
                        }).then((out) => {
                            if ((obj.showDoc === 'A' || obj.showDoc === 'D') && bufferArray.length > 0) {
                                const tempContent = blankPageString[umid.countIndex];
                                outBlankArr.push('');
                                return jsreport.render({
                                    template: {
                                        _id: '5b8eab51cca20ec3ffbdce95',
                                        shortid: 'rJZ5FPjPQ',
                                        name: 'resultBlak.html',
                                        recipe: 'phantom-pdf',
                                        engine: 'jsrender',
                                        phantom: {
                                            format: 'Letter',
                                            margin: margin,
                                            headerHeight: '250px',
                                            footerHeight: '200px',
                                            displayHeaderFooter: true,
                                            header: obj.htmlHeader,
                                            footer: obj.htmlFooter
                                        },
                                        content: tempContent
                                    }
                                }).then((outBlank) => {
                                    // fs.writeFileSync(`./uploads/report${index}.pdf`, outBlank.content);
                                    outBlankArr[umid.countIndex] = outBlank.content;
                                    outStream = null;
                                    outStream = new memoryStreams.WritableStream();
                                    // first blank page
                                    if (bufferArray && bufferArray.length > 0 && bufferArray[umid.countIndex].length > 0) {
                                        const firstPDFStream = new hummus.PDFRStreamForBuffer(outBlankArr[umid.countIndex]);
                                        pdfWriter = hummus.createWriterToModify(firstPDFStream, new hummus.PDFStreamForResponse(outStream));
                                    }
                                    // second append PDF files then html file (i.e. images)
                                    bufferArray[umid.countIndex].forEach((buffer) => {
                                        const secondPDFStream = new hummus.PDFRStreamForBuffer(buffer);
                                        if (!pdfWriter) {
                                            pdfWriter = hummus.createWriterToModify(secondPDFStream, new hummus.PDFStreamForResponse(outStream));
                                        } else {
                                            pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
                                        }
                                    });
                                    htmlPDFStream = new hummus.PDFRStreamForBuffer(out.content);
                                    if (!pdfWriter) {
                                        pdfWriter = hummus.createWriterToModify(htmlPDFStream, new hummus.PDFStreamForResponse(outStream));
                                    } else {
                                        pdfWriter.appendPDFPagesFromPDF(htmlPDFStream);
                                    }
                                    pdfWriter.end();
                                    pdfWriter = null;
                                    finalBuffer.splice(umid.countIndex, 1, outStream.toBuffer());
                                    outStream.end();
                                    return STATE.SUCCESS;
                                });
                            } else {
                                outStream = new memoryStreams.WritableStream();
                                // first append PDF files then html file (i.e. images)
                                bufferArray[umid.countIndex].forEach((buffer) => {
                                    const secondPDFStream = new hummus.PDFRStreamForBuffer(buffer);
                                    if (!pdfWriter) {
                                        pdfWriter = hummus.createWriterToModify(secondPDFStream, new hummus.PDFStreamForResponse(outStream));
                                    } else {
                                        pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
                                    }
                                });
                                htmlPDFStream = new hummus.PDFRStreamForBuffer(out.content);
                                if (!pdfWriter) {
                                    pdfWriter = hummus.createWriterToModify(htmlPDFStream, new hummus.PDFStreamForResponse(outStream));
                                } else {
                                    pdfWriter.appendPDFPagesFromPDF(htmlPDFStream);
                                }
                                pdfWriter.end();
                                pdfWriter = null;
                                // finalBuffer.push(outStream.toBuffer());
                                finalBuffer.splice(umid.countIndex, 1, outStream.toBuffer());
                                outStream.end();
                                return STATE.SUCCESS;
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        })
                    );
                });
            });
            return Promise.all(promise).then(() => {
                outStream = new memoryStreams.WritableStream();
                pdfWriter = null;
                finalBuffer.forEach((buffer) => {
                    if (buffer) {
                        const finalPDFStream = new hummus.PDFRStreamForBuffer(buffer);
                        if (!pdfWriter) {
                            pdfWriter = hummus.createWriterToModify(finalPDFStream, new hummus.PDFStreamForResponse(outStream));
                        } else {
                            pdfWriter.appendPDFPagesFromPDF(finalPDFStream);
                        }
                    }
                });
                // append Final SrNo Page
                htmlSrNoString += `<img src="${obj.compLogo}" style="width:10px;height:10px;display:none;" />`;
                templateData = jsrender.templates(htmlSrNoString);
                htmlSrNoString = templateData.render({});
                return jsreport.render({
                    template: {
                        _id: '5b8eab51cca20ec3ffbdce95',
                        shortid: 'rJZ5FPjPQ',
                        name: 'result.html',
                        recipe: 'phantom-pdf',
                        engine: 'jsrender',
                        phantom: {
                            format: 'Letter',
                            margin: margin,
                            headerHeight: '250px',
                            footerHeight: '200px',
                            displayHeaderFooter: true,
                            header: obj.htmlHeader,
                            footer: obj.htmlFooter
                        },
                        content: htmlSrNoString
                    }
                }).then((outSrNo) => {
                    if (obj.includeSrNo === 1) {
                        htmlPDFStream = new hummus.PDFRStreamForBuffer(outSrNo.content);
                        pdfWriter.appendPDFPagesFromPDF(htmlPDFStream);
                    }
                    if (pdfWriter) { pdfWriter.end(); }
                    resultStream = outStream.toBuffer();
                    outStream.end();
                    return { state: STATE.SUCCESS, resultStream: resultStream };
                });
            });
        } catch (error) {
            return { state: STATE.FAILED, resultStream: resultStream };
        }
    },
    // get Check date code saved on publish WO
    // GET : /api/v1/workorders/checkDateCodeOnPublishWO
    // @return Check date code saved on publish WO
    checkDateCodeOnPublishWO: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('Select fun_getWODateCodeByWOID(:pwoID)', {
            replacements: {
                pwoID: req.query.woID || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            const qty = _.values(response[0])[0];
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, qty, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // get Assembly Stock PO Details by Assembly id
    // POST : /api/v1/workorders/getAssemblyStockPODetailsByAssyID
    // @return Assembly Stock PO Details by Assembly id
    getAssemblyStockPODetailsByAssyID: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.body && req.body.assyID) {

            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_GetAssemblyPOStockDetails (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartID,:pIsShowAllPO)',
                {
                    replacements: {
                        pPageIndex: req.body.page,
                        pRecordPerPage: req.body.isExport ? null : filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pPartID: req.body.assyID,
                        pIsShowAllPO: req.body.isShowAllPO
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    poAssemblyDetails: _.values(response[1]),
                    count: response[0][0]['TotalRecord']
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // get Assembly Stock WO Details by Assembly id
    // POST : /api/v1/workorders/getAssemblyStockWODetailsByAssyID
    // @return Assembly Stock WO Details by Assembly id
    getAssemblyStockWODetailsByAssyID: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.body && req.body.assyID) {

            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_GetAssemblyWOStockDetails (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartID,:pWoID,:pPONumber,:pIsShowAllWO, :pSONumber)',
                {
                    replacements: {
                        pPageIndex: req.body.page,
                        pRecordPerPage: req.body.isExport ? null : filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pPartID: req.body.assyID,
                        pWoID: req.body.woID ? req.body.woID : null,
                        pPONumber: req.body.poNumber ? req.body.poNumber : null,
                        pIsShowAllWO: req.body.isShowAllWO,
                        pSONumber: req.body.SONumber ? req.body.SONumber : null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    woAssemblyDetails: _.values(response[1]),
                    count: response[0][0]['TotalRecord']
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // get assembly summary details
    // GET : /api/v1/workorders/getAssemblyStockSummaryByAssyID
    // @return Summary of assembly for possible excess qty
    getAssemblyStockSummaryByAssyID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetAssemblySummaryDetails(:pPartID)', {
            replacements: {
                pPartID: req.body.assyID || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response && response.length > 0) {
                const assemblySummaryDetails = _.values(response[0])[0];
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, assemblySummaryDetails, null);
            } else { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(workOrderModuleName), err: null, data: null }); }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};