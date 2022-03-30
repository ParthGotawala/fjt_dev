const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const inputFields = [
    'chartTempOPID',
    'opID',
    'chartTemplateID',
    'isDeleted',
    'createdBy',
    'createdAt',
    'deletedAt',
    'deletedBy'
];

const moduleName = DATA_CONSTANT.CHART_TEMPLATE_OPERATIONS.NAME;

module.exports = {
    // Get List of Chart template operations
    // GET : /api/v1/ChartTemplateOperations/getChartTemplateOperationsList
    // @param {chartTemplateID} int
    // @return list of Chart template operations
    getChartTemplateOperationsList: (req, res) => {
        const { ChartTemplateOperations } = req.app.locals.models;
        ChartTemplateOperations.findAll({
            where: {
                chartTemplateID: req.params.chartTemplateID
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // save Chart template operation
    // POST : /api/v1/ChartTemplateOperations/saveChartTemplateOperations
    // @param chartOperationModel
    // @return detail of chart template operation
    saveChartTemplateOperations: (req, res) => {
        const { ChartTemplateOperations, sequelize } = req.app.locals.models;
        COMMON.setModelCreatedByFieldValue(req);
        ChartTemplateOperations.findAll({
            where: {
                chartTemplateID: req.body.chartTemplateID
            }

        }).then((response) => {
            var newAddedOperations = [];
            var deletedOperations = [];

            if (req.body.opID && req.body.opID.length) {
                response.forEach((item) => {
                    var typeObj = req.body.opID.find(x => x === item.opID);
                    if (!typeObj) { deletedOperations.push(item.chartTempOPID); }
                });

                req.body.opID.forEach((item) => {
                    var typeObj = response.find(x => x.opID === item);
                    if (!typeObj) {
                        const chartOperations = {};
                        chartOperations.opID = item;
                        chartOperations.chartTemplateID = req.body.chartTemplateID;
                        chartOperations.createdBy = req.user.id;
                        newAddedOperations.push(chartOperations);
                    }
                });
            } else {
                deletedOperations = response.map(x => x.chartTempOPID);
            }

            const promises = [];
            return sequelize.transaction().then((t) => {
                if (newAddedOperations.length) {
                    promises.push(ChartTemplateOperations.bulkCreate(newAddedOperations, {
                        fields: inputFields,
                        transaction: t
                    }));
                }

                if (deletedOperations.length) {
                    COMMON.setModelDeletedByFieldValue(req);
                    promises.push(ChartTemplateOperations.update(req.body, {
                        where: {
                            chartTempOPID: deletedOperations,
                            deletedAt: null
                        },
                        fields: ['deletedBy', 'deletedAt', 'isDeleted'],
                        transaction: t
                    }));
                }

                Promise.all(promises).then(() => {
                    t.commit();
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(moduleName));
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) t.rollback();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
               // if (!t.finished) t.rollback();
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }

};