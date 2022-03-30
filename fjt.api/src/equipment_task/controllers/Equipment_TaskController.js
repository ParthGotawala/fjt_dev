const fs = require('fs');
const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'eqpTaskID',
    'taskDetail',
    'eqpID',
    'isDeleted',
    'isActive',
    'documentPath',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy'
];
const componentModuleName = DATA_CONSTANT.EQUIPMENT_TASKS.NAME;

module.exports = {
    /* create Equipment Task with related equipment_task_schedule and task document */
    createEquipmentTask: (req, res) => {
        const { EquipmentTask, EquipmentTaskSchedule, sequelize } = req.app.locals.models;
        if (req.body) {
            // let genFilePath;
            return sequelize.transaction().then((t) => {
                COMMON.setModelCreatedByFieldValue(req);
                return EquipmentTask.create(req.body, {
                    fields: inputFields,
                    transaction: t
                }).then((equipmentTask) => {
                    const equipDetail = equipmentTask;
                    if (!equipDetail) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.NOT_CREATED(DATA_CONSTANT.EQUIPMENT_TASKS.NAME));
                    }
                    equipDetail.totalEquipmentTaskDocument = 0;
                    equipDetail.equipmentTaskSchedule = [];
                    const equipmentTaskScheduleList = [];
                    _.each(req.body.repeatsTypeList.split(','), (repeatTypeItem) => {
                        const objData = {};
                        objData.eqpTaskID = equipmentTask.eqpTaskID;
                        objData.repeatsType = repeatTypeItem;
                        objData.isActive = false;  /* because actual data not added now. true when all necessary entry entered */
                        objData.createdBy = req.user.id;
                        equipmentTaskScheduleList.push(objData);
                    });

                    if (equipmentTaskScheduleList.length > 0) {
                        return EquipmentTaskSchedule.bulkCreate(equipmentTaskScheduleList, {
                            individualHooks: true,
                            transaction: t
                        }).then((addedSchedule) => {
                            t.commit();
                            equipDetail.equipmentTaskSchedule = addedSchedule;
                            return resHandler.successRes(res,
                                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                STATE.SUCCESS, equipDetail, MESSAGE_CONSTANT.CREATED(DATA_CONSTANT.EQUIPMENT_TASKS.NAME));
                            // }
                        });
                    } else {
                        t.commit();
                        return resHandler.successRes(res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, equipDetail, MESSAGE_CONSTANT.CREATED(DATA_CONSTANT.EQUIPMENT_TASKS.NAME));
                    }
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
        // });
    },

    /* update Equipment Task with related equipment_task_schedule */
    updateEquipmentTask: (req, res) => {
        if (req.params.id) {
            const { EquipmentTask, EquipmentTaskSchedule, sequelize } = req.app.locals.models;
            let existRepeatTypes;
            return sequelize.transaction(t => EquipmentTask.update(req.body, {
                where: {
                    eqpTaskID: req.params.id
                },
                fields: inputFields
            }, { transaction: t }).then(() =>
                /* check exists repeatsType of eqpTaskID */
                EquipmentTaskSchedule.findAll({
                    attributes: ['repeatsType'],
                    where: {
                        eqpTaskID: req.params.id
                    }
                }).then((existRepeatTypesList) => {
                    existRepeatTypes = existRepeatTypesList.map(existRepeatTypeItem => existRepeatTypeItem.repeatsType);

                    let existsRepeatTypesDelete = [];
                    /* delete other all unselected repeatsType of eqpTaskID */
                    existsRepeatTypesDelete = _.difference(existRepeatTypes, req.body.repeatsTypeList);

                    COMMON.setModelDeletedByFieldValue(req);
                    return EquipmentTaskSchedule.update(req.body, {
                        where: {
                            eqpTaskID: req.params.id,
                            repeatsType: { [Op.in]: existsRepeatTypesDelete },
                            deletedAt: null
                        },
                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy']
                    }, { transaction: t }).then(() => {
                        /* insert only new selected repeatsType of eqpTaskID */
                        const insertOtherRepeatTypes = _.difference(req.body.repeatsTypeList, existRepeatTypes);

                        var equipmentTaskScheduleList = [];
                        _.each(insertOtherRepeatTypes, (repeatTypeItem) => {
                            var objData = {};
                            objData.eqpTaskID = req.params.id;
                            objData.repeatsType = repeatTypeItem;
                            objData.isActive = false;  /* because actual data not added now. true when all necessary entry entered */
                            objData.createdBy = req.user.id;
                            equipmentTaskScheduleList.push(objData);
                        });
                        return EquipmentTaskSchedule.bulkCreate(equipmentTaskScheduleList, {
                            individualHooks: true
                        }, { transaction: t });
                    });
                }))).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EQUIPMENT_TASK_UPDATED)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    /* to delete selected Equipment Task and its related task schedule */
    deleteEquipmentTask: (req, res) => {
        var promises = [];
        if (req.params.id) {
            const { EquipmentTask, EquipmentTaskSchedule, GenericFiles, sequelize } = req.app.locals.models;
            COMMON.setModelDeletedByFieldValue(req);
            const tableName = COMMON.AllEntityIDS.Equipment_Task;
            return sequelize.transaction().then((t) => {
                promises.push(
                    EquipmentTaskSchedule.update(req.body, {
                        where: {
                            eqpTaskID: req.params.id,
                            deletedAt: null
                        },
                        fields: inputFields,
                        transaction: t
                    }).then(() => ({
                        status: STATE.SUCCESS
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                        };
                    })
                );
                promises.push(
                    EquipmentTask.update(req.body, {
                        where: {
                            eqpTaskID: req.params.id,
                            deletedAt: null
                        },
                        fields: inputFields,
                        transaction: t
                    }).then(() => ({
                        status: STATE.SUCCESS
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                        };
                    })
                );
                promises.push(
                    GenericFiles.findAll({
                        where: {
                            refTransID: req.params.id,
                            gencFileOwnerType: tableName.Name
                        },
                        transaction: t
                    }).then(genericfiledata => GenericFiles.update(req.body, {
                        where: {
                            refTransID: req.params.id,
                            gencFileOwnerType: tableName.Name,
                            deletedAt: null
                        },
                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy'],
                        transaction: t
                    }).then(() => {
                        if (req.params.isPermanentDelete === 'true' && genericfiledata && genericfiledata.length > 0) {
                            // Delete generic Document
                            _.each(genericfiledata, (itemData) => {
                                fs.unlink(`.${itemData.genFilePath}`, () => { });
                            });
                        }
                        return {
                            status: STATE.SUCCESS
                        };
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                        };
                    })
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                        };
                    })
                );
                return Promise.all(promises).then((response) => {
                    var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                    if (resObj) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        if (resObj.message) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: resObj.message, err: null, data: null });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_DELETED(componentModuleName), err: null, data: null });
                        }
                    } else if (!t.finished) {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EQUIPMENT_TASK_DELETED));
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_DELETED(componentModuleName), err: null, data: null });
                    }
                }).catch((err) => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName), err: null, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName), err: null, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    /* to get Equipment task Documents list */
    retriveEquipmentTaskDocumentList: (req, res) => {
        const { GenericFiles } = req.app.locals.models;
        if (req.body.searchObj) {
            return GenericFiles.findAll({
                where: {
                    refTransID: req.body.searchObj.refTransID,
                    gencFileOwnerType: req.body.searchObj.gencFileOwnerType,
                    isRecycle: false
                }
            }).then((documents) => {
                if (!documents) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.SUCCESS, documents, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
