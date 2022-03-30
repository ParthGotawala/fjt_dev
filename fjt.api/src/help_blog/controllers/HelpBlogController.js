const _ = require('lodash');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
const { Op } = require('sequelize');
const fs = require('fs');
const hummus = require('hummus');
const memoryStreams = require('memory-streams');
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


const moduleName = DATA_CONSTANT.HELP_BLOG.NAME;
const detailModuleName = DATA_CONSTANT.HELP_BLOG_DETAIL.NAME;
const inputFields = [
    'id',
    'pageID',
    'title',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const helpBlogKeywordField = [
    'id',
    'keyword',
    'helpBlogId',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const detailsinputFields = [
    'id',
    'helpBlogId',
    'isSystemGenerated',
    'description',
    'title',
    'displayOrder',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
]
module.exports = {
    // Manage blog details
    // POST : /api/v1/helpBlog/saveBlog
    // @return API response
    saveBlog: (req, res) => {
        const {
            HelpBlog,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            if (req.body.id) {
                return sequelize.transaction().then((t) => {
                    COMMON.setModelUpdatedByFieldValue(req);
                    HelpBlog.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields,
                        transaction: t
                    }).then(() => {
                        module.exports.saveHelpBlogKeyword(req, t).then((response) => {
                            return t.commit().then(() => {
                                if (response.status === STATE.SUCCESS) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName));
                                } else {
                                    return resHandler.errorRes(response, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                                        { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(moduleName), err: null, data: null });
                                }
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                                { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                COMMON.setModelCreatedByFieldValue(req);
                return HelpBlog.count({
                    where: {
                        pageID: req.body.pageID
                    }
                }).then((response) => {
                    if (response === 0) {
                        return sequelize.transaction().then((t) => {
                            HelpBlog.create(req.body, {
                                fields: inputFields,
                                transaction: t
                            }).then((helpblog) => {
                                req.body.id = helpblog.id;
                                module.exports.saveHelpBlogKeyword(req, t).then((resp) => {
                                    return t.commit().then(() => {
                                        if (resp.status === STATE.SUCCESS) {
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(moduleName));
                                        } else {
                                            return resHandler.errorRes(resp, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(moduleName), err: null, data: null });
                                        }
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                                { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                            { messageContent: MESSAGE_CONSTANT.MASTER.HELP_BLOG_EXISTS_VALIDATION, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERR,
                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Save help blog keywords
    // @return model
    saveHelpBlogKeyword: (req, t) => {
        const {
            HelpBlogKeyword
        } = req.app.locals.models;

        return HelpBlogKeyword.findAll({
            where: {
                helpBlogId: req.body.id
            },
            attributes: ['id', 'helpBlogId', 'keyword'],
            transaction: t
        }).then((response) => {
            var userID = COMMON.getRequestUserID(req);
            var newAddedkeywordList = [];
            var deletedkeywordList = [];
            response.forEach((item) => {
                var typeObj = req.body.keywords.find(x => parseInt(x.id) === parseInt(item.id));
                if (!typeObj) { deletedkeywordList.push(item.id); }
            });
            const keyword = req.body.keywords && req.body.keywords.length > 0 ? req.body.keywords.filter(item => item.id == null) : [];
            keyword.forEach((item) => {
                var keywordData = {
                    createdBy: userID,
                    helpBlogId: req.body.id,
                    keyword: item.keyword
                };
                newAddedkeywordList.push(keywordData);
            });
            const promises = [];
            if (newAddedkeywordList.length) {
                COMMON.setModelCreatedByFieldValue(req);
                promises.push(HelpBlogKeyword.bulkCreate(newAddedkeywordList, {
                    fields: helpBlogKeywordField,
                    transaction: t
                }));
            }
            if (deletedkeywordList.length) {
                COMMON.setModelDeletedByFieldValue(req);
                const updatedData = {
                    deletedAt: COMMON.getCurrentUTC(req),
                    isDeleted: true,
                    deletedBy: userID
                };
                promises.push(HelpBlogKeyword.update(updatedData, {
                    where: {
                        id: {
                            [Op.in]: deletedkeywordList
                        }
                    },
                    transaction: t,
                    fields: ['deletedBy', 'deletedAt', 'isDeleted']
                }));
            }
            return Promise.all(promises).then(() => ({
                status: STATE.SUCCESS
            })).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    error: err
                };
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },
    // Get search data of page help Blog keyword
    // GET : /api/v1/helpBlog/getHelpBlogKeywordByPageId
    // @return search of help blog keyword
    helpBlogDetailByKeyword: (req, res) => {
        const {
            HelpBlogKeyword,
            HelpBlog,
            PageDetail
        } = req.app.locals.models;
        HelpBlogKeyword.findAll({
            where: {
                keyword: {
                    [Op.like]: `%${req.query.query}%`
                }
            },
            attributes: ['keyword'],
            include: [{
                model: HelpBlog,
                as: 'helpBlog',
                attributes: ['pageID', 'title'],
                include: [{
                    model: PageDetail,
                    as: 'pageDetail',
                    attributes: ['menuName']
                }]
            }]
        }).then((response) => {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Used to check Unique help blog
    // GET : /api/v1/helpBlog/checkUniqueHelpBlog
    // @return related data if exists
    checkUniqueHelpBlog: (req, res) => {
        const {
            HelpBlog
        } = req.app.locals.models;
        if (req.body && req.body.pageID) {
            return HelpBlog.findOne({
                where: {
                    pageID: req.body.pageID
                }
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isNotUnique: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Chcek duplicate title
    // GET : /api/v1/helpBlog/checkUniqueHelpBlogTitle
    // @return Unique message if found
    checkUniqueHelpBlogTitle: (req, res) => {
        const whereStatement = [];
        const {
            HelpBlog
        } = req.app.locals.models;
        if (req.body && req.body.title) {
            if (req.body.pageID) {
                whereStatement.push({
                    title: req.body.title,
                    pageID: {
                        [Op.ne]: req.body.pageID
                    }
                });
            } else {
                whereStatement.push({
                    title: req.body.title
                });
            }
            HelpBlog.findOne({
                where: whereStatement
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isNotUnique: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // Get data of page help Blog Detail
    // GET : /api/v1/helpBlog/getHelpBlogDetailByPageId
    // @return list of Blog
    getHelpBlogDetailByPageId: async (req, res) => {
        const {
            HelpBlogDetail,
            HelpBlog,
            sequelize
        } = req.app.locals.models;
        if (req.params.pageID) {
            try {
                var functionDetail = await sequelize.query('Select fun_getTimeZone() as TimeZone,fun_getDateTimeFormat() as dateFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return await HelpBlog.findOne({
                where: {
                    pageID: req.params.pageID
                },
                attributes: ['id', 'title', 'pageID'],
                include: [{
                    model: HelpBlogDetail,
                    as: 'helpBlogDetail',
                    attributes: ['Id', 'helpBlogId', 'description', 'displayOrder', 'title',
                        [sequelize.fn('fun_getUserNameByID', sequelize.col('helpBlogDetail.updatedBy')), 'updatedBy'],
                        [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('helpBlogDetail.updatedAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'updatedAt']],
                    order: [
                        ['displayOrder', 'ASC']
                    ]
                }]
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                        err: null,
                        data: null
                    });
                } else {
                    _.each(response.helpBlogDetail, (item) => {
                        item.description = COMMON.getTextAngularValueFromDB(item.description);
                    });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get List of  page Blog Detail
    // GET : /api/v1/helpBlog/getHelpBlogDetailList
    // @return list of Blog
    getHelpBlogDetailList: (req, res) => {
        const {
            sequelize,
            UserPageDetail,
            HelpBlog,
            PageDetail
        } = req.app.locals.models;
        var SEARCHQUERY = {};
        var HBQUERY = {};
        if (!_.isEmpty(req.query)) {
            SEARCHQUERY = {
                menuName: {
                    [Op.like]: '%' + req.query.searchquery + '%'
                }
            };

            HBQUERY = {
                userID: req.query.userID,
                roleID: req.query.roleID,
                isHelpBlog: true,
                //isActive: true
            };
        }
        return HelpBlog.findAll({
            where: {
                isDeleted: false
            },
            attributes: ['id', 'title', 'pageID', [sequelize.literal('CONCAT(HelpBlog.title, " | ", pageDetail.menuName )'), 'searchHeaderMenu'],
                [sequelize.literal('CONCAT(pageDetail.iconClass)'), 'iconClass']],
            order: [
                ['title', 'ASC']
            ],
            include: [{
                model: PageDetail,
                where: SEARCHQUERY,
                as: 'pageDetail',
                attributes: ['pageID', 'pageName', 'menuName', 'iconClass', 'popupFunName', 'pageRoute', 'paramDet'],
                include: [{
                    model: UserPageDetail,
                    where: HBQUERY,
                    as: 'userPageDetail',
                    attributes: ['isHelpBlog']
                }]
            }
            ]
        }).then((response) => {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get List of page Blog Detail
    // GET : /api/v1/helpBlog/getHelpBlogNotesById
    // @return list of Blog
    getHelpBlogNotesById: async (req, res) => {
        const {
            HelpBlogDetail,
            HelpBlog,
            HelpBlogKeyword,
            sequelize
        } = req.app.locals.models;
        if (req.params.Id) {
            try {
                var functionDetail = await sequelize.query('Select fun_getTimeZone() as TimeZone,fun_getDateTimeFormat() as dateFormat', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            HelpBlog.findOne({
                where: {
                    Id: req.params.Id
                },
                attributes: ['id', 'title', 'pageID'],
                include: [{
                    model: HelpBlogKeyword,
                    as: 'helpBlogKeyword',
                    attributes: ['Id', 'keyword']
                }, {
                    model: HelpBlogDetail,
                    as: 'helpBlogDetail',
                    attributes: ['Id', 'helpBlogId', 'description', 'isSystemGenerated', 'displayOrder', 'title',
                        [sequelize.fn('fun_getUserNameByID', sequelize.col('helpBlogDetail.updatedBy')), 'updatedBy'],
                        [sequelize.fn('fun_ApplyCommonDateTimeFormatByParaValue', sequelize.col('helpBlogDetail.updatedAt'), functionDetail[0].TimeZone, functionDetail[0].dateFormat), 'updatedAt']],
                    order: [
                        ['displayOrder', 'ASC']
                    ]
                }]
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(detailModuleName),
                        err: null,
                        data: null
                    });
                } else {
                    _.each(response.helpBlogDetail, (item) => {
                        item.description = COMMON.getTextAngularValueFromDB(item.description);
                    });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Remove Release Details
    // POST : /api/v1/helpBlog/deleteHelpBlogNotes
    // @return API response
    deleteHelpBlogNotes: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objID.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.HELP_BLOG_DET.Name,
                    IDs: req.body.objID.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objID.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(detailModuleName))).catch((err) => {
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
    // save help blog note details
    // POST : /api/v1/helpBlog/saveHelpBlogNotes
    // @return API response
    saveHelpBlogNotes: (req, res) => {
        const {
            HelpBlogDetail
        } = req.app.locals.models;
        if (req.body) {
            if (req.body.id) {
                // Update
                req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
                COMMON.setModelUpdatedByFieldValue(req);
                return HelpBlogDetail.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: detailsinputFields
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(detailModuleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else {
                // Create
                req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
                COMMON.setModelCreatedByFieldValue(req);
                return HelpBlogDetail.create(req.body, {
                    fields: detailsinputFields
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(detailModuleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
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
    // get help blog history
    // POST : /api/v1/helpBlog/getHelpBlogHistory
    // @return API response
    getHelpBlogHistory: (req, res) => {
        if (req.body && req.body.helpBlogId) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            sequelize.query('CALL Sproc_RetrieveHelpBlogHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:phelpBlogDetId,:phelpBlogId)', {
                replacements: {
                    ppageIndex: req.body.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    phelpBlogDetId: req.body.helpBlogDetId || null,
                    phelpBlogId: req.body.helpBlogId
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => {
                _.each(response[1], (item) => {
                    if (item.Colname === 'Description') {
                        item.Oldval = COMMON.getTextAngularValueFromDB(item.Oldval);
                        item.Newval = COMMON.getTextAngularValueFromDB(item.Newval);
                    }
                });
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    blogHistory: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
                }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });

        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get page Blog Detail
    // GET : /api/v1/helpBlog/getHelpBlogDetailById
    // @return list of Blog details based on detail id
    getHelpBlogDetailById: (req, res) => {
        const {
            HelpBlogDetail
        } = req.app.locals.models;
        if (req.params.id) {
            HelpBlogDetail.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'title', 'helpBlogId', 'description', 'isSystemGenerated', 'displayOrder']
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(detailModuleName),
                        err: null,
                        data: null
                    });
                } else {
                    _.each(response, (item) => {
                        item.description = COMMON.getTextAngularValueFromDB(item.description);
                    });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    //Update DisplayOrder in bulk
    //POST : /api/v1/helpBlog/updateBulkDisplayOrder
    //@return response of updation
    updateBulkDisplayOrder: (req, res) => {
        const {
            sequelize,
            HelpBlogDetail
        } = req.app.locals.models;

        if (req.body && req.body.list.length > 0) {
            return sequelize.transaction().then((t) => {
                const promises = [];
                _.each(req.body.list, (element => {
                    promises.push(
                        HelpBlogDetail.findOne({
                            where: {
                                id: element.Id,
                                helpBlogId: element.helpBlogId,
                                isDeleted: false
                            },
                            transaction: t
                        })
                            .then((data) => {
                                if (data) {
                                    return HelpBlogDetail.update({
                                        displayOrder: element.displayOrder
                                    }, {
                                        where: {
                                            id: element.Id,
                                            isDeleted: false
                                        },
                                        fields: ['displayOrder'],
                                        transaction: t
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        t.rollback();
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    });
                                } else {
                                    console.trace();
                                    t.rollback();
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: '',
                                        data: null
                                    });
                                }
                            })
                    );

                }));

                return Promise.all(promises).then((response) => {
                    t.commit();
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.SAVED(detailModuleName));
                })
                    .catch((err) => {
                        console.trace();
                        t.rollback();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    })
            })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                })
        } else {
            console.trace();
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: '',
                data: null
            });
        }
    },
    // Get HepBlog note Details in PDF document
    // POST : /api/v1/getHelpBlogTemplateDetails
    getHelpBlogTemplateDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        var htmlString = '';
        var headerString = '';
        var footerString = '';
        var templateData;
        var htmlContent;
        var promise = [];
        let outStream;
        let pdfWriter;
        let finalBuffer = [];
        var resultStream = '';
        var helpBlogList = [];
        // const margin = '{"top":"0px", "right":"50px", "bottom":"0px", "left":"0px"}';
        if (req.body) {
            return sequelize.query('CALL Sproc_GetDownloadHelpBlogDetails(:phelpBlogId,:phelpBlogDetailId)', {
                replacements: {
                    phelpBlogId: req.body.helpBlogId || null,
                    phelpBlogDetailId: req.body.helpBlogDetailID ? req.body.helpBlogDetailID.toString() : null
                },
                type: sequelize.QueryTypes.SELECT
                // eslint-disable-next-line consistent-return
            }).then((responselist) => {
                if (responselist && responselist.length > 0 && responselist[0]) {
                    helpBlogList = responselist[0];
                    htmlString = '';
                    headerString = '';
                    footerString = '';
                    finalBuffer = new Array(helpBlogList.length);
                    let helpBlogDetIndex;
                    _.each(helpBlogList, (helpBlogData, index) => {
                        helpBlogData.helpBlogDetIndex = index;
                        htmlString = fs.readFileSync(`${DATA_CONSTANT.DEFAULT_PDF_FORMAT_PATH}/helpblog-template.html`).toString();
                        helpBlogData.title = COMMON.getTextAngularValueFromDB(helpBlogData.title);
                        htmlString = htmlString.replace(new RegExp('##HelpBlogSectionTitle##', 'g'), (helpBlogData.title ? helpBlogData.title : ''));                        
                        helpBlogData.description = helpBlogData.description ? helpBlogData.description.replace(/<\!--.*?-->/g, "") : "";
                        helpBlogData.description = COMMON.getTextAngularValueFromDB(helpBlogData.description);
                        htmlString = htmlString.replace(new RegExp('##HelpBlogSectionContent##', 'g'), helpBlogData.description);
                        htmlString = htmlString.replace(new RegExp('##HelpBlogSectionLastDate##', 'g'), helpBlogData.lastModified);
                        htmlString = htmlString.replace(new RegExp('##HelpBlogSectionLastModifiedBy##', 'g'), helpBlogData.lastModifiedBy);
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
                                        headerHeight: '0px',
                                        footerHeight: '80px',
                                        displayHeaderFooter: true,
                                        header: '',
                                        footer: '<div style="border-top: 1px solid black; margin-left: 20px; text-align: right;font-family:Arial;"><div style="float:left">' + helpBlogData.displayOrder + ' - ' + helpBlogData.menuTitle + '</div>Page&nbsp;<span>{#pageNum}</span>&nbsp;of&nbsp;<span>{#numPages}</span></div>'
                                    },
                                    content: htmlContent
                                }
                            }).then((out) => {
                                finalBuffer[parseInt(helpBlogData.helpBlogDetIndex)] = out.content;
                                return STATE.SUCCESS;
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            })
                        );
                    });
                    return Promise.all(promise).then((response) => {
                        if (response && response[0] === STATE.SUCCESS) {
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
                        } else {
                            console.trace();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                                err: '',
                                data: null
                            });
                        }
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
};