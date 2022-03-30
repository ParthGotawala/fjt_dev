const router = require('express').Router(); // eslint-disable-line
const workorderTransSerialno = require('../controllers/workorder_trans_serialnoController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/deleteWoTransSerialNo')
        .delete(workorderTransSerialno.deleteWoTransSerialNo);

    router.route('/')
        .post(workorderTransSerialno.generateTransSerialno);

    router.route('/retriveWoTransSerialno')
        .post(workorderTransSerialno.retriveWoTransSerialno);

    router.route('/:woTransID')
        .get(workorderTransSerialno.retriveWoTransSerialno);

    router.route('/getTransPrevOpPassedSerials')
        .post(workorderTransSerialno.getTransPrevOpPassedSerials);

    app.use(
        '/api/v1/generateWorkorder_trans_serialNo',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};