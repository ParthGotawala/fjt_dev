const resHandler = require('../../resHandler');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const fsextra = require('fs-extra');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const { Op } = require('sequelize');
const _ = require('lodash');
const { createPrimaryContactPersons } = require('../../customer_contactperson/controllers/Customer_ContactpersonController');
const { managePrimaryContPersonInElastic } = require('../../mfgcode/controllers/MfgCodeController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');


const companyModuleName = DATA_CONSTANT.COMPANY_PROFILE.NAME;


const inputFields = [
    'id',
    'name',
    'personName',
    'registeredEmail',
    'contactCountryCode',
    'faxCountryCode',
    'contactNumber',
    'faxNumber',
    'phoneExt',
    'street1',
    'street2',
    'street3',
    'city',
    'state',
    'postalCode',
    'createdBy',
    'countryID',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'updatedAt',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'companyLogo',
    'ein',
    'remittanceAddress',
    'legalName',
    'unitOfTime'
];

module.exports = {
    // GET : /api/v1/company_info/getCompanyInfo
    getCompanyInfo: async (req, res) => {
        try {
            const {
                CompanyInfo,
                MfgCodeMst,
                CountryMst,
                ContactPerson,
                sequelize
            } = req.app.locals.models;

            const functionDetail = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat, fun_getContPersonNameDisplayFormat() as contPersonNameFormat', {
                type: sequelize.QueryTypes.SELECT
            });

            const response = await CompanyInfo.findOne({
                where: {
                    isDeleted: false
                },
                include: [{
                    model: MfgCodeMst,
                    as: 'MfgCodeMst',
                    include: [
                        {
                            model: ContactPerson,
                            as: 'contactPerson',
                            where: {
                                // refTransID: MfgCodeMst.id, // No need Add Condition as that covered in sequalize associate.
                                refTableName: DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.TABLE_NAME,
                                isDeleted: false
                            },
                            required: false,
                            attributes: ['personId', 'isPrimary', 'isActive', 'firstName', 'middleName', 'lastName',
                                [sequelize.fn('fun_GetFormattedContactPersonName', sequelize.col('MfgCodeMst.contactPerson.firstName'), sequelize.col('MfgCodeMst.contactPerson.middleName'), sequelize.col('MfgCodeMst.contactPerson.lastName'), functionDetail[0].contPersonNameFormat), 'personFullName']]
                        }
                    ],
                    attributes: ['id', 'mfgCode', 'mfgName', [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('MfgCodeMst.mfgCode'), sequelize.col('MfgCodeMst.mfgName'), functionDetail[0].mfgCodeNameFormat), 'mfgCodeName']]
                }, {
                    model: CountryMst,
                    as: 'countryMst',
                    attributes: ['countryID', 'countryName']
                }]
            });

            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },

    updateCompany: (req, res) => {
        const dir = DATA_CONSTANT.COMPANY_PROFILE.UPLOAD_PATH;
        try {
            if (typeof (req.files) === 'object' && req.files.companyLogo) {
                const file = req.files.companyLogo;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                const fileName = `${file.fieldName}-${uuidv1()}.${ext}`;
                const path = dir + fileName;
                req.body.companyLogo = fileName;
                return fsextra.move(file.path, path, err => module.exports.updateComapnyInfo(req, res, err));
            } else {
                return module.exports.updateComapnyInfo(req, res, null);
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

    updateComapnyInfo: (req, res, uploadError) => {
        const {
            CompanyInfo,
            MfgCodeMst,
            MfgCodeAlias,
            sequelize
        } = req.app.locals.models;
        const promises = [];
        if (uploadError) {
            console.trace();
            console.error(uploadError);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: uploadError,
                data: null
            });
        } else if (req.body) {
            promises.push(CompanyInfo.findOne({
                where: {
                    name: req.body.name,
                    id: {
                        [Op.ne]: req.body.id
                    }
                },
                model: CompanyInfo,
                attributes: ['id', 'name']
            }));
            promises.push(MfgCodeMst.findOne({
                where: {
                    id: {
                        [Op.ne]: req.body.mfgCodeId
                    },
                    mfgName: req.body.name
                },
                model: MfgCodeMst,
                attributes: ['id', 'mfgName']
            }));
            promises.push(MfgCodeAlias.findOne({
                where: {
                    mfgcodeId: {
                        [Op.ne]: req.body.mfgCodeId
                    },
                    alias: req.body.name
                },
                model: MfgCodeAlias,
                attributes: ['id', 'alias']
            }));
            return Promise.all(promises).then((validation) => {
                if (validation.length > 0 && (validation[0] || validation[1] || validation[2])) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.DUPLICATE_ENTRY);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.name);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null,
                        data: {
                            isDuplicateCompanyName: true
                        }
                    });
                } else {
                    return CompanyInfo.findOne({
                        where: {
                            id: req.body.id
                        },
                        attributes: ['name', 'companyLogo', 'mfgCodeId']
                    }).then(comp =>
                        sequelize.transaction().then((t) => {
                            if (!req.body.companyLogo || (req.body.companyLogo && comp.companyLogo)) {
                                const path = DATA_CONSTANT.COMPANY_PROFILE.UPLOAD_PATH;
                                if (fs.existsSync(`${path}${comp.companyLogo}`)) {
                                    fs.unlinkSync(`${path}${comp.companyLogo}`);
                                }
                            }
                            req.body.registeredEmail = COMMON.DECRYPT_AES(req.body.registeredEmailEncrypted);
                            req.body.companyLogo = req.files.length > 0 ? req.files[0].filename : req.body.companyLogo || null;
                            req.body.countryID = req.body.countryID.length > 0 ? req.body.countryID : null;

                            const updatePromises = [];
                            COMMON.setModelUpdatedByFieldValue(req.body);

                            updatePromises.push(CompanyInfo.update(req.body, {
                                where: {
                                    id: req.body.id
                                },
                                fields: inputFields,
                                transaction: t
                            }));

                            if (req.body.primaryContPersonsDet && req.body.primaryContPersonsDet.length > 0) {
                                updatePromises.push(createPrimaryContactPersons(req, res, t));
                            }
                            return Promise.all(updatePromises).then((result) => {
                                if (result && Array.isArray(result)) {
                                    const failedDetail = _.find(result, item => item.status === STATE.FAILED);
                                    if (failedDetail) {
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                            messageContent: failedDetail.messageContent ? failedDetail.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: failedDetail.err || null,
                                            data: null
                                        });
                                    } else {
                                        const addedContPersonDet = _.find(result, item => item.data && item.data.personIds);
                                        if (addedContPersonDet) {
                                            managePrimaryContPersonInElastic(req, res, addedContPersonDet);
                                            if (comp.mfgCodeId) {
                                                // If we Add Primary Contact person in Company Info then it will Also Added in Manaufacturer, so Generate data for same.
                                                req.params['mfgId'] = comp.mfgCodeId;
                                                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageMFGCodeDetailInElastic);
                                            }
                                        }
                                        return t.commit().then(updateSucess => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, updateSucess, MESSAGE_CONSTANT.UPDATED(companyModuleName)));
                                    }
                                } else {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: null,
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
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // POST checkEmailUnique
    // To chceck email unique
    checkEmailUnique: (req, res) => {
        const {
            CompanyInfo
        } = req.app.locals.models;
        if (req.body) {
            req.body.registeredEmail = COMMON.DECRYPT_AES(req.body.registeredEmail);
            return CompanyInfo.findOne({
                where: {
                    id: {
                        [Op.ne]: req.body.id
                    },
                    registeredEmail: req.body.registeredEmail
                }
            }).then(validation => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, validation, null)).catch((err) => {
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

    // POST checkCompanyNameUnique
    // To chceck company name unique
    checkCompanyNameUnique: (req, res) => {
        const {
            CompanyInfo,
            MfgCodeMst,
            MfgCodeAlias
        } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            promises.push(CompanyInfo.findOne({
                where: {
                    name: req.body.name,
                    id: {
                        [Op.ne]: req.body.id
                    }

                },
                model: CompanyInfo,
                attributes: ['id', 'name']
            }));
            promises.push(MfgCodeMst.findOne({
                where: {
                    id: {
                        [Op.ne]: req.body.mfgCodeId
                    },
                    mfgName: req.body.name
                },
                model: MfgCodeMst,
                attributes: ['id', 'mfgName']
            }));
            promises.push(MfgCodeAlias.findOne({
                where: {
                    mfgcodeId: {
                        [Op.ne]: req.body.mfgCodeId
                    },
                    alias: req.body.name
                },
                model: MfgCodeAlias,
                attributes: ['id', 'alias']
            }));
            return Promise.all(promises).then(validation => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, validation, null)).catch((err) => {
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

    // Get Company address from company id
    // GET : /api/v1/getCompanyAddress
    // @return API response
    getCompanyAddress: (req, res) => {
        const {
            CustomerAddresses,
            sequelize,
            CountryMst
        } = req.app.locals.models;
        CustomerAddresses.findAll({
            where: {
                customerId: req.params.id,
                isDeleted: false
            },
            attributes: ['id', 'customerId', 'companyName', 'personName', 'division', 'email', 'isDefault', 'contact', 'phExtension', 'street1', 'street2', 'street3', 'city', 'state', 'countryID', 'postcode', 'addressType', 'faxNumber', 'faxCountryCode', [sequelize.literal('CONCAT(street1,\',\',city,\',\',state,\',\',countryMst.countryName,\'-\',postcode)'), 'FullAddress']],
            include: [{
                model: CountryMst,
                as: 'countryMst',
                attributes: ['countryName']
            }]
        }).then(entity => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entity, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Get List of contact Person
    // GET : /api/v1/getCompanyContactPersons
    // @return List of contact Person
    getCompanyContactPersons: (req, res) => {
        const { ContactPerson, sequelize } = req.app.locals.models;
        ContactPerson.findAll({
            where: {
                customerId: req.params.personId,
                isDeleted: false
            },
            attributes: ['personId',
                [sequelize.literal('CONCAT(firstName , \' \' ,IFNULL(middleName,\'\'),\' \' , lastName)'), 'fullName'], 'firstName', 'middleName', 'lastName', 'email', 'division', 'customerId']
        }).then(entity => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entity, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // update company preference details
    // GET : /api/v1/updateCompanyPreferences
    // @return upadted detail of company preferences

    updateCompanyPreferences: (req, res) => {
        const {
            CompanyInfo,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelUpdatedByFieldValue(req.body);
            return sequelize.transaction().then(t => CompanyInfo.update(req.body, {
                where: {
                    id: req.body.id
                },
                fields: ['unitOfTime', 'updateByRoleId', 'updatedBy'],
                transaction: t
            }).then(() => t.commit().then(updateSucess => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, updateSucess, MESSAGE_CONSTANT.UPDATED(companyModuleName)))).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })
            );
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    }
};