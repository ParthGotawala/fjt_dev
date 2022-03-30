const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const timelineObjForWoTransPackDet = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.WORKORDER_TRANS_PACKAGINGDETAIL;
const WoTransPackDetConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_TRANS_PACKAGINGDETAIL;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const moduleName = DATA_CONSTANT.WORKORDER_TRANS_PACKAGINGDETAIL.NAME;


module.exports = {

    // Retrive list of workorder_trans_packagingdetail by woId
    // GET : /api/v1/retriveWoTranspackaging
    // @param {woID} int
    // @return list of workorder_trans_packagingdetail
    retriveWoTranspackaging(req, res) {
        const { sequelize } = req.app.locals.models;
        if (req.query.woId && req.query.opId) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }
            return sequelize
                .query('CALL Sproc_RetrieveWoTransPackagingDetail (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pWoID,:pOpID)',
                    {
                        replacements: {
                            ppageIndex: req.query.page,
                            precordPerPage: filter.limit,
                            pOrderBy: strOrderBy,
                            pWhereClause: strWhere,
                            pWoID: req.query.woId,
                            pOpID: req.query.opId
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { packagingdetail: _.values(response[1]), Count: response[0][0]['COUNT(*)'] })).catch(err => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    // create final product serial numbers
    // POST : /api/v1/woTransPackagingDet/createFinalProductSerial
    // @param woTransPackagingDet object
    // @return API response
    createFinalProductSerial(req, res) {
        const { WorkorderTransPackagingDetail } = req.app.locals.models;
        if (req.body) {
            return WorkorderTransPackagingDetail.findAll({
                where: {
                    woID: req.body.woID,
                    opID: req.body.opID,
                    serialID: { [Op.in]: [_.map(req.body.workorderFinalProductSerials, 'serialID')] },
                    isDeleted: false
                }
            }).then((data) => {
                if (data.length === 0) {
                    const packagingSerialsList = [];
                    _.each(req.body.workorderFinalProductSerials, (item) => {
                        const obj = {};
                        obj.woTransID = req.body.woTransID;
                        obj.woID = req.body.woID;
                        obj.opID = req.body.opID;
                        obj.employeeID = req.body.employeeID;
                        obj.boxNo = req.body.boxNo;
                        obj.noOfPacketPerBox = req.body.noOfPacketPerBox;
                        obj.boxSize = req.body.boxSize;
                        obj.location = req.body.location;
                        obj.serialID = item.serialID;
                        obj.createdBy = req.user.id;
                        packagingSerialsList.push(obj);
                    });
                    return WorkorderTransPackagingDetail.bulkCreate(packagingSerialsList, {
                        individualHooks: true
                    }).then((response) => {
                        // [S] add log of adding packaging serial details to wo op for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: WoTransPackDetConstObj.CREATE.title,
                            eventDescription: COMMON.stringFormat(WoTransPackDetConstObj.CREATE.description, req.body.opName, req.body.woNumber, req.user.username),
                            refTransTable: WoTransPackDetConstObj.refTransTableName,
                            refTransID: _.map(response, 'woTransPackagingDetailID').toString(),
                            eventType: timelineObjForWoTransPackDet.id,
                            url: COMMON.stringFormat(WoTransPackDetConstObj.url, req.body.woOPID, req.body.employeeID),
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of adding packaging serial details to wo op for timeline users
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(moduleName));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.SERIALS_ALREADY_USED, err: null, data: null });
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

    // Delete deleteWoTranspackaging by woTransPackagingDetailID
    // POST : /api/v1/deleteWoTranspackaging/deleteWoTranspackaging
    // @param woTransPackagingDetailID List or single woTransPackagingDetailID
    // @return API response
    deleteWoTranspackaging: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs) {
            const tableName = COMMON.BoxSerialsTbl;
            COMMON.setModelDeletedByFieldValue(req);
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: req.user.id,
                        entityID: null,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((boxserialsDetails) => {
                    const woTransDetails = boxserialsDetails[0];
                    if (woTransDetails && woTransDetails.TotalCount === 0) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, boxserialsDetails, MESSAGE_CONSTANT.DELETED(moduleName));
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_DELETED(moduleName), err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
