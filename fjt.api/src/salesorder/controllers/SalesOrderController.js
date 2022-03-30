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
/* errors file*/
const {
    NotUpdate
} = require('../../errors');

const timelineObjForSalesOrder = DATA_CONSTANT.TIMLINE.EVENTS.SALES_ORDER;
const SalesOrderConstObj = DATA_CONSTANT.TIMLINE.SALES_ORDER;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const { getSystemIdPromise } = require('../../utility/controllers/UtilityController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');
const _ = require('lodash');
const { stringFormat } = require('../../constant/Common');
// const AssemblyStock = require('../../../models/AssemblyStock');


const inputFields = [
    'id',
    'salesOrderNumber',
    'poNumber',
    'poDate',
    'customerID',
    'contactPersonID',
    'billingAddressID',
    'shippingAddressID',
    'shippingMethodID',
    'revision',
    'shippingComment',
    'internalComment',
    'termsID',
    'status',
    'soDate',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'revisionChangeNote',
    'deletedAt',
    'isAddnew',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'documentPath',
    'salesCommissionTo',
    'freeOnBoardId',
    'intermediateShipmentId',
    'serialNumber',
    'carrierID',
    'carrierAccountNumber',
    'isBlanketPO',
    'poRevision',
    'isLegacyPO',
    'isRmaPO',
    'originalPODate',
    'isAlreadyPublished',
    'isAskForVersionConfirmation',
    'poRevisionDate',
    'blanketPOOption',
    'poRevisionDate',
    'rmaNumber',
    'isDebitedByCustomer',
    'orgPONumber',
    'orgSalesOrderID',
    'isReworkRequired',
    'reworkPONumber',
    'billingAddress',
    'billingContactPerson',
    'billingContactPersonID',
    'shippingAddress',
    'shippingContactPerson',
    'shippingContactPersonID',
    'intermediateAddress',
    'intermediateContactPerson',
    'intermediateContactPersonID',
    'linkToBlanketPO'
];

const salesDetInputFields = [
    'id',
    'refSalesOrderID',
    'qty',
    'partID',
    'price',
    'mrpQty',
    'shippingQty',
    'remark',
    'materialTentitiveDocDate',
    'prcNumberofWeek',
    'isHotJob',
    'materialDueDate',
    'isCancle',
    'cancleReason',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'uom',
    'tentativeBuild',
    'lineID',
    'kitQty',
    'kitNumber',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'refRFQGroupID',
    'refRFQQtyTurnTimeID',
    'salesCommissionTo',
    'custPOLineNumber',
    'partCategory',
    'salesOrderDetStatus',
    'completeStatusReason',
    'isSkipKitCreation',
    'partDescription',
    'quoteNumber',
    'quoteFrom',
    'refAssyQtyTurnTimeID',
    'assyQtyTurnTimeText',
    'internalComment',
    'isCustomerConsign',
    'frequency',
    'refSODetID',
    'refSOReleaseLineID',
    'originalPOQty',
    'frequencyType',
    'refBlanketPOID',
    'releaseLevelComment',
    'woComment',
    'custOrgPOLineNumber',
    'requestedBPOStartDate',
    'blanketPOEndDate'
];

const salesShippingInputFields = [
    'shippingID',
    'sDetID',
    'qty',
    'shippingDate',
    'shippingAddressID',
    'shippingMethodID',
    'description',
    'priority',
    'packingSlipNo',
    'invoiceNo',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'releaseNotes',
    'promisedShipDate',
    'revisedRequestedDockDate',
    'revisedRequestedShipDate',
    'revisedRequestedPromisedDate',
    'isAgreeToShip',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'releaseNumber',
    'carrierID',
    'carrierAccountNumber',
    'requestedDockDate',
    'customerReleaseLine',
    'isReadyToShip',
    'poReleaseNumber',
    'refShippingLineID',
    'shippingContactPersonID'
];

