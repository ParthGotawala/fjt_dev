const _ = require('lodash');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');

const inputFields = [
    'opEmployeeID',
    'opID',
    'employeeID',
    'isDeleted',
    'createdBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];


module.exports = {
    retrieveEmployeeOperationDetails: (req, res) => {
        const { OperationEmployee, Employee, Department, EmployeeDepartment, GenericCategory } = req.app.locals.models;
        if (req.params.id) {
            Employee.findAll({
                attributes: ['id', 'firstName', 'lastName', 'profileImg', 'isActive', 'isDeleted', 'initialName'],
                where: {
                    isDeleted: false
                    // isActive:true
                },
                include: [{
                    model: OperationEmployee,
                    as: 'operationEmployee',
                    attributes: ['opEmployeeID', 'opID', 'employeeID'],
                    where: {
                        opID: req.params.id
                    },
                    required: false
                },
                {
                    model: EmployeeDepartment,
                    as: 'employeeDepartment',
                    attributes: ['departmentID', 'titleID'],
                    required: false,
                    where: {
                        isDefault: true
                    },
                    include: [{
                        model: Department,
                        as: 'department',
                        attributes: ['deptName']
                    },
                    {
                        model: GenericCategory,
                        as: 'genericCategory',
                        attributes: ['gencCategoryName']
                    }]
                }
                ]
            }).then((getEmployeeData) => {
                if (!getEmployeeData) {
                    return Promise.reject(MESSAGE_CONSTANT.MASTER.OPERATION_OF_EMPLOYEE_NOT_FOUND);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEmployeeData);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    // get all employees (personnel) For Op Master that not added in operation
    retrieveNotAddedEmployeeListForOp: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.opID) {
            return sequelize
                .query('CALL Sproc_getEmployeesNotAddedInOp (:popID,:pAttributesSearch)',
                    {
                        replacements: {
                            popID: req.body.opID,
                            pAttributesSearch: req.body.searchText ? req.body.searchText : null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    const empMasterList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { empMasterList: empMasterList });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get all employees (personnel) For Op Master that added in operation
    retrieveAddedEmployeeListForOp: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.opID) {
            return sequelize
                .query('CALL Sproc_getEmployeesAddedInOp (:popID,:pAttributesSearch)',
                    {
                        replacements: {
                            popID: req.body.opID,
                            pAttributesSearch: req.body.searchText ? req.body.searchText : null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    const operationEmpList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { operationEmpList: operationEmpList });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    createOperation_EmployeeList: (req, res) => {
        const { sequelize, OperationEmployee } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.employeeList) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.employeeList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.listObj.employeeList);
            return sequelize.transaction().then(t => OperationEmployee.bulkCreate(req.body.listObj.employeeList, {
                individualHooks: true,
                transaction: t
            }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EMPLOYEE_ADDED_TO_OPERATION))).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    deleteOperation_EmployeeList: (req, res) => {
        const { sequelize, OperationEmployee } = req.app.locals.models;
        if (req.query && req.query.employeeIDs && req.query.opID) {
            COMMON.setModelDeletedByFieldValue(req);
            return sequelize.transaction().then(t => OperationEmployee.update(req.body, {
                where: {
                    opID: req.query.opID,
                    employeeID: req.query.employeeIDs,
                    deletedAt: null
                },
                fields: inputFields
            }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EMPLOYEE_DELETED_FROM_OPERATION))).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
