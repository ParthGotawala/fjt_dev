const _ = require('lodash');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
const { NotCreate } = require('../../errors');

const moduleName = DATA_CONSTANT.RFQ_BOM_HEADER_COMPONENT_CONFIGURATION.NAME;

module.exports = {
    // get Rfq Additional Column List
    // @param {req} obj
    // @return list of additional column
    getRfqAdditionalColumnList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetRFQAdditionalHeaderConfigurations (:pPartID)',
            {
                replacements: {
                    pPartID: req.params.id
                }
            })
            .then(response => resHandler.successRes(res, 200, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
            });
    },

    // save Rfq Additional Column List
    // Post : /api/v1/rfqbomheadercomponentconfiguration/saveRfqAdditionalColumnList
    // @return API response
    saveRfqAdditionalColumnList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);
        var partID = req.body.partID;
        var configureHeaderField = _.map(_.filter(req.body.headerList, 'isConfigured'), 'id').join();

        sequelize.query('CALL Sproc_RFQAdditionalCommentManage (:pHeaderIDS,:pPartID, :pUserID)',
            {
                replacements: {
                    pHeaderIDS: configureHeaderField,
                    pPartID: partID,
                    pUserID: userID
                }
            })
        .then(response => resHandler.successRes(res, 200, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName))).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
        });
    }
};