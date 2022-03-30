const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { NotFound } = require('../../errors');
const { MESSAGE_CONSTANT } = require('../../../constant');

module.exports = {
    getUIGridColumnDetail: (req, res) => {
        var mongodb = global.mongodb;
        return mongodb.collection('uiGridColumnConfig').findOne({
            gridId: req.query.gridId,
            userId: req.user.id
        }).then(result =>
            resHandler.successRes(res, 200, STATE.SUCCESS, result, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND('Column configuration')), err.errors, err.fields);
        });
    },


    saveUIGridColumnDetail: (req, res) => {
        var mongodb = global.mongodb;
        COMMON.setModelUpdatedByFieldValue(req);

        req.body.updatedByName = req.user.username;
        return mongodb.collection('uiGridColumnConfig').updateOne(
            {
                gridId: req.body.gridId,
                userId: req.user.id
            }, {
            $set: req.body,
            $setOnInsert: {
                // userID: req.user.id,
                createdBy: req.body.updatedBy,
                createdByName: req.body.updatedByName,
                createdAt: req.body.updatedAt,
                createByRoleId: req.body.updateByRoleId
            }
        }, { upsert: true }).then(result =>
            resHandler.successRes(res, 200, STATE.SUCCESS, result, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND('Column configuration')), err.errors, err.fields);
        });
    }
};
