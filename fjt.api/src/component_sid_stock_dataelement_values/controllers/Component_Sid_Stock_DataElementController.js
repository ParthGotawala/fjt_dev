const _ = require('lodash');
const { Op } = require('sequelize');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const resHandler = require('../../resHandler');

const timelineObjForCompoSidStock = DATA_CONSTANT.TIMLINE.EVENTS.COMPONENT_SID_STOCK;
const CompoSidStockConstObj = DATA_CONSTANT.TIMLINE.COMPONENT_SID_STOCK;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const ComponentInputFields = [
    'id',
    'refsidid',
    'dataelementid',
    'value',
    'entityid',
    'isdeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const ComponentSidStockinputFields = [
    'sid',
    'refcompid',
    'uid',
    'scanlabel',
    'nickName',
    'prefix',
    'pkgQty',
    'price',
    'printStatus',
    'costCategoryID',
    'lotCode',
    'dateCode',
    'isinStk',
    'isdeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'uidPrefix',
    'customerID',
    'refCPNID',
    'binID',
    'mfgDate',
    'expiryDate',
    'pcbPerArray',
    'isSharedInventory',
    'MFGorExpiryDate',
    'spq',
    'cpn',
    'refCPNMFGPNID',
    'mfgAvailabel',
    'customerID',
    'assyID',
    'receiveMaterialType',
    'uom',
    'packaging',
    'orgQty',
    'pkgUnit',
    'orgPkgUnit',
    'orgRecBin',
    'customerConsign',
    'specialNote',
    'orgRecWarehouse',
    'orgRecDepartment',
    'sealDate',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'mfrDateCodeFormatID',
    'mfrDateCode',
    'rohsStatusID',
    'woID',
    'woNumber',
    'selfLifeDays',
    'shelfLifeAcceptanceDays',
    'maxShelfLifeAcceptanceDays',
    'isReservedStock'
];

const umidModuleName = DATA_CONSTANT.COMPONENT_SID_STOCK.UMID;
const dataElementName = DATA_CONSTANT.COMPONENT_SID_STOCK.DataElementName;

module.exports = {
    deleteComponentSidStockDataElement: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = 'component_sid_stock_dataelement_values';
            COMMON.setModelDeletedByFieldValue(req);

            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: null,
                    countList: null,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(() => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS,
                null,
                MESSAGE_CONSTANT.DELETED(dataElementName)
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
                );
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Get List of Component Sid Stock DataElement Values
    // POST : /api/v1/componentsidstockdataelement
    // @param paging info + component_sid_stock_id
    // @return List of Component Sid Stock wise DataElement Values
    retrieveComponentSidStockDataelementValues: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        sequelize.query('CALL Sproc_RetrieveComponentSidStockDataelementValues (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pRefsidid)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pRefsidid: req.body.cstID
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                componentSidStockDataelementValues: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        });
    }
};