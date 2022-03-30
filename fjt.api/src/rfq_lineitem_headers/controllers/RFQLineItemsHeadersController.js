const { STATE, COMMON } = require('../../constant');
const { NotFound, NotCreate } = require('../../errors');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const moduleName = DATA_CONSTANT.RFQ_LINEITEMS_HEADERS.NAME;
const inputFields = [
    'displayOrder',
    'updatedBy'
];
module.exports = {
    // Get List of RFQ LineItems Headers
    // GET : /api/v1/getrfqlineitemsheaders
    // @return list of  RFQ LineItems Headers
    getRfqLineitemsHeaders: (req, res) => {
        const { RFQLineItemsHeaders } = req.app.locals.models;
        return RFQLineItemsHeaders.findAll({
            attributes: ['id', 'name', 'displayOrder', 'field', 'isAvlField', 'isAvlMfgField', 'isActive'],
            order: [
                ['displayOrder', 'ASC']
            ]
        }).then(headerlist => resHandler.successRes(res, 200, STATE.SUCCESS, headerlist)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
        });
    },

    // Post List of RFQ LineItems Headers
    // Post : /api/v1/saveDisplayOrder
    // @param Array of LineItems Headers
    // @return API response
    saveDisplayOrder: (req, res) => {
        var userID = COMMON.getRequestUserID(req);
        const { RFQLineItemsHeaders, sequelize } = req.app.locals.models;
        var lineitemsheaderlist = req.body;
        return sequelize.transaction().then((t) => {
            const promises = [];
            lineitemsheaderlist.forEach((item) => {
                item.updatedBy = userID;
                promises.push(RFQLineItemsHeaders.update(item, {
                    where: {
                        id: item.id
                    },
                    fields: inputFields,
                    transaction: t
                }));
            });
            Promise.all(promises).then((resp) => {
                t.commit();
                resHandler.successRes(res, 200, STATE.SUCCESS, resp, MESSAGE_CONSTANT.RFQ_LINEITEMS_HEADERS.SAVE_SUCCESS);
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
            });
        });
    }
};
