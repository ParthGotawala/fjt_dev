const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
const fs = require('fs');
const hummus = require('hummus');
const memoryStreams = require('memory-streams');
const { getDownloadAgreementlist } = require('../../Identity/IdentityApiHandler');

const jsreport = require('jsreport-core')({
    allowLocalFilesAccess: true,
    reportTimeout: 180000,
    reports: { async: true },
    // store: { provider: 'fs' },
    logger: {
        silent: false, // when true, it will silence all transports defined in logger,
        error: { transport: 'file', level: 'error', filename: 'logs/error.txt' },
        file: { transport: 'file', level: 'info', filename: 'logs/log.txt' },
        console: { transport: 'console', level: 'debug', filename: 'logs/console.txt' }
    },
    templatingEngines: {
        numberOfWorkers: 2,
        strategy: 'in-process',
        templateCache: {
            max: 100, // LRU cache with max 100 entries, see npm lru-cache for other options
            enabled: true // disable cache
        }
    }
});

const jsrender = require('jsrender');
jsreport.use(require('jsreport-phantom-pdf')());
jsreport.use(require('jsreport-jsrender')());
jsreport.use(require('jsreport-templates')());

jsreport.init();

const inputFields = [
    'agreementTypeID',
    'agreementContent',
    'version',
    'system_variables',
    'isPublished',
    'publishedDate',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'agreementSubject',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const agreementypeinputFields = [
    'agreementTypeID',
    'agreementType',
    'templateType',
    'purpose',
    'where_used',
    'displayName',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const moduleName = DATA_CONSTANT.AGREEMENT.NAME;
const SendMailTemplateController = require('../../send_mail_template/controllers/Send_Mail_TemplateController');

module.exports = {

    /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // Get Agreement types
    // GET : /api/v1/getAgreementTypes
    // @return list of Agreement Type
    // getAgreementTypes: (req, res) => {
    //     const { AgreementType, Agreement } = req.app.locals.models;
    //     /* bhavik thummar - a */
    //     var AgreementApiController = require('../../Identity/IdentityApiHandler');
    //     return AgreementApiController.getAgreementTypes( req.query.templateType,req.headers.authorization)
    //     .then((responses) => {
    //     const agreementType = JSON.parse(responses);
    //     /* -E */

    //     // AgreementType.findAll({
    //     //     where: {
    //     //         isDeleted: false,
    //     //         templateType: req.query.templateType
    //     //     },
    //     //     attributes: ['agreementTypeID', 'agreementType'],
    //     //     include: [{
    //     //         model: Agreement,
    //     //         as: 'agreements',
    //     //         required: false,
    //     //         attributes: ['agreementID', 'agreementTypeID', 'agreementContent', 'version',
    //     //             'system_variables', 'isPublished', 'publishedDate', 'isDeleted', 'agreementSubject']
    //     //     }]
    //     // }).then((agreementType) => {
    //         _.each(agreementType, (item) => {
    //             _.each(item.agreements, (agreementItem) => {
    //                 agreementItem.agreementContent = COMMON.getTextAngularValueFromDB(agreementItem.agreementContent);
    //             });
    //         });

    //         return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, agreementType, null);
    //     }).catch((err) => {
    //         console.trace();
    //         console.error(err);
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
    //             STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //     });
    // },

    /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // Get Agreement type by agreement Type ID
    // GET : /api/v1/agreement/retriveAgreementByTypeId
    // @param {agreementTypeID} int
    // @return get agreement type by ID
    // retriveAgreementByTypeId: (req, res) => {
    //     const { Agreement } = req.app.locals.models;
    //     Agreement.findAll({
    //         where: {
    //             agreementTypeID: req.params.agreementTypeID
    //         }
    //     }).then((type) => {
    //         if (!type) {
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
    //                 STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null });
    //         }
    //         _.each(type, (agreementItem) => {
    //             agreementItem.agreementContent = COMMON.getTextAngularValueFromDB(agreementItem.agreementContent);
    //         });
    //         return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, type, null);
    //     }).catch((err) => {
    //         console.trace();
    //         console.error(err);
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //     });
    // },

    /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // Create Agreement Template
    // POST : /api/v1/agreement
    // @return API response
    // createAgreement: (req, res) => {
    //     const Agreement = req.app.locals.models.Agreement;
    //     if (req.body) {
    //         //COMMON.setModelCreatedByFieldValue(req);
    //         req.body.agreementContent = COMMON.setTextAngularValueForDB(req.body.agreementContent);
    //         var AgreementApiController = require('../../Identity/IdentityApiHandler');
    //         const agreementID = 0;
    //         const agreementObj = {
    //             agreementContent : req.body.agreementContent,
    //             system_variables : req.body.system_variables,
    //             agreementSubject : req.body.agreementSubject,
    //             agreementTypeID : req.body.agreementTypeID,
    //             version : req.body.version,
    //             createByRole : req.body.createByRole,
    //             createdBy : req.body.createdBy.toString(),
    //             updateByRole : req.body.updateByRole,
    //             updatedBy : req.body.updatedBy.toString()
    //         };
    //         return AgreementApiController.CreateUpdateAgreement(agreementID,agreementObj, req.headers.authorization)
    //         .then((responses) => {
    //         const response = JSON.parse(responses);
    //         if(response.status ==STATE.SUCCESS ){
    //             resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, response.userMessage.message)
    //         }
    //         else{
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
    //                 STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
    //         }                
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
    //                 STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
    //             STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },

    /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // Update Agreement Template
    // PUT : /api/v1/agreement
    // @param {agreementID} int
    // @return API response
    // updateAgreement: (req, res) => {
    //     const Agreement = req.app.locals.models.Agreement;
    //     if (req.params.agreementID) {
    //         //COMMON.setModelUpdatedByFieldValue(req);
    //         req.body.agreementContent = COMMON.setTextAngularValueForDB(req.body.agreementContent);
    //         /* BT -S */
    //         var AgreementApiController = require('../../Identity/IdentityApiHandler');
    //         const agreementID = req.params.agreementID;
    //         const agreementObj = {
    //             agreementContent : req.body.agreementContent,
    //             system_variables : req.body.system_variables,
    //             agreementSubject : req.body.agreementSubject,
    //             updatedBy : req.body.updatedBy,
    //             updateByRole : req.body.updateByRole,
    //             updatedBy : req.body.updatedBy
    //         };
    //         return AgreementApiController.CreateUpdateAgreement(agreementID,agreementObj, req.headers.authorization)
    //         .then((responses) => {
    //         const response = JSON.parse(responses);
    //         if(response.status == STATE.SUCCESS ){
    //             resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, response.userMessage.message)
    //         }
    //         else{
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
    //                 STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
    //         }                
    //         }).catch((err) => {
    //         /* E */
    //         // Agreement.update(req.body, {
    //         //     where: {
    //         //         agreementID: req.params.agreementID
    //         //     },
    //         //     fields: inputFields
    //         // }).then((rowsUpdated) => {
    //         //     if (rowsUpdated[0] === 1) {
    //         //         return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName));
    //         //     } else {
    //         //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(moduleName), err: null, data: null });
    //         //     }
    //         // }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
    //                     messageContent: null,
    //                     err: err.errors.map(e => e.message).join(','),
    //                     data: null
    //                 });
    //             } else {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //             }
    //         });
    //     }
    // },

     /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // Publish Agreement Template
    // POST : /api/v1/agreement/publishAgreementTemplate
    // @return API response
    // publishAgreementTemplate: (req, res) => {
    //     const Agreement = req.app.locals.models.Agreement;
    //     if (req.body.agreementTypeID) {
    //         Agreement.max('version', { where: { agreementTypeID: req.body.agreementTypeID } }).then((type) => {
    //             var maxVersion = type;
    //             Agreement.findOne({ where: { agreementTypeID: req.body.agreementTypeID, isPublished: false } }).then((result) => {
    //                 var agreementModel = result.dataValues;
    //                 agreementModel.version = (maxVersion || maxVersion === 0) ? maxVersion : 0;
    //                 agreementModel.publishedDate = COMMON.getCurrentUTC();
    //                 agreementModel.isPublished = true;
    //                 COMMON.setModelUpdatedByFieldValue(agreementModel);
    //                 req.body.agreementContent = COMMON.setTextAngularValueForDB(req.body.agreementContent);
    //                 Agreement.update(agreementModel, {
    //                     where: {
    //                         agreementID: agreementModel.agreementID
    //                     },
    //                     fields: inputFields
    //                 }).then((rowsUpdated) => {
    //                     if (rowsUpdated[0] === 1) {
    //                         return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.AGREEMENT_PUBLISH_SUCCESS);
    //                     } else {
    //                         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.AGREEMENT_NOT_PUBLISH, err: null, data: null });
    //                     }
    //                 }).catch((err) => {
    //                     console.trace();
    //                     console.error(err);
    //                     if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
    //                         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
    //                             {
    //                                 messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                                 err: err.errors.map(e => e.message).join(','),
    //                                 data: null
    //                             });
    //                     } else {
    //                         console.trace();
    //                         console.error(err);
    //                         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //                     }
    //                 });
    //             }).catch((err) => {
    //                 console.trace();
    //                 console.error(err);
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //             });
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         });
    //     }
    // },

    /* Comment By - BT (23-02-2021) - you can delete this method after comment some code related it in login & loginresponcecontroller in FJT.Ui(in this controllers no more need this method as we sign agreement on identityserver side.) . */
    // Get Publish Agreement Template by agreementTypeID ID
    // GET : /api/v1/retriveAgreement/retriveAgreementByTypeId
    // @param {agreementTypeID} int
    // @return retrive publish agreement template
    //retrivePublishedAgreementById: (req, res) => {
    //    const { Agreement } = req.app.locals.models;
    //    /* bhavik thummar -s */
    //    var AgreementApiController = require('../../Identity/IdentityApiHandler');
    //    return AgreementApiController.retrivePublishedAgreementById(req.params.agreementTypeID, req.headers.authorization)
    //    .then((responses) => {
    //        const agreementList = JSON.parse(responses);
    //    /* -E */
    //    // Agreement.findAll({
    //    //     limit: 1,
    //    //     order: [['version', 'DESC']],
    //    //     where: {
    //    //         agreementTypeID: req.params.agreementTypeID,
    //    //         isPublished: true
    //    //     }
    //    // }).then((agreementList) => {
    //        if (!agreementList) {
    //            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null });
    //        }
    //        // replace mail content
    //        _.each(agreementList, (agreementDetail) => {
    //            const agreementDetails = agreementDetail.dataValues;
    //            agreementDetails.mailSubject = agreementDetails.agreementSubject ? agreementDetails.agreementSubject : '';
    //            agreementDetails.mailBody = agreementDetails.agreementContent ? agreementDetails.agreementContent : '';
    //            if (agreementDetails.system_variables) {
    //                agreementDetails.systemVariables = agreementDetails.system_variables.toString().split(',');
    //                if (agreementDetails.systemVariables.length > 0) {
    //                    agreementDetail.dataValues = SendMailTemplateController.replaceMailContent(agreementDetails);
    //                    agreementDetail.dataValues.agreementSubject = agreementDetail.dataValues.mailSubject;
    //                    agreementDetail.dataValues.agreementContent = agreementDetail.dataValues.mailBody;
    //                }
    //            }
    //        });
    //        agreementList.agreementContent = COMMON.getTextAngularValueFromDB(agreementList.agreementContent);
    //        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, agreementList, null);
    //    }).catch((err) => {
    //        console.trace();
    //        console.error(err);
    //        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //    });
    //},

    /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // get list of Agreement/Email
    // POST : /api/v1/retriveAgreement/retriveAgreementList
    // @return list of Agreement/Email
    // retriveAgreementList: (req, res) => {
    //     const { sequelize } = req.app.locals.models;
    //     const filter = COMMON.UiGridFilterSearch(req);
    //     const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

    //     sequelize.query('CALL Sproc_RetrieveAgreementList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pTemplateType,:pUserID)', {
    //         replacements: {
    //             ppageIndex: req.body.page,
    //             precordPerPage: filter.limit,
    //             pOrderBy: filter.strOrderBy || null,
    //             pWhereClause: strWhere,
    //             pTemplateType: req.body.templateType,
    //             pUserID: req.body.userID
    //         },
    //         type: sequelize.QueryTypes.SELECT
    //     }).then((response) => {
    //         return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { TemplateList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null);
    //     }).catch((err) => {
    //         console.trace();
    //         console.error(err);
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //     });
    // },

    /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // get list of Archiveve Version
    // POST : /api/v1/retriveArchieveVersionDetails
    // @return list of Archiveve Version
    // retriveArchieveVersionDetails: (req, res) => {
    //     const { sequelize } = req.app.locals.models;
    //     const filter = COMMON.UiGridFilterSearch(req);
    //     const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

    //     sequelize.query('CALL Sproc_RetrieveArchieveVesrionDetails (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:ID,:pUserID)', {
    //         replacements: {
    //             ppageIndex: req.body.page,
    //             precordPerPage: filter.limit,
    //             pOrderBy: filter.strOrderBy || null,
    //             pWhereClause: strWhere,
    //             ID: req.body.agreementID,
    //             pUserID: req.body.userID || null
    //         },
    //         type: sequelize.QueryTypes.SELECT
    //     }).then((response) => {
    //         resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { ArchieveList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null);
    //     }).catch((err) => {
    //         console.trace();
    //         console.error(err);
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //     });
    // },

    /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // get list of Agreement Details
    // GET : /api/v1/getAgreementDetails
    // @return Agreement Details
    // getAgreementDetails: (req, res) => {
    //     const { sequelize } = req.app.locals.models;
    //     if (req.params.agreementTypeID) {
    //         return sequelize.query('CALL Sproc_GetAgreementDetails (:agreementTypeID)', {
    //             replacements: {
    //                 agreementTypeID: req.params.agreementTypeID
    //             }
    //         }).then((response) => {
    //             resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { data: response[0] }, null);
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },

    /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // get list of Agreed users
    // POST : /api/v1/getAgreedUserList
    // @return list of Agreed users
    // getAgreedUserList: (req, res) => {
    //     const { sequelize } = req.app.locals.models;
    //     const filter = COMMON.UiGridFilterSearch(req);
    //     const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

    //     sequelize.query('CALL Sproc_getAgreedUserList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pAgreementTypeID,:pUserID)', {
    //         replacements: {
    //             ppageIndex: req.body.page,
    //             precordPerPage: filter.limit,
    //             pOrderBy: filter.strOrderBy || null,
    //             pWhereClause: strWhere,
    //             pAgreementTypeID: req.body.agreementTypeID,
    //             pUserID: req.body.userID || null
    //         },
    //         type: sequelize.QueryTypes.SELECT
    //     }).then((response) => {
    //         resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { AgreedUserList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null);
    //     }).catch((err) => {
    //         console.trace();
    //         console.error(err);
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //     });
    // },

    /* Comment By - BT (23-02-2021) - no need this api as move sign agreement flow on identityserver. */
    // get status of Last Version
    // GET : /api/v1/getAgreedUserList
    // @return status of Last version
    //checkLatestUserAgreement: (req, res, CurrentAgreementID) => {
    //    const { sequelize } = req.app.locals.models;
    //    return sequelize.query('Select fun_checkValidCurrentAgreementIsLatestAgreement(:pCurrentAgreementID)', {
    //        replacements: {
    //            pCurrentAgreementID: CurrentAgreementID
    //        },
    //        type: sequelize.QueryTypes.SELECT
    //    }).then((response) => {
    //        if (!response) {
    //            return {
    //                status: STATE.FAILED
    //            };
    //        } else {
    //            const isValidVersion = _.values(response[0])[0];
    //            if (isValidVersion) {
    //                return {
    //                    status: STATE.SUCCESS
    //                };
    //            } else {
    //                return {
    //                    status: STATE.FAILED
    //                };
    //            }
    //        }
    //    }).catch((err) => {
    //        console.trace();
    //        console.error(err);
    //        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //    });
    //},

     /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // get list of User sign-up agreeemnt
    // GET : /api/v1/retriveUserSignUpAgreementList
    // @return list of AgreementType
    // retriveUserSignUpAgreementList: (req, res) => {
    //     const { sequelize } = req.app.locals.models;
    //     const filter = COMMON.UiGridFilterSearch(req);
    //     const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

    //     sequelize.query('CALL Sproc_RetrieveUserSignUpAgreementList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pUserID)', {
    //         replacements: {
    //             ppageIndex: req.body.page,
    //             precordPerPage: filter.limit,
    //             pOrderBy: filter.strOrderBy || null,
    //             pWhereClause: strWhere,
    //             pUserID: req.body.userID
    //         },
    //         type: sequelize.QueryTypes.SELECT
    //     }).then((response) => {
    //         return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { AgreementUserList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null);
    //     }).catch((err) => {
    //         console.trace();
    //         console.error(err);
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //     });
    // },

    /* BT- for get agreement record  I called one api to identitysever and after remain this method as it is..*/
    // Get ID wise Agreement Details for PDF document
    // POST : /api/v1/getAgreementTemplateDetails
    getAgreementTemplateDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const TOKEN = req.headers.authorization;
        var htmlString = '';
        var headerString = '';
        var footerString = '';
        var templateData;
        var htmlContent;
        var promise = [];
        let outStream;
        let pdfWriter;
        const finalBuffer = [];
        var resultStream = '';
        var agreementList = [];
        // const margin = '{"top":"0px", "right":"50px", "bottom":"0px", "left":"0px"}';
        if (req.body) {

            const objScope = {
                agreementTypeID: req.body.agreementTypeID || null,
                userAgreementID: req.body.userAgreementID ? req.body.userAgreementID.toString() : null
            };

            getDownloadAgreementlist(objScope, TOKEN).then((responselist) => {
                const response = JSON.parse(responselist);
                if (response &&response.status ==  STATE.SUCCESS && response.data.length > 0) {
                    agreementList = response.data;
                    htmlString = '';
                    headerString = '';
                    footerString = '';
                    _.each(agreementList, (agreementData) => {
                        headerString = fs.readFileSync('./default/template/agreement-template-header.html').toString();
                        headerString = headerString.replace(new RegExp('##CompLogoPath##', 'g'), agreementData.compLogo);
                        headerString = headerString.replace(new RegExp('##AgreementName##', 'g'), agreementData.agreementName);
                        if (!req.body.isDraftversion) {
                            htmlString = fs.readFileSync('./default/template/publish-agreement-template.html').toString();
                            htmlString = htmlString.replace(new RegExp('##PublishedVersion##', 'g'), agreementData.version);
                            htmlString = htmlString.replace(new RegExp('##NewPublishedDate##', 'g'), agreementData.publishedDate);
                            htmlString = htmlString.replace(new RegExp('##AgreementContent##', 'g'), agreementData.agreementContent);
                        } else {
                            htmlString = fs.readFileSync('./default/template/agreement-template.html').toString();
                            htmlString = htmlString.replace(new RegExp('##AgreementContent##', 'g'), agreementData.agreementContent);
                        }
                        if (req.body.isViewSignature) {
                            footerString = fs.readFileSync('./default/template/agreed-agreement-template.html').toString();
                            footerString = footerString.replace(new RegExp('##AgreedOn##', 'g'), agreementData.agreedDate);
                            footerString = footerString.replace(new RegExp('##AgreedBy##', 'g'), agreementData.agreedBy);
                            footerString = footerString.replace(new RegExp('##Signature##', 'g'), agreementData.signaturevalue);
                        }
                        htmlString += `<img src='${agreementData.compLogo}' style="display:none;">`;
                        htmlString += footerString;
                        templateData = jsrender.templates(htmlString);
                        htmlContent = templateData.render({});
                        promise.push(
                            jsreport.render({
                                template: {
                                    _id: '5b8eab51cca20ec3ffbdce95',
                                    shortid: 'rJZ5FPjPQ',
                                    name: 'result.html',
                                    recipe: 'phantom-pdf',
                                    engine: 'jsrender',
                                    phantom: {
                                        format: 'Letter',
                                        // margin: margin,
                                        headerHeight: '150px',
                                        footerHeight: '80px',
                                        displayHeaderFooter: true,
                                        header: headerString,
                                        footer: '<div style="border-top: 1px solid black; text-align: right;font-family:Arial;">Page&nbsp;<span>{#pageNum}</span>&nbsp;of&nbsp;<span>{#numPages}</span></div>'
                                    },
                                    content: htmlContent
                                }
                            }).then((out) => {
                                finalBuffer.push(out.content);
                                return STATE.SUCCESS;
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            })
                        );
                    });
                    return Promise.all(promise).then(() => {
                        outStream = new memoryStreams.WritableStream();
                        pdfWriter = null;
                        finalBuffer.forEach((buffer) => {
                            if (buffer) {
                                const finalPDFStream = new hummus.PDFRStreamForBuffer(buffer);
                                if (!pdfWriter) {
                                    pdfWriter = hummus.createWriterToModify(finalPDFStream, new hummus.PDFStreamForResponse(outStream));
                                } else {
                                    pdfWriter.appendPDFPagesFromPDF(finalPDFStream);
                                }
                            }
                        });
                        if (pdfWriter) { pdfWriter.end(); }
                        resultStream = outStream.toBuffer();
                        outStream.end();
                        res.send(resultStream);
                    });
                } else {
                    return res.end();
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return res.end(err.message);
            });
        } else {
            return res.end();
        }
    }

    /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // Manage Agreement Type
    // POST : /api/v1/saveAgreementType
    // @return Agreement Type Details
    // saveAgreementType: (req, res) => {
    //     const { AgreementType } = req.app.locals.models;
    //     if (req.body) {
    //         // Update
    //         COMMON.setModelUpdatedByFieldValue(req);
    //         return AgreementType.update(req.body, {
    //             where: {
    //                 agreementTypeID: req.body.agreementTypeID
    //             },
    //             fields: agreementypeinputFields
    //         }).then(() => {
    //             resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(moduleName));
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },

    /* Comment By - BT (23-02-2021) - Move this api on identityserver. */
    // Check Agreement Type exist or not
    // post:/api/v1/checkDuplicateAgreementType
    // @retrun validity of agreement type
    // checkDuplicateAgreementType: (req, res) => {
    //     const { AgreementType } = req.app.locals.models;
    //     if (req.body) {
    //         const where = {
    //             displayName: req.body.displayName,
    //             isDeleted: false,
    //             templateType: req.body.templateType
    //         };
    //         if (req.body.agreementTypeID) {
    //             where.agreementTypeID = { [Op.ne]: req.body.agreementTypeID };
    //         }
    //         return AgreementType.findOne({
    //             where: where,
    //             attributes: ['agreementTypeID']
    //         }).then((response) => {
    //             if (response) {
    //                 return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
    //             } else {
    //                 return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicate: false }, null);
    //             }
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // }
};