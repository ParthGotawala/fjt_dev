const router = require('express').Router(); // eslint-disable-line
const WorkorderTransFirstPcsDetController = require('../controllers/Workorder_Trans_FirstPcsDetController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveWorkorderTransFirstpcsDetails')
        .post(WorkorderTransFirstPcsDetController.saveWorkorderTransFirstpcsDetails);

    router.route('/deleteWorkorderTransFirstpcsdet')
        .post(WorkorderTransFirstPcsDetController.deleteWorkorderTransFirstpcsdet);

    router.route('/getWOTransFirstpcsSerialsDet')
        .post(WorkorderTransFirstPcsDetController.getWOTransFirstpcsSerialsDet);


    app.use(
        '/api/v1/workorder_trans_firstpcsdet',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
