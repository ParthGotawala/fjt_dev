const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

module.exports = {
    retriveSupplierLimits: (req, res) => {
        const mongodb = global.mongodb;
        const filter = COMMON.UIGridMongoDBFilterSearch(req);
        const order = filter.order[0];

        if (req.query && req.query.fromDate && req.query.toDate) {
            filter.where.currentDate = {
                $gte: new Date(new Date(req.query.fromDate).setHours(0, 0, 0, 0)),
                $lte: new Date(new Date(req.query.toDate).setHours(23, 59, 59, 999))
            };
        } else if (req.query && req.query.fromDate) {
            filter.where.currentDate = {
                $gte: new Date(new Date(req.query.fromDate).setHours(0, 0, 0, 0))
            };
        } else if (req.query && req.query.toDate) {
            filter.where.currentDate = {
                    $lte: new Date(new Date(req.query.toDate).setHours(23, 59, 59, 999))
            };
        }
        if (req.query && req.query.supplierID) {
            filter.where.supplierID = parseInt(req.query.supplierID);
        }
        const option = {
            skip: filter.offset,
            sort: {},
            limit: filter.limit
        };
        if (order) {
            option.sort[order[0]] = order[1] === 'asc' ? 1 : -1;
        }
        const promises = [
            mongodb.collection('SupplierExternalCallLimit').find(filter.where, option).toArray(),
            mongodb.collection('SupplierExternalCallLimit').find(filter.where).count()
        ];
        Promise.all(promises).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                result: response[0],
                Count: response[1]
            }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};
