const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'employeeId',
    'mfgCodeId',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const customerEmployeeModuleName = DATA_CONSTANT.CUSTOMER_EMPLOYEE_MAPPING.NAME;

module.exports = {
    // get customer employee list which are not mapped
    // GET : /api/v1/employeemfgmapping/retrieveNotAddedCustomerListForEmployee
    // get all employees(personnel)/ Customer list which are not mapped
    retrieveNotAddedCustomerListForEmployee: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && (req.body.employeeID || req.body.customerID)) {
            return sequelize.query('CALL Sproc_getNotMappedCustomerEmployeeDetail (:pEmployeeID,:pCustomerID,:pAttributesSearch)', {
                replacements: {
                    pEmployeeID: req.body.employeeID ? req.body.employeeID : null,
                    pCustomerID: req.body.customerID ? req.body.customerID : null,
                    pAttributesSearch: req.body.searchText ? req.body.searchText : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const empMasterList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { empMasterList: empMasterList }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // get customer employee mapping
    // GET : /api/v1/employeemfgmapping/retrieveAddedCustomerListForEmployee
    // get all employees(personnel)/ Customer mapping detail
    retrieveAddedCustomerListForEmployee: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && (req.body.employeeID || req.body.customerID)) {
            return sequelize.query('CALL Sproc_getMappedCustomerEmployeeDetail (:pEmployeeID,:pCustomerID,:pAttributesSearch)', {
                replacements: {
                    pEmployeeID: req.body.employeeID || null,
                    pCustomerID: req.body.customerID || null,
                    pAttributesSearch: req.body.searchText || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const custEmpMappingList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { custEmpMappingList: custEmpMappingList }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create workorder operation employees
    // POST : /api/v1/employeemfgmapping/createCustomerEmployeesMapping
    // @return API response
    createCustomerEmployeesMapping: (req, res) => {
        const { EmployeeMFGMapping, sequelize } = req.app.locals.models;
        COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.mappingList);
        if (req.body && req.body.listObj && req.body.listObj.mappingList && req.body.listObj.mappingList.length > 0) {
            const promises = [];
            let msg = null;
            return sequelize.transaction().then((t) => {
                _.each(req.body.listObj.mappingList, (objItem) => {
                    var where = {};
                    where.isDeleted = false;
                    where.employeeId = objItem.employeeId;
                    where.mfgCodeId = objItem.mfgCodeId;

                    promises.push(EmployeeMFGMapping.findOne({
                        where: where,
                        attributes: ['id'],
                        transaction: t
                    }).then((isExists) => {
                        if (isExists) {
                            return {
                                status: STATE.SUCCESS
                            };
                        } else {
                            return EmployeeMFGMapping.create(objItem, {
                                transaction: t,
                                fields: inputFields
                            }).then(response => ({
                                status: STATE.SUCCESS,
                                id: response.id
                            })).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.NOT_CREATED(customerEmployeeModuleName)
                                };
                            });
                        }
                    })
                    );
                });
                if (promises && promises.length > 0) {
                    return Promise.all(promises).then((returnresp) => {
                        var authResObj = _.find(returnresp, resp => resp.status !== STATE.SUCCESS);
                        if (!authResObj) {
                            return t.commit().then(() => {
                                if (req.body.listObj.employeeId) {
                                    msg = MESSAGE_CONSTANT.MASTER.CUSTOMER_ADDED_TO_EMPLOYEE;
                                } else if (req.body.listObj.mfgCodeId) {
                                    msg = MESSAGE_CONSTANT.MASTER.EMPLOYEE_ADDED_TO_CUSTOMER;
                                }
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, msg);
                            });
                        } else {
                            if (!t.finished) { t.rollback(); }
                            if (req.body.listObj.employeeId) {
                                msg = MESSAGE_CONSTANT.MASTER.CUSTOMER_NOT_ADDED_TO_EMPLOYEE;
                            } else if (req.body.listObj.mfgCodeId) {
                                msg = MESSAGE_CONSTANT.MASTER.EMPLOYEE_NOT_ADDED_TO_CUSTOMER;
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: msg, err: null, data: null });
                        }
                    }).catch((err) => {
                        if (!t.finished) t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return Promise.all(promises).then(() => t.commit().then(() => {
                        if (req.body.listObj.employeeId) {
                            msg = MESSAGE_CONSTANT.MASTER.CUSTOMER_ADDED_TO_EMPLOYEE;
                        } else if (req.body.listObj.mfgCodeId) {
                            msg = MESSAGE_CONSTANT.MASTER.EMPLOYEE_ADDED_TO_CUSTOMER;
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, msg);
                    }));
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
    // Delete Customer employee Mapping
    // POST : /api/v1/employeemfgmapping/deleteCustomerEmployeeMapping
    // @return API response
    deleteCustomerEmployeeMapping: (req, res) => {
        const { EmployeeMFGMapping, sequelize } = req.app.locals.models;

        /* delete Customer employee mapping that user removed */
        if (req.body && req.body.listObj) {
            let msg = null;
            COMMON.setModelDeletedByFieldValue(req);
            const where = {};
            if (req.body.listObj.employeeId) {
                where.employeeId = req.body.listObj.employeeId;
                where.mfgCodeId = { [Op.in]: req.body.listObj.ids };
            }
            if (req.body.listObj.mfgCodeId) {
                where.employeeId = { [Op.in]: req.body.listObj.ids };
                where.mfgCodeId = req.body.listObj.mfgCodeId;
            }
            return sequelize.transaction().then(t => EmployeeMFGMapping.update(req.body, {
                where: where,
                fields: ['deletedBy', 'isDeleted', 'deletedAt', 'deleteByRoleId']
            }).then(() => t.commit().then(() => {
                if (req.body.listObj.employeeId) {
                    msg = MESSAGE_CONSTANT.MASTER.CUSTOMER_DELETED_FROM_EMPLOYEE;
                } else if (req.body.listObj.mfgCodeId) {
                    msg = MESSAGE_CONSTANT.MASTER.EMPLOYEE_DELETED_FROM_CUSTOMER;
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, msg);
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};