const router = require('express').Router(); // eslint-disable-line
const WorkorderOperationFirstPieceController = require('./../controllers/Workorder_Operation_FirstPieceController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        // .get(WorkorderOperationFirstPieceController.retriveWorkorderOperationFirstPieceByWoOp)
        .post(WorkorderOperationFirstPieceController.createWorkorderOperationFirstPieceSerial);

    router.route('/save_Workorder_Operation_Firstpiece')
        .post(WorkorderOperationFirstPieceController.save_Workorder_Operation_Firstpiece);

    router.route('/deleteWorkorderOperationFirstpiece')
        .delete(WorkorderOperationFirstPieceController.deleteWorkorderOperationFirstpiece);

    router.route('/retriveWorkorderOperationFirstPieceByWoOp')
        .post(WorkorderOperationFirstPieceController.retriveWorkorderOperationFirstPieceByWoOp);

    router.route('/getWOAllFirstPieceSerialsDet')
        .post(WorkorderOperationFirstPieceController.getWOAllFirstPieceSerialsDet);

    router.route('/checkScanSerialExistsOnPrevOPFirstArticle')
        .post(WorkorderOperationFirstPieceController.checkScanSerialExistsOnPrevOPFirstArticle);

    router.route('/saveWOOPFirstpieceSerialsPickFromPrevOP')
        .post(WorkorderOperationFirstPieceController.saveWOOPFirstpieceSerialsPickFromPrevOP);

    app.use(
        '/api/v1/workorder_operation_firstpiece',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
