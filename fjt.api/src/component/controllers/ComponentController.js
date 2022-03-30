var Excel = require('exceljs');
Excel.config.setValue('promise', require('bluebird'));
const mkdirp = require('mkdirp');
const fsextra = require('fs-extra');
const uuidv1 = require('uuid/v1');
const resHandler = require('../../resHandler');
const moment = require('moment');
const fs = require('fs');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const _ = require('lodash');
const Bson = require('bson');
const {
    Op, Sequelize
} = require('sequelize');

const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const UTILITY_CONTROLLER = require('../../utility/controllers/UtilityController');
const PricingController = require('../../pricing/controllers/PricingController.js');
const { Promise } = require('bluebird');
const { stringFormat } = require('../../constant/Common');

const componentOtherPartNameModuleName = DATA_CONSTANT.COMPONENT_OTHER_PART_NAME.NAME;
const componentfunctionalTestingPartNameModuleName = DATA_CONSTANT.COMPONENT_FUNCTIONAL_TESTING_PART_NAME.Name;
const componentMountingTypePartNameModuleName = DATA_CONSTANT.COMPONENT_MOUNTING_TYPE_PART_NAME.Name;
const componentfunctionalTypePartNameModuleName = DATA_CONSTANT.COMPONENT_FUNCTIONAL_TYPE_PART_NAME.Name;
const componentImagesName = DATA_CONSTANT.COMPONENT_IMAGES_NAME.Name;
const Pricing = DATA_CONSTANT.PRICING;
const ErrorType = DATA_CONSTANT.COMPONENT_ERROR_TYPE;
const ApprovedSuppliermoduleName = DATA_CONSTANT.APPROVED_SUPPLIER_PRIORITY.Name;
const componentOddlyNamedRefDesModuleName = DATA_CONSTANT.COMPONENT_ODDLY_NAMED_REFDES_NAME.Name;

const productionPNFieldName = 'productionPN';
const inputFields = [
    'id',
    'PIDCode',
    'imageURL',
    'mfgPN',
    'mfgcodeID',
    'mfgPNDescription',
    'packageQty',
    'partStatus',
    'partStatusText',
    'ltbDate',
    'RoHSStatusID',
    'isGoodPart',
    'packaginggroupID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'leadTime',
    'packaging',
    'noOfPosition',
    'noOfPositionText',
    'countryOfOrigin',
    'uomClassID',
    'uom',
    'partPackage',
    'partPackageID',
    'deviceMarking',
    'minimum',
    'mult',
    'htsCode',
    'category',
    'rohsText',
    'uomText',
    'dataSheetLink',
    'replacementPartID',
    'eolDate',
    'value',
    'tolerance',
    'minOperatingTemp',
    'maxOperatingTemp',
    'functionalCategoryID',
    'weight',
    'length',
    'width',
    'height',
    'saftyStock',
    'specialNote',
    'mountingTypeID',
    'isPIDManual',
    'mountingTypeText',
    'feature',
    'maxPriceLimit',
    'selfLifeDays',
    'shelfListDaysThresholdPercentage',
    'isCustom',
    'rev',
    'mslID',
    'connecterTypeID',
    'costCategoryID',
    'rfqOnly',
    'nickName',
    'scrapValuePerBuild',
    'scrapRatePercentagePerBuild',
    'plannedValuePerBuild',
    'plannedOverRunPercentagePerBuild',
    'maxQtyonHand',
    'bomLock',
    'restrictUSEwithpermission',
    'restrictUsePermanently',
    'operatingTemp',
    'noOfRows',
    'noOfRowsText',
    'pitch',
    'pitchMating',
    'sizeDimension',
    'heightText',
    'voltage',
    'powerRating',
    'functionalCategoryText',
    'connectorTypeText',
    'customerID',
    'eau',
    'pcbPerArray',
    'temperatureCoefficient',
    'temperatureCoefficientUnit',
    'temperatureCoefficientValue',
    'assyCode',
    'isCPN',
    'matingPartRquired',
    'driverToolRequired',
    'pickupPadRequired',
    'programingRequired',
    'functionalTestingRequired',
    'custAssyPN',
    'partType',
    'color',
    'refSupplierMfgpnComponentID',
    'businessRisk',
    'liveVersion',
    'packagingID',
    'unit',
    'grossWeight',
    'packagingWeight',
    'isCloudApiUpdateAttribute',
    'epicorType',
    'grossWeightUom',
    'packagingWeightUom',
    'rohsDeviation',
    'alertExpiryDays',
    'umidVerificationRequire',
    'isAutoVerificationOfAllAssemblyParts',
    'totalSolderPoints',
    'trackSerialNumber',
    'price',
    'restrictPackagingUsePermanently',
    'restrictPackagingUseWithpermission',
    'reversalDate',
    'serialNumber',
    'systemGenerated',
    'purchasingComment',
    'isReversal',
    'requiredTestTime',
    'predictedObsolescenceYear',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'detailDescription',
    'obsoleteDate',
    'assemblyType',
    'refMfgPNMfgCodeId',
    'productionPN',
    'frequency',
    'isWaterSoluble',
    'isNoClean',
    'mfrNameText',
    'isFluxNotApplicable',
    'isHazmatMaterial',
    'salesacctId',
    'purchaseacctId',
    'umidSPQ',
    'internalReference',
    'shelfLifeAcceptanceDays',
    'quoteValidTillDate',
    'maxShelfLifeAcceptanceDays',
    'maxShelfListDaysThresholdPercentage',
    'shelfLifeDateType',
    'frequencyType',
    'mfgType',
    'isReceiveBulkItem',
    'isEpoxyMount',
    'dateCodeFormatID',
    'isDateCodeFormat'
];
const inputFieldsImages = [
    'id',
    'imageURL',
    'refComponentID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const inputFieldsDataSheetUrl = [
    'datasheetURL',
    'refComponentID',
    'datasheetName',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const inputFieldsUpdateDefaultImage = [
    'imageURL',
    'updatedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const componentApprovedSupplierInputFields = [
    'id',
    'partID',
    'supplierID',
    'priority',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'status'
];
const inputFieldsOddelyRefDes = [
    'id',
    'refDes',
    'refComponentID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const componentModuleName = DATA_CONSTANT.COMPONENT.Name;
const componentTemperatureSensitiveDataModuleName = DATA_CONSTANT.COMPONENT_TEMPERATURE_SENSITIVE_DATA_NAME.Name;
const acceptableShippingCountryModuleName = DATA_CONSTANT.COMPONENT_ACCEPTABLE_SHIPPING_COUNTRIES.Name;

module.exports = {
    // Get Component By Id
    // GET : /api/v1/component/retrieveComponent
    // @param {id} int
    // @return Component
    retrieveComponent: (req, res) => {
        const {
            Component,
            MfgCodeMst,
            ComponentStandardDetails,
            CertificateStandards,
            StandardClass,
            ComponentImages,
            ComponentDataSheets,
            RFQPartCategory,
            RFQRoHS,
            RFQPartType,
            RFQPackageCaseType,
            ComponentPackagingMst,
            RFQAssyTypeMst,
            RFQConnecterType,
            RFQMountingType,
            User,
            ComponenetInspectionRequirementDet,
            VUSubAssemblyCount,
            ComponentLastExternalAPICall,
            VUComponent
        } = req.app.locals.models;
        if (req.params.id) {
            return VUComponent.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                model: VUComponent,
                attributes: ['id', 'imageURL', 'PIDCode', 'mfgPN', 'mfgcodeID', 'mfgPNDescription', 'packageQty', 'partStatus',
                    'ltbDate', 'RoHSStatusID', 'packaginggroupID', 'isGoodPart', 'leadTime',
                    'packaging', 'noOfPosition', 'noOfPositionText', 'countryOfOrigin', 'uomClassID', 'uom', 'partPackage',
                    'deviceMarking', 'minimum', 'mult', 'htsCode', 'category', 'rohsText', 'uomText', 'dataSheetLink', 'replacementPartID', 'eolDate', 'value',
                    'tolerance', 'minOperatingTemp', 'maxOperatingTemp', 'functionalCategoryID', 'weight', 'length', 'width', 'height',
                    'saftyStock', 'specialNote', 'partStatusText', 'mountingTypeID',
                    'mountingTypeText', 'feature', 'maxPriceLimit', 'selfLifeDays', 'rev', 'isCustom',
                    'mslID', 'connecterTypeID', 'connectorTypeText', 'costCategoryID', 'rfqOnly', 'nickName',
                    'scrapValuePerBuild', 'scrapRatePercentagePerBuild', 'plannedValuePerBuild', 'plannedOverRunPercentagePerBuild',
                    'maxQtyonHand', 'bomLock', 'restrictUSEwithpermission', 'restrictUsePermanently', 'operatingTemp', 'noOfRows', 'noOfRowsText',
                    'pitch', 'pitchMating', 'sizeDimension', 'heightText', 'voltage', 'powerRating', 'functionalCategoryText',
                    'functionalCategoryID', 'eau', 'pcbPerArray', 'temperatureCoefficient', 'temperatureCoefficientUnit', 'temperatureCoefficientValue',
                    'assyCode', 'isCPN', 'matingPartRquired', 'driverToolRequired', 'pickupPadRequired', 'programingRequired', 'functionalTestingRequired', 'custAssyPN',
                    'partType', 'functionalTypePartRequired', 'mountingTypePartRequired', 'shelfListDaysThresholdPercentage', 'color', 'refSupplierMfgpnComponentID',
                    'businessRisk', 'liveVersion', 'isTemperatureSensitive', 'unit', 'grossWeight', 'packagingWeight', 'createdBy', 'isCloudApiUpdateAttribute', 'epicorType',
                    'packagingID', 'grossWeightUom', 'packagingWeightUom', 'rohsDeviation', 'alertExpiryDays', 'umidVerificationRequire', 'isAutoVerificationOfAllAssemblyParts',
                    'totalSolderPoints', 'trackSerialNumber', 'price', 'restrictPackagingUsePermanently', 'restrictPackagingUseWithpermission', 'reversalDate', 'serialNumber',
                    'purchasingComment', 'requiredTestTime', 'predictedObsolescenceYear', 'partPackageID', 'detailDescription', 'isActivityStart', 'activityStartAt', 'documentPath',
                    'obsoleteDate', 'assemblyType', 'refMfgPNMfgCodeId', 'productionPN', 'frequency', 'isWaterSoluble', 'isNoClean', 'mfrNameText', 'isFluxNotApplicable', 'isHazmatMaterial', 'rfqNumber', 'purchaseacctId', 'salesacctId'
                    , 'umidSPQ', 'internalReference', 'shelfLifeAcceptanceDays', 'maxShelfLifeAcceptanceDays', 'maxShelfListDaysThresholdPercentage', 'quoteValidTillDate', 'shelfLifeDateType'
                    , 'mfgType', 'frequencyType', 'isReceiveBulkItem', 'isEpoxyMount', 'systemGenerated', 'dateCodeFormatID', 'isDateCodeFormat'
                ],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['mfgCode', 'id', 'mfgType', 'mfgName'],
                    required: false
                },
                {
                    model: ComponentLastExternalAPICall,
                    as: 'componentLastExternalAPICall',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['updatedAtApi', 'supplierID'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'supplierMaster',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['mfgCode', 'id', 'mfgType', 'mfgName'],
                        required: false
                    }]
                },
                {
                    model: Component,
                    as: 'refSupplierMfgComponent',
                    attributes: ['mfgPN', 'mfgcodeID', 'id'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgCode', 'mfgName', 'acquisitionDetail'],
                        where: {
                            mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG
                        },
                        required: false
                    }]
                },
                {
                    model: ComponentStandardDetails,
                    as: 'componetStandardDetail',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['certificateStandardID', 'id', 'ClassID'],
                    required: false,
                    include: [{
                        model: CertificateStandards,
                        as: 'certificateStandard',
                        order: [
                            ['displayOrder', 'ASC']
                        ],
                        attributes: ['certificateStandardID', 'fullName', 'displayOrder', 'isActive', 'priority', 'isExportControlled']
                    },
                    {
                        model: StandardClass,
                        as: 'Standardclass',
                        attributes: ['certificateStandardID', 'classID', 'className', 'colorCode', 'displayOrder'],
                        required: false
                    }
                    ]
                },
                {
                    model: Component,
                    as: 'replacementComponent',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgPN', 'mfgcodeID'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['mfgCode', 'id', 'mfgType'],
                        required: false
                    }]
                },
                {
                    model: ComponentImages,
                    as: 'component_images',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'imageURL', 'refComponentID', 'isDeleted'],
                    required: false
                },
                {
                    model: ComponentDataSheets,
                    as: 'component_datasheets',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'datasheetURL', 'refComponentID', 'isDeleted', 'datasheetName'],
                    required: false
                },
                {
                    model: RFQPartCategory,
                    as: 'rfq_partcategory',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'categoryName', 'partCategory', 'epicorType'],
                    required: false
                },
                {
                    model: RFQRoHS,
                    as: 'rfq_rohsmst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'name', 'rohsIcon', 'refMainCategoryID'],
                    required: false
                },
                {
                    model: RFQPartType,
                    as: 'rfqPartType',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'partTypeName', 'isTemperatureSensitive'],
                    required: false
                },
                {
                    model: RFQPackageCaseType,
                    as: 'rfq_packagecasetypemst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'name'],
                    required: false
                },
                {
                    model: ComponentPackagingMst,
                    as: 'component_packagingmst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'name'],
                    required: false
                },
                {
                    model: RFQAssyTypeMst,
                    as: 'rfq_assy_typemst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'name'],
                    required: false
                },
                {
                    model: User,
                    as: 'user',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['firstName', 'lastName'],
                    required: false
                },
                {
                    model: ComponenetInspectionRequirementDet,
                    as: 'componenet_inspection_requirement_det',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'inspectionRequirementId'],
                    required: false
                },
                {
                    model: RFQConnecterType,
                    as: 'rfqConnecterType',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'name'],
                    required: false
                },
                {
                    model: RFQMountingType,
                    as: 'rfqMountingType',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'name'],
                    required: false
                },
                {
                    model: VUSubAssemblyCount,
                    as: 'vuSubAssemblyCount',
                    attributes: ['partID', 'subAssemblyCount'],
                    required: false
                }
                ]
            }).then((component) => {
                if (!component) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                        err: null,
                        data: null
                    });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, component, null);
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

    // Get List of Components
    // POST : /api/v1/component/retrieveComponentList
    // @return List of Components
    retrieveComponentList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var srtWhereMfgPn = '';
        var strWhere = '';
        var dataObject = '';
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            if (filter.where.mfgPN) {
                srtWhereMfgPn = COMMON.stringFormat('(`{0}` like \'{1}\'', 'mfgPN', filter.where.mfgPN['$like'].replace(/'/g, '\'\''));
                srtWhereMfgPn += COMMON.stringFormat(' OR exists (select 1 from component_otherpn opn where opn.refcomponentid = c.id and opn.name like \'{0}\' ))', filter.where.mfgPN['$like'].replace(/'/g, '\'\''));
                delete filter.where.mfgPN;
            }
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (srtWhereMfgPn !== '') {
                strWhere = strWhere + (strWhere === '' ? '' : ' AND ') + srtWhereMfgPn;
            }
            if (strWhere === '') {
                strWhere = null;
            }

            // Save part list search pattern
            req.body.order = filter.strOrderBy;
            req.body.where = filter.strWhere;
            module.exports.savePartListSearchPatternFollowedByUser(req, res);

            return sequelize
                .query('CALL Sproc_GetComponentList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pIsMFG,:pMfgCodeIDs,:pMfgCodeIdsForSupplierParts,:pPackagingIDs,:pPackageIDs,:pPartStatusIDs,:pMountingTypeIDs,:pExternalMountingTypeValues,:pFunctionalTypeIDs,:pExternalFunctionalTypeValues,:pAttributesSearchHeader,:pAttributesSearch,:pPackagingAlias,:pAlternatePart,:pRoHSAlternatePart,:pPartUsedInAssembly,:pMultiplePartNumbers,:pStockQuantity,:pPartTypeIDs,:pCertificateStandardsIds,:pStandardsClassIds,:pAssemblyIds,:pAssemblyTypeIds,:pRohsIds,:pExternalRoHSStatusListValues,:pOperationalAttributeIds,:pAcceptableShippingCountryIds,:pComponentOrdering,:pComponentUsageCriteria,:pIsRefreshMasterFilters,:pFromDate,:pToDate,:pIsReversal,:pIsCPN,:pIsCustom,:pIsBOMActivityStarted,:pIsEcoDfmColumnVisible,:pIsSearchFromHeader,:pIsExportControl,:pObsoleteDate,:pIsOperatingTemperatureBlank,:pFromCreatedOnDate,:pToCreatedOnDate,:pIsIdenticalMfrPN,:pIsProductionPNEmpty,:pDisapprovedSupplierIds,:pIsExcludeIncorrectPart,:pMultiplePartFilterFieldName,:pMultiplePartByUploadFileDetail,:pIsRestrictUSEwithpermission,:pIsRestrictPackagingUseWithpermission,:pIsRestrictUsePermanently,:pIsRestrictPackagingUsePermanently )', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: req.body.isExport ? null : filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pIsMFG: req.body.isMFG ? true : false,
                        pMfgCodeIDs: req.body.mfgCodeIds ? req.body.mfgCodeIds : null,
                        pMfgCodeIdsForSupplierParts: req.body.mfgCodeIdsForSupplierParts ? req.body.mfgCodeIdsForSupplierParts : null,
                        pPackagingIDs: req.body.packagingIds ? req.body.packagingIds : null,
                        pPackageIDs: req.body.packageIds ? req.body.packageIds : null,
                        pPartStatusIDs: req.body.partStatusIds ? req.body.partStatusIds : null,
                        pMountingTypeIDs: req.body.mountingTypeIds ? req.body.mountingTypeIds : null,
                        pExternalMountingTypeValues: req.body.externalMountingTypeValues ? req.body.externalMountingTypeValues : null,
                        pFunctionalTypeIDs: req.body.functionalTypeIds ? req.body.functionalTypeIds : null,
                        pExternalFunctionalTypeValues: req.body.externalFunctionalTypeValues ? req.body.externalFunctionalTypeValues : null,
                        pAttributesSearchHeader: req.body.attributesSearchHeader ? req.body.attributesSearchHeader : null,
                        pAttributesSearch: req.body.attributesSearch ? req.body.attributesSearch : null,
                        pPackagingAlias: req.body.packagingAlias ? req.body.packagingAlias : null,
                        pAlternatePart: req.body.alternatePart ? req.body.alternatePart : null,
                        pRoHSAlternatePart: req.body.roHSAlternatePart ? req.body.roHSAlternatePart : null,
                        pPartUsedInAssembly: req.body.partUsedInAssembly ? req.body.partUsedInAssembly : null,
                        pMultiplePartNumbers: req.body.multiplePartNumbers ? req.body.multiplePartNumbers : null,
                        pStockQuantity: req.body.stockQuantity ? req.body.stockQuantity : null,
                        pPartTypeIDs: req.body.partTypeIds ? req.body.partTypeIds : null,
                        pCertificateStandardsIds: req.body.certificateStandardsIds ? req.body.certificateStandardsIds : null,
                        pStandardsClassIds: req.body.standardsClassIds ? req.body.standardsClassIds : null,
                        pAssemblyIds: req.body.assemblyIds ? req.body.assemblyIds : null,
                        pAssemblyTypeIds: req.body.assemblyTypeIds ? req.body.assemblyTypeIds : null,
                        pRohsIds: req.body.rohsIds ? req.body.rohsIds : null,
                        pExternalRoHSStatusListValues: req.body.externalRoHSStatusListValues ? req.body.externalRoHSStatusListValues : null,
                        pOperationalAttributeIds: req.body.operationalAttributeIds ? req.body.operationalAttributeIds : null,
                        pAcceptableShippingCountryIds: req.body.acceptableShippingCountryIds ? req.body.acceptableShippingCountryIds : null,
                        pComponentOrdering: req.body.componentOrdering ? req.body.componentOrdering : null,
                        pComponentUsageCriteria: req.body.componentUsageCriteria ? req.body.componentUsageCriteria : null,
                        pIsRefreshMasterFilters: req.body.isRefreshMasterFilters ? true : false,
                        pFromDate: req.body.fromDate ? req.body.fromDate : null,
                        pToDate: req.body.toDate ? req.body.toDate : null,
                        pIsReversal: req.body.isReversal ? true : false,
                        pIsCPN: req.body.isCPN ? true : false,
                        pIsCustom: req.body.isCustom ? true : false,
                        pIsBOMActivityStarted: req.body.isBOMActivityStarted ? true : false,
                        pIsEcoDfmColumnVisible: req.body.isEcoDfmColumnVisible ? true : false,
                        pIsSearchFromHeader: req.body.isSearchFromHeader ? true : false,
                        pIsExportControl: req.body.isExportControl ? true : false,
                        pObsoleteDate: req.body.obsoleteDate ? req.body.obsoleteDate : null,
                        pIsOperatingTemperatureBlank: req.body.isOperatingTemperatureBlank ? true : false,
                        pFromCreatedOnDate: req.body.fromCreatedOnDate ? req.body.fromCreatedOnDate : null,
                        pToCreatedOnDate: req.body.toCreatedOnDate ? req.body.toCreatedOnDate : null,
                        pIsIdenticalMfrPN: req.body.isIdenticalMfrPN ? true : false,
                        pIsProductionPNEmpty: req.body.isProductionPNEmpty ? true : false,
                        pDisapprovedSupplierIds: req.body.disapprovedSupplierIds ? req.body.disapprovedSupplierIds : null,
                        pIsExcludeIncorrectPart: req.body.isExcludeIncorrectPart ? req.body.isExcludeIncorrectPart : false,
                        pMultiplePartFilterFieldName: req.body.multiplePartFilterFieldName ? req.body.multiplePartFilterFieldName : null,
                        pMultiplePartByUploadFileDetail: req.body.multiplePartByUploadFileDetail ? req.body.multiplePartByUploadFileDetail : null,
                        pIsRestrictUSEwithpermission: req.body.restrictUSEwithpermission ? true : false,
                        pIsRestrictPackagingUseWithpermission: req.body.restrictPackagingUseWithpermission ? true : false,
                        pIsRestrictUsePermanently: req.body.restrictUsePermanently ? true : false,
                        pIsRestrictPackagingUsePermanently: req.body.restrictPackagingUsePermanently ? true : false,
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    if (response) {
                        dataObject = {
                            components: _.values(response[1]),
                            Count: response[0][0] ? response[0][0]['totalCount'] : 0,
                            FilterValues: _.values(response[2]),
                            GroupingWiseList: _.values(response[3])
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

    // Create component
    // POST : /api/v1/components
    // @return New create component detail
    createComponent: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var objReturn = {};
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                var promises = [];
                if (req.body.isCPN) {
                    promises.push(module.exports.cpnPartMFGValidationPromise(req, req.body.mfgcodeID));
                }
                promises.push(module.exports.assemblyValidationPromise(req));
                promises.push(module.exports.assemblyNicknameMatchWithPreviousRevisionValidationPromise(req));
                promises.push(module.exports.assemblyNicknameShouldBeDifferentForSameCustomerValidationPromise(req));
                promises.push(module.exports.checkDuplicateMfgPNPromise(req));
                promises.push(module.exports.checkDuplicatePIDCodePromise(req));
                promises.push(module.exports.uomValidationPromise(req));

                return Promise.all(promises).then((response) => {
                    const nickNameValidation = _.find(response, resp => resp.isNickNameValidation === true);
                    if (nickNameValidation) {
                        const validationDet = {
                            messageContent: nickNameValidation.message,
                            mfgDet: nickNameValidation.data
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                            validationDet, null);
                    }
                    var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                    if (resObj) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        if (resObj.message) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: resObj.message,
                                err: null,
                                data: null
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName),
                                err: null,
                                data: null
                            });
                        }
                    } else {
                        let systemId = null;
                        if (req.body.mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                            systemId = DATA_CONSTANT.IDENTITY.MPNSystemID;
                        } else if (req.body.mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                            systemId = DATA_CONSTANT.IDENTITY.SPNSystemID;
                        }
                        return UTILITY_CONTROLLER.getSystemIdPromise(req, res, systemId, t).then((responseSerialNo) => {
                            if (responseSerialNo.status === STATE.SUCCESS) {
                                req.body.serialNumber = responseSerialNo.systemId;
                                // create productionPN
                                // req.body.productionPN = req.body.mfgPN.replace(/[^-+a-zA-Z0-9]/g, '');
                                req.body.productionPN = req.body.mfgPN.replace(DATA_CONSTANT.ProductionPNAllowedCharactersPattern, '');
                                return module.exports.createComponentPromise(req, res, t).then((component) => {
                                    if (component.status === STATE.SUCCESS) {
                                        return module.exports.createDataSheetUrls(req, res, component.id, t).then((datasheet) => {
                                            if (datasheet.status === STATE.SUCCESS) {
                                                t.commit();
                                                // Add record in part_sub_assy_relationship first time
                                                return sequelize.query('CALL Sproc_CreatePartAssyBomRelationship (:pPartID, :pUserID)', {
                                                    replacements: {
                                                        pPartID: component.id,
                                                        pUserID: COMMON.getRequestUserID(req)
                                                    }
                                                }).then(() => {
                                                    if (!t.finished) {
                                                        t.commit();
                                                    }
                                                    objReturn = {
                                                        id: component.id,
                                                        isGoodPart: component.isGoodPart
                                                    };

                                                    // Add Component Detail into Elastic Search Engine for Enterprise Search
                                                    req.params = {
                                                        id: objReturn.id
                                                    };
                                                    // Add Component Detail into Elastic Search Engine for Enterprise Search
                                                    // Need to change timeout code due to trasaction not get updated record
                                                    setTimeout(() => {
                                                        EnterpriseSearchController.managePartDetailInElastic(req);
                                                    }, 2000);
                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, objReturn, MESSAGE_CONSTANT.CREATED(componentModuleName));
                                                }).catch((err) => {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    console.trace();
                                                    console.error(err);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                        err: err,
                                                        data: null
                                                    });
                                                });
                                            } else {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                    messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName),
                                                    err: null,
                                                    data: null
                                                });
                                            }
                                        }).catch((err) => {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName),
                                            err: (component && component.err) ? component.err : null,
                                            data: null
                                        });
                                    }
                                }).catch((err) => {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName),
                                    err: null,
                                    data: null
                                });
                            }
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }
                }).catch((err) => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName),
                    err: null,
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
    // to be called in promise from API only
    cpnPartMFGValidationPromise: (req, mfgCodeId) => {
        const {
            MfgCodeMst
        } = req.app.locals.models;
        if (req.body) {
            return MfgCodeMst.findOne({
                where: {
                    id: mfgCodeId,
                    isDeleted: false,
                    isCustOrDisty: false
                }
            }).then((mfgDetail) => {
                if (mfgDetail) {
                    const messageObj = Object.assign({}, MESSAGE_CONSTANT.PARTS.INVALID_CUSTOMER_FOR_CPN_PART);
                    const mfgCodeDet = `(${mfgDetail.mfgCode}) ${mfgDetail.mfgName}`;
                    messageObj.message = COMMON.stringFormat(messageObj.message, mfgCodeDet);
                    return {
                        status: STATE.FAILED,
                        message: messageObj
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
                    message: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName)
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
    assemblyValidationPromise: (req) => {
        const {
            RFQPartCategory
        } = req.app.locals.models;
        if (req.body) {
            return RFQPartCategory.findOne({
                where: {
                    id: req.body.category,
                    isDeleted: false
                }
            }).then((isexist) => {
                if (isexist) {
                    if (isexist.partCategory === DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID &&
                        req.body.isCustom !== true && req.body.isCPN !== true) {
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.PARTS.COMPONENT_ASSEMBLY_NOT_ALLOWED_TO_SAVE
                        };
                    } else {
                        return {
                            status: STATE.SUCCESS
                        };
                    }
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
                    message: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName)
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
    assemblyNicknameMatchWithPreviousRevisionValidationPromise: (req) => {
        const {
            Component,
            MfgCodeMst
        } = req.app.locals.models;
        var mfrName = '';
        var messageObj = '';
        if (req.body) {
            if (req.body.category === DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID) {
                const whereClause = {
                    nickName: {
                        [Op.ne]: req.body.nickName
                    },
                    category: DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID,
                    custAssyPN: req.body.custAssyPN,
                    mfgcodeID: req.body.mfgcodeID,
                    isDeleted: false
                }
                if (req.body.componentId) {
                    whereClause['id'] = {
                        [Op.ne]: req.body.componentId
                    };
                }
                return Component.findAll({
                    where: whereClause,
                    attributes: ['id', 'mfgPN', 'custAssyPN', 'nickName', 'mfgcodeID', 'rev'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['mfgCode', 'id', 'mfgType', 'mfgName'],
                        required: false
                    }]
                }).then((isexist) => {
                    if (Array.isArray(isexist) && isexist.length > 0) {
                        const compDet = isexist[0];
                        mfrName = `(${compDet.mfgCodemst.mfgCode}) ${compDet.mfgCodemst.mfgName}`;
                        messageObj = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMPONENT_ASSEMBLY_NICKNAME_SHOULD_BE_SAME_MESSAGE);
                        messageObj.message = COMMON.stringFormat(messageObj.message, req.body.nickName, mfrName, compDet.custAssyPN);
                        return {
                            status: STATE.FAILED,
                            message: messageObj,
                            isNickNameValidation: true,
                            data: isexist
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
                        message: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName)
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
    // to be called in promise from API only
    assemblyNicknameShouldBeDifferentForSameCustomerValidationPromise: (req) => {
        const {
            Component
        } = req.app.locals.models;
        var messageObj = '';
        if (req.body) {
            if (req.body.category === DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID) {
                const whereClause = {
                    nickName: req.body.nickName,
                    category: DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID,
                    custAssyPN: {
                        [Op.ne]: req.body.custAssyPN
                    },
                    mfgcodeID: req.body.mfgcodeID,
                    isDeleted: false
                }
                if (req.body.componentId) {
                    whereClause['id'] = {
                        [Op.ne]: req.body.componentId
                    };
                }
                return Component.findAll({
                    where: whereClause,
                    attributes: ['id', 'mfgPN', 'custAssyPN', 'rev', 'nickName']
                }).then((isexist) => {
                    if (Array.isArray(isexist) && isexist.length > 0) {
                        messageObj = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMPONENT_ASSEMBLY_NICKNAME_DUPLICATE_MESSAGE);
                        messageObj.message = COMMON.stringFormat(messageObj.message, req.body.nickName);
                        return {
                            status: STATE.FAILED,
                            message: messageObj,
                            isNickNameValidation: true,
                            data: isexist
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
                        message: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName)
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
    // to be called in promise from API only
    checkDuplicateMfgPNPromise: (req) => {
        const {
            Component
        } = req.app.locals.models;
        if (req.body) {
            let whereClause = {
                mfgcodeID: req.body.mfgcodeID,
                mfgPN: req.body.mfgPN,
                isDeleted: false
            };
            if (req.body.componentId) {
                whereClause['id'] = {
                    [Op.ne]: req.body.componentId
                }
            }
            return Component.findOne({
                where: whereClause
            }).then((isexist) => {
                if (isexist) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMP_EXISTS);
                    if (req.body.mfgType === 'MFG') {
                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.COMPONENT.MFGPN, DATA_CONSTANT.MFGCODE.MFR);
                    } else {
                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.COMPONENT.SUPPLIERPN, DATA_CONSTANT.MFGCODE.SUPPLIER);
                    }
                    return {
                        status: STATE.FAILED,
                        message: messageContent
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
                    message: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName)
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
    checkDuplicatePIDCodePromise: (req) => {

        const {
            Component
        } = req.app.locals.models;
        if (req.body) {
            let whereClause = {
                PIDCode: req.body.PIDCode,
                isDeleted: false
            };
            if (req.body.componentId) {
                whereClause['id'] = {
                    [Op.ne]: req.body.componentId
                }
            }
            return Component.findOne({
                where: whereClause
            }).then((isexist) => {
                if (isexist) {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.PARTS.COMP_PIDCODE
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
                    message: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName)
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },
    // Validate Duplicate PID Code 
    // POST : /api/v1/components/validateDuplicatePIDCode
    // @return Validate Duplicate PID Code 
    validateDuplicatePIDCode: async (req, res) => {
        const mfgTypeModuleName = await module.exports.checkDuplicatePIDCodePromise(req);
        if (mfgTypeModuleName && mfgTypeModuleName.status === STATE.FAILED) {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: mfgTypeModuleName.message,
                err: null,
                data: null
            });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
        }
    },
    // Validate Duplicate MFR/Supplier PN
    // POST : /api/v1/components/validateDuplicateMFRPN
    // @return Validate Duplicate MFR/Supplier PN base on MFR and MFR PN combination
    validateDuplicateMFRPN: async (req, res) => {
        const mfgTypeModuleName = await module.exports.checkDuplicateMfgPNPromise(req);
        if (mfgTypeModuleName && mfgTypeModuleName.status === STATE.FAILED) {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: mfgTypeModuleName.message,
                err: null,
                data: null
            });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
        }
    },
    // to be called in promise from API only
    checkDuplicatePRoductionPNPromise: (req, t) => {
        const {
            Component,
            Settings
        } = req.app.locals.models;
        const whereCriteria = {};

        if (req.params.id) {
            whereCriteria.id = {
                [Op.ne]: req.params.id
            };
        }

        if (req.body) {
            if (req.body.productionPN) {
                whereCriteria.productionPN = req.body.productionPN;
                return Component.findOne({
                    where: whereCriteria,
                    transaction: t
                }).then((isExists) => {
                    const isProductionPNExists = isExists ? true : false;
                    if (isProductionPNExists === true) {
                        return {
                            status: STATE.SUCCESS,
                            isProductionPNExists: isProductionPNExists,
                            message: MESSAGE_CONSTANT.PARTS.PRODUCTION_PN_ALREADY_EXISTS
                        };
                    } else {
                        return Settings.findOne({
                            where: {
                                key: 'productionPNLength'
                            },
                            transaction: t
                        }).then((settingResp) => {
                            var productionPNLength = 0;
                            productionPNLength = settingResp ? parseInt(settingResp.values) : 0;
                            return {
                                status: STATE.SUCCESS,
                                isProductionPNLengthExceed: (req.body.productionPN.length > productionPNLength) ? true : false,
                                productionPNLength: productionPNLength
                            };
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED,
                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                            };
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
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
    // to be called in promise from API only (Check validate Cleaning Type(No-Clean and Water Soluble) with Workorder Operation)
    validateCleaningTypePromise: (req) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_ValidateCleaningTypeInPartMaster(:pNoClean,:pNotApplicable,:pWaterSoluble,:pPartId)', {
                replacements: {
                    pNoClean: req.body.isNoClean,
                    pNotApplicable: req.body.isFluxNotApplicable,
                    pWaterSoluble: req.body.isWaterSoluble,
                    pPartId: req.params.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const usedOperationList = _.values(response[0]);
                if (Array.isArray(usedOperationList) && usedOperationList.length > 0) {
                    return {
                        status: STATE.SUCCESS,
                        isUsedInOtherOperation: true,
                        usedOperationList: usedOperationList
                    };
                }
                return {
                    status: STATE.SUCCESS,
                    isUsedInOtherOperation: false
                };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },
    // to be called in promise from API only (Check validate Current Part used and change status to Inactive(Internal))
    validatePartUsedTranctionPromise: (req) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_CheckUsedPartInTransaction(:pPartId)', {
                replacements: {
                    pPartId: req.params.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const usedTransactionList = _.values(response[0]);
                if (Array.isArray(usedTransactionList) && usedTransactionList.length > 0) {
                    return {
                        status: STATE.FAILED,
                        isUsedInTransaction: true,
                        usedTransactionList: usedTransactionList
                    };
                }
                return {
                    status: STATE.SUCCESS,
                    isUsedInTransaction: false
                };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                    err: err
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
    uomValidationPromise: (req) => {
        const {
            UOMs,
            RFQMountingType
        } = req.app.locals.models;
        if (req.body) {
            return RFQMountingType.findOne({
                where: {
                    id: req.body.mountingTypeID,
                    isDeleted: false
                }
            }).then((isMountingTypeExist) => {
                if (isMountingTypeExist) {
                    if (isMountingTypeExist.isCountTypeEach === true) {
                        return UOMs.findOne({
                            where: {
                                id: req.body.uom,
                                unitName: 'EACH',
                                isDeleted: false
                            }
                        }).then((isUOMexist) => {
                            if (isUOMexist) {
                                return {
                                    status: STATE.SUCCESS
                                };
                            } else {
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.PARTS.COMPONENT_UOM_EACH_VALIDATION
                                };
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED,
                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                error: err
                            };
                        });
                    } else {
                        return {
                            status: STATE.SUCCESS
                        };
                    }
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
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
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
    bomActivityStartedValidationForAllPackagingAliasParts: (req, paliasGroupID, ppartId, existsPartDetail) => {
        const {
            sequelize
        } = req.app.locals.models;
        var vIsWithSupplierParts = false;
        var wherePackaginggroupID = null;
        if (ppartId) {
            if (existsPartDetail) {
                /* check supplier parts only if restriction setting change*/
                if (existsPartDetail.restrictPackagingUsePermanently !== req.body.restrictPackagingUsePermanently ||
                    existsPartDetail.restrictPackagingUseWithpermission !== req.body.restrictPackagingUseWithpermission ||
                    existsPartDetail.restrictUsePermanently !== req.body.restrictUsePermanently ||
                    existsPartDetail.restrictUSEwithpermission !== req.body.restrictUSEwithpermission) {
                    vIsWithSupplierParts = true;
                }
                /* check packaging alias only if any of following setting change */
                if (existsPartDetail.restrictUsePermanently !== req.body.restrictUsePermanently || /* including packaging alias*/
                    existsPartDetail.restrictUSEwithpermission !== req.body.restrictUSEwithpermission || /* including packaging alias*/

                    existsPartDetail.programingRequired !== req.body.programingRequired ||
                    existsPartDetail.matingPartRquired !== req.body.matingPartRquired ||
                    existsPartDetail.driverToolRequired !== req.body.driverToolRequired ||
                    existsPartDetail.functionalTestingRequired !== req.body.functionalTestingRequired) {
                    wherePackaginggroupID = paliasGroupID;
                }
            } else {
                wherePackaginggroupID = paliasGroupID;
            }

            return sequelize.query('CALL Sproc_getActivityStartedAssemblyForAllPackagingParts(:pAliasGroupID,:pPartID,:pIsWithSupplierParts)', {
                replacements: {
                    pAliasGroupID: wherePackaginggroupID,
                    pPartID: ppartId,
                    pIsWithSupplierParts: vIsWithSupplierParts
                }
            }).then((component) => {
                if (component.length === 0) {
                    return {
                        status: STATE.SUCCESS
                    };
                } else {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                        assemblyList: _.values(component)
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
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
    bomActivityStartedValidationForAllLockPart: (req, paliasGroupID, ppartId, existsPartDetail) => {
        const {
            ComponentBOMSetting
        } = req.app.locals.models;
        if (ppartId) {

            return ComponentBOMSetting.findOne({
                where: {
                    refComponentID: ppartId
                },
                attributes: ['refComponentID', 'isActivityStart']
            }).then((resComponent) => {
                if (resComponent && resComponent.isActivityStart) {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.RFQ.STOP_BOM_ACTIVITY_PROIOR_TO_LOCK_BOM
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
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    updatePackagingAliasPartsREquiredFlagPromise: (req, paliasGroupID, t) => {
        const {
            Component
        } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelUpdatedByFieldValue(req);
            const objData = {
                programingRequired: req.body.programingRequired,
                matingPartRquired: req.body.matingPartRquired,
                driverToolRequired: req.body.driverToolRequired,
                functionalTestingRequired: req.body.functionalTestingRequired,
                requiredTestTime: req.body.requiredTestTime,
                updatedBy: req.body.updatedBy,
                updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                updatedAt: COMMON.getCurrentUTC()
            };
            return Component.update(objData, {
                where: {
                    packaginggroupID: paliasGroupID,
                    isDeleted: false
                },
                transaction: t
            }).then(() => ({
                status: STATE.SUCCESS
            })).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    /// Update BOM Internal Version for Packagaing Alias
    updateBOMInternalVersionPackagingAliasPartsPromise: (req, pPartDetail, t) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_Update_BOM_RequireFlagFromPartMaster(:pAliasGroupID,:pPartID,:pNewProgramingRequired,:pNewMatingPartRquired,:pNewDriverToolRequired,:pNewFunctionalTestingRequired,:pNewPickupPadRequired, :pOldPartStatus, :pNewPartStatus, :pOldUOM, :pNewUOM, :pOldEpoxyMount,:pNewEpoxyMount, :pOldConnecterTypeID, :pNewConnecterTypeID, :pOldNoOfRows, :pNewNoOfRows, :pUserId,:pUserRoleId)', {
                replacements: {
                    pAliasGroupID: pPartDetail.packaginggroupID,
                    pPartID: pPartDetail.id,
                    pNewProgramingRequired: req.body.programingRequired,
                    pNewMatingPartRquired: req.body.matingPartRquired,
                    pNewDriverToolRequired: req.body.driverToolRequired,
                    pNewFunctionalTestingRequired: req.body.functionalTestingRequired,
                    pNewPickupPadRequired: req.body.pickupPadRequired,
                    pOldPartStatus: pPartDetail.partStatus,
                    pNewPartStatus: req.body.partStatus,
                    pOldUOM: pPartDetail.uom,
                    pNewUOM: req.body.uom,
                    pOldEpoxyMount: pPartDetail.isEpoxyMount,
                    pNewEpoxyMount: req.body.isEpoxyMount,
                    pOldConnecterTypeID: pPartDetail.connecterTypeID,
                    pNewConnecterTypeID: req.body.connecterTypeID,
                    pOldNoOfRows: pPartDetail.noOfRows,
                    pNewNoOfRows: req.body.noOfRows,
                    pUserId: req.body.updatedBy,
                    pUserRoleId: req.body.updateByRoleId
                },
                transaction: t
            }).then(() => ({
                status: STATE.SUCCESS
            })).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    err: err
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
    mountingTypeForPackagingAliasPartsValidationPromise: (req, res, partId, pMountingTypeID, pPackaginggroupID, pPIDCode) => {
        const {
            Component,
            RFQMountingType
        } = req.app.locals.models;
        var messageObj = '';
        if (req.body && partId && pPackaginggroupID && pMountingTypeID) {
            return Component.findOne({
                where: {
                    id: {
                        [Op.ne]: partId
                    },
                    mountingTypeID: {
                        [Op.ne]: pMountingTypeID
                    },
                    packaginggroupID: pPackaginggroupID
                },
                include: [{
                    model: RFQMountingType,
                    as: 'rfqMountingType',
                    attributes: ['name'],
                    required: false
                }]
            }).then((response) => {
                if (response) {
                    return RFQMountingType.findOne({
                        where: {
                            id: pMountingTypeID
                        },
                        attributes: ['name']
                    }).then((mountingtype) => {
                        messageObj = Object.assign({}, MESSAGE_CONSTANT.PARTS.PACKAGING_ALIAS_MOUNTING_TYPE_VALIDATION);
                        messageObj.message = COMMON.stringFormat(messageObj.message, mountingtype.name, req.body.PIDCode || pPIDCode, response.rfqMountingType.name);
                        return {
                            message: messageObj,
                            status: STATE.FAILED
                        };
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            error: err
                        };
                    });
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
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
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
    createComponentPromise: (req, res, t) => {
        const {
            Component
        } = req.app.locals.models;
        var inputFieldsForCreate = inputFields.slice();
        if (req.body) {
            const promises = [];
            promises.push(module.exports.checkDuplicatePRoductionPNPromise(req, t));
            return Promise.all(promises).then((respValidation) => {
                var resObj = _.find(respValidation, resp => resp.status === STATE.FAILED);
                if (resObj) {
                    return resObj;
                }
                resObj = _.find(respValidation, resp => (resp.isProductionPNExists === true || resp.isProductionPNLengthExceed === true));
                if (resObj && (resObj.isProductionPNExists === true || resObj.isProductionPNLengthExceed === true)) {
                    inputFieldsForCreate = inputFieldsForCreate.filter(value => value !== productionPNFieldName);
                }

                req.body.isReversal = false;
                COMMON.setModelCreatedByFieldValue(req);
                return Component.create(req.body, {
                    fields: inputFieldsForCreate,
                    transaction: t
                }).then((component) => {
                    req.body.componentObj = req.body;
                    req.body.componentObj.componentID = component.id;
                    req.body.componentObj.parentComponentID = component.refSupplierMfgpnComponentID;

                    return {
                        status: STATE.SUCCESS,
                        id: component.id,
                        isGoodPart: component.isGoodPart
                    };
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName),
                        err: err
                    };
                });
            }).catch((err) => {
                if (!t.finished) {
                    t.rollback();
                }
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    // Validate Part on set 'Incorrect Part' which configure other part as 'Good part'
    validatePartonSetIncorrectPart: (req, t) => {
        const { Component } = req.app.locals.models;
        return Component.findOne({
            where: {
                replacementPartID: req.body.id,
                isGoodPart: DATA_CONSTANT.PartCorrectList.IncorrectPart,
                isDeleted: false
            },
            transaction: t
        }).then((isReplexist) => {
            if (isReplexist) {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.PARTS.RESTRICT_SET_INCORRECT_FOR_REFER_FOR_CORRECT_PART);
                messageContent.message = COMMON.stringFormat(messageContent.message, isReplexist.mfgPN);
                return {
                    status: STATE.FAILED,
                    message: messageContent
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
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                error: err
            };
        });
    },
    validationOnUpdatePart: (req, res) => {
        return module.exports.validatePartDetail(req, res).then((response) => {
            if (response.status === STATE.FAILED) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, response.data);
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
        })
    },
    // Validate part on update part
    // POST : /api/v1/component/validationOnUpdatePart
    // @return validation detail
    validatePartDetail: async (req, res) => {
        const {
            Component,
            SalesOrderDet,
            sequelize
        } = req.app.locals.models;

        let t = null;
        req.params['id'] = req.body.id;
        if (req.body.id) {
            try {
                const isPartExist = await Component.findOne({
                    where: {
                        id: req.body.id,
                        isDeleted: false
                    }
                });
                if (isPartExist) {
                    t = await sequelize.transaction();

                    let response = null;
                    if (isPartExist.partStatus !== req.body.partStatus) {
                        response = await module.exports.setSupplierComponentStatusPromise(req, res, t, isPartExist);

                        if (response.status === STATE.FAILED) {
                            return Promise.resolve({
                                status: STATE.FAILED,
                                data: {
                                    messageContent: response.message, err: null, data: null
                                }
                            });
                        }
                    }

                    if (isPartExist.isGoodPart === DATA_CONSTANT.PartCorrectList.CorrectPart &&
                        (req.body.isGoodPart === DATA_CONSTANT.PartCorrectList.IncorrectPart)) {
                        response = await module.exports.validatePartonSetIncorrectPart(req, t);

                        if (response.status === STATE.FAILED) {
                            return Promise.resolve({
                                status: STATE.FAILED,
                                data: {
                                    messageContent: response.message, err: response.error, data: null
                                }
                            });
                        }
                    }

                    req.body.productionPN = req.body.productionPN ? req.body.productionPN.replace(DATA_CONSTANT.ProductionPNAllowedCharactersPattern, '') : req.body.productionPN;
                    response = await module.exports.checkDuplicatePRoductionPNPromise(req, t);
                    if (response.isProductionPNExists) {
                        return Promise.resolve({
                            status: STATE.FAILED,
                            data: {
                                messageContent: response.message, err: null, data: null
                            }
                        });
                    } else if (response.isProductionPNLengthExceed) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.PARTS.PRODUCTION_PN_LENGTH_VALIDATION);
                        messageContent.message = COMMON.stringFormat(messageContent.message, resObj.productionPNLength);
                        return Promise.resolve({
                            status: STATE.FAILED,
                            data: {
                                messageContent: messageContent, err: null, data: null
                            }
                        });
                    } else if (response.status === STATE.FAILED) {
                        return Promise.resolve({
                            status: STATE.FAILED,
                            data: {
                                messageContent: response.message, err: response.err, data: null
                            }
                        });
                    }

                    if (req.body.partStatus === DATA_CONSTANT.PartStatusList.InternalInactive) {
                        response = await module.exports.validatePartUsedTranctionPromise(req, t);
                        if (response.status === STATE.FAILED) {
                            if (Array.isArray(response.usedTransactionList)) {
                                return Promise.resolve({
                                    status: STATE.FAILED,
                                    data: {
                                        err: null, data: {
                                            usedTransactionList: response.usedTransactionList
                                        }
                                    }
                                });
                            } else {
                                return Promise.resolve({
                                    status: STATE.FAILED,
                                    data: {
                                        messageContent: response.message, err: null, data: null
                                    }
                                });
                            }
                        }
                    }
                    let isSalesExist = await SalesOrderDet.findOne({
                        where: {
                            partID: req.params.id,
                            isDeleted: false,
                            partCategory: DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID
                        },
                        transaction: t
                    });
                    if (isSalesExist && isPartExist.rfqOnly === false && req.body.rfqOnly === true) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return Promise.resolve({
                            status: STATE.FAILED,
                            data: {
                                messageContent: MESSAGE_CONSTANT.PARTS.COMP_SALES_ORDER,
                                err: null,
                                data: null
                            }
                        });
                    }
                    response = await module.exports.checkUOMValidationOnComponentUpdate(req, res, isPartExist, t);
                    if (response.status === STATE.FAILED) {
                        return Promise.resolve({
                            status: STATE.FAILED,
                            data: {
                                messageContent: response.message, err: response.error, data: null
                            }
                        });
                    }

                    response = await module.exports.uomValidationPromise(req);
                    if (response.status === STATE.FAILED) {
                        return Promise.resolve({
                            status: STATE.FAILED,
                            data: {
                                messageContent: response.message, err: response.error, data: null
                            }
                        });
                    }
                    if (isPartExist.programingRequired !== req.body.programingRequired ||
                        isPartExist.matingPartRquired !== req.body.matingPartRquired ||
                        isPartExist.driverToolRequired !== req.body.driverToolRequired ||
                        isPartExist.functionalTestingRequired !== req.body.functionalTestingRequired ||
                        isPartExist.mountingTypeID !== req.body.mountingTypeID ||
                        isPartExist.functionalCategoryID !== req.body.functionalCategoryID ||
                        isPartExist.partStatus !== req.body.partStatus ||
                        isPartExist.uom !== req.body.uom ||
                        isPartExist.isEpoxyMount !== req.body.isEpoxyMount ||
                        isPartExist.pickupPadRequired !== req.body.pickupPadRequired ||
                        isPartExist.connecterTypeID !== req.body.connecterTypeID ||
                        isPartExist.noOfRows !== req.body.noOfRows ||
                        isPartExist.restrictPackagingUsePermanently !== req.body.restrictPackagingUsePermanently ||
                        isPartExist.restrictPackagingUseWithpermission !== req.body.restrictPackagingUseWithpermission ||
                        isPartExist.restrictUsePermanently !== req.body.restrictUsePermanently ||
                        isPartExist.restrictUSEwithpermission !== req.body.restrictUSEwithpermission) {
                        response = await module.exports.bomActivityStartedValidationForAllPackagingAliasParts(req, isPartExist.packaginggroupID, isPartExist.id, isPartExist);
                        if (response.status === STATE.FAILED) {
                            if (response.assemblyList) {
                                return Promise.resolve({
                                    status: STATE.FAILED,
                                    data: {
                                        err: null, data: {
                                            assemblyList: response.assemblyList
                                        }
                                    }
                                });
                            } else {
                                return Promise.resolve({
                                    status: STATE.FAILED,
                                    data: {
                                        messageContent: response.message,
                                        err: response.error,
                                        data: null
                                    }
                                });
                            }
                        }
                    }
                    if (!isPartExist.bomLock && req.body.bomLock) {
                        response = await module.exports.bomActivityStartedValidationForAllLockPart(req, isPartExist.packaginggroupID, isPartExist.id, isPartExist);
                        if (response.status === STATE.FAILED) {
                            return Promise.resolve({
                                status: STATE.FAILED,
                                data: {
                                    messageContent: response.message, err: response.error, data: null
                                }
                            });

                        }
                    }

                    if (isPartExist.packaginggroupID != null) {
                        response = await module.exports.mountingTypeForPackagingAliasPartsValidationPromise(req, res, req.params.id, req.body.mountingTypeID, isPartExist.packaginggroupID);
                        if (response.status === STATE.FAILED) {
                            return Promise.resolve({
                                status: STATE.FAILED,
                                data: {
                                    messageContent: response.message, err: response.error, data: null
                                }
                            });
                        }
                    }
                    if (!req.body.processIsCleanTypeChecked) {
                        response = await module.exports.validateCleaningTypePromise(req, t);

                        if (response && response.isUsedInOtherOperation === true && Array.isArray(response.usedOperationList) && response.usedOperationList.length > 0) {
                            return Promise.resolve({
                                status: STATE.FAILED,
                                data: {
                                    err: null, data: {
                                        usedOperationList: response.usedOperationList
                                    }
                                }
                            });
                        }
                    }
                    t.commit();
                    return Promise.resolve({
                        status: STATE.SUCCESS
                    });
                } else {
                    return Promise.resolve({
                        status: STATE.FAILED,
                        data: {
                            messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                            err: null,
                            data: null
                        }
                    });
                }
            } catch (err) {
                if (t && !t.finished) {
                    t.rollback();
                }
                console.trace();
                console.error(err);
                return Promise.resolve({
                    status: STATE.FAILED,
                    data: {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                });
            }
        } else {
            return Promise.resolve({
                status: STATE.FAILED,
                data: {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            });
        }
    },
    // Update Component
    // PUT : /api/v1/component/updateComponent
    // @param {id} int
    // @return Updated component details
    updateComponent: (req, res) => {
        const { Component, sequelize } = req.app.locals.models;
        var oldRestrictedWithPermision = false;
        var oldrestrictUsePermanently = false;
        var oldRestrictPackagingUseWithpermission = false;
        var oldRestrictPackagingUsePermanently = false;
        var promisesUpdate = [];
        if (req.params.id) {
            return module.exports.validatePartDetail(req, res).then((validationResponse) => {
                if (validationResponse && validationResponse.status === STATE.SUCCESS) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return sequelize.transaction().then(t => Component.findOne({
                        where: {
                            id: req.params.id,
                            isDeleted: false
                        },
                        transaction: t
                    }).then((isPartExist) => {
                        if (isPartExist) {
                            if (isPartExist) {
                                oldRestrictedWithPermision = isPartExist.restrictUSEwithpermission;
                                oldrestrictUsePermanently = isPartExist.restrictUsePermanently;
                                oldRestrictPackagingUseWithpermission = isPartExist.restrictPackagingUseWithpermission;
                                oldRestrictPackagingUsePermanently = isPartExist.restrictPackagingUsePermanently;

                                /* Currently Active part is going to non Active state at that time part is not reversal*/
                                if (req.body.partStatus !== DATA_CONSTANT.PartStatusList.Active &&
                                    isPartExist.partStatus === DATA_CONSTANT.PartStatusList.Active) {
                                    req.body.isReversal = false;
                                } else if (req.body.partStatus === DATA_CONSTANT.PartStatusList.Active &&
                                    isPartExist.partStatus !== DATA_CONSTANT.PartStatusList.Active) {
                                    /* Currently non Active part state to Active state at that time part is called reversed*/
                                    req.body.isReversal = true;
                                }
                            }

                            promisesUpdate = [];
                            promisesUpdate.push(module.exports.updateComponentPromise(req, res, t));

                            if (isPartExist.programingRequired !== req.body.programingRequired ||
                                isPartExist.matingPartRquired !== req.body.matingPartRquired ||
                                isPartExist.driverToolRequired !== req.body.driverToolRequired ||
                                isPartExist.functionalTestingRequired !== req.body.functionalTestingRequired ||
                                isPartExist.partStatus !== req.body.partStatus ||
                                isPartExist.uom !== req.body.uom ||
                                isPartExist.isEpoxyMount !== req.body.isEpoxyMount ||
                                isPartExist.pickupPadRequired !== req.body.pickupPadRequired ||
                                isPartExist.connecterTypeID !== req.body.connecterTypeID ||
                                isPartExist.noOfRows !== req.body.noOfRows) {
                                promisesUpdate.push(module.exports.updateBOMInternalVersionPackagingAliasPartsPromise(req, isPartExist, t));
                            }

                            if (isPartExist.packaginggroupID != null && (isPartExist.programingRequired !== req.body.programingRequired ||
                                isPartExist.matingPartRquired !== req.body.matingPartRquired ||
                                isPartExist.driverToolRequired !== req.body.driverToolRequired ||
                                isPartExist.functionalTestingRequired !== req.body.functionalTestingRequired)) {
                                promisesUpdate.push(module.exports.updatePackagingAliasPartsREquiredFlagPromise(req, isPartExist.packaginggroupID, t));
                            }
                            /** >>>>> */
                            if (isPartExist.driverToolRequired === true && req.body.driverToolRequired !== true) {
                                promisesUpdate.push(module.exports.deleteAllDriveToolsPromise(req, res, t));
                            }
                            if (isPartExist.matingPartRquired === true && req.body.matingPartRquired !== true) {
                                promisesUpdate.push(module.exports.deleteAllAlternatePartsPromise(req, res, t, 5));
                            }
                            if (isPartExist.pickupPadRequired === true && req.body.pickupPadRequired !== true) {
                                promisesUpdate.push(module.exports.deleteAllAlternatePartsPromise(req, res, t, 2));
                            }
                            if (isPartExist.programingRequired === true && req.body.programingRequired !== true) {
                                promisesUpdate.push(module.exports.deleteAllAlternatePartsPromise(req, res, t, 3));
                            }
                            if (isPartExist.functionalTestingRequired === true && req.body.functionalTestingRequired !== true) {
                                promisesUpdate.push(module.exports.deleteAllAlternatePartsPromise(req, res, t, 4));
                            }
                            /* <<<<< */
                            if (isPartExist.packaginggroupID != null &&
                                (isPartExist.restrictUsePermanently !== req.body.restrictUsePermanently ||
                                    isPartExist.restrictUSEwithpermission !== req.body.restrictUSEwithpermission)) {
                                promisesUpdate.push(module.exports.updateRestrictFlagForPackagingAlias(req, res, isPartExist.packaginggroupID, t));
                            }
                            if (isPartExist.deviceMarking !== req.body.deviceMarking && !req.body.isSupplier) {
                                promisesUpdate.push(module.exports.updateDeviceMarkingForSupplierPartsAndPackagingAlias(req, res, isPartExist.packaginggroupID, t));
                            }
                            if (!req.body.isSupplier) {
                                promisesUpdate.push(module.exports.updateSupplierPartsFromMfgPart(req, res, t, isPartExist));
                            }
                            promisesUpdate.push(module.exports.manangeOddelyRefDes(req, res, t));
                            if (isPartExist.isEpoxyMount === true && req.body.isEpoxyMount !== true) {
                                promisesUpdate.push(module.exports.deleteAllProcessMaterialPromise(req, res, t));
                            }
                            return Promise.all(promisesUpdate).then((response) => {
                                var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                                if (resObj) {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    let validationData = resObj.assemblyList ? resObj.assemblyList : null;
                                    if (resObj.message) {
                                        if (validationData) {
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                                assemblyList: resObj.assemblyList
                                            }, null);
                                        } else {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: resObj.message,
                                                err: resObj.err,
                                                data: validationData
                                            });
                                        }
                                    } else {
                                        validationData = resObj.usedOperationList ? resObj.usedOperationList : null;
                                        if (validationData) {
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                                usedOperationList: validationData
                                            }, null);
                                        } else {
                                            validationData = resObj.usedTransactionList ? resObj.usedTransactionList : null;
                                            if (validationData) {
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                                    usedTransactionList: validationData
                                                }, null);
                                            } else {
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                    messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                                    err: resObj.err,
                                                    data: validationData
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    return t.commit().then(() => {
                                        if (isPartExist.restrictUsePermanently !== req.body.restrictUsePermanently ||
                                            isPartExist.restrictUSEwithpermission !== req.body.restrictUSEwithpermission ||
                                            isPartExist.restrictPackagingUsePermanently !== req.body.restrictPackagingUsePermanently ||
                                            isPartExist.restrictPackagingUseWithpermission !== req.body.restrictPackagingUseWithpermission) {
                                            module.exports.sendPartUpdatedNotification(req, res, isPartExist);
                                        }
                                        if (isPartExist.bomLock !== req.body.bomLock) {
                                            const data = {
                                                bomPartID: req.params.id,
                                                bomLock: req.body.bomLock,
                                                userName: req.user.username,
                                                messageText: MESSAGE_CONSTANT.RFQ.BOM_LOCKED_FROM_PART_MASTER
                                            };
                                            RFQSocketController.sendPartUpdatedNotification(req, data);
                                        }
                                        EnterpriseSearchController.managePartDetailInElastic(req);
                                        return sequelize.transaction().then((t) => {
                                            return module.exports.updateBOMMountingAndFunctionalTypeError(req, t).then((spResponse) => {
                                                if (spResponse.status === STATE.SUCCESS) {
                                                    if (req.body.restrictUSEwithpermission !== oldRestrictedWithPermision || req.body.restrictUsePermanently !== oldrestrictUsePermanently ||
                                                        req.body.restrictPackagingUseWithpermission !== oldRestrictPackagingUseWithpermission || req.body.restrictPackagingUsePermanently !== oldRestrictPackagingUsePermanently) {
                                                        return module.exports.updateBOMForRestrictPart(req, res, oldRestrictedWithPermision, oldrestrictUsePermanently, oldRestrictPackagingUseWithpermission, oldRestrictPackagingUsePermanently, t).then((updateResponse) => {
                                                            if (updateResponse.status === STATE.SUCCESS) {
                                                                t.commit().then(() => {
                                                                    if (isPartExist.programingRequired !== req.body.programingRequired ||
                                                                        isPartExist.matingPartRquired !== req.body.matingPartRquired ||
                                                                        isPartExist.driverToolRequired !== req.body.driverToolRequired ||
                                                                        isPartExist.functionalTestingRequired !== req.body.functionalTestingRequired ||
                                                                        isPartExist.mountingTypeID !== req.body.mountingTypeID ||
                                                                        isPartExist.functionalCategoryID !== req.body.functionalCategoryID ||
                                                                        isPartExist.partStatus !== req.body.partStatus ||
                                                                        isPartExist.uom !== req.body.uom ||
                                                                        isPartExist.isEpoxyMount !== req.body.isEpoxyMount ||
                                                                        isPartExist.pickupPadRequired !== req.body.pickupPadRequired ||
                                                                        isPartExist.connecterTypeID !== req.body.connecterTypeID ||
                                                                        isPartExist.noOfRows !== req.body.noOfRows) {
                                                                        const data = {
                                                                            bomPartID: req.params.id,
                                                                            partDetailUpdate: true
                                                                        };
                                                                        RFQSocketController.sendPartUpdatedNotification(req, data);
                                                                    }
                                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(componentModuleName));
                                                                });
                                                            } else {
                                                                if (!t.finished) {
                                                                    t.rollback();
                                                                }
                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                                    messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                                                    err: updateResponse.error,
                                                                    data: null
                                                                });
                                                            }
                                                        }).catch((err) => {
                                                            if (!t.finished) {
                                                                t.rollback();
                                                            }
                                                            console.trace();
                                                            console.error(err);
                                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                                err: err,
                                                                data: null
                                                            });
                                                        });
                                                    } else {
                                                        t.commit().then(() => {
                                                            if (isPartExist.programingRequired !== req.body.programingRequired ||
                                                                isPartExist.matingPartRquired !== req.body.matingPartRquired ||
                                                                isPartExist.driverToolRequired !== req.body.driverToolRequired ||
                                                                isPartExist.functionalTestingRequired !== req.body.functionalTestingRequired ||
                                                                isPartExist.mountingTypeID !== req.body.mountingTypeID ||
                                                                isPartExist.functionalCategoryID !== req.body.functionalCategoryID ||
                                                                isPartExist.partStatus !== req.body.partStatus ||
                                                                isPartExist.uom !== req.body.uom ||
                                                                isPartExist.isEpoxyMount !== req.body.isEpoxyMount ||
                                                                isPartExist.pickupPadRequired !== req.body.pickupPadRequired ||
                                                                isPartExist.connecterTypeID !== req.body.connecterTypeID ||
                                                                isPartExist.noOfRows !== req.body.noOfRows) {
                                                                const data = {
                                                                    bomPartID: req.params.id,
                                                                    partDetailUpdate: true
                                                                };
                                                                RFQSocketController.sendPartUpdatedNotification(req, data);
                                                            }
                                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(componentModuleName));
                                                        });
                                                    }
                                                } else {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                        messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                                        err: (spResponse && spResponse.error) ? spResponse.error : null,
                                                        data: null
                                                    });
                                                }
                                            }).catch((err) => {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                console.trace();
                                                console.error(err);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: err,
                                                    data: null
                                                });
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
                            }).catch((err) => {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });

                        } else {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                err: null,
                                data: null
                            });
                        }
                    }).catch((err) => {
                        if (!t.finished) {
                            t.rollback();
                        }
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
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, validationResponse.data);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // to be call from API method only
    // send part update notification
    sendPartUpdatedNotification: (req, res, partDetail) => {
        const {
            RFQLineitemsAlternatepart,
            RFQLineItems,
            Component,
            User
        } = req.app.locals.models;
        var whereCriteria = {};
        var data = {};
        var messageText = '';
        if (req.body) {
            whereCriteria.isDeleted = false;
            if (partDetail.packaginggroupID != null &&
                (partDetail.restrictUsePermanently !== req.body.restrictUsePermanently ||
                    partDetail.restrictUSEwithpermission !== req.body.restrictUSEwithpermission)) {
                whereCriteria.packaginggroupID = partDetail.packaginggroupID;
            } else {
                whereCriteria.id = req.params.id;
            }
            return Component.findAll({
                where: {
                    isDeleted: false
                },
                attributes: ['id', 'mfgPN'],
                include: [{
                    model: RFQLineitemsAlternatepart,
                    as: 'partidRfqLineitemsAlternatepart',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['partid', 'mfgPNID'],
                    required: true,
                    include: [{
                        model: Component,
                        as: 'mfgComponent',
                        where: whereCriteria,
                        attributes: ['id', 'mfgPN'],
                        required: true
                    }]
                }]
            }).then(isPartsExist => Component.findAll({
                where: {
                    isDeleted: false
                },
                attributes: ['id', 'mfgPN'],
                include: [{
                    model: RFQLineItems,
                    as: 'rfqLineitems',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['partID', 'custPNID'],
                    required: true,
                    include: [{
                        model: Component,
                        as: 'custPNIDcomponent',
                        where: whereCriteria,
                        attributes: ['id', 'mfgPN'],
                        required: true
                    }]
                }]
            }).then((isCPNPartsExist) => {
                if ((isPartsExist && isPartsExist.length > 0) ||
                    (isCPNPartsExist && isCPNPartsExist.length > 0)) {
                    data.data = isPartsExist.concat(isCPNPartsExist);
                    if (req.body.restrictUSEwithpermission) {
                        messageText = MESSAGE_CONSTANT.COMPONENT.RESTRICT_USE_INCLUDING_PACKAGING_ALIAS_WITH_PERMISSION;
                    } else if (req.body.restrictUsePermanently) {
                        messageText = MESSAGE_CONSTANT.COMPONENT.RESTRICT_USE_INCLUDING_PACKAGING_ALIAS_PERMANENTLY;
                    } else if (req.body.restrictPackagingUseWithpermission) {
                        messageText = MESSAGE_CONSTANT.COMPONENT.RESTRICT_USE_EXCLUDING_PACKAGING_ALIAS_WITH_PERMISSION;
                    } else if (req.body.restrictPackagingUsePermanently) {
                        messageText = MESSAGE_CONSTANT.COMPONENT.RESTRICT_USE_EXCLUDING_PACKAGING_ALIAS_PERMANENTLY;
                    } else {
                        data.isRestrictionRemoved = true;
                        if (partDetail.restrictUSEwithpermission) {
                            messageText = MESSAGE_CONSTANT.COMPONENT.RESTRICT_USE_INCLUDING_PACKAGING_ALIAS_WITH_PERMISSION;
                        } else if (partDetail.restrictUsePermanently) {
                            messageText = MESSAGE_CONSTANT.COMPONENT.RESTRICT_USE_INCLUDING_PACKAGING_ALIAS_PERMANENTLY;
                        } else if (partDetail.restrictPackagingUseWithpermission) {
                            messageText = MESSAGE_CONSTANT.COMPONENT.RESTRICT_USE_EXCLUDING_PACKAGING_ALIAS_WITH_PERMISSION;
                        } else if (partDetail.restrictPackagingUsePermanently) {
                            messageText = MESSAGE_CONSTANT.COMPONENT.RESTRICT_USE_EXCLUDING_PACKAGING_ALIAS_PERMANENTLY;
                        }
                    }

                    data.messageText = messageText;

                    return User.findOne({
                        where: {
                            id: req.body.updatedBy,
                            isDeleted: false
                        },
                        attributes: ['firstName', 'lastName']
                    }).then((userData) => {
                        if (userData) {
                            data.userName = `${userData.firstName} ${userData.lastName} `;
                        }
                        RFQSocketController.sendPartUpdatedNotification(req, data);
                        RFQSocketController.sendBOMInternalVersionChanged(req, {
                            notifyFrom: 'PartMaster',
                            data: data.data
                        });
                        return {
                            status: STATE.SUCCESS
                        };
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            error: err
                        };
                    });
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
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            })).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else {
            return {
                status: STATE.SUCCESS
            };
        }
    },

    // Update Component Default Image
    // PUT : /api/v1/component/updateComponentDefaultImage
    // @param {id} int
    // @return Upadted component details
    updateComponentDefaultImage: (req, res) => {
        const {
            Component
        } = req.app.locals.models;
        var imageData = {};
        if (req.body.imageDataObj) {
            COMMON.setModelUpdatedByFieldValue(req);
            imageData = {
                imageURL: req.body.imageDataObj.imageUrl,
                updatedBy: req.body.updatedBy,
                updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                updatedAt: COMMON.getCurrentUTC()
            };

            return Component.update(imageData, {
                where: {
                    id: req.body.imageDataObj.id,
                    isDeleted: false
                },
                fields: inputFieldsUpdateDefaultImage
            }).then(rowsUpdated => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rowsUpdated, MESSAGE_CONSTANT.UPDATED(componentImagesName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // delete All Alternate Parts for Component
    // Used in from updateComponent()
    deleteAllAlternatePartsPromise: (req, res, t, pType) => {
        const {
            ComponentAlternatePN
        } = req.app.locals.models;
        var objAlternatePN = {};
        COMMON.setModelDeletedByFieldValue(req);
        objAlternatePN = {
            isDeleted: true,
            deletedBy: req.body.deletedBy,
            deletedAt: req.body.deletedAt,
            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
        };
        return ComponentAlternatePN.update(objAlternatePN, {
            where: {
                refComponentID: req.params.id,
                isDeleted: false,
                type: pType
            },
            transaction: t
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err
            };
        });
    },

    // update Component
    // Used from updateComponent()
    updateComponentPromise: (req, res, t) => {
        const {
            Component
        } = req.app.locals.models;
        var inputFieldsForUpdate = inputFields.slice();
        if (req.body.isSupplier) {
            /* This fields are removed because it  allowed to update for MfgPart Only */
            inputFieldsForUpdate = inputFieldsForUpdate.filter(value =>
                value !== 'restrictPackagingUsePermanently' &&
                value !== 'restrictPackagingUseWithpermission' &&
                value !== 'restrictUsePermanently' &&
                value !== 'restrictUSEwithpermission' &&
                value !== 'deviceMarking' &&
                value !== 'restrictUsePermanently' &&
                value !== 'restrictUSEwithpermission' &&
                value !== 'restrictPackagingUsePermanently' &&
                value !== 'restrictPackagingUseWithpermission' &&
                value !== 'functionalCategoryID' &&
                value !== 'mountingTypeID' &&
                value !== 'partPackageID' &&
                value !== 'operatingTemp' &&
                value !== 'minOperatingTemp' &&
                value !== 'maxOperatingTemp' &&
                value !== 'temperatureCoefficient' &&
                value !== 'temperatureCoefficientValue' &&
                value !== 'temperatureCoefficientUnit' &&
                value !== 'connecterTypeID' &&
                value !== 'noOfPosition' &&
                value !== 'noOfRows' &&
                value !== 'pitch' &&
                value !== 'pitchMating' &&
                value !== 'length' &&
                value !== 'width' &&
                value !== 'height' &&
                value !== 'tolerance' &&
                value !== 'voltage' &&
                value !== 'value' &&
                value !== 'powerRating' &&
                value !== 'weight' &&
                value !== 'feature' &&
                value !== 'color' &&
                value !== 'isFluxNotApplicable' &&
                value !== 'isWaterSoluble' &&
                value !== 'isNoClean' &&
                value !== 'isHazmatMaterial' &&
                value !== 'isReceiveBulkItem');
        }

        req.body.productionPN = req.body.productionPN ? req.body.productionPN.replace(DATA_CONSTANT.ProductionPNAllowedCharactersPattern, '') : req.body.productionPN;
        inputFieldsForUpdate = inputFieldsForUpdate.filter(value =>
            value !== 'deletedAt' &&
            value !== 'deletedBy' &&
            value !== 'isDeleted' &&
            value !== 'deleteByRoleId'
        );

        COMMON.setModelUpdatedByFieldValue(req);
        return Component.update(req.body, {
            where: {
                id: req.params.id,
                isDeleted: false
            },
            fields: inputFieldsForUpdate,
            transaction: t
        }).then(() =>
            module.exports.createDataSheetUrls(req, res, req.params.id, t).then((datasheet) => {
                if (datasheet.status === STATE.SUCCESS) {
                    return module.exports.deleteComponentDataSheetUrls(req, res, req.params.id, t).then((deleteResponse) => {
                        if (deleteResponse.status === STATE.SUCCESS) {
                            if ((Array.isArray(req.body.deletedDataSheetUrls) && req.body.deletedDataSheetUrls.length > 0) ||
                                (Array.isArray(req.body.newlyAddedDataSheetUrls) && req.body.newlyAddedDataSheetUrls.length > 0)) {

                                return module.exports.updateDataSheetLinkInComponent(req, res, req.params.id, t).then((updaterecord) => {
                                    if (updaterecord.status === STATE.SUCCESS) {
                                        return {
                                            status: STATE.SUCCESS
                                        };
                                    } else {
                                        return {
                                            status: STATE.FAILED,
                                            err: updaterecord.error
                                        };
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err
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
                                err: deleteResponse.error
                            };
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err
                        };
                    });
                } else {
                    return {
                        status: STATE.FAILED,
                        err: datasheet.error
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err
                };
            })
        ).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err
            };
        });
    },
    // Update Datasheet URL on update component master
    updateDataSheetLinkInComponent: (req, res, componentId, t) => {
        const {
            ComponentDataSheets,
            Component
        } = req.app.locals.models;

        COMMON.setModelUpdatedByFieldValue(req);
        return ComponentDataSheets.findOne({
            where: {
                refComponentID: componentId
            },
            transaction: t
        }).then((datasheet) => {
            if (datasheet) {
                const componentObj = {
                    dataSheetLink: datasheet.datasheetName,
                    updatedBy: COMMON.getRequestUserID(req),
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                    updatedAt: COMMON.getCurrentUTC()
                };
                return Component.update(componentObj, {
                    where: {
                        id: componentId,
                        dataSheetLink: { /* added for set default from edit page*/
                            [Op.eq]: null
                        }
                    },
                    transaction: t,
                    attributes: ['dataSheetLink', 'updatedBy']
                }).then(() => ({
                    status: STATE.SUCCESS
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        error: err
                    };
                });
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
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                error: err
            };
        });
    },
    // delete All Packaging Alias for Component
    // Used in Packaging Alias validation from updateComponent()
    deleteAllPackagingAliasPromise: (req, res, t) => {
        const {
            Component,
            ComponentPackagingAlias
        } = req.app.locals.models;
        var obj = {};
        if (req) {
            if (req.body.isRemovePackingAlias &&
                req.body.isRemovePackingAlias === true) {
                return ComponentPackagingAlias.findOne({
                    where: {
                        componentID: req.params.id,
                        isDeleted: false
                    },
                    transaction: t
                }).then((isexist) => {
                    if (isexist) {
                        COMMON.setModelDeletedByFieldValue(req);
                        obj = {
                            isDeleted: req.body.isDeleted,
                            deletedAt: req.body.deletedAt,
                            deletedBy: req.body.deletedBy,
                            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        };
                        return ComponentPackagingAlias.findAll({
                            where: {
                                aliasgroupID: isexist.aliasgroupID
                            },
                            transaction: t,
                            attributes: ['id', 'componentID', 'aliasgroupID']
                        }).then((componentPackagingAliasList) => {
                            if (componentPackagingAliasList.length === 2) {
                                return ComponentPackagingAlias.update(obj, {
                                    where: {
                                        id: {
                                            // [Op.in]: [componentPackagingAliasList[0].id, componentPackagingAliasList[1].id]
                                            [Op.in]: _.map(componentPackagingAliasList, 'id')
                                        }
                                    },
                                    transaction: t
                                }).then(() => {
                                    var compObj = {
                                        packaginggroupID: null,
                                        updatedBy: req.body.deletedBy,
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                        updatedAt: COMMON.getCurrentUTC()
                                    };
                                    return Component.update(compObj, {
                                        where: {
                                            id: {
                                                // [Op.in]: [componentPackagingAliasList[0].componentID, componentPackagingAliasList[1].componentID]
                                                [Op.in]: _.map(componentPackagingAliasList, 'componentID')
                                            }
                                        },
                                        transaction: t
                                    }).then(() => ({
                                        status: STATE.SUCCESS
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return {
                                            status: STATE.FAILED,
                                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            error: err
                                        };
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        error: err
                                    };
                                });
                            } else {
                                return ComponentPackagingAlias.update(obj, {
                                    where: {
                                        id: isexist.id
                                    },
                                    transaction: t
                                }).then(() => {
                                    var compObj = {
                                        packaginggroupID: null,
                                        updatedBy: req.body.deletedBy,
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                        updatedAt: COMMON.getCurrentUTC()
                                    };
                                    return Component.update(compObj, {
                                        where: {
                                            id: isexist.componentID
                                        },
                                        transaction: t
                                    }).then(() => ({
                                        status: STATE.SUCCESS
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return {
                                            status: STATE.FAILED,
                                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            error: err
                                        };
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        error: err
                                    };
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED,
                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                error: err
                            };
                        });
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
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        error: err
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

    // delete All ROHS Alternate Alias for Component
    // Used in ROHS Alternate Alias validation from updateComponent()
    deleteAllROHSAlternetAliasPromise: (req, res, t) => {
        const {
            Component,
            ComponentROHSAlternatePN
        } = req.app.locals.models;
        var obj = {};
        if (req) {
            if (req.body.isRemoveRoHSAlternateParts &&
                req.body.isRemoveRoHSAlternateParts === true) {
                return ComponentROHSAlternatePN.findOne({
                    where: {
                        componentID: req.params.id,
                        isDeleted: false
                    },
                    transaction: t
                }).then((isexist) => {
                    if (isexist) {
                        COMMON.setModelDeletedByFieldValue(req);
                        obj = {
                            isDeleted: req.body.isDeleted,
                            deletedAt: req.body.deletedAt,
                            deletedBy: req.body.deletedBy,
                            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        };
                        return ComponentROHSAlternatePN.findAll({
                            where: {
                                aliasgroupID: isexist.aliasgroupID
                            },
                            transaction: t,
                            attributes: ['id', 'componentID', 'aliasgroupID']
                        }).then((componentRohsAlternatePnList) => {
                            if (componentRohsAlternatePnList.length === 2) {
                                return ComponentROHSAlternatePN.update(obj, {
                                    where: {
                                        id: {
                                            [Op.in]: _.map(componentRohsAlternatePnList, 'id')
                                        }
                                    },
                                    transaction: t
                                }).then(() => {
                                    var compObj = {
                                        rohsgroupID: null,
                                        updatedBy: req.body.deletedBy,
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                        updatedAt: COMMON.getCurrentUTC()
                                    };
                                    return Component.update(compObj, {
                                        where: {
                                            id: {
                                                [Op.in]: _.map(componentRohsAlternatePnList, 'componentID')
                                            }
                                        },
                                        transaction: t
                                    }).then(() => ({
                                        status: STATE.SUCCESS
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return {
                                            status: STATE.FAILED,
                                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            error: err
                                        };
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        error: err
                                    };
                                });
                            } else {
                                return ComponentROHSAlternatePN.update(obj, {
                                    where: {
                                        id: isexist.id
                                    },
                                    transaction: t
                                }).then(() => {
                                    var compObj = {
                                        rohsgroupID: null,
                                        updatedBy: req.body.deletedBy,
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                        updatedAt: COMMON.getCurrentUTC()
                                    };
                                    return Component.update(compObj, {
                                        where: {
                                            id: isexist.componentID
                                        },
                                        transaction: t
                                    }).then(() => ({
                                        status: STATE.SUCCESS
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return {
                                            status: STATE.FAILED,
                                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            error: err
                                        };
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        error: err
                                    };
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED,
                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                error: err
                            };
                        });
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
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        error: err
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

    // Used in updateComponent() to maintain Supplier PartStatus same as Mfg Part
    setSupplierComponentStatusPromise: (req, res, t, partDetail) => {
        const {
            Component
        } = req.app.locals.models;
        const mfgTypeName = DATA_CONSTANT.MFGCODE.MFGTYPE;
        if (partDetail.mfgType === mfgTypeName.MFG) {
            return {
                status: STATE.SUCCESS
            };
        } else if (partDetail.mfgType === mfgTypeName.DIST) {
            return Component.findOne({
                where: {
                    id: req.body.refSupplierMfgpnComponentID,
                    isDeleted: false
                },
                transaction: t
            }).then((isMfrPartExist) => {
                if (isMfrPartExist) {
                    if (isMfrPartExist.partStatus !== req.body.partStatus) {
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.PARTS.COMP_DIST_PART_STATUS_VALIDATION
                        };
                    } else {
                        return {
                            status: STATE.SUCCESS
                        };
                    }
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
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // delete All Drive Tools for Component
    // Used in updateComponent() to remove all drive tools when user untick respected tick from detail page
    deleteAllDriveToolsPromise: (req, res, t) => {
        const {
            ComponentDrivetools
        } = req.app.locals.models;
        var obj = {};
        COMMON.setModelDeletedByFieldValue(req);
        obj = {
            isDeleted: true,
            deletedBy: req.body.deletedBy,
            deletedAt: req.body.deletedAt,
            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
        };
        return ComponentDrivetools.update(obj, {
            where: {
                refComponentID: req.params.id,
                isDeleted: false
            },
            transaction: t
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err
            };
        });
    },

    // delete All Process Material for Component
    // Used in updateComponent() to remove all Process Material when user untick respected tick from detail page
    deleteAllProcessMaterialPromise: (req, res, t) => {
        const {
            ComponentProcessMaterial
        } = req.app.locals.models;
        var obj = {};
        COMMON.setModelDeletedByFieldValue(req);
        obj = {
            isDeleted: true,
            deletedBy: req.body.deletedBy,
            deletedAt: req.body.deletedAt,
            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
        };
        return ComponentProcessMaterial.update(obj, {
            where: {
                refComponentID: req.params.id,
                isDeleted: false
            },
            transaction: t
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err
            };
        });
    },
    // UOM validation for Part Update
    // Used in checkUOMValidationOnComponentUpdate() to validate UOM changes
    checkUOMValidationOnComponentUpdate: (req, res, partDetail, t) => {
        const {
            PackingSlipMaterialReceiveDet,
            ReserveStockRequest
        } = req.app.locals.models;
        return PackingSlipMaterialReceiveDet.findOne({
            where: {
                partID: req.params.id,
                isDeleted: false
            },
            transaction: t
        }).then((responsePackingSlip) => {
            if (responsePackingSlip && partDetail.functionalCategoryID !== -1 &&
                (partDetail.uom !== req.body.uom || partDetail.unit !== req.body.unit)) {
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.PARTS.COMP_MARERIAL_RECEIDED_UOM_VALIDATION
                };
            } else {
                return ReserveStockRequest.findOne({
                    where: {
                        [Op.or]: {
                            partID: req.params.id,
                            assyID: req.params.id
                        },
                        isDeleted: false
                    },
                    transaction: t
                }).then((responseReserveStock) => {
                    if (responseReserveStock && partDetail.functionalCategoryID !== -1 &&
                        (partDetail.uom !== req.body.uom || partDetail.unit !== req.body.unit)) {
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.PARTS.COMP_RESERVED_STOCK_UOM_VALIDATION
                        };
                    } else {
                        return {
                            status: STATE.SUCCESS
                        };
                    }
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                error: err
            };
        });
    },

    // Update Packaging Alias while restrict part
    // Used in updateComponent() method
    updateRestrictFlagForPackagingAlias: (req, res, ppackaginggroupID, t) => {
        const {
            Component,
            ComponentPackagingAlias
        } = req.app.locals.models;
        var obj = {};
        return ComponentPackagingAlias.findAll({
            where: {
                componentID: {
                    [Op.ne]: req.params.id
                },
                aliasgroupID: ppackaginggroupID,
                isDeleted: false
            },
            transaction: t
        }).then((isexist) => {
            if (isexist) {
                obj = {
                    updatedBy: req.body.updatedBy,
                    restrictUsePermanently: req.body.restrictUsePermanently,
                    restrictUSEwithpermission: req.body.restrictUSEwithpermission,
                    restrictPackagingUsePermanently: false,
                    restrictPackagingUseWithpermission: false,
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                    updatedAt: COMMON.getCurrentUTC()
                };
                return Component.update(obj, {
                    where: {
                        id: {
                            [Op.in]: _.map(isexist, item => item.componentID)
                        },
                        isDeleted: false
                    },
                    transaction: t
                }).then((rowsUpdated) => {
                    if (rowsUpdated) {
                        return {
                            status: STATE.SUCCESS
                        };
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
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err
                    };
                });
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
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err
            };
        });
    },
    // Update supplier part while restrict mfg part
    // Used in updateComponent() method
    updateSupplierPartsFromMfgPart: (req, res, t, partDetail) => {
        const {
            Component
        } = req.app.locals.models;
        var updateComponentObj = {};
        return Component.findAll({
            where: {
                refSupplierMfgpnComponentID: req.params.id,
                isDeleted: false
            },
            transaction: t
        }).then((isexist) => {
            if (Array.isArray(isexist) && isexist.length > 0) {
                updateComponentObj = {
                    updatedBy: req.body.updatedBy,
                    restrictUsePermanently: req.body.restrictUsePermanently,
                    restrictUSEwithpermission: req.body.restrictUSEwithpermission,
                    restrictPackagingUsePermanently: req.body.restrictPackagingUsePermanently,
                    restrictPackagingUseWithpermission: req.body.restrictPackagingUseWithpermission,
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                    updatedAt: COMMON.getCurrentUTC(),
                    functionalCategoryID: req.body.functionalCategoryID,
                    mountingTypeID: req.body.mountingTypeID,
                    partPackageID: req.body.partPackageID,
                    operatingTemp: req.body.operatingTemp,
                    minOperatingTemp: req.body.minOperatingTemp,
                    maxOperatingTemp: req.body.maxOperatingTemp,
                    temperatureCoefficient: req.body.temperatureCoefficient,
                    temperatureCoefficientValue: req.body.temperatureCoefficientValue,
                    temperatureCoefficientUnit: req.body.temperatureCoefficientUnit,
                    connecterTypeID: req.body.connecterTypeID,
                    noOfPosition: req.body.noOfPosition,
                    noOfRows: req.body.noOfRows,
                    pitch: req.body.pitch,
                    pitchMating: req.body.pitchMating,
                    length: req.body.length,
                    width: req.body.width,
                    height: req.body.height,
                    tolerance: req.body.tolerance,
                    voltage: req.body.voltage,
                    value: req.body.value,
                    powerRating: req.body.powerRating,
                    weight: req.body.weight,
                    feature: req.body.feature,
                    color: req.body.color,
                    isFluxNotApplicable: req.body.isFluxNotApplicable,
                    isNoClean: req.body.isNoClean,
                    isWaterSoluble: req.body.isWaterSoluble,
                    isHazmatMaterial: req.body.isHazmatMaterial,
                    isReceiveBulkItem: req.body.isReceiveBulkItem,
                    isEpoxyMount: req.body.isEpoxyMount
                };
                if (partDetail.partStatus !== req.body.partStatus) {
                    updateComponentObj.partStatus = req.body.partStatus;
                    updateComponentObj.obsoleteDate = req.body.obsoleteDate;
                    updateComponentObj.reversalDate = req.body.reversalDate;
                }
                return Component.update(updateComponentObj, {
                    where: {
                        refSupplierMfgpnComponentID: req.params.id,
                        isDeleted: false
                    },
                    transaction: t
                }).then((rowsUpdated) => {
                    if (rowsUpdated) {
                        return {
                            status: STATE.SUCCESS
                        };
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
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err
                    };
                });
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
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err
            };
        });
    },

    // Manage Oddely Ref Des Entry
    // Used in updateComponent() method
    manangeOddelyRefDes: (req, res, t) => {
        const {
            ComponentOddelyREFDES
        } = req.app.locals.models;
        const delrefdesPromise = [];
        if (req.body.removeOddelyRefDesIds.length > 0) {
            delrefdesPromise.push(ComponentOddelyREFDES.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                where: {
                    refComponentID: req.params.id,
                    id: req.body.removeOddelyRefDesIds
                },
                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                transaction: t
            }));
        }
        return Promise.all(delrefdesPromise).then((resp) => {
            const newRefDes = [];
            const updateRefDes = [];
            const refdesPromise = [];
            _.each(req.body.oddelyRefDesList, (objRefdes) => {
                if (objRefdes.id) {
                    updateRefDes.push(objRefdes);
                } else {
                    newRefDes.push(objRefdes);
                }
            });
            COMMON.setModelCreatedArrayFieldValue(req.user, newRefDes);
            refdesPromise.push(ComponentOddelyREFDES.bulkCreate(newRefDes, {
                fields: inputFieldsOddelyRefDes,
                transaction: t
            }));
            if (updateRefDes.length > 0) {
                COMMON.setModelUpdatedByArrayFieldValue(req.user, updateRefDes);
                _.each(updateRefDes, (q) => {
                    refdesPromise.push(
                        ComponentOddelyREFDES.findOne({
                            where: {
                                id: q.id
                            },
                            fields: ['id', 'refDes']
                        }).then((res) => {
                            if (res) {
                                return ComponentOddelyREFDES.update(q, {
                                    fields: inputFieldsOddelyRefDes,
                                    where: { id: q.id },
                                    transaction: t
                                })
                            } else {
                                return {
                                    status: STATE.SUCCESS
                                };
                            }
                        })
                    );
                });
            }
            return Promise.all(refdesPromise).then((resp) => {
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

        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err
            };
        });
    },
    // Update device marking in supplier part and packaging alias while updating mfg part
    // Used in updateComponent() method
    updateDeviceMarkingForSupplierPartsAndPackagingAlias: (req, res, ppackaginggroupID, t) => {
        const {
            ComponentPackagingAlias,
            Component
        } = req.app.locals.models;
        var compObj = {};
        return ComponentPackagingAlias.findAll({
            where: {
                aliasgroupID: ppackaginggroupID,
                isDeleted: false
            },
            attributes: ['componentID'],
            transaction: t
        }).then((isexist) => {
            var componentIds = [];
            if (isexist && isexist.length > 0) {
                componentIds = _.map(isexist, item => item.componentID);
            } else {
                componentIds = [req.params.id];
            }
            compObj = {
                deviceMarking: req.body.deviceMarking,
                updatedBy: req.body.updatedBy,
                updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                updatedAt: COMMON.getCurrentUTC()
            };
            return Component.update(compObj, {
                where: {
                    [Op.or]: [{
                        id: {
                            [Op.in]: componentIds
                        }
                    },
                    {
                        refSupplierMfgpnComponentID: {
                            [Op.in]: componentIds
                        }
                    }
                    ],
                    isDeleted: false
                },
                transaction: t
            }).then(() => ({
                status: STATE.SUCCESS
            })).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err
                };
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err
            };
        });
    },

    // delete Component
    // POST : /api/v1/component/deleteComponent
    // @param {id} int
    // @return delete component details
    deleteComponent: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Component.Name;
            const entityID = COMMON.AllEntityIDS.Component.ID;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((component) => {
                if (component.length === 0) {
                    // Delete Part Detail from Elastic Search
                    EnterpriseSearchController.deletePartDetailInElastic(req.body.objIDs.id.toString());
                    EnterpriseSearchController.deleteSPNOnDeleteMPN(req, req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(componentModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: component,
                        IDs: req.body.objIDs.id
                    }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // Get Component with Packaging Alias By Ids 
    // POST : /api/v1/component/retrieveComponentWithPackagaingAlias
    // @param {ids} int
    // @return Component
    retrieveComponentWithPackagaingAlias: (req, res) => {
        if (req.body.ids) {
            req.body.ids = Array.isArray(req.body.ids) ? req.body.ids.join(',') : req.body.ids;
            const {
                sequelize
            } = req.app.locals.models;
            return sequelize.query('CALL Sproc_GetComponentWithPackaginaAlias (:pPartId)', {
                replacements: {
                    pPartId: req.body.ids
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // Get List of Component MFG Alias for Autocomplete list
    // POST : /api/v1/component/getComponentMFGAliasSearch
    // @return List of Component manufactures Parts
    getComponentMFGAliasSearch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.listObj) {
            req.body.listObj.strictCustomPart = (req.body.listObj.strictCustomPart === false || req.body.listObj.strictCustomPart) ? req.body.listObj.strictCustomPart : null;
        }
        sequelize.query('CALL Sproc_GetComponentMFGAliasSearch(:pGoodPart,:pSearch,:pId,:pMfgType,:pRoHSStatusID,:pMfgCodeId,:pMountingType,:pMountingTypeId,:pCategoryID,:pIsContainCPN,:pRohsMainCategoryID,:pIsRohsMainCategoryInvertMatch,:prefSupplierMfgpnComponentID,:ppackagingID,:pstrictCustomPart,:pStrictCPNPart,:psupplierID,:pPartType,:pExcludeStatus)', {
            replacements: {
                pGoodPart: req.body.listObj.isGoodPart || null,
                pSearch: req.body.listObj.query || null,
                pId: req.body.listObj.id ? req.body.listObj.id : null,
                pMfgType: req.body.listObj.mfgType || null,
                pRoHSStatusID: req.body.listObj.RoHSStatusID ? req.body.listObj.RoHSStatusID : null,
                pMfgCodeId: (req.body.listObj.mfgcodeID || req.body.listObj.mfgcodeID === 0) ? req.body.listObj.mfgcodeID : null,
                pMountingType: req.body.listObj.mountingType || null,
                pMountingTypeId: req.body.listObj.mountingTypeID || null,
                pCategoryID: req.body.listObj.categoryID || null,
                pIsContainCPN: req.body.listObj.isContainCPN || null,
                pRohsMainCategoryID: req.body.listObj.rohsMainCategoryID || null,
                pIsRohsMainCategoryInvertMatch: req.body.listObj.isRohsMainCategoryInvertMatch || false,
                prefSupplierMfgpnComponentID: req.body.listObj.refSupplierMfgpnComponentID || null,
                ppackagingID: req.body.listObj.packagingID || null,
                pstrictCustomPart: req.body.listObj.strictCustomPart,
                pStrictCPNPart: req.body.listObj.strictCPNPart || false,
                psupplierID: req.body.listObj.supplierID || false,
                pPartType: req.body.listObj.partType || null,
                pExcludeStatus: req.body.listObj.exculdePartStatus || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[0])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Get List of Component MFG Alias for Autocomplete list
    // POST : /api/v1/component/getComponentMFGAliasSearch
    // @return List of Component manufactures Parts
    getComponentMFGAliasPartsSearch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.listObj) {
            req.body.listObj.strictCustomPart = (req.body.listObj.strictCustomPart === false || req.body.listObj.strictCustomPart) ? req.body.listObj.strictCustomPart : null;
        }
        sequelize.query('CALL Sproc_GetComponentMFGAliasPartsSearch(:pGoodPart,:pSearch,:pId,:pMfgType,:pMfgCodeId,:pMountingType,:pMountingTypeId,:pCategoryID,:pRohsMainCategoryID,:pIsRohsMainCategoryInvertMatch,:pstrictCustomPart,:pAlternatePartFilter,:pPackagingAliasFilter,:pRoHReplacementPartFilter,:pDriveToolsPartFilter,:pProcessMaterialPartFilter,:pRequireMatingPartFilter,:pPickupPadPartFilter,:pRequireFunctionalPartFilter,:pCurrentPartId)', {
            replacements: {
                pGoodPart: req.body.listObj.isGoodPart || null,
                pSearch: req.body.listObj.query || null,
                pId: req.body.listObj.id ? req.body.listObj.id : null,
                pMfgType: req.body.listObj.mfgType || null,
                pMfgCodeId: (req.body.listObj.mfgcodeID || req.body.listObj.mfgcodeID === 0) ? req.body.listObj.mfgcodeID : null,
                pMountingType: req.body.listObj.mountingType || null,
                pMountingTypeId: req.body.listObj.mountingTypeID || null,
                pCategoryID: req.body.listObj.categoryID || null,
                pRohsMainCategoryID: req.body.listObj.rohsMainCategoryID || null,
                pIsRohsMainCategoryInvertMatch: req.body.listObj.isRohsMainCategoryInvertMatch || false,
                pstrictCustomPart: req.body.listObj.strictCustomPart || false,
                pAlternatePartFilter: req.body.listObj.alternatePartFilter || false,
                pPackagingAliasFilter: req.body.listObj.packagingAliasFilter || false,
                pRoHReplacementPartFilter: req.body.listObj.roHReplacementPartFilter || false,
                pDriveToolsPartFilter: req.body.listObj.driveToolsPartFilter || false,
                pProcessMaterialPartFilter: req.body.listObj.processMaterialPartFilter || false,
                pRequireMatingPartFilter: req.body.listObj.requireMatingPartFilter || false,
                pPickupPadPartFilter: req.body.listObj.pickupPadPartFilter || false,
                pRequireFunctionalPartFilter: req.body.listObj.requireFunctionalPartFilter || false,
                pCurrentPartId: req.body.listObj.currentPartId || null,
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[0])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Get List of Component MFG Alias/PID Code/ Production PN for Autocomplete list
    // POST : /api/v1/component/getComponentMFGAliasPIDProdPNSearch
    // @return List of Component manufactures Parts
    getComponentMFGAliasPIDProdPNSearch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetComponentMFGPIDPRODPNAliasSearch(:pSearch,:pMfgType,:pIsAssy,:pId)', {
            replacements: {
                pSearch: req.body.listObj.query || null,
                pMfgType: req.body.listObj.mfgType || null,
                pIsAssy: req.body.listObj.isAssembly || false,
                pId: req.body.listObj.id || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[0])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get List of Component PID code
    // POST : /api/v1/component/getComponentPidCodeSearch
    // @return List of Component PID code
    getComponentPidCodeSearch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetComponentPidCodeSearch(:pSearch,:pId,:pMfgType,:pMfgCodeId,:pCategory)', {
            replacements: {
                pSearch: req.body.listObj.query || null,
                pId: req.body.listObj.id ? req.body.listObj.id : null,
                pMfgType: req.body.listObj.mfgType || null,
                pMfgCodeId: req.body.listObj.mfgcodeID ? req.body.listObj.mfgcodeID : null,
                pCategory: req.body.listObj.category || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[0])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get List of Component Alias group
    // GET : /api/v1/component/getComponentAliasGroup
    // @param {id} int
    // @return List of Component alias
    getComponentAliasGroup: (req, res) => {
        const {
            Component,
            MfgCodeMst,
            sequelize
        } = req.app.locals.models;
        var strWhere = '';
        if (req.body.id) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize
                .query('CALL Sproc_RetrieveComponentGroupList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pComponentId,:pIsFetchAll)', {
                    replacements: {
                        ppageIndex: req.body.Page || 0,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pComponentId: req.body.id,
                        pIsFetchAll: req.body.fetchAll || false
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[1]),
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
    // Get List of Assembly Revision
    // GET : /api/v1/component/getAssemblyRevisionList
    // @param {id} int
    // @return List of Assembly Revision
    getAssemblyRevisionList: (req, res) => {
        const { sequelize } = req.app.locals.models;

        var strWhere = '';
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize
                .query('CALL Sproc_RetrieveAssemblyRevisionList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pNickname,:pIsFetchAll)', {
                    replacements: {
                        ppageIndex: req.body.Page || 0,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pNickname: req.body.nickName,
                        pIsFetchAll: req.body.fetchAll || false
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[1]),
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

    // Retrive List of Component good/bad part group (Grid List page)
    // POST : /api/v1/component/getAlternetPartList
    // @return List of Component good/bad part group (Grid List page)
    getComponentGoodBadPartList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            const componentid = req.body.id ? req.body.id : null;

            return sequelize
                .query('CALL Sproc_RetrieveGoodBadParts (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pType,:pComponentID)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pType: req.body.type,
                        pComponentID: componentid
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    alternetPartList: _.values(response[1]),
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

    // to be called from createPackagingAlias() API method only
    createObjectForUpdateComponentPackagingAlias: (req, pAliasgroupID, pComponentSettings, pAliasDetails) => {
        var compObj = {
            packaginggroupID: pAliasgroupID,
            updatedBy: req.body.createdBy,
            updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
            updatedAt: COMMON.getCurrentUTC(),
            restrictUSEwithpermission: pComponentSettings.restrictUSEwithpermission,
            restrictUsePermanently: pComponentSettings.restrictUsePermanently,
            driverToolRequired: pComponentSettings.driverToolRequired,
            matingPartRquired: pComponentSettings.matingPartRquired,
            programingRequired: pComponentSettings.programingRequired,
            functionalTestingRequired: pComponentSettings.functionalTestingRequired,
            requiredTestTime: pComponentSettings.requiredTestTime,
            pickupPadRequired: pComponentSettings.pickupPadRequired,
            partStatus: pComponentSettings.partStatus,
            uom: pComponentSettings.uom,
            isEpoxyMount: pComponentSettings.isEpoxyMount,
            connecterTypeID: pComponentSettings.connecterTypeID,
            noOfRows: pComponentSettings.noOfRows,
        };
        if (pComponentSettings.restrictUSEwithpermission || pComponentSettings.restrictUsePermanently) {
            compObj.restrictPackagingUseWithpermission = false;
            compObj.restrictPackagingUsePermanently = false;
            pAliasDetails.restrictPackagingUseWithpermission = false;
            pAliasDetails.restrictPackagingUsePermanently = false;
        }

        pAliasDetails.restrictUSEwithpermission = pComponentSettings.restrictUSEwithpermission;
        pAliasDetails.restrictUsePermanently = pComponentSettings.restrictUsePermanently;
        pAliasDetails.driverToolRequired = pComponentSettings.driverToolRequired;
        pAliasDetails.matingPartRquired = pComponentSettings.matingPartRquired;
        pAliasDetails.programingRequired = pComponentSettings.programingRequired;
        pAliasDetails.functionalTestingRequired = pComponentSettings.functionalTestingRequired;
        pAliasDetails.requiredTestTime = pComponentSettings.requiredTestTime;
        pAliasDetails.pickupPadRequired = pComponentSettings.pickupPadRequired;
        pAliasDetails.partStatus = pComponentSettings.partStatus;
        pAliasDetails.uom = pComponentSettings.uom;
        pAliasDetails.isEpoxyMount = pComponentSettings.isEpoxyMount;
        pAliasDetails.connecterTypeID = pComponentSettings.connecterTypeID;
        pAliasDetails.noOfRows = pComponentSettings.noOfRows;

        return compObj;
    },
    // to be called from createPackagingAlias() API method only
    createPackagingAliasPromise: (req, res, pAlias, pParentComponentSettings, pAliasComponentSettings, t) => {
        const {
            Component,
            ComponentPackagingAlias,
            sequelize
        } = req.app.locals.models;
        const componentPackagingAliasModuleName = DATA_CONSTANT.PACKAGING_ALIAS.Name;
        var obj = {};

        if (!pAlias.parentPackaginggroupID && !pAlias.aliasgroupID) {
            return UTILITY_CONTROLLER.getSystemIdPromise(req, res, Pricing.PackagingGroupID, t).then((responseSerialNo) => {
                if (responseSerialNo.status === STATE.SUCCESS) {
                    pAlias.aliasgroupID = responseSerialNo.systemId;
                    obj = {
                        aliasgroupID: pAlias.aliasgroupID,
                        componentID: pAlias.componetID,
                        createdBy: req.body.createdBy,
                        updatedBy: req.body.createdBy,
                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };
                    return ComponentPackagingAlias.create(obj, {
                        transaction: t
                    }).then((aliasDetails) => {
                        obj.componentID = pAlias.parentComponentID;
                        return ComponentPackagingAlias.create(obj, {
                            transaction: t
                        }).then(() => {
                            var compObj = module.exports.createObjectForUpdateComponentPackagingAlias(req, aliasDetails.aliasgroupID, pParentComponentSettings, aliasDetails);
                            return Component.update(compObj, {
                                where: {
                                    id: {
                                        [Op.in]: [pAlias.componetID, pAlias.parentComponentID]
                                    },
                                    isDeleted: false
                                },
                                transaction: t
                            }).then(() => {
                                compObj.aliasgroupID = aliasDetails.aliasgroupID;
                                compObj.componentID = aliasDetails.componentID;
                                compObj.id = aliasDetails.id;
                                return {
                                    status: STATE.SUCCESS,
                                    message: MESSAGE_CONSTANT.CREATED(componentPackagingAliasModuleName),
                                    data: compObj
                                };
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    error: err
                                };
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED,
                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                error: err
                            };
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            error: err
                        };
                    });
                } else {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        error: err
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else if (pAlias.parentPackaginggroupID && !pAlias.aliasgroupID) {
            obj = {
                aliasgroupID: pAlias.parentPackaginggroupID,
                componentID: pAlias.componetID,
                createdBy: req.body.createdBy,
                updatedBy: req.body.createdBy,
                createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return ComponentPackagingAlias.count({
                where: {
                    aliasgroupID: pAlias.parentPackaginggroupID,
                    componentID: pAlias.componetID
                }
            }).then((count) => {
                if (count > 0) {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.PARTS.PACKAGING_MPPING
                    };
                } else {
                    return ComponentPackagingAlias.create(obj, {
                        transaction: t
                    }).then((aliasDetails) => {
                        var compObj = module.exports.createObjectForUpdateComponentPackagingAlias(req, aliasDetails.aliasgroupID, pParentComponentSettings, aliasDetails);
                        return Component.update(compObj, {
                            where: {
                                id: {
                                    [Op.in]: [pAlias.componetID]
                                },
                                isDeleted: false
                            },
                            transaction: t
                        }).then(() => {
                            compObj.aliasgroupID = aliasDetails.aliasgroupID;
                            compObj.componentID = aliasDetails.componentID;
                            compObj.id = aliasDetails.id;
                            return {
                                status: STATE.SUCCESS,
                                message: MESSAGE_CONSTANT.CREATED(componentPackagingAliasModuleName),
                                data: compObj
                            };
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED,
                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                error: err
                            };
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            error: err
                        };
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else if (!pAlias.parentPackaginggroupID && pAlias.aliasgroupID) {
            obj = {
                aliasgroupID: pAlias.aliasgroupID,
                componentID: pAlias.parentComponentID,
                createdBy: req.body.createdBy,
                updatedBy: req.body.createdBy,
                createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return ComponentPackagingAlias.count({
                where: {
                    aliasgroupID: pAlias.aliasgroupID,
                    componentID: pAlias.parentComponentID
                }
            }).then((count) => {
                if (count > 0) {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.PARTS.PACKAGING_MPPING
                    };
                } else {
                    return ComponentPackagingAlias.create(obj, {
                        transaction: t
                    }).then((aliasDetails) => {
                        var compObj = module.exports.createObjectForUpdateComponentPackagingAlias(req, aliasDetails.aliasgroupID, pParentComponentSettings, aliasDetails);
                        return Component.update(compObj, {
                            where: {
                                [Op.or]: [
                                    {
                                        packaginggroupID: aliasDetails.aliasgroupID,
                                    }, {
                                        id: pAlias.parentComponentID
                                    }],
                                isDeleted: false
                            },
                            transaction: t
                        }).then(() => {
                            compObj.aliasgroupID = aliasDetails.aliasgroupID;
                            compObj.componentID = aliasDetails.componentID;
                            compObj.id = aliasDetails.id;
                            return {
                                status: STATE.SUCCESS,
                                message: MESSAGE_CONSTANT.CREATED(componentPackagingAliasModuleName),
                                data: compObj
                            };
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED,
                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                error: err
                            };
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            error: err
                        };
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else if (pAlias.parentPackaginggroupID && pAlias.aliasgroupID) {
            if (pAlias.parentPackaginggroupID !== pAlias.aliasgroupID) {
                obj = {
                    aliasgroupID: pAlias.parentPackaginggroupID,
                    updatedBy: req.body.createdBy,
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                    updatedAt: COMMON.getCurrentUTC()
                };
                return ComponentPackagingAlias.update(obj, {
                    where: {
                        aliasgroupID: pAlias.aliasgroupID,
                        isDeleted: false
                    },
                    transaction: t
                }).then((aliasDetails) => {
                    var objComponent = module.exports.createObjectForUpdateComponentPackagingAlias(req, pAlias.parentPackaginggroupID, pParentComponentSettings, aliasDetails);
                    return Component.update(objComponent, {
                        where: {
                            packaginggroupID: pAlias.aliasgroupID,
                            isDeleted: false
                        },
                        transaction: t
                    }).then(() => {
                        objComponent.aliasgroupID = aliasDetails.aliasgroupID;
                        objComponent.componentID = aliasDetails.componentID;
                        objComponent.id = aliasDetails.id;
                        return {
                            status: STATE.SUCCESS,
                            message: MESSAGE_CONSTANT.CREATED(componentPackagingAliasModuleName),
                            data: objComponent
                        };
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            error: err
                        };
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        error: err
                    };
                });
            } else {
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.PARTS.PACKAGING_MPPING
                };
            }
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.PARTS.PACKAGING_MPPING
            };
        }
    },
    // to be called from createulkPackagingAlias() API method only
    addBulkPackagingAlias: (req, res) => {
        const {
            Component,
            ComponentPackagingAlias,
            sequelize
        } = req.app.locals.models;
        COMMON.setModelCreatedByFieldValue(req);
        const alias = req.body;
        const componentPackagingAliasModuleName = DATA_CONSTANT.PACKAGING_ALIAS.Name;
        const componentIds = req.body.addedPackagingAliasList.map(a => a.id);
        componentIds.push(alias.parentComponentID);
        return Component.findAll({
            where: {
                id: {
                    [Op.in]: componentIds
                }
            },
            attributes: ['id', 'partStatus', 'uom', 'feature', 'connecterTypeID', 'noOfRows', 'packaginggroupID', 'restrictUSEwithpermission', 'restrictUsePermanently', 'restrictPackagingUseWithpermission', 'restrictPackagingUsePermanently', 'driverToolRequired', 'matingPartRquired', 'pickupPadRequired', 'programingRequired', 'functionalTestingRequired', 'requiredTestTime', 'isEpoxyMount']
        }).then((response) => {
            const parentComponentSettings = response.find(x => x.id === parseInt(alias.parentComponentID));
            const pacgkaingAliasPart = response.find(x => x.id !== parseInt(alias.parentComponentID));
            alias.parentPackaginggroupID = parentComponentSettings.packaginggroupID;
            const maxValOfPermission = _.maxBy(response, 'restrictUSEwithpermission');
            const minValOfPermission = _.minBy(response, 'restrictUSEwithpermission');
            const maxValOfPermanently = _.maxBy(response, 'restrictUsePermanently');
            const minValOfPermanently = _.minBy(response, 'restrictUsePermanently');
            const bomActivityPromise = [];

            if (maxValOfPermission !== minValOfPermission || maxValOfPermanently !== minValOfPermanently) {
                bomActivityPromise.push(module.exports.bomActivityStartedValidationForAllPackagingAliasParts(req, parentComponentSettings.packaginggroupID, parentComponentSettings.id));
                req.body.addedPackagingAliasList.forEach((item) => {
                    bomActivityPromise.push(module.exports.bomActivityStartedValidationForAllPackagingAliasParts(req, item.packaginggroupID, item.id));
                })
            }

            return Promise.all(bomActivityPromise).then((respBOMActivity) => {
                var resObj = _.find(respBOMActivity, resp => resp.status === STATE.FAILED);
                if (resObj) {
                    const validationData = resObj.assemblyList ? resObj.assemblyList : null;
                    if (resObj.message) {
                        if (validationData != null) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                assemblyList: validationData
                            }, null);
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: resObj.message,
                                err: null,
                                data: validationData
                            });
                        }
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentPackagingAliasModuleName),
                            err: null,
                            data: validationData
                        });
                    }
                } else {
                    // =>> success: call create packaging alias promise
                    return sequelize.transaction().then((t) => {
                        const promisesPackagingGroupId = [];                        /*
                        CASE 1: To Part have Group ID Then Copy all part into this part
                        CASE 2: To Part have not Group Id then And have multiple Group then take max group number and move all other part into this group
                        CASE 3: To Part have not Group Id then And have Single Group then Move To Part ID into that Grooup ID
                        CASE 4: To Part have not Group ID and also their is not any Group ID then Generate New group ID
                        */
                        const groupIds = _(req.body.addedPackagingAliasList).filter(object => object.packaginggroupID).groupBy('packaginggroupID').value();
                        const countOfPackagGroup = Object.keys(groupIds).length;

                        // CASE 1: To Part have Group ID Then Copy all part into this part
                        if (parentComponentSettings.packaginggroupID && countOfPackagGroup === 0) {
                            const updateComponentDet = response.filter(x => x.packaginggroupID !== parentComponentSettings.packaginggroupID);
                            promisesPackagingGroupId.push(Promise.resolve({
                                status: STATE.SUCCESS,
                                packaginggroupID: parentComponentSettings.packaginggroupID,
                                parentComponentSettings: parentComponentSettings,
                                addAliasId: updateComponentDet.map(a => a.id),
                                updateComponentId: updateComponentDet.map(a => a.id)
                            }));
                        }
                        // CASE 4: To Part have not Group ID and also their is not any Group ID then Generate New group ID
                        else if ((!parentComponentSettings.packaginggroupID && countOfPackagGroup === 0) ||
                            (parentComponentSettings.packaginggroupID && countOfPackagGroup > 0)) {
                            promisesPackagingGroupId.push(UTILITY_CONTROLLER.getSystemIdPromise(req, res, Pricing.PackagingGroupID, t).then((responseSerialNo) => {
                                if (responseSerialNo.status === STATE.SUCCESS) {
                                    const addComponentDet = response.filter(x => !x.packaginggroupID);
                                    return {
                                        status: STATE.SUCCESS,
                                        packaginggroupID: responseSerialNo.systemId,
                                        parentComponentSettings: parentComponentSettings,
                                        addAliasId: addComponentDet.map(a => a.id),
                                        updateComponentId: componentIds,
                                        packaginggroupIds: response.map(x => x.packaginggroupID)
                                    }
                                } else {
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        error: err
                                    };
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    error: err
                                };
                            }));
                        }
                        // CASE 2: To Part have not Group Id then And have multiple Group then take max group number and move all other part into this group
                        // CASE 3: To Part have not Group Id then And have Single Group then Move To Part ID into that Grooup ID
                        else if (!parentComponentSettings.packaginggroupID && ((countOfPackagGroup > 1) || (countOfPackagGroup === 1))) {
                            const packaginggroupDet = _.maxBy(req.body.addedPackagingAliasList, 'packaginggroupID');
                            const componentSetting = response.find(x => x.packaginggroupID === packaginggroupDet.packaginggroupID);
                            const updateComponentDet = response.filter(x => x.packaginggroupID && x.packaginggroupID !== componentSetting.packaginggroupID);
                            const addNewAliasDets = response.filter(a => !a.packaginggroupID);
                            promisesPackagingGroupId.push(Promise.resolve({
                                status: STATE.SUCCESS,
                                packaginggroupID: packaginggroupDet.packaginggroupID,
                                parentComponentSettings: componentSetting,
                                addAliasId: addNewAliasDets.map(a => a.id),
                                updateComponentId: updateComponentDet.map(a => a.id),
                                packaginggroupIds: updateComponentDet.map(a => a.packaginggroupID),
                            }));
                        }
                        return Promise.all(promisesPackagingGroupId).then((respPackagingGroup) => {
                            var resObj = _.find(respPackagingGroup, resp => resp.status === STATE.FAILED);
                            if (resObj) {
                                const validationData = resObj.assemblyList ? resObj.assemblyList : null;
                                if (resObj.message) {
                                    if (validationData != null) {
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                            assemblyList: validationData
                                        }, null);
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: resObj.message,
                                            err: null,
                                            data: validationData
                                        });
                                    }
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentPackagingAliasModuleName),
                                        err: null,
                                        data: validationData
                                    });
                                }
                            } else {
                                const aliasDets = respPackagingGroup[0];
                                const addNewAlias = [];
                                _.each(aliasDets.addAliasId, (item) => {
                                    addNewAlias.push({
                                        aliasgroupID: aliasDets.packaginggroupID,
                                        componentID: item
                                    });
                                });
                                COMMON.setModelCreatedArrayFieldValue(req.user, addNewAlias);
                                return ComponentPackagingAlias.bulkCreate(addNewAlias, {
                                    transaction: t
                                }).then(() => {
                                    let updateComponentId = [];
                                    updateComponentId.push(aliasDets.id)
                                    let whereClause = { isDeleted: false };

                                    if (aliasDets.addAliasId && Array.isArray(aliasDets.addAliasId) && aliasDets.addAliasId.length > 0) {
                                        updateComponentId = aliasDets.updateComponentId.concat(aliasDets.addAliasId);
                                    }
                                    whereClause[Op.or] = [{
                                        id: {
                                            [Op.in]: updateComponentId
                                        },
                                    }];
                                    if (aliasDets.packaginggroupIds && Array.isArray(aliasDets.packaginggroupIds) && aliasDets.packaginggroupIds.length > 0) {
                                        whereClause[Op.or].push({
                                            packaginggroupID: {
                                                [Op.in]: aliasDets.packaginggroupIds
                                            },
                                        });
                                    }
                                    return Component.findAll({
                                        where: whereClause,
                                        attributes: ['id', 'partStatus', 'uom', 'feature', 'connecterTypeID', 'noOfRows', 'packaginggroupID', 'restrictUSEwithpermission', 'restrictUsePermanently', 'restrictPackagingUseWithpermission', 'restrictPackagingUsePermanently', 'driverToolRequired', 'matingPartRquired', 'pickupPadRequired', 'programingRequired', 'functionalTestingRequired', 'requiredTestTime', 'isEpoxyMount'],
                                        transaction: t
                                    }).then((componentList) => {
                                        const promisesAddEditPartDet = [];
                                        if (Array.isArray(aliasDets.packaginggroupIds) && aliasDets.packaginggroupIds.length > 0) {
                                            COMMON.setModelUpdatedByFieldValue(req);
                                            const updateObj = {
                                                aliasgroupID: aliasDets.packaginggroupID,
                                                updatedBy: req.body.createdBy,
                                                updateByRoleId: req.body.updateByRoleId,
                                                updatedAt: req.body.updatedAt
                                            }
                                            promisesAddEditPartDet.push(ComponentPackagingAlias.update(updateObj, {
                                                where: {
                                                    aliasgroupID: {
                                                        [Op.in]: aliasDets.packaginggroupIds
                                                    }
                                                },
                                                transaction: t
                                            }).then(() => {
                                                return {
                                                    status: STATE.SUCCESS,
                                                    message: MESSAGE_CONSTANT.UPDATED(componentPackagingAliasModuleName)
                                                };
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return {
                                                    status: STATE.FAILED,
                                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    error: err
                                                };
                                            }));
                                        }
                                        aliasDets.parentComponentSettings = response.find(x => x.id === req.body.parentComponentID);
                                        if (aliasDets.parentComponentSettings.restrictUSEwithpermission || aliasDets.parentComponentSettings.restrictUsePermanently) {
                                            aliasDets.restrictPackagingUseWithpermission = false;
                                            aliasDets.restrictPackagingUsePermanently = false;
                                        }
                                        aliasDets.packaginggroupIds = req.body.addedPackagingAliasList.map(a => a.packaginggroupID);
                                        whereClause = {
                                            [Op.or]: [
                                                {
                                                    id: {
                                                        [Op.in]: componentIds
                                                    },
                                                }, {
                                                    packaginggroupID: {
                                                        [Op.in]: aliasDets.packaginggroupIds
                                                    }
                                                }]
                                        };
                                        var compObj = {
                                            packaginggroupID: aliasDets.packaginggroupID,
                                            updatedBy: req.body.createdBy,
                                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                            updatedAt: COMMON.getCurrentUTC(),
                                            restrictUSEwithpermission: aliasDets.parentComponentSettings.restrictUSEwithpermission,
                                            restrictUsePermanently: aliasDets.parentComponentSettings.restrictUsePermanently,
                                            driverToolRequired: aliasDets.parentComponentSettings.driverToolRequired,
                                            matingPartRquired: aliasDets.parentComponentSettings.matingPartRquired,
                                            programingRequired: aliasDets.parentComponentSettings.programingRequired,
                                            functionalTestingRequired: aliasDets.parentComponentSettings.functionalTestingRequired,
                                            requiredTestTime: aliasDets.parentComponentSettings.requiredTestTime,
                                            pickupPadRequired: aliasDets.parentComponentSettings.pickupPadRequired,
                                            partStatus: aliasDets.parentComponentSettings.partStatus,
                                            uom: aliasDets.parentComponentSettings.uom,
                                            isEpoxyMount: aliasDets.parentComponentSettings.isEpoxyMount,
                                            connecterTypeID: aliasDets.parentComponentSettings.connecterTypeID,
                                            noOfRows: aliasDets.parentComponentSettings.noOfRows,
                                        };
                                        promisesAddEditPartDet.push(Component.update(compObj, {
                                            where: whereClause,
                                            transaction: t
                                        }).then(() => {
                                            return {
                                                status: STATE.SUCCESS,
                                                message: MESSAGE_CONSTANT.UPDATED(componentPackagingAliasModuleName)
                                            };
                                        }).catch((err) => {
                                            return {
                                                status: STATE.FAILED,
                                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                error: err
                                            };
                                        }));
                                        return Promise.all(promisesAddEditPartDet).then((respPartUpdate) => {
                                            var respPartUpdateObj = _.find(respPartUpdate, respVersion => respVersion.status === STATE.FAILED);
                                            if (respPartUpdateObj) {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                    messageContent: respPartUpdateObj.message,
                                                    err: respPartUpdateObj.err,
                                                    data: respPartUpdateObj.data
                                                });
                                            } else {
                                                const promisesBOMInternalVersion = [];
                                                // ==>> success: call BOM internal Version change
                                                req.body.programingRequired = aliasDets.parentComponentSettings.programingRequired;
                                                req.body.matingPartRquired = aliasDets.parentComponentSettings.matingPartRquired;
                                                req.body.driverToolRequired = aliasDets.parentComponentSettings.driverToolRequired;
                                                req.body.functionalTestingRequired = aliasDets.parentComponentSettings.functionalTestingRequired;
                                                req.body.pickupPadRequired = aliasDets.parentComponentSettings.pickupPadRequired;
                                                req.body.partStatus = aliasDets.parentComponentSettings.partStatus;
                                                req.body.uom = aliasDets.parentComponentSettings.uom;
                                                req.body.isEpoxyMount = aliasDets.parentComponentSettings.isEpoxyMount;
                                                req.body.connecterTypeID = aliasDets.parentComponentSettings.connecterTypeID;
                                                req.body.noOfRows = aliasDets.parentComponentSettings.noOfRows;
                                                parentComponentSettings.packaginggroupID = aliasDets.parentComponentSettings.packaginggroupID;
                                                _.each(componentList, (partDet) => {
                                                    // required to call for both parts because in some case parent part setting change and in some case alias part setting change
                                                    if (req.body.programingRequired !== partDet.programingRequired ||
                                                        req.body.matingPartRquired !== partDet.matingPartRquired ||
                                                        req.body.driverToolRequired !== partDet.driverToolRequired ||
                                                        req.body.functionalTestingRequired !== partDet.functionalTestingRequired ||
                                                        req.body.partStatus !== partDet.partStatus ||
                                                        req.body.uom !== partDet.uom ||
                                                        req.body.isEpoxyMount !== partDet.isEpoxyMount ||
                                                        req.body.pickupPadRequired !== partDet.pickupPadRequired ||
                                                        req.body.connecterTypeID !== partDet.connecterTypeID ||
                                                        req.body.noOfRows !== partDet.noOfRows) {
                                                        promisesBOMInternalVersion.push(module.exports.updateBOMInternalVersionPackagingAliasPartsPromise(req, partDet, t));
                                                    }
                                                });
                                                // ==>> success: call BOM internal Version change

                                                return Promise.all(promisesBOMInternalVersion).then((respBOMInternalVersion) => {
                                                    var respBOMInternalVersionObj = _.find(respBOMInternalVersion, respVersion => respVersion.status === STATE.FAILED);
                                                    if (respBOMInternalVersionObj) {
                                                        if (!t.finished) {
                                                            t.rollback();
                                                        }
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                            messageContent: respBOMInternalVersionObj.message,
                                                            err: respBOMInternalVersionObj.err,
                                                            data: respBOMInternalVersionObj.data
                                                        });
                                                    } else {
                                                        return t.commit().then(() => {
                                                            _.each(componentList, (partDet) => {
                                                                req.params.id = partDet.id;
                                                                EnterpriseSearchController.managePartDetailInElastic(req);
                                                            });
                                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, aliasDets.parentComponentSettings,
                                                                MESSAGE_CONSTANT.CREATED(componentPackagingAliasModuleName))
                                                        });
                                                    }
                                                }).catch((err) => {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    console.trace();
                                                    console.error(err);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                        err: err,
                                                        data: null
                                                    });
                                                });
                                            }
                                        }).catch((err) => {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                    }).catch((err) => {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    });
                                }).catch((err) => {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            }
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                    // <<== success: call create packaging alias promise
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Create PackagingAlias
    // POST : /api/v1/component/createPackagingAlias
    // @return New create Packaging Alias detail
    createPackagingAlias: (req, res) => {
        const {
            Component,
            /* ComponentPackagingAlias,*/
            sequelize
        } = req.app.locals.models;
        // var obj = {};
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const alias = req.body.componentObj;
            const componentPackagingAliasModuleName = DATA_CONSTANT.PACKAGING_ALIAS.Name;

            return Component.findAll({
                where: {
                    id: {
                        [Op.in]: [alias.componetID, alias.parentComponentID]
                    }
                },
                attributes: ['id', 'partStatus', 'uom', 'feature', 'connecterTypeID', 'noOfRows', 'packaginggroupID', 'restrictUSEwithpermission', 'restrictUsePermanently', 'restrictPackagingUseWithpermission', 'restrictPackagingUsePermanently', 'driverToolRequired', 'matingPartRquired', 'pickupPadRequired', 'programingRequired', 'functionalTestingRequired', 'requiredTestTime', 'isEpoxyMount']
            }).then((response) => {
                const parentComponentSettings = response.find(x => x.id === parseInt(alias.parentComponentID));
                const aliasComponentSettings = response.find(x => x.id === parseInt(alias.componetID));
                alias.parentPackaginggroupID = parentComponentSettings.packaginggroupID;
                alias.aliasgroupID = aliasComponentSettings.packaginggroupID;
                const promisesBOMActivity = [];
                // 2 activity started for Parent PArt its alias group and Alias Part its alias group
                promisesBOMActivity.push(module.exports.bomActivityStartedValidationForAllPackagingAliasParts(req, alias.parentPackaginggroupID, alias.parentComponentID));
                promisesBOMActivity.push(module.exports.bomActivityStartedValidationForAllPackagingAliasParts(req, alias.aliasgroupID, alias.componetID));

                return Promise.all(promisesBOMActivity).then((respBOMActivity) => {
                    var resObj = _.find(respBOMActivity, resp => resp.status === STATE.FAILED);
                    if (resObj) {
                        const validationData = resObj.assemblyList ? resObj.assemblyList : null;
                        if (resObj.message) {
                            if (validationData != null) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    assemblyList: validationData
                                }, null);
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: resObj.message,
                                    err: null,
                                    data: validationData
                                });
                            }
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentPackagingAliasModuleName),
                                err: null,
                                data: validationData
                            });
                        }
                    } else {
                        // =>> success: call create packaging alias promise
                        return sequelize.transaction().then((t) => {
                            const promisesBOMInternalVersion = [];
                            return module.exports.createPackagingAliasPromise(req, res, alias, parentComponentSettings, aliasComponentSettings, t)
                                .then((resPackagingAlias) => {
                                    if (resPackagingAlias) {
                                        if (resPackagingAlias.status === STATE.SUCCESS) {
                                            // ==>> success: call BOM internal Version change
                                            req.body.programingRequired = resPackagingAlias.data.programingRequired;
                                            req.body.matingPartRquired = resPackagingAlias.data.matingPartRquired;
                                            req.body.driverToolRequired = resPackagingAlias.data.driverToolRequired;
                                            req.body.functionalTestingRequired = resPackagingAlias.data.functionalTestingRequired;
                                            req.body.pickupPadRequired = resPackagingAlias.data.pickupPadRequired;
                                            req.body.partStatus = resPackagingAlias.data.partStatus;
                                            req.body.uom = resPackagingAlias.data.uom;
                                            req.body.isEpoxyMount = resPackagingAlias.data.isEpoxyMount;
                                            req.body.connecterTypeID = resPackagingAlias.data.connecterTypeID;
                                            req.body.noOfRows = resPackagingAlias.data.noOfRows;
                                            parentComponentSettings.packaginggroupID = resPackagingAlias.data.aliasgroupID;
                                            aliasComponentSettings.packaginggroupID = resPackagingAlias.data.aliasgroupID;
                                            // required to call for both parts because in some case parent part setting change and in some case alias part setting change
                                            if (req.body.programingRequired !== parentComponentSettings.programingRequired ||
                                                req.body.matingPartRquired !== parentComponentSettings.matingPartRquired ||
                                                req.body.driverToolRequired !== parentComponentSettings.driverToolRequired ||
                                                req.body.functionalTestingRequired !== parentComponentSettings.functionalTestingRequired ||
                                                req.body.partStatus !== parentComponentSettings.partStatus ||
                                                req.body.uom !== parentComponentSettings.uom ||
                                                req.body.isEpoxyMount !== parentComponentSettings.isEpoxyMount ||
                                                req.body.pickupPadRequired !== parentComponentSettings.pickupPadRequired ||
                                                req.body.connecterTypeID !== parentComponentSettings.connecterTypeID ||
                                                req.body.noOfRows !== parentComponentSettings.noOfRows) {
                                                promisesBOMInternalVersion.push(module.exports.updateBOMInternalVersionPackagingAliasPartsPromise(req, parentComponentSettings, t));
                                            }
                                            if (req.body.programingRequired !== aliasComponentSettings.programingRequired ||
                                                req.body.matingPartRquired !== aliasComponentSettings.matingPartRquired ||
                                                req.body.driverToolRequired !== aliasComponentSettings.driverToolRequired ||
                                                req.body.functionalTestingRequired !== aliasComponentSettings.functionalTestingRequired ||
                                                req.body.partStatus !== aliasComponentSettings.partStatus ||
                                                req.body.uom !== aliasComponentSettings.uom ||
                                                req.body.isEpoxyMount !== aliasComponentSettings.isEpoxyMount ||
                                                req.body.pickupPadRequired !== aliasComponentSettings.pickupPadRequired ||
                                                req.body.connecterTypeID !== aliasComponentSettings.connecterTypeID ||
                                                req.body.noOfRows !== aliasComponentSettings.noOfRows) {
                                                promisesBOMInternalVersion.push(module.exports.updateBOMInternalVersionPackagingAliasPartsPromise(req, aliasComponentSettings, t));
                                            }

                                            return Promise.all(promisesBOMInternalVersion).then((respBOMInternalVersion) => {
                                                var respBOMInternalVersionObj = _.find(respBOMInternalVersion, respVersion => respVersion.status === STATE.FAILED);
                                                if (respBOMInternalVersionObj) {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                        messageContent: respBOMInternalVersionObj.message,
                                                        err: respBOMInternalVersionObj.err,
                                                        data: respBOMInternalVersionObj.data
                                                    });
                                                } else {
                                                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resPackagingAlias.data, MESSAGE_CONSTANT.CREATED(componentPackagingAliasModuleName)));
                                                }
                                            }).catch((err) => {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                console.trace();
                                                console.error(err);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: err,
                                                    data: null
                                                });
                                            });
                                            // <<== success: call BOM internal Version change
                                        } else {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: resPackagingAlias.message,
                                                err: resPackagingAlias.err,
                                                data: resPackagingAlias.data
                                            });
                                        }
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: null,
                                            data: null
                                        });
                                    }
                                }).catch((err) => {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName),
                                err: null,
                                data: null
                            });
                        });
                        // <<== success: call create packaging alias promise
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // delete Component Packagging alias
    // PUT : /api/v1/component/deleteComponentPackagingAlias
    // @param {id} int
    // @return remove component packagging alias details
    deleteComponentPackagingAlias: (req, res) => {
        const {
            Component,
            ComponentPackagingAlias
        } = req.app.locals.models;
        const componentPackagingAliasModuleName = DATA_CONSTANT.PACKAGING_ALIAS.Name;
        var obj = {};
        if (req.body.componentObj) {
            const aliasComponent = req.body.componentObj;
            COMMON.setModelDeletedByFieldValue(req);
            obj = {
                isDeleted: req.body.isDeleted,
                deletedAt: req.body.deletedAt,
                deletedBy: req.body.deletedBy,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return ComponentPackagingAlias.findAll({
                where: {
                    aliasgroupID: aliasComponent.aliasgroupID
                },
                attributes: ['id', 'componentID', 'aliasgroupID']
            }).then((componentPackagingAliasList) => {
                if (componentPackagingAliasList.length === 2) {
                    ComponentPackagingAlias.update(obj, {
                        where: {
                            id: {
                                [Op.in]: [componentPackagingAliasList[0].id, componentPackagingAliasList[1].id]
                            }
                        }
                    }).then(() => {
                        var compObj = {
                            packaginggroupID: null,
                            updatedBy: req.body.deletedBy,
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                            updatedAt: COMMON.getCurrentUTC()
                        };
                        Component.update(compObj, {
                            where: {
                                id: {
                                    [Op.in]: [componentPackagingAliasList[0].componentID, componentPackagingAliasList[1].componentID]
                                }
                            }
                        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.REMOVED(componentPackagingAliasModuleName))).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    ComponentPackagingAlias.update(obj, {
                        where: {
                            id: aliasComponent.id
                        }
                    }).then(() => {
                        var compObj = {
                            packaginggroupID: null,
                            updatedBy: req.body.deletedBy,
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                            updatedAt: COMMON.getCurrentUTC()
                        };
                        Component.update(compObj, {
                            where: {
                                id: aliasComponent.componentID
                            }
                        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.REMOVED(componentPackagingAliasModuleName))).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component Packagging Alias group
    // GET : /api/v1/component/getComponentPackagingAliasGroup
    // @param {id} int
    // @return List of Component Packagging alias
    getComponentPackagingAliasGroup: async (req, res) => {
        if (req.params.id) {
            const {
                sequelize
            } = req.app.locals.models;
            return sequelize.query('CALL Sproc_GetComponentPackagingAliasGroup (:pPartId)', {
                replacements: {
                    pPartId: req.params.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Create AlternetAlias
    // POST : /api/v1/component/createAlternetAlias
    // @return New create Alternet Alias detail
    createAlternetAlias: (req, res) => {
        const {
            Component,
            ComponentAlternatePN
        } = req.app.locals.models;
        var componentAlternetAliasModuleName = '';
        var obj = {};
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const alias = req.body.componentObj;
            if (alias.type === 1) {
                componentAlternetAliasModuleName = DATA_CONSTANT.ALTERNET_ALIAS.Name;
            } else if (alias.type === 2) {
                componentAlternetAliasModuleName = DATA_CONSTANT.PICKUP_PAD_ALIAS.Name;
            } else if (alias.type === 3) {
                componentAlternetAliasModuleName = DATA_CONSTANT.PROGRAMMING_REQUIRED_ALIAS.Name;
            } else if (alias.type === 4) {
                componentAlternetAliasModuleName = DATA_CONSTANT.FUNCTIONAL_TESTING_ALIAS.Name;
            } else if (alias.type === 5) {
                componentAlternetAliasModuleName = DATA_CONSTANT.REQUIRE_MATING_PARTS.Name;
            } else if (alias.type === 6) {
                componentAlternetAliasModuleName = DATA_CONSTANT.ROHS_ALTERNET_ALIAS.Name;
            }

            return Component.findAll({
                where: {
                    id: {
                        [Op.in]: [alias.componetID, alias.parentComponentID]
                    }
                },
                attributes: ['id']
            }).then((response) => {
                if (response && response.length > 1) {
                    obj = {
                        refComponentID: alias.parentComponentID,
                        componentID: alias.componetID,
                        createdBy: req.body.createdBy,
                        updatedBy: req.body.createdBy,
                        type: alias.type,
                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };
                    return ComponentAlternatePN.findOne({
                        where: {
                            componentID: alias.componetID,
                            refComponentID: alias.parentComponentID,
                            type: alias.type
                        }
                    }).then((alternateAlias) => {
                        if (alternateAlias) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.PARTS.COMP_PIDCODE,
                                err: null,
                                data: null
                            });
                        } else {
                            return ComponentAlternatePN.create(obj, {})
                                .then(aliasDetails => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, aliasDetails, MESSAGE_CONSTANT.CREATED(componentAlternetAliasModuleName))).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentAlternetAliasModuleName),
                        err: null,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // delete Component Alternet alias
    // PUT : /api/v1/component/deleteComponentAlternetAlias
    // @param {id} int
    // @return remove component alternet alias details
    deleteComponentAlternetAlias: (req, res) => {
        const {
            ComponentAlternatePN
        } = req.app.locals.models;
        var componentAlternetAliasModuleName = '';
        var obj = {};
        if (req.body.componentObj) {
            const aliasComponent = req.body.componentObj;
            COMMON.setModelDeletedByFieldValue(req);
            if (aliasComponent.type === 1) {
                componentAlternetAliasModuleName = DATA_CONSTANT.ALTERNET_ALIAS.Name;
            } else if (aliasComponent.type === 2) {
                componentAlternetAliasModuleName = DATA_CONSTANT.PICKUP_PAD_ALIAS.Name;
            } else if (aliasComponent.type === 3) {
                componentAlternetAliasModuleName = DATA_CONSTANT.PROGRAMMING_REQUIRED_ALIAS.Name;
            } else if (aliasComponent.type === 4) {
                componentAlternetAliasModuleName = DATA_CONSTANT.FUNCTIONAL_TESTING_ALIAS.Name;
            } else if (aliasComponent.type === 5) {
                componentAlternetAliasModuleName = DATA_CONSTANT.REQUIRE_MATING_PARTS.Name;
            } else if (aliasComponent.type === 6) {
                componentAlternetAliasModuleName = DATA_CONSTANT.ROHS_ALTERNET_ALIAS.Name;
            }


            obj = {
                isDeleted: req.body.isDeleted,
                deletedAt: req.body.deletedAt,
                deletedBy: req.body.deletedBy,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };

            return ComponentAlternatePN.update(obj, {
                where: {
                    id: aliasComponent.id
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.REMOVED(componentAlternetAliasModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component Alternet Alias group
    // GET : /api/v1/component/getComponentAlternetAliasGroup
    // @param {id} int
    // @return List of Component Alternet alias
    getComponentAlternetAliasGroup: (req, res) => {
        const {
            ComponentAlternatePN,
            Component,
            MfgCodeMst
        } = req.app.locals.models;
        if (req.body.id /* && req.params.type*/) {
            const whereCriteria = {
                isDeleted: false,
                refComponentID: req.body.id
            };
            if (req.body.type) {
                whereCriteria.type = req.body.type;
            } else {
                whereCriteria.type = {
                    [Op.in]: [1, 2, 4, 5, 6]
                };
            }

            return ComponentAlternatePN.findAll({
                where: whereCriteria,
                model: ComponentAlternatePN,
                attributes: ['id', 'componentID', 'refComponentID', 'type'],
                include: [{
                    model: Component,
                    as: 'alternateComponent',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgPN', 'isCustom'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'mfgCode', 'mfgType'],
                        required: false
                    }]
                }]
            }).then(componentAlternetAlias => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, componentAlternetAlias, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component List by MfgType
    // GET : /api/v1/component/getComponentByMfgType
    // @param {id} int
    // @return List of Component
    getComponentByMfgType: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetComponentByMfgType (:pMfgtype,:pSearch,:pId)', {
            replacements: {
                pMfgtype: req.body.listObj.mfgType || null,
                pSearch: req.body.listObj.query || null,
                pId: req.body.listObj.id || null

            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            data: _.values(response[0])
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get List of Component Distributors
    // GET : /api/v1/component/getComponentList
    // @param {id} int
    // @return List of Component
    getComponentList: (req, res) => {
        const {
            Component,
            MfgCodeMst
        } = req.app.locals.models;
        Component.findAll({
            where: {
                isDeleted: false,
                isGoodPart: DATA_CONSTANT.PartCorrectList.CorrectPart
            },
            attributes: ['id', 'mfgPN'],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                where: {
                    deletedAt: null,
                    mfgType: 'MFG'
                },
                attributes: ['id', 'mfgCode']
            }]
        }).then(component => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, component, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get component detail by mfgcode
    // GET : /api/v1/assembly/getComponentDetailByMfg
    // @return API response
    getComponentDetailByMfg: (req, res) => {
        const {
            Component
        } = req.app.locals.models;
        Component.findAll({
            where: {
                mfgcodeId: req.params.id,
                isGoodPart: DATA_CONSTANT.PartCorrectList.CorrectPart
            },
            model: Component,
            attributes: ['id', 'mfgPN', 'RoHSStatusID', 'packaginggroupID']
        }).then(component => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, component, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get List of Component good/bad part group
    // GET : /api/v1/component/getComponentGoodBadPartGroup
    // @param {id} int
    // @return List of Component Alternet alias
    getComponentGoodBadPartGroup: (req, res) => {
        const { sequelize } = req.app.locals.models;
        var strWhere = '';
        if (req.body.id) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize
                .query('CALL Sproc_RetrieveGoodBadParts (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pComponentID,:pIsFetchAll)', {
                    replacements: {
                        ppageIndex: req.body.Page || 0,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pComponentID: req.body.id,
                        pIsFetchAll: req.body.fetchAll || false
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[1]),
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
    // Retrive List of Component good/bad part group (Grid List page)
    // POST : /api/v1/component/getAlternetPartList
    // @return List of Component good/bad part group (Grid List page)
    getComponentGoodBadPartList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            const componentid = req.body.id ? req.body.id : null;

            return sequelize
                .query('CALL Sproc_RetrieveGoodBadParts (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pType,:pComponentID)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pType: req.body.type,
                        pComponentID: componentid
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    alternetPartList: _.values(response[1]),
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


    // Create DriveTools
    // POST : /api/v1/component/createComponentDriveTools
    // @return New create component DriveTools
    createComponentDriveTools: (req, res) => {
        const {
            ComponentDrivetools
        } = req.app.locals.models;
        const drivetoolalias = req.body.componentObj;
        var obj = {};
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const componentAlternetAliasModuleName = DATA_CONSTANT.DRIVETOOLS_ALIAS.Name;

            return ComponentDrivetools.findOne({
                where: {
                    componentID: drivetoolalias.componentID,
                    refComponentID: drivetoolalias.refComponentID,
                    isDeleted: false
                },
                attributes: ['id']
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.PARTS.COMP_DRIVETOOLS_VALIDATION,
                        err: null,
                        data: null
                    });
                } else {
                    obj = {
                        refComponentID: drivetoolalias.refComponentID,
                        componentID: drivetoolalias.componentID,
                        createdBy: req.body.createdBy,
                        updatedBy: req.body.createdBy,
                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };
                    return ComponentDrivetools.create(obj, {}).then(tempData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, tempData, MESSAGE_CONSTANT.CREATED(componentAlternetAliasModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component DriveTools
    // GET : /api/v1/component/getComponentDriveToolsList
    // @param {id} int
    // @return List of Component DriveTools
    getComponentDriveToolsList: (req, res) => {
        const {
            ComponentDrivetools,
            Component,
            MfgCodeMst
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentDrivetools.findAll({
                where: {
                    isDeleted: false,
                    refComponentID: req.params.id
                },
                model: ComponentDrivetools,
                attributes: ['id', 'refComponentID', 'componentID'],
                include: [{
                    model: Component,
                    as: 'component',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgPN'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'mfgCode', 'mfgType'],
                        required: false
                    }]
                }]
            }).then(driveToolAlias => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, driveToolAlias, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Drive Tool
    // POST : /api/v1/component/getDriveToolListByComponentId
    // @return List of Drive Tools
    getDriveToolListByComponentId: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') {
            strWhere = null;
        }
        sequelize.query('CALL Sproc_GetDriveToolListByComponentId(:pRefComponentID,:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pWithStock)', {
            replacements: {
                pRefComponentID: req.body.refComponentID,
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pWithStock: req.body.withStock === 'true' ? true : false
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            driveTools: _.values(response[1]),
            Count: response[0][0]['COUNT(1)']
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // delete Component DriveToolComponent
    // POST : /api/v1/component/deleteDriveToolComponent
    // @param {id} int
    // @return remove component deleteDriveToolComponent
    deleteDriveToolComponent: (req, res) => {
        const {
            ComponentDrivetools
        } = req.app.locals.models;
        const componentDriveToolsModuleName = DATA_CONSTANT.DRIVETOOLS_ALIAS.Name;
        var obj = {};
        if (req.body.componentObj.id) {
            COMMON.setModelDeletedByFieldValue(req);
            obj = {
                isDeleted: req.body.isDeleted,
                deletedAt: req.body.deletedAt,
                deletedBy: req.body.deletedBy,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return ComponentDrivetools.update(obj, {
                where: {
                    id: req.body.componentObj.id
                }
            }).then(resp => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, MESSAGE_CONSTANT.REMOVED(componentDriveToolsModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component CustomerAlias
    // GET : /api/v1/component/CustomerAlias
    // @param {id} int
    // @return List of Component CustomerAlias
    getCustomerAlias: (req, res) => {
        const {
            ComponentCustAliasRevPN,
            Component,
            MfgCodeMst
        } = req.app.locals.models;
        return ComponentCustAliasRevPN.findAll({
            where: {
                isDeleted: false,
                refComponentID: req.params.id
            },
            attributes: ['refCPNPartID'],
            group: ['refCPNPartID'],
            include: [{
                model: Component,
                as: 'ComponentCPNPart',
                where: {
                    isDeleted: false
                },
                attributes: ['id', 'PIDCOde', 'mfgPN', 'isCustom', 'custAssyPN', 'mfgcodeID'],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgCode', 'mfgType', 'mfgName'],
                    required: false
                }]
            }]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get List of Component GoodPart
    // GET : /api/v1/component/GoodPart
    // @param {id} int
    // @return List of Component GoodPart
    getComponentByID: async (req, res) => {
        const {
            Component,
            MfgCodeMst,
            RFQRoHS,
            sequelize
        } = req.app.locals.models;
        let mfgCodeFormat = null;
        try {
            mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                type: sequelize.QueryTypes.SELECT
            });
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
        return await Component.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'mfgPN', 'RoHSStatusID', 'PIDCode', 'mfgPNDescription', 'category', 'mfgType'],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                where: {
                    isDeleted: false
                },
                attributes: ['id', 'mfgCode', 'mfgName', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('mfgCodemst.mfgCode'), sequelize.col('mfgCodemst.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
                required: false
            },
            {
                model: RFQRoHS,
                as: 'rfq_rohsmst',
                where: {
                    isDeleted: false
                },
                attributes: ['id', 'name', 'rohsIcon'],
                required: false
            }
            ]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get component packaging alias list
    // GET:/api/v1/component/getComponentPackagingAliasByID
    // @return list of component packaging alias
    getComponentPackagingAliasByID: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.id) {
            return sequelize.query('CALL Sproc_GetPackagingParts(:pComponentID)', {
                replacements: {
                    pComponentID: req.params.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get component alternate alias by id
    // GET : /api/v1/component/getComponentAlternetAliasByID
    // @param {id} int component id
    // @return List of Component alternate alias
    getComponentAlternetAliasByID: (req, res) => {
        const {
            ComponentAlternatePN,
            Component,
            MfgCodeMst,
            RFQRoHS,
            ComponentPackagingMst
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentAlternatePN.findAll({
                where: {
                    isDeleted: false,
                    refComponentID: req.params.id,
                    type: DATA_CONSTANT.ALTERNET_ALIAS.Type
                },
                model: ComponentAlternatePN,
                attributes: ['id', 'componentID', 'refComponentID'],
                include: [{
                    model: Component,
                    as: 'alternateComponent',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgPN', 'RoHSStatusID', 'PIDCode', 'mfgPNDescription', 'isCustom', 'uom', 'isCPN', 'partType', 'category', 'packageQty', 'packagingID', 'custAssyPN'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'mfgCode', 'mfgName'],
                        required: false
                    },
                    {
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'name', 'rohsIcon'],
                        required: false
                    },
                    {
                        model: ComponentPackagingMst,
                        as: 'component_packagingmst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'name'],
                        required: false
                    }
                    ]
                }]
            }).then(componentAlternetAlias => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, componentAlternetAlias, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component RoHS Alternate Alias by component id
    // GET : /api/v1/component/getComponentROHSAlternetAliasByID
    // @param {id} int
    // @return List of Component RoHS Alternate alias
    getComponentROHSAlternetAliasByID: (req, res) => {
        const {
            ComponentAlternatePN,
            Component,
            RFQRoHS,
            MfgCodeMst,
            ComponentPackagingMst
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentAlternatePN.findAll({
                where: {
                    isDeleted: false,
                    refComponentID: req.params.id,
                    type: DATA_CONSTANT.ROHS_ALTERNET_ALIAS.Type
                },
                model: ComponentAlternatePN,
                attributes: ['id', 'componentID', 'refComponentID'],
                include: [{
                    model: Component,
                    as: 'alternateComponent',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgPN', 'RoHSStatusID', 'PIDCode', 'mfgPNDescription', 'isCustom', 'uom', 'isCPN', 'partType', 'category', 'packageQty', 'packagingID', 'custAssyPN'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'mfgCode', 'mfgName'],
                        required: false
                    },
                    {
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'name', 'rohsIcon'],
                        required: false
                    },
                    {
                        model: ComponentPackagingMst,
                        as: 'component_packagingmst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'name'],
                        required: false
                    }
                    ]
                }]
            }).then(componentROHSAlternetAlias => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, componentROHSAlternetAlias, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get component PID Code Length
    // GET:/api/v1/component/getcomponentPIDCode
    // @return data of Component PID Code
    getComponentPIDCode: (req, res) => {
        const {
            Settings
        } = req.app.locals.models;
        Settings.findOne({
            where: {
                key: [Pricing.PIDCodeLength]
            },
            attributes: ['values']
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Create Process Material
    // POST : /api/v1/component/createComponentProcessMaterial
    // @return New create Process Material detail
    createComponentProcessMaterial: (req, res) => {
        const {
            ComponentProcessMaterial
        } = req.app.locals.models;
        const processMaterialObj = req.body.componentObj;
        var obj = {};
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const componentProcessMaterialModuleName = DATA_CONSTANT.PROCESSMATERIAL.Name;

            return ComponentProcessMaterial.findOne({
                where: {
                    componentID: processMaterialObj.componentID,
                    refComponentID: processMaterialObj.refComponentID,
                    isDeleted: false
                },
                attributes: ['id']
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.PARTS.COMP_PROCESS_MATERIAL_VALIDATION,
                        err: null,
                        data: null
                    });
                } else {
                    obj = {
                        refComponentID: processMaterialObj.refComponentID,
                        componentID: processMaterialObj.componentID,
                        createdBy: req.body.createdBy,
                        updatedBy: req.body.createdBy,
                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };
                    return ComponentProcessMaterial.create(obj, {}).then(tempData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, tempData, MESSAGE_CONSTANT.CREATED(componentProcessMaterialModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component Process Material List
    // GET : /api/v1/component/getComponenProcessMaterialList
    // @param {id} int
    // @return List of Component ProcessMaterial
    getComponenProcessMaterialList: (req, res) => {
        const {
            ComponentProcessMaterial,
            Component,
            MfgCodeMst
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentProcessMaterial.findAll({
                where: {
                    isDeleted: false,
                    refComponentID: req.params.id
                },
                model: ComponentProcessMaterial,
                attributes: ['id', 'refComponentID', 'componentID'],
                include: [{
                    model: Component,
                    as: 'componentAsProcessMaterial',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgPN', 'RoHSStatusID', 'PIDCode', 'uom', 'mfgPNDescription', 'isCustom', 'isCPN', 'partType', 'category'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'mfgCode', 'mfgType', 'mfgName'],
                        required: false
                    }]
                }]
            }).then(processMaterialList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, processMaterialList, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component Process Material Group by component
    // GET : /api/v1/component/getComponenProcessMaterialGroup  by component
    // @param {id} int
    // @return List of Component ProcessMaterialGroup
    getComponentProcessMaterialGroupByCompomentID: (req, res) => {
        const {
            ComponentProcessMaterial,
            Component,
            MfgCodeMst,
            RFQRoHS,
            ComponentPackagingMst
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentProcessMaterial.findAll({
                where: {
                    isDeleted: false,
                    refComponentID: req.params.id
                },
                model: ComponentProcessMaterial,
                attributes: ['id', 'refComponentID', 'componentID'],
                include: [{
                    model: Component,
                    as: 'componentAsProcessMaterial',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgPN', 'RoHSStatusID', 'PIDCode', 'uom', 'mfgPNDescription', 'isCustom', 'isCPN', 'partType', 'category', 'packageQty', 'packagingID', 'custAssyPN'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'mfgCode', 'mfgName'],
                        required: false
                    },
                    {
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'name', 'rohsIcon'],
                        required: false
                    },
                    {
                        model: ComponentPackagingMst,
                        as: 'component_packagingmst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'name'],
                        required: false
                    }
                    ]
                }]
            }).then(processMaterialList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, processMaterialList, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // delete Component Process Material
    // POST : /api/v1/component/deleteProcessMaterialComponent
    // @param {id} int
    // @return removed Component Process Material
    deleteComponentProcessMaterial: (req, res) => {
        const {
            ComponentProcessMaterial
        } = req.app.locals.models;
        const componentProcessMaterialModuleName = DATA_CONSTANT.PROCESSMATERIAL.Name;
        var obj = {};
        if (req.body.componentObj.id) {
            COMMON.setModelDeletedByFieldValue(req);
            obj = {
                isDeleted: req.body.isDeleted,
                deletedAt: req.body.deletedAt,
                deletedBy: req.body.deletedBy,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return ComponentProcessMaterial.update(obj, {
                where: {
                    id: req.body.componentObj.id
                }
            }).then(resp => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, MESSAGE_CONSTANT.REMOVED(componentProcessMaterialModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // delete Component Process Material
    // POST : /api/v1/component/saveApiVerificationResult
    // @param {id} int
    // @return save good part mapping
    saveApiVerificationResult: (req, res) => {
        var mongodb = global.mongodb;
        if (req.body) {
            const apiVerification = req.body.apiVerification;
            return mongodb.collection('ApiVerificationResult').findOne({
                SearchPN: apiVerification.SearchPN,
                rfqAssyID: apiVerification.rfqAssyID,
                PN: apiVerification.PN
            }).then((result) => {
                if (result == null) {
                    const ObjectID = Bson.ObjectID;
                    // eslint-disable-next-line no-underscore-dangle
                    apiVerification._id = new ObjectID();
                    return mongodb.collection('ApiVerificationResult').insertOne(apiVerification)
                        .then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null)).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component Pricing Histroy
    // GET : /api/v1/component/getPricingHistroy
    // @param {id} int
    // @return List of Component Pricing Histroy
    getPricingHistroy: async (req, res) => {
        try {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UIGridMongoDBFilterSearch(req);
            var mongodb = global.mongodb;
            var setFromdate;
            var setTodate;
            var options = {
                allowDiskUse: false
            };
            let matchExpression = {
                "isCustomPrice": false,
                Type: req.query.Type
            }
            matchExpression = Object.assign(_.clone(filter.where), matchExpression);

            // Note: As of now we generate below field after get data 
            // thus remove from filter will later generate data will filter from result (Extra Filter for this field in PricingHistroy Method)
            Object.keys(matchExpression).forEach((modelField) => {
                if (modelField === 'supplier' || modelField === 'customPrice' || modelField === 'qty' || modelField === 'extendedCustomPrice' || modelField === 'standardPrice'
                    || modelField === 'extendedPrice') {
                    delete matchExpression[modelField];
                }
            });

            if (req.query.isMfg === 'true') {
                matchExpression.componentID = Number(req.query.componentID);
            } else {
                matchExpression.supplierPartID = Number(req.query.componentID);
            }
            const timeZone = await sequelize.query('Select fun_getTimeZone() as timeZone', {
                type: sequelize.QueryTypes.SELECT
            });
            matchExpression.supplierID = req.query.supplierID ? Number(req.query.supplierID) : req.query.supplierID;

            model = {
                matchExpression: matchExpression,
                mongodb: mongodb
            };
            const specialPriceExpre = Object.assign({}, matchExpression);
            specialPriceExpre.isCustomPrice = true;
            // Create Query for Fetch data from MongoDB
            const pipeline = [
                {
                    "$match": matchExpression
                },
                {
                    "$project": {
                        "componentID": 1.0,
                        "_id": 0,
                        "mfgPN": 1.0,
                        "qty": 1.0,
                        "standardPrice": {
                            $convert: {
                                input: "$price",
                                to: "double"
                            }
                        },
                        "customPrice": {
                            $convert: {
                                input: "0",
                                to: "double"
                            }
                        },
                        "isCustomPrice": 1.0,
                        "timeStamp": {
                            $dateToString: {
                                date: '$timeStamp',
                                timezone: timeZone[0].timeZone
                            }
                        },
                        "orgTimeStamp": '$timeStamp',
                        "Type": 1.0,
                        "Packaging": 1.0,
                        "isCustomPrice": 1.0,
                        "supplier": 1.0,
                        "supplierID": 1.0,
                        "supplierPN": 1.0,
                        "supplierPartID": 1.0
                    }
                },
                {
                    "$unionWith": {
                        "coll": "PriceBreakComponent",
                        "pipeline": [
                            {
                                "$match": specialPriceExpre,
                            },
                            {
                                "$project": {
                                    "componentID": 1.0,
                                    "_id": 0,
                                    "mfgPN": 1.0,
                                    "qty": 1.0,
                                    "standardPrice": {
                                        $convert: {
                                            input: "0",
                                            to: "double"
                                        }
                                    },
                                    "customPrice": {
                                        $convert: {
                                            input: "$price",
                                            to: "double"
                                        }
                                    },
                                    "isCustomPrice": 1.0,
                                    "orgTimeStamp": '$timeStamp',
                                    "timeStamp": {
                                        $dateToString: {
                                            date: '$timeStamp',
                                            timezone: timeZone[0].timeZone
                                        }
                                    },
                                    "Type": 1.0,
                                    "Packaging": 1.0,
                                    "isCustomPrice": 1.0,
                                    "supplier": 1.0,
                                    "supplierID": 1.0,
                                    "supplierPN": 1.0,
                                    "supplierPartID": 1.0
                                }
                            }
                        ]
                    }
                },
                {
                    "$sort": {
                        timeStamp: -1
                    }
                }
            ];

            req.query.model = filter;
            req.query.pipeline = pipeline;
            if (req.query.priceFilter === 'latestPrice' && req.query.supplierID) {
                return await mongodb.collection('PriceBreakComponent').aggregate(pipeline, options).sort({
                    timeStamp: -1
                }).toArray((err, result) => {
                    if (err) {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    }
                    if (result.length > 0) {
                        setFromdate = moment(moment.parseZone(result[0].orgTimeStamp).format(COMMON.MONGO_DB_DATE_FORMAT)).toDate();
                        setTodate = moment(moment(moment.parseZone(result[0].orgTimeStamp).format(COMMON.MONGO_DB_DATE_FORMAT)).toDate()).set({ "hour": 23, "minute": 59, "second": 00 }).toDate();
                        const timeStamp = {
                            $gte: setFromdate,
                            $lte: setTodate
                        };
                        specialPriceExpre.timeStamp = timeStamp;
                        matchExpression.timeStamp = timeStamp;
                    }
                    return module.exports.PricingHistroy(req, res);
                });
            } else if (req.query.supplierID) {
                let timeStampWhereClause = {};
                if (req.query.fromDate && req.query.toDate) {
                    timeStampWhereClause = {
                        $gte: new Date(new Date(req.query.fromDate).setHours(0, 0, 0, 0)),
                        $lte: new Date(new Date(req.query.toDate).setHours(23, 59, 59, 999))
                    };
                } else if (req.query.fromDate && !req.query.toDate) {
                    timeStampWhereClause = {
                        $gte: new Date(new Date(req.query.fromDate).setHours(0, 0, 0, 0))
                    };
                } else if (!req.query.fromDate && req.query.toDate) {
                    timeStampWhereClause = {
                        $lte: new Date(new Date(req.query.toDate).setHours(23, 59, 59, 999))
                    };
                }
                if (Object.keys(timeStampWhereClause).length) {
                    specialPriceExpre.timeStamp = timeStampWhereClause;
                    matchExpression.timeStamp = timeStampWhereClause;
                }
                return await module.exports.PricingHistroy(req, res);
            } else {
                return await resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                });
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return await resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        }
    },

    PricingHistroy: async (req, res) => {
        var mongodb = global.mongodb;
        try {
            const { MfgCodeMst, sequelize } = req.app.locals.models;
            try {
                var mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return await mongodb.collection('PriceBreakComponent').aggregate(req.query.pipeline).
                toArray((err, result) => {
                    if (err) {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    } else {
                        var groups = _.groupBy(result, function (value) {
                            const date = moment(value.timeStamp).format('DD/MM/YYYY');
                            return `${value.Packaging}#${value.supplierPartID}#${value.qty}#${date}`;
                        });
                        if (Object.values(groups) && Object.values(groups).length > 0) {
                            return MfgCodeMst.findAll({
                                attributes: ['id',
                                    [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('MfgCodeMst.mfgCode'), sequelize.col('MfgCodeMst.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName'],
                                ],
                                where: {
                                    id: req.query.supplierID
                                },
                                paranoid: false
                            }).then(response => {
                                const mfgList = response.map(a => { return { id: a.dataValues.id, mfgCodeName: a.dataValues.mfgCodeName } });

                                var index = 0;
                                var pricingData = _.map(groups, function (group) {
                                    const customPrice = _.min(_.map(group, 'customPrice'));
                                    const standardPrice = _.min(_.map(group, 'standardPrice'));
                                    index = index + 1;
                                    const supplierDet = mfgList.find(a => a.id === group[0].supplierID);
                                    return {
                                        index: index,
                                        supplierID: group[0].supplierID,
                                        supplier: supplierDet.mfgCodeName,
                                        supplierPartID: group[0].supplierPartID,
                                        supplierPN: group[0].supplierPN,
                                        Packaging: group[0].Packaging,
                                        qty: group[0].qty,
                                        customPrice: customPrice,
                                        extendedCustomPrice: customPrice * group[0].qty,
                                        standardPrice: standardPrice,
                                        extendedPrice: standardPrice * group[0].qty,
                                        timeStamp: group[0].timeStamp,
                                        Type: group[0].Type
                                    }
                                });
                                let qtyStr;
                                let supplierStr;
                                let customPriceStr;
                                let extendedCustomPriceStr;
                                let standardPriceStr;
                                let extendedPriceStr;
                                // .toString().slice(1,-2) - For remove MongoDB string value query e.g - '/3.0/i' to '3.0'
                                Object.keys(req.query.model.where).forEach((modelField) => {
                                    qtyStr = modelField === 'qty' ? req.query.model.where[modelField].toString().slice(1, -2) : '';
                                    supplierStr = modelField === 'supplier' ? req.query.model.where[modelField].toString().slice(1, -2) : '';
                                    customPriceStr = modelField === 'customPrice' ? req.query.model.where[modelField].toString().slice(1, -2) : '';
                                    extendedCustomPriceStr = modelField === 'extendedCustomPrice' ? req.query.model.where[modelField].toString().slice(1, -2) : '';
                                    standardPriceStr = modelField === 'standardPrice' ? req.query.model.where[modelField].toString().slice(1, -2) : '';
                                    extendedPriceStr = modelField === 'extendedPrice' ? req.query.model.where[modelField].toString().slice(1, -2) : '';
                                });

                                pricingData = _.filter(pricingData, (data) => {
                                    if (data.qty.toString().toUpperCase().includes(qtyStr ? qtyStr.toUpperCase() : '') &&
                                        data.supplier.toString().toUpperCase().includes(supplierStr ? supplierStr.toUpperCase() : '') &&
                                        data.customPrice.toString().toUpperCase().includes(customPriceStr ? customPriceStr.toUpperCase() : '') &&
                                        data.extendedCustomPrice.toString().toUpperCase().includes(extendedCustomPriceStr ? extendedCustomPriceStr.toUpperCase() : '') &&
                                        data.standardPrice.toString().toUpperCase().includes(standardPriceStr ? standardPriceStr.toUpperCase() : '') &&
                                        data.extendedPrice.toString().toUpperCase().includes(extendedPriceStr ? extendedPriceStr.toUpperCase() : '')) {
                                        return data;
                                    }
                                });
                                if (req.query.model.order.length > 0) {
                                    const column = [];
                                    const sortBy = [];
                                    _.each(req.query.model.order, (item) => {
                                        column.push(item[0]);
                                        sortBy.push(item[1]);
                                    });
                                    pricingData = _.orderBy(pricingData, column, _.uniq(sortBy));
                                }
                                const resultDet = _.take(_.drop(pricingData, req.query.model.offset), req.query.model.limit); // _.first( _.rest(data, req.query.model.offset), req.query.model.limit);
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    result: resultDet,
                                    Count: pricingData.length
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
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            result: [],
                            Count: 0
                        });
                    }
                });
        } catch (err) {
            console.trace();
            console.error(err);
            return await resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        }
    },
    // get pricing details and update component details from service request
    // GET : /api/v1/component/getPricingAndUpdateComponentDetails
    // component/getPricingAndUpdateComponentDetails
    // eslint-disable-next-line no-unused-vars
    getPricingAndUpdateComponentDetails: (req, res) => {
        var promises = [module.exports.getOldComponentDetails(req)];
        return Promise.all(promises).then((responses) => {
            var componentArr = responses[0].componentArray;
            var channel = global.channel;
            var queue = DATA_CONSTANT.SERVICE_QUEUE_PART.SCHEDULE_PART_UPDATE_QUEUE;
            channel.assertQueue(queue, {
                durable: false,
                autoDelete: false,
                exclusive: false
            });
            _.each(componentArr, (apiPart) => {
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(apiPart)));
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },

    // method to get data for old component
    getOldComponentDetails: (req) => {
        const {
            sequelize,
            Settings
        } = req.app.locals.models;
        const responseObj = {};
        return Settings.findOne({
            where: {
                key: Pricing.ComponentUpdateTimeInterval
            },
            attributes: ['id', 'key', 'values', 'clusterName']
        }).then(response => sequelize
            .query('CALL Sproc_GetOldComponentDetails(:pdays)', {
                replacements: {
                    pdays: response.values ? response.values : 7
                },
                type: sequelize.QueryTypes.SELECT
            })
            .then((responseList) => {
                responseObj.status = STATE.SUCCESS;
                responseObj.componentArray = _.values(responseList[0]);
                return responseObj;
            }).catch((err) => {
                console.trace();
                console.error(err);
                responseObj.status = STATE.EMPTY;
                return responseObj;
            })).catch((err) => {
                console.trace();
                console.error(err);
                responseObj.status = STATE.EMPTY;
                return responseObj;
            });
    },

    // get component for change mounting type/part type
    // POST : /api/v1/component/getNoneMountComponent
    // @return list of component having mouting/part type none
    getNoneMountComponent: (req, res) => {
        const {
            Component,
            MfgCodeMst,
            RFQRoHS
        } = req.app.locals.models;
        const components = req.body.components;
        var allPromises = [];
        // get component list with none type mounting and part type
        allPromises.push(Component.findAll({
            where: {
                mfgPN: {
                    [Op.in]: components
                },
                [Op.or]: [{
                    mountingTypeID: DATA_CONSTANT.COMPONENT.COMMONID
                },
                {
                    functionalCategoryID: DATA_CONSTANT.COMPONENT.COMMONID
                },
                {
                    connecterTypeID: DATA_CONSTANT.COMPONENT.COMMONID
                }
                ]
            },
            attributes: ['id', 'mfgPN', 'mfgcodeID', 'mountingTypeID', 'category', 'RoHSStatusID', 'functionalCategoryID', 'connecterTypeID', 'functionalCategoryText', 'connectorTypeText', 'mountingTypeText', 'isCustom'],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                where: {
                    isDeleted: false
                },
                attributes: ['id', 'mfgCode', 'mfgName'],
                required: false
            },
            {
                model: RFQRoHS,
                as: 'rfq_rohsmst',
                where: {
                    isDeleted: false
                },
                attributes: ['id', 'name', 'rohsIcon']
            }
            ]
        }).then(componentlist => componentlist).catch((err) => {
            console.trace();
            console.error(err);
            return [];
        }));
        Promise.all(allPromises).then((responses) => {
            var component = responses[0];
            var objComponent = {
                componentList: component
            };
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, objComponent, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // update component mounting type and part type
    // POST : /api/v1/component/saveNoneMountComponent
    // @return update mount/parttype in component
    saveNoneMountComponent: (req, res) => {
        const {
            Component
        } = req.app.locals.models;
        var allPromises = [];
        COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.componentList);
        const componentList = req.body.componentList;
        _.each(componentList, (compObj) => {
            allPromises.push(Component.update(compObj, {
                where: {
                    id: compObj.id
                },
                fields: ['id', 'functionalCategoryID', 'mountingTypeID']
            }).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            }));
        });
        Promise.all(allPromises).then(() =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(componentModuleName))
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get where use component
    // POST :/api/v1/component/getWhereUseComponent/:id
    // @return assyname and revison for where use component
    getWhereUseComponent: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetriveWhereUsedComponents(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartID)', {
                replacements: {
                    pPageIndex: req.body.Page || null,
                    pRecordPerPage: filter.limit || null,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere || null,
                    pPartID: req.body.partID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                whereUsedComponents: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // get where use component Other
    // POST :/api/v1/component/getWhereUseComponentOther/:id
    // @return assyname and revison for where use component Other
    getWhereUseComponentOther: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetriveWhereUsedComponentsOther(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartID)', {
            replacements: {
                pPageIndex: req.body.page || null,
                pRecordPerPage: filter.limit || null,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere || null,
                pPartID: req.body.partID || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            whereUsedComponentsOther: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get Component Assembly Programming List
    // Get:/api/v1/component/getComponentAssyProgramList/:id
    // @return Component Assembly Programming List
    getComponentAssyProgramList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            sequelize.query('CALL Sproc_GetComponentAssyProgramList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartId)', {
                replacements: {
                    pPageIndex: req.body.Page || null,
                    pRecordPerPage: filter.limit || null,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere || null,
                    pPartId: req.body.partID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                programmingList: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // get component list having None as type and having
    // POST:/api/v1/component/getNoneTypeComponent
    // @return list of component having none type
    getNoneTypeComponent: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var obj = {};
        return module.exports.clearNoneTypeErrors().then((status) => {
            if (status === STATE.SUCCESS) {
                return sequelize.query('CALL Sproc_GetNoneTypeComponent()', {
                    replacements: {},
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    var componentList = _.values(response[0]);
                    var allPromises = [];
                    _.each(componentList, (comp) => {
                        if (comp.connecterTypeID === Pricing.NONE_Status && comp.connectorTypeText) {
                            obj = {
                                id: comp.id,
                                type: ErrorType.CONNECTNOTADDED,
                                dataID: comp.connecterTypeID,
                                dataText: comp.connectorTypeText,
                                mfgPN: comp.mfgPN,
                                PidCode: comp.pidcode,
                                rohsName: comp.name,
                                rohsIcon: comp.rohsIcon,
                                Msg: COMMON.stringFormat(MESSAGE_CONSTANT.COMPONENT.MAPPING_PART_ATTRIBUTE_COMPONENT, Pricing.ConnecterType, comp.connectorTypeText)
                            };
                            allPromises.push(module.exports.addNoneTypeComponent(req, obj).then(addConnectorTypeStatus => addConnectorTypeStatus));
                        }
                        if (comp.functionalCategoryID === Pricing.NONE_Status && comp.functionalCategoryText) {
                            obj = {
                                id: comp.id,
                                type: ErrorType.PARTTYPENOTADDED,
                                dataID: comp.functionalCategoryID,
                                dataText: comp.functionalCategoryText,
                                mfgPN: comp.mfgPN,
                                PidCode: comp.pidcode,
                                rohsName: comp.name,
                                rohsIcon: comp.rohsIcon,
                                Msg: COMMON.stringFormat(MESSAGE_CONSTANT.COMPONENT.MAPPING_PART_ATTRIBUTE_COMPONENT, Pricing.PartType, comp.functionalCategoryText)
                            };
                            allPromises.push(module.exports.addNoneTypeComponent(req, obj).then(addFunctionalTypeStatus => addFunctionalTypeStatus));
                        }
                        if (comp.mountingTypeID === Pricing.NONE_Status && comp.mountingTypetext) {
                            obj = {
                                id: comp.id,
                                type: ErrorType.MOUNTNOTADDED,
                                dataID: comp.mountingTypeID,
                                dataText: comp.mountingTypetext,
                                mfgPN: comp.mfgPN,
                                PidCode: comp.pidcode,
                                rohsName: comp.name,
                                rohsIcon: comp.rohsIcon,
                                Msg: COMMON.stringFormat(MESSAGE_CONSTANT.COMPONENT.MAPPING_PART_ATTRIBUTE_COMPONENT, Pricing.MountingType, comp.mountingTypetext)
                            };
                            allPromises.push(module.exports.addNoneTypeComponent(req, obj).then(addMountingTypeStatus => addMountingTypeStatus));
                        }
                        if (comp.RoHSStatusID === Pricing.NONE_Status && comp.rohsText) {
                            obj = {
                                id: comp.id,
                                type: ErrorType.ROHSNOTADDED,
                                dataID: comp.RoHSStatusID,
                                dataText: comp.rohsText,
                                mfgPN: comp.mfgPN,
                                PidCode: comp.pidcode,
                                rohsName: comp.name,
                                rohsIcon: comp.rohsIcon,
                                Msg: COMMON.stringFormat(MESSAGE_CONSTANT.COMPONENT.MAPPING_PART_ATTRIBUTE_COMPONENT, Pricing.Rohs, comp.rohsText)
                            };
                            allPromises.push(module.exports.addNoneTypeComponent(req, obj).then(addRohsStatus => addRohsStatus));
                        }
                    });
                    return Promise.all(allPromises).then((responses) => {
                        if (responses.length > 0) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responses, null);
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responses, MESSAGE_CONSTANT.PARTS.COMP_UPTODATE);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    addNoneTypeComponent: (req, component) => {
        var mongodb = global.mongodb;
        const componentStatus = {
            id: component.id,
            type: component.type,
            dataID: component.dataID,
            dataText: component.dataText,
            partNumber: component.mfgPN,
            error: component.Msg,
            PidCode: component.PidCode,
            rohsName: component.rohsName,
            rohsIcon: component.rohsIcon
        };
        var ObjectID = Bson.ObjectID;
        // eslint-disable-next-line no-underscore-dangle
        componentStatus._id = new ObjectID();
        return mongodb.collection('componentStatus').insertOne(componentStatus)
            .then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
    },
    // get component status list from mongo db
    // GET:/api/v1/component/getComponentStatusList
    // @return list of component having none type
    getComponentStatusList: (req, res) => {
        var mongodb = global.mongodb;
        var promises = [];
        const filter = COMMON.UIGridMongoDBFilterSearch(req);
        const order = filter.order[0];
        const option = {
            skip: filter.offset,
            sort: {},
            limit: filter.limit
        };
        if (order) {
            option.sort[order[0]] = order[1] === 'asc' ? 1 : -1;
        }
        promises = [
            mongodb.collection('componentStatus').find(filter.where, option).toArray(),
            mongodb.collection('componentStatus').find(filter.where).count()
        ];

        return Promise.all(promises)
            .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                ComponentStatus: response[0],
                Count: response[1]
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

    // update component having none type
    // POST:/api/v1/component/updateComponentStatus
    // @return updated Component
    updateComponentStatus: (req, res) => {
        const {
            Component
        } = req.app.locals.models;
        var promises = [];
        var attribute = [];
        if (req.body) {
            const componentList = req.body.componentStatus;
            promises = [];
            _.each(componentList, (compStatus) => {
                var where = {
                    isDeleted: false
                };
                compStatus.updatedBy = req.user.id;
                compStatus.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                compStatus.updatedAt = COMMON.getCurrentUTC();
                attribute = [];
                if (compStatus.type === ErrorType.MOUNTNOTADDED) {
                    where.mountingTypeText = compStatus.mountingTypeText;
                    attribute = ['mountingTypeID', 'updatedBy'];
                } else if (compStatus.type === ErrorType.UOMNOTADDED) {
                    where.uomText = compStatus.uomText;
                    attribute = ['uom', 'updatedBy'];
                } else if (compStatus.type === ErrorType.ROHSNOTADDED) {
                    where.rohsText = compStatus.rohsText;
                    attribute = ['RoHSStatusID', 'updatedBy'];
                } else if (compStatus.type === ErrorType.CONNECTNOTADDED) {
                    where.connectorTypeText = compStatus.connectorTypeText;
                    attribute = ['connecterTypeID', 'updatedBy'];
                } else if (compStatus.type === ErrorType.PARTTYPENOTADDED) {
                    where.functionalCategoryText = compStatus.functionalCategoryText;
                    attribute = ['functionalCategoryID', 'updatedBy'];
                }
                promises.push(Component.update(compStatus, {
                    where: where,
                    attributes: attribute
                }).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            });
            return Promise.all(promises)
                .then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(componentModuleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // clear all previous detail of none type
    clearNoneTypeErrors: () => {
        var mongodb = global.mongodb;
        var query = {};
        return mongodb.collection('componentStatus').deleteMany(query)
            .then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
    },

    // get component list having None as type and having
    // GET:/api/v1/component/getNoneTypeComponent
    // @return list of component having none type
    getrefreshComponent: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_refreshComponentStatus(:puserID)', {
            replacements: {
                puserID: req.user.id
            },
            type: sequelize.QueryTypes.SELECT
        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.PARTS.COMPONENT_MAPP)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Retrive list of packaging alias
    // POST : /api/v1/component/getcomponentPackagingaliaslist
    // @return list of packaging alias
    getcomponentPackagingaliaslist: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetComponentPackagingAlias (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pId)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pId: req.body.id
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            component_Packaging_Alias: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get List of PID List
    // GET : /api/v1/component/getAssemblyPIDList
    // @param {id} int
    // @return List of PID with Id
    getAssemblyPIDList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize
            .query('CALL Sproc_GetPIDList (:customerID,:passyIds,:pisFromSalesOrder)', {
                replacements: {
                    customerID: req.body.customerID ? req.body.customerID : null,
                    passyIds: req.body.assyIds || null,
                    pisFromSalesOrder: req.body.isFromSalesOrder || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response.length === 2 ? _.values(response[0]) : _.values(response[1]), null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
    },

    // Get component detail by mfgpn
    // GET : /api/v1/assembly/getComponentDetailByMfgPN
    // @return API response
    getComponentDetailByMfgPN: (req, res) => {
        const {
            Component,
            ComponentOtherPN,
            MfgCodeMst,
            RFQRoHS,
            ComponentLastExternalAPICall
        } = req.app.locals.models;
        var promises = [];

        if (req.body && req.body.mfgPn) {
            let mfgCodeMstWhere = {};
            if (!req.body.isPartMaster) {
                mfgCodeMstWhere = {
                    mfgType: {
                        [Op.ne]: DATA_CONSTANT.MFGCODE.MFGTYPE.DIST
                    }
                };
            }
            /* this is temporary condition till we implement cloud button in supplier part page*/
            if (req.body.isPartMaster) {
                mfgCodeMstWhere = {
                    mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG
                };
            }
            promises.push(
                Component.findAll({
                    where: {
                        mfgPN: req.body.mfgPn
                    },
                    model: Component,
                    attributes: ['id', 'mfgPN', 'mfgcodeID', 'mfgPNDescription', 'imageURL', 'isGoodPart', 'isCustom'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgCode', 'mfgName'],
                        where: mfgCodeMstWhere,
                        required: true
                    },
                    {
                        model: ComponentLastExternalAPICall,
                        as: 'componentLastExternalAPICall',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['updatedAtApi', 'supplierID'],
                        required: false,
                        include: [{
                            model: MfgCodeMst,
                            as: 'supplierMaster',
                            where: {
                                isDeleted: false
                            },
                            attributes: ['mfgCode', 'id', 'mfgType', 'mfgName'],
                            required: false
                        }]
                    },
                    {
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        attributes: ['id', 'name', 'rohsIcon'],
                        required: false
                    }
                    ]
                })
            );

            promises.push(
                ComponentOtherPN.findAll({
                    where: {
                        name: req.body.mfgPn
                    },
                    model: ComponentOtherPN,
                    attributes: ['id', 'name', 'refComponentID'],
                    required: false,
                    include: [{
                        model: Component,
                        as: 'component',
                        attributes: ['id', 'mfgPN', 'mfgcodeID', 'mfgPNDescription', 'imageURL', 'isGoodPart', 'isCustom'],
                        required: false,
                        include: [{
                            model: MfgCodeMst,
                            as: 'mfgCodemst',
                            attributes: ['id', 'mfgCode', 'mfgName'],
                            where: mfgCodeMstWhere,
                            required: true
                        },
                        {
                            model: ComponentLastExternalAPICall,
                            as: 'componentLastExternalAPICall',
                            where: {
                                isDeleted: false
                            },
                            attributes: ['updatedAtApi', 'supplierID'],
                            required: false,
                            include: [{
                                model: MfgCodeMst,
                                as: 'supplierMaster',
                                where: {
                                    isDeleted: false
                                },
                                attributes: ['mfgCode', 'id', 'mfgType', 'mfgName'],
                                required: false
                            }]
                        },
                        {
                            model: RFQRoHS,
                            as: 'rfq_rohsmst',
                            attributes: ['id', 'name', 'rohsIcon'],
                            required: false
                        }
                        ]
                    }]
                })
            );

            return Promise.all(promises)
                .then(resp => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get component detail by part number
    // GET : /api/v1/assembly/getComponentDetailByPN
    // @return API response
    getComponentDetailByPN: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.partNumber) {
            return sequelize
                .query('CALL Sproc_getComponentDetailByPartNumber (:ppartNumber,:pmfgtype)', {
                    replacements: {
                        ppartNumber: req.body.partNumber,
                        pmfgtype: req.body.mfgType || null
                    }
                })
                .then(PartList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, PartList, null)).catch((err) => {
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

    // Get Component Other Part
    // GET : /api/v1/component/getComponentOtherPartList
    // @param {id} int
    // @return List of Component Other Part List
    getComponentOtherPartList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.id) {
            return sequelize.query('CALL Sproc_GetComponentOtherPartList(:pRefComponentID)', {
                replacements: {
                    pRefComponentID: req.params.id
                }
            }).then(componentOtherPartNanme => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, componentOtherPartNanme, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // Create Component Other Part
    // POST : /api/v1/component/createComponentOtherPart
    // @return New create Component Other Part
    createComponentOtherPart: (req, res) => {
        const {
            Component,
            ComponentOtherPN
        } = req.app.locals.models;
        var obj = {};
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const alias = req.body.componentObj;
            return Component.findAll({
                where: {
                    id: {
                        [Op.in]: [alias.componentID]
                    }
                },
                attributes: ['id']
            }).then(() => ComponentOtherPN.findOne({
                where: {
                    name: alias.name,
                    refComponentID: alias.componentID,
                    isDeleted: false
                }
            }).then((otherpart) => {
                if (otherpart == null) {
                    obj = {
                        name: alias.name,
                        refComponentID: alias.componentID,
                        createdBy: req.body.createdBy,
                        updatedBy: req.body.createdBy,
                        isDeleted: false,
                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };
                    return ComponentOtherPN.create(obj, {}).then((data) => {
                        const otherParts = {
                            id: data.id,
                            name: data.name,
                            refComponentID: data.refComponentID,
                            createdBy: data.createdBy,
                            updatedBy: req.body.createdBy
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, otherParts, MESSAGE_CONSTANT.CREATED(componentOtherPartNameModuleName));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.PARTS.COMP_OTHER_PART,
                        err: null,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // delete Component Other Part
    // PUT : /api/v1/component/deleteComponentOtherPart
    // @param {id} int
    // @return remove Component Other Part
    deleteComponentOtherPart: (req, res) => {
        const {
            ComponentOtherPN
        } = req.app.locals.models;
        if (req.body.componentObj) {
            const aliasComponent = req.body.componentObj;
            COMMON.setModelDeletedByFieldValue(req);
            const obj = {
                isDeleted: req.body.isDeleted,
                deletedAt: req.body.deletedAt,
                deletedBy: req.body.deletedBy,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return ComponentOtherPN.update(obj, {
                where: {
                    id: aliasComponent.id
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.REMOVED(componentOtherPartNameModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get Functional Testing Equipment
    // GET : /api/v1/component/getFunctionaltestingEquipmentList
    // @param {id} int
    // @return List of Functional Testing Equipment
    getFunctionaltestingEquipmentList: (req, res) => {
        const {
            ComponentFunctionalTestingEquipment,
            Equipment
        } = req.app.locals.models;

        if (req.params.id) {
            return ComponentFunctionalTestingEquipment.findAll({
                where: {
                    refComponentID: req.params.id
                },
                attributes: ['id', 'eqpID', 'refComponentID'],
                include: [{
                    model: Equipment,
                    as: 'equipment',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['eqpID', 'assetName'],
                    required: false
                }]
            }).then(functionalTestingPartNanme => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, functionalTestingPartNanme, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // Create Functional Testing Equipment
    // POST : /api/v1/component/createFunctionalTestingEquipment
    // @return New create Functional Testing Equipment
    createFunctionalTestingEquipment: (req, res) => {
        const {
            Component,
            ComponentFunctionalTestingEquipment
        } = req.app.locals.models;
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const alias = req.body.componentObj;

            return Component.findAll({
                where: {
                    id: {
                        [Op.in]: [alias.componentID]
                    }
                },
                attributes: ['id']
            }).then(() => {
                ComponentFunctionalTestingEquipment.findOne({
                    where: {
                        eqpID: alias.eqpID,
                        refComponentID: alias.componentID
                    }
                }).then((testingpart) => {
                    if (testingpart == null) {
                        const obj = {
                            eqpID: alias.eqpID,
                            refComponentID: alias.componentID,
                            createdBy: req.body.createdBy,
                            updatedBy: req.body.createdBy,
                            isDeleted: false,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        };
                        return ComponentFunctionalTestingEquipment.create(obj, {}).then((data) => {
                            var otherParts = {
                                id: data.id,
                                eqpID: data.eqpID,
                                refComponentID: data.refComponentID,
                                createdBy: data.createdBy
                            };
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, otherParts, MESSAGE_CONSTANT.CREATED(componentfunctionalTestingPartNameModuleName));
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.PARTS.COMP_FUNCTIONAL_TESTING_EQUIPMENT,
                            err: null,
                            data: null
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // delete Functional Testing Equipment
    // PUT : /api/v1/component/deleteFunctionalTestingEquipment
    // @param {id} int
    // @return remove Functional Testing Equipment
    deleteFunctionalTestingEquipment: (req, res) => {
        const {
            ComponentFunctionalTestingEquipment
        } = req.app.locals.models;
        if (req.body.componentObj) {
            const componentPara = req.body.componentObj;
            COMMON.setModelDeletedByFieldValue(req);
            const obj = {
                isDeleted: req.body.isDeleted,
                deletedAt: req.body.deletedAt,
                deletedBy: req.body.deletedBy,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return ComponentFunctionalTestingEquipment.update(obj, {
                where: {
                    id: componentPara.id
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.REMOVED(componentfunctionalTestingPartNameModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Retrive list of Alternet part
    // POST : /api/v1/component/getAlternetPartList
    // @return list of Alternet Partlist
    getAlternetPartList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            const componentid = req.body.id ? req.body.id : null;

            return sequelize
                .query('CALL Sproc_RetrieveComponentAlternetPart (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pType,:pComponentID)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pType: req.body.type,
                        pComponentID: componentid
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    alternetPartList: _.values(response[1]),
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

    // Retrive list of Process Material part
    // POST : /api/v1/component/getProcessMaterialPartGridList
    // @return list of Process Material partList
    getProcessMaterialPartGridList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            const componentid = req.body.id ? req.body.id : null;

            return sequelize
                .query('CALL Sproc_RetrieveComponentProcessMatrial (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pComponentID)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pComponentID: componentid
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    processMaterialPartList: _.values(response[1]),
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

    // Retrive list of Functional testing Equipment
    // POST : /api/v1/component/getFunctionaltestingEquipmentGridList
    // @return list of Functional testing Equipment
    getFunctionaltestingEquipmentGridList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            const componentid = req.body.id ? req.body.id : null;

            return sequelize
                .query('CALL Sproc_RetrieveFunctionaltestingEquipment (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pComponentID)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pComponentID: componentid
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    functionalTestingEquipmentList: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
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

    // Retrive list of Alternet part
    // POST : /api/v1/component/getPossibleAlternetParts
    // @return list of Possible Alternet Partlist
    getPossibleAlternetPartList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveComponentPossibleAlternetPart (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pComponentID)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pComponentID: req.body.id || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                possiblePartList: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Retrive list of Functional Tessting Equipment
    // POST : /api/v1/component/getComponentFunctionalTestingEquipmentSearch
    // @return list of Functional Tessting Equipment
    getComponentFunctionalTestingEquipmentSearch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetComponentFunctionalTestingEquipmentSearch(:pSearch,:pCurrentPartId)', {
            replacements: {
                pSearch: req.body.listObj.query || null,
                pCurrentPartId: req.body.listObj.currentPartId
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            data: _.values(response[0])
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get Functional Type Part List
    // GET : /api/v1/component/getFunctionalTypePartList
    // @param {id} int
    // @return List of Functional Type Part
    getFunctionalTypePartList: (req, res) => {
        const {
            ComponentRequireFunctionalType,
            RFQPartType
        } = req.app.locals.models;

        if (req.params.id) {
            return ComponentRequireFunctionalType.findAll({
                where: {
                    refComponentID: req.params.id
                },
                attributes: ['id', 'partTypeID', 'refComponentID'],
                include: [{
                    model: RFQPartType,
                    as: 'rfq_parttypemst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'partTypeName'],
                    required: false
                }]
            }).then(functionalTypePart => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, functionalTypePart, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Save Functional Type Part
    // POST : /api/v1/component/saveFunctionalTypePart
    // @return New Save Functional Type Part
    saveFunctionalTypePart: (req, res) => {
        const {
            Component,
            ComponentRequireFunctionalType,
            sequelize
        } = req.app.locals.models;
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const alias = req.body.componentObj;
            return sequelize.transaction().then((t) => {
                Component.findAll({
                    where: {
                        id: {
                            [Op.in]: [alias.refComponentID]
                        }
                    },
                    attributes: ['id'],
                    transaction: t
                }).then(() => {
                    var promises = [];
                    let partIDs = _.map(alias.list, 'id');
                    if (partIDs.length === 0) {
                        partIDs = [-100];
                    }
                    promises.push(
                        ComponentRequireFunctionalType.update({
                            isDeleted: true,
                            deletedBy: COMMON.getRequestUserID(req),
                            deletedAt: COMMON.getCurrentUTC(),
                            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        }, {
                                where: {
                                    refComponentID: alias.refComponentID,
                                    partTypeID: {
                                        [Op.notIn]: partIDs
                                    },
                                    deletedAt: null
                                },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted'],
                                transaction: t
                            }).then(() => ({
                                status: STATE.SUCCESS
                            })).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    error: err
                                };
                            })
                    );

                    _.each(alias.list, (part) => {
                        var obj = {
                            partTypeID: part.id,
                            refComponentID: alias.refComponentID,
                            createdBy: req.body.createdBy,
                            updatedBy: req.body.createdBy,
                            isDeleted: false,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        };
                        promises.push(
                            ComponentRequireFunctionalType.findAll({
                                where: {
                                    partTypeID: part.id,
                                    refComponentID: alias.refComponentID,
                                    isDeleted: false
                                },
                                attributes: ['id'],
                                transaction: t
                            }).then((response) => {
                                if (response == null || response.length === 0) {
                                    return ComponentRequireFunctionalType.create(obj, {
                                        transaction: t
                                    }).then(() => ({
                                        status: STATE.SUCCESS
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return {
                                            status: STATE.FAILED,
                                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            error: err
                                        };
                                    });
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
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    error: err
                                };
                            })
                        );
                    });

                    return Promise.all(promises).then((respturntime) => {
                        var resObj = _.find(respturntime, resp => resp.status === STATE.FAILED);
                        if (resObj) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentfunctionalTypePartNameModuleName),
                                err: null,
                                data: null
                            });
                        } else {
                            return ComponentRequireFunctionalType.count({
                                where: {
                                    refComponentID: alias.refComponentID,
                                    isDeleted: false
                                },
                                transaction: t
                            }).then((rowsSelected) => {
                                var obj = null;
                                if (rowsSelected > 0) {
                                    obj = {
                                        functionalTypePartRequired: true,
                                        updatedBy: COMMON.getRequestUserID(req),
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                    };
                                } else {
                                    obj = {
                                        functionalTypePartRequired: false,
                                        updatedBy: COMMON.getRequestUserID(req),
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                        updatedAt: COMMON.getCurrentUTC()
                                    };
                                }
                                return Component.update(obj, {
                                    where: {
                                        id: alias.refComponentID
                                    },
                                    transaction: t
                                }).then(() => module.exports.updateBOMSpecificPartRequirementsError(req, alias.refComponentID, 1, t).then((spResponse) => {
                                    if (spResponse.status === STATE.SUCCESS) {
                                        t.commit();
                                        RFQSocketController.sendBOMSpecificPartRequirementChanged(req, {
                                            partID: alias.refComponentID,
                                            type: 'Functional Type'
                                        });
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(componentfunctionalTypePartNameModuleName));
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: null,
                                            data: null
                                        });
                                    }
                                }).catch((err) => {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                })).catch((err) => {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            }).catch((err) => {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
                    }).catch((err) => {
                        if (!t.finished) {
                            t.rollback();
                        }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // delete Functional Type Part
    // POST : /api/v1/component/deleteFunctionalTypePart
    // @return Delete Functional Type Part
    deleteFunctionalTypePart: (req, res) => {
        const {
            ComponentRequireFunctionalType
        } = req.app.locals.models;
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const alias = req.body.componentObj;
            return ComponentRequireFunctionalType.update({
                isDeleted: true,
                deletedBy: COMMON.getRequestUserID(req),
                deletedAt: COMMON.getCurrentUTC(),
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            }, {
                    where: {
                        refComponentID: alias.refComponentID,
                        partTypeID: {
                            [Op.in]: [alias.partTypeID]
                        },
                        deletedAt: null
                    }
                }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.DELETED(componentfunctionalTypePartNameModuleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get Mounting Type Part List
    // GET : /api/v1/component/getMountingTypePartList
    // @param {id} int
    // @return List of Mounting Type Part
    getMountingTypePartList: (req, res) => {
        const {
            ComponentRequireMountingType,
            RFQMountingType
        } = req.app.locals.models;

        if (req.params.id) {
            return ComponentRequireMountingType.findAll({
                where: {
                    refComponentID: req.params.id
                },
                attributes: ['id', 'partTypeID', 'refComponentID'],
                include: [{
                    model: RFQMountingType,
                    as: 'rfq_mountingtypemst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'name'],
                    required: false
                }]
            }).then(mountingTypePart => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mountingTypePart, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Save Mounting Type Part
    // POST : /api/v1/component/saveMountingTypePart
    // @return New Save Mounting Type Part
    saveMountingTypePart: (req, res) => {
        const {
            Component,
            ComponentRequireMountingType,
            sequelize
        } = req.app.locals.models;
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const alias = req.body.componentObj;
            return sequelize.transaction().then((t) => {
                Component.findAll({
                    where: {
                        id: {
                            [Op.in]: [alias.refComponentID]
                        }
                    },
                    attributes: ['id'],
                    transaction: t
                }).then(() => {
                    var promises = [];
                    let partIDs = _.map(alias.list, 'id');
                    if (partIDs.length === 0) {
                        partIDs = [-100];
                    }
                    promises.push(
                        ComponentRequireMountingType.update({
                            isDeleted: true,
                            deletedBy: COMMON.getRequestUserID(req),
                            deletedAt: COMMON.getCurrentUTC(),
                            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        }, {
                                where: {
                                    refComponentID: alias.refComponentID,
                                    partTypeID: {
                                        [Op.notIn]: partIDs
                                    },
                                    deletedAt: null
                                },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted'],
                                transaction: t
                            }).then(() => ({
                                status: STATE.SUCCESS
                            })).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    error: err
                                };
                            })
                    );

                    _.each(alias.list, (part) => {
                        var obj = {
                            partTypeID: part.id,
                            refComponentID: alias.refComponentID,
                            createdBy: req.body.createdBy,
                            updatedBy: req.body.createdBy,
                            isDeleted: false,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        };
                        promises.push(
                            ComponentRequireMountingType.findAll({
                                where: {
                                    partTypeID: part.id,
                                    refComponentID: alias.refComponentID,
                                    isDeleted: false
                                },
                                attributes: ['id'],
                                transaction: t
                            }).then((response) => {
                                if (response == null || response.length === 0) {
                                    return ComponentRequireMountingType.create(obj, {
                                        transaction: t
                                    }).then(() => ({
                                        status: STATE.SUCCESS
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return {
                                            status: STATE.FAILED,
                                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            error: err
                                        };
                                    });
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
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    error: err
                                };
                            })
                        );
                    });

                    return Promise.all(promises).then((respturntime) => {
                        var resObj = _.find(respturntime, resp => resp.status === STATE.FAILED);
                        if (resObj) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: resObj.message,
                                err: null,
                                data: null
                            });
                        } else {
                            return ComponentRequireMountingType.count({
                                where: {
                                    refComponentID: alias.refComponentID,
                                    isDeleted: false
                                },
                                transaction: t
                            }).then((rowsSelected) => {
                                var obj = null;
                                if (rowsSelected > 0) {
                                    obj = {
                                        mountingTypePartRequired: true,
                                        updatedBy: COMMON.getRequestUserID(req),
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                    };
                                } else {
                                    obj = {
                                        mountingTypePartRequired: false,
                                        updatedBy: COMMON.getRequestUserID(req),
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                        updatedAt: COMMON.getCurrentUTC()
                                    };
                                }
                                return Component.update(obj, {
                                    where: {
                                        id: alias.refComponentID
                                    },
                                    transaction: t
                                }).then(() => module.exports.updateBOMSpecificPartRequirementsError(req, alias.refComponentID, 0, t).then((spResponse) => {
                                    if (spResponse.status === STATE.SUCCESS) {
                                        t.commit();
                                        RFQSocketController.sendBOMSpecificPartRequirementChanged(req, {
                                            partID: alias.refComponentID,
                                            type: 'Mounting Type'
                                        });
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(componentMountingTypePartNameModuleName));
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: null,
                                            data: null
                                        });
                                    }
                                }).catch((err) => {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                })).catch((err) => {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            }).catch((err) => {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
                    }).catch((err) => {
                        if (!t.finished) {
                            t.rollback();
                        }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // delete Mounting Type Part
    // POST : /api/v1/component/deleteMountingTypePart
    // @return Delete Mounting Type Part
    deleteMountingTypePart: (req, res) => {
        const {
            ComponentRequireMountingType
        } = req.app.locals.models;
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const alias = req.body.componentObj;
            return ComponentRequireMountingType.update({
                isDeleted: true,
                deletedBy: COMMON.getRequestUserID(req),
                deletedAt: COMMON.getCurrentUTC(),
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            }, {
                    where: {
                        refComponentID: alias.refComponentID,
                        partTypeID: {
                            [Op.in]: [alias.partTypeID]
                        },
                        deletedAt: null
                    }
                }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.DELETED(componentMountingTypePartNameModuleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component Internal Version
    // GET : /api/v1/component/getComponentInternalVersion
    // @param {id} int
    // @return List of Component alias
    getComponentInternalVersion: (req, res) => {
        const {
            ComponentBOMSetting
        } = req.app.locals.models;
        ComponentBOMSetting.findOne({
            where: {
                refComponentID: req.params.id
            },
            attributes: ['liveVersion']
        }).then(component => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, component, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Get List of Component Good Part
    // GET : /api/v1/component/getComponentGoodPart
    // @param {id} int
    // @return List of Component Good Part
    getComponentGoodPart: (req, res) => {
        const {
            Component,
            ComponentAlternatePN,
            ComponentDrivetools,
            ComponentOtherPN,
            UOMs,
            MfgCodeMst,
            RFQConnecterType,
            ComponentProcessMaterial,
            RFQPartType,
            RFQMountingType
        } = req.app.locals.models;
        Component.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['replacementPartID']
        }).then((component) => {
            if (component && component.replacementPartID) {
                return Component.findAll({
                    where: {
                        id: component.replacementPartID
                    },
                    attributes: ['id', 'mfgPN', 'mfgcodeID', 'isGoodPart', 'noOfPosition', 'RoHSStatusID', 'feature', 'mfgPNDescription', 'connecterTypeID', 'connectorTypeText', 'mountingTypeID', 'category', 'functionalCategoryID', 'pitch', 'noOfRows', 'value', 'partPackage', 'restrictUSEwithpermission', 'restrictUsePermanently', 'pickupPadRequired', 'matingPartRquired', 'driverToolRequired', 'programingRequired', 'functionalTestingRequired', 'tolerance', 'minOperatingTemp', 'maxOperatingTemp', 'powerRating', 'replacementPartID', 'createdBy', 'uom', 'color', 'voltage', 'refSupplierMfgpnComponentID', 'isEpoxyMount'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgCode', 'mfgName', 'acquisitionDetail']
                    },
                    {
                        model: Component,
                        as: 'replacementComponent',
                        attributes: ['mfgPN'],
                        required: false
                    },
                    {
                        model: RFQConnecterType,
                        as: 'rfqConnecterType',
                        attributes: ['id', 'name']
                    }, {
                        model: ComponentAlternatePN,
                        as: 'componentAlterPN',
                        attributes: ['id', 'componentID', 'refComponentID', 'type']
                    },
                    {
                        model: ComponentDrivetools,
                        as: 'refDriveToolAlias',
                        attributes: ['id', 'componentID', 'refComponentID']
                    },
                    {
                        model: ComponentProcessMaterial,
                        as: 'refProcessMaterial',
                        attributes: ['id', 'componentID', 'refComponentID']
                    },
                    {
                        model: ComponentOtherPN,
                        as: 'component_otherpn',
                        attributes: ['name'],
                        required: false
                    },
                    {
                        model: UOMs,
                        as: 'UOMs',
                        attributes: ['unitName'],
                        required: false
                    },
                    {
                        model: RFQPartType,
                        as: 'rfqPartType',
                        attributes: ['partTypeName'],
                        required: false
                    },
                    {
                        model: RFQMountingType,
                        as: 'rfqMountingType',
                        attributes: ['name'],
                        required: false
                    },
                    {
                        model: Component,
                        as: 'refSupplierMfgComponent',
                        attributes: ['mfgPN', 'id', 'mfgcodeID'],
                        include: [{
                            model: MfgCodeMst,
                            as: 'mfgCodemst',
                            attributes: ['id', 'mfgCode', 'mfgName', 'acquisitionDetail'],
                            where: {
                                mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG
                            },
                            required: false
                        }],
                        required: false
                    }
                    ]
                }).then(goodComponent => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, goodComponent, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get component details
    // GET : /api/v1/component/getComponentBasicDetails
    // @param {id} int
    // @return component details
    getComponentBasicDetails: (req, res) => {
        const {
            Component,
            RFQRoHS
        } = req.app.locals.models;
        Component.findOne({
            where: {
                id: req.body.componentID
            },
            attributes: ['PIDCode', 'mfgPN', 'nickName', 'isCustom'],
            include: [{
                model: RFQRoHS,
                as: 'rfq_rohsmst',
                attributes: ['id', 'name', 'rohsIcon']
            }]
        }).then(component => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, component, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Upload Component Images
    // POST : /api/v1/component/createComponentImage
    // @return New created component Image Detail
    createComponentImage: (req, res) => {
        const {
            Component,
            ComponentImages,
            sequelize
        } = req.app.locals.models;
        var filePromises = [];
        let genFilePath;
        // upload(req, res, (err) => {
        if (req.body) {
            return sequelize.query('CALL Sproc_getRefTransDetailForDocument (:pGencFileOwnerType, :pRefTransID,:pIsReturnDetail)', {
                replacements: {
                    pGencFileOwnerType: COMMON.AllEntityIDS.Component.Name,
                    pRefTransID: req.body.refComponentID || null,
                    pIsReturnDetail: true
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                let folders = [];
                genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;
                const documentCreatedDateInfo = _.first(_.values(response[0]));
                if (documentCreatedDateInfo) {
                    folders = documentCreatedDateInfo.newDocumentPath.split('/');
                }

                folders.push(DATA_CONSTANT.COMPONENT.IMAGE_FOLDER_NAME);
                _.each(folders, (folder) => {
                    genFilePath = `${genFilePath}${folder}/`;
                    if (!fs.existsSync(genFilePath)) {
                        fs.mkdirSync(genFilePath);
                    }
                });

                COMMON.setModelCreatedByFieldValue(req);
                filePromises = [];
                _.each(req.files.files, (fileItem) => {
                    // const ext = (/[.]/.exec(fileItem.originalname)) ? /[^.]+$/.exec(fileItem.originalname)[0] : null;
                    var file = fileItem.file; // req.files.documents[0];
                    const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                    var fileName = `${uuidv1()}.${ext}`;
                    var path = genFilePath + fileName;
                    fileItem.file.fileName = fileName;

                    filePromises.push(fsextra.move(file.path, path)
                        .then(() => STATE.SUCCESS)
                        .catch(() => STATE.FAILED));
                });
                return Promise.all(filePromises).then(() => {
                    var promises = [];
                    return sequelize.transaction().then((t) => {
                        var componentObj = {
                            imageURL: req.files.files[0].file.fileName,
                            updatedBy: COMMON.getRequestUserID(req),
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                            updatedAt: COMMON.getCurrentUTC()
                        };
                        promises.push(
                            Component.findOne({
                                where: {
                                    id: req.body.refComponentID
                                },
                                transaction: t
                            }).then((comp) => {
                                if (comp) {
                                    if (comp.imageURL) {
                                        return {
                                            status: STATE.SUCCESS
                                        };
                                    } else {
                                        return Component.update(componentObj, {
                                            where: {
                                                id: req.body.refComponentID
                                            },
                                            transaction: t,
                                            attributes: ['imageURL', 'updatedBy']
                                        }).then(() => ({
                                            status: STATE.SUCCESS
                                        })).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return {
                                                status: STATE.FAILED,
                                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                error: err
                                            };
                                        });
                                    }
                                } else {
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                                    };
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    error: err
                                };
                            })
                        );
                        _.each(req.files.files, (item) => {
                            req.body.imageURL = item.file.fileName;
                            req.body.isDeleted = false;

                            promises.push(
                                ComponentImages.create(req.body, {
                                    fields: inputFieldsImages,
                                    transaction: t
                                }).then(() => ({
                                    status: STATE.SUCCESS
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        error: err
                                    };
                                })
                            );
                        });

                        return Promise.all(promises).then((resp) => {
                            var img = _.find(resp, item => item.status === STATE.FAILED);

                            if (!img) {
                                t.commit();
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, MESSAGE_CONSTANT.CREATED(componentImagesName));
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                    messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentImagesName),
                                    err: null,
                                    data: null
                                });
                            }
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
        // });
    },

    // Get component Images details
    // GET : /api/v1/component/getComponentImages
    // @param {id} int
    // @return component Images details
    getComponentImages: (req, res) => {
        const {
            Component,
            ComponentImages
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentImages.findAll({
                where: {
                    refComponentID: req.params.id,
                    isDeleted: false
                },
                attributes: ['id', 'imageURL', 'refComponentID', 'isDeleted'],
                include: [{
                    model: Component,
                    as: 'component',
                    attributes: ['id', 'documentPath', 'imageURL']
                }]
            }).then(img => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, img, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // delete Component Images
    // PUT : /api/v1/component/deleteComponentImages
    // @param {id} int
    // @return delete component images
    deleteComponentImages: (req, res) => {
        const {
            ComponentImages
        } = req.app.locals.models;
        var deletedIds;
        var obj = {};
        if (req.body.componentObj) {
            COMMON.setModelDeletedByFieldValue(req);
            deletedIds = req.body.componentObj.deletedIDs;
            obj = {
                isDeleted: req.body.isDeleted,
                deletedAt: req.body.deletedAt,
                deletedBy: req.body.deletedBy,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return ComponentImages.update(obj, {
                where: {
                    id: {
                        [Op.in]: _.map(deletedIds, 'id')
                    },
                    refComponentID: req.body.componentObj.refComponentID
                }
            }).then(componentAlias => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, componentAlias, MESSAGE_CONSTANT.DELETED(componentImagesName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // create Component Image urls
    // PUT : /api/v1/component/createComponentImageUrls
    // @param {id} int
    // @return create component image Urls
    createComponentImageUrls: (req, res) => {
        const {
            ComponentImages
        } = req.app.locals.models;
        var promises = [];
        if (req.body.componentObj) {
            COMMON.setModelCreatedByFieldValue(req);
            promises = [];
            _.each(req.body.componentObj.files, (img) => {
                var objImg = {
                    imageURL: img,
                    refComponentID: req.body.componentObj.refComponentID,
                    createdBy: req.body.createdBy,
                    updatedBy: req.body.createdBy,
                    isDeleted: false,
                    createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                };
                promises.push(
                    ComponentImages.create(objImg, {}).then(() => ({
                        status: STATE.SUCCESS
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            error: err
                        };
                    })
                );
            });
            return Promise.all(promises).then((retresponse) => {
                var resObj = _.find(retresponse, resp => resp.status === STATE.FAILED);

                if (resObj) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentImagesName),
                        err: null,
                        data: null
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(componentImagesName));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentImagesName),
                    err: null,
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

    // get Component Alternate PN Validations
    // PUT : /api/v1/component/getComponentAlternatePnValidations
    // @param {id} int
    // @return Component Alternate PN Validations
    getComponentAlternatePnValidations: (req, res) => {
        const {
            ComponentAlternatePNValidations
        } = req.app.locals.models;
        var where = {};
        if (req.body.componentObj.type) {
            where.type = req.body.componentObj.type;
            where.isDeleted = false;
            if (req.body.componentObj.id) {
                where.refRfqPartTypeId = req.body.componentObj.id;
            }

            return ComponentAlternatePNValidations.findAll({
                where: where,
                attributes: ['id', 'refRfqPartTypeId', 'fieldTitle', 'fieldNameToValidate', 'fieldDataType', 'matchCriteria']
            }).then(fields => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, fields, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // Check Component Alternate/Packaging/RoHS Replacement Part Validations
    // PUT : /api/v1/component/checkAlternateAliasValidations
    // @param {id} int
    // @return Check Component Alternate/Packaging/RoHS Replacement Part Validations
    checkAlternateAliasValidations: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.toPartId && req.body.fromPartId) {
            sequelize.query('CALL Sproc_GetMisMatchFieldList_of_AlternateAliasValidation(:pToPartID,:pFromPartIDs,:pTypeID)', {
                replacements: {
                    pToPartID: req.body.toPartId,
                    pFromPartIDs: req.body.fromPartId,
                    pTypeID: req.body.typeId
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response[0] && response[0][0] && response[0][0].misMatchFields) {
                    if (req.body.returnAllValidation) {
                        const validationParts = _.values(response[0]);
                        // validationParts.forEach(() => {
                        //     const messageContent = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMPONENT_ALTERNATE_PART_MAPPING_PARAMETER_NOT_MATCH_MESSAGE);
                        //     const addingPartType = req.body.typeId === DATA_CONSTANT.VALIDATION_TYPE.PACKAGING_PART.ID ? DATA_CONSTANT.VALIDATION_TYPE.PACKAGING_PART.NAME :
                        //         req.body.typeId === DATA_CONSTANT.VALIDATION_TYPE.ALTERNATE_PART.ID ? DATA_CONSTANT.VALIDATION_TYPE.ALTERNATE_PART.NAME : DATA_CONSTANT.VALIDATION_TYPE.ROHSREPLACEMENT_PART.NAME;
                        //     messageContent.message = COMMON.stringFormat(messageContent.message, response[0][0].misMatchFields, addingPartType);
                        // });

                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null);
                    } else {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMPONENT_ALTERNATE_PART_MAPPING_PARAMETER_NOT_MATCH_MESSAGE);
                        const addingPartType = req.body.typeId === DATA_CONSTANT.VALIDATION_TYPE.PACKAGING_PART.ID ? DATA_CONSTANT.VALIDATION_TYPE.PACKAGING_PART.NAME :
                            req.body.typeId === DATA_CONSTANT.VALIDATION_TYPE.ALTERNATE_PART.ID ? DATA_CONSTANT.VALIDATION_TYPE.ALTERNATE_PART.NAME : DATA_CONSTANT.VALIDATION_TYPE.ROHSREPLACEMENT_PART.NAME;
                        messageContent.message = COMMON.stringFormat(messageContent.message, response[0][0].misMatchFields, addingPartType);

                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: messageContent,
                            err: null,
                            data: null
                        });
                    }
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }
        else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Get assembly component detail by id
    // GET : /api/v1/assembly/getAssemblyComponentDetailById
    // @return API response
    getAssemblyComponentDetailById: async (req, res) => {
        const {
            MfgCodeMst,
            RFQAssemblies,
            RFQForms,
            Component,
            RFQRoHS,
            ComponentRequireFunctionalType,
            RFQMountingType,
            ComponentRequireMountingType,
            RFQPartType,
            ComponentStandardDetails,
            CertificateStandards,
            GenericCategory,
            User,
            RFQAssembliesQuotationSubmitted,
            sequelize,
            ComponentBOMSetting
        } = req.app.locals.models;
        let mfgCodeFormat = null;
        try {
            mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                type: sequelize.QueryTypes.SELECT
            });
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
        return await Component.findOne({
            where: {
                id: req.params.id
            },
            model: Component,
            attributes: ['id', 'mfgPN', 'PIDCode', 'rev', 'assyCode', 'mfgPNDescription', 'nickname', 'RoHSStatusID', 'functionalTypePartRequired', 'mountingTypePartRequired', 'mfgcodeID', 'rohsDeviation', [sequelize.fn('fun_replaceSpecialCharacters', sequelize.col('Component.mfgPN')), 'mfgPNwithOutSpacialChar'], 'custAssyPN'],
            include: [{
                model: ComponentBOMSetting,
                as: 'componentbomSetting',
                attributes: ['liveInternalVersion', 'exteranalAPICallStatus', 'isActivityStart', 'activityStartBy', 'activityStartAt', 'bomLock', 'isBOMVerified'],
                include: [{
                    model: User,
                    as: 'user',
                    require: false,
                    attributes: ['firstName', 'lastName']
                }]
            }, {
                model: ComponentRequireFunctionalType,
                as: 'component_requirefunctionaltype',
                attributes: ['id', 'refComponentID', 'partTypeID'],
                include: [{
                    model: RFQPartType,
                    as: 'rfq_parttypemst',
                    attributes: ['id', 'partTypeName']
                }]
            },
            {
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
                attributes: ['id', 'rohsIcon', 'isActive', 'name', 'refMainCategoryID']
            },
            {
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
            },
            {
                model: RFQAssemblies,
                as: 'rfqAssemblies',
                attributes: ['id', 'rfqrefID', 'jobTypeID', 'RFQTypeID', 'eau', 'proposedBuildQty', 'noOfBuild', 'timePeriod', 'additionalRequirement', 'quoteInDate', 'quoteDueDate', 'quoteNumber', 'quoteSubmitDate', 'assemblyTypeID', 'status', 'isBOMVerified', 'isReadyForPricing', 'quoteFinalStatus', 'isSummaryComplete', 'bomFCAVersion', 'RoHSStatusID', 'partID'],
                include: [{
                    model: RFQForms,
                    as: 'rfqForms',
                    attributes: ['id', 'customerId', 'quoteindate'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'customer',
                        attributes: ['id', 'mfgName', 'mfgCode', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('rfqAssemblies->rfqForms->customer.mfgCode'), sequelize.col('rfqAssemblies->rfqForms->customer.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']]
                    }]
                },
                {
                    model: RFQAssembliesQuotationSubmitted,
                    as: 'rfqAssyQuoteSubmitted',
                    attributes: ['id', 'quotenumber', 'rfqAssyID']
                }
                ]
            }, {
                model: MfgCodeMst,
                as: 'mfgCodemst',
                attributes: ['id', 'mfgCode', 'mfgName', 'acquisitionDetail', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('mfgCodemst.mfgCode'), sequelize.col('mfgCodemst.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
                where: {
                    mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG
                },
                required: false
            }]
        }).then(component =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, component, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get stock status of component
    // GET : /api/v1/component/getStockStatus/id
    // @param {id} int
    // @return stock status of component
    getStockStatus: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetStockStatus(:pComponentID)', {
            replacements: {
                pComponentID: req.params.id || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
                stockDetail: _.first(_.values(response[0])),
                stockUnitDetail: _.first(_.values(response[1])),
                stockUOMDetail: _.first(_.values(response[2])),
                customerConsignmentStockList: _.values(response[3])
            },
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get packaing parts of component
    // GET : /api/v1/component/getComponentPackgingParts
    // @param {id} int
    // @return packaing parts of component
    getComponentPackgingParts: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        const componentid = req.body.id ? req.body.id : null;

        sequelize.query('CALL Sproc_RetrievePackagingParts(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pComponentID)', {
            replacements: {
                pPageIndex: req.body.Page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pComponentID: componentid
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            packagingParts: _.values(response[1]),
            Count: response[0][0]['COUNT(*)']
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get CPN list of component
    // GET : /api/v1/component/getComponentPackgingParts
    // @param {id} int
    // @return CPN list of component
    getComponentCPNList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        const componentid = req.body.id ? req.body.id : null;

        sequelize.query('CALL Sproc_RetrieveComponentCPNList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pComponentID)', {
            replacements: {
                pPageIndex: req.body.Page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pComponentID: componentid
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            cpnList: _.values(response[1]),
            Count: response[0][0]['COUNT(*)']
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get buy detail of component
    // GET : /api/v1/component/getComponentBuyDetail/:id
    // @param {id} int
    // @return buy detail of component
    getComponentBuyDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetComponentBuyDetail(:pComponentID)', {
            replacements: {
                pComponentID: req.params.id || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            buyDetail: _.values(response[0])
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Retrive unique External values used in component
    // POST : /api/v1/component/getComponentExternalValues
    // @param {id} pFieldName
    // @return component
    getComponentExternalValues: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        return sequelize.query('CALL Sproc_GetComponentExternalValues (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pFieldName)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere || null,
                pFieldName: req.body.pFieldName || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (!response) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    externalValues: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
                }, null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Retrive Component Temperature Sensitive Data List
    // POST : /api/v1/component/getComponentTemperatureSensitiveDataList
    // @return Component Temperature Sensitive Data List
    getComponentTemperatureSensitiveDataList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var strWhere = '';
        if (req.body.componentID) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize.query('CALL Sproc_GetComponentTemperatureSensitiveData(:pComponentId,:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    pComponentId: req.body.componentID,
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentTemperatureSensitiveDataModuleName),
                        err: null,
                        data: null
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        temperatureSensitiveData: _.values(response[1]),
                        Count: response[0][0]['TotalRecord']
                    }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: null,
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
    // Retrive Component Temperature Sensitive Data
    // GET : /api/v1/component/getComponentTemperatureSensitiveDataByID
    // @param {id} id
    // @return Component Temperature Sensitive Data
    getComponentTemperatureSensitiveDataByID: (req, res) => {
        const {
            ComponentTemperatureSensitiveData
        } = req.app.locals.models;
        ComponentTemperatureSensitiveData.findOne({
            where: {
                id: req.params.id,
                isDeleted: false
            },
            attributes: ['id', 'pickTemperatureAbove', 'timeLiquidusSecond', 'refComponentID']
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentTemperatureSensitiveDataModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Create Component Temperature Sensitive Data
    // POST : /api/v1/component/createComponentTemperatureSensitiveData
    // @return new Component Temperature Sensitive Data
    createComponentTemperatureSensitiveData: (req, res) => {
        const {
            Component,
            ComponentTemperatureSensitiveData
        } = req.app.locals.models;
        var obj = {};
        if (req.body.tempDataObj) {
            COMMON.setModelCreatedByFieldValue(req);
            const alias = req.body.tempDataObj;

            return Component.findAll({
                where: {
                    id: alias.refComponentID,
                    isDeleted: false
                },
                attributes: ['id']
            }).then((response) => {
                if (response && response.length > 0) {
                    obj = {
                        refComponentID: alias.refComponentID,
                        pickTemperatureAbove: alias.pickTemperatureAbove,
                        timeLiquidusSecond: alias.timeLiquidusSecond,
                        createdBy: req.body.createdBy,
                        updatedBy: req.body.createdBy,
                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };
                    return ComponentTemperatureSensitiveData.findOne({
                        where: {
                            refComponentID: alias.refComponentID,
                            pickTemperatureAbove: alias.pickTemperatureAbove,
                            timeLiquidusSecond: alias.timeLiquidusSecond,
                            isDeleted: false
                        }
                    }).then((compTempdata) => {
                        if (compTempdata) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.PARTS.COMP_TEMPERATURE_SENSITIVE_DATA_VALIDATION,
                                err: null,
                                data: null
                            });
                        } else {
                            return ComponentTemperatureSensitiveData.create(obj, {}).then((tempData) => {
                                obj = {
                                    updatedBy: req.body.createdBy,
                                    isTemperatureSensitive: true,
                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                    updatedAt: COMMON.getCurrentUTC()
                                };
                                return Component.update(obj, {
                                    where: {
                                        id: alias.refComponentID
                                    }
                                }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, tempData, MESSAGE_CONSTANT.CREATED(componentTemperatureSensitiveDataModuleName))).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentTemperatureSensitiveDataModuleName),
                        err: null,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // update Component Temperature Sensitive Data
    // POST : /api/v1/component/updateComponentTemperatureSensitiveData
    // @return update Component Temperature Sensitive Data
    updateComponentTemperatureSensitiveData: (req, res) => {
        const {
            Component,
            ComponentTemperatureSensitiveData
        } = req.app.locals.models;
        if (req.body.tempDataObj) {
            COMMON.setModelUpdatedByFieldValue(req);
            const alias = req.body.tempDataObj;

            return Component.findAll({
                where: {
                    id: alias.refComponentID,
                    isDeleted: false
                },
                attributes: ['id']
            }).then((response) => {
                if (response && response.length > 0) {
                    const obj = {
                        pickTemperatureAbove: alias.pickTemperatureAbove,
                        timeLiquidusSecond: alias.timeLiquidusSecond,
                        updatedBy: req.body.updatedBy,
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updatedAt: COMMON.getCurrentUTC()
                    };
                    return ComponentTemperatureSensitiveData.findOne({
                        where: {
                            Id: {
                                [Op.ne]: alias.id
                            },
                            refComponentID: alias.refComponentID,
                            pickTemperatureAbove: alias.pickTemperatureAbove,
                            timeLiquidusSecond: alias.timeLiquidusSecond,
                            isDeleted: false
                        }
                    }).then((compTempdata) => {
                        if (compTempdata) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.PARTS.COMP_TEMPERATURE_SENSITIVE_DATA_VALIDATION,
                                err: null,
                                data: null
                            });
                        } else {
                            return ComponentTemperatureSensitiveData.update(obj, {
                                where: {
                                    id: alias.id
                                }
                            }).then(tempData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, tempData, MESSAGE_CONSTANT.UPDATED(componentTemperatureSensitiveDataModuleName))).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentTemperatureSensitiveDataModuleName),
                        err: null,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // delete Component Temperature Sensitive Data
    // PUT : /api/v1/component/deleteComponentTemperatureSensitiveData
    // @param {id} int
    // @return remove Component Temperature Sensitive Data
    deleteComponentTemperatureSensitiveData: (req, res) => {
        const {
            ComponentTemperatureSensitiveData,
            Component
        } = req.app.locals.models;
        var obj = {};
        if (req.body.id) {
            COMMON.setModelDeletedByFieldValue(req);
            obj = {
                isDeleted: req.body.isDeleted,
                deletedAt: req.body.deletedAt,
                deletedBy: req.body.deletedBy,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };

            return ComponentTemperatureSensitiveData.update(obj, {
                where: {
                    id: req.body.id,
                    isDeleted: false
                }
            }).then(resp => ComponentTemperatureSensitiveData.count({
                where: {
                    refComponentID: req.body.refComponentID,
                    isDeleted: false
                }
            }).then((compResp) => {
                if (compResp <= 0) {
                    obj = {
                        updatedBy: req.body.createdBy,
                        isTemperatureSensitive: false,
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updatedAt: COMMON.getCurrentUTC()
                    };
                    return Component.update(obj, {
                        where: {
                            id: req.body.refComponentID
                        }
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, MESSAGE_CONSTANT.REMOVED(componentTemperatureSensitiveDataModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, MESSAGE_CONSTANT.REMOVED(componentTemperatureSensitiveDataModuleName));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // check Part Used as Packaging Alias
    // GET : /api/v1/component/checkPartUsedAsPackagingAlias/:id
    // @param {id} int
    // @return count
    checkPartUsedAsPackagingAlias: (req, res) => {
        const {
            Component,
            ComponentPackagingAlias
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentPackagingAlias.count({
                where: {
                    isDeleted: false,
                    componentID: req.params.id
                },
                include: [{
                    model: Component,
                    as: 'component',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id'],
                    required: true
                }]
            }).then((componentPackagingAlias) => {
                const obj = {
                    count: componentPackagingAlias
                };
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // check Part Used as Alternate Part
    // GET : /api/v1/component/checkPartUsedAsAlternatePart/:id
    // @param {id} int
    // @return count
    checkPartUsedAsAlternatePart: (req, res) => {
        const {
            Component,
            ComponentAlternatePN
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentAlternatePN.count({
                where: {
                    isDeleted: false,
                    componentID: req.params.id
                },
                include: [{
                    model: Component,
                    as: 'component',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id'],
                    required: true
                }]
            }).then((componentPackagingAlias) => {
                const obj = {
                    count: componentPackagingAlias
                };
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // check Part Used as RoHS Alternate Part
    // GET : /api/v1/component/checkPartUsedAsRoHSAlternatePart/:id
    // @param {id} int
    // @return count
    checkPartUsedAsRoHSAlternatePart: (req, res) => {
        const {
            Component,
            ComponentROHSAlternatePN
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentROHSAlternatePN.count({
                where: {
                    isDeleted: false,
                    componentID: req.params.id
                },
                include: [{
                    model: Component,
                    as: 'component',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id'],
                    required: true
                }]
            }).then((componentRoHSAlternatePn) => {
                const obj = {
                    count: componentRoHSAlternatePn
                };
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // get buy detail of component
    // GET : /api/v1/component/getComponentKitAllocationDetail/:id
    // @param {id} int
    // @return kit allocation detail of component
    getComponentKitAllocationDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetComponentKitAllocation(:pPartID)', {
            replacements: {
                pPartID: req.params.id || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            componentKitAllocationList: _.values(response[0])
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get change history if part
    // POST : /api/v1/component/getComponentHistory
    // @return component history
    getComponentHistory: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var strWhere = '';
        if (req.body.id) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize.query('CALL Sproc_GetComponentHistory (:pPartID,:ppageIndex,:precordPerPage,:pOrderBy, :pWhereClause)', {
                replacements: {
                    pPartID: req.body.id,
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                componentHistory: _.values(response[1]),
                Count: response[0][0]['TotalRecord'],
                componentCreatedInfo: _.values(response[2])
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: null,
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
    createDataSheetUrls: (req, res, compId, t) => {
        const {
            ComponentDataSheets
        } = req.app.locals.models;
        if (!req.body.newlyAddedDataSheetUrls) {
            req.body.newlyAddedDataSheetUrls = [];
        }
        if (Array.isArray(req.body.newlyAddedDataSheetUrls) && req.body.newlyAddedDataSheetUrls.length > 0) {
            _.each(req.body.newlyAddedDataSheetUrls, (item) => {
                item.refComponentID = compId;
                item.createdBy = COMMON.getRequestUserID(req);
                item.updatedBy = COMMON.getRequestUserID(req);
                item.isDeleted = false;
            });
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.newlyAddedDataSheetUrls);
            return ComponentDataSheets.bulkCreate(req.body.newlyAddedDataSheetUrls, {
                fields: inputFieldsDataSheetUrl,
                transaction: t
            }).then(() => ({
                status: STATE.SUCCESS
            })).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else {
            return Promise.resolve({
                status: STATE.SUCCESS
            });
        }
    },
    // Get component Data Sheet Urls
    // GET : /api/v1/component/getComponentDataSheetUrls
    // @param {id} int
    // @return component Data Sheet Urls
    getComponentDataSheetUrls: (req, res) => {
        const {
            ComponentDataSheets,
            Component
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentDataSheets.findAll({
                where: {
                    refComponentID: req.params.id,
                    isDeleted: false
                },
                attributes: ['id', 'datasheetURL', 'refComponentID', 'isDeleted', 'datasheetName'],
                include: [{
                    model: Component,
                    as: 'component',
                    attributes: ['id', 'documentPath', 'dataSheetLink']
                }]
            }).then(data => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, data, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // delete Component DataSheet Urls
    // PUT : /api/v1/component/deleteComponentDataSheetUrls
    // @param {id} int
    // @return delete component DataSheet Urls
    deleteComponentDataSheetUrls: (req, res, compId, t) => {
        const {
            ComponentDataSheets
        } = req.app.locals.models;
        var deletedIds;
        if (Array.isArray(req.body.deletedDataSheetUrls) && req.body.deletedDataSheetUrls.length > 0) {
            COMMON.setModelDeletedByFieldValue(req);
            deletedIds = req.body.deletedDataSheetUrls;
            const obj = {
                isDeleted: req.body.isDeleted,
                deletedAt: req.body.deletedAt,
                deletedBy: req.body.deletedBy,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return ComponentDataSheets.update(obj, {
                where: {
                    id: {
                        [Op.in]: _.map(deletedIds, 'id')
                    },
                    refComponentID: compId
                },
                transaction: t
            }).then(() => ({
                status: STATE.SUCCESS
            })).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else {
            return Promise.resolve({
                status: STATE.SUCCESS
            });
        }
    },
    updateBOMForRestrictPart: (req, res, oldRestrictWithPermission, oldRestrictPermenanetly, oldRestrictPackagingUseWithpermission, oldRestrictPackagingUsePermanently, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_UpdateRFQ_LineItems_AlternatePart_Restrict_new (:pPartID, :pOldRestrictUseWithPermission, :pNewRestrictUseWithPermission, :pOldRestrictUsePermanently, :pNewRestrictUsePermanently, :pOldRestrictPackagingUseWithpermission, :pNewRestrictPackagingUseWithpermission, :pOldRestrictPackagingUsePermanently, :pNewRestrictPackagingUsePermanently)', {
            replacements: {
                pPartID: req.params.id,
                pOldRestrictUseWithPermission: oldRestrictWithPermission ? oldRestrictWithPermission : false,
                pNewRestrictUseWithPermission: req.body.restrictUSEwithpermission,
                pOldRestrictUsePermanently: oldRestrictPermenanetly ? oldRestrictPermenanetly : false,
                pNewRestrictUsePermanently: req.body.restrictUsePermanently,
                pOldRestrictPackagingUseWithpermission: oldRestrictPackagingUseWithpermission ? oldRestrictPackagingUseWithpermission : false,
                pNewRestrictPackagingUseWithpermission: req.body.restrictPackagingUseWithpermission,
                pOldRestrictPackagingUsePermanently: oldRestrictPackagingUsePermanently ? oldRestrictPackagingUsePermanently : false,
                pNewRestrictPackagingUsePermanently: req.body.restrictPackagingUsePermanently
            },
            transaction: t,
        }).then(() => {
            // if (req.body.restrictUSEwithpermission !== oldRestrictWithPermission || req.body.restrictUsePermanently !== oldRestrictPermenanetly) {
            //     return sequelize.query('CALL Sproc_UpdateRFQ_LineItems_AlternatePart_Alias_Restrict (:pPartID, :pOldRestrictUseWithPermission, :pNewRestrictUseWithPermission, :pOldRestrictUsePermanently, :pNewRestrictUsePermanently)', {
            //         replacements: {
            //             pPartID: req.params.id,
            //             pOldRestrictUseWithPermission: oldRestrictWithPermission ? oldRestrictWithPermission : false,
            //             pNewRestrictUseWithPermission: req.body.restrictUSEwithpermission,
            //             pOldRestrictUsePermanently: oldRestrictPermenanetly ? oldRestrictPermenanetly : false,
            //             pNewRestrictUsePermanently: req.body.restrictUsePermanently
            //         }
            //     }).then(() => ({
            //         status: STATE.SUCCESS
            //     })).catch((err) => {
            //         console.trace();
            //         console.error(err);
            //         return {
            //             status: STATE.FAILED,
            //             message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
            //             error: err
            //         };
            //     });
            // } else {
            return {
                status: STATE.SUCCESS
            };
            // }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                error: err
            };
        });
    },

    updateBOMMountingAndFunctionalTypeError: async (req, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        return await sequelize.query('CALL Sproc_Update_BOM_MountingType_FunctionalType_new (:pPartID,:puserID,:pRoleID)', {
            replacements: {
                pPartID: req.params.id,
                puserID: req.user.id,
                pRoleID: COMMON.getRequestUserLoginRoleID(req)
            },
            transaction: t
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch(err => ({
            status: STATE.FAILED,
            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
            error: err
        }));
    },

    updateBOMSpecificPartRequirementsError: (req, partId, type, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_Update_BOM_Specific_Part_Requirement (:pPartID, :pType,:pUserID)', {
            replacements: {
                pPartID: partId,
                pType: type,
                pUserID: req.user.id
            },
            transaction: t
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                error: err
            };
        });
    },

    // Get Allocated Kit List
    // POST : /api/v1/component/getAllocatedKitByPart
    getAllocatedKitByPart: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetAllocatedKitForComponent(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartID,:pShowPackagingAlias)', {
            replacements: {
                pPageIndex: req.body.page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pPartID: req.body.id || null,
                pShowPackagingAlias: req.body.showPackagingAlias ? JSON.parse(req.body.showPackagingAlias) : false
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            allocatedInKit: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Get Component List for PartStat.com List
    // GET : /api/v1/component/getComponentListForPartStat
    getComponentListForPartStat: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var filestream;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_GetComponentListForPartStat(:pComponentIds)', {
                replacements: {
                    pComponentIds: req.body.objIDs.id.toString()
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
                        const obj = {
                            header: key,
                            key: key
                        };
                        columns.push(obj);
                    });
                });
                columns = _.uniqBy(columns, e => e.header);
                sheet1.columns = columns;
                _.each(rowData, (item) => {
                    sheet1.addRow(item);
                });

                const path = DATA_CONSTANT.GENERICCATEGORY.UPLOAD_PATH;
                mkdirp(path, () => { });
                const timespan = Date.now();
                const filename = `Parts_${timespan}.xls`;
                res.setHeader('Content-Type', 'application/vnd.ms-excel');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                // entity=entity?entity:'error';

                workbook1.xlsx.writeFile(path + filename).then(() => {
                    // let file = path + entity + ".xls";
                    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
                    res.setHeader('Content-type', 'application/vnd.ms-excel');
                    filestream = fs.createReadStream(path + filename);
                    fs.unlink(path + filename, () => { });
                    filestream.pipe(res);
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // Get part price break details List
    // GET : /api/v1/component/getPartPriceBreakDetails
    getPartPriceBreakDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize.query('CALL Sproc_RetrivePartPriceBreakDetais(:id)', {
            replacements: {
                id: req.body.id
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get assembly sales price details list
    // GET : /api/v1/component/getAssemblySalesPriceDetails
    getAssemblySalesPriceDetails: (req, res) => {
        const {
            ComponentPriceBreakDetails
        } = req.app.locals.models;
        if (req.body) {
            ComponentPriceBreakDetails.findAll({
                where: {
                    mfgPNID: req.body.id,
                    isDeleted: false,
                    type: DATA_CONSTANT.Component_Price_Break_Details.Type.AssySalesPrice,
                    isHistory: false
                },
                order: [['PriceBreak', 'ASC']]
            }).then(resultPrice =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resultPrice, null)
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

    // Get part price break details List
    // POST : /api/v1/component/getPartDynamicAttributeDetails
    getPartDynamicAttributeDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize.query('CALL Sproc_RetrivePartAttributeDetais(:id)', {
            replacements: {
                id: req.body.id
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Copy selected Part Detail From select parts
    // POST : /api/v1/component/copyPartDetail
    // component/copyPartDetail
    copyPartDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.transaction().then(t => {
            return sequelize.query('CALL Sproc_CopyPartDetail(:pFromPartID,:pToPartID,:pUserID,:pIsAttribute,:pIsSettings,:pIsAdditionalAttibute,:pIsPackagingDetail,:pIsStandards,:pIsRequiredFunctionalType,:pIsRequiredMountingType,:pIsPackagingAliasPart,:pIsOtherPartName,:pIsAlternatePart,:pIsRoHSReplacementPart,:pIsDriveTool,:pIsProcessMaterial,:pIsRequiredMattingParts,:pIsPickupPad,:pIsProgram,:pIsFunctionalTesingTool,:pIsFinctionalRestingEquipment)', {
                replacements: {
                    pFromPartID: req.body.FromPartID,
                    pToPartID: req.body.ToPartID,
                    pUserID: req.user.id,
                    pIsAttribute: req.body.pIsAttribute || false,
                    pIsSettings: req.body.pIsSettings || false,
                    pIsAdditionalAttibute: req.body.pIsAdditionalAttibute || false,
                    pIsPackagingDetail: req.body.pIsPackagingDetail || false,
                    pIsStandards: req.body.pIsStandards || false,
                    pIsRequiredFunctionalType: req.body.pIsRequiredFunctionalType || false,
                    pIsRequiredMountingType: req.body.pIsRequiredMountingType || false,
                    pIsPackagingAliasPart: req.body.pIsPackagingAliasPart || false,
                    pIsOtherPartName: req.body.pIsOtherPartName || false,
                    pIsAlternatePart: req.body.pIsAlternatePart || false,
                    pIsRoHSReplacementPart: req.body.pIsRoHSReplacementPart || false,
                    pIsDriveTool: req.body.pIsDriveTool || false,
                    pIsProcessMaterial: req.body.pIsProcessMaterial || false,
                    pIsRequiredMattingParts: req.body.pIsRequiredMattingParts || false,
                    pIsPickupPad: req.body.pIsPickupPad || false,
                    pIsProgram: req.body.pIsProgram || false,
                    pIsFunctionalTesingTool: req.body.pIsFunctionalTesingTool || false,
                    pIsFinctionalRestingEquipment: req.body.pIsFinctionalRestingEquipment || false
                },
                transaction: t,
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response[0] && response[0][0] && response[0][0].message) {
                    if (!t.finished) {
                        t.rollback();
                    }
                    let messageContent = MESSAGE_CONSTANT.PARTS.COMPONENT_REVEISION_DUPLICATE;
                    if (response[0][0].message === DATA_CONSTANT.CREATE_DUPLICATE_PART_VALIDATIONS.PACKAGING_ALIAS_PART_VALIDATION_FAILED) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMPONENT_ALTERNATE_PART_MAPPING_PARAMETER_NOT_MATCH_MESSAGE);
                        messageContent.message = COMMON.stringFormat(messageContent.message, response[0][0].misMatchFields, 'Packaging Alias Part');
                    } else if (response[0][0].message === DATA_CONSTANT.CREATE_DUPLICATE_PART_VALIDATIONS.PACKAGING_GROUP_TYPE_NOT_EXISTS) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.SYSTEMTYPE_NOT_EXISTS);
                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.PACKAGING_ALIAS.Name);
                    }

                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                } else {
                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), MESSAGE_CONSTANT.PARTS.COMPONENT_COPY_SUCCESS_MESSAGE));
                }
            }).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }).catch((err) => {
            if (!t.finished) t.rollback();
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Create Revision from selected assembly
    // POST : /api/v1/component/createAssemblyRevision
    // component/createAssemblyRevision
    createAssemblyRevision: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var messageContent = {};

        return sequelize.transaction().then(t => {
            var promises = [];
            if (req.body.isCPN) {
                promises.push(module.exports.cpnPartMFGValidationPromise(req, req.body.newMfgcodeID));
            }

            return Promise.all(promises).then((response) => {
                var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                if (resObj) {
                    if (!t.finished) {
                        t.rollback();
                    }
                    if (resObj.message) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: resObj.message,
                            err: null,
                            data: null
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName),
                            err: null,
                            data: null
                        });
                    }
                } else {
                    return sequelize.query('CALL Sproc_CreateAssemblyRevision(:pFromPartID,:pNewEpicorType,:pNewAssemblyType,:pNewMfgcodeID,:pNewCustAssyPN,:pNewPartRev,:pNewMfgPN,:pNewAssyCode,:pNewNickName,:pNewPIDCode,:pIsCPN,:pIsCustom,:pUserID,:pUserRoleId,:pIsAttribute,:pIsSettings,:pIsAdditionalAttibute,:pIsPackagingDetail,:pIsStandards,:pIsRequiredFunctionalType,:pIsRequiredMountingType,:pIsPackagingAliasPart,:pIsOtherPartName,:pIsAlternatePart,:pIsRoHSReplacementPart,:pIsDriveTool,:pIsProcessMaterial,:pIsRequiredMattingParts,:pIsPickupPad,:pIsFunctionalTesingTool,:pIsFinctionalRestingEquipment,:pIsBOM,:pIsComments,:pIsCopyImages,:pIsCopyDatasheet,:pIsCopyDocument,:pIsOperationalAttirbutes,:pIsAcceptableShippinCountry,:pIsTrackSNumber,:pMfgPNDescription,:pDetailDescription,:pInternalReference,:pRoHSStatusID,:pIsFluxNotApplicable,:pIsWaterSoluble,:pIsNoClean,:pSpecialNote,:pRohsDeviation,:pFunctionalTypeID,:pMountingTypeID)', {
                        replacements: {
                            pFromPartID: req.body.FromPartID,
                            pNewEpicorType: req.body.newEpicorType,
                            pNewAssemblyType: req.body.newAssemblyType || null,
                            pNewMfgcodeID: req.body.newMfgcodeID,
                            pNewCustAssyPN: req.body.newCustAssyPN || null,
                            pNewPartRev: req.body.newRev || null,
                            pNewMfgPN: req.body.newMfgPN,
                            pNewAssyCode: req.body.newAssyCode || null,
                            pNewNickName: req.body.newNickName || null,
                            pNewPIDCode: req.body.newPIDCode,
                            pIsCPN: req.body.isCPN || false,
                            pIsCustom: req.body.isCustom || false,
                            pUserID: req.user.id,
                            pUserRoleId: COMMON.getRequestUserLoginRoleID(req),
                            pIsAttribute: req.body.pIsAttribute || false,
                            pIsSettings: req.body.pIsSettings || false,
                            pIsAdditionalAttibute: req.body.pIsAdditionalAttibute || false,
                            pIsPackagingDetail: req.body.pIsPackagingDetail || false,
                            pIsStandards: req.body.pIsStandards || false,
                            pIsRequiredFunctionalType: req.body.pIsRequiredFunctionalType || false,
                            pIsRequiredMountingType: req.body.pIsRequiredMountingType || false,
                            pIsPackagingAliasPart: req.body.pIsPackagingAliasPart || false,
                            pIsOtherPartName: req.body.pIsOtherPartName || false,
                            pIsAlternatePart: req.body.pIsAlternatePart || false,
                            pIsRoHSReplacementPart: req.body.pIsRoHSReplacementPart || false,
                            pIsDriveTool: req.body.pIsDriveTool || false,
                            pIsProcessMaterial: req.body.pIsProcessMaterial || false,
                            pIsRequiredMattingParts: req.body.pIsRequiredMattingParts || false,
                            pIsPickupPad: req.body.pIsPickupPad || false,
                            pIsFunctionalTesingTool: req.body.pIsFunctionalTesingTool || false,
                            pIsFinctionalRestingEquipment: req.body.pIsFinctionalRestingEquipment || false,
                            pIsBOM: req.body.pIsBOM || false,
                            pIsComments: req.body.pIsComments || false,
                            pIsCopyImages: req.body.pIsCopyImages || false,
                            pIsCopyDatasheet: req.body.pIsCopyDatasheet || false,
                            pIsCopyDocument: req.body.pIsCopyDocument || false,
                            pIsOperationalAttirbutes: req.body.pIsOperationalAttirbutes || false,
                            pIsAcceptableShippinCountry: req.body.pIsAcceptableShippinCountry || false,
                            pIsTrackSNumber: req.body.pIsTrackSNumber || false,
                            pMfgPNDescription: req.body.mfgPNDescription || null,
                            pDetailDescription: req.body.detailDescription || null,
                            pInternalReference: req.body.internalReference || null,
                            pRoHSStatusID: req.body.RoHSStatusID,
                            pIsFluxNotApplicable: req.body.isFluxNotApplicable || false,
                            pIsWaterSoluble: req.body.isWaterSoluble || false,
                            pIsNoClean: req.body.isNoClean || false,
                            pSpecialNote: req.body.specialNote || null,
                            pRohsDeviation: req.body.rohsDeviation,
                            pFunctionalTypeID: req.body.functionalCategoryID,
                            pMountingTypeID: req.body.mountingTypeID,
                        },
                        transaction: t,
                        type: sequelize.QueryTypes.SELECT
                    }).then((response) => {
                        if (response[0] && response[0][0] && response[0][0].message) {
                            if (!t.finished) t.rollback();

                            if (response[0][0].message === DATA_CONSTANT.CREATE_DUPLICATE_PART_VALIDATIONS.NICKNAME_MISMATCH_VALIDATION
                                || response[0][0].message === DATA_CONSTANT.CREATE_DUPLICATE_PART_VALIDATIONS.DUPLICATE_NICKNAME) {
                                if (response[0][0].message === DATA_CONSTANT.CREATE_DUPLICATE_PART_VALIDATIONS.DUPLICATE_NICKNAME) {
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMPONENT_ASSEMBLY_NICKNAME_DUPLICATE_MESSAGE);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.newNickName, response[0][0].custAssyPN);
                                } else {
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMPONENT_ASSEMBLY_NICKNAME_SHOULD_BE_SAME_MESSAGE);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.newNickName, response[0][0].mfrName, req.body.newCustAssyPN);
                                }
                                const validationDet = {
                                    messageContent: messageContent,
                                    mfgDet: _.values(response[0])
                                };
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                    validationDet, null);
                            } else {
                                messageContent = MESSAGE_CONSTANT.PARTS.COMPONENT_REVEISION_DUPLICATE;
                                if (response[0][0].message === DATA_CONSTANT.CREATE_DUPLICATE_PART_VALIDATIONS.PART_NOT_FOUND) {
                                    messageContent = MESSAGE_CONSTANT.PARTS.FROM_PART_NOT_FOUND;
                                } else if (response[0][0].message === DATA_CONSTANT.CREATE_DUPLICATE_PART_VALIDATIONS.DUPLICATE_PID) {
                                    messageContent = MESSAGE_CONSTANT.PARTS.COMP_PIDCODE;
                                } else if (response[0][0].message === DATA_CONSTANT.CREATE_DUPLICATE_PART_VALIDATIONS.DUPLICATE_MFGPN) {
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMP_EXISTS);
                                    if (req.body.mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.COMPONENT.MFGPN, DATA_CONSTANT.MFGCODE.MFR);
                                    } else {
                                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.COMPONENT.SUPPLIERPN, DATA_CONSTANT.MFGCODE.SUPPLIER);
                                    }
                                } else if (response[0][0].message === DATA_CONSTANT.CREATE_DUPLICATE_PART_VALIDATIONS.PACKAGING_ALIAS_PART_VALIDATION_FAILED) {
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMPONENT_ALTERNATE_PART_MAPPING_PARAMETER_NOT_MATCH_MESSAGE);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, response[0][0].misMatchFields, DATA_CONSTANT.VALIDATION_TYPE.PACKAGING_PART.NAME);
                                } else if (response[0][0].message === DATA_CONSTANT.CHART_OF_ACCOUNTS_ERROR_TYPES.TYPE_NOT_EXISTS) {
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.SYSTEMTYPE_NOT_EXISTS);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, 'MPNSystemID/SPNSystemID');
                                } else if (response[0][0].message === DATA_CONSTANT.CREATE_DUPLICATE_PART_VALIDATIONS.PACKAGING_GROUP_TYPE_NOT_EXISTS) {
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.SYSTEMTYPE_NOT_EXISTS);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.PACKAGING_ALIAS.Name);
                                }
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: messageContent,
                                err: null,
                                data: null
                            });
                        } else {
                            const uploadPromises = [];
                            const newCreatedPartDetail = response.find((item) => item[0].documentPathOfFromPart)[0];
                            const oldPartDataSheetPath = `${DATA_CONSTANT.COMPONENT.DATASHEET_BASE_PATH}/${newCreatedPartDetail.documentPathOfFromPart}/${DATA_CONSTANT.COMPONENT.DATASHEET_FOLDER_NAME}`;
                            const oldPartGenericFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${newCreatedPartDetail.documentPathOfFromPart}`;
                            const oldPartImagePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${newCreatedPartDetail.documentPathOfFromPart}/${DATA_CONSTANT.COMPONENT.IMAGE_FOLDER_NAME}`;

                            const newPartImagePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${newCreatedPartDetail.documentPath}/${DATA_CONSTANT.COMPONENT.IMAGE_FOLDER_NAME}`;
                            const newPartDataSheetPath = `${DATA_CONSTANT.COMPONENT.DATASHEET_BASE_PATH}/${newCreatedPartDetail.documentPath}/${DATA_CONSTANT.COMPONENT.DATASHEET_FOLDER_NAME}`;
                            const newPartGenericFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${newCreatedPartDetail.documentPath}`;
                            const partId = newCreatedPartDetail.id;

                            if (req.body.pIsCopyImages) {
                                fs.mkdirSync(newPartImagePath, { recursive: true });
                                uploadPromises.push(module.exports.copyComponentImage(req, t, partId, oldPartImagePath, newPartImagePath).then(addRohsStatus => addRohsStatus));
                            }

                            if (req.body.pIsCopyDatasheet) {
                                fs.mkdirSync(newPartDataSheetPath, { recursive: true });
                                uploadPromises.push(module.exports.copyDataSheet(req, t, partId, oldPartDataSheetPath, newPartDataSheetPath).then(addRohsStatus => addRohsStatus));
                            }
                            if (req.body.pIsCopyDocument) {
                                fs.mkdirSync(newPartGenericFilePath, { recursive: true });
                                uploadPromises.push(module.exports.copyDocumentImage(req, t, partId, oldPartGenericFilePath, newPartGenericFilePath).then(addRohsStatus => addRohsStatus));

                            }
                            return Promise.all(uploadPromises).then((copyFileResponse) => {
                                const isAnyFailedOperation = copyFileResponse.some(x => x.State == STATE.FAILED);
                                if (isAnyFailedOperation) {
                                    if (!t.finished) t.rollback();

                                    // Remove                             
                                    if (req.body.pIsCopyImages || req.body.pIsCopyDocument) {
                                        const removeGenFolderArray = newPartGenericFilePath.split('/');
                                        removeGenFolderArray.pop();
                                        var removeGenFolderPath = removeGenFolderArray.join('/');
                                        fs.rmdirSync(removeGenFolderPath);
                                    }

                                    if (req.body.pIsCopyDatasheet) {
                                        const removeDataSheetFolderArray = newPartDataSheetPath.split('/');
                                        removeDataSheetFolderArray.pop();
                                        var removeDataSheetPath = removeDataSheetFolderArray.join('/');
                                        fs.rmdirSync(removeDataSheetPath);
                                    }

                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                } else {
                                    t.commit();
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), MESSAGE_CONSTANT.PARTS.COMPONENT_ASSEMBLY_REVISION_CREATED_MESSAGE);
                                }
                            });
                        }
                    }).catch((err) => {
                        if (!t.finished) t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    })
                }
            }).catch((err) => {
                if (!t.finished) {
                    t.rollback();
                }
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }).catch((err) => {
            if (!t.finished) t.rollback();
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // copy all Datasheet from part to To Part
    /// {newPartID} - New create part id
    /// {oldPartPath} - Old Part path
    /// {newPartPath} - New create part Document Path
    copyDataSheet: (req, t, newPartID, oldPartPath, newPartPath) => {
        const { ComponentDataSheets } = req.app.locals.models;
        return ComponentDataSheets.findAll({
            where: {
                refComponentID: newPartID
            },
            transaction: t
        }).then((componentDataSheetList) => {
            _.each(componentDataSheetList, (itemData) => {
                if (itemData.datasheetURL && !itemData.datasheetURL.startsWith('//') && !itemData.datasheetURL.startsWith('http://') && !itemData.datasheetURL.startsWith('https://')) {
                    const oldDocPath = `${oldPartPath}/${itemData.datasheetURL}`;
                    const newDocPath = `${newPartPath}/${itemData.datasheetURL}`;
                    if (fs.existsSync(oldDocPath)) {
                        fsextra.copySync(oldDocPath, newDocPath);
                    }
                }
            });
            return { State: STATE.SUCCESS };
        }).catch((err) => {
            return { State: STATE.FAILED, err: err };
        });
    },
    // copy all Image of from part to To Part
    /// {newPartID} - New create part id
    /// {oldPartPath} - Old Part path
    /// {newPartPath} - New create part Document Path
    copyComponentImage: (req, t, newPartID, oldPartPath, newPartPath) => {
        const { ComponentImages } = req.app.locals.models;
        return ComponentImages.findAll({
            where: {
                refComponentID: newPartID
            },
            transaction: t
        }).then((genericFilesOfPart) => {
            _.each(genericFilesOfPart, (itemData) => {
                if (itemData.imageURL && !itemData.imageURL.startsWith('//') && !itemData.imageURL.startsWith('http://') && !itemData.imageURL.startsWith('https://')) {
                    const docOldPath = `${oldPartPath}/${itemData.imageURL}`;
                    const docNewPath = `${newPartPath}/${itemData.imageURL}`;
                    if (fs.existsSync(docOldPath)) {
                        fsextra.copySync(docOldPath, docNewPath);
                    }
                }
            });
            return { State: STATE.SUCCESS };
        }).catch((err) => {
            return { State: STATE.FAILED, err: err };
        });
    },
    /// Copy all To Part document to To Part
    /// {newPartID} - New create part id
    /// {oldPartPath} - Old Part path
    /// {newPartPath} - New create part Document Path

    copyDocumentImage: (req, t, newPartID, oldPartPath, newPartPath) => {
        const { GenericFiles } = req.app.locals.models;
        return GenericFiles.findAll({
            where: {
                refTransID: newPartID,
                gencFileOwnerType: COMMON.AllEntityIDS.Component.Name,
                entityID: COMMON.AllEntityIDS.Component.ID
            },
            transaction: t
        }).then((genericFilesOfPart) => {
            let updateGenericFilePromise = [];
            _.each(genericFilesOfPart, (itemData) => {
                const docOldPath = `${oldPartPath}/${itemData.gencFileName}`;
                const newFileName = `${uuidv1()}.${itemData.gencFileExtension}`;
                const docNewPath = `${newPartPath}/${newFileName}`;
                if (fs.existsSync(docOldPath)) {
                    fsextra.copySync(docOldPath, docNewPath);
                }
                const actualGenFilePath = docNewPath.startsWith('.') ? docNewPath.replace('.', '') : null;
                const fileObj = {
                    gencFileName: newFileName,
                    genFilePath: actualGenFilePath
                };
                updateGenericFilePromise.push(GenericFiles.update(fileObj, {
                    where: {
                        gencFileID: itemData.dataValues.gencFileID
                    },
                    transaction: t,
                    attributes: ['gencFileName', 'genFilePath']
                }).then(() => {
                    return { State: STATE.SUCCESS };
                }).catch((docError) => {
                    console.trace();
                    console.error(docError);
                    return { State: STATE.FAILED, err: docError };
                }));
            });

            return Promise.all(updateGenericFilePromise).then((responses) => {
                const isAnyFailedOperation = responses.some(x => x.State == STATE.FAILED);
                if (isAnyFailedOperation) {
                    return { State: STATE.FAILED };
                } else {
                    return { State: STATE.SUCCESS };
                }
            });
        }).catch((err) => {
            return { State: STATE.FAILED, err: err };
        });
    },

    // Get assembly wise all parts in which programming is true
    // POST : /api/v1/component/getAssyWiseAllProgramingComponent
    getAssyWiseAllProgramingComponent: (req, res) => {
        if (req.body.partID) {
            const {
                sequelize
            } = req.app.locals.models;
            return sequelize
                .query('CALL Sproc_GetAssyWiseAllProgramingComp (:ppartID);', {
                    replacements: {
                        ppartID: req.body.partID
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // Get Component max temperature data
    // POST : /api/v1/component/getComponentMaxTemperatureData
    // @return List of Component Max Temperature Data
    getComponentMaxTemperatureData: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetComponentMaxTemperatureData(:pPartID)', {
            replacements: {
                pPartID: req.params.id || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get part Usage detail
    // GET : /api/v1/component/getPartUsageDetail
    // @param {id,fromdat,todate}
    // @return partusage detail
    getPartUsageDetail: (req, res) => {
        if (req.query.partID) {
            const {
                sequelize
            } = req.app.locals.models;
            return sequelize
                .query('CALL Sproc_getPartUsageReportDetail (:pPartIDs,:pChildDetail,:pfromDate,:ptoDate);', {
                    replacements: {
                        pPartIDs: req.query.partID,
                        pChildDetail: true,
                        pfromDate: req.query.fromDate,
                        ptoDate: req.query.toDate
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    partUsageDetail: _.values(response[0]),
                    AssyWiseUsageDetail: _.values(response[1]),
                    MonthWiseUsageDetail: _.values(response[2]),
                    partDetail: _.values(response[3])
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component CPN Alias for Autocomplete list
    // POST : /api/v1/component/getComponentCPNAliasSearch
    // @return List of Component CPN Parts
    getComponentCPNAliasSearch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetComponentCPNAliasSearch(:pGoodPart,:pSearch,:pMfgCodeId)', {
            replacements: {
                pGoodPart: req.body.listObj.isGoodPart || null,
                pSearch: req.body.listObj.query || null,
                pMfgCodeId: (req.body.listObj.mfgcodeID || req.body.listObj.mfgcodeID === 0) ? req.body.listObj.mfgcodeID : null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[0])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Get List of External External Functional and Mounting Type Text
    // POST : /api/v1/component/getExternalFunctionalAndMountingTypeValueList
    // @return List of External Functional and Mounting Type Text
    getExternalFunctionalAndMountingTypeValueList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetExternalFunctionalAndMountingTypeValueList(:pMfgType)', {
            replacements: {
                pMfgType: req.body.listObj.mfgType || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    externalFunctionalType: _.values(response[0]),
                    externalMountingType: _.values(response[1]),
                    externalRoHSStatus: _.values(response[2])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Update Component Attributes
    // PUT : /api/v1/component/updateComponentAttributes
    // @param {id} int
    // @return Upadted component attributes
    updateComponentAttributes: (req, res) => {
        const { Component, sequelize } = req.app.locals.models;
        if (req.body.updateComponentInfo) {
            const componentIds = Object.assign(req.body.updateComponentInfo.ids);
            COMMON.setModelUpdatedByObjectFieldValue(req.user, req.body.updateComponentInfo.data);
            return module.exports.getBOMActivityStartedForMultiplePartsWithPackaging(req, res).then((responseBOM) => {
                if (responseBOM.status === STATE.FAILED) {
                    if (responseBOM.assemblyList) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { err: null, data: { assemblyList: responseBOM.assemblyList } });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: responseBOM.message, err: responseBOM.error, data: null });
                    }
                } else {
                    return Component.findAll({
                        where: {
                            id: {
                                [Op.in]: componentIds
                            }
                        }
                    }).then((componentList) => {
                        var promises = [];
                        _.each(componentList, (compObj) => {
                            if (compObj.packaginggroupID != null && req.body.updateComponentInfo.data.mountingTypeID) {
                                promises.push(module.exports.mountingTypeForPackagingAliasPartsValidationPromise(req, res, compObj.id, req.body.updateComponentInfo.data.mountingTypeID, compObj.packaginggroupID, compObj.PIDCode));
                            }
                        });
                        return Promise.all(promises).then((response) => {
                            var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                            if (resObj) {
                                if (resObj.message) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: resObj.message,
                                        err: null,
                                        data: null
                                    });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                        err: null,
                                        data: null
                                    });
                                }
                            } else {
                                return sequelize.transaction().then((t) => {
                                    return Component.update(req.body.updateComponentInfo.data, {
                                        where: {
                                            [Op.or]: [{
                                                id: {
                                                    [Op.in]: componentIds
                                                }
                                            },
                                            {
                                                refSupplierMfgpnComponentID: {
                                                    [Op.in]: componentIds
                                                }
                                            }
                                            ],
                                            isDeleted: false
                                        },
                                        transaction: t
                                    }).then((component) => {
                                        const promises = [];
                                        COMMON.setModelUpdatedByFieldValue(req.body);
                                        _.each(componentList, (objPart) => {
                                            req.params.id = objPart.id;
                                            promises.push(module.exports.updateBOMMountingAndFunctionalTypeError(req, t));

                                            if (req.body.updateComponentInfo.data.connecterTypeID !== objPart.connecterTypeID
                                                || req.body.updateComponentInfo.data.noOfRows !== objPart.noOfRows) {
                                                req.body.programingRequired = objPart.programingRequired;
                                                req.body.matingPartRquired = objPart.matingPartRquired;
                                                req.body.driverToolRequired = objPart.driverToolRequired;
                                                req.body.functionalTestingRequired = objPart.functionalTestingRequired;
                                                req.body.pickupPadRequired = objPart.pickupPadRequired;
                                                req.body.partStatus = objPart.partStatus;
                                                req.body.uom = objPart.uom;
                                                req.body.isEpoxyMount = objPart.isEpoxyMount;
                                                req.body.connecterTypeID = req.body.updateComponentInfo.data.connecterTypeID !== undefined ?
                                                    req.body.updateComponentInfo.data.connecterTypeID : objPart.connecterTypeID;
                                                req.body.noOfRows = req.body.updateComponentInfo.data.noOfRows !== undefined ? req.body.updateComponentInfo.data.noOfRows
                                                    : objPart.noOfRows;
                                                promises.push(module.exports.updateBOMInternalVersionPackagingAliasPartsPromise(req, objPart, t));
                                            }
                                        });

                                        return Promise.all(promises).then((response) => {
                                            var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                                            if (!resObj) {
                                                t.commit().then(() => {
                                                    _.each(componentList, (objPart) => {
                                                        const data = {
                                                            bomPartID: objPart.id,
                                                            partDetailUpdate: true
                                                        };
                                                        req.params.id = objPart.id;
                                                        EnterpriseSearchController.managePartDetailInElastic(req);
                                                        RFQSocketController.sendPartUpdatedNotification(req, data);
                                                    });
                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, component, MESSAGE_CONSTANT.UPDATED(componentModuleName))
                                                });
                                            } else {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                    messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                                    err: resObj.err || resObj.error,
                                                    data: null
                                                });
                                            }
                                        }).catch((err) => {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                                err: null,
                                                data: null
                                            });
                                        });
                                    }).catch((err) => {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                            messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                            err: null,
                                            data: null
                                        });
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                err: null,
                                data: null
                            });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                            err: null,
                            data: null
                        });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                    err: null,
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
    // Create ComponentAcceptableShippingCountries
    // POST : /api/v1/createComponentAttributeMapping
    // @return New created ComponentAcceptableShippingCountries detail
    createComponentAcceptableShippingCountry: (req, res) => {
        const {
            ComponentAcceptableShippingCountries
        } = req.app.locals.models;
        ComponentAcceptableShippingCountries.findOne({
            where: {
                refComponentID: req.body.refComponentID,
                countryID: req.body.countryID,
                isDeleted: false
            }
        }).then((result) => {
            if (result) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.PARTS.COMPONENT_ACCEPTABLE_SHIPPING_COUNTRY_ALREADY_EXISTS,
                    err: null,
                    data: null
                });
            } else {
                COMMON.setModelCreatedByFieldValue(req);
                return ComponentAcceptableShippingCountries.create(req.body, {}).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(acceptableShippingCountryModuleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // delete Component Acceptable Shipping Country
    // POST : /api/v1/component/deleteComponentAcceptableShippingCountry
    // @return delete Component Acceptable Shipping Country
    deleteComponentAcceptableShippingCountry: (req, res) => {
        const {
            ComponentAcceptableShippingCountries
        } = req.app.locals.models;
        if (req.body.objData) {
            COMMON.setModelCreatedByFieldValue(req);
            const alias = req.body.objData;
            return ComponentAcceptableShippingCountries.update({
                isDeleted: true,
                deletedBy: COMMON.getRequestUserID(req),
                deletedAt: COMMON.getCurrentUTC(),
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            }, {
                    where: {
                        refComponentID: alias.refComponentID,
                        countryID: alias.countryID,
                        deletedAt: null
                    }
                }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.DELETED(acceptableShippingCountryModuleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // Retrive retrive Component Acceptable Shipping Country List
    // GET : /api/v1/rfqsetting/retriveComponentAcceptableShippingCountryList
    // @return Component Acceptable Shipping Country List
    retriveComponentAcceptableShippingCountryList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        sequelize.query('CALL Sproc_RetriveComponentAcceptableShippingCountryList(:pRefComponentID,:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                pRefComponentID: req.params.id,
                ppageIndex: req.query.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            acceptibleCoutries: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        })).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get Component Activity Start Time
    // POST : /api/v1/component/getComponentActivityStartTime
    // @return Get Component Activity Start Time
    getComponentActivityStartTime: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_getComponentActivityStartTime(:pPartID)', {
            replacements: {
                pPartID: req.body.listObj.pPartID || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get List of assembly for Autocomplete list
    // POST : /api/v1/component/getAllAssemblyBySearch
    // @return List of assembly
    getAllAssemblyBySearch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetAllAssemblyBySearch(:pSearch,:pId,:pIsActiveAssembliy)', {
            replacements: {
                pSearch: req.body.listObj.query || null,
                pId: req.body.listObj.id || null,
                pIsActiveAssembliy: (req.body.listObj.isActiveAssembly === null || req.body.listObj.isActiveAssembly === undefined) ? null : req.body.listObj.isActiveAssembly // purav [needs to be true ]
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[0])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get assyMfgPn filter list based on customerid and search string
    // @return list of assyMfgPn
    getAllAssyFilterList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.searchString) {
            let field = null;
            if (req.body.PIDCode) {
                field = 'PIDCode';
            } else if (req.body.mfgPN) {
                field = 'mfgPN';
            }
            return sequelize.query('CALL Sproc_GetAssemblyListByFieldName(:psearchString,:pfield)', {
                replacements: {
                    psearchString: req.body.searchString,
                    pfield: field
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, [], null);
        }
    },
    // get assyMfgPn list based on SO not created and search string
    // @return list of assyMfgPn
    getAllAssyListWitoutSOCreated: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.searchString) {
            let field = null;
            return sequelize.query('CALL Sproc_GetAssemblyListWithOutSOCreate(:psearchString)', {
                replacements: {
                    psearchString: req.body.searchString
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, [], null);
        }
    },
    // Update Part MPN and PID
    // Update Component
    // POST : /api/v1/component/updateMFGPPIDCodeOfComponent
    // @return Updated component details
    updateMFGPPIDCodeOfComponent: (req, res) => {
        const {
            Component, SalesOrderDet
        } = req.app.locals.models;
        if (req.body.componentId) {
            let field = null;
            if (req.body.isCPN) {
                promises.push(module.exports.cpnPartMFGValidationPromise(req, req.body.mfgcodeID));
            }
            var promises = [];
            return SalesOrderDet.findOne({
                where: {
                    partID: req.body.componentId,
                    isDeleted: false,
                    partCategory: DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID
                }
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.PARTS.RESTRICT_UPATE_PART_MPN_ON_SO_CREATED,
                        err: null,
                        data: null
                    });
                } else {
                    promises.push(module.exports.assemblyValidationPromise(req));
                    promises.push(module.exports.assemblyNicknameMatchWithPreviousRevisionValidationPromise(req));
                    promises.push(module.exports.assemblyNicknameShouldBeDifferentForSameCustomerValidationPromise(req));
                    promises.push(module.exports.checkDuplicateMfgPNPromise(req));
                    promises.push(module.exports.checkDuplicatePIDCodePromise(req));
                    return Promise.all(promises).then((response) => {
                        const nickNameValidation = _.find(response, resp => resp.isNickNameValidation === true);
                        if (nickNameValidation) {
                            const validationDet = {
                                messageContent: nickNameValidation.message,
                                mfgDet: nickNameValidation.data
                            };
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                validationDet, null);
                        }
                        var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                        if (resObj) {
                            if (resObj.message) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                    messageContent: resObj.message,
                                    err: null,
                                    data: null
                                });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                    messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                    err: null,
                                    data: null
                                });
                            }
                        } else {
                            const componentObj = {
                                mfgPN: req.body.mfgPN,
                                custAssyPN: req.body.custAssyPN,
                                PIDCode: req.body.PIDCode,
                                nickName: req.body.nickName,
                                assyCode: req.body.assyCode,
                                rev: req.body.rev,
                                updatedBy: COMMON.getRequestUserID(req),
                                updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                updatedAt: COMMON.getCurrentUTC()
                            };
                            return Component.update(componentObj, {
                                where: {
                                    id: req.body.componentId
                                },
                                attributes: ['mfgPN', 'custAssyPNA', 'PIDCode', 'nickName', 'assyCode', 'rev', 'updatedBy', 'updateByRoleId', 'updatedAt']
                            }).then((rowsUpdated) => {
                                if (rowsUpdated) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(componentModuleName));
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                                        err: null,
                                        data: null
                                    });
                                }

                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    error: err
                                };
                            });
                        }
                    }).catch((err) => {
                        if (!t.finished) {
                            t.rollback();
                        }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }
            }).catch((err) => {
                if (!t.finished) {
                    t.rollback();
                }
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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
    // Retrieve Component Approved Supplier not added list
    // POST : /api/v1/component/retrieveSupplierNotAddedList
    // @return Supplier Not AddedList
    retrieveSupplierNotAddedList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            return sequelize.query('CALL Sproc_RetrieveSupplierNotAddedList(:ppageIndex,:precordPerPage,:pPartID,:pSearch)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pPartID: req.body.partID,
                    pSearch: req.body.supplierSearch || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                NotAddedList: _.values(response[2]),
                Count: response[1][0]['TotalRecord'],
                TotalRecordWithNoExclude: response[0][0]['TotalRecordWithNoExclude']
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
    // Retrieve Component Approved Supplier  added list
    // POST : /api/v1/component/retrieveSupplierAddedList
    // @return Supplier AddedList
    retrieveSupplierAddedList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            return sequelize.query('CALL Sproc_RetrieveSupplierAddedList(:ppageIndex,:precordPerPage,:pPartID,:pSearch)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pPartID: req.body.partID,
                    pSearch: req.body.supplierSearch || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                AddedList: _.values(response[1]),
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
    // Retrieve Component Approved Supplier
    // POST : /api/v1/component/retriveComponentApprovedSupplier
    // @return component approved supplier
    retriveComponentApprovedSupplier: (req, res) => {
        const {
            ComponentApprovedSupplierMst,
            MfgCodeMst
        } = req.app.locals.models;
        if (req.body.partID) {
            return ComponentApprovedSupplierMst.findAll({
                where: {
                    partID: req.body.partID
                },
                attribute: ['id', 'partID', 'supplierID', 'priority'],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodeMst',
                    attributes: ['id', 'mfgCode', 'mfgName'],
                    required: true
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
    // Check duplicate supplier for approved supplier
    // POST : /api/v1/component/checkComponentApprovedSupplierUnique
    // @return duplicate supplier
    checkComponentApprovedSupplierUnique: (req, res, isFromApi) => {
        const {
            ComponentApprovedSupplierMst,
            Component,
            MfgCodeMst
        } = req.app.locals.models;
        if (req.body) {
            const isFromApiCheck = isFromApi === true ? true : false;
            let whereClause;
            let include;
            if (req.body.isFromSupplier) {
                whereClause = {
                    supplierID: req.body.supplierID,
                    partID: {
                        [Op.in]: req.body.partIDs
                    }
                };
                include = [{
                    model: Component,
                    as: 'component',
                    attributes: ['id', 'PIDCode', 'mfgPN'],
                    required: true
                }];
            } else {
                whereClause = {
                    partID: req.body.partID,
                    supplierID: {
                        [Op.in]: req.body.supplierIDs
                    }
                };
                include = [{
                    model: MfgCodeMst,
                    as: 'mfgCodeMst',
                    attributes: ['id', 'mfgCode', 'mfgName'],
                    required: true
                }];
            }
            return ComponentApprovedSupplierMst.findAll({
                where: whereClause,
                attribtues: ['supplierID'],
                include: include
            }).then((response) => {
                if (isFromApiCheck) {
                    return Promise.resolve(response);
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
    // Save Component Approved Supplier
    // POST : /api/v1/component/saveComponentApprovedSupplier
    saveComponentApprovedSupplier: (req, res) => {
        const {
            ComponentApprovedSupplierMst,
            ComponentApprovedSupplierPriorityDetail,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return module.exports.checkComponentApprovedSupplierUnique(req, res, true).then((validate) => {
                if (validate && validate.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: validate
                    });
                } else {
                    let whereClause;
                    let moduleName = DATA_CONSTANT.COMPONENT_DISAPPROVED_SUPPLIER.Name;
                    if (req.body.isFromSupplier) {
                        whereClause = {
                            supplierID: req.body.supplierID
                        };
                        moduleName = DATA_CONSTANT.SUPPLIER_DISAPPROVED_PART.Name;
                    } else {
                        whereClause = {
                            partID: req.body.partID
                        };
                        moduleName = DATA_CONSTANT.COMPONENT_DISAPPROVED_SUPPLIER.Name;
                    }
                    return sequelize.transaction().then(t => ComponentApprovedSupplierMst.findOne({
                        where: whereClause,
                        attributes: [
                            [sequelize.fn('MAX', sequelize.col('priority')), 'maxPriority']
                        ]
                    }).then((result) => {
                        let lastPriority = result.dataValues && result.dataValues.maxPriority ? result.dataValues.maxPriority : 1;
                        const disapprovedSuppliers = [];
                        if (req.body.isFromSupplier) {
                            _.each(req.body.partIDs, (item) => {
                                const supplier = {
                                    supplierID: req.body.supplierID,
                                    partID: item,
                                    priority: lastPriority,
                                    status: DATA_CONSTANT.COMPONENT_DISAPPROVED_SUPPLIER.STATUS.DISAPPROVED
                                };
                                COMMON.setModelCreatedByFieldValue(supplier);
                                disapprovedSuppliers.push(supplier);
                                lastPriority++;
                            });
                        } else {
                            _.each(req.body.supplierIDs, (item) => {
                                const supplier = {
                                    partID: req.body.partID,
                                    supplierID: item,
                                    priority: lastPriority,
                                    status: DATA_CONSTANT.COMPONENT_DISAPPROVED_SUPPLIER.STATUS.DISAPPROVED
                                };
                                COMMON.setModelCreatedByFieldValue(supplier);
                                disapprovedSuppliers.push(supplier);
                                lastPriority++;
                            });
                        }
                        return ComponentApprovedSupplierMst.bulkCreate(disapprovedSuppliers, {
                            inputFields: componentApprovedSupplierInputFields
                        }).then((response) => {
                            if (req.body.isFromSupplier) {
                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName)));
                            } else {
                                const deleteObj = {};
                                COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObj);
                                return ComponentApprovedSupplierPriorityDetail.update(deleteObj, {
                                    where: {
                                        supplierID: {
                                            [Op.in]: req.body.supplierIDs
                                        }
                                    }
                                }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName)))).catch((err) => {
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
                        });
                    }).catch((err) => {
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
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Save Component Approved Supplier Priority
    // POST : /api/v1/component/saveComponentApprovedSupplierPriority
    saveComponentApprovedSupplierPriority: (req, res) => {
        const {
            ComponentApprovedSupplierPriorityDetail,
            sequelize
        } = req.app.locals.models;
        if (req.body.suppliers) {
            return sequelize.transaction().then((t) => {
                const priorityPromise = [];
                let create = _.filter(req.body.suppliers, item => !item.id);
                const update = _.filter(req.body.suppliers, item => item.id);
                if (create.length > 0) {
                    priorityPromise.push(ComponentApprovedSupplierPriorityDetail.findAll({
                        where: {
                            partID: {
                                [Op.in]: _.map(create, 'partID')
                            },
                            supplierID: {
                                [Op.in]: _.map(create, 'supplierID')
                            }
                        }
                    }).then((response) => {
                        if (response && response.length > 0) {
                            const updatePromise = [];
                            _.each(response, (item) => {
                                const updateObject = {
                                    partID: item.partID,
                                    supplierID: item.supplierID,
                                    priority: _.find(create, priority => item.partID === parseInt(priority.partID) && item.supplierID === parseInt(priority.supplierID)).priority
                                };
                                create = _.reject(create, o => parseInt(o.partID) === item.partID && parseInt(o.supplierID) === item.supplierID);
                                COMMON.setModelUpdatedByObjectFieldValue(req.user, updateObject);
                                updatePromise.push(ComponentApprovedSupplierPriorityDetail.update(updateObject, {
                                    where: {
                                        id: item.id
                                    },
                                    fields: componentApprovedSupplierInputFields,
                                    transaction: t
                                }).then(() => STATE.SUCCESS).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                            });
                            return Promise.all(updatePromise).then((resp) => {
                                const resultSet = _.filter(resp, item => item === STATE.FAILED);
                                if (resultSet.length > 0) {
                                    return STATE.FAILED;
                                } else if (create.length > 0) {
                                    COMMON.setModelCreatedArrayFieldValue(req.user, create);
                                    return ComponentApprovedSupplierPriorityDetail.bulkCreate(create, {
                                        fields: componentApprovedSupplierInputFields,
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
                            });
                        } else {
                            COMMON.setModelCreatedArrayFieldValue(req.user, create);
                            return ComponentApprovedSupplierPriorityDetail.bulkCreate(create, {
                                fields: componentApprovedSupplierInputFields,
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                }
                if (update.length > 0) {
                    _.each(update, (item) => {
                        COMMON.setModelUpdatedByObjectFieldValue(req.user, item);
                        priorityPromise.push(ComponentApprovedSupplierPriorityDetail.update(item, {
                            where: {
                                id: item.id
                            },
                            fields: componentApprovedSupplierInputFields,
                            transaction: t
                        }).then(() => STATE.SUCCESS).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        }));
                    });
                }
                return Promise.all(priorityPromise).then((resp) => {
                    const resultSet = _.filter(resp, item => item === STATE.FAILED);
                    if (resultSet && resultSet.length > 0) {
                        if (t && !t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
                        });
                    } else {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(ApprovedSuppliermoduleName)));
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
    // Delete Component Approved Supplier
    // POST : /api/v1/component/deleteComponentApprovedSupplier
    deleteComponentApprovedSupplier: (req, res) => {
        const {
            ComponentApprovedSupplierMst,
            sequelize
        } = req.app.locals.models;
        if (req.body.IDs && req.body.IDs.length > 0) {
            let moduleName;
            if (req.body.isFromSupplier) {
                moduleName = DATA_CONSTANT.SUPPLIER_DISAPPROVED_PART.Name;
            } else {
                moduleName = DATA_CONSTANT.COMPONENT_DISAPPROVED_SUPPLIER.Name;
            }
            return sequelize.transaction().then((t) => {
                const deleteObj = {};
                COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObj);
                return ComponentApprovedSupplierMst.update(deleteObj, {
                    where: {
                        id: {
                            [Op.in]: req.body.IDs
                        }
                    }
                }).then(response => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName)))).catch((err) => {
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
    // POST : /api/v1/component/getAllNickNameFilterList
    // return all assy nickname list
    getAllNickNameFilterList: (req, res) => {
        const {
            Component,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const whereClause = {
                category: 3
            };
            if (req.body.searchString) {
                whereClause.nickname = {
                    [Op.like]: `%${req.body.searchString}%`
                };
            }
            return Component.findAll({
                where: whereClause,
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('nickName')), 'nickname']
                ]
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
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
    // Upload Component Data sheets
    // POST : /api/v1/component/uploadComponentDataSheets
    // @return New created component Data sheet
    uploadComponentDataSheets: (req, res) => {
        const {
            Component,
            ComponentDataSheets,
            sequelize
        } = req.app.locals.models;
        var filePromises = [];
        let genFilePath;
        if (req.body) {
            return sequelize.query('CALL Sproc_getRefTransDetailForDocument (:pGencFileOwnerType, :pRefTransID,:pIsReturnDetail)', {
                replacements: {
                    pGencFileOwnerType: COMMON.AllEntityIDS.Component.Name,
                    pRefTransID: req.body.refComponentID || null,
                    pIsReturnDetail: true
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                genFilePath = `${DATA_CONSTANT.COMPONENT.DATASHEET_BASE_PATH}/`;
                const documentCreatedDateInfo = _.first(_.values(response[0]));

                genFilePath = `${genFilePath}${documentCreatedDateInfo.newDocumentPath}/${DATA_CONSTANT.COMPONENT.DATASHEET_FOLDER_NAME}`;
                if (!fs.existsSync(genFilePath)) {
                    fs.mkdirSync(genFilePath, { recursive: true });
                }

                COMMON.setModelCreatedByFieldValue(req);
                filePromises = [];
                _.each(req.files.files, (fileItem) => {
                    var file = fileItem.file;
                    var fileName = file.originalFilename;
                    var path = `${genFilePath}/${fileName}`;
                    fileItem.file.fileName = fileName;

                    filePromises.push(fsextra.move(file.path, path)
                        .then(() => STATE.SUCCESS)
                        .catch(() => STATE.FAILED));
                });
                return Promise.all(filePromises).then(() => {
                    var promises = [];
                    return sequelize.transaction().then((t) => {
                        var componentObj = {
                            dataSheetLink: req.files.files[0].file.fileName,
                            updatedBy: COMMON.getRequestUserID(req),
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                            updatedAt: COMMON.getCurrentUTC()
                        };
                        promises.push(
                            Component.findOne({
                                where: {
                                    id: req.body.refComponentID
                                },
                                transaction: t
                            }).then((comp) => {
                                if (comp) {
                                    if (comp.dataSheetLink) {
                                        return {
                                            status: STATE.SUCCESS
                                        };
                                    } else {
                                        return Component.update(componentObj, {
                                            where: {
                                                id: req.body.refComponentID
                                            },
                                            transaction: t,
                                            attributes: ['dataSheetLink', 'updatedBy']
                                        }).then(() => ({
                                            status: STATE.SUCCESS
                                        })).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return {
                                                status: STATE.FAILED,
                                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                error: err
                                            };
                                        });
                                    }
                                } else {
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                                    };
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    error: err
                                };
                            })
                        );
                        _.each(req.files.files, (item) => {
                            req.body.dataSheetLink = item.file.fileName;
                            req.body.datasheetURL = item.file.fileName;
                            req.body.datasheetName = item.file.originalFilename;
                            req.body.isDeleted = false;

                            promises.push(
                                ComponentDataSheets.create(req.body, {
                                    fields: inputFieldsDataSheetUrl,
                                    transaction: t
                                }).then(() => ({
                                    status: STATE.SUCCESS
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        error: err
                                    };
                                })
                            );
                        });

                        return Promise.all(promises).then((resp) => {
                            var repObj = _.find(resp, item => item.status === STATE.FAILED);

                            if (!repObj) {
                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null));
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                    messageContent: MESSAGE_CONSTANT.NOT_CREATED(componentModuleName),
                                    err: null,
                                    data: null
                                });
                            }
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    // Get List of Component MFG Alias for Autocomplete list
    // POST : /api/v1/component/etComponentMFGAliasSearchPurchaseOrder
    // @return List of Component manufactures Parts
    getComponentMFGAliasSearchPurchaseOrder: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetComponentMFGAliasSearchPurchaseOrder(:pGoodPart,:pSearch,:pId,:pMfgType,:pRoHSStatusID,:pMfgCodeId,:pMountingType,:pMountingTypeId,:pCategoryID,:pIsContainCPN,:pRohsMainCategoryID,:pIsRohsMainCategoryInvertMatch,:prefSupplierMfgpnComponentID,:ppackagingID,:pstrictCustomPart,:psupplierID,:pPartType,:pExcludeStatus)', {
            replacements: {
                pGoodPart: req.body.listObj.isGoodPart || null,
                pSearch: req.body.listObj.query || null,
                pId: req.body.listObj.id ? req.body.listObj.id : null,
                pMfgType: req.body.listObj.mfgType || null,
                pRoHSStatusID: req.body.listObj.RoHSStatusID ? req.body.listObj.RoHSStatusID : null,
                pMfgCodeId: (req.body.listObj.mfgcodeID || req.body.listObj.mfgcodeID === 0) ? req.body.listObj.mfgcodeID : null,
                pMountingType: req.body.listObj.mountingType || null,
                pMountingTypeId: req.body.listObj.mountingTypeID || null,
                pCategoryID: req.body.listObj.categoryID || null,
                pIsContainCPN: req.body.listObj.isContainCPN || null,
                pRohsMainCategoryID: req.body.listObj.rohsMainCategoryID || null,
                pIsRohsMainCategoryInvertMatch: req.body.listObj.isRohsMainCategoryInvertMatch || false,
                prefSupplierMfgpnComponentID: req.body.listObj.refSupplierMfgpnComponentID || null,
                ppackagingID: req.body.listObj.packagingID || null,
                pstrictCustomPart: req.body.listObj.strictCustomPart || null,
                psupplierID: req.body.listObj.supplierID || false,
                pPartType: req.body.listObj.partType || null,
                pExcludeStatus: req.body.listObj.exculdePartStatus || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[0])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    /* export sample template for manufacturer/supplier */
    // eslint-disable-next-line consistent-return
    exportSampleFilterTemplate: (req, res) => {
        try {
            if (!req.body.mfgType) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                });
            }

            const mfgTypeName = `${req.body.mfgType}.xlsx`;
            const path = DATA_CONSTANT.COMPONENT.DOWNLOAD_FILTER_TEMPLATE_PATH + mfgTypeName;

            // eslint-disable-next-line consistent-return
            fs.readFile(path, (err) => {
                if (err) {
                    if (err.code === COMMON.FileErrorMessage.NotFound) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.DownloadFileErrorMsg_NotFound,
                            err: null,
                            data: null
                        });
                    } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                    }
                } else {
                    const file = path;
                    res.setHeader('Content-disposition', `attachment; filename=${mfgTypeName}`);
                    res.setHeader('Content-type', 'application/vnd.ms-excel');
                    const filestream = fs.createReadStream(file);
                    filestream.pipe(res);
                }
            });
        } catch (ex) {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: ex,
                data: null
            });
        }
    },
    // Get Component By Id
    // GET : /api/v1/component/retrieveComponent
    // @param {id} int
    // @return Component
    retrieveComponentHeaderCountDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize
                .query('CALL Sproc_ComponentHeaderCount(:pPartID,:pAccessLevel,:pEntityId)', {
                    replacements: {
                        pPartID: req.body.partId ? req.body.partId : 0,
                        pAccessLevel: req.body.accessLevel,
                        pEntityId: req.body.entityId
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    if (response) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null);
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
    // Get List of Progressive Filters
    // POST : /api/v1/component/getProgressiveFilters
    // @return List of Progressive Filters
    getProgressiveFilters: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetComponentProgressiveFilters(:pMfgType,:pIsCodeFirst,:pExcludeSupplier)', {
            replacements: {
                pMfgType: req.body.mfgType,
                pIsCodeFirst: req.body.isCodeFirst,
                pExcludeSupplier: req.body.excludeSupplier,
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                if (req.body.excludeSupplier) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        manufactureList: _.values(response[0]),
                        partStatusList: _.values(response[1]),
                        packagingList: _.values(response[2]),
                        functionalList: _.values(response[3]),
                        externalFunctionList: _.values(response[4]),
                        externalMountingList: _.values(response[5]),
                        externalROHSList: _.values(response[6]),
                        packageCaseShapeTypeList: _.values(response[7]),
                        mountingTypeList: _.values(response[8]),
                        rohsTypeList: _.values(response[9]),
                        partTypeList: _.values(response[10]),
                    }, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    manufactureList: _.values(response[0]),
                    supplierList: _.values(response[1]),
                    partStatusList: _.values(response[2]),
                    packagingList: _.values(response[3]),
                    functionalList: _.values(response[4]),
                    externalFunctionList: _.values(response[5]),
                    externalMountingList: _.values(response[6]),
                    externalROHSList: _.values(response[7]),
                    packageCaseShapeTypeList: _.values(response[8]),
                    mountingTypeList: _.values(response[9]),
                    rohsTypeList: _.values(response[10]),
                    partTypeList: _.values(response[11]),
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Get List of None Progressive Filters
    // POST : /api/v1/component/getNoneProgressiveFilters
    // @return List of None Progressive Filters
    getNoneProgressiveFilters: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetComponentNoneProgressiveFilters(:pMfgType,:pIsCodeFirst,:pDisApprovedMFG)', {
            replacements: {
                pMfgType: req.body.mfgType,
                pIsCodeFirst: req.body.isCodeFirst,
                pDisApprovedMFG: 'DIST'
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    assemblyTypeList: _.values(response[0]),
                    acceptableShippingCountryList: _.values(response[1]),
                    operationalAttributeList: _.values(response[2]),
                    standardsList: _.values(response[3]),
                    disApprovedList: _.values(response[4])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get List of comments
    // POST : /api/v1/component/getCommentsSize/:id
    // @return List of comments by part id
    getCommentsSize: (req, res) => {
        const {
            Component,
            ComponenetInspectionRequirementDet
        } = req.app.locals.models;

        return Component.findOne({
            where: {
                id: req.params.id,
                isDeleted: false
            },
            attributes: ['id', 'refSupplierMfgpnComponentID']
        }).then((response) => {
            if (response) {
                return ComponenetInspectionRequirementDet.findAll({
                    where: {
                        partId: response.refSupplierMfgpnComponentID || response.id,
                        isDeleted: false,
                        category: {
                            [Op.in]: ['P', 'M', 'S']
                        }
                    },
                    attributes: ['id', 'partId', 'category']
                }).then((response) => {
                    if (response) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                            err: null,
                            data: null
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get List of Component Part Status
    // POST: /api/v1/component/getComponentPartStatus
    // @param {id} int
    // @return List of Component
    getComponentPartStatus: (req, res) => {
        const {
            Component
        } = req.app.locals.models;
        Component.findAll({
            where: {
                id: req.body.id
            },
            attributes: ['id', 'partStatus', 'mfgPN', 'PIDCode']
        }).then(component => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, component, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get List of Component MFG / PIDCode Alias for Autocomplete list
    // POST : /api/v1/component/getComponentMFGPIDCodeAliasSearch
    // @return List of Component manufactures Parts
    getComponentMFGPIDCodeAliasSearch: (req, res) => {
        const { sequelize } = req.app.locals.models;
        // if (req.body.listObj) {
        //     req.body.listObj.strictCustomPart = (req.body.listObj.strictCustomPart === false || req.body.listObj.strictCustomPart) ? req.body.listObj.strictCustomPart : null;
        // }
        sequelize.query('CALL Sproc_GetComponentByMFGPN_PIDAliasSearch(:pSearch,:pMfgType)', {
            replacements: {
                pSearch: req.body.listObj.query || null,
                pMfgType: req.body.listObj.mfgType || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { data: _.values(response[0]) }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName), err: null, data: null });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get List of Component Scrapped Qty Against Kit/UMID
    // POST : /api/v1/component/getComponentKitScrappedQty
    // @return List of Component manufactures Parts
    getComponentKitScrappedQty: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.partId) {
            sequelize.query('CALL Sproc_GetComponentKitScrappedQty(:pPartID)', {
                replacements: {
                    pPartID: req.body.partId
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { partKitList: _.values(response[0]) }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(componentModuleName), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // Get Oddely Ref Des list
    // GET : /api/v1/component/getOddelyRefDesList
    // @param {id} int
    // @return List of Oddely Ref Des
    getOddelyRefDesList: (req, res) => {
        const { ComponentOddelyREFDES } = req.app.locals.models;

        if (req.params.id) {
            return ComponentOddelyREFDES.findAll({
                where: {
                    refComponentID: req.params.id
                },
                attributes: ['id', 'refDes', 'refComponentID']
            }).then(resOddRefDes => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resOddRefDes, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // to be called in promise from API only
    getBOMActivityStartedForMultiplePartsWithPackaging: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.updateComponentInfo.ids) {
            const componentIDs = req.body.updateComponentInfo.ids.join();
            return sequelize.query('CALL Sproc_getActivityStartedAssemblyForMultiplePartsWithPackaging(:pPartIDs,:pAssyID)', {
                replacements: {
                    pPartIDs: componentIDs,
                    pAssyID: req.body.updateComponentInfo.AssyID || null
                }
            }).then((component) => {
                if (component.length === 0) {
                    return {
                        status: STATE.SUCCESS
                    };
                } else {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.NOT_UPDATED(componentModuleName),
                        assemblyList: _.values(component)
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    error: err
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },
    // Save Oddly named ref des
    // POST : /api/v1/component/saveOddlyNamedRefDes
    // @return New Save Oddly named refdes
    saveOddlyNamedRefDes: (req, res) => {
        const { ComponentOddelyREFDES, sequelize } = req.app.locals.models;
        if (req.body.componentObj) {
            const delrefdesPromise = [];
            return sequelize.transaction().then((t) => {
                if (req.body.componentObj.removeOddelyRefDesIds.length > 0) {
                    delrefdesPromise.push(ComponentOddelyREFDES.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                        where: {
                            refComponentID: req.body.componentObj.id,
                            id: req.body.componentObj.removeOddelyRefDesIds
                        },
                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                        transaction: t
                    }));
                }
                return Promise.all(delrefdesPromise).then((resp) => {
                    const newRefDes = [];
                    const updateRefDes = [];
                    const refdesPromise = [];
                    _.each(req.body.componentObj.oddelyRefDesList, (objRefdes) => {
                        if (objRefdes.id) {
                            updateRefDes.push(objRefdes);
                        } else {
                            newRefDes.push(objRefdes);
                        }
                    });
                    COMMON.setModelCreatedArrayFieldValue(req.user, newRefDes);
                    refdesPromise.push(ComponentOddelyREFDES.bulkCreate(newRefDes, {
                        fields: inputFieldsOddelyRefDes,
                        transaction: t
                    }));
                    if (updateRefDes.length > 0) {
                        COMMON.setModelUpdatedByArrayFieldValue(req.user, updateRefDes);
                        _.each(updateRefDes, (q) => {
                            refdesPromise.push(
                                ComponentOddelyREFDES.findOne({
                                    where: {
                                        id: q.id
                                    },
                                    fields: ['id', 'refDes']
                                }).then((res) => {
                                    if (res) {
                                        return ComponentOddelyREFDES.update(q, {
                                            fields: inputFieldsOddelyRefDes,
                                            where: { id: q.id },
                                            transaction: t
                                        })
                                    } else {
                                        return {
                                            status: STATE.SUCCESS
                                        };
                                    }
                                })
                            );
                        });
                    }
                    return Promise.all(refdesPromise).then((resp) => {
                        var objresp = _.find(resp, r => r.status === STATE.FAILED);
                        if (objresp) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: objresp.err, data: null });
                        } else {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(componentOddlyNamedRefDesModuleName));
                        }
                    }).catch((err) => {
                        if (!t.finished) {
                            t.rollback();
                        }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });

                }).catch((err) => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Save part search pattern followed by User
    // To be called from API Only
    // @return nothing to return as we are not going to check its response
    // this we have to follow because we are logging for our analysis, due to any error on this API user work should not affect
    savePartListSearchPatternFollowedByUser: (req, res) => {
        if (req.body) {
            try {
                var mongodb = global.mongodb;
                const apiVerification = Object.assign({}, req.body);
                const ObjectID = Bson.ObjectID;
                apiVerification._id = new ObjectID();
                apiVerification.createdBy = COMMON.getRequestUserID(req);
                apiVerification.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                apiVerification.createdAt = COMMON.getCurrentUTC();
                mongodb.collection('partListSearchPattern').insertOne(apiVerification)
                    .then(() => { })
                    .catch((err) => {
                        console.trace();
                        console.error(err);
                    });
            }
            catch (e) {
                console.trace();
                console.error(e);
            }
        }
    },
    // Import Component Detail
    // POST : /api/v1/component/saveOddlyNamedRefDes
    // @return Import Component Detail
    importComponentDetail: (req, res) => {
        const { sequelize, Component, Settings } = req.app.locals.models;
        if (req.body) {
            return Settings.findOne({
                where: {
                    key: DATA_CONSTANT.PricingServiceStatus
                },
                attributes: ['id', 'values']
            }).then((settingsExt) => {
                if (settingsExt && settingsExt.values === DATA_CONSTANT.Pricing_Start_Status) {
                    const partDetailObj = req.body;
                    partDetailObj.partID = -1000;
                    if (partDetailObj.partID) {
                        if (partDetailObj.isAppend) {
                            return mongodb.collection('MpnMappDet').find().toArray((err, result) => {
                                if (err) {
                                    console.trace();
                                    console.error(err);
                                }
                                if (Array.isArray(result) && result.length > 0) {
                                    result.forEach((det) => {
                                        _.remove(partDetailObj.mfgPnImportedDetail, (a) =>
                                            (a.mfgPN && det.importMfgPN && a.mfgPN.toUpperCase() === det.importMfgPN.toUpperCase())
                                            && (a.mfgCode && det.importMfrName && a.mfgCode.toUpperCase() === det.importMfrName.toUpperCase()));
                                    });
                                }
                                return module.exports.verifyAndImportPart(partDetailObj, req, res);
                            });
                        } else {
                            const query = {
                                transactionID: partDetailObj.transactionID,
                                isVerified: false,
                                userID: req.user.id
                            };
                            return mongodb.collection('MpnMappDet').find(query).toArray((err, result) => {
                                return module.exports.removeMpnMapped(req, query).then(() => {
                                    if (err) {
                                        console.trace();
                                        console.error(err);
                                    }
                                    if (Array.isArray(result) && result.length > 0) {
                                        result.forEach((det) => {
                                            const importObj = {
                                                mfgPN: det.importMfgPN,
                                                mfgCode: det.importMfrName
                                            }
                                            partDetailObj.mfgPnImportedDetail.push(importObj);
                                        });
                                    }
                                    return module.exports.verifyAndImportPart(partDetailObj, req, res);
                                });
                            });
                        }
                    } else {
                        return resHandler.errorRes(res, 200, STATE.FAILED, null);
                    }
                } else {
                    return resHandler.errorRes(res,
                        200,
                        STATE.FAILED,
                        MESSAGE_CONSTANT.BOM.PricingStatus);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });;
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    verifyAndImportPart(partDetailObj, req, res) {
        const myquery = { partID: partDetailObj.partID, transactionID: partDetailObj.transactionID };
        const partNumber = _.uniqBy(partDetailObj.mfgPnImportedDetail, 'mfgPN');
        const mfrNumber = _.uniqBy(partDetailObj.mfgPnImportedDetail, 'mfgCode');
        var partList = _.map(partNumber, 'mfgPN');
        var mfrList = _.map(mfrNumber, 'mfgCode');
        const mfgPromises = [];
        if (partList.length > 0) {
            mfgPromises.push(module.exports.findMPNlistByNamelist(req, partList));
        }
        if (mfrList.length > 0) {
            mfgPromises.push(PricingController.findMFRlistByNamelist(req, mfrList, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG));
        }

        return Promise.all(mfgPromises).then((response) => {
            const partNumberList = Array.isArray(response[0]) && response[0].length > 0 ? response[0] : [];
            let mfrResList = [];
            if (mfrList) {
                mfrResList = response[1];
            }
            const addCompnentPormise = [];
            const componentList = [];
            const mfgTypeName = DATA_CONSTANT.MFGCODE.NAME;
            const mfrNotFoundErrorType = DATA_CONSTANT.COMPONENT_ERROR_TYPE.MFGNOTADDED;
            const NotFoundErroMsg = DATA_CONSTANT.COMPONENT_AIP_ERROR_MESSAGE.NOT_ADDED;
            const errorSource = 'BOM';
            partDetailObj.mfgPnImportedDetail.forEach((partDet) => {
                const mpnDetList = partNumberList.filter(a => a && a.mfgPN === partDet.mfgPN ||
                    (a.refSupplierMfgComponent && a.mfgPN !== partDet.mfgPN && a.refSupplierMfgComponent.mfgPN === partDet.mfgPN));
                const component = {
                    importMfgPN: partDet.mfgPN,
                    importMfrName: partDet.mfgCode,
                    transactionID: partDetailObj.transactionID,
                    isVerified: false,
                    userID: req.user.id,
                    userName: req.user.username
                };
                if (Array.isArray(mpnDetList) && mpnDetList.length > 0 && partDet.mfgPN) {
                    mpnDetList.forEach((mpnDet) => {
                        component.mfrName = mpnDet.refSupplierMfgComponent ? mpnDet.refSupplierMfgComponent.mfgCodemst.mfgName : mpnDet.mfgCodemst.mfgName;
                        component.mfgcodeId = mpnDet.refSupplierMfgComponent ? mpnDet.refSupplierMfgComponent.mfgcodeId : mpnDet.mfgCodemst.id;
                        component.componentId = mpnDet.refSupplierMfgComponent ? mpnDet.refSupplierMfgComponent.id : mpnDet.id;
                        component.mfgPN = mpnDet.refSupplierMfgComponent ? mpnDet.refSupplierMfgComponent.mfgPN : mpnDet.mfgPN;
                        component.supplierName = mpnDet.refSupplierMfgComponent ? mpnDet.mfgCodemst.mfgName : '';
                        component.supplierId = mpnDet.refSupplierMfgComponent ? mpnDet.mfgCodemst.id : '';
                        component.spn = mpnDet.refSupplierMfgComponent ? mpnDet.mfgPN : '';
                        component.refSupplierMfgpnComponentID = mpnDet.refSupplierMfgpnComponentID;
                        component.mfgType = mpnDet.mfgType;
                        component.createdBy = mpnDet.dataValues.employeeName;
                        component.createdAt = mpnDet.createdAt;
                        component.isVerified = true;

                        const copyComponentDet = Object.assign({}, component);
                        addCompnentPormise.push(module.exports.saveMongoMPN(copyComponentDet));
                    });
                } else {
                    if (Array.isArray(mfrResList) && mfrResList.length > 0 && partDet.mfgCode) {
                        const mfrDet = mfrResList.find(a => a && a.alias.toUpperCase() === partDet.mfgCode.toUpperCase());
                        component.mfrName = mfrDet ? mfrDet.alias : '';
                        component.mfgcodeId = mfrDet ? parseInt(mfrDet.mfgcodeId) : null;
                        component.mfgType = mfrDet ? mfrDet.mfgType : '';
                    } else if (partDet.mfgCode) {
                        const errorMsg = stringFormat(NotFoundErroMsg, partDet.mfgCode, mfgTypeName);
                        const bomStatus = {
                            partID: partDetailObj.partID,
                            partNumber: partDet.mfgPN,
                            errorMsg: errorMsg,
                            errorType: mfrNotFoundErrorType,
                            MFGCode: null,
                            Type: DATA_CONSTANT.MFG_TYPE.MFG,
                            DataField: partDet.mfgCode,
                            bomMFG: partDet.mfgCode,
                            Source: errorSource,
                            transactionID: partDetailObj.transactionID
                        };
                        const ObjectID = Bson.ObjectID;
                        bomStatus._id = new ObjectID();
                        mongodb.collection('bomStatus').insertOne(bomStatus);
                    }
                    const copyComponentDet = Object.assign({}, component);
                    componentList.push(copyComponentDet);
                    addCompnentPormise.push(module.exports.saveMongoMPN(copyComponentDet));
                }
            });
            return Promise.all(addCompnentPormise).then((responsne) => {
                const isFailed = responsne.some(x => x.State == STATE.FAILED);
                if (isFailed) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                } else {
                    req.body.partID = partDetailObj.partID;
                    req.body.isAppend = partDetailObj.isAppend;
                    req.body.parts = componentList.map(a => {
                        if (!a.componentId && a.importMfgPN) {
                            return {
                                partNumber: a.importMfgPN,
                                mfgName: a.importMfrName,
                                partID: partDetailObj.partID,
                                partStatus: 0,
                                supplier: DATA_CONSTANT.PRICING.DIGIKEY,
                                type: DATA_CONSTANT.DIGIKEY_TYPE_ACC.FJTV3_BOM_CLEAN,
                                transactionID: partDetailObj.transactionID
                            };
                        }
                    });
                    req.body.parts = req.body.parts.filter(a => a); // remove undefined records
                    if (Array.isArray(req.body.parts) && req.body.parts.length > 0) {
                        return PricingController.getComponentVerification(req, res);
                    } else {
                        return resHandler.successRes(res, 200, STATE.SUCCESS, 0);
                    }
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.FAILED, null);
            });

        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.FAILED, null);
        });
    },
    // Get MFR/Supplier list by given Name list array
    // @return List Of MFR/Supplier
    findMPNlistByNamelist: (req, mpnNameList, type) => {
        const { Component, MfgCodeMst, sequelize } = req.app.locals.models;
        return Component.findAll({
            where: {
                mfgPN: {
                    [Op.in]: mpnNameList
                },
                isDeleted: false
            },
            attributes: ['id', 'mfgPN', 'PIDCode', 'mfgcodeId', 'mfgType', 'refSupplierMfgpnComponentID', 'createdBy', 'createdAt',
                [sequelize.fn('fun_getUserNameByID', sequelize.col('Component.createdBy')), 'employeeName']],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                attributes: ['id', 'mfgCode', 'mfgName', 'mfgType']
            }, {
                model: Component,
                as: 'refSupplierMfgComponent',
                attributes: ['mfgPN', 'mfgcodeId', 'id', 'mfgType'],
                required: false,
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    attributes: ['id', 'mfgCode', 'mfgName', 'acquisitionDetail'],
                    where: {
                        mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG
                    },
                    required: false
                }]
            },]
        }).then(responsePrice => responsePrice);
    },
    // save component in mongo database
    // @return saved component
    saveMongoMPN: (objMfg) => {
        var mongodb = global.mongodb;
        var ObjectID = Bson.ObjectID;
        // eslint-disable-next-line no-underscore-dangle
        objMfg._id = new ObjectID();

        return mongodb.collection('MpnMappDet').findOne({
            mfrName: objMfg.mfrName,
            transactionID: objMfg.transactionID,
            mfgPN: objMfg.mfgPN
        }).then((result) => {
            if (!result) {
                return mongodb.collection('MpnMappDet').insertOne(objMfg).then(() => {
                    return { STATE: STATE.SUCCESS };
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return { STATE: STATE.FAILED };
                });
            } else {
                return { STATE: STATE.SUCCESS };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return { STATE: STATE.FAILED };
        });
    },
    reVerifyMPNImport: (req, res) => {
        const whereClause = {
            isVerified: false
        }
        if (req.body._id) {
            whereClause._id = new Bson.ObjectId(req.body._id);
        }
        return mongodb.collection('MpnMappDet').find(whereClause).toArray((err, result) => {
            if (err) {
                console.trace();
                console.error(err);
            }
            if (Array.isArray(result) && result.length > 0) {
                var partList = _.map(result, 'importMfgPN');
                var mfrList = _.map(result, 'importMfrName');
                const mfgPromises = [];
                if (partList.length > 0) {
                    mfgPromises.push(module.exports.findMPNlistByNamelist(req, partList));
                }
                if (mfrList.length > 0) {
                    mfgPromises.push(PricingController.findMFRlistByNamelist(req, mfrList, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG));
                }

                return Promise.all(mfgPromises).then((response) => {
                    const partNumberList = Array.isArray(response[0]) && response[0].length > 0 ? response[0] : [];
                    const mappedListPromise = [];
                    let mfrResList = [];
                    if (mfrList) {
                        mfrResList = response[1];
                    }
                    result.forEach((partDet) => {
                        const mpnDetList = partNumberList.filter(a => a && a.mfgPN === partDet.importMfgPN ||
                            (a.refSupplierMfgComponent && a.mfgPN !== partDet.importMfgPN && a.refSupplierMfgComponent.mfgPN === partDet.importMfgPN));

                        if (Array.isArray(mpnDetList) && mpnDetList.length > 0 && partDet.importMfgPN) {
                            mpnDetList.forEach((mpnDet) => {
                                partDet.mfrName = mpnDet.refSupplierMfgComponent ? mpnDet.refSupplierMfgComponent.mfgCodemst.mfgName : mpnDet.mfgCodemst.mfgName;
                                partDet.mfgcodeId = mpnDet.refSupplierMfgComponent ? mpnDet.refSupplierMfgComponent.mfgcodeId : mpnDet.mfgCodemst.id;
                                partDet.componentId = mpnDet.refSupplierMfgComponent ? mpnDet.refSupplierMfgComponent.id : mpnDet.id;
                                partDet.mfgPN = mpnDet.refSupplierMfgComponent ? mpnDet.refSupplierMfgComponent.mfgPN : mpnDet.mfgPN;
                                partDet.supplierName = mpnDet.refSupplierMfgComponent ? mpnDet.mfgCodemst.mfgName : '';
                                partDet.supplierId = mpnDet.refSupplierMfgComponent ? mpnDet.mfgCodemst.id : '';
                                partDet.spn = mpnDet.refSupplierMfgComponent ? mpnDet.mfgPN : '';
                                partDet.refSupplierMfgpnComponentID = mpnDet.refSupplierMfgpnComponentID;
                                partDet.mfgType = mpnDet.mfgType;
                                partDet.createdBy = mpnDet.dataValues.employeeName;
                                partDet.createdAt = mpnDet.createdAt;
                                partDet.isVerified = true;
                            });
                            mappedListPromise.push(mongodb.collection('MpnMappDet').updateOne({
                                _id: partDet._id
                            }, { $set: partDet }).then(() => ({
                                state: STATE.SUCCESS
                            })).catch((error) => {
                                console.trace();
                                console.error(error);
                                return {
                                    state: STATE.FAILED
                                };
                            }));
                        } else {
                            if (Array.isArray(mfrResList) && mfrResList.length > 0 && partDet.importMfrName) {
                                const mfrDet = mfrResList.find(a => a && a.alias.toUpperCase() === partDet.importMfrName.toUpperCase());
                                partDet.mfrName = mfrDet ? mfrDet.alias : '';
                                partDet.mfgcodeId = mfrDet ? parseInt(mfrDet.mfgcodeId) : null;
                                partDet.mfgType = mfrDet ? mfrDet.mfgType : '';
                                if (mfrDet) {
                                    mappedListPromise.push(mongodb.collection('MpnMappDet').updateOne({
                                        _id: partDet._id
                                    }, { $set: partDet }).then(() => ({
                                        state: STATE.SUCCESS
                                    })).catch((error) => {
                                        console.trace();
                                        console.error(error);
                                        return {
                                            state: STATE.FAILED
                                        };
                                    }));
                                    mappedListPromise.push(mongodb.collection('bomStatus').deleteMany({
                                        Type: DATA_CONSTANT.MFG_TYPE.MFG,
                                        DataField: partDet.mfgCode,
                                        bomMFG: partDet.mfgCode,
                                        transactionID: partDet.transactionID
                                    }).then(() => ({
                                        state: STATE.SUCCESS
                                    })).catch((error) => {
                                        console.trace();
                                        console.error(error);
                                        return {
                                            state: STATE.FAILED
                                        };
                                    }));
                                }
                            }
                        }
                    });
                    return Promise.all(mappedListPromise).then((responsne) => {
                        const isFailed = responsne.some(x => x.State == STATE.FAILED);
                        if (isFailed) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        } else {
                            return resHandler.successRes(res, 200, STATE.SUCCESS, 0);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.FAILED, null);
                    });

                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.FAILED, null);
                });
            }
        });
    },
    // Get MPN  list from mongodb
    // POST : /api/v1/component/getVerificationMPNList
    // @return MPN list
    getVerificationMPNList: async (req, res) => {
        var mongodb = global.mongodb;
        const { sequelize } = req.app.locals.models;
        var options = {
            allowDiskUse: false
        };

        const timeZone = await sequelize.query('Select fun_getTimeZone() as timeZone', {
            type: sequelize.QueryTypes.SELECT
        });
        // Create Query for Fetch data from MongoDB
        const pipeline = [
            {
                "$project": {
                    "componentID": 1.0,
                    "_id": 1.0,
                    "importMfgPN": 1.0,
                    "importMfrName": 1.0,
                    "userID": 1.0,
                    "mfrName": 1.0,
                    "mfgcodeId": 1.0,
                    "componentId": 1.0,
                    "mfgPN": 1.0,
                    "supplierName": 1.0,
                    "supplierId": 1.0,
                    "spn": 1.0,
                    "refSupplierMfgpnComponentID": 1.0,
                    "mfgType": 1.0,
                    "isVerified": 1.0,
                    "transactionID": 1.0,
                    "userName": 1.0,
                    "createdBy": 1.0,
                    "createdAt": {
                        $dateToString: {
                            date: '$createdAt',
                            timezone: timeZone[0].timeZone
                        }
                    }
                }
            }
        ];
        return mongodb.collection('MpnMappDet').find().toArray((err, result) => {
            // return mongodb.collection('MpnMappDet').aggregate(pipeline, options).toArray((err, result) => {
            if (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(mfgcodeModuleName),
                    err: err,
                    data: null
                });
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null);
        });
    },
    // Get MPN  list from mongodb
    // POST : /api/v1/component/getPendingVerificationMPNCount
    // @return MPN list
    getPendingVerificationMPNCount: (req, res) => {
        var mongodb = global.mongodb;
        const { sequelize } = req.app.locals.models;
        return mongodb.collection('MpnMappDet').find().toArray((err, result) => {
            // return mongodb.collection('MpnMappDet').aggregate(pipeline, options).toArray((err, result) => {
            if (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(mfgcodeModuleName),
                    err: err,
                    data: null
                });
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null);
        });
    },
    // Stop Import Part Verification
    // POST : /api/v1/component/stopImportPartVerification
    // @return Stop Import Part Verification
    stopImportPartVerification: (req, res) => {
        const { sequelize, ExternalPartVerificationRequestLog, Settings } = req.app.locals.models;
        if (req.body) {
            try {
                return Settings.findOne({
                    where: {
                        key: DATA_CONSTANT.PricingServiceStatus
                    },
                    attributes: ['id', 'values']
                }).then((settingsExt) => {
                    if (settingsExt && settingsExt.values === DATA_CONSTANT.Pricing_Start_Status) {
                        const pricingObj = req.body;
                        if (pricingObj.partID) {
                            const myquery = { partID: pricingObj.partID };
                            if (pricingObj.transactionID) {
                                myquery.transactionID = pricingObj.transactionID;
                            }
                            return PricingController.removeBOMStatus(req, myquery).then(() => {
                                req.body.isStopVerificationLog = true;
                                return module.exports.removeExternalAPILog(req, res);
                            });
                        } else {
                            return resHandler.errorRes(res, 200, STATE.FAILED, null);
                        }
                    } else {
                        return resHandler.errorRes(res,
                            200,
                            STATE.FAILED,
                            MESSAGE_CONSTANT.BOM.PricingStatus);
                    }
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            }
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // remove all MPN Mapped
    removeMpnMapped: (req, myquery) => {
        var mongodb = global.mongodb;
        return mongodb.collection('MpnMappDet').deleteMany(myquery).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    // Remove MFR Detail from mongo db Which are import and From DB as well
    // POST:/api/v1/mfgcode/removeMFRDetails
    // @return remove or not detail of MFR from mongoDB/MY SQL DB or not
    removeImportMPNMappDet: (req, res) => {
        const { MfgCodeAlias } = req.app.locals.models;
        const mongodb = global.mongodb;
        if (req.body) {
            const whereClause = {}
            if (req.body.transactionID) {
                whereClause.transactionID = req.body.transactionID;
            }
            if (req.body.id) {
                whereClause._id = new Bson.ObjectId(req.body.id);
            }
            return mongodb.collection('MpnMappDet').deleteMany(whereClause)
                .then(response => {
                    return module.exports.removeExternalAPILog(req, res);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
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
    // Internal CALL for remove external log of API
    removeExternalAPILog: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_removeExternalVerifiedPart (:pPartID,:ptransactionID,:pPartNumber)',
            {
                replacements: {
                    pPartID: req.body.partID,
                    ptransactionID: req.body.transactionID || null,
                    pPartNumber: req.body.importMPN || null
                }
            })
            .then(() => {
                if (req.body.isStopVerificationLog) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.STOPPED(componentModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(componentModuleName));
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
    // Get Transcation ID by user id
    // POST:/api/v1/mfgcode/removeMFRDetails
    // @return Transcation ID by user id
    getUserImportTransctionId: (req, res) => {
        const { MfgCodeAlias } = req.app.locals.models;
        const mongodb = global.mongodb;
        const myquery = {
            userID: req.body.userid
        }
        return mongodb.collection('MpnMappDet').findOne(myquery).then((result) => {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
};

