const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, Page_Detail, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const moduleName = DATA_CONSTANT.PAGE_DETAIL.NAME;
const inputFields = [
    'pageID',
    'pageName',
    'RO',
    'RW',
    'pageRoute',
    'pageURL',
    'menuRoute',
    'menuName',
    'parentPageRoute',
    'parentPageID',
    'parentTabID',
    'hasChild',
    'orderBy',
    'tabLevel',
    'iconClass',
    'isActive',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isShortcut',
    'displayMenuName',
    'isAllowAsHomePage',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const inputFieldsKeywords = [
    'id',
    'keywords',
    'pageID',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrive list of page details
    // POST : /api/v1/pages/retrivePageDetailList
    // @return list of page details
    retrivePageDetailList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrievePageDetail (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { PageDetails: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    retrivePageDetail: (req, res) => {
        const { PageDetail, PageDetailsKeywords } = req.app.locals.models;
        if (req.params.pageID) {
            return PageDetail.findAll({
                where: { pageID: req.params.pageID },
                include: [{
                    model: PageDetailsKeywords,
                    as: 'pageDetailsKeywords',
                    required: false,
                    attributes: ['keywords']
                }]
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response[0], null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    createPageDetail: (req, res) => {
        const PageDetail = req.app.locals.models.PageDetail;
        if (req.body) {
            if (req.body.isCheckUnique) {
                return PageDetail.findAll({
                    where: {
                        pageName: req.body.pageName
                    },
                    paranoid: false
                }).then((findPageDetail) => {
                    if (findPageDetail.length > 0) {
                        const activePage = _.find(findPageDetail, page => page.deletedAt == null);
                        if (activePage) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PAGE_DETAIL_UNIQUE_FIELD_NAME.PAGE_NAME), err: null, data: null });
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { fieldName: DATA_CONSTANT.PAGE_DETAIL_UNIQUE_FIELD_NAME.PAGE_NAME });
                        }
                    }
                    COMMON.setModelCreatedByFieldValue(req);
                    return PageDetail.create(req.body, {
                        fields: inputFields
                    }).then(response =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.MASTER.PAGE_DETAIL_CREATED)
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                    } else {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            } else {
                return PageDetail.findOne({
                    where: { pageName: req.body.pageName }
                }).then((isExists) => {
                    if (isExists) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PAGE_DETAIL_UNIQUE_FIELD_NAME.PAGE_NAME), err: null, data: null });
                    }
                    COMMON.setModelCreatedByFieldValue(req);
                    return PageDetail.create(req.body, {
                        fields: inputFields
                    }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.MASTER.PAGE_DETAIL_CREATED)).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                    } else {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    updatePageDetail: (req, res) => {
        const PageDetail = req.app.locals.models.PageDetail;
        const { UserPageDetail, HomeMenuCateogory, sequelize, PageDetailsKeywords } = req.app.locals.models;
        if (req.params.pageID) {
            return PageDetail.findOne({
                where: {
                    pageName: req.body.pageName,
                    pageID: { [Op.notIn]: [req.params.pageID] }
                }
            }).then((isExists) => {
                if (isExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PAGE_DETAIL_UNIQUE_FIELD_NAME.PAGE_NAME), err: null, data: null });
                } else {
                    const promises = [];
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelUpdatedByFieldValue(req);
                        PageDetail.update(req.body, {
                            where: {
                                pageID: req.params.pageID
                            },
                            fields: inputFields,
                            transaction: t
                        }).then((rowsUpdated) => {
                            if (rowsUpdated[0] === 1) {
                                if (!req.body.isAllowAsHomePage) {
                                    /*
                                    Used to find the page from the homepage menu and delete from there to in case of page psermission is removed from the perticular user
                                    Author : Azim Kazi
                                    */
                                    promises.push(UserPageDetail.findAll({
                                        where: {
                                            pageID: req.params.pageID
                                        },
                                        attributes: ['userPageID'],
                                        transaction: t
                                        // eslint-disable-next-line consistent-return
                                    }).then((response) => {
                                        if (response) {
                                            // COMMON.setModelDeletedByFieldValue(req);
                                            const updatedData = {
                                                deletedAt: COMMON.getCurrentUTC(),
                                                isDeleted: true,
                                                deletedBy: COMMON.getRequestUserID(req),
                                                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                            };
                                            return HomeMenuCateogory.update(updatedData, {
                                                where: {
                                                    userPageID: { [Op.in]: response.map(x => x.dataValues.userPageID) }
                                                },
                                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                                transaction: t
                                            });
                                        }
                                    }));
                                }
                                if (req.body && req.body.keywords) {
                                    COMMON.setModelCreatedByFieldValue(req);

                                    if (req.body.deletedKeywords.length > 0) {
                                        COMMON.setModelDeletedByFieldValue(req);
                                        const updatedData = {
                                            deletedAt: COMMON.getCurrentUTC(),
                                            isDeleted: true,
                                            deletedBy: COMMON.getRequestUserID(req),
                                            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                        };
                                        promises.push(PageDetailsKeywords.update(updatedData, {
                                            where: {
                                                // keywords: { [Op.in]: deletedKeyWords },
                                                keywords: { [Op.in]: req.body.deletedKeywords },
                                                pageID: req.params.pageID,
                                                deletedAt: null
                                            },
                                            transaction: t,
                                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId']
                                        }).then(() => PageDetailsKeywords.bulkCreate(req.body.keywords, {
                                            fields: inputFieldsKeywords,
                                            transaction: t
                                        })));
                                    } else {
                                        COMMON.setModelCreatedArrayFieldValue(req.user, req.body.keywords);
                                        promises.push(PageDetailsKeywords.bulkCreate(req.body.keywords, {
                                            fields: inputFieldsKeywords,
                                            transaction: t
                                        }));
                                    }
                                }
                                return Promise.all(promises).then((resp) => {
                                    t.commit();
                                    if (resp) {
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { userMessage: Page_Detail.UPDATED }, null);
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.PAGE_DETAIL_NOT_UPDATED, err: null, data: null });
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.PAGE_DETAIL_NOT_UPDATED, err: null, data: null });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            }
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
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    deletePageDetail: (req, res) => {
        const PageDetail = req.app.locals.models.PageDetail;
        if (req.body.objIDs.id) {
            COMMON.setModelDeletedByFieldValue(req);
            const promises = [];
            return PageDetail.findOne({
                where: {
                    pageID: { [Op.in]: req.body.objIDs.id }
                }
            }).then(() => {
                promises.push(PageDetail.destroy({
                    where: {
                        pageID: { [Op.in]: req.body.objIDs.id }
                    }
                }));
                return Promise.all(promises);
            }).then((rowsDeleted) => {
                if (rowsDeleted[0] > 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.PAGE_DETAIL_DELETED);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.PAGE_DETAIL_NOT_DELETED, err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    getParentPageDataList: (req, res) => {
        const { PageDetail } = req.app.locals.models;
        PageDetail.findAll({
            where: { isActive: true },
            attributes: ['pageID', 'pageRoute', 'pageName', 'pageURL'],
            order: [['pageName', 'ASC']]
        }).then(parentPageDetail => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, parentPageDetail, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
        });
    },

    getPageList: (req, res) => {
        const PageDetail = req.app.locals.models.PageDetail;
        const whereClause = {
            isActive: true,
            pageRoute: {
                [Op.ne]: null
            }
        }
        if (!_.isEmpty(req.query)) {
            if (req.query.searchquery) {
                whereClause.pageName = {
                    [Op.like]: `%${req.query.searchquery}%`
                };
            }
        }

        return PageDetail.findAll({
            where: whereClause,
            attributes: ['pageID', 'pageName', 'parentTabID', 'hasChild', 'parentPageID', 'displayMenuName', 'menuName'],
            order: [['displayMenuName', 'ASC']]
        }).then(parentPageDetail => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, parentPageDetail, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
        });
    },


    getPageWithFeatureList: (req, res) => {
        const { PageDetail, FeaturePageDetails } = req.app.locals.models;
        PageDetail.findAll({
            where: {
                isActive: true,
                parentPageID: {
                    [Op.ne]: null
                }
            },
            attributes: ['pageID', 'pageName', 'parentTabID', 'hasChild', 'parentPageID'],
            order: [['pageName', 'ASC']],
            include: [{
                model: FeaturePageDetails,
                as: 'featurePageDetail',
                where: { isActive: true },
                attributes: ['featurePageDetailID', 'featureID'],
                required: false
            }]
        }).then(parentPageDetail => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, parentPageDetail, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
        });
    },

    getPageDetail: (req, res) => {
        const PageDetail = req.app.locals.models.PageDetail;
        PageDetail.findAll({
            where: { isActive: true }
        }).then(parentPageDetail => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, parentPageDetail, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
        });
    },

    // Get page name
    // POST : /api/v1/pages/getPageName
    // @param pageRoute
    // @return page name
    getPageName: (req, res) => {
        const sequelize = req.app.locals.models.sequelize;
        sequelize.query('CALL Sproc_GetPageMenuAndParentTree (:pPageRoute)', {
            replacements: {
                pPageRoute: req.query.pageRoute
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
        });
    },

    // Get page name list
    // GET : /api/v1/pages/getPageNameList
    // @return page name , display menu name list for all active entry
    getPageNameList: (req, res) => {
        const PageDetail = req.app.locals.models.PageDetail;
        if (req && req.query.pageName) {
            PageDetail.findAll({
                where: {
                    isActive: true,
                    isDeleted: false,
                    pageRoute: {
                        [Op.ne]: null
                    },
                    pageName: req.query.pageName
                },
                attributes: ['pageId', 'menuName'],
                order: [['menuName', 'ASC']]
            }).then(pageNameList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, pageNameList)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
            });
        } else {
            PageDetail.findAll({
                where: {
                    isActive: true,
                    isDeleted: false,
                    pageRoute: {
                        [Op.ne]: null
                    }
                },
                attributes: ['pageId', 'menuName'],
                order: [['menuName', 'ASC']]
            }).then(pageNameList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, pageNameList)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
            });
        }
    }
};
