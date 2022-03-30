const router = require('express').Router();

const ComponentSidStockDataElementController = require('../controllers/Component_Sid_Stock_DataElementController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    router.route('/deleteComponentSidStockDataElement')
        .post(ComponentSidStockDataElementController.deleteComponentSidStockDataElement);

    router.route('/')
        .post(ComponentSidStockDataElementController.retrieveComponentSidStockDataelementValues);

    app.use(
        '/api/v1/componentsidstockdataelement',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};

