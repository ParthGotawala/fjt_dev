const resHandler = require('../../resHandler');
const { STATE } = require('../../constant');
const { Failed } = require('../../errors');
const { Op } = require('sequelize');

module.exports = {
    // Get list of workorder transaction subform data detail
    // POST : /api/v1/getWorkorderTransSubformDataDetail
    // @return list of workorder transaction subform data detail
    getWorkorderTransSubformDataDetail: (req, res) => {
        const WorkorderTransSubFormData = req.app.locals.models.WorkorderTransSubFormData;
        WorkorderTransSubFormData.findAll({
            where: {
                woTransSubFormDataID: { [Op.in]: req.body.refWoTransSubFormDataIDs }
            }
        }).then(subformDetail => resHandler.successRes(res, 200, STATE.SUCCESS, subformDetail)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, new Failed(err.message));
        });
    }
};
