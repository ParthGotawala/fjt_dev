const router = require('express').Router(); // eslint-disable-line
const WorkorderTransEquipmentDataelementValues = require('../controllers/Workorder_Trans_Equipment_Dataelement_ValuesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/downloadWoTransEqpElementTransactionDocument/:woTransEqpDataElementID')
        .get(WorkorderTransEquipmentDataelementValues.downloadWoTransEqpElementTransactionDocument);

    router.route('/')
        .post(WorkorderTransEquipmentDataelementValues.createWoTransEquipmentDataElementValues);

    router.route('/:woTransID/:woOPID/:entityID/:eqpID')
        .get(WorkorderTransEquipmentDataelementValues.retrive_WoTrans_Equipment_DataElement_Values);

    router.route('/retrieveWorkorderOperationEquipmentDataElementList')
        .post(WorkorderTransEquipmentDataelementValues.retrieveWorkorderOperationEquipmentDataElementList);

    router.route('/getWoTransactionEquipmentDataElementValuesList')
        .post(WorkorderTransEquipmentDataelementValues.getWoTransactionEquipmentDataElementValuesList);

    router.route('/getWoOpEqpAllTransDataElementValuesList')
        .get(WorkorderTransEquipmentDataelementValues.getWoOpEqpAllTransDataElementValuesList);

    router.route('/downloadWoTransEqpDataElementFileByRefID')
        .post(WorkorderTransEquipmentDataelementValues.downloadWoTransEqpDataElementFileByRefID);

    app.use(
        '/api/v1/workorder_trans_equipment_dataelement_values',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );

    /*  app.get('/api/v1/downloadWoTransElementTransactionDocument/:woTransEqpDataElementID',
              validateToken,
 
              jwtErrorHandler,
              populateUser,
              WorkorderTransEquipmentDataelementValues.downloadWoTransElementTransactionDocument);
  */

    // router.route('/download/:woTransEqpDataElementID')
    // .get(WorkorderTransEquipmentDataelementValues.downloadWoTransEqpElementTransactionDocument);
};
