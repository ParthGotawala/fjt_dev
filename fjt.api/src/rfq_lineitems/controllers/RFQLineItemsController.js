/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const { Op } = require('sequelize');
const mkdirp = require('mkdirp');
const uuidv1 = require('uuid/v1');
const { STATE, GENERICCATEGORY, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotCreate } = require('../../errors');
const resHandler = require('../../resHandler');
const fs = require('fs');
const Bson = require('bson');
const RFQConsolidatedMFGPNLineItemController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQ_Consolidated_MFGPN_LineItemController.js');
const PricingController = require('../../pricing/controllers/PricingController.js');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
var Excel = require('exceljs');
const fsExtra = require('fs-extra');
const RfqAssembliesController = require('../../rfq_assemblies/controllers/Rfq_AssembliesController');
const SupplierQuoteController = require('../../supplier_quote/controllers/SupplierQuoteController');
// const constant = require('../../constant');

Excel.config.setValue('promise');
const bomModuleName = DATA_CONSTANT.RFQ_LINEITEMS.BOMNAME;
const apiVerificationError = 'API Verification Errors';
const PricingErrors = DATA_CONSTANT.COMPONENT_ERROR_TYPE;
const createFields = [
    'lineID',
    'qpa',
    'refDesig',
    'refDesigCount',
    'dnpDesigCount',
    'custPN',
    'custPNID',
    'uomID',
    'programingStatus',
    'isInstall',
    'isPurchase',
    'isNotRequiredKitAllocation',
    'isSupplierToBuy',
    'isDeleted',
    'createdBy',
    'customerRev',
    'customerDescription',
    'numOfPosition',
    'numOfRows',
    'dnpQty',
    'dnpDesig',
    'qpaDesignatorStep',
    'description',
    'customerPartDesc',
    'mergeLines',
    'lineMergeStep',
    'isBuyDNPQty',
    'isObsoleteLine',
    'restrictCPNUseWithPermissionStep',
    'restrictCPNUsePermanentlyStep',
    'restrictCPNUseInBOMStep',
    'customerApprovalCPN',
    'customerApprovalCPNBy',
    'customerApprovalCPNDate',
    'requireMountingTypeStep',
    'requireFunctionalTypeStep',
    'partID',
    'cust_lineID',
    'customerApprovalForQPAREFDESStep',
    'customerApprovalForBuyStep',
    'customerApprovalForPopulateStep',
    'substitutesAllow',
    'requireMountingTypeError',
    'requireFunctionalTypeError',
    'dnpQPARefDesStep',
    'customerApprovalForDNPQPAREFDESStep',
    'customerApprovalForDNPBuyStep',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'programmingMappingPendingRefdesCount'
];
const updateFields = [
    'lineID',
    'qpa',
    'refDesig',
    'refDesigCount',
    'dnpDesigCount',
    'custPN',
    'custPNID',
    'uomID',
    'programingStatus',
    'isInstall',
    'isPurchase',
    'isNotRequiredKitAllocation',
    'isSupplierToBuy',
    'updatedBy',
    'customerRev',
    'customerDescription',
    'numOfPosition',
    'numOfRows',
    'dnpQty',
    'dnpDesig',
    'qpaDesignatorStep',
    'description',
    'customerPartDesc',
    'mergeLines',
    'isDeleted',
    'lineMergeStep',
    'isBuyDNPQty',
    'isObsoleteLine',
    'restrictCPNUseWithPermissionStep',
    'restrictCPNUsePermanentlyStep',
    'restrictCPNUseInBOMStep',
    'customerApprovalCPN',
    'customerApprovalCPNBy',
    'customerApprovalCPNDate',
    'requireMountingTypeStep',
    'requireFunctionalTypeStep',
    'partID',
    'cust_lineID',
    'customerApprovalForQPAREFDESStep',
    'customerApprovalForBuyStep',
    'customerApprovalForPopulateStep',
    'substitutesAllow',
    'requireMountingTypeError',
    'requireFunctionalTypeError',
    'dnpQPARefDesStep',
    'customerApprovalForDNPQPAREFDESStep',
    'customerApprovalForDNPBuyStep',
    'updateByRoleId',
    'deleteByRoleId',
    'programmingMappingPendingRefdesCount'
];
const createFieldsAlternate = [
    'rfqLineItemsID',
    'mfgCode',
    'mfgCodeID',
    'mfgPN',
    'mfgPNID',
    'distributor',
    'distMfgCodeID',
    'distPN',
    'distMfgPNID',
    'description',
    'RoHSStatusID',
    'createdBy',
    'mfgVerificationStep',
    'mfgDistMappingStep',
    'mfgCodeStep',
    'distVerificationStep',
    'distCodeStep',
    'getMFGPNStep',
    'obsoletePartStep',
    'mfgGoodPartMappingStep',
    'distGoodPartMappingStep',
    'mfgPNStep',
    'distPNStep',
    'customerApproval',
    'isCustomerUnAppoval',
    'badMfgPN',
    'nonRohsStep',
    'epoxyStep',
    'invalidConnectorTypeStep',
    'mismatchNumberOfRowsStep',
    'partPinIsLessthenBOMPinStep',
    'exportControlledStep',
    'tbdPartStep',
    'duplicateMPNInSameLineStep',
    'mismatchMountingTypeStep',
    'pickupPadRequiredStep',
    'matingPartRquiredStep',
    'driverToolsRequiredStep',
    'functionalTestingRequiredStep',
    'mismatchFunctionalCategoryStep',
    'mismatchCustomPartStep',
    'restrictUseWithPermissionStep',
    'restrictUsePermanentlyStep',
    'mismatchValueStep',
    'mismatchPackageStep',
    'mismatchToleranceStep',
    'mismatchTempratureStep',
    'mismatchPowerStep',
    'programingRequiredStep',
    'uomMismatchedStep',
    'mismatchColorStep',
    'parttypeID',
    'mountingtypeID',
    'partcategoryID',
    'partID',
    'restrictUseInBOMStep',
    'restrictUseInBOMWithPermissionStep',
    'restrictUseInBOMExcludingAliasStep',
    'restrictUseInBOMExcludingAliasWithPermissionStep',
    'restrictUseExcludingAliasStep',
    'restrictUseExcludingAliasWithPermissionStep',
    'approvedMountingType',
    'unknownPartStep',
    'defaultInvalidMFRStep',
    'suggestedGoodPartStep',
    'suggestedGoodDistPartStep',
    'isUnlockApprovedPart',
    'userData1',
    'userData2',
    'userData3',
    'userData4',
    'userData5',
    'userData6',
    'userData7',
    'userData8',
    'userData9',
    'userData10',
    'mismatchRequiredProgrammingStep',
    'mappingPartProgramStep',
    'suggestedByApplicationStep',
    'suggestedByApplicationMsg',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'mismatchProgrammingStatusStep',
    'isMPNAddedinCPN',
    'mismatchPitchStep',
    'mismatchCustpartRevStep',
    'mismatchCPNandCustpartRevStep'
];
const updateFieldsAlternate = [
    'rfqLineItemsID',
    'mfgCode',
    'mfgCodeID',
    'mfgPN',
    'mfgPNID',
    'distributor',
    'distMfgCodeID',
    'distPN',
    'distMfgPNID',
    'description',
    'copyAlternetPartID',
    'updatedBy',
    'mfgVerificationStep',
    'mfgDistMappingStep',
    'mfgCodeStep',
    'distVerificationStep',
    'distCodeStep',
    'getMFGPNStep',
    'obsoletePartStep',
    'mfgGoodPartMappingStep',
    'distGoodPartMappingStep',
    'mfgPNStep',
    'distPNStep',
    'customerApproval',
    'customerApprovalBy',
    'customerApprovalDate',
    'isCustomerUnAppoval',
    'customerUnAppovalBy',
    'customerUnAppovalDate',
    'badMfgPN',
    'nonRohsStep',
    'epoxyStep',
    'invalidConnectorTypeStep',
    'mismatchNumberOfRowsStep',
    'partPinIsLessthenBOMPinStep',
    'exportControlledStep',
    'tbdPartStep',
    'duplicateMPNInSameLineStep',
    'mismatchMountingTypeStep',
    'pickupPadRequiredStep',
    'matingPartRquiredStep',
    'driverToolsRequiredStep',
    'functionalTestingRequiredStep',
    'mismatchFunctionalCategoryStep',
    'mismatchCustomPartStep',
    'restrictUseWithPermissionStep',
    'restrictUsePermanentlyStep',
    'mismatchValueStep',
    'mismatchPackageStep',
    'mismatchToleranceStep',
    'mismatchTempratureStep',
    'mismatchPowerStep',
    'programingRequiredStep',
    'uomMismatchedStep',
    'mismatchColorStep',
    'parttypeID',
    'mountingtypeID',
    'partcategoryID',
    'partID',
    'restrictUseInBOMStep',
    'restrictUseInBOMWithPermissionStep',
    'restrictUseInBOMExcludingAliasStep',
    'restrictUseInBOMExcludingAliasWithPermissionStep',
    'restrictUseExcludingAliasStep',
    'restrictUseExcludingAliasWithPermissionStep',
    'approvedMountingType',
    'unknownPartStep',
    'defaultInvalidMFRStep',
    'suggestedGoodPartStep',
    'suggestedGoodDistPartStep',
    'isUnlockApprovedPart',
    'userData1',
    'userData2',
    'userData3',
    'userData4',
    'userData5',
    'userData6',
    'userData7',
    'userData8',
    'userData9',
    'userData10',
    'mismatchRequiredProgrammingStep',
    'mappingPartProgramStep',
    'suggestedByApplicationStep',
    'suggestedByApplicationMsg',
    'updateByRoleId',
    'deleteByRoleId',
    'mismatchProgrammingStatusStep',
    'isMPNAddedinCPN',
    'mismatchPitchStep',
    'mismatchCustpartRevStep',
    'mismatchCPNandCustpartRevStep'
];
const createOrgFields = [
    'org_lineID',
    'cust_lineID',
    'org_qpa',
    'org_refDesig',
    'org_custPN',
    'org_uomName',
    'org_isInstall',
    'org_isPurchase',
    'org_customerRev',
    'org_customerDescription',
    'org_numOfPosition',
    'org_numOfRows',
    'org_customerPartDesc',
    'org_substitutesAllow',
    'org_dnpQty',
    'org_dnpDesig',
    'org_buyDNPQty'
];
const createAlternateOrgFields = [
    'org_distributor',
    'org_distPN',
    'org_mfgCode',
    'org_mfgPN'
];
const createRFQLineitemsApprovalCommentFields = [
    'rfqLineItemsAlternatePartID',
    'comment',
    'approvalBy',
    'approvalDate',
    'mfgCode',
    'mfgPN',
    'approvalType',
    'createdBy',
    'errorCode',
    'rfqLineItemsID',
    'requiredToShowOnQuoteSummary',
    'isCustomerApproved',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const rfqQuoteIssueHistoryFields = [
    'id',
    'refSubmittedQuoteID',
    'rfqAssyID',
    'issueType',
    'PIDCode',
    'lineID',
    'refDesg',
    'CPN',
    'CPNRev',
    'mfrCode',
    'mfrPN',
    'BOMIssue',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const genericFilesInputFields = [
    'gencFileName', 'gencOriginalName', 'gencFileDescription', 'gencFileExtension', 'gencFileType', 'isDefault',
    'refTransID', 'entityID', 'gencFileOwnerType', 'isActive', 'createdAt', 'createdBy', 'isShared', 'fileGroupBy',
    'refParentId', 'fileSize', 'refCopyTransID', 'refCopyGencFileOwnerType', 'createByRoleId', 'updateByRoleId',
    'deleteByRoleId', 'genFilePath'
];

module.exports = {
    // Get line items
    // POST : /api/v1/rfqlineitems/getRFQLineItems
    // @param Pagination model
    // @return API response
    // Checked for Re factor
    getRFQLineItems: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        /* Call common ui grid filter function */
        const filter = COMMON.UiGridFilterSearch(req);

        // create where clause
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        var order = null;
        if (filter.order[0]) {
            order = `${filter.order[0][0]} ${filter.order[0][1]}`;
        }
        sequelize.query('CALL Sproc_GetRFQLineItems (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pPartID,:pPackaging)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: order,
                pWhereClause: strWhere,
                pPartID: req.body.partID || null,
                pPackaging: req.body.isPackagingDisplay
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { rfqLineItems: _.values(response[1]), restrictedParts: _.values(response[2]), Count: response[0][0].TotalRecord }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get line items by refAssyBOMID
    // GET : /api/v1/rfqlineitems/getRFQLineItemsByID
    // @param {id} int
    // @return API response
    // Checked for Re factor
    getRFQLineItemsByID: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetRFQLineItemsByID (:ppartID)', {
            replacements: {
                ppartID: req.params.id || null
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Save line items
    // POST : /api/v1/rfqlineitems/saveRFQLineItems
    // @param Array of line items
    // @return API response
    // Checked for Re factor
    saveRFQLineItems: (req, res) => {
        const {
            Component,
            ComponentRequireFunctionalType,
            ComponentRequireMountingType,
            RFQMountingType,
            RFQPartType,
            ComponentStandardDetails,
            CertificateStandards,
            GenericCategory,
            RFQRoHS
        } = req.app.locals.models;
        // get Assy Detail
        Component.findOne({
            where: {
                id: req.body.partID
            },
            attributes: ['RoHSStatusID', 'functionalTypePartRequired', 'mountingTypePartRequired', 'mfgcodeID', 'rohsDeviation'],
            include: [{
                model: ComponentRequireFunctionalType,
                as: 'component_requirefunctionaltype',
                attributes: ['id', 'refComponentID', 'partTypeID'],
                include: [{
                    model: RFQPartType,
                    as: 'rfq_parttypemst',
                    attributes: ['id', 'partTypeName']
                }]
            }, {
                model: RFQRoHS,
                as: 'rfq_rohsmst',
                attributes: ['id', 'name', 'refMainCategoryID']
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
        }).then((componentResp) => {
            var partID = req.body.partID;
            var verifiedConfirm = req.body.verifiedConfirm;
            var passwordApproval = req.body.passwordApproval;
            var bomList = req.body.list;
            var assyMFGCodeID = componentResp.mfgcodeID;
            var createdBy = COMMON.getRequestUserID(req);
            var isRequireFunctionalType = componentResp.functionalTypePartRequired ? true : false;
            var isRequireMountingType = componentResp.mountingTypePartRequired ? true : false;
            var lineItems = [];
            var lineItemsAlternatePart = [];
            var mfgCodeArr = [];
            var mfgPNArr = [];
            var mfgPNIDArr = [];
            var distCodeArr = [];
            var distPNArr = [];

            var notUseMountingTypes = [];
            var notUseFunctionalTypes = [];
            if (isRequireMountingType) {
                _.each(componentResp.component_requiremountingtype, (item) => {
                    if (!_.some(bomList, x => x.mountingtypeID === item.partTypeID)) {
                        notUseMountingTypes.push(item.rfq_mountingtypemst.name);
                    }
                });
            }
            if (isRequireFunctionalType) {
                _.each(componentResp.component_requirefunctionaltype, (item) => {
                    if (!_.some(bomList, x => x.parttypeID === item.partTypeID)) {
                        notUseFunctionalTypes.push(item.rfq_parttypemst.partTypeName);
                    }
                });
            }

            let bomGroup = _.groupBy(bomList, 'lineID');
            Object.keys(bomGroup).forEach((prop) => {
                bomList = bomGroup[prop];
                bomList.forEach((item, index) => {
                    item.createdBy = createdBy;
                    item.updatedBy = item.createdBy;
                    item.createByRoleId = COMMON.getRequestUserLoginRoleID();
                    item.updateByRoleId = COMMON.getRequestUserLoginRoleID();
                    item.partID = partID;
                    item.RoHSStatusID = 1;

                    if (index === 0) {
                        lineItems.push(item);

                        const lineItemsAlternate = _.clone(item);
                        lineItemsAlternate.description = lineItemsAlternate.descriptionAlternate;

                        lineItemsAlternatePart.push(lineItemsAlternate);
                    } else {
                        item.numOfPosition = bomList[0].numOfPosition;
                        item.numOfRows = bomList[0].numOfRows;
                        item.description = item.descriptionAlternate;
                        lineItemsAlternatePart.push(item);
                    }

                    // Add MFG/DISTY details into Array for validation
                    mfgCodeArr.push(item.mfgCode);
                    mfgPNArr.push(item.mfgPN);
                    mfgPNIDArr.push(item.mfgPNID);

                    if (item.distributor) {
                        distCodeArr.push(item.distributor);
                    }

                    if (item.distPN) {
                        distPNArr.push(item.distPN);
                    }
                    if (item.custPN) {
                        mfgPNArr.push(COMMON.stringFormat('{0} Rev{1}', item.custPN, (item.customerRev != null ? (item.customerRev !== '' ? item.customerRev : '-') : '-')));
                    }
                });
            });

            // clean variables
            bomGroup = null;
            bomList = null;

            const promises = [
                module.exports.getMFGCodeIDByNameAlias(req, mfgCodeArr, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG),
                module.exports.getMFGPNIDByName(req, mfgPNArr, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG),
                module.exports.getMFGCodeIDByNameAlias(req, distCodeArr, DATA_CONSTANT.MFGCODE.MFGTYPE.DIST),
                module.exports.getMFGPNIDByName(req, distPNArr, DATA_CONSTANT.MFGCODE.MFGTYPE.DIST),
                module.exports.getUOMsList(req),
                module.exports.getUncleanSubAssemblyList(req, mfgPNIDArr),
                module.exports.getProgramMappingVarification(req, req.body.partID)
            ];

            return Promise.all(promises).then((resp) => {
                var mfgCodeIDResp = resp[0];
                var mfgPNIDResp = resp[1];
                var distMfgCodeIDResp = resp[2];
                var distMfgPNIDResp = resp[3];
                var umoList = resp[4];
                var subassemblyList = resp[5];
                var partProgramMappingList = resp[6];

                if (mfgCodeIDResp && mfgCodeIDResp.status === STATE.SUCCESS) {
                    mfgCodeIDResp = mfgCodeIDResp.data.map(x => x.dataValues);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: mfgCodeIDResp.error, data: null });
                }

                if (mfgPNIDResp && mfgPNIDResp.status === STATE.SUCCESS) {
                    mfgPNIDResp = mfgPNIDResp.data.map(x => x.dataValues);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: mfgPNIDResp.error, data: null });
                }

                if (distMfgCodeIDResp && distMfgCodeIDResp.status === STATE.SUCCESS) {
                    distMfgCodeIDResp = distMfgCodeIDResp.data.map(x => x.dataValues);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: distMfgCodeIDResp.error, data: null });
                }

                if (distMfgPNIDResp && distMfgPNIDResp.status === STATE.SUCCESS) {
                    distMfgPNIDResp = distMfgPNIDResp.data.map(x => x.dataValues);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: distMfgPNIDResp.error, data: null });
                }

                if (umoList && umoList.status === STATE.SUCCESS) {
                    umoList = umoList.data.map(x => x.dataValues);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: umoList.error, data: null });
                }

                if (subassemblyList && subassemblyList.data && subassemblyList.status === STATE.SUCCESS) {
                    subassemblyList = subassemblyList.data.map(x => x);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: subassemblyList.error, data: null });
                }

                if (partProgramMappingList && partProgramMappingList.status === STATE.SUCCESS) {
                    partProgramMappingList = partProgramMappingList.data.map(x => x.dataValues);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: partProgramMappingList.error, data: null });
                }
                // If any sub assembly not clean then return with error
                if (subassemblyList && subassemblyList.length > 0) {
                    const modelResult = {
                        status: 'Sub Assembly',
                        data: {
                            subassemblyList: subassemblyList
                        }
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, modelResult, null);
                }

                const invalidMFGList = [];
                const invalidDISTList = [];
                const invalidMFGPNList = [];
                const invalidDISTPNList = [];
                const invalidMappingList = [];
                const bomPinRequiredList = [];
                const invalidMFGForNumOfPosList = [];
                const mismatchMFGForNumOfPosList = [];
                const noneROHSComplientMFGList = [];
                const mountingTypeMismatchList = [];
                const restrictUsePermanentlyList = [];
                const restrictUseWithPermissionList = [];
                const restrictUsePermanentlyExcludePackagList = [];
                const restrictUseWithPermissionExcludePackagList = [];
                const restrictCPNUsePermanentlyList = [];
                const restrictCPNUseWithPermissionList = [];
                const mismatchNumberOfRowsList = [];
                const partPinIsLessthenBOMPinList = [];
                const tbdPartList = [];
                const functionalValidationMismatchList = [];
                const matingPartRequiredList = [];
                const pickupPadRequiredList = [];
                const functionalTestingRequiredList = [];
                const exportControlledMFGPNList = [];
                const uomMismatchList = [];
                const programingRequiredList = [];
                const programingStatusMismatchList = [];
                const invalidEpoxyPartsList = [];
                const driverToolsRequiredList = [];
                const CPNCustomPartRevMismatchList = [];
                const CustomPartRevMismatchList = [];
                const qpaRefDesErrorList = _.filter(req.body.list, item => item.qpaDesignatorStep === false);

                const customerPNItemList = _.filter(req.body.list, item => item.custPN != null);

                // Start Cutomer Part Number (CPN) Restrict Case
                _.each(customerPNItemList, (custPN) => {
                    var objCustPN = _.find(mfgPNIDResp, item => (item.name && item.name.toUpperCase() === COMMON.stringFormat('{0} Rev{1}', custPN.custPN, (custPN.customerRev !== null ? (custPN.customerRev !== '' ? custPN.customerRev : '-') : '-')).toUpperCase() && item.mfgcodeID === assyMFGCodeID));
                    if (objCustPN && objCustPN.restrictUSEwithpermission && custPN.customerApprovalCPN !== DATA_CONSTANT.CUSTOMER_APPROVAL.APPROVED) {
                        const data = {
                            lineID: custPN.lineID,
                            custPN: custPN.custPN,
                            customerRev: custPN.customerRev
                        };
                        if (!restrictCPNUseWithPermissionList.some(el => el.lineID === custPN.lineID)) {
                            restrictCPNUseWithPermissionList.push(data);
                        }
                    }
                    if (objCustPN && objCustPN.restrictUsePermanently) {
                        const data = {
                            lineID: custPN.lineID,
                            custPN: custPN.custPN,
                            customerRev: custPN.customerRev
                        };
                        if (!restrictCPNUsePermanentlyList.some(el => el.lineID === custPN.lineID)) {
                            restrictCPNUsePermanentlyList.push(data);
                        }
                    }
                });
                // End Customer Part Number (CPN) Restrict Case


                lineItemsAlternatePart.forEach((item) => {
                    var mfgPNIDObj = null;
                    var distMfgPNIDObj = null;
                    var mfgCodeIDObj = null;
                    var distMfgCodeIDObj = null;
                    if (item.mfgCode) {
                        mfgCodeIDObj = mfgCodeIDResp.find(x => x.name.toUpperCase() === item.mfgCode.toUpperCase() || (x.mfgName && x.mfgName.toUpperCase() === item.mfgCode.toUpperCase()));
                    }
                    if (item.distributor) {
                        distMfgCodeIDObj = distMfgCodeIDResp.find(x => x.name === item.distributor.toUpperCase() || (x.mfgName && x.mfgName.toUpperCase() === item.distributor.toUpperCase()));
                    }

                    if (mfgCodeIDObj) {
                        mfgPNIDObj = mfgPNIDResp.find(x => x.name.toUpperCase() === item.mfgPN.toUpperCase() && x.mfgcodeID === mfgCodeIDObj.id);
                    }

                    if (distMfgCodeIDObj) {
                        distMfgPNIDObj = distMfgPNIDResp.find(x => x.name.toUpperCase() === item.distPN.toUpperCase() && x.mfgcodeID === distMfgCodeIDObj.id);
                    }
                    item.mfgCodeID = mfgCodeIDObj === null ? null : mfgCodeIDObj.id;

                    if (mfgPNIDObj) {
                        item.mfgPNID = mfgPNIDObj.id;
                        item.feature = mfgPNIDObj.feature;
                        item.isEpoxyMount = mfgPNIDObj.isEpoxyMount;
                        item.processMaterialgroupID = mfgPNIDObj.processMaterialgroupID;
                        mfgPNIDObj.refMainCategoryID = mfgPNIDObj.rfq_rohsmst ? mfgPNIDObj.rfq_rohsmst.refMainCategoryID : DATA_CONSTANT.RoHSMainCategory.NotApplicable;
                        item.refMainCategoryID = mfgPNIDObj.refMainCategoryID;
                        item.mountingtypeID = mfgPNIDObj.mountingTypeID;
                        item.parttypeID = mfgPNIDObj.functionalCategoryID;
                        item.mfgPNrev = mfgPNIDObj.rev;
                        item.isCustom = mfgPNIDObj.isCustom;
                    } else {
                        item.mfgPNID = null;
                    }
                    item.mfgPNrev = mfgPNIDObj ? mfgPNIDObj.rev : null;
                    item.mfgPNID = mfgPNIDObj ? mfgPNIDObj.id : null;
                    item.distMfgCodeID = distMfgCodeIDObj ? distMfgCodeIDObj.id : null;
                    item.distMfgPNID = distMfgPNIDObj ? distMfgPNIDObj.id : null;
                    item.partUOMID = mfgPNIDObj ? mfgPNIDObj.uomID : null;
                    item.componetStandardDetail = mfgPNIDObj ? mfgPNIDObj.componetStandardDetail : null;


                    item.mfgCode = item.mfgCode.toUpperCase();
                    item.mfgPN = item.mfgPN.toUpperCase();
                    item.distributor = item.distributor ? item.distributor.toUpperCase() : null;
                    item.distPN = item.distPN ? item.distPN.toUpperCase() : null;
                    item.custPN = item.custPN ? item.custPN.toUpperCase() : null;

                    // Start Check MFG and MFGPN Map with DB.
                    if (item.mfgCodeID === null || item.mfgPNID === null) {
                        invalidMFGPNList.push({
                            lineID: item.lineID,
                            mfgCode: item.mfgCode,
                            mfgPN: item.mfgPN,
                            mfgCodeID: item.mfgCodeID,
                            mfgPNID: item.mfgPNID
                        });
                    }
                    // End Check MFG and MFGPN Map with DB.

                    // Start Check DISTY and DISTYPN Map with DB.
                    if ((item.distributor && !item.distMfgCodeID) || (item.distPN && !item.distMfgPNID)) {
                        invalidDISTPNList.push({
                            lineID: item.lineID,
                            distributor: item.distributor,
                            distPN: item.distPN,
                            distMfgCodeID: item.distMfgCodeID,
                            distMfgPNID: item.distMfgPNID
                        });
                    }
                    // End Check DISTY and DISTYPN Map with DB.

                    // Check MFG and MFG PN Related Validation
                    if (item.mfgCodeID === null || item.mfgPNID === null || mfgPNIDObj.mfgcodeID !== item.mfgCodeID) {
                        invalidMFGList.push({
                            lineID: item.lineID,
                            mfgCode: item.mfgCode,
                            mfgPN: item.mfgPN,
                            mfgCodeID: item.mfgCodeID,
                            mfgPNID: item.mfgPNID,
                            isGoodPart: mfgPNIDObj ? mfgPNIDObj.isGoodPart : null,
                            isVerify: (mfgPNIDObj && mfgPNIDObj.mfgcodeID !== item.mfgCodeID) ? false : true
                        });
                    }

                    // Check DISTY and DISTYPN Related Validation
                    if ((item.distributor && !item.distMfgCodeID) || (item.distPN && !item.distMfgPNID) ||
                        (distMfgPNIDObj && (distMfgPNIDObj.mfgcodeID !== item.distMfgCodeID))) {
                        invalidDISTList.push({
                            lineID: item.lineID,
                            distributor: item.distributor,
                            distPN: item.distPN,
                            distMfgCodeID: item.distMfgCodeID,
                            distMfgPNID: item.distMfgPNID,
                            isGoodPart: distMfgPNIDObj ? distMfgPNIDObj.isGoodPart : null,
                            isVerify: (distMfgPNIDObj && distMfgPNIDObj.mfgcodeID !== item.distMfgCodeID) ? false : true
                        });
                    }

                    // Check MFGPN and DISTYPN Mapping Validation
                    if (item.mfgPNID !== null && item.distMfgPNID !== null && mfgPNIDObj.aliasgroupID !== distMfgPNIDObj.aliasgroupID) {
                        invalidMappingList.push({
                            lineID: item.lineID,
                            mfgPN: item.mfgPN,
                            distPN: item.distPN
                        });
                    }

                    // Part connector type is header break away then required BOM pin.
                    if (item.mfgPNID !== null && (!item.distPN || item.distMfgPNID !== null) && mfgPNIDObj.connecterTypeID === DATA_CONSTANT.ConnectorType.HEADERBREAKAWAY.ID) {
                        if (item.numOfPosition === null || item.numOfPosition === '') {
                            item.partLead = mfgPNIDObj.noOfPosition;
                            if (!bomPinRequiredList.includes(item.lineID)) {
                                bomPinRequiredList.push(item.lineID);
                            }
                        }
                    }


                    if (item.mfgPNID !== null && (!item.distPN || item.distMfgPNID !== null) && mfgPNIDObj.connecterTypeID !== DATA_CONSTANT.ConnectorType.HEADERBREAKAWAY.ID) {
                        if (mfgPNIDObj.noOfPosition || (distMfgPNIDObj && distMfgPNIDObj.noOfPosition)) {
                            if (item.numOfPosition !== null && mfgPNIDObj.noOfPosition !== item.numOfPosition) {
                                item.partLead = mfgPNIDObj.noOfPosition;
                                if (!mismatchMFGForNumOfPosList.includes(item)) {
                                    mismatchMFGForNumOfPosList.push(item);
                                }
                            }
                        }
                    } else if ((mfgPNIDObj && mfgPNIDObj.noOfPosition) || (distMfgPNIDObj && distMfgPNIDObj.noOfPosition)) {
                        if (!item.numOfPosition) {
                            if (!invalidMFGForNumOfPosList.includes(item.lineID)) {
                                invalidMFGForNumOfPosList.push(item.lineID);
                            }
                        }
                    }


                    if (mfgPNIDObj && mfgPNIDObj.connecterTypeID === DATA_CONSTANT.ConnectorType.HEADERBREAKAWAY.ID && item.numOfPosition != null && mfgPNIDObj.noOfPosition < item.numOfPosition) {
                        item.partLead = mfgPNIDObj.noOfPosition;
                        if (!partPinIsLessthenBOMPinList.includes(item)) {
                            partPinIsLessthenBOMPinList.push(item);
                        }
                    }

                    if (mfgPNIDObj && mfgPNIDObj.id === DATA_CONSTANT.ConnectorType.HEADERBREAKAWAY.ID) {
                        if (!tbdPartList.includes(item)) {
                            tbdPartList.push(item);
                        }
                    }

                    if (mfgPNIDObj && mfgPNIDObj.connecterTypeID === DATA_CONSTANT.ConnectorType.HEADERBREAKAWAY.ID && (mfgPNIDObj.mountingTypeID === DATA_CONSTANT.RFQMountingType.ThruHole.ID || mfgPNIDObj.mountingTypeID === DATA_CONSTANT.RFQMountingType.SMT.ID)) {
                        if (mfgPNIDObj.mountingTypeID === DATA_CONSTANT.RFQMountingType.SMT.ID && (!item.numOfRows || mfgPNIDObj.noOfRows !== item.numOfRows)) {
                            mismatchNumberOfRowsList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                        if (mfgPNIDObj.mountingTypeID === DATA_CONSTANT.RFQMountingType.ThruHole.ID && item.numOfRows && mfgPNIDObj.noOfRows !== item.numOfRows) {
                            mismatchNumberOfRowsList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                    }

                    if (item.mfgPNID != null && item.customerApproval !== DATA_CONSTANT.CUSTOMER_APPROVAL.APPROVED && item.componetStandardDetail && item.componetStandardDetail.length > 0) {
                        const exportControlledCount = _.filter(item.componetStandardDetail, certificateStandard => certificateStandard.certificateStandard.isExportControlled);
                        if (exportControlledCount.length > 0) {
                            exportControlledMFGPNList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                    }
                    // Start Restrict Use With Permission
                    if (item.mfgPNID !== null && mfgPNIDObj && (mfgPNIDObj.restrictUSEwithpermission || mfgPNIDObj.restrictPackagingUseWithpermission) && item.customerApproval !== DATA_CONSTANT.CUSTOMER_APPROVAL.APPROVED) {
                        if (mfgPNIDObj.restrictUSEwithpermission) {
                            restrictUseWithPermissionList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        } else {
                            restrictUseWithPermissionExcludePackagList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                    }
                    // End Restrict Use With Permission

                    // Start Restrict Use
                    if (item.mfgPNID !== null && mfgPNIDObj && (mfgPNIDObj.restrictUsePermanently || mfgPNIDObj.restrictPackagingUsePermanently)) {
                        if (mfgPNIDObj.restrictUsePermanently) {
                            restrictUsePermanentlyList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        } else {
                            restrictUsePermanentlyExcludePackagList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                    }
                    // End Restrict Use

                    if (item.mfgPNID !== null && mfgPNIDObj) {
                        let lineUOM = item.uomID;
                        const partUOM = mfgPNIDObj.uom;
                        if (!lineUOM) {
                            const bomDet = _.find(lineItemsAlternatePart, {
                                // eslint-disable-next-line no-underscore-dangle
                                lineID: item._lineID
                            });
                            if (bomDet && bomDet.uomID) { lineUOM = bomDet.uomID; }
                        }
                        const lineUOMType = umoList.find(y => y.id === lineUOM).measurementType.name;
                        const partUOMype = umoList.find(y => y.id === partUOM).measurementType.name;
                        if (lineUOMType !== partUOMype) {
                            uomMismatchList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        } else {
                            item.description = item.description.replace(item.uomMismatchedError, '');
                            item.uomMismatchedStep = true;
                            item.uomMismatchedError = null;
                            item.isUpdate = true;
                        }
                    }

                    // Start Mating Part Required Validation
                    // eslint-disable-next-line no-underscore-dangle
                    const checkAlternateCount = _.filter(lineItemsAlternatePart, bomObj => item._lineID === bomObj._lineID);

                    if (item.mfgPNID != null && mfgPNIDObj && mfgPNIDObj.driverToolRequired) {
                        if (mfgPNIDObj.refDriveToolAlias && mfgPNIDObj.refDriveToolAlias.length > 0) {
                            let validDriverToolsPart = false;
                            _.each(mfgPNIDObj.refDriveToolAlias, (mfgPad) => {
                                if (mfgPad.componentID && _.some(lineItemsAlternatePart, {
                                    mfgPNID: mfgPad.componentID
                                })) {
                                    validDriverToolsPart = true;
                                }
                            });
                            if (!validDriverToolsPart) {
                                // Error Driver Tool part required
                                driverToolsRequiredList.push({
                                    lineID: item.lineID,
                                    mfgPN: item.mfgPN
                                });
                            }
                        } else {
                            // Error Driver Tool part required
                            driverToolsRequiredList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                    }

                    if (item.mfgPNID !== null && mfgPNIDObj && mfgPNIDObj.programingRequired) {
                        let lineProgramingStatus = item.programingStatus;
                        if (!lineProgramingStatus) {
                            const bomDet = _.find(lineItemsAlternatePart, {
                                lineID: item._lineID
                            });
                            if (bomDet && bomDet.uomID) { lineProgramingStatus = bomDet.programingStatus; }
                        }
                        if (lineProgramingStatus === 0 && item.customerApproval === DATA_CONSTANT.CUSTOMER_APPROVAL.PENDING) {
                            programingRequiredList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        } else if (mfgPNIDObj.componentAlterPN && mfgPNIDObj.componentAlterPN.length > 0) {
                            const programingAlternate = _.filter(mfgPNIDObj.componentAlterPN, itemComp => itemComp.type === 3);
                            if (programingAlternate && programingAlternate.length > 0) {
                                let validPrograming = false;
                                _.each(programingAlternate, (mfgPad) => {
                                    if (mfgPad.componentID && _.some(lineItemsAlternatePart, {
                                        mfgPNID: mfgPad.componentID
                                    })) {
                                        validPrograming = true;
                                    }
                                });
                                if (!validPrograming && item.customerApproval === DATA_CONSTANT.CUSTOMER_APPROVAL.PENDING) {
                                    // Error programing part required
                                    programingRequiredList.push({
                                        lineID: item.lineID,
                                        mfgPN: item.mfgPN
                                    });
                                }
                            } else if (item.customerApproval === DATA_CONSTANT.CUSTOMER_APPROVAL.PENDING) {
                                // Error programing part required
                                programingRequiredList.push({
                                    lineID: item.lineID,
                                    mfgPN: item.mfgPN
                                });
                            }
                        } else if (item.customerApproval === DATA_CONSTANT.CUSTOMER_APPROVAL.PENDING) {
                            // Error programing part required
                            programingRequiredList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                    } else if (item.mfgPNID !== null) {
                        let lineProgramingStatus = item.programingStatus;
                        if (lineProgramingStatus === null) {
                            const bomDet = _.find(lineItemsAlternatePart, {
                                // eslint-disable-next-line no-underscore-dangle
                                lineID: item._lineID
                            });
                            if (bomDet && bomDet.programingStatus !== null) {
                                lineProgramingStatus = bomDet.programingStatus;
                            }
                        }
                        if (lineProgramingStatus !== DATA_CONSTANT.ProgramingStatusDropdown[0].id) {
                            programingStatusMismatchList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        } else {
                            item.description = item.description.replace(item.mismatchProgrammingStatusError, '');
                            item.mismatchProgrammingStatusStep = true;
                            item.mismatchProgrammingStatusError = null;
                            item.isUpdate = true;
                        }
                    } else {
                        item.description = item.description.replace(item.mismatchProgrammingStatusError, '');
                        item.mismatchProgrammingStatusStep = true;
                        item.mismatchProgrammingStatusError = null;
                        item.isUpdate = true;
                    }

                    if (item.mfgPNID !== null && mfgPNIDObj && mfgPNIDObj.matingPartRquired) {
                        if (checkAlternateCount && checkAlternateCount.length > 0 && mfgPNIDObj.componentAlterPN && mfgPNIDObj.componentAlterPN.length > 0) {
                            const matingPartAlternate = _.filter(mfgPNIDObj.componentAlterPN, itemComp => itemComp.type === 5);
                            if (matingPartAlternate && matingPartAlternate.length > 0) {
                                let validMattingPart = false;
                                _.each(matingPartAlternate, (mfgPad) => {
                                    if (mfgPad.componentID && _.some(checkAlternateCount, {
                                        mfgPNID: mfgPad.componentID
                                    })) {
                                        validMattingPart = true;
                                    }
                                });
                                if (!validMattingPart) {
                                    // Error mating part
                                    matingPartRequiredList.push({
                                        lineID: item.lineID,
                                        mfgPN: item.mfgPN
                                    });
                                }
                            } else {
                                // Error mating part
                                matingPartRequiredList.push({
                                    lineID: item.lineID,
                                    mfgPN: item.mfgPN
                                });
                            }
                        } else {
                            // Mating Part required error
                            matingPartRequiredList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                    }

                    if (item.mfgPNID !== null && mfgPNIDObj && mfgPNIDObj.pickupPadRequired) {
                        if (checkAlternateCount && checkAlternateCount.length > 0 && mfgPNIDObj.componentAlterPN && mfgPNIDObj.componentAlterPN.length > 0) {
                            const pickupPadAlternate = _.filter(mfgPNIDObj.componentAlterPN, itemComp => itemComp.type === 2);
                            if (pickupPadAlternate && pickupPadAlternate.length > 0) {
                                let validPickupPad = false;
                                _.each(pickupPadAlternate, (mfgPad) => {
                                    if (mfgPad.componentID && _.some(checkAlternateCount, {
                                        mfgPNID: mfgPad.componentID
                                    })) {
                                        validPickupPad = true;
                                    }
                                });
                                if (!validPickupPad) {
                                    // Error pickup pade part required
                                    pickupPadRequiredList.push({
                                        lineID: item.lineID,
                                        mfgPN: item.mfgPN
                                    });
                                }
                            } else {
                                // Error pickup pade part required
                                pickupPadRequiredList.push({
                                    lineID: item.lineID,
                                    mfgPN: item.mfgPN
                                });
                            }
                        } else {
                            // Error pickup pade part required
                            pickupPadRequiredList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                    }

                    if (item.mfgPNID !== null && mfgPNIDObj && mfgPNIDObj.functionalTestingRequired) {
                        if (mfgPNIDObj.componentAlterPN && mfgPNIDObj.componentAlterPN.length > 0) {
                            const functionalTestingAlternate = _.filter(mfgPNIDObj.componentAlterPN, itemComp => itemComp.type === 4);
                            if (functionalTestingAlternate && functionalTestingAlternate.length > 0) {
                                let functionaTestingPart = false;
                                _.each(functionalTestingAlternate, (mfgPad) => {
                                    if (mfgPad.componentID && _.some(lineItemsAlternatePart, {
                                        mfgPNID: mfgPad.componentID
                                    })) {
                                        functionaTestingPart = true;
                                    }
                                });
                                if (!functionaTestingPart) {
                                    // Error functional testing part required
                                    functionalTestingRequiredList.push({
                                        lineID: item.lineID,
                                        mfgPN: item.mfgPN
                                    });
                                }
                            } else {
                                // Error functional testing part required
                                functionalTestingRequiredList.push({
                                    lineID: item.lineID,
                                    mfgPN: item.mfgPN
                                });
                            }
                        } else {
                            // Error functional testing part required
                            functionalTestingRequiredList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                    }
                    // End Mating Part Required Validation

                    if (item.isEpoxyMount) {
                        if (mfgPNIDObj.refProcessMaterial && mfgPNIDObj.refProcessMaterial.length > 0) {
                            let validEpoxy = false;
                            _.each(mfgPNIDObj.refProcessMaterial, (mfgPad) => {
                                if (mfgPad.componentID && _.some(lineItemsAlternatePart, {
                                    mfgPNID: mfgPad.componentID
                                })) {
                                    validEpoxy = true;
                                }
                            });
                            if (!validEpoxy) {
                                // Epoxy invalid part required
                                invalidEpoxyPartsList.push({
                                    lineID: item.lineID,
                                    mfgPN: item.mfgPN
                                });
                            } else {
                                item.description = item.description.replace(item.epoxyStepError, '');
                                item.epoxyStep = true;
                                item.epoxyStepError = null;
                                item.isUpdate = true;
                            }
                        } else {
                            // Epoxy invalid part required
                            invalidEpoxyPartsList.push({
                                lineID: item.lineID,
                                mfgPN: item.mfgPN
                            });
                        }
                    } else {
                        item.description = item.description.replace(item.epoxyStepError, '');
                        item.epoxyStep = true;
                        item.epoxyStepError = null;
                        item.isUpdate = true;
                    }
                });

                // Start functional category and Mounting Type mismatch in alternate part
                const groupbyIdist = _.values(_.groupBy(lineItemsAlternatePart, 'lineID'));
                groupbyIdist.forEach((item) => {
                    if (item.length > 1) {
                        const uniqueByPartTypeID = _.uniqBy(item, 'parttypeID');
                        if (uniqueByPartTypeID.length > 1) {
                            _.each(item, (data) => {
                                functionalValidationMismatchList.push({
                                    lineID: data.lineID,
                                    mfgPN: data.mfgPN
                                });
                            });
                        }
                        const uniqueByMountingtypeID = _.uniqBy(item, 'mountingtypeID');
                        if (uniqueByMountingtypeID.length > 1) {
                            _.each(item, (data) => {
                                mountingTypeMismatchList.push({
                                    lineID: data.lineID,
                                    mfgPN: data.mfgPN
                                });
                            });
                        }

                        if (uniqueByMountingtypeID.length === 1 && uniqueByPartTypeID.length === 1) {
                            _.each(item, (data) => {
                                data.approvedMountingType = false;
                                data.description = data.description.replace(data.mismatchFunctionalCategoryError, '');
                                data.mismatchFunctionalCategoryStep = true;
                                data.mismatchFunctionalCategoryError = null;
                                data.description = data.description.replace(data.mismatchMountingTypeError, '');
                                data.mismatchMountingTypeStep = true;
                                data.mismatchMountingTypeError = null;
                                data.isUpdate = true;
                            });
                        } else {
                            if (uniqueByPartTypeID.length === 1) {
                                _.each(item, (data) => {
                                    data.description = data.description.replace(data.mismatchFunctionalCategoryError, '');
                                    data.mismatchFunctionalCategoryStep = true;
                                    data.mismatchFunctionalCategoryError = null;
                                    data.isUpdate = true;
                                });
                            }
                            if (uniqueByPartTypeID.length === 1) {
                                _.each(item, (data) => {
                                    data.description = data.description.replace(data.mismatchMountingTypeError, '');
                                    data.mismatchMountingTypeStep = true;
                                    data.mismatchMountingTypeError = null;
                                    data.isUpdate = true;
                                });
                            }
                        }
                    }
                    const CPNLine = _.find(item, objItem => objItem.custPNID || (!objItem.custPNID && objItem.custPN));
                    if (CPNLine) {
                        const newItems = [];
                        _.each(item, (objLineAlternate) => {
                            if (objLineAlternate.custPNID !== objLineAlternate.mfgPNID) {
                                if (objLineAlternate.custPNID) {
                                    const AvlPartsObj = {
                                        mfgPN: objLineAlternate.mfgPN,
                                        mfgPNrev: objLineAlternate.mfgPNrev,
                                        lineID: CPNLine._lineID,
                                        custPN: CPNLine.custPN,
                                        customerRev: CPNLine.customerRev
                                    };
                                    newItems.push(AvlPartsObj);
                                    if (objLineAlternate.isCustom && objLineAlternate.mfgPNrev !== CPNLine.customerRev) {
                                        if (objLineAlternate.customerApproval !== DATA_CONSTANT.CUSTOMER_APPROVAL.APPROVED) {
                                            objLineAlternate.isMPNAddedinCPN = false;
                                            CPNCustomPartRevMismatchList.push({
                                                custPN: CPNLine.custPN,
                                                customerRev: CPNLine.customerRev,
                                                lineID: CPNLine._lineID,
                                                mfgPN: objLineAlternate.mfgPN
                                            });
                                        } else {
                                            objLineAlternate.isMPNAddedinCPN = false;
                                            objLineAlternate.mismatchCPNandCustpartRevStep = true;
                                            objLineAlternate.mismatchCPNandCustpartRevError = null;
                                            objLineAlternate.description = objLineAlternate.description.replace(objLineAlternate.mismatchCPNandCustpartRevError, '');
                                        }
                                    } else {
                                        objLineAlternate.mismatchCPNandCustpartRevStep = true;
                                        objLineAlternate.mismatchCPNandCustpartRevError = null;
                                        objLineAlternate.description = objLineAlternate.description.replace(objLineAlternate.mismatchCPNandCustpartRevError, '');
                                    }
                                } else if (!objLineAlternate.custPNID) {
                                    const AvlPartsObj = {
                                        mfgPN: objLineAlternate.mfgPN,
                                        mfgPNrev: objLineAlternate.mfgPNrev,
                                        lineID: CPNLine._lineID,
                                        custPN: CPNLine.custPN,
                                        customerRev: CPNLine.customerRev
                                    };
                                    newItems.push(AvlPartsObj);
                                    if (objLineAlternate.isCustom && objLineAlternate.mfgPNrev !== CPNLine.customerRev) {
                                        objLineAlternate.isMPNAddedinCPN = false;
                                        if (objLineAlternate.customerApproval !== DATA_CONSTANT.CUSTOMER_APPROVAL.APPROVED) {
                                            CPNCustomPartRevMismatchList.push({
                                                custPN: CPNLine.custPN,
                                                customerRev: CPNLine.customerRev,
                                                lineID: CPNLine._lineID,
                                                mfgPN: objLineAlternate.mfgPN
                                            });
                                        }
                                    }
                                }
                            }
                        });
                        const uniqueBymfgPNrev = _.uniqBy(newItems, 'mfgPNrev');
                        if (uniqueBymfgPNrev.length > 1) {
                            _.each(item, (objLineAlternate) => {
                                if (objLineAlternate.isCustom && objLineAlternate.mfgPNrev !== CPNLine.customerRev) {
                                    if (objLineAlternate.customerApproval !== DATA_CONSTANT.CUSTOMER_APPROVAL.APPROVED) {
                                        CPNCustomPartRevMismatchList.push({
                                            custPN: CPNLine.custPN,
                                            customerRev: CPNLine.customerRev,
                                            lineID: CPNLine._lineID,
                                            mfgPN: objLineAlternate.mfgPN
                                        });
                                        objLineAlternate.mismatchCPNandCustpartRevStep = false;
                                    }
                                    objLineAlternate.isMPNAddedinCPN = false;
                                } else if (objLineAlternate.customerApproval !== DATA_CONSTANT.CUSTOMER_APPROVAL.APPROVED) {
                                    objLineAlternate.isMPNAddedinCPN = false;
                                }
                            });
                        }
                    } else {
                        const uniqueBymfgPNrev = _.uniqBy(item, 'mfgPNrev');
                        if (uniqueBymfgPNrev.length > 1) {
                            _.each(item, (data) => {
                                if (data.customerApproval === DATA_CONSTANT.CUSTOMER_APPROVAL.APPROVED) {
                                    const obj = {
                                        lineID: data.lineID,
                                        mfgPN: data.mfgPN
                                    };
                                    CustomPartRevMismatchList.push(obj);
                                }
                            });
                        }
                        if (uniqueBymfgPNrev.length === 1) {
                            _.each(item, (data) => {
                                data.description = data.description.replace(data.mismatchCustpartRevError, '');
                                data.mismatchCustpartRevStep = true;
                                data.mismatchCustpartRevError = null;
                                data.isUpdate = true;
                            });
                        }
                    }
                });
                // End functional category and Mounting Type mismatch in alternate part

                // If any MFG/MFGPN or DISTY/DISTYPN not exist in DB or not map with DB then return with error
                if (invalidMFGList.length || invalidDISTList.length) {
                    const modelResult = {
                        status: 'Part',
                        data: {
                            invalidMFGPNList: invalidMFGPNList,
                            invalidDISTPNList: invalidDISTPNList
                        }
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, modelResult, null);
                }
                if (bomPinRequiredList && bomPinRequiredList.length > 0) {
                    const modelResult = {
                        status: 'BOMPinRequired',
                        data: {
                            bomPinRequiredList: bomPinRequiredList
                        }
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, modelResult, null);
                }


                if (!verifiedConfirm && (invalidMFGList.length || invalidDISTList.length || invalidMappingList.length ||
                    invalidMFGForNumOfPosList.length || mismatchMFGForNumOfPosList.length || noneROHSComplientMFGList.length ||
                    mountingTypeMismatchList.length || functionalValidationMismatchList.length || invalidEpoxyPartsList.length ||
                    qpaRefDesErrorList.length || restrictUsePermanentlyList.lenght || restrictUsePermanentlyExcludePackagList.length ||
                    restrictUseWithPermissionList.length || restrictUseWithPermissionExcludePackagList.length || matingPartRequiredList.length || pickupPadRequiredList.length ||
                    functionalTestingRequiredList.length || notUseMountingTypes.length || notUseFunctionalTypes.length ||
                    exportControlledMFGPNList.length || uomMismatchList.length || programingRequiredList.length || driverToolsRequiredList.length || mismatchNumberOfRowsList.length ||
                    partPinIsLessthenBOMPinList.length || tbdPartList.length || restrictCPNUsePermanentlyList.lenght ||
                    restrictCPNUseWithPermissionList.length || programingStatusMismatchList.length || CPNCustomPartRevMismatchList.length || CustomPartRevMismatchList.length)) {
                    const model = {
                        status: 'VerifyPending',
                        data: {
                            invalidMFGList: invalidMFGList,
                            invalidDISTList: invalidDISTList,
                            invalidMappingList: invalidMappingList,
                            invalidMFGForNumOfPosList: invalidMFGForNumOfPosList,
                            mismatchMFGForNumOfPosList: mismatchMFGForNumOfPosList,
                            noneROHSComplientMFGList: noneROHSComplientMFGList,
                            mountingTypeMismatchList: mountingTypeMismatchList,
                            functionalValidationMismatchList: functionalValidationMismatchList,
                            invalidEpoxyPartsList: invalidEpoxyPartsList,
                            qpaRefDesErrorList: qpaRefDesErrorList,
                            restrictUsePermanentlyList: restrictUsePermanentlyList,
                            restrictUsePermanentlyExcludePackagList: restrictUsePermanentlyExcludePackagList,
                            restrictUseWithPermissionList: restrictUseWithPermissionList,
                            restrictUseWithPermissionExcludePackagList: restrictUseWithPermissionExcludePackagList,
                            mismatchNumberOfRowsList: mismatchNumberOfRowsList,
                            partPinIsLessthenBOMPinList: partPinIsLessthenBOMPinList,
                            tbdPartList: tbdPartList,
                            matingPartRequiredList: matingPartRequiredList,
                            pickupPadRequiredList: pickupPadRequiredList,
                            functionalTestingRequiredList: functionalTestingRequiredList,
                            notUseMountingTypes: notUseMountingTypes,
                            notUseFunctionalTypes: notUseFunctionalTypes,
                            exportControlledMFGPNList: exportControlledMFGPNList,
                            uomMismatchList: uomMismatchList,
                            programingRequiredList: programingRequiredList,
                            driverToolsRequiredList: driverToolsRequiredList,
                            restrictCPNUsePermanentlyList: restrictCPNUsePermanentlyList,
                            restrictCPNUseWithPermissionList: restrictCPNUseWithPermissionList,
                            partProgramMappingList: partProgramMappingList,
                            programingStatusMismatchList: programingStatusMismatchList,
                            CPNCustomPartRevMismatchList: CPNCustomPartRevMismatchList,
                            CustomPartRevMismatchList: CustomPartRevMismatchList
                        }
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, model, null);
                } else if (!passwordApproval) {
                    const model = {
                        status: 'PasswordApproval'
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, model, null);
                } else {
                    return module.exports.manageLineItems(req, res, lineItems, lineItemsAlternatePart, true);
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
    },
    // Draft save line items
    // POST : /api/v1/rfqlineitems/draftRFQLineItems
    // @param Array of line items
    // @return API response
    // Checked for Re factor
    draftRFQLineItems: (req, res) => {
        const {
            RFQLineItems, sequelize
        } = req.app.locals.models;

        var partID = req.body.partID;
        let bomList = req.body.list;
        var userID = COMMON.getRequestUserID(req);

        var lineItems = [];
        var lineItemsAlternatePart = [];

        var bomGroup = _.groupBy(bomList, 'lineID');

        Object.keys(bomGroup).forEach((prop) => {
            bomList = bomGroup[prop];
            bomList.forEach((item, index) => {
                item.createdBy = userID;
                item.updatedBy = userID;
                item.createByRoleId = COMMON.getRequestUserLoginRoleID();
                item.updateByRoleId = COMMON.getRequestUserLoginRoleID();
                item.RoHSStatusID = 1;

                item.partID = partID;
                item.mfgCode = item.mfgCode ? item.mfgCode.toUpperCase() : null;
                item.mfgPN = item.mfgPN ? item.mfgPN.toUpperCase() : null;
                item.distributor = item.distributor ? item.distributor.toUpperCase() : null;
                item.distPN = item.distPN ? item.distPN.toUpperCase() : null;
                item.custPN = item.custPN ? item.custPN.toUpperCase() : null;

                if (index === 0) {
                    lineItems.push(item);

                    const lineItemsAlternate = _.clone(item);
                    lineItemsAlternate.description = lineItemsAlternate.descriptionAlternate;
                    lineItemsAlternatePart.push(lineItemsAlternate);
                } else {
                    item.numOfPosition = bomList[0].numOfPosition;
                    item.description = item.descriptionAlternate;
                    lineItemsAlternatePart.push(item);
                }
            });
        });
        // clean variables
        bomGroup = null;
        bomList = null;

        if (req.body.isSaveOriginal) {
            return RFQLineItems.findOne({
                attributes: ['id'],
                where: {
                    partID: partID
                }
            }).then((response) => {
                if (response && response.id) {
                    const lineIDPromises = [];

                    lineIDPromises.push(RFQLineItems.findAll({
                        where: {
                            [Op.or]: [{ lineID: { [Op.in]: _.map(lineItems, 'lineID') } }],
                            partID: partID
                        },
                        attributes: ['lineID']
                    }).then((responseRFQLine) => {
                        if (responseRFQLine.length) {
                            return {
                                status: STATE.FAILED,
                                data: responseRFQLine,
                                field: 'lineID'
                            };
                        } else {
                            return {
                                status: STATE.SUCCESS
                            };
                        }
                    }));
                    const where = {
                        partID: partID,
                        [Op.or]: []
                    };
                    _.each(lineItems, (objItem) => {
                        where[Op.or].push(sequelize.fn('FIND_IN_SET', objItem.lineID, sequelize.col('cust_lineID')));
                    });
                    lineIDPromises.push(RFQLineItems.findAll({
                        where: where,
                        attributes: ['cust_lineID']
                    }).then((responseRFQLine) => {
                        if (responseRFQLine.length) {
                            return {
                                status: STATE.FAILED,
                                data: responseRFQLine,
                                field: 'cust_lineID'
                            };
                        } else {
                            return {
                                status: STATE.SUCCESS
                            };
                        }
                    }));

                    return Promise.all(lineIDPromises).then((resp) => {
                        const failedLineIDResp = _.filter(resp, objRes => objRes.status === STATE.FAILED && objRes.field === 'lineID');
                        const failedCustLineIDResp = _.filter(resp, objRes => objRes.status === STATE.FAILED && objRes.field === 'cust_lineID');
                        if (failedLineIDResp.length) {
                            const model = {
                                status: 'lineID',
                                data: failedLineIDResp.map(x => x.data.map(obj => obj.dataValues.lineID))
                            };
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, model, null);
                        } else if (failedCustLineIDResp.length) {
                            const model = {
                                status: 'cust_lineID',
                                data: failedCustLineIDResp.map(x => x.data.map(obj => obj.dataValues.cust_lineID))
                            };
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, model, null);
                        } else {
                            return module.exports.updateLineItems(req, res, lineItems, lineItemsAlternatePart);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return module.exports.manageLineItems(req, res, lineItems, lineItemsAlternatePart);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else if (req.body.isDraftVerified) {
            const mfgCodeArr = [];
            const mfgPNArr = [];
            lineItemsAlternatePart.forEach((item) => {
                if (item.mfgCode) {
                    mfgCodeArr.push(item.mfgCode);
                }
                if (item.mfgPN) {
                    mfgPNArr.push(item.mfgPN);
                }
            });

            const promises = [
                module.exports.getMFGCodeIDByNameAlias(req, mfgCodeArr, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG),
                module.exports.getMFGPNIDByName(req, mfgPNArr, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG)
            ];

            return Promise.all(promises).then((resp) => {
                var mfgCodeIDResp = resp[0];
                var mfgPNIDResp = resp[1];

                if (mfgCodeIDResp && mfgCodeIDResp.status === STATE.SUCCESS) {
                    mfgCodeIDResp = mfgCodeIDResp.data.map(x => x.dataValues);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: mfgCodeIDResp.error, data: null });
                }

                if (mfgPNIDResp && mfgPNIDResp.status === STATE.SUCCESS) {
                    mfgPNIDResp = mfgPNIDResp.data.map(x => x.dataValues);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: mfgPNIDResp.error, data: null });
                }

                const invalidMFGList = [];
                const invalidMFGForNumOfPosList = [];
                lineItemsAlternatePart.forEach((item) => {
                    var mfgPNIDObj = null;
                    var mfgCodeIDObj = mfgCodeIDResp.find(x => x.name === item.mfgCode || x.mfgName === item.mfgCode);

                    if (mfgCodeIDObj) { mfgPNIDObj = mfgPNIDResp.find(x => x.name.toUpperCase() === item.mfgPN.toUpperCase() && x.mfgcodeID === mfgCodeIDObj.id); }

                    item.mfgCodeID = mfgCodeIDObj == null ? null : mfgCodeIDObj.id;
                    item.mfgPNID = mfgPNIDObj == null ? null : mfgPNIDObj.id;

                    if (item.mfgCodeID === null || item.mfgPNID === null || mfgPNIDObj.mfgcodeID !== item.mfgCodeID) {
                        invalidMFGList.push({
                            lineID: item.lineID,
                            mfgCode: item.mfgCode,
                            mfgPN: item.mfgPN,
                            mfgCodeID: item.mfgCodeID,
                            mfgPNID: item.mfgPNID,
                            isGoodPart: mfgPNIDObj ? mfgPNIDObj.isGoodPart : null,
                            isVerify: (mfgPNIDObj && mfgPNIDObj.mfgcodeID !== item.mfgCodeID) ? false : true
                        });
                    }

                    if (item.mfgPNID !== null && mfgPNIDObj.noOfPosition && !item.numOfPosition) {
                        invalidMFGForNumOfPosList.push(item.lineID);
                    }
                });

                if (invalidMFGList.length) {
                    const modelResult = {
                        status: 'Part',
                        data: {
                            invalidMFGList: invalidMFGList
                        }
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, modelResult, null);
                } else if (invalidMFGForNumOfPosList.length) {
                    const modelResult = {
                        status: 'NumOfPosition',
                        data: invalidMFGForNumOfPosList
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, modelResult, null);
                } else {
                    return module.exports.manageLineItems(req, res, lineItems, lineItemsAlternatePart, true);
                }
            });
        } else {
            return module.exports.manageLineItems(req, res, lineItems, lineItemsAlternatePart);
        }
    },
    // Save line items
    // @param {req} request
    // @param {res} response
    // @parm {rfqAssyBomID} rfqAssyBomID
    // @param {lineItems} new/edited line items array
    // @param {lineItemsAlternatePart} new/edited alternate part line items array
    // @param {isVerify} Is BOM is verified then true
    // @return API response
    // Checked for Re factor
    manageLineItems: (req, res, lineItems, lineItemsAlternatePart, isVerify) => {
        const {
            ComponentBOMSetting,
            RFQAssemblies,
            RFQLineItems,
            RFQLineitemsAlternatepart,
            RFQLineitemsApprovalComment,
            RFQLineItemsProgrammingMapping,
            sequelize
        } = req.app.locals.models;

        var partID = req.body.partID;
        var bomDelete = req.body.bomDelete ? req.body.bomDelete : [];
        var rowDeleted = req.body.rowDeleted ? req.body.rowDeleted : [];
        var bomListPart = _.partition(lineItems, item => !item.id);
        var newBOMList = bomListPart[0];
        var modifiedBOMList = bomListPart[1];

        var bomListAlternate = _.partition(lineItemsAlternatePart, item => !item.rfqAlternatePartID);
        var newBOMListAlternate = bomListAlternate[0];
        var modifiedBOMListAlternate = bomListAlternate[1];

        var rfqAssyBomID = req.body.rfqAssyBomID;
        var userID = COMMON.getRequestUserID(req);
        var currDate = COMMON.getCurrentUTC();

        /* isDraftVerified: When 'Verify & Save' button is click but there are still some information pending to
            verify and still we allow to save then this flag is true */
        var isDraftVerified = req.body.isDraftVerified;

        return sequelize.transaction().then((t) => {
            // Update internal version based on PartId
            var promise = (newBOMList.length > 0 || newBOMListAlternate.length > 0 || bomDelete.length > 0 || rowDeleted.length > 0 ||
                _.some(modifiedBOMList, ['isUpdate', true]) || _.some(modifiedBOMListAlternate, ['isUpdate', true])) ? [module.exports.updateRFQAssyInternalVersion(req, partID, userID, isVerify)] : [];

            return Promise.all(promise).then(() => {
                let promises = [];
                var promiseInsert = null;
                var newCustomerApprovalComment = [];
                // Update lineitems which have id
                modifiedBOMList.forEach((item) => {
                    if (item.isQPACustomerApprove) {
                        newCustomerApprovalComment.push({
                            rfqLineItemsID: item.id,
                            comment: item.qpaCustomerApprovalComment,
                            requiredToShowOnQuoteSummary: item.requiredToShowQPAOnQuoteSummary || false,
                            isCustomerApproved: item.isCustomerApprovedQPA || false,
                            approvalBy: req.user.employeeID,
                            createdBy: userID,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(),
                            errorCode: 2,
                            approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                        });
                    }
                    if (item.isDNPQPACustomerApprove) {
                        newCustomerApprovalComment.push({
                            rfqLineItemsID: item.id,
                            comment: item.dnpqpaCustomerApprovalComment,
                            requiredToShowOnQuoteSummary: item.requiredToShowDNPQPAOnQuoteSummary || false,
                            isCustomerApproved: item.isCustomerApprovedDNPQPA || false,
                            approvalBy: req.user.employeeID,
                            createdBy: userID,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(),
                            errorCode: 18,
                            approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                        });
                    }
                    if (item.isBuyCustomerApprove) {
                        newCustomerApprovalComment.push({
                            rfqLineItemsID: item.id,
                            comment: item.buyCustomerApprovalComment,
                            requiredToShowOnQuoteSummary: item.requiredToShowBuyOnQuoteSummary || false,
                            isCustomerApproved: item.isCustomerApprovedBuy || false,
                            approvalBy: req.user.employeeID,
                            createdBy: userID,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(),
                            errorCode: 3,
                            approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                        });
                    }
                    if (item.isBuyDNPCustomerApprove) {
                        newCustomerApprovalComment.push({
                            rfqLineItemsID: item.id,
                            comment: item.buyDNPCustomerApprovalComment,
                            requiredToShowOnQuoteSummary: item.requiredToShowBuyOnQuoteSummary || false,
                            isCustomerApproved: item.isCustomerApprovedBuyDNP || false,
                            approvalBy: req.user.employeeID,
                            createdBy: userID,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(),
                            errorCode: 17,
                            approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                        });
                    }
                    if (item.isPopulateCustomerApprove) {
                        newCustomerApprovalComment.push({
                            rfqLineItemsID: item.id,
                            comment: item.populateCustomerApprovalComment,
                            requiredToShowOnQuoteSummary: item.requiredToShowPopulateOnQuoteSummary || false,
                            isCustomerApproved: item.isCustomerApprovedPopulate || false,
                            approvalBy: req.user.employeeID,
                            createdBy: userID,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(),
                            errorCode: 4,
                            approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                        });
                    }

                    if (item.isCPNCustomerApprove) {
                        newCustomerApprovalComment.push({
                            rfqLineItemsID: item.id,
                            comment: item.cpnCustomerApprovalComment,
                            requiredToShowOnQuoteSummary: item.requiredToShowCPNOnQuoteSummary || false,
                            isCustomerApproved: item.isCustomerApprovedCPN || false,
                            approvalBy: req.user.employeeID,
                            createdBy: userID,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(),
                            errorCode: 5,
                            approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                        });
                    }

                    if (item.isKitAllocationNotRequiredApprove) {
                        newCustomerApprovalComment.push({
                            rfqLineItemsID: item.id,
                            comment: item.kitAllocationNotRequiredComment,
                            requiredToShowOnQuoteSummary: item.requiredToShowKitOnQuoteSummary || false,
                            isCustomerApproved: item.isNotRequiredKitAllocationApproved || false,
                            approvalBy: req.user.employeeID,
                            createdBy: userID,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(),
                            errorCode: 19,
                            approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                        });
                    }

                    if (item.isRestrictCPNUseInBOMStep !== null && item.isRestrictCPNUseInBOMStep !== undefined) {
                        newCustomerApprovalComment.push({
                            rfqLineItemsID: item.id,
                            comment: item.cpnCustomerApprovalComment,
                            requiredToShowOnQuoteSummary: item.requiredToShowCPNOnQuoteSummary || false,
                            isCustomerApproved: item.isCustomerApprovedCPN || false,
                            approvalBy: req.user.employeeID,
                            createdBy: userID,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(),
                            errorCode: item.isRestrictCPNUseInBOMStep ? 6 : 7,
                            approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                        });
                    }
                });

                const isSaveOriginal = req.body.isSaveOriginal;
                // Add new line items
                if (newBOMList.length) {
                    /* isSaveOriginal: When first time BOM is uploaded then we have to store original values, that time
                        this flag will be true */
                    if (isSaveOriginal) {
                        newBOMList.forEach((item) => {
                            item.org_lineID = item.lineID;
                            item.cust_lineID = item.lineID;
                            item.org_qpa = item.qpa;
                            item.org_refDesig = item.refDesig;
                            item.org_custPN = item.custPN;
                            item.org_uomName = item.org_uomName;
                            item.org_level = item.level;
                            item.org_isInstall = item.isInstall;
                            item.org_isPurchase = item.isPurchase;
                            item.org_customerRev = item.customerRev;
                            item.org_customerDescription = item.customerDescription;
                            item.org_customerPartDesc = item.customerPartDesc;
                            item.org_numOfPosition = item.numOfPosition;
                            item.org_numOfRows = item.numOfRows;
                            item.org_refLineID = item.refRFQLineItemID;
                            item.org_substitutesAllow = item.org_substitutesAllow;
                            item.org_dnpQty = item.dnpQty;
                            item.org_dnpDesig = item.dnpDesig;
                        });
                    }

                    promiseInsert = RFQLineItems.bulkCreate(newBOMList, {
                        fields: isSaveOriginal ? createFields.concat(createOrgFields) : createFields,
                        transaction: t,
                        individualHooks: true
                    });

                    promises.push(promiseInsert);
                }

                return Promise.all(promises).then((resp) => {
                    var newLineItems = [];
                    // Add PK id of all new added line items into array to update same into alternate parts
                    if (newBOMList.length) {
                        const index = promises.indexOf(promiseInsert);
                        // resp[index].forEach((x) => {
                        //     newLineItems.push({
                        //         id: x.id,
                        //         lineID: x.lineID
                        //     });
                        // });

                        newLineItems = _.map(resp[index], item => ({
                            id: item.id,
                            lineID: item.lineID
                        }));


                        newBOMList.forEach((newLines) => {
                            if (newLines.isKitAllocationNotRequiredApprove) {
                                const objNewlineItem = _.find(newLineItems, x => x.lineID === newLines.lineID);
                                newCustomerApprovalComment.push({
                                    rfqLineItemsID: objNewlineItem.id,
                                    comment: newLines.kitAllocationNotRequiredComment,
                                    requiredToShowOnQuoteSummary: newLines.requiredToShowKitOnQuoteSummary || false,
                                    isCustomerApproved: newLines.isNotRequiredKitAllocationApproved || false,
                                    approvalBy: req.user.employeeID,
                                    createdBy: userID,
                                    createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                    errorCode: 19,
                                    approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                                });
                            }
                        });
                    }

                    // Push all modified line items id into same list
                    modifiedBOMList.forEach((x) => {
                        newLineItems.push({
                            id: x.id,
                            lineID: x.lineID
                        });
                    });

                    if (lineItemsAlternatePart.length) {
                        lineItemsAlternatePart.forEach((item) => {
                            var lineItem = _.find(newLineItems, x => x.lineID === item.lineID);
                            item.rfqLineItemsID = lineItem.id;
                            item.partID = partID;

                            if (item.isCustomerApprove) {
                                item.customerApprovalBy = req.user.employeeID;
                                item.customerApprovalDate = currDate;
                            }
                            if (item.isCustomerUnAppoved) {
                                item.customerUnAppovalBy = req.user.employeeID;
                                item.customerUnAppovalDate = currDate;
                            }
                            item.suggestedGoodPartStep = item.suggestedGoodPartStep || true;
                            item.suggestedGoodDistPartStep = item.suggestedGoodDistPartStep || true;
                            item.mfgGoodPartMappingStep = item.mfgGoodPartMappingStep || true;
                            item.distGoodPartMappingStep = item.distGoodPartMappingStep || true;
                        });


                        /* isSaveOriginal: When first time BOM is uploaded then we have to store original values, that time
                      this flag will be true */
                        if (isSaveOriginal) {
                            newBOMListAlternate.forEach((item) => {
                                item.org_distributor = item.distributor;
                                item.org_distPN = item.distPN;
                                item.org_mfgCode = item.mfgCode;
                                item.org_mfgPN = item.mfgPN;
                                item.suggestedGoodPartStep = item.suggestedGoodPartStep || true;
                                item.suggestedGoodDistPartStep = item.suggestedGoodDistPartStep || true;
                                item.mfgGoodPartMappingStep = item.mfgGoodPartMappingStep || true;
                                item.distGoodPartMappingStep = item.distGoodPartMappingStep || true;
                            });
                        }
                    }

                    promises = [];
                    if (newCustomerApprovalComment.length) {
                        promises.push(RFQLineitemsApprovalComment.bulkCreate(newCustomerApprovalComment, {
                            fields: createRFQLineitemsApprovalCommentFields,
                            transaction: t
                        }));
                    }
                    modifiedBOMList.forEach((item) => {
                        if (item.isUpdate) {
                            promises.push(RFQLineItems.update(item, {
                                where: {
                                    id: item.id
                                },
                                fields: updateFields,
                                transaction: t
                            }));
                        }
                    });
                    /* isDraftUpdate: when any filter is applied into handsontable and user click on draft save
                        button then we need to update records. Do not delete any as sent data is filtered.
                    */
                    if (!req.body.isDraftUpdate) {
                        const modifiedIds = newLineItems.map(x => x.id);
                        if (modifiedIds.length) {
                            // Alternate part item entry merged
                            let newmodifiedIds = [];
                            if (modifiedBOMListAlternate.length > 0) {
                                _.forEach(newLineItems, (lineItem) => {
                                    _.forEach(modifiedBOMListAlternate, (lineItemAlternatePart) => {
                                        if (lineItemAlternatePart.lineID === lineItem.lineID) {
                                            newmodifiedIds.push(lineItemAlternatePart.id);
                                        }
                                    });
                                });
                            } else {
                                newmodifiedIds = modifiedIds;
                            }
                        }
                    }

                    // Delete alternate part line using this array which is pass in api
                    if (bomDelete.length > 0) {
                        promises.push(RFQLineitemsAlternatepart.update({
                            isDeleted: true,
                            deletedBy: userID,
                            deletedAt: currDate,
                            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        }, {
                                where: {
                                    id: {
                                        [Op.in]: bomDelete
                                    },
                                    partID: partID,
                                    isDeleted: false
                                },
                                fields: ['isDeleted', 'deletedBy', 'deletedAt', 'deleteByRoleId'],
                                transaction: t
                            }));
                    }
                    // Delete BOM line using this array which is pass in api
                    if (rowDeleted.length > 0) {
                        promises.push(RFQLineItems.update({
                            isDeleted: true,
                            deletedBy: userID,
                            deletedAt: currDate,
                            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        }, {
                                where: {
                                    id: {
                                        [Op.in]: rowDeleted
                                    },
                                    partID: partID,
                                    isDeleted: false
                                },
                                fields: ['isDeleted', 'deletedBy', 'deletedAt', 'deleteByRoleId'],
                                transaction: t
                            }));
                    }

                    return Promise.all(promises).then(() => {
                        promises = [];
                        let newBOMListAlternatePromise = null;
                        const isAnyCustomerApproved = _.some(newBOMListAlternate, item => item.isCustomerApprove === true);

                        newBOMListAlternatePromise = RFQLineitemsAlternatepart.bulkCreate(newBOMListAlternate, {
                            fields: isSaveOriginal ? createFieldsAlternate.concat(createAlternateOrgFields) : createFieldsAlternate,
                            transaction: t,
                            // if any customer approved line then and only set hook to true
                            // otherwise we do not require this flag to be true
                            // by fetching all data after create we are inserting customer approved comment into seprate table
                            individualHooks: isAnyCustomerApproved
                        });
                        promises.push(newBOMListAlternatePromise);

                        newCustomerApprovalComment = [];
                        // Modify alternate line items
                        modifiedBOMListAlternate.forEach((item) => {
                            if (item.isUpdate) {
                                promises.push(RFQLineitemsAlternatepart.update(item, {
                                    where: {
                                        id: item.rfqAlternatePartID
                                    },
                                    fields: updateFieldsAlternate,
                                    transaction: t
                                }));
                            }

                            if ((item.isCustomerApprove || item.isCustomerUnAppoved) && item.partCustomerApprovalComment) {
                                newCustomerApprovalComment.push({
                                    rfqLineItemsAlternatePartID: item.rfqAlternatePartID,
                                    comment: item.partCustomerApprovalComment,
                                    requiredToShowOnQuoteSummary: item.requiredToShowOnQuoteSummary || false,
                                    isCustomerApproved: item.isCustomerApprovedPart || false,
                                    approvalBy: req.user.employeeID,
                                    mfgCode: item.mfgCode,
                                    mfgPN: item.mfgPN,
                                    createdBy: userID,
                                    createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                    errorCode: item.isCustomerUnAppoved ? 10 : 1,
                                    approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.UPDATE
                                });
                            }

                            if (item.isRestrictUseInBOMStep !== null && item.isRestrictUseInBOMStep !== undefined) {
                                newCustomerApprovalComment.push({
                                    rfqLineItemsAlternatePartID: item.rfqAlternatePartID,
                                    comment: item.partCustomerApprovalComment,
                                    requiredToShowOnQuoteSummary: item.requiredToShowOnQuoteSummary || false,
                                    isCustomerApproved: item.isCustomerApprovedPart || false,
                                    approvalBy: req.user.employeeID,
                                    mfgCode: item.mfgCode,
                                    mfgPN: item.mfgPN,
                                    createdBy: userID,
                                    createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                    errorCode: item.isRestrictUseInBOMStep ? 8 : 9,
                                    approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.UPDATE
                                });
                            }

                            if (item.isRestrictUseInBOMWithPermissionStep !== null && item.isRestrictUseInBOMWithPermissionStep !== undefined) {
                                newCustomerApprovalComment.push({
                                    rfqLineItemsAlternatePartID: item.rfqAlternatePartID,
                                    comment: item.partCustomerApprovalComment,
                                    requiredToShowOnQuoteSummary: item.requiredToShowOnQuoteSummary || false,
                                    isCustomerApproved: item.isCustomerApprovedPart || false,
                                    approvalBy: req.user.employeeID,
                                    mfgCode: item.mfgCode,
                                    mfgPN: item.mfgPN,
                                    createdBy: userID,
                                    createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                    errorCode: item.isRestrictUseInBOMWithPermissionStep ? 11 : 12,
                                    approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.UPDATE
                                });
                            }

                            if (item.isRestrictUseInBOMExcludingAliasStep !== null && item.isRestrictUseInBOMExcludingAliasStep !== undefined) {
                                newCustomerApprovalComment.push({
                                    rfqLineItemsAlternatePartID: item.rfqAlternatePartID,
                                    comment: item.partCustomerApprovalComment,
                                    requiredToShowOnQuoteSummary: item.requiredToShowOnQuoteSummary || false,
                                    isCustomerApproved: item.isCustomerApprovedPart || false,
                                    approvalBy: req.user.employeeID,
                                    mfgCode: item.mfgCode,
                                    mfgPN: item.mfgPN,
                                    createdBy: userID,
                                    createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                    errorCode: item.isRestrictUseInBOMExcludingAliasStep ? 13 : 14,
                                    approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.UPDATE
                                });
                            }

                            if (item.isRestrictUseInBOMExcludingAliasWithPermissionStep !== null && item.isRestrictUseInBOMExcludingAliasWithPermissionStep !== undefined) {
                                newCustomerApprovalComment.push({
                                    rfqLineItemsAlternatePartID: item.rfqAlternatePartID,
                                    comment: item.partCustomerApprovalComment,
                                    requiredToShowOnQuoteSummary: item.requiredToShowOnQuoteSummary || false,
                                    isCustomerApproved: item.isCustomerApprovedPart || false,
                                    approvalBy: req.user.employeeID,
                                    mfgCode: item.mfgCode,
                                    mfgPN: item.mfgPN,
                                    createdBy: userID,
                                    createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                    errorCode: item.isRestrictUseInBOMWithPermissionStep ? 15 : 16,
                                    approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.UPDATE
                                });
                            }
                            if ((item.isCustomerApprove || item.isCustomerUnAppoved) && item.ApprovedMountingTypeComment) {
                                newCustomerApprovalComment.push({
                                    rfqLineItemsAlternatePartID: item.rfqAlternatePartID,
                                    comment: item.ApprovedMountingTypeComment,
                                    requiredToShowOnQuoteSummary: item.requiredToShowOnQuoteSummary || false,
                                    isCustomerApproved: item.isApproveMountingType || false,
                                    approvalBy: req.user.employeeID,
                                    createdBy: userID,
                                    createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                    errorCode: 20,
                                    approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                                });
                            }
                        });

                        if (newCustomerApprovalComment.length) {
                            promises.push(RFQLineitemsApprovalComment.bulkCreate(newCustomerApprovalComment, {
                                fields: createRFQLineitemsApprovalCommentFields,
                                transaction: t
                            }));
                        }

                        // isBOMVerified set to true if it is full verify (isVerify) OR isDraftVerified (isDraftVerified)
                        const obj = {
                            isBOMVerified: isVerify || isDraftVerified || false,
                            updatedBy: COMMON.getRequestUserID(req),
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        };
                        const rfqAssyFields = ['isBOMVerified', 'updatedBy', 'updatedAt', 'updateByRoleId'];

                        const partFields = ['isBOMVerified', 'updatedBy', 'updatedAt', 'updateByRoleId'];

                        if (!obj.isBOMVerified) {
                            obj.isReadyForPricing = false;
                            rfqAssyFields.push('isReadyForPricing');
                        }
                        if (isVerify) {
                            promises.push(RFQAssemblies.update(obj, {
                                where: {
                                    partID: partID
                                },
                                fields: rfqAssyFields,
                                transaction: t
                            }));
                        }


                        return Promise.all(promises).then((responses) => {
                            newCustomerApprovalComment = [];
                            if (promise.length > 0 && req.body) {
                                RFQSocketController.sendBOMInternalVersionChanged(req, {
                                    notifyFrom: 'BOM',
                                    data: req.body
                                });
                            }
                            if (isAnyCustomerApproved && newBOMListAlternatePromise) {
                                const index = promises.indexOf(newBOMListAlternatePromise);
                                if (responses[index] && responses[index].length > 0) {
                                    responses[index].forEach((item, indexResp) => {
                                        var alternatePart = newBOMListAlternate[indexResp];
                                        if ((alternatePart.isCustomerApprove || alternatePart.isCustomerUnAppoved) && alternatePart.partCustomerApprovalComment) {
                                            newCustomerApprovalComment.push({
                                                rfqLineItemsAlternatePartID: item.id,
                                                comment: alternatePart.partCustomerApprovalComment,
                                                isCustomerApproved: alternatePart.isCustomerApprovedPart,
                                                approvalBy: req.user.employeeID,
                                                mfgCode: item.mfgCode,
                                                mfgPN: item.mfgPN,
                                                createdBy: userID,
                                                createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                                errorCode: alternatePart.isCustomerUnAppoved ? 10 : 1,
                                                approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                                            });
                                        }
                                        if (alternatePart.isRestrictUseInBOMStep !== null && alternatePart.isRestrictUseInBOMStep !== undefined) {
                                            newCustomerApprovalComment.push({
                                                rfqLineItemsAlternatePartID: item.id,
                                                comment: alternatePart.partCustomerApprovalComment,
                                                isCustomerApproved: alternatePart.isCustomerApprovedPart,
                                                approvalBy: req.user.employeeID,
                                                mfgCode: item.mfgCode,
                                                mfgPN: item.mfgPN,
                                                createdBy: userID,
                                                createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                                errorCode: alternatePart.isRestrictUseInBOMStep ? 8 : 9,
                                                approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                                            });
                                        }
                                        if (alternatePart.isRestrictUseInBOMWithPermissionStep !== null && alternatePart.isRestrictUseInBOMWithPermissionStep !== undefined) {
                                            newCustomerApprovalComment.push({
                                                rfqLineItemsAlternatePartID: item.id,
                                                comment: alternatePart.partCustomerApprovalComment,
                                                isCustomerApproved: alternatePart.isCustomerApprovedPart,
                                                approvalBy: req.user.employeeID,
                                                mfgCode: item.mfgCode,
                                                mfgPN: item.mfgPN,
                                                createdBy: userID,
                                                createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                                errorCode: alternatePart.isRestrictUseInBOMWithPermissionStep ? 11 : 12,
                                                approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                                            });
                                        }
                                        if (alternatePart.isRestrictUseInBOMExcludingAliasStep !== null && alternatePart.isRestrictUseInBOMExcludingAliasStep !== undefined) {
                                            newCustomerApprovalComment.push({
                                                rfqLineItemsAlternatePartID: item.id,
                                                comment: alternatePart.partCustomerApprovalComment,
                                                isCustomerApproved: alternatePart.isCustomerApprovedPart,
                                                approvalBy: req.user.employeeID,
                                                mfgCode: item.mfgCode,
                                                mfgPN: item.mfgPN,
                                                createdBy: userID,
                                                createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                                errorCode: alternatePart.isRestrictUseInBOMExcludingAliasStep ? 13 : 14,
                                                approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                                            });
                                        }
                                        if (alternatePart.isRestrictUseInBOMExcludingAliasWithPermissionStep !== null && alternatePart.isRestrictUseInBOMExcludingAliasWithPermissionStep !== undefined) {
                                            newCustomerApprovalComment.push({
                                                rfqLineItemsAlternatePartID: item.id,
                                                comment: alternatePart.partCustomerApprovalComment,
                                                isCustomerApproved: alternatePart.isCustomerApprovedPart,
                                                approvalBy: req.user.employeeID,
                                                mfgCode: item.mfgCode,
                                                mfgPN: item.mfgPN,
                                                createdBy: userID,
                                                createByRoleId: COMMON.getRequestUserLoginRoleID(),
                                                errorCode: alternatePart.isRestrictUseInBOMExcludingAliasWithPermissionStep ? 15 : 16,
                                                approvalType: DATA_CONSTANT.RFQ_LINEITEMS_APPROVAL_COMMENT.APPROVAL_TYPE.ADD
                                            });
                                        }
                                    });
                                }
                            }

                            const promiseCustomerApprovalPromise = [];
                            if (newCustomerApprovalComment.length > 0) {
                                promiseCustomerApprovalPromise.push(RFQLineitemsApprovalComment.bulkCreate(newCustomerApprovalComment, {
                                    fields: createRFQLineitemsApprovalCommentFields,
                                    transaction: t
                                }));
                            }
                            return Promise.all(promiseCustomerApprovalPromise).then(() => {
                                promises = [];
                                if (isVerify) {
                                    promises.push(ComponentBOMSetting.update(obj, {
                                        where: {
                                            refComponentID: partID
                                        },
                                        fields: partFields,
                                        transaction: t
                                    }));
                                }
                                return Promise.all(promises).then(() =>
                                    // Comment for save draft entry for sub assemnly and CPN Also
                                    sequelize.query('CALL Sproc_ManageBOMCustPN (:pPartID, :pUserID,:pRoleID)', {
                                        replacements: {
                                            pPartID: partID,
                                            pUserID: userID,
                                            pRoleID: COMMON.getRequestUserLoginRoleID(req)
                                        },
                                        transaction: t
                                    }).then((response) => {
                                        if (response && response.length > 0) {
                                            _.each(response, (objPartId) => {
                                                if (objPartId.partId) {
                                                    req.params = {
                                                        id: objPartId.partId
                                                    };
                                                    // Add Component Detail into Elastic Search Engine for Enterprise Search
                                                    // Need to change timeout code due to trasaction not get updated record
                                                    EnterpriseSearchController.managePartDetailInElastic(req);
                                                }
                                            });
                                        }
                                        return sequelize.query('CALL Sproc_DeleteRFQ_LineItems_AlternatePart_CPN (:pPartID, :pUserID)', {
                                            replacements: {
                                                pPartID: partID,
                                                pUserID: userID
                                            },
                                            transaction: t
                                        }).then((responseResult) => {
                                            const where = {
                                                partID: req.body.partID,
                                                isDeleted: false
                                            };
                                            if (req.body.ProgramRequiredRefDesgArray.length > 0) {
                                                where.partRefDesg = { [Op.notIn]: req.body.ProgramRequiredRefDesgArray };
                                            }
                                            return RFQLineItemsProgrammingMapping.update(
                                                { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                                                    where: where,
                                                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                                    transaction: t
                                                }).then(() => {
                                                    const whereSWUpdate = {
                                                        partID: req.body.partID,
                                                        isDeleted: false
                                                    };
                                                    if (req.body.SoftwareRefDESArray.length > 0) {
                                                        whereSWUpdate.softwareRefDesg = { [Op.notIn]: req.body.SoftwareRefDESArray };
                                                    }
                                                    return RFQLineItemsProgrammingMapping.update(
                                                        { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                                                            where: whereSWUpdate,
                                                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                                            transaction: t
                                                        }).then(() => {
                                                            if (responseResult && responseResult.length > 0) {
                                                                _.each(responseResult, (objPartId) => {
                                                                    if (partID !== objPartId.partId) {
                                                                        const data = {
                                                                            partID: objPartId.partId,
                                                                            loginUserId: COMMON.getRequestUserID(req),
                                                                            userName: req.user.username
                                                                        };
                                                                        RFQSocketController.updateBOMCPNDetails(req, data);
                                                                    }
                                                                });
                                                            }
                                                            /* Call SP to update Sub assy, Assy relationship tables data and also
                                                                sub assy reference id into existing line items */
                                                            /* Customer alias values also updated into same SP */
                                                            return sequelize.query('CALL Sproc_CreatePartAssyBomRelationshipForAllParent (:pPartID, :pUserID)', {
                                                                replacements: {
                                                                    pPartID: partID,
                                                                    pUserID: userID
                                                                },
                                                                transaction: t
                                                            }).then(() =>
                                                                /* Call SP to update assembly export controll with parrent assembly also*/
                                                                sequelize.query('CALL Sproc_UpdateExportControllAssembly (:pPartID, :pUserID)', {
                                                                    replacements: {
                                                                        pPartID: partID,
                                                                        pUserID: userID
                                                                    },
                                                                    transaction: t
                                                                }).then((responseDetails) => {
                                                                    t.commit();
                                                                    if (responseDetails) {
                                                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rfqAssyBomID, MESSAGE_CONSTANT.RFQ_LINEITEMS.BOM_SAVED);
                                                                    } else {
                                                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, partID, MESSAGE_CONSTANT.RFQ_LINEITEMS.BOM_SAVED);
                                                                    }
                                                                }).catch((err) => {
                                                                    console.trace();
                                                                    console.error(err);
                                                                    if (!t.finished) {
                                                                        t.rollback();
                                                                    }
                                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                                })).catch((err) => {
                                                                    console.trace();
                                                                    console.error(err);
                                                                    if (!t.finished) {
                                                                        t.rollback();
                                                                    }
                                                                    // Check if errorno = 3636 then it is Recursise sub assembly error.
                                                                    if (err.original && err.original.errno === 3636) {
                                                                        return resHandler.errorRes(res, 200, STATE.EMPTY, {
                                                                            userMessage: MESSAGE_CONSTANT.ASSEMBLY.ASSEMBLY_NOT_BE_RECURSIVE
                                                                        });
                                                                    } else {
                                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                                    }
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
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    })).catch((err) => {
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
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }

                            // Check if errorno = 3636 then it is Recursise sub assembly error.
                            if (err.original && err.original.errno === 3636) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.ASSEMBLY.ASSEMBLY_NOT_BE_RECURSIVE));
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            }
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
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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
    // update Line Items line items
    // @param {req} request
    // @param {res} response
    // @parm {rfqAssyBomID} rfqAssyBomID
    // @param {lineItems} new/edited line items array
    // @param {lineItemsAlternatePart} new/edited alternate part line items array
    // @param {isVerify} Is BOM is verified then true
    // @return API response
    // Checked for Re factor
    updateLineItems: (req, res, lineItems, lineItemsAlternatePart) => {
        const {
            RFQAssemblies,
            RFQLineItems,
            RFQLineitemsAlternatepart,
            ComponentBOMSetting,
            RFQLineItemsProgrammingMapping,
            sequelize
        } = req.app.locals.models;

        var partID = req.body.partID;
        var userID = COMMON.getRequestUserID(req);
        var currDate = COMMON.getCurrentUTC();

        return sequelize.transaction().then((t) => {
            // Add new line items
            if (lineItems.length) {
                return ComponentBOMSetting.update({
                    isBOMVerified: null,
                    exteranalAPICallStatus: null,
                    updatedBy: COMMON.getRequestUserID(req),
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                }, {
                        where: {
                            refComponentID: partID
                        },
                        fields: ['isBOMVerified', 'exteranalAPICallStatus', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                        transaction: t
                    }).then(() => RFQAssemblies.update({
                        isBOMVerified: null,
                        isReadyForPricing: null,
                        updatedBy: COMMON.getRequestUserID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    }, {
                            where: {
                                partID: partID
                            },
                            fields: ['isBOMVerified', 'isReadyForPricing', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                            transaction: t
                        }).then(() => {
                            var isSaveOriginal = req.body.isSaveOriginal;
                            if (isSaveOriginal) {
                                lineItems.forEach((item) => {
                                    item.org_lineID = item.lineID;
                                    item.cust_lineID = item.lineID;
                                    item.org_qpa = item.qpa;
                                    item.org_refDesig = item.refDesig;
                                    item.org_custPN = item.custPN;
                                    item.org_uomName = item.org_uomName;
                                    item.org_isInstall = item.isInstall;
                                    item.org_isPurchase = item.isPurchase;
                                    item.org_customerRev = item.customerRev;
                                    item.org_customerDescription = item.customerDescription;
                                    item.org_customerPartDesc = item.customerPartDesc;
                                    item.org_numOfPosition = item.numOfPosition;
                                    item.org_numOfRows = item.numOfRows;
                                    item.org_substitutesAllow = item.org_substitutesAllow;
                                    item.org_dnpQty = item.dnpQty;
                                    item.org_dnpDesig = item.dnpDesig;
                                });
                                lineItemsAlternatePart.forEach((item) => {
                                    item.org_distributor = item.distributor;
                                    item.org_distPN = item.distPN;
                                    item.org_mfgCode = item.mfgCode;
                                    item.org_mfgPN = item.mfgPN;
                                    item.suggestedGoodPartStep = item.suggestedGoodPartStep || true;
                                    item.suggestedGoodDistPartStep = item.suggestedGoodDistPartStep || true;
                                    item.mfgGoodPartMappingStep = item.mfgGoodPartMappingStep || true;
                                    item.distGoodPartMappingStep = item.distGoodPartMappingStep || true;
                                });
                            }

                            return RFQLineItems.bulkCreate(lineItems, {
                                fields: isSaveOriginal ? createFields.concat(createOrgFields) : createFields,
                                transaction: t,
                                individualHooks: true
                            }).then((resp) => {
                                // var newLineItems = [];
                                // resp.forEach((x) => {
                                //     newLineItems.push({
                                //         id: x.id,
                                //         lineID: x.lineID
                                //     });
                                // });

                                const newLineItems = _.map(resp, item => ({
                                    id: item.id,
                                    lineID: item.lineID
                                }));

                                lineItemsAlternatePart.forEach((item) => {
                                    var lineItem = _.find(newLineItems, x => x.lineID === item.lineID);
                                    item.rfqLineItemsID = lineItem.id;
                                    item.partID = partID;

                                    if (item.isCustomerApprove) {
                                        item.customerApprovalBy = req.user.employeeID;
                                        item.customerApprovalDate = currDate;
                                    }
                                    if (item.isCustomerUnAppoved) {
                                        item.customerUnAppovalBy = req.user.employeeID;
                                        item.customerUnAppovalDate = currDate;
                                    }
                                });

                                return RFQLineitemsAlternatepart.bulkCreate(lineItemsAlternatePart, {
                                    fields: isSaveOriginal ? createFieldsAlternate.concat(createAlternateOrgFields) : createFieldsAlternate,
                                    transaction: t
                                }).then(() => sequelize.query('CALL Sproc_CreatePartAssyBomRelationshipForAllParent (:pPartID, :pUserID)', {
                                    replacements: {
                                        pPartID: partID,
                                        pUserID: userID
                                    },
                                    transaction: t
                                }).then(() => sequelize.query('CALL Sproc_ManageBOMCustPN (:pPartID, :pUserID,:pRoleID)', {
                                    replacements: {
                                        pPartID: partID,
                                        pUserID: userID,
                                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                                    },
                                    transaction: t
                                }).then((response) => {
                                    if (response && response.length > 0) {
                                        _.each(response, (objPartId) => {
                                            if (objPartId.partId) {
                                                req.params = {
                                                    id: objPartId.partId
                                                };
                                                // Add Component Detail into Elastic Search Engine for Enterprise Search
                                                // Need to change timeout code due to trasaction not get updated record
                                                EnterpriseSearchController.managePartDetailInElastic(req);
                                            }
                                        });
                                    }
                                    return sequelize.query('CALL Sproc_DeleteRFQ_LineItems_AlternatePart_CPN (:pPartID, :pUserID)', {
                                        replacements: {
                                            pPartID: partID,
                                            pUserID: userID
                                        },
                                        transaction: t
                                    }).then((responseRFQLineDelete) => {
                                        const where = {
                                            partID: req.body.partID,
                                            isDeleted: false
                                        };
                                        if (req.body.ProgramRequiredRefDesgArray.length > 0) {
                                            where.partRefDesg = { [Op.notIn]: req.body.ProgramRequiredRefDesgArray };
                                        }
                                        return RFQLineItemsProgrammingMapping.update(
                                            { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                                                where: where,
                                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                                transaction: t
                                            }).then(() => {
                                                const whereSWUpdate = {
                                                    partID: req.body.partID,
                                                    isDeleted: false
                                                };
                                                if (req.body.SoftwareRefDESArray.length > 0) {
                                                    whereSWUpdate.softwareRefDesg = { [Op.notIn]: req.body.SoftwareRefDESArray };
                                                }
                                                return RFQLineItemsProgrammingMapping.update(
                                                    { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                                                        where: whereSWUpdate,
                                                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                                        transaction: t
                                                    }).then(() => {
                                                        if (responseRFQLineDelete && responseRFQLineDelete.length > 0) {
                                                            _.each(response, (objPartId) => {
                                                                if (partID !== objPartId.partId) {
                                                                    const data = {
                                                                        partID: objPartId.partId,
                                                                        loginUserId: COMMON.getRequestUserID(req),
                                                                        userName: req.user.username
                                                                    };
                                                                    RFQSocketController.updateBOMCPNDetails(req, data);
                                                                }
                                                            });
                                                        }
                                                        return sequelize.query('CALL Sproc_UpdateExportControllAssembly (:pPartID, :pUserID)', {
                                                            replacements: {
                                                                pPartID: partID,
                                                                pUserID: userID
                                                            },
                                                            transaction: t
                                                        }).then(() => {
                                                            t.commit();
                                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { status: 'UPDATE' }, MESSAGE_CONSTANT.RFQ_LINEITEMS.BOM_SAVED);
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
                                                        if (!t.finished) {
                                                            t.rollback();
                                                        }
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                    });
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    // Check if errorno = 3636 then it is Recursise sub assembly error.
                                    if (err.original && err.original.errno === 3636) {
                                        return resHandler.errorRes(res, 200, STATE.EMPTY, {
                                            userMessage: MESSAGE_CONSTANT.ASSEMBLY.ASSEMBLY_NOT_BE_RECURSIVE
                                        });
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    }
                                })).catch((err) => {
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
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
            } else {
                t.commit();
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { status: 'UPDATE' }, MESSAGE_CONSTANT.RFQ_LINEITEMS.BOM_SAVED);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Remove line items
    // POST : /api/v1/rfqlineitems/deleteRFQAssyDetails
    // @param {assyID} rfqAssyID
    // @return API response
    // Checked for Re factor
    deleteRFQAssyDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;

        sequelize.query('CALL Sproc_DeleteRFQAssyDetails (:pRFQAssyID, :pPartID, :pDeleteOption, :pUserID, :pRoleID)', {
            replacements: {
                pRFQAssyID: req.body.assyID,
                pPartID: req.body.partID,
                pDeleteOption: req.body.deleteOption,
                pUserID: COMMON.getRequestUserID(req),
                pRoleID: COMMON.getRequestUserLoginRoleID(req)
            }
        }).then(() => {
            var mongodb = global.mongodb;

            var promises = [
                mongodb.collection('bomStatus').deleteMany({ partID: req.body.partID }),
                mongodb.collection('ApiVerificationResult').deleteMany({
                    rfqAssyID: req.body.assyID
                }),
                mongodb.collection('FJTMongoQtySupplier').deleteMany({
                    rfqAssyID: req.body.assyID
                })
            ];

            return Promise.all(promises).then(() => {
                var data = {
                    partID: req.body.partID,
                    loginUserId: COMMON.getRequestUserID(req),
                    userName: req.user.username
                };
                RFQSocketController.deleteBOMDetails(req, data);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body.assyID, MESSAGE_CONSTANT.DELETED(bomModuleName));
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
    },
    // Validate MFG and Distributor data
    // POST : /api/v1/rfqlineitems/validateMFGDistData
    // @param Array of line items
    // @return API response
    // Checked for Re factor
    validateMFGDistData: (req, res) => {
        const mfgPNList = [];
        const distPNList = [];
        req.body.forEach((item) => {
            if (item.mfgPN) {
                mfgPNList.push(item.mfgPN);
            }
            if (item.distPN) {
                distPNList.push(item.distPN);
            }
        });

        const promises = [
            module.exports.getMFGPNIDByName(req, mfgPNList, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG),
            module.exports.getMFGPNIDByName(req, distPNList, DATA_CONSTANT.MFGCODE.MFGTYPE.DIST)
        ];

        Promise.all(promises).then((responses) => {
            var mfgPNResp = responses[0];
            var distPNResp = responses[1];

            if (mfgPNResp && mfgPNResp.status === STATE.SUCCESS) {
                mfgPNResp = mfgPNResp.data;
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: mfgPNResp.error, data: null });
            }

            if (distPNResp && distPNResp.status === STATE.SUCCESS) {
                distPNResp = distPNResp.data;
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: distPNResp.error, data: null });
            }

            const allPNList = mfgPNResp.concat(distPNResp);
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, allPNList, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get MFG PN from Dist PN
    // @param {req} obj
    // @param {pnArr} array
    // @return list of MFG
    // Checked for Re factor
    getMFGPNFromDistPNList: (req, pnArr) => {
        // var distPNList = pnArr.map((x) => { return x.distPN; });
        const distPNList = pnArr;

        const promises = [
            module.exports.getMFGPNIDByName(req, distPNList, DATA_CONSTANT.MFGCODE.MFGTYPE.DIST)
        ];

        return Promise.all(promises).then((responses) => {
            var distPNResp = responses[0];

            if (distPNResp && distPNResp.status === STATE.SUCCESS) {
                distPNResp = distPNResp.data;
                return {
                    status: STATE.SUCCESS,
                    data: distPNResp
                };
            } else {
                return {
                    status: STATE.FAILED,
                    error: ''
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

    // Verify MFG, DIST, MFGPN, DISTON
    // POST : /api/v1/rfqlineitems/componentVerification
    // @param Array of Component
    // @return API response
    // Checked for Re factor
    componentVerification: (req, res) => {
        var mfgCodeList = [];
        var mfgPNList = [];
        var distributorList = [];
        var distPNList = [];
        var getDistPNList = [];

        req.body.model.forEach((item) => {
            if (item.mfgCode) { mfgCodeList.push(item.mfgCode); }
            if (item.mfgPN) { mfgPNList.push(item.mfgPN); }
            if (item.distributor) { distributorList.push(item.distributor); }
            if (item.distPN) { distPNList.push(item.distPN); }
            if (!item.mfgCode && !item.mfgPN && item.distPN) { getDistPNList.push(item.distPN); }
        });


        const promises = [
            module.exports.getMFGCodeIDByNameAlias(req, mfgCodeList, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG),
            module.exports.getMFGPNIDByName(req, mfgPNList, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG),
            module.exports.getMFGCodeIDByNameAlias(req, distributorList, DATA_CONSTANT.MFGCODE.MFGTYPE.DIST),
            module.exports.getMFGPNIDByName(req, distPNList, DATA_CONSTANT.MFGCODE.MFGTYPE.DIST),
            module.exports.getMFGPNFromDistPNList(req, getDistPNList),
            module.exports.getProgramMappingVarification(req, req.body.partID)
        ];

        Promise.all(promises).then((responses) => {
            var mfgCodeResp = responses[0];
            var mfgPNResp = responses[1];
            var distributorResp = responses[2];
            var distPNResp = responses[3];
            var getDistPNResp = responses[4];
            var partProgramMappingDetail = responses[5];

            if (mfgCodeResp && mfgCodeResp.status === STATE.SUCCESS) {
                mfgCodeResp = _.map(mfgCodeResp.data, 'dataValues');
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: mfgCodeResp.error, data: null });
            }

            if (mfgPNResp && mfgPNResp.status === STATE.SUCCESS) {
                mfgPNResp = mfgPNResp.data;
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: mfgPNResp.error, data: null });
            }

            if (distributorResp && distributorResp.status === STATE.SUCCESS) {
                distributorResp = _.map(distributorResp.data, 'dataValues');
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: distributorResp.error, data: null });
            }

            if (distPNResp && distPNResp.status === STATE.SUCCESS) {
                distPNResp = distPNResp.data;
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: distPNResp.error, data: null });
            }

            if (getDistPNResp && getDistPNResp.status === STATE.SUCCESS) {
                getDistPNResp = getDistPNResp.data;
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: getDistPNResp.error, data: null });
            }

            if (partProgramMappingDetail && partProgramMappingDetail.data && partProgramMappingDetail.status === STATE.SUCCESS) {
                partProgramMappingDetail = partProgramMappingDetail.data.map(x => x.dataValues);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: partProgramMappingDetail.error.errors, data: null });
            }

            const allPNList = mfgPNResp.concat(distPNResp);

            const model = {
                mfgCodeList: mfgCodeResp,
                mfgPNList: mfgPNResp,
                distributorList: distributorResp,
                distPNList: distPNResp,
                allPNList: allPNList,
                getDistPNList: getDistPNResp,
                partProgramMappingDetail: partProgramMappingDetail
            };
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, model, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get MFG ID by MFG name or alias
    // @param {req} obj
    // @param {mfgCodeArr} array
    // @param {mfgType} string
    // @return list of MFG ID
    // Checked for Re factor
    getMFGCodeIDByNameAlias: (req, mfgCodeArr, mfgType) => {
        const promises = [
            module.exports.getMFGCodeIDByName(req, mfgCodeArr, mfgType),
            module.exports.getMFGCodeIDByAlias(req, mfgCodeArr, mfgType)
        ];

        return Promise.all(promises).then((responses) => {
            let mfgCodeResp = responses[0];
            let mfgAliasResp = responses[1];

            if (mfgCodeResp && mfgCodeResp.status === STATE.SUCCESS) {
                mfgCodeResp = mfgCodeResp.data;
            } else {
                return mfgCodeResp;
            }

            if (mfgAliasResp && mfgAliasResp.status === STATE.SUCCESS) {
                mfgAliasResp = mfgAliasResp.data;
            } else {
                return mfgAliasResp;
            }
            const mfgAliasRes = [];
            if (mfgAliasResp && mfgAliasResp.length) {
                mfgAliasResp = _.values(mfgAliasResp);
                _.each(mfgAliasResp, (item) => {
                    if (item.mfgCodemst && item.mfgCodemst.mfgType === mfgType) {
                        const obj = {
                            dataValues: {
                                name: item.alias,
                                id: item.mfgcodeId,
                                mfgCodemst: item.mfgCodemst,
                                invalidMfgMapping: item.invalidMfgMapping
                            }
                        };
                        mfgAliasRes.push(obj);
                    }
                });
            }

            const mfgCodeList = mfgAliasRes.concat(mfgCodeResp);
            return {
                status: STATE.SUCCESS,
                data: mfgCodeList
            };
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },
    // Get MFG ID by MFG name
    // @param {req} obj
    // @param {mfgCodeArr} array
    // @param {mfgType} string
    // @return list of MFG ID
    // Checked for Re factor
    getMFGCodeIDByName: (req, mfgCodeArr, mfgType) => {
        const {
            MfgCodeMst
        } = req.app.locals.models;

        return MfgCodeMst.findAll({
            where: {
                // mfgCode: mfgCodeArr,
                [Op.or]: [{
                    mfgCode: mfgCodeArr
                }, {
                    mfgName: mfgCodeArr
                }],
                mfgType: mfgType
            },
            attributes: ['id', ['mfgCode', 'name'], 'mfgName', 'acquisitionDetail']
        }).then(response => ({
            status: STATE.SUCCESS,
            data: response
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },
    // Get MFG ID by MFG Alias
    // @param {req} obj
    // @param {mfgCodeArr} array
    // @param {mfgType} string
    // @return list of MFG ID
    // Checked for Re factor
    getMFGCodeIDByAlias: (req, mfgCodeArr) => {
        const {
            MfgCodeAlias,
            MfgCodeMst,
            InvalidMfgMappingMst
        } = req.app.locals.models;

        return MfgCodeAlias.findAll({
            where: {
                alias: mfgCodeArr
            },
            attributes: ['id', 'mfgcodeId', 'alias'],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                attributes: ['mfgCode', 'mfgName', 'acquisitionDetail', 'mfgType']
            }, {
                model: InvalidMfgMappingMst,
                as: 'invalidMfgMapping',
                attributes: ['id', 'refmfgCodeID', 'refmfgAliasID'],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodeMst',
                    attributes: ['id', ['mfgCode', 'name'], 'mfgName', 'acquisitionDetail']
                }],
                required: false
            }]
        }).then(response => ({
            status: STATE.SUCCESS,
            data: response
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },
    // Get Component PN ID by PN name
    // @param {req} obj
    // @param {pnArr} array
    // @param {mfgType} string
    // @return list of MFG ID
    // Checked for Re factor
    getMFGPNIDByName: (req, pnArr, mfgType) => {
        const {
            Component,
            MfgCodeMst,
            RFQConnecterType,
            ComponentAlternatePN,
            ComponentDrivetools,
            ComponentOtherPN,
            ComponentProcessMaterial,
            UOMs,
            RFQPartType,
            RFQMountingType,
            RFQRoHS,
            ComponentStandardDetails,
            CertificateStandards,
            ComponentTemperatureSensitiveData,
            ComponentDynamicAttributeMappingPart,
            RFQPackageCaseType
        } = req.app.locals.models;

        return Component.findAll({
            where: {
                mfgPN: pnArr
                // [Op.or]: [{mfgPN: pnArr},{ '$component_otherpn.name$':{[Op.in]:pnArr}}]
            },
            attributes: ['id', ['mfgPN', 'name'], 'mfgcodeID', 'isGoodPart', 'noOfPosition', 'RoHSStatusID', 'feature', 'mfgPNDescription', 'connecterTypeID', 'connectorTypeText', 'mountingTypeID', 'category', 'functionalCategoryID', 'pitch', 'noOfRows', 'value', 'partPackage', 'restrictUSEwithpermission', 'restrictUsePermanently', 'pickupPadRequired', 'matingPartRquired', 'driverToolRequired', 'programingRequired', 'functionalTestingRequired', 'tolerance', 'minOperatingTemp', 'maxOperatingTemp', 'powerRating', 'replacementPartID', 'createdBy', 'uom', 'color', 'voltage', 'refSupplierMfgpnComponentID', 'packaging', 'restrictPackagingUsePermanently', 'restrictPackagingUseWithpermission', 'isTemperatureSensitive', 'dataSheetLink', 'PIDCode', 'isCPN', 'deviceMarking', 'isCustom', 'serialNumber', 'partPackageID', 'rev', 'isEpoxyMount'],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                where: {
                    mfgType: mfgType
                },
                attributes: ['mfgCode', 'mfgName', 'acquisitionDetail']
            },
            {
                model: Component,
                as: 'replacementComponent',
                attributes: ['id', 'mfgPN', 'mfgcodeID'],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    where: {
                        mfgType: mfgType
                    },
                    attributes: ['id', 'mfgCode', 'mfgName', 'acquisitionDetail'],
                    required: false
                }],
                required: false
            },
            {
                model: RFQConnecterType,
                as: 'rfqConnecterType',
                attributes: ['id', 'name']
            }, {
                model: ComponentAlternatePN,
                as: 'componentAlterPN',
                attributes: ['id', 'componentID', 'refComponentID', 'type'],
                required: false
            },
            {
                model: ComponentDrivetools,
                as: 'refDriveToolAlias',
                attributes: ['id', 'componentID', 'refComponentID'],
                required: false
            },
            {
                model: ComponentProcessMaterial,
                as: 'refProcessMaterial',
                attributes: ['id', 'componentID', 'refComponentID'],
                required: false
            },
            {
                model: ComponentOtherPN,
                as: 'component_otherpn',
                attributes: ['id', 'name'],
                required: false
            },
            {
                model: UOMs,
                as: 'UOMs',
                attributes: ['id', 'unitName']
                // required: false
            },
            {
                model: RFQPartType,
                as: 'rfqPartType',
                attributes: ['id', 'partTypeName', 'isTemperatureSensitive']
                // required: false
            },
            {
                model: RFQMountingType,
                as: 'rfqMountingType',
                attributes: ['id', 'name']
                // required: false
            },
            {
                model: ComponentTemperatureSensitiveData,
                as: 'component_temperature_sensitive_data',
                attributes: ['id', 'pickTemperatureAbove', 'timeLiquidusSecond'],
                required: false
            },
            {
                model: Component,
                as: 'refSupplierMfgComponent',
                attributes: ['id', 'mfgPN', 'mfgcodeID', 'isGoodPart', 'noOfPosition', 'RoHSStatusID', 'feature', 'mfgPNDescription', 'connecterTypeID', 'connectorTypeText', 'mountingTypeID', 'category', 'functionalCategoryID', 'pitch', 'noOfRows', 'value', 'partPackage', 'restrictUSEwithpermission', 'restrictUsePermanently', 'pickupPadRequired', 'matingPartRquired', 'driverToolRequired', 'programingRequired', 'functionalTestingRequired', 'tolerance', 'minOperatingTemp', 'maxOperatingTemp', 'powerRating', 'replacementPartID', 'createdBy', 'uom', 'color', 'voltage', 'refSupplierMfgpnComponentID', 'packaging', 'restrictPackagingUsePermanently', 'restrictPackagingUseWithpermission', 'isTemperatureSensitive', 'dataSheetLink', 'PIDCode', 'isCPN', 'deviceMarking', 'isCustom', 'serialNumber', 'partPackageID', 'isEpoxyMount'],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    attributes: ['id', 'mfgCode', 'mfgName', 'acquisitionDetail'],
                    where: {
                        mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG
                    },
                    required: false
                }, {
                    model: RFQConnecterType,
                    as: 'rfqConnecterType',
                    attributes: ['id', 'name']
                }, {
                    model: ComponentAlternatePN,
                    as: 'componentAlterPN',
                    attributes: ['id', 'componentID', 'refComponentID', 'type'],
                    required: false
                },
                {
                    model: ComponentDrivetools,
                    as: 'refDriveToolAlias',
                    attributes: ['id', 'componentID', 'refComponentID'],
                    required: false
                },
                {
                    model: ComponentProcessMaterial,
                    as: 'refProcessMaterial',
                    attributes: ['id', 'componentID', 'refComponentID'],
                    required: false
                },
                {
                    model: ComponentOtherPN,
                    as: 'component_otherpn',
                    attributes: ['id', 'name'],
                    required: false
                },
                {
                    model: UOMs,
                    as: 'UOMs',
                    attributes: ['id', 'unitName']
                    // required: false
                },
                {
                    model: RFQPartType,
                    as: 'rfqPartType',
                    attributes: ['id', 'partTypeName', 'isTemperatureSensitive']
                    // required: false
                },
                {
                    model: RFQMountingType,
                    as: 'rfqMountingType',
                    attributes: ['id', 'name']
                    // required: false
                },
                {
                    model: ComponentTemperatureSensitiveData,
                    as: 'component_temperature_sensitive_data',
                    attributes: ['id', 'pickTemperatureAbove', 'timeLiquidusSecond'],
                    required: false
                }, {
                    model: Component,
                    as: 'replacementComponent',
                    attributes: ['id', 'mfgPN', 'mfgcodeID'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            mfgType: mfgType
                        },
                        attributes: ['id', 'mfgCode', 'mfgName', 'acquisitionDetail'],
                        required: false
                    }],
                    required: false
                }],
                required: false
            },
            {
                model: RFQRoHS,
                as: 'rfq_rohsmst',
                attributes: ['id', 'isActive', 'name', 'refMainCategoryID']
            },
            {
                model: ComponentStandardDetails,
                as: 'componetStandardDetail',
                attributes: ['id', 'certificateStandardID'],
                include: [{
                    model: CertificateStandards,
                    as: 'certificateStandard',
                    attributes: ['certificateStandardID', 'isExportControlled'],
                    required: false
                }],
                required: false
            },
            {
                model: RFQPackageCaseType,
                as: 'rfq_packagecasetypemst',
                attributes: ['id', 'name'],
                required: false
            },
            {
                model: ComponentDynamicAttributeMappingPart,
                as: 'componetDynamicAttributeDetails',
                attributes: ['id', 'attributeID'],
                required: false
            }]
        }).then(response => ({
            status: STATE.SUCCESS,
            data: response
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },

    // Get Component PN ID by PN name
    // @param {req} obj
    // @param {pnArr} array
    // @param {mfgType} string
    // @return list of MFG ID
    // Checked for Re factor
    getMFGPNWithCPNMappingIDByName: (req, pnArr, mfgType) => {
        const { Component, MfgCodeMst, ComponentCustAliasRevPN } = req.app.locals.models;

        return Component.findAll({
            where: {
                mfgPN: pnArr,
                isCPN: true
            },
            attributes: ['id', ['mfgPN', 'name'], 'mfgcodeID', 'RoHSStatusID'],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                where: {
                    mfgType: mfgType
                },
                attributes: ['mfgCode', 'mfgName']
            },
            {
                model: ComponentCustAliasRevPN,
                as: 'ComponentCPNPart',
                attributes: ['refComponentID'],
                required: false
            }]
        }).then(response => ({
            status: STATE.SUCCESS,
            data: response
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },

    // Get Component PN ID by PN name
    // @param {req} obj
    // @param {pnArr} array
    // @param {mfgType} string
    // @return list of MFG ID
    // Checked for Re factor
    getNonCPNComponentDetailByName: (req, pnArr, mfgType) => {
        const { Component, MfgCodeMst, ComponentCustAliasRevPN } = req.app.locals.models;

        return Component.findAll({
            where: {
                mfgPN: pnArr,
                isCPN: false
            },
            attributes: ['id', 'mfgPN', 'mfgcodeID', 'RoHSStatusID'],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                where: {
                    mfgType: mfgType
                },
                attributes: ['mfgCode', 'mfgName']
            }, {
                model: ComponentCustAliasRevPN,
                as: 'ComponentCPNPart',
                attributes: ['refComponentID'],
                required: false
            }]
        }).then(response => ({
            status: STATE.SUCCESS,
            data: response
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },

    // Retrive list of Unit of Measurement
    // GET : /api/v1/uoms/getUOMsList
    // @param {id} int
    // @param {measurementID} int
    // @return list of Unit of Measurement
    // Checked for Re factor
    getUOMsList: (req) => {
        const {
            UOMs,
            MeasurementType
        } = req.app.locals.models;
        const where = {};
        if (req.params.id) {
            where.id = {
                [Op.ne]: req.params.id
            };
        }
        if (req.params.measurementTypeID) {
            where.measurementTypeID = req.params.measurementTypeID;
        }
        return UOMs.findAll({
            where: where,
            attributes: ['id', 'unitName'],
            include: [{
                model: MeasurementType,
                as: 'measurementType',
                attributes: ['id', 'name']
            }],
            order: [
                ['ord', 'ASC'],
                ['unitName', 'ASC']
            ]
        }).then(response => ({
            status: STATE.SUCCESS,
            data: response
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },
    // Get get Unclean SubAssembly List
    // @param {req} obj
    // @return list of sub assembly with PID and mfg pn
    // Checked for Re factor
    getUncleanSubAssemblyList: (req, pnArr) => {
        const {
            Component,
            sequelize
        } = req.app.locals.models;

        return Component.findAll({
            where: {
                id: pnArr,
                category: 3
            },
            attributes: ['id']
        }).then((response) => {
            const partIDs = response.map(x => x.dataValues).map(x => x.id).join(',');
            if (partIDs != null && partIDs !== '') {
                return sequelize.query('CALL Sproc_CheckCleanBOMSubAssembly (:pPartID)', {
                    replacements: {
                        pPartID: partIDs
                    }
                }).then(responseBOM => ({
                    status: STATE.SUCCESS,
                    data: responseBOM
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        error: err
                    };
                });
            } else {
                return {
                    status: STATE.SUCCESS,
                    data: []
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
    // get qty and list items
    // GET:/api/v1/rfqlineitems/getConsolidateLineItems
    // @param assyid
    // @return API response
    // Checked for Re factor
    getConsolidateLineItems: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetConsolidateLineItems (:prfqAssyID)', {
            replacements: {
                prfqAssyID: req.params.rfqAssyID
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { consolidateParts: _.values(response[0]), quantityAssembly: _.values(response[1]) }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // get CPN Part Details
    // GET: /api/v1/rfqlineitems/getAllCPNPartDetailListByCPNIDs
    // @param CPNIDs
    // @return API response
    getAllCPNPartDetailListByCPNIDs: (req, res) => {
        const { Component, ComponentCustAliasRevPN } = req.app.locals.models;
        if (req.query.CPNIDs && req.query.CPNIDs.length > 0) {
            return Component.findAll({
                where: {
                    id: req.query.CPNIDs
                },
                attributes: ['id', ['mfgPN', 'name'], 'mfgcodeID', 'isCPN', 'isCustom', 'rev'],
                include: [{
                    model: ComponentCustAliasRevPN,
                    as: 'ComponentCustAliasRevPart',
                    attributes: ['id', 'refCPNPartID', 'refComponentID'],
                    include: [{
                        model: Component,
                        as: 'refAVLPart',
                        attributes: ['id', ['mfgPN', 'name'], 'mfgcodeID', 'isGoodPart', 'noOfPosition', 'RoHSStatusID', 'feature', 'mfgPNDescription', 'connecterTypeID', 'mountingTypeID', 'category', 'functionalCategoryID', 'PIDCode', 'isCPN', 'isCustom', 'partPackageID', 'rev', 'isEpoxyMount']
                    }]
                }]
            }).then(resCPNParts => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resCPNParts, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, [], null);
        }
    },

    // update lineitems from verifyBom
    // POST : /api/v1/rfqlineitems/updateVerifyBOM
    // @param {req} obj
    // @return API response
    // Checked for Re factor
    updateVerifyBOM: (req, res) => {
        const { RFQForms, RFQQuoteIssueHistory, sequelize } = req.app.locals.models;
        var promises = [];

        RFQForms.findOne({
            where: {
                id: req.body.rfqrefID,
                consolidateActivityStarted: true
            }
        }).then((resRFQ) => {
            if (!resRFQ) {
                return RFQForms.update({
                    consolidateActivityStarted: true
                }, {
                        where: {
                            id: req.body.rfqrefID
                        }
                    }).then(() => sequelize.query('CALL Sproc_UOMValidationPlannedBOM (:rfqAssyID)', {
                        replacements: {
                            rfqAssyID: req.body.rfqAssyID
                        }
                    }).then((response) => {
                        var multipleMGF = [];
                        var mfgGroup = _.groupBy(response, 'mfgcode');
                        Object.keys(mfgGroup).forEach((prop) => {
                            if (mfgGroup[prop].length > 1) {
                                const list = _.filter(mfgGroup[prop], bomObj =>
                                    // eslint-disable-next-line consistent-return
                                    _.some(mfgGroup, (item) => {
                                        var Objbom = _.filter(item, bom => bom.mfgcode === bomObj.mfgcode && bom.uomID !== bomObj.uomID);
                                        if (Objbom.length > 0) {
                                            return true;
                                        }
                                    }));
                                if (list.length > 0) {
                                    multipleMGF.push(mfgGroup[prop]);
                                }
                            }
                        });
                        if (multipleMGF.length > 0) {
                            RFQForms.update({
                                consolidateActivityStarted: false
                            }, {
                                    where: {
                                        id: req.body.rfqrefID
                                    }
                                });
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, multipleMGF, null);
                        } else {
                            return sequelize.transaction().then((t) => {
                                if (req.body.isReadyForPricing) {
                                    promises.push(RFQQuoteIssueHistory.update(
                                        { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) },
                                        {
                                            where: {
                                                rfqAssyID: req.body.rfqAssyID,
                                                refSubmittedQuoteID: req.body.rfqAssyQuoteSubmittedID,
                                                issueType: 'CustomerEngineeringResolution'
                                            },
                                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                            transaction: t
                                        }).then(responseDet => ({
                                            status: STATE.SUCCESS,
                                            data: responseDet
                                        })).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return {
                                                status: STATE.FAILED,
                                                error: err
                                            };
                                        }));
                                }
                                return Promise.all(promises).then((responses) => {
                                    var resObj = _.find(responses, x => x.status === STATE.FAILED);
                                    if (!resObj) {
                                        if (req.body.isReadyForPricing) {
                                            const BOMIssue = [];
                                            _.each(req.body.currentBOMIssue, (objBOMIssue) => {
                                                const obj = {
                                                    BOMIssue: objBOMIssue.description,
                                                    refSubmittedQuoteID: req.body.rfqAssyQuoteSubmittedID,
                                                    rfqAssyID: req.body.rfqAssyID,
                                                    PIDCode: objBOMIssue.assyPN,
                                                    lineID: objBOMIssue.lineID,
                                                    issueType: 'CustomerEngineeringResolution',
                                                    createdBy: COMMON.getRequestUserID(req),
                                                    updatedBy: COMMON.getRequestUserID(req),
                                                    createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                                };
                                                BOMIssue.push(obj);
                                            });
                                            return RFQQuoteIssueHistory.bulkCreate(BOMIssue, {
                                                fields: rfqQuoteIssueHistoryFields,
                                                transaction: t,
                                                individualHooks: true
                                            }).then(() => module.exports.copyVerifiedBOM(req, t).then((responseCopyBOM) => {
                                                if (responseCopyBOM.status === STATE.SUCCESS) {
                                                    t.commit();
                                                    RFQForms.update({
                                                        consolidateActivityStarted: false
                                                    }, {
                                                            where: {
                                                                id: req.body.rfqrefID
                                                            }
                                                        });
                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseCopyBOM, responseCopyBOM.ismismatchVersion ? MESSAGE_CONSTANT.RFQ.PLANNED_BOM_SAVED : null);
                                                } else {
                                                    if (!t.finished) { t.rollback(); }
                                                    RFQForms.update({
                                                        consolidateActivityStarted: false
                                                    }, {
                                                            where: {
                                                                id: req.body.rfqrefID
                                                            }
                                                        });
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: responseCopyBOM.error, data: null });
                                                }
                                            }).catch((err) => {
                                                if (!t.finished) { t.rollback(); }
                                                RFQForms.update({
                                                    consolidateActivityStarted: false
                                                }, {
                                                        where: {
                                                            id: req.body.rfqrefID
                                                        }
                                                    });
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                            })).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return {
                                                    status: STATE.FAILED,
                                                    error: err
                                                };
                                            });
                                        } else {
                                            t.commit();
                                            RFQForms.update({
                                                consolidateActivityStarted: false
                                            }, {
                                                    where: {
                                                        id: req.body.rfqrefID
                                                    }
                                                });
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responses, MESSAGE_CONSTANT.RFQ.BOM_SAVED);
                                        }
                                    } else {
                                        if (!t.finished) { t.rollback(); }
                                        RFQForms.update({
                                            consolidateActivityStarted: false
                                        }, {
                                                where: {
                                                    id: req.body.rfqrefID
                                                }
                                            });
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                    }
                                }).catch((err) => {
                                    if (!t.finished) { t.rollback(); }
                                    RFQForms.update({
                                        consolidateActivityStarted: false
                                    }, {
                                            where: {
                                                id: req.body.rfqrefID
                                            }
                                        });
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }).catch((err) => {
                                RFQForms.update({
                                    consolidateActivityStarted: false
                                }, {
                                        where: {
                                            id: req.body.rfqrefID
                                        }
                                    });
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }
                    }).catch((err) => {
                        RFQForms.update({
                            consolidateActivityStarted: false
                        }, {
                                where: {
                                    id: req.body.rfqrefID
                                }
                            });
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.RFQ.ACTIVITY_STARTED_ON_OTHER_QUOTE_GROUP_ASSEMBLY, err: null, data: null });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Copy Rfq lineitems and rfq lineitems alternatepart in consolidate
    // @param {req} obj
    // @param {transaction} transaction
    // @return API response
    // Checked for Re factor
    copyVerifiedBOM: (req, transaction) => {
        const { sequelize, RFQAssemblies } = req.app.locals.models;
        return sequelize.query('CALL Sproc_CheckRFQAssemblyPriceGroupVersion(:rfqAssyID)', {
            replacements: {
                rfqAssyID: req.body.rfqAssyID
            },
            type: sequelize.QueryTypes.SELECT,
            transaction: transaction
        }).then((response) => {
            if (_.values(response[0]).length > 0 || req.body.submitForConsolidate) {
                const promises = [];
                return sequelize.query('CALL Sproc_CreateRfqConsolidateLineItem (:rfqAssyID,:partID,:userID,:BOMVersion)', {
                    replacements: {
                        rfqAssyID: req.body.rfqAssyID || null,
                        partID: req.body.partID || null,
                        userID: req.user.id,
                        BOMVersion: req.body.BOMVersion || null
                    },
                    type: sequelize.QueryTypes.SELECT,
                    transaction: transaction
                }).then((responseConsolidate) => {
                    if (responseConsolidate && req.body.BOMIssues) {
                        return RFQAssemblies.update({ partcostingBOMIssue: req.body.BOMIssues }, {
                            where: {
                                id: req.body.rfqAssyID
                            },
                            fields: ['partcostingBOMIssue'],
                            transaction: transaction
                        }).then(() => {
                            if (responseConsolidate && responseConsolidate.length > 0) {
                                const listConsolidateIds = _.values(responseConsolidate[0]);
                                if (listConsolidateIds.length > 0) {
                                    _.each(listConsolidateIds, (consolidates) => {
                                        var myquery = {
                                            rfqAssyID: parseInt(req.body.rfqAssyID) || null,
                                            ConsolidateID: consolidates.id
                                        };
                                        promises.push(SupplierQuoteController.manageSupplierQuotePartPricePartCosting(req, myquery).then(() => {
                                            RFQConsolidatedMFGPNLineItemController.updatePricing(req, myquery).then(status => status);
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return {
                                                status: STATE.FAILED,
                                                error: err
                                            };
                                        }));
                                    });
                                }
                                const listremovedParts = _.values(responseConsolidate[1]);
                                if (listremovedParts.length > 0) {
                                    _.each(listremovedParts, (consolidates) => {
                                        var myquery = {
                                            rfqAssyID: parseInt(req.body.rfqAssyID) || null,
                                            ConsolidateID: consolidates.consolidateID,
                                            PartNumberId: consolidates.mfgPNID
                                        };
                                        promises.push(SupplierQuoteController.manageSupplierQuotePartPricePartCosting(req, myquery).then(() => {
                                            RFQConsolidatedMFGPNLineItemController.updatePricing(req, myquery).then(status => status);
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return {
                                                status: STATE.FAILED,
                                                error: err
                                            };
                                        }));
                                    });
                                }
                                return Promise.all(promises).then(responses => ({
                                    status: STATE.SUCCESS,
                                    data: responses[0],
                                    ismismatchVersion: true
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        error: err
                                    };
                                });
                            } else {
                                return {
                                    status: STATE.SUCCESS,
                                    data: responseConsolidate[0],
                                    ismismatchVersion: true
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
                    } else if (responseConsolidate && responseConsolidate.length > 0) {
                        const listConsolidateIds = _.values(responseConsolidate[0]);
                        if (listConsolidateIds.length > 0) {
                            _.each(listConsolidateIds, (consolidates) => {
                                var myquery = {
                                    rfqAssyID: parseInt(req.body.rfqAssyID) || null,
                                    ConsolidateID: consolidates.id
                                };
                                promises.push(SupplierQuoteController.manageSupplierQuotePartPricePartCosting(req, myquery).then(() => {
                                    RFQConsolidatedMFGPNLineItemController.updatePricing(req, myquery).then(status => status);
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        error: err
                                    };
                                }));
                            });
                        }
                        const listremovedParts = _.values(responseConsolidate[1]);
                        if (listremovedParts.length > 0) {
                            _.each(listremovedParts, (consolidates) => {
                                var myquery = {
                                    rfqAssyID: parseInt(req.body.rfqAssyID) || null,
                                    ConsolidateID: consolidates.consolidateID,
                                    PartNumberId: consolidates.mfgPNID
                                };
                                promises.push(SupplierQuoteController.manageSupplierQuotePartPricePartCosting(req, myquery).then(() => {
                                    RFQConsolidatedMFGPNLineItemController.updatePricing(req, myquery).then(status => status);
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        error: err
                                    };
                                }));
                            });
                        }
                        return Promise.all(promises).then(responses => ({
                            status: STATE.SUCCESS,
                            data: responseConsolidate[0],
                            ismismatchVersion: true
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED,
                                error: err
                            };
                        });
                    } else {
                        return {
                            status: STATE.SUCCESS,
                            data: responseConsolidate[0],
                            ismismatchVersion: true
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
            } else {
                return {
                    status: STATE.SUCCESS,
                    ismismatchVersion: false
                };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err,
                ismismatchVersion: false
            };
        });
    },
    // Get API verification error from mongodb
    // GET : /api/v1/rfqlineitems/getAPIVerificationErrors
    // @param {rfqAssyID} Assembly ID
    // @return API response
    // Checked for Re factor
    getAPIVerificationErrors: (req, res) => {
        var mongodb = global.mongodb;
        const objApiError = req.body.objApiError;
        var newquery = {};
        if (objApiError.ispartMaster || objApiError.transactionID) {
            newquery.transactionID = objApiError.transactionID;
        } else {
            newquery.partID = parseInt(objApiError.partID);
        }
        const lstpromises = [];
        lstpromises.push(mongodb.collection('bomStatus').find(newquery).toArray().then(result => result));

        Promise.all(lstpromises).then((responses) => {
            var objResult = {
                bomError: responses[0]
            };
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, objResult, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // UPdate Error into mongo database for pricing suppliers related To BOM.
    // POST : /api/v1/rfqlineitems/removeDuplicateSupplierError
    // @return API response
    // Checked for Re factor
    removeDuplicateSupplierError: (req, res) => {
        if (req.body) {
            if (!req.body.supplierErrors) {
                req.body.supplierErrors = [];
            }
            const supplierErrors = req.body.supplierErrors;
            const isDeleted = req.body.deletedRecord;
            const supplierPromise = [];
            _.each(supplierErrors, (objError) => {
                // eslint-disable-next-line default-case
                _.each(objError.apiVerificationErrorList, (ErrorApi) => {
                    switch (ErrorApi.errorType) {
                        case PricingErrors.MOUNTNOTADDED: // mounting type not added
                            supplierPromise.push(PricingController.getMountingTypeID(req, ErrorApi.DataField).then((mounting) => {
                                if (mounting && mounting.mountTypeID) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType,
                                        DataField: ErrorApi.DataField,
                                        partID: ErrorApi.partID
                                    }).then(status => status);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        case PricingErrors.CONNECTNOTADDED: // connector type not added
                            supplierPromise.push(PricingController.getConnecterTypeID(req, ErrorApi.DataField).then((connector) => {
                                if (connector && connector.connecterTypeID) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType,
                                        DataField: ErrorApi.DataField,
                                        partID: ErrorApi.partID
                                    }).then(status => status);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        case PricingErrors.MFGNOTADDED: // manufacturer not added
                            supplierPromise.push(PricingController.getManufacturerDetail(req, ErrorApi.DataField, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG).then((manufacturer) => {
                                if (manufacturer && (manufacturer.mfgCodeID || manufacturer.mfgCodeID === 0)) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType,
                                        DataField: ErrorApi.DataField,
                                        partID: ErrorApi.partID
                                    }).then(status => status);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        case PricingErrors.PARTTYPENOTADDED: // functional type not added
                            supplierPromise.push(PricingController.getPartTypeID(req, ErrorApi.DataField).then((partType) => {
                                if (partType && partType.id) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType,
                                        DataField: ErrorApi.DataField,
                                        partID: ErrorApi.partID
                                    }).then(status => status);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        case PricingErrors.ROHSNOTADDED: // RoHS not added
                            supplierPromise.push(PricingController.getRohsValid(req, ErrorApi.DataField).then((rohs) => {
                                if (rohs && rohs.id) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType,
                                        DataField: ErrorApi.DataField,
                                        partID: ErrorApi.partID
                                    }).then(status => status);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        case PricingErrors.PACKAGINGNOTADDED: // packaging type not added
                            supplierPromise.push(PricingController.getPackagingTypeID(req, ErrorApi.DataField).then((packaging) => {
                                if (packaging && packaging.packagingTypeID) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType,
                                        DataField: ErrorApi.DataField,
                                        partID: ErrorApi.partID
                                    }).then(status => status);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        case PricingErrors.UOMNOTADDED: // unit of measer not added
                            supplierPromise.push(PricingController.getUomID(req, ErrorApi.DataField).then((uomData) => {
                                if (uomData && uomData.uomID) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType,
                                        DataField: ErrorApi.DataField,
                                        partID: ErrorApi.partID
                                    }).then(status => status);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        case PricingErrors.PARTSTATUSNOTADDED: // part status is not added
                            supplierPromise.push(PricingController.getPartStatusID(req, ErrorApi.DataField).then((status) => {
                                if (status && status.partStatusID) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType,
                                        DataField: ErrorApi.DataField,
                                        partID: ErrorApi.partID
                                    }).then(statusPartNot => statusPartNot);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        case PricingErrors.PIDCODELENGTH: // PID code length grater than 30
                            supplierPromise.push(PricingController.getComponentDetail(req, ErrorApi.partNumber, ErrorApi.DataField).then((component) => {
                                if (component && component.id) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType,
                                        DataField: ErrorApi.DataField,
                                        partID: ErrorApi.partID,
                                        partNumber: ErrorApi.partNumber
                                    }).then(status => status);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        case PricingErrors.AUTHFAILED: // Authentication failed
                            // set appid for clean bom
                            req.appID = ErrorApi.appID;
                            supplierPromise.push(PricingController.checkAccessToken(req, res).then((auth) => {
                                if (auth && auth === STATE.SUCCESS) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType
                                    }).then(status => status);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        case PricingErrors.PARTINVALID: // invalid parts
                            supplierPromise.push(PricingController.getComponentDetail(req, ErrorApi.partNumber).then((component) => {
                                if (component && component.id) {
                                    return module.exports.removeBOMSupplierMongoError(req, {
                                        errorType: ErrorApi.errorType,
                                        partID: ErrorApi.partID,
                                        partNumber: ErrorApi.partNumber
                                    }).then(status => status);
                                } else {
                                    return {
                                        state: STATE.SUCCESS
                                    };
                                }
                            }));
                            break;
                        default:
                            break;
                    }
                });
            });
            return Promise.all(supplierPromise).then((responses) => {
                if (_.find(responses, lineResponse => lineResponse.state === STATE.FAILED)) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, isDeleted ? MESSAGE_CONSTANT.DELETED(apiVerificationError) : MESSAGE_CONSTANT.UPDATED(apiVerificationError));
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

    // Remove Supplier errors from mongo db
    // Checked for Re factor
    removeBOMSupplierMongoError: (req, myquery) => {
        var mongodb = global.mongodb;
        return mongodb.collection('bomStatus').deleteMany(myquery).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return {
                state: STATE.FAILED,
                error: err
            };
        });
    },

    // remove bomstatus
    // GET : /api/v1/rfqlineitems/removebomstatus
    // @param {id} id
    // @return API response
    // Checked for Re factor
    removebomstatus: (req, res) => {
        var mongodb = global.mongodb;
        var myquery = {
            _id: new Bson.ObjectId(req.params.id)
        };
        mongodb.collection('bomStatus').findOne(myquery).then((result) => {
            if (result) {
                mongodb.collection('bomStatus').deleteOne(myquery, () => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null));
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // remove bomstatus
    // GET : /api/v1/rfqlineitems/clearAPIVerificationErrors
    // @param {partID} partID
    // @return API response
    // Checked for Re factor
    clearAPIVerificationErrors: (req, res) => {
        var mongodb = global.mongodb;
        if (req.params.partID) {
            const query = {
                partID: req.params.partID
            };
            return mongodb.collection('bomStatus').deleteMany(query, (err) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    // return resHandler.errorRes(res, 200, STATE.EMPTY, null, err.errors, err.fields);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
        }
    },
    // Check obsolete parts
    // POST : /api/v1/rfqlineitems/checkObsoleteParts
    // @param {Array} Array of mfgPN
    // @return API response
    // Checked for Re factor
    checkObsoleteParts: (req, res) => {
        var mfgPNArr = req.body;
        const { Component, ComponentPartStatus } = req.app.locals.models;
        Component.findAll({
            where: {
                id: {
                    [Op.in]: mfgPNArr
                }
            },
            attributes: ['id', 'eolDate', 'ltbDate'],
            include: [{
                model: ComponentPartStatus,
                as: 'componentPartStatus',
                attributes: ['name', 'colorCode'],
                required: false
            }]
        }).then((response) => {
            var idArr = [];
            var currDate = new Date(COMMON.getCurrentUTC());
            response.forEach((component) => {
                if ((component.eolDate && component.eolDate < currDate) || (component.componentPartStatus && component.componentPartStatus.name !== DATA_CONSTANT.COMPONENT.PART_STATUS.ACTIVE)) {
                    idArr.push({
                        id: component.id,
                        ltbDate: component.ltbDate,
                        partStatus: component.componentPartStatus.name,
                        colorCode: component.componentPartStatus.colorCode
                    });
                }
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, idArr, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // get api verified alternate part from bomid
    // GET : /api/v1/rfqlineitems/getApiVerifiedAlternateParts;
    // @param {rfqAssyID} Assembly ID
    // @return list of alternate part number
    // Checked for Re factor
    getApiVerifiedAlternateParts: (req, res) => {
        var mongodb = global.mongodb;
        if (req.params.rfqAssyID) {
            return mongodb.collection('ApiVerificationResult').find({
                rfqAssyID: req.params.rfqAssyID
            }).toArray((err, result) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // get api verified alternate part count from bomid
    // GET : /api/v1/rfqlineitems/getApiVerifiedAlternatePartsCount;
    // @param {rfqAssyID} Assembly ID
    // @return count of alternate part number
    // Checked for Re factor
    getApiVerifiedAlternatePartsCount: (req, res) => {
        var mongodb = global.mongodb;
        if (req.params.rfqAssyID) {
            return mongodb.collection('ApiVerificationResult').find({
                rfqAssyID: req.params.rfqAssyID
            }).toArray((err, result) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }

                let count = 0;
                const listPricing = _.filter(result, item => item.Type === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG);
                const partList = _.groupBy(listPricing, 'SearchPN');
                _.each(partList, (item) => {
                    var isExists = _.find(result, detailitem => detailitem.PN === item[0].SearchPN);
                    if (!isExists) {
                        count++;
                    }
                });

                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, count, null);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Copy Rfq lineitems and rfq lineitems alternatepart
    // POST : /api/v1/rfqlineitems/copyAssyBOM
    // @param {req} obj
    // @return API response
    // Checked for Re factor
    copyAssyBOM: (req, res) => {
        const { sequelize, PartSubAssyRelationship } = req.app.locals.models;
        return PartSubAssyRelationship.count({
            where: {
                partID: req.body.fromPartID,
                prPerPartID: req.body.partID
            }
        }).then((count) => {
            if (count > 1) {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.RFQ.NOT_ALLOW_FOR_COPY);
                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.toAssyID, req.body.fromAssyID);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
            }
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_CopyAssyBOMQuote (:poldAssyID,:pnewAssyID,:userID,:pIsBOM,:pIsExistingRFQ,:pFromCustomerID,:pCustomerID,:pRfqFormID,:pCustomerApprovalComment,:pIsCopyPricing,:pfromRFQAssyID,:pEmployeeID,:pRoleID)', {
                replacements: {
                    poldAssyID: req.body.fromPartID || null,
                    pnewAssyID: req.body.partID || null,
                    userID: req.user.id,
                    pIsBOM: req.body.isBOM || null,
                    pIsExistingRFQ: req.body.isExistingRFQ || null,
                    pFromCustomerID: req.body.fromCustomerID || null,
                    pCustomerID: req.body.customerID || null,
                    pRfqFormID: req.body.rfqFormID || null,
                    pCustomerApprovalComment: req.body.customerApprovalComment || null,
                    pIsCopyPricing: req.body.isCopyPricing || null,
                    pfromRFQAssyID: req.body.fromRFQAssyID || null,
                    pEmployeeID: req.user.employeeID,
                    pRoleID: COMMON.getRequestUserLoginRoleID()
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response && response.length > 0) {
                    if (!req.body.isBOM) {
                        req.body.toRFQAssyID = response[0][0]['pToRFQAssyID'];
                        const CopyRFQDocument = {
                            fromRFQAssy: response[1][0],
                            toRFQAssy: response[2][0]
                        };

                        module.exports.createFolderPathForRFQCreate(res, t, CopyRFQDocument, CopyRFQDocument);
                        return module.exports.savePriceforQuantity(req, res).then(() => module.exports.copyRFQDocumentandFolder(req, t, CopyRFQDocument).then(() => {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.RFQ.RFQ_COPIED);
                        }));
                    } else {
                        t.commit();
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.RFQ.BOM_COPIED);
                    }
                } else {
                    t.commit();
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                }
            }).catch((err) => {
                if (!t.finished) {
                    t.rollback();
                }
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
    },
    // create RFQ physical folder
    // eslint-disable-next-line consistent-return
    // Checked for Re factor
    createFolderPathForRFQCreate: (res, t, RFQDocumentPath, requiredDet) => {
        const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;

        // create RFQ path folders
        const newCreatedRFQDocPathDet = RFQDocumentPath.toRFQAssy;
        if (!newCreatedRFQDocPathDet || !newCreatedRFQDocPathDet.newDocumentPath) {
            if (!t.finished) {
                t.rollback();
            }
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
        requiredDet.newCreatedRFQDocPathDet = newCreatedRFQDocPathDet;

        const genRFQFilePath = gencFileUploadPathConst;
        if (!fs.existsSync(`${genRFQFilePath}${newCreatedRFQDocPathDet.newDocumentPath}`)) {
            fs.mkdirSync(`${genRFQFilePath}${newCreatedRFQDocPathDet.newDocumentPath}`, { recursive: true });
        }
        return STATE.SUCCESS;
    },
    // Copy RFQ Document from one RFQ Assembly to New Created RFQ Assembly
    // Checked for Re factor
    copyRFQDocumentandFolder: (req, t, requiredDet) => {
        const allEntity = COMMON.AllEntityIDS;
        const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}`;
        const { GenericFiles, GenericFolder } = req.app.locals.models;

        return GenericFiles.findAll({
            where: {
                refTransID: requiredDet.fromRFQAssy.refTransID,
                gencFileOwnerType: allEntity.BOM.Name
            },
            transaction: t
        }).then((genericFilesOfPart) => {
            const promisesOfCopyRFQDoc = [];
            _.each(genericFilesOfPart, (itemData) => {
                const docpath = `.${itemData.genFilePath}`;
                const newFileName = `${uuidv1()}.${itemData.gencFileExtension}`;
                const newDocPath = `${gencFileUploadPathConst}/${requiredDet.toRFQAssy.newDocumentPath}/${newFileName}`;
                const actualGenFilePath = newDocPath.startsWith('.') ? newDocPath.replace('.', '') : null;
                if (fs.existsSync(docpath)) {
                    fsExtra.copySync(docpath, newDocPath);
                }

                itemData.refCopyTransID = itemData.refTransID; // fromRFQAssyAID
                itemData.refCopyGencFileOwnerType = itemData.gencFileOwnerType;
                itemData.gencFileName = newFileName;
                itemData.createdBy = req.user.id;
                itemData.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                itemData.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                itemData.refTransID = requiredDet.toRFQAssy.refTransID;
                itemData.gencFileOwnerType = allEntity.BOM.Name; // as we copy doc data from RFQ
                itemData.entityID = allEntity.BOM.ID;
                itemData.genFilePath = actualGenFilePath;

                promisesOfCopyRFQDoc.push(GenericFolder.findOne({
                    where: {
                        refTransID: requiredDet.toRFQAssy.refTransID,
                        gencFileOwnerType: allEntity.BOM.Name,
                        copyGencFolderID: itemData.refParentId
                    },
                    attributes: ['gencFolderID'],
                    transaction: t
                }).then((resp) => {
                    if (resp) {
                        itemData.refParentId = resp.gencFolderID;
                    }
                    return itemData.dataValues;
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return null;
                }));
            });

            return Promise.all(promisesOfCopyRFQDoc).then((respOfSetRFQDoc) => {
                const createRFQFileList = respOfSetRFQDoc.filter(x => x != null);
                COMMON.setModelCreatedArrayFieldValue(req.user, createRFQFileList);
                return GenericFiles.bulkCreate(createRFQFileList, {
                    fields: genericFilesInputFields,
                    transaction: t
                });
            });
        }).catch((err) => {
            if (!t.finished) {
                t.rollback();
            }
            console.trace();
            console.error(err);
            return resHandler.errorRes(requiredDet, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // copy mongodb Obj of pricing for selected consoildate part
    // @return saved pricing list
    // Checked for Re factor
    savePriceforQuantity: (req, res) => {
        const { RFQConsolidatedMFGPNLineItem, RFQConsolidatedMFGPNLineItemQuantity, RFQAssyQuantity } = req.app.locals.models;
        if (req.body) {
            return RFQConsolidatedMFGPNLineItem.findAll({
                where: {
                    rfqAssyID: {
                        [Op.in]: [req.body.fromRFQAssyID, req.body.toRFQAssyID]
                    }
                },
                attributes: ['id', 'rfqAssyID', 'lineID', 'rfqLineItemID', 'qpa', 'consolidatedpartlineID'],
                include: [{
                    model: RFQConsolidatedMFGPNLineItemQuantity,
                    as: 'rfqConsolidatedMFGPNLineItemQuantity',
                    attributes: ['id', 'consolidateID', 'qtyID', 'finalPrice', 'unitPrice', 'supplier', 'selectedMpn', 'selectionMode', 'min', 'mult', 'currentStock', 'selectedPIDCode', 'leadTime', 'supplierStock', 'grossStock', 'pricingSuppliers', 'packaging'],
                    include: [{
                        model: RFQAssyQuantity,
                        as: 'rfqAssyQuantity',
                        attributes: ['id', 'requestQty'],
                        required: true
                    }]
                }]
            }).then((rfqLineItems) => {
                if (!rfqLineItems) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                } else {
                    const oldAssyBOM = _.filter(rfqLineItems, lineItemObj => lineItemObj.rfqAssyID === req.body.fromRFQAssyID);
                    const newAssyBOM = _.filter(rfqLineItems, lineItemObj => lineItemObj.rfqAssyID === req.body.toRFQAssyID);
                    const promises = [];
                    for (let i = 0; i < oldAssyBOM.length; i++) {
                        const selectedNewLineItem = _.filter(newAssyBOM, lineItem => lineItem.lineID === oldAssyBOM[i].lineID && lineItem.consolidatedpartlineID === oldAssyBOM[i].consolidatedpartlineID);
                        if (selectedNewLineItem.length > 0) {
                            _.each(selectedNewLineItem[0].rfqConsolidatedMFGPNLineItemQuantity, (conQtyObj) => {
                                var pricingObj = {};
                                // eslint-disable-next-line consistent-return
                                let oldAssyqty = _.find(oldAssyBOM[i].rfqConsolidatedMFGPNLineItemQuantity, (oldQtyObj) => {
                                    if (oldQtyObj.rfqAssyQuantity.requestQty === conQtyObj.rfqAssyQuantity.requestQty) {
                                        return true;
                                    }
                                });
                                if (!oldAssyqty) {
                                    // eslint-disable-next-line consistent-return
                                    oldAssyqty = _.filter(oldAssyBOM[i].rfqConsolidatedMFGPNLineItemQuantity, (oldQtyObj) => {
                                        if (oldQtyObj.rfqAssyQuantity.requestQty < conQtyObj.rfqAssyQuantity.requestQty) {
                                            return true;
                                        }
                                    });
                                    if (oldAssyqty.length === 0) {
                                        // eslint-disable-next-line consistent-return
                                        oldAssyqty = _.filter(oldAssyBOM[i].rfqConsolidatedMFGPNLineItemQuantity, (oldQtyObj) => {
                                            if (oldQtyObj.rfqAssyQuantity.requestQty > conQtyObj.rfqAssyQuantity.requestQty) {
                                                return true;
                                            }
                                        });
                                        if (oldAssyqty.length > 0) {
                                            let qty = 0;
                                            _.each(oldAssyqty, (qtyobj) => {
                                                if (qty !== 0) {
                                                    if (qty > qtyobj.rfqAssyQuantity.requestQty) { qty = qtyobj.rfqAssyQuantity.requestQty; }
                                                } else {
                                                    qty = qtyobj.rfqAssyQuantity.requestQty;
                                                }
                                            });

                                            const selected = _.find(oldAssyqty, x => x.rfqAssyQuantity.requestQty === qty);
                                            pricingObj.ConsolidatedID = selected.consolidateID;
                                            pricingObj.rfqAssyQtyID = selected.qtyID;
                                            pricingObj.supplierPN = selected.selectedMpn;
                                        }
                                    } else if (oldAssyqty.length > 0) {
                                        let qty = 0;
                                        _.each(oldAssyqty, (qtyobj) => {
                                            if (qty !== 0) {
                                                if (qty < qtyobj.rfqAssyQuantity.requestQty) { qty = qtyobj.rfqAssyQuantity.requestQty; }
                                            } else {
                                                qty = qtyobj.rfqAssyQuantity.requestQty;
                                            }
                                        });

                                        const selected = _.find(oldAssyqty, x => x.rfqAssyQuantity.requestQty === qty);
                                        pricingObj.ConsolidatedID = selected.consolidateID;
                                        pricingObj.rfqAssyQtyID = selected.qtyID;
                                        pricingObj.supplierPN = selected.selectedMpn;
                                    }
                                } else {
                                    pricingObj.ConsolidateID = oldAssyqty.consolidateID;
                                    pricingObj.rfqAssyQtyID = oldAssyqty.qtyID;
                                    pricingObj.supplierPN = oldAssyqty.selectedMpn;
                                }

                                if (pricingObj.supplierPN) {
                                    const mongodb = global.mongodb;
                                    const myquery = {
                                        ConsolidateID: pricingObj.ConsolidateID,
                                        IsDeleted: false
                                    };
                                    promises.push(mongodb.collection('FJTMongoQtySupplier').find(myquery).toArray().then((result) => {
                                        var insertPromises = [];
                                        if (result && result.length > 0) {
                                            _.each(result, (details) => {
                                                var newpricingObj = _.clone(details);
                                                newpricingObj.ConsolidateID = conQtyObj.consolidateID;
                                                // newpricingObj.RfqAssyQtyId = conQtyObj.qtyID;
                                                newpricingObj.rfqAssyID = req.body.toRFQAssyID;
                                                const ObjectID = new Bson.ObjectID(); // require('bson').ObjectID;
                                                newpricingObj._id = ObjectID;
                                                insertPromises.push(mongodb.collection('FJTMongoQtySupplier').insertOne(newpricingObj).then(() => {
                                                    var queryForQtyBreak = {
                                                        qtySupplierID: details._id,
                                                        isDeleted: false
                                                    };
                                                    return mongodb.collection('AssemblyQtyBreak').find(queryForQtyBreak).toArray().then((qtyBreakResult) => {
                                                        var qtyPromise = [];
                                                        _.each(qtyBreakResult, (qtyBreak) => {
                                                            var newQtyBreakObj = qtyBreak;
                                                            var QtyObjectID = new Bson.ObjectID(); // require('bson').ObjectID;
                                                            newQtyBreakObj._id = QtyObjectID;
                                                            newQtyBreakObj.qtySupplierID = newpricingObj._id;
                                                            newQtyBreakObj.RfqAssyQtyId = conQtyObj.qtyID;
                                                            newQtyBreakObj.ConsolidateID = conQtyObj.ConsolidatedID;
                                                            qtyPromise.push(mongodb.collection('AssemblyQtyBreak').insertOne(newQtyBreakObj)
                                                                .then(() => ({
                                                                    status: STATE.SUCCESS
                                                                })).catch((err) => {
                                                                    console.trace();
                                                                    console.error(err);
                                                                    return {
                                                                        status: STATE.FAILED,
                                                                        error: err

                                                                    };
                                                                }));
                                                        });
                                                        return Promise.all(qtyPromise).then((responses) => {
                                                            var failedResult = _.find(responses, response => response === STATE.FAILED);
                                                            if (failedResult) {
                                                                return {
                                                                    status: STATE.FAILED
                                                                };
                                                            }
                                                            return {
                                                                status: STATE.SUCCESS
                                                            };
                                                        });
                                                    })
                                                        .catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return {
                                                                status: STATE.FAILED,
                                                                error: err
                                                            };
                                                        });
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    return {
                                                        status: STATE.FAILED,
                                                        error: err
                                                    };
                                                }));
                                            });
                                            return Promise.all(insertPromises).then((responses) => {
                                                var failedResult = _.find(responses, response => response === STATE.FAILED);
                                                if (failedResult) {
                                                    return {
                                                        status: STATE.FAILED
                                                    };
                                                }
                                                const newResultQuery = {
                                                    ConsolidateID: conQtyObj.consolidateID,
                                                    IsDeleted: false
                                                };
                                                return mongodb.collection('FJTMongoQtySupplier').aggregate([{
                                                    $match: newResultQuery
                                                },
                                                {
                                                    $lookup: {
                                                        from: 'AssemblyQtyBreak',
                                                        localField: '_id',
                                                        foreignField: 'qtySupplierID',
                                                        as: 'assemblyQtyBreak'
                                                    }
                                                }
                                                ]).toArray().then((resultQtySupplier) => {
                                                    var details = _.find(resultQtySupplier, data => data.ManufacturerPartNumber === conQtyObj.selectedMpn && data.SourceOfPrice === conQtyObj.selectionMode && data.assemblyQtyBreak.OrderQty === conQtyObj.quoteQty && data.Packaging === conQtyObj.packaging && data.SupplierName && conQtyObj.supplier && data.SupplierName === conQtyObj.supplier);
                                                    if (details) {
                                                        const updateQtyObj = {
                                                            rfqQtySupplierID: details._id.toString()
                                                        };
                                                        return RFQConsolidatedMFGPNLineItemQuantity.update(updateQtyObj, {
                                                            where: {
                                                                id: conQtyObj.id
                                                            },
                                                            fields: ['rfqQtySupplierID']

                                                        }).then(() => ({
                                                            status: STATE.SUCCESS
                                                        })).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return {
                                                                status: STATE.FAILED
                                                            };
                                                        });
                                                    } else {
                                                        return {
                                                            status: STATE.SUCCESS
                                                        };
                                                    }
                                                });
                                            });
                                        } else {
                                            return {
                                                status: STATE.SUCCESS
                                            };
                                        }
                                    }));
                                }
                            });
                        }
                    }
                    return Promise.all(promises).then((responses) => {
                        var failedObj = _.filter(responses, resp => resp.status === STATE.FAILED);
                        if (failedObj.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        } else {
                            return { Status: STATE.SUCCESS };
                        }
                    });
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
    // Clear status of RFQ Assembly
    // GET : /api/v1/rfqlineitems/cancelAPIVerification
    // @param {req} obj
    // @return API response
    // Checked for Re factor
    cancelAPIVerification: (req, res) => {
        const { ComponentBOMSetting } = req.app.locals.models;
        if (req.params && req.params.partID) {
            const bomObj = {
                exteranalAPICallStatus: null,
                updatedBy: COMMON.getRequestUserID(req),
                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return ComponentBOMSetting.update(bomObj, {
                where: {
                    refComponentID: req.params.partID
                },
                fields: ['exteranalAPICallStatus', 'updatedBy', 'updateByRoleId']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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
    // Update RFQ Assy internal version
    // GET : /api/v1/rfqlineitems/updateRFQAssyInternalVersion
    // @param {id} rfqAssyID
    // @return API response
    // Checked for Re factor
    updateRFQAssyInternalVersion: (req, partId, userID, isVerifyBOM) => {
        const { sequelize } = req.app.locals.models;
        // used in componentController also, in case of any change please check there also
        return sequelize.query('CALL Sproc_UpdatePartInternalVersion (:pPartId)', {
            replacements: {
                pPartId: partId
            }
        }).then(response => sequelize.query('CALL Sproc_SaveBOMInternalVersionHistory (:pPartId, :pUserID, :pIsVerify)', {
            replacements: {
                pPartId: partId,
                pUserID: userID,
                pIsVerify: isVerifyBOM || false
            }
        }).then(() => ({
            status: STATE.SUCCESS,
            data: response
        })).catch(err => ({
            status: STATE.FAILED,
            error: err
        }))).catch(err => ({
            status: STATE.FAILED,
            error: err
        }));
    },
    // Download AVL sample
    // GET : /api/v1/rfqlineitems/downloadAVLTemplate
    // @return API response
    // Checked for Re factor
    downloadAVLTemplate: (req, res) => {
        const TemplateName = `${req.params.fileType}.xlsx`;
        var path = GENERICCATEGORY.DOWNLOAD_PATH + TemplateName;

        fs.readFile(path, (err) => {
            if (err) {
                if (err.code === COMMON.FileErrorMessage.NotFound) {
                    resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.DOCUMENT_NOT_FOUND, err: null, data: null });
                } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                    resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                }
            } else {
                const file = path;
                // var mimetype = mime.lookup(file+ "." + "application/vnd.ms-excel");
                res.setHeader('Content-disposition', `attachment; filename=${TemplateName}`);
                res.setHeader('Content-type', 'application/vnd.ms-excel');
                const filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }
        });
    },

    // Download BOM sample
    // GET : /api/v1/rfqlineitems/downloadBOMTemplate
    // @return API response
    // Checked for Re factor
    downloadBOMTemplate: (req, res) => {
        const TemplateName = 'SampleBOMTemplate.xlsx';
        var path = GENERICCATEGORY.DOWNLOAD_PATH + TemplateName;

        fs.readFile(path, (err) => {
            if (err) {
                if (err.code === COMMON.FileErrorMessage.NotFound) {
                    resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.DOCUMENT_NOT_FOUND, err: null, data: null });
                } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                    resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                }
            } else {
                const file = path;
                // var mimetype = mime.lookup(file+ "." + "application/vnd.ms-excel");
                res.setHeader('Content-disposition', `attachment; filename=${TemplateName}`);
                res.setHeader('Content-type', 'application/vnd.ms-excel');
                const filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }
        });
    },
    // Check CPN use in other assembly
    // POST : /api/v1/rfqlineitems/checkCPNExistInOtherBOM
    // @param {req} obj
    // @return API response
    // Checked for Re factor
    checkCPNExistInOtherBOM: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetCPNExistBOMList (:pPartID,:pCPNList)', {
            replacements: {
                pPartID: req.body.pPartID || null,
                pCPNList: req.body.pCPNList || null
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // get CPN  part list
    // POST : /api/v1/rfqlineitems/GetCustPNListFromPN
    // @param {req} obj
    // @return API response
    // Checked for Re factor
    GetCustPNListFromPN: (req, res) => {
        const { sequelize } = req.app.locals.models;
        let cpn = (`${req.body.pCPN}`);
        if (Array.isArray(req.body.pCPN) && req.body.pCPN.length > 0) {
            cpn = (`${req.body.pCPN.join('","')}`);
        }
        sequelize.query('CALL Sproc_GetCustPNListFromPN (:pPartID,:pCPN)', {
            replacements: {
                pPartID: req.body.pPartID || null,
                pCPN: cpn || null
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Retrive list of assembly Drive tools
    // POST : /api/v1/rfqlineitems/getAssyDriveToolsList
    // @return list of assembly drive tools list
    // Checked for Re factor
    getAssyDriveToolsList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.partID) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }
            return sequelize.query('CALL Sproc_GetBOMDriveToolsDetails (:pPartID,:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.page,
                    precordPerPage: filter.limit,
                    pOrderBy: strOrderBy,
                    pWhereClause: strWhere,
                    pPartID: req.body.partID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { assyDriveToolslist: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Update start and Stop activity Deatails
    // POST : /api/v1/rfqlineitems/startStopBOMActivity
    // @return Update start and Stop activity Deatails
    // Checked for Re factor
    startStopBOMActivity: (req, res) => {
        const { ComponentBOMSetting } = req.app.locals.models;
        if (req.body.refTransID) {
            return ComponentBOMSetting.findOne({
                where: {
                    refComponentID: req.body.refTransID
                },
                attributes: ['isActivityStart']
            }).then((response) => {
                if (response && response.isActivityStart !== req.body.isActivityStart) {
                    return RfqAssembliesController.startStopActivity(req, res);
                } else {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RFQ.BOM_ACTIVITY_AL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.isActivityStart ? 'started' : 'stopped');
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
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

    // Update start and Stop activity Deatails
    // POST : /api/v1/rfqlineitems/stopMultipleBOMActivity
    // @return Update Stop activity Deatails
    // Checked for Re factor
    stopMultipleBOMActivity: (req, res) => {
        const { sequelize, ComponentBOMSetting } = req.app.locals.models;
        var loginUserId = COMMON.getRequestUserID(req);
        if (req.body.partIDs) {
            const promises = [];
            _.each(req.body.partIDs, (partobj) => {
                promises.push(
                    ComponentBOMSetting.findOne({
                        where: {
                            refComponentID: partobj
                        },
                        attributes: ['isActivityStart']
                    }).then((response) => {
                        if (response && response.isActivityStart !== req.body.isActivityStart) {
                            return sequelize.query('CALL Sproc_saveStartStopActivity (:pRefTransID,:pUserId,:pIsActivityStart,:pTransactionType,:pActivityType,:pRemark,:pRoleID)', {
                                replacements: {
                                    pRefTransID: partobj,
                                    pUserId: loginUserId,
                                    pIsActivityStart: req.body.isActivityStart,
                                    pTransactionType: DATA_CONSTANT.ActivityTransactionType.BOM,
                                    pActivityType: 'P',
                                    pRemark: null,
                                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                                }
                            }).then((responseResult) => {
                                if (responseResult) {
                                    const data = {
                                        partID: partobj,
                                        loginUserId: loginUserId,
                                        userName: req.user.username,
                                        isActivityStart: req.body.isActivityStart,
                                        activityStartAt: responseResult[0].activityStartAt,
                                        activityStopAt: responseResult[0].activityStopAt
                                    };
                                    RFQSocketController.sendBOMStartStopActivity(req, data);
                                    return {
                                        partID: partobj,
                                        Status: STATE.SUCCESS,
                                        updatedUserID: responseResult[0].updatedUserID,
                                        isActivityStart: req.body.isActivityStart,
                                        activityStartAt: data.activityStartAt,
                                        activityStopAt: data.activityStopAt
                                    };
                                } else {
                                    return {
                                        partID: partobj,
                                        Status: STATE.SUCCESS
                                    };
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    partID: partobj,
                                    error: err,
                                    Status: STATE.FAILED
                                };
                            });
                        } else {
                            return {
                                partID: partobj,
                                Status: STATE.SUCCESS
                            };
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            partID: partobj,
                            error: err,
                            Status: STATE.FAILED
                        };
                    }));
            });

            return Promise.all(promises).then((responses) => {
                var failedResult = _.find(responses, response => response === STATE.FAILED);
                if (failedResult) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                } else {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RFQ.BOM_ACTIVITY);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.isActivityStart ? 'started' : 'stopped');
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responses, messageContent);
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

    // Retrieve BOM/Update Part Master Process progress bar
    // POST : /api/v1/rfqlineitems/retrieveBOMorPMPregressStatus
    // @return list of activity transDetails
    // Checked for Re factor
    retrieveBOMorPMPregressStatus: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetBOMCleanOrUpdatePMProcessPercentage (:pPartID,:ptransactionID,:pType)', {
                replacements: {
                    pPartID: req.body.partID || null,
                    ptransactionID: req.body.transactionID || null,
                    pType: req.body.type || null
                }
            }).then(bomProgress => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, bomProgress, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive BOM Export functionlity
    // GET : /api/v1/rfqlineitems/getBOMExportFile
    // @return BOM Export
    // Checked for Re factor
    getBOMExportFile: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.assyID) {
            const workbook1 = new Excel.Workbook();
            const mfgPN = req.body.mfgPNwithOutSpacialChar ? req.body.mfgPNwithOutSpacialChar.substring(0, 31) : req.body.mfgPNwithOutSpacialChar;
            const sheet1 = workbook1.addWorksheet(mfgPN);
            sheet1.columns = [];
            const columns = [];
            let isPackaging = false;

            // get Packaing Alias Part Details
            if (req.body.format === 4 || req.body.format === 5 || req.body.format === 6) {
                isPackaging = true;
            }
            return sequelize.query('CALL Sproc_GetBOMLineItemsForExport (:pPartID,:pPackaging)', {
                replacements: {
                    pPartID: req.body.assyID,
                    pPackaging: isPackaging
                }
            }).then((bomResult) => {
                if (bomResult && bomResult.length > 0) {
                    req.body.data = _.values(bomResult);
                }
                if (req.body.format === 1 || req.body.format === 4) {
                    _.each(req.body.header, (key) => {
                        if (!key.hidden) {
                            const width = 15;
                            let obj = { header: key.header, key: key.field, width: width, wrapText: true };
                            columns.push(obj);
                            if (key.field === 'mfgPN') {
                                obj = { header: 'PID', key: 'PIDCode', width: width, wrapText: true };
                                columns.push(obj);
                                obj = { header: 'SystemID', key: 'serialNumber', width: width, wrapText: true };
                                columns.push(obj);
                                obj = { header: 'PRODUCTION PN', key: 'productionPN', width: width, wrapText: true };
                                columns.push(obj);
                            }
                        }
                    });
                    sheet1.columns = columns;
                    _.each(req.body.data, (item) => {
                        sheet1.addRow(item);
                    });
                } else if (req.body.format === 2 || req.body.format === 5) {
                    _.each(req.body.header, (key) => {
                        if (!key.hidden) {
                            const width = 15;
                            let obj = { header: key.header, key: key.field, width: width, wrapText: true };
                            columns.push(obj);
                            if (key.field === 'mfgPN') {
                                obj = { header: 'PID', key: 'PIDCode', width: width, wrapText: true };
                                columns.push(obj);
                                obj = { header: 'SystemID', key: 'serialNumber', width: width, wrapText: true };
                                columns.push(obj);
                                obj = { header: 'PRODUCTION PN', key: 'productionPN', width: width, wrapText: true };
                                columns.push(obj);
                            }
                        }
                    });
                    sheet1.columns = columns;
                    const groupbyItem = _.groupBy(req.body.data, 'lineID');
                    _.each(groupbyItem, (data) => {
                        _.each(data, (item, i) => {
                            if (i === 0) {
                                sheet1.addRow(item);
                            } else {
                                item.cust_lineID = '';
                                item.custPN = '';
                                item.customerRev = '';
                                item.level = '';
                                item.uomID = '';
                                item.customerDescription = '';
                                item.qpa = '';
                                item.refDesig = '';
                                item.numOfPosition = '';
                                item.isInstall = '';
                                item.isPurchase = '';
                                item.dnpQty = '';
                                item.dnpDesig = '';
                                item.customerPartDesc = '';
                                item.isBuyDNPQty = '';
                                item.programingStatus = '';
                                item.substitutesAllow = '';
                                item.isNotRequiredKitAllocation = '';
                                item.isSupplierToBuy = '';
                                item.numOfRows = '';
                                sheet1.addRow(item);
                            }
                        });
                    });
                } else if (req.body.format === 3 || req.body.format === 6) {
                    _.each(req.body.header, (key) => {
                        if (!key.hidden) {
                            const width = 15;
                            if (key.field === 'lineID' || key.field === 'cust_lineID' || key.field === 'custPN' || key.field === 'customerRev' ||
                                key.field === 'uomID' || key.field === 'customerDescription' || key.field === 'qpa' || key.field === 'refDesig' ||
                                key.field === 'numOfPosition' || key.field === 'isInstall' || key.field === 'isPurchase' || key.field === 'dnpQty' ||
                                key.field === 'programingStatus' || key.field === 'customerPartDesc' || key.field === 'isBuyDNPQty' || key.field === 'mfgPNDescription' ||
                                key.field === 'dnpDesig' || key.field === 'substitutesAllow' || key.field === 'substitutesAllow' || key.field === 'numOfRows' ||
                                key.field === 'mfgCode' || key.field === 'mfgPN') {
                                let obj = { header: key.header, key: key.field, width: width, wrapText: true };
                                columns.push(obj);
                                if (key.field === 'mfgPN') {
                                    obj = { header: 'PID', key: 'PIDCode', width: width, wrapText: true };
                                    columns.push(obj);
                                    obj = { header: 'SystemID', key: 'serialNumber', width: width, wrapText: true };
                                    columns.push(obj);
                                    obj = { header: 'PRODUCTION PN', key: 'productionPN', width: width, wrapText: true };
                                    columns.push(obj);
                                }
                            }
                        }
                    });
                    const groupbyItem = _.groupBy(_.clone(req.body.data), 'lineID');
                    _.each(groupbyItem, (data) => {
                        _.each(data, (item, i) => {
                            if (i !== 0) {
                                const width = 15;
                                const mfgPNDescriptionColumn = (`mfgPNDescription${i}`);
                                const mfgColumn = (`mfgCode${i}`);
                                const mfgPNColumn = (`mfgPN${i}`);
                                const pidColumn = (`PIDCode${i}`);
                                const serialNumberColumn = (`serialNumber${i}`);
                                const productionPNColumn = (`productionPN${i}`);
                                if (!_.find(columns, { key: mfgPNDescriptionColumn })) {
                                    const obj = { header: 'Internal Descr', key: mfgPNDescriptionColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                }
                                if (!_.find(columns, { key: mfgColumn })) {
                                    const obj = { header: 'MFR', key: mfgColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                }
                                if (!_.find(columns, { key: mfgPNColumn })) {
                                    const obj = { header: 'MPN', key: mfgPNColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                }
                                if (!_.find(columns, { key: pidColumn })) {
                                    const obj = { header: 'PID', key: pidColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                }
                                if (!_.find(columns, { key: serialNumberColumn })) {
                                    const obj = { header: 'SystemID', key: serialNumberColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                }
                                if (!_.find(columns, { key: productionPNColumn })) {
                                    const obj = { header: 'PRODUCTION PN', key: productionPNColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                }
                            }
                        });
                    });
                    sheet1.columns = columns;
                    _.each(groupbyItem, (data) => {
                        let row = {};
                        _.each(data, (item, i) => {
                            if (i === 0) {
                                row = item;
                            } else {
                                const mfgPNDescriptionColumn = (`mfgPNDescription${i}`);
                                const mfgColumn = (`mfgCode${i}`);
                                const mfgPNColumn = (`mfgPN${i}`);
                                const pidColumn = (`PIDCode${i}`);
                                const serialNumberColumn = (`serialNumber${i}`);
                                const productionPNColumn = (`productionPN${i}`);
                                row[mfgPNDescriptionColumn] = item.mfgPNDescription;
                                row[mfgColumn] = item.mfgCode;
                                row[mfgPNColumn] = item.mfgPN;
                                row[pidColumn] = item.PIDCode;
                                row[serialNumberColumn] = item.serialNumber;
                                row[productionPNColumn] = item.productionPN;
                            }
                        });
                        sheet1.addRow(row);
                    });
                }
                if (isPackaging) {
                    let currentLineID = null;
                    sheet1.eachRow((row, rowNumber) => {
                        if (rowNumber > 1) {
                            row.eachCell((cell, colNumber) => {
                                // eslint-disable-next-line no-underscore-dangle
                                if (cell.value && cell._column._key === 'lineID') {
                                    currentLineID = cell.value;
                                }
                                if (cell.value && cell._column._key.includes('mfgPN') && currentLineID) {
                                    const packagingPart = _.find(req.body.data, { lineID: currentLineID, mfgPN: cell.value, isBomLine: 0 });
                                    if (packagingPart) {
                                        row.getCell(colNumber).font = { color: { argb: '004e47cc' } };
                                    }
                                }
                            });
                        }
                    });
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
    },
    // // Retrive BOM Export functionlity with stock
    // // GET : /api/v1/rfqlineitems/getBOMExportWithStockFile
    // // @return BOM Export
    // // Checked for Re factor
    // getBOMExportWithStockFile: (req, res) => {
    //    const { sequelize } = req.app.locals.models;
    //    if (req.body.assyID) {
    //        const workbook1 = new Excel.Workbook();
    //        const sheet1 = workbook1.addWorksheet(req.body.mfgPN);
    //        sheet1.columns = [];
    //        const columns = [];
    //        let isPackaging = false;
    //        let isCustomerApproved = false;

    //        // get Packaing Alias Part Details
    //        // DATA_CONSTANT.BOMExportWithStockName.format4.ID
    //        if (req.body.format === DATA_CONSTANT.BOMExportWithStockName.format1.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format3.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format5.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format7.ID) {
    //            isPackaging = true;
    //        }
    //        if (req.body.format === DATA_CONSTANT.BOMExportWithStockName.format2.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format4.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format6.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format7.ID) {
    //            isPackaging = false;
    //        }
    //        if (req.body.format === DATA_CONSTANT.BOMExportWithStockName.format1.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format2.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format5.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format6.ID) {
    //            isCustomerApproved = true;
    //        }
    //        if (req.body.format === DATA_CONSTANT.BOMExportWithStockName.format3.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format4.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format7.ID
    //            || req.body.format === DATA_CONSTANT.BOMExportWithStockName.format8.ID) {
    //            isCustomerApproved = false;
    //        }
    //        return sequelize.query('CALL Sproc_GetBOMExportwithStockDetail (:pPartID,:pIsCustomerApproved,:pWithPackagingAlias,:pCustomerId)', {
    //            replacements: {
    //                pPartID: req.body.assyID,
    //                pIsCustomerApproved: isCustomerApproved,
    //                pWithPackagingAlias: isPackaging,
    //                pCustomerId: req.body.customerID
    //            }
    //        }).then((bomResult) => {
    //            if (bomResult && bomResult.length > 0) {
    //                req.body.data = _.values(bomResult);
    //            }
    //            if (req.body.format === DATA_CONSTANT.BOMExportWithStockName.format1.ID ||
    //                req.body.format === DATA_CONSTANT.BOMExportWithStockName.format2.ID ||
    //                req.body.format === DATA_CONSTANT.BOMExportWithStockName.format3.ID ||
    //                req.body.format === DATA_CONSTANT.BOMExportWithStockName.format4.ID) {
    //                _.each(req.body.header, (key) => {
    //                    if (!key.hidden) {
    //                        const width = 15;
    //                        let obj = { header: key.header, key: key.field, width: width, wrapText: true };
    //                        columns.push(obj);
    //                        if (key.field === 'mfgPN') {
    //                            obj = { header: 'PID', key: 'PIDCode', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'PRODUCTION PN', key: 'productionPN', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'SystemID', key: 'serialNumber', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'Package/Case(Shape) Type', key: 'package', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'Divice Marking', key: 'deviceMarking', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'Internal Stock', key: 'internalStock', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'Customer Stock', key: 'customerStock', width: width, wrapText: true };
    //                            columns.push(obj);
    //                        }
    //                    }
    //                });

    //            } else if (req.body.format === DATA_CONSTANT.BOMExportWithStockName.format5.ID ||
    //                req.body.format === DATA_CONSTANT.BOMExportWithStockName.format6.ID ||
    //                req.body.format === DATA_CONSTANT.BOMExportWithStockName.format7.ID ||
    //                req.body.format === DATA_CONSTANT.BOMExportWithStockName.format8.ID) {

    //            }
    //            if (req.body.format === 1 || req.body.format === 4) {
    //                _.each(req.body.header, (key) => {
    //                    if (!key.hidden) {
    //                        const width = 15;
    //                        let obj = { header: key.header, key: key.field, width: width, wrapText: true };
    //                        columns.push(obj);
    //                        if (key.field === 'mfgPN') {
    //                            obj = { header: 'PID', key: 'PIDCode', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'PRODUCTION PN', key: 'productionPN', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'SystemID', key: 'serialNumber', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'Package/Case(Shape) Type', key: 'package', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'Divice Marking', key: 'deviceMarking', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'Internal Stock', key: 'internalStock', width: width, wrapText: true };
    //                            columns.push(obj);
    //                            obj = { header: 'Customer Stock', key: 'customerStock', width: width, wrapText: true };
    //                            columns.push(obj);
    //                        }
    //                    }
    //                });
    //                sheet1.columns = columns;
    //                _.each(req.body.data, (item) => {
    //                    sheet1.addRow(item);
    //                });
    //            } else if (req.body.format === DATA_CONSTANT.BOMExportWithStockName.format5.ID ||
    //                req.body.format === DATA_CONSTANT.BOMExportWithStockName.format6.ID ||
    //                req.body.format === DATA_CONSTANT.BOMExportWithStockName.format7.ID ||
    //                req.body.format === DATA_CONSTANT.BOMExportWithStockName.format8.ID
    //            ) {
    //                _.each(req.body.header, (key) => {
    //                    if (!key.hidden) {
    //                        const width = 15;
    //                        if (key.field === 'lineID' || key.field === 'cust_lineID' || key.field === 'custPN' || key.field === 'customerRev' ||
    //                            key.field === 'uomID' || key.field === 'customerDescription' || key.field === 'qpa' || key.field === 'refDesig' ||
    //                            key.field === 'numOfPosition' || key.field === 'isInstall' || key.field === 'isPurchase' || key.field === 'dnpQty' ||
    //                            key.field === 'programingStatus' || key.field === 'customerPartDesc' || key.field === 'isBuyDNPQty' || key.field === 'mfgPNDescription' ||
    //                            key.field === 'dnpDesig' || key.field === 'substitutesAllow' || key.field === 'substitutesAllow' || key.field === 'numOfRows' ||
    //                            key.field === 'mfgCode' || key.field === 'mfgPN') {
    //                            let obj = { header: key.header, key: key.field, width: width, wrapText: true };
    //                            columns.push(obj);
    //                            if (key.field === 'mfgPN') {
    //                                obj = { header: 'PID', key: 'PIDCode', width: width, wrapText: true };
    //                                columns.push(obj);
    //                                obj = { header: 'PRODUCTION PN', key: 'productionPN', width: width, wrapText: true };
    //                                columns.push(obj);
    //                                obj = { header: 'SystemID', key: 'serialNumber', width: width, wrapText: true };
    //                                columns.push(obj);
    //                                obj = { header: 'Package/Case(Shape) Type', key: 'package', width: width, wrapText: true };
    //                                columns.push(obj);
    //                                obj = { header: 'Divice Marking', key: 'deviceMarking', width: width, wrapText: true };
    //                                columns.push(obj);
    //                                obj = { header: 'Internal Stock', key: 'internalStock', width: width, wrapText: true };
    //                                columns.push(obj);
    //                                obj = { header: 'Customer Stock', key: 'customerStock', width: width, wrapText: true };
    //                                columns.push(obj);

    //                            }
    //                        }
    //                    }
    //                });
    //                const groupbyItem = _.groupBy(_.clone(req.body.data), 'lineID');
    //                _.each(groupbyItem, (data) => {
    //                    _.each(data, (item, i) => {
    //                        if (i !== 0) {
    //                            const width = 15;
    //                            const mfgPNDescriptionColumn = (`mfgPNDescription${i}`);
    //                            const mfgColumn = (`mfgCode${i}`);
    //                            const mfgPNColumn = (`mfgPN${i}`);
    //                            const pidColumn = (`PIDCode${i}`);
    //                            const serialNumberColumn = (`serialNumber${i}`);
    //                            const productionPNColumn = (`productionPN${i}`);
    //                            const packageColumn = (`package${i}`);
    //                            const deviceMarkingColumn = (`deviceMarking${i}`);
    //                            const internalStockColumn = (`internalStock${i}`);
    //                            const customerStockColumn = (`customerStock${i}`);
    //                            if (!_.find(columns, { key: mfgColumn })) {
    //                                const obj = { header: 'MFR', key: mfgColumn, width: width, wrapText: true };
    //                                columns.push(obj);
    //                            }
    //                            if (!_.find(columns, { key: mfgPNColumn })) {
    //                                const obj = { header: 'MPN', key: mfgPNColumn, width: width, wrapText: true };
    //                                columns.push(obj);
    //                            }
    //                            if (!_.find(columns, { key: pidColumn })) {
    //                                const obj = { header: 'PID', key: pidColumn, width: width, wrapText: true };
    //                                columns.push(obj);
    //                            }
    //                            if (!_.find(columns, { key: productionPNColumn })) {
    //                                const obj = { header: 'PRODUCTION PN', key: productionPNColumn, width: width, wrapText: true };
    //                                columns.push(obj);
    //                            }
    //                            if (!_.find(columns, { key: serialNumberColumn })) {
    //                                const obj = { header: 'SystemID', key: serialNumberColumn, width: width, wrapText: true };
    //                                columns.push(obj);
    //                            }

    //                            if (!_.find(columns, { key: packageColumn })) {
    //                                const obj = { header: 'Package/Case(Shape) Type', key: packageColumn, width: width, wrapText: true };
    //                                columns.push(obj);
    //                            }

    //                            if (!_.find(columns, { key: deviceMarkingColumn })) {
    //                                const obj = { header: 'Divice Marking', key: deviceMarkingColumn, width: width, wrapText: true };
    //                                columns.push(obj);
    //                            }

    //                            if (!_.find(columns, { key: internalStockColumn })) {
    //                                const obj = { header: 'Internal Stock', key: internalStockColumn, width: width, wrapText: true };
    //                                columns.push(obj);
    //                            }

    //                            if (!_.find(columns, { key: customerStockColumn })) {
    //                                const obj = { header: 'Customer Stock', key: customerStockColumn, width: width, wrapText: true };
    //                                columns.push(obj);
    //                            }
    //                        }
    //                    });
    //                });
    //                sheet1.columns = columns;
    //                _.each(groupbyItem, (data) => {
    //                    let row = {};
    //                    _.each(data, (item, i) => {
    //                        if (i === 0) {
    //                            row = item;
    //                        } else {
    //                            const mfgPNDescriptionColumn = (`mfgPNDescription${i}`);
    //                            const mfgColumn = (`mfgCode${i}`);
    //                            const mfgPNColumn = (`mfgPN${i}`);
    //                            const pidColumn = (`PIDCode${i}`);
    //                            const serialNumberColumn = (`serialNumber${i}`);
    //                            const productionPNColumn = (`productionPN${i}`);
    //                            const packageColumn = (`package${i}`);
    //                            const deviceMarkingColumn = (`deviceMarking${i}`);
    //                            const internalStockColumn = (`internalStock${i}`);
    //                            const customerStockColumn = (`customerStock${i}`);
    //                            row[mfgPNDescriptionColumn] = item.mfgPNDescription;
    //                            row[mfgColumn] = item.mfgCode;
    //                            row[mfgPNColumn] = item.mfgPN;
    //                            row[pidColumn] = item.PIDCode;
    //                            row[serialNumberColumn] = item.serialNumber;
    //                            row[productionPNColumn] = item.productionPN;
    //                            row[packageColumn] = item.package;
    //                            row[deviceMarkingColumn] = item.deviceMarking;
    //                            row[internalStockColumn] = item.internalStock;
    //                            row[customerStockColumn] = item.customerStock;
    //                        }
    //                    });
    //                    sheet1.addRow(row);
    //                });
    //            }
    //            if (isPackaging) {
    //                let currentLineID = null;
    //                sheet1.eachRow((row, rowNumber) => {
    //                    if (rowNumber > 1) {
    //                        row.eachCell((cell, colNumber) => {
    //                            // eslint-disable-next-line no-underscore-dangle
    //                            if (cell.value && cell._column._key === 'lineID') {
    //                                currentLineID = cell.value;
    //                            }
    //                            if (cell.value && cell._column._key.includes('mfgPN') && currentLineID) {
    //                                const packagingPart = _.find(req.body.data, { lineID: currentLineID, mfgPN: cell.value, isBomLine: 0 });
    //                                if (packagingPart) {
    //                                    row.getCell(colNumber).font = { color: { argb: '004e47cc' } };
    //                                }
    //                            }
    //                        });
    //                    }
    //                });
    //            }


    //            const path = DATA_CONSTANT.GENERICCATEGORY.UPLOAD_PATH;
    //            mkdirp(path, () => { });
    //            const filename = req.body.filename;
    //            res.setHeader('Content-Type', 'application/vnd.ms-excel');
    //            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    //            return workbook1.xlsx.writeFile(path + filename).then(() => {
    //                // let file = path + entity + ".xls";
    //                res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    //                res.setHeader('Content-type', 'application/vnd.ms-excel');
    //                const filestream = fs.createReadStream(path + filename);
    //                fs.unlink(path + filename, () => { });
    //                filestream.pipe(res);
    //            });
    //        }).catch((err) => {
    //            console.trace();
    //            console.error(err);
    //            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //        });
    //    } else {
    //        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //    }
    // },
    // get lineitem Ref desg for part and program
    // GET : /api/v1/rfqlineitems/getPartRefDesgMapping
    // @param {req} obj
    // @return API response
    // Checked for Re factor
    getPartRefDesgMapping: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.partID) {
            return sequelize.query('CALL Sproc_GetPartProgrammingRefDesgDetail (:pPartID)', {
                replacements: {
                    pPartID: req.params.partID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { partRefDesg: _.values(response[0]), programRefDesg: _.values(response[1]) }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // get part program mapping detail
    // GET : /api/v1/rfqlineitems/getPartProgrammMappingDetail
    // @param {req} obj
    // @return API response
    // Checked for Re factor
    getPartProgramMappingDetail: (req, res) => {
        const { RFQLineItemsProgrammingMapping } = req.app.locals.models;
        if (req.params.partID) {
            return RFQLineItemsProgrammingMapping.findAll({
                where: {
                    partID: req.params.partID
                },
                fields: ['id', 'partID', 'rfqLineItemID', 'softwareRFQLineItemID', 'partRefDesg', 'softwareRefDesg']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Save part program mapping detail
    // GET : /api/v1/rfqlineitems/savePartProgrammMappingDetail
    // @param {req} obj
    // @return API response
    // Checked for Re factor
    savePartProgramMappingDetail: (req, res) => {
        const { RFQLineItemsProgrammingMapping, sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_UpdatePartInternalVersion (:pPartId)', {
                replacements: {
                    pPartId: req.body.partID
                },
                transaction: t
            }).then(() => {
                const promises = [];
                if (req.body.updatedPartProgrammingMapping.length > 0) {
                    COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.updatedPartProgrammingMapping);
                    _.each(req.body.updatedPartProgrammingMapping, (updateObj) => {
                        promises.push(
                            RFQLineItemsProgrammingMapping.update(updateObj, {
                                where: {
                                    partID: req.body.partID,
                                    id: updateObj.id
                                },
                                fields: ['rfqLineItemID', 'softwareRFQLineItemID', 'partRefDesg', 'softwareRefDesg', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                                transaction: t
                            })
                        );
                    });
                }
                if (req.body.deletedPartProgrammingMapping.length > 0) {
                    const Ids = _.map(req.body.deletedPartProgrammingMapping, 'id');
                    promises.push(RFQLineItemsProgrammingMapping.update(
                        { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) },
                        {
                            where: {
                                partID: req.body.partID,
                                id: Ids
                            },
                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                            transaction: t
                        }));
                }
                if (req.body.newPartProgrammingMapping.length > 0) {
                    COMMON.setModelCreatedArrayFieldValue(req.user, req.body.newPartProgrammingMapping);
                    promises.push(RFQLineItemsProgrammingMapping.bulkCreate(req.body.newPartProgrammingMapping, {
                        fields: ['id', 'partID', 'rfqLineItemID', 'softwareRFQLineItemID', 'partRefDesg', 'softwareRefDesg', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'createByRoleId', 'updateByRoleId'],
                        transaction: t
                    }));
                }

                return Promise.all(promises).then((response) => {
                    t.commit();
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                }).catch((err) => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                if (!t.finished) {
                    t.rollback();
                }
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
    // Get Component PN ID by PN name
    // @param {req} obj
    // @param {pnArr} array
    // @param {mfgType} string
    // @return list of MFG ID
    // Checked for Re factor
    getProgramMappingVarification: (req, pPartID) => {
        const { RFQLineItemsProgrammingMapping } = req.app.locals.models;
        return RFQLineItemsProgrammingMapping.findAll({
            where: {
                partID: pPartID
            },
            fields: ['id', 'partID', 'rfqLineItemID', 'softwareRFQLineItemID', 'partRefDesg', 'softwareRefDesg']
        }).then(response => ({
            status: STATE.SUCCESS,
            data: response
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },
    // update readyForPricing for Assy
    updateReadyForPricingAssy: (req, res) => {
        const { RFQAssemblies } = req.app.locals.models;
        if (req.body) {
            RFQAssemblies.update({ isReadyForPricing: req.body.isReadyForPricing }, {
                where: {
                    id: req.body.id
                },
                fields: ['isReadyForPricing']
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};