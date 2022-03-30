/* eslint-disable no-underscore-dangle */
const _ = require('lodash');

const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { DATA_CONSTANT } = require('../../../constant');
const { MESSAGE_CONSTANT } = require('../../../constant');

const jsonfile = require('jsonfile');
const fs = require('fs');
const moment = require('moment');

const dynamicMessageModuleName = DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.NAME;
const dynamicMessageConfigName = DATA_CONSTANT.MESSAGE_CONFIGURATION_CONSTANT.NAME;
const messageUsageName = DATA_CONSTANT.MESSAGE_CONFIGURATION_CONSTANT.MODULE_NAMES.MESSAGE_USAGE;
const empTimelineMessageModuleName = DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.EMP_TIMELINE_NAME;
const bson = require('bson');
const configData = require('../../../config/config.js'); // Used to get local flag for backup folder generation

module.exports = {

    // API: retrive dynamic messages from constant to display in grid.
    retrieveDynamicMessageConstant: (req, res) => {
        try {
            const dataConstantForMessageList = DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.MESSAGE_ACCESS_DATA;
            const allDynamicMessageData = [];

            _.each(dataConstantForMessageList, (constItem) => {
                let rawdata = null;
                rawdata = jsonfile.readFileSync(constItem.UPLOAD_PATH);
                if (rawdata) {
                    _.each(rawdata, (val, key) => {
                        if (_.isObject(val)) {
                            module.exports.checkJsonAndSetKeyValue(val, allDynamicMessageData, constItem, key);
                        } else {
                            const obj = {};
                            obj['key'] = key;
                            obj['value'] = val;
                            obj['moduleName'] = constItem.MODULE_NAME;
                            allDynamicMessageData.push(obj);
                        }
                    });
                }
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dynamicMessageList: allDynamicMessageData }, null);
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },

    // method: set json key value to object
    checkJsonAndSetKeyValue: (level1Val, allDynamicMessageData, constItem, key) => {
        _.each(level1Val, (innerObjVal, innerObjKey) => {
            if (_.isObject(innerObjVal)) {
                module.exports.checkJsonAndSetKeyValue(innerObjVal, allDynamicMessageData, constItem, innerObjKey);
            } else {
                const obj = {};
                obj['key'] = innerObjKey;
                obj['value'] = innerObjVal;
                obj['moduleName'] = constItem.MODULE_NAME;
                obj['childkey'] = key;
                allDynamicMessageData.push(obj);
            }
        });
    },

    // API: update dynamci message constant object
    updateDynamicMessageConstant: (req, res) => {
        if (req.body.key && req.body.value && req.body.moduleName) {
            try {
                const dataConstantForMessageList = DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.MESSAGE_ACCESS_DATA;

                const dataConstantForMessage = _.find(dataConstantForMessageList, item => req.body.moduleName === item.MODULE_NAME);
                if (!dataConstantForMessage) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });//
                }

                const fileName = dataConstantForMessage.UPLOAD_PATH;
                const rawdata = jsonfile.readFileSync(fileName);

                const obj = {
                    key: req.body.key,
                    value: req.body.value,
                    oldValue: req.body.oldValue
                };

                /* Check message key available in json file and get that object */
                const matchingObjFromJson = module.exports.getKeyValueMatchingObject(rawdata, obj);

                if (!matchingObjFromJson) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(dynamicMessageModuleName), err: null, data: null });
                }

                /* Check same new message already exists to other key on same level */
                const isUpdatingMessageAlreadyExists = _.some(matchingObjFromJson, (val, key) => key !== obj.key && val === obj.value);

                if (isUpdatingMessageAlreadyExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE('Message'), err: null, data: null });
                }

                /* Copy old data to new backup file and then update original file */
                if (!fs.existsSync(dataConstantForMessage.BACKUP_FILE_UPLOAD_PATH)) {
                    fs.mkdirSync(dataConstantForMessage.BACKUP_FILE_UPLOAD_PATH);
                }
                const currDateTime = moment(new Date()).format(COMMON.TIMESTAMP_FORMAT_FOR_APPEND_UNIQUE.toUpperCase()).replace(/:/g, '-').replace(' ', '_')
                    .replace('.', '-');
                const copyFileTo = `${dataConstantForMessage.BACKUP_FILE_UPLOAD_PATH + dataConstantForMessage.BACKUP_FILE_NAME}_${currDateTime.toString()}.json`;
                fs.copyFileSync(fileName, copyFileTo, 'a+');

                /* update record to original file */
                matchingObjFromJson[obj.key] = obj.value;
                jsonfile.writeFileSync(fileName, rawdata);

                /* update message to MESSAGE_CONSTANT object of api project if any */
                if (req.body.moduleName === COMMON.Api_Message_Module_Name) {
                    /* Check message key available and get that object from MESSAGE_CONSTANT */
                    const matchingObjFromMsgConst = module.exports.getKeyValueMatchingObject(MESSAGE_CONSTANT, obj);
                    if (!matchingObjFromMsgConst) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(dynamicMessageModuleName), err: null, data: null });
                        // return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(dynamicMessageModuleName)));
                    }

                    /* Check same new message already exists to other key on same level */
                    const isUpdatingMsgAlreadyExistsForMsgConst = _.some(matchingObjFromMsgConst, (val, key) => key !== obj.key && val === obj.value);
                    if (isUpdatingMsgAlreadyExistsForMsgConst) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE('Message'), err: null, data: null });
                    }
                    matchingObjFromMsgConst[obj.key] = obj.value;
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(dynamicMessageModuleName));
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                // return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(dynamicMessageModuleName)));
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // method: get key value matching whole object
    getKeyValueMatchingObject: (theObject, paramObj) => {
        var result = null;
        if (theObject instanceof Array) {
            for (let i = 0; i < theObject.length; i++) {
                result = module.exports.getKeyValueMatchingObject(theObject[i], paramObj);
                if (result) {
                    break;
                }
            }
        } else {
            // eslint-disable-next-line no-restricted-syntax
            for (const prop in theObject) {
                if (prop === paramObj.key) {
                    if (theObject[prop] === paramObj.oldValue) {
                        return theObject;
                    }
                }
                if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                    result = module.exports.getKeyValueMatchingObject(theObject[prop], paramObj);
                    if (result) {
                        break;
                    }
                }
            }
        }
        return result;
    },

    // method: get default value for matched key
    getDefaultValueMatchingObject: (messagesObj, paramObj) => {
        var result = null;
        if (messagesObj instanceof Array) {
            for (let i = 0; i < messagesObj.length; i++) {
                result = module.exports.getDefaultValueMatchingObject(messagesObj[i], paramObj);
                if (result) {
                    break;
                }
            }
        } else {
            // eslint-disable-next-line no-restricted-syntax
            for (const prop in messagesObj) {
                if (prop === paramObj.key) {
                    const matchObj = {
                        key: prop,
                        value: messagesObj[prop]
                    };
                    return matchObj;
                }
                if (messagesObj[prop] instanceof Object || messagesObj[prop] instanceof Array) {
                    result = module.exports.getDefaultValueMatchingObject(messagesObj[prop], paramObj);
                    if (result) {
                        break;
                    }
                }
            }
        }
        return result;
    },

    // API: bind all moduels message while login or on page load
    getAllModuleDynamicMessages: (req, res) => {
        try {
            let dataConstantForMessageList = DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.MESSAGE_ACCESS_DATA;
            dataConstantForMessageList = _.filter(dataConstantForMessageList, msgItem => msgItem.USED_AT === 'ui');
            const allDynamicMessageData = {};
            _.each(dataConstantForMessageList, (constItem) => {
                let rawdata = null;
                rawdata = jsonfile.readFileSync(constItem.UPLOAD_PATH);
                allDynamicMessageData[constItem.NAME] = rawdata ? rawdata : null;
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dynamicMessageList: allDynamicMessageData }, null);
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });// new NotFound(MESSAGE_CONSTANT.NOT_FOUND(dynamicMessageModuleName))
        }
    },
    // API: bind all category files messages while login or on page load
    getAllCategoryDynamicMessages: (req, res) => {
        try {
            const dataConstantFolderPath = process.cwd() + COMMON.DYNAMIC_MESSAGE_CONFIGURATION.UPLOAD_FOLDER_PATH;
            const allDynamicMessageData = {};
            let fileName = '';
            let rawdata = null;
            return fs.readdir(dataConstantFolderPath, (err, files) => {
                files.forEach((file) => {
                    rawdata = '';
                    fileName = file.substr(0, file.indexOf('.'));
                    if (file.indexOf('.json') > 0) {
                        rawdata = jsonfile.readFileSync(dataConstantFolderPath + file);
                        allDynamicMessageData[fileName] = (rawdata || {});
                    }
                });
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });//
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dynamicMessageList: allDynamicMessageData }, null);
            });
            /*    let rawdata = null;
                rawdata =jsonfile.readFileSync(constItem.UPLOAD_PATH);
                allDynamicMessageData[constItem.NAME] = rawdata ? rawdata : null;
            */
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }); // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(dynamicMessageModuleName))
        }
    },

    // API: get default message from json file for selected key
    getDefaultMessageByKeyAndModuelName: (req, res) => {
        try {
            if (req.body.objMessageData.key && req.body.objMessageData.moduleName) {
                const dataConstantForMessageList = DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.MESSAGE_ACCESS_DATA;

                const dataConstantForMessage = _.find(dataConstantForMessageList, item => req.body.objMessageData.moduleName === item.MODULE_NAME);
                if (!dataConstantForMessage) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }

                const fileName = dataConstantForMessage.DEFAULT_PATH;
                const rawdata = jsonfile.readFileSync(fileName);

                const obj = {
                    key: req.body.objMessageData.key
                };

                /* Check message key available in json file and get that object */
                const matchingObjFromJson = module.exports.getDefaultValueMatchingObject(rawdata, obj);

                if (!matchingObjFromJson) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(dynamicMessageModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, matchingObjFromJson, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: err, data: null });
        }
    },

    // API: retrive emp timeline dynamic messages from json constant to display in table.
    getEmpTimelineDynamicMessage: (req, res) => {
        try {
            let dataConstantForMessageList = DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.MESSAGE_ACCESS_DATA;
            dataConstantForMessageList = _.filter(dataConstantForMessageList, msgItem => msgItem.USED_AT === 'emp_timeline');
            const allDynamicMessageData = [];

            _.each(dataConstantForMessageList, (constItem) => {
                let rawdata = null;
                rawdata = jsonfile.readFileSync(constItem.UPLOAD_PATH);
                if (rawdata) {
                    _.each(rawdata, (primaryval, primarykey) => {
                        if (_.isObject(primaryval)) {
                            if (primaryval.title && primaryval.description) { /* for direct primary level obj */
                                const obj = {};
                                obj['key'] = primarykey;
                                obj['title'] = primaryval.title;
                                obj['description'] = primaryval.description;
                                // _obj["moduleName"] = constItem.MODULE_NAME;
                                obj['primarykey'] = primarykey;
                                obj['firstLevelPrimarykey'] = null;
                                allDynamicMessageData.push(obj);
                            } else {
                                _.each(primaryval, (innerObj, innerObjKey) => {
                                    if (_.isObject(innerObj) && innerObj.title && innerObj.description) { /* for 1st level obj */
                                        const obj = {};
                                        obj['key'] = innerObjKey;
                                        obj['title'] = innerObj.title;
                                        obj['description'] = innerObj.description;
                                        // _obj["moduleName"] = constItem.MODULE_NAME;
                                        obj['primarykey'] = primarykey;
                                        obj['firstLevelPrimarykey'] = null;
                                        allDynamicMessageData.push(obj);
                                    } else {
                                        _.each(innerObj, (innerObjdataval, innerObjdataKey) => { /* for 2nd level obj */
                                            if (_.isObject(innerObjdataval) && innerObjdataval.title && innerObjdataval.description) {
                                                const obj = {};
                                                obj['key'] = innerObjdataKey;
                                                obj['title'] = innerObjdataval.title;
                                                obj['description'] = innerObjdataval.description;
                                                // _obj["moduleName"] = constItem.MODULE_NAME;
                                                obj['primarykey'] = primarykey;
                                                obj['firstLevelPrimarykey'] = innerObjKey;
                                                allDynamicMessageData.push(obj);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { empTimelineDynamicMessageList: allDynamicMessageData }, null);
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }); // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(empTimelineMessageModuleName))
        }
    },

    // API: get default message from emp_timeline json file for selected key
    getDefaultMessageForEmpTimelineMessage: (req, res) => {
        try {
            if (req.body.objMessageData.key && req.body.objMessageData.primarykey) {
                const dataConstantForMessageList = DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.MESSAGE_ACCESS_DATA;

                const dataConstantForMessage = _.find(dataConstantForMessageList, item => DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.MODULE_NAMES.EMPLOYEE_TIMELINE === item.MODULE_NAME);
                if (!dataConstantForMessage) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }

                const fileName = dataConstantForMessage.DEFAULT_PATH;
                const rawdata = jsonfile.readFileSync(fileName);


                let isDefaultMsgFound = false;
                let matchingObjFromJson = null;
                /* Check message key available in json file and get that object */
                matchingObjFromJson = rawdata[req.body.objMessageData.primarykey];
                if (matchingObjFromJson && matchingObjFromJson.title && matchingObjFromJson.description) {
                    isDefaultMsgFound = true;
                } else {
                    matchingObjFromJson = null;
                    if (req.body.objMessageData.firstLevelPrimarykey) {
                        matchingObjFromJson = rawdata[req.body.objMessageData.primarykey][req.body.objMessageData.firstLevelPrimarykey][req.body.objMessageData.key];
                    } else {
                        matchingObjFromJson = rawdata[req.body.objMessageData.primarykey][req.body.objMessageData.key];
                    }
                    if (matchingObjFromJson && matchingObjFromJson.title && matchingObjFromJson.description) {
                        isDefaultMsgFound = true;
                    }
                    // else{
                    //    matchingObjFromJson = module.exports.getDefaultValueMatchingObject(primarykeyObjRawData,obj);
                    // }
                }

                if (!isDefaultMsgFound) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(empTimelineMessageModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, matchingObjFromJson, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },

    // API: update employee time line dynamic message constant object
    updateEmpTimelineDynamicMessage: (req, res) => {
        try {
            if (req.body.primarykey && req.body.key && req.body.keyValueList && req.body.keyValueList.length > 0) {
                const dataConstantForMessageList = DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.MESSAGE_ACCESS_DATA;
                const dataConstantForMessage = _.find(dataConstantForMessageList, item => DATA_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.MODULE_NAMES.EMPLOYEE_TIMELINE === item.MODULE_NAME);
                if (!dataConstantForMessage) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }

                const fileName = dataConstantForMessage.UPLOAD_PATH;
                const rawdata = jsonfile.readFileSync(fileName);

                let isBackUpMessageFileTaken = false;
                // eslint-disable-next-line consistent-return
                _.each(req.body.keyValueList, (keyvalueitem) => {
                    const obj = {
                        key: keyvalueitem.key,
                        value: keyvalueitem.newTitle,
                        oldValue: keyvalueitem.oldTitle
                    };

                    /* Check message key available in json file and get that object */
                    const matchingObjFromJson = module.exports.getKeyValueMatchingObject(rawdata[req.body.primarykey], obj);

                    if (!matchingObjFromJson) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(empTimelineMessageModuleName), err: null, data: null }); // new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(empTimelineMessageModuleName))
                    }

                    // /* Check same new message already exists to other key on same level */
                    // _.each(rawdata[req.body.primarykey], (item)=> {
                    //    let isUpdatingMessageAlreadyExists= _.some(item, function (val, key) {
                    //        return key != obj.key && val == obj.value;
                    //    });
                    //    if(isUpdatingMessageAlreadyExists){
                    //        return resHandler.errorRes(res, 200, STATE.FAILED, new NotCreate(MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.DYNAMIC_MESSAGE_UNIQUE));
                    //    }
                    // })

                    /* Copy old data to new backup file and then update original file */
                    if (!isBackUpMessageFileTaken) {
                        if (!fs.existsSync(dataConstantForMessage.BACKUP_FILE_UPLOAD_PATH)) {
                            fs.mkdirSync(dataConstantForMessage.BACKUP_FILE_UPLOAD_PATH);
                        }
                        const currDateTime = moment(new Date()).format(COMMON.TIMESTAMP_FORMAT_FOR_APPEND_UNIQUE.toUpperCase()).replace(/:/g, '-').replace(' ', '_')
                            .replace('.', '-');
                        const copyFileTo = `${dataConstantForMessage.BACKUP_FILE_UPLOAD_PATH + dataConstantForMessage.BACKUP_FILE_NAME}_${currDateTime.toString()}.json`;
                        fs.copyFileSync(fileName, copyFileTo, 'a+');
                        isBackUpMessageFileTaken = true;
                    }


                    /* update record to original file */
                    matchingObjFromJson[obj.key] = obj.value;
                    jsonfile.writeFileSync(fileName, rawdata);

                    /* update message to DATA_CONSTANT object of api project if any */

                    /* Check message key available and get that object from DATA_CONSTANT */
                    const matchingObjFromMsgConst = module.exports.getKeyValueMatchingObject(DATA_CONSTANT.TIMLINE[req.body.primarykey], obj);
                    if (!matchingObjFromMsgConst) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(empTimelineMessageModuleName), err: null, data: null });// new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(empTimelineMessageModuleName))
                    }

                    // /* Check same new message already exists to other key on same level */
                    // let isUpdatingMsgAlreadyExistsForMsgConst= _.some(matchingObjFromMsgConst, function (val, key) {
                    //    return key != obj.key && val == obj.value;
                    // });
                    // if(isUpdatingMsgAlreadyExistsForMsgConst){
                    //    return resHandler.errorRes(res, 200, STATE.FAILED, new NotCreate(MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONSTANT.DYNAMIC_MESSAGE_UNIQUE));
                    // }
                    matchingObjFromMsgConst[obj.key] = obj.value;
                });
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(empTimelineMessageModuleName));
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },

    getDynamicMessagesListDB: (req, res) => {
        var mongodb = global.mongodb;
        const filter = COMMON.UIGridMongoDBFilterSearch(req);
        filter.where = _.assign(filter.where, { isDeleted: { $in: [false, null] } });
        const model = {
            filter: filter,
            mongodb: mongodb
        };
        req.query.model = model;

        const options = {
            skip: req.query.model.filter.offset,
            sort: {},
            limit: req.query.model.filter.limit
        };

        let order = null;

        if (req.query.model.filter.order) {
            order = req.query.model.filter.order[0];
        }
        if (order) {
            options.sort[order[0]] = order[1] === 'asc' ? 1 : -1;
        } else {
            options.sort['messageCode'] = 1;
        }

        if (req) {
            const promises = [
                mongodb.collection('dynamic_messages').find(req.query.model.filter.where, options).toArray(),
                mongodb.collection('dynamic_messages').find(req.query.model.filter.where).count()
            ];
            return Promise.all(promises).then((result) => {
                if (result.length > 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        dynamicMessageList: result[0],
                        dynamicMessageCount: result[1]
                    }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null }); }
    },

    getDynamiceMessageDB: (req, res) => {
        var mongodb = global.mongodb;

        if (req && req.params.ObjId) {
            const ObjId = new bson.ObjectId(req.params.ObjId);
            const promises = [
                mongodb.collection('dynamic_messages').findOne({ _id: ObjId, isDeleted: { $in: [false, null] } })
            ];
            return Promise.all(promises).then((result) => {
                if (result.length > 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dynamicMessage: result[0] }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null }); }
    },

    updateDynamicMessageDB: (req, res) => {
        var mongodb = global.mongodb;
        var newData = {};
        var oldData = {};
        var query = {};
        var newvalues = {};
        // var modifiedBy = "";
        var ObjId = '';
        if (req && req.body) {
            ObjId = new bson.ObjectId(req.body._id);
            newData = req.body;
            newData.previousVersion = [];
            // first find old data based on messageCode
            query = {
                _id: ObjId // messageCode: newData.messageCode
            };
            // eslint-disable-next-line consistent-return
            return mongodb.collection('dynamic_messages').findOne(query).then((result) => {
                if (result && result._id) {
                    oldData = Object.assign({}, result);//  angular.copy(result);
                    if (oldData) {
                        newData.versionNumber = parseInt(oldData.versionNumber || 0) + 1;
                        newData.previousVersion = oldData.previousVersion;
                        delete oldData['previousVersion'];

                        if (newData.previousVersion) {
                            newData.previousVersion.push(oldData);
                        }
                    } else { newData.versionNumber = 0; }
                    newvalues = {
                        $set: {
                            messageCode: newData.messageCode,
                            messageType: newData.messageType,
                            messageKey: newData.messageKey,
                            category: newData.category,
                            message: newData.message,
                            versionNumber: newData.versionNumber,
                            modifiedDate: new Date(COMMON.getCurrentUTC()),
                            modifiedBy: req.user.id,
                            modifiedByName: req.user.username, // req.user.id
                            modifiedByRoleId: req.user.defaultLoginRoleID,
                            previousVersion: newData.previousVersion
                        }
                    };
                    return mongodb.collection('dynamic_messages').updateOne(query, newvalues).then((updateResult) => {
                        if (updateResult) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(dynamicMessageConfigName));
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });// new NotFound(MESSAGE_CONSTANT.NOT_FOUND(apiVerificationError))
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }); // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(apiVerificationError))
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    getMessageHistoryByKey: (req, res) => {
        var mongodb = global.mongodb;
        var ObjId = '';
        var options = {
            skip: 0,
            sort: {},
            limit: 1000
        };
        var order = null;

        if (order) {
            options.sort[order[0]] = order[1] === 'asc' ? 1 : -1;
        } else { options.sort['versionNumber'] = -1; }

        if (req && req.params.ObjId) {
            ObjId = new bson.ObjectId(req.params.ObjId);
            return mongodb.collection('dynamic_messages').aggregate([
                { $match: { _id: ObjId } },
                { $unwind: '$previousVersion' },
                { $project: { _id: 1, previousVersion: 1 } },
                { $sort: { 'previousVersion.versionNumber': -1 } }
            ]).toArray().then((result) => {
                if (result) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        dynamicMessageHistory: result,
                        dynamicMessageCount: result.length
                    }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
            })
                .catch((err) => {
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    generateJSonFromMongoDB:async (req, res) => {
        if (req) {
            let rawdata = {};
            const mongodb = global.mongodb;
            let filePath = '';
            let fileName = '';
            let promises = [];
            let backupRes;
            try {
                const dataConstantForMessage = COMMON.DYNAMIC_MESSAGE_CONFIGURATION;

                if (!dataConstantForMessage) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }
                filePath = process.cwd() + dataConstantForMessage.UPLOAD_FOLDER_PATH;

                /* copy old files*/
                let continueGeneration = false;
                if (configData.generateJSONBackup) {
                    backupRes = await module.exports.generateBackupJSON();
                } else {
                    continueGeneration = true;
                }
                continueGeneration = configData.generateJSONBackup ? backupRes && backupRes.state && backupRes.state === STATE.SUCCESS : continueGeneration;
                promises = [];
                 if (continueGeneration) {
                    //  Read data from mongoDB
                    return mongodb.collection('dynamic_messages').find({ isDeleted: { $in: [false, null] } }).toArray().then((result) => {
                        if (result) {
                            _.each(COMMON.DYNAMIC_MESSAGE_CATEGORY, (item) => {
                                if (item) {
                                    fileName = `${filePath + item}.json`;
                                    // change file from read only mode to writable
                                    promises.push(fs.chmodSync(fileName, 666), (errChange) => {
                                        if (errChange) { throw errChange; }
                                    });
                                }
                            });
                            Promise.all(promises).then(() => {
                                promises = [];
                                _.each(COMMON.DYNAMIC_MESSAGE_CATEGORY, (item) => {
                                    rawdata = {};
                                    if (item) {
                                        fileName = `${filePath + item}.json`;
                                        const messageList = _.filter(result, { category: item });
                                        messageList.forEach((element) => {
                                            if (element) {
                                                rawdata[element.messageKey] = {
                                                    messageCode: element.messageCode,
                                                    message: element.message,
                                                    messageType: element.messageType
                                                };
                                            } else { console.error('End of read data'); }
                                        });
                                        promises.push(jsonfile.writeFileSync(fileName, rawdata, (err) => {
                                            if (err) { throw err; }
                                        })
                                        );
                                    }
                                });
                                try {
                                    return Promise.all(promises).then(() => {
                                        _.each(COMMON.DYNAMIC_MESSAGE_CATEGORY, (item) => {
                                            const allAPIConstantMessages = jsonfile.readFileSync(`${filePath + item}.json`);
                                            MESSAGE_CONSTANT[item] = Object.assign(MESSAGE_CONSTANT[item] || {}, allAPIConstantMessages);
                                        });
                                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.GENERATED);
                                        messageContent.message = COMMON.stringFormat(messageContent.message, dynamicMessageConfigName);
                                        if (req.query && req.query.callFromDbScript === 'true') {
                                            messageContent.displayDialog = true;
                                        }
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
                                    });
                                } catch (error) {
                                    console.trace();
                                    console.error(error);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
                                }
                            });
                        }
                    })
                        .catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    // ** ********************
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: backupRes, data: null });
                }
                // return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            } catch (error) {
                console.trace();
                console.error(error);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }, /* end of generateJSonFromMongoDB */


    generateBackupJSON: () => {
        var dynamicMessageConfiguration = COMMON.DYNAMIC_MESSAGE_CONFIGURATION;
        var folder = process.cwd() + dynamicMessageConfiguration.UPLOAD_FOLDER_PATH;
        var currDateTime = moment(new Date()).format(COMMON.TIMESTAMP_FORMAT_FOR_APPEND_UNIQUE.toUpperCase()).replace(/:/g, '-').replace(' ', '_')
            .replace('.', '-');
        var backupPath = process.cwd() + dynamicMessageConfiguration.BACKUP_FOLDER_UPLOAD_PATH + dynamicMessageConfiguration.BACKUP_FOLDER + currDateTime;
        var copyFileTo = '';

        if (!dynamicMessageConfiguration) {
            return { status: DATA_CONSTANT.API_RESPONSE_CODE.ERROR, state: STATE.FAILED, message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER.message };
        }
        /* Check Back Up file path */

        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath);
            backupPath += '/';
        }
        try {
            fs.readdir(folder, (errFolder, files) => {
                files.forEach((file) => {
                    const fileName = file.substring(0, file.indexOf('.'));
                    if (file.indexOf('.json') > 0) {
                        copyFileTo = `${backupPath + fileName}.json`;
                        try {
                            fs.copyFileSync(folder + file, copyFileTo);
                        } catch (error) {
                            return { status: DATA_CONSTANT.API_RESPONSE_CODE.ERROR, state: STATE.FAILED, message: error };
                        }
                    }
                });
                if (errFolder) {
                    return { status: DATA_CONSTANT.API_RESPONSE_CODE.ERROR, state: STATE.FAILED, message: errFolder };
                }
            });
            return { status: DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, state: STATE.SUCCESS };
        } catch (error) {
            return { status: DATA_CONSTANT.API_RESPONSE_CODE.ERROR, state: STATE.FAILED, message: error };
        }
    },

    getWhereUsedListByMessageId: (req, res) => {
        var mongodb = global.mongodb;
        const filter = COMMON.UIGridMongoDBFilterSearch(req);
        let messageId = '';
        filter.where = _.assign(filter.where, { isDeleted: { $in: [false, null] } });
        const model = {
            filter: filter,
            mongodb: mongodb
        };
        req.query.model = model;
        const options = {
            skip: req.query.model.filter.offset,
            sort: {},
            limit: req.query.model.filter.limit
        };

        let order = null;
        if (req.query.model.filter.order) {
            order = req.query.model.filter.order[0];
        }
        if (order) {
            options.sort[order[0]] = order[1] === 'asc' ? 1 : -1;
        }

        if (req && req.query.ObjId) {
            messageId = new bson.ObjectId(req.query.ObjId);
            filter.where = _.assign(filter.where, { message_Id: messageId });
            return mongodb.collection('message_usage').find(req.query.model.filter.where, options).toArray().then((result) => {
                if (result) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        messageUsageList: result,
                        messageUsageCount: result.length
                    }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
            })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null }); }
    },

    getWhereUsedListByKey: (req, res) => {
        var mongodb = global.mongodb;
        var ObjId = '';
        if (req && req.query.message_Id) {
            ObjId = new bson.ObjectId(req.query.message_Id);
            const query = {
                message_Id: ObjId,
                pageId: parseInt(req.query.pageId),
                isDeleted: { $in: [false, null] }
            };

            return mongodb.collection('message_usage').findOne(query).then((result) => {
                if (result) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { messageUsageData: result }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
            }).catch((err) => {
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    updateWhereUsedData: (req, res) => {
        var mongodb = global.mongodb;
        var messageId = '';
        if (req && req.body) {
            let newvalues = {};
            const newData = req.body;
            let messageContent = '';
            let query = { _id: new bson.ObjectId(newData._id) };
            // check by ID
            return mongodb.collection('message_usage').find(query).toArray().then((resultId) => {
                if (resultId && resultId.length !== 0) {
                    messageId = new bson.ObjectId(newData.messageId);
                    query = {
                        message_Id: messageId,
                        pageId: newData.pageId,
                        isDeleted: { $in: [false, null] },
                        _id: { $ne: new bson.ObjectId(newData._id) }
                    };
                    // check  for unique combination then updae
                    return mongodb.collection('message_usage').find(query).toArray().then((resultUnique) => {
                        if (resultUnique && resultUnique.length === 0) {
                            query = { _id: new bson.ObjectId(newData._id) };
                            newvalues = {
                                $set: {
                                    message_Id: messageId,
                                    pageId: newData.pageId,
                                    description: newData.description,
                                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                                    modifiedBy: req.user.id,
                                    modifiedByName: req.user.username,
                                    modifiedByRoleId: req.user.defaultLoginRoleID
                                }
                            };
                            return mongodb.collection('message_usage').updateOne(query, newvalues).then((result) => {
                                if (result) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(messageUsageName) }, null);
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                }
                            });
                        } else { // Combination already exists in other than current record.
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.WHEREUSED_PAGE_UNIQUE);
                            messageContent.message = COMMON.stringFormat(messageContent.message, newData.messageCode, newData.pageName);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });// "Page entry for message code[" + newData.messageCode + "] does not exists." }, null);
                        }
                    });
                } else { // data not found
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.WHEREUSED_PAGE_NOTFOUND);
                    messageContent = COMMON.stringFormat(messageContent.message, newData.messageCode, newData.pageName);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });// "Page entry for message code[" + newData.messageCode + "] does not exists." }, null);
                }
            })
                .catch((err) => {
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    addWhereUsedData: (req, res) => {
        var mongodb = global.mongodb;
        var messageContent = {};
        let messageId = '';
        if (req && req.body) {
            // var data = req.body;
            const newData = {};
            let query = '';
            if (req.body._id) {
                req.body._id = '';
            }
            messageId = new bson.ObjectId(req.body.message_Id);
            query = {
                message_Id: messageId,
                pageId: req.body.pageId,
                isDeleted: { $in: [false, null] }
            };

            return mongodb.collection('message_usage').find(query).count().then((result) => {
                if (result && result > 0) {
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.WHEREUSED_PAGE_UNIQUE);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.messageCode, req.body.pageName);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });// "Page entry for  message code[" + newData.messageCode + "] already exists." }, null);
                } else {
                    try {
                        newData['_id'] = new (bson.ObjectID)();
                        newData.message_Id = messageId;
                        newData.pageId = req.body.pageId;
                        newData.description = req.body.description;
                        newData.createdBy = req.user.id;
                        newData.createdByName = req.user.username;
                        newData.createdDate = new Date(COMMON.getCurrentUTC());
                        newData.createdByRoleId = req.user.defaultLoginRoleID;
                        newData.modifiedBy = null;
                        newData.modifiedByName = null;
                        newData.modifiedDate = null;
                        newData.modifiedByRoleId = null;
                        newData.deletedBy = null;
                        newData.deletedByName = null;
                        newData.deletedDate = null;
                        newData.deletedByRoleId = null;
                        newData.isDeleted = false;

                        return mongodb.collection('message_usage').insertOne(newData).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(messageUsageName)));
                    } catch (error) {
                        console.trace();
                        console.error(error);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    deleteWhereUsedData: (req, res) => {
        var mongodb = global.mongodb;

        if (req && req.body) {
            let newvalues = {};
            const newData = [];
            // generate bson object id in case of multi selected id.
            _.each(req.body.objIDs.id, (element) => {
                newData.push(new bson.ObjectID(element));
            });
            const query = { _id: { $in: newData } };

            return mongodb.collection('message_usage').find(query).toArray().then((result) => {
                if (result && result.length > 0) {
                    newvalues = {
                        $set: {
                            modifiedDate: new Date(COMMON.getCurrentUTC()),
                            modifiedBy: req.user.id,
                            modifiedByName: req.user.username,
                            modifiedByRoleId: req.user.defaultLoginRoleID,

                            isDeleted: true,
                            deletedDate: new Date(COMMON.getCurrentUTC()),
                            deletedBy: req.user.id,
                            deletedByName: req.user.username,
                            deletedByRoleId: req.user.defaultLoginRoleID
                        }
                    };
                    return mongodb.collection('message_usage').updateMany(query, newvalues).then((updateResult) => {
                        if (updateResult) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(messageUsageName));
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                        }
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }
            })
                .catch((err) => {
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    checkDBStatus: (req, res) => {
        try {
            const { Settings } = req.app.locals.models;
            const mongodb = global.mongodb;
            return Settings.findOne().then(() => {
                mongodb.collection('dynamic_messages').findOne().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, 'Mysql and MongoDB service working fine!')).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, 'Mysql and/or MongoDB service not working fine!');
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, 'Mysql and/or MongoDB service not working fine!');
            });
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, 'Mysql and/or MongoDB service not working fine!');
        }
    }

};