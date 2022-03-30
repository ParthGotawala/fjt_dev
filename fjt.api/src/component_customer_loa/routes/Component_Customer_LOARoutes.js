const router = require('express').Router();

const componentCustomerLOA = require('../controllers/Component_customer_LOAController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/getImoprtLOA')
        .post(componentCustomerLOA.getImoprtLOA);

    router.route('/getComponentLOAList')
        .post(componentCustomerLOA.getComponentLOA);

    router.route('/updateComponentCustomerLOAPrice')
        .post(componentCustomerLOA.updateComponentCustomerLOAPrice);

    router.route('/getComponentCustomer/:customerID')
        .get(componentCustomerLOA.getComponentCustomer);

    app.use(
        '/api/v1/componentcustomerloa',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
