const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const timelineObjForWoPreProgComp = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.WORKORDER_PREPROGCOMP;
const WoPreProgCompConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_PREPROGCOMP;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const woPreProgComModuleName = DATA_CONSTANT.WORKORDER_PREPROGCOMP.NAME;
const SAVE_PRE_PROG_COMP_ERROR_CODE = {
    E1001: { CODE: 'E1001' } /* component designator limit exists */
};

module.exports = {
    // Retrive list of pre-programming part
    // GET : /api/v1/workorder_preprogcomp/retrivePreProgComponents
    // @param {woID} int
    // @return list of pre-programming part
    retrivePreProgComponentsByID: (req, res) => {
        if (req.params.woPreProgCompID) {
            const { WorkorderPreprogComp, Component } = req.app.locals.models;
            return WorkorderPreprogComp.findOne({
                attributes: ['woPreProgCompID', 'mfgPNID', 'woMultiplier', 'displayOrder', 'programName', 'woID', 'refStkWOOPID'],
                where: {
                    woPreProgCompID: req.params.woPreProgCompID
                },
                include: [{
                    model: Component,
                    as: 'component',
                    required: false,
                    attributes: ['mfgPN']
                }]
            }).then(componentDetail => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, componentDetail, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Update work order pre-programming part
    // POST : /api/v1/workorder_preprogcomp/updateWOPreProgramComponent
    // @return API response
    updateWOPreProgramComponent: (req, res) => {
        if (req.body && req.body.woPreProgCompID) {
            const { WorkorderPreprogComp, sequelize } = req.app.locals.models;

            return WorkorderPreprogComp.findOne({
                where: {
                    woPreProgCompID: req.body.woPreProgCompID
                },
                attributes: ['woPreProgCompID']
            }).then((woPreProgResp) => {
                if (woPreProgResp) {
                    COMMON.setModelUpdatedByFieldValue(req);

                    return sequelize.transaction().then(t => WorkorderPreprogComp.update(req.body, {
                            where: {
                                woPreProgCompID: req.body.woPreProgCompID
                            },
                            fields: ['displayOrder', 'refStkWOOPID'],
                            transaction: t
                        }).then(() => {
                            const updatePreProgPromises = [];
                            // [S] add log of update work order pre program component for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: WoPreProgCompConstObj.UPDATE.title,
                                eventDescription: COMMON.stringFormat(WoPreProgCompConstObj.UPDATE.description, req.body.mfgPN
                                    , req.body.objTimelinelog.opName, req.body.objTimelinelog.woNumber, req.user.username),
                                refTransTable: WoPreProgCompConstObj.refTransTableName,
                                refTransID: req.body.woPreProgCompID,
                                eventType: timelineObjForWoPreProgComp.id,
                                url: COMMON.stringFormat(WoPreProgCompConstObj.url, req.body.objTimelinelog.woOPID, req.body.objTimelinelog.employeeID),
                                eventAction: timelineEventActionConstObj.UPDATE
                            };
                            req.objEvent = objEvent;
                            updatePreProgPromises.push(TimelineController.createTimeline(req, res, t));
                            // [E] add log of update work order pre program component for timeline users

                            return Promise.all(updatePreProgPromises).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                        { woPreProgCompID: req.body.woPreProgCompID }, MESSAGE_CONSTANT.UPDATED(woPreProgComModuleName)))).catch((err) => {
                                t.rollback();
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            t.rollback();
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
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
    // Delete Customer
    // DELETE : /api/v1/workorder_preprogcomp
    // @return API resposne
    deletePreProgramComponent: (req, res) => {
        if (req.body.woPreProgCompID) {
            const { sequelize } = req.app.locals.models;
            const tableName = COMMON.AllEntityIDS.PreProgramComponent.Name;
            const entityID = COMMON.AllEntityIDS.PreProgramComponent.ID;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.woPreProgCompID,
                        deletedBy: req.user.id,
                        entityID: entityID,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((component) => {
                    var componentDetail = component[0];
                    if (componentDetail && componentDetail.TotalCount === 0) {
                        return resHandler.successRes(res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(woPreProgComModuleName));
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, componentDetail, null);
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
    // create/update work order pre-programming details
    // POST : /api/v1/workorder_preprogcomp/saveWOPreProgramComponent
    // @return API resposne of create/update details
    saveWOPreProgramComponent: (req, res) => {
        if (req.body.woID && req.body.mfgPNID && req.body.woTransID && req.body.opID && req.body.woOPID && req.body.employeeID
            && req.body.programName && req.body.designatorName && req.body.refsidid && req.body.woMultiplier) {
            const { sequelize } = req.app.locals.models;

            // eslint-disable-next-line no-multi-str
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_SaveWOPreProgramComponent (:pwoPreProgCompID,:pwoTransPreprogramID,:pwoID,:pmfgPNID,:pwoTransID,:popID,:pwoOPID,:pemployeeID, \
                    :pprogramName,:pdesignatorName, \
            :prefStkWOOPID,:prefsidid,:pcompCnt,:pwoMultiplier,:pdisplayOrder,:puserID,:puserRoldID,:pisupdatePartCountOnly)',
                {
                    replacements: {
                        pwoPreProgCompID: req.body.woPreProgCompID || null,
                        pwoTransPreprogramID: req.body.woTransPreprogramID || null,
                        pwoID: req.body.woID,
                        pmfgPNID: req.body.mfgPNID,
                        pwoTransID: req.body.woTransID,
                        popID: req.body.opID,
                        pwoOPID: req.body.woOPID,
                        pemployeeID: req.body.employeeID,
                        pprogramName: req.body.programName,
                        pdesignatorName: req.body.designatorName.toString().trim(),
                        prefStkWOOPID: req.body.refStkWOOPID || null,
                        prefsidid: req.body.refsidid,
                        pcompCnt: req.body.compCnt || null,
                        pwoMultiplier: req.body.woMultiplier,
                        pdisplayOrder: req.body.displayOrder || null,
                        puserID: req.user.id,
                        puserRoldID: COMMON.getRequestUserLoginRoleID(req),
                        pisupdatePartCountOnly: false
                    },
                    transaction: t
                }).then((resp) => {
                    let errorDet = null;
                    let errMsg = null;
                    if (resp && resp.length) {
                        errorDet = resp[0];
                        if (errorDet && errorDet.errorCode) {
                            switch (errorDet.errorCode) {
                                case SAVE_PRE_PROG_COMP_ERROR_CODE.E1001.CODE:
                                    errMsg = MESSAGE_CONSTANT.MFG.COMPONENT_DESIGANTOR_LIMIT_EXITS;
                                    break;
                                default:
                                    errMsg = MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG;
                                    break;
                            }
                        }
                    }
                    if (errorDet && errMsg) {
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: errMsg, err: null, data: null });
                    } else {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.SAVED(woPreProgComModuleName)));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
