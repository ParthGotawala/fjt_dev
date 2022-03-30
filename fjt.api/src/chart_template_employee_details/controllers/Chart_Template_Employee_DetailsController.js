const { STATE } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
const _ = require('lodash');

const inputFields = [
    'employeeID',
    'chartTemplateID',
    'displayOrder',
    'isDeleted',
    'createdBy'
];


const moduleName = DATA_CONSTANT.CHART_TEMPLATE_EMPLOYEE_DETAIL.NAME;

module.exports = {
    // Get chart template employee detail list
    // GET : /api/v1/charttempalteemployee/getChartTemplateEmployeeList
    // @return template associate with employee list
    getChartTemplateEmployeeList: (req, res) => {
        const { ChartTemplateEmployeeDetails } = req.app.locals.models;
        if (req.params.employeeID) {
            return ChartTemplateEmployeeDetails.findAll({
                attributes: ['displayOrder', 'chartTemplateID', 'employeeID', 'id'],
                where: {
                    employeeID: req.params.employeeID
                },
                order: [['displayOrder', 'ASC']]
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // save tempate display order listbased on user changes
    // POST : /api/v1/charttempalteemployee/saveChartTemplateEmployeeList
    // @return save user template list
    saveChartTemplateEmployeeList: (req, res) => {
        const { ChartTemplateEmployeeDetails } = req.app.locals.models;
        if (req.body.templateEmployeeList) {
            const promises = [];
            _.each(req.body.templateEmployeeList, (tempaltes) => {
                promises.push(ChartTemplateEmployeeDetails.findOne({
                    where: {
                        employeeID: tempaltes.employeeID,
                        chartTemplateID: tempaltes.chartTemplateID,
                        isDeleted: false
                    },
                    attributes: ['id', 'chartTemplateID']
                }).then((response) => {
                    if (response && response.id) {
                        tempaltes.updatedBy = req.user.id;
                        return ChartTemplateEmployeeDetails.update(tempaltes, {
                            where: {
                                chartTemplateID: tempaltes.chartTemplateID,
                                employeeID: tempaltes.employeeID,
                                isDeleted: false
                            },
                            fields: ['displayOrder', 'updatedBy']
                        }).then(() => STATE.SUCCESS).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        });
                    } else {
                        tempaltes.createdBy = req.user.id;
                        return ChartTemplateEmployeeDetails.create(tempaltes, {
                            fields: inputFields
                        }).then(() => STATE.FAILED).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            });
            return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName)));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};