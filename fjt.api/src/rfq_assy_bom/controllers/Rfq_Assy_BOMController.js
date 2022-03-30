const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

module.exports = {

    // Retrive rfq assy Bom list
    // GET : /api/v1/rfqAssyBOM/getAssyBOMList
    // @return rfqAssyBom list
    getAssyBOMList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        /* Call common ui grid filter function */
        return sequelize.query('CALL Sproc_GetAssyBOMList (:prfqAssyID)', {
            replacements: {
                prfqAssyID: req.query.rfqAssyID || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { rfqAssyBOM: _.values(response[0]) }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};
