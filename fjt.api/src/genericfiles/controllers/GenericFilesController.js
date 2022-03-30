const mkdirp = require('mkdirp');
const multer = require('multer');
const fsextra = require('fs-extra');
const fs = require('fs');
const _ = require('lodash');
const { Op } = require('sequelize');
const uuidv1 = require('uuid/v1');
// var path = require('path');
// var mime = require('mime');
const resHandler = require('../../resHandler');
// eslint-disable-next-line prefer-template
// eslint-disable-next-line no-undef
const resumable = require('../../../assets/resumable/resumable-node.js')(`${__basedir}/uploads/temp`);
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const archiver = require('archiver');
// const timelineObjForGenericFiles = DATA_CONSTANT.TIMLINE.EVENTS.GENERICFILES;
const GenericFilesConstObj = DATA_CONSTANT.TIMLINE.GENERICFILES;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const { stringFormat } = require('../../constant/Common');

const allEntity = COMMON.AllEntityIDS;
const inputFields = [
    'gencFileID',
    'gencFileName',
    'gencOriginalName',
    'gencFileDescription',
    'gencFileExtension',
    'gencFileType',
    'tags',
    'isDefault',
    'refTransID',
    'entityID',
    'gencFileOwnerType',
    'isDeleted',
    'isActive',
    'genFilePath',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'deletedBy',
    'updatedBy',
    'deletedAt',
    'deletedBy',
    'updatedBy',
    'isShared',
    'fileGroupBy',
    'fileSize',
    'isDisable',
    'disableOn',
    'disableBy',
    'disableReason',
    'updateByRoleId',
    'createByRoleId',
    'deleteByRoleId'
];

