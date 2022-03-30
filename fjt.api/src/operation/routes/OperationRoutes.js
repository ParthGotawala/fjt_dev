const router = require('express').Router(); // eslint-disable-line
const mkdirp = require('mkdirp');
const multer = require('multer');
const operation = require('../controllers/OperationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');


const storage = multer.diskStorage({
    destination: (mulReq, file, cb) => {
        const dir = './uploads/operation/images';
        mkdirp(dir, err => cb(err, dir));
    },
    filename: (mulReq, file, cb) => {
        const datetimestamp = Date.now();
        cb(null, `${datetimestamp}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`);
    }
});

const upload = multer({
    storage
});


module.exports = (app) => {
    // /* delete file*/
    // router.route('/deleteFile/:id')
    // .delete(operation.deleteFile);

    // /* retrive files*/
    // router.route('/retriveFiles/:id')
    // .get(operation.retrieveFiles);

    router.route('/getOperationList')
        .get(operation.getOperationList);

    router.route('/retrieveOperationProfile/:id')
        .get(operation.retrieveOperationProfile);

    router.route('/')
        .post(upload.any(), operation.createOperation);

    router.route('/retriveOperationList')
        .post(operation.retriveOperationList);

    router.route('/retrievetemplateOperationDetails')
        .get(operation.retrievetemplateOperationDetails);

    router.route('/getAllOperationDetail')
        .get(operation.getAllOperationDetail);

    router.route('/:id/:isPermanentDelete?')
        .get(operation.retrieveOperation)
        .put(operation.updateOperation);

    router.route('/deleteOperation')
        .post(operation.deleteOperation);
    /* save,delete,update master template*/

    router.route('/checkDuplicateOpNumber')
        .post(operation.checkDuplicateOpNumber);

    router.route('/getAllPublishedOpMasterList')
        .post(operation.getAllPublishedOpMasterList);

     router.route('/retriveDraftOperationsByMasterTemplate')
         .post(operation.retriveDraftOperationsByMasterTemplate);

    app.use(
        '/api/v1/operation',
        validateToken,

        jwtErrorHandler,
        populateUser,
        // verifyActionPermission,
        router
    );

    /* pp.get(
        '/api/v1/getOperationList',
        validateToken,
 
        jwtErrorHandler,
        populateUser,
        //verifyActionPermission,
        operation.getOperationList
    );*/
};
