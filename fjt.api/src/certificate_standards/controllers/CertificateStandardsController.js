const _ = require('lodash');
const fs = require('fs');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
const cheerio = require('cheerio');
const config = require('./../../../config/config.js');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
// const mkdirp = require('mkdirp');
// const multer = require('multer');
const fsextra = require('fs-extra');
const uuidv1 = require('uuid/v1');

const inputFields = [
    'fullName',
    'shortName',
    'description',
    'displayOrder',
    'isDeleted',
    'isActive',
    'standardInfo',
    'isCertified',
    'certificateDate',
    'standardTypeID',
    'deletedBy',
    'deletedAt',
    'updatedBy',
    'isRequired',
    'createdBy',
    'cerificateNumber',
    'cerificateIssueDate',
    'certificateSupplierID',
    'priority',
    'passwordProtected',
    'isExportControlled',
    'isRestrictDataAccess',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'imageURL',
    'documentPath'
];
const standardClassFields = [
    'classID',
    'certificateStandardID',
    'className'
];
const standardRoleFields = [
    'roleID',
    'standardID',
    'createdBy'
];
const moduleName = DATA_CONSTANT.CertificateStandards.DISPLAYNAME;
const standardClassName = DATA_CONSTANT.STANDARD_CLASS.DISPLAYNAME;
const imagemoduleName = DATA_CONSTANT.CertificateStandards.IMAGE_DISPLAYNAME;

