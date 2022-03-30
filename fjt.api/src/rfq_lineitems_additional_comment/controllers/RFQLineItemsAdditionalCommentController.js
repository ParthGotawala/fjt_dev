const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const moduleName = DATA_CONSTANT.RFQ_LINEITEMS_ADDITIONAL_COMMENT.NAME;
const inputFields = [
    'id',
    'lineID',
    'description',
    'rfqLineItemID',
    'rfqAssyID',
    'partID',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt'
];
module.exports = {
    // get getRfqLineitems description
    // @param {req} obj
    // @return list of Description based on lineItem
    getRfqLineitemsdescription: (req, res) => {
        const { RFQLineitemsAdditionalComment, RFQLineItems, RFQLineitemsAlternatepart, PartSubAssyRelationship, Component } = req.app.locals.models;
        PartSubAssyRelationship.findAll({
            where: {
                partID: req.params.id
            },
            model: PartSubAssyRelationship,
            attributes: ['prPerPartID', 'level']
        }).then((asseblyList) => {
            if (asseblyList.length > 0) {
                const assyIds = _.map(asseblyList, data => data.prPerPartID);
                return RFQLineItems.findAll({
                    where: {
                        partID: {
                            [Op.in]: assyIds
                        }
                    },
                    attributes: ['id', 'partID', 'lineID', 'cust_lineID', 'qpa', 'refDesig', 'qpaDesignatorStep', 'description', 'lineMergeStep', 'custPN', 'customerRev', 'duplicateCPNStep', 'restrictCPNUseWithPermissionStep', 'restrictCPNUsePermanentlyStep', 'restrictCPNUseInBOMStep', 'requireMountingTypeStep', 'requireFunctionalTypeStep', 'customerApprovalForQPAREFDESStep', 'customerApprovalForBuyStep', 'customerApprovalForPopulateStep', 'requireMountingTypeError', 'requireFunctionalTypeError'],
                    include: [{
                        model: RFQLineitemsAdditionalComment,
                        as: 'rfqLineitemsAddtionalComment',
                        attributes: ['id', 'rfqLineItemID', 'lineID', 'description', 'rfqAssyID', 'partID']
                    }, {
                        model: Component,
                        as: 'component',
                        attributes: ['id', 'mfgPN', 'PIDcode']
                    }, {
                        model: RFQLineitemsAlternatepart,
                        as: 'rfqLineitemsAlternetpart',
                        attributes: ['id', 'description', 'mfgCode', 'mfgPN', 'rfqLineItemsID',
                            'distributor', 'distPN', 'mfgVerificationStep', 'mfgDistMappingStep',
                            'mfgCodeStep', 'distVerificationStep', 'distCodeStep', 'getMFGPNStep', 'nonRohsStep', 'epoxyStep', 'invalidConnectorTypeStep', 'mismatchNumberOfRowsStep', 'duplicateMPNInSameLineStep', 'mismatchFunctionalCategoryStep', 'mismatchMountingTypeStep', 'pickupPadRequiredStep', 'partPinIsLessthenBOMPinStep', 'tbdPartStep', 'exportControlledStep', 'mismatchCustomPartStep',
                            'obsoletePartStep', 'mfgPNStep', 'distPNStep', 'customerApproval', 'distGoodPartMappingStep', 'mfgGoodPartMappingStep', 'parttypeID', 'mountingtypeID', 'partcategoryID', 'partID',
                            'restrictUseWithPermissionStep', 'restrictUsePermanentlyStep', 'matingPartRquiredStep', 'driverToolsRequiredStep', 'functionalTestingRequiredStep', 'uomMismatchedStep', 'programingRequiredStep', 'mismatchColorStep', 'restrictUseInBOMStep', 'restrictUseInBOMWithPermissionStep', 'unknownPartStep', 'defaultInvalidMFRStep', 'suggestedGoodPartStep', 'suggestedGoodDistPartStep']
                    }]
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { asseblyList: asseblyList, response: response }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, [], null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // get getRfqLineitems copy description
    // @param {req} obj
    // @return list of Description based on lineItem
    getRfqLineItemsCopyDescription: (req, res) => {
        const { sequelize } = req.app.locals.models;
        var partId = req.body.partID;
        var externalIssue = req.body.externalIssue;
        return sequelize.query('CALL Sproc_GetBOMIssueDetailsForCopy (:pPartId, :pExternalIssue)', {
            replacements: {
                pPartId: partId,
                pExternalIssue: externalIssue
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Save RFQ Lineitem Additional Comment
    // Post : /api/v1/rfqlineitemsadditionalcomment/createRFQLineItemsDescription
    // @return API response
    createRFQLineItemsDescription: (req, res) => {
        const { RFQLineitemsAdditionalComment, sequelize } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);
        var newAddedList = [];
        var updateList = [];
        var allIDList = [];
        const BOMRemoveIDList = [];

        var partId = req.body.partID;
        var fromBOM = req.body.fromBOM;
        var lineitemsDescription = req.body.lineitemsDescription;

        sequelize.query('CALL Sproc_UpdatePartInternalVersion (:pPartId)', {
            replacements: {
                pPartId: partId
            }
        }).then(() => {
            lineitemsDescription.forEach((item) => {
                item.createdBy = userID;
                if (item.description) {
                    if (item.id) {
                        item.updatedBy = userID;
                        updateList.push(item);
                        allIDList.push(item.id);
                    } else {
                        newAddedList.push(item);
                    }
                } else if (fromBOM && item.id) {
                    BOMRemoveIDList.push(item.id);
                }
            });

            const promises = [];
            return sequelize.transaction().then((t) => {
                if (newAddedList.length) {
                    COMMON.setModelCreatedByFieldValue(req);
                    promises.push(RFQLineitemsAdditionalComment.bulkCreate(newAddedList, {
                        fields: inputFields,
                        transaction: t,
                        individualHooks: true
                    }));
                }

                if (updateList.length) {
                    _.each(updateList, (item) => {
                        promises.push(RFQLineitemsAdditionalComment.update(item, {
                            where: {
                                id: item.id
                            },
                            fields: inputFields,
                            transaction: t
                        }));
                    });
                }

                return Promise.all(promises).then((resp) => {
                    let newAddedListResp = [];
                    if (newAddedList.length) {
                        newAddedListResp = resp[0];
                        newAddedListResp.forEach((item) => {
                            allIDList.push(item.id);
                        });
                    }
                    if (!fromBOM || (BOMRemoveIDList.length > 0)) {
                        const whereClause = {
                            partID: partId
                        };
                        if (fromBOM) {
                            whereClause.id = { [Op.in]: BOMRemoveIDList.length === 0 ? [0] : BOMRemoveIDList };
                        } else {
                            whereClause.id = { [Op.notIn]: allIDList.length === 0 ? [0] : allIDList };
                        }
                        return RFQLineitemsAdditionalComment.update({
                            deletedBy: userID,
                            deletedAt: COMMON.getCurrentUTC(),
                            isDeleted: true,
                            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        }, {
                            where: whereClause,
                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                            transaction: t
                        }).then(() => {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, newAddedListResp, MESSAGE_CONSTANT.UPDATED(moduleName));
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        t.commit();
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, newAddedListResp, MESSAGE_CONSTANT.UPDATED(moduleName));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
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
    }
};