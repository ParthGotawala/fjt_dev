const uuidv1 = require('uuid/v1');
const fs = require('fs');
const fsextra = require('fs-extra');
const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { Op } = require('sequelize');

const currentModuleName = DATA_CONSTANT.EQUIPMENT_TOOLS.NAME;
const enterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const inputFields = [
    'eqpID',
    'assetName',
    'eqpMake',
    'eqpModel',
    'eqpYear',
    'eqpDescription',
    'assetNumber',
    'eqpGroupID',
    'eqpSubGroupID',
    'eqpTypeID',
    'eqpOwnershipTypeID',
    'bankName',
    'customerId',
    'placedInServiceDate',
    'outOfServiceDate',
    'eqpOwnershipComments',
    'maintenanceType',
    'noOfHours',
    'scheduleComments',
    'scheduleModifiedOn',
    'scheduleAddedOn',
    'departmentID',
    'equipmentAs',
    'locationTypeID',
    'macAddress',
    'isDeleted',
    'isActive',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'equipmentSetupMethod',
    'documentPath',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'binId',
    'assyId',
    'serialNumber',
    'calibrationRequired'
];

const inputFieldsUpdate = [
    'eqpID',
    'assetName',
    'eqpMake',
    'eqpModel',
    'eqpYear',
    'eqpDescription',
    'assetNumber',
    'eqpGroupID',
    'eqpSubGroupID',
    'eqpTypeID',
    'eqpOwnershipTypeID',
    'bankName',
    'customerId',
    'placedInServiceDate',
    'outOfServiceDate',
    'eqpOwnershipComments',
    'maintenanceType',
    'scheduleModifiedOn',
    'scheduleAddedOn',
    'departmentID',
    'equipmentAs',
    'locationTypeID',
    'macAddress',
    'isActive',
    'updatedBy',
    'equipmentSetupMethod',
    'documentPath',
    'updateByRoleId',
    'deleteByRoleId',
    'binId',
    'assyId',
    'serialNumber',
    'calibrationRequired'
];

