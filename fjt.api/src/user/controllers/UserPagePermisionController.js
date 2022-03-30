const resHandler = require('../../resHandler');
const {
    STATE,
    REQUEST,
    COMMON,
    USER
} = require('../../constant');
const {
    NotCreate,
    InvalidPerameter,
    NotFound
} = require('../../errors');
const _ = require('lodash');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const TimelineController = require('../../timeline/controllers/TimelineController');
const { Op } = require('sequelize');

const timelineObj = DATA_CONSTANT.TIMLINE.EVENTS.NAVIGATE;
const homeMenuModuleName = DATA_CONSTANT.HOME_MENU.Name;
const homeOrder = DATA_CONSTANT.HOME_MENU.Order;
const Bookmark = DATA_CONSTANT.BOOKMARK.Name;

const userRolesField = [
    'createdBy',
    'isActive',
    'isShortcut',
    'PageID',
    'parentPageID',
    'RO',
    'RW',
    'userID'
];

const userPageDetailField = [
    'IsShortcut',
    'IsShowInHomePage',
    'RO',
    'RW',
    'hasChild',
    'iconClass',
    'isActive',
    'isAllowAsHomePage',
    'isDisplay',
    'isHelpBlog',
    'isPageChecked',
    'isReadOnlyDeveloped',
    'menuName',
    'menuRoute',
    'PageID',
    'pageName',
    'pageRoute',
    'pageURL',
    'paramDet',
    'parentPageID',
    'roleID',
    'userID',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'updateByRoleId',
    'createByRoleId'
]; 

