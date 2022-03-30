const _ = require('lodash');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT, ELASTIC_ENTITY } = require('../../../constant');
const { IDENTITY_SERVER } = require('../../../constant/data_constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const resHandler = require('../../resHandler');
const https = require('https');
const { identity_server } = require('../../../config/config');
//const jsonfile = require('jsonfile');
const componentModuleName = DATA_CONSTANT.COMPONENT.Name;

module.exports = {
    generateUMIDCofCDocument: (req, res) => {
        const { sequelize, GenericFiles } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetUMIDDocumentListForCOFC ()', {}).then((response) => {
            const filePromise = [];
            // const createdBy = COMMON.getRequestUserID(req);
            // const createByRoleId = COMMON.getRequestUserLoginRoleID(req);
            _.each(response, (item) => {
                const fileName = `${uuidv1()}.${item.gencFileExtension}`;
                const gencOriginalName = `${item.uid}-${new Date().getTime()}.${item.gencFileExtension}`;
                const genFilePath = `/uploads/genericfiles/UMID/2020/${item.uid}/${item.refTransID}/${fileName}`;
                fs.copyFileSync(`.${item.genFilePath}`, `.${genFilePath}`);
                filePromise.push(
                    GenericFiles.create({
                        gencFileName: fileName,
                        gencOriginalName: gencOriginalName,
                        gencFileExtension: item.gencFileExtension,
                        gencFileType: item.gencFileType,
                        tags: 'Auto From Utility',
                        isDefault: item.isDefault,
                        refTransID: item.refTransID,
                        uid: item.uid,
                        entityID: item.entityID,
                        gencFileOwnerType: item.gencFileOwnerType,
                        isActive: true,
                        genFilePath: genFilePath,
                        isShared: item.isShared,
                        fileGroupBy: item.cOfcFileGroup,
                        fileSize: item.fileSize,
                        createdBy: item.createdBy,
                        createByRoleId: item.createByRoleId,
                        createdAt: COMMON.getCurrentUTC(),
                        isRecycle: false
                    })
                );
            });
            return Promise.all(filePromise).then(() =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
            ).catch((err) => {
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
    },

    // Update Component data with replace (#) character with (+)
    // POST : /api/v1/utility/updateComponentDocumentPath
    // @return Update Component data with replace (#) character with (+)
    updateComponentDocumentPath: (req, res) => {
        const { Component, sequelize } = req.app.locals.models;
        const componentImagesName = DATA_CONSTANT.COMPONENT_IMAGES_NAME.Name;
        return Component.findAll({
            where: {
                documentPath: { [Op.like]: '%#%' },
                isDeleted: false
            },
            attributes: ['id', 'documentPath']
        }).then((documentPathList) => {
            var filePromises = [];
            if (documentPathList && Array.isArray(documentPathList) && documentPathList.length === 0) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(componentImagesName));
            }
            documentPathList = _.map(documentPathList, item => item.dataValues);
            const genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;
            _.each(documentPathList, (pathDetail) => {
                if (pathDetail && pathDetail.documentPath) {
                    const partArry = pathDetail.documentPath.split('/');
                    partArry.pop();
                    const oldPath = `${genFilePath}${partArry.join('/')}`;
                    partArry[2] = partArry[2].replace('#', '+');
                    let newPath = partArry.join('/');
                    newPath = `${genFilePath}${newPath}`;
                    if (fs.existsSync(oldPath)) {
                        filePromises.push(fs.renameSync(oldPath, newPath), (error) => {
                            if (error) {
                                return STATE.FAILED;
                            }
                            return STATE.SUCCESS;
                        });
                    }
                }
            });

            return Promise.all(filePromises).then((response) => {
                var promises = [];
                const statusDetail = response.find(item => item === STATE.FAILED);
                if (!statusDetail) {
                    return sequelize.transaction().then((t) => {
                        _.each(documentPathList, (componentDet) => {
                            if (componentDet && componentDet.documentPath) {
                                const path = componentDet.documentPath.replace('#', '+');
                                const componentObj = {
                                    documentPath: path
                                };
                                promises.push(
                                    Component.update(componentObj, {
                                        where: {
                                            id: componentDet.id
                                        },
                                        transaction: t
                                    }).then(() => ({
                                        status: STATE.SUCCESS
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return {
                                            status: STATE.FAILED,
                                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            error: err
                                        };
                                    })
                                );
                            }
                        });

                        return Promise.all(promises).then((resp) => {
                            var responseStatus = _.find(resp, item => item.status === STATE.FAILED);

                            if (!responseStatus) {
                                t.commit();
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(componentImagesName));
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                    messageContent: MESSAGE_CONSTANT.NOT_CREATED('Name'),
                                    err: null,
                                    data: null
                                });
                            }
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Get List of Components
    // POST : /api/v1/component/retrieveComponentList
    // @return List of Components
    retrieveComponentList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var srtWhereMfgPn = '';
        var strWhere = '';
        var dataObject = '';
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            if (filter.where.mfgPN) {
                srtWhereMfgPn = COMMON.stringFormat('(`{0}` like \'{1}\'', 'mfgPN', filter.where.mfgPN['$like'].replace(/'/g, '\'\''));
                srtWhereMfgPn += COMMON.stringFormat(' OR exists (select 1 from component_otherpn opn where opn.refcomponentid = c.id and opn.name like \'{0}\' ))', filter.where.mfgPN['$like'].replace(/'/g, '\'\''));
                delete filter.where.mfgPN;
            }
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (srtWhereMfgPn !== '') {
                strWhere = strWhere + (strWhere === '' ? '' : ' AND ') + srtWhereMfgPn;
            }
            if (strWhere === '') {
                strWhere = null;
            }

            // Save part list search pattern
            req.body.order = filter.strOrderBy;
            req.body.where = filter.strWhere;
            // module.exports.savePartListSearchPatternFollowedByUser(req, res);

            return sequelize
                .query('CALL Sproc_GetComponentList_SP (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pIsMFG,:pMfgCodeIDs,:pMfgCodeIdsForSupplierParts,:pPackagingIDs,:pPackageIDs,:pPartStatusIDs,:pMountingTypeIDs,:pExternalMountingTypeValues,:pFunctionalTypeIDs,:pExternalFunctionalTypeValues,:pAttributesSearchHeader,:pAttributesSearch,:pPackagingAlias,:pAlternatePart,:pRoHSAlternatePart,:pPartUsedInAssembly,:pMultiplePartNumbers,:pStockQuantity,:pPartTypeIDs,:pCertificateStandardsIds,:pStandardsClassIds,:pAssemblyIds,:pAssemblyTypeIds,:pRohsIds,:pExternalRoHSStatusListValues,:pOperationalAttributeIds,:pAcceptableShippingCountryIds,:pComponentOrdering,:pComponentUsageCriteria,:pIsRefreshMasterFilters,:pFromDate,:pToDate,:pIsReversal,:pIsCPN,:pIsCustom,:pIsBOMActivityStarted,:pIsEcoDfmColumnVisible,:pIsSearchFromHeader,:pIsExportControl,:pObsoleteDate,:pIsOperatingTemperatureBlank,:pFromCreatedOnDate,:pToCreatedOnDate,:pIsIdenticalMfrPN,:pIsProductionPNEmpty,:pDisapprovedSupplierIds,:pIsExcludeIncorrectPart,:pMultiplePartFilterFieldName,:pMultiplePartByUploadFileDetail,:pIsRestrictUSEwithpermission,:pIsRestrictPackagingUseWithpermission,:pIsRestrictUsePermanently,:pIsRestrictPackagingUsePermanently )', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: req.body.isExport ? null : filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pIsMFG: req.body.isMFG ? true : false,
                        pMfgCodeIDs: req.body.mfgCodeIds ? req.body.mfgCodeIds : null,
                        pMfgCodeIdsForSupplierParts: req.body.mfgCodeIdsForSupplierParts ? req.body.mfgCodeIdsForSupplierParts : null,
                        pPackagingIDs: req.body.packagingIds ? req.body.packagingIds : null,
                        pPackageIDs: req.body.packageIds ? req.body.packageIds : null,
                        pPartStatusIDs: req.body.partStatusIds ? req.body.partStatusIds : null,
                        pMountingTypeIDs: req.body.mountingTypeIds ? req.body.mountingTypeIds : null,
                        pExternalMountingTypeValues: req.body.externalMountingTypeValues ? req.body.externalMountingTypeValues : null,
                        pFunctionalTypeIDs: req.body.functionalTypeIds ? req.body.functionalTypeIds : null,
                        pExternalFunctionalTypeValues: req.body.externalFunctionalTypeValues ? req.body.externalFunctionalTypeValues : null,
                        pAttributesSearchHeader: req.body.attributesSearchHeader ? req.body.attributesSearchHeader : null,
                        pAttributesSearch: req.body.attributesSearch ? req.body.attributesSearch : null,
                        pPackagingAlias: req.body.packagingAlias ? req.body.packagingAlias : null,
                        pAlternatePart: req.body.alternatePart ? req.body.alternatePart : null,
                        pRoHSAlternatePart: req.body.roHSAlternatePart ? req.body.roHSAlternatePart : null,
                        pPartUsedInAssembly: req.body.partUsedInAssembly ? req.body.partUsedInAssembly : null,
                        pMultiplePartNumbers: req.body.multiplePartNumbers ? req.body.multiplePartNumbers : null,
                        pStockQuantity: req.body.stockQuantity ? req.body.stockQuantity : null,
                        pPartTypeIDs: req.body.partTypeIds ? req.body.partTypeIds : null,
                        pCertificateStandardsIds: req.body.certificateStandardsIds ? req.body.certificateStandardsIds : null,
                        pStandardsClassIds: req.body.standardsClassIds ? req.body.standardsClassIds : null,
                        pAssemblyIds: req.body.assemblyIds ? req.body.assemblyIds : null,
                        pAssemblyTypeIds: req.body.assemblyTypeIds ? req.body.assemblyTypeIds : null,
                        pRohsIds: req.body.rohsIds ? req.body.rohsIds : null,
                        pExternalRoHSStatusListValues: req.body.externalRoHSStatusListValues ? req.body.externalRoHSStatusListValues : null,
                        pOperationalAttributeIds: req.body.operationalAttributeIds ? req.body.operationalAttributeIds : null,
                        pAcceptableShippingCountryIds: req.body.acceptableShippingCountryIds ? req.body.acceptableShippingCountryIds : null,
                        pComponentOrdering: req.body.componentOrdering ? req.body.componentOrdering : null,
                        pComponentUsageCriteria: req.body.componentUsageCriteria ? req.body.componentUsageCriteria : null,
                        pIsRefreshMasterFilters: req.body.isRefreshMasterFilters ? true : false,
                        pFromDate: req.body.fromDate ? req.body.fromDate : null,
                        pToDate: req.body.toDate ? req.body.toDate : null,
                        pIsReversal: req.body.isReversal ? true : false,
                        pIsCPN: req.body.isCPN ? true : false,
                        pIsCustom: req.body.isCustom ? true : false,
                        pIsBOMActivityStarted: req.body.isBOMActivityStarted ? true : false,
                        pIsEcoDfmColumnVisible: req.body.isEcoDfmColumnVisible ? true : false,
                        pIsSearchFromHeader: req.body.isSearchFromHeader ? true : false,
                        pIsExportControl: req.body.isExportControl ? true : false,
                        pObsoleteDate: req.body.obsoleteDate ? req.body.obsoleteDate : null,
                        pIsOperatingTemperatureBlank: req.body.isOperatingTemperatureBlank ? true : false,
                        pFromCreatedOnDate: req.body.fromCreatedOnDate ? req.body.fromCreatedOnDate : null,
                        pToCreatedOnDate: req.body.toCreatedOnDate ? req.body.toCreatedOnDate : null,
                        pIsIdenticalMfrPN: req.body.isIdenticalMfrPN ? true : false,
                        pIsProductionPNEmpty: req.body.isProductionPNEmpty ? true : false,
                        pDisapprovedSupplierIds: req.body.disapprovedSupplierIds ? req.body.disapprovedSupplierIds : null,
                        pIsExcludeIncorrectPart: req.body.isExcludeIncorrectPart ? req.body.isExcludeIncorrectPart : false,
                        pMultiplePartFilterFieldName: req.body.multiplePartFilterFieldName ? req.body.multiplePartFilterFieldName : null,
                        pMultiplePartByUploadFileDetail: req.body.multiplePartByUploadFileDetail ? req.body.multiplePartByUploadFileDetail : null,
                        pIsRestrictUSEwithpermission: req.body.restrictUSEwithpermission ? true : false,
                        pIsRestrictPackagingUseWithpermission: req.body.restrictPackagingUseWithpermission ? true : false,
                        pIsRestrictUsePermanently: req.body.restrictUsePermanently ? true : false,
                        pIsRestrictPackagingUsePermanently: req.body.restrictPackagingUsePermanently ? true : false,
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    if (response) {
                        dataObject = {
                            components: _.values(response[1]),
                            Count: response[0][0] ? response[0][0]['totalCount'] : 0,
                            FilterValues: _.values(response[2]),
                            GroupingWiseList: _.values(response[3])
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

    // Update Users With UserID
    // POST : /api/v1/utility/updateUsersWithUserID
    // @return failed users entry
    updateUsersWithUserID: (req, res) => {
        try {
            const { User, sequelize } = req.app.locals.models;

            User.findAll({
                where: {
                    IdentityUserId: null
                },
                attributes: ['id', 'username', 'IdentityUserId', 'employeeID', 'passwordDigest', 'defaultLoginRoleID', 'emailAddress', 'password']
            }).then((findUser) => {
                const userList = [];
                if (findUser.length > 0) {
                    _.map(findUser, (user) => {
                        const userDetailForIDS = {
                            Username: user.dataValues.username,
                            Password: user.dataValues.passwordDigest,
                            Email: user.dataValues.emailAddress,
                            Id: user.dataValues.id

                        };
                        userList.push(userDetailForIDS);
                    });
                }

                module.exports.registerExsistingUserFromFJT(userList, req).then((resp) => {
                    const response = JSON.parse(resp);
                    if (response.entryStatus) {
                        return sequelize.transaction().then((t) => {
                            const promises = [];
                            _.forEach(response.sucessUser, (user) => {
                                promises.push(
                                    User.update({ IdentityUserId: user.IdentityId }, {
                                        where: {
                                            id: user.userId
                                        },
                                        fields: ['IdentityUserId']
                                    })
                                );
                            });

                            return Promise.all(promises).then(() => {
                                t.commit();
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, 'User Migration Successfull', null);
                            });
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, 'Server side error', null);
                    }
                });
            });
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        }
    },

    // Register Users With Identity server
    // POST : https://localhost:44372/verification/RegisterExsistingUserFromFJT
    // @return failed users entry if any
    registerExsistingUserFromFJT: (body, req) => {
        https.globalAgent.options.rejectUnauthorized = false;
        const HEADER = { ...identity_server.HEADER }; // , 'Authorization': req.headers.authorization };

        return new Promise((resolve) => {
            var options = {
                method: IDENTITY_SERVER.REGISTER_EXSISTING_USER_ON_IDENTITY_SERVER.METHOD,
                host: identity_server.HOST,
                port: identity_server.PORT,
                path: identity_server.IdentityPrefix + IDENTITY_SERVER.REGISTER_EXSISTING_USER_ON_IDENTITY_SERVER.PATH,
                headers: HEADER,
                strictSSL: false
            };

            callback = function (response) {
                var str = '';
                response.on('data', (chunk) => {
                    str += chunk;
                });

                response.on('end', () => {
                    resolve(str);
                });
            };

            var req = https.request(options, callback);
            req.write(JSON.stringify(body));
            req.on('error', (err) => {
                const res = { status: STATE.FAILED, message: err.toString() };
                resolve(res);
            });
            req.end();
        });
    },

    getSystemIdPromise: (req, res, systemIdType, t) => {
        const { sequelize } = req.app.locals.models;

        if (req.body && systemIdType) {
            return sequelize.query('CALL Sproc_GenerateIncrementalNumber(:pType,:pIsResInTempTable)', {
                replacements: {
                    pType: systemIdType,
                    pIsResInTempTable: false
                },
                transaction: t,
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response) {
                    if (response[0] && response[0][0] && response[0][0].message) {
                        if (response[0][0].message === DATA_CONSTANT.CHART_OF_ACCOUNTS_ERROR_TYPES.TYPE_NOT_EXISTS) {
                            const messageObj = Object.assign({}, MESSAGE_CONSTANT.MASTER.SYSTEMTYPE_NOT_EXISTS);
                            messageObj.message = COMMON.stringFormat(messageObj.message, systemIdType);
                            return {
                                status: STATE.FAILED,
                                message: messageObj
                            };
                        }
                    }
                    return {
                        status: STATE.SUCCESS,
                        systemId: response[0][0].systemID
                    };
                } else {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err && err.parent && err.parent.errno === 1205) {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.GLOBAL.DB_TRANSACTION_LOCKED_MESSAGE,
                        err: null
                    };
                } else {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err
                    };
                }
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    // rename old work order number folder with new series number
    // POST : /api/v1/utility/updateOldWONumberFolderWithNewFolderNumber
    // @return success or fail state for rename folder
    updateOldWONumberFolderWithNewFolderNumber: (req, res) => {
        try {
            const { Workorder } = req.app.locals.models;
            return Workorder.findAll({
                where: {
                    isDeleted: false,
                    documentPath: { [Op.ne]: null },
                    documentPathOld: { [Op.ne]: null }
                },
                attributes: ['woID', 'documentPath', 'documentPathOld']
            }).then((woDocPathList) => {
                if (!woDocPathList || woDocPathList.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.STATICMSG('Total(0) work order number folder(s) renamed successfully.'));
                }
                let totalRenamedFolder = 0;
                woDocPathList = _.map(woDocPathList, item => item.dataValues);
                const genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;
                _.each(woDocPathList, (pathDetail) => {
                    if (pathDetail && pathDetail.documentPathOld && pathDetail.documentPath) {
                        let oldFolderPath = `${genFilePath}${pathDetail.documentPathOld}/`;
                        if (fs.existsSync(oldFolderPath)) {
                            const oldDocumentPathArray = pathDetail.documentPathOld.split('/');
                            oldDocumentPathArray.pop();
                            oldFolderPath = `${genFilePath}${oldDocumentPathArray.join('/')}`;

                            const newDocumentPathArray = pathDetail.documentPath.split('/');
                            newDocumentPathArray.pop();
                            const newFolderPath = `${genFilePath}${newDocumentPathArray.join('/')}`;

                            fs.renameSync(oldFolderPath, newFolderPath);
                            totalRenamedFolder += 1;
                        }
                    }
                });
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.STATICMSG(`Total-(${totalRenamedFolder}) work order number folder(s) renamed successfully.`));
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } catch (err) {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        }
    },

    // Update Packaging Alias while restrict part
    updatePendingDataInElastic: (req, res) => {
        const { sequelize, PendingElasticEntitySyncData } = req.app.locals.models;
        return PendingElasticEntitySyncData.findAll().then((pendingEntityDet) => {
            if (Array.isArray(pendingEntityDet) && pendingEntityDet.length > 0) {
                const promisesUpdate = [];
                return sequelize.transaction().then((t) => {
                    pendingEntityDet.forEach((objectDetail) => {
                        const entityDet = ELASTIC_ENTITY[objectDetail.entityID];
                        if (entityDet && typeof (EnterpriseSearchController[entityDet.FunctionName]) === 'function') {
                            const entityParamDet = JSON.parse(objectDetail.entityParamDet);
                            req.params = entityParamDet;
                            req.body = entityParamDet;
                            Object.assign(req, entityParamDet);
                            EnterpriseSearchController[entityDet.FunctionName](req);

                            promisesUpdate.push(PendingElasticEntitySyncData.destroy({
                                where: {
                                    id: objectDetail.id
                                },
                                transaction: t
                            }).then((rowsUpdated) => {
                                if (rowsUpdated) {
                                    return {
                                        status: STATE.SUCCESS
                                    };
                                } else {
                                    return {
                                        status: STATE.FAILED
                                    };
                                }
                            }).catch((err) => {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    error: err
                                };
                            }));
                        } else {
                            return {
                                status: STATE.FAILED
                            };
                        }
                    });
                    return Promise.all(promisesUpdate).then((response) => {
                        var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                        if (resObj) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                // err: err,
                                data: null
                            });
                        } else {
                            return t.commit(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(componentModuleName)));
                        }
                    }).catch((err) => {
                        if (!t.finished) {
                            t.rollback();
                        }
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
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(componentModuleName));
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

    //testLockTransaction: (req, res) => {
    //    const { sequelize } = req.app.locals.models;
    //    let t1 = sequelize.transaction();
    //    try {
    //        sequelize.query('select * from salesordermst').then((response) => {
    //            setTimeout(()=>{
    //                t1.commit();
    //                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, 'Success');
    //            },5000);
    //        }).catch((err) => {
    //            console.trace();
    //            console.error(err);
    //            t1.rollback();
    //            if (err && err.parent && err.parent.errno === 1205) {
    //                return {
    //                    status: STATE.FAILED,
    //                    message: MESSAGE_CONSTANT.GLOBAL.DB_TRANSACTION_LOCKED_MESSAGE,
    //                    err: null
    //                };
    //            } else {
    //                return {
    //                    status: STATE.FAILED,
    //                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                    err: err
    //                };
    //            }
    //        });
    //    } catch (error) {
    //        console.trace();
    //        console.error(err);
    //        // If the execution reaches this line, an error was thrown.
    //        // We rollback the transaction.
    //        t1.rollback();
    //        return {
    //            status: STATE.FAILED,
    //            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //            err: err
    //        };
    //      }
    //}
    // // Update Scope fo Users
    // // POST : https://localhost:44372/Uitility/ManageClientUserMapping
    // // @return failed users entry if any
    // updateScoprOfUser: (body, token) => {
    //     https.globalAgent.options.rejectUnauthorized = false;
    //     const HEADER = { ...identity_server.HEADER, Authorization: token };

    //     return new Promise((resolve) => {
    //         var options = {
    //             method: IDENTITY_SERVER.UPDATE_SCOPE_OF_USER.METHOD,
    //             host: identity_server.HOST,
    //             port: identity_server.PORT,
    //             path: IDENTITY_SERVER.UPDATE_SCOPE_OF_USER.PATH,
    //             headers: HEADER,
    //             strictSSL: false
    //         };

    //         callback = function (response) {
    //             var str = '';
    //             response.on('data', (chunk) => {
    //                 str += chunk;
    //             });

    //             response.on('end', () => {
    //                 resolve(str);
    //             });
    //         };


    //         var req = https.request(options, callback);
    //         req.write(JSON.stringify(body));
    //         req.on('error', (err) => {
    //             const res = { status: STATE.FAILED, message: err.toString() };
    //             resolve(res);
    //         });
    //         req.end();
    //     });
    // },
    // Removeuser from Identity server
    // POST : https://localhost:44372/account/removeuser
    // @return
    // removeUserFromIdentity: (body, token) => {
    //     const newBody = { UserIds: body };
    //     https.globalAgent.options.rejectUnauthorized = false;
    //     const HEADER = { ...identity_server.HEADER, Authorization: token };

    //     return new Promise((resolve) => {
    //         var options = {
    //             method: IDENTITY_SERVER.REMOVE_USER.METHOD,
    //             host: identity_server.HOST,
    //             port: identity_server.PORT,
    //             path: IDENTITY_SERVER.REMOVE_USER.PATH,
    //             headers: HEADER,
    //             strictSSL: false
    //         };

    //         callback = function (response) {
    //             var str = '';
    //             response.on('data', (chunk) => {
    //                 str += chunk;
    //             });

    //             response.on('end', () => {
    //                 resolve(str);
    //             });
    //         };

    //         var req = https.request(options, callback);
    //         req.write(JSON.stringify(newBody));
    //         req.on('error', (err) => {
    //             const res = { status: STATE.FAILED, message: err.toString() };
    //             resolve(res);
    //         });
    //         req.end();
    //     });
    // }

    ///Added By VS for convert JSON to Specific Array - Please don't remove 
    // readJsonAndConvertToArray: (req, res) => {
    //     try {
    //         const jsonDataList = 'D://Development//Z-FlexNet//FJT//FJT//fjt.api//constant_json/Telemedicine1.json';
    //         const finalObjectList = [];
    //         let rawdata = null;
    //         rawdata = jsonfile.readFileSync(jsonDataList);
    //         if (rawdata) {
    //             _.each(rawdata, (val, key) => {
    //                 if (key === 'paths') {
    //                     _.each(val, (pathValues) => {
    //                         const finalObject = {};
    //                         _.each(pathValues, (methodValues, methodKeys) => {
    //                             const index = methodValues.operationId ? methodValues.operationId.lastIndexOf('_') : 0;
    //                             const result = methodValues.operationId ? methodValues.operationId.substr(index + 1) : '';
    //                             finalObject.Controller = methodValues.tags[0];
    //                             finalObject.MethodName = result;
    //                             finalObject.MethodType = methodKeys ? methodKeys.toUpperCase() : '';
    //                             finalObject.APIDescription = methodValues.summary;
    //                         });
    //                         finalObjectList.push(finalObject);
    //                     });
    //                 }
    //             });
    //         }
    //         return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, finalObjectList, null);
    //     } catch (err) {
    //         console.trace();
    //         console.error(err);
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //     }
    // }
};