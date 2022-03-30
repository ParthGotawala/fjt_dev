const resHandler = require('../../resHandler');
const { STATE } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

module.exports = {

    // Get Fixed Entity Dataelement List
    // GET : /api/v1/fixed_entity_dataelement/retrieveFixedEntityDataelementList
    // @return fixed entity detail
    retrieveFixedEntityDataelementList: (req, res) => {
        const { FixedEntityDataelement } = req.app.locals.models;

        FixedEntityDataelement.findAll({
            attributes: ['id', 'tableName', 'displayColumnPKField', 'displayColumnField', 'displayEntityName']
        }).then(fixedentitylist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { fixedEntityList: fixedentitylist }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Retrive data element by displayEntityName
    // POST : /api/v1/getDataElementByDisplayEntityName
    // @return Data element detail
    getDataElementByDisplayEntityName: (req, res) => {
        if (req.body && req.body.entityName) {
            const { FixedEntityDataelement } = req.app.locals.models;
            return FixedEntityDataelement.findOne({
                where: {
                    displayEntityName: req.body.entityName
                }
            }).then((getEntityData) => {
                if (!getEntityData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEntityData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};