const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { NotFound, InvalidPerameter } = require('../../errors');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
// const Sequelize = require('sequelize');
const moduleName = DATA_CONSTANT.RFQ_LINEITEMS_ERRORCODE_CATEGORY.DISPLAYNAME;
const createFields = ['errorCodeId', 'categoryID', 'createdBy'];
const deleteFields = ['isDeleted', 'deletedBy', 'deletedAt'];
const selectAttributes = ['id', 'errorCodeId', 'categoryID'];

module.exports = {
    // Retrive list of ErrorCode Category
    // GET : /api/v1/rfqerrorcodecategory/getErrorCodeCategoryMapping
    // @return list of ErrorCode Mapping
    getErrorCodeCategoryMapping: (req, res) => {
        const { RFQErrorCodeCategoryMapping } = req.app.locals.models;
        if (req.query && req.query.errorCodeID) {
            return RFQErrorCodeCategoryMapping.findAll({
                where: {
                    errorCodeId: req.query.errorCodeID
                },
                attributes: selectAttributes
            }).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, response)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Save Error code Mapping
    // Post : /api/v1/rfqerrorcodecategory/saveErrorCodeMapping
    // @param Error code Mapping
    // @return API response
    saveErrorCodeMapping: (req, res) => {
        const { RFQErrorCodeCategoryMapping } = req.app.locals.models;
        if (req.body) {
            const categoryMappingList = req.body.categoryMappingList;
            const categoryMapping = _.partition(categoryMappingList, item => !item.id);
            const newMappingList = categoryMapping[0];
            const modifiedMappingList = categoryMapping[1];
            const deletedCategoryMapping = _.partition(modifiedMappingList, item => item.isDeleted);
            const deletedCategoryMappingList = _.map(deletedCategoryMapping[0], 'id');
            const userID = COMMON.getRequestUserID(req);
            const currDate = COMMON.getCurrentUTC();
            const promises = [];

            // Delete Mapping deatils
            if (deletedCategoryMappingList && deletedCategoryMappingList.length > 0) {
                promises.push(RFQErrorCodeCategoryMapping.update({
                    isDeleted: true,
                    deletedBy: userID,
                    deletedAt: currDate
                }, {
                    where: {
                        id: { [Op.in]: deletedCategoryMappingList },
                        isDeleted: false
                    },
                    fields: deleteFields
                }));
            }
            if (newMappingList && newMappingList.length > 0) {
                newMappingList.forEach((item) => {
                    item.createdBy = userID;
                });
                promises.push(RFQErrorCodeCategoryMapping.bulkCreate(newMappingList, {
                    fields: createFields
                }));
            }
            if (promises && promises.length > 0) {
                return Promise.all(promises).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.RFQ_ERROR_CODE_MAPPING.SAVED))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
                });
            } else {
                return resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.RFQ_ERROR_CODE_MAPPING.SAVED);
            }
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    }
};