const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const misReportEmployeeModuleName = DATA_CONSTANT.DYNAMIC_REPORT_ACCESS.NAME;

module.exports = {

    // Retrive list all employee by defined entity table and record
    // GET : /api/v1/dynamicreportaccess/getAccessEmployeeList
    // @return list all employee list that allowed access form
    getAccessEmployeeList: (req, res) => {
        if (req.params.refTableName && req.params.refTransID) {
            const { DynamicReportAccess } = req.app.locals.models;

            return DynamicReportAccess.findAll({
                where: {
                    refTableName: req.params.refTableName,
                    refTransID: req.params.refTransID
                },
                attributes: ['EmployeeID']
            }).then(customFormEmployeeAccessList =>
                // return resHandler.successRes(res, 200, STATE.SUCCESS, customFormEmployeeAccessList);
                 resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, customFormEmployeeAccessList, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // retrieve all employees with Report
    // GET : /api/v1/dynamicreportaccess/retrieveEmployeesOfMISReportDetails
    // @return List of employees including mis report
    retrieveEmployeesOfMISReportDetails: (req, res) => {
        const { DynamicReportAccess, Employee, Department, EmployeeDepartment, GenericCategory,
            User, Role } = req.app.locals.models;

        if (req.body.refTransID && req.body.refTableName) {
            return Employee.findAll({
                attributes: ['id', 'firstName', 'lastName', 'profileImg', 'isActive', 'initialName'],
                where: {
                    isDeleted: false
                },
                include: [{
                    model: DynamicReportAccess,
                    as: 'dynamicReportAccess',
                    attributes: ['ID', 'refTransID', 'EmployeeID', 'refTableName'],
                    where: {
                        refTableName: req.body.refTableName,
                        refTransID: req.body.refTransID
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
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['employeeID'],
                    include: [
                    {
                        model: Role,
                        as: 'roles',
                        attributes: ['id'],
                        through: {
                            where: {
                                deletedAt: null
                            }
                        }
                    }
                    ]
                }
                ]
            }).then((getEmployeeData) => {
                if (!getEmployeeData) {
                    // return resHandler.errorRes(res,200,STATE.EMPTY,new NotFound(MESSAGE_CONSTANT.NOT_FOUND(misReportEmployeeModuleName)));
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(misReportEmployeeModuleName), err: null, data: null });
                }
                // return resHandler.successRes(res, 200, STATE.SUCCESS, getEmployeeData);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEmployeeData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // add all selected employees for access mis report
    // GET : /api/v1/dynamicreportaccess/createMISReportEmployeeList
    // @return List of employees added for mis report (here success only)
    createMISReportEmployeeList: (req, res) => {
        const DynamicReportAccess = req.app.locals.models.DynamicReportAccess;

        if (req.body && req.body.listObj && req.body.listObj.employeeList) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.employeeList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.listObj.employeeList);
            return DynamicReportAccess.bulkCreate(req.body.listObj.employeeList, {
                // individualHooks: true
            }).then(() => {
               // resHandler.successRes(res, 200, STATE.SUCCESS, {userMessage:COMMON.stringFormat(MESSAGE_CONSTANT.DynamicReportAccess.EMPLOYEE_ADDED_TO_ACCESS,"report")});
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.EMP_ASSIGN_TO_REPORT_ACCESS);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'report');
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // delete all selected employees for not accessing mis report
    // GET : /api/v1/dynamicreportaccess/deleteMISReportEmployeeList
    // @return List of employees removed for mis report access (here success only)
    deleteMISReportEmployeeList: (req, res) => {
        if (req.body && req.body.deleteObj && req.body.deleteObj.employeeIDs
            && req.body.deleteObj.refTransID && req.body.deleteObj.refTableName) {
            const DynamicReportAccess = req.app.locals.models.DynamicReportAccess;
            COMMON.setModelDeletedByFieldValue(req);
            return DynamicReportAccess.update(req.body, {
                where: {
                    refTransID: req.body.deleteObj.refTransID,
                    refTableName: req.body.deleteObj.refTableName,
                    employeeID: req.body.deleteObj.employeeIDs,
                    deletedAt: null
                },
                fields: ['deletedAt', 'deletedBy', 'isDeleted', 'updatedBy']
            }).then(() => {
               // resHandler.successRes(res, 200, STATE.SUCCESS, {userMessage:COMMON.stringFormat(MESSAGE_CONSTANT.DynamicReportAccess.EMPLOYEE_DELETED_FROM_ACCESS,"report")});
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.EMP_DELETED_FROM_REPORT_ACCESS);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'report');
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