module.exports = {
    // Retrive list of Certificate Standard
    // POST : /api/v1/certificatestandards/retriveCertificateStandardsList
    // @return list of Certificate Standard
    retriveCertificateStandardsList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetriveCertificateStandards (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pRoleId)', {
                replacements: {
                    ppageIndex: req.body.Page || null,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pRoleId: parseInt(req.body.roleId) || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { standards: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get List of Certificate Standard
    // GET : /api/v1/certificatestandards
    // @param {id} int
    retriveCertificateStandards: (req, res) => {
        if (req.params.id) {
            const { CertificateStandards, StandardRole, StandardClass } = req.app.locals.models;
            return CertificateStandards.findOne({
                where: { certificateStandardID: req.params.id },
                include: [
                    {
                        model: StandardClass,
                        as: 'CertificateStandard_Class',
                        where: { certificateStandardID: req.params.id },
                        attributes: ['className', 'classID'],
                        required: false
                    }, {
                        model: StandardRole,
                        as: 'certificateStandardRole',
                        where: { standardID: req.params.id },
                        attributes: ['id', 'standardID', 'roleID'],
                        required: false
                    }]
            }).then((standards) => {
                if (!standards) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null });
                }
                standards.standardInfo = COMMON.getTextAngularValueFromDB(standards.standardInfo);

                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, standards, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Create Certificate Standard
    // POST : /api/v1/certificatestandards
    // @return New created Certificate Standard detail
    createCertificateStandard: (req, res) => {
        const { CertificateStandards, StandardRole, StandardClass, sequelize } = req.app.locals.models;

        if (req.body.certificateDetail) { req.body.certificateDetail.createdBy = req.user.id; }

        if (req.body.certificateDetail.fullName) { req.body.certificateDetail.fullName = COMMON.TEXT_WORD_CAPITAL(req.body.certificateDetail.fullName, false); }

        if (req.body.certificateDetail.shortName) { req.body.certificateDetail.shortName = req.body.certificateDetail.shortName.toUpperCase(); }

        CertificateStandards.findOne({
            where: {
                [Op.or]: [
                    { fullName: { [Op.eq]: req.body.certificateDetail.fullName } },
                    { shortName: { [Op.eq]: req.body.certificateDetail.shortName } }
                ]
            },
            paranoid: true
        }).then((findStandard) => {
            if (findStandard) {
                const fieldName = (findStandard.fullName === req.body.certificateDetail.fullName) ? DATA_CONSTANT.CertificateStandards.UNIQUE_FIELD_STANDARDNAME : DATA_CONSTANT.CertificateStandards.UNIQUE_FIELD_STANDARDTYPE;
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
            } else {
                COMMON.setModelCreatedByFieldValue(req.body.certificateDetail);
                return sequelize.transaction().then((t) => {
                    req.body.certificateDetail.standardInfo = COMMON.setTextAngularValueForDB(req.body.certificateDetail.standardInfo);

                    CertificateStandards.create(req.body.certificateDetail, {
                        fields: inputFields,
                        transaction: t
                    }).then((response) => {
                        var userID = COMMON.getRequestUserID(req);
                        StandardRole.findAll({
                            where: {
                                standardID: response.certificateStandardID
                            },
                            attributes: ['id', 'roleID', 'standardID']
                        }).then((componentrolelist) => {
                            var newAddedTypes = [];
                            var deletedTypes = [];
                            componentrolelist.forEach((item) => {
                                var typeObj = req.body.certificateDetail.roles.find(x => parseInt(x) === parseInt(item.roleID));
                                if (!typeObj) { deletedTypes.push(item.roleID); }
                            });
                            if (req.body.certificateDetail.roles) {
                                req.body.certificateDetail.roles.forEach((item) => {
                                    var typeObj = componentrolelist.find(x => parseInt(x.roleID) === parseInt(item));
                                    if (!typeObj) {
                                        const data = {
                                            roleID: item,
                                            standardID: response.certificateStandardID,
                                            createdBy: userID
                                        };
                                        newAddedTypes.push(data);
                                    }
                                });
                            }
                            const promises = [];
                            if (newAddedTypes.length) {
                                COMMON.setModelCreatedByFieldValue(req);
                                promises.push(StandardRole.bulkCreate(newAddedTypes, {
                                    fields: standardRoleFields,
                                    transaction: t
                                }));
                            }
                            if (deletedTypes.length) {
                                COMMON.setModelDeletedByFieldValue(req);
                                const updatedData = {
                                    deletedAt: COMMON.getCurrentUTC(req),
                                    isDeleted: true,
                                    deletedBy: userID
                                };
                                promises.push(StandardRole.update(updatedData, {
                                    where: {
                                        roleID: { [Op.in]: deletedTypes }
                                    },
                                    transaction: t,
                                    fields: ['deletedBy', 'deletedAt', 'isDeleted']
                                }));
                            }
                            const id = response.certificateStandardID;
                            if (req.body.standardClassDetail && req.body.standardClassDetail.standardClassInfo.length > 0) {
                                req.body.standardClassDetail.standardClassInfo.forEach((value) => {
                                    value.certificateStandardID = id;
                                    value.createdBy = req.user.id;
                                });
                                promises.push(StandardClass.bulkCreate(req.body.standardClassDetail.standardClassInfo,
                                    {
                                        fields: standardClassFields,
                                        transaction: t
                                    }));
                            }
                            return Promise.all(promises).then(() => {
                                t.commit().then(() => {
                                    // Add Standards Detail into Elastic Search Engine for Enterprise Search
                                    req.params['pId'] = response.certificateStandardID;
                                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageStandardsInElastic);
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(moduleName));
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Update Certificate Standard
    // PUT : /api/v1/certificatestandards
    // @return API Response
    updateCertificateStandard: (req, res) => {
        const { CertificateStandards, StandardClass, sequelize, StandardRole } = req.app.locals.models;
        if (req.body.certificateDetail.fullName) { req.body.certificateDetail.fullName = COMMON.TEXT_WORD_CAPITAL(req.body.certificateDetail.fullName, false); }

        if (req.body.certificateDetail.shortName) { req.body.certificateDetail.shortName = req.body.certificateDetail.shortName.toUpperCase(); }
        const where = {};

        if (req.body.certificateDetail.displayOrder) {
            where[Op.or] = [
                { displayOrder: { [Op.eq]: req.body.certificateDetail.displayOrder } }
            ];
            where.certificateStandardID = { [Op.ne]: req.body.certificateDetail.certificateStandardID };
        } else if (req.body.certificateDetail.priority) {
            where[Op.or] = [
                { priority: { [Op.eq]: req.body.certificateDetail.priority } }
            ];
            where.certificateStandardID = { [Op.ne]: req.body.certificateDetail.certificateStandardID };
        } else {
            where.fullName = { [Op.eq]: req.body.certificateDetail.fullName };
            where.shortName = { [Op.eq]: req.body.certificateDetail.shortName };
            where.certificateStandardID = { [Op.ne]: req.body.certificateDetail.certificateStandardID };
        }
        CertificateStandards.findOne({
            where: where,
            paranoid: true
        }).then((findStandard) => {
            if (findStandard != null) {
                let fieldName;
                if (req.body.certificateDetail.fullName) {
                    fieldName = (findStandard.fullName.toLowerCase() === req.body.certificateDetail.fullName.toLowerCase()) ? DATA_CONSTANT.CertificateStandards.UNIQUE_FIELD_STANDARDNAME : null;
                }
                const prioritymessage = (findStandard.priority && parseFloat(findStandard.priority) === parseFloat(req.body.certificateDetail.priority))
                    ? DATA_CONSTANT.PRIORITY : DATA_CONSTANT.DISPLAY_ORDER;
                const messageContent = MESSAGE_CONSTANT.UNIQUE(fieldName ? fieldName : prioritymessage);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
            } else {
                COMMON.setModelUpdatedByFieldValue(req.body.certificateDetail);
                return sequelize.transaction().then((t) => {
                    req.body.certificateDetail.standardInfo = COMMON.setTextAngularValueForDB(req.body.certificateDetail.standardInfo);
                    CertificateStandards.update(req.body.certificateDetail, {
                        where: {
                            certificateStandardID: req.params.id
                        },
                        fields: inputFields,
                        transaction: t
                    }).then((response) => {
                        if (response) {
                            const userID = COMMON.getRequestUserID(req);
                            StandardRole.findAll({
                                where: {
                                    standardID: req.params.id
                                },
                                attributes: ['id', 'roleID', 'standardID']
                            }).then((componentrolelist) => {
                                var newAddedTypes = [];
                                var deletedTypes = [];
                                if (req.body.certificateDetail.roles) {
                                    componentrolelist.forEach((item) => {
                                        var typeObj = req.body.certificateDetail.roles.find(x => parseInt(x) === parseInt(item.roleID));
                                        if (!typeObj) { deletedTypes.push(item.roleID); }
                                    });
                                    req.body.certificateDetail.roles.forEach((item) => {
                                        var typeObj = componentrolelist.find(x => parseInt(x.roleID) === parseInt(item));
                                        if (!typeObj) {
                                            const data = {
                                                roleID: item,
                                                standardID: req.params.id,
                                                createdBy: userID
                                            };
                                            newAddedTypes.push(data);
                                        }
                                    });
                                }
                                const promises = [];
                                if (newAddedTypes.length) {
                                    COMMON.setModelCreatedByFieldValue(req);
                                    promises.push(StandardRole.bulkCreate(newAddedTypes, {
                                        fields: standardRoleFields,
                                        transaction: t
                                    }));
                                }
                                if (deletedTypes.length) {
                                    COMMON.setModelDeletedByFieldValue(req);
                                    const updatedData = {
                                        deletedAt: COMMON.getCurrentUTC(req),
                                        isDeleted: true,
                                        deletedBy: userID
                                    };
                                    promises.push(StandardRole.update(updatedData, {
                                        where: {
                                            roleID: { [Op.in]: deletedTypes },
                                            standardID: req.params.id,
                                            deletedAt: null
                                        },
                                        transaction: t,
                                        fields: ['deletedBy', 'deletedAt', 'isDeleted']
                                    }));
                                }

                                Promise.all(promises).then(() => {
                                    t.commit().then(() => {
                                        // Add Standards Detail into Elastic Search Engine for Enterprise Search
                                        req.params['pId'] = req.params.id;
                                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageStandardsInElastic);
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName));
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    t.rollback();
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            StandardClass.findAll({
                                where: {
                                    certificateStandardID: req.body.standardClassDetail.certificateStandardID
                                },
                                attributes: ['className', 'classID']
                            }).then((standardClass) => {
                                if (!standardClass) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(standardClassName), err: null, data: null });
                                } else {
                                    let existsstandardClass = [];
                                    existsstandardClass = standardClass.map(standardCls => standardCls.classID);
                                    let newsstandardClass = [];
                                    newsstandardClass = req.body.standardClassDetail.standardClassInfo.map(standardCls => standardCls.classID);
                                    let existclassDelete = [];
                                    existclassDelete = _.difference(existsstandardClass, newsstandardClass);
                                    COMMON.setModelDeletedByFieldValue(req);
                                    StandardClass.update(req.body, {
                                        where: {
                                            certificateStandardID: req.body.standardClassDetail.certificateStandardID,
                                            classID: existclassDelete,
                                            deletedAt: null
                                        },
                                        transaction: t,
                                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy']
                                    });
                                    COMMON.setModelCreatedArrayFieldValue(req.user, req.body.standardClassDetail.standardClassInfo);
                                    COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.standardClassDetail.standardClassInfo);
                                    return StandardClass.bulkCreate(req.body.standardClassDetail.standardClassInfo, {
                                        updateOnDuplicate: standardClassFields,
                                        transaction: t
                                    }).then(() => { }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        t.rollback();
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Delete Certificate Standard
    // DELETE : /api/v1/certificatestandards
    // @return API response
    deleteCertificateStandard: (req, res) => {
        const { CertificateStandards, GenericFiles, sequelize } = req.app.locals.models;
        const Entity = COMMON.AllEntityIDS.CertificateStandard;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.CertificateStandard.Name;
            const entityID = COMMON.AllEntityIDS.CertificateStandard.ID;
            let genericList;
            // let ids = req.params.id.split(',');
            return CertificateStandards.findAll({
                where: {
                    certificateStandardID: { [Op.in]: req.body.objIDs.id }
                },
                attributes: ['imageURL']
            }).then(standardData => sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: req.user.id,
                        entityID: entityID,
                        refrenceIDs: null,
                        countList: req.body.objIDs.CountList,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((certificateDetail) => {
                    if (certificateDetail.length === 0) {
                        COMMON.setModelDeletedByFieldValue(req);
                        return GenericFiles.findAll({
                            where: {
                                refTransID: { [Op.in]: req.body.objIDs.id },
                                gencFileOwnerType: Entity.Name
                            }
                        }).then((genericFileData) => {
                            genericList = genericFileData;
                            return GenericFiles.update(req.body, {
                                where: {
                                    refTransID: { [Op.in]: req.body.objIDs.id },
                                    gencFileOwnerType: Entity.Name,
                                    deletedAt: null
                                },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy']
                            });
                        }).then((GenericFilesData) => {
                            if (req.body.objIDs.isPermanentDelete === true) {
                                // Delete generic Document
                                _.each(genericList, (itemData) => {
                                    fs.unlink(`.${itemData.genFilePath}`, () => { });
                                    return Promise.resolve(itemData);
                                });

                                // Delete profile image
                                _.each(standardData, (data) => {
                                    if (data && data.imageURL) {
                                        const docpath = `${DATA_CONSTANT.CertificateStandards.UPLOAD_PATH}${data.imageURL}`;
                                        fs.unlink(docpath, () => { });
                                    }
                                });
                            }
                            return Promise.resolve(GenericFilesData);
                        }).then(updatedTransData => Promise.resolve(updatedTransData))
                            .then(() => {
                                // Delete Packagning Types Detail into Elastic Search Engine for Enterprise Search
                                EnterpriseSearchController.deleteStandardsDetailInElastic(req.body.objIDs.id.toString());
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, certificateDetail, MESSAGE_CONSTANT.DELETED(moduleName));
                            })
                            .catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: certificateDetail, IDs: req.body.objIDs.id }, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // GET List of Certificate Standard
    // GET : /api/v1/getCertificateStandardList
    // @return API response
    getCertificateStandardList: (req, res) => {
        const { CertificateStandards, WorkorderCertification, StandardClass } = req.app.locals.models;
        CertificateStandards.findAll({
            where: {
                isActive: true
            },
            order: [['displayOrder', 'ASC']],
            attributes: ['certificateStandardID', 'fullName', 'shortName', 'displayOrder', 'isActive', 'priority', 'isRequired', 'isExportControlled', 'isRestrictDataAccess'],
            include: [{
                model: WorkorderCertification,
                as: 'workorderCertification',
                attributes: ['woCertificationID', 'woID', 'certificateStandardID', 'classIDs'],
                where: {
                    woID: req.body.workorderObj.woID
                },
                required: false
            },
            {
                model: StandardClass,
                as: 'CertificateStandard_Class',
                attributes: ['certificateStandardID', 'classID', 'className', 'colorCode'],
                required: false
            }]
        }).then(standards => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, standards, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // GET List of Certificate Standard
    // GET : /api/v1/getCertificateStandard
    // @return API response
    getCertificateStandard: (req, res) => {
        const { CertificateStandards, StandardClass } = req.app.locals.models;
        let whereclause = {};
        if (req.body.searchquery) {
            whereclause = {
                fullName: { [Op.like]: `%${req.body.searchquery}%` }
            };
        }
        CertificateStandards.findAll({
            where: whereclause,
            order: [['displayOrder', 'ASC']],
            attributes: ['certificateStandardID', 'fullName', 'isActive', 'shortName', 'displayOrder', 'isExportControlled', 'isRestrictDataAccess'],
            include: [{
                model: StandardClass,
                as: 'CertificateStandard_Class',
                attributes: ['certificateStandardID', 'classID', 'className'],
                required: false
            }]
        }).then(standards => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, standards, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // GET List of Certificate Standard
    // GET : /api/v1/getCertificateStandard
    // @return API response
    getCertificateStandardRole: (req, res) => {
        const { CertificateStandards, StandardRole, StandardClass, sequelize } = req.app.locals.models;
        CertificateStandards.findAll({
            order: [sequelize.fn('ISNULL', sequelize.col('CertificateStandards.displayOrder')), ['displayOrder', 'ASC'], ['fullName', 'ASC']],
            attributes: ['certificateStandardID', 'fullName', 'shortName', 'isActive', 'displayOrder', 'passwordProtected',
                'standardTypeID', 'priority', 'isExportControlled', 'isRestrictDataAccess', 'description'],
            include: [{
                model: StandardClass,
                as: 'CertificateStandard_Class',
                attributes: ['certificateStandardID', 'classID', 'className', 'displayOrder', 'isActive', 'colorCode', 'description'],
                required: false
            }, {
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
    },
    // GET List of Certificate Standard by certificateStandardID
    // GET : /api/v1/treeviewData
    // @param {id} int
    // @return certificate standards detail
    treeviewData: (req, res) => {
        const { CertificateStandards, StandardClass, GenericCategory } = req.app.locals.models;
        CertificateStandards.findOne({
            where: {
                // isActive: true,
                standardTypeID: req.params.id
            },
            attributes: ['certificateStandardID', 'standardTypeID'],
            include: [{
                model: GenericCategory,
                as: 'standardType',
                attributes: ['gencCategoryID', 'gencCategoryName'],
                include: [{
                    model: CertificateStandards,
                    as: 'standardType',
                    attributes: ['certificateStandardID', 'fullName'],
                    include: [{
                        model: StandardClass,
                        as: 'CertificateStandard_Class',
                        attributes: ['classID', 'className'],
                        required: false
                    }],
                    required: false
                }],
                required: false
            }]
        }).then(standards => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, standards, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Check standard Name exist or not
    // post:/api/v1/checkDuplicateStandard
    // @retrun validity of standard Name
    checkDuplicateStandard: (req, res) => {
        const { CertificateStandards } = req.app.locals.models;
        if (req.body) {
            const whereClauseStandard = {
                fullName: req.body.fullName
            };
            if (req.body.certificateStandardID) {
                whereClauseStandard.certificateStandardID = { [Op.notIn]: [req.body.certificateStandardID] };
            }
            return CertificateStandards.findOne({
                where: whereClauseStandard,
                attributes: ['certificateStandardID']
            }).then((standard) => {
                if (standard) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicatefullName: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicatefullName: false }, null);
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
    // Check standard Code exist or not
    // post:/api/v1/checkDuplicateStandard
    // @retrun validity of standard code
    checkDuplicateStandardCode: (req, res) => {
        const { CertificateStandards } = req.app.locals.models;
        if (req.body) {
            const whereClauseStandard = {
                shortName: req.body.shortName
            };
            if (req.body.certificateStandardID) {
                whereClauseStandard.certificateStandardID = { [Op.notIn]: [req.body.certificateStandardID] };
            }
            return CertificateStandards.findOne({
                where: whereClauseStandard,
                attributes: ['certificateStandardID']
            }).then((standard) => {
                if (standard) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateCode: true } });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateCode: false }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    /** Remove file from server if no longer use in text editor by comparing old and new value of text editor*/
    deleteTextAngularFiles: (oldString, newString) => {
        var oldFileList = [];
        const documentURL = `${config.APIUrl}${DATA_CONSTANT.TEXT_EDITOR.UPLOAD_API_PATH}`;

        cheerio.load(oldString)('a, img').each((item, obj) => {
            var filePath = obj.attribs.href || obj.attribs.src;
            if (_.includes(filePath, documentURL)) {
                oldFileList.push(filePath.replace(documentURL, ''));
            }
        });

        const newFileList = [];
        cheerio.load(newString)('a, img').each((item, obj) => {
            var filePath = obj.attribs.href || obj.attribs.src;
            if (_.includes(filePath, documentURL)) {
                newFileList.push(filePath.replace(documentURL, ''));
            }
        });

        const removeFileList = _.difference(oldFileList, newFileList);

        const promises = [];
        if (removeFileList.length > 0) {
            const dir = DATA_CONSTANT.TEXT_EDITOR.UPLOAD_FOLDER_PATH;

            _.each(removeFileList, (item) => {
                promises.push(fs.unlink(`${dir}${item}`, (response) => {
                    Promise.resolve(response);
                }));
            });
        }

        return Promise.all(promises);
    },

    // Upload Standard Image
    // POST : /api/v1/certificatestandards/createCertificateStandardImage
    // @return New created standard image detail
    // eslint-disable-next-line consistent-return
    createCertificateStandardImage: (req, res) => {
        const dir = DATA_CONSTANT.CertificateStandards.UPLOAD_PATH;
        try {
            if (typeof (req.files) === 'object' && Array.isArray(req.files.files)) {
                const file = req.files.files[0].file;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                const fileName = `${uuidv1()}.${ext}`;
                const path = dir + fileName;
                req.body.fileName = fileName;
                fsextra.move(file.path, path, (err) => {
                    module.exports.uploadCertificateStandardImage(req, res, err, req.body.fileName);
                });
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },
    uploadCertificateStandardImage: (req, res, err, fileName) => {
        const {
            CertificateStandards
        } = req.app.locals.models;
        if (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        } else if (req.body) {
            COMMON.setModelUpdatedByFieldValue(req);
            const imageObj = {
                imageURL: fileName, // req.files[0].filename,
                updatedBy: COMMON.getRequestUserID(req),
                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return CertificateStandards.findOne({
                where: {
                    certificateStandardID: req.body.certificateStandardID,
                    isDeleted: false
                }
            }).then((comp) => {
                if (comp) {
                    if (comp && comp.imageURL) {
                        if (req.body.fileName) {
                            const path = DATA_CONSTANT.CertificateStandards.UPLOAD_PATH;
                            fs.unlink(`${path}${comp.imageURL}`, () => { });
                        }
                    }
                    return CertificateStandards.update(imageObj, {
                        where: {
                            certificateStandardID: req.body.certificateStandardID,
                            isDeleted: false
                        },
                        attributes: ['imageURL', 'updatedBy', 'updateByRoleId']
                    }).then(() => {
                        if (req.body.isAdd) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, imageObj, null);
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, imageObj, MESSAGE_CONSTANT.UPDATED(imagemoduleName));
                        }
                    }).catch((error) => {
                        console.trace();
                        console.error(error);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(imagemoduleName), err: null, data: null });
                }
            }).catch((error) => {
                console.trace();
                console.error(error);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // delete Certificate Standard Image
    // PUT : /api/v1/certificatestandards/deleteCertificateStandardImage
    // @return delete certificate standard image
    deleteCertificateStandardImage: (req, res) => {
        const {
            CertificateStandards
        } = req.app.locals.models;
        if (req.body.imageObj) {
            COMMON.setModelUpdatedByFieldValue(req);
            const obj = {
                imageURL: null,
                updatedBy: COMMON.getRequestUserID(req),
                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            return CertificateStandards.update(obj, {
                where: {
                    certificateStandardID: req.body.imageObj.certificateStandardID,
                    isDeleted: false
                }
            }).then(deletedImage => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, deletedImage, MESSAGE_CONSTANT.DELETED(imagemoduleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }

};