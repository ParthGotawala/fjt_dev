const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const empResModuleName = DATA_CONSTANT.EMPLOYEE_RESPONSIBILITY.NAME;

const inputFields = [
    'id',
    'employeeID',
    'responsibilityID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Get list of employee Responsibility
    // GET : /api/v1/getEmployeeResponsibility
    // @param {employeeID} int
    // @return list of employee Responsibility
    getEmployeeResponsibility: (req, res) => {
        const { EmployeeResponsibility, GenericCategory } = req.app.locals.models;
        if (req.params.employeeID) {
            return EmployeeResponsibility.findAll({
                where: {
                    employeeID: req.params.employeeID
                },
                attributes: ['id', 'employeeID', 'responsibilityID'],
                include: [{
                    model: GenericCategory,
                    as: 'responsibility',
                    attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode', 'categoryType']
                }]
            }).then(employeeResponsibility => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, employeeResponsibility, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create employee Responsibility
    // POST : /api/v1/saveEmployeeResponsibility
    // @return new created employee Responsibility
    saveEmployeeResponsibility: (req, res) => {
        const { EmployeeResponsibility } = req.app.locals.models;
        if (req.body.listObj) {
            const promices = [];
            if (req.body.listObj.newEmpResponsibility.length > 0) {
                COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.newEmpResponsibility);
                promices.push(EmployeeResponsibility.bulkCreate(req.body.listObj.newEmpResponsibility, {
                    fields: inputFields,
                    updateOnDuplicate: ['employeeID', 'responsibilityID']
                }));
            }
            if (req.body.listObj.deletedEmpResponsibility.length > 0) {
                COMMON.setModelDeletedByFieldValue(req);
                promices.push(EmployeeResponsibility.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                    where: {
                        employeeID: req.body.listObj.employeeID,
                        responsibilityID: req.body.listObj.deletedEmpResponsibility
                    },
                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId']
                }));
            }
            return Promise.all(promices).then(responses => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responses, MESSAGE_CONSTANT.UPDATED(empResModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get list of employee Responsibility
    // GET : /api/v1/getResponsibilityWiseEmployeeList
    // @param {employeeID} int
    // @return list of employee Responsibility
    getResponsibilityWiseEmployeeList: (req, res) => {
        const { EmployeeResponsibility, GenericCategory } = req.app.locals.models;
        if (req.params.gencCategoryType) {
            return GenericCategory.findAll({
                where: {
                    isActive: true,
                    categoryType: req.params.gencCategoryType
                },
                attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode', 'categoryType'],
                include: [{
                    model: EmployeeResponsibility,
                    as: 'employeeResponsibility',
                    attributes: ['id', 'employeeID', 'responsibilityID'],
                    require: false
                }]
            }).then(responsibilityEmployee => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responsibilityEmployee, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};