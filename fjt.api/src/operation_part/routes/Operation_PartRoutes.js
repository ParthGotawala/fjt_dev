const router = require('express').Router(); // eslint-disable-line
const OperationPart = require('../controllers/Operation_PartController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/deleteOperation_PartList')
        .delete(OperationPart.deleteOperation_PartList);

    /* retrive component with operation*/
    router.route('/retrievePartsForOpMaster/:opID')
        .get(OperationPart.retrievePartsForOpMaster);

    router.route('/retrieveOperationPartDetails')
        .post(OperationPart.retrieveOperationPartDetails);

    router.route('/createOperation_PartList')
        .post(OperationPart.createOperation_PartList);

    /* save,delete,update master template*/
    app.use(
        '/api/v1/Operation_Part',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );

    /*   app.delete('/api/v1/deleteOperation_PartList',
          validateToken,
 
          jwtErrorHandler,
          populateUser,
          Operation_Part.deleteOperation_PartList); */
};
