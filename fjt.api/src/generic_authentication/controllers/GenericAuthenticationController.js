const _ = require('lodash');
const resHandler = require('../../resHandler');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');

const inputFields = [
    'id',
    'transactionType',
    'approveFromPage',
    'refTableName',
    'refID',
    'confirmationType',
    'approvedBy',
    'approvalReason',
    'createdBy',
    'updatedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const approvalReasonModuleName = DATA_CONSTANT.APPROVAL_REASON.DISPLAYNAME;

module.exports = {

    // Create Authenticated Approval Reason
    // POST : /api/v1/createAuthenticatedApprovalReason
    // @return New create Approval Reason
    createAuthenticatedApprovalReason: (req, res) => {
        const {
            GenericAuthenticationMst
        } = req.app.locals.models;
        if (req.body) {
            const objReason = req.body.objReason;
            const authenticateReasonObj = {
                transactionType: objReason.transactionType,
                approveFromPage: objReason.approveFromPage,
                refTableName: objReason.refTableName,
                refID: objReason.refID,
                confirmationType: objReason.confirmationType,
                approvedBy: objReason.approvedBy,
                approvalReason: objReason.approvalReason,
                createdBy: req.user.id,
                updatedBy: req.user.id
            };

            COMMON.setModelCreatedByFieldValue(authenticateReasonObj);

            return GenericAuthenticationMst.create(authenticateReasonObj, {
                fields: inputFields
            }).then(() =>
                resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(approvalReasonModuleName))
            ).catch((err) => {
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
    // Save all Authenticated Approval Reasons
    // POST : /api/v1/saveAllApprovalReasons
    // @return New creates Approval Reasons
    saveAllApprovalReasons: (req, res) => {
        const {
            GenericAuthenticationMst
        } = req.app.locals.models;
        if (req.body) {
            const objReasonlst = req.body.objReasonlst;

            COMMON.setModelCreatedArrayFieldValue(objReasonlst);

            return GenericAuthenticationMst.bulkCreate(objReasonlst, {
                fields: inputFields
            }).then(() =>
                resHandler.successRes(res, 200, STATE.SUCCESS, null, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, null);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // create Authenticated Approval Reason with Working Process of other api
    // POST : /api/v1/authenticateReason/addAuthenticatedApprovalReasonWithWorkingProcess
    // @return New create Approval Reason success
    addAuthenticatedApprovalReasonWithWorkingProcess: (req, currTransaction) => {
        const {
            GenericAuthenticationMst
        } = req.app.locals.models;
        const genericAuthenticationDet = req.body.authenticationApprovedDet;
        COMMON.setModelCreatedByFieldValue(genericAuthenticationDet);
        return GenericAuthenticationMst.create(genericAuthenticationDet, {
            fields: inputFields,
            transaction: currTransaction ? currTransaction : null
        }).then(createdAuthDet => ({
            isSuccess: true,
            createdAuthDet: createdAuthDet
        }));
    },

    // create Authenticated Approval Reason list with Working Process of other api
    // POST : /api/v1/authenticateReason/addAuthenticatedApprovalReasonListWithWorkingProcess
    // @return New create Approval Reason success
    addAuthenticatedApprovalReasonListWithWorkingProcess: (req, currTransaction) => {
        const {
            GenericAuthenticationMst
        } = req.app.locals.models;
        const genericAuthenticationList = req.body.authenticationApprovedList;

        COMMON.setModelCreatedArrayFieldValue(genericAuthenticationList);

        return GenericAuthenticationMst.bulkCreate(genericAuthenticationList, {
            fields: inputFields,
            transaction: currTransaction ? currTransaction : null
            // individualHooks:true
        }).then(createdAuthList => ({
            isSuccess: true,
            createdAuthList: createdAuthList
        }));
    },
    retrieveGenericConfirmation: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveGenericConfirmation (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pConfirmationTypeID,:pRefTableName,:pRefID)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pConfirmationTypeID: req.body.confirmationType || null,
                    pRefTableName: req.body.refTableName || null,
                    pRefID: req.body.refID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                genericConfirmation: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
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
    }


};