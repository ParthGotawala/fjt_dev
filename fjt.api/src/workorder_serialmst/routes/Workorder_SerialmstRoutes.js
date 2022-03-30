const router = require('express').Router(); // eslint-disable-line
const WorkorderSerialmst = require('../controllers/Workorder_SerialmstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/getWorkorderSerialsForFinalProduct/:woID')
        .get(WorkorderSerialmst.getWorkorderSerialsForFinalProduct);

    router.route('/getAllWorkorderSerialsByWoID/:woID')
        .get(WorkorderSerialmst.getAllWorkorderSerialsByWoID);

    router.route('/getValidateSerialNumberDetails/:woID/:serialNo')
        .get(WorkorderSerialmst.getValidateSerialNumberDetails);

    router.route('/getValidateSerialNumberDetailsList')
        .get(WorkorderSerialmst.getValidateSerialNumberDetailsList);

    router.route('/getSerialNumberTransHistory')
        .post(WorkorderSerialmst.getSerialNumberTransHistory);

    router.route('/getSerialNumberDetailsByTransID')
        .post(WorkorderSerialmst.getSerialNumberDetailsByTransID);

    router.route('/')
        .post(WorkorderSerialmst.createWorkorderSerial);

    router.route('/retriveWorkorderSerialsList')
        .post(WorkorderSerialmst.retriveWorkorderSerials);

    router.route('/:woID/:serialType')
        .delete(WorkorderSerialmst.deleteWorkorderSerials);

    router.route('/mapProdSerial/retrieveAllMappedFinalProductSerialsList')
        .post(WorkorderSerialmst.retrieveAllMappedFinalProductSerials);

    router.route('/mapProdSerial/checkMFGSerialValid')
        .post(WorkorderSerialmst.checkMFGSerialValid);

    router.route('/mapProdSerial/saveProductSerialMapping')
        .post(WorkorderSerialmst.saveProductSerialMapping);

    router.route('/mapProdSerial/deleteProductSerialMapping')
        .post(WorkorderSerialmst.deleteProductSerialMapping);

    router.route('/checkMFGScanSerialValidForFirstArticle')
        .post(WorkorderSerialmst.checkMFGScanSerialValidForFirstArticle);


    app.use(
        '/api/v1/workorder_serialmst',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
