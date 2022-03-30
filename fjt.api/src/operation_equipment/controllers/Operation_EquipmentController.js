const _ = require('lodash');
const { Op } = require('sequelize');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
/* errors file*/
const { NotFound } = require('../../errors');

const inputFields = [
    'opEqpID',
    'opID',
    'eqpID',
    'isDeleted',
    'createdBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];


module.exports = {
    retrieveEquipmentOperationDetails: (req, res) => {
        const { OperationEquipment, Equipment, GenericFiles, sequelize } = req.app.locals.models;
        let equipmentData;
        if (req.params.id) {
            return sequelize.transaction(() => Equipment.findAll({
                where: {
                    equipmentAs: DATA_CONSTANT.EQUIPMENT_TYPE_VALUE.EQUIPMENT
                },
                attributes: ['eqpID', 'assetName', 'eqpMake', 'eqpModel', 'eqpYear', 'isActive', 'equipmentAs', 'createdBy'],
                include: [{
                    model: OperationEquipment,
                    as: 'operationEquipment',
                    attributes: ['opEqpID', 'opID', 'eqpID'],
                    where: {
                        opID: req.params.id
                    },
                    required: false
                }]
            }).then((getEquipmentData) => {
                equipmentData = getEquipmentData;
                let eqpIds = _.map(getEquipmentData, 'eqpID');
                eqpIds = eqpIds ? eqpIds : [];
                return GenericFiles.findAll({
                    where: {
                        refTransID: { [Op.in]: eqpIds },
                        gencFileOwnerType: COMMON.AllEntityIDS.Equipment.Name,
                        isRecycle: false,
                        gencFileName: {
                            [Op.like]: 'profile%'
                        }
                    },
                    raw: true,
                    attributes: ['gencFileName', 'refTransID']
                }).then((profileData) => {
                    if (equipmentData && equipmentData.length > 0
                        && profileData && profileData.length > 0) {
                        _.each(equipmentData, (eqpment) => {
                            _.each(profileData, (profile) => {
                                if (profile.refTransID === eqpment.eqpID) {
                                    eqpment.dataValues.genericFiles = profile;
                                }
                            });
                        });
                    }
                });
            })).then(() => {
                if (!equipmentData) {
                    return Promise.reject(MESSAGE_CONSTANT.MASTER.OPERATION_EQUIPMENT_NOT_FOUND);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, equipmentData, null);
            }).catch((err) => {
                if (err instanceof NotFound) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                } else {
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    createOperation_EquipmentList: (req, res) => {
        const { sequelize, OperationEquipment } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.equipmentList) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.equipmentList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.listObj.equipmentList);
            return sequelize.transaction().then(t => OperationEquipment.bulkCreate(req.body.listObj.equipmentList, {
                individualHooks: true,
                transaction: t
            }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EQUIPMENT_ADDED_TO_OPERATION))).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    deleteOperation_EquipmentList: (req, res) => {
        const { sequelize, OperationEquipment } = req.app.locals.models;
        if (req.query && req.query.eqpIDs && req.query.opID) {
            COMMON.setModelDeletedByFieldValue(req);
            return sequelize.transaction().then(t => OperationEquipment.update(req.body, {
                where: {
                    opID: req.query.opID,
                    eqpID: req.query.eqpIDs,
                    deletedAt: null
                },
                fields: inputFields,
                transaction: t
            }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EQUIPMENT_DELETED_FROM_OPERATION))).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
