const router = require('express').Router(); // eslint-disable-line
const WorkorderAssemblyExcessstockLocation = require('../controllers/Workorder_Assembly_Excessstock_LocationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getWOAssyExcessStockLocationList')
        .post(WorkorderAssemblyExcessstockLocation.getWOAssyExcessStockLocationList);

    /* Commented code as Not in Use. */
    // router.route('/getWOAssyExcessStockLocation/:id')
    //     .get(WorkorderAssemblyExcessstockLocation.getWOAssyExcessStockLocation);

    router.route('/getVUWorkorderReadyassyStk')
        .post(WorkorderAssemblyExcessstockLocation.getVUWorkorderReadyassyStk);

    router.route('/saveWOAssyExcessStockLocation')
        .post(WorkorderAssemblyExcessstockLocation.saveWOAssyExcessStockLocation);

    router.route('/deleteWOAssyExcessStockLocation')
        .post(WorkorderAssemblyExcessstockLocation.deleteWOAssyExcessStockLocation);


    app.use(
        '/api/v1/workorder_assembly_excessstock_location',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
