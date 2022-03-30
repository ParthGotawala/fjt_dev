/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
var Excel = require('exceljs');
Excel.config.setValue('promise', require('bluebird'));
const mkdirp = require('mkdirp');

const fs = require('fs');
const { STATE, REQUEST } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
/* errors file*/
const { NotFound, NotCreate, InvalidPerameter } = require('../../errors');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const _ = require('lodash');

const laborModuleName = DATA_CONSTANT.LABOR.NAME;
module.exports = {
    // Get All labor assy qty and request qty
    // GET : /api/v1/laborassyqpa/getLaborAssyQty
    // @param {rfqAssyID} int,{partid} int
    // @return List of labor assy qty and request qty

    getLaborAssyQty: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize
            .query('CALL Sproc_getLaborAssyQty (:pPartID,:prfqAssyID)',
                {
                    replacements: {
                        pPartID: req.params.pPartID,
                        prfqAssyID: req.params.prfqAssyID
                    },
                     type: sequelize.QueryTypes.SELECT
                })
            .then(response => resHandler.successRes(res, 200, STATE.SUCCESS, {
                    requestQtyList: _.values(response[0]),
                    assyList: _.values(response[1]),
                    turnTimeQtyList: _.values(response[2]),
                    qtyWiseCost: _.values(response[3])
                })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(laborModuleName)));
            });
    },

    // Get All labor mounting type details
    // GET : /api/v1/laborassyqpa/getLaborMountingTypeDetails
    // @param {rfqAssyID} int,{partid} int
    // @return List of labor mounting type details
    getLaborMountingTypeDetails: (req, res) => {
        const { RFQAssyQtyWiseBOMLaborCostingDetail, RFQPriceGroup, RFQAssyLaborBOMMountingTypeQPADetail, RFQMountingType } = req.app.locals.models;
        RFQAssyLaborBOMMountingTypeQPADetail.findAll({
            where: {
                rfqAssyID: req.params.prfqAssyID,
                partID: req.params.pPartID,
                IsDeleted: false
            },
            attributes: ['id', 'rfqAssyID', 'mountingTypeID', 'lineCount', 'totalQPA', 'partID', 'subAssyID', 'isInstall'],
            order: [
                ['subAssyID', 'asc'],
                ['mountingTypeID', 'asc']
            ],
            include: [{
                model: RFQMountingType,
                as: 'rfqMountingType',
                where: { isDeleted: false },
                attributes: ['id', 'name', 'colorCode'],
                required: false
            }, {
                model: RFQAssyQtyWiseBOMLaborCostingDetail,
                as: 'rfqAssyBOMLaborCostingDetail',
                where: { isDeleted: false },
                attributes: ['id', 'rfqAssyQtyID', 'rfqAssyBOMMountingID', 'price', 'perAssyPrice', 'isPricePending', 'overHeadPrice', 'overHeadAssyPrice', 'rfqPriceGroupId', 'rfqPriceGroupDetailId'],
                required: false,
                include: [{
                    model: RFQPriceGroup,
                    as: 'rfqPriceGroup',
                    require: false
                }]
            }]
        }).then(labormount => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, labormount, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(laborModuleName)),
                err.errors, err.fields);
        });
    },

    // save labor details for mounting types
    // POST : /api/v1/laborassyqpa/saveLaborDetail
    // @return saved labor details
    saveLaborDetail: (req, res) => {
        const { RFQAssyQtyWiseBOMLaborCostingDetail, sequelize, RFQAssyQuotations } = req.app.locals.models;
        if (req.body.objLaborDet) {
            const laborList = req.body.objLaborDet.laborList;
            const objLabor = req.body.objLaborDet.objLabor;
            const isFinalSubmit = req.body.objLaborDet.isSubmit;
            const laborQuoteList = req.body.objLaborDet.laborQuoteList;
            const lborpromise = [];
            return sequelize.transaction().then((t) => {
                _.each(laborList, (lbor) => {
                    lbor.price = lbor.price ? parseFloat(lbor.price) : 0;
                    lbor.perAssyPrice = lbor.assyPrice ? lbor.assyPrice : 0;
                    lbor.overHeadPrice = lbor.overHeadPrice ? parseFloat(lbor.overHeadPrice) : 0;
                    lbor.overHeadAssyPrice = lbor.overHeadAssyPrice ? lbor.overHeadAssyPrice : 0;
                    lbor.updatedBy = req.user.id;
                    if (!lbor.subAssyID) {
                        lbor.isPricePending = lbor.price > 0 ? false : true;
                    }
                    if (lbor.id) {
                        lborpromise.push(
                            RFQAssyQtyWiseBOMLaborCostingDetail.update(lbor, {
                                where: {
                                    id: lbor.id,
                                    isDeleted: false
                                },
                                transaction: t,
                                fields: ['price', 'perAssyPrice', 'updatedBy', 'isPricePending', 'overHeadPrice', 'overHeadAssyPrice']
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            }));
                    } else {
                        lbor.createdBy = req.user.id;
                        lborpromise.push(
                            RFQAssyQtyWiseBOMLaborCostingDetail.create(lbor, {
                                fields: ['price', 'perAssyPrice', 'updatedBy', 'createdBy', 'rfqAssyQtyID', 'rfqAssyBOMMountingID', 'id', 'isPricePending', 'overHeadPrice', 'overHeadAssyPrice'],
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            }));
                    }
                });
                Promise.all(lborpromise).then((responses) => {
                    if (_.find(responses, result => result === STATE.FAILED)) {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(laborModuleName)));
                    } else if (isFinalSubmit) {
                            const laborQuotePromise = [];
                            _.each(laborQuoteList, (lQuote) => {
                                laborQuotePromise.push(
                                    RFQAssyQuotations.findOne({
                                        where: {
                                            rfqAssyID: lQuote.rfqAssyID,
                                            rfqAssyQtyID: lQuote.rfqAssyQtyID,
                                            rfqAssyQtyTurnTimeID: lQuote.rfqAssyQtyTurnTimeID,
                                            refSubmittedQuoteID: null
                                        },
                                        attributes: ['id', 'requestedQty']
                                    }).then((quote) => {
                                        if (quote) {
                                            const quoteObj = {
                                                updatedBy: req.user.id,
                                                laborunitPrice: lQuote.laborunitPrice
                                            };
                                            return RFQAssyQuotations.update(quoteObj, {
                                                where: {
                                                    id: quote.id,
                                                    isDeleted: false
                                                },
                                                transaction: t,
                                                fields: ['updatedBy', 'laborunitPrice']
                                            }).then(() => STATE.SUCCESS).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return STATE.FAILED;
                                            });
                                        } else {
                                            lQuote.createdBy = req.user.id;
                                            lQuote.isDeleted = false;
                                            return RFQAssyQuotations.create(lQuote, {
                                                transaction: t,
                                                fields: ['rfqAssyID', 'rfqAssyQtyID', 'rfqAssyQtyTurnTimeID', 'createdBy', 'isDeleted', 'laborunitPrice', 'turnTime', 'timeType', 'requestedQty']
                                            }).then(() => STATE.SUCCESS).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return STATE.FAILED;
                                            });
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return STATE.FAILED;
                                    })
                                );
                            });
                           return Promise.all(laborQuotePromise).then((results) => {
                                if (_.find(results, result => result === STATE.FAILED)) {
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(laborModuleName)));
                                } else {
                                    t.commit();
                                   return sequelize.query('CALL Sproc_getAllAssyLaborDetails (:pPartID,:prfqassyid )', {
                                        replacements: {
                                            pPartID: objLabor.partID,
                                            prfqassyid: objLabor.rfqAssyID
                                        }
                                    }).then(() => {
                                        var resObj = {
                                            isLabor: true,
                                            rfqAssyID: objLabor.rfqAssyID
                                        };
                                        RFQSocketController.updateSummaryQuote(req, resObj);
                                        return resHandler.successRes(res, 200, STATE.SUCCESS, responses, MESSAGE_CONSTANT.LABOR.SAVE_LABOR);
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(laborModuleName)),
                                            err.errors, err.fields);
                                    });
                                }
                            });
                        } else {
                            t.commit();
                           return sequelize.query('CALL Sproc_getAllAssyLaborDetails (:pPartID,:prfqassyid )', {
                                replacements: {
                                    pPartID: objLabor.partID,
                                    prfqassyid: objLabor.rfqAssyID
                                }
                            }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, responses, MESSAGE_CONSTANT.LABOR.SAVE_LABOR)).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(laborModuleName)),
                                    err.errors, err.fields);
                            });
                        }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(laborModuleName)),
                    err.errors, err.fields);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // export labor template
    exportLaborTemplate: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const objLabor = req.body.laborIds;
        sequelize.query('CALL Sproc_getLaborExportTemplateList (:pPartID,:prfqAssyID)', {
            replacements: {
                pPartID: objLabor.pPartID,
                prfqAssyID: objLabor.prfqAssyID
            },
type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            var rowData = response[0];
            var workbook1 = new Excel.Workbook();
            var sheet1 = workbook1.addWorksheet('Sheet1');
            sheet1.columns = [];
            let columns = [];
            _.each(rowData, (item) => {
                let keys = [];
                keys = Object.keys(item);
                _.each(keys, (key) => {
                    const obj = { header: key, key: key };
                    columns.push(obj);
                });
            });
            columns = _.uniqBy(columns, e => e.header);
            sheet1.columns = columns;
            _.each(rowData, (item) => {
                sheet1.addRow(item);
            });

            const path = DATA_CONSTANT.GENERICCATEGORY.UPLOAD_PATH;
            mkdirp(path, () => { });
            const timespan = Date.now();
            const filename = `Parts_${timespan}.xls`;
            res.setHeader('Content-Type', 'application/vnd.ms-excel');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            // entity=entity?entity:'error';

            workbook1.xlsx.writeFile(path + filename).then(() => {
                // let file = path + entity + ".xls";
                res.setHeader('Content-disposition', `attachment; filename=${filename}`);
                res.setHeader('Content-type', 'application/vnd.ms-excel');
                const filestream = fs.createReadStream(path + filename);
                fs.unlink(path + filename, () => { });
                filestream.pipe(res);
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(laborModuleName)));
        });
    }


};
