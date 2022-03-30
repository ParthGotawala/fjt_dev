const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

module.exports = {
    retriveError: async (req, res) => {
        try {
            const { sequelize } = req.app.locals.models;
            const mongodb = global.mongodb;
            const filter = COMMON.UIGridMongoDBFilterSearch(req);
            const order = filter.order[0];

            const timeZone = await sequelize.query('Select fun_getTimeZone() as timeZone', {
                type: sequelize.QueryTypes.SELECT
            });

            if (req.query && req.query.fromDate && req.query.toDate) {
                const timeStampFieldName = req.query.isGetAPILogs.toLowerCase() === 'true' ? 'timestamp' : 'Timestamp';
                filter.where[timeStampFieldName] = {
                    $gte: new Date(req.query.fromDate),
                    $lte: new Date(req.query.toDate)
                };
            }
            const option = {
                skip: filter.offset,
                sort: {},
                limit: filter.limit
            };
            if (Array.isArray(filter.order) && filter.order.length > 0) {
                filter.order.forEach((orderDet) => {
                    option.sort[orderDet[0]] = orderDet[1] === 'asc' ? 1 : -1;
                });
            }
            // Create Query for Fetch data from MongoDB
            let pipeline = [
                {
                    '$match': filter.where
                },
                {
                    '$sort': option.sort
                },
                { $skip: option.skip },
                { $limit: option.limit }
            ];
            const promises = [];
            if (req.query.isGetAPILogs.toLowerCase() === 'true') {
                const projection = {
                    '$project': {
                        '_id': 0,
                        'level': '$level',
                        'messagea': '$MessageTemplate',
                        'message': '$message',
                        'timestamp': '$timestamp'
                    }
                };
                pipeline.unshift(projection);
                promises.push(mongodb.collection('error_log').aggregate(pipeline, { allowDiskUse: true }).toArray());
                promises.push(mongodb.collection('error_log').find(filter.where).count());
            } else {
                const projection = {
                    '$project': {
                        '_id': 0,
                        'exception': '$Exception',
                        'level': '$Level',
                        'message': '$RenderedMessage',
                        'timestamp': '$Timestamp',
                        'Timestamp': '$Timestamp'
                    }
                };
                pipeline.unshift(projection);
                promises.push(mongodb.collection('enterprise_error_log').aggregate(pipeline, { allowDiskUse: true }).toArray());
                promises.push(mongodb.collection('enterprise_error_log').find(filter.where).count());
            }

            return Promise.all(promises).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    result: response[0],
                    Count: response[1]
                }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    }
};
