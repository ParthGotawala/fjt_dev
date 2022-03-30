const router = require('express').Router(); // eslint-disable-line
const WorkorderTransDataelementValues = require('../controllers/Workorder_Trans_Dataelement_ValuesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/downloadWoTransElementTransactionDocument/:woTransDataElementID')
        .get(WorkorderTransDataelementValues.downloadWoTransElementTransactionDocument);

    router.route('/')
        .post(WorkorderTransDataelementValues.createWoTransDataElementValues);

    router.route('/:woTransID/:woOPID/:entityID')
        .get(WorkorderTransDataelementValues.retrive_WoTrans_DataElement_Values);

    router.route('/retrieveWorkorderOperationEquipmentDataElementList')
        .post(WorkorderTransDataelementValues.retrieveWorkorderOperationEquipmentDataElementList);

    router.route('/getWoTransactionDataElementValuesList')
        .post(WorkorderTransDataelementValues.getWoTransactionDataElementValuesList);

    router.route('/getWoOpAllTransDataElementValuesList')
        .get(WorkorderTransDataelementValues.getWoOpAllTransDataElementValuesList);

    router.route('/downloadWoTransDataElementFileByRefID')
        .post(WorkorderTransDataelementValues.downloadWoTransDataElementFileByRefID);

    app.use(
        '/api/v1/workorder_trans_dataelement_values',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );

    /*  app.get('/api/v1/downloadWoTransElementTransactionDocument/:woTransDataElementID',
              validateToken,
 
              jwtErrorHandler,
              populateUser,
              Workorder_Trans_Dataelement_Values.downloadWoTransElementTransactionDocument); */

    // router.route('/download/:woTransDataElementID')
    // .get(Workorder_Trans_Dataelement_Values.downloadWoTransElementTransactionDocument);
};
