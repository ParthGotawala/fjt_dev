const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

module.exports = {
   // Retrieve list of filter
    // GET : /api/v1/rfqLineItemFilter/getRFQFilters
    // @return list of filters
    getRFQFilters: (req, res) => {
        const { RFQLineitemsFilter } = req.app.locals.models;

        RFQLineitemsFilter.findAll({
            attributes: ['id', 'filterCode', 'displayName', 'displayOrder', 'description', 'isErrorFilter'],
            order: [['displayOrder', 'ASC']]
        }).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, response))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // Post List of RFQ LineItems Filters
    // Post : /api/v1/rfqLineItemFilter/saveFilterDisplayOrder
    // @param Array of LineItems Filters
    // @return API response
    saveFilterDisplayOrder: (req, res) => {
        var mongodb = global.mongodb;
        COMMON.setModelUpdatedByFieldValue(req);
        const promises = [];
        const lineitemsheaderlist = req.body;
        const userID = COMMON.getRequestUserID(req);

        lineitemsheaderlist.forEach((item) => {
            item.updatedBy = userID;
            promises.push(mongodb.collection('bomFilterSequence').updateOne({
                userId: req.user.id,
                filterId: item.id
            }, {
                $set: item,
                $setOnInsert: {
                    createdBy: req.body.updatedBy,
                    createdByName: req.body.updatedByName,
                    createdAt: req.body.updatedAt,
                    createByRoleId: req.body.updateByRoleId
                }
            }, { upsert: true }));
        });
        Promise.all(promises).then(resp => resHandler.successRes(res, 200, STATE.SUCCESS, resp, MESSAGE_CONSTANT.RFQ_LINEITEMS_FILTER.SAVE_SUCCESS))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Retrieve list of filter Sequence
    // GET : /api/v1/rfqLineItemFilter/getUserBOMFiltersSequence
    // @return list of filters Sequence
    getUserBOMFiltersSequence: (req, res) => {
        var mongodb = global.mongodb;
        return mongodb.collection('bomFilterSequence').find({
            userId: req.user.id
        }).toArray().then(result => resHandler.successRes(res, 200, STATE.SUCCESS, result, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    }
};