const salesOtherExpenseInputFields = [
    'refSalesOrderDetID',
    'partID',
    'qty',
    'price',
    'frequency',
    'frequencyType',
    'refReleaseLineID',
    'lineComment',
    'lineInternalComment',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const WO_SO_FIELDS = ['woSalesOrderDetID', 'salesOrderDetailID', 'partID', 'poQty', 'scrapQty', 'woID', 'qpa', 'parentPartID'];
const salesOrderModuleName = DATA_CONSTANT.SALES_ORDER.Name;
const salesOrderStatus = DATA_CONSTANT.SALES_ORDER.SALES_STATUS;
const PlannModuleName = DATA_CONSTANT.PLANN_DET.Name;
const SalesCommossionModuleName = DATA_CONSTANT.SALESCOMMISSION_DET.Name;
const salesOrderShimentName = DATA_CONSTANT.SALES_ORDER.Shipment_Summary_Name;
module.exports = {
    // Get List of SalesOrder
    // POST : /api/v1/SalesOrder/retrieveSalesOrderList
    // @return List of SalesOrder
    retrieveSalesOrderList: (req, res) => {
        if (req.body) {
            const {
                sequelize
            } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            if (req.body && req.body.customerId) {
                strWhere = stringFormat('{0} {1} {2} {3}', strWhere ? strWhere : '', strWhere ? ' AND ' : '', ' customerID =', req.body.customerId);
            }
            return sequelize
                .query('CALL Sproc_GetSalesorderList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pSalesOrderDetailId,:pIsPendingWOCreationList,:pCustomPendingWOCreationWhereClause, :pIsPendingCustPackingSlipList,:pfilterStatus,:pcustomerIds,:pshippingMethodId,:ptermsIds,:psearchposotext,:psearchposotype,:pfromDate,:ptoDate,:prushJob,:ppartIds,:pworkorders,:psearchextPricetext,:psearchextPricetype,:pfilterPOStatus,:pIsRmaPO, :pDateType, :pSearchComments)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: req.body.isExport ? null : filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        // pPlannedStatus: req.body.PlannedStatus ? req.body.PlannedStatus : null,
                        pSalesOrderDetailId: req.body.SalesOrderDetailId ? req.body.SalesOrderDetailId : 0,
                        pIsPendingWOCreationList: req.body.isPendingWOCreationList && req.body.isPendingWOCreationList ? 1 : 0,
                        pCustomPendingWOCreationWhereClause: req.body.customPendingWOCreationWhereClause ? req.body.customPendingWOCreationWhereClause : null,
                        pIsPendingCustPackingSlipList: req.body.isPendingCustPackingSlipList ? req.body.isPendingCustPackingSlipList : 0,
                        pfilterStatus: req.body.filterStatus || null,
                        pcustomerIds: req.body.customerID || null,
                        pshippingMethodId: req.body.shippingMethodId || null,
                        ptermsIds: req.body.termsIds || null,
                        psearchposotext: req.body.posoSearch || null,
                        psearchposotype: req.body.posoSearchType || null,
                        pfromDate: req.body.pfromDate || null,
                        ptoDate: req.body.ptoDate || null,
                        prushJob: req.body.isRushJob || false,
                        ppartIds: req.body.partIds || null,
                        pworkorders: req.body.woIds || null,
                        psearchextPricetext: req.body.searchextPricetext || null,
                        psearchextPricetype: req.body.searchextPricetype || null,
                        // pkitreturnStatus: req.body.kitReturnFilterStatus || null,
                        // pkitReleaseStatus: req.body.kitReleaseFilterStatus || null,
                        pfilterPOStatus: req.body.filterPOStatus || null,
                        pIsRmaPO: req.body.isRmaPO || null,
                        pDateType: req.body.selectedDateType || null,
                        pSearchComments: req.body.searchComments || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    salesorders: _.values(response[1]),
                    Count: response[0][0]['TotalRecord'],
                    UnPlannedCount: response[2] && response[2][0] ? response[2][0]['UnPlannedCount'] : 0,
                    PartiallyPlannedCount: response[2] && response[2][0] ? response[2][0]['PartiallyPlannedCount'] : 0
                }, null)).catch((err) => {
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
    // Get List of SalesOrder Summary Detail
    // POST : /api/v1/SalesOrder/retrieveSalesOrderSummaryList
    // @return List of SalesOrder
    retrieveSalesOrderSummaryList: (req, res) => {
        if (req.body) {
            const {
                sequelize
            } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize
                .query('CALL Sproc_GetSalesOrderSummaryList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pfilterStatus,:pcustomerIds,:pshippingMethodId,:ptermsIds,:psearchposotext,:psearchposotype,:pfromDate,:ptoDate,:psearchextPricetext,:psearchextPricetype,:pfilterPOStatus,:pIsRmaPO, :pDateType, :pSearchComments,:ppartIds)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: req.body.isExport ? null : filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pfilterStatus: req.body.filterStatus || null,
                        pcustomerIds: req.body.customerID || null,
                        pshippingMethodId: req.body.shippingMethodId || null,
                        ptermsIds: req.body.termsIds || null,
                        psearchposotext: req.body.posoSearch || null,
                        psearchposotype: req.body.posoSearchType || null,
                        pfromDate: req.body.pfromDate || null,
                        ptoDate: req.body.ptoDate || null,
                        psearchextPricetext: req.body.searchextPricetext || null,
                        psearchextPricetype: req.body.searchextPricetype || null,
                        pfilterPOStatus: req.body.filterPOStatus || null,
                        pIsRmaPO: req.body.isRmaPO || null,
                        pDateType: req.body.selectedDateType || null,
                        pSearchComments: req.body.searchComments || null,
                        ppartIds: req.body.partIds || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    salesorders: _.values(response[1]),
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
    // Get detail of SalesOrder
    // GET : /api/v1/SalesOrder
    // @param {id} int
    // @return detail of SalesOrder
    retrieveSalesOrder: async (req, res) => {
        const {
            SalesOrderMst,
            sequelize,
            ContactPerson,
            CustomerAddresses,
            CountryMst,
            MfgCodeMst,
            CustomerPackingSlip,
            AssemblyStock,
            Component
        } = req.app.locals.models;
        if (req.params.id && req.query.refTableName) {
            let functionDetail = [];
            try {
                functionDetail = await sequelize.query('Select fun_getTimeZone() as TimeZone,fun_getDateTimeFormat() as dateFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return await SalesOrderMst.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                model: SalesOrderMst,
                attributes: ['id', 'salesOrderNumber', 'poNumber', 'poDate', 'customerID', 'contactPersonID', 'billingAddressID', 'shippingAddressID', 'shippingMethodID', 'revision', 'shippingComment', 'termsID', 'status', 'soDate', 'revisionChangeNote', 'isAddnew',
                    'documentPath', 'salesCommissionTo', 'freeOnBoardId', 'intermediateShipmentId', 'internalComment', 'serialNumber', 'carrierID', 'carrierAccountNumber', 'isBlanketPO', 'poRevision', 'isLegacyPO', 'isRmaPO', 'originalPODate',
                    'isAskForVersionConfirmation', 'isAlreadyPublished', 'poRevisionDate', 'blanketPOOption',
                    'rmaNumber', 'isDebitedByCustomer', 'orgPONumber', 'orgSalesOrderID', 'isReworkRequired', 'reworkPONumber', 'billingAddress', 'billingContactPerson', 'billingContactPersonID', 'shippingAddress', 'shippingContactPerson', 'shippingContactPersonID', 'intermediateAddress', 'intermediateContactPerson', 'intermediateContactPersonID', 'linkToBlanketPO',
                    [sequelize.literal('fun_getEmployeeIDByUserID(SalesOrderMst.updatedBy)'), 'updatedBy'],
                    [sequelize.literal('fun_getEmployeeIDByUserID(SalesOrderMst.createdBy)'), 'createdBy'],
                    [sequelize.literal('fun_getUserNameByID(SalesOrderMst.updatedBy)'), 'updatedbyValue'],
                    [sequelize.literal('fun_getUserNameByID(SalesOrderMst.createdBy)'), 'createdbyValue'],
                    [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('SalesOrderMst.UpdatedAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'updatedAt']],
                include: [{
                    model: CustomerPackingSlip,
                    as: 'customerPackingSlip',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id'],
                    required: false
                }, {
                    model: MfgCodeMst,
                    as: 'customers',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgName', 'mfgCode'],
                    required: false
                }, {
                    model: ContactPerson,
                    as: 'contactPerson',
                    where: {
                        refTransID: { [Op.col]: 'SalesOrderMst.customerID' },
                        refTableName: req.query.refTableName,
                        isDeleted: false
                    },
                    attributes: ['personId', [sequelize.literal('CONCAT(contactPerson.firstName , \' \' , contactPerson.lastName)'), 'fullName']],
                    required: false
                }, {
                    model: CustomerAddresses,
                    as: 'customerBillingAddress',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'street1', 'street2', 'city', 'state', 'countryID', 'postcode', 'isActive'],
                    required: false,
                    include: [{
                        model: CountryMst,
                        as: 'countryMst',
                        attributes: ['countryName'],
                        required: false
                    }]
                }, {
                    model: CustomerAddresses,
                    as: 'customerShippingAddress',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'street1', 'street2', 'city', 'state', 'countryID', 'postcode', 'isActive'],
                    required: false,
                    include: [{
                        model: CountryMst,
                        as: 'countryMst',
                        attributes: ['countryName']
                    }]
                },
                {
                    model: AssemblyStock,
                    as: 'InitialStockMst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'refSalesOrderID'],
                    required: false,
                    include: [{
                        model: Component,
                        as: 'componentAssembly',
                        where:{
                            isDeleted : false,
                            mfgType : DATA_CONSTANT.MFG_TYPE.MFG
                        },
                        attributes: ['id', 'PIDCode']
                    }]
                }
                ]
            }).then((salesorder) => {
                if (!salesorder) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(salesOrderModuleName),
                        err: null,
                        data: null
                    });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, salesorder, null);
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
    // Get detail of SalesOrder by ID
    // GET : /api/v1/retriveSalesOrderByID
    // @param {id} int
    // @return detail of retriveSalesOrderByID
    retriveSalesOrderByID: (req, res) => {
        const {
            SalesOrderMst,
            SalesOrderDet,
            Component,
            RFQRoHS,
            MfgCodeMst
        } = req.app.locals.models;
        if (req.params.id) {
            return SalesOrderMst.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                model: SalesOrderMst,
                attributes: ['id', 'salesOrderNumber', 'poNumber', 'poDate', 'customerID', 'contactPersonID', 'billingAddressID', 'shippingAddressID',
                    'shippingMethodID', 'revision', 'shippingComment', 'termsID', 'status', 'soDate', 'revisionChangeNote', 'isAddnew',
                    'documentPath', 'salesCommissionTo', 'freeOnBoardId', 'intermediateShipmentId', 'internalComment', 'serialNumber',
                    'carrierID', 'carrierAccountNumber', 'isBlanketPO', 'poRevision', 'isLegacyPO', 'isRmaPO', 'originalPODate', 'linkToBlanketPO',
                    'shippingContactPersonID'],
                include: [{
                    model: MfgCodeMst,
                    as: 'customers',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'mfgName', 'mfgCode'],
                    required: false
                }, {
                    model: SalesOrderDet,
                    as: 'salesOrderDet',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'refSalesOrderID', 'qty', 'partID', 'price', 'mrpQty', 'shippingQty', 'remark', 'materialTentitiveDocDate', 'prcNumberofWeek', 'isHotJob', 'materialDueDate', 'cancleReason', 'isCancle', 'uom', 'tentativeBuild', 'lineID', 'kitQty', 'kitNumber', 'salesCommissionTo', 'refRFQGroupID', 'refRFQQtyTurnTimeID', 'custPOLineNumber', 'partCategory', 'salesOrderDetStatus', 'completeStatusReason', 'isSkipKitCreation', 'partDescription', 'quoteNumber', 'quoteFrom', 'refAssyQtyTurnTimeID', 'assyQtyTurnTimeText', 'internalComment'],
                    required: false,
                    include: [
                        {
                            model: Component,
                            as: 'componentAssembly',
                            where: {
                                isDeleted: false,
                                mfgType: DATA_CONSTANT.MFG_TYPE.MFG
                            },
                            attributes: ['id', 'mfgPN', 'PIDCode', 'rev', 'nickName', 'mfgPNDescription', 'isCustom', 'partType'],
                            required: false,
                            include: [{
                                model: RFQRoHS,
                                as: 'rfq_rohsmst',
                                where: {
                                    isDeleted: false
                                },
                                attributes: ['id', 'name', 'rohsIcon'],
                                required: false
                            },
                            {
                                model: MfgCodeMst,
                                as: 'mfgCodemst',
                                where: {
                                    isDeleted: false
                                },
                                attributes: ['id', 'mfgCode', 'mfgName'],
                                required: false
                            }
                            ]
                        }
                    ]
                }
                ]
            }).then((salesorder) => {
                if (!salesorder) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(salesOrderModuleName),
                        err: null,
                        data: null
                    });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, salesorder, null);
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
    // Get detail of SalesOrder
    // GET : /api/v1/retrieveSalesOrderDetail
    // @param {id} int
    // @return detail of SalesOrder
    retrieveSalesOrderDetail: async (req, res) => {
        const {
            sequelize,
            GenericCategory,
            CustomerAddresses,
            SalesOrderDet,
            SalesorderdetCommissionAttributeMstDet,
            SalesorderdetCommissionAttribute,
            SalesShippingMst,
            Component,
            Workorder,
            WorkorderSalesOrderDetails,
            CountryMst,
            MfgCodeMst,
            SalesOrderMst,
            UOMs,
            RFQRoHS,
            RFQAssyQuantity,
            Employee,
            RFQAssyQuantityTurnTime,
            SalesOrderOtherExpenseDetail,
            ComponentPriceBreakDetails,
            CustomerPackingSlipDet,
            CustomerPackingSlip,
            AssemblyStock
        } = req.app.locals.models;
        if (req.params.id) {
            let functionDetail = [];
            let mfgCodeFormat = null;
            try {
                functionDetail = await sequelize.query('Select fun_getTimeZone() as TimeZone,fun_getDateTimeFormat() as dateFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });
                mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return await SalesOrderDet.findAll({
                where: {
                    refSalesOrderID: req.params.id,
                    isDeleted: false
                },
                model: SalesOrderDet,
                attributes: ['id', 'refSalesOrderID', 'qty', 'partID', 'price', 'mrpQty', 'shippingQty', 'remark', 'materialTentitiveDocDate', 'prcNumberofWeek', 'isHotJob', 'materialDueDate', 'cancleReason', 'isCancle', 'uom', 'tentativeBuild', 'lineID', 'kitQty', 'kitNumber', 'salesCommissionTo', 'refRFQGroupID', 'refRFQQtyTurnTimeID', 'custPOLineNumber', 'partCategory', 'salesOrderDetStatus', 'completeStatusReason', 'isSkipKitCreation', 'partDescription', 'quoteNumber', 'quoteFrom', 'refAssyQtyTurnTimeID', 'assyQtyTurnTimeText', 'internalComment', [sequelize.literal('fun_getUserNameByID(SalesOrderDet.updatedBy)'), 'updatedbyValue'], [sequelize.literal('fun_getUserNameByID(SalesOrderDet.createdBy)'), 'createdBy'], [sequelize.literal('fun_getRoleByID(SalesOrderDet.createByRoleId)'), 'createdbyRole'], [sequelize.literal('fun_getRoleByID(SalesOrderDet.updateByRoleId)'), 'updatedbyRole'], 'isCustomerConsign', 'frequency', 'refSODetID', 'refSOReleaseLineID', 'originalPOQty', 'frequencyType', 'refBlanketPOID', 'releaseLevelComment', 'custOrgPOLineNumber', 'requestedBPOStartDate', 'blanketPOEndDate',
                    [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('SalesOrderDet.createdAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'createdAtValue'],
                    [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('SalesOrderDet.UpdatedAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'updatedAt']],
                include: [{
                    model: UOMs,
                    as: 'UOMs',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'unitName'],
                    required: false
                },
                {
                    model: SalesOrderDet,
                    as: 'salesOrderBlanketPO',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'refSalesOrderID'],
                    required: false,
                    include: [{
                        model: SalesOrderMst,
                        as: 'salesOrderMst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'salesOrderNumber', 'poNumber'],
                        required: false
                    }]
                },
                {
                    model: SalesOrderDet,
                    as: 'salesOrderBlanketPODet',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'qty'],
                    required: false,
                    include: [{
                        model: CustomerPackingSlipDet,
                        as: 'customerPackingSlipDet',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['shipQty', 'id', 'shippingId'],
                        required: false,
                        include: [{
                            model: CustomerPackingSlip,
                            as: 'customerPackingSlip',
                            where: {
                                isDeleted: false,
                                transType: 'P'
                            },
                            attributes: ['transType', 'id'],
                            required: false
                        }]
                    }]
                },
                {
                    model: CustomerPackingSlipDet,
                    as: 'customerPackingSlipDet',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['shipQty', 'id'],
                    required: false,
                    include: [{
                        model: CustomerPackingSlip,
                        as: 'customerPackingSlip',
                        where: {
                            isDeleted: false,
                            transType: 'P'
                        },
                        attributes: ['transType', 'id'],
                        required: false
                    }]
                },
                {
                    model: SalesShippingMst,
                    as: 'salesShippingDet',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['shippingID', 'sDetID', 'qty', 'shippingDate', 'shippingMethodID', 'shippingAddressID', 'description', 'priority', 'packingSlipNo', 'invoiceNo', 'releaseNotes', 'promisedShipDate', 'releaseNumber', 'requestedDockDate', 'carrierID', 'carrierAccountNumber', 'customerReleaseLine', [sequelize.literal('fun_getUserNameByID(salesShippingDet.updatedBy)'), 'updatedbyValue'], [sequelize.literal('fun_getUserNameByID(salesShippingDet.createdBy)'), 'createdBy'], [sequelize.literal('fun_getRoleByID(salesShippingDet.createByRoleId)'), 'createdbyRole'], [sequelize.literal('fun_getRoleByID(salesShippingDet.updateByRoleId)'), 'updatedbyRole'],
                        [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('salesShippingDet.createdAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'createdAtValue'],
                        [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('salesShippingDet.UpdatedAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'updatedAt'], 'revisedRequestedDockDate', 'revisedRequestedShipDate', 'revisedRequestedPromisedDate', 'isAgreeToShip', 'refShippingLineID', 'poReleaseNumber', 'shippingContactPersonID'],
                    required: false,
                    include: [{
                        model: CustomerPackingSlipDet,
                        as: 'customerPackingSlipDet',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['shipQty', 'id'],
                        required: false,
                        include: [{
                            model: CustomerPackingSlip,
                            as: 'customerPackingSlip',
                            where: {
                                isDeleted: false,
                                transType: 'P'
                            },
                            attributes: ['transType', 'id'],
                            required: false
                        }]
                    },
                    {
                        model: GenericCategory,
                        as: 'shippingMethodSalesOrder',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode'],
                        required: false
                    },
                    {
                        model: GenericCategory,
                        as: 'carrierSalesOrder',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode'],
                        required: false
                    },
                    {
                        model: CustomerAddresses,
                        as: 'customerSalesShippingAddress',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'street1', 'city', 'state', 'countryID', 'postcode', 'isActive'],
                        required: false,
                        include: [{
                            model: CountryMst,
                            as: 'countryMst',
                            attributes: ['countryName']
                        }]
                    }
                    ]
                },
                {
                    model: SalesOrderOtherExpenseDetail,
                    as: 'salesOrderOtherExpenseDetails',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'refSalesOrderDetID', 'qty', 'price', 'partID', 'frequency', 'lineComment', 'lineInternalComment', 'frequencyType', 'refReleaseLineID'],
                    required: false
                },
                {
                    model: Employee,
                    as: 'employees',
                    where: {
                        isDeleted: false
                    },
                    attributes: [
                        [sequelize.literal('CONCAT(\'(\',employees.initialName,\') \',employees.firstName , \' \' , employees.lastName)'), 'fullName']
                    ],
                    required: false
                },
                {
                    model: RFQAssyQuantityTurnTime,
                    as: 'rfqAssyQuantityTurnTime',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'rfqAssyQtyID', 'turnTime', 'unitOfTime'],
                    required: false,
                    include: [{
                        model: RFQAssyQuantity,
                        as: 'rfqAssyQuantity',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'requestQty'],
                        required: false
                    }]
                },
                {
                    model: Component,
                    as: 'componentAssembly',
                    where: {
                        isDeleted: false,
                        mfgType: DATA_CONSTANT.MFG_TYPE.MFG
                    },
                    attributes: ['id', 'mfgPN', 'PIDCode', 'rev', 'nickName', 'mfgPNDescription', 'isCustom', 'partType'],
                    required: false,
                    include: [{
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'name', 'rohsIcon'],
                        required: false
                    },
                    {
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'mfgCode', 'mfgName', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('componentAssembly->mfgCodemst.mfgCode'), sequelize.col('componentAssembly->mfgCodemst.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
                        required: false
                    },
                    {
                        model: Workorder,
                        as: 'workorder',
                        where: {
                            isDeleted: false,
                            woStatus: 1
                        },
                        attributes: ['woID', 'woStatus', 'woSubStatus'],
                        required: false
                    }
                    ]
                },
                {
                    model: WorkorderSalesOrderDetails,
                    as: 'SalesOrderDetails',
                    where: {
                        isDeleted: false
                    },
                    attributes: WO_SO_FIELDS,
                    required: false,
                    include: [{
                        model: Workorder,
                        as: 'WoSalesOrderDetails',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['woID', 'woNumber'],
                        required: false
                    }]
                }, {
                    model: ComponentPriceBreakDetails,
                    as: 'ComponentPriceBreakDetails',
                    /* where: {
                        isDeleted: false
                    },*/
                    attributes: ['id', 'mfgPNID', 'priceBreak', 'unitPrice', 'type', 'turnTime', 'unitOfTime', 'rfqNumber'],
                    required: false,
                    paranoid: false
                },
                {
                    model: SalesorderdetCommissionAttributeMstDet,
                    as: 'salesorderdetCommissionAttributeMstDet',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'refSalesorderdetID', 'unitPrice', 'commissionPercentage', 'commissionValue',
                        'quoted_commissionPercentage', 'quoted_commissionValue', 'salesCommissionNotes', 'partID', 'refComponentSalesPriceBreakID', 'quoted_unitPrice', 'type', 'commissionCalculateFrom', 'poQty', 'quotedQty', 'rfqAssyID'],
                    required: false,
                    include: [{
                        model: SalesorderdetCommissionAttribute,
                        as: 'commissionSalesorderdetCommissionAttribute',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'refSalesorderdetID', 'refSalesCommissionID', 'unitPrice', 'refQuoteAttributeId', 'commissionPercentage', 'commissionValue',
                            'org_unitPrice', 'org_commissionPercentage', 'org_commissionValue', 'partID', 'category'],
                        required: false
                    }]
                },
                {
                    model: AssemblyStock,
                    as: 'InitialStock',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'refSalesOrderDetID'],
                    required: false
                }]
            }).then(salesorder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, salesorder, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return await resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Create SalesOrder
    // POST : /api/v1/SalesOrder
    // @return New create SalesOrder detail
    createSalesOrder: (req, res) => {
        const {
            sequelize,
            SalesOrderMst
        } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.transaction().then(t => SalesOrderMst.findAll({
                // where: { soDate: req.body.soDate, isDeleted: false },
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('date', sequelize.col('soDate')), '=', req.body.soDate)
                    ]
                },
                paranoid: false,
                transaction: t
            }).then((salesorders) => {
                COMMON.setSalesOrder(req, salesorders.length);
                return getSystemIdPromise(req, res, DATA_CONSTANT.SONUMBER_SYSID, t).then((response) => {
                    if (response.status === STATE.SUCCESS) {
                        req.body.serialNumber = response.systemId;
                        // req.body.soDate = req.body.soDateValue;
                        return SalesOrderMst.create(req.body, {
                            fields: inputFields,
                            transaction: t
                        }).then((salesorder) => {
                            // [S] add log of create sales order details for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: SalesOrderConstObj.CREATE.title,
                                eventDescription: COMMON.stringFormat(SalesOrderConstObj.CREATE.description, salesorder.salesOrderNumber, req.user.username),
                                refTransTable: SalesOrderConstObj.refTransTableName,
                                refTransID: salesorder.id,
                                eventType: timelineObjForSalesOrder.id,
                                url: COMMON.stringFormat(SalesOrderConstObj.url, salesorder.id),
                                eventAction: timelineEventActionConstObj.CREATE
                            };
                            req.objEvent = objEvent;
                            // [E] add log of create sales order details for timeline users

                            return t.commit().then(() => {
                                req.params = {
                                    id: salesorder.id
                                };
                                TimelineController.createTimeline(req, res, null);
                                EnterpriseSearchController.manageSalesOrderInElastic(req);
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, salesorder, MESSAGE_CONSTANT.CREATED(DATA_CONSTANT.SALESORDER_MST.Name))
                            });

                            // return resHandler.successRes(res, 201, STATE.SUCCESS, salesorder, MESSAGE_CONSTANT.CREATED(DATA_CONSTANT.SALESORDER_MST.Name));
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
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
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                }
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

    // Update SalesOrder
    // PUT : /api/v1/SalesOrder
    // @param {id} int
    // @return Updated SalesOrder details
    updateSalesOrder: (req, res) => {
        const {
            SalesOrderMst,
            sequelize
        } = req.app.locals.models;
        if (req.params.id) {
            const currentModuleName = salesOrderModuleName;
            COMMON.setModelUpdatedByFieldValue(req);
            return SalesOrderMst.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                model: SalesOrderMst,
                attributes: inputFields
            }).then((saelsObj) => {
                if (!saelsObj) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(currentModuleName),
                        err: null,
                        data: null
                    });
                }
                if (saelsObj && req.body.isSOrevision) {
                    req.body.revision = parseInt(saelsObj.revision || 0) + 1;
                    if (req.body.revision < 10) {
                        req.body.revision = COMMON.stringFormat('0{0}', req.body.revision);
                    }
                }
                return sequelize.transaction().then(t => SalesOrderMst.update(req.body, {
                    where: {
                        id: req.params.id,
                        isDeleted: false
                    },
                    fields: inputFields,
                    transaction: t
                }).then((rowsUpdated) => {
                    if (rowsUpdated && rowsUpdated[0] === 1) {
                        // [S] add log of update sales order details for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: SalesOrderConstObj.UPDATE.title,
                            eventDescription: COMMON.stringFormat(SalesOrderConstObj.UPDATE.description, req.body.salesOrderNumber, req.user.username),
                            refTransTable: SalesOrderConstObj.refTransTableName,
                            refTransID: req.params.id,
                            eventType: timelineObjForSalesOrder.id,
                            url: COMMON.stringFormat(SalesOrderConstObj.url, req.params.id),
                            eventAction: timelineEventActionConstObj.UPDATE
                        };
                        req.objEvent = objEvent;
                        // [E] add log of update sales order details for timeline users
                        // Add Component Detail into Elastic Search Engine for Enterprise Search
                        return t.commit().then(() => {
                            TimelineController.createTimeline(req, res, null);
                            EnterpriseSearchController.manageSalesOrderDetailInElastic(req);
                            EnterpriseSearchController.manageSalesOrderInElastic(req);
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(currentModuleName));
                        });
                    } else {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.NOT_UPDATED(currentModuleName),
                            err: null,
                            data: null
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Create/Updated SalesOrder Details
    // PUT : /api/v1/createUpdateSalesOrderDetails
    // @param {id} int
    // @return Updated SalesOrder details
    createUpdateSalesOrderDetails: (req, res) => {
        const {
            SalesOrderDet,
            Component,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            if (req.body.id) {
                if (req.body.quoteFrom === DATA_CONSTANT.SUPPLIER_QUOTE_FROM.FromPartMaster && !req.body.refAssyQtyTurnTimeID) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                } else {
                    return SalesOrderDet.findOne({
                        where: {
                            id: req.body.id,
                            isDeleted: false
                        },
                        attributes: ['id', 'partID', 'qty', 'mrpQty', 'kitQty', 'isSkipKitCreation', 'lineID', 'kitNumber', 'refBlanketPOID'],
                        include: [{
                            model: Component,
                            as: 'componentAssembly',
                            where:{
                                isDeleted: false,
                                mfgType: DATA_CONSTANT.MFG_TYPE.MFG
                            },
                            attributes: ['id', 'PIDCode']
                        }]
                    }).then((salesdetail) => {
                        if (!salesdetail) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.NOT_FOUND(salesOrderModuleName),
                                err: null,
                                data: null
                            });
                        }
                        COMMON.setModelUpdatedByFieldValue(req);
                        return module.exports.getKitNumberByPartId(req, res, req.body, req.body.id).then((KitNumber) => {
                            return module.exports.salesOrderDetailSkipKitValidation(req, res, true).then((validate) => { // skip kit validation
                                if (validate && validate.skipKitConfirmation) {
                                    const skipKitConfirmationAndError = [];
                                    skipKitConfirmationAndError.push({ // bind custom array to show details on ui
                                        id: req.body.id,
                                        lineID: req.body.lineID,
                                        partID: req.body.partID,
                                        PIDCode: req.body.PIDCode,
                                        kitNumber: req.body.kitNumber,
                                        skipKitConfirmation: true
                                    });
                                    const skipKitErrors = {
                                        skiptKitError: true,
                                        skipKitConfirmationAndError: skipKitConfirmationAndError
                                    };
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: null,
                                        err: null,
                                        data: skipKitErrors
                                    });
                                } else {
                                    if (KitNumber) {
                                        req.body.kitNumber = req.body.partCategory === DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID ? KitNumber : null;
                                    } else if (!KitNumber && req.body.partCategory === DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID) {
                                        req.body.kitNumber = null; // null kit number if kit creation skipped
                                    }

                                    return sequelize.transaction().then(t => SalesOrderDet.update(req.body, {
                                        where: {
                                            id: req.body.id,
                                            isDeleted: false
                                        },
                                        fields: salesDetInputFields,
                                        transaction: t
                                    }).then(() => {
                                        const objSO = {
                                            id: req.body.refSalesOrderID,
                                            isSOrevision: req.body.isSOrevision,
                                            isAskForVersionConfirmation: req.body.isAskForVersionConfirmation
                                        }
                                        return module.exports.saveRfqSalesCommissionDetails(req, res, req.body.partID, req.body.id, t, req.body).then((commission) => {
                                            if (commission.status === STATE.SUCCESS) {
                                                return module.exports.saveRfqAssemblyDetailWinLost(req, t, req.body).then(() => {
                                                    return module.exports.removeSalesShippingDetails(req, salesdetail.refBlanketPOID, req.body.id, salesdetail.refBlanketPOID && !req.body.refBlanketPOID ? true : false, false, t).then(() => {
                                                        return module.exports.checkForSORevisionUpdate(req, res, objSO, t).then(() => {
                                                            if (salesdetail && ((salesdetail.qty !== req.body.qty || salesdetail.mrpQty !== req.body.mrpQty || salesdetail.kitQty !== req.body.kitQty || salesdetail.partID !== req.body.partID) || salesdetail.isSkipKitCreation !== req.body.isSkipKitCreation)) {
                                                                return sequelize.query('CALL Sproc_CreateKitAllocationConsolidateLine (:pRefSalesOrderDetId, :pAssyId, :pUserId, :pRoleId)', {
                                                                    replacements: {
                                                                        pRefSalesOrderDetId: req.body.id,
                                                                        pAssyId: req.body.partID,
                                                                        pUserId: req.user.id,
                                                                        pRoleId: req.user.defaultLoginRoleID
                                                                    },
                                                                    type: sequelize.QueryTypes.SELECT,
                                                                    transaction: t
                                                                }).then((insertConsolidate) => {
                                                                    const consolidateList = _.values(insertConsolidate[0]);
                                                                    if (consolidateList && consolidateList.length > 0) {
                                                                        let actionStatus;
                                                                        let isQtyChange;
                                                                        if (salesdetail.isSkipKitCreation === req.body.isSkipKitCreation) {
                                                                            actionStatus = 'UPDATE';
                                                                        } else if (salesdetail.isSkipKitCreation === true && req.body.isSkipKitCreation === false) {
                                                                            actionStatus = 'CREATE';
                                                                        } else if (salesdetail.isSkipKitCreation === false && req.body.isSkipKitCreation === true) {
                                                                            actionStatus = 'DELETE';
                                                                        } else {
                                                                            actionStatus = 'UPDATE';
                                                                        }
                                                                        if (salesdetail.partID !== req.body.partID || salesdetail.isSkipKitCreation !== req.body.isSkipKitCreation) {
                                                                            isQtyChange = false;
                                                                        } else {
                                                                            isQtyChange = true;
                                                                        }
                                                                        return sequelize
                                                                            .query('CALL Sproc_CreateKitAllocationAssyDetail (:pPartID,:pSalesOrderDetailID,:pKitQty,:pMrpQty,:pUserID,:pActionStatus,:pRoleID, :pIsOnlyQtyChange)', {
                                                                                replacements: {
                                                                                    pPartID: req.body.partID,
                                                                                    pSalesOrderDetailID: req.body.id,
                                                                                    pKitQty: req.body.kitQty,
                                                                                    pMrpQty: req.body.mrpQty,
                                                                                    pUserID: req.user.id,
                                                                                    pActionStatus: actionStatus,
                                                                                    pRoleID: req.user.defaultLoginRoleID,
                                                                                    pIsOnlyQtyChange: isQtyChange
                                                                                },
                                                                                type: sequelize.QueryTypes.SELECT,
                                                                                transaction: t
                                                                            }).then(() => {
                                                                                if (salesdetail.partID !== parseInt(req.body.partID)) {
                                                                                    req.body.isAssyChange = true;
                                                                                }
                                                                                req.body.userInitialName = req.user.employee.initialName;
                                                                                RFQSocketController.sendSalesOrderKitMRPQtyChanged(req, {
                                                                                    notifyFrom: 'update-sales-order-detail',
                                                                                    data: req.body
                                                                                });
                                                                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED('Sales Order Detail')));
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
                                                                        if (salesdetail.partID !== parseInt(req.body.partID)) {
                                                                            req.body.isAssyChange = true;
                                                                        }

                                                                        req.body.userInitialName = req.user.employee.initialName;
                                                                        RFQSocketController.sendSalesOrderKitMRPQtyChanged(req, {
                                                                            notifyFrom: 'update-sales-order-detail',
                                                                            data: req.body
                                                                        });
                                                                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED('Sales Order Detail')));
                                                                    }
                                                                });
                                                            } else {
                                                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED('Sales Order Detail')));
                                                            }
                                                        });
                                                    });
                                                })
                                            } else {
                                                console.trace();
                                                console.error();
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: commission.error,
                                                    data: null
                                                });
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
                                    }));
                                }
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
            } else {
                COMMON.setModelCreatedByFieldValue(req);
                return module.exports.getKitNumberByPartId(req, res, req.body, null).then((KitNumber) => {
                    if (KitNumber) {
                        req.body.kitNumber = req.body.partCategory === DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID ? KitNumber : null;
                    } else if (!KitNumber && req.body.partCategory === DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID) {
                        req.body.kitNumber = null;
                    }
                    if (req.body.quoteFrom === DATA_CONSTANT.SUPPLIER_QUOTE_FROM.FromPartMaster && !req.body.refAssyQtyTurnTimeID) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    } else {
                        return sequelize.transaction().then(t => SalesOrderDet.create(req.body, {
                            fields: salesDetInputFields,
                            transaction: t
                        }).then(salesdetail => module.exports.saveRfqSalesCommissionDetails(req, res, req.body.partID, salesdetail.id, t, req.body).then((commission) => {
                            if (commission.status === STATE.SUCCESS) {
                                return module.exports.saveRfqAssemblyDetailWinLost(req, t, req.body).then((responseAssy) => {
                                    const objSO = {
                                        id: req.body.refSalesOrderID,
                                        isSOrevision: req.body.isSOrevision,
                                        isAskForVersionConfirmation: req.body.isAskForVersionConfirmation
                                    }
                                    return module.exports.checkForSORevisionUpdate(req, res, objSO, t).then(() => {
                                        if (responseAssy === STATE.SUCCESS) {
                                            return sequelize.query('CALL Sproc_CalculateAndCreateKitAllocationAssyDetail (:pSalesOrderID,:pUserID,:pRoleID)', {
                                                replacements: {
                                                    pSalesOrderID: req.body.refSalesOrderID,
                                                    pUserID: req.user.id,
                                                    pRoleID: req.user.defaultLoginRoleID
                                                },
                                                type: sequelize.QueryTypes.SELECT,
                                                transaction: t
                                            }).then(() => {
                                                // Add SO Detail into Elastic Search Engine for Enterprise Search
                                                t.commit().then(() => {
                                                    req.params = {
                                                        id: req.body.refSalesOrderID
                                                    };
                                                    EnterpriseSearchController.manageSalesOrderDetailInElastic(req);
                                                    EnterpriseSearchController.manageSalesOrderInElastic(req);
                                                    req.body.id = salesdetail.id;
                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.CREATED('Sales Order Detail'));
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
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: null,
                                                data: null
                                            });
                                        }
                                    })
                                }).catch((err) => {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                })
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                console.trace();
                                console.error();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: commission.error,
                                    data: null
                                });
                            }
                        }
                        )).catch((err) => {
                            if (t && !t.finished) {
                                t.rollback();
                            }
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
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // check for revision update
    checkForSORevisionUpdate: (req, res, objSO, t) => {
        const {
            SalesOrderMst
        } = req.app.locals.models;
        return SalesOrderMst.findOne({
            where: {
                id: objSO.id,
                isDeleted: false
            },
            model: SalesOrderMst,
            attributes: inputFields,
            transaction: t
        }).then((saelsObj) => {
            if (saelsObj) {
                objSO.revision = saelsObj.revision;
                objSO.updatedBy = req.user.id;
                objSO.updateByRoleId = req.user.defaultLoginRoleID;
                if (objSO.isSOrevision) {
                    objSO.revision = parseInt(saelsObj.revision || 0) + 1;
                    if (objSO.revision < 10) {
                        objSO.revision = COMMON.stringFormat('0{0}', objSO.revision);
                    }
                }
                return SalesOrderMst.update(objSO, {
                    where: {
                        id: objSO.id,
                        isDeleted: false
                    },
                    fields: ['revision', 'isAskForVersionConfirmation', 'updatedBy', 'updateByRoleId'],
                    transaction: t
                }).then(() => { return STATE.SUCCESS; }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                })
            } else { return STATE.FAILED; }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    createSalesOrderShippingDetailInUpdateSalesOrder: (req, res, createsale, sales, salesShippPromise, t) => {
        const {
            SalesShippingMst,
            SalesOrderOtherExpenseDetail
        } = req.app.locals.models;
        // Add Sales Order Detail into Elastic Search Engine for Enterprise Search
        req.params = {
            id: req.params.id,
            saleOrderDetId: createsale.id
        };

        EnterpriseSearchController.manageSalesOrderDetailInElastic(req);
        EnterpriseSearchController.manageSalesOrderInElastic(req);
        _.each(sales.SalesDetail, (shipping) => {
            shipping.createdBy = req.body.createdBy;
            shipping.sDetID = createsale.id;
            salesShippPromise.push(SalesShippingMst.create(shipping, {
                fields: salesShippingInputFields,
                transaction: t
            }).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            }));
        });
        _.each(sales.SalesOtherDetail, (sOtherDet) => {
            sOtherDet.createdBy = req.body.createdBy;
            sOtherDet.updatedBy = req.body.createdBy;
            sOtherDet.refSalesOrderDetID = createsale.id;
            salesShippPromise.push(SalesOrderOtherExpenseDetail.create(sOtherDet, {
                fields: salesOtherExpenseInputFields,
                transaction: t
            }).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            }));
        });

        return Promise.all(salesShippPromise).then(resp => resp);
    },
    updateSalesOrderShippingDetailInUpdateSalesOrder: (req, res, item, t) => {
        const {
            SalesShippingMst,
            SalesOrderOtherExpenseDetail
        } = req.app.locals.models;
        // Update Sales Order Detail into Elastic Search Engine for Enterprise Search
        req.params = {
            id: req.params.id,
            saleOrderDetId: item.id
        };
        EnterpriseSearchController.manageSalesOrderDetailInElastic(req);
        EnterpriseSearchController.manageSalesOrderInElastic(req);
        return SalesShippingMst.findAll({
            where: {
                sDetID: item.id,
                isDeleted: false
            },
            attributes: ['shippingID'],
            transaction: t
        }).then(shippinglist => SalesOrderOtherExpenseDetail.findAll({
            where: {
                refSalesOrderDetID: item.id,
                isDeleted: false
            },
            attributes: ['id'],
            transaction: t
        }).then((otherDetList) => {
            let updateshipping = _.filter(item.SalesDetail, itemUpdate => itemUpdate.shippingID);
            const createshipping = _.filter(item.SalesDetail, itemCreate => !itemCreate.shippingID);
            const shippingIds = _.map(updateshipping, 'shippingID');
            const shippingdetIds = _.map(shippinglist, 'shippingID');
            const removeshipping = _.difference(shippingdetIds, shippingIds);
            _.each(removeshipping, (itemRemove) => {
                updateshipping = _.reject(updateshipping, o => parseInt(o.shippingID) === parseInt(itemRemove));
            });
            const shippingPromise = [];
            if (removeshipping.length > 0) {
                COMMON.setModelDeletedByFieldValue(req);
                const obj = {
                    deletedBy: req.body.deletedBy,
                    deletedAt: req.body.deletedAt,
                    isDeleted: req.body.isDeleted,
                    updateByRoleId: req.body.updateByRoleId,
                    deleteByRoleId: req.body.deleteByRoleId
                };
                shippingPromise.push(SalesShippingMst.update(obj, {
                    where: {
                        shippingID: {
                            [Op.in]: removeshipping
                        }
                    },
                    transaction: t
                }).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            }
            if (createshipping.length > 0) {
                COMMON.setModelCreatedByFieldValue(req);
                _.each(createshipping, (sales) => {
                    sales.sDetID = item.id;
                    sales.createdBy = req.body.createdBy;
                    sales.updateByRoleId = req.body.updateByRoleId;
                    sales.createByRoleId = req.body.createByRoleId;

                    shippingPromise.push(SalesShippingMst.create(sales, {
                        fields: salesShippingInputFields,
                        transaction: t
                    }).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                });
            }
            if (updateshipping.length > 0) {
                COMMON.setModelUpdatedByFieldValue(req);
                _.each(updateshipping, (shipping) => {
                    shipping.updatedBy = req.body.updatedBy;
                    shipping.updateByRoleId = req.body.updateByRoleId;
                    shippingPromise.push(SalesShippingMst.update(shipping, {
                        where: {
                            shippingID: shipping.shippingID
                        },
                        fields: salesShippingInputFields,
                        transaction: t
                    }).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                });
            }
            // sales order other expense block
            let updateexpense = _.filter(item.SalesOtherDetail, itemUpdate => itemUpdate.id);
            const createexpense = _.filter(item.SalesOtherDetail, itemCreate => !itemCreate.id);
            const expenseIds = _.map(updateexpense, 'id');
            const expensedetIds = _.map(otherDetList, 'id');
            const removeexpense = _.difference(expensedetIds, expenseIds);
            _.each(removeexpense, (itemRemove) => {
                updateexpense = _.reject(updateexpense, o => parseInt(o.id) === parseInt(itemRemove));
            });
            if (removeexpense.length > 0) {
                COMMON.setModelDeletedByFieldValue(req);
                const obj = {
                    deletedBy: req.user.id,
                    deletedAt: req.body.deletedAt,
                    isDeleted: true,
                    updateByRoleId: req.user.defaultLoginRoleID,
                    deleteByRoleId: req.user.defaultLoginRoleID
                };
                shippingPromise.push(SalesOrderOtherExpenseDetail.update(obj, {
                    where: {
                        id: {
                            [Op.in]: removeexpense
                        }
                    },
                    transaction: t
                }).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            }
            if (createexpense.length > 0) {
                COMMON.setModelCreatedByFieldValue(req);
                _.each(createexpense, (sOtherDet) => {
                    sOtherDet.refSalesOrderDetID = item.id;
                    sOtherDet.createdBy = req.user.id;
                    sOtherDet.updateByRoleId = req.user.defaultLoginRoleID;
                    sOtherDet.createByRoleId = req.user.defaultLoginRoleID;
                    sOtherDet.updatedBy = req.user.id;
                    shippingPromise.push(SalesOrderOtherExpenseDetail.create(sOtherDet, {
                        fields: salesOtherExpenseInputFields,
                        transaction: t
                    }).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                });
            }
            if (updateexpense.length > 0) {
                COMMON.setModelUpdatedByFieldValue(req);
                _.each(updateexpense, (sOtherDet) => {
                    sOtherDet.updatedBy = req.user.id;
                    sOtherDet.updateByRoleId = req.user.defaultLoginRoleID;
                    shippingPromise.push(SalesOrderOtherExpenseDetail.update(sOtherDet, {
                        where: {
                            id: sOtherDet.id
                        },
                        fields: salesOtherExpenseInputFields,
                        transaction: t
                    }).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                });
            }
            return Promise.all(shippingPromise).then(resp => resp);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        })).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Update Component
    // PUT : /api/v1/SalesOrder
    // @param {id} int
    // @return Updated salesorder details
    deleteSalesOrder: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const currentModuleName = salesOrderModuleName;

        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.SalesOrderMst.Name;
            const entityID = COMMON.AllEntityIDS.SalesOrderMst.ID;
            // Notes: if no sales order details added than remove sales order master details
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: req.body.objIDs.salesOrderID.toString(), // if no sales order details added than remove sales order master details
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((salesOrderDetail) => {
                if (salesOrderDetail.length === 0) {
                    EnterpriseSearchController.deleteSalesOrderInElastic(req.body.objIDs.salesOrderID.toString());
                    EnterpriseSearchController.deleteSalesOrderDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(currentModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: salesOrderDetail,
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
    // get unit measer list
    // PUT : /api/v1/getUnitList
    // @param {id} int
    // @return unit list
    getUnitList: (req, res) => {
        const {
            UOMs
        } = req.app.locals.models;
        return UOMs.findAll({
            where: {
                isDeleted: false
            },
            model: UOMs,
            attributes: ['id', 'unitName', 'abbreviation', 'baseUnitConvertValue', 'baseUnitID']
        }).then(unitlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitlist, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get shipping order list
    // POST : /api/v1/getShippingList
    // @return shipping list
    getShippingList: (req, res) => {
        const {
            SalesOrderMst,
            SalesOrderDet,
            SalesShippingMst,
            sequelize,
            CustomerAddresses,
            GenericCategory,
            ShippedAssembly,
            Component,
            CountryMst,
            MfgCodeMst,
            RFQRoHS
        } = req.app.locals.models;
        if (req.body) {
            return SalesOrderDet.findAll({
                // where: { isDeleted:false,partID:req.body.shippingObj.partID},
                where: {
                    isDeleted: false
                },
                model: SalesOrderDet,
                attributes: ['id', 'qty', 'price'],
                include: [{
                    model: SalesShippingMst,
                    as: 'salesShippingDet',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['shippingID', 'qty', 'shippingDate'],
                    required: false,
                    include: [{
                        model: ShippedAssembly,
                        as: 'shippedAssembly',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'shippedqty'],
                        required: false
                    },
                    {
                        model: CustomerAddresses,
                        as: 'customerSalesShippingAddress',
                        where: {
                            isDeleted: false
                        },
                        // eslint-disable-next-line no-multi-str
                        attributes: ['id', [sequelize.literal('CONCAT(`salesShippingDet->customerSalesShippingAddress`.street1 , \
                                                        \',\', `salesShippingDet->customerSalesShippingAddress`.city, \',\', `salesShippingDet->customerSalesShippingAddress`.state, \',\', \
                                                        `salesShippingDet->customerSalesShippingAddress->countryMst`.`countryName`, \'-\', `salesShippingDet->customerSalesShippingAddress`.postcode)'), 'ShippingAddress']],
                        required: false,
                        include: [{
                            model: CountryMst,
                            as: 'countryMst',
                            attributes: ['countryName']
                        }]
                    },
                    {
                        model: GenericCategory,
                        as: 'shippingMethodSalesOrder',
                        where: {
                            isDeleted: false,
                            isActive: true
                        },
                        attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode'],
                        required: false
                    }
                    ]
                },
                {
                    model: Component,
                    as: 'componentAssembly',
                    where: {
                        isDeleted: false,
                        mfgType: DATA_CONSTANT.MFG_TYPE.MFG
                    },
                    attributes: ['id', 'mfgPN', 'PIDCode', 'rev', 'nickName', 'isCustom'],
                    required: false,
                    include: [{
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        attributes: ['id', 'name', 'rohsIcon']
                    }]
                },
                {
                    model: SalesOrderMst,
                    as: 'salesOrderMst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'salesOrderNumber', 'customerID'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'customers',
                        attributes: ['id', 'mfgName', 'mfgCode'],
                        required: false
                    }, {
                        model: GenericCategory,
                        as: 'shippingMethod',
                        where: {
                            isDeleted: false,
                            isActive: true
                        },
                        attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode'],
                        required: false
                    },
                    {
                        model: CustomerAddresses,
                        as: 'customerShippingAddress',
                        where: {
                            isDeleted: false
                        },
                        // eslint-disable-next-line no-multi-str
                        attributes: ['id', [sequelize.literal('CONCAT(`salesOrderMst->customerShippingAddress`.street1 , \',\' ,`salesOrderMst->customerShippingAddress`.city,\',\', \
                                                          `salesOrderMst->customerShippingAddress`.state, \',\', `salesOrderMst->customerShippingAddress->countryMst`.`countryName`, \'-\', \
                                                        `salesOrderMst->customerShippingAddress`.postcode)'), 'ShippingAddress']],
                        required: false,
                        include: [{
                            model: CountryMst,
                            as: 'countryMst',
                            attributes: ['countryName']
                        }]
                    }
                    ]
                }
                ]
            }).then(shippinglist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, shippinglist, null)).catch((err) => {
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

    // get all sales order list customer wise(Revised api)
    // PUT : /api/v1/getAllSalesOrderList
    // @return getAllSalesOrderList
    getAllSalesOrderList: (req, res) => {
        if (req.query.refTableName) {
            const {
                SalesOrderMst,
                SalesOrderDet,
                Component,
                sequelize,
                WorkorderSalesOrderDetails,
                Workorder,
                MfgCodeMst,
                WorkorderTransHoldUnhold,
                ContactPerson,
                SalesShippingMst,
                ShippedAssembly,
                RFQRoHS,
                AssemblyStock,
                ComponentBOMSetting
            } = req.app.locals.models;
            MfgCodeMst.findAll({
                where: {
                    isDeleted: false,
                    mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG,
                    isCustOrDisty: true
                },
                attributes: ['id', 'mfgCode', 'mfgName'],
                include: [{
                    model: SalesOrderMst,
                    as: 'salesordermst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'salesOrderNumber', 'poNumber', 'revision', 'poDate', 'soDate', 'status', 'isLegacyPO', 'isRmaPO',
                        [sequelize.fn('fun_getPOTypeByID', sequelize.col('salesordermst.id')), 'poType']],
                    required: false,
                    include: [{
                        model: SalesOrderDet,
                        as: 'salesOrderDet',
                        where: {
                            isDeleted: false,
                            partCategory: DATA_CONSTANT.PART_CATEGORY.SUBASSEMBLY.ID
                        },
                        attributes: ['id', 'partID', 'qty', 'price', 'lineID', 'salesOrderDetStatus'],
                        required: false,
                        include: [{
                            model: Component,
                            as: 'componentAssembly',
                            where: {
                                isDeleted: false,
                                mfgType:DATA_CONSTANT.MFG_TYPE.MFG
                            },
                            attributes: ['id', 'mfgPN', 'PIDCode', 'rev', 'nickName'],
                            required: false,
                            include:[
                                {
                                    model: ComponentBOMSetting,
                                    as: 'componentbomSetting',
                                    attributes: ['refComponentID', 'liveVersion'],
                                }
                            ]
                        },
                        {
                            model: SalesShippingMst,
                            as: 'salesShippingDet',
                            where: {
                                isDeleted: false
                            },
                            attributes: ['qty', 'shippingID'],
                            required: false,
                            include: [{
                                model: ShippedAssembly,
                                as: 'shippedAssembly',
                                where: {
                                    isDeleted: false
                                },
                                attributes: ['id', 'shippedqty'],
                                required: false
                            }]
                        },
                        {
                            model: WorkorderSalesOrderDetails,
                            as: 'SalesOrderDetails',
                            where: {
                                isDeleted: false
                            },
                            attributes: WO_SO_FIELDS,
                            required: false,
                            include: [{
                                model: Workorder,
                                as: 'WoSalesOrderDetails',
                                where: {
                                    isDeleted: false
                                },
                                attributes: ['woID', 'woNumber', 'buildQty', 'woStatus', 'woSubStatus', 'RoHSStatusID', 'woVersion', 'isStopWorkorder', 'createdAt', 'ECORemark', 'FCORemark', 'customerID'],
                                required: true,
                                include: [{
                                    model: WorkorderTransHoldUnhold,
                                    as: 'workorderTransHoldUnhold',
                                    where: {
                                        isDeleted: false
                                    },
                                    attributes: ['woTransHoldUnholdId', 'reason'],
                                    required: false
                                }, {
                                    model: WorkorderSalesOrderDetails,
                                    as: 'WoSalesOrderDetails',
                                    where: {
                                        isDeleted: false
                                    },
                                    attributes: WO_SO_FIELDS,
                                    required: false
                                }, {
                                    model: RFQRoHS,
                                    as: 'rohs',
                                    attributes: ['id', 'name', 'rohsIcon']

                                }]
                            }]
                        },
                        {
                            model: AssemblyStock,
                            as: 'InitialStock',
                            where: {
                                isDeleted: false,
                                type: 'OS'
                            },
                            attributes: ['woNumber', 'poNumber', 'poQty', 'openingStock', 'openingdate', 'refSalesOrderDetID', 'refSalesOrderID'],
                            required: false,
                        }
                        ]
                    }, {
                        model: ContactPerson,
                        as: 'contactPerson',
                        where: {
                            refTransID: { [Op.col]: 'salesordermst.customerID' },
                            refTableName: req.query.refTableName,
                            isDeleted: false
                        },
                        attributes: ['personId', [sequelize.literal('CONCAT(firstName , \' \' , lastName)'), 'fullName']],
                        required: false
                    }]
                }]
            }).then(mfglist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mfglist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
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
    // get work order related operation list
    // POST : /api/v1/getAllWorkOrderOperationList
    // @return operation list
    getAllWorkOrderOperationList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params && req.params.id) {
            const tableName = COMMON.VU_workorder_production_report_stk;
            const whereclause = `\`wo id identity\`=${req.params.id}`;

            return sequelize.query('CALL Sproc_DynamicSQL (:pfields, :ptablename, :pwherecluse, :pgroupby, :porderby)', {
                replacements: {
                    pfields: '*',
                    ptablename: tableName,
                    pwherecluse: whereclause,
                    pgroupby: '',
                    porderby: '`OP Number` ASC'
                }
            }).then(workorderlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workorderlist, null)).catch((err) => {
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

    // get sales order list
    // POST : /api/v1/getSalesOrderList
    // @return sales order list
    getSalesOrderList: (req, res) => {
        const {
            SalesOrderMst,
            SalesOrderDet
        } = req.app.locals.models;
        if (req.body) {
            return SalesOrderDet.findAll({
                where: {
                    partID: req.body.shippingObj.partID,
                    deletedAt: null
                },
                include: [{
                    model: SalesOrderMst,
                    as: 'salesOrderMst',
                    where: {
                        isDeleted: false,
                        status: salesOrderStatus.PUBLISHED
                    },
                    required: true
                }]
            }).then(salesOrderDetail => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, salesOrderDetail, null)).catch((err) => {
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

    // get active sales order details list
    // POST : /api/v1/getActiveSalesOrderDetailsList
    // @return active sales order details list
    getActiveSalesOrderDetailsList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetActiveSalesOrderDetailList (:pPartID, :pWOID, :pCustomerID)', {
                replacements: {
                    pPartID: (req.body.shippingObj && req.body.shippingObj.partID) ? req.body.shippingObj.partID : null,
                    pWOID: (req.body.shippingObj && req.body.shippingObj.woID) ? req.body.shippingObj.woID : null,
                    pCustomerID: (req.body.shippingObj && req.body.shippingObj.customerID) ? req.body.shippingObj.customerID : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response.length === 2 ? _.values(response[0]) : _.values(response[1]), null)).catch((err) => {
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


    // get sub assembly list based on work order
    // POST : /api/v1/getSubAsemblyDetailList
    // @return sub assembly details list based on work order and assembly
    getSubAsemblyDetailList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetSubAsemblyDetailList (:pSODetID, :pPartID, :pWOID, :pCustomerID)', {
                replacements: {
                    pSODetID: (req.body.assyObj && req.body.assyObj.soDetID) ? req.body.assyObj.soDetID : null,
                    pPartID: (req.body.assyObj && req.body.assyObj.partID) ? req.body.assyObj.partID : null,
                    pWOID: (req.body.assyObj && req.body.assyObj.woID) ? req.body.assyObj.woID : null,
                    pCustomerID: (req.body.assyObj && req.body.assyObj.customerID) ? req.body.assyObj.customerID : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response.length === 2 ? _.values(response[0]) : _.values(response[1]), null)).catch((err) => {
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
    // get customer wise sales order detail
    // GET : /api/v1/getCustomerSalesOrderDetail
    // @returnCustomer Sales Order Detail
    getCustomerSalesOrderDetail: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.custID) {
            return sequelize.query('CALL Sproc_getCustomerSalesOrderDetail (:pCustomerId, :pCurrSOId, :pSearchPO, :pSOId)', {
                replacements: {
                    pCustomerId: req.body.custID || null,
                    pCurrSOId: req.body.currSOId || 0,
                    pSearchPO: req.body.searchPO || '',
                    pSOId: req.body.orgSOId || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((saleorder) => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { soList: _.values(saleorder[0]) }, null)).catch((err) => {
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

    // get ready for shipped quantity based on work order and operation combination
    // POST : /api/v1/getValidShippedQty
    // @return ReadyForShipQty
    getValidShippedQty: (req, res) => {
        const {
            VUWorkorderProductionStk
        } = req.app.locals.models;
        if (req.body) {
            return VUWorkorderProductionStk.findOne({
                where: {
                    woID: req.body.workorderObj.woID,
                    woOPID: req.body.workorderObj.woOPID
                },
                paranoid: false,
                attributes: ['StockQty', 'ShippedQty', 'ReadyForShippQty']
            }).then(shippedDetail => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, shippedDetail, null)).catch((err) => {
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

    // get status of sales order already used or not
    // POST : /api/v1/getSalesOrderStatus
    // @return status sales order used in workorder or not
    getSalesOrderStatus: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.param && req.params.id) {
            return sequelize.query('CALL Sproc_GetSalesOrderStatus (:psalesId)', {
                replacements: {
                    psalesId: req.params.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then(saleorder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                sowoList: _.values(saleorder[0]),
                soShipList: _.values(saleorder[1])
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

    // get change history sales order
    // POST :/api/v1/salesorderchangehistory
    // @return change history  sales order  data
    salesorderchangehistory: (req, res) => {
        if (req.body && req.body.soID && req.body.tableName) {
            const {
                sequelize
            } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize
                .query('CALL Sproc_SOChangeHistory (:psoID,:ppageIndex,:precordPerPage,:pOrderBy,:pTableName,:pWhereClause)', {
                    replacements: {
                        psoID: req.body.soID,
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pTableName: req.body.tableName,
                        pWhereClause: strWhere
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(soauditloglist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    salesorderAuditLogList: _.values(soauditloglist[1]),
                    Count: soauditloglist[0][0]['TotalRecord']
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

    // save cancle reason
    // Post :/api/v1/salsorderCancleReason
    // @
    salsorderCancleReason: (req, res) => {
        const currentModuleName = salesOrderModuleName;
        const {
            SalesOrderDet
        } = req.app.locals.models;
        COMMON.setModelUpdatedByFieldValue(req);
        if (req.body && req.body.id) {
            return SalesOrderDet.update(req.body, {
                where: {
                    id: req.body.id,
                    isDeleted: false
                },
                fields: salesDetInputFields
            }).then((canclereason) => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, canclereason, MESSAGE_CONSTANT.UPDATED(currentModuleName))
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

    // Get List of PID List
    // GET : /api/v1/component/getSOAssemblyPIDList
    // @param {id} int
    // @return List of PID with Id
    getSOAssemblyPIDList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize
                .query('CALL Sproc_GetSOPIDList (:customerID, :partID, :psubAssyID, :pSearchObj, :pSalesOrderDetID)', {
                    replacements: {
                        customerID: req.body.customerID ? req.body.customerID : null,
                        partID: req.body.partID ? req.body.partID : null,
                        psubAssyID: req.body.subAssyID ? req.body.subAssyID : null,
                        pSearchObj: req.body.searchObj ? req.body.searchObj : null,
                        pSalesOrderDetID: req.body.salesOrderDetId ? req.body.salesOrderDetId : null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response.length === 2 ? _.values(response[0]) : _.values(response[1]), null)).catch((err) => {
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
    getDataKey: (req, res) => {
        const {
            Settings
        } = req.app.locals.models;
        return Settings.findAll({
            attributes: ['key', 'values']
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
    getSalesOrderDetails: (req, res) => {
        const { SalesOrderDet, Component } = req.app.locals.models;
        if (req.body && req.body.soId) {
            let whereClauase = {
                refSalesOrderID: req.body.soId
            }
            if (req.body.soDetID) {
                whereClauase.id = req.body.soDetID
            }
            SalesOrderDet.findAll({
                where: whereClauase,
                attributes: ['id', 'refSalesOrderID', 'partID', 'custPOLineNumber', 'qty', 'lineID'],
                include: [{
                    model: Component,
                    as: 'componentAssembly',
                    required: false,
                    where :{
                        isDeleted: false,
                        mfgType: DATA_CONSTANT.MFG_TYPE.MFG
                    },
                    attributes: ['id', 'mfgPN', 'PIDCode']
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get List of Sales order bnumber
    // POST : /api/v1/salesorder/getSalesOrderMstNumber
    getSalesOrderMstNumber: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetFilterSalesOrderSearchList (:searchString,:psoID)', {
                replacements: {
                    searchString: req.body.searchString || null,
                    psoID: req.body.soID || null
                }
            }).then(responselist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responselist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get customer all so/po details
    // PUT : /api/v1/salesorder/getCustomerwiseSOPOList
    // @return all so po details by selected customer
    getCustomerwiseSOPOList: (req, res) => {
        if (req.body && req.body.customerID && req.body.refTableName) {
            const {
                SalesOrderMst,
                MfgCodeMst,
                ContactPerson,
                sequelize
            } = req.app.locals.models;
            return MfgCodeMst.findOne({
                where: {
                    isDeleted: false,
                    mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG,
                    isCustOrDisty: true,
                    id: req.body.customerID
                },
                attributes: ['id', 'mfgCode', 'mfgName'],
                include: [{
                    model: SalesOrderMst,
                    as: 'salesordermst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'salesOrderNumber', 'poNumber', 'revision', 'poDate', 'soDate', 'status', 'isLegacyPO'],
                    required: false,
                    include: [{
                        model: ContactPerson,
                        as: 'contactPerson',
                        where: {
                            refTransID: { [Op.col]: 'salesordermst.customerID' },
                            refTableName: req.body.refTableName,
                            isDeleted: false
                        },
                        attributes: ['personId', [sequelize.literal('CONCAT(`salesordermst->contactPerson`.firstName , \' \' , `salesordermst->contactPerson`.lastName)'), 'fullName']],
                        required: false
                    }]
                }]
            }).then(sopolist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, sopolist, null)).catch((err) => {
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

    // get all sales order/assy list customer and so number
    // PUT : /api/v1/salesorder/getCustomerSOwisePOAssyList
    // @return all so wise assy po so details
    getCustomerSOwisePOAssyList: (req, res) => {
        if (req.body.customerID && req.body.salesOrderID) {
            const {
                sequelize
            } = req.app.locals.models;

            return sequelize
                .query('CALL Sproc_GetPOStatusPOAssyDetails (:pcustomerID, :psalesOrderID)', {
                    replacements: {
                        pcustomerID: req.body.customerID,
                        psalesOrderID: req.body.salesOrderID
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(poAssylist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    poWiseAssyList: _.values(poAssylist[0])
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

    // get all assembly list customer po/so wise
    // PUT : /api/v1/salesorder/getCustomerPOwiseWOAssyList
    // @return all assembly list of po/so customer wise
    getCustomerPOwiseWOAssyList: (req, res) => {
        if (req.body.customerID && req.body.salesOrderDetID && req.body.partID) {
            const {
                sequelize
            } = req.app.locals.models;

            return sequelize
                .query('CALL Sproc_GetPOStatusAssyWODetails (:ppartID, :psalesOrderDetailID,:pcustomerID)', {
                    replacements: {
                        ppartID: req.body.partID,
                        psalesOrderDetailID: req.body.salesOrderDetID,
                        pcustomerID: req.body.customerID
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(poAssywiseWOList =>
                    // return resHandler.successRes(res, 200, STATE.SUCCESS, { poAssywiseWOList: _.values(poAssywiseWOList[0]) });
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        poAssywiseWOList: _.values(poAssywiseWOList[0])
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

    // get selected wo details based on customer po/so assy wise
    // PUT : /api/v1/salesorder/getCustomerPOAssywiseWoDetails
    // @return work order details with customer po/so assy wise
    getCustomerPOAssywiseWoDetails: (req, res) => {
        if (req.body.salesOrderDetID && req.body.woID) {
            const {
                SalesOrderMst,
                SalesOrderDet,
                Component,
                WorkorderSalesOrderDetails,
                Workorder,
                MfgCodeMst,
                SalesShippingMst,
                ShippedAssembly,
                RFQRoHS,
                ComponentBOMSetting
            } = req.app.locals.models;

            return Workorder.findOne({
                where: {
                    woID: req.body.woID
                },
                attributes: ['customerID']
            }).then((woDetails) => {
                if (!woDetails) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
                        data: null
                    });
                }

                return MfgCodeMst.findOne({
                    where: {
                        isDeleted: false,
                        mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG,
                        isCustOrDisty: true,
                        id: woDetails.customerID
                    },
                    attributes: ['id', 'mfgCode', 'mfgName'],
                    include: [{
                        model: SalesOrderMst,
                        as: 'salesordermst',
                        where: {
                            isDeleted: false
                            // id:req.body.salesOrderID
                        },
                        attributes: ['id', 'salesOrderNumber', 'poNumber', 'revision', 'poDate', 'soDate', 'status'],
                        required: false,
                        include: [{
                            model: SalesOrderDet,
                            as: 'salesOrderDet',
                            where: {
                                isDeleted: false,
                                // refSalesOrderID:req.body.salesOrderID,
                                // partID: woDetails.partID
                                id: req.body.salesOrderDetID
                            },
                            attributes: ['id', 'partID', 'qty', 'price'],
                            required: true,
                            include: [{
                                model: Component,
                                as: 'componentAssembly',
                                where: {
                                    isDeleted: false,
                                    mfgType: DATA_CONSTANT.MFG_TYPE.MFG
                                    // id: woDetails.partID
                                },
                                attributes: ['id', 'mfgPN', 'PIDCode', 'rev', 'nickName', 'isCustom'],
                                required: false,
                                include:[
                                    {
                                        model: ComponentBOMSetting,
                                        as: 'componentbomSetting',
                                        attributes: ['refComponentID', 'liveVersion'],
                                    }
                                ]
                            },
                            {
                                model: SalesShippingMst,
                                as: 'salesShippingDet',
                                where: {
                                    isDeleted: false
                                },
                                attributes: ['qty', 'shippingID'],
                                required: false,
                                include: [{
                                    model: ShippedAssembly,
                                    as: 'shippedAssembly',
                                    where: {
                                        isDeleted: false,
                                        workorderID: req.body.woID
                                    },
                                    attributes: ['id', 'shippedqty'],
                                    required: false
                                }]
                            },
                            {
                                model: WorkorderSalesOrderDetails,
                                as: 'SalesOrderDetails',
                                where: {
                                    isDeleted: false,
                                    woID: req.body.woID
                                },
                                attributes: WO_SO_FIELDS,
                                required: false,
                                include: [{
                                    model: Workorder,
                                    as: 'WoSalesOrderDetails',
                                    where: {
                                        isDeleted: false,
                                        woID: req.body.woID
                                    },
                                    attributes: ['woID', 'woNumber', 'buildQty', 'woStatus', 'woSubStatus', 'RoHSStatusID', 'woVersion', 'isStopWorkorder', 'createdAt', 'ECORemark', 'FCORemark'],
                                    required: true,
                                    include: [{
                                        model: WorkorderSalesOrderDetails,
                                        as: 'WoSalesOrderDetails',
                                        where: {
                                            isDeleted: false,
                                            woID: req.body.woID
                                        },
                                        attributes: WO_SO_FIELDS,
                                        required: false
                                    }, {
                                        model: RFQRoHS,
                                        as: 'rohs',
                                        attributes: ['id', 'name', 'rohsIcon']

                                    }]
                                }]
                            }
                            ]
                        }]
                    }]
                }).then(woAssyList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, woAssyList, null)).catch((err) => {
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

    // save and update sales order plann detail
    // POST: /api/v1/salesorder/savePlannPurchaseDetail
    // @return Planned purchase details
    savePlannPurchaseDetail: (req, res) => {
        const {
            SalesOrderPlanDetailsMst,
            sequelize
        } = req.app.locals.models;
        if (req.body.plannObj) {
            const salesOrderDetID = req.body.plannObj.salesOrderDetID;
            const plannDetailList = req.body.plannObj.plannDetailList;
            return sequelize.transaction().then((t) => {
                SalesOrderPlanDetailsMst.findAll({
                    attributes: ['id'],
                    where: {
                        salesOrderDetID: salesOrderDetID
                    }
                }).then(() => {
                    const newAddedPlann = _.filter(plannDetailList, newPlann => !newPlann.id); // add
                    const updatedPlann = _.filter(plannDetailList, updatePlann => updatePlann.id && updatePlann.isUpdated); // update
                    var plannPromise = [];
                    // add new data
                    _.each(newAddedPlann, (newPlann) => {
                        newPlann.createdBy = req.user.id;
                        newPlann.updatedBy = req.user.id;
                        newPlann.kitReleaseQty = newPlann.kitReleaseQty ? parseInt(newPlann.kitReleaseQty) : null;
                        newPlann.mfrLeadTime = newPlann.mfrLeadTime ? parseInt(newPlann.mfrLeadTime) : 0;
                        plannPromise.push(SalesOrderPlanDetailsMst.create(newPlann, {
                            fields: ['kitReleaseQty', 'salesOrderDetID', 'poQty', 'poDueDate', 'materialDockDate', 'mfrLeadTime', 'kitReleaseDate', 'plannKitNumber', 'createdBy', 'updatedBy', 'refAssyId', 'kitStatus'],
                            transaction: t
                        }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { status: STATE.FAILED, error: err }
                        }));
                    });

                    // update new records
                    _.each(updatedPlann, (updatePlann) => {
                        plannPromise.push(SalesOrderPlanDetailsMst.findOne({
                            where: {
                                id: updatePlann.id,
                                isDeleted: false
                            },
                            model: SalesOrderPlanDetailsMst,
                            attributes: ['id']
                        }).then((response) => {
                            if (response && response.id) {
                                updatePlann.updatedBy = req.user.id;
                                updatePlann.kitReleaseQty = updatePlann.kitReleaseQty ? parseInt(updatePlann.kitReleaseQty) : null;
                                updatePlann.mfrLeadTime = updatePlann.mfrLeadTime ? parseInt(updatePlann.mfrLeadTime) : 0;
                                return SalesOrderPlanDetailsMst.update(updatePlann, {
                                    where: {
                                        id: updatePlann.id,
                                        isDeleted: false
                                    },
                                    attributes: ['kitReleaseQty', 'poQty', 'poDueDate', 'materialDockDate', 'mfrLeadTime', 'kitReleaseDate', 'plannKitNumber', 'updatedBy', 'refAssyId'],
                                    transaction: t
                                }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { status: STATE.FAILED, error: err }
                                });
                            } else {
                                return STATE.SUCCESS;
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { status: STATE.FAILED, error: err }
                        }));
                    });

                    return Promise.all(plannPromise).then((resp) => {
                        const isIssue = _.find(resp, status => status.status === STATE.FAILED);
                        if (isIssue) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: isIssue.error,
                                data: null
                            });
                        } else {
                            t.commit().then(() => {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(PlannModuleName));
                            });
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
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get Total qty kit Release
    // GET : /api/v1/salesorder/getKitReleasedQty
    // @param {id} int
    // @return total kit Releases qty
    getKitReleasedQty: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize
            .query('CALL Sproc_GetKitReleasedQty (:PSalesOrderDetID)', {
                replacements: {
                    PSalesOrderDetID: req.params.PSalesOrderDetID
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

    // get Kit PlannedDetail Of SaleOrder Assy
    // POST: /api/v1/salesorder/getKitPlannedDetailOfSaleOrderAssy
    // @return List of Planned Detail
    getKitPlannedDetailOfSaleOrderAssy: (req, res) => {
        const {
            SalesOrderPlanDetailsMst
        } = req.app.locals.models;
        if (req.body.assyList) {
            const whereclause = {
                subAssyID: null,
                [Op.or]: _.map(req.body.assyList, item => ({
                    refAssyId: item.partID,
                    salesOrderDetID: item.id
                }))
            };

            return SalesOrderPlanDetailsMst.findAll({
                where: whereclause,
                model: SalesOrderPlanDetailsMst,
                attributes: ['id', 'salesOrderDetID', 'refAssyId']
            }).then(PlanList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, PlanList, null)).catch((err) => {
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

    // Remove Plan kit Release Detail
    // POST: /api/v1/salesorder/removePlanReleaseDeatil
    // @return removed Plan Detail
    removePlanReleaseDeatil: (req, res) => {
        const {
            SalesOrderPlanDetailsMst
        } = req.app.locals.models;
        if (req.body && req.body.id) {
            const objPlan = {
                isDeleted: true,
                deletedBy: req.user.id,
                deletedAt: COMMON.getCurrentUTC()
            };
            return SalesOrderPlanDetailsMst.update(objPlan, {
                where: {
                    id: req.body.id,
                    isDeleted: false
                },
                fields: ['isDeleted', 'deletedBy', 'deletedAt']
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(PlannModuleName))).catch((err) => {
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


    getKitNumberByPartId: (req, res, salesdata, id) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (salesdata.partID) {
            if (!salesdata.isSkipKitCreation) {
                return sequelize.query('Select fun_generateKitNumber(:pAssyId, :pSalesOrderId)', {
                    replacements: {
                        pAssyId: salesdata.partID,
                        pSalesOrderId: id ? id : null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(responce => _.values(responce[0])[0]).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else {
                return Promise.resolve(false);
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            });
        }
    },
    // save commission detail of sales from rfq quote.
    saveRfqSalesCommissionDetails: (req, res, partId, pId, t, salesDetailRow) => {
        const {
            SalesorderdetCommissionAttributeMstDet,
            SalesorderdetCommissionAttribute
        } = req.app.locals.models;
        var promises = [];
        if (partId && salesDetailRow) {
            if (salesDetailRow.deletedComissionIds && salesDetailRow.deletedComissionIds.length > 0) {
                const deleteObj = {
                    isDeleted: true,
                    deletedAt: COMMON.getCurrentUTC(),
                    deletedBy: COMMON.getRequestUserID(req),
                    deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                };
                promises.push(
                    SalesorderdetCommissionAttribute.update(deleteObj, {
                        where: {
                            refSalesCommissionID: {
                                [Op.in]: _.map(salesDetailRow.deletedComissionIds, 'id')
                            },
                            isDeleted: false
                        },
                        transaction: t
                    }).then(() => SalesorderdetCommissionAttributeMstDet.update(deleteObj, {
                        where: {
                            id: {
                                [Op.in]: _.map(salesDetailRow.deletedComissionIds, 'id')
                            },
                            refSalesorderdetID: pId,
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
                            error: err
                        };
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
            }

            if (salesDetailRow.updatedCommission && salesDetailRow.updatedCommission.length > 0) {
                _.each(salesDetailRow.updatedCommission, (updateRow) => {
                    const updateObj = {
                        unitPrice: updateRow.unitPrice,
                        commissionPercentage: updateRow.commissionPercentage,
                        commissionValue: updateRow.commissionValue,
                        salesCommissionNotes: updateRow.salesCommissionNotes,
                        updatedAt: COMMON.getCurrentUTC(),
                        updatedBy: COMMON.getRequestUserID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };
                    promises.push(
                        SalesorderdetCommissionAttributeMstDet.update(updateObj, {
                            where: {
                                id: updateRow.id,
                                refSalesorderdetID: pId,
                                isDeleted: false
                            },
                            transaction: t
                        }).then(() => {
                            let childCommissionList = [];
                            _.each(updateRow.childSalesCommissionList, (updateChildRow) => {
                                const objsalesCommission = {
                                    unitPrice: updateChildRow.unitPrice,
                                    commissionPercentage: updateChildRow.commissionPercentage,
                                    commissionValue: updateChildRow.commissionValue,
                                    updatedAt: COMMON.getCurrentUTC(),
                                    updatedBy: COMMON.getRequestUserID(req),
                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                }
                                childCommissionList.push(SalesorderdetCommissionAttribute.update(objsalesCommission, {
                                    where: {
                                        id: updateChildRow.id,
                                        refSalesorderdetID: pId,
                                        isDeleted: false
                                    },
                                    transaction: t
                                }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        error: err
                                    };
                                }))
                            });
                            return Promise.all(childCommissionList).then((responses) => {
                                const childResponse = _.find(responses, (item) => item.status === STATE.FAILED)
                                if (childResponse) {
                                    return childResponse;
                                } else {
                                    return { status: STATE.SUCCESS };
                                }
                            });
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
            }

            if (salesDetailRow.newlyAddedCommission && salesDetailRow.newlyAddedCommission.length > 0) {
                _.each(salesDetailRow.newlyAddedCommission, (addRow) => {
                    const createObj = {
                        refSalesorderdetID: pId,
                        salesCommissionNotes: addRow.salesCommissionNotes,
                        unitPrice: addRow.unitPrice,
                        commissionPercentage: addRow.commissionPercentage,
                        commissionValue: addRow.commissionValue,
                        quoted_unitPrice: addRow.quoted_unitPrice,
                        quoted_commissionPercentage: addRow.quoted_commissionPercentage,
                        quoted_commissionValue: addRow.quoted_commissionValue,
                        partID: partId,
                        refComponentSalesPriceBreakID: addRow.refComponentSalesPriceBreakID || null,
                        isDeleted: false,
                        createdAt: COMMON.getCurrentUTC(),
                        createdBy: COMMON.getRequestUserID(req),
                        updatedBy: COMMON.getRequestUserID(req),
                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        poQty: addRow.qty,
                        quotedQty: addRow.quotedQty,
                        type: addRow.type,
                        commissionCalculateFrom: addRow.commissionCalculateFrom,
                        rfqAssyID: addRow.rfqAssyID
                    };
                    promises.push(
                        SalesorderdetCommissionAttributeMstDet.create(createObj, {
                            transaction: t
                        }).then((response) => {
                            let childSalesCommissionList = [];
                            _.each(addRow.childSalesCommissionList, (addNewChild) => {
                                const createObj = {
                                    refSalesorderdetID: pId,
                                    fieldName: addNewChild.fieldName,
                                    refSalesCommissionID: response.id,
                                    refQuoteAttributeId: addNewChild.refQuoteAttributeId,
                                    category: addNewChild.category,
                                    unitPrice: addNewChild.unitPrice,
                                    commissionPercentage: addNewChild.commissionPercentage,
                                    commissionValue: addNewChild.commissionValue,
                                    org_unitPrice: addNewChild.org_unitPrice,
                                    org_commissionPercentage: addNewChild.org_commissionPercentage,
                                    org_commissionValue: addNewChild.org_commissionValue,
                                    partID: partId,
                                    isDeleted: false,
                                    createdAt: COMMON.getCurrentUTC(),
                                    createdBy: COMMON.getRequestUserID(req),
                                    updatedBy: COMMON.getRequestUserID(req),
                                    createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                };
                                childSalesCommissionList.push(
                                    SalesorderdetCommissionAttribute.create(createObj, {
                                        transaction: t
                                    }).then(() => {
                                        return { status: STATE.SUCCESS };
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return {
                                            status: STATE.FAILED,
                                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            error: err
                                        };
                                    })
                                )

                            });
                            return Promise.all(childSalesCommissionList).then((responses) => {
                                const childResponse = _.find(responses, (item) => item.status === STATE.FAILED)
                                if (childResponse) {
                                    return childResponse;
                                } else {
                                    return { status: STATE.SUCCESS };
                                }
                            });
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
            }

            return Promise.all(promises).then((resp) => {
                var errorResp = _.find(resp, item => item.status === STATE.FAILED);

                if (!errorResp) {
                    return resp.length > 0 ? resp[0] : { status: STATE.SUCCESS };
                } else {
                    return errorResp;
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
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                error: null
            };
        }
    },

    // Get Sales Order Detail By Id
    // POST: /api/v1/salesorder/getSalesOrderDetailById
    // @return get Sales Order Detail By Id
    getSalesOrderDetailById: (req, res) => {
        const {
            SalesOrderDet,
            SalesOrderMst,
            Component,
            RFQRoHS
        } = req.app.locals.models;
        if (req.body && req.body.id) {
            return SalesOrderDet.findOne({
                where: {
                    id: req.body.id
                },
                attributes: ['id', 'refSalesOrderID', 'qty', 'partID', 'kitQty', 'mrpQty', 'kitNumber'],
                paranoid: false,
                include: [{
                    model: SalesOrderMst,
                    as: 'salesOrderMst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'salesOrderNumber', 'poNumber', 'revision'],
                    required: false
                },
                {
                    model: Component,
                    as: 'componentAssembly',
                    where: {
                        isDeleted: false,
                        mfgType: DATA_CONSTANT.MFG_TYPE.MFG
                    },
                    attributes: ['id', 'mfgPN', 'PIDCode', 'RoHSStatusID'],
                    required: false,
                    include: [{
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        attributes: ['id', 'name', 'rohsIcon'],
                        required: false
                    }]
                }
                ]
            }).then(response => resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, response, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            });
        }
    },

    // Update kit mrp qty
    // POST: /api/v1/salesorder/updateKitMrpQty
    // @return status of update
    updateKitMrpQty: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.body) {
            COMMON.setModelUpdatedByObjectFieldValue(req.user, req.body);
            return sequelize.transaction().then((t) => {
                return sequelize.query('CALL Sproc_updateKitMrpQty (:pSalesOrderDetID, :pRefAssyId, :pMrpQty, :pPOQty, :pKitQty, :pUserID, :pUserRoleID, :IsUpdateKitMrp, :pFromPageName)', {
                    replacements: {
                        pSalesOrderDetID: req.body.id,
                        pRefAssyId: req.body.partID,
                        pMrpQty: req.body.mrpQty || 0,
                        pPOQty: req.body.poQty || 0,
                        pKitQty: req.body.kitQty || 0,
                        pUserID: req.body.updatedBy,
                        pUserRoleID: req.body.updateByRoleId,
                        IsUpdateKitMrp: req.body.isUpdateKitMrp,
                        pFromPageName: req.body.fromPageName || null
                    },
                    transaction: t
                }).then((response) => {
                    const successRes = _.first(response);
                    if (successRes && successRes.responseMessage === STATE.SUCCESS) {
                        t.commit().then(() => {
                            if (successRes.isUpdateKitMrp) {
                                RFQSocketController.sendSalesOrderKitMRPQtyChanged(req, {
                                    notifyFrom: 'kit-mrp-qty-popup',
                                    data: req.body
                                });
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED('Kit/MRP Qty'));
                            } else {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS);
                            }
                        });
                    } else {
                        if (!t.finished) {
                            t.rollback();
                        }
                        if (successRes && successRes.responseMessage === 'ReleasedKitQtyValidation') {
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PLANKIT_QTY_VALIDATION);
                            messageContent.message = COMMON.stringFormat(messageContent.message, req.body.PIDCode, successRes.totalKitReleasedQty);
                            return resHandler.successRes(
                                res,
                                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                STATE.SUCCESS, {
                                messageContent: messageContent,
                                err: null,
                                data: null,
                                messageTypeCode: 1
                            }
                            );
                        } else if (successRes && successRes.responseMessage === 'MisMatchTBDQty') {
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.RELEASED_KIT_TBD_POKITQTY_VALIDATION);
                            messageContent.message = COMMON.stringFormat(messageContent.message, req.body.kiNumber);
                            return resHandler.successRes(
                                res,
                                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                STATE.SUCCESS, {
                                messageContent: messageContent,
                                err: null,
                                data: null,
                                messageTypeCode: 2
                            }
                            );
                        }
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
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            });
        }
    },


    // Update kit mrp qty of Last Kit Release Plan
    // POST: /api/v1/salesorder/updateLatestSalesOrderPlanDetailQty
    // @return status of update
    updateLatestSalesOrderPlanDetailQty: (req, res) => {
        const {
            SalesOrderPlanDetailsMst
        } = req.app.locals.models;

        if (req.body) {
            COMMON.setModelUpdatedByObjectFieldValue(req.user, req.body);
            return SalesOrderPlanDetailsMst.findOne({
                model: SalesOrderPlanDetailsMst,
                order: [
                    ['displayOrder', 'ASC']
                ],
                where: {
                    kitStatus: DATA_CONSTANT.KIT_RELEASE.ReleaseStatus.Released,
                    salesOrderDetID: req.body.id,
                    refAssyId: req.body.rfqAssyID,
                    subAssyID: null
                },
                attributes: ['poQty', 'kitReleaseQty', 'updateByRoleId', 'updatedAt', 'updatedBy']
            }).then((latestPlanDetails) => {
                return SalesOrderDet.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: ['mrpQty', 'kitQty', 'updatedBy', 'updateByRoleId', 'updatedAt']
                }).then(() => {
                    RFQSocketController.sendSalesOrderKitMRPQtyChanged(req, {
                        notifyFrom: 'kit-mrp-qty-popup',
                        data: req.body
                    });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED('Kit/MRP Qty'));
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            });
        }
    },

    // Get Kit Release List By Sales Order Id
    // POST: /api/v1/salesorder/getKitReleaseListBySalesOrderId
    // @return Get Kit Release List By Sales Order Id
    getKitReleaseListBySalesOrderId: (req, res) => {
        const {
            SalesOrderPlanDetailsMst
        } = req.app.locals.models;
        if (req.body && req.body.id) {
            return SalesOrderPlanDetailsMst.findAll({
                where: {
                    kitStatus: 'R',
                    salesOrderDetID: {
                        [Op.in]: req.body.id
                    }
                },
                model: SalesOrderPlanDetailsMst,
                attributes: ['id', 'salesOrderDetID', 'refAssyId', 'kitStatus']
            }).then(ReleaseList => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                ReleaseList: ReleaseList
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // holdResumeTrans
    // POST: /api/v1/salesorder/holdResumeTrans
    // @return status of holdResumeTrans
    holdResumeTrans: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_ManageHoldResumeTrans (:pRefTransId,:pRefType,:pStatus,:pReason,:pResumeReason,:pEmployeeID,:puserID,:pRoleID)', {
                replacements: {
                    pRefTransId: req.body.dataObj.refTransId,
                    pRefType: req.body.dataObj.refType,
                    pStatus: req.body.dataObj.isHalt ? DATA_CONSTANT.HOLD_UNHOLD_TRANS.Halt : DATA_CONSTANT.HOLD_UNHOLD_TRANS.Resume,
                    pReason: req.body.dataObj.reason || null,
                    pResumeReason: req.body.dataObj.resumeReason || null,
                    pEmployeeID: req.user.employeeID,
                    puserID: req.user.id,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            }).then((response) => {
                const reqData = req.body.dataObj;
                const isHalt = reqData.isHalt;
                const reason = reqData.reason;
                const resumeReason = reqData.resumeReason;
                const module = reqData.module;
                if (response[0] && response[0][0] && response[0][0]['IsSuccess'] === 0) {
                    t.rollback();
                    if (response[0][0]['ErrorCode'] === 2) {
                        let messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.ALREADY_PAID_NOT_ALLOWED_TO_HALT);
                        if (response[0][0]['HRStatus'] === 'ALREADY_LOCKED') {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.HALT_VALIDATION_MESSAGE);
                        } else if (module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierInvoiceModule) {
                            messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierInvoice);
                        } else if (module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierDebitMemoModule) {
                            messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierDebitMemo);
                        } else if (module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierCreditMemoModule) {
                            messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierCreditMemo);
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: messageContent,
                            err: null,
                            data: {
                                IsSuccess: response[0][0]['IsSuccess'],
                                ErrorCode: response[0][0]['ErrorCode']
                            }
                        });
                    } else {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.ALREADY_HOLDRESUME);
                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.dataObj.module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.POModule ? DATA_CONSTANT.HOLD_UNHOLD_TRANS.POSOMESSAGE : req.body.dataObj.module, response[0][0]['HRStatus'], response[0][0]['EmpName']);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: messageContent,
                            err: null,
                            data: {
                                IsSuccess: response[0][0]['IsSuccess'],
                                ErrorCode: response[0][0]['ErrorCode']
                            }
                        });
                    }
                } else {
                    const promises = [];
                    let notificationDetail;
                    let redirecUrl;
                    let refTableForNoti = null;
                    const refTransIDForNoti = response[0][0]['insertUpdatePKID'];
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.HALT_RESUME_SUCCESSFUL);
                    if (module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.POModule) {
                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.HOLD_UNHOLD_TRANS.POSOMESSAGE, reqData.isHalt ? DATA_CONSTANT.HOLD_UNHOLD_TRANS.HaltedMessage : DATA_CONSTANT.HOLD_UNHOLD_TRANS.ResumedMessage);
                        notificationDetail = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.PO_STOP : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.PO_START;
                        redirecUrl = COMMON.stringFormat(notificationDetail.REDIRECTURL, reqData.salesOrderid);
                        refTableForNoti = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.PO_STOP.refTable : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.PO_START.refTable;
                    } else if (module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.KitAllocationModule) {
                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.HOLD_UNHOLD_TRANS.KitAllocationModule, reqData.isHalt ? DATA_CONSTANT.HOLD_UNHOLD_TRANS.HaltedMessage : DATA_CONSTANT.HOLD_UNHOLD_TRANS.ResumedMessage);
                        notificationDetail = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.KIT_ALLOCATION_STOP : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.KIT_ALLOCATION_START;
                        redirecUrl = COMMON.stringFormat(notificationDetail.REDIRECTURL, reqData.refTransId, reqData.assyID);
                        refTableForNoti = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.KIT_ALLOCATION_STOP.refTable : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.KIT_ALLOCATION_START.refTable;
                    } else if (module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierInvoiceModule) {
                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierInvoice, reqData.isHalt ? DATA_CONSTANT.HOLD_UNHOLD_TRANS.HaltedMessage : DATA_CONSTANT.HOLD_UNHOLD_TRANS.ResumedMessage);
                        notificationDetail = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_STOP : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_START;
                        redirecUrl = '';
                        refTableForNoti = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_STOP.refTable : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_START.refTable;
                    } else if (module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierDebitMemoModule) {
                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierDebitMemo, reqData.isHalt ? DATA_CONSTANT.HOLD_UNHOLD_TRANS.HaltedMessage : DATA_CONSTANT.HOLD_UNHOLD_TRANS.ResumedMessage);
                        notificationDetail = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_STOP : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_START;
                        redirecUrl = '';
                        refTableForNoti = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_STOP.refTable : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_START.refTable;
                    } else if (module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierCreditMemoModule) {
                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierCreditMemo, reqData.isHalt ? DATA_CONSTANT.HOLD_UNHOLD_TRANS.HaltedMessage : DATA_CONSTANT.HOLD_UNHOLD_TRANS.ResumedMessage);
                        notificationDetail = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_STOP : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_START;
                        redirecUrl = '';
                        refTableForNoti = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_STOP.refTable : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SUPPLIER_INVOICE_START.refTable;
                    } else {
                        messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.HOLD_UNHOLD_TRANS.KitReleaseModule, reqData.isHalt ? DATA_CONSTANT.HOLD_UNHOLD_TRANS.HaltedMessage : DATA_CONSTANT.HOLD_UNHOLD_TRANS.ResumedMessage);
                        notificationDetail = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.KIT_RELEASE_STOP : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.KIT_RELEASE_START;
                        redirecUrl = COMMON.stringFormat(notificationDetail.REDIRECTURL, reqData.refTransId, reqData.assyID);
                        refTableForNoti = isHalt ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.KIT_RELEASE_STOP.refTable : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.KIT_RELEASE_START.refTable;
                    }
                    const woIDs = [];
                    const socketData = {
                        refTransId: reqData.refTransId,
                        assyPID: reqData.assyName,
                        assyId: reqData.assyID,
                        refType: notificationDetail.TYPE
                    };

                    if (module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierInvoiceModule ||
                        module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierDebitMemoModule ||
                        module === DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierCreditMemoModule) {
                        return t.commit().then(() => {
                            RFQSocketController.sendHoldResumeTranNotification(req, socketData, notificationDetail.SOCKET);
                            req.params['id'] = req.body.dataObj.refTransId;
                            req.params['receiptType'] = req.body.dataObj.receiptType;
                            EnterpriseSearchController.managePackingSlipInElastic(req);
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                IsSuccess: response[0][0]['IsSuccess'],
                                ErrorCode: response[0][0]['ErrorCode']
                            }, messageContent);
                        });
                        // return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        //     IsSuccess: response[0][0]['IsSuccess'],
                        //     ErrorCode: response[0][0]['ErrorCode']
                        // }, messageContent));
                    } else {
                        return sequelize.query('CALL Sproc_GetWorkorderOwnerCoOwnerBySalesOrderDetId (:pSalesOrderDetID)', {
                            replacements: {
                                pSalesOrderDetID: reqData.refTransId
                            },
                            type: sequelize.QueryTypes.SELECT,
                            transaction: t
                        }).then((woList) => {
                            const workorderList = _.values(woList[0]);
                            if (workorderList && workorderList.length > 0) {
                                const groupWO = _.groupBy(workorderList, 'woID');
                                _.each(groupWO, (item) => {
                                    const woID = _.uniq(_.map(item, objWO => parseInt(objWO.woID)));

                                    let owners = _.uniq(_.map(item, objOwner => (objOwner.createdBy ? parseInt(objOwner.createdBy) : null)));

                                    const employee = _.uniq(_.map(item, objWO => (objWO.employee ? parseInt(objWO.employee) : null)));
                                    woIDs.push(woID);
                                    owners = _.compact([...owners, ...employee]);

                                    req.body.holdBy = req.user.username;
                                    const data = {
                                        woID: woID,
                                        refTransId: reqData.refTransId,
                                        poNumber: reqData.poNumber,
                                        soNumber: reqData.soNumber,
                                        assyPID: reqData.assyName,
                                        assyId: reqData.assyID,
                                        module: reqData.module,
                                        employeeID: req.user.employeeID,
                                        senderID: req.user.employeeID,
                                        message: isHalt ? reason : resumeReason,
                                        notificationDetail: notificationDetail,
                                        receiver: owners,
                                        redirecUrl: redirecUrl,
                                        refTransID: refTransIDForNoti,
                                        refTable: refTableForNoti
                                    };
                                    promises.push(NotificationMstController.sendHoldResumePONotification(req, data));
                                });
                                return Promise.all(promises).then(() => {
                                    socketData.woIDs = woIDs;
                                    RFQSocketController.sendHoldResumeTranNotification(req, socketData, notificationDetail.SOCKET);
                                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                        IsSuccess: response[0][0]['IsSuccess'],
                                        ErrorCode: response[0][0]['ErrorCode']
                                    }, messageContent));
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    t.rollback();
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            } else {
                                RFQSocketController.sendHoldResumeTranNotification(req, socketData, notificationDetail.SOCKET);
                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    IsSuccess: response[0][0]['IsSuccess'],
                                    ErrorCode: response[0][0]['ErrorCode']
                                }, messageContent));
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                t.rollback();
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

    // get rfq assy qty and turn time list based on quote group and partid
    // GET: /api/v1/salesorder/getRfqQtyandTurnTimeDetail
    // @return list of rfq turn time and qty
    getRfqQtyandTurnTimeDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.partID && req.params.rfqQuoteGroupID) {
            return sequelize.query('CALL Sproc_GetAssyQtyTurntimeByRfqGroup (:prfqGroupID,:ppartid)', {
                replacements: {
                    prfqGroupID: req.params.rfqQuoteGroupID,
                    ppartid: req.params.partID
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // get qty and turn time list based on partid
    // GET: /api/v1/salesorder/getQtyandTurnTimeDetailByAssyId
    // @return list of turn time and qty
    getQtyandTurnTimeDetailByAssyId: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.partID) {
            return sequelize.query('CALL Sproc_GetAssyQtyTurntimeByAssyID(:ppartid,:plineId)', {
                replacements: {
                    ppartid: req.body.partID,
                    plineId: req.body.lineId || null
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // get Sales order commission detail
    // GET: /api/v1/salesorder/getSalesCommissionDetails
    // @return list of sales commission details
    getSalesCommissionDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.partID) {
            return sequelize.query('CALL Sproc_GetSalesCommissionDetails (:psalesDetId,:ppartID,:pQuoteFrom,:pQuoteGroupId,:pQuoteNumber,:pPOQty,:pTurnTimeID,:pPrice,:pTransType,:pRefId)', {
                replacements: {
                    psalesDetId: req.body.salesDetId || null,
                    ppartID: req.body.partID,
                    pQuoteFrom: req.body.quoteFrom || null,
                    pQuoteGroupId: req.body.quoteGroupId || null,
                    pQuoteNumber: req.body.quoteNumber || null,
                    pPOQty: req.body.poQty || null,
                    pTurnTimeID: req.body.turnTimeID || null,
                    pPrice: req.body.price || null,
                    pTransType: req.body.transType || null,
                    pRefId: req.body.refCustPackingSlipDetId || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const mstsalesCommission = _.values(response[0]);
                if (req.body.transType && req.body.transType == 'I' && req.body.refCustPackingSlipDetId) {
                    const childsalesCommission = _.values(response[1]);
                    _.each(mstsalesCommission, (item) => {
                        const fltommission = _.filter(childsalesCommission, (chdComm) => chdComm.refcustInvoiceCommissionID === item.id);
                        item.childSalesCommissionList = fltommission;
                    });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mstsalesCommission, null)
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

    // save Sales order commission detail
    // POST: /api/v1/salesorder/saveSalesCommissionDetails
    // @return save sales commission detail
    saveSalesCommissionDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.salesObj) {
            const salesObj = req.body.salesObj;
            return sequelize.transaction().then(t =>
                module.exports.saveRfqSalesCommissionDetails(req, res, salesObj.partID, salesObj.id, t, salesObj).then((reponse) => {
                    if (reponse.status === STATE.SUCCESS) {
                        t.commit().then(() => {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, reponse, MESSAGE_CONSTANT.UPDATED(SalesCommossionModuleName));
                        });
                    } else {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: reponse.message,
                            err: reponse.error || null,
                            data: reponse.data || null
                        });
                    }
                })
            );
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // get quote group details
    // GET: /api/v1/salesorder/getQuoteGroupDetailsfromPartID
    // @return list of quote group
    getQuoteGroupDetailsfromPartID: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.partID) {
            return sequelize.query('CALL Sproc_GetWinOrFollowRfqQuoteGroup (:ppartID)', {
                replacements: {
                    ppartID: req.params.partID
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // get other part type component list
    // GET: /api/v1/salesorder/getOtherPartTypeComponentDetails
    // @return list other part type components
    getOtherPartTypeComponentDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetAllOtherComponentList ()', {
            replacements: {}
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

    // Get List of other expense of sales order
    // GET : /api/v1/retrieveSalesOrderOtherExpenseDetails
    // @param {id} int
    // @return List of sales order other expense
    retrieveSalesOrderOtherExpenseDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        sequelize
            .query('CALL Sproc_RetrieveSalesOrderOtherExpenseList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prefSalesDetID)', {
                replacements: {
                    ppageIndex: req.query.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere || null,
                    prefSalesDetID: req.query.refSalesDetID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                otherExpenses: _.values(response[1]),
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
    // Get salesorder details status
    // GET : /api/v1/retrieveSalesOrderDetailStatus
    // @param {id} int
    // @return List of detail status
    retrieveSalesOrderDetailStatus: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.id || req.body.soId) {
            return sequelize
                .query('CALL Sproc_GetsalesOrderDetailStatus (:psalesorderDetID, :preleaseLineId,:pSalesOrderId)', {
                    replacements: {
                        psalesorderDetID: req.body.id ? (_.isArray(req.body.id) ? _.map(req.body.id).join(',') : req.body.id.toString()) : null,
                        preleaseLineId: req.body.releaseLineID || null,
                        pSalesOrderId: req.body.soId || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    soReleaseStatus: _.values(response[0]),
                    soShipStatus: !req.body.soId ? _.values(response[1]) : [],
                    soBlanketPOStatus: req.body.soId ? _.values(response[1]) : _.values(response[2])
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

    // Update SalesOrder Detail Status to Complete
    // @body
    // @return Updated SalesOrder Detail Status
    updateSalesOrderDetailStatus: (req, res, salesObj, t) => {
        const {
            SalesOrderDet,
            CustomerPackingSlipDet
        } = req.app.locals.models;
        // let soDetStatus;
        const updateFields = ['salesOrderDetStatus', 'completeStatusReason'];
        if (salesObj) {
            if (salesObj.type === 'ManualUpdate') {
                return SalesOrderDet.update(salesObj, {
                    where: {
                        id: salesObj.salesOrderDetID
                    },
                    fields: updateFields,
                    transaction: t
                }).then(() => STATE.SUCCESS).catch(() => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    return STATE.FAILED;
                });
            } else {
                return SalesOrderDet.findOne({
                    where: {
                        id: salesObj.salesOrderDetID
                    },
                    attributes: ['id', 'refSalesOrderID', 'qty'],
                    transaction: t
                }).then(soDet => CustomerPackingSlipDet.sum('shippedQty', {
                    where: {
                        refSalesOrderDetID: salesObj.salesOrderDetID
                    },
                    transaction: t
                }).then((totalShippedQty) => {
                    const updateSOObj = {};
                    if (totalShippedQty && soDet.qty <= totalShippedQty) {
                        updateSOObj.salesOrderDetStatus = COMMON.SOSTATUS.COMPLETED;
                        updateSOObj.completeStatusReason = 'AUTO';
                    } else {
                        updateSOObj.salesOrderDetStatus = COMMON.SOSTATUS.INPROGRESS;
                        updateSOObj.completeStatusReason = '';
                    }
                    return SalesOrderDet.update(updateSOObj, {
                        where: {
                            id: salesObj.salesOrderDetID
                        },
                        fields: updateFields,
                        transaction: t
                    }).then(() => STATE.SUCCESS).catch((err) => {
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
                        // return STATE.FAILED;
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
                    //  return STATE.FAILED;
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
                    // return STATE.FAILED;
                });
            }
        } else {
            return STATE.SUCCESS;
        }
    },
    // Update SalesOrder Detail Status to Complete
    // POST : /api/v1/SalesOrder/updateSalesOrderDetailStatusManual
    // @body
    // @return Updated SalesOrder Detail Status Manually
    updateSalesOrderDetailStatusManual: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.transaction().then(t => module.exports.updateSalesOrderDetailStatus(req, res, req.body.salesObj, t).then(() => t.commit().then(() =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED('Sales order status')))).catch((err) => {
                console.error(err);
                console.trace();
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            }));
    },

    // Get Sales Order Master Working Status (Completed/In Progress)
    // GET : /api/v1/SalesOrder/getSalesOrderHeaderWorkingStatus
    // @return Header Working Status
    getSalesOrderHeaderWorkingStatus: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.id) {
            return sequelize
                .query('CALL Sproc_GetSalesOrderHeaderWorkStatus (:psalesorderDetID)', {
                    replacements: {
                        psalesorderDetID: req.body.id
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    SOWorkingStatus: _.values(response[0][0])
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
        } // else part not added  as no need to show message if body.id has not value
    },
    salesOrderDetailSkipKitValidation: (req, res, isFromApi) => {
        const {
            KitAllocation,
            SalesOrderPlanDetailsMst
        } = req.app.locals.models;
        const isFromApiCheck = isFromApi === true ? true : false;
        const promises = [];
        if (req.body) {
            if (!req.body.isSkipKitCreation && isFromApiCheck) {
                return Promise.resolve(false);
            } else {
                promises.push(KitAllocation.findAll({
                    where: {
                        refSalesOrderDetID: req.body.id,
                        status: 'A'
                    },
                    attributes: ['refSalesOrderDetID']
                }));
                if (!isFromApiCheck) {
                    promises.push(SalesOrderPlanDetailsMst.findAll({
                        where: {
                            salesOrderDetID: req.body.id,
                            kitStatus: 'R'
                        },
                        attributes: ['salesOrderDetID']
                    }));
                }
                return Promise.all(promises).then((response) => {
                    if (isFromApiCheck) {
                        if (!req.body.kitRemoveConfirmation && !req.body.isSkipKitCreationOld) {
                            return Promise.resolve({
                                skipKitConfirmation: true
                            });
                        } else {
                            return Promise.resolve(false);
                        }
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            allocationCount: response[0],
                            KitReleaseCount: response[1]
                        }, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (isFromApiCheck) {
                        return Promise.resolve(false);
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    }
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
    checkRFQQuoteNumberUnique: (req, res) => {
        const {
            RFQAssemblies
        } = req.app.locals.models;
        if (req.body.quoteNumber) {
            return RFQAssemblies.findOne({
                where: {
                    quoteNumber: {
                        [Op.eq]: req.body.quoteNumber
                    }
                },
                attributes: ['quoteNumber']
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
    // Check Unique PO# with Customer
    // POST : /api/v1/SalesOrder/checkUniquePOWithCustomer
    // @return PO Exists Or Not
    checkUniquePOWithCustomer: (req, res) => {
        const {
            SalesOrderMst
        } = req.app.locals.models;
        if (req.body) {
            const where = {
                poNumber: req.body.poNumber,
                isDeleted: false,
                isRmaPO: false
            };
            if (req.body.customerID) {
                where.customerID = req.body.customerID;
            }
            if (req.body.id) {
                where.id = {
                    [Op.ne]: req.body.id
                };
            }
            return SalesOrderMst.findOne({
                where: where,
                model: SalesOrderMst,
                attributes: ['id', 'salesOrderNumber']
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // GET sales order release line detail
    // GET : /api/v1/salesorder/getSalesOrderReleaseLineDetail
    // @param {id} int
    // @return detail of sales order release line
    getSalesOrderReleaseLineDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.soDetID) {
            return sequelize
                .query('CALL Sproc_getSalesOrderReleaseLineDetails (:pSalesOrderDetID)', {
                    replacements: {
                        pSalesOrderDetID: req.params.soDetID
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { soReleaseDetail: _.values(response[0]), soSalesDetail: _.values(response[1]) }, null)).catch((err) => {
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
    // POST sales order release line detail
    // GET : /api/v1/salesorder/saveSalesOrderLineDetail
    // @param {id} int
    // @return detail of sales order release line
    saveSalesOrderLineDetail: (req, res) => {
        const {
            SalesOrderDet,
            SalesShippingMst,
            CustomerPackingSlipDet,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.transaction().then(t => SalesShippingMst.findAll({
                where: {
                    sDetID: req.body.id,
                    isDeleted: false
                },
                attributes: ['shippingID'],
                transaction: t,
                include: [{
                    model: CustomerPackingSlipDet,
                    as: 'customerPackingSlipDet',
                    attributes: ['id']
                }]
            }).then((shippinglist) => {
                let updateshipping = _.filter(req.body.SODetail, itemUpdate => itemUpdate.shippingID);
                const createshipping = _.filter(req.body.SODetail, itemCreate => !itemCreate.shippingID);
                const shippingIds = _.map(updateshipping, 'shippingID');
                shippinglist = _.filter(shippinglist, shipDetail => shipDetail.customerPackingSlipDet.length === 0);
                const shippingdetIds = _.map(shippinglist, 'shippingID');
                const removeshipping = _.difference(shippingdetIds, shippingIds);
                _.each(removeshipping, (itemRemove) => {
                    updateshipping = _.reject(updateshipping, o => parseInt(o.shippingID) === parseInt(itemRemove));
                });
                const shippingPromise = [];
                if (removeshipping.length > 0) {
                    const obj = {
                        deletedBy: req.user.id,
                        deletedAt: COMMON.getCurrentUTC(),
                        isDeleted: true,
                        updateByRoleId: req.user.defaultLoginRoleID,
                        deleteByRoleId: req.user.defaultLoginRoleID
                    };
                    shippingPromise.push(SalesShippingMst.update(obj, {
                        where: {
                            shippingID: {
                                [Op.in]: removeshipping
                            }
                        },
                        transaction: t
                    }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return { error: err, status: STATE.FAILED };
                    }));
                }
                if (createshipping.length > 0) {
                    _.each(createshipping, (purchase) => {
                        if (purchase.qty && purchase.promisedShipDate) {
                            purchase.createdBy = req.user.id;
                            purchase.updatedBy = req.user.id;
                            purchase.updateByRoleId = req.user.defaultLoginRoleID;
                            purchase.createByRoleId = req.user.defaultLoginRoleID;

                            shippingPromise.push(SalesShippingMst.create(purchase, {
                                fields: salesShippingInputFields,
                                transaction: t
                            }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return { error: err, status: STATE.FAILED };
                            }));
                        }
                    });
                }
                if (updateshipping.length > 0) {
                    _.each(updateshipping, (shipping) => {
                        shipping.updatedBy = req.user.id;
                        shipping.updateByRoleId = req.user.defaultLoginRoleID;
                        shippingPromise.push(SalesShippingMst.update(shipping, {
                            where: {
                                shippingID: shipping.shippingID
                            },
                            fields: salesShippingInputFields,
                            transaction: t
                        }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { error: err, status: STATE.FAILED };
                        }));
                    });
                }
                const updateLineDet = {
                    shippingQty: createshipping.length + updateshipping.length,
                    updatedBy: req.user.id,
                    updateByRoleId: req.user.defaultLoginRoleID,
                    releaseLevelComment: req.body.releaseLevelComment
                };
                req.body.shippingQty = updateLineDet.shippingQty;
                shippingPromise.push(SalesOrderDet.update(updateLineDet, {
                    where: {
                        id: req.body.id
                    },
                    fields: ['shippingQty', 'updatedBy', 'updateByRoleId', 'releaseLevelComment'],
                    transaction: t
                }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return { error: err, status: STATE.FAILED };
                }));
                return Promise.all(shippingPromise).then((resp) => {
                    const isIssue = _.find(resp, sts => (sts.status === STATE.FAILED));
                    if (isIssue) {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: isIssue.error,
                            data: null
                        });
                    } else {
                        const objSO = {
                            id: req.body.soID || req.body.id,
                            isSOrevision: req.body.isSOrevision,
                            isAskForVersionConfirmation: req.body.isAskForVersionConfirmation
                        }
                        if (req.body.blanketPOID) {
                            return module.exports.saveBlanketPOFutureOption(req, req.body.id, req.body.blanketPOID, t).then((resonseBPO) => {
                                if (resonseBPO.status === STATE.FAILED) {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: resonseBPO.error,
                                        data: null
                                    });
                                }
                                return module.exports.checkForSORevisionUpdate(req, res, objSO, t).then(() => {
                                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, req.body.isFromDetail ? null : MESSAGE_CONSTANT.UPDATED(salesOrderModuleName)));
                                });
                            })
                        } else {
                            return module.exports.checkForSORevisionUpdate(req, res, objSO, t).then(() => {
                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, req.body.isFromDetail ? null : MESSAGE_CONSTANT.UPDATED(salesOrderModuleName)));
                            });
                        }
                    }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: err,
                    data: null
                });
            })
            );
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // POST sales order detail remove type
    // GET : /api/v1/salesorder/removeSalesOrderDetail
    // @param {id} int
    // @return detail of removed sales Order
    removeSalesOrderDetail: (req, res) => {
        const {
            SalesOrderDet,
            SalesShippingMst,
            Component,
            SalesOrderOtherExpenseDetail,
            sequelize
        } = req.app.locals.models;
        if (req.body.id) {
            const updateSOObj = {
                isDeleted: true,
                updatedBy: req.user.id,
                deletedBy: req.user.id,
                deletedAt: COMMON.getCurrentUTC(),
                updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return sequelize.transaction().then(t => SalesOrderDet.findAll({
                where: {
                    id: req.body.id,
                    isDeleted: false
                },
                attributes: ['id', 'partID', 'qty', 'mrpQty', 'kitQty', 'isSkipKitCreation', 'lineID', 'kitNumber'],
                include: [{
                    model: Component,
                    as: 'componentAssembly',
                    where: {
                        isDeleted: false,
                        mfgType: DATA_CONSTANT.MFG_TYPE.MFG
                    },
                    attributes: ['id', 'PIDCode']
                }],
                transaction: t
            }).then(salesdetail => sequelize.query('CALL Sproc_GetsalesOrderDetailStatus (:psalesorderDetID,:preleaseLineId, :pSalesOrderId)', {
                replacements: {
                    psalesorderDetID: req.body.id,
                    preleaseLineId: null, pSalesOrderId: null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const salesDetStatus = _.values(response[0]).length > 0 ? _.head(_.values(response[0])) : null;
                const salesShippedStatus = _.values(response[1]).length > 0 ? _.head(_.values(response[1])) : null;

                if ((salesDetStatus && (salesDetStatus.vQtyRelease || salesDetStatus.vQtyWprkorder)) || (salesShippedStatus && salesShippedStatus.shippedqty)) {
                    const kitHaveWorkorderOrRelease = [req.body.id];
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: {
                            kitHaveWorkorderOrRelease: kitHaveWorkorderOrRelease,
                            salesdetail: salesdetail
                        }
                    });
                } else {
                    return SalesOrderDet.update(updateSOObj, {
                        where: {
                            id: req.body.id
                        },
                        transaction: t
                    }).then(() => {
                        const objDeleteRecord = _.find(salesdetail, data => parseInt(data.id) === parseInt(req.body.id));
                        if (objDeleteRecord) {
                            return sequelize.query('CALL Sproc_CreateKitAllocationConsolidateLine (:pRefSalesOrderDetId, :pAssyId, :pUserId, :pRoleId)', {
                                replacements: {
                                    pRefSalesOrderDetId: objDeleteRecord.id,
                                    pAssyId: objDeleteRecord.partID,
                                    pUserId: req.user.id,
                                    pRoleId: req.user.defaultLoginRoleID
                                },
                                type: sequelize.QueryTypes.SELECT,
                                transaction: t
                            }).then((insertConsolidate) => {
                                const consolidateCount = insertConsolidate[0][0]['kitConsolidateLine'];
                                if (consolidateCount > 0) {
                                    return sequelize
                                        .query('CALL Sproc_CreateKitAllocationAssyDetail (:pPartID,:pSalesOrderDetailID,:pKitQty,:pMrpQty,:pUserID,:pActionStatus,:pRoleID, :pIsOnlyQtyChange)', {
                                            replacements: {
                                                pPartID: objDeleteRecord.partID,
                                                pSalesOrderDetailID: objDeleteRecord.id,
                                                pKitQty: objDeleteRecord.kitQty,
                                                pMrpQty: objDeleteRecord.mrpQty,
                                                pUserID: req.user.id,
                                                pActionStatus: 'DELETE',
                                                pRoleID: req.user.defaultLoginRoleID,
                                                pIsOnlyQtyChange: false
                                            },
                                            type: sequelize.QueryTypes.SELECT,
                                            transaction: t
                                        }).then(() => {
                                            objDeleteRecord.isDeleted = true;
                                            objDeleteRecord.dataValues.userInitialName = req.user.employee.initialName;
                                            RFQSocketController.sendSalesOrderKitMRPQtyChanged(req, {
                                                notifyFrom: 'update-sales-order-detail',
                                                data: objDeleteRecord
                                            });

                                            // Delete Sales Order Detail from Elastic Search
                                            EnterpriseSearchController.deleteSalesOrderDetailInElastic(req.body.id);
                                            const promises = [];
                                            promises.push(
                                                SalesShippingMst.update(updateSOObj, {
                                                    where: {
                                                        sDetID: req.body.id
                                                    },
                                                    transaction: t
                                                }).then(() => (Promise.resolve({ status: STATE.SUCCESS }))).catch((err) => {
                                                    console.error(err);
                                                    console.trace();
                                                    return STATE.FAILED;
                                                })
                                            );
                                            promises.push(
                                                SalesOrderOtherExpenseDetail.update(updateSOObj, {
                                                    where: {
                                                        refSalesOrderDetID: req.body.id
                                                    },
                                                    transaction: t
                                                }).then(() => (Promise.resolve({ status: STATE.SUCCESS }))).catch((err) => {
                                                    console.error(err);
                                                    console.trace();
                                                    return STATE.FAILED;
                                                })
                                            );
                                            if (req.body.isSOrevision) {
                                                const objSO = {
                                                    id: req.body.soID,
                                                    isSOrevision: req.body.isSOrevision,
                                                    isAskForVersionConfirmation: req.body.isAskForVersionConfirmation
                                                }
                                                promises.push(module.exports.checkForSORevisionUpdate(req, res, objSO, t));
                                            }
                                            return Promise.all(promises).then((resPromise) => {
                                                if (_.find(resPromise, (item) => item.status === STATE.FAILED)) {
                                                    if (!t.finished) { t.rollback(); }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                        err: null,
                                                        data: null
                                                    });
                                                } else {
                                                    if (!req.body.blanketPOID) {
                                                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED('Sales Order Detail')));
                                                    } else {
                                                        return module.exports.saveBlanketPOFutureOption(req, req.body.id[0], req.body.blanketPOID, t).then((responsebPO) => {
                                                            if (responsebPO.status === STATE.FAILED) {
                                                                t.rollback();
                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                                    err: responsebPO.error,
                                                                    data: null
                                                                });
                                                            } else {
                                                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED('Sales Order Detail')));
                                                            }
                                                        })
                                                    }
                                                }
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                t.rollback();
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: err,
                                                    data: null
                                                });
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                t.rollback();
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: err,
                                                    data: null
                                                });
                                            });
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            t.rollback();
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                } else {
                                    // Delete Sales Order Detail from Elastic Search
                                    EnterpriseSearchController.deleteSalesOrderDetailInElastic(req.body.id);
                                    let promises = [];
                                    promises.push(SalesShippingMst.update(updateSOObj, {
                                        where: {
                                            sDetID: req.body.id
                                        },
                                        transaction: t
                                    }).then(() => (Promise.resolve({ status: STATE.SUCCESS }))).catch((err) => {
                                        console.error(err);
                                        console.trace();
                                        return STATE.FAILED;
                                    }));
                                    promises.push(SalesOrderOtherExpenseDetail.update(updateSOObj, {
                                        where: {
                                            refSalesOrderDetID: req.body.id
                                        },
                                        transaction: t
                                    }).then(() => (Promise.resolve({ status: STATE.SUCCESS }))).catch((err) => {
                                        console.error(err);
                                        console.trace();
                                        return STATE.FAILED;
                                    }));
                                    if (req.body.isSOrevision) {
                                        const objSO = {
                                            id: req.body.soID,
                                            isSOrevision: req.body.isSOrevision,
                                            isAskForVersionConfirmation: req.body.isAskForVersionConfirmation
                                        }
                                        promises.push(module.exports.checkForSORevisionUpdate(req, res, objSO, t));
                                    }
                                    return Promise.all(promises).then((resPromise) => {
                                        if (_.find(resPromise, (item) => item.status === STATE.FAILED)) {
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: null,
                                                data: null
                                            });
                                        } else {
                                            if (!req.body.blanketPOID) {
                                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED('Sales Order Detail')));
                                            } else {
                                                return module.exports.saveBlanketPOFutureOption(req, req.body.id[0], req.body.blanketPOID, t).then((responsebPO) => {
                                                    if (responsebPO.status === STATE.FAILED) {
                                                        t.rollback();
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                            err: responsebPO.error,
                                                            data: null
                                                        });
                                                    } else {
                                                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED('Sales Order Detail')));
                                                    }
                                                })
                                            }
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        t.rollback();
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
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        } else {
                            // Delete Sales Order Detail from Elastic Search
                            EnterpriseSearchController.deleteSalesOrderDetailInElastic(req.body.id);
                            return SalesShippingMst.update(updateSOObj, {
                                where: {
                                    sDetID: req.body.id
                                },
                                transaction: t
                            }).then(() => SalesOrderOtherExpenseDetail.update(updateSOObj, {
                                where: {
                                    refSalesOrderDetID: req.body.id
                                },
                                transaction: t
                            }).then(() => {
                                if (!req.body.blanketPOID) {
                                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED('Sales Order Detail')));
                                } else {
                                    return module.exports.saveBlanketPOFutureOption(req, req.body.id[0], req.body.blanketPOID, t).then((responsebPO) => {
                                        if (responsebPO.status === STATE.FAILED) {
                                            t.rollback();
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: responsebPO.error,
                                                data: null
                                            });
                                        } else {
                                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED('Sales Order Detail')));
                                        }
                                    })
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            })).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
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
                        t.rollback();
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
                t.rollback();
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })
            ).catch((err) => {
                console.trace();
                console.error(err);
                t.rollback();
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })
            );
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // POST sales order other charges save
    // GET : /api/v1/salesorder/saveSalesOrderOtherCharges
    // @param {id} int
    // @return detail of sales order other charges
    saveSalesOrderOtherCharges: (req, res) => {
        const {
            SalesOrderOtherExpenseDetail,
            SalesOrderDet,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const soDetID = req.body.id;
            const soOtherChargesList = _.filter(req.body.otherChargesList, (item) => !item.isSoLevelOtherCharges);
            const soLineOtherChargesList = _.filter(req.body.otherChargesList, (item) => item.isSoLevelOtherCharges);
            return sequelize.transaction().then(t => {
                const otherChargesPromises = [];
                otherChargesPromises.push(SalesOrderOtherExpenseDetail.findAll({
                    where: {
                        refSalesOrderDetID: soDetID,
                        isDeleted: false
                    },
                    attributes: ['id'],
                    transaction: t
                }).then((soOtherList) => {
                    let updateother = _.filter(soOtherChargesList, itemUpdate => itemUpdate.id);
                    const createother = _.filter(soOtherChargesList, itemCreate => !itemCreate.id);
                    const otherIds = _.map(updateother, 'id');
                    const otherdetIds = _.map(soOtherList, 'id');
                    const removeother = _.difference(otherdetIds, otherIds);
                    _.each(removeother, (itemRemove) => {
                        updateother = _.reject(updateother, o => parseInt(o.id) === parseInt(itemRemove));
                    });
                    const otherPromise = [];
                    if (removeother.length > 0) {
                        const obj = {
                            deletedBy: req.user.id,
                            deletedAt: COMMON.getCurrentUTC(),
                            isDeleted: true,
                            updateByRoleId: req.user.defaultLoginRoleID,
                            deleteByRoleId: req.user.defaultLoginRoleID
                        };
                        otherPromise.push(SalesOrderOtherExpenseDetail.update(obj, {
                            where: {
                                id: {
                                    [Op.in]: removeother
                                }
                            },
                            transaction: t
                        }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { error: err, status: STATE.FAILED };
                        }));
                    }
                    if (createother.length > 0) {
                        _.each(createother, (othercharges) => {
                            othercharges.createdBy = req.user.id;
                            othercharges.updateByRoleId = req.user.defaultLoginRoleID;
                            othercharges.createByRoleId = req.user.defaultLoginRoleID;
                            othercharges.refSalesOrderDetID = soDetID;
                            otherPromise.push(SalesOrderOtherExpenseDetail.create(othercharges, {
                                fields: salesOtherExpenseInputFields,
                                transaction: t
                            }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return { error: err, status: STATE.FAILED };
                            }));
                        });
                    }
                    if (updateother.length > 0) {
                        _.each(updateother, (othercharges) => {
                            othercharges.updatedBy = req.user.id;
                            othercharges.updateByRoleId = req.user.defaultLoginRoleID;
                            othercharges.refSalesOrderDetID = soDetID;
                            otherPromise.push(SalesOrderOtherExpenseDetail.update(othercharges, {
                                where: {
                                    id: othercharges.id
                                },
                                fields: salesOtherExpenseInputFields,
                                transaction: t
                            }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return { error: err, status: STATE.FAILED };
                            }));
                        });
                    }
                    return Promise.all(otherPromise).then((resp) => {
                        const isIssue = _.find(resp, sts => (sts.status === STATE.FAILED));
                        if (isIssue) {
                            return isIssue;
                        } else {
                            return resp.length > 0 ? resp[0] : { status: STATE.SUCCESS };
                        }
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                }));
                otherChargesPromises.push(SalesOrderDet.findAll({
                    where: {
                        refSODetID: soDetID,
                        isDeleted: false
                    },
                    attributes: ['id'],
                    transaction: t
                }).then((soLineOtherList) => {
                    let updatlineeother = _.filter(soLineOtherChargesList, itemUpdate => itemUpdate.id);
                    const createlineother = _.filter(soLineOtherChargesList, itemCreate => !itemCreate.id);
                    const otherIds = _.map(updatlineeother, 'id');
                    const otherdetIds = _.map(soLineOtherList, 'id');
                    const removelineother = _.difference(otherdetIds, otherIds);
                    _.each(removelineother, (itemRemove) => {
                        updatlineeother = _.reject(updatlineeother, o => parseInt(o.id) === parseInt(itemRemove));
                    });
                    const otherLinePromise = [];
                    if (removelineother.length > 0) {
                        const obj = {
                            deletedBy: req.user.id,
                            deletedAt: COMMON.getCurrentUTC(),
                            isDeleted: true,
                            updateByRoleId: req.user.defaultLoginRoleID,
                            deleteByRoleId: req.user.defaultLoginRoleID
                        };
                        otherLinePromise.push(SalesOrderDet.update(obj, {
                            where: {
                                id: {
                                    [Op.in]: removelineother
                                }
                            },
                            transaction: t
                        }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { error: err, status: STATE.FAILED };
                        }));
                    }
                    if (createlineother.length > 0) {
                        _.each(createlineother, (othercharges) => {
                            othercharges.createdBy = req.user.id;
                            othercharges.updatedBy = req.user.id;
                            othercharges.updateByRoleId = req.user.defaultLoginRoleID;
                            othercharges.createByRoleId = req.user.defaultLoginRoleID;
                            othercharges.refSODetID = soDetID;
                            othercharges.remark = othercharges.lineComment;
                            othercharges.internalComment = othercharges.lineInternalComment;
                            othercharges.refSOReleaseLineID = othercharges.refReleaseLineID;
                            othercharges.shippingQty = 1;
                            othercharges.kitQty = 0;
                            othercharges.partCategory = DATA_CONSTANT.PART_CATEGORY.COMPONENT.ID;
                            othercharges.quoteFrom = DATA_CONSTANT.SUPPLIER_QUOTE_FROM.NA;
                            otherLinePromise.push(SalesOrderDet.create(othercharges, {
                                fields: salesDetInputFields,
                                transaction: t
                            }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return { error: err, status: STATE.FAILED };
                            }));
                        });
                    }
                    if (updatlineeother.length > 0) {
                        _.each(updatlineeother, (othercharges) => {
                            othercharges.updatedBy = req.user.id;
                            othercharges.updateByRoleId = req.user.defaultLoginRoleID;
                            othercharges.refSODetID = soDetID;
                            othercharges.remark = othercharges.lineComment;
                            othercharges.internalComment = othercharges.lineInternalComment;
                            othercharges.refSOReleaseLineID = othercharges.refReleaseLineID;
                            othercharges.shippingQty = 1;
                            othercharges.kitQty = 0;
                            othercharges.partCategory = DATA_CONSTANT.PART_CATEGORY.COMPONENT.ID;
                            othercharges.quoteFrom = DATA_CONSTANT.SUPPLIER_QUOTE_FROM.NA;
                            otherLinePromise.push(SalesOrderDet.update(othercharges, {
                                where: {
                                    id: othercharges.id
                                },
                                fields: salesDetInputFields,
                                transaction: t
                            }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return { error: err, status: STATE.FAILED };
                            }));
                        });
                    }
                    return Promise.all(otherLinePromise).then((resp) => {
                        const isIssue = _.find(resp, sts => (sts.status === STATE.FAILED));
                        if (isIssue) {
                            return isIssue;
                        } else {
                            return resp.length > 0 ? resp[0] : { status: STATE.SUCCESS };
                        }
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                }))
                return Promise.all(otherChargesPromises).then((resp) => {
                    const isIssue = _.find(resp, sts => (sts.status === STATE.FAILED));
                    if (isIssue) {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: isIssue.error,
                            data: null
                        });
                    } else {
                        const objSO = {
                            id: req.body.soID,
                            isSOrevision: req.body.isSOrevision,
                            isAskForVersionConfirmation: req.body.isAskForVersionConfirmation
                        }
                        return module.exports.checkForSORevisionUpdate(req, res, objSO, t).then(() => {
                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(salesOrderModuleName)));
                        });
                    }
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
    // POST sales order release line remove
    // GET : /api/v1/salesorder/removeSalesOrderReleaseLineDetail
    // @param {id} int
    // @return detail of sales order release line
    removeSalesOrderReleaseLineDetail: (req, res) => {
        const {
            SalesShippingMst,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const obj = {
                deletedBy: req.user.id,
                deletedAt: COMMON.getCurrentUTC(),
                isDeleted: true,
                updateByRoleId: req.user.defaultLoginRoleID,
                deleteByRoleId: req.user.defaultLoginRoleID
            };
            return sequelize.transaction().then(t => SalesShippingMst.update(obj, {
                where: {
                    shippingID: req.body.id
                },
                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updateByRoleId', 'deleteByRoleId'],
                transaction: t
            }).then(() => {
                const objSO = {
                    id: req.body.soID,
                    isSOrevision: req.body.isSOrevision,
                    isAskForVersionConfirmation: req.body.isAskForVersionConfirmation
                }
                return module.exports.checkForSORevisionUpdate(req, res, objSO, t).then(() => {
                    t.commit().then(() => {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED('Shipping Detail'));
                    })
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                t.rollback();
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
    // GET : /api/v1/salesorder/saveRfqAssemblyDetailWinLost
    // @param {id} int
    // @return detail of sales order assy win or lost
    saveRfqAssemblyDetailWinLost: (req, t, objAssy) => {
        const {
            RFQAssemblies
        } = req.app.locals.models;
        return RFQAssemblies.findOne({
            where: {
                partID: objAssy.partID,
                rfqrefID: objAssy.refRFQGroupID || null,
                isDeleted: false
            },
            transaction: t,
            model: RFQAssemblies,
            attributes: ['id', 'status']
        }).then((rfqAssy) => {
            if (rfqAssy && (rfqAssy.status === DATA_CONSTANT.RFQ_ASSY_STATUS.FOLLOW_UP.VALUE || rfqAssy.status === DATA_CONSTANT.RFQ_ASSY_STATUS.WON.VALUE)) {
                const objAssyWin = {
                    status: DATA_CONSTANT.RFQ_ASSY_STATUS.WON.VALUE,
                    winprice: objAssy.price,
                    winquantity: objAssy.qty,
                    reason: 'Auto',
                    quoteclosedDate: COMMON.getCurrentUTC(),
                    quoteFinalStatus: DATA_CONSTANT.RFQ_ASSY_STATUS.LOST.VALUE,
                    updatedBy: req.user.id,
                    updateByRoleId: req.user.defaultLoginRoleID
                };
                return RFQAssemblies.update(objAssyWin, {
                    where: {
                        id: rfqAssy.id,
                        isDeleted: false
                    },
                    fields: ['status', 'winprice', 'winquantity', 'reason', 'quoteclosedDate', 'quoteFinalStatus', 'updatedBy', 'updateByRoleId'],
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
    },

    // get active sales order details list
    // POST : /api/v1/getActiveSalesOrderDetailsList
    // @return active sales order details list
    getsalesOrderHoldUnhold: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetSalesOrderHoldUnhold (:psalesorderID)', {
                replacements: {
                    psalesorderID: (req.body.id)
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // get all sales commission details
    // POST : /api/v1/getSalesCommissionDetailToExport
    // @return sales commission detail
    getSalesCommissionDetailToExport: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_getSalesCommissionDetailToExport (:pID,:pDetID,:pisFromSO)', {
                replacements: {
                    pID: (req.body.id),
                    pDetID: (req.body.detID || null),
                    pisFromSO: (req.body.isFromSO || false),
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // get promised ship date from dock date
    // POST : /api/v1/getSOPromisedShipDateFromDockDate
    // @return promised ship date
    getSOPromisedShipDateFromDockDate: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetSoRequestedPromisedDatefromDockDate (:pdockDate)', {
                replacements: {
                    pdockDate: (req.body.dockDate)
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // get quote active/expired Status
    // POST : /api/v1/getQuoteStatusForSalesCommission
    // @return quote active/expired Status
    getQuoteStatusForSalesCommission: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetCurrentQuoteStatusForCommission (:prfqAssyID, :pPartID)', {
                replacements: {
                    prfqAssyID: req.body.rfqAssyID || null,
                    pPartID: req.body.partID || null
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // get blanket po assy list based on partid and customerID
    // POST : /api/v1/getBlanketPOAssyList
    // @return pending blanket po assy list
    getBlanketPOAssyList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_getBlanketPOAssyList (:pCustomerID, :pPartID, :pblanketPOID)', {
                replacements: {
                    pCustomerID: req.body.customerID || null,
                    pPartID: req.body.partID || null,
                    pblanketPOID: req.body.blanketPOID || null
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // get blanket po used qty for assy
    // POST : /api/v1/getBlanketPOUsedQtyForAssy
    // @return pending blanket po qty
    getBlanketPOUsedQtyForAssy: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_getBlanketPOUsedQty (:pSdetID)', {
                replacements: {
                    pSdetID: req.body.id || null
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // GET : /api/v1/salesorder/getSalesOrderDetailByPartId
    // @param {partId} int
    // @return detail of sales order assy win or lost
    getSalesOrderDetailByPartId: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetSalesOrderDetailByPartId (:pPartId, :pSearchPO, :pSalesOrderDetId, :pIncludeCompleted)', {
                replacements: {
                    pPartId: req.body.partID || null,
                    pSearchPO: req.body.searchPO || '',
                    pSalesOrderDetId: req.body.refSalesOrderDetID || null,
                    pIncludeCompleted: req.body.includeCompleted || null
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null
            });
        }
    },
    // GET : /api/v1/salesorder/checkPartStatusOfSalesOrder
    // @param {id} int
    // @return detail of sales order parts active or not
    checkPartStatusOfSalesOrder: (req, res) => {
        const {
            SalesOrderDet,
            Component
        } = req.app.locals.models;

        if (req.params && req.params.id) {
            return SalesOrderDet.findOne({
                where: {
                    refSalesOrderID: req.params.id,
                    isDeleted: false
                },
                attributes: ['id', 'refSalesOrderID', 'partID'],
                include: [{
                    model: Component,
                    as: 'componentAssembly',
                    where: {
                        partStatus: DATA_CONSTANT.PartStatusList.InternalInactive,
                        isDeleted: false,
                        mfgType: DATA_CONSTANT.MFG_TYPE.MFG
                    },
                    attributes: ['id', 'partStatus', 'mfgPN', 'PIDCode']
                }]
            }).then(InactivePart => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, InactivePart, null))
                .catch((err) => {
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
    // GET salesorder description/comment list
    // GET : /api/v1/salesorder/getDuplicateSalesOrderCommentsList
    // @param {id} int
    // @return detail sales description list
    getDuplicateSalesOrderCommentsList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.id) {
            return sequelize
                .query('CALL Sproc_GetDuplicateSalesOrderCommentsList (:pSOID)', {
                    replacements: {
                        pSOID: req.params.id
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(salesOrder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    partshippingComments: _.values(salesOrder[0]),
                    partinternalComments: _.values(salesOrder[1]),
                    partDescription: _.values(salesOrder[2])
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
    // POST copy sales Order detail
    // POST : /api/v1/salesorder/copySalesOrderDetail
    // @param {id} int
    // @return detail of sales order release line
    copySalesOrderDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            req.body.iscopyPO = true;
            return sequelize.transaction().then(t => module.exports.getSalesOrderNumberForAPIs(req, t).then((soNumber) => {
                if (soNumber) {
                    req.body.createdBy = req.user.id;
                    return getSystemIdPromise(req, res, DATA_CONSTANT.SONUMBER_SYSID, t).then((response) => {
                        if (response.systemId) {
                            return sequelize
                                .query('CALL Sproc_SaveDuplicateSalesOrder (:pSOID,:pSONumber,:pPONumber,:pPODate,:pSODate,:puserID,:puserRoleID,:pSerialNumber,:pisKeepPO,:ppoRevision,:ppoRevisionDate)', {
                                    replacements: {
                                        pSOID: req.body.id,
                                        pSONumber: soNumber,
                                        pPONumber: req.body.poNumber,
                                        pPODate: req.body.poDate,
                                        pSODate: req.body.soDate,
                                        puserID: req.user.id,
                                        puserRoleID: COMMON.getRequestUserLoginRoleID(req),
                                        pSerialNumber: response.systemId,
                                        pisKeepPO: req.body.pisKeepPO || false,
                                        ppoRevision: req.body.poRevision || null,
                                        ppoRevisionDate: req.body.poRevisionDate || null,
                                    },
                                    transaction: t
                                }).then(salesOrder => t.commit().then(() => {
                                    req.body.id = salesOrder[0].vNewSOID;
                                    //  Add Sales Order into Elastic Search Engine for Enterprise Search
                                    req.params = {
                                        id: salesOrder[0].vNewSOID
                                    };
                                    EnterpriseSearchController.manageSalesOrderDetailInElastic(req);
                                    EnterpriseSearchController.manageSalesOrderInElastic(req);
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.CREATED(salesOrderModuleName));
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
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
                        data: null
                    });
                }
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // POST sales order number based on SO date
    // POST : /api/v1/salesorder/getSalesOrderNumberForAPIs
    // @return latest sales order available number
    getSalesOrderNumberForAPIs: (req, t) => {
        const {
            sequelize,
            SalesOrderMst
        } = req.app.locals.models;
        if (req.body) {
            return SalesOrderMst.findAll({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('date', sequelize.col('soDate')), '=', req.body.soDate)
                    ]
                },
                paranoid: false,
                transaction: t
            }).then((salesorders) => {
                COMMON.setSalesOrder(req, salesorders.length);
                return req.body.salesOrderNumber;
            }).catch((err) => {
                console.trace();
                console.error(err);
                return '';
            })
        } else {
            return '';
        }
    },
    // GET salesorder assy mismatch list
    // GET : /api/v1/salesorder/getCopySalesOrderAssyMismatch
    // @param {id} int
    // @return detail sales assy mismatch list
    getCopySalesOrderAssyMismatch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.id) {
            return sequelize
                .query('CALL Sproc_GetCopySalesOrderAssyMismatch (:pSOID)', {
                    replacements: {
                        pSOID: req.params.id
                    }
                }).then(salesOrder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, salesOrder, null)
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
    // GET sales order packing slip number
    // GET : /api/v1/salesorder/getSalesOrderPackingSlipNumber
    // @param {id} int
    // @return detail sales order packing slip number
    getSalesOrderPackingSlipNumber: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.id || req.body.soID) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize
                .query('CALL Sproc_GetShippedPackingSlipDetailBySoDetID (:ppageIndex,:precordPerPage,:pOrderBy, :pWhereClause, :psalesorderDetID,:preleaseLineId, :pSalesOrderID, :pPackingSlipStatus)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        psalesorderDetID: req.body.id || null,
                        preleaseLineId: req.body.releaseID || null,
                        pSalesOrderID: req.body.soID || null,
                        pPackingSlipStatus: req.body.cpsStatus || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(salesOrder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    shipList: _.values(salesOrder[1]),
                    Count: salesOrder[0][0].TotalRecord
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
    // GET sales order packing slip number
    // GET : /api/v1/salesorder/getSalesOrderShipmentSummary
    // @param {id} int
    // @return detail sales order shipment summary
    getSalesOrderShipmentSummary: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize
                .query('CALL Sproc_getSalesOrderListAgainstShipment (:ppageIndex, :precordPerPage, :pCustomer, :pSearchText,:pSoWorkingStatus, :pAllowToUpdateComment, :pSortByColumn, :pSoStatus, :pSortingOrder)', {
                    replacements: {
                        ppageIndex: req.body.page,
                        precordPerPage: req.body.pageSize,
                        pCustomer: req.body.customerID || null,
                        pSearchText: req.body.searchText || null,
                        pSoWorkingStatus: req.body.soWorkingStatus || 1,
                        pAllowToUpdateComment: req.body.allowToUpdateComment || null,
                        pSortByColumn: req.body.sortingColumn || null,
                        pSoStatus: req.body.soStatus || -1,
                        pSortingOrder: req.body.sortingOrder || 1
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((resShip) => {
                    let shipmentHeader = [];
                    let shipmentDetail = [];
                    let releaseDetail = [];
                    let totalCount = [];
                    if (resShip && resShip.length > 0) {
                        shipmentHeader = resShip[0] ? _.values(resShip[0]) : [];
                        shipmentDetail = resShip[1] ? _.values(resShip[1]) : [];
                        releaseDetail = resShip[2] ? _.values(resShip[2]) : [];
                        totalCount = resShip[3] ? _.values(resShip[3]) : [];
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { headerData: shipmentHeader, detailData: shipmentDetail, releaseData: releaseDetail, totalRecord: totalCount }, null);
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
    // GET sales order packing slip number
    // GET : /api/v1/salesorder/updateSalesOrderFromShipmentSummary
    // @param {id} int
    // @return detail sales order shipment summary
    updateSalesOrderFromShipmentSummary: (req, res) => {
        const { sequelize, SalesOrderDet, SalesShippingMst, SalesOrderMst } = req.app.locals.models;
        const promises = [];
        if (req.body) {
            return sequelize.transaction().then((t) => {
                COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.updateDetObj);
                _.each(req.body.updateDetObj, (det) => {
                    det.releaseLevelComment = det.tbdComment;
                    promises.push(SalesOrderDet.update(det, {
                        where: { id: det.soDetId },
                        fields: ['woComment', 'releaseLevelComment', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                        transaction: t
                    }));
                });
                COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.updateRelObj);
                _.each(req.body.updateRelObj, (det) => {
                    det.releaseNotes = det.releaseLineComment;
                    promises.push(SalesShippingMst.update(det, {
                        where: { shippingID: det.releaseId },
                        fields: ['releaseNotes', 'isReadyToShip', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                        transaction: t
                    }));
                });
                COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.updateHeaderObj);
                _.each(req.body.updateHeaderObj, (det) => {
                    promises.push(SalesOrderMst.update(det, {
                        where: { id: det.id },
                        fields: ['revision', 'isAskForVersionConfirmation', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                        transaction: t
                    }));
                });
                return Promise.all(promises).then(() =>
                    t.commit().then(() => {
                        if (req.body.socketIds && req.body.socketIds.length > 0) {
                            RFQSocketController.updateSOVersionConfirmFlag(req, {
                                data: req.body.socketIds
                            });
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(salesOrderShimentName));
                    })).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });;
        } else {

            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // POST sales order blanket po detail
    // @return updated blanket PO Details
    saveBlanketPOFutureOption: (req, sDetID, blanketPOID, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize
            .query('CALL Sproc_SaveBlanketPOLinkFuturePOOption (:pSoDetID,:pBlanketPOID,:pUserID,:pUserRoleID)', {
                replacements: {
                    pSoDetID: sDetID,
                    pBlanketPOID: blanketPOID,
                    pUserID: req.user.id,
                    pUserRoleID: COMMON.getRequestUserLoginRoleID(req)
                },
                transaction: t
            }).then(() => { return { status: STATE.SUCCESS } }).catch((err) => {
                console.trace();
                console.error(err);
                return { error: err, status: STATE.FAILED };
            });
    },
    // POST Remove Sales Shipping Details
    // @return Blanket PO Sales Shipping Details
    removeSalesShippingDetails: (req, oldBlanketPOID, sDetID, IsBlanketPORemove, isunLink, t) => {
        const { sequelize } = req.app.locals.models;
        return sequelize
            .query('CALL Sproc_removeBlanketPOLinkFuturePOOption (:pSoDetID,:pBlanketPOID, :pisBPORemove, :pUserID,:pUserRoleID,:punlink)', {
                replacements: {
                    pSoDetID: sDetID,
                    pBlanketPOID: oldBlanketPOID,
                    pisBPORemove: IsBlanketPORemove,
                    pUserID: req.user.id,
                    pUserRoleID: req.user.defaultLoginRoleID,
                    punlink: isunLink
                },
                transaction: t
            }).then(() => STATE.SUCCESS
            ).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
    },
    // POST sales order validation details
    // @return get blanket PO Details
    getSalesOrderBPOValidationDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize
                .query('CALL Sproc_getSalesOrderBPOValidationDetails (:psoID)', {
                    replacements: {
                        psoID: req.body.id
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(bPOsalesOrder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { customerPackingSlip: _.values(bPOsalesOrder[0]), blanketPODetails: _.values(bPOsalesOrder[1]) }, null)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // remove assigned blanket po option
    // POST Remove Blanket PO Assigned Details
    // @return Blanket PO Details
    unlinkFuturePOFromBlanketPO: (req, res) => {
        const { sequelize, SalesOrderDet, SalesOrderMst, CustomerPackingSlipDet, CustomerPackingSlip } = req.app.locals.models;
        if (req.body && req.body.id) {
            return sequelize.transaction().then((t) => {
                return SalesOrderDet.findOne({
                    where: {
                        id: req.body.id,
                        isDeleted: false
                    },
                    attributes: ['id', 'refSalesOrderID', 'refBlanketPOID', 'salesOrderDetStatus'],
                    transaction: t,
                    include: [{
                        model: SalesOrderMst,
                        as: 'salesOrderMst',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'linkToBlanketPO', 'poNumber']
                    }, {
                        model: CustomerPackingSlipDet,
                        as: 'customerPackingSlipDet',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['shipQty', 'id'],
                        required: false,
                        include: [{
                            model: CustomerPackingSlip,
                            as: 'customerPackingSlip',
                            where: {
                                isDeleted: false,
                                transType: 'P'
                            },
                            attributes: ['transType', 'id'],
                            required: false
                        }]
                    }]
                }).then((response) => {
                    if (response) {
                        if (response.salesOrderMst.linkToBlanketPO) {
                            let messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.LINKTOBPO_ALERT_NOT_REMOVE);
                            messageContent.message = COMMON.stringFormat(messageContent.message, response.salesOrderMst.poNumber);
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: null,
                                messageContent: messageContent,
                                data: null
                            });
                        } else if (response.customerPackingSlipDet && response.customerPackingSlipDet.length > 0) {
                            let messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.CUSTOMER_PACKINGSLIP_SHIP_BPO);
                            messageContent.message = COMMON.stringFormat(messageContent.message, response.salesOrderMst.poNumber, response.customerPackingSlipDet.length);
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: null,
                                messageContent: messageContent,
                                data: null
                            });

                        } else {
                            return module.exports.removeSalesShippingDetails(req, req.body.blanketPOID, req.body.id, true, true, t).then((responseDetail) => {
                                if (responseDetail === STATE.SUCCESS) {
                                    t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, "Future PO unlinked successfully"))
                                } else {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: null,
                                        data: null
                                    });
                                }
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            })
                        }
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.NOT_FOUND(salesOrderModuleName),
                            err: null,
                            data: null
                        });
                    }
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                })
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // GET sales order pending linked future PO
    // @return not linked future po of customer
    getSalesOrderFPONotLinkedList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize
                .query('CALL Sproc_GetNotAssignedFuturePOList (:pPartID,:pcustomerID)', {
                    replacements: {
                        pPartID: req.body.partID,
                        pcustomerID: req.body.customerID
                    }
                }).then(fPOalesOrder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, fPOalesOrder, null)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // POST future po mapped with blanket PO
    // @return linked po
    linkFuturePOToBlanketPO: (req, res) => {
        const {
            sequelize,
            SalesOrderDet
        } = req.app.locals.models;
        if (req.body) {
            const promiseDet = [];
            return sequelize.transaction().then((t) => {
                _.each(req.body.mappedList, (item) => {
                    promiseDet.push(
                        SalesOrderDet.findOne({
                            where: {
                                id: item.soID,
                                isDeleted: false
                            },
                            attributes: ['id', 'refSalesOrderID', 'salesOrderDetStatus'],
                            transaction: t
                        }).then((sDet) => {
                            if (sDet) {
                                const updateObj = {
                                    refBlanketPOID: req.body.blanketID,
                                    updatedBy: req.user.id,
                                    updateByRoleId: req.user.defaultLoginRoleID
                                }
                                return SalesOrderDet.update(updateObj, {
                                    where: {
                                        id: item.soID,
                                        isDeleted: false
                                    },
                                    fields: ['refBlanketPOID', 'updatedBy', 'updateByRoleId'],
                                    transaction: t
                                }).then(() => {
                                    return module.exports.saveBlanketPOFutureOption(req, item.soID, req.body.blanketID, t).then((bpoResponse) => {
                                        return bpoResponse;
                                    })
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { status: STATE.FAILED, err: err };
                                })
                            } else {
                                return { status: STATE.SUCCESS };
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { status: STATE.FAILED, err: err };
                        })
                    )
                });
                return Promise.all(promiseDet).then((promises) => {
                    const isfailed = _.find(promises, (item) => item.status === STATE.FAILED);
                    if (isfailed) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: isfailed.err, data: null });
                    } else {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, "Future PO linked successfully"))
                    }
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
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

    // POST future po mapped with blanket PO
    // @return linked po details    
    getLinkedFuturePODetails: (req, res) => {
        const { SalesOrderDet } = req.app.locals.models;
        if (req.body) {
            return SalesOrderDet.findOne({
                where: {
                    id: req.body.soDetId,
                    isDeleted: false
                },
                attributes: ['id', 'refSalesOrderID', 'salesOrderDetStatus'],
                include: [{
                    model: SalesOrderDet,
                    as: 'salesOrderBlanketPODet',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'qty'],
                    required: false
                }]
            }).then(salesDet => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, salesDet, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }

};