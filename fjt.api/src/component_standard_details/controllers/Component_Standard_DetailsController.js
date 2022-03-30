const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
/* errors file*/
const { NotFound, NotCreate, InvalidPerameter, NotMatchingPassword } = require('../../errors');
const _ = require('lodash');
const { Op } = require('sequelize');

const componentStandardDetailsInputFields = [
    'id',
    // 'standardClassID',
    'componentID',
    'certificateStandardID',
    'ClassID',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'createdAt',
    'updatedAt'
];

const workorderCertificationInputFields = [
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
const componentStandardModuleName = DATA_CONSTANT.COMPONENT_STANDARDS.DISPLAYNAME;

module.exports = {

    // Get List of GetComponentstandard detail data
    // GET : /api/v1/componentStandard/getStandardDetail
    // @param {id} int
    // @return List of getComponentStandard detail List
    getStandardDetail: (req, res) => {
        const { ComponentStandardDetails, CertificateStandards, StandardClass } = req.app.locals.models;
        ComponentStandardDetails.findAll({
            where: {
                componentID: req.params.id
            },
            attributes: ['id', 'certificateStandardID', 'ClassID'],
            include: [{
                model: CertificateStandards,
                as: 'certificateStandard',
                order: [['displayOrder', 'ASC']],
                attributes: ['certificateStandardID', 'fullName', 'shortName', 'displayOrder', 'isActive', 'priority', 'isRequired', 'standardTypeID', 'isExportControlled']
            },
            {
                model: StandardClass,
                as: 'Standardclass',
                attributes: ['certificateStandardID', 'classID', 'className', 'colorCode'],
                required: false
            }]
        }).then(getdata => resHandler.successRes(res, 200, STATE.SUCCESS, getdata)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(componentStandardModuleName)));
        });
    },

    // Create component standard detail
    // POST : /api/v1/createComponentStandardDetail
    // @return New create component detail
    createComponentStandardDetail: (req, res) => {
        const { User } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);
        if (req.body.listObj.password) {
            req.body.listObj.password = COMMON.DECRYPT_AES(req.body.listObj.password);
            User.findOne({
                attributes: ['id', 'passwordDigest'],
                where: {
                    id: userID
                }
            }).then(user =>
                user.authenticate(req.body.listObj.password)
                    .then(() =>
                        module.exports.saveComponentCertificateList(req, res)).catch(() =>
                            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_PASSWORD_INCORRECT, err: null, data: null })
                        )
            ).catch((err) => {
                if (err instanceof NotMatchingPassword || err instanceof NotFound) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_PASSWORD_INCORRECT, err: null, data: null });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.USER.USER_PASSWORD_INCORRECT));
                }
            });
        } else {
            module.exports.saveComponentCertificateList(req, res);
        }
    },
    saveComponentCertificateList: (req, res) => {
        if (req.body) {
            const { sequelize, Workorder, WorkorderCertification, ComponentStandardDetails } = req.app.locals.models;

            return Workorder.findAll({
                where: {
                    woStatus: { [Op.notIn]: [COMMON.WOSTATUS.COMPLETED, COMMON.WOSTATUS.VOID, COMMON.WOSTATUS.TERMINATED] },
                    partID: req.body.listObj.componentID
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

                    /* exists data of component standard */
                    const allExistsStandards = _.filter(allStandardListToChange, item => item.id);
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
                            attributes: ['woCertificationID', 'woID', 'certificateStandardID', 'classIDs', 'createdBy', 'updatedBy']
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
                                        certiData.classIDs = allStdItem.ClassID;
                                    } else {
                                        const addCertiObj = {};
                                        addCertiObj.woCertificationID = null;
                                        addCertiObj.woID = WOItem;
                                        addCertiObj.certificateStandardID = allStdItem.certificateStandardID;
                                        addCertiObj.classIDs = allStdItem.ClassID;
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
                                updateOnDuplicate: workorderCertificationInputFields,
                                transaction: t
                            }).then(() => {
                                /* remove all standards (that deleted from ui) from  component of same partID  */
                                const compCertiDeletewhereClause = {
                                    componentID: req.body.listObj.componentID,
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
                                            componentID: req.body.listObj.componentID,
                                            certificateStandardID: { [Op.in]: allCertificateStandardIDsOfExistsData || [] }
                                        },
                                        attributes: ['id', 'componentID', 'certificateStandardID', 'ClassID', 'createdBy', 'updatedBy']
                                    }).then((existsAllDBComponentCerti) => {
                                        let compAllStandardsToAddUpdate = [];
                                        if (existsAllDBComponentCerti && existsAllDBComponentCerti.length > 0) {
                                            compAllStandardsToAddUpdate = existsAllDBComponentCerti.map(node => node.get({ plain: true }));
                                        }

                                        /* check if certificate data exists then update only class else new entry */
                                        _.each(allStandardListToChange, (allStdItem) => {
                                            const certiData = _.find(compAllStandardsToAddUpdate, dbItem => allStdItem.certificateStandardID === dbItem.certificateStandardID);
                                            if (certiData) {
                                                certiData.ClassID = allStdItem.ClassID;
                                            } else {
                                                const addCertiObj = {};
                                                addCertiObj.id = null;
                                                addCertiObj.componentID = req.body.listObj.componentID;
                                                addCertiObj.certificateStandardID = allStdItem.certificateStandardID;
                                                addCertiObj.ClassID = allStdItem.ClassID;
                                                addCertiObj.createdBy = req.user.id;
                                                addCertiObj.updatedBy = req.user.id;
                                                compAllStandardsToAddUpdate.push(addCertiObj);
                                            }
                                        });

                                        /* create/update component standards */
                                        return ComponentStandardDetails.bulkCreate(compAllStandardsToAddUpdate, {
                                            updateOnDuplicate: componentStandardDetailsInputFields,
                                            transaction: t
                                        }).then(() => t.commit().then(() => module.exports.updateAssemblyHistory(req, res, req.body.listObj.componentID, req.body.listObj.oldStandardList, req.body.listObj.newStandardList).then((updateResponse) => {
                                            if (updateResponse.status === STATE.SUCCESS) {
                                                RFQSocketController.sendBOMSpecificPartRequirementChanged(req, {
                                                    partID: req.body.listObj.componentID,
                                                    type: 'Standard'
                                                });
                                                return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(componentStandardModuleName) });
                                            } else {
                                                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(componentStandardModuleName)));
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            t.rollback();
                                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(componentStandardModuleName)));
                                        }))).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            t.rollback();
                                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(componentStandardModuleName)));
                                        });
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        t.rollback();
                                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(componentStandardModuleName)));
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        t.rollback();
                                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(componentStandardModuleName)));
                                    });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(componentStandardModuleName)));
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(componentStandardModuleName)));
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(componentStandardModuleName)));
                        });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(componentStandardModuleName)));
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    updateAssemblyHistory: (req, res, partID, oldStandard, newStandard) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_Update_Assembly_On_Standard_Change (:pPartID, :pOldStandard, :pNewStandard, :pUserID)', {
            replacements: {
                pPartID: partID,
                pOldStandard: oldStandard,
                pNewStandard: newStandard,
                pUserID: COMMON.getRequestUserID(req)
            }
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch(() => ({
            status: STATE.FAILED
        }));
    }
};