const router = require('express').Router(); // eslint-disable-line
const ComponentMSLMst = require('../controllers/Component_MSLMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/getComponentMSLList')
        .get(ComponentMSLMst.getComponentMSLList);

    app.use(
        '/api/v1/componentMSL',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
