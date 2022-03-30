const _ = require('lodash');
var Excel = require('exceljs');
Excel.config.setValue('promise', require('bluebird'));
const mkdirp = require('mkdirp');
const fs = require('fs');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const { NotFound } = require('../../errors');

const rfqStatusModuleName = DATA_CONSTANT.RFQ.RFQ_STATUS_NAME;
const assyQuotemoduleName = DATA_CONSTANT.RFQ_ASSEY_QUOTE_SUMMARY_DETAIL.NAME;
const assyHistoryModuleName = DATA_CONSTANT.ASSEMBLY_HISTORY.NAME;
const inputFieldsRFQAssyTerms = [
    'id',
    'RefSubmittedQuoteID',
    'termsconditionCatID',
    'termsconditionTypeValueID',
    'note',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const inputFieldsAssyHistory = [
    'id',
    'refTransID',
    'transactionType',
    'activityType',
    'checkinTime',
    'checkoutTime',
    'userID',
    'totalTime',
    'burdenRate',
    'remark',
    'paymentMode',
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
module.exports = {

    // Retrive rfq assy Bom by id
    // GET : /api/v1/rfqAssemblies/getAssyDetails
    // @return rfqAssyBom
    getAssyDetails: (req, res) => {
        const { MfgCodeMst, RFQAssemblies, RFQForms, JobType, RFQConsolidatedMFGPNLineItem, RFQConsolidatedMFGPNLineItemQuantity, Component, RFQRoHS, ComponentRequireFunctionalType, RFQMountingType, ComponentRequireMountingType, RFQPartType, ComponentStandardDetails, CertificateStandards, GenericCategory, RFQAssembliesQuotationSubmitted, EmployeeMFGMapping, User, ComponentBOMSetting } = req.app.locals.models;
        if (req.params.id) {
            return RFQAssemblies.findOne({
                where: { id: req.params.id },
                attributes: ['id', 'rfqrefID', 'jobTypeID', 'RFQTypeID', 'eau', 'proposedBuildQty', 'noOfBuild', 'timePeriod', 'additionalRequirement', 'quoteInDate', 'quoteDueDate', 'quoteNumber', 'quoteSubmitDate', 'assemblyTypeID', 'status', 'isBOMVerified', 'isReadyForPricing', 'quoteFinalStatus', 'isSummaryComplete', 'bomFCAVersion', 'RoHSStatusID', 'partID', 'partCostingBOMInternalVersion', 'partcostingBOMIssue',
                    'isPriceUpdate', 'isLaborUpdate', 'isCustomPartDetShowInReport', 'isActivityStart', 'activityStartAt', 'activityStartBy', 'activityStopAt'],
                include: [{
                    model: RFQForms,
                    as: 'rfqForms',
                    attributes: ['id', 'customerId', 'quoteindate'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'customer',
                        attributes: ['id', 'mfgName', 'mfgCode'],
                        include: [{
                            model: EmployeeMFGMapping,
                            where: {
                                employeeId: req.user.employeeID
                            },
                            as: 'employeeMFGMapping',
                            attributes: ['id', 'employeeId', 'mfgCodeId'],
                            required: false
                        }]
                    }]
                }, {
                    model: Component,
                    as: 'componentAssembly',
                    attributes: ['id', 'mfgPN', 'PIDCode', 'rev', 'assyCode', 'mfgPNDescription', 'nickname', 'RoHSStatusID', 'functionalTypePartRequired', 'mountingTypePartRequired'],
                    include: [{
                        model: ComponentBOMSetting,
                        as: 'componentbomSetting',
                        attributes: ['refComponentID', 'liveInternalVersion'],
                    },{
                        model: ComponentRequireFunctionalType,
                        as: 'component_requirefunctionaltype',
                        attributes: ['id', 'refComponentID', 'partTypeID'],
                        include: [{
                            model: RFQPartType,
                            as: 'rfq_parttypemst',
                            attributes: ['id', 'partTypeName']
                        }]
                    }, {
                        model: ComponentRequireMountingType,
                        as: 'component_requiremountingtype',
                        attributes: ['id', 'partTypeID', 'refComponentID'],
                        include: [{
                            model: RFQMountingType,
                            as: 'rfq_mountingtypemst',
                            attributes: ['id', 'name']
                        }]

                    }, {
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        attributes: ['id', 'rohsIcon', 'isActive', 'name']
                    }, {
                        model: ComponentStandardDetails,
                        as: 'componetStandardDetail',
                        attributes: ['id', 'certificateStandardID'],
                        include: [{
                            model: CertificateStandards,
                            as: 'certificateStandard',
                            attributes: ['certificateStandardID', 'standardTypeID'],
                            include: [{
                                model: GenericCategory,
                                as: 'standardType',
                                attributes: ['gencCategoryID', 'gencCategoryName']
                            }]
                        }]

                    }]
                }, {
                    model: RFQRoHS,
                    as: 'rfq_rohsmst',
                    attributes: ['id', 'rohsIcon', 'isActive', 'name']
                }, {
                    model: RFQAssembliesQuotationSubmitted,
                    as: 'rfqAssyQuoteSubmitted',
                    attributes: ['id', 'quotenumber', 'rfqAssyID']
                }, {
                    model: JobType,
                    as: 'jobType',
                    attributes: ['id', 'name', 'isLaborCosting', 'isMaterialCosting']
                }, {
                    model: RFQConsolidatedMFGPNLineItem,
                    as: 'rfqConsolidatedMFGPNLineItems',
                    attributes: ['id', 'rfqAssyID'],
                    required: false,
                    include: [{
                        model: RFQConsolidatedMFGPNLineItemQuantity,
                        as: 'rfqConsolidatedMFGPNLineItemQuantity',
                        attributes: ['id', 'finalPrice', 'consolidateID'],
                        required: false
                    }]
                }, {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName'],
                    required: false
                }]
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
                response.additionalRequirement = COMMON.getTextAngularValueFromDB(response.additionalRequirement);
                response.reason = COMMON.getTextAngularValueFromDB(response.reason);
                if (response && response.activityStartAt) {
                    response.dataValues.TotalConsumptionTime = 0;
                    const currDate = COMMON.getCurrentUTC();
                    response.dataValues.TotalConsumptionTime = COMMON.calculateSeconds(response.activityStartAt, currDate);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },

    // Retrive rfq all sub assy details by partId
    // GET : /api/v1/rfqAssemblies/getAllUniqueSubAssemblyByPartID
    // @return PartSubAssyRelationship
    getAllUniqueSubAssemblyByPartID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.id) {
            return sequelize.query('CALL Sproc_GetAllUniqueSubAssemblyByPartID (:pAssemblyID)', {
                replacements: {
                    pAssemblyID: req.params.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response[0], null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive rfq all sub assy details by partId
    // GET : /api/v1/rfqAssemblies/getAllUniqueSubAssemblyByBOMPartID
    // @return Sproc_GetAllUniqueSubAssemblyByBOMPartID
    getAllUniqueSubAssemblyByBOMPartID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.id) {
            return sequelize.query('CALL Sproc_GetAllUniqueSubAssemblyByBOMPartID (:pPartID)', {
                replacements: {
                    pPartID: req.params.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response[0], null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get RFQ Assy BOM details
    // GET : /api/v1/rfqAssemblies/getRFQAssyByID
    // @param {id} rfqAssyID
    // @return API response
    getRFQAssyByID: (req, res) => {
        const { RFQAssemblies } = req.app.locals.models;
        RFQAssemblies.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'status', 'isBOMVerified', 'isReadyForPricing', 'RoHSStatusID', 'isSummaryComplete']
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Get Details Of BOM progress
    // GET : /api/v1/component/getBOMProgress
    // @param {id} int
    // @return Details Of BOM progress
    getBOMProgress: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetBOMProgress (:pPartID)', {
            replacements: {
                pPartID: req.params.id
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // get BOM Icons
    // @param {req} obj
    // @return list of Icons
    getBOMIconList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetBOMIconList (:pPartId)', {
            replacements: {
                pPartId: req.params.id
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get Details Of assy Glance
    // GET : /api/v1/component/getAssyGlanceData
    // @param {id} int
    // @return Details Of assy Glance
    getAssyGlanceData: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetAssyBOMGlanceDetails (:ppartID)', {
            replacements: {
                ppartID: req.params.partID
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            const resObj = {
                mountingTypeList: _.values(response[0]),
                RohsStatusList: _.values(response[1]),
                AssyStandardList: _.values(response[2]),
                AssyDetail: _.values(response[3]),
                RoHSStatusByPartList: _.values(response[4]),
                RoHSStatusByAllPartInItemWithAssyList: _.values(response[5]),
                RoHSStatusByOnePartInItemWithAssyList: _.values(response[6])
            };
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resObj, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get list of Req assembly requote history
    // POST : /api/v1/rfqAssemblies/getRequoteHistory
    // @return list of Req assembly requote history
    getAssemblyRequoteHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.rfqAssyID) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_GetRFQassyRequoteHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prfqAssyID)', {
                replacements: {
                    ppageIndex: req.body.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    prfqAssyID: req.body.rfqAssyID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { reQuoteHistory: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive rfq assy Bom by id
    // GET : /api/v1/rfqAssemblies/getAssyQuoteSummaryDetails
    // @return rfqAssyBom
    getAssyQuoteSummaryDetails: (req, res) => {
        const { sequelize, ECOTypeCategory, ECOTypeValues } = req.app.locals.models;
        if (req.body.id) {
            return sequelize.query('CALL Sproc_GetQuoteSummaryDetails (:rfqAssyID,:assyQuoteSubmittedID)', {
                replacements: {
                    rfqAssyID: req.body.id || null,
                    assyQuoteSubmittedID: req.body.quoteSubmittedID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(assyQuotemoduleName), err: null, data: null });
                }
                return ECOTypeCategory.findAll({
                    where: { category: 2 },
                    include: [{
                        model: ECOTypeValues,
                        as: 'ecoTypeValues'
                    }]
                }).then(ECOres => sequelize.query('CALL Sproc_getQuoteSubjectToFollowingDetails (:rfqAssyID,:assyQuoteSubmittedID)', {
                    replacements: {
                        rfqAssyID: req.body.id || null,
                        assyQuoteSubmittedID: req.body.quoteSubmittedID || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((resQuoteIssue) => {
                    const objBOMIssue = {
                        ExcessMaterial: _.values(resQuoteIssue[0]),
                        CustomerConsigned: _.values(resQuoteIssue[1]),
                        UnquotedItem: _.values(resQuoteIssue[2]),
                        UnquotedLaborItem: _.values(resQuoteIssue[3]),
                        LowStockAlert: _.values(resQuoteIssue[4]),
                        LongLeadTime: _.values(resQuoteIssue[5]),
                        ObsoletePart: _.values(resQuoteIssue[6]),
                        PartLOA: _.values(resQuoteIssue[7]),
                        BOMIsses: _.values(resQuoteIssue[8]),
                        CustomerEngineeringBOMIssue: _.values(resQuoteIssue[9])
                    };
                    const AssyDetail = _.values(response[1]);
                    _.each(AssyDetail, (item) => {
                        item.quoteNote = COMMON.getTextAngularValueFromDB(item.quoteNote);
                        item.assyNote = COMMON.getTextAngularValueFromDB(item.assyNote);
                        item.quoteNote = COMMON.getTextAngularValueFromDB(item.quoteNote);
                        item.promotions = COMMON.getTextAngularValueFromDB(item.promotions);
                        item.additionalRequirement = COMMON.getTextAngularValueFromDB(item.additionalRequirement);
                    });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        QuoteDetails: _.values(response[0]),
                        AssyDetail: _.values(response[1]),
                        revisedQuoteDetail: _.values(response[2]),
                        selectedQuoteTC: _.values(response[3]),
                        StandardClass: _.values(response[4]),
                        lastSubmitedQuote: _.values(response[5]),
                        CustomPartDetails: _.values(response[6]),
                        NREDetails: _.values(response[7]),
                        ToolingDetails: _.values(response[8]),
                        rfqPriceGroupDetail: _.values(response[10]),
                        rfqPriceGroup: _.values(response[11]),
                        selectedTerms: _.values(response[12]),
                        reQuoteCount: response[13][0]['COUNT(*)'],
                        partStandardClass: _.values(response[14]),
                        terms: ECOres,
                        BOMIssue: objBOMIssue
                    }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
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
    // Save Assy Quote Summary Submitted data
    // POST : /api/v1/rfqAssemblies/saveQuoteSubmittedSummaryDetails
    // @param Array of Assy Quote Summary Details
    // @return API response
    saveQuoteSubmittedSummaryDetails: (req, res) => {
        const { RFQAssemblies, RFQAssyQuoteSubmittedTermsAndConditions, RFQAssembliesQuotationSubmitted } = req.app.locals.models;
        if (req.body) {
            return RFQAssyQuoteSubmittedTermsAndConditions.findAll({
                where: {
                    RefSubmittedQuoteID: req.body.refSubmittedQuoteID
                }
            }).then((assyTerms) => {
                var promises = [];
                if (assyTerms) {
                    const deletedTerms = _.filter(assyTerms, dbTerms => !_.find(req.body.AssyTermsAndConditions, selectedTerms => dbTerms.id === selectedTerms.id));
                    _.each(deletedTerms, (termObj) => {
                        promises.push(RFQAssyQuoteSubmittedTermsAndConditions.update(
                            { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) },
                            {
                                where: {
                                    id: termObj.id
                                },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId']
                            }).then(() => STATE.SUCCESS).catch(() => STATE.FAILED)
                        );
                    });
                }

                COMMON.setModelCreatedArrayFieldValue(req.user, req.body.AssyTermsAndConditions);
                COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.AssyTermsAndConditions);
                promises.push(RFQAssyQuoteSubmittedTermsAndConditions.bulkCreate(req.body.AssyTermsAndConditions, {
                    updateOnDuplicate: inputFieldsRFQAssyTerms
                }).then(() => STATE.SUCCESS).catch(() => STATE.FAILED));

                req.body.additionalRequirement = COMMON.setTextAngularValueForDB(req.body.additionalRequirement);
                req.body.OtherNotes = COMMON.setTextAngularValueForDB(req.body.OtherNotes);
                req.body.promotions = COMMON.setTextAngularValueForDB(req.body.promotions);

                const assyobj = {
                    additionalRequirement: req.body.additionalRequirement,
                    isCustomPartDetShowInReport: req.body.isCustomPartDetShowInReport,
                    assyNote: req.body.assyNote,
                    updatedBy: req.user.id,
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                };
                const summaryobj = {
                    BOMIssues: req.body.BOMIssues,
                    OtherNotes: req.body.OtherNotes,
                    promotions: req.body.promotions,
                    custBillingAddressID: req.body.custBillingAddressID,
                    custShippingAddressID: req.body.custShippingAddressID,
                    custShippingAddress: req.body.custShippingAddress,
                    custShippingContactPerson: req.body.custShippingContactPerson,
                    custShippingContactPersonID: req.body.custShippingContactPersonID,
                    custBillingAddress: req.body.custBillingAddress,
                    custBillingContactPerson: req.body.custBillingContactPerson,
                    custBillingContactPersonID: req.body.custBillingContactPersonID,
                    custTermsID: req.body.custTermsID,
                    updatedBy: req.user.id,
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                };
                promises.push(RFQAssemblies.update(assyobj, {
                    where: {
                        id: req.body.rfqAssyID
                    },
                    fields: ['additionalRequirement', 'assyNote', 'isCustomPartDetShowInReport', 'updatedBy', 'updateByRoleId']
                }).then(() => STATE.SUCCESS).catch(() => STATE.FAILED));
                promises.push(RFQAssembliesQuotationSubmitted.update(summaryobj, {
                    where: {
                        id: req.body.refSubmittedQuoteID
                    },
                    fields: ['BOMIssues', 'OtherNotes', 'custShippingAddressID', 'custBillingAddressID', 'custTermsID', 'promotions', 'updatedBy', 'updateByRoleId', 'custShippingAddress', 'custShippingContactPerson',
                        'custShippingContactPersonID', 'custBillingAddress', 'custBillingContactPerson', 'custBillingContactPersonID']
                }).then(() => STATE.SUCCESS).catch(() => STATE.FAILED));

                return Promise.all(promises).then(responses => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responses, MESSAGE_CONSTANT.UPDATED(assyQuotemoduleName)))
                    .catch((err) => {
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
    // change Assy status
    // POST : /api/v1/rfqAssemblies/changeAssyStatus
    // @return API response
    changeAssyStatus: (req, res) => {
        const { RFQAssemblies, sequelize } = req.app.locals.models;
        if (req.body) {
            req.body.reason = COMMON.setTextAngularValueForDB(req.body.reason);
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.AssyTermsAndConditions);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.AssyTermsAndConditions);
            const loginUserId = COMMON.getRequestUserID(req);
            const assyobj = {
                status: req.body.status,
                quoteFinalStatus: req.body.quoteFinalStatus,
                winQuantity: req.body.winQuantity,
                winPrice: req.body.winPrice,
                reason: req.body.reason,
                quoteClosedBy: req.user.id,
                quoteClosedDate: COMMON.getCurrentUTC()
            };

            return RFQAssemblies.update(assyobj, {
                where: {
                    id: req.body.rfqAssyID
                },
                fields: ['status', 'quoteFinalStatus', 'winQuantity', 'winPrice', 'reason', 'quoteClosedBy', 'quoteClosedDate', 'updatedBy', 'updateByRoleId']
            }).then(StatusResponse => RFQAssemblies.findAll({
                where: {
                    id: req.body.rfqAssyID,
                    isActivityStart: true
                },
                attributes: ['id', 'isActivityStart']
            }).then((response) => {
                if (response && response.length > 0) {
                    const rfqAssyIDs = _.map(response, 'id');
                    return sequelize.query('CALL Sproc_costingStopActivityForMultipleAssembly (:prfqAssyID,:pUserId)', {
                        replacements: {
                            prfqAssyID: rfqAssyIDs.join(),
                            pUserId: loginUserId
                        }
                    }).then(() => {
                        _.each(response, (objAssy) => {
                            var data = {
                                rfqAssyID: objAssy.id,
                                loginUserId: loginUserId,
                                userName: req.user.username,
                                isActivityStart: false
                            };
                            RFQSocketController.sendCostingStartStopActivity(req, data);
                        });
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, StatusResponse, MESSAGE_CONSTANT.UPDATED(rfqStatusModuleName));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, StatusResponse, MESSAGE_CONSTANT.UPDATED(rfqStatusModuleName));
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get list of Req assembly Header
    // GET : /api/v1/rfqAssemblies/getAssemblyHeaderDetails
    // @return list of Req assembly Header
    getAssemblyHeaderDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.rfqAssyID) {
            return sequelize.query('CALL Sproc_GetAssyBOMHeaderList (:rfqAssyID)', {
                replacements: {
                    rfqAssyID: req.body.rfqAssyID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { bomHeader: _.values(response[0]) }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive rfq assy Bom by id
    // GET : /api/v1/rfqAssemblies/generateAssyQuoteSummary
    // @return rfqAssyBom
    generateAssyQuoteSummary: (req, res) => {
        const { RFQAssembliesQuotationSubmitted, sequelize } = req.app.locals.models;
        if (req.params.id) {
            return RFQAssembliesQuotationSubmitted.findOne({
                where: {
                    rfqAssyID: req.params.id,
                    isDeleted: false
                },
                attributes: ['id', 'quoteNumber', 'rfqAssyID', 'isDeleted'],
                order: [['id', 'DESC']]
            }).then((response) => {
                if (response) {
                    if (!response.quoteNumber && parseInt(req.params.quoteSubmittedID) === response.id) {
                        return sequelize.query('CALL Sproc_GenerateQuoteSummary (:rfqAssyID)', {
                            replacements: {
                                rfqAssyID: req.params.id
                            },
                            type: sequelize.QueryTypes.SELECT
                        }).then((responseSummary) => {
                            if (!responseSummary) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(assyQuotemoduleName), err: null, data: null });
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                generatedSummary: _.values(responseSummary[0]),
                                generatedCustomPart: _.values(responseSummary[1]),
                                generatedNRE: _.values(responseSummary[2]),
                                generatedTooling: _.values(responseSummary[3]),
                                dataCount: responseSummary[4][0]['COUNT(*)'],
                                rfqPriceGroupDetail: _.values(responseSummary[5]),
                                rfqPriceGroup: _.values(responseSummary[6])
                            }, null);
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.FAILED, { quoteSubmittedID: response.id }, null);
                    }
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
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
    // Get Details Of assy Quantity
    // GET : /api/v1/rfqAssemblies/getRFQAssyQtyList
    // @param {id} int
    // @return Details Of assy Quantity
    getRFQAssyQtyList: (req, res) => {
        const { RFQAssyQuantity } = req.app.locals.models;
        RFQAssyQuantity.findAll({
            where: { rfqAssyID: req.params.rfqAssyID }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Generate rfq quote detail report
    // POST : /api/v1/rfqAssemblies/generateRFQQuoteDetailReport
    // @return BOM Data with costing and Issue
    generateRFQQuoteDetailReport: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            if (req.body.rfqAssyID) {
                return sequelize.query('CALL Sproc_ExportRFQQuoteDetail (:rfqAssyID)', {
                    replacements: {
                        rfqAssyID: req.body.rfqAssyID
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    var workbook1 = new Excel.Workbook();
                    let assyName = null;
                    let customerCode = null;
                    const timespan = Date.now();
                    if (response && response.length > 0) {
                        const ConsolidateBOMData = _.values(response[0]);
                        const BOM = _.values(response[1]);
                        const AssyList = _.values(response[2]);
                        const QtywisePriceList = _.values(response[3]);
                        const AssyQtyList = _.values(response[4]);
                        const mainAssyDetail = _.values(response[5]);
                        if (mainAssyDetail && mainAssyDetail.length > 0) {
                            assyName = mainAssyDetail[0].mfgPNwithoutSpecialChar;
                            customerCode = mainAssyDetail[0].customerCode;
                        }
                        if (ConsolidateBOMData.length > 0 && AssyList.length > 0 && QtywisePriceList.length > 0 && AssyQtyList.length > 0) {
                            const sheet1 = workbook1.addWorksheet('PartCosting Consolidated');
                            sheet1.columns = [];
                            const QuotesummaryDetail = [];
                            _.each(ConsolidateBOMData, (consolidatedataObj) => {
                                const obj = {
                                    Item: consolidatedataObj.Item,
                                    QPA: consolidatedataObj.QPA,
                                    RefDes: consolidatedataObj.RefDes,
                                    Buy: consolidatedataObj.Buy,
                                    Populate: consolidatedataObj.Populate,
                                    UOM: consolidatedataObj.UOM,
                                    MFR: consolidatedataObj.MFR,
                                    MFRPN: consolidatedataObj.MFRPN,
                                    Pin: consolidatedataObj.Pin
                                };
                                consolidatedataObj.consolidatedpartlineID = consolidatedataObj.consolidatedpartlineID.replace(/{/g, '').replace(/}/g, '');
                                consolidatedataObj.consolidatedpartlineIDPart = consolidatedataObj.consolidatedpartlineID ? consolidatedataObj.consolidatedpartlineID.split(',') : '';
                                _.each(consolidatedataObj.consolidatedpartlineIDPart, (qpaobj) => {
                                    var dashSplit = qpaobj.split('|');
                                    var i = 0;
                                    var consolidatQPAobj = {};
                                    _.each(dashSplit, (innerItem) => {
                                        const innerItemData = innerItem.split(':');
                                        if (i === 0) {
                                            consolidatQPAobj.level = innerItemData.length > 1 ? innerItemData[1] : null;
                                        }
                                        if (i === 1) {
                                            consolidatQPAobj.part = innerItemData.length > 1 ? innerItemData[1] : null;
                                        }
                                        if (i === 2) {
                                            consolidatQPAobj.item = innerItemData.length > 1 ? innerItemData[1] : null;
                                        }
                                        if (i === 3) {
                                            consolidatQPAobj.qpa = innerItemData.length > 1 ? parseFloat(innerItemData[1]) : 0;
                                        } if (i === 4) {
                                            consolidatQPAobj.DNPQPA = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
                                        }
                                        if (i === 5) {
                                            consolidatQPAobj.isBuyDNPQPA = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
                                        }
                                        if (i === 6) {
                                            consolidatQPAobj.RefDesCount = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
                                        }
                                        if (i === 7) {
                                            consolidatQPAobj.isPurchase = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
                                        }
                                        if (i === 8) {
                                            consolidatQPAobj.DNPRefDesgCount = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
                                        }
                                        if (i === 9) {
                                            consolidatQPAobj.isPopulate = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
                                        }
                                        i += 1;
                                    });
                                    if (consolidatQPAobj.isPurchase && consolidatQPAobj.isBuyDNPQPA) {
                                        consolidatQPAobj.consolidatedQPA = (consolidatQPAobj.qpa > consolidatQPAobj.RefDesCount ? consolidatQPAobj.qpa : consolidatQPAobj.RefDesCount) + (consolidatQPAobj.DNPQPA > consolidatQPAobj.DNPRefDesgCount ? consolidatQPAobj.DNPQPA : consolidatQPAobj.DNPRefDesgCount);
                                    } else if (!consolidatQPAobj.isPurchase && consolidatQPAobj.isBuyDNPQPA) {
                                        consolidatQPAobj.consolidatedQPA = (consolidatQPAobj.DNPQPA > consolidatQPAobj.DNPRefDesgCount ? consolidatQPAobj.DNPQPA : consolidatQPAobj.DNPRefDesgCount);
                                    } else if (consolidatQPAobj.isPurchase && !consolidatQPAobj.isBuyDNPQPA) {
                                        consolidatQPAobj.consolidatedQPA = (consolidatQPAobj.qpa > consolidatQPAobj.RefDesCount ? consolidatQPAobj.qpa : consolidatQPAobj.RefDesCount);
                                    } else if (!consolidatQPAobj.isPurchase && !consolidatQPAobj.isBuyDNPQPA) {
                                        consolidatQPAobj.consolidatedQPA = (consolidatQPAobj.qpa > consolidatQPAobj.RefDesCount ? consolidatQPAobj.qpa : consolidatQPAobj.RefDesCount) + (consolidatQPAobj.DNPQPA > consolidatQPAobj.DNPRefDesgCount ? consolidatQPAobj.DNPQPA : consolidatQPAobj.DNPRefDesgCount);
                                    }
                                    _.each(AssyList, (assyObj) => {
                                        if (consolidatedataObj.partID === assyObj.prPerPartID) {
                                            obj[`${assyObj.AssyID} QPA`] = consolidatQPAobj.consolidatedQPA;
                                        } else {
                                            obj[`${assyObj.AssyID} QPA`] = null;
                                        }
                                    });
                                    const QtyWisePricListforConsolidateID = _.filter(QtywisePriceList, objqtywise => objqtywise.consolidateID === consolidatedataObj.consolidateID);
                                    _.each(QtyWisePricListforConsolidateID, (qtyObj) => {
                                        if (consolidatedataObj.partID === qtyObj.partID && consolidatedataObj.consolidateID === qtyObj.consolidateID) {
                                            obj[`Requested Qty ${qtyObj.requestQty}`] = consolidatedataObj.QPA * qtyObj.requestQty * (qtyObj.connecterTypeID === -2 ? (consolidatedataObj.Pin ? consolidatedataObj.Pin : 1) : 1);
                                            obj[`Unit Price ${qtyObj.requestQty}`] = qtyObj.unitPrice;
                                            obj[`Ext Price ${qtyObj.requestQty}`] = qtyObj.unitPrice * (consolidatedataObj.QPA * qtyObj.requestQty) * (qtyObj.connecterTypeID === -2 ? (consolidatedataObj.Pin ? consolidatedataObj.Pin : 1) : 1);
                                            obj[`Supplier ${qtyObj.requestQty}`] = qtyObj.supplier;
                                            obj[`Selected MPN ${qtyObj.requestQty}`] = qtyObj.selectedMpn;
                                        } else {
                                            obj[`Supplier${qtyObj.requestQty}`] = null;
                                            obj[`Unit Price${qtyObj.requestQty}`] = null;
                                            obj[`Ext Price${qtyObj.requestQty}`] = null;
                                            obj[`Requested Qty${qtyObj.requestQty}`] = null;
                                            obj[`Supplier${qtyObj.requestQty}`] = null;
                                            obj[`Selected MPN${qtyObj.requestQty}`] = null;
                                        }
                                    });
                                });
                                QuotesummaryDetail.push(obj);
                            });
                            let columns = [];
                            _.each(QuotesummaryDetail, (resobj) => {
                                let keys = [];
                                keys = Object.keys(resobj);
                                _.each(keys, (key) => {
                                    if (key !== 'PartID') {
                                        let header = key;
                                        if (key === 'MFRPN') {
                                            header = 'MPN';
                                        } if (key === 'PendingIssues') {
                                            header = 'Pending Issues';
                                        }
                                        const obj = { header: header, key: key, wrapText: true };
                                        columns.push(obj);
                                    }
                                });
                            });
                            columns = _.uniqBy(columns, e => e.header);
                            sheet1.columns = columns;
                            _.each(QuotesummaryDetail, (item) => {
                                const mfrlist = item.MFR ? item.MFR.split('@@@') : [];
                                const mfrPNlist = item.MFRPN ? item.MFRPN.split('@@@') : [];
                                // let PendingIssueslist = item.PendingIssues.split('@@@');
                                if (mfrlist.length > 1) {
                                    _.each(mfrlist, (mfrObj, i) => {
                                        if (i > 0) {
                                            item = {};
                                            item.MFR = mfrObj;
                                            item.MFRPN = mfrPNlist[i];
                                            // item.PendingIssues = PendingIssueslist[i];
                                            sheet1.addRow(item);
                                        } else {
                                            item.MFR = mfrObj;
                                            item.MFRPN = mfrPNlist[i];
                                            // item.PendingIssues = PendingIssueslist[i];
                                            sheet1.addRow(item);
                                        }
                                    });
                                } else {
                                    sheet1.addRow(item);
                                }
                            });
                            sheet1.eachRow((row, rowNumber) => {
                                if (rowNumber > 1) {
                                    row.eachCell((cell, colNumber) => {
                                        // eslint-disable-next-line no-underscore-dangle
                                        if (cell.value && cell._column._key === 'DatasheetURL') {
                                            row.getCell(colNumber).font = { color: { argb: '004e47cc' } };
                                        }
                                    });
                                }
                            });
                        }
                        if (BOM.length > 0) {
                            const subAssyList = _.groupBy(BOM, 'AssyID');
                            _.each(subAssyList, (item) => {
                                var sheet1 = workbook1.addWorksheet(item[0].AssyIDwithoutSpecialChar ? item[0].AssyIDwithoutSpecialChar.substring(0, 31) : item[0].AssyIDwithoutSpecialChar);
                                sheet1.columns = [];
                                let columns = [];
                                _.each(item, (resobj) => {
                                    let keys = [];
                                    keys = Object.keys(resobj);
                                    _.each(keys, (key) => {
                                        if (key !== 'PartID') {
                                            let header = key;
                                            if (key === 'AssyID') {
                                                header = 'Assy ID';
                                            }
                                            if (key === 'MFRPN') {
                                                header = 'MPN';
                                            } if (key === 'PendingIssues') {
                                                header = 'Pending Issues';
                                            }
                                            if (key === 'Pin') {
                                                header = 'Pin Count';
                                            }
                                            const obj = { header: header, key: key, wrapText: true };
                                            columns.push(obj);
                                        }
                                    });
                                });
                                columns = _.uniqBy(columns, e => e.header);
                                sheet1.columns = columns;
                                _.each(item, (itemDet) => {
                                    const mfrlist = itemDet.MFR ? itemDet.MFR.split('@@@') : [];
                                    const mfrPNlist = itemDet.MFRPN ? itemDet.MFRPN.split('@@@') : [];
                                    const PendingIssueslist = itemDet.PendingIssues ? itemDet.PendingIssues.split('@@@') : [];
                                    if (mfrlist.length > 1) {
                                        _.each(mfrlist, (mfrObj, i) => {
                                            if (i > 0) {
                                                itemDet = {};
                                                itemDet.MFR = mfrObj;
                                                itemDet.MFRPN = mfrPNlist[i];
                                                itemDet.PendingIssues = PendingIssueslist ? PendingIssueslist[i] : null;
                                                sheet1.addRow(itemDet);
                                            } else {
                                                itemDet.MFR = mfrObj;
                                                itemDet.MFRPN = mfrPNlist[i];
                                                itemDet.PendingIssues = PendingIssueslist ? PendingIssueslist[i] : null;
                                                sheet1.addRow(itemDet);
                                            }
                                        });
                                    } else {
                                        sheet1.addRow(itemDet);
                                    }
                                });
                                sheet1.eachRow((row, rowNumber) => {
                                    if (rowNumber > 1) {
                                        row.eachCell((cell, colNumber) => {
                                            // eslint-disable-next-line no-underscore-dangle
                                            if (cell.value && cell._column._key === 'DatasheetURL') {
                                                row.getCell(colNumber).font = { color: { argb: '004e47cc' } };
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    }
                    const path = DATA_CONSTANT.GENERICCATEGORY.UPLOAD_PATH;
                    mkdirp(path, () => { });
                    const filename = `FCA ${customerCode}-${assyName}-Costed BOM-${timespan}.xls`;
                    res.setHeader('Content-Type', 'application/vnd.ms-excel');
                    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);


                    return workbook1.xlsx.writeFile(path + filename).then(() => {
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
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Generate rfq quote detail report
    // POST : /api/v1/rfqAssemblies/generateRFQCostDetailReport
    // @return BOM Data with costing and Issue
    generateRFQCostDetailReport: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            if (req.body.rfqAssyID) {
                return sequelize.query('CALL Sproc_ExportRFQCostDetail (:rfqAssyID)', {
                    replacements: {
                        rfqAssyID: req.body.rfqAssyID
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    var workbook1 = new Excel.Workbook();
                    if (response && response.length > 0) {
                        // var ConsolidateBOMData = _.values(response[0]);
                        const BOM = _.values(response[0]);
                        // const AssyList = _.values(response[1]);
                        const QtywisePriceList = _.values(response[2]);
                        // const AssyQtyList = _.values(response[3]);
                        if (BOM.length > 0) {
                            _.each(BOM, (item) => {
                                const QtyWisePricListforConsolidateID = _.filter(QtywisePriceList, objqtywise => objqtywise.consolidatedLineItemIDs && _.includes(objqtywise.consolidatedLineItemIDs.split(','), item.refRFQLineItemID));
                                _.each(QtyWisePricListforConsolidateID, (qtyObj) => {
                                    if (item.partID === qtyObj.partID) {
                                        item[`Requested Qty ${qtyObj.requestQty}`] = item.QPA * qtyObj.requestQty * (qtyObj.connecterTypeID === -2 ? item.Pin ? item.Pin : 1 : 1);
                                        item[`Unit Price ${qtyObj.requestQty}`] = qtyObj.unitPrice;
                                        item[`Ext Price  ${qtyObj.requestQty}`] = qtyObj.unitPrice * (item.QPA * qtyObj.requestQty) * (qtyObj.connecterTypeID === -2 ? item.Pin ? item.Pin : 1 : 1);
                                        item[`Supplier ${qtyObj.requestQty}`] = qtyObj.supplier;
                                        item[`Selected MPN ${qtyObj.requestQty}`] = qtyObj.selectedMpn;
                                    } else {
                                        item[`Supplier${qtyObj.requestQty}`] = null;
                                        item[`Unit Price${qtyObj.requestQty}`] = null;
                                        item[`Ext Price${qtyObj.requestQty}`] = null;
                                        item[`Requested Qty${qtyObj.requestQty}`] = null;
                                        item[`Supplier${qtyObj.requestQty}`] = null;
                                        item[`Selected MPN${qtyObj.requestQty}`] = null;
                                    }
                                });
                            });
                        }
                        if (BOM.length > 0) {
                            const subAssyList = _.groupBy(BOM, 'AssyID');
                            _.each(subAssyList, (item) => {
                                var sheet1 = workbook1.addWorksheet(item[0].AssyIDwithoutSpecialChar ? item[0].AssyIDwithoutSpecialChar.substring(0, 31) : item[0].AssyIDwithoutSpecialChar);

                                sheet1.columns = [];
                                let columns = [];
                                _.each(item, (resobj) => {
                                    let keys = [];
                                    keys = Object.keys(resobj);
                                    _.each(keys, (key) => {
                                        if (key !== 'PartID' && key !== 'assyPn' && key !== 'AssyID' && key !== 'refRFQLineItemID' && key !== 'partID' && key !== 'PendingIssues') {
                                            let header = key;
                                            if (key === 'MFRPN') {
                                                header = 'MPN';
                                            } if (key === 'PendingIssues') {
                                                header = 'Pending Issues';
                                            }
                                            if (key === 'Pin') {
                                                header = 'Pin Count';
                                            }
                                            const obj = {
                                                header: header,
                                                key: key,
                                                wrapText: true
                                            };
                                            columns.push(obj);
                                        }
                                    });
                                });
                                columns = _.uniqBy(columns, e => e.header);
                                sheet1.columns = columns;
                                _.each(item, (itemDet) => {
                                    const mfrlist = itemDet.MFR ? itemDet.MFR.split('@@@') : [];
                                    const mfrPNlist = itemDet.MFRPN ? itemDet.MFRPN.split('@@@') : [];
                                    const PendingIssueslist = itemDet.PendingIssues ? itemDet.PendingIssues.split('@@@') : [];
                                    if (mfrlist.length > 1) {
                                        _.each(mfrlist, (mfrObj, i) => {
                                            if (i > 0) {
                                                itemDet = {};
                                                itemDet.MFR = mfrObj;
                                                itemDet.MFRPN = mfrPNlist[i];
                                                itemDet.PendingIssues = PendingIssueslist ? PendingIssueslist[i] : null;
                                                sheet1.addRow(itemDet);
                                            } else {
                                                itemDet.MFR = mfrObj;
                                                itemDet.MFRPN = mfrPNlist[i];
                                                itemDet.PendingIssues = PendingIssueslist ? PendingIssueslist[i] : null;
                                                sheet1.addRow(itemDet);
                                            }
                                        });
                                    } else {
                                        sheet1.addRow(itemDet);
                                    }
                                });
                            });
                        }
                    }
                    const path = DATA_CONSTANT.GENERICCATEGORY.UPLOAD_PATH;
                    mkdirp(path, () => { });
                    const filename = req.body.filename;
                    res.setHeader('Content-Type', 'application/vnd.ms-excel');
                    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);


                    return workbook1.xlsx.writeFile(path + filename).then(() => {
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
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // save internal version for labor/pricing and assy
    // POST : /api/v1/rfqAssemblies/saveInternalVersionAssy
    // @return save internal version
    saveInternalVersionAssy: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_saveInternalVersionAssy (:pAssyId,:isPricing,:issubmit)', {
                replacements: {
                    pAssyId: req.body.pAssyId,
                    isPricing: req.body.isPricing,
                    issubmit: req.body.issubmit
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Update Start and Stop activity
    // POST : /api/v1/rfqAssemblies/startStopActivity
    // @return Update Start and Stop activity
    startStopActivity: (req, res) => {
        const { sequelize } = req.app.locals.models;
        var loginUserId = COMMON.getRequestUserID(req);
        return sequelize.query('CALL Sproc_saveStartStopActivity (:pRefTransID,:pUserId,:pIsActivityStart,:pTransactionType,:pActivityType,:pRemark,:pRoleID)', {
            replacements: {
                pRefTransID: req.body.refTransID,
                pUserId: loginUserId,
                pIsActivityStart: req.body.isActivityStart,
                pTransactionType: req.body.transactionType,
                pActivityType: req.body.actionType,
                pRemark: req.body.remark || null,
                pRoleID: COMMON.getRequestUserLoginRoleID(req)
            }
        }).then((responseActivity) => {
            if (responseActivity) {
                const data = {
                    loginUserId: loginUserId,
                    userName: req.user.username,
                    isActivityStart: req.body.isActivityStart,
                    activityStartAt: responseActivity[0].activityStartAt,
                    activityStopAt: responseActivity[0].activityStopAt
                };
                const messageContent = Object.assign({}, req.body.transactionType === DATA_CONSTANT.ActivityTransactionType.Costing ? MESSAGE_CONSTANT.RFQ.COSTING_ACTIVITY : MESSAGE_CONSTANT.RFQ.BOM_ACTIVITY);
                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.isActivityStart ? 'started' : 'stopped');
                if (req.body.transactionType === DATA_CONSTANT.ActivityTransactionType.BOM) {
                    data.partID = req.body.refTransID;
                    RFQSocketController.sendBOMStartStopActivity(req, data);
                } else if (req.body.transactionType === DATA_CONSTANT.ActivityTransactionType.Costing) {
                    data.rfqAssyID = req.body.refTransID;
                    RFQSocketController.sendCostingStartStopActivity(req, data);
                } else {
                    data.rfqAssyID = req.body.refTransID;
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                    {
                        updatedUserID: responseActivity[0].updatedUserID,
                        isActivityStart: req.body.isActivityStart,
                        activityStartAt: data.activityStartAt,
                        activityStopAt: data.activityStopAt
                    }, messageContent.message);
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { updatedUserID: responseActivity[0].updatedUserID }, null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Update start and Stop Costing activity Deatails
    // POST : /api/v1/rfqAssemblies/startStopCostingActivity
    // @return Update start and Stop Cositng activity Deatails
    startStopCostingActivity: (req, res) => {
        const { RFQAssemblies } = req.app.locals.models;
        if (req.body.refTransID) {
            return RFQAssemblies.findOne({
                where: {
                    id: req.body.refTransID
                },
                attributes: ['isActivityStart']
            }).then((response) => {
                if (response && response.isActivityStart !== req.body.isActivityStart) {
                    return module.exports.startStopActivity(req, res);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, COMMON.stringFormat(MESSAGE_CONSTANT.RFQ_LINEITEMS.COSTING_ACTIVITY_AL.message, req.body.isActivityStart ? 'started' : 'stopped'));
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
    // Retrieve list of costing activity transDetails
    // POST : /api/v1/rfqAssemblies/retrieveActivityTrackingHistory
    // @return list of costing activity transDetails
    retrieveActivityTrackingHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.refTransID) {
            return sequelize.query('CALL Sproc_RetrieveActivityTrackingHistory (:pRefTransID)', {
                replacements: {
                    pRefTransID: req.body.refTransID
                }
            }).then(transDetails => resHandler.successRes(res, 200, STATE.SUCCESS, transDetails))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, err);
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.WORKORDER_TRANS.NOT_FOUND));
        }
    },
    // Retrive rfq Assembly by partId
    // GET : /api/v1/rfqAssemblies/getAllRFQAssemblyByPartID
    // @return RFQ Assembly list by partID
    getAllRFQAssemblyByPartID: (req, res) => {
        const { RFQAssemblies } = req.app.locals.models;
        if (req.params.id) {
            return RFQAssemblies.findAll({
                where: {
                    partID: req.params.id
                },
                attributes: ['id', 'partID', 'status', 'quoteFinalStatus']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive Assembly history by id
    // GET : /api/v1/rfqAssemblies/getAssemblyHistoryByID
    // @return Assembly history list by id
    getAssemblyHistoryByID: (req, res) => {
        const { AssemblyTransHistory } = req.app.locals.models;
        if (req.params.id) {
            return AssemblyTransHistory.findOne({
                where: {
                    id: req.params.id
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Manage Assembly history Details
    // POST : /api/v1/rfqAssemblies/saveManualActivityTracking
    // @return Assembly details
    saveManualActivityTracking: (req, res) => {
        const { AssemblyTransHistory } = req.app.locals.models;
        if (req.body) {
            if (req.body.id) {
                // Update
                COMMON.setModelUpdatedByFieldValue(req);
                return AssemblyTransHistory.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: inputFieldsAssyHistory
                }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(assyHistoryModuleName))
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                // Create
                COMMON.setModelCreatedByFieldValue(req);
                return AssemblyTransHistory.create(req.body, {
                    fields: inputFieldsAssyHistory
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(assyHistoryModuleName))
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // get All Activity Tracking for Costing Transaction Type
    // POST : /api/v1/rfqAssemblies/getAllRFQListByID
    // @return API response
    getAllRFQListByID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.id) {
            return sequelize.query('CALL Sproc_GetAllRFQListByID (:pRefTransID)', {
                replacements: {
                    pRefTransID: req.body.id || null
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // remove Activity Transaction Details
    // POST : /api/v1/rfqAssemblies/deleteAssyTransHistory
    // @return API response
    deleteAssyTransHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.ASSEMBLY_TRANS_HISTORY.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: false,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(assyHistoryModuleName)
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // update employee payment mode and burdan rate for assembly history
    // GET : /api/v1/rfqAssemblies/updatePaymentBurdanDetails
    // @return status success
    updatePaymentBurdanDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.ids) {
            return sequelize.query('CALL Sproc_saveEmployeeDetailsforAssyTransHistory (:pIsFromMaster,:pIDs,:pPaymentMode,:pBurdenRate,:pUserID,:pRoleID)', {
                replacements: {
                    pIsFromMaster: req.body.isFromMaster || false,
                    pIDs: req.body.ids.toString(),
                    pPaymentMode: req.body.paymentMode || null,
                    pBurdenRate: req.body.burdenRate || null,
                    pUserID: COMMON.getRequestUserID(req),
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(assyHistoryModuleName))
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve list Manual Activity entry
    // GET : /api/v1/rfqAssemblies/retrieveManualEntryList
    // @return list of Manual Activity entry
    retrieveManualEntryList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveActivityManualEntryList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pTransType,:pActivityType,:pEmployeeIds,:pAssyIds)',
                {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere || null,
                        pTransType: req.body.transactionType || null,
                        pActivityType: req.body.activityType || null,
                        pEmployeeIds: req.body.employeeIds || null,
                        pAssyIds: req.body.assyIds || ''
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, { activityList: _.values(response[1]), Count: response[0][0]['TotalRecord'] })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
