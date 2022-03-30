/* eslint-disable no-undef */
const { states } = require('./constant');
const { MESSAGE_CONSTANT } = require('../constant');
const logger = require('../config/logger_config.js');
const _ = require('lodash');

const resHandler = {
    success(obj) {
        return {
            status: states.SUCCESS,
            data: obj
        };
    },
    error(err) {
        let apiURL = (requestObject && requestObject.originalUrl) ? requestObject.originalUrl : null;
        let apiMethod = (requestObject && requestObject.originalMethod) ? requestObject.originalMethod : null;
        let apiString = requestObject ? (`:: Method: ${apiMethod};URL: ${apiURL}`) : '';
        if (!apiString) {
            apiURL = (res && res.req) ? res.req.baseUrl : null;
            apiMethod = (res && res.req) ? res.req.originalMethod : null;
            apiString = (res) ? (`:: Method: ${apiMethod};URL: ${apiURL}`) : '';
        }
        const msgString = `error ${apiString}`;
        logger.log(msgString, JSON.stringify(`Error- 'dbError', status- ${states.FAILED}, errors- ${JSON.stringify(err.errors)}`));
        return {
            status: states.FAILED,
            error: err
        };
    },
    notFound() {
        let apiURL = (requestObject && requestObject.originalUrl) ? requestObject.originalUrl : null;
        let apiMethod = (requestObject && requestObject.originalMethod) ? requestObject.originalMethod : null;
        let apiString = requestObject ? (`:: Method: ${apiMethod};URL: ${apiURL}`) : '';
        if (!apiString) {
            apiURL = (res && res.req) ? res.req.baseUrl : null;
            apiMethod = (res && res.req) ? res.req.originalMethod : null;
            apiString = (res) ? (`:: Method: ${apiMethod};URL: ${apiURL}`) : '';
        }
        const msgString = `error ${apiString}`;
        logger.log(msgString, JSON.stringify(`ErrorCode- 'notFound', status- ${states.EMPTY}, errors- 'notFound'`));
        return {
            status: states.EMPTY,
            data: null
        };
    },
    dbError(res, err) {
        let apiURL = (requestObject && requestObject.originalUrl) ? requestObject.originalUrl : null;
        let apiMethod = (requestObject && requestObject.originalMethod) ? requestObject.originalMethod : null;
        let apiString = requestObject ? (`:: Method: ${apiMethod};URL: ${apiURL}`) : '';
        if (!apiString) {
            apiURL = (res && res.req) ? res.req.baseUrl : null;
            apiMethod = (res && res.req) ? res.req.originalMethod : null;
            apiString = (res) ? (`:: Method: ${apiMethod};URL: ${apiURL}`) : '';
        }
        const msgString = `Db error ${apiString}`;
        logger.log(msgString, JSON.stringify(`ErrorCode- 'dbError', status- ${states.FAILED}, errors- ${JSON.stringify(err)}, fields- ${JSON.stringify(err.fields)}`));
        return {
            status: states.FAILED,
            errors: {
                messages: err.errors,
                fields: err.fields
            }
        };
    },
    successRes(res, code, state, data, usrMessage) {
        let apiURL = (requestObject && requestObject.originalUrl) ? requestObject.originalUrl : null;
        let apiMethod = (requestObject && requestObject.originalMethod) ? requestObject.originalMethod : null;
        let apiString = requestObject ? (`:: Method: ${apiMethod};URL: ${apiURL}`) : '';
        if (!apiString) {
            apiURL = (res && res.req) ? res.req.baseUrl : null;
            apiMethod = (res && res.req) ? res.req.originalMethod : null;
            apiString = (res) ? (`:: Method: ${apiMethod};URL: ${apiURL}`) : '';
        }
        const msgString = `successRes error ${apiString}`;
        if (state !== 'SUCCESS') {
            logger.log(msgString, JSON.stringify(`ErrorCode- ${code}, status- ${state}, data- ${data}, errors- ${JSON.stringify(usrMessage)}`));
        }
        res.status(code).json({
            status: state,
            data,
            userMessage: usrMessage
        });
    },
    errorRes(res, code, state, errors) {
        let apiURL = (requestObject && requestObject.originalUrl) ? requestObject.originalUrl : null;
        let apiMethod = (requestObject && requestObject.originalMethod) ? requestObject.originalMethod : null;
        let apiString = requestObject ? (`:: Method: ${apiMethod};URL: ${apiURL}`) : '';
        if (!apiString) {
            apiURL = (res && res.req) ? res.req.baseUrl : null;
            apiMethod = (res && res.req) ? res.req.originalMethod : null;
            apiString = (res) ? (`:: Method: ${apiMethod};URL: ${apiURL}`) : '';
        }
        const msgString = `error ${apiString}`;
        const errorDet = _.cloneDeep(errors);
        let messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.PARENT_DATA_NOT_EXISTS);
        if (errorDet && errorDet.err) {
            if (errorDet.err.parent && errorDet.err.parent.sqlState === '45001') {
                messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.PARENT_DATA_NOT_EXISTS);
                if (messageContent) {
                    errorDet.messageContent = messageContent;
                } else {
                    errorDet.messageContent.err = { message: errors.err.message, stack: errors.err.stack };
                }
            } else if (errorDet.err.parent && errorDet.err.parent.sqlState === '45000') {
                messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.DUPLICATE_ENTRY_WITHOUT_PARAMETER);
                if (messageContent) {
                    errorDet.messageContent = messageContent;
                } else {
                    errorDet.messageContent.err = { message: errors.err.message, stack: errors.err.stack };
                }
            } else {
                errorDet.messageContent.err = { message: errors.err.message, stack: errors.err.stack };
            }
        }
        logger.log(msgString, JSON.stringify(`ErrorCode- ${code}, status- ${state}, errors- ${JSON.stringify(errorDet)}`));
        res.status(code).json({
            status: state,
            errors: errorDet
        });
    }
};

module.exports = resHandler;
