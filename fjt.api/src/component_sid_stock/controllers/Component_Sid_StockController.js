const _ = require('lodash');
const {
    Op
} = require('sequelize');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    NotFound,
    ECONNREFUSED,
    ERR_SOCKET_BAD_PORT,
    ETIMEDOUT,
    ENOTFOUND
} = require('../../errors');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const resHandler = require('../../resHandler');
var http = require('http');

const timelineObjForCompoSidStock = DATA_CONSTANT.TIMLINE.EVENTS.COMPONENT_SID_STOCK;
const CompoSidStockConstObj = DATA_CONSTANT.TIMLINE.COMPONENT_SID_STOCK;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
var PricingController = require('../../pricing/controllers/PricingController.js');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const Bartender = DATA_CONSTANT.COMPONENT_SID_STOCK.BarTenderServerIPandPort;
const Pricing = DATA_CONSTANT.PRICING;
const umidManagementTableName = DATA_CONSTANT.COMPONENT_SID_STOCK.TableName;
// const shell = require('node-powershell');
const inputFields = [
    'uid',
    'refcompid',
    'scanlabel',
    'pkgQty',
    'printStatus',
    'costCategoryID',
    'lotCode',
    'nickName',
    'prefix',
    'dateCode',
    'isinStk',
    'isdeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'MFGorExpiryDate',
    'expiryDate',
    'pcbPerArray',
    'binID',
    'mfgDate',
    'spq',
    'cpn',
    'refCPNMFGPNID',
    'mfgAvailabel',
    'customerID',
    'assyID',
    'stockInventoryType',
    'receiveMaterialType',
    'uom',
    'packaging',
    'orgQty',
    'fromBin',
    'orgRecBin',
    'pkgUnit',
    'orgPkgUnit',
    'refSupplierPartId',
    'customerConsign',
    'specialNote',
    'fromWarehouse',
    'fromDepartment',
    'orgRecWarehouse',
    'orgRecDepartment',
    'sealDate',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'mfrDateCodeFormatID',
    'mfrDateCode',
    'documentPath',
    'rohsStatusID',
    'woID',
    'woNumber',
    'fromUIDId',
    'fromUID',
    'parentUIDId',
    'parentUID',
    'selfLifeDays',
    'shelfLifeAcceptanceDays',
    'maxShelfLifeAcceptanceDays',
    'isReservedStock',
    'dateCodeFormatID',
    'fromDateCodeFormat'
];

