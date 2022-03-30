const router = require('express').Router(); // eslint-disable-line
const ECORequestController = require('../controllers/ECORequestController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/generateDFMNumber')
        .get(ECORequestController.generateDFMNumber);

    router.route('/getImplementToWorkorderList')
        .get(ECORequestController.getImplementToWorkorderList);

    router.route('/getECOHeaderDetail/:partID/:requestType')
        .get(ECORequestController.getECOHeaderDetail);

    router.route('/getAllECODFMRequestNumber')
        .get(ECORequestController.getAllECODFMRequestNumber);

    router.route('/')
        .post(ECORequestController.saveECORequest);

    router.route('/retriveECORequestsList')
        .post(ECORequestController.retriveECORequestsList);

    router.route('/:ecoReqID')
        .get(ECORequestController.retriveECORequests)
        .delete(ECORequestController.deleteECORequest);

    app.use(
        '/api/v1/ecorequest',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
