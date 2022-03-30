const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT, ELASTIC_ENTITY } = require('../../../constant');
const resHandler = require('../../resHandler');
const _ = require('lodash');
const { Op } = require('sequelize');
const fs = require('fs');
const jsonfile = require('jsonfile');
const configData = require('../../../config/config.js');

module.exports = {
    // Get Generate JSON File for ENTITY Model
    // GET : /api/enterprise_search/generateJSONofEntity
    generateJSONofEntity: (req, res) => {
        if (req) {
            const {
                Entity
            } = req.app.locals.models;
            const rawdata = {};
            let filePath = '';
            let fileName = '';
            let promises = [];
            try {
                const dataConstantForMessage = COMMON.ELASTIC_ENTITY_CONFIGURATION;

                if (!dataConstantForMessage) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }
                filePath = process.cwd() + dataConstantForMessage.UPLOAD_FOLDER_ENTITY_PATH;
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                }
                return Entity.findAll({
                    where: {
                        entityID: {
                            [Op.lt]: 0
                        }
                    }
                }).then((result) => {
                    if (result) {
                        fileName = `${filePath + COMMON.ELASTIC_ENTITY_CONFIGURATION.FILE_NAME}.json`;
                        // eslint-disable-next-line no-sequences
                        fs.chmodSync(fileName, 666), (errChange) => {
                            if (errChange) { throw errChange; }
                        };

                        promises = [];
                        result.forEach((item) => {
                            if (item) {
                                const entityDet = JSON.parse(item.jsonObjOfEnterprise);
                                rawdata[item.entityID] = {
                                    EntityName: entityDet.EntityName,
                                    FunctionName: entityDet.FunctionName,
                                    Type: entityDet.Type,
                                    EntityPrefix: entityDet.EntityPrefix,
                                    Title: entityDet.Title,
                                    ID: item.entityID,
                                    TypeID: entityDet.TypeID,
                                    Parameter: entityDet.Parameter
                                };
                            } else { console.error('End of read data'); }
                        });
                        promises.push(jsonfile.writeFileSync(fileName, rawdata, (err) => {
                            if (err) { throw err; }
                        })
                        );
                        return Promise.all(promises).then(() => {
                            try {
                                const allAPIConstantMessages = jsonfile.readFileSync(fileName);
                                Object.getOwnPropertyNames(ELASTIC_ENTITY).forEach((prop) => {
                                    delete ELASTIC_ENTITY[prop];
                                });
                                Object.keys(allAPIConstantMessages).forEach((item) => {
                                    // eslint-disable-next-line no-const-assign
                                    ELASTIC_ENTITY[item] = Object.assign({}, rawdata[item]);
                                });
                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.GENERATED);
                                messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.ENTITY.NAME);
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
                            } catch (error) {
                                console.trace();
                                console.error(error);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
                            }
                        });
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } catch (error) {
                console.trace();
                console.error(error);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get List of Entity into Elastic Search engine
    // GET : /api/enterprise_search/retriveEntityList
    retriveEntityList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var srtWhereMfgPn = '';
        var strWhere = '';
        var dataObject = '';
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (srtWhereMfgPn !== '') {
                strWhere = strWhere + (strWhere === '' ? '' : ' AND ') + srtWhereMfgPn;
            }
            if (strWhere === '') {
                strWhere = null;
            }

            return sequelize
                .query('CALL Sproc_GetEntitiesForEnterprise (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    if (response) {
                        dataObject = {
                            entityList: _.values(response[1]),
                            Count: response[0][0] ? response[0][0]['totalCount'] : 0
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataObject, null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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
    // Get Update Entity Display order
    // POST : /api/enterprise_search/updateEntityDisplayOrder
    updateEntityDisplayOrder: (req, res) => {
        const { Entity } = req.app.locals.models;
        if (req.body) {
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }
            let where = {
            };

            if (req.body.entityID) {
                where = {
                    entityID: { [Op.ne]: req.body.entityID },
                    searchDisplayOrder: { [Op.eq]: req.body.searchDisplayOrder }
                };
            }

            return Entity.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    const fieldName = DATA_CONSTANT.ENTITY.DISPLAY_ORDER;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                } else if (req.body.entityID) { // Update
                    COMMON.setModelUpdatedByFieldValue(req);

                    return Entity.update(req.body, {
                        where: {
                            entityID: req.body.entityID
                        },
                        fields: ['searchDisplayOrder']
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(DATA_CONSTANT.ENTITY.NAME)
                    )).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    proceedTransction: (req, functionDetail) => {
        var functionName = functionDetail && (typeof (functionDetail) === 'function') ? functionDetail.name : null;
        if (functionName && typeof (module.exports[functionName]) === 'function') {
            // Add Component Detail into Elastic Search Engine for Enterprise Search
            // Need to change timeout code due to trasaction not get updated record
            setTimeout(() => {
                module.exports[functionName](req);
            }, 2000);
            // Enterprise_Search_Controller.managePartDetailInElastic(req);
        }
    },
    // Add transaction detail into Elastic Engine
    // PUT : /api/enterprise_search/addTransaction
    addTransaction: (req, res) => {
        var entityList = [];
        if (req.body && req.body.ids && Array.isArray(req.body.ids)) {
            req.body.ids.forEach((detail) => {
                var entity = ELASTIC_ENTITY[detail];
                if (entity) {
                    entityList.push(entity);
                }
            });
        }
        // entityList = _.uniqBy(entityList, 'FunctionName');
        entityList.forEach((detail) => {
            if (detail.FunctionName && typeof (module.exports[detail.FunctionName]) === 'function') {
                req.params = typeof (detail.Parameter) === 'object' ? detail.Parameter : null;
                module.exports[detail.FunctionName](req);
            }
        });

        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entityList, null);
    },
    // Get Transction DB Count
    // PUT : /api/enterprise_search/addTransaction
    getModuleCount: (req, res) => {
        var entityList = [];
        var promises = [];
        if (req.body && req.body.ids && Array.isArray(req.body.ids)) {
            req.body.ids.forEach((detail) => {
                var entity = ELASTIC_ENTITY[detail];
                if (entity) {
                    entityList.push(entity);
                }
            });
        } else {
            entityList = [ELASTIC_ENTITY];
        }
        // entityList = _.uniqBy(entityList, 'FunctionName');
        entityList.forEach((detail) => {
            if (detail.FunctionName && typeof (module.exports[detail.FunctionName]) === 'function') {
                req.params = typeof (detail.Parameter) === 'object' ? detail.Parameter : null;
                promises.push(module.exports[detail.FunctionName](req, null, true));
            }
        });

        return Promise.all(promises).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    getEntityJsonDetail: (entityID) => {
        const entityDet = ELASTIC_ENTITY[entityID];
        return entityDet;
    },
    // Get List of RFQ and store into Elastic Search engine
    // GET : /api/enterprise_search/manageRFQDetailInElastic
    // @return List of RFQ List
    // eslint-disable-next-line consistent-return
    manageRFQDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var rfqModuleName = DATA_CONSTANT.RFQ.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        var elasticObjectArray = [];

        pWhereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;
        return sequelize.query('CALL Sproc_GetRFQDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.id,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((rfq) => {
            if (!rfq) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(rfqModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.RfqForms.ID);
            if (isRequiredCount) {
                const totalCount = _.values(rfq[0]) ? _.values(rfq[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(rfq);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((assyDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var assyDetailObject = {
                            Id: null,
                            Customer: null,
                            CustomerCode: null,
                            RFQCreatedBy: null,
                            SalesCommissionTo: null,
                            AssyID: null,
                            AssyRev: null,
                            AssyNumber: null,
                            NickName: null,
                            AssySpecialName: null,
                            RFQStatus: null,
                            AssyType: null,
                            JobType: null,
                            RFQType: null,
                            QuotePriority: null,
                            QuotaGroup: null,
                            RFQDueDate: null,
                            InternalAssemblyNote: null,
                            CustomerQuoteNote: null,
                            AssemblyRequirement: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (assyDetail) === 'object') {
                            if (assyDetail.isDeleted) {
                                module.exports.deleteRFQDetailInElastic(assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.RFQ_ASSEMBLIES_ID]);
                            } else {
                                module.exports.configureDefualtValue(assyDetailObject, assyDetail);
                                Object.keys(assyDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.RFQ_ASSEMBLIES_ID:
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.RFQ_MASTER.QUOTA_GROUP_URL + (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.ID])}/${assyDetail[modelField]}`;
                                            assyDetailObject.Id = `${entityDet.EntityPrefix}${assyDetail[modelField]}`;
                                            assyDetailObject.EntityId = assyDetail[modelField];
                                            assyDetailObject.TItle = `${entityDet.Type} ${entityDet.Title}: ${assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.ID]}`;
                                            assyDetailObject.QuotaGroup = COMMON.createElasticOject(true, hrefUrl,
                                                assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.ID],
                                                assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.ID]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.CUSTOMER_ID:
                                            if ((assyDetail[modelField])) {
                                                if (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.CUSTOMER_ID]);
                                                } else if (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                    hrefUrl += ((assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.IS_CUST_OR_DISTY]) ?
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) + (assyDetail[modelField]);
                                                }
                                            }
                                            assyDetailObject.Customer = (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_NAME]) ?
                                                COMMON.createElasticOject(true, hrefUrl, assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_NAME]
                                                    , assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_NAME])
                                                : null;
                                            assyDetailObject.CustomerCode = (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_CODE]) ?
                                                COMMON.createElasticOject(true, hrefUrl, assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_CODE],
                                                    assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_CODE])
                                                : null;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.EMPLOYEE_ID:
                                            if (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.FIRST_NAME]) {
                                                const employeeName = `${assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.FIRST_NAME]} ${assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.LAST_NAME]}`;
                                                assyDetailObject.RFQCreatedBy = COMMON.createElasticOject(false, null, employeeName, employeeName);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.SALES_COMMISSION_TO:
                                            if (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.SALES_CEMP_FIRST_NAME]) {
                                                const employeeName = `${assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.SALES_CEMP_FIRST_NAME]} ${assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.SALES_CEMP_LAST_NAME]}`;
                                                assyDetailObject.SalesCommissionTo = COMMON.createElasticOject(false, null, employeeName, employeeName);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.PART_ID:
                                            const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_TYPE]).toLowerCase());
                                            hrefUrl += `${partUrl}${assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.PART_ID]}`;

                                            assyDetailObject.AssyID = COMMON.createElasticOject(true, hrefUrl, assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.PID_CODE],
                                                assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.PID_CODE]);
                                            assyDetailObject.AssyRev = COMMON.createElasticOject(false, null, assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.REV],
                                                assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.REV]);
                                            assyDetailObject.AssyNumber = COMMON.createElasticOject(true, hrefUrl, assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_PN],
                                                assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.MFG_PN]);
                                            assyDetailObject.AssySpecialName = COMMON.createElasticOject(false, null, assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.SPECIAL_NOTE],
                                                assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.SPECIAL_NOTE]);
                                            assyDetailObject.NickName = COMMON.createElasticOject(false, null, assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.NICKNAME],
                                                assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.NICKNAME]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.ASSEMBLY_TYPE_ID:
                                            if (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.ASSEMBLY_TYPE_NAME]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.RFQ_MASTER.ASSEMBLY_TYPE_URL;
                                            }
                                            assyDetailObject.AssyType = COMMON.createElasticOject(true, hrefUrl, assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.ASSEMBLY_TYPE_NAME],
                                                assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.ASSEMBLY_TYPE_NAME]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.RFQ_STATUS:
                                            {
                                                const status = _.find(DATA_CONSTANT.RFQ_ASSY_STATUS, item => item.VALUE === assyDetail[modelField]);
                                                assyDetailObject.RFQStatus = (status && (typeof (status) === 'object')) ?
                                                    COMMON.createElasticOject(false, null, status.NAME, status.NAME)
                                                    : null;
                                                break;
                                            }
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.JOB_TYPE_ID:
                                            if (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.JOB_TYPE_NAME]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.RFQ_MASTER.JOB_TYPE_URL;
                                            }
                                            assyDetailObject.JobType = (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.JOB_TYPE_NAME]) ?
                                                COMMON.createElasticOject(true, hrefUrl, assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.JOB_TYPE_NAME],
                                                    assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.JOB_TYPE_NAME])
                                                : null;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.RFQ_TYPE_ID:
                                            if (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.RFQ_TYPE_NAME]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.RFQ_MASTER.RFQ_TYPE;
                                            }
                                            assyDetailObject.RFQType = (assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.RFQ_TYPE_NAME]) ?
                                                COMMON.createElasticOject(true, hrefUrl, assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.RFQ_TYPE_NAME],
                                                    assyDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.RFQ_TYPE_NAME])
                                                : null;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.QUOTE_DUE_DATE:
                                            assyDetailObject.RFQDueDate = COMMON.createElasticOject(false, null, assyDetail[modelField], assyDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.QUOTE_PRIORITY:
                                            assyDetailObject.QuotePriority = COMMON.createElasticOject(false, null, assyDetail[modelField], assyDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.QUOTE_NOTE:
                                            assyDetailObject.CustomerQuoteNote = COMMON.createElasticOject(false, null, assyDetail[modelField], assyDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.ADDITIONAL_REQUIREMENT:
                                            assyDetailObject.AssemblyRequirement = COMMON.createElasticOject(false, null, assyDetail[modelField], assyDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MASTER_FIELD.ASSY_NOTE:
                                            assyDetailObject.InternalAssemblyNote = COMMON.createElasticOject(false, null, assyDetail[modelField], assyDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                elasticObjectArray.push(assyDetailObject);
                            }
                        }
                    });
                    elasticObjectArray.forEach((detail) => {
                        responseModal.push(detail);
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.RFQ, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete RFQ Detail
    deleteRFQDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.RFQ, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.RfqForms.ID);
    },
    // Generate ID with Attach Entity Prefix
    generateIDWithPrefix: (ids, entityDet) => {
        ids = ids.toString();
        ids = ids.split(',');
        ids.forEach((id, index, theArray) => {
            theArray[index] = `${entityDet.EntityPrefix}${id}`;
        });
        ids = ids.join(',');
        return ids;
    },
    // default property bind for updatedat/createdat
    configureDefualtValue: (elasticObject, values) => {
        elasticObject.CreatedAt = values['createdAt'];
        elasticObject.UpdatedAt = values['updatedAt'];
    },
    // Get list of Part and store into Elastic Search engine
    // GET : /api/enterprise_search/managePartDetailInElastic
    // @return List of Components
    managePartDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;

        var componentModuleName = DATA_CONSTANT.COMPONENT.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;
        return sequelize.query('CALL Sproc_GetPartsDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.id,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((component) => {
            if (!component) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(componentModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Component.ID);
            if (isRequiredCount) {
                const totalCount = _.values(component[0]) ? _.values(component[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(component);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            EntityId: null,
                            ManufacturerCode: null,
                            PartNumber: null,
                            ProductionPN: null,
                            ManufacturerPartNumber: null,
                            NickName: null,
                            PartId: null,
                            Description: null,
                            SpecialNote: null,
                            FunctionalType: null,
                            MountingType: null,
                            PartStatus: null,
                            RoHSStatus: null,
                            LTBDate: null,
                            EOLDate: null,
                            DeviceMarking: null,
                            Connectors: null,
                            PinCount: null,
                            NoOfRows: null,
                            Tolerance: null,
                            Voltage: null,
                            Value: null,
                            PackageCaseShape: null,
                            Power: null,
                            Feature: null,
                            Color: null,
                            Packaging: null,
                            SupplierCode: null,
                            SupplierPartNumber: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deletePartDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.REF_SUPPLIER_MFGPN_COMPONENTID:
                                            if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                elasticObject.ManufacturerPartNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.REF_SUPP_COM_MGPN],
                                                    objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.REF_SUPP_COM_MGPN]);

                                                hrefUrl = hrefUrl + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.REF_SUPP_COM_IS_CUST_OR_DISTY] ?
                                                    DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                    DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.REF_SUPP_COM_MFG_CODE_ID]);

                                                elasticObject.ManufacturerCode = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.REF_SUPP_COM_MFG_CODE],
                                                    objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.REF_SUPP_COM_MFG_CODE]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_CODE:
                                            if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_CODE_ID]);

                                                elasticObject.SupplierCode = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_CODE],
                                                    objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_CODE]);
                                            } else if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                hrefUrl += ((objectDetail[modelField].isCustOrDisty) ?
                                                    DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                    DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_CODE_ID]);

                                                elasticObject.ManufacturerCode = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_CODE],
                                                    objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_CODE]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.CUST_ASSY_PN:
                                            elasticObject.PartNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            // code block
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.PRODUCTION_PN:
                                            elasticObject.ProductionPN = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MGFPN:
                                            if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                elasticObject.SupplierPartNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            } else {
                                                elasticObject.ManufacturerPartNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.NICKNAME:
                                            elasticObject.NickName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.PID_CODE: {
                                            const mfgCodeType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFG_TYPE];
                                            const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE,
                                                mfgCodeType.toLowerCase());
                                            hrefUrl += `${partUrl}${objectDetail.id}`;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.PartId = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MFGPN_DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.SPECIAL_NOTE:
                                            elasticObject.SpecialNote = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.RPT_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.FUNCTIONAL_TYPE.FUNCTIONAL_TYPE_URL;
                                            elasticObject.FunctionalType = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.RPT_NAME],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.RPT_NAME]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MOUNTING_TYPE_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.MOUNTING_TYPE.MOUNTING_TYPE_URL;
                                            elasticObject.MountingType = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MOUNTING_TYPE_NAME],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.MOUNTING_TYPE_NAME]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.PART_STATUS_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_STATUS.PART_STATUS_URL;
                                            elasticObject.PartStatus = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.PART_STATUS_NAME],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.PART_STATUS_NAME]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.ROHS_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.RFQ_ROHSMST_URL;
                                            elasticObject.RoHSStatus = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.ROHS_NAME],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.ROHS_NAME]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.LTB_DATE:
                                            elasticObject.LTBDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.EOL_DATE:
                                            elasticObject.EOLDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.DEVICE_MARKING:
                                            elasticObject.DeviceMarking = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.PART_PACKAGE:
                                            elasticObject.PackageCaseShape = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.POWER_RATING:
                                            elasticObject.Power = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.FEATURE:
                                            elasticObject.Feature = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.COLOR:
                                            elasticObject.Color = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.TOLERANCE:
                                            elasticObject.Tolerance = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.VOLTAGE:
                                            elasticObject.Voltage = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.VALUE:
                                            elasticObject.Value = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.RFQ_CONNECTER_TYPE_NAME:
                                            {
                                                const rfqConnecterType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.RFQ_CONNECTER_TYPE_NAME];
                                                elasticObject.Connectors = COMMON.createElasticOject(false,
                                                    null,
                                                    rfqConnecterType,
                                                    rfqConnecterType);
                                                break;
                                            }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.NO_OF_POSITION:
                                            elasticObject.PinCount = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.NO_OF_ROWS:
                                            elasticObject.NoOfRows = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.PACKAGING_NAME:
                                            {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PACKAGING_TYPE;
                                                const componentPackaging = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PART_MASTER_FIELD.PACKAGING_NAME];
                                                elasticObject.Packaging = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    componentPackaging,
                                                    componentPackaging);
                                                break;
                                            }
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.PART, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Add Record into RabbitMQ Queue
    // @param Master Type (Master Table Type)
    // @param ActionType (Operation for Add/Edit/Delete)
    // @param recrods (Master Table Details)
    // @param deleteIds (Master Table Details IDs)
    // @return Part Model Detail of Components
    ManageDetailInQueue: (req, masterType, actionType, recrods, deleteIds, entityID) => {
        var channel = global.EnterpriseSearchchannel;
        var queue = DATA_CONSTANT.SERVICE_QUEUE_PART.ENTERPRISE_ADD_DETAIL_QUEUE;
        if (channel) {
            channel.assertQueue(queue, { durable: true, autoDelete: false, exclusive: false });
            if (actionType === DATA_CONSTANT.ACTION_TYPE.MANAGE) {
                recrods.forEach((detail) => {
                    var objcetDetail = {
                        MasterType: masterType,
                        status: 'Success',
                        ActionType: actionType
                    };
                    if (actionType === DATA_CONSTANT.ACTION_TYPE.MANAGE && req) {
                        switch (masterType) {
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.RFQ:
                                objcetDetail.RFQMaster = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.PART:
                                objcetDetail.Parts = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.SALES_ORDER:
                                objcetDetail.SalesOrder = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.PACKING_SLIP:
                                objcetDetail.PackingSlip = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.SUPPLIER_QUOTE:
                                objcetDetail.SupplierQuote = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.WORK_ORDER:
                                objcetDetail.WorkOrders = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.UMID:
                                objcetDetail.UMIDs = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.MFG_CODE_MASTER:
                                objcetDetail.MfgCodeMasters = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.PERSONAL:
                                objcetDetail.Personals = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.OPERATION:
                                objcetDetail.Operations = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION:
                                objcetDetail.WorkOrderOperations = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION:
                                objcetDetail.EquipmentWorkStations = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.WAREHOUSE:
                                objcetDetail.Warehouses = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.TRAVELER:
                                objcetDetail.Travelers = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.UOM:
                                objcetDetail.UOMs = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.MERGER_ACQUISITIONS:
                                objcetDetail.MergerAcquisitions = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.KIT_ALLOCATION:
                                objcetDetail.KitAllocations = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.CONNECTOR_TYPES:
                                objcetDetail.ConnectorTypes = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.PART_STATUS:
                                objcetDetail.PartStatus = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.MOUNTING_GROUP:
                                objcetDetail.MountingGroups = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.FUNCTIONAL_TYPE:
                                objcetDetail.FunctionalTypes = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.MOUNTING_TYPES:
                                objcetDetail.MountingTypes = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.COST_CATEGORIES:
                                objcetDetail.CostCategories = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.PACKAGING_TYPES:
                                objcetDetail.PackagingTypes = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.STANDARDS:
                                objcetDetail.Standards = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.STANDARDS_CATEGORIES:
                                objcetDetail.StandardsCategories = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_EQUIPMENT:
                                objcetDetail.WOOperationEquipments = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_EMPLOYEE:
                                objcetDetail.WOOperationsEmployees = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_PART:
                                objcetDetail.WOOperationsParts = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.CHANGE_REQUEST:
                                objcetDetail.ChangeRequests = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION_TYPES:
                                objcetDetail.EquipmentWorkstationTypes = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION_GROUPS:
                                objcetDetail.EquipmentWorkstationGroups = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION_OWNERSHIPS:
                                objcetDetail.EquipmentWorkstationOwnerships = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.GEOLOCATIONS:
                                objcetDetail.Geolocations = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.ECO_DFM_CATEGORY:
                                objcetDetail.ECODFMCategorys = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.ECO_DFM_CATEGORY_ATTRIBUTES:
                                objcetDetail.ECODFMCategoryAttributes = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.ECO_DFM_TYPE:
                                objcetDetail.ECODFMTypes = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.RESERVE_STOCK_REQUEST:
                                objcetDetail.ReserveStockRequests = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.REQUEST_FOR_SHIPMENT:
                                objcetDetail.RequestForShipments = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_DOS_DONTS:
                                objcetDetail.WorkOrderOperationDoDonts = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.DEFECT_CATEGORY:
                                objcetDetail.DefectCategory = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.DEPARTMENT:
                                objcetDetail.Department = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.ENTITY:
                                objcetDetail.Entity = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.CUSTOMER_PACKING_SLIP:
                                objcetDetail.CustomerPackingSlip = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.CALIBRATION_DETAILS:
                                objcetDetail.CalibrationDetails = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.CUSTOMER_INVOICE:
                                objcetDetail.CustomerInvoice = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.SUPPLIER_RMA:
                                objcetDetail.SupplierRMA = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.PURCHASE_ORDER_DETAILS:
                                objcetDetail.PurchaseOrder = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.CUSTOMER_PAYMENT:
                                objcetDetail.CustomerPayment = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.CHART_OF_ACCOUNTS:
                                objcetDetail.ChartOfAccounts = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.ACCOUNT_TYPE:
                                objcetDetail.AccountType = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.PAYMENT_TYPE_CATEGORY:
                                objcetDetail.PaymentTypeCategory = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.SUPPLIER_PAYMENT:
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.SUPPLIER_REFUND:
                                objcetDetail.SupplierPayment = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.TRANSACTION_MODE:
                                objcetDetail.TransactionModes = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.SALES_ORDER_MST:
                                objcetDetail.SalesOrderMaster = [detail];
                                break;
                            case DATA_CONSTANT.MODLE_MASTER_TYPE.CONTACT_PERSON:
                                objcetDetail.ContactPerson = [detail];
                                break;
                            default:
                        }
                    }
                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(objcetDetail)));
                });
            } else if (actionType === DATA_CONSTANT.ACTION_TYPE.DELETE) {
                const entityDet = module.exports.getEntityJsonDetail(entityID);
                deleteIds = module.exports.generateIDWithPrefix(deleteIds, entityDet);
                const objcetDetail = {
                    MasterType: masterType,
                    status: 'Success',
                    ActionType: actionType
                };
                objcetDetail.Ids = deleteIds;
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(objcetDetail)));
            }
        }
    },
    // Delete Part(Component) Detail
    deletePartDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PART, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Component.ID);
    },
    // Delete SPN part on delete MPN Order Master
    deleteSPNOnDeleteMPN: (req, ids) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_RemoveSPNPartByMfgID (:pIDs)', {
            replacements: {
                pIDs: ids
            }
            // eslint-disable-next-line consistent-return
        }).then((purchaseOrder) => {
            const spnID = _.map(purchaseOrder, 'id');
            if (spnID.length > 0) {
                module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PART, DATA_CONSTANT.ACTION_TYPE.DELETE, null, spnID, COMMON.AllEntityIDS.Component.ID);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },
    // Delete Sales Order Detail
    deleteSalesOrderDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.SALES_ORDER, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.SALES_ORDER_DETAIL.ID);
    },

    // Delete Sales Order
    deleteSalesOrderInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.SALES_ORDER_MST, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.SalesOrder.ID);
    },
    // Delete Purchase Order Detail
    deletePurchaseOrderDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PURCHASE_ORDER_DETAILS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.PURCHASE_ORDER_MST.ID);
    },
    // Delete Purchase Order Master
    deletePurchaseOrderMasterElastic: (req, res, ids) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_PurchaseOrderElasticSearchRemoveIds (:pIDs)', {
            replacements: {
                pIDs: ids
            }
            // eslint-disable-next-line consistent-return
        }).then((purchaseOrder) => {
            const PurchasedetailIds = _.map(purchaseOrder, 'id');
            if (PurchasedetailIds.length > 0) {
                module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PURCHASE_ORDER_DETAILS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, PurchasedetailIds.toString(), COMMON.AllEntityIDS.PURCHASE_ORDER_MST.ID);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get List of Sales order and store into Elastic Search engine
    // GET : /api/v1/enterprise_search/manageSalesOrderDetailInElastic
    // @return List of Sales Order
    manageSalesOrderDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;

        var salesOrderModuleName = DATA_CONSTANT.SALESORDER_MST.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;
        pWhereClause.sodId = (req.params && (typeof (req.params) === 'object') && req.params.saleOrderDetId) ? req.params.saleOrderDetId : null;

        return sequelize.query('CALL Sproc_GetSalesOrderDetailForElastic (:pId,:psoDetId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.id,
                psoDetId: pWhereClause.sodId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((saleOrderDetail) => {
            if (!saleOrderDetail) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(salesOrderModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.SALES_ORDER_DETAIL.ID);
            if (isRequiredCount) {
                const totalCount = _.values(saleOrderDetail[0]) ? _.values(saleOrderDetail[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(saleOrderDetail);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObjectArray = [];
                        var elasticObject = {
                            Id: null,
                            SalesOrderNumber: null,
                            CustomerName: null,
                            CustomerCode: null,
                            SODate: null,
                            PONumber: null,
                            PODate: null,
                            AssyID: null,
                            MFRPN: null,
                            NickName: null,
                            AssyDescription: null,
                            POQty: null,
                            CustomerConsignMaterialPromisedDockDate: null,
                            PurchasedMaterialDocDate: null,
                            RushJob: null,
                            FreeOnBoardMst: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteSalesOrderDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.SOD_ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.SALES_ORDER_NUMBER:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.SALES_ORDER_MASTER.SALES_ORDER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.ID]);
                                            elasticObject.TItle = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.SalesOrderNumber = COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.CUSTOMER_ID:
                                            if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.CUSTOMER_ID]);
                                            } else if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                hrefUrl += ((objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.IS_CUST_OR_DISTY]) ?
                                                    DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                    DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.CUSTOMER_ID]);
                                            }
                                            elasticObject.CustomerName = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MFG_NAME],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MFG_NAME]);
                                            elasticObject.CustomerCode = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MFG_CODE],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MFG_CODE]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.FOB_NAME:
                                            elasticObject.FreeOnBoardMst = COMMON.createElasticOject(false, null, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.FOB_NAME],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.FOB_NAME]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.SO_DATE:
                                            elasticObject.SODate = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.PO_NUMBER:
                                            elasticObject.PONumber = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.PO_DATE:
                                            elasticObject.PODate = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.SOD_ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.PID_CODE: {
                                            const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE,
                                                (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MFG_TYPE]).toLowerCase());
                                            hrefUrl += `${partUrl}${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.PART_ID]}`;

                                            // var hreUrl = UI_URL + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE + detailObject.id;
                                            elasticObject.AssyID = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MGF_PN: {
                                            const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE,
                                                (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MFG_TYPE]).toLowerCase());
                                            hrefUrl += `${partUrl}${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.PART_ID]}`;

                                            elasticObject.MFRPN = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.NICKNAME:
                                            elasticObject.NickName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MFGPN_DESCRIPTION:
                                            elasticObject.AssyDescription = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.PO_QTY:
                                            elasticObject.POQty = COMMON.createElasticOject(false,
                                                null, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MATERIAL_TENTITIVE_DOC_DATE:
                                            elasticObject.CustomerConsignMaterialPromisedDockDate = COMMON.createElasticOject(false, null, objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.MATERIAL_DUE_DATE:
                                            elasticObject.PurchasedMaterialDocDate = COMMON.createElasticOject(false, null, objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_MASTER_FIELD.RUSH_JOB: {
                                            const rushJobValue = objectDetail[modelField] ? 'Yes' : 'No';
                                            elasticObject.RushJob = COMMON.createElasticOject(false,
                                                null,
                                                rushJobValue,
                                                rushJobValue);
                                            break;
                                        }
                                        default:
                                        // code block
                                    }
                                });

                                elasticObjectArray.push(elasticObject);
                            }
                        }
                        elasticObjectArray.forEach((detail) => {
                            responseModal.push(detail);
                        });
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.SALES_ORDER, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },

    // Get List of Sales order and store into Elastic Search engine
    // GET : /api/v1/enterprise_search/manageSalesOrderDetailInElastic
    // @return List of Sales Order
    manageSalesOrderInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;

        var salesOrderModuleName = DATA_CONSTANT.SALESORDER_MST.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;

        return sequelize.query('CALL Sproc_GetSalesOrderForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.id,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((saleOrderDetail) => {
            if (!saleOrderDetail) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(salesOrderModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.SalesOrder.ID);
            if (isRequiredCount) {
                const totalCount = _.values(saleOrderDetail[0]) ? _.values(saleOrderDetail[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(saleOrderDetail);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObjectArray = [];
                        var elasticObject = {
                            Id: null,
                            SalesOrderNumber: null,
                            CustomerName: null,
                            CustomerCode: null,
                            SODate: null,
                            PONumber: null,
                            PODate: null,
                            SystemID: null,
                            SOVersion: null,
                            SOVersionChangeNote: null,
                            Terms: null,
                            ShippingMethod: null,
                            CarrierAccount: null,
                            CarrierName: null,
                            FreeOnBoardMst: null,
                            PORevision: null,
                            RMAPO: null,
                            LegacyPO: null,
                            BlanketPO: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            RmaNumber: null,
                            IsDebitedByCustomer: null,
                            OrgPONumber: null,
                            IsReworkRequired: null,
                            ReworkPONumber: null,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isdeleted) {
                                module.exports.deleteSalesOrderInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.SALES_ORDER_NUMBER:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.SALES_ORDER_MASTER.SALES_ORDER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.ID]);
                                            elasticObject.TItle = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.SalesOrderNumber = COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.CUSTOMER_ID:
                                            if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.CUSTOMER_ID]);
                                            } else if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                hrefUrl += ((objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.IS_CUST_OR_DISTY]) ?
                                                    DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                    DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.CUSTOMER_ID]);
                                            }
                                            elasticObject.CustomerName = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.MFG_NAME],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.MFG_NAME]);
                                            elasticObject.CustomerCode = COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.MFG_CODE],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.MFG_CODE]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.FOB_NAME:
                                            elasticObject.FreeOnBoardMst = COMMON.createElasticOject(false, null, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.FOB_NAME],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.FOB_NAME]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.SO_DATE:
                                            elasticObject.SODate = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.PO_NUMBER:
                                            elasticObject.PONumber = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.PO_DATE:
                                            elasticObject.PODate = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.SO_REVISION:
                                            elasticObject.SOVersion = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.SO_REVISION_CHANGE_NOTE:
                                            elasticObject.SOVersionChangeNote = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.SERIALNUMBER:
                                            elasticObject.SystemID = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.BLANKETPO:
                                            elasticObject.BlanketPO = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.LEGACYPO:
                                            elasticObject.LegacyPO = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.RMAPO:
                                            elasticObject.RMAPO = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.CARRIER_ACCOUNT:
                                            elasticObject.CarrierAccount = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.CARRIER_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.CARRIER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.CARRIER_ID]);
                                            elasticObject.CarrierName = COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.SHIPPING_METHOD_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.SHIPPING_METHOD_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.SHIPPING_METHOD_ID]);
                                            elasticObject.ShippingMethod = COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.TERMS_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.PAYMENT_TERMS_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.TERMS_ID]);
                                            elasticObject.Terms = COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.RMANUMBER:
                                            elasticObject.RmaNumber = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.ISDEBITEDBYCUSTOMER:
                                            elasticObject.IsDebitedByCustomer = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.ORGPONUMBER:
                                            elasticObject.OrgPONumber = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.ISREWORKREQUIRED:
                                            elasticObject.IsReworkRequired = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SALES_ORDER_FIELD.REWORKPONUMBER:
                                            elasticObject.ReworkPONumber = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });

                                elasticObjectArray.push(elasticObject);
                            }
                        }
                        elasticObjectArray.forEach((detail) => {
                            responseModal.push(detail);
                        });
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.SALES_ORDER_MST, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Get list of Packing and store into Elastic Search engine
    // GET : /api/enterprise_search/managePackingSlipInElastic
    // @return List of Packing Slip
    managePackingSlipInElastic: (req, res, isRequiredCount) => {
        const {
            sequelize
        } = req.app.locals.models;

        var packingSlipName = DATA_CONSTANT.PACKING_SLIP.Name;
        var pWhereClause = { isDeleted: false };
        var elasticObjectArray = [];
        var responseModal = [];
        pWhereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;
        pWhereClause.receiptType = (req.params && (typeof (req.params) === 'object') && req.params.receiptType) ? req.params.receiptType : null;

        return sequelize.query('CALL Sproc_GetPackingSlipDetailForElastic (:pId,:pReceiptType,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.id,
                pReceiptType: pWhereClause.receiptType,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((packingSlip) => {
            if (!packingSlip) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(packingSlipName));
            }
            let entityDet = {};
            const packingSlipEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Packing_Slip.ID);
            const debitMemoEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.DEBIT_MEMO.ID);
            const creditMemoEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CREDIT_MEMO.ID);
            const supplierInvoiceEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.SUPPLIER_INVOICE.ID);
            entityDet = pWhereClause.receiptType === packingSlipEntity.Parameter.receiptType ? packingSlipEntity :
                (pWhereClause.receiptType === creditMemoEntity.Parameter.receiptType ? creditMemoEntity :
                    (pWhereClause.receiptType === debitMemoEntity.Parameter.receiptType ? debitMemoEntity : supplierInvoiceEntity));
            if (isRequiredCount) {
                const totalCount = _.values(packingSlip[0]) ? _.values(packingSlip[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(packingSlip);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            SystemId: null,
                            SupplierName: null,
                            PONumber: null,
                            RMANumber: null,
                            RMADate: null,
                            SONumber: null,
                            PackingSlipNumber: null,
                            PackingSlipDate: null,
                            InvoiceNumber: null,
                            InvoiceDate: null,
                            CreditMemoNumber: null,
                            CreditMemoDate: null,
                            DebitMemoNumber: null,
                            DebitMemoDate: null,
                            MaterialReceiptDate: null,
                            ShippedToDate: null,
                            RefPackingSlipNumber: null,
                            RefRMANumber: null,
                            RefInvoiceNumber: null,
                            creditMemoType: null,
                            creditMemoTypeValue: null,
                            debitMemoTypeValue: null,
                            receivingDetId: null,
                            PackingSlipSerialNumber: null,
                            InvoiceSerialNumber: null,
                            CreditMemoSerialNumber: null,
                            DebitMemoSerialNumber: null,
                            MFR: null,
                            MFRPN: null,
                            ChargeType: null,
                            PackagingName: null,
                            OrderedQty: null,
                            PackingSlipQty: null,
                            InvoicePrice: null,
                            ReceivedQty: null,
                            PurchasePrice: null,
                            NickName: null,
                            ReceiptType: null,
                            ReceivedStatusValue: null,
                            Remark: null,
                            HaltStatus: null,
                            HaltReason: null,
                            LockStatus: null,
                            IsReceivedAsWrongPart: null,
                            TotalReceivedAgainstPO: null,
                            DisputeQty: null,
                            BackOrderQty: null,
                            LockedBy: null,
                            LockedAt: null,
                            UOM: null,
                            RoHS: null,
                            InvoiceApprovedBy: null,
                            ApprovedAt: null,
                            ApprovalComment: null,
                            RefCreditMemoNumber: null,
                            LineQtyVariance: null,
                            ShippedQty: null,
                            CreditMemoQty: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            IsNonUMIDStock: null,
                            PSCustConsigned: null,
                            LineCustConsigned: null,
                            PSCustomer: null,
                            LineCustomer: null,
                            LineNonUMIDStock: null,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };

                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deletePackingSlipMaterialInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIVING_DET_ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.SYSTEM_ID: {
                                            elasticObject.SystemId = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.MFG_MST_ID: {
                                            const mfgMstId = objectDetail[modelField];
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.MFG_TYPE];
                                            const mfgName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.MFG_NAME];
                                            const isCustOrDisty = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.IS_CUSTORDISTY];

                                            if (mfgType) {
                                                if (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                    hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + (mfgMstId);
                                                } else if (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                    hrefUrl = hrefUrl + ((isCustOrDisty) ?
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) + (mfgMstId);
                                                }
                                                elasticObject.SupplierName = COMMON.createElasticOject(true, hrefUrl, mfgName, mfgName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PO_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                const refPurchaseOrderID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.REF_PURCHASE_ORDER_ID];
                                                if (refPurchaseOrderID) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PURCHASE_ORDER_MASTER.PURCHASE_ORDER_URL + refPurchaseOrderID;
                                                    elasticObject.PONumber = COMMON.createElasticOject(true,
                                                        hrefUrl,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]
                                                    );
                                                } else {
                                                    elasticObject.PONumber = COMMON.createElasticOject(false,
                                                        null,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]
                                                    );
                                                }
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RMA_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.RMANumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RMA_DATE: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.RMADate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.SO_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.SONumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PACKING_SLIP_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                if (objectDetail['receiptType'] === 'P') {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PACKING_SLIP_MASTER.PACKING_SLIP_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.ID]);
                                                    elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                                    elasticObject.TitleHrefUrl = hrefUrl;
                                                } else if (objectDetail['receiptType'] === 'I') {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PACKING_SLIP_MASTER.PACKING_SLIP_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.REF_PACKING_SLIP_ID]);
                                                } else if (objectDetail['creditMemoType'] === 'IC' || objectDetail['creditMemoType'] === 'ID') {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PACKING_SLIP_MASTER.PACKING_SLIP_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.REF_PACKING_SLIP_ID_FOR_MEMO]);
                                                } else if (objectDetail['creditMemoType'] === 'RC') {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.SUPPLIER_RMA_MASTER.SUPPLIER_RMA_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.REF_PACKING_SLIP_ID]);
                                                }


                                                if (objectDetail['creditMemoType'] === 'MC' || objectDetail['creditMemoType'] === 'MD') {
                                                    elasticObject.PackingSlipNumber = COMMON.createElasticOject(false,
                                                        null,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]
                                                    );
                                                } else {
                                                    elasticObject.PackingSlipNumber = COMMON.createElasticOject(true,
                                                        hrefUrl,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]
                                                    );
                                                }
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PACKING_SLIP_DATE: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.PackingSlipDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.INVOICE_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.SUPPLIER_INVOICE_MASTER.SUPPLIER_INVOICE_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.ID]);
                                                if (pWhereClause.receiptType === supplierInvoiceEntity.Parameter.receiptType) {
                                                    elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                                    elasticObject.TitleHrefUrl = hrefUrl;
                                                }
                                                elasticObject.InvoiceNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.INVOICE_DATE: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.InvoiceDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.CREDIT_MEMO_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.CREDIT_MEMO_MASTER.CREDIT_MEMO_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.ID]);

                                                if (pWhereClause.receiptType === creditMemoEntity.Parameter.receiptType) {
                                                    elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                                    elasticObject.TitleHrefUrl = hrefUrl;
                                                }
                                                elasticObject.CreditMemoNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.CREDIT_MEMO_DATE_DATE: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.CreditMemoDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.DEBIT_MEMO_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.DEBIT_MEMO_MASTER.DEBIT_MEMO_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.ID]);
                                                if (pWhereClause.receiptType === debitMemoEntity.Parameter.receiptType) {
                                                    elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                                    elasticObject.TitleHrefUrl = hrefUrl;
                                                }
                                                elasticObject.DebitMemoNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.DEBIT_MEMO_DATE_DATE: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.DebitMemoDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIPT_DATE: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.MaterialReceiptDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.SHIPPED_TO_DATE: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.ShippedToDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.REF_PACKING_SLIP_NUMBER: {
                                            if (objectDetail[modelField] && ((objectDetail['receiptType'] === 'C' && objectDetail['creditMemoType'] !== 'RC') || objectDetail['receiptType'] === 'D')) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.PACKING_SLIP_MASTER.PACKING_SLIP_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.REF_PACKING_SLIP_ID]);
                                                elasticObject.RefPackingSlipNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.REF_INVOICE_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.SUPPLIER_INVOICE_MASTER.SUPPLIER_INVOICE_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PARENT_INVOICE_ID]);
                                                elasticObject.RefInvoiceNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIPT_TYPE: {
                                            elasticObject.ReceiptType = objectDetail[modelField];
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIVED_STATUS_VALUE: {
                                            if (objectDetail[modelField] && (objectDetail['receiptType'] !== 'C' && objectDetail['receiptType'] !== 'D')) {
                                                elasticObject.ReceivedStatusValue = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.CREDIT_MEMO_TYPE: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.creditMemoType = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.CREDIT_MEMO_TYPE_VALUE: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.creditMemoTypeValue = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.DEBIT_MEMO_TYPE_VALUE: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.debitMemoTypeValue = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIVING_DET_ID: {
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PACKING_SLIP_SERIAL_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.PackingSlipSerialNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.INVOICE_SERIAL_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.InvoiceSerialNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.CREDIT_MEMO_SERIAL_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.CreditMemoSerialNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.DEBIT_MEMO_SERIAL_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.DebitMemoSerialNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.COMP_ID: {
                                            if (objectDetail[modelField]) {
                                                const compId = objectDetail[modelField];
                                                const mfgPN = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.MFGPN];
                                                if (mfgPN) {
                                                    const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE,
                                                        (DATA_CONSTANT.MFG_TYPE.MFG).toLowerCase());
                                                    hrefUrl += `${partUrl}${compId}`;
                                                    elasticObject.MFRPN = COMMON.createElasticOject(true, hrefUrl, mfgPN, mfgPN);
                                                }
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.MFR_PN_MFR_ID: {
                                            if (objectDetail[modelField]) {
                                                const mfrPnMfrId = objectDetail[modelField];
                                                const mfrPnMfrName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.MFR_PN_MFR_NAME];
                                                const mfrPnMfrCode = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.MFR_PN_MFR_CODE];

                                                if (mfrPnMfrCode) {
                                                    hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL + (mfrPnMfrId);
                                                    elasticObject.MFR = COMMON.createElasticOject(true, hrefUrl, COMMON.stringFormat('({0}) {1}', mfrPnMfrCode, mfrPnMfrName), COMMON.stringFormat('({0}) {1}', mfrPnMfrCode, mfrPnMfrName));
                                                }
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PACKAGING_NAME: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.PackagingName = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.NICKNAME: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.NickName = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.ORDERED_QTY: {
                                            if (objectDetail[modelField] && objectDetail['receiptType'] === 'P') {
                                                elasticObject.OrderedQty = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PACKING_SLIP_QTY: {
                                            if (objectDetail[modelField]) {
                                                if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIPT_TYPE] === DATA_CONSTANT.ELASTIC_ENTITY[5].Parameter.receiptType && objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.CREDIT_MEMO_TYPE] === DATA_CONSTANT.CREDIT_MEMO_TYPE.RMA) {
                                                    elasticObject.CreditMemoQty = COMMON.createElasticOject(false,
                                                        null,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]
                                                    );
                                                } else {
                                                    elasticObject.PackingSlipQty = COMMON.createElasticOject(false,
                                                        null,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]
                                                    );
                                                }
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIVED_QTY: {
                                            if (objectDetail[modelField]) {
                                                if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIPT_TYPE] === DATA_CONSTANT.ELASTIC_ENTITY[5].Parameter.receiptType && objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.CREDIT_MEMO_TYPE] === DATA_CONSTANT.CREDIT_MEMO_TYPE.RMA) {
                                                    elasticObject.ShippedQty = COMMON.createElasticOject(false,
                                                        null,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]
                                                    );
                                                } else {
                                                    elasticObject.ReceivedQty = COMMON.createElasticOject(false,
                                                        null,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]
                                                    );
                                                }
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.REMARK: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.Remark = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.HaltStatus: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.HaltStatus = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.HaltReason: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.HaltReason = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.LockStatus: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.LockStatus = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.IS_RECEIVED_AS_WROREMARKNG_PART: {
                                            if (objectDetail[modelField] && objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIPT_TYPE] === DATA_CONSTANT.ELASTIC_ENTITY[4].Parameter.receiptType) {
                                                elasticObject.IsReceivedAsWrongPart = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.UOM: {
                                            if (objectDetail[modelField] && objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIPT_TYPE] === DATA_CONSTANT.ELASTIC_ENTITY[4].Parameter.receiptType) {
                                                elasticObject.UOM = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.ROHS: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.RoHS = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.TOTAL_RECEIVED_AGAINST_PO: {
                                            if (objectDetail[modelField] && objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIPT_TYPE] === DATA_CONSTANT.ELASTIC_ENTITY[4].Parameter.receiptType) {
                                                elasticObject.TotalReceivedAgainstPO = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.BACKORDER_QTY: {
                                            if (objectDetail[modelField] && objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIPT_TYPE] === DATA_CONSTANT.ELASTIC_ENTITY[4].Parameter.receiptType) {
                                                elasticObject.BackOrderQty = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.DISPUTE_QTY: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.DisputeQty = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.LOCKED_BY: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.LockedBy = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.LOCKED_AT: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.LockedAt = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.INVOICE_APPROVED_BY: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.InvoiceApprovedBy = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.APPROVED_AT: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.ApprovedAt = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.APPROVAL_COMMENT: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.ApprovalComment = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.REF_CREDIT_MEMO_NUMBER: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.RefCreditMemoNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.LINE_QTY_VARIANCE: {
                                            if (objectDetail[modelField] && objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.RECEIPT_TYPE] === DATA_CONSTANT.ELASTIC_ENTITY[5].Parameter.receiptType) {
                                                elasticObject.LineQtyVariance = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]
                                                );
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PS_CUST_CONSIGNED: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.PSCustConsigned = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PS_LINE_CUST_CONSIGNED: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.LineCustConsigned = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.IS_NON_UMID_STOCK: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.IsNonUMIDStock = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PS_CUSTOMER_ID: {
                                            const psCustomerID = objectDetail[modelField];
                                            const psCustomerName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PS_CUSTOMER];

                                            if (psCustomerName) {
                                                hrefUrl = hrefUrl + (DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL) + (psCustomerID);
                                                elasticObject.PSCustomer = COMMON.createElasticOject(true, hrefUrl, psCustomerName, psCustomerName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PS_LINE_CUSTOMER_ID: {
                                            const psLineCustomerID = objectDetail[modelField];
                                            const psLineCustomerName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PS_LINE_CUSTOMER];

                                            if (psLineCustomerName) {
                                                hrefUrl = hrefUrl + (DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL) + (psLineCustomerID);
                                                elasticObject.LineCustomer = COMMON.createElasticOject(true, hrefUrl, psLineCustomerName, psLineCustomerName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PACKING_SLIP_MASTER_FIELD.PS_LINE_NON_UMID_STOCK: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.LineNonUMIDStock = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        default:
                                        // code block
                                    }
                                });
                                elasticObjectArray.push(elasticObject);
                            }
                        }
                    });
                    elasticObjectArray.forEach((detail) => {
                        responseModal.push(detail);
                    });
                }
                if (responseModal.length > 0) {
                    module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.PACKING_SLIP, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                }
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Get list of Purchase Order into Elastic Search engine
    // GET : /api/enterprise_search/managePurchaseOrderElastic
    // @return List of Purchase order elastic
    managePurchaseOrderElastic: (req, res, isRequiredCount) => {
        const {
            sequelize
        } = req.app.locals.models;

        var purchaseOrderName = DATA_CONSTANT.PURCHASE_ORDER.Name;
        var pWhereClause = { isDeleted: false };
        var elasticObjectArray = [];
        var responseModal = [];
        pWhereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;
        return sequelize.query('CALL Sproc_PurchaseOrderElasticSearchDetail (:poID,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                poID: pWhereClause.id,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((purchaseOrder) => {
            if (!purchaseOrder) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(purchaseOrderName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.PURCHASE_ORDER_MST.ID);
            if (isRequiredCount) {
                const totalCount = _.values(purchaseOrder[0]) ? _.values(purchaseOrder[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(purchaseOrder);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            poDate: null,
                            poNumber: null,
                            poRevision: null,
                            soDate: null,
                            soNumber: null,
                            supplier: null,
                            supplierQuoteNumber: null,
                            terms: null,
                            shippingMethod: null,
                            carrier: null,
                            carrierAccountNumber: null,
                            poComment: null,
                            InternalRef: null,
                            pid: null,
                            manufacturer: null,
                            MFRPN: null,
                            description: null,
                            poQty: null,
                            Uom: null,
                            Packaging: null,
                            serialNumber: null,
                            PoWorkingStatus: null,
                            cancleReason: null,
                            CancellationConfirmed: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            POCustConsigned: null,
                            LineCustConsigned: null,
                            POCustomer: null,
                            LineCustomer: null,
                            IsNonUMIDStock: null,
                            LineNonUMIDStock: null,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deletePurchaseOrderDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.MFRID: { // manufacturer
                                            const mfgMstId = objectDetail[modelField];
                                            const mfgName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.MFR];

                                            if (mfgName) {
                                                hrefUrl = hrefUrl + (DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) + (mfgMstId);
                                                elasticObject.manufacturer = COMMON.createElasticOject(true, hrefUrl, mfgName, mfgName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.PONUMBER: // ponumber
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PURCHASE_ORDER_MASTER.PURCHASE_ORDER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.POID]);
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.poNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.POREVISION: // porevision
                                            elasticObject.poRevision = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.SONUMBER: // sonumber
                                            elasticObject.soNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.PODATE: // podate
                                            elasticObject.poDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.SODATE: // sodate
                                            elasticObject.soDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.SUPPLIERID: { // supplier
                                            const mfgMstId = objectDetail[modelField];
                                            const mfgName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.SUPPLIERNAME];

                                            if (mfgName) {
                                                hrefUrl = hrefUrl + (DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL) + (mfgMstId);
                                                elasticObject.supplier = COMMON.createElasticOject(true, hrefUrl, mfgName, mfgName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.SUPPLIERQUOTENUMBER: // supplierQuoteNumber
                                            elasticObject.supplierQuoteNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.SHIPPINGMETHOD: // shipping method
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.SHIPPING_METHOD_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.SHIPPINGMETHODID]);
                                            elasticObject.shippingMethod = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.CARRIERNAME: // carrier
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.CARRIER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.CARRIERID]);
                                            elasticObject.carrier = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.TERMS: // payment terms
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.PAYMENT_TERMS_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.TERMSID]);
                                            elasticObject.terms = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.ID: // id
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.CARRIERACCOUNT: // carrier account number
                                            elasticObject.carrierAccountNumber = COMMON.createElasticOject(false,
                                                null, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.POCOMMENT: // po comment
                                            elasticObject.poComment = COMMON.createElasticOject(false,
                                                null, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.INTERNALREF: // internal ref
                                            elasticObject.InternalRef = COMMON.createElasticOject(false,
                                                null, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.DESCRIPTION: // description
                                            elasticObject.description = COMMON.createElasticOject(false,
                                                null, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.QTY: // po qty
                                            elasticObject.poQty = COMMON.createElasticOject(false,
                                                null, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.PACKAGINGNAME: // packaging
                                            elasticObject.Packaging = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.UOM: // uom
                                            elasticObject.Uom = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.SERIAL_NUMBER: // sonumber
                                            elasticObject.serialNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.PO_WORKING_STATUS: // poWorkingStatus
                                            elasticObject.PoWorkingStatus = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.CANCELLATION_REASON: // cancel reason
                                            elasticObject.cancleReason = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.CANCELLATION_CONFIRMED: // cancellation confirmation
                                            elasticObject.CancellationConfirmed = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.MFRPNID: {
                                            const compId = objectDetail[modelField];
                                            const mfgPN = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.MFRPN];
                                            const mfgType = 'mfg';
                                            const pid = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.PIDCODE];
                                            const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType);
                                            hrefUrl += `${partUrl}${compId}`;
                                            elasticObject.MFRPN = COMMON.createElasticOject(true, hrefUrl, mfgPN, mfgPN);
                                            elasticObject.pid = COMMON.createElasticOject(true, hrefUrl, pid, pid);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.PO_CUSTOMER_CONSIGNED: // PO Customer Consigned (No Charge)
                                            elasticObject.POCustConsigned = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.LINE_CUSTOMER_CONSIGNED: // PO Line Customer Consigned (No Charge)
                                            elasticObject.LineCustConsigned = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.PO_CUSTOMER_ID: { // PO Customer
                                            const poCustomerID = objectDetail[modelField];
                                            const poCustomerName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.PO_CUSTOMER];

                                            if (poCustomerName) {
                                                hrefUrl = hrefUrl + (DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL) + (poCustomerID);
                                                elasticObject.POCustomer = COMMON.createElasticOject(true, hrefUrl, poCustomerName, poCustomerName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.LINE_CUSTOMER_ID: { // PO Line Customer
                                            const poLineCustomerID = objectDetail[modelField];
                                            const poLineCustomerName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.LINE_CUSTOMER];

                                            if (poLineCustomerName) {
                                                hrefUrl = hrefUrl + (DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL) + (poLineCustomerID);
                                                elasticObject.LineCustomer = COMMON.createElasticOject(true, hrefUrl, poLineCustomerName, poLineCustomerName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.PO_NON_UMID_STOCK: // PO Do Not Create UMID
                                            elasticObject.IsNonUMIDStock = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PURCHASE_ORDER_FIELD.LINE_NON_UMID_STOCK: // PO Line Do Not Create UMID
                                            elasticObject.LineNonUMIDStock = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                elasticObjectArray.push(elasticObject);
                            }
                        }
                    });
                    elasticObjectArray.forEach((detail) => {
                        responseModal.push(detail);
                    });
                }
                if (responseModal.length > 0) {
                    module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.PURCHASE_ORDER_DETAILS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Get list of Packing and store into Elastic Search engine
    // GET : /api/enterprise_search/manageSupplierRMAInElastic
    // @return List of Packing Slip
    manageSupplierRMAInElastic: (req, res, isRequiredCount) => {
        const {
            sequelize
        } = req.app.locals.models;

        var supplierRMAName = DATA_CONSTANT.SUPPLIER_RMA.Name;
        var pWhereClause = { isDeleted: false };
        var elasticObjectArray = [];
        var responseModal = [];
        pWhereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;

        return sequelize.query('CALL Sproc_GetSupplierRMADetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.id,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((supplierRMA) => {
            if (!supplierRMA) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(supplierRMAName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.SUPPLIER_RMA.ID);
            if (isRequiredCount) {
                const totalCount = _.values(supplierRMA[0]) ? _.values(supplierRMA[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(supplierRMA);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            SystemId: null,
                            SupplierName: null,
                            RMANumber: null,
                            RMADate: null,
                            PackingSlipNumber: null,
                            PackingSlipDate: null,
                            ShippedDate: null,
                            ShippingMethodId: null,
                            ShippingMethod: null,
                            CarrierId: null,
                            Carrier: null,
                            RMALineNumber: null,
                            MFR: null,
                            MFRPN: null,
                            PackagingName: null,
                            ShippedQty: null,
                            RefPackingSlipNumber: null,
                            RefInvoiceNumber: null,
                            RMAComment: null,
                            SPN: null,
                            UOM: null,
                            RMAQty: null,
                            RMALineComment: null,
                            LockedBy: null,
                            LockedAt: null,
                            LockStatus: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };

                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteSupplierRMAInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.RECEIVING_DET_ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.SYSTEM_ID: {
                                            elasticObject.SystemId = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.RECEIVING_DET_ID: {
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.MFG_MST_ID: {
                                            const mfgMstId = objectDetail[modelField];
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.MFG_TYPE];
                                            const mfgName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.MFG_NAME];

                                            if (mfgType) {
                                                if (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                    hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + (mfgMstId);
                                                } else if (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL + (mfgMstId);
                                                }
                                                elasticObject.SupplierName = COMMON.createElasticOject(true, hrefUrl, mfgName, mfgName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.RMA_NUMBER: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.SUPPLIER_RMA_MASTER.SUPPLIER_RMA_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.ID]);
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.RMANumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.RMA_DATE: {
                                            elasticObject.RMADate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.PACKING_SLIP_NUMBER: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.SUPPLIER_RMA_MASTER.SUPPLIER_RMA_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.ID]);

                                            elasticObject.PackingSlipNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.PACKING_SLIP_DATE: {
                                            elasticObject.PackingSlipDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.SHIPPED_DATE: {
                                            elasticObject.ShippedDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.SHIPPING_METHOD: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.SHIPPING_METHOD_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.SHIPPING_METHOD_ID]);

                                            elasticObject.ShippingMethod = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.CARRIER: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.CARRIER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.CARRIER_ID]);

                                            elasticObject.Carrier = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.RMA_LINE_NUMBER: {
                                            elasticObject.RMALineNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.COMP_ID: {
                                            const compId = objectDetail[modelField];
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.MFR_PN_MFG_TYPE];
                                            const mfgPN = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.MFGPN];
                                            if (mfgPN && mfgType) {
                                                const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                                hrefUrl += `${partUrl}${compId}`;
                                                elasticObject.MFRPN = COMMON.createElasticOject(true, hrefUrl, mfgPN, mfgPN);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.MFR_PN_MFR_ID: {
                                            const mfrPnMfrId = objectDetail[modelField];
                                            const mfrPnMfrName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.MFR_PN_MFR_NAME];
                                            const mfrPnMfrCode = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.MFR_PN_MFR_CODE];

                                            if (mfrPnMfrCode) {
                                                hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL + (mfrPnMfrId);
                                                elasticObject.MFR = COMMON.createElasticOject(true, hrefUrl, COMMON.stringFormat('({0}) {1}', mfrPnMfrCode, mfrPnMfrName), COMMON.stringFormat('({0}) {1}', mfrPnMfrCode, mfrPnMfrName));
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.PACKAGING_NAME: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PACKANGING_TYPES.PACKANGING_TYPES_URL;
                                            elasticObject.PackagingName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.SHIPPED_QTY: {
                                            elasticObject.ShippedQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.REF_PACKING_SLIP_NUMBER: {
                                            elasticObject.RefPackingSlipNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.REF_INVOICE_NUMBER: {
                                            elasticObject.RefInvoiceNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.RMA_COMMENT: {
                                            elasticObject.RMAComment = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.SPN: {
                                            const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, (DATA_CONSTANT.MFG_TYPE.DIST).toLowerCase());
                                            hrefUrl += `${partUrl}${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.SPNID]}`;
                                            elasticObject.SPN = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.UOM: {
                                            elasticObject.UOM = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.RMA_QTY: {
                                            elasticObject.RMAQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.RMA_LINE_COMMENT: {
                                            elasticObject.RMALineComment = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.LOCKED_BY: {
                                            elasticObject.LockedBy = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.LOCKED_AT: {
                                            elasticObject.LockedAt = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_RMA_MASTER_FIELD.LOCK_STATUS: {
                                            elasticObject.LockStatus = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        default:
                                        // code block
                                    }
                                });
                                elasticObjectArray.push(elasticObject);
                            }
                        }
                    });
                    elasticObjectArray.forEach((detail) => {
                        responseModal.push(detail);
                    });
                }
                if (responseModal.length > 0) {
                    module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.SUPPLIER_RMA, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                }
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Packing Slip Material Detail
    deleteSupplierRMAInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.SUPPLIER_RMA, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.SUPPLIER_RMA.ID);
    },
    // Get list of Packing and store into Elastic Search engine
    // GET : /api/enterprise_search/manageCustomerPackingSlipInElastic
    // @return List of Packing Slip
    manageCustomerPackingSlipInElastic: (req, res, isRequiredCount) => {
        const {
            sequelize
        } = req.app.locals.models;

        var packingSlipName = DATA_CONSTANT.CUSTOMER_PACKING_SLIP.Name;
        const pWhereClause = { isDeleted: false };
        var elasticObjectArray = [];
        var responseModal = [];
        pWhereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;
        pWhereClause.detID = (req.params && (typeof (req.params) === 'object') && req.params.detID) ? req.params.detID : null;

        return sequelize.query('CALL Sproc_GetCustomerPackingSlipDetailForElastic (:pId,:pdetID,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.id,
                pdetID: pWhereClause.detID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((packingSlip) => {
            if (!packingSlip) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(packingSlipName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Customer_PackingSlip_DET.ID);
            if (isRequiredCount) {
                const totalCount = _.values(packingSlip[0]) ? _.values(packingSlip[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(packingSlip);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            PackingSlipNumber: null,
                            PackingSlipDate: null,
                            PackingSlipType: null,
                            PackingSlipStatus: null,
                            CustomerName: null,
                            CustomerCode: null,
                            SONumber: null,
                            SODate: null,
                            SORevision: null,
                            PONumber: null,
                            PODate: null,
                            MFRPN: null,
                            PIDCode: null,
                            NickName: null,
                            AssyPartDescription: null,
                            CustomerPOLineNumber: null,
                            POQty: null,
                            ShipmentQty: null,
                            RemainingQty: null,
                            HeaderComment: null,
                            PackingSlipComment: null,
                            InternalComment: null,
                            Standards: null,
                            ShippingNotes: null,
                            SystemID: null,
                            TermsDisplayText: null,
                            ShippingMethodDisplayText: null,
                            SalesCommissionToDisplayText: null,
                            FreeOnBoardDisplayText: null,
                            TrackingNumberList: null,
                            PoRevision: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            CarrierId: null,
                            carrierDisplayText: null,
                            carrierAccountNumber: null,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };

                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteCustomerPackingSlipMaterialInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.CUSTOMERID: {
                                            const mfgMstId = objectDetail[modelField];
                                            const mfgName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.CUSTOMERNAME];
                                            const mfgCode = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.CUSTOMERCODE];
                                            if (mfgCode) {
                                                hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL + (mfgMstId);
                                                elasticObject.CustomerCode = COMMON.createElasticOject(true, hrefUrl, mfgCode, mfgCode);
                                                elasticObject.CustomerName = COMMON.createElasticOject(true, hrefUrl, mfgName, mfgName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.PACKING_SLIP_NUMBER:
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.CUSTOMER_PACKING_SLIP_MASTER.PACKING_SLIP_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.ID])}/${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SALESORDERID]}/`;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.PackingSlipNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.PACKING_SLIP_DATE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.PackingSlipDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.PACKINGSLIPTYPE:
                                            elasticObject.PackingSlipType = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.STATUS:
                                            elasticObject.PackingSlipStatus = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.REVISION:
                                            if (objectDetail[modelField]) {
                                                elasticObject.SORevision = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SODATE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.SODate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.PODATE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.PODate = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.POQTY:
                                            elasticObject.POQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.CUSTPOLINE:
                                            elasticObject.CustomerPOLineNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SHIPMENT_QTY:
                                            elasticObject.ShipmentQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.REMAINING_QTY:
                                            elasticObject.RemainingQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.CUSTOMERPACKINGSLIPDETID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.COMP_ID: {
                                            const compId = objectDetail[modelField];
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.MFGTYPE];
                                            const pidCode = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.PIDCODE];
                                            const mfgPN = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.MFGPN];
                                            if (mfgPN && mfgType) {
                                                const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                                hrefUrl += `${partUrl}${compId}`;
                                                elasticObject.MFRPN = COMMON.createElasticOject(true, hrefUrl, mfgPN, mfgPN);
                                                elasticObject.PIDCode = COMMON.createElasticOject(true, hrefUrl, pidCode, pidCode);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.NICKNAME:
                                            elasticObject.NickName = COMMON.createElasticOject(false,
                                                null, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.ASSY_PART_DESCRIPTION:
                                            elasticObject.AssyPartDescription = COMMON.createElasticOject(false,
                                                null, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SONUMBER:
                                            if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SALESORDERID]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.SALES_ORDER_MASTER.SALES_ORDER_URL +
                                                    (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SALESORDERID]);

                                                elasticObject.SONumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            } else {
                                                elasticObject.SONumber = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.PONUMBER: {
                                            if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SALESORDERID]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.SALES_ORDER_MASTER.SALES_ORDER_URL +
                                                    (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SALESORDERID]);

                                                elasticObject.PONumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            } else {
                                                elasticObject.PONumber = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.HEADERCOMMENT:
                                            elasticObject.HeaderComment = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.PACKINGSLIPCOMMENT:
                                            elasticObject.PackingSlipComment = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.INTERNALCOMMENT:
                                            elasticObject.InternalComment = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.STANDARDS:
                                            elasticObject.Standards = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SHIPPINGNOTES:
                                            elasticObject.ShippingNotes = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SYSTEM_ID: {
                                            elasticObject.SystemID = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.TERMS_DISPLAY_TEXT:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.PAYMENT_TERMS_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.TERMS_ID]);
                                            elasticObject.TermsDisplayText = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SHIPPING_METHOD_DISPLAY_TEXT:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.SHIPPING_METHOD_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SHIPPING_METHOD_ID]);
                                            elasticObject.ShippingMethodDisplayText = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SALES_COMMISSION_TO_DISPLAY_TEXT:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PERSONAL.PERSONAL_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.SALES_COMMISSION_TO]);
                                            elasticObject.SalesCommissionToDisplayText = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.FREEONBOARD_ID: {
                                            elasticObject.FreeOnBoardDisplayText = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.TRACKING_NUMBER_LIST:
                                            if (objectDetail[modelField]) {
                                                elasticObject.TrackingNumberList = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.PO_REVISION:
                                            elasticObject.PoRevision = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.CARRIER_DISPLAY_TEXT:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.CARRIER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.CARRIER_ID]);
                                            elasticObject.carrierDisplayText = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.CARRIERACCOUNTNUMBER:
                                            elasticObject.carrierAccountNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                elasticObjectArray.push(elasticObject);
                            }
                        }
                    });
                    elasticObjectArray.forEach((detail) => {
                        responseModal.push(detail);
                    });
                }
                if (responseModal.length > 0) {
                    module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.CUSTOMER_PACKING_SLIP, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                }
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Customer Packing Slip Material Detail
    deleteCustomerPackingSlipMaterialInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.CUSTOMER_PACKING_SLIP, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Customer_PackingSlip_DET.ID);
    },
    // Get list of Invoice and store into Elastic Search engine
    // GET : /api/enterprise_search/manageCustomerInvoiceInElastic
    // @return List of Packing Slip
    manageCustomerInvoiceInElastic: (req, res, isRequiredCount) => {
        const {
            sequelize
        } = req.app.locals.models;

        var invoiceName = DATA_CONSTANT.CUSTOMER_INVOICE.Name;
        const pWhereClause = { isDeleted: false };
        var elasticObjectArray = [];
        var responseModal = [];
        pWhereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;
        pWhereClause.transType = (req.params && (typeof (req.params) === 'object') && req.params.transType) ? req.params.transType : null;

        return sequelize.query('CALL Sproc_GetCustomerInvoiceDetailForElastic (:pId,:pTransType,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.id,
                pTransType: pWhereClause.transType || null,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((invoice) => {
            if (!invoice) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(invoiceName));
            }
            let entityDet = {};
            const customerInvoiceSlipEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CustomerInvoice.ID);
            const customerCreditMemoEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CUSTOMER_CREDIT_MEMO.ID);
            entityDet = pWhereClause.transType === customerInvoiceSlipEntity.Parameter.transType ? customerInvoiceSlipEntity : customerCreditMemoEntity;

            if (isRequiredCount) {
                const totalCount = _.values(invoice[0]) ? _.values(invoice[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(invoice);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            InvoiceNumber: null,
                            InvoiceDate: null,
                            // InvoiceStatus: null,
                            PackingSlipNumber: null,
                            PackingSlipDate: null,
                            CustomerName: null,
                            CustomerCode: null,
                            SONumber: null,
                            SODate: null,
                            SORevision: null,
                            PONumber: null,
                            PODate: null,
                            POLineNum: null,
                            Locked: null,
                            FOBName: null,
                            ShippingMethod: null,
                            MfrPN: null,
                            SystemID: null,
                            TermsDisplayText: null,
                            SalesCommissionToDisplayText: null,
                            HeaderComment: null,
                            PackingSlipComment: null,
                            NickName: null,
                            ShipQty: null,
                            InternalComment: null,
                            ShippingNotes: null,
                            AssyPartDescription: null,
                            CustomerPOLineNumber: null,
                            CreditMemoNumber: null,
                            CreditMemoDate: null,
                            RefDebitMemoNumber: null,
                            RefDebitMemoDate: null,
                            RMANumber: null,
                            TransType: null,
                            TrackingNumberList: null,
                            InvoiceType: null,
                            StatusConvertedValue: null,
                            PoRevision: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };

                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteCustomerInvoiceMaterialInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.CUST_INV_DET_ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.CUSTOMERID: {
                                            const mfgMstId = objectDetail[modelField];
                                            const mfgName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.CUSTOMERNAME];
                                            const mfgCode = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.CUSTOMERCODE];
                                            if (mfgCode) {
                                                hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL + (mfgMstId);
                                                elasticObject.CustomerCode = COMMON.createElasticOject(true, hrefUrl, mfgCode, mfgCode);
                                                elasticObject.CustomerName = COMMON.createElasticOject(true, hrefUrl, mfgName, mfgName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.PACKING_SLIP_NUMBER:
                                            if (objectDetail[modelField]) {
                                                if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.PACKINGSLIPID]) {
                                                    hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.CUSTOMER_PACKING_SLIP_MASTER.PACKING_SLIP_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.PACKINGSLIPID])}/${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SALESORDERID]}`;
                                                } else {
                                                    hrefUrl = null;
                                                }

                                                elasticObject.PackingSlipNumber = COMMON.createElasticOject(hrefUrl ? true : false,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.INVOICENUMBER:
                                            if (objectDetail[modelField] && objectDetail.transType !== 'C') {
                                                hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.CUSTOMER_INVOICE_MASTER.INVOICE_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.ID])}/`;
                                                elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                                elasticObject.TitleHrefUrl = hrefUrl;
                                                elasticObject.InvoiceNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            } else if (objectDetail[modelField] && objectDetail.transType === 'C') {
                                                elasticObject.InvoiceNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.PACKING_SLIP_DATE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.PackingSlipDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            }
                                            break;
                                        // case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.STATUS:
                                        //    elasticObject.InvoiceStatus = COMMON.createElasticOject(false,
                                        //        null,
                                        //        objectDetail[modelField],
                                        //        objectDetail[modelField]);
                                        //    break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.REVISION:
                                            if (objectDetail[modelField]) {
                                                elasticObject.SORevision = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SODATE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.SODate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.INVOICEDATE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.InvoiceDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.PODATE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.PODate = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.CUST_INV_DET_ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SONUMBER:
                                            if (objectDetail[modelField]) {
                                                if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SALESORDERID]) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.SALES_ORDER_MASTER.SALES_ORDER_URL +
                                                        (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SALESORDERID]);

                                                    elasticObject.SONumber = COMMON.createElasticOject(true,
                                                        hrefUrl,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]);
                                                } else {
                                                    elasticObject.SONumber = COMMON.createElasticOject(false,
                                                        null, objectDetail[modelField], objectDetail[modelField]);
                                                }
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.PONUMBER: {
                                            if (objectDetail[modelField]) {
                                                if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SALESORDERID]) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.SALES_ORDER_MASTER.SALES_ORDER_URL +
                                                        (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SALESORDERID]);

                                                    elasticObject.PONumber = COMMON.createElasticOject(true,
                                                        hrefUrl,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]);
                                                } else {
                                                    elasticObject.PONumber = COMMON.createElasticOject(false,
                                                        null, objectDetail[modelField], objectDetail[modelField]);
                                                }
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.POLINENUM: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.POLineNum = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.LOCKED: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.Locked = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.FOBNAME: {
                                            if (objectDetail[modelField]) {
                                                elasticObject.FOBName = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SHIPPINGMETHOD: {
                                            if (objectDetail[modelField]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.SHIPPING_METHOD_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SHIPPING_METHOD_ID]);
                                                elasticObject.ShippingMethod = COMMON.createElasticOject(true,
                                                    hrefUrl, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.MFRPN: {
                                            const mfgPN = objectDetail[modelField];
                                            if (mfgPN) {
                                                const PartID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.PARTID];
                                                const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.MFGTYPE];
                                                const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                                hrefUrl += `${partUrl}${PartID}`;
                                                elasticObject.MFRPN = COMMON.createElasticOject(true, hrefUrl, mfgPN, mfgPN);
                                            }
                                            break;
                                        }
                                        // case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SHIPPEDQTY: {
                                        //    elasticObject.ShippedQty = COMMON.createElasticOject(false,
                                        //        null, objectDetail[modelField], objectDetail[modelField]);
                                        //    break;
                                        // }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SYSTEM_ID: {
                                            elasticObject.SystemID = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.TERMS_DISPLAY_TEXT:
                                            if (objectDetail[modelField]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.PAYMENT_TERMS_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.TERMS_ID]);
                                                elasticObject.TermsDisplayText = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SALES_COMMISSION_TO_DISPLAY_TEXT:
                                            if (objectDetail[modelField]) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.PERSONAL.PERSONAL_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SALES_COMMISSION_TO]);
                                                elasticObject.SalesCommissionToDisplayText = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.HEADERCOMMENT:
                                            if (objectDetail[modelField]) {
                                                elasticObject.HeaderComment = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.PACKINGSLIPCOMMENT:
                                            if (objectDetail[modelField]) {
                                                elasticObject.PackingSlipComment = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.COMP_ID: {
                                            const compId = objectDetail[modelField];
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.MFGTYPE];
                                            const pidCode = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.PIDCODE];
                                            // const mfgPN = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.MFGPN];
                                            if (objectDetail[modelField]) {
                                                if (pidCode && mfgType) {
                                                    const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                                    hrefUrl += `${partUrl}${compId}`;
                                                    // elasticObject.MFRPN = COMMON.createElasticOject(true, hrefUrl, mfgPN, mfgPN);
                                                    elasticObject.PIDCode = COMMON.createElasticOject(true, hrefUrl, pidCode, pidCode);
                                                }
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.NICKNAME:
                                            elasticObject.NickName = COMMON.createElasticOject(false,
                                                null, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SHIP_QTY:
                                            elasticObject.ShipQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.INTERNALCOMMENT:
                                            if (objectDetail[modelField]) {
                                                elasticObject.InternalComment = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.SHIPPINGNOTES:
                                            if (objectDetail[modelField]) {
                                                elasticObject.ShippingNotes = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.ASSY_PART_DESCRIPTION:
                                            elasticObject.AssyPartDescription = COMMON.createElasticOject(false,
                                                null, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.CUSTPOLINE:
                                            elasticObject.CustomerPOLineNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.CREDIT_MEMO_NUMBER:
                                            if (objectDetail[modelField]) {
                                                hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.CUSTOMER_CREDIT_MEMO.CREDIT_MEMO_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.ID])}`;

                                                if (objectDetail[modelField] && objectDetail.transType === 'C') {
                                                    elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                                    elasticObject.TitleHrefUrl = hrefUrl;
                                                }
                                                elasticObject.CreditMemoNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.CREDIT_MEMO_DATE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.CreditMemoDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.REF_DEBIT_MEMO_NUMBER:
                                            if (objectDetail[modelField]) {
                                                elasticObject.RefDebitMemoNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.REF_DEBIT_MEMO_DATE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.RefDebitMemoDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.RMA_NUMBER:
                                            if (objectDetail[modelField]) {
                                                elasticObject.RMANumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.TRANS_TYPE:
                                            elasticObject.TransType = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.TRACKING_NUMBER_LIST:
                                            if (objectDetail[modelField]) {
                                                elasticObject.TrackingNumberList = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.INVOICE_TYPE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.InvoiceType = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.STATUS_CONVERTED_VALUE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.StatusConvertedValue = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.PO_REVISION:
                                            if (objectDetail[modelField]) {
                                                elasticObject.PoRevision = COMMON.createElasticOject(false,
                                                    null, objectDetail[modelField], objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.CARRIER_DISPLAY_TEXT:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.CARRIER_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PACKING_SLIP_MASTER_FIELD.CARRIER_ID]);
                                            elasticObject.carrierDisplayText = COMMON.createElasticOject(false,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_INVOICE_MASTER_FIELD.CARRIERACCOUNTNUMBER:
                                            elasticObject.carrierAccountNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                elasticObjectArray.push(elasticObject);
                            }
                        }
                    });
                    elasticObjectArray.forEach((detail) => {
                        responseModal.push(detail);
                    });
                }
                if (responseModal.length > 0) {
                    module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.CUSTOMER_INVOICE, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                }
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Customer Packing Slip Material Detail
    deleteCustomerInvoiceMaterialInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.CUSTOMER_INVOICE, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.CustomerInvoice.ID);
    },

    // Delete Supplier RMA Detail
    deletePackingSlipMaterialInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PACKING_SLIP, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Packing_Slip.ID);
    },
    // Delete Packing Slip Details From Packing Slip Master Id/Ids
    deleteSupplierPackingSlipDetailFromMasterIdInElastic: (req, ids) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_PackingSlipDetailElasticSearchRemoveIds (:pIDs)', {
            replacements: {
                pIDs: ids
            }
            // eslint-disable-next-line consistent-return
        }).then((packingSlip) => {
            const packingSlipIds = _.map(packingSlip, 'id');
            if (packingSlipIds.length > 0) {
                module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PACKING_SLIP, DATA_CONSTANT.ACTION_TYPE.DELETE, null, packingSlipIds.toString(), COMMON.AllEntityIDS.Packing_Slip.ID);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },

    // GET : /api/enterprise_search/manageSupplierQuoteInElastic
    // @return List of Supplier Quote
    manageSupplierQuoteInElastic: (req, res, isRequiredCount) => {
        const {
            sequelize
        } = req.app.locals.models;

        const whereClause = {};
        whereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;

        return sequelize.query('CALL Sproc_GetSupplierQuoteDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: whereClause.id,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((supplierQuote) => {
            if (!supplierQuote) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(supplierQuote));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.SUPPLIER_QUOTE_PART_DET.ID);
            if (isRequiredCount) {
                const totalCount = _.values(supplierQuote[0]) ? _.values(supplierQuote[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(supplierQuote);
                let listOjetct = null;
                const responseModal = [];
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    const elasticObjectArray = [];
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Supplier: null,
                            QuoteNumber: null,
                            QuoteDate: null,
                            Reference: null,
                            MFR: null,
                            MFRPN: null,
                            SupplierPN: null,
                            QuoteStatus: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteSupplierQuoteInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.MfgCodeID: {
                                            const mfgMstId = objectDetail[modelField];
                                            const MfgName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.MfgName];
                                            if (MfgName) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL + (mfgMstId);
                                                elasticObject.MFR = COMMON.createElasticOject(true, hrefUrl, MfgName, MfgName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.supplierID: {
                                            const supplierID = objectDetail[modelField];
                                            const SupplierName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.SupplierName];
                                            if (SupplierName) {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + (supplierID);
                                                elasticObject.Supplier = COMMON.createElasticOject(true, hrefUrl, SupplierName, SupplierName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.QuoteNumber:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.SUPPLIER_QUOTE_MASTER.SUPPLIER_QUOTE_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.MST_ID]);
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.QuoteNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.Reference:
                                            elasticObject.Reference = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.QuoteDate:
                                            elasticObject.SUPPLIER_QUOTE_MASTER_FIELD = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.QuoteStatus:
                                            elasticObject.QuoteStatus = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.Status:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.PartID: {
                                            const PartID = objectDetail[modelField];
                                            const mfgPN = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.MFGPN];
                                            if (mfgPN) {
                                                const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, (DATA_CONSTANT.MFGCODE.MFGTYPE.MFG).toLowerCase());
                                                hrefUrl += `${partUrl}${PartID}`;
                                                elasticObject.MFRPN = COMMON.createElasticOject(true, hrefUrl, mfgPN, mfgPN);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.SupplierPartID: {
                                            const SupplierPartID = objectDetail[modelField];
                                            const supplierPN = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_QUOTE_MASTER_FIELD.SupplierPN];
                                            if (supplierPN) {
                                                const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, (DATA_CONSTANT.MFGCODE.MFGTYPE.DIST).toLowerCase());
                                                hrefUrl += `${partUrl}${SupplierPartID}`;
                                                elasticObject.SupplierPN = COMMON.createElasticOject(true, hrefUrl, supplierPN, supplierPN);
                                            }
                                            break;
                                        }
                                        default:
                                        // code block
                                    }
                                });
                                elasticObjectArray.push(elasticObject);
                            }
                        }
                    });
                    elasticObjectArray.forEach((detail) => {
                        responseModal.push(detail);
                    });
                }
                if (responseModal.length > 0) {
                    module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.SUPPLIER_QUOTE, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                }
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    deleteSupplierQuoteInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.SUPPLIER_QUOTE, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.SUPPLIER_QUOTE_PART_DET.ID);
    },
    // Get list of Work Order and store into Elastic Search engine
    // GET : /api/enterprise_search/manageWorkOrderDetailInElastic
    // @return List of Work Order
    manageWorkOrderDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var woModuleName = DATA_CONSTANT.WORKORDER.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.woID = (req.params && (typeof (req.params) === 'object') && req.params.woID) ? req.params.woID : null;

        return sequelize.query('CALL Sproc_GetWorkOrderDetailForElastic (:pwoID,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pwoID: pWhereClause.woID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(woModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Workorder.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            WONumber: null,
                            PONumber: null,
                            WOVersion: null,
                            Status: null,
                            AssyID: null,
                            AssyNumber: null,
                            NickName: null,
                            BuildQty: null,
                            CustomerCode: null,
                            CustomerName: null,
                            SalesOrderNumber: null,
                            RushJob: null,
                            HoldStatus: null,
                            HoldReason: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteWorkOrderDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.WOID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.WOID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.WO_NUMBER: {
                                            const woID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.WOID];
                                            hrefUrl = UI_URL + DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_MASTER.WORK_ORDER_URL + woID;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.WONumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.PO_NUMBER:
                                            elasticObject.PONumber = objectDetail[modelField] ?
                                                COMMON.createElasticOject(false, null, objectDetail[modelField], objectDetail[modelField])
                                                : null;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.WO_VERSION:
                                            elasticObject.WOVersion = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.WO_SUB_STATUS: {
                                            const status = _.find(DATA_CONSTANT.WO_Status, item => item.ID === objectDetail[modelField]);
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                status.Name,
                                                status.Name);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.PID_CODE: {
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.MFG_TYPE];
                                            const partId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.PART_ID];
                                            const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                            hrefUrl += `${partUrl}${partId}`;
                                            // Part PID Code as "Assy ID"
                                            elasticObject.AssyID = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);

                                            // Part MFGPN Code as "Assy Number"
                                            const mfrPN = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.MFGPN];
                                            elasticObject.AssyNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                mfrPN,
                                                mfrPN);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.NICKNAME:
                                            elasticObject.NickName = objectDetail[modelField] ?
                                                COMMON.createElasticOject(false, null, objectDetail[modelField], objectDetail[modelField])
                                                : null;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.BUILD_QTY:
                                            elasticObject.BuildQty = objectDetail[modelField] ?
                                                COMMON.createElasticOject(false, null, objectDetail[modelField], objectDetail[modelField])
                                                : null;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.MFG_TYPE: {
                                            const customerID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.CUSTOMER_ID];
                                            const isCustOrDisty = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.IS_CUSTORDISTY];
                                            const mfgCode = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.MFG_CODE];
                                            const mfgName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.MFG_NAME];

                                            if (objectDetail[modelField] && customerID && mfgCode && mfgName) {
                                                if (objectDetail[modelField] === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + customerID;
                                                } else if (objectDetail[modelField] === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                    hrefUrl += ((isCustOrDisty) ?
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) +
                                                        customerID;
                                                }
                                                elasticObject.CustomerCode = COMMON.createElasticOject(true, hrefUrl, mfgCode, mfgCode);

                                                elasticObject.CustomerName = COMMON.createElasticOject(true, hrefUrl, mfgName, mfgName);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.SALES_ORDER_NUMBER:
                                            if (objectDetail[modelField]) {
                                                const salesOrderId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.SALES_ORDER_MST_IDS];
                                                hrefUrl = UI_URL + DATA_CONSTANT.ELASTIC_URL.SALES_ORDER_MASTER.SALES_ORDER_URL + salesOrderId;

                                                elasticObject.SalesOrderNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.RUSH_JOB: {
                                            const rushJobValue = objectDetail[modelField] ? 'Yes' : 'No';
                                            elasticObject.RushJob = COMMON.createElasticOject(false, null, rushJobValue, rushJobValue);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.HOLD_STATUS: {
                                            const holdeStatusValue = objectDetail[modelField] ? 'Stop' : null;
                                            elasticObject.HoldStatus = COMMON.createElasticOject(false, null, holdeStatusValue, holdeStatusValue);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.HOLD_REASON:
                                            elasticObject.HoldReason = (objectDetail[modelField] ?
                                                COMMON.createElasticOject(false, null, objectDetail[modelField], objectDetail[modelField])
                                                : null);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.WORK_ORDER, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Work Order Detail Material Detail
    deleteWorkOrderDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.WORK_ORDER, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Workorder.ID);
    },
    // Get list of UMID and store into Elastic Search engine
    // GET : /api/enterprise_search/manageUMIDDetailInElastic
    // @return List of UMID
    manageUMIDDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.COMPONENT_SID_STOCK.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.umID = (req.params && (typeof (req.params) === 'object') && req.params.umID) ? req.params.umID : null;

        return sequelize.query('CALL Sproc_GetUMIDDetailForElastic (:pumID,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pumID: pWhereClause.umID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Component_sid_stock.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            UMID: null,
                            MFR: null,
                            MPN: null,
                            PID: null,
                            CurrentQty: null,
                            CurrentUnits: null,
                            UOM: null,
                            InitialQty: null,
                            InitialUnits: null,
                            DateCode: null,
                            LotCode: null,
                            Cost: null,
                            MSL: null,
                            NumberOfPicture: null,
                            Description: null,
                            Packaging: null,
                            PackingSlip: null,
                            CustConsignStock: null,
                            ReservedStock: null,
                            ReceivedType: null,
                            CurrentLocation: null,
                            CurrentWarehouse: null,
                            CurrentDepartment: null,
                            DateOfExpiration: null,
                            FromUMID: null,
                            ParentUMID: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteUMIDDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.UID: {
                                            const uid = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.ID];
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.UMID_MASTER.UMID_URL}${uid}`;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.UMID = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.MFG_CODE:
                                            elasticObject.MFR = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.MFGPN: {
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.MFG_TYPE];
                                            const partId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PART_ID];
                                            const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                            hrefUrl += `${partUrl}${partId}`;

                                            elasticObject.MFRPN = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PID_CODE: {
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.MFG_TYPE];
                                            const partId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PART_ID];
                                            const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                            hrefUrl += `${partUrl}${partId}`;

                                            elasticObject.PID = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PKG_QTY:
                                            elasticObject.CurrentQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PKG_UNIT:
                                            elasticObject.CurrentUnits = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.ORG_QTY:
                                            elasticObject.InitialQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.ORG_UNIT:
                                            elasticObject.InitialUnits = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.UOM_NAME:
                                            elasticObject.UOM = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.DATE_CODE:
                                            elasticObject.DateCode = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.LOT_CODE:
                                            elasticObject.LotCode = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.COST_CATEGORY:
                                            elasticObject.Cost = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.MSL_LEVEL:
                                            elasticObject.MSL = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PICTURE_COUNT:
                                            elasticObject.NumberOfPicture = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.MFGPN_DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PACKAGING_NAME:
                                            elasticObject.Packaging = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PACKING_SLIP:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PACKING_SLIP_MASTER.PACKING_SLIP_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PACKING_SLIP_ID]);
                                            elasticObject.PackingSlip = COMMON.createElasticOject(false,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.CUSTOMER_STOCK:
                                            elasticObject.CustConsignStock = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.RESERVE_STOCK:
                                            elasticObject.ReservedStock = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.RECEIVE_MATERIAL_TYPE:
                                            elasticObject.ReceivedType = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.LOCATION:
                                            elasticObject.CurrentLocation = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.WAREHOUSE:
                                            elasticObject.CurrentWarehouse = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.DEPARTMENT:
                                            elasticObject.CurrentDepartment = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.EXPIRY_DATE:
                                            elasticObject.DateOfExpiration = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.FROM_UMID: {
                                            const uid = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.FROM_UMID_ID];
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.UMID_MASTER.UMID_URL}${uid}`;
                                            elasticObject.FromUMID = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PARENT_UMID: {
                                            const uid = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UMID_MASTER_FIELD.PARENT_UMID_ID];
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.UMID_MASTER.UMID_URL}${uid}`;
                                            elasticObject.ParentUMID = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.UMID, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete UMID Detail Material Detail
    deleteUMIDDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.UMID, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Component_sid_stock.ID);
    },
    // Get list of MFGCode master and store into Elastic Search engine
    // GET : /api/enterprise_search/manageMFGCodeDetailInElastic
    // @return List of MFG Code Detail
    manageMFGCodeDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var woModuleName = DATA_CONSTANT.SUPPLIER.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.mfgId = (req.params && (typeof (req.params) === 'object') && req.params.mfgId) ? req.params.mfgId : null;
        pWhereClause.isCustOrDisty = (req.params && (typeof (req.params) === 'object') && req.params.isCustOrDisty != null) ?
            req.params.isCustOrDisty :
            (req.params && (typeof (req.body) === 'object') && req.body.isCustOrDisty != null) ? req.body.isCustOrDisty : null;
        pWhereClause.mfgType = (req.params && (typeof (req.params) === 'object') && req.params.mfgType) ? req.params.mfgType :
            (req.params && (typeof (req.body) === 'object') && req.body.mfgType != null) ? req.body.mfgType : null;

        return sequelize.query('CALL Sproc_GetMfgCodeDetailForElastic (:pId,:pIsCustOrDisty,:pmfgType,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.mfgId,
                pIsCustOrDisty: pWhereClause.isCustOrDisty,
                pmfgType: pWhereClause.mfgType,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(woModuleName));
            }
            let entityDet = {};
            const supplierEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Supplier.ID);
            const customerEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Customer.ID);
            const manufactureEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.MANUFACTURERS.ID);
            entityDet = pWhereClause.mfgType === DATA_CONSTANT.MFG_TYPE_DETAIL[0].Type ?
                (pWhereClause.isCustOrDisty ? customerEntity : manufactureEntity) : supplierEntity;

            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            MFGType: null,
                            Code: null,
                            Company: null,
                            BusinessName: null,
                            LegalName: null,
                            Terms: null,
                            Phone: null,
                            Fax: null,
                            Status: null,
                            IsCustomer: null,
                            salesCommissionTo: null,
                            FreeOnBoardMst: null,
                            ContPersonList: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteMFGCodeDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.Title = `${entityDet.Title}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.MFG_CODE: {
                                            const isCustOrDisty = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.IS_CUSTORDISTY];
                                            const customerID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.ID];

                                            if (objectDetail[modelField]) {
                                                if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + customerID;
                                                } else if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.MFG_TYPE] === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                    hrefUrl += ((isCustOrDisty) ?
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) +
                                                        customerID;
                                                }
                                                elasticObject.Code = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.MFG_NAME:
                                            {
                                                const mfgNameObj = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                                if (pWhereClause.mfgType === DATA_CONSTANT.MFG_TYPE_DETAIL[0].Type) {
                                                    elasticObject.BusinessName = mfgNameObj;
                                                } else {
                                                    elasticObject.Company = mfgNameObj;
                                                }
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.LEGAL_NAME:
                                            elasticObject.LegalName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.SALES_COMMISSION_TO:
                                            elasticObject.salesCommissionTo = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.TERMS:
                                            elasticObject.Terms = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.CONTACT:
                                            elasticObject.Phone = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.FAX_NUMBER:
                                            elasticObject.Fax = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.ISACTIVE: {
                                            const statusValue = objectDetail[modelField] ? 'Active' : 'Inactive';
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                statusValue,
                                                statusValue);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.MFG_TYPE: {
                                            const isCustOrDisty = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.IS_CUSTORDISTY];
                                            let mfgDetail = _.find(DATA_CONSTANT.MFG_TYPE_DETAIL, item => item.Type === objectDetail[modelField]);
                                            mfgDetail = objectDetail[modelField] === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG && isCustOrDisty ? DATA_CONSTANT.CUSTOMER : mfgDetail;

                                            const customerID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.ID];
                                            if (objectDetail[modelField]) {
                                                if (objectDetail[modelField] === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + customerID;
                                                } else if (objectDetail[modelField] === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                    hrefUrl += ((isCustOrDisty) ?
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) +
                                                        customerID;
                                                }
                                                elasticObject.MFGType = COMMON.createElasticOject(true, hrefUrl, mfgDetail.Name, mfgDetail.Name);
                                            }
                                            elasticObject.IsCustOrDisty = isCustOrDisty;
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.FOB:
                                            elasticObject.FreeOnBoardMst = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.CONT_PERSON_LIST:
                                            elasticObject.ContPersonList = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.MFG_CODE_MASTER, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete MFG Code Detail Material Detail
    deleteMFGCodeDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.MFG_CODE_MASTER, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.MANUFACTURERS.ID);
    },
    // Get list of Personal detail and store into Elastic Search engine
    // GET : /api/enterprise_search/managePersonalDetailInElastic
    // @return List of Personal
    managePersonalDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var empModuleName = DATA_CONSTANT.EMPLOYEE.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetPersonalDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(empModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Employee.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Initial: null,
                            UserID: null,
                            Firstname: null,
                            Lastname: null,
                            Middlename: null,
                            Email: null,
                            Address: null,
                            Phone: null,
                            ContactPerson: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deletePersonalDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.INITIAL_NAME:
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Initial = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.USERNAME: {
                                            const employeeId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PERSONAL.PERSONAL_URL + employeeId;
                                            elasticObject.TitleHrefUrl = hrefUrl;
                                            elasticObject.UserID = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.FIRST_NAME:
                                            elasticObject.Firstname = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.LAST_NAME:
                                            elasticObject.Lastname = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.MIDDLE_NAME:
                                            elasticObject.Middlename = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.EMAIL:
                                            elasticObject.Email = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.STREET1:
                                            elasticObject.Address = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.CONTACT:
                                            elasticObject.Phone = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PERSONAL_MASTER_FIELD.CONTACT_PERSON:
                                            elasticObject.ContactPerson = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.PERSONAL, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Personal Detail Material Detail
    deletePersonalDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PERSONAL, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Employee.ID);
    },
    // Get list of Operation detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageOperationDetailInElastic
    // @return List of Operation
    manageOperationDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;

        var operationModuleName = DATA_CONSTANT.OPERATION.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.opID = req.params && typeof (req.params === 'object') && req.params.opID ? req.params.opID : null;

        return sequelize.query('CALL Sproc_GetOperationDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.opID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }// eslint-disable-next-line consistent-return
        }).then((operationDetail) => {
            if (!operationDetail) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(operationModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Operation.ID);
            if (isRequiredCount) {
                const totalCount = _.values(operationDetail[0]) ? _.values(operationDetail[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(operationDetail);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            OperationNo: null,
                            Name: null,
                            Status: null,
                            ShortDescription: null,
                            Description: null,
                            JobSpecificRequirement: null,
                            ManagementCommunication: null,
                            DeferredInstruction: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteOperationDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.OPERATION_NUMBER:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.OPERATION_MASTER.OPERATION_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.ID]);
                                            elasticObject.TitleHrefUrl = hrefUrl;
                                            elasticObject.OperationNo = COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.WO_OPERATION_NUMBER);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.OPERATION_NAME:
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.OPERATION_MASTER.OPERATION_URL + (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.ID]);
                                            elasticObject.Name = COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.OPERATION_STATUS: {
                                            const status = _.find(DATA_CONSTANT.OPEARATION_STATUS, item => item.ID === objectDetail[modelField]);
                                            elasticObject.Status = (status && (typeof (status) === 'object')) ?
                                                COMMON.createElasticOject(false, null, status.Name, status.Name)
                                                : null;
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.SHORT_DESCRIPTION:
                                            elasticObject.ShortDescription = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.OP_DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.OP_WORKING_CONDITION:
                                            elasticObject.JobSpecificRequirement = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.OP_MANAGEMENT_INSTRUCTION:
                                            elasticObject.ManagementCommunication = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.OPERATION_MASTER_FIELD.OP_DEFERRED_INSTRUCTION:
                                            elasticObject.DeferredInstruction = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.OPERATION, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Personal Detail Material Detail
    deleteOperationDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PERSONAL, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Operation.ID);
    },
    // Get list of Work Order Operation detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageWorkOrderOperationDetailInElastic
    // @return List of Work Order Operation Detail
    manageWorkOrderOperationDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var woOperationModuleName = DATA_CONSTANT.WORKORDER_OPERATION.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        var responseDoDontModal = [];
        var isDoDontCall = (req.params && (typeof (req.params) === 'object')) && typeof (req.params.IsDoDontCall) === 'boolean' ? req.params.IsDoDontCall : null;
        pWhereClause.woOPID = (req.params && (typeof (req.params) === 'object') && req.params.woOPID) ? req.params.woOPID : null;
        pWhereClause.woID = (req.params && (typeof (req.params) === 'object') && req.params.woID) ? req.params.woID : null;

        return sequelize.query('CALL Sproc_GetWorkOrderOperationDetailForElastic (:pWOOPID,:pWOID,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pWOOPID: pWhereClause.woOPID,
                pWOID: pWhereClause.woID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(woOperationModuleName));
            }
            let entityDet = {};
            const woOperationDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Workorder_operation.ID);
            const woOpDoDontDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.WORKORDER_OPERATION_DO_DONT.ID);
            entityDet = isDoDontCall ? woOpDoDontDet : woOperationDet;

            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            WorkOrderNumber: null,
                            WOOperationNumber: null,
                            WOOperationName: null,
                            OperationNumber: null,
                            OperationName: null,
                            OperationVersion: null,
                            OperationType: null,
                            ParentOperation: null,
                            AccessTabLimit: null,
                            TargetedTotalProcessTime: null,
                            SetupTime: null,
                            PerPcsTargetTime: null,
                            TransactionLevelSetting: null,
                            Description: null,
                            JobSpecificRequirement: null,
                            ManagementCommunication: null,
                            DeferredInstruction: null,
                            RefDesigList: null,
                            Type: woOperationDet.Type,
                            TypeID: woOperationDet.TypeID,
                            ShortDescription: null,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        var elasticDoDontObject = {
                            Id: null,
                            WorkOrderNumber: null,
                            WOOperationNumber: null,
                            WOOperationName: null,
                            OperationNumber: null,
                            OperationVersion: null,
                            OperationDoes: null,
                            OperationDonts: null,
                            Type: woOpDoDontDet.Type,
                            TypeID: woOpDoDontDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteWorkOrderOperationDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.ID]);
                            } else {
                                let transactionLevelSetting = null;
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                module.exports.configureDefualtValue(elasticDoDontObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticDoDontObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${woOperationDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticDoDontObject.Id = `${woOpDoDontDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.WO_NUMBER: {
                                            const woID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.WO_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_MASTER.WORK_ORDER_URL + woID;

                                            elasticObject.WorkOrderNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);

                                            elasticDoDontObject.WorkOrderNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.WO_OP_NUMBER: {
                                            const woOPID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_OPERATION.WORK_ORDER_OPERATION_URL + woOPID;
                                            elasticObject.WOOperationNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.WO_OPERATION_NUMBER);
                                            elasticObject.Title = `${woOperationDet.Title} ${elasticObject.WOOperationNumber.LinkText}`;

                                            elasticDoDontObject.WOOperationNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.WO_OPERATION_NUMBER);

                                            elasticDoDontObject.Title = `${woOpDoDontDet.Title} ${elasticDoDontObject.WOOperationNumber.LinkText}`;
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.WO_OP_NAME:
                                            elasticObject.WOOperationName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);

                                            elasticDoDontObject.WOOperationName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.OP_NUMBER: {
                                            const opId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.OP_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.OPERATION_MASTER.OPERATION_URL + opId;

                                            elasticObject.OperationNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.WO_OPERATION_NUMBER);

                                            elasticDoDontObject.OperationNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.WO_OPERATION_NUMBER);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.OP_VERSION:
                                            elasticObject.OperationVersion = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);

                                            elasticDoDontObject.OperationVersion = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.OPERATION_TYPE:
                                            elasticObject.OperationType = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.PARENT_OPERATION:
                                            if (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.PARENT_OP_ID]) {
                                                const parentOPId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.PARENT_OP_ID];
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.OPERATION_MASTER.OPERATION_URL + parentOPId;

                                                elasticObject.ParentOperation = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.TAB_LIMIT_AT_TRAVELER:
                                            elasticObject.AccessTabLimit = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.PROCESS_TIME:
                                            elasticObject.TargetedTotalProcessTime = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.SETUP_TIME:
                                            elasticObject.SetupTime = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.QTY_CONTROL: {
                                            const qtyControl = _.find(DATA_CONSTANT.OPERATION_RADIO_GROUP.QTY_CONTROL, item => item.VALUE === Boolean(objectDetail[modelField]));
                                            if (typeof (qtyControl) === 'object') {
                                                transactionLevelSetting = transactionLevelSetting ? `${transactionLevelSetting}, ${qtyControl.KEY}` : qtyControl.KEY;
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.IS_PRE_PROGRAMMING_COMPONENT: {
                                            const preProgramming = _.find(DATA_CONSTANT.OPERATION_RADIO_GROUP.IS_PREPROGRAMMING_COMPONENT, item => item.VALUE === Boolean(objectDetail[modelField]));
                                            if (typeof (preProgramming) === 'object') {
                                                transactionLevelSetting = transactionLevelSetting ? `${transactionLevelSetting}, ${preProgramming.KEY}` : preProgramming.KEY;
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.IS_REWORK: {
                                            const isRework = _.find(DATA_CONSTANT.OPERATION_RADIO_GROUP.IS_REWORK, item => item.VALUE === Boolean(objectDetail[modelField]));
                                            if (typeof (isRework) === 'object') {
                                                transactionLevelSetting = transactionLevelSetting ? `${transactionLevelSetting}, ${isRework.KEY}` : isRework.KEY;
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.IS_TEAM_OPERATION: {
                                            const isTeamOperation = _.find(DATA_CONSTANT.OPERATION_RADIO_GROUP.IS_TEAM_OPERATION, item => item.VALUE === Boolean(objectDetail[modelField]));
                                            if (typeof (isTeamOperation) === 'object') {
                                                transactionLevelSetting = transactionLevelSetting ? `${transactionLevelSetting}, ${isTeamOperation.KEY}` : isTeamOperation.KEY;
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.IS_ISSUE_QTY: {
                                            const issueQty = _.find(DATA_CONSTANT.OPERATION_RADIO_GROUP.IS_ISSUE_QTY, item => item.VALUE === Boolean(objectDetail[modelField]));
                                            if (typeof (issueQty) === 'object') {
                                                transactionLevelSetting = transactionLevelSetting ? `${transactionLevelSetting}, ${issueQty.KEY}` : issueQty.KEY;
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.CLEANING_TYPE: {
                                            const cleaningType = _.find(DATA_CONSTANT.OPERATION_RADIO_GROUP.CLEANING_TYPE, item => item.VALUE === objectDetail[modelField]);
                                            if (typeof (cleaningType) === 'object') {
                                                transactionLevelSetting = transactionLevelSetting ? `${transactionLevelSetting}, ${cleaningType.KEY}` : cleaningType.KEY;
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.PER_PIECE_TIME:
                                            elasticObject.PerPcsTargetTime = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.OP_DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.OP_WORKING_CONDITION:
                                            elasticObject.JobSpecificRequirement = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.OP_MANAGEMENT_INSTRUCTION:
                                            elasticObject.ManagementCommunication = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.OP_DEFERRED_INSTRUCTION:
                                            elasticObject.DeferredInstruction = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.OP_DOES:
                                            elasticDoDontObject.OperationDoes = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.OP_DONTS:
                                            elasticDoDontObject.OperationDonts = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.REF_DESIG_LIST:
                                            elasticObject.RefDesigList = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_MASTER_FIELD.SHORT_DESCRIPTION:
                                            elasticObject.ShortDescription = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                elasticObject.TransactionLevelSetting = transactionLevelSetting ? COMMON.createElasticOject(false,
                                    null,
                                    transactionLevelSetting,
                                    transactionLevelSetting) : null;

                                responseModal.push(elasticObject);
                                responseDoDontModal.push(elasticDoDontObject);
                            }
                        }
                    });
                }
                // 'isDoDontCall' use for 'Null' for pass from internal call of Update Workorder Operation detail/Do's/Don'ts & 'False' for 'Pass Operation  Detail Record'
                if (isDoDontCall === null || !isDoDontCall) {
                    module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);

                    if (isDoDontCall === null) {
                        module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_DOS_DONTS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseDoDontModal);
                    }
                }

                if (isDoDontCall) {
                    module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_DOS_DONTS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseDoDontModal);
                }
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Work Order Detail & (Do's and Don'ts) Material Detail
    deleteWorkOrderOperationDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Workorder_operation.ID);
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_DOS_DONTS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.WORKORDER_OPERATION_DO_DONT.ID);
    },
    // Get list of Equipment & WorkStation detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageEquipmentWorkStationDetailInElastic
    // @return List of Equipment & WorkStation Detail
    manageEquipmentWorkStationDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var equipmentModuleName = DATA_CONSTANT.EQUIPMENT_TOOLS.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.eqpID = (req.params && (typeof (req.params) === 'object') && req.params.eqpID) ? req.params.eqpID : null;

        return sequelize.query('CALL Sproc_GetEquipmentWorkStationDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.eqpID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(equipmentModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Equipment.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Category: null,
                            Name: null,
                            Make: null,
                            Model: null,
                            Year: null,
                            WorkStationAsset: null,
                            Department: null,
                            Location: null,
                            EquipmentType: null,
                            Description: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteEquipmentWorkStationDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.CATEGORY: {
                                            const type = _.find(DATA_CONSTANT.EQUIPMENT_TYPE, item => item.VALUE === objectDetail[modelField]);

                                            if (typeof (type) === 'object') {
                                                elasticObject.Category = COMMON.createElasticOject(false,
                                                    null,
                                                    type.LABEL,
                                                    type.LABEL);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.NAME: {
                                            const eqpId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.EQUIPMENT_WORKSTATION_MASTER.EQUIPMENT_WORKSTATION_URL + eqpId;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.MAKE:
                                            elasticObject.Make = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.MODEL:
                                            elasticObject.Model = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.YEAR:
                                            elasticObject.Year = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.WORKSTATION_ASSET:
                                            elasticObject.WorkStationAsset = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.DEPARTMENT_NAME:
                                            elasticObject.Department = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.LOCATION_NAME:
                                            elasticObject.Location = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.TYPE_NAME:
                                            elasticObject.EquipmentType = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.EQUIPMENT_WORKSTATION_MASTER_FIELD.EQP_DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Equipment & WorkStation Detail
    deleteEquipmentWorkStationDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Equipment.ID);
    },
    // Get list of Warehouse detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageWarehouseDetailInElastic
    // @return List of Warehouse Detail
    manageWarehouseDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var warehouseModuleName = DATA_CONSTANT.WAREHOUSEMST.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.ID = (req.params && (typeof (req.params) === 'object') && req.params.ID) ? req.params.ID : null;

        return sequelize.query('CALL Sproc_GetWarehouseDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: Array.isArray(pWhereClause.ID) ? pWhereClause.ID.join(',') : pWhereClause.ID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(warehouseModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Warehouse.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            WarehouseType: null,
                            Name: null,
                            Nickname: null,
                            ParentWarehouse: null,
                            Status: null,
                            PermanentWarehouse: null,
                            AllowBinMoving: null,
                            UserAccessMode: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteWarehouseDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WAREHOUSE_MASTER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.WAREHOUSE_MASTER_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WAREHOUSE_MASTER_FIELD.WAREHOUSE_TYPE:
                                            elasticObject.WarehouseType = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WAREHOUSE_MASTER_FIELD.NAME: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WAREHOUSE_MASTER.WAREHOUSE_URL;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WAREHOUSE_MASTER_FIELD.NICKNAME:
                                            elasticObject.Nickname = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WAREHOUSE_MASTER_FIELD.PARENT_WAREHOUSE:
                                            elasticObject.ParentWarehouse = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WAREHOUSE_MASTER_FIELD.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WAREHOUSE_MASTER_FIELD.IS_PERMANENT_WH:
                                            elasticObject.PermanentWarehouse = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WAREHOUSE_MASTER_FIELD.ALL_MOVABLE_BIN:
                                            elasticObject.AllowBinMoving = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WAREHOUSE_MASTER_FIELD.USER_ACCESS_MODE:
                                            elasticObject.UserAccessMode = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.WAREHOUSE, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Warehouse Detail
    deleteWarehouseDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.WAREHOUSE, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Warehouse.ID);
    },
    // Get list of Traveler detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageWarehouseDetailInElastic
    // @return List of Traveler Detail
    manageTravelerDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var woOperationModuleName = DATA_CONSTANT.WORKORDER_OPERATION.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.woTransID = (req.params && (typeof (req.params) === 'object') && req.params.woTransID) ? req.params.woTransID : null;
        pWhereClause.woTransinoutID = (req.params && (typeof (req.params) === 'object') && req.params.woTransinoutID) ? req.params.woTransinoutID : null;

        return sequelize.query('CALL Sproc_GetTravelerDetailForElastic (:pWOTransinoutID,:pWOTransID,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pWOTransinoutID: pWhereClause.woTransinoutID,
                pWOTransID: pWhereClause.woTransID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(woOperationModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.TRAVELER.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            WorkOrderNumber: null,
                            WOOperationNumber: null,
                            WOOperationName: null,
                            StartTime: null,
                            StopTime: null,
                            UserID: null,
                            IsTeamOperation: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteTravelerDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.STAR_TTIME:
                                            elasticObject.StartTime = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.TIMESTAMP_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.END_TIME:
                                            elasticObject.StopTime = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.TIMESTAMP_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.WO_NUMBER: {
                                            const woID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.WO_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_MASTER.WORK_ORDER_URL + woID;

                                            elasticObject.WorkOrderNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.OP_NUMBER: {
                                            const opId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.WO_OP_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_OPERATION.WORK_ORDER_OPERATION_URL + opId;

                                            elasticObject.WOOperationNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.WO_OPERATION_NUMBER);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.OP_NAME:
                                            elasticObject.WOOperationName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.USER_ID:
                                            elasticObject.UserID = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRAVELER_FIELD.IS_TEAM_OPERATION:
                                            elasticObject.IsTeamOperation = objectDetail[modelField];
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField] ? COMMON.AllEntityIDS.TRAVELER.Team_Activity : COMMON.AllEntityIDS.TRAVELER.Individual_Activity}`;
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.TRAVELER, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Traveler Detail
    deleteTravelerDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.TRAVELER, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.TRAVELER.ID);
    },
    // Get list of Unit of Measurement detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageUOMDetailInElastic
    // @return List of UOM
    manageUOMDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        const uomModuleName = DATA_CONSTANT.UOM.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;
        pWhereClause.pMeasurementTypeID = (req.params && (typeof (req.params) === 'object') && req.params.pMeasurementTypeID) ? req.params.pMeasurementTypeID : null;

        return sequelize.query('CALL Sproc_GetUOMDetailForElastic (:pId,:pMeasurementTypeID,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pMeasurementTypeID: pWhereClause.pMeasurementTypeID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(uomModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.UOMs.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            MeasurementType: null,
                            UOMCode: null,
                            Name: null,
                            OneUOM: null,
                            Operator: null,
                            ConversionFactor: null,
                            Alias: null,
                            DefaultUOM: null,
                            Formula: null,
                            Descrition: null,
                            SystemDefault: null,
                            MeasurementTypeOrder: null,
                            DisplayOrder: null,
                            BaseEquivalent: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteUOMDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.MEASUREMENT_TYPE:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.UOM_MASTER.UOM_URL;

                                            elasticObject.MeasurementType = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.ABBREVIATION:
                                            elasticObject.UOMCode = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.UNIT_NAME: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.UOM_MASTER.UOM_URL;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.ONEUOM:
                                            elasticObject.OneUOM = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.OPERATOR:
                                            elasticObject.Operator = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.UNIT_CONVERT_VALUE:
                                            elasticObject.ConversionFactor = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.ALIAS_LIST:
                                            elasticObject.Alias = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.DEFAULT_UOM_CONVERTED_VALUE:
                                            elasticObject.DefaultUOM = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.IS_FORMULA_CONVERTED_VALUE:
                                            elasticObject.Formula = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.MEASUREMENT_TYPE_ORDER:
                                            elasticObject.MeasurementTypeOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.BASE_UNIT_VALUE: {
                                            const baseUnitValue = objectDetail[modelField];
                                            const unitConvertValue = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.UOM_FIELD.UNIT_CONVERT_VALUE];
                                            if (unitConvertValue != null && baseUnitValue != null) {
                                                const baseEquivalent = COMMON.stringFormat('= {0} {1}', unitConvertValue, baseUnitValue);
                                                elasticObject.BaseEquivalent = COMMON.createElasticOject(false,
                                                    null,
                                                    baseEquivalent,
                                                    baseEquivalent);
                                            }
                                            break;
                                        }
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.UOM, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Unit of Measurement Detail
    deleteUOMDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.UOM, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.UOMs.ID);
    },
    // Get list of Merger & Acquistion  detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageMergerAcquisitionInElastic
    // @return List of Merger & Acquistions
    manageMergerAcquisitionInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        const whoBoughtWhoModuleName = DATA_CONSTANT.WHO_BOUGHT_WHO.DISPLAYNAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetWhoBoughtWhoDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(whoBoughtWhoModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.WhoBoughtWho.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            AcquiredBy: null,
                            AcquiredMFR: null,
                            AcquisitionDate: null,
                            Description: null,
                            CreatedBy: null,
                            CreatedDate: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteMergerAcquisitionDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.MFG_BY: {
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.MFG_BY_MFG_TYPE];
                                            const isCustomer = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.MFG_BY_IS_CUST];
                                            const mfgId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.BUY_BY];
                                            if ((mfgType)) {
                                                if (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + mfgId;
                                                } else if (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                    hrefUrl += (isCustomer ?
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) + mfgId;
                                                }
                                            }
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.AcquiredBy = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.MFG_TO: {
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.MFG_TO_MFG_TYPE];
                                            const isCustomer = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.MFG_TO_IS_CUST];
                                            const mfgId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.BUY_TO];
                                            if ((mfgType)) {
                                                if (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + mfgId;
                                                } else if (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                    hrefUrl += (isCustomer ?
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) + mfgId;
                                                }
                                            }

                                            elasticObject.AcquiredMFR = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.BUY_DATE:
                                            elasticObject.AcquisitionDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.CREATED_BY_EMP:
                                            elasticObject.CreatedBy = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WHO_BROUGHT_WHO_FIELD.CREATED_AT:
                                            elasticObject.CreatedDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.MERGER_ACQUISITIONS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Merger & Acquistion Detail
    deleteMergerAcquisitionDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.MERGER_ACQUISITIONS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.WhoBoughtWho.ID);
    },
    // Get list of Connector Types detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageConnectorTypesInElastic
    // @return List of Connector Types
    manageConnectorTypesInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var connecterTypeModuleName = DATA_CONSTANT.CONNECTER_TYPE.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetConnectorTypesForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(connecterTypeModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.ConnecterType.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Description: null,
                            Alias: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteConnectorTypesDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_CONNECTOR_TYPES_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_CONNECTOR_TYPES_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_CONNECTOR_TYPES_FIELD.NAME: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.CONNECTOR_TYPES.CONNECTOR_TYPES_URL;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;

                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_CONNECTOR_TYPES_FIELD.DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_CONNECTOR_TYPES_FIELD.ALIAS_LIST:
                                            elasticObject.Alias = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_CONNECTOR_TYPES_FIELD.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.CONNECTOR_TYPES, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Connector Types Detail
    deleteConnectorTypesDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.CONNECTOR_TYPES, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.ConnecterType.ID);
    },
    // Get list of Part Status detail and store into Elastic Search engine
    // GET : /api/enterprise_search/managePartStatusInElastic
    // @return List of Part Status
    managePartStatusInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var componentStatusModuleName = DATA_CONSTANT.COMPONENT_PARTSTATUS.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetPartStatusForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(componentStatusModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.PART_STATUS.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Alias: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deletePartStatusDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_PARTSTATUSMST_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_PARTSTATUSMST_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_PARTSTATUSMST_FIELD.NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_STATUS.PART_STATUS_URL;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_CONNECTOR_TYPES_FIELD.ALIAS_LIST:
                                            elasticObject.Alias = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.PART_STATUS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Part Status  Detail
    deletePartStatusDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PART_STATUS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.PART_STATUS.ID);
    },
    // Get list of Mounting Group detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageMountingGroupInElastic
    // @return List of Mounting Group
    manageMountingGroupInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var componentLogicalGroupModuleName = DATA_CONSTANT.COMPONENT_LOGICAL_GROUP.DISPLAYNAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetMountingGroupForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(componentLogicalGroupModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.component_logical_group.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Description: null,
                            Alias: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteMountingGroupDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_LOGICAL_GROUP_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_LOGICAL_GROUP_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_LOGICAL_GROUP_FIELD.NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.MOUNTING_GROUP.MOUNTING_GROUP_URL;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_LOGICAL_GROUP_FIELD.ALIAS_LIST:
                                            elasticObject.Alias = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_LOGICAL_GROUP_FIELD.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.MOUNTING_GROUP, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Mounting Group Detail
    deleteMountingGroupDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.MOUNTING_GROUP, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.component_logical_group.ID);
    },
    // Get list of Functional Types detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageFunctionalTypeInElastic
    // @return List of Functional Type
    manageFunctionalTypeInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var partTypeModuleName = DATA_CONSTANT.PART_TYPE.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetFunctionalTypeForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(partTypeModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.PartType.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            DisplayOrder: null,
                            Alias: null,
                            TemperatureSensitive: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteFunctionalTypeDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_PARTTYPE_MST_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_PARTTYPE_MST_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_PARTTYPE_MST_FIELD.PART_TYPE_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.FUNCTIONAL_TYPE.FUNCTIONAL_TYPE_URL;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_PARTTYPE_MST_FIELD.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_PARTTYPE_MST_FIELD.ALIAS_LIST:
                                            elasticObject.Alias = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_PARTTYPE_MST_FIELD.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_PARTTYPE_MST_FIELD.TEMPERATURE_SENSITIVE_VALUE:
                                            elasticObject.TemperatureSensitive = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.FUNCTIONAL_TYPE, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Functional Type Detail
    deleteFunctionalTypeDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.FUNCTIONAL_TYPE, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.PartType.ID);
    },
    // Get list of Mounting Type detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageMountingTypesElastic
    // @return List of Mounting Types
    manageMountingTypesInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var MountingTypeModuleName = DATA_CONSTANT.MOUNTING_TYPE.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetMountionTypesForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(MountingTypeModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.MountingType.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Description: null,
                            Alias: null,
                            CountTypeEach: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteMountingTypesDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RFQ_MOUNTING_TYPE_MST_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MOUNTING_TYPE_MST_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MOUNTING_TYPE_MST_FIELD.NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.MOUNTING_TYPE.MOUNTING_TYPE_URL;

                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MOUNTING_TYPE_MST_FIELD.DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MOUNTING_TYPE_MST_FIELD.ALIAS_LIST:
                                            elasticObject.Alias = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MOUNTING_TYPE_MST_FIELD.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RFQ_MOUNTING_TYPE_MST_FIELD.COUNT_TYPE_EACH:
                                            elasticObject.CountTypeEach = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.MOUNTING_TYPES, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Mounting Types Detail
    deleteMountingTypesDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.MOUNTING_TYPES, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.MountingType.ID);
    },
    // Get list of Cost Categories Type detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageMountingTypesElastic
    // @return List of Cost Categories
    manageCostCategoriesInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        const costCategoryModuleName = DATA_CONSTANT.COST_CATEGORY.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetCostCategoryForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(costCategoryModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CostCategory.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            From: null,
                            To: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteCostCategoriesDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.COST_CATEGORY_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.COST_CATEGORY_FIELD.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.COST_CATEGORY_FIELD.CATEGORY_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.COST_CATEGORY.COST_CATEGORY_URL;

                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.COST_CATEGORY_FIELD.FROM:
                                            elasticObject.From = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.COST_CATEGORY_AMOUNT);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.COST_CATEGORY_FIELD.TO:
                                            elasticObject.To = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.COST_CATEGORY_AMOUNT);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.COST_CATEGORIES, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Cost Categories Detail
    deleteCostCategoriesDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.COST_CATEGORIES, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.CostCategory.ID);
    },
    // Get list of Packaging Types detail and store into Elastic Search engine
    // GET : /api/enterprise_search/managePackagingTypesInElastic
    // @return List of Packaging Types
    managePackagingTypesInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var packagingModuleName = DATA_CONSTANT.PACKAGING_TYPE.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetPackagningTypesForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(packagingModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Packaging_Master.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Alias: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deletePackagingTypesDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_PACKAGING_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_PACKAGING_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_PACKAGING_MST.NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PACKANGING_TYPES.PACKANGING_TYPES_URL;

                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_PACKAGING_MST.ALIAS_LIST:
                                            elasticObject.Alias = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.COMPONENT_PACKAGING_MST.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.PACKAGING_TYPES, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Packaging Types Detail
    deletePackagingTypesDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PACKAGING_TYPES, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Packaging_Master.ID);
    },
    // Get list of Kit Allocation detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageKitAllocationInElastic
    // @return List of Kit Allocation
    manageKitAllocationInElastic: (req, res, isRequiredCount) => {
        // const { sequelize } = req.app.locals.models;
        // var packagingModuleName = DATA_CONSTANT.PACKAGING_TYPE.NAME;
        // var pWhereClause = { isDeleted: false };
        // var responseModal = [];
        // pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        // return sequelize.query('CALL Sproc_GetKitAllocationForElastic (:pKitDetail,:pFromdate,:pTodate,:pRequiredCount)', {
        //     replacements: {
        //         pKitDetail: req.params.id,
        //         pFromdate: req.body.fromDate || null,
        //         pTodate: req.body.toDate || null,
        //         pRequiredCount: isRequiredCount || false
        //     }
        //     // eslint-disable-next-line consistent-return
        // }).then((response) => {
        const { sequelize } = req.app.locals.models;
        var packagingModuleName = DATA_CONSTANT.PACKAGING_TYPE.NAME;
        var responseModal = [];
        var pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;
        let dynamicQuery = `DROP TEMPORARY TABLE IF EXISTS tempKitAllocation;
                        CREATE TEMPORARY TABLE tempKitAllocation(pId INTEGER);`;
        if (pId) {
            dynamicQuery += `SET @SQL = CONCAT("insert into tempKitAllocation (pId) values ('", REPLACE((SELECT GROUP_CONCAT(DISTINCT ${pId}) AS DATA), ",", "'),('"), "');");
                                PREPARE stmt1 FROM @SQL; 
                                EXECUTE stmt1;`;
        }
        dynamicQuery += 'CALL Sproc_GetKitAllocationForElastic (:pFromdate,:pTodate,:pRequiredCount)';
        return sequelize.query(dynamicQuery, {
            replacements: {
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(packagingModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.KIT_ALLOCATION.ID);
            if (isRequiredCount) {
                // const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const totalCount = _.values(response[0]) && _.values(response[0])[2] && _.values(response[0])[2][0] ? _.values(response[0])[2][0]['totalCount'] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const renderList = _.values(response[0]) && _.values(response[0])[2] ? _.values(response[0])[2] : [];
                const stringifyStr = JSON.stringify(renderList);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            TitleURL: null,
                            UMID: null,
                            AllocatedQty: null,
                            PurchaseOrderNo: null,
                            SalesOrderNo: null,
                            AssyId: null,
                            AssyNumber: null,
                            ManufacturerPartNumber: null,
                            PartId: null,
                            ConsumptionQty: null,
                            Scrapped: null,
                            Status: null,
                            ReturnQty: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            KitNumber: null,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteKitAllocationDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.Title = `${entityDet.Title}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.REF_SALES_ORDER_DET_ID:
                                            elasticObject.TitleHrefUrl = `${hrefUrl + DATA_CONSTANT.ELASTIC_URL.KIT_ALLOCATION.KIT_ALLOCATION_URL + objectDetail[modelField]}/0/`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.UID: {
                                            const uid = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.REF_UID_ID];
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.UMID_MASTER.UMID_URL}${uid}`;

                                            elasticObject.UMID = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.ALLOCATED_QTY:
                                            elasticObject.AllocatedQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.PO_NUMBER:
                                            elasticObject.PurchaseOrderNo = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.SALES_ORDER_NUMBER: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.SALES_ORDER_MASTER.SALES_ORDER_URL +
                                                (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.SALE_ORDER_ID]);

                                            elasticObject.SalesOrderNo = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.PART_MFG_PN:
                                            if (objectDetail[modelField]) {
                                                const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.PART_MFG_TYPE];
                                                if (mfgType) {
                                                    const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                                    hrefUrl += `${partUrl}${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.PART_ID]}`;
                                                }
                                            }
                                            elasticObject.PartId = (objectDetail[modelField]) ?
                                                COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.PART_CODE],
                                                    objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.PART_CODE])
                                                : null;
                                            elasticObject.ManufacturerPartNumber = (objectDetail[modelField]) ?
                                                COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField])
                                                : null;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.ASSY_MFG_PN: {
                                            if (objectDetail[modelField]) {
                                                const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.ASSY_MFG_TYPE];
                                                if (mfgType) {
                                                    const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                                    hrefUrl += `${partUrl}${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.ASSY_ID]}`;
                                                }
                                            }
                                            elasticObject.AssyID = (objectDetail[modelField]) ?
                                                COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField])
                                                : null;
                                            elasticObject.AssyNumber = (objectDetail[modelField]) ?
                                                COMMON.createElasticOject(true, hrefUrl, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.ASSY_PID_CODE],
                                                    objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.ASSY_PID_CODE])
                                                : null;
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.CONSUME_QTY:
                                            elasticObject.ConsumptionQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.SCRAP_EXPIRED_QTY:
                                            elasticObject.Scrapped = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.KIT_STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.RETURN_QTY:
                                            elasticObject.ReturnQty = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.KIT_NUMBER:
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.KIT_ALLOCATION.KIT_ALLOCATION_URL +
                                                (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.REF_SALES_ORDER_DET_ID])}/${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.KIT_ALLOCATION_MST.ASSY_ID]}/`;
                                            elasticObject.KitNumber = (objectDetail[modelField]) ?
                                                COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField])
                                                : null;
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.KIT_ALLOCATION, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Kit Allocation Detail
    deleteKitAllocationDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.KIT_ALLOCATION, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.KIT_ALLOCATION.ID);
    },
    // Get list of Standards detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageStandardsInElastic
    // @return List of Standards
    manageStandardsInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.CertificateStandards.DISPLAYNAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetStandardsForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CertificateStandard.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Standard: null,
                            Code: null,
                            StandardType: null,
                            Priority: null,
                            Description: null,
                            StandardInfo: null,
                            DisplayOrder: null,
                            Certificate: null,
                            IssueDate: null,
                            ExpirationDate: null,
                            Status: null,
                            ExportControlled: null,
                            RestrictedDataAccess: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteStandardsDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.FULL_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.STANDARDS.STANDARDS_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.ID];
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Standard = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.SHORT_NAME:
                                            elasticObject.Code = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.STANDARD_TYPE:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.STANDARD_TYPES.STANDARD_TYPES_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.STANDARD_TYPE_ID];

                                            elasticObject.StandardType = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.PRIORITY:
                                            elasticObject.Priority = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.STANDARD_INFO:
                                            elasticObject.StandardInfo = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.CERTIFICATE:
                                            elasticObject.Certificate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.CERIFICATE_ISSUE_DATE:
                                            elasticObject.IssueDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.CERTIFICATE_DATE:
                                            elasticObject.ExpirationDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.EXPORT_CONTROLLED:
                                            elasticObject.ExportControlled = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_MST.RESTRICTED_DATA_ACCESS:
                                            elasticObject.RestrictedDataAccess = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.STANDARDS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Standards Detail Detailt
    deleteStandardsDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.STANDARDS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.CertificateStandard.ID);
    },
    // Get list of Standards Categories detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageStandardsCategoriesInElastic
    // @return List of Standards Categories
    manageStandardsCategoriesInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.STANDARD_CLASS.DISPLAYNAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetStandardsCategoriesForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.StandardClass.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            StandardCategory: null,
                            Standard: null,
                            DisplayOrder: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteStandardsCategoriesDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_CATEGORIES_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_CATEGORIES_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_CATEGORIES_MST.CLASS_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.STANDARDS_CATEGORIES.STANDARDS_CATEGORIES_URL;

                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.StandardCategory = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_CATEGORIES_MST.STANDARD:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.STANDARDS.STANDARDS_URL +
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_CATEGORIES_MST.STANDARD_ID];

                                            elasticObject.Standard = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_CATEGORIES_MST.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.STANDARDS_CATEGORIES_MST.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.STANDARDS_CATEGORIES, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Standards Categories Detail Detail
    deleteStandardsCategoriesDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.STANDARDS_CATEGORIES, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.StandardClass.ID);
    },
    // Get list of WorkOrder Operation Equipment detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageWOOperationEquipmentInElastic
    // @return List of WorkOrder Operation Equipment
    manageWOOperationEquipmentInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var woOPEquiModuleName = DATA_CONSTANT.WORKORDER_OPERATION_EQUIPMENT.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_GetWorkorderEquipmentDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(woOPEquiModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.WorkorderEquipment.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            WONumber: null,
                            PONumber: null,
                            WOVersion: null,
                            WOOperationNumber: null,
                            WOOperationName: null,
                            SalesOrderNumber: null,
                            EquipmentName: null,
                            Make: null,
                            Model: null,
                            Year: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                const equipmentID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.ID];
                                module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_EQUIPMENT, DATA_CONSTANT.ACTION_TYPE.DELETE, null, equipmentID, COMMON.AllEntityIDS.WorkorderEquipment.ID);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.WO_NUMBER: {
                                            const woId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.WO_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_MASTER.WORK_ORDER_EQUIPMENT_URL + woId;

                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.WONumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.WO_VERSION:
                                            elasticObject.WOVersion = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.WO_OP_NAME:
                                            elasticObject.WOOperationName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.WO_OP_NUMBER: {
                                            const woOPID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.WO_OP_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_OPERATION.WORK_ORDER_OPERATION_EQUIPMENT_URL + woOPID;

                                            elasticObject.WOOperationNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.WO_OPERATION_NUMBER);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.PO_NUMBER:
                                            elasticObject.PONumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.SALES_ORDER_NUMBER:
                                            elasticObject.SalesOrderNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.ASSET_NAME: {
                                            const eqpId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.EQP_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.EQUIPMENT_WORKSTATION_MASTER.EQUIPMENT_WORKSTATION_URL + eqpId;

                                            elasticObject.EquipmentName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.EQP_MAKE:
                                            elasticObject.Make = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.EQP_MODEL:
                                            elasticObject.Model = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EQUIPMENT_MST.EQP_YEAR:
                                            elasticObject.Year = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_EQUIPMENT, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete WorkOrder Operation Equipment Detail
    deleteWOOperationEquipmentDetailInElastic: (req) => {
        var pWhereClause = {};
        if (req.params && (typeof (req.params) === 'object') && req.params.eqpID) {
            pWhereClause.eqpID = { [Op.in]: Array.isArray(req.params.eqpID) ? req.params.eqpID : [req.params.eqpID] };
        }
        if (req.params && (typeof (req.params) === 'object') && req.params.woID) {
            pWhereClause.woID = { [Op.in]: req.params.woID };
        }
        if (req.params && (typeof (req.params) === 'object') && req.params.woOPID) {
            pWhereClause.woOPID = { [Op.in]: Array.isArray(req.params.woOPID) ? req.params.woOPID : [req.params.woOPID] };
        }

        const { WorkorderOperationEquipment } = req.app.locals.models;
        if (req.body) {
            WorkorderOperationEquipment.findAll({
                attributes: ['woOpEqpID'],
                where: pWhereClause,
                paranoid: false
            }).then((equipment) => {
                var equipmentData = _.map(equipment, 'woOpEqpID').toString();
                module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_EQUIPMENT, DATA_CONSTANT.ACTION_TYPE.DELETE, null, equipmentData, COMMON.AllEntityIDS.WorkorderEquipment.ID);
            }).catch((err) => {
                console.trace();
                console.error(err);
            });
        }
    },
    // Get list of WorkOrder Operation Employee detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageWOOperationEmployeeInElastic
    // @return List of WorkOrder Operation Employee
    manageWOOperationEmployeeInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var woOPEmpModuleName = DATA_CONSTANT.WORKORDER_OPERATION_EMPLOYEE.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_GetWOOperationEmployeeDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(woOPEmpModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.WorkorderEmployee.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            WONumber: null,
                            PONumber: null,
                            WOVersion: null,
                            WOOperationNumber: null,
                            WOOperationName: null,
                            SalesOrderNumber: null,
                            FirstName: null,
                            LastName: null,
                            InitialName: null,
                            EmployeeCertifications: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_EMPLOYEE, DATA_CONSTANT.ACTION_TYPE.DELETE, null,
                                    objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.ID], COMMON.AllEntityIDS.WorkorderEmployee.ID);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.WO_NUMBER: {
                                            const woId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.WO_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_MASTER.WORK_ORDER_EMPLOYEE_URL + woId;

                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.WONumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.WO_VERSION:
                                            elasticObject.WOVersion = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.PO_NUMBER:
                                            elasticObject.PONumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.WO_OP_NAME:
                                            elasticObject.WOOperationName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.WO_OP_NUMBER: {
                                            const woOPID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.WO_OP_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_OPERATION.WORK_ORDER_OPERATION_EMPLOYEE_URL + woOPID;

                                            elasticObject.WOOperationNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.WO_OPERATION_NUMBER);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.SALES_ORDER_NUMBER:
                                            elasticObject.SalesOrderNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.FIRST_NAME:
                                            elasticObject.FirstName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;

                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.LAST_NAME:
                                            elasticObject.LastName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.INITIAL_NAME: {
                                            const empId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.EMPLOYEE_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PERSONAL.PERSONAL_URL + empId;

                                            elasticObject.InitialName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_EMPLOYEE_MST.EMP_CERTIFICATIONS:
                                            elasticObject.EmployeeCertifications = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_EMPLOYEE, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete WorkOrder Operation Employee Detail
    deleteWOOperationEmployeeDetailInElastic: (req) => {
        var pWhereClause = {};
        if (req.params && (typeof (req.params) === 'object') && req.params.employeeID) {
            pWhereClause.employeeID = { [Op.in]: Array.isArray(req.params.employeeID) ? req.params.employeeID : [req.params.employeeID] };
        }
        if (req.params && (typeof (req.params) === 'object') && req.params.woOPID) {
            pWhereClause.woOPID = { [Op.in]: Array.isArray(req.params.woOPID) ? req.params.woOPID : [req.params.woOPID] };
        }

        const { WorkorderOperationEmployee } = req.app.locals.models;
        if (req.body) {
            WorkorderOperationEmployee.findAll({
                attributes: ['woOpEmployeeID'],
                where: pWhereClause,
                paranoid: false
            }).then((employee) => {
                var employeeIds = _.map(employee, 'woOpEmployeeID').toString();
                module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_EMPLOYEE, DATA_CONSTANT.ACTION_TYPE.DELETE, null, employeeIds, COMMON.AllEntityIDS.WorkorderEmployee.ID);
            }).catch((err) => {
                console.trace();
                console.error(err);
            });
        }
    },
    // Get list of WorkOrder Operation [Supplier/Materials/Tools] detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageWOOperationPartInElastic
    // @return List of WorkOrder Operation [Supplier/Materials/Tools]
    manageWOOperationPartInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var woOPPartModuleName = DATA_CONSTANT.WORKORDER_OPERATION_PART.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_GetWOOperationPartDetailForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(woOPPartModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.WorkorderPart.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            WONumber: null,
                            PONumber: null,
                            WOVersion: null,
                            WOOperationNumber: null,
                            WOOperationName: null,
                            SalesOrderNumber: null,
                            PartId: null,
                            ManufacturerPartNumber: null,
                            ManufacturerDescription: null,
                            FunctionalCategory: null,
                            MountingType: null,
                            RoHSStatus: null,
                            QPA: null,
                            TotalQPA: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_PART, DATA_CONSTANT.ACTION_TYPE.DELETE, null, objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.ID], COMMON.AllEntityIDS.WorkorderPart.ID);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.WO_NUMBER: {
                                            const woId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.WO_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_MASTER.WORK_ORDER_PART_URL + woId;

                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.WONumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.WO_VERSION:
                                            elasticObject.WOVersion = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.PO_NUMBER:
                                            elasticObject.PONumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.WO_OP_NAME:
                                            elasticObject.WOOperationName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.WO_OP_NUMBER: {
                                            const woOPID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.WO_OP_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_OPERATION.WORK_ORDER_OPERATION_PART_URL + woOPID;

                                            elasticObject.WOOperationNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.WO_OPERATION_NUMBER);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.SALES_ORDER_NUMBER:
                                            elasticObject.SalesOrderNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.PID_CODE:
                                            if (objectDetail[modelField]) {
                                                const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.MFG_TYPE];
                                                if (mfgType) {
                                                    const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                                    hrefUrl += `${partUrl}${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.PART_ID]}`;
                                                }
                                            }

                                            elasticObject.PartId = (objectDetail[modelField]) ?
                                                COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField],
                                                    objectDetail[modelField])
                                                : null;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.MFG_PN:
                                            elasticObject.ManufacturerPartNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.MFG_PN_DESCRIPTION:
                                            elasticObject.ManufacturerDescription = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.PART_TYPE_NAME: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.FUNCTIONAL_TYPE.FUNCTIONAL_TYPE_URL;

                                            elasticObject.FunctionalCategory = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.MOUNTING_TYPE:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.MOUNTING_TYPE.MOUNTING_TYPE_URL;

                                            elasticObject.MountingType = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.ROHS_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.RFQ_ROHSMST_URL;

                                            elasticObject.RoHSStatus = COMMON.createElasticOject(true, hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.QPA:
                                            elasticObject.QPA = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.TOTAL_QPA:
                                            elasticObject.TotalQPA = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_PART, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete WorkOrder Operation [Supplier/Materials/Tools] Detail
    deleteWOOperationPartDetailInElastic: (req) => {
        var pWhereClause = {
            isDeleted: true
        };
        if (req.params && (typeof (req.params) === 'object') && req.params.partId) {
            pWhereClause.partId = { [Op.in]: Array.isArray(req.params.partId) ? req.params.partId : [req.params.partId] };
        }
        if (req.params && (typeof (req.params) === 'object') && req.params.woOPID) {
            pWhereClause.woOPID = { [Op.in]: Array.isArray(req.params.woOPID) ? req.params.woOPID : [req.params.woOPID] };
        }

        const { WorkorderOperationPart } = req.app.locals.models;
        if (req.body) {
            WorkorderOperationPart.findAll({
                attributes: ['woOPPartID'],
                where: pWhereClause,
                paranoid: false
            }).then((partDetail) => {
                var partDetailIds = _.map(partDetail, 'woOPPartID').toString();
                module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.WORKORDER_OPERATION_PART, DATA_CONSTANT.ACTION_TYPE.DELETE, null, partDetailIds, COMMON.AllEntityIDS.WorkorderPart.ID);
            }).catch((err) => {
                console.trace();
                console.error(err);
            });
        }
    },
    // Get list of [Workorder/Traveler] Change Request store into Elastic Search engine
    // GET : /api/enterprise_search/manageChangeRequestInElastic
    // @return List of [Workorder/Traveler] Change Request
    manageChangeRequestInElastic: (req, res, isRequiredCount) => {
        const {
            sequelize
        } = req.app.locals.models;
        var woRevReqModuleName = DATA_CONSTANT.WORKORDER_REQFORREVIEW.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;
        pWhereClause.requestType = (req.params && (typeof (req.params) === 'object') && req.params.requestType) ? req.params.requestType : null;

        return sequelize.query('CALL Sproc_GetWOOPChangeRequestDetailForElastic (:pId,:pRequestType,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pRequestType: pWhereClause.requestType,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(woRevReqModuleName));
            }
            const woChangeReqEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.WORKORDER_CHANGE_REQUEST.ID);
            const travelrChangeReqEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.TRAVELER_CHANGE_REQUEST.ID);
            const entityDet = pWhereClause.requestType === woChangeReqEntity.Parameter.requestType ?
                woChangeReqEntity : travelrChangeReqEntity;
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            WONumber: null,
                            PONumber: null,
                            WOVersion: null,
                            WOOperationNumber: null,
                            WOOperationName: null,
                            SalesOrderNumber: null,
                            ThreadTitle: null,
                            CommentBy: null,
                            Comment: null,
                            PostOn: null,
                            ApproveBy: null,
                            ApproveOn: null,
                            RequestStatus: null,
                            WORevnumber: null,
                            WOOpRevNumber: null,
                            RequestType: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            module.exports.configureDefualtValue(elasticObject, objectDetail);
                            Object.keys(objectDetail).forEach((modelField) => {
                                var hrefUrl = UI_URL;
                                switch (modelField) {
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.ID:
                                        elasticObject.EntityId = objectDetail[modelField];
                                        elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.WO_NUMBER: {
                                        const woId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.WO_ID];
                                        hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_MASTER.WORK_ORDER_PART_URL + woId;

                                        elasticObject.WONumber = COMMON.createElasticOject(true,
                                            hrefUrl,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    }
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.WO_VERSION:
                                        elasticObject.WOVersion = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.PO_NUMBER:
                                        elasticObject.PONumber = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.WO_OP_NAME:
                                        elasticObject.WOOperationName = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.WO_OP_NUMBER:
                                        if (objectDetail[modelField]) {
                                            const woOPID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.WO_OP_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_OPERATION.WORK_ORDER_OPERATION_PART_URL + woOPID;

                                            elasticObject.WOOperationNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField], null, DATA_CONSTANT.ELASTIC_DEFAULT_FORMAT.WO_OPERATION_NUMBER);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.WORKORDER_OPERATION_PART_MST.SALES_ORDER_NUMBER:
                                        elasticObject.SalesOrderNumber = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.THREAD_TITLE:
                                        elasticObject.ThreadTitle = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.COMMENT_BY:
                                        elasticObject.CommentBy = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.DESCRIPTION:
                                        elasticObject.Comment = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.COMMENT_DATE:
                                        elasticObject.PostOn = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField], COMMON.TIMESTAMP_COMMON);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.APP_REJ_BY:
                                        elasticObject.ApproveBy = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.ACC_REJ_DATE:
                                        elasticObject.ApproveOn = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField], COMMON.TIMESTAMP_COMMON);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.REQUEST_TYPE:
                                        elasticObject.RequestType = objectDetail[modelField];
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.ACC_REJ_STATUS:
                                        elasticObject.RequestStatus = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.WO_REV_NUMBER:
                                        elasticObject.WORevnumber = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.CHANGE_REQUEST_MST.WO_OP_REV_NUMBER:
                                        elasticObject.WOOpRevNumber = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    default:
                                    // code block
                                }
                            });
                            responseModal.push(elasticObject);
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.CHANGE_REQUEST, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Get list of Equipment & Workstation Types detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageEquipmentWorkstationTypesInElastic
    // @return List of Equipment & Workstation Types
    manageEquipmentWorkstationTypesInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_TYPES;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_GetEquipmentWorkstationTypesForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.EQUIPMENT_WORKSTATION_SAMPLE_TYPE.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Code: null,
                            DisplayOrder: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteEquipmentWorkstationTypesDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.GENC_CATEGORY_NAME: {
                                            const eqtId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.EQUIPMENT_WORK_STATION_TYPES_URL + eqtId;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.GENC_CATEGORY_CODE:
                                            elasticObject.Code = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION_TYPES, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Equipment & Workstation Types Detail
    deleteEquipmentWorkstationTypesDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION_TYPES, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.EQUIPMENT_WORKSTATION_SAMPLE_TYPE.ID);
    },
    // Get list of Equipment & Workstation Groups detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageEquipmentWorkstationGroupsInElastic
    // @return List of Equipment & Workstation Groups
    manageEquipmentWorkstationGroupsInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_GROUPS;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_GetEquipmentWorkstationGroupsForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.EQUIPMENT_WORKSTATION_SAMPLE_GROUPS.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Code: null,
                            ParentName: null,
                            DisplayOrder: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteEquipmentWorkstationGroupsDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.GENC_CATEGORY_NAME: {
                                            const eqtId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.EQUIPMENT_WORK_STATION_GROUPS_URL + eqtId;

                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.GENC_CATEGORY_CODE:
                                            elasticObject.Code = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.PARENT_NAME: {
                                            const eqgId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.PARENT_GEN_CAT_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.EQUIPMENT_WORK_STATION_GROUPS_URL + eqgId;

                                            elasticObject.ParentName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION_GROUPS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Equipment & Workstation Groups Detail
    deleteEquipmentWorkstationGroupsDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION_GROUPS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.EQUIPMENT_WORKSTATION_SAMPLE_GROUPS.ID);
    },
    // Get list of Equipment & Workstation Ownerships detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageEquipmentWorkstationOwnershipsInElastic
    // @return List of Equipment & Workstation Types
    manageEquipmentWorkstationOwnershipsInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_OWNERSHIPS;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_GetEquipmentWorkstationOwnershipsForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.EQUIPMENT_WORKSTATION_SAMPLE_OWNERSHIP.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Code: null,
                            DisplayOrder: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteEquipmentWorkstationTypesOwnershipsInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.GENC_CATEGORY_NAME: {
                                            const eqoId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.EQUIPMENT_WORK_STATION_OWNERSHIPS_URL + eqoId;

                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.GENC_CATEGORY_CODE:
                                            elasticObject.Code = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION_OWNERSHIPS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Equipment & Workstation Ownerships Detail
    deleteEquipmentWorkstationTypesOwnershipsInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.EQUIPMENT_WORKSTATION_OWNERSHIPS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.EQUIPMENT_WORKSTATION_SAMPLE_OWNERSHIP.ID);
    },
    // Get list of Geolocations detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageLocationsInElastic
    // @return List of Geolocations
    manageLocationsInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.GENERIC_CATEGORY_TYPE.GEOLOCATIONS;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_GetLocationsForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.GEOLOCATIONS.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                if (!response) {
                    return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
                }
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Code: null,
                            DisplayOrder: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteLocationsInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.GENC_CATEGORY_NAME: {
                                            const locationId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.LOCATIONS_URL + locationId;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.GENC_CATEGORY_CODE:
                                            elasticObject.Code = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.GEOLOCATIONS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Geolocations detail
    deleteLocationsInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.GEOLOCATIONS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.GEOLOCATIONS.ID);
    },
    // Get list of ECO/DFM Category detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageECODFMCategoryInElastic
    // @return List of ECO/DFM Category
    manageECODFMCategoryInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.ECO_TYPE_CATEGORY.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_GetECOCategoryForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.EcoTypeCategory.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Code: null,
                            DisplayOrder: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteECODFMCategoryInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.ECO_TYPE_CATEGORY_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.ECO_TYPE_CATEGORY_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ECO_TYPE_CATEGORY_MST.NAME: {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.ECO_TYPE_CATEGORY.ECO_TYPE_CATEGORY_MST_URL;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.ECO_TYPE_CATEGORY_MST.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.ECO_DFM_CATEGORY, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete ECO/DFM Category Detail
    deleteECODFMCategoryInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.ECO_DFM_CATEGORY, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.EcoTypeCategory.ID);
    },
    // Get list of ECO/DFM Category Attributes detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageECODFMCategoryAttributesInElastic
    // @return List of ECO/DFM Category Attributes
    manageECODFMCategoryAttributesInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.ECO_TYPE_VALUES.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_GetECOCategoryAttributeForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.EcoTypeValues.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            ECODFMCategory: null,
                            DisplayOrder: null,
                            NoteRequired: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteECODFMCategoryAttributesInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.ECO_TYPE_CATEGORY_VALUE_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.ECO_TYPE_CATEGORY_VALUE_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ECO_TYPE_CATEGORY_VALUE_MST.NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.ECO_TYPE_CATEGORY.ECO_TYPE_CATEGORY_MST_ATTRIBUTES_URL;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ECO_TYPE_CATEGORY_VALUE_MST.ECO_TYPE_CAT_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.ECO_TYPE_CATEGORY.ECO_TYPE_CATEGORY_MST_URL;
                                            elasticObject.ECODFMCategory = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ECO_TYPE_CATEGORY_VALUE_MST.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ECO_TYPE_CATEGORY_VALUE_MST.NOTE_REQUIRED:
                                            elasticObject.NoteRequired = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.ECO_DFM_CATEGORY_ATTRIBUTES, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete ECO/DFM Category Attributes Detail
    deleteECODFMCategoryAttributesInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.ECO_DFM_CATEGORY_ATTRIBUTES, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.EcoTypeValues.ID);
    },
    // Get list of ECO/DFM Type detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageECODFMTypeInElastic
    // @return List of ECO/DFM Type
    manageECODFMTypeInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.GENERIC_CATEGORY_TYPE.ECO_DFM_TYPE;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_GetECODFMTypeForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.ECO_DFM_TYPES.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Name: null,
                            Code: null,
                            DisplayOrder: null,
                            Status: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteECODFMCategoryInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.GENC_CATEGORY_NAME: {
                                            const edtId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.ECO_DFM_TYPE_URL + edtId;

                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.GENC_CATEGORY_CODE:
                                            elasticObject.Code = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.DISPLAY_ORDER:
                                            elasticObject.DisplayOrder = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.GENERIC_CATEGORY_MST.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.ECO_DFM_TYPE, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete ECO/DFM Type Detail
    deleteECODFMTypeInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.ECO_DFM_TYPE, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.ECO_DFM_TYPES.ID);
    },
    // Get list of Reserve Stock Request  detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageRequestStockRequestInElastic
    // @return List of Reserve Stock Request
    manageReserveStockRequestInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.RESERVE_STOCK_REQUEST.Name;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;

        return sequelize.query('CALL Sproc_RetrieveReserveStockRequestForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.ReserveStockRequest.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Customer: null,
                            TransactionDate: null,
                            AssyId: null,
                            Nickname: null,
                            MFR: null,
                            MFRPN: null,
                            Count: null,
                            Unit: null,
                            UOM: null,
                            Description: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteReserveStockRequestInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.Title = `${entityDet.Title}`;
                                            elasticObject.TitleHrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.RESERVE_STOCK_REQUEST.RESERVE_STOCK_REQUEST_URL;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.CUSTOMER_NAME: {
                                            const isCustOrDisty = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.IS_CUST_OR_DISTY];
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.CUS_MFG_TYPE];

                                            const customerID = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.CUSTOMER_ID];
                                            if (mfgType) {
                                                if (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.DIST) {
                                                    hrefUrl += DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + customerID;
                                                } else if (mfgType === DATA_CONSTANT.MFGCODE.MFGTYPE.MFG) {
                                                    hrefUrl += ((isCustOrDisty) ?
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL :
                                                        DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL) +
                                                        customerID;
                                                }
                                                elasticObject.Customer = COMMON.createElasticOject(true, hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.TRANSACTION_DATE:
                                            elasticObject.TransactionDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.ASSY_PID_CODE:
                                            if (objectDetail[modelField]) {
                                                const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.ASSY_MFG_TYPE];
                                                if (mfgType) {
                                                    const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                                    hrefUrl += `${partUrl}${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.ASSY_ID]}`;
                                                }
                                            }

                                            elasticObject.AssyID = (objectDetail[modelField]) ?
                                                COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField])
                                                : null;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.NICKNAME:
                                            elasticObject.Nickname = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.MFG:
                                            elasticObject.MFR = COMMON.createElasticOject(false, null,
                                                objectDetail[modelField], objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.MFG_PN: {
                                            if (objectDetail[modelField]) {
                                                const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.MFG_TYPE];
                                                if (mfgType) {
                                                    const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                                    hrefUrl += `${partUrl}${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.PART_ID]}`;
                                                }
                                            }

                                            elasticObject.MFRPN = (objectDetail[modelField]) ?
                                                COMMON.createElasticOject(true, hrefUrl, objectDetail[modelField], objectDetail[modelField])
                                                : null;
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.COUNT:
                                            elasticObject.Count = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.UNIT:
                                            elasticObject.Unit = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.UOM:
                                            elasticObject.UOM = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.RESERVE_STOCK_REQUEST_MST.DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.RESERVE_STOCK_REQUEST, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Reserve Stock Request Detail
    deleteReserveStockRequestInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.RESERVE_STOCK_REQUEST, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.ReserveStockRequest.ID);
    },
    // Get list of Request For Shipment detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageRequestForShipmentInElastic
    // @return List of Request For Shipment
    manageRequestForShipmentInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var moduleName = DATA_CONSTANT.REQUEST_FOR_SHIP.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId.toString() : null;
        return sequelize.query('CALL Sproc_GetRequestShipmentForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(moduleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.REQUEST_FOR_SHIPMENTS.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            Request: null,
                            Note: null,
                            RequestDate: null,
                            RequestedByName: null,
                            Status: null,
                            VerificationStatus: null,
                            WONumber: null,
                            PIDCode: null,
                            MfgPN: null,
                            MfgName: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteRequestForShipmentInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.Title = `${entityDet.Title}`;
                                            elasticObject.Request = COMMON.createElasticOject(false, null,
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.REQ_ID],
                                                objectDetail[DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.REQ_ID]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.NOTE:
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.REQUEST_FOR_SHIPMENT.REQUEST_FOR_SHIPMENT_URL} /${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.REQ_ID]}`;

                                            elasticObject.Note = COMMON.createElasticOject(true, hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.REQUEST_DATE:
                                            elasticObject.RequestDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.REQUESTED_BYNAME: {
                                            const employeeId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.REQUESTED_BY];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PERSONAL.PERSONAL_URL + employeeId;

                                            elasticObject.RequestedByName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.VERIFICATION_STATUS:
                                            elasticObject.VerificationStatus = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.WO_NUMBER:
                                            hrefUrl = UI_URL + DATA_CONSTANT.ELASTIC_URL.WORK_ORDER_MASTER.WORK_ORDER_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.WORK_ORDER_MASTER_FIELD.WOID];
                                            elasticObject.WONumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.PID_CODE: {
                                            const mfgType = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.MFG_TYPE];
                                            const partId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.PART_ID];
                                            const partUrl = COMMON.stringFormat(DATA_CONSTANT.ELASTIC_URL.PART_MASTER.PID_CODE, mfgType.toLowerCase());
                                            hrefUrl += `${partUrl}${partId}`;
                                            elasticObject.PIDCode = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.MFG_PN:
                                            elasticObject.MfgPN = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.MFG_NAME:
                                            hrefUrl = UI_URL + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.REQUEST_FOR_SHIPMENT_MST.CUSTOMER_ID];
                                            elasticObject.MfgName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.REQUEST_FOR_SHIPMENT, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Request For Shipment Detail
    deleteRequestForShipmentInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.REQUEST_FOR_SHIPMENT, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.REQUEST_FOR_SHIPMENTS.ID);
    },

    // Get list of Defect Category detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageDefectCategoryDetailInElastic
    // @return List of Defect Category
    manageDefectCategoryDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var currModuleName = DATA_CONSTANT.DEFECT_CATEGORY.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.defectCatId) ? req.params.defectCatId : null;

        return sequelize.query('CALL Sproc_GetDefectCategoryForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(currModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.DEFECT_CATEGORY.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            CategoryId: null,
                            Name: null,
                            Description: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null

                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteDefectCategoryDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.DEFECT_CATEGORY_FIELD.DEF_CAT_ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    var hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.DEFECT_CATEGORY_FIELD.DEF_CAT_ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.Title = `${entityDet.Title}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.DEFECT_CATEGORY_FIELD.DEF_CAT_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.DEFECT_CATEGORY.DEFECT_CATEGORY_URL;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.DEFECT_CATEGORY_FIELD.DEF_CAT_DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default: break;
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.DEFECT_CATEGORY, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Defect Category Detail
    deleteDefectCategoryDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.DEFECT_CATEGORY, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.DEFECT_CATEGORY.ID);
    },
    // Get list of Department detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageDepartmentDetailInElastic
    // @return List of Department
    manageDepartmentDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var currModuleName = DATA_CONSTANT.DEPARTMENT.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.deptId) ? req.params.deptId : null;

        return sequelize.query('CALL Sproc_GetDepartmentForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(currModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Department.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            DeptId: null,
                            Name: null,
                            DeptParentName: null,
                            DeptMngrName: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteDepartmentDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.DEPARTMENT_FIELD.DEPT_ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.DEPARTMENT_FIELD.DEPT_ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.DEPARTMENT_FIELD.DEPT_NAME:
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.DEPARTMENT.DEPARTMENT_URL}/${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.DEPARTMENT_FIELD.DEPT_ID]}`;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.DEPARTMENT_FIELD.PARENT_DEPTNAME:
                                            elasticObject.DeptParentName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.DEPARTMENT_FIELD.MANAGER_NAME: {
                                            const employeeId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.DEPARTMENT_FIELD.MANAGER_ID];
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.PERSONAL.PERSONAL_URL + employeeId;
                                            elasticObject.DeptMngrName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        }
                                        default: break;
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.DEPARTMENT, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Department Detail
    deleteDepartmentDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.DEPARTMENT, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Department.ID);
    },
    // Get list of Entity detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageEntityDetailInElastic
    // @return List of Entity
    manageEntityDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var currModuleName = DATA_CONSTANT.ENTITY.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.entityID) ? req.params.entityID : null;

        return sequelize.query('CALL Sproc_GetEntityForElastic (:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(currModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.Entity.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Name: null,
                            Remark: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteEntityDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.ENTITY_FIELD.ENTITY_ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.ENTITY_FIELD.ENTITY_ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Title = `${entityDet.Title}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ENTITY_FIELD.ENTITY_NAME:
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.ENTITY.ENTITY_CUSTOM_FORM_URL}/${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.ENTITY_FIELD.ENTITY_ID]}/`;
                                            elasticObject.Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ENTITY_FIELD.ENTITY_REMARK:
                                            elasticObject.Remark = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default: break;
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.ENTITY, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Entity Detail
    deleteEntityDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.ENTITY, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.Entity.ID);
    },
    // Get list of Calibration detail and store into Elastic Search engine
    // GET : /api/enterprise_search/manageCalibrationDetailInElastic
    // @return List of Calibration Detail
    manageCalibrationDetailInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var currModuleName = DATA_CONSTANT.CALIBRATION_DETAILS.NAME;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.pId = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;

        return sequelize.query('CALL Sproc_GetCalibrationDetailForElastic(:pId,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pId: pWhereClause.pId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response || response.length === 0) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(currModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CALIBRATION_DETAILS.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            AssetName: null,
                            EqpMake: null,
                            EqpModel: null,
                            EqpYear: null,
                            CalibrationType: null,
                            CalibrationDate: null,
                            CalibrationExpirationDate: null,
                            CalibrationComments: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteCalibrationDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Title = `${entityDet.Title}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.ASSET_NAME:
                                            hrefUrl += `${DATA_CONSTANT.ELASTIC_URL.EQUIPMENT_WORKSTATION_MASTER.EQUIPMENT_WORKSTATION_URL}${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.REF_EQP_ID]}`;
                                            elasticObject.AssetName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.EQP_MAKE:
                                            elasticObject.EqpMake = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.EQP_MODEL:
                                            elasticObject.EqpModel = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.EQP_YEAR:
                                            elasticObject.EqpYear = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.CALIBRATION_TYPE:
                                            elasticObject.CalibrationType = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.CALIBRATION_DATE:
                                            elasticObject.CalibrationDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.CALIBRATION_EXPIRATION_DATE:
                                            elasticObject.CalibrationExpirationDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CALIBRATION_DETAILS_FIELD.CALIBRATION_COMMENTS:
                                            elasticObject.CalibrationComments = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default: break;
                                        // code block
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.CALIBRATION_DETAILS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Calibration Detail
    deleteCalibrationDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.CALIBRATION_DETAILS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.CALIBRATION_DETAILS.ID);
    },
    // Get details of customer payment and store into Elastic Search engine
    // GET : /api/enterprise_search/manageCustomerPaymentInElastic
    // @return customer payment details
    manageCustomerPaymentInElastic: (req, res, isRequiredCount) => {
        const {
            sequelize
        } = req.app.locals.models;

        var customerPaymentName = DATA_CONSTANT.CUSTOMER_PAYMENT.Name;
        const pWhereClause = {};
        var elasticObjectArray = [];
        var responseModal = [];
        pWhereClause.paymentMstID = (req.body.epSearchData && (typeof (req.body.epSearchData) === 'object') && req.body.epSearchData.InvPaymentMstID) ? req.body.epSearchData.InvPaymentMstID : null;
        pWhereClause.refPaymentMode = (req.params && (typeof (req.params) === 'object') && req.params.refPaymentMode) ? req.params.refPaymentMode : null;

        return sequelize.query('CALL Sproc_GetCustomerPaymentDetForElastic (:pPaymentMstID,:pRefPaymentMode,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pPaymentMstID: pWhereClause.paymentMstID,
                pRefPaymentMode: pWhereClause.refPaymentMode,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((paymentDet) => {
            if (!paymentDet) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(customerPaymentName));
            }
            const custPaymentEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CustomerPayment.ID);
            const custAppCreditMemoEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.APPLIED_CUSTOMER_CREDIT_MEMO.ID);
            const custWriteOffEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CUSTOMER_WRITE_OFFS.ID);
            const custRefundEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CUSTOMER_REFUND.ID);

            const entityDet = pWhereClause.refPaymentMode === custPaymentEntity.Parameter.refPaymentMode ? custPaymentEntity :
                (pWhereClause.refPaymentMode === custAppCreditMemoEntity.Parameter.refPaymentMode ? custAppCreditMemoEntity :
                    (pWhereClause.refPaymentMode === custWriteOffEntity.Parameter.refPaymentMode ? custWriteOffEntity : custRefundEntity));
            if (isRequiredCount) {
                const totalCount = _.values(paymentDet[0]) ? _.values(paymentDet[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(paymentDet);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            CustomerFullName: null,
                            SystemId: null,
                            IsPaymentVoidedConvertedValue: null,
                            DepositBatchNumber: null,
                            PaymentNumber: null,
                            PaymentDate: null,
                            PaymentType: null,
                            AccountReference: null,
                            PaymentMethod: null,
                            BankAccountNo: null,
                            RefundToBankAccountCode: null,
                            BankName: null,
                            IsLocked: null,
                            InvoiceNumberList: null,
                            Remark: null,
                            LockStatusConvertedValue: null,
                            LockedAt: null,
                            LockedBy: null,
                            VoidedAt: null,
                            VoidedBy: null,
                            VoidPaymentReason: null,
                            RefVoidedPaymentNumber: null,
                            CreditMemoNumber: null,
                            CreditMemoDate: null,
                            RefPaymentMode: null,
                            CustCreditMemoID: null,
                            TransactionNumber: null,
                            WriteOffNumber: null,
                            VoidApplyCMReason: null,
                            TransactionModeName: null,
                            PaymentNumberListAgainstRefund: null,
                            CreditMemoNumberListAgainstRefund: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };

                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                // module.exports.deleteECODFMCategoryInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.CUSTOMER_FULL_NAME: {
                                            const mfgMstId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.MFGCODE_ID];
                                            const mfgName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.CUSTOMER_FULL_NAME];
                                            hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.CUSTOMER_URL + (mfgMstId);
                                            elasticObject.CustomerFullName = COMMON.createElasticOject(true, hrefUrl, mfgName, mfgName);
                                        }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.SYSTEM_ID:
                                            elasticObject.SystemId = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.DEPOSIT_BATCH_NUMBER:
                                            if (objectDetail[modelField]) {
                                                elasticObject.DepositBatchNumber = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.PAYMENT_NUMBER:
                                            if (objectDetail.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code) {
                                                hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.CUSTOMER_PAYMENT.DETAIL_PAGE_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.ID];
                                                elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                                elasticObject.TitleHrefUrl = hrefUrl;
                                                elasticObject.PaymentNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            } else if (objectDetail.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code) {
                                                hrefUrl = `${hrefUrl + DATA_CONSTANT.ELASTIC_URL.APPLY_CUST_CRDIT_MEMO_TO_INVOICE.APPLY_CUST_CREDIT_MEMO_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.CREDIT_MEMO_ID]}/${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.ID]}`;
                                                elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                                elasticObject.TitleHrefUrl = hrefUrl;
                                                elasticObject.TransactionNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            } else if (objectDetail.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code) {
                                                hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.CUSTOMER_WRITEOFF.DETAIL_PAGE_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.ID];
                                                elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                                elasticObject.TitleHrefUrl = hrefUrl;
                                                elasticObject.WriteOffNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            } else if (objectDetail.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) {
                                                hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.CUSTOMER_REFUND.DETAIL_PAGE_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.ID];
                                                elasticObject.Title = `${entityDet.Title}`;
                                                elasticObject.TitleHrefUrl = hrefUrl;
                                                if (objectDetail[modelField]) {
                                                    elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                                    elasticObject.PaymentNumber = COMMON.createElasticOject(true,
                                                        hrefUrl,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]);
                                                }
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.BANK_NAME:
                                            if (objectDetail[modelField]) {
                                                elasticObject.BankName = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.BANK_ACCOUNT_NO:
                                            if (objectDetail[modelField]) {
                                                if (objectDetail.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) {
                                                    elasticObject.RefundToBankAccountCode = COMMON.createElasticOject(false,
                                                        null,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]);
                                                } else {
                                                    elasticObject.BankAccountNo = COMMON.createElasticOject(false,
                                                        null,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]);
                                                }
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.PAYMENT_TYPE:
                                            elasticObject.PaymentType = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.PAYMENT_METHOD:
                                            if (objectDetail[modelField]) {
                                                let isSetHrefForPayMethod = false;
                                                if (!objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.SYS_GENERATED_PAY_METHOD]) {
                                                    hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.CUSTOMER_PAYMENT.PAYMENT_METHOD + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.PAYMENT_TYPE];
                                                    isSetHrefForPayMethod = true;
                                                }
                                                elasticObject.PaymentMethod = COMMON.createElasticOject(isSetHrefForPayMethod,
                                                    isSetHrefForPayMethod ? hrefUrl : null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.PAYMENT_DATE:
                                            elasticObject.PaymentDate = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.ACCOUNT_REFERENCE:
                                            hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.CUSTOMER_PAYMENT.CUSTOMER_DETAILS_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.MFGCODE_ID];
                                            elasticObject.AccountReference = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.TRANSACTION_MODE_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.TRANSACTION_MODES.PAYABLE_TRANSACTION_MODES;
                                            if (objectDetail[modelField]) {
                                                elasticObject.TransactionModeName = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.INVOICE_NUM_LIST:
                                            if (objectDetail[modelField]) {
                                                elasticObject.InvoiceNumberList = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.REMARK:
                                            if (objectDetail[modelField]) {
                                                elasticObject.Remark = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.LOCK_STATUS_CONVERTED_VALUE:
                                            if (objectDetail.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code) {
                                                elasticObject.LockStatusConvertedValue = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.LOCKED_AT:
                                            if (objectDetail[modelField]) {
                                                elasticObject.LockedAt = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.LOCKED_BY:
                                            if (objectDetail[modelField]) {
                                                elasticObject.LockedBy = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.IS_VOIDED:
                                            elasticObject.IsPaymentVoidedConvertedValue = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.VOID_PAYMENT_REASON:
                                            if (objectDetail[modelField]) {
                                                if (objectDetail.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code) {
                                                    elasticObject.VoidPaymentReason = COMMON.createElasticOject(false,
                                                        null,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]);
                                                } else if (objectDetail.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code) {
                                                    elasticObject.VoidApplyCMReason = COMMON.createElasticOject(false,
                                                        null,
                                                        objectDetail[modelField],
                                                        objectDetail[modelField]);
                                                }
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.VOIDED_AT:
                                            if (objectDetail[modelField]) {
                                                elasticObject.VoidedAt = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.VOIDED_BY:
                                            if (objectDetail[modelField]) {
                                                elasticObject.VoidedBy = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.REF_VOIDED_PAYMENT_NO:
                                            if (objectDetail[modelField]) {
                                                let isSetHrefForRefVoidedPayNum = false;
                                                hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.CUSTOMER_PAYMENT.DETAIL_PAGE_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.REF_VOIDED_PAYMENT_ID];
                                                isSetHrefForRefVoidedPayNum = true;
                                                elasticObject.RefVoidedPaymentNumber = COMMON.createElasticOject(isSetHrefForRefVoidedPayNum,
                                                    isSetHrefForRefVoidedPayNum ? hrefUrl : null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.CREDIT_MEMO_NUMBER:
                                            if (objectDetail[modelField]) {
                                                hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.CUSTOMER_CREDIT_MEMO.CREDIT_MEMO_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.CREDIT_MEMO_ID];
                                                elasticObject.CreditMemoNumber = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.CREDIT_MEMO_DATE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.CreditMemoDate = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.PAYMENT_NUM_LIST_AGAINST_REFUND:
                                            if (objectDetail[modelField]) {
                                                elasticObject.PaymentNumberListAgainstRefund = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.CM_NUM_LIST_AGAINST_REFUND:
                                            if (objectDetail[modelField]) {
                                                elasticObject.CreditMemoNumberListAgainstRefund = COMMON.createElasticOject(false,
                                                    null,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.PAYMENT_MODE:
                                            if (objectDetail[modelField]) {
                                                elasticObject.RefPaymentMode = objectDetail[modelField];
                                            }
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CUSTOMER_PAYMENT_MASTER_FIELD.CREDIT_MEMO_ID:
                                            if (objectDetail[modelField]) {
                                                elasticObject.CustCreditMemoID = objectDetail[modelField];
                                            }
                                            break;
                                        default:
                                        // code block
                                    }
                                });
                                elasticObjectArray.push(elasticObject);
                            }
                        }
                    });
                    elasticObjectArray.forEach((detail) => {
                        responseModal.push(detail);
                    });
                }
                if (responseModal.length > 0) {
                    module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.CUSTOMER_PAYMENT, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                }
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },

    // Get details of chart of accounts and store into Elastic Search engine
    // GET : /api/enterprise_search/manageChartOfAccountsInElastic
    // @return chart of accounts details
    manageChartOfAccountsInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        const chartOfAccountModuleName = DATA_CONSTANT.CHART_OF_ACCOUNTS.NAME;
        const pWhereClause = {};
        const responseModal = [];

        pWhereClause.accountID = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;

        return sequelize.query('CALL Sproc_GetChartOfAccountsForElastic (:pID,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pID: pWhereClause.accountID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(chartOfAccountModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CHART_OF_ACCOUNT.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listObject = null;
                try {
                    listObject = JSON.parse(stringifyStr);
                } catch (e) {
                    listObject = true;
                }
                if (typeof (listObject) === 'object') {
                    listObject.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        const elasticObject = {
                            AccountID: null,
                            AccountName: null,
                            AccountCode: null,
                            AccountType: null,
                            IsSubAccount: null,
                            ParentAccountName: null,
                            SystemID: null,
                            Description: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteChartOfAccountsDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CHART_OF_ACCOUNTS.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.CHART_OF_ACCOUNTS.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CHART_OF_ACCOUNTS.ACCOUNT_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.CHART_OF_ACCOUNTS.CHART_OF_ACCOUNTS_URL;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]} ${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CHART_OF_ACCOUNTS.ACCOUNT_CODE]}`;
                                            elasticObject.AccountName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CHART_OF_ACCOUNTS.ACCOUNT_CODE:
                                            elasticObject.AccountCode = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CHART_OF_ACCOUNTS.ACCOUNT_TYPE:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.ACCOUNT_TYPE.ACCOUNT_TYPE_URL;
                                            elasticObject.AccountType = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CHART_OF_ACCOUNTS.IS_SUB_ACCOUNT:
                                            elasticObject.IsSubAccount = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CHART_OF_ACCOUNTS.PARENT_ACCOUNT_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.CHART_OF_ACCOUNTS.CHART_OF_ACCOUNTS_URL;
                                            elasticObject.ParentAccountName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CHART_OF_ACCOUNTS.SYSTEMID:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.CHART_OF_ACCOUNTS.CHART_OF_ACCOUNTS_URL;
                                            elasticObject.SystemID = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CHART_OF_ACCOUNTS.DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default: break;
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.CHART_OF_ACCOUNTS, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Chart of Account Detail
    deleteChartOfAccountsDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.CHART_OF_ACCOUNTS, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.CHART_OF_ACCOUNT.ID);
    },

    // Get details of account type and store into Elastic Search engine
    // GET : /api/enterprise_search/manageAccountTypeInElastic
    // @return account type details
    manageAccountTypeInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        const accountTypeModuleName = DATA_CONSTANT.ACCOUNT_TYPE.NAME;
        const pWhereClause = {};
        const responseModal = [];

        pWhereClause.classID = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;

        return sequelize.query('CALL Sproc_GetAccountTypeForElastic (:pID,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pID: pWhereClause.classID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(accountTypeModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.ACCOUNT_TYPE.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listObject = null;
                try {
                    listObject = JSON.parse(stringifyStr);
                } catch (e) {
                    listObject = true;
                }
                if (typeof (listObject) === 'object') {
                    listObject.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        const elasticObject = {
                            ClassID: null,
                            ClassName: null,
                            ClassCode: null,
                            IsSubType: null,
                            ParentClassName: null,
                            SystemID: null,
                            Description: null,
                            SystemGenerated: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteAccountTypeDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.ACCOUNT_TYPE.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.ACCOUNT_TYPE.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ACCOUNT_TYPE.CLASS_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.ACCOUNT_TYPE.ACCOUNT_TYPE_URL;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]} ${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.ACCOUNT_TYPE.CLASS_CODE]}`;
                                            elasticObject.ClassName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ACCOUNT_TYPE.CLASS_CODE:
                                            elasticObject.ClassCode = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ACCOUNT_TYPE.IS_SUB_TYPE:
                                            elasticObject.IsSubType = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ACCOUNT_TYPE.PARENT_CLASS_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.ACCOUNT_TYPE.ACCOUNT_TYPE_URL;
                                            elasticObject.ParentClassName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ACCOUNT_TYPE.SYSTEMID:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.ACCOUNT_TYPE.ACCOUNT_TYPE_URL;
                                            elasticObject.SystemID = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ACCOUNT_TYPE.DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.ACCOUNT_TYPE.SYSTEM_GENERATED:
                                            elasticObject.SystemGenerated = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default: break;
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.ACCOUNT_TYPE, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Account Type Detail
    deleteAccountTypeDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.ACCOUNT_TYPE, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.ACCOUNT_TYPE.ID);
    },

    // Get details of payment type category and store into Elastic Search engine
    // GET : /api/enterprise_search/managePaymentTypeCategoryInElastic
    // @return payment type category details
    managePaymentTypeCategoryInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        const paymentTypeCategoryModuleName = DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PaymentTypeCategory;
        const pWhereClause = {};
        const responseModal = [];

        pWhereClause.gencCategoryID = (req.params && (typeof (req.params) === 'object') && req.params.pId) ? req.params.pId : null;

        return sequelize.query('CALL Sproc_GetPaymentTypeCategoryForElastic (:pID,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pID: pWhereClause.gencCategoryID,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(paymentTypeCategoryModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.PAYMENT_TYPE_CATEGORY.ID);
            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listObject = null;
                try {
                    listObject = JSON.parse(stringifyStr);
                } catch (e) {
                    listObject = true;
                }
                if (typeof (listObject) === 'object') {
                    listObject.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        const elasticObject = {
                            PaymentTypeCategoryID: null,
                            PaymentTypeCategoryName: null,
                            PaymentTypeCategoryCode: null,
                            IsActive: null,
                            SystemGenerated: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteECODFMCategoryInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PAYMENT_TYPE_CATEGORY.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.PAYMENT_TYPE_CATEGORY.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PAYMENT_TYPE_CATEGORY.PAYMENT_TYPE_CATEGORY_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.GENERIC_CATEGORIES.PAYMENT_TYPE_CATEGORY_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PAYMENT_TYPE_CATEGORY.ID];
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]} ${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.PAYMENT_TYPE_CATEGORY.PAYMENT_TYPE_CATEGORY_CODE]}`;
                                            elasticObject.PaymentTypeCategoryName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PAYMENT_TYPE_CATEGORY.PAYMENT_TYPE_CATEGORY_CODE:
                                            elasticObject.PaymentTypeCategoryCode = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PAYMENT_TYPE_CATEGORY.IS_ACTIVE:
                                            elasticObject.IsActive = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.PAYMENT_TYPE_CATEGORY.SYSTEM_GENERATED:
                                            elasticObject.SystemGenerated = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default: break;
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.PAYMENT_TYPE_CATEGORY, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Payment Type Detail
    deletePaymentTypeCategoryDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.PAYMENT_TYPE_CATEGORY, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.PAYMENT_TYPE_CATEGORY.ID);
    },

    // Get list of Supplier Payment/Refund and store into Elastic Search engine
    // GET : /api/enterprise_search/manageSupplierPaymentAndRefundInElastic
    // @return List of Supplier Payment/Refund
    manageSupplierPaymentAndRefundInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        var supplierPaymentModuleName = DATA_CONSTANT.PACKING_SLIP.Supplier_Payment;
        var supplierRefundModuleName = DATA_CONSTANT.PACKING_SLIP.Supplier_Refund;
        var pWhereClause = { isDeleted: false };
        var responseModal = [];
        pWhereClause.id = (req.epSearchData && (typeof (req.epSearchData) === 'object') && req.epSearchData.InvPaymentMstID) ? req.epSearchData.InvPaymentMstID : null;
        pWhereClause.refPaymentMode = (req.params && (typeof (req.params) === 'object') && req.params.refPaymentMode) ? req.params.refPaymentMode : null;
        return sequelize.query('CALL Sproc_GetSupplierPaymentDetailsForElastic(:pPaymentMstID,:pRefPaymentMode,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pPaymentMstID: pWhereClause.id,
                pRefPaymentMode: pWhereClause.refPaymentMode,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((paymentDetails) => {
            if (!paymentDetails) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(pWhereClause.refPaymentMode === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable ? supplierPaymentModuleName : supplierRefundModuleName));
            }
            const suppPaymentEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.SUPPLIER_PAYMENT.ID);
            const suppRefundEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.SUPPLIER_REFUND.ID);
            const entityDet = pWhereClause.refPaymentMode === suppPaymentEntity.Parameter.refPaymentMode ? suppPaymentEntity : suppRefundEntity;
            if (isRequiredCount) {
                const totalCount = _.values(paymentDetails[0]) ? _.values(paymentDetails[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(paymentDetails);
                let listOjetct = null;
                try {
                    listOjetct = JSON.parse(stringifyStr);
                } catch (e) {
                    listOjetct = true;
                }
                if (typeof (listOjetct) === 'object') {
                    listOjetct.forEach((objectDetail) => {
                        var UI_URL = configData.ELASTIC_URL.UI_URL;
                        var elasticObject = {
                            Id: null,
                            RefPaymentMode: null,
                            TransactionModeName: null,
                            SystemId: null,
                            AccountReference: null,
                            MfgcodeID: null,
                            SupplierCodeName: null,
                            PaymentNumber: null,
                            PaymentType: null,
                            PaymentMethod: null,
                            SystemGeneratedPaymentMethod: null,
                            BankName: null,
                            BankAccountNo: null,
                            BankAccountMasID: null,
                            PaymentDate: null,
                            DepositBatchNumber: null,
                            Remark: null,
                            IsPaymentVoided: null,
                            IsPaymentVoidedConvertedValue: null,
                            VoidPaymentReason: null,
                            VoidedBy: null,
                            VoidedAt: null,
                            RefVoidedPaymentNumber: null,
                            RefVoidedPaymentId: null,
                            LockStatusConvertedValue: null,
                            LockedAt: null,
                            LockedBy: null,
                            InvoiceNumberList: null,
                            CreditMemoNumberList: null,
                            DebitMemoNumberList: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            module.exports.configureDefualtValue(elasticObject, objectDetail);
                            Object.keys(objectDetail).forEach((modelField) => {
                                let hrefUrl = UI_URL;
                                switch (modelField) {
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.ID:
                                        elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                        elasticObject.EntityId = objectDetail[modelField];
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.REF_PAYMENT_MODE:
                                        elasticObject.RefPaymentMode = objectDetail[modelField];
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.SUPPLIER_CODE_NAME:
                                        {
                                            const mfgMstId = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.MFGCODE_ID];
                                            const mfgName = objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.SUPPLIER_CODE_NAME];
                                            hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL + (mfgMstId);
                                            elasticObject.SupplierCodeName = COMMON.createElasticOject(true, hrefUrl, mfgName, mfgName);
                                            break;
                                        }
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.SYSTEM_ID:
                                        elasticObject.SystemId = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.DEPOSIT_BATCH_NUMBER:
                                        if (objectDetail[modelField]) {
                                            elasticObject.DepositBatchNumber = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.PAYMENT_NUMBER:
                                        elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                        if (objectDetail.refPaymentMode === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable) {
                                            hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.SUPPLIER_PAYMENT.SUPPLIER_PAYMENT_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.ID];
                                            elasticObject.PaymentNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        } else if (objectDetail.refPaymentMode === DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund) {
                                            hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.SUPPLIER_REFUND.SUPPLIER_REFUND_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.ID];
                                            elasticObject.PaymentNumber = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.BANK_NAME:
                                        if (objectDetail[modelField]) {
                                            elasticObject.BankName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.BANK_ACCOUNT_NO:
                                        if (objectDetail[modelField]) {
                                            elasticObject.BankAccountNo = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.PAYMENT_TYPE:
                                        elasticObject.PaymentType = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.PAYMENT_METHOD:
                                        if (objectDetail[modelField]) {
                                            let isSetHrefForPayMethod = false;
                                            if (!objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.SYSTEM_GENERATED_PAYMENT_METHOD]) {
                                                let paymentMethodUrl = null;
                                                if (objectDetail.refPaymentMode === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable) {
                                                    paymentMethodUrl = DATA_CONSTANT.ELASTIC_URL.PAYMENT_METHODS.PAYABLE;
                                                } else if (objectDetail.refPaymentMode === DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund) {
                                                    paymentMethodUrl = DATA_CONSTANT.ELASTIC_URL.PAYMENT_METHODS.RECEIVABLE;
                                                }
                                                hrefUrl = hrefUrl + paymentMethodUrl + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.PAYMENT_TYPE];
                                                isSetHrefForPayMethod = true;
                                            }
                                            elasticObject.PaymentMethod = COMMON.createElasticOject(isSetHrefForPayMethod,
                                                isSetHrefForPayMethod ? hrefUrl : null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.PAYMENT_DATE:
                                        elasticObject.PaymentDate = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField], COMMON.DATEFORMAT_COMMON);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.ACCOUNT_REFERENCE:
                                        hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.SUPPLIER_PAYMENT.SUPPLIER_DETAILS_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.MFGCODE_ID];
                                        elasticObject.AccountReference = COMMON.createElasticOject(true,
                                            hrefUrl,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.TRANSACTION_MODE_NAME:
                                        if (objectDetail[modelField]) {
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.TRANSACTION_MODES.RECEIVABLE_TRANSACTION_MODES;
                                            elasticObject.TransactionModeName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.REMARK:
                                        if (objectDetail[modelField]) {
                                            elasticObject.Remark = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.LOCK_STATUS_CONVERTED_VALUE:
                                        elasticObject.LockStatusConvertedValue = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.LOCKED_AT:
                                        if (objectDetail[modelField]) {
                                            elasticObject.LockedAt = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.LOCKED_BY:
                                        if (objectDetail[modelField]) {
                                            elasticObject.LockedBy = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.IS_PAYMENT_VOIDED_CONVERTED_VALUE:
                                        elasticObject.IsPaymentVoidedConvertedValue = COMMON.createElasticOject(false,
                                            null,
                                            objectDetail[modelField],
                                            objectDetail[modelField]);
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.VOID_PAYMENT_REASON:
                                        if (objectDetail[modelField]) {
                                            elasticObject.VoidPaymentReason = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.VOIDED_AT:
                                        if (objectDetail[modelField]) {
                                            elasticObject.VoidedAt = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.VOIDED_BY:
                                        if (objectDetail[modelField]) {
                                            elasticObject.VoidedBy = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.REF_VOIDED_PAYMENT_NO:
                                        if (objectDetail[modelField]) {
                                            let isSetHrefForRefVoidedPayNum = true;
                                            hrefUrl = hrefUrl + DATA_CONSTANT.ELASTIC_URL.SUPPLIER_PAYMENT.SUPPLIER_PAYMENT_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.REF_VOIDED_PAYMENT_ID];
                                            isSetHrefForRefVoidedPayNum = true;
                                            elasticObject.RefVoidedPaymentNumber = COMMON.createElasticOject(isSetHrefForRefVoidedPayNum,
                                                isSetHrefForRefVoidedPayNum ? hrefUrl : null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.INVOICE_NUM_LIST:
                                        if (objectDetail[modelField]) {
                                            elasticObject.InvoiceNumberList = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.CREDIT_MEMO_NUM_LIST:
                                        if (objectDetail[modelField]) {
                                            elasticObject.CreditMemoNumberList = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    case DATA_CONSTANT.ELASTIC_MODELS.SUPPLIER_PAYMENT_AND_REFUND_FIELD.DEBIT_MEMO_NUM_LIST:
                                        if (objectDetail[modelField]) {
                                            elasticObject.DebitMemoNumberList = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                        }
                                        break;
                                    default:
                                        // code block
                                        break;
                                }
                            });
                            responseModal.push(elasticObject);
                        }
                    });
                }
                const modalMasterType = pWhereClause.refPaymentMode === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable ? DATA_CONSTANT.MODLE_MASTER_TYPE.SUPPLIER_PAYMENT : DATA_CONSTANT.MODLE_MASTER_TYPE.SUPPLIER_REFUND;
                module.exports.ManageDetailInQueue(req, modalMasterType, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },

    // Get details of Transaction Mode and store into Elastic Search engine
    // GET : /api/enterprise_search/manageTransactionModesInElastic
    // @return Transaction Mode details
    manageTransactionModesInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        const transactionModeModuleName = DATA_CONSTANT.TRANSACTION_MODE.Name;
        const pWhereClause = {};
        const responseModal = [];

        pWhereClause.id = (req.params && (typeof (req.params) === 'object') && req.params.id) ? req.params.id : null;
        pWhereClause.modeType = (req.params && (typeof (req.params) === 'object') && req.params.modeType) ? req.params.modeType : null;

        return sequelize.query('CALL Sproc_GetTransactionModesForElastic (:pID,:pmodeType,:pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pID: pWhereClause.id,
                pmodeType: pWhereClause.modeType,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(transactionModeModuleName));
            }
            const paybleTrancModeEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.TRANSACTIONMODE_MST.ID);
            const receivableTrancModeEntity = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.RECEIVABLE_TRANSACTIONMODE_MST.ID);
            const entityDet = pWhereClause.modeType === paybleTrancModeEntity.Parameter.modeType ? paybleTrancModeEntity : receivableTrancModeEntity;

            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listObject = null;
                try {
                    listObject = JSON.parse(stringifyStr);
                } catch (e) {
                    listObject = true;
                }
                if (typeof (listObject) === 'object') {
                    listObject.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        const elasticObject = {
                            ID: null,
                            ModeName: null,
                            ModeType: null,
                            ModeCode: null,
                            Description: null,
                            IsActive: null,
                            SystemGenerated: null,
                            Acct_Name: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteTransactionModesDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.TRANSACTION_MODE.ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRANSACTION_MODE.ID:
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            elasticObject.EntityId = objectDetail[modelField];
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRANSACTION_MODE.MODE_TYPE: {
                                            elasticObject.ModeType = objectDetail[modelField];
                                            break;
                                        }
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRANSACTION_MODE.MODE_NAME:
                                            hrefUrl += pWhereClause.modeType === DATA_CONSTANT.ELASTIC_ENTITY[66].Parameter.modeType ? DATA_CONSTANT.ELASTIC_URL.TRANSACTION_MODES.RECEIVABLE_TRANSACTION_MODES : DATA_CONSTANT.ELASTIC_URL.TRANSACTION_MODES.PAYABLE_TRANSACTION_MODES;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[modelField]}`;
                                            elasticObject.ModeName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRANSACTION_MODE.MODE_CODE:
                                            elasticObject.ModeCode = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRANSACTION_MODE.DESCRIPTION:
                                            elasticObject.Description = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRANSACTION_MODE.IS_ACTIVE:
                                            elasticObject.IsActive = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRANSACTION_MODE.SYSTEM_GENERATED:
                                            elasticObject.SystemGenerated = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.TRANSACTION_MODE.ACCT_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.CHART_OF_ACCOUNTS.CHART_OF_ACCOUNTS_URL;
                                            elasticObject.Acct_Name = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default: break;
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.TRANSACTION_MODE, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Transaction Mode Detail
    deleteTransactionModesDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.TRANSACTION_MODE, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.TRANSACTIONMODE_MST.ID);
    },

    // Get details of Contact Person and store into Elastic Search engine
    // GET : /api/enterprise_search/manageContactPersonInElastic
    // @return Contact Person details
    manageContactPersonInElastic: (req, res, isRequiredCount) => {
        const { sequelize } = req.app.locals.models;
        const contactPersoneModuleName = DATA_CONSTANT.CUSTOMER_CONTACTPERSON.NAME;
        const pWhereClause = {};
        const responseModal = [];
        pWhereClause.personId = (req.params && (typeof (req.params) === 'object') && req.params.personId) ? req.params.personId : null;

        return sequelize.query('CALL Sproc_GetContactPersonForElastic (:pID, :pFromdate,:pTodate,:pRequiredCount)', {
            replacements: {
                pID: pWhereClause.personId,
                pFromdate: req.body.fromDate || null,
                pTodate: req.body.toDate || null,
                pRequiredCount: isRequiredCount || false
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (!response) {
                return Promise.reject(MESSAGE_CONSTANT.NOT_FOUND(contactPersoneModuleName));
            }
            const entityDet = module.exports.getEntityJsonDetail(COMMON.AllEntityIDS.CONTACTPERSON.ID);

            if (isRequiredCount) {
                const totalCount = _.values(response[0]) ? _.values(response[0])[0] : 0;
                const objectType = {
                    key: entityDet.Type,
                    typeID: entityDet.TypeID,
                    count: totalCount
                };
                return Promise.resolve(objectType);
            } else {
                const stringifyStr = JSON.stringify(response);
                let listObject = null;
                try {
                    listObject = JSON.parse(stringifyStr);
                } catch (e) {
                    listObject = true;
                }
                if (typeof (listObject) === 'object') {
                    listObject.forEach((objectDetail) => {
                        const UI_URL = configData.ELASTIC_URL.UI_URL;
                        const elasticObject = {
                            PersonId: null,
                            RefEntityType: null,
                            RefName: null,
                            Personnels: null,
                            FirstName: null,
                            MiddleName: null,
                            LastName: null,
                            Email: null,
                            CpTitle: null,
                            Division: null,
                            IsDefault: null,
                            IsPrimary: null,
                            AdditionalComment: null,
                            SystemGenerated: null,
                            Status: null,
                            PhoneNumbers: null,
                            Type: entityDet.Type,
                            TypeID: entityDet.TypeID,
                            EntityId: null,
                            CreatedAt: null,
                            UpdatedAt: null
                        };
                        if (typeof (objectDetail) === 'object') {
                            if (objectDetail.isDeleted) {
                                module.exports.deleteContactPersonDetailInElastic(objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.PERSON_ID]);
                            } else {
                                module.exports.configureDefualtValue(elasticObject, objectDetail);
                                Object.keys(objectDetail).forEach((modelField) => {
                                    let hrefUrl = UI_URL;
                                    switch (modelField) {
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.PERSON_ID:
                                            elasticObject.EntityId = objectDetail[modelField];
                                            elasticObject.Id = `${entityDet.EntityPrefix}${objectDetail[modelField]}`;
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.FIRST_NAME:
                                            hrefUrl += DATA_CONSTANT.ELASTIC_URL.CONTACT_PERSON.CONTACT_PERSON;
                                            elasticObject.Title = `${entityDet.Title} ${objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.FULL_NAME]}`;
                                            elasticObject.FirstName = COMMON.createElasticOject(true,
                                                hrefUrl,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.LAST_NAME:
                                            elasticObject.LastName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.MIDDLE_NAME:
                                            elasticObject.MiddleName = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.EMAIL:
                                            elasticObject.Email = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.TITLE:
                                            elasticObject.CpTitle = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.DIVISION:
                                            elasticObject.Division = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.IS_DEFAULT:
                                            elasticObject.IsDefault = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.IS_PRIMARY:
                                            elasticObject.IsPrimary = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.ADDITIONAL_COMMENT:
                                            elasticObject.AdditionalComment = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.SYSTEM_GENERATED:
                                            elasticObject.SystemGenerated = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.REF_ENTITY_TYPE:
                                            {
                                                let hrefUrlForRefEntityType = (objectDetail[modelField] === DATA_CONSTANT.CONTACT_PERSON_REF_TYPES.Manufacturer ? DATA_CONSTANT.ELASTIC_URL.CONTACT_PERSON.MANUFACTURER : (objectDetail[modelField] === DATA_CONSTANT.CONTACT_PERSON_REF_TYPES.Supplier ? DATA_CONSTANT.ELASTIC_URL.CONTACT_PERSON.SUPPLIER : (objectDetail[modelField] === DATA_CONSTANT.CONTACT_PERSON_REF_TYPES.Personnel ? DATA_CONSTANT.ELASTIC_URL.CONTACT_PERSON.EMPLOYEE : null)));
                                                hrefUrlForRefEntityType = hrefUrlForRefEntityType ? (hrefUrl + hrefUrlForRefEntityType) : null;
                                                elasticObject.RefEntityType = COMMON.createElasticOject(true,
                                                    hrefUrlForRefEntityType,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                                break;
                                            }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.REF_NAME:
                                            {
                                                let hrefUrlForRefEntityType = (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.REF_ENTITY_TYPE] === DATA_CONSTANT.CONTACT_PERSON_REF_TYPES.Manufacturer ? DATA_CONSTANT.ELASTIC_URL.PART_MASTER.MANUFACTURER_URL : (objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.REF_ENTITY_TYPE] === DATA_CONSTANT.CONTACT_PERSON_REF_TYPES.Supplier ? DATA_CONSTANT.ELASTIC_URL.PART_MASTER.SUPPLIER_URL : null));
                                                hrefUrlForRefEntityType = hrefUrlForRefEntityType ? (hrefUrl + hrefUrlForRefEntityType + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.REF_TRANS_ID]) : null;
                                                elasticObject.RefName = COMMON.createElasticOject(true,
                                                    hrefUrlForRefEntityType,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                                break;
                                            }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.PERSONNELS:
                                            {
                                                hrefUrl += DATA_CONSTANT.ELASTIC_URL.PERSONAL.PERSONAL_URL + objectDetail[DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.REF_TRANS_ID];
                                                elasticObject.Personnels = COMMON.createElasticOject(true,
                                                    hrefUrl,
                                                    objectDetail[modelField],
                                                    objectDetail[modelField]);
                                                break;
                                            }
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.STATUS:
                                            elasticObject.Status = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        case DATA_CONSTANT.ELASTIC_MODELS.CONTACT_PERSON.PHONE_NUMBER_LIST:
                                            elasticObject.PhoneNumbers = COMMON.createElasticOject(false,
                                                null,
                                                objectDetail[modelField],
                                                objectDetail[modelField]);
                                            break;
                                        default:
                                            break;
                                    }
                                });
                                responseModal.push(elasticObject);
                            }
                        }
                    });
                }
                module.exports.ManageDetailInQueue(req, DATA_CONSTANT.MODLE_MASTER_TYPE.CONTACT_PERSON, DATA_CONSTANT.ACTION_TYPE.MANAGE, responseModal);
                if (res) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseModal, null);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (res) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return Promise.resolve();
        });
    },
    // Delete Contact Person Detail
    deleteContactPersonDetailInElastic: (ids) => {
        module.exports.ManageDetailInQueue(null, DATA_CONSTANT.MODLE_MASTER_TYPE.CONTACT_PERSON, DATA_CONSTANT.ACTION_TYPE.DELETE, null, ids, COMMON.AllEntityIDS.CONTACTPERSON.ID);
    }
};