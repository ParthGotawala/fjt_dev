const _ = require('lodash');
const { COMMON } = require('../../constant');
const { DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'woRevReqValID',
    'woRevReqID',
    'currentValue',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'isDeleted'
];

module.exports = {
    // Add workorder request for review value base on change type
    // @return API response
    // eslint-disable-next-line consistent-return
    addWorkorderReqForReviewValue: (req) => {
        const { WorkorderReqForReviewValues } = req.app.locals.models;
        if (req.body.changeType) {
            let promises = [];
            switch (req.body.changeType) {
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.DO.TYPE:
                    promises = module.exports.getOperationDetail(req);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.DN.TYPE:
                    promises = module.exports.getOperationDetail(req);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.IP.TYPE:
                    promises = module.exports.getOperationDetail(req);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.OF.TYPE:
                    promises = module.exports.getWorkorderOperationDataElementDetail(req);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.ST.TYPE:
                    promises = module.exports.getStandardsDetail(req);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.ET.TYPE:
                    promises = module.exports.getEquipmentDetail(req);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.SM.TYPE:
                    promises = module.exports.getWorkorderOperationPartDetail(req);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.WC.TYPE:
                    promises = module.exports.getOperationDetail(req);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.MI.TYPE:
                    promises = module.exports.getOperationDetail(req);
                    break;
                default:
                    return '';
            }
            promises.then((resp) => {
                _.each(resp, (currentValueJson) => {
                    req.body.currentValue = currentValueJson;
                    req.body.isDeleted = false;
                    COMMON.setModelCreatedByFieldValue(req);
                    WorkorderReqForReviewValues.create(req.body, {
                        field: inputFields
                    }).then(() => {
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
            });
        }
    },
    // Get operation detail base on change type
    // @return operation detail
    getOperationDetail: (req) => {
        const { Operation } = req.app.locals.models;
        return Operation.findOne({
            where: {
                opID: req.body.opID
            },
            attributes: ['opDescription', 'opDoes', 'opDonts', 'opManagementInstruction', 'opWorkingCondition']
        }).then((response) => {
            var currentValueList = [];
            switch (req.body.changeType) {
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.DO.TYPE:
                    currentValueList.push(response.dataValues.opDoes);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.DN.TYPE:
                    currentValueList.push(response.dataValues.opDonts);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.IP.TYPE:
                    currentValueList.push(response.dataValues.opDescription);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.WC.TYPE:
                    currentValueList.push(response.dataValues.opWorkingCondition);
                    break;
                case DATA_CONSTANT.WORKORDER_REQFORREVIEW.WORKORDER_CHANGE_TYPE.MI.TYPE:
                    currentValueList.push(response.dataValues.opManagementInstruction);
                    break;
                default:
                    return [];
            }
            return currentValueList;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return [];
        });
    },
    // Get list of standards detail
    // @return list of standards detail
    getStandardsDetail: (req) => {
        const { WorkorderCertification } = req.app.locals.models;
        return WorkorderCertification.findAll({
            where: {
                woID: req.body.woID
            }
        }).then((response) => {
            var currentValueList = [];
            _.each(response, (currentValueJson) => {
                var jsonObject = JSON.stringify(currentValueJson.dataValues);
                currentValueList.push(jsonObject);
            });
            return currentValueList;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return [];
        });
    },
    // Get list of equipmnet detail
    // @return list of equipmnet detail
    getEquipmentDetail: (req) => {
        const { Workorder_Operation_Equipment } = req.app.locals.models;
        return Workorder_Operation_Equipment.findAll({
            where: {
                woID: req.body.woID,
                opID: req.body.opID
            }
        }).then((response) => {
            var currentValueList = [];
            _.each(response, (currentValueJson) => {
                var jsonObject = JSON.stringify(currentValueJson.dataValues);
                currentValueList.push(jsonObject);
            });
            return currentValueList;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return [];
        });
    },
    // Get list of workorder operation part detail
    // @return list of workorder operation part detail
    getWorkorderOperationPartDetail: (req) => {
        const { WorkorderOperationPart } = req.app.locals.models;
        return WorkorderOperationPart.findAll({
            where: {
                woID: req.body.woID,
                opID: req.body.opID
            }
        }).then((response) => {
            var currentValueList = [];
            _.each(response, (currentValueJson) => {
                var jsonObject = JSON.stringify(currentValueJson.dataValues);
                currentValueList.push(jsonObject);
            });
            return currentValueList;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return [];
        });
    },
    // Get list of workorder operation data element detail
    // @return list of workorder operation data element detail
    getWorkorderOperationDataElementDetail: (req) => {
        const { WorkorderOperationDataelement } = req.app.locals.models;
        return WorkorderOperationDataelement.findAll({
            where: {
                woID: req.body.woID,
                opID: req.body.opID
            }
        }).then((response) => {
            var currentValueList = [];
            _.each(response, (currentValueJson) => {
                var jsonObject = JSON.stringify(currentValueJson.dataValues);
                currentValueList.push(jsonObject);
            });
            return currentValueList;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return [];
        });
    }
};
