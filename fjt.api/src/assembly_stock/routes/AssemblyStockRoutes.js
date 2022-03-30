const router = require('express').Router();

const assemblyStock = require('../controllers/AssemblyStockController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/assemblyStockList')
        .post(assemblyStock.retriveAssemblyStockList);

    router.route('/')
        .get(assemblyStock.retriveAssemblyStock)
        .post(assemblyStock.createAssemblyStock);

    router.route('/:id')
        .get(assemblyStock.retriveAssemblyStock)
        .put(assemblyStock.updateAssemblyStock);

    router.route('/deleteAssemblyStock')
        .post(assemblyStock.deleteAssemblyStock);

    router.route('/getSameAssyStockWOEntryData')
        .post(assemblyStock.getSameAssyStockWOEntryData);

    app.use(
        '/api/v1/assemblyStocks',

        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};

