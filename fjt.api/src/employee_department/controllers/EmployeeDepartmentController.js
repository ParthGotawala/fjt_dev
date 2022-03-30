const resHandler = require('../../resHandler');
const { STATE, EMPLOYEE_DEPARTMENT, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { Op } = require('sequelize');

const empDepModuleName = DATA_CONSTANT.EMPLOYEE_DEPARTMENT.NAME;

const inputFields = [
    'empDeptID',
    'employeeID',
    'departmentID',
    'titleID',
    'isDeleted',
    'isActive',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'isDefault'
    // 'roleID'
];

module.exports = {
    // Get list of employee department
    // GET : /api/v1/getEmployeeAllDepartment
    // @param {employeeID} int
    // @return list of employee department
    getEmployeeAllDepartment: (req, res) => {
        const { EmployeeDepartment } = req.app.locals.models;
        EmployeeDepartment.findAll({
            where: {
                employeeID: req.params.employeeID
            }
        }).then(employeeDepartment => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, employeeDepartment, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Create employee department
    // POST : /api/v1/employee_department
    // @return new created employee department
    createEmployeeDepartment: (req, res) => {
        const { EmployeeDepartment } = req.app.locals.models;
        if (req.body) {
            return EmployeeDepartment.findOne({
                where: {
                    employeeID: req.body.employeeID,
                    departmentID: req.body.departmentID,
                    titleID: req.body.titleID
                    // roleID: req.body.roleID
                }
            }).then((isExists) => {
                if (isExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.EMPLOYEE_ALREADY_CONTAIN_DEPARTMENT, err: null, data: null });
                }
                COMMON.setModelCreatedByFieldValue(req);
                return EmployeeDepartment.create(req.body, {
                    fields: inputFields
                }).then(employeedepartment => module.exports.updateEmployeeDepartmentDefaultStatus(req, res, employeedepartment.employeeID, null, req.user.id).then((updateResponse) => {
                    if (updateResponse.status === STATE.SUCCESS) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, employeedepartment, MESSAGE_CONSTANT.CREATED(empDepModuleName));
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(empDepModuleName), err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                    } else {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, MESSAGE_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, MESSAGE_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Update employee department by id
    // PUT : /api/v1/employee_department
    // @param {id} int
    // @return updated employee department detail
    updateEmployeeDepartment: (req, res) => {
        const { EmployeeDepartment } = req.app.locals.models;
        if (req.params.id) {
            EmployeeDepartment.findOne({
                where: {
                    employeeID: req.body.employeeID,
                    departmentID: req.body.departmentID,
                    titleID: req.body.titleID,
                    // roleID: req.body.roleID,
                    empDeptID: { [Op.notIn]: [req.body.empDeptID] }
                }
            }).then((isExists) => {
                if (isExists) {
                    return resHandler.errorRes(res, 200, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.EMPLOYEE_ALREADY_CONTAIN_DEPARTMENT, err: null, data: null });
                }
                COMMON.setModelUpdatedByFieldValue(req);
                return EmployeeDepartment.update(req.body, {
                    where: {
                        empDeptID: req.params.id
                    },
                    fields: inputFields
                }).then((rowsUpdated) => {
                    if (rowsUpdated[0] === 1) {
                        return module.exports.updateEmployeeDepartmentDefaultStatus(req, res, req.body.employeeID, null, req.user.id).then((updateResponse) => {
                            if (updateResponse.status === STATE.SUCCESS) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(empDepModuleName));
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(empDepModuleName), err: null, data: null });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(EMPLOYEE_DEPARTMENT.NOT_UPDATED), err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                    } else {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        }
    },
    // Delete employee department by id
    // DELETE : /api/v1/employee_department
    // @param {id} int
    // @return API response
    deleteEmployeeDepartment: (req, res) => {
        const { EmployeeDepartment } = req.app.locals.models;
        if (req.params.id) {
            const employeeDepartmentIds = req.params.id.split(',') || [];
            COMMON.setModelDeletedByFieldValue(req);

            return EmployeeDepartment.update(req.body, {
                where: {
                    empDeptID: employeeDepartmentIds,
                    deletedAt: null
                },
                fields: inputFields
            }).then((rowsDeleted) => {
                if (rowsDeleted[0] > 0) {
                    if (employeeDepartmentIds.length === 1) {
                        return module.exports.updateEmployeeDepartmentDefaultStatus(req, res, null, req.params.id, req.user.id).then((updateResponse) => {
                            if (updateResponse.status === STATE.SUCCESS) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(empDepModuleName));
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(empDepModuleName), err: null, data: null });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(empDepModuleName));
                    }
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(empDepModuleName), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get list of employee department with employee detail by departmentID
    // GET : /api/v1/getEmployeeListInDepartment
    // @param {departmentID} int
    // @return list of employee department with employee detail
    getEmployeeListInDepartment: (req, res) => {
        const { EmployeeDepartment, Employee, GenericCategory } = req.app.locals.models;

        EmployeeDepartment.findAll({
            where: {
                departmentID: req.params.departmentID
            },
            attributes: ['empDeptID', 'employeeID', 'departmentID', 'titleID'],
            include: [{
                model: Employee,
                as: 'employee',
                attributes: ['id', 'firstName', 'lastName', 'email', 'contact', 'profileImg', 'initialName']
            },
            {
                model: GenericCategory,
                as: 'genericCategory',
                attributes: ['gencCategoryID', 'gencCategoryName']
            }
            ]
        }).then(employeelistInDepartment => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, employeelistInDepartment, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Add employee in department
    // POST : /api/v1/addEmployeeInDepartment
    // @return new created employee department
    addEmployeeInDepartment: (req, res) => {
        const { EmployeeDepartment } = req.app.locals.models;
        if (req.body) {
            EmployeeDepartment.findOne({
                where: {
                    employeeID: req.body.employeeID,
                    departmentID: req.body.departmentID,
                    titleID: req.body.titleID
                }
            }).then((isExists) => {
                if (isExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.EMPLOYEE_ALREADY_CONTAIN_DEPARTMENT, err: null, data: null });
                }
                COMMON.setModelCreatedByFieldValue(req);
                return EmployeeDepartment.create(req.body, {
                    fields: inputFields
                }).then(employeeindepartment => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, employeeindepartment, MESSAGE_CONSTANT.MASTER.EMPLOYEE_IN_DEPARTMENT_ADDED)).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                    } else {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Update employee in department by id
    // PUT : /api/v1/updateEmployeeInDepartment
    // @param {id} int
    // @return API response
    updateEmployeeInDepartment: (req, res) => {
        const { EmployeeDepartment } = req.app.locals.models;
        if (req.params.id) {
            EmployeeDepartment.findOne({
                where: {
                    employeeID: req.body.employeeID,
                    departmentID: req.body.departmentID,
                    titleID: req.body.titleID,
                    empDeptID: { [Op.notIn]: [req.body.empDeptID] }
                }
            }).then((isExists) => {
                if (isExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.MASTER.EMPLOYEE_ALREADY_CONTAIN_DEPARTMENT);
                }

                COMMON.setModelUpdatedByFieldValue(req);
                return EmployeeDepartment.update(req.body, {
                    where: {
                        empDeptID: req.params.id
                    },
                    fields: inputFields
                }).then((rowsUpdated) => {
                    if (rowsUpdated[0] === 1) {
                        return module.exports.updateEmployeeDepartmentDefaultStatus(req, res, req.body.employeeID, req.params.id, req.user.id).then((updateResponse) => {
                            if (updateResponse.status === STATE.SUCCESS) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(empDepModuleName));
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(empDepModuleName), err: null, data: null });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(empDepModuleName), err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                    } else {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(empDepModuleName), err: err, data: null });
                }
            });
        }
    },
    // Set default department to employee
    // PUT : /api/v1/setDefaultDepartmentToEmployee
    // @return API response
    setDefaultDepartmentToEmployee: (req, res) => {
        const { EmployeeDepartment, sequelize } = req.app.locals.models;

        if (req.body.empDeptID && req.body.employeeID) {
            return sequelize.transaction(t => (
                EmployeeDepartment.update({ isDefault: false }, {
                    where: {
                        employeeID: req.body.employeeID
                    },
                    fields: ['isDefault']
                }, { transaction: t })
            ))
                .then(() =>
                    sequelize.transaction(t => (
                        EmployeeDepartment.update({ isDefault: true }, {
                            where: {
                                empDeptID: req.body.empDeptID
                            },
                            fields: ['isDefault']
                        }, { transaction: t })
                    )))
                .then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.DEPARTMENT_UPDATED_AS_DEFAULT))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    updateEmployeeDepartmentDefaultStatus: (req, res, employeeId, empDeptId, userId) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_UpdateEmployeeDepartment (:pEmployeeId, :pEmpDeptId, :pUserID)', {
            replacements: {
                pEmployeeId: employeeId,
                pEmpDeptId: empDeptId,
                pUserID: userId
            }
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch(() => ({
            status: STATE.FAILED
        }));
    }
};