const { STATE } = require('../../constant');
const { NotFound } = require('../../errors');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const moduleName = DATA_CONSTANT.RFQ_LINEITEMS_ERRORCODE_CATEGORY.DISPLAYNAME;

module.exports = {
    // Retrive list of ErrorCode Category
    // GET : /api/v1/rfqerrorcode/getErrorCodeCategory
    // @return list of ErrorCode
    getErrorCodeCategory: (req, res) => {
        const { RFQErrorCodeCategorymst } = req.app.locals.models;

        RFQErrorCodeCategorymst.findAll({
            attributes: ['id', 'name', 'description']
        }).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, response)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
        });
    }
};