module.exports = {
    uploaChunkGenericFiles: (req, res) => {
        const { GenericFiles, ComponentCustomerLOA, sequelize } = req.app.locals.models;

        let genFilePath;

        // eslint-disable-next-line camelcase
        return resumable.post(req, (status, filename, original_filename, identifier) => {
            // when all chunks are uploded then status equals to "done" otherwise "partly_done"
            if (status === DATA_CONSTANT.RESUMABLE_UPLOAD_STATUS.DONE) {
                resumable.removeChunkFile(); // Delete Unwanted file which generate during and not delete due to disconnection

                const documentDetail = JSON.parse(req.body.documentDetail);

                // check for any duplicate file
                return GenericFiles.findOne({
                    where: {
                        gencOriginalName: filename,
                        refParentId: documentDetail.refParentId || null,
                        gencFileOwnerType: documentDetail.gencFileOwnerType,
                        refTransID: documentDetail.refTransID || null,
                        entityID: documentDetail.entityID || null,
                        isRecycle: false
                    },
                    attributes: ['gencOriginalName']
                }).then((existsFile) => {
                    if (existsFile) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: null,
                            err: null,
                            data: { isDuplicateDocument: true }
                        });
                    }

                    return sequelize.query('CALL Sproc_getRefTransDetailForDocument (:pGencFileOwnerType, :pRefTransID,:pIsReturnDetail)', {
                        replacements: {
                            pGencFileOwnerType: documentDetail.gencFileOwnerType || null,
                            pRefTransID: documentDetail.refTransID || null,
                            pIsReturnDetail: true
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then((response) => {
                        documentDetail.fileSize = req.body.resumableTotalSize;
                        documentDetail.mimetype = req.body.resumableType;
                        const ext = (/[.]/.exec(req.body.resumableFilename)) ? /[^.]+$/.exec(req.body.resumableFilename)[0] : null;
                        if (!documentDetail.mimetype) {
                            documentDetail.mimetype = `application/vnd.${ext}`;
                        }
                        // when all chunks uploaded, then createWriteStream to /uploads folder with filename
                        // if (documentDetail.docInsideFolderName && (documentDetail.gencFileOwnerType == COMMON.AllEntityIDS.Workorder.Name || documentDetail.gencFileOwnerType == COMMON.AllEntityIDS.Workorder_operation.Name)) {
                        //     genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${documentDetail.gencFileOwnerType}/${documentDetail.docInsideFolderName}`;
                        // }
                        // else {
                        genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${documentDetail.gencFileOwnerType}`;
                        // }

                        let folders = [''];

                        const documentCreatedDateInfo = _.first(_.values(response[0]));
                        if (documentCreatedDateInfo && documentCreatedDateInfo.isBasedOnCreatedDate === 1) {
                            genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;
                            folders = documentCreatedDateInfo.newDocumentPath.split('/');
                        }

                        _.each(folders, (folder) => {
                            genFilePath = `${genFilePath}${folder}/`;
                            if (!fs.existsSync(genFilePath)) {
                                fs.mkdirSync(genFilePath);
                            }
                        });

                        const fileName = `${uuidv1()}.${ext}`;
                        const stream = fs.createWriteStream(`${genFilePath}/${fileName}`);

                        try {
                            // stitches the file chunks back together to create the original file.
                            resumable.write(req, identifier, stream);
                            stream.on('data', () => { });
                            stream.on('end', () => {
                                // var end = ' end';
                            });

                            if (documentDetail.gencFileOwnerType !== 'textAngular') {
                                documentDetail.entityID = documentDetail.entityID === 0 ? null : documentDetail.entityID;

                                return GenericFiles.create({
                                    gencFileName: fileName,
                                    gencOriginalName: filename,
                                    gencFileDescription: documentDetail.description,
                                    gencFileExtension: ext,
                                    gencFileType: documentDetail.mimetype,
                                    isDefault: 0,
                                    refTransID: documentDetail.refTransID,
                                    entityID: documentDetail.entityID,
                                    gencFileOwnerType: documentDetail.gencFileOwnerType,
                                    isActive: 1,
                                    isShared: documentDetail.isShared,
                                    fileGroupBy: documentDetail.fileGroupBy,
                                    refParentId: documentDetail.refParentId,
                                    createdBy: req.user.id,
                                    updatedBy: req.user.id,
                                    fileSize: documentDetail.fileSize,
                                    tags: documentDetail.tags,
                                    genFilePath: `${genFilePath.replace('.', '')}${fileName}`,
                                    createByRoleId: req.user.defaultLoginRoleID,
                                    updateByRoleId: req.user.defaultLoginRoleID
                                }, {
                                    // transaction: t,
                                }).then((responseResult) => {
                                    if (documentDetail.gencFileOwnerType === COMMON.AllEntityIDS.ComponentCustomerLOA.Name) {
                                        const obj = {
                                            id: documentDetail.refTransID,
                                            isDocumentUpload: true
                                        };
                                        ComponentCustomerLOA.update(obj, {
                                            where: {
                                                id: obj.id
                                            },
                                            fields: ['isDocumentUpload']
                                        });
                                    }

                                    if (documentDetail.gencFileOwnerType && (documentDetail.gencFileOwnerType === allEntity.Workorder.Name ||
                                        documentDetail.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                                        documentDetail.gencFileOwnerType === allEntity.ECORequest.Name ||
                                        documentDetail.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                                        // [S] add log of adding document for timeline users
                                        const objEvent = {
                                            userID: req.user.id,
                                            eventTitle: null,
                                            eventDescription: null,
                                            refTransTable: GenericFilesConstObj.refTransTableName,
                                            refTransID: responseResult.gencFileID,
                                            eventType: null,
                                            url: null,
                                            eventAction: timelineEventActionConstObj.CREATE
                                        };
                                        req.objEvent = objEvent;
                                        TimelineController.createTimeline(req);
                                        // [E] add log of adding document for timeline users
                                    }
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.GLOBAL.DOCUMENT_UPLOADED);
                                }).catch((docError) => {
                                    console.trace();
                                    console.error(docError);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.DOCUMENT_NOT_UPLOAD,
                                        err: null,
                                        data: null
                                    });
                                });
                            } else {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, genFilePath + fileName, null);
                            }
                        } catch (err) {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.DOCUMENT_NOT_UPLOAD,
                                err: null,
                                data: null
                            });
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
                status = status === 'done' ? 200 : status;
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            }
        });
    },
    uploadGenericFiles: (req, res) => {
        const { GenericFiles, ComponentCustomerLOA } = req.app.locals.models;
        let documentDetail;
        let dir;
        const storage = multer.diskStorage({
            destination: (destReq, file, cb) => {
                documentDetail = JSON.parse(req.body.documentDetail);
                if (documentDetail.docInsideFolderName && (documentDetail.gencFileOwnerType === COMMON.AllEntityIDS.Workorder.Name || documentDetail.gencFileOwnerType === COMMON.AllEntityIDS.Workorder_operation.Name)) {
                    dir = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${documentDetail.gencFileOwnerType}/${documentDetail.docInsideFolderName}/`;
                } else {
                    dir = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${documentDetail.gencFileOwnerType}/`;
                }
                mkdirp(dir, err => cb(err, dir));
            },
            filename: (fileReq, file, cb) => {
                const ext = (/[.]/.exec(file.originalname)) ? /[^.]+$/.exec(file.originalname)[0] : null;
                cb(null, `${uuidv1()}.${ext}`);
            }
        });
        const upload = multer({
            storage
        }).any();

        upload(req, res, (err) => {
            const ext = (/[.]/.exec(req.files[0].originalname)) ? /[^.]+$/.exec(req.files[0].originalname)[0] : null;
            if (documentDetail.gencFileOwnerType !== 'textAngular') {
                documentDetail.entityID = documentDetail.entityID === 0 ? null : documentDetail.entityID;
                if (!err) {
                    return GenericFiles.create({
                        gencFileName: req.files[0].filename,
                        gencOriginalName: req.files[0].originalname,
                        gencFileDescription: documentDetail.description,
                        gencFileExtension: ext,
                        gencFileType: req.files[0].mimetype,
                        isDefault: 0,
                        refTransID: documentDetail.refTransID,
                        entityID: documentDetail.entityID,
                        gencFileOwnerType: documentDetail.gencFileOwnerType,
                        isActive: 1,
                        isShared: documentDetail.isShared,
                        fileGroupBy: documentDetail.fileGroupBy,
                        refParentId: documentDetail.refParentId,
                        createdBy: req.user.id,
                        updatedBy: req.user.id,
                        fileSize: documentDetail.fileSize,
                        createByRoleId: req.user.defaultLoginRoleID,
                        updateByRoleId: req.user.defaultLoginRoleID,
                        isRecycle: 0
                    }, {
                        // transaction: t,
                    }).then((response) => {
                        if (documentDetail.gencFileOwnerType === COMMON.AllEntityIDS.ComponentCustomerLOA.Name) {
                            const obj = {
                                id: documentDetail.refTransID,
                                isDocumentUpload: true
                            };
                            ComponentCustomerLOA.update(obj, {
                                where: {
                                    id: obj.id
                                },
                                fields: ['isDocumentUpload']
                            });
                        }

                        if (documentDetail.gencFileOwnerType && (documentDetail.gencFileOwnerType === allEntity.Workorder.Name ||
                            documentDetail.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                            documentDetail.gencFileOwnerType === allEntity.ECORequest.Name ||
                            documentDetail.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                            // [S] add log of adding document for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: null,
                                eventDescription: null,
                                refTransTable: GenericFilesConstObj.refTransTableName,
                                refTransID: response.gencFileID,
                                eventType: null,
                                url: null,
                                eventAction: timelineEventActionConstObj.CREATE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of adding document for timeline users
                        }

                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_UPLOADED);
                    }).catch((docError) => {
                        console.trace();
                        console.error(docError);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                    // ));
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dir + req.files[0].filename, null);
            }
        });
    },

    updateGenericFiles: (req, res) => {
        const { sequelize } = req.app.locals.models;

        let genFilePath;

        const documentDetail = JSON.parse(req.body.documentDetail);

        return sequelize.query('CALL Sproc_getRefTransDetailForDocument (:pGencFileOwnerType, :pRefTransID,:pIsReturnDetail)', {
            replacements: {
                pGencFileOwnerType: documentDetail.gencFileOwnerType || null,
                pRefTransID: documentDetail.refTransID || null,
                pIsReturnDetail: true
            },
            type: sequelize.QueryTypes.SELECT
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            // if (documentDetail.docInsideFolderName && (documentDetail.gencFileOwnerType == COMMON.AllEntityIDS.Workorder.Name || documentDetail.gencFileOwnerType == COMMON.AllEntityIDS.Workorder_operation.Name)) {
            //     genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${documentDetail.gencFileOwnerType}/${documentDetail.docInsideFolderName}/`;
            // }
            // else {
            genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${documentDetail.gencFileOwnerType}/`;
            // }

            documentDetail.entityID = documentDetail.entityID === 0 ? null : documentDetail.entityID;

            let folders = [''];

            const documentCreatedDateInfo = _.first(_.values(response[0]));
            if (documentCreatedDateInfo && documentCreatedDateInfo.isBasedOnCreatedDate === 1) {
                genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;
                folders = documentCreatedDateInfo.newDocumentPath.split('/');
            }

            _.each(folders, (folder) => {
                genFilePath = `${genFilePath}${folder}/`;
                if (!fs.existsSync(genFilePath)) {
                    fs.mkdirSync(genFilePath);
                }
            });

            // type
            if (typeof (req.files) === 'object' && typeof (req.files.file) === 'object') {
                const file = req.files.file;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                const fileName = `${uuidv1()}.${ext}`;
                const path = genFilePath + fileName;
                documentDetail.fileName = fileName;
                documentDetail.genFilePath = `${genFilePath.replace('.', '')}${fileName}`;
                fsextra.move(file.path, path, (err) => {
                    module.exports.updateFileDetail(req, res, err, documentDetail);
                });
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });

        // const storage = multer.diskStorage({
        //     destination: (destReq, file, cb) => {
        //         documentDetail = JSON.parse(req.body.documentDetail);
        //         if (documentDetail.docInsideFolderName && (documentDetail.gencFileOwnerType == COMMON.AllEntityIDS.Workorder.Name || documentDetail.gencFileOwnerType == COMMON.AllEntityIDS.Workorder_operation.Name)) {
        //             dir = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${documentDetail.gencFileOwnerType}/${documentDetail.docInsideFolderName}/`;
        //         }
        //         else {
        //             dir = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${documentDetail.gencFileOwnerType}/`;
        //         }
        //         mkdirp(dir, (err) => cb(err, dir));
        //     },
        //     filename: (fileReq, file, cb) => {
        //         const ext = (/[.]/.exec(file.originalname)) ? /[^.]+$/.exec(file.originalname)[0] : null;
        //         cb(null, `${uuidv1()}.${ext}`);
        //     },
        // });
        // const upload = multer({
        //     storage,
        // }).any();
        // upload(req, res, (err) => {
        //     documentDetail.entityID = documentDetail.entityID == 0 ? null : documentDetail.entityID;
        //     documentDetail.fileName =  req.files[0].filename;
        //     // if (!err) {
        //     module.exports.updateFileDetail(req, res, err, documentDetail);
        //     // }
        // });
    },
    // eslint-disable-next-line consistent-return
    updateFileDetail: (req, res, err, documentDetail) => {
        const { GenericFiles } = req.app.locals.models;
        if (!err) {
            if (documentDetail.gencFileID) {
                return GenericFiles.findOne({
                    where: {
                        gencFileID: documentDetail.gencFileID
                    }
                }).then((GenericFile) => {
                    let dir = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${GenericFile.gencFileOwnerType}/`;
                    if (documentDetail.docInsideFolderName && (GenericFile.gencFileOwnerType === COMMON.AllEntityIDS.Workorder.Name || GenericFile.gencFileOwnerType === COMMON.AllEntityIDS.Workorder_operation.Name)) {
                        dir = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${GenericFile.gencFileOwnerType}/${documentDetail.docInsideFolderName}/`;
                    }
                    fs.unlink(`${dir}${GenericFile.gencFileName}`, () => { });

                    const fileObj = {
                        gencFileName: documentDetail.fileName,
                        gencFileDescription: documentDetail.description,
                        // gencFileType: req.files[0].mimetype,
                        isDefault: 0,
                        refTransID: documentDetail.refTransID,
                        entityID: documentDetail.entityID,
                        gencFileOwnerType: documentDetail.gencFileOwnerType,
                        isActive: 1,
                        isShared: documentDetail.isShared,
                        fileGroupBy: documentDetail.fileGroupBy,
                        refParentId: documentDetail.refParentId,
                        createdBy: req.user.id,
                        updatedBy: req.user.id,
                        fileSize: documentDetail.fileSize,
                        tags: documentDetail.tags,
                        genFilePath: documentDetail.genFilePath,
                        updateByRoleId: req.user.defaultLoginRoleID
                    };

                    return GenericFiles.update(fileObj, {
                        where: {
                            gencFileID: documentDetail.gencFileID
                        }
                    }).then(() => {
                        fs.unlink(`${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}${GenericFiles.gencFileName}`, () => { });

                        if (documentDetail.gencFileOwnerType && (documentDetail.gencFileOwnerType === allEntity.Workorder.Name ||
                            documentDetail.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                            documentDetail.gencFileOwnerType === allEntity.ECORequest.Name ||
                            documentDetail.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                            // [S] add log of updating document for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: null,
                                eventDescription: null,
                                refTransTable: GenericFilesConstObj.refTransTableName,
                                refTransID: JSON.parse(req.body.documentDetail).gencFileID,
                                eventType: null,
                                url: null,
                                eventAction: timelineEventActionConstObj.UPDATE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of updating document for timeline users
                        }

                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.GLOBAL.DOCUMENT_UPDATED);
                    }).catch((docError) => {
                        console.trace();
                        console.error(docError);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                });
            }
        } else {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },
    retriveGenericFiles: (req, res) => {
        const GenericFiles = req.app.locals.models.GenericFiles;
        const entityName = req.params.gencFileOwnerType.split(',');
        const refTransID = req.params.refTransID.split(',');

        const objdata = [];
        _.each(entityName, (item, idx) => {
            objdata.push({ refTransID: refTransID[idx], gencFileOwnerType: item });
        });

        const promises = [];
        const list = [];
        objdata.forEach((element) => {
            promises.push(

                GenericFiles.findAll({
                    where: {
                        [Op.and]: [
                            { refTransID: element.refTransID },
                            { gencFileOwnerType: element.gencFileOwnerType },
                            { isRecycle: false },
                            {
                                gencFileName: {
                                    [Op.notlike]: 'profile%'
                                }
                            }
                        ],
                        isDeleted: false
                    }
                }).then((fileList) => {
                    list.push(fileList);
                    return Promise.resolve(fileList);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                }));
        });
        Promise.all(promises).then(() => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, list[0], null);
        });
    },

    downloadGenericFile: (req, res) => {
        const GenericFiles = req.app.locals.models.GenericFiles;
        GenericFiles.findOne({
            where: {
                gencFileID: req.body.gencFileID,
                isRecycle: false
            }
            // eslint-disable-next-line consistent-return
        }).then((document) => {
            if (!document) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
            } else {
                // let file = null;
                // if (req.body.docInsideFolderName && (document.gencFileOwnerType == COMMON.AllEntityIDS.Workorder.Name || document.gencFileOwnerType == COMMON.AllEntityIDS.Workorder_operation.Name)) {
                //     file = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_API_PATH}/${document.gencFileOwnerType}/${req.body.docInsideFolderName}/${document.gencFileName}`;
                // }
                // else {
                // file = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_API_PATH}/${document.gencFileOwnerType}/${document.gencFileName}`;
                const file = `.${document.genFilePath}`;
                // }

                // eslint-disable-next-line consistent-return
                fs.readFile(file, (err) => {
                    if (err) {
                        if (err.code === COMMON.FileErrorMessage.NotFound) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
                        } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                        }
                    } else {
                        res.setHeader('Content-disposition', `attachment; filename="${document.gencOriginalName}"`); // Keep double quotes on file name as it' generate issue for (BugID: 26323)
                        res.setHeader('Content-type', document.gencFileType);
                        const filestream = fs.createReadStream(file);
                        filestream.pipe(res);

                        if (document.gencFileOwnerType && (document.gencFileOwnerType === allEntity.Workorder.Name ||
                            document.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                            document.gencFileOwnerType === allEntity.ECORequest.Name ||
                            document.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                            if (JSON.parse(req.body.eventAction)) {
                                // [S] add log of downloading document for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: null,
                                    eventDescription: null,
                                    refTransTable: GenericFilesConstObj.refTransTableName,
                                    refTransID: document.gencFileID,
                                    eventType: null,
                                    url: null,
                                    eventAction: req.body.eventAction
                                };
                                req.objEvent = objEvent;
                                TimelineController.createTimeline(req);
                                // [E] add log of downloading document to wo op for timeline users
                            }
                        }
                    }
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Download multiple files in one zip file
    // POST : /api/v1/genericFileList/downloadGenericFileAsZip
    // @return Download multiple files in one zip file
    downloadGenericFileAsZip: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.selectedFileFolderIds) {
            const currentDate = new Date();
            const todayDate = stringFormat('{0}{1}{2}', (currentDate.getMonth() + 1).toString().padStart(2, '0'), (currentDate.getDate() + 1).toString().padStart(2, '0'), currentDate.getFullYear());
            const fileName = stringFormat('download-{0}-{1}', todayDate, currentDate.getTime());
            return sequelize.query('CALL Sproc_GetFoldersForDownloadById(:pEntity,:pRefTransId,:pSelectedFileFolderIds)', {
                replacements: {
                    pEntity: req.body.entity || null,
                    pRefTransId: req.body.refTransId || null,
                    pSelectedFileFolderIds: (req.body.selectedFileFolderIds && req.body.selectedFileFolderIds.length > 0) ? req.body.selectedFileFolderIds.join(',') : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response) {
                    const folders = _.values(response[0]);
                    let downloadFolderPath = DATA_CONSTANT.GENERIC_FILE.DOWNLOAD_ZIP_FILE_CREATE_API_PATH;
                    if (!fs.existsSync(downloadFolderPath)) {
                        fs.mkdirSync(downloadFolderPath);
                    }
                    downloadFolderPath = `${downloadFolderPath}${fileName}/`;
                    if (!fs.existsSync(downloadFolderPath)) {
                        fs.mkdirSync(downloadFolderPath);
                    }
                    const promisesCreateFile = [];
                    // create files
                    promisesCreateFile.push(module.exports.createFileToDownloadAsZip(req, res, req.body.selectedFileFolderIds, null, downloadFolderPath));
                    // create folders structure for selected folders to download
                    if (folders.length > 0) {
                        _.each(folders, (folder) => {
                            var folderPath = `${downloadFolderPath}${folder.folderPath}/`;
                            if (!fs.existsSync(folderPath)) {
                                fs.mkdirSync(folderPath);
                            }
                            // create files
                            promisesCreateFile.push(module.exports.createFileToDownloadAsZip(req, res, null, folder.gencFolderID, folderPath));
                        });
                    }
                    // create files promise
                    // eslint-disable-next-line consistent-return
                    return Promise.all(promisesCreateFile).then((responseCreateFiles) => {
                        var resObj = _.find(responseCreateFiles, responseCreateFile => responseCreateFile.status === STATE.FAILED);
                        if (resObj) {
                            if (resObj.message) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: resObj.message, err: null, data: null });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
                            }
                        } else {
                            try {
                                const sourceFile = downloadFolderPath;
                                const desinationFile = `${DATA_CONSTANT.GENERIC_FILE.DOWNLOAD_ZIP_FILE_CREATE_API_PATH + fileName}.zip`;
                                const output = fs.createWriteStream(desinationFile);
                                const archive = archiver('zip', { forceLocalTime: true });
                                output.on('close', () => {
                                    // eslint-disable-next-line consistent-return
                                    fs.readFile(desinationFile, (err) => {
                                        if (err) {
                                            if (err.code === COMMON.FileErrorMessage.NotFound) {
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
                                            } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                                            }
                                        } else {
                                            res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
                                            res.setHeader('Content-type', fileName);
                                            const filestream = fs.createReadStream(desinationFile);
                                            filestream.pipe(res);
                                            //= =>>delete generated files from server after download
                                            fs.unlink(desinationFile, () => { });
                                            let dirToRemove = sourceFile;
                                            if (sourceFile.endsWith('/')) {
                                                dirToRemove = sourceFile.substr(0, (sourceFile.length - 1));
                                            }
                                            module.exports.removeFolder(dirToRemove);
                                            // <<==delete generated files from server after download
                                        }
                                    });
                                });
                                archive.on('error', (err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                                archive.pipe(output);
                                // append files from a sub-directory and naming it `new-subdir` within the archive (see docs for more options):
                                // archive.directory(sourceFile, false);
                                archive.directory(sourceFile, '', (fileData) => {
                                    if (archive.options.forceLocalTime) {
                                        const fileDateCreate = (fileTime) => { fileTime.setTime(fileTime.getTime - (fileTime.getTimezoneOffset() * 60000)); };
                                        fileDateCreate(fileData.stats.mtime);
                                    }
                                    return fileData;
                                });
                                // archive.finalize();
                                // eslint-disable-next-line consistent-return
                                archive.finalize((err) => {
                                    if (err) {
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    }
                                });
                            } catch (err) {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            }
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
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
    // to be call from API promise only
    createFileToDownloadAsZip: (req, res, fileIDs, folderId, destinationFolder) => {
        const { GenericFiles } = req.app.locals.models;
        var where = { isDisable: false };
        if (fileIDs) {
            where.gencFileID = {
                [Op.in]: fileIDs
            };
        }
        if (folderId) {
            where.refParentId = folderId;
        }
        where.refTransID = req.body.refTransId;
        where.gencFileOwnerType = req.body.entity;
        where.isRecycle = false;
        return GenericFiles.findAll({
            where: where,
            attributes: ['gencFileID', 'gencFileName', 'gencOriginalName', 'genFilePath', 'refParentId']
        }).then((filesList) => {
            if (filesList) {
                const promisesCopyFile = [];
                _.each(filesList, (fileObj) => {
                    var destinationFilePath = destinationFolder + fileObj.gencOriginalName;
                    var sourceFile = `.${fileObj.genFilePath}`;
                    // create files
                    promisesCopyFile.push(module.exports.copyFileToDownloadAsZip(req, res, sourceFile, destinationFilePath));
                });
                // copy files promise
                return Promise.all(promisesCopyFile).then((responseCopyFile) => {
                    var resObj = _.find(responseCopyFile, responseCopy => responseCopy.status === STATE.FAILED);
                    if (resObj) {
                        return resObj;
                    } else {
                        return {
                            status: STATE.SUCCESS
                        };
                    }
                });
            } else {
                return {
                    status: STATE.FAILED
                };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
            };
        });
    },
    // to be call from API promise only
    // creating copy of files to download
    copyFileToDownloadAsZip: (req, res, sourceFile, destinationFilePath) => {
        if (sourceFile != null && destinationFilePath != null) {
            return fsextra.copy(sourceFile, destinationFilePath)
                .then(() => ({
                    status: STATE.SUCCESS
                }))
                .catch(() => ({
                    status: STATE.FAILED
                }));
        } else {
            return {
                status: STATE.FAILED
            };
        }
    },
    removeFolder: (path) => {
        if (fs.existsSync(path)) {
            const files = fs.readdirSync(path);
            if (files.length > 0) {
                files.forEach((filename) => {
                    if (fs.statSync(`${path}/${filename}`).isDirectory()) {
                        module.exports.removeFolder(`${path}/${filename}`);
                    } else {
                        fs.unlinkSync(`${path}/${filename}`);
                    }
                });
                fs.rmdirSync(path);
            } else {
                fs.rmdirSync(path);
            }
        } else {
            // console.log('Directory path not found.');
        }
    },

    setAsShared: (req, res) => {
        const { GenericFiles, sequelize } = req.app.locals.models;
        if (req.params.gencFileID) {
            return sequelize.transaction(t => (
                GenericFiles.update({
                    isShared: true,
                    updatedBy: req.user.id,
                    updateByRoleId: req.user.defaultLoginRoleID
                }, {
                    where: {
                        gencFileID: req.params.gencFileID
                    }
                }, { transaction: t })
            )).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.GENERIC_FILE.IMAGE_SET_AS_SHARED))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        }
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
    },

    addTimelineLogForViewGenericFileOtherThanImage: (req, res) => {
        const GenericFiles = req.app.locals.models.GenericFiles;
        GenericFiles.findOne({
            where: {
                gencFileID: req.params.gencFileID
            }
            // eslint-disable-next-line consistent-return
        }).then((document) => {
            if (!document) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
            } else if (document.gencFileOwnerType && (document.gencFileOwnerType === allEntity.Workorder.Name ||
                document.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                document.gencFileOwnerType === allEntity.ECORequest.Name ||
                document.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                if (JSON.parse(req.params.eventAction)) {
                    // [S] add log of view document other than image for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: null,
                        eventDescription: null,
                        refTransTable: GenericFilesConstObj.refTransTableName,
                        refTransID: document.gencFileID,
                        eventType: null,
                        url: null,
                        eventAction: req.params.eventAction
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log of view document other than image for timeline users
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    /* to disable generic file - document */
    enableDisableGenericFile: (req, res) => {
        const { GenericFiles } = req.app.locals.models;
        if (req.body.enableDisableDocDet.gencFileID) {
            return GenericFiles.findOne({
                where: {
                    gencFileID: req.body.enableDisableDocDet.gencFileID
                }
            }).then((genericFileData) => {
                if (!genericFileData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
                }


                const disableDocObj = {
                    isDisable: req.body.enableDisableDocDet.oldValueOfIsDisable ? false : true,
                    disableOn: COMMON.getCurrentUTC(),
                    disableBy: req.user.id,
                    updatedAt: COMMON.getCurrentUTC(),
                    updatedBy: req.user.id,
                    updateByRoleId: req.user.defaultLoginRoleID
                    // disableReason: req.body.enableDisableDocDet.disableReason
                };
                return GenericFiles.update(disableDocObj, {
                    where: {
                        gencFileID: req.body.enableDisableDocDet.gencFileID,
                        deletedAt: null
                    },
                    fields: inputFields
                }).then(() => {
                    if (genericFileData && genericFileData.gencFileOwnerType && (genericFileData.gencFileOwnerType === allEntity.Workorder.Name ||
                        genericFileData.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                        genericFileData.gencFileOwnerType === allEntity.ECORequest.Name ||
                        genericFileData.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                        // [S] add log of disable document for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: null,
                            eventDescription: null,
                            refTransTable: GenericFilesConstObj.refTransTableName,
                            refTransID: genericFileData.gencFileID,
                            eventType: null,
                            url: null,
                            eventAction: req.body.enableDisableDocDet.oldValueOfIsDisable ? timelineEventActionConstObj.GENERICFILE_ENABLE : timelineEventActionConstObj.GENERICFILE_DISABLE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of disable document to wo op for timeline users
                    }
                    const enableDisableAction = req.body.enableDisableDocDet.oldValueOfIsDisable ? 'enabled' : 'disabled';
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, COMMON.stringFormat(MESSAGE_CONSTANT.GLOBAL.DOCUMENT_COMMON_ACTION.message, enableDisableAction));
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
    },

    // to update doc extra info like description,doc type, etc
    updateGenericFileDetails: (req, res) => {
        if (req.body.documentDetail.gencFileID) {
            const { GenericFiles } = req.app.locals.models;

            return GenericFiles.findOne({
                where: {
                    gencFileID: req.body.documentDetail.gencFileID
                }
            }).then(() => {
                COMMON.setModelUpdatedByArrayFieldValue(req.body.documentDetail);
                const fileObj = {
                    gencFileDescription: req.body.documentDetail.description,
                    fileGroupBy: req.body.documentDetail.fileGroupBy,
                    tags: req.body.documentDetail.tags
                };

                return GenericFiles.update(fileObj, {
                    where: {
                        gencFileID: req.body.documentDetail.gencFileID
                    },
                    fields: ['tags', 'gencFileDescription', 'fileGroupBy', 'updatedBy', 'updatedAt', 'updateByRoleId']
                }).then(() => {
                    if (req.body.documentDetail.gencFileOwnerType && (req.body.documentDetail.gencFileOwnerType === allEntity.Workorder.Name ||
                        req.body.documentDetail.gencFileOwnerType === allEntity.Workorder_operation.Name ||
                        req.body.documentDetail.gencFileOwnerType === allEntity.ECORequest.Name ||
                        req.body.documentDetail.gencFileOwnerType === allEntity.SalesOrder.Name)) {
                        // [S] add log of updating document for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: null,
                            eventDescription: null,
                            refTransTable: GenericFilesConstObj.refTransTableName,
                            refTransID: req.body.documentDetail.gencFileID,
                            eventType: null,
                            url: null,
                            eventAction: timelineEventActionConstObj.UPDATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of updating document for timeline users
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.GLOBAL.DOCUMENT_UPDATED);
                }).catch((docError) => {
                    console.trace();
                    console.error(docError);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },

    // This method will call prom other APIs to manage document directory based on old path and new path
    // data: It contains gencFileOwnerType and refTransID
    manageDocumentPath: (req, res, data, t) => {
        const { sequelize } = req.app.locals.models;
        if (data && data.gencFileOwnerType && data.refTransID) {
            // Get old path and new path based on passed transaction detail
            return sequelize.query('CALL Sproc_getRefTransDetailForDocument (:pGencFileOwnerType, :pRefTransID,:pIsReturnDetail)', {
                replacements: {
                    pGencFileOwnerType: data.gencFileOwnerType || null,
                    pRefTransID: data.refTransID || null,
                    pIsReturnDetail: true
                },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            }).then((response) => {
                const documentCreatedDateInfo = _.first(_.values(response[0]));
                // If old path and new path are diffrent and transaction have to set based on created date then perform further action
                if (documentCreatedDateInfo && documentCreatedDateInfo.isBasedOnCreatedDate === 1 && documentCreatedDateInfo.oldDocumentPath !== documentCreatedDateInfo.newDocumentPath) {
                    // If document directory found for old record then only create new directive
                    let oldPath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${documentCreatedDateInfo.oldDocumentPath}/`;
                    if (fs.existsSync(oldPath)) {
                        let newFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${documentCreatedDateInfo.newDocumentPath}/`;
                        // If directory for new path is not exists the create directories
                        if (!fs.existsSync(newFilePath)) {
                            const folders = documentCreatedDateInfo.newDocumentPath.split('/');
                            let genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;
                            _.each(folders, (folder) => {
                                genFilePath = `${genFilePath}${folder}/`;
                                if (!fs.existsSync(genFilePath)) {
                                    fs.mkdirSync(genFilePath);
                                }
                            });
                        }

                        return fsextra.move(oldPath, newFilePath).then(() => {
                            oldPath = oldPath.replace(`/${data.refTransID}/`, '');
                            const dirItemList = fs.readdirSync(oldPath);
                            if (dirItemList.length === 0) {
                                fsextra.removeSync(oldPath);
                            }
                            newFilePath = newFilePath.replace('.', '');
                            oldPath = `${oldPath}/${data.refTransID}`.replace('.', '');
                            // Update old records in DB for new path
                            return sequelize.query(`update genericfiles set genFilePath = replace(genFilePath,'${oldPath}','${newFilePath}') where genFilePath like '%${oldPath}%';`, {
                                transaction: t
                            });
                        }).catch((err) => {
                            console.error(err);
                        });
                    } else {
                        return response;
                    }
                } else {
                    return response;
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // to check duplicate document files exists or not
    checkDuplicateGenericFiles: (req, res) => {
        if (req.body.uploadFileObj && req.body.uploadFileObj.filenames &&
            req.body.uploadFileObj.gencFileOwnerType && req.body.uploadFileObj.refTransID) {
            const { GenericFiles } = req.app.locals.models;
            return GenericFiles.findAll({
                where: {
                    gencOriginalName: req.body.uploadFileObj.filenames,
                    refParentId: req.body.uploadFileObj.refParentId || null,
                    gencFileOwnerType: req.body.uploadFileObj.gencFileOwnerType,
                    refTransID: req.body.uploadFileObj.refTransID,
                    entityID: req.body.uploadFileObj.entityID || null,
                    isRecycle: false
                },
                attributes: ['gencOriginalName']
            }).then((existsFileList) => {
                if (existsFileList && existsFileList.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: null,
                        err: null,
                        data: { isDuplicateDocument: true, duplicateFileList: existsFileList }
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateDocument: false }, null);
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
    // Get list sample pictures
    // GET: /api/v1/genericFileList
    // @param {gencFileOwnerType (varchar) , refTransId (int) , entityId (int)}
    // @return List of files
    getSamplePictureList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const gencFileOwnerType = req.params.gencFileOwnerType;
        const refTransID = req.params.refTransID;
        const entityId = req.params.entityId;

        return sequelize.query('CALL Sproc_GetSamplePictureList ( :pRefTransID, :pEntityId, :pGencFileOwnerType)', {
            replacements: {
                pGencFileOwnerType: gencFileOwnerType || null,
                pRefTransID: refTransID || null,
                pEntityId: entityId
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response[0], null)).catch((err) => {
            console.trace();
            console.error();
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }


};