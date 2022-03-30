const resHandler = require('../../resHandler');
const { STATE } = require('../../constant');
const { Failed } = require('../../errors');
const { Op } = require('sequelize');


module.exports = {
    // Get list of workorder transaction subform data detail
    // POST : /api/v1/getworkorderTransEquipmentSubFormDetail
    // @return list of workorder transaction equipment subform data detail
    getworkorderTransEquipmentSubFormDetail: (req, res) => {
        const WorkorderTransEquipmentSubFormData = req.app.locals.models.WorkorderTransEquipmentSubFormData;
        WorkorderTransEquipmentSubFormData.findAll({
            where: {
                woTransEqpSubFormDataID: { [Op.in]: req.body.refWoTransEqpSubFormDataIDs }
            }
        }).then((subformDetail) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, subformDetail);
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, new Failed(err.message));
        });
    }
};

