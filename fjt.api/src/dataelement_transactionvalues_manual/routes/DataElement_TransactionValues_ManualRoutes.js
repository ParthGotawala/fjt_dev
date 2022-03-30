const router = require('express').Router(); // eslint-disable-line
const DataElementTransactionValuesManualController = require('../controllers/DataElement_TransactionValues_ManualController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/downloadCustomFormDataElementDocument/:dataElementTransID')
        .get(DataElementTransactionValuesManualController.downloadCustomFormDataElementDocument);

    router.route('/')
        .post(DataElementTransactionValuesManualController.createDataElement_TransactionValuesManual);

    router.route('/:refTransID/:entityID')
        .get(DataElementTransactionValuesManualController.retriveDataElement_TransactionValuesManual);

    router.route('/downloadCustomFormDataElementFileByRefID')
        .post(DataElementTransactionValuesManualController.downloadCustomFormDataElementFileByRefID);

    // .delete(DataElementTransactionValuesManualController.deleteDataElement_TransactionValuesManual);

    // app.delete('/api/v1/deleteDataElementTransactionValuesManualInfo/:dataElementTransManualIDs/:entityName',
    //       validateToken,

    //       jwtErrorHandler,
    //       populateUser,
    //       DataElementTransactionValuesManualController.deleteDataElement_TransactionValuesManual);

    router.route('/deleteDataElement_TransactionValuesManual')
        .post(DataElementTransactionValuesManualController.deleteDataElement_TransactionValuesManual);

    // router.route('/:dataElementID')
    //  .get(DataElementTransactionValuesManualController.getDETransValuesManualByDataelementFields)

    router.route('/retrieveDataElement_TransValues_Manual_History')
        .get(DataElementTransactionValuesManualController.retrieveDataElement_TransValues_Manual_History);


    router.route('/getDataElement_TransactionValuesManualListByEntity')
        .post(DataElementTransactionValuesManualController.getDataElement_TransactionValuesManualListByEntity);

    app.use(
        '/api/v1/dataelement_transactionvalues_manual',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
