const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotCreate, InvalidPerameter, NotUpdate, NotDelete } = require('../../errors');
const TimelineController = require('../../timeline/controllers/TimelineController');

const timelineObj = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_CLUSTER;
const workorderClusterConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_CLUSTER;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
const woClusterModuleName = DATA_CONSTANT.WORKORDER_CLUSTER.NAME;

const inputFields = [
    'clusterID',
    'woID',
    'clusterName',
    'displayOrder',
    'isParellelOperation',
    'isDeleted',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy'
];


module.exports = {
    // Get list of workorder cluster by cluster id
    // GET : /api/v1/workorder_cluster
    // @param {id} int
    // @return list of workorder cluster
    retriveWorkorderClusters: (req, res) => {
        const { WorkorderCluster } = req.app.locals.models;
        if (req.params.id) {
            // WorkorderCluster.findByPk(req.params.id)
            WorkorderCluster.findAll({
                where: { clusterID: req.params.id }
            })
                .then((workorderCluster) => {
                    if (!workorderCluster) {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woClusterModuleName)));
                    }
                    return resHandler.successRes(res, 200, STATE.SUCCESS, workorderCluster);
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woClusterModuleName)),
                        err.errors, err.fields);
                });
        } else {
            /* Call common ui grid filter function */
            const filter = COMMON.UiGridFilterSearch(req);

            WorkorderCluster.findAndCountAll(filter).then((workorderCluster) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, { workorderCluster: workorderCluster.rows, Count: workorderCluster.count });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woClusterModuleName)));
            });
        }
    },
    // Create workorder cluster
    // POST : /api/v1/workorder_cluster
    // @return new create workorder cluster detail
    createWorkorderCluster: (req, res) => {
        const { sequelize, WorkorderCluster, Workorder } = req.app.locals.models;
        if (req.body.clusterName) { req.body.clusterName = COMMON.TEXT_WORD_CAPITAL(req.body.clusterName, false); }

        if (req.body) {
            return WorkorderCluster.count({
                where: {
                    clusterName: req.body.clusterName,
                    woID: req.body.woID
                }
            }).then((count) => {
                if (count) {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_CLUSTER.CLUSTERNAME_UNIQUE));
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return sequelize.transaction().then((t) => {
                        WorkorderCluster.create(req.body, {
                            fields: inputFields,
                            transaction: t
                        }).then((workorderCluster) => {
                            const promises = [];
                            // [S] add log of create work order cluster for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: workorderClusterConstObj.CREATE.title,
                                eventDescription: COMMON.stringFormat(workorderClusterConstObj.CREATE.description, req.body.clusterName, req.body.woNumber, req.user.username),
                                refTransTable: workorderClusterConstObj.refTransTableName,
                                refTransID: workorderCluster.clusterID,
                                eventType: timelineObj.id,
                                url: COMMON.stringFormat(workorderClusterConstObj.url, req.body.woID),
                                eventAction: timelineEventActionConstObj.CREATE
                            };
                            req.objEvent = objEvent;
                            const woModel = {
                                woID: req.body.woID,
                                isClusterApplied: true
                            };
                            promises.push(Workorder.update(woModel, {
                                where: {
                                    woID: req.body.woID
                                },
                                transaction: t,
                                fields: ['isClusterApplied']
                            }));
                            promises.push(TimelineController.createTimeline(req, res, t));
                            // [E] add log of create work order cluster for timeline users

                            return Promise.all(promises).then(() => t.commit().then(() => resHandler.successRes(res, 200, STATE.SUCCESS, { clusterID: workorderCluster.clusterID, userMessage: MESSAGE_CONSTANT.ADDED(woClusterModuleName) })
                            )).catch((err) => {
                                t.rollback();
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, 200,
                                    STATE.EMPTY,
                                    new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woClusterModuleName)));
                            });
                        }).catch((err) => {
                            t.rollback();
                            console.trace();
                            console.error(err);
                            if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                return resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
                            } else {
                                return resHandler.errorRes(res, 200,
                                    STATE.EMPTY,
                                    new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woClusterModuleName)));
                            }
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                            return resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
                        } else {
                            return resHandler.errorRes(res, 200,
                                STATE.EMPTY,
                                new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woClusterModuleName)));
                        }
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200,
                    STATE.EMPTY,
                    new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woClusterModuleName)));
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Update workorder cluster by cluster id
    // PUT : /api/v1/workorder_cluster
    // @param {id} int
    // @return API response
    updateWorkorderCluster: (req, res) => {
        const { WorkorderCluster, Workorder } = req.app.locals.models;
        if (req.body.clusterName) { req.body.clusterName = COMMON.TEXT_WORD_CAPITAL(req.body.clusterName, false); }

        if (req.params.id) {
            WorkorderCluster.count({
                where: {
                    clusterName: req.body.clusterName,
                    woID: req.body.woID,
                    clusterID: { [Op.ne]: req.params.id }
                }
            })
                .then((count) => {
                    if (count) {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_CLUSTER.CLUSTERNAME_UNIQUE));
                    } else {
                        COMMON.setModelUpdatedByFieldValue(req);
                        return WorkorderCluster.update(req.body, {
                            where: {
                                clusterID: req.params.id
                            },
                            fields: inputFields
                        }).then((rowsUpdated) => {
                            if (rowsUpdated[0] === 1) {
                                // [S] add log of update work order cluster for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: workorderClusterConstObj.UPDATE.title,
                                    eventDescription: COMMON.stringFormat(workorderClusterConstObj.UPDATE.description, req.body.clusterName, req.body.woNumber, req.user.username),
                                    refTransTable: workorderClusterConstObj.refTransTableName,
                                    refTransID: req.params.id,
                                    eventType: timelineObj.id,
                                    url: COMMON.stringFormat(workorderClusterConstObj.url, req.body.woID),
                                    eventAction: timelineEventActionConstObj.UPDATE
                                };
                                req.objEvent = objEvent;
                                TimelineController.createTimeline(req);
                                // [E] add log of update work order cluster for timeline users


                                req.body.isOperationsVerified = false;
                                return Workorder.update(req.body, {
                                    where: {
                                        woID: req.body.woID
                                    },
                                    fields: ['updatedBy', 'updatedAt', 'isOperationsVerified']
                                }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(woClusterModuleName) })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                        return resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
                                    } else {
                                        return resHandler.errorRes(res,
                                            200,
                                            STATE.EMPTY,
                                            new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(woClusterModuleName)));
                                    }
                                });
                            } else {
                                return resHandler.errorRes(res, 200, STATE.EMPTY,
                                    new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(woClusterModuleName)));
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                return resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
                            } else {
                                return resHandler.errorRes(res,
                                    200,
                                    STATE.EMPTY,
                                    new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(woClusterModuleName)));
                            }
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200,
                        STATE.EMPTY,
                        new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(woClusterModuleName)));
                });
        }
    },
    // Delete workorder cluster
    // DELETE : /api/v1/workorder_cluster
    // @return API response
    deleteWorkorderCluster: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.id) {
            const tableName = COMMON.AllEntityIDS.WorkorderCluster.Name;
            sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.params.id,
                        deletedBy: req.user.id,
                        entityID: null,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((cluster) => {
                    const clusterDetail = cluster[0];
                    if (clusterDetail && clusterDetail.TotalCount === 0) {
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.DELETED(woClusterModuleName) });
                    } else {
                        return resHandler.successRes(res, 200, STATE.EMPTY, clusterDetail, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res,
                        200,
                        STATE.EMPTY,
                        new NotDelete(MESSAGE_CONSTANT.NOT_DELETED(woClusterModuleName)));
                });
        } else {
            resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Retrive list of workorder cluster by workorder id
    // GET : /api/v1/workorder_cluster/retriveClusterListbyWoID
    // @param {woID} int
    // @return list of workorder cluster
    retriveClusterListbyWoID: (req, res) => {
        const { WorkorderCluster, WorkorderOperationCluster, GenericCategory, WorkorderOperation, WorkorderTransOperationHoldUnhold } = req.app.locals.models;
        return WorkorderCluster.findAll({
            where: {
                isDeleted: false,
                woID: req.params.woID
            },
            attributes: ['clusterID', 'woID', 'clusterName', 'displayOrder', 'isDeleted', 'isParellelOperation'],
            include: [{
                model: WorkorderOperationCluster,
                as: 'workorderOperationCluster',
                attributes: ['woClusterID', 'clusterID', 'opID', 'displayOrder', 'isDeleted', 'woOPID'],
                required: false,
                include: [{
                    model: WorkorderOperation,
                    as: 'workorderOperation',
                    attributes: ['woOPID', 'woID', 'opID', 'opName', 'opNumber', 'opStatus', 'operationTypeID', 'isStopOperation',
                        'isRework', 'qtyControl', 'isIssueQty', 'isMoveToStock', 'isPlacementTracking', 'isTrackBySerialNo', 'isAllowFinalSerialMapping', 'isLoopOperation', 'refLoopWOOPID', 'isPreProgrammingComponent', 'isTeamOperation'],
                    required: false,
                    where: {
                        woID: req.params.woID
                    },
                    include: [{
                        model: WorkorderTransOperationHoldUnhold,
                        as: 'workorderTransOperationHoldUnhold',
                        where: {
                            endDate: { [Op.eq]: null }
                        },
                        required: false,
                        attributes: ['woTransOpHoldUnholdId']
                    }, {
                        model: GenericCategory,
                        as: 'operationType',
                        required: false,
                        attributes: ['gencCategoryID', 'gencCategoryCode', 'gencCategoryName']
                    }]
                }]
            }]
        }).then((clusterData) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, clusterData);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woClusterModuleName)));
        });
    },

    // check duplicate cluster name
    // GET : /api/v1/workorder_cluster/checkDuplicateWOClusterName
    // @param {woID} int
    // @param {clusterName} string
    // @param {clusterID} int // optional
    // @return duplicate cluster if found
    checkDuplicateWOClusterName: (req, res) => {
        const { WorkorderCluster } = req.app.locals.models;
        if (req.body && req.body.clusterName && req.body.woID) {
            const whereClauseWOCluster = {
                clusterName: req.body.clusterName,
                woID: req.body.woID
            };
            if (req.body.clusterID) {
                whereClauseWOCluster.clusterID = { [Op.ne]: req.body.clusterID };
            }
            return WorkorderCluster.findOne({
                where: whereClauseWOCluster,
                attributes: ['clusterID']
            }).then((woCluster) => {
                if (woCluster) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateClusterName: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateClusterName: false }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    }
};
