const router = require('express').Router();

const genericFile = require('../controllers/GenericFilesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/setAsShared/:gencFileID')
        .get(genericFile.setAsShared);

    router.route('/uploaChunkGenericFiles')
        .post(genericFile.uploaChunkGenericFiles);

    router.route('/updateGenericFiles')
        .post(genericFile.updateGenericFiles);

    // router.route('/downloadGenericFile/:gencFileID/:eventAction')
    //        .get(genericFile.downloadGenericFile);

    router.route('/downloadGenericFile')
        .post(genericFile.downloadGenericFile);

    router.route('/downloadGenericFileAsZip')
        .post(genericFile.downloadGenericFileAsZip);

    router.route('/uploadGenericFiles')
        .post(genericFile.uploadGenericFiles);

    // router.route('/removeGenericFile/:gencFileID')
    //      .delete(genericFile.removeGenericFile);

    router.route('/:refTransID/:gencFileOwnerType')
        .get(genericFile.retriveGenericFiles);

    router.route('/addTimelineLogForViewGenericFileOtherThanImage/:gencFileID/:eventAction')
        .get(genericFile.addTimelineLogForViewGenericFileOtherThanImage);

    router.route('/enableDisableGenericFile')
        .post(genericFile.enableDisableGenericFile);

    router.route('/updateGenericFileDetails')
        .post(genericFile.updateGenericFileDetails);

    router.route('/checkDuplicateGenericFiles')
        .post(genericFile.checkDuplicateGenericFiles);

    // router.route('/getSamplePictureList/:refTransID/:gencFileOwnerType/:entityId')
    //    .get(genericFile.getSamplePictureList);

    app.use(
        '/api/v1/genericFileList',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};