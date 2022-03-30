const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound } = require('../../errors');

const moduleName = DATA_CONSTANT.TIMLINE.NAME;

module.exports = {
    // Get List of Timeline
    // GET : /api/v1/timeline
    // @param {id} int
    // @return List of Timeline Data
    retrieveTimelineDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') { strWhere = null; }

        return sequelize
            .query('CALL Sproc_GetTimelineList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)',
                {
                    replacements: {
                        ppageIndex: req.query.page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere
                    },
                    type: sequelize.QueryTypes.SELECT
                })
            .then((response) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, { timelines: _.values(response[1]), Count: response[0][0]['TotalRecord'] });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
            });
    },


    // Add In Timeline for action
    // POST : /api/v1/Timeline
    // @return New create Timeline detail
    createTimeline: (req, res, currTransaction) => {
        const { sequelize } = req.app.locals.models;
        return sequelize
            .query('CALL Sproc_AddToTimeline (:puserID, :peventTitle, :peventDescription, :prefTransTable, :prefTransID, :peventType, :purl, :pcreatedBy,:peventAction)',
                {
                    replacements: {
                        puserID: req.objEvent.userID,
                        peventTitle: req.objEvent.eventTitle ? req.objEvent.eventTitle : null,
                        peventDescription: req.objEvent.eventDescription ? req.objEvent.eventDescription : null,
                        prefTransTable: req.objEvent.refTransTable ? req.objEvent.refTransTable : null,
                        prefTransID: req.objEvent.refTransID ? req.objEvent.refTransID : null,
                        peventType: req.objEvent.eventType ? req.objEvent.eventType : null,
                        purl: req.objEvent.url ? req.objEvent.url : null,
                        pcreatedBy: req.objEvent.userID,
                        peventAction: req.objEvent.eventAction ? req.objEvent.eventAction : null
                    },
                    transaction: currTransaction ? currTransaction : null
                }).then(createdTimelineDet => ({
                    isSuccess: true,
                    createdTimelineDet: createdTimelineDet
                }));
    }
};
