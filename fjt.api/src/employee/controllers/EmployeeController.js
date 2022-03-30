const fs = require('fs');
const _ = require('lodash');
const {
    Op
} = require('sequelize');
const fsextra = require('fs-extra');
const uuidv1 = require('uuid/v1');
const resHandler = require('../../resHandler');
const { UpdateUser, removeUserFromIdentity, createUserOnIdentityServer } = require('../../Identity/IdentityApiHandler');

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
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/newline-after-import
const empEquiModuleName = DATA_CONSTANT.EMPLOYEE_EQUIPMENT.NAME;
const empModuleName = DATA_CONSTANT.EMPLOYEE.DISPLYNAME;
const chartCategoryModuleName = DATA_CONSTANT.CHART_CATEGORY.NAME;
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const { response } = require('express');

const inputFields = ['firstName', 'lastName', 'email', 'contact', 'burdenRate', 'street1', 'street2', 'postcode', 'city', 'state', 'countryID', 'paymentMode', 'code', 'codeDigest', 'visibleCode', 'managerID', 'faxNumber', 'createdBy', 'updatedBy', 'deletedBy', 'isDeleted', 'deletedAt', 'workAreaID', 'profileImg', 'middleName', 'initialName', 'isExternalEmployee', 'isActive', 'defaultChartCategoryID', 'phExtension', 'supplierID', 'contactCountryCode', 'faxCountryCode', 'street3', 'logoutIdleTime', 'documentPath', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId', 'personnelType'];
const inputFieldsUpdate = ['firstName', 'lastName', 'email', 'contact', 'burdenRate', 'street1', 'street2', 'postcode', 'city', 'state', 'countryID', 'paymentMode', 'code', 'codeDigest', 'visibleCode', 'managerID', 'faxNumber', 'workAreaID', 'profileImg', 'middleName', 'initialName', 'isExternalEmployee', 'isActive', 'updatedBy', 'phExtension', 'supplierID', 'contactCountryCode', 'faxCountryCode', 'street3', 'logoutIdleTime', 'documentPath', 'updateByRoleId', 'deleteByRoleId', 'personnelType'];
const inputFieldsUser = ['username', 'password', 'passwordConfirmation', 'passwordDigest', 'emailAddress', 'firstName', 'lastName', 'profileImg', 'createdBy', 'updatedBy', 'deletedBy', 'isDeleted', 'deletedAt', 'employeeID', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId', 'IdentityUserId'];
const operationemployeeInputFields = ['employeeID', 'opID', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId'];
module.exports = {
    // Retrive list of employee
    // POST : /api/v1/employees/retrieveEmployeeList
    // @return list of employee
    retrieveEmployeeList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveEmployee (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                employees: _.values(response[1]),
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
    // Retrive detail of employee
    // GET : /api/v1/employees/:id
    // @param {id} int
    // @return detail of employee
    retrieveEmployee: async (req, res) => {
        const {
            sequelize,
            Employee,
            User,
            WorkorderTransEmpinout,
            Role,
            CountryMst,
            EmployeeContactPerson,
            ContactPerson
        } = req.app.locals.models;
        if (req.params.id) {
            try {
                var functionDetail = await sequelize.query('Select fun_getTimeZone() as TimeZone,fun_getDateTimeFormat() as dateFormat, fun_getContPersonNameDisplayFormat() as contPersonNameFormat, fun_getEmployeeDisplayFormat() as employeeNameFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }

            let employeeInputFields = _.clone(inputFields);
            employeeInputFields.push('id', [sequelize.fn('fun_GetEmployeeFormattedName', sequelize.col('Employee.firstName'), sequelize.col('Employee.middleName'), sequelize.col('Employee.lastName'), sequelize.col('Employee.initialName'), functionDetail[0].employeeNameFormat), 'formattedName']);

            // Employee.findByPk(req.params.id)
            return await Employee.findAll({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                attributes: employeeInputFields,
                include: [{
                    model: CountryMst,
                    as: 'countryMst',
                    attributes: ['countryName'],
                    required: false
                }, {
                    model: WorkorderTransEmpinout,
                    as: 'workorderTransEmpinout',
                    attributes: ['checkinTime', 'checkoutTime'],
                    required: false,
                    where: {
                        checkoutTime: null
                    }
                }, {
                    model: EmployeeContactPerson,
                    as: 'employeeContactPerson',
                    attributes: ['id', 'contactPersonId', 'employeeId', [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('employeeContactPerson.assignedAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'assignedAt']],
                    required: false,
                    where: {
                        releasedAt: null
                    },
                    include: [{
                        model: ContactPerson,
                        as: 'contactPerson',
                        attributes: ['personId', 'title', 'division', [sequelize.fn('fun_GetFormattedContactPersonName', sequelize.col('employeeContactPerson.contactPerson.firstName'), sequelize.col('employeeContactPerson.contactPerson.middleName'), sequelize.col('employeeContactPerson.contactPerson.lastName'), functionDetail[0].contPersonNameFormat), 'fullName']],
                        required: false
                    }]
                }],
                required: false
            }).then((employee) => {
                if (employee.length === 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(empModuleName),
                        err: null,
                        data: null
                    });
                } else {
                    employee = _.first(employee);
                    if (employee.codeDigest) {
                        employee.code = COMMON.DECRYPT((employee.codeDigest).toUpperCase());
                        return User.findAll({
                            where: {
                                username: {
                                    [Op.eq]: employee.code
                                }
                            },
                            include: [{
                                model: Role,
                                as: 'roles',
                                required: false
                            }]
                        }).then((finduser) => {
                            if (finduser.length > 0) {
                                employee.dataValues.userID = finduser[0].id;
                                employee.dataValues.isUser = true;
                                employee.dataValues.selectedRole = finduser[0].roles;
                                employee.dataValues.IdentityUserId = finduser[0].IdentityUserId;
                            } else {
                                employee.dataValues.isUser = false;
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, employee, null);
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.NOT_FOUND(empModuleName),
                            err: null,
                            data: null
                        });
                    }
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
    // Create employee
    // POST : /api/v1/employees
    // @return API response
    // eslint-disable-next-line consistent-return
    createEmployee: (req, res) => {
        const dir = DATA_CONSTANT.EMPLOYEE.UPLOAD_PATH;
        try {
            if (typeof (req.files) === 'object' && req.files.profile) {
                const file = req.files.profile;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                const fileName = `${file.fieldName}-${uuidv1()}.${ext}`;
                const path = dir + fileName;
                req.body.profileImg = fileName;
                fsextra.move(file.path, path, (err) => {
                    module.exports.addEmployeeDetail(req, res, err);
                });
            } else {
                module.exports.addEmployeeDetail(req, res, null);
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        }
        // const storage = multer.diskStorage({
        //     destination: (destReq, file, cb) => {
        //         const dir = DATA_CONSTANT.EMPLOYEE.UPLOAD_PATH;
        //         mkdirp(dir, (err) => cb(err, dir));
        //     },
        //     filename: (fileReq, file, cb) => {
        //         const ext = (/[.]/.exec(file.originalname)) ? /[^.]+$/.exec(file.originalname)[0] : null;
        //         cb(null, `${file.fieldname}-${uuidv1()}.${ext}`);
        //     },
        // });
        // const upload = multer({
        //     storage,
        // }).any();
        // upload(req, res, (err) => {
        //     req.body.profileImg = req.files.length > 0 ? req.files[0].filename : null;
        //     /*STATIC CODE START*/
        //     // req.body.firstName = req.body.firstName == "null" ? null : req.body.firstName;
        //     // req.body.lastName = req.body.lastName == "null" ? null : req.body.lastName;
        //     // req.body.middleName = req.body.middleName == "null" ? null : req.body.middleName;
        //     // req.body.initialName = req.body.initialName == "null" ? null : req.body.initialName;
        //     // req.body.managerID = req.body.managerID == "null" ? null : req.body.managerID;
        //     // req.body.burdenRate = req.body.burdenRate == "null" ? null : req.body.burdenRate;
        //     // req.body.workAreaID = req.body.workAreaID == "null" ? null : req.body.workAreaID;
        //     // req.body.isCheckUnique = req.body.isCheckUnique == "true" ? true : false;
        //     // req.body.isAddUser = req.body.isAddUser == "true" ? true : false;
        //     // req.body.profileImg = req.files.length > 0 ? req.files[0].filename : null;
        //     // req.body.isExternalEmployee = req.body.isExternalEmployee == "true" ? true : false;
        //     // req.body.isActive = req.body.isActive == "true" ? true : false;
        //     /*STATIC CODE END*/
        //     module.exports.addEmployeeDetail(req, res, err);
        // });
    },
    addEmployeeDetail: (req, res, err) => {
        const {
            Employee,
            sequelize,
            User
        } = req.app.locals.models;
        req.body.email = COMMON.DECRYPT_AES(req.body.email);
        if (req.body) {
            if (req.body.firstName) {
                req.body.firstName = COMMON.TEXT_WORD_CAPITAL(req.body.firstName, false);
            }
            if (req.body.lastName) {
                req.body.lastName = COMMON.TEXT_WORD_CAPITAL(req.body.lastName, false);
            }
            if (req.body.middleName) {
                req.body.middleName = COMMON.TEXT_WORD_CAPITAL(req.body.middleName, false);
            }
            if (req.body.initialName) {
                req.body.initialName = req.body.initialName.toUpperCase();
            }
            req.body.email = req.body.email ? req.body.email.toLowerCase() : null;
        }
        if (!err) {
            const employeeData = [];
            // create Employee(if not exist) and user(if not exist)/also deleted user
            if (req.body) {
                const mWhereClause = [];
                if (req.body.code) {
                    mWhereClause.push({
                        codeDigest: {
                            [Op.eq]: COMMON.ENCRYPT(req.body.code.toString().toUpperCase())
                        }
                    });
                }
                mWhereClause.push({
                    initialName: {
                        [Op.eq]: req.body.initialName
                    }
                });
                if (req.body.email) {
                    mWhereClause.push({
                        email: {
                            [Op.eq]: req.body.email
                        }
                    });
                }
                return Employee.findAll({
                    where: {
                        [Op.or]: mWhereClause
                    }
                }).then((findemployee) => {
                    // If employee find in table with same employee code with all data excluding deleted entry
                    if (findemployee.length > 0) {
                        const activeEmp = _.find(findemployee, emp => emp.deletedAt == null);
                        // if any active employee found than give unqiue message for email or code or initial.
                        if (activeEmp) {
                            const encryptCode = COMMON.ENCRYPT((req.body.code).toUpperCase());
                            if ((activeEmp.initialName ? activeEmp.initialName.toLowerCase() : '') === (req.body.initialName ? (req.body.initialName).toLowerCase() : '')) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS_NAME.INITIAL_NAME),
                                    err: null,
                                    data: null
                                });
                            } else if (activeEmp.codeDigest === encryptCode) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS_NAME.CODE),
                                    err: null,
                                    data: null
                                });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS_NAME.EMAIL),
                                    err: null,
                                    data: null
                                });
                            }
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                fieldName: DATA_CONSTANT.EMPLOYEE.UNIQUE_FIELD
                            }, null);
                        }
                    } else {
                        req.body.password = COMMON.DEFAULT_PASSWORD;
                        if (!req.body.isActive) {
                            req.body.isActive = false;
                        }
                        if (req.body.code) {
                            req.body.codeDigest = COMMON.ENCRYPT(req.body.code.toString().toUpperCase());
                        }
                        COMMON.setModelCreatedByFieldValue(req);

                        const reqBody = {
                            Username: req.body.code,
                            Password: req.body.password,
                            Email: req.body.email
                        };
                        return createUserOnIdentityServer(reqBody, req.headers.authorization).then((resIDS) => {
                            var resUserCreated = JSON.parse(resIDS);
                            if (resUserCreated.status === STATE.SUCCESS) {
                                // validated and registered in identity server database
                                return sequelize.transaction().then(t => Employee.create(req.body, {
                                    fields: inputFields,
                                    transaction: t
                                }).then((emp) => {
                                    req.body['id'] = emp.dataValues.id;
                                    const promises = [];
                                    if (req.body.isContactPersonChanged) {
                                        promises.push(module.exports.addUpdateEmployeeContactPerson(req, res));
                                    }
                                    return Promise.all(promises).then((response) => {
                                        const failedDetail = response.find(a => a && a.status === STATE.FAILED);
                                        if (failedDetail) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: failedDetail.err ? failedDetail.err : null,
                                                data: null
                                            });
                                        }
                                        employeeData.push(emp);
                                        const tempObject = {
                                            username: req.body.code,
                                            password: req.body.password,
                                            passwordConfirmation: req.body.password,
                                            firstName: req.body.firstName,
                                            lastName: req.body.lastName,
                                            emailAddress: req.body.email,
                                            employeeID: emp.dataValues.id,
                                            createdBy: req.user.id
                                        };
                                        tempObject.passwordDigest = bcrypt.hashSync(tempObject.password, 10);
                                        let newWhereClause = [];
                                        if (!req.body.email) {
                                            newWhereClause = [{
                                                username: {
                                                    [Op.eq]: tempObject.username
                                                }
                                            }];
                                        } else {
                                            newWhereClause = [{
                                                username: {

                                                    [Op.eq]: tempObject.username
                                                }
                                            }, {
                                                emailAddress: {
                                                    [Op.eq]: tempObject.emailAddress
                                                }
                                            }];
                                        }
                                        return User.findAll({
                                            where: {
                                                [Op.or]: newWhereClause
                                            },
                                            transaction: t
                                        }).then((finduser) => {
                                            if (finduser.length > 0) {
                                                COMMON.setModelUpdatedByFieldValue(req);
                                                return User.update(tempObject, {
                                                    where: {
                                                        id: finduser[0].dataValues.id
                                                    },
                                                    fields: inputFieldsUser
                                                }).then((user) => {
                                                    if (user) {
                                                        return t.commit().then(() => {
                                                            employeeData.push({
                                                                id: finduser[0].dataValues.id
                                                            });
                                                            // Add Person master Detail into Elastic Search Engine for Enterprise Search
                                                            req.params = {
                                                                pId: emp.dataValues.id
                                                            };
                                                            // Add Person master Detail into Elastic Search Engine for Enterprise Search
                                                            // Need to change timeout code due to trasaction not get updated record
                                                            setTimeout(() => {
                                                                EnterpriseSearchController.managePersonalDetailInElastic(req);
                                                            }, 2000);
                                                            if (req.body.isContactPersonChanged) { // Manage Updated Contact Person.
                                                                if (req.body.personId) {
                                                                    req.params['personId'] = req.body.personId;
                                                                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageContactPersonInElastic);
                                                                }
                                                            }
                                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, employeeData, MESSAGE_CONSTANT.CREATED(empModuleName));
                                                        });
                                                    } else {
                                                        if (!t.finished) t.rollback();
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                            messageContent: MESSAGE_CONSTANT.NOT_CREATED(empModuleName),
                                                            err: null,
                                                            data: employeeData
                                                        });
                                                    }
                                                }).catch((error) => {
                                                    if (!t.finished) t.rollback();
                                                    console.trace();
                                                    console.error(error);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                        err: error,
                                                        data: null
                                                    });
                                                });
                                            } else {
                                                const dcryptUserID = COMMON.DECRYPT_AES(resUserCreated.data.userID);
                                                const newtempObject = {
                                                    ...tempObject,
                                                    IdentityUserId: dcryptUserID
                                                };
                                                return User.create(newtempObject, {
                                                    fields: inputFieldsUser,
                                                    transaction: t
                                                }).then(user => t.commit().then(() => {
                                                    employeeData.push(user);
                                                    // Add Person master Detail into Elastic Search Engine for Enterprise Search
                                                    req.params = {
                                                        pId: emp.dataValues.id
                                                    };
                                                    // Add Person master Detail into Elastic Search Engine for Enterprise Search
                                                    // Need to change timeout code due to trasaction not get updated record
                                                    setTimeout(() => {
                                                        EnterpriseSearchController.managePersonalDetailInElastic(req);
                                                    }, 2000);
                                                    if (req.body.isContactPersonChanged) { // Manage Updated Contact Person.
                                                        if (req.body.personId) {
                                                            req.params['personId'] = req.body.personId;
                                                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageContactPersonInElastic);
                                                        }
                                                    }
                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, employeeData, MESSAGE_CONSTANT.CREATED(empModuleName));
                                                })).catch((error) => {
                                                    if (!t.finished) t.rollback();
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                        err: error,
                                                        data: null
                                                    });
                                                });
                                            }
                                        }).catch((error) => {
                                            if (!t.finished) t.rollback();
                                            console.trace();
                                            console.error(error);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: error,
                                                data: employeeData
                                            });
                                        });
                                    }).catch((error) => {
                                        if (!t.finished) t.rollback();
                                        console.trace();
                                        console.error(error);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: error,
                                            data: employeeData
                                        });
                                    });
                                }).catch((error) => {
                                    console.trace();
                                    console.error(error);
                                    if (error.message === COMMON.VALIDATION_ERROR && error.errors && error.errors.length > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: error.errors.map(e => e.message).join(','),
                                            data: null
                                        });
                                    } else if (error.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Personnel'),
                                            err: null,
                                            data: null
                                        });
                                    } else {
                                        console.trace();
                                        console.error(error);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: error,
                                            data: null
                                        });
                                    }
                                }));
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: resUserCreated.userMessage.messageContent,
                                    err: null,
                                    data: null
                                });
                            }
                        }).catch((createUserErr) => {
                            console.error(createUserErr);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: createUserErr,
                                data: null
                            });
                        });
                    }
                }).catch((employeeCreateError) => {
                    console.error(employeeCreateError);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: employeeCreateError,
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
        } else {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        }
    },
    // Update employee by id
    // PUT : /api/v1/employees
    // @param {id} int
    // @return API response
    // eslint-disable-next-line consistent-return
    updateEmployee: (req, res) => {
        const dir = DATA_CONSTANT.EMPLOYEE.UPLOAD_PATH;
        try {
            if (typeof (req.files) === 'object' && req.files.profile) {
                const file = req.files.profile;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                const fileName = `${file.fieldName}-${uuidv1()}.${ext}`;
                const path = dir + fileName;
                req.body.profileImg = fileName;
                fsextra.move(file.path, path, (err) => {
                    module.exports.updateEmployeeDetail(req, res, err);
                });
            } else {
                module.exports.updateEmployeeDetail(req, res, null);
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        }
    },
    // Common Method for Update Employee Detail which we use in (updateEmployee API)
    updateEmployeeDetail: (req, res, err) => {
        const {
            Employee,
            User
        } = req.app.locals.models;
        // TODO when unlink old file of profile image it done. but when
        // upsert code run for profile image then automatically run
        // unlink code agian for new file and new file also delete
        req.body.email = COMMON.DECRYPT_AES(req.body.email);
        if (req.body.firstName) {
            req.body.firstName = COMMON.TEXT_WORD_CAPITAL(req.body.firstName, false);
        }
        if (req.body.lastName) {
            req.body.lastName = COMMON.TEXT_WORD_CAPITAL(req.body.lastName, false);
        }
        if (req.body.middleName) {
            req.body.middleName = COMMON.TEXT_WORD_CAPITAL(req.body.middleName, false);
        }
        if (req.body.initialName) {
            req.body.initialName = req.body.initialName.toUpperCase();
        }
        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase();
        }
        req.body.personnelType = req.body.personnelType || null;
        if (req.params.id) {
            if (err) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            } else {
                // let updateEmpDet = () =>{
                Employee.findOne({
                    where: {
                        id: req.params.id
                    },
                    attributes: ['profileImg']
                }).then((employeeprofile) => {
                    if (employeeprofile && employeeprofile.profileImg) {
                        if (!req.body.profileImg || (req.body.profileImg !== employeeprofile.profileImg)) {
                            const path = DATA_CONSTANT.EMPLOYEE.UPLOAD_PATH;
                            fs.unlink(`${path}${employeeprofile.profileImg}`, () => { });
                        }
                    }
                });
                if (req.body.code) {
                    req.body.codeDigest = COMMON.ENCRYPT((req.body.code).toUpperCase());
                }
                /* STATIC CODE START*/
                // let resultObj = _.pickBy(req.body, _.identity);
                // req.body.profileImg = req.files.length > 0 ? req.files[0].filename : req.body.profileImg ? req.body.profileImg : null;   // Multer Changes
                req.body.profileImg = req.body.profileImg;
                // req.body.burdenRate = req.body.burdenRate == "null" ? null : req.body.burdenRate;
                // req.body.firstName = req.body.firstName == "null" ? null : req.body.firstName;
                // req.body.lastName = req.body.lastName == "null" ? null : req.body.lastName;
                // req.body.middleName = req.body.middleName == "null" ? null : req.body.middleName;
                // req.body.initialName = req.body.initialName == "null" ? null : req.body.initialName;
                // req.body.managerID = req.body.managerID == "null" ? null : req.body.managerID;
                // req.body.workAreaID = req.body.workAreaID == "null" ? null : req.body.workAreaID;
                // req.body.isAddUser = req.body.isAddUser == "true" ? true : false;
                // req.body.isExternalEmployee = req.body.isExternalEmployee == "true" ? true : false;
                // req.body.isActive = req.body.isActive == "true" ? true : false;
                /* STATIC CODE END*/
                return Employee.findAll({
                    where: {
                        [Op.and]: [{
                            isDeleted: false
                        }, {
                            id: {
                                [Op.ne]: req.params.id
                            }
                        }],
                        [Op.or]: [{
                            initialName: {
                                [Op.eq]: req.body.initialName
                            }
                        }, {
                            email: {
                                [Op.eq]: req.body.email
                            }
                        }]
                    }
                }).then((findEmp) => {
                    if (findEmp.length > 0) {
                        const duplicateInitialName = _.find(findEmp, item => item && item.initialName && ((item.initialName).toLowerCase()) === ((req.body.initialName).toLowerCase()));
                        if (duplicateInitialName) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS_NAME.INITIAL_NAME),
                                err: null,
                                data: null
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS_NAME.EMAIL),
                                err: null,
                                data: null
                            });
                        }
                    } else {
                        // update employee data.
                        COMMON.setModelUpdatedByFieldValue(req);
                        // from UI side NULL properties are removed and not passed in req.body.
                        // So as those properties are not in req.body, NULL values of them are not update into database
                        inputFieldsUpdate.forEach((field) => {
                            if (!req.body[field]) {
                                req.body[field] = null;
                            }
                        });
                        if (!req.body.isActive) {
                            req.body.isActive = false;
                        }
                        const promises = [];
                        promises.push(User.findOne({
                            where: { employeeID: req.params.id },
                            attributes: ['username', 'id']
                        }).then((validUser) => {
                            const updateEmailDetails = {
                                Email: req.body.email,
                                Username: validUser.username
                            };
                            return UpdateUser(updateEmailDetails, req.headers.authorization).then((responses) => {
                                const response = JSON.parse(responses);
                                return { status: response.status };
                            }).catch(error => ({ status: STATE.FAILED, err: error }));
                        }));

                        if (req.body.isContactPersonChanged) {
                            promises.push(module.exports.addUpdateEmployeeContactPerson(req, res));
                        }
                        Promise.all(promises).then((result) => {
                            if (result && Array.isArray(result)) {
                                const failedDetail = result.find(a => a && a.status === STATE.FAILED);
                                if (!failedDetail) {
                                    return Employee.update(req.body, {
                                        where: {
                                            id: req.params.id
                                        },
                                        fields: inputFieldsUpdate
                                        // transaction: t
                                        // }, {  })
                                    }).then(() => {
                                        return module.exports.getEmpFormattedName(req, res).then((resp) => {
                                            if (resp && resp.status === STATE.SUCCESS) {
                                                const formattedEmpName = resp.data;
                                                const tempObject = {
                                                    username: req.body.code,
                                                    // password: req.body.password,
                                                    // passwordConfirmation: req.body.password,
                                                    firstName: req.body.firstName,
                                                    lastName: req.body.lastName,
                                                    emailAddress: req.body.email,
                                                    employeeID: req.params.id,
                                                    updatedBy: req.user.id
                                                };
                                                return User.findOne({
                                                    where: {
                                                        [Op.and]: [{
                                                            isDeleted: false
                                                        }, {
                                                            username: {
                                                                [Op.eq]: tempObject.username
                                                            }
                                                        }]
                                                    }
                                                }).then((finduser) => {
                                                    let userData;
                                                    if (finduser) {
                                                        COMMON.setModelUpdatedByFieldValue(req);
                                                        return User.update(tempObject, {
                                                            where: {
                                                                id: finduser.dataValues.id
                                                            },
                                                            fields: inputFieldsUser
                                                        }).then((user) => {
                                                            if (user) {
                                                                // Add/Edit Person master Detail into Elastic Search Engine for Enterprise Search
                                                                req.params = {
                                                                    pId: req.params.id
                                                                };
                                                                // Add/Edit Person master Detail into Elastic Search Engine for Enterprise Search
                                                                // Need to change timeout code due to trasaction not get updated record
                                                                setTimeout(() => {
                                                                    EnterpriseSearchController.managePersonalDetailInElastic(req);
                                                                }, 2000);
                                                                if (req.body.isContactPersonChanged) { // Manage Updated Contact Person.
                                                                    const reqObj = _.cloneDeep(req);
                                                                    if (reqObj.body.oldPersonId) {
                                                                        reqObj.params['personId'] = reqObj.body.oldPersonId;
                                                                        EnterpriseSearchController.proceedTransction(reqObj, EnterpriseSearchController.manageContactPersonInElastic);
                                                                    }
                                                                    if (req.body.personId) {
                                                                        req.params['personId'] = req.body.personId;
                                                                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageContactPersonInElastic);
                                                                    }
                                                                }
                                                                userData = {
                                                                    id: finduser.id,
                                                                    formattedName: formattedEmpName
                                                                };
                                                                if (userData) {
                                                                    userData.profileImg = req.body.profileImg;
                                                                }
                                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, userData, MESSAGE_CONSTANT.UPDATED(empModuleName));
                                                            } else {
                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                                    messageContent: MESSAGE_CONSTANT.NOT_UPDATED(empModuleName),
                                                                    err: null,
                                                                    data: null
                                                                });
                                                            }
                                                        }).catch((error) => {
                                                            console.trace();
                                                            console.error(error);
                                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                                err: error,
                                                                data: null
                                                            });
                                                        });
                                                    } else {
                                                        return User.create(tempObject, {
                                                            fields: inputFieldsUser
                                                        }, {

                                                        }).then((user) => {
                                                            user.formattedName = formattedEmpName;
                                                            // Add/Edit Person master Detail into Elastic Search Engine for Enterprise Search
                                                            req.params = { pId: req.params.id };
                                                            // Add/Edit Person master Detail into Elastic Search Engine for Enterprise Search
                                                            // Need to change timeout code due to trasaction not get updated record
                                                            setTimeout(() => {
                                                                EnterpriseSearchController.managePersonalDetailInElastic(req);
                                                            }, 2000);
                                                            if (req.body.isContactPersonChanged) { // Manage Updated Contact Person.
                                                                req.params['personId'] = req.body.oldPersonId;
                                                                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageContactPersonInElastic);
                                                                req.params['personId'] = req.body.personId;
                                                                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageContactPersonInElastic);
                                                            }
                                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, user, MESSAGE_CONSTANT.UPDATED(empModuleName));
                                                        }).catch((error) => {
                                                            console.trace();
                                                            console.error(error);
                                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
                                                        });
                                                    }
                                                }).catch((error) => {
                                                    console.trace();
                                                    console.error(error);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                        err: error,
                                                        data: null
                                                    });
                                                });
                                            } else {
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                    messageContent: resp && resp.messageContent ? resp.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: resp && resp.err ? resp.err : null,
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
                                    }).catch((error) => {
                                        console.trace();
                                        console.error(error);
                                        if (error.message === COMMON.VALIDATION_ERROR && error.errors && error.errors.length > 0) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: error.errors.map(e => e.message).join(','),
                                                data: null
                                            });
                                        } else if (error.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Personnel'),
                                                err: null,
                                                data: null
                                            });
                                        } else {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: error,
                                                data: null
                                            });
                                        }
                                    });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: failedDetail.err ? failedDetail.err : null,
                                        data: null
                                    });
                                }
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: null,
                                    data: null
                                });
                            }
                        }).catch((error) => {
                            console.trace();
                            console.error(error);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: null,
                                data: null
                            });
                        });
                    }
                }).catch((error) => {
                    console.trace();
                    console.error(error);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: error,
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

    addUpdateEmployeeContactPerson: (req, res) => {
        const { EmployeeContactPerson } = req.app.locals.models;
        // Release Pervious Contact Person if any.
        if (req.body && req.body.id) {
            const obj = {
                releasedAt: COMMON.getCurrentUTC()
            }
            COMMON.setModelUpdatedByFieldValue(obj);
            return EmployeeContactPerson.update(obj, {
                where: {
                    [Op.or]: [
                        { employeeId: req.body.id },
                        { contactPersonId: req.body.personId || null } // Temp. untill Refactor Add/Update Employee API.
                    ],
                    releasedAt: null
                },
                fields: ['releasedAt', 'updatedAt', 'updatedBy', 'updateByRoleId']
            }).then(() => {
                if (req.body.personId) {
                    const empContactPersonObj = {
                        employeeId: req.body.id,
                        contactPersonId: req.body.personId,
                        assignedAt: COMMON.getCurrentUTC()
                    };
                    COMMON.setModelCreatedByFieldValue(empContactPersonObj);
                    return EmployeeContactPerson.create(empContactPersonObj, {
                        fields: ['employeeId', 'contactPersonId', 'assignedAt', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'createByRoleId', 'updateByRoleId']
                    }).then(() => {
                        return { status: STATE.SUCCESS };
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return { status: STATE.FAILED, err: err };
                    });
                } else {
                    return { status: STATE.SUCCESS };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err: err };
            });
        } else {
            return { status: STATE.FAILED };
        }
    },

    // Delete employee
    // DELETE : /api/v1/employees
    // @param {id} int
    // @param {isPermanentDelete} boolean
    // @return API response
    deleteEmployee: (req, res) => {
        const {
            Employee,
            GenericFiles,
            User,
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Employee.Name;
            const entityID = COMMON.AllEntityIDS.Employee.ID;
            const Entity = COMMON.AllEntityIDS.Employee;
            let employeeprofile;
            let genericList;
            //   ids = req.body.objIDs.id.split(',');
            return Employee.findAll({
                where: {
                    id: {
                        [Op.in]: req.body.objIDs.id
                    }
                },
                attributes: ['profileImg']
            }).then((employeeData) => {
                employeeprofile = employeeData;
                COMMON.setModelDeletedByFieldValue(req);

                User.findAll({
                    where: {
                        employeeID: req.body.objIDs.id
                    },
                    attributes: ['IdentityUserId']
                }).then((value) => {
                    const userIdList = [];
                    _.each(value, (user) => {
                        userIdList.push(user.IdentityUserId);
                    });
                    return sequelize.transaction().then((t) => {
                        sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                            replacements: {
                                tableName: tableName,
                                IDs: req.body.objIDs.id.toString(),
                                deletedBy: req.user.id,
                                entityID: entityID,
                                refrenceIDs: null,
                                countList: req.body.objIDs.CountList,
                                pRoleID: COMMON.getRequestUserLoginRoleID(req)
                            },
                            transaction: t
                        }).then((empDetail) => {
                            if (empDetail.length === 0) {
                                removeUserFromIdentity(userIdList, req.headers.authorization).then((respDel) => {
                                    const resUserDeleted = JSON.parse(respDel);
                                    if (resUserDeleted.status === STATE.SUCCESS) {
                                        return GenericFiles.findAll({
                                            where: {
                                                refTransID: {
                                                    [Op.in]: req.body.objIDs.id
                                                },
                                                gencFileOwnerType: Entity.Name
                                            }
                                        }).then((genericfilesdata) => {
                                            genericList = genericfilesdata;
                                            COMMON.setModelDeletedByFieldValue(req);
                                            GenericFiles.update(req.body, {
                                                where: {
                                                    refTransID: {
                                                        [Op.in]: req.body.objIDs.id
                                                    },
                                                    gencFileOwnerType: Entity.Name,
                                                    deletedAt: null
                                                },
                                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy']
                                            }).then(() => {
                                                if (req.body.objIDs.isPermanentDelete === true) {
                                                    // Delete generic Document
                                                    _.each(genericList, (itemData) => {
                                                        fs.unlink(`.${itemData.genFilePath}`, () => { });
                                                        return Promise.resolve(itemData);
                                                    });
                                                    // Delete profile image
                                                    _.each(employeeprofile, (data) => {
                                                        if (data && data.profileImg) {
                                                            const docpath = `${DATA_CONSTANT.EMPLOYEE.UPLOAD_PATH}${data.profileImg}`;
                                                            fs.unlink(docpath, () => { });
                                                        }
                                                    });
                                                }
                                                RFQSocketController.logOutDeletedUserFromAllDevices(req, req.body.objIDs.id);
                                                // Remove Personal Detail from Elastic Engine Database
                                                EnterpriseSearchController.deletePersonalDetailInElastic(req.body.objIDs.id.toString());
                                                t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, empDetail, MESSAGE_CONSTANT.DELETED(empModuleName)));
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
                                        });
                                    } else {
                                        // failed on Server Side
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: 'Error',
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
                            } else {
                                t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    transactionDetails: empDetail,
                                    IDs: req.body.objIDs.id
                                }, null)).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Retrive list of operation employee
    // GET : /api/v1/retrieveEmployeeOperations
    // @param {id} int
    // @return list of operation employee
    retrieveEmployeeOperations: (req, res) => {
        const { Employee, Operation, OperationEmployee } = req.app.locals.models;
        if (req.params.id) {
            return Employee.findByPk(req.params.id).then((data) => {
                const obj = {};
                obj.employee = data;
                return Operation.findAll({
                    attributes: ['opID', 'opName', 'opNumber', 'opStatus', 'shortDescription'],
                    include: [{
                        model: OperationEmployee,
                        as: 'operationEmployee',
                        where: {
                            employeeID: req.params.id
                        },
                        required: false
                    }]
                }).then((employee) => {
                    if (!employee) {
                        return Promise.reject(MESSAGE_CONSTANT.MASTER.OPERATION_OF_EMPLOYEE_NOT_FOUND);
                    }
                    obj.operationList = employee;
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
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
    },
    // Create operation employee list
    // POST : /api/v1/employees/createOperation_EmployeeList
    // @return API response
    createOperation_EmployeeList: (req, res) => {
        const {
            sequelize,
            OperationEmployee
        } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.operationList);
            return sequelize.transaction().then(t => OperationEmployee.bulkCreate(req.body.listObj.operationList, {
                updateOnDuplicate: operationemployeeInputFields,
                transaction: t
            }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.OPERATION_FOR_EMPLOYEE_SAVED))).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE,
                        err: null,
                        data: null
                    });
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Retrive employee profile by id
    // GET : /api/v1/retrieveEmployeeProfile
    // @param {id} int
    // @return employee profile
    retrieveEmployeeProfile: (req, res) => {
        const {
            Employee,
            EmployeeEquipment,
            WorkorderCertification,
            StandardClass,
            CertificateStandards,
            Equipment,
            Operation,
            OperationEmployee,
            Department,
            WorkorderOperationEmployee,
            Workorder,
            EmployeeDepartment,
            GenericCategory,
            Component,
            CountryMst,
            RFQRoHS
        } = req.app.locals.models;
        if (req.params.id) {
            Employee.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                attributes: ['firstName', 'lastName', 'email', 'contact', 'burdenRate', 'city', 'state', 'countryID', 'street1', 'street2', 'street3', 'postcode', 'profileImg'],
                include: [{
                    model: CountryMst,
                    as: 'countryMst',
                    attributes: ['countryName'],
                    required: false
                }, {
                    model: EmployeeDepartment,
                    as: 'employeeDepartment',
                    attributes: ['departmentID', 'titleID', 'isDefault'],
                    include: [{
                        model: Department,
                        as: 'department',
                        attributes: ['deptName']
                    }, {
                        model: GenericCategory,
                        as: 'genericCategory',
                        attributes: ['gencCategoryName']
                    }]
                }, {
                    model: Employee,
                    as: 'managerEmployee',
                    attributes: ['id', 'firstName', 'lastName']
                }, {
                    model: WorkorderOperationEmployee,
                    attributes: ['woOpEmployeeID', 'woID', 'employeeID', 'opID'],
                    as: 'workorderOperationEmployee',
                    include: [{
                        model: Workorder,
                        as: 'workorder',
                        attributes: ['woID', 'woNumber', 'woStatus', 'woSubStatus', 'RoHSStatusID', 'woVersion', 'partID'],
                        include: [{
                            model: WorkorderCertification,
                            as: 'workorderCertification',
                            include: [{
                                model: CertificateStandards,
                                as: 'certificateStandards',
                                attributes: ['certificateStandardID', 'fullName', 'shortName', 'standardTypeID', 'priority', 'standardInfo']
                            }, {
                                model: StandardClass,
                                as: 'standardsClass',
                                attributes: ['certificateStandardID', 'classID', 'className', 'colorCode']
                            }]
                        }, {
                            model: Component,
                            as: 'componentAssembly',
                            attributes: ['mfgPN', 'PIDCode', 'nickName', 'rev', 'id', 'mfgPNDescription']
                        }, {
                            model: RFQRoHS,
                            as: 'rohs',
                            attributes: ['id', 'name', 'rohsIcon']
                        }]
                    }]
                }, {
                    model: OperationEmployee,
                    attributes: ['opID', 'employeeID', 'opEmployeeID'],
                    as: 'operationEmployee',
                    include: [{
                        model: Operation,
                        as: 'Operations',
                        attributes: ['opName', 'opNumber', 'opStatus']
                    }]
                }, {
                    model: EmployeeEquipment,
                    as: 'employeeEquipment',
                    attributes: ['empEqpID', 'employeeID', 'eqpID'],
                    where: {
                        employeeID: req.params.id
                    },
                    include: [{
                        model: Equipment,
                        as: 'equipment',
                        attributes: ['eqpID', 'assetName', 'eqpMake', 'eqpModel', 'eqpYear', 'eqpTypeID', 'locationTypeID', 'departmentID'],
                        where: {
                            equipmentAs: 'W'
                        },
                        include: [{
                            model: GenericCategory,
                            as: 'equipmentType',
                            attributes: ['gencCategoryID', 'gencCategoryName']
                        }, {
                            model: GenericCategory,
                            as: 'locationType',
                            attributes: ['gencCategoryID', 'gencCategoryName']
                        }, {
                            model: Department,
                            as: 'equipmentDepartment',
                            attributes: ['deptID', 'deptName']
                        }],
                        required: false
                    }],
                    required: false
                }]
            }).then((data) => {
                const obj = {};
                obj.employeeProfile = data;
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
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
    },
    // Retrive list of employee for manager list
    // GET : /api/v1/employeeList
    // @return list of employee for manager list
    employeeAsManagerList: async (req, res) => {
        const {
            Employee,
            EmployeeDepartment,
            Department,
            GenericCategory,
            sequelize
        } = req.app.locals.models;
        const whereClause = {
            isDeleted: false,
            isActive: true
        };
        
        try {
            var functionDetail = await sequelize.query('Select fun_getEmployeeDisplayFormat() as employeeNameFormat ', {
                type: sequelize.QueryTypes.SELECT
            });
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }

        if (req.query.searchquery) {
            whereClause[Op.or] = {
                firstName: {
                    [Op.like]: `%${req.query.searchquery}%`
                },
                lastName: {
                    [Op.like]: `%${req.query.searchquery}%`
                },
                initialName: {
                    [Op.like]: `%${req.query.searchquery}%`
                }
            };
        }
        return await Employee.findAll({
            attributes: ['id', 'firstName', 'lastName', 'managerID', 'profileImg', 'initialName',[sequelize.fn('fun_GetEmployeeFormattedName', sequelize.col('Employee.firstName'), sequelize.col('Employee.middleName'), sequelize.col('Employee.lastName'), sequelize.col('Employee.initialName'), functionDetail[0].employeeNameFormat), 'formattedEmpName']],
            where: whereClause,
            include: [{
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
                }, {
                    model: GenericCategory,
                    as: 'genericCategory',
                    attributes: ['gencCategoryName']
                }]
            }],
            order: [
                ['firstName', 'ASC']
            ]
        }).then(employees =>
            // console.log(employees.rows);
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, employees, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
    },
    // Retrive list of work station detail by id
    // GET : /api/v1/retrieveWorkStationDetail
    // @param {id} int
    // @return list of workStation detail
    retrieveWorkStationDetail: (req, res) => {
        const {
            Equipment,
            GenericFiles,
            EmployeeEquipment,
            sequelize
        } = req.app.locals.models;
        let equipmentData;
        if (req.params.id) {
            return sequelize.transaction(() => Equipment.findAll({
                where: {
                    equipmentAs: 'W'
                },
                attributes: ['eqpID', 'assetName', 'eqpMake', 'eqpModel', 'eqpYear', 'isActive'],
                include: [{
                    model: EmployeeEquipment,
                    as: 'employeeEquipment',
                    attributes: ['empEqpID', 'employeeID', 'eqpID'],
                    where: {
                        employeeID: req.params.id
                    },
                    required: false
                }]
            }).then((getEquipmentData) => {
                equipmentData = getEquipmentData;
                let eqpIds = _.map(getEquipmentData, 'eqpID');
                eqpIds = eqpIds ? eqpIds : [];
                return GenericFiles.findAll({
                    where: {
                        refTransID: {
                            [Op.in]: eqpIds
                        },
                        gencFileOwnerType: COMMON.AllEntityIDS.Employee.Name,
                        isRecycle: false,
                        gencFileName: {
                            [Op.like]: 'profile%'
                        }
                    },
                    raw: true,
                    attributes: ['gencFileName', 'refTransID']
                }).then((profileData) => {
                    if (equipmentData && equipmentData.length > 0 && profileData && profileData.length > 0) {
                        _.each(equipmentData, (eqpment) => {
                            _.each(profileData, (profile) => {
                                if (parseInt(profile.refTransID) === parseInt(eqpment.eqpID)) {
                                    eqpment.dataValues.genericFiles = profile;
                                }
                            });
                        });
                    }
                });
            })).then(() => {
                if (!equipmentData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(empEquiModuleName),
                        err: null,
                        data: null
                    });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, equipmentData, null);
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
    // Create workStation equipment list
    // POST : /api/v1/employees/createWorkstation_EquipmentList
    // @return API response
    createWorkstation_EquipmentList: (req, res) => {
        const {
            sequelize,
            EmployeeEquipment
        } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.equipmentList);
            return sequelize.transaction().then(t => EmployeeEquipment.bulkCreate(req.body.listObj.equipmentList, {
                individualHooks: true,
                transaction: t
            }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.WORKSTATION_ADDED_TO_EMPLOYEE))).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE,
                        err: null,
                        data: null
                    });
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Delete workStation equipment list from employee
    // DELETE : /api/v1/deleteWorkstation_EquipmentListFromEmployee
    // @return API response
    deleteWorkstation_EquipmentListFromEmployee: (req, res) => {
        const {
            sequelize,
            EmployeeEquipment
        } = req.app.locals.models;
        if (req.query && req.query.employeeID && req.query.equipmentIDs) {
            COMMON.setModelDeletedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                EmployeeEquipment.update(req.body, {
                    where: {
                        EmployeeID: req.query.employeeID,
                        eqpID: req.query.equipmentIDs,
                        deletedAt: null
                    },
                    fields: inputFields,
                    transaction: t
                }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.WORKSTATION_DELETED_FROM_EMPLOYEE))).catch((err) => {
                    if (!t.finished) t.rollback();
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
    // Delete operations of employee
    // DELETE : /api/v1/deleteOperationsOfEmployee
    // @return API response
    deleteOperationsOfEmployee: (req, res) => {
        const {
            sequelize,
            OperationEmployee
        } = req.app.locals.models;
        const promises = [];
        const err = {
            message: 'custom'
        };
        if (req.query && req.query.employeeID && req.query.opIDs) {
            COMMON.setModelDeletedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                promises.push(OperationEmployee.findAll({
                    where: {
                        isDeleted: false,
                        employeeID: req.query.employeeID,
                        opID: req.query.opIDs
                    },
                    transaction: t
                }).then((result) => {
                    const opEmpIds = result.map(opEmp => opEmp.opEmployeeID);
                    return OperationEmployee.update(req.body, {
                        where: {
                            employeeID: req.query.employeeID,
                            opID: req.query.opIDs,
                            opEmployeeID: {
                                [Op.in]: opEmpIds
                            },
                            deletedAt: null
                        },
                        fields: inputFields,
                        transaction: t
                    }).then(() => ({
                        status: STATE.SUCCESS
                    })
                        // return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.OPERATION_DELETED_FROM_EMPLOYEE);
                    ).catch((error) => {
                        if (!t.finished) t.rollback();
                        console.trace();
                        console.error(error);
                        return {
                            status: STATE.FAILED
                        };
                        // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((error) => {
                    if (!t.finished) t.rollback();
                    console.trace();
                    console.error(error);
                    return {
                        status: STATE.FAILED
                    };
                    // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }));
                return Promise.all(promises).then((result) => {
                    var resCheck = _.find(result, resp => resp.status !== STATE.SUCCESS);
                    if (!resCheck) {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.OPERATION_DELETED_FROM_EMPLOYEE));
                    } else {
                        if (!t.finished) t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
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
    // Check Employee has any Active transaction or not by id
    // GET : /api/v1/isactiveTransEmployee
    // @param {id} int
    // @return status of employee active transaction
    isactiveTransEmployee: (req, res) => {
        const {
            WorkorderTransEmpinout
        } = req.app.locals.models;
        if (req.params.id) {
            WorkorderTransEmpinout.findAll({
                where: {
                    employeeID: req.params.id,
                    checkoutTime: null,
                    isDeleted: false
                }
            }).then(employeeActiveTrans => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, employeeActiveTrans, null)).catch((err) => {
                console.trace();
                console.error(err);
                // resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.NOT_FOUND(empModuleName));
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }
    },
    // update employee password
    // GET : /api/v1/employees/changePassword
    // @param employee id, password
    // @return status success
    changePassword: (req, res) => {
        const {
            User
        } = req.app.locals.models;
        req.body.passwordOld = COMMON.DECRYPT_AES(req.body.passwordOld);
        req.body.password = COMMON.DECRYPT_AES(req.body.password);
        req.body.passwordConfirmation = COMMON.DECRYPT_AES(req.body.passwordConfirmation);
        const userID = COMMON.getRequestUserID(req);
        User.findOne({
            attributes: ['id', 'passwordDigest'],
            where: {
                id: userID
            }
        }).then((user) => {
            if (user) {
                return user.authenticate(req.body.passwordOld).then(() => {
                    if (req.body.passwordOld === req.body.password) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.MASTER.OLD_NEW_PASSWORD_DIFFERENT,
                            err: null,
                            data: null
                        });
                    } else {
                        COMMON.setModelUpdatedByFieldValue(req);
                        req.body.passwordDigest = bcrypt.hashSync(req.body.password, 10);
                        return User.update(req.body, {
                            where: {
                                id: userID
                            },
                            fields: ['password', 'passwordDigest', 'passwordConfirmation']
                        }).then((userDet) => {
                            if (userDet) {
                                const obj = {
                                    userID: userID,
                                    empID: null
                                };
                                RFQSocketController.logOutUserFromAllDevices(req, obj);
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    id: userID
                                }, MESSAGE_CONSTANT.MASTER.PASSWORD_UPDATED);
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.MASTER.PASSWORD_NOT_UPDATED,
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
                    }
                });
                // .catch((err) => {
                //     return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                // })
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.MASTER.USER_PASSWORD_INCORRECT,
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            if (err instanceof NotMatchingPassword || err instanceof NotFound) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.MASTER.USER_PASSWORD_INCORRECT,
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
    // authenticate employee password
    // GET : /api/v1/employees/authenticateUser
    // @param employee id, oldPassword
    // @return status success
    authenticateUser: (req, res) => {
        req.body.passwordOld = COMMON.DECRYPT_AES(req.body.passwordOld);
        const {
            User
        } = req.app.locals.models;
        const userID = COMMON.getRequestUserID(req);
        User.findOne({
            attributes: ['id', 'passwordDigest'],
            where: {
                id: userID
            }
        }).then((user) => {
            if (user) {
                return user.authenticate(req.body.passwordOld).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, true, null)
                    // return resHandler.successRes(res, 201, STATE.SUCCESS, true, null);
                );
                // .catch((err) => {
                //     return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, false, null);
                // })
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.MASTER.USER_PASSWORD_INCORRECT,
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            if (err instanceof NotMatchingPassword || err instanceof NotFound) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.MASTER.USER_PASSWORD_INCORRECT,
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
    // update employee default chart category (widget tab - dashboard)
    // GET : /api/v1/employees/updateEmployeeDefaultChartCategory
    // @param employee id and chartCategoryID
    // @return status success
    updateEmployeeDefaultChartCategory: (req, res) => {
        const {
            Employee
        } = req.app.locals.models;
        if (req.body.employeeID) {
            COMMON.setModelUpdatedByFieldValue(req);
            return Employee.update(req.body, {
                where: {
                    id: req.body.employeeID
                },
                fields: ['defaultChartCategoryID']
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(chartCategoryModuleName))).catch((err) => {
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
    // check EmailID Already Exists
    // POST : /api/v1/employee/checkEmailIDAlreadyExists
    // @return API response
    checkEmailIDAlreadyExists: (req, res) => {
        const Employee = req.app.locals.models.Employee;
        let whereClause = '';
        if (req.body) {
            if (req.body.objs.checkFieldName === 'email') {
                whereClause = {
                    email: COMMON.DECRYPT_AES(req.body.objs.checkUniquefieldValue) // req.body.objs.checkUniquefieldValue
                };
            } else if (req.body.objs.checkFieldName === 'code') {
                whereClause = {
                    codeDigest: COMMON.ENCRYPT(req.body.objs.checkUniquefieldValue.toString().toUpperCase()) // req.body.objs.checkUniquefieldValue
                };
            } else if (req.body.objs.checkFieldName === 'initialName') {
                whereClause = {
                    initialName: req.body.objs.checkUniquefieldValue
                };
            }
            if (req.body.objs.id) {
                whereClause.id = {
                    [Op.notIn]: [req.body.objs.id]
                };
            }
            Employee.findOne({
                where: whereClause
            }).then((isExists) => {
                if (isExists) {
                    if (req.body.objs.checkFieldName === DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS.EMAIL) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS_NAME.EMAIL),
                            err: null,
                            data: {
                                isDuplicateEmail: true
                            }
                        });
                    } else if (req.body.objs.checkFieldName === DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS.CODE) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS_NAME.CODE),
                            err: null,
                            data: {
                                isDuplicateCode: true
                            }
                        });
                    } else if (req.body.objs.checkFieldName === DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS.INITIAL_NAME) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.EMPLOYEE_UNIQUE_CHECK_FIELDS_NAME.INITIAL_NAME),
                            err: null,
                            data: {
                                isDuplicateInitialName: true
                            }
                        });
                    }
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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
    },
    // check download employee template
    // GET : /api/v1/employee/downloadGenericCategoryTemplate
    // @return API response
    downloadPersonnelTemplate: (req, res) => {
        const categoryTypeName = `${req.params.module}.xlsx`;
        var path = DATA_CONSTANT.EMPLOYEE.DOWNLOAD_PATH + categoryTypeName;
        // eslint-disable-next-line consistent-return
        fs.readFile(path, (err) => {
            if (err) {
                if (err.code === COMMON.FileErrorMessage.NotFound) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND,
                        err: null,
                        data: null
                    });
                } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                }
            } else {
                const file = path;
                res.setHeader('Content-disposition', `attachment; filename=${categoryTypeName}`);
                res.setHeader('Content-type', 'application/vnd.ms-excel');
                const filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }
        });
    },
    // Retrive list of employee by customer personnel mapping
    // GET : /api/v1/employees/getEmployeeListByCustomer
    // @return list of employee
    getEmployeeListByCustomer: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetEmployeelistBasedOnCustomerMapping (:pCustomerID,:psalesCommissionToID)', {
            replacements: {
                pCustomerID: req.query.customerID || null,
                psalesCommissionToID: req.query.salesCommissionToID || null
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
    },
    // Retrive list of employees
    // POST : /api/v1/employees/GetEmployeeDetail
    // @return list of employees
    GetEmployeeDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetEmployeeDetail (:pOnlyActiveRecord)', {
            replacements: {
                pOnlyActiveRecord: req.body ? req.body.isOnlyActive : false
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
    },

    // Retrive Current Contact Person by EmployeeID.
    // POST : /api/v1/employees/GerCurrentContactPersonByEmpId
    // @return list of Current contact Person by EmpId
    GerCurrentContactPersonByEmpId: async (req, res) => {
        const { sequelize, EmployeeContactPerson, ContactPerson } = req.app.locals.models;
        if (req.body && req.body.empId) {
            try {
                var functionDetail = await sequelize.query('Select fun_getTimeZone() as TimeZone,fun_getDateTimeFormat() as dateFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });

                var cpNamefunDetail = await sequelize.query('Select fun_getContPersonNameDisplayFormat() as contPersonNameFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return await EmployeeContactPerson.findAll({
                where: {
                    employeeId: req.body.empId,
                    releasedAt: null
                },
                attributes: ['id', 'contactPersonId', 'employeeId', [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('employeeContactPerson.assignedAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'assignedAt']],
                include: [{
                    model: ContactPerson,
                    as: 'contactPerson',
                    attributes: ['personId', 'title', 'division', [sequelize.fn('fun_GetFormattedContactPersonName', sequelize.col('contactPerson.firstName'), sequelize.col('contactPerson.middleName'), sequelize.col('contactPerson.lastName'), cpNamefunDetail[0].contPersonNameFormat), 'fullName']],
                    required: false
                }]
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { contactPersons: response }, null)).catch((err) => {
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

    // Release Contact Person.
    // POST : /api/v1/employees/releaseContactPersonById
    // @return Release Contact Person.
    releaseContactPersonById: async (req, res) => {
        const { EmployeeContactPerson } = req.app.locals.models;
        if (req.body && req.body.contactPersonData) {
            const obj = {
                releasedAt: COMMON.getCurrentUTC()
            }
            COMMON.setModelUpdatedByFieldValue(obj);
            return EmployeeContactPerson.update(obj, {
                where: {
                    id: req.body.contactPersonData.id,
                    releasedAt: null
                },
                fields: ['releasedAt', 'updatedAt', 'updatedBy', 'updateByRoleId']
            }).then(() => {
                req.params['personId'] = req.body.contactPersonData.contactPersonId;
                req.params['pId'] = req.body.contactPersonData.employeeId;
                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageContactPersonInElastic);
                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.managePersonalDetailInElastic);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(empModuleName));
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

    // Delete Contact Person.
    // POST : /api/v1/employees/deleteEmployeeContactPerson
    // @return Delete Contact Person.
    deleteEmployeeContactPerson: async (req, res) => {
        const { EmployeeContactPerson } = req.app.locals.models;
        // Release Pervious Contact Person if any.
        if (req.body && req.body.contactPersonData) {
            const deleteObj = {};
            COMMON.setModelDeletedByFieldValue(deleteObj);
            return EmployeeContactPerson.update(deleteObj, {
                where: {
                    id: req.body.contactPersonData.id
                },
                fields: ['isDeleted', 'updatedAt', 'updatedBy', 'updateByRoleId', 'deletedAt', 'deletedBy', 'deleteByRoleId']
            }).then(() => {
                req.params['personId'] = req.body.contactPersonData.contactPersonId;
                req.params['pId'] = req.body.contactPersonData.employeeId;
                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageContactPersonInElastic);
                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.managePersonalDetailInElastic);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(DATA_CONSTANT.CUSTOMER_CONTACTPERSON.NAME));
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

    // To Get EmployeeFormatted Name.
    getEmpFormattedName: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query(`Select fun_GetEmployeeFormattedName('${req.body.firstName}','${req.body.middleName || null}','${req.body.lastName}','${req.body.initialName || null}',fun_getEmployeeDisplayFormat()) as formattedName`, {
                type: sequelize.QueryTypes.SELECT
            }).then(response => {
                return { status: STATE.SUCCESS, data: response && response[0] ? response[0].formattedName : null }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err: err };
            });
        } else {
            return { status: STATE.FAILED, messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER };
        }
    }
};