const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const moment = require('moment');
// const SalesOrderController = require('../../salesorder/controllers/SalesOrderController');
const { stringFormat } = require('../../constant/Common');
const { getSystemIdPromise } = require('../../utility/controllers/UtilityController');
// const e = require('express');
// const { sendWOChangeReqNewCommentAddedAck } = require('../../notificationmst/controllers/NotificationMstController');
// const { update } = require('lodash');

const inputFields = [
    'id',
    'customerID',
    'packingSlipType',
    'transType',
    'status',
    'refSalesOrderID',
    'poNumber',
    'poDate',
    'soNumber',
    'soDate',
    'packingSlipNumber',
    'packingSlipDate',
    'refEpicorePSNumber',
    'invoiceNumber',
    'invoiceDate',
    'isDeleted',
    'refEpicoreINVNumber',
    'shippingMethodId',
    'shipToId',
    'billToId',
    'contactPersonId',
    'packingSlipComment',
    'freeOnBoardId',
    'paymentNumber',
    'paymentDate',
    'paymentAmount',
    'sorevision',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'paymentStatus',
    'headerComment',
    'createByRoleId',
    'updateByRoleId',
    'intermediateShipmentId',
    'refCustInvoiceID',
    'bankName',
    'packingSlipStatus',
    'salesCommissionTo',
    'termsID',
    'systemID',
    'billingAddress',
    'shippingAddress',
    'intermediateAddress',
    'isLocked',
    'lockedBy',
    'lockedByRole',
    'lockedAt',
    'subStatus',
    'totalAmount',
    'revision',
    'isAlreadyPublished',
    'creditMemoNumber',
    'poRevision',
    'isAskForVersionConfirmation',
    'createdAt',
    'updatedAt',
    'carrierID',
    'carrierAccountNumber',
    'billingContactPersonID',
    'billingContactPerson',
    'shippingContactPersonID',
    'shippingContactPerson',
    'intermediateContactPersonID',
    'intermediateContactPerson'
];

const inputDetailsFields = [
    'id',
    'refCustPackingSlipID',
    'refSalesorderDetid',
    'partId',
    'custPOLineID',
    'poQty',
    'shipQty',
    'remainingQty',
    'shippedQty',
    'unitPrice',
    'shippingNotes',
    'whID',
    'binID',
    'shippingId',
    'reflineID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'otherCharges',
    'assyDescription',
    'lineID',
    'internalComment',
    'standrads',
    'extendedPrice',
    'componentStockType',
    'quoteNumber',
    'quoteFrom',
    'refAssyQtyTurnTimeID',
    'assyQtyTurnTimeText',
    'refRFQGroupID',
    'refRFQQtyTurnTimeID',
    'isZeroValue',
    'refCustPackingSlipDetID',
    'poReleaseNumber',
    'refBlanketPONumber',
    'releaseNotes'
];

const CustomerPackingSlipTrackNumberInputFields = ['id', 'refCustPackingSlipID', 'trackNumber', 'createdBy', 'createdAt', 'updatedBy',
    'updatedAt', 'deletedBy', 'deletedAt', 'isDeleted', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId'
];

const CustomerPackingSlipOtherExpenseInputField = [
    'id',
    'refCustomerPackingSlipDetID',
    'partID',
    'qty',
    'price',
    'lineComment',
    'lineInternalComment',
    'frequency',
    'frequencyType',
    'remark',
    'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deletedBy', 'deletedAt', 'isDeleted', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId'
];

const custPackingModuleName = DATA_CONSTANT.CUSTOMER_PACKING_SLIP.Name;
const custInvoiceModuleName = DATA_CONSTANT.CUSTOMER_INVOICE.Name;
const custCrNoteModuleName = DATA_CONSTANT.CUSTOMER_CREDITNOTE.Name;
const salesCommissionModuleName = DATA_CONSTANT.SALESCOMMISSION_DET.Name;
const custPackingDetModuleName = DATA_CONSTANT.CUSTOMER_PACKING_SLIP.DetName;
const custPackingSlipAndInvoiceModuleName = DATA_CONSTANT.CUSTOMER_PACKING_SLIP_AND_INVOICE_TRACKING_NUMBER.Name;

