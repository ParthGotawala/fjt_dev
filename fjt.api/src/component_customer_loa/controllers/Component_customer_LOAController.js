const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');

const customerComponentLOAModuleName = DATA_CONSTANT.COMPONENT_CUSTOMER_LOA.Name;
const inputFields = [
    'id',
    'componentID',
    'customerID',
    'rfqAssyID',
    'refLineitemID',
    'documentPath',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt'
];

module.exports = {
    // Get List of Components
    // GET : /api/v1/componentcustomerloa/getImoprtLOA
    // @param {id} int
    // @return List of Components
    getImoprtLOA: (req, res) => {
        const { ComponentCustomerLOA, Component, RFQRoHS, MfgCodeMst } = req.app.locals.models;
        ComponentCustomerLOA.findOne({
            where: { componentID: req.body.componentID, customerID: req.body.customerID },
            model: ComponentCustomerLOA,
            attributes: ['id', 'componentID', 'customerID', 'isDocumentUpload', 'documentPath'],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                attributes: ['id', 'mfgCode', 'mfgName']
            },
            {
                model: Component,
                as: 'Component',
                attributes: ['id', 'mfgPN', 'PIDCode', 'RoHSStatusID', 'isCustom'],
                include: [{
                    model: RFQRoHS,
                    as: 'rfq_rohsmst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['id', 'name', 'rohsIcon']
                }]
            }]
        }).then((loa) => {
            if (!loa) {
                COMMON.setModelCreatedByFieldValue(req);
                return ComponentCustomerLOA.create(req.body, {
                    fields: inputFields
                }).then(resLOA => ComponentCustomerLOA.findOne({
                    where: { id: resLOA.id },
                    model: ComponentCustomerLOA,
                    attributes: ['id', 'componentID', 'customerID', 'isDocumentUpload', 'documentPath'],
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgCode', 'mfgName']
                    },
                    {
                        model: Component,
                        as: 'Component',
                        attributes: ['id', 'mfgPN', 'PIDCode', 'RoHSStatusID'],
                        include: [{
                            model: RFQRoHS,
                            as: 'rfq_rohsmst',
                            where: {
                                isDeleted: false
                            },
                            attributes: ['id', 'name', 'rohsIcon']
                        }]
                    }]
                }).then((loares) => {
                    if (loares) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, loares, null);
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(customerComponentLOAModuleName), err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, loa, null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get List of Component Customer LOA
    // GET : /api/v1/componentcustomerloa/getComponentLOA
    // @return List of Customer
    getComponentLOA: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize.query('CALL Sproc_GetComponentCustomerLOA (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pComponentID, :pCustomerID)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pComponentID: req.body.componentID || null,
                    pCustomerID: req.body.customerID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { componentLOA: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    updateComponentCustomerLOAPrice: (req, res) => {
        const { ComponentCustomerLOA } = req.app.locals.models;
        if (req.body) {
            ComponentCustomerLOA.findOne({
                where: {
                    id: req.body.id,
                    isDeleted: false
                },
                attributes: ['id', 'customerID', 'componentID', 'loa_price']
            }).then((isexist) => {
                if (isexist) {
                    const obj = {
                        loa_price: req.body.loa_price,
                        updatedBy: COMMON.getRequestUserID(req)
                    };
                    return ComponentCustomerLOA.update(obj, {
                        where: {
                            id: req.body.id
                        }
                    }).then(customerloa => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, customerloa, MESSAGE_CONSTANT.UPDATED(customerComponentLOAModuleName))
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(customerComponentLOAModuleName), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // Get List of Components from customer
    // GET : /api/v1/componentcustomerloa/getComponentCustomer
    // @param {id} int
    // @return List of component
    getComponentCustomer: (req, res) => {
        const { ComponentCustomerLOA } = req.app.locals.models;
        ComponentCustomerLOA.findAll({
            where: {
                customerID: req.params.customerID,
                isDeleted: false
            },
            attributes: ['id', 'customerID', 'componentID', 'loa_price']
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};