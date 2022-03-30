/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { Op } = require('sequelize');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const _ = require('lodash');

const inputFields = [
    'customerId',
    'street1',
    'street2',
    'street3',
    'city',
    'state',
    'countryID',
    'postcode',
    'addressType',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'companyName',
    'isDefault',
    'systemGenerated',
    'bankRemitToName',
    'latitude',
    'longitude',
    'additionalComment',
    'defaultContactPersonID',
    'shippingMethodID',
    'carrierID',
    'carrierAccount',
    'isActive',
    'defaultIntermediateAddressID',
    'defaultIntermediateContactPersonID'
];

module.exports = {
    // Get List address of customer by customer ID and address type
    // GET : /api/v1/customerAddressList
    // @param {customerId} int
    // @param {addressType} char
    // @return List of customer Address
    retriveCustomerAddressList: async (req, res) => {
        if (req.body && req.body.customerId && req.body.addressType && req.body.refTableName) {
            const { CustomerAddresses, CountryMst, ContactPerson, sequelize, GenericCategory } = req.app.locals.models;

            try {
                var cpNamefunDetail = await sequelize.query('Select fun_getContPersonNameDisplayFormat() as contPersonNameFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }

            const whereClause = {
                customerId: req.body.customerId,
                addressType: {
                    [Op.in]: [req.body.addressType]
                }
            };
            if (req.body.addressID) {
                whereClause.id = req.body.addressID;
            }
            if (req.body.onlyActiveActive) {
                whereClause.isActive = true;
            }
            if (req.body.onlyDefault) {
                whereClause.isDefault = true;
            }
            return await CustomerAddresses.findAll({
                where: whereClause,
                order: [
                    ['isDefault', 'DESC'],
                    ['id', 'DESC'],
                    ['isActive', 'DESC'],
                ],
                include: [
                    {
                        model: CountryMst,
                        as: 'countryMst',
                        attributes: ['countryName']
                    },
                    {
                        model: ContactPerson,
                        as: 'contactPerson',
                        attributes: ['personId', 'firstName', 'middleName', 'lastName', 'email', 'division', 'phoneNumber', 'refTransID', 'title', 'refTableName', 'isActive', 'isPrimary', 'isDefault', [sequelize.fn('fun_GetFormattedContactPersonName', sequelize.col('contactPerson.firstName'), sequelize.col('contactPerson.middleName'), sequelize.col('contactPerson.lastName'), cpNamefunDetail[0].contPersonNameFormat), 'personFullName'], [sequelize.fn('fun_convertJsonEmailToCommaSepList', sequelize.col('contactPerson.email')), 'emailList'], [sequelize.fn('fun_getCategoryWisePhonesFromJsonList', sequelize.col('ContactPerson.phoneNumber')), 'phoneList']],
                        where: {
                            refTransID: req.body.customerId,
                            refTableName: req.body.refTableName,
                            isDeleted: false
                        },
                        required: false
                    },
                    {
                        model: GenericCategory,
                        as: 'shippingMethod',
                        attributes: ['gencCategoryName', 'gencCategoryCode', 'carrierID'],
                        required: false
                    },
                    {
                        model: GenericCategory,
                        as: 'Carrier',
                        attributes: ['gencCategoryName', 'gencCategoryCode'],
                        required: false
                    },
                    {
                        model: CustomerAddresses,
                        as: 'defaultIntmdCustomerAddresses',
                        where: {
                            isDeleted: false
                        },
                        attributes: ['id', 'customerId', 'companyName', 'isDefault', 'street1', 'street2', 'street3', 'city', 'state', 'countryID', 'postcode', 'addressType'],
                        required: false
                    },
                    {
                        model: ContactPerson,
                        as: 'defaultIntmdContactPerson',
                        attributes: ['personId', 'firstName', 'middleName', 'lastName', 'email', 'division', 'phoneNumber', 'refTransID', 'title', 'refTableName', 'isActive', 'isPrimary', 'isDefault', [sequelize.fn('fun_GetFormattedContactPersonName', sequelize.col('defaultIntmdContactPerson.firstName'), sequelize.col('defaultIntmdContactPerson.middleName'), sequelize.col('defaultIntmdContactPerson.lastName'), cpNamefunDetail[0].contPersonNameFormat), 'personFullName'], [sequelize.fn('fun_convertJsonEmailToCommaSepList', sequelize.col('defaultIntmdContactPerson.email')), 'emailList'], [sequelize.fn('fun_getCategoryWisePhonesFromJsonList', sequelize.col('defaultIntmdContactPerson.phoneNumber')), 'phoneList']],
                        where: {
                            refTransID: req.body.customerId,
                            refTableName: req.body.refTableName,
                            isDeleted: false
                        },
                        required: false
                    },
                ]
            }).then(addressList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, addressList, null)).catch((err) => {
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
    // Save Customer Address
    // POST : /api/v1/customer_addresses/saveCustomerAddresses
    // @return API response
    saveCustomerAddresses: (req, res) => {
        const {
            CustomerAddresses,
            sequelize
        } = req.app.locals.models;
        COMMON.setModelCreatedByFieldValue(req);
        const customerAddresses = req.body;
        const currentModuleName = DATA_CONSTANT.CUSTOMER_ADDRESSES_TYPE[customerAddresses.addressType];

        if (customerAddresses && customerAddresses.customerId) {
            return sequelize.transaction().then(t => CustomerAddresses.findOne({
                where: {
                    customerId: customerAddresses.customerId,
                    addressType: customerAddresses.addressType
                },
                fields: ['id'],
                transaction: t
            }).then((existsAddressesForType) => {
                /* if no any address created then set new address as default */
                if (!existsAddressesForType && (customerAddresses.addressType != DATA_CONSTANT.AddressType.IntermediateAddress.id && customerAddresses.addressType != DATA_CONSTANT.AddressType.RMAIntermediateAddress.id)) {
                    customerAddresses.isDefault = true;
                }

                return CustomerAddresses.create(customerAddresses, {
                    fields: inputFields,
                    transaction: t
                }).then((addresses) => {
                    const addressPromise = [];
                    if (customerAddresses.isCopyBillingAddress || customerAddresses.isCopyShippingAddress || customerAddresses.isCopyPayToInformation || customerAddresses.isCopyRMAShippingAddress) {
                        if (customerAddresses.isCopyBillingAddress) {
                            const copyAddresses = Object.assign({}, customerAddresses);
                            copyAddresses.addressType = COMMON.CUSTOMER_ADDRESS_TYPE.BillingAddress;
                            copyAddresses.defaultIntermediateAddressID = null;
                            copyAddresses.defaultIntermediateContactPersonID = null;
                            addressPromise.push(
                                CustomerAddresses.findOne({
                                    where: {
                                        customerId: copyAddresses.customerId,
                                        addressType: copyAddresses.addressType
                                    },
                                    fields: ['id'],
                                    transaction: t
                                }).then((existsAddressesForCopyType) => {
                                    /* if no any address created then set new address as default */
                                    copyAddresses.isDefault = existsAddressesForCopyType ? false : true;
                                    return CustomerAddresses.create(copyAddresses, {
                                        fields: inputFields,
                                        transaction: t
                                    }).then(() => STATE.SUCCESS).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return STATE.FAILED;
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                        }
                        if (customerAddresses.isCopyShippingAddress) {
                            const copyAddresses = Object.assign({}, customerAddresses);
                            copyAddresses.addressType = COMMON.CUSTOMER_ADDRESS_TYPE.ShippingAddress;
                            copyAddresses.defaultIntermediateAddressID = null;
                            copyAddresses.defaultIntermediateContactPersonID = null;
                            addressPromise.push(
                                CustomerAddresses.findOne({
                                    where: {
                                        customerId: copyAddresses.customerId,
                                        addressType: copyAddresses.addressType
                                    },
                                    fields: ['id'],
                                    transaction: t
                                }).then((existsAddressesForCopyType) => {
                                    /* if no any address created then set new address as default */
                                    copyAddresses.isDefault = existsAddressesForCopyType ? false : true;
                                    return CustomerAddresses.create(copyAddresses, {
                                        fields: inputFields,
                                        transaction: t
                                    }).then(() => STATE.SUCCESS).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return STATE.FAILED;
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                        }
                        if (customerAddresses.isCopyRMAShippingAddress) {
                            const copyAddresses = Object.assign({}, customerAddresses);
                            copyAddresses.addressType = COMMON.CUSTOMER_ADDRESS_TYPE.RMAShippingAddress;
                            copyAddresses.defaultIntermediateAddressID = null;
                            copyAddresses.defaultIntermediateContactPersonID = null;
                            addressPromise.push(
                                CustomerAddresses.findOne({
                                    where: {
                                        customerId: copyAddresses.customerId,
                                        addressType: copyAddresses.addressType
                                    },
                                    fields: ['id'],
                                    transaction: t
                                }).then((existsAddressesForCopyType) => {
                                    /* if no any address created then set new address as default */
                                    copyAddresses.isDefault = existsAddressesForCopyType ? false : true;
                                    copyAddresses.bankRemitToName = req.body.companyName;
                                    return CustomerAddresses.create(copyAddresses, {
                                        fields: inputFields,
                                        transaction: t
                                    }).then(() => STATE.SUCCESS).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return STATE.FAILED;
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                        }
                        if (customerAddresses.isCopyPayToInformation) {
                            const copyAddresses = Object.assign({}, customerAddresses);
                            copyAddresses.addressType = COMMON.CUSTOMER_ADDRESS_TYPE.PayToInformation;
                            copyAddresses.bankRemitToName = req.body.companyName;
                            copyAddresses.defaultIntermediateAddressID = null;
                            copyAddresses.defaultIntermediateContactPersonID = null;
                            addressPromise.push(
                                CustomerAddresses.findOne({
                                    where: {
                                        customerId: copyAddresses.customerId,
                                        addressType: copyAddresses.addressType
                                    },
                                    fields: ['id'],
                                    transaction: t
                                }).then((existsAddressesForCopyType) => {
                                    /* if no any address created then set new address as default */
                                    copyAddresses.isDefault = existsAddressesForCopyType ? false : true;
                                    return CustomerAddresses.create(copyAddresses, {
                                        fields: inputFields,
                                        transaction: t
                                    }).then(() => STATE.SUCCESS).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return STATE.FAILED;
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                        }
                        return Promise.all(addressPromise).then((response) => {
                            const resultSet = _.filter(response, result => result === STATE.FAILED);
                            if (resultSet && resultSet.length > 0) {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: null,
                                    data: null
                                });
                            } else {
                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, addresses, MESSAGE_CONSTANT.CREATED(currentModuleName)));
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
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, addresses, MESSAGE_CONSTANT.CREATED(currentModuleName)));
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
            }));
        }
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
            messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
            err: null,
            data: null
        });
    },
    // Update Customer Address
    // PUT : /api/v1/customer_addresses/saveCustomerAddresses
    // @return API response
    updateCustomerAddresses: (req, res) => {
        const { CustomerAddresses, sequelize } = req.app.locals.models;
        const customerAddresses = req.body;
        const currentModuleName = DATA_CONSTANT.CUSTOMER_ADDRESSES_TYPE[customerAddresses.addressType];
        let columnChanged;

        if (customerAddresses && customerAddresses.id && customerAddresses.customerId) {
            return CustomerAddresses.findOne({
                where: {
                    id: customerAddresses.id,
                    isDeleted: false
                },
                attributes: ['countryID', 'isActive', 'isDefault']
            }).then((dbCustAddr) => {
                if (!dbCustAddr) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(currentModuleName), err: null, data: null });
                }

                const promiseChkCountryMismatch = [];
                if (customerAddresses.countryID !== dbCustAddr.dataValues.countryID) {
                    if (customerAddresses.countryID !== dbCustAddr.dataValues.countryID) {
                        columnChanged = 1; //1- Country Change 2 - Active change
                    }
                    req.body.isCallFromOtherAPI = true;
                    req.body.objDelete = {
                        id: [customerAddresses.id],
                        CountList: true
                    };
                    promiseChkCountryMismatch.push(module.exports.deleteCustomerAddresses(req, res));
                }

                return Promise.all(promiseChkCountryMismatch).then((respOfChkAddrUsed) => {
                    if (promiseChkCountryMismatch.length > 0) {
                        if (!respOfChkAddrUsed || !respOfChkAddrUsed.length) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: null,
                                data: null
                            });
                        }
                        if (respOfChkAddrUsed[0].isCustAddrUsedInFlow) {
                            respOfChkAddrUsed[0].columnChanged = columnChanged;
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: null,
                                err: null,
                                data: {
                                    respOfChkAddrUsedAPI: respOfChkAddrUsed[0]
                                }
                            });
                        }
                    }

                    return sequelize.transaction().then((t) => {
                        return CustomerAddresses.update(customerAddresses, {
                            where: {
                                id: customerAddresses.id
                            },
                            fields: inputFields,
                            transaction: t
                        }).then(() => {
                            const promiseUpdateDefAddr = [];
                            if ((!customerAddresses.isActive && dbCustAddr.dataValues.isDefault && customerAddresses.isActive !== dbCustAddr.dataValues.isActive) || (customerAddresses.isActive && !dbCustAddr.dataValues.isDefault && customerAddresses.isActive !== dbCustAddr.dataValues.isActive)) {
                                const otherDet = {
                                    addrMstID: customerAddresses.id,
                                    customerId: customerAddresses.customerId,
                                    addressType: customerAddresses.addressType,
                                };
                                promiseUpdateDefAddr.push(module.exports.setDefaultAddrByCustAddrType(req, res, otherDet, t));
                            }

                            return Promise.all(promiseUpdateDefAddr).then((respOfUpdateDefAddrPromise) => {
                                var resObj = _.find(respOfUpdateDefAddrPromise, resp => resp.status === STATE.FAILED);
                                if (resObj) {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: null,
                                        data: null
                                    });
                                } else {
                                    return t.commit().then(() => {
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(currentModuleName));
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
        }
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
            messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
            err: null,
            data: null
        });
    },
    // Set Customer Address as default
    // PUT : /api/v1/customer_addresses/setCustomerAddressesDefault
    // @return API response
    //setCustomerAddressesDefault: (req, res) => {
    //    const {
    //        CustomerAddresses,
    //        sequelize
    //    } = req.app.locals.models;
    //    const setAddressAsDefault = req.body;

    //    if (setAddressAsDefault.id && setAddressAsDefault.customerId) {
    //        return sequelize.transaction(t => (
    //            CustomerAddresses.update({
    //                isDefault: false
    //            }, {
    //                where: {
    //                    customerId: setAddressAsDefault.customerId,
    //                    isDefault: true,
    //                    addressType: setAddressAsDefault.addressType
    //                },
    //                fields: ['isDefault']
    //            }, {
    //                transaction: t
    //            })
    //        ))
    //            .then(() =>
    //                sequelize.transaction(t => (
    //                    CustomerAddresses.update({
    //                        isDefault: true
    //                    }, {
    //                        where: {
    //                            id: setAddressAsDefault.id
    //                        },
    //                        fields: ['isDefault']
    //                    }, {
    //                        transaction: t
    //                    })
    //                )))
    //            .then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.ADDRESS_UPDATED_AS_DEFAULT))
    //            .catch((err) => {
    //                console.trace();
    //                console.error(err);
    //                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                    err: err,
    //                    data: null
    //                });
    //            });
    //    }
    //    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
    //        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
    //        err: null,
    //        data: null
    //    });
    //},
    setCustomerAddressesDefault: (req, res) => {
        const {
            CustomerAddresses,
            sequelize
        } = req.app.locals.models;
        const setAddressAsDefault = req.body;
        if (setAddressAsDefault.id && setAddressAsDefault.customerId) {
            return sequelize.transaction().then(t => CustomerAddresses.update({
                isDefault: false
            }, {
                where: {
                    customerId: setAddressAsDefault.customerId,
                    isDefault: true,
                    addressType: setAddressAsDefault.addressType
                },
                fields: ['isDefault'],
                transaction: t
            }).then(() => {
                if (setAddressAsDefault.issetDefault) {
                    return CustomerAddresses.update({
                        isDefault: true
                    }, {
                        where: {
                            id: setAddressAsDefault.id
                        },
                        fields: ['isDefault'],
                        transaction: t
                    }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.ADDRESS_UPDATED_AS_DEFAULT))).catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    })
                } else {
                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.ADDRESS_REMOVED_AS_DEFAULT));
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
            })
        }
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
            messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
            err: null,
            data: null
        });
    },
    // Delete Customer Address
    // POST : /api/v1/customer_addresses/deleteCustomerAddresses
    // @return API response
    deleteCustomerAddresses: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const currentModuleName = DATA_CONSTANT.CUSTOMER_ADDRESSES_TYPE[req.body.objDelete.addressType];
        if (req.body && req.body.objDelete.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.CustomerAddresses.Name,
                    IDs: req.body.objDelete.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objDelete.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((deleteResp) => {
                if (deleteResp) {
                    if (deleteResp.length === 0) {
                        if (req.body.isCallFromOtherAPI) {
                            return {
                                isCustAddrUsedInFlow: false,
                                transactionDetails: deleteResp,
                                IDs: req.body.objDelete.id
                            };
                        } else if (req.body.objDelete.checkForTrans) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(currentModuleName));
                        }
                    } else if (deleteResp.length > 0) {
                        if (req.body.isCallFromOtherAPI) {
                            return {
                                isCustAddrUsedInFlow: true,
                                transactionDetails: deleteResp,
                                IDs: req.body.objDelete.id
                            };
                        } else if (req.body.objDelete.checkForTrans) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                transactionDetails: deleteResp,
                                IDs: req.body.objDelete.id
                            }, null);
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                transactionDetails: deleteResp,
                                IDs: req.body.objDelete.id
                            }, null);
                        }
                    }
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

    // Get Customer address from customer id
    // GET : /api/v1/customer_addresses/getcustomerAddress
    // @return API response
    getcustomerAddress: (req, res) => {
        const {
            CustomerAddresses,
            sequelize,
            CountryMst
        } = req.app.locals.models;
        CustomerAddresses.findAll({
            where: {
                customerId: req.params.id,
                isDeleted: false
            },
            attributes: ['id', 'customerId', 'companyName', 'isDefault', 'street1', 'street2', 'street3', 'city', 'state', 'countryID', 'postcode', 'addressType', [sequelize.literal('CONCAT(street1,\',\',city,\',\',state,\',\',countryMst.countryName,\'-\',postcode)'), 'FullAddress']],
            include: [{
                model: CountryMst,
                as: 'countryMst',
                attributes: ['countryName']
            }]
        }).then(entity => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entity, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get address for supplier payment transaction
    // GET : /api/v1/customer_addresses/getAddressForSupplierPayment
    // @return supplier address
    getAddressForSupplierPayment: (req, res) => {
        if (req.query.id) {
            const { sequelize } = req.app.locals.models;
            return sequelize.query('Select fun_getAddressbyIDForCheckPrint(:pAddressID,:pPersonMstID)', {
                replacements: {
                    pAddressID: req.query.id || null,
                    pPersonMstID: req.query.personMstID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(address => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { address: _.values(address[0]) })).catch((err) => {
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
    // Set default contact person for Customer Address
    // PUT : /api/v1/customer_addresses/setDefaultContactPersonForCustAddr
    // @return API response
    setDefaultContactPersonForCustAddr: (req, res) => {
        const { CustomerAddresses } = req.app.locals.models;
        if (req.body.id && req.body.contPersonMstId) {
            const updateDefContPrsnDet = {
                defaultContactPersonID: req.body.isSetDefault ? req.body.contPersonMstId : null
            };
            COMMON.setModelUpdatedByObjectFieldValue(req.user, updateDefContPrsnDet);

            return CustomerAddresses.update(updateDefContPrsnDet, {
                where: {
                    id: req.body.id
                },
                fields: ['defaultContactPersonID', 'updatedBy', 'updateByRoleId', 'updatedAt']
            }).then(() => {
                const msgContent = Object.assign({}, req.body.isSetDefault ? MESSAGE_CONSTANT.GLOBAL.ITEM_SET_AS_DEFAULT : MESSAGE_CONSTANT.GLOBAL.ITEM_REMOVE_AS_DEFAULT);
                msgContent.message = COMMON.stringFormat(msgContent.message, 'Contact');
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, msgContent);
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
    // to set one customer address as default address 
    setDefaultAddrByCustAddrType: (req, res, otherDet, t) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_updateDefaultAddrByCustAddrType (:pAddrMstID,:pCustID,:pAddressType,:pUserID,:pUserRoleID)', {
            replacements: {
                pAddrMstID: otherDet.addrMstID,
                pCustID: otherDet.customerId,
                pAddressType: otherDet.addressType,
                pUserID: COMMON.getRequestUserID(req),
                pUserRoleID: COMMON.getRequestUserLoginRoleID(req)
            },
            transaction: t
        }).then((updateResp) => {
            return {
                status: STATE.SUCCESS,
                message: null
            };
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: err
            };
        });
    }
};