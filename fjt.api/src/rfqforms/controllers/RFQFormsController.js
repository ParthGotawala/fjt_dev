const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const resHandler = require('../../resHandler');
const _ = require('lodash');
const { Op } = require('sequelize');
var Excel = require('exceljs');
Excel.config.setValue('promise', require('bluebird'));
const mkdirp = require('mkdirp');
const fs = require('fs');

let newrfqAssyIds = [];
const inputFieldsRFQ = [
    'id',
    'customerId',
    'employeeID',
    'quoteNote',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'salesCommissionTo'
];
const inputFieldsRFQAssy = [
    'id',
    'rfqrefID',
    'assyNote',
    'assemblyDescription',
    'quoteNote',
    'assyCloseNote',
    'assyClosedStatus',
    'assyClosedReasonID',
    'assyClosedDate',
    'IsRepeated',
    'repeatExpectedQty',
    'repeatFrequency',
    'quotePriority',
    'isRepeat',
    'description',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'jobTypeID',
    'RFQTypeID',
    'partID',
    'eau',
    'status',
    'quoteFinalStatus',
    'proposedBuildQty',
    'noOfBuild',
    'timePeriod',
    'additionalRequirement',
    'quoteInDate',
    'quoteDueDate',
    'quoteNumber',
    'quoteSubmitDate',
    'quoteValidTillDate',
    'assemblyTypeID',
    'laborType',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const inputFieldsRFQAssyQty = [
    'id',
    'rfqAssyID',
    'requestQty',
    'rfqPriceGroupId',
    'rfqPriceGroupDetailId',
    'quantityType',
    'copyQtyId',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const inputFieldsRFQMiscBuild = [
    'id',
    'rfqAssyID',
    'proposedBuildQty',
    'noOfBuild',
    'buildDate',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const inputFieldsRFQAssyQtyTurnTime = [
    'id',
    'rfqAssyQtyID',
    'turnTime',
    'unitOfTime',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const inputFieldsRFQPriceGroup = [
    'id',
    'name',
    'refRFQID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const inputFieldsRFQPriceGroupDetail = [
    'id',
    'rfqPriceGroupID',
    'refRFQID',
    'rfqAssyID',
    'qty',
    'turnTime',
    'unitOfTime',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const rfqModuleName = DATA_CONSTANT.RFQ.NAME;
module.exports = {
    // Create RFQ
    // POST : /api/v1/rfqforms/saveRFQ
    // @return created RFQ
    saveRFQ: (req, res) => {
        const { RFQForms, RFQAssemblies, RFQAssyQuantity, RFQAssyMiscBuild, RFQAssyQuantityTurnTime, sequelize } = req.app.locals.models;
        if (req.body) {
            // Update
            req.body.quoteNote = COMMON.setTextAngularValueForDB(req.body.quoteNote);
            if (req.body.id) {
                COMMON.setModelUpdatedByFieldValue(req);
                return module.exports.findSameAssy(req, req.body.rfqAssembly).then((respsameassy) => {
                    if (respsameassy.status) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RFQ.SAME_ASSY_EXISTS_API);
                        messageContent.message = COMMON.stringFormat(messageContent.message, respsameassy.index);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                    } else {
                        return module.exports.findSameQtyAssy(req, req.body.rfqAssembly).then((respsameassyqty) => {
                            if (respsameassyqty.status) {
                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.RFQ.SAME_QUANTITY_EXISTS);
                                messageContent.message = COMMON.stringFormat(messageContent.message, respsameassyqty.index);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                            } else {
                                return module.exports.getJobTypeChangeRFQAssyList(req).then(respsAssyIDArray => sequelize.transaction().then(t => RFQForms.update(req.body, {
                                    fields: inputFieldsRFQ,
                                    where: { id: req.body.id },
                                    transaction: t
                                }).then(() => {
                                    var newAssembly = [];
                                    var updateAssembly = [];
                                    var deleteAssembly = [];
                                    var deletedAssyQty = [];
                                    var deletedAssyMiscBuild = [];
                                    var deletedAssyQtyTurn = [];
                                    var newPriceGroup = [];
                                    var updatePriceGroup = [];
                                    var deletePriceGroup = [];
                                    var deletePriceGroupDetail = [];
                                    _.each(req.body.rfqAssembly, (item) => {
                                        item.rfqrefID = req.body.id;
                                        item.quoteNote = req.body.quoteNote;
                                        item.active = 1;
                                        item.assyNote = COMMON.setTextAngularValueForDB(item.assyNote);
                                        item.additionalRequirement = COMMON.setTextAngularValueForDB(item.additionalRequirement);
                                        if (item.id) {
                                            updateAssembly.push(item);
                                        } else {
                                            newAssembly.push(item);
                                        }
                                    });
                                    _.each(req.body.deletedAssembly, (i) => {
                                        _.each(i.rfqAssyQuantity, (q) => {
                                            _.each(q.rfqAssyQtyTurnTime, (tu) => {
                                                deletedAssyQtyTurn.push(tu.id);
                                            });
                                            deletedAssyQty.push(q.id);
                                        });
                                        _.each(i.rfqAssyMiscBuild, (miscBuild) => {
                                            deletedAssyMiscBuild.push(miscBuild.id);
                                        });
                                        deleteAssembly.push(i.id);
                                    });

                                    _.each(req.body.rfqPriceGroup, (objPriceGroup) => {
                                        objPriceGroup.refRFQID = req.body.id;
                                        if (objPriceGroup.id) {
                                            updatePriceGroup.push(objPriceGroup);
                                        } else {
                                            newPriceGroup.push(objPriceGroup);
                                        }
                                    });
                                    _.each(req.body.deletedrfqPriceGroup, (objDeletedPriceGroup) => {
                                        _.each(objDeletedPriceGroup.rfqPriceGroupDetail, (objDetail) => {
                                            if (objDetail.id) { deletePriceGroupDetail.push(objDetail.id); }
                                        });
                                        deletePriceGroup.push(objDeletedPriceGroup.id);
                                    });
                                    const promises = [];
                                    if (req.body.deletedAssembly.length > 0) {
                                        promises.push(module.exports.removeAssembly(req, deleteAssembly, deletedAssyQty, deletedAssyQtyTurn, deletedAssyMiscBuild, t));
                                    }
                                    if (newAssembly.length > 0) {
                                        COMMON.setModelCreatedArrayFieldValue(req.user, newAssembly);
                                        promises.push(module.exports.addAssembly(req, newAssembly, t));
                                    }
                                    if (updateAssembly.length > 0) {
                                        COMMON.setModelUpdatedByArrayFieldValue(req.user, updateAssembly);
                                        _.each(updateAssembly, (ass) => {
                                            promises.push(
                                                RFQAssemblies.update(ass, {
                                                    fields: inputFieldsRFQAssy,
                                                    transaction: t,
                                                    where: { id: ass.id }
                                                })
                                                    .then(() => ({ status: STATE.SUCCESS }))
                                                    .catch(err => ({
                                                        status: STATE.FAILED,
                                                        error: err
                                                    }))
                                            );
                                        });
                                    }
                                    if (deletePriceGroup.length > 0) {
                                        promises.push(module.exports.removePriceGroup(req, deletePriceGroup, deletePriceGroupDetail, t));
                                    }
                                    return Promise.all(promises).then((responses) => {
                                        var objresassy = _.find(responses, resassy => resassy.status === STATE.FAILED);
                                        var objresassymsg = _.find(responses, resassy => resassy.status === STATE.FAILED && resassy.msg);
                                        if (objresassymsg && objresassymsg.msg) {
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: objresassymsg.msg, err: null, data: null });
                                        }
                                        if (objresassy) {
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: objresassy.err, data: null });
                                        } else {
                                            const newPromises = [
                                                module.exports.manageAssyQuantity(req, updateAssembly, t),
                                                module.exports.manageAssyMiscBuild(req, updateAssembly, t)
                                            ];
                                            if (newPriceGroup.length > 0) {
                                                COMMON.setModelCreatedArrayFieldValue(req.user, newPriceGroup);
                                                newPromises.push(module.exports.addPriceGroup(req, newPriceGroup, t));
                                            }
                                            if (updatePriceGroup.length > 0) {
                                                newPromises.push(module.exports.managePriceGroup(req, updatePriceGroup, t));
                                            }
                                            return Promise.all(newPromises).then((respQty) => {
                                                var objresqty = _.find(respQty, rq => rq.status === STATE.FAILED);

                                                if (objresqty) {
                                                    if (!t.finished) { t.rollback(); }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                                } else if (respQty[0].data) {
                                                    const assyQty = respQty[0].data;
                                                    const newQtyTurnTime = [];
                                                    const updateQtyTurnTime = [];
                                                    const deleteQtyTurntime = [];

                                                    for (let i = 0; i < assyQty.length; i++) {
                                                        if (assyQty[i].deletedAssyQtyTurnTime.length > 0) {
                                                            _.each(assyQty[i].deletedAssyQtyTurnTime, (turnTime) => {
                                                                deleteQtyTurntime.push(turnTime.id);
                                                            });
                                                        }
                                                        if (assyQty[i].rfqAssyQtyTurnTime.length > 0) {
                                                            _.each(assyQty[i].rfqAssyQtyTurnTime, (turnTime) => {
                                                                turnTime.rfqAssyQtyID = assyQty[i].id;
                                                                if (turnTime.id) {
                                                                    updateQtyTurnTime.push(turnTime);
                                                                } else {
                                                                    newQtyTurnTime.push(turnTime);
                                                                }
                                                            });
                                                        }
                                                    }

                                                    const promicesQtyTurnTime = [];

                                                    if (deleteQtyTurntime.length) {
                                                        promicesQtyTurnTime.push(module.exports.removeAssyQtyTurnTime(req, deleteQtyTurntime, t));
                                                    }
                                                    if (newQtyTurnTime.length) {
                                                        COMMON.setModelCreatedArrayFieldValue(req.user, newQtyTurnTime);
                                                        promicesQtyTurnTime.push(module.exports.addAssyQtyTurnTime(req, newQtyTurnTime, t));
                                                    }
                                                    if (updateQtyTurnTime.length) {
                                                        COMMON.setModelUpdatedByArrayFieldValue(req.user, updateQtyTurnTime);
                                                        _.each(updateQtyTurnTime, (turnTime) => {
                                                            promicesQtyTurnTime.push(RFQAssyQuantityTurnTime.update(turnTime, {
                                                                fields: inputFieldsRFQAssyQtyTurnTime,
                                                                where: { id: turnTime.id },
                                                                transaction: t
                                                            }).then(() => ({
                                                                status: STATE.SUCCESS
                                                            })).catch(err => ({
                                                                status: STATE.FAILED,
                                                                error: err
                                                            })));
                                                        });
                                                    }

                                                    return Promise.all(promicesQtyTurnTime).then((respturntime) => {
                                                        var resObj = _.find(respturntime, rest => rest.status === STATE.FAILED);
                                                        if (resObj) {
                                                            if (!t.finished) { t.rollback(); }
                                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                                        } else if (respsAssyIDArray.length > 0) {
                                                            t.commit();
                                                            const rfqAssyIDs = respsAssyIDArray.join();
                                                            return sequelize.query('CALL Sproc_RemoveCostingOnJobTypeChange (:prfqAssyIDs,:pUserID,:pUserCurrentRoleID)', {
                                                                replacements: {
                                                                    prfqAssyIDs: rfqAssyIDs,
                                                                    pUserID: COMMON.getRequestUserID(),
                                                                    pUserCurrentRoleID: COMMON.getRequestUserLoginRoleID()
                                                                }
                                                            }).then(() => sequelize.query('CALL Sproc_CreateCostSummaryEntry (:prfqID,:pUserID,:pRoleID)', {
                                                                replacements: {
                                                                    prfqID: req.body.id,
                                                                    pUserID: COMMON.getRequestUserID(),
                                                                    pRoleID: COMMON.getRequestUserLoginRoleID()
                                                                },
                                                                type: sequelize.QueryTypes.SELECT
                                                            }).then(() => {
                                                                // Add/Update/Delete RFQ Details into Elastic Search Engine for Enterprise Search
                                                                req.params = {
                                                                    id: req.body.id
                                                                };
                                                                // Need to change timeout code due to trasaction not get updated record
                                                                setTimeout(() => {
                                                                    EnterpriseSearchController.manageRFQDetailInElastic(req);
                                                                }, 2000);

                                                                if (deleteAssembly.length > 0) {
                                                                    EnterpriseSearchController.deleteRFQDetailInElastic(deleteAssembly.toString());
                                                                }
                                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(rfqModuleName));
                                                            }).catch((err) => {
                                                                console.trace();
                                                                console.error(err);
                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                            })).catch((err) => {
                                                                console.trace();
                                                                console.error(err);
                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                            });
                                                        } else {
                                                            t.commit();
                                                            return sequelize.query('CALL Sproc_CreateCostSummaryEntry (:prfqID,:pUserID,:pRoleID)', {
                                                                replacements: {
                                                                    prfqID: req.body.id,
                                                                    pUserID: COMMON.getRequestUserID(),
                                                                    pRoleID: COMMON.getRequestUserLoginRoleID()
                                                                },
                                                                type: sequelize.QueryTypes.SELECT
                                                            }).then(() => {
                                                                // Add/Update/Delete RFQ Details into Elastic Search Engine for Enterprise Search
                                                                req.params = {
                                                                    id: req.body.id
                                                                };
                                                                // Need to change timeout code due to trasaction not get updated record
                                                                setTimeout(() => {
                                                                    EnterpriseSearchController.manageRFQDetailInElastic(req);
                                                                }, 2000);

                                                                if (deleteAssembly.length > 0) {
                                                                    EnterpriseSearchController.deleteRFQDetailInElastic(deleteAssembly.toString());
                                                                }
                                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(rfqModuleName));
                                                            }).catch((err) => {
                                                                console.trace();
                                                                console.error(err);
                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                            });
                                                        }
                                                        // }
                                                    });
                                                } else {
                                                    t.commit();
                                                    return sequelize.query('CALL Sproc_CreateCostSummaryEntry (:prfqID,:pUserID,:pRoleID)', {
                                                        replacements: {
                                                            prfqID: req.body.id,
                                                            pUserID: COMMON.getRequestUserID(),
                                                            pRoleID: COMMON.getRequestUserLoginRoleID()
                                                        },
                                                        type: sequelize.QueryTypes.SELECT
                                                    }).then(() => {
                                                        newrfqAssyIds = [];
                                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(rfqModuleName));
                                                    }).catch((err) => {
                                                        console.trace();
                                                        console.error(err);
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                    });
                                                }
                                                // }
                                            });
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    // if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                }));
                            }
                        });
                    }
                });
            } else {
                // Create
                COMMON.setModelCreatedByFieldValue(req);
                return sequelize.transaction().then((t) => {
                    req.body.isActive = 1;
                    return RFQForms.create(req.body, {
                        fields: inputFieldsRFQ,
                        transaction: t
                    }).then((rfq) => {
                        _.each(req.body.rfqAssembly, (item) => {
                            item.rfqrefID = rfq.id;
                            item.quoteNote = req.body.quoteNote;
                            item.active = 1;
                            item.assyNote = COMMON.setTextAngularValueForDB(item.assyNote);
                            item.additionalRequirement = COMMON.setTextAngularValueForDB(item.additionalRequirement);
                        });
                        COMMON.setModelCreatedArrayFieldValue(req.user, req.body.rfqAssembly);
                        return RFQAssemblies.bulkCreate(req.body.rfqAssembly, {
                            fields: inputFieldsRFQAssy,
                            transaction: t,
                            individualHooks: true
                        }).then((rfqAssy) => {
                            var rfqAssQty = [];
                            const rfqAssyIds = [];
                            var rfqAssMiscBuild = [];
                            for (let i = 0; i < req.body.rfqAssembly.length; i++) {
                                req.body.rfqAssembly[i].id = rfqAssy[i].id;
                                _.each(req.body.rfqAssembly[i].rfqAssyQuantity, (qty) => {
                                    qty.rfqAssyID = req.body.rfqAssembly[i].id;
                                    rfqAssQty.push(qty);
                                });
                                rfqAssyIds.push(rfqAssy[i].id);
                            }
                            for (let i = 0; i < req.body.rfqAssembly.length; i++) {
                                req.body.rfqAssembly[i].id = rfqAssy[i].id;
                                _.each(req.body.rfqAssembly[i].rfqAssyMiscBuild, (MiscBuild) => {
                                    MiscBuild.rfqAssyID = req.body.rfqAssembly[i].id;
                                    MiscBuild.createdBy = COMMON.getRequestUserID();
                                    MiscBuild.createByRoleId = COMMON.getRequestUserLoginRoleID();
                                    MiscBuild.createdAt = COMMON.getCurrentUTC();
                                    rfqAssMiscBuild.push(MiscBuild);
                                });
                            }

                            const promises = [];

                            COMMON.setModelCreatedArrayFieldValue(req.user, rfqAssQty);
                            promises.push(RFQAssyQuantity.bulkCreate(rfqAssQty, {
                                fields: inputFieldsRFQAssyQty,
                                transaction: t,
                                individualHooks: true
                            }).catch((err) => {
                                console.error(err);
                            })
                            );
                            promises.push(RFQAssyMiscBuild.bulkCreate(rfqAssMiscBuild, {
                                fields: inputFieldsRFQMiscBuild,
                                transaction: t
                            })
                            );

                            return Promise.all(promises).then((resp) => {
                                var rfqAssyQty = resp[0];
                                var assQtyTurntime = [];
                                for (let i = 0; i < rfqAssQty.length; i++) {
                                    rfqAssQty[i].id = rfqAssyQty[i].id;
                                    _.each(rfqAssQty[i].rfqAssyQtyTurnTime, (qtyturntime) => {
                                        qtyturntime.rfqAssyQtyID = rfqAssQty[i].id;
                                        assQtyTurntime.push(qtyturntime);
                                    });
                                }
                                if (assQtyTurntime.length > 0) {
                                    COMMON.setModelCreatedArrayFieldValue(req.user, assQtyTurntime);
                                    return RFQAssyQuantityTurnTime.bulkCreate(assQtyTurntime, {
                                        fields: inputFieldsRFQAssyQtyTurnTime,
                                        transaction: t
                                    }).then(() => {
                                        t.commit();
                                        return sequelize.query('CALL Sproc_CreateCostSummaryEntry (:prfqID,:pUserID,:pRoleID)', {
                                            replacements: {
                                                prfqID: rfq.id,
                                                pUserID: COMMON.getRequestUserID(),
                                                pRoleID: COMMON.getRequestUserLoginRoleID()
                                            },
                                            type: sequelize.QueryTypes.SELECT
                                        }).then(() => {
                                            req.params = {
                                                id: rfq.id
                                            };
                                            // Need to change timeout code due to trasaction not get updated record
                                            setTimeout(() => {
                                                EnterpriseSearchController.manageRFQDetailInElastic(req);
                                            }, 2000);

                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rfq, MESSAGE_CONSTANT.CREATED(rfqModuleName));
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                } else {
                                    t.commit();
                                    // Add RFQ Details into Elastic Search Engine for Enterprise Search
                                    req.params = {
                                        id: rfq.id
                                    };
                                    // Need to change timeout code due to trasaction not get updated record
                                    setTimeout(() => {
                                        EnterpriseSearchController.manageRFQDetailInElastic(req);
                                    }, 2000);
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rfq, MESSAGE_CONSTANT.CREATED(rfqModuleName));
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of RFQ
    // POST : /api/v1/rfqforms/retrieveRFQList
    // @return list of RFQ
    retrieveRFQList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_GetRFQList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pEmployeeID,:pCustomerIds,:pAssyTypeIds,:pRfqTypeIds,:pJobTypeIds,:pAssyIds,:pAssyNicknameIds,:pIsExportControlled,:pIsQuoteOverdue,:pIsSubAssemblyBOMs,:pIsPriceGroupQuoteAssembly,:pFromDate,:pToDate,:pOlderThenDays)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pEmployeeID: req.user.employeeID,
                    pCustomerIds: req.body.customerIds || null,
                    pAssyTypeIds: req.body.assyTypeIds || null,
                    pRfqTypeIds: req.body.rfqTypeIds || null,
                    pJobTypeIds: req.body.jobTypeIds || null,
                    pAssyIds: req.body.assyIds || null,
                    pAssyNicknameIds: req.body.assyNicknameIds || null,
                    pIsExportControlled: req.body.isExportControlled ? JSON.parse(req.body.isExportControlled) : false,
                    pIsQuoteOverdue: req.body.isQuoteOverdue ? JSON.parse(req.body.isQuoteOverdue) : false,
                    pIsSubAssemblyBOMs: req.body.isSubAssemblyBOMs ? JSON.parse(req.body.isSubAssemblyBOMs) : false,
                    pIsPriceGroupQuoteAssembly: req.body.isPriceGroupQuoteAssembly ? JSON.parse(req.body.isPriceGroupQuoteAssembly) : false,
                    pFromDate: req.body.fromDate ? req.body.fromDate : null,
                    pToDate: req.body.toDate ? req.body.toDate : null,
                    pOlderThenDays: req.body.olderThenDays ? req.body.olderThenDays : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { RFQ: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
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

    getRFQByID: (req, res) => {
        const { RFQForms, ComponentStandardDetails, Component, RFQAssemblies, RFQLineItems, RFQAssyQuantity, RFQAssyMiscBuild, RFQAssyQuantityTurnTime, StandardClass, CertificateStandards, RFQAssembliesQuotationSubmitted, RFQAssyStandardClassDetail, RFQPriceGroup, RFQPriceGroupDetail,ComponentBOMSetting, sequelize } = req.app.locals.models;
        if (req.params.id) {
            const promises = [];
            promises.push(
                RFQForms.findOne({
                    where: { id: req.params.id }

                })
            );
            promises.push(
                RFQAssemblies.findAll({
                    where: { rfqrefID: req.params.id },
                    attributes: ['id', 'rfqrefID', 'assyNote', 'assemblyDescription', 'RoHSStatusID', 'isRepeat', 'description', 'isReadyForPricing', 'isSummaryComplete', 'repeatExpectedQty', 'repeatFrequency', 'quotePriority', 'status', 'quoteFinalStatus', 'jobTypeID', 'RFQTypeID', 'partID', 'additionalRequirement', 'eau', 'proposedBuildQty', 'noOfBuild', 'timePeriod', 'quoteInDate', 'quoteDueDate', 'assemblyTypeID', 'laborType', 'quoteValidTillDate',
                        [sequelize.fn('fun_getBomProgressBar', sequelize.col('RFQAssemblies.partID')), 'bomProgress'],
                        [sequelize.fn('fun_getCustomPartProgress', sequelize.col('RFQAssemblies.id')), 'customPartProgress'],
                        [sequelize.fn('fun_getMaterialProgress', sequelize.col('RFQAssemblies.id')), 'materialProgress'],
                        [sequelize.fn('fun_getRfqLabourPercentage', sequelize.col('RFQAssemblies.id')), 'laborPercentage']],
                    include: [{
                        model: RFQAssembliesQuotationSubmitted,
                        as: 'rfqAssyQuoteSubmitted',
                        attributes: ['id', 'rfqAssyID', 'quoteNumber', 'quoteSubmitDate', 'bomLastVersion'],
                        include: [{
                            model: RFQAssyStandardClassDetail,
                            as: 'rfqAssyStandardClass',
                            attributes: ['id', 'standardID', 'standardClassIDs', 'refSubmittedQuoteID'],
                            include: [{
                                model: CertificateStandards,
                                as: 'certificateStandards',
                                order: [['displayOrder', 'ASC']],
                                attributes: ['certificateStandardID', 'fullName', 'shortName', 'displayOrder', 'isActive', 'priority', 'isRequired']
                            },
                            {
                                model: StandardClass,
                                as: 'standardClass',
                                attributes: ['certificateStandardID', 'classID', 'className', 'colorCode'],
                                required: false
                            }]
                        }]
                    }, {
                        model: RFQAssyQuantity,
                        as: 'rfqAssyQuantity',
                        attributes: ['id', 'rfqAssyID', 'requestQty', 'quantityType', 'rfqPriceGroupId', 'rfqPriceGroupDetailId'],
                        include: [{
                            model: RFQAssyQuantityTurnTime,
                            as: 'rfqAssyQtyTurnTime',
                            attributes: ['id', 'rfqAssyQtyID', 'turnTime', 'unitOfTime']
                        }, {
                            model: RFQPriceGroup,
                            as: 'rfqPriceGroup',
                            attributes: ['id', 'name'],
                            require: false
                        }]
                    }, {
                        model: RFQAssyMiscBuild,
                        as: 'rfqAssyMiscBuild',
                        attributes: ['id', 'rfqAssyID', 'proposedBuildQty', 'noOfBuild', 'buildDate']
                    }, {
                        model: Component,
                        as: 'componentAssembly',
                        attributes: ['id'],
                        include: [{
                            model: ComponentBOMSetting,
                            as: 'componentbomSetting',
                            attributes: ['refComponentID', 'liveVersion'],
                        },{
                            model: RFQLineItems,
                            as: 'rfqLineitems',
                            attributes: ['id', 'partID']
                        }, {
                            model: ComponentStandardDetails,
                            as: 'componetStandardDetail',
                            attributes: ['id', 'componentID', 'certificateStandardID', 'ClassID'],
                            include: [{
                                model: CertificateStandards,
                                as: 'certificateStandard',
                                order: [['displayOrder', 'ASC']],
                                attributes: ['certificateStandardID', 'fullName', 'shortName', 'displayOrder', 'isActive', 'priority', 'isRequired']
                            },
                            {
                                model: StandardClass,
                                as: 'Standardclass',
                                attributes: ['certificateStandardID', 'classID', 'className', 'colorCode'],
                                required: false
                            }]
                        }]
                    }]
                })
            );
            promises.push(
                RFQPriceGroup.findAll({
                    where: { refRFQID: req.params.id },
                    include: [{
                        model: RFQPriceGroupDetail,
                        as: 'rfqPriceGroupDetail',
                        require: false
                    }]
                })
            );
            return Promise.all(promises).then((responses) => {
                const rfqDetail = {};
                const rfq = responses[0];
                rfqDetail.rfqAssemblies = responses[1];
                rfqDetail.rfqPriceGroup = responses[2];
                if (!rfq) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
                rfq.quoteNote = COMMON.getTextAngularValueFromDB(rfq.quoteNote);
                _.each(rfqDetail.rfqAssemblies, (item) => {
                    item.assyNote = COMMON.getTextAngularValueFromDB(item.assyNote);
                    item.additionalRequirement = COMMON.getTextAngularValueFromDB(item.additionalRequirement);
                });
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { rfq: rfq, rfqDetail: rfqDetail }, null);
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

    // Remove RFQ by id
    // POST : /api/v1/rfqforms/deleteRFQ
    deleteRFQ: (req, res) => {
        const { sequelize } = req.app.locals.models;

        // Delete record of RFQ from Elastic Database
        EnterpriseSearchController.deleteRFQDetailInElastic(req.body.objIDs.id.toString());
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.RfqForms.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList || 0,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.DELETED(rfqModuleName) }, null);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: response, IDs: req.body.objIDs.id }, null);
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

    // delete rfqAssembly by Id
    // @param {req} obj
    // @param {assyArr} array
    // @param {assyQtyArry} array
    // @param {qtyTurnArry} array
    // @param {assyReqArry} array
    removeAssembly: (req, assyArr, assyQtyArry, qtyTurnArry, assyMiscBuild, t) => {
        const { RFQAssemblies } = req.app.locals.models;
        return RFQAssemblies.findOne({
            where: {
                id: assyArr,
                isReadyForPricing: true
            },
            attributes: ['id', 'isReadyForPricing']
        }).then((res) => {
            if (res) {
                return {
                    msg: Object.assign({}, MESSAGE_CONSTANT.RFQ.RFQ_DELETE_MESSAGE_API),
                    status: STATE.FAILED
                };
            } else {
                const promises = [
                    module.exports.removeAssyQuantity(req, assyQtyArry, qtyTurnArry, t),
                    module.exports.removeAssyMiscBuild(req, assyMiscBuild, t),
                    module.exports.removeAssyPriceGroupDetail(req, assyArr, t)
                ];

                return Promise.all(promises).then((responses) => {
                    var assyQtyResp = _.find(responses, x => x.status === STATE.FAILED);

                    if (assyQtyResp) {
                        return assyQtyResp;
                    } else {
                        return RFQAssemblies.update(
                            { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) },
                            {
                                where: { id: assyArr },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                transaction: t
                            }).then(() => ({
                                status: STATE.SUCCESS
                            }))
                            .catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    error: err
                                };
                            });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        error: err
                    };
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },

    // delete rfqPriceGroupDetail by assyId
    // @param {req} obj
    // @param {assyArr} array
    removeAssyPriceGroupDetail: (req, assyArr, t) => {
        const { RFQPriceGroupDetail } = req.app.locals.models;

        return RFQPriceGroupDetail.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
            where: {
                rfqAssyId: assyArr
            },
            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
            transaction: t
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },

    // delete rfqAssyQty by Id
    // @param {req} obj
    // @param {assyQtyArr} array
    // @param {qtyTurnArry} array
    removeAssyQuantity: (req, assyQtyArr, qtyTurnArry, t) => {
        const { RFQAssyQuantity } = req.app.locals.models;

        return module.exports.removeAssyQtyTurnTime(req, qtyTurnArry, t).then((response) => {
            if (response && response.status === STATE.SUCCESS) {
                return RFQAssyQuantity.update(
                    { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) },
                    {
                        where: { id: assyQtyArr },
                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                        transaction: t
                    }).then(() => ({
                        status: STATE.SUCCESS
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            error: err
                        };
                    });
            } else {
                return response;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },
    // delete rfqAssyMiscBuild by Id
    // @param {req} obj
    // @param {assyMiscBuldArr} array
    removeAssyMiscBuild: (req, assyMiscBuldArr, t) => {
        const { RFQAssyMiscBuild } = req.app.locals.models;

        return RFQAssyMiscBuild.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
            where: {
                id: assyMiscBuldArr
            },
            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
            transaction: t
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },

    // delete rfqAssyQtyTurnTime by Id
    // @param {req} obj
    // @param {turnTimeArr} array
    removeAssyQtyTurnTime: (req, turnTimeArr, t) => {
        const { RFQAssyQuantityTurnTime } = req.app.locals.models;
        return RFQAssyQuantityTurnTime.update(
            { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) },
            {
                where: { id: turnTimeArr },
                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                transaction: t
            }).then(() => ({
                status: STATE.SUCCESS
            })).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    error: err
                };
            });
    },

    // delete rfqPriceGroup by Id
    // @param {req} obj
    // @param {priceGroupArr} array
    // @param {priceGroupDetailArry} array
    removePriceGroup: (req, priceGroupArr, priceGroupDetailArry, t) => {
        const { RFQAssyQuantity, RFQAssyQuantityTurnTime, RFQPriceGroup } = req.app.locals.models;

        return RFQAssyQuantity.findAll({
            where: {
                rfqPriceGroupId: priceGroupArr
            },
            fields: ['id']
        }).then((resQty) => {
            const qtyArray = _.map(resQty, 'id');
            return RFQAssyQuantityTurnTime.findAll({
                where: {
                    rfqAssyQtyID: qtyArray
                },
                fields: ['id']
            }).then((resQtyTurnTime) => {
                const qtyTurnTimeArray = _.map(resQtyTurnTime, 'id');
                var promises = [
                    module.exports.removePriceGroupDetail(req, priceGroupDetailArry, t),
                    module.exports.removeAssyQuantity(req, qtyArray, qtyTurnTimeArray, t)
                ];

                return Promise.all(promises).then((responses) => {
                    var priceGroupDetailResp = responses[0];

                    if (priceGroupDetailResp && priceGroupDetailResp.status === STATE.FAILED) {
                        return priceGroupDetailResp;
                    } else {
                        return RFQPriceGroup.update({
                            isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        }, {
                            where: { id: priceGroupArr },
                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                            transaction: t
                        }).then(() => ({
                            status: STATE.SUCCESS
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED,
                                error: err
                            };
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        error: err
                    };
                });
            });
        });
    },

    // delete PriceGroupDetail by Id
    // @param {req} obj
    // @param {priceGroupDetailArr} array
    removePriceGroupDetail: (req, priceGroupDetailArr, t) => {
        const { RFQAssyQuantity, RFQAssyQuantityTurnTime, RFQPriceGroupDetail } = req.app.locals.models;

        return RFQAssyQuantity.findAll({
            where: { rfqPriceGroupDetailId: priceGroupDetailArr },
            attributes: ['id']
        }).then((resPriceGroupQty) => {
            const removeQtyPromises = [];
            const PriceGroupQtyIDs = _.map(resPriceGroupQty, 'id').join();
            removeQtyPromises.push(RFQAssyQuantityTurnTime.update({
                isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            }, {
                where: { rfqAssyQtyID:  _.map(resPriceGroupQty, 'id') },
                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                transaction: t
            }));
            removeQtyPromises.push(RFQAssyQuantity.update({
                isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            }, {
                where: { id:  _.map(resPriceGroupQty, 'id') },
                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                transaction: t
            }));
            removeQtyPromises.push(RFQPriceGroupDetail.update({
                isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            }, {
                where: { id: priceGroupDetailArr },
                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                transaction: t
            }));

            return Promise.all(removeQtyPromises).then(() => ({ status: STATE.SUCCESS }));
        });
    },

    // Add rfqAssembly
    // @param {req} obj
    // @param {assyArr} array
    // @param {t} transaction
    addAssembly: (req, assyArr, t) => {
        const { RFQAssemblies } = req.app.locals.models;

        return RFQAssemblies.bulkCreate(assyArr, {
            fields: inputFieldsRFQAssy,
            transaction: t,
            individualHooks: true
        }).then((assy) => {
            var rfqAssQty = [];
            var rfqAssMiscBuild = [];
            for (let i = 0; i < assyArr.length; i++) {
                assyArr[i].id = assy[i].id;
                _.each(assyArr[i].rfqAssyQuantity, (qty) => {
                    qty.rfqAssyID = assyArr[i].id;
                    rfqAssQty.push(qty);
                });
                _.each(assyArr[i].rfqAssyMiscBuild, (miscBuild) => {
                    miscBuild.rfqAssyID = assyArr[i].id;
                    miscBuild.createdBy = COMMON.getRequestUserID();
                    miscBuild.createByRoleId = COMMON.getRequestUserLoginRoleID();
                    miscBuild.createdAt = COMMON.getCurrentUTC();
                    rfqAssMiscBuild.push(miscBuild);
                });
                newrfqAssyIds.push(assyArr[i].id);
            }
            COMMON.setModelCreatedArrayFieldValue(req.user, rfqAssQty);
            const promises = [
                module.exports.addAssyQuantity(req, rfqAssQty, t),
                module.exports.addAssyMiscBuild(req, rfqAssMiscBuild, t)
            ];

            return Promise.all(promises).then((resp) => {
                var rfqAssyQty = resp[0];

                if (rfqAssyQty.status === STATE.SUCCESS) {
                    return rfqAssyQty;
                } else {
                    return rfqAssyQty;
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    err: err
                };
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                err: err
            };
        });
    },

    // Add rfqAssyQuantity
    // @param {req} obj
    // @param {assyQtyArr} array
    // @param {t} transaction
    addAssyQuantity: (req, assyQtyArr, t) => {
        const { RFQAssyQuantity } = req.app.locals.models;

        return RFQAssyQuantity.bulkCreate(assyQtyArr, {
            fields: inputFieldsRFQAssyQty,
            transaction: t,
            individualHooks: true
        }).then((assyQty) => {
            var qtyTurnArry = [];
            for (let i = 0; i < assyQtyArr.length; i++) {
                _.each(assyQtyArr[i].rfqAssyQtyTurnTime, (qtyTurn) => {
                    qtyTurn.rfqAssyQtyID = assyQty[i].id;
                    qtyTurnArry.push(qtyTurn);
                });
            }
            COMMON.setModelCreatedArrayFieldValue(req.user, qtyTurnArry);
            return module.exports.addAssyQtyTurnTime(req, qtyTurnArry, t).then((res) => {
                if (res.status === STATE.SUCCESS) {
                    return { data: assyQty, status: STATE.SUCCESS };
                } else {
                    return { status: STATE.FAILED, err: res.err };
                }
            }).catch(err => ({
                status: STATE.FAILED,
                err: err
            }));
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                err: err
            };
        });
    },

    // Add rfqAssyMiscBuild
    // @param {req} obj
    // @param {assyMiscBuildArr} array
    // @param {t} transaction
    addAssyMiscBuild: (req, assyMiscBuildArr, t) => {
        const { RFQAssyMiscBuild } = req.app.locals.models;

        return RFQAssyMiscBuild.bulkCreate(assyMiscBuildArr, {
            fields: inputFieldsRFQMiscBuild,
            transaction: t,
            individualHooks: true,
            updateOnDuplicate: ['id']
        }).then((assyMiscBuild) => {
            if (assyMiscBuild.length > 0) {
                return { data: assyMiscBuild, status: STATE.SUCCESS };
            } else {
                return { status: STATE.FAILED, err: assyMiscBuild.err };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                err: err
            };
        });
    },

    // Add rfqAssyQtyTurnTime
    // @param {req} obj
    // @param {assyQtyTurnTimeArr} array
    // @param {t} transaction
    addAssyQtyTurnTime: (req, assyQtyTurnTimeArr, t) => {
        const { RFQAssyQuantityTurnTime } = req.app.locals.models;

        return RFQAssyQuantityTurnTime.bulkCreate(assyQtyTurnTimeArr, {
            fields: inputFieldsRFQAssyQtyTurnTime,
            transaction: t
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },

    // Add rfqPriceGroup
    // @param {req} obj
    // @param {priceGroupArr} array
    // @param {t} transaction
    addPriceGroup: (req, priceGroupArr, t) => {
        const { RFQPriceGroup } = req.app.locals.models;

        return RFQPriceGroup.bulkCreate(priceGroupArr, {
            fields: inputFieldsRFQPriceGroup,
            transaction: t,
            individualHooks: true
        }).then((priceGroup) => {
            var rfqPriceGroupDetail = [];
            for (let i = 0; i < priceGroupArr.length; i++) {
                priceGroupArr[i].id = priceGroup[i].id;
                _.each(priceGroupArr[i].rfqPriceGroupDetail, (detail) => {
                    detail.rfqPriceGroupID = priceGroupArr[i].id;
                    if (detail.qty) { rfqPriceGroupDetail.push(detail); }
                });
            }
            COMMON.setModelCreatedArrayFieldValue(req.user, rfqPriceGroupDetail);
            const promises = [
                module.exports.addPriceGroupDetail(req, rfqPriceGroupDetail, t)
            ];

            return Promise.all(promises).then((resp) => {
                var rfqPriceGroupDetailRes = resp[0];

                if (rfqPriceGroupDetailRes.status === STATE.SUCCESS) {
                    return rfqPriceGroupDetailRes;
                } else {
                    return rfqPriceGroupDetailRes;
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    err: err
                };
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                err: err
            };
        });
    },

    // Add rfqPriceGroupDetail
    // @param {req} obj
    // @param {priceGroupDetailArr} array
    // @param {t} transaction
    addPriceGroupDetail: (req, priceGroupDetailArr, t) => {
        const { RFQPriceGroupDetail } = req.app.locals.models;

        return RFQPriceGroupDetail.bulkCreate(priceGroupDetailArr, {
            fields: inputFieldsRFQPriceGroupDetail,
            transaction: t,
            individualHooks: true
        }).then((resDetail) => {
            const assyQtyArr = [];

            _.each(resDetail, (objDetail) => {
                const turnTimeArry = objDetail.turnTime.toString().split(',');
                const rfqAssyQtyTurnTime = [];
                _.each(turnTimeArry, (turntime) => {
                    const objTurnTime = {};
                    objTurnTime.turnTime = parseInt(turntime);
                    objTurnTime.unitOfTime = objDetail.unitOfTime;
                    if (!_.isNaN(objTurnTime.turnTime)) { rfqAssyQtyTurnTime.push(objTurnTime); }
                });
                const objQty = {
                    rfqAssyID: objDetail.rfqAssyID,
                    requestQty: objDetail.qty,
                    quantityType: 2,
                    rfqAssyQtyTurnTime: rfqAssyQtyTurnTime,
                    rfqPriceGroupId: objDetail.rfqPriceGroupID,
                    rfqPriceGroupDetailId: objDetail.id
                };
                assyQtyArr.push(objQty);
            });
            COMMON.setModelCreatedArrayFieldValue(req.user, assyQtyArr);
            const promises = [
                module.exports.addAssyQuantity(req, assyQtyArr, t)
            ];
            return Promise.all(promises).then((resp) => {
                var rfqAssyQty = resp[0];
                if (rfqAssyQty.status === STATE.SUCCESS) {
                    return rfqAssyQty;
                } else {
                    return rfqAssyQty;
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    err: err
                };
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                err: err
            };
        });
    },

    // manage rfqAssyQuantity
    // @param {req} obj
    // @param {assyArry} array
    // @param {t} transaction
    manageAssyQuantity: (req, assyArry, t) => {
        const { RFQAssyQuantity, RFQConsolidatedMFGPNLineItemQuantity } = req.app.locals.models;
        var newAssyQty = [];
        var updateAssyQty = [];
        var deletedAssyQty = [];
        var deletedAssyQtyTurn = [];

        for (let i = 0; i < assyArry.length; i++) {
            if (assyArry[i].deletedAssyQty && assyArry[i].deletedAssyQty.length > 0) {
                _.each(assyArry[i].deletedAssyQty, (a) => {
                    _.each(a.rfqAssyQtyTurnTime, (tu) => {
                        deletedAssyQtyTurn.push(tu.id);
                    });
                    deletedAssyQty.push(a.id);
                });
            }

            _.each(assyArry[i].rfqAssyQuantity, (qty) => {
                qty.rfqAssyID = assyArry[i].id;
                if (qty.id) {
                    if (!qty.rfqPriceGroupId && !qty.rfqPriceGroupDetailId) { updateAssyQty.push(qty); }
                } else {
                    newAssyQty.push(qty);
                }
            });
        }

        const promiceQty = [];
        if (deletedAssyQty.length > 0) {
            promiceQty.push(module.exports.removeAssyQuantity(req, deletedAssyQty, deletedAssyQtyTurn, t));
        }
        if (newAssyQty.length > 0) {
            COMMON.setModelCreatedArrayFieldValue(req.user, newAssyQty);
            promiceQty.push(module.exports.addAssyQuantity(req, newAssyQty, t));
        }

        if (updateAssyQty.length > 0) {
            COMMON.setModelUpdatedByArrayFieldValue(req.user, updateAssyQty);
            _.each(updateAssyQty, (q) => {
                promiceQty.push(
                    RFQAssyQuantity.findOne({
                        where: {
                            id: q.id
                        },
                        fields: ['requestQty', 'quantityType']
                    }).then((res) => {
                        if (res) {
                            return RFQAssyQuantity.update(q, {
                                fields: inputFieldsRFQAssyQty,
                                where: { id: q.id },
                                transaction: t
                            }).then(() => {
                                if (res.requestQty !== q.requestQty) {
                                    const obj = {
                                        finalPrice: null,
                                        unitPrice: null,
                                        supplier: null,
                                        selectedMpn: null,
                                        selectionMode: null,
                                        min: null,
                                        mult: null,
                                        currentStock: null,
                                        leadTime: null,
                                        supplierStock: null,
                                        grossStock: null,
                                        pricingSuppliers: null,
                                        selectedPIDCode: null,
                                        LOAprice: null,
                                        isBomUpdate: false,
                                        availableInternalStock: null,
                                        availableInternalStockTimeStamp: null,
                                        pricenotselectreason: null,
                                        rfqQtySupplierID: null,
                                        quoteqty: null
                                    };
                                    return RFQConsolidatedMFGPNLineItemQuantity.update(obj, {
                                        where: {
                                            qtyID: q.id
                                        },
                                        transaction: t,
                                        fields: ['finalPrice', 'unitPrice', 'supplier', 'selectedMpn', 'selectionMode', 'min', 'mult', 'currentStock', 'leadTime', 'supplierStock', 'grossStock', 'pricingSuppliers', 'selectedPIDCode', 'LOAprice', 'isBomUpdate', 'availableInternalStock', 'availableInternalStockTimeStamp', 'pricenotselectreason', 'rfqQtySupplierID', 'quoteqty']
                                    }).then(() => ({
                                        status: STATE.SUCCESS
                                    })).catch(err => ({
                                        status: STATE.FAILED,
                                        error: err
                                    }));
                                } else {
                                    return {
                                        status: STATE.SUCCESS
                                    };
                                }
                            }).catch(err => ({
                                status: STATE.FAILED,
                                error: err
                            }));
                        } else {
                            return {
                                status: STATE.SUCCESS
                            };
                        }
                    })
                );
            });
        }

        return Promise.all(promiceQty).then((resp) => {
            var objresp = _.find(resp, r => r.status === STATE.FAILED);
            if (objresp) {
                return objresp;
            } else {
                return {
                    status: STATE.SUCCESS,
                    data: updateAssyQty
                };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                err: err
            };
        });
    },

    // manage rfqAssyMiscBuild
    // @param {req} obj
    // @param {assyArry} array
    // @param {t} transaction
    manageAssyMiscBuild: (req, assyArry, t) => {
        const { RFQAssyMiscBuild } = req.app.locals.models;
        var newAssyMiscBuild = [];
        var deletedAssyMiscBuild = [];
        var rfqAssyIDs = [];
        var updateAssyMiscBuild = [];
        const deleteMiscQty = [];
        for (let i = 0; i < assyArry.length; i++) {
            if (assyArry[i].rfqAssyMiscBuild && assyArry[i].rfqAssyMiscBuild.length > 0) {
                _.each(assyArry[i].rfqAssyMiscBuild, (miscBuild) => {
                    miscBuild.rfqAssyID = assyArry[i].id;
                    if (miscBuild.id) {
                        // const obj = {
                        //     id: miscBuild.id,
                        //     rfqAssyID: miscBuild.rfqAssyID
                        // };
                        deletedAssyMiscBuild.push(miscBuild.id);
                        updateAssyMiscBuild.push(miscBuild);
                    } else {
                        newAssyMiscBuild.push(miscBuild);
                    }
                });
                const obj = {
                    rfqAssyID: assyArry[i].id,
                    deleteMiscBuildID: deletedAssyMiscBuild
                };
                deleteMiscQty.push(obj);
            } else {
                rfqAssyIDs.push(assyArry[i].id);
            }
        }

        const promiceQty = [];
        if (deleteMiscQty.length > 0) {
            _.each(deleteMiscQty, (item) => {
                promiceQty.push(
                    RFQAssyMiscBuild.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                        where: {
                            id: { [Op.notIn]: item.deleteMiscBuildID },
                            rfqAssyID: item.rfqAssyID
                        },
                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                        transaction: t
                    })
                );
            });
        }
        if (rfqAssyIDs.length > 0) {
            promiceQty.push(
                RFQAssyMiscBuild.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                    where: {
                        rfqAssyId: rfqAssyIDs
                    },
                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                    transaction: t
                })
            );
        }

        if (updateAssyMiscBuild.length > 0) {
            _.each(updateAssyMiscBuild, (item) => {
                promiceQty.push(
                    RFQAssyMiscBuild.update(item, {
                        where: {
                            id: item.id
                        },
                        fields: inputFieldsRFQMiscBuild,
                        transaction: t
                    })
                );
            });
        }

        return Promise.all(promiceQty).then((resp) => {
            var objresp = _.find(resp, r => r.status === STATE.FAILED);
            if (objresp) {
                return objresp;
            } else {
                COMMON.setModelCreatedArrayFieldValue(req.user, newAssyMiscBuild);
                if (newAssyMiscBuild.length > 0) {
                    return module.exports.addAssyMiscBuild(req, newAssyMiscBuild, t);
                } else {
                    return {
                        status: STATE.SUCCESS
                    };
                }
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                err: err
            };
        });
    },

    // manage rfqPriceGroup
    // @param {req} obj
    // @param {assyArry} array
    // @param {t} transaction
    managePriceGroup: (req, priceGroupArry, t) => {
        const { RFQPriceGroup } = req.app.locals.models;
        var promicePriceGroup = [];
        _.each(priceGroupArry, (objPriceGroup) => {
            promicePriceGroup.push(
                RFQPriceGroup.update(objPriceGroup, {
                    fields: inputFieldsRFQPriceGroup,
                    where: { id: objPriceGroup.id },
                    transaction: t
                }).then(() => ({
                    status: STATE.SUCCESS
                })).catch(err => ({
                    status: STATE.FAILED,
                    error: err
                }))
            );
        });

        return Promise.all(promicePriceGroup).then((resp) => {
            var objresp = _.find(resp, r => r.status === STATE.FAILED);
            if (objresp) {
                return objresp;
            } else {
                const deletedPriceGroupDetail = [];
                const newPriceGroupDetail = [];
                const updatePriceGroupDetail = [];
                for (let i = 0; i < priceGroupArry.length; i++) {
                    if (priceGroupArry[i].deletedrfqPriceGroupDetail && priceGroupArry[i].deletedrfqPriceGroupDetail.length > 0) {
                        _.each(priceGroupArry[i].deletedrfqPriceGroupDetail, (objDetail) => {
                            if (objDetail.id) {
                                deletedPriceGroupDetail.push(objDetail.id);
                            }
                        });
                    }
                    _.each(priceGroupArry[i].rfqPriceGroupDetail, (objDetail) => {
                        if (objDetail.id && objDetail.qty) {
                            updatePriceGroupDetail.push(objDetail);
                        } else if (objDetail.id && !objDetail.qty) {
                            deletedPriceGroupDetail.push(objDetail.id);
                        } else if (objDetail.qty) {
                            newPriceGroupDetail.push(objDetail);
                        }
                    });
                }

                const promicePriceGroupDetail = [];
                if (deletedPriceGroupDetail.length > 0) {
                    promicePriceGroupDetail.push(module.exports.removePriceGroupDetail(req, deletedPriceGroupDetail, t));
                }
                if (newPriceGroupDetail.length > 0) {
                    COMMON.setModelCreatedArrayFieldValue(req.user, newPriceGroupDetail);
                    promicePriceGroupDetail.push(module.exports.addPriceGroupDetail(req, newPriceGroupDetail, t));
                }

                if (updatePriceGroupDetail.length > 0) {
                    COMMON.setModelUpdatedByArrayFieldValue(req.user, updatePriceGroupDetail);
                    promicePriceGroupDetail.push(module.exports.managePriceGroupDetail(req, updatePriceGroupDetail, t));
                }

                return Promise.all(promicePriceGroupDetail).then((respPriceGroup) => {
                    const objRespPriceGroup = _.find(respPriceGroup, r => r.status === STATE.FAILED);
                    if (objRespPriceGroup) {
                        return objRespPriceGroup;
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
                        err: err
                    };
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                err: err
            };
        });
    },

    // manage rfqPriceGroupDetail
    // @param {req} obj
    // @param {assyQtyArry} array
    // @param {t} transaction
    managePriceGroupDetail: (req, priceGroupDetailArry, t) => {
        const { RFQAssyQuantity, RFQAssyQuantityTurnTime, RFQPriceGroupDetail } = req.app.locals.models;

        var promicePriceGroupDetail = [];
        _.each(priceGroupDetailArry, (objDetail) => {
            promicePriceGroupDetail.push(
                RFQPriceGroupDetail.findOne({
                    where: { id: objDetail.id },
                    transaction: t
                }).then((resPriceDetail) => {
                    const updatePromise = [];
                    if (resPriceDetail.qty === objDetail.qty && resPriceDetail.turnTime === objDetail.turnTime && resPriceDetail.unitOfTime === objDetail.unitOfTime) {
                        return { status: STATE.SUCCESS };
                    }
                    if (resPriceDetail.qty === objDetail.qty && resPriceDetail.turnTime === objDetail.turnTime && resPriceDetail.unitOfTime !== objDetail.unitOfTime) {
                        updatePromise.push(RFQPriceGroupDetail.update(objDetail, {
                            fields: inputFieldsRFQPriceGroupDetail,
                            where: { id: objDetail.id },
                            transaction: t
                        }).then(() => RFQAssyQuantity.findOne({
                            where: {
                                rfqPriceGroupDetailId: objDetail.id,
                                rfqPriceGroupId: objDetail.rfqPriceGroupID
                            }
                        }).then((responseQty) => {
                            if (responseQty) {
                                const obj = {
                                    unitOfTime: objDetail.unitOfTime
                                };
                                COMMON.setModelUpdatedByObjectFieldValue(req.user, obj);
                                return RFQAssyQuantityTurnTime.update(obj, {
                                    where: {
                                        rfqAssyQtyID: responseQty.id
                                    }
                                }).then(() => ({
                                    status: STATE.SUCCESS
                                }));
                            } else {
                                return {
                                    status: STATE.SUCCESS
                                };
                            }
                        })).catch(err => ({
                            status: STATE.FAILED,
                            error: err
                        }))
                        );
                    }
                    if (resPriceDetail.qty === objDetail.qty && resPriceDetail.turnTime !== objDetail.turnTime && resPriceDetail.unitOfTime === objDetail.unitOfTime) {
                        updatePromise.push(RFQPriceGroupDetail.update(objDetail, {
                            fields: inputFieldsRFQPriceGroupDetail,
                            where: { id: objDetail.id },
                            transaction: t
                        }).then(() => RFQAssyQuantity.findOne({
                            where: {
                                rfqPriceGroupDetailId: objDetail.id,
                                rfqPriceGroupId: objDetail.rfqPriceGroupID
                            },
                            fields: ['id']
                        }).then((responseQty) => {
                            const rfqAssyQtyIDs = _.map(responseQty, 'id');
                            const turnTimePriomise = [];
                            const turnTimeArry = objDetail.turnTime.toString().split(',');
                            const rfqAssyQtyTurnTime = [];
                            _.each(turnTimeArry, (turntime) => {
                                const objTurnTime = {};
                                objTurnTime.rfqAssyQtyID = responseQty.id;
                                objTurnTime.turnTime = parseInt(turntime);
                                objTurnTime.unitOfTime = objDetail.unitOfTime;
                                if (!_.isNaN(objTurnTime.turnTime)) { rfqAssyQtyTurnTime.push(objTurnTime); }
                            });
                            turnTimePriomise.push(
                                RFQAssyQuantityTurnTime.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                                    where: { rfqAssyQtyID: rfqAssyQtyIDs },
                                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                    transaction: t
                                })
                            );

                            return Promise.all(turnTimePriomise).then(() => RFQAssyQuantityTurnTime.bulkCreate(rfqAssyQtyTurnTime, {
                                fields: inputFieldsRFQAssyQtyTurnTime,
                                transaction: t
                            }));
                        }).catch(err => ({
                            status: STATE.FAILED,
                            error: err
                        }))).catch(err => ({
                            status: STATE.FAILED,
                            error: err
                        }))
                        );
                    }
                    if (resPriceDetail.qty !== objDetail.qty && resPriceDetail.turnTime === objDetail.turnTime && resPriceDetail.unitOfTime === objDetail.unitOfTime) {
                        updatePromise.push(RFQPriceGroupDetail.update(objDetail, {
                            fields: inputFieldsRFQPriceGroupDetail,
                            where: { id: objDetail.id },
                            transaction: t
                        }).then(() => {
                            const obj = {
                                requestQty: objDetail.qty
                            };
                            COMMON.setModelUpdatedByObjectFieldValue(req.user, obj);
                            return RFQAssyQuantity.update(obj, {
                                where: {
                                    rfqPriceGroupDetailId: objDetail.id,
                                    rfqPriceGroupId: objDetail.rfqPriceGroupID
                                },
                                fields: ['requestQty', 'updatedBy', 'updatedAt', 'updateByRoleId']
                            }).then(() => ({
                                status: STATE.SUCCESS
                            })).catch(err => ({
                                status: STATE.FAILED,
                                error: err
                            }));
                        }).catch(err => ({
                            status: STATE.FAILED,
                            error: err
                        }))
                        );
                    }
                    if (resPriceDetail.qty !== objDetail.qty && resPriceDetail.turnTime !== objDetail.turnTime) {
                        updatePromise.push(RFQPriceGroupDetail.update(objDetail, {
                            fields: inputFieldsRFQPriceGroupDetail,
                            where: { id: objDetail.id },
                            transaction: t
                        }).then(() => {
                            const obj = {
                                requestQty: objDetail.qty
                            };
                            COMMON.setModelUpdatedByObjectFieldValue(req.user, obj);
                            return RFQAssyQuantity.update(obj, {
                                where: {
                                    rfqPriceGroupDetailId: objDetail.id,
                                    rfqPriceGroupId: objDetail.rfqPriceGroupID
                                },
                                fields: ['requestQty', 'updatedBy', 'updatedAt', 'updateByRoleId']
                            }).then(() => RFQAssyQuantity.findOne({
                                where: {
                                    rfqPriceGroupDetailId: objDetail.id,
                                    rfqPriceGroupId: objDetail.rfqPriceGroupID
                                },
                                fields: ['id']
                            }).then((responseQty) => {
                                const rfqAssyQtyIDs = _.map(responseQty, 'id');
                                const turnTimePriomise = [];
                                const turnTimeArry = objDetail.turnTime.toString().split(',');
                                const rfqAssyQtyTurnTime = [];
                                _.each(turnTimeArry, (turntime) => {
                                    const objTurnTime = {};
                                    objTurnTime.rfqAssyQtyID = responseQty.id;
                                    objTurnTime.turnTime = parseInt(turntime);
                                    objTurnTime.unitOfTime = objDetail.unitOfTime;
                                    if (!_.isNaN(objTurnTime.turnTime)) { rfqAssyQtyTurnTime.push(objTurnTime); }
                                });
                                turnTimePriomise.push(
                                    RFQAssyQuantityTurnTime.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                                        where: { rfqAssyQtyID: rfqAssyQtyIDs },
                                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                        transaction: t
                                    })
                                );

                                return Promise.all(turnTimePriomise).then(() => RFQAssyQuantityTurnTime.bulkCreate(rfqAssyQtyTurnTime, {
                                    fields: inputFieldsRFQAssyQtyTurnTime,
                                    transaction: t
                                }));
                            }).catch(err => ({
                                status: STATE.FAILED,
                                error: err
                            }))).catch(err => ({
                                status: STATE.FAILED,
                                error: err
                            }));
                        }).catch(err => ({
                            status: STATE.FAILED,
                            error: err
                        })));
                    }

                    return Promise.all(updatePromise).then((resp) => {
                        var objresp = _.find(resp, r => r.status === STATE.FAILED);
                        if (objresp) {
                            return objresp;
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
                            err: err
                        };
                    });
                })

            );
        });

        return Promise.all(promicePriceGroupDetail).then((resp) => {
            var objresp = _.find(resp, r => r.status === STATE.FAILED);
            if (objresp) {
                return objresp;
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
                err: err
            };
        });
    },

    // find Assembly with same Quantity
    // @param {req} obj
    // @param {assyArr} array
    findSameQtyAssy: (req, assyArry) => {
        const { Component, RFQAssemblies, RFQAssyQuantity } = req.app.locals.models;

        return RFQAssemblies.findAll({
            attributes: ['id', 'rfqrefID', 'assyNote', 'partID'],
            where: { rfqrefID: req.body.id },
            include: [{
                model: RFQAssyQuantity,
                as: 'rfqAssyQuantity',
                attributes: ['id', 'rfqAssyID', 'requestQty', 'rfqPriceGroupId', 'rfqPriceGroupDetailId']
            }, {
                model: Component,
                as: 'componentAssembly',
                attributes: ['PIDCode', 'id', 'rev', 'assyCode', 'nickName']
            }]
        }).then((assy) => {
            // eslint-disable-next-line consistent-return
            var NonDeletedAssy = _.filter(assy, (assyObj) => {
                var assyarryObj = _.filter(req.body.deletedAssembly, objdeletedAssy => objdeletedAssy.id && assyObj.id === objdeletedAssy.id);
                if (assyarryObj.length === 0) {
                    return true;
                }
            });
            if (NonDeletedAssy.length > 0) {
                // eslint-disable-next-line consistent-return
                const sameQtyAssy = _.filter(NonDeletedAssy, (assyObj) => {
                    var assembly = _.filter(assyArry, objAssy => objAssy.id === assyObj.id);
                    if (assembly.length > 0) {
                        // eslint-disable-next-line consistent-return
                        const NonDeletedAssyQty = _.filter(assyObj.rfqAssyQuantity, (assyQtyObj) => {
                            const assyQtyarryObj = _.filter(assembly[0].deletedAssyQty, objdeletedAssyQty => objdeletedAssyQty.id && assyQtyObj.id === objdeletedAssyQty.id);
                            if (assyQtyarryObj.length === 0) {
                                return true;
                            }
                        });
                        if (NonDeletedAssyQty.length > 0) {
                            // eslint-disable-next-line consistent-return
                            const sameassyqty = _.filter(NonDeletedAssyQty, (assyQtyObj) => {
                                if (!assyQtyObj.rfqPriceGroupId && !assyQtyObj.rfqPriceGroupDetailId) {
                                    // eslint-disable-next-line consistent-return
                                    const assemblyQty = _.filter(assembly[0].rfqAssyQuantity, (objAssyQty) => {
                                        if (!objAssyQty.rfqPriceGroupId && !objAssyQty.rfqPriceGroupDetailId) {
                                            if (assyQtyObj.id !== objAssyQty.id) {
                                                const newassyqtyobj = _.filter(NonDeletedAssyQty, obj => obj.id === objAssyQty.id);
                                                if (newassyqtyobj.length > 0) {
                                                    if (newassyqtyobj[0].requestQty === objAssyQty.requestQty) { return objAssyQty.requestQty === assyQtyObj.requestQty; } else { return newassyqtyobj[0].requestQty === assyQtyObj.requestQty; }
                                                } else {
                                                    return objAssyQty.requestQty === assyQtyObj.requestQty;
                                                }
                                            }
                                        }
                                    });
                                    if (assemblyQty.length > 0) { return true; }
                                }
                            });
                            if (sameassyqty.length > 0) { return true; }
                        } else {
                            return false;
                        }
                    }
                });
                if (sameQtyAssy.length > 0) {
                    const assyOBJ = _.filter(assyArry, obj => obj.id === sameQtyAssy[0].id);
                    const objIndex = `${assyOBJ[0].PIDCode}|${assyOBJ[0].rev}`;
                    return {
                        status: true,
                        index: objIndex
                    };
                } else {
                    return {
                        status: false
                    };
                }
            } else {
                return {
                    status: false
                };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },

    // Retrive list of RFQ Quote Group Number
    // POST : /api/v1/rfqforms/getQuoteNumberList
    // @return list of RFQ Quote Group Number
    getQuoteNumberList: (req, res) => {
        const { sequelize } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetRFQformsList (:pCustomerID,:pPartID)', {
            replacements: {
                pCustomerID: req.body.customerID,
                pPartID: req.body.partID
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // find Assembly with same Quantity
    // @param {req} obj
    // @param {assyArr} array
    findSameAssy: (req, assyArry) => {
        const { RFQAssemblies } = req.app.locals.models;

        return RFQAssemblies.findAll({
            attributes: ['id', 'rfqrefID', 'partID'],
            where: { rfqrefID: req.body.id }
        }).then((assy) => {
            // eslint-disable-next-line consistent-return
            var NonDeletedAssy = _.filter(assy, (assyObj) => {
                var assyarryObj = _.filter(req.body.deletedAssembly, objdeletedAssy => objdeletedAssy.id && assyObj.id === objdeletedAssy.id);
                if (assyarryObj.length === 0) {
                    return true;
                }
            });
            if (NonDeletedAssy.length > 0) {
                const sameAssy = _.filter(NonDeletedAssy, (assyObj) => {
                    // eslint-disable-next-line consistent-return
                    var assembly = _.filter(assyArry, (objAssy) => {
                        if (objAssy.id !== assyObj.id) {
                            const newassyobj = _.filter(NonDeletedAssy, obj => obj.id === objAssy.id);
                            if (newassyobj.length > 0) {
                                if (newassyobj[0].partID === objAssy.partID) { return objAssy.partID === assyObj.PartID; } else { return newassyobj[0].partID === assyObj.partID; }
                            } else {
                                return objAssy.partID === assyObj.partID;
                            }
                        }
                    });
                    if (assembly.length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (sameAssy.length > 0) {
                    const assyOBJ = _.filter(assyArry, obj => obj.partID === sameAssy[0].partID);
                    // const objIndex = assyArry.indexOf(assyOBJ[0]);
                    return {
                        status: true,
                        index: assyOBJ[0].PIDCode
                    };
                } else {
                    return {
                        status: false
                    };
                }
            } else {
                return {
                    status: false
                };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },
    // get rfq status change history
    // POST : /api/v1/rfqforms/getRfqListHistory/:id
    // @param {id} int
    // @return rfq status history
    getRfqListHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.id) {
            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') { strWhere = null; }
            return sequelize.query('CALL Sproc_GetRFQ_AssembliesHistory(:pRefRfqId,:ppageIndex,:precordPerPage,:pOrderBy, :pWhereClause)', {
                replacements: {
                    pRefRfqId: req.body.id,
                    ppageIndex: req.body.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { rfqHistory: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Retrive list of RFQ assembly
    // GET : /api/v1/rfqforms/getAllRFQList
    // @return list of RFQ
    getAllRFQList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        let whereClause = null;
        if (req.query.searchquery) {
            whereClause = req.query.searchquery;
        }
        sequelize.query('CALL Sproc_GetRFQassembltList (:pSearch)', {
            replacements: {
                pSearch: whereClause
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    getJobTypeChangeRFQAssyList: (req) => {
        const { RFQAssemblies } = req.app.locals.models;

        return RFQAssemblies.findAll({
            attributes: ['id', 'rfqrefID', 'partID', 'jobTypeID', 'isSummaryComplete'],
            where: {
                rfqrefID: req.body.id,
                isSummaryComplete: false
            }
        }).then((assy) => {
            const JobTypeChangeAssy = [];
            _.each(assy, (assyObj) => {
                var assyarryObj = _.find(req.body.rfqAssembly, objNewAssy => objNewAssy.id && assyObj.id === objNewAssy.id && assyObj.jobTypeID !== objNewAssy.jobTypeID);
                if (assyarryObj) {
                    JobTypeChangeAssy.push(assyarryObj.id);
                }
            });
            return JobTypeChangeAssy;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },

    // Check Unique rfqPriceGroup
    // GET : /api/v1/rfqforms/findSamePriceGroup
    // @return find Unique validation
    findSamePriceGroup: (req, res) => {
        const { RFQPriceGroup } = req.app.locals.models;
        var where = {};
        if (req.body.name) {
            where.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false);
            where.refRFQID = req.body.refRFQID;
        }

        if (req.body.id) { where.id = { [Op.ne]: req.body.id }; }

        return RFQPriceGroup.findOne({
            where: where,
            attributes: ['id', 'name']
        }).then((rfqPriceGroup) => {
            if (rfqPriceGroup) {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'Price group');
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    //  Download RFQ Price group Template
    // GET : /api/v1/rfqforms/downloadRFQPriceGroupTemplate
    downloadRFQPriceGroupTemplate: (req, res) => {
        const { sequelize } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetRFQPriceGroupExportTemplate (:pRFQID,:pisExportTemplate)', {
            replacements: {
                pRFQID: req.body.rfqID,
                pisExportTemplate: req.body.isExportTemplate
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            var rowData = response[0];
            var workbook1 = new Excel.Workbook();
            var sheet1 = workbook1.addWorksheet('Sheet1');
            sheet1.columns = [];
            let columns = [];
            _.each(rowData, (item) => {
                let keys = [];
                keys = Object.keys(item);
                _.each(keys, (key) => {
                    var header = key;
                    var width = 20;
                    if (key === 'priceGroup') {
                        header = DATA_CONSTANT.ExportPriceGroupHeader.PriceGroup;
                        width = 20;
                    }
                    if (key === 'assyID') {
                        header = DATA_CONSTANT.ExportPriceGroupHeader.AssyID;
                        width = 40;
                    }
                    if (key === 'qty') {
                        header = DATA_CONSTANT.ExportPriceGroupHeader.Qty;
                        width = 20;
                    }
                    if (key === 'turnTime') {
                        header = DATA_CONSTANT.ExportPriceGroupHeader.TurnTime;
                        width = 20;
                    }
                    if (key === 'unitOfTime') {
                        header = DATA_CONSTANT.ExportPriceGroupHeader.UnitOfTime;
                        width = 20;
                    }

                    const obj = { header: header, key: key, width: width };
                    columns.push(obj);
                });
            });
            columns = _.uniqBy(columns, e => e.header);
            sheet1.columns = columns;
            _.each(rowData, (item, i) => {
                if (parseInt(i) === 0 && req.body.isExportTemplate) {
                    item.turnTime = 'ex:5,10,20';
                    item.unitOfTime = 'ex: Business Days or Week or Weekdays';
                }
                sheet1.addRow(item);
            });

            const path = DATA_CONSTANT.GENERICCATEGORY.UPLOAD_PATH;
            mkdirp(path, () => { });
            const timespan = Date.now();
            const filename = `Quote Price Group${timespan}.xls`;
            res.setHeader('Content-Type', 'application/vnd.ms-excel');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            // entity=entity?entity:'error';

            workbook1.xlsx.writeFile(path + filename).then(() => {
                // let file = path + entity + ".xls";
                res.setHeader('Content-disposition', `attachment; filename=${filename}`);
                res.setHeader('Content-type', 'application/vnd.ms-excel');
                const filestream = fs.createReadStream(path + filename);
                fs.unlink(path + filename, () => { });
                filestream.pipe(res);
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get RFQ Progress Count
    // GET : /api/v1/rfqforms/getRFQProgressCount
    // @return RFQ Progress Count
    getRFQProgressCount: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        let query = `Select fun_getBomProgressBar(${req.query.partID}) bomProgress`;
        if (req.query.rfqAssyID) {
            query += `,fun_getCustomPartProgress(${req.query.rfqAssyID}) customPartProgress,fun_getMaterialProgress(${req.query.rfqAssyID}) materialProgress,fun_getRfqLabourPercentage(${req.query.rfqAssyID}) laborPercentage`;
        }
        return sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    }
};