const router = require('express').Router(); // eslint-disable-line
const DynamicMessageConstant = require('../controllers/DynamicMessageConstantController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
       router.route('/')
              .get(DynamicMessageConstant.retrieveDynamicMessageConstant);

       router.route('/')
              .put(DynamicMessageConstant.updateDynamicMessageConstant);

       router.route('/getEmpTimelineDynamicMessage')
              .get(DynamicMessageConstant.getEmpTimelineDynamicMessage);

       router.route('/getEmpTimelineDynamicMessage')
              .put(DynamicMessageConstant.updateEmpTimelineDynamicMessage);

       router.route('/getDefaultMessageByKeyAndModuelName')
              .post(DynamicMessageConstant.getDefaultMessageByKeyAndModuelName);

       router.route('/getDefaultMessageForEmpTimelineMessage')
              .post(DynamicMessageConstant.getDefaultMessageForEmpTimelineMessage);

       router.route('/getDynamicMessagesListDB')
              .get(DynamicMessageConstant.getDynamicMessagesListDB);

       router.route('/getDynamiceMessageDB/:ObjId')
              .get(DynamicMessageConstant.getDynamiceMessageDB);

       router.route('/updateDynamicMessageDB')
              .post(DynamicMessageConstant.updateDynamicMessageDB);

       router.route('/getMessageHistoryByKey/:ObjId')
              .get(DynamicMessageConstant.getMessageHistoryByKey);

       router.route('/generateJSonFromMongoDB')
              .get(DynamicMessageConstant.generateJSonFromMongoDB);

       router.route('/generateBackupJSON')
              .get(DynamicMessageConstant.generateBackupJSON);

       router.route('/getWhereUsedListByMessageId')
              .get(DynamicMessageConstant.getWhereUsedListByMessageId);

       router.route('/getWhereUsedListByKey')
              .get(DynamicMessageConstant.getWhereUsedListByKey);

       router.route('/addWhereUsedData')
              .post(DynamicMessageConstant.addWhereUsedData);

       router.route('/updateWhereUsedData')
              .post(DynamicMessageConstant.updateWhereUsedData);

       router.route('/deleteWhereUsedData')
              .post(DynamicMessageConstant.deleteWhereUsedData);


       app.use(
              '/api/v1/dynamicmessage',
              validateToken,

              jwtErrorHandler,
              populateUser,
              router
       );
};
