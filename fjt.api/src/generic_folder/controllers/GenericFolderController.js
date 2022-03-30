const fs = require('fs');
const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');

const GenericFolderConstObj = DATA_CONSTANT.TIMLINE.GENERIC_FOLDER;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
const GenericFilesConstObj = DATA_CONSTANT.TIMLINE.GENERICFILES;
var TimelineController = require('../../timeline/controllers/TimelineController');
var GenericRecycleBinController = require('../../generic_recycle_bin/controllers/GenericRecycleBinController');

const allEntity = COMMON.AllEntityIDS;

const inputFields = [
    'gencFolderID',
    'gencFolderName',
    'refTransID',
    'entityID',
    'gencFileOwnerType',
    'roleId',
    'refParentId',
    'isDeleted',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isRecycle'
];

module.exports = {
    // Create folder
    // POST : /api/v1/generic_folder/createFolder
    // @return created folder detail
    createFolder: (req, res) => {
        const {
            GenericFolder
        } = req.app.locals.models;
        req.body.gencFolderName = req.body.gencFolderName.trim();
        GenericFolder.count({
            where: {
                refParentId: req.body.refParentId,
                refTransID: req.body.refTransID,
                gencFileOwnerType: req.body.gencFileOwnerType,
                gencFolderName: req.body.gencFolderName,
                isRecycle: false
            }
        }).then((count) => {
            if (count === 0) {
                COMMON.setModelCreatedByFieldValue(req);

                return GenericFolder.create(req.body, {
                    fields: inputFields
                }).then((gencFolder) => {
                    if (req.body.gencFileOwnerType && (req.body.gencFileOwnerType === allEntity.Workorder.Name ||
                        req.body.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                        req.body.gencFileOwnerType === allEntity.ECORequest.Name ||
                        req.body.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                        // [S] add log of creating folder for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: null,
                            eventDescription: null,
                            refTransTable: GenericFolderConstObj.refTransTableName,
                            refTransID: gencFolder.gencFolderID,
                            eventType: null,
                            url: null,
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of creating folder for timeline users
                    }

                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, gencFolder, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.GENERIC_FOLDER_DUPLICATE_NAME, err: null, data: null });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of folder and document
    // POST : /api/v1/generic_folder/retriveFolderList
    // @return list of folder and document
    retriveFolderList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        var refTransId = req.body.refTransID;
        var entityId = req.body.entityId;
        var accessLevel = req.body.accessLevel;
        var gencFileOwnerType = req.body.gencFileOwnerType;
        var isTraveler = req.body.isTraveler;

        return sequelize
            .query('CALL Sproc_GetGenericFolders (:pRefTransId, :pEntityId, :pAccessLevel,:pGencFileOwnerType, :pIsTraveler)', {
                replacements: {
                    pRefTransId: refTransId,
                    pEntityId: entityId || null,
                    pAccessLevel: accessLevel,
                    pGencFileOwnerType: gencFileOwnerType,
                    pIsTraveler: isTraveler || 0
                }
            })
            .then((response) => {
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Retrive list of folder and document by ID
    // POST : /api/v1/generic_folder/retriveFolderListById
    // @return list of folder and document by ID
    retriveFolderListById: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const refTransId = req.body.refTransID;
            const entityId = req.body.entityId;
            const gencFileOwnerType = req.body.gencFileOwnerType;
            const refParentId = req.body.refParentId;
            const isTraveler = req.body.isTraveler;
            // const extraEntity = req.body.extraEntity;
            // const extraRefTransIds = req.body.extraRefTransIds;
            // const extraEntityIds = req.body.extraEntityIds;
            const fileGroupByIds = req.body.fileGroupByIds ? (req.body.fileGroupByIds.length > 0 ? req.body.fileGroupByIds.join(',').toString() : null) : null;
            const strEntityIds = entityId ? entityId.toString() : null;
            const strRefTransId = refTransId ? refTransId.toString() : null;
            const strGencFileOwnerType = `'${gencFileOwnerType}'`;
            const extraEntityListString = req.body.extraEntityListString || null;

            // if (extraEntityIds && extraEntityIds.length > 0) {
            //     strEntityIds = extraEntityIds.join(',').toString().concat(', ', entityId);
            // } else {
            //     strEntityIds = entityId ? entityId.toString() : null;
            // }
            // if (extraRefTransIds && extraRefTransIds.length > 0) {
            //     strRefTransId = extraRefTransIds.join(',').toString().concat(', ', refTransId);
            // } else {
            //     strRefTransId = refTransId ? refTransId.toString() : null;
            // }
            // if (extraEntity && extraEntity.length > 0) {
            //     strGencFileOwnerType = extraEntity.join(',').toString().concat(',', gencFileOwnerType);
            //     strGencFileOwnerType = `'${strGencFileOwnerType.split(',').join('\',\'')}'`;
            // } else {
            //     strGencFileOwnerType = `'${gencFileOwnerType}'`;
            // }

            return sequelize.query('CALL Sproc_GetGenericFoldersById (:pRefParentId, :pEntityId,:pRefTransId,:pGencFileOwnerType, :pIsTraveler,:pfileGroupByIds,:pExtraEntityListString,:pAccessLevel)', {
                replacements: {
                    pRefParentId: refParentId,
                    pEntityId: strEntityIds || null,
                    pRefTransId: strRefTransId,
                    pGencFileOwnerType: strGencFileOwnerType,
                    pIsTraveler: isTraveler || 0,
                    pfileGroupByIds: fileGroupByIds,
                    pExtraEntityListString: extraEntityListString || null,
                    pAccessLevel: req.body.accessLevel || null
                },
                type: sequelize.QueryTypes.SELECT
            })
                .then((response) => {
                    if (response) {
                        const fileData = {
                            totalFileCount: _.values(response[0][0]),
                            fileList: _.values(response[1])
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, fileData, null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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
    // Rename folder
    // POST : /api/v1/generic_folder/renameFolder
    // @return list of folder and document by ID
    renameFolder: (req, res) => {
        const {
            GenericFolder
        } = req.app.locals.models;
        req.body.gencFolderName = req.body.gencFolderName.trim();
        return GenericFolder.findOne({
            where: {
                gencFolderID: req.body.gencFolderID
            },
            attributes: ['gencFolderID', 'gencFileOwnerType']
        }).then(gencFolderDetails => GenericFolder.count({
            where: {
                gencFolderID: { [Op.ne]: req.body.gencFolderID },
                refParentId: req.body.refParentId,
                refTransID: req.body.refTransID,
                gencFileOwnerType: req.body.gencFileOwnerType,
                gencFolderName: req.body.gencFolderName
            }
        }).then((count) => {
            if (count === 0) {
                return GenericFolder.update(req.body, {
                    where: {
                        gencFolderID: req.body.gencFolderID
                    },
                    fields: ['gencFolderName']
                }).then((gencFolder) => {
                    if (gencFolderDetails.gencFileOwnerType && (gencFolderDetails.gencFileOwnerType === allEntity.Workorder.Name ||
                        gencFolderDetails.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                        gencFolderDetails.gencFileOwnerType === allEntity.ECORequest.Name ||
                        gencFolderDetails.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                        // [S] add log of renaming folder for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: null,
                            eventDescription: null,
                            refTransTable: GenericFolderConstObj.refTransTableName,
                            refTransID: req.body.gencFolderID,
                            eventType: null,
                            url: null,
                            eventAction: timelineEventActionConstObj.UPDATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of renaming folder for timeline users
                    }

                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, gencFolder, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.GENERIC_FOLDER_DUPLICATE_NAME, err: null, data: null });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        })).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Remove folder/file (Remove hierarchy of selected folder and file) file/folder id
    // POST : /api/v1/generic_folder/removeFileFolder
    // @param {gencFolderIDs} string with comma separated [optional]
    // @param {gencFileIDs} string with comma separated [optional]
    // @return Remove passed file/folder detail with folder hierarchy
    removeFileFolder: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var folderIds = COMMON.retriveArrayObject(req.body, 'gencFolderIDs');
        var fileIds = COMMON.retriveArrayObject(req.body, 'gencFileIDs');

        return sequelize.transaction().then((t) => {
            var fileList = [];
            var folderList = [];
            var recyclePromises = [];
            var promises = [];

            if (folderIds.length > 0 && req.body.isRecycle) {
                recyclePromises.push(GenericRecycleBinController.createRecycleBinByFolderId(req, t, folderIds).then((response) => {
                    return module.exports.removeFileFolderBySelectFolder(req, res, folderIds, t, folderList, fileList);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return { status: STATE.FAILED };
                }));
            }

            if (fileIds.length > 0 && req.body.isRecycle) {
                recyclePromises.push(GenericRecycleBinController.createRecycleBinByFileId(req, t, fileIds).then(() => {
                    return GenericRecycleBinController.recycleFileById(req, t, null, fileIds, fileList);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return { status: STATE.FAILED };
                }));
            }

            return Promise.all(recyclePromises).then((response) => {
                const resp = _.values(response[0]);
                if (_.find(resp, sts => sts.status === STATE.FAILED)) {
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
                        data: null
                    });
                } else {
                    if (fileIds.length > 0 && !req.body.isRecycle) {
                        promises.push(module.exports.removeFileById(req, t, null, fileIds, fileList));
                    }
                    if (folderIds.length > 0 && !req.body.isRecycle) {
                        promises.push(module.exports.removeFileFolderBySelectFolder(req, res, folderIds, t, folderList, fileList));
                    }
                    return Promise.all(promises).then(() => {
                        fileList.forEach((item) => {
                            if (req.body.isPermanentDelete && !item.isRecycle) {
                                fs.unlink(`.${item.genFilePath}`, () => { });
                            }
                            if (item && item.gencFileOwnerType && (item.gencFileOwnerType === allEntity.Workorder.Name ||
                                item.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                                item.gencFileOwnerType === allEntity.ECORequest.Name ||
                                item.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                                // [S] add log of delete document for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: null,
                                    eventDescription: null,
                                    refTransTable: GenericFilesConstObj.refTransTableName,
                                    refTransID: item.gencFileID,
                                    eventType: null,
                                    url: null,
                                    eventAction: timelineEventActionConstObj.DELETE
                                };
                                req.objEvent = objEvent;
                                TimelineController.createTimeline(req);
                                // [E] add log of delete document to wo op for timeline users
                            }
                        });
                        t.commit().then(() => {
                            if (Array.isArray(folderList)) {
                                folderList.forEach((item) => {
                                    req.objEvent = item;
                                    TimelineController.createTimeline(req);
                                });
                            }
                            let message = folderIds.length > 0 && fileIds.length > 0 ? 'Document(s)/Folder(s) ' :
                                (folderIds.length > 0 ? 'Folder(s)' : 'Document(s)');
                            message = COMMON.stringFormat(MESSAGE_CONSTANT.GLOBAL.FILE_FOLDER_REMOVE.message, message);
                            return resHandler.successRes(res, 200, STATE.SUCCESS, null, message);
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Remove file by passed folders and fileId (required file/folder id)
    // @param {t} transction for rollback
    // @param {folderIds} ids of folders for delete folder files
    // @param {fileIds} ids of files
    // @param {fileList} list of file
    // @return list of file for remove remove physically after complete remove from DB
    removeFileById: (req, t, folderIds, fileIds, fileList) => {
        const {
            GenericFiles
        } = req.app.locals.models;
        var whereClause = {
            deletedAt: null,
            isRecycle: false
        };
        if (Array.isArray(folderIds)) {
            whereClause.refParentId = folderIds;
        } else {
            whereClause.gencFileID = fileIds;
        }
        const promises = [];
        return GenericFiles.findAll({
            where: whereClause
        }).then((GenericFilesData) => {
            if (Array.isArray(GenericFilesData)) {
                GenericFilesData.forEach((item) => {
                    COMMON.setModelDeletedByFieldValue(req);
                    promises.push(GenericFiles.update(req.body, {
                        where: whereClause,
                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'deleteByRoleId'],
                        transaction: t
                    }).then((documentResponse) => {
                        if (Array.isArray(fileList)) {
                            fileList.push(item);
                        } else {
                            fileList = [item];
                        }
                        return Promise.resolve(documentResponse);
                    }));
                });
                return Promise.all(promises);
            } else {
                return {
                    status: STATE.FAILED
                };
            }
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED
            };
        });
    },

    // Remove Folder by passed folders ids
    // @param {t} transction for rollback
    // @param {folderIds} ids of folders for delete folder files
    // @param {folderList} ids of folder
    // @return list of file for remove physically after complete remove from DB and folder list
    removeFolderById: (req, t, folderIds, folderList, fileList) => {
        const {
            GenericFolder
        } = req.app.locals.models;
        folderIds = Array.isArray(folderIds) ? folderIds : [folderIds];
        if (folderIds) {
            const promises = [];
            promises.push(module.exports.removeFileById(req, t, folderIds, null, fileList));
            return Promise.all(promises).then(() => {
                COMMON.setModelDeletedByFieldValue(req);
                return GenericFolder.update(req.body, {
                    where: {
                        gencFolderID: folderIds
                    },
                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy'],
                    transaction: t
                }).then(() => {
                    folderIds.forEach((folder) => {
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: null,
                            eventDescription: null,
                            refTransTable: GenericFolderConstObj.refTransTableName,
                            refTransID: folder,
                            eventType: null,
                            url: null,
                            eventAction: timelineEventActionConstObj.DELETE
                        };
                        if (Array.isArray(folderList)) {
                            folderList.push(objEvent);
                        } else {
                            folderList = [objEvent];
                        }
                    });
                    return {
                        status: STATE.SUCCESS
                    };
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED
                    };
                });
            });
        } else {
            return {
                status: STATE.FAILED
            };
        }
    },
    // Remove Folder by passed folders ids it's recursive for remove folder contain folder and file
    // @param {folderIds} ids of folders for delete folder files
    // @param {t} transction for rollback
    // @param {folderList} ids of folder
    // @param {fileList} ids of fFile
    // @return list of file for remove physically after complete remove from DB and folder list
    removeFileFolderBySelectFolder: (req, res, folderIDs, t, folderList, fileList) => {
        const {
            GenericFolder
        } = req.app.locals.models;
        return GenericFolder.findAll({
            where: {
                refParentId: folderIDs,
                isRecycle: false
            }
        }).then((gencFolders) => {
            var promises = [];
            var parentFolderPromises = [];
            var childParentFolderIds = [];
            var childFolderIds = [];
            if (Array.isArray(gencFolders)) {
                childParentFolderIds = gencFolders.map(item => item.refParentId);
                childFolderIds = gencFolders.map(item => item.gencFolderID);
                let folderWithOutChildId = folderIDs.filter(item => !childParentFolderIds.toString().includes(item));
                if (folderWithOutChildId.length > 0) {
                    folderWithOutChildId = folderWithOutChildId.filter((v, i) => folderWithOutChildId.indexOf(v) === i);
                    if (req.body.isRecycle) {
                        promises.push(GenericRecycleBinController.recycleFolderById(req, t, folderWithOutChildId, folderList, fileList));
                    } else {
                        promises.push(module.exports.removeFolderById(req, t, folderWithOutChildId, folderList, fileList));
                    }
                }
                if (childFolderIds.length > 0) {
                    childFolderIds = childFolderIds.filter((v, i) => childFolderIds.indexOf(v) === i);
                    promises.push(module.exports.removeFileFolderBySelectFolder(req, res, childFolderIds, t, folderList, fileList));
                }
                return Promise.all(promises).then(() => {
                    if (childParentFolderIds.length > 0) {
                        const parentIds = childParentFolderIds.filter((v, i) => childParentFolderIds.indexOf(v) === i);
                        if (req.body.isRecycle) {
                            parentFolderPromises.push((GenericRecycleBinController.recycleFolderById(req, t, parentIds, folderList, fileList)));
                        } else {
                            parentFolderPromises.push((module.exports.removeFolderById(req, t, parentIds, folderList, fileList)));
                        }
                        return Promise.all(parentFolderPromises).then((response) => {
                            var status = STATE.FAILED;
                            if (Array.isArray(response) && response.length > 0) {
                                status = response.some(item => item.status === STATE.FAILED) ? STATE.FAILED : STATE.SUCCESS;
                            }
                            return {
                                status: status
                            };
                        });
                    } else {
                        return {
                            status: STATE.FAILED
                        };
                    }
                });
            } else if (req.body.isRecycle) {
                return GenericRecycleBinController.recycleFolderById(req, t, folderIDs, folderList).then((response) => {
                    var status = STATE.FAILED;
                    if (Array.isArray(response) && response.length > 0) {
                        status = response.some(item => item.status === STATE.FAILED) ? STATE.FAILED : STATE.SUCCESS;
                    }
                    return { status: status };
                });
            } else {
                return module.exports.removeFolderById(req, t, folderIDs, folderList).then((response) => {
                    var status = STATE.FAILED;
                    if (Array.isArray(response) && response.length > 0) {
                        status = response.some(item => item.status === STATE.FAILED) ? STATE.FAILED : STATE.SUCCESS;
                    }
                    return { status: status };
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED
            };
        });
    },

    // Retrive list of folder
    // POST : /api/v1/generic_folder/retriveFolderList
    // @return list of folder
    getFolderList: (req, res) => {
        if (req.body && req.body.refTransID && req.body.accessLevel && req.body.gencFileOwnerType) {
            const refTransId = req.body.refTransID;
            const entityId = req.body.entityID;
            const accessLevel = req.body.accessLevel;
            const gencFileOwnerType = req.body.gencFileOwnerType;
            const genericFolderIds = req.body.genericFolderIds;

            const {
                GenericFolder,
                Role
            } = req.app.locals.models;

            return Role.findAll({
                where: {
                    accessLevel: {
                        [Op.gte]: accessLevel
                    },
                    isActive: true
                },
                attributes: ['id']
            }).then((roleList) => {
                var roleIds = roleList.map(x => x.id);
                return GenericFolder.findAll({
                    where: {
                        [Op.or]: [{
                            refTransId: {
                                [Op.eq]: refTransId
                            },
                            gencFileOwnerType: gencFileOwnerType,
                            isRecycle: false,
                            entityID: {
                                [Op.eq]: entityId
                            }
                        }, {
                            refTransId: {
                                [Op.eq]: 0
                            }
                        }],
                        gencFolderID: {
                            [Op.notIn]: genericFolderIds
                        },
                        roleId: {
                            [Op.in]: roleIds
                        }
                    },
                    attributes: ['gencFolderID', 'gencFolderName', 'roleId', 'refParentId']
                }).then((generFolderList) => {
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, generFolderList, null);
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

    // Move folder
    // POST : /api/v1/generic_folder/moveFileFolder
    // @return API response
    moveFileFolder: (req, res) => {
        if (req.body.gencFileOwnerType && req.body.refTransID && req.body.parentFolderIDOfSelected && req.body.destinationGencFolderIDInMove && ((req.body.sourceGencFolderIDsToMove && req.body.sourceGencFolderIDsToMove.length > 0) || (req.body.sourceGencFileIDsToMove && req.body.sourceGencFileIDsToMove.length > 0))) {
            // if source folder and move to destination folder is same
            if (req.body.parentFolderIDOfSelected === req.body.destinationGencFolderIDInMove) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.DESTINATION_SAME_AS_SOURCE_MOVE, err: null, data: null });
            }

            const { sequelize } = req.app.locals.models;

            const allSourceGencFolderIDsToMove = req.body.sourceGencFolderIDsToMove && req.body.sourceGencFolderIDsToMove.length > 0 ? req.body.sourceGencFolderIDsToMove.toString() : null;
            const allSourceGencFileIDsToMove = req.body.sourceGencFileIDsToMove && req.body.sourceGencFileIDsToMove.length > 0 ? req.body.sourceGencFileIDsToMove.toString() : null;

            return sequelize.transaction().then(t => sequelize
                .query('CALL Sproc_MoveSourceFolderDocToDestination (:psourceGencFolderIDsToMove,:psourceGencFileIDsToMove,:pdestinationGencFolderIDInMove, :pentityID, :pgencFileOwnerType,:prefTransID,:puserID,:pparentFolderIDOfSelected,:proleIdOfDestinationGencFolder)',
                    {
                        replacements: {
                            psourceGencFolderIDsToMove: allSourceGencFolderIDsToMove,
                            psourceGencFileIDsToMove: allSourceGencFileIDsToMove,
                            pdestinationGencFolderIDInMove: req.body.destinationGencFolderIDInMove,
                            pentityID: req.body.entityID,
                            pgencFileOwnerType: req.body.gencFileOwnerType,
                            prefTransID: req.body.refTransID,
                            puserID: req.user.id,
                            pparentFolderIDOfSelected: req.body.parentFolderIDOfSelected,
                            proleIdOfDestinationGencFolder: req.body.roleId
                        },
                        transaction: t,
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((respOfMoveFolderFiles) => {
                    if (respOfMoveFolderFiles && respOfMoveFolderFiles.length > 0 && respOfMoveFolderFiles[0]
                        && _.first(_.values(respOfMoveFolderFiles[0])).ismovesuccess) {
                        const moveSourceFileFolderPromise = [];
                        let respOfSourceDeletedFolders = _.values(respOfMoveFolderFiles[1]);
                        let respOfSourceDeletedFiles = _.values(respOfMoveFolderFiles[2]);
                        const respOfDuplicateFiles = _.values(respOfMoveFolderFiles[3]);

                        if (!respOfSourceDeletedFolders || !respOfSourceDeletedFolders.length || _.first(respOfSourceDeletedFolders).deleted_source_folder === 0) {
                            respOfSourceDeletedFolders = [];
                        }
                        if (!respOfSourceDeletedFiles || !respOfSourceDeletedFiles.length || _.first(respOfSourceDeletedFiles).deleted_source_files === 0) {
                            respOfSourceDeletedFiles = [];
                        }

                        // time line log
                        if (req.body.gencFileOwnerType && (req.body.gencFileOwnerType === allEntity.Workorder.Name ||
                            req.body.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                            req.body.gencFileOwnerType === allEntity.ECORequest.Name ||
                            req.body.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                            if (allSourceGencFolderIDsToMove) {
                                // [S] add log of moving folder to other folder for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: null,
                                    eventDescription: null,
                                    refTransTable: GenericFolderConstObj.refTransTableName,
                                    refTransID: allSourceGencFolderIDsToMove,
                                    eventType: null,
                                    url: null,
                                    eventAction: timelineEventActionConstObj.MOVE_FOLDER_TO_OTHER_FOLDER
                                };
                                req.objEvent = objEvent;
                                moveSourceFileFolderPromise.push(TimelineController.createTimeline(req, res, t));
                                // [E] add log of moving folder to other folder for timeline users
                            }
                            if (allSourceGencFileIDsToMove) {
                                // [S] add log of moving document to folder for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: null,
                                    eventDescription: null,
                                    refTransTable: GenericFilesConstObj.refTransTableName,
                                    refTransID: allSourceGencFileIDsToMove,
                                    eventType: null,
                                    url: null,
                                    eventAction: timelineEventActionConstObj.MOVE_GENERICFILE_TO_FOLDER
                                };
                                req.objEvent = objEvent;
                                moveSourceFileFolderPromise.push(TimelineController.createTimeline(req, res, t));
                                // [E] add log of moving document to folder for timeline users
                            }
                        }

                        return Promise.all(moveSourceFileFolderPromise).then(() => {
                            let successMsg = COMMON.stringFormat(MESSAGE_CONSTANT.GLOBAL.FOLDER_DOC_BOTH_ACTION_SUCCESS.message, 'moved');
                            // in case of only duplicate file from what ever we selected then success message null
                            if ((
                                (!req.body.sourceGencFolderIDsToMove || req.body.sourceGencFolderIDsToMove.length === 0)
                                && req.body.sourceGencFileIDsToMove && req.body.sourceGencFileIDsToMove.length > 0
                                && (respOfDuplicateFiles && (respOfDuplicateFiles.length === req.body.sourceGencFileIDsToMove.length
                                    || respOfSourceDeletedFiles.length === req.body.sourceGencFileIDsToMove.length))
                            )
                                || (req.body.sourceGencFolderIDsToMove && req.body.sourceGencFolderIDsToMove.length > 0
                                    && respOfSourceDeletedFolders.length === req.body.sourceGencFolderIDsToMove.length)
                            ) {
                                successMsg = null;
                            }


                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                {
                                    duplicateFileList: respOfDuplicateFiles && respOfDuplicateFiles.length > 0 ? respOfDuplicateFiles : [],
                                    deletedFolderListAtSource: respOfSourceDeletedFolders,
                                    deletedFileListAtSource: respOfSourceDeletedFiles
                                }, successMsg)).catch((err) => {
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
                    } else {
                        t.rollback();
                        let errorMsg = null;
                        const respOfErrorlog = _.values(respOfMoveFolderFiles[1]);
                        if (respOfErrorlog && respOfErrorlog.length > 0) {
                            switch (_.first(respOfErrorlog).errorLogID) {
                                case 'e1001':
                                    errorMsg = MESSAGE_CONSTANT.GLOBAL.DESTINATION_IS_SUB_FOLDER_SOURCE;
                                    break;
                                default:
                                    errorMsg = MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG;
                                    break;
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                STATE.EMPTY, { messageContent: errorMsg, err: null, data: null });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }

        // if (req.body.isFolder) {
        //    return GenericFolder.update(req.body, {
        //        where: {
        //            gencFolderID: req.body.gencFolderID,
        //        },
        //        fields: ['refParentId', 'roleId'],
        //    }).then((gencFolder) => {

        //        if (req.body.gencFileOwnerType && (req.body.gencFileOwnerType == allEntity.Workorder.Name ||
        //            req.body.gencFileOwnerType == allEntity.Workorder_operation.Name ||
        //            req.body.gencFileOwnerType == allEntity.ECORequest.Name ||
        //            req.body.gencFileOwnerType == allEntity.SalesOrder.Name)) {
        //            // [S] add log of moving folder to other folder for timeline users
        //            let objEvent = {
        //                userID: req.user.id,
        //                eventTitle: null,
        //                eventDescription: null,
        //                refTransTable: GenericFolderConstObj.refTransTableName,
        //                refTransID: req.body.gencFolderID,
        //                eventType: null,
        //                url: null,
        //                eventAction: timelineEventActionConstObj.MOVE_FOLDER_TO_OTHER_FOLDER
        //            };
        //            req.objEvent = objEvent;
        //            TimelineController.createTimeline(req);
        //            // [E] add log of moving folder to other folder for timeline users
        //        }

        //        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, gencFolder, null);
        //    }).catch((err) => {
        //        console.trace();
        //        console.error(err);
        //        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        //    });
        // } else {
        //    return GenericFiles.update(req.body, {
        //        where: {
        //            gencFileID: req.body.gencFileID,
        //        },
        //        fields: ['refParentId'],
        //    }).then((gencFolder) => {

        //        if (req.body.gencFileOwnerType && (req.body.gencFileOwnerType == allEntity.Workorder.Name ||
        //            req.body.gencFileOwnerType == allEntity.Workorder_operation.Name ||
        //            req.body.gencFileOwnerType == allEntity.ECORequest.Name ||
        //            req.body.gencFileOwnerType == allEntity.SalesOrder.Name)) {
        //            // [S] add log of moving document to folder for timeline users
        //            let objEvent = {
        //                userID: req.user.id,
        //                eventTitle: null,
        //                eventDescription: null,
        //                refTransTable: GenericFilesConstObj.refTransTableName,
        //                refTransID: req.body.gencFileID,
        //                eventType: null,
        //                url: null,
        //                eventAction: timelineEventActionConstObj.MOVE_GENERICFILE_TO_FOLDER
        //            };
        //            req.objEvent = objEvent;
        //            TimelineController.createTimeline(req);
        //            // [E] add log of moving document to folder for timeline users
        //        }

        //        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, gencFolder, null);
        //    }).catch((err) => {
        //        console.trace();
        //        console.error(err);
        //        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        //    });
        // }
    },


    // move all duplicate files to destination based on confirmation
    // POST : /api/v1/workorders/moveAllDuplicateDocToDestinationBasedOnConfirmation
    // move all duplicate files
    moveAllDuplicateDocToDestinationBasedOnConfirmation: (req, res) => {
        if (req.body && req.body.duplicateFileList && req.body.duplicateFileList.length > 0 && req.body.duplicateFileMoveActionConst) {
            const { sequelize } = req.app.locals.models;
            const duplicateFileList = req.body.duplicateFileList;

            // eslint-disable-next-line no-multi-str
            return sequelize.transaction().then(t => sequelize.query('DROP TEMPORARY TABLE IF EXISTS temp_source_allDuplicateFilesToMove; \
                            CREATE TEMPORARY TABLE temp_source_allDuplicateFilesToMove(gencFileID INT, gencOriginalName VARCHAR(255), refParentId INT, \
                            refParentFolderName VARCHAR(255) , fileLevel INT, refTransIDOfDestination INT, \
                            refParentIdForDestinationNewFile INT, gencFileIDOfDestinationExistsFile INT,isRemoveRefParentFolderOfSourceFile INT); ', {
                transaction: t
            }).then(() => {
                const moveDuplicateFileTempPromises = [];
                _.each(duplicateFileList, (fileData) => {
                    moveDuplicateFileTempPromises.push(sequelize.query(`INSERT INTO temp_source_allDuplicateFilesToMove(gencFileID,gencOriginalName,refParentId, \
                               refParentFolderName,fileLevel,refTransIDOfDestination, \
                            refParentIdForDestinationNewFile, gencFileIDOfDestinationExistsFile,isRemoveRefParentFolderOfSourceFile) \
                            values("${fileData.gencFileID}", "${fileData.gencOriginalName}", "${fileData.refParentId}", \
                                "${fileData.refParentFolderName}", "${fileData.fileLevel}", "${fileData.refTransIDOfDestination}", \
                            "${fileData.refParentIdForDestinationNewFile}", "${fileData.gencFileIDOfDestinationExistsFile}", "${fileData.isRemoveRefParentFolderOfSourceFile}"); `, {
                        transaction: t
                    }));
                });

                return Promise.all(moveDuplicateFileTempPromises).then(() => {
                    sequelize
                        .query('CALL Sproc_MoveSourceDuplicateDocumentToDestination(:pduplicateFileCopyAction,:puserID)',
                            {
                                replacements: {
                                    pduplicateFileCopyAction: req.body.duplicateFileMoveActionConst,
                                    puserID: req.user.id
                                },
                                type: sequelize.QueryTypes.SELECT,
                                transaction: t
                            }).then((respOfMoveDuplicateFile) => {
                                if (!respOfMoveDuplicateFile || respOfMoveDuplicateFile.length === 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                }

                                const duplicateFileAction = DATA_CONSTANT.GENERIC_FILE.DuplicateFileCopyAction;
                                let respOfExistsFileListToMoveAtDesti = [];
                                let respOfNotExistsFileListAtSource = [];

                                if (req.body.duplicateFileMoveActionConst === duplicateFileAction.Replace_File.Value) {
                                    respOfExistsFileListToMoveAtDesti = _.values(respOfMoveDuplicateFile[0]);
                                    respOfNotExistsFileListAtSource = _.values(respOfMoveDuplicateFile[1]);
                                } else if (req.body.duplicateFileMoveActionConst === duplicateFileAction.Keep_Both_File.Value) {
                                    respOfNotExistsFileListAtSource = _.values(respOfMoveDuplicateFile[0]);
                                }

                                // if (respOfExistsFileListToMoveAtDesti && respOfExistsFileListToMoveAtDesti.length > 0) {

                                return t.commit().then(() => {
                                    if (req.body.duplicateFileMoveActionConst === duplicateFileAction.Replace_File.Value && req.body.isPermanentDelete && respOfExistsFileListToMoveAtDesti && respOfExistsFileListToMoveAtDesti.length > 0) {
                                        // delete physical duplicate source file permanently
                                        _.each(respOfExistsFileListToMoveAtDesti, (destinationFileItem) => {
                                            try {
                                                const docpath = `.${destinationFileItem.genFilePathOfDestinationExistsFile}`;
                                                fs.unlink(docpath, () => { });
                                            } catch (ex) {
                                                // console.log(ex);
                                            }
                                        });
                                    }

                                    const successMsg = COMMON.stringFormat(MESSAGE_CONSTANT.GLOBAL.FOLDER_DOC_BOTH_ACTION_SUCCESS.message, 'moved');
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                        {
                                            notExistsFileListAtSource: respOfNotExistsFileListAtSource && respOfNotExistsFileListAtSource.length > 0 ? respOfNotExistsFileListAtSource : []
                                        }, successMsg);
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                                // }
                                // else {
                                //    return t.commit().then(() => {
                                //        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                //            {
                                //                notExistsFileListAtSource: respOfNotExistsFileListAtSource && respOfNotExistsFileListAtSource.length > 0 ? respOfNotExistsFileListAtSource : []
                                //            },
                                //            successMsg);
                                //    }).catch((err) => {
                                //        console.trace();
                                //        console.error(err);
                                //        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                //            STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                //    });
                                // }
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
    }
};