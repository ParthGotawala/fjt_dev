const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const moment = require('moment');
const { getSystemIdPromise } = require('../../utility/controllers/UtilityController');

const approvalInputFields = ['id', 'transactionType', 'approveFromPage', 'confirmationType', 'refTableName', 'refID', 'approvedBy', 'approvalReason',
  'isDeleted', 'createdBy', 'updatedBy', 'deletedBy'
];
const inputFields = [
  'id',
  'supplierID',
  'poNumber',
  'poDate',
  'status',
  'soNumber',
  'soDate',
  'shippingMethodID',
  'termsID',
  'supplierAddressID',
  'shippingAddressID',
  'contactPersonEmpID',
  'intermediateShipmentID',
  'freeOnBoardID',
  'serialNumber',
  'isDeleted',
  'poComment',
  'poRevision',
  'carrierID',
  'isAlreadyPublished',
  'carrierAccountNumber',
  'shippingInsurance',
  'supplierAddress',
  'shippingAddress',
  'intermediateAddress',
  'isBlanketPO',
  'poWorkingStatus',
  'shippingComment',
  'poCompleteReason',
  'poCompleteType',
  'createdBy',
  'updatedBy',
  'deletedBy',
  'createByRoleId',
  'updateByRoleId',
  'deletedAt',
  'updatedAt',
  'cancleReason',
  'CancellationConfirmed',
  'isCustConsigned',
  'customerID',
  'isNonUMIDStock',
  'lockStatus',
  'lockedBy',
  'lockedByRoleId',
  'lockedAt',
  'isAskForVersionConfirmation',
  'supplierContactPerson',
  'supplierContactPersonID',
  'shippingContactPerson',
  'shippingContactPersonID',
  'intermediateContactPerson',
  'intermediateContactPersonID'
];
const updateInputFields = [
  'poDate',
  'soDate',
  'soNumber',
  'contactPersonEmpID',
  'termsID',
  'isBlanketPO',
  'shippingMethodID',
  'carrierID',
  'carrierAccountNumber',
  'shippingInsurance',
  'freeOnBoardID',
  'isCustConsigned',
  'customerID',
  'isNonUMIDStock',
  'shippingComment',
  'poComment',
  'poRevision',
  'isAlreadyPublished',
  'poWorkingStatus',
  'isAskForVersionConfirmation',
  'status',
  'supplierAddressID',
  'shippingAddressID',
  'intermediateShipmentID',
  'supplierAddress',
  'shippingAddress',
  'intermediateAddress',
  'updatedBy',
  'updateByRoleId',
  'updatedAt',
  'supplierContactPerson',
  'supplierContactPersonID',
  'shippingContactPerson',
  'shippingContactPersonID',
  'intermediateContactPerson',
  'intermediateContactPersonID',
  'CancellationConfirmed',
  'cancleReason'
];
const purchaseDetInputFields = [
  'id',
  'refPurchaseOrderID',
  'mfgPartID',
  'supplierPartID',
  'packagingID',
  'partDescription',
  'pcbPerArray',
  'rohsStatusID',
  'internalRef',
  'totalRelease',
  'salesCommissionTo',
  'supplierQuoteNumber',
  'qty',
  'price',
  'lineComment',
  'category',
  'isDeleted',
  'createdBy',
  'updatedBy',
  'deletedBy',
  'createByRoleId',
  'updateByRoleId',
  'deleteByRoleId',
  'lineID',
  'deletedAt',
  'updatedAt',
  'internalLineComment',
  'isLineCustConsigned',
  'lineCustomerID',
  'isNonUMIDStock'
];
const purchaseShippingInputFields = [
  'id',
  'refPurchaseOrderDetID',
  'qty',
  'shippingDate',
  'promisedShipDate',
  'releaseNumber',
  'shippingMethodID',
  'shippingAddressID',
  'releaseNotes',
  'additionalNotes',
  'poLineWorkingStatus',
  'receivedQty',
  'isDeleted',
  'createdBy',
  'updatedBy',
  'deletedBy',
  'createByRoleId',
  'updateByRoleId',
  'deleteByRoleId',
  'deletedAt',
  'updatedAt',
  'poLineCompleteReason',
  'poLineCompleteType',
  'carrierID',
  'carrierAccountNumber',
  'shippingAddress',
  'shippingContactPerson',
  'shippingContactPersonID'
];
const purchaseShippingInputFieldsExcludeStatus = [
  'id',
  'refPurchaseOrderDetID',
  'qty',
  'shippingDate',
  'promisedShipDate',
  'releaseNumber',
  'shippingMethodID',
  'shippingAddressID',
  'releaseNotes',
  'additionalNotes',
  'isDeleted',
  'createdBy',
  'updatedBy',
  'deletedBy',
  'createByRoleId',
  'updateByRoleId',
  'deleteByRoleId',
  'deletedAt',
  'updatedAt',
  'carrierID',
  'carrierAccountNumber',
  'shippingAddress',
  'shippingContactPerson',
  'shippingContactPersonID'
];
const purchaseOtherExpenseInputFields = [
  'id',
  'refPurchaseOrderDetID',
  'partID',
  'qty',
  'price',
  'frequency',
  'lineComment',
  'lineInternalComment',
  'isDeleted',
  'createdBy',
  'updatedBy',
  'deletedBy',
  'createByRoleId',
  'updateByRoleId',
  'deleteByRoleId',
  'deletedAt',
  'updatedAt'
];
const purchaseRequirementInputFields = [
  'id',
  'refPurchaseOrderDetID',
  'instruction',
  'isDeleted',
  'createdBy',
  'updatedBy',
  'deletedBy',
  'createByRoleId',
  'updateByRoleId',
  'deleteByRoleId',
  'deletedAt',
  'updatedAt'
];

const purchaseOrderModuleName = DATA_CONSTANT.PURCHASE_ORDER.Name;

