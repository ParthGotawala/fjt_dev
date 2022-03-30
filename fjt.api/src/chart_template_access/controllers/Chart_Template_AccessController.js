/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const chartTemplateAccessModuleName = DATA_CONSTANT.CHART_TEMPLATE_ACCESS.NAME;

const inputFields = [
    'ID',
    'chartTemplateID',
    'employeeID',
    'isDeleted',
    'createdBy',
    'deletedBy',
    'deletedAt'
];


module.exports = {
    // retrieve all employees with chart_template
    // GET : /api/v1/chart_template_access/retrieveEmployeeChartTemplateDetails
    // @return List of employees including chart template
    retrieveEmployeeChartTemplateDetails: (req, res) => {
        const { ChartTemplateAccess, Employee, Department, EmployeeDepartment, GenericCategory,
            User, Role } = req.app.locals.models;

        if (req.params.chartTemplateID) {
            return Employee.findAll({
                attributes: ['id', 'firstName', 'lastName', 'profileImg', 'isActive', 'initialName'],
                where: {
                    isDeleted: false
                },
                include: [{
                    model: ChartTemplateAccess,
                    as: 'chartTemplateAccess',
                    attributes: ['ID', 'chartTemplateID', 'employeeID'],
                    where: {
                        chartTemplateID: req.params.chartTemplateID
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
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(chartTemplateAccessModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEmployeeData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // add all selected employees for access chart_template
    // GET : /api/v1/chart_template_access/createChartTemplateEmployeeList
    // @return List of employees added for chart template (here success only)
    createChartTemplateEmployeeList: (req, res) => {
        const ChartTemplateAccess = req.app.locals.models.ChartTemplateAccess;
        if (req.body && req.body.listObj && req.body.listObj.employeeList) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.employeeList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.listObj.employeeList);
            return ChartTemplateAccess.bulkCreate(req.body.listObj.employeeList, {
                individualHooks: true
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EMPLOYEE_ADDED_TO_CHART)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // delete all selected employees for not accessing chart_template
    // GET : /api/v1/chart_template_access/deleteChartTemplateEmployeeList
    // @return List of employees removed for chart template (here success only)
    deleteChartTemplateEmployeeList: (req, res) => {
        const ChartTemplateAccess = req.app.locals.models.ChartTemplateAccess;
        if (req.query && req.query.employeeIDs && req.query.chartTemplateID) {
            COMMON.setModelDeletedByFieldValue(req);
            return ChartTemplateAccess.update(req.body, {
                where: {
                    chartTemplateID: req.query.chartTemplateID,
                    employeeID: req.query.employeeIDs,
                    deletedAt: null
                },
                fields: inputFields
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EMPLOYEE_DELETED_FROM_CHART)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
