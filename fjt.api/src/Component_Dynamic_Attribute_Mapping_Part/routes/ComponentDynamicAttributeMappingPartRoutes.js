const router = require('express').Router();

const ComponentDynamicAttributeMappingPart = require('../controllers/ComponentDynamicAttributeMappingPartController');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');
const populateUser = require('../../auth/populateUser');

module.exports = (app) => {
    router.route('/')
        .get(ComponentDynamicAttributeMappingPart.getComponentAttributeMappingList)
        .post(ComponentDynamicAttributeMappingPart.createComponentAttributeMapping);

    router.route('/:id')
        .get(ComponentDynamicAttributeMappingPart.getComponentAttributeMappingList)
        .put(ComponentDynamicAttributeMappingPart.updateComponentAttributeMapping);

    router.route('/deleteComponentAttributeMapping')
        .post(ComponentDynamicAttributeMappingPart.deleteComponentAttributeMapping);

    app.use(
        '/api/v1/ComponentDynamicAttributeMappingPart',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};