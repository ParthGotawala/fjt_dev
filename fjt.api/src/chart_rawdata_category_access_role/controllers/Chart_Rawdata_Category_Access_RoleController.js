const { STATE } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');


module.exports = {

    // Get access role by chart raw data category
    // GET : /api/v1/chartrawdatacategoryaccessrole/getAccessRoleByChartRawDataCategory
    // @param {raw data category} string
    // @return detail of chart raw data access roles
    getAccessRoleByChartRawDataCategory: (req, res) => {
        const { ChartRawdataCategoryAccessRole } = req.app.locals.models;

        ChartRawdataCategoryAccessRole.findAll({
            where: {
                chartRawdataCatID: req.body.chartRawDataCatID
            },
            attributes: ['roleID']
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    }
};