module.exports = {
  // Get detail of Purchase Order
  // GET : /api/v1/purchaseOrder/retrievePurchaseOrder
  // @param {id} int
  // @return detail of Purchase Order
  retrievePurchaseOrder: async (req, res) => {
    const {
      PurchaseOrderMst,
      PurchaseOrderDet,
      PurchaseOrderLineReleaseDet,
      GenericCategory,
      CustomerAddresses,
      CountryMst,
      PurchaseOrderLineOtherCharges,
      Component,
      RFQRoHS,
      ComponentPackagingMst,
      PurchaseOrderLineRequirementDet,
      UOMs,
      MfgCodeMst,
      PackingSlipMaterialReceive,
      Employee,
      User,
      sequelize
    } = req.app.locals.models;
    if (req.params.id) {
      try {
        const mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
          type: sequelize.QueryTypes.SELECT
        });

        functionDetail = await sequelize.query('Select fun_getTimeZone() as TimeZone,fun_getDateTimeFormat() as dateFormat ', {
          type: sequelize.QueryTypes.SELECT
        });

        const purchaseorder = await PurchaseOrderMst.findOne({
          where: {
            id: req.params.id,
            isDeleted: false
          },
          model: PurchaseOrderMst,
          attributes: [...inputFields,
          [sequelize.fn('fun_getUserNameByID', sequelize.col('PurchaseOrderMst.lockedBy')), 'lockedByName'],
          [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('PurchaseOrderMst.lockedAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'lockedAt']
          ],
          include: [{
            model: PurchaseOrderDet,
            as: 'purchaseOrderDet',
            attributes: purchaseDetInputFields,
            required: false,
            where: {
              isDeleted: false
            },
            include: [
              {
                model: PurchaseOrderLineReleaseDet,
                as: 'purchaseOrderLineReleaseDet',
                where: {
                  isDeleted: false
                },
                attributes: purchaseShippingInputFields,
                required: false,
                include: [{
                  model: GenericCategory,
                  as: 'shippingMethodPurchaseOrder',
                  where: {
                    isDeleted: false
                  },
                  attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode'],
                  required: false
                },
                {
                  model: CustomerAddresses,
                  as: 'customerPurchaseOrderAddress',
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
                },
                {
                  model: GenericCategory,
                  as: 'releaseLineCarrierPurchaseOrder',
                  where: {
                    isDeleted: false
                  },
                  attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode'],
                  required: false
                }
                ]
              },
              {
                model: PurchaseOrderLineOtherCharges,
                as: 'purchaseOrderLineOtherCharges',
                where: {
                  isDeleted: false
                },
                attributes: purchaseOtherExpenseInputFields,
                required: false
              },
              {
                model: Component,
                as: 'mfgParts',
                where: {
                  isDeleted: false
                },
                attributes: ['id', 'mfgPN', 'PIDCode', 'mfgCodeID', 'rev', 'nickName', 'functionalCategoryID', 'mfgPNDescription', 'isCustom', 'partType', 'unit', 'packageQty', 'imageURL', 'documentPath', 'minimum', 'mult', 'custAssyPN', 'isCPN'],
                required: false,
                include: [{
                  model: UOMs,
                  as: 'UOMs',
                  where: {
                    isDeleted: false
                  },
                  attributes: ['id', 'unitName'],
                  required: false
                }, {
                  model: MfgCodeMst,
                  as: 'mfgCodemst',
                  where: {
                    isDeleted: false
                  },
                  attributes: ['mfgCode', 'mfgName', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('purchaseOrderDet.mfgParts.mfgCodemst.mfgCode'), sequelize.col('purchaseOrderDet.mfgParts.mfgCodemst.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
                  required: false
                }]
              },
              {
                model: Component,
                as: 'supplierParts',
                where: {
                  isDeleted: false
                },
                attributes: ['id', 'mfgPN', 'PIDCode', 'rev', 'nickName', 'mfgPNDescription', 'isCustom', 'partType', 'unit', 'packageQty', 'minimum', 'mult'],
                required: false
              },
              {
                model: RFQRoHS,
                as: 'rfqRoHS',
                where: {
                  isDeleted: false
                },
                attributes: ['id', 'name', 'rohsIcon'],
                required: false
              },
              {
                model: ComponentPackagingMst,
                as: 'componentPackagingMst',
                where: {
                  isDeleted: false
                },
                attributes: ['id', 'name'],
                required: false
              },
              {
                model: PurchaseOrderLineRequirementDet,
                as: 'purchaseOrderLineRequirementDet',
                where: {
                  isDeleted: false
                },
                attributes: ['id', 'instruction', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'],
                required: false
              },
              {
                model: MfgCodeMst,
                as: 'customers',
                where: {
                  isDeleted: false
                },
                attributes: ['mfgCode', 'mfgName', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('purchaseOrderDet.customers.mfgCode'), sequelize.col('purchaseOrderDet.customers.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'customerName']],
                required: false
              }
            ]
          }, {
            model: MfgCodeMst,
            as: 'suppliers',
            attributes: ['mfgCode', 'mfgName', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('suppliers.mfgCode'), sequelize.col('suppliers.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
            required: false,
            where: {
              isDeleted: false
            }
          }, {
            model: MfgCodeMst,
            as: 'customers',
            attributes: ['mfgCode', 'mfgName', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('customers.mfgCode'), sequelize.col('customers.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
            required: false,
            where: {
              isDeleted: false
            }
          }, {
            model: PackingSlipMaterialReceive,
            as: 'packingSlipMaterialReceive',
            attributes: ['id', 'packingSlipNumber'],
            required: false,
            where: {
              isDeleted: false
            }
          }, {
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
          }]
        });

        if (!purchaseorder) {
          return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(purchaseOrderModuleName), err: null, data: null });
        }
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, purchaseorder, null);
      } catch (err) {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
      }
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    }
  },
  // GET purchase order detail
  // GET : /api/v1/purchaseOrder/getPurchaseOrderDetailByID
  // @param {id} int
  // @return detail of purchase order
  getPurchaseOrderDetailByID: async (req, res) => {
    const {
      PurchaseOrderMst, MfgCodeMst, PackingSlipMaterialReceive, sequelize
    } = req.app.locals.models;
    if (req.params.id) {
      try {
        const mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
          type: sequelize.QueryTypes.SELECT
        });

        functionDetail = await sequelize.query('Select fun_getTimeZone() as TimeZone,fun_getDateTimeFormat() as dateFormat ', {
          type: sequelize.QueryTypes.SELECT
        });

        const purchaseorder = await PurchaseOrderMst.findOne({
          where: {
            id: req.params.id,
            isDeleted: false
          },
          model: PurchaseOrderMst,
          attributes: [...inputFields,
          [sequelize.fn('fun_getUserNameByID', sequelize.col('PurchaseOrderMst.lockedBy')), 'lockedByName'],
          [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('PurchaseOrderMst.lockedAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'lockedAt']],
          include: [{
            model: MfgCodeMst,
            as: 'suppliers',
            attributes: ['mfgCode', 'mfgName', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('suppliers.mfgCode'), sequelize.col('suppliers.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
            required: false,
            where: {
              isDeleted: false
            },
          }, {
            model: PackingSlipMaterialReceive,
            as: 'packingSlipMaterialReceive',
            where: {
              isDeleted: false
            },
            attributes: ['id', 'supplierSONumber', 'packingSlipNumber'],
            required: false
          }]
        });

        if (!purchaseorder) {
          return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
        }
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, purchaseorder, null);
      } catch (err) {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
      }
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },
  // GET All purchase order detail
  // GET : /api/v1/purchaseOrder/getPurchaseOrderDetails
  // @return detail of purchase order
  getPurchaseOrderDetails: async (req, res) => {
    try {
      const {
        PurchaseOrderMst,
        MfgCodeMst,
        sequelize
      } = req.app.locals.models;

      const mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
        type: sequelize.QueryTypes.SELECT
      });

      const Where = {
        isDeleted: false
      };
      if (req.query && req.query.poNumber) {
        Where.poNumber = {
          [Op.like]: `%${req.query.poNumber}%`
        };
      }

      const response = await PurchaseOrderMst.findAll({
        where: Where,
        model: PurchaseOrderMst,
        attributes: ['poNumber', 'id', 'soNumber'],
        include: [{
          model: MfgCodeMst,
          as: 'suppliers',
          where: {
            isDeleted: false
          },
          attributes: ['mfgCode', 'mfgName', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('suppliers.mfgCode'), sequelize.col('suppliers.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
          required: false
        }]
      });

      if (!response) {
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
          messageContent: MESSAGE_CONSTANT.NOT_FOUND(purchaseOrderModuleName),
          err: null,
          data: null
        });
      } else {
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
          STATE.SUCCESS,
          response,
          null);
      }
    } catch (err) {
      console.trace();
      console.error(err);
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    }
  },

  // POST purchase order number based on PO date
  // POST : /api/v1/purchaseOrder/getPurchaseOrderNumberForAPIs
  // @return latest purchase order available number
  getPurchaseOrderNumberForAPIs: (req, res, t) => {
    const {
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      let poNumber = null;
      req.body.poDateFormat = moment(req.body.poDate).format(DATA_CONSTANT.PONUMBER_DATE_FORMAT);
      return sequelize.query('CALL Sproc_GetPurchaseOrderFormat (:ppurchaseorderdate,:pempID,:pformatedDate)', {
        replacements: {
          ppurchaseorderdate: req.body.poDate,
          pempID: req.body.employeeID,
          pformatedDate: req.body.poDateFormat
        },
        transaction: t
      }).then((poDetails) => {
        if (poDetails && poDetails.length > 0) {
          COMMON.setPurchaseOrderNumber(req, (poDetails[0].maxNumber + 1), poDetails[0].initialName); // set po number format
          poNumber = req.body.poDateFormat;
          return poNumber;
        } else {
          return poNumber;
        }
      }).catch((err) => {
        console.trace();
        console.error(err);
        return poNumber;
      });
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },
  // Create Purchase Order
  // POST : /api/v1/purchaseOrder/createPurchaseOrder
  // @return New created po
  createPurchaseOrder: (req, res) => {
    const {
      PurchaseOrderMst,
      PurchaseOrderDet,
      GenericAuthenticationMst,
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      COMMON.setModelCreatedByFieldValue(req);
      return sequelize.transaction().then(t => module.exports.getPurchaseOrderNumberForAPIs(req, res, t).then((poNumber) => {
        if (poNumber) {
          req.body.poNumber = poNumber;
          return getSystemIdPromise(req, res, DATA_CONSTANT.PONUMBER_SYSID, t).then((response) => {
            if (response.status === STATE.SUCCESS) {
              req.body.serialNumber = response.systemId;
              return PurchaseOrderMst.create(req.body, {
                fields: inputFields,
                transaction: t
              }).then((purchaseorder) => {
                if (req.body.poDet.length === 0) {
                  return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, purchaseorder, MESSAGE_CONSTANT.CREATED(purchaseOrderModuleName)));
                } else {
                  const purchasePromise = [];
                  _.each(req.body.poDet, (purchasedata) => {
                    purchasedata.refPurchaseOrderID = purchaseorder.id;
                    COMMON.setModelCreatedObjectFieldValue(req.user, purchasedata);
                    purchasePromise.push(
                      PurchaseOrderDet.create(purchasedata, {
                        fields: purchaseDetInputFields,
                        transaction: t
                      }).then((purchaseDetail) => {
                        const purchaseShippPromise = [];
                        if (purchasedata.objApproval) {
                          purchasedata.objApproval.refID = purchaseDetail.id;
                          return GenericAuthenticationMst.create(purchasedata.objApproval, {
                            fields: approvalInputFields,
                            transaction: t
                          }).then(() => module.exports.createPurchaseOrderShippingDetailInUpdatePurchaseOrder(req, purchaseDetail, purchasedata, purchaseShippPromise, t).then((responsePromise) => {
                            if (_.find(responsePromise, sts => sts === STATE.FAILED)) { return STATE.FAILED; } else { return STATE.SUCCESS; }
                          })
                          ).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                          });
                        } else {
                          return module.exports.createPurchaseOrderShippingDetailInUpdatePurchaseOrder(req, purchaseDetail, purchasedata, purchaseShippPromise, t).then((responsePromise) => {
                            if (_.find(responsePromise, sts => sts === STATE.FAILED)) { return STATE.FAILED; } else { return STATE.SUCCESS; }
                          });
                        }
                      }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                      })
                    );
                  });
                  return Promise.all(purchasePromise).then((resp) => {
                    if (_.find(resp, sts => sts === STATE.FAILED)) {
                      if (!t.finished) {
                        t.rollback();
                      }
                      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
                        data: null
                      });
                    } else {
                      return t.commit().then(() => {
                        req.body.id = purchaseorder.id;
                        //  Add Purchase Order into Elastic Search Engine for Enterprise Search
                        req.params = {
                          id: purchaseorder.id
                        };
                        EnterpriseSearchController.managePurchaseOrderElastic(req);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.CREATED(purchaseOrderModuleName));
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
                    } else if (err.parent && err.parent.errno === COMMON.TRANSACTION_TIMEOUT_ERROR.ERROR) {
                      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, COMMON.TRANSACTION_TIMEOUT_ERROR.ERRORMESSAGE);
                    } else {
                      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                      });
                    }
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
                } else if (err.parent && err.parent.errno === COMMON.TRANSACTION_TIMEOUT_ERROR.ERROR) {
                  return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, COMMON.TRANSACTION_TIMEOUT_ERROR.ERRORMESSAGE);
                } else {
                  return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                  });
                }
              });
            } else {
              console.trace();
              if (!t.finished) {
                t.rollback();
              }
              return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: response.message,
                data: null
              });
            }
          });
        } else {
          if (!t.finished) {
            t.rollback();
          }
          if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
              messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
              err: err.errors.map(e => e.message).join(','),
              data: null
            });
          } else if (err.parent && err.parent.errno === COMMON.TRANSACTION_TIMEOUT_ERROR.ERROR) {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, COMMON.TRANSACTION_TIMEOUT_ERROR.ERRORMESSAGE);
          } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
              messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
              err: err,
              data: null
            });
          }
        }
      })).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
          messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
          err: null,
          data: null
        });
      })
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },
  // Update Purchase Order
  // PUT : /api/v1/purchaseOrder/updatePurchaseOrder
  // @param {id} int
  // @return Upadted Purchase Order details
  updatePurchaseOrder: (req, res) => {
    const {
      PurchaseOrderMst,
      PurchaseOrderDet,
      PurchaseOrderLineReleaseDet,
      PurchaseOrderLineOtherCharges,
      PurchaseOrderLineRequirementDet,
      GenericAuthenticationMst,
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      req.body.whereClause = {
        id: req.body.id,
        isDeleted: false
      };
      return module.exports.getPurchaseOrderMstDataByID(req, res, true).then((purchaseObj) => {
        if (purchaseObj && purchaseObj.length > 0) {
          purchaseObj = purchaseObj[0];
          if (purchaseObj.poWorkingStatus === DATA_CONSTANT.PurchaseOrderWorkingStatus.Canceled.id) {
            req.body = {
              id: req.body.id,
              CancellationConfirmed: req.body.CancellationConfirmed,
              cancleReason: req.body.cancleReason,
              shippingComment: req.body.shippingComment
            }
          } else {
            if (req.body.isPOrevision) {
              req.body.poRevision = parseInt(purchaseObj.poRevision || 0) + 1;
              if (req.body.poRevision < 10) {
                req.body.poRevision = COMMON.stringFormat('0{0}', req.body.poRevision);
              }
            }

            if (purchaseObj.supplierAddressID === req.body.supplierAddressID) {
              req.body.supplierAddress = purchaseObj.supplierAddress
              if (purchaseObj.supplierContactPersonID === req.body.supplierContactPersonID) {
                req.body.supplierContactPerson = purchaseObj.supplierContactPerson
              }
            }
            if (purchaseObj.shippingAddressID === req.body.shippingAddressID) {
              req.body.shippingAddress = purchaseObj.shippingAddress
              if (purchaseObj.shippingContactPersonID === req.body.shippingContactPersonID) {
                req.body.shippingContactPerson = purchaseObj.shippingContactPerson
              }
            }
            if (purchaseObj.intermediateShipmentID === req.body.intermediateShipmentID) {
              req.body.intermediateAddress = purchaseObj.intermediateAddress
              if (purchaseObj.intermediateContactPersonID === req.body.intermediateContactPersonID) {
                req.body.intermediateContactPerson = purchaseObj.intermediateContactPerson
              }
            }
            req.body = module.exports.checkDisabledFormValidation(req, res, purchaseObj, req.body);
          }

          COMMON.setModelUpdatedByFieldValue(req);
          return sequelize.transaction().then(t => PurchaseOrderMst.update(req.body, {
            where: {
              id: req.body.id
            },
            fields: updateInputFields,
            transaction: t
          }).then((rowsUpdated) => {
            if (rowsUpdated[0] === 1) {

              if (purchaseObj.poWorkingStatus === DATA_CONSTANT.PurchaseOrderWorkingStatus.Canceled.id) {
                return t.commit().then(() => {
                  //  Add Purchase Order into Elastic Search Engine for Enterprise Search
                  return sequelize.query('CALL Sproc_UpdatePoWorkingLineStatus(:pPOID)', {
                    replacements: {
                      pPOID: req.body.id
                    }
                  }).then(() => {
                    req.params = {
                      id: req.body.id
                    };
                    EnterpriseSearchController.managePurchaseOrderElastic(req);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(purchaseOrderModuleName));
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

                return PurchaseOrderDet.findAll({
                  where: {
                    refPurchaseOrderID: req.body.id,
                    isDeleted: false
                  },
                  attributes: ['id', 'qty'],
                  transaction: t
                }).then((purchasedetail) => {
                  let updatepurchaseorder = _.filter(req.body.poDet, item => item.id);
                  const createpurchaseorder = _.filter(req.body.poDet, item => !item.id);
                  const purchaseIds = _.map(updatepurchaseorder, 'id');
                  const PurchasedetailIds = _.map(purchasedetail, 'id');
                  const removePurchaseorder = _.difference(PurchasedetailIds, purchaseIds);
                  _.each(removePurchaseorder, (item) => {
                    updatepurchaseorder = _.reject(updatepurchaseorder, o => parseInt(o.id) === parseInt(item));
                  });
                  const purchasePromise = [];
                  let isParentRecordDeleted = false;

                  if (removePurchaseorder.length > 0) {
                    _.each(removePurchaseorder, (pDetID) => {
                      var obj = {};
                      COMMON.setModelDeletedByObjectFieldValue(req.user, obj);
                      purchasePromise.push(
                        PurchaseOrderDet.update(obj, {
                          where: {
                            refPurchaseOrderID: req.body.id,
                            id: pDetID
                          },
                          transaction: t
                        }).then(() => PurchaseOrderLineReleaseDet.update(obj, {
                          where: {
                            refPurchaseOrderDetID: pDetID
                          },
                          transaction: t
                        }).then(() => PurchaseOrderLineOtherCharges.update(obj, {
                          where: {
                            refPurchaseOrderDetID: pDetID
                          },
                          transaction: t
                        }).then(() => PurchaseOrderLineRequirementDet.update(obj, {
                          where: {
                            refPurchaseOrderDetID: pDetID
                          },
                          transaction: t
                        }).then(() => STATE.SUCCESS).catch((err) => {
                          console.trace();
                          console.error(err);
                          return STATE.FAILED;
                        })).catch((err) => {
                          console.trace();
                          console.error(err);
                          return STATE.FAILED;
                        })).catch((err) => {
                          console.trace();
                          console.error(err);
                          return STATE.FAILED;
                        })).catch((err) => {
                          console.trace();
                          console.error(err);
                          return STATE.FAILED;
                        })
                      );
                    });
                  }

                  if (createpurchaseorder.length > 0) {
                    COMMON.setModelCreatedByFieldValue(req);
                    _.each(createpurchaseorder, (purchase) => {
                      purchase.refPurchaseOrderID = req.body.id;
                      COMMON.setModelCreatedObjectFieldValue(req.user, purchase);
                      purchasePromise.push(
                        PurchaseOrderDet.create(purchase, {
                          fields: purchaseDetInputFields,
                          transaction: t
                        }).then((createpurchase) => {
                          const purchaseShippPromise = [];
                          if (purchase.objApproval) {
                            purchase.objApproval.refID = createpurchase.id;
                            return GenericAuthenticationMst.create(purchase.objApproval, {
                              fields: approvalInputFields,
                              transaction: t
                            }).then(() => module.exports.createPurchaseOrderShippingDetailInUpdatePurchaseOrder(req, createpurchase, purchase, purchaseShippPromise, t).then((responsePromise) => {
                              if (_.find(responsePromise, sts => sts === STATE.FAILED)) { return STATE.FAILED; } else { return STATE.SUCCESS; }
                            })
                            ).catch((err) => {
                              console.trace();
                              console.error(err);
                              return STATE.FAILED;
                            });
                          } else {
                            return module.exports.createPurchaseOrderShippingDetailInUpdatePurchaseOrder(req, createpurchase, purchase, purchaseShippPromise, t).then((responsePromise) => {
                              if (_.find(responsePromise, sts => sts === STATE.FAILED)) { return STATE.FAILED; } else { return STATE.SUCCESS; }
                            });
                          }
                        }).catch((err) => {
                          console.trace();
                          console.error(err);
                          return STATE.FAILED;
                        })
                      );
                    });
                  }

                  if (updatepurchaseorder.length > 0) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    _.each(updatepurchaseorder, (item) => {
                      if (PurchasedetailIds.includes(item.id)) {
                        item.refPurchaseOrderID = req.body.id;
                        COMMON.setModelUpdatedByObjectFieldValue(req.user, item);
                        purchasePromise.push(
                          PurchaseOrderDet.update(item, {
                            where: {
                              id: item.id,
                              isDeleted: false
                            },
                            fields: purchaseDetInputFields,
                            transaction: t
                          }).then(() => module.exports.updatePurchaseOrderShippingDetailInUpdatePurchaseOrder(req, item, t).then((responsePromise) => {
                            if (_.find(responsePromise, sts => sts === STATE.FAILED)) { return STATE.FAILED; } else { return STATE.SUCCESS; }
                          })
                          ).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                          })
                        );
                      } else {
                        isParentRecordDeleted = true;
                      }
                    });
                  }

                  if (isParentRecordDeleted) {
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                      messageContent: MESSAGE_CONSTANT.GLOBAL.PARENT_DATA_NOT_EXISTS,
                      err: null,
                      data: null
                    });
                  } else {
                    return Promise.all(purchasePromise).then((resp) => {
                      if (_.find(resp, sts => (sts === STATE.FAILED))) {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                          messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                          err: null,
                          data: null
                        });
                      } else {
                        return t.commit().then(() => {
                          //  Add Purchase Order into Elastic Search Engine for Enterprise Search
                          return sequelize.query('CALL Sproc_UpdatePoWorkingLineStatus(:pPOID)', {
                            replacements: {
                              pPOID: req.body.id
                            }
                          }).then(() => {
                            req.params = {
                              id: req.body.id
                            };
                            EnterpriseSearchController.managePurchaseOrderElastic(req);
                            if (removePurchaseorder.length > 0) {
                              EnterpriseSearchController.deletePurchaseOrderDetailInElastic(removePurchaseorder.toString());
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(purchaseOrderModuleName));
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
                      }
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
                  } else if (err.parent && err.parent.errno === COMMON.TRANSACTION_TIMEOUT_ERROR.ERROR) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, COMMON.TRANSACTION_TIMEOUT_ERROR.ERRORMESSAGE);
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
              if (!t.finished) { t.rollback(); }
              return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(purchaseOrderModuleName));
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
            } else if (err.parent && err.parent.errno === COMMON.TRANSACTION_TIMEOUT_ERROR.ERROR) {
              return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, COMMON.TRANSACTION_TIMEOUT_ERROR.ERRORMESSAGE);
            } else {
              return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
              });
            }
          }));
        } else {
          return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
            messageContent: MESSAGE_CONSTANT.GLOBAL.PARENT_DATA_NOT_EXISTS,
            err: null,
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
  // create Shipping detail and other expense details
  createPurchaseOrderShippingDetailInUpdatePurchaseOrder: (req, createpurchase, purchase, purchaseShippPromise, t) => {
    const {
      PurchaseOrderLineReleaseDet,
      PurchaseOrderLineOtherCharges,
      PurchaseOrderLineRequirementDet
    } = req.app.locals.models;
    // Add Purchase Order Detail into Elastic Search Engine for Enterprise Search
    // req.params = {
    //    id: req.params.id,
    //    purchaseOrderDetId: createpurchase.id
    // };
    // EnterpriseSearchController.manageSalesOrderDetailInElastic(req);
    // save po shipping detail
    _.each(purchase.PODetail, (shipping) => {
      shipping.refPurchaseOrderDetID = createpurchase.id;
      COMMON.setModelCreatedObjectFieldValue(req.user, shipping);
      purchaseShippPromise.push(PurchaseOrderLineReleaseDet.create(shipping, {
        fields: purchaseShippingInputFields,
        transaction: t
      }).then(() => STATE.SUCCESS).catch((err) => {
        console.trace();
        console.error(err);
        return STATE.FAILED;
      }));
    });
    // save po other detail
    _.each(purchase.POOtherDetail, (pOtherDet) => {
      pOtherDet.refPurchaseOrderDetID = createpurchase.id;
      COMMON.setModelCreatedObjectFieldValue(req.user, pOtherDet);
      purchaseShippPromise.push(PurchaseOrderLineOtherCharges.create(pOtherDet, {
        fields: purchaseOtherExpenseInputFields,
        transaction: t
      }).then(() => STATE.SUCCESS).catch((err) => {
        console.trace();
        console.error(err);
        return STATE.FAILED;
      }));
    });
    // save po requirement detail
    _.each(purchase.PORequirementDetail, (pRequirement) => {
      const objRequirement = {};
      objRequirement.refPurchaseOrderDetID = createpurchase.id;
      objRequirement.instruction = pRequirement.instruction;
      COMMON.setModelCreatedObjectFieldValue(req.user, objRequirement);
      purchaseShippPromise.push(PurchaseOrderLineRequirementDet.create(objRequirement, {
        fields: purchaseRequirementInputFields,
        transaction: t
      }).then(() => STATE.SUCCESS).catch((err) => {
        console.trace();
        console.error(err);
        return STATE.FAILED;
      }));
    });

    return Promise.all(purchaseShippPromise).then(resp => resp);
  },
  // update Shipping detail and other expense details
  updatePurchaseOrderShippingDetailInUpdatePurchaseOrder: (req, item, t) => {
    const {
      PurchaseOrderLineReleaseDet,
      PurchaseOrderLineOtherCharges,
      PurchaseOrderLineRequirementDet
    } = req.app.locals.models;
    return PurchaseOrderLineReleaseDet.findAll({
      where: {
        refPurchaseOrderDetID: item.id,
        isDeleted: false
      },
      attributes: ['id', 'shippingAddress', 'shippingAddressID', 'shippingContactPerson', 'shippingContactPersonID'],
      transaction: t
    }).then(shippinglist => PurchaseOrderLineOtherCharges.findAll({
      where: {
        refPurchaseOrderDetID: item.id,
        isDeleted: false
      },
      attributes: ['id'],
      transaction: t
    }).then(otherDetList => PurchaseOrderLineRequirementDet.findAll({
      where: {
        refPurchaseOrderDetID: item.id,
        isDeleted: false
      },
      attributes: ['id'],
      transaction: t
    }).then((requirementlist) => {
        let updateshipping = _.filter(item.PODetail, itemUpdate => itemUpdate.id);
        const createshipping = _.filter(item.PODetail, itemCreate => !itemCreate.id);
        const shippingIds = _.map(updateshipping, 'id');
        const shippingdetIds = _.map(shippinglist, 'id');
        const removeshipping = _.difference(shippingdetIds, shippingIds);
        _.each(removeshipping, (itemRemove) => {
          updateshipping = _.reject(updateshipping, o => parseInt(o.id) === parseInt(itemRemove));
        });
        const shippingPromise = [];
        if (removeshipping.length > 0) {
          const obj = {};
          COMMON.setModelDeletedByObjectFieldValue(req.user, obj)
          shippingPromise.push(PurchaseOrderLineReleaseDet.update(obj, {
            where: {
              id: {
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
          _.each(createshipping, (purchase) => {
            purchase.refPurchaseOrderDetID = item.id;
            COMMON.setModelCreatedObjectFieldValue(req.user, purchase);
            shippingPromise.push(PurchaseOrderLineReleaseDet.create(purchase, {
              fields: purchaseShippingInputFields,
              transaction: t
            }).then(() => STATE.SUCCESS).catch((err) => {
              console.trace();
              console.error(err);
              return STATE.FAILED;
            }));
          });
        }
        if (updateshipping.length > 0) {
          _.each(updateshipping, (shipping) => {
            COMMON.setModelUpdatedByObjectFieldValue(req.user, shipping)
            const releaseLineObj = _.find(shippinglist, (item) => item.id === shipping.id);
            if (releaseLineObj.shippingAddressID === shipping.shippingAddressID) {
              shipping.shippingAddress = releaseLineObj.shippingAddress
              if (releaseLineObj.shippingContactPersonID === shipping.shippingContactPersonID) {
                shipping.shippingContactPerson = releaseLineObj.shippingContactPerson
              }
            }
            shippingPromise.push(PurchaseOrderLineReleaseDet.update(shipping, {
              where: {
                id: shipping.id
              },
              fields: purchaseShippingInputFieldsExcludeStatus,
              transaction: t
            }).then(() => STATE.SUCCESS).catch((err) => {
              console.trace();
              console.error(err);
              return STATE.FAILED;
            }));
          });
        }
        // purchase order other expense block
        let updateexpense = _.filter(item.POOtherDetail, itemUpdate => itemUpdate.id);
        const createexpense = _.filter(item.POOtherDetail, itemCreate => !itemCreate.id);
        const expenseIds = _.map(updateexpense, 'id');
        const expensedetIds = _.map(otherDetList, 'id');
        const removeexpense = _.difference(expensedetIds, expenseIds);
        _.each(removeexpense, (itemRemove) => {
          updateexpense = _.reject(updateexpense, o => parseInt(o.id) === parseInt(itemRemove));
        });
        if (removeexpense.length > 0) {
          const obj = {};
          COMMON.setModelDeletedByObjectFieldValue(req.user, obj)
          shippingPromise.push(PurchaseOrderLineOtherCharges.update(obj, {
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
          _.each(createexpense, (pOtherDet) => {
            pOtherDet.refPurchaseOrderDetID = item.id;
            COMMON.setModelCreatedObjectFieldValue(req.user, pOtherDet);
            shippingPromise.push(PurchaseOrderLineOtherCharges.create(pOtherDet, {
              fields: purchaseOtherExpenseInputFields,
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
          _.each(updateexpense, (pOtherDet) => {
            COMMON.setModelUpdatedByObjectFieldValue(req.user, obj)
            shippingPromise.push(PurchaseOrderLineOtherCharges.update(pOtherDet, {
              where: {
                id: pOtherDet.id
              },
              fields: purchaseOtherExpenseInputFields,
              transaction: t
            }).then(() => STATE.SUCCESS).catch((err) => {
              console.trace();
              console.error(err);
              return STATE.FAILED;
            }));
          });
        }
        // purchase order requirements
        let updaterequirement = _.filter(item.PORequirementDetail, itemUpdate => itemUpdate.id);
        const createrequirement = _.filter(item.PORequirementDetail, itemCreate => !itemCreate.id);
        const requirementIds = _.map(updaterequirement, 'id');
        const requirementdetIds = _.map(requirementlist, 'id');
        const removerequirement = _.difference(requirementdetIds, requirementIds);
        _.each(removerequirement, (itemRemove) => {
          updaterequirement = _.reject(updaterequirement, o => parseInt(o.id) === parseInt(itemRemove));
        });
        if (removerequirement.length > 0) {
          const obj = {};
          COMMON.setModelDeletedByObjectFieldValue(req.user, obj)
          shippingPromise.push(PurchaseOrderLineRequirementDet.update(obj, {
            where: {
              id: {
                [Op.in]: removerequirement
              }
            },
            transaction: t
          }).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
          }));
        }
        if (createrequirement.length > 0) {
          COMMON.setModelCreatedByFieldValue(req);
          _.each(createrequirement, (pRequirementDet) => {
            pRequirementDet.refPurchaseOrderDetID = item.id;
            COMMON.setModelCreatedObjectFieldValue(req.user, pRequirementDet);
            shippingPromise.push(PurchaseOrderLineRequirementDet.create(pRequirementDet, {
              fields: purchaseRequirementInputFields,
              transaction: t
            }).then(() => STATE.SUCCESS).catch((err) => {
              console.trace();
              console.error(err);
              return STATE.FAILED;
            }));
          });
        }
        if (updaterequirement.length > 0) {
          _.each(updaterequirement, (pRequirementDet) => {
            COMMON.setModelUpdatedByObjectFieldValue(req.user, pRequirementDet)
            shippingPromise.push(PurchaseOrderLineRequirementDet.update(pRequirementDet, {
              where: {
                id: pRequirementDet.id
              },
              fields: purchaseRequirementInputFields,
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
    })
    ).catch((err) => {
      console.trace();
      console.error(err);
      return STATE.FAILED;
    })).catch((err) => {
      console.trace();
      console.error(err);
      return STATE.FAILED;
    });
  },

  // Get List of Purchase Order Material Purchase Part Requirement Detail
  // POST : /api/v1/purchaseOrder/getPurchaseOrderMaterialPurchasePartRequirementDetail
  // @return retrive list of Purchase Part Requirement Detail
  getPurchaseOrderMaterialPurchasePartRequirementDetail: (req, res) => {
    const {
      sequelize
    } = req.app.locals.models;

    if (req.body) {
      const filter = COMMON.UiGridFilterSearch(req);
      const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

      return sequelize.query('CALL Sproc_RetrivePurchaseOrderMaterialPurchasePartRequirementList (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPurchaseOrderDetID)', {
        replacements: {
          pPageIndex: req.body.page,
          pRecordPerPage: req.body.isExport ? null : filter.limit,
          pOrderBy: filter.strOrderBy || null,
          pWhereClause: strWhere,
          pPurchaseOrderDetID: req.body.purchaseOrderDetID || null
        },
        type: sequelize.QueryTypes.SELECT
      }).then(response => resHandler.successRes(
        res,
        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
        STATE.SUCCESS, {
        PurchaseOrderMaterialPurchasePartRequirementList: _.values(response[1]),
        Count: response[0][0].TotalRecord
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

  // GET Purchase order summary detail
  // POST : /api/v1/purchaseOrder/getPurchaseOrderSummaryDetail
  // @return purchase order summary detail
  getPurchaseOrderSummaryDetail: (req, res) => {
    const {
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      const filter = COMMON.UiGridFilterSearch(req);
      let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
      if (strWhere === '') { strWhere = null; }

      return sequelize
        .query('CALL Sproc_RetrievePurchaseOrderSummaryDeatils (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:psupplierID,:pshippingMethodId,:psearchposotype,:psearchposotext,:ppartIds,:ppostatus,:pfromDate,:ptoDate,:pLockFilterStatus,:pPoPostingStatusFilter,:pPOComments)', {
          replacements: {
            ppageIndex: req.body.page,
            precordPerPage: req.body.isExport ? null : filter.limit,
            pOrderBy: filter.strOrderBy || null,
            pWhereClause: strWhere,
            psupplierID: req.body.supplierID || null,
            pshippingMethodId: req.body.shippingMethodId || null,
            psearchposotype: req.body.posoSearchType || null,
            psearchposotext: req.body.posoSearch || null,
            ppartIds: req.body.partIds || null,
            ppostatus: req.body.filterStatus || null,
            pfromDate: req.body.pfromDate || null,
            ptoDate: req.body.ptoDate || null,
            pLockFilterStatus: req.body.lockFilterStatus || null,
            pPoPostingStatusFilter: req.body.poPostingStatusFilter || null,
            pPOComments: req.body.poComments || null
          },
          type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
          purchaseOrder: _.values(response[1]),
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
  // Remove Purchase Order from Summary tab
  // POST : /api/v1/purchaseOrder/removePurchaseOrder
  // @return list of removed purchase order
  removePurchaseOrder: (req, res) => {
    const { sequelize } = req.app.locals.models;
    if (req.body && req.body.objIDs.id) {
      return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
        replacements: {
          tableName: COMMON.AllEntityIDS.PURCHASE_ORDER_MST.Name,
          IDs: req.body.objIDs.id.toString(),
          deletedBy: COMMON.getRequestUserID(req),
          entityID: null,
          refrenceIDs: null,
          countList: req.body.objIDs.CountList,
          pRoleID: COMMON.getRequestUserLoginRoleID(req)
        }
      }).then((response) => {
        if (response.length === 0) {
          // Delete Purchase Order Detail into Elastic Search Engine for Enterprise Search
          EnterpriseSearchController.deletePurchaseOrderMasterElastic(req, res, req.body.objIDs.id.toString());
          return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(purchaseOrderModuleName));
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
  // GET Purchase order per line detail
  // POST : /api/v1/purchaseOrder/getPurchaseOrderPerLineDetail
  // @return purchase order Per line detail
  getPurchaseOrderPerLineDetail: (req, res) => {
    const {
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      const filter = COMMON.UiGridFilterSearch(req);
      let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
      if (strWhere === '') { strWhere = null; }

      return sequelize
        .query('CALL Sproc_RetrievePurchaseOrderPerLineDetails (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:psupplierID,:pshippingMethodId,:psearchposotype,:psearchposotext,:ppartIds,:ppolinestatus,:ppostatus,:pfromDate,:ptoDate,:ponlyOtherPart,:pwithoutOtherPart,:pisonlyPendingLines,:pPOComments)', {
          replacements: {
            ppageIndex: req.body.page,
            precordPerPage: req.body.isExport ? null : filter.limit,
            pOrderBy: filter.strOrderBy || null,
            pWhereClause: strWhere,
            psupplierID: req.body.supplierID || null,
            pshippingMethodId: req.body.shippingMethodId || null,
            psearchposotype: req.body.posoSearchType || null,
            psearchposotext: req.body.posoSearch || null,
            ppartIds: req.body.partIds || null,
            ppolinestatus: req.body.filterStatus || null,
            ppostatus: req.body.poStatusFilter || null,
            pfromDate: req.body.pfromDate || null,
            ptoDate: req.body.ptoDate || null,
            ponlyOtherPart: req.body.onlyOtherPart || null,
            pwithoutOtherPart: req.body.withoutOtherPart || null,
            pisonlyPendingLines: req.body.isonlyPendingLines || null,
            pPOComments: req.body.poComments || null
          },
          type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
          purchaseOrder: _.values(response[1]),
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
  // GET Purchase order component detail list
  // POST : /api/v1/purchaseOrder/getComponentFilterList
  // @return purchase order component list
  getComponentFilterList: (req, res) => {
    const { sequelize } = req.app.locals.models;
    if (req.body) {
      return sequelize.query('CALL Sproc_GetFilterComponentlist (:searchString,:pIsSalesOrder,:pID)', {
        replacements: {
          searchString: req.body.searchString || null,
          pIsSalesOrder: req.body.isFromSalesOrder || false,
          pID: req.body.partID || null
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

  // GET work Order detail list
  // POST : /api/v1/purchaseOrder/getWorkOrderFilterList
  // @return purchase order component list
  getWorkOrderFilterList: (req, res) => {
    const { sequelize } = req.app.locals.models;
    if (req.body) {
      return sequelize.query('CALL Sproc_GetFilterWorkOrderlist (:psearchString,:pcustomerID)', {
        replacements: {
          psearchString: req.body.searchString || null,
          pcustomerID: req.body.customerID || null
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

  // get change history purchase order
  // POST :/api/v1/purchaseOrder/purchaseorderchangehistory
  // @return change history  purchase order data
  purchaseorderchangehistory: (req, res) => {
    if (req.body && req.body.purchaseOrderID) {
      const { sequelize } = req.app.locals.models;
      const filter = COMMON.UiGridFilterSearch(req);
      const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

      return sequelize
        .query('CALL Sproc_PurchaseOrderChangeHistory (:ppurchaseOrderID,:ppurchaseOrderDetId,:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
          replacements: {
            ppurchaseOrderID: req.body.purchaseOrderID,
            ppurchaseOrderDetId: req.body.purchaseOrderDetId || null,
            ppageIndex: req.body.Page,
            precordPerPage: req.body.isExport ? null : filter.limit,
            pOrderBy: filter.strOrderBy || null,
            pWhereClause: strWhere
          },
          type: sequelize.QueryTypes.SELECT
        })
        .then(purchaseOrderLog => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
          purchaseOrderLog: _.values(purchaseOrderLog[1]),
          Count: purchaseOrderLog[0][0]['TotalRecord']
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
  // Update Purchase Order Status
  // PUT : /api/v1/purchaseOrder/updatePurchaseOrderStatus
  // @param {id} int
  // @return Upadted Purchase Order status details
  updatePurchaseOrderStatus: (req, res) => {
    const {
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      return sequelize.transaction().then(t => sequelize.query('CALL Sproc_updatePurchaseOrderStatus (:pPOID,:pupdatedBy,:pupdatedRoleID,:pcompleteReason,:pcompleteType,:pcancellationReason,:ptype,:pCancellationConfirmed)', {
        replacements: {
          pPOID: req.body.id,
          pupdatedBy: req.user.id,
          pupdatedRoleID: COMMON.getRequestUserLoginRoleID(req),
          pcompleteReason: req.body.poCompleteReason || null,
          pcompleteType: req.body.poCompleteType,
          pcancellationReason: req.body.cancleReason || null,
          ptype: req.body.type,
          pCancellationConfirmed: req.body.CancellationConfirmed || req.body.CancellationConfirmed === false ? req.body.CancellationConfirmed : null
        },
        transaction: t
      }).then(() => t.commit().then(() => {
        req.params = {
          id: req.body.id
        };
        EnterpriseSearchController.managePurchaseOrderElastic(req);
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(purchaseOrderModuleName));
      })
      ).catch((err) => {
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
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },
  // POST purchase order release line detail
  // GET : /api/v1/purchaseOrder/savePurchaseOrderLineDetail
  // @param {id} int
  // @return detail of purchase order release line
  savePurchaseOrderLineDetail: (req, res) => {
    const {
      PurchaseOrderDet,
      PurchaseOrderLineReleaseDet,
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      return sequelize.transaction().then(t => PurchaseOrderLineReleaseDet.findAll({
        where: {
          refPurchaseOrderDetID: req.body.id,
          isDeleted: false
        },
        attributes: ['id', 'shippingAddress', 'shippingAddressID', 'shippingContactPerson', 'shippingContactPersonID'],
        transaction: t
      }).then((shippinglist) => {
        let updateshipping = _.filter(req.body.PODetail, itemUpdate => itemUpdate.id);
        const createshipping = _.filter(req.body.PODetail, itemCreate => !itemCreate.id);
        const shippingIds = _.map(updateshipping, 'id');
        const shippingdetIds = _.map(shippinglist, 'id');
        const removeshipping = _.difference(shippingdetIds, shippingIds);
        _.each(removeshipping, (itemRemove) => {
          updateshipping = _.reject(updateshipping, o => parseInt(o.id) === parseInt(itemRemove));
        });
        const shippingPromise = [];
        if (removeshipping.length > 0) {
          const obj = {};
          COMMON.setModelDeletedByObjectFieldValue(req.user, obj);
          shippingPromise.push(PurchaseOrderLineReleaseDet.update(obj, {
            where: {
              id: {
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
          _.each(createshipping, (purchase) => {
            if (purchase.qty && purchase.shippingDate) {
              COMMON.setModelCreatedObjectFieldValue(req.user, shipping);
              shippingPromise.push(PurchaseOrderLineReleaseDet.create(purchase, {
                fields: purchaseShippingInputFields,
                transaction: t
              }).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
              }));
            }
          });
        }
        if (updateshipping.length > 0) {
          _.each(updateshipping, (shipping) => {
            COMMON.setModelUpdatedByObjectFieldValue(req.user, shipping);
            const releaseLineObj = _.find(shippinglist, (item) => item.id === shipping.id);
            if (releaseLineObj.shippingAddressID === shipping.shippingAddressID) {
              shipping.shippingAddress = releaseLineObj.shippingAddress
              if (releaseLineObj.shippingContactPersonID === shipping.shippingContactPersonID) {
                shipping.shippingContactPerson = releaseLineObj.shippingContactPerson
              }
            }
            shippingPromise.push(PurchaseOrderLineReleaseDet.update(shipping, {
              where: {
                id: shipping.id
              },
              fields: purchaseShippingInputFieldsExcludeStatus,
              transaction: t
            }).then(() => STATE.SUCCESS).catch((err) => {
              console.trace();
              console.error(err);
              return STATE.FAILED;
            }));
          });
        }
        const updateLineDet = {
          totalRelease: createshipping.length + updateshipping.length
        };
        COMMON.setModelUpdatedByObjectFieldValue(req.user, updateLineDet);
        req.body.totalRelease = updateLineDet.totalRelease;
        shippingPromise.push(PurchaseOrderDet.update(updateLineDet, {
          where: {
            id: req.body.id
          },
          fields: ['totalRelease', 'updatedBy', 'updateByRoleId'],
          transaction: t
        }).then(() => STATE.SUCCESS).catch((err) => {
          console.trace();
          console.error(err);
          return STATE.FAILED;
        }));
        return Promise.all(shippingPromise).then((resp) => {
          if (_.find(resp, sts => (sts === STATE.FAILED))) {
            if (!t.finished) { t.rollback(); }
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
              messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
              err: null,
              data: null
            });
          } else {
            return t.commit().then(() => {
              return sequelize.query('CALL Sproc_UpdatePoWorkingLineStatus(:pPOID)', {
                replacements: {
                  pPOID: req.body.refPOID
                }
              }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(purchaseOrderModuleName))
              ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                  messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                  err: err,
                  data: null
                });
              });
            });
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
  // POST copy purchase Order detail
  // POST : /api/v1/purchaseOrder/copyPurchaseOrderDetail
  // @param {id} int
  // @return detail of purchase order release line
  copyPurchaseOrderDetail: (req, res) => {
    const {
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      return sequelize.transaction().then(t => module.exports.getPurchaseOrderNumberForAPIs(req, res, t).then((poNumber) => {
        if (poNumber) {
          req.body.createdBy = req.user.id;
          return getSystemIdPromise(req, res, DATA_CONSTANT.PONUMBER_SYSID, t).then((response) => {
            if (response.systemId) {
              return sequelize
                .query('CALL Sproc_SaveDuplicatePurchaseOrder (:pPOID,:pPONumber,:pPODate,:puserID,:puserRoleID,:pSerialNumber,:pisKeepPO)', {
                  replacements: {
                    pPOID: req.body.id,
                    pPONumber: poNumber,
                    pPODate: req.body.poDate,
                    puserID: req.user.id,
                    puserRoleID: COMMON.getRequestUserLoginRoleID(req),
                    pSerialNumber: response.systemId,
                    pisKeepPO: req.body.pisKeepPO || false
                  },
                  transaction: t
                }).then(purchaseOrder => t.commit().then(() => {
                  req.body.id = purchaseOrder[0].vNewPOID;
                  //  Add Purchase Order into Elastic Search Engine for Enterprise Search
                  req.params = {
                    id: purchaseOrder[0].vNewPOID
                  };
                  EnterpriseSearchController.managePurchaseOrderElastic(req);
                  return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.CREATED(purchaseOrderModuleName));
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
  // GET purchase requirement list
  // GET : /api/v1/purchaseOrder/getDuplicatePurchaseOrderPartRequirementList
  // @param {id} int
  // @return detail purchase requirement list
  getDuplicatePurchaseOrderPartRequirementList: (req, res) => {
    const {
      sequelize
    } = req.app.locals.models;
    if (req.params.id) {
      return sequelize
        .query('CALL Sproc_GetDuplicatePurchaseOrderPartRequirementList (:pPOID)', {
          replacements: {
            pPOID: req.params.id
          },
          type: sequelize.QueryTypes.SELECT
        }).then(purchaseOrder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
          partRequirements: _.values(purchaseOrder[0]),
          partDescription: _.values(purchaseOrder[1])
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

  // Manually Complete Purchase Order Line or Release Line
  // PUT : /api/v1/purchaseOrder/updatePurchaseOrderLineLevelStatus
  // @param {id} int
  // @return Upadted Purchase Order Line Level Status
  updatePurchaseOrderLineLevelStatus: (req, res) => {
    const {
      PurchaseOrderLineReleaseDet,
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      COMMON.setModelUpdatedByFieldValue(req);
      const whereClause = {
        poLineWorkingStatus: { [Op.ne]: req.body.poLineWorkingStatus }
      };
      if (req.body.id) {
        whereClause.id = req.body.id;
      }
      if (req.body.refPurchaseOrderDetID) {
        whereClause.refPurchaseOrderDetID = req.body.refPurchaseOrderDetID;
      }
      return sequelize.transaction().then(t => PurchaseOrderLineReleaseDet.update(req.body, {
        where: whereClause,
        fields: ['poLineWorkingStatus', 'updatedBy', 'updatedAt', 'updateByRoleId', 'poLineCompleteReason', 'poLineCompleteType'],
        transaction: t
      }).then(() => t.commit().then(() => {
        return sequelize.query('CALL Sproc_UpdatePoWorkingLineStatus(:pPOID)', {
          replacements: {
            pPOID: req.body.refPOID
          }
        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(purchaseOrderModuleName))
        ).catch((err) => {
          console.trace();
          console.error(err);
          return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
            err: err,
            data: null
          });
        });
      })
      ).catch((err) => {
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
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },

  // GET purchase order release line detail
  // GET : /api/v1/purchaseOrder/getPurchaseOrderLineDetailByID
  // @param {id} int
  // @return detail of purchase order release line
  getPurchaseOrderLineDetailByID: (req, res) => {
    const {
      PurchaseOrderLineReleaseDet
    } = req.app.locals.models;
    if (req.params.id) {
      return PurchaseOrderLineReleaseDet.findAll({
        where: {
          refPurchaseOrderDetID: req.params.id,
          isDeleted: false
        },
        model: PurchaseOrderLineReleaseDet,
        attributes: purchaseShippingInputFields
      }).then((purchaseOrder) => {
        if (!purchaseOrder) {
          return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
            messageContent: MESSAGE_CONSTANT.NOT_FOUND(purchaseOrderModuleName),
            err: null,
            data: null
          });
        }
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, purchaseOrder, null);
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

  // Update Purchase Order Release Line Level Merge Detail
  // PUT : /api/v1/purchaseOrder/updatePurchaseOrderReleaseLineLevelMergeDetail
  // @param {id} int
  // @return Upadted Purchase Order Release Line Level Merge Detail
  updatePurchaseOrderReleaseLineLevelMergeDetail: (req, res) => {
    const {
      PurchaseOrderLineReleaseDet,
      PurchaseOrderDet,
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      const promisedDetails = [];
      return sequelize.transaction().then((t) => {
        _.each(req.body.list, (objReleaseLine) => {
          COMMON.setModelUpdatedByObjectFieldValue(req.user, objReleaseLine);
          if (!objReleaseLine.ismerged) {
            COMMON.setModelDeletedByObjectFieldValue(req.user, objReleaseLine);
          }
          promisedDetails.push(
            PurchaseOrderLineReleaseDet.update(objReleaseLine, {
              where: {
                id: objReleaseLine.id
              },
              fields: objReleaseLine.ismerged ? ['qty', 'updatedBy', 'updateByRoleId'] : ['qty', 'updatedBy', 'updateByRoleId', 'deletedBy', 'deleteByRoleId', 'deletedAt', 'isDeleted'],
              transaction: t
            }).then(() => STATE.SUCCESS).catch((err) => {
              console.trace();
              console.error(err);
              return STATE.FAILED;
            })
          );
        });
        promisedDetails.push(
          PurchaseOrderDet.findOne({
            where: {
              id: req.body.list[0].purchaseDetID,
              isDeleted: false
            },
            attributes: ['totalRelease', 'id'],
            transaction: t
          }).then((purchaseDet) => {
            if (purchaseDet) {
              const objPurchaseDet = {
                totalRelease: purchaseDet.totalRelease - (req.body.list.length - 1)
              };
              COMMON.setModelUpdatedByObjectFieldValue(req.user, objPurchaseDet)
              return PurchaseOrderDet.update(objPurchaseDet, {
                where: {
                  id: purchaseDet.id
                },
                fields: ['totalRelease', 'updatedBy', 'updateByRoleId'],
                transaction: t
              }).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
              });
            } else { return STATE.FAILED; }
          }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
          })
        );
        return Promise.all(promisedDetails).then((resp) => {
          if (_.find(resp, sts => (sts === STATE.FAILED))) {
            if (!t.finished) { t.rollback(); }
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
              messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
              err: null,
              data: null
            });
          } else {
            return t.commit().then(() => {
              return sequelize.query('CALL Sproc_UpdatePoWorkingLineStatus(:pPOID)', {
                replacements: {
                  pPOID: req.body.refPOID
                }
              }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(purchaseOrderModuleName))
              ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                  messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                  err: err,
                  data: null
                });
              });
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
  getPurchaseOrderRequirement: (req, res) => {
    const {
      PurchaseOrderLineRequirementDet
    } = req.app.locals.models;
    if (req.params.id) {
      return PurchaseOrderLineRequirementDet.findAll({
        where: {
          isDeleted: false,
          refPurchaseOrderDetID: req.params.id
        },
        model: PurchaseOrderLineRequirementDet,
        attributes: purchaseRequirementInputFields
      }).then(purchaseOrder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, purchaseOrder, null)).catch((err) => {
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

  // Check Unique SO# with Supplier
  // POST : /api/v1/purchaseOrder/checkUniqueSOWithSupplier
  // @return SO Exists Or Not
  checkUniqueSOWithSupplier: (req, res) => {
    if (req.body) {
      req.body.whereClause = {
        soNumber: req.body.soNumber,
        isDeleted: false
      };
      if (req.body.supplierID) {
        req.body.whereClause.supplierID = req.body.supplierID;
      }
      if (req.body.id) {
        req.body.whereClause.id = {
          [Op.ne]: req.body.id
        };
      }
      req.body.attributeClause = ['id', 'poNumber'];
      module.exports.getPurchaseOrderMstDataByID(req, res);
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },

  // Get purchase order Master detail by id
  // Post :/api/v1/getPurchaseOrderMstDetail
  // @
  getPurchaseOrderMstDetailByID: (req, res) => {
    if (req.params.id) {
      req.body.whereClause = {
        id: req.params.id,
        isDeleted: false
      };
      req.body.attributeClause = ['poWorkingStatus'];
      module.exports.getPurchaseOrderMstDataByID(req, res);
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },

  checkPartStatusOfPurchaseOrder: (req, res) => {
    const {
      PurchaseOrderDet,
      Component
    } = req.app.locals.models;

    if (req.query && req.query.id) {
      return PurchaseOrderDet.findOne({
        where: {
          refPurchaseOrderID: req.query.id,
          isDeleted: false
        },
        attributes: ['id', 'refPurchaseOrderID', 'mfgPartID'],
        include: [{
          model: Component,
          as: 'mfgParts',
          where: {
            partStatus: DATA_CONSTANT.PartStatusList.InternalInactive,
            isDeleted: false
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

  // Check po having any closed line
  // Post :/api/v1/checkPOLineIsClosed
  // @return all closed po lines
  checkPOLineIsClosed: (req, res) => {
    const {
      PurchaseOrderDet,
      PurchaseOrderLineReleaseDet
    } = req.app.locals.models;

    if (req.body) {
      const whereClause = {};
      if (req.body.id) {
        whereClause.id = req.body.id;
      } else {
        whereClause.refPurchaseOrderID = req.body.refPurchaseOrderID;
      }
      return PurchaseOrderDet.findOne({
        where: whereClause,
        attributes: ['id'],
        include: [{
          model: PurchaseOrderLineReleaseDet,
          as: 'purchaseOrderLineReleaseDet',
          where: {
            poLineWorkingStatus: DATA_CONSTANT.PurchaseOrderLineWorkingStatus.Closed.id
          },
          attributes: ['id', 'poLineWorkingStatus']
        }]
      }).then(closedPoLines => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, closedPoLines, null))
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

  // Retrive Packing slips by PO line Det Id
  // Post :/api/v1/getAllPackingSlipByPODetID
  // @return packingslip details by po detail id
  getAllPackingSlipByPODetID: (req, res) => {
    const {
      sequelize
    } = req.app.locals.models;
    if (req.body) {
      const filter = COMMON.UiGridFilterSearch(req);
      const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

      return sequelize.query('CALL Sproc_RetrivePackingSlipListByPODetId (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pRefPODetID,:pRefReleaseLineID,:pPONumber,:pPartID,:pRefPOLineID)', {
        replacements: {
          pPageIndex: req.body.Page,
          pRecordPerPage: req.body.isExport ? null : filter.limit,
          pOrderBy: filter.strOrderBy || null,
          pWhereClause: strWhere,
          pRefPODetID: req.body.refPODetID,
          pRefReleaseLineID: req.body.refReleaseLineID || null,
          pPONumber: req.body.poNumber || null,
          pPartID: req.body.partID || null,
          pRefPOLineID: req.body.refPOLineID || null
        },
        type: sequelize.QueryTypes.SELECT
      }).then(packingSlips => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
        packingSlips: _.values(packingSlips[1]),
        Count: packingSlips[0][0].TotalRecord
      }, null))
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

  // create dynamic select query and return result as per configure by developer
  getPurchaseOrderMstDataByID: (req, res, returnObject) => {
    const {
      PurchaseOrderMst
    } = req.app.locals.models;
    return PurchaseOrderMst.findAll({
      where: req.body.whereClause || { isDeleted: false, id: req.body.id },
      attributes: req.body.attributeClause || inputFields
    }).then((response) => {
      if (returnObject) {
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
  },

  // Purchase Order Lock or Unlock functionality
  // Post :/api/v1/lockUnlockTransaction
  lockUnlockTransaction: (req, res) => {
    const {
      PurchaseOrderMst
    } = req.app.locals.models;
    if (req.body && req.body.ids) {
      req.body.whereClause = {
        id: {
          [Op.in]: req.body.ids
        },
        lockStatus: req.body.isLockRecord ? DATA_CONSTANT.PurchaseOrderLockStatus.Locked.id : DATA_CONSTANT.PurchaseOrderLockStatus.ReadyToLock.id,
        status: DATA_CONSTANT.PurchaseOrderStatus.Publish.id,
        poWorkingStatus: {
          [Op.ne]: DATA_CONSTANT.PurchaseOrderWorkingStatus.InProgress.id
        }
      };
      req.body.attributeClause = ['id'];
      return module.exports.getPurchaseOrderMstDataByID(req, res, true).then((response) => {
        if (response.length !== req.body.ids.length) {
          return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
            messageContent: req.body.isLockRecord ? MESSAGE_CONSTANT.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_UNLOCKED : MESSAGE_CONSTANT.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED,
            err: null,
            data: null
          });
        }
        const objLockRecord = {
          updatedAt: COMMON.getCurrentUTC(),
          updatedBy: COMMON.getRequestUserID(req),
          updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
        };
        if (req.body.isLockRecord) {
          objLockRecord.lockStatus = DATA_CONSTANT.PurchaseOrderLockStatus.ReadyToLock.id;
          objLockRecord.lockedBy = null;
          objLockRecord.lockedByRoleId = null;
          objLockRecord.lockedAt = null;
        } else {
          objLockRecord.lockStatus = DATA_CONSTANT.PurchaseOrderLockStatus.Locked.id;
          objLockRecord.lockedBy = COMMON.getRequestUserID(req);
          objLockRecord.lockedByRoleId = COMMON.getRequestUserLoginRoleID(req);
          objLockRecord.lockedAt = COMMON.getCurrentUTC();
        }
        return PurchaseOrderMst.update(objLockRecord, {
          where: {
            id: {
              [Op.in]: req.body.ids
            }
          }
        }).then((resp) => {
          _.each(req.body.ids, (id) => {
            req.params['id'] = id;
            EnterpriseSearchController.managePurchaseOrderElastic(req);
          });

          const messageContent = Object.assign({}, req.body.isLockRecord ? MESSAGE_CONSTANT.GLOBAL.UNLOCKED_SUCCESSFULLY : MESSAGE_CONSTANT.GLOBAL.LOCKED_SUCCESSFULLY);
          messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.PURCHASE_ORDER.Name);
          return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, messageContent);
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

  // Check purchase order status for deletion operation
  // Post :/api/v1/checkPOWorkingStatus
  // @return published purchase order
  checkPOWorkingStatus: (req, res) => {
    if (req.body && req.body.ids) {
      req.body.whereClause = {
        id: {
          [Op.in]: req.body.ids
        },
        status: DATA_CONSTANT.PurchaseOrderStatus.Publish.id
      };
      req.body.attributeClause = ['id'];
      module.exports.getPurchaseOrderMstDataByID(req, res);
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },

  // Check purchase order having any lines
  // Post :/api/v1/checkPOConsistLine
  // @return published purchase order
  checkPOConsistLine: (req, res) => {
    const {
      PurchaseOrderDet
    } = req.app.locals.models;
    if (req.body && req.body.ids) {
      return PurchaseOrderDet.findAll({
        where: {
          refPurchaseOrderID: {
            [Op.in]: req.body.ids
          },
          isDeleted: false
        },
        attributes: ['id']
      }).then((response) => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
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

  checkDisabledFormValidation: (req, res, databaseRecord, newRecord) => {
    if ((!newRecord.supplierID) || (newRecord.supplierID !== databaseRecord.supplierID)) {
      delete newRecord.supplierContactPerson;
      delete newRecord.supplierContactPersonID;
      delete newRecord.supplierAddress;
      delete newRecord.supplierAddressID;
    }
    if (newRecord.isPackingSlipGenerated) {
      delete newRecord.customerID;
      delete newRecord.poDate;
    }
    if (newRecord.isCustConsigned === false) {
      newRecord.customerID = null;
    }
    return newRecord;
  }
};