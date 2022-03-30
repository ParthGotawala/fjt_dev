const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const departmentModuleName = DATA_CONSTANT.DEPARTMENT.NAME;

const inputFields = [
    'deptID',
    'deptName',
    'deptMngrID',
    'isActive',
    'parentDeptID',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'locationTypeID',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'systemGenerated'
];

module.exports = {
    // Retrive list of department
    // POST : /api/v1/department/retriveDepartmentList
    // @return list of department
    retriveDepartmentList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveDepartment (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { department: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive department by ID
    // GET : /api/v1/department/:id
    // @param {id} int
    retriveDepartment: (req, res) => {
        if (req.params.id) {
            const Department = req.app.locals.models.Department;
            return Department.findByPk(req.params.id)
                .then((department) => {
                    if (!department) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(departmentModuleName), err: null, data: null });
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, department, null);
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create department
    // POST : /api/v1/department
    // @return new created department
    createDepartment: (req, res) => {
        const Department = req.app.locals.models.Department;
        if (req.body) {
            if (req.body.deptName) { req.body.deptName = COMMON.TEXT_WORD_CAPITAL(req.body.deptName, false); }


            return Department.findAll({
                where: { deptName: req.body.deptName }
                // paranoid: false,
            }).then((finddepratment) => {
                if (finddepratment.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.DEPARTMENT.UNIQUE_FIELD), err: null, data: null });
                }
                COMMON.setModelCreatedByFieldValue(req);
                return Department.create(req.body, {
                    fields: inputFields
                }).then((department) => {
                    // / Add Department detail into Elastic Search Engine for Enterprise Search
                    if (department) {
                        req.params['deptId'] = department.deptID;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageDepartmentDetailInElastic);
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, department, MESSAGE_CONSTANT.CREATED(departmentModuleName));
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                    } else if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY(DATA_CONSTANT.DEPARTMENT.UNIQUE_FIELD), err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Update department
    // PUT : /api/v1/department
    // @param {id} int
    // @return API response
    updateDepartment: (req, res) => {
        const Department = req.app.locals.models.Department;
        if (req.params.id) {
            if (req.body.deptName) { req.body.deptName = COMMON.TEXT_WORD_CAPITAL(req.body.deptName, false); }

            Department.findOne({
                where: {
                    deptName: req.body.deptName,
                    deptID: { [Op.notIn]: [req.params.id] }
                }
            }).then((isExists) => {
                if (isExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.DEPARTMENT.UNIQUE_FIELD), err: null, data: null });
                } else {
                    Department.loginUser = req.user;
                    COMMON.setModelUpdatedByFieldValue(req);
                    return Department.update(req.body, {
                        where: {
                            deptID: req.params.id
                        },
                        fields: inputFields
                    }).then((rowsUpdated) => {
                        if (rowsUpdated[0] === 1) {
                            // / Update Department detail into Elastic Search Engine for Enterprise Search
                            if (rowsUpdated) {
                                req.params['deptId'] = req.params.id;
                                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageDepartmentDetailInElastic);
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { deptID: req.params.id }, MESSAGE_CONSTANT.UPDATED(departmentModuleName));
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(departmentModuleName), err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                        } else if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY(DATA_CONSTANT.DEPARTMENT.UNIQUE_FIELD), err: null, data: null });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        }
    },
    // Delete department
    // DELETE : /api/v1/department
    // @param {id} int
    // @return API response
    deleteDepartment: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Department.Name;
            const entityID = COMMON.AllEntityIDS.Department.ID;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((deptDetail) => {
                if (deptDetail.length === 0) {
                    // Remove Department Detail from Elastic Engine Database
                    EnterpriseSearchController.deleteDepartmentDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, deptDetail, MESSAGE_CONSTANT.DELETED(departmentModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: deptDetail, IDs: req.body.objIDs.id }, null);
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
    // Get list of  department
    // PUT : /api/v1/getAllDepartment
    // @return API response
    getAllDepartment: (req, res) => {
        const Department = req.app.locals.models.Department;
        const whereClause = { isActive: true };
        if (req.query && req.query.filterID) {
            whereClause.deptID = { [Op.ne]: req.query.filterID };
        }
        if (req.query && req.query.searchquery) {
            whereClause.deptName = {
                [Op.like]: `%${req.query.searchquery}%`
            };
        }
        Department.findAll({
            attributes: ['deptName', 'deptID', 'parentDeptID'],
            order: [['deptName', 'ASC']],
            where: whereClause
        }).then(departmentlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, departmentlist, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get list of  department with employee
    // PUT : /api/v1/getDepartmentWithEmployees
    // @return list of  department with employee
    getDepartmentWithEmployees: (req, res) => {
        const { Department, Employee, sequelize, EmployeeDepartment } = req.app.locals.models;

        const promises = [];
        promises[0] = Department.findAll({
            attributes: ['deptName', 'deptID'],
            order: [['deptName', 'ASC']]
        });

        promises[1] = EmployeeDepartment.findAll({
            attributes: ['departmentID'],
            include: {
                model: Employee,
                as: 'employee',
                attributes: ['id', [sequelize.literal('CONCAT(\'(\',`employee`.initialName,\') \', `employee`.firstName , \' \' , `employee`.lastName)'), 'fullName'], 'isActive'],
                // where: {  isActive:true },
                required: true
                // attributes: ['id', 'firstName', 'lastName']
            }
        });

        Promise.all(promises).then((resp) => {
            if (resp[0]) {
                const data = {
                    departmentList: resp[0],
                    employeeDepartmentList: resp[1]
                };
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, data, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(departmentModuleName), err: null, data: null });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // check duplicate Department name to create
    // POST : /api/v1/department/checkDuplicateDepartmentName
    // @return details if Department name already exists or not
    checkDuplicateDepartmentName: (req, res) => {
        if (req.body && req.body.deptName) {
            const { Department } = req.app.locals.models;
            return Department.count({
                where: {
                    deptName: req.body.deptName,
                    deptID: { [Op.ne]: req.body.deptID }
                }
            }).then((count) => {
                if (count > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateDeptName: true } }, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateDeptName: false }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // add all selected department for access Geolocations
    // GET : /api/v1/department/createLocationList
    // @return List of department added for Geolocations (here success only)
    createLocationList: (req, res) => {
        const { sequelize, DepartmentLocation } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.locationList) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.locationList);
            return sequelize.transaction().then(t => DepartmentLocation.bulkCreate(req.body.listObj.locationList, {
                transaction: t
            }).then(() => t.commit().then(() => {
                const messageContent = MESSAGE_CONSTANT.GLOBAL.DEPARTMENT_LOCATION_ADDED;
                messageContent.message = COMMON.stringFormat(messageContent.message, 'department');
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
            })).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY(DATA_CONSTANT.GENERIC_CATEGORY_TYPE.GEOLOCATIONS), err: null, data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // GET : /api/v1/department/getLocationAddedList
    // @return List of department added for locationn (here success only)
    getLocationAddedList: (req, res) => {
        const { DepartmentLocation, GenericCategory, Department } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.deptID) {
            var where = {
                deptID: req.body.listObj.deptID,
                isDeleted: false

            };
            DepartmentLocation.findAll({
                where: where,
                include: [
                    {
                        model: Department,
                        as: 'department',
                        attributes: ['deptID']
                    },
                    {
                        model: GenericCategory,
                        as: 'GenericCategory',
                        attributes: ['gencCategoryID', 'gencCategoryName', 'displayOrder'],
                        where: { isDeleted: false, isActive: true }
                    }]
            }).then((departmentLocationList) => {
                if (!departmentLocationList) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(departmentModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, departmentLocationList, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // delete all  selected department for access Geolocations
    // GET : /api/v1/department/deleteLocationList
    // @return List of department removed for Geolocations (here success only)
    deleteLocation: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.deptID && req.body.locationTypeID) {
            const tableName = COMMON.AllEntityIDS.department_location.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.locationTypeID.toString(),
                    deletedBy: req.user.id,
                    entityID: req.body.deptID,
                    refrenceIDs: null,
                    countList: req.body.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((locationDetails) => {
                if (locationDetails && locationDetails.length === 0) {
                    const messageContent = MESSAGE_CONSTANT.GLOBAL.DEPARTMENT_LOCATION_DELETED;
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'department');
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: locationDetails, IDs: req.body.locationTypeID }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }

};
