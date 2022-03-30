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

const mstinputFields = [
    'id',
    'releasedDate',
    'version',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const detailsinputFields = [
    'id',
    'releasedID',
    'notes',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const releaseNote = DATA_CONSTANT.RELEASE_NOTES.DISPLAYNAME;

module.exports = {

    // get:/api/v1/release_notes_detail/getReleaseNotes/Id
    getReleaseNoteDetailInfo: (req, res) => {
        const {
            ReleaseNoteDetail,
            ReleaseNotes
        } = req.app.locals.models;
        if (req.params.Id) {
            ReleaseNotes.findOne({
                where: {
                    Id: req.params.Id
                },
                attributes: ['Id', 'version', 'releasedDate'],
                include: {
                    model: ReleaseNoteDetail,
                    as: 'ReleaseNoteDetail',
                    attributes: ['releasedId', 'notes', 'Id']
                }
            }).then((ReleaseNotesDetail) => {
                if (!ReleaseNotesDetail) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(releaseNote),
                        err: null,
                        data: null
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, ReleaseNotesDetail, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }
    },

    // get:/api/v1/release_notes_detail/getReleaseVersion
    getReleaseVersion: (req, res) => {
        const {
            ReleaseNotes
        } = req.app.locals.models;
        ReleaseNotes.findAll({
            where: {
                isDeleted: false
            },
            attributes: ['Id', 'version', 'releasedDate'],
            order: [
                ['version', 'DESC']
            ]
        }).then(ReleaseNotesVerison => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, ReleaseNotesVerison, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // check release date and version Already Exists
    // POST : /api/v1/release_note/releaseNotesValidation
    // @return API response
    releaseNotesValidation: (req, res, isFromApi) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const isFromApiCheck = isFromApi === true ? true : false;
            return sequelize.query('CALL Sproc_ValidateReleaseNotes (:pReleaseID,:pVersion,:pReleaseDate)', {
                replacements: {
                    pReleaseID: req.body.id || null,
                    pVersion: req.body.version || null,
                    pReleaseDate: req.body.releasedDate || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (isFromApiCheck) {
                    if (response[0] && (response[0][0] && response[0][0].status && response[0][0].status === 'Success' && response[0][0].ErrorCode === 0)) {
                        return Promise.resolve(false); // in case of validation clear
                    } else if (response[0] && (response[0][0] && response[0][0].ErrorCode && response[0][0].ErrorCode)) {
                        return Promise.resolve(response[0][0]); // in case of any validation triggers
                    } else {
                        return Promise.resolve(false);
                    }
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null);
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // save release details
    // POST : /api/v1/release_note/saveReleaseDetails
    // @return API response
    saveReleaseDetails: (req, res) => {
        const {
            ReleaseNotes
        } = req.app.locals.models;
        return module.exports.releaseNotesValidation(req, res, true).then((validate) => { // Check release note validations while add/update
            if (validate) { // if any error is return from above method
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: null,
                    err: null,
                    data: validate
                });
            } else if (req.body.id) {
                // Update
                COMMON.setModelUpdatedByFieldValue(req);
                return ReleaseNotes.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: mstinputFields
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(releaseNote))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else {
                // Create release note
                COMMON.setModelCreatedByFieldValue(req);
                return ReleaseNotes.create(req.body, {
                    fields: mstinputFields
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(releaseNote))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }
        });
    },
    // save release details
    // POST : /api/v1/release_note/saveReleaseNotesDetails
    // @return API response
    saveReleaseNotesDetails: (req, res) => {
        const {
            ReleaseNoteDetail
        } = req.app.locals.models;
        if (req.body) {
            if (req.body.id) {
                // Update
                COMMON.setModelUpdatedByFieldValue(req);
                return ReleaseNoteDetail.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: detailsinputFields
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(releaseNote))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else {
                // Create
                COMMON.setModelCreatedByFieldValue(req);
                return ReleaseNoteDetail.create(req.body, {
                    fields: detailsinputFields
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(releaseNote))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Remove Release Details
    // POST : /api/v1/fob/deleteReleaseNotesDetails
    // @return API response
    deleteReleaseNotesDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objID.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.RELEASE_NOTES_DETAILS.Name,
                    IDs: req.body.objID.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objID.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(releaseNote))).catch((err) => {
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
    // Remove Release Details
    // POST : /api/v1/fob/deleteReleaseDetails
    // @return API response
    deleteReleaseDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objID.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.RELEASE_NOTES.Name,
                    IDs: req.body.objID.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objID.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(releaseNote))).catch((err) => {
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
    // get:/api/v1/release_notes_detail/getLatestReleaseVersion
    getLatestReleaseVersion: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('Select fun_getLatestReleaseVersion()', {
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0])[0]))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    }
};