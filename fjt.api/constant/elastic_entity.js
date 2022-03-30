// eslint-disable-next-line import/newline-after-import
const { COMMON } = require('../src/constant');
let ELASTIC_ENTITY = {};

// eslint-disable-next-line import/no-dynamic-require
const allAPIConstantMessages = require(`${COMMON.ELASTIC_ENTITY_CONFIGURATION.DEFUALT_FOLDER_ENTITY_PATH}${COMMON.ELASTIC_ENTITY_CONFIGURATION.FILE_NAME}.json`);
ELASTIC_ENTITY = Object.assign({}, allAPIConstantMessages);

module.exports = ELASTIC_ENTITY;