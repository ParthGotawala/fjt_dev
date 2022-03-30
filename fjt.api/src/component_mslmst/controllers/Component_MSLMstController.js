const resHandler = require('../../resHandler');
const { STATE } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound } = require('../../errors');

const componentMSLModuleName = DATA_CONSTANT.COMPONENT_MSL.NAME;


module.exports = {
    // Retrive list of MSL
    // GET : /api/v1/componentMSL/getComponentMSLList
    // @return list Of getComponentMSLList
    getComponentMSLList: (req, res) => {
        const { ComponentMSLMst } = req.app.locals.models;
        ComponentMSLMst.findAll({
            attributes: ['id', 'levelRating', 'time', 'conditions']
        }).then(mslList => resHandler.successRes(res, 200, STATE.SUCCESS, mslList)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(componentMSLModuleName)));
        });
    }
};