module.exports = {
    getuserPagePermision: (req, res) => {
        const {
            UserPageDetail
        } = req.app.locals.models;
        // let roleIDs = req.params.id.split(',') || [];
        if (req.params.id) {
            UserPageDetail.findAll({
                where: {
                    userID: req.params.id
                },
                attributes: ['userPageID', 'userID', 'PageID', 'RO', 'RW', 'isActive', 'isShortcut']
            }).then(data => resHandler.successRes(res, 200, STATE.SUCCESS, data)).catch((err) => {
                console.trace();
                console.error(err);
            });
        }
    },
    getMenuPages: (req, res) => {
        const {
            sequelize,
            UserPageDetail,
            PageDetail
        } = req.app.locals.models;
        var promises = [];
        const pageList = [];
        if (req.params.id) {
            promises.push(
                UserPageDetail.findAll({
                    where: {
                        userID: req.params.id,
                        roleID: req.params.roleId,
                        isActive: true
                    },
                    attributes: ['userPageID', 'userID', 'PageID', 'RO', 'RW', 'isActive', 'isShortcut'],
                    include: [{
                        model: PageDetail,
                        as: 'PageDetails',
                        attributes: ['menuName', 'pageRoute', 'pageURL', 'menuRoute', 'iconClass', 'orderBy', 'parentPageID', 'pageName', 'displayMenuName', 'isPopup', 'popupFunName', 'isHideFromMenuList', 'paramDet'],
                        order: [
                            ['orderBy', 'ASC']
                        ],
                        required: false,
                        where: {
                            isActive: true
                        }
                    }]
                }).then(data => data).catch((err) => {
                    console.trace();
                    console.error(err);
                    return [];
                })
            );
            promises.push(
                PageDetail.findAll({
                    where: {
                        hasChild: true,
                        isActive: true
                    },
                    attributes: ['pageID', 'menuName', 'pageRoute', 'pageURL', 'menuRoute', 'iconClass', 'orderBy', 'parentPageID', 'pageName', 'displayMenuName', 'isPopup', 'popupFunName', 'isHideFromMenuList', 'paramDet']
                }).then(item => item).catch((err) => {
                    console.trace();
                    console.error(err);
                    return [];
                }));
            promises.push(
                sequelize
                .query('CALL Sproc_GetUserPageFeaturesDetails (:puserID, :proleID)', {
                    replacements: {
                        puserID: req.params.id,
                        proleID: req.params.roleId
                    }
                })
                .then(featureRightsList => featureRightsList).catch((err) => {
                    console.trace();
                    console.error(err);
                    return [];
                })
            );


            return Promise.all(promises).then((resp) => {
                pageList.push(resp[0]);
                pageList.push(resp[1]);
                const objDet = {
                    pageDetailList: pageList,
                    featurePageDetail: resp[2]
                };
                return resHandler.successRes(res, 200, STATE.SUCCESS, objDet);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.FAILED, new NotFound(USER.NOT_FOUND));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Get shortcut list
    // GET : /api/v1/getShortcutList/:id/:roleId
    // @return shortcut list
    getShortcutList: (req, res) => {
        const {
            UserPageDetail,
            PageDetail
        } = req.app.locals.models;
        if (req.params.id && req.params.roleId) {
            return UserPageDetail.findAll({
                where: {
                    userID: req.params.id,
                    roleID: req.params.roleId,
                    isActive: true,
                    isDeleted: false
                },
                attributes: [
                    ['isShortcut', 'hasShortcut'], 'pageID', 'displayOrder'
                ],
                order: [
                    ['displayOrder', 'ASC']
                ],
                include: [{
                    model: PageDetail,
                    as: 'PageDetails',
                    attributes: [
                        ['menuName', 'title'],
                        ['pageRoute', 'state'],
                        ['pageRoute', 'uisref'], 'pageURL', ['menuRoute', '_path'],
                        ['iconClass', 'icon'],
                        ['orderBy', 'weight'], 'parentPageID', ['pageName', '_id'], 'displayMenuName', 'isPopup', 'popupFunName', 'paramDet'
                    ],
                    order: [
                        ['orderBy', 'ASC']
                    ],
                    required: true,
                    where: {
                        isAllowAsHomePage: 1,
                        isActive: true,
                        isDisplay: 1,
                        isDeleted: false
                    }
                }]
            }).then(data => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                shortcutList: data
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    isPageAccess: (req, res) => {
        const {
            UserPageDetail,
            PageDetail,
            User,
            HelpBlog
        } = req.app.locals.models;
        let pageDet;
        if (req.body.pageRoute) {
            return User.findOne({
                where: {
                    id: req.body.id
                },
                attributes: ['id']
            }).then((user) => {
                if (user) {
                    return UserPageDetail.findAll({
                        attributes: ['userID', 'PageID', 'roleID', 'RO', 'RW', 'isHelpBlog'],
                        where: {
                            userID: req.body.id,
                            roleID: req.body.roleID,
                            isActive: true
                        },
                        include: [{
                            model: PageDetail,
                            as: 'PageDetails',
                            attributes: ['pageRoute', 'pageID', 'displayMenuName', 'pageName', 'parentPageID', 'menuName'],
                            where: {
                                pageRoute: req.body.pageRoute,
                                isActive: true
                            },
                            required: true,
                            include: [{
                                model: HelpBlog,
                                as: 'helpBlog',
                                attributes: ['pageID'],
                                required: false
                            }]
                        }]
                    }).then((pageData) => {
                        if (pageData.length === 0) {
                            if (req.body.pageRoute === 'app.dashboard') {
                                return UserPageDetail.findAll({
                                    attributes: ['userID', 'PageID', 'roleID'],
                                    where: {
                                        userID: req.body.id,
                                        roleID: req.body.roleID,
                                        isActive: true
                                    },
                                    include: [{
                                        model: PageDetail,
                                        as: 'PageDetails',
                                        attributes: ['pageRoute', 'pageID', 'menuRoute', 'displayMenuName', 'pageName', 'menuName'],
                                        where: {
                                            menuRoute: {
                                                [Op.and]: [{
                                                        [Op.ne]: null
                                                    },
                                                    {
                                                        [Op.ne]: ''
                                                    }
                                                ]
                                            },
                                            hasChild: false,
                                            [Op.or]: [{
                                                    tabLevel: {
                                                        [Op.ne]: 0
                                                    }
                                                },
                                                {
                                                    tabLevel: null
                                                }
                                            ],
                                            pageRoute: {
                                                [Op.and]: [{
                                                        [Op.ne]: null
                                                    },
                                                    {
                                                        [Op.ne]: ''
                                                    }
                                                ]
                                            }
                                        },
                                        required: true
                                    }],
                                    order: [
                                        [{
                                            model: PageDetail,
                                            as: 'PageDetails'
                                        }, 'menuRoute', 'ASC']
                                    ]
                                }).then((pageDetails) => {
                                    if (pageDetails && pageDetails.length > 0) {
                                        pageDet = _.first(pageDetails);
                                        return resHandler.successRes(res, 200, STATE.SUCCESS, pageDet);
                                    } else {
                                        return resHandler.successRes(res, 200, STATE.SUCCESS);
                                    }
                                });
                            }
                        } else {
                            pageDet = _.first(pageData);
                        }
                        if (pageDet) {
                            // [S] add log for timeline of user
                            if (!req.body.toPageTitle) {
                                req.body.toPageTitle = pageDet.PageDetails.menuName;
                            }
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: req.body.toPageTitle ? COMMON.stringFormat(timelineObj.title, req.body.toPageTitle) : timelineObj.title_relaod,
                                eventDescription: req.body.toPageTitle ? COMMON.stringFormat(timelineObj.description, req.user.username, req.body.toPageTitle) : COMMON.stringFormat(timelineObj.description_relaod, req.user.username),
                                refTransTable: null,
                                refTransID: null,
                                eventType: timelineObj.id,
                                url: null,
                                eventAction: null
                            };
                            req.objEvent = objEvent;
                            return TimelineController.createTimeline(req).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, pageDet)).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, 200, STATE.FAILED, new NotFound(USER.NOT_FOUND));
                            });
                            // [E] add log for timeline of user
                        } else {
                            return resHandler.successRes(res, 200, STATE.SUCCESS, pageDet);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                    });
                } else {
                    return resHandler.errorRes(res, 200, STATE.FAILED, new NotFound(USER.NOT_FOUND));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    updateuserPagePermision: (req, res) => {
        const {
            sequelize,
            UserPageDetail
        } = req.app.locals.models;

        if (req.body.length > 0) {
            return sequelize.transaction().then(t => UserPageDetail.findAll({
                where: {
                    userID: req.params.id
                },
                transaction: t
            }).then((pageList) => {
                const promises = [];
                if (pageList.length > 0) {
                    let existpagePermision = [];
                    existpagePermision = pageList.map(pages => pages.PageID);
                    _.each(req.body, (pagePermison) => {
                        if (_.includes(existpagePermision, pagePermison.PageID)) {
                            promises.push(UserPageDetail.update(pagePermison, {
                                where: {
                                    userID: pagePermison.userID,
                                    roleID: pagePermison.RoleID,
                                    PageID: pagePermison.PageID
                                },
                                transaction: t
                            }));
                        } else {
                            pagePermison.createdBy = req.user.id;
                            promises.push(UserPageDetail.create(pagePermison, {
                                fields: userRolesField,
                                transaction: t
                            }));
                        }
                    });
                } else {
                    COMMON.setModelCreatedArrayFieldValue(req.user, req.body);
                    COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body);
                    promises.push(UserPageDetail.bulkCreate(req.body, {
                        transaction: t
                    }));
                }
                return Promise.all(promises).then((pagePermission) => {
                    return module.exports.setDisplayOrder(req, req.query.list, t).then((response) => {
                        if (response && response.status === STATE.SUCCESS) {
                            return t.commit().then(() => {
                                const ShortcutFlag = _.first(req.body);
                                if (!ShortcutFlag.isShortcutFlag) {
                                    return resHandler.successRes(res, 200, STATE.SUCCESS, {
                                        userMessage: MESSAGE_CONSTANT.USER.USER_PAGERIGHTS
                                    });
                                } else if (ShortcutFlag.isShortcut) {
                                    return resHandler.successRes(res, 200, STATE.SUCCESS, pagePermission, MESSAGE_CONSTANT.USER.ADDED_TO_BOOKMARK);
                                } else {
                                    return resHandler.successRes(res, 200, STATE.SUCCESS, pagePermission, MESSAGE_CONSTANT.USER.REMOVE_TO_BOOKMARK);
                                }
                            });
                        } else {
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: response ? response.err : null,
                                data: null
                            });
                        }
                    }).catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.USER.ENABLE_USER_PAGERIGHT, err));
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.USER.ENABLE_USER_PAGERIGHT, err));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                t.rollback();
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.USER.ENABLE_USER_PAGERIGHT, err));
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.USER.ENABLE_USER_PAGERIGHT, err));
            });
        } else {
            return resHandler.successRes(res, 200, STATE.EMPTY, null);
        }
    },

    // Retrieve all employees list based on page rights, based on role or get all
    // POST : /api/v1/userPagePermision/retrieveEmployeeListForRights
    // @return data
    retrieveEmployeeListForRights: (req, res) => {
        const { sequelize } = req.app.locals.models;
            return sequelize
                .query('CALL Sproc_retrieveEmployeeListForRights (:pPageID, :pRoleID)',
                    {
                        replacements: {
                            pPageID: req.body.pageId ? req.body.pageId : null,
                            pRoleID: req.body.selectedRole ? req.body.selectedRole : null                          
                        }
                    })
                .then((getEmployeeData) => {
                    if (!getEmployeeData) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(entityEmployeeModuleName), err: null, data: null });
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEmployeeData, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
    },

    // Update multiple page rights of selected users
    // POST : /api/v1/userPagePermision/updateMulitpleUserPagePermision
    // @return message
    updateMulitpleUserPagePermision: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                return sequelize
                .query('CALL Sproc_updateMulitpleUserPagePermision (:pSelectedRole, :pSelectedPages, :pSelectedUsers, :pCreatedBy, :pRightsPermission, :pCreatedByRoleId)',
                    {
                        replacements: {
                            pSelectedRole: req.body.selectedRole,
                            pSelectedPages: req.body.selectedpages.toString(),
                            pSelectedUsers: req.body.userIds.toString(),
                            pCreatedBy: req.body.createdBy,
                            pRightsPermission: req.body.permissionRights,
                            pCreatedByRoleId: req.body.createdByRoleId
                        },
                        transaction: t
                    })
                .then(() => {
                    t.commit().then(() => {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.SAVE_ROLE);
                    });
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            });  
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get getHomePageMenu
    // POST : /api/v1/getHomePageMenu
    // @return API Response
    getHomePageMenu: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize
                .query('CALL Sproc_GetHomePageMenu (:userID, :roleID)', {
                    replacements: {
                        userID: req.body.userid,
                        roleID: req.body.defaultLoginRoleID
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(featureRightsList => resHandler.successRes(res, 200, STATE.SUCCESS, _.values(featureRightsList[0]))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.FAILED, new NotFound(USER.NOT_FOUND));
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Get getHomeMenuCategory
    // POST : /api/v1/getHomeMenuCategory
    // @return API Response
    getHomeMenuCategory: (req, res) => {
        const {
            GenericCategory,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            GenericCategory.findAll({
                where: {
                    isActive: 1,
                    categoryType: 'Home Menu Category'
                },

                order: [sequelize.fn('ISNULL', sequelize.col('displayOrder')), ['displayOrder', 'ASC']]
            }).then((resp) => {
                if (!resp) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null);
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
    },
    // Get createMenuDisplayOrder
    // POST : /api/v1/createMenuDisplayOrder
    // @return API Response
    createMenuDisplayOrder: (req, res) => {
        const {
            sequelize,
            HomeMenuCateogory,
            GenericCategory
        } = req.app.locals.models;
        var displayOrder = 0;
        if (req.body && req.body.listObj && req.body.listObj.menuList) {
            return GenericCategory.findOne({
                where: {
                    isActive: 1,
                    gencCategoryID: req.body.listObj.gencCategoryID
                }
            }).then((resp) => {
                if (!resp) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(`${req.body.listObj.gencCategoryName} category`),
                        err: null,
                        data: null
                    });
                }

                return sequelize.transaction((t) => {
                    const promises = [];
                    const duplicatePageList = [];
                    _.each(req.body.listObj.menuList, (item) => {
                        displayOrder += 1;
                        /* update display_order of already exists */
                        if (item.Id) {
                            item.displayOrder = displayOrder;
                            promises.push(
                                HomeMenuCateogory.findOne({
                                    where: {
                                        userPageID: item.userPageID,
                                        genericCategoryID: req.body.listObj.gencCategoryID,
                                        Id: {
                                            [Op.ne]: item.Id
                                        }
                                    },
                                    transaction: t
                                }).then((findData) => {
                                    if (findData) {
                                        duplicatePageList.push(item.userPageID);
                                        return Promise.resolve({ duplicatePageList: duplicatePageList });
                                    } else {
                                        return HomeMenuCateogory.update({
                                            displayOrder: item.displayOrder,
                                            genericCategoryID: req.body.listObj.gencCategoryID,
                                            deletedAt: null
                                        }, {
                                            where: {
                                                Id: item.Id
                                            },
                                            fields: ['displayOrder', 'genericCategoryID', 'deletedAt']
                                        }, {
                                            transaction: t
                                        }).then(response => Promise.resolve(response));
                                    }
                                })
                            );
                        } else if (item) {
                            promises.push(
                                HomeMenuCateogory.findOne({
                                    where: {
                                        userPageID: item.userPageID,
                                        genericCategoryID: req.body.listObj.gencCategoryID
                                    },
                                    transaction: t
                                }).then((findData) => {
                                    if (findData) {
                                        duplicatePageList.push(item.userPageID);
                                        return Promise.resolve({ duplicatePageList: duplicatePageList });
                                    } else {
                                        return HomeMenuCateogory.create({
                                            userPageID: item.userPageID,
                                            genericCategoryID: req.body.listObj.gencCategoryID,
                                            displayOrder: displayOrder,
                                            createdBy: req.user.id,
                                            roleID: req.body.listObj.roleID
                                        }, {
                                            transaction: t
                                        }).then(response => Promise.resolve(response));
                                    }
                                })
                            );
                        }
                    });
                    return Promise.all(promises);
                }).then((result) => {
                    if (result) {
                        const pageList = result.find(o => 'duplicatePageList' in o);
                        if (pageList) {
                            const messageContentHomeMenuCatDuplicate = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.HOME_MENU_CATEGORY_DUPLICATE_ENTRY);
                            messageContentHomeMenuCatDuplicate.message = COMMON.stringFormat(messageContentHomeMenuCatDuplicate.message, req.body.listObj.gencCategoryName);
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.SUCCESS, {
                                messageContent: messageContentHomeMenuCatDuplicate,
                                duplicatePageList: pageList.duplicatePageList
                            });
                        } else if (req.body.listObj.isMenuItemDisplayOrderChanged) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.SAVED(homeOrder));
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.SAVED(homeMenuModuleName));
                        }
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.NOT_SAVED(homeOrder),
                            err: null,
                            data: null
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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
    // Get getHomeMenuListOrderWise
    // POST : /api/v1/getHomeMenuListOrderWise
    // @return API Response
    getHomeMenuListOrderWise: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize
                .query('CALL Sproc_GetHomeMenuCategory (:userID,:roleID)', {
                    replacements: {
                        userID: req.body.userid,
                        roleID: req.body.defaultLoginRoleID
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(HomeMenuCategory => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(HomeMenuCategory[0]))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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
    // Get createGenericCategoryDisplayOrder
    // POST : /api/v1/createGenericCategoryDisplayOrder
    // @return API Response
    createGenericCategoryDisplayOrder: (req, res) => {
        const {
            sequelize,
            GenericCategory
        } = req.app.locals.models;
        var displayOrder = 0;
        if (req.body && req.body.objModel) {
            return sequelize.transaction((t) => {
                const promises = [];
                _.each(req.body.objModel, (item, index) => {
                    displayOrder = index + 1;
                    promises.push(
                        GenericCategory.update({
                            displayOrder: displayOrder
                        }, {
                            where: {
                                gencCategoryID: item.gencCategoryID
                            },
                            fields: ['displayOrder'],
                            transaction: t
                        }));
                });
                return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.SAVED(homeOrder))).catch((err) => {
                    t.rollback();
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Get createUserPageDtailsDisplayOrder
    // POST : /api/v1/createUserPageDtailsDisplayOrder
    // @return API Response
    createUserPageDtailsDisplayOrder: (req, res) => {
        const {
            sequelize,
            UserPageDetail
        } = req.app.locals.models;
        var displayOrder = 0;
        if (req.body && req.body.objModel.objList) {
            return sequelize.transaction((t) => {
                const promises = [];
                _.each(req.body.objModel.objList, (item, index) => {
                    displayOrder = index + 1;
                    if (item.userPageID) {
                        promises.push(UserPageDetail.update({
                            displayOrder: displayOrder
                        }, {
                            where: {
                                userPageID: item.userPageID
                            },
                            fields: ['displayOrder']
                        }, {
                            transaction: t
                        }).then(response => Promise.resolve(response)));
                    }
                });
                return Promise.all(promises);
            }).then((result) => {
                if (result) {
                    return resHandler.successRes(res, 200, STATE.SUCCESS, {
                        userMessage: MESSAGE_CONSTANT.HOME_MENU.SUCCESS_MESSAGE
                    });
                } else {
                    return resHandler.successRes(res, 200, STATE.SUCCESS, {
                        userMessage: MESSAGE_CONSTANT.HOME_MENU.ERROR_MESSAGE
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
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get deleteHomeMenuItem
    // POST : /api/v1/deleteHomeMenuItem
    // @return API Response
    deleteHomeMenuItem: (req, res) => {
        const {
            HomeMenuCateogory
        } = req.app.locals.models;
        if (req.body.Id) {
            return HomeMenuCateogory.destroy({
                where: {
                    Id: req.body.Id
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.REMOVED(homeMenuModuleName))).catch((err) => {
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
    // Get deleteHomeMenuItem
    // POST : /api/v1/deleteHomeMenuItem
    // @return API Response
    CheckIsExistsHomeCategoryMenuItem: (req, res) => {
        const {
            HomeMenuCateogory
        } = req.app.locals.models;
        // if (req.body.objModel.userPageID) {
        HomeMenuCateogory.findOne({
            where: {
                userPageID: req.body.objModel.userPageID,
                genericCategoryID: req.body.objModel.gencCategoryID
            }
        }).then((response) => {
            if (response) {
                return resHandler.errorRes(res, 200, STATE.FAILED, 'Duplicate menu');
            } else {
                return resHandler.successRes(res, 200, STATE.SUCCESS);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(homeMenuModuleName)));
        });
    },

    // POST Update Bookmark Display Order
    // POST : /api/v1/updateBookmarkDisplayOrder
    // @return API Response
    updateBookmarkDisplayOrder: (req, res) => {
        const {
            sequelize,
            UserPageDetail
        } = req.app.locals.models;
        var displayOrder = 0;
        if (req.body && req.body.listObj) {
            return sequelize.transaction().then((t) => {
                    const promises = [];
                    _.each(req.body.listObj, (item) => {
                        displayOrder += 1;
                        if (item.pageID) {
                            item.displayOrder = displayOrder;
                            promises.push(
                                UserPageDetail.findOne({
                                    where: {
                                        pageID: item.pageID,
                                        roleID: req.body.roleID,
                                        userID: req.body.userID,
                                        isShortcut: true,
                                        isDeleted: false
                                    },
                                    transaction: t
                                }).then((userPage) => {
                                    if (userPage) {
                                        return UserPageDetail.update({
                                            displayOrder: item.displayOrder,
                                        }, {
                                            where: {
                                                pageID: item.pageID,
                                                roleID: req.body.roleID,
                                                userID: req.body.userID,
                                                isDeleted: false
                                            },
                                            fields: ['displayOrder'],
                                            transaction: t
                                        });
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    t.rollback();
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                })
                            );
                        }
                    });
                    return Promise.all(promises)
                        .then(() => {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.SAVED(Bookmark));
                        })
                        .catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                        err: null,
                        data: null
                    });
                });

        }
    },

    //Assign DisplayOrder to the list
    //@return success/faliure for the process
    setDisplayOrder: (req, list, t) => {
        const {
            UserPageDetail
        } = req.app.locals.models;
        const promises = [];
        if (list && list.length > 0) {
            // var displayOrder = 0;
            if (Array.isArray(list)) {
                _.each(list, (element) => {
                    element = JSON.parse(element);
                    promises.push(
                        UserPageDetail.update({
                            displayOrder: element.displayOrder
                        }, {
                            where: {
                                pageID: element.PageID,
                                roleID: element.roleID,
                                userID: element.userID,
                                isShortcut: true,
                                isDeleted: false,
                                isActive: true
                            },
                            fields: ['displayOrder'],
                            transaction: t
                        }).then(() => {})
                        .catch((err) => {
                            console.trace();
                            console.error(err);
                            return { status: STATE.FAILED, err }
                        })
                    )
                })
            } else {
                list = JSON.parse(list);
                promises.push(
                    UserPageDetail.update({
                        displayOrder: list.displayOrder
                    }, {
                        where: {
                            pageID: list.PageID,
                            roleID: list.roleID,
                            userID: list.userID,
                            isShortcut: true,
                            isDeleted: false,
                            isActive: true
                        },
                        fields: ['displayOrder'],
                        transaction: t
                    }).then(() => {})
                    .catch((err) => {
                        console.trace();
                        console.error(err);
                        return { status: STATE.FAILED, err };
                    })
                );
            }
        }

        return Promise.all(promises)
            .then(() => {
                return { status: STATE.SUCCESS };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err };
            });
    }
};