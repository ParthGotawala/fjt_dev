const { COMMON } = require('../src/constant');
//const { DATA_CONSTANT } = require('../constant');
const _ = require('lodash');
let MESSAGE_CONSTANT = {};
const fs = require('fs');

let allAPIConstantMessages = require(COMMON.Api_Message_JSON_File_Read_Path);
MESSAGE_CONSTANT = _.assign(MESSAGE_CONSTANT, allAPIConstantMessages);

_.each(COMMON.DYNAMIC_MESSAGE_CATEGORY, (element) => {
    let allAPIConstantMessages = require(COMMON.DYNAMIC_MESSAGE_CONFIGURATION.DEFAULT_FOLDER_PATH + element + ".json");
    MESSAGE_CONSTANT[element] = Object.assign(MESSAGE_CONSTANT[element] || {}, allAPIConstantMessages);
});

let messageContent = "";
let MESSAGE_CONSTANT_METHODS = {
    NOT_FOUND: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.NOT_FOUND);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    CREATED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.CREATED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    NOT_CREATED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.NOT_CREATED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    ADDED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.ADDED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    NOT_ADDED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.NOT_ADDED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    UPDATED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.UPDATED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    NOT_UPDATED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.NOT_UPDATED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    DELETED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.DELETED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    NOT_DELETED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.NOT_DELETED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    REMOVED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.REMOVED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    NOT_REMOVED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.NOT_REMOVED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    SAVED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.SAVED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    NOT_SAVED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.NOT_SAVED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    SUBMIT: (moduleName) => {
        return COMMON.stringFormat(COMMON.CORE_MESSAGE.SUBMIT, moduleName);
    },
    COPY: (moduleName) => {
        return COMMON.stringFormat(COMMON.CORE_MESSAGE.COPY, moduleName);
    },
    STATICMSG: (msg) => {
        return msg;
    },
    DUPLICATE_ENTRY: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.DUPLICATE_ENTRY);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    },
    UNIQUE: (fieldName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
        messageContent.message = COMMON.stringFormat(messageContent.message, fieldName);
        return messageContent;
    },
    CHART_TYPES: {
        CHART_TYPES_UNIQUE: 'Chart type is already exist'
    },
    STOPPED: (moduleName) => {
        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.STOPPED);
        messageContent.message = COMMON.stringFormat(messageContent.message, moduleName);
        return messageContent;
    }
};

MESSAGE_CONSTANT = _.assign(MESSAGE_CONSTANT, MESSAGE_CONSTANT_METHODS);
let DYNAMIC_MESSAGE_CONFIG = {
    GENERATED: { messageCode: "", messageType: "Success", message: "{0} files generated successfully" },
    SCRIPT_NOT_SUCCESS: "Error in {0} script: {1}",
    SCRIPT_EXEC_NOT_ALLOWED_FOR_DROP_TABLE: 'DB-Script contain <b>"DROP TABLE" script in script block {0}</b>. Not allowed to execute this type of script. Please remove it first.',
    SCRIPT_UPTODATE: "No new db-script to update. All updated.",
    MESSAGE_UNIQUE: "Combination of Category({0}) and Message Key({1}) must be unique.",
    MESSAGE_NOTFOUND: "Combination of Category({0}) and Message Key({1}) not found.",
    WHEREUSED_PAGE_UNIQUE: { messageCode: "", messageType: "Warning", message: "Where used page entry of message Code <b>{0}</b> for page <b>{1}</b> is already added." },
    WHEREUSED_PAGE_NOTFOUND: { messageCode: "", messageType: "Error", message: "Where used page entry of message Code <b>{0}</b> for page <b>{1}</b> not found." },
};
MESSAGE_CONSTANT["DYNAMIC_MESSAGE_CONFIG"] = _.assign(MESSAGE_CONSTANT["DYNAMIC_MESSAGE_CONFIG"], DYNAMIC_MESSAGE_CONFIG);

module.exports = MESSAGE_CONSTANT;