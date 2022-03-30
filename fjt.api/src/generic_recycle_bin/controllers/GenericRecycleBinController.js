const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const GenericFolderConstObj = DATA_CONSTANT.TIMLINE.GENERIC_FOLDER;
const GenericFilesConstObj = DATA_CONSTANT.TIMLINE.GENERICFILES;

const mstinputFields = [
    'id',
    'name',
    'refTransID',
    'entityID',
    'gencFileOwnerType',
    'reftablename',
    'refId',
    'parentID',
    'isDeleted',
    'recycledBy',
    'restoredBy',
    'deletedBy',
    'restoredByRoleId',
    'deleteByRoleId',
    'recycledByRoleId',
    'originalLocation',
    'roleId'
];
const detailsinputFields = [
    'id',
    'name',
    'refTransID',
    'entityID',
    'gencFileOwnerType',
    'reftablename',
    'refId',
    'parentID',
    'isDeleted',
    'recycledBy',
    'restoredBy',
    'deletedBy',
    'restoredByRoleId',
    'deleteByRoleId',
    'recycledByRoleId',
    'refRecycleBinID',
    'roleId'
];

module.exports = {
    // get ParentID of Recycle bin based on RoleID
    // POST : /api/v1/generic_recycle_bin/getGoToRootFolderID
    // @return ParentID of Recycle bin based on RoleID
    getGoToRootFolderID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetBackToRootFolderID (:pRoleId)', {
            replacements: {
                pRoleId: req.body.roleId
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { data: _.values(response[0])[0] }, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // get list of Recycle bin based on TransID
    // POST : /api/v1/generic_recycle_bin/getRecycleBinListByRefTransID
    // @return list of Recycle bin based on TransID
    getRecycleBinListByRefTransID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetRecycleBinListByRefTransID (:pRefTransID,:pGencFileOwnerType,:pRoleId)', {
            replacements: {
                pRefTransID: req.body.refTransID,
                pGencFileOwnerType: req.body.gencFileOwnerType,
                pRoleId: req.body.roleId
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { RecycleBinList: _.values(response[0]) }, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // delete recyclebin transaction
    // POST : /api/v1/generic_recycle_bin/deleteGenericRecycleBinDetails
    // @return list of Recycle bin based on TransID
    deleteGenericRecycleBinDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.transaction().then(t => {
            sequelize.query('CALL Sproc_deleteGenericRecycleBinDetails (:IDs,:pRoleID,:pUserID)', {
                replacements: {
                    IDs: req.body.IDs.toString(),
                    pRoleID: COMMON.getRequestUserLoginRoleID(req),
                    pUserID: COMMON.getRequestUserID(req)
                },
                transaction: t
            }).then(() => {
                t.commit().then(() => {
                    let message = req.body.label;
                    message = COMMON.stringFormat(MESSAGE_CONSTANT.GLOBAL.FILE_FOLDER_REMOVE.message, message);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, message);
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // restore data based on Id and refId
    // POST : /api/v1/generic_recycle_bin/restoreGenericRecycleBin
    // @return list of Recycle bin based on refId and id
    restoreGenericRecycleBin: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.transaction().then(t => {
            sequelize.query('CALL Sproc_restoreGenericRecycleBinDetails (:pRefId,:pName,:pRoleID,:pUserID,:pId,:pGenRecycleLocation)', {
                replacements: {
                    pRefId: req.body.refId,
                    pName: req.body.name,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req),
                    pUserID: COMMON.getRequestUserID(req),
                    pId: req.body.id,
                    pGenRecycleLocation: req.body.originalLocation
                },
                transaction: t
            }).then(() => {
                t.commit().then(() => {
                    let message = req.body.isFolder ? 'Folder' : 'Document';
                    message = COMMON.stringFormat(MESSAGE_CONSTANT.GLOBAL.FILE_FOLDER_RESTORE.message, message);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, message);
                });
            }).catch((err) => {
                console.trace();
                if (!t.finished) {
                    t.rollback();
                }
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Recycle file by passed folders and fileId (required file/folder id)
    // @param {t} transction for rollback
    // @param {folderIds} ids of folders for delete folder files
    // @param {fileIds} ids of files
    // @return API response
    recycleFileById: (req, t, folderIds, fileIds) => {
        const {
            GenericFiles
        } = req.app.locals.models;
        var whereClause = {
            deletedAt: null
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
                GenericFilesData.forEach(() => {
                    promises.push(GenericFiles.update(req.body, {
                        where: whereClause,
                        fields: ['isRecycle'],
                        transaction: t
                    }).then(documentResponse => Promise.resolve(documentResponse)
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return { status: STATE.FAILED };
                    }));
                });
                return Promise.all(promises);
            } else {
                return { status: STATE.FAILED };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) {
                t.rollback();
            }
            return { status: STATE.FAILED };
        });
    },

    // Recycle Folder by passed folders ids
    // @param {t} transction for rollback
    // @param {folderIds} ids of folders for delete folder files
    // @param {fileList} ids of folder
    // @return of API response
    recycleFolderById: (req, t, folderIds, folderList, fileList) => {
        const {
            GenericFolder
        } = req.app.locals.models;
        folderIds = Array.isArray(folderIds) ? folderIds : [folderIds];
        if (folderIds) {
            const promises = [];
            promises.push(module.exports.recycleFileById(req, t, folderIds, null, fileList));
            return Promise.all(promises).then(() => {
                return GenericFolder.update(req.body, {
                    where: {
                        gencFolderID: folderIds
                    },
                    fields: ['isRecycle'],
                    transaction: t
                }).then(() => ({
                    status: STATE.SUCCESS
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return { status: STATE.FAILED };
                });
            });
        } else {
            return { status: STATE.FAILED };
        }
    },

    // Create Recycle Bin Folder by passed folders ids
    // @param {t} transction for rollback
    // @param {fileIds} ids of files
    // @return API responsee
    createRecycleBinByFileId: (req, t, fileIds) => {
        const { GenericFiles, GenericRecycleBin, GenericRecycleBinTrans, sequelize } = req.app.locals.models;
        fileIds = Array.isArray(fileIds) ? fileIds : [fileIds];
        const whereClause = {
            deletedAt: null,
            isRecycle: false,
            isDeleted: false,
            gencFileID: fileIds
        };
        return GenericFiles.findAll({
            where: whereClause
        }).then((GenericFilesData) => {
            var promises = [];
            if (Array.isArray(GenericFilesData)) {
                GenericFilesData.forEach((item) => {
                    promises.push(sequelize.query('CALL Sproc_getGenericFolderLocation (:pRefId)', {
                        replacements: {
                            pRefId: item.refParentId
                        },
                        type: sequelize.QueryTypes.SELECT,
                        transaction: t
                    }).then((response) => {
                        const originalPath = _.values(response[0])[0].folderPath;
                        const genFilePath = originalPath ? `${originalPath}/${item.gencOriginalName}` : `${item.gencOriginalName}`;
                        const recycleBinData = {
                            recycledByRoleId: req.user.defaultLoginRoleID,
                            recycledOn: COMMON.getCurrentUTC(),
                            recycledBy: req.user.id,
                            gencFileOwnerType: item.gencFileOwnerType,
                            name: item.gencOriginalName,
                            refTransID: item.refTransID,
                            entityID: item.entityID,
                            reftablename: GenericFilesConstObj.refTransTableName,
                            refId: item.gencFileID,
                            parentID: item.refParentId || null,
                            originalLocation: genFilePath,
                            roleId: req.body.roleId
                        };
                        return GenericRecycleBin.create(recycleBinData, {
                            fields: mstinputFields,
                            transaction: t
                        }).then((GenericRecycleBinData) => {
                            if (GenericRecycleBinData) {
                                const recycleBinTransData = {
                                    recycledByRoleId: req.user.defaultLoginRoleID,
                                    recycledOn: COMMON.getCurrentUTC(),
                                    recycledBy: req.user.id,
                                    gencFileOwnerType: GenericRecycleBinData.gencFileOwnerType,
                                    name: GenericRecycleBinData.name,
                                    refTransID: GenericRecycleBinData.refTransID,
                                    entityID: GenericRecycleBinData.entityID,
                                    reftablename: GenericRecycleBinData.reftablename,
                                    refId: GenericRecycleBinData.refId,
                                    parentID: GenericRecycleBinData.parentID || null,
                                    refRecycleBinID: GenericRecycleBinData.id,
                                    roleId: GenericRecycleBinData.roleId || req.body.roleId
                                };
                                return promises.push(GenericRecycleBinTrans.create(recycleBinTransData, {
                                    fields: detailsinputFields,
                                    transaction: t
                                }).then(GenericRecycleBinTransData => Promise.resolve(GenericRecycleBinTransData)).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return { status: STATE.FAILED };
                                }));
                            } else {
                                return { status: STATE.FAILED };
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return { status: STATE.FAILED };
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return { status: STATE.FAILED };
                    }));
                });
                return Promise.all(promises);
            } else {
                return { status: STATE.FAILED };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) {
                t.rollback();
            }
            return { status: STATE.FAILED };
        });
    },

    // Recycle Folder by passed folders ids
    // @param {t} transction for rollback
    // @param {folderIds} ids of folders for delete folder files
    // @return list of file for remove physically after complete remove from DB and folder list
    createRecycleBinByFolderId: (req, t, folderIds) => {
        const { GenericFolder, GenericRecycleBin, sequelize } = req.app.locals.models;
        folderIds = Array.isArray(folderIds) ? folderIds : [folderIds];
        const whereClause = {
            deletedAt: null,
            isRecycle: false,
            isDeleted: false,
            gencFolderID: folderIds
        };
        return GenericFolder.findAll({
            where: whereClause
        }).then((GenericFolderData) => {
            var promises = [];
            if (Array.isArray(GenericFolderData)) {
                GenericFolderData.forEach((item) => {
                    promises.push(sequelize.query('CALL Sproc_getGenericFolderLocation (:pRefId)', {
                        replacements: {
                            pRefId: item.gencFolderID
                        },
                        type: sequelize.QueryTypes.SELECT,
                        transaction: t
                    }).then((response) => {
                        const originalPath = _.values(response[0])[0].folderPath;
                        const recycleBinData = {
                            recycledByRoleId: req.user.defaultLoginRoleID,
                            recycledOn: COMMON.getCurrentUTC(),
                            recycledBy: req.user.id,
                            gencFileOwnerType: item.gencFileOwnerType,
                            name: item.gencFolderName,
                            refTransID: item.refTransID,
                            entityID: item.entityID,
                            reftablename: GenericFolderConstObj.refTransTableName,
                            refId: item.gencFolderID,
                            parentID: item.refParentId || null,
                            originalLocation: originalPath,
                            roleId: item.roleId || req.body.roleId
                        };
                        return GenericRecycleBin.create(recycleBinData, {
                            fields: mstinputFields,
                            transaction: t
                        }).then((GenericRecycleBinData) => {
                            if (GenericRecycleBinData) {
                                return promises.push(module.exports.recycleFileFolderBySelectFolder(req, t, item.gencFolderID, GenericRecycleBinData));
                            } else {
                                return { status: STATE.FAILED };
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return { status: STATE.FAILED };
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return { status: STATE.FAILED };
                    }));
                });
                return Promise.all(promises);
            } else {
                return { status: STATE.FAILED };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) {
                t.rollback();
            }
            return { status: STATE.FAILED };
        });
    },

    // Create Recycle Bin Folder by passed fileIds ids
    // @param {t} transction for rollback
    // @return API response
    createRecycleBinTransFileByFolderId: (req, t, folderIds, recycleBinDetails) => {
        const { GenericFiles, GenericRecycleBinTrans } = req.app.locals.models;
        folderIds = Array.isArray(folderIds) ? folderIds : [folderIds];
        const whereClause = {
            deletedAt: null,
            isRecycle: false,
            isDeleted: false,
            refParentId: folderIds
        };
        return GenericFiles.findAll({
            where: whereClause
        }).then((GenericFilesData) => {
            var promises = [];
            if (Array.isArray(GenericFilesData)) {
                GenericFilesData.forEach((item) => {
                    const recycleBinData = {
                        recycledByRoleId: req.user.defaultLoginRoleID,
                        recycledOn: COMMON.getCurrentUTC(),
                        recycledBy: req.user.id,
                        gencFileOwnerType: item.gencFileOwnerType,
                        name: item.gencOriginalName,
                        refTransID: item.refTransID,
                        entityID: item.entityID,
                        reftablename: GenericFilesConstObj.refTransTableName,
                        refId: item.gencFileID,
                        parentID: item.refParentId || null,
                        refRecycleBinID: recycleBinDetails.id,
                        roleId: req.body.roleId
                    };
                    promises.push(GenericRecycleBinTrans.create(recycleBinData, {
                        fields: detailsinputFields,
                        transaction: t
                    }).then(GenericRecycleBinTransData => Promise.resolve(GenericRecycleBinTransData)).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return { status: STATE.FAILED };
                    }));
                });
                return Promise.all(promises);
            } else {
                return { status: STATE.FAILED };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) {
                t.rollback();
            }
            return { status: STATE.FAILED };
        });
    },

    // Recycle Folder by passed folders ids
    // @param {t} transction for rollback
    // @param {folderIds} ids of folders for delete folder files
    // @return list of file for remove physically after complete remove from DB and folder list
    createRecycleBinTransFolderByFolderId: (req, t, folderIds, recycleBinDetails) => {
        const { GenericFolder, GenericRecycleBinTrans } = req.app.locals.models;
        folderIds = Array.isArray(folderIds) ? folderIds : [folderIds];
        const whereClause = {
            deletedAt: null,
            isRecycle: false,
            isDeleted: false,
            gencFolderID: folderIds
        };
        return GenericFolder.findAll({
            where: whereClause
        }).then((genericFolderData) => {
            var promises = [];
            if (Array.isArray(genericFolderData)) {
                genericFolderData.forEach((item) => {
                    promises.push(module.exports.createRecycleBinTransFileByFolderId(req, t, item.gencFolderID, recycleBinDetails));
                    return Promise.all(promises).then(() => {
                        const recycleBinTransData = {
                            recycledByRoleId: req.user.defaultLoginRoleID,
                            recycledOn: COMMON.getCurrentUTC(),
                            recycledBy: req.user.id,
                            gencFileOwnerType: item.gencFileOwnerType,
                            name: item.gencFolderName,
                            refTransID: item.refTransID,
                            entityID: item.entityID,
                            reftablename: GenericFolderConstObj.refTransTableName,
                            refId: item.gencFolderID,
                            parentID: item.refParentId || null,
                            refRecycleBinID: recycleBinDetails.id,
                            roleId: item.roleId || req.body.roleId
                        };
                        GenericRecycleBinTrans.create(recycleBinTransData, {
                            fields: detailsinputFields,
                            transaction: t
                        }).then(() => ({
                            status: STATE.SUCCESS
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return { status: STATE.FAILED };
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return { status: STATE.FAILED };
                    });
                });
            } else {
                return { status: STATE.FAILED };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) {
                t.rollback();
            }
            return { status: STATE.FAILED };
        });
    },

    // Recycle Folder by passed folders ids
    // @param {t} transction for rollback
    // @param {folderIds} ids of folders for delete folder files
    // @return list of file for remove physically after complete remove from DB and folder list
    recycleFileFolderBySelectFolder: (req, t, folderIds, recycleBinDetails) => {
        const { GenericFolder } = req.app.locals.models;
        folderIds = Array.isArray(folderIds) ? folderIds : [folderIds];
        const whereClause = {
            deletedAt: null,
            isRecycle: false,
            isDeleted: false,
            refParentId: folderIds
        };
        return GenericFolder.findAll({
            where: whereClause
        }).then((gencFolders) => {
            var promises = [];
            var parentFolderPromises = [];
            var childParentFolderIds = [];
            var childFolderIds = [];
            if (Array.isArray(gencFolders)) {
                childParentFolderIds = gencFolders.map(item => item.refParentId);
                childFolderIds = gencFolders.map(item => item.gencFolderID);
                let folderWithOutChildId = folderIds.filter(item => !childParentFolderIds.toString().includes(item));
                if (folderWithOutChildId.length > 0) {
                    folderWithOutChildId = folderWithOutChildId.filter((v, i) => folderWithOutChildId.indexOf(v) === i);
                    promises.push(module.exports.createRecycleBinTransFolderByFolderId(req, t, folderWithOutChildId, recycleBinDetails));
                }
                if (childFolderIds.length > 0) {
                    childFolderIds = childFolderIds.filter((v, i) => childFolderIds.indexOf(v) === i);
                    promises.push(module.exports.recycleFileFolderBySelectFolder(req, t, childFolderIds, recycleBinDetails));
                }
                return Promise.all(promises).then(() => {
                    if (childParentFolderIds.length > 0) {
                        const parentIds = childParentFolderIds.filter((v, i) => childParentFolderIds.indexOf(v) === i);
                        promises.push(module.exports.createRecycleBinTransFolderByFolderId(req, t, parentIds, recycleBinDetails));
                        return Promise.all(parentFolderPromises).then((response) => {
                            var status = STATE.FAILED;
                            if (Array.isArray(response) && response.length > 0) {
                                status = response.some(item => item.status === STATE.FAILED) ? STATE.FAILED : STATE.SUCCESS;
                            }
                            return {
                                status: status
                            };
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return { status: STATE.FAILED };
                        });
                    } else {
                        return { status: STATE.FAILED };
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return { status: STATE.FAILED };
                });
            } else {
                return { status: STATE.FAILED };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) {
                t.rollback();
            }
            return { status: STATE.FAILED };
        });
    }
};