module.exports = {
    // POST list of pending Salesorder details
    // POST : /api/v1/getPendingSalsorderDetails
    // @param {text} int
    // @return list of pending salesorder list
    getPendingSalsorderDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetPendingSalesorderDetails (:psoposearch,:salesorderID)', {
                replacements: {
                    psoposearch: req.body.searchQuery || null,
                    salesorderID: req.body.salesorderID || null
                }
            }).then(salesorderList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, salesorderList, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // GET list of pending Salesorder shipping details
    // Get : /api/v1/getPendingSalesShippingDetails
    // @param {salesorderID} int
    // @return list of pending salesorder shipping list
    getPendingSalesShippingDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetPendingSalesShippingDetails (:psalesorderDetID,:packingSlipID,:ppackingslipDetID, :pSoReleaseID)', {
            replacements: {
                psalesorderDetID: req.body.salesorderID || null,
                packingSlipID: req.body.packingSlipID || null,
                ppackingslipDetID: req.body.packingslipDetID || null,
                pSoReleaseID: req.body.soReleaseID || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(shippingsalesorderList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { shippingsalesorderList: _.values(shippingsalesorderList[0]), otherCharges: _.values(shippingsalesorderList[1]) }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // GET list of pending customer Salesorder details
    // Get : /api/v1/getPendingCustomerSalesDetails
    // @param {salesorderID} int
    // @return list of pending salesorder list
    getPendingCustomerSalesDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetPendingCustomerSalesDetails (:psalesorderID,:packingSlipID)', {
            replacements: {
                psalesorderID: req.params.salesorderID || null,
                packingSlipID: req.params.packingSlipID || null
            }
        }).then(salesorderDetailList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, salesorderDetailList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // GET packing slip detail
    // GET : /api/v1/getPackingSlipDetailByID
    // @param {packingSlipID} int
    // @return detail of packing slip
    getPackingSlipDetailByID: (req, res) => {
        const {
            CustomerPackingSlip,
            MfgCodeMst,
            CustomerPackingSlipDet,
            CustomerPackingSlipTrackNumber,
            User,
            Employee,
            sequelize
        } = req.app.locals.models;
        if (req.params.id) {
            return CustomerPackingSlip.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                model: CustomerPackingSlip,
                attributes: ['id', 'customerID', 'packingSlipType', 'transType',
                    'status', 'refSalesOrderID', 'poNumber', 'poDate',
                    'soNumber', 'soDate', 'packingSlipNumber', 'packingSlipDate',
                    'refEpicorePSNumber',
                    'invoiceNumber', 'invoiceDate', 'isDeleted', 'refEpicoreINVNumber', 'shippingMethodId',
                    'shipToId', 'billToId', 'contactPersonId', 'packingSlipComment',
                    'freeOnBoardId', 'paymentNumber', 'paymentDate', 'paymentAmount', 'sorevision',
                    'createdBy', 'updatedBy', 'deletedBy', 'paymentStatus',
                    'headerComment', 'createByRoleId', 'updateByRoleId', 'intermediateShipmentId',
                    'refCustInvoiceID', 'bankName', 'packingSlipStatus', 'salesCommissionTo',
                    'termsID', 'systemID', 'billingAddress', 'shippingAddress',
                    'intermediateAddress', 'isLocked', 'lockedBy', 'lockedByRole',
                    'lockedAt', 'subStatus', 'totalAmount', 'revision',
                    'isAlreadyPublished', 'creditMemoNumber', 'poRevision', 'isAskForVersionConfirmation',
                    'createdAt', 'updatedAt', [sequelize.fn('fun_getPOTypeByID', sequelize.col('CustomerPackingSlip.refSalesOrderID')), 'poType'],
                    'carrierID', 'carrierAccountNumber',
                    'billingContactPersonID', 'billingContactPerson', 'shippingContactPersonID', 'shippingContactPerson', 'intermediateContactPersonID', 'intermediateContactPerson'
                ],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodeMst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgName', 'mfgCode'],
                    required: false
                }, {
                    model: CustomerPackingSlip,
                    as: 'customerInvoiceDetLst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'isLocked'],
                    required: false
                }, {
                    model: CustomerPackingSlip,
                    as: 'customerInvoiceDet',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'invoiceNumber', 'paymentStatus', 'subStatus'],
                    required: false
                }, {
                    model: CustomerPackingSlipDet,
                    as: 'customerPackingSlipDet',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'partId', 'poQty', 'shipQty', 'remainingQty', 'shippedQty', 'refSalesorderDetid', 'custPOLineID', 'reflineID', 'shippingId'],
                    required: false
                },
                {
                    model: CustomerPackingSlipTrackNumber,
                    as: 'customerPackingSlipTrackNumber',
                    attributes: ['id', 'trackNumber', 'refCustPackingSlipID'],
                    required: false
                },
                {
                    model: User,
                    as: 'lockEmployees',
                    attributes: ['userName'],
                    required: false,
                    include: [{
                        model: Employee,
                        as: 'employee',
                        attributes: ['initialName', 'firstName', 'lastName'],
                        required: false
                    }]
                },
                {
                    model: User,
                    as: 'createdEmployee',
                    attributes: ['userName', 'employeeID'],
                    required: false,
                    include: [{
                        model: Employee,
                        as: 'employee',
                        attributes: ['initialName', 'firstName', 'lastName'],
                        required: false
                    }]
                },
                {
                    model: User,
                    as: 'updatedEmployee',
                    attributes: ['userName', 'employeeID'],
                    required: false,
                    include: [{
                        model: Employee,
                        as: 'employee',
                        attributes: ['initialName', 'firstName', 'lastName'],
                        required: false
                    }]
                }
                ]
            }).then((packingSlip) => {
                if (!packingSlip) {
                    let moduleName;
                    if (req.params.transType === 'I') {
                        moduleName = custInvoiceModuleName;
                    } else if (req.params.transType === 'P') {
                        moduleName = custPackingModuleName;
                    } else if (req.params.transType === 'C') {
                        moduleName = custCrNoteModuleName;
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                        err: null,
                        data: null
                    });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlip, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // GET Customer packing slip number based on packing slip number
    // POST : /api/v1/getCustomerPackingSlipNumber
    // @return latest packing slip available number
    getCustomerPackingSlipNumber: (req, res, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const objResponse = {};
            return sequelize.query('CALL Sproc_GetCustomerPackingSlipFormat (:ppackingSlipDate,:ppackingSlipNumberPrefix)', {
                replacements: {
                    ppackingSlipDate: req.body.packingSlipDate,
                    ppackingSlipNumberPrefix: COMMON.PrefixForGeneratePackingSlip.CustomerPackingSlip
                },
                transaction: t
            }).then((packingSlipDetails) => {
                if (packingSlipDetails && packingSlipDetails.length > 0 && packingSlipDetails[0].pdateformat) {
                    req.body.packingSlipNumber = moment(req.body.packingSlipDate).format(packingSlipDetails[0].pdateformat);
                    COMMON.setCustomerPackingSlip(req, (packingSlipDetails[0].maxPackingID + 1)); // set packing slip number format
                    if (req.body.isFromSave) {
                        objResponse.packingSlipNumber = req.body.packingSlipNumber;
                        return objResponse;
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body.packingSlipNumber, null);
                    }
                } else if (!req.body.isFromSave) {
                    if (t && !t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(custPackingModuleName), err: null, data: null });
                } else {
                    return objResponse;
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (req.body.isFromSave) { return objResponse; }
                if (t && !t.finished) { t.rollback(); }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // POST save customer packing slip details
    // POST : /api/v1/saveCustomerPackingSlip
    // @return saved details of customer packing slip
    saveCustomerPackingSlip: (req, res) => {
        const {
            sequelize,
            CustomerPackingSlip, Identity
        } = req.app.locals.models;
        if (req.body) {
            req.body.isFromSave = true;
            return sequelize.transaction().then(t => module.exports.getCustomerPackingSlipNumber(req, res, t).then((response) => {
                const promises = [];
                if (response && response.packingSlipNumber) {
                    req.body.packingSlipNumber = response.packingSlipNumber;
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(custPackingModuleName), err: null, data: null });
                }
                promises.push(getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.CustomerPackingSlipSystemID, t));
                return Promise.all(promises).then((respOfPromises) => {
                    if (respOfPromises && respOfPromises.length > 0) {
                        const respOfSystemID = respOfPromises[0];
                        if (respOfSystemID.status === STATE.SUCCESS) {
                            req.body.systemID = respOfSystemID.systemId;
                            COMMON.setModelCreatedByFieldValue(req);
                            if (req.body.revision < 10) {
                                req.body.revision = COMMON.stringFormat('0{0}', parseInt(req.body.revision));
                            }
                            return CustomerPackingSlip.create(req.body, {
                                fields: inputFields,
                                transaction: t
                            }).then((packingSlip) => {
                                const requiredDetForTrackingNumber = {
                                    packingSlipMasterID: packingSlip.id
                                };
                                return module.exports.addUpdatePackingSlipTrackingNumber(req, requiredDetForTrackingNumber, t).then((respTrack) => {
                                    if (respTrack && respTrack.status === STATE.SUCCESS) {
                                        // update max identity value for CustomerPackingSlipSystemID
                                        const updateIdentityObj = {
                                            maxValue: respOfSystemID.newMaxValue
                                        };
                                        COMMON.setModelUpdatedByObjectFieldValue(req.user, updateIdentityObj);
                                        return Identity.update(updateIdentityObj, {
                                            where: {
                                                type: DATA_CONSTANT.IDENTITY.CustomerPackingSlipSystemID
                                            },
                                            attributes: ['maxValue', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                            transaction: t
                                        }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlip, MESSAGE_CONSTANT.CREATED(custPackingModuleName)))).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                    } else {
                                        if (!t.finished) { t.rollback(); }
                                        if (respTrack.err.parent.sqlState === '23000') {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Tracking#'), err: null, data: null });
                                        } else {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: respTrack ? respTrack.err : null,
                                                data: null
                                            });
                                        }
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err.errors.map(e => e.message).join(','),
                                        data: null
                                    });
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        } else {
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: null,
                                data: null
                            });
                        }
                    } else {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) { t.rollback(); }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // to be called in promise from API only
    // get/set max systemID for packing slip generate
    getLatestSystemIDForPackingSlipPromise: (req, res) => {
        const { Identity } = req.app.locals.models;
        return Identity.findOne({
            where: {
                type: DATA_CONSTANT.IDENTITY.CustomerPackingSlipSystemID
            }
        }).then((identityDBDet) => {
            if (!identityDBDet) {
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                };
            } else {
                return {
                    status: STATE.SUCCESS,
                    newMaxValue: identityDBDet.maxValue + 1,
                    newSystemID: COMMON.stringFormat('{0}{1}', identityDBDet.prefix, (identityDBDet.maxValue + 1).toString().padStart(9, '0'))
                };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // POST update customer packing slip details
    // POST : /api/v1/updateCustomerPackingSlip
    // @return updated details of customer packing slip
    updateCustomerPackingSlip: (req, res) => {
        const {
            sequelize,
            CustomerPackingSlip
        } = req.app.locals.models;
        if (req.body) {
            return CustomerPackingSlip.findOne({
                where: {
                    id: req.body.id,
                    isDeleted: false
                },
                model: CustomerPackingSlip,
                attributes: ['id', 'packingSlipNumber', 'packingSlipDate',
                    [sequelize.fn('DATE_FORMAT', sequelize.col('packingSlipDate'), '%Y-%m-%d'), 'packingSlipConvertedDate']]
            }).then((response) => {
                req.body.isFromSave = true;
                const convValueDate = response.dataValues.packingSlipConvertedDate;
                if (response && (response.packingSlipNumber !== req.body.packingSlipNumber || convValueDate !== moment(req.body.packingSlipDate).format('YYYY-MM-DD'))) {
                    return sequelize.transaction().then(t => module.exports.getCustomerPackingSlipNumber(req, res, t).then((resPackingSlip) => {
                        if (resPackingSlip && resPackingSlip.packingSlipNumber) {
                            req.body.packingSlipNumber = resPackingSlip.packingSlipNumber;
                            COMMON.setModelUpdatedByFieldValue(req); // set createdby,upadtedby value
                            if (req.body.revision < 10) {
                                req.body.revision = COMMON.stringFormat('0{0}', parseInt(req.body.revision));
                            }
                            return CustomerPackingSlip.update(req.body, {
                                where: {
                                    id: req.body.id,
                                    isDeleted: false
                                },
                                fields: inputFields,
                                transaction: t
                            }).then((packingSlip) => {
                                const requiredDetForTrackingNumber = {
                                    packingSlipMasterID: req.body.id
                                };
                                return module.exports.addUpdatePackingSlipTrackingNumber(req, requiredDetForTrackingNumber, t).then(() => {
                                    const promiseUpdateInvoice = [];
                                    if (req.body.refInvoiceId) {
                                        const requiredDetForTrackingNumberPackingSlip = {
                                            packingSlipMasterID: req.body.refInvoiceId,
                                            isFromPackingSlipToInv: true
                                        };
                                        promiseUpdateInvoice.push(module.exports.addUpdatePackingSlipTrackingNumber(req, requiredDetForTrackingNumberPackingSlip, t));
                                    }
                                    return Promise.all(promiseUpdateInvoice).then((resPromis) => {
                                        if (promiseUpdateInvoice && promiseUpdateInvoice.length === 0) {
                                            return t.commit().then(() => {
                                                req.params = {
                                                    id: req.body.id,
                                                    detID: null
                                                };
                                                EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlip, MESSAGE_CONSTANT.UPDATED(custPackingModuleName));
                                            });
                                        } else if (resPromis && resPromis.length > 0) {
                                            const faileResp = _.find(resPromis, item => item.status === STATE.FAILED);
                                            if (faileResp) {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                if (faileResp.err.parent.sqlState === '23000') {
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Tracking#'), err: null, data: null });
                                                } else {
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: faileResp.err, data: null
                                                    });
                                                }
                                            } else {
                                                return t.commit().then(() => {
                                                    req.params = {
                                                        id: req.body.id,
                                                        detID: null
                                                    };
                                                    EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlip, MESSAGE_CONSTANT.UPDATED(custPackingModuleName));
                                                });
                                            }
                                        } else {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null
                                            });
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err.errors.map(e => e.message).join(','),
                                        data: null
                                    });
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        } else {
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(custPackingModuleName), err: null, data: null });
                        }
                    }));
                } else {
                    COMMON.setModelUpdatedByFieldValue(req); // set createdby,upadtedby value
                    if (req.body.revision < 10) {
                        req.body.revision = COMMON.stringFormat('0{0}', parseInt(req.body.revision));
                    }
                    return sequelize.transaction().then(t => CustomerPackingSlip.update(req.body, {
                        where: {
                            id: req.body.id,
                            isDeleted: false
                        },
                        fields: inputFields,
                        transaction: t
                    }).then((packingSlip) => {
                        const requiredDetForTrackingNumber = {
                            packingSlipMasterID: req.body.id
                        };
                        return module.exports.addUpdatePackingSlipTrackingNumber(req, requiredDetForTrackingNumber, t).then((resTrack) => {
                            if (resTrack && resTrack.status === STATE.SUCCESS) {
                                const promiseUpdateInvoice = [];
                                if (req.body.refInvoiceId) {
                                    const requiredDetForTrackingNumberPackingSlip = {
                                        packingSlipMasterID: req.body.refInvoiceId,
                                        isFromPackingSlipToInv: true
                                    };
                                    promiseUpdateInvoice.push(module.exports.addUpdatePackingSlipTrackingNumber(req, requiredDetForTrackingNumberPackingSlip, t));
                                }
                                return Promise.all(promiseUpdateInvoice).then((resPromise) => {
                                    if (promiseUpdateInvoice && promiseUpdateInvoice.length === 0) {
                                        return t.commit().then(() => {
                                            req.params = {
                                                id: req.body.id,
                                                detID: null
                                            };
                                            EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlip, MESSAGE_CONSTANT.UPDATED(custPackingModuleName));
                                        });
                                    } else if (resPromise && resPromise.length > 0) {
                                        const failResp = _.find(resPromise, item => item.status === STATE.FAILED);
                                        if (failResp) {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            if (failResp.err.parent.sqlState === '23000') {
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Tracking#'), err: null, data: null });
                                            } else {
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failResp ? failResp.err : null, data: null });
                                            }
                                        } else {
                                            return t.commit().then(() => {
                                                req.params = {
                                                    id: req.body.id,
                                                    detID: null
                                                };
                                                EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlip, MESSAGE_CONSTANT.UPDATED(custPackingModuleName));
                                            });
                                        }
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: resPromise ? resPromise.err : null, data: null });
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                if (resTrack.err.parent.sqlState === '23000') {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Tracking#'), err: null, data: null });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: resTrack ? resTrack.err : null, data: null });
                                }
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
                        if (!t.finished) { t.rollback(); }
                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err.errors.map(e => e.message).join(','),
                                data: null
                            });
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    }));
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // add/update/delete customer packing slip tracking numbers
    addUpdatePackingSlipTrackingNumber: (req, requiredDetForTrackingNumber, t) => {
        const { CustomerPackingSlipTrackNumber } = req.app.locals.models;
        const promises = [];
        let addNewTrackingNumberList;
        // case : Add Invoice from  packing slip but before save add new tracking number in invoice page
        // isFromInvToPackingSlip to update new tracking number added from invoice other than packing slip tracking number
        // isFromPackingSlipToInv to update new tracking number added from packing slip other than packing slip tracking number
        if (requiredDetForTrackingNumber && requiredDetForTrackingNumber.isFromInvToPackingSlip) {
            addNewTrackingNumberList = _.filter(req.body.trackingNumberList, item => !item.id && item.isNewFromInv);
        } else if (requiredDetForTrackingNumber && requiredDetForTrackingNumber.isFromPackingSlipToInv) {
            addNewTrackingNumberList = _.filter(req.body.trackingNumberList, item => !item.id && item.isNewFromPacingSlip);
        } else {
            addNewTrackingNumberList = _.filter(req.body.trackingNumberList, item => !item.id);
        }

        const updateExistingTrackingNumberList = _.filter(req.body.trackingNumberList, item => item.id > 0 && item.isRequiredToUpdate);

        _.each(addNewTrackingNumberList, (addItem) => {
            COMMON.setModelCreatedObjectFieldValue(req.user, addItem);
            addItem.refCustPackingSlipID = requiredDetForTrackingNumber.packingSlipMasterID;
            promises.push(
                CustomerPackingSlipTrackNumber.create(addItem, {
                    fields: CustomerPackingSlipTrackNumberInputFields,
                    transaction: t
                })
            );
        });

        _.each(updateExistingTrackingNumberList, (updateItem) => {
            COMMON.setModelUpdatedByObjectFieldValue(req.user, updateItem);
            promises.push(
                CustomerPackingSlipTrackNumber.update(updateItem, {
                    where: {
                        id: updateItem.id
                    },
                    fields: ['trackNumber', 'updatedBy', 'updateByRoleId'],
                    transaction: t
                })
            );
            // added to  update packing slip same as invoice
            if (updateItem.oldTrackNumber) {
                promises.push(
                    CustomerPackingSlipTrackNumber.update(updateItem, {
                        where: {
                            trackNumber: updateItem.oldTrackNumber,
                            refCustPackingSlipID: requiredDetForTrackingNumber.packingSlipMasterID
                        },
                        fields: ['trackNumber', 'updatedBy', 'updateByRoleId'],
                        transaction: t
                    })
                );
            }
        });

        if (req.body.removeTrackingNumberIds && req.body.removeTrackingNumberIds.length > 0) {
            const objDeleteTrackNumber = {};
            COMMON.setModelDeletedByObjectFieldValue(req.user, objDeleteTrackNumber);
            promises.push(
                CustomerPackingSlipTrackNumber.update(objDeleteTrackNumber, {
                    where: {
                        id: {
                            [Op.in]: req.body.removeTrackingNumberIds
                        }
                    },
                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
                    transaction: t
                })
            );
            // added to give effect of deleted
            if (req.body.removeInvoiceTrackingNumbers) {
                promises.push(
                    CustomerPackingSlipTrackNumber.update(objDeleteTrackNumber, {
                        where: {
                            trackNumber: {
                                [Op.in]: req.body.removeInvoiceTrackingNumbers
                            },
                            refCustPackingSlipID: requiredDetForTrackingNumber.packingSlipMasterID
                        },
                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
                        transaction: t
                    })
                );
            }
        }
        return Promise.all(promises).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            if (t.finished) { t.rollback(); }
            return { status: STATE.FAILED, err: err };
        });
    },

    // POST save customer packing details
    // POST : /api/v1/saveCustomerPackingSlipShippingDeatils
    // @return saved dcustomer packing slip shipping details
    saveCustomerPackingSlipShippingDeatils: (req, res) => {
        const { sequelize, CustomerPackingSlipDet, CustomerPackingSlip } = req.app.locals.models;
        let genePromises = [];
        if (req.body) {
            const where = {
                refCustPackingSlipID: req.body.refCustPackingSlipID,
                isDeleted: false
            };
            if (req.body.shippingId) {
                where.shippingId = req.body.shippingId;
            }
            if (req.body.id) {
                where.id = req.body.id;
            } else if (parseInt(req.body.packingSlipType) === DATA_CONSTANT.PACKING_SLIP_TYPE.PO && req.body.refSalesorderDetid) {
                where.refSalesorderDetid = req.body.refSalesorderDetid;
            } else {
                where.partId = req.body.partId;
                if (req.body.custPOLineID) {
                    where.custPOLineID = req.body.custPOLineID;
                }
            }
            return CustomerPackingSlipDet.findOne({
                where: where,
                model: CustomerPackingSlipDet,
                attributes: ['id', 'refCustPackingSlipID', 'otherCharges']
            }).then((packingSlip) => {
                if (packingSlip && packingSlip.id) {  // update case
                    COMMON.setModelUpdatedByFieldValue(req);
                    return sequelize.transaction().then(t => CustomerPackingSlipDet.update(req.body, {
                        where: {
                            id: packingSlip.id,
                            isDeleted: false
                        },
                        fields: ['poQty', 'shipQty', 'remainingQty', 'shippedQty', 'unitPrice', 'shippingNotes', 'shippingId',
                            'otherCharges', 'assyDescription', 'custPOLineID', 'internalComment', 'standrads', 'componentStockType',
                            'unitPrice', 'extendedPrice', 'reflineID', 'quoteNumber', 'quoteFrom', 'refAssyQtyTurnTimeID', 'assyQtyTurnTimeText',
                            'refRFQGroupID', 'refRFQQtyTurnTimeID', 'isZeroValue', 'releaseNotes', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                        transaction: t
                    }).then((packingSlipshipping) => {
                        if ((req.body.shippedAssemblyList && req.body.shippedAssemblyList.length > 0) || (req.body.shippedComponentList && req.body.shippedComponentList.length > 0)) {
                            return module.exports.saveShippedAssemblyDeatils(req, packingSlip.id, t).then((respOfShipAssyList) => {
                                if (!respOfShipAssyList || respOfShipAssyList.status !== STATE.SUCCESS
                                    || !respOfShipAssyList.respOfShipList || respOfShipAssyList.respOfShipList.length === 0 || (_.first(_.values(respOfShipAssyList.respOfShipList[0]))).spStatus !== 1) {
                                    t.rollback();
                                    const respOfShippedAssyList = respOfShipAssyList.respOfShipList;
                                    const respOfNotAvailableQtyShipList = _.values(respOfShippedAssyList[1]);
                                    const respOfUMIDKitConfmRequireShipList = _.values(respOfShippedAssyList[2]);

                                    if (respOfNotAvailableQtyShipList && respOfNotAvailableQtyShipList.length > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                notAvailableQtyShipList: respOfNotAvailableQtyShipList
                                            }
                                        });
                                    } else if (respOfUMIDKitConfmRequireShipList && respOfUMIDKitConfmRequireShipList.length > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                UMIDKitConfmRequireShipList: respOfUMIDKitConfmRequireShipList
                                            }
                                        });
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                    }
                                }
                                // update ship address and method
                                if (req.body.isSetPackingSlipAddrMethodAsPerShipDet) {
                                    const objUpdatePackingSlipAddrMethod = {
                                        shippingMethodId: req.body.shippingMethodID,
                                        shipToId: req.body.shippingAddressID,
                                        shippingAddress: req.body.shippingAddress,
                                        carrierID: req.body.carrierID,
                                        carrierAccountNumber: req.body.carrierAccountNumber
                                    };
                                    COMMON.setModelUpdatedByObjectFieldValue(req.user, objUpdatePackingSlipAddrMethod);
                                    genePromises.push(
                                        CustomerPackingSlip.update(objUpdatePackingSlipAddrMethod, {
                                            where: {
                                                id: req.body.refCustPackingSlipID,
                                                isDeleted: false
                                            },
                                            fields: ['updateByRoleId', 'updatedBy', 'updatedAt', 'shippingMethodId', 'shipToId', 'shippingAddress', 'carrierID', 'carrierAccountNumber', 'shippingContactPersonID', 'shippingContactPerson'],
                                            transaction: t
                                        }));
                                }
                                // update header totalAmount field
                                if (req.body.packingSlipTotalAmount >= 0) {
                                    const objUpdatePackingSlipAmount = {
                                        totalAmount: req.body.packingSlipTotalAmount
                                    };
                                    COMMON.setModelUpdatedByObjectFieldValue(req.user, objUpdatePackingSlipAmount);
                                    genePromises.push(
                                        CustomerPackingSlip.update(objUpdatePackingSlipAmount, {
                                            where: {
                                                id: req.body.refCustPackingSlipID,
                                                isDeleted: false
                                            },
                                            fields: ['updateByRoleId', 'updatedBy', 'updatedAt', 'totalAmount', 'isAskForVersionConfirmation'],
                                            transaction: t
                                        }));
                                }
                                if (req.body.revision < 10) {
                                    req.body.revision = COMMON.stringFormat('0{0}', parseInt(req.body.revision));
                                }
                                const updateObj = {
                                    revision: req.body.revision,
                                    isAskForVersionConfirmation: req.body.isAskForVersionConfirmation
                                };
                                COMMON.setModelUpdatedByObjectFieldValue(req.user, updateObj);
                                genePromises.push(
                                    CustomerPackingSlip.update(updateObj, {
                                        where: {
                                            id: req.body.refCustPackingSlipID,
                                            isDeleted: false
                                        },
                                        fields: ['revision', 'updateByRoleId', 'updatedBy', 'updatedAt', 'isAskForVersionConfirmation'],
                                        transaction: t
                                    }));
                                return Promise.all(genePromises).then(() => {
                                    if (req.body.otherChargesList && req.body.otherChargesList.length > 0) {
                                        return module.exports.saveCustomerOtherChargesWithDetail(req, req.body.otherChargesList, packingSlip.refCustPackingSlipID, packingSlip.id, t).then((responseDet) => {
                                            if (responseDet && responseDet.status === STATE.SUCCESS) {
                                                return t.commit().then(() => {
                                                    req.params = {
                                                        id: packingSlip.refCustPackingSlipID,
                                                        detID: packingSlip.id
                                                    };
                                                    EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipshipping, MESSAGE_CONSTANT.UPDATED(custPackingDetModuleName));
                                                });
                                            } else {
                                                if (!t.finished) { t.rollback(); }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: responseDet.err, data: null });
                                            }
                                        });
                                    } else {
                                        if (req.body.isSetPackingSlipAddrMethodAsPerShipDet) {
                                            const objUpdatePackingSlipAddrMethod = {
                                                shippingMethodId: req.body.shippingMethodID,
                                                shipToId: req.body.shippingAddressID,
                                                shippingAddress: req.body.shippingAddress,
                                                carrierID: req.body.carrierID,
                                                carrierAccountNumber: req.body.carrierAccountNumber
                                            };
                                            COMMON.setModelUpdatedByObjectFieldValue(req.user, objUpdatePackingSlipAddrMethod);
                                            genePromises.push(
                                                CustomerPackingSlip.update(objUpdatePackingSlipAddrMethod, {
                                                    where: {
                                                        id: req.body.refCustPackingSlipID,
                                                        isDeleted: false
                                                    },
                                                    fields: ['updateByRoleId', 'updatedBy', 'updatedAt', 'shippingMethodId', 'shipToId', 'shippingAddress', 'carrierID', 'carrierAccountNumber',
                                                        'shippingContactPersonID', 'shippingContactPerson'],
                                                    transaction: t
                                                }));
                                        }
                                        return t.commit().then(() => {
                                            req.params = {
                                                id: packingSlip.refCustPackingSlipID,
                                                detID: packingSlip.id
                                            };
                                            EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipshipping, MESSAGE_CONSTANT.UPDATED(custPackingDetModuleName));
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
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        } else {         // without inventory case
                            genePromises = [];
                            const headerFieldList = [];
                            const objUpdateHeader = {};
                            // update ship address and method
                            if (req.body.isSetPackingSlipAddrMethodAsPerShipDet) {
                                objUpdateHeader.shippingMethodId = req.body.shippingMethodID;
                                objUpdateHeader.shipToId = req.body.shippingAddressID;
                                objUpdateHeader.shippingAddress = req.body.shippingAddress;
                                objUpdateHeader.carrierID = req.body.carrierID;
                                objUpdateHeader.carrierAccountNumber = req.body.carrierAccountNumber;
                                headerFieldList.push('shippingMethodId', 'shipToId', 'carrierID', 'carrierAccountNumber', 'shippingContactPersonID', 'shippingContactPerson');
                            }
                            // update header totalAmount field
                            if (req.body.packingSlipTotalAmount >= 0) {
                                objUpdateHeader.totalAmount = req.body.packingSlipTotalAmount;
                                headerFieldList.push('totalAmount');
                            }
                            if (req.body.revision < 10) {
                                req.body.revision = COMMON.stringFormat('0{0}', parseInt(req.body.revision));
                            }
                            objUpdateHeader.revision = req.body.revision;
                            objUpdateHeader.isAskForVersionConfirmation = req.body.isAskForVersionConfirmation;
                            headerFieldList.push('revision', 'isAskForVersionConfirmation');
                            headerFieldList.push('updateByRoleId', 'updatedBy', 'updatedAt');

                            COMMON.setModelUpdatedByObjectFieldValue(req.user, objUpdateHeader);
                            genePromises.push(
                                CustomerPackingSlip.update(objUpdateHeader, {
                                    where: {
                                        id: req.body.refCustPackingSlipID,
                                        isDeleted: false
                                    },
                                    fields: headerFieldList,
                                    transaction: t
                                }));
                            return Promise.all(genePromises).then(() => {
                                if (req.body.otherChargesList && req.body.otherChargesList.length > 0) {
                                    return module.exports.saveCustomerOtherChargesWithDetail(req, req.body.otherChargesList, packingSlip.refCustPackingSlipID, packingSlip.id, t).then((responseDet) => {
                                        if (responseDet && responseDet.status === STATE.SUCCESS) {
                                            return t.commit().then(() => {
                                                req.params = {
                                                    id: packingSlip.refCustPackingSlipID,
                                                    detID: packingSlip.id
                                                };
                                                EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipshipping, MESSAGE_CONSTANT.UPDATED(custPackingDetModuleName));
                                            });
                                        } else {
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: responseDet.err, data: null });
                                        }
                                    });
                                } else {
                                    return t.commit().then(() => {
                                        req.params = {
                                            id: packingSlip.refCustPackingSlipID,
                                            detID: packingSlip.id
                                        };
                                        EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipshipping, MESSAGE_CONSTANT.UPDATED(custPackingDetModuleName));
                                    });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                            // return t.commit().then(() => {
                            //     req.params = {
                            //         id: packingSlip.refCustPackingSlipID,
                            //         detID: packingSlip.id
                            //     };
                            //     EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                            //     return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipshipping, MESSAGE_CONSTANT.UPDATED(custPackingModuleName));
                            // });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) { t.rollback(); }
                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err.errors.map(e => e.message).join(','),
                                data: null
                            });
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    }));
                } else if ((!packingSlip) && req.body.id) {
                    // in update if no data found raise missing detail error
                    // let messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.PARENT_DATA_NOT_EXISTS);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.PARENT_DATA_NOT_EXISTS, err: null, data: null });
                } else {  // create new case
                    // get total packing slip details added
                    return CustomerPackingSlipDet.count({
                        where: {
                            refCustPackingSlipID: req.body.refCustPackingSlipID,
                            isDeleted: false
                        }
                    }).then((totPackingSlipCount) => {
                        req.body.lineID = totPackingSlipCount + 1;
                        COMMON.setModelCreatedByFieldValue(req); // set createdby,upadtedby value
                        return sequelize.transaction().then(t => CustomerPackingSlipDet.create(req.body, {
                            fields: inputDetailsFields,
                            transaction: t
                        }).then((packingSlipshipping) => {
                            if ((req.body.shippedAssemblyList && req.body.shippedAssemblyList.length > 0) || (req.body.shippedComponentList && req.body.shippedComponentList.length > 0)) {
                                return module.exports.saveShippedAssemblyDeatils(req, packingSlipshipping.id, t).then((respOfShipAssyList) => {
                                    if (!respOfShipAssyList || respOfShipAssyList.status !== STATE.SUCCESS
                                        || !respOfShipAssyList.respOfShipList || respOfShipAssyList.respOfShipList.length === 0 || (_.first(_.values(respOfShipAssyList.respOfShipList[0]))).spStatus !== 1) {
                                        t.rollback();
                                        const respOfShippedAssyList = respOfShipAssyList.respOfShipList;
                                        const respOfNotAvailableQtyShipList = _.values(respOfShippedAssyList[1]);
                                        const respOfUMIDKitConfmRequireShipList = _.values(respOfShippedAssyList[2]);

                                        if (respOfNotAvailableQtyShipList && respOfNotAvailableQtyShipList.length > 0) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: null,
                                                err: null,
                                                data: {
                                                    notAvailableQtyShipList: respOfNotAvailableQtyShipList
                                                }
                                            });
                                        } else if (respOfUMIDKitConfmRequireShipList && respOfUMIDKitConfmRequireShipList.length > 0) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: null,
                                                err: null,
                                                data: {
                                                    UMIDKitConfmRequireShipList: respOfUMIDKitConfmRequireShipList
                                                }
                                            });
                                        } else {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                        }
                                    }

                                    genePromises = [];
                                    // update ship address and method
                                    if (req.body.isSetPackingSlipAddrMethodAsPerShipDet) {
                                        const objUpdatePackingSlipAddrMethod = {
                                            shippingMethodId: req.body.shippingMethodID,
                                            shipToId: req.body.shippingAddressID,
                                            shippingAddress: req.body.shippingAddress,
                                            carrierID: req.body.carrierID,
                                            carrierAccountNumber: req.body.carrierAccountNumber,
                                            shippingContactPersonID: req.body.shippingContactPersonID,
                                            shippingContactPerson: req.body.shippingContactPerson
                                        };
                                        COMMON.setModelUpdatedByObjectFieldValue(req.user, objUpdatePackingSlipAddrMethod);
                                        genePromises.push(
                                            CustomerPackingSlip.update(objUpdatePackingSlipAddrMethod, {
                                                where: {
                                                    id: req.body.refCustPackingSlipID,
                                                    isDeleted: false
                                                },
                                                fields: ['updateByRoleId', 'updatedBy', 'updatedAt', 'shippingMethodId', 'shipToId', 'shippingAddress', 'carrierID', 'carrierAccountNumber', 'shippingContactPersonID', 'shippingContactPerson'],
                                                transaction: t
                                            }));
                                    }
                                    // update header totalAmount field
                                    if (req.body.packingSlipTotalAmount >= 0) {
                                        const objUpdatePackingSlipAmount = {
                                            totalAmount: req.body.packingSlipTotalAmount
                                        };
                                        COMMON.setModelUpdatedByObjectFieldValue(req.user, objUpdatePackingSlipAmount);
                                        genePromises.push(
                                            CustomerPackingSlip.update(objUpdatePackingSlipAmount, {
                                                where: {
                                                    id: req.body.refCustPackingSlipID,
                                                    isDeleted: false
                                                },
                                                fields: ['updateByRoleId', 'updatedBy', 'updatedAt', 'totalAmount'],
                                                transaction: t
                                            }));
                                    }
                                    return Promise.all(genePromises).then(() => {
                                        if (req.body.otherChargesList && req.body.otherChargesList.length > 0) {
                                            return module.exports.saveCustomerOtherChargesWithDetail(req, req.body.otherChargesList, req.body.refCustPackingSlipID, packingSlipshipping.id, t).then((responseDet) => {
                                                if (responseDet && responseDet.status === STATE.SUCCESS) {
                                                    return t.commit().then(() => {
                                                        req.params = {
                                                            id: req.body.refCustPackingSlipID,
                                                            detID: packingSlipshipping.id
                                                        };
                                                        EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipshipping, MESSAGE_CONSTANT.CREATED(custPackingDetModuleName));
                                                    });
                                                } else {
                                                    if (!t.finished) { t.rollback(); }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: responseDet.err, data: null });
                                                }
                                            });
                                        } else {
                                            return t.commit().then(() => {
                                                req.params = {
                                                    id: req.body.refCustPackingSlipID,
                                                    detID: packingSlipshipping.id
                                                };
                                                EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipshipping, MESSAGE_CONSTANT.CREATED(custPackingDetModuleName));
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
                                });
                            } else if (req.body.otherChargesList && req.body.otherChargesList.length > 0) {
                                return module.exports.saveCustomerOtherChargesWithDetail(req, req.body.otherChargesList, req.body.refCustPackingSlipID, packingSlipshipping.id, t).then((responseDet) => {
                                    if (responseDet && responseDet.status === STATE.SUCCESS) {
                                        return t.commit().then(() => {
                                            req.params = {
                                                id: req.body.refCustPackingSlipID,
                                                detID: packingSlipshipping.id
                                            };
                                            EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipshipping, MESSAGE_CONSTANT.CREATED(custPackingDetModuleName));
                                        });
                                    } else {
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: responseDet.err, data: null });
                                    }
                                });
                            } else { // without inventory
                                const headerFieldList = [];
                                const objUpdateHeader = {};
                                genePromises = [];
                                // update ship address and method
                                // update ship address and method
                                if (req.body.isSetPackingSlipAddrMethodAsPerShipDet) {
                                    objUpdateHeader.shippingMethodId = req.body.shippingMethodID;
                                    objUpdateHeader.shipToId = req.body.shippingAddressID;
                                    objUpdateHeader.shippingAddress = req.body.shippingAddress;
                                    objUpdateHeader.carrierID = req.body.carrierID;
                                    objUpdateHeader.carrierAccountNumber = req.body.carrierAccountNumber;
                                    headerFieldList.push('shippingMethodId', 'shipToId', 'carrierID', 'carrierAccountNumber', 'shippingContactPersonID', 'shippingContactPerson');
                                }
                                // update header totalAmount field
                                if (req.body.packingSlipTotalAmount >= 0) {
                                    objUpdateHeader.totalAmount = req.body.packingSlipTotalAmount;
                                    headerFieldList.push('totalAmount');
                                }
                                headerFieldList.push('updateByRoleId', 'updatedBy', 'updatedAt');

                                COMMON.setModelUpdatedByObjectFieldValue(req.user, objUpdateHeader);
                                genePromises.push(
                                    CustomerPackingSlip.update(objUpdateHeader, {
                                        where: {
                                            id: req.body.refCustPackingSlipID,
                                            isDeleted: false
                                        },
                                        fields: headerFieldList,
                                        transaction: t
                                    }));
                                return Promise.all(genePromises).then(() => t.commit().then(() => {
                                    req.params = {
                                        id: req.body.refCustPackingSlipID,
                                        detID: packingSlipshipping.id
                                    };
                                    EnterpriseSearchController.manageCustomerPackingSlipInElastic(req);
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipshipping, MESSAGE_CONSTANT.CREATED(custPackingDetModuleName));
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) { t.rollback(); }
                            if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err.errors.map(e => e.message).join(','),
                                    data: null
                                });
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        }));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
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
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // POST : /api/v1/saveShippedAssemblyDeatils
    // @return saved shipped assy details
    saveShippedAssemblyDeatils: (req, refCustPackingSlipDetID, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        const shipAssyListForAddUpdate = [];
        if (req.body.shippedAssemblyList && req.body.shippedAssemblyList.length > 0) {
            _.each(req.body.shippedAssemblyList, (item) => {
                const objshipAssyItem = {
                    shippedqty: parseInt(item.selectedQty ? item.selectedQty : 0),
                    partID: item.partID,
                    workorderID: item.woID || {},
                    woOPID: item.lastWOOPID || {},
                    woNumber: item.woNumber,
                    stockType: item.stockType,
                    refsidid: item.refsidid || {},
                    oringinalQty: item.refsidid ? parseInt(item.selectedQty ? item.selectedQty : 0) : {},
                    UMID: item.UMID || {},
                    shippedUom: item.shippedUom || {}
                };
                shipAssyListForAddUpdate.push(objshipAssyItem);
            });
        } else if (req.body.shippedComponentList && req.body.shippedComponentList.length > 0) {
            _.each(req.body.shippedComponentList, (item) => {
                const objshipAssyItem = {
                    shippedqty: parseInt(item.selectedQty ? item.selectedQty : 0),
                    partID: item.refcompid,
                    workorderID: item.woID || {},
                    woOPID: item.lastWOOPID || {},
                    woNumber: item.woNumber || {},
                    stockType: item.stockType || {},
                    refsidid: item.id || {},
                    oringinalQty: item.refcompid ? parseInt(item.pkgQty ? item.pkgQty : 0) : {},
                    UMID: item.uid || {},
                    shippedUom: item.shippedUom || {},
                    expireDaysLeftBeforeShipment: item.expireDaysLeftBeforeShipment || {}
                };
                shipAssyListForAddUpdate.push(objshipAssyItem);
            });
        }

        return sequelize
            .query('CALL Sproc_SaveShippedAssemblyDetFromPackingSlip (:pShipAssyList,:pIsConfirmationTakenForDeallocateUMID,:pPartID,:pRefCustPackingSlipDetID,:pCustomerID,:pShippedNotes,:pShippingId,:pToBinIDOfEmptyBin,:pTransTypeForUMID,:pActionPerformedForUMIDZeroOut,:pActionPerformedForUMIDConsumed,:pActionPerformedForUMIDAdjust,:pUserID,:pUserRoleID, :pIsComponentStock)', {
                replacements: {
                    pShipAssyList: JSON.stringify(shipAssyListForAddUpdate),
                    pIsConfirmationTakenForDeallocateUMID: req.body.isConfirmationTakenForDeallocateUMID || false,
                    pPartID: req.body.partId,
                    pRefCustPackingSlipDetID: refCustPackingSlipDetID,
                    pCustomerID: req.body.customerID,
                    pShippedNotes: req.body.shippingNotes || null,
                    pShippingId: req.body.shippingId || null,
                    pToBinIDOfEmptyBin: req.body.toBinIDOfEmptyBin,
                    pTransTypeForUMID: req.body.transTypeForUMID,
                    pActionPerformedForUMIDZeroOut: req.body.actionPerformedForUMIDZeroOut,
                    pActionPerformedForUMIDConsumed: req.body.actionPerformedForUMIDConsumed,
                    pActionPerformedForUMIDAdjust: req.body.actionPerformedForUMIDAdjust,
                    pUserID: req.user.id,
                    pUserRoleID: req.user.defaultLoginRoleID,
                    pIsComponentStock: req.body.componentStockType || null
                },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            }).then(respOfShipList => ({
                respOfShipList: respOfShipList,
                status: STATE.SUCCESS
            }));
    },

    // GET Customer packing slip shipping details
    // POST : /api/v1/getCustomerPackingShippingDetail
    // @return customer packing shipping details
    getCustomerPackingShippingDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') { strWhere = null; }

        sequelize
            .query('CALL Sproc_RetrieveCustomerPackingShippingDetail (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prefCustPackingSlipID)', {
                replacements: {
                    ppageIndex: req.body.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    prefCustPackingSlipID: req.body.prefCustPackingSlipID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                packingSlipShipping: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
    },

    // GET Customer packing slip details
    // POST : /api/v1/getCustomerPackingSlipDetail
    // @return customer packing Slip details
    getCustomerPackingSlipDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') { strWhere = null; }
        if (req.body.isSummary) {
            sequelize
                .query('CALL Sproc_RetrieveCustomerPackingSlipDeatils (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pfilterStatus,:pmfgCodelist,:pmfgPartID,:ppsSearchType,:padvanceSearchPoSoPsInv,:pstatusIds,:pfromDate,:ptoDate,:pDateType, :pSearchComments)', {
                    replacements: {
                        ppageIndex: req.body.page,
                        precordPerPage: req.body.isExport ? null : filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pfilterStatus: req.body.filterStatus || null,
                        pmfgCodelist: req.body.mfgCodeIds || null,
                        pmfgPartID: req.body.mfgPartID || null,
                        ppsSearchType: req.body.psSearchType || null,
                        padvanceSearchPoSoPsInv: req.body.advanceSearchPoSoPsInv || null,
                        pstatusIds: req.body.statusIds || null,
                        pfromDate: req.body.pfromDate || null,
                        ptoDate: req.body.ptoDate || null,
                        pDateType: req.body.selectedDateType || null,
                        pSearchComments: req.body.searchComments || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    packingSlipDet: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            sequelize
                .query('CALL Sproc_RetrieveCustomerPackingSlipDetailPerLine (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pfilterStatus,:pmfgCodelist,:pmfgPartID,:ppsSearchType,:padvanceSearchPoSoPsInv,:pstatusIds,:pfromDate,:ptoDate,:pDateType, :pSearchComments)', {
                    replacements: {
                        ppageIndex: req.body.page,
                        precordPerPage: req.body.isExport ? null : filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pfilterStatus: req.body.filterStatus || null,
                        pmfgCodelist: req.body.mfgCodeIds || null,
                        pmfgPartID: req.body.mfgPartID || null,
                        ppsSearchType: req.body.psSearchType || null,
                        padvanceSearchPoSoPsInv: req.body.advanceSearchPoSoPsInv || null,
                        pstatusIds: req.body.statusIds || null,
                        pfromDate: req.body.pfromDate || null,
                        ptoDate: req.body.ptoDate || null,
                        pDateType: req.body.selectedDateType || null,
                        pSearchComments: req.body.searchComments || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    packingSlipDet: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        }
    },
    // Remove Customer packing slip
    // PUT : /api/v1/deleteCustomerPackingSlip
    // @param {id} int
    // @return Upadted packing slip details
    deleteCustomerPackingSlip: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.CustomerPackingSlip.Name;
            const entityID = COMMON.AllEntityIDS.CustomerPackingSlip.ID;
            // Notes: if no Customer packing slip details added than remove Customer packing slip master details
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_checkDelete_customer_packingslip (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pToBinIDOfEmptyBin,:pTransTypeForUMID,:pActionPerformedForUMIDAdjust,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: req.body.objIDs.CustomerPackingSlipID ? req.body.objIDs.CustomerPackingSlipID.toString() : null,
                    countList: req.body.objIDs.CountList,
                    pToBinIDOfEmptyBin: req.body.objIDs.toBinIDOfEmptyBin,
                    pTransTypeForUMID: req.body.objIDs.transTypeForUMID,
                    pActionPerformedForUMIDAdjust: req.body.objIDs.actionPerformedForUMIDAdjust,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                },
                transaction: t
            }).then((customerPackingSlipDetail) => {
                if (customerPackingSlipDetail && customerPackingSlipDetail.length === 0) {
                    if (req.body.objIDs && req.body.objIDs.id.length > 0) {
                        EnterpriseSearchController.deleteCustomerPackingSlipMaterialInElastic(req.body.objIDs.id.toString());
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(custPackingModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: customerPackingSlipDetail,
                        IDs: req.body.objIDs.id
                    }, null);
                }
            }).catch((err) => {
                t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // GET list of all Initial stock detail for part and wonumber
    // Get : /api/v1/getCustomerPackingSlipTransferQty
    // @param {partID} int
    // @return list of not asigned qty for par and wonumber
    getCustomerPackingSlipTransferQty: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_getCustomerPackingSlipTransferQty (:pPartID)', {
            replacements: {
                pPartID: req.params.partID || null
            }
        }).then(shippingqtyList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, shippingqtyList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // GET All packing slip detail
    // GET : /api/v1/getPackingSlipDetails
    // @return detail of packing slip
    getPackingSlipDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        // let whereClause = {
        //     isDeleted: false,
        //     transType: req.params.transType
        // };
        req.body.searchQuery = req.body.searchQuery ? `%${req.body.searchQuery}%` : null;
        return sequelize.query('CALL Sproc_getCustomerPackingSlipDetailForHeaderList (:pSearch,:pTransType)', {
            replacements: {
                pSearch: req.body.searchQuery || null,
                pTransType: req.body.transType || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((packingSlip) => {
            if (!packingSlip) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(custPackingModuleName),
                    err: null,
                    data: null
                });
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(packingSlip[0]), null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // POST list of all shipped qty details
    // POST : /api/v1/getShippedPackingslipDetails
    // @return list of shipped qty details
    getShippedPackingslipDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetShippedPackingslipDetails (:salesOrderDetID,:ppartID,:ppackingSlipID,:pshippingId)', {
                replacements: {
                    salesOrderDetID: req.body.salesOrderDetID || null,
                    ppartID: req.body.partID || null,
                    ppackingSlipID: req.body.packingSlipID || null,
                    pshippingId: req.body.shippingId || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(packingSlipQty => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                packingSlipShipping: _.values(packingSlipQty[0]),
                salesShippingQty: _.values(packingSlipQty[1])
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Remove Customer packing slip detail
    // PUT : /api/v1/deleteCustomerPackingSlipDetail
    // @param {id} int
    // @return Upadted packing slip details
    deleteCustomerPackingSlipDetail: (req, res) => {
        const {
            sequelize, CustomerPackingSlip
        } = req.app.locals.models;
        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_DeleteCustomerPackingslipDet (:pRefCustPackingSlipDetIDs,:countList,:pToBinIDOfEmptyBin,:pTransTypeForUMID,:pActionPerformedForUMIDAdjust,:pUserID,:pUserRoleID)', {
                replacements: {
                    pRefCustPackingSlipDetIDs: req.body.objIDs.id.toString(),
                    countList: req.body.objIDs.CountList,
                    pToBinIDOfEmptyBin: req.body.objIDs.toBinIDOfEmptyBin,
                    pTransTypeForUMID: req.body.objIDs.transTypeForUMID,
                    pActionPerformedForUMIDAdjust: req.body.objIDs.actionPerformedForUMIDAdjust,
                    pUserID: req.user.id,
                    pUserRoleID: req.user.defaultLoginRoleID
                },
                transaction: t
            }).then((customerPackingSlipDet) => {
                if (customerPackingSlipDet.length === 0) {
                    if (req.body.objIDs && req.body.objIDs.id.length > 0) {
                        EnterpriseSearchController.deleteCustomerPackingSlipMaterialInElastic(req.body.objIDs.id.toString());
                    }

                    const promises = [];
                    if (req.body.objIDs.revision < 10) {
                        req.body.objIDs.revision = COMMON.stringFormat('0{0}', parseInt(req.body.objIDs.revision));
                    }
                    const updateObj = {
                        revision: req.body.objIDs.revision
                    };
                    promises.push(CustomerPackingSlip.update(updateObj, {
                        where: { id: req.body.objIDs.packingSlipId },
                        fields: ['revision'],
                        transaction: t
                    }));
                    // rearrange lineID column for customer packing slip details
                    promises.push(module.exports.rearrangeLineForCustomerPackingSlipDetDataPromise(req, t));
                    return Promise.all(promises).then(() =>
                        t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(COMMON.stringFormat('{0} Detail', req.body.objIDs.isInvoice ? 'Other Charges' : custPackingModuleName))))
                    ).catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    t.rollback();
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: customerPackingSlipDet,
                        IDs: req.body.objIDs.id
                    }, null);
                }
            }).catch((err) => {
                t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // to rearrange all packing slip detail line id (sequence line id)
    rearrangeLineForCustomerPackingSlipDetDataPromise: (req, t) => {
        const { CustomerPackingSlipDet } = req.app.locals.models;
        return CustomerPackingSlipDet.findAll({
            where: {
                refCustPackingSlipID: req.body.objIDs.CustomerPackingSlipID,
                isDeleted: false
            },
            attributes: ['id', 'lineID'],
            order: [['id', 'ASC']],
            transaction: t
        }).then((packingSlipDetList) => {
            if (packingSlipDetList && packingSlipDetList.length > 0) {
                const updatePackingSlipDetPromises = [];
                _.each(packingSlipDetList, (detItem, index) => {
                    const updateObj = {
                        lineID: index + 1
                    };
                    COMMON.setModelUpdatedByObjectFieldValue(req.user, updateObj);
                    updatePackingSlipDetPromises.push(CustomerPackingSlipDet.update(updateObj, {
                        where: {
                            id: detItem.id
                        },
                        fields: ['updateByRoleId', 'updatedBy', 'updatedAt', 'lineID'],
                        transaction: t
                    }));
                });

                return Promise.all(updatePackingSlipDetPromises).then(() => ({
                    status: STATE.SUCCESS
                }));
            } else {
                return {
                    status: STATE.SUCCESS
                };
            }
        });
    },

    // get change history customer packing slip
    // POST :/api/v1/customerPackingSlip/customerPackingchangehistory
    // @return change history  customer packing  data
    customerPackingchangehistory: (req, res) => {
        if (req.body && req.body.customerPackingId) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_CustomerPackingSlipChangeHistory (:pcustomerslipID,:pcustomerslipDetId,:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                    replacements: {
                        pcustomerslipID: req.body.customerPackingId,
                        pcustomerslipDetId: req.body.customerPackingDetID || null,
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(customerPackingLog => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    customerPackingLog: _.values(customerPackingLog[1]),
                    Count: customerPackingLog[0][0]['TotalRecord']
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of invoices
    // POST : /api/v1/retriveInvoicelist
    // @return list of RFQ
    retriveInvoicelist: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (req.body.isSummary) {
                return sequelize.query('CALL Sproc_RetrieveCustomerInvoiceDetails (:ppageIndex,:precordPerPage,:pOrderBy, :pWhereClause,:pFilterStatus,:pDueDate,:pAdditionalDays,:pTermsAndAboveDays,:pPoNumber ,:pIsExactSearchPO,:pMfgCodeIds, :pPaymentTermsIds, :pPartId, :pTransType, :pFromDate, :pToDate, :pPaymentStatusFilter,:pCreditAppliedStatusFilter, :pZeroAmountFilter,:pCreditMemoRefundStatusFilter, :pMarkedForRefund, :pDateType,:pSearchComments)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pFilterStatus: req.body.filterStatus || null,
                        pDueDate: req.body.dueDate || null,
                        pAdditionalDays: req.body.additionalDays || null,
                        pTermsAndAboveDays: req.body.termsAndAboveDays ? req.body.termsAndAboveDays : (req.body.termsAndAboveDays === 0 ? req.body.termsAndAboveDays : null),
                        pPoNumber: req.body.poNumber || null,
                        pIsExactSearchPO: req.body.isExactSearchPO || null,
                        pMfgCodeIds: req.body.mfgCodeIds || null,
                        pPaymentTermsIds: req.body.paymentTermsIds || null,
                        pPartId: req.body.mfrPnId || null,
                        pTransType: req.body.transType || null,
                        pFromDate: req.body.fromDate || null,
                        pToDate: req.body.toDate || null,
                        pPaymentStatusFilter: req.body.paymentStatusFilter || null,
                        pCreditAppliedStatusFilter: req.body.creditAppliedStatusFilter || null,
                        pZeroAmountFilter: req.body.isFilterZeroAmount || null,
                        pCreditMemoRefundStatusFilter: req.body.creditMemoRefundStatusFilter || null,
                        pMarkedForRefund: req.body.isMarkedForRefund || null,
                        pDateType: req.body.selectedDateType || null,
                        pSearchComments: req.body.searchComments || null
                        // pChequeNumber: req.body.filterStatus || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    invoice: _.values(response[1]),
                    Count: response[0][0].TotalRecord
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                return sequelize.query('CALL Sproc_RetrieveCustomerInvoiceDetailsPerLine (:ppageIndex,:precordPerPage,:pOrderBy, :pWhereClause,:pFilterStatus,:pDueDate,:pAdditionalDays,:pTermsAndAboveDays,:pPoNumber ,:pIsExactSearchPO,:pMfgCodeIds, :pPaymentTermsIds, :pPartId, :pTransType, :pFromDate, :pToDate, :pPaymentStatusFilter,:pCreditAppliedStatusFilter, :pZeroAmountFilter,:pCreditMemoRefundStatusFilter, :pMarkedForRefund, :pWithCommissionLine, :pWithOtherChargesLine,:pZeroAmountLineFilter, :pDateType,:pSearchComments)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pFilterStatus: req.body.filterStatus || null,
                        pDueDate: req.body.dueDate || null,
                        pAdditionalDays: req.body.additionalDays || null,
                        pTermsAndAboveDays: req.body.termsAndAboveDays ? req.body.termsAndAboveDays : (req.body.termsAndAboveDays === 0 ? req.body.termsAndAboveDays : null),
                        pPoNumber: req.body.poNumber || null,
                        pIsExactSearchPO: req.body.isExactSearchPO || null,
                        pMfgCodeIds: req.body.mfgCodeIds || null,
                        pPaymentTermsIds: req.body.paymentTermsIds || null,
                        pPartId: req.body.mfrPnId || null,
                        pTransType: req.body.transType || null,
                        pFromDate: req.body.fromDate || null,
                        pToDate: req.body.toDate || null,
                        pPaymentStatusFilter: req.body.paymentStatusFilter || null,
                        pCreditAppliedStatusFilter: req.body.creditAppliedStatusFilter || null,
                        pZeroAmountFilter: req.body.isFilterZeroAmount || null,
                        pCreditMemoRefundStatusFilter: req.body.creditMemoRefundStatusFilter || null,
                        pMarkedForRefund: req.body.isMarkedForRefund || null,
                        pWithCommissionLine: req.body.isCommissionIncluded || null,
                        pWithOtherChargesLine: req.body.isLineOtherChargesIncluded || null,
                        pZeroAmountLineFilter: req.body.isFilterZeroAmountLine || null,
                        pDateType: req.body.selectedDateType || null,
                        pSearchComments: req.body.searchComments || null
                        // pChequeNumber: req.body.filterStatus || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    invoice: _.values(response[1]),
                    Count: response[0][0].TotalRecord
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Remove Customer Invoice
    // PUT : /api/v1/deleteCustomerInvoice
    // @param {id} int
    // @return removed deleted customer invoice
    deleteCustomerInvoice: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.CustomerInvoice.Name;
            const entityID = COMMON.AllEntityIDS.CustomerInvoice.ID;
            // Notes: if no Customer invoice details added than remove Customer invoice master details
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
            }).then((customerInvoiceDetail) => {
                const moduleName = req.body.objIDs.transType === DATA_CONSTANT.CUST_INVOICE ? custInvoiceModuleName : custCrNoteModuleName;
                if (customerInvoiceDetail && customerInvoiceDetail.length === 0) {
                    if (req.body.objIDs && req.body.objIDs.id.length > 0) {
                        EnterpriseSearchController.deleteCustomerInvoiceMaterialInElastic(req.body.objIDs.id.toString());
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(moduleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: customerInvoiceDetail,
                        IDs: req.body.objIDs.id
                    }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get Customer PackingSlip Detail By PackingSlipNumber
    // POST : /api/v1/getCustomerPackingSlipDetailByPackingSlipNumber
    // @return detail of customer packing slip and packing slip line
    getCustomerPackingSlipDetailByPackingSlipNumber: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_GetCustomerPackingSlipDetailByPackingSlipNumber(:pPackingSlipNumber)', {
                replacements: {
                    pPackingSlipNumber: req.body.packingSlipNumber
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response[0] && response[0][0] && response[0][0].IsSuccess === false) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        IsSuccess: response[0][0].IsSuccess,
                        Error: response[0][0].Error
                    }, null);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        IsSuccess: response[0][0].IsSuccess,
                        Error: response[0][0].Error,
                        PackingSlipDetail: _.values(response[1]),
                        PackingSlipDet: _.values(response[2]),
                        OtherDet: _.values(response[3]),
                        trackingDetail: _.values(response[4]),
                        lineOtherChrg: _.values(response[5])
                    }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Save Customer Invoice Master detail
    // POST : /api/v1/saveCustomerInvoiceMasterDetail
    // @return detail of saved invoice master detail
    saveCustomerInvoiceMasterDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        let invoiceId;
        const promises = [];
        const promisesUpdate = [];
        const systemIdTypeConst = req.body.transType === DATA_CONSTANT.CUST_INVOICE ? DATA_CONSTANT.IDENTITY.CustomerInvoiceSystemID : DATA_CONSTANT.IDENTITY.customerCreditMemoSystemID;
        if (req.body) {
            const invData = [{
                transType: req.body.transType,
                invoiceID: req.body.invoiceID || {},
                packingSlipID: req.body.packingSlipID || {},
                customerID: req.body.customerID || {},
                packingSlipType: req.body.packingSlipType || {},
                status: req.body.status,
                subStatus: req.body.subStatus,
                refSalesOrderID: req.body.refSalesOrderID || {},
                poNumber: req.body.poNumber || {},
                poDate: req.body.poDate || {},
                soNumber: req.body.soNumber || {},
                soDate: req.body.soDate || {},
                sorevision: req.body.sorevision || {},
                packingSlipNumber: req.body.packingSlipNumber || {},
                packingSlipDate: req.body.packingSlipDate || {},
                invoiceNumber: req.body.invoiceNumber || {},
                invoiceDate: req.body.invoiceDate || {},
                creditMemoNumber: req.body.creditMemoNumber || {},
                creditMemoDate: req.body.creditMemoDate || {},
                refDebitMemoNumber: req.body.refDebitMemoNumber || {},
                refDebitMemoDate: req.body.refDebitMemoDate || {},
                shippingMethodID: req.body.shippingMethodID || {},
                headerComment: req.body.headerComment || {},
                packingSlipComment: req.body.packingSlipComment || {},
                billingAddress: req.body.billingAddress || {},
                shippingAddress: req.body.shippingAddress || {},
                intermediateAddress: req.body.intermediateAddress || {},
                billToId: req.body.billToId || {},
                shipToId: req.body.shipToId || {},
                intermediateShipmentId: req.body.intermediateShipmentId || {},
                totalAmount: req.body.totalAmount || {},
                freeOnBoardId: req.body.freeOnBoardId || {},
                termsId: req.body.termsId || {},
                salesCommissionTo: req.body.salesCommissionTo || {},
                rmaNumber: req.body.rmaNumber || {},
                contactPersonId: req.body.contactPersonId || {},
                revision: req.body.revision || {},
                isZeroValue: req.body.isZeroValue || {},
                isAlreadyPublished: req.body.isAlreadyPublished || {},
                poRevision: req.body.poRevision || {},
                isMarkForRefund: req.body.isMarkForRefund,
                agreedRefundAmt: req.body.agreedRefundAmt || {},
                isAskForVersionConfirmation: req.body.isAskForVersionConfirmation || 0,
                refundStatus: req.body.refundStatus || {},
                carrierID: req.body.carrierID || {},
                carrierAccountNumber: req.body.carrierAccountNumber || {},
                billingContactPersonID: req.body.billingContactPersonID || {},
                shippingContactPersonID: req.body.shippingContactPersonID || {},
                intermediateContactPersonID: req.body.intermediateContactPersonID || {},
                billingContactPerson: req.body.billingContactPerson || {},
                shippingContactPerson: req.body.shippingContactPerson || {},
                intermediateContactPerson: req.body.intermediateContactPerson || {}
            }];
            return sequelize.transaction().then((t) => {
                if (!req.body.invoiceID) {
                    promises.push(getSystemIdPromise(req, res, systemIdTypeConst, t));
                }
                if (!req.body.invoiceID && (req.body.packingSlipType === 3 || req.body.packingSlipType === 4)) {
                    promises.push(module.exports.getCustomerInvoiceNumber(req, res, t).then(() => {
                        invData[0].invoiceNumber = req.body.invoiceNumber;
                        invData[0].packingSlipNumber = req.body.packingSlipNumber;
                        invData[0].creditMemoNumber = req.body.creditMemoNumber;
                    }));
                }
                return Promise.all(promises).then((resSysId) => {
                    // return getSystemIdPromise(req, res, systemIdTypeConst, t).then((resSysId) => {
                    if (req.body.invoiceID || (!req.body.invoiceID && resSysId && resSysId.length > 0 && resSysId[0].status === STATE.SUCCESS)) {
                        const systemId = (!req.body.invoiceID) ? resSysId[0].systemId : null;
                        return sequelize.query('CALL Sproc_SaveCustomerInvoiceDetail(:pTransType,:pInvoiceType,:pInvoiceID,:pInvData, :pPackingSlipID,:puserID,:puserRoleID,:pCustomerInvoiceSystemIDTypeConst,:pSystemId, :pPackingSlipType)', {
                            replacements: {
                                pTransType: req.body.transType || null,
                                pInvoiceType: req.body.invoiceType || null,
                                pInvoiceID: req.body.invoiceID || null,
                                pInvData: JSON.stringify(invData),
                                pPackingSlipID: req.body.packingSlipID || null,
                                puserID: req.user.id,
                                puserRoleID: COMMON.getRequestUserLoginRoleID(req),
                                pCustomerInvoiceSystemIDTypeConst: systemIdTypeConst || null,
                                pSystemId: systemId || null,
                                pPackingSlipType: req.body.packingSlipType || null
                            },
                            transaction: t,
                            type: sequelize.QueryTypes.SELECT
                        }).then((response) => {
                            const respOfSaveInvCMDdet = response;
                            if (!respOfSaveInvCMDdet || respOfSaveInvCMDdet.length === 0 || !_.values(respOfSaveInvCMDdet[2]) || (_.first(_.values(respOfSaveInvCMDdet[2]))).spStatus !== 1) {
                                t.rollback();
                                const respOfAgreedRefundAmtLessThanTotIssued = _.values(respOfSaveInvCMDdet[3]);

                                if (respOfAgreedRefundAmtLessThanTotIssued && (_.first(_.values(respOfAgreedRefundAmtLessThanTotIssued))).isAgreedRefundAmtLessThanTotIssued > 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: null,
                                        err: null,
                                        data: {
                                            isAgreedRefundAmtLessThanTotIssued: true,
                                            totRefundIssuedAgainstCreditMemo: (_.first(_.values(respOfAgreedRefundAmtLessThanTotIssued))).totRefundIssuedAgainstCreditMemo
                                        }
                                    });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                }
                            }

                            invoiceId = req.body.invoiceID || response[0][0].invoiceID;
                            const requiredDetForTrackingNumber = {
                                packingSlipMasterID: invoiceId
                            };
                            return module.exports.addUpdatePackingSlipTrackingNumber(req, requiredDetForTrackingNumber, t).then(() => {
                                const moduleName = req.body.transType === DATA_CONSTANT.CUST_INVOICE ? custInvoiceModuleName : custCrNoteModuleName;
                                if (req.body.invoiceType === DATA_CONSTANT.CUST_INVOICE && req.body.packingSlipID) {
                                    const requiredDetForTrackingNumberPackingSlip = {
                                        packingSlipMasterID: req.body.packingSlipID,
                                        isFromInvToPackingSlip: true
                                    };
                                    promisesUpdate.push(
                                        module.exports.addUpdatePackingSlipTrackingNumber(req, requiredDetForTrackingNumberPackingSlip, t)
                                    );
                                }
                                if (!req.body.invoiceID || req.body.invoiceType === 'T' || (req.body.invoiceType === DATA_CONSTANT.CUST_INVOICE && req.body.packingSlipType === 1) || req.body.transType === 'C') {
                                    response[1] = _.uniqBy(_.values(response[1]), 'refSalesorderDetId');
                                    promisesUpdate.push(
                                        module.exports.saveOtherChargesDetailInInvoice(req, t, response[1])
                                    );
                                }
                                return Promise.all(promisesUpdate).then(() => t.commit().then(() => {
                                    req.params = {
                                        id: invoiceId
                                    };
                                    req.params['id'] = invoiceId;
                                    req.params['transType'] = req.body.transType;
                                    EnterpriseSearchController.manageCustomerInvoiceInElastic(req);
                                    if (!req.body.invoiceID) {
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(moduleName));
                                    } else {
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName));
                                    }
                                })).catch((err) => {
                                    if (!t.finished) { t.rollback(); }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            if (err.parent.sqlState === '23000') {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Credit Memo#'), err: null, data: null });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null
                                });
                            }
                        });
                    } else {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null
                        });
                    }
                    // }).catch((err) => {
                    //     if (!t.finished) { t.rollback(); }
                    //     console.trace();
                    //     console.error(err);
                    //     return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    //         messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null
                    //     });
                }).catch((err) => { // remove one brackeet ) from here
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null
                });
            });// add bracket ) here
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // GET invoice  detail
    // GET : /api/v1/getCustomerInvoiceDetailByID
    // @param {id} int
    // @return detail of invoice
    getCustomerInvoiceDetailByID: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.id) {
            return sequelize.query('CALL Sproc_GetCustomerInvoiceDetail(:invoiceID,:pTransType)', {
                replacements: {
                    invoiceID: req.params.id,
                    pTransType: req.params.transType
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                PackingSlipDetail: _.values(response[0]),
                PackingSlipDet: _.values(response[1]),
                OtherDet: _.values(response[2]),
                trackingDetail: _.values(response[3]),
                commissionList: _.values(response[4]),
                childCommissionList: _.values(response[5])
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Save Customer Invoice sub detail
    // POST : /api/v1/saveCustomerInvoiceSubDetail
    // @return detail of saved invoice Sub detail
    saveCustomerInvoiceSubDetail: (req, res) => {
        const { CustomerPackingSlipDet, sequelize } = req.app.locals.models;
        if (req.body) {
            if (req.body.id) {
                COMMON.setModelUpdatedByFieldValue(req); // set createdby,upadtedby value
                return sequelize.transaction().then(t => CustomerPackingSlipDet.update(req.body, {
                    where: {
                        id: req.body.id,
                        isDeleted: false
                    },
                    transaction: t,
                    fields: ['shipQty', 'unitPrice', 'extendedPrice', 'refChargesTypeID', 'reflineID', 'updatedBy', 'internalComment',
                        'assyDescription', 'updateByRole', 'updatedAt', 'partId', 'shippingNotes', 'createdAt', 'custPOLineID', 'quoteFrom',
                        'refAssyQtyTurnTimeID', 'assyQtyTurnTimeText', 'quoteNumber', 'refRFQGroupID', 'refRFQQtyTurnTimeID', 'isZeroValue',
                        'releaseNotes', 'updatedBy', 'updateByRoleId', 'updatedAt']
                }).then(() => module.exports.updateCustomerInvoiceMasterAfterDetailSave(req, t).then((resMst) => {
                    if (resMst.status === STATE.SUCCESS) {
                        return module.exports.saveSalesCommissionDetails(req, res, t, req.body.salesCommissionList).then((resSave) => {
                            if (resSave && resSave.status === STATE.SUCCESS) {
                                const moduleName = req.body.transType === DATA_CONSTANT.CUST_INVOICE ? custInvoiceModuleName : custCrNoteModuleName;
                                return t.commit().then(() => {
                                    req.params['id'] = req.body.invoiceId;
                                    req.params['transType'] = req.body.transType;
                                    EnterpriseSearchController.manageCustomerInvoiceInElastic(req);
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName));
                                });
                            } else {
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: resSave.err, data: null });
                            }
                        }).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else { // error while updating invoice header
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(resMst.err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: resMst.err, data: null });
                    }
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }));
            } else {
                COMMON.setModelCreatedByFieldValue(req); // set createdby,upadtedby value
                // req.body.assyDescription = '-';
                // get total packing slip details added
                return CustomerPackingSlipDet.count({
                    where: {
                        refCustPackingSlipID: req.body.refCustPackingSlipID,
                        isDeleted: false
                    }
                }).then((totPackingSlipCount) => {
                    req.body.lineID = totPackingSlipCount + 1;
                    return sequelize.transaction().then(t => CustomerPackingSlipDet.create(req.body, {
                        transaction: t,
                        fields: ['shipQty', 'unitPrice', 'extendedPrice', 'refChargesTypeID', 'reflineID', 'refCustPackingSlipID', 'createdBy',
                            'updatedBy', 'poQty', 'remainingQty', 'shippedQty', 'assyDescription', 'lineID', 'createdAt', 'updatedAt', 'createByRoleId',
                            'updateByRoleId', 'internalComment', 'partId', 'shippingNotes', 'custPOLineID', 'quoteFrom', 'refAssyQtyTurnTimeID', 'assyQtyTurnTimeText',
                            'quoteNumber', 'refRFQGroupID', 'refRFQQtyTurnTimeID', 'isZeroValue', 'releaseNotes']
                    }).then(resIns => module.exports.updateCustomerInvoiceMasterAfterDetailSave(req, t).then((resMst) => {
                        if (resMst.status === STATE.SUCCESS) {
                            _.each(req.body.salesCommissionList, (det) => {
                                det.refCustPackingSlipDetID = resIns.id;
                            });
                            req.body.id = resIns.id;
                            return module.exports.saveSalesCommissionDetails(req, res, t, req.body.salesCommissionList).then((resSave) => {
                                if (resSave && resSave.status === STATE.SUCCESS) {
                                    const moduleName = req.body.transType === DATA_CONSTANT.CUST_INVOICE ? custInvoiceModuleName : custCrNoteModuleName;
                                    return t.commit().then(() => {
                                        req.params['id'] = req.body.invoiceId;
                                        req.params['transType'] = req.body.transType;

                                        EnterpriseSearchController.manageCustomerInvoiceInElastic(req);
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName));
                                    });
                                } else {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: resSave.err, data: null });
                                }
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else { // error while updatin master
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(resMst.err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: resMst.err, data: null });
                        }
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    })).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }));// last transaction closing
                }).catch((err) => { // count catch
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Save Customer Invoice Paid details
    // POST : /api/v1/paidCustomerPackingSlip
    // @return detail of saved invoice paid detail
    paidCustomerPackingSlip: (req, res) => {
        const {
            CustomerPackingSlip, sequelize
        } = req.app.locals.models;
        if (req.body) {
            const promiseCustomerPackingSlip = [];
            return sequelize.transaction().then((t) => {
                _.each(req.body, (invoice) => {
                    invoice.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                    invoice.updatedBy = req.user.id;
                    invoice.packingSlipStatus = invoice.paymentStatus;
                    promiseCustomerPackingSlip.push(CustomerPackingSlip.update(invoice, {
                        where: {
                            id: invoice.id,
                            isDeleted: false
                        },
                        fields: ['updateByRoleId', 'updatedBy', 'paymentNumber', 'paymentDate', 'paymentAmount', 'paymentStatus', 'bankName', 'packingSlipStatus'],
                        transaction: t
                    }).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                    promiseCustomerPackingSlip.push(CustomerPackingSlip.update(invoice, {
                        where: {
                            refCustInvoiceID: invoice.id,
                            isDeleted: false
                        },
                        fields: ['updateByRoleId', 'updatedBy', 'packingSlipStatus'],
                        transaction: t
                    }).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                });
                return Promise.all(promiseCustomerPackingSlip).then((resp) => {
                    if (_.find(resp, status => status === STATE.FAILED)) {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
                        });
                    } else {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(custInvoiceModuleName)));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // get detail for customer packing invoice number generated or not
    // POST : /api/v1/checkGeneratedInvoiceNumber
    // @return detail of customer packing slip
    checkGeneratedInvoiceNumber: (req, res) => {
        const {
            CustomerPackingSlip } = req.app.locals.models;
        if (req.params.id) {
            return CustomerPackingSlip.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                model: CustomerPackingSlip,
                attributes: ['id', 'refCustInvoiceID']
            }).then((packingSlip) => {
                if (packingSlip) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlip, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.PARENT_DATA_NOT_EXISTS, err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // GET Shipped Assembly list
    // GET : /api/v1/getShippedAssemblyList
    // @return detail of shipped assembly list from packingslip
    getShippedAssemblyList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetAlreadyShippedAssembly(:pcustomerPackingSlipDetID,:pshippingId)', {
                replacements: {
                    pcustomerPackingSlipDetID: req.body.refCustPackingSlipDetID,
                    pshippingId: req.body.shippingId || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                PackingSlipShipDetail: _.values(response[0])
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Get List of PID List
    // GET : /api/v1/customerPackingSlip/getAssyCompListForCustomerPackingSlipMISC
    // @param {customerID} int
    // @param {searchText} string
    // @param {partID} int
    // @return List of PID with Id
    getAssyCompListForCustomerPackingSlipMISC: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize
            .query('CALL Sproc_GetAssyCompListForCustomerPackingSlipMISC (:customerID,:pSearch,:pPartID,:pisFromSO, :pSalesOrderID)', {
                replacements: {
                    customerID: req.body.customerID ? req.body.customerID : null,
                    pSearch: req.body.searchText || null,
                    pPartID: req.body.partID || null,
                    pisFromSO: req.body.pisFromSO || false,
                    pSalesOrderID: req.body.refSoID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                _.values(response[0]), null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
    },
    // GET list of pending Sales order shipping details for other charges type part
    // Get : /api/v1/customerPackingSlip/getSOPendingShippingListForOtherCharges
    // @param {salesorderID} int
    // @return list of pending sales order shipping list
    getSOPendingShippingListForOtherCharges: (req, res) => {
        if (req.body && req.body.salesOrderID) {
            const {
                sequelize
            } = req.app.locals.models;
            return sequelize.query('CALL Sproc_GetPendingSalesShippingDetForOtherCharges (:psalesorderID)', {
                replacements: {
                    psalesorderID: req.body.salesOrderID
                }
            }).then(shippingsalesorderList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, shippingsalesorderList, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Save Other Charges
    // Get : /api/v1/customerPackingSlip/saveOtherChargesDetailInInvoice
    // @param {salesorderID} int
    // Return  Success/Failed
    saveOtherChargesDetailInInvoice: (req, t, detailData) => {
        const { CustomerPackingSlipOtherExpenseDetails, CustomerPackingSlipDet } = req.app.locals.models;
        const ObjDetailUpdate = [];
        const promiseUpdate = [];
        detailData = _.uniqBy(detailData, 'refSalesorderDetId');
        // let otherDetails;
        if (req.body && (req.body.otherChargeDetail.length > 0 || (req.body.removeOtherChargesIds && req.body.removeOtherChargesIds.length > 0))) {
            _.each(req.body.otherChargeDetail, (item) => {
                item.isDeleted = 0;
                _.each(detailData, (itemDet) => {
                    if (itemDet.refSalesorderDetId === item.refSalesorderDetid || itemDet.reflineID === item.reflineID) {
                        item.refCustomerPackingSlipDetID = itemDet.detId;
                        item.remark = null;
                        item.isDeleted = 0;
                        ObjDetailUpdate.push({
                            refCustomerPackingSlipDetID: item.refCustomerPackingSlipDetID,
                            price: (item.qty * item.price)
                        });
                    }
                });
            });
            // following case when  removing all  charges from detail line. there will be no details. so add manually.
            if (ObjDetailUpdate.length === 0 && req.body.removeOtherChargesIds && req.body.removeOtherChargesIds.length > 0) {
                _.each(req.body.removeOtherChargesIds, (item) => {
                    ObjDetailUpdate.push({
                        refCustomerPackingSlipDetID: item.refCustomerPackingSlipDetID,
                        price: 0
                    });
                });
            }
            const objInvDet = _(ObjDetailUpdate)
                .groupBy('refCustomerPackingSlipDetID')
                .map((objs, key) => ({
                    id: parseInt(key),
                    otherCharges: _.sumBy(objs, 'price')
                }))
                .value();
            // otherDetails = _.flatten(req.body.otherChargeDetail);
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.otherChargeDetail);
            return CustomerPackingSlipOtherExpenseDetails.bulkCreate(req.body.otherChargeDetail, {
                updateOnDuplicate: CustomerPackingSlipOtherExpenseInputField,
                transaction: t
            }).then((resIns) => {
                if (resIns) {
                    COMMON.setModelUpdatedByArrayFieldValue(req.user, resIns);
                    _.each(objInvDet, (item) => {
                        promiseUpdate.push(CustomerPackingSlipDet.update(item, {
                            where: { id: item.id },
                            fields: ['id', 'otherCharges', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                            transaction: t
                        })
                        );
                    });
                    if (req.body.removeOtherChargesIds && req.body.removeOtherChargesIds.length > 0) {
                        COMMON.setModelDeletedByArrayFieldValue(req.user, req.body.removeOtherChargesIds);
                        promiseUpdate.push(CustomerPackingSlipOtherExpenseDetails.bulkCreate(req.body.removeOtherChargesIds, {
                            updateOnDuplicate: CustomerPackingSlipOtherExpenseInputField,
                            transaction: t
                        }));
                    }
                    return Promise.all(promiseUpdate).then(() => {
                        return { status: STATE.SUCCESS };
                    }).catch((err) => {
                        return { status: STATE.FAILED, err: err };
                    });
                } else {
                    return Promise.resolve(STATE.FAILED);
                }
            });
        } else {
            return Promise.resolve(STATE.SUCCESS);
        }
    },
    // GET Count of Invoice document and packingslip documents
    // POST : /api/v1/customerPackingSlip/getInvoiceDocumentCount
    // @param {invoiceID} int
    // @return countData(invoiceData)
    getInvoiceDocumentCount: (req, res) => {
        if (req.body && req.body.invoiceId) {
            const { sequelize } = req.app.locals.models;
            return sequelize.query('CALL Sproc_getInvoiceDocumentCount (:pInvoiceID)', {
                replacements: {
                    pInvoiceID: req.body.invoiceId
                }
            }).then(invoiceData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, invoiceData, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Update Lock status  of Invoice
    // POST : /api/v1/customerPackingSlip/updateInvoiceLockStatus
    // @param {invoiceID} int
    // @return SUCCESS
    updateInvoiceLockStatus: (req, res) => {
        const { sequelize, CustomerPackingSlip } = req.app.locals.models;
        const promises = [];
        if (req && req.body && req.body.packingSlipObj && req.body.packingSlipObj.length && req.body.transType) {
            if (req.body.transType === 'P') {
                COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.packingSlipObj);
                return sequelize.transaction().then((t) => {
                    _.each(req.body.packingSlipObj, (item) => {
                        item.lockedAt = COMMON.getCurrentUTC();
                        item.lockedBy = req.user.id;
                        item.lockedByRole = req.user.defaultLoginRoleID;
                        promises.push(CustomerPackingSlip.update(item, {
                            where: { id: item.id },
                            fields: ['id', 'isLocked', 'lockedAt', 'lockedBy', 'lockedByRole', 'updatedAt', 'updatedBy', 'updatedByRole'],
                            transaction: t
                        }));
                    });
                    return Promise.all(promises).then(() => t.commit().then(() => {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.LOCKED_SUCCESSFULLY);
                        // if (req.body.transType === 'P') {
                        messageContent.message = COMMON.stringFormat(messageContent.message, 'Customer Packing Slip(s)');
                        // } else if (req.body.transType === DATA_CONSTANT.CUST_INVOICE) {
                        //    messageContent.message = COMMON.stringFormat(messageContent.message, 'Customer Invoice(s)');
                        // } else {
                        //    messageContent.message = COMMON.stringFormat(messageContent.message, 'Customer Credit Memo(s)');
                        // }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }));
                });
            } else {
                // Note: Sproc_LockUnlockCustInvCMTransaction SP used in applied CM payment lock/unlock transaction too
                return sequelize.transaction().then(t => sequelize
                    .query('CALL Sproc_LockUnlockCustInvCMTransaction (:pIsLockTransaction,:pCustInvCMList,:pTransType,:pRefPaymentMode,:pIsViewToBeLockUnlockRecords,:pUserID,:pUserRoleID)', {
                        replacements: {
                            pIsLockTransaction: req.body.isLockTransaction,
                            pCustInvCMList: JSON.stringify(req.body.packingSlipObj),
                            pTransType: req.body.transType,
                            pRefPaymentMode: null,
                            pIsViewToBeLockUnlockRecords: req.body.isViewToBeLockUnlockRecords,
                            pUserID: req.user.id,
                            pUserRoleID: req.user.defaultLoginRoleID
                        },
                        type: sequelize.QueryTypes.SELECT,
                        transaction: t
                    }).then((respOfLockUnlockTrans) => {
                        const respOfLockUnlockInvCMTrans = respOfLockUnlockTrans;

                        if (!respOfLockUnlockInvCMTrans || respOfLockUnlockInvCMTrans.length === 0 || !_.values(respOfLockUnlockInvCMTrans[0]) || (_.first(_.values(respOfLockUnlockInvCMTrans[0]))).spStatus !== 1) {
                            t.rollback();
                            const respOfSomeInvCMWhichNotFullyApplied = _.values(respOfLockUnlockInvCMTrans[1]);
                            const respOfSomeInvCMAlreadyLockedUnlocked = _.values(respOfLockUnlockInvCMTrans[2]);
                            const respOfToBeLockUnlockInvCMPMTList = _.values(respOfLockUnlockInvCMTrans[5]);

                            if (respOfSomeInvCMWhichNotFullyApplied && (_.first(_.values(respOfSomeInvCMWhichNotFullyApplied))).isAnyInvCMWhichNotFullyApplied > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: null,
                                    err: null,
                                    data: {
                                        isAnyInvCMWhichNotFullyApplied: true
                                    }
                                });
                            } else if (respOfSomeInvCMAlreadyLockedUnlocked && (_.first(_.values(respOfSomeInvCMAlreadyLockedUnlocked))).isSomeInvCMAlreadyLockedUnlocked > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: null,
                                    err: null,
                                    data: {
                                        isSomeInvCMAlreadyLockedUnlocked: true
                                    }
                                });
                            } else if (req.body.isViewToBeLockUnlockRecords && respOfToBeLockUnlockInvCMPMTList && respOfToBeLockUnlockInvCMPMTList.length > 0) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    toBeLockUnlockInvCMPMTList: respOfToBeLockUnlockInvCMPMTList
                                }, null);
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                            }
                        } else {
                            return t.commit().then(() => {
                                let msgContForLockUnlock = null;
                                if (req.body.isLockTransaction) {
                                    msgContForLockUnlock = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.LOCKED_SUCCESSFULLY);
                                } else {
                                    msgContForLockUnlock = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.UNLOCKED_SUCCESSFULLY);
                                }

                                if (req.body.transType === DATA_CONSTANT.CUST_INVOICE) {
                                    msgContForLockUnlock.message = COMMON.stringFormat(msgContForLockUnlock.message, 'Customer invoice');
                                } else if (req.body.transType === DATA_CONSTANT.CUST_CREDIT_MEMO) {
                                    msgContForLockUnlock.message = COMMON.stringFormat(msgContForLockUnlock.message, 'Customer credit memo');
                                }
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, msgContForLockUnlock);
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Remove Customer packing slip detail
    // PUT : /api/v1/deleteCustomerInvoiceDetail
    // @param {id} int
    // @return Upadted Invoice details
    deleteCustomerInvoiceDetail: (req, res) => {
        const {
            sequelize, CustomerPackingSlip
        } = req.app.locals.models;
        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Customer_PackingSlip_DET.Name;
            const entityID = COMMON.AllEntityIDS.Customer_PackingSlip_DET.ID;
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: req.body.objIDs.CustomerPackingSlipID.toString(), // if no sales order details added than remove Customer packing slip  master details
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                },
                transaction: t
            }).then((customerPackingSlipDet) => {
                if (customerPackingSlipDet.length === 0) {
                    if (req.body.objIDs && req.body.objIDs.id.length > 0) {
                        EnterpriseSearchController.deleteCustomerInvoiceMaterialInElastic(req.body.objIDs.id.toString());
                    }
                    if (req.body.objIDs.revision < 10) {
                        req.body.objIDs.revision = COMMON.stringFormat('0{0}', parseInt(req.body.objIDs.revision));
                    }
                    const updateObj = {
                        revision: req.body.objIDs.revision
                    };
                    // rearrange lineID column for customer packing slip details
                    const promises = [];
                    let moduleName;
                    promises.push(module.exports.rearrangeLineForCustomerPackingSlipDetDataPromise(req, t));
                    promises.push(CustomerPackingSlip.update(updateObj, {
                        where: { id: req.body.objIDs.invoiceId },
                        fields: ['revision'],
                        transaction: t
                    }));
                    return Promise.all(promises).then(() =>
                        t.commit().then(() => {
                            if (!req.body.objIDs.isInvoice) {
                                moduleName = custPackingModuleName;
                            } else if (req.body.objIDs.transType === 'C') {
                                moduleName = stringFormat('{0} {1}', custCrNoteModuleName, 'detail');
                            } else {
                                moduleName = stringFormat('{0} {1}', custInvoiceModuleName, 'detail');
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(moduleName));
                        })
                    ).catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    t.rollback();
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: customerPackingSlipDet,
                        IDs: req.body.objIDs.id
                    }, null);
                }
            }).catch((err) => {
                t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // GET Customer packing slip number based on packing slip number
    // POST : /api/v1/getCustomerInvoiceNumbers
    // @return latest packing slip available number
    getCustomerInvoiceNumber: (req, res, t) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const objResponse = {};
            return sequelize.query('CALL Sproc_GetCustomerInvoiceFormat (:pInvDate,:ppackingSlipNumberPrefix,:pInvoiceNumberPrefix, :pTransType)', {
                replacements: {
                    pInvDate: req.body.transType === DATA_CONSTANT.CUST_INVOICE ? req.body.invoiceDate : req.body.creditMemoDate,
                    ppackingSlipNumberPrefix: COMMON.PrefixForGeneratePackingSlip.CustomerPackingSlip,
                    pInvoiceNumberPrefix: req.body.transType === DATA_CONSTANT.CUST_INVOICE ? COMMON.PrefixForGeneratePackingSlip.invoiceNumberSlip : COMMON.PrefixForGeneratePackingSlip.creditMemo,
                    pTransType: req.body.transType
                },
                transaction: t
            }).then((packingSlipDetails) => {
                if (packingSlipDetails && packingSlipDetails.length > 0 && packingSlipDetails[0].pdateformat) {
                    if (req.body.transType === DATA_CONSTANT.CUST_INVOICE) {
                        req.body.invoiceNumber = moment(req.body.invoiceDate).format(packingSlipDetails[0].pdateformat);
                        req.body.packingSlipNumber = moment(req.body.invoiceDate).format(packingSlipDetails[0].pdateformat);
                        COMMON.setCustomerInvoice(req, (packingSlipDetails[0].maxPackingID + 1)); // set packing slip number format
                        COMMON.setCustomerPackingSlip(req, (packingSlipDetails[0].maxPackingID + 1));
                        objResponse.invoiceNUmber = req.body.invoiceNumber;
                    } else {
                        req.body.creditMemoNumber = moment(req.body.creditMemoDate).format(packingSlipDetails[0].pdateformat);
                        COMMON.setCustomerCreditMemo(req, (packingSlipDetails[0].maxPackingID + 1));
                        objResponse.creditMemoNumber = req.body.creditMemoNumber;
                    }
                    return objResponse;
                } else {
                    return objResponse;
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) { t.rollback(); }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            if (!t.finished) { t.rollback(); }
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Check Customer credit memo number must be unique
    // POST : /api/v1/checkUniqueCreditMemoNumber
    // @return get existintg credit memo number
    checkUniqueCreditMemoNumber: (req, res) => {
        const { CustomerPackingSlip } = req.app.locals.models;
        let whereClauase;
        if (req.body && req.body.creditMemoNumber) {
            whereClauase = { creditMemoNumber: req.body.creditMemoNumber };
            return CustomerPackingSlip.findAll({
                where: whereClauase,
                model: CustomerPackingSlip,
                attributes: ['id', 'creditMemoNumber']
            }).then((resFind) => {
                if (resFind && resFind.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.CUST_CRNOTE_UNIQUE_CHECK_FIELDS_NAME.CREDITMEMONUMBER), err: null, data: { isDuplicateEmail: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch(err => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Save Other Charges
    // Get : /api/v1/customerPackingSlip/saveOtherChargesDetailInInvoiceDetail
    // @param {salesorderID} int
    // Return  Response on UI
    saveOtherChargesDetailInInvoiceDetail: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            // req.body.detailData = _.uniqBy(req.body.detailData, 'refSalesorderDetId');
            return sequelize.transaction().then(t => module.exports.saveOtherChargesDetailInInvoice(req, t, req.body.detailData).then((resOther) => {
                if (resOther.status === STATE.SUCCESS) {
                    return module.exports.updateCustomerInvoiceMasterAfterDetailSave(req, t).then((resMst) => {
                        if (resMst.status === STATE.SUCCESS) {
                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resMst && resMst.data ? _.values(resMst.data[0]) : null, MESSAGE_CONSTANT.UPDATED('Customer Invoice')));
                        } else {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(resMst.err);
                            return t.rollback().then(() => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null }));
                        }
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return t.rollback().then(() => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: resOther.err, data: null }));
                }
            }).catch((err) => {
                if (!t.finished) { t.rollback(); }
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get List of Component Sid Stock
    // POST : /api/v1/customerpackingslip/getUMIDListForCustomerPackingSlip
    // @return retrive list of Component sid stock
    getUMIDListForCustomerPackingSlip: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            let filter = null;
            let strWhere = '';

            filter = COMMON.UiGridFilterSearch(req);

            if (req.body.isInStock === true || req.body.isInStock === false) {
                if (strWhere) {
                    strWhere += ' AND ';
                }
                strWhere += ` ( isinStk = ${req.body.isInStock} ) `;
            }

            if (strWhere === '') {
                strWhere = null;
            }

            return sequelize.query('CALL Sproc_GetUMIDListForCustomerPackingSlip (:pOrderBy,:pWhereClause,:pPartId, :pExpiredDay,:pPackingSlipDetId)', {
                replacements: {
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pPartId: req.body.partId || null,
                    pExpiredDay: req.body.expiredDay ? req.body.expiredDay : 0,
                    pPackingSlipDetId: req.body.packingSlipDetId || null
                },
                type: sequelize.QueryTypes.SELECT
            })
                .then(response => resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    component: _.values(response[2]),
                    warehouse: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
                }, null
                )).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // GET Count of Packing Slip document
    // POST : /api/v1/customerPackingSlip/getCustomerPackingSlipDocumentCount
    // @param {packingSlipId} int
    // @return countData(invoiceData)
    getCustomerPackingSlipDocumentCount: (req, res) => {
        if (req.body && req.body.packingSlipId) {
            const { sequelize } = req.app.locals.models;
            return sequelize.query('CALL Sproc_getCustomerPackingSlipDocumentCount (:pPackingSlipId)', {
                replacements: {
                    pPackingSlipId: req.body.packingSlipId
                }
            }).then(resData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resData, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Check Customer ref. Debit memo number must be unique
    // POST : /api/v1/checkUniqueRefDebitMemoNumber
    // @return get existintg ref Debit memo number
    checkUniqueRefDebitMemoNumber: (req, res) => {
        const { CustomerPackingSlip } = req.app.locals.models;
        let whereClauase;
        if (req.body && req.body.refDebitMemoNumber) {
            whereClauase = {
                refDebitMemoNumber: req.body.refDebitMemoNumber,
                customerId: req.body.customerId
            };
            if (req.body.id) {
                whereClauase.id = { [Op.ne]: req.body.id };
            }
            return CustomerPackingSlip.findAll({
                where: whereClauase,
                model: CustomerPackingSlip,
                attributes: ['id', 'refDebitMemoNumber']
            }).then((resFind) => {
                if (resFind && resFind.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateEmail: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch(err => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get customer invoice payment current balance and past due amount
    // POST : /api/v1/customerPackingSlip/retrieveCustInvCurrBalanceAndPastDue
    // @return List of customer invoice payment current balance and past due
    retrieveCustInvCurrBalanceAndPastDue: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var strWhere = '';
        var dataObject = '';
        if (req.body && req.body.requestType && (req.body.agedReceivablesDueAsOfDate || req.body.dueDate)) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }

            return sequelize
                .query('CALL Sproc_GetCustomerPaymentBalanceAndPastDue(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pRequestType,:pAgedReceivablesDueAsOfDate,:pDueDate,:pAdditionalDays,:pTermsAndAboveDays,:pIsIncludeZeroValueInvoices)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pRequestType: req.body.requestType,
                        pAgedReceivablesDueAsOfDate: req.body.agedReceivablesDueAsOfDate ? req.body.agedReceivablesDueAsOfDate : null,
                        pDueDate: req.body.dueDate ? req.body.dueDate : null,
                        pAdditionalDays: req.body.additionalDays ? req.body.additionalDays : null,
                        pTermsAndAboveDays: req.body.termsAndAboveDays ? req.body.termsAndAboveDays : null,
                        pIsIncludeZeroValueInvoices: req.body.isIncludeZeroValueInvoices || false
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    if (response) {
                        dataObject = {
                            balanceDueList: _.values(response[1]),
                            Count: response[0][0]['TotalRecord']
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataObject, null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // save commission detail of invoice
    // return status
    saveSalesCommissionDetails: (req, res, t, detailRow) => {
        const { sequelize } = req.app.locals.models;
        // var promises = [];
        if (req.body && detailRow) {
            const invData = [];
            const childinvData = [];
            _.each(detailRow, (det) => {
                invData.push({
                    id: det.id || {},
                    refCustPackingSlipDetID: det.refCustPackingSlipDetID || {},
                    salesCommissionNotes: det.salesCommissionNotes || {},
                    commissionCalculateFrom: det.commissionCalculateFrom || {},
                    type: det.type || {},
                    poQty: det.qty || {},
                    quotedQty: det.quotedQty || {},
                    unitPrice: det.unitPrice || {},
                    commissionPercentage: det.commissionPercentage || {},
                    commissionValue: det.commissionValue || {},
                    quoted_unitPrice: det.quoted_unitPrice || {},
                    quoted_commissionPercentage: det.quoted_commissionPercentage || {},
                    quoted_commissionValue: det.quoted_commissionValue || {},
                    partId: (det.partId ? det.partId : req.body.partId) || {},
                    refComponentSalesPriceBreakID: det.refComponentSalesPriceBreakID || {},
                    rfqAssyID: det.rfqAssyID || {}
                });
                _.each(det.childSalesCommissionList, (childDet) => {
                    childinvData.push({
                        id: childDet.id || {},
                        refCustPackingSlipDetID: det.refCustPackingSlipDetID || {},
                        refcustInvoiceCommissionID: childDet.refcustInvoiceCommissionID || {},
                        unitPrice: childDet.unitPrice || {},
                        refQuoteAttributeId: childDet.refQuoteAttributeId || {},
                        commissionPercentage: childDet.commissionPercentage || {},
                        commissionValue: childDet.commissionValue || {},
                        org_unitPrice: childDet.org_unitPrice || {},
                        org_commissionPercentage: childDet.org_commissionPercentage || {},
                        org_commissionValue: childDet.org_commissionValue || {},
                        category: childDet.category || {},
                        partId: (childDet.partId ? childDet.partId : req.body.partId) || {},
                        refComponentSalesPriceBreakID: childDet.refComponentSalesPriceBreakID || {}
                    });
                });
            });
            return sequelize.query('CALL Sproc_SaveCustomerPackingSlipSalesCommission(:pTransType,:pInvoiceID,:pInvData,:puserID,:puserRoleID, :pDeletedIds,:pInvDetId, :pInvChildData)', {
                replacements: {
                    pTransType: req.body.transType || null,
                    pInvoiceID: req.body.invoiceId || null,
                    pInvData: JSON.stringify(invData),
                    puserID: req.user.id || null,
                    puserRoleID: COMMON.getRequestUserLoginRoleID(req),
                    pDeletedIds: (req.body.deletedComissionIds && req.body.deletedComissionIds.length > 0 ? req.body.deletedComissionIds.toString() : null),
                    pInvDetId: req.body.id || null,
                    pInvChildData: JSON.stringify(childinvData)
                },
                transaction: t,
                type: sequelize.QueryTypes.SELECT
            }).then((commResp) => {
                const mstsalesCommission = _.values(commResp[0]);
                const childsalesCommission = _.values(commResp[1]);
                _.each(mstsalesCommission, (item) => {
                    const fltommission = _.filter(childsalesCommission, chdComm => chdComm.refcustInvoiceCommissionID === item.id);
                    item.childSalesCommissionList = fltommission;
                });
                return ({ status: STATE.SUCCESS, data: mstsalesCommission });
            }).catch((err) => {
                if (!t.finished) { t.rollback(); }
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err: err };
            });
        } else {
            return { status: STATE.SUCCESS };
        }
    },

    // Save commission detail added manualy
    // POST : /api/v1/customerPackingSlip/saveSalesCommissionDetailsManual
    // @return Success/Error Response
    saveSalesCommissionDetailsManual: (req, res) => {
        const { sequelize, CustomerPackingSlip, CustomerPackingSlipDet } = req.app.locals.models;
        const promises = [];
        if (req.body && req.body.salesCommissionList) {
            return sequelize.transaction().then((t) => {
                const detailData = req.body.salesCommissionList;
                return module.exports.saveSalesCommissionDetails(req, res, t, detailData).then((resSave) => {
                    if (resSave.status === STATE.SUCCESS) {
                        if (req.body.revision < 10) {
                            req.body.revision = COMMON.stringFormat('0{0}', parseInt(req.body.revision));
                        }
                        const updateObj = {
                            revision: req.body.revision
                        };
                        const updateObject = {
                            unitPrice: req.body.unitPrice
                        };

                        promises.push(CustomerPackingSlip.update(updateObj, {
                            where: {
                                id: req.body.invoiceId,
                                isDeleted: false
                            },
                            fields: ['revision'],
                            transaction: t
                        }).then(() => CustomerPackingSlip.findOne({
                            where: {
                                id: req.body.invoiceId,
                                isDeleted: false
                            },
                            attributes: ['revision']
                        }).then(resFind => (Promise.resolve({ status: STATE.SUCCESS, data: _.values(resFind)[0] })))
                        ).catch((err) => {
                            console.error(err);
                            console.trace();
                            return STATE.FAILED;
                        }));
                        promises.push(
                            CustomerPackingSlipDet.update(updateObject, {
                                where: {
                                    id: req.body.id,
                                    isDeleted: false
                                },
                                fields: ['unitPrice'],
                                transaction: t
                            }).then(() => (Promise.resolve({ status: STATE.SUCCESS }))).catch((err) => {
                                console.error(err);
                                console.trace();
                                return STATE.FAILED;
                            })
                        );
                        return Promise.all(promises).then((respOfPromises) => {
                            if (respOfPromises && respOfPromises.length > 0 && respOfPromises[0].status === STATE.SUCCESS) {
                                return t.commit().then(() => { resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { data: resSave.data, revision: respOfPromises[0].data.revision }, MESSAGE_CONSTANT.UPDATED(salesCommissionModuleName)); });
                            } else {
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                            }
                        });
                    } else {
                        console.trace();
                        console.error(resSave.err);
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: resSave.err, data: resSave.data });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get customer Other expense added at line level
    // POST : /api/v1/customerPackingSlip/getCustomerOtherExpenseByDetailId
    // @return List of Expense added at line level of packing slip/invoice
    getCustomerOtherExpenseByDetailId: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.detId) {
            return sequelize.query('CALL Sproc_getCustomerPackingSlipOtherExpensesByDetailId(:pDetailId)', {
                replacements: {
                    pDetailId: req.body.detId
                },
                type: sequelize.QueryTypes.SELECT
            }).then(resData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { otherDetail: _.values(resData[0]) }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // GET Customer packing slip number based on packing slip number to display on UI only
    // POST : /api/v1/getCustomerPackingSlipNumberForUI
    // @return latest packing slip available number
    getCustomerPackingSlipNumberForUI: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetCustomerPackingSlipFormat (:ppackingSlipDate,:ppackingSlipNumberPrefix)', {
                replacements: {
                    ppackingSlipDate: req.body.packingSlipDate,
                    ppackingSlipNumberPrefix: COMMON.PrefixForGeneratePackingSlip.CustomerPackingSlip
                }
            }).then((packingSlipDetails) => {
                if (packingSlipDetails && packingSlipDetails.length > 0 && packingSlipDetails[0].pdateformat) {
                    req.body.packingSlipNumber = moment(req.body.packingSlipDate).format(packingSlipDetails[0].pdateformat);
                    COMMON.setCustomerPackingSlip(req, (packingSlipDetails[0].maxPackingID + 1)); // set packing slip number format
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body.packingSlipNumber, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(custPackingModuleName), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);

                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Update Customer Invoice header table after add/update in detail
    updateCustomerInvoiceMasterAfterDetailSave: (req, t) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.invoiceId) {
            return sequelize.query('CALL sproc_updateCustomerInvoiceMasterAfterDetailChange(:pInvoiceId,:pTotalAmount,:pUserId, :pUserRoleId, :pRevision, :pIsAskForVersionConfirmation)', {
                replacements: {
                    pInvoiceId: req.body.invoiceId,
                    pTotalAmount: parseFloat(req.body.totalAmount),
                    pUserId: req.user.id,
                    pUserRoleId: COMMON.getRequestUserLoginRoleID(req),
                    pRevision: req.body.revision || null,
                    pIsAskForVersionConfirmation: req.body.isAskForVersionConfirmation || 0
                },
                transaction: t,
                type: sequelize.QueryTypes.SELECT
            }).then(resUpd => ({ status: STATE.SUCCESS, data: resUpd[0] })).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err: err };
            });
        } else {
            return { status: STATE.FAILED, err: null };
        }
    },
    // Check While creating MISC packing slip if
    // POST : /api/v1/getCustomerPackingSlipNumberForUI
    // @return latest packing slip available number
    checkMiscPackingSlipForSOPONumber: (req, res) => {
        const { SalesOrderMst } = req.app.locals.models;
        if (req.body && (req.body.poNumber || req.body.soNumber)) {
            const whereClauase = {
                [Op.or]: {
                    poNumber: req.body.poNumber || null,
                    salesOrderNumber: req.body.soNumber || null
                },
                customerID: req.body.customerID,
                isDeleted: false
            };
            return SalesOrderMst.count({
                where: whereClauase
            }).then((resCheck) => {
                if (resCheck && resCheck > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: null, err: null, data: resCheck });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
        }
    },
    // GET All credit memo list of defined customer
    // GET : /api/v1/customerPackingSlip/getAllCreditMemoListByCustomer
    // @return detail of customer credit memo
    getAllCreditMemoListByCustomer: (req, res) => {
        if (req.body && req.body.custPayInfo && req.body.custPayInfo.customerID && req.body.custPayInfo.transTypeForCreditMemo) {
            const {
                CustomerPackingSlip, PackingslipInvoicePayment
            } = req.app.locals.models;

            const whereClause = {
                isDeleted: false,
                transType: req.body.custPayInfo.transTypeForCreditMemo,
                customerID: req.body.custPayInfo.customerID,
                subStatus: req.body.custPayInfo.subStatus
            };
            if (!req.body.custPayInfo.custPaymentMstID) {
                whereClause.paymentStatus = { [Op.in]: [DATA_CONSTANT.InvoicePaymentStatus.Pending, DATA_CONSTANT.InvoicePaymentStatus.PartialReceived] };
                whereClause['$packingslipInvoicePayment.refCustCreditMemoID$'] = { [Op.eq]: null };
            }

            return CustomerPackingSlip.findAll({
                where: whereClause,
                attributes: ['id', 'creditMemoNumber', 'creditMemoDate', 'totalAmount'],
                include: [{
                    model: PackingslipInvoicePayment,
                    as: 'packingslipInvoicePayment',
                    where: {
                        isDeleted: false,
                        isPaymentVoided: false
                    },
                    attributes: [],
                    required: false
                }]
            }).then(creditMemoList =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    customerCreditMemoList: creditMemoList || []
                }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // GET credit memo basic details with payment for apply in customer payment
    // GET : /api/v1/customerPackingSlip/getCreditMemoDetailForApplyInInvPayment
    // @return detail of credit memo
    getCreditMemoDetailForApplyInInvPayment: (req, res) => {
        if (req.body && req.body.custCreditMemoMstID && req.body.creditMemoTransType) {
            const { sequelize } = req.app.locals.models;

            return sequelize.query('CALL Sproc_GetCreditMemoDetailForApplyInInvByMstID (:pCustCreditMemoMstID,:pCustomerPaymentMstID)', {
                replacements: {
                    pCustCreditMemoMstID: req.body.custCreditMemoMstID,
                    pCustomerPaymentMstID: req.body.customerPaymentMstID || null
                },
                type: sequelize.QueryTypes.SELECT
            })
                .then((creditMemoDet) => {
                    if (!creditMemoDet || !creditMemoDet[0] || !_.values(creditMemoDet[0])) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(custCrNoteModuleName), err: null, data: null });
                    }
                    creditMemoDet = _.first(_.values(creditMemoDet[0]));
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                        { custCreditMemoMstData: creditMemoDet }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // POST Retrive tracking numbers based on customer PackingSlip id
    // POST : /api/v1/customerPackingSlip/getCustPackingSlipAndInvoiceTrackingNumber
    // @return list of tracking number
    getCustPackingSlipAndInvoiceTrackingNumber: (req, res) => {
        if (req.body && req.body.custPackingSlipID) {
            const { CustomerPackingSlipTrackNumber } = req.app.locals.models;
            return CustomerPackingSlipTrackNumber.findAll({
                where: {
                    refCustPackingSlipID: req.body.custPackingSlipID,
                    isDeleted: false
                },
                attributes: ['id', 'trackNumber']
            }).then(trackingNumList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                { TrackingNumbers: trackingNumList }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // POST save customer PackingSlip and Invoice tracking numbers
    // POST : /api/v1/customerPackingSlip/saveCustPackingSlipAndInvoiceTrackingNumber
    saveCustPackingSlipAndInvoiceTrackingNumber: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.custPackingSlipID) {
            const requiredDetForTrackingNumber = {
                packingSlipMasterID: req.body.custPackingSlipID
            };
            return sequelize.transaction().then(t => module.exports.addUpdatePackingSlipTrackingNumber(req, requiredDetForTrackingNumber, t).then((trackingResponse) => {
                if (trackingResponse.status === STATE.SUCCESS) {
                    const promises = [];
                    if (req.body.custInvoiceID) {
                        const requiredDetForTrackingNumberPackingSlip = {
                            packingSlipMasterID: req.body.custInvoiceID
                        };
                        promises.push(module.exports.addUpdatePackingSlipTrackingNumber(req, requiredDetForTrackingNumberPackingSlip, t));
                    }
                    return Promise.all(promises).then((resPromise) => {
                        if (promises && promises.length === 0) {
                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(custPackingSlipAndInvoiceModuleName)));
                        } else if (resPromise && resPromise.length > 0) {
                            const failResp = _.find(resPromise, item => item.status === STATE.FAILED);
                            if (failResp) {
                                if (!t.finished) { t.rollback(); }
                                if (failResp.err.parent.sqlState === '23000') {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Tracking#'), err: null, data: null });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failResp.err, data: null
                                    });
                                }
                            } else {
                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(custPackingSlipAndInvoiceModuleName)));
                            }
                        } else {
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null
                            });
                        }
                    }).catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else if (trackingResponse.err.parent.sqlState === '23000') {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Tracking#'), err: null, data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.SOMTHING_WRONG, err: trackingResponse && trackingResponse.err ? trackingResponse.err : null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (t.finished) { t.rollback(); }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            })).catch((err) => {
                console.trace();
                console.error(err);
                // if (!t.finished) { t.rollback(); }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null
            });
        }
    },

    saveCustomerOtherChargesWithDetail: (req, otherChargesList, packingSlipID, packingSlipDetID, t) => {
        const { CustomerPackingSlipDet } = req.app.locals.models;
        const custPromise = [];
        _.each(otherChargesList, (item) => {
            if (item.isadd) {
                item.refCustPackingSlipDetID = packingSlipDetID;
                item.createdBy = req.user.id;
                item.updatedBy = req.user.id;
                item.createByRoleId = req.user.defaultLoginRoleID;
                item.updateByRoleId = req.user.defaultLoginRoleID;
                custPromise.push(CustomerPackingSlipDet.create(item, {
                    fields: inputDetailsFields,
                    transaction: t
                }).then(() => {
                    return { status: STATE.SUCCESS };
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return { status: STATE.FAILED, err: err };
                }));
            } else {
                const objRemove = {
                    updatedBy: req.user.id,
                    updateByRoleId: req.user.defaultLoginRoleID,
                    updatedAt: COMMON.getCurrentUTC(),
                    deletedBy: req.user.id,
                    deleteByRoleId: req.user.defaultLoginRoleID,
                    deletedAt: COMMON.getCurrentUTC(),
                    isDeleted: true
                };
                custPromise.push(
                    CustomerPackingSlipDet.update(objRemove, {
                        where: {
                            reflineID: item.reflineID,
                            isDeleted: false,
                            refCustPackingSlipDetID: packingSlipDetID
                        },
                        fields: ['updatedBy', 'updateByRoleId', 'deletedBy', 'deleteByRoleId', 'deletedAt', 'isDeleted', 'updatedAt'],
                        transaction: t
                    }).then(() => {
                        return { status: STATE.SUCCESS };
                    }).catch((err) => {
                        console.error(err);
                        console.trace();
                        return { status: STATE.FAILED, err: err };
                    })
                );
            }
        });
        return Promise.all(custPromise).then((response) => {
            const objResponse = _.find(response, item => item.status === STATE.FAILED);
            if (objResponse) {
                return objResponse;
            } else {
                return { status: STATE.SUCCESS };
            }
        });
    },
    // GET invoice other charges  detail
    // GET : /api/v1/getCustomerInvoiceDetailByID
    // @param {id} int
    // @return detail of invoice
    getSalesOtherByPackingSlipDetId: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.detId) {
            return sequelize.query('CALL Sproc_getLineOtherChargesByPackignSlipDetId(:pCustPackingSlipDetId)', {
                replacements: {
                    pCustPackingSlipDetId: req.body.detId
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Get customer aged receivable invoice range details
    // POST : /api/v1/customerPackingSlip/getCustAgedRecvRangeDetails
    // @return List of customer invoice payment current balance and past due range details
    getCustAgedRecvRangeDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var strWhere = '';
        var dataObject = '';
        if (req.body && (req.body.agedReceivablesDueAsOfDate || req.body.dueDate)) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }

            return sequelize
                .query('CALL Sproc_GetCustAgedReceivablesRangeDet(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pAgedReceivablesDueAsOfDate,:pDueDate,:pAdditionalDays,:pTermsAndAboveDays,:pIsIncludeZeroValueInvoices,:pCustomerID,:pAgedRecvAmtWithIn,:pIsAllCustAllInvOnly,:pIsAllCustAllUninvOnly,:pIsAllCustAllDraftCMOnly,:pIsAllCustAllPSWithOutInv)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pAgedReceivablesDueAsOfDate: req.body.agedReceivablesDueAsOfDate || null,
                        pDueDate: req.body.dueDate ? req.body.dueDate : null,
                        pAdditionalDays: req.body.additionalDays || null,
                        pTermsAndAboveDays: req.body.termsAndAboveDays || null,
                        pIsIncludeZeroValueInvoices: req.body.isIncludeZeroValueInvoices || false,
                        pCustomerID: req.body.customerID ? req.body.customerID.toString() : null,
                        pAgedRecvAmtWithIn: req.body.agedRecvAmtWithIn || null,
                        pIsAllCustAllInvOnly: req.body.isAllCustAllInvOnly || false,
                        pIsAllCustAllUninvOnly: req.body.isAllCustAllUninvOnly || false,
                        pIsAllCustAllDraftCMOnly: req.body.isAllCustAllDraftCMOnly || false,
                        pIsAllCustAllPSWithOutInv: req.body.isAllCustAllPSWithOutInv || false
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    if (response) {
                        dataObject = {
                            balanceDueList: _.values(response[1]),
                            Count: response[0][0]['TotalRecord']
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataObject, null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Create Customer Packing Slip through SP
    //  POST : /api/v1/customerPackingSlip/saveCustomerPackingSlipFromSO
    saveCustomerPackingSlipFromSO: (req, res) => {
        const { sequelize, SalesOrderMst } = req.app.locals.models;
        if (req.body) {
            const packingSlipData = [{
                transType: 'P',
                packingSlipType: 2, // for PO/SO Packing Slip only
                customerID: req.body.customerID || {},
                status: 0,
                subStatus: 1,
                refSalesOrderID: req.body.refSalesOrderID || {},
                poNumber: req.body.poNumber || {},
                poDate: req.body.poDate || {},
                soNumber: req.body.soNumber || {},
                soDate: req.body.soDate || {},
                sorevision: req.body.sorevision || {},
                packingSlipDate: req.body.packingSlipDate || {},
                shippingMethodID: req.body.shippingMethodID || {},
                headerComment: req.body.headerComment || {},
                packingSlipComment: req.body.packingSlipComment || {},
                billingAddress: req.body.billingAddress || {},
                shippingAddress: req.body.shippingAddress || {},
                intermediateAddress: req.body.intermediateAddress || {},
                billToId: req.body.billingAddressID || {},
                shipToId: req.body.shippingAddressID || {},
                intermediateShipmentId: req.body.intermediateShipmentID || {},
                totalAmount: 0,
                freeOnBoardId: req.body.freeOnBoardId || {},
                termsId: req.body.termsId || {},
                salesCommissionTo: req.body.salesCommissionTo || {},
                contactPersonId: req.body.contactPersonId || {},
                revision: '00',
                isZeroValue: 0,
                isAlreadyPublished: 0,
                poRevision: req.body.poRevision || {},
                isMarkForRefund: 0,
                isAskForVersionConfirmation: 0,
                carrierID: req.body.carrierID || {},
                carrierAccountNumber: req.body.carrierAccountNumber || {},
                billingContactPersonID: req.body.billingContactPersonID || {},
                shippingContactPersonID: req.body.shippingContactPersonID || {},
                intermediateContactPersonID: req.body.intermediateContactPersonID || {},
                billingContactPerson: req.body.billingContactPerson || {},
                shippingContactPerson: req.body.shippingContactPerson || {},
                intermediateContactPerson: req.body.intermediateContactPerson || {}
            }];
            return SalesOrderMst.findOne({
                where: {
                    id: req.body.refSalesOrderID
                },
                attributes: ['id', 'shippingAddressID']
            }).then((resSOData) => {
                if (resSOData && resSOData.dataValues) {
                    if (resSOData.dataValues.shippingAddressID) {
                        req.body.isFromSave = true;
                        // return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(custPackingModuleName));
                        return sequelize.transaction().then(t => module.exports.getCustomerPackingSlipNumber(req, res, t).then((response) => {
                            const promises = [];
                            if (response && response.packingSlipNumber) {
                                req.body.packingSlipNumber = response.packingSlipNumber;
                                packingSlipData[0].packingSlipNumber = response.packingSlipNumber;
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(custPackingModuleName), err: null, data: null });
                            }
                            promises.push(getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.CustomerPackingSlipSystemID, t));
                            return Promise.all(promises).then((respOfPromises) => {
                                if (respOfPromises && respOfPromises.length > 0 && respOfPromises[0] && respOfPromises[0].status === STATE.SUCCESS) {
                                    req.body.systemID = respOfPromises[0].systemId;
                                    return sequelize.query('CALL Sproc_AddCustomerPackingSlip(:pCPSData,:puserID,:puserRoleID, :pSystemId, :pPackingSlipId)', {
                                        replacements: {
                                            pCPSData: JSON.stringify(packingSlipData),
                                            puserID: req.user.id,
                                            puserRoleID: COMMON.getRequestUserLoginRoleID(req),
                                            pSystemId: req.body.systemID,
                                            pPackingSlipId: req.body.packingSlipID || null
                                        },
                                        transaction: t,
                                        type: sequelize.QueryTypes.SELECT
                                    }).then(resSave => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resSave, MESSAGE_CONSTANT.CREATED(custPackingModuleName)))
                                    ).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                } else {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
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
                        }));
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.CUSTOMER_PACKING_SHIP_ALERT, err: null, data: { shipToNotAdded: true } });
                    }
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND('Sales Order'), err: null, data: null });
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

    // Check Duplicate CustPONumber/SO Line in Selected SO# (SOID)
    //  POST : /api/v1/customerPackingSlip/
    checkUniqueSOLineNumber: (req, res) => {
        const { SalesOrderDet, Component } = req.app.locals.models;
        if (req.body.soID) {
            const whereClause = {
                refSalesOrderID: req.body.soID
            };
            if (req.body.custPOLineNumber) {
                whereClause.custPOLineNumber = req.body.custPOLineNumber;
            }
            if (req.body.lineID) {
                whereClause.lineID = req.body.lineID;
            }
            return SalesOrderDet.findAll({
                where: whereClause,
                attributes: ['id', 'refSalesOrderID'],
                include: [{
                    model: Component,
                    as: 'componentAssembly',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgPN', 'PIDCode', 'rev', 'custAssyPN', 'isCustom', 'partType'],
                    required: false
                }]
            }).then((resUniq) => {
                if (resUniq && resUniq.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true, data: resUniq[0] } });
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
    }
};