const ComponentInputFields = [
    'id',
    'refsidid',
    'dataelementid',
    'value',
    'entityid',
    'isdeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const moduleName = DATA_CONSTANT.COMPONENT_SID_STOCK.UMID;
const umidModuleName = DATA_CONSTANT.COMPONENT_SID_STOCK.UMID;

module.exports = {
    // Get List of Component Sid Stock
    // POST : /api/v1/componentsidstock/getUMIDList
    // @return retrive list of Component sid stock
    getUMIDList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const searchColumns = _.chain(req.body.SearchColumns).groupBy('isExternalSearch').map((value, key) => ({
                searchList: value,
                isExternalSearch: key === 'true' ? true : false
            })).value();

            let filter = null;
            let strWhere = '';
            let strInnerWhere = '';
            if (searchColumns.length > 0) {
                _.each(searchColumns, (columns) => {
                    let filterTypeWhereClause = '';
                    if (columns.searchList.length > 0) {
                        req.body.SearchColumns = columns.searchList;
                        filter = COMMON.UiGridFilterSearch(req);
                        if (columns.isExternalSearch) { // isExternalSearch means external filter else grid filter
                            filterTypeWhereClause = COMMON.whereClauseOfMultipleFieldSearchText(filter.where);
                        } else {
                            if (columns && columns.searchList && columns.searchList.length > 0) {
                                /* left join or function: isTransit, searchUser, allocatedToKit, costScrapQty, perScrapQty, packingSlipName, packingSupplierName,
                                 mfrDateCodeFormat, costCategory, mslLevel, partPackage,  cpn, customer, assembly, cpnMFGPN, supplierMFGCode, supplieMFGPN, countOfRestrictUMID,
                                 UMIDRestricted, umidModifiedBy, updatedbyRole, createdByName, createdbyRole
                                ** Same table/inner join logical: displayStockInventoryType, displayReceiveMaterialType, expiryDate, side,pictureCount, mfg, mfgAvailable, customerConsign
                                fromSide, */
                                const whereClauseAliasMapping = [
                                    { colName: 'uid', dbCol: 'css.uid' }, { colName: 'fromUID', dbCol: 'css.fromUID' }, { colName: 'parentUID', dbCol: 'css.parentUID' },
                                    { colName: 'UMIDrohsStatus', dbCol: 'umid_rohs.name' }, { colName: 'PIDCode', dbCol: 'c.PIDCode' }, { colName: 'location', dbCol: 'b.name' },
                                    { colName: 'warehouse', dbCol: 'w.name' }, { colName: 'department', dbCol: 'pw.name' }, { colName: 'spq', dbCol: 'css.spq' },
                                    { colName: 'orgQty', dbCol: 'css.orgQty' }, { colName: 'orgPkgUnit', dbCol: 'css.orgPkgUnit' }, { colName: 'pkgQty', dbCol: 'css.pkgQty' },
                                    { colName: 'pkgUnit', dbCol: 'css.pkgUnit' }, { colName: 'uomName', dbCol: 'u.unitName' }, { colName: 'mfrDateCode', dbCol: 'css.mfrDateCode' },
                                    { colName: 'dateCode', dbCol: 'css.dateCode' }, { colName: 'lotCode', dbCol: 'css.lotCode' }, { colName: 'pcbPerArray', dbCol: 'css.pcbPerArray' },
                                    { colName: 'externalPartPackage', dbCol: 'c.partPackage' }, { colName: 'mfgPN', dbCol: 'c.mfgPN' }, { colName: 'mfgPNDescription', dbCol: 'c.mfgPNDescription' },
                                    { colName: 'detailDescription', dbCol: 'c.detailDescription' }, { colName: 'nickName', dbCol: 'css.nickName' }, { colName: 'packagingName', dbCol: 'cp.name' },
                                    { colName: 'fromBinName', dbCol: 'fb.name' }, { colName: 'fromWHName', dbCol: 'fw.name' }, { colName: 'fromDepartmentName', dbCol: 'fpw.name' },
                                    { colName: 'woNumber', dbCol: 'css.woNumber' }, { colName: 'scanlabel', dbCol: 'css.scanlabel' }, { colName: 'umidPrefix', dbCol: 'css.prefix' }
                                ];
                                const mainQueryWhereClause = [];
                                _.each(columns.searchList, (item) => {
                                    const colDet = _.find(whereClauseAliasMapping, { colName: item.ColumnName });
                                    if (colDet && filter.where[item.ColumnName]) {
                                        mainQueryWhereClause.push(COMMON.UIGridWhereToQueryWithAlias({ [colDet.dbCol]: filter.where[item.ColumnName] }));
                                        delete filter.where[item.ColumnName];
                                    }
                                });

                                if (mainQueryWhereClause.length > 0) {
                                    strInnerWhere = ` AND (${mainQueryWhereClause.join(' AND ')}) `;
                                }
                            }
                            filterTypeWhereClause = COMMON.UIGridWhereToQueryWhere(filter.where);
                        }

                        if (filterTypeWhereClause) {
                            if (strWhere) {
                                strWhere += ' AND ';
                            }
                            strWhere += ` ( ${filterTypeWhereClause} ) `;
                        }
                    }
                });
            } else {
                filter = COMMON.UiGridFilterSearch(req);
            }

            if (req.body.isInStock === true || req.body.isInStock === false) {
                strInnerWhere += ` AND ( css.isinStk = ${req.body.isInStock} ) `;
            }

            if (req.body.scanLabel) {
                strInnerWhere += ` AND ( ${['b.name', 'w.name'].map(item => ` ${item} = "${req.body.scanLabel}" `).join(' OR ')} )`;
            }

            if (strWhere === '') {
                strWhere = null;
            }

            if (strInnerWhere === '') {
                strInnerWhere = null;
            }


            return sequelize.query('CALL Sproc_GetReceivingMaterial (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pWHId, :pBinId, :pFunctionalTypeIDs, :pMountingTypeIDs, :pRefSalesOrderDetIDs, :pAssyIDs, :pRestrictPart, :pExpireMaterial, :pPartId, :pIsShowPackagingAlias, :pStandardIDs, :pStandardsClassIDs, :pCostCategoryIDs, :pDateCode, :pIsAvailableToSell, :pIsRestrictedUMID, :pIsInternalStock, :pIsCustomerStock, :pdepartmentIDs,:pwarehouseType,:pWarehouse,:pExpiredDay,:pRohsStatusIDs,:pCustomerId,:pFromDate,:pToDate,:pSearchTextAttribute,:pMfgCodeIDs,:pSupplierCodeIDs,:pInventoryType, :pInnerQueryWhereClause, :pIsNonCofc, :pEmployeeIDs)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pWHId: req.body.whId || null,
                    pBinId: req.body.binId || null,
                    pFunctionalTypeIDs: req.body.functionalType || null,
                    pMountingTypeIDs: req.body.mountingType || null,
                    pRefSalesOrderDetIDs: req.body.refSalesOrderDetID || null,
                    pAssyIDs: req.body.assyID || null,
                    pRestrictPart: req.body.restrictPart ? req.body.restrictPart : null,
                    pExpireMaterial: req.body.expireMaterial ? req.body.expireMaterial : null,
                    pPartId: req.body.partId || null,
                    pIsShowPackagingAlias: req.body.isShowPackagingAlias ? req.body.isShowPackagingAlias : null,
                    pStandardIDs: req.body.standards || null,
                    pStandardsClassIDs: req.body.standardsClass || null,
                    pCostCategoryIDs: req.body.costCategory || null,
                    pDateCode: req.body.dateCode || null,
                    pIsAvailableToSell: req.body.isAvailableToSell ? req.body.isAvailableToSell : null,
                    pIsRestrictedUMID: req.body.isRestrictedUMID ? req.body.isRestrictedUMID : null,
                    pIsInternalStock: req.body.isInternalStock ? req.body.isInternalStock : null,
                    pIsCustomerStock: req.body.isCustomerStock ? req.body.isCustomerStock : null,
                    pdepartmentIDs: req.body.department || null,
                    pwarehouseType: req.body.warehouseType || null,
                    pWarehouse: req.body.warehouse ? req.body.warehouse : null,
                    pExpiredDay: req.body.expireMaterial ? (req.body.expiredDay || 0) : null,
                    pRohsStatusIDs: req.body.rohsStatus ? req.body.rohsStatus : null,
                    pCustomerId: req.body.customerId || null,
                    pFromDate: req.body.fromDate || null,
                    pToDate: req.body.toDate || null,
                    pSearchTextAttribute: req.body.searchTextAttribute || null,
                    pMfgCodeIDs: req.body.mfgcodeID || null,
                    pInventoryType: req.body.inventoryType || null,
                    pSupplierCodeIDs: req.body.supplierID || null,
                    pInnerQueryWhereClause: strInnerWhere || null,
                    pIsNonCofc: req.body.isNonCofc === true ? req.body.isNonCofc : false,
                    pEmployeeIDs: req.body.employeeIds || null
                },
                type: sequelize.QueryTypes.SELECT
            })
                .then(response => resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    component: _.values(response[4]),
                    warehouse: _.values(response[1]),
                    manufacturer: _.values(response[2]),
                    supplier: _.values(response[3]),
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

    // Get detail of UMID based on ID
    // GET : /api/v1/componentsidstock
    // @param {id} int
    // @return detail of UMID based on ID
    getUMIDByID: (req, res) => {
        const {
            sequelize,
            MfgCodeMst,
            Component,
            ComponentSidStock,
            ComponentSidStockDataelementValues,
            ComponentMSLMst,
            RFQRoHS,
            RFQMountingType,
            KitAllocation,
            UOMs,
            BinMst,
            WarehouseMst,
            RFQPackageCaseType,
            DateCodeFormatMst,
            MeasurementType
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentSidStock.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'uid', 'scanlabel', 'pkgQty', 'isinStk', 'printStatus', 'lotCode', 'dateCode', 'dateCodeFormatID', 'costCategoryID', 'nickName', 'prefix',
                    'MFGorExpiryDate', 'expiryDate', 'mfgDate', 'binID', 'mfgAvailabel', 'customerID', 'assyID',
                    'stockInventoryType', 'cpn', 'uom', 'packaging', 'orgQty', 'fromBin', 'orgRecBin', 'pkgUnit', 'orgPkgUnit', 'fromDateCodeFormat',
                    'customerConsign', 'specialNote', 'sealDate', 'isUMIDRestrict', 'mfrDateCodeFormatID', 'mfrDateCode', 'createdBy', 'rohsStatusID', 'woID',
                    'woNumber', 'receiveMaterialType', 'fromUIDId', 'fromUID', 'parentUIDId', 'parentUID', 'selfLifeDays', 'shelfLifeAcceptanceDays', 'maxShelfLifeAcceptanceDays', 'isReservedStock'
                ],
                include: [{
                    model: DateCodeFormatMst,
                    as: 'dateCodeFormatMst',
                    attributes: ['id', 'dateCodeFormat', 'category']
                },
                {
                    model: BinMst,
                    as: 'binMst',
                    attributes: ['id', 'Name'],
                    required: false,
                    include: [{
                        model: WarehouseMst,
                        as: 'warehousemst',
                        attributes: ['id', 'Name', 'parentWHID', 'warehouseType'],
                        required: false,
                        include: [{
                            model: WarehouseMst,
                            as: 'parentWarehouseMst',
                            attributes: ['id', 'Name'],
                            required: false
                        }]
                    }]
                }, {
                    model: BinMst,
                    as: 'fromBinMst',
                    attributes: ['id', 'Name'],
                    required: false
                }, {
                    model: Component,
                    as: 'component',
                    attributes: ['id', 'mfgcodeID', 'mfgPN', 'PIDCode', 'mfgType', 'mfgPNDescription', 'RoHSStatusID', 'costCategoryID', 'pcbPerArray', 'minimum', 'selfLifeDays', 'maxShelfLifeAcceptanceDays', 'maxShelfListDaysThresholdPercentage',
                        'category', 'uom', 'shelfLifeAcceptanceDays', 'shelfListDaysThresholdPercentage', 'packageQty', 'unit', 'imageURL', 'minimum', 'partPackageID', 'partPackage', 'isCustom', 'umidSPQ', 'costCategoryID', 'dateCodeFormatID'
                    ],
                    required: false,
                    include: [
                        {
                            model: MfgCodeMst,
                            as: 'mfgCodemst',
                            attributes: ['id', 'mfgCode', 'mfgName', 'dateCodeFormatID'],
                            required: false
                        },
                        {
                            model: ComponentMSLMst,
                            as: 'component_mslmst',
                            attributes: ['id', 'levelRating', 'time', 'code'],
                            required: false
                        },
                        {
                            model: RFQRoHS,
                            as: 'rfq_rohsmst',
                            attributes: ['id', 'name', 'rohsIcon', 'refMainCategoryID'],
                            required: false
                        },
                        {
                            model: RFQMountingType,
                            as: 'rfqMountingType',
                            attributes: ['id', 'name', 'hasLimitedShelfLife'],
                            required: false
                        },
                        {
                            model: UOMs,
                            as: 'UOMs',
                            attributes: ['id', 'unitName'],
                            required: false,
                            include: [{
                                model: MeasurementType,
                                as: 'measurementType',
                                attributes: ['id', 'name'],
                                required: false
                            }]
                        },
                        {
                            model: RFQPackageCaseType,
                            as: 'rfq_packagecasetypemst',
                            attributes: ['id', 'name'],
                            required: false
                        }]
                },
                {
                    model: Component,
                    as: 'component_cpn',
                    attributes: ['id', 'mfgcodeID', 'mfgPN', 'PIDCode', 'mfgPNDescription', 'RoHSStatusID', 'costCategoryID', 'pcbPerArray', 'minimum', 'selfLifeDays', 'packageQty'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgCode'],
                        required: false
                    }]
                },
                {
                    model: ComponentSidStockDataelementValues,
                    as: 'componentsidstockdataelementvalues',
                    attributes: ['id', 'refsidid', 'entityid', 'dataelementid', 'value'],
                    required: false
                },
                {
                    model: Component,
                    as: 'component_supplier',
                    attributes: ['id', 'mfgcodeID', 'mfgPN', 'packageQty', 'umidSPQ'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgCode', 'mfgName'],
                        required: false
                    }]
                },
                {
                    model: KitAllocation,
                    where: {
                        status: 'A'
                    },
                    as: 'kitAllocation',
                    attributes: ['id', 'uid', 'assyID'],
                    required: false,
                    paranoid: false,
                    group: ['assyID']
                }
                ]
            }).then((data) => {
                if (!data) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                        err: null,
                        data: null
                    });
                }

                return sequelize.query('CALL Sproc_getUMIDPackingSlipDetilById(:pUIDId)', {
                    replacements: {
                        pUIDId: data.parentUIDId ? data.parentUIDId : data.id
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    data.dataValues.packingSlipDet = _.values(response[0])[0];
                    return sequelize.query('Select fun_getCofCDocumentCount(:pUMIDId,:pPackingSlipId)', {
                        replacements: {
                            pUMIDId: data.parentUIDId ? data.parentUIDId : data.id,
                            pPackingSlipId: data.dataValues.packingSlipDet ? data.dataValues.packingSlipDet.id : null
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then((responseData) => {
                        if (responseData && responseData[0]) {
                            data.dataValues.cofcDocumentCount = _.values(responseData[0])[0];
                        }
                        return sequelize.query('Select fun_getUserCodeByID(:pUserID)', {
                            replacements: {
                                pUserID: data.createdBy
                            },
                            type: sequelize.QueryTypes.SELECT
                        }).then((responceData) => {
                            data.dataValues.createdUserCode = _.values(responceData[0])[0];
                            return resHandler.successRes(res,
                                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                STATE.SUCCESS,
                                data,
                                null
                            );
                        }).catch((err) => {
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
                }).catch((err) => {
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

    createUMIDValidation: (req, res) => {
        const { VUUMIDCreationPending, sequelize } = req.app.locals.models;
        const promise = [];

        if (req.body.componentSidStk.packingSlipDetailId) {
            promise.push(
                VUUMIDCreationPending.findOne({
                    where: {
                        packingSlipDetID: req.body.componentSidStk.packingSlipDetailId,
                        BalanceQty: {
                            [Op.gt]: 0
                        }
                    },
                    model: VUUMIDCreationPending,
                    attributes: ['BinID', 'PartId', 'InQty', 'UMIDCreatedQty', 'BalanceQty', 'packingSlipModeStatus', 'packingSlipNumber', 'umidCreated', 'packagingID', 'receivedStatus']
                }).then((StockList) => {
                    if (StockList) {
                        if (StockList.BalanceQty <= 0 || StockList.BalanceQty < req.body.componentSidStk.pkgQty) {
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.BIN_NOT_HAVE_STOCK);
                            if (req.body.isIdenticalUMID) {
                                const appendMessageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.IDENTICAL_UMID_STOCK_NOT_EXISTS);
                                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.componentSidStk.fromBinName, req.body.componentSidStk.finalMfgPn, StockList.BalanceQty, req.body.componentSidStk.pkgQty, appendMessageContent.message);
                            } else {
                                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.componentSidStk.fromBinName, req.body.componentSidStk.finalMfgPn, StockList.BalanceQty, req.body.componentSidStk.pkgQty);
                            }
                            return { status: STATE.FAILED, messageTypeCode: 'BIN_NOT_HAVE_STOCK', messageContent: messageContent, err: null };
                        } else {
                            return { status: STATE.SUCCESS };
                        }
                    } else {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.STOCK_NOT_EXISTS_FOR_NON_UMID_STOCK);
                        return { status: STATE.FAILED, messageTypeCode: 'STOCK_NOT_EXISTS', messageContent: messageContent, err: null };
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return { status: STATE.FAILED, messageTypeCode: 0, messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err };
                }));
        }

        if (req.body.componentSidStk.kitAllocation && req.body.componentSidStk.kitAllocation.refSalesOrderDetID) {
            // Check validation, is stock to be allocate is more than required qty or not
            promise.push(
                sequelize
                    .query('CALL Sproc_CalculationAllocationQty (:pRefSalesOrderDetailId,:pParentAssyId,:pAssyId,:pMFGPNId,:pKitQty,:pFromUOM,:pCountValue,:pUnitValue,:pAllocateUnitValue,:pCheckValidation,:pBomLineId)', {
                        replacements: {
                            pRefSalesOrderDetailId: req.body.componentSidStk.kitAllocation.refSalesOrderDetID,
                            pParentAssyId: req.body.componentSidStk.kitAllocation.parentAssyID,
                            pAssyId: req.body.componentSidStk.kitAllocation.assyID,
                            pMFGPNId: req.body.componentSidStk.kitAllocation.partId,
                            pKitQty: req.body.componentSidStk.kitAllocation.kitQty,
                            pFromUOM: req.body.componentSidStk.kitAllocation.allocatedUOM,
                            pCountValue: req.body.componentSidStk.kitAllocation.allocatedQty,
                            pUnitValue: req.body.componentSidStk.kitAllocation.allocatedUnit,
                            pAllocateUnitValue: req.body.componentSidStk.kitAllocation.allocatedUnitValue,
                            pCheckValidation: req.body.componentSidStk.kitAllocation.checkValidation,
                            pBomLineId: req.body.componentSidStk.kitAllocation.refBOMLineID
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then((responseData) => {
                        if (responseData[0][0]['IsSuccess'] === 1) {
                            req.body.componentSidStk.kitAllocation.allocatedQty = responseData[0][0]['AllocatedQty'];
                            req.body.componentSidStk.kitAllocation.allocatedUnit = responseData[0][0]['AllocatedUnit'];
                            req.body.componentSidStk.kitAllocation.allocatedUOM = responseData[0][0]['AllocateUOM'];
                            return { status: STATE.SUCCESS, messageTypeCode: null, messageContent: null, err: null };
                        } else { // confirmation for more then required qty allocation valdiation
                            return {
                                status: STATE.FAILED,
                                messageTypeCode: 'KIT_ALLOCATION_VALIDATION',
                                errorCode: responseData[0][0]['errorCode'],
                                messageContent: responseData[0][0]['errorText'],
                                shortageQty: responseData[0][0]['ShortagePerBuild'],
                                err: null
                            };
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return { status: STATE.FAILED, messageTypeCode: 0, messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err };
                    }));
        }

        if (req.body.componentSidStk.stockInventoryType === DATA_CONSTANT.COMPONENT_SID_STOCK.INVENTORY_TYPE.ExistingAssemblyStock) {
            // For Non-UMID Assembly Stock
            req.body.workorderNumber = req.body.componentSidStk.woNumber;
            promise.push(
                module.exports.getExistingAssemblyWorkorderDetail(req, res, true).then((StockList) => {
                    if (StockList) {
                        if (StockList.availableQty <= 0 || StockList.availableQty < req.body.componentSidStk.pkgQty) {
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.BIN_NOT_HAVE_STOCK); if (req.body.isIdenticalUMID) {
                                const appendMessageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.IDENTICAL_UMID_STOCK_NOT_EXISTS);
                                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.componentSidStk.fromBinName, req.body.componentSidStk.finalMfgPn, StockList.availableQty, req.body.componentSidStk.pkgQty, appendMessageContent.message);
                            } else {
                                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.componentSidStk.fromBinName, req.body.componentSidStk.finalMfgPn, StockList.availableQty, req.body.componentSidStk.pkgQty);
                            }
                            return { status: STATE.FAILED, messageTypeCode: 'BIN_NOT_HAVE_STOCK', messageContent: messageContent, err: null };
                        } else {
                            return { status: STATE.SUCCESS };
                        }
                    } else {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.STOCK_NOT_EXISTS_FOR_ASSEMBLY_STOCK); // Need to manage newly created message code get packing slip name
                        return { status: STATE.FAILED, messageTypeCode: 'STOCK_NOT_EXISTS', messageContent: messageContent, err: null };
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return { status: STATE.FAILED, messageTypeCode: 0, messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err };
                }));
        }

        return Promise.all(promise).then((response) => {
            if (Array.isArray(response) && response.length > 0) {
                const responseStatus = response.find(item => item.status === STATE.FAILED);
                if (responseStatus && responseStatus.status === STATE.FAILED) {
                    return responseStatus;
                } else {
                    return module.exports.validateAndSaveUMID(req, res);
                }
            } else {
                return module.exports.validateAndSaveUMID(req, res);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return { status: STATE.FAILED, messageTypeCode: 0, messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err };
        });
    },

    validateAndSaveUMID: (req, res) => {
        const {
            ComponentSidStock,
            PackingSlipMaterialReceiveDet,
            ComponentSidStockPackingDetail,
            sequelize
        } = req.app.locals.models;

        const promises = [];
        return sequelize.transaction().then((t) => {
            const prefix = req.body.componentSidStk ? (req.body.componentSidStk.prefix ? req.body.componentSidStk.prefix : null) : null;
            const isSplitUID = req.body.componentSidStk && req.body.componentSidStk.isSplitUID === true ? true : false;
            return module.exports.generateBarcodeForUMID(req, prefix, isSplitUID, t).then((objPrifix) => {
                if (objPrifix) {
                    req.body.componentSidStk.uid = objPrifix;
                    COMMON.setModelCreatedObjectFieldValue(req.user, req.body.componentSidStk);
                    // Make entry in component_sid_stock to create UMID
                    return ComponentSidStock.create(req.body.componentSidStk, {
                        fields: inputFields,
                        transaction: t
                    }).then((component) => {
                        // Get detail of packing slip material if UMID is not created for pending stock
                        if (req.body.componentSidStk.stockInventoryType === DATA_CONSTANT.COMPONENT_SID_STOCK.INVENTORY_TYPE.NewStock) {
                            const obj = {
                                refPackingSlipDetailID: req.body.componentSidStk.packingSlipDetailId,
                                refComponentSidStockID: component.id,
                                packingSlipQty: req.body.componentSidStk.orgQty
                            };
                            COMMON.setModelCreatedObjectFieldValue(req.user, obj);
                            // Make one entry to manage that UMID created against packing slip material
                            promises.push(
                                ComponentSidStockPackingDetail.create(obj, {
                                    transaction: t
                                })
                            );

                            promises.push(
                                PackingSlipMaterialReceiveDet.update(
                                    {
                                        umidCreated: (sequelize.literal(`((rmaCreatedQty+umidCreatedQty+${(req.body.componentSidStk.pkgQty || 0)})=receivedQty)`)),
                                        umidCreatedQty: (sequelize.literal(`(umidCreatedQty+${(req.body.componentSidStk.pkgQty || 0)})`))
                                    },
                                    {
                                        where: {
                                            id: req.body.componentSidStk.packingSlipDetailId
                                        },
                                        transaction: t
                                    })
                            );
                            return module.exports.saveUMIDDetail(req, res, component, promises, t);
                        } else {
                            return module.exports.saveUMIDDetail(req, res, component, promises, t);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return { status: STATE.FAILED, messageTypeCode: 0, messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err };
                    });
                } else {
                    if (!t.finished) {
                        t.rollback();
                    }
                    return { status: STATE.FAILED, messageTypeCode: 0, messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return { status: STATE.FAILED, messageTypeCode: 0, messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err };
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return { status: STATE.FAILED, messageTypeCode: 0, messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err };
        });
    },

    saveUMIDDetail: (req, res, component, promises, t) => {
        const {
            Component,
            ComponentSidStockDataelementValues,
            KitAllocation,
            GenericAuthenticationMst
        } = req.app.locals.models;
        if (req.body.componentSidStk.oldpcbPerArray !== req.body.componentSidStk.pcbPerArray) {
            // If PCB per array is changed then also update in part master
            COMMON.setModelUpdatedByObjectFieldValue(req.user, req.body.componentSidStk);
            promises.push(
                Component.update(req.body.componentSidStk, {
                    where: {
                        ID: req.body.componentSidStk.refcompid
                    },
                    fields: ['pcbPerArray', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                    transaction: t
                })
            );
        }

        // [S] add log of create component sid stock (receiving material) details for timeline users
        req.objEvent = {
            userID: req.user.id,
            eventTitle: CompoSidStockConstObj.CREATE.title,
            eventDescription: COMMON.stringFormat(CompoSidStockConstObj.CREATE.description, req.body.componentSidStk.receiveMaterialTypeName, req.body.componentSidStk.uid, req.user.username),
            refTransTable: CompoSidStockConstObj.refTransTableName,
            refTransID: component.id,
            eventType: timelineObjForCompoSidStock.id,
            url: COMMON.stringFormat(CompoSidStockConstObj.url, component.id),
            eventAction: timelineEventActionConstObj.CREATE
        };
        TimelineController.createTimeline(req);
        // [E] add log of create component sid stock (receiving material) details for timeline users

        _.map(req.body.componentSidStk.delimiterDetails, (item) => {
            item.refsidid = component.id;
        });

        _.forEach(req.body.componentSidStk.delimiterDetails, (data) => {
            // Add/Update detail of UMID data element
            if (data && data.id) {
                COMMON.setModelUpdatedByObjectFieldValue(req.user, data);
                // data.updatedBy = req.user.id;
                promises.push(
                    ComponentSidStockDataelementValues.update(data, {
                        where: {
                            id: data.id
                        },
                        fields: ComponentInputFields,
                        paranoid: false,
                        transaction: t
                    })
                );
            } else {
                COMMON.setModelCreatedObjectFieldValue(req.user, data);
                // data.createdBy = req.user.id;
                promises.push(
                    ComponentSidStockDataelementValues.create(data, {
                        fields: ComponentInputFields,
                        paranoid: false,
                        transaction: t
                    })
                );
            }
        });

        // If kit is selected then also make entry for kit allocation
        if (req.body.componentSidStk.kitAllocation && req.body.componentSidStk.kitAllocation.refSalesOrderDetID) {
            req.body.componentSidStk.kitAllocation.createdBy = req.user.id;
            req.body.componentSidStk.kitAllocation.uid = component.uid;
            req.body.componentSidStk.kitAllocation.refUIDId = component.id;
            req.body.componentSidStk.kitAllocation.transactionDate = COMMON.getCurrentUTC();
            if (req.body.componentSidStk.kitAllocation.roHSApprovalReason) {
                req.body.componentSidStk.kitAllocation.roHSApprovedBy = COMMON.getRequestUserID(req);
                req.body.componentSidStk.kitAllocation.roHSApprovedOn = COMMON.getCurrentUTC();
                promises.push(
                    KitAllocation.create(req.body.componentSidStk.kitAllocation, {
                        fields: ['refSalesOrderDetID', 'assyID', 'uid', 'refBOMLineID', 'allocatedQty', 'transactionDate', 'status', 'createdBy', 'updatedBy', 'refUIDId', 'partId', 'allocatedUnit', 'allocatedUOM', 'roHSApprovalReason', 'roHSApprovedBy', 'roHSApprovedOn', 'allocationRemark'],
                        transaction: t
                    })
                );
            } else {
                promises.push(
                    KitAllocation.create(req.body.componentSidStk.kitAllocation, {
                        fields: ['refSalesOrderDetID', 'assyID', 'uid', 'refBOMLineID', 'allocatedQty', 'transactionDate', 'status', 'createdBy', 'updatedBy', 'refUIDId', 'partId', 'allocatedUnit', 'allocatedUOM', 'allocationRemark'],
                        transaction: t
                    })
                );
            }
        }

        // Add log for approval of restricted parts with permission or expiration date validation
        if (req.body.componentSidStk.approvalReasonList && req.body.componentSidStk.approvalReasonList.length > 0) {
            req.body.componentSidStk.approvalReasonList.forEach((item) => {
                item.refID = component.id;
            });
            promises.push(
                GenericAuthenticationMst.bulkCreate(req.body.componentSidStk.approvalReasonList, {
                    fields: ['id', 'transactionType', 'approveFromPage', 'refTableName', 'refID', 'approvedBy', 'approvalReason', 'confirmationType', 'isDeleted', 'createdBy', 'updatedBy', 'deletedBy'],
                    transaction: t
                })
            );
        }

        return Promise.all(promises).then((promiseRes) => {
            return t.commit().then(() => {
                if (promiseRes && Array.isArray(promiseRes)) {
                    const kitDetail = promiseRes.find(item => item && item.$modelOptions && item.$modelOptions.tableName === 'kit_allocation');

                    // Add Kit Allocation Detail into Elastic Search Engine for Enterprise Search
                    if (typeof (kitDetail) === 'object') {
                        req.params['pId'] = kitDetail.id;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageKitAllocationInElastic);
                    }
                }
                return module.exports.saveUMIDResponse(req, res, component);
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) {
                t.rollback();
            }
            return { status: STATE.FAILED, messageTypeCode: 0, messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err };
        });
    },

    // Add UMID detail into Elastic Search Engine for Enterprise Search
    saveUMIDResponse: (req, res, umidDetail) => {
        req.params = {
            umID: umidDetail && umidDetail.id ? umidDetail.id : req.body.componentSidStockDetails.componentSidStock.id
        };
        // Add UMID detail into Elastic Search Engine for Enterprise Search
        // Need to change timeout code due to trasaction not get updated record
        setTimeout(() => {
            EnterpriseSearchController.manageUMIDDetailInElastic(req);
        }, 2000);
        req.body.isIdenticalUMID = req.body.isIdenticalUMID === true ? true : false;
        if (req.body.isIdenticalUMID) {
            return { status: STATE.SUCCESS, messageTypeCode: 'IDENTICAL_UMID', umidDetail: umidDetail };
        } else if (umidDetail && umidDetail.id) {
            if (req.body.componentSidStk && req.body.componentSidStk.isSplitUID) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    DataId: umidDetail.id,
                    umidDetail: umidDetail
                }, MESSAGE_CONSTANT.CREATED(umidModuleName));
            } else {
                return { status: STATE.SUCCESS, messageTypeCode: 'CREATE', umidDetail: umidDetail };
            }
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                messageTypeCode: 'UPDATE'
            }, MESSAGE_CONSTANT.UPDATED(umidModuleName));
        }
    },

    // Create Component sid stock
    // POST : /api/v1/componentsidstock
    // @return API response
    createComponentSidStock: (req, res) => {
        const promise = [];
        let successResponse;
        let failResponse;
        if (req.body) {
            promise.push(
                module.exports.createUMIDValidation(req, res)
                    .then(responsePromise => Promise.resolve(responsePromise)));
            return Promise.all(promise).then((response) => {
                if (Array.isArray(response) && response.length > 0) {
                    successResponse = response.find(item => item.status === STATE.SUCCESS);
                    failResponse = response.find(item => item.status === STATE.FAILED);
                    if (failResponse) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            messageContent: failResponse.messageContent,
                            err: response.err || null,
                            shortageQty: failResponse.shortageQty || null,
                            errorCode: failResponse.errorCode || null,
                            messageTypeCode: failResponse.messageTypeCode
                        }, null);
                    } else if (successResponse.status === STATE.SUCCESS && successResponse.messageTypeCode === 'CREATE') {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            DataId: successResponse.umidDetail.id,
                            umidDetail: successResponse.umidDetail,
                            messageTypeCode: successResponse.messageTypeCode
                        }, MESSAGE_CONSTANT.CREATED(umidModuleName));
                    }
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Update Component sid stock
    // POST : /api/v1/updateComponentSidStock
    // @return API response
    updateComponentSidStock: (req, res) => {
        if (req.body.componentSidStockDetails && req.body.componentSidStockDetails.componentSidStock) {
            module.exports.updateComponentSidStockDetail(req, res);
        }
    },

    // Update Component sid stock
    updateComponentSidStockDetail: (req, res) => {
        const {
            sequelize,
            ComponentSidStock,
            ComponentSidStockDataelementValues,
            Component,
            GenericAuthenticationMst
        } = req.app.locals.models;
        if (req.body.componentSidStockDetails) {
            const promises = [];
            return sequelize.transaction().then((t) => {
                // req.body.dataElementObj.componentSidStock.updatedBy = req.user.id;
                COMMON.setModelUpdatedByObjectFieldValue(req.user, req.body.componentSidStockDetails.componentSidStock);
                return ComponentSidStock.update(req.body.componentSidStockDetails.componentSidStock, {
                    where: {
                        ID: req.body.componentSidStockDetails.componentSidStock.id
                    },
                    fields: inputFields,
                    transaction: t
                }).then(() => {
                    if (req.body.componentSidStockDetails.componentSidStock.oldpcbPerArray !== req.body.componentSidStockDetails.componentSidStock.pcbPerArray) {
                        COMMON.setModelUpdatedByObjectFieldValue(req.user, req.body.componentSidStockDetails.componentSidStock);
                        promises.push(
                            Component.update(req.body.componentSidStockDetails.componentSidStock, {
                                where: {
                                    ID: req.body.componentSidStockDetails.componentSidStock.refcompid
                                },
                                fields: ['pcbPerArray', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                transaction: t
                            })
                        );
                    }


                    // Add log for approval of restricted part expiration date validation
                    if (req.body.componentSidStockDetails.approvalReasonList && req.body.componentSidStockDetails.approvalReasonList.length > 0) {
                        const objApprovalReason = _.first(req.body.componentSidStockDetails.approvalReasonList);
                        if (objApprovalReason) {
                            objApprovalReason.refID = req.body.componentSidStockDetails.componentSidStock.id;
                            promises.push(
                                GenericAuthenticationMst.update(objApprovalReason, {
                                    where: {
                                        refID: req.body.componentSidStockDetails.componentSidStock.id
                                    },
                                    fields: ['approvedBy', 'approvalReason', 'updatedBy'],
                                    transaction: t
                                })
                            );
                        }
                    }

                    // [S] add log of update component sid stock (receiving material) details for timeline users
                    req.objEvent = {
                        userID: req.user.id,
                        eventTitle: CompoSidStockConstObj.UPDATE.title,
                        eventDescription: COMMON.stringFormat(CompoSidStockConstObj.UPDATE.description, req.body.componentSidStockDetails.componentSidStock.receiveMaterialTypeName, req.body.componentSidStockDetails.componentSidStock.uid, req.user.username),
                        refTransTable: CompoSidStockConstObj.refTransTableName,
                        refTransID: req.body.componentSidStockDetails.componentSidStock.id,
                        eventType: timelineObjForCompoSidStock.id,
                        url: COMMON.stringFormat(CompoSidStockConstObj.url, req.body.componentSidStockDetails.componentSidStock.id),
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    promises.push(
                        TimelineController.createTimeline(req, res, t)
                    );
                    // [E] add log of update component sid stock (receiving material) details for timeline users

                    _.forEach(req.body.componentSidStockDetails.delimiterDetails, (data) => {
                        if (data && data.id) {
                            // data.updatedBy = req.user.id;
                            COMMON.setModelUpdatedByObjectFieldValue(req.user, data);
                            promises.push(
                                ComponentSidStockDataelementValues.update(data, {
                                    where: {
                                        id: data.id
                                    },
                                    fields: ComponentInputFields,
                                    paranoid: false,
                                    transaction: t
                                })
                            );
                        } else {
                            // data.createdBy = req.user.id;
                            COMMON.setModelCreatedObjectFieldValue(req.user, data);
                            promises.push(
                                ComponentSidStockDataelementValues.create(data, {
                                    fields: ComponentInputFields,
                                    paranoid: false,
                                    transaction: t
                                })
                            );
                        }
                    });
                    return Promise.all(promises).then(() => t.commit().then(() => module.exports.saveUMIDResponse(req, res)));
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
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


    // Check Unique UMID
    // @return detail of UMID
    checkUniqueUMID: (req, res, uid) => {
        const {
            ComponentSidStock
        } = req.app.locals.models;

        if (uid) {
            return ComponentSidStock.findOne({
                where: {
                    uid: uid,
                    deletedAt: null
                },
                attributes: ['id', 'uid', 'stockInventoryType', 'receiveMaterialType'],
                required: false
            }).then(umid => umid).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    /**
     * match scan label to BarCode-template
     * Post : /api/v1/barcodeLabelTemplateelimiter
     * @return message for barcode template match or not
     */
    MatchRegexpToString: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize
                .query('CALL Sproc_MatchBarCodeAndSaveDelimiters (:pWhereClause,:puserID,:pnickName,:pprefix,:pIsFromUID,:pComponentID,:pCustomerID,:pCPN,:pMFGAvailabel,:pRefCpnMfgID,:pAssyID,:pSalesOrderDetailID,:pReceiveMaterialType,:pkitAssemblyID,:pBarcodeID,:pBOMLineID,:pSupplierID,:pCategory,:pInventoryType,:pCallFrom,:pExcludeStatus,:pBinID)', {
                    replacements: {
                        pWhereClause: req.body.regxpString,
                        puserID: req.user.id,
                        pnickName: req.body.nickName ? req.body.nickName : null,
                        pprefix: req.body.preFix ? req.body.preFix : null,
                        pIsFromUID: true,
                        pComponentID: req.body.mfgId,
                        pCustomerID: req.body.customerID ? req.body.customerID : null,
                        pCPN: req.body.cpn,
                        pMFGAvailabel: req.body.mfgAvailabel,
                        pRefCpnMfgID: null,
                        pAssyID: req.body.assyId ? req.body.assyId : null,
                        pSalesOrderDetailID: req.body.salesOrderDetailId ? req.body.salesOrderDetailId : null,
                        pReceiveMaterialType: req.body.receiveMaterialType,
                        pkitAssemblyID: req.body.kitAssemblyID,
                        pBarcodeID: req.body.barcodeId ? req.body.barcodeId : null,
                        pBOMLineID: req.body.bOMLineID ? req.body.bOMLineID : null,
                        pSupplierID: req.body.supplierID ? req.body.supplierID : null,
                        pCategory: DATA_CONSTANT.BARCODDE_CATEGORY.MFRPN,
                        pInventoryType: req.body.InventoryType,
                        pCallFrom: req.body.callFrom || null,
                        pExcludeStatus: req.body.exculdePartStatus || null,
                        pBinID: req.body.binID ? req.body.binID : null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    if (response[0] && (response[0][0].errorText && response[0][0].errorText !== 'Validation Clear') &&
                        (['0', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '22', '23', '24', '25', '26'].indexOf(response[0][0].IsSuccess) !== -1)) {
                        return resHandler.successRes(res, 200, STATE.SUCCESS, {
                            Datamessage: MESSAGE_CONSTANT.STATICMSG(response[0][0].errorText),
                            messagecode: response[0][0].IsSuccess,
                            MFGPart: response[0][0].MFGPart
                        });
                    } else if (response[0] && (response[0][0].errorText && response[0][0].errorText === 'Validation Clear') && response[0][0].IsSuccess === '1') {
                        const responseList = {
                            ValidationMessage: response[0][0],
                            Component_Sid_Stock: response[1][0],
                            Component: response[2][0],
                            Dataelement: response[3],
                            CPNPart: response[4],
                            BOMLineDetail: response[5][0]
                        };
                        return resHandler.successRes(res, 200, STATE.SUCCESS, responseList);
                    } else {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
        // var exp = "'" + req.body.regxpString + "'";
        // BRLabelTemplate.find({
        //     where: {
        //         tempregexp: sequelize.literal(exp + 'REGEXP tempregexp')
        //     },
        //     include: [{
        //         model: BRLabelTemplateDelimiter,
        //         as: 'barcodeDelimiter',
        //         where: { isDeleted: false },
        //         attributes: ['id', 'refbrID', 'delimiter', 'length'],
        //         required: false
        //     }]
        // }).then((data) => {
        //     if(data){
        //          return resHandler.successRes(res, 200, STATE.SUCCESS, { matchtempdet: data });
        //     }else{
        //         return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
        //     }
        // }).catch((err) => {
        //     console.trace();
        //     console.error(err);
        //     return resHandler.errorRes(res, 200,
        //         STATE.EMPTY,
        //         new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
        // });
    },

    // get prefix and uid for component sid stock
    generateBarcodeForUMID: (req, preFix, isSplitUID, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        const promise = [];
        promise.push(
            sequelize.query('CALL Sproc_GenerateBarcodeForUMID (:pPrefix,:pRoleID,:pUserID,:pIsSplitUID)', {
                replacements: {
                    pPrefix: preFix,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req),
                    pUserID: COMMON.getRequestUserID(req),
                    pIsSplitUID: isSplitUID
                },
                transaction: t
            }).then((responseData) => {
                if (responseData && responseData[0] && responseData[0].v_UMID) {
                    return { status: STATE.SUCCESS, data: responseData[0].v_UMID };
                } else {
                    return { status: STATE.FAILED };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED };
            }));
        return Promise.all(promise).then((response) => {
            const resp = response[0];
            if (_.find(resp, sts => sts.status === STATE.FAILED)) {
                if (!t.finished) {
                    t.rollback();
                }
                return { data: null };
            }
            return (resp && resp.data ? resp.data : 0);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return 0;
        });
    },

    deleteComponentSidStock: (req, res) => {
        const {
            PackingSlipMaterialReceiveDet,
            ComponentSidStockPackingDetail,
            GenericAuthenticationMst,
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.Component_sid_stockTbl;
            COMMON.setModelDeletedByFieldValue(req);

            return sequelize.query('CALL Sproc_checkDelete (:tableName, :IDs, :deletedBy, :entityID, :refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((ComponentSidStock) => {
                if (ComponentSidStock.length === 0) {
                    return ComponentSidStockPackingDetail.findAll({
                        where: {
                            refComponentSidStockID: {
                                [Op.in]: req.body.objIDs.id
                            }
                        },
                        model: ComponentSidStockPackingDetail,
                        attributes: ['id', 'refPackingSlipDetailID', 'refComponentSidStockID'],
                        include: [{
                            model: PackingSlipMaterialReceiveDet,
                            as: 'packing_slip_material_receive_det',
                            required: true,
                            attributes: ['id', 'refPackingSlipMaterialRecID', 'receivedQty', 'umidCreatedQty']
                        }]
                    }).then((StockList) => {
                        if (StockList && StockList.length > 0) {
                            const promiseUpdate = [];
                            const umidWiseMaterialReceiptDet = _.groupBy(StockList, 'refPackingSlipDetailID');
                            _.forEach(umidWiseMaterialReceiptDet, (item, refPackingSlipDetailID) => {
                                if (item.length > 0) {
                                    const obj = {
                                        umidCreated: false
                                    };

                                    const selectedPSUMID = _.map(item, 'refComponentSidStockID');
                                    const selectedPSUMIDList = _.filter(req.body.selectedObject, data => (data.id === selectedPSUMID[0] ? selectedPSUMID.indexOf(data.id !== -1) : 0));
                                    const umidPkgQty = _.map(selectedPSUMIDList, objUMID => (objUMID.pkgQty * -1));
                                    const umidCreatedQty = (_.first(item).packing_slip_material_receive_det.umidCreatedQty) || 0;
                                    obj.umidCreatedQty = COMMON.CalcSumofArrayElement([...umidPkgQty, ...[umidCreatedQty]], 2);
                                    COMMON.setModelUpdatedByObjectFieldValue(req.user, obj);
                                    promiseUpdate.push(
                                        PackingSlipMaterialReceiveDet.update(obj, {
                                            where: {
                                                id: refPackingSlipDetailID
                                            },
                                            fields: ['umidCreated', 'umidCreatedQty', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                            paranoid: false
                                        })
                                    );
                                }
                            });

                            _.forEach(StockList, (item) => {
                                const obj = {};
                                COMMON.setModelDeletedByObjectFieldValue(req.user, obj);
                                promiseUpdate.push(
                                    ComponentSidStockPackingDetail.update(obj, {
                                        where: {
                                            refComponentSidStockID: item.refComponentSidStockID
                                        },
                                        paranoid: false
                                    })
                                );
                            });

                            promiseUpdate.push(
                                GenericAuthenticationMst.update({
                                    isDeleted: true,
                                    deletedBy: COMMON.getRequestUserID(req),
                                    deletedAt: COMMON.getCurrentUTC(),
                                    deleteByRoleId: req.user.defaultLoginRoleID
                                }, {
                                    where: {
                                        refID: {
                                            [Op.in]: req.body.objIDs.id
                                        },
                                        refTableName: umidManagementTableName
                                    },
                                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId']
                                })
                            );

                            return Promise.all(promiseUpdate).then(() => {
                                // Delete UMID Detail into Elastic Search Engine for Enterprise Search
                                // Need to change timeout code due to trasaction not get updated record
                                setTimeout(() => {
                                    EnterpriseSearchController.deleteUMIDDetailInElastic(req.body.objIDs.id.toString());
                                }, 2000);
                                return resHandler.successRes(
                                    res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                    STATE.SUCCESS,
                                    ComponentSidStock,
                                    MESSAGE_CONSTANT.DELETED(umidModuleName)
                                );
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(
                                    res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                    STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                }
                                );
                            });
                        } else {
                            // Delete UMID Detail into Elastic Search Engine for Enterprise Search
                            // Need to change timeout code due to trasaction not get updated record
                            setTimeout(() => {
                                EnterpriseSearchController.deleteUMIDDetailInElastic(req.body.objIDs.id.toString());
                            }, 2000);
                            return resHandler.successRes(
                                res,
                                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                STATE.SUCCESS,
                                null,
                                MESSAGE_CONSTANT.DELETED(umidModuleName)
                            );
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        }
                        );
                    });
                } else {
                    return resHandler.successRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS, {
                        transactionDetails: ComponentSidStock,
                        IDs: req.body.objIDs.id
                    },
                        null
                    );
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    /**
     * get price category id
     * Post : /api/v1/componentsidstock/getPriceCategory
     * @return priec category id
     */
    getPriceCategory: (req, res) => {
        const {
            Settings,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const material = req.body.objMaterial;
            return Settings.findAll({
                where: {
                    key: [Pricing.DigiKeyAccessToken, Pricing.DigiKeyClientID]
                },
                attributes: ['id', 'key', 'values', 'clusterName']
            }).then((settings) => {
                const DigiKeyToken = _.find(settings, token => token.key === Pricing.DigiKeyAccessToken);
                const DigiKeyClientID = _.find(settings, client => client.key === Pricing.DigiKeyClientID);
                let price = null;
                PricingController.getdigiPartDetail(req, material.mfgPN, DigiKeyToken.values, DigiKeyClientID.values, '').then((checkdigikey) => {
                    if (checkdigikey && checkdigikey.PartDetails) {
                        const objPrice = _.find(checkdigikey.PartDetails.StandardPricing, item => item.BreakQuantity === material.qty);
                        if (objPrice && objPrice.UnitPrice) {
                            price = objPrice.UnitPrice;
                        } else {
                            const objPricelist = _.reverse(_.sortBy((_.filter(checkdigikey.PartDetails.StandardPricing, item => item.BreakQuantity < material.qty)), ['BreakQuantity']));
                            if (objPricelist.length > 0) {
                                price = objPricelist[0].UnitPrice;
                            }
                        }
                        if (!price) {
                            return resHandler.successRes(res, 200, STATE.FAILED, null);
                        }
                        return sequelize.query('CALL Sproc_setPriceCategory (:price,:pid)', {
                            replacements: {
                                price: price,
                                pid: material.id
                            },
                            type: sequelize.QueryTypes.SELECT
                        }).then((response) => {
                            if (response[0][0] && response[0][0].id) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED('Price category'));
                            } else {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.FAILED, null, null);
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
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.FAILED, null, null);
                    }
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

    PrintDocument: (req, res) => {
        let count = 0;
        var port;
        var messageContent;
        const {
            Settings
        } = req.app.locals.models;
        if (req.body.printObj) {
            return Settings.findAll({
                where: {
                    clusterName: Pricing.Printer
                },
                attributes: ['key', 'values', 'clusterName']
                // eslint-disable-next-line consistent-return
            }).then((printList) => {
                if (printList && printList.length > 0) {
                    const host = _.find(printList, print => print.key === Pricing.BartenderServer);
                    port = _.find(printList, print => print.key === Pricing.BartenderServerPort);
                    if (port.values && isNaN(port.values)) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.INVALID_PORT);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: null
                        });
                    }
                    const reqName = req.body.printObj.reqName === 'Print' ? 'Print' : 'Web Service';
                    const labelTemplateName = req.body.printObj.ServiceName;
                    let printObj = JSON.stringify({
                        uid: req.body.printObj.uid,
                        PIDCode: req.body.printObj.PIDCode,
                        dateCode: req.body.printObj.dateCode,
                        priceCategoryID: req.body.printObj.priceCategoryID,
                        mfgPNDescription: req.body.printObj.mfgPNDescription,
                        rohs: req.body.printObj.rohs,
                        printerName: req.body.printObj.printType === 'Print' ? req.body.printObj.PrinterName : 'PDF Creator',
                        expireDate: req.body.printObj.dateofExpire,
                        customerConsign: req.body.printObj.customerConsign
                    });

                    if (req.body.printObj.pageName === DATA_CONSTANT.PRINT_BARCODE_PAGE_NAME.ReceivingMaterial) {
                        printObj = JSON.stringify({
                            uid: req.body.printObj.uid ? req.body.printObj.uid.substring(0, 14) : null,
                            COFC: req.body.printObj.COFC,
                            packaging: req.body.printObj.packaging,
                            lotCode: req.body.printObj.lotCode,
                            mslLevel: req.body.printObj.mslLevel ? req.body.printObj.mslLevel.substring(0, 3) : null,
                            PIDCode: req.body.printObj.PIDCode ? req.body.printObj.PIDCode.substring(0, 30) : null,
                            dateCode: req.body.printObj.dateCode ? req.body.printObj.dateCode.substring(0, 4) : null,
                            priceCategoryID: req.body.printObj.priceCategoryID ? req.body.printObj.priceCategoryID.substring(0, 5) : null,
                            mfgPNDescription: req.body.printObj.mfgPNDescription ? req.body.printObj.mfgPNDescription.substring(0, 68) : null,
                            rohs: req.body.printObj.rohs ? req.body.printObj.rohs.substring(0, 4) : null,
                            printerName: req.body.printObj.printType === 'Print' ? req.body.printObj.PrinterName : 'PDF Creator',
                            expireDate: req.body.printObj.dateofExpire,
                            customerConsign: req.body.printObj.customerConsign,
                            mountingType: req.body.printObj.mountingType ? req.body.printObj.mountingType.substring(0, 9) : null,
                            partPackage: req.body.printObj.partPackage ? req.body.printObj.partPackage.substring(0, 16) : null,
                            userCode: req.body.printObj.createdUserCode
                        });
                    }

                    if (req.body.printObj.pageName === DATA_CONSTANT.PRINT_BARCODE_PAGE_NAME.Warehouse) {
                        printObj = JSON.stringify({
                            whName: req.body.printObj.warehouseName,
                            printerName: req.body.printObj.printType === 'Print' ? req.body.printObj.PrinterName : 'PDF Creator'
                        });
                    }

                    if (req.body.printObj.pageName === DATA_CONSTANT.PRINT_BARCODE_PAGE_NAME.Bin) {
                        printObj = JSON.stringify({
                            binName: req.body.printObj.binName,
                            printerName: req.body.printObj.printType === 'Print' ? req.body.printObj.PrinterName : 'PDF Creator'
                        });
                    }

                    const extServerOptions = {
                        host: host.values,
                        port: port.values,
                        path: `/Integration/${req.body.printObj.ServiceName.replace(/ /g, '')}/Execute`,
                        method: reqName === 'Print' ? 'POST' : 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': printObj.length
                        }
                    };

                    if (reqName === 'Print') {
                        const reqPost = http.request(extServerOptions, (ress) => {
                            ress.on('data', (data) => {
                                process.stdout.write(data);
                            });
                        });
                        reqPost.write(printObj);

                        // eslint-disable-next-line consistent-return
                        reqPost.on('error', (e) => {
                            if (e.code === ECONNREFUSED) { // Incase of bartender is not installed or service not started
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.CONNECTION_REFUSED);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: null,
                                    err: null,
                                    data: messageContent
                                });
                            } else if (e.code === ETIMEDOUT || e.code === ENOTFOUND) { // Incase of invalid/wrong IP
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.INVALID_IP);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: null,
                                    err: null,
                                    data: messageContent
                                });
                            }
                            count += 1;
                            if (count === 1) {
                                console.trace();
                                console.error(e);
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.PRINT_JOB_ERROR);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: null,
                                    err: null,
                                    data: messageContent
                                });
                            }
                        });
                        reqPost.end(() => {
                            count += 1;
                            if (req.body.printObj.count === count) {
                                count = 0;
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.PRINT_JOB_SUCCESS);
                                return resHandler.successRes(res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                    STATE.SUCCESS, null,
                                    messageContent);
                            } else {
                                return resHandler.successRes(res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                    STATE.SUCCESS, null, null
                                );
                            }
                        });
                    } else if (reqName === 'Web Service') {
                        const reqGet = http.request(extServerOptions, (ress) => {
                            const resStatusCode = {
                                StatusCode: ress ? ress.statusCode : null
                            };
                            if (resStatusCode.StatusCode === '200') {
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.WEBSERVICE_CHECK_SUCCESS);
                                messageContent.message = COMMON.stringFormat(messageContent.message, labelTemplateName);
                                messageContent.displayDialog = true;
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resStatusCode, messageContent);
                            } else if (resStatusCode.StatusCode === '404') {
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.INVALID_PRINT_LABEL);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: messageContent,
                                    err: null,
                                    data: resStatusCode
                                });
                            } else {
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.WEBSERVICE_CHECK_INFO);
                                messageContent.message = COMMON.stringFormat(messageContent.message, labelTemplateName);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: messageContent,
                                    err: null,
                                    data: resStatusCode
                                });
                            }
                        });
                        reqGet.on('error', (err) => {
                            const labelModuleName = 'Label format';
                            if (err.code === ECONNREFUSED) {
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.CONNECTION_REFUSED);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: messageContent,
                                    err: null,
                                    data: null
                                });
                            } else if (err.code === ETIMEDOUT || err.code === ENOTFOUND) {
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.INVALID_IP);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: messageContent,
                                    err: null,
                                    data: null
                                });
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.NOT_FOUND(labelModuleName),
                                err: null,
                                data: null
                            });
                        });
                        reqGet.end();
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                            err: null,
                            data: null
                        });
                    }
                } else {
                    // Need to set message then configuration for bartender required in setting -> Datakey
                    // This will be take care by Fenil
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.code === ERR_SOCKET_BAD_PORT) {
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BAD_PORT);
                    messageContent.message = COMMON.stringFormat(messageContent.message, port.values);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
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

    // get msl detail for component
    // POST : /api/v1/getComponentMslDetail
    // @return msl detail
    getComponentMslDetail: (req, res) => {
        const {
            Component,
            ComponentSidStock,
            ComponentMSLMst
        } = req.app.locals.models;
        if (req.params.id) {
            return ComponentSidStock.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'uid', 'scanlabel', 'isinStk'],
                include: [{
                    model: Component,
                    as: 'component',
                    attributes: ['id', 'mfgcodeID', 'mfgPN', 'mslID'],
                    required: false,
                    include: [{
                        model: ComponentMSLMst,
                        as: 'component_mslmst',
                        attributes: ['id', 'levelRating', 'time'],
                        required: false
                    }]
                }]
            }).then((data) => {
                if (!data) {
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                        err: null,
                        data: null
                    }
                    );
                }
                return resHandler.successRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS,
                    data,
                    null
                );
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // Get List of UID
    // GET : /api/v1/componentsidstock/getUIDList
    // @return UId
    getUIDList: (req, res) => {
        const {
            ComponentSidStock
        } = req.app.locals.models;
        ComponentSidStock.findAll({
            attributes: ['id', 'uid', 'stockInventoryType', 'receiveMaterialType', 'binid'],
            where: {
                isDeleted: false
            }
        }).then(response => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS,
            response,
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            }
            );
        });
    },

    // Get verified label
    // GET : /api/v1/componentsidstock/getVerifiedLabel
    // @return verified label
    getVerifiedLabel: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const componentStock = req.body.objComponentStock;
            return sequelize.query('CALL Sproc_verify_UID (:pVerificationType, :pUID,:pScanMFGPNLabel,:pScanPID,:pScanCPN, :pScanUID, :pScanMFGPN, :pCreatedBy, :pMFRId, :pBarcodeId)', {
                replacements: {
                    pVerificationType: componentStock.verificationType,
                    pUID: componentStock.uid,
                    pScanMFGPNLabel: componentStock.scanMFGPNLabel,
                    pScanPID: componentStock.scanPID,
                    pScanCPN: componentStock.scanCPN,
                    pScanUID: componentStock.scanUID,
                    pScanMFGPN: componentStock.scanMFGPN,
                    pCreatedBy: req.user.id,
                    pMFRId: componentStock.mfgId || 0,
                    pBarcodeId: componentStock.barcodeId || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (_.isEmpty(response[0])) {
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.FAILED, {
                        messageContent: null,
                        err: null,
                        data: null
                    }
                    );
                }
                return resHandler.successRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    verifyResult: response[0],
                    labelResult: response[1]
                },
                    null
                );
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // // Transfer stock
    // // GET : /api/v1/componentsidstock/transferstock
    // // @return transfer stock to another location
    // transferstock: (req, res) => {
    //     if (req.body) {
    //         let transferLocation = req.body.transferLocation;
    //         var objRef = {
    //             refsidid: transferLocation.id,
    //             userID: req.user.id,
    //             location: transferLocation.location,
    //             availableQty: transferLocation.availableQty,
    //             woID: transferLocation.woID,
    //         }
    //         req.objLocation = objRef;
    //         module.exports.updateSidLocation(req, res);
    //         return resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.RECEIVEMATERIAL.STOCK_TRANSFER);
    //     } else {
    //         return resHandler.errorRes(res,
    //             200,
    //             STATE.FAILED,
    //             new InvalidPerameter(REQUEST.INVALID_PARAMETER));
    //     }
    // },

    // get all printer list
    // POST : /api/v1/componentsidstock/getPrinterList
    // @return get all printer list from network
    getPrinterList: (req, res) => {
        // eslint-disable-next-line global-require
        var Printer = require('printer');
        var Printers = Printer.getPrinter(); // only get installed physical printer
        var AllPrinters = Printer.getPrinters(); // get all printer list which shows on CTRL+P
        var print = {
            PhysicalPrinter: Printers,
            AllPrinters: AllPrinters
        };
        return resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
            print,
            null
        );
    },

    // get mfgcode on cutomer
    // POST : /api/v1/getMFGCodeOnCustomer
    // @return msl detail
    getMFGCodeOnCustomer: (req, res) => {
        const {
            MfgCodeMst
        } = req.app.locals.models;
        if (req.params.id) {
            return MfgCodeMst.findAll({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'mfgCode', 'mfgName', 'customerID']
            }).then((data) => {
                if (!data) {
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                        err: null,
                        data: null
                    }
                    );
                }
                return resHandler.successRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS,
                    data,
                    null
                );
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // get prefix and uid for component sid stock for cpn
    /* GetBarcodeUIDForCPN: (req, prefix) => {
        const {
            sequelize
        } = req.app.locals.models;
        var obj = {};
        if (prefix) {
            return sequelize
                .query('CALL Sproc_GetBarcodeUIDForCPN (:pPrifix)', {
                    replacements: {
                        pPrifix: prefix
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    if (response[0][0].pNewUID) {
                        obj.pUID = response[0][0].pNewUID;
                        obj.pPrifix = response[0][0].pFinalPrefix;
                        return obj;
                    } else {
                        return obj;
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return obj;
                });
        } else {
            return obj;
        }
    },*/

    // Get List of Components And TemplateDelimiter
    // GET : /api/v1/componentsidstock/getComponentWithTemplateDelimiter
    // @param {id} int
    // @param {mfgid} int
    // @return List of Components
    getComponentWithTemplateDelimiter: (req, res) => {
        const {
            Component,
            BRLabelTemplate,
            BRLabelTemplateDelimiter,
            DataElement,
            sequelize,
            RFQMountingType,
            RFQRoHS,
            ComponentMSLMst,
            ComponentCustAliasRevPN,
            UOMs,
            ComponentPackagingMst,
            ComponentLogicalgroupDetail,
            MfgCodeMst,
            DateCodeFormatMst,
            RFQPackageCaseType
        } = req.app.locals.models;
        if (req.params.id) {
            Component.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                model: Component,
                attributes: ['id', 'mfgcodeID', 'mfgPN', 'PIDCode', 'mfgPNDescription', 'RoHSStatusID', 'costCategoryID', 'pcbPerArray', 'minimum', 'selfLifeDays', 'shelfLifeAcceptanceDays', 'maxShelfLifeAcceptanceDays', 'category', 'uom', 'shelfListDaysThresholdPercentage', 'maxShelfListDaysThresholdPercentage', 'packageQty', 'unit', 'packagingID', 'isCPN', 'restrictUsePermanently', 'restrictUSEwithpermission', 'restrictPackagingUsePermanently', 'restrictPackagingUseWithpermission', 'price', 'partPackage', 'category', 'partType', 'umidSPQ'],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    attributes: ['id', 'mfgCode', 'mfgName'],
                    required: false,
                    include: [{
                        model: DateCodeFormatMst,
                        as: 'dateCodeFormatMst',
                        attributes: ['id', 'dateCodeFormat']
                    }]
                },
                {
                    model: RFQMountingType,
                    as: 'rfqMountingType',
                    attributes: ['id', 'name', 'hasLimitedShelfLife'],
                    required: false,
                    include: [{
                        model: ComponentLogicalgroupDetail,
                        as: 'componentLogicalgroupDetail',
                        where: {
                            logicalgroupID: -4,
                            isDeleted: false
                        },
                        attributes: ['id', 'rfqMountingTypeID'],
                        required: false
                    }]
                },
                {
                    model: RFQRoHS,
                    as: 'rfq_rohsmst',
                    attributes: ['id', 'name', 'rohsIcon'],
                    required: false
                },
                {
                    model: ComponentMSLMst,
                    as: 'component_mslmst',
                    attributes: ['id', 'levelRating', 'time'],
                    required: false
                },
                {
                    model: ComponentCustAliasRevPN,
                    as: 'ComponentCustAliasRevPart',
                    attributes: ['id', 'refComponentID', 'refCPNPartID'],
                    required: false
                },
                {
                    model: UOMs,
                    as: 'UOMs',
                    attributes: ['id', 'unitName', 'measurementTypeID'],
                    required: false
                },
                {
                    model: ComponentPackagingMst,
                    as: 'component_packagingmst',
                    attributes: ['id', 'name', 'sourceName'],
                    required: false
                },
                {
                    model: RFQPackageCaseType,
                    as: 'rfq_packagecasetypemst',
                    attributes: ['id', 'name'],
                    required: false
                }
                ]
            }).then((component) => {
                if (!component) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                        err: null,
                        data: null
                    });
                }
                const ComponentList = [];
                ComponentList.push(component);

                if (req.params.mfgid) {
                    return BRLabelTemplate.findAll({
                        where: {
                            mfgcodeid: req.params.mfgid,
                            status: 1,
                            barcodeType: 1,
                            isDeleted: false
                        },
                        model: BRLabelTemplate,
                        attributes: ['id', 'name', 'barcodeType', 'mfgcodeid'],
                        include: [{
                            model: BRLabelTemplateDelimiter,
                            as: 'barcodeDelimiter',
                            where: {
                                fieldType: 1,
                                isDeleted: false
                            },
                            attributes: ['id', 'refbrID', 'delimiter', 'length', 'dataElementId', 'notes', 'dataTypeID', 'fieldType', 'displayOrder'],
                            required: false,
                            include: [{
                                model: DataElement,
                                as: 'dataelement',
                                where: {
                                    isDeleted: false
                                },
                                attributes: ['dataElementID', 'dataElementName'],
                                required: false
                            }]
                        }]
                    }).then((delimiter) => {
                        ComponentList.push(delimiter);
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS,
                            ComponentList,
                            null
                        );
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        }
                        );
                    });
                } else {
                    return resHandler.successRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS,
                        ComponentList,
                        null
                    );
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
            });
        } else {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            sequelize.query('CALL Sproc_GetComponentList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pIsMFG)', {
                replacements: {
                    ppageIndex: req.query.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pIsMFG: req.query.isMFG === 'true' ? true : false
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                components: _.values(response[1]),
                Count: response[0][0]['COUNT(*)']
            },
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
            });
        }
    },

    // Save unlock verification screen detail
    // POST : /api/v1/componentsidstock/saveUnlockVerificationDetail
    saveUnlockVerificationDetail: (req, res) => {
        const {
            UIDVerificationHistory,
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.transaction(t => (
                UIDVerificationHistory.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: ['unlockUserID', 'unLockNotes', 'updatedBy']
                }, {
                    transaction: t
                })
            )).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // Update component sid stock for remove stock from reserve stock
    // POST : /api/v1/componentsidstock/RemoveFromReserveStock
    RemoveFromReserveStock: (req, res) => {
        const {
            ComponentSidStock,
            sequelize
        } = req.app.locals.models;
        if (req.body.selectedRow && req.body.selectedRow.length > 0) {
            const promises = [];
            return sequelize.transaction().then((t) => {
                _.forEach(req.body.selectedRow, (data) => {
                    if (req.user) {
                        data.customerID = null;
                        data.assyID = null;
                        data.nickName = null;
                        data.receiveMaterialType = DATA_CONSTANT.COMPONENT_SID_STOCK.TypeReceivePartToStockCode;
                        data.updatedBy = req.user.id;
                        data.updateByRoleId = req.user.defaultLoginRoleID;
                        data.isReservedStock = false;
                    }

                    promises.push(
                        ComponentSidStock.update(data, {
                            where: {
                                id: data.id
                            },
                            fields: ['customerID', 'assyID', 'nickName', 'receiveMaterialType', 'updatedBy', 'updateByRoleId', 'isReservedStock'],
                            paranoid: false,
                            transaction: t
                        })
                    );
                });

                Promise.all(promises).then(() => {
                    t.commit();
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName));
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
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Update component sid stock for add stock from reserve stock
    // POST : /api/v1/componentsidstock/AddInReserveStock
    AddInReserveStock: (req, res) => {
        const {
            ComponentSidStock,
            sequelize
        } = req.app.locals.models;
        if (req.body.selectedRow && req.body.selectedRow.length > 0) {
            const promises = [];
            return sequelize.transaction().then((t) => {
                _.forEach(req.body.selectedRow, (data) => {
                    if (req.user) {
                        data.receiveMaterialType = DATA_CONSTANT.COMPONENT_SID_STOCK.TypeReceivePartToStockCode;
                        data.updatedBy = req.user.id;
                        data.updateByRoleId = req.user.updateByRoleId;
                        data.isReservedStock = true;
                    }

                    promises.push(
                        ComponentSidStock.update(data, {
                            where: {
                                id: data.id
                            },
                            fields: ['customerID', 'assyID', 'nickName', 'receiveMaterialType', 'updatedBy', 'updateByRoleId', 'isReservedStock'],
                            paranoid: false,
                            transaction: t
                        })
                    );
                });

                Promise.all(promises).then(() => {
                    t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName)));
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
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get List of PO_SO_Assembly on view
    // GET : /api/v1/componentsidstock/get_PO_SO_Assembly_List
    get_PO_SO_Assembly_List: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetPOSOAssemblyList (:pExcludeCanceled,:pSalesOrderDetailID,:pSearch)', {
            replacements: {
                pExcludeCanceled: req.body.excludeCanceled && JSON.parse(req.body.excludeCanceled) ? 0 : 1,
                pSalesOrderDetailID: req.body.salesOrderDetailID ? req.body.salesOrderDetailID : null,
                pSearch: req.body.search ? req.body.search : null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)
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

    // Get List of Part Contains in Bom
    // GET : /api/v1/componentsidstock/get_RFQ_BOMPart_List
    get_RFQ_BOMPart_List: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        let BOMPartList = [];
        if (req.params) {
            return sequelize.query('CALL Sproc_GetBOMPartAndPackagingAliasByAssembly (:pPartID, :pSalesOrderDetailId)', {
                replacements: {
                    pPartID: req.params.id,
                    pSalesOrderDetailId: req.params.sodid
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response[0]) {
                    BOMPartList = response[0];
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, BOMPartList, null);
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

    // Get List of uid in allocated kit
    // GET : /api/v1/componentsidstock/getAllocatedKitByUID
    getAllocatedKitByUID: (req, res) => {
        const {
            KitAllocation,
            Component,
            MfgCodeMst,
            SalesOrderDet,
            SalesOrderMst,
            UOMs,
            RFQRoHS,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return KitAllocation.findAll({
                where: {
                    refUIDId: req.body.id,
                    status: DATA_CONSTANT.KIT_ALLOCATION.Status.Allocate
                },
                model: KitAllocation,
                attributes: ['id', 'refSalesOrderDetID', 'assyID', 'uid', 'refUIDId', 'allocatedQty', 'status', 'allocatedUnit', 'allocatedUOM', [sequelize.fn('SUM', sequelize.col('allocatedUnit')), 'totalAllocatedUnit'],
                    [sequelize.fn('SUM', sequelize.col('allocatedQty')), 'totalAllocatedQty']
                ],
                paranoid: false,
                group: ['id', 'refSalesOrderDetID', 'assyID', 'uid', 'refUIDId', 'allocatedQty', 'status', 'allocatedUnit', 'allocatedUOM'],
                include: [{
                    model: UOMs,
                    as: 'AllocatedUOM',
                    attributes: ['id', 'unitName', 'measurementTypeID'],
                    required: false
                },
                {
                    model: SalesOrderDet,
                    as: 'salesorderdetatil',
                    attributes: ['id', 'refSalesOrderID', 'partID', 'mrpQty', 'kitQty'],
                    required: false,
                    include: [{
                        model: SalesOrderMst,
                        as: 'salesOrderMst',
                        attributes: ['id', 'salesOrderNumber', 'poNumber'],
                        required: false
                    }]
                },
                {
                    model: Component,
                    as: 'AssemblyDetail',
                    attributes: ['id', 'mfgcodeID', 'mfgPN', 'PIDCode', 'nickName', 'isCustom'],
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
                }
                ]
            }).then(KitList => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS,
                KitList,
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // Get List of uid on UID
    // GET : /api/v1/componentsidstock/get_Component_Sid_ByUID
    get_Component_Sid_ByUID: (req, res) => {
        const {
            ComponentSidStock,
            BinMst,
            WarehouseMst,
            Component,
            MfgCodeMst,
            RFQRoHS,
            ComponentPackagingMst,
            RFQMountingType,
            RFQPackageCaseType,
            UOMs,
            MeasurementType,
            ComponentSidStockPackingDetail,
            sequelize
        } = req.app.locals.models;
        if (req.params) {
            return ComponentSidStock.findOne({
                where: {
                    uid: req.params.id,
                    isDeleted: false
                },
                model: ComponentSidStock,
                attributes: ['id', 'uid', 'binID', 'orgqty', 'pkgQty', 'orgPkgUnit', 'pkgUnit', 'spq', 'uom', 'dateCode', 'packaging', 'stockInventoryType', 'customerConsign', 'customerID', 'prefix', 'fromUIDId', 'fromUID', 'parentUIDId', 'parentUID', 'woID'],
                paranoid: false,
                include: [
                    {
                        model: ComponentSidStockPackingDetail,
                        as: 'componentSidStockPackingDetail',
                        attributes: ['id', 'refComponentSidStockID', 'refPackingSlipDetailID']
                    },
                    {
                        model: BinMst,
                        as: 'binMst',
                        attributes: ['id', 'Name', 'WarehouseID'],
                        required: true,
                        include: [{
                            model: WarehouseMst,
                            as: 'warehousemst',
                            attributes: ['id', 'Name', 'parentWHID', 'warehouseType'],
                            required: false,
                            include: [{
                                model: WarehouseMst,
                                as: 'parentWarehouseMst',
                                attributes: ['id', 'Name'],
                                required: true
                            }]
                        }]
                    },
                    {
                        model: Component,
                        as: 'component',
                        attributes: ['id', 'mfgcodeID', 'mfgPN', 'PIDCode', 'RoHSStatusID', 'unit', 'minimum', 'mfgPNDescription', 'documentPath', 'imageURL', 'partPackage'],
                        include: [{
                            model: MfgCodeMst,
                            as: 'mfgCodemst',
                            attributes: ['id', 'mfgName', 'mfgType', 'mfgCode'],
                            require: true
                        },
                        {
                            model: RFQRoHS,
                            as: 'rfq_rohsmst',
                            attributes: ['id', 'name', 'rohsIcon'],
                            require: true
                        },
                        {
                            model: RFQMountingType,
                            as: 'rfqMountingType',
                            attributes: ['id', 'name'],
                            require: true
                        },
                        {
                            model: RFQPackageCaseType,
                            as: 'rfq_packagecasetypemst',
                            attributes: ['id', 'name']
                        },
                        {
                            model: UOMs,
                            as: 'UOMs',
                            attributes: ['id', 'unitName'],
                            required: true,
                            include: [{
                                model: MeasurementType,
                                as: 'measurementType',
                                attributes: ['id', 'name'],
                                required: true
                            }]
                        }]
                    },
                    {
                        model: ComponentPackagingMst,
                        as: 'packagingmst',
                        attributes: ['id', 'name', 'sourceName']
                    }
                ]
            }).then(UID => sequelize.query('select fun_getUMIDActiveFeederCount(:pUMIDId)', {
                replacements: {
                    pUMIDId: UID ? UID.id : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((inFeederCnt) => {
                if (UID) {
                    _.values(UID)[0].inFeederCnt = inFeederCnt ? _.values(inFeederCnt[0])[0] : 0;
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, UID, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // Get Information of warehouse-bin
    // GET : /api/v1/componentsidstock/match_Warehouse_Bin
    match_Warehouse_Bin: (req, res) => {
        const {
            BinMst,
            WarehouseMst,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            return sequelize.transaction().then((t) => {
                promises.push(BinMst.findOne({
                    where: {
                        Name: req.body.name,
                        deletedAt: null
                    },
                    model: BinMst,
                    attributes: ['id', 'Name', 'WarehouseID'],
                    paranoid: false,
                    transaction: t,
                    include: [{
                        model: WarehouseMst,
                        as: 'warehousemst',
                        attributes: ['id', 'Name', 'parentWHID', 'refEqpID', 'warehouseType'],
                        required: false,
                        include: [{
                            model: WarehouseMst,
                            as: 'parentWarehouseMst',
                            attributes: ['id', 'Name'],
                            required: false
                        }]
                    }]
                }));

                promises.push(WarehouseMst.findOne({
                    where: {
                        [Op.or]: [{
                            Name: req.body.name
                        },
                        {
                            leftSideWHLabel: req.body.name
                        },
                        {
                            rightSideWHLabel: req.body.name
                        }
                        ],
                        deletedAt: null
                    },
                    model: WarehouseMst,
                    attributes: ['id', 'Name', 'cartMfr', 'warehouseType', 'isCartOnline', 'uniqueCartID', 'rightSideWHLabel', 'leftSideWHLabel', 'parentWHID', 'leftSideWHRows', 'rightSideWHRows'],
                    paranoid: false,
                    transaction: t,
                    include: [{
                        model: WarehouseMst,
                        as: 'parentWarehouseMst',
                        attributes: ['id', 'Name'],
                        required: false
                    }]
                }));

                // eslint-disable-next-line consistent-return
                Promise.all(promises).then((resp) => {
                    t.commit();
                    let binWarehouseData = null;
                    if (resp && (resp[0] || resp[1])) {
                        binWarehouseData = resp[0] ? resp[0] : resp[1];
                        if (binWarehouseData.WarehouseID) {
                            if (binWarehouseData.warehousemst.refEqpID) {
                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.EQUIPMENT_NOT_SCAN);
                                messageContent.message = COMMON.stringFormat(messageContent.message, 'Bin');
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    responseMessage: messageContent
                                }, null);
                            } else if (!req.body.confirmUnAllocatedUMIDValidation) {
                                if (req.body.fromDeptID && req.body.fromDeptID !== binWarehouseData.warehousemst.parentWHID) {
                                    module.exports.unallocatedUMIDValidation(req, binWarehouseData, res);
                                } else {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, binWarehouseData, null);
                                }
                            } else {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, binWarehouseData, null);
                            }
                        } else if (!req.body.confirmUnAllocatedUMIDValidation) {
                            if (req.body.fromDeptID && req.body.fromDeptID !== binWarehouseData.parentWHID) {
                                if (binWarehouseData.warehouseType === DATA_CONSTANT.warehouseType.SmartCart.key) {
                                    module.exports.unallocatedUMIDValidation(req, binWarehouseData, res);
                                } else {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, binWarehouseData, null);
                                }
                            } else {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, binWarehouseData, null);
                            }
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, binWarehouseData, null);
                        }
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    unallocatedUMIDValidation: (req, binWarehouseData, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('Select fun_checkForUnallocatedUMID(:prefUIDId)', {
                replacements: {
                    prefUIDId: req.body.umidId
                },
                type: sequelize.QueryTypes.SELECT
            }).then((umidResponse) => {
                const allowToTransfer = _.values(umidResponse[0])[0];
                const toDepatName = binWarehouseData.warehousemst && binWarehouseData.warehousemst.parentWarehouseMst ? binWarehouseData.warehousemst.parentWarehouseMst.Name : binWarehouseData.parentWarehouseMst.Name;
                if (allowToTransfer) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, binWarehouseData, null);
                } else {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.TRANSFER_UNALLOCATED_UMID_WITH_PASSWORD_CONFIRMATION);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.umidName, req.body.fromDeptName, toDepatName);
                    messageContent.validationType = 'UNALLOCATEUMID';
                    return resHandler.successRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS, {
                        responseMessage: messageContent,
                        err: null,
                        data: null
                    }
                    );
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Check Assembly have Bom
    // GET : /api/v1/componentsidstock/checkAssemblyHasBom
    checkAssemblyHasBom: (req, res) => {
        const {
            RFQLineItems
        } = req.app.locals.models;
        if (req.params) {
            return RFQLineItems.findAll({
                where: {
                    partID: req.params.id
                },
                model: RFQLineItems,
                attributes: ['id', 'partID'],
                paranoid: false
            }).then((resp) => {
                if (resp && resp.length > 0) {
                    return resHandler.successRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS,
                        resp,
                        null
                    );
                } else {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.BOM_NOT_FOUND);
                    return resHandler.successRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    },
                        null
                    );
                    // return resHandler.successRes(res, 200, STATE.SUCCESS, MESSAGE_CONSTANT.STATICMSG(MESSAGE_CONSTANT.COMPONENT_SID_STOCK.BOM_NOT_FOUND));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get Multiple Barcode List
    // GET : /api/v1/componentsidstock/get_Multiple_Barcode_List
    get_Multiple_Barcode_List: (req, res) => {
        const {
            BRLabelTemplate,
            MfgCodeMst
        } = req.app.locals.models;
        if (req.params) {
            const barcodeList = [];
            let splitBarcodeId = [];
            splitBarcodeId = req.params.ids.split(',');

            const promises = [];
            _.forEach(splitBarcodeId, (data) => {
                promises.push(
                    BRLabelTemplate.findOne({
                        where: {
                            id: data
                        },
                        model: BRLabelTemplate,
                        attributes: ['id', 'name', 'Samplereaddata', 'mfgcodeid', 'barcodeType', 'description'],
                        include: [{
                            model: MfgCodeMst,
                            as: 'mfgCodeDetail',
                            attributes: ['id', 'mfgCode', 'mfgName'],
                            required: false
                        }]
                    })
                );
            });

            return Promise.all(promises).then((resp) => {
                _.each(resp, (data) => {
                    barcodeList.push(data);
                });
                return resHandler.successRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS,
                    barcodeList,
                    null
                );
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // UPdate transfer detail
    // POST : /api/v1/updateTransferDetail
    // @return update transfer detail
    updateTransferDetail: (req, res) => {
        const {
            ComponentSidStock
        } = req.app.locals.models;

        if (req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            return ComponentSidStock.update(req.body, {
                where: {
                    id: req.body.id
                },
                fields: ['binID', 'pkgQty', 'updatedBy'],
                paranoid: false
            }).then(response => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                materialList: response
            },
                MESSAGE_CONSTANT.UPDATED(DATA_CONSTANT.COMPONENT_SID_STOCK.TransferStock)
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // Get List of Sub Assembly
    // GET : /api/v1/componentsidstock/getSubAssemblyOnAssembly
    getSubAssemblyOnAssembly: (req, res) => {
        const {
            Component,
            PartSubAssyRelationship
        } = req.app.locals.models;

        if (req.params && req.params.id) {
            return PartSubAssyRelationship.findAll({
                where: {
                    partID: req.params.id
                },
                model: PartSubAssyRelationship,
                attributes: ['prPerPartID']
            }).then((asseblyList) => {
                if (asseblyList.length > 0) {
                    const assyIds = _.map(asseblyList, data => data.prPerPartID);
                    return Component.findAll({
                        where: {
                            id: {
                                [Op.in]: assyIds
                            }
                        },
                        model: PartSubAssyRelationship,
                        attributes: ['id', 'PIDCode', 'nickName']
                    }).then(subAsseblyList => resHandler.successRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS,
                        subAsseblyList,
                        null
                    )).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        }
                        );
                    });
                } else {
                    return resHandler.successRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS,
                        asseblyList,
                        null
                    );
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // Retrive list of Non UMID Stock List
    // GET : /api/v1/componentsidstock/getNonUMIDStockList
    // @return list of Non UMID Stock List
    getNonUMIDStockList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        const mfgWhere = req.body.scanMPNPID ? req.body.scanMPNPID.replace(/'/g, '""') : null;
        sequelize.query('CALL Sproc_RetrieveNonUMIDStockList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pWHId,:pBinId,:pMfgCodeIds,:pReceivedStatus,:pIsMPNExactSearch,:pIsBinExactSearch,:pIsPackingSlipExactSearch,:pScanMPNPID,:pScanBinWareHouse,:pPackingSlip,:pPackingSlipFromDate,:pPackingSlipToDate)', {
            replacements: {
                pPageIndex: req.body.page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pWHId: req.body.whId || null,
                pBinId: req.body.binId || null,
                pMfgCodeIds: req.body.supplierIds || null,
                pReceivedStatus: req.body.receivedFilterStatus || null,
                pIsMPNExactSearch: req.body.isMPNExactSearch || false,
                pIsBinExactSearch: req.body.isBinExactSearch || false,
                pIsPackingSlipExactSearch: req.body.isPackingSlipExactSearch || false,
                pScanMPNPID: mfgWhere,
                pScanBinWareHouse: req.body.binWarehouse || null,
                pPackingSlip: req.body.packingSlip || null,
                pPackingSlipFromDate: req.body.packingSlipFromDate || null,
                pPackingSlipToDate: req.body.packingSlipToDate || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
            stockList: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        },
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            }
            );
        });
    },

    // Update initial quantity of UMID
    // POST : /api/v1/componentsidstock/updateInitialQty
    updateInitialQty: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);

            return sequelize.query('CALL Sproc_update_UMID_initial_count(:pId, :pOrgQty, :pOrgPkgUnit, :pUpdatedBy, :pInitialQtyChangeRemark)', {
                replacements: {
                    pId: req.body.id || null,
                    pOrgQty: req.body.orgQty || null,
                    pOrgPkgUnit: req.body.orgPkgUnit || null,
                    pUpdatedBy: req.body.updatedBy || null,
                    pInitialQtyChangeRemark: req.body.initialQtyChangeRemark || null
                }
            }).then((response) => {
                const errorResData = _.first(response);
                if (errorResData) {
                    if (errorResData.errorCode === 1) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PS_POSTING_STATUS_NOT_ALLOW_CHANGE_INITALQTY);
                        messageContent.message = COMMON.stringFormat(messageContent.message, errorResData.uid, errorResData.packingSlipNumber);
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            messageContent: messageContent,
                            err: null,
                            data: null,
                            messageTypeCode: 1
                        },
                            null
                        );
                    } else {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.BIN_NOT_HAVE_STOCK);
                        messageContent.message = COMMON.stringFormat(messageContent.message, errorResData.binName, errorResData.PIDCode, errorResData.BalanceQty, errorResData.newOrgQty);
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            messageContent: messageContent,
                            err: null,
                            data: null,
                            messageTypeCode: 2
                        },
                            null
                        );
                    }
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED('Initial quantity'));
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

    // Retrive detail of UMID by UMID
    // POST : /api/v1/componentsidstock/getUMIDDetailByUMID
    // @return detail of UMID by UMID
    getUMIDDetailByUMID: (req, res) => {
        const {
            ComponentSidStock,
            BinMst,
            WarehouseMst,
            Component,
            MfgCodeMst,
            RFQRoHS
        } = req.app.locals.models;
        ComponentSidStock.findOne({
            where: {
                uid: req.body.UMID,
                deletedAt: null
            },
            attributes: ['id', 'uid', 'pkgQty', 'binID', 'isUMIDRestrict', 'stockInventoryType', 'receiveMaterialType'],
            required: false,
            include: [{
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
            },
            {
                model: Component,
                as: 'component',
                attributes: ['id', 'mfgcodeID', 'mfgPN', 'PIDCode', 'mfgPNDescription', 'RoHSStatusID', 'costCategoryID', 'pcbPerArray', 'minimum', 'selfLifeDays', 'category', 'uom', 'shelfListDaysThresholdPercentage', 'packageQty', 'unit', 'imageURL', 'documentPath'],
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
            }
            ]
        }).then(umid => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS,
            umid,
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            }
            );
        });
    },

    // Insert Restrict UMID Detail
    // POST : /api/v1/saveRestrictUMIDDetail
    // @return Insert Restrict UMID Detail
    saveRestrictUMIDDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        let messageContent;
        if (req.body && req.body.restrictDetail && req.body.restrictDetail.refUMIDId) {
            if (req.body.restrictDetail.confirmOfKitAllocation) {
                return sequelize.transaction().then(t => sequelize.query('CALL Sproc_RestrictUMID (:pRefUIDId, :pIsUMIDRestrict, :pReasonForRestrict, :pUpdatedBy,:pRoleID)', {
                    replacements: {
                        pRefUIDId: req.body.restrictDetail.refUMIDId,
                        pIsUMIDRestrict: req.body.restrictDetail.restrictType ? 1 : 0,
                        pReasonForRestrict: req.body.restrictDetail.reasonForRestrict || null,
                        pUpdatedBy: req.user.id,
                        pRoleID: req.user.defaultLoginRoleID
                    },
                    transaction: t
                }).then(() => {
                    if (req.body.restrictDetail.restrictType) {
                        return sequelize.query('CALL Sproc_CalculateAndSaveDeallocateKit (:pKitAllocationId, :pUMIDId, :pUserId, :pDeallocateRemark)', {
                            replacements: {
                                pKitAllocationId: null,
                                pUMIDId: req.body.restrictDetail.refUMIDId,
                                pUserId: req.user.id,
                                pDeallocateRemark: COMMON.stringFormat(MESSAGE_CONSTANT.KIT_ALLOCATION.AUTO_DEALLOCAT_FROM_RESTRICT_UMID, 'Restrict UMID')
                            },
                            type: sequelize.QueryTypes.SELECT,
                            transaction: t
                        }).then(() => {
                            module.exports.GetWorkorderEmployeesByUMID(req, req.body.restrictDetail.refUMIDId).then((employees) => {
                                if (employees && employees.length > 0) {
                                    // eslint-disable-next-line global-require
                                    const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');
                                    const data = {
                                        employeeID: req.user.employeeID,
                                        senderID: req.user.employeeID,
                                        message: req.body.restrictDetail.reasonForRestrict,
                                        receiver: employees
                                        // receiver: employees.filter((x) => { return x != req.user.employeeID })
                                    };
                                    NotificationMstController.sendRestrictUMID(req, data);
                                }

                                t.commit();
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SAVE_RESTRICT_UMID);
                                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.restrictDetail.restrictType ? 'Restricted' : 'Unrestricted');
                                return resHandler.successRes(
                                    res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                    STATE.SUCCESS, {
                                    messagecode: 1
                                },
                                    messageContent
                                );
                            }).catch((err) => {
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
                        t.commit();
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SAVE_RESTRICT_UMID);
                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.restrictDetail.restrictType ? 'Restricted' : 'Unrestricted');
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            messagecode: 1
                        },
                            messageContent
                        );
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                    );
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
                return module.exports.checkUMIDUsedInFeederOrKit(req, res);
            }
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

    checkUMIDUsedInFeederOrKit: (req, res) => {
        const {
            KitAllocation,
            WorkorderTransactionUMIDDetails,
            Component,
            SalesOrderDet,
            SalesOrderMst,
            sequelize
        } = req.app.locals.models;
        let messageContent;
        if (req.body && req.body.restrictDetail && req.body.restrictDetail.refUMIDId) {
            return WorkorderTransactionUMIDDetails.findOne({
                where: {
                    refsidid: req.body.restrictDetail.refUMIDId,
                    reelStatus: 'P',
                    isDeleted: 0,
                    eqpFeederID: {
                        [Op.ne]: null
                    }
                }
            }).then((response) => {
                if (response) {
                    sequelize.query('Select fun_getFullBinNameByID(:pBinID)', {
                        replacements: {
                            pBinID: response.eqpFeederID
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then((binResponse) => {
                        response.dataValues.binFullName = _.values(binResponse[0])[0];
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.USE_IN_EQUIPMENT_RESTRICT);
                        messageContent.message = messageContent.message.replace('#BINNAME#', response.dataValues.binFullName);
                        messageContent.displayDialog = true;
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            messagecode: 2
                        },
                            messageContent
                        );
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        }
                        );
                    });
                }

                KitAllocation.findAll({
                    where: {
                        refUIDId: req.body.restrictDetail.refUMIDId,
                        status: 'A'
                    },
                    model: KitAllocation,
                    attributes: ['id', 'refSalesOrderDetID', 'refUIDId', 'uid', 'assyID'],
                    include: [{
                        model: Component,
                        as: 'AssemblyDetail',
                        attributes: ['id', 'mfgPN', 'PIDCode'],
                        require: false
                    },
                    {
                        model: SalesOrderDet,
                        as: 'salesorderdetatil',
                        attributes: ['id', 'refSalesOrderID', 'qty', 'mrpQty', 'kitQty'],
                        require: false,
                        include: [{
                            model: SalesOrderMst,
                            as: 'salesOrderMst',
                            attributes: ['id', 'salesOrderNumber', 'poNumber', 'poDate'],
                            require: false
                        }]
                    }
                    ],
                    paranoid: false
                }).then((resp) => {
                    if (resp && resp.length > 0) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.USE_IN_KIT);
                        messageContent.displayDialog = true;
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            kitList: resp,
                            messagecode: 3
                        },
                            messageContent
                        );
                    } else {
                        req.body.restrictDetail.confirmOfKitAllocation = true;
                        return module.exports.saveRestrictUMIDDetail(req, res);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                    );
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // Get list of employee by UMID
    // @param {UMID} int
    // @return list of employee
    GetWorkorderEmployeesByUMID: (req, umidID) => {
        const {
            sequelize
        } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_GetWorkorderEmployeesByUMID (:umidID)', {
                replacements: {
                    umidID: umidID
                }
            })
            .then((response) => {
                if (response) {
                    return response.map(x => x.employeeID);
                } else {
                    return [];
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return [];
            });
    },

    // Get List of Cost Category from UMID List
    // GET : /api/v1/componentsidstock/getSubAssemblyOnAssembly
    getCostCategoryFromUMID: (req, res) => {
        const {
            ComponentSidStock,
            CostCategory
        } = req.app.locals.models;

        ComponentSidStock.findAll({
            where: {
                deletedAt: null
            },
            model: ComponentSidStock,
            attributes: ['id', 'costCategoryID']
        }).then((UMIDList) => {
            if (UMIDList.length > 0) {
                const costCategoryIds = _.uniq(_.map(UMIDList, 'costCategoryID'));
                return CostCategory.findAll({
                    where: {
                        id: {
                            [Op.in]: costCategoryIds
                        },
                        deletedAt: null
                    },
                    model: CostCategory,
                    attributes: ['id', 'categoryName', 'from', 'to']
                }).then(costCategoryList => resHandler.successRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS,
                    costCategoryList,
                    null
                )).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
                        data: null
                    }
                    );
                });
            } else {
                return resHandler.successRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS,
                    null,
                    null
                );
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            }
            );
        });
    },

    // Get List of DateCode from UMID List
    // GET : /api/v1/componentsidstock/getDateCodeFromUMID
    getDateCodeFromUMID: (req, res) => {
        const {
            ComponentSidStock
        } = req.app.locals.models;

        ComponentSidStock.findAll({
            where: {
                deletedAt: null
            },
            model: ComponentSidStock,
            attributes: ['dateCode'],
            group: ['dateCode']
        }).then(UMIDList => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS,
            UMIDList,
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            }
            );
        });
    },

    // Get List of Restrict UMID History
    // POST : /api/v1/componentsidstock/restrictUMIDHistory
    // @return retrive history of Restrict UMID
    restrictUMIDHistory: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);

        // create where clause
        let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') {
            strWhere = null;
        }

        sequelize.query('CALL Sproc_RetriveRestrictUMIDHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pUMIDId)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pUMIDId: req.body.umid || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
            history: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        },
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            }
            );
        });
    },


    // Get Available color details
    // GET : /api/v1/componentsidstock/getPromptIndicatorColor
    getPromptIndicatorColor: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_getAvailablePromptIndicatorColor (:pcartMfr,:prefDepartmentID)', {
            replacements: {
                pcartMfr: req.params.pcartMfr,
                prefDepartmentID: parseInt(req.params.prefDepartmentID) ? req.params.prefDepartmentID : null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
            promptColors: _.values(response[0]),
            defaultTimeout: _.values(response[1]),
            defaultCheckinTimeOut: _.values(response[2])
        },
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            }
            );
        });
    },

    // Get Assign color list
    // GET : /api/v1/componentsidstock/getAssignColorToUsers
    getAssignColorToUsers: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetAssignColorList (:pcartMfr)', {
            replacements: {
                pcartMfr: req.params.pcartMfr
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
            assignColors: _.values(response[0]),
            defaultTimeOut: _.values(response[1]),
            defaultCheckinTimeOut: _.values(response[2]),
            serverStatus: _.values(response[3]),
            unauthorize: _.values(response[4]),
            offlinesmartcarts: _.values(response[5])
        },
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            }
            );
        });
    },

    // Get BOM Line Detail For Same MFRPN
    // POST : /api/v1/componentsidstock/getBOMLineDetailForSameMFRPN
    // @return BOM Line Detail For Same MFRPN
    getBOMLineDetailForSameMFRPN: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body.sodid && req.body.mfrPNId) {
            return sequelize.query('CALL Sproc_GetBOMLineDetailForSameMFRPN (:pMFRPNId,:pSalesOrderDetailId)', {
                replacements: {
                    pMFRPNId: req.body.mfrPNId,
                    pSalesOrderDetailId: req.body.sodid
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                lineItemList: _.values(response[0])
            },
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: null,
                    data: null
                }
                );
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

    // getNumberOfPrintsForUMID
    // POST : /api/v1/componentsidstock/getNumberOfPrintsForUMID
    // @return the total count for umid print based on msl and number of print for umid in mounting types
    getNumberOfPrintsForUMID: (req, res) => {
        const {
            Component,
            RFQMountingType
        } = req.app.locals.models;
        if (req.params.id) {
            return Component.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'mslID'],
                include: [{
                    model: RFQMountingType,
                    as: 'rfqMountingType',
                    attributes: ['id', 'numberOfPrintForUMID'],
                    required: false
                }]
            }).then((data) => {
                if (!data) {
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                        err: null,
                        data: null
                    }
                    );
                }
                return resHandler.successRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS,
                    data,
                    null
                );
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // getBartenderServerDetails
    // POST : /api/v1/componentsidstock/getBartenderServerDetails
    // @return bartender server port and ip for generic category manage for printer
    getBartenderServerDetails: (req, res) => {
        const {
            Settings
        } = req.app.locals.models;
        Settings.findAll({
            where: {
                clusterName: 'Printer'
            },
            attributes: ['id', 'key', 'values']
        }).then(response => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS,
            response,
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            }
            );
        });
    },

    // saveBartenderServerDetails
    // POST : /api/v1/componentsidstock/saveBartenderServerDetails
    // save details of bartender server ip and server port from generic category
    saveBartenderServerDetails: (req, res) => {
        const {
            Settings,
            sequelize
        } = req.app.locals.models;

        if (req.body.updateObj) {
            const promise = [];

            return sequelize.transaction().then((t) => {
                const updateObjServer = {
                    values: req.body.updateObj.BartenderServer
                };
                COMMON.setModelUpdatedByObjectFieldValue(req.user, updateObjServer);
                promise.push(
                    Settings.update(updateObjServer, {
                        where: {
                            key: 'BartenderServer'
                        },
                        paranoid: false,
                        transaction: t
                    })
                );
                const updateObjPort = {
                    values: req.body.updateObj.BartenderServerPort
                };
                COMMON.setModelUpdatedByObjectFieldValue(req.user, updateObjPort);
                promise.push(
                    Settings.update(updateObjPort, {
                        where: {
                            key: 'BartenderServerPort'
                        },
                        paranoid: false,
                        transaction: t
                    })
                );
                Promise.all(promise).then(() => {
                    t.commit();
                    return resHandler.successRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS,
                        req.body,
                        MESSAGE_CONSTANT.UPDATED(Bartender)
                    );
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                    );
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // Get UMID By Id
    // POST : /api/v1/componentsidstock/getUMIDDetailsById
    // @return Detail of UMID
    getUMIDDetailsById: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.query('CALL Sproc_GetUMIDDetailsByID(:pUIDId,:pUID)', {
                replacements: {
                    pUIDId: req.body.id || null,
                    pUID: req.body.uid || null
                }
            }).then(responseData =>
                resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    umidDetail: _.values(responseData)[0]
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

    // GetGenericCategoryByType
    // POST : /api/v1/componentsidstock/getGenericCategoryByType
    // @return Detail of Generic Category
    getGenericCategoryByType: (req, res) => {
        const {
            GenericCategory
        } = req.app.locals.models;
        if (req.body.type) {
            return GenericCategory.findAll({
                where: {
                    categoryType: req.body.type,
                    isActive: true
                },
                attributes: ['gencCategoryID', 'gencCategoryName', 'categoryType']
            }).then(data => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS,
                data,
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // Get Non UMID Count
    // POST : /api/v1/componentsidstock/getNonUMIDCount
    // @return Count of Non UMID
    getNonUMIDCount: (req, res) => {
        const {
            VUUMIDCreationPending,
            sequelize
        } = req.app.locals.models;

        VUUMIDCreationPending.findAll({
            where: {
                BalanceQty: {
                    [Op.gt]: 0
                }
            },
            model: VUUMIDCreationPending,
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('VUUMIDCreationPending.PartId')), 'CountNonUMID']
            ],
            required: false
        }).then(responce => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS,
            responce,
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            }
            );
        });
    },

    // getCofcDocumentDetails
    // POST : /api/v1/componentsidstock/getCofcDocumentDetails
    // @return Detail of COFC ducument generic category and packing slip id
    getCofcDocumentDetails: (req, res) => {
        const {
            ComponentSidStockPackingDetail,
            PackingSlipMaterialReceiveDet,
            GenericCategory
        } = req.app.locals.models;
        if (req.body.objIDs && req.body.objIDs.umid) {
            const promise = [];
            promise.push(
                ComponentSidStockPackingDetail.findAll({
                    where: {
                        refComponentSidStockID: {
                            [Op.in]: req.body.objIDs.umid
                        }
                    },
                    attributes: ['refPackingSlipDetailID', 'refComponentSidStockID'],
                    include: [{
                        model: PackingSlipMaterialReceiveDet,
                        as: 'packing_slip_material_receive_det',
                        attributes: ['id', 'refPackingSlipMaterialRecID'],
                        required: false
                    }]
                })
            );
            promise.push(
                GenericCategory.findAll({
                    where: {
                        gencCategoryName: {
                            [Op.in]: ['Packing Slip With COFC', 'COFC']
                        },
                        isActive: true
                    },
                    attributes: ['gencCategoryID', 'gencCategoryName']
                })
            );
            return Promise.all(promise).then(resp =>
                resHandler.successRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    receiveMaterial: resp && resp[0] ? resp[0] : [],
                    genericCategory: resp && resp[1] ? resp[1] : []
                }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // import umid check and save in database
    // POST:/api/v1/mfgcode/importUMIDDetail
    // @return Check umid validation
    importUMIDDetail: (req, res) => {
        const {
            sequelize,
            ComponentSidStock,
            ComponentSidStockDataelementValues,
            Component
        } = req.app.locals.models;

        if (req.body && req.body.umidImportedDetail) {
            // eslint-disable-next-line no-useless-escape
            const dateRegularExpression = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{2,4}$/;
            const umidImportedDetail = req.body.umidImportedDetail;

            const umidPromises = [];
            _.each(umidImportedDetail, (umid) => {
                umid.errorMessageList = [];

                // UMID Prefix Validation
                if (!umid.prefix) {
                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.UMID_PREFIX_REQUIRE);
                }

                // UMID Validation
                if (umid.uid) {
                    if (umid.uid.length !== DATA_CONSTANT.COMPONENT_SID_STOCK.UMID_Length) {
                        umid.errorMessageList.push(COMMON.stringFormat(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.UMID_LENGTH, DATA_CONSTANT.COMPONENT_SID_STOCK.UMID_Length));
                    } else {
                        umidPromises.push(
                            module.exports.checkUniqueUMID(req, res, umid.uid).then((objUMID) => {
                                if (objUMID) {
                                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.UMID_UNIQUE);
                                }
                            })
                        );
                    }
                } else {
                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.UMID_REQUIRE);
                }

                // MFR Code & MFR PN Validation
                if (umid.mfrCode) {
                    umidPromises.push(
                        // eslint-disable-next-line consistent-return
                        PricingController.getManufacturerDetail(req, umid.mfrCode, DATA_CONSTANT.MFG).then((mfgDet) => {
                            if (mfgDet && mfgDet.mfgCodeID) {
                                const mfrid = mfgDet.mfgCodeID;
                                if (umid.mfrPnName) {
                                    return module.exports.getComponentDetailByMFRDetail(req, res, mfrid, umid.mfrPnName).then((objComponent) => {
                                        if (objComponent) {
                                            umid.refcompid = objComponent.refSupplierMfgpnComponentID ? objComponent.refSupplierMfgpnComponentID : objComponent.id;
                                            umid.refSupplierPartId = objComponent.refSupplierMfgpnComponentID ? objComponent.id : null;
                                            umid.spq = objComponent.minimum;
                                            umid.orgQty = objComponent.packagingName === DATA_CONSTANT.COMPONENT_SID_STOCK.TAPE_REEL ? objComponent.minimum : umid.pkgQty;
                                            umid.pkgUnit = (umid.pkgQty || 0) * (objComponent.unit || 0);
                                            umid.orgPkgUnit = (umid.orgQty || 0) * (objComponent.unit || 0);
                                            umid.uom = objComponent.uom;
                                            umid.mountingTypeName = objComponent.mountingTypeName;
                                            umid.pcbPerArrayData = objComponent.pcbPerArray;

                                            if (umid.pcbPerArray && umid.mountingTypeName === DATA_CONSTANT.RFQMountingType.BarePCB.Name) {
                                                if (!isNaN(umid.pcbPerArray) && umid.pcbPerArrayData !== umid.pcbPerArray) {
                                                    COMMON.setModelUpdatedByObjectFieldValue(req.user, umid);
                                                    Component.update(umid, {
                                                        where: {
                                                            id: umid.refcompid
                                                        },
                                                        fields: ['pcbPerArray', 'updatedBy', 'updateByRoleId', 'updatedAt']
                                                    });
                                                } else {
                                                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.PCB_PER_ARRAY_NUMBER);
                                                }
                                            } else {
                                                umid.pcbPerArray = null;
                                            }
                                        } else {
                                            umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.MFR_PN_NOT_FOUND);
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.MFR_PN_NOT_FOUND);
                                    });
                                } else {
                                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.MFR_PN_REQUIRE);
                                }
                            } else {
                                umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.MFR_NOT_FOUND);
                            }
                        })
                    );
                } else {
                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.MFR_REQUIRE);
                }

                // Pkg Qty (Count) Validation
                if (!umid.pkgQty) {
                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.COUNT_REQUIRE);
                }

                // To Location/Bin Validation
                if (umid.binName) {
                    umidPromises.push(
                        module.exports.getBinDetailByBinName(req, res, umid.binName).then((objBin) => {
                            if (objBin) {
                                umid.binID = objBin.id;
                                umid.orgRecBin = objBin.id;
                                umid.orgRecWarehouse = objBin.WarehouseID;
                                umid.orgRecDepartment = objBin.warehousemst.parentWHID;
                            } else {
                                umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.TOLOCATION_NOT_FOUND);
                            }
                        })
                    );
                } else {
                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.TOLOCATION_REQUIRE);
                }

                // Packaging Validation
                if (umid.packagingName) {
                    umidPromises.push(
                        module.exports.getPackagingDetailByPackagingName(req, res, umid.packagingName).then((objPackaging) => {
                            if (objPackaging) {
                                umid.packaging = objPackaging.id;
                            } else {
                                umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.PACKAGING_NOT_FOUND);
                            }
                        })
                    );
                } else {
                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.PACKAGING_REQUIRE);
                }

                // Cost Category Validation
                if (umid.costCategoryName) {
                    umidPromises.push(
                        module.exports.getCostCategoryDetailByCostCategoryName(req, res, umid.costCategoryName).then((objCostCategory) => {
                            if (objCostCategory) {
                                umid.costCategoryID = objCostCategory.id;
                            } else {
                                umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.COST_CATEGORY_NOT_FOUND);
                            }
                        })
                    );
                } else {
                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.COST_CATEGORY_REQUIRE);
                }

                // Internal Date Code Validation
                if (umid.dateCode) {
                    if (umid.dateCode.length !== DATA_CONSTANT.COMPONENT_SID_STOCK.DATE_CODE_LENGTH) {
                        umid.errorMessageList.push(COMMON.stringFormat(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.DATE_CODE_LENGTH, DATA_CONSTANT.COMPONENT_SID_STOCK.DATE_CODE_LENGTH));
                    }
                } else {
                    umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.DATE_CODE_REQUIRE);
                }

                // Seal Date Validation
                if (umid.sealDate) {
                    if (new Date(umid.sealDate) === 'Invalid Date' || !dateRegularExpression.test(umid.sealDate)) {
                        umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.SEAL_DATE_NOT_VALID);
                    } else {
                        umid.sealDate = COMMON.formatDate(umid.sealDate);
                    }
                }

                // Expiry Date Validation
                if (umid.expiryDate) {
                    if (new Date(umid.expiryDate) === 'Invalid Date' || !dateRegularExpression.test(umid.expiryDate)) {
                        umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.EXPIRY_DATE_NOT_VALID);
                    } else {
                        umid.expiryDate = COMMON.formatDate(umid.expiryDate);
                    }
                }

                // Mfg Date Validation
                if (umid.mfgDate) {
                    if (new Date(umid.mfgDate) === 'Invalid Date' || !dateRegularExpression.test(umid.mfgDate)) {
                        umid.errorMessageList.push(MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.MFG_DATE_NOT_VALID);
                    } else {
                        umid.mfgDate = COMMON.formatDate(umid.mfgDate);
                    }
                }
            });

            return Promise.all(umidPromises).then(() => sequelize.transaction().then((t) => {
                const insertPromise = [];
                _.each(umidImportedDetail, (data) => {
                    if (data.errorMessageList.length > 0) {
                        data.status = STATE.FAILED;
                        data.message = _.map(data.errorMessageList).join(',');
                    } else {
                        COMMON.setModelCreatedObjectFieldValue(req.user, data);
                        insertPromise.push(
                            ComponentSidStock.create(data, {
                                fields: inputFields,
                                transaction: t
                                // eslint-disable-next-line consistent-return
                            }).then((insertUMID) => {
                                if (insertUMID) {
                                    if (data.dataElement.length === 0) {
                                        data.status = STATE.SUCCESS;
                                        data.message = null;
                                    } else {
                                        const dataElementList = [];
                                        _.each(data.dataElement, (objDataElement) => {
                                            const objDate = {
                                                refsidid: insertUMID.id,
                                                entityid: -11,
                                                dataelementid: objDataElement.dataElementID,
                                                value: objDataElement.value
                                            };
                                            COMMON.setModelCreatedObjectFieldValue(req.user, objDate);
                                            dataElementList.push(objDate);
                                        });

                                        return ComponentSidStockDataelementValues.bulkCreate(dataElementList, {
                                            fields: ComponentInputFields,
                                            transaction: t
                                        }).then((insertDataElement) => {
                                            if (insertDataElement) {
                                                data.status = STATE.SUCCESS;
                                                data.message = null;
                                            } else {
                                                data.status = STATE.FAILED;
                                                data.message = MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.DATA_ELEMENT_NOT_CREATE;
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            data.status = STATE.FAILED;
                                            data.message = MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.DATA_ELEMENT_NOT_CREATE;
                                        });
                                    }
                                } else {
                                    data.status = STATE.FAILED;
                                    data.message = MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.UMID_NOT_CREATE;
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) {
                                    t.rollback();
                                }
                                data.status = STATE.FAILED;
                                data.message = MESSAGE_CONSTANT.UMID_IMPORT_VALIDATION.UMID_NOT_CREATE;
                            })
                        );
                    }
                });

                return Promise.all(insertPromise).then(() => {
                    t.commit();
                    const results = _.filter(umidImportedDetail, umidstatus => umidstatus.status === STATE.FAILED);
                    if (results.length > 0) {
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS,
                            results,
                            null
                        );
                    } else {
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS,
                            results,
                            MESSAGE_CONSTANT.UPDATED(moduleName)
                        );
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                    );
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    getComponentDetailByMFRDetail: (req, res, mfrId, mfrPn) => {
        const {
            Component,
            sequelize
        } = req.app.locals.models;

        return Component.findOne({
            where: {
                mfgcodeID: mfrId,
                mfgPN: mfrPn,
                isDeleted: false
            },
            attributes: ['id', 'mfgcodeID', 'mfgPN', 'uom', 'packagingID', 'unit', 'refSupplierMfgpnComponentID', 'minimum', 'mountingTypeID', 'pcbPerArray']
        }).then((objComponent) => {
            if (objComponent) {
                return sequelize.query('Select fun_getPackagingNameByID(:pPackagingID)', {
                    replacements: {
                        pPackagingID: objComponent.packagingID
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((responce) => {
                    objComponent.packagingName = _.values(responce[0])[0];
                    objComponent.dataValues.packagingName = _.values(responce[0])[0];

                    return sequelize.query('Select fun_getMountingTypeNameByID(:pMountingTypeID)', {
                        replacements: {
                            pMountingTypeID: objComponent.mountingTypeID
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then((responceMounting) => {
                        objComponent.mountingTypeName = _.values(responceMounting[0])[0];
                        objComponent.dataValues.mountingTypeName = _.values(responceMounting[0])[0];
                        return objComponent;
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                });
            } else {
                return objComponent;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },

    getBinDetailByBinName: (req, res, binName) => {
        const {
            BinMst,
            WarehouseMst
        } = req.app.locals.models;

        return BinMst.findOne({
            where: {
                isActive: true,
                Name: binName,
                deletedAt: null
            },
            model: BinMst,
            attributes: ['id', 'Name', 'WarehouseID'],
            required: false,
            include: [{
                model: WarehouseMst,
                as: 'warehousemst',
                attributes: ['id', 'Name', 'parentWHID', 'warehouseType'],
                required: false
            }]
        }).then(bin => bin).catch((err) => {
            console.trace();
            console.error(err);
        });
    },

    getPackagingDetailByPackagingName: (req, res, packagingName) => {
        const {
            ComponentPackagingMst,
            ComponentFieldsGenericaliasMst
        } = req.app.locals.models;

        const pakagingObj = {
            id: null,
            name: null
        };

        const packagingMstPromise = ComponentPackagingMst.findOne({
            where: {
                name: packagingName,
                isDeleted: false,
                isActive: true
            },
            attributes: ['id', 'name']
        });

        const packagingAliesMstPromise = ComponentFieldsGenericaliasMst.findOne({
            where: {
                alias: packagingName,
                refTableName: 'component_packagingmst',
                isDeleted: false
            },
            attributes: ['id', 'alias', 'refId']
        });

        const promises = [packagingMstPromise, packagingAliesMstPromise];
        return Promise.all(promises).then((responses) => {
            const packagingMst = responses[0];
            const packagingAliesMst = responses[1];
            if (packagingMst) {
                pakagingObj.id = packagingMst.id;
                pakagingObj.name = packagingMst.name;
            } else if (packagingAliesMst) {
                pakagingObj.id = packagingAliesMst.refId;
                pakagingObj.name = packagingAliesMst.alias;
            }
            return pakagingObj;
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },

    getCostCategoryDetailByCostCategoryName: (req, res, costCategoryName) => {
        const {
            CostCategory
        } = req.app.locals.models;

        return CostCategory.findOne({
            where: {
                categoryName: costCategoryName,
                deletedAt: null
            },
            model: CostCategory,
            attributes: ['id', 'categoryName'],
            required: false
        }).then(costCategory => costCategory).catch((err) => {
            console.trace();
            console.error(err);
        });
    },

    // Get COFC By BinId And PartId
    // POST : /api/v1/componentsidstock/getCOFCByBinIdPartId
    // @return COFC
    getCOFCByBinIdPartId: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.binId && req.body.partId) {
            return sequelize.query('Select fun_getCofCByBinIdPartId(:pBinId, :pPartId, :pIsMfg)', {
                replacements: {
                    pBinId: req.body.binId,
                    pPartId: req.body.partId,
                    pIsMfg: req.body.isMfg ? req.body.isMfg : false
                },
                type: sequelize.QueryTypes.SELECT
            }).then(responce =>
                resHandler.successRes(res, 200, STATE.SUCCESS, {
                    cofc: _.values(responce[0])[0]
                })
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    // Get Data Element Value Of UMID
    // POST : /api/v1/componentsidstock/Get Data Element Value Of UMID
    // @return List of data element value
    getDataElementValueOfUMID: (req, res) => {
        const {
            DataElement
        } = req.app.locals.models;

        DataElement.findAll({
            where: {
                entityID: -11,
                isActive: true,
                deletedAt: null
            },
            model: DataElement,
            attributes: ['dataElementID', 'dataElementName', 'entityID']
        }).then(dataElement => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS,
            dataElement,
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            }
            );
        });
    },

    verifyLabelTemplate: (req, res) => {
        let port;
        let messageContent;
        const {
            Settings
        } = req.app.locals.models;
        if (req.body.verifyObj) {
            return Settings.findAll({
                where: {
                    clusterName: Pricing.Printer
                },
                attributes: ['key', 'values', 'clusterName']
                // eslint-disable-next-line consistent-return
            }).then((verifyList) => {
                if (verifyList && verifyList.length > 0) {
                    const host = _.find(verifyList, verify => verify.key === Pricing.BartenderServer);
                    port = _.find(verifyList, verify => verify.key === Pricing.BartenderServerPort);
                    if (port.values && isNaN(port.values)) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.INVALID_PORT);
                        messageContent.displayDialog = true;
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: null
                        });
                    }
                    const labelTemplateName = req.body.verifyObj.ServiceName;
                    const extServerOptions = {
                        host: host.values,
                        port: port.values,
                        path: `/Integration/${req.body.verifyObj.ServiceName.replace(/ /g, '')}/Execute`,
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': '0'
                        }
                    };
                    const reqGet = http.request(extServerOptions, (ress) => {
                        const resStatusCode = {
                            StatusCode: ress ? ress.statusCode : null
                        };
                        if (resStatusCode.StatusCode === DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS) {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.WEBSERVICE_CHECK_SUCCESS);
                            messageContent.message = COMMON.stringFormat(messageContent.message, labelTemplateName);
                            messageContent.displayDialog = true;
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resStatusCode, messageContent);
                        } else if (resStatusCode.StatusCode === DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND) {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.INVALID_PRINT_LABEL);
                            messageContent.displayDialog = true;
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                messageContent: messageContent,
                                err: null,
                                data: resStatusCode
                            });
                        } else {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.WEBSERVICE_CHECK_INFO);
                            messageContent.message = COMMON.stringFormat(messageContent.message, labelTemplateName);
                            messageContent.displayDialog = true;
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: messageContent,
                                err: null,
                                data: resStatusCode
                            });
                        }
                    });
                    reqGet.on('error', (err) => {
                        const labelModuleName = 'Label Template';
                        const resStatusCode = {
                            StatusCode: DATA_CONSTANT.API_RESPONSE_CODE.BAD_REQUEST
                        };
                        if (err.code === ECONNREFUSED) {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.CONNECTION_REFUSED);
                            messageContent.displayDialog = true;
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                messageContent: messageContent,
                                err: null,
                                data: resStatusCode
                            });
                        } else if (err.code === ETIMEDOUT || err.code === ENOTFOUND) {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.INVALID_IP);
                            messageContent.displayDialog = true;
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                messageContent: messageContent,
                                err: null,
                                data: resStatusCode
                            });
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.NOT_FOUND(labelModuleName),
                            err: null,
                            data: null
                        });
                    });
                    reqGet.end();
                } else {
                    // Need to set message then configuration for bartender required in setting -> Datakey
                    // This will be take care by Fenil
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                const resStatusCode = {
                    StatusCode: DATA_CONSTANT.API_RESPONSE_CODE.BAD_REQUEST
                };
                if (err.code === ERR_SOCKET_BAD_PORT) {
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BAD_PORT);
                    messageContent.message = COMMON.stringFormat(messageContent.message, port.values);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        messageContent: messageContent,
                        err: null,
                        data: resStatusCode
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
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

    // Get Data For Print Label Template
    // POST : /api/v1/componentsidstock/getDataForPrintLabelTemplate
    // @return List of data of print barcode
    getDataForPrintLabelTemplate: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        let messageContent;
        if (req.body && req.body.printList) {
            const umidIds = _.map(req.body.printList, 'id').join(',');
            return sequelize.query('CALL Sproc_GetPrintUMIDBarcodeData (:pUMIDIds, :pUserId)', {
                replacements: {
                    pUMIDIds: umidIds,
                    pUserId: COMMON.getRequestUserID(req)
                },
                type: sequelize.QueryTypes.SELECT
                // eslint-disable-next-line consistent-return
            }).then((response) => {
                const responceList = _.values(response[0]);
                if (responceList.length > 0) {
                    _.map(responceList, (data) => {
                        const currentPrintObj = _.find(req.body.printList, item => item.id === data.id);
                        if (currentPrintObj) {
                            data.numberOfPrint = currentPrintObj.numberOfPrint;
                            data.reqName = currentPrintObj.reqName;
                            data.PrinterName = currentPrintObj.PrinterName;
                            data.ServiceName = currentPrintObj.ServiceName;
                            data.printType = currentPrintObj.printType;
                            data.pageName = currentPrintObj.pageName;
                        }
                    });

                    req.body.printObj = responceList;
                    if (req.body.printObj) {
                        if (_.sumBy(req.body.printObj, item => !item.PrinterName)) {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.SELECT_VALUE);
                            messageContent.message = COMMON.stringFormat(messageContent.message, 'Printer', 'Print');
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                messageContent: messageContent,
                                err: null,
                                data: null
                            }, null);
                        } else if (_.sumBy(req.body.printObj, item => !item.ServiceName)) {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.SELECT_VALUE);
                            messageContent.message = COMMON.stringFormat(messageContent.message, 'Label Template', 'Print');
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                messageContent: messageContent,
                                err: null,
                                data: null
                            }, null);
                        } else {
                            module.exports.printLabelTemplate(req, res);
                        }
                    }
                } else {
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                        err: null,
                        data: null
                    }
                    );
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: null,
                    data: null
                }
                );
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

    printLabelTemplate: (req, res) => {
        let port;
        let messageContent;
        let printObj;
        let extServerOptions;
        const responseList = [];
        let indexCount = 0;
        const {
            Settings
        } = req.app.locals.models;
        if (req.body.printObj) {
            return Settings.findAll({
                where: {
                    clusterName: Pricing.Printer
                },
                attributes: ['key', 'values', 'clusterName']
                // eslint-disable-next-line consistent-return
            }).then((printList) => {
                if (printList && printList.length > 0) {
                    const host = _.find(printList, print => print.key === Pricing.BartenderServer);
                    port = _.find(printList, print => print.key === Pricing.BartenderServerPort);
                    if (port.values && isNaN(port.values)) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.INVALID_PORT);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: null
                        });
                    } else {
                        const reqLength = req.body.printObj.length;
                        global.PromiseData.mapSeries(req.body.printObj, (printData) => {
                            if (printData.pageName === DATA_CONSTANT.PRINT_BARCODE_PAGE_NAME.ReceivingMaterial) {
                                if (printData.mfgPNDescription) {
                                    printData.mfgPNDescription = printData.mfgPNDescription.substring(0, 96);
                                    _.map(DATA_CONSTANT.BARCODE_LABEL_SPECIAL_CHARACTER, (data) => {
                                        printData.mfgPNDescription = printData.mfgPNDescription.replace(new RegExp(data.FIND, 'g'), data.REPLACE);
                                    });
                                }

                                if (printData.partPackage) {
                                    _.map(DATA_CONSTANT.BARCODE_LABEL_SPECIAL_CHARACTER, (data) => {
                                        printData.partPackage = printData.partPackage.replace(new RegExp(data.FIND, 'g'), data.REPLACE);
                                    });
                                }

                                printObj = JSON.stringify({
                                    uid: printData.uid ? printData.uid.substring(0, 14) : null,
                                    COFC: printData.COFC,
                                    packaging: printData.packaging,
                                    lotCode: printData.lotCode,
                                    expDate: printData.dateofExpire || null,
                                    dcFormat: printData.dateCodeFormat ? `[${printData.dateCodeFormat}]` : null,
                                    mslLevel: printData.mslLevel,
                                    PIDCode: printData.PIDCode ? printData.PIDCode.substring(0, 30) : null,
                                    dateCode: printData.dateCode || null,
                                    priceCategoryID: printData.priceCategoryID ? printData.priceCategoryID.substring(0, 2) : null,
                                    mfgPNDescription: printData.mfgPNDescription ? printData.mfgPNDescription : null,
                                    rohs: printData.rohs,
                                    printerName: printData.printType === 'Print' ? printData.PrinterName : 'PDF Creator',
                                    expireDate: printData.dateofExpire,
                                    customerConsign: printData.customerConsign,
                                    mountingType: printData.mountingType,
                                    partPackage: printData.partPackage,
                                    userCode: printData.createdUserCode,
                                    numberOfPrint: printData.numberOfPrint,
                                    systemId: printData.systemId
                                });
                            }
                            if (printData.pageName === DATA_CONSTANT.PRINT_BARCODE_PAGE_NAME.Warehouse) {
                                printObj = JSON.stringify({
                                    whName: printData.warehouseName,
                                    printerName: printData.printType === 'Print' ? printData.PrinterName : 'PDF Creator',
                                    numberOfPrint: printData.numberOfPrint
                                });
                            } else if (printData.pageName === DATA_CONSTANT.PRINT_BARCODE_PAGE_NAME.Bin) {
                                printObj = JSON.stringify({
                                    binName: printData.binName,
                                    printerName: printData.printType === 'Print' ? printData.PrinterName : 'PDF Creator',
                                    numberOfPrint: printData.numberOfPrint
                                });
                            } else if (printData.pageName === DATA_CONSTANT.PRINT_BARCODE_PAGE_NAME.Rack) {
                                printObj = JSON.stringify({
                                    rackName: printData.rackName,
                                    printerName: printData.printType === 'Print' ? printData.PrinterName : 'PDF Creator',
                                    numberOfPrint: printData.numberOfPrint
                                });
                            } else if (printData.pageName === DATA_CONSTANT.PRINT_BARCODE_PAGE_NAME.SearchMaterial) {
                                printObj = JSON.stringify({
                                    searchMaterialPrintLabel: printData.printLabelForSearchMaterial,
                                    printerName: printData.printType === 'Print' ? printData.PrinterName : 'PDF Creator',
                                    numberOfPrint: printData.numberOfPrint
                                });
                            } else if (printData.pageName === DATA_CONSTANT.PRINT_BARCODE_PAGE_NAME.SerialNo) {
                                printObj = JSON.stringify({
                                    SerialNo: printData.SerialNo,
                                    packaging: printData.packaging,
                                    PIDCode: printData.PIDCode ? printData.PIDCode.substring(0, 30) : null,
                                    dateCode: printData.dateCode ? printData.dateCode.substring(0, 4) : null,
                                    mfgPNDescription: printData.mfgPNDescription ? printData.mfgPNDescription : null,
                                    rohs: printData.rohs,
                                    // partPackage: printData.partPackage,
                                    userCode: printData.createdUserCode,
                                    printerName: printData.printType === 'Print' ? printData.PrinterName : 'PDF Creator',
                                    numberOfPrint: printData.numberOfPrint
                                });
                            }
                            extServerOptions = {
                                host: host.values,
                                port: port.values,
                                path: `/Integration/${printData.ServiceName.replace(/ /g, '')}/Execute`,
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Content-Length': printObj.length
                                }
                            };
                            const reqPost = http.request(extServerOptions, (ress) => {
                                ress.on('data', () => { });
                                // eslint-disable-next-line consistent-return
                                ress.on('end', () => {
                                    indexCount += 1;
                                    if (reqLength === indexCount && responseList.length > 0) {
                                        const ErrorResponse = _.filter(responseList, item => item.messageType === 'Error');
                                        const messageContentError = _.first(_.uniqBy(ErrorResponse, 'messageCode'));
                                        if (messageContentError) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: messageContentError,
                                                err: null,
                                                data: null
                                            });
                                        }
                                    } else if (reqLength === indexCount) {
                                        messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.PRINT_JOB_SUCCESS);
                                        return resHandler.successRes(res,
                                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                            STATE.SUCCESS, null,
                                            messageContent);
                                    }
                                });
                            });
                            reqPost.write(printObj);
                            // eslint-disable-next-line consistent-return
                            reqPost.on('error', (e) => {
                                indexCount += 1;
                                if (e.code === ECONNREFUSED) { // Incase of bartender is not installed or service not started
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.CONNECTION_REFUSED);
                                    responseList.push(messageContent);
                                } else if (e.code === ETIMEDOUT || e.code === ENOTFOUND) { // Incase of invalid/wrong IP
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.INVALID_IP);
                                    responseList.push(messageContent);
                                } else {
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.PRINT_JOB_ERROR);
                                    responseList.push(messageContent);
                                }
                                if (reqLength === indexCount && responseList.length > 0) {
                                    const ErrorResponse = _.filter(responseList, item => item.messageType === 'Error');
                                    const messageContentError = _.first(_.uniqBy(ErrorResponse, 'messageCode'));
                                    if (messageContentError) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: messageContentError,
                                            err: null,
                                            data: null
                                        });
                                    }
                                }
                            });
                        }).then(() => {
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (err.code === ERR_SOCKET_BAD_PORT) {
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BAD_PORT);
                                messageContent.message = COMMON.stringFormat(messageContent.message, port.values);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: messageContent,
                                    err: null,
                                    data: null
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
                        });
                    }
                } else {
                    // Need to set message then configuration for bartender required in setting -> Datakey
                    // This will be take care by Fenil
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.code === ERR_SOCKET_BAD_PORT) {
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.BAD_PORT);
                    messageContent.message = COMMON.stringFormat(messageContent.message, port.values);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
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


    // Get Pricing Detail For CostCategory
    // POST : /api/v1/componentsidstock/getPricingDetailForCostCategory
    // @return List of pricing
    getPricingDetailForCostCategory: (req, res) => {
        const mongodb = global.mongodb;

        if (req.body) {
            const objPriceBreak = {
                componentID: parseInt(req.body.componentID),
                mfgPN: req.body.mfgPN,
                qty: {
                    [Op.lte]: parseInt(req.body.qty)
                },
                Packaging: {
                    [Op.in]: req.body.PackagingList
                }
            };

            if (req.body.supplierPN) {
                objPriceBreak.supplierPN = req.body.supplierPN;
            }

            return mongodb.collection('PriceBreakComponent').find(objPriceBreak).toArray((err, result) => {
                // mongodb.collection('PriceBreakComponent').aggregate([{
                //         $match: objPriceBreak
                //     },
                //     {
                //         //   $group: {
                //         //           _id: "$timeStamp",
                //         //           timeStamp: { $max: "$timeStamp" }
                //         //       }
                //         $max: '$timeStamp'
                //     },
                //     {
                //         $sort: {
                //             timeStamp: -1
                //         }
                //     }
                // ]).toArray(function (err, result) {
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                    );
                }

                const letestRecordObject = _.maxBy(result, data => data.UpdatedTimeStamp);
                let costCategoryObject;
                if (letestRecordObject) {
                    const letestRecord = _.filter(result, data => data.UpdatedTimeStamp === letestRecordObject.UpdatedTimeStamp);
                    let costCategoryList = [];
                    if (req.body.supplier) {
                        costCategoryList = _.orderBy(_.filter(letestRecord, data => data.supplier.toUpperCase() === req.body.supplier.toUpperCase()), ['qty'], ['asc']);
                    } else {
                        costCategoryList = letestRecord;
                    }
                    if (costCategoryList.length > 1) {
                        costCategoryObject = _.find(costCategoryList, data => data.qty === req.body.qty);
                        if (!costCategoryObject) {
                            const lessQtyList = _.orderBy(_.filter(costCategoryList, data => data.qty < req.body.qty), ['qty'], ['asc']);
                            costCategoryObject = lessQtyList[0];
                        }
                    } else if (costCategoryList.length === 1) {
                        costCategoryObject = costCategoryList[0];
                    } else {
                        const digiKeyList = _.orderBy(_.filter(letestRecord, data => data.supplier.toUpperCase() === DATA_CONSTANT.PRICING_SUPPLIER[0].Name.toUpperCase()), ['qty'], ['asc']);
                        if (digiKeyList.length > 0) {
                            costCategoryObject = digiKeyList[0];
                        } else {
                            const mouserList = _.orderBy(_.filter(letestRecord, data => data.supplier.toUpperCase() === DATA_CONSTANT.PRICING_SUPPLIER[2].Name.toUpperCase()), ['qty'], ['asc']);
                            if (mouserList.length > 0) {
                                costCategoryObject = mouserList[0];
                            } else {
                                const avnetList = _.orderBy(_.filter(letestRecord, data => data.supplier.toUpperCase() === DATA_CONSTANT.PRICING_SUPPLIER[5].Name.toUpperCase()), ['qty'], ['asc']);
                                if (avnetList.length > 0) {
                                    costCategoryObject = avnetList[0];
                                } else {
                                    const newarkList = _.orderBy(_.filter(letestRecord, data => data.supplier.toUpperCase() === DATA_CONSTANT.PRICING_SUPPLIER[1].Name.toUpperCase()), ['qty'], ['asc']);
                                    if (newarkList.length > 0) {
                                        costCategoryObject = newarkList[0];
                                    } else {
                                        const arrowList = _.orderBy(_.filter(letestRecord, data => data.supplier.toUpperCase() === DATA_CONSTANT.PRICING_SUPPLIER[4].Name.toUpperCase()), ['qty'], ['asc']);
                                        if (arrowList.length > 0) {
                                            costCategoryObject = arrowList[0];
                                        } else {
                                            const ttiList = _.orderBy(_.filter(letestRecord, data => data.supplier.toUpperCase() === DATA_CONSTANT.PRICING_SUPPLIER[3].Name.toUpperCase()), ['qty'], ['asc']);
                                            if (ttiList.length > 0) {
                                                costCategoryObject = ttiList[0];
                                            } else {
                                                costCategoryObject = null;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                return resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS,
                    costCategoryObject,
                    null
                );
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Generate Internal Date Code for UMID from MFR Date Code Format
    // GET : /api/v1/componentsidstock/generateInternalDateCode
    generateInternalDateCode: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.MFRDateCodeFormatId) {
            return sequelize.query('CALL Sproc_GenerateInternalDateCodeFromMFRDateCode (:pMFRDateCodeFormatId, :pMFRDateCode, :pIsCallFromAPI)', {
                replacements: {
                    pMFRDateCodeFormatId: req.body.MFRDateCodeFormatId || null,
                    pMFRDateCode: req.body.MFRDateCode || null,
                    pIsCallFromAPI: true
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(_.first(response)), null)).catch((err) => {
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
    getUmidTabCount: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.id) {
            return sequelize.query('CALL Sproc_GetUMIDDocumentCount (:pUMIDId)', {
                replacements: {
                    pUMIDId: req.body.id || 0
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                documentCount: response[0][0]['documentCount'],
                documentCofCCount: response[0][0]['documentCofCCount'],
                parentDocumentCount: response[0][0]['parentDocumentCount'],
                splitUIDCount: response[0][0]['splitUIDCount']
            },
                null)).catch((err) => {
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

    // // Get Smart cart checkout reel detail
    // // POST : /api/v1/componentsidstock/getInTransitCheckoutreel
    // // @return List of in transit reel detail
    // Commented By Champak
    // getInTransitCheckoutreel: (req, res) => {
    //     const {
    //         SmartCartTransaction
    //     } = req.app.locals.models;
    //     if (req.params.transactionID) {
    //         return SmartCartTransaction.findAll({
    //             where: {
    //                 isInTransit: true,
    //                 transactionID: req.params.transactionID,
    //                 messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Deliver_Response
    //             },
    //             model: SmartCartTransaction,
    //             attributes: ['id', 'requestMessage', 'isInTransit', 'reelBarCode']
    //         }).then(smartcart => resHandler.successRes(
    //             res,
    //             DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
    //             STATE.SUCCESS,
    //             smartcart,
    //             null)).catch((err) => {
    //                 console.trace();
    //                 console.error(err);
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                     messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                     err: err,
    //                     data: null
    //                 });
    //             });
    //     } else {
    //         return resHandler.errorRes(
    //             res,
    //             DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
    //             STATE.FAILED, {
    //             messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
    //             err: null,
    //             data: null
    //         }
    //         );
    //     }
    // },

    // Get Smart cart checkout reel detail
    // POST : /api/v1/componentsidstock/getInTransitCheckoutreel
    // @return List of in transit reel detail
    getInTransitCheckoutreel: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.transactionID) {
            return sequelize.query('CALL Sproc_GetInTransitUMIDList (:ptransactionID)', {
                replacements: {
                    ptransactionID: req.params.transactionID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                inTransitList: _.values(response[0]),
                transactionColor: _.values(response[1])
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
    // get Smart cart UMID Current Status to transfer
    // GET : /api/v1/componentsidstock/getInTransitUMIDDetail
    // return UMID detail its transit or not
    getInTransitUMIDDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.uid) {
            return sequelize.query('CALL Sproc_GetInTransitUMIDdetail (:preelbarcode)', {
                replacements: {
                    preelbarcode: req.params.uid
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

    getExistingAssemblyWorkorderDetail: (req, res, isFromApi) => {
        const {
            sequelize
        } = req.app.locals.models;
        const isFromApiCheck = isFromApi === true ? true : false;
        return sequelize.query('CALL Sproc_RetrieveAssemblyWorkorderList (:pWorkorderNumber)', {
            replacements: {
                pWorkorderNumber: req.body.workorderNumber || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (isFromApiCheck) {
                return response && response[0] && response[0][0] ? response[0][0] : false;
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null);
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

    // Retrive id of Split UID
    // POST : /api/v1/componentsidstock/createSplitUMID
    // @return id and uid of split UMID
    createSplitUMID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            req.body.countApprovalHistoryList = [];
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                const prefix = req.body.prefix || null;
                if (req.body.countApprovalHistoryData) {
                    req.body.countApprovalHistoryData.approvedBy = req.body.createdBy || null;
                    req.body.countApprovalHistoryData.approvedByRoleId = req.body.createByRoleId || null;
                    req.body.countApprovalHistoryList.push(req.body.countApprovalHistoryData);
                }
                return module.exports.generateBarcodeForUMID(req, prefix, true, t).then((objPrifix) => {
                    if (objPrifix) {
                        req.body.uid = objPrifix;
                        return sequelize.query('CALL Sproc_saveSplitUMIDDetail (:pUIDID, :pSplitUID, :pFromBinID, :pFromWHID, :pFromParentWH, :pToBinID, :pPackaging,:pInventoryType, :pSplitCount, :pSplitUnit, :pPkgCount, :pPkgUnit, :pIsKitAllocation, :pUOM, :pUserID, :pUserRoleID, :pCountApprovalHistoryData)', {
                            replacements: {
                                pUIDID: req.body.id,
                                pSplitUID: req.body.uid,
                                pFromBinID: req.body.fromBinID,
                                pFromWHID: req.body.fromWHID,
                                pFromParentWH: req.body.fromParentWHID,
                                pToBinID: req.body.binID,
                                pPackaging: req.body.splitPackagingId,
                                pInventoryType: req.body.inventoryType,
                                pSplitCount: req.body.splitPkgQty,
                                pSplitUnit: req.body.splitPkgUnit,
                                pPkgCount: req.body.pkgQty,
                                pPkgUnit: req.body.pkgUnit,
                                pIsKitAllocation: req.body.isKitAllocation,
                                pUOM: req.body.uom,
                                pUserID: req.body.createdBy,
                                pUserRoleID: req.body.createByRoleId,
                                pCountApprovalHistoryData: req.body.countApprovalHistoryList && req.body.countApprovalHistoryList.length > 0 ? JSON.stringify(req.body.countApprovalHistoryList) : null
                            },
                            transaction: t
                        }).then((response) => {
                            t.commit().then(() => {
                                let umidDetail = {};
                                if (response && response[0]) {
                                    umidDetail = response[0];
                                    return module.exports.saveUMIDResponse(req, res, umidDetail);
                                } else {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                }
                            }).catch((err) => {
                                console.trace();
                                if (!t.finished) {
                                    t.rollback();
                                }
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of Split UID
    // POST : /api/v1/componentsidstock/getSplitUIDList
    // @return list of Split UID
    getSplitUIDList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const searchColumns = req.body.SearchColumns && req.body.SearchColumns.length > 0 ? (_.chain(req.body.SearchColumns).groupBy('isExternalSearch').map((value, key) => ({
            searchList: value,
            isExternalSearch: key === 'true' ? true : false
        })).value()) : [];
        let filter = null;
        let strWhere = '';
        if (searchColumns.length > 0) {
            _.each(searchColumns, (columns) => {
                let filterTypeWhereClause = '';
                if (columns.searchList.length > 0) {
                    req.body.search = JSON.stringify(columns.searchList);
                    filter = COMMON.UiGridFilterSearch(req);
                    if (columns.isExternalSearch) {
                        filterTypeWhereClause = COMMON.whereClauseOfMultipleFieldSearchText(filter.where);
                    } else {
                        filterTypeWhereClause = COMMON.UIGridWhereToQueryWhere(filter.where);
                    }

                    if (strWhere) {
                        strWhere += ' AND ';
                    }
                    strWhere += ` ( ${filterTypeWhereClause} ) `;
                }
            });
        } else {
            filter = COMMON.UiGridFilterSearch(req);
        }

        sequelize.query('CALL Sproc_RetrieveSplitUMIDList (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pUIDId)', {
            replacements: {
                pPageIndex: req.body.page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pUIDId: req.body.id || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { splitUIDList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },


    // Retrieve list of deallocated UID
    // POST : /api/v1/componentsidstock/getDeallocatedUIDList
    // @return list of deallocated UID
    getDeallocatedUIDList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_getDeallocatedUIDList (:pPageIndex, :pRecordPerPage, :pOrderBy, :pWhereClause, :pRefSalesOrderID, :pAssyID, :pPartIDs)', {
            replacements: {
                pPageIndex: req.body.page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pRefSalesOrderID: req.body.refSalesOrderID || null,
                pAssyID: req.body.assyID || null,
                pPartIDs: req.body.partIDs ? req.body.partIDs.toString() : null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { DeallocatedUIDList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Check UIDs Delete Validation
    // POST : /api/v1/componentsidstock/checkDeleteUIDValidation
    // @return API response
    checkDeleteUIDValidation: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs) {
            return sequelize.query('CALL Sproc_checkDeleteUIDValidation (:pIDs)', {
                replacements: {
                    pIDs: req.body.objIDs.toString()
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response && response[0][0] && response[0][0].errorCode !== 0 && response[1]) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { UIDList: _.values(response[1]), ErrorCode: response[0][0].errorCode }, null);
                } else if (response && response[0][0] && response[0][0].errorCode === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { UIDList: null, ErrorCode: response[0][0].errorCode }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
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

    // Get Same Packing Slip criteria umid
    // POST : /api/v1/componentsidstock/getSameCriteriaUMIDPackingSlipDetails
    getSameCriteriaUMIDPackingSlipDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetSameCriteriaUMIDPackingSlipDet(:pPackagingID, :pBinID, :pPartId, :pUIDId, :pType)', {
                replacements: {
                    pPackagingID: req.body.packagingId || null,
                    pBinID: req.body.binId || null,
                    pPartId: req.body.partId || null,
                    pUIDId: req.body.id || null,
                    pType: req.body.type || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (req.body.type === 'UC') {
                    const responseData = _.values(response[0]);
                    if (responseData && responseData.length === 1) {
                        if (responseData[0].packingSlipModeStatus === DATA_CONSTANT.PACKING_SLIP_MODE_STATUS.DRAFT) {
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PS_POSTING_STATUS_NOT_ALLOW);
                            messageContent.message = COMMON.stringFormat(messageContent.message, 'create', DATA_CONSTANT.COMPONENT_SID_STOCK.UMID, responseData[0].packingSlipNumber, req.body.PIDCode, responseData[0].packagingType, req.body.binName);
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null, messageTypeCode: 1 }, null);
                        } else if (responseData[0].receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Pending || responseData[0].receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Reject) {
                            let receivedStatus = null;
                            if (responseData[0].receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Pending) {
                                receivedStatus = DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatusValue.Pending;
                            } else if (responseData[0].receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Reject) {
                                receivedStatus = DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatusValue.Rejected;
                            }
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PS_RECEIVED_STATUS_NOT_ALLOW_UMID);
                            messageContent.message = COMMON.stringFormat(messageContent.message, responseData[0].packingSlipNumber, receivedStatus, req.body.PIDCode, req.body.PIDCode, responseData[0].packagingType, req.body.binName);
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null, messageTypeCode: 2 }, null);
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { pendingPackingSlipList: responseData }, null);
                        }
                    } else if (responseData && responseData.length > 1) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { pendingPackingSlipList: responseData }, null);
                    } else {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.BIN_PART_PENDING_STOCK_NOT_EXISTS);
                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.binName, req.body.PIDCode);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null, messageTypeCode: 3 }, null);
                    }
                } else {
                    const errorResData = _.values(response[1])[0];
                    if (errorResData.errorCode === 1) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PS_POSTING_STATUS_NOT_ALLOW_CHANGE_INITALQTY);
                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.uid, errorResData.packingSlipNumber);
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.FAILED, {
                            messageContent: messageContent,
                            err: null,
                            data: null,
                            messageTypeCode: 1
                        },
                            null
                        );
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { pendingPackingSlipList: _.values(response[0])[0], packingSlipList: errorResData }, null);
                }
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

    // Get Part Shelf Life details By partID
    // POST : /api/v1/componentsidstock/getComponentShelfLifeDetailsById
    // @return Detail of Part Shelf Life
    getComponentShelfLifeDetailsById: (req, res) => {
        const {
            Component
        } = req.app.locals.models;
        if (req.body.partId) {
            return Component.findOne({
                where: {
                    id: req.body.partId
                },
                attributes: ['id', 'mfgcodeID', 'mfgPN', 'PIDCode', 'selfLifeDays', 'maxShelfLifeAcceptanceDays', 'maxShelfListDaysThresholdPercentage',
                    'shelfLifeAcceptanceDays', 'shelfListDaysThresholdPercentage']
            }).then(data => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS,
                data,
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
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

    manageIdenticalUMID: (req, res) => {
        const { VUUMIDCreationPending } = req.app.locals.models;
        req.body.generatedUMIDList = [];
        req.body.printList = [];
        req.body.responseList = [];
        req.body.isIdenticalUMID = true;
        const totalPkgQty = req.body.componentSidStk.uidQty * req.body.componentSidStk.orgQty;
        const appendQty = `${req.body.componentSidStk.orgQty}X${req.body.componentSidStk.uidQty}`;
        if (req.body.componentSidStk.isSplitUID) {
            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SPLIT_UID_NOT_ALLOW);
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                messageContent: messageContent,
                err: null,
                data: null,
                messageTypeCode: 'SPLIT_UID_NOT_ALLOW'
            }, null);
        }
        if (req.body.componentSidStk.packingSlipDetailId) {
            return VUUMIDCreationPending.findOne({
                where: {
                    packingSlipDetID: req.body.componentSidStk.packingSlipDetailId,
                    BalanceQty: {
                        [Op.gt]: 0
                    }
                },
                model: VUUMIDCreationPending,
                attributes: ['BinID', 'PartId', 'InQty', 'UMIDCreatedQty', 'BalanceQty', 'packingSlipModeStatus', 'packingSlipNumber', 'umidCreated', 'packagingID', 'receivedStatus']
            }).then((StockList) => {
                if (StockList) {
                    if (StockList.packingSlipModeStatus === DATA_CONSTANT.PACKING_SLIP_MODE_STATUS.DRAFT) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PS_POSTING_STATUS_NOT_ALLOW);
                        messageContent.message = COMMON.stringFormat(messageContent.message, 'create', DATA_CONSTANT.COMPONENT_SID_STOCK.UMID, req.body.componentSidStk.packingSlipNumber, req.body.componentSidStk.PIDCode, req.body.componentSidStk.packagingName, req.body.componentSidStk.fromBinName);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            messageContent: messageContent,
                            err: null,
                            data: null,
                            messageTypeCode: 'PS_POSTING_STATUS_NOT_ALLOW'
                        }, null);
                    } else if (StockList.receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Pending || StockList.receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Reject) {
                        let receivedStatus = null;
                        if (StockList.receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Pending) {
                            receivedStatus = DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatusValue.Pending;
                        } else if (StockList.receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Reject) {
                            receivedStatus = DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatusValue.Rejected;
                        }
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PS_RECEIVED_STATUS_NOT_ALLOW_UMID);
                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.componentSidStk.packingSlipNumber, receivedStatus, req.body.componentSidStk.PIDCode, req.body.componentSidStk.packagingName, req.body.componentSidStk.fromBinName);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            messageContent: messageContent,
                            err: null,
                            data: null,
                            messageTypeCode: 'PS_RECEIVED_STATUS_NOT_ALLOW_UMID'
                        }, null);
                    } else if (StockList.BalanceQty <= 0 || StockList.BalanceQty < totalPkgQty) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.BIN_NOT_HAVE_STOCK);
                        const appendMessageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.IDENTICAL_UMID_STOCK_NOT_EXISTS);
                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.componentSidStk.fromBinName, req.body.componentSidStk.finalMfgPn, StockList.BalanceQty, appendQty, appendMessageContent.message);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            messageContent: messageContent,
                            err: null,
                            data: null,
                            messageTypeCode: 'BIN_NOT_HAVE_STOCK'
                        }, null);
                    } else {
                        return module.exports.createIdenticalDetailBaseUMID(req, res);
                    }
                } else {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.STOCK_NOT_EXISTS_FOR_NON_UMID_STOCK);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        messageContent: messageContent,
                        err: null,
                        data: null,
                        messageTypeCode: 'STOCK_NOT_EXISTS'
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
        } else if (req.body.componentSidStk.stockInventoryType === DATA_CONSTANT.COMPONENT_SID_STOCK.INVENTORY_TYPE.ExistingAssemblyStock) {
            // For Non-UMID Assembly Stock
            req.body.workorderNumber = req.body.componentSidStk.woNumber;
            return module.exports.getExistingAssemblyWorkorderDetail(req, res, true).then((StockList) => {
                if (StockList) {
                    if (StockList.availableQty <= 0 || StockList.availableQty < totalPkgQty) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.BIN_NOT_HAVE_STOCK);
                        const appendMessageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.IDENTICAL_UMID_STOCK_NOT_EXISTS);
                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.componentSidStk.fromBinName, req.body.componentSidStk.finalMfgPn, StockList.availableQty, appendQty, `<br />${appendMessageContent.message}`);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            messageContent: messageContent,
                            err: null,
                            data: null,
                            messageTypeCode: 'BIN_NOT_HAVE_STOCK'
                        }, null);
                    } else {
                        return module.exports.createIdenticalDetailBaseUMID(req, res);
                    }
                } else {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.STOCK_NOT_EXISTS_FOR_ASSEMBLY_STOCK);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        messageContent: messageContent,
                        err: null,
                        data: null,
                        messageTypeCode: 'STOCK_NOT_EXISTS'
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
            return module.exports.createIdenticalDetailBaseUMID(req, res);
        }
    },
    // manage umid identical details for each transaction
    createIdenticalDetailBaseUMID: (req, res) => {
        let successResponse = null;
        let failResponse = null;
        module.exports.manageIdenticalUMIDResponse(req, res, 1).then(() => {
            if (req.body.responseList && req.body.responseList.length > 0) {
                successResponse = req.body.responseList.find(item => item.status === STATE.SUCCESS);
                failResponse = req.body.responseList.find(item => item.status === STATE.FAILED);
                if (successResponse) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        generatedUMIDList: req.body.generatedUMIDList,
                        printList: req.body.printList,
                        messageContent: failResponse ? failResponse.messageContent : null,
                        err: failResponse ? failResponse.err : null,
                        data: null,
                        messageTypeCode: failResponse ? failResponse.messageTypeCode : null
                    }, MESSAGE_CONSTANT.CREATED(umidModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        messageContent: failResponse ? failResponse.messageContent : null,
                        err: failResponse ? failResponse.err : null,
                        data: null,
                        messageTypeCode: failResponse ? failResponse.messageTypeCode : null
                    });
                }
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        });
    },
    // save all no of umid details
    // POST : /api/v1/componentsidstock/createIdenticalDetailBaseUMID
    // @return umid detail list for all
    manageIdenticalUMIDResponse: (req, res, step) => {
        return module.exports.createUMIDValidation(req, res).then((response) => {
            if (response && response.status === STATE.SUCCESS) {
                req.body.generatedUMIDList.push({
                    id: response.umidDetail.id,
                    uid: response.umidDetail.uid,
                    PIDCode: req.body.componentSidStk.PIDCode,
                    mfgCodeName: req.body.componentSidStk.mfgCodeName,
                    refcompid: req.body.componentSidStk.refcompid,
                    mfgPN: req.body.componentSidStk.mfgPN,
                    partRohsIcon: req.body.componentSidStk.partRohsIcon,
                    partRohsName: req.body.componentSidStk.partRohsName,
                    isCustom: req.body.componentSidStk.isCustom,
                    binName: req.body.componentSidStk.binName,
                    warehouseName: req.body.componentSidStk.warehouseName,
                    parentWHName: req.body.componentSidStk.parentWHName,
                    packagingName: req.body.componentSidStk.packagingName,
                    unitName: req.body.componentSidStk.unitName,
                    uomClassID: req.body.componentSidStk.uomClassID,
                    pkgQty: req.body.componentSidStk.orgQty,
                    pkgUnit: req.body.componentSidStk.orgPkgUnit,
                    mfgPNDescription: req.body.componentSidStk.mfgPNDescription,
                    custAssyPN: req.body.componentSidStk.custAssyPN,
                    printerName: req.body.componentSidStk.printerName,
                    printFormateName: req.body.componentSidStk.printFormateName
                });
                req.body.printList.push({
                    id: response.umidDetail.id,
                    uid: response.umidDetail.uid,
                    numberOfPrint: req.body.componentSidStk.noprint,
                    reqName: 'Print',
                    PrinterName: req.body.componentSidStk.printerName,
                    ServiceName: req.body.componentSidStk.printFormateName,
                    printType: 'Print',
                    pageName: DATA_CONSTANT.PRINT_BARCODE_PAGE_NAME.ReceivingMaterial
                });
                step++;
                if (step <= req.body.componentSidStk.uidQty) {
                    return module.exports.manageIdenticalUMIDResponse(req, res, step);
                }
            }
            req.body.responseList.push(response);
            return response;
        });
    },

    // Get Same umid deatils for check stock exits or not
    // POST : /api/v1/componentsidstock/getUMIDDetailsForManageStock
    getUMIDDetailsForManageStock: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.stockInventoryType) {
            return sequelize.query('CALL Sproc_GetUMIDDetailsForManageStock(:pInventoryType, :pWOID, :pPackingSlipDetID)', {
                replacements: {
                    pInventoryType: req.body.stockInventoryType || null,
                    pWOID: req.body.woID || null,
                    pPackingSlipDetID: req.body.packingSlipDetID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { umidDetails: _.values(response[0])[0] }, null)).catch((err) => {
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
    }
};