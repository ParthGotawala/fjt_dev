const router = require('express').Router();
const ServiceController = require('../controllers/Service_StatusController');

module.exports = (app) => {
    app.post('/api/v1/servicestatus/getServiceStatus',
        ServiceController.getServiceStatus);
    app.post('/api/v1/servicestatus/manageServices',
        ServiceController.manageServices);

        app.use(
            '/api/v1/servicestatus',
            router
        );
};
