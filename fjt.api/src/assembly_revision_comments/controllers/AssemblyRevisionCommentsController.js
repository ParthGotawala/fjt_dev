const resHandler = require('../../resHandler');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const _ = require('lodash');
const { Op } = require('sequelize');

const inputFields = [
    'commentId',
    'comment',
    'commentBy',
    'partID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const moduleName = DATA_CONSTANT.ASSEMBLY_REVISION_COMMENT.NAME;

module.exports = {
    // Get List of comments
    // GET : /api/v1/comments/retrieveCommment
    // @return List of comments
    retrieveComments: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        return sequelize.query('CALL Sproc_RetrieveComponentCommentsList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pPartID,:pIsSupplierPart)', {
            replacements: {
                ppageIndex: req.body.Page,
                precordPerPage: req.body.isExport ? null : filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pPartID: req.body.PartID,
                pIsSupplierPart: req.body.IsSupplierPart && JSON.parse(req.body.IsSupplierPart) ? 1 : 0
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            comment: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // POST
    // retrieve comment by comment id
    getCommentByID: (req, res) => {
        const {
            AssemblyRevisionComments
        } = req.app.locals.models;
        if (req.body.commentId) {
            return AssemblyRevisionComments.findOne({
                where: {
                    commentId: req.body.commentId
                },
                attributes: ['commentId', 'comment']
            }).then(comment => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, comment)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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

    saveComment: (req, res) => {
        const {
            AssemblyRevisionComments
        } = req.app.locals.models;
        return module.exports.checkCommentUnique(req, res, true).then((validate) => {
            if (validate) {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'Comment');
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: messageContent,
                    err: null,
                    data: {
                        duplicateComment: true
                    }
                });
            } else if (req.body.commentId) {
                COMMON.setModelUpdatedByFieldValue(req.body);
                return AssemblyRevisionComments.update(req.body, {
                    where: {
                        commentId: req.body.commentId
                    },
                    fields: inputFields
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else {
                COMMON.setModelCreatedByFieldValue(req.body);
                return AssemblyRevisionComments.create(req.body, {
                    fields: inputFields
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(moduleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }
        });
    },

    checkCommentUnique: (req, res, isFromApi) => {
        const {
            AssemblyRevisionComments
        } = req.app.locals.models;
        const whereClause = {
            partID: req.body.partID,
            comment: req.body.comment
        };
        const isFromApiCheck = isFromApi === true ? true : false;
        if (req.body.commentId) {
            whereClause.commentId = {
                [Op.ne]: req.body.commentId
            };
        }
        return AssemblyRevisionComments.findOne({
            where: whereClause,
            attributes: ['commentId', 'comment']
        }).then((comment) => {
            if (isFromApiCheck) {
                return Promise.resolve(comment);
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, comment);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    deleteComment: (req, res) => {
        const {
            AssemblyRevisionComments
        } = req.app.locals.models;
        if (req.body.objIDs) {
            COMMON.setModelDeletedByFieldValue(req);
            return AssemblyRevisionComments.update(req.body, {
                where: {
                    commentId: {
                        [Op.in]: req.body.objIDs.id
                    }
                },
                fields: inputFields
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(moduleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // Get Part Master Internal Comments
    // POST : /api/v1/comments/getPartMasterInternalCommentsByPartId
    // @return list of add comments
    getPartMasterInternalCommentsByPartId: (req, res) => {
        const {
            AssemblyRevisionComments
        } = req.app.locals.models;
        if (req.body) {
            return AssemblyRevisionComments.findAll({
                where: {
                    partID: req.body.partId
                },
                attributes: ['commentId', 'comment']
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                );
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    }
};