const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const moduleName = DATA_CONSTANT.SCANNER_MST.NAME;

const inputFields = [
    'id',
    'ipAddress',
    'nodename',
    'usbModelName',
    'make',
    'model',
    'version',
    'location',
    'macAddress',
    'isActive',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrieve list of active scanner
    // POST : /api/v1/scanner/retrieveScannerList
    // @return list of Scanner
    retrieveScannerList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveScanner(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { scanner: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Retrieve list of active scanner
    // GET : /api/v1/scanner/getActiveScanner
    // @return list of active scanner
    getActiveScanner: (req, res) => {
        const { ScannerMst } = req.app.locals.models;

        ScannerMst.findAll({
            where: {
                isActive: true,
                isDeleted: false
            },
            attributes: ['id', 'ipAddress', 'nodename', 'usbModelName', 'model', 'location'],
            required: false,
            order: [
                ['ipAddress', 'ASC']
            ]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // create Scanner
    // GET : /api/v1/scanner/createScanner
    createScanner: (req, res) => {
        const { ScannerMst } = req.app.locals.models;
        COMMON.setModelCreatedByFieldValue(req);
        ScannerMst.create(req.body, {
            fields: inputFields
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(moduleName))).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // update scanner
    // GET : /api/v1/scanner/updateScanner
    updateScanner: (req, res) => {
        const { ScannerMst } = req.app.locals.models;
        COMMON.setModelUpdatedByFieldValue(req);
        ScannerMst.update(req.body, {
            where: {
                id: req.body.id
            },
            fields: inputFields
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName))).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Delete scanner
    // POST : /api/v1/scanner/deleteScanner
    // @return API response
    deleteScanner: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.objDelete.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.Scanner.Name,
                    IDs: req.body.objDelete.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: null,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(moduleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // check ipAddress Already Exists
    // POST : /api/v1/scanner/checkipAddressAlreadyExists
    // @return API response
    checkipAddressAlreadyExists: (req, res) => {
        const { ScannerMst } = req.app.locals.models;
        if (req.body) {
            const ipAndNodeNameWhereClause = {};
            if (req.body.objs.ipAddress) {
                ipAndNodeNameWhereClause.ipAddress = req.body.objs.ipAddress;
            }
            if (req.body.objs.nodename) {
                ipAndNodeNameWhereClause.nodename = req.body.objs.nodename;
            }
            if (req.body.objs.usbModelName) {
                ipAndNodeNameWhereClause.usbModelName = req.body.objs.usbModelName;
            }
            const whereClause = {
                [Op.or]: ipAndNodeNameWhereClause
            };
            if (req.body.objs.id) {
                whereClause.id = {
                    [Op.notIn]: [req.body.objs.id]
                };
            }
            ScannerMst.findAll({
                where: whereClause
            }).then((isExists) => {
                if (isExists.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicate: false }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }
    }
};