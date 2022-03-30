const fs = require('fs');
const fsextra = require('fs-extra');
const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const countryModuleName = DATA_CONSTANT.COUNTRYMST.NAME;

const inputFields = [
    'countryID',
    'countryName',
    'flagImageExtention',
    'remark',
    'countrySortCode',
    'imageName',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrive list of country
    // GET : /api/v1/countrymst/retriveCountryList
    // @return list of country
    retriveCountryList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveCountry (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { country: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive deatil of country
    // GET : /api/v1/countrymst/:id
    // @param {countryId} int
    // @return detail of country
    retriveCountry: (req, res) => {
        const CountryMst = req.app.locals.models.CountryMst;
        if (req.params.countryId) {
            return CountryMst.findByPk(req.params.countryId)
                .then((country) => {
                    if (!country) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(countryModuleName), err: null, data: null });
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, country, null);
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

    // Delete Country
    // DELETE : /api/v1/countrymst
    // @param {countryId} int
    // @return API response
    // eslint-disable-next-line consistent-return
    deleteCountry: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Country.Name;
            sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((countryDetail) => {
                if (countryDetail.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, countryDetail, MESSAGE_CONSTANT.DELETED(countryModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: countryDetail, IDs: req.body.objIDs.id }, null);
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

    // Create country
    // POST : /api/v1/countrymst
    // @return new created country
    createCountry: (req, res) => {
        const dir = DATA_CONSTANT.COUNTRY.UPLOAD_PATH;
        if (typeof (req.files) === 'object' && typeof (req.files.flag) === 'object') {
            const file = req.files.flag;
            const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
            const fileName = `${file.fieldName}-${uuidv1()}.${ext}`;
            const path = dir + fileName;
            req.body.imageName = fileName;
            fsextra.move(file.path, path, (err) => {
                module.exports.addNewCountry(req, res, err);
            });
        } else {
            module.exports.addNewCountry(req, res, null);
        }
    },
    // Common Method for add new Country detail
    // eslint-disable-next-line consistent-return
    addNewCountry: (req, res, err) => {
        const { CountryMst, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        if (!err) {
            if (req.body) {
                CountryMst.findOne({
                    where: {
                        [Op.or]: [
                            { countryName: { [Op.eq]: req.body.countryName } },
                            { countrySortCode: { [Op.eq]: req.body.countrySortCode } }
                        ]
                    }
                }).then((isExists) => {
                    if (isExists) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                        messageContent.message = COMMON.stringFormat(messageContent.message, (isExists.dataValues.countryName === req.body.countryName) ? 'Country Name' : 'Country Code');
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                    } else {
                        return ComponentFieldsGenericaliasMst.findOne({
                            where: {
                                alias: req.body.countryName,
                                refTableName: req.body.refTableName
                            },
                            attributes: ['id']
                        }).then((aliasData) => {
                            if (aliasData) {
                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                                messageContent.message = COMMON.stringFormat(messageContent.message, 'Country Name');
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                            } else {
                                COMMON.setModelCreatedByFieldValue(req);
                                return CountryMst.create(req.body, {
                                    fields: inputFields
                                }).then(country => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, country, MESSAGE_CONSTANT.CREATED(countryModuleName))
                                ).catch((error) => {
                                    console.trace();
                                    console.error(error);
                                    if (error.message === COMMON.VALIDATION_ERROR && error.errors && error.errors.length > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error.errors.map(e => e.message).join(','), data: null });
                                    } else if (error.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Country'), error: null, data: null });
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
                                    }
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }
                }).catch((error) => {
                    console.trace();
                    console.error(error);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
                });
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } else {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },
    // Update country
    // PUT : /api/v1/countrymst
    // @param {countryId} int
    // @return API Response
    updateCountry: (req, res) => {
        const dir = DATA_CONSTANT.COUNTRY.UPLOAD_PATH;
        if (typeof (req.files) === 'object' && typeof (req.files.flag) === 'object') {
            const file = req.files.flag;
            const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
            const fileName = `${file.fieldName}-${uuidv1()}.${ext}`;
            const path = dir + fileName;
            // req.body.fileName = fileName;
            req.body.imageName = fileName;
            fsextra.move(file.path, path, (err) => {
                module.exports.editCountryDetail(req, res, err);
            });
        } else {
            module.exports.editCountryDetail(req, res, null);
        }
    },
    // Common Method for Edit Country detail
    // eslint-disable-next-line consistent-return
    editCountryDetail: (req, res, err) => {
        const { CountryMst, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        if (!err) {
            req.body.countrySortCode = req.body.countrySortCode ? req.body.countrySortCode.toUpperCase() : null;
            if (req.params.countryId) {
                if (!err) {
                    CountryMst.findOne({
                        where: { countryID: req.params.countryId },
                        attributes: ['imageName']
                    }).then((country) => {
                        if (!req.body.imageName || (req.body.imageName && country.imageName)) {
                            const path = DATA_CONSTANT.COUNTRY.UPLOAD_PATH;
                            fs.unlink(`${path}${country.imageName}`, () => { });
                        }
                    });
                    req.body.imageName = req.files.length > 0 ? req.files[0].filename : req.body.imageName;
                    CountryMst.findOne({
                        where: {
                            countryID: { [Op.ne]: req.body.countryID },
                            [Op.or]: [
                                { countryName: { [Op.eq]: req.body.countryName } },
                                { countrySortCode: { [Op.eq]: req.body.countrySortCode } }
                            ]
                        }
                    }).then((isExists) => {
                        if (isExists) {
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                            messageContent.message = COMMON.stringFormat(messageContent.message, (isExists.dataValues.countryName === req.body.countryName) ? 'Country Name' : 'Country Code');
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                        }
                        else {
                            return ComponentFieldsGenericaliasMst.findOne({
                                where: {
                                    alias: req.body.countryName,
                                    refTableName: req.body.refTableName
                                },
                                attributes: ['id']
                            }).then((aliasData) => {
                                if (aliasData) {
                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Country Name');
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                                } else {
                                    COMMON.setModelUpdatedByFieldValue(req);
                                    return CountryMst.update(req.body, {
                                        where: {
                                            countryId: req.params.countryId
                                        },
                                        fields: inputFields
                                    }).then((rowsUpdated) => {
                                        if (rowsUpdated[0] === 1) {
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(countryModuleName));
                                        } else {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(countryModuleName), err: null, data: null });
                                        }
                                    }).catch((error) => {
                                        console.trace();
                                        console.error(error);
                                        if (error.message === COMMON.VALIDATION_ERROR && error.errors && error.errors.length > 0) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.SOMTHING_WRONG, err: error.errors.map(e => e.message).join(','), data: null });
                                        } else if (error.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Country'), err: null, data: null });
                                        } else {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
                                        }
                                    });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } else {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },
    // get all country list
    // GET : /api/v1/countrymst/getAllCountry
    // @param
    // @return country list
    // getAllCountry: (req, res) => {
    //     const CountryMst = req.app.locals.models.CountryMst;
    //     CountryMst.findAll({
    //         where: {
    //             isActive:true
    //         },
    //         attributes: ['countryID', 'countryName','countrySortCode']
    //     }).then((allCountry) => {
    //         resHandler.successRes(res, 200, STATE.SUCCESS, allCountry);
    //     }).catch((err) => {
    //         console.trace();
    //         console.error(err);
    //         resHandler.errorRes(res,200,STATE.EMPTY,new NotFound(MESSAGE_CONSTANT.NOT_FOUND(countryModuleName)));
    //     });
    // }

    // Get List of Country
    // GET : /api/v1/countrymst/getAllCountry
    // @return List of Country
    getAllCountry: (req, res) => {
        const { CountryMst, ComponentFieldsGenericaliasMst, sequelize } = req.app.locals.models;
        var where = {
            isDeleted: false
        };
        var promises = [];

        if (req.query.countryID) {
            where.countryID = req.query.countryID;
        }

        if (req.query.searchQuery) {
            where.countryName = { [Op.like]: `%${req.query.searchQuery}%` };
            where.isActive = true;
        }

        promises.push(
            CountryMst.findAll({
                attributes: ['countryID', 'countryName', 'isActive'],
                where: where,
                paranoid: false,
                order: [sequelize.fn('ISNULL', sequelize.col('CountryMst.displayOrder')), ['displayOrder', 'ASC'], ['countryName', 'ASC']]
            })
        );

        if (req.query.searchQuery) {
            where = {
                alias: { [Op.like]: `%${req.query.searchQuery}%` },
                refTableName: CountryMst.tableName,
                isDeleted: false
            };
            promises.push(
                ComponentFieldsGenericaliasMst.findAll({
                    attributes: [['refId', 'countryID'], 'alias'],
                    where: where,
                    paranoid: false,
                    include: [
                        {
                            model: CountryMst,
                            as: 'countryMst',
                            where: {
                                isDeleted: false
                            },
                            paranoid: false,
                            attributes: ['countryID', 'countryName'],
                            required: false
                        }
                    ]
                })
            );
        }

        Promise.all(promises).then((response) => {
            var countryMst = [];
            _.map(response[1], (data) => {
                if (data.countryMst) { countryMst.push(data.countryMst); }
            });
            let mergeList = response[0].concat(countryMst);
            mergeList = _.uniqBy(mergeList, 'countryID');
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mergeList, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // check Name Unique
    // POST : /api/v1/countrymst/checkNameUnique
    // @return API response
    checkNameUnique: (req, res) => {
        const { CountryMst } = req.app.locals.models;
        var fieldName = req.body.objs.countryName ? 'Country name' : 'Counry code';
        if (req.body) {
            const whereClause = {
                [Op.or]: [
                    { countryName: { [Op.eq]: req.body.objs.countryName } },
                    { countrySortCode: { [Op.eq]: req.body.objs.countrySortCode } }
                ]
            };
            if (req.body.objs.countryID) {
                whereClause.countryID = { [Op.notIn]: [req.body.objs.countryID] };
            }
            CountryMst.findAll({
                where: whereClause
            }).then((isExists) => {
                if (isExists.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // update Display Order
    // POST:/api/v1/countrymst/updateCountryDisplayOrder
    updateCountryDisplayOrder: (req, res) => {
        const { CountryMst } = req.app.locals.models;
        if (req.body) {
            return CountryMst.findOne({
                where: {
                    countryID: {
                        [Op.ne]: req.body.countryID
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
                    return CountryMst.update(updateobj, {
                        where: {
                            countryID: req.body.countryID,
                            isDeleted: false
                        }
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(countryModuleName))).catch((err) => {
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
    // Check is alias is not in Country alias
    // Check : /api/v1/rfqsetting/checkUniqueCountryAlias
    // @return list of Country alias
    checkUniqueCountryAlias: (req, res) => {
        /* set type of module request */
        const { CountryMst, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var where = {
            alias: req.body.alias,
            refTableName: req.body.refTableName
        };
        if (req.body.id) { where.refId = { [Op.ne]: req.body.id }; }
        ComponentFieldsGenericaliasMst.findOne({
            attributes: ['id', 'alias', 'refId'],
            where: where
        }).then((aliasExistsInfo) => {
            if (aliasExistsInfo) {
                CountryMst.findOne({
                    attributes: ['countryID', 'countryName'],
                    where: {
                        countryID: aliasExistsInfo.refId
                    }
                }).then((country) => {
                    var obj = {
                        alias: aliasExistsInfo.alias,
                        countryName: country.countryName,
                        name: country.countryName
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { aliasExistsInfo: obj }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                const whereClause = {
                    countryName: req.body.alias
                };
                if (req.body.id) {
                    whereClause.countryID = { [Op.ne]: req.body.id };
                }

                CountryMst.findOne({
                    where: whereClause,
                    attributes: ['countryID', 'countryName']
                }).then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { countryExistsInfo: result }, null)).catch((err) => {
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
    }
};