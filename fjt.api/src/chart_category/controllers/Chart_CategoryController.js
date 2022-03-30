const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const inputFields = [
    'name',
    'order',
    'isDeleted',
    'createdBy'
];

const updateFields = [
    'name',
    'order',
    'updatedBy'
];

const moduleName = DATA_CONSTANT.CHART_CATEGORY.NAME;

module.exports = {
    // Get chart category list
    // GET : /api/v1/chartcategoy/getChartCategoryList
    // @return category list
    getChartCategoryList: (req, res) => {
        const { ChartCategory } = req.app.locals.models;
        ChartCategory.findAll({
            attributes: ['id', 'name', 'order'],
            order: [['order', 'ASC']]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Save chart category
    // GET : /api/v1/chartcategoy/saveChartCategory
    // @return API response
    saveChartCategory: (req, res) => {
        const { ChartCategory } = req.app.locals.models;
        if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name); }

        const where = {
            name: req.body.name
        };

        if (req.body.id) {
            where.id = { [Op.ne]: req.body.id };
        }

        ChartCategory.count({
            where: where
        }).then((count) => {
            if (count !== 0) {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'Category');
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
            } else if (req.body.id) {
                COMMON.setModelUpdatedByFieldValue(req);
                return ChartCategory.update(req.body, {
                    where: { id: req.body.id },
                    fields: updateFields
                }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(moduleName)))
                    .catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            } else {
                COMMON.setModelCreatedByFieldValue(req);
                return ChartCategory.create(req.body, {
                    fields: inputFields
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(moduleName)))
                    .catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    getChartCategoryByID: (req, res) => {
        const { ChartCategory } = req.app.locals.models;

        ChartCategory.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'name', 'order']
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // check for duplicate chart category
    // POST : /api/v1/chartcategoy/checkDuplicateChartCategory
    // @return API response for duplicate category
    checkDuplicateChartCategory: (req, res) => {
        if (req.body.catName) {
            const { ChartCategory } = req.app.locals.models;

            const whereClause = {
                name: req.body.catName
            };
            if (req.body.catMstID) {
                whereClause.id = {
                    [Op.ne]: req.body.catMstID
                };
            }

            return ChartCategory.findOne({
                where: whereClause,
                attributes: ['id']
            }).then((existsCategoryDet) => {
                if (existsCategoryDet) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateCategoryName: true } });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateCategoryName: false }, null);
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