const router = require('express').Router();
const ErrorLogs = require('../controllers/SupplierLimitsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .get(ErrorLogs.retriveSupplierLimits);

    app.use(
        '/api/v1/supplierLimits',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};
