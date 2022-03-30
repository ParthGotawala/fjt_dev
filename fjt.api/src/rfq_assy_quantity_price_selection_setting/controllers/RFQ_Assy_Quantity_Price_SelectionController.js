/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');

const pricingSettingModuleName = DATA_CONSTANT.PRICING_SETTING.NAME;

const inputFields = [
    'id',
    'qtyID',
    'stock',
    'price',
    'isCheckRequiredQty',
    'isLeadTime',
    'stockPercentage',
    'packagingID',
    'remark',
    'createdBy',
    'updatedBy',
    'rfqPriceGroupId',
    'rfqPriceGroupDetailId',
    'settingType',
    'leadTime'
];
module.exports = {
    // Get List of price selection setting
    // POST : /api/v1/priceselectionsetting/retrievePriceSelectionSetting
    // @return List of price selection setting
    retrievePriceSelectionSetting: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') {
            strWhere = null;
        }
        let strOrderBy = null;
        if (filter.order[0]) {
            strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
        }

        return sequelize.query('CALL Sproc_AssyQuantityPriceSelectionSettings (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prfqAssyID,:psettingType)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: strOrderBy,
                pWhereClause: strWhere,
                prfqAssyID: req.body.id,
                psettingType: req.body.settingType
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { pricingSettings: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // save List of price selection setting
    // POST : /api/v1/priceselectionsetting/savePriceSelectionSetting
    // @return none
    savePriceSelectionSetting: (req, res) => {
        const { RFQAssyQuantityPriceSelectionSetting } = req.app.locals.models;
        if (req.body.priceSettingList) {
            const promises = [];
            _.each(req.body.priceSettingList, (priceSetting) => {
                if (!priceSetting.id) {
                    priceSetting.createdBy = req.user.id;
                    promises.push(RFQAssyQuantityPriceSelectionSetting.create(priceSetting, {
                        fields: inputFields
                    }));
                } else {
                    priceSetting.updatedBy = req.user.id;
                    promises.push(RFQAssyQuantityPriceSelectionSetting.update(priceSetting, {
                        where: {
                            id: priceSetting.id,
                            isDeleted: false
                        },
                        fields: ['stock', 'price', 'updatedBy', 'isCheckRequiredQty', 'isLeadTime', 'remark', 'stockPercentage', 'packagingID', 'rfqPriceGroupId', 'rfqPriceGroupDetailId', 'leadTime']
                    }));
                }
            });
            return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(pricingSettingModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get packaging list
    // POST : /api/v1/priceselectionsetting/getPackaging
    // @return packagingList
    getPackaging: (req, res) => {
        const { ComponentPackagingMst, sequelize, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var promises = [];
        promises.push(ComponentPackagingMst.findAll({
            where: {
                isDeleted: false
            },
            paranoid: false,
            // order: ['name'],
            order: [sequelize.fn('ISNULL', sequelize.col('ComponentPackagingMst.displayOrder')), ['displayOrder', 'ASC'], ['name', 'ASC']],
            attributes: ['id', 'name', 'isActive', 'sourceName']
        }).then(response => response).catch((err) => {
            console.trace();
            console.error(err);
            return [];
        }));
        promises.push(ComponentFieldsGenericaliasMst.findAll({
            where: {
                isDeleted: false,
                refTableName: 'component_packagingmst'
            },
            attributes: ['refId', 'alias']
        }).then(response => response).catch((err) => {
            console.trace();
            console.error(err);
            return [];
        }));
        return Promise.all(promises).then((responses) => {
            const packaging = responses[0];
            const packageList = [];
            const packagingAlias = responses[1];
            _.each(packaging, (item) => {
                item.dataValues.component_packagingmst = _.filter(packagingAlias, alias => alias.refId === item.id);
                packageList.push(item);
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packageList, null);
        });
    },
    // Copy Price selection setting
    // POST : /api/v1/priceselectionsetting/CopyPriceSelectionSetting
    // @return response
    CopyPriceSelectionSetting: (req, res) => {
        const { sequelize } = req.app.locals.models;

        return sequelize.query('CALL Sproc_CopyAssyQuantityPriceSelectionSettings (:prfqAssyID,:pFromSettingType,:pToSettingType,:pUserID,:pRoleID)', {
            replacements: {
                prfqAssyID: req.body.rfqAssyID,
                pToSettingType: req.body.toSettingType,
                pFromSettingType: req.body.fromSettingType,
                pUserID: req.user.id,
                pRoleID: COMMON.getRequestUserLoginRoleID()
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.RFQ.PRICE_SELECTION_SETTING_COPIED)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};

