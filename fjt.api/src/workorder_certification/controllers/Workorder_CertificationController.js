const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
// const { NotCreate, InvalidPerameter } = require('../../errors');
const TimelineController = require('../../timeline/controllers/TimelineController');

const timelineObj = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_CERTIFICATION;
const workorderCertificationObj = DATA_CONSTANT.TIMLINE.WORKORDER_CERTIFICATION;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
const woCertimoduleName = DATA_CONSTANT.WORKORDER_CERTIFICATION.NAME;

const inputFields = [
    'woCertificationID',
    'woID',
    'certificateStandardID',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'classIDs',
    'isDeleted',
    'createdAt',
    'updatedAt',
    'deletedAt'
];

const componentInputFields = [
    'id',
    'componentID',
    'certificateStandardID',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'ClassID',
    'isDeleted',
    'createdAt',
    'updatedAt',
    'deletedAt'
];


module.exports = {
    // Save work-order certificate list
    // POST : /api/v1/workorder_certification/createWorkorder_CertificateList
    // @return API response
    createWorkorder_CertificateList: (req, res) => {
        const { sequelize, Workorder, WorkorderCertification, ComponentStandardDetails } = req.app.locals.models;
        // let woCertPromise = [];
        if (req.body) {
            return Workorder.findAll({
                where: {
                    woStatus: { [Op.notIn]: [COMMON.WOSTATUS.COMPLETED, COMMON.WOSTATUS.VOID, COMMON.WOSTATUS.TERMINATED] },
                    partID: req.body.listObj.partID
                },
                attributes: ['woID']
            }).then((workorderlist) => {
                let allWOIDsToChange = null;
                if (workorderlist && workorderlist.length > 0) {
                    allWOIDsToChange = _.map(workorderlist, 'woID');
                }

                return sequelize.transaction().then((t) => {
                    const allStandardListToChange = Object.assign({}, req.body.listObj.categoryList);
                    let allCertificateStandardIDsOfExistsData = null;
                    // let allClassIDsOfExistsData = null;

                    const allExistsStandards = _.filter(allStandardListToChange, item => item.woCertificationID);
                    if (allExistsStandards && allExistsStandards.length > 0) {
                        allCertificateStandardIDsOfExistsData = _.map(allExistsStandards, 'certificateStandardID');
                        // allClassIDsOfExistsData =  _.map(allExistsStandards,'classIDs');
                    }

                    COMMON.setModelDeletedByFieldValue(req);

                    /* remove all standards (that deleted from ui) from  work orders which contain same partID  */
                    const woCertiDeletewhereClause = {
                        woID: allWOIDsToChange,
                        deletedAt: null
                    };
                    if (allCertificateStandardIDsOfExistsData) {
                        woCertiDeletewhereClause.certificateStandardID = { [Op.notIn]: allCertificateStandardIDsOfExistsData };
                    }
                    return WorkorderCertification.update(req.body, {
                        where: woCertiDeletewhereClause,
                        fields: ['deletedBy', 'isDeleted', 'deletedAt', 'updatedBy'],
                        transaction: t
                    }).then(() =>
                        /* find all existing work order certification */
                        WorkorderCertification.findAll({
                            where: {
                                woID: allWOIDsToChange,
                                certificateStandardID: { [Op.in]: allCertificateStandardIDsOfExistsData || [] }
                            },
                            attributes: ['woCertificationID', 'woID', 'certificateStandardID', 'classIDs', 'createdBy', 'updatedBy'],
                            transaction: t
                        }).then((existsAllDBWoCerti) => {
                            let allWOStandardsForAddUpdate = [];
                            if (existsAllDBWoCerti && existsAllDBWoCerti.length > 0) {
                                allWOStandardsForAddUpdate = existsAllDBWoCerti.map(node => node.get({ plain: true }));
                            }

                            /* check if certificate data exists then update only class else new entry */
                            _.each(allStandardListToChange, (allStdItem) => {
                                _.each(allWOIDsToChange, (WOItem) => {
                                    const certiData = _.find(allWOStandardsForAddUpdate, dbItem => dbItem.woID === WOItem && allStdItem.certificateStandardID === dbItem.certificateStandardID);
                                    if (certiData) {
                                        certiData.classIDs = allStdItem.classIDs;
                                    } else {
                                        const addCertiObj = {};
                                        addCertiObj.woCertificationID = null;
                                        addCertiObj.woID = WOItem;
                                        addCertiObj.certificateStandardID = allStdItem.certificateStandardID;
                                        addCertiObj.classIDs = allStdItem.classIDs;
                                        addCertiObj.createdBy = req.user.id;
                                        addCertiObj.updatedBy = req.user.id;
                                        allWOStandardsForAddUpdate.push(addCertiObj);
                                    }
                                });
                            });

                            COMMON.setModelCreatedArrayFieldValue(req.user, allWOStandardsForAddUpdate);
                            COMMON.setModelUpdatedByArrayFieldValue(req.user, allWOStandardsForAddUpdate);

                            /* create/update work order certification */
                            return WorkorderCertification.bulkCreate(allWOStandardsForAddUpdate, {
                                updateOnDuplicate: inputFields,
                                transaction: t
                            }).then(() => {
                                /* remove all standards (that deleted from ui) from  component of same partID  */
                                const compCertiDeletewhereClause = {
                                    componentID: req.body.listObj.partID,
                                    deletedAt: null
                                };
                                if (allCertificateStandardIDsOfExistsData) {
                                    compCertiDeletewhereClause.certificateStandardID = { [Op.notIn]: allCertificateStandardIDsOfExistsData };
                                }
                                return ComponentStandardDetails.update(req.body, {
                                    where: compCertiDeletewhereClause,
                                    fields: ['deletedBy', 'isDeleted', 'deletedAt', 'updatedBy'],
                                    transaction: t
                                }).then(() =>
                                    /* find existing component standards */
                                    ComponentStandardDetails.findAll({
                                        where: {
                                            componentID: req.body.listObj.partID,
                                            certificateStandardID: { [Op.in]: allCertificateStandardIDsOfExistsData || [] }
                                        },
                                        attributes: ['id', 'componentID', 'certificateStandardID', 'ClassID', 'createdBy', 'updatedBy'],
                                        transaction: t
                                    }).then((existsAllDBComponentCerti) => {
                                        let compAllStandardsToAddUpdate = [];
                                        if (existsAllDBComponentCerti && existsAllDBComponentCerti.length > 0) {
                                            compAllStandardsToAddUpdate = existsAllDBComponentCerti.map(node => node.get({ plain: true }));
                                        }

                                        /* check if certificate data exists then update only class else new entry */
                                        _.each(allStandardListToChange, (allStdItem) => {
                                            const certiData = _.find(compAllStandardsToAddUpdate, dbItem => allStdItem.certificateStandardID === dbItem.certificateStandardID);
                                            if (certiData) {
                                                certiData.ClassID = allStdItem.classIDs;
                                            } else {
                                                const addCertiObj = {};
                                                addCertiObj.id = null;
                                                addCertiObj.componentID = req.body.listObj.partID;
                                                addCertiObj.certificateStandardID = allStdItem.certificateStandardID;
                                                addCertiObj.ClassID = allStdItem.classIDs;
                                                addCertiObj.createdBy = req.user.id;
                                                addCertiObj.updatedBy = req.user.id;
                                                compAllStandardsToAddUpdate.push(addCertiObj);
                                            }
                                        });

                                        /* create/update component standards */
                                        return ComponentStandardDetails.bulkCreate(compAllStandardsToAddUpdate, {
                                            updateOnDuplicate: componentInputFields,
                                            transaction: t
                                        }).then(() => {
                                            //  t.commit();

                                            // [S] add log of save/delete work order certification for timeline users
                                            const objEvent = {
                                                userID: req.user.id,
                                                eventTitle: workorderCertificationObj.SAVE.title,
                                                eventDescription: COMMON.stringFormat(workorderCertificationObj.SAVE.description, req.body.listObj.woNumber, req.user.username),
                                                refTransTable: workorderCertificationObj.refTransTableName,
                                                refTransID: null,
                                                eventType: timelineObj.id,
                                                url: COMMON.stringFormat(workorderCertificationObj.SAVE.url, req.body.listObj.woID),
                                                eventAction: timelineEventActionConstObj.UPDATE
                                            };
                                            req.objEvent = objEvent;
                                            // [E] add log of save/delete work order certification for timeline users
                                            return TimelineController.createTimeline(req, res, t).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(woCertimoduleName))));
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
                                    })).catch((err) => {
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
                        })).catch((err) => {
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
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // GET List of Work order and component Certificate Standard
    // GET : /api/v1/workorder_certification/getWorkorderAllStandardList
    // @return API response
    getWorkorderAllStandardList: (req, res) => {
        const { CertificateStandards, WorkorderCertification, StandardClass,
            StandardRole, sequelize } = req.app.locals.models;
        CertificateStandards.findAll({
            // where: {
            //     isActive: true
            // },
            order: [sequelize.fn('ISNULL', sequelize.col('CertificateStandards.displayOrder')), ['displayOrder', 'ASC'], ['fullName', 'ASC']],
            attributes: ['certificateStandardID', 'fullName', 'shortName', 'displayOrder', 'isActive', 'priority',
                'isRequired', 'passwordProtected', 'standardTypeID', 'description'],
            include: [
                {
                    model: WorkorderCertification,
                    as: 'workorderCertification',
                    attributes: ['woCertificationID', 'woID', 'certificateStandardID', 'classIDs'],
                    where: {
                        woID: req.body.workorderObj.woID
                    },
                    required: false
                },
                // {
                //    model: ComponentStandardDetails,
                //    as: 'certificateStandard',
                //    attributes: ['id','certificateStandardID', 'ClassID','componentID'],
                //    where: {
                //        componentID: req.body.workorderObj.componentID
                //    },
                //    required: false
                // },
                {
                    model: StandardClass,
                    as: 'CertificateStandard_Class',
                    attributes: ['certificateStandardID', 'classID', 'className', 'isActive', 'colorCode', 'displayOrder', 'description'],
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.errorRes, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        });
    }
};