const inputFieldsMaintenanceUpdate = [
    'maintenanceType',
    'noOfHours',
    'scheduleComments',
    'scheduleModifiedOn',
    'scheduleAddedOn',
    'updatedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrive list of equipment
    // POST : /api/v1/equipment/retriveEquipmentList
    // @return list of equipment
    retriveEquipmentList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveEquipment (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                equipment: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive detail of equipment
    // GET : /api/v1/equipment/:id
    // @param {id} int
    // @return detail of equipment
    retriveEquipment: (req, res) => {
        const {
            Equipment,
            GenericFiles,
            EquipmentTask,
            EquipmentTaskSchedule,
            WarehouseMst,
            BinMst
        } = req.app.locals.models;
        let equipmentData;
        if (req.params.id) {
            return Equipment.findOne({
                where: {
                    eqpID: req.params.id,
                    [Op.or]: {
                        equipmentAs: {
                            [Op.in]: ['E', 'W', 'S']
                        }
                    }
                },
                include: [{
                    model: EquipmentTask,
                    as: 'equipmentTask',
                    attributes: ['eqpTaskID', 'taskDetail', 'eqpID'],
                    required: false,
                    include: [{
                        model: EquipmentTaskSchedule,
                        as: 'equipmentTaskSchedule',
                        // attributes: ['eqpTaskScheduleID','eqpTaskID','repeatsType'],
                        required: false
                    }]
                },
                {
                    model: WarehouseMst,
                    as: 'warehouseMst',
                    attributes: ['ID', 'Name', 'refEqpID'],
                    required: false
                },
                {
                    model: BinMst,
                    as: 'binMst',
                    attributes: ['id', 'Name', 'WarehouseID'],
                    required: false,
                    include: [{
                        model: WarehouseMst,
                        as: 'warehousemst',
                        attributes: ['id', 'Name', 'parentWHID'],
                        required: false,
                        include: [{
                            model: WarehouseMst,
                            as: 'parentWarehouseMst',
                            attributes: ['id', 'Name'],
                            required: false
                        }]
                    }]
                }
                ]
            }).then((equipment) => {
                if (!equipment) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                equipmentData = equipment;
                _.each(equipmentData.equipmentTask, (itemData) => {
                    GenericFiles.count({
                        where: {
                            refTransID: itemData.eqpTaskID,
                            gencFileOwnerType: COMMON.AllEntityIDS.Equipment_Task.Name,
                            isRecycle: false
                        }
                    }).then((equipmentTaskDocument) => {
                        itemData.dataValues['totalEquipmentTaskDocument'] = equipmentTaskDocument ? equipmentTaskDocument : 0;
                    });
                });

                return GenericFiles.findAll({
                    where: {
                        refTransID: req.params.id,
                        gencFileOwnerType: COMMON.AllEntityIDS.Equipment.Name,
                        isRecycle: false,
                        gencFileName: {
                            [Op.like]: 'profile%'
                        }
                    },
                    raw: true
                }).then((profileData) => {
                    if (equipmentData && profileData.length > 0) {
                        equipmentData.dataValues.genericFiles = profileData;
                    }
                    if (!equipmentData) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);// new NotFound(EQUIPMENT.NOT_FOUND));
                    }
                    equipmentData.eqpDescription = COMMON.getTextAngularValueFromDB(equipmentData.eqpDescription);
                    equipmentData.scheduleComments = COMMON.getTextAngularValueFromDB(equipmentData.scheduleComments);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, equipmentData, null);
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

    // to be called in promise from API only
    duplicateValidationPromise: (req) => {
        const {
            Equipment
        } = req.app.locals.models;
        var where = {};
        if (req.body) {
            where = {
                equipmentAs: req.body.equipmentAs,
                assetName: req.body.assetName
            };
            if (req.body.eqpID) {
                where.eqpID = {
                    [Op.ne]: req.body.eqpID
                };
            }
            return Equipment.findOne({
                where: where
            }).then((isexist) => {
                if (isexist) {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.MASTER.EQUIPMENT_AND_WORKSTATION_VALIDATION
                    };
                } else {
                    return {
                        status: STATE.SUCCESS
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.NOT_CREATED(currentModuleName)
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    // to be called in promise from API only
    duplicateSampleValidationPromise: (req) => {
        const {
            Equipment
        } = req.app.locals.models;
        var where = {};
        if (req.body) {
            if (req.body.equipmentAs === 'S') {
                where = {
                    equipmentAs: req.body.equipmentAs,
                    assyId: req.body.assyId
                };
                if (req.body.eqpID) {
                    where.eqpID = {
                        [Op.ne]: req.body.eqpID
                    };
                }
                return Equipment.findOne({
                    where: where
                }).then((isexist) => {
                    if (isexist) {
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.MASTER.SAMPLE_SHOULD_BE_ONE_FOR_ASSEMBLY
                        };
                    } else {
                        return {
                            status: STATE.SUCCESS
                        };
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.NOT_CREATED(currentModuleName)
                    };
                });
            } else {
                return {
                    status: STATE.SUCCESS
                };
            }
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },
    // create equipment
    // POST : /api/v1/equipment/createEquipment
    // @return created equipment
    createEquipment: (req, res) => {
        const {
            Equipment,
            GenericFiles,
            sequelize
        } = req.app.locals.models;
        const dir = DATA_CONSTANT.EQUIPMENT.UPLOAD_PATH;
        var promises = [];
        var filePromises = [];
        let equipmentData;
        if (req.body.assetName) {
            req.body.assetName = COMMON.TEXT_WORD_CAPITAL(req.body.assetName, false);
        }
        if (req.body.bankName) {
            req.body.bankName = COMMON.TEXT_WORD_CAPITAL(req.body.bankName, false);
        }
        COMMON.setModelCreatedByFieldValue(req);
        const validationPromises = [];
        validationPromises.push(module.exports.duplicateValidationPromise(req));
        validationPromises.push(module.exports.duplicateSampleValidationPromise(req));

        Promise.all(validationPromises).then((response) => {
            var resObj = _.find(response, resp => resp.status === STATE.FAILED);
            if (resObj) {
                if (resObj.message) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: resObj.message, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(currentModuleName), err: null, data: null });
                }
            } else {
                return sequelize.transaction((t) => {
                    promises = [];
                    req.body.eqpDescription = COMMON.setTextAngularValueForDB(req.body.eqpDescription);
                    promises.push(Equipment.create(req.body, {
                        fields: inputFields,
                        transaction: t
                    }).then((equipment) => {
                        equipmentData = equipment;
                        if (typeof (req.files) === 'object' && typeof (req.files.profile) === 'object') {
                            filePromises = [];

                            let addProfileImage = {};
                            const file = req.files.profile;
                            const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                            const fileName = `${file.fieldName}-${uuidv1()}.${ext}`;
                            const path = dir + fileName;

                            addProfileImage = {
                                gencFileName: fileName,
                                gencOriginalName: file.originalFilename,
                                gencFileType: file.type,
                                gencFileExtension: ext,
                                isDefault: true,
                                refTransID: equipmentData.eqpID,
                                gencFileOwnerType: req.body.ownertype,
                                entityID: req.body.entityID,
                                isActive: true,
                                fileSize: file.size,
                                createdBy: req.user.id,
                                updatedBy: req.user.id,
                                genFilePath: path.replace('.', ''),
                                isRecycle: false
                            };
                            // With Promises:
                            filePromises.push(fsextra.move(file.path, path)
                                .then(() => sequelize.transaction(() => (
                                    GenericFiles.create(addProfileImage, {
                                        transaction: t
                                    })
                                ))
                                ).catch(() => STATE.FAILED));
                            return Promise.all(filePromises).then((responsePromise) => {
                                var resObject = _.find(responsePromise, resp => resp.status === STATE.FAILED);
                                if (resObject) {
                                    return resObject;
                                } else {
                                    return STATE.SUCCESS;
                                }
                            });
                        } else {
                            return STATE.SUCCESS;
                        }
                    }));

                    return Promise.all(promises).then(resp => Promise.all(resp)
                    ).catch((err) => {
                        if (!t.finished) {
                            t.rollback();
                        }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).then(() => {
                    // Add Equipment & Work Station detail into Elastic Search Engine for Enterprise Search
                    req.params = {
                        eqpID: equipmentData.eqpID
                    };
                    // Add Equipment & Work Station detail into Elastic Search Engine for Enterprise Search
                    // Need to change timeout code due to transaction not get updated record
                    setTimeout(() => {
                        enterpriseSearchController.manageEquipmentWorkStationDetailInElastic(req);
                    }, 2000);

                    // const message = MESSAGE_CONSTANT.CREATED(currentModuleName);

                    if (typeof (req.files) === 'object' && typeof (req.files.profile) === 'object') {
                        return GenericFiles.findOne({
                            where: {
                                refTransID: equipmentData.eqpID,
                                gencFileOwnerType: req.body.ownertype,
                                isRecycle: false,
                                gencFileName: {
                                    [Op.like]: 'profile%'
                                }
                            },
                            attributes: ['gencFileID', 'gencFileName', 'gencOriginalName']
                        }).then(filedata => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { equipmentData, profileImageData: filedata }, MESSAGE_CONSTANT.CREATED(currentModuleName))
                        ).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            equipmentData,
                            profileImageData: null
                        }, MESSAGE_CONSTANT.CREATED(currentModuleName));
                    }
                }).catch((equipmentCreateError) => {
                    console.trace();
                    console.error(equipmentCreateError);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: equipmentCreateError, data: null });
                });
            }
        });
    },
    // update equipment
    // PUT : /api/v1/equipment/updateEquipment
    // @return updated equipment
    updateEquipment: (req, res) => {
        if (req.params.id) {
            if (req.body.isProfileImageDeleteAction) {
                req.body.isProfileImageDeleteAction = req.body.isProfileImageDeleteAction === 'true' ? true : false;
            }
            const {
                Equipment,
                GenericFiles,
                sequelize
            } = req.app.locals.models;
            if (req.body.assetName) {
                req.body.assetName = COMMON.TEXT_WORD_CAPITAL(req.body.assetName, false);
            }
            if (req.body.bankName) {
                req.body.bankName = COMMON.TEXT_WORD_CAPITAL(req.body.bankName, false);
            }
            let promises = [];
            const validationPromises = [];
            validationPromises.push(module.exports.duplicateValidationPromise(req));
            validationPromises.push(module.exports.duplicateSampleValidationPromise(req));

            return Promise.all(validationPromises).then((response) => {
                var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                if (resObj) {
                    if (resObj.message) {
                        // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: resObj.message, err: null, data: null });
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.NOT_CREATED(resObj.message));
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(currentModuleName), err: null, data: null });
                    }
                } else {
                    return sequelize.transaction((t) => {
                        promises = [];
                        const dir = DATA_CONSTANT.EQUIPMENT.UPLOAD_PATH;

                        // add profile image in only when new file comes for add/change profile image
                        if (typeof (req.files) === 'object' && typeof (req.files.profile) === 'object') {
                            let addProfileImage = {};
                            const file = req.files.profile;
                            const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                            const fileName = `${file.fieldName}-${uuidv1()}.${ext}`;
                            const path = dir + fileName;

                            promises.push(GenericFiles.findOne({
                                where: {
                                    refTransID: req.body.eqpID,
                                    gencFileOwnerType: req.body.ownertype,
                                    gencFileName: {
                                        [Op.like]: 'profile%'
                                    }
                                },
                                attributes: ['gencFileID', 'gencFileName'],
                                transaction: t,
                                raw: true
                            }).then((profileImageData) => {
                                if (profileImageData) {
                                    const deleteProfileImgObj = {
                                        deletedBy: req.user.id,
                                        deletedAt: COMMON.getCurrentUTC(),
                                        isDeleted: true,
                                        updatedBy: req.user.id
                                    };
                                    COMMON.setModelDeletedByFieldValue(req);
                                    GenericFiles.update(deleteProfileImgObj, {
                                        where: {
                                            gencFileID: profileImageData.gencFileID
                                        },
                                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy'],
                                        transaction: t
                                    });

                                    const pathToDelete = DATA_CONSTANT.EQUIPMENT.UPLOAD_PATH + profileImageData.gencFileName;
                                    fs.unlink(pathToDelete, () => { });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                            }));

                            addProfileImage = {
                                gencFileName: fileName,
                                gencOriginalName: file.originalFilename,
                                gencFileType: file.type,
                                gencFileExtension: ext,
                                isDefault: true,
                                refTransID: req.params.id,
                                gencFileOwnerType: req.body.ownertype,
                                entityID: req.body.entityID,
                                isActive: true,
                                fileSize: file.size,
                                createdBy: req.user.id,
                                updatedBy: req.user.id,
                                genFilePath: path.replace('.', '')
                            };
                            // With Promises:
                            promises.push(fsextra.move(file.path, path)
                                .then(() => sequelize.transaction(() => (
                                    GenericFiles.create(addProfileImage, {
                                        transaction: t
                                    })
                                ))).catch(() => STATE.FAILED));
                        } else if (req.body.isProfileImageDeleteAction && (!(typeof (req.files) === 'object' && typeof (req.files.profile) === 'object')) && !req.body.profileImage) {
                            // delete profile image when only user remove profile image from ui
                            promises.push(GenericFiles.findOne({
                                where: {
                                    refTransID: req.body.eqpID,
                                    gencFileOwnerType: req.body.ownertype,
                                    gencFileName: {
                                        [Op.like]: 'profile%'
                                    }
                                },
                                attributes: ['gencFileID', 'gencFileName'],
                                transaction: t,
                                raw: true
                            }).then((profileImageData) => {
                                if (profileImageData) {
                                    const deleteProfileImgObj = {
                                        deletedBy: req.user.id,
                                        deletedAt: COMMON.getCurrentUTC(),
                                        isDeleted: true,
                                        updatedBy: req.user.id
                                    };
                                    COMMON.setModelDeletedByFieldValue(req);
                                    GenericFiles.update(deleteProfileImgObj, {
                                        where: {
                                            gencFileID: profileImageData.gencFileID
                                        },
                                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy'],
                                        transaction: t
                                    });

                                    const path = DATA_CONSTANT.EQUIPMENT.UPLOAD_PATH + profileImageData.gencFileName;
                                    fs.unlink(path, () => { });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                            }));
                        }

                        // from UI side NULL properties are removed and not passed in req.body.
                        // So as those properties are not in req.body, NULL values of them are not update into database
                        inputFieldsUpdate.forEach((field) => {
                            if (!req.body[field]) {
                                req.body[field] = null;
                            }
                        });
                        if (!req.body.isActive) {
                            req.body.isActive = false;
                        }
                        req.body.eqpDescription = COMMON.setTextAngularValueForDB(req.body.eqpDescription);
                        COMMON.setModelUpdatedByFieldValue(req);
                        promises.push(Equipment.update(req.body, {
                            where: {
                                eqpID: req.params.id
                            },
                            fields: inputFieldsUpdate,
                            transaction: t
                        }));

                        return Promise.all(promises).then(resp => Promise.all(resp)
                        ).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).then(() => {
                        // Add Equipment & Work Station detail into Elastic Search Engine for Enterprise Search
                        req.params = {
                            eqpID: req.body.eqpID
                        };
                        // Add Equipment & Work Station detail into Elastic Search Engine for Enterprise Search
                        // Need to change timeout code due to transaction not get updated record
                        setTimeout(() => {
                            enterpriseSearchController.manageEquipmentWorkStationDetailInElastic(req);
                        }, 2000);
                        GenericFiles.findOne({
                            where: {
                                refTransID: req.body.eqpID,
                                gencFileOwnerType: req.body.ownertype,
                                isRecycle: false,
                                gencFileName: {
                                    [Op.like]: 'profile%'
                                }
                            },
                            attributes: ['gencFileID', 'gencFileName', 'gencOriginalName']
                        }).then(filedata => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            profileImageData: filedata
                        }, MESSAGE_CONSTANT.UPDATED(currentModuleName))
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
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    /* Save-update Equipment Maintenance Schedule*/
    saveEquipmentMaintenanceSchedule: (req, res) => {
        const Equipment = req.app.locals.models.Equipment;

        if (req.params.id) {
            req.body.scheduleComments = COMMON.setTextAngularValueForDB(req.body.scheduleComments);
            COMMON.setModelUpdatedByFieldValue(req);
            return Equipment.update(req.body, {
                where: {
                    eqpID: req.params.id
                },
                fields: inputFieldsMaintenanceUpdate
            }).then((rowsUpdated) => {
                if (rowsUpdated[0] === 1) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EQUIPMENT_MAINTENANCE_SAVED);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.EQUIPMENT_MAINTENANCE_NOT_SAVED, err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // delete equipment
    // POST : /api/v1/equipment/deleteEquipment
    // @param {id} int
    // @return delete equipment details
    deleteEquipment: (req, res) => {
        const {
            GenericFiles,
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Equipment.Name;
            const entityID = COMMON.AllEntityIDS.Equipment.ID;
            // let equipmentIds = req.params.id.split(',') || [];
            const Entities = COMMON.AllEntityIDS;
            const Entity = Entities.Equipment;
            const promises = [];

            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((equipmentDetail) => {
                if (equipmentDetail.length === 0) {
                    return GenericFiles.findAll({
                        where: {
                            refTransID: {
                                [Op.in]: req.body.objIDs.id
                            },
                            gencFileOwnerType: Entity.Name
                        }
                    }).then((genericFileData) => {
                        const genericList = genericFileData;
                        COMMON.setModelDeletedByFieldValue(req);
                        promises.push(GenericFiles.update(req.body, {
                            where: {
                                refTransID: {
                                    [Op.in]: req.body.objIDs.id
                                },
                                gencFileOwnerType: Entity.Name,
                                deletedAt: null
                            },
                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy']
                        }).then(() => {
                            if (req.body.objIDs.isPermanentDelete === true) {
                                _.each(genericList, (itemData) => {
                                    fs.unlink(`.${itemData.genFilePath}`, () => { });
                                    return Promise.resolve(itemData);
                                });
                            }
                            Promise.all(promises);

                            if (req.body.objIDs.id.length > 0) {
                                // Delete Equipment & WorkStation Detail into Elastic Search Engine for Enterprise Search
                                // Need to change timeout code due to trasaction not get updated record
                                setTimeout(() => {
                                    enterpriseSearchController.deleteEquipmentWorkStationDetailInElastic(req.body.objIDs.id.toString());
                                }, 2000);
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, equipmentDetail, MESSAGE_CONSTANT.DELETED(currentModuleName));
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: equipmentDetail,
                        IDs: req.body.objIDs.id
                    }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    /* to get Equipment Documents list */
    retriveEquipmentDocumentList: (req, res) => {
        const {
            GenericFiles
        } = req.app.locals.models;
        if (req.body.searchObj) {
            return GenericFiles.findAll({
                where: {
                    refTransID: req.body.searchObj.refTransID,
                    entityID: req.body.searchObj.entityID,
                    isRecycle: false,
                    gencFileName: {
                        [Op.like]: 'documents%'
                    }
                }
            }).then(documents => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.SUCCESS, documents, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.DownloadFileErrorMsg_NotFound, err: null, data: null });
        }
    },

    /* to download selected Document */
    downloadEquipmentDocument: (req, res) => {
        const {
            GenericFiles
        } = req.app.locals.models;
        GenericFiles.findOne({
            where: {
                gencFileID: req.params.gencFileID
            }
        }).then((equipmentDocument) => {
            var path = DATA_CONSTANT.EQUIPMENT.UPLOAD_PATH + equipmentDocument.gencFileName;
            fs.readFile(path, (err) => {
                if (err) {
                    if (err.code === COMMON.FileErrorMessage.NotFound) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);// new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
                    } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
                    }
                } else {
                    const file = path;
                    res.setHeader('Content-disposition', `attachment; filename=${equipmentDocument.gencOriginalName}`);
                    res.setHeader('Content-type', equipmentDocument.gencFileType);
                    const filestream = fs.createReadStream(file);
                    return filestream.pipe(res);
                }
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, null);
        });
    },
    // Get equipment profile By Id
    // GET : /api/v1/equipment/retrieveEquipmentProfile
    // @param {id} int
    // @return equipment profile
    retrieveEquipmentProfile: (req, res) => {
        const {
            Operation,
            StandardClass,
            CertificateStandards,
            WorkorderCertification,
            sequelize,
            WorkorderOperationEquipment,
            GenericFiles,
            MfgCodeMst,
            EquipmentDataelement,
            OperationEquipment,
            Equipment,
            Workorder,
            DataElement,
            RFQRoHS,
            GenericCategory,
            EquipmentTask,
            EquipmentTaskSchedule,
            Component,
            WorkorderSalesOrderDetails
        } = req.app.locals.models;
        if (req.params.id) {
            return sequelize.transaction(() => Equipment.findOne({
                where: {
                    eqpID: req.params.id
                },
                attributes: ['assetName', 'assetNumber', 'eqpMake', 'eqpModel', 'eqpYear', 'eqpGroupID',
                    'eqpSubGroupID', 'eqpOwnershipTypeID', 'customerId', 'bankName', 'eqpDescription',
                    'scheduleComments', 'noOfHours', 'maintenanceType'
                ],
                include: [{
                    model: EquipmentTask,
                    as: 'equipmentTask',
                    attributes: ['eqpTaskID', 'taskDetail', 'eqpID'],
                    required: false,
                    where: {
                        isActive: true
                    },
                    include: [{
                        model: EquipmentTaskSchedule,
                        where: {
                            isActive: true
                        },
                        as: 'equipmentTaskSchedule',
                        attributes: ['eqpTaskScheduleID', 'eqpTaskID', 'repeatsType', 'dayType', 'monthDate',
                            'monthType', 'scheduleStartTime', 'repeatEnd', 'endOnDate', 'endAfterOccurrence', 'scheduleRemarks', 'isActive'
                        ],
                        required: false
                    }]
                }, {
                    model: OperationEquipment,
                    as: 'operationEquipment',
                    attributes: ['opEqpID', 'opID', 'eqpID'],
                    include: [{
                        model: Operation,
                        as: 'operations',
                        attributes: ['opNumber', 'opName', 'opStatus', 'opID']
                    }],
                    required: false
                }, {
                    model: WorkorderOperationEquipment,
                    as: 'workorderOperationEquipment',
                    attributes: ['woOpEqpID', 'woID', 'eqpID'],
                    required: false,
                    include: [{
                        model: Workorder,
                        as: 'workorder',
                        attributes: ['woID', 'woNumber', 'buildQty', 'woStatus', 'woSubStatus', 'RoHSStatusID', 'woVersion', 'partID'],
                        required: false,
                        include: [{
                            model: WorkorderCertification,
                            as: 'workorderCertification',
                            attributes: ['woCertificationID', 'woID', 'certificateStandardID'],
                            required: false,
                            include: [{
                                model: CertificateStandards,
                                as: 'certificateStandards',
                                attributes: ['certificateStandardID', 'fullName', 'shortName', 'standardTypeID', 'priority', 'standardInfo'],
                                required: false
                            },
                            {
                                model: StandardClass,
                                as: 'standardsClass',
                                attributes: ['certificateStandardID', 'classID', 'className', 'colorCode'],
                                required: false
                            }
                            ]
                        },
                        {
                            model: Component,
                            as: 'componentAssembly',
                            attributes: ['mfgPN', 'PIDCode', 'nickName', 'rev', 'id', 'mfgPNDescription'],
                            required: false
                        }, {
                            model: WorkorderSalesOrderDetails,
                            as: 'WoSalesOrderDetails',
                            attributes: ['woID', 'poQty', [sequelize.literal('fun_getPONumber(salesOrderDetailID)'), 'refPONumber']],
                            required: false
                        },
                        {
                            model: RFQRoHS,
                            as: 'rohs',
                            attributes: ['id', 'name', 'rohsIcon']
                        }
                        ]
                    }]
                }, {
                    model: EquipmentDataelement,
                    as: 'equipmentDataelement',
                    attributes: ['eqpDataElementID', 'eqpID', 'dataElementID'],
                    include: [{
                        model: DataElement,
                        as: 'dataElement',
                        attributes: ['dataElementID', 'dataElementName', 'controlTypeID', 'parentDataElementID', 'dataelement_use_at']
                    }],
                    required: false
                }, {
                    model: MfgCodeMst,
                    as: 'customer',
                    attributes: ['id', 'mfgName'],
                    where: {
                        mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG,
                        isCustOrDisty: true
                    },
                    required: false
                },
                {
                    model: GenericCategory,
                    as: 'equipmentGroup',
                    attributes: ['gencCategoryID', 'gencCategoryName'],
                    where: {
                        isActive: true
                    },
                    required: false
                }, {
                    model: GenericCategory,
                    as: 'equipmentSubGroup',
                    attributes: ['gencCategoryID', 'gencCategoryName'],
                    where: {
                        isActive: true
                    },
                    required: false
                }, {
                    model: GenericCategory,
                    as: 'equipmentOwnershipType',
                    attributes: ['gencCategoryID', 'gencCategoryName'],
                    where: {
                        isActive: true
                    },
                    required: false
                }
                ]
            }).then((data) => {
                const promises = [];
                promises.push(data);
                data.eqpDescription = COMMON.getTextAngularValueFromDB(data.eqpDescription);
                const equipmentData = data;
                if (equipmentData) {
                    _.each(equipmentData.equipmentTask, (itemData) => {
                        promises.push(GenericFiles.count({
                            where: {
                                refTransID: itemData.eqpTaskID,
                                gencFileOwnerType: COMMON.AllEntityIDS.Equipment_Task.Name,
                                isRecycle: false
                            }
                        }).then((equipmentTaskDocument) => {
                            itemData.dataValues['totalEquipmentTaskDocument'] = equipmentTaskDocument ? equipmentTaskDocument : 0;
                            return Promise.resolve(equipmentTaskDocument);
                        }));
                    });
                }
                promises.push(GenericFiles.findAll({
                    where: {
                        refTransID: req.params.id,
                        gencFileOwnerType: COMMON.AllEntityIDS.Equipment.Name,
                        isRecycle: false,
                        gencFileName: {
                            [Op.like]: 'profile%'
                        }
                    },
                    raw: true
                }).then((profileData) => {
                    if (equipmentData && profileData.length > 0) {
                        equipmentData.dataValues.genericFiles = profileData;
                    }
                    return Promise.resolve(equipmentData);
                }));
                return Promise.all(promises);
            })).then((newequipmentData) => {
                if (!newequipmentData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);// new NotFound(EQUIPMENT.NOT_FOUND));
                } else {
                    const obj = {};
                    obj.equipmentProfile = newequipmentData[0];
                    if (obj.equipmentProfile.dataValues && obj.equipmentProfile.dataValues.eqpDescription && obj.equipmentProfile.dataValues.scheduleComments) {
                        obj.equipmentProfile.dataValues.eqpDescription = COMMON.getTextAngularValueFromDB(obj.equipmentProfile.dataValues.eqpDescription);
                        obj.equipmentProfile.dataValues.scheduleComments = COMMON.getTextAngularValueFromDB(obj.equipmentProfile.dataValues.scheduleComments);
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
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
    // Get list of employee equipment
    // POST : /api/v1/equipment/retriveEmployeeEquipmentsWithProfile
    // @return employee equipment list
    retriveEmployeeEquipmentsWithProfile: (req, res) => {
        const {
            Equipment,
            EmployeeEquipment
        } = req.app.locals.models;
        return Equipment.findAll({
            where: {
                equipmentAs: req.body.equipmentObj.equipmentAs,
                isActive: true
            },
            attributes: ['eqpID', 'assetName', 'assetNumber', 'eqpMake', 'eqpModel', 'eqpYear', 'equipmentAs'],
            include: [{
                model: EmployeeEquipment,
                as: 'employeeEquipment',
                attributes: ['empEqpID', 'employeeID', 'eqpID'],
                where: {
                    employeeID: req.body.equipmentObj.employeeID
                },
                required: true
            }]
        }).then(equipmentList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, equipmentList, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get List of equipment
    // GET : /api/v1/equipment/getequipmentlist
    // @return List of equipment
    getequipmentlist: (req, res) => {
        const Equipment = req.app.locals.models.Equipment;
        const whereClause = {
            isActive: true
        };
        if (req.query.searchquery) {
            whereClause.assetName = {
                [Op.like]: `%${req.query.searchquery}%`
            };
        } else {
            whereClause.equipmentAs = DATA_CONSTANT.EQUIPMENT_TYPE_VALUE.EQUIPMENT;
        }
        Equipment.findAll({
            where: whereClause
        }).then(equipment => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, equipment, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
        });
    },
    // Get List of equipment by search
    // POST : /api/v1/equipment/getequipmentBySearch
    // @return search List of equipment
    getequipmentBySearch: (req, res) => {
        const Equipment = req.app.locals.models.Equipment;
        const whereClause = {};
        if (req.body.listObj.query) {
            whereClause[Op.or] = [
                { assetName: { [Op.like]: `%${req.body.listObj.query}%` } },
                { eqpMake: { [Op.like]: `%${req.body.listObj.query}%` } },
                { eqpModel: { [Op.like]: `%${req.body.listObj.query}%` } }
            ];
        }
        if (req.body.listObj.active) {
            whereClause.isActive = true;
        }
        if (req.body.listObj.equipmentAs) {
            whereClause.equipmentAs = req.body.listObj.equipmentAs;
        }
        if (req.body.listObj.eqpID) {
            whereClause.eqpID = req.body.listObj.eqpID;
        }
        whereClause.calibrationRequired = true;

        Equipment.findAll({
            where: whereClause
        }).then(equipment => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, equipment, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
        });
    },

    getOperationEquipmentlist: (req, res) => {
        const {
            Equipment,
            WorkorderOperationEquipment
        } = req.app.locals.models;
        return Equipment.findAll({
            where: {
                equipmentAs: {
                    [Op.in]: req.body.equipmentObj.equipmentAs
                },
                isActive: true
            },
            attributes: ['eqpID', 'assetName', 'assetNumber', 'eqpMake', 'eqpModel', 'eqpYear', 'equipmentAs'],
            include: [{
                model: WorkorderOperationEquipment,
                as: 'workorderOperationEquipment',
                attributes: ['eqpID', 'woOPID'],
                where: {
                    woOPID: req.body.equipmentObj.woOPID
                },
                required: true
            }]
        }).then(equipmentList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, equipmentList, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Retrieve list of work order operation equipment for accessing its workorder_trans_equipment_dataelement in report
    // POST : /api/v1/workorderoperationequipmentinfo/retrieveAllWOOPEquipmentforTransDataElement
    // @return list of work orders
    retrieveAllWOOPEquipmentforTransDataElement: (req, res) => {
        const {
            Equipment,
            WorkorderOperationEquipment
        } = req.app.locals.models;
        if (req.params.woID && req.params.woOPID) {
            return Equipment.findAll({
                include: [{
                    model: WorkorderOperationEquipment,
                    as: 'workorderOperationEquipment',
                    required: true,
                    attributes: ['eqpID'],
                    where: {
                        woID: req.params.woID,
                        woOPID: req.params.woOPID
                    }
                }],
                attributes: ['eqpID', 'assetName', 'eqpMake', 'eqpModel', 'eqpYear']
            }).then(workorderOperationEquipmentlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { workorderOperationEquipmentlist: workorderOperationEquipmentlist }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    getAllWorkStation: (req, res) => {
        const WarehouseMst = req.app.locals.models.Equipment;
        const whereClause = {
            isActive: true
        };
        if (req.query && req.query.filterID) {
            whereClause.id = {
                [Op.ne]: req.query.filterID
            };
        }
        return WarehouseMst.findAll({
            attributes: ['Name', 'id'],
            order: [
                ['Name', 'ASC']
            ],
            where: whereClause
        }).then(binlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, binlist, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // check equipments and workstations name Already Exists
    // POST : /api/v1/employee/checkEquipmentAndWorkstationNameAlreadyExists
    // @return API response
    checkEquipmentAndWorkstationNameAlreadyExists: (req, res) => {
        const Equipment = req.app.locals.models.Equipment;
        if (req.body) {
            const whereClause = {
                assetName: req.body.objs.assetName,
                equipmentAs: req.body.objs.equipmentAs
            };
            if (req.body.objs.eqpID) {
                whereClause.eqpID = {
                    [Op.notIn]: [req.body.objs.eqpID]
                };
            }
            return Equipment.findOne({
                where: whereClause
            }).then((isExists) => {
                if (isExists) {
                    const isExistsName = _.find(isExists, name => name.assetName.toLowerCase() === req.body.objs.assetName.toLowerCase());
                    if (isExistsName) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.EQUIPMENT_WORKSTATION_UNIQUE_FIELD.NAME), err: null, data: null });
                    }
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Down-load equipment & workstation template
    // GET : /api/v1/employee/downloadequipmentAndworkstationTemplate
    // @return API response
    downloadequipmentAndworkstationTemplate: (req, res) => {
        const categoryTypeName = `${req.params.model}.xlsx`;
        var path = DATA_CONSTANT.EQUIPMENT.DOWNLOAD_PATH + categoryTypeName;

        fs.readFile(path, (err) => {
            if (err) {
                if (err.code === COMMON.FileErrorMessage.NotFound) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);// new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
                } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
                }
            } else {
                const file = path;
                res.setHeader('Content-disposition', `attachment; filename=${categoryTypeName}`);
                res.setHeader('Content-type', 'application/vnd.ms-excel');
                const filestream = fs.createReadStream(file);
                return filestream.pipe(res);
            }
        });
    },

    checkEquipmentInWarehouse: (req, res) => {
        const {
            WarehouseMst,
            Equipment
        } = req.app.locals.models;
        if (req.body && req.body.objs.id) {
            return WarehouseMst.findOne({
                where: {
                    refEqpID: req.body.objs.id
                },
                model: WarehouseMst,
                attributes: ['ID', 'Name'],
                paranoid: true
            }).then((resp) => {
                if (resp && resp.ID) {
                    return Equipment.findOne({
                        where: {
                            eqpID: req.body.objs.id
                        },
                        model: Equipment,
                        attributes: ['eqpID', 'assetName'],
                        paranoid: true
                    }).then((response) => {
                        if (response && response.assetName !== req.body.objs.name) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            // return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    getAssemblySamplesList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.query.id) {
            return sequelize.query('CALL Sproc_GetAssemblySamplesList (:pWoId,:pAssyId,:pIsShowAll)', {
                replacements: {
                    pWoId: req.query.woID,
                    pAssyId: req.query.id,
                    pIsShowAll: (req.query.isShowAll && req.query.isShowAll === 'true') ? true : false
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (req.query.isInitialDataLoading === 'false' && response && _.values(response[0]).length === 0) {
                    let messageContent = MESSAGE_CONSTANT.MASTER.SAMPLE_NOT_FOUND_FOR_ASSEMBLY;
                    if (req.query.isShowAll === 'true') {
                        messageContent = MESSAGE_CONSTANT.MASTER.SAMPLE_NOT_FOUND_FOR_REVISIONS;
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), messageContent);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};