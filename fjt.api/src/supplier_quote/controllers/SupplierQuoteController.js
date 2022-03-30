const _ = require('lodash');
const {
    Op
} = require('sequelize');
const resHandler = require('../../resHandler');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const GenericFilesController = require('../../genericfiles/controllers/GenericFilesController');
// eslint-disable-next-line import/no-extraneous-dependencies
const Bson = require('bson');

const supplierQuote = DATA_CONSTANT.SUPPLIER_QUOTE.Name;
const supplierQuotePartDetail = DATA_CONSTANT.SUPPLIER_QUOTE_PART_DETAIL.Name;
const supplierQuotePartPriceDetails = DATA_CONSTANT.SUPPLIER_QUOTE_PART_PRICE_DETAIL.Name;
const approvalInputFields = ['id', 'transactionType', 'approveFromPage', 'confirmationType', 'refTableName', 'refID', 'approvedBy', 'approvalReason',
    'isDeleted', 'createdBy', 'updatedBy', 'deletedBy'
];
const SupplierQuoteInputFields = [
    'id',
    'supplierID',
    'quoteNumber',
    'quoteDate',
    'reference',
    'shippingAddressID',
    'billingAddressID',
    'quoteStatus',
    'isDeleted',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'billingAddress',
    'shippingAddress',
    'billingContactPerson',
    'billingContactPersonID',
    'shippingContactPerson',
    'shippingContactPersonID'
];

