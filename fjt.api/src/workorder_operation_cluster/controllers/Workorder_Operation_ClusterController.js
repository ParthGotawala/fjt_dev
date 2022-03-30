const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotCreate, InvalidPerameter, NotUpdate, NotDelete } = require('../../errors');

const timelineObjForWoOpCluster = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_CLUSTER;
const WoOpClusterConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_CLUSTER;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const woOPClusModuleName = DATA_CONSTANT.WORKORDER_OPERATION_CLUSTER.NAME;
const workOrderModuleName = DATA_CONSTANT.WORKORDER.NAME;

const inputFields = [
    'woClusterID',
    'clusterID',
    'opID',
    'woOPID',
    'displayOrder',
    'isDeleted',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Get list of workorder operation clusters
    // GET : /api/v1/workorder_operation_cluster
    // @param {id} int
    // @return list of workorder operation clusters
    retriveWorkorderOperationClusters: (req, res) => {
        const { WorkorderOperationCluster } = req.app.locals.models;
        if (req.params.id) {
            // WorkorderOperationCluster.findByPk(req.params.id)
            WorkorderOperationCluster.findAll({
                where: { woClusterID: req.params.id }
            }).then((workorderCluster) => {
                if (!workorderCluster) {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPClusModuleName)));
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, workorderCluster);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPClusModuleName)),
                    err.errors, err.fields);
            });
        } else {
            /* Call common ui grid filter function */
            const filter = COMMON.UiGridFilterSearch(req);

            WorkorderOperationCluster.findAndCountAll(filter).then((workorderCluster) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, { workorderCluster: workorderCluster.rows, Count: workorderCluster.count });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOPClusModuleName)));
            });
        }
    },
    // create workorder operation cluster
    // POST : /api/v1/workorder_operation_cluster
    // @return new created workorder operation cluster detail
    createWorkorderOperationCluster: (req, res) => {
        const { WorkorderOperationCluster, Workorder, sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.saveObj);

            return sequelize.transaction().then((t) => {
                const CUClusterPromises = [];
                _.each(req.body.saveObj, (clusterItem) => {
                    /* update  cluster,display_order of already exists */
                    if (clusterItem.woClusterID) {
                        const updateClusterObj = {
                            clusterID: clusterItem.clusterID,
                            displayOrder: clusterItem.displayOrder,
                            updatedBy: clusterItem.updatedBy,
                            updateByRoleId: clusterItem.updateByRoleId
                        };

                        CUClusterPromises.push(WorkorderOperationCluster.update(updateClusterObj, {
                            where: {
                                woClusterID: clusterItem.woClusterID
                            },
                            transaction: t
                        }));
                    } else { /* add op in cluster : new entry */
                        CUClusterPromises.push(WorkorderOperationCluster.create(clusterItem, {
                            transaction: t
                        }));
                    }
                });


                // WorkorderOperationCluster.bulkCreate(req.body, {
                //    updateOnDuplicate: inputFields, individualHooks: true
                // })
                // .then((workorderCluster) => {

                return Promise.all(CUClusterPromises).then((CUClusterPromisesResp) => {
                    const timeLinePromise = [];
                    let createdWorkorderCluster = [];
                    if (CUClusterPromisesResp && CUClusterPromisesResp.length > 0) {
                        createdWorkorderCluster = CUClusterPromisesResp;

                        // [S] add log of adding operation to cluster for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: null,
                            eventDescription: null,
                            refTransTable: WoOpClusterConstObj.refTransTableName,
                            refTransID: _.map(createdWorkorderCluster, 'woClusterID').toString(),
                            eventType: timelineObjForWoOpCluster.id,
                            url: COMMON.stringFormat(WoOpClusterConstObj.url, req.body.woID),
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEvent;
                        timeLinePromise.push(TimelineController.createTimeline(req, res, t));
                        // [E] add log of adding operation to cluster for timeline users
                    }

                    if (req.body.woID) {
                        COMMON.setModelUpdatedByFieldValue(req);
                        req.body.isOperationsVerified = false;
                        timeLinePromise.push(Workorder.update(req.body, {
                            where: {
                                woID: req.body.woID
                            },
                            fields: ['updatedBy', 'updatedAt', 'isOperationsVerified'],
                            transaction: t
                        }));
                    }

                    return Promise.all(timeLinePromise).then(() => t.commit()
                        .then(() => resHandler.successRes(res, 200, STATE.SUCCESS, {
                            woClusterID: createdWorkorderCluster ? createdWorkorderCluster.woClusterID : createdWorkorderCluster,
                            userMessage: MESSAGE_CONSTANT.ADDED(woOPClusModuleName)
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })).catch((err) => {
                            t.rollback();
                            console.trace();
                            console.error(err);
                            resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPClusModuleName)));
                        });
                }).catch((err) => {
                    t.rollback();
                    console.trace();
                    console.error(err);
                    resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_ADDED(woOPClusModuleName)));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // <-- Need to check for same implementation for 'createWorkorderOperationCluster' and 'updateWorkorderOperationCluster'-->

    // Update workorder operation cluster
    // PUT : /api/v1/workorder_operation_cluster
    // @return API response
    updateWorkorderOperationCluster: (req, res) => {
        const { WorkorderOperationCluster, Workorder } = req.app.locals.models;
        if (req.body) {
            req.body.isOperationsVerified = false;
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body);
            // WorkorderOperationCluster.update(req.body, {
            //    where: {
            //        woClusterID: req.params.id,
            //    },
            //    fields: inputFields,
            // })
            return WorkorderOperationCluster.bulkCreate(req.body, {
                updateOnDuplicate: inputFields
            })
                .then((rowsUpdated) => {
                    // [S] add log of moving operation to cluster for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: null,
                        eventDescription: null,
                        refTransTable: WoOpClusterConstObj.refTransTableName,
                        refTransID: _.map(rowsUpdated, 'woClusterID').toString(),
                        eventType: timelineObjForWoOpCluster.id,
                        url: COMMON.stringFormat(WoOpClusterConstObj.url, req.body[0].woID),
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log of moving operation to cluster for timeline users

                    COMMON.setModelUpdatedByFieldValue(req);
                    if (req.body.woID) {
                        return Workorder.update(req.body, {
                            where: {
                                woID: req.body.woID
                            },
                            fields: ['updatedBy', 'updatedAt', 'isOperationsVerified']
                        }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(woOPClusModuleName) })).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                return resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
                            } else if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                            } else {
                                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(workOrderModuleName)));
                            }
                        });
                    } else {
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(woOPClusModuleName) });
                    }
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
                    } else if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res,
                            200,
                            STATE.EMPTY,
                            new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(woOPClusModuleName)));
                    }
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Delete workorder operation cluster by workorder operation cluster ID
    // DELETE : /api/v1/workorder_operation_cluster
    // @param {id} int
    // @return API response
    deleteClusterOperationFromWorkOrder: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const tableName = COMMON.AllEntityIDS.WorkorderOperationCluster.Name;
            sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.listObj.clusterID.toString(),
                        deletedBy: req.user.id,
                        entityID: null,
                        refrenceIDs: req.body.listObj.woOPID.toString(),
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((cluster) => {
                    const clusterDetail = cluster[0];
                    if (clusterDetail && clusterDetail.TotalCount === 0) {
                        return resHandler.successRes(res, 200, STATE.SUCCESS, clusterDetail, MESSAGE_CONSTANT.DELETED(woOPClusModuleName));
                    } else {
                        return resHandler.successRes(res, 200, STATE.SUCCESS, clusterDetail, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res,
                        200,
                        STATE.EMPTY,
                        new NotDelete(MESSAGE_CONSTANT.NOT_DELETED(woOPClusModuleName)));
                });
        } else {
            resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    }
};
