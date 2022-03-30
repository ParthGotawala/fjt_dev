const router = require('express').Router(); // eslint-disable-line
const WorkorderBoxserialNoController = require('../controllers/Workorder_Box_SerialnoController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(WorkorderBoxserialNoController.saveBoxSerialNoList);
    router.route('/retriveBoxSerialNoList')
        .post(WorkorderBoxserialNoController.retriveBoxSerialNoList);
    router.route('/retriveBoxSerialNoById')
        .post(WorkorderBoxserialNoController.retriveBoxSerialNoById);
    router.route('/retriveBoxScanSerialNoList')
        .get(WorkorderBoxserialNoController.retriveBoxScanSerialNoList);
    router.route('/retriveBoxSerialNoHistory')
        .get(WorkorderBoxserialNoController.retriveBoxSerialNoHistory);
    router.route('/getAvailableQtyByStockIdOrWoID')
        .get(WorkorderBoxserialNoController.getAvailableQtyByStockIdOrWoID);
    router.route('/deleteBoxSerialNo')
        .post(WorkorderBoxserialNoController.deleteBoxSerialNo);
    router.route('/getAssemblyIDList')
        .post(WorkorderBoxserialNoController.getAssemblyIDList);
    router.route('/getWorkorderList')
        .post(WorkorderBoxserialNoController.getWorkorderList);
    router.route('/getPackageingMaterialPartList')
        .post(WorkorderBoxserialNoController.getPackageingMaterialPartList);
    router.route('/getSalesOrderWoIDwise')
        .post(WorkorderBoxserialNoController.getSalesOrderWoIDwise);

    router.route('/getValidateBoxSerialNumberDetails')
        .post(WorkorderBoxserialNoController.getValidateBoxSerialNumberDetails);
    router.route('/getValidateBoxSerialNumberDetailsList')
        .post(WorkorderBoxserialNoController.getValidateBoxSerialNumberDetailsList);
    router.route('/generateBoxSerialno')
        .post(WorkorderBoxserialNoController.generateBoxSerialno);
    router.route('/deleteTransBoxSerialNo')
        .post(WorkorderBoxserialNoController.deleteTransBoxSerialNo);
    router.route('/getBoxDetailByBoxID')
        .post(WorkorderBoxserialNoController.getBoxDetailByBoxID);
    router.route('/getScanBoxSerialNumberDetails')
        .post(WorkorderBoxserialNoController.getScanBoxSerialNumberDetails);
    router.route('/moveBoxSerialno')
        .post(WorkorderBoxserialNoController.moveBoxSerialno);

    app.use(
        '/api/v1/workorderBoxSerialno',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};