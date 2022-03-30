const router = require('express').Router();

const componentStandardDetailsController = require('../controllers/Component_Standard_DetailsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    router.route('/createComponentStandardDetail')
        .post(componentStandardDetailsController.createComponentStandardDetail);
    router.route('/getStandardDetail/:id')
        .get(componentStandardDetailsController.getStandardDetail);

    app.use(
        '/api/v1/componentStandardDetails',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
