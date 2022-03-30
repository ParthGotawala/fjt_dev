const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const empCertiModuleName = DATA_CONSTANT.EMPLOYEE_CERTIFICATION.NAME;


module.exports = {
    // Save employee certification list
    // POST : /api/v1/employee_certification/saveEmployeeCertification
    // @return API response
    saveEmployeeCertification: (req, res) => {
        if (req.body && req.body.listObj) {
            const { EmployeeCertification, sequelize } = req.app.locals.models;

            return sequelize.transaction().then((t) => {
                const promises = [];

                /* delete employee certificate that user removed */
                if (req.body.listObj.deleteExistingEmpCertiIDs.length > 0) {
                    COMMON.setModelDeletedByFieldValue(req);
                    promises.push(EmployeeCertification.update(req.body, {
                        where: {
                            id: req.body.listObj.deleteExistingEmpCertiIDs
                        },
                        fields: ['deletedBy', 'isDeleted', 'deletedAt', 'updatedBy'],
                        transaction: t
                    }));
                }

                /* create new employee certificate */
                if (req.body.listObj.addNewEmpCertiIDs.length > 0) {
                    _.each(req.body.listObj.addNewEmpCertiIDs, (stdItem) => {
                        stdItem.createdBy = req.user.id;
                        stdItem.updatedBy = req.user.id;
                    });

                    promises.push(EmployeeCertification.bulkCreate(req.body.listObj.addNewEmpCertiIDs, {
                        transaction: t
                    }));
                }

                Promise.all(promises).then(() => {
                    t.commit();
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(empCertiModuleName));
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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

    // Save employee standard personnel list
    // POST : /api/v1/employee_certification/savePersonnelStandard
    // @return API response
    savePersonnelStandard: (req, res) => {
        const { EmployeeCertification, sequelize } = req.app.locals.models;
        /* create new employee certificate */
        if (req.body.listObj && req.body.listObj.employeeID && req.body.listObj.employeeID.length > 0) {
            const promises = [];
            return sequelize.transaction().then((t) => {
                _.each(req.body.listObj.employeeID, (stdItem) => {
                    stdItem.createdBy = req.user.id;
                    stdItem.updatedBy = req.user.id;
                    const where = {};

                    where.isDeleted = false;
                    where.employeeID = stdItem.employeeID;
                    where.certificateStandardID = stdItem.certificateStandardID;
                    if (stdItem.classID) {
                        where.classID = stdItem.classID;
                    }

                    promises.push(
                        EmployeeCertification.findOne({
                            where: where,
                            attributes: ['id'],
                            transaction: t
                        }).then((isExists) => {
                            if (isExists) {
                                return {
                                    status: STATE.SUCCESS
                                };
                            } else {
                                return EmployeeCertification.create(stdItem, {
                                    transaction: t
                                }).then(response => ({
                                        status: STATE.SUCCESS,
                                        id: response.id
                                    })).catch((err) => {
                                    if (!t.finished) { t.rollback(); }
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.NOT_CREATED(empCertiModuleName)
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
                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(empCertiModuleName)));
                        } else {
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(empCertiModuleName), err: null, data: null });
                        }
                    }).catch((err) => {
                        if (!t.finished) t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(empCertiModuleName));
                }
            }).catch(err =>
                // if (!t.finished) t.rollback();
                 resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Save employee standard personnel list
    // POST : /api/v1/employee_certification/retrieveAssignedStandardEmployees
    // @return API response
    retrieveAssignedStandardEmployees: (req, res) => {
        const { EmployeeCertification } = req.app.locals.models;
        var where = {};
        where.certificateStandardID = req.body.certificateStandardID;
        where.isDeleted = false;
        if (req.body.classID) {
            where.classID = req.body.classID;
        }
        EmployeeCertification.findAll({
            attributes: ['id', 'employeeID', 'certificateStandardID', 'classID'],
            where: where
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Save employee standard personnel list
    // POST : /api/v1/employee_certification/savePersonnelStandard
    // @return API response
    removePersonnelStandard: (req, res) => {
        const { EmployeeCertification, sequelize } = req.app.locals.models;

        /* delete employee certificate that user removed */
        if (req.body.listObj && req.body.listObj) {
            COMMON.setModelDeletedByFieldValue(req);
            return sequelize.transaction().then(t => EmployeeCertification.update(req.body, {
                    where: {
                        id: {
                            [Op.in]: req.body.listObj.id
                        },
                        certificateStandardID: req.body.listObj.certificateStandardID
                    },
                    fields: ['deletedBy', 'isDeleted', 'deletedAt', 'updatedBy', 'deleteByRoleId'],
                    transaction: t
                }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(empCertiModuleName)))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    // GET List of employee Certificate Standard
    // GET : /api/v1/employee_certification/getEmployeeAllCertificationList
    // @return API response
    getEmployeeAllCertificationList: (req, res) => {
        if (req.body && req.body.employeeID) {
            const { CertificateStandards, EmployeeCertification, StandardRole, sequelize, StandardClass } = req.app.locals.models;
           return CertificateStandards.findAll({
                // where: {
                //    //isRestrictDataAccess: true
                //    //isActive: true  // as we need to display data in disable mode so needed active/inactive data
                // },
                order: [sequelize.fn('ISNULL', sequelize.col('CertificateStandards.displayOrder')), ['displayOrder', 'ASC'], ['fullName', 'ASC']],
                attributes: ['certificateStandardID', 'fullName', 'shortName', 'displayOrder', 'isActive', 'priority',
                    'isRequired', 'passwordProtected', 'standardTypeID'],
                include: [
                    {
                        model: EmployeeCertification,
                        as: 'employeeCertification',
                        attributes: ['id', 'certificateStandardID', 'classID'],
                        where: {
                            employeeID: req.body.employeeID
                        },
                        required: false
                    },
                    {
                        model: StandardClass,
                        as: 'CertificateStandard_Class',
                        attributes: ['certificateStandardID', 'classID', 'className', 'isActive', 'colorCode', 'displayOrder'],
                        required: false
                    },
                    {
                        model: StandardRole,
                        as: 'certificateStandardRole',
                        attributes: ['id', 'standardID', 'roleID'],
                        required: false
                    }
                ]
            }).then(standards => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, standards, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // GET List of employee Certificate Standard
    // GET : /api/v1/employee_certification/getCertifiedStandardListOfEmployee
    // @return API response
    getCertifiedStandardListOfEmployee: (req, res) => {
        if (req.body && req.body.employeeID) {
            const { CertificateStandards, EmployeeCertification, sequelize, StandardClass } = req.app.locals.models;
           return CertificateStandards.findAll({
                order: [sequelize.fn('ISNULL', sequelize.col('CertificateStandards.priority')), ['priority', 'ASC'], ['fullName', 'ASC']],
                attributes: ['fullName', 'displayOrder', 'priority'],
                include: [
                    {
                        model: EmployeeCertification,
                        as: 'employeeCertification',
                        attributes: ['classID'],
                        where: {
                            employeeID: req.body.employeeID
                        },
                        required: true
                    },
                    {
                        model: StandardClass,
                        as: 'CertificateStandard_Class',
                        attributes: ['classID', 'className', 'colorCode', 'displayOrder'],
                        required: false
                    }
                ]
            }).then(standards => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, standards, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get check employee contains standards that available at part assembly : restricted data access only std
    checkEmpHasValidStandardsForDoc: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if ((req.body.woID || req.body.woOPID || req.body.partID) && req.body.employeeID) {
           return sequelize
                .query('CALL Sproc_checkEmpHasValidCertiStdForDoc (:pwoID,:pwoOPID,:ppartID,:pemployeeID)',
                    {
                        replacements: {
                            pwoID: req.body.woID ? req.body.woID : null,
                            pwoOPID: req.body.woOPID ? req.body.woOPID : null,
                            ppartID: req.body.partID ? req.body.partID : null,
                            pemployeeID: req.body.employeeID
                        }
                    })
                .then((response) => {
                    const isEmpHasValidStd = response[0] && response[0].visEmpHasCertiAccess === 1 ? true : false;
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isEmpHasValidStd: isEmpHasValidStd }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get all employees (personnel) For certificate standard that not added in certificate standard
    retrieveEmployeeListGeneric: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize
            .query('CALL Sproc_RetrieveEmployeeListGeneric()',
                {
                    replacements: {
                    },
type: sequelize.QueryTypes.SELECT
                })
            .then((response) => {
                const empMasterList = response[0] && _.values(response[0]).length > 0 ? _.values(response[0]) : [];
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { empMasterList: empMasterList }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    }
};