const SupplierQuotePartDetailInputFields = [
    'id',
    'supplierQuoteMstID',
    'partID',
    'supplierPartID',
    'isActive',
    'isDeleted',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'scanLabel'
];
const SupplierQuotePartAttributesInputFields = [
    'id',
    'supplierQuotePartDetID',
    'attributeID',
    'isDeleted',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const SupplierQuotePartPriceInputFields = [
    'id',
    'supplierQuotePartDetID',
    'itemNumber',
    'qty',
    'leadTime',
    'UnitOfTime',
    'UnitPrice',
    'negotiatePrice',
    'min',
    'mult',
    'stock',
    'packageID',
    'reeling',
    'NCNR',
    'isDeleted',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const SupplierQuotePartPriceAttributeInputFields = [
    'id',
    'supplierQuotePartPriceID',
    'attributeID',
    'Price',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
module.exports = {

    // Retrive list of Supplier Quote
    // POST : /api/v1/supplierQuote/retrieveSupplierQuoteList
    // @return list of Supplier Quote
    retrieveSupplierQuoteList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveSupplierQuote (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pIsSummary,:pSupplierIds,:pQuoteStatus,:pSearchType,:pAdvanceSearchSQ,:pfromDate,:ptoDate,:pPartIds)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pIsSummary: req.body.isSummaryView || false,
                    pSupplierIds: req.body.supplierIds || null,
                    pQuoteStatus: req.body.quoteStatus || null,
                    pSearchType: req.body.searchType,
                    pAdvanceSearchSQ: req.body.advanceSearchSQ || null,
                    pfromDate: req.body.fromDate,
                    ptoDate: req.body.toDate,
                    pPartIds: req.body.partIds || ''
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                SupplierQuote: _.values(response[1]),
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Retrive Supplier Quote by id
    // GET : /api/v1/supplierQuote/getSupplierQuoteByID
    // @return Supplier Quote Detail
    getSupplierQuoteByID: (req, res) => {
        const {
            SupplierQuoteMst,
            MfgCodeMst
        } = req.app.locals.models;
        if (req.params.id) {
            return SupplierQuoteMst.findOne({
                where: {
                    id: req.params.id
                },
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    attributes: ['id', 'mfgCode', 'mfgName'],
                    required: false
                }]
            }).then((response) => {
                if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(supplierQuote),
                        err: null,
                        data: null
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
    // validate quote number
    // GET : /api/v1/supplierQuote/checkUniqueSupplierQuoteNumber
    // @return Supplier Quote Exist
    checkUniqueSupplierQuoteNumber: (req, res, isFromApi) => {
        const {
            SupplierQuoteMst
        } = req.app.locals.models;
        const isFromApiCheck = isFromApi === true ? true : false;
        if (req.body && req.body.quoteNumber && req.body.supplierID) {
            const whereClause = {
                supplierID: req.body.supplierID,
                quoteNumber: req.body.quoteNumber
            };
            if (req.body.id) {
                whereClause.id = {
                    [Op.ne]: req.body.id
                };
            }
            return SupplierQuoteMst.findAll({
                where: whereClause,
                attributes: ['id', 'supplierID', 'quoteNumber']
            }).then((response) => {
                if (isFromApiCheck) {
                    return response;
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
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

    // save supplier quote Detail
    // POST : /api/v1/supplierQuote/saveSupplierQuoteDetail
    saveSupplierQuoteDetail: (req, res) => {
        const {
            SupplierQuoteMst,
            sequelize
        } = req.app.locals.models;
        if (req.body.id) {
            req.body.supplierQuoteMstID = req.body.id;
            return module.exports.checkSupplierQuotePublished(req, res).then((validate) => {
                if (req.body.quoteStatus === DATA_CONSTANT.SUPPLIER_QUOTE_STATUS.PUBLISHED && validate && validate.length > 0) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_QUOTE_PUBLISHED);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'update supplier quote details');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: {
                            published: true
                        }
                    });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return SupplierQuoteMst.findOne({
                        where: {
                            id: req.body.id
                        },
                        attributes: ['id', 'supplierID', 'quoteNumber', 'shippingAddressID', 'shippingContactPersonID', 'billingAddressID', 'billingContactPersonID']
                    }).then((oldSupplierQuoteDet) => {
                        if (!oldSupplierQuoteDet) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                        } else {
                            if (oldSupplierQuoteDet.billingAddressID === req.body.billingAddressID) {
                                COMMON.removeElementFromArray(SupplierQuoteInputFields, 'billingAddress');
                            }
                            if (oldSupplierQuoteDet.billingContactPersonID === req.body.billingContactPersonID) {
                                COMMON.removeElementFromArray(SupplierQuoteInputFields, 'billingContactPerson');
                            }
                            if (oldSupplierQuoteDet.shippingAddressID === req.body.shippingAddressID) {
                                COMMON.removeElementFromArray(SupplierQuoteInputFields, 'shippingAddress');
                            }
                            if (oldSupplierQuoteDet.shippingContactPersonID === req.body.shippingContactPersonID) {
                                COMMON.removeElementFromArray(SupplierQuoteInputFields, 'shippingContactPerson');
                            }
                            COMMON.setModelUpdatedByFieldValue(req);
                            return sequelize.transaction().then(t => SupplierQuoteMst.update(req.body, {
                                where: {
                                    id: req.body.id
                                },
                                fields: SupplierQuoteInputFields,
                                transaction: t
                            }).then(response =>
                                GenericFilesController.manageDocumentPath(req, res, {
                                    gencFileOwnerType: req.body.gencFileOwnerType,
                                    refTransID: req.body.id
                                }, t).then(() => t.commit().then(() => {
                                    EnterpriseSearchController.manageSupplierQuoteInElastic(req);
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(supplierQuote));
                                })).catch((err) => {
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
                                })
                            ).catch((err) => {
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
            });
        } else {
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.transaction().then(t => SupplierQuoteMst.create(req.body, {
                fields: SupplierQuoteInputFields,
                transaction: t
            }).then(response => t.commit().then(() => {
                EnterpriseSearchController.manageSupplierQuoteInElastic(req);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(supplierQuote));
            })).catch((err) => {
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
    },

    // manage supplier quote Detail for save record
    // POST : /api/v1/supplierQuote/manageSupplierQuoteDetail
    manageSupplierQuoteDetail: (req, res) => {
        let label = null;
        if (req.body) {
            return module.exports.checkUniqueSupplierQuoteNumber(req, res, true).then((data) => {
                if (data.length > 0) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Supplier wise Quote#');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: {
                            quoteNumber: true
                        }
                    });
                } else if (req.body.shippingAddressID || req.body.billingAddressID) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
                    if ((req.body.billingAddressID && !req.body.billingContactPersonID) || (!req.body.billingAddressID && req.body.billingContactPersonID)) {
                        label = (req.body.billingAddressID && !req.body.billingContactPersonID) ? `${DATA_CONSTANT.AddressType.BusinessAddress.value} ${DATA_CONSTANT.CONTACT_PERSON.NAME} ` : DATA_CONSTANT.AddressType.BusinessAddress.value;
                        messageContent.message = COMMON.stringFormat(messageContent.message, label);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: {
                                errorMessage: 'ADDRESS_DATA_MISSING'
                            }
                        });
                    } else if ((req.body.shippingAddressID && !req.body.shippingContactPersonID) || (!req.body.shippingAddressID && req.body.shippingContactPersonID)) {
                        label = (req.body.shippingAddressID && !req.body.shippingContactPersonID) ? `${DATA_CONSTANT.AddressType.ShippingAddress.value} ${DATA_CONSTANT.CONTACT_PERSON.NAME} ` : DATA_CONSTANT.AddressType.ShippingAddress.value;
                        messageContent.message = COMMON.stringFormat(messageContent.message, label);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: {
                                errorMessage: 'ADDRESS_DATA_MISSING'
                            }
                        });
                    } else {
                        return module.exports.saveSupplierQuoteDetail(req, res);
                    }
                } else {
                    return module.exports.saveSupplierQuoteDetail(req, res);
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
    // Check supplier quote part unique
    // POST : /api/v1/supplierQuote/checkUniqueSupplierQuotePart
    checkUniqueSupplierQuotePart: (req, res, isFromApi) => {
        const {
            SupplierQuotePartsDet
        } = req.app.locals.models;
        const isFromApiCheck = isFromApi === true ? true : false;
        if (req.body) {
            const whereClause = {
                supplierQuoteMstID: req.body.supplierQuoteMstID,
                partID: req.body.partID
            };
            if (req.body.supplierPartID) {
                whereClause.supplierPartID = req.body.supplierPartID;
            }
            return SupplierQuotePartsDet.findAll({
                where: whereClause,
                attributes: ['id', 'supplierQuoteMstID', 'partID']
            }).then((response) => {
                if (isFromApiCheck) {
                    return response;
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
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
    // save supplier quote part attributes
    manageSupplierPartAttributes: (req, res, supplierQuotePartDetails, t) => {
        const {
            SupplierQuotePartAttribute,
            SupplierQuotePartPrice,
            SupplierQuotePartPriceAttribute
        } = req.app.locals.models;
        if (!req.body.id) {
            const createList = _.map(req.body.selectedAttributes, item => ({
                supplierQuotePartDetID: supplierQuotePartDetails.id,
                attributeID: item.id
            }));
            COMMON.setModelCreatedArrayFieldValue(req.user, createList);
            return SupplierQuotePartAttribute.bulkCreate(createList, {
                fields: SupplierQuotePartAttributesInputFields,
                transaction: t
            }).then(response => response).catch((err) => {
                console.trace();
                console.error(err);
                return false;
            });
        } else {
            const promises = [];
            return module.exports.checkDuplicateAttribute(req, res, req.body.manageAttributes.isCreate, t).then((isExist) => {
                if (isExist && isExist.length > 0) {
                    return {
                        STATE: STATE.EMPTY,
                        attributeError: true,
                        data: isExist
                    };
                } else {
                    if (req.body.manageAttributes.isCreate.length > 0) {
                        const createList = _.map(req.body.manageAttributes.isCreate, item => ({
                            supplierQuotePartDetID: req.body.id,
                            attributeID: item.id
                        }));
                        COMMON.setModelCreatedArrayFieldValue(req.user, createList);
                        promises.push(
                            SupplierQuotePartAttribute.bulkCreate(createList, {
                                fields: SupplierQuotePartAttributesInputFields,
                                transaction: t
                            }));
                        const attributeIDs = _.map(req.body.manageAttributes.isCreate, 'id');
                        promises.push(SupplierQuotePartPrice.findAll({
                            where: {
                                supplierQuotePartDetID: req.body.id
                            },
                            attributes: ['id']
                        }).then((data) => {
                            if (data && data.length > 0) {
                                const pricingIDs = _.map(data, 'id');
                                let pricingList = [];
                                _.each(pricingIDs, (pricingID) => {
                                    pricingList = [...pricingList, ..._.map(attributeIDs, attID => ({
                                        supplierQuotePartPriceID: pricingID,
                                        attributeID: attID,
                                        Price: 0
                                    }))];
                                });
                                COMMON.setModelCreatedArrayFieldValue(req.user, pricingList);
                                return SupplierQuotePartPriceAttribute.bulkCreate(pricingList, {
                                    fields: SupplierQuotePartPriceAttributeInputFields,
                                    transaction: t
                                }).then(response => Promise.resolve(response)).catch((err) => {
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
                            } else {
                                return Promise.resolve(data);
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
                        }));
                    }
                    if (req.body.manageAttributes.isDelete.length > 0) {
                        const deleteList = _.map(req.body.manageAttributes.isDelete, 'id');
                        const deleteObj = {
                            isDeleted: 1
                        };
                        const whereClause = {
                            supplierQuotePartDetID: req.body.id,
                            attributeID: {
                                [Op.in]: deleteList
                            }
                        };
                        COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObj);
                        promises.push(SupplierQuotePartAttribute.update(deleteObj, {
                            where: whereClause,
                            fields: SupplierQuotePartAttributesInputFields,
                            transaction: t
                        }));
                    }
                    return Promise.all(promises).then(resp => ({
                        STATE: STATE.SUCCESS,
                        data: resp
                    })).catch((err) => {
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
            });
        }
    },
    // supplier quote part details
    // POST : /api/v1/supplierQuote/saveSupplierQuotePartDetail
    saveSupplierQuotePartDetail: (req, res) => {
        const {
            SupplierQuotePartsDet,
            sequelize
        } = req.app.locals.models;
        return module.exports.checkSupplierQuotePublished(req, res).then((validate) => {
            if (validate && validate.length > 0) {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_QUOTE_PUBLISHED);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'add/update supplier quote part details');
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: messageContent,
                    err: null,
                    data: {
                        published: true
                    }
                });
            } else if (req.body.id) {
                COMMON.setModelUpdatedByFieldValue(req);
                return sequelize.transaction().then(t => SupplierQuotePartsDet.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: SupplierQuotePartDetailInputFields,
                    transaction: t
                }).then((response) => {
                    if (req.body.manageAttributes &&
                        ((req.body.manageAttributes.isCreate && req.body.manageAttributes.isCreate.length > 0) ||
                            (req.body.manageAttributes.isDelete && req.body.manageAttributes.isDelete.length > 0))) {
                        if (req.body.manageAttributes.isDelete && req.body.manageAttributes.isDelete.length > 0) {
                            return module.exports.checkSupplierQuotePartDetailLinePricing(req, res, t).then((isChanged) => {
                                if (isChanged && isChanged.length > 0) {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: null,
                                        err: null,
                                        data: isChanged
                                    });
                                } else {
                                    return module.exports.manageSupplierPartAttributes(req, res, response, t).then((data) => {
                                        if (data && data.STATE === STATE.SUCCESS) {
                                            // Add Supplier Quote Detail into Elastic Search Engine for Enterprise Search
                                            req.params = {
                                                id: req.body.id
                                            };
                                            if (req.body.manageAttributes.isDelete && req.body.manageAttributes.isDelete.length > 0) {
                                                const socketData = {
                                                    supplierQuotePartDetID: req.body.id,
                                                    username: req.user.username,
                                                    deletedAttributes: req.body.manageAttributes.isDelete
                                                };
                                                RFQSocketController.sendSupplierQuotePartAttributeRemoved(req, socketData);
                                            }
                                            return t.commit().then(() => {
                                                EnterpriseSearchController.manageSupplierQuoteInElastic(req);
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(supplierQuotePartDetail));
                                            });
                                        } else if (data && data.STATE === STATE.EMPTY) {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: null,
                                                err: null,
                                                data: data
                                            });
                                        } else {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: null,
                                                data: null
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            return module.exports.manageSupplierPartAttributes(req, res, response, t).then((data) => {
                                if (data && data.STATE === STATE.SUCCESS) {
                                    // Add Supplier Quote Detail into Elastic Search Engine for Enterprise Search
                                    req.params = {
                                        id: req.body.id
                                    };
                                    return t.commit().then(() => {
                                        EnterpriseSearchController.manageSupplierQuoteInElastic(req);
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(supplierQuotePartDetail));
                                    });
                                } else if (data && data.STATE === STATE.EMPTY) {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: null,
                                        err: null,
                                        data: data
                                    });
                                } else {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: null,
                                        data: null
                                    });
                                }
                            });
                        }
                    } else {
                        // Add Supplier Quote Detail into Elastic Search Engine for Enterprise Search
                        req.params = {
                            id: req.body.id
                        };
                        return t.commit().then(() => {
                            EnterpriseSearchController.manageSupplierQuoteInElastic(req);
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(supplierQuotePartDetail));
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
                }));
            } else {
                return module.exports.checkUniqueSupplierQuotePart(req, res, true).then((data) => {
                    if (data.length > 0) {
                        let messageContent;
                        if (req.body.partID && req.body.supplierPartID) {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                            messageContent.message = COMMON.stringFormat(messageContent.message, 'Supplier wise part');
                            messageContent.displayDialog = true;
                            messageContent.isMFRPN = false;
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                STATE.FAILED, messageContent,
                                null);
                        } else {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                            messageContent.message = COMMON.stringFormat(messageContent.message, 'Manufacturer wise part');
                            messageContent.displayDialog = true;
                            messageContent.isMFRPN = true;
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                STATE.FAILED, messageContent,
                                null);
                        }
                    } else {
                        COMMON.setModelCreatedByFieldValue(req);
                        return sequelize.transaction().then(t => SupplierQuotePartsDet.create(req.body, {
                            fields: SupplierQuotePartDetailInputFields,
                            transaction: t
                        }).then((response) => {
                            if (req.body.selectedAttributes && req.body.selectedAttributes.length > 0) {
                                return module.exports.manageSupplierPartAttributes(req, res, response, t).then((attribute) => {
                                    if (attribute) {
                                        // Add Supplier Quote Detail into Elastic Search Engine for Enterprise Search
                                        req.params = {
                                            id: response.id
                                        };
                                        if (req.body.approvalDetails) {
                                            req.body.approvalDetails.refID = response.id;
                                            COMMON.setModelCreatedObjectFieldValue(req.user, req.body.approvalDetails);
                                            return module.exports.supplierQuoteGenericConfirmation(req, res, t).then(() => t.commit().then(() => {
                                                EnterpriseSearchController.manageSupplierQuoteInElastic(req);
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(supplierQuotePartDetail));
                                            }));
                                        } else {
                                            return t.commit().then(() => {
                                                EnterpriseSearchController.manageSupplierQuoteInElastic(req);
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(supplierQuotePartDetail));
                                            });
                                        }
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: null,
                                            data: null
                                        });
                                    }
                                });
                            } else {
                                // Add Supplier Quote Detail into Elastic Search Engine for Enterprise Search
                                req.params = {
                                    id: response.id
                                };
                                if (req.body.approvalDetails) {
                                    req.body.approvalDetails.refID = response.id;
                                    COMMON.setModelCreatedObjectFieldValue(req.user, req.body.approvalDetails);
                                    return module.exports.supplierQuoteGenericConfirmation(req, res, t).then(() => {
                                        t.commit().then(() => {
                                            EnterpriseSearchController.manageSupplierQuoteInElastic(req);
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(supplierQuotePartDetail));
                                        });
                                    });
                                } else {
                                    return t.commit().then(() => {
                                        EnterpriseSearchController.manageSupplierQuoteInElastic(req);
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(supplierQuotePartDetail));
                                    });
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
                });
            }
        });
    },
    // supplier quote part details
    // POST : /api/v1/supplierQuote/retrieveSupplierQuotePartList
    // @return supplier quote part list
    retrieveSupplierQuotePartList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.supplierQuoteMstID) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveSupplierQuotePartList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pSupplierQuoteMstID)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pSupplierQuoteMstID: req.body.supplierQuoteMstID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                SupplierQuotePartList: _.values(response[1]),
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Supplier quote delete
    // POST : /api/v1/supplierQuote/deleteSupplierQuote
    // @return delete supplier quote
    deleteSupplierQuote: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.supplierQuoteID) {
            req.body.supplierQuoteMstID = req.body.objIDs.supplierQuoteID;
            return module.exports.checkSupplierQuotePublished(req, res).then((validate) => {
                if (validate && validate.length > 0) {
                    const quoteNumbers = _.map(validate, 'quoteNumber').join(',');
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_QUOTE_PUBLISHED_DELETE);
                    messageContent.message = COMMON.stringFormat(messageContent.message, quoteNumbers);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                } else {
                    COMMON.setModelDeletedByFieldValue(req);
                    const tableName = COMMON.AllEntityIDS.SUPPLIER_QUOTE_MASTER.Name;
                    const entityID = COMMON.AllEntityIDS.SUPPLIER_QUOTE_MASTER.ID;
                    return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                        replacements: {
                            tableName: tableName,
                            IDs: req.body.objIDs.supplierQuoteID.toString(),
                            deletedBy: req.user.id,
                            entityID: entityID,
                            refrenceIDs: null, // supplier quote id if not supplier quote det id than delete supplier quote
                            countList: req.body.objIDs.CountList,
                            pRoleID: COMMON.getRequestUserLoginRoleID(req)
                        }
                    }).then((response) => {
                        if (response.length === 0) {
                            setTimeout(() => {
                                EnterpriseSearchController.deleteSupplierQuoteInElastic(req.body.objIDs.supplierQuoteID.toString());
                            }, 2000);
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(supplierQuote));
                        } else {
                            return resHandler.successRes(res,
                                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                STATE.SUCCESS, {
                                transactionDetails: response,
                                IDs: req.body.objIDs.supplierQuoteID
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
    // Supplier quote part delete
    // POST : /api/v1/supplierQuote/deleteSupplierQuotePartDetail
    // @return delete supplier quote part details
    deleteSupplierQuotePartDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const promises = [];
        if (req.body.objIDs.id) {
            req.body.supplierQuoteMstID = req.body.objIDs.supplierQuoteID;
            req.body.supplierQuotePartDetID = req.body.objIDs.id;
            promises.push(module.exports.checkSupplierQuotePricingUsage(req, res));
            promises.push(module.exports.checkSupplierQuotePublished(req, res));
            return Promise.all(promises).then((response) => {
                if (response && response[0] && response[0].length > 0) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PRICING_USED_IN_PART_COSTING);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'delete');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                } else if (response && response[1] && response[1].length > 0) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_QUOTE_PUBLISHED);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'delete part details');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                } else {
                    COMMON.setModelDeletedByFieldValue(req);
                    const tableName = COMMON.AllEntityIDS.SUPPLIER_QUOTE_PART_DET.Name;
                    const entityID = COMMON.AllEntityIDS.SUPPLIER_QUOTE_PART_DET.ID;
                    return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                        replacements: {
                            tableName: tableName,
                            IDs: req.body.objIDs.id.toString(),
                            deletedBy: req.user.id,
                            entityID: entityID,
                            refrenceIDs: req.body.objIDs.supplierQuoteID.toString(),
                            countList: req.body.objIDs.CountList,
                            pRoleID: COMMON.getRequestUserLoginRoleID(req)
                        }
                    }).then(() => {
                        setTimeout(() => {
                            EnterpriseSearchController.deleteSupplierQuoteInElastic(req.body.objIDs.id.toString());
                        }, 2000);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(supplierQuotePartDetail));
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
    // Supplier Quote Part Header details
    // GET : /api/v1/supplierQuote/getSupplierQuotePartPriceHeaderDetails
    // @return supplier Quote header for popup
    getSupplierQuotePartPriceHeaderDetails: (req, res) => {
        const {
            SupplierQuotePartsDet,
            SupplierQuoteMst,
            Component,
            MfgCodeMst,
            RFQRoHS
        } = req.app.locals.models;
        if (req.params.id) {
            return SupplierQuotePartsDet.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['partID', 'supplierPartID'],
                include: [{
                    model: Component,
                    as: 'component',
                    attributes: ['id', 'mfgPN', 'PIDCode', 'packagingID'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgCode', 'mfgName'],
                        required: false
                    },
                    {
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        attributes: ['id', 'name', 'rohsIcon'],
                        required: false
                    }
                    ]
                },
                {
                    model: Component,
                    as: 'supplierComponent',
                    attributes: ['id', 'mfgPN', 'PIDCode'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgCode', 'mfgName'],
                        required: false
                    },
                    {
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        attributes: ['id', 'name', 'rohsIcon'],
                        required: false
                    }
                    ]
                }, {
                    model: SupplierQuoteMst,
                    as: 'supplier_quote_mst',
                    attributes: ['id', 'quoteNumber', 'quoteStatus'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgName'],
                        required: false
                    }]
                }
                ]
            }).then((response) => {
                if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(supplierQuote),
                        err: null,
                        data: null
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
    // retrieve supplier quote pricing details by supplierquotepartdetID
    // POST : /api/v1/supplierQuote/retrieveSupplierQuotePartPricingDetails
    // @return supplier Quote Part Pricing details
    retrieveSupplierQuotePartPricingDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.id) {
            return sequelize.query('CALL Sproc_RetrieveSupplierQuotePartPricingDetails (:pSupplierQuotePartDetalID)', {
                replacements: {
                    pSupplierQuotePartDetalID: req.body.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        sourceHeader: _.values(response[0]),
                        pricingDetails: _.values(response[1])
                    }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(supplierQuotePartPriceDetails),
                        err: null,
                        data: null
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
    // retrieve supplier quote numbers for autocomplete
    // POST : /api/v1/supplierQuote/getSupplierQuoteNumberList
    // @return supplier Quote numbers
    getSupplierQuoteNumberList: (req, res) => {
        const {
            SupplierQuoteMst,
            MfgCodeMst
        } = req.app.locals.models;
        const whereClause = {
            id: {
                [Op.ne]: req.body.id
            }
        };
        if (req.body.supplierID) {
            whereClause.supplierID = req.body.supplierID;
        } else {
            whereClause.quoteNumber = {
                [Op.like]: `%${req.body.search}%`
            };
        }
        return SupplierQuoteMst.findAll({
            where: whereClause,
            attributes: ['id', 'quoteNumber'],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                attributes: ['id', 'mfgCode'],
                required: false
            }]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Save supplier Quote Part Pricing Details
    // POST : /api/v1/supplierQuote/saveSupplierQuotePartPricing SP
    saveSupplierQuotePartPricing: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.partPricingObject) {
            return sequelize
                .query('CALL Sproc_ManageSupplierQuotePartPricingDetails (:pPartPricingDetails,:pPartAttributePriceDetails,:pSupplierQuotePartDetailID,:pUserId)', {
                    replacements: {
                        pPartPricingDetails: req.body.partPricingObject.jsonPartPricingDetails,
                        pPartAttributePriceDetails: req.body.partPricingObject.jsonPartAttributePriceDetails,
                        pSupplierQuotePartDetailID: req.body.partPricingObject.supplierQuotePartDetailID,
                        pUserId: req.user.id
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },
    // Save supplier Quote Part Pricing Details
    // POST : /api/v1/supplierQuote/saveSupplierQuotePartPricingDetails
    saveSupplierQuotePartPricingDetails: (req, res) => {
        const {
            sequelize,
            SupplierQuotePartPrice,
            SupplierQuotePartPriceAttribute
        } = req.app.locals.models;
        if (req.body.partPricingDetails && req.body.supplierQuotePartDetID) {
            return module.exports.checkSupplierQuotePartPricingValidations(req, res, true).then((validate) => {
                if (validate && validate.isUsed) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PRICING_USED_IN_PART_COSTING);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'add/update');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: validate
                    });
                } else if (validate && validate.isPublished) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_QUOTE_PUBLISHED);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'add/update pricing details');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: null
                    });
                } else {
                    const pricingPromise = [];
                    const validationPromise = [];
                    const validationErrors = [];
                    const supplierQuotePricingImportErrors = DATA_CONSTANT.SupplierQuotePricingImportErrors;
                    const createPricing = _.filter(req.body.partPricingDetails, item => !item.id);
                    const updatePricing = _.filter(req.body.partPricingDetails, item => item.id && item.isUpdated === true);
                    const validationData = [...createPricing, ...updatePricing];
                    if (validationData.length > 0) {
                        _.each(validationData, (pricing) => {
                            validationPromise.push(module.exports.checkPartPricingLineUnique(req, res, pricing).then((isExist) => { // check validation on unique line promise
                                if (isExist) {
                                    const errObj = {};
                                    errObj.fieldValidation = [];
                                    errObj.itemNumber = pricing.itemNumber;
                                    if (isExist.itemNumber && isExist.lineUnique) {
                                        errObj.fieldValidation.push(supplierQuotePricingImportErrors.PricingAlreadyExist);
                                    } else if (isExist.itemNumber) {
                                        errObj.fieldValidation.push(supplierQuotePricingImportErrors.PricingItemNumberAlreadyExist);
                                    } else if (isExist.lineUnique) {
                                        errObj.fieldValidation.push(supplierQuotePricingImportErrors.PricingLineAlreadyExist);
                                    }
                                    validationErrors.push(errObj);
                                }
                            }));
                        });
                    }
                    return sequelize.transaction().then(t => Promise.all(validationPromise).then((resp) => {
                        if (resp && validationErrors.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: null,
                                err: null,
                                data: validationErrors
                            });
                        } else {
                            if (createPricing && createPricing.length > 0) {
                                _.each(createPricing, (pricing) => {
                                    COMMON.setModelCreatedObjectFieldValue(req.user, pricing);
                                    pricing.qty = pricing.qty.toFixed(2);
                                    pricing.UnitPrice = pricing.UnitPrice.toFixed(8);
                                    pricing.itemNumber = pricing.itemNumber.toFixed(8);
                                    pricingPromise.push(SupplierQuotePartPrice.create(pricing, {
                                        fields: SupplierQuotePartPriceInputFields,
                                        transaction: t
                                    }).then((response) => {
                                        if (pricing.attributePrice && pricing.attributePrice.length > 0) {
                                            _.map(pricing.attributePrice, (item) => {
                                                item.supplierQuotePartPriceID = response.id;
                                                item.Price = item.Price.toFixed(8);
                                            });
                                            COMMON.setModelCreatedArrayFieldValue(req.user, pricing.attributePrice);
                                            return SupplierQuotePartPriceAttribute.bulkCreate(pricing.attributePrice, {
                                                fields: SupplierQuotePartPriceAttributeInputFields,
                                                transaction: t
                                            }).then(() => STATE.SUCCESS).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return STATE.FAILED;
                                            });
                                        } else {
                                            return STATE.SUCCESS;
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return STATE.FAILED;
                                    }));
                                });
                            }
                            if (updatePricing && updatePricing.length > 0) {
                                _.each(updatePricing, (pricing) => {
                                    pricing.qty = pricing.qty.toFixed(2);
                                    pricing.UnitPrice = pricing.UnitPrice.toFixed(8);
                                    pricing.itemNumber = pricing.itemNumber.toFixed(8);
                                    COMMON.setModelUpdatedByObjectFieldValue(req.user, pricing);
                                    pricingPromise.push(SupplierQuotePartPrice.update(pricing, {
                                        where: {
                                            id: pricing.id
                                        },
                                        fields: SupplierQuotePartPriceInputFields,
                                        transaction: t
                                    }).then(() => {
                                        if (pricing.attributePrice && pricing.attributePrice.length > 0) {
                                            const attibuteUpdatePromise = [];
                                            _.each(pricing.attributePrice, (attribute) => {
                                                COMMON.setModelUpdatedByObjectFieldValue(req.user, attribute);
                                                attibuteUpdatePromise.push(SupplierQuotePartPriceAttribute.update(attribute, {
                                                    where: {
                                                        supplierQuotePartPriceID: attribute.supplierQuotePartPriceID,
                                                        attributeID: attribute.attributeID
                                                    },
                                                    fields: SupplierQuotePartPriceAttributeInputFields,
                                                    transaction: t
                                                }).then(() => STATE.SUCCESS).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    return STATE.FAILED;
                                                }));
                                            });
                                            return Promise.all(attibuteUpdatePromise).then((response) => {
                                                if (_.find(response, sts => (sts === STATE.FAILED))) {
                                                    return STATE.FAILED;
                                                } else {
                                                    return STATE.SUCCESS;
                                                }
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return STATE.FAILED;
                                            });
                                        } else {
                                            return STATE.SUCCESS;
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return STATE.FAILED;
                                    }));
                                });
                            }
                            return Promise.all(pricingPromise).then((response) => {
                                if (_.find(response, sts => (sts === STATE.FAILED))) {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: null,
                                        data: null
                                    });
                                } else if (validationData.length > 0) {
                                    const mongodb = global.mongodb;
                                    const whereClause = {
                                        refSupplierQuoteID: req.body.supplierQuoteMstID,
                                        PartNumberId: req.body.partID,
                                        Active: true,
                                        IsDeleted: false
                                    };
                                    return mongodb.collection('FJTMongoQtySupplier').find(whereClause).toArray().then((result) => { // to check is record fetched in costing
                                        if (result && result.length > 0 && validationData.length > 0) {
                                            // eslint-disable-next-line no-underscore-dangle
                                            req.body.FJTMongoQtySupplierID = _.map(result, item => new Bson.ObjectID(item._id));
                                            // req.body.FJTMongoQtySupplierID = result._id;
                                            return module.exports.updatePricingCosting(req, res).then((isUpdated) => {
                                                if (isUpdated) {
                                                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(supplierQuotePartDetail)));
                                                } else {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                        err: null,
                                                        data: null
                                                    });
                                                }
                                            });
                                        } else {
                                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(supplierQuotePartDetail)));
                                        }
                                    })
                                        .catch((err) => {
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
                                } else {
                                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(supplierQuotePartDetail)));
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
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
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
    // Save imported supplier Quote Part Pricing Details
    // POST : /api/v1/supplierQuote/importSupplierQuotePartPricingDetails
    importSupplierQuotePartPricingDetails: (req, res) => {
        const {
            sequelize,
            SupplierQuotePartPrice,
            SupplierQuotePartPriceAttribute
        } = req.app.locals.models;
        if (req.body.partPricingDetails) {
            return module.exports.checkSupplierQuotePartPricingValidations(req, res, true).then((validate) => {
                if (validate && validate.isUsed) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PRICING_USED_IN_PART_COSTING);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'import');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: validate
                    });
                } else if (validate && validate.isPublished) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_QUOTE_PUBLISHED);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'import pricing details');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: null
                    });
                } else {
                    const pricingPromise = [];
                    const importPricing = req.body.partPricingDetails;
                    const supplierQuotePricingImportErrors = DATA_CONSTANT.SupplierQuotePricingImportErrors;
                    _.each(importPricing, (pricing) => {
                        pricing.errorMessageList = [];
                        module.exports.supplierQuotePricingImportErrorCheck(req, res, pricing, pricingPromise); // For validation
                    });
                    return Promise.all(pricingPromise).then(() => sequelize.transaction().then((t) => {
                        const importPricingPromise = [];
                        _.each(importPricing, (pricing) => { // All records insert loop promise
                            if (pricing.errorMessageList.length > 0) {
                                pricing.status = STATE.FAILED;
                                pricing.message = _.map(pricing.errorMessageList).join(',\n ');
                            } else {
                                // eslint-disable-next-line consistent-return
                                importPricingPromise.push(module.exports.checkPartPricingLineUnique(req, res, pricing).then((isExist) => { // check validation on unique line promise
                                    if (isExist) {
                                        if (isExist.itemNumber && isExist.lineUnique) {
                                            pricing.status = STATE.FAILED;
                                            pricing.message = supplierQuotePricingImportErrors.PricingAlreadyExist;
                                        } else if (isExist.itemNumber) {
                                            pricing.status = STATE.FAILED;
                                            pricing.message = supplierQuotePricingImportErrors.PricingItemNumberAlreadyExist;
                                        } else if (isExist.lineUnique) {
                                            pricing.status = STATE.FAILED;
                                            pricing.message = supplierQuotePricingImportErrors.PricingLineAlreadyExist;
                                        }
                                    } else {
                                        const insertData = {
                                            supplierQuotePartDetID: pricing.supplierQuotePartDetID,
                                            itemNumber: pricing.itemNumber.toFixed(8),
                                            qty: pricing.qty.toFixed(8),
                                            min: pricing.min,
                                            mult: pricing.mult,
                                            stock: pricing.stock,
                                            packageID: pricing.packageID,
                                            reeling: pricing.reelingID,
                                            NCNR: pricing.NCNRID,
                                            leadTime: pricing.leadTime,
                                            UnitOfTime: pricing.UnitOfTimeValue,
                                            UnitPrice: pricing.UnitPrice.toFixed(8)
                                        };
                                        COMMON.setModelCreatedObjectFieldValue(req.user, insertData);
                                        // importPricingPromise.push(
                                        return SupplierQuotePartPrice.create(insertData, { // create pricing data
                                            fields: SupplierQuotePartPriceInputFields,
                                            transaction: t
                                            // eslint-disable-next-line consistent-return
                                        }).then((response) => {
                                            if (pricing.attributePrice && pricing.attributePrice.length > 0) {
                                                _.map(pricing.attributePrice, (item) => {
                                                    item.supplierQuotePartPriceID = response.id;
                                                    item.Price = item.Price.toFixed(8);
                                                });
                                                COMMON.setModelCreatedArrayFieldValue(req.user, pricing.attributePrice);
                                                return SupplierQuotePartPriceAttribute.bulkCreate(pricing.attributePrice, { // create attribute data
                                                    fields: SupplierQuotePartPriceAttributeInputFields,
                                                    transaction: t
                                                }).then((attributeResponse) => {
                                                    if (attributeResponse) {
                                                        pricing.status = STATE.SUCCESS;
                                                        pricing.message = null;
                                                    } else {
                                                        pricing.status = STATE.FAILED;
                                                        pricing.message = supplierQuotePricingImportErrors.ErrorInDataProcessing;
                                                    }
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    pricing.status = STATE.FAILED;
                                                    pricing.message = supplierQuotePricingImportErrors.ErrorInDataProcessing;
                                                });
                                            } else {
                                                pricing.status = STATE.SUCCESS;
                                                pricing.message = null;
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            pricing.status = STATE.FAILED;
                                            pricing.message = supplierQuotePricingImportErrors.ErrorInDataProcessing;
                                        });
                                    }
                                }));
                            }
                        });
                        return Promise.all(importPricingPromise).then(() => {
                            t.commit();
                            const resultSet = _.filter(importPricing, pricingStatus => pricingStatus.status === STATE.FAILED);
                            if (resultSet.length > 0) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.FAILED, resultSet, null);
                            } else {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resultSet, MESSAGE_CONSTANT.CREATED(supplierQuotePartPriceDetails));
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
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // To check Import pricing detail errors
    supplierQuotePricingImportErrorCheck: (req, res, PricingDetails, pricingPromise) => {
        const EntityMapper = DATA_CONSTANT.SupplierQuotePricingImportErrors.EntityMapper;
        const FieldMapper = DATA_CONSTANT.SupplierQuotePricingImportErrors.FieldMapper;
        const supplierQuotePricingImportErrors = DATA_CONSTANT.SupplierQuotePricingImportErrors;
        let checker;
        _.each(EntityMapper, (item, index) => {
            if (!PricingDetails[index] && PricingDetails[index] !== 0) {
                PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.Required, item));
            } else if (index !== FieldMapper.packaging && index !== FieldMapper.itemNumber && index !== FieldMapper.stock && index !== FieldMapper.UnitOfTime && index !== FieldMapper.NCNR && index !== FieldMapper.reeling && index !== FieldMapper.qty && index !== FieldMapper.UnitPrice && (PricingDetails[index] || PricingDetails[index] <= 0)) {
                if (isNaN(PricingDetails[index])) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidNumber, item));
                } else if (PricingDetails[index] < 1 || PricingDetails[index] > 999999999 || !Number.isInteger(parseFloat(PricingDetails[index]))) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidValue, item));
                }
            } else if (index === FieldMapper.stock && (PricingDetails[index] || PricingDetails[index] <= 0)) {
                if (isNaN(PricingDetails[index])) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidNumber, item));
                } else if (PricingDetails[index] < 0 || PricingDetails[index] > 999999999 || !Number.isInteger(parseFloat(PricingDetails[index]))) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidValue, item));
                }
            } else if (index === FieldMapper.itemNumber && (PricingDetails[index] || PricingDetails[index] <= 0)) {
                if (isNaN(PricingDetails[index])) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidNumber, item));
                } else if (PricingDetails[index] <= 0 || PricingDetails[index] > 999999999.99999 || !supplierQuotePricingImportErrors.DecimalNmberPattern.test(PricingDetails[index])) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidValue, item));
                }
            } else if (index === FieldMapper.qty && (PricingDetails[index] || PricingDetails[index] <= 0)) {
                if (isNaN(PricingDetails[index])) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidNumber, item));
                } else if (PricingDetails[index] <= 0 || PricingDetails[index] > 999999999 || !Number.isInteger(parseFloat(PricingDetails[index]))) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidValue, item));
                }
            } else if (index === FieldMapper.UnitPrice && (PricingDetails[index] || PricingDetails[index] <= 0)) {
                if (isNaN(PricingDetails[index])) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidNumber, item));
                } else if (PricingDetails[index] <= 0 || PricingDetails[index] > 999999999.99999 || !supplierQuotePricingImportErrors.DecimalNmberPattern.test(PricingDetails[index])) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidValue, item));
                }
            } else if (index === FieldMapper.packaging && PricingDetails[index]) {
                pricingPromise.push(module.exports.getPackagingIDByPackagingName(req, res, PricingDetails[index]).then((objPackaging) => {
                    if (objPackaging && objPackaging.id) {
                        PricingDetails.packageID = objPackaging.id;
                    } else {
                        PricingDetails.errorMessageList.push(supplierQuotePricingImportErrors.InvalidPackaging);
                    }
                }));
            } else if (index === FieldMapper.reeling && PricingDetails[index]) {
                checker = _.find(DATA_CONSTANT.SUPPLIER_QUOTE_CUSTOM_STATUS, CS => CS.VALUE.toLowerCase() === PricingDetails[index].toString().toLowerCase());
                if (checker) {
                    PricingDetails.reelingID = checker.ID;
                } else {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.Invalid, item));
                }
            } else if (index === FieldMapper.NCNR && PricingDetails[index]) {
                checker = _.find(DATA_CONSTANT.SUPPLIER_QUOTE_NCNR_STATUS, NCNR => NCNR.VALUE.toLowerCase() === PricingDetails[index].toString().toLowerCase());
                if (checker) {
                    PricingDetails.NCNRID = checker.ID;
                } else {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.Invalid, item));
                }
            } else if (index === FieldMapper.UnitOfTime && PricingDetails[index]) {
                checker = _.find(DATA_CONSTANT.SUPPLIER_QUOTE_TURN_TYPE, TRN => TRN.TYPE.toLowerCase() === PricingDetails[index].toString().toLowerCase());
                if (checker) {
                    PricingDetails.UnitOfTimeValue = checker.VALUE;
                } else {
                    PricingDetails.errorMessageList.push(supplierQuotePricingImportErrors.InvalidUnitOfTime);
                }
            }
        });
        if (PricingDetails.attributePrice && PricingDetails.attributePrice.length > 0) {
            _.each(PricingDetails.attributePrice, (attributePrice) => {
                if (!attributePrice.Price && attributePrice.Price !== 0) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.Required, attributePrice.attributeName));
                } else if (isNaN(attributePrice.Price)) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidNumber, attributePrice.attributeName));
                } else if (attributePrice.Price < 0) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidValue, attributePrice.attributeName));
                } else if (!supplierQuotePricingImportErrors.DecimalNmberPattern.test(attributePrice.Price)) {
                    PricingDetails.errorMessageList.push(COMMON.stringFormat(supplierQuotePricingImportErrors.InvalidValue, attributePrice.attributeName));
                }
            });
        }
    },
    // To return packagingID by packaging name for import pricing data
    getPackagingIDByPackagingName: (req, res, packagingName) => {
        const {
            ComponentPackagingMst
        } = req.app.locals.models;
        return ComponentPackagingMst.findOne({
            where: {
                name: packagingName,
                isActive: true
            },
            attributes: ['id']
        }).then(response => response).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // To check pricing line unique while save and import
    checkPartPricingLineUnique: (req, res, pricingDetails) => {
        const {
            SupplierQuotePartPrice
        } = req.app.locals.models;
        const promises = [];
        const whereClauseLineUnique = {
            supplierQuotePartDetID: pricingDetails.supplierQuotePartDetID,
            qty: pricingDetails.qty,
            leadTime: pricingDetails.leadTime,
            UnitOfTime: pricingDetails.UnitOfTimeValue || pricingDetails.UnitOfTime
        };
        const whereClauseItemNumberUnique = {
            supplierQuotePartDetID: pricingDetails.supplierQuotePartDetID,
            itemNumber: pricingDetails.itemNumber
        };
        if (pricingDetails.id) {
            whereClauseLineUnique.id = {
                [Op.ne]: pricingDetails.id
            };
            whereClauseItemNumberUnique.id = {
                [Op.ne]: pricingDetails.id
            };
        }
        promises.push(SupplierQuotePartPrice.findOne({
            where: whereClauseLineUnique,
            attributes: ['itemNumber']
        }));
        promises.push(SupplierQuotePartPrice.findOne({
            where: whereClauseItemNumberUnique,
            attributes: ['itemNumber']
        }));
        return Promise.all(promises).then((resp) => {
            if (resp[0] && resp[1]) {
                return {
                    itemNumber: true,
                    lineUnique: true
                };
            } else if (resp[0]) {
                return {
                    itemNumber: false,
                    lineUnique: true
                };
            } else if (resp[1]) {
                return {
                    itemNumber: true,
                    lineUnique: false
                };
            } else {
                return false;
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
    // Copy Supplier Quote
    // POST : /api/v1/supplierQuote/copySupplierQuote
    copySupplierQuote: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.supplierQuote) {
            req.body = req.body.supplierQuote;
            return module.exports.checkSupplierQuoteQuoteNumberAndPartID(req, res, true).then((data) => {
                if (data) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: req.body
                    });
                } else {
                    return sequelize.query('CALL Sproc_SupplierQuoteCopy (:pSupplierQuoteID,:pSupplierQuotePartDetID,:pNewQuoteNumber,:pNewQuoteDate,:pNewReferences,:pUserId)', {
                        replacements: {
                            pSupplierQuoteID: req.body.id,
                            pSupplierQuotePartDetID: req.body.supplierQuotePartDetID || null,
                            pNewQuoteNumber: req.body.quoteNumber || null,
                            pNewQuoteDate: req.body.quoteDate || null,
                            pNewReferences: req.body.reference || null,
                            pUserId: req.user.id
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then((response) => {
                        const newCreatedId = req.body.supplierQuotePartDetID ? 0 : _.values(response[0][0]);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, newCreatedId,
                            MESSAGE_CONSTANT.CREATED(supplierQuote));
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
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // To check Supplier Quote contain inactive part
    // POST : /api/v1/supplierQuote/checkInActivePartOfSupplierQuote
    // @return supplier Quote contain inactive part
    checkInActivePartOfSupplierQuote: (req, res) => {
        const {
            SupplierQuotePartsDet,
            Component
        } = req.app.locals.models;

        if (req.body && req.body.id) {
            return SupplierQuotePartsDet.findAll({
                attributes: ['id', 'partID', 'partID'],
                where: {
                    supplierQuoteMstID: req.body.id,
                    isDeleted: false
                },
                include: [{
                    model: Component,
                    as: 'component',
                    where: {
                        isDeleted: false,
                        partStatus: DATA_CONSTANT.PartStatusList.InternalInactive
                    },
                    paranoid: false,
                    attributes: ['id', 'partStatus']
                }]
            }).then((inactivePartList) => {
                const resDet = {
                    isContainInactivePart: inactivePartList && Array.isArray(inactivePartList) && inactivePartList.length > 0
                };
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resDet, null);
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
    // To check quote number and part unique while copy supplier quote
    // POST : /api/v1/supplierQuote/checkSupplierQuoteQuoteNumberAndPartID
    // @return supplier Quote number and partID
    checkSupplierQuoteQuoteNumberAndPartID: (req, res, isFromApi) => {
        const {
            SupplierQuoteMst,
            SupplierQuotePartsDet
        } = req.app.locals.models;
        const promises = [];
        const isFromApiCheck = isFromApi === true ? true : false;
        if (req.body.partID || !isFromApiCheck) {
            promises.push(SupplierQuotePartsDet.findAll({
                where: {
                    supplierQuoteMstID: req.body.id,
                    partID: req.body.partID
                },
                attributes: ['id', 'supplierQuoteMstID', 'partID']
            }));
        } else {
            promises.push(SupplierQuoteMst.findAll({
                where: {
                    supplierID: req.body.supplierID,
                    quoteNumber: req.body.quoteNumber
                },
                attributes: ['id', 'supplierID', 'quoteNumber']
            }));
        }
        return Promise.all(promises).then((resp) => {
            if (!isFromApiCheck) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp[0].length > 0 ? resp[0] : null, null);
            } else if (resp && resp[0].length > 0) {
                return true;
            } else {
                return false;
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
    // To check quote par pricing line unique for api
    checkSupplierQuotePartDetailLinePricing: (req, res, t) => {
        const {
            SupplierQuotePartPrice,
            SupplierQuotePartPriceAttribute,
            QuoteDynamicFields
        } = req.app.locals.models;
        const deleteAttributeIds = _.map(req.body.manageAttributes.isDelete, 'id');
        if (req.body.id) {
            return SupplierQuotePartPrice.findAll({
                where: {
                    supplierQuotePartDetID: req.body.id
                }
            }).then((response) => {
                const partPricingIDs = _.map(response, 'id');
                return SupplierQuotePartPriceAttribute.findAll({
                    where: {
                        supplierQuotePartPriceID: {
                            [Op.in]: partPricingIDs
                        },
                        attributeID: {
                            [Op.in]: deleteAttributeIds
                        }
                    },
                    include: [{
                        model: QuoteDynamicFields,
                        as: 'quotecharges_dynamic_fields_mst',
                        attributes: ['id', 'fieldName']
                    }]
                }).then(attributeList => attributeList).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (t && !t.finished) {
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
                if (t && !t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return false;
        }
    },
    // To check Attribute is used in pricing data
    // POST : /api/v1/supplierQuote/checkSupplierQuotePartDetailLinePricingAttributes
    // @return added attributes in pricing
    checkSupplierQuotePartDetailLinePricingAttributes: (req, res) => {
        const {
            SupplierQuotePartPrice,
            SupplierQuotePartPriceAttribute,
            QuoteDynamicFields
        } = req.app.locals.models;
        if (req.body.id) {
            return SupplierQuotePartPrice.findAll({
                where: {
                    supplierQuotePartDetID: req.body.id
                }
            }).then((response) => {
                const partPricingIDs = _.map(response, 'id');
                return SupplierQuotePartPriceAttribute.findAll({
                    where: {
                        supplierQuotePartPriceID: {
                            [Op.in]: partPricingIDs
                        }
                    },
                    include: [{
                        model: QuoteDynamicFields,
                        as: 'quotecharges_dynamic_fields_mst',
                        attributes: ['id', 'fieldName']
                    }]
                }).then(attributeList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, attributeList, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
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
    // To retrieve supplier quote attributes
    // POST : /api/v1/supplierQuote/retrieveSupplierQuoteAttributes
    // @return supplier quote attributes
    retrieveSupplierQuoteAttributes: (req, res) => {
        const {
            QuoteDynamicFields
        } = req.app.locals.models;
        return QuoteDynamicFields.findAll({
            where: {
                isActive: true,
                quoteAttributeType: 'S'
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // To retrieve supplier quote part pricing history
    // POST : /api/v1/supplierQuote/retrieveSupplierQuotePartPricingHistory
    // @return supplier quote part pricing history
    retrieveSupplierQuotePartPricingHistory: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveSupplierQuotePartPricingHistory (:pSupplierQuotePartDetID,:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    pSupplierQuotePartDetID: req.body.supplierQuotePartDetID,
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                history: _.values(response[1]),
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // To delete pricing rows
    // POST : /api/v1/supplierQuote/removeSupplierQuotePartPricingLines
    removeSupplierQuotePartPricingLines: (req, res) => {
        const {
            sequelize,
            SupplierQuotePartPrice,
            SupplierQuotePartPriceAttribute
        } = req.app.locals.models;
        if (req.body.removePricing.IDs && req.body.removePricing.IDs.length > 0) {
            req.body.supplierQuoteMstID = req.body.removePricing.supplierQuoteID;
            req.body.partID = req.body.removePricing.partID;
            req.body.ids = req.body.removePricing.IDs;
            return module.exports.checkSupplierQuotePricingUsage(req, res).then((response) => {
                if (response && response.length > 0) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PRICING_USED_IN_PART_COSTING);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'delete');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                } else {
                    return module.exports.checkSupplierQuotePartPricingValidations(req, res, true).then((validate) => {
                        if (validate && validate.isUsed) {
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PRICING_USED_IN_PART_COSTING);
                            messageContent.message = COMMON.stringFormat(messageContent.message, 'delete');
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: messageContent,
                                err: null,
                                data: validate
                            });
                        } else if (validate && validate.isPublished) {
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_QUOTE_PUBLISHED);
                            messageContent.message = COMMON.stringFormat(messageContent.message, 'delete pricing details');
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: null,
                                err: null,
                                data: null
                            });
                        } else {
                            return sequelize.transaction().then((t) => {
                                let deleteObject = {};
                                COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObject);
                                return SupplierQuotePartPrice.update(deleteObject, {
                                    where: {
                                        id: {
                                            [Op.in]: req.body.removePricing.IDs
                                        }
                                    },
                                    fields: SupplierQuotePartPriceInputFields,
                                    transaction: t
                                }).then(() => {
                                    deleteObject = {};
                                    COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObject);
                                    return SupplierQuotePartPriceAttribute.update(deleteObject, {
                                        where: {
                                            supplierQuotePartPriceID: {
                                                [Op.in]: req.body.removePricing.IDs
                                            }
                                        },
                                        fields: SupplierQuotePartPriceAttributeInputFields,
                                        transaction: t
                                    }).then(() => {
                                        if (req.body.FJTMongoQtySupplierID) {
                                            return module.exports.updatePricingCosting(req, res).then((isUpdated) => {
                                                if (isUpdated) {
                                                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.DELETED(supplierQuotePartPriceDetails)));
                                                } else {
                                                    if (t && !t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                        err: null,
                                                        data: null
                                                    });
                                                }
                                            });
                                        } else {
                                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.DELETED(supplierQuotePartPriceDetails)));
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (t && !t.finished) {
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
                                    if (t && !t.finished) {
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
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
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
    retrieveSupplierAttributeTemplate: (req, res) => {
        const {
            SupplierAttributeTemplateMst,
            SupplierAttributeTemplateDet,
            QuoteDynamicFields
        } = req.app.locals.models;
        if (req.body.IDs) {
            return SupplierAttributeTemplateMst.findAll({
                where: {
                    supplierID: {
                        [Op.in]: req.body.IDs
                    }
                },
                attributes: ['id', 'supplierID'],
                include: [{
                    model: SupplierAttributeTemplateDet,
                    as: 'supplier_attribute_template_det',
                    attributes: ['id'],
                    required: false,
                    include: [{
                        model: QuoteDynamicFields,
                        as: 'quotecharges_dynamic_fields_mst',
                        attributes: ['id', 'fieldName'],
                        required: false
                    }]
                }]
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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

    // To make entry in generic confirmation for part
    supplierQuoteGenericConfirmation: (req, res, t) => {
        const {
            GenericAuthenticationMst
        } = req.app.locals.models;
        return GenericAuthenticationMst.create(req.body.approvalDetails, {
            fields: approvalInputFields,
            transaction: t
        }).then(addApprovalResponse => Promise.resolve(addApprovalResponse)).catch((err) => {
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
    },

    // To check duplication of attributes
    // @return duplicate attributes
    checkDuplicateAttribute: (req, res, createAttribute, t) => {
        const {
            SupplierQuotePartAttribute,
            QuoteDynamicFields
        } = req.app.locals.models;
        if (createAttribute.length > 0) {
            const attributeIDs = _.map(createAttribute, 'id');
            return SupplierQuotePartAttribute.findAll({
                where: {
                    supplierQuotePartDetID: req.body.id,
                    attributeID: {
                        [Op.in]: attributeIDs
                    }
                },
                include: [{
                    model: QuoteDynamicFields,
                    as: 'quotecharges_dynamic_fields_mst',
                    attributes: ['id', 'fieldName'],
                    required: false
                }]
            }).then((response) => {
                if (response) {
                    return response;
                } else {
                    return Promise.resolve(false);
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
        } else {
            return Promise.resolve(false);
        }
    },
    // update pricing detail in mongo db
    updatePricingCosting: (req, res) => {
        const mongodb = global.mongodb;
        // const deleteID = Bson.ObjectId(req.body.FJTMongoQtySupplierID);
        const mainQuery = {
            _id: {
                $in: req.body.FJTMongoQtySupplierID
            }
        };
        const query = {
            qtySupplierID: {
                $in: req.body.FJTMongoQtySupplierID
            }
        };
        const newvalues = {
            $set: {
                IsDeleted: true
            }
        };
        const promises = [];
        promises.push(mongodb.collection('FJTMongoQtySupplier').updateMany(mainQuery, newvalues).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        }));
        promises.push(mongodb.collection('AssemblyQtyBreak').updateMany(query, newvalues).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        }));
        promises.push(mongodb.collection('PriceBreakComponent').updateMany(query, newvalues).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        }));
        return Promise.all(promises).then((updated) => {
            const resultSet = _.filter(updated, isUpdate => isUpdate === STATE.FAILED);
            if (resultSet && resultSet.length > 0) {
                return Promise.resolve(false);
            } else {
                return Promise.resolve(true);
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
    retrieveSupplierQuotePartPricingWhereUsed: (req, res) => {
        const {
            RFQConsolidatedMFGPNLineItemQuantity,
            sequelize
        } = req.app.locals.models;
        const mongodb = global.mongodb;
        if (req.body) {
            const whereClause = {
                refSupplierQuoteID: req.body.supplierQuoteMstID,
                PartNumberId: req.body.partID,
                Active: true,
                IsDeleted: false
            };
            return mongodb.collection('FJTMongoQtySupplier').find(whereClause).toArray((err, result) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                } else if (result && result.length > 0) {
                    // eslint-disable-next-line no-underscore-dangle
                    const pricingIds = _.map(result, item => item._id.toString());
                    return RFQConsolidatedMFGPNLineItemQuantity.findAll({
                        where: {
                            rfqQtySupplierID: {
                                [Op.in]: pricingIds
                            }
                        },
                        attributes: ['id']
                    }).then((response) => {
                        if (response) {
                            req.body.rfqQtySupplierID = _.map(response, 'id').join(',');
                            const filter = COMMON.UiGridFilterSearch(req);
                            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
                            return sequelize.query('CALL Sproc_RetrieveSupplierQuotePartPricingWhereUsed (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:rfqQtySupplierID)', {
                                replacements: {
                                    ppageIndex: req.body.Page,
                                    precordPerPage: filter.limit,
                                    pOrderBy: filter.strOrderBy || null,
                                    pWhereClause: strWhere,
                                    rfqQtySupplierID: req.body.rfqQtySupplierID
                                },
                                type: sequelize.QueryTypes.SELECT
                            }).then(whereUsed => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                SupplierQuotePartPricingWhereUsed: _.values(whereUsed[1]),
                                Count: whereUsed[0][0]['TotalRecord']
                            }, null)).catch((errs) => {
                                console.trace();
                                console.error(errs);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: errs,
                                    data: null
                                });
                            });
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                SupplierQuotePartPricingWhereUsed: [],
                                Count: 0
                            }, null);
                        }
                    }).catch((errs) => {
                        console.trace();
                        console.error(errs);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: errs,
                            data: null
                        });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        SupplierQuotePartPricingWhereUsed: [],
                        Count: 0
                    }, null);
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
    saveSupplierQuoteNegotiatePriceDetails: (req, res) => {
        const {
            sequelize,
            SupplierQuotePartPrice
        } = req.app.locals.models;
        if (req.body.priceDetail) {
            const pricingPromise = [];
            return sequelize.transaction().then((t) => {
                try {
                    _.each(req.body.priceDetail, (pricing) => {
                        if (pricing) {
                            pricing.negotiatePrice = pricing.negotiatePrice.toFixed(8);
                            COMMON.setModelUpdatedByObjectFieldValue(req.user, pricing);
                            pricingPromise.push(SupplierQuotePartPrice.update(pricing, {
                                where: {
                                    id: pricing.id
                                },
                                fields: SupplierQuotePartPriceInputFields,
                                transaction: t
                            }));
                        }
                    });
                    return Promise.all(pricingPromise).then(() =>
                        t.commit().then(() =>
                            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(supplierQuotePartDetail))
                        ).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (t && !t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (t && !t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } catch (err) {
                    console.trace();
                    console.error(err);
                    if (t && !t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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
    // To check supplier quote part pricing details are used in part costing and is supplier quote published
    // POST : /api/v1/supplierQuote/checkSupplierQuotePartPricingValidations
    checkSupplierQuotePartPricingValidations: (req, res, isFromApi) => {
        const promises = [];
        const isFromApiCheck = isFromApi === true ? true : false;
        if (req.body) {
            promises.push(module.exports.checkSupplierQuotePricingUsed(req, res, true));
            promises.push(module.exports.checkSupplierQuotePublished(req, res));
            return Promise.all(promises).then((response) => {
                if (isFromApiCheck) {
                    if (response && response[0]) {
                        return {
                            isUsed: true
                        };
                    } else if (response && response[1] && response[1].length > 0) {
                        return {
                            isPublished: true
                        };
                    } else {
                        return Promise.resolve(false);
                    }
                } else if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
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
    // To check supplier quote is published
    checkSupplierQuotePublished: (req, res) => {
        const {
            SupplierQuoteMst
        } = req.app.locals.models;
        return SupplierQuoteMst.findAll({
            where: {
                id: {
                    [Op.in]: Array.isArray(req.body.supplierQuoteMstID) ? req.body.supplierQuoteMstID : [req.body.supplierQuoteMstID]
                },
                quoteStatus: DATA_CONSTANT.SUPPLIER_QUOTE_STATUS.PUBLISHED
            },
            attributes: ['quoteNumber']
        }).then((data) => {
            if (data) {
                return Promise.resolve(data);
            } else {
                return Promise.resolve(false);
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
    // retrieve supplier list
    // POST : /api/v1/supplierQuote/getSupplierList
    getSupplierList: (req, res) => {
        const {
            MfgCodeMst,
            SupplierMappingMst
        } = req.app.locals.models;
        const whereClause = {
            mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.DIST,
            isCustOrDisty: true,
            isActive: true
        };
        if (req.body.id) {
            whereClause.id = req.body.id;
        }
        return MfgCodeMst.findAll({
            where: whereClause,
            attributes: ['mfgCode', 'mfgName', 'id', 'supplierMFRMappingType'],
            order: [
                ['mfgName', 'ASC']
            ],
            include: [{
                model: SupplierMappingMst,
                as: 'supplier_mapping_mstSupplier',
                required: false,
                attributes: ['id', 'refMfgCodeMstID'],
                where: {
                    isCustMapping: DATA_CONSTANT.MAPPING_TYPE.MFR
                }
            }]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // POST : /api/v1/supplierQuote/checkSupplierQuotePricingUsed
    // @return Supplier Quote Pricing Used
    checkSupplierQuotePricingUsed: (req, res, isFromApi) => {
        const {
            RFQConsolidatedMFGPNLineItemQuantity
        } = req.app.locals.models;
        const isFromApiCheck = isFromApi === true ? true : false;
        const whereClause = {
            refSupplierQuoteID: req.body.supplierQuoteMstID,
            PartNumberId: req.body.partID,
            Active: true,
            IsDeleted: false
        };
        return global.mongodb.collection('FJTMongoQtySupplier').find(whereClause).toArray().then((result) => {
            if (result && result.length > 0) {
                // eslint-disable-next-line no-underscore-dangle
                const pricingIds = _.map(result, item => item._id.toString());
                // eslint-disable-next-line no-underscore-dangle
                req.body.FJTMongoQtySupplierID = _.map(result, item => new Bson.ObjectID(item._id));
                return RFQConsolidatedMFGPNLineItemQuantity.findOne({
                    where: {
                        rfqQtySupplierID: {
                            [Op.in]: pricingIds
                        }
                    }
                }).then((response) => {
                    if (isFromApiCheck) {
                        return Promise.resolve(response);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                    }
                }).catch((errs) => {
                    console.trace();
                    console.error(errs);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: errs,
                        data: null
                    });
                });
            } else {
                return Promise.resolve(false);
            }
        })
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
    },
    // retrieve supplier quote pricing details by partID
    // POST : /api/v1/supplierQuote/retrieveSupplierQuotePricingDetailsByPartID
    // @return supplier Quote Part Pricing details
    retrieveSupplierQuotePricingDetailsByPartID: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.partID && req.body.supplierID) {
            return sequelize.query('CALL Sproc_RetrieveSupplierQuotePricingDetailsByPartID (:pPartID,:psupplierID)', {
                replacements: {
                    pPartID: req.body.partID,
                    psupplierID: req.body.supplierID
                }
            }).then((response) => {
                if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        pricingDetails: response
                    }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(supplierQuotePartPriceDetails),
                        err: null,
                        data: null
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
    // To check supplier quote is published
    checkSupplierQuotePricingUsage: (req, res) => {
        const { SupplierQuotePartPrice } = req.app.locals.models;
        const WhereClause = {
            isPartCosting: true
        };
        if (req.body.ids) {
            WhereClause.id = {
                [Op.in]: Array.isArray(req.body.ids) ? req.body.ids : [req.body.ids]
            };
        } else {
            WhereClause.supplierQuotePartDetID = {
                [Op.in]: Array.isArray(req.body.supplierQuotePartDetID) ? req.body.supplierQuotePartDetID : [req.body.supplierQuotePartDetID]
            };
        }
        return SupplierQuotePartPrice.findAll({
            where: WhereClause
        }).then((data) => {
            if (data) {
                return Promise.resolve(data);
            } else {
                return Promise.resolve(false);
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
    // update pricing detail into  supplier quote part price
    updateSupplierQuotePricing: (req, pricingObj) => {
        const { SupplierQuotePartPrice } = req.app.locals.models;
        COMMON.setModelUpdatedByObjectFieldValue(req.user, pricingObj);
        return SupplierQuotePartPrice.update(pricingObj, {
            where: {
                id: {
                    [Op.in]: pricingObj.refSupplierQuotePartPriceIDs
                }
            },
            fields: ['isPartCosting', 'updatedBy', 'updatedAt', 'updateByRoleId']
        }).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    manageSupplierQuotePartPricePartCosting: (req, pricingObj) => {
        const mongodb = global.mongodb;
        pricingObj.Active = true;
        pricingObj.IsDeleted = false;
        return mongodb.collection('FJTMongoQtySupplier').find(pricingObj).toArray().then((result) => {
            if (result && result.length > 0) {
                const responseIDs = _.uniq(_.map(_.filter(result, item => item.refSupplierQuotePartPriceID), 'refSupplierQuotePartPriceID'));
                const refAssyArray = [];
                refAssyArray.push(pricingObj.rfqAssyID);
                const whereClause = {
                    refSupplierQuotePartPriceID: {
                        $in: responseIDs
                    },
                    Active: true,
                    IsDeleted: false,
                    rfqAssyID: { $nin: refAssyArray }
                };
                return mongodb.collection('FJTMongoQtySupplier').find(whereClause).toArray().then((finalResult) => {
                    if (finalResult && finalResult.length > 0) {
                        const usageIds = _.uniq(_.map(_.filter(finalResult, item => item.refSupplierQuotePartPriceID), 'refSupplierQuotePartPriceID'));
                        const replaceValueList = responseIDs.filter(val => !usageIds.includes(val));
                        if (replaceValueList && replaceValueList.length > 0) {
                            const responseObj = {
                                isPartCosting: false,
                                refSupplierQuotePartPriceIDs: replaceValueList
                            };
                            return module.exports.updateSupplierQuotePricing(req, responseObj);
                        } else {
                            return STATE.SUCCESS;
                        }
                    } else {
                        const responseObj = {
                            isPartCosting: false,
                            refSupplierQuotePartPriceIDs: responseIDs
                        };
                        return module.exports.updateSupplierQuotePricing(req, responseObj);
                    }
                })
                    .catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    });
            } else {
                return STATE.SUCCESS;
            }
        })
            .catch((error) => {
                console.trace();
                console.error(error);
                return STATE.FAILED;
            });
    }
};