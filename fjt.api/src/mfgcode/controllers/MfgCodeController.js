const PricingController = require('../../pricing/controllers/PricingController.js');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
// eslint-disable-next-line import/no-unresolved
const RFQLineItemsController = require('../../RFQ_LineItems/controllers/RFQLineItemsController.js');
const GenericFilesController = require('../../genericfiles/controllers/GenericFilesController');
const { createPrimaryContactPersons } = require('../../customer_contactperson/controllers/Customer_ContactpersonController');
const fs = require('fs');
const Bson = require('bson');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const {
    NotFound,
    NotMatchingPassword
} = require('../../errors');

const _ = require('lodash');
const {
    Op
} = require('sequelize');
const { Promise } = require('bluebird');

const inputFields = [
    'id',
    'mfgCode',
    'mfgType',
    'mfgName',
    'legalName',
    'isdeleted',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'deletedBy',
    'deletedAT',
    'email',
    'website',
    'contact',
    'comments',
    'phExtension',
    'contactCountryCode',
    'faxNumber',
    'faxCountryCode',
    'isActive',
    'isCustOrDisty',
    'customerID',
    'paymentTermsID',
    'territory',
    'shippingMethodID',
    'scanDocumentSide',
    'authorizeType',
    'isOrderQtyRequiredInPackingSlip',
    'customerType',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'dateCodeFormatID',
    'salesCommissionTo',
    'freeOnBoardId',
    'supplierMFRMappingType',
    'taxID',
    'accountRef',
    'paymentMethodID',
    'carrierID',
    'carrierAccount',
    'shippingInsurence',
    'rmaCarrierID',
    'rmashippingMethodId',
    'rmaCarrierAccount',
    'rmaShippingInsurence',
    'poComment',
    'documentPath',
    'systemID',
    'customerSystemID',
    'invoicesRequireManagementApproval',
    'acctId',
    'isSupplierEnable',
    'isPricingApi',
    'externalSupplierOrder'
];
const mfgCodeAliasinputFields = [
    'id',
    'mfgcodeId',
    'alias',
    'mfgType',
    'isdeleted',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'deletedBy',
    'deletedAT',
    'systemGenerated',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const whoBoughtWhoinputFields = [
    'id',
    'buyBy',
    'buyTo',
    'buyDate',
    'copyMfgPN',
    'description',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const inputFieldsCustomerEmployeeMapping = [
    'id',
    'employeeId',
    'mfgCodeId',
    'isdeleted',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'deletedBy',
    'deletedAT',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const supplierMappingInputFields = [
    'id',
    'supplierID',
    'refMfgCodeMstID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'isCustMapping'
];
const customerCommentInputFields = [
    'id',
    'mfgCodeId',
    'inspectionRequirementId',
    'createdBy',
    'createdAt',
    'createByRoleId',
    'updatedBy',
    'updatedAt',
    'updateByRoleId',
    'isDeleted',
    'deletedAt',
    'deletedBy',
    'deleteByRoleId'
];

const supplierStandardsInputFields = [
    'standardID',
    'refStandardClassId',
    'refMfgCodeID',
    'standardStatus',
    'cerificateNumber',
    'lastApprovalDate',
    'expDate',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedAt',
    'deletedBy',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const CustomerCommentModuleName = DATA_CONSTANT.CUSTOMER_COMMENT;
const mfgcodeModuleName = DATA_CONSTANT.MFGCODE.NAME;
const distCodeModuleName = DATA_CONSTANT.MFGCODE.DIST_NAME;
const custCodeModuleName = DATA_CONSTANT.MFGCODE.CUST_NAME;
const CPNMFGMappingModuleName = DATA_CONSTANT.CUSTOMER_CPN.MFG_PN_MAPPING;
const InvaliMFGMapping = DATA_CONSTANT.INVALID_MFG.MFG_MAPPING;
const StandardModuleName = DATA_CONSTANT.CertificateStandards.DISPLAYNAME;

module.exports = {

    // Get List of MfgCode
    // GET : /api/v1/mfgcode/getMfgcodeList
    // @return List of MfgCode
    getMfgcodeList: async (req, res) => {
        try {
            const {
                MfgCodeMst,
                MfgCodeAlias,
                User,
                Employee,
                WhoBoughtWho,
                InvalidMfgMappingMst,
                ComponentApprovedSupplierMst,
                sequelize
            } = req.app.locals.models;

            const where = {
                isDeleted: false
            };
            // check type when pop-up open
            if (req.query.type) {
                where.mfgType = req.query.type;
            }
            // for dynamic column based search using Sequelize
            if (req.query.searchQuery) {
                where[Op.or] = [{
                    mfgCode: {
                        [Op.like]: `%${req.query.searchQuery}%`
                    }
                }, {
                    mfgName: {
                        [Op.like]: `%${req.query.searchQuery}%`
                    }
                }];
            }
            // when edit recored
            if (req.query.mfgcodeID) {
                where.id = req.query.mfgcodeID;
            } else if (req.query.customerID) {
                where.customerID = req.query.customerID;
            }

            if (req.query.isCustomer) {
                where.isCustOrDisty = true;
            }

            /* String value need to check false
             if parameter value false then no need to show inActive data
             if we pass searchInActive=="false" it will exclude inactive entries
             if we didn't pass anything for searchInActive parameter or passing true value will work same and fetch both active and inactive entries*/
            if (req.query.searchInActive && req.query.searchInActive === 'false') {
                where.isActive = true;
            }

            const mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                type: sequelize.QueryTypes.SELECT
            });

            const response = await MfgCodeMst.findAll({
                attributes: ['mfgCode', 'id', 'mfgType', 'mfgName', 'legalName', 'isCustOrDisty', 'email',
                    'customerID', 'isCompany', 'authorizeType', 'isPricingApi', 'systemGenerated', 'scanDocumentSide', 'salesCommissionTo', 'carrierID', 'carrierAccount', 'shippingInsurence',
                    'poComment', 'paymentTermsID', 'shippingMethodID', 'freeOnBoardId', 'supplierMFRMappingType', 'isOrderQtyRequiredInPackingSlip', 'invoicesRequireManagementApproval', 'comments',
                    [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('MfgCodeMst.mfgCode'), sequelize.col('MfgCodeMst.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName'],
                ],
                where: where,
                paranoid: false,
                order: ['mfgName'],
                include: [{
                    model: MfgCodeAlias,
                    as: 'mfgCodeAlias',
                    where: {
                        isDeleted: false
                    },
                    paranoid: false,
                    attributes: ['id', 'alias', 'createdAt'],
                    required: false,
                    include: [{
                        model: User,
                        as: 'user',
                        where: {
                            isDeleted: false
                        },
                        paranoid: false,
                        attributes: ['employeeID'],
                        required: false,
                        include: [{
                            model: Employee,
                            as: 'employee',
                            where: {
                                isDeleted: false
                            },
                            paranoid: false,
                            attributes: ['firstName', 'lastName'],
                            required: false
                        }]
                    }, {
                        model: InvalidMfgMappingMst,
                        as: 'invalidMfgMapping',
                        where: {
                            isDeleted: false
                        },
                        paranoid: false,
                        attributes: ['id'],
                        required: false
                    }]
                },
                {
                    model: WhoBoughtWho,
                    as: 'mfgCodeTo',
                    where: {
                        isDeleted: false
                    },
                    paranoid: false,
                    attributes: ['id', 'buyBy', 'buyDate', 'description'],
                    required: false
                }, {
                    model: ComponentApprovedSupplierMst,
                    as: 'component_approved_supplier_mst',
                    attributes: ['id', 'partID', 'priority'],
                    where: {
                        isDeleted: false
                    },
                    paranoid: false,
                    required: false
                }]
            });

            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },

    // Retrieve MFG Code List
    // POST: /api/v1/mfgcode/retriveMfgCodeList
    // @return list of Mfg Code
    retriveMfgCodeList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetManufacturer (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pmfgType,:pisCustOrDisty)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: req.body.isExport ? null : filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pmfgType: req.body.mfgType,
                pisCustOrDisty: req.body.isCustOrDisty ? JSON.parse(req.body.isCustOrDisty) : null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            mfgCode: _.values(response[1]),
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
    // Get list of Mfg Code
    // GET : /api/v1/mfgcode/retriveMfgCode
    // @return list of Mfg Code
    retriveMfgCode: async (req, res) => {
        const {
            MfgCodeMst,
            User,
            Employee,
            sequelize,
            MfgCodeAlias,
            InvalidMfgMappingMst,
            ContactPerson,
            WhoBoughtWho,
            SupplierMappingMst
        } = req.app.locals.models;

        const mfgTypeModuleName = module.exports.getMFGTypeModuleName(req.query.fromPageRequest);

        if (req.body.id && req.body.refTableName) {
            try {
                var functionDetail = await sequelize.query('Select fun_getTimeZone() as TimeZone,fun_getDateTimeFormat() as dateFormat, fun_getContPersonNameDisplayFormat() as contPersonNameFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            const where = {
                id: req.body.id
            }
            if (req.query && req.query.mfgType) {
                where.mfgType = req.query.mfgType;
            }
            const contPersonWhereClause = {
                refTransID: req.body.id,
                refTableName: req.body.refTableName,
                isDeleted: false
            }
            //It will create issue in Customer and MFR Popup select record from list
            //if (req.query && req.query.fromPageRequest) {
            //    if (req.query.fromPageRequest === DATA_CONSTANT.MFG_TYPE.DIST || req.query.fromPageRequest === DATA_CONSTANT.MFG_TYPE.CUSTOMER) {
            //        where.isCustOrDisty = true;
            //    }
            //}
            return await MfgCodeMst.findOne({
                where: where,
                order: [
                    [{
                        model: MfgCodeAlias,
                        as: 'mfgCodeAlias'
                    }, 'alias', 'ASC']
                ],
                include: [{
                    model: MfgCodeAlias,
                    as: 'mfgCodeAlias',
                    required: false,
                    attributes: ['id', 'alias', 'mfgcodeId', 'isDeleted', 'createdBy', 'createdAt', 'createByRoleId', 'updatedBy', 'updatedAt',
                        'updateByRoleId', 'deletedBy', 'deletedAt', 'deleteByRoleId', 'systemGenerated',
                        [sequelize.fn('fun_getUserNameByID', sequelize.col('MfgCodeAlias.createdBy')), 'employeeName'],
                        [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('MfgCodeAlias.createdAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'createdAtValue']],
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['employeeID'],
                        required: false,
                        include: [{
                            model: Employee,
                            as: 'employee',
                            attributes: ['firstName', 'lastName'],
                            required: false
                        }]
                    }, {
                        model: InvalidMfgMappingMst,
                        as: 'invalidMfgMapping',
                        attributes: ['id'],
                        required: false
                    }]
                },
                {
                    model: WhoBoughtWho,
                    as: 'mfgCodeTo',
                    attributes: ['id', 'buyBy', 'buyTo', 'buyDate', 'description'],
                    required: false
                }, {
                    model: ContactPerson,
                    as: 'contactPerson',
                    required: false,
                    where: contPersonWhereClause,
                    attributes: ['personId', 'isPrimary', 'isActive', 'firstName', 'middleName', 'lastName', [sequelize.fn('fun_GetFormattedContactPersonName', sequelize.col('contactPerson.firstName'), sequelize.col('contactPerson.middleName'), sequelize.col('contactPerson.lastName'), functionDetail[0].contPersonNameFormat), 'personFullName']]
                }, {
                    model: SupplierMappingMst,
                    as: 'supplier_mapping_mstSupplier',
                    required: false,
                    attributes: ['id', 'refMfgCodeMstID'],
                    where: {
                        isCustMapping: DATA_CONSTANT.MAPPING_TYPE.MFR
                    },
                    include: [{
                        model: MfgCodeMst,
                        as: 'MfgCodeMstManufacturer',
                        required: false,
                        attributes: ['id', 'mfgCode', 'mfgName', 'supplierMFRMappingType']
                    }]
                }, {
                    model: SupplierMappingMst,
                    as: 'supplier_mapping_mstCustomerMapping',
                    required: false,
                    attributes: ['id', 'refMfgCodeMstID'],
                    where: {
                        isCustMapping: DATA_CONSTANT.MAPPING_TYPE.CUSTOMER
                    },
                    include: [{
                        model: MfgCodeMst,
                        as: 'MfgCodeMstCustomer',
                        required: false,
                        attributes: ['id', 'mfgCode', 'mfgName']
                    }]
                }]
            }).then((mfgCodeDetails) => {
                if (!mfgCodeDetails) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(mfgTypeModuleName),
                        err: null,
                        data: null
                    });
                }

                return sequelize.query('CALL Sproc_CheckMFGUsedInFlow (:pmfgcodemstID)', {
                    replacements: {
                        pmfgcodemstID: req.body.id
                    }
                }).then((CustomerMFGUsedRes) => {
                    if (CustomerMFGUsedRes && CustomerMFGUsedRes[0] && CustomerMFGUsedRes[0]['mfg_in_use'] === 'mfg_in_use') {
                        mfgCodeDetails.dataValues.isMfgCodeUsedInFlow = true;
                    } else {
                        mfgCodeDetails.dataValues.isMfgCodeUsedInFlow = false;
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mfgCodeDetails, null);
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
            return await resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Delete MFG code details
    // DELETE : /api/v1/mfgcode/deleteMfgCode
    // @return list of Mfg Code
    deleteMfgCode: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            /* set type of module request */
            const mfgTypeModuleName = module.exports.getMFGTypeModuleName(req.body.objIDs.fromPageRequest);

            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.MFGCodeMst.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    EnterpriseSearchController.deleteMFGCodeDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(mfgTypeModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: response,
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
    // Check is password is right and MFG alias is not in any BOM
    // DELETE : /api/v1/mfgcode/checkMFGAliasRemovable
    // @return list of Mfg Code
    checkMFGAliasRemovable: (req, res) => {
        req.body.password = COMMON.DECRYPT_AES(req.body.password);
        const {
            User,
            RFQLineitemsAlternatepart,
            Component,
            RFQRoHS
        } = req.app.locals.models;

        const userID = COMMON.getRequestUserID(req);

        User.findOne({
            attributes: ['id', 'passwordDigest'],
            where: {
                id: userID
            }
        }).then(user => user.authenticate(req.body.password).then(() => {
            RFQLineitemsAlternatepart.findAll({
                where: {
                    [Op.or]: [{
                        mfgCode: req.body.mfgCode
                    },
                    {
                        distributor: req.body.mfgCode
                    }
                    ]
                },
                attributes: ['partID'],
                include: [{
                    model: Component,
                    as: 'component',
                    required: true,
                    attributes: ['id', 'PIDCode', 'isCustom'],
                    include: [{
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        required: false,
                        attributes: ['name', 'rohsIcon']
                    }]
                }]
            }).then((mfgUsedInPartList) => {
                if (!mfgUsedInPartList || mfgUsedInPartList.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        isAliasAllowedToDelete: true,
                        errMessage: '',
                        usedPartIDsList: []
                    }, null);
                } else {
                    const mfgUsedInPartListDet = _.uniqBy(mfgUsedInPartList, lineItem => lineItem.partID);

                    const messageContent = MESSAGE_CONSTANT.MASTER.MFG_ALIAS_NOT_DELETE;
                    messageContent.message = COMMON.stringFormat(messageContent.message, mfgUsedInPartListDet);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: {
                            isAliasAllowedToDelete: false,
                            usedPartIDsList: mfgUsedInPartListDet
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
        })
            // .catch((err) => {
            //     console.trace();
            //     console.error(err);
            //     return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err:err , data:null});
            // })
        ).catch((err) => {
            if (err instanceof NotMatchingPassword || err instanceof NotFound) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT,
                    err: null,
                    data: null
                });
            } else {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            }
        });
    },

    // Check Access leval for Add mfgCode
    // GET : /api/v1/mfgcode/getAcessLeval
    // @return list of access
    getAcessLeval: (req, res) => {
        const {
            Settings,
            Role
        } = req.app.locals.models;
        Settings.findOne({
            where: {
                key: req.query.access
            },
            attributes: ['key', 'values']
        }).then((response) => {
            if (response) {
                Role.findOne({
                    where: {
                        name: response.values
                    },
                    attributes: ['name', 'accessLevel']
                }).then(resp => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null)).catch((err) => {
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
    },
    // Check is alias is not in MFG alias
    // DELETE : /api/v1/mfgcode/checkUniqueMFGAlias
    // @return list of Mfg Code alias
    checkUniqueMFGAlias: (req, res) => {
        const {
            MfgCodeMst,
            MfgCodeAlias
        } = req.app.locals.models;
        MfgCodeAlias.findOne({
            attributes: ['id', 'alias', 'mfgcodeId'],
            where: {
                alias: req.body.alias
            },
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                attributes: ['id', 'mfgCode'],
                where: {
                    mfgType: req.body.mfgType
                }
            }]
        }).then((mfgAliasExistsInfo) => {
            if (mfgAliasExistsInfo) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    mfgAliasExistsInfo: mfgAliasExistsInfo
                }, null);
            }

            const whereClauseMfg = {
                [Op.or]: [{
                    mfgCode: req.body.alias
                },
                {
                    mfgName: req.body.alias
                }
                ],
                mfgType: req.body.mfgType
            };

            return MfgCodeMst.findOne({
                where: whereClauseMfg,
                attributes: ['id', 'mfgCode', 'mfgName']
            }).then(mfgCodeExistsInfo => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                mfgCodeExistsInfo: mfgCodeExistsInfo
            }, null)).catch((err) => {
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
    },

    // Get all manufacturers (MFG + DIST all)
    // POST : /api/v1/mfgcode/getAllManufacturers
    // @return list of all manufacturers
    getAllManufacturers: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        let strWhere = '';
        const filter = COMMON.UiGridFilterSearch(req);
        strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetAllManufacturers (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pMfgType,:psearchTxt,:pisExactSearch)', {
            replacements: {
                ppageIndex: req.body.page || req.body.Page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pMfgType: req.body.MfgType,
                psearchTxt: req.body.SearchText ? req.body.SearchText.toString().replace(/'/g, "''") : null,
                pisExactSearch: req.body.isExactSearch || false
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            mfgCode: _.values(response[1]),
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
    // Get all manufacturers with formatted code name list
    // GET : /api/v1/mfgcode/allManufacturer/getAllManufacturerWithFormattedCodeList
    // @return list of all manufacturers
    getAllManufacturerWithFormattedCodeList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetManufacturerWithFormattedCodeList (:pMfgType,:pIsPricingApi)', {
            replacements: {
                pMfgType: req.query.mfgType,
                pIsPricingApi: req.query.isPricingApi == null ? null : (req.query.isPricingApi === 'true' ? true : false)
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
            _.values(response[0]), null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
    },

    // Get List of Customer
    // GET : /api/v1/customers/getCustomerList
    // GET : /api/v1/supplier/getSupplierList
    // GET : /api/v1/mfgcode/getManufacturerList
    // @return List of Customer
    getManufacturer: async (req, res) => {
        try {
            const { MfgCodeMst, sequelize } = req.app.locals.models;
            const whereClause = {
                isDeleted: false
            };
            if (req.query.searchQuery) {
                whereClause[Op.or] = [{
                    mfgCode: {
                        [Op.like]: `%${req.query.searchQuery}%`
                    }
                }, {
                    mfgName: {
                        [Op.like]: `%${req.query.searchQuery}%`
                    }
                }];
            }
            if (req.query.mfgType) {
                whereClause.mfgType = req.query.mfgType;
            }
            if (req.query.isCustOrDisty === true || req.query.isCustOrDisty === 'true') {
                whereClause.isCustOrDisty = true;
            }
            const mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                type: sequelize.QueryTypes.SELECT
            });

            const response = await MfgCodeMst.findAll({
                where: whereClause,
                attributes: ['mfgCode', 'mfgName', 'legalName', 'id', 'paymentTermsID', 'shippingMethodID', 'isActive', 'isOrderQtyRequiredInPackingSlip', 'isCompany',
                    'freeOnBoardId', 'salesCommissionTo', 'paymentMethodID', 'rmaCarrierID', 'rmaShippingMethodId', 'rmaCarrierAccount', 'rmaShippingInsurence',
                    'comments', 'accountRef', 'invoicesRequireManagementApproval', 'carrierAccount', 'carrierID',
                    [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('MfgCodeMst.mfgCode'), sequelize.col('MfgCodeMst.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName'],
                    [sequelize.fn('fun_getTermDaysFromPaymentTermsID', sequelize.col('MfgCodeMst.paymentTermsID')), 'paymentTermsDays']
                ],
                order: [
                    ['mfgName', 'ASC']
                ]
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },

    saveManufacturer: (req, res) => {
        const {
            MfgCodeMst,
            WhoBoughtWho,
            sequelize,
            MfgCodeAlias,
            CompanyInfo,
            CustomerAddresses
        } = req.app.locals.models;
        if (req.body) {
            /* set type of module request */
            const mfgTypeModuleName = module.exports.getMFGTypeModuleName(req.body.fromPageRequest);

            if (req.body.mfgCode) {
                req.body.mfgCode = req.body.mfgCode.toUpperCase();
            }

            const alias = [];
            req.body.alias = req.body.alias ? req.body.alias : [];
            req.body.alias.forEach((item) => {
                item.alias = item.alias.toUpperCase();
                alias.push(item.alias);
            });
            let where = {
                [Op.or]: [{
                    mfgCode: req.body.mfgName
                },
                {
                    mfgName: req.body.mfgName
                },
                {
                    mfgCode: req.body.mfgCode
                },
                {
                    mfgName: req.body.mfgCode
                }],
                mfgType: req.body.mfgType
            };
            const aliaswhere = {
                alias: alias
            };

            // != null condition because id = 0 for FLEXTRON
            if (req.body.id != null) {
                where.id = {
                    [Op.ne]: req.body.id
                };
                aliaswhere.mfgcodeId = {
                    [Op.ne]: req.body.id
                };
            }

            if (!COMMON.CommonGenericCategoryCodeValidation.test(req.body.mfgCode)) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: null,
                    err: null,
                    data: {
                        isContainSpecialCharacter: true
                    }
                });
            }

            /* check unique code in MfgCodeMst */
            return MfgCodeMst.findOne({
                where: where,
                attributes: ['id', 'mfgCode', 'mfgName']
            }).then((mfgCodeMstExistsDet) => {
                if (mfgCodeMstExistsDet) {
                    if (mfgCodeMstExistsDet.dataValues.mfgCode.toUpperCase() === req.body.mfgCode.toUpperCase() ||
                        mfgCodeMstExistsDet.dataValues.mfgName.toUpperCase() === req.body.mfgCode.toUpperCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: null,
                            err: null,
                            data: {
                                isDuplicateCustomerMFGCode: true
                            }
                        });
                    } else if (mfgCodeMstExistsDet.dataValues.mfgName.toUpperCase() === req.body.mfgName.toUpperCase() ||
                        mfgCodeMstExistsDet.dataValues.mfgCode.toUpperCase() === req.body.mfgName.toUpperCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: null,
                            err: null,
                            data: {
                                isDuplicateCustomerMFGName: true
                            }
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.NOT_UPDATED(mfgTypeModuleName),
                            err: null,
                            data: null
                        });
                    }
                }

                /* check unique code in MfgCodeAlias */
                const whereClauseAliasForMFG = {
                    mfgType: req.body.mfgType
                };
                if (req.body.id != null) {
                    whereClauseAliasForMFG.id = {
                        [Op.ne]: req.body.id
                    };
                }

                return MfgCodeAlias.findOne({
                    where: {
                        [Op.or]: [{
                            alias: req.body.mfgCode
                        },
                        {
                            alias: req.body.mfgName
                        }
                        ]
                    },
                    attributes: ['id', 'alias'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id'],
                        where: whereClauseAliasForMFG
                    }]
                }).then((mfgCodeAliasExitsData) => {
                    if (mfgCodeAliasExitsData) {
                        if (mfgCodeAliasExitsData.dataValues.alias.toUpperCase() === req.body.mfgCode.toUpperCase()) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: null,
                                err: null,
                                data: {
                                    isDuplicateCustomerMFGCode: true
                                }
                            });
                        } else if (mfgCodeAliasExitsData.dataValues.alias.toUpperCase() === req.body.mfgName.toUpperCase()) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: null,
                                err: null,
                                data: {
                                    isDuplicateCustomerMFGName: true
                                }
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.NOT_UPDATED(mfgTypeModuleName),
                                err: null,
                                data: null
                            });
                        }
                    }

                    return MfgCodeAlias.findAll({
                        where: aliaswhere,
                        attributes: ['alias'],
                        include: [{
                            model: MfgCodeMst,
                            as: 'mfgCodemst',
                            attributes: ['id', 'mfgCode'],
                            where: whereClauseAliasForMFG
                        }]
                    }).then((data) => {
                        if (!data.length) {
                            // Update case : customer/manufacturer/supplier
                            if (req.body.id != null) {
                                return MfgCodeMst.findOne({
                                    where: {
                                        id: req.body.id
                                    }, include: [{
                                        model: CustomerAddresses,
                                        as: 'customerAddresses',
                                        where: { addressType: DATA_CONSTANT.ADDRESSES_TYPE.BILLING_ADDRESS, isDefault: true, isDeleted: false },
                                        attributes: ['personName', 'contact', 'contactCountryCode', 'faxCountryCode', 'faxNumber', 'phExtension', 'street1', 'street2', 'street3', 'city', 'state', 'postcode', 'countryID', 'isActive'],
                                        required: false
                                    }],
                                    attributes: ['mfgCode', 'mfgName', 'legalName', 'isCompany', 'id', 'authorizeType', 'isCustOrDisty', 'salesCommissionTo']
                                }).then((mfgCodeMstDet) => {
                                    if (!mfgCodeMstDet) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.NOT_UPDATED(mfgTypeModuleName),
                                            err: null,
                                            data: null
                                        });
                                    }
                                    // if (mfgCodeMstDet.isCustOrDisty) {
                                    //     req.body.isCustOrDisty = mfgCodeMstDet.isCustOrDisty;
                                    //     req.body.salesCommissionTo = mfgCodeMstDet.salesCommissionTo;
                                    // }

                                    COMMON.setModelUpdatedByFieldValue(req);
                                    return sequelize.transaction().then(t => module.exports.getCustomerSystemID(req, req.body.id, req.body.isCustOrDisty, req.body.mfgType, t).then(() => MfgCodeMst.update(req.body, {
                                        where: {
                                            id: req.body.id
                                        },
                                        fields: inputFields,
                                        transaction: t
                                    }).then(() => {
                                        var promiseComments = [];
                                        /* Add systemGenerated Comment when authorizationType is Authorize/Authorize&Independent. */
                                        promiseComments.push(module.exports.manageSupplierSystemGeneratedCommentPromise(req, req.body.id, mfgCodeMstDet.authorizeType, t));
                                        if (req.body.primaryContPersonsDet && req.body.primaryContPersonsDet.length > 0) {
                                            promiseComments.push(createPrimaryContactPersons(req, res, t));
                                        }

                                        return Promise.all(promiseComments).then((response) => {
                                            var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                                            if (resObj) {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                    messageContent: resObj.message ? resObj.message : (resObj.messageContent ? resObj.messageContent : MESSAGE_CONSTANT.NOT_UPDATED(mfgTypeModuleName)),
                                                    err: resObj.err || null,
                                                    data: null
                                                });
                                            } else {
                                                const addedContPersonDet = _.find(response, (item) => item.data && item.data.personIds);
                                                return MfgCodeAlias.findAll({
                                                    where: {
                                                        mfgcodeId: req.body.id
                                                    },
                                                    transaction: t
                                                }).then((response) => {
                                                    var newAddedAlias = [];
                                                    var deletedAlias = [];

                                                    if (req.body.alias && req.body.alias.length) {
                                                        /* remove passing alias(from list ui) that not available any more in db
                                                        case: removed from mfg and then customer details update  */
                                                        if (response && response.length > 0) {
                                                            const notAvailableAlias = req.body.alias.filter(item => item.id && _.map(response, 'id').indexOf(item.id) === -1);
                                                            if (notAvailableAlias && notAvailableAlias.length > 0) {
                                                                req.body.alias = req.body.alias.filter(e => !notAvailableAlias.includes(e));
                                                            }
                                                        }


                                                        // /* case: if additional alias added for supp and change only details like company name
                                                        //        then no need to delete existing added db alias  */
                                                        // if (req.body.isExistingAliasAllowedToChange) {

                                                        /* remove db alias that not passed from ui */
                                                        response.forEach((item) => {
                                                            /* check passing alias and db alias not matched then delete */
                                                            var typeObj = req.body.alias.find(x => parseInt(x.id) === parseInt(item.id));
                                                            if (!typeObj) {
                                                                /* if upcoming new created alias (like from customer - name or code) already there then no need to delete */
                                                                const newAddedAliasAlreadyExists = req.body.alias.find(x => !x.id && x.alias.toUpperCase() === item.alias.toUpperCase());
                                                                if (!newAddedAliasAlreadyExists) {
                                                                    deletedAlias.push(item.id);
                                                                }
                                                            }
                                                        });


                                                        /* add new alias */
                                                        req.body.alias.forEach((item) => {
                                                            var typeObj = null;
                                                            /* manufacturer */
                                                            typeObj = response.find(x => parseInt(x.id) === parseInt(item.id));

                                                            /* check new upcoming creating alias already exists then no need to create new one  */
                                                            if (!typeObj) {
                                                                typeObj = response.find(x => !item.id && item.alias.toUpperCase() === x.alias.toUpperCase());
                                                            }
                                                            // }

                                                            if (!typeObj) {
                                                                item.mfgcodeId = req.body.id;
                                                                item.mfgType = req.body.mfgType;
                                                                item.createdBy = req.user.id;
                                                                item.updatedBy = req.user.id;
                                                                item.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                                                item.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                                                newAddedAlias.push(item);
                                                            }
                                                        });
                                                    } else if (!req.body.isFromChangeCompanyOwnership) { // Do not execute code realted delete alias if we are doing change in company ownership.
                                                        deletedAlias = response.map(x => x.id);
                                                    }

                                                    const promises = [];

                                                    if (newAddedAlias.length) {
                                                        COMMON.setModelCreatedArrayFieldValue(req.user, newAddedAlias);
                                                        promises.push(MfgCodeAlias.bulkCreate(newAddedAlias, {
                                                            fields: mfgCodeAliasinputFields,
                                                            individualHooks: true,
                                                            transaction: t
                                                        }));
                                                    }
                                                    if (deletedAlias.length) {
                                                        COMMON.setModelDeletedByFieldValue(req);
                                                        promises.push(MfgCodeAlias.update(req.body, {
                                                            where: {
                                                                id: deletedAlias,
                                                                deletedAt: null
                                                            },
                                                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'deleteByRoleId'],
                                                            transaction: t
                                                        }));
                                                    }
                                                    if (req.body.fromPageRequest === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG && req.body.isCompany && req.body.isFromChangeCompanyOwnership) {
                                                        promises.push(
                                                            CompanyInfo.findOne({
                                                                where: {
                                                                    mfgCodeId: req.body.id,
                                                                    isDeleted: false
                                                                },
                                                                attributes: ['name']
                                                            }).then((comp) => {
                                                                if (!comp) {
                                                                    // soft delete old entry in company_info on company ownership change
                                                                    const deleteObj = {};
                                                                    COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObj);
                                                                    return CompanyInfo.update(deleteObj, {
                                                                        where: {
                                                                            isDeleted: false
                                                                        },
                                                                        fields: ['updatedAt', 'updatedBy', 'updateByRoleId', 'deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                                                        transaction: t
                                                                    }).then(() => {
                                                                        // create new entry in Company_info table on company ownership change
                                                                        const createObj = {
                                                                            name: mfgCodeMstDet.mfgName,
                                                                            registeredEmail: req.body.companyEmail,
                                                                            mfgCodeId: mfgCodeMstDet.id,
                                                                            legalName: mfgCodeMstDet.legalName
                                                                        };
                                                                        if (mfgCodeMstDet.customerAddresses && mfgCodeMstDet.customerAddresses.length > 0) {
                                                                            createObj.personName = mfgCodeMstDet.customerAddresses[0].personName;
                                                                            createObj.contactCountryCode = mfgCodeMstDet.customerAddresses[0].contactCountryCode;
                                                                            createObj.contactNumber = mfgCodeMstDet.customerAddresses[0].contact;
                                                                            createObj.faxCountryCode = mfgCodeMstDet.customerAddresses[0].faxCountryCode;
                                                                            createObj.faxNumber = mfgCodeMstDet.customerAddresses[0].faxNumber;
                                                                            createObj.phoneExt = mfgCodeMstDet.customerAddresses[0].phExtension;
                                                                            createObj.street1 = mfgCodeMstDet.customerAddresses[0].street1;
                                                                            createObj.street2 = mfgCodeMstDet.customerAddresses[0].street2;
                                                                            createObj.street3 = mfgCodeMstDet.customerAddresses[0].street3;
                                                                            createObj.city = mfgCodeMstDet.customerAddresses[0].city;
                                                                            createObj.state = mfgCodeMstDet.customerAddresses[0].state;
                                                                            createObj.postalCode = mfgCodeMstDet.customerAddresses[0].postcode;
                                                                            createObj.countryID = mfgCodeMstDet.customerAddresses[0].countryID;
                                                                        }
                                                                        COMMON.setModelCreatedObjectFieldValue(req.user, createObj);
                                                                        return CompanyInfo.create(createObj, {
                                                                            fields: ['name', 'registeredEmail', 'mfgCodeId', 'createdBy', 'createdAt', 'createByRoleId', 'updatedAt', 'updatedBy', 'updateByRoleId', 'personName', 'contactCountryCode',
                                                                                'contactNumber', 'faxCountryCode', 'faxNumber', 'phoneExt', 'street1', 'street2', 'street3', 'city', 'state', 'postalCode', 'countryID', 'legalName'],
                                                                            transaction: t
                                                                        });
                                                                    });
                                                                } else {
                                                                    return Promise.resolve(true);
                                                                }
                                                            }));
                                                    }
                                                    if (req.body.isCompany && req.body.isCompany !== mfgCodeMstDet.isCompany) {
                                                        COMMON.setModelUpdatedByFieldValue(req);
                                                        promises.push(MfgCodeMst.update(req.body, {
                                                            where: {
                                                                id: req.body.id,
                                                                deletedAt: null
                                                            },
                                                            fields: ['isCompany', 'updatedAt', 'updatedBy', 'updateByRoleId'],
                                                            transaction: t
                                                        }));
                                                        const updateobj = {
                                                            updatedAt: req.body.updatedAt,
                                                            updatedBy: req.body.updatedBy,
                                                            isCompany: false,
                                                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                                        };

                                                        promises.push(MfgCodeMst.update(updateobj, {
                                                            where: {
                                                                id: {
                                                                    [Op.ne]: req.body.id
                                                                },
                                                                isCompany: true,
                                                                deletedAt: null
                                                            },
                                                            fields: ['isCompany', 'updatedAt', 'updatedBy', 'updateByRoleId'],
                                                            transaction: t
                                                        }));
                                                    }

                                                    return Promise.all(promises).then((resp) => {
                                                        if (req.body.fromPageRequest === DATA_CONSTANT.MFGCODE.MFGTYPE.CUSTOMER ||
                                                            req.body.fromPageRequest === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                            if (req.body.fromPageRequest === DATA_CONSTANT.MFGCODE.MFGTYPE.CUSTOMER) {
                                                                return module.exports.AddCustEmployeeMapping(req, req.body.id, t).then(() => {
                                                                    return module.exports.supplierManufacturerMapping(req, res, t).then((mapped) => {
                                                                        if (mapped && mapped.isDuplicateMapping) {
                                                                            if (!t.finished) {
                                                                                t.rollback();
                                                                            }
                                                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                                messageContent: null,
                                                                                err: null,
                                                                                data: mapped
                                                                            });
                                                                        } else if (mapped) {
                                                                            if (req.body.gencFileOwnerType && !req.body.isSetMFGAsCustomerAction) {
                                                                                return GenericFilesController.manageDocumentPath(req, res, {
                                                                                    gencFileOwnerType: req.body.gencFileOwnerType,
                                                                                    refTransID: req.body.id
                                                                                }, t).then(() => module.exports.saveMFGResponse(req, res, resp, newAddedAlias, mfgTypeModuleName, addedContPersonDet, t)).catch((err) => {
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
                                                                                return module.exports.saveMFGResponse(req, res, resp, newAddedAlias, mfgTypeModuleName, addedContPersonDet, t);
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
                                                                return module.exports.supplierManufacturerMapping(req, res, t).then((mapped) => {
                                                                    if (mapped && mapped.isDuplicateMapping) {
                                                                        if (!t.finished) {
                                                                            t.rollback();
                                                                        }
                                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                            messageContent: null,
                                                                            err: null,
                                                                            data: mapped
                                                                        });
                                                                    } else if (mapped) {
                                                                        return module.exports.saveSupplierCustomerMapping(req, res, t).then((mapped) => {
                                                                            if (mapped && mapped.isDuplicateMapping) {
                                                                                if (!t.finished) {
                                                                                    t.rollback();
                                                                                }
                                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                                    messageContent: null,
                                                                                    err: null,
                                                                                    data: mapped
                                                                                });
                                                                            } else if (mapped) {
                                                                                if (req.body.gencFileOwnerType && !req.body.isSetMFGAsCustomerAction) {
                                                                                    return GenericFilesController.manageDocumentPath(req, res, {
                                                                                        gencFileOwnerType: req.body.gencFileOwnerType,
                                                                                        refTransID: req.body.id
                                                                                    }, t).then(() => module.exports.saveMFGResponse(req, res, resp, newAddedAlias, mfgTypeModuleName, addedContPersonDet, t)).catch((err) => {
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
                                                                                    return module.exports.saveMFGResponse(req, res, resp, newAddedAlias, mfgTypeModuleName, addedContPersonDet, t);
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
                                                        }

                                                        let obj = {};
                                                        if (req.body.whoAcquiredWho) {
                                                            obj = {
                                                                id: req.body.whoAcquiredWho.id,
                                                                buyBy: req.body.whoAcquiredWho.buyBy,
                                                                buyTo: req.body.whoAcquiredWho.buyTo,
                                                                buyDate: req.body.whoAcquiredWho.buyDate,
                                                                description: req.body.whoAcquiredWho.description,
                                                                createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                                                updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                                                createdBy: req.user.id,
                                                                updatedBy: req.user.id
                                                            };
                                                        }

                                                        if (!obj.id && obj.buyBy) {
                                                            /* add case - whoAcquiredWho edit block of mfg */
                                                            obj.createdBy = req.user.id;
                                                            obj.createByRoleId = COMMON.getRequestUserLoginRoleID(req);

                                                            where = {
                                                                buyTo: {
                                                                    [Op.in]: [obj.buyTo, obj.buyBy]
                                                                }
                                                            };

                                                            return WhoBoughtWho.findOne({
                                                                where: where,
                                                                include: [{
                                                                    model: MfgCodeMst,
                                                                    as: 'mfgCodeBy',
                                                                    attributes: ['id', 'mfgCode'],
                                                                    required: false
                                                                },
                                                                {
                                                                    model: MfgCodeMst,
                                                                    as: 'mfgCodeTo',
                                                                    attributes: ['id', 'mfgCode'],
                                                                    required: false
                                                                }
                                                                ]
                                                            }).then((responses) => {
                                                                if (!responses) {
                                                                    return WhoBoughtWho.create(obj, {
                                                                        fields: whoBoughtWhoinputFields,
                                                                        transaction: t
                                                                    }).then((whoBroughtDet) => {
                                                                        return t.commit().then(() => {
                                                                            // Add Merger & Acquisition Detail into Elastic Search Engine for Enterprise Search
                                                                            req.params['pId'] = whoBroughtDet.id;
                                                                            // Add Merger & Acquisition Detail into Elastic Search Engine for Enterprise Search
                                                                            EnterpriseSearchController.manageMergerAcquisitionInElastic(req);
                                                                            return sequelize.query('CALL Sproc_UpdateAcquisitionDetails (:buyToId,:puserID,:pRoleID)', {
                                                                                replacements: {
                                                                                    buyToId: req.body.whoAcquiredWho.buyTo,
                                                                                    puserID: req.user.id,
                                                                                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                                                                                }
                                                                            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(mfgTypeModuleName))).catch((err) => {
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
                                                                } else if (req.body.id) {
                                                                    if (!t.finished) t.rollback();
                                                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.WHO_BOUGHT_WHO_ALREADY_BUY);
                                                                    messageContent.message = COMMON.stringFormat(messageContent.message, responses.mfgCodeTo.mfgCode, responses.mfgCodeBy.mfgCode);
                                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                        messageContent: messageContent,
                                                                        err: null,
                                                                        data: null
                                                                    });
                                                                } else {
                                                                    if (!t.finished) t.rollback();
                                                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.WHO_BOUGHT_WHO_ALREADY_BUY);
                                                                    messageContent.message = COMMON.stringFormat(messageContent.message, responses.mfgCodeTo.mfgCode, responses.mfgCodeBy.mfgCode);
                                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                        messageContent: messageContent,
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
                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                                    err: err,
                                                                    data: null
                                                                });
                                                            });
                                                        } else if (obj && obj.id) {
                                                            /* Update case - whoAcquiredWho inside edit block of mfg */
                                                            const updateWBWObj = {
                                                                buyDate: obj.buyDate,
                                                                updatedBy: req.user.id,
                                                                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                                            };
                                                            return WhoBoughtWho.update(updateWBWObj, {
                                                                where: {
                                                                    id: obj.id
                                                                },
                                                                fields: ['buyDate', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                                                                transaction: t
                                                            }).then(() => {
                                                                return t.commit().then(() => {
                                                                    return sequelize.query('CALL Sproc_UpdateAcquisitionDetails (:buyToId,:puserID,:pRoleID)', {
                                                                        replacements: {
                                                                            buyToId: req.body.whoAcquiredWho.buyTo,
                                                                            puserID: req.user.id,
                                                                            pRoleID: COMMON.getRequestUserLoginRoleID(req)
                                                                        }
                                                                    }).then(() => {
                                                                        if (addedContPersonDet) {
                                                                            module.exports.managePrimaryContPersonInElastic(req, res, addedContPersonDet);
                                                                        }
                                                                        req.params = {
                                                                            mfgId: req.body.id,
                                                                            mfgType: req.body.mfgType
                                                                        };
                                                                        EnterpriseSearchController.manageMFGCodeDetailInElastic(req);
                                                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(mfgTypeModuleName));
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
                                                            return t.commit().then(() => {
                                                                if (Array.isArray(resp) && resp.length > 0 && Array.isArray(resp[0]) && resp[0].length > 0 &&
                                                                    Array.isArray(req.body.alias) && req.body.alias.length > 0) {
                                                                    req.body.alias.forEach((item) => {
                                                                        if (!item.id) {
                                                                            const AddedAlias = resp[0].find(aliasDet => aliasDet.alias === item.alias);
                                                                            item.id = AddedAlias ? AddedAlias.id : item.id;
                                                                        }
                                                                    });
                                                                }
                                                                if (addedContPersonDet) {
                                                                    module.exports.managePrimaryContPersonInElastic(req, res, addedContPersonDet);
                                                                }
                                                                // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                                req.params = {
                                                                    mfgId: req.body.id,
                                                                    mfgType: req.body.mfgType
                                                                };
                                                                // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                                // Need to change timeout code due to trasaction not get updated record
                                                                setTimeout(() => {
                                                                    EnterpriseSearchController.manageMFGCodeDetailInElastic(req);
                                                                }, 2000);
                                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(mfgTypeModuleName));
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
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
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
                                    )).catch((err) => {
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
                                return sequelize.transaction().then((t) => {
                                    COMMON.setModelCreatedByFieldValue(req);
                                    return MfgCodeMst.create(req.body, {
                                        fields: inputFields,
                                        transaction: t
                                    }).then((mfgcodes) => {
                                        const contPersonPromise = [];
                                        if (req.body.primaryContPersonsDet && req.body.primaryContPersonsDet.length > 0) {
                                            _.forEach(req.body.primaryContPersonsDet, (item) => {
                                                item.refTransID = mfgcodes.id;
                                            });
                                            contPersonPromise.push(createPrimaryContactPersons(req, res, t));
                                        }

                                        return Promise.all(contPersonPromise).then((result) => {
                                            if (result && Array.isArray(result)) {
                                                const failedDetail = _.find(result, (item) => item.status === STATE.FAILED);
                                                if (failedDetail) {
                                                    if (!t.finished) { t.rollback(); }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                        messageContent: failedDetail.messageContent ? failedDetail.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                        err: failedDetail.err || null,
                                                        data: null
                                                    });
                                                } else {
                                                    const addedContPersonDet = _.find(result, (item) => item.data && item.data.personIds);
                                                    if (req.body.alias) {
                                                        req.body.alias.forEach((element) => {
                                                            element.mfgcodeId = mfgcodes.id;
                                                            element.mfgType = mfgcodes.mfgType;
                                                            element['createdBy'] = req.user.id;
                                                            element['updatedBy'] = req.user.id;
                                                            element['createByRoleId'] = COMMON.getRequestUserLoginRoleID(req);
                                                            element['updateByRoleId'] = COMMON.getRequestUserLoginRoleID(req);
                                                        });
                                                        return MfgCodeAlias.bulkCreate(req.body.alias, {
                                                            individualHooks: true,
                                                            fields: mfgCodeAliasinputFields,
                                                            transaction: t
                                                        }).then((responseOFAlias) => {
                                                            if (req.body.fromPageRequest === DATA_CONSTANT.MFGCODE.MFGTYPE.CUSTOMER ||
                                                                req.body.fromPageRequest === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                                if (req.body.fromPageRequest === DATA_CONSTANT.MFGCODE.MFGTYPE.CUSTOMER) {
                                                                    req.body.supplierID = mfgcodes.id;
                                                                    return module.exports.AddCustEmployeeMapping(req, mfgcodes.id, t).then(() => module.exports.supplierManufacturerMapping(req, res, t).then((mapped) => {
                                                                        if (mapped && mapped.isDuplicateMapping) {
                                                                            if (!t.finished) {
                                                                                t.rollback();
                                                                            }
                                                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                                messageContent: null,
                                                                                err: null,
                                                                                data: mapped
                                                                            });
                                                                        } else if (mapped) {
                                                                            mfgcodes.dataValues.alias = responseOFAlias;
                                                                            // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                                            req.params = {
                                                                                mfgId: mfgcodes.id,
                                                                                mfgType: mfgcodes.mfgType
                                                                            };
                                                                            return t.commit().then(() => {
                                                                                if (addedContPersonDet) {
                                                                                    module.exports.managePrimaryContPersonInElastic(req, res, addedContPersonDet);
                                                                                }
                                                                                EnterpriseSearchController.manageMFGCodeDetailInElastic(req);
                                                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mfgcodes, MESSAGE_CONSTANT.CREATED(mfgTypeModuleName));
                                                                            });
                                                                            // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                                            // Need to change timeout code due to trasaction not get updated record
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
                                                                    });
                                                                } else {
                                                                    req.body.supplierID = mfgcodes.id;
                                                                    return module.exports.supplierManufacturerMapping(req, res, t).then((mapped) => {
                                                                        if (mapped && mapped.isDuplicateMapping) {
                                                                            if (!t.finished) {
                                                                                t.rollback();
                                                                            }
                                                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                                                err: null,
                                                                                data: mapped
                                                                            });
                                                                        } else if (mapped) {
                                                                            return module.exports.saveSupplierCustomerMapping(req, res, t).then((mapped) => {
                                                                                if (mapped && mapped.isDuplicateMapping) {
                                                                                    if (!t.finished) {
                                                                                        t.rollback();
                                                                                    }
                                                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                                        messageContent: null,
                                                                                        err: null,
                                                                                        data: mapped
                                                                                    });
                                                                                } else if (mapped) {
                                                                                    var promiseComments = [];
                                                                                    promiseComments.push(module.exports.manageSupplierSystemGeneratedCommentPromise(req, mfgcodes.id, null, t));
                                                                                    return Promise.all(promiseComments).then((response) => {
                                                                                        var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                                                                                        if (resObj) {
                                                                                            if (!t.finished) {
                                                                                                t.rollback();
                                                                                            }
                                                                                            if (resObj.message) {
                                                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                                                                    messageContent: resObj.message,
                                                                                                    err: resObj.err || null,
                                                                                                    data: resObj.data || null
                                                                                                });
                                                                                            } else {
                                                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                                                                    messageContent: MESSAGE_CONSTANT.NOT_UPDATED(mfgTypeModuleName),
                                                                                                    err: null,
                                                                                                    data: null
                                                                                                });
                                                                                            }
                                                                                        } else {
                                                                                            return t.commit().then(() => {
                                                                                                mfgcodes.dataValues.alias = responseOFAlias;
                                                                                                // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                                                                req.params = {
                                                                                                    mfgId: mfgcodes.id
                                                                                                };
                                                                                                if (addedContPersonDet) {
                                                                                                    module.exports.managePrimaryContPersonInElastic(req, res, addedContPersonDet);
                                                                                                }
                                                                                                // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                                                                // Need to change timeout code due to trasaction not get updated record
                                                                                                setTimeout(() => {
                                                                                                    EnterpriseSearchController.manageMFGCodeDetailInElastic(req);
                                                                                                }, 2000);
                                                                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mfgcodes, MESSAGE_CONSTANT.CREATED(mfgTypeModuleName));
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
                                                                    });
                                                                }
                                                            }

                                                            let obj = {};
                                                            if (req.body.whoAcquiredWho) {
                                                                obj = {
                                                                    id: req.body.whoAcquiredWho.acquiredID,
                                                                    buyBy: req.body.whoAcquiredWho.buyBy,
                                                                    buyTo: mfgcodes.id,
                                                                    buyDate: req.body.whoAcquiredWho.buyDate,
                                                                    description: req.body.whoAcquiredWho.description,
                                                                    createdBy: req.user.id,
                                                                    updatedBy: req.user.id,
                                                                    createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                                                };
                                                            }

                                                            if (!obj.id && obj.buyBy) {
                                                                obj.createdBy = req.user.id;
                                                                obj.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                                                where = {
                                                                    buyTo: {
                                                                        [Op.in]: [obj.buyBy]
                                                                    }
                                                                };

                                                                return WhoBoughtWho.findOne({
                                                                    where: where,
                                                                    include: [{
                                                                        model: MfgCodeMst,
                                                                        as: 'mfgCodeBy',
                                                                        attributes: ['id', 'mfgCode'],
                                                                        required: false
                                                                    },
                                                                    {
                                                                        model: MfgCodeMst,
                                                                        as: 'mfgCodeTo',
                                                                        attributes: ['id', 'mfgCode'],
                                                                        required: false
                                                                    }
                                                                    ]
                                                                }).then((response) => {
                                                                    if (!response) {
                                                                        return WhoBoughtWho.create(obj, {
                                                                            fields: whoBoughtWhoinputFields,
                                                                            transaction: t
                                                                        }).then(() => {
                                                                            return t.commit().then(() => {
                                                                                return sequelize.query('CALL Sproc_UpdateAcquisitionDetails (:buyToId,:puserID,:pRoleID)', {
                                                                                    replacements: {
                                                                                        buyToId: mfgcodes.id,
                                                                                        puserID: req.user.id,
                                                                                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                                                                                    }
                                                                                }).then(() => {
                                                                                    mfgcodes.dataValues.alias = req.body.alias;
                                                                                    if (addedContPersonDet) {
                                                                                        module.exports.managePrimaryContPersonInElastic(req, res, addedContPersonDet);
                                                                                    }
                                                                                    // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                                                    req.params = {
                                                                                        mfgId: mfgcodes.id
                                                                                    };
                                                                                    // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                                                    // Need to change timeout code due to trasaction not get updated record
                                                                                    setTimeout(() => {
                                                                                        EnterpriseSearchController.manageMFGCodeDetailInElastic(req);
                                                                                    }, 2000);

                                                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mfgcodes, MESSAGE_CONSTANT.CREATED(mfgTypeModuleName));
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
                                                                            });
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
                                                                    } else if (req.body.id) {
                                                                        if (!t.finished) {
                                                                            t.rollback();
                                                                        }
                                                                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.WHO_BOUGHT_WHO_ALREADY_BUY);
                                                                        messageContent.message = COMMON.stringFormat(messageContent.message, response.mfgCodeTo.mfgCode, response.mfgCodeBy.mfgCode);
                                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                            messageContent: messageContent,
                                                                            err: null,
                                                                            data: null
                                                                        });
                                                                    } else {
                                                                        if (!t.finished) {
                                                                            t.rollback();
                                                                        }
                                                                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.WHO_BOUGHT_WHO_ALREADY_BUY);
                                                                        messageContent.message = COMMON.stringFormat(messageContent.message, response.mfgCodeTo.mfgCode, response.mfgCodeBy.mfgCode);
                                                                        return resHandler.errorRes(res, 200, STATE.EMPTY, {
                                                                            messageContent: messageContent,
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
                                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                                        err: err,
                                                                        data: null
                                                                    });
                                                                });
                                                            } else {
                                                                return t.commit().then(() => {
                                                                    if (Array.isArray(responseOFAlias) && responseOFAlias.length > 0 &&
                                                                        Array.isArray(req.body.alias) && req.body.alias.length > 0) {
                                                                        req.body.alias.forEach((item) => {
                                                                            if (!item.id) {
                                                                                const newAddedAlias = responseOFAlias.find(aliasDet => aliasDet.alias === item.alias);
                                                                                item.id = newAddedAlias ? newAddedAlias.id : item.id;
                                                                            }
                                                                        });
                                                                    }
                                                                    mfgcodes.dataValues.alias = req.body.alias;
                                                                    if (addedContPersonDet) {
                                                                        module.exports.managePrimaryContPersonInElastic(req, res, addedContPersonDet);
                                                                    }
                                                                    // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                                    req.params = {
                                                                        mfgId: mfgcodes.id
                                                                    };
                                                                    // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                                    // Need to change timeout code due to trasaction not get updated record
                                                                    setTimeout(() => {
                                                                        EnterpriseSearchController.manageMFGCodeDetailInElastic(req);
                                                                    }, 2000);
                                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mfgcodes, MESSAGE_CONSTANT.CREATED(mfgTypeModuleName));
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
                                                    } else {
                                                        t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mfgcodes, MESSAGE_CONSTANT.CREATED(mfgTypeModuleName)));
                                                    }
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
                            const model = {
                                status: 'alias',
                                data: data
                            };
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: null,
                                err: null,
                                data: model
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err.errors.map(e => e.message).join(','),
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

    managePrimaryContPersonInElastic: (req, res, contPersonDet) => {
        if (contPersonDet && contPersonDet.data && contPersonDet.data.personIds) {
            _.forEach(contPersonDet.data.personIds, (item) => {
                const reqObj = _.cloneDeep(req);
                if (item) {
                    reqObj.params['personId'] = item;
                    EnterpriseSearchController.proceedTransction(reqObj, EnterpriseSearchController.manageContactPersonInElastic);
                }
            });
        }
    },

    manageSupplierSystemGeneratedCommentPromise: (req, MfgCodeID, oldAuthorizeType, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        /* Add systemGenerated Comment when authorizationType is Authorize/Authorize&Independent. */
        if (req.body && MfgCodeID) {
            return sequelize.query('CALL Sproc_manageMfgCodeMstSystemGeneratedComments(:pMfgCodeId,:pMfgType,:pOldAuthorizeType,:pNewAuthorizeType,:pCreatedBy,:pRoleId);', {
                replacements: {
                    pMfgCodeId: MfgCodeID,
                    pMfgType: req.body.mfgType,
                    pOldAuthorizeType: oldAuthorizeType || null,
                    pNewAuthorizeType: req.body.authorizeType || null,
                    pCreatedBy: COMMON.getRequestUserID(req),
                    pRoleId: COMMON.getRequestUserLoginRoleID(req)
                },
                transaction: t,
                type: sequelize.QueryTypes.SELECT
            }).then((repSP) => {
                return {
                    status: STATE.SUCCESS
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err
                }
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            }
        }
    },
    // Get module name from request type
    getMFGTypeModuleName: (requestedPageName) => {
        let mfgTypeModuleName = null;
        switch (requestedPageName) {
            case DATA_CONSTANT.MFGCODE.MFGTYPE.MFG:
                mfgTypeModuleName = mfgcodeModuleName;
                break;
            case DATA_CONSTANT.MFGCODE.MFGTYPE.CUSTOMER:
                mfgTypeModuleName = custCodeModuleName;
                break;
            case DATA_CONSTANT.MFGCODE.MFGTYPE.DIST:
                mfgTypeModuleName = distCodeModuleName;
                break;
            default:
                break;
        }

        return mfgTypeModuleName;
    },

    // // save billing terms only
    // // post:/api/v1/customers/saveCustomerBillingTerms
    // saveCustomerBillingTerms: (req, res) => {
    //     const {
    //         MfgCodeMst
    //     } = req.app.locals.models;

    //     if (req.body && req.body.id) {
    //         /* set type of module request */
    //         const mfgTypeModuleName = module.exports.getMFGTypeModuleName(req.body.fromPageRequest);

    //         COMMON.setModelUpdatedByFieldValue(req);
    //         return MfgCodeMst.update(req.body, {
    //             where: {
    //                 id: req.body.id
    //             },
    //             fields: inputFields
    //         }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(mfgTypeModuleName))).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                 messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                 err: err,
    //                 data: null
    //             });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
    //             messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
    //             err: null,
    //             data: null
    //         });
    //     }
    // },

    AddCustEmployeeMapping: (req, mfgCodeId, t) => {
        const {
            EmployeeMFGMapping
        } = req.app.locals.models;
        return EmployeeMFGMapping.findAll({
            where: {
                employeeId: req.user.employeeID,
                mfgCodeId: {
                    [Op.ne]: mfgCodeId
                }
            }
        }).then((resCustEmpMapping) => {
            if (resCustEmpMapping.length > 0) {
                const custEmpMappingObj = {
                    employeeId: req.user.employeeID,
                    mfgCodeId: mfgCodeId,
                    createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                    createdBy: COMMON.getRequestUserID(req),
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                    updatedBy: COMMON.getRequestUserID(req)
                };
                return EmployeeMFGMapping.create(custEmpMappingObj, {
                    fields: inputFieldsCustomerEmployeeMapping,
                    transaction: t
                });
            } else {
                return {
                    Status: STATE.SUCCESS
                };
            }
        });
    },

    // Check mfg name exist or not (common api called for customer,supplier and mfg)
    // post:/api/v1/checkDuplicateMFGName
    // @retrun validity of mfg name
    checkDuplicateMFGName: (req, res) => {
        const {
            MfgCodeMst,
            MfgCodeAlias
        } = req.app.locals.models;
        if (req.body) {
            const whereClauseMfg = {
                [Op.or]: [{
                    mfgCode: req.body.mfgName
                },
                {
                    mfgName: req.body.mfgName
                }
                ],
                mfgType: req.body.mfgType
            };
            if (req.body.mfgCodeMstID) {
                whereClauseMfg.id = {
                    [Op.ne]: req.body.mfgCodeMstID
                };
            }

            return MfgCodeMst.findOne({
                where: whereClauseMfg,
                attributes: ['id']
            }).then((mfg) => {
                if (mfg) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: {
                            isDuplicateCustomerMFGName: true
                        }
                    });
                }
                const whereClauseAliasForMFG = {
                    mfgType: req.body.mfgType
                };
                if (req.body.mfgCodeMstID) {
                    whereClauseAliasForMFG.id = {
                        [Op.ne]: req.body.mfgCodeMstID
                    };
                }

                return MfgCodeAlias.findOne({
                    where: {
                        alias: req.body.mfgName
                    },
                    attributes: ['id'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id'],
                        where: whereClauseAliasForMFG
                    }]
                }).then((mfgAlias) => {
                    if (mfgAlias) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: null,
                            err: null,
                            data: {
                                isDuplicateCustomerMFGName: true
                            }
                        });
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        isDuplicateCustomerMFGName: false
                    }, null);
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
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Check mfg code exist or not (common api called for customer,supplier and mfg)
    // post:/api/v1/checkDuplicateMFGCode
    // @retrun validity of code
    checkDuplicateMFGCode: (req, res) => {
        const {
            MfgCodeMst,
            MfgCodeAlias
        } = req.app.locals.models;

        if (req.body && req.body.mfgType) {
            const whereClauseMfg = {
                [Op.or]: [{
                    mfgCode: req.body.mfgCode
                },
                {
                    mfgName: req.body.mfgCode
                }
                ],
                mfgType: req.body.mfgType
            };

            if (req.body.mfgCodeMstID) {
                whereClauseMfg.id = {
                    [Op.ne]: req.body.mfgCodeMstID
                };
            }

            return MfgCodeMst.findOne({
                where: whereClauseMfg,
                attributes: ['id']
            }).then((mfg) => {
                if (mfg) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: {
                            isDuplicateCustomerMFGCode: true
                        }
                    });
                } else {
                    const whereClauseAliasForMFG = {
                        mfgType: req.body.mfgType
                    };
                    if (req.body.mfgCodeMstID) {
                        whereClauseAliasForMFG.id = {
                            [Op.ne]: req.body.mfgCodeMstID
                        };
                    }

                    return MfgCodeAlias.findOne({
                        where: {
                            alias: req.body.mfgCode
                        },
                        attributes: ['id'],
                        include: [{
                            model: MfgCodeMst,
                            as: 'mfgCodemst',
                            attributes: ['id'],
                            where: whereClauseAliasForMFG
                        }]
                    }).then((mfgAlias) => {
                        if (mfgAlias) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: null,
                                err: null,
                                data: {
                                    isDuplicateCustomerMFGCode: true
                                }
                            });
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            isDuplicateCustomerMFGCode: false
                        }, null);
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

    /* export sample template for mfg type */
    // eslint-disable-next-line consistent-return
    exportSampleMFGTemplate: (req, res) => {
        try {
            if (!req.body.mfgObj.mfgType) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                });
            }

            const mfgTypeName = `${req.body.mfgObj.mfgType}.xlsx`;
            const path = DATA_CONSTANT.MFGCODE.DOWNLOAD_PATH + mfgTypeName;

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

    // get component Customer alias rev. list
    // POST : /api/v1/customer/getComponentCustAliasRevByCustId
    // @return Customer alias rev. list
    getComponentCustAliasRevByCustId: (req, res) => {
        if (req.body) {
            const {
                sequelize
            } = req.app.locals.models;

            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize.query('CALL Sproc_GetComponentCustAliasRev (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pcustomerID,:pComponentId)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pcustomerID: req.body.customerID ? req.body.customerID : null,
                    pComponentId: req.body.componentId ? req.body.componentId : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                CompCustAliasRev: _.values(response[1]),
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

    // get component Customer alias rev. PN list
    // POST : /api/v1/customer/getComponentCustAliasRevPNByCustId
    // @return Customer alias rev. PN mapping list
    getComponentCustAliasRevPNByCustId: (req, res) => {
        if (req.body) {
            const {
                sequelize
            } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }

            return sequelize.query('CALL Sproc_GetComponetCustAliasRevPN (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prefComponentCustAliasRevID)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    prefComponentCustAliasRevID: req.body.ComponentCustAliasRevID ? req.body.ComponentCustAliasRevID : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                CompCustAliasRevPN: _.values(response[1]),
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

    // get AVL parts Detail of CPN Part
    // POST : /api/v1/customer/getAVLPartDetailByCPNID
    // @return AVL Parts Detail for CPN
    getAVLPartDetailByCPNID: (req, res) => {
        if (req.body.refCPNID) {
            const { ComponentCustAliasRevPN, Component, sequelize } = req.app.locals.models;

            return ComponentCustAliasRevPN.findAll({
                where: {
                    refCPNPartID: req.body.refCPNID
                },
                include: [{
                    model: Component,
                    as: 'refAVLPart',
                    attributes: ['id', 'mfgPN', 'mfgCodeID', 'rev']
                }]
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get Assumbly List From CPN
    // GET : /api/v1/customer/getAssumblyListFromCPN
    // @return Assumbly List From CPN
    getAssumblyListFromCPN: (req, res) => {
        const {
            RFQLineItems,
            MfgCodeMst,
            Component
        } = req.app.locals.models;
        RFQLineItems.findAll({
            where: {
                custPNID: req.params.id
            },
            attributes: ['partID']
        }).then((response) => {
            if (response.length) {
                const partIdList = response.map(x => x.dataValues).map(x => x.partID);
                return Component.findAll({
                    where: {
                        id: partIdList
                    },
                    attributes: ['id', ['mfgPN', 'name'], 'mfgcodeID', 'PIDCode'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        where: {
                            mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.MFG
                        },
                        attributes: ['mfgCode', 'mfgName']
                    }]
                }).then(resp => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
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

    // save mfgcustpn
    // post:/api/v1/customer/saveCustMFGPN
    // @return list of mfgpn
    saveCustMFGPN: (req, res) => {
        if (req.body.refCPNPartID && req.body.refComponentIDs) {
            const {
                sequelize
            } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.query('CALL Sproc_SaveCustMFGPn(:prefCPNPartID,:prefComponentIDs,:puserID,:pUserRoleID)', {
                replacements: {
                    prefCPNPartID: req.body.refCPNPartID,
                    prefComponentIDs: req.body.refComponentIDs.toString(),
                    puserID: req.user.id,
                    pUserRoleID: req.user.defaultLoginRoleID
                }
            }).then(response => {
                if (Array.isArray(response) && response[0] && response[0] && response[0].message) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.ALREADY_MAPPED_AVL_ERROR);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                } else {
                    return module.exports.updateBOMForCPNChanges(req, res, req.body.refCPNPartID, req.user.id).then((updateResponse) => {
                        if (updateResponse.status === STATE.SUCCESS) {
                            return module.exports.getPartDetails(req, req.body.refCPNPartID, res).then((result) => {
                                RFQSocketController.sendBOMInternalVersionChanged(req, {
                                    notifyFrom: 'CPN',
                                    data: _.values(result)
                                });
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(CPNMFGMappingModuleName));
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(CPNMFGMappingModuleName), err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    })
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

    // remove MPN Mapping from CPN
    // post:/api/v1/customer/removeMPNMapping
    // @return API Response
    removeMPNMapping: (req, res) => {
        if (req.body.refcompID && req.body.CPNPartID && req.body.deleteMPNFrom) {
            const { sequelize } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.query('CALL Sproc_RemoveMPNFromCPNMapping(:prefCompID,:prefCPNID,:puserID,:pUserRoleID,:pDeleteRequest,:pDeleteMPNFrom,:preason)', {
                replacements: {
                    prefCompID: req.body.refcompID,
                    prefCPNID: req.body.CPNPartID,
                    puserID: req.user.id,
                    pUserRoleID: req.user.defaultLoginRoleID,
                    pDeleteRequest: req.body.deleteRequestFrom,
                    pDeleteMPNFrom: req.body.deleteMPNFrom,
                    preason: req.body.reason || null
                }
            }).then((response) => module.exports.getPartDetails(req, req.body.CPNPartID, res).then((result) => {
                RFQSocketController.sendBOMInternalVersionChanged(req, {
                    notifyFrom: 'CPN',
                    data: _.values(result)
                });
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(CPNMFGMappingModuleName));
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Check CPN part UMID Stock
    // post:/api/v1/customer/checkCPNUIDStock
    // @return API Response
    checkCPNUIDStock: (req, res) => {
        if (req.body.refcompID && req.body.CPNPartID) {
            const { ComponentSidStock } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);
            return ComponentSidStock.findAll({
                where: {
                    refcompid: req.body.CPNPartID,
                    RefCPNMFGPNID: req.body.refcompID,
                    isinStk: 1
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

    // save mfgcustpn
    // post:/api/v1/customer/saveCustMFGPNMapping
    // @return list of mfgpn
    saveCustMFGPNMapping: (req, data, res) => {
        if (data && data.customerID && data.refCPNPartID && data.refComponentIDs) {
            const {
                sequelize
            } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.query('CALL Sproc_SaveCustMFGPn(:prefCPNPartID,:prefComponentIDs,:puserID,pUserRoleID)', {
                replacements: {
                    prefCPNPartID: data.refCPNPartID,
                    prefComponentIDs: data.refComponentIDs.toString(),
                    puserID: req.user.id,
                    pUserRoleID: req.user.defaultLoginRoleID
                }
            }).then(() => module.exports.updateBOMForCPNChanges(req, res, data.refCPNPartID, req.user.id).then((updateResponse) => {
                if (updateResponse.status === STATE.SUCCESS) {
                    return module.exports.getPartDetails(req, data.refCPNPartID, res).then((result) => {
                        RFQSocketController.sendBOMInternalVersionChanged(req, {
                            notifyFrom: 'CPN',
                            data: _.values(result)
                        });
                        return STATE.SUCCESS;
                    });
                } else {
                    return STATE.FAILED;
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            })).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
        } else {
            return STATE.FAILED;
        }
    },

    // save mfgcustpn
    // post:/api/v1/customer/CreateCustPNAndMapWithMFGPN
    // @return list of mfgpn
    CreateCustPNAndMapWithMFGPN: (req, data) => {
        if (data && data.custPN && data.custPart && data.custPNRev && data.customerID && data.refComponentIDs) {
            const {
                sequelize
            } = req.app.locals.models;
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_CreateCustPNAndMapWithMFGPN(:pcustPN,:pcustPart,:pcustPNRev,:pcustomerID,:prefComponentIDs,:puserID,:pUserRoleID)', {
                replacements: {
                    pcustPN: data.custPN,
                    pcustPart: data.custPart,
                    pcustPNRev: data.custPNRev,
                    pcustomerID: data.customerID,
                    prefComponentIDs: data.refComponentIDs.toString(),
                    puserID: req.user.id,
                    pUserRoleID: req.user.defaultLoginRoleID
                },
                transaction: t
            }).then(() => {
                return t.commit().then(() => STATE.SUCCESS);
            }).catch((err) => {
                t.rollback();
                console.trace();
                console.error(err);
                return STATE.FAILED;
            }));
        } else {
            return STATE.FAILED;
        }
    },


    // retrive customer assembly stock
    // get:/api/v1/customer/getCustomerAssemblyStock
    // @return list of customer assembly stock
    getCustomerAssemblyStock: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetriveCustomerAssemblyStockList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pCustomerId)', {
            replacements: {
                pPageIndex: req.query.page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pCustomerId: req.query.customerId ? req.query.customerId : null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
            customerAssemblyStock: _.values(response[1]),
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

    // Get setting to scan document
    // GET : /api/v1/supplier/getSupplierScanDocumentSetting
    // @return setting to scan document
    getSupplierScanDocumentSetting: (req, res) => {
        const MfgCodeMst = req.app.locals.models.MfgCodeMst;
        MfgCodeMst.findOne({
            where: {
                id: req.params.id,
                mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.DIST,
                isCustOrDisty: true,
                isDeleted: false
            },
            attributes: ['id', 'mfgCode', 'mfgName', 'scanDocumentSide']
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

    updateBOMForCPNChanges: (req, res, refCPNPartID, userId) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_UpdateRFQ_LineItems_AlternatePart_CPN (:pRefCPNPartID, :pUserID, :pReturnResult)', {
            replacements: {
                pRefCPNPartID: refCPNPartID,
                pUserID: userId,
                pReturnResult: true
            }
        }).then((response) => {
            if (response && response.length > 0) {
                _.each(response, (objPartId) => {
                    var data = {
                        partID: objPartId.partId,
                        loginUserId: userId,
                        userName: req.user.username,
                        isFromcustomer: true
                    };
                    //    RFQSocketController.updateBOMCPNDetails(req, data);
                });
            }
            return {
                status: STATE.SUCCESS
            };
        }).catch(() => ({
            status: STATE.FAILED
        }));
    },
    // get Mapped Manufacturer list
    // GET : /api/v1/mfgcode/getMappedManufacturerList
    // @return list of Mapped Manufacturer list
    getMappedManufacturerList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetMappedManufacturerList (:mfgCodeAliasID)', {
            replacements: {
                mfgCodeAliasID: req.params.mfgCodeAliasID
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            mappList: _.values(response[0])
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

    // save Mapped Manufacturer list
    // POST:/api/v1/mfgcode/saveMappedManufacturer
    // @return saved manufacturer
    saveMappedManufacturer: (req, res) => {
        const {
            sequelize,
            InvalidMfgMappingMst
        } = req.app.locals.models;
        if (req.body) {
            const mappedManufacturerList = req.body.mappedManufacturerLst;
            const newAddedMfgAliasandMappedMFG = _.filter(mappedManufacturerList, newMapped => !newMapped.refmfgAliasID);
            const newMappedMFG = _.filter(mappedManufacturerList, newMapped => newMapped.refmfgAliasID && !newMapped.id);
            let updatedMappedMFG = _.filter(mappedManufacturerList, newMapped => newMapped.refmfgAliasID && newMapped.id);
            const uniqueMfgCodeAliasIDs = _.map(_.uniqBy(updatedMappedMFG, 'refmfgAliasID'), 'refmfgAliasID');
            const mfgMappPromises = [];
            return sequelize.transaction().then((t) => {
                if (updatedMappedMFG.length > 0) {
                    mfgMappPromises.push(InvalidMfgMappingMst.findAll({
                        where: {
                            refmfgAliasID: {
                                [Op.in]: uniqueMfgCodeAliasIDs
                            },
                            isDeleted: false

                        },
                        attributes: ['refmfgAliasID', 'refmfgCodeID', 'id']
                    }).then((response) => {
                        updatedMappedMFG = _.filter(updatedMappedMFG, newMapped => !newMapped.isremove);
                        const dbMappedMfrslist = _.map(response, 'id');
                        const updateMappMfgList = _.map(updatedMappedMFG, 'id');
                        const removemappedMfgIDS = _.difference(dbMappedMfrslist, updateMappMfgList);
                        if (removemappedMfgIDS.length > 0) {
                            const objRemoveMfg = {
                                deletedBy: req.user.id,
                                deletedAt: COMMON.getCurrentUTC(),
                                isDeleted: true,
                                updatedBy: req.user.id,
                                updatedAt: COMMON.getCurrentUTC(),
                                updateByRoleId: req.user.defaultLoginRoleID,
                                deleteByRoleId: req.user.defaultLoginRoleID
                            };
                            return InvalidMfgMappingMst.update(objRemoveMfg, {
                                where: {
                                    id: {
                                        [Op.in]: removemappedMfgIDS
                                    }
                                },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
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
                }
                if (newAddedMfgAliasandMappedMFG.length > 0) {
                    mfgMappPromises.push(module.exports.saveMappedMFGNotHaveAliasName(req, newAddedMfgAliasandMappedMFG, t).then(updateResponse => updateResponse));
                }
                if (newMappedMFG.length > 0) {
                    mfgMappPromises.push(module.exports.saveMappedMFG(req, newMappedMFG, t).then(newAddResponse => newAddResponse));
                }
                return Promise.all(mfgMappPromises).then((resp) => {
                    if (_.find(resp, status => status === STATE.FAILED)) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.NOT_ADDED(InvaliMFGMapping),
                            err: null,
                            data: null
                        });
                    } else {
                        t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null));
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

    // save mapped manufacturer having not alias name
    saveMappedMFGNotHaveAliasName: (req, newAddedMfgAliasandMappedMFGList, t) => {
        const {
            InvalidMfgMappingMst,
            MfgCodeAlias
        } = req.app.locals.models;
        if (newAddedMfgAliasandMappedMFGList.length > 0) {
            const uniqueMfgAliasNames = _.map(_.uniqBy(newAddedMfgAliasandMappedMFGList, 'refmfgAliasName'), 'refmfgAliasName');
            return MfgCodeAlias.findAll({
                where: {
                    alias: {
                        [Op.in]: uniqueMfgAliasNames
                    },
                    isDeleted: false
                },
                attributes: ['alias', 'id'],
                transaction: t
            }).then((mfgAliaslist) => {
                if (mfgAliaslist.length > 0) {
                    const mfgpromises = [];
                    _.each(newAddedMfgAliasandMappedMFGList, (mfgAlias) => {
                        const objmfgAlias = _.find(mfgAliaslist, objAlias => objAlias.alias === mfgAlias.refmfgAliasName);
                        if (objmfgAlias) {
                            mfgAlias.refmfgAliasID = objmfgAlias.id;
                            mfgAlias.createdBy = req.user.id;
                            mfgAlias.updatedBy = req.user.id;
                            mfgAlias.updateByRoleId = req.user.defaultLoginRoleID
                            mfgAlias.createByRoleId = req.user.defaultLoginRoleID
                            mfgAlias.createdAt = COMMON.getCurrentUTC()
                            mfgpromises.push(InvalidMfgMappingMst.findOne({
                                where: {
                                    refmfgAliasID: mfgAlias.refmfgAliasID,
                                    refmfgCodeID: mfgAlias.refmfgCodeID,
                                    isDeleted: false
                                },
                                attributes: ['refmfgAliasID', 'id'],
                                transaction: t
                            }).then((mappAlias) => {
                                if (!mappAlias) {
                                    return InvalidMfgMappingMst.create(mfgAlias, {
                                        fields: ['refmfgAliasID', 'refmfgCodeID', 'createdBy', 'updatedBy', 'updateByRoleId', 'createByRoleId', 'createdAt'],
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
                        }
                    });
                    return Promise.all(mfgpromises).then((resp) => {
                        if (_.find(resp, status => status === STATE.FAILED)) {
                            return STATE.FAILED;
                        } else {
                            return STATE.SUCCESS;
                        }
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
            return STATE.SUCCESS;
        }
    },

    // save mapped manufacturer having alias id
    saveMappedMFG: (req, newMappedMFGList, t) => {
        const {
            InvalidMfgMappingMst
        } = req.app.locals.models;
        if (newMappedMFGList.length > 0) {
            const newmfgpromises = [];
            _.each(newMappedMFGList, (mfgAlias) => {
                mfgAlias.createdBy = req.user.id;
                mfgAlias.updatedBy = req.user.id;
                mfgAlias.updateByRoleId = req.user.defaultLoginRoleID
                mfgAlias.createByRoleId = req.user.defaultLoginRoleID
                mfgAlias.createdAt = COMMON.getCurrentUTC()
                newmfgpromises.push(InvalidMfgMappingMst.findOne({
                    where: {
                        refmfgAliasID: mfgAlias.refmfgAliasID,
                        refmfgCodeID: mfgAlias.refmfgCodeID,
                        isDeleted: false
                    },
                    attributes: ['refmfgAliasID', 'id'],
                    transaction: t
                }).then((mappAlias) => {
                    if (!mappAlias) {
                        return InvalidMfgMappingMst.create(mfgAlias, {
                            fields: ['refmfgAliasID', 'refmfgCodeID', 'createdBy', 'updatedBy', 'updateByRoleId', 'createByRoleId', 'createdAt'],
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
            return Promise.all(newmfgpromises).then((resp) => {
                if (_.find(resp, status => status === STATE.FAILED)) {
                    return STATE.FAILED;
                } else {
                    return STATE.SUCCESS;
                }
            });
        } else {
            return STATE.SUCCESS;
        }
    },

    // import manufacturer check and save in mongo db
    // POST:/api/v1/mfgcode/importFormat2ManufacturerDetails
    // @return Check manufacturer exist or not
    importFormatTwoManufacturerDetails: (req, res) => {
        if (req.body) {
            const manufacturerDetail = req.body.mfgList;
            const manufacturerDetailList = manufacturerDetail.mfrmodel;
            const isCustOrDisty = manufacturerDetail.isCustOrDisty;
            const mfrType = manufacturerDetail.mfgType;
            const moduleName = DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfrType ? mfgcodeModuleName : DATA_CONSTANT.SUPPLIER.NAME;
            const mfgPromises = [];
            _.each(manufacturerDetailList, (mfg) => {
                mfgPromises.push(PricingController.getManufacturerDetail(req, mfg[DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfrType ? isCustOrDisty ? 'Customer Name' : 'MFR Name' : 'Supplier Name'].trim(), mfrType)
                    .then((mfgDet) => {
                        if (mfg && mfg.status === STATE.FAILED) {
                            return mfg;
                        } else {
                            return module.exports.saveMongoMFR(mfgDet, mfrType,
                                mfg[DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfrType ? isCustOrDisty ? 'Customer Name' : 'MFR Name' : 'Supplier Name'].trim(), isCustOrDisty)
                                .then((mfgMapp) => {
                                    req.params.mfgId = mfgDet.mfgCodeID;
                                    req.params.mfgType = mfgDet.mfgType;
                                    // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageMFGCodeDetailInElastic);
                                    return mfgMapp;
                                }).catch((err) => {
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
            });
            return Promise.all(mfgPromises).then((resp) => {
                if (_.find(resp, mfgstatus => mfgstatus.status === STATE.FAILED)) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: null,
                        err: null,
                        data: resp
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null);
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
    // save component in mongo database
    // @return saved component
    saveMongoMFR: (objMfg, mfrType, mfgName, isCustOrDisty) => {
        var mongodb = global.mongodb;
        var ObjectID = Bson.ObjectID;
        // eslint-disable-next-line no-underscore-dangle
        objMfg._id = new ObjectID();
        objMfg.importMfg = mfgName;
        objMfg.isVerified = objMfg.mfgCodeID ? true : false;
        objMfg.mfrType = mfrType;
        objMfg.isMfg = objMfg.isCustOrDisty;
        objMfg.isCustOrDisty = isCustOrDisty;
        return mongodb.collection('mfrMappDet').insertOne(objMfg).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Remove MFR Detail from mongo db
    // POST:/api/v1/mfgcode/removeMFRDetails
    // @return remove or nt detail of MFR from mongoDB or not
    removeMFRDetails: (req, res) => {
        if (req.body) {
            return module.exports.removeMFRStatus(req).then((response) => {
                if (response === STATE.SUCCESS) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
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
    // remove all Mfr status
    removeMFRStatus: (req) => {
        var mongodb = global.mongodb;
        return mongodb.collection('mfrMappDet').deleteMany({
            mfrType: req.body.mfrType,
            isCustOrDisty: req.body.isCustOrDisty
        }).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Remove MFR Detail from mongo db Which are import and From DB as well
    // POST:/api/v1/mfgcode/removeMFRDetails
    // @return remove or not detail of MFR from mongoDB/MY SQL DB or not
    removeImportMFG: (req, res) => {
        const { MfgCodeAlias } = req.app.locals.models;
        const mongodb = global.mongodb;
        if (req.body) {
            const mfgTypeModuleName = module.exports.getMFGTypeModuleName(req.body.fromPageRequest);
            if (req.body.isMapped) {
                COMMON.setModelDeletedByFieldValue(req);
                return MfgCodeAlias.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'deleteByRoleId']
                }).then((response) => {
                    if (response) {
                        return mongodb.collection('mfrMappDet').deleteMany({
                            mfgCodeAliasID: req.body.id
                        }).then(mongoresponse => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mongoresponse,
                            MESSAGE_CONSTANT.DELETED(mfgTypeModuleName))).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: null,
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
                return mongodb.collection('mfrMappDet').deleteMany({
                    mfrType: req.body.fromPageRequest,
                    importMfg: req.body.importMfg,
                    isCustOrDisty: req.body.isCustOrDisty
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response,
                    MESSAGE_CONSTANT.DELETED(mfgTypeModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
                        });
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
    // Get manufacturer list from mongodb
    // GET : /api/v1/mfgcode/getVerificationManufacturerList
    // @return manufacturer list
    getVerificationManufacturerList: (req, res) => {
        var mongodb = global.mongodb;
        req.query.isCustOrDisty = req.query.isCustOrDisty === 'true' ? true : false;
        mongodb.collection('mfrMappDet').find({
            mfrType: req.query.type,
            isCustOrDisty: req.query.isCustOrDisty
        }).toArray((err, result) => {
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
    // Get manufacturer list from mongodb
    // GET : /api/v1/mfgcode/getVerificationManufacturerList
    // @return manufacturer list
    VerifyManufacturer: (req, res) => {
        if (req.body) {
            const { MfgCodeAlias, sequelize } = req.app.locals.models;
            const mongodb = global.mongodb;
            const promiseManufacturer = [];
            if (mongodb && Array.isArray(req.body) && req.body.length > 0) {
                return MfgCodeAlias.findOne({
                    where: {
                        id: req.body[0].AlisasId,
                        isDeleted: false
                    },
                    attributes: ['id', 'alias', 'mfgcodeId',
                        [sequelize.fn('fun_getUserNameByID', sequelize.col('MfgCodeAlias.createdBy')), 'employeeName'],
                        [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('MfgCodeAlias.createdAt')), 'createdAt']]
                }).then((aliasDet) => {
                    _.each(req.body, (objManufacturer) => {
                        promiseManufacturer.push(mongodb.collection('mfrMappDet').findOne({
                            _id: new Bson.ObjectId(objManufacturer._id)
                        }).then((result) => {
                            if (result) {
                                // eslint-disable-next-line no-underscore-dangle
                                return mongodb.collection('mfrMappDet').updateOne({
                                    _id: result._id
                                }, {
                                    $set: {
                                        isVerified: true,
                                        mfgCodeID: aliasDet.dataValues.mfgcodeId,
                                        mfgCode: objManufacturer.mfgCode,
                                        mfgName: objManufacturer.mfgName,
                                        employeeName: aliasDet.dataValues.employeeName,
                                        mfgCodeAliasID: aliasDet.id,
                                        createdAt: aliasDet.dataValues.createdAt,
                                        isCustOrDisty: objManufacturer.isCustOrDisty,
                                        isMfg: objManufacturer.isCustOrDisty
                                    }
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
                        // eslint-disable-next-line no-underscore-dangle
                    });
                    return Promise.all(promiseManufacturer).then((responseDet) => {
                        const isFailed = _.find(responseDet, status => status === STATE.FAILED);
                        if (isFailed) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, null, null);
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                        }
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, null, null);
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, null, null);
        }
    },
    // update verified manufacturer
    // GET : /api/v1/mfgcode/UpdateVerificationManufacturer
    // @return manufacturer list
    UpdateVerificationManufacturer: (req, res) => {
        var mongodb = global.mongodb;
        if (req.body) {
            const verifiedMfrs = req.body.manufacturers;
            const mfrUpdatePromise = [];
            _.each(verifiedMfrs, (mfr) => {
                mfrUpdatePromise.push(
                    mongodb.collection('mfrMappDet').findOne({
                        // eslint-disable-next-line no-underscore-dangle
                        _id: new Bson.ObjectId(mfr._id)
                    }).then((result) => {
                        if (result != null) {
                            const myquery = {
                                // eslint-disable-next-line no-underscore-dangle
                                _id: result._id
                            };
                            const newvalues = {
                                $set: {
                                    isVerified: true
                                }
                            };
                            return mongodb.collection('mfrMappDet').updateOne(myquery, newvalues).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            });
                        } else {
                            return STATE.SUCCESS;
                        }
                    })
                );
            });
            return Promise.all(mfrUpdatePromise).then((resp) => {
                if (_.find(resp, status => status === STATE.FAILED)) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {});
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null);
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

    // import manufacturer check and save in database
    // POST:/api/v1/mfgcode/importFormatOneManufacturerDetails
    // @return Check manufacturer exist or not
    importFormatOneManufacturerDetails: (req, res) => {
        if (req.body) {
            const mfgImportedDetail = req.body.mfgImportedDetail.modelList;
            const isReplaceSaleCommissionTo = req.body.mfgImportedDetail.replaceSalesCommissionTo;
            const mfgType = mfgImportedDetail[0].mfgType;
            const moduleName = DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? (mfgImportedDetail[0].isCustomer ?
                DATA_CONSTANT.CUSTOMER.NAME : mfgcodeModuleName) : DATA_CONSTANT.SUPPLIER.NAME;
            const isCustomer = mfgImportedDetail[0].isCustomer;
            const mfgPromises = [];
            _.each(mfgImportedDetail, (mfg) => {
                mfg.mfgCode = mfg.mfgCode.trim();
                if (isCustomer) {
                    mfgPromises.push(module.exports.getSalesCommissionToDetail(req, mfg.salesCommissionToName).then((responseSalesCommission) => {
                        if (responseSalesCommission.status === STATE.FAILED) {
                            mfg.status = responseSalesCommission.status;
                            mfg.message += responseSalesCommission.message;
                            return mfg;
                        } else {
                            mfg.salesCommissionTo = responseSalesCommission.salesCommissionTo;
                            return module.exports.saveImportFormatOneManufacturerDetails(req, mfg, mfgType);
                        }
                    }));
                } else {
                    mfgPromises.push(module.exports.saveImportFormatOneManufacturerDetails(req, mfg, mfgType));
                }
            });
            return Promise.all(mfgPromises).then((resp) => {
                var results = _.filter(resp, mfgstatus => mfgstatus.status === STATE.FAILED);
                const newAddedMFGCount = _.sumBy(resp, (item) => item.isMFGAdded ? 1 : 0);
                const newAddedAliasCount = _.sumBy(resp, item => item.addedAliasCount);
                const skipedCount = _.sumBy(resp, item => item.skipAliasCount);
                const summaryDet = {
                    newAddedMFGCount: newAddedMFGCount,
                    newAddedAliasCount: newAddedAliasCount,
                    skipedCount: skipedCount,
                    fauilerCount: Array.isArray(results) ? results.length : 0
                };
                if (results.length > 0) {
                    const errorData = {
                        errorRec: results,
                        summaryDet: summaryDet
                    };
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: null,
                        err: null,
                        data: errorData
                    });
                } else {
                    results = {
                        summaryDet: summaryDet
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, results, MESSAGE_CONSTANT.CREATED(moduleName));
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
    // Save Manufacture import Format One
    saveImportFormatOneManufacturerDetails: (req, mfg, mfgType) => PricingController.getManufacturerDetail(req, mfg.mfgCode, mfgType).then((mfgDet) => {
        if (mfg && mfg.status === STATE.FAILED) {
            return mfg;
        } else if (mfgDet.mfgCodeID) {
            mfg.mfgCodeID = mfgDet.mfgCodeID;
            mfg.isMFGAdded = false;
            mfg.isUpdated = true;
            if (DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType && mfgDet.isCustOrDisty && mfgDet.salesCommissionTo !== mfg.salesCommissionTo &&
                req.body && req.body.mfgImportedDetail && req.body.mfgImportedDetail.replaceSalesCommissionTo) {
                const {
                    MfgCodeMst
                } = req.app.locals.models;
                const objAlias = {
                    salesCommissionTo: mfg.salesCommissionTo,
                    createdBy: req.user.id,
                    updatedBy: req.user.id,
                    createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                };
                return MfgCodeMst.update(objAlias, {
                    where: {
                        id: mfgDet.mfgCodeID
                    },
                    fields: ['id', 'salesCommissionTo', 'createdBy', 'updatedBy', 'createByRoleId', 'updateByRoleId']
                }).then(() => {
                    return module.exports.saveManufacturerAlias(req, mfg, mfgType).then(insertAlias => insertAlias);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    mfgObj.status = STATE.FAILED;
                    mfgObj.message = MESSAGE_CONSTANT.MFR_IMPORT.SALES_COMMISSION_TO_NOT_UPDATE;
                    return mfgObj;
                });
            } else {
                return module.exports.saveManufacturerAlias(req, mfg, mfgType).then(insertAlias => insertAlias);
            }
        } else {
            const maxMFGCodeLength = DATA_CONSTANT.MFR_MAX_LENGTH.MFRCODE;
            if (mfg.mfgCode.length > maxMFGCodeLength) {
                mfg.status = STATE.FAILED;
                mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.MAXLENGTH, mfg.mfgCode, 'Code', mfg.mfgCode.length, maxMFGCodeLength); // mfg code have grater than 8 character
                return mfg;
            } else {
                const maxMFGNameLength = DATA_CONSTANT.MFR_MAX_LENGTH.MFRNAME;
                let mfrName = mfg.mfgAlias.length > 1 ? mfg.mfgAlias[1] : mfg.mfgAlias[0];
                if (!mfrName) {
                    mfg.status = STATE.FAILED;
                    mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.GLOBAL.REQUIRED.message, 'Name'); // mfg name have grater than 255 character
                    return mfg;
                }

                mfrName = mfrName.trim();
                if (mfrName.length > maxMFGNameLength) {
                    mfg.status = STATE.FAILED;
                    mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.MAXLENGTH, mfrName, 'Name', mfrName.length, maxMFGNameLength); // mfg name have grater than 255 character
                    return mfg;
                } else {
                    return PricingController.getManufacturerDetail(req, mfrName, mfgType).then((mfgDets) => {
                        if (mfgDets.mfgCodeID) {
                            mfg.status = STATE.FAILED;
                            mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.MFR_WRONG_MAPP, mfrName, mfgDets.mfgCode);
                            return mfg;
                        } else if (mfg.status === STATE.FAILED) {
                            return mfg;
                        } else {
                            return module.exports.saveManufacturerCode(req, mfg).then((insertMfgID) => {
                                if (insertMfgID) {
                                    mfg.mfgCodeID = insertMfgID;
                                    mfg.isMFGAdded = true;
                                    return module.exports.saveManufacturerAlias(req, mfg, mfgType).then((insertAlias) => {
                                        req.params.mfgId = mfg.mfgCodeID;
                                        req.params.mfgType = mfg.mfgType;
                                        // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageMFGCodeDetailInElastic);
                                        return insertAlias;
                                    });
                                } else {
                                    mfg.status = STATE.FAILED;
                                    mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? 'MFR Code' : 'Supplier Code'); // mfg code have some issue
                                    return mfg;
                                }
                            });
                        }
                    }).catch(() => {
                        mfg.status = STATE.FAILED;
                        mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? 'MFR Code' : 'Supplier Code');
                        return mfg;
                    });
                }
            }
        }
    }),
    // save manufacturer code
    saveManufacturerCode: (req, mfgAlias) => {
        const {
            MfgCodeMst
        } = req.app.locals.models;
        const objMFG = {
            mfgCode: mfgAlias.mfgCode.toUpperCase().trim(),
            mfgType: mfgAlias.mfgType,
            mfgName: mfgAlias.mfgAlias.length > 1 ? mfgAlias.mfgAlias[1].trim() : mfgAlias.mfgAlias[0].trim(),
            salesCommissionTo: mfgAlias.salesCommissionTo,
            customerType: mfgAlias.customerType,
            authorizeType: mfgAlias.authorizeType,
            isCustomer: false,
            isPricingApi: false,
            createdBy: req.user.id,
            updatedBy: req.user.id,
            isCompany: false,
            isDeleted: false,
            isCustOrDisty: mfgAlias.isCustOrDisty,
            createByRoleId: COMMON.getRequestUserLoginRoleID(req),
            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
        };
        return MfgCodeMst.create(objMFG, {
            fields: ['mfgCode', 'mfgType', 'mfgName', 'salesCommissionTo', 'customerType', 'authorizeType', 'isCustomer', 'isPricingApi', 'createdBy', 'isCompany', 'updatedBy', 'isDeleted', 'isCustOrDisty', 'createByRoleId', 'updateByRoleId']
        }).then(mfgres => mfgres.id).catch((err) => {
            console.trace();
            console.error(err);
            return null;
        });
    },

    // save manufacturer alias details
    saveManufacturerAlias: (req, mfg, type, t) => {
        const {
            MfgCodeAlias
        } = req.app.locals.models;
        var mfgAliasPromises = [];
        if (Array.isArray(mfg.mfgAlias) && mfg.mfgAlias.length > 0) {
            mfg.mfgAlias = _.uniq(mfg.mfgAlias.map(alias => alias && alias.toLowerCase()));
            _.each(mfg.mfgAlias, (mfgAliasDet) => {
                // eslint-disable-next-line consistent-return
                mfgAliasPromises.push(PricingController.getManufacturerDetail(req, mfgAliasDet.trim(), type).then((mfgDet) => {
                    const mfgObj = {};
                    if (!mfgDet.mfgCodeID || (mfgDet.mfgCodeID && parseInt(mfgDet.mfgCodeID) === parseInt(mfg.mfgCodeID))) {
                        if (mfgDet.AliasNotExists) {
                            const maxAliasNameLength = DATA_CONSTANT.MFR_MAX_LENGTH.MFRNAME;
                            if (mfgAliasDet.length > maxAliasNameLength) {
                                mfgObj.status = STATE.FAILED;
                                mfgObj.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.MAXLENGTH, mfgAliasDet, 'Name', mfgAliasDet.length, maxAliasNameLength);
                                return mfgObj;
                            } else {
                                const objAlias = {
                                    mfgcodeId: mfg.mfgCodeID,
                                    alias: mfgAliasDet.toUpperCase().trim(),
                                    mfgType: type,
                                    isDeleted: false,
                                    createdBy: req.user.id,
                                    updatedBy: req.user.id,
                                    createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                };
                                return MfgCodeAlias.create(objAlias, {
                                    fields: ['mfgcodeId', 'alias', , 'mfgType', 'isDeleted', 'createdBy', 'updatedBy', 'createByRoleId', 'updateByRoleId'],
                                    transaction: t
                                }).then(() => {
                                    mfgObj.status = STATE.SUCCESS;
                                    mfgObj.isAddedAlias = mfg.isUpdated ? true : false;
                                    return mfgObj;
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    mfgObj.status = STATE.FAILED;
                                    mfgObj.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfgAliasDet, 'Alias');
                                    return mfgObj;
                                });
                            }
                        } else {
                            mfgObj.status = STATE.SUCCESS;
                            mfgObj.isAliasExist = mfg.isUpdated ? true : false;
                            return mfgObj;
                        }
                    } else if (mfgDet.mfgCodeID && parseInt(mfgDet.mfgCodeID) !== parseInt(mfg.mfgCodeID)) {
                        mfgObj.status = STATE.FAILED;
                        mfgObj.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.MFR_WRONG_MAPP, mfgAliasDet, mfgDet.mfgCode);
                        return mfgObj;
                    }
                }));
            });
        }
        return Promise.all(mfgAliasPromises).then((resp) => {
            if (_.find(resp, mfgstatus => mfgstatus.status === STATE.FAILED)) {
                mfg.status = STATE.FAILED;
                mfg.message = _.map((_.filter(resp, failStatus => failStatus.status === STATE.FAILED)), 'message').join();
                return mfg;
            } else {
                mfg.status = STATE.SUCCESS;
                const skipAliasCount = resp.filter(item => item.isAliasExist === true);
                const addedAliasCount = resp.filter(item => item.isAddedAlias === true);
                mfg.addedAliasCount = Array.isArray(addedAliasCount) ? addedAliasCount.length : 0;
                mfg.skipAliasCount = Array.isArray(skipAliasCount) ? skipAliasCount.length : 0;
                return mfg;
            }
        });
    },

    // get Manufacturer Assign Parts Count
    // GET : /api/v1/customer/getManufacturerAssignCount
    // @return Manufacturer Assign Parts Count
    getManufacturerAssignCount: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetPartsCountForCustomerOrManufacturer (:pmfrID)', {
            replacements: {
                pmfrID: req.params.mfrID
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            partsCount: _.values(response[0])
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // update component with part status obsolete
    // GET : /api/v1/customer/updateComponentStatusToObsolete
    // @return Updated Customer status
    updateComponentStatusToObsolete: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_UpdatePartsStatusForCustomerOrManufacturer (:pmfrID)', {
            replacements: {
                pmfrID: req.params.mfrID
            }
        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    getPartDetails: (req, custPNID, res) => {
        const {
            RFQLineItems
        } = req.app.locals.models;
        if (custPNID) {
            return RFQLineItems.findAll({
                where: {
                    custPNID: custPNID
                },
                model: RFQLineItems,
                attributes: ['partID']
            }).then((rfqLineItems) => {
                // rfqLineItems
                _.each(rfqLineItems, (objres) => {
                    var data = {
                        partID: objres.dataValues.partID,
                        loginUserId: req.user.id,
                        userName: req.user.username,
                        isFromcustomer: true
                    };
                    RFQSocketController.updateBOMCPNDetails(req, data);
                });
                return rfqLineItems;
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
    // Get List of Customer
    // GET : /api/v1/customers/getCustomerList
    // @return List of Customer
    getCustomerByEmployeeID: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        return sequelize.query('CALL Sproc_getCustomerListbyEmployee (:pEmployeeID)', {
            replacements: {
                pEmployeeID: req.user.employeeID
            },
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
    },

    // import CPN check and save in database
    // POST:/api/v1/mfgcode/importCPNDetails
    // @return Check CPN and MFR PN exist or not
    importCPNDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.cpnDetail) {
            const cpnImportedDetail = req.body.cpnDetail.cpnImportedDetail;
            const customerId = req.body.cpnDetail.customerId;
            const cpnMfgMapping = [];
            const mfgORMfgPNNotExistList = [];
            const existCPNMismatchMFGPNList = [];
            const CPNWithDifferentRev = [];
            // eslint-disable-next-line consistent-return
            const mfgORMfgPNErrorList = _.filter(cpnImportedDetail, (item) => {
                if (!item.mfgCode || !item.mfgPN) {
                    return item;
                }
            });

            const cpnErrorList = _.filter(cpnImportedDetail, item => !item.cpn);

            const mfgCodeList = _.map(cpnImportedDetail, 'mfgCode');
            const mfgPNList = _.map(cpnImportedDetail, 'mfgPN');
            // eslint-disable-next-line consistent-return
            const custPNList = _.map(cpnImportedDetail, (item) => {
                if (item.cpn) return COMMON.stringFormat('{0} Rev{1}', item.cpn, (item.revision != null ? (item.revision !== '' ? item.revision : '-') : '-'));
            });

            let promises = [
                RFQLineItemsController.getMFGCodeIDByNameAlias(req, mfgCodeList, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG),
                RFQLineItemsController.getMFGPNIDByName(req, mfgPNList, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG),
                RFQLineItemsController.getMFGPNWithCPNMappingIDByName(req, custPNList, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG),
                RFQLineItemsController.getNonCPNComponentDetailByName(req, custPNList, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG)
            ];

            return Promise.all(promises).then((responses) => {
                var mfgCodeResp = responses[0];
                var mfgPNResp = responses[1];
                var custPNResp = responses[2];
                var nonCPNResp = responses[3];
                if (nonCPNResp && nonCPNResp.data.length > 0 && nonCPNResp.status === STATE.SUCCESS) {
                    let duplicateNonCPNMfRPN = [];
                    duplicateNonCPNMfRPN = _.uniq(_.map(nonCPNResp.data, 'mfgPN'));
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Following MPN', 'MFR');
                    const message = messageContent.message + '<br/><br/><table style="width:100%;"><thead><tr><th class="border-bottom padding-5">#</th><th class="border-bottom padding-5">MPN</th></tr></thead><tbody>{0}</tbody></table>';
                    const subMessage = [];
                    duplicateNonCPNMfRPN.forEach((item, i) => {
                        subMessage.push('<tr><td class="border-bottom padding-5">' + (i + 1) + '</td><td class="border-bottom padding-5">' + item + '</td></tr>');
                    });
                    messageContent.message = COMMON.stringFormat(message, subMessage.join(''));

                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                }

                if (mfgCodeResp && mfgCodeResp.status === STATE.SUCCESS) {
                    mfgCodeResp = _.map(mfgCodeResp.data, 'dataValues');
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(mfgcodeModuleName),
                        err: mfgCodeResp.error,
                        data: null
                    });
                }

                if (mfgPNResp && mfgPNResp.status === STATE.SUCCESS) {
                    mfgPNResp = _.map(mfgPNResp.data, 'dataValues');
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(mfgcodeModuleName),
                        err: mfgPNResp.error,
                        data: null
                    });
                }

                if (custPNResp && custPNResp.status === STATE.SUCCESS) {
                    custPNResp = _.map(custPNResp.data, 'dataValues');
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(mfgcodeModuleName),
                        err: custPNResp.error,
                        data: null
                    });
                }

                _.each(cpnImportedDetail, (data) => {
                    if (data.cpn && data.mfgCode && data.mfgPN) {
                        const mfgCodeObj = _.find(mfgCodeResp, item => ((item.name && item.name.toUpperCase() === data.mfgCode.toUpperCase()) || (item.mfgName && item.mfgName.toUpperCase() === data.mfgCode.toUpperCase())));
                        if (mfgCodeObj) {
                            const mfgPNObj = _.find(mfgPNResp, item => item.name && (item.name.toUpperCase() === data.mfgPN.toUpperCase()) && (parseInt(item.mfgcodeID) === parseInt(mfgCodeObj.id)));
                            if (mfgPNObj) {
                                // Create CPN and Map this MPN with this CPN
                                const custPn = COMMON.stringFormat('{0} Rev{1}', data.cpn, (data.revision != null ? (data.revision !== '' ? data.revision : '-') : '-'));
                                const custPNObj = _.find(custPNResp, item => item.name && item.name.toUpperCase() === custPn.toUpperCase() && parseInt(item.mfgcodeID) === parseInt(customerId));
                                if (custPNObj) {
                                    if (custPNObj.id !== mfgPNObj.id && !mfgPNObj.isCPN) {
                                        const getExistingObj = _.find(cpnMfgMapping, {
                                            refCPNPartID: custPNObj.id
                                        });
                                        if (getExistingObj) {
                                            if (getExistingObj.mfgPNID) {
                                                getExistingObj.mfgPNID.push(mfgPNObj.id);
                                                getExistingObj.mfgPNwithREV.push({ mfgPNID: mfgPNObj.id, mfgpnRev: mfgPNObj.rev, isCustom: mfgPNObj.isCustom });
                                            } else {
                                                getExistingObj.mfgPNID.push(mfgPNObj.id);
                                                getExistingObj.mfgPNwithREV = [{ mfgPNID: mfgPNObj.id, mfgpnRev: mfgPNObj.rev, isCustom: mfgPNObj.isCustom }];
                                            }
                                        } else {
                                            const mappingObj = {
                                                refCPNPartID: custPNObj.id,
                                                mfgPNID: [mfgPNObj.id],
                                                custPart: data.cpn,
                                                custPNRev: data.revision,
                                                mfgPNwithREV: [{ mfgPNID: mfgPNObj.id, mfgpnRev: mfgPNObj.rev, isCustom: mfgPNObj.isCustom }]
                                            };
                                            cpnMfgMapping.push(mappingObj);
                                        }
                                    }
                                } else {
                                    const getExistingObj = _.find(cpnMfgMapping, {
                                        custPN: custPn
                                    });
                                    if (getExistingObj) {
                                        if (getExistingObj.mfgPNID) {
                                            getExistingObj.mfgPNID.push(mfgPNObj.id);
                                            getExistingObj.mfgPNwithREV.push({ mfgPNID: mfgPNObj.id, mfgpnRev: mfgPNObj.rev, isCustom: mfgPNObj.isCustom });
                                        } else {
                                            getExistingObj.mfgPNID.push(mfgPNObj.id);
                                            getExistingObj.mfgPNwithREV = [{ mfgPNID: mfgPNObj.id, mfgpnRev: mfgPNObj.rev, isCustom: mfgPNObj.isCustom }];
                                        }
                                    } else {
                                        const mappingObj = {
                                            custPN: custPn,
                                            custPart: data.cpn,
                                            custPNRev: (data.revision != null ? (data.revision !== '' ? data.revision : '-') : '-'),
                                            mfgPNID: [mfgPNObj.id],
                                            mfgPNwithREV: [{ mfgPNID: mfgPNObj.id, mfgpnRev: mfgPNObj.rev, isCustom: mfgPNObj.isCustom }]
                                        };
                                        cpnMfgMapping.push(mappingObj);
                                    }
                                }
                            } else {
                                mfgORMfgPNNotExistList.push(data);
                            }
                        } else {
                            mfgORMfgPNNotExistList.push(data);
                        }
                    }
                });
                if (cpnMfgMapping.length > 0) {
                    _.each(cpnMfgMapping, (objCPN) => {
                        const revGroup = _.map(_.groupBy(objCPN.mfgPNwithREV, 'mfgpnRev'));
                        if (revGroup.length > 1) {
                            CPNWithDifferentRev.push(objCPN);
                        }
                        _.each(objCPN.mfgPNwithREV, (item) => {
                            if (item.isCustom && item.mfgpnRev !== objCPN.custPNRev) {
                                CPNWithDifferentRev.push(objCPN);
                            }
                        });
                    })

                    if (CPNWithDifferentRev.length === 0) {
                        return sequelize.transaction().then(t => sequelize.query('DROP TABLE IF EXISTS t_CPNUploadDetails; CREATE TEMPORARY TABLE t_CPNUploadDetails(customerID INT(11), refCPNPartID INT(11), custPN TEXT, custPart TEXT, custPNRev TEXT, refComponentIDs TEXT);', {
                            transaction: t
                        }).then(() => {
                            promises = [];
                            _.each(cpnMfgMapping, (custData) => {
                                if (custData.refCPNPartID) {
                                    const existPartlist = _.map(_.map(_.find(custPNResp, data => parseInt(data.id) === parseInt(custData.refCPNPartID)).ComponentCPNPart, 'dataValues'), 'refComponentID');
                                    if (existPartlist.length > 0) {
                                        const differentPartIdList = _.xor(existPartlist, custData.mfgPNID);
                                        if (differentPartIdList && differentPartIdList.length > 0) {
                                            const requiredPartID = [];
                                            _.each(differentPartIdList, (item) => {
                                                if (_.includes(existPartlist, item)) {
                                                    requiredPartID.push(item);
                                                }
                                            });
                                            if (requiredPartID.length > 0) {
                                                existCPNMismatchMFGPNList.push(custData);
                                            } else {
                                                promises.push(sequelize.query(`INSERT INTO t_CPNUploadDetails(customerID,refCPNPartID,refComponentIDs) values ("${customerId}","${custData.refCPNPartID}","${_.join(differentPartIdList, ',')}");`, {
                                                    transaction: t
                                                }).then(response => Promise.resolve(response)));
                                            }
                                        }
                                    } else {
                                        promises.push(sequelize.query(`INSERT INTO t_CPNUploadDetails(customerID,refCPNPartID,refComponentIDs) values ("${customerId}","${custData.refCPNPartID}","${_.join(custData.mfgPNID, ',')}");`, {
                                            transaction: t
                                        }).then(response => Promise.resolve(response)));
                                    }
                                } else {
                                    promises.push(sequelize.query(`INSERT INTO t_CPNUploadDetails(customerID, custPN, custPart, custPNRev, refComponentIDs) values ("${customerId}","${custData.custPN}","${custData.custPart}","${custData.custPNRev}","${_.join(custData.mfgPNID, ',')}");`, {
                                        transaction: t
                                    }).then(response => Promise.resolve(response)));
                                }
                            });
                            return Promise.all(promises).then(() => sequelize.query('CALL Sproc_ImportCPNData (:pcustomerID,:pUserID,:pUserRoleID)', {
                                replacements: {
                                    pcustomerID: customerId,
                                    pUserID: req.user.id,
                                    pUserRoleID: req.user.defaultLoginRoleID
                                },
                                transaction: t
                            }).then(() => {
                                return t.commit().then(() => {
                                    if (mfgORMfgPNErrorList.length > 0 || mfgORMfgPNNotExistList.length > 0 || cpnErrorList.length > 0 || existCPNMismatchMFGPNList.length > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                            messageContent: MESSAGE_CONSTANT.MASTER.CPN_UPLOAD_ERR,
                                            err: null,
                                            data: {
                                                mfgORMfgPNErrorList: mfgORMfgPNErrorList,
                                                mfgORMfgPNNotExistList: mfgORMfgPNNotExistList,
                                                cpnErrorList: cpnErrorList,
                                                existCPNMismatchMFGPNList: existCPNMismatchMFGPNList
                                            }
                                        });
                                        // "CPN(Comonent) is uploaded with error please check error file.");
                                    } else {
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.CPN_UPLOAD_SUCCESS); // "CPN(Comonent) is uploaded successfully."
                                    }
                                });
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
                                t.rollback();
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }));
                    }
                    else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: null,
                            err: null,
                            data: {
                                error: 'CPNWithDifferentMPNRev',
                                mfgORMfgPNErrorList: mfgORMfgPNErrorList,
                                mfgORMfgPNNotExistList: mfgORMfgPNNotExistList,
                                cpnErrorList: cpnErrorList,
                                existCPNMismatchMFGPNList: existCPNMismatchMFGPNList,
                                CPNWithDifferentRev: CPNWithDifferentRev
                            }
                        });
                    }
                } else if (mfgORMfgPNErrorList.length > 0 || mfgORMfgPNNotExistList.length > 0 || cpnErrorList.length > 0 || existCPNMismatchMFGPNList.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.MASTER.CPN_UPLOAD_ERR,
                        err: null,
                        data: {
                            mfgORMfgPNErrorList: mfgORMfgPNErrorList,
                            mfgORMfgPNNotExistList: mfgORMfgPNNotExistList,
                            cpnErrorList: cpnErrorList,
                            existCPNMismatchMFGPNList: existCPNMismatchMFGPNList
                        }
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.CPN_UPLOAD_SUCCESS);
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

    // Export CPN details
    // POST:/api/v1/mfgcode/exportCPNDetails
    // @return CPN Details with MFR
    exportCPNDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.cpnDetail) {
            return sequelize.query('CALL Sproc_getCPNDetails (:pcustomerId,:pComponentID)', {
                replacements: {
                    pcustomerId: req.body.cpnDetail && req.body.cpnDetail.customerId ? req.body.cpnDetail.customerId : null,
                    pComponentID: req.body.cpnDetail && req.body.cpnDetail.componentId ? req.body.cpnDetail.componentId : null,
                },
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // import Customer check and save in database
    // POST:/api/v1/mfgcode/importMFGExcelDetails
    // @return Check Customer exist or not
    importMFGExcelDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const mfgImportedDetail = req.body.mfgImportedDetail;
            const mfgType = mfgImportedDetail[0].mfgType;
            const isCustOrDisty = (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) ? 1 : mfgImportedDetail[0].isCustOrDisty;

            const mfgPromises = [];
            _.each(mfgImportedDetail, (mfg) => {
                mfgPromises.push(module.exports.getMFGDetailDetail(req, mfg.mfgAlias, mfgType).then((mfgDet) => {
                    if (mfgDet.mfgCodeID) {
                        if (req.body.isUpdateExistingData) {
                            mfg.mfgCodeID = mfgDet.mfgCodeID;
                            return module.exports.getMFGdetailWithShippingSalesFOB(req, mfg).then((respmfg) => {
                                if (respmfg.status === STATE.FAILED) {
                                    return respmfg;
                                } else {
                                    return sequelize.transaction().then(t =>
                                        module.exports.updateCustomerCode(req, mfg, t).then((insertAlias) => {
                                            if (insertAlias.status === STATE.FAILED) {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                mfg.status = STATE.FAILED;
                                                mfg.message = mfg.message ? mfg.message : COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? 'MFR Code' : 'Supplier Code'); // mfg code have some issue
                                                return mfg;
                                            } else {
                                                const saveMFGPromises = [];

                                                if (mfg.BillingAddress) {
                                                    mfg.BillingAddress.customerId = mfg.mfgCodeID;
                                                    saveMFGPromises.push(module.exports.saveAddressDetail(req, mfg.BillingAddress, t));
                                                }
                                                if (mfg.ShippingAddress) {
                                                    mfg.ShippingAddress.customerId = mfg.mfgCodeID;
                                                    saveMFGPromises.push(module.exports.saveAddressDetail(req, mfg.ShippingAddress, t));
                                                }

                                                return Promise.all(saveMFGPromises).then(() => {
                                                    mfg.isUpdateExisting = true;
                                                    return t.commit().then(() => {
                                                        req.params.mfgId = mfg.mfgCodeID;
                                                        req.params.mfgType = mfg.mfgType;
                                                        req.params.isCustOrDisty = mfg.isCustOrDisty;
                                                        // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageMFGCodeDetailInElastic);
                                                        return insertAlias;
                                                    });
                                                });
                                            }
                                        }).catch((err) => {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            console.trace();
                                            console.error(err);
                                            mfg.status = STATE.FAILED;
                                            mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? 'MFR Code' : 'Supplier Code'); // mfg code have some issue
                                            return mfg;
                                        })
                                    ).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        mfg.status = STATE.FAILED;
                                        mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? 'MFR Code' : 'Supplier Code'); // mfg code have some issue
                                        return mfg;
                                    });
                                }
                            });
                        } else {
                            mfg.skipAliasCount = 1;
                            return mfg;
                        }
                    } else {
                        return module.exports.getMFGdetailWithShippingSalesFOB(req, mfg).then((respmfg) => {
                            if (respmfg.status === STATE.FAILED) {
                                mfg.status = STATE.FAILED;
                                mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? isCustOrDisty ? 'Customer Code' : 'MFR Code' : 'Supplier Code'); // mfg code have some issue
                                return mfg;
                            } else {
                                return sequelize.transaction().then((t) => {
                                    return module.exports.saveCustomerCode(req, mfg, t).then((insertMfgID) => {
                                        if (insertMfgID) {
                                            if (insertMfgID.status === STATE.FAILED) {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                mfg.status = STATE.FAILED;
                                                mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? isCustOrDisty ? 'Customer Code' : 'MFR Code' : 'Supplier Code'); // mfg code have some issue
                                                return mfg;
                                            } else {
                                                mfg.mfgCodeID = insertMfgID;
                                                mfg.isMFGAdded = true;
                                                mfg.mfgAlias.push(mfg.mfgCode);
                                                const saveMFGPromises = [module.exports.saveMFGAlias(req, mfg, mfgType, t)];

                                                if (mfg.BillingAddress) {
                                                    mfg.BillingAddress.customerId = insertMfgID;
                                                    saveMFGPromises.push(module.exports.saveAddressDetail(req, mfg.BillingAddress, t));
                                                }
                                                if (mfg.ShippingAddress) {
                                                    mfg.ShippingAddress.customerId = insertMfgID;
                                                    saveMFGPromises.push(module.exports.saveAddressDetail(req, mfg.ShippingAddress, t));
                                                }
                                                return Promise.all(saveMFGPromises).then((respSaveMFG) => {
                                                    const failedObj = _.find(respSaveMFG, item => item.status === STATE.FAILED);
                                                    if (!failedObj) {
                                                        return t.commit().then(() => {
                                                            const insertAlias = respSaveMFG[0];
                                                            req.params.mfgId = mfg.mfgCodeID;
                                                            req.params.mfgType = mfg.mfgType;
                                                            req.params.isCustOrDisty = mfg.isCustOrDisty;
                                                            // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
                                                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageMFGCodeDetailInElastic);
                                                            return insertAlias;
                                                        });
                                                    } else {
                                                        if (!t.finished) {
                                                            t.rollback();
                                                        }
                                                        mfg.isMFGAdded = 0;
                                                        mfg.addedAliasCount = 0;
                                                        mfg.skipAliasCount = 0;
                                                        return mfg;
                                                    }
                                                }).catch((err) => {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    console.trace();
                                                    console.error(err);
                                                    mfg.status = STATE.FAILED;
                                                    mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? isCustOrDisty ? 'Customer Code' : 'MFR Code' : 'Supplier Code'); // mfg code have some issue
                                                    return mfg;
                                                });
                                            }
                                        } else {
                                            mfg.status = STATE.FAILED;
                                            mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? isCustOrDisty ? 'Customer Code' : 'MFR Code' : 'Supplier Code'); // mfg code have some issue
                                            return mfg;
                                        }
                                    }).catch((err) => {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        console.trace();
                                        console.error(err);
                                        mfg.status = STATE.FAILED;
                                        mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? isCustOrDisty ? 'Customer Code' : 'MFR Code' : 'Supplier Code'); // mfg code have some issue
                                        return mfg;
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    mfg.status = STATE.FAILED;
                                    mfg.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfg.mfgCode, DATA_CONSTANT.MFGCODE.MFGTYPE.MFG === mfgType ? isCustOrDisty ? 'Customer Code' : 'MFR Code' : 'Supplier Code'); // mfg code have some issue
                                    return mfg;
                                });
                            }
                        });
                    }
                }));
            });
            return Promise.all(mfgPromises).then((resp) => {
                var results = _.filter(resp, mfgstatus => mfgstatus.status === STATE.FAILED);
                const newAddedMFGCount = _.sumBy(resp, item => (item.isMFGAdded ? 1 : 0));
                const newAddedAliasCount = _.sumBy(resp, item => item.addedAliasCount);
                const skipedCount = _.sumBy(resp, item => item.skipAliasCount);
                const existingUpdateCount = _.sumBy(resp, item => (item.isUpdateExisting ? 1 : 0));
                const summaryDet = {
                    newAddedMFGCount: newAddedMFGCount,
                    newAddedAliasCount: newAddedAliasCount,
                    skipedCount: skipedCount,
                    fauilerCount: Array.isArray(results) ? results.length : 0,
                    existingUpdateCount: existingUpdateCount
                };
                if (results.length > 0) {
                    const errorData = {
                        errorRec: results,
                        summaryDet: summaryDet
                    };
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: null,
                        err: null,
                        data: errorData
                    });
                } else {
                    results = {
                        summaryDet: summaryDet
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, results,
                        MESSAGE_CONSTANT.CREATED(mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG ? isCustOrDisty ? custCodeModuleName : mfgcodeModuleName : distCodeModuleName));
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

    // save Customer code
    saveCustomerCode: (req, mfgAlias, t) => {
        const {
            MfgCodeMst
        } = req.app.locals.models;
        const objMFG = {
            mfgCode: mfgAlias.mfgCode.toUpperCase(),
            mfgType: mfgAlias.mfgType,
            mfgName: mfgAlias.mfgAlias.length > 1 ? mfgAlias.mfgAlias[1].toUpperCase().trim() : mfgAlias.mfgAlias[0].toUpperCase().trim(),
            legalName: mfgAlias.legalName,
            salesCommissionTo: mfgAlias.salesCommissionTo,
            freeOnBoardId: mfgAlias.freeOnBoardId,
            shippingMethodID: mfgAlias.shippingMethodID,
            comments: mfgAlias.comments,
            website: mfgAlias.website,
            contact: mfgAlias.contact,
            faxNumber: mfgAlias.faxNumber,
            contactCountryCode: mfgAlias.contactCountryCode,
            faxCountryCode: mfgAlias.faxCountryCode,
            phExtension: mfgAlias.phExtension,
            territory: mfgAlias.territory,
            customerType: mfgAlias.customerType,
            email: mfgAlias.email,
            taxID: mfgAlias.taxID,
            accountRef: mfgAlias.accountRef,
            supplierMFRMappingType: mfgAlias.supplierMFRMappingType,
            isOrderQtyRequiredInPackingSlip: mfgAlias.isOrderQtyRequiredInPackingSlip,
            authorizeType: mfgAlias.authorizeType,
            scanDocumentSide: mfgAlias.scanDocumentSide,
            createdBy: req.user.id,
            updatedBy: req.user.id,
            isCompany: false,
            isDeleted: false,
            isCustOrDisty: mfgAlias.isCustOrDisty,
            createByRoleId: COMMON.getRequestUserLoginRoleID(req),
            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
        };
        return MfgCodeMst.create(objMFG, {
            fields: ['mfgCode', 'mfgType', 'mfgName', 'legalName', 'createdBy', 'isCompany', 'salesCommissionTo', 'shippingMethodID', 'freeOnBoardId', 'comments',
                'customerType', 'phExtension', 'faxNumber', 'contactCountryCode', 'faxCountryCode', 'website', 'contact', 'territory', 'email', 'updatedBy', 'isDeleted', 'isCustOrDisty', 'createByRoleId',
                'updateByRoleId', 'taxID', 'accountRef', 'scanDocumentSide', 'authorizeType', 'isOrderQtyRequiredInPackingSlip', 'supplierMFRMappingType'
            ],
            transaction: t
        }).then(mfgres => mfgres.id).catch((err) => {
            if (!t.finished) {
                t.rollback();
            }
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                err: err
            };
        });
    },

    // Update Customer code
    updateCustomerCode: (req, mfg, t) => {
        const {
            MfgCodeMst,
            MfgCodeAlias
        } = req.app.locals.models;
        const objMFG = {
            mfgCodeID: mfg.mfgCodeID,
            legalName: mfg.legalName,
            salesCommissionTo: mfg.salesCommissionTo,
            comments: mfg.comments,
            website: mfg.website,
            contact: mfg.contact,
            faxNumber: mfg.faxNumber,
            contactCountryCode: mfg.contactCountryCode,
            faxCountryCode: mfg.faxCountryCode,
            phExtension: mfg.phExtension,
            territory: mfg.territory,
            shippingMethodID: mfg.shippingMethodID,
            freeOnBoardId: mfg.freeOnBoardId,
            customerType: mfg.customerType,
            email: mfg.email,
            taxID: mfg.taxID,
            accountRef: mfg.accountRef,
            supplierMFRMappingType: mfg.supplierMFRMappingType,
            isOrderQtyRequiredInPackingSlip: mfg.isOrderQtyRequiredInPackingSlip,
            authorizeType: mfg.authorizeType,
            scanDocumentSide: mfg.scanDocumentSide,
            updatedBy: req.user.id,
            isCustOrDisty: mfg.isCustOrDisty,
            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
        };
        return MfgCodeMst.update(objMFG, {
            where: {
                id: objMFG.mfgCodeID
            },
            fields: ['phExtension', 'salesCommissionTo', 'comments', 'faxNumber', 'website', 'contact', 'contactCountryCode', 'faxCountryCode', 'customerType', 'territory', 'shippingMethodID', 'freeOnBoardId', 'email',
                'updatedBy', 'isCustOrDisty', 'updateByRoleId', 'taxID', 'accountRef', 'scanDocumentSide', 'authorizeType', 'isOrderQtyRequiredInPackingSlip', 'supplierMFRMappingType', 'legalName'
            ],
            transaction: t
        }).then(() => {
            const mfgAliasPromises = [];
            _.each(mfg.mfgAlias, (mfgAliasDet) => {
                mfgAliasPromises.push(PricingController.getManufacturerDetail(req, mfgAliasDet, mfg.mfgType).then((mfgDet) => {
                    const mfgObj = {};
                    if (mfgDet && mfgDet.status === STATE.FAILED) {
                        mfgObj.status = STATE.FAILED;
                        mfgObj.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfgAliasDet, 'Alias');
                        return mfgObj;
                    } else if (mfgDet.mfgCodeID) {
                        if (parseInt(mfgDet.mfgCodeID) !== parseInt(mfg.mfgCodeID)) {
                            mfgObj.status = STATE.FAILED;
                            mfgObj.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.MFR_WRONG_MAPP, mfgAliasDet, mfgDet.mfgCode);
                            return mfgObj;
                        } else {
                            mfgObj.status = STATE.SUCCESS;
                            return mfgObj;
                        }
                    } else {
                        const objAlias = {
                            mfgcodeId: mfg.mfgCodeID,
                            alias: mfgAliasDet.toUpperCase(),
                            mfgType: mfg.mfgType,
                            isDeleted: false,
                            createdBy: req.user.id,
                            updatedBy: req.user.id,
                            createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        };
                        mfg.isMFGAdded = false;
                        mfg.isUpdated = true;
                        return MfgCodeAlias.create(objAlias, {
                            fields: ['mfgcodeId', 'alias', 'mfgType', 'isDeleted', 'createdBy', 'updatedBy', 'createByRoleId', 'updateByRoleId'],
                            transaction: t
                        }).then(() => {
                            mfgObj.status = STATE.SUCCESS;
                            mfgObj.isAddedAlias = true;
                            return mfgObj;
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            mfgObj.status = STATE.FAILED;
                            mfgObj.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfgAliasDet, 'Alias');
                            return mfgObj;
                        });
                    }
                }));
            });
            return Promise.all(mfgAliasPromises).then((resp) => {
                if (_.find(resp, mfgstatus => mfgstatus.status === STATE.FAILED)) {
                    mfg.status = STATE.FAILED;
                    mfg.message = _.map((_.filter(resp, failStatus => failStatus.status === STATE.FAILED)), 'message').join();
                    return mfg;
                } else {
                    mfg.status = STATE.SUCCESS;
                    const addedAliasCount = resp.filter(item => item.isAddedAlias === true);
                    mfg.addedAliasCount = Array.isArray(addedAliasCount) ? addedAliasCount.length : 0;
                    return mfg;
                }
            }).catch((err) => {
                if (!t.finished) {
                    t.rollback();
                }
                console.trace();
                console.error(err);
                mfg.status = STATE.FAILED;
                mfg.err = err.message;
                return mfg;
            });
        }).catch((err) => {
            if (!t.finished) {
                t.rollback();
            }
            console.trace();
            console.error(err);
            mfg.status = STATE.FAILED;
            mfg.err = err.message;
            return mfg;
        });
    },

    // update Display Order
    // POST:/api/v1/mfgcode/updateDisplayOrder
    updateDisplayOrder: (req, res) => {
        const {
            MfgCodeMst
        } = req.app.locals.models;
        if (req.body) {
            /* set type of module request */
            let mfgTypeModuleName = null;
            let mfgTypeName = null;
            switch (req.body.fromPageRequest) {
                case DATA_CONSTANT.MFGCODE.MFGTYPE.MFG:
                    mfgTypeModuleName = mfgcodeModuleName;
                    mfgTypeName = DATA_CONSTANT.MFGCODE.MFGTYPE.MFG;
                    break;
                case DATA_CONSTANT.MFGCODE.MFGTYPE.CUSTOMER:
                    mfgTypeModuleName = DATA_CONSTANT.CUSTOMER.Name;
                    mfgTypeName = DATA_CONSTANT.MFGCODE.MFGTYPE.MFG;
                    break;
                case DATA_CONSTANT.MFGCODE.MFGTYPE.DIST:
                    mfgTypeModuleName = DATA_CONSTANT.SUPPLIER.NAME;
                    mfgTypeName = DATA_CONSTANT.MFGCODE.MFGTYPE.DIST;
                    break;
                default:
                    break;
            }
            const where = {
                id: {
                    [Op.ne]: req.body.id
                },
                mfgType: mfgTypeName,
                isDeleted: false
            }
            if (req.body.externalSupplierOrder) {
                where.externalSupplierOrder = req.body.externalSupplierOrder;
            } else {
                where.displayOrder = req.body.displayOrder;
            }
            return MfgCodeMst.findOne({
                where: where
            }).then((isexist) => {
                if (isexist && (req.body.displayOrder || req.body.externalSupplierOrder)) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.externalSupplierOrder ? 'External Supplier Order' : 'Display Order');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    const updateobj = {
                        updatedBy: req.body.updatedBy,
                        updateByRoleId: req.body.updateByRoleId
                    };
                    if (req.body.externalSupplierOrder) {
                        updateobj.externalSupplierOrder = req.body.externalSupplierOrder;
                    } else {
                        updateobj.displayOrder = req.body.displayOrder;
                    }

                    return MfgCodeMst.update(updateobj, {
                        where: {
                            id: req.body.id,
                            mfgType: mfgTypeName,
                            isDeleted: false
                        }
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(mfgTypeModuleName))).catch((err) => {
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

    // Retrieve Where Used MFG Code(BOM/Part) List
    // POST: /api/v1/mfgcode/retriveMfgCodeList
    // @return list of Where Used MFG Code(BOM/Part)
    retriveWhereUsedMFGList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (req.body) {
            return sequelize.query('CALL Sproc_RetrieveWhereUsedMFGCodeList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pMFGCode,:pIsManufacture)', {
                replacements: {
                    ppageIndex: req.body.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pMFGCode: req.body.mfgCode,
                    pIsManufacture: req.body.isManufacturer ? true : false
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                mfgCodeList: _.values(response[1]),
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
    supplierManufacturerMapping: (req, res, t) => {
        const {
            SupplierMappingMst,
            MfgCodeMst
        } = req.app.locals.models;
        if (req.body.manufacturerMapping) {
            if (req.body.id) {
                const MFRIds = _.map(_.filter(req.body.manufacturerMapping, item => !item.id), 'refMfgCodeMstID');
                return SupplierMappingMst.findAll({
                    where: {
                        supplierID: req.body.id,
                        refMfgCodeMstID: {
                            [Op.in]: MFRIds
                        },
                        isCustMapping: DATA_CONSTANT.MAPPING_TYPE.MFR
                    },
                    include: [{
                        model: MfgCodeMst,
                        as: 'MfgCodeMstManufacturer',
                        attributes: ['id', 'mfgCode', 'mfgName']
                    }]
                }).then((response) => {
                    if (response && response.length > 0) {
                        return Promise.resolve({
                            isDuplicateMapping: response
                        });
                    } else {
                        return SupplierMappingMst.findAll({
                            where: {
                                supplierID: req.body.id,
                                isCustMapping: DATA_CONSTANT.MAPPING_TYPE.MFR
                            }
                        }).then((result) => {
                            const createMapping = _.filter(req.body.manufacturerMapping, item => !item.id);
                            const removeMapping = _.difference(_.map(result, 'id'), _.map(_.filter(req.body.manufacturerMapping, item => item.id), 'id'));
                            const mappingPromise = [];
                            if (createMapping.length > 0) {
                                const createList = _.map(createMapping, item => ({
                                    supplierID: req.body.id,
                                    refMfgCodeMstID: item.refMfgCodeMstID,
                                    isCustMapping: DATA_CONSTANT.MAPPING_TYPE.MFR
                                }));
                                COMMON.setModelCreatedArrayFieldValue(req.user, createList);
                                mappingPromise.push(SupplierMappingMst.bulkCreate(createList, {
                                    fields: supplierMappingInputFields,
                                    transaction: t
                                }).then(() => STATE.SUCCESS).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                            }
                            if (removeMapping.length > 0) {
                                const deleteObj = {
                                    isDeleted: 1
                                };
                                const whereClause = {
                                    supplierID: req.body.id,
                                    id: {
                                        [Op.in]: removeMapping
                                    },
                                    isCustMapping: DATA_CONSTANT.MAPPING_TYPE.MFR
                                };
                                COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObj);
                                mappingPromise.push(SupplierMappingMst.update(deleteObj, {
                                    where: whereClause,
                                    fields: supplierMappingInputFields,
                                    transaction: t
                                }).then(() => STATE.SUCCESS).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                            }
                            return Promise.all(mappingPromise).then((resp) => {
                                const resultSet = _.filter(resp, item => item === STATE.FAILED);
                                if (resultSet && resultSet.length > 0) {
                                    return Promise.resolve(false);
                                } else {
                                    return Promise.resolve(true);
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
                        });
                    }
                });
            } else {
                const createList = _.map(req.body.manufacturerMapping, item => ({
                    supplierID: req.body.supplierID,
                    refMfgCodeMstID: item.refMfgCodeMstID,
                    isCustMapping: DATA_CONSTANT.MAPPING_TYPE.MFR
                }));
                COMMON.setModelCreatedArrayFieldValue(req.user, createList);
                return SupplierMappingMst.bulkCreate(createList, {
                    fields: supplierMappingInputFields,
                    transaction: t
                }).then(() => Promise.resolve(true)).catch((err) => {
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
            }
        } else {
            return Promise.resolve(true);
        }
    },
    // Retrive list of custom components for disapproved supplier component
    // POST : /api/v1/supplier/retrieveCustomComponentNotAddedList
    // @return list of not added custom components for disapproved supplier component
    retrieveCustomComponentNotAddedList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            return sequelize.query('CALL Sproc_RetrieveCustomComponentNotAddedList (:ppageIndex,:precordPerPage,:pSupplierID,:pSearch,:pMappedComponents)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pSupplierID: req.body.supplierID,
                    pSearch: req.body.componentSearch || null,
                    pMappedComponents: req.body.mappedComponent && JSON.parse(req.body.mappedComponent) ? 1 : 0
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
    // Retrive list of custom components for disapproved supplier component
    // POST : /api/v1/supplier/retrieveCustomComponentAddedList
    // @return list of added custom components for disapproved supplier component
    retrieveCustomComponentAddedList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            return sequelize.query('CALL Sproc_RetrieveCustomComponentAddedList (:ppageIndex,:precordPerPage,:pSupplierID,:pSearch)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pSupplierID: req.body.supplierID,
                    pSearch: req.body.componentSearch || null
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
    // validate imported data for Customer/Supplier/Manufacturer
    // POST:/api/v1/mfgcode/validateImportMFGDetails
    // @return Check Customer/Supplier/Manufacturer exist or not
    validateImportMFGDetails: (req, res) => {
        if (req.body) {
            const mfgImportedDetail = req.body.mfgImportedDetail;
            const mfgType = mfgImportedDetail[0].mfgType;

            const mfgPromises = [];
            const allAliasList = _.countBy(_.flatten(_.map(mfgImportedDetail, item => item.mfgAlias.map(name => name.toLowerCase()))));
            _.each(mfgImportedDetail, (mfg) => {
                const aliasListCount = _.countBy(mfg.mfgAlias.map(alias => alias && alias.toLowerCase().trim()));
                const duplicateRecord = [];
                Object.keys(aliasListCount).forEach((element) => {
                    if (aliasListCount[element] < allAliasList[element]) {
                        const aliasDetail = mfg.mfgAlias.find(alias => alias && (alias.toLowerCase().trim() === element));
                        if (aliasDetail) {
                            duplicateRecord.push(aliasDetail);
                        }
                    }
                });
                mfg.message = mfg.message ? mfg.message : '';
                if (duplicateRecord.length > 0) {
                    mfg.status = STATE.FAILED;
                    mfg.message += COMMON.stringFormat(MESSAGE_CONSTANT.MFG.DUPLICATE_MFR_RECORD_IN_FILE.message, duplicateRecord.toString());
                }
                mfgPromises.push(module.exports.getMFGDetailDetail(req, mfg.mfgAlias, mfgType).then((mfgDet) => {
                    if (mfgDet.mfgCodeID) {
                        mfg.mfgCodeID = mfgDet.mfgCodeID;
                        mfg.mfgName = mfgDet.mfgName;
                        mfg.alreadyAddedMFGCount = 1;
                        return module.exports.getMFGdetailWithShippingSalesFOB(req, mfg).then(response => response);
                    } else {
                        return module.exports.getMFGdetailWithShippingSalesFOB(req, mfg).then(response => response);
                    }
                }));
            });
            return Promise.all(mfgPromises).then((resp) => {
                var results = _.filter(resp, mfgstatus => mfgstatus.status === STATE.FAILED);
                const alreadAddedCount = _.sumBy(resp, item => item.alreadyAddedMFGCount);
                if (results.length > 0) {
                    const errorData = {
                        errorRec: results,
                        alreadAddedCount: alreadAddedCount
                    };
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: null,
                        err: null,
                        data: errorData
                    });
                } else {
                    const existingCustomer = _.filter(resp, a => a.mfgCodeID);
                    if (existingCustomer.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: null,
                            err: null,
                            data: {
                                Data: resp,
                                ExistingData: existingCustomer
                            }
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: null,
                            err: null,
                            data: {
                                Data: resp,
                                ExistingData: existingCustomer
                            }
                        });
                    }
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

    getMFGdetailWithShippingSalesFOB: (req, mfg) => {
        const mfgDetailPromises = [
            module.exports.getSalesCommissionToDetail(req, mfg.salesCommissionToName),
            module.exports.getShippingMethodDetail(req, mfg.ShippingMethod),
            module.exports.getFOBDetail(req, mfg.FOB)
        ];
        if (mfg.BillingAddress && mfg.ShippingAddress) {
            mfgDetailPromises.push(module.exports.getCountryDetail(req, mfg.BillingAddress.CountryName));
            mfgDetailPromises.push(module.exports.getCountryDetail(req, mfg.ShippingAddress.CountryName));
        }
        return Promise.all(mfgDetailPromises).then((respmfgDetailPromises) => {
            const responseSalesCommission = respmfgDetailPromises[0];
            const responseShippingMethod = respmfgDetailPromises[1];
            const responseFOB = respmfgDetailPromises[2];

            if (responseSalesCommission.salesCommissionTo) {
                mfg.salesCommissionTo = responseSalesCommission.salesCommissionTo;
            } else if (responseSalesCommission.status === STATE.FAILED) {
                mfg.status = responseSalesCommission.status;
                mfg.message += responseSalesCommission.message;
            }
            if (responseShippingMethod.shippingMethodID) {
                mfg.shippingMethodID = responseShippingMethod.shippingMethodID;
            } else if (responseShippingMethod.status === STATE.FAILED) {
                mfg.status = responseShippingMethod.status;
                mfg.message += responseShippingMethod.message;
            }
            if (responseFOB.freeOnBoardId) {
                mfg.freeOnBoardId = responseFOB.freeOnBoardId;
            } else if (responseFOB.status === STATE.FAILED) {
                mfg.status = responseFOB.status;
                mfg.message += responseFOB.message;
            }
            if (mfg.BillingAddress && mfg.ShippingAddress) {
                const resBillingCountry = respmfgDetailPromises[3];
                const resShippingCountry = respmfgDetailPromises[4];
                if (resBillingCountry.countryID) {
                    mfg.BillingAddress.countryID = resBillingCountry.countryID;
                } else if (resBillingCountry.status === STATE.FAILED) {
                    mfg.status = resBillingCountry.status;
                    mfg.message += resBillingCountry.message;
                }
                if (resShippingCountry.countryID) {
                    mfg.ShippingAddress.countryID = resShippingCountry.countryID;
                } else if (resShippingCountry.status === STATE.FAILED) {
                    mfg.status = resShippingCountry.status;
                    mfg.message += resShippingCountry.message;
                }
            }
            return mfg;
        });
    },

    // Get MfgCode detail
    // @return MFGCode obj
    getMFGDetailDetail: (req, manufacturerName, type) => {
        const {
            MfgCodeMst,
            MfgCodeAlias
        } = req.app.locals.models;
        var mfgObj = {
            mfgCodeID: null,
            mfgCode: null,
            mfgName: null
        };
        return MfgCodeAlias.findOne({
            where: {
                alias: manufacturerName,
                isDeleted: false
            },
            attributes: ['id', 'alias', 'mfgcodeId'],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                where: {
                    deletedAt: null,
                    mfgType: type
                },
                attributes: ['id', 'mfgCode', 'mfgName', 'mfgType']
            }]
        }).then((mfgCodeAlias) => {
            if (mfgCodeAlias && mfgCodeAlias.mfgCodemst && mfgCodeAlias.mfgCodemst.mfgType === type) {
                mfgObj.mfgCodeID = mfgCodeAlias.mfgcodeId;
                mfgObj.mfgCode = mfgCodeAlias.mfgCodemst.mfgCode;
                mfgObj.mfgName = mfgCodeAlias.mfgCodemst.mfgName;
            }
            mfgObj.AliasNotExists = !mfgCodeAlias ? true : false;
            return mfgObj;
        }).catch((err) => {
            console.trace();
            mfgObj.status = STATE.FAILED;
            console.error(err);
            return mfgObj;
        });
    },
    // Get Sales Commission to Detail
    getSalesCommissionToDetail: (req, salesCommissionToName) => {
        const {
            Employee
        } = req.app.locals.models;
        if (salesCommissionToName) {
            return Employee.findOne({
                where: {
                    initialName: (salesCommissionToName.trim()).toUpperCase(),
                    isActive: true
                }
            }).then((emp) => {
                if (emp) {
                    return {
                        salesCommissionTo: emp.id
                    };
                } else {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.MFR_IMPORT.SALES_COMMISSION_TO_INVALID
                    };
                }
            });
        } else {
            return Promise.resolve({
                status: STATE.SUCCESS
            });
        }
    },
    // Get FOB detail
    getFOBDetail: (req, FOB) => {
        const {
            FreeOnBoardMst
        } = req.app.locals.models;
        if (FOB) {
            return FreeOnBoardMst.findOne({
                where: {
                    name: (FOB.trim())
                },
                attributes: ['id', 'name']
            }).then((fob) => {
                if (fob) {
                    return {
                        freeOnBoardId: fob.id
                    };
                } else {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.MFR_IMPORT.FOB_INVALID
                    };
                }
            });
        } else {
            return {
                status: STATE.SUCCESS
            };
        }
    },
    // get Country Detail
    getCountryDetail: (req, Country) => {
        const {
            CountryMst
        } = req.app.locals.models;
        if (Country) {
            return CountryMst.findOne({
                where: {
                    countryName: (Country.trim())
                },
                attributes: ['countryID', 'countryName']
            }).then((resCountry) => {
                if (resCountry) {
                    return {
                        countryID: resCountry.countryID
                    };
                } else {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.MFR_IMPORT.COUNTRY_INVALID
                    };
                }
            });
        } else {
            return {
                status: STATE.SUCCESS
            };
        }
    },
    // get Shipping method Detail
    getShippingMethodDetail: (req, shippingMethod) => {
        const {
            GenericCategory
        } = req.app.locals.models;
        if (shippingMethod) {
            return GenericCategory.findOne({
                where: {
                    gencCategoryName: (shippingMethod.trim()),
                    isActive: true,
                    categoryType: 'Shipping Methods'
                },
                attributes: ['gencCategoryID', 'gencCategoryName']
            }).then((resShippingMethod) => {
                if (resShippingMethod) {
                    return {
                        shippingMethodID: resShippingMethod.gencCategoryID
                    };
                } else {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.MFR_IMPORT.SHIPPING_METHOD_INVALID
                    };
                }
            });
        } else {
            return {
                status: STATE.SUCCESS
            };
        }
    },
    // Save Mfg Code Billing/Shipping Address
    saveAddressDetail: (req, Address, t) => {
        const {
            CustomerAddresses
        } = req.app.locals.models;
        Address.isDeleted = false;
        Address.createdBy = req.user.id;
        Address.updatedBy = req.user.id;
        Address.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
        Address.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
        return CustomerAddresses.create(Address, {
            fields: ['customerId', 'personName', 'contact', 'street1', 'street2', 'street3', 'city', 'state', 'countryID', 'postcode', 'addressType', 'division', 'createdBy',
                'updatedBy', 'phExtension', 'companyName', 'email', 'contactCountryCode', 'isDefault', 'faxNumber', 'faxCountryCode', 'systemGenerated', 'isActive'
            ],
            transaction: t
        });
    },
    // save manufacturer alias details
    saveMFGAlias: (req, mfg, type, t) => {
        const { MfgCodeAlias } = req.app.locals.models;
        var mfgAliasPromises = [];
        mfg.mfgAlias = _.uniq(mfg.mfgAlias.map(alias => alias && alias.toLowerCase()));
        _.each(mfg.mfgAlias, (mfgAliasDet) => {
            // eslint-disable-next-line consistent-return
            mfgAliasPromises.push(module.exports.getMFGDetailDetail(req, mfgAliasDet.trim(), type).then((mfgDet) => {
                const mfgObj = {};
                if (!mfgDet.mfgCodeID || (mfgDet.mfgCodeID && parseInt(mfgDet.mfgCodeID) === parseInt(mfg.mfgCodeID))) {
                    if (mfgDet.AliasNotExists) {
                        const maxAliasNameLength = DATA_CONSTANT.MFR_MAX_LENGTH.MFRNAME;
                        if (mfgAliasDet.length > maxAliasNameLength) {
                            mfgObj.status = STATE.FAILED;
                            mfgObj.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.MAXLENGTH, mfgAliasDet, 'Name', mfgAliasDet.length, maxAliasNameLength);
                            return mfgObj;
                        } else {
                            const objAlias = {
                                mfgcodeId: mfg.mfgCodeID,
                                alias: mfgAliasDet.toUpperCase().trim(),
                                mfgType: type,
                                isDeleted: false,
                                createdBy: req.user.id,
                                updatedBy: req.user.id,
                                createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                            };
                            return MfgCodeAlias.create(objAlias, {
                                fields: ['mfgcodeId', 'alias', 'mfgType', 'isDeleted', 'createdBy', 'updatedBy', 'createByRoleId', 'updateByRoleId'],
                                transaction: t
                            }).then(() => {
                                mfgObj.status = STATE.SUCCESS;
                                mfgObj.isAddedAlias = false;
                                return mfgObj;
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                mfgObj.status = STATE.FAILED;
                                mfgObj.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfgAliasDet, 'Alias');
                                return mfgObj;
                            });
                        }
                    } else if (mfgDet.status === STATE.FAILED) {
                        mfgObj.status = STATE.FAILED;
                        mfgObj.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.RECORD_NOT_CREATED, mfgAliasDet, 'Alias');
                        return mfgObj;
                    } else {
                        mfgObj.status = STATE.SUCCESS;
                        mfgObj.isAliasExist = false;
                        return mfgObj;
                    }
                } else if (mfgDet.mfgCodeID && parseInt(mfgDet.mfgCodeID) === parseInt(mfg.mfgCodeID)) {
                    mfgObj.status = STATE.FAILED;
                    mfgObj.message = COMMON.stringFormat(MESSAGE_CONSTANT.MFR_IMPORT.MFR_WRONG_MAPP, mfgAliasDet, mfgDet.mfgCode);
                    return mfgObj;
                }
            }));
        });
        return Promise.all(mfgAliasPromises).then((resp) => {
            if (_.find(resp, mfgstatus => mfgstatus.status === STATE.FAILED)) {
                mfg.status = STATE.FAILED;
                mfg.message = _.map((_.filter(resp, failStatus => failStatus.status === STATE.FAILED)), 'message').join();
                return mfg;
            } else {
                const skipAliasCount = resp.filter(item => item.isAliasExist === true);
                mfg.skipAliasCount = Array.isArray(skipAliasCount) ? skipAliasCount.length : 0;
                mfg.status = STATE.SUCCESS;
                return mfg;
            }
        });
    },

    // // save Remit To Details
    // // POST : /api/v1/suppliers/saveRemitToDetails
    // saveRemitToDetails: (req, res) => {
    //     const {
    //         MfgCodeMst,
    //         sequelize
    //     } = req.app.locals.models;

    //     if (req.body && req.body.id) {
    //         /* set type of module request */
    //         return sequelize.transaction().then((t) => {
    //             const mfgTypeModuleName = module.exports.getMFGTypeModuleName(req.body.fromPageRequest);
    //             COMMON.setModelUpdatedByFieldValue(req);
    //             return MfgCodeMst.update(req.body, {
    //                 where: {
    //                     id: req.body.id
    //                 },
    //                 fields: inputFields,
    //                 transaction: t
    //             }).then(response => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(mfgTypeModuleName)))).catch((err) => {
    //                 console.trace();
    //                 console.error(err);
    //                 if (!t.finished) {
    //                     t.rollback();
    //                 }
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                     messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                     err: err,
    //                     data: null
    //                 });
    //             });
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                 messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                 err: err,
    //                 data: null
    //             });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
    //             messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
    //             err: null,
    //             data: null
    //         });
    //     }
    // },
    saveMFGResponse: (req, res, resp, newAddedAlias, mfgTypeModuleName, addedContPersonDet, t) => t.commit().then(() => {
        if (resp && resp.length > 0 && newAddedAlias.length > 0 && resp[0]) {
            /* remove and update added alias*/
            _.remove(req.body.alias, item => !item.id);
            _.map(resp[0], (item) => {
                req.body.alias.push(item.dataValues);
            });
        }
        if (addedContPersonDet) {
            module.exports.managePrimaryContPersonInElastic(req, res, addedContPersonDet);
        }
        // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
        req.params = {
            mfgId: req.body.id
        };
        // Add MFGCode master Detail into Elastic Search Engine for Enterprise Search
        // Need to change timeout code due to trasaction not get updated record
        setTimeout(() => {
            EnterpriseSearchController.manageMFGCodeDetailInElastic(req);
        }, 2000);
        if (req.body.isSetMFGAsCustomerAction) {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.CREATED(mfgTypeModuleName));
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(mfgTypeModuleName));
        }
    }),
    getCustomerSystemID: (req, id, iscustofDisty, type, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetCustomerSystemID (:pcustomerID,:piscustordist,:pmfgtype)', {
            replacements: {
                pcustomerID: id,
                piscustordist: iscustofDisty || false,
                pmfgtype: type || null
            },
            transaction: t
        }).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Get List of Customer (or Supplier) Comments
    // POST : /api/v1/mfgcode/getAllCustomerComment
    // @return retrieve list of Customer (or Supplier) Comments
    getAllCustomerComment: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveCustomerCommentList (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pMFGId)', {
                replacements: {
                    pPageIndex: req.body.Page,
                    pRecordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pMFGId: req.body.MFGId || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    CustomerCommentList: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
                }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    {
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
    // Add Customer (or Supplier) Comment
    // POST : /api/v1/mfgcode/addCustomerComment
    // @return status of add record
    addCustomerComment: (req, res) => {
        const {
            MfgCodeMstCommentDet,
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            let customerCommentList = req.body.customerCommentList ? req.body.customerCommentList : [];
            let finalCustomerCommentList = [];
            const whareClaus = {
                mfgCodeId: req.body.mfgCodeId,
                isDeleted: false
            };

            const insertRecord = (t) => {
                const commentList = _.map(finalCustomerCommentList, data => ({
                    mfgCodeId: req.body.mfgCodeId,
                    inspectionRequirementId: data.inspectionRequirementId
                }));
                req.body.commentList = commentList;
                COMMON.setModelCreatedArrayFieldValue(req.user, req.body.commentList);
                MfgCodeMstCommentDet.bulkCreate(req.body.commentList, {
                    fields: customerCommentInputFields,
                    transaction: t
                }).then(() => {
                    t.commit();
                    if (req.body.customerType === DATA_CONSTANT.CUSTOMER_TYPE.SUPPLIER) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(CustomerCommentModuleName.Supplier));
                    }
                    else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(CustomerCommentModuleName.Customer));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            };

            // If Merge the record (Duplicate record not ignore and add new record)
            if (req.body.isMerge) {
                return sequelize.transaction().then((t) => {
                    MfgCodeMstCommentDet.findAll({
                        where: whareClaus,
                        attributes: ['id', 'mfgCodeId', 'inspectionRequirementId']
                    }).then((response) => {
                        if (response && response.length > 0) {
                            const oldCustomerCommentList = response;
                            const newCustomerCommentList = customerCommentList;
                            _.each(newCustomerCommentList, (data) => {
                                const findObj = _.find(oldCustomerCommentList, item => item.inspectionRequirementId === data.inspectionRequirementId);
                                if (!findObj) {
                                    finalCustomerCommentList.push(data);
                                }
                            });
                        } else {
                            finalCustomerCommentList = customerCommentList;
                        }
                        insertRecord(t);
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
                // If Override the record (Replace all old entry with new entry)
                return sequelize.transaction().then((t) => {
                    COMMON.setModelDeletedByFieldValue(req);
                    MfgCodeMstCommentDet.update(req.body, {
                        where: whareClaus,
                        fields: ['isDeleted', 'deletedAt', 'deletedBy', 'deleteByRoleId', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                        transaction: t
                    }).then(() => {
                        finalCustomerCommentList = customerCommentList;
                        insertRecord(t);
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
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Remove Customer (or Supplier) Comment
    // POST : /api/v1/mfgcode/deleteCustomerComment
    // @return status of deleted record
    deleteCustomerComment: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.MfgCodeMstCommentDet.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    if (req.body.objIDs.customerType === DATA_CONSTANT.CUSTOMER_TYPE.SUPPLIER) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(CustomerCommentModuleName.Supplier));
                    }
                    else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(CustomerCommentModuleName.Customer));
                    }
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
    // Get  Customer (or Supplier) Comments by id
    // POST : /api/v1/mfgcode/getCustomerCommentsById
    // @return retrieve  Customer (or Supplier) Comments by id
    getCustomerCommentsById: (req, res) => {
        const {
            sequelize,
            MfgCodeMst,
            MfgCodeMstCommentDet,
            InspectionMst
        } = req.app.locals.models;

        if (req.body) {
            return MfgCodeMst.findOne({
                where: {
                    id: req.body.mfgCodeId,
                    isDeleted: false
                },
                attributes: ['id'],
                order: [[sequelize.col('mfgcodemst_comment_det->inspectionMst.requirement'), 'ASC']],
                include: [{
                    model: MfgCodeMstCommentDet,
                    where: {
                        mfgCodeId: req.body.mfgCodeId,
                        isDeleted: false
                    },
                    as: 'mfgcodemst_comment_det',
                    attributes: ['id', 'inspectionRequirementId'],
                    required: false,
                    include: [{
                        model: InspectionMst,
                        where: {
                            isActive: true
                        },
                        as: 'inspectionMst',
                        attributes: ['id', 'requirement'],
                        required: true
                    }]
                }]
            }).then((commentList) => {
                let newComment = null;
                let systemGenComment = [];
                let manualComment = [];
                let commentNumber = 1;
                if (commentList) {
                    if (commentList.mfgcodemst_comment_det && commentList.mfgcodemst_comment_det.length > 0) {
                        _.map(commentList.mfgcodemst_comment_det, (data) => {
                            if (data.inspectionMst.id < 0) {
                                systemGenComment.push(data.inspectionMst.requirement);
                            } else {
                                manualComment.push(data.inspectionMst.requirement);
                            }
                        });

                        if (systemGenComment && systemGenComment.length > 0) {
                            _.map(systemGenComment, (requirement) => {
                                if (newComment) {
                                    newComment = `${newComment}\r\n${commentNumber} ${requirement}`;
                                } else {
                                    newComment = `${commentNumber} ${requirement}`;
                                }
                                commentNumber++;
                            })
                        }

                        if (manualComment && manualComment.length > 0) {
                            _.map(manualComment, (requirement) => {
                                if (newComment) {
                                    newComment = `${newComment}\r\n${commentNumber} ${requirement}`;
                                } else {
                                    newComment = `${commentNumber} ${requirement}`;
                                }
                                commentNumber++;
                            })
                        }
                    }
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { fetchedCustomerComment: newComment }, null);

            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                );
            })
        }
        else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }

    },
    // Get  Customer (or Supplier) Comments count
    // GET : /api/v1/mfgcode/getCustomerCommentsCount
    // @return retrieve  Customer (or Supplier) Comments count
    getCustomerCommentsCount: (req, res) => {
        const {
            MfgCodeMstCommentDet
        } = req.app.locals.models;

        if (req.query) {
            MfgCodeMstCommentDet.count({
                where: {
                    mfgCodeId: req.query.mfgCodeId,
                    isDeleted: false
                }
            }).then((commentCount) => {
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    totalCommentsCount: commentCount
                }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                );
            })
        }
        else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }

    },

    // Save customer mapping fields data from the supplier manage transaction page
    saveSupplierCustomerMapping: (req, res, t) => {
        const {
            SupplierMappingMst,
            MfgCodeMst
        } = req.app.locals.models;
        if (req.body.customerMapping) {
            if (req.body.id) {
                const CustomerIds = _.map(_.filter(req.body.customerMapping, item => !item.id), 'refMfgCodeMstID');
                return SupplierMappingMst.findAll({
                    where: {
                        supplierID: req.body.id,
                        refMfgCodeMstID: {
                            [Op.in]: CustomerIds
                        },
                        isCustMapping: DATA_CONSTANT.MAPPING_TYPE.CUSTOMER
                    },
                    include: [{
                        model: MfgCodeMst,
                        as: 'MfgCodeMstManufacturer',
                        attributes: ['id', 'mfgCode', 'mfgName']
                    }]
                }).then((response) => {
                    if (response && response.length > 0) {
                        return Promise.resolve({
                            isDuplicateMapping: response,
                            isCustomerMapping: true
                        });
                    } else {
                        return SupplierMappingMst.findAll({
                            where: {
                                supplierID: req.body.id,
                                isCustMapping: DATA_CONSTANT.MAPPING_TYPE.CUSTOMER
                            }
                        }).then((result) => {
                            const createMapping = _.filter(req.body.customerMapping, item => !item.id);
                            const removeMapping = _.difference(_.map(result, 'id'), _.map(_.filter(req.body.customerMapping, item => item.id), 'id'));
                            const mappingPromise = [];
                            if (createMapping.length > 0) {
                                const createList = _.map(createMapping, item => ({
                                    supplierID: req.body.id,
                                    refMfgCodeMstID: item.refMfgCodeMstID,
                                    isCustMapping: DATA_CONSTANT.MAPPING_TYPE.CUSTOMER
                                }));
                                COMMON.setModelCreatedArrayFieldValue(req.user, createList);
                                mappingPromise.push(SupplierMappingMst.bulkCreate(createList, {
                                    fields: supplierMappingInputFields,
                                    transaction: t
                                }).then(() => STATE.SUCCESS).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                            }
                            if (removeMapping.length > 0) {
                                const deleteObj = {
                                    isDeleted: 1
                                };
                                const whereClause = {
                                    supplierID: req.body.id,
                                    id: {
                                        [Op.in]: removeMapping
                                    },
                                    isCustMapping: DATA_CONSTANT.MAPPING_TYPE.CUSTOMER
                                };
                                COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObj);
                                mappingPromise.push(SupplierMappingMst.update(deleteObj, {
                                    where: whereClause,
                                    fields: supplierMappingInputFields,
                                    transaction: t
                                }).then(() => STATE.SUCCESS).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                            }
                            return Promise.all(mappingPromise).then((resp) => {
                                const resultSet = _.filter(resp, item => item === STATE.FAILED);
                                if (resultSet && resultSet.length > 0) {
                                    return Promise.resolve(false);
                                } else {
                                    return Promise.resolve(true);
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
                        });
                    }
                });
            } else {
                const createList = _.map(req.body.customerMapping, item => ({
                    supplierID: req.body.supplierID,
                    refMfgCodeMstID: item.refMfgCodeMstID,
                    isCustMapping: DATA_CONSTANT.MAPPING_TYPE.CUSTOMER
                }));
                COMMON.setModelCreatedArrayFieldValue(req.user, createList);
                return SupplierMappingMst.bulkCreate(createList, {
                    fields: supplierMappingInputFields,
                    transaction: t
                }).then(() => Promise.resolve(true)).catch((err) => {
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
            }
        } else {
            return Promise.resolve(true);
        }
    },

    // Get mapped customer list by supplier id 
    // POST : /api/v1/supplier/getCustomerMappingList
    // @return retrieve Mapped Customer By Supplier
    getCustomerMappingList: async (req, res) => {
        try {
            const {
                SupplierMappingMst,
                MfgCodeMst,
                sequelize
            } = req.app.locals.models;

            const mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                type: sequelize.QueryTypes.SELECT
            });

            const response = await SupplierMappingMst.findAll({
                where: {
                    supplierID: req.body.id,
                    isCustMapping: DATA_CONSTANT.MAPPING_TYPE.CUSTOMER
                },
                include: [{
                    model: MfgCodeMst,
                    as: 'MfgCodeMstCustomer',
                    attributes: ['id', 'mfgCode', 'mfgName', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('MfgCodeMstCustomer.mfgCode'), sequelize.col('MfgCodeMstCustomer.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']]
                }]
            });

            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },

    // Get Standards list by supplier id 
    // POST : /api/v1/supplier/getStandardbySupplier
    // @return retrieve all standards By Supplier
    getStandardbySupplier: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize
                .query('CALL Sproc_GetAllStandardsByMfgCodeID(:pMfgCodeID)', {
                    replacements: {
                        pMfgCodeID: req.body.id
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

    // Add supplier standard details
    // POST : /api/v1/supplier/saveStandards
    saveStandards: (req, res) => {
        const {
            MfgCodeStandard,
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            const standardPromise = [];

            return sequelize.transaction().then((t) => {
                if (req.body.updateRecords.length > 0) {
                    _.each(req.body.updateRecords, (standard) => {
                        COMMON.setModelUpdatedByObjectFieldValue(req.user, standard)
                        standardPromise.push(
                            MfgCodeStandard.update(standard, {
                                where: {
                                    id: standard.id
                                },
                                fields: supplierStandardsInputFields,
                                transaction: t
                            }).then(() => STATE.SUCCESS)
                                .catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                })
                        );
                    });
                }
                if (req.body.saveRecords.length > 0) {
                    _.each(req.body.saveRecords, (standard) => {
                        COMMON.setModelCreatedObjectFieldValue(req.user, standard)
                        standardPromise.push(
                            MfgCodeStandard.create(standard, {
                                fields: supplierStandardsInputFields,
                                transaction: t
                            }).then(() => STATE.SUCCESS)
                                .catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                })
                        );
                    });
                }
                if (req.body.deleteRecords.length > 0) {
                    const deleteObj = {};
                    COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObj)

                    standardPromise.push(
                        MfgCodeStandard.update(deleteObj, {
                            where: {
                                id: {
                                    [Op.in]: req.body.deleteRecords
                                }
                            },
                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedAt', 'updatedBy', 'deleteByRoleId', 'updateByRoleId'],
                            transaction: t
                        }).then(() => STATE.SUCCESS)
                            .catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            })
                    );
                }
                return Promise.all(standardPromise).then((resp) => {
                    if (_.find(resp, sts => (sts === STATE.FAILED))) {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
                        });
                    } else {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(StandardModuleName)));
                    }
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // retrieve manufacturer supplier list having any custom part
    // POST : /api/v1/customer/CheckAnyCustomPartSupplierMFRMapping
    CheckAnyCustomPartSupplierMFRMapping: (req, res) => {
        const {
            MfgCodeMst,
            SupplierMappingMst
        } = req.app.locals.models;
        const whereClause = {
            refMfgCodeMstID: req.body.mfgCodeID,
            isCustMapping: DATA_CONSTANT.MAPPING_TYPE.MFR,
            isDeleted: false
        };
        return SupplierMappingMst.count({
            where: whereClause,
            required: true,
            include: [{
                model: MfgCodeMst,
                as: 'MfgCodeMstSupplier',
                where: { isDeleted: false, supplierMFRMappingType: DATA_CONSTANT.SUPPLIERMFRMAPPINGTYPE.StrictlyCustomComponent.key },
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
    },
};