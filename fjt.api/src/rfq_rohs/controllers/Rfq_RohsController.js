const fsextra = require('fs-extra');
const fs = require('fs');
const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const ComponentFieldGenericAlias = require('../../component_field_generic_Alias/controllers/Component_Field_Generic_Alias_Controller.js');

const inputFields = [
    'id',
    'name',
    'description',
    'refMainCategoryID',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'rohsIcon',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'refParentID'
];
const RoHSPeerInputFields = [
    'id',
    'rohsID',
    'rohsPeerID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const RoHSModuleName = DATA_CONSTANT.ROHS.NAME;
module.exports = {
    // Create Rohs
    // POST : /api/v1/rfqRohs/saveRohs
    // @return created RoHS
    createRohs: (req, res) => {
        const { RFQRoHS, sequelize } = req.app.locals.models;
        if (req.body) {
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

            const where = {
                [Op.or]: [{ name: req.body.name }]
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            return RFQRoHS.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.RoHS_UNIQUE_FIELD.RoHS), err: null, data: null });
                } else if (req.body.id) {
                    // Update
                    return sequelize.query('CALL Sproc_validateParentRohs (:pRoHSID,:pParentRoHSID,:pDeletedPeersID)', {
                        replacements: {
                            pRoHSID: req.body.id,
                            pParentRoHSID: req.body.refParentID || null,
                            pDeletedPeersID: req.body.deletedRoHSPeer.length > 0 ? req.body.deletedRoHSPeer.join() : ''
                        }
                    }).then((responses) => {
                        if (responses[0].itemCount > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.INVALID_PARENT_ROHS, err: null, data: null });
                        } else {
                            return sequelize.transaction().then((t) => {
                                COMMON.setModelUpdatedByFieldValue(req);
                                return RFQRoHS.update(req.body, {
                                    where: {
                                        id: req.body.id
                                    },
                                    fields: inputFields,
                                    transaction: t
                                }).then(() => {
                                    var detail = {
                                        refTableName: req.body.refTableName,
                                        refId: req.body.id,
                                        alias: req.body.alias
                                    };
                                    return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                        if (response) {
                                            if (response.status === STATE.SUCCESS) {
                                                return module.exports.saveRoHSPeer(req, res, req.body.id, req.body.newRoHSPeer, req.body.deletedRoHSPeer, t).then((responsePeer) => {
                                                    if (responsePeer.Status === STATE.SUCCESS) {
                                                        t.commit().then(() => {
                                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(RoHSModuleName));
                                                        });
                                                    } else {
                                                        if (!t.finished) {
                                                            t.rollback();
                                                        }
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: responsePeer.message, err: null, data: { rohsModel: req.body } });
                                                    }
                                                });
                                            } else if (response) {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.RoHS_UNIQUE_FIELD.RoHS), err: response.err || null, data: null });
                                            }
                                        } else {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: response.err || null, data: null });
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
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
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelCreatedByFieldValue(req);
                        req.body.rohsIcon = parseInt(req.body.refMainCategoryID) === DATA_CONSTANT.RoHSMainCategory.RoHS ? DATA_CONSTANT.ROHS_DEFAULT_ICON.RoHS : (parseInt(req.body.refMainCategoryID) === DATA_CONSTANT.RoHSMainCategory.NonRoHS ? DATA_CONSTANT.ROHS_DEFAULT_ICON.NonRoHS : DATA_CONSTANT.ROHS_DEFAULT_ICON.NotApplicable);
                        return RFQRoHS.create(req.body, {
                            fields: inputFields,
                            transaction: t
                        }).then((rohs) => {
                            var detail = {
                                refTableName: req.body.refTableName,
                                refId: rohs.id,
                                alias: req.body.alias
                            };
                            return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                if (response) {
                                    if (response.status === STATE.SUCCESS) {
                                        _.each(req.body.newRoHSPeer, (objrohsPeer) => {
                                            objrohsPeer.rohsID = rohs.id;
                                        });
                                        return module.exports.saveRoHSPeer(req, res, rohs.id, req.body.newRoHSPeer, req.body.deletedRoHSPeer, t).then((responsePeer) => {
                                            if (responsePeer.Status === STATE.SUCCESS) {
                                                t.commit().then(() => {
                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rohs, MESSAGE_CONSTANT.CREATED(RoHSModuleName));
                                                });
                                            } else {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: responsePeer.message, err: null, data: { rohsModel: rohs } });
                                            }
                                        });
                                    } else if (response.isDuplicate) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.RoHS_UNIQUE_FIELD.RoHS), err: response.err || null, data: null });
                                    }
                                } else {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: response.err || null, data: null });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Rohs
    // POST : /api/v1/rfqRohs/retriveRohsList
    // @return list of Rohs
    retriveRohsList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            const sourceDetails = req.body.SourceDetail ? req.body.SourceDetail : null;

            return sequelize.query('CALL Sproc_RetrieveRohsList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:psourceDetails)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    psourceDetails: sourceDetails
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { RoHSList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Rohs
    // GET : /api/v1/rfqRohs/retriveRohs/:id
    // @return list of Rohs
    retriveRohs: (req, res) => {
        if (req.query.id) {
            const RFQRoHS = req.app.locals.models.RFQRoHS;
            return RFQRoHS.findOne({
                where: { id: req.query.id }

            }).then((mountingType) => {
                if (!mountingType) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mountingType, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Remove Rohs
    // POST : /api/v1/rfqRohs/deleteRohs
    // @return list of Rohs by ID
    deleteRohs: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.RoHS.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response && response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(RoHSModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: response, IDs: req.body.objIDs.id }, null);
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

    // Retrive list of RoHS
    // GET : /api/v1/rfqRohs/getRohsList
    // @return list of RoHS
    getRohsList: (req, res) => {
        const { RFQRoHS, sequelize, RFQRoHSPeer } = req.app.locals.models;
        var where = {
            isDeleted: false
            /* isActive: true*/
        };
        if (req.query.searchQuery) {
            where.name = {
                [Op.like]: `%${req.query.searchQuery}%`
            };
        }
        // when edit recored
        if (req.query.id) {
            where.id = req.query.id;
        }

        return RFQRoHS.findAll({
            where: where,
            paranoid: false,
            attributes: ['id', 'name', 'description', 'isActive', 'systemGenerated', 'rohsIcon', 'refMainCategoryID', 'displayOrder', 'refParentID'],
            include: [{
                model: RFQRoHSPeer,
                as: 'referenceRoHS',
                where: {
                    isDeleted: false
                },
                attributes: ['id', 'rohsPeerID', 'rohsID'],
                required: false
            }],
            // order: [['name', 'ASC']],
            order: [sequelize.fn('ISNULL', sequelize.col('RFQRoHS.displayOrder')), ['displayOrder', 'ASC'], ['name', 'ASC']]
        }).then(rohsList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rohsList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Retrive list of RoHS Category
    // GET : /api/v1/rfqRohs/getRohsCategoryList
    // @return list of RoHS Category
    getRohsCategoryList: (req, res) => {
        const { RFQRoHSMainCategory } = req.app.locals.models;

        return RFQRoHSMainCategory.findAll({
            where: {
                isActive: true
            },
            attributes: ['id', 'name']
        }).then(rohsCategoryList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rohsCategoryList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Update Rohs
    // PUT : /api/v1/rfqRohs/updateRohs
    // @param {id} int
    // @return API Response
    // eslint-disable-next-line consistent-return
    updateRohs: (req, res) => {
        const dir = DATA_CONSTANT.ROHS.UPLOAD_PATH;
        try {
            if (typeof (req.files) === 'object' && req.files.flag) {
                const file = req.files.flag;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                const fileName = `${file.fieldName}-${uuidv1()}.${ext}`;
                const path = dir + fileName;
                req.body.rohsIcon = fileName;
                fsextra.move(file.path, path, (err) => {
                    module.exports.updateRohsIconDetail(req, res, err);
                });
            } else {
                module.exports.updateRohsIconDetail(req, res, null);
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },

    updateRohsIconDetail: (req, res) => {
        const { RFQRoHS } = req.app.locals.models;
        RFQRoHS.findOne({
            where: { id: req.params.id },
            attributes: ['rohsIcon']
        }).then((rohs) => {
            if (!req.body.rohsIcon || (rohs && req.body.rohsIcon && rohs.rohsIcon)) {
                const path = DATA_CONSTANT.ROHS.UPLOAD_PATH;
                fs.unlink(`${path}${rohs.rohsIcon}`, () => { });
            }
        });

        RFQRoHS.findOne({
            where: {
                id: { [Op.ne]: req.body.id }
            }
        }).then(() => {
            RFQRoHS.update(req.body, {
                where: {
                    id: req.params.id
                },
                fields: inputFields
            }).then((rowsUpdated) => {
                if (rowsUpdated[0] === 1) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(RoHSModuleName));
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(RoHSModuleName), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messagContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messagContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        });
    },
    // Check RoHS exist or not
    // post:/api/v1/rfqRohs/checkDuplicateRoHS
    // @retrun validity of RoHS
    checkDuplicateRoHS: (req, res) => {
        const { RFQRoHS, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        if (req.body) {
            const whereClauseMfg = {
                name: req.body.name
            };
            if (req.body.id) {
                whereClauseMfg.id = { [Op.ne]: req.body.id };
            }
            return RFQRoHS.findOne({
                where: whereClauseMfg,
                attributes: ['id']
            }).then((mountingType) => {
                if (mountingType) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                } else {
                    return ComponentFieldsGenericaliasMst.findOne({
                        where: {
                            alias: req.body.name,
                            refTableName: req.body.refTableName,
                            refId: { [Op.ne]: req.body.id }
                        },
                        attributes: ['id']
                    }).then((rohsAlias) => {
                        if (rohsAlias) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicate: false }, null);
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Mounting Type
    // GET : /api/v1/rfqRohs/getRoHSList
    // @return list of RoHS
    getRoHSList: (req, res) => {
        const { RFQRoHS } = req.app.locals.models;
        var where = {};
        // for dynamic column based search using Sequelize
        if (req.query.searchQuery) {
            where.name = {
                [Op.like]: `%${req.query.searchQuery}%`
            };
        }
        // when edit recored
        if (req.query.id) {
            where.id = req.query.id;
        }
        RFQRoHS.findAll({
            attributes: ['id', 'name'],
            where: where,
            order: [['name', 'ASC']]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Check is alias is not in RoHS alias
    // POST : /api/v1/rfqRohs/checkUniqueRoHSAlias
    // @return list of RoHS alias
    checkUniqueRoHSAlias: (req, res) => {
        /* set type of module request */
        const { RFQRoHS, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var wheregeneric = {
            alias: req.body.alias,
            refTableName: req.body.refTableName
        };
        if (req.body.id) {
            wheregeneric.refId = { [Op.ne]: req.body.id };
        }
        ComponentFieldsGenericaliasMst.findOne({
            attributes: ['id', 'alias', 'refId'],
            where: wheregeneric
        }).then((rohsAliasExistsInfo) => {
            if (rohsAliasExistsInfo) {
                RFQRoHS.findOne({
                    attributes: ['id', 'name'],
                    where: {
                        id: rohsAliasExistsInfo.refId
                    }
                }).then((rohs) => {
                    var obj = {
                        alias: rohsAliasExistsInfo.alias,
                        roHSName: rohs.name,
                        name: rohs.name
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { rohsAliasExistsInfo: obj }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                const whereClauseMfg = {
                    name: req.body.alias
                };
                if (req.body.id) {
                    whereClauseMfg.id = { [Op.ne]: req.body.id };
                }
                RFQRoHS.findOne({
                    where: whereClauseMfg,
                    attributes: ['id', 'name']
                }).then(rohsDetAliasExistsInfo => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { rohsDetAliasExistsInfo: rohsDetAliasExistsInfo }, null)).catch((err) => {
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
    // update Display Order
    // POST:/api/v1/rfqRohs/updateRoHSDisplayOrder
    updateRoHSDisplayOrder: (req, res) => {
        const { RFQRoHS } = req.app.locals.models;
        if (req.body) {
            return RFQRoHS.findOne({
                where: {
                    id: {
                        [Op.ne]: req.body.id
                    },
                    displayOrder: req.body.displayOrder,
                    isDeleted: false
                }
            }).then((isexist) => {
                if (isexist && req.body.displayOrder) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Display Order');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    const updateobj = {
                        displayOrder: req.body.displayOrder,
                        updatedBy: req.body.updatedBy,
                        updateByRoleId: req.body.updateByRoleId
                    };
                    return RFQRoHS.update(updateobj, {
                        where: {
                            id: req.body.id,
                            isDeleted: false
                        }
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(RoHSModuleName))).catch((err) => {
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve list of Rohs
    // GET : /api/v1/rfqRohs/retrieveParentRoHS
    // @return list of Rohs
    retrieveParentRoHS: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_RetrieveRohsListForParentRoHS (:pRoHSID)', {
            replacements: {
                pRoHSID: req.query.id || null
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Create RoHS Peer
    // @return Status
    saveRoHSPeer: (req, res, rohsID, newRoHSPeer, deletedRoHSPeer, t) => {
        const { RFQRoHSPeer, sequelize } = req.app.locals.models;
        if (rohsID) {
            const promises = [];
            if (newRoHSPeer.length > 0) {
                const newRohsPeerIds = _.map(newRoHSPeer, 'rohsPeerID');

                return sequelize.query('CALL Sproc_validatePeerRohs (:pRoHSID,:pPeerRoHSIDs)', {
                    replacements: {
                        pRoHSID: rohsID,
                        pPeerRoHSIDs: newRohsPeerIds.join()
                    }
                }).then((response) => {
                    if (response[0].itemCount > 0) {
                        return {
                            Status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.MASTER.INVALID_PEER_ROHS
                        };
                    } else {
                        if (deletedRoHSPeer.length > 0) {
                            COMMON.setModelDeletedByFieldValue(req);
                            promises.push(RFQRoHSPeer.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                                where: {
                                    rohsID: rohsID,
                                    rohsPeerID: deletedRoHSPeer
                                },
                                transaction: t,
                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId']
                            }));
                        }
                        if (newRoHSPeer.length > 0) {
                            COMMON.setModelCreatedArrayFieldValue(req.user, newRoHSPeer);
                            promises.push(RFQRoHSPeer.bulkCreate(newRoHSPeer, {
                                fields: RoHSPeerInputFields,
                                transaction: t,
                                updateOnDuplicate: ['rohsID', 'rohsPeerID']
                            }));
                        }
                        return Promise.all(promises).then(() => ({
                            Status: STATE.SUCCESS
                        })).catch((err) => {
                            console.trace();
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.error(err);
                            return {
                                Status: STATE.FAILED,
                                err: err
                            };
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        Status: STATE.FAILED,
                        err: err
                    };
                });
            } else {
                if (deletedRoHSPeer.length > 0) {
                    COMMON.setModelDeletedByFieldValue(req);
                    promises.push(RFQRoHSPeer.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                        where: {
                            rohsID: rohsID,
                            rohsPeerID: deletedRoHSPeer
                        },
                        transaction: t,
                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId']
                    }));
                }
                return Promise.all(promises).then(() => ({
                    Status: STATE.SUCCESS
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return {
                        Status: STATE.FAILED,
                        err: err
                    };
                });
            }
        } else {
            return {
                Status: STATE.FAILED,
                err: null
            };
        }
    }
};
