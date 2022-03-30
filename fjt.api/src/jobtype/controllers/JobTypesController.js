const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'id',
    'name',
    'description',
    'shortname',
    'isActive',
    'termsandcondition',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'isLaborCosting',
    'isMaterialCosting'
];

const jobTypeModuleName = DATA_CONSTANT.JOB_TYPES.ADDUPDATEDISAPLAYNAME;
const jobTypeDeleteModuleName = DATA_CONSTANT.JOB_TYPES.DISPLAYNAME;
module.exports = {
    // Create Job Type
    // POST : /api/v1/job_type/createJobType
    // @return created jobType
    createJobType: (req, res) => {
        const { JobType } = req.app.locals.models;
        if (req.body) {
            if (req.body.shortname) { req.body.shortname = req.body.shortname.toUpperCase(); }

            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }
            req.body.termsandcondition = COMMON.setTextAngularValueForDB(req.body.termsandcondition);
            const where = {
                [Op.or]: [
                    { name: req.body.name },
                    { shortname: req.body.shortname }
                ]
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            return JobType.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    const field = (response.name.toLowerCase() === req.body.name.toLowerCase()) ? 'Name' : 'ShortName';
                    messageContent.message = (response.name.toLowerCase() === req.body.name.toLowerCase()) ? COMMON.stringFormat(messageContent.message, 'Job type') : COMMON.stringFormat(messageContent.message, 'Short name');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: { fieldName: field } });
                } else if (req.body.id) {
                    COMMON.setModelUpdatedByFieldValue(req);

                    return JobType.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(jobTypeModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return JobType.create(req.body, {
                        fields: inputFields
                    }).then(jobType => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, jobType, MESSAGE_CONSTANT.CREATED(jobTypeModuleName))).catch((err) => {
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve list of Job Type
    // POST : /api/v1/job_type/retriveJobTypeList
    // @return list of jobType
    retriveJobTypeList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveJobTypeList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { JobType: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve detail of Job Type
    // GET : /api/v1/job_type/retriveJobTypeList
    // @return detail of jobType
    retriveJobType: (req, res) => {
        const { JobType, RFQAssemblies } = req.app.locals.models;
        if (req.query.id) {
            return JobType.findOne({
                where: { id: req.query.id },
                include: [{
                    model: RFQAssemblies,
                    as: 'rfqAssemblies',
                    attributes: ['id', 'jobTypeID'],
                    require: false
                }]
            }).then((jobType) => {
                if (!jobType) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(jobTypeModuleName), err: null, data: null });
                }
                jobType.termsandcondition = COMMON.getTextAngularValueFromDB(jobType.termsandcondition);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, jobType, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Remove Job Type
    // POST : /api/v1/job_type/removeJobType
    // @return list of jobType by ID
    deleteJobType: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.JobType.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(jobTypeDeleteModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: response, IDs: req.body.objIDs.id }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve list of Job Type
    // GET : /api/v1/job_type/getJobTypeList
    // @return list of Job Type
    getJobTypeList: (req, res) => {
        const { JobType } = req.app.locals.models;

        return JobType.findAll({
            attributes: ['id', 'name', 'isActive']
        }).then(jobTypeList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, jobTypeList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Check Unique jobType
    // GET : /api/v1/job_type/findSameJobType
    // @return find Unique validation
    findSameJobType: (req, res) => {
        const { JobType } = req.app.locals.models;
        var where = {};
        if (req.body.shortname) { where.shortname = req.body.shortname.toUpperCase(); }

        if (req.body.name) { where.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

        if (req.body.id) { where.id = { [Op.ne]: req.body.id }; }

        return JobType.findOne({
            where: where,
            attributes: ['id', 'name', 'shortname']
        }).then((jobType) => {
            if (jobType) {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                //  var msg = '';
                if (req.body.shortname) { messageContent.message = COMMON.stringFormat(messageContent.message, 'Short name'); }
                if (req.body.name) { messageContent.message = COMMON.stringFormat(messageContent.message, 'Job type'); }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};
